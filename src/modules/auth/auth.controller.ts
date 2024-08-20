import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { requestInvalid, success } from 'src/helpers/http';
import { REQUEST_ERROR, SUCCESS } from 'src/shared/constants/httpCodes';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Req() request: Request,
    @Res() response: Response,
    @Body() registerDTO: RegisterDTO,
  ) {
    try {
      const data: any = await this.authService.registration(registerDTO);
      console.log('here');
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      console.log('hereeeeee');

      return response.status(REQUEST_ERROR).json(requestInvalid(error));
    }
  }
}
