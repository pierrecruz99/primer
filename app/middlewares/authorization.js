import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import {usuarios} from "../controllers/authentication.controller.js";

dotenv.config();

function soloAdmin(req, res, next){
    const logueado = revisarCookie(req);
    if (logueado) return next();
    return res.redirect("/")
}

function soloPublico(req, res, next){
    const logueado = revisarCookie(req);
    if (!logueado) return next();
    return res.redirect("/admin")
}

function revisarCookie(req) {
    try {
        const cookieJWT = req.headers.cookie.slice(4);
        console.log("COOKIE", cookieJWT);
        const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
        console.log(decodificada);
        const usuarioARevisar = usuarios.find(usuario => usuario.user === decodificada.user);
        console.log(usuarioARevisar);   
        if (!usuarioARevisar) {
            return false
        }
        return true;
    } catch {
        return false;
    }
}

export const methods = {
    soloAdmin,
    soloPublico,

}