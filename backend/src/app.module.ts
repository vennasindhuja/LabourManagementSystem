import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaboursModule } from './labours/labours.module';
import { ProjectsModule } from './projects/projects.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PayrollModule } from './payroll/payroll.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SeedModule } from './seed/seed.module';
import { Labour } from './labours/entities/labour.entity';
import { Project } from './projects/entities/project.entity';
import { Attendance } from './attendance/entities/attendance.entity';
import { Payroll } from './payroll/entities/payroll.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', '127.0.0.1'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'Sindhuja'),
        database: configService.get<string>('DB_NAME', 'testdb'),
        entities: [Labour, Project, Attendance, Payroll],
        synchronize: true, // auto create & sync database tables
        logging: false,
      }),
    }),
    LaboursModule,
    ProjectsModule,
    AttendanceModule,
    PayrollModule,
    DashboardModule,
    SeedModule,
  ],
})
export class AppModule {}
