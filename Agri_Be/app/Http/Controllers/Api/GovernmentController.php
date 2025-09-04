<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlockchainAnchor;
use App\Models\CarbonCredit;
use App\Models\MrvDeclaration;
use App\Models\VerificationRecord;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class GovernmentController extends Controller
{
    use ApiResponseTrait;

    public function registry(Request $request)
    {
        $declarations = MrvDeclaration::select('id', 'user_id', 'declaration_period', 'status', 'estimated_carbon_credits')
            ->orderBy('created_at', 'desc')
            ->take(100)
            ->get();

        $verifications = VerificationRecord::select('id', 'mrv_declaration_id', 'verifier_id', 'verification_status', 'verification_date')
            ->orderBy('verification_date', 'desc')
            ->take(100)
            ->get();

        $credits = CarbonCredit::select('id', 'mrv_declaration_id', 'serial_number', 'status', 'credit_amount', 'issued_date')
            ->orderBy('issued_date', 'desc')
            ->take(100)
            ->get();

        return $this->success([
            'mrv_declarations' => $declarations,
            'verification_records' => $verifications,
            'carbon_credits' => $credits,
        ]);
    }

    public function anchors(Request $request)
    {
        $anchors = BlockchainAnchor::orderBy('anchor_timestamp', 'desc')
            ->take(200)
            ->get();

        return $this->success(['anchors' => $anchors]);
    }
}



