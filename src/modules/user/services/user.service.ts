import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async findByEmail(strEmail: string): Promise<User> {
    try {
      const userInfo = await this.userModel
        .findOne({ strEmail }) // Find the user by email
        .populate('intOutletId', 'strName strOutletType')
        .populate('intRoleId', 'strRoleName')
        .exec(); // Execute the query

      return userInfo;
    } catch (error) {
      throw error;
    }
  }

  async findByPhone(strPhone: string): Promise<User> {
    try {
      const userInfo = await this.userModel
        .findOne({ strPhone }) // Find the user by phone
        .populate('intOutletId', 'strName strOutletType') // Populate outlet fields
        .populate('intRoleId', 'strRoleName') // Populate role fields
        .exec(); // Execute the query

      return userInfo;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userDto: CreateUserDto) {
    if (!userDto.strEmail || !userDto.strPassword) {
      throw new BadRequestException('Email and password are required');
    } else if (await this.findByEmail(userDto.strEmail)) {
      throw new BadRequestException(
        'Email already exists. Please use another email',
      );
    }

    try {
      const userInfo = await this.userModel.create(userDto);
      if (!userInfo) {
        throw new InternalServerErrorException('Could not create user');
      }
      return userInfo;
    } catch (error) {
      throw error;
    }
  }
}
