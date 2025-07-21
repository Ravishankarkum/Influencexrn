import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetExpire = Date.now() + 3600000;
  await user.save();

  const resetUrl = `http://localhost:3000/reset-password/${token}`;
  await sendEmail(email, 'Password Reset', `Reset your password using this link: ${resetUrl}`);
  res.status(200).json({ message: 'Reset link sent to email' });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = password;
  user.resetToken = undefined;
  user.resetExpire = undefined;
  await user.save();

  res.status(200).json({ message: 'Password reset successful' });
};
