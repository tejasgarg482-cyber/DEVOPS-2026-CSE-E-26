const Skill = require('../models/Skill');

// POST /api/skills
const addSkill = async (req, res) => {
  try {
    const { title, category, description, level, type, mode } = req.body;
    if (!title || !type) return res.status(400).json({ message: 'Title and type are required' });

    const skill = await Skill.create({
      user: req.user._id,
      title,
      category,
      description,
      level,
      type,
      mode,
    });
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/skills  (browse/filter, excludes current user's own skills by default)
const browseSkills = async (req, res) => {
  try {
    const { category, mode, type, search, excludeSelf } = req.query;
    const query = {};
    if (category) query.category = category;
    if (mode) query.mode = mode;
    if (type) query.type = type;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (excludeSelf !== 'false') query.user = { $ne: req.user._id };

    const skills = await Skill.find(query).populate('user', 'name profilePicUrl trustScore location');
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/skills/mine
const getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/skills/:id
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findOne({ _id: req.params.id, user: req.user._id });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    Object.assign(skill, req.body);
    await skill.save();
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/skills/:id
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/skills/matches  -- core "Smart Match" logic
const getMatches = async (req, res) => {
  try {
    const myWantSkills = await Skill.find({ user: req.user._id, type: 'want' });
    const myTeachSkills = await Skill.find({ user: req.user._id, type: 'teach' });

    const wantTitles = myWantSkills.map((s) => s.title.toLowerCase());
    const teachTitles = myTeachSkills.map((s) => s.title.toLowerCase());

    if (wantTitles.length === 0) {
      return res.json([]);
    }

    // Find other users who teach something I want
    const candidateTeachSkills = await Skill.find({
      type: 'teach',
      user: { $ne: req.user._id },
      title: { $regex: wantTitles.join('|'), $options: 'i' },
    }).populate('user', 'name profilePicUrl trustScore location');

    // Group by user, and check for mutual match
    const matchesByUser = {};
    for (const skill of candidateTeachSkills) {
      const uid = skill.user._id.toString();
      if (!matchesByUser[uid]) {
        matchesByUser[uid] = {
          user: skill.user,
          theyTeach: [],
          mutualMatch: false,
        };
      }
      matchesByUser[uid].theyTeach.push(skill.title);
    }

    // Check mutual match: does that user want something I teach?
    for (const uid of Object.keys(matchesByUser)) {
      const theirWantSkills = await Skill.find({ user: uid, type: 'want' });
      const theirWantTitles = theirWantSkills.map((s) => s.title.toLowerCase());
      const overlap = teachTitles.filter((t) => theirWantTitles.includes(t));
      if (overlap.length > 0) {
        matchesByUser[uid].mutualMatch = true;
        matchesByUser[uid].iTeachThem = overlap;
      }
    }

    res.json(Object.values(matchesByUser));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addSkill, browseSkills, getMySkills, updateSkill, deleteSkill, getMatches };
