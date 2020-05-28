# Image uploads with Express

An example of how to handle image uploads with Express.

## Run locally

1. Clone this repo
1. Run `npm install`
1. Run `npm run dev`

## Concepts

Our home route contains a `<form>` that submits `POST` requests to `/upload`. The form encoding is set to `multipart/form-data` (this is required for file uploads).

We're using the [multer](https://www.npmjs.com/package/multer) middleware to actually parse the uploaded file data into a JS object. It's configured to store the file in memory, rather than writing the file to the filesystem.

This image object is available to our handler on `req.file`. We then push this object into an array (this is where all images uploaded will live). In reality you'd want to either store the binary data in a database or stick the file in an S3 bucket.

The `/images` route shows all the images in the array. It renders an `<img>` for each image object, using the original uploaded file name as the `src`. The browser will make a `GET` request for this filename for each image on the page.

The `/image/:name` route handles individual image requests. It uses the name param from the URL to find the right image object in the array. It then sets the `content-type` header using the multer-provided `mimetype` property, and finally responds to the browser with the `buffer` containing the image data.
