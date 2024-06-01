import {Plugin, unified} from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import transformer from "./transformer";
import remarkStringify from "remark-stringify";
import * as defaultOptions from "../defaultOptions";

export default async ({
  fileContents,
  beforeDefaultRemarkPlugins,
  skipNodes,
}: {
  fileContents: string
  beforeDefaultRemarkPlugins?: Plugin[],
  skipNodes?: string[],
}): Promise<string> => {
  beforeDefaultRemarkPlugins = beforeDefaultRemarkPlugins ?? defaultOptions.beforeDefaultRemarkPlugins;
  skipNodes = skipNodes ?? defaultOptions.skipNodes;

  const vfile = await unified()
    .use(beforeDefaultRemarkPlugins)
    .use(remarkParse)
    .use(remarkMdx)
    .use(transformer, {skipNodes})
    .use(remarkStringify)
    .process(fileContents);

  return vfile.value as string;
};
