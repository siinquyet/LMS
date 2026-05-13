export interface PaginationInput {
  page?: number;
  limit?: number;
  cursor?: number;
  cursorField?: string;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  limit: number;
  hasMore: boolean;
  nextCursor?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
    nextCursor?: number;
  };
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function parsePagination(input: PaginationInput): PaginationResult {
  const page = Math.max(1, Number(input.page) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(input.limit) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit, hasMore: true };
}

export function parseCursorPagination(input: PaginationInput): { take: number; cursor?: { id: number } } {
  const take = Math.min(MAX_LIMIT, Math.max(1, Number(input.limit) || DEFAULT_LIMIT));
  const cursor = input.cursor ? { id: Number(input.cursor) } : undefined;
  return { take: take + 1, cursor };
}

export function buildPaginatedResponse<T>(
  data: T[],
  result: PaginationResult,
  total: number,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / result.limit);
  const hasMore = result.page < totalPages;

  return {
    data: data.slice(0, result.take),
    pagination: {
      page: result.page,
      limit: result.limit,
      total,
      totalPages,
      hasMore,
    },
  };
}

export function buildCursorResponse<T extends { id: number }>(
  data: T[],
  take: number,
): PaginatedResponse<T> {
  const hasMore = data.length > take;
  const items = hasMore ? data.slice(0, take) : data;
  const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : undefined;

  return {
    data: items,
    pagination: {
      page: 1,
      limit: take,
      total: -1,
      totalPages: -1,
      hasMore,
      nextCursor,
    },
  };
}

export function extractPaginationParams(query: Record<string, unknown>): {
  page: number;
  limit: number;
  skip: number;
  cursor?: number;
} {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;
  const cursor = query.cursor ? Number(query.cursor) : undefined;
  return { page, limit, skip, cursor };
}