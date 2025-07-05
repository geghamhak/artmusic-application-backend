import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ accessToken: string }> {
    const admin = await this.adminService.findOne(username);
    if (!(admin?.password && (await bcrypt.compare(pass, admin.password)))) {
      throw new UnauthorizedException();
    }
    const payload = { sub: admin.id, username: admin.username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
