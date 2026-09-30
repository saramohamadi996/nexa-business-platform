<?php

namespace App\Http\Requests;

use App\Models\Customer;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\User;
use App\Rules\BelongsToOrganization;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDealRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $deal = $this->route('deal');
        $organizationId = $deal instanceof Deal
            ? (int) $deal->organization_id
            : 0;

        return [
            'customer_id' => [
                'sometimes',
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

            'title' => ['sometimes', 'required', 'string', 'max:255'],
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
