<?php

namespace App\Services;

use App\Models\Inventory;
use Illuminate\Database\Eloquent\Collection;

class ReportService
{
    public function inventorySummary(array $filters = []): array
    {
        $query = Inventory::query();

        if (! empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $totalItems = $query->count();
        $lowStock = $query->whereColumn('quantity', '<=', 'min_stock_level')->count();
        $totalValue = $query->sum('total_value');

        return [
            'total_items' => $totalItems,
            'low_stock_items' => $lowStock,
            'total_value' => $totalValue,
        ];
    }

    public function lowStockReport(): Collection
    {
        return Inventory::whereColumn('quantity', '<=', 'min_stock_level')
            ->orderBy('quantity', 'asc')
            ->get();
    }
}
