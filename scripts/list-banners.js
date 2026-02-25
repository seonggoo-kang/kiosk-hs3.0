import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const dir = join(process.cwd(), 'public', 'banners');
try {
  const files = readdirSync(dir);
  console.log(`Found ${files.length} entries in public/banners/:`);
  files.forEach(f => {
    const stat = statSync(join(dir, f));
    console.log(`  ${stat.isDirectory() ? '[DIR]' : '[FILE]'} ${f} (${stat.size} bytes)`);
  });
} catch (e) {
  console.log('Error reading directory:', e.message);
}
