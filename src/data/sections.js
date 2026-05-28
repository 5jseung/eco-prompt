// Section schema for the prompt builder.
// Mirrors the Korean wireframe in /docs.
// type: 'multi' = checkbox list (multi-select)
//       'single' = radio / select (single-select)
//       'text'   = free-text input
//       'group'  = a section made up of multiple sub-fields

export const SECTIONS = [
  {
    id: 'purpose',
    title: '목적/용도',
    required: true,
    type: 'multi',
    options: [
      'SNS 게시물', '블로그/홈페이지 이미지', '광고/마케팅용', '발표 자료',
      '교육 자료', '개인 소장/취미', '디자인 시안', '아트워크/창작용',
    ],
    placeholder: '예: 환경 캠페인 포스터에 사용할 메인 이미지',
    custom: true, // allow detailed input
  },
  {
    id: 'subject',
    title: '주제/대상',
    required: true,
    type: 'group',
    fields: [
      {
        id: 'details',
        label: '세부 사항 입력',
        type: 'textarea',
        placeholder: '예: 20대 여성 1명, 검은색 코트, 카메라를 들고 거리를 걷는 모습',
      },
      {
        id: 'category',
        label: '대상 유형',
        type: 'single',
        options: ['인물', '캐릭터', '동물', '사물', '풍경', '추상'],
      },
    ],
  },
  {
    id: 'style',
    title: '화풍/스타일',
    required: true,
    type: 'group',
    fields: [
      {
        id: 'keywords',
        label: '세부 사항 입력',
        type: 'text',
        placeholder: '예: 빈티지, 시네마틱, 손그림 느낌',
      },
      {
        id: 'medium',
        label: '표현 매체',
        type: 'multi',
        options: ['유화', '아크릴화', '수채화', '디지털 아트', '픽셀 아트', '3D 렌더', '사진'],
      },
      {
        id: 'era',
        label: '사조/표현 경향',
        type: 'multi',
        options: ['르네상스', '인상주의', '현대적', '추상적', '팝아트', '미니멀', '사이버펑크'],
      },
    ],
  },
  {
    id: 'context',
    title: '맥락/배경',
    required: false,
    type: 'group',
    fields: [
      {
        id: 'direct',
        label: '세부 사항 입력',
        type: 'text',
        placeholder: '예: 한여름 저녁의 제주 해변, 미래 도시의 비 오는 골목',
      },
      {
        id: 'season',
        label: '계절',
        type: 'single',
        options: ['봄', '여름', '가을', '겨울'],
      },
      {
        id: 'weather',
        label: '날씨',
        type: 'multi',
        options: ['맑음', '흐림', '비', '눈', '안개'],
      },
      {
        id: 'era',
        label: '시대/시간적 배경',
        type: 'multi',
        options: ['현대', '과거', '미래', '판타지'],
      },
    ],
  },
  {
    id: 'lighting',
    title: '조명',
    required: false,
    type: 'multi',
    options: ['자연광', '스튜디오 조명', '네온', '촛불', '극적인 조명', '부드러운 조명', '따뜻한 색온도', '차가운 색온도'],
    placeholder: '예: 해질녘의 따뜻한 자연광과 부드러운 그림자',
    custom: true,
  },
  {
    id: 'composition',
    title: '구도/시점',
    required: false,
    type: 'group',
    fields: [
      {
        id: 'direct',
        label: '세부 사항 입력',
        type: 'text',
        placeholder: '예: 인물을 화면 왼쪽에 배치하고 배경은 넓게 보이게',
      },
      {
        id: 'shot',
        label: '시점',
        type: 'multi',
        options: ['위에서 내려다본 시점', '눈높이 시점', '새가 보는 듯한 시점', '아래에서 올려다본 시점'],
      },
      {
        id: 'distance',
        label: '거리/프레이밍',
        type: 'multi',
        options: ['클로즈업', '중간 거리', '전신', '넓은 장면', '초근접'],
      },
    ],
  },
  {
    id: 'mood',
    title: '분위기',
    required: false,
    type: 'multi',
    options: ['평화로운', '신비로운', '어두운', '역동적인', '로맨틱한', '향수를 불러일으키는', '활기찬', '외로운', '아늑한'],
    placeholder: '예: 조용하지만 긴장감 있는 분위기',
    custom: true,
  },
  {
    id: 'negative',
    title: '제외할 요소',
    required: false,
    type: 'text',
    placeholder: '예: 워터마크, 글자',
  },
]
