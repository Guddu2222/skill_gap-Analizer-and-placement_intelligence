const mongoose = require('mongoose');

const jobMarketTrendSchema = new mongoose.Schema({
  skillName: { 
    type: String, 
    required: true 
  },
  domain: String,
  
  // Market Metrics
  jobPostingsCount: {
    type: Number,
    default: 0
  },
  demandTrend: {
    type: String,
    enum: ['rising', 'stable', 'declining'],
    default: 'stable'
  },
  avgSalary: Number,
  popularityScore: {
    type: Number, // 0-100
    min: 0,
    max: 100
  },
  
  // Time Series Data
  trendData: [{
    month: String, // e.g., '2024-01'
    postings: Number,
    avgSalary: Number
  }],
  
  dataSource: String,
  lastScraped: Date
}, { timestamps: true });

// Index for quick lookups by skill and domain
jobMarketTrendSchema.index({ skillName: 1, domain: 1 });

module.exports = mongoose.model('JobMarketTrend', jobMarketTrendSchema);
