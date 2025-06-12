import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Artist } from '../tracks/artist.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column()
  nickname: string;

  @OneToOne(() => Artist, artist => artist.user)
  artist: Artist;
}