import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Language } from './language.entity';
import { TextContent } from './textContent.entity';

@Entity()
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255' })
  translation: string;

  @ManyToOne(() => Language, (language) => language.translations)
  language: Language;

  @ManyToOne(() => TextContent, (textContent) => textContent.translations)
  textContent: TextContent;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
