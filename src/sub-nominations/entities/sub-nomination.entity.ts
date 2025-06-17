import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Nomination } from '../../nominations/entities/nomination.entity';
import { TextContent } from '../../translations/entities/textContent.entity';
import { Application } from '../../applications/entities/application.entity';
import { FestivalImage } from '../../festival-images/entities/festival-image.entity';

@Entity()
export class SubNomination {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent;

  @ManyToOne(() => Nomination, (nomination) => nomination.subNominations)
  nomination: Nomination;

  @OneToMany(() => Application, (application) => application.subNomination)
  applications: Application[];

  @OneToMany(
    () => FestivalImage,
    (festivalImage) => festivalImage.subNomination,
  )
  festivalImages: FestivalImage[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
