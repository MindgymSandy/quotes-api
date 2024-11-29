const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const quotesRouter = require('./routes/quotes');

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/quotes', quotesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'API 运行正常' });
});

// 添加错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 