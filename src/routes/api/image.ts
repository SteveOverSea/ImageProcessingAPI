import express from 'express';
import Path from 'path';
import sharp from 'sharp';
import { promises as fs} from "fs";

const image = express.Router();

image.get('/', async (req, res) => {

    let sentFile = false;

    try {
        // check if requested filename is available
        const files = await fs.readdir("images");
        const fileNames = files.map(file => file.split(".")[0]);

        const found = fileNames.find(name => name == req.query.filename);

        if (!found) {
            throw new Error("no equivalent filename on server!");
        }

        //check if "thumbs" output directory exists
        await fs.access("thumb");

        //check if thumb image already exists
        await fs.access(`thumb/${req.query.filename}.jpg`);
        res.sendFile(Path.resolve(`thumb/${req.query.filename}.jpg`));
        // end route here
        console.log("sent already processed image");
        sentFile = true;

    } catch (error) {
        if (error.message == "no equivalent filename on server!") {

            console.log(error.message);
            res.end(error.message);

        } else if (error.code == "ENOENT" && error.syscall == "access" && error.path == "thumb") {

            console.log("no output folder, let's create one ...");

            try {
                await fs.mkdir("thumb");
            } catch (error) {
                console.log(error);
            }

        } else if (error.code == "ENOENT" && error.syscall == "access" && error.path == `thumb/${req.query.filename}.jpg`) {
            console.log("directory exists, but file doesn't");
        } else {
            console.log(error);
        }
    }

    // only run sharp when there is no image
    if (!sentFile) {
        try {
            const path = Path.resolve(`images/${req.query.filename}.jpg`);
    
            console.log("creating image");

            await sharp(path)
                .resize(
                    parseInt(req.query.width as string),
                    parseInt(req.query.height as string)
                )
                .toFile(`thumb/${req.query.filename}.jpg`);
    
            res.sendFile(Path.resolve(`thumb/${req.query.filename}.jpg`));
    
        } catch (error) {
            console.log(error);
        }
    }

});

export default image;
