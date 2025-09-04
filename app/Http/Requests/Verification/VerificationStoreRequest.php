<?php

namespace App\Http\Requests\Verification;

use Illuminate\Foundation\Http\FormRequest;

class VerificationStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mrv_declaration_id' => ['required','exists:mrv_declarations,id'],
            'verifier_id' => ['required','exists:users,id'],
            'verification_type' => ['required','in:remote,field,hybrid'],
            'verification_date' => ['required','date'],
            'verification_status' => ['required','in:pending,approved,rejected,requires_revision'],
            'verification_score' => ['nullable','numeric'],
            'field_visit_notes' => ['nullable','string'],
        ];
    }
}


