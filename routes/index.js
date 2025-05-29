var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../db/sqlite.db'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/query', function(req, res, next) {
  let { startYear, startMonth, endYear, endMonth } = req.body;

  // 確保資料格式為數字
  startYear = parseInt(startYear, 10);
  startMonth = parseInt(startMonth, 10);
  endYear = parseInt(endYear, 10);
  endMonth = parseInt(endMonth, 10);

  // 檢查年份和月份是否在有效範圍內
  const isValidRange = (year, month) => {
    const startDate = new Date(2005, 0, 1); // 2005/1
    const endDate = new Date(2025, 3, 30); // 2025/4
    const inputDate = new Date(year, month - 1, 1);
    return inputDate >= startDate && inputDate <= endDate;
  };

  if (!isValidRange(startYear, startMonth) || !isValidRange(endYear, endMonth)) {
    return res.status(400).json({ error: '查詢區間必須在 2005/1 至 2025/4 之間' });
  }

  const query = `
    SELECT * FROM lemon_monthly_price
    WHERE (year > ? OR (year = ? AND month >= ?))
      AND (year < ? OR (year = ? AND month <= ?))
    ORDER BY year, month;
  `;

  db.all(query, [startYear, startYear, startMonth, endYear, endYear, endMonth], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
