import {Entity, Column, ManyToOne} from 'typeorm';
import {Language} from "./language.entity";
import {TextContent} from "./textContent.entity";

@Entity()
export class Translation {
  @Column()
  translation: string;

  @ManyToOne(() => Language, (language) => language.translations)
  language: Language

  @ManyToOne(() => TextContent, (textContent) => textContent.translations)
  textContent: TextContent
}
