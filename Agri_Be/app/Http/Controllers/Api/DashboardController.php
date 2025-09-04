<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use App\Models\PlotBoundary;
use App\Models\FarmProfile;
use App\Models\MrvDeclaration;
use App\Models\VerificationRecord;
use App\Models\CarbonCredit;
use App\Models\AiAnalysisResult;
use App\Models\EvidenceFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    use ApiResponseTrait;


}


