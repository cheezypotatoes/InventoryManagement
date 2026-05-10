<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SecuritySettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'session_timeout' => ['required', 'integer', 'min:1'],
            'maintenance_mode' => ['boolean'],
            'https_enforced' => ['boolean'],
        ];
    }
}
