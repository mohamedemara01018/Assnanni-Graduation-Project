const SERVER_BASE_URL = (
  import.meta.env.VITE_SERVER_URL || "https://asnani.runasp.net"
).replace(/\/$/, "");

const toAssetPath = (url: string): string => {
  let path = url.startsWith("/") ? url : `/${url}`;

  if (path.startsWith("/api/")) {
    path = path.slice(4);
  }

  return path;
};

/** Full URL for <img> src — cross-origin display does not trigger CORS. */
export const resolveAssetUrl = (url: string): string => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${SERVER_BASE_URL}${toAssetPath(url)}`;
};

/**
 * Same-origin path for axios/fetch — routed through the Vite dev proxy
 * to avoid CORS when downloading files as blobs.
 */
export const resolveFetchableAssetUrl = (url: string): string => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (url.startsWith(SERVER_BASE_URL)) {
      return toAssetPath(url.slice(SERVER_BASE_URL.length));
    }
    return url;
  }

  return toAssetPath(url);
};