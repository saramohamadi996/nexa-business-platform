<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class BelongsToOrganization implements ValidationRule
{
    public function __construct(
        private readonly string $modelClass,
        private readonly int $organizationId,
    ) {
    }

    public function validate(
        string $attribute,
        mixed $value,
        Closure $fail
    ): void {
        if (! $this->modelClass::whereKey($value)
            ->where('organization_id', $this->organizationId)
            ->exists()) {
            $fail('The selected :attribute does not belong to this organization.');
        }
    }
}
