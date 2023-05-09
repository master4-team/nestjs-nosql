import { SetMetadata } from '@nestjs/common';

export const SKIP_JWT_GUARD_KEY = 'isSkipJwtGuard';
export const SkipJwtGuard = () => SetMetadata(SKIP_JWT_GUARD_KEY, true);
