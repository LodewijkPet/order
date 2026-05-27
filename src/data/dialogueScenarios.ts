import type { DialogueScenario } from '../game/types'

export const dialogueScenarios = [
  {
    id: 'casual-attention',
    phase: 'attention',
    context: 'You are ready to call the waiter in a casual restaurant.',
    options: [
      {
        id: 'attention-jeogiyo',
        korean: '저기요.',
        meaning: 'Excuse me.',
        score: 10,
        register: 'politeYo',
        explanation:
          'Natural for politely getting staff attention in many Korean restaurants.',
      },
      {
        id: 'attention-yeogiyo',
        korean: '여기요.',
        meaning: 'Over here, please.',
        score: 8,
        register: 'politeYo',
        explanation:
          'Also common, though it can sound a little more direct than 저기요.',
      },
      {
        id: 'attention-sajangnim',
        korean: '사장님.',
        meaning: 'Owner / boss.',
        score: 8,
        register: 'politeYo',
        explanation:
          'Often natural in small owner-run places, but less suitable in formal service contexts.',
      },
      {
        id: 'attention-jumunhalgeyo',
        korean: '주문할게요.',
        meaning: 'I will order.',
        score: 6,
        register: 'politeYo',
        explanation:
          'Polite, but it works better after you already have the waiter’s attention.',
      },
      {
        id: 'attention-seonsaengnim',
        korean: '선생님.',
        meaning: 'Teacher / respectful address.',
        score: 4,
        register: 'awkward',
        explanation:
          'Respectful in some contexts, but not a natural way to call restaurant staff.',
      },
      {
        id: 'attention-ya',
        korean: '야!',
        meaning: 'Hey!',
        score: 0,
        register: 'rude',
        explanation: 'Too rude for calling restaurant staff.',
      },
    ],
  },
  {
    id: 'casual-ready-to-order',
    phase: 'order',
    context: 'The waiter comes over. Say that you are ready to order.',
    options: [
      {
        id: 'order-jumunhalgeyo',
        korean: '주문할게요.',
        meaning: 'We will order now.',
        score: 10,
        register: 'politeYo',
        explanation: 'Very natural when you are ready to place an order.',
      },
      {
        id: 'order-jumunhaedo-doelkkayo',
        korean: '주문해도 될까요?',
        meaning: 'May I order?',
        score: 9,
        register: 'politeYo',
        explanation:
          'Natural and polite. It sounds a little more tentative than 주문할게요.',
      },
      {
        id: 'order-jumunhago-sipseumnida',
        korean: '주문하고 싶습니다.',
        meaning: 'I would like to order.',
        score: 6,
        register: 'formalSeumnida',
        explanation:
          'Grammatical and polite, but a bit textbook-like for a casual restaurant.',
      },
      {
        id: 'order-menyu-juseyo',
        korean: '메뉴 주세요.',
        meaning: 'Please give me the menu.',
        score: 3,
        register: 'politeYo',
        explanation:
          'Polite Korean, but it asks for a menu instead of saying you are ready to order.',
      },
      {
        id: 'order-jumun',
        korean: '주문.',
        meaning: 'Order.',
        score: 1,
        register: 'awkward',
        explanation:
          'Too clipped. It does not sound like a natural polite request.',
      },
    ],
  },
  {
    id: 'casual-place-items',
    phase: 'order',
    context: 'Point to the selected dishes on the menu and order them politely.',
    options: [
      {
        id: 'items-igeorang-igeo',
        korean: '이거랑 이거 주세요.',
        meaning: 'Please give me this and this.',
        score: 9,
        register: 'politeYo',
        explanation:
          'Natural when pointing at menu items. Naming the dishes is clearer, but this is common.',
      },
      {
        id: 'items-named-order',
        korean: '김치찌개 하나랑 공깃밥 하나 주세요.',
        meaning: 'Please give me one kimchi stew and one bowl of rice.',
        score: 10,
        register: 'politeYo',
        explanation:
          'Clear, polite, and natural when those are the dishes you want.',
      },
      {
        id: 'items-hana-juseyo',
        korean: '이거 하나 주세요.',
        meaning: 'Please give me one of this.',
        score: 8,
        register: 'politeYo',
        explanation:
          'Natural for one item. It may be incomplete if the order has several dishes.',
      },
      {
        id: 'items-du-gae-juseyo',
        korean: '이거 두 개 주세요.',
        meaning: 'Please give me two of this.',
        score: 8,
        register: 'politeYo',
        explanation:
          'Natural for ordering two of the same item, but it is not right for every order.',
      },
      {
        id: 'items-geugeo-juseyo',
        korean: '그거 주세요.',
        meaning: 'Please give me that.',
        score: 5,
        register: 'politeYo',
        explanation:
          'Polite, but vague unless the waiter clearly knows what you mean.',
      },
      {
        id: 'items-jwo',
        korean: '이거 줘.',
        meaning: 'Give me this.',
        score: 0,
        register: 'casual',
        explanation:
          'Too casual and blunt for speaking to restaurant staff.',
      },
    ],
  },
  {
    id: 'casual-clarification',
    phase: 'clarification',
    context: 'The waiter asks a clarification question: "음료는 한 병이면 될까요?"',
    options: [
      {
        id: 'clarification-ne-han-byeong',
        korean: '네, 한 병이면 돼요.',
        meaning: 'Yes, one bottle is enough.',
        score: 10,
        register: 'politeYo',
        explanation:
          'Natural and clear. 돼요 is polite and common in this kind of confirmation.',
      },
      {
        id: 'clarification-ne-gwaenchanseumnida',
        korean: '네, 괜찮습니다.',
        meaning: 'Yes, that is fine.',
        score: 8,
        register: 'formalSeumnida',
        explanation:
          'Polite and clear. Slightly formal, but acceptable.',
      },
      {
        id: 'clarification-matayo',
        korean: '네, 맞아요.',
        meaning: 'Yes, that is right.',
        score: 8,
        register: 'politeYo',
        explanation:
          'Polite and understandable, though less specific than saying 한 병이면 돼요.',
      },
      {
        id: 'clarification-du-byeong',
        korean: '아니요, 두 병 주세요.',
        meaning: 'No, please give me two bottles.',
        score: 7,
        register: 'politeYo',
        explanation:
          'Natural if you really want to change the quantity, but it does not confirm the waiter’s suggestion.',
      },
      {
        id: 'clarification-geurae',
        korean: '그래.',
        meaning: 'Yeah.',
        score: 0,
        register: 'casual',
        explanation:
          'Too casual for a customer speaking to staff in this context.',
      },
    ],
  },
  {
    id: 'casual-food-arrives',
    phase: 'foodArrives',
    context: 'The food arrives at the table.',
    options: [
      {
        id: 'arrives-jalmeokgetseumnida',
        korean: '잘 먹겠습니다.',
        meaning: 'I will enjoy the meal.',
        score: 10,
        register: 'formalSeumnida',
        explanation:
          'Natural before eating. The -습니다 form is fixed and common here, not overly stiff.',
      },
      {
        id: 'arrives-ne-gamsahamnida',
        korean: '네, 감사합니다.',
        meaning: 'Yes, thank you.',
        score: 9,
        register: 'formalSeumnida',
        explanation: 'Natural and polite when receiving food.',
      },
      {
        id: 'arrives-gamsahamnida',
        korean: '감사합니다.',
        meaning: 'Thank you.',
        score: 9,
        register: 'formalSeumnida',
        explanation: 'Simple, polite, and natural when food is served.',
      },
      {
        id: 'arrives-sugo',
        korean: '수고하세요.',
        meaning: 'Keep up the hard work.',
        score: 4,
        register: 'politeYo',
        explanation:
          'Polite-looking, but not the most natural response when food arrives.',
      },
      {
        id: 'arrives-gwaenchana',
        korean: '괜찮아.',
        meaning: 'It is okay.',
        score: 2,
        register: 'casual',
        explanation:
          'This does not fit the moment well, and it is too casual for staff.',
      },
    ],
  },
  {
    id: 'casual-missing-item',
    phase: 'missingItem',
    context: 'One ordered item has not arrived. Politely tell the waiter.',
    options: [
      {
        id: 'missing-annawasseoyo',
        korean: '죄송한데요, 하나 안 나왔어요.',
        meaning: 'Sorry, one item has not come out.',
        score: 10,
        register: 'politeYo',
        explanation:
          'Polite and natural. 죄송한데요 softens the correction.',
      },
      {
        id: 'missing-confirm-rice',
        korean: '죄송한데요, 공깃밥 좀 확인해 주세요.',
        meaning: 'Sorry, could you please check on the rice?',
        score: 9,
        register: 'politeYo',
        explanation:
          'Polite and natural, especially if you want to avoid sounding too direct.',
      },
      {
        id: 'missing-eopseoyo',
        korean: '하나 없어요.',
        meaning: 'One is missing / there is not one.',
        score: 5,
        register: 'awkward',
        explanation:
          'Understandable, but less clear and less natural than 안 나왔어요.',
      },
      {
        id: 'missing-naoneun-jung',
        korean: '혹시 지금 나오는 중이에요?',
        meaning: 'Is it perhaps coming out now?',
        score: 7,
        register: 'politeYo',
        explanation:
          'Polite and soft, but less direct if you simply need to report a missing item.',
      },
      {
        id: 'missing-wae-eopseo',
        korean: '왜 없어요?',
        meaning: 'Why is it not here?',
        score: 3,
        register: 'politeYo',
        explanation:
          'Polite grammar, but it can sound accusatory. Say 안 나왔어요 first.',
      },
    ],
  },
  {
    id: 'casual-check-in',
    phase: 'checkIn',
    context: 'The waiter asks, "괜찮으세요?" Everything is okay.',
    options: [
      {
        id: 'checkin-ne-gwaenchanayo',
        korean: '네, 괜찮아요.',
        meaning: 'Yes, it is okay.',
        score: 10,
        register: 'politeYo',
        explanation: 'Natural and polite when everything is fine.',
      },
      {
        id: 'checkin-ne-jal-meokgo-isseoyo',
        korean: '네, 잘 먹고 있어요.',
        meaning: 'Yes, I am eating well.',
        score: 9,
        register: 'politeYo',
        explanation:
          'Friendly and natural when staff asks whether everything is okay.',
      },
      {
        id: 'checkin-joayo',
        korean: '네, 좋아요.',
        meaning: 'Yes, it is good.',
        score: 8,
        register: 'politeYo',
        explanation:
          'Polite and positive. 괜찮아요 is a little more idiomatic for this check-in.',
      },
      {
        id: 'checkin-mul-juseyo',
        korean: '물 좀 더 주세요.',
        meaning: 'Please give me some more water.',
        score: 6,
        register: 'politeYo',
        explanation:
          'Natural request, but it does not directly answer that everything is okay.',
      },
      {
        id: 'checkin-molla',
        korean: '몰라요.',
        meaning: 'I do not know.',
        score: 1,
        register: 'politeYo',
        explanation: 'Polite form, but contextually strange here.',
      },
    ],
  },
  {
    id: 'casual-bill',
    phase: 'bill',
    context: 'You are finished and want to pay.',
    options: [
      {
        id: 'bill-gyesanhalgeyo',
        korean: '계산할게요.',
        meaning: 'I will pay now.',
        score: 10,
        register: 'politeYo',
        explanation:
          'Very natural when you go to the counter or tell staff you are ready to pay.',
      },
      {
        id: 'bill-card',
        korean: '카드로 계산할게요.',
        meaning: 'I will pay by card.',
        score: 10,
        register: 'politeYo',
        explanation:
          'Natural when paying and specifying card payment.',
      },
      {
        id: 'bill-gyesanhae-juseyo',
        korean: '계산해 주세요.',
        meaning: 'Please calculate / please let me pay.',
        score: 9,
        register: 'politeYo',
        explanation: 'Natural and polite for asking to pay.',
      },
      {
        id: 'bill-eodiseo',
        korean: '계산은 어디서 해요?',
        meaning: 'Where do I pay?',
        score: 8,
        register: 'politeYo',
        explanation:
          'Natural when you are unsure whether to pay at the table or counter.',
      },
      {
        id: 'bill-don',
        korean: '돈.',
        meaning: 'Money.',
        score: 0,
        register: 'awkward',
        explanation: 'Not a natural or polite way to ask for the bill.',
      },
    ],
  },
  {
    id: 'casual-leaving',
    phase: 'leaving',
    context: 'You paid and are leaving the restaurant.',
    options: [
      {
        id: 'leaving-jalmeogeotseumnida',
        korean: '잘 먹었습니다. 감사합니다.',
        meaning: 'I ate well. Thank you.',
        score: 10,
        register: 'formalSeumnida',
        explanation:
          'Natural and polite after a meal. 잘 먹었습니다 is common when leaving.',
      },
      {
        id: 'leaving-annyeonghi-gyeseyo',
        korean: '안녕히 계세요.',
        meaning: 'Goodbye.',
        score: 8,
        register: 'formalSeumnida',
        explanation:
          'Polite and acceptable when leaving, though it is less restaurant-specific.',
      },
      {
        id: 'leaving-gamsahamnida',
        korean: '감사합니다.',
        meaning: 'Thank you.',
        score: 8,
        register: 'formalSeumnida',
        explanation:
          'Polite and fine, though 잘 먹었습니다 adds a natural restaurant-specific closing.',
      },
      {
        id: 'leaving-sugo',
        korean: '수고하세요.',
        meaning: 'Keep up the hard work.',
        score: 6,
        register: 'politeYo',
        explanation:
          'Often heard, but it can be socially delicate depending on age and status. 감사합니다 is safer.',
      },
      {
        id: 'leaving-annyeong',
        korean: '안녕.',
        meaning: 'Bye.',
        score: 1,
        register: 'casual',
        explanation: 'Too casual for leaving a restaurant as a customer.',
      },
    ],
  },
] satisfies DialogueScenario[]
