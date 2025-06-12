import { Entity, Column, OneToOne, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Track } from './track.entity';

@Entity('artists')
export class Artist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => User, user => user.artist, { onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    user: User;

    @OneToMany(() => Track, (track) => track.artist)
    tracks: Track[];
}