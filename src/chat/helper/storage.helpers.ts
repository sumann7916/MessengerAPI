import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

const limits = {
  fileSize: 1024 * 1024 * 3, // accepts less than or equal to 3 MB
};

const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|PNG|JPG|JPEG)$/)) {
    return callback(new BadRequestException('Only image is allowed.'), false);
  }
  callback(null, true);
};

//TODO
// const docFileFilter = (req: any, file: any, callback: any) => {
//   if (!file.mimetype.match(/\/(png|docx)$/)) {
//     return callback(
//       new BadRequestException('Only pdf and docx file is allowed.'),
//       false,
//     );
//   }
//   callback(null, true);
// };

const filename = (req: any, file: any, callback: any) => {
  const fileExtName = extname(file.originalname);

  callback(null, `${uuidv4()}${fileExtName}`);
};

export { limits, imageFileFilter, filename };