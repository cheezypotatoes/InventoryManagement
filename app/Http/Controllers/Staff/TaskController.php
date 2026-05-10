<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        return Inertia::render('Staff/Tasks/Index', [
            'task_placeholder' => true,
        ]);
    }
}
