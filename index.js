const express = require("express");
const multer = require("multer"); // middleware for file uploads

const server = express();

server.get("/", (req, res) => {
  res.send(/*html*/ `
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <label for="username">Username</label>
      <input id="username" name="username" type="text">
      <label for="image">Choose image</label>
      <input id="image" name="image" type="file">
      <button type="submit">Upload</button>
    </form>
  `);
});

let images = [];

// usually multer writes files to the filesystem
// this tells it to just save them in memory
// since we're putting them into a database for storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// run multer on the request before our handler
// it will find the value of the file input with `name="image"`
// it stores the parsed image object on req.file
// it looks like this:
// {
//   fieldname: 'image',
//   originalname: 'test.png',
//   encoding: '7bit',
//   mimetype: 'image/png',
//   buffer: <Buffer 89 50 ...>,
//   size: 6707
// }

server.post("/upload", upload.single("image"), (req, res) => {
  // pretend this is going into a bytea field in Postgres
  images.push(req.file);
  res.redirect("/images");
});

// for each image object in the array above render an <img>
// the src is just the original filename
// the browser will make a GET request for this filename (handled below)
server.get("/images", (req, res) => {
  res.send(/*html*/ `
    <h1>Images</h1>
      ${images.map(
        (image) => `<img src="/image/${image.originalname}" alt="">`
      )}
    </ul>
  `);
});

server.get("/image/:name", (req, res) => {
  // match the name in the URL to an object in our array
  const image = images.find((image) => image.originalname === req.params.name);
  // use the parsed content-type from multer
  res.set("Content-Type", image.mimetype);
  // send the buffer back (this is the binary image data)
  res.send(image.buffer);
});

const PORT = process.env.port || 8080;
server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
