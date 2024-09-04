'use server';

import { createOpenAI } from '@ai-sdk/openai';
import { generateObject, streamObject } from 'ai';
import { z } from 'zod';

const schema = z.object({
  expenses: z.array(
    z.object({
      category: z.string(),
      amount: z.number(),
    })
  ),
});

const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: "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",
  });

export async function handleExpenseAnalysis(data: any, messages: any, skip: boolean = false) {
  // Validate data
  const validatedData = schema.parse(data);

  // Select the appropriate AI model
  const model = groq('llama-3.1-70b-versatile');

  // Default action
  let action = { object: { next: 'proceed' } };

  // Handle decision-making with AI model
  if (!skip) {
    action = await generateObject({
      model,
      system: `Your task is to analyze the expenses and provide insights.`,
      messages: [
        ...messages,
        { role: 'user', content: JSON.stringify(validatedData) },
      ],
      schema: z.object({
        next: z.enum(['inquire', 'proceed']),
      }),
    });
  }

  // If AI suggests making an inquiry
  if (action.object.next === 'inquire') {
    const inquiry = await streamObject({
      model,
      system: `Your task is to create an inquiry to gather more specific details for the expense analysis.`,
      messages,
      schema: z.object({
        question: z.string(),
        options: z.array(
          z.object({
            value: z.string(),
            label: z.string(),
          })
        ),
        allowsInput: z.boolean(),
        inputLabel: z.string().optional(),
        inputPlaceholder: z.string().optional(),
      }),
    });

    return {
      type: 'inquiry',
      inquiry,
    };
  }

  // Proceed with the provided data
  return {
    type: 'proceed',
    result: `Proceeding with expense analysis...`,
    data: validatedData,
  };
}
