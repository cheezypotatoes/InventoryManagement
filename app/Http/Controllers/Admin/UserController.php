<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(protected ActivityLogService $activityLogService)
    {
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $users = User::query()
            ->when($request->filled('role'), fn ($query) => $query->where('role', $request->role))
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => ['admin', 'staff', 'viewer'],
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);

        return Inertia::render('Admin/Users/Create', [
            'roles' => ['admin', 'staff', 'viewer'],
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'role' => 'required|in:admin,staff,viewer',
            'password' => 'required|string|min:8|confirmed',
            'is_active' => 'sometimes|boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $this->activityLogService->log(
            Auth::user(),
            'created',
            'user',
            $user->id,
            ['email' => $user->email, 'role' => $user->role]
        );

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $this->authorize('update', $user);

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => ['admin', 'staff', 'viewer'],
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'role' => 'required|in:admin,staff,viewer',
            'password' => 'nullable|string|min:8|confirmed',
            'is_active' => 'sometimes|boolean',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => isset($validated['password']) ? Hash::make($validated['password']) : $user->password,
            'is_active' => $validated['is_active'] ?? $user->is_active,
        ]);

        $this->activityLogService->log(
            Auth::user(),
            'updated',
            'user',
            $user->id,
            ['email' => $user->email, 'role' => $user->role]
        );

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $user->delete();

        $this->activityLogService->log(
            Auth::user(),
            'deleted',
            'user',
            $user->id,
            ['email' => $user->email]
        );

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }

    public function toggleActive(User $user)
    {
        $this->authorize('update', $user);

        $user->update(['is_active' => ! $user->is_active]);

        $this->activityLogService->log(
            Auth::user(),
            'updated',
            'user',
            $user->id,
            ['is_active' => $user->is_active]
        );

        return redirect()->route('admin.users.index')->with('success', 'User activation status updated.');
    }

    public function toggleLock(User $user)
    {
        $this->authorize('update', $user);

        $user->update([
            'is_locked' => ! $user->is_locked,
            'locked_until' => $user->is_locked ? null : now()->addMinutes(15),
        ]);

        $this->activityLogService->log(
            Auth::user(),
            'updated',
            'user',
            $user->id,
            ['is_locked' => $user->is_locked]
        );

        return redirect()->route('admin.users.index')->with('success', 'User lock status updated.');
    }

    public function resetPassword(Request $request, User $user)
    {
        $this->authorize('update', $user);

        $validated = $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user->update(['password' => Hash::make($validated['password'])]);

        $this->activityLogService->log(
            Auth::user(),
            'updated',
            'user',
            $user->id,
            ['password_reset' => true]
        );

        return redirect()->route('admin.users.index')->with('success', 'User password reset successfully.');
    }
}
