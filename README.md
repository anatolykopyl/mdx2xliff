# mdx2xliff

A utility for generating a xliff and a skeleton file from a mdx file and back.

## API

This package provides two named exports: `extract` and `reconstruct`.

### `extract(options)`

Generates a skeleton file and a xliff file from a given mdx.

#### Parameters

```
{
  fileContents: string
  beforeDefaultRemarkPlugins?: Plugin[]
  skipNodes?: string[]
  sourceLang?: string
  targetLang?: string
}
```

#### Returns

```
Promise<{
  skeleton: string
  xliff: string
}>
```

### `reconstruct(options)`

Takes two files: skl and xliff, and replaces the placeholders in the skeleton file with the translations from the xliff.

If a translation is missing it throws an error by default. This can be changed by setting `ignoreUntranslated`. Then any missing translation will be replaced with the source string.

#### Parameters

```
{
  skeleton: string
  xliff: string
  ignoreUntranslated?: boolean
}
```

#### Returns

```typescript
string
```

## Example usage

```typescript
import { readFileSync, writeFileSync } from 'fs'
import { extract } from 'mdx2xliff'

;(async () => {
  const fileContents = readFileSync('test.mdx', 'utf8')
  const { skeleton, xliff } = await generate({
    fileContents,
    sourceLang: 'en',
    targetLang: 'fr'
  })

  writeFileSync('test.skl', skeleton)
  writeFileSync('test.xliff', xliff)
})()
```
