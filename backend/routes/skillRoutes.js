const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addSkill,
  browseSkills,
  getMySkills,
  updateSkill,
  deleteSkill,
  getMatches,
} = require('../controllers/skillController');

router.get('/matches', protect, getMatches);
router.get('/mine', protect, getMySkills);
router.get('/', protect, browseSkills);
router.post('/', protect, addSkill);
router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
