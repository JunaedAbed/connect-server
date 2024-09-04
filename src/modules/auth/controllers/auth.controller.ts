import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { notFound, success } from 'src/helpers/http';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { SUCCESS } from 'src/shared/constants/httpCodes';
import { AuthDTO } from '../dto/auth.dto';
import { IAuthService } from '../services/auth-service.interface';
import { AuthToken } from 'src/decorators/authToken.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IAuthService') private readonly authService: IAuthService,
  ) {}

  @Post('register')
  async userRegister(
    @Req() request: Request,
    @Res() response: Response,
    @Body() registerDTO: CreateUserDto,
  ) {
    try {
      const data: any = await this.authService.userRegistration(registerDTO);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(
    @Req() request: Request,
    @Res() response: Response,
    @Body() authDTO: AuthDTO,
  ) {
    try {
      const data: any = await this.authService.login(authDTO);

      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Post('refresh')
  async refreshToken(
    @Req() request: Request,
    @Res() response: Response,
    @Body('refresh') refresh: any,
  ) {
    try {
      const data = await this.authService.validateRefreshToken(refresh);
      if (!data) {
        return response.status(404).json(notFound('error'));
      }
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }

  @Delete('logout')
  async logout(
    @AuthToken() token: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    // const token = request.headers['authorization'].split(' ')[1];
    await this.authService.logout(token);
    return response
      .status(SUCCESS)
      .json(success({ message: 'Logged out successfully' }));
  }
}
