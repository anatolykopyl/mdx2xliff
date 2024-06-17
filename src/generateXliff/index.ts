import {Plugin, unified} from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import {visit} from "unist-util-visit";
import {Node} from "unified/lib";
// @ts-expect-error no types in locize/xliff
import jsToXliff12 from "xliff/jsToXliff12";
// @ts-expect-error no types in locize/xliff
import jsToXliff20 from "xliff/js2xliff";
import * as defaultOptions from "../defaultOptions";
import {TXliffObj, TXliffVersion} from "../types";

type TValuefulNode = Node & {
  value: string
}

export default async ({
  beforeDefaultRemarkPlugins,
  fileContents,
  skipNodes,
  sourceLanguage,
  targetLanguage,
  xliffVersion
}: {
  fileContents: string,
  beforeDefaultRemarkPlugins?: Plugin[],
  skipNodes?: string[],
  sourceLanguage?: string,
  targetLanguage?: string,
  xliffVersion?: TXliffVersion
}): Promise<string> => {
  beforeDefaultRemarkPlugins = beforeDefaultRemarkPlugins ?? defaultOptions.beforeDefaultRemarkPlugins;
  skipNodes = skipNodes ?? defaultOptions.skipNodes;
  sourceLanguage = sourceLanguage ?? defaultOptions.sourceLang;
  targetLanguage = targetLanguage ?? defaultOptions.targetLang;
  xliffVersion = xliffVersion ?? defaultOptions.xliffVersion;

  const tree = unified()
    .use(beforeDefaultRemarkPlugins)
    .use(remarkParse)
    .use(remarkMdx)
    .parse(fileContents);

  let index = 0;

  const xliffObj: TXliffObj = {
    // TODO -- filename instead of namespace
    resources: {
      namespace: {}
    },
    sourceLanguage,
    targetLanguage
  };

  visit(tree, (_node) => {
    const node = _node as TValuefulNode;
    if (skipNodes.includes(node.type)) return;
    if (!node.value) return;
    if (node.value.trim() === "") return;

    xliffObj.resources.namespace[index] = {
      source: node.value,
      target: "",
      additionalAttributes: {
        nodeType: node.type
      }
    };

    index += 1;
  });

  const create = {
    "1.2": jsToXliff12,
    "2.0": jsToXliff20
  };

  return  create[xliffVersion](xliffObj);
};
