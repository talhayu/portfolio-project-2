import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiResponse } from 'src/shared/response/api-respose';
import { NoteAuthGuard } from './noteguard/note.guard';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}
  @Get()
  async findAll(): Promise<ApiResponse> {
    const note = await this.noteService.findAll();
    return new ApiResponse(true, note);
  }
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponse> {
    const note = await this.noteService.findOne(id);
    return new ApiResponse(true, note);
  }

  @Post()
  @UseGuards(NoteAuthGuard)
   async create(@Body() createNoteDto: CreateNoteDto): Promise<ApiResponse> {
    try{
      const createNote=  await this.noteService.create(createNoteDto);
      return new ApiResponse(true, createNote );
    }
    catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Invalid data provided.',
          error.getResponse(),
        );
      }
      throw error;
    }
  }



  @Patch(':id')
 async update(@Param('id') id: number, @Body() updateNoteDto: UpdateNoteDto) : Promise<ApiResponse> {
    try {
      const updated = await this.noteService.update(id, updateNoteDto);
       return new ApiResponse(true, updated)
   } catch (error) {
     if (error instanceof NotFoundException) {
       throw new NotFoundException(`Menu category with ID ${id} not found.`);
     } else if (error instanceof BadRequestException) {
       throw new BadRequestException(
         'Invalid data provided.',
         error.getResponse(),
       );
     }
     throw error;
   }
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<ApiResponse> {
    await this.noteService.delete(id);
    return new ApiResponse(true, 'deleted')
  }
}
