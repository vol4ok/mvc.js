class Application extends Controller
    
  _initAutoloadObjects: (classList) ->
    $('.autoload').each (i, _el) =>
      try
        el = $(_el)
        el.removeClass('autoload')
        new (getClassByName(el.data('class')))(el: _el)
      catch exc
        console.error("Could not initialize a view with class: #{_el.id ? 'undefined'} and id: #{_el['data-class'] ? 'undefined'}. " + exc.toString())
      return
  
  constructor: (options = {}) ->
    super
    $.on 'load', => @_initAutoloadObjects()