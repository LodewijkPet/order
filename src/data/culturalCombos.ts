import type { CulturalCombo } from '../game/types'

export const culturalCombos = [
  {
    id: 'chimaek',
    koreanName: '치맥',
    englishName: 'chicken and beer',
    requiredTags: ['chicken', 'beer'],
    explanation:
      '치맥 is a casual combination of 치킨 and 맥주. A soft drink is still a drink, but it does not complete the cultural combo.',
  },
  {
    id: 'samgyeopsal-soju',
    koreanName: '삼겹살과 소주',
    englishName: 'pork belly with soju',
    requiredTags: ['samgyeopsal', 'soju'],
    explanation:
      '삼겹살 with 소주 is a common casual barbecue pairing, especially for shared meals.',
  },
  {
    id: 'pajeon-makgeolli',
    koreanName: '파전과 막걸리',
    englishName: 'savory pancake with makgeolli',
    requiredTags: ['pajeon', 'makgeolli'],
    explanation:
      '파전 and 막걸리 are a familiar pairing. 해물파전 is a strong match; 김치전 can also fit when the task is less specific.',
  },
] satisfies CulturalCombo[]
