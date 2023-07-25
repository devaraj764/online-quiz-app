import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Button } from "react-bootstrap";

const schema = z.object({
  email: z.string().email("Invalid email").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

const UserLoginForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data); // Replace with your authentication logic
  };

  return (
    <div className="custom-login-page">
      <Form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="header">
          <img src="/assets/profile.gif" alt="user profile image" />
          <p className="title">User Login</p>
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
        <br />
        <Button style={{ width: "100%" }} type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
};

export default UserLoginForm;
