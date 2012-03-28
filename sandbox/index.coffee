class Toolbar extends mvc.View
  @registerClass 'Toolbar'
  
  events:
    'click': 'on_click'
  constructor: (options) ->
    super
  on_click: (e) ->
    @emit('click', e)


class Sidebar extends mvc.View
  @registerClass 'Sidebar'
  events:
    'mouseenter': 'on_mouseenter'
  constructor: (options) ->
    super
  on_mouseenter: (e) ->
    console.log 'on_mouseenter', e


class ContentView extends mvc.View
  @registerClass 'ContentView'
  constructor: (options) ->
    super

    
class SomeController extends mvc.Controller
  @registerClass 'SomeController'
  imports:
    toolbar: 'toolbar'
    sidebar: 'sidebar'
  constructor: (options) ->
    super
    @test = options.test
  message: (e) =>
    console.log @test, 'click!', e


class App extends mvc.Application
  imports:
    toolbar: 'toolbar'
    sidebar: 'sidebar'
    content: 'content-view'
    someCtr: 'some-controller'
  events: 
    'toolbar click': 'some-controller message'
  setup:
    'some-controller': [ 'SomeController', {test: "ololo"} ]
  constructor: (options = {}) ->
    @cid = 'app'
    super

new App