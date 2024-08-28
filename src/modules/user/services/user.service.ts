import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { IUserService } from './user-service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async findByEmail(strEmail: string): Promise<User> {
    try {
      const userInfo = await this.userModel
        .findOne({ strEmail }) // Find the user by email
        .populate('strRoleId', 'strRoleName')
        .exec(); // Execute the query

      return userInfo;
    } catch (error) {
      throw error;
    }
  }

  async findByPhone(strMobileNumber: string): Promise<User> {
    try {
      const userInfo = await this.userModel
        .findOne({ strMobileNumber }) // Find the user by phone
        .populate('strRoleId', 'strRoleName') // Populate role fields
        .exec(); // Execute the query

      return userInfo;
    } catch (error) {
      throw error;
    }
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    // if (!userDto.strEmail || !userDto.strPassword) {
    //   throw new BadRequestException('Email and password are required');
    // } else if (await this.findByEmail(userDto.strEmail)) {
    //   throw new BadRequestException(
    //     'Email already exists. Please use another email',
    //   );
    // }

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
