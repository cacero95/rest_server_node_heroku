/**
 * en etapa de desarrollo el puerto por el que va correr la
 * aplicacion va ser el 3000, mientras que si esta en production
 * el servidor los asignara mediante la variable global proccess.env.PORT
 */
process.env.PORT = process.env.PORT || 3000;