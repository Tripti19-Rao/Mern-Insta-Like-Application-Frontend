import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Stack,
  TextField,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as yup from "yup";
import YupPassword from "yup-password";

// eslint-disable-next-line
YupPassword(yup);

export default function Register() {
  const [serverErrors, setServerErrors] = useState({});
  const navigate = useNavigate();

  const basicSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    name: yup.string().required("name is required"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .oneOf([yup.ref("password"), null], "Password must match")
      .minLowercase(1, "password must contain at least 1 lower case letter")
      .minUppercase(1, "password must contain at least 1 upper case letter")
      .minNumbers(1, "password must contain at least 1 number")
      .minSymbols(1, "password must contain at least 1 special character"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      //taking refernce and value inside array is valid in that field
      .oneOf([yup.ref("password"), null], "Password must match")
      .minLowercase(1, "password must contain at least 1 lower case letter")
      .minUppercase(1, "password must contain at least 1 upper case letter")
      .minNumbers(1, "password must contain at least 1 number")
      .minSymbols(1, "password must contain at least 1 special character"),
  });

  const onSubmit = async (values, actions) => {
    const formData = {
      username: values.username,
      name: values.name,
      email: values.email,
      password: values.password,
    };
    try {
      await axios.post("http://localhost:3060/api/users/register", formData);
      //actions.resetForm()
      setServerErrors({});
      toast.success("Successfully Registered!", {
        autoClose: 500,
        onClose: () => navigate("/login"),
      });
    } catch (err) {
      setServerErrors(err.response.data);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        username: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      validationSchema: basicSchema,
      onSubmit,
    });
  return (
    <div>
      <Grid container>
        <ToastContainer position="top-center" />
        <Grid item xs={6}>
          <img
            src="/auth.jpg"
            alt="Signup Page Banner"
            style={{ margin: "140px", height: "450px" }}
          />
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              backgroundColor: "#dfecff",
              height: "100vh",
              position: "relative",
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                backgroundColor: "white",
                width: "450px",
                padding: "30px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                position: "absolute",
                overflowY: "auto",
                maxHeight: "100vh",
                borderRadius: "10px",
              }}
            >
              <Stack spacing={2} direction="column">
                <Typography
                  fontWeight="bold"
                  fontFamily="cursive"
                  textAlign="center"
                  fontSize="25px"
                >
                  TaskGram
                </Typography>
                {serverErrors.errors &&
                  serverErrors.errors.map((ele) => {
                    return (
                      <Alert
                        severity="error"
                        style={{ position: "sticky", marginBottom: "20px" }}
                      >
                        {ele.msg}
                      </Alert>
                    );
                  })}
                <TextField
                  margin="dense"
                  id="username"
                  label="Username"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={errors.username && touched.username}
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    errors.username && touched.username ? (
                      <span style={{ color: "red" }}>{errors.username}</span>
                    ) : null
                  }
                />
                <TextField
                  margin="dense"
                  id="name"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={errors.name && touched.name}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    errors.name && touched.name ? (
                      <span style={{ color: "red" }}>{errors.name}</span>
                    ) : null
                  }
                />
                <TextField
                  margin="dense"
                  id="email"
                  label="Email"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={errors.email && touched.email}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    errors.email && touched.email ? (
                      <span style={{ color: "red" }}>{errors.email}</span>
                    ) : null
                  }
                />
                <TextField
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  error={errors.password && touched.password}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    errors.password && touched.password ? (
                      <span style={{ color: "red" }}>{errors.password}</span>
                    ) : null
                  }
                />
                <TextField
                  margin="dense"
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  error={errors.confirmPassword && touched.confirmPassword}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    errors.confirmPassword && touched.confirmPassword ? (
                      <span style={{ color: "red" }}>
                        {errors.confirmPassword}
                      </span>
                    ) : null
                  }
                />
              </Stack>
              <Button
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#5785FD",
                  marginTop: "30px",
                  marginLeft: "350px",
                  width: "100px",
                }}
              >
                Submit
              </Button>
              <Typography
                textAlign="center"
                fontSize="16px"
                sx={{ color: "black", padding: "10px" }}
              >
                Already have an account? <Link to={"/login"}>Click here</Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
