import {Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {TextContent} from "../../translations/entities/textContent.entity";
import {FestivalType} from "../../festival-types/entities/festival-type.entity";
import {Application} from "../../applications/entities/application.entity";

@Entity()
export class Festival {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent

  @OneToOne(() => TextContent)
  @JoinColumn()
  description: TextContent

  @ManyToOne(() => FestivalType, (festivalType) => festivalType.nominations)
  festivalType: FestivalType

  @OneToMany(() => Application, (application) => application.festival)
  applications: Application[]
}