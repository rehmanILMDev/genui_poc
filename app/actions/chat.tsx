
import {
  streamUI,
  createStreamableValue,
  getMutableAIState,
  StreamableValue,
  createAI,
  getAIState,
} from "ai/rsc";
import { createOpenAI } from "@ai-sdk/openai";
import { ReactNode } from "react";
import { z } from "zod";
import { CoreMessage, generateId, streamObject, generateObject, generateText, streamText, tool } from "ai";
import { customAlphabet } from "nanoid";
import { AvatarIcon } from "@radix-ui/react-icons";
import { BudgetAnalysis } from "../components/flights";
import ExpensesChart from "../components/charts/expensesChart";
import SavingsProgressChart from "../components/charts/savingProgressChart";
import TaxEstimationChart from "../components/charts/taxEstimationChart";
import RetirementProjectionChart from "../components/charts/retirementProjectionChart";
import { mistral } from "@ai-sdk/mistral";
import EducationalContent from "../components/EducationalContent";
import { strict } from "assert";
import { UserMessage } from "../components/user-message";
// import { getModel } from '@/utils/aiModels';
import { createOllama } from 'ollama-ai-provider';

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
); // 7-character random string

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-[#f55036] text-primary-foreground shadow-sm">
        <AvatarIcon />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
          className="size-5 animate-spin stroke-zinc-400"
        >
          <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
        </svg>
      </div>
    </div>
  );
}

export function BotCard({
  children,
  showAvatar = true,
}: {
  children: React.ReactNode;
  showAvatar?: boolean;
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-[#f55036] text-primary-foreground shadow-sm invisible">
        <AvatarIcon />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  );
}

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: "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",
});

const ollama = createOllama({
    baseURL: 'http://localhost:11434/api',

});


export function BotMessage({
  content,
  className,
}: {
  content: string | StreamableValue<string>;
  className?: string;
}) {

  console.log("conteent", content);

  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-[#f55036] text-primary-foreground shadow-sm">
        <AvatarIcon />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        {content.toString()}
      </div>
    </div>
  );
}

export type Message = CoreMessage & {
  id: string;
};

export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

interface MutableAIState {
  update: (newState: any) => void;
  done: (newState: any) => void;
  get: () => AIState;
}


// async function generateFinancialCaption(
//   featureName: string,
//   userInput: any,
//   toolName: string,
//   aiState: MutableAIState
// ): Promise<string> {
//   aiState.update({
//     ...aiState.get(),
//     messages: [...aiState.get().messages]
//   });

//   let userInputString: string;

//   if (typeof userInput === 'string') {
//     userInputString = userInput;
//   } else if (typeof userInput === 'object') {
//     switch (toolName) {
//       case 'expenseAnalysisAgent':
//         const categories = userInput.map((item: any) => item.category).join(', ');
//         userInputString = `spending data across categories: ${categories}.`;
//         break;

//       case 'savingsGoalAgent':
//         userInputString = `goal amount: $${userInput.goalAmount}, current savings: $${userInput.currentSavings}, monthly contribution: $${userInput.monthlyContribution}.`;
//         break;

//       case 'taxPlanningAgent':
//         userInputString = `income: $${userInput.income}, deductions: $${userInput.deductions}, filing status: ${userInput.filingStatus}.`;
//         break;

//       case 'retirementPlanningAgent':
//         userInputString = `current age: ${userInput.currentAge}, retirement age: ${userInput.retirementAge}, current savings: $${userInput.currentSavings}, monthly contribution: $${userInput.monthlyContribution}.`;
//         break;

//       case 'financialEducationAgent':
//         userInputString = `topic: ${userInput.topic}.`;
//         break;

//       default:
//         // Fallback for unknown tools
//         userInputString = JSON.stringify(userInput);
//     }
//   } else {
//     userInputString = String(userInput);
//   }

//   const featureSystemMessage = `
// You are a financial advisory assistant. You provide users with information and suggestions based on various financial tools and data.

// These are the tools you have available:
// 1. Expense Analysis Agent: Identifies spending patterns, suggests areas to cut costs, and compares spending to similar demographics.

// 2. Savings Goal Agent: Helps set realistic savings targets, tracks progress, and suggests adjustments to reach goals faster.

// 3. Tax Planning Agent: Estimates tax liability, suggests tax-saving strategies, and reminds users about tax-related deadlines.

// 4. Retirement Planning Agent: Projects future retirement needs, suggests retirement savings strategies, and adjusts plans based on changing circumstances.

// 5. Financial Education Agent: Provides personalized financial tips and articles, explains complex financial concepts in simple terms, and suggests relevant educational content based on the user's financial behavior.

// You have just utilized the \`${featureName}\` tool based on the user input: "\`${userInputString}\`". Now, generate a brief, 2-3 sentence caption to accompany the tool's output. Make sure the response is relevant, clear, and creative.

// ### Examples

// **Example 1:**

// User: How can I cut down my expenses?
// Assistant: { "tool_call": { "id": "pending", "type": "function", "function": { "name": "expenseAnalysisAgent" }, "parameters": { "spendingData": [ { "category": "Dining Out", "amount": 200 }, { "category": "Subscriptions", "amount": 50 } ] } } } 

// Assistant (you): Based on your spending patterns, there are a few areas where you could reduce costs, such as dining out and subscriptions. Would you like to see a comparison of your spending with others in your demographic?

// **Example 2:**

// User: What's my progress towards my savings goal?
// Assistant: { "tool_call": { "id": "pending", "type": "function", "function": { "name": "savingsGoalAgent" }, "parameters": { "goalAmount": 10000, "currentSavings": 3000, "monthlyContribution": 500 } } } 

// Assistant (you): You're on track to meet your savings goal, but a slight adjustment in your monthly contribution could help you reach it even faster. Would you like to update your savings plan?

// **Example 3:**

// User: How much do I need to save for retirement?
// Assistant: { "tool_call": { "id": "pending", "type": "function", "function": { "name": "retirementPlanningAgent" }, "parameters": { "currentAge": 35, "retirementAge": 65, "currentSavings": 20000, "monthlyContribution": 300 } } } 

// Assistant (you): To secure a comfortable retirement, you may need to increase your savings by 15%. This estimate is based on your current savings and projected future needs. Do you want to adjust your retirement plan?

// **Example 4:**

// User: Can you explain the basics of ETFs?
// Assistant: { "tool_call": { "id": "pending", "type": "function", "function": { "name": "financialEducationAgent" }, "parameters": { "topic": "ETFs" } } } 

// Assistant (you): ETFs, or Exchange-Traded Funds, are investment funds that are traded on stock exchanges, much like individual stocks. They offer diversification and typically have lower fees compared to mutual funds. Would you like to learn more about how to incorporate ETFs into your portfolio?

// ### Guidelines
// Respond in a manner similar to the examples above, ensuring your response is clear, creative, and relevant to the user's query. The response should be brief and concise (2-3 sentences).
// `;

//   try {
//     const response = await generateText({
//       model : groq('llama3-groq-70b-8192-tool-use-preview'),
//       messages: [
//         {
//           role: 'system',
//           content: featureSystemMessage
//         },
//         ...aiState.get().messages.map((message: any) => ({
//           role: message.role,
//           content: message.content,
//           name: message.name
//         }))
//       ]
//     });
//     console.log('AI Model Response:', response.text);

//     return response.text || '';
//   } catch (err) {
//     console.error('Error generating financial caption:', err);
//     return '';
//   }
// }


export interface ServerMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant";
  display: string;
}



// export async function taskManager(messages: CoreMessage[]) {
//   try {
//     const result = await generateObject({
//       model: groq('llama3-groq-70b-8192-tool-use-preview'),
//       system: `As an AI assistant for a financial advisory app, your role is to analyze user queries and provide appropriate responses or request additional information when necessary. The app offers five core features, each requiring specific data inputs:

// 1. Expense Analysis:
//    - Required data: Expenses data is in format that category type with their amount.

// 2. Savings Goal Planning:
//    - Required data: Goal amount, current savings, and monthly contribution

// 3. Tax Planning:
//    - Required data: Annual income, deductions, and filing status

// 4. Retirement Planning:
//    - Required data: Current age, retirement age, current savings, and monthly contribution

// 5. Financial Education:
//    - Required data: Specific financial topic or concept of interest

// For each user query, you must choose one of two actions:

// 1. "proceed": Select this option if the user's query is complete, relevant to one of the app's features, and contains all required data for that feature. Provide a response based on the available information.

// 2. "inquire": Choose this option if:
//    a) The query is incomplete or missing required data for the relevant feature.
//    b) The query is ambiguous and could relate to multiple features.
//    c) The query is partially related to the app's features but needs more context.

// When selecting "inquire", ask specific questions to gather the missing required data for the relevant feature(s).

// If the user's query is entirely unrelated to the app's financial advisory features, inform them that the topic is outside the app's scope and redirect them to the available features listed above.

// Analyze each query carefully to determine the most appropriate course of action, ensuring that you provide valuable and relevant assistance within the app's defined feature set and data requirements.`,
//       messages,
//       schema: z.object({
//         next: z.enum(['inquire', 'proceed'])
//       })
//     })

//     return result
//   } catch (error) {
//     console.error(error)
//     return null
//   }
// }
const schemas = {
  expenseAnalysis: z.object({
    expenses: z.array(
      z.object({
        category: z.string(),
        amount: z.number().min(0, 'Amount must be a positive number'),
      })
    ),
  }),
  savingsGoal: z.object({
    goalAmount: z.number().min(1, 'Goal amount must be greater than 0'),
    currentSavings: z.number().min(0, 'Current savings cannot be negative'),
    monthlyContribution: z.number().min(0, 'Monthly contribution cannot be negative'),
  }),
  taxPlanning: z.object({
    annualIncome: z.number().min(0, 'Annual income cannot be negative'),
    deductions: z.number().min(0, 'Deductions cannot be negative'),
    filingStatus: z.enum(['single', 'married', 'head_of_household']),
  }),
  retirementPlanning: z.object({
    currentAge: z.number().min(0, 'Current age cannot be negative').max(150, 'Age must be realistic'),
    retirementAge: z.number().min(0, 'Retirement age cannot be negative').max(150, 'Age must be realistic'),
    currentSavings: z.number().min(0, 'Current savings cannot be negative'),
    monthlyContribution: z.number().min(0, 'Monthly contribution cannot be negative'),
  }).refine((data) => data.currentAge < data.retirementAge, {
    message: 'Retirement age must be greater than current age',
    path: ['retirementAge'],
  }),
  financialEducation: z.object({
    topic: z.string(),
  }),
};




// General function to analyze user's input and route to the appropriate feature
export async function handleUserQuery(userMessage: string, messages: any) {
  try {
    // Use a general-purpose LLM to determine which feature the user query is related to
    const featureDetection = await generateObject({
      model: groq('llama-3.1-8b-instant'),
      system: `
        You are a system that analyzes user input and determines which financial feature the query is related to. 
        You can choose from the following features: 
        1. "expenseAnalysis" 
        2. "savingsGoal" 
        3. "taxPlanning" 
        4. "retirementPlanning" 
        5. "financialEducation".
      Your response should include the feature name. 
    If user query is not related to app features then response according to your intelligence.
      `,
      messages: [...messages, { role: 'user', content: userMessage }],
      schema: z.object({
        feature: z.enum([
          'expenseAnalysis',
          'savingsGoal',
          'taxPlanning',
          'retirementPlanning',
          'financialEducation',
        ]),
      }),
    });

    const detectedFeature = featureDetection.object.feature;

    // Once the feature is detected, validate and process the data accordingly
    const action = await handleFeatureAction(detectedFeature, userMessage, messages);
    
    return action;
  } catch (error) {
    console.error('Error in handleUserQuery:', error);
    return { error: error.message };
  }
}

// // Action to handle any feature request
export async function handleFeatureAction(
  feature: string,
  userMessage: string,
  messages: any,
  skip: boolean = false
) {
  try {
    // Validate the input schema according to the detected feature
    const schema = schemas[feature];
    if (!schema) throw new Error('Invalid feature detected');

    const validatedData = await generateObject({
      model: groq('llama-3.1-70b-versatile'),
      system: `You are an assistant that validates data for the ${feature} feature. Parse the user's message into the appropriate schema. If the user does not provide appropriate data according to the feature, ask them for the required data and also validate the data according to your intelligence to ensure it is correct.`,
      messages: [...messages, { role: 'user', content: userMessage }],
      schema,
    });

    // Implement caption analysis logic here
    const captionAnalysis = await generateObject({
      model: groq('llama-3.1-70b-versatile'),
      system: `You are an assistant that generates captions based on the ${feature} feature and the validated data provided. Create a brief caption that summarizes the analysis. Use all amounts in Indian Rupees only.`,
      messages: [...messages, { role: 'assistant', content: JSON.stringify(validatedData.object) }],
      schema: z.object({
        caption: z.string(),
      }),
    });

    // Proceed or inquire further based on the validated data
    let action = { object: { next: 'proceed' } };

    if (!skip) {
      action = await generateObject({
        model: groq('llama-3.1-70b-versatile'),
        system: `Proceed with the analysis for the ${feature} feature.`,
        messages: [
          ...messages,
          { role: 'user', content: JSON.stringify(validatedData.object) },
        ],
        schema: z.object({
          next: z.enum(['inquire', 'proceed']),
        }),
      });
    }

    // Handle inquiry if necessary
    if (action.object.next === 'inquire') {
      const inquiry = await streamObject({
        model: groq('llama-3.1-70b-versatile'),
        system: `Generate an inquiry for the ${feature} feature.`,
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

      const resolvedInquiry = await inquiry.objectPromise;

      return {
        type: 'inquiry',
        inquiry: resolvedInquiry,
      };
    }

    return {
      type: 'proceed',
      resul: feature,
      data: validatedData.object,
      caption: captionAnalysis.object.caption,
    };
  } catch (error) {
    console.error('Error in handleFeatureAction:', error);
    return { error: error.message };
  }
}


// this is fine working 
// General function to analyze user's input and route to the appropriate feature
// export async function handleUserQuery(userMessage: string, messages: any) {
//   try {
//     // Use a general-purpose LLM to determine which feature the user query is related to
//     const featureDetection = await generateObject({
//       model:  groq('llama-3.1-8b-instant'),
//       system: `
//         You are a system that analyzes user input and determines which financial feature the query is related to. 
//         You can choose from the following features: 
//         1. "expenseAnalysis" 
//         2. "savingsGoal" 
//         3. "taxPlanning" 
//         4. "retirementPlanning" 
//         5. "financialEducation".
//         Your response should include the feature name. 
//         If user query is not related to app features then response according to your intelligence.
//       `,
//       messages: [...messages, { role: 'user', content: userMessage }],
//       schema: z.object({
//         feature: z.enum([
//           'expenseAnalysis',
//           'savingsGoal',
//           'taxPlanning',
//           'retirementPlanning',
//           'financialEducation',
//         ]),
//       }),
//     });

//     const detectedFeature = featureDetection.object.feature;

//     // Once the feature is detected, validate and process the data accordingly
//     const action = await handleFeatureAction(detectedFeature, userMessage, messages);
    
//     return action;
//   } catch (error) {
//     console.error('Error in handleUserQuery:', error);
//     return { error: error.message };
//   }
// }

// Action to handle any feature request
// export async function handleFeatureAction(feature: string, userMessage: string, messages: any, skip: boolean = false) {
//   try {
//     // Validate the input schema according to the detected feature
//     const schema = schemas[feature];
//     if (!schema) throw new Error('Invalid feature detected');

//     const validatedData = await generateObject({
//       model:  groq('llama-3.1-70b-versatile'),
//       system: `You are an assistant that validates data for the ${feature} feature. Parse the user's message into the appropriate schema. if user not give appropriate data according to feature then ask them data required and also validate data according to your intelligence that data is correct or not.`,
//       messages: [...messages, { role: 'user', content: userMessage }],
//       schema,
//     });

//     // Proceed or inquire further based on the validated data
//     let action = { object: { next: 'proceed' } };



//     if (!skip) {
//       action = await generateObject({
//         model:  groq('llama-3.1-70b-versatile'),
//         system: `Proceed with the analysis for the ${feature} feature.`,
//         messages: [
//           ...messages,
//           { role: 'user', content: JSON.stringify(validatedData.object) },
//         ],
//         schema: z.object({
//           next: z.enum(['inquire', 'proceed']),
//         }),
//       });
//     }

//     // Handle inquiry if necessary
//     if (action.object.next === 'inquire') {
//       const inquiry = await streamObject({
//         model:  groq('llama-3.1-70b-versatile'),
//         system: `Generate an inquiry for the ${feature} feature.`,
//         messages,
//         schema: z.object({
//           question: z.string(),
//           options: z.array(
//             z.object({
//               value: z.string(),
//               label: z.string(),
//             })
//           ),
//           allowsInput: z.boolean(),
//           inputLabel: z.string().optional(),
//           inputPlaceholder: z.string().optional(),
//         }),
//       });

//       const resolvedInquiry = await inquiry.objectPromise;

//       return {
//         type: 'inquiry',
//         inquiry: resolvedInquiry,
//       };
//     }

//     return {
//       type: 'proceed',
//       result: `Proceeding with the ${feature} analysis...`,
//       data: validatedData.object || validatedData,
//     };
//   } catch (error) {
//     console.error('Error in handleFeatureAction:', error);
//     return { error: error.message };
//   }
// }

// this is working 
// Action to handle any feature request
// export async function handleFeatureAction(feature: string, data: any, messages: any, skip: boolean = false) {
//   try {
//     // Validate data against the appropriate schema
//     if (!schemas[feature]) {
//       throw new Error('Invalid feature');
//     }
//     const validatedData = schemas[feature].parse(data);

//     // Select the correct model for the feature
//     const model = groq('llama-3.1-70b-versatile');
//     // Default action is to proceed
//     let action = { object: { next: 'proceed' } };

//     // If not skipping, determine the next step using the AI model
//     if (!skip) {
//       action = await generateObject({
//         model,
//         system: `Your task is to analyze and make a decision for ${feature}. Proceed with the data provided.`,
//         messages: [
//           ...messages,
//           { role: 'user', content: JSON.stringify(validatedData) },
//         ],
//         schema: z.object({
//           next: z.enum(['inquire', 'proceed']),
//         }),
//       });
//     }

//     // If AI suggests making an inquiry
//     if (action.object.next === 'inquire') {
//       const inquiry = await streamObject({
//         model,
//         system: `Your task is to create an inquiry to gather more specific details for ${feature}.`,
//         messages,
//         schema: z.object({
//           question: z.string(),
//           options: z.array(
//             z.object({
//               value: z.string(),
//               label: z.string(),
//             })
//           ),
//           allowsInput: z.boolean(),
//           inputLabel: z.string().optional(),
//           inputPlaceholder: z.string().optional(),
//         }),
//       });

//       const resolvedInquiry = await inquiry.objectPromise; // Wait for the promise to resolve

//       return {
//         type: 'inquiry',
//         inquiry: resolvedInquiry, // Return the resolved inquiry
//       };
//     }

//     // If AI suggests proceeding
//     return {
//       type: 'proceed',
//       result: `Proceeding with the ${feature} analysis...`,
//       data: validatedData,
//     };
//   } catch (error) {
//     console.error('Error in handleFeatureAction:', error);
//     return { error: error.message };
//   }
// }

// export async function submitUserMessage(input: string): Promise<ClientMessage> {
//   "use server";

//   const aiState = getMutableAIState();
//   let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
//   let textNode: undefined | React.ReactNode;





//   const currentState = aiState.get();
//   const messages = currentState?.messages ?? [];

































//   // aiState.update({
//   //   ...currentState,
//   //   messages: [
//   //     ...messages,
//   //     {
//   //       id: nanoid(),
//   //       role: 'user',
//   //       content: input,
//   //     }
//   //   ]
//   // });
// //   const result = await streamText({
// //     model: groq('llama3-groq-70b-8192-tool-use-preview'),
    
// //     system: `As an AI assistant for a financial advisory app, your role is to analyze user queries and provide appropriate responses or request additional information when necessary. The app offers five core features, each requiring specific data inputs:

// // 1. Expense Analysis:
// //  - Required data: Expenses data is in format that category type with their amount.

// // 2. Savings Goal Planning:
// //  - Required data: Goal amount, current savings, and monthly contribution

// // 3. Tax Planning:
// //  - Required data: Annual income, deductions, and filing status

// // 4. Retirement Planning:
// //  - Required data: Current age, retirement age, current savings, and monthly contribution

// // 5. Financial Education:
// //  - Required data: Specific financial topic or concept of interest

// // For each user query, you must choose one of two actions:

// // 1. "proceed": Select this option if the user's query is complete, relevant to one of the app's features, and contains all required data for that feature. Provide a response based on the available information.

// // 2. "inquire": Choose this option if:
// //  a) The query is incomplete or missing required data for the relevant feature.
// //  b) The query is ambiguous and could relate to multiple features.
// //  c) The query is partially related to the app's features but needs more context.

// // When selecting "inquire", ask specific questions to gather the missing required data for the relevant feature(s).

// // If the user's query is entirely unrelated to the app's financial advisory features, inform them that the topic is outside the app's scope and redirect them to the available features listed above.

// // Analyze each query carefully to determine the most appropriate course of action, ensuring that you provide valuable and relevant assistance within the app's defined feature set and data requirements.`,
 
// //     messages: messages,
// //   })
 

// //   console.log(JSON.stringify(result, null, 2));


//   // const result = await taskManager(messages);
//   // console.log(result);

//   // const result = await streamUI({
//   //   model : groq('llama3-groq-70b-8192-tool-use-preview'),
//   //   initial: <SpinnerMessage />,
//   //   maxRetries: 1,
//   //   system: `\
//   // You are a financial advisory conversation bot. You can provide the user with information and advice on various financial topics, including expense analysis, savings goals, tax planning, retirement planning, and financial education. You should only provide information by calling functions that match the user's request.

//   // ### Guidelines:

//   // Never provide empty results to the user. Provide the relevant tool if it matches the user's request. if tool matches give response on parameters matches by user input not give response by your own decide parameter. all responses you give and consider currency in Rupees only. Otherwise, respond as the financial bot.
//   // Example:

//   // User: How can I save more money each month?
//   // Assistant (you): { "tool_call": { "id": "pending", "type": "function", "function": { "name": "savingsGoalAgent" }, "parameters": { "goalAmount": 10000, "currentSavings": 3000, "monthlyContribution": 500 } } }

//   // Example 2:

//   // User: What are some tax-saving strategies for my income level?
//   // Assistant (you): { "tool_call": { "id": "pending", "type": "function", "function": { "name": "taxPlanningAgent" }, "parameters": { "income": 75000, "deductions": 10000, "filingStatus": "Single" } } }
//   //   `,
//   //   messages: [
//   //     ...messages.map((message: any) => ({
//   //       role: message.role,
//   //       content: message.content,
//   //       name: message.name
//   //     }))
//   //   ],
//   //   text: ({ content, done, delta }) => {
//   //     if (!textStream) {
//   //       textStream = createStreamableValue('');
//   //     }

//   //     if (done) {
//   //       textStream.done();
//   //       aiState.done({
//   //         ...aiState.get(),
//   //         messages: [
//   //           ...aiState.get().messages,
//   //           {
//   //             id: nanoid(),
//   //             role: 'assistant',
//   //             content
//   //           }
//   //         ]
//   //       });
//   //     } else {
//   //       textStream.update(delta);
//   //     }

//   //     return content;
//   //   },
//   //   tools: {
//   //     expenseAnalysisAgent: {
//   //       description: 'Analyze user expenses to identify spending patterns, suggest areas to cut costs, and compare spending to similar demographics.',
//   //       parameters: z.object({
//   //         spendingData: z.array(z.object({
//   //           category: z.string(),
//   //           amount: z.number(),
//   //         })).describe('List of spending data categorized by type and amount.')
//   //       }),
//   //       generate: async function* ({ spendingData }) {
//   //         yield (
//   //           <BotCard>
//   //             <></>
//   //           </BotCard>
//   //         );

//   //         const toolCallId = nanoid();

//   //         aiState.done({
//   //           ...aiState.get(),
//   //           messages: [
//   //             ...aiState.get().messages,
//   //             {
//   //               id: nanoid(),
//   //               role: 'assistant',
//   //               content: [
//   //                 {
//   //                   type: 'tool-call',
//   //                   toolName: 'expenseAnalysisAgent',
//   //                   toolCallId,
//   //                   args: { spendingData }
//   //                 }
//   //               ]
//   //             },
//   //             {
//   //               id: nanoid(),
//   //               role: 'tool',
//   //               content: [
//   //                 {
//   //                   type: 'tool-result',
//   //                   toolName: 'expenseAnalysisAgent',
//   //                   toolCallId,
//   //                   result: { spendingData }
//   //                 }
//   //               ]
//   //             }
//   //           ]
//   //         });

//   //         const caption = await generateFinancialCaption(
//   //           'Expense Analysis',
//   //           spendingData,
//   //           'expenseAnalysisAgent',
//   //           aiState
//   //         );
//   //         console.log("expenses data", spendingData);
//   //         console.log("caption", caption);

//   //         return (
//   //           <BotCard>
//   //             <ExpensesChart spendingData={spendingData} />
//   //             {caption}
//   //           </BotCard>
//   //         );
//   //       }
//   //     },
//   //     savingsGoalAgent: {
//   //       description:
//   //         'Assist the user in setting and tracking savings goals, and suggest adjustments to help reach goals faster.',
//   //       parameters: z.object({
//   //         goalAmount: z.number().describe('The savings goal amount.'),
//   //         currentSavings: z.number().describe('The current amount saved.'),
//   //         monthlyContribution: z.number().describe('The monthly contribution towards the savings goal.')
//   //       }),

//   //       generate: async function* ({ goalAmount, currentSavings, monthlyContribution }) {
//   //         yield (
//   //           <BotCard>
//   //             <></>
//   //           </BotCard>
//   //         )

//   //         const toolCallId = nanoid()

//   //         aiState.done({
//   //           ...aiState.get(),
//   //           messages: [
//   //             ...aiState.get().messages,
//   //             {
//   //               id: nanoid(),
//   //               role: 'assistant',
//   //               content: [
//   //                 {
//   //                   type: 'tool-call',
//   //                   toolName: 'savingsGoalAgent',
//   //                   toolCallId,
//   //                   args: { goalAmount, currentSavings, monthlyContribution }
//   //                 }
//   //               ]
//   //             },
//   //             {
//   //               id: nanoid(),
//   //               role: 'tool',
//   //               content: [
//   //                 {
//   //                   type: 'tool-result',
//   //                   toolName: 'savingsGoalAgent',
//   //                   toolCallId,
//   //                   result: { goalAmount, currentSavings, monthlyContribution }
//   //                 }
//   //               ]
//   //             }
//   //           ]
//   //         })

//   //         const caption = await generateFinancialCaption(
//   //           'Savings Goal',
//   //           [{ goalAmount, currentSavings, monthlyContribution }],
//   //           'savingsGoalAgent',
//   //           aiState
//   //         )
//   //         console.log("currewnt savings");

//   //         console.log(goalAmount);
//   //         console.log(currentSavings);
//   //         console.log(monthlyContribution);

//   //         return (
//   //           <BotCard>
//   //             <SavingsProgressChart 
//   //               goalAmount={goalAmount} 
//   //               currentSavings={currentSavings} 
//   //               monthlyContribution={monthlyContribution} 
//   //             />
//   //             <ExpensesChart/>
//   //             {caption}
//   //           </BotCard>
//   //         )
//   //       }
//   //     },

//   //     taxPlanningAgent: {
//   //       description:
//   //         'Estimate tax liability, suggest tax-saving strategies, and remind users about tax-related deadlines.',
//   //       parameters: z.object({
//   //         income: z.number().describe('The user\'s annual income.'),
//   //         deductions: z.number().default(0).describe('The total deductions the user is claiming.'),
//   //         filingStatus: z.enum(['Single', 'Married', 'HeadOfHousehold']).describe('The user\'s filing status.')
//   //       }),

//   //       generate: async function* ({ income, deductions, filingStatus }) {
//   //         yield (
//   //           <BotCard>
//   //             <></>
//   //           </BotCard>
//   //         )

//   //         const toolCallId = nanoid()

//   //         aiState.done({
//   //           ...aiState.get(),
//   //           messages: [
//   //             ...aiState.get().messages,
//   //             {
//   //               id: nanoid(),
//   //               role: 'assistant',
//   //               content: [
//   //                 {
//   //                   type: 'tool-call',
//   //                   toolName: 'taxPlanningAgent',
//   //                   toolCallId,
//   //                   args: { income, deductions, filingStatus }
//   //                 }
//   //               ]
//   //             },
//   //             {
//   //               id: nanoid(),
//   //               role: 'tool',
//   //               content: [
//   //                 {
//   //                   type: 'tool-result',
//   //                   toolName: 'taxPlanningAgent',
//   //                   toolCallId,
//   //                   result: { income, deductions, filingStatus }
//   //                 }
//   //               ]
//   //             }
//   //           ]
//   //         })

//   //         const caption = await generateFinancialCaption(
//   //           'Tax Planning',
//   //           [{ income, deductions, filingStatus }],
//   //           'taxPlanningAgent',
//   //           aiState
//   //         )
//   //         console.log("tax estimation ");

//   //         console.log(income);
//   //         console.log(deductions);
//   //         console.log(filingStatus);

//   //         return (
//   //           <BotCard>
//   //             <TaxEstimationChart 
//   //               income={income} 
//   //               deductions={deductions} 
//   //               filingStatus={filingStatus} 
//   //             />
//   //             {caption}
//   //           </BotCard>
//   //         )
//   //       }
//   //     },

//   //     retirementPlanningAgent: {
//   //       description:
//   //         'Project future retirement needs, suggest retirement savings strategies, and adjust plans based on changing circumstances.',
//   //       parameters: z.object({
//   //         currentAge: z.number().describe('The user\'s current age.'),
//   //         retirementAge: z.number().describe('The age at which the user plans to retire.'),
//   //         currentSavings: z.number().describe('The amount the user has currently saved for retirement.'),
//   //         monthlyContribution: z.number().describe('The monthly contribution towards retirement savings.')
//   //       }),

//   //       generate: async function* ({ currentAge, retirementAge, currentSavings, monthlyContribution }) {
//   //         yield (
//   //           <BotCard>
//   //             <></>
//   //           </BotCard>
//   //         )

//   //         const toolCallId = nanoid()

//   //         aiState.done({
//   //           ...aiState.get(),
//   //           messages: [
//   //             ...aiState.get().messages,
//   //             {
//   //               id: nanoid(),
//   //               role: 'assistant',
//   //               content: [
//   //                 {
//   //                   type: 'tool-call',
//   //                   toolName: 'retirementPlanningAgent',
//   //                   toolCallId,
//   //                   args: { currentAge, retirementAge, currentSavings, monthlyContribution }
//   //                 }
//   //               ]
//   //             },
//   //             {
//   //               id: nanoid(),
//   //               role: 'tool',
//   //               content: [
//   //                 {
//   //                   type: 'tool-result',
//   //                   toolName: 'retirementPlanningAgent',
//   //                   toolCallId,
//   //                   result: { currentAge, retirementAge, currentSavings, monthlyContribution }
//   //                 }
//   //               ]
//   //             }
//   //           ]
//   //         })

//   //         const caption = await generateFinancialCaption(
//   //           'Retirement Planning',
//   //           [{ currentAge, retirementAge, currentSavings, monthlyContribution }],
//   //           'retirementPlanningAgent',
//   //           aiState
//   //         )
//   //         console.log("retirement projection");

//   //         console.log(currentAge);

//   //         console.log(retirementAge);
//   //         console.log(currentSavings);
//   //         console.log(monthlyContribution);

//   //         return (
//   //           <BotCard>
//   //             <RetirementProjectionChart 
//   //               currentAge={currentAge} 
//   //               retirementAge={retirementAge} 
//   //               currentSavings={currentSavings} 
//   //               monthlyContribution={monthlyContribution} 
//   //             />
//   //             {caption}
//   //           </BotCard>
//   //         )
//   //       }
//   //     },

//   //     financialEducationAgent: {
//   //       description:
//   //         'Provide personalized financial tips and articles, explain complex financial concepts in simple terms, and suggest relevant educational content based on the user\'s financial behavior.',
//   //       parameters: z.object({
//   //         topic: z.string().describe('The financial topic or concept the user is interested in.')
//   //       }),

//   //       generate: async function* ({ topic }) {
//   //         yield (
//   //           <BotCard>
//   //             <></>
//   //           </BotCard>
//   //         )

//   //         const toolCallId = nanoid()

//   //         aiState.done({
//   //           ...aiState.get(),
//   //           messages: [
//   //             ...aiState.get().messages,
//   //             {
//   //               id: nanoid(),
//   //               role: 'assistant',
//   //               content: [
//   //                 {
//   //                   type: 'tool-call',
//   //                   toolName: 'financialEducationAgent',
//   //                   toolCallId,
//   //                   args: { topic }
//   //                 }
//   //               ]
//   //             },
//   //             {
//   //               id: nanoid(),
//   //               role: 'tool',
//   //               content: [
//   //                 {
//   //                   type: 'tool-result',
//   //                   toolName: 'financialEducationAgent',
//   //                   toolCallId,
//   //                   result: { topic }
//   //                 }
//   //               ]
//   //             }
//   //           ]
//   //         })

//   //         const caption = await generateFinancialCaption(
//   //           'Financial Education',
//   //           [{ topic }],
//   //           'financialEducationAgent',
//   //           aiState
//   //         )
//   //         console.log("topicc");

//   //         console.log(topic);

//   //         return (
//   //           <BotCard>
//   //             <EducationalContent topic={topic} />
//   //             {caption}
//   //           </BotCard>
//   //         )
//   //       }
//   //     },
//   //   }
//   // });

//   // return {
//   //   id: generateId(),
//   //   role: "assistant",
//   //   display: result,
//   // };


// }


// export const AI = createAI<AIState, UIState>({
//   actions: {
//     handleFeatureAction
//   },
//   initialUIState: [],
//   initialAIState: { chatId: nanoid(), messages: [] }
// })






