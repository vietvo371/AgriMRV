<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrainingRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'training_type' => $this->training_type,
            'training_title' => $this->training_title,
            'completion_date' => optional($this->completion_date)->format('Y-m-d'),
            'completion_status' => $this->completion_status,
            'score' => $this->score !== null ? (float) $this->score : null,
            'certificate_url' => $this->certificate_url,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}


