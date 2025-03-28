// frontend/pages/api/uploadToIPFS.js
import FormData from 'form-data';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

// Correctly point to your root .env file (this path should match your directory structure)
dotenv.config({ path: path.resolve(__dirname, '../../../../../.env') });

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buffer = Buffer.from(req.body.fileContent, 'base64');
    const formData = new FormData();
    formData.append('file', buffer, { filename: req.body.fileName });

    const JWT = process.env.PINATA_JWT;
    if (!JWT) {
      throw new Error("🚨 Missing PINATA_JWT. Check your .env configuration.");
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`Pinata error: ${errorDetails}`);
    }

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}