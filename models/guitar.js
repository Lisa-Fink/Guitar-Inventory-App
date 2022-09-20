const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuitarSchema = new Schema({
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  model: { type: String, required: true },
  stock: Number,
  type: {
    type: String,
    required: true,
    enum: ['Electric Guitar', 'Electric Bass'],
  },
});

module.exports = mongoose.model('Guitar', GuitarSchema);
