# AI Testing & Evals

Testing and evaluating an LLM-powered customer support assistant for [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) with [Promptfoo](https://www.promptfoo.dev/).

> 🚧 Work in progress. The project grows step by step (see [Roadmap](#roadmap)).

## What is tested

The app under test is a small support assistant written in TypeScript and powered by Claude. It answers questions about Juice Shop orders, delivery, payment and returns.

The test dataset covers:

| Group | What is checked |
|---|---|
| Happy path | Return policy, delivery time and cost, payment methods, support contact |
| Edge cases | Typos, two questions in one message, a question in Montenegrin |
| Off-topic | Requests unrelated to the shop are politely refused |
| Unknown information | The assistant admits it doesn't know instead of inventing a policy |

Every test case also checks these metrics:

| Metric | What is checked |
|---|---|
| short-answer | The answer is at most 600 characters long |
| focused-answer | An LLM judge checks that the answer covers only what the customer asked |
| cost | One answer costs at most 0.0002 USD |
| latency | The answer arrives within 3 seconds |

## Project structure

```
├── src/          # The app under test: the support assistant
├── providers/    # Connects Promptfoo to the app
├── tests/        # Test dataset with assertions
└── promptfooconfig.yaml
```

## Getting started

```bash
npm ci
cp .env.example .env    # then add your Anthropic API key
npm run eval            # run the evals
npm run view            # open the results in the browser
```

## Roadmap

- [x] Promptfoo setup with deterministic checks
- [x] Assistant in TypeScript and a test dataset (happy path, edge cases, off-topic, unknown information)
- [x] LLM-as-a-judge and custom metrics (cost and latency)
- [ ] Hallucination and response quality checks
- [ ] RAG testing
- [ ] Agent and tool-calling testing
- [ ] Red teaming
- [ ] Evals in GitHub Actions CI
