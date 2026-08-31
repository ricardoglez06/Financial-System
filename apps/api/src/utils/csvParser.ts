import csv from "csv-parser";
import { Readable } from "stream";

export interface CSVRow {
  date: string;
  amount: string;
  description?: string;
  category?: string;
  type?: string;
}

export function parseCSV(buffer: Buffer): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    const results: CSVRow[] = [];
    const stream = Readable.from(buffer);

    stream
      .pipe(csv())
      .on("data", (row) => {
        results.push({
          date: row.date || row.Date || "",
          amount: row.amount || row.Amount || "",
          description: row.description || row.Description || "",
          category: row.category || row.Category || "",
          type: row.type || row.Type || "EXPENSE",
        });
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

export function validateCSVRow(row: CSVRow): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!row.date || isNaN(Date.parse(row.date))) {
    errors.push("Invalid or missing date");
  }

  const amount = parseFloat(row.amount);
  if (isNaN(amount) || amount <= 0) {
    errors.push("Invalid or missing amount");
  }

  return { valid: errors.length === 0, errors };
}
