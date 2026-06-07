import { Router } from "express";
import authRouter from "./auth";
import contactRouter from "./contact";
import newsletterRouter from "./newsletter";
import leadsRouter from "./leads";
import settingsRouter from "./settings";
import dashboardRouter from "./dashboard";
import uploadsRouter from "./uploads";
import { crudRouter } from "../lib/crud";
import {
  postCreateSchema,
  postUpdateSchema,
  categoryCreateSchema,
  categoryUpdateSchema,
  portfolioCreateSchema,
  portfolioUpdateSchema,
  serviceCreateSchema,
  serviceUpdateSchema,
  testimonialCreateSchema,
  testimonialUpdateSchema,
  teamCreateSchema,
  teamUpdateSchema,
  projectCreateSchema,
  projectUpdateSchema,
  logoCreateSchema,
  logoUpdateSchema,
} from "../schemas";

const api = Router();

// Auth + special-purpose routes
api.use("/auth", authRouter);
api.use("/contact", contactRouter);
api.use("/newsletter", newsletterRouter);
api.use("/leads", leadsRouter);
api.use("/settings", settingsRouter);
api.use("/dashboard", dashboardRouter);
api.use("/uploads", uploadsRouter);

// Content entities — public reads, protected writes, via the generic factory.
api.use(
  "/posts",
  crudRouter({
    model: "post",
    createSchema: postCreateSchema,
    updateSchema: postUpdateSchema,
    jsonFields: ["tags"],
    publicRead: true,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: { category: true },
    searchFields: ["title", "excerpt", "body"],
    filterFields: ["status", "categoryId"],
  }),
);

api.use(
  "/categories",
  crudRouter({
    model: "category",
    createSchema: categoryCreateSchema,
    updateSchema: categoryUpdateSchema,
    publicRead: true,
    orderBy: { name: "asc" },
  }),
);

api.use(
  "/portfolio",
  crudRouter({
    model: "portfolioItem",
    createSchema: portfolioCreateSchema,
    updateSchema: portfolioUpdateSchema,
    jsonFields: ["images"],
    publicRead: true,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    searchFields: ["title", "client", "summary"],
    filterFields: ["category", "featured"],
  }),
);

api.use(
  "/services",
  crudRouter({
    model: "service",
    createSchema: serviceCreateSchema,
    updateSchema: serviceUpdateSchema,
    jsonFields: ["features"],
    publicRead: true,
    orderBy: { order: "asc" },
    searchFields: ["title", "shortDescription"],
  }),
);

api.use(
  "/testimonials",
  crudRouter({
    model: "testimonial",
    createSchema: testimonialCreateSchema,
    updateSchema: testimonialUpdateSchema,
    publicRead: true,
    orderBy: { order: "asc" },
  }),
);

api.use(
  "/team",
  crudRouter({
    model: "teamMember",
    createSchema: teamCreateSchema,
    updateSchema: teamUpdateSchema,
    jsonFields: ["socials"],
    publicRead: true,
    orderBy: { order: "asc" },
  }),
);

api.use(
  "/projects",
  crudRouter({
    model: "project",
    createSchema: projectCreateSchema,
    updateSchema: projectUpdateSchema,
    jsonFields: ["topics", "resources"],
    publicRead: true,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    searchFields: ["title", "tagline", "description"],
    filterFields: ["status", "featured"],
  }),
);

api.use(
  "/logos",
  crudRouter({
    model: "logo",
    createSchema: logoCreateSchema,
    updateSchema: logoUpdateSchema,
    publicRead: true,
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    searchFields: ["name"],
  }),
);

export default api;
