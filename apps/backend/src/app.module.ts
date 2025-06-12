import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { VerificationsModule } from './verifications/verifications.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [UsersModule, JobsModule, ApplicationsModule, VerificationsModule, AttendanceModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
