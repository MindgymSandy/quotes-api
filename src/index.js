const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const quotesRouter = require('./routes/quotes');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 挂载路由
app.use('/quotes', quotesRouter);

// 测试路由
app.get('/', (req, res) => {
  res.send('API is running');
});

// MongoDB 连接
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// 端口设置
const PORT = process.env.PORT || 3000;

// 修改监听方式
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});

// 处理未捕获的异常
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
