import { useMemo, useState } from 'react'
import './App.css'
import { challenges } from './data/challenges'
import { culturalCombos } from './data/culturalCombos'
import { defaultGameSettings } from './data/defaultSettings'
import { dialogueScenarios } from './data/dialogueScenarios'
import { difficultySettings } from './data/difficultySettings'
import { menuItems } from './data/menuItems'
import { waiterProfiles } from './data/waiterProfiles'
import {
  evaluateDialogueChoice,
  summarizeDialogueFlow,
} from './game/dialogueEvaluator'
import { evaluateSelection } from './game/selectionEvaluator'
import type {
  Challenge,
  DifficultyLevel,
  DialogueEvaluation,
  GameSettings,
  MenuItem,
  ScenarioFocus,
  TranslationVisibility,
} from './game/types'

const formatWon = (amount: number) => `₩${amount.toLocaleString('ko-KR')}`

type MenuSectionId =
  | 'main'
  | 'soup'
  | 'bunsik'
  | 'side'
  | 'banchan'
  | 'rice'
  | 'drink'
  | 'alcohol'
  | 'dessert'

const menuSections: { id: MenuSectionId; korean: string; english: string }[] = [
  { id: 'main', korean: '메인 요리', english: 'Mains' },
  { id: 'soup', korean: '찌개', english: 'Stews' },
  { id: 'bunsik', korean: '분식', english: 'Bunsik' },
  { id: 'side', korean: '사이드', english: 'Sides' },
  { id: 'banchan', korean: '반찬', english: 'Banchan' },
  { id: 'rice', korean: '밥', english: 'Rice' },
  { id: 'drink', korean: '음료', english: 'Drinks' },
  { id: 'alcohol', korean: '주류', english: 'Alcohol' },
  { id: 'dessert', korean: '후식', english: 'Dessert' },
]

const restaurantTypeOptions: {
  value: GameSettings['restaurantType']
  label: string
}[] = [
  { value: 'all', label: 'All restaurants' },
  { value: 'casual', label: 'Casual Korean' },
  { value: 'barbecue', label: 'Barbecue' },
  { value: 'chicken', label: 'Chicken place' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'fancy', label: 'Fancy' },
  { value: 'bunsik', label: '분식' },
]

const scenarioFocusOptions: { value: ScenarioFocus; label: string }[] = [
  { value: 'fullRestaurantFlow', label: 'Full flow' },
  { value: 'menuReadingOnly', label: 'Menu reading' },
  { value: 'culturalCombinations', label: 'Cultural combos' },
  { value: 'budgetChallenges', label: 'Budget' },
  { value: 'orderingPhrases', label: 'Ordering phrases' },
  { value: 'politeness', label: 'Politeness' },
]

function App() {
  const [settings, setSettings] = useState<GameSettings>(defaultGameSettings)
  const [challengeId, setChallengeId] = useState(challenges[0].id)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [hasChecked, setHasChecked] = useState(false)
  const [dialogueStarted, setDialogueStarted] = useState(false)
  const [dialogueStepIndex, setDialogueStepIndex] = useState(0)
  const [dialogueAnswers, setDialogueAnswers] = useState<DialogueEvaluation[]>(
    [],
  )

  const availableChallenges = useMemo(
    () => getAvailableChallenges(settings),
    [settings],
  )
  const activeChallenge =
    availableChallenges.find((challenge) => challenge.id === challengeId) ??
    availableChallenges[0] ??
    challenges[0]
  const activeWaiter =
    waiterProfiles.find((waiter) => waiter.id === settings.waiterProfileId) ??
    waiterProfiles[0]
  const filteredMenuItems = useMemo(
    () => getVisibleMenuItems(settings),
    [settings],
  )
  const groupedMenuItems = useMemo(
    () => groupMenuItems(filteredMenuItems),
    [filteredMenuItems],
  )
  const activeDialogue = dialogueScenarios[dialogueStepIndex]
  const currentDialogueAnswer = activeDialogue
    ? dialogueAnswers.find((answer) => answer.scenarioId === activeDialogue.id)
    : undefined
  const dialogueComplete =
    dialogueStarted && dialogueStepIndex >= dialogueScenarios.length
  const prompt = getChallengePrompt(activeChallenge, settings)
  const showMenuTranslations =
    settings.translationVisibility === 'always' ||
    (settings.translationVisibility === 'afterAnswer' && hasChecked)
  const showDialogueTranslations =
    settings.translationVisibility === 'always' ||
    (settings.translationVisibility === 'afterAnswer' &&
      Boolean(currentDialogueAnswer))

  const selectionEvaluation = useMemo(
    () =>
      evaluateSelection(
        activeChallenge,
        selectedIds,
        menuItems,
        culturalCombos,
      ),
    [activeChallenge, selectedIds],
  )

  const dialogueSummary = useMemo(
    () => summarizeDialogueFlow(dialogueAnswers, dialogueScenarios.length),
    [dialogueAnswers],
  )

  const resetDialogue = () => {
    setDialogueStarted(false)
    setDialogueStepIndex(0)
    setDialogueAnswers([])
  }

  const resetRun = () => {
    setSelectedIds([])
    setHasChecked(false)
    resetDialogue()
  }

  const updateSettings = (nextSettings: GameSettings) => {
    setSettings(nextSettings)
    resetRun()
  }

  const changeDifficulty = (difficulty: DifficultyLevel) => {
    const difficultyDefaults =
      difficultySettings.find((setting) => setting.level === difficulty) ??
      difficultySettings[0]

    updateSettings({
      ...settings,
      difficulty,
      showRomanization: difficultyDefaults.showRomanizationDefault,
      translationVisibility: difficultyDefaults.translationDefault,
      showVisualHints: difficultyDefaults.visualHintsDefault,
    })
  }

  const toggleItem = (id: string) => {
    setHasChecked(false)
    resetDialogue()
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    )
  }

  const changeChallenge = (id: string) => {
    setChallengeId(id)
    resetRun()
  }

  const startDialogue = () => {
    setDialogueStarted(true)
    setDialogueStepIndex(0)
    setDialogueAnswers([])
  }

  const answerDialogue = (optionId: string) => {
    if (!activeDialogue || currentDialogueAnswer) {
      return
    }

    const result = evaluateDialogueChoice(
      activeDialogue,
      optionId,
      activeWaiter,
    )
    setDialogueAnswers((current) => [...current, result])
  }

  const goToNextDialogueStep = () => {
    if (dialogueStepIndex + 1 >= dialogueScenarios.length) {
      setDialogueStepIndex(dialogueScenarios.length)
      return
    }

    setDialogueStepIndex((current) => current + 1)
  }

  return (
    <main className="app-shell">
      <section className="restaurant-scene" aria-label="Restaurant scene">
        <div className="back-wall">
          <div className="shelf">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="server">
            <div className="server-head"></div>
            <div className="server-body"></div>
          </div>
        </div>
        <div className="table">
          <div className="menu-book">
            <span>메뉴</span>
          </div>
          <div className="cup"></div>
          <div className="chopsticks"></div>
        </div>
      </section>

      <section className="settings-panel" aria-label="Settings">
        <div className="settings-heading">
          <h2>Settings</h2>
          <span>{activeWaiter.label}</span>
        </div>
        <div className="settings-grid">
          <label>
            Difficulty
            <select
              value={settings.difficulty}
              onChange={(event) =>
                changeDifficulty(event.target.value as DifficultyLevel)
              }
            >
              {difficultySettings.map((setting) => (
                <option key={setting.level} value={setting.level}>
                  {setting.level}
                </option>
              ))}
            </select>
          </label>
          <label>
            Challenge
            <select
              value={activeChallenge.id}
              onChange={(event) => changeChallenge(event.target.value)}
            >
              {availableChallenges.map((challenge) => (
                <option key={challenge.id} value={challenge.id}>
                  {challenge.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Instruction
            <select
              value={settings.instructionLanguage}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  instructionLanguage: event.target
                    .value as GameSettings['instructionLanguage'],
                })
              }
            >
              <option value="english">English</option>
              <option value="korean">Korean</option>
              <option value="mixed">Mixed</option>
            </select>
          </label>
          <label>
            Translation
            <select
              value={settings.translationVisibility}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  translationVisibility: event.target
                    .value as TranslationVisibility,
                })
              }
            >
              <option value="never">Never</option>
              <option value="afterAnswer">After answer</option>
              <option value="always">Always</option>
            </select>
          </label>
          <label>
            Restaurant
            <select
              value={settings.restaurantType}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  restaurantType: event.target
                    .value as GameSettings['restaurantType'],
                })
              }
            >
              {restaurantTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Focus
            <select
              value={settings.scenarioFocus}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  scenarioFocus: event.target.value as ScenarioFocus,
                })
              }
            >
              {scenarioFocusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Waiter
            <select
              value={settings.waiterProfileId}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  waiterProfileId: event.target.value,
                })
              }
            >
              {waiterProfiles.map((waiter) => (
                <option key={waiter.id} value={waiter.id}>
                  {waiter.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            People
            <input
              min="1"
              max="6"
              type="number"
              value={settings.numberOfPeople}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  numberOfPeople: Number(event.target.value),
                })
              }
            />
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.showRomanization}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  showRomanization: event.target.checked,
                })
              }
            />
            Romanization
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.showVisualHints}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  showVisualHints: event.target.checked,
                })
              }
            />
            Hints
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.includeAlcohol}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  includeAlcohol: event.target.checked,
                })
              }
            />
            Alcohol
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.includeDietaryRestrictions}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  includeDietaryRestrictions: event.target.checked,
                })
              }
            />
            Diet
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.includeSpicyRestrictions}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  includeSpicyRestrictions: event.target.checked,
                })
              }
            />
            Spicy
          </label>
        </div>
      </section>

      <section className="challenge-panel">
        <p className="eyebrow">
          {activeChallenge.difficulty} · {settings.restaurantType}
        </p>
        <h1>{prompt.primary}</h1>
        {prompt.secondary && <p>{prompt.secondary}</p>}
      </section>

      <section className="game-grid">
        <section className="menu-panel" aria-label="Korean menu">
          <div className="panel-heading menu-title">
            <div>
              <p className="eyebrow">한국 식당</p>
              <h2>오늘의 메뉴</h2>
            </div>
            <span>{filteredMenuItems.length} items</span>
          </div>
          <div className="menu-list">
            {groupedMenuItems.map((section) => (
              <section className="menu-section" key={section.id}>
                <div className="menu-section-heading">
                  <h3>{section.korean}</h3>
                  {showMenuTranslations && <span>{section.english}</span>}
                </div>
                <div className="menu-section-items">
                  {section.items.map((item) => {
                    const selected = selectedIds.includes(item.id)

                    return (
                      <button
                        className={
                          selected ? 'menu-item selected' : 'menu-item'
                        }
                        key={item.id}
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        aria-pressed={selected}
                      >
                        <span className="menu-item-line">
                          <span className="item-name-block">
                            <span className="korean-name">
                              {item.koreanName}
                            </span>
                            {settings.showRomanization && (
                              <span className="subtext">
                                {item.romanization}
                              </span>
                            )}
                            {showMenuTranslations && (
                              <span className="subtext">
                                {item.englishName}
                              </span>
                            )}
                          </span>
                          <span className="menu-dots"></span>
                          <span className="price">{formatWon(item.price)}</span>
                        </span>
                        {settings.showVisualHints && (
                          <span className="hints">
                            {item.categories.join(' / ')} · spice{' '}
                            {item.spicyLevel}
                            {item.shared ? ' · shared' : ' · individual'}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>

        <aside className="order-panel" aria-label="Selected order">
          <div className="panel-heading">
            <h2>주문</h2>
            <span>{formatWon(selectionEvaluation.totalPrice)}</span>
          </div>

          {selectionEvaluation.selectedItems.length === 0 ? (
            <p className="empty-state">Select menu items to build the order.</p>
          ) : (
            <ul className="selected-list">
              {selectionEvaluation.selectedItems.map((item) => (
                <li key={item.id}>
                  <span>{item.koreanName}</span>
                  <span>{formatWon(item.price)}</span>
                </li>
              ))}
            </ul>
          )}

          <button
            className="check-button"
            type="button"
            onClick={() => setHasChecked(true)}
          >
            Check Order
          </button>

          {hasChecked && (
            <section
              className={
                selectionEvaluation.isCorrect
                  ? 'feedback success'
                  : 'feedback needs-work'
              }
              aria-live="polite"
            >
              <div className="score-line">
                <strong>{selectionEvaluation.summary}</strong>
                <span>
                  {selectionEvaluation.score}/{selectionEvaluation.maxScore}
                </span>
              </div>
              <ul>
                {selectionEvaluation.constraintResults.map((result) => (
                  <li key={result.constraint.label}>
                    <span className={result.passed ? 'pass' : 'fail'}>
                      {result.passed ? 'Pass' : 'Review'}
                    </span>
                    {result.message}
                  </li>
                ))}
              </ul>
              <div className="notes">
                {activeChallenge.feedbackNotes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
              {selectionEvaluation.isCorrect && !dialogueStarted && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={startDialogue}
                >
                  Start Restaurant Dialogue
                </button>
              )}
            </section>
          )}
        </aside>
      </section>

      {dialogueStarted && !dialogueComplete && activeDialogue && (
        <section className="dialogue-panel" aria-label="Restaurant dialogue">
          <div className="panel-heading">
            <h2>Restaurant Dialogue</h2>
            <span>
              Step {dialogueStepIndex + 1}/{dialogueScenarios.length}
            </span>
          </div>

          <div className="dialogue-content">
            <div className="waiter-card">
              <p className="eyebrow">{activeDialogue.phase}</p>
              <h3>{activeWaiter.label}</h3>
              <p>{activeDialogue.context}</p>
            </div>

            <div className="dialogue-options">
              {activeDialogue.options.map((option) => {
                const chosen = currentDialogueAnswer?.optionId === option.id

                return (
                  <button
                    className={
                      chosen ? 'dialogue-option chosen' : 'dialogue-option'
                    }
                    disabled={Boolean(currentDialogueAnswer)}
                    key={option.id}
                    type="button"
                    onClick={() => answerDialogue(option.id)}
                  >
                    <span className="korean-name">{option.korean}</span>
                    {showDialogueTranslations && (
                      <span className="subtext">{option.meaning}</span>
                    )}
                  </button>
                )
              })}
            </div>

            {currentDialogueAnswer && (
              <div
                className={
                  currentDialogueAnswer.passed
                    ? 'dialogue-feedback success'
                    : 'dialogue-feedback needs-work'
                }
                aria-live="polite"
              >
                <div className="score-line">
                  <strong>
                    {currentDialogueAnswer.passed
                      ? 'Natural choice'
                      : 'Needs review'}
                  </strong>
                  <span>
                    {currentDialogueAnswer.score}/
                    {currentDialogueAnswer.maxScore}
                  </span>
                </div>
                <p>{currentDialogueAnswer.message}</p>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={goToNextDialogueStep}
                >
                  {dialogueStepIndex + 1 >= dialogueScenarios.length
                    ? 'Finish Dialogue'
                    : 'Next Phrase'}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {dialogueComplete && (
        <section className="dialogue-panel results-panel" aria-label="Results">
          <div className="panel-heading">
            <h2>Results</h2>
            <span>
              {dialogueSummary.score}/{dialogueSummary.maxScore}
            </span>
          </div>
          <div className="dialogue-content">
            <p>{dialogueSummary.summary}</p>
            <div className="result-grid">
              {dialogueAnswers.map((answer, index) => (
                <div className="result-item" key={answer.scenarioId}>
                  <span className={answer.passed ? 'pass' : 'fail'}>
                    {index + 1}. {answer.passed ? 'Pass' : 'Review'}
                  </span>
                  <strong>{answer.selectedOption.korean}</strong>
                  <p>{answer.selectedOption.explanation}</p>
                </div>
              ))}
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={startDialogue}
            >
              Retry Dialogue
            </button>
          </div>
        </section>
      )}
    </main>
  )
}

function getAvailableChallenges(settings: GameSettings): Challenge[] {
  const allChallenges: readonly Challenge[] = challenges
  const filtered = allChallenges.filter((challenge) => {
    if (challenge.difficulty !== settings.difficulty) {
      return false
    }

    if (
      settings.restaurantType !== 'all' &&
      !challenge.restaurantTypes.includes(settings.restaurantType)
    ) {
      return false
    }

    if (!settings.includeAlcohol && challengeUsesAlcohol(challenge)) {
      return false
    }

    if (
      !settings.includeDietaryRestrictions &&
      challenge.constraints.some((constraint) => constraint.kind === 'dietCount')
    ) {
      return false
    }

    if (
      !settings.includeSpicyRestrictions &&
      challenge.constraints.some((constraint) => constraint.kind === 'spicyMax')
    ) {
      return false
    }

    return matchesScenarioFocus(challenge, settings.scenarioFocus)
  })

  return filtered.length > 0
    ? filtered
    : allChallenges.filter(
        (challenge) => challenge.difficulty === settings.difficulty,
      )
}

function getVisibleMenuItems(settings: GameSettings): MenuItem[] {
  const allMenuItems: readonly MenuItem[] = menuItems

  return allMenuItems.filter((item) => {
    if (!settings.includeAlcohol && item.categories.includes('alcohol')) {
      return false
    }

    return (
      settings.restaurantType === 'all' ||
      item.typicalContext.includes(settings.restaurantType)
    )
  })
}

function matchesScenarioFocus(
  challenge: Challenge,
  focus: ScenarioFocus,
): boolean {
  if (focus === 'fullRestaurantFlow') {
    return true
  }

  if (focus === 'culturalCombinations') {
    return challenge.constraints.some(
      (constraint) => constraint.kind === 'culturalCombo',
    )
  }

  if (focus === 'budgetChallenges') {
    return challenge.constraints.some(
      (constraint) => constraint.kind === 'budgetMax',
    )
  }

  if (focus === 'menuReadingOnly') {
    return challenge.constraints.some(
      (constraint) => constraint.kind === 'exactItems',
    )
  }

  return true
}

function challengeUsesAlcohol(challenge: Challenge): boolean {
  return challenge.constraints.some((constraint) => {
    if (constraint.kind === 'categoryCount') {
      return constraint.category === 'alcohol'
    }

    if (constraint.kind === 'categoryForbidden') {
      return false
    }

    if (constraint.kind === 'culturalCombo') {
      return ['chimaek', 'samgyeopsal-soju', 'pajeon-makgeolli'].includes(
        constraint.comboId,
      )
    }

    return false
  })
}

function groupMenuItems(items: MenuItem[]) {
  return menuSections
    .map((section) => ({
      ...section,
      items: items.filter((item) => getMenuSectionId(item) === section.id),
    }))
    .filter((section) => section.items.length > 0)
}

function getMenuSectionId(item: MenuItem): MenuSectionId {
  if (item.categories.includes('alcohol')) {
    return 'alcohol'
  }

  if (item.categories.includes('drink')) {
    return 'drink'
  }

  if (item.categories.includes('dessert')) {
    return 'dessert'
  }

  if (item.categories.includes('banchan')) {
    return 'banchan'
  }

  if (item.culturalTags.includes('bunsik')) {
    return 'bunsik'
  }

  if (item.categories.includes('soup')) {
    return 'soup'
  }

  if (item.categories.includes('rice') && !item.categories.includes('main')) {
    return 'rice'
  }

  if (item.categories.includes('side')) {
    return 'side'
  }

  return 'main'
}

function getChallengePrompt(challenge: Challenge, settings: GameSettings) {
  if (settings.instructionLanguage === 'korean') {
    return {
      primary: challenge.prompt.ko ?? challenge.prompt.en,
      secondary: challenge.prompt.ko ? undefined : challenge.prompt.en,
    }
  }

  if (settings.instructionLanguage === 'mixed') {
    return {
      primary: challenge.prompt.en,
      secondary: challenge.prompt.ko,
    }
  }

  return {
    primary: challenge.prompt.en,
    secondary: undefined,
  }
}

export default App
