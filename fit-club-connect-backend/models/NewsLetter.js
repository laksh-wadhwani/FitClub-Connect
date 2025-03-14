const mongoose = require('mongoose')

const newsLetterSchema = new mongoose.Schema({
    myNewsLetterUser: String
});
const newsLetterTable = new mongoose.model("newsLetterTable", newsLetterSchema);

module.exports = newsLetterTable;