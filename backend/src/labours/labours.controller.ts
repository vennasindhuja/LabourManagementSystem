import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { LaboursService } from './labours.service';
import { CreateLabourDto } from './dto/create-labour.dto';
import { UpdateLabourDto } from './dto/update-labour.dto';

@Controller('api/labours')
export class LaboursController {
  constructor(private readonly laboursService: LaboursService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('trade') trade?: string,
    @Query('status') status?: string,
  ) {
    return this.laboursService.findAll(search, trade, status);
  }

  @Get('trades')
  getTrades() {
    return this.laboursService.getTrades();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.laboursService.findOne(id);
  }

  @Post()
  create(@Body() createLabourDto: CreateLabourDto) {
    return this.laboursService.create(createLabourDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLabourDto: UpdateLabourDto,
  ) {
    return this.laboursService.update(id, updateLabourDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.laboursService.remove(id);
  }
}
