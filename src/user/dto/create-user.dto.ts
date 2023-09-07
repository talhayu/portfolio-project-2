import {
  IsEmail,
  IsNotEmpty,
  IsString,
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
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,15}$/, {
    message: "Password expectation doesn't meet",
  })
  password: string;

  // @IsN()
  // @IsStrinconst newLocal = /g({ each: true }) / / Define; roles as an array of strings
  roles: boolean[]; // Make sure roles property is defined
}
