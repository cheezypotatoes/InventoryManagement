<?php

namespace App\Http\Controllers\Viewer;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $inventoryCount = Inventory::where('status', 'active')->count();

        return Inertia::render('Viewer/Dashboard/Index', [
            'stats' => [
                'inventory_count' => $inventoryCount,
            ],
        ]);
    }
}
