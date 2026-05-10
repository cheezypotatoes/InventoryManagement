<?php

namespace App\Models;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inventory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'sku',
        'category',
        'quantity',
        'unit_price',
        'total_value',
        'min_stock_level',
        'max_stock_level',
        'location',
        'supplier',
        'status',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'unit_price' => 'float',
        'total_value' => 'float',
        'quantity' => 'integer',
        'min_stock_level' => 'integer',
        'max_stock_level' => 'integer',
    ];

    /**
     * Get the user who created this inventory item
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this inventory item
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get activity logs for this inventory item
     */
    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'inventory_id');
    }

    /**
     * Check if item is low on stock
     */
    public function isLowStock(): bool
    {
        return $this->quantity <= $this->min_stock_level;
    }

    /**
     * Check if item is out of stock
     */
    public function isOutOfStock(): bool
    {
        return $this->quantity <= 0;
    }

    /**
     * Calculate total value
     */
    public function calculateTotalValue(): float
    {
        return $this->quantity * $this->unit_price;
    }

    /**
     * Update total value
     */
    public function updateTotalValue(): void
    {
        $this->total_value = $this->calculateTotalValue();
        $this->save();
    }
}
