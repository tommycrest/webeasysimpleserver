var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
var __nomedb = 'application.db';

/**
	database creation for future work
*/
function databaseCreation(application) {
 var __pathSchema = __dirname+'/public/application/'+application+'/db/'+__nomedb;
 
 var __existsSchema = fs.existSync( __pathSchema );
 if( !__existsSchema ) {
	console.log('Schema creation ');
	fs.openSync(__pathSchema, 'w' );
 }
}

/**
	databse schema creation: for future work
*/
function databaseSchemaCreation(application, dbtype) {
	databaseCreation(application);
	var db = null;
	var instance = null;
	if( __dbtype == 'sqlite3' ) {
		instance = require('sqlite3').verbose();
		db = new sqlite3.databse( __nomedb );
			db.serialize(function() {
				//db.run();
		});
	}

}

/**
 db link for future work
*/
function activateDbLinking() {
	var allApplication = __dirname+'/public/application/';
	var __file = '/db/application.db';
	
	fs.readdir(allApplication, function(err, files) {
		if (err) return;
		files.forEach(function(f) {
			/* console.log('directory ' + f); */
			//Attivo i becessari se esistono all'interno della struttura nella cartella db/
			var exists = false;
			var __database = allApplication+f+__file;
			fs.readdir(allApplication+f+__database, function(err, files) {
				/* console.log('database '+__database); */
				exists = fs.existsSync( __database );
				/* console.log(exists); */
				if( !exists ) {
					console.log('Creazione db sqlite3 '+__database);
					fs.openSync(__database, 'w' );
				}
			});
		});
	});
}

/**
	getFile
	Get the static file from subfolder of "public"
	otherwise 404.html
*/
function getFile( filePath, res, pageNotFound, req ) {
		fs.exists(filePath, function(exists) {
		if(exists) {
			//the resource exist on file system
			fs.readFile(filePath, function(errors, contents ) {
				if(!errors) {
					var dotoffset = req.url.lastIndexOf('.');
					var mimetype = dotoffset == -1
                            ? 'text/plain'
                            : {
                                '.html' : 'text/html',
                                '.ico' : 'image/x-icon',
                                '.jpg' : 'image/jpeg',
                                '.png' : 'image/png',
                                '.gif' : 'image/gif',
                                '.css' : 'text/css',
                                '.js' : 'text/javascript'
                                }[ req.url.substr(dotoffset) ];
					res.setHeader('Content-type' , mimetype);
					res.end(contents);
					//console.log( req.url, mimetype );
				} else {
				 console.dir(errors);
				}
			});
		} else {
			fs.readFile(pageNotFound, function(errors, contents ) {
				if(!errors) {
					res.writeHead(404, {"Content-Type": "text/html"});
					var errorPage = fs.readFileSync(pageNotFound);
					res.write(errorPage);				
					res.end();
				} else {
				 console.dir(errors);
				}
			});
		}
	});
}

String.prototype.includes = String.prototype.includes || function(str) {
  return this.indexOf(str) > -1;
}

/**
	requestHandler: 
	the handler perform the request on the server
*/
function requestHandler( req, res ) {
	var fileName = url.parse(req.url).pathname || 'index.html', localFolder = __dirname + '/public', pageNotFound = localFolder + '/404.html';
	getFile((localFolder + fileName),res,pageNotFound,req);
}

var port = 9000;
http.createServer(requestHandler).listen(port);
console.log("WEBEasy http server is running on port "+port);
/* activateDbLinking(); */
/* processPlatform(); */
