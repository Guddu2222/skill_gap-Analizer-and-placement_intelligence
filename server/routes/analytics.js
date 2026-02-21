
const express = require('express');
const router = express.Router();

// Mock Analytics Data
router.get('/dashboard', (req, res) => {
  res.json({
    totalOffers: 458,
    placementRate: 78,
    avgSalary: "12.5 LPA",
    activeDrives: 18,
    placementTrend: [
      { month: 'Aug', released: 20, accepted: 15 },
      { month: 'Sep', released: 35, accepted: 25 },
      { month: 'Oct', released: 45, accepted: 30 },
      { month: 'Nov', released: 60, accepted: 25 }, // dip
      { month: 'Dec', released: 50, accepted: 45 },
      { month: 'Jan', released: 80, accepted: 60 },
      { month: 'Feb', released: 65, accepted: 55 },
    ]
  });
});

module.exports = router;
