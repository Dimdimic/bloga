import express from "express";
import multer from "multer";

import mongoose from "mongoose";


import { registerValidation, loginValidation, postCreateValidation } from "./validations.js";


import checkAuth from "./utils/checkAuth.js";

import {register, login, getMe} from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";



mongoose.connect('mongodb+srv://admin:wwwwww@cluster0.us80xmd.mongodb.net/blog?retryWrites=true&w=majority',
).then(()=> console.log('DB ok'))
.catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json()); 
app.use('/uploads', express.static('uploads'));

//Авторизация
app.post('/auth/login', loginValidation, handleValidationErrors, login);

//Регистрация
app.post('/auth/register',  registerValidation, handleValidationErrors, register);

//Информация о пользователе
app.get('/auth/me', checkAuth, getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});

/*app.get('/', (req, res) => {
    res.send("Hello World!");
});

console.log(req.body);

    if (req.body.email == 'test@test.ru') {
    const token = jwt.sign({
        email: req.body.email,
        fillName: 'Вася Пупкин',
    }, 'secret123',);

    }

    res.json({
        success: true,
        token,
    });

     
*/