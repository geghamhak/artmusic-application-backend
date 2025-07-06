import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    providedPassword: string,
  ): Promise<{ accessToken: string }> {
    try {
      const admin = await this.adminService.findOne(username);
      if (
        !(
          admin?.password &&
          this.adminService.comparePassword(admin.password, providedPassword)
        )
      ) {
        throw new UnauthorizedException();
      }
      const payload = { sub: admin.id, username: admin.username };
      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw error;
    }
  }
}
