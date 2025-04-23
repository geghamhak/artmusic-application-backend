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
export class Header {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  bannerTitle: TextContent;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
