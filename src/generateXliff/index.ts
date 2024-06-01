import {Plugin, unified} from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import {visit} from "unist-util-visit";
import {Node} from "unified/lib";
import {create} from "xmlbuilder2";
import * as defaultOptions from "../defaultOptions";
import {TTransUnit, TXliff} from "../types";

type TValuefulNode = Node & {
  value: string
}

export default async ({
  beforeDefaultRemarkPlugins,
  fileContents,
  skipNodes,
  sourceLang,
  targetLang
}: {
  fileContents: string,
  beforeDefaultRemarkPlugins?: Plugin[],
  skipNodes?: string[],
  sourceLang?: string,
  targetLang?: string
}): Promise<string> => {
  beforeDefaultRemarkPlugins = beforeDefaultRemarkPlugins ?? defaultOptions.beforeDefaultRemarkPlugins;
  skipNodes = skipNodes ?? defaultOptions.skipNodes;
  sourceLang = sourceLang ?? defaultOptions.sourceLang;
  targetLang = targetLang ?? defaultOptions.targetLang;

  const tree = unified()
    .use(beforeDefaultRemarkPlugins)
    .use(remarkParse)
    .use(remarkMdx)
    .parse(fileContents);

  let index = 0;
  const xliffObj: {
    xliff: TXliff
  } = {
    xliff: {
      "@xmlns": "urn:oasis:names:tc:xliff:document:2.0",
      "@version": "2.1",
      "@srcLang": sourceLang,
      "@trgLang": targetLang,
      file: {
        "@datatype": "plaintext",
        unit: [] as TTransUnit[]
      }
    }
  };

  visit(tree, (_node) => {
    const node = _node as TValuefulNode;
    if (skipNodes.includes(node.type)) return;
    if (!node.value) return;
    if (node.value.trim() === "") return;

    xliffObj.xliff.file["unit"].push({
      "@id": index,
      "@type": node.type,
      segment: {
        source: node.value
      }
    });

    index += 1;
  });

  const doc = create(xliffObj);
  return doc.end({prettyPrint: true});
};
