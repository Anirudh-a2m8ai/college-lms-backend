import { BadRequestException } from '@nestjs/common';

export const fileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: Function,
) => {
  const allowedMimeTypes = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(
      new BadRequestException('Only CSV and Excel files allowed'),
      false,
    );
  }

  callback(null, true);
};

export const multerOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
};