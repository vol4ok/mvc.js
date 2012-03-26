module 'mvc'
include 'core.js'

__embed('module.js')
__embed('controller.js')
__embed('model.js')
__embed('view.js')
__embed('collection.js')
__embed('application.js')

exports extends {Module, Controller, Model, View, Collection, Application}