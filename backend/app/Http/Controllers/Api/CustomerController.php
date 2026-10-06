<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Resources\CustomerResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;

class CustomerController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $customers = $request->user()->customers()->latest()->paginate(20);
        return CustomerResource::collection($customers);
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $organizationId = $request->header('X-Organization-Id')
            ?? $request->user()->organizations()->value('organizations.id');

        $customer = Customer::create([
            ...$request->validated(),
            'organization_id' => $organizationId,
            'created_by' => $request->user()->id,
        ]);

        return CustomerResource::make($customer)
            ->additional(['message' => 'Customer created successfully.'])
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

    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        $customer->update($request->validated());
        return CustomerResource::make($customer->fresh())
            ->additional(['message' => 'Customer updated successfully.']);
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
