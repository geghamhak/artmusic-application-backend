import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(
    @Body() signInDto: Record<string, any>,
    @Res({ passthrough: true }) response,
  ) {
    const accessToken = this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );

    response.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000,
    });

    return { success: true };
  }
}
