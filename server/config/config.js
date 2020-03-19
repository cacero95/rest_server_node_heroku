/**
 * en etapa de desarrollo el puerto por el que va correr la
 * aplicacion va ser el 3000, mientras que si esta en production
 * el servidor los asignara mediante la variable global proccess.env.PORT
 */
/**
 * Port
 */
process.env.PORT = process.env.PORT || 3000;
/**
 * Enviroment declaration
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
/**
 * dba string connection
 */
process.env.URLDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/cafe' : process.env.dba_string;
console.log(process.env.URLDB);