import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parseTimestamp(value: string | null): number | null {
	if (!value) return null;
	if (/^\d+$/.test(value)) return parseInt(value, 10);

	const parts = value.split(":");
	if (parts.length === 2) {
		const [mins, secs] = parts.map(Number);
		if (!isNaN(mins) && !isNaN(secs)) {
			return mins * 60 + secs;
		}
	}
	if (parts.length === 3) {
		const [hours, mins, secs] = parts.map(Number);
		if (!isNaN(hours) && !isNaN(mins) && !isNaN(secs)) {
			return hours * 3600 + mins * 60 + secs;
		}
	}

	return null;
}

async function migrate() {
	console.log("Starting timestamp migration (String → Int)...");

	const notes = await prisma.$queryRaw<
		{ id: number; thoi_diem: string | null }[]
	>`SELECT id, thoi_diem FROM ghi_chu WHERE thoi_diem IS NOT NULL`;

	console.log(`Found ${notes.length} notes with timestamps`);

	let updated = 0;
	for (const note of notes) {
		const seconds = parseTimestamp(note.thoi_diem);
		if (seconds !== null) {
			await prisma.$executeRaw`UPDATE ghi_chu SET thoi_diem = ${seconds} WHERE id = ${note.id}`;
			updated++;
			if (updated % 100 === 0) {
				console.log(`  Updated ${updated} notes...`);
			}
		}
	}

	console.log(`Migration complete: ${updated} timestamps converted`);
}

migrate()
	.then(() => {
		console.log("Done!");
		process.exit(0);
	})
	.catch((e) => {
		console.error("Migration failed:", e);
		process.exit(1);
	});