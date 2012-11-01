class Controller extends Module
  @include $.EventEmitter::
  cidPrefix: 'ctr'
  
  constructor: (options) ->
    @cid ?= options?.cid ? $.uniqId(@cidPrefix)
    registerObject(@cid, this)
    @_setupControllers(@setup)
    $.on 'loaded', => 
      @import(@imports)
      @delegateEvents(@events)
  
  delegateEvents: (events) ->
    return unless events
    for src, trg  of events
      [srcObj, event]  = if (t = src.split(' ')).length is 1 then [this, t[0]] else [$$(t[0]), t[1]]
      [trgObj, method] = if (t = trg.split(' ')).length is 1 then [this, t[0]] else [$$(t[0]), t[1]]
      srcObj.on(event, trgObj[method])

  _setupControllers: (controllers) ->
    return unless controllers
    for id, ctx of controllers
      ctx[1] = {} if ctx.length < 2
      ctx[1].cid = id
      new (getClassByName(ctx[0]))(ctx[1])

  import: (imports) ->
    return unless imports
    if $.isArray(imports)
      @[$.camelize(id)] = $$(id) for id in imports
    else
      @[name] = $$(id) for name, id of imports

exports.Controller = Controller