import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { spotController } from "./controllers/spot-controller.js";
import { aboutController } from "./controllers/about-controller.js";
export const webRoutes = [
    { method: "GET", path: "/", config: accountsController.index },
    { method: "GET", path: "/signup", config: accountsController.showSignup },
    { method: "GET", path: "/login", config: accountsController.showLogin },
    { method: "GET", path: "/logout", config: accountsController.logout },
    { method: "POST", path: "/register", config: accountsController.signup },
    { method: "POST", path: "/authenticate", config: accountsController.login },
    { method: "GET", path: "/about", config: aboutController.index },
    { method: "GET", path: "/dashboard", config: dashboardController.index },
    { method: "POST", path: "/dashboard/addspot", config: dashboardController.addSpot },
    { method: "POST", path: "/dashboard/searchspot", config: dashboardController.searchSpot },
    { method: "GET", path: "/dashboard/{id}/deletespot", config: dashboardController.deleteSpot },
    { method: "GET", path: "/spot/{id}", config: spotController.index },
    { method: "POST", path: "/spot/{id}/editspot", config: spotController.editSpot },
    { method: "GET", path: "/accountDetailsIndex", config: accountsController.accountDetailsIndex },
    { method: "POST", path: "/modifyaccount/{id}", config: accountsController.modifyAccount },
    { method: "POST", path: "/deleteaccount/{id}", config: accountsController.deleteUser },
    { method: "POST", path: "/spot/{id}/uploadimage", config: spotController.uploadImage },
    { method: "GET", path: "/spot/{id}/deleteimage", config: spotController.deleteImage },
    {
        method: "GET",
        path: "/{param*}",
        handler: {
            directory: {
                path: "./public",
            },
        },
        options: { auth: false },
    },
];
