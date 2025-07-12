const express = require('express');
const User = require('../models/User');

const router = express.Router();

// @route   GET api/skills/popular
// @desc    Get popular skills
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const users = await User.find({ isPublic: true, isBanned: false });
    
    const skillCounts = {};
    
    users.forEach(user => {
      // Count skills offered
      user.skillsOffered.forEach(skill => {
        const skillName = skill.name.toLowerCase();
        skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
      });
      
      // Count skills wanted
      user.skillsWanted.forEach(skill => {
        const skillName = skill.name.toLowerCase();
        skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
      });
    });
    
    // Convert to array and sort by count
    const popularSkills = Object.entries(skillCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    
    res.json(popularSkills);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/skills/suggestions
// @desc    Get skill suggestions based on query
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }
    
    const users = await User.find({ isPublic: true, isBanned: false });
    const skillSet = new Set();
    
    users.forEach(user => {
      user.skillsOffered.forEach(skill => {
        if (skill.name.toLowerCase().includes(q.toLowerCase())) {
          skillSet.add(skill.name);
        }
      });
      
      user.skillsWanted.forEach(skill => {
        if (skill.name.toLowerCase().includes(q.toLowerCase())) {
          skillSet.add(skill.name);
        }
      });
    });
    
    const suggestions = Array.from(skillSet).slice(0, 10);
    res.json(suggestions);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 