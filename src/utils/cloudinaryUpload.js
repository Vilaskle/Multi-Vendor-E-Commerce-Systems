import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,          // example: vendors/documents
        resource_type: "auto",   // 🔥 VERY IMPORTANT (allows PDF)
      },
      (error, result) => {
        if (error) {
          console.error("CLOUDINARY UPLOAD ERROR:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    // Convert buffer → stream (needed for memoryStorage)
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
