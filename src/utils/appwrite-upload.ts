import sdk, { ID } from "node-appwrite";
import { prisma } from "../db";
import { BACKEND_URL } from "../constants";
const nodeFetchNativeWithAgent = require("node-fetch-native-with-agent");
const fs = require("fs");

class InputFile {
  static fromBuffer(parts: any, name: any) {
    return new nodeFetchNativeWithAgent.File([parts], name);
  }
  static fromPath(path: any, name: any) {
    const realPath = fs.realpathSync(path);
    const contents = fs.readFileSync(realPath);
    return this.fromBuffer(contents, name);
  }
  static fromPlainText(content: any, name: any) {
    const arrayBytes = new TextEncoder().encode(content);
    return this.fromBuffer(arrayBytes, name);
  }
}

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const storage = new sdk.Storage(client);

export const uploadToAppwrite = async (filepath: string, filename: string) => {
  try {
    const file = InputFile.fromPath(filepath, filename);
    const uploadedMedia = await storage.createFile(
      process.env.APPWRITE_BUCKET_ID!,
      ID.unique(),
      file,
      // ["read('any')"]
    );
    fs.unlinkSync(filepath);

    // get the file
    const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${uploadedMedia.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

    const shortURL = await prisma.shortURL.create({
      data: {
        url: fileUrl,
        filename: filename,
      },
    });

    return `${BACKEND_URL}/short-url/${shortURL.id}`;
    return fileUrl;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};
