import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const serveVideoFile = (req, res) => {
  const { artist, filename } = req.params;
  const filePath = path.join(__dirname, '../cloud_storage_simulation', artist, filename);

  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
  res.setHeader('Content-Disposition', 'inline');

  res.sendFile(filePath, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).send('File not found');
      } 
      return res.status(500).send('Server error');
    }
  });
};
