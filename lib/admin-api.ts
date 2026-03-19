/**
 * Makes an authenticated API request with automatic 401 handling
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
  router?: { push: (path: string) => void }
): Promise<Response> {
  // Check if we're on the client side
  if (typeof window === "undefined") {
    throw new Error("authenticatedFetch can only be used on the client side");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    if (router) {
      router.push("/admin/login");
    } else {
      window.location.href = "/admin/login";
    }
    throw new Error("No token found");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    localStorage.removeItem("token");
    if (router) {
      router.push("/admin/login");
    } else {
      window.location.href = "/admin/login";
    }
    throw new Error("Unauthorized - redirecting to login");
  }

  return response;
}
