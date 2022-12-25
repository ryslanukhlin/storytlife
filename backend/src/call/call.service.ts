import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CallService {
    constructor(private readonly prisma: PrismaService) {}

    async removeCallStatusUsers(userId: string, frendId: string) {
        await this.prisma.user.updateMany({
            where: {
                OR: [{ id: userId }, { id: frendId }],
            },
            data: {
                on_call: false,
            },
        });
    }
}
