import { describe, expect, it } from 'vitest'
import { challenges } from '../data/challenges'
import { culturalCombos } from '../data/culturalCombos'
import { menuItems } from '../data/menuItems'
import { evaluateSelection } from '../game/selectionEvaluator'

function challenge(id: string) {
  const found = challenges.find((item) => item.id === id)

  if (!found) {
    throw new Error(`Missing challenge: ${id}`)
  }

  return found
}

describe('evaluateSelection', () => {
  it('accepts the full chimaek cultural combo', () => {
    const result = evaluateSelection(
      challenge('order-chimaek'),
      ['fried-chicken', 'maekju'],
      menuItems,
      culturalCombos,
    )

    expect(result.isCorrect).toBe(true)
    expect(result.score).toBe(result.maxScore)
  })

  it('gives partial credit when chimaek has chicken but no beer', () => {
    const result = evaluateSelection(
      challenge('order-chimaek'),
      ['fried-chicken', 'cola'],
      menuItems,
      culturalCombos,
    )

    expect(result.isCorrect).toBe(false)
    expect(result.score).toBeGreaterThan(0)
    expect(result.score).toBeLessThan(result.maxScore)
  })

  it('requires exact items when extras are not allowed', () => {
    const exact = challenge('exact-kimchi-rice')

    expect(
      evaluateSelection(
        exact,
        ['kimchi-jjigae', 'gonggibap'],
        menuItems,
        culturalCombos,
      ).isCorrect,
    ).toBe(true)

    expect(
      evaluateSelection(
        exact,
        ['kimchi-jjigae', 'gonggibap', 'cola'],
        menuItems,
        culturalCombos,
      ).isCorrect,
    ).toBe(false)
  })

  it('checks category counts and budget limits together', () => {
    const result = evaluateSelection(
      challenge('budget-main-drink'),
      ['bibimbap', 'boricha'],
      menuItems,
      culturalCombos,
    )

    expect(result.isCorrect).toBe(true)
    expect(result.totalPrice).toBe(11500)
  })

  it('rejects spicy or alcoholic choices for the light challenge', () => {
    const result = evaluateSelection(
      challenge('light-nonalcohol-nonspicy'),
      ['tteokbokki', 'soju'],
      menuItems,
      culturalCombos,
    )

    expect(result.isCorrect).toBe(false)
    expect(result.constraintResults.some((item) => !item.passed)).toBe(true)
  })

  it('accepts shared vegetarian-suitable dishes for a vegetarian friend', () => {
    const result = evaluateSelection(
      challenge('vegetarian-shared'),
      ['japchae', 'gyeran-jjim'],
      menuItems,
      culturalCombos,
    )

    expect(result.isCorrect).toBe(true)
  })

  it('uses serving size for group ordering', () => {
    const result = evaluateSelection(
      challenge('three-people-nonspicy-drink'),
      ['fried-chicken', 'boricha'],
      menuItems,
      culturalCombos,
    )

    expect(result.isCorrect).toBe(true)
  })
})
