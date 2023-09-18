import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
  
  userId: any;

  @IsOptional() // Make the tags field optional
  @IsArray()
  @ArrayNotEmpty() // Ensure the array is not empty if tags are provided
  tags?: string[];


}


