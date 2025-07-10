import Collaboration from '../models/Collaboration.js';

export const createCollaboration = async (req, res) => {
    try {
        if (req.user.role !== 'influencer') {
            return res.status(403).json({ message: 'Only influencers can request collaborations' });
        }

        const { campaign, message } = req.body;
        const collaboration = await Collaboration.create({
            campaign,
            influencer: req.user._id,
            message,
        });

        res.status(201).json(collaboration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCollaborations = async (req, res) => {
    try {
        let collaborations;
        if (req.user.role === 'admin') {
            collaborations = await Collaboration.find()
                .populate('campaign', 'title')
                .populate('influencer', 'name email');
        } else if (req.user.role === 'influencer') {
            collaborations = await Collaboration.find({ influencer: req.user._id })
                .populate('campaign', 'title')
                .populate('influencer', 'name email');
        } else if (req.user.role === 'brand') {
            collaborations = await Collaboration.find()
                .populate({
                    path: 'campaign',
                    match: { brand: req.user._id },
                    select: 'title',
                })
                .populate('influencer', 'name email');
            collaborations = collaborations.filter(c => c.campaign !== null);
        } else {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        res.json(collaborations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCollaborationById = async (req, res) => {
    try {
        const collaboration = await Collaboration.findById(req.params.id)
            .populate('campaign', 'title brand')
            .populate('influencer', 'name email');

        if (!collaboration) {
            return res.status(404).json({ message: 'Collaboration not found' });
        }

        if (
            req.user.role !== 'admin' &&
            collaboration.influencer._id.toString() !== req.user._id.toString() &&
            collaboration.campaign.brand.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: 'Not authorized to view this collaboration' });
        }

        res.json(collaboration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCollaboration = async (req, res) => {
    try {
        const collaboration = await Collaboration.findById(req.params.id);
        if (!collaboration) {
            return res.status(404).json({ message: 'Collaboration not found' });
        }

        if (
            collaboration.influencer.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized to update this collaboration' });
        }

        const { message, status } = req.body;
        if (req.user.role === 'admin' && status) collaboration.status = status;
        if (collaboration.influencer.toString() === req.user._id.toString() && message) {
            collaboration.message = message;
        }

        const updatedCollaboration = await collaboration.save();
        res.json(updatedCollaboration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCollaboration = async (req, res) => {
    try {
        const collaboration = await Collaboration.findById(req.params.id);
        if (!collaboration) {
            return res.status(404).json({ message: 'Collaboration not found' });
        }

        if (
            collaboration.influencer.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ message: 'Not authorized to delete this collaboration' });
        }

        await collaboration.deleteOne();
        res.json({ message: 'Collaboration deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
