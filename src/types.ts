export type TTransUnit = {
  "@id": string | number
  "@type"?: string
  segment: {
    source: string
    target?: string
  }
}

export type TXliff = {
  "@xmlns": string
  "@version": string
  "@srcLang": string
  "@trgLang": string
  file: {
    "@datatype": string
    unit: TTransUnit[]
  }
}
