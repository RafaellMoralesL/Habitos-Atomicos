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
router.post('/login', async function (req, res, next){
  try {
    const { username, password } = req.body;
    
    //  Buscar usuario en la base de datos
  // const user = await User.findOne({ username });
  console.log('=== DEBUG: Buscando usuario con username:', username);
  const user = await User.findOne({ username });
  console.log('=== DEBUG: user encontrado:', user);
  console.log('=== DEBUG: typeof user:', typeof user);
  console.log('=== DEBUG: user === null:', user === null);
  console.log('=== DEBUG: !user:', !user);
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
    
    // Comparar password con el hash guardado
    console.log('=== DEBUG: Antes de bcrypt.compare');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('=== DEBUG: bcrypt.compare result:', isMatch);

    if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

    // Generar un JWT para la sesion
 // Generar un JWT para la sesion
    console.log('=== DEBUG: Antes de jwt.sign, JWT_SECRET:', process.env.JWT_SECRET);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('=== DEBUG: jwt.sign completado, token:', token ? 'SÍ' : 'NO');
    console.log('=== DEBUG: >>> LLEGÓ HASTA AQUÍ, a punto de crear isProduction');
    
    const isProduction = process.env.NODE_ENV === 'production';

    const sameSiteValue = isProduction ? 'none' : 'Lax';
    console.log('=== DEBUG: sameSiteValue:', sameSiteValue, 'type:', typeof sameSiteValue);
    
    console.log('=== DEBUG: isProduction creado:', isProduction);
    console.log('=== DEBUG: >>> LLEGÓ HASTA AQUÍ, a punto de enviar respuesta');
    res.cookie('habitToken',  token, {
      httpOnly: false,
      secure: isProduction,
      sameSite: String(sameSiteValue),
      maxAge: 7 * (24) * 60 * 60 * 1000
    });
    console.log('=== DEBUG: Cookie enviada');
    
    res.json({ message: "Inicio de sesión exitoso", token });
    console.log('=== DEBUG: JSON enviado OK');
  } catch (error) {
      res.status(500).json({ error: "Error en el login", "description":error.toString() });
}
});
module.exports = router;
