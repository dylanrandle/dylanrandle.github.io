import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { PREVIEW_WIDTHS } from '../src/config.ts';
import { PUBLIC_DIRECTORY } from '../src/lib/paths.ts';

const images = path.join(PUBLIC_DIRECTORY, 'assets/images');
const files = readdirSync(images).filter(
  (file) => /\.(webp|jpe?g|png)$/.test(file) && !/-\d+w\./.test(file),
);
let savings = 0;
let created = 0;

const save = (file, buffer) => {
  const previous = existsSync(file) ? readFileSync(file) : undefined;
  // Refresh changed sources even when the new encode is larger. Keeping an
  // older, smaller file would silently serve the wrong image.
  if (previous?.equals(buffer)) return;
  if (previous) savings += previous.length - buffer.length;
  else created++;
  writeFileSync(file, buffer);
  console.log(
    `${path.basename(file)}: ${(buffer.length / 1024).toFixed(1)} KiB`,
  );
};

for (const file of files) {
  const stem = file.replace(/\.[^.]+$/, '');
  // Prefer the JPEG/PNG source over its generated WebP counterpart.
  if (
    file.endsWith('.webp') &&
    files.some((name) => name !== file && name.replace(/\.[^.]+$/, '') === stem)
  )
    continue;
  const input = readFileSync(path.join(images, file));
  const metadata = await sharp(input, { animated: true }).metadata();
  const options = {
    quality: (metadata.pages ?? 1) > 1 ? 70 : 80,
    effort: 6,
    smartSubsample: true,
    loop: metadata.loop,
    delay: metadata.delay,
  };
  if (!file.endsWith('.webp'))
    save(
      path.join(images, `${stem}.webp`),
      await sharp(input, { animated: true }).webp(options).toBuffer(),
    );
  for (const width of PREVIEW_WIDTHS) {
    if (width >= metadata.width) continue;
    const buffer = await sharp(input, { animated: true })
      .resize({ width, withoutEnlargement: true })
      .webp(options)
      .toBuffer();
    const output = await sharp(buffer, { animated: true }).metadata();
    if (
      (output.pages ?? 1) !== (metadata.pages ?? 1) ||
      JSON.stringify(output.delay) !== JSON.stringify(metadata.delay) ||
      output.loop !== metadata.loop ||
      (metadata.hasAlpha && !output.hasAlpha)
    )
      throw new Error(
        `Animation or transparency changed: ${file} at ${width}px`,
      );
    save(path.join(images, `${stem}-${width}w.webp`), buffer);
  }
}

if (process.argv.includes('--videos')) {
  const videos = path.join(PUBLIC_DIRECTORY, 'assets/videos');
  for (const file of readdirSync(videos).filter(
    (file) => file.endsWith('.mp4') && !/-\d+w\.mp4$/.test(file),
  )) {
    const input = path.join(videos, file);
    const metadata = JSON.parse(
      execFileSync(
        'ffprobe',
        [
          '-v',
          'error',
          '-select_streams',
          'v:0',
          '-show_streams',
          '-of',
          'json',
          input,
        ],
        { encoding: 'utf8' },
      ),
    ).streams[0];
    const colorArguments = [];
    for (const [field, option] of [
      ['color_space', '-colorspace'],
      ['color_transfer', '-color_trc'],
      ['color_primaries', '-color_primaries'],
      ['color_range', '-color_range'],
    ])
      if (metadata[field] && metadata[field] !== 'unknown')
        colorArguments.push(option, metadata[field]);
    for (const width of PREVIEW_WIDTHS) {
      if (metadata.width <= width) continue;
      const output = input.replace(/\.mp4$/, `-${width}w.mp4`);
      if (existsSync(output)) continue;
      execFileSync(
        'ffmpeg',
        [
          '-v',
          'error',
          '-i',
          input,
          '-map',
          '0:v:0',
          '-map',
          '0:a?',
          '-vf',
          `scale=${width}:-2`,
          '-c:v',
          'libx264',
          '-profile:v',
          'high',
          '-pix_fmt',
          'yuv420p',
          '-preset',
          'slow',
          '-crf',
          '25',
          '-fps_mode',
          'passthrough',
          '-c:a',
          'copy',
          '-map_metadata',
          '0',
          ...colorArguments,
          '-movflags',
          '+faststart',
          output,
        ],
        { stdio: 'inherit' },
      );
      console.log(
        `${path.basename(output)}: ${(readFileSync(output).length / 1024).toFixed(1)} KiB`,
      );
    }
  }
}
console.log(
  `Created ${created} image variants; reduced existing images by ${(savings / 1024).toFixed(1)} KiB.`,
);
