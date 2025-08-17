const express = require('express');
const router = express.Router();
const connectDB = require('../lib/mongodb');
const Report = require('../models/Report');
const { authMiddleware } = require('../lib/auth');

// Get all reports for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const reports = await Report.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: reports
    });

  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reports'
    });
  }
});

// Get single report by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const report = await Report.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: report
    });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch report'
    });
  }
});

// Delete report
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const report = await Report.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        error: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete report'
    });
  }
});

module.exports = router;