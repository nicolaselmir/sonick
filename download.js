import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

async function downloadMP3(audioUrl, fileName) {
  try {
    const response = await axios({
      method: 'GET',
      url: audioUrl,
      responseType: 'arraybuffer'
    });

    const sanitizedFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filePath = path.join(process.cwd(), `${sanitizedFileName}.mp3`);
    
    await fs.writeFile(filePath, response.data);
    console.log(`Downloaded: ${filePath}`);
    return filePath;
  } catch (error) {
    throw new Error(`Failed to download MP3: ${error.message}`);
  }
}

// Usage example:
const { audioUrl, name } = await getBandcampSongData(url);
if (audioUrl) {
  await downloadMP3(audioUrl, name);
} else {
  console.log('No audio URL available - track might not be freely downloadable');
} 