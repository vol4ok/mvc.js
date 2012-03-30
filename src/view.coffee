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
    @cid ?= options.id or @el.attr('id') or $.uniqId(@cidPrefix)
    registerObject(@cid, this)
    @data = @el.data()
    @events = $.extend {}, @constructor.events, @events
    $.on 'loaded', => 
      @_import(@imports)
      @_delegateEvents(@events)
      @refreshElements() if @elements
    

  release: (callback) => 
    @emit('release')
    @el.remove()
      
  $: (selector) -> $(selector, @el)
  
  refreshElements: ->
    for key, value of @elements
      @[value] = @$(key)

  _delegateEvents: (events) ->
    return unless events
    for key, method of events
      unless typeof(method) is 'function'
        method = @proxy(@[method])
      match      = key.match(@eventSplitter)
      eventName  = match[1]
      selector   = match[2]
      if selector is ''
        @el.on(eventName, method)
      else
        @el.delegate(selector, eventName, method)
  