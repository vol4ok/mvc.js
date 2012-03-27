class Toolbar extends Controller
  constructor: (options) ->
    @cid = options.el.id
    super

class Sidebar extends Controller
  constructor: (options) ->
    @cid = options.el.id
    super
    
class ContentView extends Controller
  constructor: (options) ->
    @cid = options.el.id
    super

class App extends mvc.Application
  imports:
    toolbar: 'toolbar'
    sidebar: 'sidebar'
    content: 'content-view'
  events: {}
  setup: {}

  constructor: (options = {}) ->
    @cid = 'app'
    super

mvc.registerClasses({Toolbar, Sidebar, ContentView, App})
new App