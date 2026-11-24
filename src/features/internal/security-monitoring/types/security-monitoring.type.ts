// src/features/internal/security-monitoring/types/security-monitoring.type.ts

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type StandingStatus = "NORMAL" | "MONITORED" | "THROTTLED" | "SUSPENDED";

export type SecurityOverviewStats = {
  highRiskUserCount: number;
  rateLimitedCount24h: number;
  openIncidentsCount: number;
  totalLogs24h: number;
};

export type UserRiskItem = {
  id: string;
  userId: string;
  currentScore: number;
  riskLevel: RiskLevel;
  standingStatus: StandingStatus;
  contributingFactors: {
    sequentialScrape?: number;
    volume?: number;
    velocity?: number;
    spatialDispersion?: number;
  };
  velocityScore: number;
  spatialDispersionScore: number;
  sequentialScrapeScore: number;
  volumeScore: number;
  lastCalculatedAt?: string;
  autoThrottleUntil?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  };
};

export type MapServiceActivityLogItem = {
  id: string;
  userId?: string | null;
  tokenFingerprint?: string | null;
  requestId?: string | null;
  endpoint: string;
  serviceType: string;
  layerName?: string | null;
  administrativeScope?: Record<string, string> | null;
  aoiMetadata?: {
    areaHectares?: number;
    vertexCount?: number;
  } | null;
  featureCount: number;
  responseBytes: number;
  durationMs: number;
  statusCode: number;
  clientIp?: string | null;
  userAgent?: string | null;
  isSuspicious: boolean;
  rejectionCode?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type UserRiskScoreHistoryItem = {
  id: string;
  userId: string;
  previousScore: number;
  newScore: number;
  triggerReason: string;
  scoreBreakdown?: Record<string, unknown> | null;
  recordedAt: string;
};

export type SecurityUserQueryParams = {
  page?: number;
  limit?: number;
  riskLevel?: string;
  standingStatus?: string;
  search?: string;
};

export type SecurityLogQueryParams = {
  page?: number;
  limit?: number;
  userId?: string;
  layerName?: string;
  isSuspicious?: boolean;
  statusCode?: number;
};
