const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  content: {
    zh: {
      type: String,
      required: [true, '中文内容不能为空'],
      trim: true
    },
    en: {
      type: String,
      trim: true,
      default: ''
    }
  },
  source: {
    type: String,
    trim: true,
    default: '佚名'
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quote', quoteSchema);
