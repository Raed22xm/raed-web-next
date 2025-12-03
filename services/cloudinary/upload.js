import { v2 as cloudinary } from "cloudinary";

function getEnvVar(name) {
    const value = process.env[name];
    if (!value || !value.trim()) {
        throw new Error(`Missing required Cloudinary env: ${name}`);
    }
    return value.trim();
}

const cloudinaryConfig = {
    cloud_name: getEnvVar("CLOUDINARY_CLOUD_NAME"),
    api_key: getEnvVar("CLOUDINARY_API_KEY"),
    api_secret: getEnvVar("CLOUDINARY_API_SECRET"),
    secure: true,
};

cloudinary.config(cloudinaryConfig);

export function uploadBufferToCloudinary(buffer, options = {}) {
    if (!Buffer.isBuffer(buffer)) {
        throw new Error("uploadBufferToCloudinary expects a Buffer.");
    }

    const sanitizedOptions = {};
    if (options?.format) {
        sanitizedOptions.format = String(options.format).toLowerCase();
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "images-for-resize",
                resource_type: "image",
                ...sanitizedOptions,
            },
            (error, result) => {
                if (error) {
                    reject(
                        new Error(
                            `Cloudinary upload failed (${error.http_code ?? "unknown"}): ${error.message ?? "Unknown error"}`
                        )
                    );
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(buffer);
    });
}
