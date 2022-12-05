import { Injectable } from '@nestjs/common';
import { Ticket } from '@prisma/client';

import { PrismaService } from 'src/provider/prisma/prisma.service';
import CreateTicketDto from './dto/create-ticket.dto';
import UpdateTicketDto from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  getTicketHello(): string {
    return 'Ticket server is running!';
  }

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.prisma.ticket.create({
      data: createTicketDto,
    });
  }

  async find(ticketId: number): Promise<Ticket> {
    return this.prisma.ticket.findUnique({ where: { id: ticketId } });
  }

  async findAll(): Promise<Ticket[]> {
    return this.prisma.ticket.findMany({});
  }

  async delete(ticketId: number): Promise<Ticket> {
    return this.prisma.ticket.delete({ where: { id: ticketId } });
  }

  async update(
    ticketId: number,
    updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.prisma.ticket.update({
      where: { id: ticketId },
      data: updateTicketDto,
    });
  }

  async findAllByUserId() {}
}