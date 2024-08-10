import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';
import { Application } from '../../applications/entities/application.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent;

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
