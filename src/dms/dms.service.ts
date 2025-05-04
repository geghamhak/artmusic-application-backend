import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  UploadMultipleFiles,
  UploadSingleFile,
  UploadSingleFileResponse,
} from './dms.service-types';
import { _Object } from '@aws-sdk/client-s3/dist-types/models/models_0';

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
    type,
  }: UploadMultipleFiles): Promise<UploadSingleFileResponse[]> {
    return Promise.all(
      files.map(async (file) => {
        return await this.uploadSingleFile({
          file,
          entity,
          entityId,
          type,
          isPublic,
        });
      }),
    );
  }

  async uploadSingleFile({
    file,
    entity,
    entityId,
    type,
  }: UploadSingleFile): Promise<void> {
    try {
      const key = type ? `${entity}/${entityId}/${type}/${id}` : `${entity}/${entityId}/${id}`;
      const id = uuidv4();
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private',
        Metadata: {
          originalName: file.originalname,
          entity,
          id,
        },
      });

      await this.client.send(command);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // prefix /entity/entityId/type?/
  async getPreSignedUrls(prefix: string): Promise<{ url: string, key: string }[]> {
    try {
      const urls = [];
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
      });

      const s3Objects = await this.client.send(command) as ListObjectsV2Output;

      s3Objects.Contents.map((image): _Object => {
        const key = image.Key;
        const urlCommand = new ListObjectsV2Command({
          Bucket: this.bucketName,
          Prefix: key,
        });
        const url = await getSignedUrl(this.client, urlCommand, {
          expiresIn: 60 * 60 * 24,
        });
        urls.push({ url, key });
      });

      return urls;
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
