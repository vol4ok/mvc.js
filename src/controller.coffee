class Controller extends Module
  @extend Events
  
  idCounter: 0
  cidPrefix: 'ctr'
  _uniqueId: (prefix) -> @cidPrefix + @idCounter++
  
  constructor: (options) ->
    @cid = options?.cid ? @_uniqueId()
    root.registerObject(@cid, this)
    
  on_domReady
  
  _delegateEvents: (events) ->
    return unless events
    for src, trg  of events
      [srcId, event]  = src.split(' ')
      [trgId, method] = trg.split(' ')
      $$(srcId).bind(event, $$(trgId)[method], $$(trgId))

  _setup: (controllers) ->
    return unless controllers
    for id, ctx of controllers
      ctx.options.cid = id
      new root.getClassByName(ctx[0])(ctx[1])

  _import: (objects) ->
    return unless objects
    @[name] = $$(id) for name, id of objects