import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
    console.log("=== TOKEN GENERATION DEBUG INFO ===");
    console.log("Generating token for id:", id);
    console.log("Generating token for role:", role);
    console.log("==================================");
    
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export default generateToken;