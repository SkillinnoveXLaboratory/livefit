const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { defaultYogaPrograms, yogaProgramsSection } = require('../data/defaultYogaPrograms');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yoga_db';

const yogaProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    tagline: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    iconKey: { type: String, default: 'sparkles' },
    overview: { type: String, required: true },
    details: { type: String, required: true },
    benefits: { type: [String], default: [] },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const contentSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const YogaProgram = mongoose.models.YogaProgram || mongoose.model('YogaProgram', yogaProgramSchema);
const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

async function seedYogaPrograms() {
  await mongoose.connect(MONGODB_URI);

  try {
    for (const program of defaultYogaPrograms) {
      await YogaProgram.findOneAndUpdate(
        { title: program.title },
        { ...program },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }

    await Content.findOneAndUpdate(
      { page: 'yoga-programs-section' },
      { data: yogaProgramsSection, updatedAt: new Date() },
      { upsert: true, returnDocument: 'after' }
    );

    console.log(`Seeded ${defaultYogaPrograms.length} yoga programs and the yoga-programs-section content.`);
  } finally {
    await mongoose.disconnect();
  }
}

seedYogaPrograms().catch((error) => {
  console.error('Failed to seed yoga programs:', error);
  process.exit(1);
});
