import {
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';

export function ValidateFestivalImageFilename(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateFestivalImageFilename',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value || !Array.isArray(value)) return true;

          return value.every((image: FileSystemStoredFile) => {
            if (!image || !image.originalName) return false;

            // Pattern: A or F at the beginning, then hyphen, then 1-4 digits, then file extension
            const pattern = /^[AF]-\d{1,4}\.(jpg|jpeg|png)$/i;
            return pattern.test(image.originalName);
          });
        },
        defaultMessage() {
          return 'Each image filename must start with letter A or F, followed by a hyphen, then 1-4 digits (e.g., A-0457.png, F-1023.jpg)';
        },
      },
    });
  };
}
