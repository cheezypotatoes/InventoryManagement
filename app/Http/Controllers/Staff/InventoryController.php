<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Inventory::where('status', 'active');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%')
                ->orWhere('sku', 'like', '%'.$request->search.'%');
        }

        $inventory = $query->paginate(15)->withQueryString();

        return Inertia::render('Staff/Inventory/Index', [
            'inventory' => $inventory,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Inventory $inventory)
    {
        return Inertia::render('Staff/Inventory/Show', [
            'inventory' => $inventory,
        ]);
    }
}
