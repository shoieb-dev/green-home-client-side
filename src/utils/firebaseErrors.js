// utils/firebaseErrors.js
export const getFirebaseErrorMessage = (code) => {
    switch (code) {
        case "auth/wrong-password":
            return "The current password you entered is incorrect.";
        case "auth/weak-password":
            return "Your new password is too weak. Please use at least 6 characters.";
        case "auth/user-not-found":
            return "No user found with this account.";
        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";
        case "auth/requires-recent-login":
            return "For security reasons, please log in again before changing your password.";
        default:
            return "Something went wrong. Please try again.";
    }
};
