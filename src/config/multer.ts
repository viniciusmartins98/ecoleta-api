import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename: (req, file, callback) => {
            const hash = crypto.randomBytes(6).toString('hex');

            const fileName = `${hash}-${file.originalname}`;

            callback(null, fileName);
        }
    }),
    limits : {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req: any, file: any, callback: any) => {
        if(file.mimetype === "image/jpg"  ||
           file.mimetype === "image/jpeg" ||
           file.mimetype === "image/png") {

            callback(null, true);
        } else {
            callback(new Error("Formato inválido de imagem (JPG, JPEG ou PNG"));
        }
    }
};