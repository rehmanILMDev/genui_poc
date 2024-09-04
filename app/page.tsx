"use client";

import { ReactNode, useRef, useState } from "react";
import { useActions, useUIState } from "ai/rsc";
import { generateId } from "ai";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import Header from "./components/header";
import ExpensesChart from "./components/charts/expensesChart";
import SavingsProgressChart from "./components/charts/savingProgressChart";
import TaxEstimationChart from "./components/charts/taxEstimationChart";
import RetirementProjectionChart from "./components/charts/retirementProjectionChart";
import { nanoid } from "nanoid";
import Textarea from "react-textarea-autosize";
import { handleUserQuery } from "../app/actions/chat";
import EducationalContent from "./components/EducationalContent";

export const maxDuration = 60;

export default function Home() {
  const [input, setInput] = useState<string>("");
  // const [conversation, setConversation] = useUIState<typeof AI>();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [component, setComponent] = useState<ReactNode>();
  const [caption, setCaption] = useState<string>();

  const handleUserInput = async () => {
    setLoading(true);

    const messages = []; // Any previous messages in the conversation

    const result = await handleUserQuery(input, messages);
    const { resul, caption, data } = result;

    switch (resul) {
      case "expenseAnalysis":
        setComponent(<ExpensesChart spendingData={data} />);
        setCaption(caption);
        break;
      case "savingsGoal":
        setComponent(<SavingsProgressChart savingsGoalData={data} />);
        setCaption(caption);
        break;
      case "taxPlanning":
        setComponent(<TaxEstimationChart taxData={data} />);
        setCaption(caption);
        break;
      case "retirementPlanning":
        setComponent(<RetirementProjectionChart retirementData={data} />);
        setCaption(caption);
        break;
        case "financialEducation":
        setComponent(<EducationalContent content={data} />);
        setCaption(caption);
        break;
    }

    console.log(resul, caption, data);

    setResponse(result);
    setLoading(false);
  };

  // const {
  //   // messages,
  //   // input,
  //   // handleInputChange,
  //   // handleSubmit,
  //   isLoading,
  //   error,
  //   reload,
  //   stop,
  // } = useChat({
  //   maxToolRoundtrips: 2,
  // });

  // const handleSubmit = async () => {
  //   setInput("");
  //   setConversation((currentConversation: any) => [
  //     ...currentConversation,
  //     { id: generateId(), role: "user", display: input },
  //   ]);

  //   const message = await handleUserQuery("hii",input);
  //   setConversation((currentConversation: any) => [
  //     ...currentConversation,
  //     message,
  //   ]);
  // };


  
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <Header />

      <div className="space-y-4">
        {loading && <p>Loading...</p>}
        {component && component}
        {caption && caption}

        {/* {conversation.map((message: any) => (
          <div key={message.id}>
            <div className="font-bold">
              {message.role === "user" ? "Rehman: " : "AI: "}
              {message.display}
              {/* <ReactMarkdown></ReactMarkdown> 
            </div>
          </div>
        ))}

        {/* {isLoading && (
          <div>
            <div className="flex space-x-2 justify-center items-center dark:invert">
              <span className="sr-only">Loading...</span>
              <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
            </div>
            <button
              type="button"
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={() => stop()}
            >
              stop
            </button>
          </div>
        )}
        {error && (
          <>
            <div>An error occurred.</div>
            <button type="button" onClick={() => reload()}>
              Retry
            </button>
          </>
        )} */}
      </div>

      {/* <div
        className={`
                    cursor-pointer border bg-white p-4 
                    hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900
                 
                  `}
        onClick={async () => {
          setConversation((currentConversation: any) => [
            ...currentConversation,
            {
              id: generateId(),
              role: "user",
              display:
                "do expenses spending on rent amount 1000 rupees, on utility amount is 500 rupees, on food amount is 200 rupees and on travel amount is 400 rupees",
            },
          ]);

          const message = await submitUserMessage(input, "4000");
          setConversation((currentConversation: any) => [
            ...currentConversation,
            message,
          ]);
        }}
      >
        <div className="text-sm font-semibold">
          I want to know my expenses analysis.
        </div>
        <div className="text-sm text-zinc-600">expenses analysis</div>
      </div> */}
      <Textarea
        ref={inputRef}
        name="input"
        rows={1}
        maxRows={5}
        tabIndex={0}
        placeholder="Ask a question..."
        spellCheck={false}
        value={input}
        className="resize-none fixed text-black bottom-0 w-full max-w-md p-2 my-8 border border-gray-300 rounded shadow-xl w-full min-h-12 rounded-fill bg-muted border border-input pl-4 pr-10 pt-3 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'"
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onKeyDown={(e) => {
          // Enter should submit the form
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            // Prevent the default action to avoid adding a new line
            if (input.trim().length === 0) {
              e.preventDefault();
              return;
            }
            e.preventDefault();
            handleUserInput();
          }
        }}
        onHeightChange={(height) => {
          // Ensure inputRef.current is defined
          if (!inputRef.current) return;

          // The initial height and left padding is 70px and 2rem
          const initialHeight = 70;
          // The initial border radius is 32px
          const initialBorder = 32;
          // The height is incremented by multiples of 20px
          const multiple = (height - initialHeight) / 20;

          // Decrease the border radius by 4px for each 20px height increase
          const newBorder = initialBorder - 4 * multiple;
          // The lowest border radius will be 8px
          inputRef.current.style.borderRadius = Math.max(8, newBorder) + "px";
        }}
      />
      {/* <input
        className="fixed text-black bottom-0 w-full max-w-md p-2 my-8 border border-gray-300 rounded shadow-xl"
        value={input}
        placeholder="Say something..."
        onChange={handleChange}
        onKeyDownCapture={handleKeyDown}
      /> */}
    </div>
  );
}

// 'use client';

// import { useChat } from 'ai/react';
// import path from 'path';
// import { useState } from 'react';
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import MarkdownRenderer from './components/MarkdownRenderer';

// // Define the props for the MarkdownRenderer component
// interface MarkdownRendererProps {
//   markdown: string;
// }
// export default function Page() {
//   const { messages,input, handleInputChange, handleSubmit, isLoading, error, reload } = useChat(

//     {

//       keepLastMessageOnError: true,
//     });
//   // const [input, setInput] = useState<string>('');

//   // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   setInput(e.target.value);
//   // };

//   // const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
//   //   if (e?.key == "Enter" && input) {
//   //     handleSubmit();
//   //   }
//   // };

//   return (
//     <>
//       <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
//         <div className="space-y-4">
//           {messages.map((message: any) => (
//             <div key={message.id}>
//               <div className="font-normal bg-blue-500">
//                 {message.role === "user" ? "Rehman: " : "AI: "}
//                 <MarkdownRenderer markdown={message.content}/>

//               </div>

//             </div>
//           ))}

//           {isLoading && (
//             <div>
//               <div className="flex space-x-2 justify-center items-center dark:invert">
//                 <span className="sr-only">Loading...</span>
//                 <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
//                 <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
//                 <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
//               </div>
//               <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={() => stop()}>stop</button>

//             </div>
//           )}

//           {error && (
//             <>
//               <div>An error occurred.</div>
//               <button type="button" onClick={() => reload()}>
//                 Retry
//               </button>
//             </>
//           )}
//         </div>
//         <form onSubmit={handleSubmit}>
//           <input name="prompt" className="fixed text-black bottom-0 w-full max-w-md p-2 my-8 border border-gray-300 rounded shadow-xl"
//             value={input} onChange={handleInputChange} />
//           {/* <button type="submit">Submit</button> */}
//         </form>
//         {/* <input
//           className="fixed text-black bottom-0 w-full max-w-md p-2 my-8 border border-gray-300 rounded shadow-xl"
//           value={input}
//           placeholder="Say something..."
//           onChange={handleChange}
//           onKeyDownCapture={handleKeyDown}
//         /> */}

//       </div>

//     </>
//   );
// }

// export default function FinancialAdvisor() {
//   const [response, setResponse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [userMessage, setUserMessage] = useState('');

//   const handleUserInput = async () => {
//     setLoading(true);

//     const messages = []; // Any previous messages in the conversation

//     const result = await handleUserQuery(userMessage, messages);
//     setResponse(result);
//     setLoading(false);
//   };

//   return (

//     <div>
//       <textarea
//         value={userMessage}
//         onChange={(e) => setUserMessage(e.target.value)}
//         placeholder="Enter your query..."
//         className="text-black"
//       />
//       <button onClick={handleUserInput} disabled={loading}>
//         Submit
//       </button>
//       {loading && <p>Loading...</p>}
//       {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
//     </div>
//   );
// }
