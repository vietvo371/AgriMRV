<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'identifier' => ['required', 'string'],
            'password' => ['required', 'string'],
            'type' => ['required', 'string', 'in:email,phone'],
        ];

        $type = $this->input('type');
        if ($type === 'email') {
            $rules['identifier'][] = 'email';
            $rules['identifier'][] = 'exists:users,email';
        } elseif ($type === 'phone') {
            $rules['identifier'][] = 'regex:/^[+0-9\-\s]{10,}$/';
            $rules['identifier'][] = 'exists:users,phone';
        }

        return $rules;
    }
}
