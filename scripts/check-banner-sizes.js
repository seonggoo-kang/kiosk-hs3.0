import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const dir = join(process.cwd(), 'public', 'banners');

try {
  const files = readdirSync(dir).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f));
  console.log(`Found ${files.length} banner images:\n`);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stats = statSync(filePath);
    try {
      const meta = await sharp(filePath).metadata();
      const ratio = (meta.width / meta.height).toFixed(3);
      console.log(`${file}`);
      console.log(`  ${meta.width}x${meta.height}  ratio=${ratio}  (${(stats.size / 1024).toFixed(0)}KB)`);
      console.log();
    } catch (e) {
      console.log(`${file} - could not read metadata: ${e.message}`);
    }
  }
} catch (e) {
  console.log('Error reading banners directory:', e.message);
}
