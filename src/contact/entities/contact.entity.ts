import { TextContent } from '../../translations/entities/textContent.entity';
import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent, { onDelete: 'CASCADE' })
  @JoinColumn()
  information: TextContent;

  @Column({ type: 'varchar', length: '100', nullable: true })
  location: string;
}
