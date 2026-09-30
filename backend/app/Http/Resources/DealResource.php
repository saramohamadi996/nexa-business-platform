<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DealResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organization_id' => $this->organization_id,
            'customer_id' => $this->customer_id,
            'lead_id' => $this->lead_id,
            'title' => $this->title,
            'description' => $this->description,
            'value' => $this->value,
            'currency' => $this->currency,
            'stage' => $this->stage,
            'probability' => $this->probability,
            'expected_close_date' => $this->expected_close_date,
            'assigned_to' => $this->assigned_to,
            'created_by' => $this->created_by,
            'won_at' => $this->won_at,
            'lost_at' => $this->lost_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
