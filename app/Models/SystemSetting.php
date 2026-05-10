<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    public static function getValue(string $key, $default = null)
    {
        $record = static::firstWhere('key', $key);

        if (is_null($record)) {
            return $default;
        }

        return json_decode($record->value, true) ?? $record->value;
    }

    public static function setValue(string $key, $value): static
    {
        if (is_array($value)) {
            $value = json_encode($value);
        }

        return static::updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
