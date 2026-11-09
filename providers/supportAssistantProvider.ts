import type { ApiProvider, ProviderResponse } from 'promptfoo';
import { askSupportAssistant, MODEL } from '../src/supportAssistant';

// Claude API prices in USD per 1 million tokens (prompts up to 100K tokens).
// Source: https://platform.claude.com/docs/en/about-claude/pricing
const PRICE_PER_MILLION_TOKENS: Record<string, { input: number; output: number }> = {
  'claude-haiku-5-5': { input: 0.1, output: 0.5 },
};

function calculateCost(inputTokens: number, outputTokens: number): number {
  const price = PRICE_PER_MILLION_TOKENS[MODEL];
  if (!price) {
    throw new Error(`No price defined for model ${MODEL}`);
  }
  return (inputTokens * price.input + outputTokens * price.output) / 1_000_000;
}

// Connects Promptfoo to the app: Promptfoo sends the test question,
// the provider calls the real app code and returns its answer.
export default class SupportAssistantProvider implements ApiProvider {
  id(): string {
    return 'support-assistant';
  }

  async callApi(prompt: string): Promise<ProviderResponse> {
    try {
      const reply = await askSupportAssistant(prompt);
      return {
        output: reply.text,
        tokenUsage: {
          prompt: reply.inputTokens,
          completion: reply.outputTokens,
          total: reply.inputTokens + reply.outputTokens,
        },
        cost: calculateCost(reply.inputTokens, reply.outputTokens),
      };
    } catch (error) {
      return { error: `Support assistant failed: ${String(error)}` };
    }
  }
}
