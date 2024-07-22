import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn} from 'typeorm';
import {TextContent} from "../../translations/entities/textContent.entity";

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent
}
