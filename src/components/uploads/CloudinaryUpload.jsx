import { useEffect, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const CloudinaryUpload = ({ onUploadSuccess, isEditMode, existingImages }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState({});
    const [uploadedUrls, setUploadedUrls] = useState([]);

    useEffect(() => {
        if (isEditMode && existingImages && existingImages.length > 0) {
            setUploadedUrls(existingImages);
        }
    }, [isEditMode, existingImages]);

    const onDrop = async (acceptedFiles) => {
        setUploading(true);

        for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
            formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

            try {
                const res = await axios.post(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    formData,
                    {
                        onUploadProgress: (event) => {
                            setProgress((prev) => ({
                                ...prev,
                                [file.name]: Math.round((event.loaded * 100) / event.total),
                            }));
                        },
                    }
                );

                const url = res.data.secure_url;
                setUploadedUrls((prev) => [...prev, url]);

                // return the entire array of URLs to parent
                if (onUploadSuccess) {
                    onUploadSuccess([...uploadedUrls, url]);
                }
            } catch (error) {
                console.error("Upload error:", error);
            }
        }

        setUploading(false);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: true,
        accept: { "image/*": [] },
    });

    return (
        <div className="border-2 border-dashed p-6 rounded-xl bg-gray-50 text-center">
            <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />
                <p className="text-gray-600">
                    Drag & drop images here, or <span className="text-green-600 font-bold">click to upload</span>
                </p>
            </div>

            {/* Progress Bars */}
            {Object.keys(progress).map((file) => (
                <div key={file} className="mt-2">
                    <p className="text-sm">{file}</p>
                    <div className="w-full bg-gray-200 rounded h-2">
                        <div className="bg-green-500 h-2 rounded" style={{ width: `${progress[file]}%` }}></div>
                    </div>
                </div>
            ))}

            {/* Preview Uploaded */}
            {uploadedUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {uploadedUrls.map((url, i) => (
                        <img key={i} src={url} alt="uploaded" className="w-full h-24 object-cover rounded-lg" />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CloudinaryUpload;
