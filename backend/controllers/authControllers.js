
const { getIO } = require("../socket.js");
const axios = require("axios");
const User = require("../models/User.js");

const githubCallback = async (req, res) => {
    try {
        const io = getIO();
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({
                message: "Authorization code not found",
            });
        }

        // Exchange GitHub authorization code for access token
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: process.env.GITHUB_CALLBACK_URL,
            },
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) {
            return res.status(401).json({
                message: "GitHub access token not received",
            });
        }

        // Fetch GitHub user details
        const githubUserResponse = await axios.get(
            "https://api.github.com/user",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        const githubUser = githubUserResponse.data;

        const existingUser = await User.findOne({
            githubId: githubUser.id.toString(),
        });

        // Create or update user
        const user = await User.findOneAndUpdate(
            {
                githubId: githubUser.id.toString(),
            },
            {
                githubId: githubUser.id.toString(),
                username: githubUser.login,
                name: githubUser.name || "",
                avatar: githubUser.avatar_url,
                bio: githubUser.bio || "",
                profileUrl: githubUser.html_url,
            },
            {
                new: true,
                upsert: true,
            }
        );

        // Notify connected users about a new registration
        if (!existingUser) {
            io.emit("newUser", user);
        }

        // Save authenticated user in session
        req.session.userId = user._id.toString();
        req.session.githubAccessToken = accessToken;

        // Save session before redirecting
        req.session.save((error) => {
            if (error) {
                console.log("Session save failed:", error);

                return res.status(500).send(
                    "Session creation failed"
                );
            }

            res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
        });

    } catch (error) {
        console.log(error.response?.data || error.message);

        res.status(500).json({
            message: "GitHub authentication failed",
        });
    }
};

// Logout
const logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                message: "Failed to logout",
            });
        }

        res.clearCookie("connect.sid", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
        });

        res.status(200).json({
            message: "Logout successful",
        });
    });
};

module.exports = {
    githubCallback,
    logout,
};
