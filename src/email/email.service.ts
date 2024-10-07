import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private mail: Mail;

  constructor(private readonly configService: ConfigService) {
    this.mail = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  // 메일 보내는 로직
  sendMail(options: Mail.Options) {
    return this.mail.sendMail(options);
  }
}
