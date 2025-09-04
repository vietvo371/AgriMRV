<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VerificationRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'mrv_declaration_id' => $this->mrv_declaration_id,
            'verifier_id' => $this->verifier_id,
            'verification_type' => $this->verification_type,
            'verification_date' => optional($this->verification_date)->format('Y-m-d'),
            'verification_status' => $this->verification_status,
            'verification_score' => $this->verification_score !== null ? (float) $this->verification_score : null,
            'field_visit_notes' => $this->field_visit_notes,
            'verification_evidence' => $this->verification_evidence,
            'verifier_comments' => $this->verifier_comments,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}


