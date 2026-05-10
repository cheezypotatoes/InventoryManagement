<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReportPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['admin', 'staff', 'viewer']);
    }

    public function view(User $user): bool
    {
        return $this->viewAny($user);
    }

    public function export(User $user): bool
    {
        return in_array($user->role, ['admin', 'staff']);
    }
}
