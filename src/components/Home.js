import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { Grid, Box, Typography, Modal } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { socket } from "../socket";
import NavBar from "./NavBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationContext from "../ContextApi/NotificationContext";

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [peoples, setPeoples] = useState([]);
  const [open, setOpen] = useState(false);

  const { notificationsDispatch } =
    useContext(NotificationContext);
  const token = localStorage.getItem("token");
  const userData = jwtDecode(token);

  const handleOpen = (arr) => {
    if (arr.length !== 0) {
      setPeoples(arr);
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);
  const style = {
    height: "500px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "10px",
    p: 4,
    overflow: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  };

  useEffect(() => {
    console.log("hi", socket);
    if (socket && socket.on) {
      socket.emit("login", { userId: userData.id, socketId: socket.id });
      socket.on("notification", (data) => {
        toast.success(`${data.message}`, {
          onClick: () => {
            notificationsDispatch({
              type: "UPDATE_NOTIFICATION",
              payload: data.id,
            });
            console.log("called", data);
            navigate(`/viewPost/${data.postId}`);
          },
        });
        notificationsDispatch({
          type: "ADD_NOTIFICATIONS",
          payload: { ...data, seen: false },
        });
      });
      socket.on("addLike", (likePosts) => {
        setPosts(likePosts);
      });

      socket.on("removeLike", (unlikePost) => {
        setPosts(unlikePost);
      });
    }
    (async () => {
      try {
        const response = await axios.get("http://localhost:3060/api/posts");
        setPosts(response.data);
      } catch (err) {
        console.log(err);
      }
    })();
    return () => {
      socket.off("addLike");
      socket.off("removeLike");
      socket.off("notification");
    };
    // eslint-disable-next-line
  }, []);

  const handleLike = async (id) => {
    try {
      await axios.get(`http://localhost:3060/api/likes/${id}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveLike = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3060/api/unlikes/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log("unliked", response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Grid container spacing={0} height="auto">
        <ToastContainer limit={3} />
        <Grid item xs={3}>
          <NavBar />
        </Grid>
        <Grid
          item
          xs={9}
          sx={{
            backgroundColor: "#dfecff",
            height: "100vh",
            overflowY: "auto",
          }}
        >
          {posts.map((ele) => {
            return (
              <Card
                sx={{
                  maxWidth: "700px",
                  height: "600px",
                  marginLeft: "250px",
                  marginTop: "50px",
                }}
                key={ele._id}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                      {}
                    </Avatar>
                  }
                  title={ele.userId?.username}
                  subheader={moment(ele.createdAt).format("MMMM DD, YYYY")}
                />
                <CardMedia
                  component="img"
                  height="400"
                  image={ele.image}
                  alt="Post"
                />
                <CardContent>
                  <Typography>{ele.title}</Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      {ele.likes.map((ele) => ele._id).includes(userData.id) ? (
                        <IconButton
                          onClick={() => {
                            handleRemoveLike(ele._id);
                          }}
                          aria-label="add to favorites"
                        >
                          <FavoriteIcon sx={{ color: "red" }} />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => {
                            handleLike(ele._id);
                          }}
                          aria-label="add to favorites"
                        >
                          <FavoriteBorderIcon sx={{ color: "red" }} />
                        </IconButton>
                      )}
                      {ele.likes.length}{" "}
                      <span
                        onClick={() => {
                          handleOpen(ele.likes);
                        }}
                      >
                        Like(s)
                      </span>
                    </Box>
                  </Box>
                </CardActions>
              </Card>
            );
          })}
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Likes
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>
          {peoples.map((ele) => {
            return (
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {ele.username[0]}
                  </Avatar>
                }
                title={ele.username}
              />
            );
          })}
        </Box>
      </Modal>
    </div>
  );
}
