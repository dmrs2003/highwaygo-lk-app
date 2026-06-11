import axios from "axios";

const API = axios.create({
  baseURL: "https://highwaygo-lk-app.onrender.com/api",
});

export default API;