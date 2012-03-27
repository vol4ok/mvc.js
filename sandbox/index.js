(function() {
  var App, ContentView, Sidebar, Toolbar,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Toolbar = (function(_super) {

    __extends(Toolbar, _super);

    function Toolbar(options) {
      this.cid = options.el.id;
      Toolbar.__super__.constructor.apply(this, arguments);
    }

    return Toolbar;

  })(Controller);

  Sidebar = (function(_super) {

    __extends(Sidebar, _super);

    function Sidebar(options) {
      this.cid = options.el.id;
      Sidebar.__super__.constructor.apply(this, arguments);
    }

    return Sidebar;

  })(Controller);

  ContentView = (function(_super) {

    __extends(ContentView, _super);

    function ContentView(options) {
      this.cid = options.el.id;
      ContentView.__super__.constructor.apply(this, arguments);
    }

    return ContentView;

  })(Controller);

  App = (function(_super) {

    __extends(App, _super);

    App.prototype.imports = {
      toolbar: 'toolbar',
      sidebar: 'sidebar',
      content: 'content-view'
    };

    App.prototype.events = {};

    App.prototype.setup = {};

    function App(options) {
      if (options == null) options = {};
      this.cid = 'app';
      App.__super__.constructor.apply(this, arguments);
    }

    return App;

  })(mvc.Application);

  mvc.registerClasses({
    Toolbar: Toolbar,
    Sidebar: Sidebar,
    ContentView: ContentView,
    App: App
  });

  new App;

}).call(this);
