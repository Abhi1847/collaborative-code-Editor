const mongoose = require('mongoose');
const {Schema} = mongoose


const codeSchema = new Schema({
    code: String,
    roomId: String,
  });
  
  // Create a model
  const Code = mongoose.model('Code', codeSchema);

  module.exports = Code