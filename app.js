
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , agent = require('superagent');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

var example = "www.threelas.com/feeds/posts/default?alt=json";

app.get('/', routes.index);

app.get('/REST', function(req,res){
	agent
		.get(req.param('url') || example)
		.end(function(RESTresp){
			var entries = RESTresp.body.feed.entry;
			for (var i=0; i<entries.length; i++){
				res.write("<h1>" + entries[i].title.$t + '</h1><p>' + entries[i].content.$t + "</p>");
			}
			res.send();
		})
})

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
