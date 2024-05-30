import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./NavBar";
import { isEmpty } from "lodash";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import { FadeLoader } from "react-spinners";
import {
  Grid,
  Box,
  Card,
  TextField,
  Button,
  FormHelperText,
  Alert,
  CardMedia,
} from "@mui/material";
export default function AddPost() {

  const [title, settitle] = useState("");
  const [image, setImage] = useState("");
  const [clientErrors, setClientErrors] = useState({});
  const [serverErrors, setServerErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const errors = {};

  const navigate = useNavigate();

  const handleImageChange = async (event) => {
    try {
      setLoading(true);
      const imageData = new FormData();
      const selectedFile = event.target.files[0];
      imageData.append("image", selectedFile);
      const response = await axios.post(
        "http://localhost:3060/api/images",
        imageData,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setLoading(false);
      setImage(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const validation = () => {
    if (!title.trim().length) {
      errors.title = "Caption is required";
    }
    if (!image.trim().length) {
      errors.image = "Image is required";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validation();
    if (isEmpty(errors)) {
      try {
        setClientErrors({});
        setLoading(true);
        const formData = {
          title,
          image,
        };
        await axios.post("http://localhost:3060/api/posts", formData, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setServerErrors("");
        navigate("/home");
        setLoading(false);
      } catch (err) {
        console.log(err);
        setServerErrors("An Error Occured");
      }
    } else {
      setClientErrors(errors);
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <div>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            width: "150px",
            height: "150px",
            backgroundColor: "rgba(255, 255, 255)",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FadeLoader color="#007FFF" />
        </div>
      )}
      <Grid container spacing={0} height="auto">
        <Grid item xs={3}>
          <NavBar />
        </Grid>
        <Grid item xs={9} sx={{ backgroundColor: "#dfecff", height: "100vh" }}>
          <Box>
            <Card
              sx={{
                maxWidth: "700px",
                height: "640px",
                marginLeft: "250px",
                marginTop: "30px",
              }}
            >
              {serverErrors.length !== 0 && (
                <Alert
                  severity="error"
                  style={{ position: "sticky", marginBottom: "20px" }}
                >
                  {serverErrors}
                </Alert>
              )}

              <Box
                sx={{
                  width: "430px",
                  height: "400px",
                  backgroundColor: "grey",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "130px",
                  marginTop: "50px",
                  position: "relative",
                }}
              >
                {image === "" ? (
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    sx={{
                      height: "100px",
                      width: "100px",
                      backgroundColor: "grey",
                    }}
                  >
                    <AddIcon sx={{ fontSize: "50px" }} />
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleImageChange}
                    />
                  </Button>
                ) : (
                  <CardMedia
                    component="img"
                    height="100%"
                    image={image}
                    alt="Post"
                    sx={{ objectFit: "cover" }}
                  />
                )}
              </Box>
              {clientErrors.image && (
                <FormHelperText style={{ color: "red", marginLeft: "150px" }}>
                  {clientErrors.image}
                </FormHelperText>
              )}
              <TextField
                margin="dense"
                id="email"
                label="Write something about your post"
                type="text"
                variant="outlined"
                onChange={(e) => {
                  settitle(e.target.value);
                }}
                sx={{
                  width: "480px",
                  marginLeft: "110px",
                  marginTop: "20px",
                }}
                error={clientErrors.title}
                helperText={
                  clientErrors.title && (
                    <span style={{ color: "red" }}>{clientErrors.title}</span>
                  )
                }
              />
              <Button
                variant="contained"
                type="submit"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "#5785FD",
                  marginTop: "10px",
                  marginLeft: "300px",
                  width: "100px",
                }}
              >
                Submit
              </Button>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
