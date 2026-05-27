export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export type InstructionLanguage = 'english' | 'korean' | 'mixed'

export type ScenarioFocus =
  | 'fullRestaurantFlow'
  | 'menuReadingOnly'
  | 'culturalCombinations'
  | 'budgetChallenges'
  | 'orderingPhrases'
  | 'politeness'

export type RestaurantType =
  | 'casual'
  | 'barbecue'
  | 'chicken'
  | 'cafe'
  | 'fancy'
  | 'bunsik'

export type MenuCategory =
  | 'main'
  | 'soup'
  | 'rice'
  | 'banchan'
  | 'side'
  | 'drink'
  | 'alcohol'
  | 'dessert'
  | 'set'
  | 'snack'

export type DietTag =
  | 'meat'
  | 'seafood'
  | 'vegetarian'
  | 'vegan'
  | 'vegetarianPossible'
  | 'veganPossible'

export type SpicyLevel = 0 | 1 | 2 | 3

export type CountMode = 'atLeast' | 'exactly' | 'atMost'

export interface MenuItem {
  id: string
  koreanName: string
  englishName: string
  romanization?: string
  categories: MenuCategory[]
  price: number
  diet: DietTag[]
  spicyLevel: SpicyLevel
  shared: boolean
  servingSize: number
  typicalContext: RestaurantType[]
  culturalTags: string[]
  notes?: string[]
}

export interface CulturalCombo {
  id: string
  koreanName: string
  englishName: string
  requiredTags: string[]
  explanation: string
}

export type SelectionConstraint =
  | {
      kind: 'categoryCount'
      label: string
      category: MenuCategory
      count: number
      mode?: CountMode
    }
  | {
      kind: 'categoryForbidden'
      label: string
      category: MenuCategory
    }
  | {
      kind: 'dietCount'
      label: string
      diet: DietTag
      count: number
      mode?: CountMode
      categories?: MenuCategory[]
    }
  | {
      kind: 'tagRequired'
      label: string
      tag: string
      count?: number
    }
  | {
      kind: 'tagForbidden'
      label: string
      tag: string
    }
  | {
      kind: 'spicyMax'
      label: string
      max: SpicyLevel
      scope: 'all' | 'atLeastOne'
    }
  | {
      kind: 'budgetMax'
      label: string
      max: number
    }
  | {
      kind: 'exactItems'
      label: string
      itemIds: string[]
      allowExtras?: boolean
    }
  | {
      kind: 'culturalCombo'
      label: string
      comboId: string
    }
  | {
      kind: 'sharedOnly'
      label: string
    }
  | {
      kind: 'servesPeople'
      label: string
      people: number
    }
  | {
      kind: 'itemCount'
      label: string
      count: number
      mode?: CountMode
    }

export interface Challenge {
  id: string
  title: string
  prompt: {
    en: string
    ko?: string
  }
  difficulty: DifficultyLevel
  restaurantTypes: RestaurantType[]
  constraints: SelectionConstraint[]
  feedbackNotes: string[]
}

export type DialoguePhase =
  | 'attention'
  | 'order'
  | 'clarification'
  | 'foodArrives'
  | 'missingItem'
  | 'checkIn'
  | 'bill'
  | 'leaving'

export type RegisterLevel =
  | 'casual'
  | 'politeYo'
  | 'formalSeumnida'
  | 'rude'
  | 'awkward'

export interface DialogueOption {
  id: string
  korean: string
  meaning: string
  score: number
  register: RegisterLevel
  explanation: string
}

export interface DialogueScenario {
  id: string
  phase: DialoguePhase
  context: string
  options: DialogueOption[]
}

export interface WaiterProfile {
  id: string
  label: string
  expectedRegister: Extract<RegisterLevel, 'politeYo' | 'formalSeumnida'>
  notes: string[]
}

export type TranslationVisibility = 'never' | 'afterAnswer' | 'always'

export interface DifficultySetting {
  level: DifficultyLevel
  showRomanizationDefault: boolean
  translationDefault: TranslationVisibility
  visualHintsDefault: boolean
  explanationDepth: 'short' | 'standard' | 'detailed'
}

export interface GameSettings {
  difficulty: DifficultyLevel
  instructionLanguage: InstructionLanguage
  translationVisibility: TranslationVisibility
  showRomanization: boolean
  showVisualHints: boolean
  scenarioFocus: ScenarioFocus
  restaurantType: RestaurantType | 'all'
  waiterProfileId: string
  numberOfPeople: number
  includeAlcohol: boolean
  includeDietaryRestrictions: boolean
  includeSpicyRestrictions: boolean
}

export interface ConstraintEvaluation {
  constraint: SelectionConstraint
  passed: boolean
  score: number
  maxScore: number
  matchedItemIds: string[]
  message: string
}

export interface SelectionEvaluation {
  isCorrect: boolean
  totalPrice: number
  selectedItems: MenuItem[]
  score: number
  maxScore: number
  constraintResults: ConstraintEvaluation[]
  summary: string
}

export interface DialogueEvaluation {
  scenarioId: string
  optionId: string
  selectedOption: DialogueOption
  score: number
  maxScore: number
  registerScore: number
  passed: boolean
  message: string
}

export interface DialogueFlowEvaluation {
  completed: boolean
  score: number
  maxScore: number
  passedSteps: number
  totalSteps: number
  summary: string
}
