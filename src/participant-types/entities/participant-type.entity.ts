import {Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {TextContent} from "../../translations/entities/textContent.entity";
import {Application} from "../../applications/entities/application.entity";

@Entity()
export class ParticipantType {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  type: TextContent

  @OneToMany(() => Application, (application) => application.festival)
  applications: Application[]
}
