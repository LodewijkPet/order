import { describe, expect, it } from 'vitest'
import { dialogueScenarios } from '../data/dialogueScenarios'
import { waiterProfiles } from '../data/waiterProfiles'
import {
  evaluateDialogueChoice,
  summarizeDialogueFlow,
} from '../game/dialogueEvaluator'

const casualWaiter = waiterProfiles[0]

function scenario(id: string) {
  const found = dialogueScenarios.find((item) => item.id === id)

  if (!found) {
    throw new Error(`Missing dialogue scenario: ${id}`)
  }

  return found
}

describe('evaluateDialogueChoice', () => {
  it('scores a natural polite attention phrase highly', () => {
    const result = evaluateDialogueChoice(
      scenario('casual-attention'),
      'attention-jeogiyo',
      casualWaiter,
    )

    expect(result.passed).toBe(true)
    expect(result.score).toBe(12)
  })

  it('rejects rude or overly casual phrases even when understandable', () => {
    const result = evaluateDialogueChoice(
      scenario('casual-attention'),
      'attention-ya',
      casualWaiter,
    )

    expect(result.passed).toBe(false)
    expect(result.score).toBe(0)
  })

  it('allows fixed formal expressions while marking register as less profile-matched', () => {
    const result = evaluateDialogueChoice(
      scenario('casual-food-arrives'),
      'arrives-jalmeokgetseumnida',
      casualWaiter,
    )

    expect(result.passed).toBe(true)
    expect(result.registerScore).toBe(1)
  })

  it('summarizes a completed dialogue flow', () => {
    const evaluations = [
      evaluateDialogueChoice(
        scenario('casual-attention'),
        'attention-jeogiyo',
        casualWaiter,
      ),
      evaluateDialogueChoice(
        scenario('casual-ready-to-order'),
        'order-jumunhalgeyo',
        casualWaiter,
      ),
    ]

    const summary = summarizeDialogueFlow(evaluations, 2)

    expect(summary.completed).toBe(true)
    expect(summary.passedSteps).toBe(2)
    expect(summary.score).toBeGreaterThan(0)
  })
})
