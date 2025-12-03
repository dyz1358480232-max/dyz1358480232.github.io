const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 模拟数据库 - 新闻数据
let newsData = [
  {
    id: 1,
    title: "国际自盟：电子自行车运动正吸引更多人参与骑行",
    content: "<p>2025年国际自行车运动联盟(简称国际自盟)自行车电子竞技世锦赛即将在阿布扎比拉开帷幕...</p>",
    date: "2025-11-15 17:23",
    author: "济南日报爱济南",
    comments: []
  }
];

// API 路由

// 获取所有新闻
app.get('/api/news', (req, res) => {
  res.json(newsData);
});

// 获取单条新闻
app.get('/api/news/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const news = newsData.find(item => item.id === id);
  if (news) {
    res.json(news);
  } else {
    res.status(404).json({ message: '新闻不存在' });
  }
});

// 添加新闻
app.post('/api/news', (req, res) => {
  const newNews = {
    id: newsData.length > 0 ? Math.max(...newsData.map(item => item.id)) + 1 : 1,
    title: req.body.title,
    content: req.body.content,
    date: new Date().toLocaleString(),
    author: req.body.author || '匿名作者',
    comments: []
  };
  newsData.push(newNews);
  res.status(201).json(newNews);
});

// 添加评论
app.post('/api/news/:id/comments', (req, res) => {
  const id = parseInt(req.params.id);
  const newsIndex = newsData.findIndex(item => item.id === id);
  if (newsIndex !== -1) {
    const newComment = {
      id: Date.now(),
      content: req.body.content,
      author: req.body.author || '匿名用户',
      date: new Date().toLocaleString()
    };
    newsData[newsIndex].comments.push(newComment);
    res.status(201).json(newComment);
  } else {
    res.status(404).json({ message: '新闻不存在' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});