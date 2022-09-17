const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
});

BrandSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/${this.name}`;
});

module.exports = mongoose.model('Brand', BrandSchema);
