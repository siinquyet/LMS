import { Router } from 'express';
import { prisma } from '../utils/db.js';
import { parseId } from '../utils/parse.js';
import { handleError } from '../utils/serializers.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: 'asc' },
    });
    res.json({
      categories: categories.map((category) => ({
        id: category.id,
        ten: category.name,
      })),
    });
  } catch (error) {
    handleError(res, error);
  }
});

router.post('/', authenticate, async (req, res) => {
  const { ten } = req.body as { ten?: string };
  const name = ten?.trim();

  if (!name) {
    res.status(400).json({ error: 'Category name is required' });
    return;
  }

  try {
    const category = await prisma.category.create({
      data: { name },
    });
    res.status(201).json({ category: { id: category.id, ten: category.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/:id', async (req, res) => {
  const categoryId = parseId(req.params.id);
  const { ten } = req.body as { ten?: string };
  const name = ten?.trim();

  if (!categoryId || !name) {
    res.status(400).json({ error: 'Invalid category payload' });
    return;
  }

  try {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name },
    });
    res.json({ category: { id: category.id, ten: category.name } });
  } catch (error) {
    handleError(res, error);
  }
});

router.delete('/:id', async (req, res) => {
  const categoryId = parseId(req.params.id);

  if (!categoryId) {
    res.status(400).json({ error: 'Invalid category id' });
    return;
  }

  try {
    await prisma.category.delete({ where: { id: categoryId } });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
});

export default router;