import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const MODEL = 'claude-haiku-5-5';
// The model may reason before it answers, and those tokens count too.
const MAX_TOKENS = 1024;

export const SUPPORT_EMAIL = 'support@juice-sh.op';
export const OFF_TOPIC_REPLY = 'I can only help with questions about Juice Shop.';
export const UNKNOWN_REPLY = "I don't have that information.";

// The policies live in their own file, so the evals can show the same text to the judge.
// The path is relative to the project root, where the app and the evals are started.
export const POLICIES = readFileSync(join(process.cwd(), 'src', 'policies.md'), 'utf8').trim();

export const SYSTEM_PROMPT = `You are the customer support assistant for OWASP Juice Shop, an online shop that sells juices and fan merchandise.

Shop policies:
${POLICIES}

Rules:
- Answer only questions about the shop, orders, delivery, payment and returns.
- If the question is not about the shop, reply exactly: "${OFF_TOPIC_REPLY}"
- If the question is about the shop but the answer is not in the policies, start your reply with "${UNKNOWN_REPLY}" and point the customer to ${SUPPORT_EMAIL}. Never invent policies.
- Mention the support email only in two cases: the customer asks how to contact support, or you don't have the information. In all other answers, do not mention it.
- Answer only what the customer asked. Do not add information about other policies they did not ask about.
- Say each fact only once. Do not repeat the same information in other words.
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

  // Never return a broken answer to the customer.
  if (response.stop_reason === 'max_tokens') {
    throw new Error(`The answer was cut off: the ${MAX_TOKENS} token limit was reached`);
  }

  let text = '';
  for (const block of response.content) {
    if (block.type === 'text') {
      text += block.text;
    }
  }

  if (text.trim() === '') {
    throw new Error(`The answer is empty (stop reason: ${response.stop_reason})`);
  }

  return {
    text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}
