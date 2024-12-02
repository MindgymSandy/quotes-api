心语数据库使用说明
=================

API 端点说明
----------

1. 获取心语
   GET /api/quotes
   - 获取所有心语列表
   - 可选参数：limit（限制返回数量）

2. 获取心语总数
   GET /api/quotes/count
   - 返回数据库中心语总数

3. 添加单条心语
   POST /api/quotes
   - Content-Type: application/json
   - 请求体格式示例：
     {
       "content": {
         "zh": "中文内容",
         "en": "English content"
       },
       "source": "来源",
       "tags": ["标签1", "标签2"]
     }

4. 批量添加心语
   POST /api/quotes/batch
   - Content-Type: application/json
   - 请求体格式为心语对象数组

5. 删除重复数据
   DELETE /api/quotes/remove/duplicates
   - 自动检测并删除重复的心语条目
   - 保留最早添加的记录

数据格式说明
----------
1. content: 必须包含 zh（中文）和 en（英文）
2. source: 来源说明（如：静思语、心道法师法语等）
3. tags: 标签数组（如：["生活", "证严法师"]）

使用示例
-------
1. 查询总数：
   GET http://localhost:3000/api/quotes/count

2. 添加新心语：
   POST http://localhost:3000/api/quotes
   {
     "content": {
       "zh": "心平能愈三千疾，心静可通万事理。",
       "en": "A calm heart can heal thousands of ailments, and a tranquil mind can comprehend all truths."
     },
     "source": "弘一法师语录",
     "tags": ["生活", "弘一法师"]
   }

3. 删除重复：
   DELETE http://localhost:3000/api/quotes/remove/duplicates

注意事项
-------
1. 添加数据前请确保格式正确
2. 建议定期检查并删除重复数据
3. 添加新数据时注意检查是否已存在相同内容
https://quotes-4ndf1zx7t-mindgymsandys-projects.vercel.app/quotes/
wx.request({
  url: 'https://quotes-4ndf1zx7t-mindgymsandys-projects.vercel.app/quotes/random',
  method: 'GET',
  success(res) {
    if (res.data.status === 'success') {
      const quote = res.data.data;
      // 使用数据
      console.log({
        chinese: quote.content.zh,    // 中文内容
        english: quote.content.en,    // 英文内容
        source: quote.source,         // 来源
        tags: quote.tags             // 标签
      });
    }
  }
});