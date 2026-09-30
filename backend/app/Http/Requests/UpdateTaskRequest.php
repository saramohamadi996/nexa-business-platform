<?php

namespace App\Http\Requests;

use App\Models\Customer;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Task;
use App\Models\User;
use App\Rules\BelongsToOrganization;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $task = $this->route('task');
        $organizationId = $task instanceof Task
            ? (int) $task->organization_id
            : 0;

        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'max:30'],
            'priority' => ['nullable', 'string', 'max:30'],
            'due_date' => ['nullable', 'date'],

            'customer_id' => [
                'nullable',
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

            'deal_id' => [
                'nullable',
                'integer',
                'exists:deals,id',
                new BelongsToOrganization(Deal::class, $organizationId),
            ],

            'assigned_to' => [
                'nullable',
                'integer',
                'exists:users,id',
                new BelongsToOrganization(User::class, $organizationId),
            ],
        ];
    }
}
