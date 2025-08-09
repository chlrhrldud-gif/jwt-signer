import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  try {
    const { payload, privateKey } = req.body;

    if (!payload || !privateKey) {
      return res.status(400).json({ error: 'Missing payload or privateKey' });
    }

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
