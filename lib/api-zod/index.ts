import { z } from 'zod';

export const UsageResponseSchema = z.object({
  totalMinutes: z.number(),
  dailyLimit: z.number(),
  percentage: z.number(),
  mostUsedApp: z.string(),
  productivityScore: z.number(),
  apps: z.array(
    z.object({
      name: z.string(),
      minutes: z.number(),
      percentage: z.number(),
    })
  ),
});

export const FocusModeToggleSchema = z.object({
  enabled: z.boolean(),
});

export const FocusModeResponseSchema = z.object({
  enabled: z.boolean(),
  message: z.string(),
});

export const InsightsResponseSchema = z.object({
  mostDistractingHours: z.string(),
  screenTimeChange: z.string(),
  focusSuggestion: z.string(),
});

export type UsageResponse = z.infer<typeof UsageResponseSchema>;
export type FocusModeToggle = z.infer<typeof FocusModeToggleSchema>;
export type FocusModeResponse = z.infer<typeof FocusModeResponseSchema>;
export type InsightsResponse = z.infer<typeof InsightsResponseSchema>;
