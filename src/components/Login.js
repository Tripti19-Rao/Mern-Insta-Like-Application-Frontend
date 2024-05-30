import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [clientErrors, setClientErrors] = useState({});
  const [serverErrors, setServerErrors] = useState("");
  const errors = {};
  const navigate = useNavigate();

  const validation = () => {
    if (!email.trim().length) {
      errors.email = "Email is required";
    }
    if (!password.trim().length) {
      errors.password = "Password is required";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("inside");
    validation();
    const formData = {
      email,
      password,
    };
    if (isEmpty(errors)) {
      try {
        setClientErrors({});
        const response = await axios.post(
          "http://localhost:3060/api/users/login",
          formData
        );
        const token = response.data.token;
        localStorage.setItem("token", token);
        console.log(token);
        toast.success("Successfully Logged In!", {
          autoClose: 500,
          onClose: () => navigate("/home"),
        });
        setServerErrors("");
      } catch (err) {
        setServerErrors("Something went wrong");
      }
    } else {
      setClientErrors(errors);
    }
  };

  return (
    <div>
      <Grid container>
        <ToastContainer position="top-center" />
        <Grid item xs={6}>
          <img
            src="/auth.jpg"
            alt="login Page Banner"
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
              sx={{
                backgroundColor: "white",
                width: "450px",
                height: "auto",
                padding: "30px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                position: "absolute",
                maxHeight: "100vh",
                borderRadius: "10px",
              }}
            >
              <Stack spacing={3} direction="column">
                <Typography
                  fontWeight="bold"
                  fontFamily="cursive"
                  textAlign="center"
                  fontSize="25px"
                >
                  TaskGram
                </Typography>
                {serverErrors.length !== 0 && (
                  <Alert
                    severity="error"
                    style={{ position: "sticky", marginBottom: "20px" }}
                  >
                    {serverErrors}
                  </Alert>
                )}
                <TextField
                  margin="dense"
                  id="email"
                  label="Email"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  error={clientErrors.email}
                  helperText={
                    clientErrors.email && (
                      <span style={{ color: "red" }}>{clientErrors.email}</span>
                    )
                  }
                />
                <TextField
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  error={clientErrors.password}
                  helperText={
                    clientErrors.password && (
                      <span style={{ color: "red" }}>
                        {clientErrors.password}
                      </span>
                    )
                  }
                />
              </Stack>
              <Button
                variant="contained"
                type="submit"
                onClick={handleSubmit}
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
                fontSize="18px"
                mt={2}
                sx={{ color: "black" }}
              >
                Don't have an account? <Link to={"/"}>Click here</Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
