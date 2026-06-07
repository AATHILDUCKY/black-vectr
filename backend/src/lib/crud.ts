import { Router } from "express";
import { ZodSchema } from "zod";
import { prisma } from "./prisma";
import { asyncHandler, ApiError } from "../middleware/error";
import { requireAuth } from "../middleware/auth";
import {
  parseJsonFields,
  parseJsonFieldsAll,
  serializeJsonFields,
} from "./json";

export interface CrudOptions {
  /** Prisma delegate key, e.g. "post", "service". */
  model: string;
  createSchema: ZodSchema;
  updateSchema: ZodSchema;
  /** Columns stored as JSON strings (parsed on read, serialized on write). */
  jsonFields?: string[];
  /** Allow unauthenticated GET (list + detail). Writes are always protected. */
  publicRead?: boolean;
  orderBy?: Record<string, "asc" | "desc"> | Record<string, "asc" | "desc">[];
  include?: Record<string, unknown>;
  /** Fields the `?search=` query matches against (contains). */
  searchFields?: string[];
  /** Scalar fields allowed as `?field=value` filters. */
  filterFields?: string[];
}

/**
 * Builds a REST router for one Prisma model:
 *   GET /            list (search, filters, pagination)
 *   GET /:id         detail
 *   POST /           create   (auth)
 *   PUT|PATCH /:id   update   (auth)
 *   DELETE /:id      delete   (auth)
 */
export function crudRouter(opts: CrudOptions): Router {
  const router = Router();
  const delegate = () => (prisma as any)[opts.model];
  const json = opts.jsonFields ?? [];

  const guard = opts.publicRead ? [] : [requireAuth];

  // LIST
  router.get(
    "/",
    ...guard,
    asyncHandler(async (req, res) => {
      const { search, take, skip, orderBy } = req.query;
      const where: Record<string, unknown> = {};

      if (search && opts.searchFields?.length) {
        where.OR = opts.searchFields.map((f) => ({
          [f]: { contains: String(search) },
        }));
      }
      for (const f of opts.filterFields ?? []) {
        if (req.query[f] !== undefined) where[f] = req.query[f];
      }

      const rows = await delegate().findMany({
        where,
        orderBy: opts.orderBy,
        include: opts.include,
        take: take ? Number(take) : undefined,
        skip: skip ? Number(skip) : undefined,
      });
      res.json(parseJsonFieldsAll(rows, json));
    }),
  );

  // DETAIL — by numeric id or by slug
  router.get(
    "/:id",
    ...guard,
    asyncHandler(async (req, res) => {
      const row = await findByIdOrSlug(opts.model, req.params.id, opts.include);
      if (!row) throw new ApiError(404, `${opts.model} not found`);
      res.json(parseJsonFields(row, json));
    }),
  );

  // CREATE
  router.post(
    "/",
    requireAuth,
    asyncHandler(async (req, res) => {
      const data = serializeJsonFields(opts.createSchema.parse(req.body), json);
      const row = await delegate().create({ data, include: opts.include });
      res.status(201).json(parseJsonFields(row, json));
    }),
  );

  // UPDATE
  const update = asyncHandler(async (req: any, res: any) => {
    const data = serializeJsonFields(opts.updateSchema.parse(req.body), json);
    const row = await delegate().update({
      where: { id: Number(req.params.id) },
      data,
      include: opts.include,
    });
    res.json(parseJsonFields(row, json));
  });
  router.put("/:id", requireAuth, update);
  router.patch("/:id", requireAuth, update);

  // DELETE
  router.delete(
    "/:id",
    requireAuth,
    asyncHandler(async (req, res) => {
      await delegate().delete({ where: { id: Number(req.params.id) } });
      res.status(204).end();
    }),
  );

  return router;
}

// Resolve a route param that may be a numeric id or a slug.
async function findByIdOrSlug(
  model: string,
  param: string,
  include?: Record<string, unknown>,
) {
  const delegate = (prisma as any)[model];
  const asNumber = Number(param);
  if (Number.isInteger(asNumber) && String(asNumber) === param) {
    return delegate.findUnique({ where: { id: asNumber }, include });
  }
  return delegate.findUnique({ where: { slug: param }, include });
}
