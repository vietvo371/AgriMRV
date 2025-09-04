<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EvidenceFileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $gps = null;
        if (!is_null($this->gps_latitude) && !is_null($this->gps_longitude)) {
            $gps = $this->gps_latitude.','.$this->gps_longitude;
        }
        return [
            'id' => $this->id,
            'mrv_declaration_id' => $this->mrv_declaration_id,
            'file_type' => $this->file_type,
            'file_url' => $this->file_url,
            'file_name' => $this->file_name,
            'file_size_bytes' => $this->file_size_bytes,
            'gps_location' => $gps,
            'capture_timestamp' => optional($this->capture_timestamp)->toDateTimeString(),
            'description' => $this->description,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}


