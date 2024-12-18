# Sonick 🎵

A command-line tool to download music from Bandcamp with proper metadata and artwork. This tool automatically organizes downloads by date and embeds track metadata including album artwork.

## Features

- 🎵 Downloads tracks from Bandcamp
- 📝 Automatically adds metadata (title, artist, album)
- 🖼️ Embeds album artwork
- 📁 Organizes downloads by date
- 🔧 Customizable download location via environment variables

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/sonick.git
cd sonick
```

2. Install dependencies:
```bash
npm install
```

3. Install globally:
```bash
npm install -g .
```

4. Set up environment variables:
   - Find your global node_modules directory: `npm root -g`
   - Create a `.env` file in the sonick directory
   - Add your music folder path:
```env
MUSIC_FOLDER="/path/to/your/music/folder"
```

## Usage

Download a track from Bandcamp:
```bash
sonick -b https://artist.bandcamp.com/track/song-name
```

The track will be downloaded and organized as:
```
{MUSIC_FOLDER}/
└── 2024-03-17/
    └── Artist - Song Name.mp3
```

## File Structure

```
sonick/
├── index.js          # Main application file
├── package.json      # Project configuration
├── .env             # Environment variables
└── README.md        # Documentation
```

## Dependencies

- `axios`: HTTP client for making requests
- `cheerio`: HTML parsing for extracting track data
- `node-id3`: Handling MP3 metadata and artwork
- `dotenv`: Managing environment variables

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Make your changes
4. Test locally: `node index.js -b <url>`
5. Reinstall globally: `npm install -g .`

## Configuration

The `.env` file supports the following variables:
- `MUSIC_FOLDER`: Absolute path to your music directory

## Troubleshooting

Common issues:
- If the download fails, ensure the track is freely downloadable or purchased
- Check that your `.env` file is in the correct location
- Verify you have write permissions in the music folder

## Notes

- This tool is for personal use only
- Please respect artists' rights and Bandcamp's terms of service
- Only works with tracks that are freely downloadable or purchased

## License

ISC

## Author

Nicolas Elmir

## Contributing

This is a personal tool, but suggestions are welcome through issues or pull requests.

---

**Note**: This tool is designed for personal use and should be used in accordance with Bandcamp's terms of service.
```
