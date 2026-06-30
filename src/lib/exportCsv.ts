export const downloadCsv = (filename: string, rows: Array<Record<string, unknown>>) => {
  if (typeof window === "undefined" || rows.length === 0) return;

  const headers = Array.from(
    rows.reduce<Set<string>>((allKeys, row) => {
      Object.keys(row).forEach((key) => allKeys.add(key));
      return allKeys;
    }, new Set<string>()),
  );

  const csvRows = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          const normalized =
            value === null || value === undefined
              ? ""
              : Array.isArray(value)
                ? value.join(" | ")
                : typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value);
          return `"${normalized.replace(/"/g, '""')}"`;
        })
        .join(","),
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

