import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";

export const accountsController = {
  index: {
    auth: false,
    handler: async function (request: Request, h: ResponseToolkit) {
      return h.view("main", { title: "Welcome to SpotHop" });
    },
  },

  showSignup: {
    auth: false,
    handler: function (request: Request, h: ResponseToolkit) {
      return h.view("signup-view", { title: "Sign up for SpotHop" });
    },
  },

  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request: Request, h: ResponseToolkit, error: any) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request: Request, h: ResponseToolkit) {
      const user = request.payload;
      await db.userStore.addUser(user);
      console.log("Signed up new user");
      return h.redirect("/login");
    },
  },

  showLogin: {
    auth: false,
    handler: function (request: Request, h: ResponseToolkit) {
      return h.view("login-view", { title: "Login to SpotHop" });
    },
  },

  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request: Request, h: ResponseToolkit, error: any) {
        console.log("Login failed");
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request: Request, h: ResponseToolkit) {
      const { email, password } = request.payload as any;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
      console.log("Login success - rendering dashboard for " + JSON.stringify(user.email))
      return h.redirect("/dashboard");
    },
  },

  logout: {
    handler: function (request: Request, h: ResponseToolkit) {
      request.cookieAuth.clear();
      console.log("User logged out");
      return h.redirect("/");
    },
  },

  async validate(request: Request, session: any) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },

  accountDetailsIndex: {
    handler: async function (request: Request, h: ResponseToolkit) {
      const loggedInUser = request.auth.credentials;
      let viewData = {
        title: "Edit Account Details" as string,
        userList: [] as any
      };
      console.log('Access account details of user', loggedInUser.email);
      if (loggedInUser.admin == true) {
        const users = await db.userStore.getAllUsers();
        viewData.title = "Administrator Dashboard";
        viewData.userList = users;
        console.log("Rendering administrator account dashboard")
      } else {
        viewData.userList[0] = loggedInUser;
        console.log("Rendering account details view")
      }
      return h.view("account-view", viewData);
    },
  },

  modifyAccount: {
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request: Request, h: ResponseToolkit, error: any) {
        console.log("Account details modification error");
        const loggedInUser = request.auth.credentials;
        console.log("Logged in user: ", loggedInUser);
        const viewData = {
          user: loggedInUser,
          title: "Account details modification error", 
          errors: error.details,
        };
        console.log("Error modifying user account");
        return h.view("account-view", viewData).takeover().code(400);
      },
    },
    handler: async function (request: Request, h: ResponseToolkit) {
      const account = request.params.id;
      const updatedUserData = request.payload;
      await db.userStore.updateUser(account, updatedUserData);
      console.log("Account modified");
      return h.redirect("/accountDetailsIndex");
    },
  },

  deleteUser: {
    handler: async function (request: Request, h: ResponseToolkit) {
      const userid = request.params.id;
      await db.spotStore.deleteSpotsByUserid(userid);
      await db.userStore.deleteUserById(userid);
      console.log("Account + associated spots deleted: " + JSON.stringify(userid));
      if (userid !== request.auth.credentials._id) {
        return h.redirect("/accountDetailsIndex");
      } else return h.redirect("/");
    },
  },
};
