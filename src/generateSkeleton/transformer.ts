import {visit} from "unist-util-visit";
import {Transformer} from "unified";
import {TValuefulNode} from "../types";

export default function({
  skipNodes,
}: {
  skipNodes: string[],
}): Transformer {
  return function transformer(tree) {
    let index = 0;

    visit(tree, (_node) => {
      const node = _node as TValuefulNode;
      if (skipNodes.includes(node.type)) return;
      if (!node.value) return;
      if (node.value.trim() === "") return;
      node.value = `%%%${index}%%%`;
      index += 1;
    });
  };
}
