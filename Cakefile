require 'colors'

$ = {}
$ extends require('fs')
coffee = require 'coffee-script'

SRC_DIR     = __dirname + '/src'
DST_DIR     = __dirname

TARGETS = [
  "_header.coffee"
  "module.coffee"
  "controller.coffee"
  "view.coffee"
  "application.coffee"
  "_footer.coffee"
]
    
task 'build', 'Builds mvc.js lib form src', ->
  data = ""
  TARGETS.forEach (file) ->
    console.log 'compile'.green, file
    data += $.readFileSync("#{SRC_DIR}/#{file}", 'utf-8')
    data += "\n"
  data = coffee.compile(data, bare: yes)
  data = '$.ns([ "./mvc", "mvc" ], function(exports) {\n' + data + '\n});'
  console.log 'write'.magenta, 'mvc.js'
  $.writeFileSync("#{DST_DIR}/mvc.js", data, "utf-8")
