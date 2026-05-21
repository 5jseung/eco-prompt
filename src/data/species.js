// Species metadata for the character animation + info popover.
// `ready: false` species are shown as disabled until the art is in /public/<id>/.

export const SPECIES = [
  {
    id: 'seal',
    name: '점박이물범',
    en: 'Spotted Seal',
    spritePath: '/seal',    // expects seal-1.png ... seal-5.png
    ready: true,
    facts: [
      'AI 이미지 한 장 생성 ≈ 휴대폰 한 번 완충 분량의 전력.',
      '구체적인 프롬프트 한 번 = 재생성 10번보다 효율적이에요.',
      '에코 모드는 더 적은 시도로 원하는 이미지에 닿는 걸 돕습니다.',
      '오늘도 함께 지구를 아껴주셔서 고마워요!',
    ],
    speciesInfo: {
      blurb:
        '점박이물범은 서해와 백령도 일대에 서식하는 멸종위기 야생생물 II급입니다. 해빙 감소와 서식지 교란으로 개체 수가 줄고 있어요.',
      articleUrl: 'https://www.nie.re.kr/endangered-species/main/contents.do?menuNo=200094',
    },
  },
  {
    id: 'penguin',
    name: '아델리펭귄',
    en: 'Adélie Penguin',
    spritePath: '/penguin',
    ready: false, // art TODO from 현진
    facts: [
      '구체적인 프롬프트 한 번 = 재생성 10번보다 효율적이에요.',
      '오늘도 함께 지구를 아껴주셔서 고마워요!',
    ],
    speciesInfo: {
      blurb:
        '아델리펭귄은 남극 빙붕에 의존해 사는 종으로, 해빙 면적 감소에 따라 번식지가 줄고 있습니다.',
      articleUrl: 'https://www.iucnredlist.org/species/22697758/157660553',
    },
  },
  {
    id: 'bee',
    name: '꿀벌',
    en: 'Honeybee',
    spritePath: '/bee',
    ready: false,
    facts: [
      '구체적인 프롬프트 한 번 = 재생성 10번보다 효율적이에요.',
      '오늘도 함께 지구를 아껴주셔서 고마워요!',
    ],
    speciesInfo: {
      blurb:
        '꿀벌은 전 세계 작물의 약 75%가 의존하는 핵심 수분 매개자입니다. 기후 변화와 농약은 군집 붕괴의 주요 원인으로 지목됩니다.',
      articleUrl: 'https://www.fao.org/pollination/en/',
    },
  },
]

export const DEFAULT_SPECIES_ID = 'seal'
