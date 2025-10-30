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
  lid: number; // Link ID for masked URLs
}

export interface ClickAnalytics {
  lid: number;
  resultName: string;
  resultTitle: string;
  clicks: number;
  lastClickedAt: string;
}

export interface SessionAnalytics {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  page: string;
}

const LANDING_KEY = 'fastmoney_landing';
const SEARCH_BUTTONS_KEY = 'fastmoney_search_buttons';
const WEB_RESULTS_KEY = 'fastmoney_web_results';
const CLICK_ANALYTICS_KEY = 'fastmoney_click_analytics';
const SESSION_ANALYTICS_KEY = 'fastmoney_session_analytics';
const CURRENT_SESSION_KEY = 'fastmoney_current_session';

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
      webResultPage: 'wr=1',
      lid: 1
    },
    {
      id: '2',
      name: 'hey',
      link: 'https://google.com',
      title: 'hjj',
      description: 'heyy',
      logoUrl: '',
      isSponsored: false,
      webResultPage: 'wr=1',
      lid: 2
    },
    {
      id: '3',
      name: 'google',
      link: 'https://google.com',
      title: 'google',
      description: 'search engine',
      logoUrl: '',
      isSponsored: true,
      webResultPage: 'wr=2',
      lid: 3
    }
  ];
};

export const saveWebResults = (results: WebResult[]): void => {
  localStorage.setItem(WEB_RESULTS_KEY, JSON.stringify(results));
};

// Click Analytics Functions
export const getClickAnalytics = (): ClickAnalytics[] => {
  const data = localStorage.getItem(CLICK_ANALYTICS_KEY);
  return data ? JSON.parse(data) : [];
};

export const trackLinkClick = (lid: number, resultName: string, resultTitle: string) => {
  const analytics = getClickAnalytics();
  const existing = analytics.find(a => a.lid === lid);
  
  if (existing) {
    existing.clicks += 1;
    existing.lastClickedAt = new Date().toISOString();
  } else {
    analytics.push({
      lid,
      resultName,
      resultTitle,
      clicks: 1,
      lastClickedAt: new Date().toISOString()
    });
  }
  
  localStorage.setItem(CLICK_ANALYTICS_KEY, JSON.stringify(analytics));
};

export const clearClickAnalytics = () => {
  localStorage.removeItem(CLICK_ANALYTICS_KEY);
};

// Session Analytics Functions
export const getSessionAnalytics = (): SessionAnalytics[] => {
  const data = localStorage.getItem(SESSION_ANALYTICS_KEY);
  return data ? JSON.parse(data) : [];
};

export const startSession = (page: string) => {
  const session: SessionAnalytics = {
    id: Date.now().toString(),
    startTime: new Date().toISOString(),
    endTime: '',
    duration: 0,
    page
  };
  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  return session;
};

export const endSession = () => {
  const currentSession = localStorage.getItem(CURRENT_SESSION_KEY);
  if (!currentSession) return;
  
  const session: SessionAnalytics = JSON.parse(currentSession);
  session.endTime = new Date().toISOString();
  session.duration = Math.floor((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000);
  
  const allSessions = getSessionAnalytics();
  allSessions.push(session);
  localStorage.setItem(SESSION_ANALYTICS_KEY, JSON.stringify(allSessions));
  localStorage.removeItem(CURRENT_SESSION_KEY);
};

export const clearSessionAnalytics = () => {
  localStorage.removeItem(SESSION_ANALYTICS_KEY);
  localStorage.removeItem(CURRENT_SESSION_KEY);
};
