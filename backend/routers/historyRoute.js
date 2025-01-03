const express = require('express');
const router = express.Router();
const History = require('../models/history');
const Bookmark = require('../models/bookmark');

// Add new history entry
router.post('/add', (req, res) => {
  const { user, text, translatedText, createdAt } = req.body;

  const newHistory = new History({
    user,
    text,
    translatedText,
    createdAt,
  });

  newHistory
    .save()
    .then(() => res.json('History Added'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Get all history entries
router.get('/', (req, res) => {
  History.find()
    .then((history) => {
      // Set the Content-Type header for UTF-8 encoding
      res.set('Content-Type', 'application/json; charset=utf-8');

      res.json(history);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json('Error: ' + err);
    });
});

// Update a history entry by ID
router.put('/update/:id', async (req, res) => {
  try {
    const historyId = req.params.id;
    const { originalText, translatedText } = req.body;

    const updateHistory = {
      originalText,
      translatedText,
    };

    const updatedHistory = await History.findByIdAndUpdate(
      historyId,
      updateHistory,
      { new: true }
    );

    if (!updatedHistory) {
      return res.status(404).json({ status: 'History Not Found' });
    }

    res
      .status(200)
      .json({ status: 'History Updated', history: updatedHistory });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 'Error with updating data', error: error.message });
  }
});

// Delete a history entry by ID
router.delete('/delete/:id', async (req, res) => {
  const historyId = req.params.id;

  try {
    const deletedHistory = await History.findByIdAndDelete(historyId);

    if (!deletedHistory) {
      return res.status(404).json({ status: 'History Not Found' });
    }

    res.status(200).json({ status: 'History Deleted' });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: 'Error with delete history', error: err.message });
  }
});

// Get a specific history entry by ID
router.get('/get/:id', async (req, res) => {
  const historyId = req.params.id;

  try {
    const history = await History.findById(historyId);

    if (!history) {
      return res.status(404).json({ status: 'History Not Found' });
    }

    res.status(200).json({ status: 'History Fetched', history });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: 'Error with get history', error: err.message });
  }
});

// Delete all history entries
router.delete('/clear', async (req, res) => {
  try {
    const result = await History.deleteMany({});
    res.status(200).json({ status: 'All history cleared', deletedCount: result.deletedCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 'Error clearing history', error: err.message });
  }
});

// Define the route for saving bookmarks
router.post('/bookmarks', async (req, res) => {
  const { userId, entryId, color } = req.body;
  try {
    const newBookmark = new Bookmark({ userId, entryId, color });
    await newBookmark.save();
    res.status(201).json(newBookmark); // Respond with the created bookmark
  } catch (error) {
    res.status(500).json({ message: 'Error saving bookmark' });
  }
});

// Get bookmarks for a specific user
router.get('/bookmarks/:userId', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.params.userId });
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
});

module.exports = router;
