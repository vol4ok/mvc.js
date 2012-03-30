(function() {
  var App, ContentView, Sidebar, SomeController, Toolbar,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Toolbar = (function(_super) {

    __extends(Toolbar, _super);

    Toolbar.registerClass('Toolbar');

    Toolbar.prototype.events = {
      'click #test': 'on_click'
    };

    function Toolbar(options) {
      Toolbar.__super__.constructor.apply(this, arguments);
    }

    Toolbar.prototype.on_click = function(e) {
      return this.emit('click', e);
    };

    return Toolbar;

  })(mvc.View);

  Sidebar = (function(_super) {

    __extends(Sidebar, _super);

    Sidebar.registerClass('Sidebar');

    Sidebar.prototype.events = {
      'mouseenter': 'on_mouseenter'
    };

    function Sidebar(options) {
      Sidebar.__super__.constructor.apply(this, arguments);
    }

    Sidebar.prototype.on_mouseenter = function(e) {
      return console.log('on_mouseenter', e);
    };

    return Sidebar;

  })(mvc.View);

  ContentView = (function(_super) {

    __extends(ContentView, _super);

    ContentView.registerClass('ContentView');

    function ContentView(options) {
      ContentView.__super__.constructor.apply(this, arguments);
    }

    return ContentView;

  })(mvc.View);

  SomeController = (function(_super) {

    __extends(SomeController, _super);

    SomeController.registerClass('SomeController');

    SomeController.prototype.imports = {
      toolbar: 'toolbar',
      sidebar: 'sidebar'
    };

    function SomeController(options) {
      this.message = __bind(this.message, this);      SomeController.__super__.constructor.apply(this, arguments);
      this.test = options.test;
    }

    SomeController.prototype.message = function(e) {
      return console.log(this.test, 'click!', e);
    };

    return SomeController;

  })(mvc.Controller);

  App = (function(_super) {

    __extends(App, _super);

    App.prototype.imports = {
      toolbar: 'toolbar',
      sidebar: 'sidebar',
      content: 'content-view',
      someCtr: 'some-controller'
    };

    App.prototype.events = {
      'toolbar click': 'some-controller message'
    };

    App.prototype.setup = {
      'some-controller': [
        'SomeController', {
          test: "ololo"
        }
      ]
    };

    function App(options) {
      if (options == null) options = {};
      this.cid = 'app';
      App.__super__.constructor.apply(this, arguments);
    }

    return App;

  })(mvc.Application);

  new App;

}).call(this);
