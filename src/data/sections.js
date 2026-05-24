// Section schema for the prompt builder.
// Mirrors the Korean wireframe in /docs.
// type: 'multi' = checkbox list (multi-select)
//       'single' = radio / select (single-select)
//       'text'   = free-text input
//       'group'  = a section made up of multiple sub-fields

export const SECTIONS = [
  {
    id: 'purpose',
    title: 'PURPOSE 목적/용도',
    required: true,
    type: 'multi',
    options: [
      'SNS 게시물', '블로그/홈페이지 이미지', '광고/마케팅용', '발표 자료',
      '교육 자료', '개인 소장/취미', '디자인 시안', '아트워크/창작용',
    ],
    custom: true, // allow "직접 입력"
  },
  {
    id: 'subject',
    title: 'SUBJECT 주제(주체/대상)',
    required: true,
    type: 'group',
    fields: [
      {
        id: 'category',
        label: 'Main Category',
        type: 'single',
        options: ['인물(Person)', '캐릭터(Character)', '동물(Animal)', '사물(Object)', '풍경(Landscape)', '추상(Abstract)'],
      },
      {
        id: 'details',
        label: '구체적 묘사 (인원수, 성별/연령, 외형, 의상, 자세/동작 등)',
        type: 'textarea',
        placeholder: '예: 20대 여성 1명, 검은색 코트, 카메라를 들고 거리를 걷는 모습',
      },
    ],
  },
  {
    id: 'style',
    title: 'STYLE 화풍 (스타일)',
    required: true,
    type: 'group',
    fields: [
      {
        id: 'medium',
        label: 'Medium',
        type: 'multi',
        options: ['Oil', 'Acrylic', 'Watercolor', 'Digital art', 'Pixel art', '3D render', 'Photography'],
      },
      {
        id: 'era',
        label: 'Era / Movement',
        type: 'multi',
        options: ['Renaissance', 'Impressionism', 'Modern', 'Abstract', 'Pop art', 'Minimalism', 'Cyberpunk'],
      },
      {
        id: 'keywords',
        label: 'Style Keywords (자유 기재)',
        type: 'text',
        placeholder: '예: 빈티지, 시네마틱, 손그림 느낌',
      },
    ],
  },
  {
    id: 'context',
    title: 'CONTEXT 맥락(배경)',
    required: false,
    type: 'group',
    fields: [
      {
        id: 'season',
        label: 'Season',
        type: 'single',
        options: ['Spring', 'Summer', 'Fall', 'Winter'],
      },
      {
        id: 'weather',
        label: 'Weather',
        type: 'multi',
        options: ['Bright', 'Cloudy', 'Rain', 'Snow', 'Fog', 'Other'],
        custom: true,
      },
      {
        id: 'era',
        label: 'Era / Time',
        type: 'multi',
        options: ['Modern', 'Past', 'Future', 'Fantasy', 'Other'],
        custom: true,
      },
    ],
  },
  {
    id: 'lighting',
    title: 'LIGHTING 조명',
    required: false,
    type: 'multi',
    options: ['Natural', 'Studio', 'Neon', 'Candle', 'Dramatic', 'Soft', 'Color Temperature: Warm', 'Color Temperature: Cool', 'Other'],
    custom: true,
  },
  {
    id: 'composition',
    title: 'COMPOSITION 구도/시점',
    required: false,
    type: 'group',
    fields: [
      {
        id: 'shot',
        label: 'Shot',
        type: 'multi',
        options: ['Top-down', 'Eye-level', 'Bird-eye', 'Worm-eye', 'Other'],
        custom: true,
      },
      {
        id: 'distance',
        label: 'Distance',
        type: 'multi',
        options: ['Close-up', 'Medium', 'Full-body', 'Wide', 'Extreme Close-up', 'Other'],
        custom: true,
      },
    ],
  },
  {
    id: 'mood',
    title: 'MOOD 분위기',
    required: false,
    type: 'multi',
    options: ['Peaceful', 'Mysterious', 'Dark', 'Dynamic', 'Romantic', 'Nostalgic', 'Energetic', 'Lonely', 'Cozy'],
    custom: true,
  },
  {
    id: 'negative',
    title: 'NEGATIVE 제외할 요소 (Negative Prompt)',
    required: false,
    type: 'text',
    placeholder: '예: blurry, low resolution, extra fingers, watermark, text',
  },
]
