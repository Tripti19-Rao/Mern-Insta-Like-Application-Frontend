import "./App.css";
import { useReducer, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import AddPost from "./components/AddPost";
import Notification from "./components/Notification";
import ViewPost from "./components/ViewPost";
import MyPosts from "./components/MyPosts";
import { socket } from "./socket";
import NotificationContext from "./ContextApi/NotificationContext";
import notificationsReducer from "./Reducer/notificationReducer";
const { v4: uuidv4 } = require("uuid");

function App() {
  const initailState = {
    data: [],
  };

  const [notifications, notificationsDispatch] = useReducer(
    notificationsReducer,
    initailState
  );

  const generateUniqueId = () => {
    return uuidv4();
  };

  const sessionId = generateUniqueId();
  console.log(sessionId);

  useEffect(() => {
    console.log("socket", socket);
    socket.connect();
    return () => {};
  }, []);
  return (
    <div>
      <NotificationContext.Provider
        value={{ notifications, notificationsDispatch }}
      >
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/add" element={<AddPost />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/viewPost/:id" element={<ViewPost />} />
        </Routes>
      </NotificationContext.Provider>
    </div>
  );
}

export default App;
