import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';

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
