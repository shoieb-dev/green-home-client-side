import React, { useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { API_ENDPOINTS } from "../../../services/api";
import { useAxiosInstance } from "../../../hooks/useAxiosInstance";

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
                    setSuccess(data.message);
                } else {
                    setError(data.message || "Failed to make admin. Try again.");
                }
            })
            .catch((error) => setError(error.response?.data?.message || "An error occurred. Please try again later."))
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

                    <Button type="submit" variant="success" disabled={loading} aria-label="Make Admin" className="mt-4">
                        {loading ? <Spinner animation="border" size="sm" /> : "Make Admin"}
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default MakeAdmin;
