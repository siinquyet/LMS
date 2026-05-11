#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DiskUsage {
  total: number;
  used: number;
  free: number;
  usedPercent: number;
}

const uploadsDir = path.join(__dirname, '../../uploads');
const WARNING_THRESHOLD = 80;
const CRITICAL_THRESHOLD = 90;

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getDirStats(dir: string): { count: number; size: number } {
  let count = 0;
  let size = 0;

  if (!fs.existsSync(dir)) {
    return { count: 0, size: 0 };
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const subStats = getDirStats(fullPath);
      count += subStats.count;
      size += subStats.size;
    } else {
      const stats = fs.statSync(fullPath);
      count++;
      size += stats.size;
    }
  }

  return { count, size };
}

async function getSystemDiskUsage(): Promise<DiskUsage> {
  try {
    if (process.platform === 'linux') {
      const { stdout } = await execAsync("df -B1 / | tail -1 | awk '{print $2\",\"$3\",\"$4\",\"$5}'");
      const [total, used, free, usedPercent] = stdout.trim().split(',');
      return {
        total: parseInt(total),
        used: parseInt(used),
        free: parseInt(free),
        usedPercent: parseInt(usedPercent)
      };
    } else if (process.platform === 'win32') {
      const { stdout } = await execAsync('wmic logicaldisk where "DeviceID=\'C:\'" get Size,FreeSpace /format:value');
      const sizeMatch = stdout.match(/Size=(\d+)/);
      const freeMatch = stdout.match(/FreeSpace=(\d+)/);
      const total = sizeMatch ? parseInt(sizeMatch[1]) : 0;
      const free = freeMatch ? parseInt(freeMatch[1]) : 0;
      const used = total - free;
      return {
        total,
        used,
        free,
        usedPercent: total ? Math.round((used / total) * 100) : 0
      };
    }
  } catch (error) {
    console.error('Failed to get disk usage:', error);
  }

  return { total: 0, used: 0, free: 0, usedPercent: 0 };
}

async function checkStorage(): Promise<void> {
  console.log('📊 LMS Storage Report\n');
  console.log('=' .repeat(50));

  const disk = await getSystemDiskUsage();
  console.log('\n🖴 System Disk Usage:');
  console.log(`   Total: ${formatBytes(disk.total)}`);
  console.log(`   Used: ${formatBytes(disk.used)} (${disk.usedPercent}%)`);
  console.log(`   Free: ${formatBytes(disk.free)}`);

  if (disk.usedPercent >= CRITICAL_THRESHOLD) {
    console.log(`   ⚠️  CRITICAL: Disk usage above ${CRITICAL_THRESHOLD}%!`);
  } else if (disk.usedPercent >= WARNING_THRESHOLD) {
    console.log(`   ⚠️  WARNING: Disk usage above ${WARNING_THRESHOLD}%`);
  } else {
    console.log(`   ✅ Disk usage normal`);
  }

  console.log('\n📁 Uploads Directory:');

  const avatarsStats = fs.existsSync(path.join(uploadsDir, 'avatars'))
    ? getDirStats(path.join(uploadsDir, 'avatars'))
    : { count: 0, size: 0 };

  const forumStats = fs.existsSync(path.join(uploadsDir, 'forum'))
    ? getDirStats(path.join(uploadsDir, 'forum'))
    : { count: 0, size: 0 };

  const coursesStats = fs.existsSync(path.join(uploadsDir, 'courses'))
    ? getDirStats(path.join(uploadsDir, 'courses'))
    : { count: 0, size: 0 };

  const totalStats = {
    count: avatarsStats.count + forumStats.count + coursesStats.count,
    size: avatarsStats.size + forumStats.size + coursesStats.size
  };

  console.log(`   Avatars: ${avatarsStats.count} files (${formatBytes(avatarsStats.size)})`);
  console.log(`   Forum: ${forumStats.count} files (${formatBytes(forumStats.size)})`);
  console.log(`   Courses: ${coursesStats.count} files (${formatBytes(coursesStats.size)})`);
  console.log(`   ─────────────────────────`);
  console.log(`   Total: ${totalStats.count} files (${formatBytes(totalStats.size)})`);

  const uploadDirSize = totalStats.size;
  const uploadDirPercent = disk.total ? (uploadDirSize / disk.total) * 100 : 0;
  console.log(`   📦 Uploads: ${formatBytes(uploadDirSize)} (${uploadDirPercent.toFixed(2)}% of disk)`);

  console.log('\n' + '='.repeat(50));
  console.log('\n💡 Recommendations:');

  if (disk.usedPercent >= WARNING_THRESHOLD) {
    console.log('   - Run cleanup script: npx tsx src/scripts/cleanup-orphans.ts');
    console.log('   - Consider migrating old files to cloud storage');
    console.log('   - Review and delete unnecessary uploads');
  }

  if (uploadDirPercent > 50) {
    console.log('   - Uploads directory is large, consider S3/Cloudinary migration');
  }

  console.log('');
}

checkStorage().catch(console.error);