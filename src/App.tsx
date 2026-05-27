import { useMemo, useState } from 'react'
import './App.css'
import { challenges } from './data/challenges'
import { culturalCombos } from './data/culturalCombos'
import { dialogueScenarios } from './data/dialogueScenarios'
import { menuItems } from './data/menuItems'
import { waiterProfiles } from './data/waiterProfiles'
import {
  evaluateDialogueChoice,
  summarizeDialogueFlow,
} from './game/dialogueEvaluator'
import { evaluateSelection } from './game/selectionEvaluator'
import type { DialogueEvaluation } from './game/types'

const formatWon = (amount: number) => `₩${amount.toLocaleString('ko-KR')}`

function App() {
  const [challengeId, setChallengeId] = useState(challenges[0].id)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showRomanization, setShowRomanization] = useState(false)
  const [showEnglish, setShowEnglish] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const [dialogueStarted, setDialogueStarted] = useState(false)
  const [dialogueStepIndex, setDialogueStepIndex] = useState(0)
  const [dialogueAnswers, setDialogueAnswers] = useState<DialogueEvaluation[]>(
    [],
  )

  const activeChallenge =
    challenges.find((challenge) => challenge.id === challengeId) ?? challenges[0]
  const activeWaiter = waiterProfiles[0]
  const activeDialogue = dialogueScenarios[dialogueStepIndex]
  const currentDialogueAnswer = activeDialogue
    ? dialogueAnswers.find((answer) => answer.scenarioId === activeDialogue.id)
    : undefined
  const dialogueComplete =
    dialogueStarted && dialogueStepIndex >= dialogueScenarios.length

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
    setSelectedIds([])
    setHasChecked(false)
    resetDialogue()
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

      <section className="control-bar" aria-label="Settings">
        <label>
          Challenge
          <select
            value={challengeId}
            onChange={(event) => changeChallenge(event.target.value)}
          >
            {challenges.map((challenge) => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.title}
              </option>
            ))}
          </select>
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showRomanization}
            onChange={(event) => setShowRomanization(event.target.checked)}
          />
          Romanization
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showEnglish}
            onChange={(event) => setShowEnglish(event.target.checked)}
          />
          English
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showHints}
            onChange={(event) => setShowHints(event.target.checked)}
          />
          Hints
        </label>
      </section>

      <section className="challenge-panel">
        <p className="eyebrow">{activeChallenge.difficulty}</p>
        <h1>{activeChallenge.prompt.en}</h1>
        {activeChallenge.prompt.ko && <p>{activeChallenge.prompt.ko}</p>}
      </section>

      <section className="game-grid">
        <section className="menu-panel" aria-label="Korean menu">
          <div className="panel-heading">
            <h2>오늘의 메뉴</h2>
            <span>{menuItems.length} items</span>
          </div>
          <div className="menu-list">
            {menuItems.map((item) => {
              const selected = selectedIds.includes(item.id)

              return (
                <button
                  className={selected ? 'menu-item selected' : 'menu-item'}
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-pressed={selected}
                >
                  <span className="item-main">
                    <span className="korean-name">{item.koreanName}</span>
                    <span className="price">{formatWon(item.price)}</span>
                  </span>
                  {showRomanization && (
                    <span className="subtext">{item.romanization}</span>
                  )}
                  {showEnglish && (
                    <span className="subtext">{item.englishName}</span>
                  )}
                  {showHints && (
                    <span className="hints">
                      {item.categories.join(' / ')} · spice {item.spicyLevel}
                      {item.shared ? ' · shared' : ' · individual'}
                    </span>
                  )}
                </button>
              )
            })}
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
                    <span className="subtext">{option.meaning}</span>
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

export default App
