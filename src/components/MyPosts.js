import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
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
import NavBar from "./NavBar";

export default function MyPosts() {
  const [myposts, setMyposts] = useState([]);
  const [open, setOpen] = useState(false);
  const [likearr, setLikearr] = useState([]);

  const handleOpen = (arr) => {
    if (arr.length !== 0) {
      setLikearr(arr);
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
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:3060/api/users/posts",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setMyposts(response.data);
      } catch (err) {}
    })();
  }, []);
  return (
    <div>
      <Grid container spacing={0} height="auto">
        <Grid item xs={3}>
          <NavBar />
        </Grid>
        <Grid
          item
          xs={9}
          sx={{
            backgroundColor: "#dfecff",
            minHeight: "100vh",
            height: "100%",
          }}
        >
          <Typography
            variant="body1"
            textAlign="left"
            fontSize="25px"
            mt={4}
            ml={15}
          >
            My Posts
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {myposts.map((ele) => {
              return (
                <Card
                  sx={{
                    maxWidth: "500px",
                    height: "500px",
                    marginLeft: "50px",
                    marginTop: "40px",
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
                    height="300"
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
                        <IconButton
                          onClick={() => {
                            handleOpen(ele.likes);
                          }}
                          aria-label="add to favorites"
                        >
                          <FavoriteIcon sx={{ color: "red" }} />
                        </IconButton>
                        {ele.likes.length} Like(s)
                      </Box>
                    </Box>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
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
          {likearr.map((ele) => {
            return (
              <CardHeader
                avatar={
                  <Avatar
                    sx={{ bgcolor: red[500] }}
                    aria-label="recipe"
                  ></Avatar>
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
