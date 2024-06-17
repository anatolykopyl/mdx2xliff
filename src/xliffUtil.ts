import {TXliffObj, TXliffVersion} from "./types";
// @ts-expect-error no types in locize/xliff
import jsToXliff12 from "xliff/jsToXliff12";
// @ts-expect-error no types in locize/xliff
import jsToXliff20 from "xliff/js2xliff";
// @ts-expect-error no types in locize/xliff
import xliff20ToJs from "xliff/xliff2js";
// @ts-expect-error no types in locize/xliff
import xliff12ToJs from "xliff/xliff12ToJs";

export const toXliff = async (jsObj: TXliffObj, version: TXliffVersion = "2.0"): Promise<string> => {
  return {
    "1.2": jsToXliff12,
    "2.0": jsToXliff20
  }[version](jsObj);
};

export const fromXliff = async (xliffString: string, version: TXliffVersion = "2.0"): Promise<TXliffObj> => {
  return {
    "1.2": xliff12ToJs,
    "2.0": xliff20ToJs
  }[version](xliffString);
};
