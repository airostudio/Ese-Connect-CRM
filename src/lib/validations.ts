import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email().max(254).optional().or(z.literal("")),
  phone: z.string().max(30).optional(),
  title: z.string().max(150).optional(),
  company: z.string().max(200).optional(),
  status: z.enum(["lead", "prospect", "customer", "churned"]).default("lead"),
  leadScore: z.number().min(0).max(100).default(0),
  tags: z.array(z.string().max(50)).max(20).default([]),
  address: z.string().max(500).optional(),
  companyId: z.string().max(36).optional(),
  ownerId: z.string().max(36).optional(),
});

export const companySchema = z.object({
  name: z.string().min(1, "Company name is required").max(200),
  website: z.string().url().max(500).optional().or(z.literal("")),
  industry: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
  revenue: z.number().min(0).max(1e13).optional(),
  description: z.string().max(2000).optional(),
  address: z.string().max(500).optional(),
});

export const dealSchema = z.object({
  title: z.string().min(1, "Deal title is required").max(200),
  value: z.number().min(0).max(1e12).default(0),
  stage: z
    .enum(["lead", "qualified", "proposal", "negotiation", "closed won", "closed lost"])
    .default("lead"),
  probability: z.number().min(0).max(100).default(10),
  closeDate: z.string().max(30).optional(),
  contactId: z.string().max(36).optional(),
  companyId: z.string().max(36).optional(),
  ownerId: z.string().max(36).optional(),
  pipeline: z.string().max(100).default("default"),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(300),
  description: z.string().max(2000).optional(),
  dueDate: z.string().max(30).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["pending", "in_progress", "completed"]).default("pending"),
  assigneeId: z.string().max(36).optional(),
  contactId: z.string().max(36).optional(),
  dealId: z.string().max(36).optional(),
});

export const activitySchema = z.object({
  type: z.enum(["call", "email", "meeting", "note", "task"]),
  title: z.string().min(1, "Activity title is required").max(300),
  description: z.string().max(2000).optional(),
  contactId: z.string().max(36).optional(),
  dealId: z.string().max(36).optional(),
  companyId: z.string().max(36).optional(),
});

export const noteSchema = z.object({
  content: z.string().min(1, "Note content is required").max(10000),
  contactId: z.string().max(36).optional(),
  dealId: z.string().max(36).optional(),
  companyId: z.string().max(36).optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(150),
  email: z.string().email("Invalid email address").max(254),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  // role intentionally not exposed — public registration always yields "agent"
  role: z.enum(["admin", "manager", "agent"]).default("agent"),
});

export const emailTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").max(200),
  subject: z.string().min(1, "Subject is required").max(500),
  body: z.string().min(1, "Body is required").max(50000),
  category: z.string().max(100).default("general"),
});
