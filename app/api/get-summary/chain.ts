import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const ReadmeSummarySchema = z.object({
  summary: z
    .string()
    .min(10, "Summary must be meaningful")
    .describe("A concise, developer-oriented summary of this code repository."),
  facts: z
    .array(z.string().min(5))
    .min(3, "At least three facts required, if present in the README.")
    .max(10, "No more than ten facts.")
    .describe("List of key factual bullet points, each about this project/repository."),
});

type ReadmeSummaryType = z.infer<typeof ReadmeSummarySchema>;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const STRICT_SYSTEM_PROMPT = `
You are an expert developer documentation summarizer.
Summarize the following GitHub repository README for developers as required below.
Your response MUST be a valid, minified JSON object exactly matching this TypeScript type:
  { summary: string; facts: string[] }
Where:
- summary: required, is a concise and helpful README summary.
- facts: required, array of 3-10 important factual bullet points (features, tech stack, usage, limitations, etc).
If facts are not present in the README, extract only what is strictly factual.
DO NOT include any text before or after the JSON.
DO NOT add explanations or prose.
`;

export const getStrictReadmeSummary = async ({
  readme,
  openAIApiKey,
}: {
  readme: string;
  openAIApiKey: string;
}): Promise<ReadmeSummaryType> => {
  const model = new ChatOpenAI({
    apiKey: openAIApiKey,
    modelName: "gpt-3.5-turbo",
    temperature: 0,
    maxTokens: 700,
  }).withStructuredOutput(ReadmeSummarySchema, { strict: true });

  const messages = [
    { role: "system", content: STRICT_SYSTEM_PROMPT },
    {
      role: "user",
      content: `README:\n${readme}`,
    },
  ];

  const result = await model.invoke(messages);

  return ReadmeSummarySchema.parse(result);
};

