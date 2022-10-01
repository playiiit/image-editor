const Jimp = require('jimp');

await Jimp.read("C:\\Users\\TigEr_MP\\Downloads\\IMG-20220506-WA0001-removebg-preview.png", (err, image) => {
    if (err) throw err;
    image
        .resize(3000, 3000) // resize
        .quality(100) // set JPEG quality
        .write("C:\\Users\\TigEr_MP\\Downloads" + "\\" + "1.png"); // save
});