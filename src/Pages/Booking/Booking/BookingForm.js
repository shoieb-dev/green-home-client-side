import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { API_ENDPOINTS } from "../../../services/api";

const BookingForm = () => {
  const { houseId } = useParams();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.houses}/${houseId}`);
        setHouse(response.data);
      } catch (err) {
        setError("Failed to load house details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHouse();
  }, [houseId]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(API_ENDPOINTS.bookings, data);
      if (response.data.insertedId) {
        alert("House Booked Successfully");
        reset();
      }
    } catch (err) {
      alert("Failed to book the house. Please try again.");
    }
  };

  if (loading) return (<div
    className="d-flex justify-content-center align-items-center"
    style={{
      height: '100vh',
      backgroundColor: '#f5f5f5',
    }}
  >
    <Spinner animation="border" variant="success" />
  </div>);
  if (error) return <div style={{ height: '100vh' }} className="py-5 text-center d-flex justify-content-center align-items-center">
    <p>
      {error}
    </p>
  </div>;

  return (
    <Col xs={12} md={12} lg={12}>
      <div className="add-house py-5 text-center h-100">
        <h4 className="pt-5 text-white">Book This Apartment</h4>
        <form className="booking-form" onSubmit={handleSubmit(onSubmit)}>
          <input
            defaultValue={user?.displayName || ""}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}

          <input
            defaultValue={user?.email || ""}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}

          <input
            defaultValue={house?.name || ""}
            {...register("house", { required: "House name is required" })}
          />
          {errors.house && <span className="error">{errors.house.message}</span>}

          <input
            defaultValue={house?.price || ""}
            {...register("price", { required: "Price is required" })}
          />
          {errors.price && <span className="error">{errors.price.message}</span>}

          <input
            placeholder="Phone Number"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Invalid phone number format",
              },
            })}
          />
          {errors.phone && <span className="error">{errors.phone.message}</span>}

          <Button
            variant="dark"
            type="submit"
            className="w-50 btn-outline-success rounded-pill fw-bold text-white mt-4 py-3 mx-1"
          >
            Book This Apartment
          </Button>
        </form>
      </div>
    </Col>
  );
};

export default BookingForm;
