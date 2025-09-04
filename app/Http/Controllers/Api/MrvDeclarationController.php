<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use App\Models\MrvDeclaration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MrvDeclarationController extends Controller
{
    use ApiResponseTrait;

    public function index()
    {
        return $this->success(MrvDeclaration::with('user','farmProfile')->paginate());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required','exists:users,id'],
            'farm_profile_id' => ['required','exists:farm_profiles,id'],
            'declaration_period' => ['required','string','max:20'],
        ]);
        $decl = MrvDeclaration::create($validated);
        Log::info('MRV declaration submitted', ['user_id' => $decl->user_id, 'id' => $decl->id]);
        return $this->success($decl, 'Created', 201);
    }

    public function show(MrvDeclaration $mrvDeclaration)
    {
        return $this->success($mrvDeclaration->load('evidenceFiles','verificationRecords'));
    }

    public function update(Request $request, MrvDeclaration $mrvDeclaration)
    {
        $mrvDeclaration->update($request->all());
        return $this->success($mrvDeclaration, 'Updated');
    }
}


