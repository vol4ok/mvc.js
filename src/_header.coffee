$__objects = {}
$__classes = {}
  
registerObject = (id, object)  -> $__objects[id]   = object
registerClass  = (name, klass) -> $__classes[name] = klass
registerObjects = (hash) -> $__objects[id]   = obj for id, obj of hash
registerClasses = (hash) -> $__classes[name] = klass for name, klass of hash
$$ = getObjectById = (id) -> $__objects[id]
getClassByName = (name) -> $__classes[name]

$ -> $.emit('loadddd')
$.on 'load', -> $.defer -> $.emit('loaded')