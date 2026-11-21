export type Publication = {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number | string;
  selected: boolean;
  preprint: boolean;
  sample?: boolean;
  teaser?: { src: string; alt: string };
  links?: Partial<Record<'PDF' | 'arXiv' | 'Code' | 'Poster' | 'Slides' | 'BibTeX', string>>;
};

export const publications: Publication[] = [
  {
    id: 'llm-complexity',
    title: 'LLM Complexity: Towards a Computational Complexity View of Large Language Model Inference',
    authors: [
      'Yu-Hung Wu',
      'Shao-Xiang Yuan',
      'Chan-Hung Yu',
      'Zih-Ching Chen',
      'Kuan-Hao Huang',
      'Shao-Hua Sun',
    ],
    venue: 'arXiv preprint',
    year: 2026,
    selected: true,
    preprint: true,
    links: {
      arXiv: 'https://arxiv.org/abs/2611.24943v1',
      PDF: 'https://arxiv.org/pdf/2611.24943v1',
    },
  },
];
