import dotenv from "dotenv"
import { app } from "./app"
import { PORT } from "./constants"
dotenv.config({
    path: './.env'
})

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`))