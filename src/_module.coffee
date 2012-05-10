moduleKeywords = ['included', 'extended']

class Module
  @registerClass: (name) -> 
    @::__className = name
    registerClass(name, this)

  @include: (obj) ->
    throw('include(obj) requires obj') unless obj
    for key, value of obj when key not in moduleKeywords
      @::[key] = value
    obj.included?.apply(this)
    return this

  @extend: (obj) ->
    throw('extend(obj) requires obj') unless obj
    for key, value of obj when key not in moduleKeywords
      @[key] = value
    obj.extended?.apply(this)
    return this
    
  @mixin: (klass) ->
    throw('mixin(klass) requires klass') unless klass
    @include(klass::)
    @::_mixins ?= {}
    unless @::_mixins[@name]
      t = {}
      for key,val of @::_mixins
        $.extend(t,val)
      @::_mixins[@name] = t
    @::_mixins[@name][klass.name] = klass
    return this

  @proxy: (func) ->
    => func.apply(this, arguments)

  proxy: (func) ->
    => func.apply(this, arguments)

  constructor: ->
    @_initializeMixins(arguments...)
  
  _initializeMixins: ->
    return unless @_mixins
    ctor.apply(this, arguments) for key,ctor of @_mixins[@__className]
    
  getClassByName: (name) -> getClassByName(name)
  getObjectById: (name) -> getObjectById(name)
  $$: (name) -> getObjectById(name)