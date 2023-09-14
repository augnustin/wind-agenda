import { promises as fs } from "fs";
import { getMSInterval } from "./calendar";

const CACHE_PATH = "./cache";

const toCachePath = (filename: string): string => `${CACHE_PATH}/${filename.replace(/.json$/i, "")}.json`;

export const lastModifiedAt = async (filename: string): Promise<Date | null> => {
  try {
    const stats = await fs.stat(toCachePath(filename));
    return stats.mtime;
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
};

export const write = async (filename: string, content: string) => {
  await fs.writeFile(toCachePath(filename), JSON.stringify(content), "utf8");
};

export const read = async (filename: string): Promise<Object> => {
  return JSON.parse((await fs.readFile(toCachePath(filename))).toString());
};

export const reset = async () => {
  const files = await fs.readdir(CACHE_PATH);

  const filesToDelete = await files.reduce(async (result, filename) => {
    if (filename.endsWith(".json") && getMSInterval(await lastModifiedAt(filename)) > 1000 * 3600 * 24 * 7) {
      return (await result).concat(filename);
    }
    return result;
  }, Promise.resolve([]));

  await Promise.all(filesToDelete.map(async (filename) => fs.unlink(toCachePath(filename))));

  return filesToDelete;
};
