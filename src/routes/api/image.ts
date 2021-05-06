import express from 'express';
import Path from 'path';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import fileUpload, { UploadedFile } from "express-fileupload";

const image = express.Router();
const inputDir = 'images';
const outputDir = 'thumbs';

// template for images name: [filename][width]x[height].jpg

async function isFilenameOnServer(filename: string) {
    const files = await fs.readdir(inputDir);
    const fileNames = files.map((file) => file.split('.')[0]);

    const found = fileNames.find((name) => name == filename);

    if (found) {
        return true;
    } else {
        return false;
    }
}

image.post("/", fileUpload(), (req, res) => {
    if(req.files && req.files.upload) {
        let uploadedFile = req.files.upload as UploadedFile;
        uploadedFile.mv(`./images/${uploadedFile.name}`, (err) => {
            if(err) console.log(err);
        });
        res.send("file upload succesful");
    } else {
        console.log("no file");
        res.send("file not uploaded");
    }
});

image.get('/', async (req, res) => {
    const filename = req.query.filename as string;
    const width = req.query.width as string;
    const height = req.query.height as string;

    try {
        // check if query is sufficient
        if (!filename || !width || !height) {
            throw new Error('invalid query string');
        }

        // check if requested filename is available
        if (!(await isFilenameOnServer(filename))) {
            throw new Error('no equivalent filename on server!');
        }

        // check if "thumbs" output directory exists
        await fs.access(outputDir);

        // check if thumb image already exists
        await fs.access(`${outputDir}/${filename}${width}x${height}.jpg`);

        // then send the file which is already there
        res.sendFile(
            Path.resolve(`${outputDir}/${filename}${width}x${height}.jpg`)
        );

        console.log('sent already processed image');
        return;
        // end route here
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
            console.log("no output folder, let's create one ...");

            try {
                await fs.mkdir(outputDir);
            } catch (error) {
                console.log(error);
            }

            // found output folder but there is not an already process file
        } else if (
            error.code == 'ENOENT' &&
            error.syscall == 'access' &&
            error.path == `${outputDir}/${filename}${width}x${height}.jpg`
        ) {
            console.log("directory exists, but file doesn't");
        } else {
            console.log(error);
        }
    }

    // only run sharp when there is not an processed image already sent
    try {
        const path = Path.resolve(`${inputDir}/${filename}.jpg`);

        console.log('creating image');

        await sharp(path)
            .resize(parseInt(width), parseInt(height))
            .toFile(`${outputDir}/${filename}${width}x${height}.jpg`);

        res.sendFile(
            Path.resolve(`${outputDir}/${filename}${width}x${height}.jpg`)
        );
    } catch (error) {
        console.log(error);
    }
});

export default image;
