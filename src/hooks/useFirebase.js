import {
    createUserWithEmailAndPassword,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { useCallback, useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import initializeFirebase from "../Pages/auth/Firebase/firebase.init";
import { API_ENDPOINTS } from "../services/api";
import { useAxiosInstance } from "./useAxiosInstance";

initializeFirebase();

/**
 * Custom hook for Firebase authentication
 * Handles user registration, login, Google sign-in, and user state management
 * @returns {Object} Authentication state and methods
 */
const useFirebase = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingUser, setIsCheckingUser] = useState(true);
    const [authError, setAuthError] = useState("");
    const [admin, setAdmin] = useState(false);
    const { axiosInstance } = useAxiosInstance();

    const auth = getAuth();

    // Memoize provider to prevent recreating on each render
    const googleProvider = useMemo(() => new GoogleAuthProvider(), []);

    /**
     * Handles Firebase authentication errors with user-friendly messages
     */
    const handleAuthError = useCallback((error) => {
        const errorMessages = {
            "auth/invalid-email": "Invalid email format. Please check and try again.",
            "auth/user-disabled": "This user account has been disabled.",
            "auth/user-not-found": "No account found with this email.",
            "auth/wrong-password": "Incorrect password. Please try again.",
            "auth/email-already-in-use": "This email is already associated with another account.",
            "auth/operation-not-allowed": "Signing in with this method is not allowed.",
            "auth/weak-password": "The password is too weak. Please choose a stronger password.",
            "auth/popup-closed-by-user":
                "Sign-in popup was closed before completing the sign-in process. Please try again.",
            "auth/cancelled-popup-request": "Multiple popup requests. Please close the popup and try again.",
            "auth/network-request-failed": "Network error. Please check your internet connection and try again.",
            "auth/internal-error": "An internal error occurred. Please try again later.",
        };

        const message = errorMessages[error.code] || error.message;
        setAuthError(message);
        toast.error(message);
    }, []);

    /**
     * Normalizes Google photo URL by removing size parameter
     * Google provides photos with =s96-c parameter that limits size
     */
    const normalizePhotoURL = useCallback((photoURL) => {
        if (!photoURL) return "";
        // Remove Google's size parameter to get full resolution
        return photoURL.replace(/=s96-c/, "");
    }, []);

    /**
     * Saves or updates user information in the database
     */
    const saveUser = useCallback(
        async (email, displayName, photoURL, method) => {
            try {
                const user = { email, displayName, photoURL };
                const response = await axiosInstance({
                    url: API_ENDPOINTS.users,
                    method,
                    data: user,
                });
                return response.data;
            } catch (error) {
                console.error("Error saving user:", error);
                toast.error(error.response?.data?.message || "Failed to save user.");
                throw error; // Re-throw to handle in calling function
            }
        },
        [axiosInstance]
    );

    /**
     * Registers a new user with email and password
     */
    const registerUser = useCallback(
        async (email, password, name, navigate) => {
            setIsLoading(true);
            setAuthError("");

            try {
                // Create user account
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const newUser = userCredential.user;

                // Update profile with display name
                await updateProfile(newUser, {
                    displayName: name,
                });

                // Reload user to ensure profile updates are reflected
                await auth.currentUser.reload();

                // Save user to database
                await saveUser(email, name, "", "POST");

                // Send verification email
                await sendEmailVerification(newUser);

                toast.success("Verification email sent! Please check your inbox.");

                // Redirect to check mail page
                navigate("/check-mail");
            } catch (error) {
                handleAuthError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [auth, handleAuthError, saveUser]
    );

    /**
     * Logs in user with email and password
     * Requires email verification before allowing access
     */
    const loginUser = useCallback(
        async (email, password, location, navigate) => {
            setIsLoading(true);
            setAuthError("");

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const loggedInUser = userCredential.user;

                // Enforce email verification
                if (!loggedInUser.emailVerified) {
                    const errorMessage = "Please verify your email before logging in.";
                    setAuthError(errorMessage);
                    toast.error(errorMessage);
                    await signOut(auth); // Sign out unverified user
                    return;
                }

                // Save/update user in database
                const photoURL = normalizePhotoURL(loggedInUser.photoURL);
                await saveUser(loggedInUser.email, loggedInUser.displayName, photoURL, "PUT");

                setUser(loggedInUser);

                // Navigate to intended destination or dashboard
                const destination = location?.state?.from || "/dashboard";
                navigate(destination);

                toast.success("Login successful!");
            } catch (err) {
                handleAuthError(err);
            } finally {
                setIsLoading(false);
            }
        },
        [auth, handleAuthError, saveUser, normalizePhotoURL]
    );

    /**
     * Signs in user with Google popup
     * Google users are automatically verified
     */
    const signInWithGoogle = useCallback(
        async (location, navigate) => {
            setIsLoading(true);
            setAuthError("");

            try {
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                const photoURL = normalizePhotoURL(user.photoURL);

                // Save/update user in database
                await saveUser(user.email, user.displayName, photoURL, "PUT");

                // Google users are always verified, navigate to destination
                const destination = location?.state?.from || "/dashboard";
                navigate(destination);

                toast.success("Login successful!");
            } catch (error) {
                handleAuthError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [auth, googleProvider, handleAuthError, saveUser, normalizePhotoURL]
    );

    /**
     * Resends verification email to current user
     */
    const resendVerificationEmail = useCallback(async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                toast.error("No user is currently signed in.");
                return;
            }

            if (currentUser.emailVerified) {
                toast.info("Your email is already verified.");
                return;
            }

            await sendEmailVerification(currentUser);
            toast.success("Verification email sent! Please check your inbox.");
        } catch (error) {
            handleAuthError(error);
        }
    }, [auth, handleAuthError]);

    /**
     * Logs out current user
     */
    const logout = useCallback(() => {
        setIsLoading(true);
        signOut(auth)
            .then(() => {
                toast.success("Logged out successfully!");
            })
            .catch((error) => {
                console.error("Logout error:", error);
                toast.error("Failed to log out. Please try again.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [auth]);

    /**
     * Observer for user authentication state changes
     * Only sets user if email is verified
     */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user && user.emailVerified) {
                setUser(user);
            } else {
                setUser({});
            }
            setIsCheckingUser(false);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    /**
     * Checks if current user has admin privileges
     * Only runs when user email changes
     */
    useEffect(() => {
        if (!user?.email) {
            setAdmin(false);
            return;
        }

        const checkAdminStatus = async () => {
            try {
                const response = await axiosInstance.get(`${API_ENDPOINTS.users}/check/${user.email}`);
                setAdmin(response.data.admin);
            } catch (err) {
                console.error("Admin check error:", err);
                toast.error(err.response?.data?.message || "Failed to check admin role.");
                setAdmin(false);
            }
        };

        checkAdminStatus();
    }, [user?.email, axiosInstance]);

    return {
        user,
        setUser,
        admin,
        isLoading,
        isCheckingUser,
        authError,
        setAuthError,
        registerUser,
        loginUser,
        signInWithGoogle,
        resendVerificationEmail,
        logout,
    };
};

export default useFirebase;
