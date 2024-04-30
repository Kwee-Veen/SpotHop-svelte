import axios from "axios";

import { serviceUrl } from "../fixtures.js";

export const spothopService = {
  spothopUrl: serviceUrl,

  async authenticate(user) {
    const response = await axios.post(`${this.spothopUrl}/api/users/authenticate`, user);
    axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
    return response.data;
  },

  async clearAuth() {
    axios.defaults.headers.common["Authorization"] = "";
  },

  async createUser(user) {
    const res = await axios.post(`${this.spothopUrl}/api/users`, user);
    return res.data;
  },
  
  async getUser(id) {
    const res = await axios.get(`${this.spothopUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.spothopUrl}/api/users`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.spothopUrl}/api/users`);
    return res.data;
  },

  async createSpot(spot) {
    const res = await axios.post(`${this.spothopUrl}/api/spots`, spot);
    return res.data;
  },

  async deleteAllSpots() {
    const response = await axios.delete(`${this.spothopUrl}/api/spots`);
    return response.data;
  },

  async deleteSpot(id) {
    const response = await axios.delete(`${this.spothopUrl}/api/spots/${id}`);
    return response;
  },

  async getAllSpots() {
    const res = await axios.get(`${this.spothopUrl}/api/spots`);
    return res.data;
  },

  async getSpot(id) {
    const res = await axios.get(`${this.spothopUrl}/api/spots/${id}`);
    return res.data;
  },
}