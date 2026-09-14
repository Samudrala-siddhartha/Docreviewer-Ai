/**
 * DocSure AI - Client API Client
 * Centralized client-side request wrapper with session token injection and error handling.
 * Robust against empty payloads, non-JSON error pages, and network drops.
 */

import { ApiResponse } from '../../shared/types.ts';

const TOKEN_KEY = 'docsure_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(path, {
      ...options,
      headers,
    });

    const rawText = await res.text();
    let data: any = null;

    if (rawText && rawText.trim().length > 0) {
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        // If the server returned HTML error or non-JSON string
        if (!res.ok) {
          return {
            success: false,
            error: {
              code: `HTTP_${res.status}`,
              message: `Server returned status ${res.status}: ${res.statusText || 'Non-JSON Error'}`,
              category: 'SERVER_ERROR',
            },
          };
        }
        data = { success: false, rawText };
      }
    } else {
      // Empty response body (e.g. 204 No Content or blank 200 OK)
      if (res.ok) {
        return {
          success: true,
          data: {} as T,
        };
      }
      return {
        success: false,
        error: {
          code: `HTTP_${res.status}`,
          message: `Server returned empty response with status ${res.status} ${res.statusText}`,
          category: 'SERVER_ERROR',
        },
      };
    }

    if (!res.ok && data && !data.error) {
      return {
        success: false,
        error: {
          code: `HTTP_${res.status}`,
          message: data.message || `Request failed with status ${res.status}`,
          category: 'SERVER_ERROR',
        },
      };
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err?.message || 'Unable to connect to DocSure AI server.',
        category: 'NETWORK_ERROR',
      },
    };
  }
}
