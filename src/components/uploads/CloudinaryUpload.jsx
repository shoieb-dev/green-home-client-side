import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

const CloudinaryUpload = ({ onUploadSuccess, isEditMode, existingImages, error }) => {
    const [images, setImages] = useState([]); // {file, url, status, progress, error}

    // Load existing images in edit mode
    useEffect(() => {
        if (isEditMode && existingImages?.length > 0) {
            const preloaded = existingImages.map((url) => ({
                file: null,
                url,
                status: "uploaded",
                progress: 100,
                error: null,
            }));
            setImages(preloaded);
        }
    }, [isEditMode, existingImages]);

    // Upload a single file
    const uploadFile = async (fileObj) => {
        const toastId = toast.loading(`Uploading ${fileObj.file.name}...`);

        const formData = new FormData();
        formData.append("file", fileObj.file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData,
                {
                    onUploadProgress: (event) => {
                        const progress = Math.round((event.loaded * 100) / event.total);
                        setImages((prev) =>
                            prev.map((img) => (img.file === fileObj.file ? { ...img, progress } : img))
                        );
                    },
                }
            );

            const url = res.data.secure_url;
            setImages((prev) => {
                const updated = prev.map((img) =>
                    img.file === fileObj.file ? { ...img, url, status: "uploaded", error: null, progress: 100 } : img
                );
                // return uploaded urls to parent
                const uploadedUrls = updated.filter((i) => i.status === "uploaded").map((i) => i.url);
                onUploadSuccess && onUploadSuccess(uploadedUrls);
                return updated;
            });
            toast.success(`${fileObj.file.name} uploaded successfully 🎉`, {
                id: toastId,
            });
        } catch (err) {
            setImages((prev) =>
                prev.map((img) => (img.file === fileObj.file ? { ...img, status: "error", error: err.message } : img))
            );
            toast.error(`❌ Failed to upload ${fileObj.file.name}`, { id: toastId });
        }
    };

    // Handle dropped files
    const onDrop = (acceptedFiles) => {
        const newImages = acceptedFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file), // instant preview
            status: "uploading",
            progress: 0,
            error: null,
        }));

        setImages((prev) => [...prev, ...newImages]);
        newImages.forEach(uploadFile);
    };

    // Retry upload
    const retryUpload = (img) => {
        const freshImg = { ...img, status: "uploading", error: null, progress: 0 };
        setImages((prev) => prev.map((i) => (i.file === img.file ? freshImg : i)));
        uploadFile(freshImg);
    };

    // Remove image
    const removeImage = (img) => {
        setImages((prev) => prev.filter((i) => i !== img));
        const uploadedUrls = images.filter((i) => i !== img && i.status === "uploaded").map((i) => i.url);
        onUploadSuccess && onUploadSuccess(uploadedUrls);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
        accept: { "image/*": [] },
    });

    return (
        <div
            className={`border-2 rounded-xl p-6 text-center transition-colors duration-200 border-dashed ${
                error ? "border-red-500" : "border-gray-300"
            }`}
        >
            {/* Drop area */}
            <div {...getRootProps()} className="cursor-pointer bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition">
                <input {...getInputProps()} />
                <p className="text-gray-600">
                    Drag & drop images here, or <span className="text-green-600 font-bold">click to upload</span>
                </p>
            </div>

            {/* Image Grid with Drag-and-Drop */}
            <DragDropContext
                onDragEnd={(result) => {
                    if (!result.destination) return;
                    const reordered = Array.from(images);
                    const [removed] = reordered.splice(result.source.index, 1);
                    reordered.splice(result.destination.index, 0, removed);
                    setImages(reordered);
                    const uploadedUrls = reordered.filter((i) => i.status === "uploaded").map((i) => i.url);
                    onUploadSuccess && onUploadSuccess(uploadedUrls);
                }}
            >
                <Droppable droppableId="images" direction="horizontal">
                    {(provided) => (
                        <div
                            className={`mt-${images.length > 0 ? 4 : 0} grid grid-cols-3 gap-3`}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {images.map((img, index) => (
                                <Draggable
                                    key={img.url || img.file.name}
                                    draggableId={img.url || img.file.name}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="relative border rounded-lg overflow-hidden w-full h-28 group"
                                        >
                                            {/* Image / Placeholder */}
                                            {img.url ? (
                                                <img
                                                    src={img.url}
                                                    alt="preview"
                                                    className="w-full h-full object-cover block"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">
                                                    {img.status === "uploading"
                                                        ? `Uploading... ${img.progress}%`
                                                        : img.status === "error"
                                                        ? "Failed"
                                                        : "Pending"}
                                                </div>
                                            )}

                                            {/* ❌ Remove button */}
                                            <button
                                                onClick={() => removeImage(img)}
                                                className="absolute top-2 right-2 bg-red-600 text-white rounded w-7 h-7 flex items-center justify-center text-lg font-bold opacity-5 group-hover:opacity-100 transition-opacity duration-200 z-20"
                                                title="Remove image"
                                            >
                                                ×
                                            </button>

                                            {/* Retry button */}
                                            {img.status === "error" && (
                                                <button
                                                    onClick={() => retryUpload(img)}
                                                    className="absolute inset-0 bg-black bg-opacity-40 text-white flex items-center justify-center text-sm font-semibold z-10"
                                                >
                                                    Retry
                                                </button>
                                            )}

                                            {/* Progress bar */}
                                            {img.status === "uploading" && (
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300 z-10">
                                                    <div
                                                        className="h-1 bg-green-500"
                                                        style={{ width: `${img.progress}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default CloudinaryUpload;
