import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { MailService } from 'src/mail/mail.service';
import { UserRepositoryPort } from '../domain/database/user.repostiory.port';
import { UserEssentialProperties } from '../domain/model/user.model';
import { User } from '../infrastructure/entity/user.orm-entity';
import { InjectionToken } from './injection.token';

@Injectable()
export class UserService {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async getOneByEmail(email: string): Promise<User> {
    return this.userRepository.getOneByEmail(email);
  }

  async getOneById(id: string): Promise<UserEssentialProperties> {
    return (await this.userRepository.getOneById(id)).getEssentialProperties();
  }

  async getHashedRefreshToken(id: string): Promise<User> {
    return this.userRepository.getOneWithRefreshToken(id);
  }

  async saveRefreshToken(id: string, refreshToken: string) {
    return this.userRepository.saveRefreshToken(id, refreshToken);
  }

  async sendVerificationLink(id: string): Promise<boolean> {
    const user = await this.userRepository.getOneById(id);
    if (user.isComfirmed) {
      return false;
    }
    const payload = { id };
    const token = this.jwtService.sign(payload);
    await this.mailService.sendUserConfirmation(user, token);
    return true;
  }
}
