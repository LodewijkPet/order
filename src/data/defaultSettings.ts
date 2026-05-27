import { difficultySettings } from './difficultySettings'
import type { GameSettings } from '../game/types'

const intermediateDefaults =
  difficultySettings.find((setting) => setting.level === 'intermediate') ??
  difficultySettings[0]

export const defaultGameSettings = {
  difficulty: intermediateDefaults.level,
  instructionLanguage: 'mixed',
  translationVisibility: intermediateDefaults.translationDefault,
  showRomanization: intermediateDefaults.showRomanizationDefault,
  showVisualHints: intermediateDefaults.visualHintsDefault,
  scenarioFocus: 'fullRestaurantFlow',
  restaurantType: 'all',
  waiterProfileId: 'busy-casual-worker',
  numberOfPeople: 2,
  includeAlcohol: true,
  includeDietaryRestrictions: true,
  includeSpicyRestrictions: true,
} satisfies GameSettings
