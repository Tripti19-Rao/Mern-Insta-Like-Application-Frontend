import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Stack, Typography, Link } from "@mui/material";
import NotificationContext from "../ContextApi/NotificationContext";

export default function NavBar() {
  const { notifications } = useContext(NotificationContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userData = jwtDecode(token);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div style={{ position: "fixed" }}>
      <div style={{ display: "flex", alignItems: "center", margin: "60px" }}>
        <img
          src="/taskgram.jpg"
          alt="Signup Page Banner"
          style={{ height: "60px", marginRight: "10px" }}
        />
        <Typography fontWeight="bold" fontFamily="cursive" fontSize="25px">
          TaskGram
        </Typography>
      </div>

      <Typography
        textAlign="center"
        sx={{
          position: "fixed",
          left: 85,
          width: "100%",
          textAlign: "left",
          padding: "10px",
        }}
      >
        {` ${userData.username}`}
      </Typography>
      <Typography
        textAlign="center"
        sx={{
          position: "fixed",
          left: 85,
          width: "100%",
          textAlign: "left",
          padding: "10px",
        }}
      >
        {` ${userData.username}`}
      </Typography>
      <Stack spacing={3} direction="column" sx={{ marginTop: "120px" }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => {
            navigate("/home");
          }}
        >
          Home
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => {
            navigate("/myposts");
          }}
        >
          My Posts
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => {
            navigate("/add");
          }}
        >
          Add Post
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => {
            navigate("/notification");
          }}
        >
          Notification{" "}
          {notifications.data.filter((ele) => ele.seen === false).length === 0
            ? null
            : notifications.data.filter((ele) => ele.seen === false).length}
        </Link>

        <Link component="button" variant="body1" onClick={handleLogout}>
          Logout
        </Link>
      </Stack>
    </div>
  );
}
