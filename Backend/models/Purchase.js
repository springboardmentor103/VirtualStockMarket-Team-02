const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  info: {
    type: String,
    default: 'NIL'
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);

