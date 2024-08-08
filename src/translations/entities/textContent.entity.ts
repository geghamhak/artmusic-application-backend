import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne} from 'typeorm';
import {Translation} from "./translation.entity";
import {Language} from "./language.entity";

@Entity()
export class TextContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255' })
  originalText: string;

  @ManyToOne(() => Language, (language) => language.textContents)
  originalLanguage: Language

  @OneToMany(type => Translation, (translation) => translation.textContent)
  translations: Translation[];
}
