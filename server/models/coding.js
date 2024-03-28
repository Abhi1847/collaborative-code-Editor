const mongoose = require('mongoose');
const {Schema} = mongoose

const codingSchema = new Schema({
    code: String,
    id:String
  });

  const Coding = mongoose.model("Coding", codingSchema);

  module.exports = Coding

