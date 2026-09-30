<?php

namespace App\Http\Requests;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\User;
use App\Rules\BelongsToOrganization;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $lead = $this->route('lead');
        $organizationId = $lead instanceof Lead
            ? (int) $lead->organization_id
            : 0;

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
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
                new BelongsToOrganization(User::class, $organizationId),
            ],

            'converted_customer_id' => [
                'nullable',
                'integer',
                'exists:customers,id',
                new BelongsToOrganization(Customer::class, $organizationId),
            ],

            'notes' => ['nullable', 'string'],
        ];
    }
}
