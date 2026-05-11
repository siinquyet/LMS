#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const uploadsDir = path.join(__dirname, '../../uploads');

interface CleanupResult {
  orphanedFiles: string[];
  orphanedDBRecords: string[];
  deletedFiles: number;
  deletedRecords: number;
  errors: string[];
}

async function getAllMediaUrls(): Promise<Set<string>> {
  const medias = await prisma.media.findMany({
    select: { url: true }
  });
  return new Set(medias.map(m => m.url));
}

async function getAllAvatarUrls(): Promise<Set<string>> {
  const users = await prisma.user.findMany({
    where: { avatarUrl: { not: null } },
    select: { avatarUrl: true }
  });
  return new Set(users.map(u => u.avatarUrl!).filter(Boolean));
}

function getAllFilesRecursive(dir: string, relativeTo: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(relativeTo, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllFilesRecursive(fullPath, relativePath));
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

async function cleanup(): Promise<CleanupResult> {
  const result: CleanupResult = {
    orphanedFiles: [],
    orphanedDBRecords: [],
    deletedFiles: 0,
    deletedRecords: 0,
    errors: []
  };

  try {
    console.log('🔍 Scanning database for all media URLs...');
    const dbMediaUrls = await getAllMediaUrls();
    const dbAvatarUrls = await getAllAvatarUrls();
    const allDbUrls = new Set([...dbMediaUrls, ...dbAvatarUrls]);

    console.log(`📊 Found ${allDbUrls.size} URLs in database`);

    console.log('🔍 Scanning uploads directory...');
    const allDiskFiles = getAllFilesRecursive(uploadsDir, '/uploads');
    console.log(`📊 Found ${allDiskFiles.length} files on disk`);

    console.log('\n🗑️  Finding orphaned files (on disk but not in DB)...');
    for (const fileUrl of allDiskFiles) {
      if (!allDbUrls.has(fileUrl)) {
        result.orphanedFiles.push(fileUrl);
      }
    }

    console.log(`📁 ${result.orphanedFiles.length} orphaned files found`);

    if (result.orphanedFiles.length > 0) {
      console.log('\n🗑️  Deleting orphaned files...');
      for (const fileUrl of result.orphanedFiles) {
        try {
          const fullPath = path.join(__dirname, '../..', fileUrl);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            result.deletedFiles++;
            console.log(`  ✅ Deleted: ${fileUrl}`);
          }
        } catch (err) {
          result.errors.push(`Failed to delete ${fileUrl}: ${err}`);
        }
      }
    }

    console.log('\n🗑️  Finding orphaned DB records (in DB but file missing)...');
    const medias = await prisma.media.findMany();
    for (const media of medias) {
      const fullPath = path.join(__dirname, '../..', media.url);
      if (!fs.existsSync(fullPath)) {
        result.orphanedDBRecords.push(media.url);
      }
    }

    console.log(`📁 ${result.orphanedDBRecords.length} orphaned DB records found`);

    if (result.orphanedDBRecords.length > 0) {
      console.log('\n🗑️  Deleting orphaned DB records...');
      for (const url of result.orphanedDBRecords) {
        try {
          await prisma.media.deleteMany({
            where: { url }
          });
          result.deletedRecords++;
          console.log(`  ✅ Deleted DB record: ${url}`);
        } catch (err) {
          result.errors.push(`Failed to delete DB record ${url}: ${err}`);
        }
      }
    }

    console.log('\n✅ Cleanup complete!');
    console.log(`   Files deleted: ${result.deletedFiles}`);
    console.log(`   DB records deleted: ${result.deletedRecords}`);
    console.log(`   Errors: ${result.errors.length}`);

  } catch (error) {
    result.errors.push(`Cleanup failed: ${error}`);
    console.error('❌ Cleanup failed:', error);
  }

  await prisma.$disconnect();
  return result;
}

const result = await cleanup();
process.exit(result.errors.length > 0 ? 1 : 0);