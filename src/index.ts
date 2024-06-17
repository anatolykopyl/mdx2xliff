import {Plugin} from "unified";
import generateXliff from "./generateXliff/index";
import generateSkeleton from "./generateSkeleton/index";
import {TXliffObj, TXliffVersion} from "./types";
// @ts-expect-error no types in locize/xliff
import xliff20ToJs from "xliff/xliff2js";
// @ts-expect-error no types in locize/xliff
import xliff12ToJs from "xliff/xliff12ToJs";
import {xliffVersion as defaultXliffVersion} from "./defaultOptions";

const create = {
  "1.2": xliff12ToJs,
  "2.0": xliff20ToJs
};

type TExtractOptions = {
  fileContents: string
  beforeDefaultRemarkPlugins?: Plugin[],
  skipNodes?: string[],
  sourceLanguage?: string,
  targetLanguage?: string
  xliffVersion?: TXliffVersion
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

export const reconstruct = async ({
  skeleton,
  xliff,
  ignoreUntranslated,
  xliffVersion
}: {
  skeleton: string,
  xliff: string,
  ignoreUntranslated?: boolean,
  xliffVersion?: TXliffVersion
}) => {
  let result = skeleton;

  const xliffObj: TXliffObj = await create[xliffVersion ?? defaultXliffVersion](xliff);
  const transUnits = xliffObj.resources.namespace;
  for (const id in transUnits) {
    if (!transUnits[id].target && !ignoreUntranslated) throw new Error(`Id ${id} doesn't have a translation`);
    if (!transUnits[id].target) {
      result = result.replace(`%%%${id}%%%`, transUnits[id].source);
    } else {
      result = result.replace(`%%%${id}%%%`, transUnits[id].target);
    }
  }

  result = result.replaceAll(/%%%[a-zA-Z0-9]+%%%/g, "");

  return result;
};
