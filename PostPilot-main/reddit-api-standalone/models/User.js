import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  password: { type: String, select: false },
  plan: { type: String, enum: ['starter', 'pro', 'business'], default: 'starter' },
  subscriptionStatus: { type: String, enum: ['none', 'trialing', 'active', 'past_due', 'canceled'], default: 'none' },
  trialEndsAt: { type: Date },
  reddit: {
    accessToken: String,
    refreshToken: String,
    tokenExpiresAt: Date,
    username: String,
  }
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.password || !this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
