import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Artist } from './artist.entity';

@Entity()
export class Track {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    duration: number;

    @Column()
    filePath: string;

    @Column({ nullable: true, type: 'varchar' })
    coverPath?: string;

    @ManyToOne(() => Artist, (artist) => artist.tracks, { eager: true })
    artist: Artist;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}