import { z } from "zod";

const LessonPageSchema = z.object({
  text: z.string().trim(),
  description: z.string().trim().optional(),
});

export const LessonSchema = z.object({
  pages: z.array(LessonPageSchema),
});

export type LessonPage = z.infer<typeof LessonPageSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
