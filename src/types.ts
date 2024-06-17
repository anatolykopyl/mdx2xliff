export type TXliffVersion = "1.2" | "2.0"

export type TXliffUnit = Record<
  string,
  {
    "source": string,
    "target": string,
    "additionalAttributes"?: {
      "nodeType"?: string
    }
  }
>

export type TXliffObj = {
  "resources": Record<string, TXliffUnit>
  "sourceLanguage": string,
  "targetLanguage": string
}

