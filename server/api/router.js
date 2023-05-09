import { Router } from "express";
const api = Router();

/*** Import Routes ***/
import { router as voteRoutes } from "./routes/voteRoutes.js";
import { router as sessionRoutes } from "./routes/sessionRoute.js";
import { router as userRoutes } from "./routes/userRoute.js";

/*** Attach Middleware ***/
// api.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept-Authorization"
//     );
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//     next();
// });

/*** Attach Routes ***/
api.use("/vote", voteRoutes);
api.use("/session", sessionRoutes);
api.use("/user", userRoutes);

/*** Routes Enabled for Single User Login */
api.post("/login", (req, res, next) => {
    console.log("redirecting...");
    res.redirect(308, `session/single-user-login`);
});

export default api;
