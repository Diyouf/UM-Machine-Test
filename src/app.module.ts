import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserAuthModule } from './user-auth/user-auth.module';
import { PrismaService } from './config/prisma.service';
import { NodeMailerModule } from './config/node-mailer.module';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './common/authMiddleware';

@Module({
  imports: [UserAuthModule, NodeMailerModule, UserModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // Apply the AuthMiddleware
      .forRoutes(
      'user/userProfile',
      'user/userProfileUpdate',
      'userAuth/refreshToken'
      )
      // Specify the route(s) where you want to apply the middleware
  }
}
