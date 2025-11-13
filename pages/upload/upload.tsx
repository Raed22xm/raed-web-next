"use client";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhotoSizeSelectActualOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActualOutlined";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useAuthGuard } from "@/services/protectpage";
import { useRouter } from "next/router";
const inputClasses =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60";

async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

function Upload() {

    const [userImg, setUserImg] = useState<string>("")
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [uploadError, setUploadError] = useState<string | null>(null)

    async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target?.files?.[0]
        if (!file) {
            return
        }

        setUploadError(null)
        setIsUploading(true)

        try {
            const base64 = await fileToDataUrl(file)
            const response = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file: base64,
                    options: {
                        format: outputFormat?.toLowerCase(),
                    },
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result?.error ?? "Upload failed")
            }

            setUserImg(result.secure_url)
        } catch (error) {
            console.error("Upload failed", error)
            setUploadError(
                error instanceof Error ? error.message : "Unexpected error"
            )
        } finally {
            setIsUploading(false)
            e.target.value = ""
        }
    }
    
    const [width, setWidth  ] = useState<string>("")
    
    const [height,setHeight] = useState<string>("")

    const [aspect, setAspect] = useState<boolean>(false)

    const [presetSizes,setPresetSizes] = useState<string>("")

    const [outputFormat,setOutputFormat] = useState<string>("JPG")

    const [quality, setQuality]= useState<number>(85)
    
    function handleResize(){
        let userPrefrence = {
            width , height , aspect , presetSizes , outputFormat , quality
        }
        console.log(userPrefrence)
    }

    const ready = useAuthGuard()
    if(!ready) {
        return null
    }
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-white to-blue-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Resize Your Images
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Upload your images and customize dimensions, format, and quality settings
                        for perfect results.
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
                            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                                Drag & Drop Images
                            </h2>
                            <p className="text-slate-500 mb-6">
                                or <label htmlFor="file-input" className="text-indigo-600 font-semibold hover:text-indigo-700 underline cursor-pointer">browse files</label>
                            </p>

                            {/* previewimage */}

                            {uploadError && (
                                <p className="text-sm text-red-600">{uploadError}</p>
                            )}
                            {isUploading && (
                                <p className="text-sm text-indigo-600">Uploading...</p>
                            )}

                            <div className="flex flex-wrap justify-center gap-4 mt-4">
                                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                    JPG
                                </span>
                                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                    PNG
                                </span>
                                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                    WebP
                                </span>
                                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                    GIF
                                </span>
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
                                <img
                                    src={userImg}
                                    alt="Preview"
                                    className="w-full h-auto max-h-[400px] object-contain"
                                />
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
                                <input onChange={(e)=> { setWidth(e.target.value)}}
                                
                                    type="number"
                                    placeholder="1920"
                                    className={inputClasses}
                                />
                            </label>

                            {/* Height */}
                            <label className="block">
                                <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <PhotoSizeSelectActualOutlinedIcon className="text-slate-500" fontSize="small" />
                                    Height (px)
                                </span>
                                <input onChange={(e)=> {setHeight(e.target.value)}}
                                    type="number"
                                    placeholder="1080"
                                    className={inputClasses}
                                />
                            </label>
                        </div>

                        {/* Aspect Ratio Lock */}
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                            <input  onChange={(e)=> {setAspect(e.target.checked)}}
                                type="checkbox"
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <LockOutlinedIcon className="text-slate-500" fontSize="small" />
                            <span className="text-sm font-medium text-slate-700">
                                Maintain Aspect Ratio
                            </span>
                        </div>

                        {/* Preset Sizes */}
                        <div>
                            <label className="block mb-3">
                                <span className="text-sm font-medium text-slate-700">Preset Sizes</span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <button onClick={()=>{setPresetSizes("1920x1080")}}
                                    type="button"
                                    className="px-4 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                    style={presetSizes === "1920x1080" ? { borderColor: "indigo" } : undefined}
                                >
                                    1920x1080
                                </button>
                                <button onClick={()=>{setPresetSizes("1280x720")}}
                                    type="button"
                                    className="px-4 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                    style={presetSizes === "1280x720" ? { borderColor: "indigo" } : undefined}
                                >
                                    1280x720
                                </button>
                                <button onClick={()=>{setPresetSizes("1080x1080")}}
                                    type="button"
                                    className="px-4 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                    style={presetSizes === "1080x1080" ? { borderColor: "indigo" } : undefined}
                                >
                                    1080x1080
                                </button>
                                <button onClick={()=>{setPresetSizes("800x600")}}
                                    type="button"
                                    className="px-4 py-2 rounded-lg border-2 border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                    style={presetSizes === "800x600" ? { borderColor: "indigo" } : undefined}
                                >
                                    800x600
                                </button>
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
                                    <button onClick={()=>{setOutputFormat("JPG")}}
                                        type="button"
                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                            outputFormat === "JPG" 
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-700" 
                                                : "border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                                        }`}
                                    >
                                        JPG
                                    </button>
                                    <button onClick={()=>{setOutputFormat("PNG")}}
                                        type="button"
                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                            outputFormat === "PNG" 
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-700" 
                                                : "border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                                        }`}
                                    >
                                        PNG
                                    </button>
                                    <button onClick={()=>{setOutputFormat("WebP")}}
                                        type="button"
                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                            outputFormat === "WebP" 
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-700" 
                                                : "border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                                        }`}
                                    >
                                        WebP
                                    </button>
                                    <button onClick={()=>{setOutputFormat("Original")}}
                                        type="button"
                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                            outputFormat === "Original" 
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-700" 
                                                : "border-slate-200 bg-white text-slate-700 hover:border-indigo-500 hover:bg-indigo-50"
                                        }`}
                                    >
                                        Original
                                    </button>
                                </div>
                            </div>

                            {/* Quality Slider */}
                            <div>
                                <label className="block mb-3">
                                    <span className="text-sm font-medium text-slate-700">Quality: {quality}%</span>
                                </label>
                                <input 
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={quality}
                                    onChange={(e)=> setQuality(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>Low</span>
                                    <span>High</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-10">
                        <button
                            type="button"
                            className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-slate-800"
                            onClick={handleResize}
                        >
                            Resize Images
                        </button>
                        <button
                            type="button"
                            className="flex-1 rounded-xl bg-white border-2 border-slate-300 py-3 text-sm font-semibold text-slate-900 shadow transition-colors duration-200 hover:bg-slate-50"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                {/* Image Info Section */}
                <div className="mt-12 bg-white/60 backdrop-blur rounded-2xl shadow-lg p-8 border border-slate-200">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <ImageOutlinedIcon className="text-indigo-600 mx-auto mb-3" fontSize="large" />
                            <h3 className="font-semibold text-slate-900 mb-2">Format Support</h3>
                            <p className="text-sm text-slate-600">JPG, PNG, WebP, GIF</p>
                        </div>
                        <div className="text-center">
                            <AspectRatioOutlinedIcon className="text-indigo-600 mx-auto mb-3" fontSize="large" />
                            <h3 className="font-semibold text-slate-900 mb-2">Smart Resizing</h3>
                            <p className="text-sm text-slate-600">Maintain aspect ratios</p>
                        </div>
                        <div className="text-center">
                            <PhotoSizeSelectActualOutlinedIcon className="text-indigo-600 mx-auto mb-3" fontSize="large" />
                            <h3 className="font-semibold text-slate-900 mb-2">High Quality</h3>
                            <p className="text-sm text-slate-600">Preserve image quality</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Upload;

