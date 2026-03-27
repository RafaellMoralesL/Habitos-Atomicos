var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async function(req, res, next) {
  try {
    const { username, password } = req.body;

    // Generacion de salt y hash utilizando bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar en la base de datos el usuario
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error en el registro", "description":error.toString() });
}
});


  // Loguear usuario
//router.post('/login', async function (req, res, next){
  //try {
   // const { username, password } = req.body;
    
    //  Buscar usuario en la base de datos
   // const user = await User.findOne({ username });
    //if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
    
    // Comparar password con el hash guardado
    //const isMatch = await bcrypt.compare(password, user.password);

    router.post('/login', async function (req, res, next){
  try {
    const { username, password } = req.body;
    console.log('Username:', username);
    console.log('Password recibido:', password);
    console.log('Password length:', password?.length);
    
    const user = await User.findOne({ username });
    console.log('Usuario encontrado:', user ? 'sí' : 'no');
    console.log('Password en DB:', user?.password);
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('bcrypt compare result:', isMatch);

    if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

    // Generar un JWT para la sesion
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const isProduction = process.env.NODE_ENV === 'production';


    res.cookie('habitToken',  token, {
      httpOnly: false, // Previene acceso desde JS (XSS) = malo muy malo
      secure: isProduction, // Solo HTTPS usado
      sameSite: isProduction ? 'none' : 'lax', // Hace que no se envie a otras paginas
      maxAge: 7 * (24) * 60 * 60 * 1000
    });

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
      res.status(500).json({ error: "Error en el login", "description":error.toString() });
}
});
module.exports = router;
