<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required','email','unique:users,email'],
            'phone' => ['required','string','unique:users,phone'],
            'full_name' => ['required','string'],
            'date_of_birth' => ['required','date','before_or_equal:'.now()->subYears(18)->toDateString()],
            'user_type' => ['required','in:farmer,bank,cooperative,verifier,government,buyer'],
            'gps_latitude' => ['required','regex:/^-?\d{1,2}\.\d+$/'],
            'gps_longitude' => ['required','regex:/^-?\d{1,3}\.\d+$/'],
            'organization_name' => ['nullable','string'],
            'organization_type' => ['nullable','string'],
            'address' => ['required','string'],
            'password' => ['required','string','confirmed','min:8','regex:/[a-z]/','regex:/[A-Z]/','regex:/[0-9]/'],
            'password_confirmation' => ['required','string','same:password'],
        ];
    }
}


