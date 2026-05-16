<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Inventory;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $totalInventory = Inventory::where('status', 'active')->count();
        $lowStockCount  = Inventory::where('status', 'active')
            ->where('quantity', '>', 0)
            ->whereColumn('quantity', '<=', 'min_stock_level')
            ->count();
        $totalValue     = Inventory::where('status', 'active')->sum('total_value');

        $recentActivity = ActivityLog::with('user:id,name')
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        return Inertia::render('Staff/Dashboard/Index', [
            'stats' => [
                'total_inventory' => $totalInventory,
                'low_stock'       => $lowStockCount,
                'total_value'     => $totalValue,
            ],
            'recent_activity' => $recentActivity,
        ]);
    }
}