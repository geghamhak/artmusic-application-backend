import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {FestivalType} from "../../festival-types/entities/festival-type.entity";

@Entity()
export class ScoringSystem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'tinyint'})
  minAmount: number;

  @Column({ type: 'tinyint'})
  maxAmount: number;

  @Column({ type: 'tinyint'})
  place: number;

  @ManyToOne(() => FestivalType, (festivalType) => festivalType.nominations)
  festivalType: FestivalType
}
