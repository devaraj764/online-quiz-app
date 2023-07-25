import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Button } from "react-bootstrap";

const schema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z.string().nonempty("Password is required"),
});

const AdminLoginForm = () => {
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
          <img src="/assets/admin.gif" alt="admin image" />
          <p className="title">Admin Login</p>
        </div>
        <Form.Group className="login-controller" controlId="username">
          <Form.Label>Username</Form.Label>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => <Form.Control {...field} />}
          />
          {errors.username && (
            <Form.Text className="text-danger">
              {errors.username.message}
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
        <Button style={{ width: "100%" }} variant="success" type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
};

export default AdminLoginForm;
