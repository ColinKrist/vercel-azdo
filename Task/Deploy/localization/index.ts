import fs from "fs";

export const localizationPath = __dirname;
export const localizationFile = "localization.json";

export interface LocDict {
  [key: string]: string;
}

export class Localizations {
  private readonly locData: LocDict;

  constructor(path: string, fileName: string) {
    this.locData = this.init(path, fileName);
  }

  public getLocalization(key: string): string {
    return this.locData[key] ?? "";
  }

  public init(path: string, fileName: string): LocDict {
    try {
      const data = fs.readFileSync(`${path}/${fileName}`, {
        encoding: "utf8",
      });
      console.log(data);
      const parsed: LocDict = JSON.parse(data);
      return parsed;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
