export type TTransUnit = {
  "@id": string | number
  "@type"?: string
  segment: {
    source: string
    target?: string
  }
}

export type TXliff = {
  "@xmlns": string,
  "@version": string
  file: {
    "@srcLang": string,
    "@trgLang": string,
    "@datatype": string,
    unit: TTransUnit[]
  }
}
