const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Session = require('../models/Session');

// @route   GET api/sessions
// @desc    Get all published sessions
// @access  Public
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({ published: true })
      .sort({ createdAt: -1 })
      .populate('creator', ['name']);
    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/sessions/:id
// @desc    Get session by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('creator', ['name']);
    
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    
    if (!session.published) {
      return res.status(401).json({ msg: 'This session is not published' });
    }
    
    res.json(session);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Session not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/sessions/user/me
// @desc    Get all sessions by current user
// @access  Private
router.get('/user/me', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ creator: req.user.id })
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/sessions
// @desc    Create a session
// @access  Private
router.post('/', [
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('type', 'Type is required').not().isEmpty(),
    check('duration', 'Duration is required').isNumeric(),
    check('content', 'Content is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, description, type, duration, content, published, videoUrl, thumbnailUrl } = req.body;
  
  try {
    const newSession = new Session({
      title,
      description,
      type,
      duration,
      content,
      videoUrl,
      thumbnailUrl,
      published: published || false,
      creator: req.user.id
    });
    
    const session = await newSession.save();
    res.json(session);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/sessions/:id
// @desc    Update a session
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, type, duration, content, published, videoUrl, thumbnailUrl } = req.body;
  
  // Build session object
  const sessionFields = {};
  if (title) sessionFields.title = title;
  if (description) sessionFields.description = description;
  if (type) sessionFields.type = type;
  if (duration) sessionFields.duration = duration;
  if (content) sessionFields.content = content;
  if (published !== undefined) sessionFields.published = published;
  if (videoUrl) sessionFields.videoUrl = videoUrl;
  if (thumbnailUrl) sessionFields.thumbnailUrl = thumbnailUrl;
  sessionFields.updatedAt = Date.now();
  
  try {
    let session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    
    // Make sure user owns the session
    if (session.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    session = await Session.findByIdAndUpdate(
      req.params.id,
      { $set: sessionFields },
      { new: true }
    );
    
    res.json(session);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Session not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/sessions/:id
// @desc    Delete a session
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }
    
    // Make sure user owns the session
    if (session.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await session.remove();
    
    res.json({ msg: 'Session removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Session not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;