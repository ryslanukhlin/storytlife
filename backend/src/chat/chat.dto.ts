import { IsString } from 'class-validator';

export class ChatDto {
    @IsString()
    roomId: string;

    @IsString()
    userId: string;

    txt: string;
}
