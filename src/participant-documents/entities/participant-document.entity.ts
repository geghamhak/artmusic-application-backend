import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Application} from "../../applications/entities/application.entity";

@Entity()
export class ParticipantDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Application, (application) => application.participants)
  application: Application;
}
