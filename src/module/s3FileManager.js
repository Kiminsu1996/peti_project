const { s3Client } = require('../config/awsConfig');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const uuid4 = require('uuid4');

async function uploadFile(file) {
    const key = `${uuid4().replace(/-/g, '').substring(0, 10)}_${file.originalname}`;
    const params = {
        Bucket: 'peti-project',
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    await s3Client.send(new PutObjectCommand(params));
    return `https://peti-project.s3.ap-northeast-2.amazonaws.com/${key}`;
}

module.exports = {
    uploadFile,
};
