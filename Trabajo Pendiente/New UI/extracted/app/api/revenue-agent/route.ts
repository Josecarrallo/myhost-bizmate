import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `You are an AI assistant for MYHOST Bizmate PMS, specifically for Revenue & Pricing optimization.
    You help property managers with:
    - Revenue analysis and forecasting
    - Dynamic pricing strategies
    - Occupancy rate optimization
    - Financial reporting and insights
    - Competitive pricing analysis
    
    Provide data-driven recommendations with financial expertise and market insights.`,
    messages,
  })

  return result.toUIMessageStreamResponse()
}
