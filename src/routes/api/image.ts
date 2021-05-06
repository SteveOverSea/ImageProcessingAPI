import express from 'express';
import Path from 'path';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import fileUpload, { UploadedFile } from 'express-fileupload';

const image = express.Router();
const inputDir = 'images';
const outputDir = 'thumbs';

image.post('/', fileUpload(), (req: express.Request, res: express.Response) => {
    if (req.files && req.files.upload) {
        const uploadedFile = req.files.upload as UploadedFile;
        uploadedFile.mv(`./images/${uploadedFile.name}`, (err) => {
            if (err) console.log(err);
        });
        console.log('uploaded file');
        res.redirect(200, '/');
    } else {
        console.log('error while uplading file');
        res.redirect(400, '/');
    }
});

// returns true if filename is in input directory
export async function isFilenameOnServer(filename: string) {
    try {
        const files = await fs.readdir(inputDir);
        const fileNames = files.map((file) => file.split('.')[0]);

        const found = fileNames.find((name) => name == filename);

        if (found) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

// returns file extentions for given filename in input directory
export async function getFileExtension(filename: string) {
    try {
        const files = await fs.readdir(inputDir);
        const reqfile = files.find((file) => file.split('.')[0] == filename);
        return reqfile?.split('.')[1];
    } catch (error) {
        console.log(error);
    }
}

image.get('/', async (req: express.Request, res: express.Response) => {
    const filename = req.query.filename as string;
    const width = req.query.width as string;
    const height = req.query.height as string;
    let fileExtension;

    try {
        // check if query is sufficient
        if (!filename || !width || !height) {
            throw new Error('invalid query string');
        }

        // check if requested filename is available
        if (!(await isFilenameOnServer(filename))) {
            throw new Error('no equivalent filename on server!');
        }

        // get file extension
        fileExtension = await getFileExtension(filename);
        console.log(fileExtension);

        // check if "thumbs" output directory exists
        await fs.access(outputDir);

        // check if thumb image already exists
        await fs.access(
            `${outputDir}/${filename}${width}x${height}.${fileExtension}`
        );

        // then send the file which is already there
        res.sendFile(
            Path.resolve(
                `${outputDir}/${filename}${width}x${height}.${fileExtension}`
            )
        );

        console.log('returned already processed image');
        // end route here
        return;
    } catch (error) {
        // found no corresponding file on server or invalid query string
        if (
            error.message == 'invalid query string' ||
            error.message == 'no equivalent filename on server!'
        ) {
            console.log(error.message);
            return res.status(400).end(error.message);

            // found no corresponding output folder, creates one
        } else if (
            error.code == 'ENOENT' &&
            error.syscall == 'access' &&
            error.path == outputDir
        ) {
            console.log('no output folder, creating one');

            try {
                await fs.mkdir(outputDir);
            } catch (error) {
                console.log(error);
            }

            // found output folder but there is not an already process file
        } else if (
            error.code == 'ENOENT' &&
            error.syscall == 'access' &&
            error.path ==
                `${outputDir}/${filename}${width}x${height}.${fileExtension}`
        ) {
            console.log("directory exists, but file doesn't");
        } else {
            console.log(error);
        }
    }

    // only run sharp when there is not an processed image already sent
    try {
        const path = Path.resolve(`${inputDir}/${filename}.${fileExtension}`);

        console.log('processing image');

        await sharp(path)
            .resize(parseInt(width), parseInt(height))
            .toFile(
                `${outputDir}/${filename}${width}x${height}.${fileExtension}`
            );

        res.sendFile(
            Path.resolve(
                `${outputDir}/${filename}${width}x${height}.${fileExtension}`
            )
        );
    } catch (error) {
        console.log(error);
    }
});

export default image;
