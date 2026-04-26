/**
 * TrustMark – typed API client.
 *
 * All communication with the FastAPI backend goes through this module.
 * Every function:
 *   1. Gets a fresh Firebase ID token.
 *   2. Sends the request with Authorization: Bearer <token>.
 *   3. Parses the JSON response and throws a typed error on non-2xx status.
 *
 * Environment variable:
 *   NEXT_PUBLIC_API_BASE_URL – e.g. https://trustmark-api-xxxx-uc.a.run.app
 */

import { getIdToken } from "./firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Shared types (mirror backend Pydantic schemas)
// ---------------------------------------------------------------------------

export interface ProtectResponse {
  asset_id: string;
  certificate_url: string;
  watermarked_image_url: string;
  fingerprint: string;
  created_at: string;
}

export interface VerifyResponse {
  match_found: boolean;
  asset_id?: string;
  owner_uid?: string;
  owner_email?: string;
  confidence_score: number;
  certificate_url?: string;
  license_type?: string;
  title?: string;
  created_at?: string;
  message: string;
}

export interface ProvenanceRecord {
  asset_id: string;
  owner_uid: string;
  owner_email: string;
  title?: string;
  description?: string;
  license_type: string;
  fingerprint: string;
  gcs_original_path: string;
  gcs_watermarked_path: string;
  watermarked_image_url: string;
  certificate_url: string;
  verification_count: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardAsset {
  asset_id: string;
  title?: string;
  license_type: string;
  watermarked_image_url: string;
  certificate_url: string;
  verification_count: number;
  created_at: string;
}

export interface DashboardResponse {
  assets: DashboardAsset[];
  total: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function authHeaders(): Promise<HeadersInit> {
  const token = await getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function optionalAuthHeaders(): Promise<HeadersInit> {
  try {
    return await authHeaders();
  } catch {
    return {};
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    return res.json() as Promise<T>;
  }
  let detail = `HTTP ${res.status}`;
  try {
    const body = await res.json();
    detail = body?.detail ?? detail;
  } catch {
    // body was not JSON
  }
  throw new ApiError(res.status, detail);
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

/**
 * POST /api/v1/protect
 *
 * Uploads an image file along with metadata and returns the protection result.
 */
export async function protectAsset(
  file: File,
  licenseType: string,
  title?: string,
  description?: string,
): Promise<ProtectResponse> {
  const headers = await authHeaders();

  const form = new FormData();
  form.append("file", file);
  form.append("license_type", licenseType);
  if (title) form.append("title", title);
  if (description) form.append("description", description);

  const res = await fetch(`${API_BASE}/api/v1/protect`, {
    method: "POST",
    headers,        // Do NOT set Content-Type manually; browser sets multipart boundary
    body: form,
  });

  return handleResponse<ProtectResponse>(res);
}

/**
 * POST /api/v1/verify
 *
 * Uploads a potentially-copied image and returns match results.
 */
export async function verifyAsset(file: File): Promise<VerifyResponse> {
  const headers = await optionalAuthHeaders();

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/api/v1/verify`, {
    method: "POST",
    headers,
    body: form,
  });

  return handleResponse<VerifyResponse>(res);
}

/**
 * GET /api/v1/certificate/{id}
 *
 * Public endpoint – no auth required.
 */
export async function getCertificate(assetId: string): Promise<ProvenanceRecord> {
  const res = await fetch(`${API_BASE}/api/v1/certificate/${assetId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse<ProvenanceRecord>(res);
}

/**
 * GET /api/v1/dashboard
 *
 * Returns the authenticated user's protected assets.
 */
export async function getDashboard(): Promise<DashboardResponse> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}/api/v1/dashboard`, {
    method: "GET",
    headers: { ...headers, "Content-Type": "application/json" },
  });
  return handleResponse<DashboardResponse>(res);
}
