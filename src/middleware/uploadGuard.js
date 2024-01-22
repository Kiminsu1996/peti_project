const multer = require('multer');

const fileFilter = (req, file, cb) => {
    const allowTypes = /jpg|png/; // 정규표현식
    const checkTypes = allowTypes.test(file.mimetype); //파일 확장자 확인

    if (!checkTypes) {
        return cb(new Error('지원하지 않는 파일 형식입니다.'), false);
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
