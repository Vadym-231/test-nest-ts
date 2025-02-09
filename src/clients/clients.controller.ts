import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { AddClientDto } from './dto/add-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private clients: ClientsService) {}

  @Get()
  getClients() {
    return this.clients.getClients();
  }

  @Get(':id')
  getClientById(@Param('id') id) {
    return this.clients.getClientById(id);
  }

  @Post()
  addClient(@Body() clientPayload: AddClientDto) {
    return this.clients.addClient(clientPayload);
  }
}
