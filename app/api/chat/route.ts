


import { createAI, createStreamableValue, getMutableAIState, streamUI } from 'ai/rsc';
import { createOpenAI } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { ReactNode } from 'react';
import { z } from 'zod';

export async function POST(req: Request) {
    const { messages } = await req.json();
  // Allow streaming responses up to 30 seconds
   const maxDuration = 30;
  
    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY,
    });
  
    const result = await streamText({
      model: groq('llama-3.1-70b-versatile'),
      system: `You are a Budget Management Agent. User provide income and expenses then Analyze the user's income and expenses and provide a summary.
            Based on the following analysis, provide budget recommendations for the user.
`,
      messages: convertToCoreMessages(messages),
      temperature: 0
    });
  
    return result.toDataStreamResponse();
  }
