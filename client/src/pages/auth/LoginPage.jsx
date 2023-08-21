import React, { useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { loginUser } from "../../api/auth";
import { toast } from "react-toastify";
import { AppContext } from "../../contexts";

const schema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, user } = useContext(AppContext);

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      if (!data) return;
      localStorage.setItem("token", data?.token);
      await setUser(data.user);
      toast.success(data.message, { autoClose: 500 });
      const token = await localStorage.getItem("token");
      if (token) {
        redirect();
      }
    },
    onError: (err) => {
      setError("custom", {
        type: "manual",
        message: err.message,
      });
    },
  });

  const redirect = () => {
    if (user) {
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "user") navigate("/user/dashboard");
      return;
    }
  };

  useEffect(() => {
    redirect();
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="custom-login-page">
      <Form
        className="login-form"
        onSubmit={handleSubmit(loginMutation.mutate)}
      >
        <div className="header">
          <img src="/assets/profile.gif" alt="user profile" />
          <p className="title">Login</p>
        </div>
        <Form.Group className="login-controller" controlId="email">
          <Form.Label>Email</Form.Label>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => <Form.Control {...field} />}
          />
          {errors.email && (
            <Form.Text className="text-danger">
              {errors.email.message}
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group className="login-controller" controlId="password">
          <Form.Label>Password</Form.Label>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => <Form.Control type="password" {...field} />}
          />
          {errors.password && (
            <Form.Text className="text-danger">
              {errors.password.message}
            </Form.Text>
          )}
        </Form.Group>

        {errors.custom && (
          <center>
            <Form.Text className="text-danger">
              {errors.custom.message}
            </Form.Text>
          </center>
        )}
        <div className="d-flex gap-3 mt-3">
          <Button
            style={{ width: "100%" }}
            variant="outline-dark"
            as={Link}
            to="/signup"
          >
            Create Account
          </Button>
          <Button style={{ width: "100%" }} type="submit">
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
