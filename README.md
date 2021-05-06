# Image Processing API

This project is part of the Udacity Full Stack JavaScript Nanodegree.
The task was to build an API that returns requested image files with a certain width and height specified by the query parameters of the request.

Technologies:
* TypeScript
* Express
* Express-FileUpload (File-Upload Middleware)
* ESLinz & Prettier
* Jasmine & Supertest
* Sharp (Image Processing)

## Install

Install all the modules

```
npm install
```

Start the server which will also build the TypeScript fuils and start nodemon

```
npm run start-build
```

Go to localhost:3000 to see  the index.html file, where you can upload an image or send an API request via the HTML form

Run the test-suite with

```
npm run test
```


## API Request

The query uses following template

localhost:3000/api/image?
    filename={requested_filename}
    &width={requested_width}
    &height={requested_height}

## Processed Images

Already processed images can be accessed through the same format as the API request.

The images itself are saved as {filename}{width}x{height}.{ext}
