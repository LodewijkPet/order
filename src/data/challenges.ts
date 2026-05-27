import type { Challenge } from '../game/types'

export const challenges = [
  {
    id: 'order-chimaek',
    title: 'Order 치맥',
    prompt: {
      en: 'Order 치맥.',
      ko: '치맥을 주문하세요.',
    },
    difficulty: 'beginner',
    restaurantTypes: ['chicken', 'casual'],
    constraints: [
      {
        kind: 'culturalCombo',
        label: 'Include the 치맥 combination',
        comboId: 'chimaek',
      },
    ],
    feedbackNotes: [
      '치맥 is short for 치킨 plus 맥주.',
      '콜라 or 사이다 may fit a chicken meal, but they do not satisfy 치맥.',
    ],
  },
  {
    id: 'meat-two-veg-alcohol',
    title: 'Meat, Sides, Alcohol',
    prompt: {
      en: 'Order one meat main dish, two vegetarian side dishes, and one alcoholic drink.',
      ko: '고기 메인 메뉴 하나, 채식 가능한 사이드 두 개, 술 하나를 주문하세요.',
    },
    difficulty: 'intermediate',
    restaurantTypes: ['casual', 'barbecue'],
    constraints: [
      {
        kind: 'dietCount',
        label: 'At least one meat main dish',
        diet: 'meat',
        categories: ['main'],
        count: 1,
      },
      {
        kind: 'dietCount',
        label: 'At least two vegetarian side dishes',
        diet: 'vegetarian',
        categories: ['side', 'banchan'],
        count: 2,
      },
      {
        kind: 'categoryCount',
        label: 'At least one alcoholic drink',
        category: 'alcohol',
        count: 1,
      },
    ],
    feedbackNotes: [
      'VegetarianPossible means the dish may need a request or confirmation in a real restaurant.',
      'Banchan can count as side dishes in this first version.',
    ],
  },
  {
    id: 'exact-kimchi-rice',
    title: 'Exact Order',
    prompt: {
      en: 'Order exactly 김치찌개 and 공깃밥.',
      ko: '김치찌개와 공깃밥만 주문하세요.',
    },
    difficulty: 'beginner',
    restaurantTypes: ['casual'],
    constraints: [
      {
        kind: 'exactItems',
        label: 'Select only 김치찌개 and 공깃밥',
        itemIds: ['kimchi-jjigae', 'gonggibap'],
      },
    ],
    feedbackNotes: ['This task has one specific answer. Extra items should fail.'],
  },
  {
    id: 'budget-main-drink',
    title: 'Budget Order',
    prompt: {
      en: 'You have 25000 won. Choose at least one main dish and one drink.',
      ko: '25000원 안에서 메인 메뉴 하나 이상과 음료 하나 이상을 고르세요.',
    },
    difficulty: 'beginner',
    restaurantTypes: ['casual', 'bunsik', 'chicken'],
    constraints: [
      {
        kind: 'budgetMax',
        label: 'Stay within 25000 won',
        max: 25000,
      },
      {
        kind: 'categoryCount',
        label: 'At least one main dish',
        category: 'main',
        count: 1,
      },
      {
        kind: 'categoryCount',
        label: 'At least one non-alcoholic drink',
        category: 'drink',
        count: 1,
      },
    ],
    feedbackNotes: ['Alcohol is not counted as a regular drink in this challenge.'],
  },
  {
    id: 'light-nonalcohol-nonspicy',
    title: 'Light and Mild',
    prompt: {
      en: 'You want something light, non-alcoholic, and not spicy.',
      ko: '가볍고 술이 아니고 맵지 않은 것을 주문하세요.',
    },
    difficulty: 'intermediate',
    restaurantTypes: ['casual', 'bunsik', 'cafe'],
    constraints: [
      {
        kind: 'itemCount',
        label: 'Choose at least one item',
        count: 1,
      },
      {
        kind: 'categoryForbidden',
        label: 'Do not order alcohol',
        category: 'alcohol',
      },
      {
        kind: 'spicyMax',
        label: 'Every selected item should be mild',
        max: 1,
        scope: 'all',
      },
      {
        kind: 'tagRequired',
        label: 'Include something tagged light',
        tag: 'light',
      },
    ],
    feedbackNotes: ['김밥, 보리차, 물, and 호떡 are examples that can fit this kind of request.'],
  },
  {
    id: 'vegetarian-shared',
    title: 'Vegetarian Friend',
    prompt: {
      en: 'You are eating with a vegetarian friend. Choose at least two suitable shared dishes.',
      ko: '채식하는 친구와 같이 먹습니다. 함께 먹기 좋은 메뉴를 두 개 이상 고르세요.',
    },
    difficulty: 'advanced',
    restaurantTypes: ['casual'],
    constraints: [
      {
        kind: 'sharedOnly',
        label: 'Every selected item should be shareable',
      },
      {
        kind: 'dietCount',
        label: 'At least two vegetarian-suitable items',
        diet: 'vegetarian',
        count: 2,
      },
      {
        kind: 'tagForbidden',
        label: 'Avoid clearly meat-focused choices',
        tag: 'pork',
      },
    ],
    feedbackNotes: [
      'VegetarianPossible means you may still need to ask about broth, fish sauce, or meat toppings.',
      'This challenge accepts practical restaurant judgment rather than one exact answer.',
    ],
  },
  {
    id: 'bbq-with-soju',
    title: 'BBQ With Soju',
    prompt: {
      en: 'Order a typical Korean BBQ-style meal with soju.',
      ko: '소주와 어울리는 한국식 고기구이 메뉴를 주문하세요.',
    },
    difficulty: 'intermediate',
    restaurantTypes: ['barbecue'],
    constraints: [
      {
        kind: 'culturalCombo',
        label: 'Include 삼겹살 and 소주',
        comboId: 'samgyeopsal-soju',
      },
      {
        kind: 'categoryCount',
        label: 'Include at least one main dish',
        category: 'main',
        count: 1,
      },
    ],
    feedbackNotes: ['갈비 can be BBQ-style, but this specific MVP combo asks for 삼겹살 with 소주.'],
  },
  {
    id: 'three-people-nonspicy-drink',
    title: 'Three People',
    prompt: {
      en: 'Order food for three people, including one non-spicy dish and one drink.',
      ko: '세 명이 먹을 음식과 맵지 않은 메뉴 하나, 음료 하나를 주문하세요.',
    },
    difficulty: 'intermediate',
    restaurantTypes: ['casual', 'barbecue', 'chicken'],
    constraints: [
      {
        kind: 'servesPeople',
        label: 'Order enough food for three people',
        people: 3,
      },
      {
        kind: 'spicyMax',
        label: 'Include at least one non-spicy item',
        max: 0,
        scope: 'atLeastOne',
      },
      {
        kind: 'categoryCount',
        label: 'Include at least one non-alcoholic drink',
        category: 'drink',
        count: 1,
      },
    ],
    feedbackNotes: [
      'Serving size is an approximation for game logic, not a universal restaurant rule.',
    ],
  },
] satisfies Challenge[]
