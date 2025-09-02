import { useState } from "react";
import { Alert, Form, Spinner } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";
import { API_ENDPOINTS } from "../../../services/api";

const MakeAdmin = () => {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { axiosInstance } = useAxiosInstance();

    const handleAdminSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError("");

        axiosInstance
            .put(`${API_ENDPOINTS.users}/make-admin`, { email })
            .then(({ data }) => {
                if (data.success) {
                    toast.success(data.message);
                } else {
                    toast.error(data.message || "Failed to make admin. Try again.");
                }
            })
            .catch((error) =>
                toast.error(error.response?.data?.message || "An error occurred. Please try again later.")
            )
            .finally(() => setLoading(false));
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center p-6">
            <div className="w-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-20">
                <h2 className="text-2xl font-bold text-gray-700 pb-6">Make an Admin</h2>

                <Form onSubmit={handleAdminSubmit} className="bg-light p-4 rounded-3 shadow w-50">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="fw-bold">Email address</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            required
                        />
                    </Form.Group>

                    {success && <Alert variant="success">{success}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <button
                        type="submit"
                        className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <Spinner animation="border" size="sm" className="mr-2" />
                                Making Admin
                            </span>
                        ) : (
                            "Make Admin"
                        )}
                    </button>
                </Form>
            </div>
            <Toaster position="top-right" reverseOrder={false} />
        </div>
    );
};

export default MakeAdmin;
