<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Staff\DashboardController as StaffDashboardController;
use App\Http\Controllers\Staff\InventoryController as StaffInventoryController;
use App\Http\Controllers\Staff\ReportController as StaffReportController;
use App\Http\Controllers\Staff\TaskController as StaffTaskController;
use App\Http\Controllers\Viewer\DashboardController as ViewerDashboardController;
use App\Http\Controllers\Viewer\InventoryController as ViewerInventoryController;
use App\Http\Controllers\Viewer\ReportController as ViewerReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return match (Auth::user()->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'staff' => redirect()->route('staff.dashboard'),
            'viewer' => redirect()->route('viewer.dashboard'),
            default => redirect()->route('login'),
        };
    }

    return Inertia::render('Welcome');
});

Route::get('/dashboard', function () {
    return match (Auth::user()->role) {
        'admin' => redirect()->route('admin.dashboard'),
        'staff' => redirect()->route('staff.dashboard'),
        'viewer' => redirect()->route('viewer.dashboard'),
        default => redirect()->route('login'),
    };
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])
        ->name('admin.dashboard');

    Route::resource('inventory', App\Http\Controllers\Admin\InventoryController::class, [
        'names' => 'admin.inventory',
    ]);

    Route::resource('users', App\Http\Controllers\Admin\UserController::class, [
        'names' => 'admin.users',
    ]);

    Route::patch('users/{user}/toggle-active', [App\Http\Controllers\Admin\UserController::class, 'toggleActive'])
        ->name('admin.users.toggle-active');
    Route::patch('users/{user}/toggle-lock', [App\Http\Controllers\Admin\UserController::class, 'toggleLock'])
        ->name('admin.users.toggle-lock');
    Route::patch('users/{user}/reset-password', [App\Http\Controllers\Admin\UserController::class, 'resetPassword'])
        ->name('admin.users.reset-password');

    Route::get('reports', [App\Http\Controllers\Admin\ReportController::class, 'index'])
        ->name('admin.reports.index');
    Route::get('reports/export/{type}', [App\Http\Controllers\Admin\ReportController::class, 'export'])
        ->name('admin.reports.export');

    Route::resource('activity-logs', App\Http\Controllers\Admin\ActivityLogController::class, [
        'names' => 'admin.activity-logs',
        'only' => ['index', 'show'],
    ]);

    Route::get('security', [App\Http\Controllers\Admin\SecurityController::class, 'index'])
        ->name('admin.security.index');
    Route::patch('security/settings', [App\Http\Controllers\Admin\SecurityController::class, 'update'])
        ->name('admin.security.settings.update');
});

Route::prefix('staff')->middleware(['auth', 'staff'])->group(function () {
    Route::get('/dashboard', [StaffDashboardController::class, 'index'])
        ->name('staff.dashboard');

    Route::resource('inventory', StaffInventoryController::class, [
        'names' => 'staff.inventory',
    ]);

    Route::get('reports', [StaffReportController::class, 'index'])
        ->name('staff.reports.index');
    Route::get('tasks', [StaffTaskController::class, 'index'])
        ->name('staff.tasks.index');
});

Route::prefix('viewer')->middleware(['auth', 'viewer'])->group(function () {
    Route::get('/dashboard', [ViewerDashboardController::class, 'index'])
        ->name('viewer.dashboard');

    Route::get('inventory', [ViewerInventoryController::class, 'index'])
        ->name('viewer.inventory.index');
    Route::get('inventory/{inventory}', [ViewerInventoryController::class, 'show'])
        ->name('viewer.inventory.show');

    Route::get('reports', [ViewerReportController::class, 'index'])
        ->name('viewer.reports.index');
});


