import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RepairsService } from './repairs.service';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('repairs')
@UseGuards(JwtAuthGuard)
export class RepairsController {
  constructor(private readonly repairsService: RepairsService) {}

  @Post()
  create(@Body() dto: CreateRepairDto) {
    return this.repairsService.create(dto);
  }

  @Get()
  findAll() {
    return this.repairsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repairsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRepairDto) {
    return this.repairsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repairsService.remove(id);
  }
}
