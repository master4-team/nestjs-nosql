import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessException } from '../../../common/exceptions';
import { BaseService } from '../../base/base.service';
import { EncryptionAndHashService } from '../../encryptionAndHash/encrypttionAndHash.service';
import { ChangePasswordDto, UpdateUserDto } from './user.dto';
import { User, UserDocument, UserModel } from './user.model';
import { ErrorMessageEnum } from '../../../common/types';
import { UserPayload } from './user.types';
import hideOrOmitDeep from '../../../utils/hideOrOmitFields';

@Injectable()
export class UserService extends BaseService<UserDocument, User> {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
    private readonly encryptionAndHashService: EncryptionAndHashService,
  ) {
    super(userModel);
  }

  async findUserById(id: string): Promise<UserPayload> {
    const user = await this.findById(id);
    if (!user) {
      return null;
    }
    return hideOrOmitDeep(user, ['password'], true) as UserPayload;
  }

  async updateUserById(
    id: string,
    updateDto: UpdateUserDto,
  ): Promise<UserPayload> {
    const updated = await this.updateById(id, updateDto);
    return hideOrOmitDeep(updated, ['password'], true) as UserPayload;
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserPayload> {
    const user = await this.findById(userId);

    if (!user) {
      throw new BusinessException(
        ErrorMessageEnum.userNotFound,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { oldPassword, newPassword } = changePasswordDto;

    if (oldPassword === newPassword) {
      throw new BusinessException(
        ErrorMessageEnum.oldPasswordEqualNewPassword,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isOldPasswordValid = await this.encryptionAndHashService.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new BusinessException(
        ErrorMessageEnum.invalidOldPassword,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newPasswordHash = await this.encryptionAndHashService.hash(
      newPassword,
    );

    const updated = await this.updateById(user._id, {
      password: newPasswordHash,
    });

    return hideOrOmitDeep(updated, ['password'], true) as UserPayload;
  }
}
