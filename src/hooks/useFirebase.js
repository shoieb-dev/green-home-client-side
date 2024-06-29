import { useState, useEffect, useCallback } from "react";
import { getAuth, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { API_ENDPOINTS } from "../services/api";
import initializeFirebase from "./../Pages/Login/Firebase/firebase.init";

initializeFirebase();

const useFirebase = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
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
            "auth/popup-closed-by-user": "Sign-in popup was closed before completing the sign-in process. Please try again.",
            "auth/cancelled-popup-request": "Multiple popup requests. Please close the popup and try again.",
            "auth/network-request-failed": "Network error. Please check your internet connection and try again.",
            "auth/internal-error": "An internal error occurred. Please try again later."
        };
        setAuthError(errorMessages[error.code] || error.message);
    }, []);

    const registerUser = useCallback((email, password, name, history) => {
        setIsLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setAuthError("");

                const newUser = { email, displayName: name };
                setUser(newUser);

                // save user to the database
                saveUser(email, name, "POST");

                // send name to firebase after creation
                updateProfile(auth.currentUser, {
                    displayName: name,
                })
                    .then(() => { })
                    .catch((error) => { });
                history.replace("/");
            })
            .catch(handleAuthError)
            .finally(() => setIsLoading(false));
    }, [auth, handleAuthError]);

    const loginUser = useCallback((email, password, location, history) => {
        setIsLoading(true);
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const destination = location?.state?.from || "/";
                history.replace(destination);
                setAuthError("");
            })
            .catch(handleAuthError)
            .finally(() => setIsLoading(false));
    }, [auth, handleAuthError]);

    const signInWithGoogle = useCallback((location, history) => {
        setIsLoading(true);
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const user = result.user;
                saveUser(user.email, user.displayName, "PUT");
                setAuthError("");
                const destination = location?.state?.from || "/";
                history.replace(destination);
            })
            .catch(handleAuthError)
            .finally(() => setIsLoading(false));
    }, [auth, handleAuthError]);

    // observer user state
    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, (user) => {
            setUser(user || {});
            setIsLoading(false);
        });
        return () => unsubscribed;
    }, [auth]);

    useEffect(() => {
        if (user.email) {
            fetch(`${API_ENDPOINTS.users}/${user.email}`)
                .then((res) => res.json())
                .then((data) => setAdmin(data.admin));
        }
    }, [user.email]);

    const logout = useCallback(() => {
        setIsLoading(true);
        signOut(auth)
            .finally(() => setIsLoading(false));
    }, [auth]);

    const saveUser = (email, displayName, method) => {
        const user = { email, displayName };
        fetch(API_ENDPOINTS.users, {
            method: method,
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(user),
        }).then();
    };

    return {
        user,
        admin,
        isLoading,
        authError,
        setAuthError,
        registerUser,
        loginUser,
        signInWithGoogle,
        logout,
    };
};

export default useFirebase;
