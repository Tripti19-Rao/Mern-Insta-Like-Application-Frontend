import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import {
  Grid,
  Box,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import "react-toastify/dist/ReactToastify.css";
import NotificationContext from "../ContextApi/NotificationContext";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export default function Notification() {
  const navigate = useNavigate();

  const { notifications, notificationsDispatch } = useContext(NotificationContext);

  return (
    <div>
      <Grid container spacing={0} height="auto">
        <Grid item xs={3}>
          <NavBar />
        </Grid>
        <Grid item xs={9} sx={{ backgroundColor: "#dfecff", height: "100vh" }}>
          
          <div style={{ marginTop: "60px" }}>
            {notifications.data.length === 0 ? (
              <div>
                <Typography
            variant="body1"
            textAlign="left"
            fontSize="25px"
            mt={4}
            ml={15}
          >
            No Notifications Yet
          </Typography>
                <Box
                  component="img"
                  style={{
                    display: "block",
                    margin: "auto",
                    height: "400px",
                    width: "400px",
                    maxWidth: "100%",
                    borderRadius: "50%",
                    objectFit: "fill",
                    marginTop:'70px'
                  }}
                  src="/1.jpg"
                  alt="Image"
                />
              </div>
            ) : (
              <div><Typography
              variant="body1"
              textAlign="left"
              fontSize="25px"
              mt={4}
              ml={25}
              mb={5}
            >
              All Notifications
            </Typography>
            {notifications.data.map((ele) => {
              return (
                <Card
                  onClick={() => {
                    notificationsDispatch({
                      type: "UPDATE_NOTIFICATION",
                      payload: ele.id,
                    });
                    navigate(`/viewPost/${ele.postId}`);
                  }}
                  sx={{
                    display: "flex",
                    width: "700px",
                    marginLeft: "200px",
                    marginTop: "0px",
                    backgroundColor: ele.seen === true ? "#e8ebed" : "white",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "1 0 auto", display: "flex" }}>
                      <Avatar
                        sx={{ bgcolor: "#f44336", marginRight: "45px" }}
                        aria-label="recipe"
                      ></Avatar>
                      <Typography>{ele.message}</Typography>
                    </CardContent>
                  </Box>
                </Card>
              );
            })}
            </div>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
