<?php

namespace App\Http\Requests;

use App\Rules\BelongsToOrganization;
use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'organization_id' => $this->header('X-Organization-Id'),
        ]);
    }

    public function rules(): array
    {
        $organizationId = (int) $this->input('organization_id');

        return [
            'organization_id' => [
                'required',
                'integer',
                'exists:organizations,id',
            ],
            'name' => ['required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'source' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', 'string', 'max:30'],
            'priority' => ['nullable', 'string', 'max:30'],
            'estimated_value' => ['nullable', 'numeric', 'min:0'],

            'assigned_to' => [
                'nullable',
                'integer',
                'exists:users,id',
                new BelongsToOrganization(
                    \App\Models\User::class,
                    $organizationId
                ),
            ],

            'converted_customer_id' => [
                'nullable',
                'integer',
                'exists:customers,id',
                new BelongsToOrganization(
                    Customer::class,
                    $organizationId
                ),
            ],

            'notes' => ['nullable', 'string'],
        ];
    }
}
