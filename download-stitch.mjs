import { mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { stitch } from "@google/stitch-sdk";

const projectId = process.argv[2];
const screenId = process.argv[3];
const outputDir = process.argv[4] ?? "downloads";

if (!projectId || !screenId) {
  console.error(
    "Usage: node download-stitch.mjs <projectId> <screenId> [outputDir]"
  );
  process.exit(1);
}

if (!process.env.STITCH_API_KEY && !process.env.STITCH_ACCESS_TOKEN) {
  console.error(
    "Missing auth. Set STITCH_API_KEY (or STITCH_ACCESS_TOKEN + GOOGLE_CLOUD_PROJECT)."
  );
  process.exit(1);
}

function runCurl(url, outFile) {
  const result = spawnSync("curl", ["-L", url, "-o", outFile], {
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error(`curl failed for ${outFile}`);
  }
}

try {
  await mkdir(outputDir, { recursive: true });

  const project = stitch.project(projectId);
  const screen = await project.getScreen(screenId);
  const htmlUrl = await screen.getHtml();
  const imageUrl = await screen.getImage();

  console.log("htmlUrl:", htmlUrl);
  console.log("imageUrl:", imageUrl);

  runCurl(htmlUrl, `${outputDir}/${screenId}.html`);
  runCurl(imageUrl, `${outputDir}/${screenId}.png`);

  console.log(`Downloaded files to: ${outputDir}`);
} catch (error) {
  console.error(error?.message ?? error);
  process.exit(1);
}
