const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuitarInstanceSchema = new Schema({
  series: { type: String, required: true },
  color: {
    type: String,
    required: true,
    enum: [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'purple',
      'white',
      'black',
      'sunburst',
    ],
  },
  price: { type: Number, required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
  serialNum: { type: String, required: true },
  model: { type: String, required: true },
});

module.exports = mongoose.model('GuitarInstance', GuitarInstanceSchema);
