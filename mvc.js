$.ns([ "./mvc", "mvc" ], function(exports) {
var $$, $__classes, $__objects, Application, Controller, Module, View, getClassByName, getObjectById, moduleKeywords, registerClass, registerClasses, registerObject, registerObjects, viewOptions,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
  return $.emit('loadddd');
});

$.on('load', function() {
  return $.defer(function() {
    return $.emit('loaded');
  });
});

moduleKeywords = ['included', 'extended', 'mixins'];

Module = (function() {

  Module.registerClass = function(name) {
    this.prototype.__className = name;
    return registerClass(name, this);
  };

  Module.include = function(obj) {
    var key, value, _ref;
    if (!obj) {
      throw 'include(obj) requires obj';
    }
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this.prototype[key] = value;
      }
    }
    if ((_ref = obj.included) != null) {
      _ref.apply(this);
    }
    return this;
  };

  Module.extend = function(obj) {
    var key, value, _ref;
    if (!obj) {
      throw 'extend(obj) requires obj';
    }
    for (key in obj) {
      value = obj[key];
      if (__indexOf.call(moduleKeywords, key) < 0) {
        this[key] = value;
      }
    }
    if ((_ref = obj.extended) != null) {
      _ref.apply(this);
    }
    return this;
  };

  Module.mixin = function(klass) {
    var key, t, val, _base, _ref, _ref1;
    if (!klass) {
      throw 'mixin(klass) requires klass';
    }
    this.include(klass.prototype);
    if ((_ref = (_base = this.prototype).mixins) == null) {
      _base.mixins = {};
    }
    if (!this.prototype.mixins[this.name]) {
      t = {};
      _ref1 = this.prototype.mixins;
      for (key in _ref1) {
        val = _ref1[key];
        $.extend(t, val);
      }
      this.prototype.mixins[this.name] = t;
    }
    this.prototype.mixins[this.name][klass.name] = klass;
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

  function Module() {
    this._initializeMixins.apply(this, arguments);
  }

  Module.prototype._initializeMixins = function() {
    var ctor, key, _ref, _results;
    if (!this.mixins) {
      return;
    }
    _ref = this.mixins[this.__className];
    _results = [];
    for (key in _ref) {
      ctor = _ref[key];
      _results.push(ctor.apply(this, arguments));
    }
    return _results;
  };

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

})();

Controller = (function(_super) {

  __extends(Controller, _super);

  Controller.include($.EventEmitter.prototype);

  Controller.prototype.cidPrefix = 'ctr';

  function Controller(options) {
    var _ref, _ref1,
      _this = this;
    if ((_ref = this.cid) == null) {
      this.cid = (_ref1 = options != null ? options.cid : void 0) != null ? _ref1 : $.uniqId(this.cidPrefix);
    }
    registerObject(this.cid, this);
    this._setupControllers(this.setup);
    $.on('loaded', function() {
      _this["import"](_this.imports);
      return _this.delegateEvents(_this.events);
    });
  }

  Controller.prototype.delegateEvents = function(events) {
    var event, method, src, srcObj, t, trg, trgObj, _ref, _ref1, _results;
    if (!events) {
      return;
    }
    _results = [];
    for (src in events) {
      trg = events[src];
      _ref = (t = src.split(' ')).length === 1 ? [this, t[0]] : [$$(t[0]), t[1]], srcObj = _ref[0], event = _ref[1];
      _ref1 = (t = trg.split(' ')).length === 1 ? [this, t[0]] : [$$(t[0]), t[1]], trgObj = _ref1[0], method = _ref1[1];
      _results.push(srcObj.on(event, trgObj[method]));
    }
    return _results;
  };

  Controller.prototype._setupControllers = function(controllers) {
    var ctx, id, _results;
    if (!controllers) {
      return;
    }
    _results = [];
    for (id in controllers) {
      ctx = controllers[id];
      ctx[1].cid = id;
      _results.push(new (getClassByName(ctx[0]))(ctx[1]));
    }
    return _results;
  };

  Controller.prototype["import"] = function(imports) {
    var id, name, _i, _len, _results, _results1;
    if (!imports) {
      return;
    }
    if ($.isArray(imports)) {
      _results = [];
      for (_i = 0, _len = imports.length; _i < _len; _i++) {
        id = imports[_i];
        _results.push(this[$.camelize(id)] = $$(id));
      }
      return _results;
    } else {
      _results1 = [];
      for (name in imports) {
        id = imports[name];
        _results1.push(this[name] = $$(id));
      }
      return _results1;
    }
  };

  return Controller;

})(Module);

viewOptions = ['el', 'id', 'attributes', 'className', 'tagName', 'template'];

View = (function(_super) {

  __extends(View, _super);

  View.prototype.cidPrefix = 'view';

  View.prototype.eventSplitter = /^(\S+)\s*(.*)$/;

  View.prototype.tag = 'div';

  function View(options) {
    var key, value, _ref;
    if (options == null) {
      options = {};
    }
    this.release = __bind(this.release, this);

    for (key in options) {
      value = options[key];
      if (__indexOf.call(viewOptions, key) >= 0) {
        this[key] = value;
      }
    }
    if (!this.el) {
      if (!this.el) {
        this.el = document.createElement(this.tag);
      }
      this.el = $(this.el);
      if (options.id) {
        this.el.attr('id', options.id);
      }
      if (this.className) {
        this.el.addClass(this.className);
      }
      if (this.attributes) {
        this.el.attr(this.attributes);
      }
    } else {
      this.el = $(this.el);
    }
    this.raw = this.el[0];
    this.raw.view = this;
    if ((_ref = this.cid) == null) {
      this.cid = options.cid || options.id || this.el.attr('id') || $.uniqId(this.cidPrefix);
    }
    registerObject(this.cid, this);
    this.data = this.el.data() || {};
    this._initializeMixins();
    this._setupControllers(this.setup);
    this["import"](this.imports);
    this.delegateEvents(this.events);
    this.refreshElements(this.elements);
  }

  View.prototype.release = function(callback) {
    this.emit('release');
    return this.el.remove();
  };

  View.prototype.$ = function(selector) {
    return $(selector, this.el);
  };

  View.prototype.refreshElements = function(elements) {
    var key, value, _results;
    if (!elements) {
      return;
    }
    _results = [];
    for (key in elements) {
      value = elements[key];
      _results.push(this[key] = this.$(value));
    }
    return _results;
  };

  View.prototype.delegateEvents = function(events) {
    var eventName, key, match, method, selector, _results;
    if (!events) {
      return;
    }
    _results = [];
    for (key in events) {
      method = events[key];
      if (typeof method !== 'function') {
        method = this.proxy(this[method]);
      }
      match = key.match(this.eventSplitter);
      eventName = match[1];
      selector = match[2];
      if (selector === 'document') {
        _results.push($(document).on(eventName, method));
      } else if (selector === '') {
        _results.push(this.el.on(eventName, method));
      } else {
        _results.push(this.el.delegate(selector, eventName, method));
      }
    }
    return _results;
  };

  return View;

})(Controller);

Application = (function(_super) {

  __extends(Application, _super);

  Application.prototype._initAutoloadObjects = function(classList) {
    var _this = this;
    return $('.autoload').each(function(_el, i) {
      var el;
      el = $(_el);
      el.removeClass('autoload');
      new (getClassByName(el.data('class')))({
        el: _el
      });
    });
  };

  function Application(options) {
    var _this = this;
    if (options == null) {
      options = {};
    }
    Application.__super__.constructor.apply(this, arguments);
    $.on('load', function() {
      return _this._initAutoloadObjects();
    });
  }

  return Application;

})(Controller);

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
  $$: $$,
  $__objects: $__objects,
  $__classes: $__classes
});

});