const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote.js');

// GET 所有心语
router.get('/', async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 批量新增心语
router.post('/batch', async (req, res) => {
  try {
    const quotes = await Quote.insertMany(req.body);
    res.status(201).json({
      status: 'success',
      message: `成功添加 ${quotes.length} 条心语`,
      data: quotes
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 添加单条心语
router.post('/', async (req, res) => {
  try {
    const quote = new Quote(req.body);
    await quote.save();
    res.status(201).json({
      status: 'success',
      message: '成功添加心语',
      data: quote
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 删除重复的心语（保留最早的一条）
router.delete('/duplicates', async (req, res) => {
  try {
    // 1. 查找所有重复的中文内容
    const duplicates = await Quote.aggregate([
      {
        $group: {
          _id: "$content.zh",
          count: { $sum: 1 },
          docs: { $push: "$$ROOT" },
          firstCreated: { $min: "$createdAt" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }  // 只选择出现次数大于1的
        }
      }
    ]);

    let deletedCount = 0;
    
    // 2. 对每组重复数据进行处理
    for (const group of duplicates) {
      // 保留最早创建的那条，删除其他的
      const keepDoc = group.docs.find(doc => 
        doc.createdAt.getTime() === group.firstCreated.getTime()
      );
      
      // 删除其他重复的文档
      await Quote.deleteMany({
        'content.zh': group._id,
        _id: { $ne: keepDoc._id }
      });
      
      deletedCount += group.count - 1;
    }

    res.json({
      status: 'success',
      message: `成功删除 ${deletedCount} 条重复数据`,
      duplicatesFound: duplicates.length
    });
    
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// 随机获取一条心语
router.get('/random', async (req, res) => {
  try {
    const count = await Quote.countDocuments();
    const random = Math.floor(Math.random() * count);
    const quote = await Quote.findOne().skip(random);
    
    res.json({
      status: 'success',
      data: quote
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
