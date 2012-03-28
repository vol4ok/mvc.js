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
      [srcId, event]  = src.split(' ')
      [trgId, method] = trg.split(' ')
      $$(srcId).on(event, $$(trgId)[method])

  _setup: (controllers) ->
    return unless controllers
    for id, ctx of controllers
      ctx[1].cid = id
      new (getClassByName(ctx[0]))(ctx[1])

  _import: (objects) ->
    return unless objects
    @[name] = $$(id) for name, id of objects