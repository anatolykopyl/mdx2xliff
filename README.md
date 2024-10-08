# mdx2xliff

A utility for generating a xliff and a skeleton file from a mdx file and back.

## Introduction

When translating a mdx document with an automatic tool, such as Google Translate or DeepL there is a significant possibility that it will break some of the syntax.
It is likely that you have encountered instances where after translation some links look like this, where a space is inserted in the middle of it:

```markdown
[Link text] (example.com)
```

Or arguably worse, since it breaks mdx compilation, alterations to html tags:

```jsx
<Tabs>
  <TabItem>
    Somehow after translation both TabItem tags are opening! 
  <TabItem>
</Tabs>
```

The solution this package proposes is to separate text from the markup and translate only the text.

This is done using two file formats: xliff and skl.
The former is just an xml with all the text content, and the latter is essentially an mdx file with all the text replaced by placeholders.

We translate only the xliff and then combine the result of the translation with the existing skeleton.

For example, a file like this:

```markdown
# My file

With a paragraph, that contains a [link](https://example.com/)
```

Will be split into a XLIFF file:

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xliff xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="urn:oasis:names:tc:xliff:document:1.2" xsi:schemaLocation="urn:oasis:names:tc:xliff:document:1.2 http://docs.oasis-open.org/xliff/v1.2/os/xliff-core-1.2-strict.xsd" version="1.2">
    <file original="namespace" datatype="plaintext" source-language="ru" target-language="en-US">
        <body>
            <trans-unit id="0">
                <source>My file</source>
                <target></target>
            </trans-unit>
            <trans-unit id="1">
                <source>With a paragraph, that contains a</source>
                <target></target>
            </trans-unit>
            <trans-unit id="2">
                <source>link</source>
                <target></target>
            </trans-unit>
        </body>
    </file>
</xliff>
```

And a SKL file:

```markdown
# %%%0%%%

%%%1%%%[%%%2%%%](https://example.com/)
```

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
  sourceLanguage?: string
  targetLanguage?: string
  xliffVersion?: "1.2" | "2.0"
}
```

##### Default values

```
{
  beforeDefaultRemarkPlugins: []
  skipNodes: ["code", "inlineCode", "mdxjsEsm", "mdxFlowExpression", "mdxTextExpression"]
  sourceLanguage: "ru"
  targetLanguage: "en"
  xliffVersion: "2.0"
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
  xliffVersion?: "1.2" | "2.0"
}
```

##### Default values

```
{
  ignoreUntranslated: false
  xliffVersion: "2.0"
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
import headingToHtml from 'mdx2xliff/remarkPlugins/headingToHtml'

;(async () => {
  const fileContents = readFileSync('test.mdx', 'utf8')
  const { skeleton, xliff } = await extract({
    fileContents,
    sourceLanguage: 'en',
    targetLanguage: 'fr',
    beforeDefaultRemarkPlugins: [headingToHtml]
  })

  writeFileSync('test.skl', skeleton)
  writeFileSync('test.xliff', xliff)
})()
```

## Weak spots of this approach

### Loss of context

Whatever app is responsible for translation will have to deal with very short chunks of text.
In a lot of cases they will be one or two words, this leads to suboptimal machine translation quality.

### MDX headings with IDs

Headings like this:

```markdown
## Some heading {#some-id}
```

are not part of any markdown spec and their MDX AST representation is the same as for a normal Markdown heading.
This leads to that a machine translation can mess up and change the ID 
or malform the curly brace part so that the MDX will not even compile. 

This can be worked around by using a built-in remark plugin `mdx2xliff/remarkPlugins/headingToHtml`.
It replaces all Markdown headings with HTML headings, preserving the IDs.

### Frontmatter

Similar to the previous issue, frontmatter is easily malformed by machine translation.
`mdx2xliff` does not yet provide a way of dealing with this.

## Similar projects

### [md2xliff](https://github.com/cataria-rocks/md2xliff)

Pretty old, last commit was in 2022. Uses [unified](https://github.com/unifiedjs/unified) version 6. Focuses on plain Markdown.

### [@diplodoc/markdown-translation](https://github.com/diplodoc-platform/translation)

Actively maintained and developed. Focuses on [YFM](https://diplodoc.com/docs/en/index-yfm). No way to add support for MDX.
Despite being new, uses xliff version 1.2.
