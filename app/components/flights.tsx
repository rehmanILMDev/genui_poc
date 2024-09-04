export async function BudgetAnalysis({ income, expenses }: any) {
    // const data = await fetch(`https://api.example.com/flight/${flightNumber}`);
  
    return (
      <div>
        <div>{income}</div>
        <div>{expenses}</div>
        <div>{"data.source"}</div>
        <div>{"data.destination"}</div>
      </div>
    );
  }