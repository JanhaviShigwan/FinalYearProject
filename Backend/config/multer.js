const multer = require("multer");
const path = require("path");



/* ================= STORAGE ================= */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },

});



/* ================= FILE FILTER ================= */

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only image files (jpg, jpeg, png, webp) are allowed"
      ),
      false
    );

  }

};



/* ================= MULTER ================= */

const upload = multer({
  storage,
  fileFilter,
});



module.exports = upload;