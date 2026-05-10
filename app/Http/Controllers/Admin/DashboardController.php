<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Inventory;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Support\Facades\DB;
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

        // Low stock: quantity > 0 AND quantity <= min_stock_level
        $lowStockCount = Inventory::where('quantity', '>', 0)
            ->whereColumn('quantity', '<=', 'min_stock_level')
            ->count();

        // Out of stock: quantity is 0 or null
        $outOfStockCount = Inventory::where(function ($q) {
            $q->whereNull('quantity')->orWhere('quantity', '<=', 0);
        })->count();

        // Overstock: quantity >= max_stock_level (skip if column absent)
        $overstockCount = 0;
        if (\Schema::hasColumn('inventories', 'max_stock_level')) {
            $overstockCount = Inventory::whereNotNull('max_stock_level')
                ->whereColumn('quantity', '>=', 'max_stock_level')
                ->count();
        }

        // Expiring soon: expiry_date within next 30 days (skip if column absent)
        $expiringSoonCount = 0;
        if (\Schema::hasColumn('inventories', 'expiry_date')) {
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

            'overstock' => \Schema::hasColumn('inventories', 'max_stock_level')
                ? Inventory::whereNotNull('max_stock_level')
                    ->whereColumn('quantity', '>=', 'max_stock_level')
                    ->select('id', 'name', 'quantity', 'max_stock_level')
                    ->orderByDesc('quantity')
                    ->limit(20)
                    ->get()
                : collect(),

            'expiring' => \Schema::hasColumn('inventories', 'expiry_date')
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
            ...\Schema::hasColumn('inventories', 'max_stock_level') ? ['max_stock_level'] : []
        )
            ->orderByDesc('quantity')
            ->limit(15)
            ->get()
            ->map(fn($item) => [
                'name'           => $item->name,
                'quantity'       => (int) ($item->quantity ?? 0),
                'min_level'      => (int) ($item->min_stock_level ?? 0),
                'max_level'      => isset($item->max_stock_level) ? (int) $item->max_stock_level : null,
            ]);

        /* ── Recent activity ────────────────────────────────── */
        $recentActivity = ActivityLog::with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'total_inventory' => $totalInventory,
                'low_stock'       => $lowStockCount,
                'out_of_stock'    => $outOfStockCount,
                'overstock'       => $overstockCount,
                'expiring_soon'   => $expiringSoonCount,
                'total_value'     => $totalValue,
                'active_users'    => $activeUsers,
            ],
            'alerts'          => $alerts,
            'stock_chart'     => $stockChart,
            'recent_activity' => $recentActivity,
        ]);
    }
}