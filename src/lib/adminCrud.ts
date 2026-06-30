export type AdminFormValue = string | boolean;
export type AdminFormValues = Record<string, AdminFormValue>;

const ensureString = (value: AdminFormValue | undefined) => (typeof value === "string" ? value : "");

export const getStringValue = (values: AdminFormValues, key: string) => ensureString(values[key]);
export const getBooleanValue = (values: AdminFormValues, key: string) => Boolean(values[key]);

export const normalizeNullableString = (value: string) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const normalizeRequiredString = (value: string, label: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }

  return trimmed;
};

export const normalizeNumber = (value: string, label: string) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return parsed;
};

export const formatJsonInput = (value: unknown, fallback: "object" | "array" = "object") => {
  const normalized = typeof value === "undefined" ? (fallback === "array" ? [] : {}) : value;
  return JSON.stringify(normalized, null, 2);
};

export const parseJsonInput = (value: string, label: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return {};
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    throw new Error(`${label} must contain valid JSON.`);
  }
};

export const parseObjectJsonInput = (value: string, label: string) => {
  const parsed = parseJsonInput(value, label);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object.`);
  }

  return parsed as Record<string, unknown>;
};

export const parseStringArrayJsonInput = (value: string, label: string) => {
  const parsed = parseJsonInput(value, label);
  if (!Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON array.`);
  }

  return parsed.map((entry) => String(entry));
};

export const toDateTimeInputValue = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const timezoneOffset = parsed.getTimezoneOffset() * 60_000;
  return new Date(parsed.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

export const toIsoDateTimeValue = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date and time value.");
  }

  return parsed.toISOString();
};
