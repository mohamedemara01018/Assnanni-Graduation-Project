# TODO - Chit-chat triage (question-by-question)

- [x] Refactor `src/components/chatbot/DentalTriage.tsx` to expose a question-by-question triage engine (no multi-step form UI).
- [ ] Update `src/components/chatbot/ChatbotWidget.tsx` to run the triage inside chat messages: append bot question + render user answer options, advance step-by-step.

- [ ] Connect triage completion to existing `handleSymptomAnalysis` backend call.
- [ ] Verify TypeScript types compile.
- [ ] Run the app and manually test the chat triage flow end-to-end.
