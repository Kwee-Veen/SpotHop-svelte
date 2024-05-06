import Boom from "@hapi/boom";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { db } from "../models/db.js";
import { IdSpec, UserSpec, UserSpecPlus, UserArray, UserCredentialsSpec, JwtAuth } from '../models/joi-schemas.js';
import { validationError } from "./logger.js";
import { createToken } from "./jwt-utils.js";
import { User } from "../types/spot-types.js";

export const userApi = {
  authenticate: {
    auth: false,
    handler: async function (request: Request, h: ResponseToolkit) {
      const payload = request.payload as User;
      try {
        const user = (await db.userStore.getUserByEmail(payload.email)) as User;
        if (user === null) return Boom.unauthorized("User not found");
        const passwordsMatch: boolean = payload.password === user.password;
        if (!passwordsMatch) return Boom.unauthorized("Invalid password");
        const token = createToken(user);
        return h.response({ success: true, 
                            name: `${user.firstName} ${user.lastName}`, 
                            token: token, _id: user._id 
                          }).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Authenticates a user",
    notes: "If user has a valid email and password, creates and returns a JWT token",
    validate: { payload: UserCredentialsSpec, failAction: validationError },
    response: { schema: JwtAuth, failAction: validationError }
  },

  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit) {
      try {
        const users = await db.userStore.getAllUsers();
        return h.response(users).code(200);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },
  
  create: {
    auth: false,
    handler: async function (request: Request, h: ResponseToolkit) {
      try {
        const user = await db.userStore.addUser(request.payload);
        if (user) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a User",
    notes: "Creates then returns the newly created user",
    validate: { payload: UserSpec, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
    tags: ["api"],
    description: "Get one user",
    notes: "Returns one user's details",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: UserSpecPlus, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit) {
      try {
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all users",
    notes: "Deletes all users from SpotHop",
  },
  
};