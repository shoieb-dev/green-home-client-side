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
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import initializeFirebase from "../Pages/auth/Firebase/firebase.init";
import { API_ENDPOINTS } from "../services/api";

initializeFirebase();

const useFirebase = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingUser, setIsCheckingUser] = useState(true);
    const [authError, setAuthError] = useState("");
    const [admin, setAdmin] = useState(false);

    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

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
        setAuthError(errorMessages[error.code] || error.message);
        toast.error(errorMessages[error.code] || error.message);
    }, []);

    // Register New User
    const registerUser = useCallback(
        async (email, password, name, navigate) => {
            setIsLoading(true);
            setAuthError("");

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const newUser = userCredential.user;

                // ✅ update profile with displayName right after creation
                await updateProfile(newUser, {
                    displayName: name,
                });

                // ✅ Save user into DB with displayName
                saveUser(email, name, "", "POST");

                // Send verification email
                await sendEmailVerification(newUser);

                // Redirect to CheckMail page
                navigate("/check-mail");
            } catch (error) {
                handleAuthError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [auth, handleAuthError]
    );

    // Login User
    const loginUser = useCallback(
        async (email, password, location, navigate) => {
            setIsLoading(true);
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const loggedInUser = userCredential.user;

                if (!loggedInUser.emailVerified) {
                    setAuthError("Please verify your email before logging in.");
                    await signOut(auth); // prevent keeping them signed in
                    return;
                }

                // Save verified user to DB (if not already saved)
                const photoURL = loggedInUser.photoURL ? loggedInUser.photoURL.replace(/=s96-c/, "") : "";
                saveUser(loggedInUser.email, loggedInUser.displayName, photoURL, "PUT");

                setUser(loggedInUser);
                const destination = location?.state?.from || "/";
                navigate(destination);
                setAuthError("");
            } catch (err) {
                handleAuthError(err);
            } finally {
                setIsLoading(false);
            }
        },
        [auth, handleAuthError]
    );

    // Sign in with Google
    const signInWithGoogle = useCallback(
        (location, navigate) => {
            setIsLoading(true);
            signInWithPopup(auth, googleProvider)
                .then((result) => {
                    const user = result.user;
                    const photoURL = result?.user?.photoURL ? result?.user?.photoURL.replace(/=s96-c/, "") : null;
                    saveUser(user.email, user.displayName, photoURL, "PUT");

                    // Google users are always verified
                    const destination = location?.state?.from || "/";
                    navigate(destination);
                    setAuthError("");
                })
                .catch(handleAuthError)
                .finally(() => setIsLoading(false));
        },
        [auth, handleAuthError]
    );

    // Observer user state
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

    useEffect(() => {
        if (user.email) {
            fetch(`${API_ENDPOINTS.users}/check/${user.email}`)
                .then((res) => res.json())
                .then((data) => setAdmin(data.admin))
                .catch(console.error);
        }
    }, [user.email]);

    const logout = useCallback(() => {
        setIsLoading(true);
        signOut(auth)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [auth]);

    const saveUser = (email, displayName, photoURL, method) => {
        const user = { email, displayName, photoURL };
        fetch(API_ENDPOINTS.users, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        }).catch(console.error);
    };

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
        logout,
    };
};

export default useFirebase;
