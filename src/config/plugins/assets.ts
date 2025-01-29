import {
  VendurePlugin,
  PluginCommonModule,
  AssetStorageStrategy,
} from "@vendure/core";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Stream, Readable } from "stream";
import { createWriteStream } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { promisify } from "util";
import { pipeline } from "stream";
import { ReadableStream } from "web-streams-polyfill";
import { SharpAssetPreviewStrategy } from "@vendure/asset-server-plugin";

// Promisify the pipeline function for easier use with async/await
const pipelineAsync = promisify(pipeline);

// Cloudinary configuration interface
interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

// Custom AssetStorageStrategy for Cloudinary
class CloudinaryAssetStorageStrategy implements AssetStorageStrategy {
  constructor(config: CloudinaryConfig) {
    cloudinary.config({
      cloud_name: config.cloud_name,
      api_key: config.api_key,
      api_secret: config.api_secret,
      secure: true,
    });
  }

  async writeFileFromBuffer(fileName: string, data: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: fileName },
        (error: Error | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else {
            if (result) {
              resolve(result.secure_url);
            } else {
              reject(new Error("Upload failed, result is undefined"));
            }
          }
        }
      );

      const bufferStream = new Stream.PassThrough();
      bufferStream.end(data);
      bufferStream.pipe(uploadStream);
    });
  }

  async writeFileFromStream(fileName: string, data: Stream): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: fileName },
        (error: Error | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else {
            if (result) {
              resolve(result.secure_url);
            } else {
              reject(new Error("Upload failed, result is undefined"));
            }
          }
        }
      );

      data.pipe(uploadStream);
    });
  }

  async readFileToBuffer(identifier: string): Promise<Buffer> {
    // Sanitize the identifier to create a valid file name
    const sanitizedIdentifier = identifier.replace(/[^a-zA-Z0-9]/g, "_"); // Replace invalid characters with underscores
    const tempFilePath = join(tmpdir(), sanitizedIdentifier);
    const writeStream = createWriteStream(tempFilePath);

    // Download the file from Cloudinary
    const cloudinaryUrl = cloudinary.url(identifier);
    const response = await fetch(cloudinaryUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch file from Cloudinary: ${response.statusText}`
      );
    }

    // Convert the Fetch API ReadableStream to a Node.js Stream
    if (!response.body) {
      throw new Error("Response body is null");
    }

    const fetchStream = Readable.fromWeb(
      response.body as ReadableStream<Uint8Array>
    );

    // Pipe the stream to a file
    await pipelineAsync(fetchStream, writeStream);

    // Read the file into a buffer
    const fs = require("fs");
    const buffer = fs.readFileSync(tempFilePath);

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);

    return buffer;
  }

  async readFileToStream(identifier: string): Promise<Stream> {
    // Fetch the file from Cloudinary as a stream
    const cloudinaryUrl = cloudinary.url(identifier);
    const response = await fetch(cloudinaryUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch file from Cloudinary: ${response.statusText}`
      );
    }

    // Convert the Fetch API ReadableStream to a Node.js Stream
    if (!response.body) {
      throw new Error("Response body is null");
    }

    return Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
  }

  async deleteFile(identifier: string): Promise<void> {
    await cloudinary.uploader.destroy(identifier);
  }

  async fileExists(fileName: string): Promise<boolean> {
    try {
      const result = await cloudinary.api.resource(fileName);
      return !!result;
    } catch (error) {
      return false;
    }
  }
}

// Vendure Plugin Definition
@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    // Configure the AssetStorageStrategy
    config.assetOptions.assetStorageStrategy =
      new CloudinaryAssetStorageStrategy({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
        api_key: process.env.CLOUDINARY_API_KEY || "",
        api_secret: process.env.CLOUDINARY_API_SECRET || "",
      });

    // Configure the AssetPreviewStrategy
    config.assetOptions.assetPreviewStrategy = new SharpAssetPreviewStrategy({
      maxWidth: 1200,
      maxHeight: 1200,
    });

    return config;
  },
})
export class CloudinaryPlugin {}
