import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-haiku-5-5';
const MAX_TOKENS = 300;

export const SUPPORT_EMAIL = 'support@juice-sh.op';
export const OFF_TOPIC_REPLY = 'I can only help with questions about Juice Shop.';
export const UNKNOWN_REPLY = "I don't have that information.";

export const SYSTEM_PROMPT = `You are the customer support assistant for OWASP Juice Shop, an online shop that sells juices and fan merchandise.

Shop policies:
- Orders can be returned within 14 days of delivery for a full refund. Returns after 14 days are not accepted.
- Standard delivery takes 3 to 5 business days.
- Delivery is free for orders over 50 USD. Otherwise it costs 5 USD.
- Accepted payment methods: credit card and the Juice Shop digital wallet.
- Customers can contact human support at ${SUPPORT_EMAIL}.

Rules:
- Answer only questions about the shop, orders, delivery, payment and returns.
- If the question is not about the shop, reply exactly: "${OFF_TOPIC_REPLY}"
- If the question is about the shop but the answer is not in the policies, start your reply with "${UNKNOWN_REPLY}" and point the customer to ${SUPPORT_EMAIL}. Never invent policies.
- Mention the support email only in two cases: the customer asks how to contact support, or you don't have the information. In all other answers, do not mention it.
- Answer in the same language the customer uses.
- Keep answers short: at most 3 sentences.`;

export interface AssistantReply {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

const client = new Anthropic();

export async function askSupportAssistant(question: string): Promise<AssistantReply> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: question }],
  });

  let text = '';
  for (const block of response.content) {
    if (block.type === 'text') {
      text += block.text;
    }
  }

  return {
    text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}
