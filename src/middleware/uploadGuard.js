const multer = require('multer');
const { BadRequestException } = require('../config/exception');

const fileFilter = (req, file, cb) => {
    const allowTypes = /jpg|png/; // 정규표현식
    const checkTypes = allowTypes.test(file.mimetype); //파일 확장자 확인

    if (!checkTypes) {
        return cb(new BadRequestException('Wrong information'), false);
    }

    cb(null, true);
};
const upload = multer({
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, //10MB
    },
});

module.exports = upload;
