# Base64 to Temporary File

`b64-tmpimg` is a Docker-based project designed to streamline the conversion of base64 images into temporary, serverable files. This application hosts an Express server within a Docker container, facilitating the reception of base64 strings and transforming them into tangible files that can be served to users.

Simply put, `b64-tmpimg` allows you to host a temporary S3 like file server using Docker and Express.js

## Purpose
The primary objective behind developing this application was to support the conversion of base64 images for my personal website project, [Liminality](https://fofx.zip/liminality). By converting these base64 strings into real, serverable files, I aimed to enhance the metadata associated with my website by providing images. These temporary files are intended to remain on the server for approximately two hours before being automatically deleted.

This project serves as a convenient solution for handling base64 image conversions within a Docker environment, offering efficiency and ease of use for developers working with similar requirements.

## Build

1. Clone this repository 
1a. Make sure that you have Docker installed and setup on your system.
1b. Modify the .env file into the expected URI of the server for ex: `http://localhost:5051`
2. Make sure you are shelled in the root directory of the project and run:
`docker build -t b64-tmpimg .`
3. Once built into an image you can simply run:
3a. For Debug and Development:
`docker run -p 80:3000 -v $PWD:/usr/src/app base64-tmpimg nodemon`
3b. For Release and Production:
`docker run -p PORT:3000 base64-tmpimg`

## Usage
> Assuming that the port of your Docker container is **5051**

To create a file, you make a post request to `http://localhost:5051/`:
```json
{
  "file":"data:image/png;base64,..."
}
```
 which will return a 200 response of
```json
{
  "path":  "http://localhost:5051/ti/1711916154977.png",
  "expiration":  "1711917954977"
}
```

You can then access the file by the link it returns.

## Planned Features
- API Keys and Authentication 
- Expiration Time Parameter
- Caching Images
