import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { spotController } from "./controllers/spot-controller.js";
import { aboutController } from "./controllers/about-controller.js";

export const webRoutes = [
  { method: "GET" as const, path: "/", config: accountsController.index },
  { method: "GET" as const, path: "/signup", config: accountsController.showSignup },
  { method: "GET" as const, path: "/login", config: accountsController.showLogin },
  { method: "GET" as const, path: "/logout", config: accountsController.logout },
  { method: "POST" as const, path: "/register", config: accountsController.signup },
  { method: "POST" as const, path: "/authenticate", config: accountsController.login },

  { method: "GET" as const, path: "/about", config: aboutController.index },

  { method: "GET" as const, path: "/dashboard", config: dashboardController.index },
  { method: "POST" as const, path: "/dashboard/addspot", config: dashboardController.addSpot },
  { method: "POST" as const, path: "/dashboard/searchspot", config: dashboardController.searchSpot },
  { method: "GET" as const, path: "/dashboard/{id}/deletespot", config: dashboardController.deleteSpot },

  { method: "GET" as const, path: "/spot/{id}", config: spotController.index },
  { method: "POST" as const, path: "/spot/{id}/editspot", config: spotController.editSpot },

  { method: "GET" as const, path: "/accountDetailsIndex", config: accountsController.accountDetailsIndex },
  { method: "POST" as const, path: "/modifyaccount/{id}", config: accountsController.modifyAccount },
  { method: "POST" as const, path: "/deleteaccount/{id}", config: accountsController.deleteUser },

  { method: "POST" as const, path: "/spot/{id}/uploadimage", config: spotController.uploadImage },
  { method: "GET" as const, path: "/spot/{id}/deleteimage", config: spotController.deleteImage },

  {
    method: "GET" as const,
    path: "/{param*}",
    handler: {
      directory: {
        path: "./public",
      },
    },
    options: { auth: false as const },
  },
];