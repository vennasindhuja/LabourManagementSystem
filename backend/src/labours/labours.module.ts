import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Labour } from './entities/labour.entity';
import { LaboursService } from './labours.service';
import { LaboursController } from './labours.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Labour])],
  controllers: [LaboursController],
  providers: [LaboursService],
  exports: [LaboursService],
})
export class LaboursModule {}
