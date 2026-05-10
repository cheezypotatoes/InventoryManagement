<?php

namespace App\Http\Controllers\Viewer;

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

        return Inertia::render('Viewer/Reports/Index', [
            'summary' => $summary,
            'filters' => $filters,
        ]);
    }
}
