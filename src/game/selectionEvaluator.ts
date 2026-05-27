import type {
  Challenge,
  ConstraintEvaluation,
  CountMode,
  CulturalCombo,
  DietTag,
  MenuCategory,
  MenuItem,
  SelectionConstraint,
  SelectionEvaluation,
} from './types'

const POINTS_PER_CONSTRAINT = 10

export function evaluateSelection(
  challenge: Challenge,
  selectedItemIds: string[],
  menuItems: MenuItem[],
  culturalCombos: CulturalCombo[],
): SelectionEvaluation {
  const selectedItems = selectedItemIds
    .map((id) => menuItems.find((item) => item.id === id))
    .filter((item): item is MenuItem => Boolean(item))

  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0)

  const constraintResults = challenge.constraints.map((constraint) =>
    evaluateConstraint(constraint, selectedItems, totalPrice, culturalCombos),
  )

  const score = constraintResults.reduce((sum, result) => sum + result.score, 0)
  const maxScore = constraintResults.reduce(
    (sum, result) => sum + result.maxScore,
    0,
  )
  const isCorrect = constraintResults.every((result) => result.passed)

  return {
    isCorrect,
    totalPrice,
    selectedItems,
    score,
    maxScore,
    constraintResults,
    summary: isCorrect
      ? 'Order accepted. All requirements are satisfied.'
      : 'Some requirements need adjustment.',
  }
}

function evaluateConstraint(
  constraint: SelectionConstraint,
  selectedItems: MenuItem[],
  totalPrice: number,
  culturalCombos: CulturalCombo[],
): ConstraintEvaluation {
  switch (constraint.kind) {
    case 'categoryCount':
      return evaluateCountConstraint({
        constraint,
        matchedItems: selectedItems.filter((item) =>
          hasCategory(item, constraint.category),
        ),
        count: constraint.count,
        mode: constraint.mode,
        foundLabel: `${constraint.category} item(s)`,
      })
    case 'categoryForbidden': {
      const matchedItems = selectedItems.filter((item) =>
        hasCategory(item, constraint.category),
      )
      const passed = matchedItems.length === 0

      return buildResult({
        constraint,
        passed,
        ratio: passed ? 1 : 0,
        matchedItemIds: matchedItems.map((item) => item.id),
        message: passed
          ? `${constraint.label}: no forbidden ${constraint.category} items selected.`
          : `${constraint.label}: remove ${formatNames(matchedItems)}.`,
      })
    }
    case 'dietCount': {
      const matchedItems = selectedItems.filter((item) => {
        const categoryMatches =
          !constraint.categories ||
          constraint.categories.some((category) => hasCategory(item, category))

        return categoryMatches && matchesDiet(item, constraint.diet)
      })

      return evaluateCountConstraint({
        constraint,
        matchedItems,
        count: constraint.count,
        mode: constraint.mode,
        foundLabel: `${constraint.diet} item(s)`,
      })
    }
    case 'tagRequired': {
      const requiredCount = constraint.count ?? 1
      const matchedItems = selectedItems.filter((item) =>
        hasTag(item, constraint.tag),
      )

      return evaluateCountConstraint({
        constraint,
        matchedItems,
        count: requiredCount,
        mode: 'atLeast',
        foundLabel: `${constraint.tag} item(s)`,
      })
    }
    case 'tagForbidden': {
      const matchedItems = selectedItems.filter((item) =>
        hasTag(item, constraint.tag),
      )
      const passed = matchedItems.length === 0

      return buildResult({
        constraint,
        passed,
        ratio: passed ? 1 : 0,
        matchedItemIds: matchedItems.map((item) => item.id),
        message: passed
          ? `${constraint.label}: no forbidden tagged items selected.`
          : `${constraint.label}: remove ${formatNames(matchedItems)}.`,
      })
    }
    case 'spicyMax':
      return evaluateSpicyMax(constraint, selectedItems)
    case 'budgetMax': {
      const passed = totalPrice <= constraint.max
      const ratio = passed
        ? 1
        : Math.max(0, 1 - (totalPrice - constraint.max) / constraint.max)

      return buildResult({
        constraint,
        passed,
        ratio,
        matchedItemIds: selectedItems.map((item) => item.id),
        message: passed
          ? `${constraint.label}: ${formatWon(totalPrice)} is within the budget.`
          : `${constraint.label}: ${formatWon(totalPrice)} is over ${formatWon(
              constraint.max,
            )}.`,
      })
    }
    case 'exactItems':
      return evaluateExactItems(constraint, selectedItems)
    case 'culturalCombo':
      return evaluateCulturalCombo(constraint, selectedItems, culturalCombos)
    case 'sharedOnly': {
      const unsharedItems = selectedItems.filter((item) => !item.shared)
      const passed = selectedItems.length > 0 && unsharedItems.length === 0

      return buildResult({
        constraint,
        passed,
        ratio: passed ? 1 : 0,
        matchedItemIds: selectedItems
          .filter((item) => item.shared)
          .map((item) => item.id),
        message: passed
          ? `${constraint.label}: all selected dishes are shareable.`
          : `${constraint.label}: ${formatNames(unsharedItems)} are individual items.`,
      })
    }
    case 'servesPeople': {
      const servingTotal = selectedItems.reduce(
        (sum, item) => sum + item.servingSize,
        0,
      )
      const passed = servingTotal >= constraint.people

      return buildResult({
        constraint,
        passed,
        ratio: Math.min(1, servingTotal / constraint.people),
        matchedItemIds: selectedItems.map((item) => item.id),
        message: passed
          ? `${constraint.label}: estimated serving size is ${servingTotal}.`
          : `${constraint.label}: estimated serving size is ${servingTotal}, but ${constraint.people} is needed.`,
      })
    }
    case 'itemCount':
      return evaluateCountConstraint({
        constraint,
        matchedItems: selectedItems,
        count: constraint.count,
        mode: constraint.mode,
        foundLabel: 'selected item(s)',
      })
    default:
      return assertNever(constraint)
  }
}

function evaluateCountConstraint({
  constraint,
  matchedItems,
  count,
  mode = 'atLeast',
  foundLabel,
}: {
  constraint: SelectionConstraint
  matchedItems: MenuItem[]
  count: number
  mode?: CountMode
  foundLabel: string
}): ConstraintEvaluation {
  const found = matchedItems.length
  const passed =
    mode === 'atLeast'
      ? found >= count
      : mode === 'exactly'
        ? found === count
        : found <= count

  const ratio =
    mode === 'atMost'
      ? passed
        ? 1
        : Math.max(0, count / found)
      : Math.min(1, found / count)

  const modeText =
    mode === 'atLeast' ? 'at least' : mode === 'exactly' ? 'exactly' : 'at most'

  return buildResult({
    constraint,
    passed,
    ratio,
    matchedItemIds: matchedItems.map((item) => item.id),
    message: passed
      ? `${constraint.label}: found ${found} ${foundLabel}.`
      : `${constraint.label}: needs ${modeText} ${count}, found ${found}.`,
  })
}

function evaluateSpicyMax(
  constraint: Extract<SelectionConstraint, { kind: 'spicyMax' }>,
  selectedItems: MenuItem[],
): ConstraintEvaluation {
  const matchedItems = selectedItems.filter(
    (item) => item.spicyLevel <= constraint.max,
  )
  const passed =
    constraint.scope === 'all'
      ? selectedItems.length > 0 && matchedItems.length === selectedItems.length
      : matchedItems.length > 0

  const ratio =
    constraint.scope === 'all'
      ? selectedItems.length === 0
        ? 0
        : matchedItems.length / selectedItems.length
      : Math.min(1, matchedItems.length)

  return buildResult({
    constraint,
    passed,
    ratio,
    matchedItemIds: matchedItems.map((item) => item.id),
    message: passed
      ? `${constraint.label}: spicy level requirement is satisfied.`
      : `${constraint.label}: choose item(s) with spicy level ${constraint.max} or below.`,
  })
}

function evaluateExactItems(
  constraint: Extract<SelectionConstraint, { kind: 'exactItems' }>,
  selectedItems: MenuItem[],
): ConstraintEvaluation {
  const selectedIds = selectedItems.map((item) => item.id)
  const requiredMatches = constraint.itemIds.filter((id) =>
    selectedIds.includes(id),
  )
  const missingIds = constraint.itemIds.filter((id) => !selectedIds.includes(id))
  const extraItems = constraint.allowExtras
    ? []
    : selectedItems.filter((item) => !constraint.itemIds.includes(item.id))
  const passed = missingIds.length === 0 && extraItems.length === 0
  const requiredRatio = requiredMatches.length / constraint.itemIds.length
  const extraPenalty = extraItems.length > 0 ? 0.5 : 1

  return buildResult({
    constraint,
    passed,
    ratio: passed ? 1 : requiredRatio * extraPenalty,
    matchedItemIds: requiredMatches,
    message: passed
      ? `${constraint.label}: exact order selected.`
      : `${constraint.label}: missing ${missingIds.length}, extra ${extraItems.length}.`,
  })
}

function evaluateCulturalCombo(
  constraint: Extract<SelectionConstraint, { kind: 'culturalCombo' }>,
  selectedItems: MenuItem[],
  culturalCombos: CulturalCombo[],
): ConstraintEvaluation {
  const combo = culturalCombos.find((item) => item.id === constraint.comboId)

  if (!combo) {
    return buildResult({
      constraint,
      passed: false,
      ratio: 0,
      matchedItemIds: [],
      message: `${constraint.label}: combo ${constraint.comboId} is not defined.`,
    })
  }

  const matchedTags = combo.requiredTags.filter((tag) =>
    selectedItems.some((item) => hasTag(item, tag)),
  )
  const matchedItems = selectedItems.filter((item) =>
    combo.requiredTags.some((tag) => hasTag(item, tag)),
  )
  const passed = matchedTags.length === combo.requiredTags.length

  return buildResult({
    constraint,
    passed,
    ratio: matchedTags.length / combo.requiredTags.length,
    matchedItemIds: matchedItems.map((item) => item.id),
    message: passed
      ? `${constraint.label}: ${combo.koreanName} is complete. ${combo.explanation}`
      : `${constraint.label}: found ${matchedTags.length} of ${combo.requiredTags.length} required parts. ${combo.explanation}`,
  })
}

function buildResult({
  constraint,
  passed,
  ratio,
  matchedItemIds,
  message,
}: {
  constraint: SelectionConstraint
  passed: boolean
  ratio: number
  matchedItemIds: string[]
  message: string
}): ConstraintEvaluation {
  return {
    constraint,
    passed,
    score: Math.round(clamp(ratio, 0, 1) * POINTS_PER_CONSTRAINT),
    maxScore: POINTS_PER_CONSTRAINT,
    matchedItemIds,
    message,
  }
}

function matchesDiet(item: MenuItem, diet: DietTag): boolean {
  if (diet === 'vegetarian') {
    return item.diet.some((tag) =>
      ['vegetarian', 'vegan', 'vegetarianPossible', 'veganPossible'].includes(
        tag,
      ),
    )
  }

  if (diet === 'vegan') {
    return item.diet.some((tag) =>
      ['vegan', 'veganPossible'].includes(tag),
    )
  }

  return item.diet.includes(diet)
}

function hasCategory(item: MenuItem, category: MenuCategory): boolean {
  return item.categories.includes(category)
}

function hasTag(item: MenuItem, tag: string): boolean {
  return item.culturalTags.includes(tag)
}

function formatNames(items: MenuItem[]): string {
  if (items.length === 0) {
    return 'none'
  }

  return items.map((item) => item.koreanName).join(', ')
}

function formatWon(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function assertNever(value: never): never {
  throw new Error(`Unhandled constraint: ${JSON.stringify(value)}`)
}
