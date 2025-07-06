import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    try {
      const { username, password } = createAdminDto;
      const newAdmin = new Admin();
      newAdmin.username = username;
      newAdmin.password = this.hashPassword(password);

      return await this.adminRepository.save(newAdmin);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(username: string) {
    return this.adminRepository
      .createQueryBuilder('admin')
      .where('username = :username', { username })
      .getOne();
  }

  hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const buf = scryptSync(password, salt, 64) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }

  comparePassword(storedPassword: string, suppliedPassword: string): boolean {
    const [hashedPassword, salt] = storedPassword.split('.');
    const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
    const suppliedPasswordBuf = scryptSync(
      suppliedPassword,
      salt,
      64,
    ) as Buffer;
    return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
  }
}
