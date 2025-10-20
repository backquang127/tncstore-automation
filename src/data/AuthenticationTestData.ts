import * as XLSX from "xlsx";

export class AuthenticationTestData {
  private static readonly excelPath = "tests/testdata/testdata.xlsx";
  private static readonly sheetName = "LoginData";

  /**
   * Reads data from Excel and returns it as 2D array
   */
  private static getSheetData(): any[][] {
    const workbook = XLSX.readFile(this.excelPath);
    const worksheet = workbook.Sheets[this.sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  }

  /**
   * Finds a specific cell based on row key and column name
   * @param rowKey Row identifier (e.g., 'valid', 'invalidEmail1')
   * @param column Column name ('Email' or 'Password')
   */
  private static get(rowKey: string, column: string): string {
    const allData = this.getSheetData();

    for (const row of allData) {
      if (row.length > 0 && String(row[0]) === rowKey) {
        const columnIndex = this.getColumnIndex(column);
        if (columnIndex >= 0 && columnIndex < row.length) {
          return String(row[columnIndex]);
        }
      }
    }
    return "";
  }

  /**
   * Maps column name to index (like Java version)
   */
  private static getColumnIndex(columnName: string): number {
    const columns: Record<string, number> = {
      Email: 1,
      Password: 2,
    };
    return columns[columnName] ?? -1;
  }

  // === PUBLIC GETTERS (mapping giống Java version) ===
  static getValidEmail(): string {
    return this.get("valid", "Email");
  }

  static getValidPassword(): string {
    return this.get("valid", "Password");
  }

  static getInvalidEmail1(): string {
    return this.get("invalidEmail1", "Email");
  }

  static getEmptyEmail(): string {
    return this.get("emptyEmail", "Email");
  }

  static getEmptyPassword(): string {
    return this.get("emptyPassword", "Password");
  }

  static getBothEmptyEmail(): string {
    return this.get("bothEmpty", "Email");
  }

  static getBothEmptyPassword(): string {
    return this.get("bothEmpty", "Password");
  }
}
