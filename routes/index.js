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
  const { startYear, startMonth, endYear, endMonth } = req.body;

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
