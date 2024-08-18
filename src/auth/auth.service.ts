import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginInfo } from './entities/auth.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(LoginInfo.name)
    private readonly jwtService: JwtService,
  ) {}

  registration(registerDTO: RegisterDTO): any {
    throw new Error('Method not implemented.');
  }
}
