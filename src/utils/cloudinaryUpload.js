// import cloudinary from "../config/cloudinary.js";

// export const uploadToCloudinary = async (buffer, folder) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           folder,
//           resource_type: "image",
//         },
//         (error, result) => {
//           if (error){
//             console.error("CLOUDINARY ERROR:", error);
//             return reject(error);
//           } 
//           resolve(result);
//         }
//       )
//       .end(buffer);
//   });
// };

import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,                // vendors/<vendorId>/products
          resource_type: "image" // signed upload (backend)
        },
        (error, result) => {
          if (error) {
            console.error("CLOUDINARY UPLOAD ERROR:", error);
            return reject(error);
          }
          resolve(result);
        }
      )
      .end(buffer);
  });
};
