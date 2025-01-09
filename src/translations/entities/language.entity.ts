import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Translation } from './translation.entity';
import { TextContent } from './textContent.entity';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '50' })
  name: string;

  @Column({ type: 'varchar', length: '50' })
  code: string;

  @OneToMany(() => Translation, (translation) => translation.language)
  translations: Translation[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
