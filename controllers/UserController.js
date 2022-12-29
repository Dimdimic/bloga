import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {  
      const password = req.body.password; //открытый пароль
     const salt = await bcrypt.genSalt(10); //метод шифрования
     const hash = await bcrypt.hash(password, salt); //зашифрованный пароль
 
     const doc = new UserModel({
         email: req.body.email,
         fullName: req.body.fullName,
         avatarUrl: req.body.avatarUrl,
         passwordHash: hash,
     });
 
     const user = await doc.save();
 
     const token = jwt.sign(
         {
         _id: user._id,
         },
         'secret123',
         {
             expiresIn: '30d',
         }
     );
 
     const {passwordHash, ...userData} = user._doc;
 
     res.json({
         ...userData,
         token,
     });
    } catch (err) {
     console.log(err);
     res.status(500).json({
         message: 'No register',
     });
    }
 };

 export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Login or parol',
            });
        }

        const token = jwt.sign(
            {
            _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );
        const {passwordHash, ...userData} = user._doc;

        res.json({
        ...userData,
        token,
    });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'No avtorizations',
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if(!user) {
            return req.status(404).json({
                message: 'Polzovatel ne nayden',
            });
        }



        const {passwordHash, ...userData} = user._doc;

    res.json(userData);
    } catch (err) {
        console.log(err);
    res.status(500).json({
        message: 'No dostupa',
    });
    }
};