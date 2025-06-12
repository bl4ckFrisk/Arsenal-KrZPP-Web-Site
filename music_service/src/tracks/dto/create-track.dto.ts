import { IsString } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  title: string;
}