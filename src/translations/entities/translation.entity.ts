import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
