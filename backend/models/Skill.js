const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Tech', 'Music', 'Language', 'Fitness', 'Art', 'Cooking', 'Academic', 'Other'],
      default: 'Other',
    },
    description: { type: String, default: '' },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Beginner' },
    type: { type: String, enum: ['teach', 'want'], required: true },
    mode: { type: String, enum: ['online', 'in-person', 'both'], default: 'both' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
