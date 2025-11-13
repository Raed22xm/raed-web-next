"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AspectRatioOutlinedIcon from "@mui/icons-material/AspectRatioOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import { useAuthGuard } from "@/services/protectpage/index";
import { useRouter } from "next/router";
type ResizeStatus = "Ready" | "Processing" | "Failed";

interface ResizeItem {
    id: string;
    fileName: string;
    originalDimensions: string;
    targetDimensions: string;
    outputFormat: string;
    createdAt: string;
    sizeBefore: string;
    sizeAfter: string;
    status: ResizeStatus;
    notes?: string;
    tags?: string[];
}

const mockResizes: ResizeItem[] = [
    {
        id: "RSZ-001",
        fileName: "marketing-hero.png",
        originalDimensions: "2400 × 1600",
        targetDimensions: "1200 × 800",
        outputFormat: "JPG",
        createdAt: "Nov 10, 2025 • 14:32",
        sizeBefore: "3.2 MB",
        sizeAfter: "1.1 MB",
        status: "Ready",
        notes: "Homepage hero for Q4 campaign",
        tags: ["Web", "Hero"],
    },
    {
        id: "RSZ-002",
        fileName: "product-shot.webp",
        originalDimensions: "1600 × 1600",
        targetDimensions: "1080 × 1080",
        outputFormat: "PNG",
        createdAt: "Nov 09, 2025 • 09:18",
        sizeBefore: "2.1 MB",
        sizeAfter: "820 KB",
        status: "Processing",
        notes: "Square crop for marketplace listing",
        tags: ["Catalog"],
    },
    {
        id: "RSZ-003",
        fileName: "event-poster.jpg",
        originalDimensions: "4096 × 2730",
        targetDimensions: "1920 × 1080",
        outputFormat: "WebP",
        createdAt: "Nov 08, 2025 • 20:44",
        sizeBefore: "5.6 MB",
        sizeAfter: "1.4 MB",
        status: "Ready",
        tags: ["Events", "Social"],
    },
    {
        id: "RSZ-004",
        fileName: "team-portrait.png",
        originalDimensions: "3200 × 2133",
        targetDimensions: "1280 × 720",
        outputFormat: "JPG",
        createdAt: "Nov 05, 2025 • 11:07",
        sizeBefore: "4.4 MB",
        sizeAfter: "980 KB",
        status: "Failed",
        notes: "Retry with lighter compression",
    },
];

function statusStyles(status: ResizeStatus) {
    switch (status) {
        case "Ready":
            return "bg-emerald-100 text-emerald-700 border-emerald-200";
        case "Processing":
            return "bg-amber-100 text-amber-700 border-amber-200";
        case "Failed":
            return "bg-rose-100 text-rose-700 border-rose-200";
        default:
            return "bg-slate-100 text-slate-600 border-slate-200";
    }
}

function DashboardPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<ResizeStatus | "All">("All");
    const [selectedResizeId, setSelectedResizeId] = useState<string>(mockResizes[0]?.id ?? "");
    const router = useRouter();
    const filteredResizes = useMemo(() => {
        return mockResizes.filter((item) => {
            const matchesSearch =
                item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, selectedStatus]);

    const activeResize = useMemo(
        () => mockResizes.find((item) => item.id === selectedResizeId),
        [selectedResizeId]
    );

    const ready = useAuthGuard();
    if(!ready) {
        // router.push("/auth");
        return null
    }

    // i made some pages proected 
    // like dashboard page measn if user is not logged in then user will be redirected to login 
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <DashboardOutlinedIcon className="text-indigo-600" fontSize="large" />
                            <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            Review your recent resizes, inspect details, and manage unwanted jobs.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
                            onClick={() => {
                                console.info("[Dashboard] Trigger new resize");
                            }}
                        >
                            New Resize
                        </button>
                        <button
                            type="button"
                            className="rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                            onClick={() => {
                                console.info("[Dashboard] Navigate to upload flow");
                            }}
                        >
                            Go to Uploads
                        </button>
                    </div>
                </header>

                <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="relative w-full sm:max-w-xs">
                                <SearchOutlinedIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    type="search"
                                    placeholder="Search by file name or job ID"
                                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                            </div>
                            <div className="flex gap-2">
                                {["All", "Ready", "Processing", "Failed"].map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                            selectedStatus === status
                                                ? "bg-indigo-600 text-white shadow"
                                                : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                                        }`}
                                        onClick={() => setSelectedStatus(status as ResizeStatus | "All")}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            {filteredResizes.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
                                    <p className="text-sm font-medium text-slate-600">No resizes found</p>
                                    <p className="mt-2 text-sm text-slate-400">
                                        Try adjusting your filters or search for another file name.
                                    </p>
                                </div>
                            ) : (
                                filteredResizes.map((resize) => {
                                    const isActive = resize.id === selectedResizeId;
                                    return (
                                        <button
                                            key={resize.id}
                                            type="button"
                                            className={`w-full rounded-2xl border bg-white px-5 py-4 text-left transition ${
                                                isActive
                                                    ? "border-indigo-300 shadow-lg shadow-indigo-100"
                                                    : "border-slate-200 hover:border-indigo-200 hover:shadow-md"
                                            }`}
                                            onClick={() => {
                                                setSelectedResizeId(resize.id);
                                                console.info("[Dashboard] Selected resize", resize.id);
                                            }}
                                        >
                                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <ImageOutlinedIcon className="text-indigo-500" />
                                                        <p className="text-base font-semibold text-slate-900">
                                                            {resize.fileName}
                                                        </p>
                                                    </div>
                                                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                        {resize.id}
                                                    </p>
                                                </div>
                                                <div className="grid gap-4 text-sm text-slate-600 md:grid-cols-3">
                                                    <div>
                                                        <span className="block text-xs uppercase text-slate-400">
                                                            Created
                                                        </span>
                                                        <span>{resize.createdAt}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs uppercase text-slate-400">
                                                            Target
                                                        </span>
                                                        <span>{resize.targetDimensions}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs uppercase text-slate-400">
                                                            Format
                                                        </span>
                                                        <span>{resize.outputFormat}</span>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles(
                                                        resize.status
                                                    )}`}
                                                >
                                                    {resize.status}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-xl">
                        {activeResize ? (
                            <div className="flex h-full flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wide text-indigo-400">
                                            Selected Job
                                        </p>
                                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                                            {activeResize.fileName}
                                        </h2>
                                    </div>
                                    <span
                                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles(
                                            activeResize.status
                                        )}`}
                                    >
                                        {activeResize.status}
                                    </span>
                                </div>

                                <div className="mt-6 grid gap-4">
                                    <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 p-6">
                                        <div className="flex items-center justify-center">
                                            <div className="h-40 w-full max-w-sm rounded-2xl bg-gradient-to-br from-indigo-200 via-white to-indigo-100 shadow-inner" />
                                        </div>
                                        <p className="mt-4 text-center text-xs text-slate-500">
                                            Preview placeholder — actual preview will appear once linked.
                                        </p>
                                    </div>

                                    <dl className="grid grid-cols-1 gap-4 text-sm text-slate-600 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <CalendarMonthOutlinedIcon fontSize="small" />
                                                <dt>Created</dt>
                                            </div>
                                            <dd className="mt-1 text-sm font-semibold text-slate-900">
                                                {activeResize.createdAt}
                                            </dd>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <AspectRatioOutlinedIcon fontSize="small" />
                                                <dt>Dimensions</dt>
                                            </div>
                                            <dd className="mt-1 text-sm font-semibold text-slate-900">
                                                {activeResize.originalDimensions} → {activeResize.targetDimensions}
                                            </dd>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <StorageOutlinedIcon fontSize="small" />
                                                <dt>Size</dt>
                                            </div>
                                            <dd className="mt-1 text-sm font-semibold text-slate-900">
                                                {activeResize.sizeBefore} → {activeResize.sizeAfter}
                                            </dd>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <ImageOutlinedIcon fontSize="small" />
                                                <dt>Output</dt>
                                            </div>
                                            <dd className="mt-1 text-sm font-semibold text-slate-900">
                                                {activeResize.outputFormat}
                                            </dd>
                                        </div>
                                    </dl>

                                    {activeResize.tags && activeResize.tags.length > 0 && (
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Tags
                                            </p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {activeResize.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeResize.notes && (
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                Notes
                                            </p>
                                            <p className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                                                {activeResize.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row sm:justify-between">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
                                        onClick={() => {
                                            console.info("[Dashboard] Open resize details", activeResize.id);
                                        }}
                                    >
                                        <OpenInNewOutlinedIcon fontSize="small" />
                                        Open Resize
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                                        onClick={() => {
                                            console.warn("[Dashboard] Delete resize requested", activeResize.id);
                                        }}
                                    >
                                        <DeleteOutlineOutlinedIcon fontSize="small" />
                                        Delete Resize
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                                <ImageOutlinedIcon className="mb-4 text-slate-300" fontSize="large" />
                                <p className="text-sm font-medium">Select a resize job to see its details.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default DashboardPage;

