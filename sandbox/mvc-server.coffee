require('zappa').run 3004, ->
  @use 'bodyParser', @app.router, static: __dirname
  @configure
    development: => @use errorHandler: {dumpExceptions: on}
    production: => @use 'errorHandler'