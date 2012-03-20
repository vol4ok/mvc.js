viewOptions = ['el', 'id', 'attributes', 'className', 'tagName']
  
class View extends Controller
  eventSplitter: /^(\S+)\s*(.*)$/

  tag: 'div'

  constructor: (options) ->
    super
    @options = options

    for key, value of @options
      @[key] = value

    @el = document.createElement(@tag) unless @el
    @el = $(@el)

    @el.addClass(@className) if @className
    @el.attr(@attributes) if @attributes

    @events = @constructor.events unless @events
    @elements = @constructor.elements unless @elements

    @delegateEvents(@events) if @events
    @refreshElements() if @elements

  release: (callback) => 
    @trigger('release')
    @el.remove()
      

  $: (selector) -> $(selector, @el)

  delegateEvents: (events) ->
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

  refreshElements: ->
    for key, value of @elements
      @[value] = @$(key)