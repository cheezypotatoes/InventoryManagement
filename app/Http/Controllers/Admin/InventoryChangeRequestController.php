<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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

    public function index(Request $request)
    {
        $query = InventoryChangeRequest::with(['inventory', 'requester', 'reviewer'])
            ->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->pending();
        }

        $requests = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/ChangeRequests/Index', [
            'requests' => $requests,
            'filters' => $request->only(['status']),
        ]);
    }

    public function approve(Request $request, InventoryChangeRequest $changeRequest)
    {
        if (!$changeRequest->isPending()) {
            return back()->with('error', 'This request has already been reviewed.');
        }

        $request->validate([
            'review_note' => 'nullable|string|max:1000',
        ]);

        $inventory = $changeRequest->inventory;

        // Apply the changes to inventory
        $changes = $changeRequest->changes;
        $changes['updated_by'] = Auth::id();

        if (isset($changes['quantity']) && isset($changes['unit_price'])) {
            $changes['total_value'] = $changes['quantity'] * $changes['unit_price'];
        } elseif (isset($changes['quantity'])) {
            $changes['total_value'] = $changes['quantity'] * $inventory->unit_price;
        } elseif (isset($changes['unit_price'])) {
            $changes['total_value'] = $inventory->quantity * $changes['unit_price'];
        }

        $inventory->update($changes);

        $changeRequest->update([
            'status' => 'approved',
            'reviewed_by' => Auth::id(),
            'review_note' => $request->review_note,
            'reviewed_at' => now(),
        ]);

        $this->activityLogService->log(
            Auth::user(),
            'change_request_approved',
            'inventory',
            $inventory->id,
            ['name' => $inventory->name, 'sku' => $inventory->sku]
        );

        return back()->with('success', 'Change request approved and inventory updated.');
    }

    public function reject(Request $request, InventoryChangeRequest $changeRequest)
    {
        if (!$changeRequest->isPending()) {
            return back()->with('error', 'This request has already been reviewed.');
        }

        $request->validate([
            'review_note' => 'required|string|max:1000',
        ]);

        $changeRequest->update([
            'status' => 'rejected',
            'reviewed_by' => Auth::id(),
            'review_note' => $request->review_note,
            'reviewed_at' => now(),
        ]);

        $this->activityLogService->log(
            Auth::user(),
            'change_request_rejected',
            'inventory',
            $changeRequest->inventory_id,
            ['name' => $changeRequest->inventory->name]
        );

        return back()->with('error', 'Change request rejected.');
    }
}