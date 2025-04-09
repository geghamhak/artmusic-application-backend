import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  UploadMultipleFiles,
  UploadSingleFile,
  UploadSingleFileResponse,
} from './dms.service-types';

@Injectable()
export class DmsService {
  private readonly client: S3Client;
  private bucketName = this.configService.get('S3_BUCKET_NAME');
  private readonly s3Region = this.configService.get('S3_REGION');
  private readonly accessKeyId = this.configService.get('S3_ACCESS_KEY');
  private readonly secretAccessKey = this.configService.get(
    'S3_SECRET_ACCESS_KEY',
  );

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: this.s3Region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async uploadMultipleFiles({
    files,
    entity,
    entityId,
    isPublic = true,
  }: UploadMultipleFiles): Promise<UploadSingleFileResponse[]> {
    return Promise.all(
      files.map(async (file) => {
        return await this.uploadSingleFile({
          file,
          entity,
          entityId,
          isPublic,
        });
      }),
    );
  }

  async uploadSingleFile({
    file,
    entity,
    entityId,
    isPublic = true,
  }: UploadSingleFile): Promise<UploadSingleFileResponse> {
    try {
      const id = uuidv4();
      const key = `${entity}/${entityId}/${id}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: isPublic ? 'public-read' : 'private',
        Metadata: {
          originalName: file.originalname,
          entity,
          id,
        },
      });

      await this.client.send(command);

      return {
        url: isPublic
          ? (await this.getFileUrl(key)).url
          : (await this.getPreSignedUrl(key)).url,
        key,
        isPublic,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getFileUrl(key: string) {
    return { url: `https://${this.bucketName}.s3.amazonaws.com/${key}` };
  }

  async getPreSignedUrl(key: string): Promise<{ url: string }> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 24,
      });

      return { url };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteFile(key: string): Promise<{ message: string }> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(command);

      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
