const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");

export const buildAffiliateFingerprint = async () => {
  if (typeof window === "undefined" || !window.crypto?.subtle) return null;

  const rawFingerprint = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    `${window.screen.width}x${window.screen.height}`,
    `${window.devicePixelRatio}`,
  ].join("::");

  const digest = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(rawFingerprint));
  return toHex(digest);
};
