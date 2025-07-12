import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/test", async (req, res) => {
  try {
    res.send("I'm up");
  } catch (error) {
    console.error(error);
  }
});

import OAuthRouter from "./routes/auth/oauth.route";
import authRouter from "./routes/auth/auth.route";
import userRouter from "./routes/user/user.route";
import mediaRouter from "./routes/media/media.route";

// authentication
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/oauth", OAuthRouter);

// user
app.use("/api/v1/user", userRouter);

// media
app.use("/api/v1/media", mediaRouter);

export { app };
