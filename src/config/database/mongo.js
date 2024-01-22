const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url); //몽고DB는 기본적으로 Pool 방법이다.

module.exports = {
    client,
};
