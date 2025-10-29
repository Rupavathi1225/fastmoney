// LocalStorage management for FastMoney app

export interface LandingContent {
  title: string;
  description: string;
}

export interface SearchButton {
  id: string;
  title: string;
  link: string;
  webResultPage: string; // wr=1, wr=2, etc.
  serialNumber: number;
}

export interface WebResult {
  id: string;
  name: string;
  link: string;
  title: string;
  description: string;
  logoUrl: string;
  isSponsored: boolean;
  webResultPage: string; // wr=1, wr=2, etc.
}

const LANDING_KEY = 'fastmoney_landing';
const SEARCH_BUTTONS_KEY = 'fastmoney_search_buttons';
const WEB_RESULTS_KEY = 'fastmoney_web_results';

// Landing Content
export const getLandingContent = (): LandingContent => {
  const stored = localStorage.getItem(LANDING_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    title: "Five Ways to Make Money Online Fast",
    description: "Transitioning to making money online can be challenging. FastMoney helps make earning online simple, affordable, and achievable. Whether you are freelancing, trading, or exploring smart opportunities, these five FastMoney tips will help you start earning quickly and effortlessly."
  };
};

export const saveLandingContent = (content: LandingContent): void => {
  localStorage.setItem(LANDING_KEY, JSON.stringify(content));
};

// Search Buttons
export const getSearchButtons = (): SearchButton[] => {
  const stored = localStorage.getItem(SEARCH_BUTTONS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    { id: '1', title: 'google', link: 'https://google.com', webResultPage: 'wr=1', serialNumber: 1 },
    { id: '2', title: 'youtube', link: '', webResultPage: 'wr=2', serialNumber: 2 },
    { id: '3', title: 'Go and earn money fast', link: '', webResultPage: 'wr=3', serialNumber: 3 },
    { id: '4', title: 'make money online quick', link: '', webResultPage: 'wr=4', serialNumber: 4 },
  ];
};

export const saveSearchButtons = (buttons: SearchButton[]): void => {
  localStorage.setItem(SEARCH_BUTTONS_KEY, JSON.stringify(buttons));
};

// Web Results
export const getWebResults = (): WebResult[] => {
  const stored = localStorage.getItem(WEB_RESULTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    {
      id: '1',
      name: 'Backgrounds',
      link: 'https://google.com',
      title: 'google',
      description: 'hey all how are you',
      logoUrl: '',
      isSponsored: true,
      webResultPage: 'wr=1'
    },
    {
      id: '2',
      name: 'hey',
      link: 'https://google.com',
      title: 'hjj',
      description: 'heyy',
      logoUrl: '',
      isSponsored: false,
      webResultPage: 'wr=1'
    },
    {
      id: '3',
      name: 'google',
      link: 'https://google.com',
      title: 'google',
      description: 'search engine',
      logoUrl: '',
      isSponsored: true,
      webResultPage: 'wr=2'
    }
  ];
};

export const saveWebResults = (results: WebResult[]): void => {
  localStorage.setItem(WEB_RESULTS_KEY, JSON.stringify(results));
};
