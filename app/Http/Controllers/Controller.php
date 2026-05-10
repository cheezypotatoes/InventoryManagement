<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Auth\Access\Gate as GateContract;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

abstract class Controller
{
    use AuthorizesRequests, ValidatesRequests;

    public function authorize($ability, $arguments = [])
    {
        return app(GateContract::class)->authorize($ability, $arguments);
    }

    public function authorizeForUser($user, $ability, $arguments = [])
    {
        return app(GateContract::class)->forUser($user)->authorize($ability, $arguments);
    }
}
