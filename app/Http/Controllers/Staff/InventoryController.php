<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\InventoryChangeRequest;
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
        $query = Inventory::where('status', 'active')
            ->withCount([
                'changeRequests as pending_change_request' => function ($q) {
                    $q->where('status', 'pending')
                      ->where('requested_by', Auth::id());
                }
            ]);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                  ->orWhere('sku', 'like', '%'.$request->search.'%');
            });
        }

        $inventory = $query->paginate(15)->withQueryString();

        return Inertia::render('Staff/Inventory/Index', [
            'inventory' => $inventory,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Inventory $inventory)
    {
        if ($inventory->status !== 'active') {
            return redirect()->route('staff.inventory.index');
        }

        $changeRequests = InventoryChangeRequest::with(['reviewer'])
            ->where('inventory_id', $inventory->id)
            ->where('requested_by', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Staff/Inventory/Show', [
            'inventory' => $inventory->load(['creator', 'updater']),
            'changeRequests' => $changeRequests,
        ]);
    }

    public function edit(Inventory $inventory)
    {
        if ($inventory->status !== 'active') {
            return redirect()->route('staff.inventory.index');
        }

        return Inertia::render('Staff/Inventory/Edit', [
            'inventory' => $inventory,
        ]);
    }

    public function update(Request $request, Inventory $inventory)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'sku'             => 'required|string|max:100|unique:inventories,sku,'.$inventory->id,
            'category'        => 'required|string|max:100',
            'quantity'        => 'required|integer|min:0',
            'unit_price'      => 'required|numeric|min:0',
            'min_stock_level' => 'required|integer|min:0',
            'max_stock_level' => 'nullable|integer|min:0',
            'location'        => 'nullable|string|max:255',
            'supplier'        => 'nullable|string|max:255',
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

        return redirect()->route('staff.inventory.show', $inventory->id)
            ->with('success', 'Inventory item updated successfully.');
    }
}