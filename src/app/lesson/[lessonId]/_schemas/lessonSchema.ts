import { z } from "zod";

const splitLongLines = z
  .string()
  .trim()
  .transform((str) => {
    let transformedString = str;
    while (!transformedString.split("\n").every((line) => line.length <= 50)) {
      transformedString = transformedString
        .split("\n")
        .map((line) => {
          if (line.length <= 50) {
            return line;
          }
          const whitespaceIndex = line.lastIndexOf(" ", 50);
          if (whitespaceIndex === -1) {
            throw Error("Invalid lesson format");
          }
          return (
            line.slice(0, whitespaceIndex) +
            "\n" +
            line.slice(whitespaceIndex + 1)
          );
        })
        .join("\n");
    }
    return transformedString;
  });

const LessonPageSchema = z.union([
  z.object({
    text: splitLongLines.optional(),
    description: z.string().trim(),
  }),
  z.object({
    text: splitLongLines,
    description: z.string().trim().optional(),
  }),
]);

export const LessonSchema = z.object({
  pages: z.array(LessonPageSchema),
});

export type LessonPage = z.infer<typeof LessonPageSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
