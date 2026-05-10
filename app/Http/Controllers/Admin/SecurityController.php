<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SecurityController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Security/Index', [
            'settings' => [
                'password_strength' => SystemSetting::getValue('password_strength', 'moderate'),
                'session_timeout' => SystemSetting::getValue('session_timeout', 30),
                'account_lockout_threshold' => SystemSetting::getValue('account_lockout_threshold', 5),
                'account_lockout_duration' => SystemSetting::getValue('account_lockout_duration', 15),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'password_strength' => 'required|in:low,moderate,strong',
            'session_timeout' => 'required|integer|min:5|max:240',
            'account_lockout_threshold' => 'required|integer|min:1|max:20',
            'account_lockout_duration' => 'required|integer|min:5|max:120',
        ]);

        foreach ($validated as $key => $value) {
            SystemSetting::setValue($key, $value);
        }

        return back()->with('success', 'Security settings updated successfully.');
    }
}
