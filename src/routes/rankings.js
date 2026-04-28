const express = require('express');
const Score = require('../models/Score');

const router = express.Router();

router.get('/batch', async (req, res) => {
  try {
    // Get overall batch rankings
    const batchRankings = await Score.aggregate([
      {
        $group: {
          _id: '$batch',
          totalPoints: { $sum: '$point' }
        }
      },
      {
        $sort: { totalPoints: -1 }
      },
      {
        $project: {
          batch: '$_id',
          totalPoints: 1,
          _id: 0
        }
      }
    ]);

    const overallRanked = batchRankings.map((batch, index) => ({
      rank: index + 1,
      batch: batch.batch,
      points: batch.totalPoints
    }));

    // Get date-wise batch rankings
    const dateWiseRankings = await Score.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$eventDate' } },
            batch: '$batch'
          },
          totalPoints: { $sum: '$point' }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          batches: {
            $push: {
              batch: '$_id.batch',
              points: '$totalPoints'
            }
          }
        }
      },
      {
        $project: {
          date: '$_id',
          batches: {
            $sortArray: { input: '$batches', sortBy: { points: -1 } }
          },
          _id: 0
        }
      },
      {
        $sort: { date: -1 }
      }
    ]);

    const rankedByDate = dateWiseRankings.map(dateEntry => ({
      date: dateEntry.date,
      rankings: dateEntry.batches.map((batch, index) => ({
        rank: index + 1,
        batch: batch.batch,
        points: batch.points
      }))
    }));

    res.json({ 
      overall: overallRanked,
      dateWise: rankedByDate 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/batch-by-date', async (req, res) => {
  try {
    // Aggregate batch points by date and rank batches within each date
    const dateWiseRankings = await Score.aggregate([
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$eventDate' } },
            batch: '$batch'
          },
          totalPoints: { $sum: '$point' }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          batches: {
            $push: {
              batch: '$_id.batch',
              points: '$totalPoints'
            }
          }
        }
      },
      {
        $project: {
          date: '$_id',
          batches: {
            $sortArray: { input: '$batches', sortBy: { points: -1 } }
          },
          _id: 0
        }
      },
      {
        $sort: { date: -1 }
      }
    ]);

    // Add rank to each batch within their date
    const rankedByDate = dateWiseRankings.map(dateEntry => ({
      date: dateEntry.date,
      rankings: dateEntry.batches.map((batch, index) => ({
        rank: index + 1,
        batch: batch.batch,
        points: batch.points
      }))
    }));

    res.json({ dateWiseRankings: rankedByDate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/overall', async (req, res) => {
  try {
    // Aggregate scores by student across all batches, sum points, and rank globally
    const overallRankings = await Score.aggregate([
      {
        $group: {
          _id: '$studentName',
          totalPoints: { $sum: '$point' },
          batch: { $first: '$batch' },
          events: { $push: { eventName: '$eventName', eventType: '$eventType', point: '$point', prize: '$prize', batch: '$batch' } }
        }
      },
      {
        $sort: { totalPoints: -1 }
      },
      {
        $project: {
          studentName: '$_id',
          totalPoints: 1,
          batch: 1,
          events: 1,
          _id: 0
        }
      }
    ]);

    // Add overall rank
    const rankedOverall = overallRankings.map((student, index) => ({
      rank: index + 1,
      ...student
    }));

    res.json({ overallRankings: rankedOverall });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/batch-averages', async (req, res) => {
  try {
    const batchAverages = await Score.aggregate([
      {
        $group: {
          _id: '$batch',
          avgPoints: { $avg: '$point' }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          batch: '$_id',
          avg: { $round: ['$avgPoints', 1] },
          _id: 0
        }
      }
    ]);
    res.json(batchAverages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/event-winners', async (req, res) => {
  try {
    const eventWinners = await Score.aggregate([
      {
        $sort: { eventName: 1, point: -1 }
      },
      {
        $group: {
          _id: {
            eventName: '$eventName',
            category: '$category'
          },
          winners: {
            $push: {
              studentName: '$studentName',
              point: '$point',
              prize: '$prize',
              batch: '$batch'
            }
          }
        }
      },
      {
        $project: {
          eventName: '$_id.eventName',
          category: '$_id.category',
          topThree: { $slice: ['$winners', 3] },
          _id: 0
        }
      },
      {
        $sort: { eventName: 1, category: 1 }
      }
    ]);
    res.json(eventWinners);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
