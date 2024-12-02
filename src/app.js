const express = require('express');
const cors = require('cors');
const quotesRouter = require('./routes/quotes');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', quotesRouter);

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API 运行正常' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('错误详情:', err);
  res.status(500).json({ 
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app; 