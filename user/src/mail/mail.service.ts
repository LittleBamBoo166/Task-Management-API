import { MailerService } from '@nestjs-modules/mailer/dist';
import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/user/domain/model/user.model';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserModel, token: string) {
    const url = `http://localhost:4001/users/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.getProperties().email,
      subject: 'Welcome to the Best App in the World 🎉🎉🎉',
      template: './confirmation',
      context: {
        name: user.getProperties().name,
        url: url,
      },
    });
  }
}
