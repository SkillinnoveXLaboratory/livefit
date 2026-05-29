const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const { defaultWorkfitChallenges } = require('../data/defaultWorkfitChallenges');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yoga_db';

const workfitChallengeSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true },
    stat: { type: String, required: true },
    statDesc: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const WorkfitChallenge = mongoose.model('WorkfitChallenge', workfitChallengeSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);

  for (const challenge of defaultWorkfitChallenges) {
    await WorkfitChallenge.findOneAndUpdate(
      { slug: challenge.slug },
      challenge,
      { upsert: true, setDefaultsOnInsert: true }
    );
  }

  console.log(`Seeded ${defaultWorkfitChallenges.length} WorkFit challenges.`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Failed to seed WorkFit challenges:', error);
  await mongoose.disconnect();
  process.exit(1);
});
