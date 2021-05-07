var express = require('express')
var mysql = require('mysql')

var cors = require('cors')
var app = express()
app.use(express.json())

app.use(cors()) // esto es importante para que un archivo html use la api sin problemas dle protocolo cors 

var Firebird = require('firebird-limber');

// const { StringDecoder } = require('string_decoder');
// const decoder = new StringDecoder('utf8');

var options = {};
 
options.host = '192.168.0.8';
options.port = 3050;
options.database = '//home/datos/casa.gdb';
options.user = 'SYSDBA';
options.password = 'masterkey';
options.lowercase_keys = false; // set to true to lowercase keys
options.role = null;            // default
options.pageSize = 4096;        // default when creating database





//establecemos los parametros de conexion
var conexion = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: '',
  database: 'articulos db'
})

//probamos la conexion
conexion.connect(function(error){
  if(error){
    throw error
  }else{
    console.log('la conexion es exitosa')
  }
})



app.get('/', function(request, response){
  response.send('Ruta Inicio')
})


// traer todos los articulos
app.get('/api/articulos/' , (request , response) => {
  // conexion.query('SELECT * FROM articulos' , (error,fila) => {
  //   if(error){
  //     throw error
  //   }else{
  //     response.send(fila)
  //   }
  // })

  Firebird.attach(options, function(err, db) {

    if (err)
        throw err;
  
    // db = DATABASE
    db.query('SELECT * FROM TT_VT2021_MONITORES_A1', function(err, result ) {
        // IMPORTANT: close the connection
        response.send(result)
        db.detach();
    });
  
  });
})





//traer articulos especifico
app.get('/api/articulos/:id' , (request , response) => {
  conexion.query('SELECT * FROM articulos WHERE id = ?' ,[request.params.id], (error,fila) => {
    if(error){
      throw error
    }else{
      response.send(fila)
    }
  })
})






// añadir articulo
app.post('/api/articulos' , (request, response) => {
  let data = {descripcion: request.body.descripcion , precio: request.body.precio, stock: request.body.stock}
  let sql = "INSERT INTO articulos SET ?"
  conexion.query(sql, data, function(error,results){
    if(error){
      throw error
    }else{
      response.send(results)
    }
  })
})

//editar articulo
app.put('/api/articulos/:id', (request,response) => {
  let id = request.params.id
  let descripcion = request.body.descripcion
  let precio = request.body.precio
  let stock = request.body.stock
  let sql = "UPDATE articulos SET descripcion = ?, precio = ? , stock = ? WHERE id = ?"
  conexion.query(sql, [descripcion, precio, stock, id] , function(error, results){
      if(error){
        throw error
      }else{
        response.send(results)
      }
  })
})


//eliminar articulo
app.delete('/api/articulos/:id', (request , response) => {
  conexion.query('DELETE FROM articulos WHERE id = ?' , [request.params.id] , function(error, filas){
    if(error){
      throw error
    }else{
      response.send(filas)
    }
  })
})





const puerto = process.env.PUERTO || 3000



app.listen(puerto , function(){
  console.log('servidor listo en el puerto: ' + puerto)
})