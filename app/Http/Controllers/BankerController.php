<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BankerController extends Controller
{
    public function dashboard()
    {
        return view('page.Banker.dashboard');
    }

    public function loanApplications()
    {
        return view('page.Banker.loan-applications');
    }

    public function portfolio()
    {
        return view('page.Banker.portfolio');
    }

    public function riskAssessment()
    {
        return view('page.Banker.risk-assessment');
    }

    public function reports()
    {
        return view('page.Banker.reports');
    }

    public function analytics()
    {
        return view('page.Banker.analytics');
    }

    public function settings()
    {
        return view('page.Banker.settings');
    }

    public function profile()
    {
        return view('page.Banker.profile');
    }

    public function shareProfile()
    {
        return view('page.Banker.share-profile');
    }
}
