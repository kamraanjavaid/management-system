import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { InventoryService, CreateProductDto, UpdateProductDto } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.inventoryService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.inventoryService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }

  @Post(':id/stock')
  async updateStock(@Param('id') id: string, @Body('change') change: number) {
    return this.inventoryService.updateStock(id, change);
  }
}
