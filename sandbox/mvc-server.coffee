require('zappa').run 3004, ->
  {exists, join, extname} = require 'path'
  stylus = require 'stylus'
  ck = require 'coffeekup'
  fs = require 'fs'
  coffee = require 'coffee-script'
  
  @use 'bodyParser', @app.router
  @use stylus.middleware
    src: __dirname
    dest: __dirname
    force: true 
    compress: yes
    debug: yes
    
  @use (req, res, next) ->
    htmlRE = /\.(html|htm)*$/
    fn = /\/([^\/]*)$/.exec(req.url)[1]
    fn = 'index' if fn is ''
    fn += ".html" if extname(fn) is ''
    if htmlRE.test(fn)
      orig = fn
      fn = fn.replace(htmlRE, '.ck')
      origPath = join(__dirname, orig)
      fnPath = join(__dirname, fn)
      exists fnPath, (isExists) ->
        if isExists
          #fs.stat fnPath, (err, stat) -> console.log 'fn', stat.mtime.getTime()
          #fs.stat origPath, (err, stat) -> console.log 'orig', stat.mtime.getTime()
          fs.readFile fnPath, 'utf-8', (err, data) ->
            html = ck.render(data) 
            fs.writeFile origPath, html, 'utf-8',  (err) ->
              next()
        else
          next()
        
    else
      next()
      
  @use (req, res, next) ->
    jsRE = /\.js*$/
    fn = /\/([^\/]*)$/.exec(req.url)[1]
    if jsRE.test(fn)
      orig = fn
      fn = fn.replace(jsRE, '.coffee')
      exists join(__dirname,fn), (isExists) ->
        if isExists
          fs.readFile join(__dirname,fn), 'utf-8', (err, data) ->
            js = coffee.compile(data) 
            fs.writeFile join(__dirname, orig), js, 'utf-8',  (err) ->
              next()
        else
          next()
    else
      next()
      
  @use static: __dirname
  @use errorHandler: { dumpExceptions: on }
    