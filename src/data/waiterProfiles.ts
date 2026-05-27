import type { WaiterProfile } from '../game/types'

export const waiterProfiles = [
  {
    id: 'busy-casual-worker',
    label: 'Busy casual restaurant worker',
    expectedRegister: 'politeYo',
    notes: [
      'Short polite -요 phrases are natural.',
      'Overly formal -습니다 phrases can sound stiff but are still polite.',
    ],
  },
  {
    id: 'older-owner',
    label: 'Older owner',
    expectedRegister: 'politeYo',
    notes: [
      '사장님 can be natural in small owner-run places.',
      'Avoid casual speech even if the setting feels relaxed.',
    ],
  },
  {
    id: 'formal-server',
    label: 'Formal server',
    expectedRegister: 'formalSeumnida',
    notes: [
      'More formal wording can fit a fancy restaurant.',
      'Basic -요 style is still usually acceptable from a customer.',
    ],
  },
] satisfies WaiterProfile[]
