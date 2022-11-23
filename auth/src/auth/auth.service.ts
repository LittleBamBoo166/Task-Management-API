import { Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { catchError, throwError, timeout, TimeoutError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_CLIENT') private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  validateToken(jwt: string) {
    const result = this.jwtService.verify(jwt);
    return result;
  }

  async getUserWithRefreshToken(id: string): Promise<any> {
    try {
      const user = await this.userClient
        .send({ role: 'user', cmd: 'get_user_with_refresh_token' }, { id })
        .pipe(
          timeout(5000),
          catchError((err) => {
            Logger.error('🐞  Get user with refresh token failed');
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        )
        .toPromise();
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<any> {
    try {
      const user = await this.userClient
        .send({ role: 'user', cmd: 'get_user_by_id' }, { id })
        .pipe(
          timeout(5000),
          catchError((err) => {
            Logger.error('🐞  Get user by id failed');
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        )
        .toPromise();
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    try {
      Logger.log('Getting user .....');
      const user = await this.userClient
        .send({ role: 'user', cmd: 'get_user_by_email' }, { email })
        .pipe(
          timeout(5000),
          catchError((err) => {
            Logger.error('🐞  Get user by email failed');
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        )
        .toPromise();
      Logger.log('Get user successfull');
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      Logger.log('Validating user ....');
      const user = await this.getUserByEmail(email);
      if (!user) {
        return null;
      }
      if (compareSync(password, user?.password)) {
        return user;
      }
      return null;
    } catch (error) {
      Logger.log(error);
      throw error;
    }
  }

  async refresh(user: any) {
    const accessToken = this.generateAccessToken(user);
    return {
      id: user.id,
      accessToken,
    };
  }

  async login(user) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return {
      userId: user.id,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private generateAccessToken(user: any) {
    const payload = {
      username: user.name,
      email: user.email,
      id: user.id,
      isComfirmed: user.isComfirmed,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(user: any): Promise<string> {
    try {
      const payload = { username: user.name, email: user.email, id: user.id };
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.REFRESH_SECRECT,
        expiresIn: process.env.REFRESH_EXPIRE,
      });
      const salt = genSaltSync();
      const hashedRefreshToken = hashSync(refreshToken, salt);
      // console.log(hashedRefreshToken);
      await this.userClient
        .send(
          { role: 'user', cmd: 'save_refresh_token' },
          { id: user.id, hashedRefreshToken },
        )
        .pipe(
          timeout(5000),
          catchError((err: Error) => {
            Logger.error('🐞  Save refresh token failed');
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        )
        .toPromise();
      return refreshToken;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    const user = await this.getUserByEmail(req.user.email);
    if (!user) {
      const userId = await this.registerWithGoogleAccount(req.user);
      if (!userId) {
        return null;
      }
      return this.login({
        id: userId,
        ...req.user,
      });
    }
    return this.login(user);
  }

  async registerWithGoogleAccount(user: any) {
    try {
      const payload = { name: user.name, email: user.email };
      const userCreated = await this.userClient
        .send({ role: 'user', cmd: 'register_with_google_account' }, payload)
        .pipe(
          timeout(5000),
          catchError((err) => {
            Logger.error('🐞  Register with Google account failed');
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        )
        .toPromise();
      if (!userCreated) {
        return null;
      }
      return userCreated.id;
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}
