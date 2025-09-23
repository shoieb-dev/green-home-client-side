import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { getFirebaseErrorMessage } from "../../../utils/firebaseErrors";

const ChangePasswordModal = ({ show, onClose }) => {
    const auth = getAuth();
    const user = auth.currentUser;

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid, isSubmitting },
        reset,
    } = useForm({ mode: "onChange" });

    const password = watch("password");

    const onSubmit = async (data) => {
        if (!user) return toast.error("No user is logged in");

        setLoading(true);
        try {
            // Re-authenticate if needed
            const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, data.newPassword);
            toast.success("Password updated successfully ✅");
            onClose();
            reset();
        } catch (err) {
            console.error(err);
            const friendlyMessage = getFirebaseErrorMessage(err.code);
            toast.error(friendlyMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-password-title"
        >
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-left">
                <h3 id="change-password-title" className="text-lg font-semibold mb-4">
                    Change Password
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* New Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                id="current-password"
                                type={showCurrentPassword ? "text" : "password"}
                                aria-invalid={errors.currentPassword ? "true" : "false"}
                                aria-describedby={errors.currentPassword ? "currentPassword-error" : undefined}
                                {...register("currentPassword", {
                                    required: "Current Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword((prev) => !prev)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                aria-label={showCurrentPassword ? "Hide currentPassword" : "Show currentPassword"}
                            >
                                {showCurrentPassword ? <IoMdEyeOff size={18} /> : <IoMdEye size={18} />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p id="currentPassword-error" className="text-red-500 text-sm">
                                {errors.currentPassword.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                aria-invalid={errors.password ? "true" : "false"}
                                aria-describedby={errors.password ? "password-error" : undefined}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <IoMdEyeOff size={18} /> : <IoMdEye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p id="password-error" className="text-red-500 text-sm">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                aria-invalid={errors.confirmPassword ? "true" : "false"}
                                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                                {...register("confirmPassword", {
                                    required: "Confirm password is required",
                                    validate: (value) => value === password || "Passwords do not match",
                                })}
                                className="w-full border border-gray-300 rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                                {showConfirmPassword ? <IoMdEyeOff size={18} /> : <IoMdEye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p id="confirmPassword-error" className="text-red-500 text-sm">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                reset();
                            }}
                            className="px-4 py-2 rounded border-2 border-gray-300 hover:shadow-lg transition hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid || isSubmitting || loading}
                            className={`px-4 py-2 rounded text-white disabled:cursor-not-allowed bg-gray-400 hover:bg-gray-600 transition ${
                                isValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {isSubmitting || loading ? "Changing..." : "Change"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
