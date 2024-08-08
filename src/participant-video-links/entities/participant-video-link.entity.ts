import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Application} from "../../applications/entities/application.entity";

@Entity()
export class ParticipantVideoLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255', nullable: true })
  link: string;

  @ManyToOne(() => Application, (application) => application.participants)
  application: Application;
}
