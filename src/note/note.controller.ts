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
  Headers,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiResponse } from 'src/shared/response/api-respose';
import { NoteAuthGuard } from './noteguard/note.guard';
import { JwtAuthGuard } from 'src/auth/Jwt.guards';
import { TokenRevocationMiddleware } from 'src/auth/tokenrevoke/token-revocation.middleware';
import { RevokedTokenRepository } from 'src/auth/tokenrevoke/revoked-token.repository'; // Import the repository

@Controller('note')
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
    private readonly revokedTokenRepository: RevokedTokenRepository, // Inject the repository
  ) {}

  // @Get()
  // @UseGuards( TokenRevocationMiddleware, JwtAuthGuard, NoteAuthGuard)
  // async findAll(): Promise<ApiResponse> {
  //   const note = await this.noteService.findAll();
  //   return new ApiResponse(true, note);
  // }

  @Get()
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, NoteAuthGuard)
  async findAll(@Headers('authorization') token: string): Promise<ApiResponse> {
    try {
      const authToken = token.replace('Bearer ', '');
      const isTokenRevoked = await this.revokedTokenRepository.isTokenRevoked(
        authToken,
      );

      if (isTokenRevoked) {
        throw new BadRequestException(
          'Token has been revoked, Please login again',
        );
      }
      const note = await this.noteService.findAll();
      return new ApiResponse(true, note);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Token expired login again',
          error.getResponse(),
        );
      }
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ApiResponse> {
    const note = await this.noteService.findOne(id);
    return new ApiResponse(true, note);
  }

  @Post()
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, NoteAuthGuard)
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @Headers('authorization') token: string,
  ): Promise<ApiResponse> {
    try {
      // Extract the token from the Authorization header
      const authToken = token.replace('Bearer ', ''); // Remove 'Bearer ' from the token

      // Check if the token is revoked
      const isTokenRevoked = await this.revokedTokenRepository.isTokenRevoked(
        authToken,
      );

      if (isTokenRevoked) {
        throw new BadRequestException(
          'Token has been revoked, Please login again',
        );
      }

      const createNote = await this.noteService.create(createNoteDto);
      return new ApiResponse(true, createNote);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Token expired login again',
          error.getResponse(),
        );
      }
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<ApiResponse> {
    try {
      const updated = await this.noteService.update(id, updateNoteDto);
      return new ApiResponse(true, updated);
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
    return new ApiResponse(true, 'deleted');
  }
}
