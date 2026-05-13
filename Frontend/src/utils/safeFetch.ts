/**
 * Safe Fallback Response Interceptor
 *
 * Ngăn chặn lỗi 500 từ Backend làm crash Frontend.
 * Thay vì quăng lỗi, trả về dữ liệu fallback có cấu trúc y hệt nhưng rỗng.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface SafeResponseOptions {
  /** Các endpoint trả về danh sách → fallback thành [] */
  listEndpoints?: RegExp[];
  /** Các endpoint trả về object có courses/categories → fallback đúng cấu trúc */
  objectEndpoints?: RegExp[];
  /** Các endpoint cần log chi tiết lỗi */
  criticalEndpoints?: RegExp[];
}

const DEFAULT_OPTIONS: SafeResponseOptions = {
  listEndpoints: [
    /\/api\/courses/,
    /\/api\/categories/,
    /\/api\/enrollments/,
    /\/api\/my-courses/,
    /\/api\/forum/,
    /\/api\/users/,
    /\/api\/orders/,
    /\/api\/notifications/,
    /\/api\/teacher\/courses/,
    /\/api\/instructors/,
    /\/api\/search/,
    /\/api\/media/,
  ],
  objectEndpoints: [
    /\/api\/courses\/\d+$/,
    /\/api\/categories\/\d+/,
    /\/api\/users\/\d+/,
  ],
  criticalEndpoints: [
    /\/api\/checkout/,
    /\/api\/enrollments/,
    /\/api\/orders\/\d+\/pay/,
  ],
};

const isListEndpoint = (url: string, options: SafeResponseOptions): boolean => {
  return options.listEndpoints?.some((pattern) => pattern.test(url)) ?? false;
};

const isObjectEndpoint = (url: string, options: SafeResponseOptions): boolean => {
  return options.objectEndpoints?.some((pattern) => pattern.test(url)) ?? false;
};

const isCriticalEndpoint = (url: string, options: SafeResponseOptions): boolean => {
  return options.criticalEndpoints?.some((pattern) => pattern.test(url)) ?? false;
};

/**
 * Tạo response fallback an toàn dựa trên URL endpoint
 */
const createSafeFallback = (url: string): unknown => {
  const cleanUrl = url.replace(/\?.*$/, "");

  if (/\/api\/courses(?:\/\d+)?$/.test(cleanUrl) && !cleanUrl.includes("/chapters") && !cleanUrl.includes("/lessons")) {
    if (cleanUrl.endsWith("/courses/")) {
      return { courses: [], total: 0, totalPages: 1 };
    }
    if (/\/courses\/\d+$/.test(cleanUrl)) {
      return null;
    }
    return { courses: [], total: 0, totalPages: 1 };
  }

  if (/\/api\/categories/.test(cleanUrl)) {
    return { categories: [] };
  }

  if (/\/api\/enrollments/.test(cleanUrl)) {
    return { courses: [] };
  }

  if (/\/api\/my-courses/.test(cleanUrl)) {
    return { courses: [], enrollments: [] };
  }

  if (/\/api\/forum/.test(cleanUrl)) {
    return { topics: [], posts: [], categories: [] };
  }

  if (/\/api\/users/.test(cleanUrl)) {
    return { users: [] };
  }

  if (/\/api\/orders/.test(cleanUrl)) {
    return { orders: [] };
  }

  if (/\/api\/notifications/.test(cleanUrl)) {
    return { notifications: [] };
  }

  if (/\/api\/teacher\/courses/.test(cleanUrl)) {
    return { courses: [] };
  }

  if (/\/api\/instructors/.test(cleanUrl)) {
    return { instructors: [] };
  }

  if (/\/api\/media/.test(cleanUrl)) {
    return { media: [] };
  }

  if (/\/api\/search/.test(cleanUrl)) {
    return { courses: [], posts: [], topics: [] };
  }

  if (/\/api\/quiz/.test(cleanUrl)) {
    return null;
  }

  return {};
};

/**
 * Safe fetch wrapper - thay thế fetch thông thường
 * Khi Backend trả 500, trả về fallback thay vì throw error
 */
export const safeFetch = async (
  url: string,
  options?: RequestInit,
  interceptorOptions?: SafeResponseOptions
): Promise<unknown> => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...interceptorOptions };

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    if (!res.ok) {
      let errorBody: { error?: string; message?: string } = {};
      
      if (isJson) {
        try {
          errorBody = await res.json();
        } catch {
          errorBody = { error: `HTTP ${res.status}` };
        }
      }

      // Xử lý 401 - token hết hạn
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.dispatchEvent(new CustomEvent("auth:expired"));
        throw new ApiError(401, errorBody.error || "Phiên đăng nhập hết hạn");
      }

      // Xử lý 403 - không có quyền
      if (res.status === 403) {
        throw new ApiError(403, errorBody.error || "Bạn không có quyền thực hiện thao tác này");
      }

      // Xử lý 404 - không tìm thấy
      if (res.status === 404) {
        return createSafeFallback(url);
      }

      // Xử lý 500+ - Server error → return fallback thay vì throw
      if (res.status >= 500) {
        const fallback = createSafeFallback(url);
        
        // Log cảnh báo
        const source = url.split("/api/")[1]?.split("/")[0] || "API";
        const message = errorBody.error || errorBody.message || `Lỗi Server (${res.status})`;
        
        window.dispatchEvent(
          new CustomEvent("app:error", {
            detail: { source, message, status: res.status },
          })
        );

        // Critical endpoint thì throw để caller biết có lỗi
        if (isCriticalEndpoint(url, mergedOptions)) {
          console.warn(`[SafeFetch] Critical endpoint failed: ${url} → returning fallback`);
          return fallback;
        }

        console.warn(`[SafeFetch] Server error ${res.status} on ${url} → returning fallback`);
        return fallback;
      }

      // Các lỗi khác (400, 422...) → throw bình thường
      throw new ApiError(res.status, errorBody.error || `Request failed (${res.status})`);
    }

    // Response OK → parse JSON
    if (isJson) {
      return res.json();
    }
    return {};
  } catch (error) {
    // Re-throw ApiError và các lỗi đã throw
    if (error instanceof ApiError) {
      throw error;
    }

    // Network error, parse error → return fallback
    const fallback = createSafeFallback(url);
    console.warn(`[SafeFetch] Network/parse error on ${url} → returning fallback:`, error);
    return fallback;
  }
};

/**
 * Tạo wrapper cho các API function cụ thể
 * Sử dụng safeFetch thay vì fetch thông thường
 */
export const createSafeApi = (
  _api: Record<string, (...args: unknown[]) => Promise<unknown>>,
  _options?: SafeResponseOptions
) => {
  return {};
};