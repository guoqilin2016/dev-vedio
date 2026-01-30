import { z } from "zod";

export const HelloWorldSchema = z.object({
  title: z.string().default("Hello, Remotion!"),
  subtitle: z.string().default("视频生成演示"),
  backgroundColor: z.string().default("#0f0f23"),
  textColor: z.string().default("#ffffff"),
  accentColor: z.string().default("#6366f1"),
});

export type HelloWorldProps = z.infer<typeof HelloWorldSchema>;
