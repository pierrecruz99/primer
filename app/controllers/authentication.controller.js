import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const usuarios = [{
    user: "a",
    email: "a@gm.com",
    password: "$2a$05$SYgAj7RXRQ7LSiFNEVfPXuLEHfFrDVEC/cxTXxe.N9Uq8jTM1BB0S"
},
{
    user: 'p',
    email: 'p@gm.com',
    password: '$2a$05$d4pezT7QWzx..Ju2xCCANu1U4BfvBP4uQqGY1Y7z0uYp2CSnnMVN2'
}]

async function login(req, res){
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
    if ( !user || !password ) {
        return res.status(400).send({status: "Error", message: "Los campos estan incompletos"})
    }
    const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
    if (!usuarioARevisar) {
        return res.status(400).send({status: "Error", message: "Error durante login"});
    }
    const loginCorrecto = await bcryptjs.compare(password, usuarioARevisar.password);
    console.log(loginCorrecto);
    if (!loginCorrecto) {
        return res.status(400).send({status: "Error", message: "Error durante login"});
    }
    const token = jsonwebtoken.sign(
        {user:usuarioARevisar.user}, 
        process.env.JWT_SECRET, 
        {expiresIn:process.env.JWT_EXPIRATION});

    const cookieOption = {
        expires: new Date (Date.now() + process.env.JWT_COOKIE_EXPIRES ** 24*60*60*1000),
        path: "/"
    };
    res.cookie("jwt",token,cookieOption);
    res.send({status:"ok", message: "Usuario logueado", redirect:"/admin"})
}

async function register(req, res){
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;

    if ( !user || !password || !email ) {
        return res.status(400).send({status: "Error", message: "Los campos estan incompletos"})
    }
    const usuarioARevisar = usuarios.find(usuario => usuario.user === user);
    if (usuarioARevisar) {
        return res.status(400).send({status: "Error", message: "Este usuario ya existe"})
    }
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password, salt);
    const nuevoUsuario = {
        user, email, password: hashPassword
    }
    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    return res.status(201).send({ status: "Ok", message: `Usuario ${nuevoUsuario.user} agregado` , redirect: "/" })
}

export const methods = {
    login,
    register
}