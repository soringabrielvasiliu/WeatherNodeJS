FOLDERS:
APP -> 	ROUTES.JS: 


JAVASCRIPT
getElementById()   innerHTML
document.getElementById("demo").innerHTML = "Hello JavaScript";




The app object has methods for:

Routing HTTP requests; see for example, app.METHOD and app.param.
Configuring middleware; see app.route.
Rendering HTML views; see app.render.
Registering a template engine; see app.engine.


app.get(path, callback [, callback ...])
Routes HTTP GET requests to the specified path with the specified callback functions. For more information, see the routing guide.

You can provide multiple callback functions that behave just like middleware, except these callbacks can invoke next('route') to bypass the remaining route callback(s). You can use this mechanism to impose pre-conditions on a route, then pass control to subsequent routes if there’s no reason to proceed with the current route.


CALLBACK
is an asynchronous equivalent for a function
a callback funtion is called at the completion of a iven task


JavaScript-Node.js
limbaj de tip SCRIPT-interpretat-nu necesita i/o in mod implicit

Permite dezvoltarea de aplicații Web
la nivel de server în limbajul JavaScript

recurge la V8 – procesor (interpretor) JavaScript -engine
creat de Google și disponibil liber

Operațiile de intrare/ieșire sunt asincrone:
fiecare cerere (operație) adresată aplicației
– e.g., acces la disc, la rețea, la alt proces – poate avea
atașată o funcție de tratare a unui eveniment specific

blocking-sincron
non-blocking-asincron