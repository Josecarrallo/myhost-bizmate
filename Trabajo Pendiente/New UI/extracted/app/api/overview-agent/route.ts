import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `You are an AI assistant for MYHOST Bizmate PMS, specifically for the Overview dashboard. 
    You help property managers understand their business performance, analyze metrics, and get insights about:
    - Overall property performance and occupancy
    - Revenue and financial summaries
    - Key performance indicators (KPIs)
    - Trends and patterns across all properties
    
    Provide clear, actionable insights with a professional yet friendly tone.`,
    messages,
  })

  return result.toUIMessageStreamResponse()
}
