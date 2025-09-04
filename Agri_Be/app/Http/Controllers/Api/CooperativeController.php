<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CooperativeMembership;
use App\Models\FarmProfile;
use App\Models\MrvDeclaration;
use App\Models\User;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class CooperativeController extends Controller
{
    use ApiResponseTrait;

    public function members(Request $request)
    {
        $coopUser = $request->user();

        $memberships = CooperativeMembership::where('cooperative_id', $coopUser->id)
            ->with(['user'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($m) {
                $farmProfile = FarmProfile::where('user_id', $m->user_id)->first();
                $verifiedDeclarations = MrvDeclaration::where('user_id', $m->user_id)
                    ->where('status', 'verified')
                    ->count();
                return [
                    'member_id' => $m->user_id,
                    'name' => $m->user?->full_name,
                    'phone' => $m->user?->phone,
                    'status' => $m->membership_status ?? 'active',
                    'total_area' => $farmProfile?->total_area_hectares ?? 0,
                    'verified_declarations' => $verifiedDeclarations,
                    'joined_at' => $m->join_date?->format('Y-m-d')
                ];
            });

        return $this->success(['members' => $memberships]);
    }

    public function stats(Request $request)
    {
        $coopUser = $request->user();

        $memberIds = CooperativeMembership::where('cooperative_id', $coopUser->id)
            ->pluck('user_id');

        $totalMembers = $memberIds->count();
        $totalArea = FarmProfile::whereIn('user_id', $memberIds)->sum('total_area_hectares');
        $verifiedDeclarations = MrvDeclaration::whereIn('user_id', $memberIds)
            ->where('status', 'verified')
            ->count();
        $submittedDeclarations = MrvDeclaration::whereIn('user_id', $memberIds)
            ->where('status', 'submitted')
            ->count();

        return $this->success([
            'summary' => [
                'members' => $totalMembers,
                'total_area' => round($totalArea, 2),
                'verified_declarations' => $verifiedDeclarations,
                'submitted_declarations' => $submittedDeclarations
            ]
        ]);
    }
}



