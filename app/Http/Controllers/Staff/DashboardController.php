<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $inventoryCount = Inventory::count();
        $lowStockCount = Inventory::whereColumn('quantity', '<=', 'min_stock_level')->count();

        return Inertia::render('Staff/Dashboard/Index', [
            'stats' => [
                'inventory_count' => $inventoryCount,
                'low_stock_count' => $lowStockCount,
            ],
        ]);
    }
}
