import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';

@Entity()
export class HomePage {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  title: TextContent;

  @OneToOne(() => TextContent)
  @JoinColumn()
  information: TextContent;

  @Column({ type: 'varchar', length: '255' })
  videoLink: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
