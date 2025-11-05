import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: "dfauzcowk",
  api_key: "338558173474455",
  api_secret: "geInigXvsng0pnFxXh2mr7QdCPo",
});


export const subirArchivoCloudinary = async (buffer, nombreArchivo) => {
  try {
    const resultado = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "arbitros", public_id: nombreArchivo },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      uploadStream.end(buffer);
    });
    return resultado.secure_url;
  } catch (error) {
    throw error;
  }
};
