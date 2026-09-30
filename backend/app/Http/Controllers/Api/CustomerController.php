<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\CustomerResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CustomerController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $customers = $request->user()
            ->customers()
            ->latest()
            ->get();

        return CustomerResource::collection($customers);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_id' => ['required', 'integer', 'exists:organizations,id'],
            'name' => ['required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'url', 'max:255'],
            'industry' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:30'],
            'source' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        abort_unless(
            $request->user()->organizations()->whereKey($validated['organization_id'])->exists(),
            403,
            'You do not have access to this organization.'
        );

        $customer = Customer::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        return CustomerResource::make($customer)
            ->additional([
                'message' => 'Customer created successfully.',
            ])
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Customer $customer): JsonResponse
    {
        abort_unless(
            $request->user()->organizations()->whereKey($customer->organization_id)->exists(),
            403,
            'You do not have access to this customer.'
        );

        return CustomerResource::make($customer);
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        abort_unless(
            $request->user()->organizations()->whereKey($customer->organization_id)->exists(),
            403,
            'You do not have access to this customer.'
        );

        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'url', 'max:255'],
            'industry' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:30'],
            'source' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string'],
        ]);

        $customer->update($validated);

        return CustomerResource::make($customer->fresh())
            ->additional([
                'message' => 'Customer updated successfully.',
            ]);
    }

    public function destroy(Request $request, Customer $customer): JsonResponse
    {
        abort_unless(
            $request->user()->organizations()->whereKey($customer->organization_id)->exists(),
            403,
            'You do not have access to this customer.'
        );

        $customer->delete();

        return response()->json([
            'message' => 'Customer deleted successfully.',
        ]);
    }
}
