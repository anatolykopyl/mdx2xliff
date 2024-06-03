import {Plugin} from "unified";
import generateXliff from "./generateXliff/index";
import generateSkeleton from "./generateSkeleton/index";
import {create} from "xmlbuilder2";
import {TXliff} from "./types";

type TExtractOptions = {
  fileContents: string
  beforeDefaultRemarkPlugins?: Plugin[],
  skipNodes?: string[],
  sourceLang?: string,
  targetLang?: string
}

export const extract = async (options: TExtractOptions): Promise<{
  skeleton: string
  xliff: string
}> => {
  return {
    skeleton: await generateSkeleton(options),
    xliff: await generateXliff(options)
  };
};

export const reconstruct = ({
  skeleton,
  xliff,
  ignoreUntranslated
}: {
  skeleton: string,
  xliff: string,
  ignoreUntranslated?: boolean
}) => {
  let result = skeleton;

  const xliffObj = create(xliff).end({ format: "object" }) as {xliff: TXliff};
  const transUnits = xliffObj.xliff.file.unit;
  for (const transUnit of transUnits) {
    const id = transUnit["@id"];
    if (!transUnit.segment.target && !ignoreUntranslated) throw new Error(`Id ${id} doesn't have a translation`);
    if (!transUnit.segment.target) {
      result = result.replace(`%%%${id}%%%`, transUnit.segment.source);
    } else {
      result = result.replace(`%%%${id}%%%`, transUnit.segment.target);
    }
  }

  result = result.replaceAll(/%%%[a-zA-Z0-9]+%%%/g, "");

  return result;
};
