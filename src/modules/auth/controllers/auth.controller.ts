import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { success } from 'src/helpers/http';
import { SUCCESS } from 'src/shared/constants/httpCodes';
import { AuthDTO } from '../dto/auth.dto';
import { UserRegistrationDTO } from '../dto/user-reg.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('register')
  async userRegister(
    @Req() request: Request,
    @Res() response: Response,
    @Body() registerDTO: UserRegistrationDTO,
  ) {
    try {
      const data: any = await this.authService.userRegistration(registerDTO);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      throw error;
    }
  }
}
