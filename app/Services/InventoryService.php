<?php

namespace App\Services;

use App\Models\Inventory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class InventoryService
{
    public function search(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = Inventory::query();

        if (! empty($filters['search'])) {
            $query->where(function ($query) use ($filters) {
                $query->where('name', 'like', '%'.$filters['search'].'%')
                    ->orWhere('sku', 'like', '%'.$filters['search'].'%');
            });
        }

        if (! empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (! empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('updated_at', 'desc')->paginate($perPage)->withQueryString();
    }

    public function getLowStockItems(): Collection
    {
        return Inventory::whereColumn('quantity', '<=', 'min_stock_level')
            ->orderBy('quantity', 'asc')
            ->get();
    }
}
