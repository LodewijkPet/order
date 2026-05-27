import type { DifficultySetting } from '../game/types'

export const difficultySettings = [
  {
    level: 'beginner',
    showRomanizationDefault: true,
    translationDefault: 'always',
    visualHintsDefault: true,
    explanationDepth: 'detailed',
  },
  {
    level: 'intermediate',
    showRomanizationDefault: false,
    translationDefault: 'afterAnswer',
    visualHintsDefault: false,
    explanationDepth: 'standard',
  },
  {
    level: 'advanced',
    showRomanizationDefault: false,
    translationDefault: 'never',
    visualHintsDefault: false,
    explanationDepth: 'short',
  },
] satisfies DifficultySetting[]
