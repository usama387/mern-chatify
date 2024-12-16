import axios from "axios";

export const axios = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // send cookies with requests
});
