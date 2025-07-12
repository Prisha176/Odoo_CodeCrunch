const express = require('express');
const { check, validationResult } = require('express-validator');
const Swap = require('../models/Swap');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST api/swaps
// @desc    Create a new swap request
// @access  Private
router.post('/', auth, [
  check('recipientId', 'Recipient ID is required').not().isEmpty(),
  check('requestedSkill', 'Requested skill is required').not().isEmpty(),
  check('offeredSkill', 'Offered skill is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { recipientId, requestedSkill, offeredSkill, message, scheduledDate } = req.body;

  try {
    // Check if recipient exists and is public
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    if (!recipient.isPublic) {
      return res.status(403).json({ message: 'Cannot send request to private profile' });
    }

    if (recipient.isBanned) {
      return res.status(403).json({ message: 'Cannot send request to banned user' });
    }

    // Check if there's already a pending swap between these users
    const existingSwap = await Swap.findOne({
      $or: [
        { requester: req.user.id, recipient: recipientId },
        { requester: recipientId, recipient: req.user.id }
      ],
      status: 'pending'
    });

    if (existingSwap) {
      return res.status(400).json({ message: 'A pending swap already exists between these users' });
    }

    // Create new swap
    const swap = new Swap({
      requester: req.user.id,
      recipient: recipientId,
      requestedSkill,
      offeredSkill,
      message,
      scheduledDate
    });

    await swap.save();

    // Populate user details for response
    await swap.populate('requester', 'name');
    await swap.populate('recipient', 'name');

    res.json(swap);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/swaps/my-swaps
// @desc    Get user's swaps (as requester and recipient)
// @access  Private
router.get('/my-swaps', auth, async (req, res) => {
  try {
    const swaps = await Swap.find({
      $or: [
        { requester: req.user.id },
        { recipient: req.user.id }
      ]
    })
    .populate('requester', 'name')
    .populate('recipient', 'name')
    .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/swaps/pending
// @desc    Get pending swap requests for user
// @access  Private
router.get('/pending', auth, async (req, res) => {
  try {
    const swaps = await Swap.find({
      recipient: req.user.id,
      status: 'pending'
    })
    .populate('requester', 'name skillsOffered')
    .sort({ createdAt: -1 });

    res.json(swaps);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/swaps/:id/accept
// @desc    Accept a swap request
// @access  Private
router.put('/:id/accept', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }

    if (swap.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to accept this swap' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Swap is not pending' });
    }

    swap.status = 'accepted';
    await swap.save();

    await swap.populate('requester', 'name');
    await swap.populate('recipient', 'name');

    res.json(swap);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Swap not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/swaps/:id/reject
// @desc    Reject a swap request
// @access  Private
router.put('/:id/reject', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }

    if (swap.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to reject this swap' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Swap is not pending' });
    }

    swap.status = 'rejected';
    await swap.save();

    await swap.populate('requester', 'name');
    await swap.populate('recipient', 'name');

    res.json(swap);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Swap not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/swaps/:id/cancel
// @desc    Cancel a swap request (only requester can cancel)
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }

    if (swap.requester.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this swap' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending swaps' });
    }

    swap.status = 'cancelled';
    await swap.save();

    await swap.populate('requester', 'name');
    await swap.populate('recipient', 'name');

    res.json(swap);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Swap not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/swaps/:id/complete
// @desc    Mark a swap as completed
// @access  Private
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }

    if (swap.requester.toString() !== req.user.id && swap.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to complete this swap' });
    }

    if (swap.status !== 'accepted') {
      return res.status(400).json({ message: 'Can only complete accepted swaps' });
    }

    swap.status = 'completed';
    swap.completedDate = new Date();
    await swap.save();

    await swap.populate('requester', 'name');
    await swap.populate('recipient', 'name');

    res.json(swap);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Swap not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/swaps/:id/rate
// @desc    Rate a completed swap
// @access  Private
router.post('/:id/rate', auth, [
  check('rating', 'Rating is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('comment', 'Comment is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }

    if (swap.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed swaps' });
    }

    const { rating, comment } = req.body;
    const isRequester = swap.requester.toString() === req.user.id;
    const isRecipient = swap.recipient.toString() === req.user.id;

    if (!isRequester && !isRecipient) {
      return res.status(403).json({ message: 'Not authorized to rate this swap' });
    }

    // Update rating based on user role
    if (isRequester) {
      if (swap.requesterRating.rating) {
        return res.status(400).json({ message: 'You have already rated this swap' });
      }
      swap.requesterRating = { rating, comment, date: new Date() };
    } else {
      if (swap.recipientRating.rating) {
        return res.status(400).json({ message: 'You have already rated this swap' });
      }
      swap.recipientRating = { rating, comment, date: new Date() };
    }

    await swap.save();

    // Update user's average rating if both parties have rated
    if (swap.requesterRating.rating && swap.recipientRating.rating) {
      const requester = await User.findById(swap.requester);
      const recipient = await User.findById(swap.recipient);

      if (requester) {
        const requesterSwaps = await Swap.find({
          $or: [{ requester: swap.requester }, { recipient: swap.requester }],
          status: 'completed',
          $or: [
            { 'requesterRating.rating': { $exists: true } },
            { 'recipientRating.rating': { $exists: true } }
          ]
        });

        const requesterRatings = requesterSwaps
          .map(s => s.requester.toString() === swap.requester.toString() ? s.requesterRating.rating : s.recipientRating.rating)
          .filter(r => r);

        if (requesterRatings.length > 0) {
          requester.rating.average = requesterRatings.reduce((a, b) => a + b, 0) / requesterRatings.length;
          requester.rating.count = requesterRatings.length;
          await requester.save();
        }
      }

      if (recipient) {
        const recipientSwaps = await Swap.find({
          $or: [{ requester: swap.recipient }, { recipient: swap.recipient }],
          status: 'completed',
          $or: [
            { 'requesterRating.rating': { $exists: true } },
            { 'recipientRating.rating': { $exists: true } }
          ]
        });

        const recipientRatings = recipientSwaps
          .map(s => s.requester.toString() === swap.recipient.toString() ? s.requesterRating.rating : s.recipientRating.rating)
          .filter(r => r);

        if (recipientRatings.length > 0) {
          recipient.rating.average = recipientRatings.reduce((a, b) => a + b, 0) / recipientRatings.length;
          recipient.rating.count = recipientRatings.length;
          await recipient.save();
        }
      }
    }

    await swap.populate('requester', 'name');
    await swap.populate('recipient', 'name');

    res.json(swap);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Swap not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/swaps/:id
// @desc    Delete a swap request (only requester can delete pending requests)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const swap = await Swap.findById(req.params.id);
    if (!swap) {
      return res.status(404).json({ message: 'Swap not found' });
    }

    if (swap.requester.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this swap' });
    }

    if (swap.status !== 'pending') {
      return res.status(400).json({ message: 'Can only delete pending swaps' });
    }

    await swap.remove();
    res.json({ message: 'Swap deleted' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Swap not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 