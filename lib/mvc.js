__ns("mvc", function(exports) {
    moduleKeywords = [ "included", "extended" ];

  Module = function() {
    Module.include = function(obj) {
      var key, value, _ref;
      if (!obj) throw "include(obj) requires obj";
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) this.prototype[key] = value;
      }
      if ((_ref = obj.included) != null) _ref.apply(this);
      return this;
    };
    Module.extend = function(obj) {
      var key, value, _ref;
      if (!obj) throw "extend(obj) requires obj";
      for (key in obj) {
        value = obj[key];
        if (__indexOf.call(moduleKeywords, key) < 0) this[key] = value;
      }
      if ((_ref = obj.extended) != null) _ref.apply(this);
      return this;
    };
    Module.proxy = function(func) {
      var _this = this;
      return function() {
        return func.apply(_this, arguments);
      };
    };
    Module.prototype.proxy = function(func) {
      var _this = this;
      return function() {
        return func.apply(_this, arguments);
      };
    };
    function Module() {}
    return Module;
  }();
    Controller = function() {
    __extends(Controller, Module);
    Controller.extend(Events);
    Controller.prototype.idCounter = 0;
    Controller.prototype.cidPrefix = "ctr";
    Controller.prototype._uniqueId = function(prefix) {
      return this.cidPrefix + this.idCounter++;
    };
    function Controller(options) {
      var _ref;
      this.cid = (_ref = options != null ? options.cid : void 0) != null ? _ref : this._uniqueId();
      root.registerObject(this.cid, this);
    }
    on_domReady;
    Controller.prototype._delegateEvents = function(events) {
      var event, method, src, srcId, trg, trgId, _ref, _ref2, _results;
      if (!events) return;
      _results = [];
      for (src in events) {
        trg = events[src];
        _ref = src.split(" "), srcId = _ref[0], event = _ref[1];
        _ref2 = trg.split(" "), trgId = _ref2[0], method = _ref2[1];
        _results.push($$(srcId).bind(event, $$(trgId)[method], $$(trgId)));
      }
      return _results;
    };
    Controller.prototype._setup = function(controllers) {
      var ctx, id, _results;
      if (!controllers) return;
      _results = [];
      for (id in controllers) {
        ctx = controllers[id];
        ctx.options.cid = id;
        _results.push((new root.getClassByName(ctx[0]))(ctx[1]));
      }
      return _results;
    };
    Controller.prototype._import = function(objects) {
      var id, name, _results;
      if (!objects) return;
      _results = [];
      for (name in objects) {
        id = objects[name];
        _results.push(this[name] = $$(id));
      }
      return _results;
    };
    return Controller;
  }();
    viewOptions = [ "el", "id", "attributes", "className", "tagName" ];

  View = function() {
    __extends(View, Controller);
    View.prototype.eventSplitter = /^(\S+)\s*(.*)$/;
    View.prototype.tag = "div";
    function View(options) {
      this.release = __bind(this.release, this);
      var key, value, _ref;
      View.__super__.constructor.apply(this, arguments);
      this.options = options;
      _ref = this.options;
      for (key in _ref) {
        value = _ref[key];
        this[key] = value;
      }
      if (!this.el) this.el = document.createElement(this.tag);
      this.el = $(this.el);
      if (this.className) this.el.addClass(this.className);
      if (this.attributes) this.el.attr(this.attributes);
      if (!this.events) this.events = this.constructor.events;
      if (!this.elements) this.elements = this.constructor.elements;
      if (this.events) this.delegateEvents(this.events);
      if (this.elements) this.refreshElements();
    }
    View.prototype.release = function(callback) {
      this.trigger("release");
      return this.el.remove();
    };
    View.prototype.$ = function(selector) {
      return $(selector, this.el);
    };
    View.prototype.delegateEvents = function(events) {
      var eventName, key, match, method, selector, _results;
      _results = [];
      for (key in events) {
        method = events[key];
        if (typeof method !== "function") method = this.proxy(this[method]);
        match = key.match(this.eventSplitter);
        eventName = match[1];
        selector = match[2];
        if (selector === "") {
          _results.push(this.el.on(eventName, method));
        } else {
          _results.push(this.el.delegate(selector, eventName, method));
        }
      }
      return _results;
    };
    View.prototype.refreshElements = function() {
      var key, value, _ref, _results;
      _ref = this.elements;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(this[value] = this.$(key));
      }
      return _results;
    };
    return View;
  }();
    Collection = function() {
    function Collection() {}
    return Collection;
  }();
    var Application, __bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };

  Application = function() {
    __extends(Application, Controller);
    Application.prototype._initAutoloadObjects = function(classList) {
      var _this = this;
      return $(".autoload").each(function(i, _el) {
        var el, _ref, _ref2;
        try {
          el = $(_el);
          el.removeClass("autoload");
          (new root.getClassByName(el.data("class")))({
            el: _el
          });
        } catch (exc) {
          console.error("Could not initialize a view with class: " + ((_ref = _el.id) != null ? _ref : "undefined") + " and id: " + ((_ref2 = _el["data-class"]) != null ? _ref2 : "undefined") + ". " + exc.toString());
        }
      });
    };
    function Application(options) {
      if (options == null) options = {};
      this.on_domLoaded = __bind(this.on_domLoaded, this);
      Application.__super__.constructor.apply(this, arguments);
      $(document).ready(this._on_domLoaded);
      this._setup(this.setup);
    }
    Application.prototype.on_domLoaded = function() {
      this._initAutoloadObjects();
      this.trigger("dom-loaded");
      this._import(this.imports);
      return this._delegateEvents(this.events);
    };
    return Application;
  }();
  __extends(exports, {
    Module: Module,
    Controller: Controller,
    Model: Model,
    View: View,
    Collection: Collection,
    Application: Application
  });
});