import jwt from 'jsonwebtoken'

export const generateAccessToken = (id: string, email: string, username: string, fullname: string) => {
    return jwt.sign(
        {
            id,
            email,
            username,
            fullname,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "15m"
        }
    )
}

export const generateRefreshToken = (id: string) => {
    return jwt.sign(
        {
            id,
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "14d"
        }
    )
}