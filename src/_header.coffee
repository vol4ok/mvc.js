__objects = {}
__classes = {}
__templates = {}
__engine = (src, locals, partials) -> src
  
registerObject = (id, object)  -> __objects[id]   = object
registerClass  = (name, klass) -> __classes[name] = klass
registerObjects = (hash) -> __objects[id]   = obj for id, obj of hash
registerClasses = (hash) -> __classes[name] = klass for name, klass of hash
$$ = getObjectById = (id) -> __objects[id]
getClassByName = (name) -> __classes[name]

registerTemplate = (name, template) -> __templates[name] = template
registerTemplateEngine = (engine) -> __engine = engine
$T = renderTemplate = (name, locals, partials) -> __engine(__templates[name], locals, partials)


$ -> $.emit('load')
$.on 'load', -> $.defer -> $.emit('loaded')

# __options = {}
# set = (opt, value) -> __options[opt] = value
# get = (opt) -> __options[opt]
# enable = (opt) -> __options[opt] = true
# disable = (opt) -> __options[opt] = false