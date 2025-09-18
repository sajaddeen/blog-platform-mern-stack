import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class FilesService {
  saveFile(file: Express.Multer.File): string {
    if (!file) {
      throw new HttpException('File not found', HttpStatus.BAD_REQUEST);
    }
    return `/uploads/${file.filename}`;
  }
}