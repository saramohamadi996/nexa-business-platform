<?php

namespace App\Enums;

enum DealStage: string
{
    case NEW = 'new';
    case QUALIFIED = 'qualified';
    case PROPOSAL = 'proposal';
    case NEGOTIATION = 'negotiation';
    case WON = 'won';
    case LOST = 'lost';
}
