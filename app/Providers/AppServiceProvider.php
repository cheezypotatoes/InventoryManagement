<?php

namespace App\Providers;

use App\Models\ActivityLog;
use App\Models\Inventory;
use App\Models\User;
use App\Policies\ActivityLogPolicy;
use App\Policies\InventoryPolicy;
use App\Policies\ReportPolicy;
use App\Policies\UserPolicy;
use App\Services\ReportService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::policy(Inventory::class, InventoryPolicy::class);
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(ActivityLog::class, ActivityLogPolicy::class);
        Gate::policy(ReportService::class, ReportPolicy::class);

        Gate::before(function (User $user, $ability) {
            return $user->isAdmin() ? true : null;
        });
    }
}
