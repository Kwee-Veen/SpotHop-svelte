import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const userJsonStore = {
  async getAllUsers() {
    await db.read();
    return db.data.users;
  },

  // The first user to be inputted into the database will be designated the admin.
  async addUser(user) {
    await db.read();
    const userList = await this.getAllUsers();
    if (userList.length <= 0) {
      user.admin = true;
    }
    else user.admin = false;
    user._id = v4();
    db.data.users.push(user);
    await db.write();
    return user;
  },

  async getUserById(id) {
    if (id) { 
      await db.read();
      let u = db.data.users.find((user) => user._id === id);
      if (u === undefined) u = null;
      return u;
    }
    return null
  },

  async getUserByEmail(email) {
    await db.read();
    let u = db.data.users.find((user) => user.email === email);
    if (u === undefined) u = null;
    return u;
  },

  async deleteUserById(id) {
    await db.read();
    const index = db.data.users.findIndex((user) => user._id === id);
    if (index !== -1) db.data.users.splice(index, 1);
    await db.write();
  },

  async deleteAll() {
    db.data.users = [];
    await db.write();
  },

  async updateUser(id, updatedUserData) {
    await db.read();
    let user = db.data.users.find((user) => user._id === id);
    user.firstName = updatedUserData.firstName;
    user.lastName = updatedUserData.lastName;
    user.email = updatedUserData.email;
    user.password = updatedUserData.password;
    await db.write();
    return user;
  },
};
