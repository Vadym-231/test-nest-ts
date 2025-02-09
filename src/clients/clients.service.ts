import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddClientDto } from './dto/add-client.dto';
import { Client } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}
  async addClient({ name, quota }: AddClientDto) {
    const { id } = await this.prisma.client.create({
      data: {
        name,
        quotasPercent: quota,
      },
    });
    return { id };
  }
  async getClients(): Promise<Client[]> {
    return this.prisma.client.findMany();
  }
  async getClientById(id: number): Promise<Client> {
    return this.prisma.client.findFirstOrThrow({
      select: {
        id: true,
        name: true,
        quotasPercent: true,
        balance: true,
      },
      where: { id: Number(id) },
    });
  }
}
