import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';

export class Header {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  bannerTitle: TextContent;

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
