import Earning from '../models/Earning.js';

export const createEarning = async (req, res) => {
  try {
    if (req.user.role !== 'brand') return res.status(403).json({ message: 'Only brands can create earnings' });
    const { influencer_id, total_earned, payouts } = req.body;
    const earning = await Earning.create({ influencer_id, total_earned, payouts });
    res.status(201).json(earning);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEarningsByInfluencer = async (req, res) => {
  try {
    const earnings = await Earning.find({ influencer_id: req.params.id });
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEarning = async (req, res) => {
  try {
    const earning = await Earning.findById(req.params.id);
    if (!earning) return res.status(404).json({ message: 'Earning not found' });
    await earning.deleteOne();
    res.json({ message: 'Earning deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};