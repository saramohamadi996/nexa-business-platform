<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    public function handle(
        Request $request,
        Closure $next,
        string $permission
    ): Response {
        $user = $request->user();

        abort_unless($user, 401, 'Unauthenticated.');

        $organizationId = $this->resolveOrganizationId($request);

        abort_unless(
            $organizationId,
            422,
            'Organization could not be determined.'
        );

        $organization = $user->organizations()
            ->whereKey($organizationId)
            ->first();

        abort_unless(
            $organization,
            403,
            'You do not have access to this organization.'
        );

        $roleId = $organization->pivot->role_id;

        $hasPermission = $roleId
            && \App\Models\Role::whereKey($roleId)
                ->whereHas('permissions', function ($query) use ($permission) {
                    $query->where('slug', $permission);
                })
                ->exists();

        abort_unless(
            $hasPermission,
            403,
            'You do not have permission to perform this action.'
        );

        return $next($request);
    }

    private function resolveOrganizationId(Request $request): ?int
    {
        $organizationId = $request->header('X-Organization-Id')
            ?? $request->input('organization_id');

        if ($organizationId) {
            return (int) $organizationId;
        }

        foreach ($request->route()->parameters() as $parameter) {
            if (
                is_object($parameter)
                && isset($parameter->organization_id)
            ) {
                return (int) $parameter->organization_id;
            }
        }

        return null;
    }
}
