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

/**
 * token expired
 * 60*60*24*30
 * 60 segundos
 * 60 minutos
 * 24 horas
 * 30 dias
 */

process.env.EXPIRED_TOKEN = '48h';

/**
 * secret token
 */

process.env.SEED = process.env.SEED || 'secret-seed';

/**
 * google client id
 */

process.env.CLIENT_ID = process.env.CLIENT_ID || '660910679754-7tgt311r4fd02nmubaj439bmo8ou36jl.apps.googleusercontent.com';