import { AggregateRoot } from '@nestjs/cqrs';
import * as bcrypt from 'bcrypt';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Checking } from 'src/libs/util/checking';

export type UpdateUserProperties = Partial<{
  readonly name: string;
  readonly password: string;
}>;

export type UserEssentialProperties = Required<{
  readonly id: string;
  readonly name: string;
  readonly email: string;
}>;

export type UserOptionalProperties = Partial<{
  readonly password: string;
  readonly refreshToken: string;
}>;

export type UserProperties = UserEssentialProperties &
  Required<UserOptionalProperties>;

export class UserModel extends AggregateRoot {
  @IsNotEmpty()
  @IsUUID()
  public id: string;

  @IsNotEmpty()
  @IsEmail()
  private email: string;

  @IsNotEmpty()
  @IsString()
  private name: string;

  @IsOptional()
  @IsString()
  private password: string;

  @IsOptional()
  @IsString()
  private refreshToken: string;

  constructor(properties: UserEssentialProperties & UserOptionalProperties) {
    super();
    Object.assign(this, properties);
  }

  public setRefreshToken(v: string): void {
    const salt: string = bcrypt.genSaltSync();
    this.refreshToken = bcrypt.hashSync(v, salt);
  }

  public getProperties(): UserProperties {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      refreshToken: this.refreshToken,
    };
  }

  public setPassword(password: string): void {
    const salt: string = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(password, salt);
  }

  public getPassword(): string {
    return this.password;
  }

  public getRefreshToken(): string {
    return this.refreshToken;
  }

  public edit(data: UpdateUserProperties): void {
    if (!Checking.isEmpty(data.name)) {
      this.name = data.name;
    }
    if (!Checking.isEmpty(data.password)) {
      const salt: string = bcrypt.genSaltSync();
      this.password = bcrypt.hashSync(data.password, salt);
    }
  }
}
