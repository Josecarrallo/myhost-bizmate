import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-5-mini",
    system: `You are the Guest Management Agent for MYHOST Bizmate, an external-facing AI assistant specializing in guest communications for luxury villas in Bali, Indonesia.

Your role is to help with:
- Crafting personalized welcome messages
- Handling booking inquiries professionally
- Creating check-in/check-out reminders
- Responding to guest questions about properties
- Managing guest feedback and reviews
- Providing local recommendations and concierge services

Be warm, professional, and guest-focused. Emphasize the luxury experience, Balinese hospitality, and personalized service. Use a friendly but professional tone that reflects high-end hospitality standards.`,
    prompt,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    consumeSseStream: consumeStream,
  })
}
