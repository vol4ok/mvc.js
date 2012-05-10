nlink = require 'nlink'

SRC_DIR =  "#{__dirname}/src"
DST_DIR =  __dirname

build = ->
  nlink "#{SRC_DIR}/mvc.coffee", outdir: DST_DIR
    
task 'build', 'Builds mvc.js lib form src', ->
  build()