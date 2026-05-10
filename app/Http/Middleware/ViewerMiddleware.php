<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ViewerMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        if (! $user instanceof \App\Models\User) {
            return redirect()->route('login');
        }

        if ($user->role !== 'viewer' && ! $user->isAdmin()) {
            return redirect()->route('dashboard')->with('error', 'Unauthorized access to viewer area.');
        }

        return $next($request);
    }
}
