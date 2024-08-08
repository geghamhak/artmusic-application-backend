import {Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Nomination} from "../../nominations/entities/nomination.entity";
import {TextContent} from "../../translations/entities/textContent.entity";

@Entity()
export class SubNomination {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent

  @ManyToOne(() => Nomination, (nomination) => nomination.subNominations)
  nomination: Nomination
}