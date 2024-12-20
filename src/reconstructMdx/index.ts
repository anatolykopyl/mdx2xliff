import {TXliffObj, TXliffVersion} from "../types";
import {fromXliff} from "../xliffUtil";
import * as defaultOptions from "../defaultOptions";

export default async ({
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

  const xliffObj: TXliffObj = await fromXliff(xliff, xliffVersion ?? defaultOptions.xliffVersion);
  const transUnits = xliffObj.resources.namespace;
  for (const id in transUnits) {
    if (!transUnits[id].target && !ignoreUntranslated) throw new Error(`Id ${id} doesn't have a translation`);
    if (!transUnits[id].target) {
      result = result.replace(`%%%${id}%%%`, transUnits[id].source ?? "");
    } else {
      result = result.replace(`%%%${id}%%%`, transUnits[id].target);
    }
  }

  result = result.replaceAll(/%%%[a-zA-Z0-9]+%%%/g, "");

  return result;
};
