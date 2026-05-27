import type {
  DialogueEvaluation,
  DialogueFlowEvaluation,
  DialogueScenario,
  RegisterLevel,
  WaiterProfile,
} from './types'

const MAX_OPTION_SCORE = 10
const MAX_REGISTER_SCORE = 2
const PASSING_SCORE = 8

export function evaluateDialogueChoice(
  scenario: DialogueScenario,
  optionId: string,
  waiterProfile: WaiterProfile,
): DialogueEvaluation {
  const selectedOption = scenario.options.find((option) => option.id === optionId)

  if (!selectedOption) {
    throw new Error(`Unknown dialogue option: ${optionId}`)
  }

  const registerScore = scoreRegister(
    selectedOption.register,
    waiterProfile.expectedRegister,
  )
  const score = selectedOption.score + registerScore
  const maxScore = MAX_OPTION_SCORE + MAX_REGISTER_SCORE
  const passed =
    selectedOption.score >= PASSING_SCORE &&
    selectedOption.register !== 'casual' &&
    selectedOption.register !== 'rude'

  return {
    scenarioId: scenario.id,
    optionId,
    selectedOption,
    score,
    maxScore,
    registerScore,
    passed,
    message: buildMessage(selectedOption.explanation, registerScore),
  }
}

export function summarizeDialogueFlow(
  evaluations: DialogueEvaluation[],
  totalSteps: number,
): DialogueFlowEvaluation {
  const score = evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0)
  const maxScore = totalSteps * (MAX_OPTION_SCORE + MAX_REGISTER_SCORE)
  const passedSteps = evaluations.filter((evaluation) => evaluation.passed).length
  const completed = evaluations.length === totalSteps

  return {
    completed,
    score,
    maxScore,
    passedSteps,
    totalSteps,
    summary: completed
      ? `Dialogue complete: ${passedSteps}/${totalSteps} natural choices.`
      : `Dialogue in progress: ${evaluations.length}/${totalSteps} steps answered.`,
  }
}

function scoreRegister(
  register: RegisterLevel,
  expectedRegister: WaiterProfile['expectedRegister'],
): number {
  if (register === expectedRegister) {
    return 2
  }

  if (register === 'politeYo' && expectedRegister === 'formalSeumnida') {
    return 1
  }

  if (register === 'formalSeumnida' && expectedRegister === 'politeYo') {
    return 1
  }

  return 0
}

function buildMessage(explanation: string, registerScore: number): string {
  if (registerScore === 2) {
    return `${explanation} The politeness level fits this waiter profile.`
  }

  if (registerScore === 1) {
    return `${explanation} The politeness level is acceptable, though not the most natural match for this profile.`
  }

  return `${explanation} The politeness level does not fit this profile well.`
}
