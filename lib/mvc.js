$.ns("mvc", function(exports) {
  var $$, $__classes, $__objects, getClassByName, getObjectById, registerClass, registerClasses, registerObject, registerObjects;
  $__objects = {};
  $__classes = {};
  registerObject = function(id, object) {
    return $__objects[id] = object;
  };
  registerClass = function(name, klass) {
    return $__classes[name] = klass;
  };
  registerObjects = function(hash) {
    var id, obj, _results;
    _results = [];
    for (id in hash) {
      obj = hash[id];
      _results.push($__objects[id] = obj);
    }
    return _results;
  };
  registerClasses = function(hash) {
    var klass, name, _results;
    _results = [];
    for (name in hash) {
      klass = hash[name];
      _results.push($__classes[name] = klass);
    }
    return _results;
  };
  $$ = getObjectById = function(id) {
    return $__objects[id];
  };
  getClassByName = function(name) {
    return $__classes[name];
  };
  $(function() {
    return $.emit("load");
  });
  $.on("load", function() {
    return $.defer(function() {
      return $.emit("loaded");
    });
  });
    var Module, moduleKeywords;

  moduleKeywords = [ "included", "extended" ];

  Module = function() {
    Module.registerClass = function(name) {
      return registerClass(name, this);
    };
    Module.include = function(obj) {
      var key, value, _ref;
      if (!obj) throw "include(obj) requires obj";
      for (key in obj) {
        value = obj[key];
        if ($.indexOf.call(moduleKeywords, key) < 0) this.prototype[key] = value;
      }
      if ((_ref = obj.included) != null) _ref.apply(this);
      return this;
    };
    Module.extend = function(obj) {
      var key, value, _ref;
      if (!obj) throw "extend(obj) requires obj";
      for (key in obj) {
        value = obj[key];
        if ($.indexOf.call(moduleKeywords, key) < 0) this[key] = value;
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
    Module.prototype.getClassByName = function(name) {
      return getClassByName(name);
    };
    Module.prototype.getObjectById = function(name) {
      return getObjectById(name);
    };
    Module.prototype.$$ = function(name) {
      return getObjectById(name);
    };
    return Module;
  }();
    var Controller;

  Controller = function(_super) {
    $.inherit(Controller, _super);
    Controller.include($.EventEmitter.prototype);
    Controller.prototype.cidPrefix = "ctr";
    function Controller(options) {
      var _ref, _this = this;
      if (this.cid == null) {
        this.cid = (_ref = options != null ? options.cid : void 0) != null ? _ref : $.uniqId(this.cidPrefix);
      }
      registerObject(this.cid, this);
      this._setup(this.setup);
      $.on("loaded", function() {
        _this._import(_this.imports);
        return _this._delegateEvents(_this.events);
      });
    }
    Controller.prototype._delegateEvents = function(events) {
      var event, method, src, srcObj, t, trg, trgObj, _ref, _ref2, _results;
      if (!events) return;
      _results = [];
      for (src in events) {
        trg = events[src];
        _ref = (t = src.split(" ")).length === 1 ? [ this, t[0] ] : [ $$(t[0]), t[1] ], srcObj = _ref[0], event = _ref[1];
        _ref2 = (t = trg.split(" ")).length === 1 ? [ this, t[0] ] : [ $$(t[0]), t[1] ], trgObj = _ref2[0], method = _ref2[1];
        _results.push(srcObj.on(event, trgObj[method]));
      }
      return _results;
    };
    Controller.prototype._setup = function(controllers) {
      var ctx, id, _results;
      if (!controllers) return;
      _results = [];
      for (id in controllers) {
        ctx = controllers[id];
        ctx[1].cid = id;
        _results.push(new (getClassByName(ctx[0]))(ctx[1]));
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
  }(Module);
    var View, viewOptions;

  viewOptions = [ "el", "id", "attributes", "className", "tagName", "template" ];

  View = function(_super) {
    $.inherit(View, _super);
    View.prototype.cidPrefix = "view";
    View.prototype.eventSplitter = /^(\S+)\s*(.*)$/;
    View.prototype.tag = "div";
    function View(options) {
      var key, value, _this = this;
      if (options == null) options = {};
      this.release = $.bind(this.release, this);
      for (key in options) {
        value = options[key];
        if ($.indexOf.call(viewOptions, key) >= 0) this[key] = value;
      }
      if (!this.el) {
        if (!this.el) this.el = document.createElement(this.tag);
        this.el = $(this.el);
        if (options.id) this.el.attr("id", options.id);
        if (this.className) this.el.addClass(this.className);
        if (this.attributes) this.el.attr(this.attributes);
      } else {
        this.el = $(this.el);
      }
      if (this.cid == null) {
        this.cid = options.id || this.el.attr("id") || $.uniqId(this.cidPrefix);
      }
      registerObject(this.cid, this);
      this.data = this.el.data();
      this.events = $.extend({}, this.constructor.events, this.events);
      $.on("loaded", function() {
        _this._import(_this.imports);
        _this._delegateEvents(_this.events);
        if (_this.elements) return _this.refreshElements();
      });
    }
    View.prototype.release = function(callback) {
      this.emit("release");
      return this.el.remove();
    };
    View.prototype.$ = function(selector) {
      return $(selector, this.el);
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
    View.prototype._delegateEvents = function(events) {
      var eventName, key, match, method, selector, _results;
      if (!events) return;
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
    return View;
  }(Controller);
    var Application;

  Application = function(_super) {
    $.inherit(Application, _super);
    Application.prototype._initAutoloadObjects = function(classList) {
      var _this = this;
      return $(".autoload").each(function(i, _el) {
        var el, _ref, _ref2;
        try {
          el = $(_el);
          el.removeClass("autoload");
          new (getClassByName(el.data("class")))({
            el: _el
          });
        } catch (exc) {
          console.error("Could not initialize a view with class: " + ((_ref = _el.id) != null ? _ref : "undefined") + " and id: " + ((_ref2 = _el["data-class"]) != null ? _ref2 : "undefined") + ". " + exc.toString());
        }
      });
    };
    function Application(options) {
      var _this = this;
      if (options == null) options = {};
      Application.__super__.constructor.apply(this, arguments);
      $.on("load", function() {
        return _this._initAutoloadObjects();
      });
    }
    return Application;
  }(Controller);
  $.extend(exports, {
    Module: Module,
    Controller: Controller,
    View: View,
    Application: Application,
    registerObject: registerObject,
    registerClass: registerClass,
    registerObjects: registerObjects,
    registerClasses: registerClasses,
    getObjectById: getObjectById,
    getClassByName: getClassByName,
    $__objects: $__objects,
    $__classes: $__classes
  });
});