const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

function createToken(_id) {
    return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: "3d"});
}

async function signUp(req, res) {
    const { email, password, userName, displayPicture } = req.body;

    try {
        console.log('Signup attempt:', { email, userName });
        
        // Validate input
        if (!email || !password || !userName) {
            console.log('Missing required fields');
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check password length
        if (password.length < 6) {
            console.log('Password too short');
            return res.status(400).json({ error: "Password must be greater than six characters" });
        }

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
        if (existingUser) {
            console.log('User already exists:', existingUser);
            return res.status(400).json({ 
                error: existingUser.email === email ? "Email already in use" : "Username already in use" 
            });
        }

        // Create user
        console.log('Creating new user...');
        const user = await User.create({
            email,
            password,
            userName,
            displayPicture
        });
        
        console.log('User created successfully:', user);
        const token = createToken(user._id);
        
        res.status(200).json({ 
            id: user._id, 
            displayPicture, 
            token, 
            email, 
            userName
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({ error: error.message });
    }
}

async function Login(req, res) {
    const { email, password, userName } = req.body;

    try {
        const user = await User.login(email, password, userName);
        const token = createToken(user._id);

        res.status(200).json({ id: user._id, displayPicture: user.displayPicture, token, email, password, userName })
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

async function deleteAccount(req, res) {
    const { id } = req.params;

    try {
        const user = await User.findOneAndDelete({ _id: id,});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

async function findUser(req, res) {
    const { userName } = req.params;
    
    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({error: "User doesn't exist"});
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

async function updateUser(req, res) {
    const { userName, email, displayPicture } = req.body;
    const userId = req.user._id;

    try {
        // Check if username is already taken by another user
        if (userName) {
            const existingUser = await User.findOne({ userName, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ error: "Username is already taken" });
            }
        }

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ error: "Email is already taken" });
            }
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                $set: { 
                    ...(userName && { userName }),
                    ...(email && { email }),
                    ...(displayPicture && { displayPicture })
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    signUp,
    Login,
    deleteAccount,
    findUser,
    updateUser
}; 