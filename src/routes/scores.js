const express = require('express');
const Score = require('../models/Score');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { studentName, eventName, gender, eventType, category, point, prize, batch, eventDate } = req.body;
  console.log('Received score data:', req.body);
  if (!studentName || !eventName || !gender || !eventType || !category || point == null || !prize || !batch || !eventDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['group', 'individual'].includes(eventType)) {
    return res.status(400).json({ message: 'eventType must be either group or individual' });
  }

  try {
    const newScore = await Score.create({
      studentName,
      eventName,
      gender,
      eventType,
      category,
      point,
      prize,
      batch,
      eventDate,
    });

    res.status(201).json({ message: 'Score uploaded', score: newScore });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const results = await Score.find().sort({ eventDate: -1 });
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/student/:studentName', async (req, res) => {
  try {
    const results = await Score.find({ studentName: req.params.studentName }).sort({ eventDate: -1 });
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/event/:eventName', async (req, res) => {
  try {
    const results = await Score.find({ eventName: req.params.eventName }).sort({ eventDate: -1 });
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await Score.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Score not found' });
    }
    res.json({ result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { studentName, eventName, gender, eventType, category, point, prize, batch, eventDate } = req.body;

  if (eventType && !['group', 'individual'].includes(eventType)) {
    return res.status(400).json({ message: 'eventType must be either group or individual' });
  }

  try {
    const scoreRecord = await Score.findById(req.params.id);
    if (!scoreRecord) {
      return res.status(404).json({ message: 'Score not found' });
    }

    if (studentName) scoreRecord.studentName = studentName;
    if (eventName) scoreRecord.eventName = eventName;
    if (gender) scoreRecord.gender = gender;
    if (eventType) scoreRecord.eventType = eventType;
    if (category) scoreRecord.category = category;
    if (point != null) scoreRecord.point = point;
    if (prize) scoreRecord.prize = prize;
    if (batch) scoreRecord.batch = batch;
    if (eventDate) scoreRecord.eventDate = eventDate;

    console.log("scoreRecord", scoreRecord)

    await scoreRecord.save();
    res.json({ message: 'Score updated', score: scoreRecord });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await Score.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Score not found' });
    }
    res.json({ message: 'Score deleted', score: result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
