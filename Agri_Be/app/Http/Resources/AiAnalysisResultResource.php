<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AiAnalysisResultResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'evidence_file_id' => $this->evidence_file_id,
            'analysis_type' => $this->analysis_type,
            'confidence_score' => $this->confidence_score !== null ? (float) $this->confidence_score : null,
            'analysis_results' => $this->analysis_results,
            'crop_health_score' => $this->crop_health_score !== null ? (float) $this->crop_health_score : null,
            'authenticity_score' => $this->authenticity_score !== null ? (float) $this->authenticity_score : null,
            'quality_indicators' => $this->quality_indicators,
            'recommendations' => $this->recommendations,
            'processed_at' => optional($this->processed_at)->toDateTimeString(),
        ];
    }
}


