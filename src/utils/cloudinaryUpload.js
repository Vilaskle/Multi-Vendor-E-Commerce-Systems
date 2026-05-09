import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadToCloudinary = (buffer, folder, mimeType) => {
  return new Promise((resolve, reject) => {
    const isPDF = mimeType === "application/pdf";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",

        // 🔑 Important for PDFs
        ...(isPDF && {
          format: "pdf",
          flags: "attachment", // forces browser-safe handling
        }),
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ─── Add this ─────────────────────────────────────────────────────────────────
export const deleteFromCloudinary = (public_id, resource_type = "image") => {
  return cloudinary.uploader.destroy(public_id, { resource_type });
};