"use client";
/* eslint-disable @next/next/no-img-element */
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import RotateRightOutlinedIcon from "@mui/icons-material/RotateRightOutlined";
import CropOutlinedIcon from "@mui/icons-material/CropOutlined";
import PhotoSizeSelectActualOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActualOutlined";
import type { ChangeEvent } from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuthGuard } from "@/services/protectpage";
import { createResize } from "@/services/resize/resize";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { getUserId } from "@/services/auth/storage";

const inputClasses =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const PRESET_SIZES = [
    { label: "1920x1080", width: "1920", height: "1080" },
    { label: "1280x720", width: "1280", height: "720" },
    { label: "1080x1080", width: "1080", height: "1080" },
    { label: "800x600", width: "800", height: "600" },
];

async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

function Upload() {
    const [userImg, setUserImg] = useState<string>("");
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>("");
    const [imageFormat, setImageFormat] = useState<string>("");
    const [isResizing, setIsResizing] = useState<boolean>(false);
    const [resizedImageUrl, setResizedImageUrl] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const uploadAbortController = useRef<AbortController | null>(null);
    const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    function showToast(message: string, type: "success" | "error") {
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        setToast({ message, type });
        toastTimeoutRef.current = setTimeout(() => {
            setToast(null);
        }, 4000);
    }
    const router = useRouter();

    async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target?.files?.[0];
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setUploadError("Please upload an image file (JPG, PNG, WebP, GIF)");
            e.target.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE_BYTES) {
            setUploadError("File is too large. Please select an image under 10MB");
            e.target.value = "";
            return;
        }

        // Extract image format from file
        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        setImageFormat(fileExtension);

        setUploadError(null);
        setResizedImageUrl("");
        setSuccessMessage("");
        setImageDimensions(null);
        setIsUploading(true);

        try {
            if (uploadAbortController.current) {
                uploadAbortController.current.abort();
            }
            const abortController = new AbortController();
            uploadAbortController.current = abortController;
            const base64 = await fileToDataUrl(file);
            const normalizedFormat =
                outputFormat?.toLowerCase() === "original" ? undefined : outputFormat?.toLowerCase();

            const response = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: abortController.signal,
                body: JSON.stringify({
                    file: base64,
                    options: normalizedFormat ? { format: normalizedFormat } : undefined,
                }),
            });

            const raw = await response.text();
            let result: unknown;
            try {
                result = raw ? JSON.parse(raw) : null;
            } catch {
                throw new Error(`Upload failed (non-JSON response): ${raw ? raw.slice(0, 200) : "Empty response"}`);
            }

            const parsed = (result ?? {}) as { error?: string; secure_url?: string };

            if (!response.ok) {
                throw new Error(parsed?.error ?? "Upload failed");
            }

            if (!parsed?.secure_url) {
                throw new Error("Upload failed: missing image URL");
            }

            setUserImg(parsed.secure_url);
            showToast("Image uploaded successfully", "success");
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                console.info("Upload aborted");
            } else {
                console.error("Upload failed", error);
                setUploadError(error instanceof Error ? error.message : "Unexpected error");
                showToast(error instanceof Error ? error.message : "Unexpected upload error", "error");
            }
        } finally {
            setIsUploading(false);
            e.target.value = "";
            if (uploadAbortController.current) {
                uploadAbortController.current = null;
            }
        }
    }

    function handleClearAll() {
        setUserImg("");
        setResizedImageUrl("");
        setSuccessMessage("");
        setUploadError(null);
        setImageFormat("");
        setWidth("");
        setHeight("");
        setPresetSizes("");
        setAspect(false);
        setImageDimensions(null);
        setRotate("0");
        setCropEnabled(false);
        setCropLeft("");
        setCropTop("");
        setCropWidth("");
        setCropHeight("");
        setFilter("none");
    }

    const [width, setWidth] = useState<string>("");

    const [height, setHeight] = useState<string>("");

    const [aspect, setAspect] = useState<boolean>(false);

    const [presetSizes, setPresetSizes] = useState<string>("");

    const [outputFormat, setOutputFormat] = useState<string>("JPG");

    // Rotate and Crop state
    const [rotate, setRotate] = useState<string>("0");
    const [cropEnabled, setCropEnabled] = useState<boolean>(false);
    const [cropLeft, setCropLeft] = useState<string>("");
    const [cropTop, setCropTop] = useState<string>("");
    const [cropWidth, setCropWidth] = useState<string>("");
    const [cropHeight, setCropHeight] = useState<string>("");
    const [filter, setFilter] = useState<string>("none");

    useEffect(() => {
        const id = getUserId();
        if (id) {
            setUserId(id);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!userImg) {
            setImageDimensions(null);
            return;
        }

        const img = new Image();
        img.onload = () => {
            setImageDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
        };
        img.onerror = () => setImageDimensions(null);
        img.src = userImg;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [userImg]);

    async function handleResize() {
        if (!userImg) {
            setUploadError("Please upload an image first");
            return;
        }

        if (!userId) {
            setUploadError("User not authenticated");
            return;
        }

        // Determine width and height
        let finalWidth = width;
        let finalHeight = height;

        // If preset is selected, parse width and height from preset
        if (presetSizes) {
            const [presetWidth, presetHeight] = presetSizes.split("x");
            finalWidth = presetWidth;
            finalHeight = presetHeight;
        }

        const parsedWidth = Number(finalWidth);
        const parsedHeight = Number(finalHeight);
        let finalWidthValue = Number.isFinite(parsedWidth) && parsedWidth > 0 ? parsedWidth : null;
        let finalHeightValue = Number.isFinite(parsedHeight) && parsedHeight > 0 ? parsedHeight : null;

        if (aspect && imageDimensions) {
            if (finalWidthValue && !finalHeightValue) {
                finalHeightValue = Math.round(finalWidthValue * (imageDimensions.height / imageDimensions.width));
            } else if (!finalWidthValue && finalHeightValue) {
                finalWidthValue = Math.round(finalHeightValue * (imageDimensions.width / imageDimensions.height));
            }
        }

        if (!finalWidthValue || !finalHeightValue) {
            setUploadError("Please enter valid width and height or select a preset size");
            return;
        }

        // Build crop object if enabled
        const cropData = cropEnabled && cropLeft && cropTop && cropWidth && cropHeight
            ? {
                left: parseInt(cropLeft) || 0,
                top: parseInt(cropTop) || 0,
                width: parseInt(cropWidth) || 0,
                height: parseInt(cropHeight) || 0,
            }
            : undefined;

        // Format the data according to the required structure
        const resizePayload = {
            imageLink: userImg,
            imageFormat: imageFormat || "jpg",
            manageAspectRatio: aspect,
            size: "custom",
            width: `${finalWidthValue}px`,
            height: `${finalHeightValue}px`,
            outputFormat: outputFormat.toLowerCase() === "original" ? imageFormat || "jpg" : outputFormat.toLowerCase(),
            userId: userId,
            rotate: rotate !== "0" ? parseInt(rotate) : undefined,
            crop: cropData,
            filter: filter !== "none" ? filter : undefined,
        };

        setIsResizing(true);
        setUploadError(null);

        try {
            const response = await createResize(resizePayload);
            console.log("Resize successful:", response.data);

            // Handle success response
            if (response.data?.success && response.data?.resizedImageUrl) {
                setResizedImageUrl(response.data.resizedImageUrl);
                setSuccessMessage(response.data.message || "Image resized and uploaded successfully");
                setUploadError(null);
                showToast(response.data.message || "Image resized successfully", "success");
                // Scroll to the resized image section
                setTimeout(() => {
                    const element = document.getElementById("resized-image-section");
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                }, 100);
            } else {
                setUploadError("Resize completed but no image URL received");
                showToast("Resize completed but no image URL received", "error");
            }
        } catch (error: unknown) {
            console.error("Resize failed", error);
            const message =
                (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
                (error as { message?: string })?.message ||
                "Failed to resize image. Please try again.";
            setUploadError(message);
            showToast(message, "error");
            setResizedImageUrl("");
            setSuccessMessage("");
        } finally {
            setIsResizing(false);
        }
    }

    const ready = useAuthGuard();
    if (!ready) {
        return null;
    }
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-white to-blue-50">
            <Navbar />
            {toast && (
                <div className="fixed top-6 right-6 z-50">
                    <div
                        className={`rounded-2xl px-4 py-3 shadow-lg text-sm font-semibold text-white transition ${toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                    >
                        {toast.message}
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Resize Your Images</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Upload your images and customize dimensions and format settings for perfect results.
                    </p>
                </div>

                {/* Upload Area Card */}
                <div className="bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-8 md:p-12">
                    {/* Drag and Drop Zone */}
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-slate-50/50 hover:border-slate-400 transition-all duration-200">
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg mb-6">
                                <CloudUploadOutlinedIcon className="text-white" sx={{ fontSize: 40 }} />
                            </div>
                            <input type="file" accept="image/*" id="file-input" className="hidden" onChange={handleFileChange} />
                            <h2 className="text-2xl font-semibold text-slate-900 mb-3">Drag & Drop Images</h2>
                            <p className="text-slate-500 mb-6">
                                or{" "}
                                <label htmlFor="file-input" className="text-indigo-600 font-semibold hover:text-indigo-700 underline cursor-pointer">
                                    browse files
                                </label>
                            </p>

                            {/* previewimage */}

                            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                            {isUploading && (
                                <div className="w-full max-w-md mx-auto">
                                    <p className="text-sm text-indigo-600 mb-3 text-center flex items-center justify-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                                        Uploading image…
                                    </p>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                        <div className="h-full w-full animate-pulse bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-400" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (uploadAbortController.current) {
                                                uploadAbortController.current.abort();
                                            }
                                        }}
                                        className="mt-3 text-xs font-semibold text-rose-600 hover:text-rose-500 underline"
                                    >
                                        Cancel upload
                                    </button>
                                </div>
                            )}

                            <div className="flex flex-wrap justify-center gap-4 mt-4">
                                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">JPG</span>
                                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">PNG</span>
                                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">WebP</span>
                                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">GIF</span>
                            </div>
                        </div>
                    </div>

                    {userImg && (
                        <div className="mt-8 bg-slate-50 rounded-2xl p-6 border-2 border-slate-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                    <ImageOutlinedIcon className="text-indigo-600" fontSize="small" />
                                    Image Preview
                                </h3>
                            </div>
                            <div className="relative rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200">
                                <img src={userImg} alt="Preview" className="w-full h-auto max-h-[400px] object-contain" />
                            </div>
                        </div>
                    )}

                    {/* Resizing Options Section */}
                    <div className="mt-10 space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <AspectRatioOutlinedIcon className="text-indigo-600" />
                            <h2 className="text-2xl font-semibold text-slate-900">Resize Options</h2>
                        </div>

                        {/* Dimensions */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Width */}
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <PhotoSizeSelectActualOutlinedIcon className="text-slate-500" fontSize="small" />
                                    Width (px)
                                </span>
                                <input
                                    onChange={(e) => {
                                        setWidth(e.target.value);
                                        setPresetSizes(""); // Clear preset when manually entering
                                    }}
                                    type="number"
                                    placeholder="1920"
                                    value={width}
                                    className={inputClasses}
                                />
                            </label>

                            {/* Height */}
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <PhotoSizeSelectActualOutlinedIcon className="text-slate-500" fontSize="small" />
                                    Height (px)
                                </span>
                                <input
                                    onChange={(e) => {
                                        setHeight(e.target.value);
                                        setPresetSizes(""); // Clear preset when manually entering
                                    }}
                                    type="number"
                                    placeholder="1080"
                                    value={height}
                                    className={inputClasses}
                                />
                            </label>
                        </div>

                        {/* Aspect Ratio Lock */}
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <input
                                onChange={(e) => {
                                    setAspect(e.target.checked);
                                }}
                                type="checkbox"
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <LockOutlinedIcon className="text-slate-500" fontSize="small" />
                            <span className="text-sm font-medium text-slate-700">Maintain Aspect Ratio</span>
                        </div>

                        {/* Preset Sizes */}
                        <div>
                            <label className="block mb-3">
                                <span className="text-sm font-medium text-slate-700">Preset Sizes</span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {PRESET_SIZES.map((preset) => {
                                    const isActive = presetSizes === preset.label;
                                    return (
                                        <button
                                            key={preset.label}
                                            onClick={() => {
                                                setPresetSizes(preset.label);
                                                setWidth(preset.width);
                                                setHeight(preset.height);
                                            }}
                                            type="button"
                                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${isActive
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                                : "border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                                                }`}
                                        >
                                            {preset.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-8"></div>

                        {/* Output Settings */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-slate-900">Output Settings</h3>

                            {/* Format Selection */}
                            <div>
                                <label className="block mb-3">
                                    <span className="text-sm font-medium text-slate-700">Output Format</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <button
                                        onClick={() => {
                                            setOutputFormat("JPG");
                                        }}
                                        type="button"
                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${outputFormat === "JPG"
                                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                                            }`}
                                    >
                                        JPG
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOutputFormat("PNG");
                                        }}
                                        type="button"
                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${outputFormat === "PNG"
                                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                                            }`}
                                    >
                                        PNG
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOutputFormat("WebP");
                                        }}
                                        type="button"
                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${outputFormat === "WebP"
                                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                                            }`}
                                    >
                                        WebP
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOutputFormat("Original");
                                        }}
                                        type="button"
                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${outputFormat === "Original"
                                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                                            }`}
                                    >
                                        Original
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Rotate Options */}
                        <div className="border-t border-slate-200 pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <RotateRightOutlinedIcon className="text-indigo-600" />
                                <h3 className="text-xl font-semibold text-slate-900">Rotate Image</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {["0", "90", "180", "270"].map((deg) => (
                                    <button
                                        key={deg}
                                        onClick={() => setRotate(deg)}
                                        type="button"
                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${rotate === deg
                                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                                            }`}
                                    >
                                        {deg}°
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Crop Options */}
                        <div className="border-t border-slate-200 pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <CropOutlinedIcon className="text-indigo-600" />
                                <h3 className="text-xl font-semibold text-slate-900">Crop Image</h3>
                                <label className="ml-auto flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={cropEnabled}
                                        onChange={(e) => setCropEnabled(e.target.checked)}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-medium text-slate-600">Enable Crop</span>
                                </label>
                            </div>
                            {cropEnabled && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700">Left (px)</span>
                                        <input
                                            type="number"
                                            value={cropLeft}
                                            onChange={(e) => setCropLeft(e.target.value)}
                                            placeholder="0"
                                            className={inputClasses}
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700">Top (px)</span>
                                        <input
                                            type="number"
                                            value={cropTop}
                                            onChange={(e) => setCropTop(e.target.value)}
                                            placeholder="0"
                                            className={inputClasses}
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700">Width (px)</span>
                                        <input
                                            type="number"
                                            value={cropWidth}
                                            onChange={(e) => setCropWidth(e.target.value)}
                                            placeholder="200"
                                            className={inputClasses}
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-sm font-medium text-slate-700">Height (px)</span>
                                        <input
                                            type="number"
                                            value={cropHeight}
                                            onChange={(e) => setCropHeight(e.target.value)}
                                            placeholder="200"
                                            className={inputClasses}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Filter Options */}
                        <div className="border-t border-slate-200 pt-6">
                            <div className="flex items-center gap-3 mb-4">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                                <h3 className="text-xl font-semibold text-slate-900">Filter Effect</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {["none", "grayscale", "blur", "sharpen", "negate"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        type="button"
                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors capitalize ${filter === f
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                                : "border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                                            }`}
                                    >
                                        {f === "none" ? "No Filter" : f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-10">
                        <button
                            type="button"
                            className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleResize}
                            disabled={isResizing || isUploading}
                        >
                            {isResizing ? "Resizing..." : "Resize Images"}
                        </button>
                        <button
                            type="button"
                            className="flex-1 rounded-xl bg-white border-2 border-slate-300 py-3 text-sm font-semibold text-slate-900 shadow transition-colors duration-200 hover:bg-slate-50"
                            onClick={handleClearAll}
                            disabled={isUploading || isResizing}
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                {/* Usage Rules & Limits Section */}
                <div className="mt-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-lg p-8 border border-indigo-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Usage Rules & Limits</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Left Column */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <LockOutlinedIcon className="text-green-600" sx={{ fontSize: 18 }} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-sm">Authentication</h4>
                                    <p className="text-xs text-slate-500">Must be logged in to resize images</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-amber-200 bg-amber-50/50">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-amber-800 text-sm">Rate Limiting</h4>
                                    <p className="text-xs text-amber-700">Maximum <strong>5 transformations</strong> per day per user</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-sm">File Validation</h4>
                                    <p className="text-xs text-slate-500">Max file size: <strong>3MB</strong> | Max dimensions: <strong>2000px</strong></p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <ImageOutlinedIcon className="text-purple-600" sx={{ fontSize: 18 }} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-sm">Supported Formats</h4>
                                    <p className="text-xs text-slate-500">JPG, PNG, WebP, GIF</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
                                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    <AspectRatioOutlinedIcon className="text-indigo-600" sx={{ fontSize: 18 }} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-sm">Features</h4>
                                    <p className="text-xs text-slate-500">Resize, Crop, Rotate, Format Conversion</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <PhotoSizeSelectActualOutlinedIcon className="text-emerald-600" sx={{ fontSize: 18 }} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-sm">Preset Sizes</h4>
                                    <p className="text-xs text-slate-500">1920×1080, 1280×720, 1080×1080, 800×600</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resized Image Section */}
                {resizedImageUrl && (
                    <div id="resized-image-section" className="mt-12 bg-white/80 backdrop-blur rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-indigo-200">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                                    <ImageOutlinedIcon className="text-white" sx={{ fontSize: 28 }} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Resized Image Ready!</h2>
                                    {successMessage && <p className="text-sm text-green-600 font-medium mt-1">{successMessage}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200 mb-6">
                            <div className="relative rounded-xl overflow-hidden bg-white shadow-lg border border-slate-200">
                                <img src={resizedImageUrl} alt="Resized Image" className="w-full h-auto max-h-[500px] object-contain" />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    // Download the image
                                    const link = document.createElement("a");
                                    link.href = resizedImageUrl;
                                    link.download = `resized-image-${Date.now()}.${imageFormat || "png"}`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-indigo-700"
                            >
                                <DownloadOutlinedIcon fontSize="small" />
                                Download Image
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    router.push("/dashboard");
                                }}
                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-indigo-600 py-3 text-sm font-semibold text-indigo-600 shadow transition-colors duration-200 hover:bg-indigo-50"
                            >
                                <DashboardOutlinedIcon fontSize="small" />
                                Visit Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Upload;
