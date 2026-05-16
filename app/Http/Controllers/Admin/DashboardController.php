<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Inventory;
use App\Models\InventoryChangeRequest;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(protected ActivityLogService $activityLogService)
    {
    }

    public function index()
    {
        $this->authorize('viewAny', Inventory::class);

        /* ── Stats ─────────────────────────────────────────── */
        $totalInventory  = Inventory::count();
        $totalValue      = Inventory::sum('total_value');
        $activeUsers     = User::where('is_active', true)->count();

        /* ── Alert counts ───────────────────────────────────── */
        $lowStockCount = Inventory::where('quantity', '>', 0)
            ->whereColumn('quantity', '<=', 'min_stock_level')
            ->count();

        $outOfStockCount = Inventory::where(function ($q) {
            $q->whereNull('quantity')->orWhere('quantity', '<=', 0);
        })->count();

        $overstockCount = 0;
        if (Schema::hasColumn('inventories', 'max_stock_level')) {
            $overstockCount = Inventory::whereNotNull('max_stock_level')
                ->whereColumn('quantity', '>=', 'max_stock_level')
                ->count();
        }

        $expiringSoonCount = 0;
        if (Schema::hasColumn('inventories', 'expiry_date')) {
            $expiringSoonCount = Inventory::whereNotNull('expiry_date')
                ->whereBetween('expiry_date', [now(), now()->addDays(30)])
                ->count();
        }

        /* ── Alert item lists (up to 20 each) ───────────────── */
        $alerts = [
            'low_stock' => Inventory::where('quantity', '>', 0)
                ->whereColumn('quantity', '<=', 'min_stock_level')
                ->select('id', 'name', 'quantity', 'min_stock_level')
                ->orderBy('quantity')
                ->limit(20)
                ->get(),

            'out_of_stock' => Inventory::where(function ($q) {
                $q->whereNull('quantity')->orWhere('quantity', '<=', 0);
            })
                ->select('id', 'name', 'quantity')
                ->orderBy('name')
                ->limit(20)
                ->get(),

            'overstock' => Schema::hasColumn('inventories', 'max_stock_level')
                ? Inventory::whereNotNull('max_stock_level')
                    ->whereColumn('quantity', '>=', 'max_stock_level')
                    ->select('id', 'name', 'quantity', 'max_stock_level')
                    ->orderByDesc('quantity')
                    ->limit(20)
                    ->get()
                : collect(),

            'expiring' => Schema::hasColumn('inventories', 'expiry_date')
                ? Inventory::whereNotNull('expiry_date')
                    ->whereBetween('expiry_date', [now(), now()->addDays(30)])
                    ->select('id', 'name', 'quantity', 'expiry_date')
                    ->orderBy('expiry_date')
                    ->limit(20)
                    ->get()
                : collect(),
        ];

        /* ── Stock chart (top 15 items by quantity) ─────────── */
        $stockChart = Inventory::select(
            'name',
            'quantity',
            'min_stock_level',
            ...Schema::hasColumn('inventories', 'max_stock_level') ? ['max_stock_level'] : []
        )
            ->orderByDesc('quantity')
            ->limit(15)
            ->get()
            ->map(fn($item) => [
                'name'      => $item->name,
                'quantity'  => (int) ($item->quantity ?? 0),
                'min_level' => (int) ($item->min_stock_level ?? 0),
                'max_level' => isset($item->max_stock_level) ? (int) $item->max_stock_level : null,
            ]);

        /* ── Pending change requests ─────────────────────────── */
        $pendingChangeRequests = InventoryChangeRequest::with(['inventory:id,name,sku', 'requester:id,name'])
            ->pending()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $pendingChangeRequestsCount = InventoryChangeRequest::pending()->count();

        /* ── Recent activity ────────────────────────────────── */
        $recentActivity = ActivityLog::with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'total_inventory'          => $totalInventory,
                'low_stock'                => $lowStockCount,
                'out_of_stock'             => $outOfStockCount,
                'overstock'                => $overstockCount,
                'expiring_soon'            => $expiringSoonCount,
                'total_value'              => $totalValue,
                'active_users'             => $activeUsers,
                'pending_change_requests'  => $pendingChangeRequestsCount,
            ],
            'alerts'                  => $alerts,
            'stock_chart'             => $stockChart,
            'pending_change_requests' => $pendingChangeRequests,
            'recent_activity'         => $recentActivity,
        ]);
    }
}