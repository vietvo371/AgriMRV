<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use App\Models\VerificationRecord;
use App\Models\CarbonCredit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VerificationController extends Controller
{
    use ApiResponseTrait;

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mrv_declaration_id' => ['required','exists:mrv_declarations,id'],
            'verifier_id' => ['required','exists:users,id'],
            'verification_type' => ['required','in:remote,field,hybrid'],
            'verification_date' => ['required','date'],
            'verification_status' => ['required','in:pending,approved,rejected,requires_revision'],
            'verification_score' => ['nullable','numeric'],
            'field_visit_notes' => ['nullable','string'],
        ]);

        $record = VerificationRecord::create($validated);
        Log::info('Verification recorded', ['id' => $record->id, 'status' => $record->verification_status]);

        if ($record->verification_status === 'approved') {
            CarbonCredit::create([
                'mrv_declaration_id' => $record->mrv_declaration_id,
                'verification_record_id' => $record->id,
                'credit_amount' => 10.00,
                'credit_type' => 'agriculture',
                'vintage_year' => date('Y'),
                'certification_standard' => 'Gold Standard',
                'serial_number' => 'GS-'.date('Y').'-'.uniqid(),
                'status' => 'issued',
                'issued_date' => date('Y-m-d'),
            ]);
        }

        return $this->success($record, 'Verification created', 201);
    }
}


