import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Translation} from "./translation.entity";
import {TextContent} from "./textContent.entity";

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '50', })
  name: string;

  @OneToMany(type => Translation, (translation) => translation.language)
  translations: Translation[];

  @OneToMany(type => TextContent, (textContent) => textContent.originalLanguage)
  textContents: TextContent[];
}
