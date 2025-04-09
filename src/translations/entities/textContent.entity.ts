import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Translation } from './translation.entity';

@Entity()
export class TextContent {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Translation, (translation) => translation.textContent)
  translations: Translation[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
