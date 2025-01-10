import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';

export class Staff {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent;

  @OneToOne(() => TextContent)
  @JoinColumn()
  role: TextContent;

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
