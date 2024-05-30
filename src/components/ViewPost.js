import { useState, useEffect } from 'react';
import {useParams } from 'react-router-dom'
import axios from 'axios'
import moment from "moment";
import NavBar from "./NavBar";
import {
  Grid,
  Box,
  Typography,
  Modal
} from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";


export default function ViewPost() {
    const [post, setPost] = useState([])
    const [open, setOpen] = useState(false);

    const { id } = useParams()
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
      height: '500px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      borderRadius:'10px',
      p: 4,
      overflow: 'auto', 
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': { 
        display: 'none',
      },
    };
    
    useEffect(()=>{
      (async()=>{
        try{
          console.log("inside")
          const response = await axios.get(`http://localhost:3060/api/posts/one/${id}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
          console.log(response.data)
          setPost(response.data)
        }catch(err){
          console.log(err)
        }
      })()
    },[id])


  return (
    <div>
        <Grid container>
            <Grid item xs={3}>
                <NavBar />
            </Grid>
            <Grid item xs={9} sx={{ backgroundColor: "#dfecff", height: "100vh" }}>
              {post.map((ele)=>{
                return (
                  <Card sx={{ maxWidth: '700px',height:'600px', marginLeft:'250px', marginTop:'50px' }} key={ele._id}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                      {ele.userId?.username[0]}
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
                  <Typography >
                    {ele.title}
                  </Typography>
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
                      onClick={()=>{handleOpen()}}
                          aria-label="add to favorites"
                        >
                          <FavoriteIcon sx={{ color: "red" }} />
                        </IconButton>
                      {ele.likes.length} Like(s)
                    </Box>
                  </Box>
                </CardActions>
              </Card>
                )
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
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            
          </Typography>
              {
                post[0]?.likes.map((ele)=>{
                  return <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                      {ele.username[0]}
                    </Avatar>
                  }
                  title={`${ele.username} liked your post`}
                />
                })
              }
        </Box>
      </Modal>

    </div>
  )
}
