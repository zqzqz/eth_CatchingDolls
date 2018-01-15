# doc for frontend development
## General Introduction
frontend use 'webpack' tool.  
'webpack' will compile js files into one js file in directory './src/public/dist'  
the config file is ./webpack.config.js  
The compile action is launched automatically when executing "npm run dev" and setting up the server.  
The server will restart defaultly when source files are changed dynamically.  
## Get Started
e.g.  
view file:  ./src/views/index.html  
js file:  ./src/public/javascripts/index.js  
css file: ./src/public/stylesheets/index.css   
in index.js add
```
import "../stylesheets/index.css"
```
in index.html add
```
<script src="dist/index.js"></script>
```
check entry_map in webpack.config.js  
```
var entry_map = {
  'index': './src/public/javascripts/index.js',
}
```

