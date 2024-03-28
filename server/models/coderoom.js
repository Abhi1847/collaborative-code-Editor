const mongoose = require('mongoose');
const {Schema} = mongoose


const codeSchema = new Schema({
    code: String,
    roomId: String,
  });
  
  // Create a model
  const Coderoom = mongoose.model('Coderoom', codeSchema);

  module.exports = Coderoom