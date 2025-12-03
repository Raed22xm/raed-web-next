import type { NextApiRequest, NextApiResponse } from "next";
import { uploadBufferToCloudinary } from "@/services/cloudinary/upload";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb",
        },
    },
};

function dataUriToBuffer(dataUri: string): Buffer {
    const matches = dataUri.match(/^data:(?<mime>.+);base64,(?<data>.+)$/);
    const base64 = matches?.groups?.data;

    if (!base64) {
        throw new Error("Invalid base64 payload");
    }

    return Buffer.from(base64, "base64");
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        res.status(405).json({ error: "Method Not Allowed" });
        return;
    }

    try {
        const { file, options } = req.body ?? {};

        if (typeof file !== "string") {
            res.status(400).json({ error: "Missing file payload" });
            return;
        }

        const buffer = dataUriToBuffer(file);
        const result = await uploadBufferToCloudinary(buffer, options);

        res.status(200).json(result);
    } catch (error) {
        console.error("Cloudinary upload failed:", {
            message: (error as { message?: string })?.message,
            name: (error as { name?: string })?.name,
            http_code: (error as { http_code?: number })?.http_code,
        });

        const message =
            (error as { message?: string })?.message ??
            "Failed to upload image";

        res.status(500).json({ error: message });
    }
}
