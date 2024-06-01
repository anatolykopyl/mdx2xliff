import {Plugin} from "unified";
import generateXliff from "./generateXliff/index";
import generateSkeleton from "./generateSkeleton/index";
import {create} from "xmlbuilder2";
import {TXliff} from "./types";

type TGenerateOptions = {
  fileContents: string
  beforeDefaultRemarkPlugins?: Plugin[],
  skipNodes?: string[],
  sourceLang?: string,
  targetLang?: string
}

export const generate = async (options: TGenerateOptions): Promise<{
  skeleton: string
  xliff: string
}> => {
  return {
    skeleton: await generateSkeleton(options),
    xliff: await generateXliff(options)
  };
};

export const compose = ({
  skeleton,
  xliff
}: {
  skeleton: string,
  xliff: string
}) => {
  let result = skeleton;

  const xliffObj = create(xliff).end({ format: "object" }) as {xliff: TXliff};
  const transUnits = xliffObj.xliff.file.body["trans-unit"];
  for (const transUnit of transUnits) {
    const id = transUnit["@id"];
    if (!transUnit.target) throw new Error(`Id ${id} doesn't have a translation`);
    result = result.replace(`%%%${id}%%%`, transUnit.target);
  }

  result = result.replaceAll(/%%%[a-zA-Z0-9]+%%%/g, "");

  return result;
};
