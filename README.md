# Habitos-Atomicos  
## Si se quiere empezar de 0:  
El proyecto de Habitos atomicos consta de backend simple y un frontend, para iniciar el backend, se debe tener la plantilla de expressjs, instalar las dependencias incluidas en dicha plantilla con:  
`npm install`  
se debe crear un .env, una carpeta config con un archivo js llamado database.  
En el .env, se debe colocar el puerto local a usar, en este caso el 3001, y el url de la base de datos de mongoDB proveida por el mismo sitio para lo conexión.  
En el archivo app.js incluido en la plantilla se debe colocar:  
`require('./config/database');`  
Para que lea el archivo el programa  
Se debe instalar las dependencias de mongoose, dotenv y cors.  
`npm install mongoose dotenv cors`  
-Dentro del archivo database.js  
Se debe incluir una constante mongoose que indique que se requiere mongoose y otra linea de código que indique que se requiere dotenv y su configuración  
Ejemplo:  
`const mongoose = require('mongoose');
require('dotenv').config();`  
Se utiliza el método de mongoose para conectar con nodejs:  
`mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected'))
    .catch((err) => console.log('MongoDB connection error', err));
module.exports = mongoose;`  
En el archivo index dentro de la carpeta "routes" en la plantilla, se crean los métodos para postear, conseguir y borrar los hábitos, incluyendo métodos de try/catch  
Se crea una carpeta models y se introduce un archivo js para la clase habitos o habits.  
Dentro de este archivo, se exporta el requerimiento de mongoose y se crea un schema de los habitos, siendo este un `mongoose.Schema`  
El hábito está en formato json, y debe llevar un título con el tipo string y que sea requerido/obligatorio, una descripción del tipo string, también obligatorio, y una fecha, del tipo date que utiliza el método Datenow como default, para que se agregue automáticamente la fecha en la que se agregó el hábito, luego se exporta un modelo de mongoose ('Habit', habitschema); para que se guarde con formato.  
  
## Si se quiere empezar directamente el backend o el proyecto:  
Para empezar el proyecto, solo se debe usar   
`npm start`  
En una terminal dentro del proyecto.  
