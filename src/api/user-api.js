import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { createToken } from "./jwt-utils.js";
export const userApi = {
    find: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const users = await db.userStore.getAllUsers();
                return h.response(users).code(200);
            }
            catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
    },
    findOne: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                const user = (await db.userStore.getUserById(request.params.id));
                if (user === null) {
                    return Boom.notFound("No User with this id");
                }
                return h.response(user).code(200);
            }
            catch (err) {
                return Boom.serverUnavailable("Database error");
            }
        },
    },
    create: {
        auth: false,
        // validate: {
        //   payload: UserSpec,
        //   options: { abortEarly: false },
        //   failAction: function (request: Request, h: ResponseToolkit, error: any) {
        //     return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
        //   },
        // },
        handler: async function (request, h) {
            try {
                // const newUser = request.payload;
                const newUser = request.payload;
                // const newUser = {
                //   firstName: userPayload.firstName,
                //   lastName: userPayload.lastName,
                //   email: userPayload.email,
                //   password: userPayload.password,
                //   admin: userPayload.admin,
                // };
                const user = (await db.userStore.addUser(newUser));
                if (user !== null) {
                    return h.response(user).code(201);
                }
            }
            catch (err) {
                return Boom.badImplementation("error creating new user");
            }
        },
    },
    deleteAll: {
        auth: {
            strategy: "jwt",
        },
        handler: async function (request, h) {
            try {
                await db.userStore.deleteAll();
                return h.response().code(204);
            }
            catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
    },
    authenticate: {
        auth: false,
        handler: async function (request, h) {
            const payload = request.payload;
            try {
                const user = (await db.userStore.getUserByEmail(payload.email));
                if (user === null)
                    return Boom.unauthorized("User not found");
                const passwordsMatch = payload.password === user.password;
                if (!passwordsMatch)
                    return Boom.unauthorized("Invalid password");
                const token = createToken(user);
                return h.response({ success: true,
                    name: `${user.firstName} ${user.lastName}`,
                    token: token, _id: user._id
                }).code(201);
            }
            catch (err) {
                return Boom.serverUnavailable("Database Error");
            }
        },
    },
};
