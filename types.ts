export enum ToolMode {
  AUDIT = 'AUDIT',
  KEYWORD = 'KEYWORD',
  PRODUCT = 'PRODUCT',
  COLLECTION = 'COLLECTION',
  ROADMAP = 'ROADMAP',
  MONITOR = 'MONITOR',
  BLOG = 'BLOG',
  SITEMAP = 'SITEMAP'
}

export interface SEOIssue {
  page: string;
  type: 'Critical' | 'Warning' | 'Info';
  issue: string;
  fix: string;
}

export interface AuditResult {
  score: number;
  totalPageCount: number;
  criticalIssues: number;
  warnings: number;
  passedChecks: number;
  issues: SEOIssue[];
  strategy: string;
}

export interface RankingTimeline {
  keyword: string;
  difficulty: number;
  estimatedMonths: string;
  effortLevel: 'Low' | 'Medium' | 'High';
}

export interface ProductSEOAnalysis {
  productName: string;
  currentRank: number;
  pageNumber: number;
  titleOptimized: boolean;
  descOptimized: boolean;
  imageAltOptimized: boolean;
  schemaFound: boolean;
  suggestedKeywords: string[];
  rankingStrategy: string;
  metaTitle: string;
  metaDescription: string;
  h1Tag: string;
  altTextFound: string[];
  rankingTimeline: RankingTimeline[];
}

export interface CollectionSEOAnalysis {
  collectionName: string;
  internalLinksCount: number;
  productCount: number;
  headerHierarchy: string[];
  metaTitle: string;
  metaDescription: string;
  canonicalSet: boolean;
  topRankedCompetitors: string[];
  optimizationGaps: string[];
}

export interface AZRoadmap {
  phase: string;
  tasks: string[];
  expectedImpact: 'Low' | 'Medium' | 'High';
  timeline: string;
}

export interface ProjectSnapshot {
  id: string;
  timestamp: number;
  score: number;
  rank: number;
  page: number;
  metaTitle: string;
  metaDescription: string;
  h1Tag: string;
  altTexts: string[];
  topKeywords: string[];
}

export interface Project {
  id: string;
  url: string;
  name: string;
  country: string;
  type: 'E-COMMERCE' | 'BLOG' | 'GENERAL';
  lastChecked: number;
  history: ProjectSnapshot[];
  trackedKeywords: string[];
}

export interface KeywordResearchResult {
  metrics: {
    volume: string;
    difficulty: number;
    cpc: string;
    intent: string;
  };
  relatedKeywords: {
    keyword: string;
    volume: string;
    difficulty: number;
    intent: string;
  }[];
  competitors: {
    rank: number;
    domainAuthority: number;
    url: string;
  }[];
  recommendation: string;
}

export interface BlogSEOAnalysis {
  blogTitle: string;
  wordCount: number;
  contentQuality: string;
  rankingPotential: number;
  readabilityScore: string;
  keywordDensity: string;
  internalLinksCount: number;
  externalLinksCount: number;
  contentStrategy: string;
  optimizationChecklist: {
    task: string;
    done: boolean;
  }[];
  missingKeywords: string[];
}

export interface SitemapURL {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export interface SitemapResult {
  xml: string;
  urls: SitemapURL[];
  analysis: {
    totalUrls: number;
    missingImages: number;
    brokenLinks: string[];
    indexabilityIssues: string[];
    suggestions: string[];
  };
}