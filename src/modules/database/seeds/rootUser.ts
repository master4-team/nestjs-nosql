import { Role } from '../../../common/decorators/roles';
import { EncryptionAndHashService } from '../../encryptionAndHash/encrypttionAndHash.service';
import { User } from '../../models/user/user.model';
import { UserService } from '../../models/user/user.service';

const rootUser: Omit<User, 'id'> = {
  name: 'root',
  username: 'root',
  password: 'root',
  role: Role.ROOT,
};

async function createRootUser(
  userService: UserService,
  hashService: EncryptionAndHashService,
): Promise<User> {
  const existedRoot = await userService.findOne({
    filter: { username: rootUser.username },
  });
  if (existedRoot) {
    await userService.deleteById(existedRoot._id);
  }
  const hashedPassword = await hashService.hash(rootUser.password);
  return userService.create({ ...rootUser, password: hashedPassword });
}

export { createRootUser };
