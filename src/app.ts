import express from "express";
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get('/test', async (req, res) => {
    try {
        res.send("I'm up")
    } catch (error) {
        console.error(error);

    }
})

import OAuthRouter from './routes/auth/oauth.route'
app.use("/api/v1/auth", OAuthRouter)

export { app }