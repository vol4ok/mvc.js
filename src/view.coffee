viewOptions = ['el', 'id', 'attributes', 'className', 'tagName']
  
class View extends Controller
  cidPrefix: 'view'
  eventSplitter: /^(\S+)\s*(.*)$/
  tag: 'div'
  
  constructor: (options = {}) ->
    @cid ?= options.id or options.el?.id or $.uniqId(@cidPrefix)
    registerObject(@cid, this)   
    @options = options
    for key, value of @options when key in viewOptions
        @[key] = value
    @el  = document.createElement(@tag) unless @el
    @el = $(@el)
    @el.addClass(@className) if @className
    @.attr('id', @id) if @id
    @el.attr(@attributes) if @attributes
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
    console.log '_delegateEvents', events
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