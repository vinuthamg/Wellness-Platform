const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Draft = require('../models/Draft');

// @route   GET api/drafts
// @desc    Get all drafts for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const drafts = await Draft.find({ creator: req.user.id }).sort({ lastSaved: -1 });
    res.json(drafts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/drafts/:id
// @desc    Get draft by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id);
    
    if (!draft) {
      return res.status(404).json({ msg: 'Draft not found' });
    }
    
    // Make sure user owns the draft
    if (draft.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    res.json(draft);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Draft not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/drafts
// @desc    Create a new draft
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, type, duration, content, sessionId } = req.body;
  
  try {
    const newDraft = new Draft({
      title: title || '',
      description: description || '',
      type: type || 'yoga',
      duration: duration || 30,
      content: content || '',
      sessionId,
      creator: req.user.id
    });
    
    const draft = await newDraft.save();
    res.json(draft);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/drafts/:id
// @desc    Update a draft (auto-save)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, description, type, duration, content } = req.body;
  
  // Build draft object
  const draftFields = {};
  if (title !== undefined) draftFields.title = title;
  if (description !== undefined) draftFields.description = description;
  if (type !== undefined) draftFields.type = type;
  if (duration !== undefined) draftFields.duration = duration;
  if (content !== undefined) draftFields.content = content;
  draftFields.lastSaved = Date.now();
  
  try {
    let draft = await Draft.findById(req.params.id);
    
    if (!draft) {
      return res.status(404).json({ msg: 'Draft not found' });
    }
    
    // Make sure user owns the draft
    if (draft.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    draft = await Draft.findByIdAndUpdate(
      req.params.id,
      { $set: draftFields },
      { new: true }
    );
    
    res.json(draft);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Draft not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/drafts/:id
// @desc    Delete a draft
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const draft = await Draft.findById(req.params.id);
    
    if (!draft) {
      return res.status(404).json({ msg: 'Draft not found' });
    }
    
    // Make sure user owns the draft
    if (draft.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    await draft.remove();
    
    res.json({ msg: 'Draft removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Draft not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;