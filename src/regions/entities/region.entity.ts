import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';
import { School } from '../../schools/entities/school.entity';
import { Application } from '../../applications/entities/application.entity';

@Entity()
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent;

  @OneToMany(() => School, (school) => school.region)
  schools: School[];

  @OneToMany(() => Application, (application) => application.festival)
  applications: Application[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
