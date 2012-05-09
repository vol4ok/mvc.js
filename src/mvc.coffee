module 'mvc'

$__objects = {}
$__classes = {}
  
registerObject = (id, object)  -> $__objects[id]   = object
registerClass  = (name, klass) -> $__classes[name] = klass
registerObjects = (hash) -> $__objects[id]   = obj for id, obj of hash
registerClasses = (hash) -> $__classes[name] = klass for name, klass of hash
$$ = getObjectById = (id) -> $__objects[id]
getClassByName = (name) -> $__classes[name]

$ -> $.emit('load')
$.on 'load', -> $.defer -> $.emit('loaded')

LINK_AND_EMBED('_module')
LINK_AND_EMBED('_controller')
# EMBED('_model')
LINK_AND_EMBED('_view')
# EMBED('_collection')
LINK_AND_EMBED('_application')

$.extend exports, {
  Module
  Controller
  # Model
  View
  # Collection
  Application
  registerObject
  registerClass
  registerObjects
  registerClasses
  getObjectById
  getClassByName
  #debug
  $$
  $__objects
  $__classes
}