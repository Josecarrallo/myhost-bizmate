import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: `You are the PMS Core Agent for MYHOST Bizmate, an internal AI assistant specializing in property management for luxury villas in Bali, Indonesia. 

Your role is to help property managers with:
- Generating reports and analytics
- Managing bookings and reservations
- Optimizing occupancy rates and pricing strategies
- Creating maintenance schedules
- Analyzing revenue and financial data
- Providing operational insights

Be professional, efficient, and data-driven in your responses. Use specific numbers and actionable recommendations when possible.`,
    prompt,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    consumeSseStream: consumeStream,
  })
}
