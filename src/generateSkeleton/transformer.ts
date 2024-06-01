import {visit} from "unist-util-visit";
import {Transformer} from "unified";
import {create} from "xmlbuilder2";
import {Node} from "unified/lib";

type TValuefulNode = Node & {
  value: string
}

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
      node.value = `%%%${index}%%%`;
      index += 1;
    });
  };
}
