import { AggregateRoot } from '@nestjs/cqrs';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import * as bcrypt from 'bcrypt';
import { Checking } from 'src/libs/checking';

export type UpdateUserProperties = Partial<{
  readonly name: string;
  readonly password: string;
}>;

export type UserEssentialProperties = Required<{
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
}>;

export type UserOptionalProperties = Partial<{
  readonly password: string;
  readonly refreshToken: string;
  readonly isComfirmed: boolean;
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

  @IsNotEmpty()
  @IsString()
  private role: string;

  @IsOptional()
  @IsString()
  private password: string;

  @IsOptional()
  @IsString()
  private refreshToken: string;

  @IsOptional()
  @IsBoolean()
  public isComfirmed: boolean;

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
      role: this.role,
      password: this.password,
      refreshToken: this.refreshToken,
      isComfirmed: this.isComfirmed,
    };
  }

  public getEssentialProperties(): UserEssentialProperties {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }

  public setAdminRole() {
    this.role = 'admin';
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
