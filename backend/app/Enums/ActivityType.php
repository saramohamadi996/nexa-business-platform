<?php

namespace App\Enums;

enum ActivityType: string
{
    case CREATED = 'created';
    case UPDATED = 'updated';
    case DELETED = 'deleted';
    case NOTE = 'note';
    case CALL = 'call';
    case EMAIL = 'email';
    case MEETING = 'meeting';
}
