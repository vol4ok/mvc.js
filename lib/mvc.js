$.ns("mvc", function(exports) {
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
    moduleKeywords = [ "included", "extended" ];

  Module = function() {
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
    return Module;
  }();
    Controller = function() {
    $.inherit(Controller, Module);
    Controller.include($.EventEmitter.prototype);
    Controller.prototype.cidPrefix = "ctr";
    function Controller(options) {
      var _ref, _ref2, _this = this;
      if ((_ref = this.cid) == null) {
        this.cid = (_ref2 = options != null ? options.cid : void 0) != null ? _ref2 : $.uniqId(this.cidPrefix);
      }
      registerObject(this.cid, this);
      console.log(this);
      this._setup(this.setup);
      $.on("loaded", function() {
        _this._import(_this.imports);
        return _this._delegateEvents(_this.events);
      });
    }
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
        _results.push((new getClassByName(ctx[0]))(ctx[1]));
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
    var Application;

  Application = function() {
    $.inherit(Application, Controller);
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
  }();
  $.extend(exports, {
    Module: Module,
    Controller: Controller,
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