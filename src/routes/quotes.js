const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

// 获取所有心语
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Quote.countDocuments();

    res.json({
      quotes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalQuotes: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取随机一条心语
router.get('/random', async (req, res) => {
  try {
    const count = await Quote.countDocuments();
    const random = Math.floor(Math.random() * count);
    const quote = await Quote.findOne().skip(random);
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 根据标签搜索心语
router.get('/tags/:tag', async (req, res) => {
  try {
    const quotes = await Quote.find({ tags: req.params.tag });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新的心语
router.post('/', async (req, res) => {
  const quote = new Quote({
    content: req.body.content,
    source: req.body.source,
    tags: req.body.tags
  });

  try {
    const newQuote = await quote.save();
    res.status(201).json(newQuote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 批量创建心语
router.post('/batch', async (req, res) => {
  try {
    // 确保请求体是一个数组
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: '请求体必须是心语数组' });
    }

    // 验证每个心语对象
    const quotes = req.body.map(quote => ({
      content: quote.content,
      source: quote.source || '佚名',
      tags: quote.tags || []
    }));

    // 批量插入数据
    const newQuotes = await Quote.insertMany(quotes);
    res.status(201).json(newQuotes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除指定ID的心语
router.delete('/:id', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: '未找到该心语' });
    }
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 删除所有重复的心语，只保留最早的一条
router.delete('/remove/duplicates', async (req, res) => {
  try {
    const duplicates = await Quote.aggregate([
      {
        $group: {
          _id: "$content.zh",
          uniqueIds: { $addToSet: "$_id" },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    let deletedCount = 0;
    for (let dup of duplicates) {
      // 保留第一个，删除其他的
      const idsToDelete = dup.uniqueIds.slice(1);
      await Quote.deleteMany({ _id: { $in: idsToDelete } });
      deletedCount += idsToDelete.length;
    }

    res.json({ 
      message: `成功删除 ${deletedCount} 条重复数据`,
      deletedCount 
    });
  } catch (error) {
    console.error('删除重复数据错误:', error);
    res.status(500).json({ message: error.message });
  }
});

// 获取心语总数
router.get('/count', async (req, res) => {
  try {
    const count = await Quote.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
