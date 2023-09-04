import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MATCHES,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'invalid email adddreas' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,15}$/, {
    message: "password expectation doesn't meet",
  })
  password: string;

}
