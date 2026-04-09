import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async uploadImage(userId: string, file: { buffer: Buffer; mimetype: string; size: number; originalname: string }) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File must be under 10MB');
    }

    const cloudinaryUrl = this.config.get('CLOUDINARY_URL');
    if (!cloudinaryUrl) {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      return this.prisma.uploadedImage.create({
        data: {
          userId,
          originalUrl: dataUri,
          mimeType: file.mimetype,
          sizeBytes: file.size,
        },
      });
    }

    const [, credentials, host] = cloudinaryUrl.match(/cloudinary:\/\/(\d+:\w+)@(\w+)/) || [];
    const [apiKey, apiSecret] = (credentials || '').split(':');

    const formData = new FormData();
    formData.append('file', new Blob([new Uint8Array(file.buffer)]), file.originalname);
    formData.append('upload_preset', 'bengalstitch');
    formData.append('api_key', apiKey);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${host}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();

    return this.prisma.uploadedImage.create({
      data: {
        userId,
        originalUrl: data.secure_url,
        thumbnailUrl: data.secure_url.replace('/upload/', '/upload/w_200,h_200,c_fill/'),
        mediumUrl: data.secure_url.replace('/upload/', '/upload/w_600,c_limit/'),
        largeUrl: data.secure_url.replace('/upload/', '/upload/w_1200,c_limit/'),
        mimeType: file.mimetype,
        sizeBytes: file.size,
        width: data.width,
        height: data.height,
      },
    });
  }

  async getMyImages(userId: string, page = 1) {
    const limit = 30;
    return this.prisma.uploadedImage.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
