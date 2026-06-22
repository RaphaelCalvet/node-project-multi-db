import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
  },
  password: {
      type: String,
      required: true
  },
  role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
  }
}, { timestamps: true });

// Garante que o JSON nunca devolva a senha ao frontend
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', UserSchema);
