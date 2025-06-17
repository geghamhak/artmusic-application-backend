import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailQueue {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: '50' })
  type: string;
  @Column({ type: 'varchar', length: '250' })
  emailsTo: string;
  @Column({ type: 'varchar', length: '150' })
  subject: string;
  @Column({ type: 'varchar', length: '50' })
  status: string;
  @Column({ type: 'varchar', length: '50' })
  languageCode: string;
}
