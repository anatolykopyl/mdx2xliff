import {visit} from "unist-util-visit";
import {Transformer} from "unified";
import {TValuefulNode} from "../types";

type THeadingNode = TValuefulNode & {
  depth: number
  children: TValuefulNode[]
  attributes: unknown[]
  name: string
}

function headingToHtml(): Transformer {
  return function transformer(tree) {
    visit(tree, "heading", (node: THeadingNode) => {
      const level = node.depth;
      let headingText = node.children.map(child => child.value).join("");
      const hasId = headingText.includes("{#");

      if (hasId) {
        let id;
        [headingText, id] = headingText.split("{#");
        id = id.replace("}", "");

        node.attributes = [
          {type: "mdxJsxAttribute", name: "id", value: id}
        ];
      }

      node.name = `h${level}`;
      node.type = "mdxJsxFlowElement";
      node.children = [
        {
          type: "text",
          value: headingText.trimEnd()
        }
      ];

      // @ts-expect-error This is no longer a mdx heading node, no need for this
      delete node.value;
    });
  };
}

export default headingToHtml;
