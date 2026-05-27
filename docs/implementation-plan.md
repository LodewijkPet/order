# Order Implementation Plan

## 1. High-Level Summary

Order is a Korean restaurant ordering game. The player reads a mostly Korean menu, chooses dishes that satisfy a scenario, then completes a short restaurant interaction in Korean. The core loop should teach natural restaurant Korean through practical decisions: what to order, how to ask, how polite to be, and how to handle follow-up situations.

The first implementation should be a focused single-player web app. It should use structured learning data and pure evaluation logic so menu items, challenges, cultural combinations, and dialogue scenarios can be expanded without rewriting UI components.

## 2. Core Learning Objectives

- Read common Korean menu items without relying on English translations.
- Recognize restaurant categories: main dishes, soups, rice, side dishes, banchan, drinks, alcohol, desserts, set menus, snacks.
- Choose correct food combinations based on constraints such as budget, group size, spiciness, diet, and alcohol.
- Learn cultural food combinations such as 치맥, 삼겹살 with 소주, and 파전 with 막걸리.
- Practice common ordering expressions in natural Korean.
- Distinguish polite informal -요 style from more formal -습니다 style.
- Notice when a phrase is grammatically correct but socially awkward.
- Complete realistic restaurant follow-up moments: thanking, requesting water, correcting missing items, asking for the bill, paying, and leaving.

## 3. Main Game Phases

1. Scenario setup: choose or receive a restaurant type, waiter profile, difficulty, and task.
2. Menu reading: inspect a Korean menu with optional hints depending on settings.
3. Dish selection: select items while tracking category, price, group size, and restrictions.
4. Selection feedback: show which constraints were satisfied, missed, or violated.
5. Dialogue interaction: choose appropriate Korean phrases for a short restaurant flow.
6. Results: summarize score, missed constraints, vocabulary, phrase notes, and possible retry.

## 4. MVP Version

The MVP should implement one polished loop:

- One restaurant type: casual Korean restaurant.
- One waiter profile: busy casual restaurant worker.
- At least 30 menu items with structured metadata.
- 6-8 menu selection challenges.
- Cultural combo validation for 치맥, 삼겹살 + 소주, and 파전 + 막걸리.
- Pure TypeScript selection evaluator with tests.
- Minimal React UI proving that menu data and validation work.
- Settings structure prepared, even if only some settings affect the MVP UI.
- No external art assets. Use CSS shapes and layout only.

The MVP should avoid accounts, backend persistence, typed Korean input, complex animation, procedural challenge generation, and audio.

## 5. Roadmap After MVP

1. Add the dialogue evaluator and one complete restaurant dialogue sequence.
2. Add restaurant type variants: barbecue restaurant, chicken place, cafe, fancy restaurant, and 분식 place.
3. Add a challenge generator that assembles tasks from reusable constraints.
4. Add waiter profiles and richer politeness scoring.
5. Add local progress tracking for completed scenarios and missed vocabulary.
6. Add review mode for menu items and dialogue expressions.
7. Add optional audio and pronunciation support later.
8. Add more visual polish after the learning loop is reliable.

## 6. Suggested File and Folder Structure

```txt
src/
  App.tsx
  App.css
  index.css
  data/
    challenges.ts
    culturalCombos.ts
    dialogueScenarios.ts
    difficultySettings.ts
    menuItems.ts
    waiterProfiles.ts
  game/
    selectionEvaluator.ts
    types.ts
  tests/
    selectionEvaluator.test.ts
```

Later UI growth can split `App.tsx` into components:

```txt
src/components/
  RestaurantScene.tsx
  MenuBoard.tsx
  MenuItemCard.tsx
  ChallengePrompt.tsx
  SelectionTray.tsx
  DialogueScreen.tsx
  FeedbackPanel.tsx
  SettingsPanel.tsx
  ResultsScreen.tsx
```

## 7. Data Model

Menu item data should include Korean name, English meaning, optional romanization, categories, price, diet metadata, spicy level, serving size, shared/individual status, restaurant contexts, cultural tags, and teaching notes.

Challenges should be defined as data. Each challenge should contain prompt text and a list of constraints. The evaluator should validate constraints generically instead of checking specific UI states or Korean strings.

Cultural combinations should define required tags or item IDs and include a short explanation.

Dialogue scenarios should define a phase, context, waiter profile compatibility, options, register level, score, and explanation.

Difficulty settings should control which hints are visible, how strict evaluation is, whether distractors appear, whether translation appears before or after answer, and whether romanization is shown.

## 8. Example Menu Dataset

The MVP dataset should include at least these item types:

- Soups and stews: 김치찌개, 된장찌개, 순두부찌개.
- Rice meals: 비빔밥, 공깃밥.
- Meat mains: 불고기, 갈비, 삼겹살, 닭갈비, 제육볶음, 보쌈.
- Shared sides: 해물파전, 김치전, 잡채, 계란찜, 만두.
- 분식 and snacks: 떡볶이, 김밥, 라면, 호떡.
- Banchan: 콩나물무침, 시금치나물, 김치, 깍두기.
- Drinks: 물, 콜라, 사이다, 보리차.
- Alcohol: 소주, 맥주, 막걸리.
- Chicken and dessert: 후라이드치킨, 양념치킨, 팥빙수.

## 9. Example Challenges

- Order 치맥: require chicken and beer.
- One meat main, two vegetarian side dishes, and one alcoholic drink.
- Exactly 김치찌개 and 공깃밥.
- Budget challenge: under 25000 won, choose one main and one drink.
- Light, non-alcoholic, and not spicy.
- Vegetarian friend: choose suitable shared dishes.
- Korean BBQ-style meal with soju.
- Food for three people, including one non-spicy dish and one drink.

## 10. Dialogue Scenario Examples

- Attention: 저기요, 여기요, 사장님, 야.
- Ordering: 주문할게요, 이거 하나 주세요, 이거 두 개 주세요.
- Requests: 물 좀 주세요, 혹시 ___ 있어요?
- Missing item: 죄송한데요, ___ 안 나왔어요.
- Food arrives: 잘 먹겠습니다, 감사합니다.
- Bill: 계산할게요, 계산해 주세요.
- Leaving: 잘 먹었습니다. 감사합니다.

Each option should have feedback explaining naturalness, politeness, context, and awkwardness where relevant.

## 11. Scoring System

The selection score should reward:

- Correct dish selection.
- Correct cultural combination recognition.
- Budget and dietary handling.
- Spiciness and alcohol restrictions.
- Completing the flow without major mistakes.

Dialogue scoring should reward:

- Natural phrase choice.
- Suitable politeness.
- Correct response to the immediate situation.
- Avoiding rude, too casual, or overly textbook-like phrases.

The score can be normalized into grades later, but early implementation should expose per-constraint results for clearer debugging and teaching.

## 12. Feedback System

Feedback should be specific and instructional:

- State what the challenge required.
- Show which selected items matched each requirement.
- Explain missing requirements.
- Explain violations such as alcohol, spiciness, or over-budget selections.
- Explain cultural combinations without overgeneralizing.
- Prefer "natural in this context" over universal rules.

## 13. UI/UX Plan

Main screen:

- Show the restaurant table scene immediately.
- Keep the current challenge and menu central.
- Avoid a marketing-style landing page.

Menu selection screen:

- Korean names should be primary.
- Price and category can be visible.
- Romanization, English translation, and visual hints should be controlled by settings.
- Selected items should appear in an order tray.

Dialogue screen:

- Show waiter prompt and multiple-choice Korean responses.
- Hide detailed teaching feedback until after answer.

Feedback panel:

- Show pass/fail per constraint.
- Include clear correction guidance.

Settings screen:

- Instruction language.
- Romanization on/off.
- English translations never/after answer/always.
- Visual hints on/off.
- Difficulty.
- Scenario focus.
- Restaurant type.
- Waiter profile.
- Alcohol, diet, and spicy restrictions.

Progress/results screen:

- Score.
- Correct and missed requirements.
- Vocabulary seen.
- Cultural combos discovered.
- Dialogue phrase notes.

## 14. Fun Without Overbuilding

- Use varied scenarios rather than many systems.
- Add "combo discovered" labels for cultural pairings.
- Use small waiter reactions in CSS.
- Add retry after feedback.
- Add budget and group-size pressure.
- Keep the challenge short enough to replay.

## 15. Potential Pitfalls

- Hard-coding menu logic into React components.
- Checking Korean display strings instead of IDs/tags.
- Teaching unnatural Korean or overly literal translations.
- Allowing many correct answers but giving vague feedback.
- Making cultural notes sound universal or stereotyped.
- Adding too many settings before core validation works.
- Letting visual hints undermine menu reading practice.

## 16. Concrete First Implementation Plan

1. Create the Vite React TypeScript app.
2. Save this plan in `docs/implementation-plan.md`.
3. Define shared game types.
4. Add menu, cultural combo, challenge, dialogue, waiter, and difficulty data modules.
5. Implement the menu selection evaluator as pure TypeScript.
6. Add tests for exact selections, category counts, budget limits, spicy restrictions, and cultural combos.
7. Replace the starter UI with a minimal menu challenge screen.
8. Run tests and production build.

## First Milestone

The first milestone is the MVP foundation: project scaffold, saved plan, structured learning data, menu selection evaluator, tests, and a minimal validation UI. Dialogue play, advanced settings behavior, and polished visuals come after this foundation is verified.

## Added Follow-Up Steps

After the first two milestones, continue with:

1. Replace the quick toggle bar with a real settings panel that controls instruction language, translation timing, romanization, visual hints, difficulty, restaurant type, waiter profile, group size, alcohol, dietary restrictions, and spicy restrictions.
2. Make the menu look more like a real Korean restaurant menu by grouping items under Korean section headings, aligning item names and prices, and keeping hints secondary.
3. Add more answer-option variation in dialogue scenarios, including natural alternatives, overly textbook options, contextually awkward phrases, too-casual speech, and polite but socially imperfect choices.
4. Use settings to change what information appears before and after the player answers, especially English translations and romanization.
5. Keep menu data, dialogue data, and scoring logic separate from React UI so future restaurant types can reuse the same evaluators.
