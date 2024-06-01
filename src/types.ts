export type TTransUnit = {
  "@id": string | number
  "@type"?: string
  source: string
  target?: string
}

export type TXliff = {
  "@version": string
  file: {
    "@source-language": string,
    "@target-language": string,
    "@datatype": string,
    body: {
      "trans-unit": TTransUnit[]
    }
  }
}
