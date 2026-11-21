export const ui = {
  en: {
    home: 'Home', about: 'About', publications: 'Publications', experience: 'Experience', blog: 'Blog',
    selected: 'Selected publications', preprints: 'Preprints', awards: 'Awards',
    sample: 'Sample', equalContribution: 'Equal contribution', skip: 'Skip to content',
    toggle: 'Light theme', dark: 'Dark', light: 'Light', missing: 'Page not found', back: 'Back to home',
    photo: 'Profile photo', contact: 'Contact', rss: 'RSS',
  },
  'zh-tw': {
    home: '首頁', about: '關於', publications: '著作', experience: '經歷', blog: '網誌',
    selected: '精選著作', preprints: '預印本', awards: '獎項',
    sample: '範例', equalContribution: '同等貢獻', skip: '跳至主要內容',
    toggle: '淺色主題', dark: '深色', light: '淺色', missing: '找不到頁面', back: '返回首頁',
    photo: '個人照片', contact: '聯絡方式', rss: 'RSS',
  },
};

export type Language = keyof typeof ui;
