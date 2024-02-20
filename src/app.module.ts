import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAuthModule } from './user-auth/user-auth.module';
import { PrismaService } from './config/prisma.service';
import { NodeMailerModule } from './config/node-mailer.module';

@Module({
  imports: [UserAuthModule, NodeMailerModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
