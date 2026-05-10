<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function __construct(protected ReportService $reportService)
    {
    }

    public function index(Request $request)
    {
        $filters = $request->only(['category', 'status']);
        $summary = $this->reportService->inventorySummary($filters);
        $lowStockItems = $this->reportService->lowStockReport();

        return Inertia::render('Admin/Reports/Index', [
            'summary' => $summary,
            'low_stock_items' => $lowStockItems,
            'filters' => $filters,
        ]);
    }

    public function export(Request $request)
    {
        $type = $request->validate([
            'type' => 'required|in:csv,pdf',
        ])['type'];

        $lowStockItems = $this->reportService->lowStockReport();
        $content = "Name,SKU,Category,Quantity,Minimum Stock,Status\n";

        foreach ($lowStockItems as $item) {
            $content .= sprintf(
                "%s,%s,%s,%d,%d,%s\n",
                $item->name,
                $item->sku,
                $item->category,
                $item->quantity,
                $item->min_stock_level,
                $item->status
            );
        }

        $filename = 'inventory-report-'.now()->format('YmdHis').'.'.$type;
        $headers = [
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ];

        if ($type === 'pdf') {
            $headers['Content-Type'] = 'application/pdf';
            return response($content, 200, $headers);
        }

        $headers['Content-Type'] = 'text/csv';
        return response($content, 200, $headers);
    }
}
