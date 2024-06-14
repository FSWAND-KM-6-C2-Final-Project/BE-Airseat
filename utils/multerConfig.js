const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerFiltering = (req, file, cb) => {
  console.log("Mime");
  console.log(file.mimetype);
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    return cb(new ApiError("File should be .png or .jpg or .jpeg", 400));
  }
};

const upload = multer({
  fileFilter: multerFiltering,
});

module.exports = upload;
