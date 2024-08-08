import {Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {TextContent} from "../../translations/entities/textContent.entity";
import {Region} from "../../regions/entities/region.entity";
import {Application} from "../../applications/entities/application.entity";

@Entity()
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent

  @ManyToOne(() => Region, (region) => region.schools)
  region: Region

  @OneToMany(() => Application, (application) => application.festival)
  applications: Application[]
}
