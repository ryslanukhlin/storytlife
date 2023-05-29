import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { v4 } from 'uuid';
import * as path from 'path';

export enum FileResourceEnum {
    POST = 'POST',
    AVATAR = 'AVATAR',
    BG = 'BG',
}

@Injectable()
export class FileService {
    saveFile(img: string, type: FileResourceEnum) {
        // TODO: проверить расширение файлов по типо name.subname.extention
        // сработает ли загрузка изображение если в названия файла есть много точек
        const fileExpansion = img.substring(img.indexOf('/') + 1, img.indexOf(';'));

        const fileName = v4() + '.' + fileExpansion;
        const filePath = path.resolve(__dirname, '..', '..', 'public', 'img', type.toLowerCase());

        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }

        const imageFormatBase64 = img.split(',', 2)[1];

        fs.writeFileSync(path.resolve(filePath, fileName), imageFormatBase64, {
            encoding: 'base64',
        });

        return fileName;
    }
}
