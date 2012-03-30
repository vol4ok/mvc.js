class Controller extends Module
  @include $.EventEmitter::
  cidPrefix: 'ctr'
  constructor: (options) ->
    @cid ?= options?.cid ? $.uniqId(@cidPrefix)
    registerObject(@cid, this)
    @_setup(@setup)
    $.on 'loaded', => 
      @_import(@imports)
      @_delegateEvents(@events)
  
  _delegateEvents: (events) ->
    return unless events
    for src, trg  of events
      [srcObj, event]  = if (t = src.split(' ')).length is 1 then [this, t[0]] else [$$(t[0]), t[1]]
      [trgObj, method] = if (t = trg.split(' ')).length is 1 then [this, t[0]] else [$$(t[0]), t[1]]
      srcObj.on(event, trgObj[method])

  _setup: (controllers) ->
    return unless controllers
    for id, ctx of controllers
      ctx[1].cid = id
      new (getClassByName(ctx[0]))(ctx[1])

  _import: (objects) ->
    return unless objects
    @[name] = $$(id) for name, id of objects