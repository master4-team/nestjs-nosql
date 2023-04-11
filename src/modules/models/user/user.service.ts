import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ErrorMessageEnum,
  UNAUTHORIZED,
} from '../../../common/constants/errors';
import { BusinessException } from '../../../common/exceptions';
import { BaseService } from '../../base/base.service';
import { EncryptionAndHashService } from '../../encryptionAndHash/encrypttionAndHash.service';
import { LoggerService } from '../../logger/logger.service';
import { ChangePasswordDto } from './user.dto';
import { User, UserDocument, UserModel } from './user.model';

@Injectable()
export class UserService extends BaseService<
  LoggerService,
  UserDocument,
  User
> {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
    private readonly encryptionAndHashService: EncryptionAndHashService,
    logger: LoggerService,
  ) {
    super(userModel, logger);
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    const user = await this.findById(userId);

    if (!user) {
      throw new BusinessException(UNAUTHORIZED, ErrorMessageEnum.userNotFound);
    }

    const { oldPassword, newPassword } = changePasswordDto;

    const oldPasswordHash = await this.encryptionAndHashService.hash(
      oldPassword,
    );
    const isOldPasswordValid = await this.encryptionAndHashService.compare(
      oldPasswordHash,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new BusinessException(
        UNAUTHORIZED,
        ErrorMessageEnum.invalidOldPassword,
      );
    }

    const newPasswordHash = await this.encryptionAndHashService.hash(
      newPassword,
    );

    return await this.updateById(user._id, {
      password: newPasswordHash,
    });
  }
}
