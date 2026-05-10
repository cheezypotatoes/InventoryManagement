<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InventoryController extends Controller
{
    public function __construct(protected ActivityLogService $activityLogService)
    {
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Inventory::class);

        $query = Inventory::with(['creator', 'updater']);

        if ($request->filled('search')) {
            $query->where('name', 'like', '%'.$request->search.'%')
                ->orWhere('sku', 'like', '%'.$request->search.'%')
                ->orWhere('category', 'like', '%'.$request->search.'%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $inventory = $query->orderBy('updated_at', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Inventory/Index', [
            'inventory' => $inventory,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Inventory::class);

        return Inertia::render('Admin/Inventory/Create', [
            'statuses' => ['active', 'inactive', 'discontinued'],
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Inventory::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'required|string|max:100|unique:inventories,sku',
            'category' => 'required|string|max:100',
            'quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'min_stock_level' => 'required|integer|min:0',
            'max_stock_level' => 'nullable|integer|min:0',
            'location' => 'nullable|string|max:255',
            'supplier' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive,discontinued',
        ]);

        $validated['total_value'] = $validated['quantity'] * $validated['unit_price'];
        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();

        $inventory = Inventory::create($validated);

        $this->activityLogService->log(
            Auth::user(),
            'created',
            'inventory',
            $inventory->id,
            ['name' => $inventory->name, 'sku' => $inventory->sku]
        );

        return redirect()->route('admin.inventory.index')->with('success', 'Inventory item added successfully.');
    }

    public function show(Inventory $inventory)
    {
        $this->authorize('view', $inventory);

        return Inertia::render('Admin/Inventory/Show', [
            'inventory' => $inventory->load(['creator', 'updater']),
        ]);
    }

    public function edit(Inventory $inventory)
    {
        $this->authorize('update', $inventory);

        return Inertia::render('Admin/Inventory/Edit', [
            'inventory' => $inventory,
            'statuses' => ['active', 'inactive', 'discontinued'],
        ]);
    }

    public function update(Request $request, Inventory $inventory)
    {
        $this->authorize('update', $inventory);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sku' => 'required|string|max:100|unique:inventories,sku,'.$inventory->id,
            'category' => 'required|string|max:100',
            'quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'min_stock_level' => 'required|integer|min:0',
            'max_stock_level' => 'nullable|integer|min:0',
            'location' => 'nullable|string|max:255',
            'supplier' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive,discontinued',
        ]);

        $validated['total_value'] = $validated['quantity'] * $validated['unit_price'];
        $validated['updated_by'] = Auth::id();

        $inventory->update($validated);

        $this->activityLogService->log(
            Auth::user(),
            'updated',
            'inventory',
            $inventory->id,
            ['name' => $inventory->name, 'sku' => $inventory->sku]
        );

        return redirect()->route('admin.inventory.index')->with('success', 'Inventory item updated successfully.');
    }

    public function destroy(Inventory $inventory)
    {
        $this->authorize('delete', $inventory);

        $inventory->delete();

        $this->activityLogService->log(
            Auth::user(),
            'deleted',
            'inventory',
            $inventory->id,
            ['name' => $inventory->name, 'sku' => $inventory->sku]
        );

        return redirect()->route('admin.inventory.index')->with('success', 'Inventory item removed successfully.');
    }
}
