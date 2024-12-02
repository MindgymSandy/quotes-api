//const express = require('express');
//const mongoose = require('mongoose');
//const quotesRouter = require('./routes/quotes');

//const app = express();

//mongoose.connect(process.env.MONGODB_URI)
//  .then(() => console.log('Connected to MongoDB'))
//  .catch(err => console.error('Could not connect to MongoDB', err));

//app.use(express.json());
//app.use('/quotes', quotesRouter);

//module.exports = app;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 测试路由
app.get('/', (req, res) => {
  res.send('API is running');
});

// MongoDB 连接
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API 路由
app.get('/quotes/random', async (req, res) => {
  // ... 您的随机引用逻辑 ...
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
