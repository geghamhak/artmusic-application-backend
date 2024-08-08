import {Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany} from 'typeorm';
import {TextContent} from "../../translations/entities/textContent.entity";
import {Application} from "../../applications/entities/application.entity";

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent

  @OneToMany(() => Application, (application) => application.festival)
  applications: Application[]
}
