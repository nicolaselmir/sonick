#!/usr/bin/env node

import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";
import NodeID3 from "node-id3";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const getBandcampSongData = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract the TralbumData from the script tag
    const scriptContent = $("script[data-tralbum]").attr("data-tralbum");
    if (!scriptContent) {
      throw new Error("Could not find track data");
    }

    const trackData = JSON.parse(scriptContent);
    const trackInfo = trackData.trackinfo[0];

    return {
      name: $("meta[property='og:title']").attr("content"),
      imageUrl: $("meta[property='og:image']").attr("content"),
      artist: $("meta[property='og:site_name']").attr("content"),
      streamUrl: trackInfo.file?.["mp3-128"] || null,
      duration: trackInfo.duration,
      albumTitle: trackData.current.title,
      releaseDate: trackData.current.release_date,
      type: trackData.current.type,
      audioUrl: trackInfo.file?.["mp3-128"] || null,
    };
  } catch (error) {
    throw new Error(`Error fetching Bandcamp page: ${error.message}`);
  }
};

async function downloadMP3(audioUrl, songData) {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Use the path from .env
    const musicFolder = process.env.MUSIC_FOLDER;
    if (!musicFolder) {
      throw new Error("MUSIC_FOLDER not set in environment variables");
    }

    // Create the full path with date
    const downloadPath = path.join(musicFolder, today);

    // Create directory if it doesn't exist
    await fs.mkdir(downloadPath, { recursive: true });

    const audioResponse = await axios({
      method: "GET",
      url: audioUrl,
      responseType: "arraybuffer",
    });

    const imageResponse = await axios({
      method: "GET",
      url: songData.imageUrl,
      responseType: "arraybuffer",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const sanitizedFileName = `${songData.artist} - ${songData.name}`
      .replace(/[<>:"/\\|?*]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const filePath = path.join(downloadPath, `${sanitizedFileName}.mp3`);

    await fs.writeFile(filePath, audioResponse.data);

    const tags = {
      title: songData.name,
      artist: songData.artist,
      album: songData.albumTitle,
      APIC: {
        mime: "image/jpeg",
        type: {
          id: 3,
          name: "front cover",
        },
        description: "Album cover",
        imageBuffer: imageResponse.data,
      },
      year: songData.releaseDate,
    };

    const success = NodeID3.write(tags, filePath);

    if (success) {
      console.log(`Downloaded and tagged: ${filePath}`);
    } else {
      console.log("Warning: Tags might not have been written properly");
    }

    return filePath;
  } catch (error) {
    throw new Error(`Failed to download MP3: ${error.message}`);
  }
}

// Command line handling
const args = process.argv.slice(2);
const platform = args[0];
const url = args[1];

if (!platform || !url) {
  console.log("Usage: node index.js -b <bandcamp-url>");
  process.exit(1);
}

async function main() {
  try {
    let songData;
    if (platform === "-b") {
      songData = await getBandcampSongData(url);
      await downloadMP3(songData.audioUrl, songData);
    } else {
      console.log("Invalid platform. Use -b then add the url.");
      process.exit(1);
    }
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
