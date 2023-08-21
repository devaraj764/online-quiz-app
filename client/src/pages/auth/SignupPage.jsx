import React from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { signupUser } from "../../api/auth";
import { toast } from "react-toastify";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm();

  const navigate = useNavigate()

  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      toast.success(data.message, { autoClose: 500 });
      navigate("/login");
    },
    onError: (err) => {
      setError("mannual", { type: "manual", message: err.message });
    },
  });

  const password = watch("password");
  // const confirmPassword = watch("confirmPassword");

  return (
    <div className="custom-login-page">
      <Form
        className="login-form"
        onSubmit={handleSubmit(signupMutation.mutate)}
      >
        <div className="header">
          <img src="/assets/profile.gif" alt="user profile" />
          <p className="title">User Registration</p>
        </div>
        <Form.Group className="login-controller" controlId="fullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            {...register("fullName", { required: "Full Name is required" })}
          />
          {errors.fullName && (
            <Form.Text className="text-danger">
              {errors.fullName.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="login-controller" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <Form.Text className="text-danger">
              {errors.email.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="login-controller" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <Form.Text className="text-danger">
              {errors.password.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="login-controller" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <Form.Text className="text-danger">
              {errors.confirmPassword.message}
            </Form.Text>
          )}
        </Form.Group>

        {errors.mannual && (
          <center>
            <Form.Text className="text-danger">
              {errors.mannual.message}
            </Form.Text>
          </center>
        )}

        <div className="d-flex gap-3 pt-3">
          <Button
            style={{ width: "100%" }}
            variant="outline-primary"
            as={Link}
            to="/login"
          >
            Already User ?
          </Button>
          <Button
            style={{ width: "100%" }}
            disabled={signupMutation.isLoading}
            type="submit"
            variant="success"
          >
            Sign Up
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SignupPage;
