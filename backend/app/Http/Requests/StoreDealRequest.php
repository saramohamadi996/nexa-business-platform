<?php

namespace App\Http\Requests;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\User;
use App\Rules\BelongsToOrganization;
use Illuminate\Foundation\Http\FormRequest;

class StoreDealRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
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

            'customer_id' => [
                'required',
                'integer',
                'exists:customers,id',
                new BelongsToOrganization(Customer::class, $organizationId),
            ],

            'lead_id' => [
                'nullable',
                'integer',
                'exists:leads,id',
                new BelongsToOrganization(Lead::class, $organizationId),
            ],

            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'value' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'stage' => ['nullable', 'string', 'max:30'],
            'probability' => ['nullable', 'integer', 'min:0', 'max:100'],
            'expected_close_date' => ['nullable', 'date'],

            'assigned_to' => [
                'nullable',
                'integer',
                'exists:users,id',
                new BelongsToOrganization(User::class, $organizationId),
            ],
        ];
    }
}
