import {Plugin} from "unified";
import generateXliff from "./generateXliff/index";
import generateSkeleton from "./generateSkeleton/index";
import {TXliffVersion} from "./types";

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

export {default as reconstruct} from "./reconstructMdx/index";
