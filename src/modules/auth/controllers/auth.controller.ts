import { Body, Controller, Delete, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { success } from 'src/helpers/http';
import { SUCCESS } from 'src/shared/constants/httpCodes';
import { AuthDTO } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Delete('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const token = request.headers['authorization'].split(' ')[1];
    await this.authService.logout(token);
    return response
      .status(SUCCESS)
      .json(success({ message: 'Logged out successfully' }));
  }
}
