<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
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

        return Inertia::render('Staff/Reports/Index', [
            'summary' => $summary,
            'low_stock_items' => $lowStockItems,
            'filters' => $filters,
        ]);
    }
}
