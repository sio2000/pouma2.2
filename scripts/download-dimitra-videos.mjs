/**
 * Re-download Instagram videos for the home page section.
 * Requires: pip install yt-dlp
 * Run: node scripts/download-dimitra-videos.mjs
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "public");

const posts = [
  { out: "dimitra1", url: "https://www.instagram.com/p/DW4Tqx6so8R/" },
  { out: "dimitra2", url: "https://www.instagram.com/p/DUJFPRwjGLZ/" },
  { out: "dimitra3", url: "https://www.instagram.com/p/DYIRx1RtkBN/" },
];

const baseArgs = [
  "-m",
  "yt_dlp",
  "--no-check-certificate",
  "-f",
  "best[ext=mp4]/best",
  "--no-playlist",
];

for (const { out, url } of posts) {
  console.log(`\n→ ${out} from ${url}`);
  const video = spawnSync(
    "python",
    [...baseArgs, "-o", path.join(pub, `${out}.%(ext)s`), url],
    { stdio: "inherit", cwd: root }
  );
  if (video.status !== 0) process.exit(video.status ?? 1);

  spawnSync(
    "python",
    [
      "-m",
      "yt_dlp",
      "--no-check-certificate",
      "--skip-download",
      "--write-thumbnail",
      "--convert-thumbnails",
      "jpg",
      "-o",
      path.join(pub, out),
      url,
    ],
    { stdio: "inherit", cwd: root }
  );
}

console.log("\nDone. Files in public/: dimitra1–3.mp4 and .jpg");
