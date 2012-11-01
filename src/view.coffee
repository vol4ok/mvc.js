viewOptions = ['el', 'id', 'attributes', 'className', 'tagName', 'template']
  
class View extends Controller
  cidPrefix: 'view'
  eventSplitter: /^(\S+)\s*(.*)$/
  tag: 'div'
  
  constructor: (options = {}) -> 
    for key, value of options when key in viewOptions
      @[key] = value
    unless @el
      @el = document.createElement(@tag) unless @el
      @el = $(@el)
      @el.attr('id', options.id) if options.id
      @el.addClass(@className) if @className
      @el.attr(@attributes) if @attributes
    else
      @el = $(@el)
    @raw = @el[0]
    @raw.view = this
    @cid ?= options.cid or options.id or @el.attr('id') or @el.data('cid') or $.uniqId(@cidPrefix)
    registerObject(@cid, this)
    @data = @el.data() or {}
    @_initializeMixins()
    @_setupControllers(@setup)
    @import(@imports)
    @delegateEvents(@events)
    @refreshElements(@elements)
    

  release: (callback) => 
    @emit('release')
    @el.remove()
      
  $: (selector) -> $(selector, @el)

  _renderTemplate: renderTemplate
  
  refreshElements: (elements) ->
    return unless elements
    for key, value of elements
      @[key] = @$(value)

  delegateEvents: (events) ->
    return unless events
    for key, method of events
      unless typeof(method) is 'function'
        method = @proxy(@[method])
      match      = key.match(@eventSplitter)
      eventName  = match[1]
      selector   = match[2]
      if selector is 'document'
        $(document).on(eventName, method)
      else if selector is ''
        @el.on(eventName, method)
      else
        @el.delegate(selector, eventName, method)
  
exports.View = View