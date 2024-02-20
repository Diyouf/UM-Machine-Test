import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

@Module({
    imports:[
        MailerModule.forRoot({
            transport: {
              host: process.env.HOST_MAIL,
              auth: {
                user:  process.env.EMAIL,
                pass: process.env.NODE_MAILER_PASS,
              },
            },
          }),
    ]
})
export class NodeMailerModule {}
