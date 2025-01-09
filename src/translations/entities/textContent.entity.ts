import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Translation } from './translation.entity';
import { Language } from './language.entity';

@Entity()
export class TextContent {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Translation, (translation) => translation.textContent)
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
