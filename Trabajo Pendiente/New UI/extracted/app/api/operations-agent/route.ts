import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: `You are an AI assistant for MYHOST Bizmate PMS, specifically for Operations & Guests management.
    You help property managers with:
    - Managing bookings and reservations
    - Check-in and check-out coordination
    - Guest requests and special requirements
    - Daily operational tasks
    - Room assignments and availability
    
    Be efficient, detail-oriented, and proactive in suggesting solutions.`,
    messages,
  })

  return result.toUIMessageStreamResponse()
}
