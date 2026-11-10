import express from 'express';
import path from 'path';
import fs from 'fs/promises';

import { the_splendor_falls, pioneers_o_pioneers } from './poems.js';

const ROOT = path.resolve(process.env.USB_PATH || '/media/usb'); // your mount point
const app = express();

// Resolve a user-supplied path and make sure it stays inside ROOT
const safe = (rel = '') => {
  const full = path.resolve(ROOT, '.' + path.sep + rel);
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) throw new Error('Forbidden');
  return full;
};

// List a directory: GET /api/list?path=some/folder
app.get('/api/list', async (req, res) => {
  console.log('req!!')

  const poems = retrievePoems();

  res.json({poems})
  // try {
  //   const entries = await fs.readdir(safe(req.query.path), { withFileTypes: true });
  //   res.json(entries.map(e => ({ name: e.name, isDir: e.isDirectory() })));
  // } catch (err) {
  //   res.status(err.message === 'Forbidden' ? 403 : 404).json({ error: err.message });
  // }
});

function retrievePoems(){
  // add ability to look through usb drive for existing poems

  return [
    toPoemArray(the_splendor_falls),
    toPoemArray(pioneers_o_pioneers)
  ]
}

function toPoemArray(text){
  return {poemArray: text}
}

// Read/download a file: GET /api/file?path=some/file.txt
app.get('/api/file', (req, res) => {
  try {
    res.sendFile(safe(req.query.path));
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

app.listen(3001, () => console.log(`Serving ${ROOT} on http://localhost:3001`));