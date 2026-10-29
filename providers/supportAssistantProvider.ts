import type { ApiProvider, ProviderResponse } from 'promptfoo';
import { askSupportAssistant } from '../src/supportAssistant';

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
      };
    } catch (error) {
      return { error: `Support assistant failed: ${String(error)}` };
    }
  }
}
