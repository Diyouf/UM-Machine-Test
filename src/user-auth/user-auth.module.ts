import { Module } from '@nestjs/common';
import { UserAuthController } from './user-auth.controller';
import { UserAuthService } from './user-auth.service';
import { PrismaService } from '../config/prisma.service';

@Module({
  controllers: [UserAuthController],
  providers: [UserAuthService,PrismaService]
})
export class UserAuthModule {

}
