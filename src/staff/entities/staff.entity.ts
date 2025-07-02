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
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent;

  @OneToOne(() => TextContent)
  @JoinColumn()
  description: TextContent;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
