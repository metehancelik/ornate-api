const bcrypt = require("bcryptjs")
const AppError = require("../utils/appError")
const User = require('../schemas/user')
const { sign, verify } = require("../utils/jwt")
const { encrypt, decrypt } = require("../utils/session")


exports.registerUser = async (userInput) => {
    const { firstName, lastName, offerupNick, password, role } = userInput
    // create the user
    const newUser = await User.create({
        firstName, lastName, offerupNick, password, role
    })
    return {
        offerupNick: newUser.offerupNick,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        createdAt: newUser.createdAt
    }
}

exports.loginUser = async (req, res) => {
    const { offerupNick, password, remember } = req.body
    // check if email and password exist
    if (!offerupNick || !password) {
        throw new AppError(400, 'Please provide an email and a password')
    }
    // check if user exists
    const user = await User.findOne({
        offerupNick
    })
    if (!user) {
        throw new AppError(400, 'Incorrect email or password')
    }
    if (user.status === "passive") {
        throw new AppError(400, 'The user no longer exists')
    }
    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        throw new AppError(400, 'Incorrect email or password')
    }

    return await createSession(req, user)
}


exports.checkUserSession = async (session) => {
    if (!session) throw new AppError(401, 'Invalid Session')
    // decrypt token from session and verify
    const token = decrypt(session)
    const decoded = await verify(token, process.env.JWT_SESSION_SECRET)
    // fetch user from db
    const user = await User.findById(decoded.id)
    // check if user exists and active
    // if (!user || user.status !== "active") throw new AppError(401, 'The user no longer exists')
    return {
        id: user._id,
        offerupNick: user.offerupNick,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
    }
}

/*
UTILITY FUNCTIONS
*/
const createSession = async (req, user) => {
    const data = { id: user._id, role: user.role }
    const token = await sign(data, process.env.JWT_SESSION_SECRET, process.env.JWT_SESSION_EXPIRY)
    const session = await encrypt(token)
    // create a cookie expiry date in compatible w jwt lifetime
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000 * +process.env.JWT_SESSION_EXPIRY.slice(0, -1))
    const config = {
        expires: expiry,
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: process.env.NODE_ENV === "development" ? "Lax" : "Strict"
    }
    return { session, config }
}