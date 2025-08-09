// api/sign.js
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) {}
    }

    const { payload, privateKey } = body || {};

    if (!payload || !privateKey) {
      return res.status(400).json({
        error: 'Missing "payload" or "privateKey"',
        example: {
          payload: { iss: '...', aud: '...', exp: 1234567890, iat: 1234567890 },
          privateKey: '-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n'
        }
      });
    }

    // exp/iat가 문자열일 경우 숫자로 변환
    ['exp', 'iat'].forEach((k) => {
      if (payload[k] != null && typeof payload[k] !== 'number') {
        const n = Number(payload[k]);
        if (!Number.isNaN(n)) payload[k] = n;
      }
    });

    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      header: { alg: 'RS256', typ: 'JWT' }
    });

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
}
