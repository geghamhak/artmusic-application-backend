import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Admin } from '../../admin/entities/admin.entity';
import { randomBytes, scryptSync } from 'crypto';

const Admins = [
  {
    username: 'admin',
    password: '1234',
  },
  {
    username: 'ernest.pichikyan',
    password: 'artmusic',
  },
];
export default class AdminSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('DELETE FROM admin');
    await dataSource.query('ALTER TABLE admin AUTO_INCREMENT = 1');
    const adminRepository = dataSource.getRepository(Admin);
    for (const admin of Admins) {
      try {
        const newAdmin = new Admin();
        newAdmin.username = admin.username;
        const salt = randomBytes(16).toString('hex');
        const buf = scryptSync(admin.password, salt, 64) as Buffer;
        newAdmin.password = `${buf.toString('hex')}.${salt}`;
        await adminRepository.save(newAdmin);
      } catch (e) {
        throw new Error(e);
      }
    }
  }
}
