<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\InventoryChangeRequest;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InventoryChangeRequestController extends Controller
{
    public function __construct(protected ActivityLogService $activityLogService)
    {
    }

    public function index()
    {
        $requests = InventoryChangeRequest::with(['inventory', 'reviewer'])
            ->where('requested_by', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Staff/ChangeRequests/Index', [
            'requests' => $requests,
        ]);
    }

    public function store(Request $request, Inventory $inventory)
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:1000',
            'changes' => 'required|array',
            'changes.name' => 'sometimes|required|string|max:255',
            'changes.description' => 'sometimes|nullable|string',
            'changes.sku' => 'sometimes|required|string|max:100',
            'changes.category' => 'sometimes|required|string|max:100',
            'changes.quantity' => 'sometimes|required|integer|min:0',
            'changes.unit_price' => 'sometimes|required|numeric|min:0',
            'changes.min_stock_level' => 'sometimes|required|integer|min:0',
            'changes.max_stock_level' => 'sometimes|nullable|integer|min:0',
            'changes.location' => 'sometimes|nullable|string|max:255',
            'changes.supplier' => 'sometimes|nullable|string|max:255',
        ]);

        // Delete any existing pending request for this inventory by this user
        InventoryChangeRequest::where('inventory_id', $inventory->id)
            ->where('requested_by', Auth::id())
            ->pending()
            ->delete();

        InventoryChangeRequest::create([
            'inventory_id' => $inventory->id,
            'requested_by' => Auth::id(),
            'status' => 'pending',
            'changes' => $validated['changes'],
            'reason' => $validated['reason'],
        ]);

        $this->activityLogService->log(
            Auth::user(),
            'change_requested',
            'inventory',
            $inventory->id,
            ['name' => $inventory->name, 'sku' => $inventory->sku]
        );

        return redirect()->route('staff.inventory.show', $inventory->id)
            ->with('success', 'Change request submitted successfully.');
    }
}