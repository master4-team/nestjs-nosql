import { DeepHideOrOmit } from '../../../common/types';
import { User } from './user.model';

export type UserPayload = DeepHideOrOmit<User, 'password', true>;
