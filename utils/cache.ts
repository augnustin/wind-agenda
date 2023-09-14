import { promises as fs } from "fs";

const toCachePath = (filename: string): string => `./cache/${filename}.json`;

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

// TODO
const reset = () => {};
