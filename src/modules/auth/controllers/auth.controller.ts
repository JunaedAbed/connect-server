import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { requestInvalid, success } from 'src/helpers/http';
import { REQUEST_ERROR, SUCCESS } from 'src/shared/constants/httpCodes';
import { UserRegistrationDTO } from '../dto/user-reg.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Req() request: Request,
    @Res() response: Response,
    @Body() registerDTO: UserRegistrationDTO,
  ) {
    try {
      const data: any = await this.authService.registration(registerDTO);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      return response.status(REQUEST_ERROR).json(requestInvalid(error));
    }
  }
}
