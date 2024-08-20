import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userRepository: Model<User>,
  ) {}

  async findByEmail(strEmail: string): Promise<User> {
    try {
      // const userInfo = this.userRepository
      // .createQueryBuilder('user')
      // .leftJoin('tblOutlet', 'outlet', 'user.intOutletId=outlet.intId')
      // .leftJoin('tblRole', 'role', 'user.intRoleId=role.intId')
      // .select([
      //   'user.*',
      //   'outlet.strName AS strOutletName',
      //   'outlet.strOutletType AS strOutletType',
      //   'role.strRoleName AS strRoleName',
      // ])
      // .where('user.strEmail = :strEmail', { strEmail })
      // .getRawOne();
      // return userInfo;
      return new User();
    } catch (error) {
      throw error;
    }
  }

  async findByPhone(strPhone: string): Promise<User> {
    try {
      // const userInfo = this.userRepository
      //   .createQueryBuilder('user')
      //   .leftJoin('tblOutlet', 'outlet', 'user.intOutletId=outlet.intId')
      //   .leftJoin('tblRole', 'role', 'user.intRoleId=role.intId')
      //   .select([
      //     'user.*',
      //     'outlet.strName AS strOutletName',
      //     'outlet.strOutletType AS strOutletType',
      //     'role.strRoleName AS strRoleName',
      //   ])
      //   .where('user.strPhone = :strPhone', { strPhone })
      //   .getRawOne();
      // return userInfo;
      return new User();
    } catch (error) {
      throw error;
    }
  }
}
