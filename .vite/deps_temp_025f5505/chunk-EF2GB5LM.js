import {
  Animator_default,
  BoundingRect_default,
  CompoundPath_default,
  DARK_MODE_THRESHOLD,
  Displayable_default,
  Element_default,
  Eventful_default,
  Image_default,
  LRU_default,
  PathProxy_default,
  Path_default,
  Point_default,
  REDRAW_BIT,
  Rect_default,
  TRANSFORMABLE_PROPS,
  TSpan_default,
  Text_default,
  Transformable_default,
  __extends,
  add,
  applyTransform,
  assert,
  bind,
  brushSingle,
  calculateTextPosition,
  clone,
  clone2,
  cloneValue,
  concatArray,
  copy,
  copy2,
  create2 as create,
  createHashMap,
  cubicAt,
  cubicDerivativeAt,
  cubicSubdivide,
  curry,
  defaults,
  dist,
  distance,
  each,
  encodeHTML,
  env_default,
  eqNaN,
  extend,
  fastLerp,
  filter,
  getBoundingRect,
  guid,
  hasOwn,
  identity,
  indexOf,
  inherits,
  invert,
  isArray,
  isArrayLike,
  isCanvasEl,
  isDom,
  isFunction,
  isGradientObject,
  isNumber,
  isObject,
  isRegExp,
  isString,
  isStringSafe,
  isTypedArray,
  keys,
  lift,
  lum,
  map,
  max,
  merge,
  mergeAll,
  min,
  mixin,
  modifyAlpha,
  modifyHSL,
  mul,
  noop,
  normalize,
  normalizeCssArray,
  parse,
  parsePercent,
  platformApi,
  quadraticAt,
  quadraticDerivativeAt,
  quadraticSubdivide,
  reduce,
  requestAnimationFrame_default,
  retrieve,
  retrieve2,
  retrieve3,
  rotate,
  scale,
  scale2,
  setAsPrimitive,
  setPlatformAPI,
  slice,
  stringify,
  sub,
  subPixelOptimize,
  subPixelOptimizeLine,
  subPixelOptimizeRect,
  transformCoordWithViewport,
  translate,
  trim,
  windingLine
} from "./chunk-D2RNDXDX.js";
import {
  __export
} from "./chunk-FAW2VN4A.js";

// node_modules/zrender/lib/zrender.js
var zrender_exports = {};
__export(zrender_exports, {
  dispose: () => dispose,
  disposeAll: () => disposeAll,
  getInstance: () => getInstance,
  init: () => init,
  registerPainter: () => registerPainter,
  version: () => version
});

// node_modules/zrender/lib/mixin/Draggable.js
var Param = function() {
  function Param2(target, e2) {
    this.target = target;
    this.topTarget = e2 && e2.topTarget;
  }
  return Param2;
}();
var Draggable = function() {
  function Draggable2(handler) {
    this.handler = handler;
    handler.on("mousedown", this._dragStart, this);
    handler.on("mousemove", this._drag, this);
    handler.on("mouseup", this._dragEnd, this);
  }
  Draggable2.prototype._dragStart = function(e2) {
    var draggingTarget = e2.target;
    while (draggingTarget && !draggingTarget.draggable) {
      draggingTarget = draggingTarget.parent || draggingTarget.__hostTarget;
    }
    if (draggingTarget) {
      this._draggingTarget = draggingTarget;
      draggingTarget.dragging = true;
      this._x = e2.offsetX;
      this._y = e2.offsetY;
      this.handler.dispatchToElement(new Param(draggingTarget, e2), "dragstart", e2.event);
    }
  };
  Draggable2.prototype._drag = function(e2) {
    var draggingTarget = this._draggingTarget;
    if (draggingTarget) {
      var x = e2.offsetX;
      var y = e2.offsetY;
      var dx = x - this._x;
      var dy = y - this._y;
      this._x = x;
      this._y = y;
      draggingTarget.drift(dx, dy, e2);
      this.handler.dispatchToElement(new Param(draggingTarget, e2), "drag", e2.event);
      var dropTarget = this.handler.findHover(x, y, draggingTarget).target;
      var lastDropTarget = this._dropTarget;
      this._dropTarget = dropTarget;
      if (draggingTarget !== dropTarget) {
        if (lastDropTarget && dropTarget !== lastDropTarget) {
          this.handler.dispatchToElement(new Param(lastDropTarget, e2), "dragleave", e2.event);
        }
        if (dropTarget && dropTarget !== lastDropTarget) {
          this.handler.dispatchToElement(new Param(dropTarget, e2), "dragenter", e2.event);
        }
      }
    }
  };
  Draggable2.prototype._dragEnd = function(e2) {
    var draggingTarget = this._draggingTarget;
    if (draggingTarget) {
      draggingTarget.dragging = false;
    }
    this.handler.dispatchToElement(new Param(draggingTarget, e2), "dragend", e2.event);
    if (this._dropTarget) {
      this.handler.dispatchToElement(new Param(this._dropTarget, e2), "drop", e2.event);
    }
    this._draggingTarget = null;
    this._dropTarget = null;
  };
  return Draggable2;
}();
var Draggable_default = Draggable;

// node_modules/zrender/lib/core/event.js
var MOUSE_EVENT_REG = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
var _calcOut = [];
var firefoxNotSupportOffsetXY = env_default.browser.firefox && +env_default.browser.version.split(".")[0] < 39;
function clientToLocal(el, e2, out2, calculate) {
  out2 = out2 || {};
  if (calculate) {
    calculateZrXY(el, e2, out2);
  } else if (firefoxNotSupportOffsetXY && e2.layerX != null && e2.layerX !== e2.offsetX) {
    out2.zrX = e2.layerX;
    out2.zrY = e2.layerY;
  } else if (e2.offsetX != null) {
    out2.zrX = e2.offsetX;
    out2.zrY = e2.offsetY;
  } else {
    calculateZrXY(el, e2, out2);
  }
  return out2;
}
function calculateZrXY(el, e2, out2) {
  if (env_default.domSupported && el.getBoundingClientRect) {
    var ex = e2.clientX;
    var ey = e2.clientY;
    if (isCanvasEl(el)) {
      var box2 = el.getBoundingClientRect();
      out2.zrX = ex - box2.left;
      out2.zrY = ey - box2.top;
      return;
    } else {
      if (transformCoordWithViewport(_calcOut, el, ex, ey)) {
        out2.zrX = _calcOut[0];
        out2.zrY = _calcOut[1];
        return;
      }
    }
  }
  out2.zrX = out2.zrY = 0;
}
function getNativeEvent(e2) {
  return e2 || window.event;
}
function normalizeEvent(el, e2, calculate) {
  e2 = getNativeEvent(e2);
  if (e2.zrX != null) {
    return e2;
  }
  var eventType = e2.type;
  var isTouch = eventType && eventType.indexOf("touch") >= 0;
  if (!isTouch) {
    clientToLocal(el, e2, e2, calculate);
    var wheelDelta = getWheelDeltaMayPolyfill(e2);
    e2.zrDelta = wheelDelta ? wheelDelta / 120 : -(e2.detail || 0) / 3;
  } else {
    var touch = eventType !== "touchend" ? e2.targetTouches[0] : e2.changedTouches[0];
    touch && clientToLocal(el, touch, e2, calculate);
  }
  var button = e2.button;
  if (e2.which == null && button !== void 0 && MOUSE_EVENT_REG.test(e2.type)) {
    e2.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
  }
  return e2;
}
function getWheelDeltaMayPolyfill(e2) {
  var rawWheelDelta = e2.wheelDelta;
  if (rawWheelDelta) {
    return rawWheelDelta;
  }
  var deltaX = e2.deltaX;
  var deltaY = e2.deltaY;
  if (deltaX == null || deltaY == null) {
    return rawWheelDelta;
  }
  var delta = deltaY !== 0 ? Math.abs(deltaY) : Math.abs(deltaX);
  var sign = deltaY > 0 ? -1 : deltaY < 0 ? 1 : deltaX > 0 ? -1 : 1;
  return 3 * delta * sign;
}
function addEventListener(el, name, handler, opt) {
  el.addEventListener(name, handler, opt);
}
function removeEventListener(el, name, handler, opt) {
  el.removeEventListener(name, handler, opt);
}
var stop = function(e2) {
  e2.preventDefault();
  e2.stopPropagation();
  e2.cancelBubble = true;
};
function isMiddleOrRightButtonOnMouseUpDown(e2) {
  return e2.which === 2 || e2.which === 3;
}

// node_modules/zrender/lib/core/GestureMgr.js
var GestureMgr = function() {
  function GestureMgr2() {
    this._track = [];
  }
  GestureMgr2.prototype.recognize = function(event, target, root) {
    this._doTrack(event, target, root);
    return this._recognize(event);
  };
  GestureMgr2.prototype.clear = function() {
    this._track.length = 0;
    return this;
  };
  GestureMgr2.prototype._doTrack = function(event, target, root) {
    var touches = event.touches;
    if (!touches) {
      return;
    }
    var trackItem = {
      points: [],
      touches: [],
      target,
      event
    };
    for (var i = 0, len = touches.length; i < len; i++) {
      var touch = touches[i];
      var pos = clientToLocal(root, touch, {});
      trackItem.points.push([pos.zrX, pos.zrY]);
      trackItem.touches.push(touch);
    }
    this._track.push(trackItem);
  };
  GestureMgr2.prototype._recognize = function(event) {
    for (var eventName in recognizers) {
      if (recognizers.hasOwnProperty(eventName)) {
        var gestureInfo = recognizers[eventName](this._track, event);
        if (gestureInfo) {
          return gestureInfo;
        }
      }
    }
  };
  return GestureMgr2;
}();
function dist2(pointPair) {
  var dx = pointPair[1][0] - pointPair[0][0];
  var dy = pointPair[1][1] - pointPair[0][1];
  return Math.sqrt(dx * dx + dy * dy);
}
function center(pointPair) {
  return [
    (pointPair[0][0] + pointPair[1][0]) / 2,
    (pointPair[0][1] + pointPair[1][1]) / 2
  ];
}
var recognizers = {
  pinch: function(tracks, event) {
    var trackLen = tracks.length;
    if (!trackLen) {
      return;
    }
    var pinchEnd = (tracks[trackLen - 1] || {}).points;
    var pinchPre = (tracks[trackLen - 2] || {}).points || pinchEnd;
    if (pinchPre && pinchPre.length > 1 && pinchEnd && pinchEnd.length > 1) {
      var pinchScale = dist2(pinchEnd) / dist2(pinchPre);
      !isFinite(pinchScale) && (pinchScale = 1);
      event.pinchScale = pinchScale;
      var pinchCenter = center(pinchEnd);
      event.pinchX = pinchCenter[0];
      event.pinchY = pinchCenter[1];
      return {
        type: "pinch",
        target: tracks[0].target,
        event
      };
    }
  }
};

// node_modules/zrender/lib/Handler.js
var SILENT = "silent";
function makeEventPacket(eveType, targetInfo, event) {
  return {
    type: eveType,
    event,
    target: targetInfo.target,
    topTarget: targetInfo.topTarget,
    cancelBubble: false,
    offsetX: event.zrX,
    offsetY: event.zrY,
    gestureEvent: event.gestureEvent,
    pinchX: event.pinchX,
    pinchY: event.pinchY,
    pinchScale: event.pinchScale,
    wheelDelta: event.zrDelta,
    zrByTouch: event.zrByTouch,
    which: event.which,
    stop: stopEvent
  };
}
function stopEvent() {
  stop(this.event);
}
var EmptyProxy = function(_super) {
  __extends(EmptyProxy2, _super);
  function EmptyProxy2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.handler = null;
    return _this;
  }
  EmptyProxy2.prototype.dispose = function() {
  };
  EmptyProxy2.prototype.setCursor = function() {
  };
  return EmptyProxy2;
}(Eventful_default);
var HoveredResult = function() {
  function HoveredResult2(x, y) {
    this.x = x;
    this.y = y;
  }
  return HoveredResult2;
}();
var handlerNames = [
  "click",
  "dblclick",
  "mousewheel",
  "mouseout",
  "mouseup",
  "mousedown",
  "mousemove",
  "contextmenu"
];
var tmpRect = new BoundingRect_default(0, 0, 0, 0);
var Handler = function(_super) {
  __extends(Handler2, _super);
  function Handler2(storage2, painter, proxy, painterRoot, pointerSize) {
    var _this = _super.call(this) || this;
    _this._hovered = new HoveredResult(0, 0);
    _this.storage = storage2;
    _this.painter = painter;
    _this.painterRoot = painterRoot;
    _this._pointerSize = pointerSize;
    proxy = proxy || new EmptyProxy();
    _this.proxy = null;
    _this.setHandlerProxy(proxy);
    _this._draggingMgr = new Draggable_default(_this);
    return _this;
  }
  Handler2.prototype.setHandlerProxy = function(proxy) {
    if (this.proxy) {
      this.proxy.dispose();
    }
    if (proxy) {
      each(handlerNames, function(name) {
        proxy.on && proxy.on(name, this[name], this);
      }, this);
      proxy.handler = this;
    }
    this.proxy = proxy;
  };
  Handler2.prototype.mousemove = function(event) {
    var x = event.zrX;
    var y = event.zrY;
    var isOutside = isOutsideBoundary(this, x, y);
    var lastHovered = this._hovered;
    var lastHoveredTarget = lastHovered.target;
    if (lastHoveredTarget && !lastHoveredTarget.__zr) {
      lastHovered = this.findHover(lastHovered.x, lastHovered.y);
      lastHoveredTarget = lastHovered.target;
    }
    var hovered = this._hovered = isOutside ? new HoveredResult(x, y) : this.findHover(x, y);
    var hoveredTarget = hovered.target;
    var proxy = this.proxy;
    proxy.setCursor && proxy.setCursor(hoveredTarget ? hoveredTarget.cursor : "default");
    if (lastHoveredTarget && hoveredTarget !== lastHoveredTarget) {
      this.dispatchToElement(lastHovered, "mouseout", event);
    }
    this.dispatchToElement(hovered, "mousemove", event);
    if (hoveredTarget && hoveredTarget !== lastHoveredTarget) {
      this.dispatchToElement(hovered, "mouseover", event);
    }
  };
  Handler2.prototype.mouseout = function(event) {
    var eventControl = event.zrEventControl;
    if (eventControl !== "only_globalout") {
      this.dispatchToElement(this._hovered, "mouseout", event);
    }
    if (eventControl !== "no_globalout") {
      this.trigger("globalout", { type: "globalout", event });
    }
  };
  Handler2.prototype.resize = function() {
    this._hovered = new HoveredResult(0, 0);
  };
  Handler2.prototype.dispatch = function(eventName, eventArgs) {
    var handler = this[eventName];
    handler && handler.call(this, eventArgs);
  };
  Handler2.prototype.dispose = function() {
    this.proxy.dispose();
    this.storage = null;
    this.proxy = null;
    this.painter = null;
  };
  Handler2.prototype.setCursorStyle = function(cursorStyle) {
    var proxy = this.proxy;
    proxy.setCursor && proxy.setCursor(cursorStyle);
  };
  Handler2.prototype.dispatchToElement = function(targetInfo, eventName, event) {
    targetInfo = targetInfo || {};
    var el = targetInfo.target;
    if (el && el.silent) {
      return;
    }
    var eventKey = "on" + eventName;
    var eventPacket = makeEventPacket(eventName, targetInfo, event);
    while (el) {
      el[eventKey] && (eventPacket.cancelBubble = !!el[eventKey].call(el, eventPacket));
      el.trigger(eventName, eventPacket);
      el = el.__hostTarget ? el.__hostTarget : el.parent;
      if (eventPacket.cancelBubble) {
        break;
      }
    }
    if (!eventPacket.cancelBubble) {
      this.trigger(eventName, eventPacket);
      if (this.painter && this.painter.eachOtherLayer) {
        this.painter.eachOtherLayer(function(layer) {
          if (typeof layer[eventKey] === "function") {
            layer[eventKey].call(layer, eventPacket);
          }
          if (layer.trigger) {
            layer.trigger(eventName, eventPacket);
          }
        });
      }
    }
  };
  Handler2.prototype.findHover = function(x, y, exclude) {
    var list = this.storage.getDisplayList();
    var out2 = new HoveredResult(x, y);
    setHoverTarget(list, out2, x, y, exclude);
    if (this._pointerSize && !out2.target) {
      var candidates = [];
      var pointerSize = this._pointerSize;
      var targetSizeHalf = pointerSize / 2;
      var pointerRect = new BoundingRect_default(x - targetSizeHalf, y - targetSizeHalf, pointerSize, pointerSize);
      for (var i = list.length - 1; i >= 0; i--) {
        var el = list[i];
        if (el !== exclude && !el.ignore && !el.ignoreCoarsePointer && (!el.parent || !el.parent.ignoreCoarsePointer)) {
          tmpRect.copy(el.getBoundingRect());
          if (el.transform) {
            tmpRect.applyTransform(el.transform);
          }
          if (tmpRect.intersect(pointerRect)) {
            candidates.push(el);
          }
        }
      }
      if (candidates.length) {
        var rStep = 4;
        var thetaStep = Math.PI / 12;
        var PI23 = Math.PI * 2;
        for (var r = 0; r < targetSizeHalf; r += rStep) {
          for (var theta = 0; theta < PI23; theta += thetaStep) {
            var x1 = x + r * Math.cos(theta);
            var y1 = y + r * Math.sin(theta);
            setHoverTarget(candidates, out2, x1, y1, exclude);
            if (out2.target) {
              return out2;
            }
          }
        }
      }
    }
    return out2;
  };
  Handler2.prototype.processGesture = function(event, stage) {
    if (!this._gestureMgr) {
      this._gestureMgr = new GestureMgr();
    }
    var gestureMgr = this._gestureMgr;
    stage === "start" && gestureMgr.clear();
    var gestureInfo = gestureMgr.recognize(event, this.findHover(event.zrX, event.zrY, null).target, this.proxy.dom);
    stage === "end" && gestureMgr.clear();
    if (gestureInfo) {
      var type = gestureInfo.type;
      event.gestureEvent = type;
      var res = new HoveredResult();
      res.target = gestureInfo.target;
      this.dispatchToElement(res, type, gestureInfo.event);
    }
  };
  return Handler2;
}(Eventful_default);
each(["click", "mousedown", "mouseup", "mousewheel", "dblclick", "contextmenu"], function(name) {
  Handler.prototype[name] = function(event) {
    var x = event.zrX;
    var y = event.zrY;
    var isOutside = isOutsideBoundary(this, x, y);
    var hovered;
    var hoveredTarget;
    if (name !== "mouseup" || !isOutside) {
      hovered = this.findHover(x, y);
      hoveredTarget = hovered.target;
    }
    if (name === "mousedown") {
      this._downEl = hoveredTarget;
      this._downPoint = [event.zrX, event.zrY];
      this._upEl = hoveredTarget;
    } else if (name === "mouseup") {
      this._upEl = hoveredTarget;
    } else if (name === "click") {
      if (this._downEl !== this._upEl || !this._downPoint || dist(this._downPoint, [event.zrX, event.zrY]) > 4) {
        return;
      }
      this._downPoint = null;
    }
    this.dispatchToElement(hovered, name, event);
  };
});
function isHover(displayable, x, y) {
  if (displayable[displayable.rectHover ? "rectContain" : "contain"](x, y)) {
    var el = displayable;
    var isSilent = void 0;
    var ignoreClip = false;
    while (el) {
      if (el.ignoreClip) {
        ignoreClip = true;
      }
      if (!ignoreClip) {
        var clipPath = el.getClipPath();
        if (clipPath && !clipPath.contain(x, y)) {
          return false;
        }
        if (el.silent) {
          isSilent = true;
        }
      }
      var hostEl = el.__hostTarget;
      el = hostEl ? hostEl : el.parent;
    }
    return isSilent ? SILENT : true;
  }
  return false;
}
function setHoverTarget(list, out2, x, y, exclude) {
  for (var i = list.length - 1; i >= 0; i--) {
    var el = list[i];
    var hoverCheckResult = void 0;
    if (el !== exclude && !el.ignore && (hoverCheckResult = isHover(el, x, y))) {
      !out2.topTarget && (out2.topTarget = el);
      if (hoverCheckResult !== SILENT) {
        out2.target = el;
        break;
      }
    }
  }
}
function isOutsideBoundary(handlerInstance, x, y) {
  var painter = handlerInstance.painter;
  return x < 0 || x > painter.getWidth() || y < 0 || y > painter.getHeight();
}
var Handler_default = Handler;

// node_modules/zrender/lib/core/timsort.js
var DEFAULT_MIN_MERGE = 32;
var DEFAULT_MIN_GALLOPING = 7;
var DEFAULT_TMP_STORAGE_LENGTH = 256;
function minRunLength(n) {
  var r = 0;
  while (n >= DEFAULT_MIN_MERGE) {
    r |= n & 1;
    n >>= 1;
  }
  return n + r;
}
function makeAscendingRun(array, lo, hi, compare2) {
  var runHi = lo + 1;
  if (runHi === hi) {
    return 1;
  }
  if (compare2(array[runHi++], array[lo]) < 0) {
    while (runHi < hi && compare2(array[runHi], array[runHi - 1]) < 0) {
      runHi++;
    }
    reverseRun(array, lo, runHi);
  } else {
    while (runHi < hi && compare2(array[runHi], array[runHi - 1]) >= 0) {
      runHi++;
    }
  }
  return runHi - lo;
}
function reverseRun(array, lo, hi) {
  hi--;
  while (lo < hi) {
    var t = array[lo];
    array[lo++] = array[hi];
    array[hi--] = t;
  }
}
function binaryInsertionSort(array, lo, hi, start, compare2) {
  if (start === lo) {
    start++;
  }
  for (; start < hi; start++) {
    var pivot = array[start];
    var left = lo;
    var right = start;
    var mid;
    while (left < right) {
      mid = left + right >>> 1;
      if (compare2(pivot, array[mid]) < 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    var n = start - left;
    switch (n) {
      case 3:
        array[left + 3] = array[left + 2];
      case 2:
        array[left + 2] = array[left + 1];
      case 1:
        array[left + 1] = array[left];
        break;
      default:
        while (n > 0) {
          array[left + n] = array[left + n - 1];
          n--;
        }
    }
    array[left] = pivot;
  }
}
function gallopLeft(value, array, start, length, hint, compare2) {
  var lastOffset = 0;
  var maxOffset = 0;
  var offset = 1;
  if (compare2(value, array[start + hint]) > 0) {
    maxOffset = length - hint;
    while (offset < maxOffset && compare2(value, array[start + hint + offset]) > 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;
      if (offset <= 0) {
        offset = maxOffset;
      }
    }
    if (offset > maxOffset) {
      offset = maxOffset;
    }
    lastOffset += hint;
    offset += hint;
  } else {
    maxOffset = hint + 1;
    while (offset < maxOffset && compare2(value, array[start + hint - offset]) <= 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;
      if (offset <= 0) {
        offset = maxOffset;
      }
    }
    if (offset > maxOffset) {
      offset = maxOffset;
    }
    var tmp = lastOffset;
    lastOffset = hint - offset;
    offset = hint - tmp;
  }
  lastOffset++;
  while (lastOffset < offset) {
    var m2 = lastOffset + (offset - lastOffset >>> 1);
    if (compare2(value, array[start + m2]) > 0) {
      lastOffset = m2 + 1;
    } else {
      offset = m2;
    }
  }
  return offset;
}
function gallopRight(value, array, start, length, hint, compare2) {
  var lastOffset = 0;
  var maxOffset = 0;
  var offset = 1;
  if (compare2(value, array[start + hint]) < 0) {
    maxOffset = hint + 1;
    while (offset < maxOffset && compare2(value, array[start + hint - offset]) < 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;
      if (offset <= 0) {
        offset = maxOffset;
      }
    }
    if (offset > maxOffset) {
      offset = maxOffset;
    }
    var tmp = lastOffset;
    lastOffset = hint - offset;
    offset = hint - tmp;
  } else {
    maxOffset = length - hint;
    while (offset < maxOffset && compare2(value, array[start + hint + offset]) >= 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;
      if (offset <= 0) {
        offset = maxOffset;
      }
    }
    if (offset > maxOffset) {
      offset = maxOffset;
    }
    lastOffset += hint;
    offset += hint;
  }
  lastOffset++;
  while (lastOffset < offset) {
    var m2 = lastOffset + (offset - lastOffset >>> 1);
    if (compare2(value, array[start + m2]) < 0) {
      offset = m2;
    } else {
      lastOffset = m2 + 1;
    }
  }
  return offset;
}
function TimSort(array, compare2) {
  var minGallop = DEFAULT_MIN_GALLOPING;
  var length = 0;
  var tmpStorageLength = DEFAULT_TMP_STORAGE_LENGTH;
  var stackLength = 0;
  var runStart;
  var runLength;
  var stackSize = 0;
  length = array.length;
  if (length < 2 * DEFAULT_TMP_STORAGE_LENGTH) {
    tmpStorageLength = length >>> 1;
  }
  var tmp = [];
  stackLength = length < 120 ? 5 : length < 1542 ? 10 : length < 119151 ? 19 : 40;
  runStart = [];
  runLength = [];
  function pushRun(_runStart, _runLength) {
    runStart[stackSize] = _runStart;
    runLength[stackSize] = _runLength;
    stackSize += 1;
  }
  function mergeRuns() {
    while (stackSize > 1) {
      var n = stackSize - 2;
      if (n >= 1 && runLength[n - 1] <= runLength[n] + runLength[n + 1] || n >= 2 && runLength[n - 2] <= runLength[n] + runLength[n - 1]) {
        if (runLength[n - 1] < runLength[n + 1]) {
          n--;
        }
      } else if (runLength[n] > runLength[n + 1]) {
        break;
      }
      mergeAt(n);
    }
  }
  function forceMergeRuns() {
    while (stackSize > 1) {
      var n = stackSize - 2;
      if (n > 0 && runLength[n - 1] < runLength[n + 1]) {
        n--;
      }
      mergeAt(n);
    }
  }
  function mergeAt(i) {
    var start1 = runStart[i];
    var length1 = runLength[i];
    var start2 = runStart[i + 1];
    var length2 = runLength[i + 1];
    runLength[i] = length1 + length2;
    if (i === stackSize - 3) {
      runStart[i + 1] = runStart[i + 2];
      runLength[i + 1] = runLength[i + 2];
    }
    stackSize--;
    var k = gallopRight(array[start2], array, start1, length1, 0, compare2);
    start1 += k;
    length1 -= k;
    if (length1 === 0) {
      return;
    }
    length2 = gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare2);
    if (length2 === 0) {
      return;
    }
    if (length1 <= length2) {
      mergeLow(start1, length1, start2, length2);
    } else {
      mergeHigh(start1, length1, start2, length2);
    }
  }
  function mergeLow(start1, length1, start2, length2) {
    var i = 0;
    for (i = 0; i < length1; i++) {
      tmp[i] = array[start1 + i];
    }
    var cursor1 = 0;
    var cursor2 = start2;
    var dest = start1;
    array[dest++] = array[cursor2++];
    if (--length2 === 0) {
      for (i = 0; i < length1; i++) {
        array[dest + i] = tmp[cursor1 + i];
      }
      return;
    }
    if (length1 === 1) {
      for (i = 0; i < length2; i++) {
        array[dest + i] = array[cursor2 + i];
      }
      array[dest + length2] = tmp[cursor1];
      return;
    }
    var _minGallop = minGallop;
    var count1;
    var count2;
    var exit;
    while (1) {
      count1 = 0;
      count2 = 0;
      exit = false;
      do {
        if (compare2(array[cursor2], tmp[cursor1]) < 0) {
          array[dest++] = array[cursor2++];
          count2++;
          count1 = 0;
          if (--length2 === 0) {
            exit = true;
            break;
          }
        } else {
          array[dest++] = tmp[cursor1++];
          count1++;
          count2 = 0;
          if (--length1 === 1) {
            exit = true;
            break;
          }
        }
      } while ((count1 | count2) < _minGallop);
      if (exit) {
        break;
      }
      do {
        count1 = gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare2);
        if (count1 !== 0) {
          for (i = 0; i < count1; i++) {
            array[dest + i] = tmp[cursor1 + i];
          }
          dest += count1;
          cursor1 += count1;
          length1 -= count1;
          if (length1 <= 1) {
            exit = true;
            break;
          }
        }
        array[dest++] = array[cursor2++];
        if (--length2 === 0) {
          exit = true;
          break;
        }
        count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare2);
        if (count2 !== 0) {
          for (i = 0; i < count2; i++) {
            array[dest + i] = array[cursor2 + i];
          }
          dest += count2;
          cursor2 += count2;
          length2 -= count2;
          if (length2 === 0) {
            exit = true;
            break;
          }
        }
        array[dest++] = tmp[cursor1++];
        if (--length1 === 1) {
          exit = true;
          break;
        }
        _minGallop--;
      } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);
      if (exit) {
        break;
      }
      if (_minGallop < 0) {
        _minGallop = 0;
      }
      _minGallop += 2;
    }
    minGallop = _minGallop;
    minGallop < 1 && (minGallop = 1);
    if (length1 === 1) {
      for (i = 0; i < length2; i++) {
        array[dest + i] = array[cursor2 + i];
      }
      array[dest + length2] = tmp[cursor1];
    } else if (length1 === 0) {
      throw new Error();
    } else {
      for (i = 0; i < length1; i++) {
        array[dest + i] = tmp[cursor1 + i];
      }
    }
  }
  function mergeHigh(start1, length1, start2, length2) {
    var i = 0;
    for (i = 0; i < length2; i++) {
      tmp[i] = array[start2 + i];
    }
    var cursor1 = start1 + length1 - 1;
    var cursor2 = length2 - 1;
    var dest = start2 + length2 - 1;
    var customCursor = 0;
    var customDest = 0;
    array[dest--] = array[cursor1--];
    if (--length1 === 0) {
      customCursor = dest - (length2 - 1);
      for (i = 0; i < length2; i++) {
        array[customCursor + i] = tmp[i];
      }
      return;
    }
    if (length2 === 1) {
      dest -= length1;
      cursor1 -= length1;
      customDest = dest + 1;
      customCursor = cursor1 + 1;
      for (i = length1 - 1; i >= 0; i--) {
        array[customDest + i] = array[customCursor + i];
      }
      array[dest] = tmp[cursor2];
      return;
    }
    var _minGallop = minGallop;
    while (true) {
      var count1 = 0;
      var count2 = 0;
      var exit = false;
      do {
        if (compare2(tmp[cursor2], array[cursor1]) < 0) {
          array[dest--] = array[cursor1--];
          count1++;
          count2 = 0;
          if (--length1 === 0) {
            exit = true;
            break;
          }
        } else {
          array[dest--] = tmp[cursor2--];
          count2++;
          count1 = 0;
          if (--length2 === 1) {
            exit = true;
            break;
          }
        }
      } while ((count1 | count2) < _minGallop);
      if (exit) {
        break;
      }
      do {
        count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare2);
        if (count1 !== 0) {
          dest -= count1;
          cursor1 -= count1;
          length1 -= count1;
          customDest = dest + 1;
          customCursor = cursor1 + 1;
          for (i = count1 - 1; i >= 0; i--) {
            array[customDest + i] = array[customCursor + i];
          }
          if (length1 === 0) {
            exit = true;
            break;
          }
        }
        array[dest--] = tmp[cursor2--];
        if (--length2 === 1) {
          exit = true;
          break;
        }
        count2 = length2 - gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare2);
        if (count2 !== 0) {
          dest -= count2;
          cursor2 -= count2;
          length2 -= count2;
          customDest = dest + 1;
          customCursor = cursor2 + 1;
          for (i = 0; i < count2; i++) {
            array[customDest + i] = tmp[customCursor + i];
          }
          if (length2 <= 1) {
            exit = true;
            break;
          }
        }
        array[dest--] = array[cursor1--];
        if (--length1 === 0) {
          exit = true;
          break;
        }
        _minGallop--;
      } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);
      if (exit) {
        break;
      }
      if (_minGallop < 0) {
        _minGallop = 0;
      }
      _minGallop += 2;
    }
    minGallop = _minGallop;
    if (minGallop < 1) {
      minGallop = 1;
    }
    if (length2 === 1) {
      dest -= length1;
      cursor1 -= length1;
      customDest = dest + 1;
      customCursor = cursor1 + 1;
      for (i = length1 - 1; i >= 0; i--) {
        array[customDest + i] = array[customCursor + i];
      }
      array[dest] = tmp[cursor2];
    } else if (length2 === 0) {
      throw new Error();
    } else {
      customCursor = dest - (length2 - 1);
      for (i = 0; i < length2; i++) {
        array[customCursor + i] = tmp[i];
      }
    }
  }
  return {
    mergeRuns,
    forceMergeRuns,
    pushRun
  };
}
function sort(array, compare2, lo, hi) {
  if (!lo) {
    lo = 0;
  }
  if (!hi) {
    hi = array.length;
  }
  var remaining = hi - lo;
  if (remaining < 2) {
    return;
  }
  var runLength = 0;
  if (remaining < DEFAULT_MIN_MERGE) {
    runLength = makeAscendingRun(array, lo, hi, compare2);
    binaryInsertionSort(array, lo, hi, lo + runLength, compare2);
    return;
  }
  var ts = TimSort(array, compare2);
  var minRun = minRunLength(remaining);
  do {
    runLength = makeAscendingRun(array, lo, hi, compare2);
    if (runLength < minRun) {
      var force = remaining;
      if (force > minRun) {
        force = minRun;
      }
      binaryInsertionSort(array, lo, lo + force, lo + runLength, compare2);
      runLength = force;
    }
    ts.pushRun(lo, runLength);
    ts.mergeRuns();
    remaining -= runLength;
    lo += runLength;
  } while (remaining !== 0);
  ts.forceMergeRuns();
}

// node_modules/zrender/lib/Storage.js
var invalidZErrorLogged = false;
function logInvalidZError() {
  if (invalidZErrorLogged) {
    return;
  }
  invalidZErrorLogged = true;
  console.warn("z / z2 / zlevel of displayable is invalid, which may cause unexpected errors");
}
function shapeCompareFunc(a, b) {
  if (a.zlevel === b.zlevel) {
    if (a.z === b.z) {
      return a.z2 - b.z2;
    }
    return a.z - b.z;
  }
  return a.zlevel - b.zlevel;
}
var Storage = function() {
  function Storage2() {
    this._roots = [];
    this._displayList = [];
    this._displayListLen = 0;
    this.displayableSortFunc = shapeCompareFunc;
  }
  Storage2.prototype.traverse = function(cb, context) {
    for (var i = 0; i < this._roots.length; i++) {
      this._roots[i].traverse(cb, context);
    }
  };
  Storage2.prototype.getDisplayList = function(update, includeIgnore) {
    includeIgnore = includeIgnore || false;
    var displayList = this._displayList;
    if (update || !displayList.length) {
      this.updateDisplayList(includeIgnore);
    }
    return displayList;
  };
  Storage2.prototype.updateDisplayList = function(includeIgnore) {
    this._displayListLen = 0;
    var roots = this._roots;
    var displayList = this._displayList;
    for (var i = 0, len = roots.length; i < len; i++) {
      this._updateAndAddDisplayable(roots[i], null, includeIgnore);
    }
    displayList.length = this._displayListLen;
    sort(displayList, shapeCompareFunc);
  };
  Storage2.prototype._updateAndAddDisplayable = function(el, clipPaths, includeIgnore) {
    if (el.ignore && !includeIgnore) {
      return;
    }
    el.beforeUpdate();
    el.update();
    el.afterUpdate();
    var userSetClipPath = el.getClipPath();
    if (el.ignoreClip) {
      clipPaths = null;
    } else if (userSetClipPath) {
      if (clipPaths) {
        clipPaths = clipPaths.slice();
      } else {
        clipPaths = [];
      }
      var currentClipPath = userSetClipPath;
      var parentClipPath = el;
      while (currentClipPath) {
        currentClipPath.parent = parentClipPath;
        currentClipPath.updateTransform();
        clipPaths.push(currentClipPath);
        parentClipPath = currentClipPath;
        currentClipPath = currentClipPath.getClipPath();
      }
    }
    if (el.childrenRef) {
      var children = el.childrenRef();
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (el.__dirty) {
          child.__dirty |= REDRAW_BIT;
        }
        this._updateAndAddDisplayable(child, clipPaths, includeIgnore);
      }
      el.__dirty = 0;
    } else {
      var disp = el;
      if (clipPaths && clipPaths.length) {
        disp.__clipPaths = clipPaths;
      } else if (disp.__clipPaths && disp.__clipPaths.length > 0) {
        disp.__clipPaths = [];
      }
      if (isNaN(disp.z)) {
        logInvalidZError();
        disp.z = 0;
      }
      if (isNaN(disp.z2)) {
        logInvalidZError();
        disp.z2 = 0;
      }
      if (isNaN(disp.zlevel)) {
        logInvalidZError();
        disp.zlevel = 0;
      }
      this._displayList[this._displayListLen++] = disp;
    }
    var decalEl = el.getDecalElement && el.getDecalElement();
    if (decalEl) {
      this._updateAndAddDisplayable(decalEl, clipPaths, includeIgnore);
    }
    var textGuide = el.getTextGuideLine();
    if (textGuide) {
      this._updateAndAddDisplayable(textGuide, clipPaths, includeIgnore);
    }
    var textEl = el.getTextContent();
    if (textEl) {
      this._updateAndAddDisplayable(textEl, clipPaths, includeIgnore);
    }
  };
  Storage2.prototype.addRoot = function(el) {
    if (el.__zr && el.__zr.storage === this) {
      return;
    }
    this._roots.push(el);
  };
  Storage2.prototype.delRoot = function(el) {
    if (el instanceof Array) {
      for (var i = 0, l = el.length; i < l; i++) {
        this.delRoot(el[i]);
      }
      return;
    }
    var idx = indexOf(this._roots, el);
    if (idx >= 0) {
      this._roots.splice(idx, 1);
    }
  };
  Storage2.prototype.delAllRoots = function() {
    this._roots = [];
    this._displayList = [];
    this._displayListLen = 0;
    return;
  };
  Storage2.prototype.getRoots = function() {
    return this._roots;
  };
  Storage2.prototype.dispose = function() {
    this._displayList = null;
    this._roots = null;
  };
  return Storage2;
}();
var Storage_default = Storage;

// node_modules/zrender/lib/animation/Animation.js
function getTime() {
  return (/* @__PURE__ */ new Date()).getTime();
}
var Animation = function(_super) {
  __extends(Animation2, _super);
  function Animation2(opts) {
    var _this = _super.call(this) || this;
    _this._running = false;
    _this._time = 0;
    _this._pausedTime = 0;
    _this._pauseStart = 0;
    _this._paused = false;
    opts = opts || {};
    _this.stage = opts.stage || {};
    return _this;
  }
  Animation2.prototype.addClip = function(clip) {
    if (clip.animation) {
      this.removeClip(clip);
    }
    if (!this._head) {
      this._head = this._tail = clip;
    } else {
      this._tail.next = clip;
      clip.prev = this._tail;
      clip.next = null;
      this._tail = clip;
    }
    clip.animation = this;
  };
  Animation2.prototype.addAnimator = function(animator) {
    animator.animation = this;
    var clip = animator.getClip();
    if (clip) {
      this.addClip(clip);
    }
  };
  Animation2.prototype.removeClip = function(clip) {
    if (!clip.animation) {
      return;
    }
    var prev = clip.prev;
    var next = clip.next;
    if (prev) {
      prev.next = next;
    } else {
      this._head = next;
    }
    if (next) {
      next.prev = prev;
    } else {
      this._tail = prev;
    }
    clip.next = clip.prev = clip.animation = null;
  };
  Animation2.prototype.removeAnimator = function(animator) {
    var clip = animator.getClip();
    if (clip) {
      this.removeClip(clip);
    }
    animator.animation = null;
  };
  Animation2.prototype.update = function(notTriggerFrameAndStageUpdate) {
    var time = getTime() - this._pausedTime;
    var delta = time - this._time;
    var clip = this._head;
    while (clip) {
      var nextClip = clip.next;
      var finished = clip.step(time, delta);
      if (finished) {
        clip.ondestroy();
        this.removeClip(clip);
        clip = nextClip;
      } else {
        clip = nextClip;
      }
    }
    this._time = time;
    if (!notTriggerFrameAndStageUpdate) {
      this.trigger("frame", delta);
      this.stage.update && this.stage.update();
    }
  };
  Animation2.prototype._startLoop = function() {
    var self = this;
    this._running = true;
    function step() {
      if (self._running) {
        requestAnimationFrame_default(step);
        !self._paused && self.update();
      }
    }
    requestAnimationFrame_default(step);
  };
  Animation2.prototype.start = function() {
    if (this._running) {
      return;
    }
    this._time = getTime();
    this._pausedTime = 0;
    this._startLoop();
  };
  Animation2.prototype.stop = function() {
    this._running = false;
  };
  Animation2.prototype.pause = function() {
    if (!this._paused) {
      this._pauseStart = getTime();
      this._paused = true;
    }
  };
  Animation2.prototype.resume = function() {
    if (this._paused) {
      this._pausedTime += getTime() - this._pauseStart;
      this._paused = false;
    }
  };
  Animation2.prototype.clear = function() {
    var clip = this._head;
    while (clip) {
      var nextClip = clip.next;
      clip.prev = clip.next = clip.animation = null;
      clip = nextClip;
    }
    this._head = this._tail = null;
  };
  Animation2.prototype.isFinished = function() {
    return this._head == null;
  };
  Animation2.prototype.animate = function(target, options) {
    options = options || {};
    this.start();
    var animator = new Animator_default(target, options.loop);
    this.addAnimator(animator);
    return animator;
  };
  return Animation2;
}(Eventful_default);
var Animation_default = Animation;

// node_modules/zrender/lib/dom/HandlerProxy.js
var TOUCH_CLICK_DELAY = 300;
var globalEventSupported = env_default.domSupported;
var localNativeListenerNames = function() {
  var mouseHandlerNames = [
    "click",
    "dblclick",
    "mousewheel",
    "wheel",
    "mouseout",
    "mouseup",
    "mousedown",
    "mousemove",
    "contextmenu"
  ];
  var touchHandlerNames = [
    "touchstart",
    "touchend",
    "touchmove"
  ];
  var pointerEventNameMap = {
    pointerdown: 1,
    pointerup: 1,
    pointermove: 1,
    pointerout: 1
  };
  var pointerHandlerNames = map(mouseHandlerNames, function(name) {
    var nm = name.replace("mouse", "pointer");
    return pointerEventNameMap.hasOwnProperty(nm) ? nm : name;
  });
  return {
    mouse: mouseHandlerNames,
    touch: touchHandlerNames,
    pointer: pointerHandlerNames
  };
}();
var globalNativeListenerNames = {
  mouse: ["mousemove", "mouseup"],
  pointer: ["pointermove", "pointerup"]
};
var wheelEventSupported = false;
function isPointerFromTouch(event) {
  var pointerType = event.pointerType;
  return pointerType === "pen" || pointerType === "touch";
}
function setTouchTimer(scope) {
  scope.touching = true;
  if (scope.touchTimer != null) {
    clearTimeout(scope.touchTimer);
    scope.touchTimer = null;
  }
  scope.touchTimer = setTimeout(function() {
    scope.touching = false;
    scope.touchTimer = null;
  }, 700);
}
function markTouch(event) {
  event && (event.zrByTouch = true);
}
function normalizeGlobalEvent(instance, event) {
  return normalizeEvent(instance.dom, new FakeGlobalEvent(instance, event), true);
}
function isLocalEl(instance, el) {
  var elTmp = el;
  var isLocal = false;
  while (elTmp && elTmp.nodeType !== 9 && !(isLocal = elTmp.domBelongToZr || elTmp !== el && elTmp === instance.painterRoot)) {
    elTmp = elTmp.parentNode;
  }
  return isLocal;
}
var FakeGlobalEvent = function() {
  function FakeGlobalEvent2(instance, event) {
    this.stopPropagation = noop;
    this.stopImmediatePropagation = noop;
    this.preventDefault = noop;
    this.type = event.type;
    this.target = this.currentTarget = instance.dom;
    this.pointerType = event.pointerType;
    this.clientX = event.clientX;
    this.clientY = event.clientY;
  }
  return FakeGlobalEvent2;
}();
var localDOMHandlers = {
  mousedown: function(event) {
    event = normalizeEvent(this.dom, event);
    this.__mayPointerCapture = [event.zrX, event.zrY];
    this.trigger("mousedown", event);
  },
  mousemove: function(event) {
    event = normalizeEvent(this.dom, event);
    var downPoint = this.__mayPointerCapture;
    if (downPoint && (event.zrX !== downPoint[0] || event.zrY !== downPoint[1])) {
      this.__togglePointerCapture(true);
    }
    this.trigger("mousemove", event);
  },
  mouseup: function(event) {
    event = normalizeEvent(this.dom, event);
    this.__togglePointerCapture(false);
    this.trigger("mouseup", event);
  },
  mouseout: function(event) {
    event = normalizeEvent(this.dom, event);
    var element = event.toElement || event.relatedTarget;
    if (!isLocalEl(this, element)) {
      if (this.__pointerCapturing) {
        event.zrEventControl = "no_globalout";
      }
      this.trigger("mouseout", event);
    }
  },
  wheel: function(event) {
    wheelEventSupported = true;
    event = normalizeEvent(this.dom, event);
    this.trigger("mousewheel", event);
  },
  mousewheel: function(event) {
    if (wheelEventSupported) {
      return;
    }
    event = normalizeEvent(this.dom, event);
    this.trigger("mousewheel", event);
  },
  touchstart: function(event) {
    event = normalizeEvent(this.dom, event);
    markTouch(event);
    this.__lastTouchMoment = /* @__PURE__ */ new Date();
    this.handler.processGesture(event, "start");
    localDOMHandlers.mousemove.call(this, event);
    localDOMHandlers.mousedown.call(this, event);
  },
  touchmove: function(event) {
    event = normalizeEvent(this.dom, event);
    markTouch(event);
    this.handler.processGesture(event, "change");
    localDOMHandlers.mousemove.call(this, event);
  },
  touchend: function(event) {
    event = normalizeEvent(this.dom, event);
    markTouch(event);
    this.handler.processGesture(event, "end");
    localDOMHandlers.mouseup.call(this, event);
    if (+/* @__PURE__ */ new Date() - +this.__lastTouchMoment < TOUCH_CLICK_DELAY) {
      localDOMHandlers.click.call(this, event);
    }
  },
  pointerdown: function(event) {
    localDOMHandlers.mousedown.call(this, event);
  },
  pointermove: function(event) {
    if (!isPointerFromTouch(event)) {
      localDOMHandlers.mousemove.call(this, event);
    }
  },
  pointerup: function(event) {
    localDOMHandlers.mouseup.call(this, event);
  },
  pointerout: function(event) {
    if (!isPointerFromTouch(event)) {
      localDOMHandlers.mouseout.call(this, event);
    }
  }
};
each(["click", "dblclick", "contextmenu"], function(name) {
  localDOMHandlers[name] = function(event) {
    event = normalizeEvent(this.dom, event);
    this.trigger(name, event);
  };
});
var globalDOMHandlers = {
  pointermove: function(event) {
    if (!isPointerFromTouch(event)) {
      globalDOMHandlers.mousemove.call(this, event);
    }
  },
  pointerup: function(event) {
    globalDOMHandlers.mouseup.call(this, event);
  },
  mousemove: function(event) {
    this.trigger("mousemove", event);
  },
  mouseup: function(event) {
    var pointerCaptureReleasing = this.__pointerCapturing;
    this.__togglePointerCapture(false);
    this.trigger("mouseup", event);
    if (pointerCaptureReleasing) {
      event.zrEventControl = "only_globalout";
      this.trigger("mouseout", event);
    }
  }
};
function mountLocalDOMEventListeners(instance, scope) {
  var domHandlers = scope.domHandlers;
  if (env_default.pointerEventsSupported) {
    each(localNativeListenerNames.pointer, function(nativeEventName) {
      mountSingleDOMEventListener(scope, nativeEventName, function(event) {
        domHandlers[nativeEventName].call(instance, event);
      });
    });
  } else {
    if (env_default.touchEventsSupported) {
      each(localNativeListenerNames.touch, function(nativeEventName) {
        mountSingleDOMEventListener(scope, nativeEventName, function(event) {
          domHandlers[nativeEventName].call(instance, event);
          setTouchTimer(scope);
        });
      });
    }
    each(localNativeListenerNames.mouse, function(nativeEventName) {
      mountSingleDOMEventListener(scope, nativeEventName, function(event) {
        event = getNativeEvent(event);
        if (!scope.touching) {
          domHandlers[nativeEventName].call(instance, event);
        }
      });
    });
  }
}
function mountGlobalDOMEventListeners(instance, scope) {
  if (env_default.pointerEventsSupported) {
    each(globalNativeListenerNames.pointer, mount);
  } else if (!env_default.touchEventsSupported) {
    each(globalNativeListenerNames.mouse, mount);
  }
  function mount(nativeEventName) {
    function nativeEventListener(event) {
      event = getNativeEvent(event);
      if (!isLocalEl(instance, event.target)) {
        event = normalizeGlobalEvent(instance, event);
        scope.domHandlers[nativeEventName].call(instance, event);
      }
    }
    mountSingleDOMEventListener(scope, nativeEventName, nativeEventListener, { capture: true });
  }
}
function mountSingleDOMEventListener(scope, nativeEventName, listener, opt) {
  scope.mounted[nativeEventName] = listener;
  scope.listenerOpts[nativeEventName] = opt;
  addEventListener(scope.domTarget, nativeEventName, listener, opt);
}
function unmountDOMEventListeners(scope) {
  var mounted = scope.mounted;
  for (var nativeEventName in mounted) {
    if (mounted.hasOwnProperty(nativeEventName)) {
      removeEventListener(scope.domTarget, nativeEventName, mounted[nativeEventName], scope.listenerOpts[nativeEventName]);
    }
  }
  scope.mounted = {};
}
var DOMHandlerScope = function() {
  function DOMHandlerScope2(domTarget, domHandlers) {
    this.mounted = {};
    this.listenerOpts = {};
    this.touching = false;
    this.domTarget = domTarget;
    this.domHandlers = domHandlers;
  }
  return DOMHandlerScope2;
}();
var HandlerDomProxy = function(_super) {
  __extends(HandlerDomProxy2, _super);
  function HandlerDomProxy2(dom, painterRoot) {
    var _this = _super.call(this) || this;
    _this.__pointerCapturing = false;
    _this.dom = dom;
    _this.painterRoot = painterRoot;
    _this._localHandlerScope = new DOMHandlerScope(dom, localDOMHandlers);
    if (globalEventSupported) {
      _this._globalHandlerScope = new DOMHandlerScope(document, globalDOMHandlers);
    }
    mountLocalDOMEventListeners(_this, _this._localHandlerScope);
    return _this;
  }
  HandlerDomProxy2.prototype.dispose = function() {
    unmountDOMEventListeners(this._localHandlerScope);
    if (globalEventSupported) {
      unmountDOMEventListeners(this._globalHandlerScope);
    }
  };
  HandlerDomProxy2.prototype.setCursor = function(cursorStyle) {
    this.dom.style && (this.dom.style.cursor = cursorStyle || "default");
  };
  HandlerDomProxy2.prototype.__togglePointerCapture = function(isPointerCapturing) {
    this.__mayPointerCapture = null;
    if (globalEventSupported && +this.__pointerCapturing ^ +isPointerCapturing) {
      this.__pointerCapturing = isPointerCapturing;
      var globalHandlerScope = this._globalHandlerScope;
      isPointerCapturing ? mountGlobalDOMEventListeners(this, globalHandlerScope) : unmountDOMEventListeners(globalHandlerScope);
    }
  };
  return HandlerDomProxy2;
}(Eventful_default);
var HandlerProxy_default = HandlerDomProxy;

// node_modules/zrender/lib/graphic/Group.js
var Group = function(_super) {
  __extends(Group2, _super);
  function Group2(opts) {
    var _this = _super.call(this) || this;
    _this.isGroup = true;
    _this._children = [];
    _this.attr(opts);
    return _this;
  }
  Group2.prototype.childrenRef = function() {
    return this._children;
  };
  Group2.prototype.children = function() {
    return this._children.slice();
  };
  Group2.prototype.childAt = function(idx) {
    return this._children[idx];
  };
  Group2.prototype.childOfName = function(name) {
    var children = this._children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].name === name) {
        return children[i];
      }
    }
  };
  Group2.prototype.childCount = function() {
    return this._children.length;
  };
  Group2.prototype.add = function(child) {
    if (child) {
      if (child !== this && child.parent !== this) {
        this._children.push(child);
        this._doAdd(child);
      }
      if (true) {
        if (child.__hostTarget) {
          throw "This elemenet has been used as an attachment";
        }
      }
    }
    return this;
  };
  Group2.prototype.addBefore = function(child, nextSibling) {
    if (child && child !== this && child.parent !== this && nextSibling && nextSibling.parent === this) {
      var children = this._children;
      var idx = children.indexOf(nextSibling);
      if (idx >= 0) {
        children.splice(idx, 0, child);
        this._doAdd(child);
      }
    }
    return this;
  };
  Group2.prototype.replace = function(oldChild, newChild) {
    var idx = indexOf(this._children, oldChild);
    if (idx >= 0) {
      this.replaceAt(newChild, idx);
    }
    return this;
  };
  Group2.prototype.replaceAt = function(child, index) {
    var children = this._children;
    var old = children[index];
    if (child && child !== this && child.parent !== this && child !== old) {
      children[index] = child;
      old.parent = null;
      var zr = this.__zr;
      if (zr) {
        old.removeSelfFromZr(zr);
      }
      this._doAdd(child);
    }
    return this;
  };
  Group2.prototype._doAdd = function(child) {
    if (child.parent) {
      child.parent.remove(child);
    }
    child.parent = this;
    var zr = this.__zr;
    if (zr && zr !== child.__zr) {
      child.addSelfToZr(zr);
    }
    zr && zr.refresh();
  };
  Group2.prototype.remove = function(child) {
    var zr = this.__zr;
    var children = this._children;
    var idx = indexOf(children, child);
    if (idx < 0) {
      return this;
    }
    children.splice(idx, 1);
    child.parent = null;
    if (zr) {
      child.removeSelfFromZr(zr);
    }
    zr && zr.refresh();
    return this;
  };
  Group2.prototype.removeAll = function() {
    var children = this._children;
    var zr = this.__zr;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (zr) {
        child.removeSelfFromZr(zr);
      }
      child.parent = null;
    }
    children.length = 0;
    return this;
  };
  Group2.prototype.eachChild = function(cb, context) {
    var children = this._children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      cb.call(context, child, i);
    }
    return this;
  };
  Group2.prototype.traverse = function(cb, context) {
    for (var i = 0; i < this._children.length; i++) {
      var child = this._children[i];
      var stopped = cb.call(context, child);
      if (child.isGroup && !stopped) {
        child.traverse(cb, context);
      }
    }
    return this;
  };
  Group2.prototype.addSelfToZr = function(zr) {
    _super.prototype.addSelfToZr.call(this, zr);
    for (var i = 0; i < this._children.length; i++) {
      var child = this._children[i];
      child.addSelfToZr(zr);
    }
  };
  Group2.prototype.removeSelfFromZr = function(zr) {
    _super.prototype.removeSelfFromZr.call(this, zr);
    for (var i = 0; i < this._children.length; i++) {
      var child = this._children[i];
      child.removeSelfFromZr(zr);
    }
  };
  Group2.prototype.getBoundingRect = function(includeChildren) {
    var tmpRect2 = new BoundingRect_default(0, 0, 0, 0);
    var children = includeChildren || this._children;
    var tmpMat = [];
    var rect = null;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (child.ignore || child.invisible) {
        continue;
      }
      var childRect = child.getBoundingRect();
      var transform = child.getLocalTransform(tmpMat);
      if (transform) {
        BoundingRect_default.applyTransform(tmpRect2, childRect, transform);
        rect = rect || tmpRect2.clone();
        rect.union(tmpRect2);
      } else {
        rect = rect || childRect.clone();
        rect.union(childRect);
      }
    }
    return rect || tmpRect2;
  };
  return Group2;
}(Element_default);
Group.prototype.type = "group";
var Group_default = Group;

// node_modules/zrender/lib/zrender.js
var painterCtors = {};
var instances = {};
function delInstance(id) {
  delete instances[id];
}
function isDarkMode(backgroundColor2) {
  if (!backgroundColor2) {
    return false;
  }
  if (typeof backgroundColor2 === "string") {
    return lum(backgroundColor2, 1) < DARK_MODE_THRESHOLD;
  } else if (backgroundColor2.colorStops) {
    var colorStops = backgroundColor2.colorStops;
    var totalLum = 0;
    var len = colorStops.length;
    for (var i = 0; i < len; i++) {
      totalLum += lum(colorStops[i].color, 1);
    }
    totalLum /= len;
    return totalLum < DARK_MODE_THRESHOLD;
  }
  return false;
}
var ZRender = function() {
  function ZRender2(id, dom, opts) {
    var _this = this;
    this._sleepAfterStill = 10;
    this._stillFrameAccum = 0;
    this._needsRefresh = true;
    this._needsRefreshHover = true;
    this._darkMode = false;
    opts = opts || {};
    this.dom = dom;
    this.id = id;
    var storage2 = new Storage_default();
    var rendererType = opts.renderer || "canvas";
    if (!painterCtors[rendererType]) {
      rendererType = keys(painterCtors)[0];
    }
    if (true) {
      if (!painterCtors[rendererType]) {
        throw new Error("Renderer '" + rendererType + "' is not imported. Please import it first.");
      }
    }
    opts.useDirtyRect = opts.useDirtyRect == null ? false : opts.useDirtyRect;
    var painter = new painterCtors[rendererType](dom, storage2, opts, id);
    var ssrMode = opts.ssr || painter.ssrOnly;
    this.storage = storage2;
    this.painter = painter;
    var handerProxy = !env_default.node && !env_default.worker && !ssrMode ? new HandlerProxy_default(painter.getViewportRoot(), painter.root) : null;
    var useCoarsePointer = opts.useCoarsePointer;
    var usePointerSize = useCoarsePointer == null || useCoarsePointer === "auto" ? env_default.touchEventsSupported : !!useCoarsePointer;
    var defaultPointerSize = 44;
    var pointerSize;
    if (usePointerSize) {
      pointerSize = retrieve2(opts.pointerSize, defaultPointerSize);
    }
    this.handler = new Handler_default(storage2, painter, handerProxy, painter.root, pointerSize);
    this.animation = new Animation_default({
      stage: {
        update: ssrMode ? null : function() {
          return _this._flush(true);
        }
      }
    });
    if (!ssrMode) {
      this.animation.start();
    }
  }
  ZRender2.prototype.add = function(el) {
    if (!el) {
      return;
    }
    this.storage.addRoot(el);
    el.addSelfToZr(this);
    this.refresh();
  };
  ZRender2.prototype.remove = function(el) {
    if (!el) {
      return;
    }
    this.storage.delRoot(el);
    el.removeSelfFromZr(this);
    this.refresh();
  };
  ZRender2.prototype.configLayer = function(zLevel, config) {
    if (this.painter.configLayer) {
      this.painter.configLayer(zLevel, config);
    }
    this.refresh();
  };
  ZRender2.prototype.setBackgroundColor = function(backgroundColor2) {
    if (this.painter.setBackgroundColor) {
      this.painter.setBackgroundColor(backgroundColor2);
    }
    this.refresh();
    this._backgroundColor = backgroundColor2;
    this._darkMode = isDarkMode(backgroundColor2);
  };
  ZRender2.prototype.getBackgroundColor = function() {
    return this._backgroundColor;
  };
  ZRender2.prototype.setDarkMode = function(darkMode) {
    this._darkMode = darkMode;
  };
  ZRender2.prototype.isDarkMode = function() {
    return this._darkMode;
  };
  ZRender2.prototype.refreshImmediately = function(fromInside) {
    if (!fromInside) {
      this.animation.update(true);
    }
    this._needsRefresh = false;
    this.painter.refresh();
    this._needsRefresh = false;
  };
  ZRender2.prototype.refresh = function() {
    this._needsRefresh = true;
    this.animation.start();
  };
  ZRender2.prototype.flush = function() {
    this._flush(false);
  };
  ZRender2.prototype._flush = function(fromInside) {
    var triggerRendered;
    var start = getTime();
    if (this._needsRefresh) {
      triggerRendered = true;
      this.refreshImmediately(fromInside);
    }
    if (this._needsRefreshHover) {
      triggerRendered = true;
      this.refreshHoverImmediately();
    }
    var end = getTime();
    if (triggerRendered) {
      this._stillFrameAccum = 0;
      this.trigger("rendered", {
        elapsedTime: end - start
      });
    } else if (this._sleepAfterStill > 0) {
      this._stillFrameAccum++;
      if (this._stillFrameAccum > this._sleepAfterStill) {
        this.animation.stop();
      }
    }
  };
  ZRender2.prototype.setSleepAfterStill = function(stillFramesCount) {
    this._sleepAfterStill = stillFramesCount;
  };
  ZRender2.prototype.wakeUp = function() {
    this.animation.start();
    this._stillFrameAccum = 0;
  };
  ZRender2.prototype.refreshHover = function() {
    this._needsRefreshHover = true;
  };
  ZRender2.prototype.refreshHoverImmediately = function() {
    this._needsRefreshHover = false;
    if (this.painter.refreshHover && this.painter.getType() === "canvas") {
      this.painter.refreshHover();
    }
  };
  ZRender2.prototype.resize = function(opts) {
    opts = opts || {};
    this.painter.resize(opts.width, opts.height);
    this.handler.resize();
  };
  ZRender2.prototype.clearAnimation = function() {
    this.animation.clear();
  };
  ZRender2.prototype.getWidth = function() {
    return this.painter.getWidth();
  };
  ZRender2.prototype.getHeight = function() {
    return this.painter.getHeight();
  };
  ZRender2.prototype.setCursorStyle = function(cursorStyle) {
    this.handler.setCursorStyle(cursorStyle);
  };
  ZRender2.prototype.findHover = function(x, y) {
    return this.handler.findHover(x, y);
  };
  ZRender2.prototype.on = function(eventName, eventHandler, context) {
    this.handler.on(eventName, eventHandler, context);
    return this;
  };
  ZRender2.prototype.off = function(eventName, eventHandler) {
    this.handler.off(eventName, eventHandler);
  };
  ZRender2.prototype.trigger = function(eventName, event) {
    this.handler.trigger(eventName, event);
  };
  ZRender2.prototype.clear = function() {
    var roots = this.storage.getRoots();
    for (var i = 0; i < roots.length; i++) {
      if (roots[i] instanceof Group_default) {
        roots[i].removeSelfFromZr(this);
      }
    }
    this.storage.delAllRoots();
    this.painter.clear();
  };
  ZRender2.prototype.dispose = function() {
    this.animation.stop();
    this.clear();
    this.storage.dispose();
    this.painter.dispose();
    this.handler.dispose();
    this.animation = this.storage = this.painter = this.handler = null;
    delInstance(this.id);
  };
  return ZRender2;
}();
function init(dom, opts) {
  var zr = new ZRender(guid(), dom, opts);
  instances[zr.id] = zr;
  return zr;
}
function dispose(zr) {
  zr.dispose();
}
function disposeAll() {
  for (var key in instances) {
    if (instances.hasOwnProperty(key)) {
      instances[key].dispose();
    }
  }
  instances = {};
}
function getInstance(id) {
  return instances[id];
}
function registerPainter(name, Ctor) {
  painterCtors[name] = Ctor;
}
var version = "5.4.3";

// node_modules/echarts/lib/util/clazz.js
var TYPE_DELIMITER = ".";
var IS_CONTAINER = "___EC__COMPONENT__CONTAINER___";
var IS_EXTENDED_CLASS = "___EC__EXTENDED_CLASS___";
function parseClassType(componentType) {
  var ret = {
    main: "",
    sub: ""
  };
  if (componentType) {
    var typeArr = componentType.split(TYPE_DELIMITER);
    ret.main = typeArr[0] || "";
    ret.sub = typeArr[1] || "";
  }
  return ret;
}
function checkClassType(componentType) {
  assert(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(componentType), 'componentType "' + componentType + '" illegal');
}
function isExtendedClass(clz) {
  return !!(clz && clz[IS_EXTENDED_CLASS]);
}
function enableClassExtend(rootClz, mandatoryMethods) {
  rootClz.$constructor = rootClz;
  rootClz.extend = function(proto2) {
    if (true) {
      each(mandatoryMethods, function(method) {
        if (!proto2[method]) {
          console.warn("Method `" + method + "` should be implemented" + (proto2.type ? " in " + proto2.type : "") + ".");
        }
      });
    }
    var superClass = this;
    var ExtendedClass;
    if (isESClass(superClass)) {
      ExtendedClass = /** @class */
      function(_super) {
        __extends(class_1, _super);
        function class_1() {
          return _super.apply(this, arguments) || this;
        }
        return class_1;
      }(superClass);
    } else {
      ExtendedClass = function() {
        (proto2.$constructor || superClass).apply(this, arguments);
      };
      inherits(ExtendedClass, this);
    }
    extend(ExtendedClass.prototype, proto2);
    ExtendedClass[IS_EXTENDED_CLASS] = true;
    ExtendedClass.extend = this.extend;
    ExtendedClass.superCall = superCall;
    ExtendedClass.superApply = superApply;
    ExtendedClass.superClass = superClass;
    return ExtendedClass;
  };
}
function isESClass(fn) {
  return isFunction(fn) && /^class\s/.test(Function.prototype.toString.call(fn));
}
function mountExtend(SubClz, SupperClz) {
  SubClz.extend = SupperClz.extend;
}
var classBase = Math.round(Math.random() * 10);
function enableClassCheck(target) {
  var classAttr = ["__\0is_clz", classBase++].join("_");
  target.prototype[classAttr] = true;
  if (true) {
    assert(!target.isInstance, 'The method "is" can not be defined.');
  }
  target.isInstance = function(obj) {
    return !!(obj && obj[classAttr]);
  };
}
function superCall(context, methodName) {
  var args = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }
  return this.superClass.prototype[methodName].apply(context, args);
}
function superApply(context, methodName, args) {
  return this.superClass.prototype[methodName].apply(context, args);
}
function enableClassManagement(target) {
  var storage2 = {};
  target.registerClass = function(clz) {
    var componentFullType = clz.type || clz.prototype.type;
    if (componentFullType) {
      checkClassType(componentFullType);
      clz.prototype.type = componentFullType;
      var componentTypeInfo = parseClassType(componentFullType);
      if (!componentTypeInfo.sub) {
        if (true) {
          if (storage2[componentTypeInfo.main]) {
            console.warn(componentTypeInfo.main + " exists.");
          }
        }
        storage2[componentTypeInfo.main] = clz;
      } else if (componentTypeInfo.sub !== IS_CONTAINER) {
        var container = makeContainer(componentTypeInfo);
        container[componentTypeInfo.sub] = clz;
      }
    }
    return clz;
  };
  target.getClass = function(mainType, subType, throwWhenNotFound) {
    var clz = storage2[mainType];
    if (clz && clz[IS_CONTAINER]) {
      clz = subType ? clz[subType] : null;
    }
    if (throwWhenNotFound && !clz) {
      throw new Error(!subType ? mainType + ".type should be specified." : "Component " + mainType + "." + (subType || "") + " is used but not imported.");
    }
    return clz;
  };
  target.getClassesByMainType = function(componentType) {
    var componentTypeInfo = parseClassType(componentType);
    var result = [];
    var obj = storage2[componentTypeInfo.main];
    if (obj && obj[IS_CONTAINER]) {
      each(obj, function(o, type) {
        type !== IS_CONTAINER && result.push(o);
      });
    } else {
      result.push(obj);
    }
    return result;
  };
  target.hasClass = function(componentType) {
    var componentTypeInfo = parseClassType(componentType);
    return !!storage2[componentTypeInfo.main];
  };
  target.getAllClassMainTypes = function() {
    var types = [];
    each(storage2, function(obj, type) {
      types.push(type);
    });
    return types;
  };
  target.hasSubTypes = function(componentType) {
    var componentTypeInfo = parseClassType(componentType);
    var obj = storage2[componentTypeInfo.main];
    return obj && obj[IS_CONTAINER];
  };
  function makeContainer(componentTypeInfo) {
    var container = storage2[componentTypeInfo.main];
    if (!container || !container[IS_CONTAINER]) {
      container = storage2[componentTypeInfo.main] = {};
      container[IS_CONTAINER] = true;
    }
    return container;
  }
}

// node_modules/echarts/lib/model/mixin/makeStyleMapper.js
function makeStyleMapper(properties, ignoreParent) {
  for (var i = 0; i < properties.length; i++) {
    if (!properties[i][1]) {
      properties[i][1] = properties[i][0];
    }
  }
  ignoreParent = ignoreParent || false;
  return function(model, excludes, includes) {
    var style = {};
    for (var i2 = 0; i2 < properties.length; i2++) {
      var propName = properties[i2][1];
      if (excludes && indexOf(excludes, propName) >= 0 || includes && indexOf(includes, propName) < 0) {
        continue;
      }
      var val = model.getShallow(propName, ignoreParent);
      if (val != null) {
        style[properties[i2][0]] = val;
      }
    }
    return style;
  };
}

// node_modules/echarts/lib/model/mixin/areaStyle.js
var AREA_STYLE_KEY_MAP = [
  ["fill", "color"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["opacity"],
  ["shadowColor"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
];
var getAreaStyle = makeStyleMapper(AREA_STYLE_KEY_MAP);
var AreaStyleMixin = (
  /** @class */
  function() {
    function AreaStyleMixin2() {
    }
    AreaStyleMixin2.prototype.getAreaStyle = function(excludes, includes) {
      return getAreaStyle(this, excludes, includes);
    };
    return AreaStyleMixin2;
  }()
);

// node_modules/echarts/lib/util/number.js
var RADIAN_EPSILON = 1e-4;
var ROUND_SUPPORTED_PRECISION_MAX = 20;
function _trim(str) {
  return str.replace(/^\s+|\s+$/g, "");
}
function linearMap(val, domain, range, clamp2) {
  var d0 = domain[0];
  var d1 = domain[1];
  var r0 = range[0];
  var r1 = range[1];
  var subDomain = d1 - d0;
  var subRange = r1 - r0;
  if (subDomain === 0) {
    return subRange === 0 ? r0 : (r0 + r1) / 2;
  }
  if (clamp2) {
    if (subDomain > 0) {
      if (val <= d0) {
        return r0;
      } else if (val >= d1) {
        return r1;
      }
    } else {
      if (val >= d0) {
        return r0;
      } else if (val <= d1) {
        return r1;
      }
    }
  } else {
    if (val === d0) {
      return r0;
    }
    if (val === d1) {
      return r1;
    }
  }
  return (val - d0) / subDomain * subRange + r0;
}
function parsePercent2(percent, all) {
  switch (percent) {
    case "center":
    case "middle":
      percent = "50%";
      break;
    case "left":
    case "top":
      percent = "0%";
      break;
    case "right":
    case "bottom":
      percent = "100%";
      break;
  }
  if (isString(percent)) {
    if (_trim(percent).match(/%$/)) {
      return parseFloat(percent) / 100 * all;
    }
    return parseFloat(percent);
  }
  return percent == null ? NaN : +percent;
}
function round(x, precision, returnStr) {
  if (precision == null) {
    precision = 10;
  }
  precision = Math.min(Math.max(0, precision), ROUND_SUPPORTED_PRECISION_MAX);
  x = (+x).toFixed(precision);
  return returnStr ? x : +x;
}
function asc(arr) {
  arr.sort(function(a, b) {
    return a - b;
  });
  return arr;
}
function getPrecision(val) {
  val = +val;
  if (isNaN(val)) {
    return 0;
  }
  if (val > 1e-14) {
    var e2 = 1;
    for (var i = 0; i < 15; i++, e2 *= 10) {
      if (Math.round(val * e2) / e2 === val) {
        return i;
      }
    }
  }
  return getPrecisionSafe(val);
}
function getPrecisionSafe(val) {
  var str = val.toString().toLowerCase();
  var eIndex = str.indexOf("e");
  var exp = eIndex > 0 ? +str.slice(eIndex + 1) : 0;
  var significandPartLen = eIndex > 0 ? eIndex : str.length;
  var dotIndex = str.indexOf(".");
  var decimalPartLen = dotIndex < 0 ? 0 : significandPartLen - 1 - dotIndex;
  return Math.max(0, decimalPartLen - exp);
}
function getPixelPrecision(dataExtent, pixelExtent) {
  var log2 = Math.log;
  var LN10 = Math.LN10;
  var dataQuantity = Math.floor(log2(dataExtent[1] - dataExtent[0]) / LN10);
  var sizeQuantity = Math.round(log2(Math.abs(pixelExtent[1] - pixelExtent[0])) / LN10);
  var precision = Math.min(Math.max(-dataQuantity + sizeQuantity, 0), 20);
  return !isFinite(precision) ? 20 : precision;
}
function getPercentWithPrecision(valueList, idx, precision) {
  if (!valueList[idx]) {
    return 0;
  }
  var seats = getPercentSeats(valueList, precision);
  return seats[idx] || 0;
}
function getPercentSeats(valueList, precision) {
  var sum = reduce(valueList, function(acc, val) {
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  if (sum === 0) {
    return [];
  }
  var digits = Math.pow(10, precision);
  var votesPerQuota = map(valueList, function(val) {
    return (isNaN(val) ? 0 : val) / sum * digits * 100;
  });
  var targetSeats = digits * 100;
  var seats = map(votesPerQuota, function(votes) {
    return Math.floor(votes);
  });
  var currentSum = reduce(seats, function(acc, val) {
    return acc + val;
  }, 0);
  var remainder = map(votesPerQuota, function(votes, idx) {
    return votes - seats[idx];
  });
  while (currentSum < targetSeats) {
    var max2 = Number.NEGATIVE_INFINITY;
    var maxId = null;
    for (var i = 0, len = remainder.length; i < len; ++i) {
      if (remainder[i] > max2) {
        max2 = remainder[i];
        maxId = i;
      }
    }
    ++seats[maxId];
    remainder[maxId] = 0;
    ++currentSum;
  }
  return map(seats, function(seat) {
    return seat / digits;
  });
}
function addSafe(val0, val1) {
  var maxPrecision = Math.max(getPrecision(val0), getPrecision(val1));
  var sum = val0 + val1;
  return maxPrecision > ROUND_SUPPORTED_PRECISION_MAX ? sum : round(sum, maxPrecision);
}
var MAX_SAFE_INTEGER = 9007199254740991;
function remRadian(radian) {
  var pi2 = Math.PI * 2;
  return (radian % pi2 + pi2) % pi2;
}
function isRadianAroundZero(val) {
  return val > -RADIAN_EPSILON && val < RADIAN_EPSILON;
}
var TIME_REG = /^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/;
function parseDate(value) {
  if (value instanceof Date) {
    return value;
  } else if (isString(value)) {
    var match = TIME_REG.exec(value);
    if (!match) {
      return /* @__PURE__ */ new Date(NaN);
    }
    if (!match[8]) {
      return new Date(+match[1], +(match[2] || 1) - 1, +match[3] || 1, +match[4] || 0, +(match[5] || 0), +match[6] || 0, match[7] ? +match[7].substring(0, 3) : 0);
    } else {
      var hour = +match[4] || 0;
      if (match[8].toUpperCase() !== "Z") {
        hour -= +match[8].slice(0, 3);
      }
      return new Date(Date.UTC(+match[1], +(match[2] || 1) - 1, +match[3] || 1, hour, +(match[5] || 0), +match[6] || 0, match[7] ? +match[7].substring(0, 3) : 0));
    }
  } else if (value == null) {
    return /* @__PURE__ */ new Date(NaN);
  }
  return new Date(Math.round(value));
}
function quantity(val) {
  return Math.pow(10, quantityExponent(val));
}
function quantityExponent(val) {
  if (val === 0) {
    return 0;
  }
  var exp = Math.floor(Math.log(val) / Math.LN10);
  if (val / Math.pow(10, exp) >= 10) {
    exp++;
  }
  return exp;
}
function nice(val, round3) {
  var exponent = quantityExponent(val);
  var exp10 = Math.pow(10, exponent);
  var f = val / exp10;
  var nf;
  if (round3) {
    if (f < 1.5) {
      nf = 1;
    } else if (f < 2.5) {
      nf = 2;
    } else if (f < 4) {
      nf = 3;
    } else if (f < 7) {
      nf = 5;
    } else {
      nf = 10;
    }
  } else {
    if (f < 1) {
      nf = 1;
    } else if (f < 2) {
      nf = 2;
    } else if (f < 3) {
      nf = 3;
    } else if (f < 5) {
      nf = 5;
    } else {
      nf = 10;
    }
  }
  val = nf * exp10;
  return exponent >= -20 ? +val.toFixed(exponent < 0 ? -exponent : 0) : val;
}
function quantile(ascArr, p) {
  var H = (ascArr.length - 1) * p + 1;
  var h = Math.floor(H);
  var v = +ascArr[h - 1];
  var e2 = H - h;
  return e2 ? v + e2 * (ascArr[h] - v) : v;
}
function reformIntervals(list) {
  list.sort(function(a, b) {
    return littleThan2(a, b, 0) ? -1 : 1;
  });
  var curr = -Infinity;
  var currClose = 1;
  for (var i = 0; i < list.length; ) {
    var interval = list[i].interval;
    var close_1 = list[i].close;
    for (var lg = 0; lg < 2; lg++) {
      if (interval[lg] <= curr) {
        interval[lg] = curr;
        close_1[lg] = !lg ? 1 - currClose : 1;
      }
      curr = interval[lg];
      currClose = close_1[lg];
    }
    if (interval[0] === interval[1] && close_1[0] * close_1[1] !== 1) {
      list.splice(i, 1);
    } else {
      i++;
    }
  }
  return list;
  function littleThan2(a, b, lg2) {
    return a.interval[lg2] < b.interval[lg2] || a.interval[lg2] === b.interval[lg2] && (a.close[lg2] - b.close[lg2] === (!lg2 ? 1 : -1) || !lg2 && littleThan2(a, b, 1));
  }
}
function numericToNumber(val) {
  var valFloat = parseFloat(val);
  return valFloat == val && (valFloat !== 0 || !isString(val) || val.indexOf("x") <= 0) ? valFloat : NaN;
}
function isNumeric(val) {
  return !isNaN(numericToNumber(val));
}
function getRandomIdBase() {
  return Math.round(Math.random() * 9);
}
function getGreatestCommonDividor(a, b) {
  if (b === 0) {
    return a;
  }
  return getGreatestCommonDividor(b, a % b);
}
function getLeastCommonMultiple(a, b) {
  if (a == null) {
    return b;
  }
  if (b == null) {
    return a;
  }
  return a * b / getGreatestCommonDividor(a, b);
}

// node_modules/echarts/lib/util/log.js
var ECHARTS_PREFIX = "[ECharts] ";
var storedLogs = {};
var hasConsole = typeof console !== "undefined" && console.warn && console.log;
function outputLog(type, str, onlyOnce) {
  if (hasConsole) {
    if (onlyOnce) {
      if (storedLogs[str]) {
        return;
      }
      storedLogs[str] = true;
    }
    console[type](ECHARTS_PREFIX + str);
  }
}
function log(str, onlyOnce) {
  outputLog("log", str, onlyOnce);
}
function warn(str, onlyOnce) {
  outputLog("warn", str, onlyOnce);
}
function error(str, onlyOnce) {
  outputLog("error", str, onlyOnce);
}
function deprecateLog(str) {
  if (true) {
    outputLog("warn", "DEPRECATED: " + str, true);
  }
}
function deprecateReplaceLog(oldOpt, newOpt, scope) {
  if (true) {
    deprecateLog((scope ? "[" + scope + "]" : "") + (oldOpt + " is deprecated, use " + newOpt + " instead."));
  }
}
function makePrintable() {
  var hintInfo = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    hintInfo[_i] = arguments[_i];
  }
  var msg = "";
  if (true) {
    var makePrintableStringIfPossible_1 = function(val) {
      return val === void 0 ? "undefined" : val === Infinity ? "Infinity" : val === -Infinity ? "-Infinity" : eqNaN(val) ? "NaN" : val instanceof Date ? "Date(" + val.toISOString() + ")" : isFunction(val) ? "function () { ... }" : isRegExp(val) ? val + "" : null;
    };
    msg = map(hintInfo, function(arg) {
      if (isString(arg)) {
        return arg;
      } else {
        var printableStr = makePrintableStringIfPossible_1(arg);
        if (printableStr != null) {
          return printableStr;
        } else if (typeof JSON !== "undefined" && JSON.stringify) {
          try {
            return JSON.stringify(arg, function(n, val) {
              var printableStr2 = makePrintableStringIfPossible_1(val);
              return printableStr2 == null ? val : printableStr2;
            });
          } catch (err) {
            return "?";
          }
        } else {
          return "?";
        }
      }
    }).join(" ");
  }
  return msg;
}
function throwError(msg) {
  throw new Error(msg);
}

// node_modules/echarts/lib/util/model.js
function interpolateNumber(p0, p1, percent) {
  return (p1 - p0) * percent + p0;
}
var DUMMY_COMPONENT_NAME_PREFIX = "series\0";
var INTERNAL_COMPONENT_ID_PREFIX = "\0_ec_\0";
function normalizeToArray(value) {
  return value instanceof Array ? value : value == null ? [] : [value];
}
function defaultEmphasis(opt, key, subOpts) {
  if (opt) {
    opt[key] = opt[key] || {};
    opt.emphasis = opt.emphasis || {};
    opt.emphasis[key] = opt.emphasis[key] || {};
    for (var i = 0, len = subOpts.length; i < len; i++) {
      var subOptName = subOpts[i];
      if (!opt.emphasis[key].hasOwnProperty(subOptName) && opt[key].hasOwnProperty(subOptName)) {
        opt.emphasis[key][subOptName] = opt[key][subOptName];
      }
    }
  }
}
var TEXT_STYLE_OPTIONS = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "rich", "tag", "color", "textBorderColor", "textBorderWidth", "width", "height", "lineHeight", "align", "verticalAlign", "baseline", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY", "backgroundColor", "borderColor", "borderWidth", "borderRadius", "padding"];
function getDataItemValue(dataItem) {
  return isObject(dataItem) && !isArray(dataItem) && !(dataItem instanceof Date) ? dataItem.value : dataItem;
}
function isDataItemOption(dataItem) {
  return isObject(dataItem) && !(dataItem instanceof Array);
}
function mappingToExists(existings, newCmptOptions, mode) {
  var isNormalMergeMode = mode === "normalMerge";
  var isReplaceMergeMode = mode === "replaceMerge";
  var isReplaceAllMode = mode === "replaceAll";
  existings = existings || [];
  newCmptOptions = (newCmptOptions || []).slice();
  var existingIdIdxMap = createHashMap();
  each(newCmptOptions, function(cmptOption, index) {
    if (!isObject(cmptOption)) {
      newCmptOptions[index] = null;
      return;
    }
    if (true) {
      if (cmptOption.id != null && !isValidIdOrName(cmptOption.id)) {
        warnInvalidateIdOrName(cmptOption.id);
      }
      if (cmptOption.name != null && !isValidIdOrName(cmptOption.name)) {
        warnInvalidateIdOrName(cmptOption.name);
      }
    }
  });
  var result = prepareResult(existings, existingIdIdxMap, mode);
  if (isNormalMergeMode || isReplaceMergeMode) {
    mappingById(result, existings, existingIdIdxMap, newCmptOptions);
  }
  if (isNormalMergeMode) {
    mappingByName(result, newCmptOptions);
  }
  if (isNormalMergeMode || isReplaceMergeMode) {
    mappingByIndex(result, newCmptOptions, isReplaceMergeMode);
  } else if (isReplaceAllMode) {
    mappingInReplaceAllMode(result, newCmptOptions);
  }
  makeIdAndName(result);
  return result;
}
function prepareResult(existings, existingIdIdxMap, mode) {
  var result = [];
  if (mode === "replaceAll") {
    return result;
  }
  for (var index = 0; index < existings.length; index++) {
    var existing = existings[index];
    if (existing && existing.id != null) {
      existingIdIdxMap.set(existing.id, index);
    }
    result.push({
      existing: mode === "replaceMerge" || isComponentIdInternal(existing) ? null : existing,
      newOption: null,
      keyInfo: null,
      brandNew: null
    });
  }
  return result;
}
function mappingById(result, existings, existingIdIdxMap, newCmptOptions) {
  each(newCmptOptions, function(cmptOption, index) {
    if (!cmptOption || cmptOption.id == null) {
      return;
    }
    var optionId = makeComparableKey(cmptOption.id);
    var existingIdx = existingIdIdxMap.get(optionId);
    if (existingIdx != null) {
      var resultItem = result[existingIdx];
      assert(!resultItem.newOption, 'Duplicated option on id "' + optionId + '".');
      resultItem.newOption = cmptOption;
      resultItem.existing = existings[existingIdx];
      newCmptOptions[index] = null;
    }
  });
}
function mappingByName(result, newCmptOptions) {
  each(newCmptOptions, function(cmptOption, index) {
    if (!cmptOption || cmptOption.name == null) {
      return;
    }
    for (var i = 0; i < result.length; i++) {
      var existing = result[i].existing;
      if (!result[i].newOption && existing && (existing.id == null || cmptOption.id == null) && !isComponentIdInternal(cmptOption) && !isComponentIdInternal(existing) && keyExistAndEqual("name", existing, cmptOption)) {
        result[i].newOption = cmptOption;
        newCmptOptions[index] = null;
        return;
      }
    }
  });
}
function mappingByIndex(result, newCmptOptions, brandNew) {
  each(newCmptOptions, function(cmptOption) {
    if (!cmptOption) {
      return;
    }
    var resultItem;
    var nextIdx = 0;
    while (
      // Be `!resultItem` only when `nextIdx >= result.length`.
      (resultItem = result[nextIdx]) && // (1) Existing models that already have id should be able to mapped to. Because
      // after mapping performed, model will always be assigned with an id if user not given.
      // After that all models have id.
      // (2) If new option has id, it can only set to a hole or append to the last. It should
      // not be merged to the existings with different id. Because id should not be overwritten.
      // (3) Name can be overwritten, because axis use name as 'show label text'.
      (resultItem.newOption || isComponentIdInternal(resultItem.existing) || // In mode "replaceMerge", here no not-mapped-non-internal-existing.
      resultItem.existing && cmptOption.id != null && !keyExistAndEqual("id", cmptOption, resultItem.existing))
    ) {
      nextIdx++;
    }
    if (resultItem) {
      resultItem.newOption = cmptOption;
      resultItem.brandNew = brandNew;
    } else {
      result.push({
        newOption: cmptOption,
        brandNew,
        existing: null,
        keyInfo: null
      });
    }
    nextIdx++;
  });
}
function mappingInReplaceAllMode(result, newCmptOptions) {
  each(newCmptOptions, function(cmptOption) {
    result.push({
      newOption: cmptOption,
      brandNew: true,
      existing: null,
      keyInfo: null
    });
  });
}
function makeIdAndName(mapResult) {
  var idMap = createHashMap();
  each(mapResult, function(item) {
    var existing = item.existing;
    existing && idMap.set(existing.id, item);
  });
  each(mapResult, function(item) {
    var opt = item.newOption;
    assert(!opt || opt.id == null || !idMap.get(opt.id) || idMap.get(opt.id) === item, "id duplicates: " + (opt && opt.id));
    opt && opt.id != null && idMap.set(opt.id, item);
    !item.keyInfo && (item.keyInfo = {});
  });
  each(mapResult, function(item, index) {
    var existing = item.existing;
    var opt = item.newOption;
    var keyInfo = item.keyInfo;
    if (!isObject(opt)) {
      return;
    }
    keyInfo.name = opt.name != null ? makeComparableKey(opt.name) : existing ? existing.name : DUMMY_COMPONENT_NAME_PREFIX + index;
    if (existing) {
      keyInfo.id = makeComparableKey(existing.id);
    } else if (opt.id != null) {
      keyInfo.id = makeComparableKey(opt.id);
    } else {
      var idNum = 0;
      do {
        keyInfo.id = "\0" + keyInfo.name + "\0" + idNum++;
      } while (idMap.get(keyInfo.id));
    }
    idMap.set(keyInfo.id, item);
  });
}
function keyExistAndEqual(attr, obj1, obj2) {
  var key1 = convertOptionIdName(obj1[attr], null);
  var key2 = convertOptionIdName(obj2[attr], null);
  return key1 != null && key2 != null && key1 === key2;
}
function makeComparableKey(val) {
  if (true) {
    if (val == null) {
      throw new Error();
    }
  }
  return convertOptionIdName(val, "");
}
function convertOptionIdName(idOrName, defaultValue) {
  if (idOrName == null) {
    return defaultValue;
  }
  return isString(idOrName) ? idOrName : isNumber(idOrName) || isStringSafe(idOrName) ? idOrName + "" : defaultValue;
}
function warnInvalidateIdOrName(idOrName) {
  if (true) {
    warn("`" + idOrName + "` is invalid id or name. Must be a string or number.");
  }
}
function isValidIdOrName(idOrName) {
  return isStringSafe(idOrName) || isNumeric(idOrName);
}
function isNameSpecified(componentModel) {
  var name = componentModel.name;
  return !!(name && name.indexOf(DUMMY_COMPONENT_NAME_PREFIX));
}
function isComponentIdInternal(cmptOption) {
  return cmptOption && cmptOption.id != null && makeComparableKey(cmptOption.id).indexOf(INTERNAL_COMPONENT_ID_PREFIX) === 0;
}
function makeInternalComponentId(idSuffix) {
  return INTERNAL_COMPONENT_ID_PREFIX + idSuffix;
}
function setComponentTypeToKeyInfo(mappingResult, mainType, componentModelCtor) {
  each(mappingResult, function(item) {
    var newOption = item.newOption;
    if (isObject(newOption)) {
      item.keyInfo.mainType = mainType;
      item.keyInfo.subType = determineSubType(mainType, newOption, item.existing, componentModelCtor);
    }
  });
}
function determineSubType(mainType, newCmptOption, existComponent, componentModelCtor) {
  var subType = newCmptOption.type ? newCmptOption.type : existComponent ? existComponent.subType : componentModelCtor.determineSubType(mainType, newCmptOption);
  return subType;
}
function compressBatches(batchA, batchB) {
  var mapA = {};
  var mapB = {};
  makeMap(batchA || [], mapA);
  makeMap(batchB || [], mapB, mapA);
  return [mapToArray(mapA), mapToArray(mapB)];
  function makeMap(sourceBatch, map3, otherMap) {
    for (var i = 0, len = sourceBatch.length; i < len; i++) {
      var seriesId = convertOptionIdName(sourceBatch[i].seriesId, null);
      if (seriesId == null) {
        return;
      }
      var dataIndices = normalizeToArray(sourceBatch[i].dataIndex);
      var otherDataIndices = otherMap && otherMap[seriesId];
      for (var j = 0, lenj = dataIndices.length; j < lenj; j++) {
        var dataIndex = dataIndices[j];
        if (otherDataIndices && otherDataIndices[dataIndex]) {
          otherDataIndices[dataIndex] = null;
        } else {
          (map3[seriesId] || (map3[seriesId] = {}))[dataIndex] = 1;
        }
      }
    }
  }
  function mapToArray(map3, isData) {
    var result = [];
    for (var i in map3) {
      if (map3.hasOwnProperty(i) && map3[i] != null) {
        if (isData) {
          result.push(+i);
        } else {
          var dataIndices = mapToArray(map3[i], true);
          dataIndices.length && result.push({
            seriesId: i,
            dataIndex: dataIndices
          });
        }
      }
    }
    return result;
  }
}
function queryDataIndex(data, payload) {
  if (payload.dataIndexInside != null) {
    return payload.dataIndexInside;
  } else if (payload.dataIndex != null) {
    return isArray(payload.dataIndex) ? map(payload.dataIndex, function(value) {
      return data.indexOfRawIndex(value);
    }) : data.indexOfRawIndex(payload.dataIndex);
  } else if (payload.name != null) {
    return isArray(payload.name) ? map(payload.name, function(value) {
      return data.indexOfName(value);
    }) : data.indexOfName(payload.name);
  }
}
function makeInner() {
  var key = "__ec_inner_" + innerUniqueIndex++;
  return function(hostObj) {
    return hostObj[key] || (hostObj[key] = {});
  };
}
var innerUniqueIndex = getRandomIdBase();
function parseFinder(ecModel, finderInput, opt) {
  var _a2 = preParseFinder(finderInput, opt), mainTypeSpecified = _a2.mainTypeSpecified, queryOptionMap = _a2.queryOptionMap, others = _a2.others;
  var result = others;
  var defaultMainType = opt ? opt.defaultMainType : null;
  if (!mainTypeSpecified && defaultMainType) {
    queryOptionMap.set(defaultMainType, {});
  }
  queryOptionMap.each(function(queryOption, mainType) {
    var queryResult = queryReferringComponents(ecModel, mainType, queryOption, {
      useDefault: defaultMainType === mainType,
      enableAll: opt && opt.enableAll != null ? opt.enableAll : true,
      enableNone: opt && opt.enableNone != null ? opt.enableNone : true
    });
    result[mainType + "Models"] = queryResult.models;
    result[mainType + "Model"] = queryResult.models[0];
  });
  return result;
}
function preParseFinder(finderInput, opt) {
  var finder;
  if (isString(finderInput)) {
    var obj = {};
    obj[finderInput + "Index"] = 0;
    finder = obj;
  } else {
    finder = finderInput;
  }
  var queryOptionMap = createHashMap();
  var others = {};
  var mainTypeSpecified = false;
  each(finder, function(value, key) {
    if (key === "dataIndex" || key === "dataIndexInside") {
      others[key] = value;
      return;
    }
    var parsedKey = key.match(/^(\w+)(Index|Id|Name)$/) || [];
    var mainType = parsedKey[1];
    var queryType = (parsedKey[2] || "").toLowerCase();
    if (!mainType || !queryType || opt && opt.includeMainTypes && indexOf(opt.includeMainTypes, mainType) < 0) {
      return;
    }
    mainTypeSpecified = mainTypeSpecified || !!mainType;
    var queryOption = queryOptionMap.get(mainType) || queryOptionMap.set(mainType, {});
    queryOption[queryType] = value;
  });
  return {
    mainTypeSpecified,
    queryOptionMap,
    others
  };
}
var SINGLE_REFERRING = {
  useDefault: true,
  enableAll: false,
  enableNone: false
};
var MULTIPLE_REFERRING = {
  useDefault: false,
  enableAll: true,
  enableNone: true
};
function queryReferringComponents(ecModel, mainType, userOption, opt) {
  opt = opt || SINGLE_REFERRING;
  var indexOption = userOption.index;
  var idOption = userOption.id;
  var nameOption = userOption.name;
  var result = {
    models: null,
    specified: indexOption != null || idOption != null || nameOption != null
  };
  if (!result.specified) {
    var firstCmpt = void 0;
    result.models = opt.useDefault && (firstCmpt = ecModel.getComponent(mainType)) ? [firstCmpt] : [];
    return result;
  }
  if (indexOption === "none" || indexOption === false) {
    assert(opt.enableNone, '`"none"` or `false` is not a valid value on index option.');
    result.models = [];
    return result;
  }
  if (indexOption === "all") {
    assert(opt.enableAll, '`"all"` is not a valid value on index option.');
    indexOption = idOption = nameOption = null;
  }
  result.models = ecModel.queryComponents({
    mainType,
    index: indexOption,
    id: idOption,
    name: nameOption
  });
  return result;
}
function setAttribute(dom, key, value) {
  dom.setAttribute ? dom.setAttribute(key, value) : dom[key] = value;
}
function getAttribute(dom, key) {
  return dom.getAttribute ? dom.getAttribute(key) : dom[key];
}
function getTooltipRenderMode(renderModeOption) {
  if (renderModeOption === "auto") {
    return env_default.domSupported ? "html" : "richText";
  } else {
    return renderModeOption || "html";
  }
}
function groupData(array, getKey) {
  var buckets = createHashMap();
  var keys2 = [];
  each(array, function(item) {
    var key = getKey(item);
    (buckets.get(key) || (keys2.push(key), buckets.set(key, []))).push(item);
  });
  return {
    keys: keys2,
    buckets
  };
}
function interpolateRawValues(data, precision, sourceValue, targetValue, percent) {
  var isAutoPrecision = precision == null || precision === "auto";
  if (targetValue == null) {
    return targetValue;
  }
  if (isNumber(targetValue)) {
    var value = interpolateNumber(sourceValue || 0, targetValue, percent);
    return round(value, isAutoPrecision ? Math.max(getPrecision(sourceValue || 0), getPrecision(targetValue)) : precision);
  } else if (isString(targetValue)) {
    return percent < 1 ? sourceValue : targetValue;
  } else {
    var interpolated = [];
    var leftArr = sourceValue;
    var rightArr = targetValue;
    var length_1 = Math.max(leftArr ? leftArr.length : 0, rightArr.length);
    for (var i = 0; i < length_1; ++i) {
      var info = data.getDimensionInfo(i);
      if (info && info.type === "ordinal") {
        interpolated[i] = (percent < 1 && leftArr ? leftArr : rightArr)[i];
      } else {
        var leftVal = leftArr && leftArr[i] ? leftArr[i] : 0;
        var rightVal = rightArr[i];
        var value = interpolateNumber(leftVal, rightVal, percent);
        interpolated[i] = round(value, isAutoPrecision ? Math.max(getPrecision(leftVal), getPrecision(rightVal)) : precision);
      }
    }
    return interpolated;
  }
}

// node_modules/echarts/lib/util/innerStore.js
var getECData = makeInner();
var setCommonECData = function(seriesIndex, dataType, dataIdx, el) {
  if (el) {
    var ecData = getECData(el);
    ecData.dataIndex = dataIdx;
    ecData.dataType = dataType;
    ecData.seriesIndex = seriesIndex;
    if (el.type === "group") {
      el.traverse(function(child) {
        var childECData = getECData(child);
        childECData.seriesIndex = seriesIndex;
        childECData.dataIndex = dataIdx;
        childECData.dataType = dataType;
      });
    }
  }
};

// node_modules/echarts/lib/util/states.js
var _highlightNextDigit = 1;
var _highlightKeyMap = {};
var getSavedStates = makeInner();
var getComponentStates = makeInner();
var HOVER_STATE_NORMAL = 0;
var HOVER_STATE_BLUR = 1;
var HOVER_STATE_EMPHASIS = 2;
var SPECIAL_STATES = ["emphasis", "blur", "select"];
var DISPLAY_STATES = ["normal", "emphasis", "blur", "select"];
var Z2_EMPHASIS_LIFT = 10;
var Z2_SELECT_LIFT = 9;
var HIGHLIGHT_ACTION_TYPE = "highlight";
var DOWNPLAY_ACTION_TYPE = "downplay";
var SELECT_ACTION_TYPE = "select";
var UNSELECT_ACTION_TYPE = "unselect";
var TOGGLE_SELECT_ACTION_TYPE = "toggleSelect";
function hasFillOrStroke(fillOrStroke) {
  return fillOrStroke != null && fillOrStroke !== "none";
}
var liftedColorCache = new LRU_default(100);
function liftColor(color) {
  if (isString(color)) {
    var liftedColor = liftedColorCache.get(color);
    if (!liftedColor) {
      liftedColor = lift(color, -0.1);
      liftedColorCache.put(color, liftedColor);
    }
    return liftedColor;
  } else if (isGradientObject(color)) {
    var ret = extend({}, color);
    ret.colorStops = map(color.colorStops, function(stop2) {
      return {
        offset: stop2.offset,
        color: lift(stop2.color, -0.1)
      };
    });
    return ret;
  }
  return color;
}
function doChangeHoverState(el, stateName, hoverStateEnum) {
  if (el.onHoverStateChange && (el.hoverState || 0) !== hoverStateEnum) {
    el.onHoverStateChange(stateName);
  }
  el.hoverState = hoverStateEnum;
}
function singleEnterEmphasis(el) {
  doChangeHoverState(el, "emphasis", HOVER_STATE_EMPHASIS);
}
function singleLeaveEmphasis(el) {
  if (el.hoverState === HOVER_STATE_EMPHASIS) {
    doChangeHoverState(el, "normal", HOVER_STATE_NORMAL);
  }
}
function singleEnterBlur(el) {
  doChangeHoverState(el, "blur", HOVER_STATE_BLUR);
}
function singleLeaveBlur(el) {
  if (el.hoverState === HOVER_STATE_BLUR) {
    doChangeHoverState(el, "normal", HOVER_STATE_NORMAL);
  }
}
function singleEnterSelect(el) {
  el.selected = true;
}
function singleLeaveSelect(el) {
  el.selected = false;
}
function updateElementState(el, updater, commonParam) {
  updater(el, commonParam);
}
function traverseUpdateState(el, updater, commonParam) {
  updateElementState(el, updater, commonParam);
  el.isGroup && el.traverse(function(child) {
    updateElementState(child, updater, commonParam);
  });
}
function setStatesFlag(el, stateName) {
  switch (stateName) {
    case "emphasis":
      el.hoverState = HOVER_STATE_EMPHASIS;
      break;
    case "normal":
      el.hoverState = HOVER_STATE_NORMAL;
      break;
    case "blur":
      el.hoverState = HOVER_STATE_BLUR;
      break;
    case "select":
      el.selected = true;
  }
}
function getFromStateStyle(el, props, toStateName, defaultValue) {
  var style = el.style;
  var fromState = {};
  for (var i = 0; i < props.length; i++) {
    var propName = props[i];
    var val = style[propName];
    fromState[propName] = val == null ? defaultValue && defaultValue[propName] : val;
  }
  for (var i = 0; i < el.animators.length; i++) {
    var animator = el.animators[i];
    if (animator.__fromStateTransition && animator.__fromStateTransition.indexOf(toStateName) < 0 && animator.targetName === "style") {
      animator.saveTo(fromState, props);
    }
  }
  return fromState;
}
function createEmphasisDefaultState(el, stateName, targetStates, state) {
  var hasSelect = targetStates && indexOf(targetStates, "select") >= 0;
  var cloned = false;
  if (el instanceof Path_default) {
    var store = getSavedStates(el);
    var fromFill = hasSelect ? store.selectFill || store.normalFill : store.normalFill;
    var fromStroke = hasSelect ? store.selectStroke || store.normalStroke : store.normalStroke;
    if (hasFillOrStroke(fromFill) || hasFillOrStroke(fromStroke)) {
      state = state || {};
      var emphasisStyle = state.style || {};
      if (emphasisStyle.fill === "inherit") {
        cloned = true;
        state = extend({}, state);
        emphasisStyle = extend({}, emphasisStyle);
        emphasisStyle.fill = fromFill;
      } else if (!hasFillOrStroke(emphasisStyle.fill) && hasFillOrStroke(fromFill)) {
        cloned = true;
        state = extend({}, state);
        emphasisStyle = extend({}, emphasisStyle);
        emphasisStyle.fill = liftColor(fromFill);
      } else if (!hasFillOrStroke(emphasisStyle.stroke) && hasFillOrStroke(fromStroke)) {
        if (!cloned) {
          state = extend({}, state);
          emphasisStyle = extend({}, emphasisStyle);
        }
        emphasisStyle.stroke = liftColor(fromStroke);
      }
      state.style = emphasisStyle;
    }
  }
  if (state) {
    if (state.z2 == null) {
      if (!cloned) {
        state = extend({}, state);
      }
      var z2EmphasisLift = el.z2EmphasisLift;
      state.z2 = el.z2 + (z2EmphasisLift != null ? z2EmphasisLift : Z2_EMPHASIS_LIFT);
    }
  }
  return state;
}
function createSelectDefaultState(el, stateName, state) {
  if (state) {
    if (state.z2 == null) {
      state = extend({}, state);
      var z2SelectLift = el.z2SelectLift;
      state.z2 = el.z2 + (z2SelectLift != null ? z2SelectLift : Z2_SELECT_LIFT);
    }
  }
  return state;
}
function createBlurDefaultState(el, stateName, state) {
  var hasBlur = indexOf(el.currentStates, stateName) >= 0;
  var currentOpacity = el.style.opacity;
  var fromState = !hasBlur ? getFromStateStyle(el, ["opacity"], stateName, {
    opacity: 1
  }) : null;
  state = state || {};
  var blurStyle = state.style || {};
  if (blurStyle.opacity == null) {
    state = extend({}, state);
    blurStyle = extend({
      // Already being applied 'emphasis'. DON'T mul opacity multiple times.
      opacity: hasBlur ? currentOpacity : fromState.opacity * 0.1
    }, blurStyle);
    state.style = blurStyle;
  }
  return state;
}
function elementStateProxy(stateName, targetStates) {
  var state = this.states[stateName];
  if (this.style) {
    if (stateName === "emphasis") {
      return createEmphasisDefaultState(this, stateName, targetStates, state);
    } else if (stateName === "blur") {
      return createBlurDefaultState(this, stateName, state);
    } else if (stateName === "select") {
      return createSelectDefaultState(this, stateName, state);
    }
  }
  return state;
}
function setDefaultStateProxy(el) {
  el.stateProxy = elementStateProxy;
  var textContent = el.getTextContent();
  var textGuide = el.getTextGuideLine();
  if (textContent) {
    textContent.stateProxy = elementStateProxy;
  }
  if (textGuide) {
    textGuide.stateProxy = elementStateProxy;
  }
}
function enterEmphasisWhenMouseOver(el, e2) {
  !shouldSilent(el, e2) && !el.__highByOuter && traverseUpdateState(el, singleEnterEmphasis);
}
function leaveEmphasisWhenMouseOut(el, e2) {
  !shouldSilent(el, e2) && !el.__highByOuter && traverseUpdateState(el, singleLeaveEmphasis);
}
function enterEmphasis(el, highlightDigit) {
  el.__highByOuter |= 1 << (highlightDigit || 0);
  traverseUpdateState(el, singleEnterEmphasis);
}
function leaveEmphasis(el, highlightDigit) {
  !(el.__highByOuter &= ~(1 << (highlightDigit || 0))) && traverseUpdateState(el, singleLeaveEmphasis);
}
function enterBlur(el) {
  traverseUpdateState(el, singleEnterBlur);
}
function leaveBlur(el) {
  traverseUpdateState(el, singleLeaveBlur);
}
function enterSelect(el) {
  traverseUpdateState(el, singleEnterSelect);
}
function leaveSelect(el) {
  traverseUpdateState(el, singleLeaveSelect);
}
function shouldSilent(el, e2) {
  return el.__highDownSilentOnTouch && e2.zrByTouch;
}
function allLeaveBlur(api) {
  var model = api.getModel();
  var leaveBlurredSeries = [];
  var allComponentViews = [];
  model.eachComponent(function(componentType, componentModel) {
    var componentStates = getComponentStates(componentModel);
    var isSeries2 = componentType === "series";
    var view = isSeries2 ? api.getViewOfSeriesModel(componentModel) : api.getViewOfComponentModel(componentModel);
    !isSeries2 && allComponentViews.push(view);
    if (componentStates.isBlured) {
      view.group.traverse(function(child) {
        singleLeaveBlur(child);
      });
      isSeries2 && leaveBlurredSeries.push(componentModel);
    }
    componentStates.isBlured = false;
  });
  each(allComponentViews, function(view) {
    if (view && view.toggleBlurSeries) {
      view.toggleBlurSeries(leaveBlurredSeries, false, model);
    }
  });
}
function blurSeries(targetSeriesIndex, focus, blurScope, api) {
  var ecModel = api.getModel();
  blurScope = blurScope || "coordinateSystem";
  function leaveBlurOfIndices(data, dataIndices) {
    for (var i = 0; i < dataIndices.length; i++) {
      var itemEl = data.getItemGraphicEl(dataIndices[i]);
      itemEl && leaveBlur(itemEl);
    }
  }
  if (targetSeriesIndex == null) {
    return;
  }
  if (!focus || focus === "none") {
    return;
  }
  var targetSeriesModel = ecModel.getSeriesByIndex(targetSeriesIndex);
  var targetCoordSys = targetSeriesModel.coordinateSystem;
  if (targetCoordSys && targetCoordSys.master) {
    targetCoordSys = targetCoordSys.master;
  }
  var blurredSeries = [];
  ecModel.eachSeries(function(seriesModel) {
    var sameSeries = targetSeriesModel === seriesModel;
    var coordSys = seriesModel.coordinateSystem;
    if (coordSys && coordSys.master) {
      coordSys = coordSys.master;
    }
    var sameCoordSys = coordSys && targetCoordSys ? coordSys === targetCoordSys : sameSeries;
    if (!// Not blur other series if blurScope series
    (blurScope === "series" && !sameSeries || blurScope === "coordinateSystem" && !sameCoordSys || focus === "series" && sameSeries)) {
      var view = api.getViewOfSeriesModel(seriesModel);
      view.group.traverse(function(child) {
        singleEnterBlur(child);
      });
      if (isArrayLike(focus)) {
        leaveBlurOfIndices(seriesModel.getData(), focus);
      } else if (isObject(focus)) {
        var dataTypes = keys(focus);
        for (var d = 0; d < dataTypes.length; d++) {
          leaveBlurOfIndices(seriesModel.getData(dataTypes[d]), focus[dataTypes[d]]);
        }
      }
      blurredSeries.push(seriesModel);
      getComponentStates(seriesModel).isBlured = true;
    }
  });
  ecModel.eachComponent(function(componentType, componentModel) {
    if (componentType === "series") {
      return;
    }
    var view = api.getViewOfComponentModel(componentModel);
    if (view && view.toggleBlurSeries) {
      view.toggleBlurSeries(blurredSeries, true, ecModel);
    }
  });
}
function blurComponent(componentMainType, componentIndex, api) {
  if (componentMainType == null || componentIndex == null) {
    return;
  }
  var componentModel = api.getModel().getComponent(componentMainType, componentIndex);
  if (!componentModel) {
    return;
  }
  getComponentStates(componentModel).isBlured = true;
  var view = api.getViewOfComponentModel(componentModel);
  if (!view || !view.focusBlurEnabled) {
    return;
  }
  view.group.traverse(function(child) {
    singleEnterBlur(child);
  });
}
function blurSeriesFromHighlightPayload(seriesModel, payload, api) {
  var seriesIndex = seriesModel.seriesIndex;
  var data = seriesModel.getData(payload.dataType);
  if (!data) {
    if (true) {
      error("Unknown dataType " + payload.dataType);
    }
    return;
  }
  var dataIndex = queryDataIndex(data, payload);
  dataIndex = (isArray(dataIndex) ? dataIndex[0] : dataIndex) || 0;
  var el = data.getItemGraphicEl(dataIndex);
  if (!el) {
    var count = data.count();
    var current = 0;
    while (!el && current < count) {
      el = data.getItemGraphicEl(current++);
    }
  }
  if (el) {
    var ecData = getECData(el);
    blurSeries(seriesIndex, ecData.focus, ecData.blurScope, api);
  } else {
    var focus_1 = seriesModel.get(["emphasis", "focus"]);
    var blurScope = seriesModel.get(["emphasis", "blurScope"]);
    if (focus_1 != null) {
      blurSeries(seriesIndex, focus_1, blurScope, api);
    }
  }
}
function findComponentHighDownDispatchers(componentMainType, componentIndex, name, api) {
  var ret = {
    focusSelf: false,
    dispatchers: null
  };
  if (componentMainType == null || componentMainType === "series" || componentIndex == null || name == null) {
    return ret;
  }
  var componentModel = api.getModel().getComponent(componentMainType, componentIndex);
  if (!componentModel) {
    return ret;
  }
  var view = api.getViewOfComponentModel(componentModel);
  if (!view || !view.findHighDownDispatchers) {
    return ret;
  }
  var dispatchers = view.findHighDownDispatchers(name);
  var focusSelf;
  for (var i = 0; i < dispatchers.length; i++) {
    if (!isHighDownDispatcher(dispatchers[i])) {
      error("param should be highDownDispatcher");
    }
    if (getECData(dispatchers[i]).focus === "self") {
      focusSelf = true;
      break;
    }
  }
  return {
    focusSelf,
    dispatchers
  };
}
function handleGlobalMouseOverForHighDown(dispatcher, e2, api) {
  if (!isHighDownDispatcher(dispatcher)) {
    error("param should be highDownDispatcher");
  }
  var ecData = getECData(dispatcher);
  var _a2 = findComponentHighDownDispatchers(ecData.componentMainType, ecData.componentIndex, ecData.componentHighDownName, api), dispatchers = _a2.dispatchers, focusSelf = _a2.focusSelf;
  if (dispatchers) {
    if (focusSelf) {
      blurComponent(ecData.componentMainType, ecData.componentIndex, api);
    }
    each(dispatchers, function(dispatcher2) {
      return enterEmphasisWhenMouseOver(dispatcher2, e2);
    });
  } else {
    blurSeries(ecData.seriesIndex, ecData.focus, ecData.blurScope, api);
    if (ecData.focus === "self") {
      blurComponent(ecData.componentMainType, ecData.componentIndex, api);
    }
    enterEmphasisWhenMouseOver(dispatcher, e2);
  }
}
function handleGlobalMouseOutForHighDown(dispatcher, e2, api) {
  if (!isHighDownDispatcher(dispatcher)) {
    error("param should be highDownDispatcher");
  }
  allLeaveBlur(api);
  var ecData = getECData(dispatcher);
  var dispatchers = findComponentHighDownDispatchers(ecData.componentMainType, ecData.componentIndex, ecData.componentHighDownName, api).dispatchers;
  if (dispatchers) {
    each(dispatchers, function(dispatcher2) {
      return leaveEmphasisWhenMouseOut(dispatcher2, e2);
    });
  } else {
    leaveEmphasisWhenMouseOut(dispatcher, e2);
  }
}
function toggleSelectionFromPayload(seriesModel, payload, api) {
  if (!isSelectChangePayload(payload)) {
    return;
  }
  var dataType = payload.dataType;
  var data = seriesModel.getData(dataType);
  var dataIndex = queryDataIndex(data, payload);
  if (!isArray(dataIndex)) {
    dataIndex = [dataIndex];
  }
  seriesModel[payload.type === TOGGLE_SELECT_ACTION_TYPE ? "toggleSelect" : payload.type === SELECT_ACTION_TYPE ? "select" : "unselect"](dataIndex, dataType);
}
function updateSeriesElementSelection(seriesModel) {
  var allData = seriesModel.getAllData();
  each(allData, function(_a2) {
    var data = _a2.data, type = _a2.type;
    data.eachItemGraphicEl(function(el, idx) {
      seriesModel.isSelected(idx, type) ? enterSelect(el) : leaveSelect(el);
    });
  });
}
function getAllSelectedIndices(ecModel) {
  var ret = [];
  ecModel.eachSeries(function(seriesModel) {
    var allData = seriesModel.getAllData();
    each(allData, function(_a2) {
      var data = _a2.data, type = _a2.type;
      var dataIndices = seriesModel.getSelectedDataIndices();
      if (dataIndices.length > 0) {
        var item = {
          dataIndex: dataIndices,
          seriesIndex: seriesModel.seriesIndex
        };
        if (type != null) {
          item.dataType = type;
        }
        ret.push(item);
      }
    });
  });
  return ret;
}
function enableHoverEmphasis(el, focus, blurScope) {
  setAsHighDownDispatcher(el, true);
  traverseUpdateState(el, setDefaultStateProxy);
  enableHoverFocus(el, focus, blurScope);
}
function disableHoverEmphasis(el) {
  setAsHighDownDispatcher(el, false);
}
function toggleHoverEmphasis(el, focus, blurScope, isDisabled) {
  isDisabled ? disableHoverEmphasis(el) : enableHoverEmphasis(el, focus, blurScope);
}
function enableHoverFocus(el, focus, blurScope) {
  var ecData = getECData(el);
  if (focus != null) {
    ecData.focus = focus;
    ecData.blurScope = blurScope;
  } else if (ecData.focus) {
    ecData.focus = null;
  }
}
var OTHER_STATES = ["emphasis", "blur", "select"];
var defaultStyleGetterMap = {
  itemStyle: "getItemStyle",
  lineStyle: "getLineStyle",
  areaStyle: "getAreaStyle"
};
function setStatesStylesFromModel(el, itemModel, styleType, getter) {
  styleType = styleType || "itemStyle";
  for (var i = 0; i < OTHER_STATES.length; i++) {
    var stateName = OTHER_STATES[i];
    var model = itemModel.getModel([stateName, styleType]);
    var state = el.ensureState(stateName);
    state.style = getter ? getter(model) : model[defaultStyleGetterMap[styleType]]();
  }
}
function setAsHighDownDispatcher(el, asDispatcher) {
  var disable = asDispatcher === false;
  var extendedEl = el;
  if (el.highDownSilentOnTouch) {
    extendedEl.__highDownSilentOnTouch = el.highDownSilentOnTouch;
  }
  if (!disable || extendedEl.__highDownDispatcher) {
    extendedEl.__highByOuter = extendedEl.__highByOuter || 0;
    extendedEl.__highDownDispatcher = !disable;
  }
}
function isHighDownDispatcher(el) {
  return !!(el && el.__highDownDispatcher);
}
function enableComponentHighDownFeatures(el, componentModel, componentHighDownName) {
  var ecData = getECData(el);
  ecData.componentMainType = componentModel.mainType;
  ecData.componentIndex = componentModel.componentIndex;
  ecData.componentHighDownName = componentHighDownName;
}
function getHighlightDigit(highlightKey) {
  var highlightDigit = _highlightKeyMap[highlightKey];
  if (highlightDigit == null && _highlightNextDigit <= 32) {
    highlightDigit = _highlightKeyMap[highlightKey] = _highlightNextDigit++;
  }
  return highlightDigit;
}
function isSelectChangePayload(payload) {
  var payloadType = payload.type;
  return payloadType === SELECT_ACTION_TYPE || payloadType === UNSELECT_ACTION_TYPE || payloadType === TOGGLE_SELECT_ACTION_TYPE;
}
function isHighDownPayload(payload) {
  var payloadType = payload.type;
  return payloadType === HIGHLIGHT_ACTION_TYPE || payloadType === DOWNPLAY_ACTION_TYPE;
}
function savePathStates(el) {
  var store = getSavedStates(el);
  store.normalFill = el.style.fill;
  store.normalStroke = el.style.stroke;
  var selectState = el.states.select || {};
  store.selectFill = selectState.style && selectState.style.fill || null;
  store.selectStroke = selectState.style && selectState.style.stroke || null;
}

// node_modules/echarts/lib/util/graphic.js
var graphic_exports = {};
__export(graphic_exports, {
  Arc: () => Arc_default,
  BezierCurve: () => BezierCurve_default,
  BoundingRect: () => BoundingRect_default,
  Circle: () => Circle_default,
  CompoundPath: () => CompoundPath_default,
  Ellipse: () => Ellipse_default,
  Group: () => Group_default,
  Image: () => Image_default,
  IncrementalDisplayable: () => IncrementalDisplayable_default,
  Line: () => Line_default,
  LinearGradient: () => LinearGradient_default,
  OrientedBoundingRect: () => OrientedBoundingRect_default,
  Path: () => Path_default,
  Point: () => Point_default,
  Polygon: () => Polygon_default,
  Polyline: () => Polyline_default,
  RadialGradient: () => RadialGradient_default,
  Rect: () => Rect_default,
  Ring: () => Ring_default,
  Sector: () => Sector_default,
  Text: () => Text_default,
  applyTransform: () => applyTransform2,
  clipPointsByRect: () => clipPointsByRect,
  clipRectByRect: () => clipRectByRect,
  createIcon: () => createIcon,
  extendPath: () => extendPath,
  extendShape: () => extendShape,
  getShapeClass: () => getShapeClass,
  getTransform: () => getTransform,
  groupTransition: () => groupTransition,
  initProps: () => initProps,
  isElementRemoved: () => isElementRemoved,
  lineLineIntersect: () => lineLineIntersect,
  linePolygonIntersect: () => linePolygonIntersect,
  makeImage: () => makeImage,
  makePath: () => makePath,
  mergePath: () => mergePath2,
  registerShape: () => registerShape,
  removeElement: () => removeElement,
  removeElementWithFadeOut: () => removeElementWithFadeOut,
  resizePath: () => resizePath,
  setTooltipConfig: () => setTooltipConfig,
  subPixelOptimize: () => subPixelOptimize2,
  subPixelOptimizeLine: () => subPixelOptimizeLine2,
  subPixelOptimizeRect: () => subPixelOptimizeRect2,
  transformDirection: () => transformDirection,
  traverseElements: () => traverseElements,
  updateProps: () => updateProps
});

// node_modules/zrender/lib/tool/transformPath.js
var CMD = PathProxy_default.CMD;
var points = [[], [], []];
var mathSqrt = Math.sqrt;
var mathAtan2 = Math.atan2;
function transformPath(path, m2) {
  if (!m2) {
    return;
  }
  var data = path.data;
  var len = path.len();
  var cmd;
  var nPoint;
  var i;
  var j;
  var k;
  var p;
  var M = CMD.M;
  var C = CMD.C;
  var L = CMD.L;
  var R = CMD.R;
  var A = CMD.A;
  var Q = CMD.Q;
  for (i = 0, j = 0; i < len; ) {
    cmd = data[i++];
    j = i;
    nPoint = 0;
    switch (cmd) {
      case M:
        nPoint = 1;
        break;
      case L:
        nPoint = 1;
        break;
      case C:
        nPoint = 3;
        break;
      case Q:
        nPoint = 2;
        break;
      case A:
        var x = m2[4];
        var y = m2[5];
        var sx = mathSqrt(m2[0] * m2[0] + m2[1] * m2[1]);
        var sy = mathSqrt(m2[2] * m2[2] + m2[3] * m2[3]);
        var angle = mathAtan2(-m2[1] / sy, m2[0] / sx);
        data[i] *= sx;
        data[i++] += x;
        data[i] *= sy;
        data[i++] += y;
        data[i++] *= sx;
        data[i++] *= sy;
        data[i++] += angle;
        data[i++] += angle;
        i += 2;
        j = i;
        break;
      case R:
        p[0] = data[i++];
        p[1] = data[i++];
        applyTransform(p, p, m2);
        data[j++] = p[0];
        data[j++] = p[1];
        p[0] += data[i++];
        p[1] += data[i++];
        applyTransform(p, p, m2);
        data[j++] = p[0];
        data[j++] = p[1];
    }
    for (k = 0; k < nPoint; k++) {
      var p_1 = points[k];
      p_1[0] = data[i++];
      p_1[1] = data[i++];
      applyTransform(p_1, p_1, m2);
      data[j++] = p_1[0];
      data[j++] = p_1[1];
    }
  }
  path.increaseVersion();
}

// node_modules/zrender/lib/tool/path.js
var mathSqrt2 = Math.sqrt;
var mathSin = Math.sin;
var mathCos = Math.cos;
var PI = Math.PI;
function vMag(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}
function vRatio(u, v) {
  return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
}
function vAngle(u, v) {
  return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
}
function processArc(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg, cmd, path) {
  var psi = psiDeg * (PI / 180);
  var xp = mathCos(psi) * (x1 - x2) / 2 + mathSin(psi) * (y1 - y2) / 2;
  var yp = -1 * mathSin(psi) * (x1 - x2) / 2 + mathCos(psi) * (y1 - y2) / 2;
  var lambda = xp * xp / (rx * rx) + yp * yp / (ry * ry);
  if (lambda > 1) {
    rx *= mathSqrt2(lambda);
    ry *= mathSqrt2(lambda);
  }
  var f = (fa === fs ? -1 : 1) * mathSqrt2((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) / (rx * rx * (yp * yp) + ry * ry * (xp * xp))) || 0;
  var cxp = f * rx * yp / ry;
  var cyp = f * -ry * xp / rx;
  var cx = (x1 + x2) / 2 + mathCos(psi) * cxp - mathSin(psi) * cyp;
  var cy = (y1 + y2) / 2 + mathSin(psi) * cxp + mathCos(psi) * cyp;
  var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
  var u = [(xp - cxp) / rx, (yp - cyp) / ry];
  var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
  var dTheta = vAngle(u, v);
  if (vRatio(u, v) <= -1) {
    dTheta = PI;
  }
  if (vRatio(u, v) >= 1) {
    dTheta = 0;
  }
  if (dTheta < 0) {
    var n = Math.round(dTheta / PI * 1e6) / 1e6;
    dTheta = PI * 2 + n % 2 * PI;
  }
  path.addData(cmd, cx, cy, rx, ry, theta, dTheta, psi, fs);
}
var commandReg = /([mlvhzcqtsa])([^mlvhzcqtsa]*)/ig;
var numberReg = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
function createPathProxyFromString(data) {
  var path = new PathProxy_default();
  if (!data) {
    return path;
  }
  var cpx = 0;
  var cpy = 0;
  var subpathX = cpx;
  var subpathY = cpy;
  var prevCmd;
  var CMD2 = PathProxy_default.CMD;
  var cmdList = data.match(commandReg);
  if (!cmdList) {
    return path;
  }
  for (var l = 0; l < cmdList.length; l++) {
    var cmdText = cmdList[l];
    var cmdStr = cmdText.charAt(0);
    var cmd = void 0;
    var p = cmdText.match(numberReg) || [];
    var pLen = p.length;
    for (var i = 0; i < pLen; i++) {
      p[i] = parseFloat(p[i]);
    }
    var off = 0;
    while (off < pLen) {
      var ctlPtx = void 0;
      var ctlPty = void 0;
      var rx = void 0;
      var ry = void 0;
      var psi = void 0;
      var fa = void 0;
      var fs = void 0;
      var x1 = cpx;
      var y1 = cpy;
      var len = void 0;
      var pathData = void 0;
      switch (cmdStr) {
        case "l":
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD2.L;
          path.addData(cmd, cpx, cpy);
          break;
        case "L":
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD2.L;
          path.addData(cmd, cpx, cpy);
          break;
        case "m":
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD2.M;
          path.addData(cmd, cpx, cpy);
          subpathX = cpx;
          subpathY = cpy;
          cmdStr = "l";
          break;
        case "M":
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD2.M;
          path.addData(cmd, cpx, cpy);
          subpathX = cpx;
          subpathY = cpy;
          cmdStr = "L";
          break;
        case "h":
          cpx += p[off++];
          cmd = CMD2.L;
          path.addData(cmd, cpx, cpy);
          break;
        case "H":
          cpx = p[off++];
          cmd = CMD2.L;
          path.addData(cmd, cpx, cpy);
          break;
        case "v":
          cpy += p[off++];
          cmd = CMD2.L;
          path.addData(cmd, cpx, cpy);
          break;
        case "V":
          cpy = p[off++];
          cmd = CMD2.L;
          path.addData(cmd, cpx, cpy);
          break;
        case "C":
          cmd = CMD2.C;
          path.addData(cmd, p[off++], p[off++], p[off++], p[off++], p[off++], p[off++]);
          cpx = p[off - 2];
          cpy = p[off - 1];
          break;
        case "c":
          cmd = CMD2.C;
          path.addData(cmd, p[off++] + cpx, p[off++] + cpy, p[off++] + cpx, p[off++] + cpy, p[off++] + cpx, p[off++] + cpy);
          cpx += p[off - 2];
          cpy += p[off - 1];
          break;
        case "S":
          ctlPtx = cpx;
          ctlPty = cpy;
          len = path.len();
          pathData = path.data;
          if (prevCmd === CMD2.C) {
            ctlPtx += cpx - pathData[len - 4];
            ctlPty += cpy - pathData[len - 3];
          }
          cmd = CMD2.C;
          x1 = p[off++];
          y1 = p[off++];
          cpx = p[off++];
          cpy = p[off++];
          path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
          break;
        case "s":
          ctlPtx = cpx;
          ctlPty = cpy;
          len = path.len();
          pathData = path.data;
          if (prevCmd === CMD2.C) {
            ctlPtx += cpx - pathData[len - 4];
            ctlPty += cpy - pathData[len - 3];
          }
          cmd = CMD2.C;
          x1 = cpx + p[off++];
          y1 = cpy + p[off++];
          cpx += p[off++];
          cpy += p[off++];
          path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
          break;
        case "Q":
          x1 = p[off++];
          y1 = p[off++];
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD2.Q;
          path.addData(cmd, x1, y1, cpx, cpy);
          break;
        case "q":
          x1 = p[off++] + cpx;
          y1 = p[off++] + cpy;
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD2.Q;
          path.addData(cmd, x1, y1, cpx, cpy);
          break;
        case "T":
          ctlPtx = cpx;
          ctlPty = cpy;
          len = path.len();
          pathData = path.data;
          if (prevCmd === CMD2.Q) {
            ctlPtx += cpx - pathData[len - 4];
            ctlPty += cpy - pathData[len - 3];
          }
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD2.Q;
          path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
          break;
        case "t":
          ctlPtx = cpx;
          ctlPty = cpy;
          len = path.len();
          pathData = path.data;
          if (prevCmd === CMD2.Q) {
            ctlPtx += cpx - pathData[len - 4];
            ctlPty += cpy - pathData[len - 3];
          }
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD2.Q;
          path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
          break;
        case "A":
          rx = p[off++];
          ry = p[off++];
          psi = p[off++];
          fa = p[off++];
          fs = p[off++];
          x1 = cpx, y1 = cpy;
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD2.A;
          processArc(x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path);
          break;
        case "a":
          rx = p[off++];
          ry = p[off++];
          psi = p[off++];
          fa = p[off++];
          fs = p[off++];
          x1 = cpx, y1 = cpy;
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD2.A;
          processArc(x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path);
          break;
      }
    }
    if (cmdStr === "z" || cmdStr === "Z") {
      cmd = CMD2.Z;
      path.addData(cmd);
      cpx = subpathX;
      cpy = subpathY;
    }
    prevCmd = cmd;
  }
  path.toStatic();
  return path;
}
var SVGPath = function(_super) {
  __extends(SVGPath2, _super);
  function SVGPath2() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  SVGPath2.prototype.applyTransform = function(m2) {
  };
  return SVGPath2;
}(Path_default);
function isPathProxy(path) {
  return path.setData != null;
}
function createPathOptions(str, opts) {
  var pathProxy = createPathProxyFromString(str);
  var innerOpts = extend({}, opts);
  innerOpts.buildPath = function(path) {
    if (isPathProxy(path)) {
      path.setData(pathProxy.data);
      var ctx = path.getContext();
      if (ctx) {
        path.rebuildPath(ctx, 1);
      }
    } else {
      var ctx = path;
      pathProxy.rebuildPath(ctx, 1);
    }
  };
  innerOpts.applyTransform = function(m2) {
    transformPath(pathProxy, m2);
    this.dirtyShape();
  };
  return innerOpts;
}
function createFromString(str, opts) {
  return new SVGPath(createPathOptions(str, opts));
}
function extendFromString(str, defaultOpts) {
  var innerOpts = createPathOptions(str, defaultOpts);
  var Sub = function(_super) {
    __extends(Sub2, _super);
    function Sub2(opts) {
      var _this = _super.call(this, opts) || this;
      _this.applyTransform = innerOpts.applyTransform;
      _this.buildPath = innerOpts.buildPath;
      return _this;
    }
    return Sub2;
  }(SVGPath);
  return Sub;
}
function mergePath(pathEls, opts) {
  var pathList = [];
  var len = pathEls.length;
  for (var i = 0; i < len; i++) {
    var pathEl = pathEls[i];
    pathList.push(pathEl.getUpdatedPathProxy(true));
  }
  var pathBundle = new Path_default(opts);
  pathBundle.createPathProxy();
  pathBundle.buildPath = function(path) {
    if (isPathProxy(path)) {
      path.appendPath(pathList);
      var ctx = path.getContext();
      if (ctx) {
        path.rebuildPath(ctx, 1);
      }
    }
  };
  return pathBundle;
}
function clonePath(sourcePath, opts) {
  opts = opts || {};
  var path = new Path_default();
  if (sourcePath.shape) {
    path.setShape(sourcePath.shape);
  }
  path.setStyle(sourcePath.style);
  if (opts.bakeTransform) {
    transformPath(path.path, sourcePath.getComputedTransform());
  } else {
    if (opts.toLocal) {
      path.setLocalTransform(sourcePath.getComputedTransform());
    } else {
      path.copyTransform(sourcePath);
    }
  }
  path.buildPath = sourcePath.buildPath;
  path.applyTransform = path.applyTransform;
  path.z = sourcePath.z;
  path.z2 = sourcePath.z2;
  path.zlevel = sourcePath.zlevel;
  return path;
}

// node_modules/zrender/lib/graphic/shape/Circle.js
var CircleShape = function() {
  function CircleShape2() {
    this.cx = 0;
    this.cy = 0;
    this.r = 0;
  }
  return CircleShape2;
}();
var Circle = function(_super) {
  __extends(Circle2, _super);
  function Circle2(opts) {
    return _super.call(this, opts) || this;
  }
  Circle2.prototype.getDefaultShape = function() {
    return new CircleShape();
  };
  Circle2.prototype.buildPath = function(ctx, shape) {
    ctx.moveTo(shape.cx + shape.r, shape.cy);
    ctx.arc(shape.cx, shape.cy, shape.r, 0, Math.PI * 2);
  };
  return Circle2;
}(Path_default);
Circle.prototype.type = "circle";
var Circle_default = Circle;

// node_modules/zrender/lib/graphic/shape/Ellipse.js
var EllipseShape = function() {
  function EllipseShape2() {
    this.cx = 0;
    this.cy = 0;
    this.rx = 0;
    this.ry = 0;
  }
  return EllipseShape2;
}();
var Ellipse = function(_super) {
  __extends(Ellipse2, _super);
  function Ellipse2(opts) {
    return _super.call(this, opts) || this;
  }
  Ellipse2.prototype.getDefaultShape = function() {
    return new EllipseShape();
  };
  Ellipse2.prototype.buildPath = function(ctx, shape) {
    var k = 0.5522848;
    var x = shape.cx;
    var y = shape.cy;
    var a = shape.rx;
    var b = shape.ry;
    var ox = a * k;
    var oy = b * k;
    ctx.moveTo(x - a, y);
    ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
    ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
    ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
    ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
    ctx.closePath();
  };
  return Ellipse2;
}(Path_default);
Ellipse.prototype.type = "ellipse";
var Ellipse_default = Ellipse;

// node_modules/zrender/lib/graphic/helper/roundSector.js
var PI2 = Math.PI;
var PI22 = PI2 * 2;
var mathSin2 = Math.sin;
var mathCos2 = Math.cos;
var mathACos = Math.acos;
var mathATan2 = Math.atan2;
var mathAbs = Math.abs;
var mathSqrt3 = Math.sqrt;
var mathMax = Math.max;
var mathMin = Math.min;
var e = 1e-4;
function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var dx10 = x1 - x0;
  var dy10 = y1 - y0;
  var dx32 = x3 - x2;
  var dy32 = y3 - y2;
  var t = dy32 * dx10 - dx32 * dy10;
  if (t * t < e) {
    return;
  }
  t = (dx32 * (y0 - y2) - dy32 * (x0 - x2)) / t;
  return [x0 + t * dx10, y0 + t * dy10];
}
function computeCornerTangents(x0, y0, x1, y1, radius, cr, clockwise) {
  var x01 = x0 - x1;
  var y01 = y0 - y1;
  var lo = (clockwise ? cr : -cr) / mathSqrt3(x01 * x01 + y01 * y01);
  var ox = lo * y01;
  var oy = -lo * x01;
  var x11 = x0 + ox;
  var y11 = y0 + oy;
  var x10 = x1 + ox;
  var y10 = y1 + oy;
  var x00 = (x11 + x10) / 2;
  var y00 = (y11 + y10) / 2;
  var dx = x10 - x11;
  var dy = y10 - y11;
  var d2 = dx * dx + dy * dy;
  var r = radius - cr;
  var s = x11 * y10 - x10 * y11;
  var d = (dy < 0 ? -1 : 1) * mathSqrt3(mathMax(0, r * r * d2 - s * s));
  var cx0 = (s * dy - dx * d) / d2;
  var cy0 = (-s * dx - dy * d) / d2;
  var cx1 = (s * dy + dx * d) / d2;
  var cy1 = (-s * dx + dy * d) / d2;
  var dx0 = cx0 - x00;
  var dy0 = cy0 - y00;
  var dx1 = cx1 - x00;
  var dy1 = cy1 - y00;
  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) {
    cx0 = cx1;
    cy0 = cy1;
  }
  return {
    cx: cx0,
    cy: cy0,
    x0: -ox,
    y0: -oy,
    x1: cx0 * (radius / r - 1),
    y1: cy0 * (radius / r - 1)
  };
}
function normalizeCornerRadius(cr) {
  var arr;
  if (isArray(cr)) {
    var len = cr.length;
    if (!len) {
      return cr;
    }
    if (len === 1) {
      arr = [cr[0], cr[0], 0, 0];
    } else if (len === 2) {
      arr = [cr[0], cr[0], cr[1], cr[1]];
    } else if (len === 3) {
      arr = cr.concat(cr[2]);
    } else {
      arr = cr;
    }
  } else {
    arr = [cr, cr, cr, cr];
  }
  return arr;
}
function buildPath(ctx, shape) {
  var _a2;
  var radius = mathMax(shape.r, 0);
  var innerRadius = mathMax(shape.r0 || 0, 0);
  var hasRadius = radius > 0;
  var hasInnerRadius = innerRadius > 0;
  if (!hasRadius && !hasInnerRadius) {
    return;
  }
  if (!hasRadius) {
    radius = innerRadius;
    innerRadius = 0;
  }
  if (innerRadius > radius) {
    var tmp = radius;
    radius = innerRadius;
    innerRadius = tmp;
  }
  var startAngle = shape.startAngle, endAngle = shape.endAngle;
  if (isNaN(startAngle) || isNaN(endAngle)) {
    return;
  }
  var cx = shape.cx, cy = shape.cy;
  var clockwise = !!shape.clockwise;
  var arc = mathAbs(endAngle - startAngle);
  var mod = arc > PI22 && arc % PI22;
  mod > e && (arc = mod);
  if (!(radius > e)) {
    ctx.moveTo(cx, cy);
  } else if (arc > PI22 - e) {
    ctx.moveTo(cx + radius * mathCos2(startAngle), cy + radius * mathSin2(startAngle));
    ctx.arc(cx, cy, radius, startAngle, endAngle, !clockwise);
    if (innerRadius > e) {
      ctx.moveTo(cx + innerRadius * mathCos2(endAngle), cy + innerRadius * mathSin2(endAngle));
      ctx.arc(cx, cy, innerRadius, endAngle, startAngle, clockwise);
    }
  } else {
    var icrStart = void 0;
    var icrEnd = void 0;
    var ocrStart = void 0;
    var ocrEnd = void 0;
    var ocrs = void 0;
    var ocre = void 0;
    var icrs = void 0;
    var icre = void 0;
    var ocrMax = void 0;
    var icrMax = void 0;
    var limitedOcrMax = void 0;
    var limitedIcrMax = void 0;
    var xre = void 0;
    var yre = void 0;
    var xirs = void 0;
    var yirs = void 0;
    var xrs = radius * mathCos2(startAngle);
    var yrs = radius * mathSin2(startAngle);
    var xire = innerRadius * mathCos2(endAngle);
    var yire = innerRadius * mathSin2(endAngle);
    var hasArc = arc > e;
    if (hasArc) {
      var cornerRadius = shape.cornerRadius;
      if (cornerRadius) {
        _a2 = normalizeCornerRadius(cornerRadius), icrStart = _a2[0], icrEnd = _a2[1], ocrStart = _a2[2], ocrEnd = _a2[3];
      }
      var halfRd = mathAbs(radius - innerRadius) / 2;
      ocrs = mathMin(halfRd, ocrStart);
      ocre = mathMin(halfRd, ocrEnd);
      icrs = mathMin(halfRd, icrStart);
      icre = mathMin(halfRd, icrEnd);
      limitedOcrMax = ocrMax = mathMax(ocrs, ocre);
      limitedIcrMax = icrMax = mathMax(icrs, icre);
      if (ocrMax > e || icrMax > e) {
        xre = radius * mathCos2(endAngle);
        yre = radius * mathSin2(endAngle);
        xirs = innerRadius * mathCos2(startAngle);
        yirs = innerRadius * mathSin2(startAngle);
        if (arc < PI2) {
          var it_1 = intersect(xrs, yrs, xirs, yirs, xre, yre, xire, yire);
          if (it_1) {
            var x0 = xrs - it_1[0];
            var y0 = yrs - it_1[1];
            var x1 = xre - it_1[0];
            var y1 = yre - it_1[1];
            var a = 1 / mathSin2(mathACos((x0 * x1 + y0 * y1) / (mathSqrt3(x0 * x0 + y0 * y0) * mathSqrt3(x1 * x1 + y1 * y1))) / 2);
            var b = mathSqrt3(it_1[0] * it_1[0] + it_1[1] * it_1[1]);
            limitedOcrMax = mathMin(ocrMax, (radius - b) / (a + 1));
            limitedIcrMax = mathMin(icrMax, (innerRadius - b) / (a - 1));
          }
        }
      }
    }
    if (!hasArc) {
      ctx.moveTo(cx + xrs, cy + yrs);
    } else if (limitedOcrMax > e) {
      var crStart = mathMin(ocrStart, limitedOcrMax);
      var crEnd = mathMin(ocrEnd, limitedOcrMax);
      var ct0 = computeCornerTangents(xirs, yirs, xrs, yrs, radius, crStart, clockwise);
      var ct1 = computeCornerTangents(xre, yre, xire, yire, radius, crEnd, clockwise);
      ctx.moveTo(cx + ct0.cx + ct0.x0, cy + ct0.cy + ct0.y0);
      if (limitedOcrMax < ocrMax && crStart === crEnd) {
        ctx.arc(cx + ct0.cx, cy + ct0.cy, limitedOcrMax, mathATan2(ct0.y0, ct0.x0), mathATan2(ct1.y0, ct1.x0), !clockwise);
      } else {
        crStart > 0 && ctx.arc(cx + ct0.cx, cy + ct0.cy, crStart, mathATan2(ct0.y0, ct0.x0), mathATan2(ct0.y1, ct0.x1), !clockwise);
        ctx.arc(cx, cy, radius, mathATan2(ct0.cy + ct0.y1, ct0.cx + ct0.x1), mathATan2(ct1.cy + ct1.y1, ct1.cx + ct1.x1), !clockwise);
        crEnd > 0 && ctx.arc(cx + ct1.cx, cy + ct1.cy, crEnd, mathATan2(ct1.y1, ct1.x1), mathATan2(ct1.y0, ct1.x0), !clockwise);
      }
    } else {
      ctx.moveTo(cx + xrs, cy + yrs);
      ctx.arc(cx, cy, radius, startAngle, endAngle, !clockwise);
    }
    if (!(innerRadius > e) || !hasArc) {
      ctx.lineTo(cx + xire, cy + yire);
    } else if (limitedIcrMax > e) {
      var crStart = mathMin(icrStart, limitedIcrMax);
      var crEnd = mathMin(icrEnd, limitedIcrMax);
      var ct0 = computeCornerTangents(xire, yire, xre, yre, innerRadius, -crEnd, clockwise);
      var ct1 = computeCornerTangents(xrs, yrs, xirs, yirs, innerRadius, -crStart, clockwise);
      ctx.lineTo(cx + ct0.cx + ct0.x0, cy + ct0.cy + ct0.y0);
      if (limitedIcrMax < icrMax && crStart === crEnd) {
        ctx.arc(cx + ct0.cx, cy + ct0.cy, limitedIcrMax, mathATan2(ct0.y0, ct0.x0), mathATan2(ct1.y0, ct1.x0), !clockwise);
      } else {
        crEnd > 0 && ctx.arc(cx + ct0.cx, cy + ct0.cy, crEnd, mathATan2(ct0.y0, ct0.x0), mathATan2(ct0.y1, ct0.x1), !clockwise);
        ctx.arc(cx, cy, innerRadius, mathATan2(ct0.cy + ct0.y1, ct0.cx + ct0.x1), mathATan2(ct1.cy + ct1.y1, ct1.cx + ct1.x1), clockwise);
        crStart > 0 && ctx.arc(cx + ct1.cx, cy + ct1.cy, crStart, mathATan2(ct1.y1, ct1.x1), mathATan2(ct1.y0, ct1.x0), !clockwise);
      }
    } else {
      ctx.lineTo(cx + xire, cy + yire);
      ctx.arc(cx, cy, innerRadius, endAngle, startAngle, clockwise);
    }
  }
  ctx.closePath();
}

// node_modules/zrender/lib/graphic/shape/Sector.js
var SectorShape = function() {
  function SectorShape2() {
    this.cx = 0;
    this.cy = 0;
    this.r0 = 0;
    this.r = 0;
    this.startAngle = 0;
    this.endAngle = Math.PI * 2;
    this.clockwise = true;
    this.cornerRadius = 0;
  }
  return SectorShape2;
}();
var Sector = function(_super) {
  __extends(Sector2, _super);
  function Sector2(opts) {
    return _super.call(this, opts) || this;
  }
  Sector2.prototype.getDefaultShape = function() {
    return new SectorShape();
  };
  Sector2.prototype.buildPath = function(ctx, shape) {
    buildPath(ctx, shape);
  };
  Sector2.prototype.isZeroArea = function() {
    return this.shape.startAngle === this.shape.endAngle || this.shape.r === this.shape.r0;
  };
  return Sector2;
}(Path_default);
Sector.prototype.type = "sector";
var Sector_default = Sector;

// node_modules/zrender/lib/graphic/shape/Ring.js
var RingShape = function() {
  function RingShape2() {
    this.cx = 0;
    this.cy = 0;
    this.r = 0;
    this.r0 = 0;
  }
  return RingShape2;
}();
var Ring = function(_super) {
  __extends(Ring2, _super);
  function Ring2(opts) {
    return _super.call(this, opts) || this;
  }
  Ring2.prototype.getDefaultShape = function() {
    return new RingShape();
  };
  Ring2.prototype.buildPath = function(ctx, shape) {
    var x = shape.cx;
    var y = shape.cy;
    var PI23 = Math.PI * 2;
    ctx.moveTo(x + shape.r, y);
    ctx.arc(x, y, shape.r, 0, PI23, false);
    ctx.moveTo(x + shape.r0, y);
    ctx.arc(x, y, shape.r0, 0, PI23, true);
  };
  return Ring2;
}(Path_default);
Ring.prototype.type = "ring";
var Ring_default = Ring;

// node_modules/zrender/lib/graphic/helper/smoothBezier.js
function smoothBezier(points4, smooth, isLoop, constraint) {
  var cps = [];
  var v = [];
  var v1 = [];
  var v2 = [];
  var prevPoint;
  var nextPoint;
  var min2;
  var max2;
  if (constraint) {
    min2 = [Infinity, Infinity];
    max2 = [-Infinity, -Infinity];
    for (var i = 0, len = points4.length; i < len; i++) {
      min(min2, min2, points4[i]);
      max(max2, max2, points4[i]);
    }
    min(min2, min2, constraint[0]);
    max(max2, max2, constraint[1]);
  }
  for (var i = 0, len = points4.length; i < len; i++) {
    var point = points4[i];
    if (isLoop) {
      prevPoint = points4[i ? i - 1 : len - 1];
      nextPoint = points4[(i + 1) % len];
    } else {
      if (i === 0 || i === len - 1) {
        cps.push(clone2(points4[i]));
        continue;
      } else {
        prevPoint = points4[i - 1];
        nextPoint = points4[i + 1];
      }
    }
    sub(v, nextPoint, prevPoint);
    scale(v, v, smooth);
    var d0 = distance(point, prevPoint);
    var d1 = distance(point, nextPoint);
    var sum = d0 + d1;
    if (sum !== 0) {
      d0 /= sum;
      d1 /= sum;
    }
    scale(v1, v, -d0);
    scale(v2, v, d1);
    var cp0 = add([], point, v1);
    var cp1 = add([], point, v2);
    if (constraint) {
      max(cp0, cp0, min2);
      min(cp0, cp0, max2);
      max(cp1, cp1, min2);
      min(cp1, cp1, max2);
    }
    cps.push(cp0);
    cps.push(cp1);
  }
  if (isLoop) {
    cps.push(cps.shift());
  }
  return cps;
}

// node_modules/zrender/lib/graphic/helper/poly.js
function buildPath2(ctx, shape, closePath) {
  var smooth = shape.smooth;
  var points4 = shape.points;
  if (points4 && points4.length >= 2) {
    if (smooth) {
      var controlPoints = smoothBezier(points4, smooth, closePath, shape.smoothConstraint);
      ctx.moveTo(points4[0][0], points4[0][1]);
      var len = points4.length;
      for (var i = 0; i < (closePath ? len : len - 1); i++) {
        var cp1 = controlPoints[i * 2];
        var cp2 = controlPoints[i * 2 + 1];
        var p = points4[(i + 1) % len];
        ctx.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]);
      }
    } else {
      ctx.moveTo(points4[0][0], points4[0][1]);
      for (var i = 1, l = points4.length; i < l; i++) {
        ctx.lineTo(points4[i][0], points4[i][1]);
      }
    }
    closePath && ctx.closePath();
  }
}

// node_modules/zrender/lib/graphic/shape/Polygon.js
var PolygonShape = function() {
  function PolygonShape2() {
    this.points = null;
    this.smooth = 0;
    this.smoothConstraint = null;
  }
  return PolygonShape2;
}();
var Polygon = function(_super) {
  __extends(Polygon2, _super);
  function Polygon2(opts) {
    return _super.call(this, opts) || this;
  }
  Polygon2.prototype.getDefaultShape = function() {
    return new PolygonShape();
  };
  Polygon2.prototype.buildPath = function(ctx, shape) {
    buildPath2(ctx, shape, true);
  };
  return Polygon2;
}(Path_default);
Polygon.prototype.type = "polygon";
var Polygon_default = Polygon;

// node_modules/zrender/lib/graphic/shape/Polyline.js
var PolylineShape = function() {
  function PolylineShape2() {
    this.points = null;
    this.percent = 1;
    this.smooth = 0;
    this.smoothConstraint = null;
  }
  return PolylineShape2;
}();
var Polyline = function(_super) {
  __extends(Polyline2, _super);
  function Polyline2(opts) {
    return _super.call(this, opts) || this;
  }
  Polyline2.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  };
  Polyline2.prototype.getDefaultShape = function() {
    return new PolylineShape();
  };
  Polyline2.prototype.buildPath = function(ctx, shape) {
    buildPath2(ctx, shape, false);
  };
  return Polyline2;
}(Path_default);
Polyline.prototype.type = "polyline";
var Polyline_default = Polyline;

// node_modules/zrender/lib/graphic/shape/Line.js
var subPixelOptimizeOutputShape = {};
var LineShape = function() {
  function LineShape2() {
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.percent = 1;
  }
  return LineShape2;
}();
var Line = function(_super) {
  __extends(Line3, _super);
  function Line3(opts) {
    return _super.call(this, opts) || this;
  }
  Line3.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  };
  Line3.prototype.getDefaultShape = function() {
    return new LineShape();
  };
  Line3.prototype.buildPath = function(ctx, shape) {
    var x1;
    var y1;
    var x2;
    var y2;
    if (this.subPixelOptimize) {
      var optimizedShape = subPixelOptimizeLine(subPixelOptimizeOutputShape, shape, this.style);
      x1 = optimizedShape.x1;
      y1 = optimizedShape.y1;
      x2 = optimizedShape.x2;
      y2 = optimizedShape.y2;
    } else {
      x1 = shape.x1;
      y1 = shape.y1;
      x2 = shape.x2;
      y2 = shape.y2;
    }
    var percent = shape.percent;
    if (percent === 0) {
      return;
    }
    ctx.moveTo(x1, y1);
    if (percent < 1) {
      x2 = x1 * (1 - percent) + x2 * percent;
      y2 = y1 * (1 - percent) + y2 * percent;
    }
    ctx.lineTo(x2, y2);
  };
  Line3.prototype.pointAt = function(p) {
    var shape = this.shape;
    return [
      shape.x1 * (1 - p) + shape.x2 * p,
      shape.y1 * (1 - p) + shape.y2 * p
    ];
  };
  return Line3;
}(Path_default);
Line.prototype.type = "line";
var Line_default = Line;

// node_modules/zrender/lib/graphic/shape/BezierCurve.js
var out = [];
var BezierCurveShape = function() {
  function BezierCurveShape2() {
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.cpx1 = 0;
    this.cpy1 = 0;
    this.percent = 1;
  }
  return BezierCurveShape2;
}();
function someVectorAt(shape, t, isTangent) {
  var cpx2 = shape.cpx2;
  var cpy2 = shape.cpy2;
  if (cpx2 != null || cpy2 != null) {
    return [
      (isTangent ? cubicDerivativeAt : cubicAt)(shape.x1, shape.cpx1, shape.cpx2, shape.x2, t),
      (isTangent ? cubicDerivativeAt : cubicAt)(shape.y1, shape.cpy1, shape.cpy2, shape.y2, t)
    ];
  } else {
    return [
      (isTangent ? quadraticDerivativeAt : quadraticAt)(shape.x1, shape.cpx1, shape.x2, t),
      (isTangent ? quadraticDerivativeAt : quadraticAt)(shape.y1, shape.cpy1, shape.y2, t)
    ];
  }
}
var BezierCurve = function(_super) {
  __extends(BezierCurve2, _super);
  function BezierCurve2(opts) {
    return _super.call(this, opts) || this;
  }
  BezierCurve2.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  };
  BezierCurve2.prototype.getDefaultShape = function() {
    return new BezierCurveShape();
  };
  BezierCurve2.prototype.buildPath = function(ctx, shape) {
    var x1 = shape.x1;
    var y1 = shape.y1;
    var x2 = shape.x2;
    var y2 = shape.y2;
    var cpx1 = shape.cpx1;
    var cpy1 = shape.cpy1;
    var cpx2 = shape.cpx2;
    var cpy2 = shape.cpy2;
    var percent = shape.percent;
    if (percent === 0) {
      return;
    }
    ctx.moveTo(x1, y1);
    if (cpx2 == null || cpy2 == null) {
      if (percent < 1) {
        quadraticSubdivide(x1, cpx1, x2, percent, out);
        cpx1 = out[1];
        x2 = out[2];
        quadraticSubdivide(y1, cpy1, y2, percent, out);
        cpy1 = out[1];
        y2 = out[2];
      }
      ctx.quadraticCurveTo(cpx1, cpy1, x2, y2);
    } else {
      if (percent < 1) {
        cubicSubdivide(x1, cpx1, cpx2, x2, percent, out);
        cpx1 = out[1];
        cpx2 = out[2];
        x2 = out[3];
        cubicSubdivide(y1, cpy1, cpy2, y2, percent, out);
        cpy1 = out[1];
        cpy2 = out[2];
        y2 = out[3];
      }
      ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
    }
  };
  BezierCurve2.prototype.pointAt = function(t) {
    return someVectorAt(this.shape, t, false);
  };
  BezierCurve2.prototype.tangentAt = function(t) {
    var p = someVectorAt(this.shape, t, true);
    return normalize(p, p);
  };
  return BezierCurve2;
}(Path_default);
BezierCurve.prototype.type = "bezier-curve";
var BezierCurve_default = BezierCurve;

// node_modules/zrender/lib/graphic/shape/Arc.js
var ArcShape = function() {
  function ArcShape2() {
    this.cx = 0;
    this.cy = 0;
    this.r = 0;
    this.startAngle = 0;
    this.endAngle = Math.PI * 2;
    this.clockwise = true;
  }
  return ArcShape2;
}();
var Arc = function(_super) {
  __extends(Arc2, _super);
  function Arc2(opts) {
    return _super.call(this, opts) || this;
  }
  Arc2.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  };
  Arc2.prototype.getDefaultShape = function() {
    return new ArcShape();
  };
  Arc2.prototype.buildPath = function(ctx, shape) {
    var x = shape.cx;
    var y = shape.cy;
    var r = Math.max(shape.r, 0);
    var startAngle = shape.startAngle;
    var endAngle = shape.endAngle;
    var clockwise = shape.clockwise;
    var unitX = Math.cos(startAngle);
    var unitY = Math.sin(startAngle);
    ctx.moveTo(unitX * r + x, unitY * r + y);
    ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
  };
  return Arc2;
}(Path_default);
Arc.prototype.type = "arc";
var Arc_default = Arc;

// node_modules/zrender/lib/graphic/Gradient.js
var Gradient = function() {
  function Gradient2(colorStops) {
    this.colorStops = colorStops || [];
  }
  Gradient2.prototype.addColorStop = function(offset, color) {
    this.colorStops.push({
      offset,
      color
    });
  };
  return Gradient2;
}();
var Gradient_default = Gradient;

// node_modules/zrender/lib/graphic/LinearGradient.js
var LinearGradient = function(_super) {
  __extends(LinearGradient2, _super);
  function LinearGradient2(x, y, x2, y2, colorStops, globalCoord) {
    var _this = _super.call(this, colorStops) || this;
    _this.x = x == null ? 0 : x;
    _this.y = y == null ? 0 : y;
    _this.x2 = x2 == null ? 1 : x2;
    _this.y2 = y2 == null ? 0 : y2;
    _this.type = "linear";
    _this.global = globalCoord || false;
    return _this;
  }
  return LinearGradient2;
}(Gradient_default);
var LinearGradient_default = LinearGradient;

// node_modules/zrender/lib/graphic/RadialGradient.js
var RadialGradient = function(_super) {
  __extends(RadialGradient2, _super);
  function RadialGradient2(x, y, r, colorStops, globalCoord) {
    var _this = _super.call(this, colorStops) || this;
    _this.x = x == null ? 0.5 : x;
    _this.y = y == null ? 0.5 : y;
    _this.r = r == null ? 0.5 : r;
    _this.type = "radial";
    _this.global = globalCoord || false;
    return _this;
  }
  return RadialGradient2;
}(Gradient_default);
var RadialGradient_default = RadialGradient;

// node_modules/zrender/lib/core/OrientedBoundingRect.js
var extent = [0, 0];
var extent2 = [0, 0];
var minTv = new Point_default();
var maxTv = new Point_default();
var OrientedBoundingRect = function() {
  function OrientedBoundingRect2(rect, transform) {
    this._corners = [];
    this._axes = [];
    this._origin = [0, 0];
    for (var i = 0; i < 4; i++) {
      this._corners[i] = new Point_default();
    }
    for (var i = 0; i < 2; i++) {
      this._axes[i] = new Point_default();
    }
    if (rect) {
      this.fromBoundingRect(rect, transform);
    }
  }
  OrientedBoundingRect2.prototype.fromBoundingRect = function(rect, transform) {
    var corners = this._corners;
    var axes = this._axes;
    var x = rect.x;
    var y = rect.y;
    var x2 = x + rect.width;
    var y2 = y + rect.height;
    corners[0].set(x, y);
    corners[1].set(x2, y);
    corners[2].set(x2, y2);
    corners[3].set(x, y2);
    if (transform) {
      for (var i = 0; i < 4; i++) {
        corners[i].transform(transform);
      }
    }
    Point_default.sub(axes[0], corners[1], corners[0]);
    Point_default.sub(axes[1], corners[3], corners[0]);
    axes[0].normalize();
    axes[1].normalize();
    for (var i = 0; i < 2; i++) {
      this._origin[i] = axes[i].dot(corners[0]);
    }
  };
  OrientedBoundingRect2.prototype.intersect = function(other, mtv) {
    var overlapped = true;
    var noMtv = !mtv;
    minTv.set(Infinity, Infinity);
    maxTv.set(0, 0);
    if (!this._intersectCheckOneSide(this, other, minTv, maxTv, noMtv, 1)) {
      overlapped = false;
      if (noMtv) {
        return overlapped;
      }
    }
    if (!this._intersectCheckOneSide(other, this, minTv, maxTv, noMtv, -1)) {
      overlapped = false;
      if (noMtv) {
        return overlapped;
      }
    }
    if (!noMtv) {
      Point_default.copy(mtv, overlapped ? minTv : maxTv);
    }
    return overlapped;
  };
  OrientedBoundingRect2.prototype._intersectCheckOneSide = function(self, other, minTv2, maxTv2, noMtv, inverse) {
    var overlapped = true;
    for (var i = 0; i < 2; i++) {
      var axis = this._axes[i];
      this._getProjMinMaxOnAxis(i, self._corners, extent);
      this._getProjMinMaxOnAxis(i, other._corners, extent2);
      if (extent[1] < extent2[0] || extent[0] > extent2[1]) {
        overlapped = false;
        if (noMtv) {
          return overlapped;
        }
        var dist0 = Math.abs(extent2[0] - extent[1]);
        var dist1 = Math.abs(extent[0] - extent2[1]);
        if (Math.min(dist0, dist1) > maxTv2.len()) {
          if (dist0 < dist1) {
            Point_default.scale(maxTv2, axis, -dist0 * inverse);
          } else {
            Point_default.scale(maxTv2, axis, dist1 * inverse);
          }
        }
      } else if (minTv2) {
        var dist0 = Math.abs(extent2[0] - extent[1]);
        var dist1 = Math.abs(extent[0] - extent2[1]);
        if (Math.min(dist0, dist1) < minTv2.len()) {
          if (dist0 < dist1) {
            Point_default.scale(minTv2, axis, dist0 * inverse);
          } else {
            Point_default.scale(minTv2, axis, -dist1 * inverse);
          }
        }
      }
    }
    return overlapped;
  };
  OrientedBoundingRect2.prototype._getProjMinMaxOnAxis = function(dim, corners, out2) {
    var axis = this._axes[dim];
    var origin = this._origin;
    var proj = corners[0].dot(axis) + origin[dim];
    var min2 = proj;
    var max2 = proj;
    for (var i = 1; i < corners.length; i++) {
      var proj_1 = corners[i].dot(axis) + origin[dim];
      min2 = Math.min(proj_1, min2);
      max2 = Math.max(proj_1, max2);
    }
    out2[0] = min2;
    out2[1] = max2;
  };
  return OrientedBoundingRect2;
}();
var OrientedBoundingRect_default = OrientedBoundingRect;

// node_modules/zrender/lib/graphic/IncrementalDisplayable.js
var m = [];
var IncrementalDisplayable = function(_super) {
  __extends(IncrementalDisplayable2, _super);
  function IncrementalDisplayable2() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.notClear = true;
    _this.incremental = true;
    _this._displayables = [];
    _this._temporaryDisplayables = [];
    _this._cursor = 0;
    return _this;
  }
  IncrementalDisplayable2.prototype.traverse = function(cb, context) {
    cb.call(context, this);
  };
  IncrementalDisplayable2.prototype.useStyle = function() {
    this.style = {};
  };
  IncrementalDisplayable2.prototype.getCursor = function() {
    return this._cursor;
  };
  IncrementalDisplayable2.prototype.innerAfterBrush = function() {
    this._cursor = this._displayables.length;
  };
  IncrementalDisplayable2.prototype.clearDisplaybles = function() {
    this._displayables = [];
    this._temporaryDisplayables = [];
    this._cursor = 0;
    this.markRedraw();
    this.notClear = false;
  };
  IncrementalDisplayable2.prototype.clearTemporalDisplayables = function() {
    this._temporaryDisplayables = [];
  };
  IncrementalDisplayable2.prototype.addDisplayable = function(displayable, notPersistent) {
    if (notPersistent) {
      this._temporaryDisplayables.push(displayable);
    } else {
      this._displayables.push(displayable);
    }
    this.markRedraw();
  };
  IncrementalDisplayable2.prototype.addDisplayables = function(displayables, notPersistent) {
    notPersistent = notPersistent || false;
    for (var i = 0; i < displayables.length; i++) {
      this.addDisplayable(displayables[i], notPersistent);
    }
  };
  IncrementalDisplayable2.prototype.getDisplayables = function() {
    return this._displayables;
  };
  IncrementalDisplayable2.prototype.getTemporalDisplayables = function() {
    return this._temporaryDisplayables;
  };
  IncrementalDisplayable2.prototype.eachPendingDisplayable = function(cb) {
    for (var i = this._cursor; i < this._displayables.length; i++) {
      cb && cb(this._displayables[i]);
    }
    for (var i = 0; i < this._temporaryDisplayables.length; i++) {
      cb && cb(this._temporaryDisplayables[i]);
    }
  };
  IncrementalDisplayable2.prototype.update = function() {
    this.updateTransform();
    for (var i = this._cursor; i < this._displayables.length; i++) {
      var displayable = this._displayables[i];
      displayable.parent = this;
      displayable.update();
      displayable.parent = null;
    }
    for (var i = 0; i < this._temporaryDisplayables.length; i++) {
      var displayable = this._temporaryDisplayables[i];
      displayable.parent = this;
      displayable.update();
      displayable.parent = null;
    }
  };
  IncrementalDisplayable2.prototype.getBoundingRect = function() {
    if (!this._rect) {
      var rect = new BoundingRect_default(Infinity, Infinity, -Infinity, -Infinity);
      for (var i = 0; i < this._displayables.length; i++) {
        var displayable = this._displayables[i];
        var childRect = displayable.getBoundingRect().clone();
        if (displayable.needLocalTransform()) {
          childRect.applyTransform(displayable.getLocalTransform(m));
        }
        rect.union(childRect);
      }
      this._rect = rect;
    }
    return this._rect;
  };
  IncrementalDisplayable2.prototype.contain = function(x, y) {
    var localPos = this.transformCoordToLocal(x, y);
    var rect = this.getBoundingRect();
    if (rect.contain(localPos[0], localPos[1])) {
      for (var i = 0; i < this._displayables.length; i++) {
        var displayable = this._displayables[i];
        if (displayable.contain(x, y)) {
          return true;
        }
      }
    }
    return false;
  };
  return IncrementalDisplayable2;
}(Displayable_default);
var IncrementalDisplayable_default = IncrementalDisplayable;

// node_modules/echarts/lib/animation/basicTransition.js
var transitionStore = makeInner();
function getAnimationConfig(animationType, animatableModel, dataIndex, extraOpts, extraDelayParams) {
  var animationPayload;
  if (animatableModel && animatableModel.ecModel) {
    var updatePayload = animatableModel.ecModel.getUpdatePayload();
    animationPayload = updatePayload && updatePayload.animation;
  }
  var animationEnabled = animatableModel && animatableModel.isAnimationEnabled();
  var isUpdate = animationType === "update";
  if (animationEnabled) {
    var duration = void 0;
    var easing = void 0;
    var delay = void 0;
    if (extraOpts) {
      duration = retrieve2(extraOpts.duration, 200);
      easing = retrieve2(extraOpts.easing, "cubicOut");
      delay = 0;
    } else {
      duration = animatableModel.getShallow(isUpdate ? "animationDurationUpdate" : "animationDuration");
      easing = animatableModel.getShallow(isUpdate ? "animationEasingUpdate" : "animationEasing");
      delay = animatableModel.getShallow(isUpdate ? "animationDelayUpdate" : "animationDelay");
    }
    if (animationPayload) {
      animationPayload.duration != null && (duration = animationPayload.duration);
      animationPayload.easing != null && (easing = animationPayload.easing);
      animationPayload.delay != null && (delay = animationPayload.delay);
    }
    if (isFunction(delay)) {
      delay = delay(dataIndex, extraDelayParams);
    }
    if (isFunction(duration)) {
      duration = duration(dataIndex);
    }
    var config = {
      duration: duration || 0,
      delay,
      easing
    };
    return config;
  } else {
    return null;
  }
}
function animateOrSetProps(animationType, el, props, animatableModel, dataIndex, cb, during) {
  var isFrom = false;
  var removeOpt;
  if (isFunction(dataIndex)) {
    during = cb;
    cb = dataIndex;
    dataIndex = null;
  } else if (isObject(dataIndex)) {
    cb = dataIndex.cb;
    during = dataIndex.during;
    isFrom = dataIndex.isFrom;
    removeOpt = dataIndex.removeOpt;
    dataIndex = dataIndex.dataIndex;
  }
  var isRemove = animationType === "leave";
  if (!isRemove) {
    el.stopAnimation("leave");
  }
  var animationConfig = getAnimationConfig(animationType, animatableModel, dataIndex, isRemove ? removeOpt || {} : null, animatableModel && animatableModel.getAnimationDelayParams ? animatableModel.getAnimationDelayParams(el, dataIndex) : null);
  if (animationConfig && animationConfig.duration > 0) {
    var duration = animationConfig.duration;
    var animationDelay = animationConfig.delay;
    var animationEasing = animationConfig.easing;
    var animateConfig = {
      duration,
      delay: animationDelay || 0,
      easing: animationEasing,
      done: cb,
      force: !!cb || !!during,
      // Set to final state in update/init animation.
      // So the post processing based on the path shape can be done correctly.
      setToFinal: !isRemove,
      scope: animationType,
      during
    };
    isFrom ? el.animateFrom(props, animateConfig) : el.animateTo(props, animateConfig);
  } else {
    el.stopAnimation();
    !isFrom && el.attr(props);
    during && during(1);
    cb && cb();
  }
}
function updateProps(el, props, animatableModel, dataIndex, cb, during) {
  animateOrSetProps("update", el, props, animatableModel, dataIndex, cb, during);
}
function initProps(el, props, animatableModel, dataIndex, cb, during) {
  animateOrSetProps("enter", el, props, animatableModel, dataIndex, cb, during);
}
function isElementRemoved(el) {
  if (!el.__zr) {
    return true;
  }
  for (var i = 0; i < el.animators.length; i++) {
    var animator = el.animators[i];
    if (animator.scope === "leave") {
      return true;
    }
  }
  return false;
}
function removeElement(el, props, animatableModel, dataIndex, cb, during) {
  if (isElementRemoved(el)) {
    return;
  }
  animateOrSetProps("leave", el, props, animatableModel, dataIndex, cb, during);
}
function fadeOutDisplayable(el, animatableModel, dataIndex, done) {
  el.removeTextContent();
  el.removeTextGuideLine();
  removeElement(el, {
    style: {
      opacity: 0
    }
  }, animatableModel, dataIndex, done);
}
function removeElementWithFadeOut(el, animatableModel, dataIndex) {
  function doRemove() {
    el.parent && el.parent.remove(el);
  }
  if (!el.isGroup) {
    fadeOutDisplayable(el, animatableModel, dataIndex, doRemove);
  } else {
    el.traverse(function(disp) {
      if (!disp.isGroup) {
        fadeOutDisplayable(disp, animatableModel, dataIndex, doRemove);
      }
    });
  }
}
function saveOldStyle(el) {
  transitionStore(el).oldStyle = el.style;
}
function getOldStyle(el) {
  return transitionStore(el).oldStyle;
}

// node_modules/echarts/lib/util/graphic.js
var mathMax2 = Math.max;
var mathMin2 = Math.min;
var _customShapeMap = {};
function extendShape(opts) {
  return Path_default.extend(opts);
}
var extendPathFromString = extendFromString;
function extendPath(pathData, opts) {
  return extendPathFromString(pathData, opts);
}
function registerShape(name, ShapeClass) {
  _customShapeMap[name] = ShapeClass;
}
function getShapeClass(name) {
  if (_customShapeMap.hasOwnProperty(name)) {
    return _customShapeMap[name];
  }
}
function makePath(pathData, opts, rect, layout3) {
  var path = createFromString(pathData, opts);
  if (rect) {
    if (layout3 === "center") {
      rect = centerGraphic(rect, path.getBoundingRect());
    }
    resizePath(path, rect);
  }
  return path;
}
function makeImage(imageUrl, rect, layout3) {
  var zrImg = new Image_default({
    style: {
      image: imageUrl,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height
    },
    onload: function(img) {
      if (layout3 === "center") {
        var boundingRect = {
          width: img.width,
          height: img.height
        };
        zrImg.setStyle(centerGraphic(rect, boundingRect));
      }
    }
  });
  return zrImg;
}
function centerGraphic(rect, boundingRect) {
  var aspect = boundingRect.width / boundingRect.height;
  var width = rect.height * aspect;
  var height;
  if (width <= rect.width) {
    height = rect.height;
  } else {
    width = rect.width;
    height = width / aspect;
  }
  var cx = rect.x + rect.width / 2;
  var cy = rect.y + rect.height / 2;
  return {
    x: cx - width / 2,
    y: cy - height / 2,
    width,
    height
  };
}
var mergePath2 = mergePath;
function resizePath(path, rect) {
  if (!path.applyTransform) {
    return;
  }
  var pathRect = path.getBoundingRect();
  var m2 = pathRect.calculateTransform(rect);
  path.applyTransform(m2);
}
function subPixelOptimizeLine2(shape, lineWidth) {
  subPixelOptimizeLine(shape, shape, {
    lineWidth
  });
  return shape;
}
function subPixelOptimizeRect2(param) {
  subPixelOptimizeRect(param.shape, param.shape, param.style);
  return param;
}
var subPixelOptimize2 = subPixelOptimize;
function getTransform(target, ancestor) {
  var mat = identity([]);
  while (target && target !== ancestor) {
    mul(mat, target.getLocalTransform(), mat);
    target = target.parent;
  }
  return mat;
}
function applyTransform2(target, transform, invert2) {
  if (transform && !isArrayLike(transform)) {
    transform = Transformable_default.getLocalTransform(transform);
  }
  if (invert2) {
    transform = invert([], transform);
  }
  return applyTransform([], target, transform);
}
function transformDirection(direction, transform, invert2) {
  var hBase = transform[4] === 0 || transform[5] === 0 || transform[0] === 0 ? 1 : Math.abs(2 * transform[4] / transform[0]);
  var vBase = transform[4] === 0 || transform[5] === 0 || transform[2] === 0 ? 1 : Math.abs(2 * transform[4] / transform[2]);
  var vertex = [direction === "left" ? -hBase : direction === "right" ? hBase : 0, direction === "top" ? -vBase : direction === "bottom" ? vBase : 0];
  vertex = applyTransform2(vertex, transform, invert2);
  return Math.abs(vertex[0]) > Math.abs(vertex[1]) ? vertex[0] > 0 ? "right" : "left" : vertex[1] > 0 ? "bottom" : "top";
}
function isNotGroup(el) {
  return !el.isGroup;
}
function isPath(el) {
  return el.shape != null;
}
function groupTransition(g1, g2, animatableModel) {
  if (!g1 || !g2) {
    return;
  }
  function getElMap(g) {
    var elMap = {};
    g.traverse(function(el) {
      if (isNotGroup(el) && el.anid) {
        elMap[el.anid] = el;
      }
    });
    return elMap;
  }
  function getAnimatableProps(el) {
    var obj = {
      x: el.x,
      y: el.y,
      rotation: el.rotation
    };
    if (isPath(el)) {
      obj.shape = extend({}, el.shape);
    }
    return obj;
  }
  var elMap1 = getElMap(g1);
  g2.traverse(function(el) {
    if (isNotGroup(el) && el.anid) {
      var oldEl = elMap1[el.anid];
      if (oldEl) {
        var newProp = getAnimatableProps(el);
        el.attr(getAnimatableProps(oldEl));
        updateProps(el, newProp, animatableModel, getECData(el).dataIndex);
      }
    }
  });
}
function clipPointsByRect(points4, rect) {
  return map(points4, function(point) {
    var x = point[0];
    x = mathMax2(x, rect.x);
    x = mathMin2(x, rect.x + rect.width);
    var y = point[1];
    y = mathMax2(y, rect.y);
    y = mathMin2(y, rect.y + rect.height);
    return [x, y];
  });
}
function clipRectByRect(targetRect, rect) {
  var x = mathMax2(targetRect.x, rect.x);
  var x2 = mathMin2(targetRect.x + targetRect.width, rect.x + rect.width);
  var y = mathMax2(targetRect.y, rect.y);
  var y2 = mathMin2(targetRect.y + targetRect.height, rect.y + rect.height);
  if (x2 >= x && y2 >= y) {
    return {
      x,
      y,
      width: x2 - x,
      height: y2 - y
    };
  }
}
function createIcon(iconStr, opt, rect) {
  var innerOpts = extend({
    rectHover: true
  }, opt);
  var style = innerOpts.style = {
    strokeNoScale: true
  };
  rect = rect || {
    x: -1,
    y: -1,
    width: 2,
    height: 2
  };
  if (iconStr) {
    return iconStr.indexOf("image://") === 0 ? (style.image = iconStr.slice(8), defaults(style, rect), new Image_default(innerOpts)) : makePath(iconStr.replace("path://", ""), innerOpts, rect, "center");
  }
}
function linePolygonIntersect(a1x, a1y, a2x, a2y, points4) {
  for (var i = 0, p2 = points4[points4.length - 1]; i < points4.length; i++) {
    var p = points4[i];
    if (lineLineIntersect(a1x, a1y, a2x, a2y, p[0], p[1], p2[0], p2[1])) {
      return true;
    }
    p2 = p;
  }
}
function lineLineIntersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y) {
  var mx = a2x - a1x;
  var my = a2y - a1y;
  var nx = b2x - b1x;
  var ny = b2y - b1y;
  var nmCrossProduct = crossProduct2d(nx, ny, mx, my);
  if (nearZero(nmCrossProduct)) {
    return false;
  }
  var b1a1x = a1x - b1x;
  var b1a1y = a1y - b1y;
  var q = crossProduct2d(b1a1x, b1a1y, mx, my) / nmCrossProduct;
  if (q < 0 || q > 1) {
    return false;
  }
  var p = crossProduct2d(b1a1x, b1a1y, nx, ny) / nmCrossProduct;
  if (p < 0 || p > 1) {
    return false;
  }
  return true;
}
function crossProduct2d(x1, y1, x2, y2) {
  return x1 * y2 - x2 * y1;
}
function nearZero(val) {
  return val <= 1e-6 && val >= -1e-6;
}
function setTooltipConfig(opt) {
  var itemTooltipOption = opt.itemTooltipOption;
  var componentModel = opt.componentModel;
  var itemName = opt.itemName;
  var itemTooltipOptionObj = isString(itemTooltipOption) ? {
    formatter: itemTooltipOption
  } : itemTooltipOption;
  var mainType = componentModel.mainType;
  var componentIndex = componentModel.componentIndex;
  var formatterParams = {
    componentType: mainType,
    name: itemName,
    $vars: ["name"]
  };
  formatterParams[mainType + "Index"] = componentIndex;
  var formatterParamsExtra = opt.formatterParamsExtra;
  if (formatterParamsExtra) {
    each(keys(formatterParamsExtra), function(key) {
      if (!hasOwn(formatterParams, key)) {
        formatterParams[key] = formatterParamsExtra[key];
        formatterParams.$vars.push(key);
      }
    });
  }
  var ecData = getECData(opt.el);
  ecData.componentMainType = mainType;
  ecData.componentIndex = componentIndex;
  ecData.tooltipConfig = {
    name: itemName,
    option: defaults({
      content: itemName,
      formatterParams
    }, itemTooltipOptionObj)
  };
}
function traverseElement(el, cb) {
  var stopped;
  if (el.isGroup) {
    stopped = cb(el);
  }
  if (!stopped) {
    el.traverse(cb);
  }
}
function traverseElements(els, cb) {
  if (els) {
    if (isArray(els)) {
      for (var i = 0; i < els.length; i++) {
        traverseElement(els[i], cb);
      }
    } else {
      traverseElement(els, cb);
    }
  }
}
registerShape("circle", Circle_default);
registerShape("ellipse", Ellipse_default);
registerShape("sector", Sector_default);
registerShape("ring", Ring_default);
registerShape("polygon", Polygon_default);
registerShape("polyline", Polyline_default);
registerShape("rect", Rect_default);
registerShape("line", Line_default);
registerShape("bezierCurve", BezierCurve_default);
registerShape("arc", Arc_default);

// node_modules/echarts/lib/label/labelStyle.js
var EMPTY_OBJ = {};
function setLabelText(label, labelTexts) {
  for (var i = 0; i < SPECIAL_STATES.length; i++) {
    var stateName = SPECIAL_STATES[i];
    var text = labelTexts[stateName];
    var state = label.ensureState(stateName);
    state.style = state.style || {};
    state.style.text = text;
  }
  var oldStates = label.currentStates.slice();
  label.clearStates(true);
  label.setStyle({
    text: labelTexts.normal
  });
  label.useStates(oldStates, true);
}
function getLabelText(opt, stateModels, interpolatedValue) {
  var labelFetcher = opt.labelFetcher;
  var labelDataIndex = opt.labelDataIndex;
  var labelDimIndex = opt.labelDimIndex;
  var normalModel = stateModels.normal;
  var baseText;
  if (labelFetcher) {
    baseText = labelFetcher.getFormattedLabel(labelDataIndex, "normal", null, labelDimIndex, normalModel && normalModel.get("formatter"), interpolatedValue != null ? {
      interpolatedValue
    } : null);
  }
  if (baseText == null) {
    baseText = isFunction(opt.defaultText) ? opt.defaultText(labelDataIndex, opt, interpolatedValue) : opt.defaultText;
  }
  var statesText = {
    normal: baseText
  };
  for (var i = 0; i < SPECIAL_STATES.length; i++) {
    var stateName = SPECIAL_STATES[i];
    var stateModel = stateModels[stateName];
    statesText[stateName] = retrieve2(labelFetcher ? labelFetcher.getFormattedLabel(labelDataIndex, stateName, null, labelDimIndex, stateModel && stateModel.get("formatter")) : null, baseText);
  }
  return statesText;
}
function setLabelStyle(targetEl, labelStatesModels, opt, stateSpecified) {
  opt = opt || EMPTY_OBJ;
  var isSetOnText = targetEl instanceof Text_default;
  var needsCreateText = false;
  for (var i = 0; i < DISPLAY_STATES.length; i++) {
    var stateModel = labelStatesModels[DISPLAY_STATES[i]];
    if (stateModel && stateModel.getShallow("show")) {
      needsCreateText = true;
      break;
    }
  }
  var textContent = isSetOnText ? targetEl : targetEl.getTextContent();
  if (needsCreateText) {
    if (!isSetOnText) {
      if (!textContent) {
        textContent = new Text_default();
        targetEl.setTextContent(textContent);
      }
      if (targetEl.stateProxy) {
        textContent.stateProxy = targetEl.stateProxy;
      }
    }
    var labelStatesTexts = getLabelText(opt, labelStatesModels);
    var normalModel = labelStatesModels.normal;
    var showNormal = !!normalModel.getShallow("show");
    var normalStyle = createTextStyle(normalModel, stateSpecified && stateSpecified.normal, opt, false, !isSetOnText);
    normalStyle.text = labelStatesTexts.normal;
    if (!isSetOnText) {
      targetEl.setTextConfig(createTextConfig(normalModel, opt, false));
    }
    for (var i = 0; i < SPECIAL_STATES.length; i++) {
      var stateName = SPECIAL_STATES[i];
      var stateModel = labelStatesModels[stateName];
      if (stateModel) {
        var stateObj = textContent.ensureState(stateName);
        var stateShow = !!retrieve2(stateModel.getShallow("show"), showNormal);
        if (stateShow !== showNormal) {
          stateObj.ignore = !stateShow;
        }
        stateObj.style = createTextStyle(stateModel, stateSpecified && stateSpecified[stateName], opt, true, !isSetOnText);
        stateObj.style.text = labelStatesTexts[stateName];
        if (!isSetOnText) {
          var targetElEmphasisState = targetEl.ensureState(stateName);
          targetElEmphasisState.textConfig = createTextConfig(stateModel, opt, true);
        }
      }
    }
    textContent.silent = !!normalModel.getShallow("silent");
    if (textContent.style.x != null) {
      normalStyle.x = textContent.style.x;
    }
    if (textContent.style.y != null) {
      normalStyle.y = textContent.style.y;
    }
    textContent.ignore = !showNormal;
    textContent.useStyle(normalStyle);
    textContent.dirty();
    if (opt.enableTextSetter) {
      labelInner(textContent).setLabelText = function(interpolatedValue) {
        var labelStatesTexts2 = getLabelText(opt, labelStatesModels, interpolatedValue);
        setLabelText(textContent, labelStatesTexts2);
      };
    }
  } else if (textContent) {
    textContent.ignore = true;
  }
  targetEl.dirty();
}
function getLabelStatesModels(itemModel, labelName) {
  labelName = labelName || "label";
  var statesModels = {
    normal: itemModel.getModel(labelName)
  };
  for (var i = 0; i < SPECIAL_STATES.length; i++) {
    var stateName = SPECIAL_STATES[i];
    statesModels[stateName] = itemModel.getModel([stateName, labelName]);
  }
  return statesModels;
}
function createTextStyle(textStyleModel, specifiedTextStyle, opt, isNotNormal, isAttached) {
  var textStyle = {};
  setTextStyleCommon(textStyle, textStyleModel, opt, isNotNormal, isAttached);
  specifiedTextStyle && extend(textStyle, specifiedTextStyle);
  return textStyle;
}
function createTextConfig(textStyleModel, opt, isNotNormal) {
  opt = opt || {};
  var textConfig = {};
  var labelPosition;
  var labelRotate = textStyleModel.getShallow("rotate");
  var labelDistance = retrieve2(textStyleModel.getShallow("distance"), isNotNormal ? null : 5);
  var labelOffset = textStyleModel.getShallow("offset");
  labelPosition = textStyleModel.getShallow("position") || (isNotNormal ? null : "inside");
  labelPosition === "outside" && (labelPosition = opt.defaultOutsidePosition || "top");
  if (labelPosition != null) {
    textConfig.position = labelPosition;
  }
  if (labelOffset != null) {
    textConfig.offset = labelOffset;
  }
  if (labelRotate != null) {
    labelRotate *= Math.PI / 180;
    textConfig.rotation = labelRotate;
  }
  if (labelDistance != null) {
    textConfig.distance = labelDistance;
  }
  textConfig.outsideFill = textStyleModel.get("color") === "inherit" ? opt.inheritColor || null : "auto";
  return textConfig;
}
function setTextStyleCommon(textStyle, textStyleModel, opt, isNotNormal, isAttached) {
  opt = opt || EMPTY_OBJ;
  var ecModel = textStyleModel.ecModel;
  var globalTextStyle = ecModel && ecModel.option.textStyle;
  var richItemNames = getRichItemNames(textStyleModel);
  var richResult;
  if (richItemNames) {
    richResult = {};
    for (var name_1 in richItemNames) {
      if (richItemNames.hasOwnProperty(name_1)) {
        var richTextStyle = textStyleModel.getModel(["rich", name_1]);
        setTokenTextStyle(richResult[name_1] = {}, richTextStyle, globalTextStyle, opt, isNotNormal, isAttached, false, true);
      }
    }
  }
  if (richResult) {
    textStyle.rich = richResult;
  }
  var overflow = textStyleModel.get("overflow");
  if (overflow) {
    textStyle.overflow = overflow;
  }
  var margin = textStyleModel.get("minMargin");
  if (margin != null) {
    textStyle.margin = margin;
  }
  setTokenTextStyle(textStyle, textStyleModel, globalTextStyle, opt, isNotNormal, isAttached, true, false);
}
function getRichItemNames(textStyleModel) {
  var richItemNameMap;
  while (textStyleModel && textStyleModel !== textStyleModel.ecModel) {
    var rich = (textStyleModel.option || EMPTY_OBJ).rich;
    if (rich) {
      richItemNameMap = richItemNameMap || {};
      var richKeys = keys(rich);
      for (var i = 0; i < richKeys.length; i++) {
        var richKey = richKeys[i];
        richItemNameMap[richKey] = 1;
      }
    }
    textStyleModel = textStyleModel.parentModel;
  }
  return richItemNameMap;
}
var TEXT_PROPS_WITH_GLOBAL = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY"];
var TEXT_PROPS_SELF = ["align", "lineHeight", "width", "height", "tag", "verticalAlign"];
var TEXT_PROPS_BOX = ["padding", "borderWidth", "borderRadius", "borderDashOffset", "backgroundColor", "borderColor", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"];
function setTokenTextStyle(textStyle, textStyleModel, globalTextStyle, opt, isNotNormal, isAttached, isBlock, inRich) {
  globalTextStyle = !isNotNormal && globalTextStyle || EMPTY_OBJ;
  var inheritColor = opt && opt.inheritColor;
  var fillColor = textStyleModel.getShallow("color");
  var strokeColor = textStyleModel.getShallow("textBorderColor");
  var opacity = retrieve2(textStyleModel.getShallow("opacity"), globalTextStyle.opacity);
  if (fillColor === "inherit" || fillColor === "auto") {
    if (true) {
      if (fillColor === "auto") {
        deprecateReplaceLog("color: 'auto'", "color: 'inherit'");
      }
    }
    if (inheritColor) {
      fillColor = inheritColor;
    } else {
      fillColor = null;
    }
  }
  if (strokeColor === "inherit" || strokeColor === "auto") {
    if (true) {
      if (strokeColor === "auto") {
        deprecateReplaceLog("color: 'auto'", "color: 'inherit'");
      }
    }
    if (inheritColor) {
      strokeColor = inheritColor;
    } else {
      strokeColor = null;
    }
  }
  if (!isAttached) {
    fillColor = fillColor || globalTextStyle.color;
    strokeColor = strokeColor || globalTextStyle.textBorderColor;
  }
  if (fillColor != null) {
    textStyle.fill = fillColor;
  }
  if (strokeColor != null) {
    textStyle.stroke = strokeColor;
  }
  var textBorderWidth = retrieve2(textStyleModel.getShallow("textBorderWidth"), globalTextStyle.textBorderWidth);
  if (textBorderWidth != null) {
    textStyle.lineWidth = textBorderWidth;
  }
  var textBorderType = retrieve2(textStyleModel.getShallow("textBorderType"), globalTextStyle.textBorderType);
  if (textBorderType != null) {
    textStyle.lineDash = textBorderType;
  }
  var textBorderDashOffset = retrieve2(textStyleModel.getShallow("textBorderDashOffset"), globalTextStyle.textBorderDashOffset);
  if (textBorderDashOffset != null) {
    textStyle.lineDashOffset = textBorderDashOffset;
  }
  if (!isNotNormal && opacity == null && !inRich) {
    opacity = opt && opt.defaultOpacity;
  }
  if (opacity != null) {
    textStyle.opacity = opacity;
  }
  if (!isNotNormal && !isAttached) {
    if (textStyle.fill == null && opt.inheritColor) {
      textStyle.fill = opt.inheritColor;
    }
  }
  for (var i = 0; i < TEXT_PROPS_WITH_GLOBAL.length; i++) {
    var key = TEXT_PROPS_WITH_GLOBAL[i];
    var val = retrieve2(textStyleModel.getShallow(key), globalTextStyle[key]);
    if (val != null) {
      textStyle[key] = val;
    }
  }
  for (var i = 0; i < TEXT_PROPS_SELF.length; i++) {
    var key = TEXT_PROPS_SELF[i];
    var val = textStyleModel.getShallow(key);
    if (val != null) {
      textStyle[key] = val;
    }
  }
  if (textStyle.verticalAlign == null) {
    var baseline = textStyleModel.getShallow("baseline");
    if (baseline != null) {
      textStyle.verticalAlign = baseline;
    }
  }
  if (!isBlock || !opt.disableBox) {
    for (var i = 0; i < TEXT_PROPS_BOX.length; i++) {
      var key = TEXT_PROPS_BOX[i];
      var val = textStyleModel.getShallow(key);
      if (val != null) {
        textStyle[key] = val;
      }
    }
    var borderType = textStyleModel.getShallow("borderType");
    if (borderType != null) {
      textStyle.borderDash = borderType;
    }
    if ((textStyle.backgroundColor === "auto" || textStyle.backgroundColor === "inherit") && inheritColor) {
      if (true) {
        if (textStyle.backgroundColor === "auto") {
          deprecateReplaceLog("backgroundColor: 'auto'", "backgroundColor: 'inherit'");
        }
      }
      textStyle.backgroundColor = inheritColor;
    }
    if ((textStyle.borderColor === "auto" || textStyle.borderColor === "inherit") && inheritColor) {
      if (true) {
        if (textStyle.borderColor === "auto") {
          deprecateReplaceLog("borderColor: 'auto'", "borderColor: 'inherit'");
        }
      }
      textStyle.borderColor = inheritColor;
    }
  }
}
function getFont(opt, ecModel) {
  var gTextStyleModel = ecModel && ecModel.getModel("textStyle");
  return trim([
    // FIXME in node-canvas fontWeight is before fontStyle
    opt.fontStyle || gTextStyleModel && gTextStyleModel.getShallow("fontStyle") || "",
    opt.fontWeight || gTextStyleModel && gTextStyleModel.getShallow("fontWeight") || "",
    (opt.fontSize || gTextStyleModel && gTextStyleModel.getShallow("fontSize") || 12) + "px",
    opt.fontFamily || gTextStyleModel && gTextStyleModel.getShallow("fontFamily") || "sans-serif"
  ].join(" "));
}
var labelInner = makeInner();
function setLabelValueAnimation(label, labelStatesModels, value, getDefaultText) {
  if (!label) {
    return;
  }
  var obj = labelInner(label);
  obj.prevValue = obj.value;
  obj.value = value;
  var normalLabelModel = labelStatesModels.normal;
  obj.valueAnimation = normalLabelModel.get("valueAnimation");
  if (obj.valueAnimation) {
    obj.precision = normalLabelModel.get("precision");
    obj.defaultInterpolatedText = getDefaultText;
    obj.statesModels = labelStatesModels;
  }
}
function animateLabelValue(textEl, dataIndex, data, animatableModel, labelFetcher) {
  var labelInnerStore = labelInner(textEl);
  if (!labelInnerStore.valueAnimation || labelInnerStore.prevValue === labelInnerStore.value) {
    return;
  }
  var defaultInterpolatedText = labelInnerStore.defaultInterpolatedText;
  var currValue = retrieve2(labelInnerStore.interpolatedValue, labelInnerStore.prevValue);
  var targetValue = labelInnerStore.value;
  function during(percent) {
    var interpolated = interpolateRawValues(data, labelInnerStore.precision, currValue, targetValue, percent);
    labelInnerStore.interpolatedValue = percent === 1 ? null : interpolated;
    var labelText = getLabelText({
      labelDataIndex: dataIndex,
      labelFetcher,
      defaultText: defaultInterpolatedText ? defaultInterpolatedText(interpolated) : interpolated + ""
    }, labelInnerStore.statesModels, interpolated);
    setLabelText(textEl, labelText);
  }
  textEl.percent = 0;
  (labelInnerStore.prevValue == null ? initProps : updateProps)(textEl, {
    // percent is used to prevent animation from being aborted #15916
    percent: 1
  }, animatableModel, dataIndex, null, during);
}

// node_modules/echarts/lib/model/mixin/textStyle.js
var PATH_COLOR = ["textStyle", "color"];
var textStyleParams = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "padding", "lineHeight", "rich", "width", "height", "overflow"];
var tmpText = new Text_default();
var TextStyleMixin = (
  /** @class */
  function() {
    function TextStyleMixin2() {
    }
    TextStyleMixin2.prototype.getTextColor = function(isEmphasis) {
      var ecModel = this.ecModel;
      return this.getShallow("color") || (!isEmphasis && ecModel ? ecModel.get(PATH_COLOR) : null);
    };
    TextStyleMixin2.prototype.getFont = function() {
      return getFont({
        fontStyle: this.getShallow("fontStyle"),
        fontWeight: this.getShallow("fontWeight"),
        fontSize: this.getShallow("fontSize"),
        fontFamily: this.getShallow("fontFamily")
      }, this.ecModel);
    };
    TextStyleMixin2.prototype.getTextRect = function(text) {
      var style = {
        text,
        verticalAlign: this.getShallow("verticalAlign") || this.getShallow("baseline")
      };
      for (var i = 0; i < textStyleParams.length; i++) {
        style[textStyleParams[i]] = this.getShallow(textStyleParams[i]);
      }
      tmpText.useStyle(style);
      tmpText.update();
      return tmpText.getBoundingRect();
    };
    return TextStyleMixin2;
  }()
);
var textStyle_default = TextStyleMixin;

// node_modules/echarts/lib/model/mixin/lineStyle.js
var LINE_STYLE_KEY_MAP = [
  ["lineWidth", "width"],
  ["stroke", "color"],
  ["opacity"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["shadowColor"],
  ["lineDash", "type"],
  ["lineDashOffset", "dashOffset"],
  ["lineCap", "cap"],
  ["lineJoin", "join"],
  ["miterLimit"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
];
var getLineStyle = makeStyleMapper(LINE_STYLE_KEY_MAP);
var LineStyleMixin = (
  /** @class */
  function() {
    function LineStyleMixin2() {
    }
    LineStyleMixin2.prototype.getLineStyle = function(excludes) {
      return getLineStyle(this, excludes);
    };
    return LineStyleMixin2;
  }()
);

// node_modules/echarts/lib/model/mixin/itemStyle.js
var ITEM_STYLE_KEY_MAP = [
  ["fill", "color"],
  ["stroke", "borderColor"],
  ["lineWidth", "borderWidth"],
  ["opacity"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["shadowColor"],
  ["lineDash", "borderType"],
  ["lineDashOffset", "borderDashOffset"],
  ["lineCap", "borderCap"],
  ["lineJoin", "borderJoin"],
  ["miterLimit", "borderMiterLimit"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
];
var getItemStyle = makeStyleMapper(ITEM_STYLE_KEY_MAP);
var ItemStyleMixin = (
  /** @class */
  function() {
    function ItemStyleMixin2() {
    }
    ItemStyleMixin2.prototype.getItemStyle = function(excludes, includes) {
      return getItemStyle(this, excludes, includes);
    };
    return ItemStyleMixin2;
  }()
);

// node_modules/echarts/lib/model/Model.js
var Model = (
  /** @class */
  function() {
    function Model2(option, parentModel, ecModel) {
      this.parentModel = parentModel;
      this.ecModel = ecModel;
      this.option = option;
    }
    Model2.prototype.init = function(option, parentModel, ecModel) {
      var rest = [];
      for (var _i = 3; _i < arguments.length; _i++) {
        rest[_i - 3] = arguments[_i];
      }
    };
    Model2.prototype.mergeOption = function(option, ecModel) {
      merge(this.option, option, true);
    };
    Model2.prototype.get = function(path, ignoreParent) {
      if (path == null) {
        return this.option;
      }
      return this._doGet(this.parsePath(path), !ignoreParent && this.parentModel);
    };
    Model2.prototype.getShallow = function(key, ignoreParent) {
      var option = this.option;
      var val = option == null ? option : option[key];
      if (val == null && !ignoreParent) {
        var parentModel = this.parentModel;
        if (parentModel) {
          val = parentModel.getShallow(key);
        }
      }
      return val;
    };
    Model2.prototype.getModel = function(path, parentModel) {
      var hasPath = path != null;
      var pathFinal = hasPath ? this.parsePath(path) : null;
      var obj = hasPath ? this._doGet(pathFinal) : this.option;
      parentModel = parentModel || this.parentModel && this.parentModel.getModel(this.resolveParentPath(pathFinal));
      return new Model2(obj, parentModel, this.ecModel);
    };
    Model2.prototype.isEmpty = function() {
      return this.option == null;
    };
    Model2.prototype.restoreData = function() {
    };
    Model2.prototype.clone = function() {
      var Ctor = this.constructor;
      return new Ctor(clone(this.option));
    };
    Model2.prototype.parsePath = function(path) {
      if (typeof path === "string") {
        return path.split(".");
      }
      return path;
    };
    Model2.prototype.resolveParentPath = function(path) {
      return path;
    };
    Model2.prototype.isAnimationEnabled = function() {
      if (!env_default.node && this.option) {
        if (this.option.animation != null) {
          return !!this.option.animation;
        } else if (this.parentModel) {
          return this.parentModel.isAnimationEnabled();
        }
      }
    };
    Model2.prototype._doGet = function(pathArr, parentModel) {
      var obj = this.option;
      if (!pathArr) {
        return obj;
      }
      for (var i = 0; i < pathArr.length; i++) {
        if (!pathArr[i]) {
          continue;
        }
        obj = obj && typeof obj === "object" ? obj[pathArr[i]] : null;
        if (obj == null) {
          break;
        }
      }
      if (obj == null && parentModel) {
        obj = parentModel._doGet(this.resolveParentPath(pathArr), parentModel.parentModel);
      }
      return obj;
    };
    return Model2;
  }()
);
enableClassExtend(Model);
enableClassCheck(Model);
mixin(Model, LineStyleMixin);
mixin(Model, ItemStyleMixin);
mixin(Model, AreaStyleMixin);
mixin(Model, textStyle_default);
var Model_default = Model;

// node_modules/echarts/lib/i18n/langEN.js
var langEN_default = {
  time: {
    month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayOfWeekAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },
  legend: {
    selector: {
      all: "All",
      inverse: "Inv"
    }
  },
  toolbox: {
    brush: {
      title: {
        rect: "Box Select",
        polygon: "Lasso Select",
        lineX: "Horizontally Select",
        lineY: "Vertically Select",
        keep: "Keep Selections",
        clear: "Clear Selections"
      }
    },
    dataView: {
      title: "Data View",
      lang: ["Data View", "Close", "Refresh"]
    },
    dataZoom: {
      title: {
        zoom: "Zoom",
        back: "Zoom Reset"
      }
    },
    magicType: {
      title: {
        line: "Switch to Line Chart",
        bar: "Switch to Bar Chart",
        stack: "Stack",
        tiled: "Tile"
      }
    },
    restore: {
      title: "Restore"
    },
    saveAsImage: {
      title: "Save as Image",
      lang: ["Right Click to Save Image"]
    }
  },
  series: {
    typeNames: {
      pie: "Pie chart",
      bar: "Bar chart",
      line: "Line chart",
      scatter: "Scatter plot",
      effectScatter: "Ripple scatter plot",
      radar: "Radar chart",
      tree: "Tree",
      treemap: "Treemap",
      boxplot: "Boxplot",
      candlestick: "Candlestick",
      k: "K line chart",
      heatmap: "Heat map",
      map: "Map",
      parallel: "Parallel coordinate map",
      lines: "Line graph",
      graph: "Relationship graph",
      sankey: "Sankey diagram",
      funnel: "Funnel chart",
      gauge: "Gauge",
      pictorialBar: "Pictorial bar",
      themeRiver: "Theme River Map",
      sunburst: "Sunburst"
    }
  },
  aria: {
    general: {
      withTitle: 'This is a chart about "{title}"',
      withoutTitle: "This is a chart"
    },
    series: {
      single: {
        prefix: "",
        withName: " with type {seriesType} named {seriesName}.",
        withoutName: " with type {seriesType}."
      },
      multiple: {
        prefix: ". It consists of {seriesCount} series count.",
        withName: " The {seriesId} series is a {seriesType} representing {seriesName}.",
        withoutName: " The {seriesId} series is a {seriesType}.",
        separator: {
          middle: "",
          end: ""
        }
      }
    },
    data: {
      allData: "The data is as follows: ",
      partialData: "The first {displayCnt} items are: ",
      withName: "the data for {name} is {value}",
      withoutName: "{value}",
      separator: {
        middle: ", ",
        end: ". "
      }
    }
  }
};

// node_modules/echarts/lib/i18n/langZH.js
var langZH_default = {
  time: {
    month: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthAbbr: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    dayOfWeek: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    dayOfWeekAbbr: ["日", "一", "二", "三", "四", "五", "六"]
  },
  legend: {
    selector: {
      all: "全选",
      inverse: "反选"
    }
  },
  toolbox: {
    brush: {
      title: {
        rect: "矩形选择",
        polygon: "圈选",
        lineX: "横向选择",
        lineY: "纵向选择",
        keep: "保持选择",
        clear: "清除选择"
      }
    },
    dataView: {
      title: "数据视图",
      lang: ["数据视图", "关闭", "刷新"]
    },
    dataZoom: {
      title: {
        zoom: "区域缩放",
        back: "区域缩放还原"
      }
    },
    magicType: {
      title: {
        line: "切换为折线图",
        bar: "切换为柱状图",
        stack: "切换为堆叠",
        tiled: "切换为平铺"
      }
    },
    restore: {
      title: "还原"
    },
    saveAsImage: {
      title: "保存为图片",
      lang: ["右键另存为图片"]
    }
  },
  series: {
    typeNames: {
      pie: "饼图",
      bar: "柱状图",
      line: "折线图",
      scatter: "散点图",
      effectScatter: "涟漪散点图",
      radar: "雷达图",
      tree: "树图",
      treemap: "矩形树图",
      boxplot: "箱型图",
      candlestick: "K线图",
      k: "K线图",
      heatmap: "热力图",
      map: "地图",
      parallel: "平行坐标图",
      lines: "线图",
      graph: "关系图",
      sankey: "桑基图",
      funnel: "漏斗图",
      gauge: "仪表盘图",
      pictorialBar: "象形柱图",
      themeRiver: "主题河流图",
      sunburst: "旭日图"
    }
  },
  aria: {
    general: {
      withTitle: "这是一个关于“{title}”的图表。",
      withoutTitle: "这是一个图表，"
    },
    series: {
      single: {
        prefix: "",
        withName: "图表类型是{seriesType}，表示{seriesName}。",
        withoutName: "图表类型是{seriesType}。"
      },
      multiple: {
        prefix: "它由{seriesCount}个图表系列组成。",
        withName: "第{seriesId}个系列是一个表示{seriesName}的{seriesType}，",
        withoutName: "第{seriesId}个系列是一个{seriesType}，",
        separator: {
          middle: "；",
          end: "。"
        }
      }
    },
    data: {
      allData: "其数据是——",
      partialData: "其中，前{displayCnt}项是——",
      withName: "{name}的数据是{value}",
      withoutName: "{value}",
      separator: {
        middle: "，",
        end: ""
      }
    }
  }
};

// node_modules/echarts/lib/core/locale.js
var LOCALE_ZH = "ZH";
var LOCALE_EN = "EN";
var DEFAULT_LOCALE = LOCALE_EN;
var localeStorage = {};
var localeModels = {};
var SYSTEM_LANG = !env_default.domSupported ? DEFAULT_LOCALE : function() {
  var langStr = (
    /* eslint-disable-next-line */
    (document.documentElement.lang || navigator.language || navigator.browserLanguage).toUpperCase()
  );
  return langStr.indexOf(LOCALE_ZH) > -1 ? LOCALE_ZH : DEFAULT_LOCALE;
}();
function registerLocale(locale, localeObj) {
  locale = locale.toUpperCase();
  localeModels[locale] = new Model_default(localeObj);
  localeStorage[locale] = localeObj;
}
function createLocaleObject(locale) {
  if (isString(locale)) {
    var localeObj = localeStorage[locale.toUpperCase()] || {};
    if (locale === LOCALE_ZH || locale === LOCALE_EN) {
      return clone(localeObj);
    } else {
      return merge(clone(localeObj), clone(localeStorage[DEFAULT_LOCALE]), false);
    }
  } else {
    return merge(clone(locale), clone(localeStorage[DEFAULT_LOCALE]), false);
  }
}
function getLocaleModel(lang) {
  return localeModels[lang];
}
function getDefaultLocaleModel() {
  return localeModels[DEFAULT_LOCALE];
}
registerLocale(LOCALE_EN, langEN_default);
registerLocale(LOCALE_ZH, langZH_default);

// node_modules/echarts/lib/util/component.js
var base = Math.round(Math.random() * 10);
function getUID(type) {
  return [type || "", base++].join("_");
}
function enableSubTypeDefaulter(target) {
  var subTypeDefaulters = {};
  target.registerSubTypeDefaulter = function(componentType, defaulter) {
    var componentTypeInfo = parseClassType(componentType);
    subTypeDefaulters[componentTypeInfo.main] = defaulter;
  };
  target.determineSubType = function(componentType, option) {
    var type = option.type;
    if (!type) {
      var componentTypeMain = parseClassType(componentType).main;
      if (target.hasSubTypes(componentType) && subTypeDefaulters[componentTypeMain]) {
        type = subTypeDefaulters[componentTypeMain](option);
      }
    }
    return type;
  };
}
function enableTopologicalTravel(entity, dependencyGetter) {
  entity.topologicalTravel = function(targetNameList, fullNameList, callback, context) {
    if (!targetNameList.length) {
      return;
    }
    var result = makeDepndencyGraph(fullNameList);
    var graph = result.graph;
    var noEntryList = result.noEntryList;
    var targetNameSet = {};
    each(targetNameList, function(name) {
      targetNameSet[name] = true;
    });
    while (noEntryList.length) {
      var currComponentType = noEntryList.pop();
      var currVertex = graph[currComponentType];
      var isInTargetNameSet = !!targetNameSet[currComponentType];
      if (isInTargetNameSet) {
        callback.call(context, currComponentType, currVertex.originalDeps.slice());
        delete targetNameSet[currComponentType];
      }
      each(currVertex.successor, isInTargetNameSet ? removeEdgeAndAdd : removeEdge);
    }
    each(targetNameSet, function() {
      var errMsg = "";
      if (true) {
        errMsg = makePrintable("Circular dependency may exists: ", targetNameSet, targetNameList, fullNameList);
      }
      throw new Error(errMsg);
    });
    function removeEdge(succComponentType) {
      graph[succComponentType].entryCount--;
      if (graph[succComponentType].entryCount === 0) {
        noEntryList.push(succComponentType);
      }
    }
    function removeEdgeAndAdd(succComponentType) {
      targetNameSet[succComponentType] = true;
      removeEdge(succComponentType);
    }
  };
  function makeDepndencyGraph(fullNameList) {
    var graph = {};
    var noEntryList = [];
    each(fullNameList, function(name) {
      var thisItem = createDependencyGraphItem(graph, name);
      var originalDeps = thisItem.originalDeps = dependencyGetter(name);
      var availableDeps = getAvailableDependencies(originalDeps, fullNameList);
      thisItem.entryCount = availableDeps.length;
      if (thisItem.entryCount === 0) {
        noEntryList.push(name);
      }
      each(availableDeps, function(dependentName) {
        if (indexOf(thisItem.predecessor, dependentName) < 0) {
          thisItem.predecessor.push(dependentName);
        }
        var thatItem = createDependencyGraphItem(graph, dependentName);
        if (indexOf(thatItem.successor, dependentName) < 0) {
          thatItem.successor.push(name);
        }
      });
    });
    return {
      graph,
      noEntryList
    };
  }
  function createDependencyGraphItem(graph, name) {
    if (!graph[name]) {
      graph[name] = {
        predecessor: [],
        successor: []
      };
    }
    return graph[name];
  }
  function getAvailableDependencies(originalDeps, fullNameList) {
    var availableDeps = [];
    each(originalDeps, function(dep) {
      indexOf(fullNameList, dep) >= 0 && availableDeps.push(dep);
    });
    return availableDeps;
  }
}
function inheritDefaultOption(superOption, subOption) {
  return merge(merge({}, superOption, true), subOption, true);
}

// node_modules/echarts/lib/util/time.js
var ONE_SECOND = 1e3;
var ONE_MINUTE = ONE_SECOND * 60;
var ONE_HOUR = ONE_MINUTE * 60;
var ONE_DAY = ONE_HOUR * 24;
var ONE_YEAR = ONE_DAY * 365;
var defaultLeveledFormatter = {
  year: "{yyyy}",
  month: "{MMM}",
  day: "{d}",
  hour: "{HH}:{mm}",
  minute: "{HH}:{mm}",
  second: "{HH}:{mm}:{ss}",
  millisecond: "{HH}:{mm}:{ss} {SSS}",
  none: "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss} {SSS}"
};
var fullDayFormatter = "{yyyy}-{MM}-{dd}";
var fullLeveledFormatter = {
  year: "{yyyy}",
  month: "{yyyy}-{MM}",
  day: fullDayFormatter,
  hour: fullDayFormatter + " " + defaultLeveledFormatter.hour,
  minute: fullDayFormatter + " " + defaultLeveledFormatter.minute,
  second: fullDayFormatter + " " + defaultLeveledFormatter.second,
  millisecond: defaultLeveledFormatter.none
};
var primaryTimeUnits = ["year", "month", "day", "hour", "minute", "second", "millisecond"];
var timeUnits = ["year", "half-year", "quarter", "month", "week", "half-week", "day", "half-day", "quarter-day", "hour", "minute", "second", "millisecond"];
function pad(str, len) {
  str += "";
  return "0000".substr(0, len - str.length) + str;
}
function getPrimaryTimeUnit(timeUnit) {
  switch (timeUnit) {
    case "half-year":
    case "quarter":
      return "month";
    case "week":
    case "half-week":
      return "day";
    case "half-day":
    case "quarter-day":
      return "hour";
    default:
      return timeUnit;
  }
}
function isPrimaryTimeUnit(timeUnit) {
  return timeUnit === getPrimaryTimeUnit(timeUnit);
}
function getDefaultFormatPrecisionOfInterval(timeUnit) {
  switch (timeUnit) {
    case "year":
    case "month":
      return "day";
    case "millisecond":
      return "millisecond";
    default:
      return "second";
  }
}
function format(time, template, isUTC, lang) {
  var date = parseDate(time);
  var y = date[fullYearGetterName(isUTC)]();
  var M = date[monthGetterName(isUTC)]() + 1;
  var q = Math.floor((M - 1) / 3) + 1;
  var d = date[dateGetterName(isUTC)]();
  var e2 = date["get" + (isUTC ? "UTC" : "") + "Day"]();
  var H = date[hoursGetterName(isUTC)]();
  var h = (H - 1) % 12 + 1;
  var m2 = date[minutesGetterName(isUTC)]();
  var s = date[secondsGetterName(isUTC)]();
  var S = date[millisecondsGetterName(isUTC)]();
  var localeModel = lang instanceof Model_default ? lang : getLocaleModel(lang || SYSTEM_LANG) || getDefaultLocaleModel();
  var timeModel = localeModel.getModel("time");
  var month = timeModel.get("month");
  var monthAbbr = timeModel.get("monthAbbr");
  var dayOfWeek = timeModel.get("dayOfWeek");
  var dayOfWeekAbbr = timeModel.get("dayOfWeekAbbr");
  return (template || "").replace(/{yyyy}/g, y + "").replace(/{yy}/g, y % 100 + "").replace(/{Q}/g, q + "").replace(/{MMMM}/g, month[M - 1]).replace(/{MMM}/g, monthAbbr[M - 1]).replace(/{MM}/g, pad(M, 2)).replace(/{M}/g, M + "").replace(/{dd}/g, pad(d, 2)).replace(/{d}/g, d + "").replace(/{eeee}/g, dayOfWeek[e2]).replace(/{ee}/g, dayOfWeekAbbr[e2]).replace(/{e}/g, e2 + "").replace(/{HH}/g, pad(H, 2)).replace(/{H}/g, H + "").replace(/{hh}/g, pad(h + "", 2)).replace(/{h}/g, h + "").replace(/{mm}/g, pad(m2, 2)).replace(/{m}/g, m2 + "").replace(/{ss}/g, pad(s, 2)).replace(/{s}/g, s + "").replace(/{SSS}/g, pad(S, 3)).replace(/{S}/g, S + "");
}
function leveledFormat(tick, idx, formatter, lang, isUTC) {
  var template = null;
  if (isString(formatter)) {
    template = formatter;
  } else if (isFunction(formatter)) {
    template = formatter(tick.value, idx, {
      level: tick.level
    });
  } else {
    var defaults2 = extend({}, defaultLeveledFormatter);
    if (tick.level > 0) {
      for (var i = 0; i < primaryTimeUnits.length; ++i) {
        defaults2[primaryTimeUnits[i]] = "{primary|" + defaults2[primaryTimeUnits[i]] + "}";
      }
    }
    var mergedFormatter = formatter ? formatter.inherit === false ? formatter : defaults(formatter, defaults2) : defaults2;
    var unit = getUnitFromValue(tick.value, isUTC);
    if (mergedFormatter[unit]) {
      template = mergedFormatter[unit];
    } else if (mergedFormatter.inherit) {
      var targetId = timeUnits.indexOf(unit);
      for (var i = targetId - 1; i >= 0; --i) {
        if (mergedFormatter[unit]) {
          template = mergedFormatter[unit];
          break;
        }
      }
      template = template || defaults2.none;
    }
    if (isArray(template)) {
      var levelId = tick.level == null ? 0 : tick.level >= 0 ? tick.level : template.length + tick.level;
      levelId = Math.min(levelId, template.length - 1);
      template = template[levelId];
    }
  }
  return format(new Date(tick.value), template, isUTC, lang);
}
function getUnitFromValue(value, isUTC) {
  var date = parseDate(value);
  var M = date[monthGetterName(isUTC)]() + 1;
  var d = date[dateGetterName(isUTC)]();
  var h = date[hoursGetterName(isUTC)]();
  var m2 = date[minutesGetterName(isUTC)]();
  var s = date[secondsGetterName(isUTC)]();
  var S = date[millisecondsGetterName(isUTC)]();
  var isSecond = S === 0;
  var isMinute = isSecond && s === 0;
  var isHour = isMinute && m2 === 0;
  var isDay = isHour && h === 0;
  var isMonth = isDay && d === 1;
  var isYear = isMonth && M === 1;
  if (isYear) {
    return "year";
  } else if (isMonth) {
    return "month";
  } else if (isDay) {
    return "day";
  } else if (isHour) {
    return "hour";
  } else if (isMinute) {
    return "minute";
  } else if (isSecond) {
    return "second";
  } else {
    return "millisecond";
  }
}
function getUnitValue(value, unit, isUTC) {
  var date = isNumber(value) ? parseDate(value) : value;
  unit = unit || getUnitFromValue(value, isUTC);
  switch (unit) {
    case "year":
      return date[fullYearGetterName(isUTC)]();
    case "half-year":
      return date[monthGetterName(isUTC)]() >= 6 ? 1 : 0;
    case "quarter":
      return Math.floor((date[monthGetterName(isUTC)]() + 1) / 4);
    case "month":
      return date[monthGetterName(isUTC)]();
    case "day":
      return date[dateGetterName(isUTC)]();
    case "half-day":
      return date[hoursGetterName(isUTC)]() / 24;
    case "hour":
      return date[hoursGetterName(isUTC)]();
    case "minute":
      return date[minutesGetterName(isUTC)]();
    case "second":
      return date[secondsGetterName(isUTC)]();
    case "millisecond":
      return date[millisecondsGetterName(isUTC)]();
  }
}
function fullYearGetterName(isUTC) {
  return isUTC ? "getUTCFullYear" : "getFullYear";
}
function monthGetterName(isUTC) {
  return isUTC ? "getUTCMonth" : "getMonth";
}
function dateGetterName(isUTC) {
  return isUTC ? "getUTCDate" : "getDate";
}
function hoursGetterName(isUTC) {
  return isUTC ? "getUTCHours" : "getHours";
}
function minutesGetterName(isUTC) {
  return isUTC ? "getUTCMinutes" : "getMinutes";
}
function secondsGetterName(isUTC) {
  return isUTC ? "getUTCSeconds" : "getSeconds";
}
function millisecondsGetterName(isUTC) {
  return isUTC ? "getUTCMilliseconds" : "getMilliseconds";
}
function fullYearSetterName(isUTC) {
  return isUTC ? "setUTCFullYear" : "setFullYear";
}
function monthSetterName(isUTC) {
  return isUTC ? "setUTCMonth" : "setMonth";
}
function dateSetterName(isUTC) {
  return isUTC ? "setUTCDate" : "setDate";
}
function hoursSetterName(isUTC) {
  return isUTC ? "setUTCHours" : "setHours";
}
function minutesSetterName(isUTC) {
  return isUTC ? "setUTCMinutes" : "setMinutes";
}
function secondsSetterName(isUTC) {
  return isUTC ? "setUTCSeconds" : "setSeconds";
}
function millisecondsSetterName(isUTC) {
  return isUTC ? "setUTCMilliseconds" : "setMilliseconds";
}

// node_modules/echarts/lib/legacy/getTextRect.js
function getTextRect(text, font, align, verticalAlign, padding, rich, truncate, lineHeight) {
  var textEl = new Text_default({
    style: {
      text,
      font,
      align,
      verticalAlign,
      padding,
      rich,
      overflow: truncate ? "truncate" : null,
      lineHeight
    }
  });
  return textEl.getBoundingRect();
}

// node_modules/echarts/lib/util/format.js
function addCommas(x) {
  if (!isNumeric(x)) {
    return isString(x) ? x : "-";
  }
  var parts = (x + "").split(".");
  return parts[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,") + (parts.length > 1 ? "." + parts[1] : "");
}
function toCamelCase(str, upperCaseFirst) {
  str = (str || "").toLowerCase().replace(/-(.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
  if (upperCaseFirst && str) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
}
var normalizeCssArray2 = normalizeCssArray;
function makeValueReadable(value, valueType, useUTC) {
  var USER_READABLE_DEFUALT_TIME_PATTERN = "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}";
  function stringToUserReadable(str) {
    return str && trim(str) ? str : "-";
  }
  function isNumberUserReadable(num) {
    return !!(num != null && !isNaN(num) && isFinite(num));
  }
  var isTypeTime = valueType === "time";
  var isValueDate = value instanceof Date;
  if (isTypeTime || isValueDate) {
    var date = isTypeTime ? parseDate(value) : value;
    if (!isNaN(+date)) {
      return format(date, USER_READABLE_DEFUALT_TIME_PATTERN, useUTC);
    } else if (isValueDate) {
      return "-";
    }
  }
  if (valueType === "ordinal") {
    return isStringSafe(value) ? stringToUserReadable(value) : isNumber(value) ? isNumberUserReadable(value) ? value + "" : "-" : "-";
  }
  var numericResult = numericToNumber(value);
  return isNumberUserReadable(numericResult) ? addCommas(numericResult) : isStringSafe(value) ? stringToUserReadable(value) : typeof value === "boolean" ? value + "" : "-";
}
var TPL_VAR_ALIAS = ["a", "b", "c", "d", "e", "f", "g"];
var wrapVar = function(varName, seriesIdx) {
  return "{" + varName + (seriesIdx == null ? "" : seriesIdx) + "}";
};
function formatTpl(tpl, paramsList, encode) {
  if (!isArray(paramsList)) {
    paramsList = [paramsList];
  }
  var seriesLen = paramsList.length;
  if (!seriesLen) {
    return "";
  }
  var $vars = paramsList[0].$vars || [];
  for (var i = 0; i < $vars.length; i++) {
    var alias = TPL_VAR_ALIAS[i];
    tpl = tpl.replace(wrapVar(alias), wrapVar(alias, 0));
  }
  for (var seriesIdx = 0; seriesIdx < seriesLen; seriesIdx++) {
    for (var k = 0; k < $vars.length; k++) {
      var val = paramsList[seriesIdx][$vars[k]];
      tpl = tpl.replace(wrapVar(TPL_VAR_ALIAS[k], seriesIdx), encode ? encodeHTML(val) : val);
    }
  }
  return tpl;
}
function formatTplSimple(tpl, param, encode) {
  each(param, function(value, key) {
    tpl = tpl.replace("{" + key + "}", encode ? encodeHTML(value) : value);
  });
  return tpl;
}
function getTooltipMarker(inOpt, extraCssText) {
  var opt = isString(inOpt) ? {
    color: inOpt,
    extraCssText
  } : inOpt || {};
  var color = opt.color;
  var type = opt.type;
  extraCssText = opt.extraCssText;
  var renderMode = opt.renderMode || "html";
  if (!color) {
    return "";
  }
  if (renderMode === "html") {
    return type === "subItem" ? '<span style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:' + encodeHTML(color) + ";" + (extraCssText || "") + '"></span>' : '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' + encodeHTML(color) + ";" + (extraCssText || "") + '"></span>';
  } else {
    var markerId = opt.markerId || "markerX";
    return {
      renderMode,
      content: "{" + markerId + "|}  ",
      style: type === "subItem" ? {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: color
      } : {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: color
      }
    };
  }
}
function formatTime(tpl, value, isUTC) {
  if (true) {
    deprecateReplaceLog("echarts.format.formatTime", "echarts.time.format");
  }
  if (tpl === "week" || tpl === "month" || tpl === "quarter" || tpl === "half-year" || tpl === "year") {
    tpl = "MM-dd\nyyyy";
  }
  var date = parseDate(value);
  var getUTC = isUTC ? "getUTC" : "get";
  var y = date[getUTC + "FullYear"]();
  var M = date[getUTC + "Month"]() + 1;
  var d = date[getUTC + "Date"]();
  var h = date[getUTC + "Hours"]();
  var m2 = date[getUTC + "Minutes"]();
  var s = date[getUTC + "Seconds"]();
  var S = date[getUTC + "Milliseconds"]();
  tpl = tpl.replace("MM", pad(M, 2)).replace("M", M).replace("yyyy", y).replace("yy", pad(y % 100 + "", 2)).replace("dd", pad(d, 2)).replace("d", d).replace("hh", pad(h, 2)).replace("h", h).replace("mm", pad(m2, 2)).replace("m", m2).replace("ss", pad(s, 2)).replace("s", s).replace("SSS", pad(S, 3));
  return tpl;
}
function capitalFirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.substr(1) : str;
}
function convertToColorString(color, defaultColor) {
  defaultColor = defaultColor || "transparent";
  return isString(color) ? color : isObject(color) ? color.colorStops && (color.colorStops[0] || {}).color || defaultColor : defaultColor;
}
function windowOpen(link, target) {
  if (target === "_blank" || target === "blank") {
    var blank = window.open();
    blank.opener = null;
    blank.location.href = link;
  } else {
    window.open(link, target);
  }
}

// node_modules/echarts/lib/util/layout.js
var each2 = each;
var LOCATION_PARAMS = ["left", "right", "top", "bottom", "width", "height"];
var HV_NAMES = [["width", "left", "right"], ["height", "top", "bottom"]];
function boxLayout(orient, group, gap, maxWidth, maxHeight) {
  var x = 0;
  var y = 0;
  if (maxWidth == null) {
    maxWidth = Infinity;
  }
  if (maxHeight == null) {
    maxHeight = Infinity;
  }
  var currentLineMaxSize = 0;
  group.eachChild(function(child, idx) {
    var rect = child.getBoundingRect();
    var nextChild = group.childAt(idx + 1);
    var nextChildRect = nextChild && nextChild.getBoundingRect();
    var nextX;
    var nextY;
    if (orient === "horizontal") {
      var moveX = rect.width + (nextChildRect ? -nextChildRect.x + rect.x : 0);
      nextX = x + moveX;
      if (nextX > maxWidth || child.newline) {
        x = 0;
        nextX = moveX;
        y += currentLineMaxSize + gap;
        currentLineMaxSize = rect.height;
      } else {
        currentLineMaxSize = Math.max(currentLineMaxSize, rect.height);
      }
    } else {
      var moveY = rect.height + (nextChildRect ? -nextChildRect.y + rect.y : 0);
      nextY = y + moveY;
      if (nextY > maxHeight || child.newline) {
        x += currentLineMaxSize + gap;
        y = 0;
        nextY = moveY;
        currentLineMaxSize = rect.width;
      } else {
        currentLineMaxSize = Math.max(currentLineMaxSize, rect.width);
      }
    }
    if (child.newline) {
      return;
    }
    child.x = x;
    child.y = y;
    child.markRedraw();
    orient === "horizontal" ? x = nextX + gap : y = nextY + gap;
  });
}
var box = boxLayout;
var vbox = curry(boxLayout, "vertical");
var hbox = curry(boxLayout, "horizontal");
function getAvailableSize(positionInfo, containerRect, margin) {
  var containerWidth = containerRect.width;
  var containerHeight = containerRect.height;
  var x = parsePercent2(positionInfo.left, containerWidth);
  var y = parsePercent2(positionInfo.top, containerHeight);
  var x2 = parsePercent2(positionInfo.right, containerWidth);
  var y2 = parsePercent2(positionInfo.bottom, containerHeight);
  (isNaN(x) || isNaN(parseFloat(positionInfo.left))) && (x = 0);
  (isNaN(x2) || isNaN(parseFloat(positionInfo.right))) && (x2 = containerWidth);
  (isNaN(y) || isNaN(parseFloat(positionInfo.top))) && (y = 0);
  (isNaN(y2) || isNaN(parseFloat(positionInfo.bottom))) && (y2 = containerHeight);
  margin = normalizeCssArray2(margin || 0);
  return {
    width: Math.max(x2 - x - margin[1] - margin[3], 0),
    height: Math.max(y2 - y - margin[0] - margin[2], 0)
  };
}
function getLayoutRect(positionInfo, containerRect, margin) {
  margin = normalizeCssArray2(margin || 0);
  var containerWidth = containerRect.width;
  var containerHeight = containerRect.height;
  var left = parsePercent2(positionInfo.left, containerWidth);
  var top = parsePercent2(positionInfo.top, containerHeight);
  var right = parsePercent2(positionInfo.right, containerWidth);
  var bottom = parsePercent2(positionInfo.bottom, containerHeight);
  var width = parsePercent2(positionInfo.width, containerWidth);
  var height = parsePercent2(positionInfo.height, containerHeight);
  var verticalMargin = margin[2] + margin[0];
  var horizontalMargin = margin[1] + margin[3];
  var aspect = positionInfo.aspect;
  if (isNaN(width)) {
    width = containerWidth - right - horizontalMargin - left;
  }
  if (isNaN(height)) {
    height = containerHeight - bottom - verticalMargin - top;
  }
  if (aspect != null) {
    if (isNaN(width) && isNaN(height)) {
      if (aspect > containerWidth / containerHeight) {
        width = containerWidth * 0.8;
      } else {
        height = containerHeight * 0.8;
      }
    }
    if (isNaN(width)) {
      width = aspect * height;
    }
    if (isNaN(height)) {
      height = width / aspect;
    }
  }
  if (isNaN(left)) {
    left = containerWidth - right - width - horizontalMargin;
  }
  if (isNaN(top)) {
    top = containerHeight - bottom - height - verticalMargin;
  }
  switch (positionInfo.left || positionInfo.right) {
    case "center":
      left = containerWidth / 2 - width / 2 - margin[3];
      break;
    case "right":
      left = containerWidth - width - horizontalMargin;
      break;
  }
  switch (positionInfo.top || positionInfo.bottom) {
    case "middle":
    case "center":
      top = containerHeight / 2 - height / 2 - margin[0];
      break;
    case "bottom":
      top = containerHeight - height - verticalMargin;
      break;
  }
  left = left || 0;
  top = top || 0;
  if (isNaN(width)) {
    width = containerWidth - horizontalMargin - left - (right || 0);
  }
  if (isNaN(height)) {
    height = containerHeight - verticalMargin - top - (bottom || 0);
  }
  var rect = new BoundingRect_default(left + margin[3], top + margin[0], width, height);
  rect.margin = margin;
  return rect;
}
function positionElement(el, positionInfo, containerRect, margin, opt, out2) {
  var h = !opt || !opt.hv || opt.hv[0];
  var v = !opt || !opt.hv || opt.hv[1];
  var boundingMode = opt && opt.boundingMode || "all";
  out2 = out2 || el;
  out2.x = el.x;
  out2.y = el.y;
  if (!h && !v) {
    return false;
  }
  var rect;
  if (boundingMode === "raw") {
    rect = el.type === "group" ? new BoundingRect_default(0, 0, +positionInfo.width || 0, +positionInfo.height || 0) : el.getBoundingRect();
  } else {
    rect = el.getBoundingRect();
    if (el.needLocalTransform()) {
      var transform = el.getLocalTransform();
      rect = rect.clone();
      rect.applyTransform(transform);
    }
  }
  var layoutRect = getLayoutRect(defaults({
    width: rect.width,
    height: rect.height
  }, positionInfo), containerRect, margin);
  var dx = h ? layoutRect.x - rect.x : 0;
  var dy = v ? layoutRect.y - rect.y : 0;
  if (boundingMode === "raw") {
    out2.x = dx;
    out2.y = dy;
  } else {
    out2.x += dx;
    out2.y += dy;
  }
  if (out2 === el) {
    el.markRedraw();
  }
  return true;
}
function sizeCalculable(option, hvIdx) {
  return option[HV_NAMES[hvIdx][0]] != null || option[HV_NAMES[hvIdx][1]] != null && option[HV_NAMES[hvIdx][2]] != null;
}
function fetchLayoutMode(ins) {
  var layoutMode = ins.layoutMode || ins.constructor.layoutMode;
  return isObject(layoutMode) ? layoutMode : layoutMode ? {
    type: layoutMode
  } : null;
}
function mergeLayoutParam(targetOption, newOption, opt) {
  var ignoreSize = opt && opt.ignoreSize;
  !isArray(ignoreSize) && (ignoreSize = [ignoreSize, ignoreSize]);
  var hResult = merge2(HV_NAMES[0], 0);
  var vResult = merge2(HV_NAMES[1], 1);
  copy3(HV_NAMES[0], targetOption, hResult);
  copy3(HV_NAMES[1], targetOption, vResult);
  function merge2(names, hvIdx) {
    var newParams = {};
    var newValueCount = 0;
    var merged = {};
    var mergedValueCount = 0;
    var enoughParamNumber = 2;
    each2(names, function(name) {
      merged[name] = targetOption[name];
    });
    each2(names, function(name) {
      hasProp(newOption, name) && (newParams[name] = merged[name] = newOption[name]);
      hasValue(newParams, name) && newValueCount++;
      hasValue(merged, name) && mergedValueCount++;
    });
    if (ignoreSize[hvIdx]) {
      if (hasValue(newOption, names[1])) {
        merged[names[2]] = null;
      } else if (hasValue(newOption, names[2])) {
        merged[names[1]] = null;
      }
      return merged;
    }
    if (mergedValueCount === enoughParamNumber || !newValueCount) {
      return merged;
    } else if (newValueCount >= enoughParamNumber) {
      return newParams;
    } else {
      for (var i = 0; i < names.length; i++) {
        var name_1 = names[i];
        if (!hasProp(newParams, name_1) && hasProp(targetOption, name_1)) {
          newParams[name_1] = targetOption[name_1];
          break;
        }
      }
      return newParams;
    }
  }
  function hasProp(obj, name) {
    return obj.hasOwnProperty(name);
  }
  function hasValue(obj, name) {
    return obj[name] != null && obj[name] !== "auto";
  }
  function copy3(names, target, source) {
    each2(names, function(name) {
      target[name] = source[name];
    });
  }
}
function getLayoutParams(source) {
  return copyLayoutParams({}, source);
}
function copyLayoutParams(target, source) {
  source && target && each2(LOCATION_PARAMS, function(name) {
    source.hasOwnProperty(name) && (target[name] = source[name]);
  });
  return target;
}

// node_modules/echarts/lib/model/Component.js
var inner = makeInner();
var ComponentModel = (
  /** @class */
  function(_super) {
    __extends(ComponentModel2, _super);
    function ComponentModel2(option, parentModel, ecModel) {
      var _this = _super.call(this, option, parentModel, ecModel) || this;
      _this.uid = getUID("ec_cpt_model");
      return _this;
    }
    ComponentModel2.prototype.init = function(option, parentModel, ecModel) {
      this.mergeDefaultAndTheme(option, ecModel);
    };
    ComponentModel2.prototype.mergeDefaultAndTheme = function(option, ecModel) {
      var layoutMode = fetchLayoutMode(this);
      var inputPositionParams = layoutMode ? getLayoutParams(option) : {};
      var themeModel = ecModel.getTheme();
      merge(option, themeModel.get(this.mainType));
      merge(option, this.getDefaultOption());
      if (layoutMode) {
        mergeLayoutParam(option, inputPositionParams, layoutMode);
      }
    };
    ComponentModel2.prototype.mergeOption = function(option, ecModel) {
      merge(this.option, option, true);
      var layoutMode = fetchLayoutMode(this);
      if (layoutMode) {
        mergeLayoutParam(this.option, option, layoutMode);
      }
    };
    ComponentModel2.prototype.optionUpdated = function(newCptOption, isInit) {
    };
    ComponentModel2.prototype.getDefaultOption = function() {
      var ctor = this.constructor;
      if (!isExtendedClass(ctor)) {
        return ctor.defaultOption;
      }
      var fields = inner(this);
      if (!fields.defaultOption) {
        var optList = [];
        var clz = ctor;
        while (clz) {
          var opt = clz.prototype.defaultOption;
          opt && optList.push(opt);
          clz = clz.superClass;
        }
        var defaultOption2 = {};
        for (var i = optList.length - 1; i >= 0; i--) {
          defaultOption2 = merge(defaultOption2, optList[i], true);
        }
        fields.defaultOption = defaultOption2;
      }
      return fields.defaultOption;
    };
    ComponentModel2.prototype.getReferringComponents = function(mainType, opt) {
      var indexKey = mainType + "Index";
      var idKey = mainType + "Id";
      return queryReferringComponents(this.ecModel, mainType, {
        index: this.get(indexKey, true),
        id: this.get(idKey, true)
      }, opt);
    };
    ComponentModel2.prototype.getBoxLayoutParams = function() {
      var boxLayoutModel = this;
      return {
        left: boxLayoutModel.get("left"),
        top: boxLayoutModel.get("top"),
        right: boxLayoutModel.get("right"),
        bottom: boxLayoutModel.get("bottom"),
        width: boxLayoutModel.get("width"),
        height: boxLayoutModel.get("height")
      };
    };
    ComponentModel2.prototype.getZLevelKey = function() {
      return "";
    };
    ComponentModel2.prototype.setZLevel = function(zlevel) {
      this.option.zlevel = zlevel;
    };
    ComponentModel2.protoInitialize = function() {
      var proto2 = ComponentModel2.prototype;
      proto2.type = "component";
      proto2.id = "";
      proto2.name = "";
      proto2.mainType = "";
      proto2.subType = "";
      proto2.componentIndex = 0;
    }();
    return ComponentModel2;
  }(Model_default)
);
mountExtend(ComponentModel, Model_default);
enableClassManagement(ComponentModel);
enableSubTypeDefaulter(ComponentModel);
enableTopologicalTravel(ComponentModel, getDependencies);
function getDependencies(componentType) {
  var deps = [];
  each(ComponentModel.getClassesByMainType(componentType), function(clz) {
    deps = deps.concat(clz.dependencies || clz.prototype.dependencies || []);
  });
  deps = map(deps, function(type) {
    return parseClassType(type).main;
  });
  if (componentType !== "dataset" && indexOf(deps, "dataset") <= 0) {
    deps.unshift("dataset");
  }
  return deps;
}
var Component_default = ComponentModel;

// node_modules/echarts/lib/model/mixin/palette.js
var innerColor = makeInner();
var innerDecal = makeInner();
var PaletteMixin = (
  /** @class */
  function() {
    function PaletteMixin2() {
    }
    PaletteMixin2.prototype.getColorFromPalette = function(name, scope, requestNum) {
      var defaultPalette = normalizeToArray(this.get("color", true));
      var layeredPalette = this.get("colorLayer", true);
      return getFromPalette(this, innerColor, defaultPalette, layeredPalette, name, scope, requestNum);
    };
    PaletteMixin2.prototype.clearColorPalette = function() {
      clearPalette(this, innerColor);
    };
    return PaletteMixin2;
  }()
);
function getDecalFromPalette(ecModel, name, scope, requestNum) {
  var defaultDecals = normalizeToArray(ecModel.get(["aria", "decal", "decals"]));
  return getFromPalette(ecModel, innerDecal, defaultDecals, null, name, scope, requestNum);
}
function getNearestPalette(palettes, requestColorNum) {
  var paletteNum = palettes.length;
  for (var i = 0; i < paletteNum; i++) {
    if (palettes[i].length > requestColorNum) {
      return palettes[i];
    }
  }
  return palettes[paletteNum - 1];
}
function getFromPalette(that, inner8, defaultPalette, layeredPalette, name, scope, requestNum) {
  scope = scope || that;
  var scopeFields = inner8(scope);
  var paletteIdx = scopeFields.paletteIdx || 0;
  var paletteNameMap = scopeFields.paletteNameMap = scopeFields.paletteNameMap || {};
  if (paletteNameMap.hasOwnProperty(name)) {
    return paletteNameMap[name];
  }
  var palette = requestNum == null || !layeredPalette ? defaultPalette : getNearestPalette(layeredPalette, requestNum);
  palette = palette || defaultPalette;
  if (!palette || !palette.length) {
    return;
  }
  var pickedPaletteItem = palette[paletteIdx];
  if (name) {
    paletteNameMap[name] = pickedPaletteItem;
  }
  scopeFields.paletteIdx = (paletteIdx + 1) % palette.length;
  return pickedPaletteItem;
}
function clearPalette(that, inner8) {
  inner8(that).paletteIdx = 0;
  inner8(that).paletteNameMap = {};
}

// node_modules/echarts/lib/util/types.js
var VISUAL_DIMENSIONS = createHashMap(["tooltip", "label", "itemName", "itemId", "itemGroupId", "seriesName"]);
var SOURCE_FORMAT_ORIGINAL = "original";
var SOURCE_FORMAT_ARRAY_ROWS = "arrayRows";
var SOURCE_FORMAT_OBJECT_ROWS = "objectRows";
var SOURCE_FORMAT_KEYED_COLUMNS = "keyedColumns";
var SOURCE_FORMAT_TYPED_ARRAY = "typedArray";
var SOURCE_FORMAT_UNKNOWN = "unknown";
var SERIES_LAYOUT_BY_COLUMN = "column";
var SERIES_LAYOUT_BY_ROW = "row";

// node_modules/echarts/lib/data/helper/sourceHelper.js
var BE_ORDINAL = {
  Must: 1,
  Might: 2,
  Not: 3
  // Other cases
};
var innerGlobalModel = makeInner();
function resetSourceDefaulter(ecModel) {
  innerGlobalModel(ecModel).datasetMap = createHashMap();
}
function makeSeriesEncodeForAxisCoordSys(coordDimensions, seriesModel, source) {
  var encode = {};
  var datasetModel = querySeriesUpstreamDatasetModel(seriesModel);
  if (!datasetModel || !coordDimensions) {
    return encode;
  }
  var encodeItemName = [];
  var encodeSeriesName = [];
  var ecModel = seriesModel.ecModel;
  var datasetMap = innerGlobalModel(ecModel).datasetMap;
  var key = datasetModel.uid + "_" + source.seriesLayoutBy;
  var baseCategoryDimIndex;
  var categoryWayValueDimStart;
  coordDimensions = coordDimensions.slice();
  each(coordDimensions, function(coordDimInfoLoose, coordDimIdx) {
    var coordDimInfo = isObject(coordDimInfoLoose) ? coordDimInfoLoose : coordDimensions[coordDimIdx] = {
      name: coordDimInfoLoose
    };
    if (coordDimInfo.type === "ordinal" && baseCategoryDimIndex == null) {
      baseCategoryDimIndex = coordDimIdx;
      categoryWayValueDimStart = getDataDimCountOnCoordDim(coordDimInfo);
    }
    encode[coordDimInfo.name] = [];
  });
  var datasetRecord = datasetMap.get(key) || datasetMap.set(key, {
    categoryWayDim: categoryWayValueDimStart,
    valueWayDim: 0
  });
  each(coordDimensions, function(coordDimInfo, coordDimIdx) {
    var coordDimName = coordDimInfo.name;
    var count = getDataDimCountOnCoordDim(coordDimInfo);
    if (baseCategoryDimIndex == null) {
      var start = datasetRecord.valueWayDim;
      pushDim(encode[coordDimName], start, count);
      pushDim(encodeSeriesName, start, count);
      datasetRecord.valueWayDim += count;
    } else if (baseCategoryDimIndex === coordDimIdx) {
      pushDim(encode[coordDimName], 0, count);
      pushDim(encodeItemName, 0, count);
    } else {
      var start = datasetRecord.categoryWayDim;
      pushDim(encode[coordDimName], start, count);
      pushDim(encodeSeriesName, start, count);
      datasetRecord.categoryWayDim += count;
    }
  });
  function pushDim(dimIdxArr, idxFrom, idxCount) {
    for (var i = 0; i < idxCount; i++) {
      dimIdxArr.push(idxFrom + i);
    }
  }
  function getDataDimCountOnCoordDim(coordDimInfo) {
    var dimsDef = coordDimInfo.dimsDef;
    return dimsDef ? dimsDef.length : 1;
  }
  encodeItemName.length && (encode.itemName = encodeItemName);
  encodeSeriesName.length && (encode.seriesName = encodeSeriesName);
  return encode;
}
function makeSeriesEncodeForNameBased(seriesModel, source, dimCount) {
  var encode = {};
  var datasetModel = querySeriesUpstreamDatasetModel(seriesModel);
  if (!datasetModel) {
    return encode;
  }
  var sourceFormat = source.sourceFormat;
  var dimensionsDefine = source.dimensionsDefine;
  var potentialNameDimIndex;
  if (sourceFormat === SOURCE_FORMAT_OBJECT_ROWS || sourceFormat === SOURCE_FORMAT_KEYED_COLUMNS) {
    each(dimensionsDefine, function(dim, idx) {
      if ((isObject(dim) ? dim.name : dim) === "name") {
        potentialNameDimIndex = idx;
      }
    });
  }
  var idxResult = function() {
    var idxRes0 = {};
    var idxRes1 = {};
    var guessRecords = [];
    for (var i = 0, len = Math.min(5, dimCount); i < len; i++) {
      var guessResult = doGuessOrdinal(source.data, sourceFormat, source.seriesLayoutBy, dimensionsDefine, source.startIndex, i);
      guessRecords.push(guessResult);
      var isPureNumber = guessResult === BE_ORDINAL.Not;
      if (isPureNumber && idxRes0.v == null && i !== potentialNameDimIndex) {
        idxRes0.v = i;
      }
      if (idxRes0.n == null || idxRes0.n === idxRes0.v || !isPureNumber && guessRecords[idxRes0.n] === BE_ORDINAL.Not) {
        idxRes0.n = i;
      }
      if (fulfilled(idxRes0) && guessRecords[idxRes0.n] !== BE_ORDINAL.Not) {
        return idxRes0;
      }
      if (!isPureNumber) {
        if (guessResult === BE_ORDINAL.Might && idxRes1.v == null && i !== potentialNameDimIndex) {
          idxRes1.v = i;
        }
        if (idxRes1.n == null || idxRes1.n === idxRes1.v) {
          idxRes1.n = i;
        }
      }
    }
    function fulfilled(idxResult2) {
      return idxResult2.v != null && idxResult2.n != null;
    }
    return fulfilled(idxRes0) ? idxRes0 : fulfilled(idxRes1) ? idxRes1 : null;
  }();
  if (idxResult) {
    encode.value = [idxResult.v];
    var nameDimIndex = potentialNameDimIndex != null ? potentialNameDimIndex : idxResult.n;
    encode.itemName = [nameDimIndex];
    encode.seriesName = [nameDimIndex];
  }
  return encode;
}
function querySeriesUpstreamDatasetModel(seriesModel) {
  var thisData = seriesModel.get("data", true);
  if (!thisData) {
    return queryReferringComponents(seriesModel.ecModel, "dataset", {
      index: seriesModel.get("datasetIndex", true),
      id: seriesModel.get("datasetId", true)
    }, SINGLE_REFERRING).models[0];
  }
}
function queryDatasetUpstreamDatasetModels(datasetModel) {
  if (!datasetModel.get("transform", true) && !datasetModel.get("fromTransformResult", true)) {
    return [];
  }
  return queryReferringComponents(datasetModel.ecModel, "dataset", {
    index: datasetModel.get("fromDatasetIndex", true),
    id: datasetModel.get("fromDatasetId", true)
  }, SINGLE_REFERRING).models;
}
function guessOrdinal(source, dimIndex) {
  return doGuessOrdinal(source.data, source.sourceFormat, source.seriesLayoutBy, source.dimensionsDefine, source.startIndex, dimIndex);
}
function doGuessOrdinal(data, sourceFormat, seriesLayoutBy, dimensionsDefine, startIndex, dimIndex) {
  var result;
  var maxLoop = 5;
  if (isTypedArray(data)) {
    return BE_ORDINAL.Not;
  }
  var dimName;
  var dimType;
  if (dimensionsDefine) {
    var dimDefItem = dimensionsDefine[dimIndex];
    if (isObject(dimDefItem)) {
      dimName = dimDefItem.name;
      dimType = dimDefItem.type;
    } else if (isString(dimDefItem)) {
      dimName = dimDefItem;
    }
  }
  if (dimType != null) {
    return dimType === "ordinal" ? BE_ORDINAL.Must : BE_ORDINAL.Not;
  }
  if (sourceFormat === SOURCE_FORMAT_ARRAY_ROWS) {
    var dataArrayRows = data;
    if (seriesLayoutBy === SERIES_LAYOUT_BY_ROW) {
      var sample = dataArrayRows[dimIndex];
      for (var i = 0; i < (sample || []).length && i < maxLoop; i++) {
        if ((result = detectValue(sample[startIndex + i])) != null) {
          return result;
        }
      }
    } else {
      for (var i = 0; i < dataArrayRows.length && i < maxLoop; i++) {
        var row = dataArrayRows[startIndex + i];
        if (row && (result = detectValue(row[dimIndex])) != null) {
          return result;
        }
      }
    }
  } else if (sourceFormat === SOURCE_FORMAT_OBJECT_ROWS) {
    var dataObjectRows = data;
    if (!dimName) {
      return BE_ORDINAL.Not;
    }
    for (var i = 0; i < dataObjectRows.length && i < maxLoop; i++) {
      var item = dataObjectRows[i];
      if (item && (result = detectValue(item[dimName])) != null) {
        return result;
      }
    }
  } else if (sourceFormat === SOURCE_FORMAT_KEYED_COLUMNS) {
    var dataKeyedColumns = data;
    if (!dimName) {
      return BE_ORDINAL.Not;
    }
    var sample = dataKeyedColumns[dimName];
    if (!sample || isTypedArray(sample)) {
      return BE_ORDINAL.Not;
    }
    for (var i = 0; i < sample.length && i < maxLoop; i++) {
      if ((result = detectValue(sample[i])) != null) {
        return result;
      }
    }
  } else if (sourceFormat === SOURCE_FORMAT_ORIGINAL) {
    var dataOriginal = data;
    for (var i = 0; i < dataOriginal.length && i < maxLoop; i++) {
      var item = dataOriginal[i];
      var val = getDataItemValue(item);
      if (!isArray(val)) {
        return BE_ORDINAL.Not;
      }
      if ((result = detectValue(val[dimIndex])) != null) {
        return result;
      }
    }
  }
  function detectValue(val2) {
    var beStr = isString(val2);
    if (val2 != null && isFinite(val2) && val2 !== "") {
      return beStr ? BE_ORDINAL.Might : BE_ORDINAL.Not;
    } else if (beStr && val2 !== "-") {
      return BE_ORDINAL.Must;
    }
  }
  return BE_ORDINAL.Not;
}

// node_modules/echarts/lib/data/Source.js
var SourceImpl = (
  /** @class */
  function() {
    function SourceImpl2(fields) {
      this.data = fields.data || (fields.sourceFormat === SOURCE_FORMAT_KEYED_COLUMNS ? {} : []);
      this.sourceFormat = fields.sourceFormat || SOURCE_FORMAT_UNKNOWN;
      this.seriesLayoutBy = fields.seriesLayoutBy || SERIES_LAYOUT_BY_COLUMN;
      this.startIndex = fields.startIndex || 0;
      this.dimensionsDetectedCount = fields.dimensionsDetectedCount;
      this.metaRawOption = fields.metaRawOption;
      var dimensionsDefine = this.dimensionsDefine = fields.dimensionsDefine;
      if (dimensionsDefine) {
        for (var i = 0; i < dimensionsDefine.length; i++) {
          var dim = dimensionsDefine[i];
          if (dim.type == null) {
            if (guessOrdinal(this, i) === BE_ORDINAL.Must) {
              dim.type = "ordinal";
            }
          }
        }
      }
    }
    return SourceImpl2;
  }()
);
function isSourceInstance(val) {
  return val instanceof SourceImpl;
}
function createSource(sourceData, thisMetaRawOption, sourceFormat) {
  sourceFormat = sourceFormat || detectSourceFormat(sourceData);
  var seriesLayoutBy = thisMetaRawOption.seriesLayoutBy;
  var determined = determineSourceDimensions(sourceData, sourceFormat, seriesLayoutBy, thisMetaRawOption.sourceHeader, thisMetaRawOption.dimensions);
  var source = new SourceImpl({
    data: sourceData,
    sourceFormat,
    seriesLayoutBy,
    dimensionsDefine: determined.dimensionsDefine,
    startIndex: determined.startIndex,
    dimensionsDetectedCount: determined.dimensionsDetectedCount,
    metaRawOption: clone(thisMetaRawOption)
  });
  return source;
}
function createSourceFromSeriesDataOption(data) {
  return new SourceImpl({
    data,
    sourceFormat: isTypedArray(data) ? SOURCE_FORMAT_TYPED_ARRAY : SOURCE_FORMAT_ORIGINAL
  });
}
function cloneSourceShallow(source) {
  return new SourceImpl({
    data: source.data,
    sourceFormat: source.sourceFormat,
    seriesLayoutBy: source.seriesLayoutBy,
    dimensionsDefine: clone(source.dimensionsDefine),
    startIndex: source.startIndex,
    dimensionsDetectedCount: source.dimensionsDetectedCount
  });
}
function detectSourceFormat(data) {
  var sourceFormat = SOURCE_FORMAT_UNKNOWN;
  if (isTypedArray(data)) {
    sourceFormat = SOURCE_FORMAT_TYPED_ARRAY;
  } else if (isArray(data)) {
    if (data.length === 0) {
      sourceFormat = SOURCE_FORMAT_ARRAY_ROWS;
    }
    for (var i = 0, len = data.length; i < len; i++) {
      var item = data[i];
      if (item == null) {
        continue;
      } else if (isArray(item)) {
        sourceFormat = SOURCE_FORMAT_ARRAY_ROWS;
        break;
      } else if (isObject(item)) {
        sourceFormat = SOURCE_FORMAT_OBJECT_ROWS;
        break;
      }
    }
  } else if (isObject(data)) {
    for (var key in data) {
      if (hasOwn(data, key) && isArrayLike(data[key])) {
        sourceFormat = SOURCE_FORMAT_KEYED_COLUMNS;
        break;
      }
    }
  }
  return sourceFormat;
}
function determineSourceDimensions(data, sourceFormat, seriesLayoutBy, sourceHeader, dimensionsDefine) {
  var dimensionsDetectedCount;
  var startIndex;
  if (!data) {
    return {
      dimensionsDefine: normalizeDimensionsOption(dimensionsDefine),
      startIndex,
      dimensionsDetectedCount
    };
  }
  if (sourceFormat === SOURCE_FORMAT_ARRAY_ROWS) {
    var dataArrayRows = data;
    if (sourceHeader === "auto" || sourceHeader == null) {
      arrayRowsTravelFirst(function(val) {
        if (val != null && val !== "-") {
          if (isString(val)) {
            startIndex == null && (startIndex = 1);
          } else {
            startIndex = 0;
          }
        }
      }, seriesLayoutBy, dataArrayRows, 10);
    } else {
      startIndex = isNumber(sourceHeader) ? sourceHeader : sourceHeader ? 1 : 0;
    }
    if (!dimensionsDefine && startIndex === 1) {
      dimensionsDefine = [];
      arrayRowsTravelFirst(function(val, index) {
        dimensionsDefine[index] = val != null ? val + "" : "";
      }, seriesLayoutBy, dataArrayRows, Infinity);
    }
    dimensionsDetectedCount = dimensionsDefine ? dimensionsDefine.length : seriesLayoutBy === SERIES_LAYOUT_BY_ROW ? dataArrayRows.length : dataArrayRows[0] ? dataArrayRows[0].length : null;
  } else if (sourceFormat === SOURCE_FORMAT_OBJECT_ROWS) {
    if (!dimensionsDefine) {
      dimensionsDefine = objectRowsCollectDimensions(data);
    }
  } else if (sourceFormat === SOURCE_FORMAT_KEYED_COLUMNS) {
    if (!dimensionsDefine) {
      dimensionsDefine = [];
      each(data, function(colArr, key) {
        dimensionsDefine.push(key);
      });
    }
  } else if (sourceFormat === SOURCE_FORMAT_ORIGINAL) {
    var value0 = getDataItemValue(data[0]);
    dimensionsDetectedCount = isArray(value0) && value0.length || 1;
  } else if (sourceFormat === SOURCE_FORMAT_TYPED_ARRAY) {
    if (true) {
      assert(!!dimensionsDefine, "dimensions must be given if data is TypedArray.");
    }
  }
  return {
    startIndex,
    dimensionsDefine: normalizeDimensionsOption(dimensionsDefine),
    dimensionsDetectedCount
  };
}
function objectRowsCollectDimensions(data) {
  var firstIndex = 0;
  var obj;
  while (firstIndex < data.length && !(obj = data[firstIndex++])) {
  }
  if (obj) {
    return keys(obj);
  }
}
function normalizeDimensionsOption(dimensionsDefine) {
  if (!dimensionsDefine) {
    return;
  }
  var nameMap = createHashMap();
  return map(dimensionsDefine, function(rawItem, index) {
    rawItem = isObject(rawItem) ? rawItem : {
      name: rawItem
    };
    var item = {
      name: rawItem.name,
      displayName: rawItem.displayName,
      type: rawItem.type
    };
    if (item.name == null) {
      return item;
    }
    item.name += "";
    if (item.displayName == null) {
      item.displayName = item.name;
    }
    var exist = nameMap.get(item.name);
    if (!exist) {
      nameMap.set(item.name, {
        count: 1
      });
    } else {
      item.name += "-" + exist.count++;
    }
    return item;
  });
}
function arrayRowsTravelFirst(cb, seriesLayoutBy, data, maxLoop) {
  if (seriesLayoutBy === SERIES_LAYOUT_BY_ROW) {
    for (var i = 0; i < data.length && i < maxLoop; i++) {
      cb(data[i] ? data[i][0] : null, i);
    }
  } else {
    var value0 = data[0] || [];
    for (var i = 0; i < value0.length && i < maxLoop; i++) {
      cb(value0[i], i);
    }
  }
}
function shouldRetrieveDataByName(source) {
  var sourceFormat = source.sourceFormat;
  return sourceFormat === SOURCE_FORMAT_OBJECT_ROWS || sourceFormat === SOURCE_FORMAT_KEYED_COLUMNS;
}

// node_modules/echarts/lib/data/helper/dataProvider.js
var _a;
var _b;
var _c;
var providerMethods;
var mountMethods;
var DefaultDataProvider = (
  /** @class */
  function() {
    function DefaultDataProvider2(sourceParam, dimSize) {
      var source = !isSourceInstance(sourceParam) ? createSourceFromSeriesDataOption(sourceParam) : sourceParam;
      this._source = source;
      var data = this._data = source.data;
      if (source.sourceFormat === SOURCE_FORMAT_TYPED_ARRAY) {
        if (true) {
          if (dimSize == null) {
            throw new Error("Typed array data must specify dimension size");
          }
        }
        this._offset = 0;
        this._dimSize = dimSize;
        this._data = data;
      }
      mountMethods(this, data, source);
    }
    DefaultDataProvider2.prototype.getSource = function() {
      return this._source;
    };
    DefaultDataProvider2.prototype.count = function() {
      return 0;
    };
    DefaultDataProvider2.prototype.getItem = function(idx, out2) {
      return;
    };
    DefaultDataProvider2.prototype.appendData = function(newData) {
    };
    DefaultDataProvider2.prototype.clean = function() {
    };
    DefaultDataProvider2.protoInitialize = function() {
      var proto2 = DefaultDataProvider2.prototype;
      proto2.pure = false;
      proto2.persistent = true;
    }();
    DefaultDataProvider2.internalField = function() {
      var _a2;
      mountMethods = function(provider, data, source) {
        var sourceFormat = source.sourceFormat;
        var seriesLayoutBy = source.seriesLayoutBy;
        var startIndex = source.startIndex;
        var dimsDef = source.dimensionsDefine;
        var methods = providerMethods[getMethodMapKey(sourceFormat, seriesLayoutBy)];
        if (true) {
          assert(methods, "Invalide sourceFormat: " + sourceFormat);
        }
        extend(provider, methods);
        if (sourceFormat === SOURCE_FORMAT_TYPED_ARRAY) {
          provider.getItem = getItemForTypedArray;
          provider.count = countForTypedArray;
          provider.fillStorage = fillStorageForTypedArray;
        } else {
          var rawItemGetter = getRawSourceItemGetter(sourceFormat, seriesLayoutBy);
          provider.getItem = bind(rawItemGetter, null, data, startIndex, dimsDef);
          var rawCounter = getRawSourceDataCounter(sourceFormat, seriesLayoutBy);
          provider.count = bind(rawCounter, null, data, startIndex, dimsDef);
        }
      };
      var getItemForTypedArray = function(idx, out2) {
        idx = idx - this._offset;
        out2 = out2 || [];
        var data = this._data;
        var dimSize = this._dimSize;
        var offset = dimSize * idx;
        for (var i = 0; i < dimSize; i++) {
          out2[i] = data[offset + i];
        }
        return out2;
      };
      var fillStorageForTypedArray = function(start, end, storage2, extent3) {
        var data = this._data;
        var dimSize = this._dimSize;
        for (var dim = 0; dim < dimSize; dim++) {
          var dimExtent = extent3[dim];
          var min2 = dimExtent[0] == null ? Infinity : dimExtent[0];
          var max2 = dimExtent[1] == null ? -Infinity : dimExtent[1];
          var count = end - start;
          var arr = storage2[dim];
          for (var i = 0; i < count; i++) {
            var val = data[i * dimSize + dim];
            arr[start + i] = val;
            val < min2 && (min2 = val);
            val > max2 && (max2 = val);
          }
          dimExtent[0] = min2;
          dimExtent[1] = max2;
        }
      };
      var countForTypedArray = function() {
        return this._data ? this._data.length / this._dimSize : 0;
      };
      providerMethods = (_a2 = {}, _a2[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_COLUMN] = {
        pure: true,
        appendData: appendDataSimply
      }, _a2[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_ROW] = {
        pure: true,
        appendData: function() {
          throw new Error('Do not support appendData when set seriesLayoutBy: "row".');
        }
      }, _a2[SOURCE_FORMAT_OBJECT_ROWS] = {
        pure: true,
        appendData: appendDataSimply
      }, _a2[SOURCE_FORMAT_KEYED_COLUMNS] = {
        pure: true,
        appendData: function(newData) {
          var data = this._data;
          each(newData, function(newCol, key) {
            var oldCol = data[key] || (data[key] = []);
            for (var i = 0; i < (newCol || []).length; i++) {
              oldCol.push(newCol[i]);
            }
          });
        }
      }, _a2[SOURCE_FORMAT_ORIGINAL] = {
        appendData: appendDataSimply
      }, _a2[SOURCE_FORMAT_TYPED_ARRAY] = {
        persistent: false,
        pure: true,
        appendData: function(newData) {
          if (true) {
            assert(isTypedArray(newData), "Added data must be TypedArray if data in initialization is TypedArray");
          }
          this._data = newData;
        },
        // Clean self if data is already used.
        clean: function() {
          this._offset += this.count();
          this._data = null;
        }
      }, _a2);
      function appendDataSimply(newData) {
        for (var i = 0; i < newData.length; i++) {
          this._data.push(newData[i]);
        }
      }
    }();
    return DefaultDataProvider2;
  }()
);
var getItemSimply = function(rawData, startIndex, dimsDef, idx) {
  return rawData[idx];
};
var rawSourceItemGetterMap = (_a = {}, _a[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_COLUMN] = function(rawData, startIndex, dimsDef, idx) {
  return rawData[idx + startIndex];
}, _a[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_ROW] = function(rawData, startIndex, dimsDef, idx, out2) {
  idx += startIndex;
  var item = out2 || [];
  var data = rawData;
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    item[i] = row ? row[idx] : null;
  }
  return item;
}, _a[SOURCE_FORMAT_OBJECT_ROWS] = getItemSimply, _a[SOURCE_FORMAT_KEYED_COLUMNS] = function(rawData, startIndex, dimsDef, idx, out2) {
  var item = out2 || [];
  for (var i = 0; i < dimsDef.length; i++) {
    var dimName = dimsDef[i].name;
    if (true) {
      if (dimName == null) {
        throw new Error();
      }
    }
    var col = rawData[dimName];
    item[i] = col ? col[idx] : null;
  }
  return item;
}, _a[SOURCE_FORMAT_ORIGINAL] = getItemSimply, _a);
function getRawSourceItemGetter(sourceFormat, seriesLayoutBy) {
  var method = rawSourceItemGetterMap[getMethodMapKey(sourceFormat, seriesLayoutBy)];
  if (true) {
    assert(method, 'Do not support get item on "' + sourceFormat + '", "' + seriesLayoutBy + '".');
  }
  return method;
}
var countSimply = function(rawData, startIndex, dimsDef) {
  return rawData.length;
};
var rawSourceDataCounterMap = (_b = {}, _b[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_COLUMN] = function(rawData, startIndex, dimsDef) {
  return Math.max(0, rawData.length - startIndex);
}, _b[SOURCE_FORMAT_ARRAY_ROWS + "_" + SERIES_LAYOUT_BY_ROW] = function(rawData, startIndex, dimsDef) {
  var row = rawData[0];
  return row ? Math.max(0, row.length - startIndex) : 0;
}, _b[SOURCE_FORMAT_OBJECT_ROWS] = countSimply, _b[SOURCE_FORMAT_KEYED_COLUMNS] = function(rawData, startIndex, dimsDef) {
  var dimName = dimsDef[0].name;
  if (true) {
    if (dimName == null) {
      throw new Error();
    }
  }
  var col = rawData[dimName];
  return col ? col.length : 0;
}, _b[SOURCE_FORMAT_ORIGINAL] = countSimply, _b);
function getRawSourceDataCounter(sourceFormat, seriesLayoutBy) {
  var method = rawSourceDataCounterMap[getMethodMapKey(sourceFormat, seriesLayoutBy)];
  if (true) {
    assert(method, 'Do not support count on "' + sourceFormat + '", "' + seriesLayoutBy + '".');
  }
  return method;
}
var getRawValueSimply = function(dataItem, dimIndex, property) {
  return dataItem[dimIndex];
};
var rawSourceValueGetterMap = (_c = {}, _c[SOURCE_FORMAT_ARRAY_ROWS] = getRawValueSimply, _c[SOURCE_FORMAT_OBJECT_ROWS] = function(dataItem, dimIndex, property) {
  return dataItem[property];
}, _c[SOURCE_FORMAT_KEYED_COLUMNS] = getRawValueSimply, _c[SOURCE_FORMAT_ORIGINAL] = function(dataItem, dimIndex, property) {
  var value = getDataItemValue(dataItem);
  return !(value instanceof Array) ? value : value[dimIndex];
}, _c[SOURCE_FORMAT_TYPED_ARRAY] = getRawValueSimply, _c);
function getRawSourceValueGetter(sourceFormat) {
  var method = rawSourceValueGetterMap[sourceFormat];
  if (true) {
    assert(method, 'Do not support get value on "' + sourceFormat + '".');
  }
  return method;
}
function getMethodMapKey(sourceFormat, seriesLayoutBy) {
  return sourceFormat === SOURCE_FORMAT_ARRAY_ROWS ? sourceFormat + "_" + seriesLayoutBy : sourceFormat;
}
function retrieveRawValue(data, dataIndex, dim) {
  if (!data) {
    return;
  }
  var dataItem = data.getRawDataItem(dataIndex);
  if (dataItem == null) {
    return;
  }
  var store = data.getStore();
  var sourceFormat = store.getSource().sourceFormat;
  if (dim != null) {
    var dimIndex = data.getDimensionIndex(dim);
    var property = store.getDimensionProperty(dimIndex);
    return getRawSourceValueGetter(sourceFormat)(dataItem, dimIndex, property);
  } else {
    var result = dataItem;
    if (sourceFormat === SOURCE_FORMAT_ORIGINAL) {
      result = getDataItemValue(dataItem);
    }
    return result;
  }
}

// node_modules/echarts/lib/model/mixin/dataFormat.js
var DIMENSION_LABEL_REG = /\{@(.+?)\}/g;
var DataFormatMixin = (
  /** @class */
  function() {
    function DataFormatMixin2() {
    }
    DataFormatMixin2.prototype.getDataParams = function(dataIndex, dataType) {
      var data = this.getData(dataType);
      var rawValue = this.getRawValue(dataIndex, dataType);
      var rawDataIndex = data.getRawIndex(dataIndex);
      var name = data.getName(dataIndex);
      var itemOpt = data.getRawDataItem(dataIndex);
      var style = data.getItemVisual(dataIndex, "style");
      var color = style && style[data.getItemVisual(dataIndex, "drawType") || "fill"];
      var borderColor = style && style.stroke;
      var mainType = this.mainType;
      var isSeries2 = mainType === "series";
      var userOutput = data.userOutput && data.userOutput.get();
      return {
        componentType: mainType,
        componentSubType: this.subType,
        componentIndex: this.componentIndex,
        seriesType: isSeries2 ? this.subType : null,
        seriesIndex: this.seriesIndex,
        seriesId: isSeries2 ? this.id : null,
        seriesName: isSeries2 ? this.name : null,
        name,
        dataIndex: rawDataIndex,
        data: itemOpt,
        dataType,
        value: rawValue,
        color,
        borderColor,
        dimensionNames: userOutput ? userOutput.fullDimensions : null,
        encode: userOutput ? userOutput.encode : null,
        // Param name list for mapping `a`, `b`, `c`, `d`, `e`
        $vars: ["seriesName", "name", "value"]
      };
    };
    DataFormatMixin2.prototype.getFormattedLabel = function(dataIndex, status, dataType, labelDimIndex, formatter, extendParams) {
      status = status || "normal";
      var data = this.getData(dataType);
      var params = this.getDataParams(dataIndex, dataType);
      if (extendParams) {
        params.value = extendParams.interpolatedValue;
      }
      if (labelDimIndex != null && isArray(params.value)) {
        params.value = params.value[labelDimIndex];
      }
      if (!formatter) {
        var itemModel = data.getItemModel(dataIndex);
        formatter = itemModel.get(status === "normal" ? ["label", "formatter"] : [status, "label", "formatter"]);
      }
      if (isFunction(formatter)) {
        params.status = status;
        params.dimensionIndex = labelDimIndex;
        return formatter(params);
      } else if (isString(formatter)) {
        var str = formatTpl(formatter, params);
        return str.replace(DIMENSION_LABEL_REG, function(origin, dimStr) {
          var len = dimStr.length;
          var dimLoose = dimStr;
          if (dimLoose.charAt(0) === "[" && dimLoose.charAt(len - 1) === "]") {
            dimLoose = +dimLoose.slice(1, len - 1);
            if (true) {
              if (isNaN(dimLoose)) {
                error("Invalide label formatter: @" + dimStr + ", only support @[0], @[1], @[2], ...");
              }
            }
          }
          var val = retrieveRawValue(data, dataIndex, dimLoose);
          if (extendParams && isArray(extendParams.interpolatedValue)) {
            var dimIndex = data.getDimensionIndex(dimLoose);
            if (dimIndex >= 0) {
              val = extendParams.interpolatedValue[dimIndex];
            }
          }
          return val != null ? val + "" : "";
        });
      }
    };
    DataFormatMixin2.prototype.getRawValue = function(idx, dataType) {
      return retrieveRawValue(this.getData(dataType), idx);
    };
    DataFormatMixin2.prototype.formatTooltip = function(dataIndex, multipleSeries, dataType) {
      return;
    };
    return DataFormatMixin2;
  }()
);
function normalizeTooltipFormatResult(result) {
  var markupText;
  var markupFragment;
  if (isObject(result)) {
    if (result.type) {
      markupFragment = result;
    } else {
      if (true) {
        console.warn("The return type of `formatTooltip` is not supported: " + makePrintable(result));
      }
    }
  } else {
    markupText = result;
  }
  return {
    text: markupText,
    // markers: markers || markersExisting,
    frag: markupFragment
  };
}

// node_modules/echarts/lib/core/task.js
function createTask(define) {
  return new Task(define);
}
var Task = (
  /** @class */
  function() {
    function Task2(define) {
      define = define || {};
      this._reset = define.reset;
      this._plan = define.plan;
      this._count = define.count;
      this._onDirty = define.onDirty;
      this._dirty = true;
    }
    Task2.prototype.perform = function(performArgs) {
      var upTask = this._upstream;
      var skip = performArgs && performArgs.skip;
      if (this._dirty && upTask) {
        var context = this.context;
        context.data = context.outputData = upTask.context.outputData;
      }
      if (this.__pipeline) {
        this.__pipeline.currentTask = this;
      }
      var planResult;
      if (this._plan && !skip) {
        planResult = this._plan(this.context);
      }
      var lastModBy = normalizeModBy(this._modBy);
      var lastModDataCount = this._modDataCount || 0;
      var modBy = normalizeModBy(performArgs && performArgs.modBy);
      var modDataCount = performArgs && performArgs.modDataCount || 0;
      if (lastModBy !== modBy || lastModDataCount !== modDataCount) {
        planResult = "reset";
      }
      function normalizeModBy(val) {
        !(val >= 1) && (val = 1);
        return val;
      }
      var forceFirstProgress;
      if (this._dirty || planResult === "reset") {
        this._dirty = false;
        forceFirstProgress = this._doReset(skip);
      }
      this._modBy = modBy;
      this._modDataCount = modDataCount;
      var step = performArgs && performArgs.step;
      if (upTask) {
        if (true) {
          assert(upTask._outputDueEnd != null);
        }
        this._dueEnd = upTask._outputDueEnd;
      } else {
        if (true) {
          assert(!this._progress || this._count);
        }
        this._dueEnd = this._count ? this._count(this.context) : Infinity;
      }
      if (this._progress) {
        var start = this._dueIndex;
        var end = Math.min(step != null ? this._dueIndex + step : Infinity, this._dueEnd);
        if (!skip && (forceFirstProgress || start < end)) {
          var progress = this._progress;
          if (isArray(progress)) {
            for (var i = 0; i < progress.length; i++) {
              this._doProgress(progress[i], start, end, modBy, modDataCount);
            }
          } else {
            this._doProgress(progress, start, end, modBy, modDataCount);
          }
        }
        this._dueIndex = end;
        var outputDueEnd = this._settedOutputEnd != null ? this._settedOutputEnd : end;
        if (true) {
          assert(outputDueEnd >= this._outputDueEnd);
        }
        this._outputDueEnd = outputDueEnd;
      } else {
        this._dueIndex = this._outputDueEnd = this._settedOutputEnd != null ? this._settedOutputEnd : this._dueEnd;
      }
      return this.unfinished();
    };
    Task2.prototype.dirty = function() {
      this._dirty = true;
      this._onDirty && this._onDirty(this.context);
    };
    Task2.prototype._doProgress = function(progress, start, end, modBy, modDataCount) {
      iterator.reset(start, end, modBy, modDataCount);
      this._callingProgress = progress;
      this._callingProgress({
        start,
        end,
        count: end - start,
        next: iterator.next
      }, this.context);
    };
    Task2.prototype._doReset = function(skip) {
      this._dueIndex = this._outputDueEnd = this._dueEnd = 0;
      this._settedOutputEnd = null;
      var progress;
      var forceFirstProgress;
      if (!skip && this._reset) {
        progress = this._reset(this.context);
        if (progress && progress.progress) {
          forceFirstProgress = progress.forceFirstProgress;
          progress = progress.progress;
        }
        if (isArray(progress) && !progress.length) {
          progress = null;
        }
      }
      this._progress = progress;
      this._modBy = this._modDataCount = null;
      var downstream = this._downstream;
      downstream && downstream.dirty();
      return forceFirstProgress;
    };
    Task2.prototype.unfinished = function() {
      return this._progress && this._dueIndex < this._dueEnd;
    };
    Task2.prototype.pipe = function(downTask) {
      if (true) {
        assert(downTask && !downTask._disposed && downTask !== this);
      }
      if (this._downstream !== downTask || this._dirty) {
        this._downstream = downTask;
        downTask._upstream = this;
        downTask.dirty();
      }
    };
    Task2.prototype.dispose = function() {
      if (this._disposed) {
        return;
      }
      this._upstream && (this._upstream._downstream = null);
      this._downstream && (this._downstream._upstream = null);
      this._dirty = false;
      this._disposed = true;
    };
    Task2.prototype.getUpstream = function() {
      return this._upstream;
    };
    Task2.prototype.getDownstream = function() {
      return this._downstream;
    };
    Task2.prototype.setOutputEnd = function(end) {
      this._outputDueEnd = this._settedOutputEnd = end;
    };
    return Task2;
  }()
);
var iterator = function() {
  var end;
  var current;
  var modBy;
  var modDataCount;
  var winCount;
  var it = {
    reset: function(s, e2, sStep, sCount) {
      current = s;
      end = e2;
      modBy = sStep;
      modDataCount = sCount;
      winCount = Math.ceil(modDataCount / modBy);
      it.next = modBy > 1 && modDataCount > 0 ? modNext : sequentialNext;
    }
  };
  return it;
  function sequentialNext() {
    return current < end ? current++ : null;
  }
  function modNext() {
    var dataIndex = current % winCount * modBy + Math.ceil(current / winCount);
    var result = current >= end ? null : dataIndex < modDataCount ? dataIndex : current;
    current++;
    return result;
  }
}();

// node_modules/echarts/lib/data/helper/dataValueHelper.js
function parseDataValue(value, opt) {
  var dimType = opt && opt.type;
  if (dimType === "ordinal") {
    return value;
  }
  if (dimType === "time" && !isNumber(value) && value != null && value !== "-") {
    value = +parseDate(value);
  }
  return value == null || value === "" ? NaN : +value;
}
var valueParserMap = createHashMap({
  "number": function(val) {
    return parseFloat(val);
  },
  "time": function(val) {
    return +parseDate(val);
  },
  "trim": function(val) {
    return isString(val) ? trim(val) : val;
  }
});
function getRawValueParser(type) {
  return valueParserMap.get(type);
}
var ORDER_COMPARISON_OP_MAP = {
  lt: function(lval, rval) {
    return lval < rval;
  },
  lte: function(lval, rval) {
    return lval <= rval;
  },
  gt: function(lval, rval) {
    return lval > rval;
  },
  gte: function(lval, rval) {
    return lval >= rval;
  }
};
var FilterOrderComparator = (
  /** @class */
  function() {
    function FilterOrderComparator2(op, rval) {
      if (!isNumber(rval)) {
        var errMsg = "";
        if (true) {
          errMsg = 'rvalue of "<", ">", "<=", ">=" can only be number in filter.';
        }
        throwError(errMsg);
      }
      this._opFn = ORDER_COMPARISON_OP_MAP[op];
      this._rvalFloat = numericToNumber(rval);
    }
    FilterOrderComparator2.prototype.evaluate = function(lval) {
      return isNumber(lval) ? this._opFn(lval, this._rvalFloat) : this._opFn(numericToNumber(lval), this._rvalFloat);
    };
    return FilterOrderComparator2;
  }()
);
var SortOrderComparator = (
  /** @class */
  function() {
    function SortOrderComparator2(order, incomparable) {
      var isDesc = order === "desc";
      this._resultLT = isDesc ? 1 : -1;
      if (incomparable == null) {
        incomparable = isDesc ? "min" : "max";
      }
      this._incomparable = incomparable === "min" ? -Infinity : Infinity;
    }
    SortOrderComparator2.prototype.evaluate = function(lval, rval) {
      var lvalFloat = isNumber(lval) ? lval : numericToNumber(lval);
      var rvalFloat = isNumber(rval) ? rval : numericToNumber(rval);
      var lvalNotNumeric = isNaN(lvalFloat);
      var rvalNotNumeric = isNaN(rvalFloat);
      if (lvalNotNumeric) {
        lvalFloat = this._incomparable;
      }
      if (rvalNotNumeric) {
        rvalFloat = this._incomparable;
      }
      if (lvalNotNumeric && rvalNotNumeric) {
        var lvalIsStr = isString(lval);
        var rvalIsStr = isString(rval);
        if (lvalIsStr) {
          lvalFloat = rvalIsStr ? lval : 0;
        }
        if (rvalIsStr) {
          rvalFloat = lvalIsStr ? rval : 0;
        }
      }
      return lvalFloat < rvalFloat ? this._resultLT : lvalFloat > rvalFloat ? -this._resultLT : 0;
    };
    return SortOrderComparator2;
  }()
);
var FilterEqualityComparator = (
  /** @class */
  function() {
    function FilterEqualityComparator2(isEq, rval) {
      this._rval = rval;
      this._isEQ = isEq;
      this._rvalTypeof = typeof rval;
      this._rvalFloat = numericToNumber(rval);
    }
    FilterEqualityComparator2.prototype.evaluate = function(lval) {
      var eqResult = lval === this._rval;
      if (!eqResult) {
        var lvalTypeof = typeof lval;
        if (lvalTypeof !== this._rvalTypeof && (lvalTypeof === "number" || this._rvalTypeof === "number")) {
          eqResult = numericToNumber(lval) === this._rvalFloat;
        }
      }
      return this._isEQ ? eqResult : !eqResult;
    };
    return FilterEqualityComparator2;
  }()
);
function createFilterComparator(op, rval) {
  return op === "eq" || op === "ne" ? new FilterEqualityComparator(op === "eq", rval) : hasOwn(ORDER_COMPARISON_OP_MAP, op) ? new FilterOrderComparator(op, rval) : null;
}

// node_modules/echarts/lib/data/helper/transform.js
var ExternalSource = (
  /** @class */
  function() {
    function ExternalSource2() {
    }
    ExternalSource2.prototype.getRawData = function() {
      throw new Error("not supported");
    };
    ExternalSource2.prototype.getRawDataItem = function(dataIndex) {
      throw new Error("not supported");
    };
    ExternalSource2.prototype.cloneRawData = function() {
      return;
    };
    ExternalSource2.prototype.getDimensionInfo = function(dim) {
      return;
    };
    ExternalSource2.prototype.cloneAllDimensionInfo = function() {
      return;
    };
    ExternalSource2.prototype.count = function() {
      return;
    };
    ExternalSource2.prototype.retrieveValue = function(dataIndex, dimIndex) {
      return;
    };
    ExternalSource2.prototype.retrieveValueFromItem = function(dataItem, dimIndex) {
      return;
    };
    ExternalSource2.prototype.convertValue = function(rawVal, dimInfo) {
      return parseDataValue(rawVal, dimInfo);
    };
    return ExternalSource2;
  }()
);
function createExternalSource(internalSource, externalTransform) {
  var extSource = new ExternalSource();
  var data = internalSource.data;
  var sourceFormat = extSource.sourceFormat = internalSource.sourceFormat;
  var sourceHeaderCount = internalSource.startIndex;
  var errMsg = "";
  if (internalSource.seriesLayoutBy !== SERIES_LAYOUT_BY_COLUMN) {
    if (true) {
      errMsg = '`seriesLayoutBy` of upstream dataset can only be "column" in data transform.';
    }
    throwError(errMsg);
  }
  var dimensions = [];
  var dimsByName = {};
  var dimsDef = internalSource.dimensionsDefine;
  if (dimsDef) {
    each(dimsDef, function(dimDef, idx) {
      var name = dimDef.name;
      var dimDefExt = {
        index: idx,
        name,
        displayName: dimDef.displayName
      };
      dimensions.push(dimDefExt);
      if (name != null) {
        var errMsg_1 = "";
        if (hasOwn(dimsByName, name)) {
          if (true) {
            errMsg_1 = 'dimension name "' + name + '" duplicated.';
          }
          throwError(errMsg_1);
        }
        dimsByName[name] = dimDefExt;
      }
    });
  } else {
    for (var i = 0; i < internalSource.dimensionsDetectedCount || 0; i++) {
      dimensions.push({
        index: i
      });
    }
  }
  var rawItemGetter = getRawSourceItemGetter(sourceFormat, SERIES_LAYOUT_BY_COLUMN);
  if (externalTransform.__isBuiltIn) {
    extSource.getRawDataItem = function(dataIndex) {
      return rawItemGetter(data, sourceHeaderCount, dimensions, dataIndex);
    };
    extSource.getRawData = bind(getRawData, null, internalSource);
  }
  extSource.cloneRawData = bind(cloneRawData, null, internalSource);
  var rawCounter = getRawSourceDataCounter(sourceFormat, SERIES_LAYOUT_BY_COLUMN);
  extSource.count = bind(rawCounter, null, data, sourceHeaderCount, dimensions);
  var rawValueGetter = getRawSourceValueGetter(sourceFormat);
  extSource.retrieveValue = function(dataIndex, dimIndex) {
    var rawItem = rawItemGetter(data, sourceHeaderCount, dimensions, dataIndex);
    return retrieveValueFromItem(rawItem, dimIndex);
  };
  var retrieveValueFromItem = extSource.retrieveValueFromItem = function(dataItem, dimIndex) {
    if (dataItem == null) {
      return;
    }
    var dimDef = dimensions[dimIndex];
    if (dimDef) {
      return rawValueGetter(dataItem, dimIndex, dimDef.name);
    }
  };
  extSource.getDimensionInfo = bind(getDimensionInfo, null, dimensions, dimsByName);
  extSource.cloneAllDimensionInfo = bind(cloneAllDimensionInfo, null, dimensions);
  return extSource;
}
function getRawData(upstream) {
  var sourceFormat = upstream.sourceFormat;
  if (!isSupportedSourceFormat(sourceFormat)) {
    var errMsg = "";
    if (true) {
      errMsg = "`getRawData` is not supported in source format " + sourceFormat;
    }
    throwError(errMsg);
  }
  return upstream.data;
}
function cloneRawData(upstream) {
  var sourceFormat = upstream.sourceFormat;
  var data = upstream.data;
  if (!isSupportedSourceFormat(sourceFormat)) {
    var errMsg = "";
    if (true) {
      errMsg = "`cloneRawData` is not supported in source format " + sourceFormat;
    }
    throwError(errMsg);
  }
  if (sourceFormat === SOURCE_FORMAT_ARRAY_ROWS) {
    var result = [];
    for (var i = 0, len = data.length; i < len; i++) {
      result.push(data[i].slice());
    }
    return result;
  } else if (sourceFormat === SOURCE_FORMAT_OBJECT_ROWS) {
    var result = [];
    for (var i = 0, len = data.length; i < len; i++) {
      result.push(extend({}, data[i]));
    }
    return result;
  }
}
function getDimensionInfo(dimensions, dimsByName, dim) {
  if (dim == null) {
    return;
  }
  if (isNumber(dim) || !isNaN(dim) && !hasOwn(dimsByName, dim)) {
    return dimensions[dim];
  } else if (hasOwn(dimsByName, dim)) {
    return dimsByName[dim];
  }
}
function cloneAllDimensionInfo(dimensions) {
  return clone(dimensions);
}
var externalTransformMap = createHashMap();
function registerExternalTransform(externalTransform) {
  externalTransform = clone(externalTransform);
  var type = externalTransform.type;
  var errMsg = "";
  if (!type) {
    if (true) {
      errMsg = "Must have a `type` when `registerTransform`.";
    }
    throwError(errMsg);
  }
  var typeParsed = type.split(":");
  if (typeParsed.length !== 2) {
    if (true) {
      errMsg = 'Name must include namespace like "ns:regression".';
    }
    throwError(errMsg);
  }
  var isBuiltIn = false;
  if (typeParsed[0] === "echarts") {
    type = typeParsed[1];
    isBuiltIn = true;
  }
  externalTransform.__isBuiltIn = isBuiltIn;
  externalTransformMap.set(type, externalTransform);
}
function applyDataTransform(rawTransOption, sourceList, infoForPrint) {
  var pipedTransOption = normalizeToArray(rawTransOption);
  var pipeLen = pipedTransOption.length;
  var errMsg = "";
  if (!pipeLen) {
    if (true) {
      errMsg = "If `transform` declared, it should at least contain one transform.";
    }
    throwError(errMsg);
  }
  for (var i = 0, len = pipeLen; i < len; i++) {
    var transOption = pipedTransOption[i];
    sourceList = applySingleDataTransform(transOption, sourceList, infoForPrint, pipeLen === 1 ? null : i);
    if (i !== len - 1) {
      sourceList.length = Math.max(sourceList.length, 1);
    }
  }
  return sourceList;
}
function applySingleDataTransform(transOption, upSourceList, infoForPrint, pipeIndex) {
  var errMsg = "";
  if (!upSourceList.length) {
    if (true) {
      errMsg = "Must have at least one upstream dataset.";
    }
    throwError(errMsg);
  }
  if (!isObject(transOption)) {
    if (true) {
      errMsg = "transform declaration must be an object rather than " + typeof transOption + ".";
    }
    throwError(errMsg);
  }
  var transType = transOption.type;
  var externalTransform = externalTransformMap.get(transType);
  if (!externalTransform) {
    if (true) {
      errMsg = 'Can not find transform on type "' + transType + '".';
    }
    throwError(errMsg);
  }
  var extUpSourceList = map(upSourceList, function(upSource) {
    return createExternalSource(upSource, externalTransform);
  });
  var resultList = normalizeToArray(externalTransform.transform({
    upstream: extUpSourceList[0],
    upstreamList: extUpSourceList,
    config: clone(transOption.config)
  }));
  if (true) {
    if (transOption.print) {
      var printStrArr = map(resultList, function(extSource) {
        var pipeIndexStr = pipeIndex != null ? " === pipe index: " + pipeIndex : "";
        return ["=== dataset index: " + infoForPrint.datasetIndex + pipeIndexStr + " ===", "- transform result data:", makePrintable(extSource.data), "- transform result dimensions:", makePrintable(extSource.dimensions)].join("\n");
      }).join("\n");
      log(printStrArr);
    }
  }
  return map(resultList, function(result, resultIndex) {
    var errMsg2 = "";
    if (!isObject(result)) {
      if (true) {
        errMsg2 = "A transform should not return some empty results.";
      }
      throwError(errMsg2);
    }
    if (!result.data) {
      if (true) {
        errMsg2 = "Transform result data should be not be null or undefined";
      }
      throwError(errMsg2);
    }
    var sourceFormat = detectSourceFormat(result.data);
    if (!isSupportedSourceFormat(sourceFormat)) {
      if (true) {
        errMsg2 = "Transform result data should be array rows or object rows.";
      }
      throwError(errMsg2);
    }
    var resultMetaRawOption;
    var firstUpSource = upSourceList[0];
    if (firstUpSource && resultIndex === 0 && !result.dimensions) {
      var startIndex = firstUpSource.startIndex;
      if (startIndex) {
        result.data = firstUpSource.data.slice(0, startIndex).concat(result.data);
      }
      resultMetaRawOption = {
        seriesLayoutBy: SERIES_LAYOUT_BY_COLUMN,
        sourceHeader: startIndex,
        dimensions: firstUpSource.metaRawOption.dimensions
      };
    } else {
      resultMetaRawOption = {
        seriesLayoutBy: SERIES_LAYOUT_BY_COLUMN,
        sourceHeader: 0,
        dimensions: result.dimensions
      };
    }
    return createSource(result.data, resultMetaRawOption, null);
  });
}
function isSupportedSourceFormat(sourceFormat) {
  return sourceFormat === SOURCE_FORMAT_ARRAY_ROWS || sourceFormat === SOURCE_FORMAT_OBJECT_ROWS;
}

// node_modules/echarts/lib/data/DataStore.js
var UNDEFINED = "undefined";
var CtorUint32Array = typeof Uint32Array === UNDEFINED ? Array : Uint32Array;
var CtorUint16Array = typeof Uint16Array === UNDEFINED ? Array : Uint16Array;
var CtorInt32Array = typeof Int32Array === UNDEFINED ? Array : Int32Array;
var CtorFloat64Array = typeof Float64Array === UNDEFINED ? Array : Float64Array;
var dataCtors = {
  "float": CtorFloat64Array,
  "int": CtorInt32Array,
  // Ordinal data type can be string or int
  "ordinal": Array,
  "number": Array,
  "time": CtorFloat64Array
};
var defaultDimValueGetters;
function getIndicesCtor(rawCount) {
  return rawCount > 65535 ? CtorUint32Array : CtorUint16Array;
}
function getInitialExtent() {
  return [Infinity, -Infinity];
}
function cloneChunk(originalChunk) {
  var Ctor = originalChunk.constructor;
  return Ctor === Array ? originalChunk.slice() : new Ctor(originalChunk);
}
function prepareStore(store, dimIdx, dimType, end, append) {
  var DataCtor = dataCtors[dimType || "float"];
  if (append) {
    var oldStore = store[dimIdx];
    var oldLen = oldStore && oldStore.length;
    if (!(oldLen === end)) {
      var newStore = new DataCtor(end);
      for (var j = 0; j < oldLen; j++) {
        newStore[j] = oldStore[j];
      }
      store[dimIdx] = newStore;
    }
  } else {
    store[dimIdx] = new DataCtor(end);
  }
}
var DataStore = (
  /** @class */
  function() {
    function DataStore2() {
      this._chunks = [];
      this._rawExtent = [];
      this._extent = [];
      this._count = 0;
      this._rawCount = 0;
      this._calcDimNameToIdx = createHashMap();
    }
    DataStore2.prototype.initData = function(provider, inputDimensions, dimValueGetter) {
      if (true) {
        assert(isFunction(provider.getItem) && isFunction(provider.count), "Invalid data provider.");
      }
      this._provider = provider;
      this._chunks = [];
      this._indices = null;
      this.getRawIndex = this._getRawIdxIdentity;
      var source = provider.getSource();
      var defaultGetter = this.defaultDimValueGetter = defaultDimValueGetters[source.sourceFormat];
      this._dimValueGetter = dimValueGetter || defaultGetter;
      this._rawExtent = [];
      var willRetrieveDataByName = shouldRetrieveDataByName(source);
      this._dimensions = map(inputDimensions, function(dim) {
        if (true) {
          if (willRetrieveDataByName) {
            assert(dim.property != null);
          }
        }
        return {
          // Only pick these two props. Not leak other properties like orderMeta.
          type: dim.type,
          property: dim.property
        };
      });
      this._initDataFromProvider(0, provider.count());
    };
    DataStore2.prototype.getProvider = function() {
      return this._provider;
    };
    DataStore2.prototype.getSource = function() {
      return this._provider.getSource();
    };
    DataStore2.prototype.ensureCalculationDimension = function(dimName, type) {
      var calcDimNameToIdx = this._calcDimNameToIdx;
      var dimensions = this._dimensions;
      var calcDimIdx = calcDimNameToIdx.get(dimName);
      if (calcDimIdx != null) {
        if (dimensions[calcDimIdx].type === type) {
          return calcDimIdx;
        }
      } else {
        calcDimIdx = dimensions.length;
      }
      dimensions[calcDimIdx] = {
        type
      };
      calcDimNameToIdx.set(dimName, calcDimIdx);
      this._chunks[calcDimIdx] = new dataCtors[type || "float"](this._rawCount);
      this._rawExtent[calcDimIdx] = getInitialExtent();
      return calcDimIdx;
    };
    DataStore2.prototype.collectOrdinalMeta = function(dimIdx, ordinalMeta) {
      var chunk = this._chunks[dimIdx];
      var dim = this._dimensions[dimIdx];
      var rawExtents = this._rawExtent;
      var offset = dim.ordinalOffset || 0;
      var len = chunk.length;
      if (offset === 0) {
        rawExtents[dimIdx] = getInitialExtent();
      }
      var dimRawExtent = rawExtents[dimIdx];
      for (var i = offset; i < len; i++) {
        var val = chunk[i] = ordinalMeta.parseAndCollect(chunk[i]);
        if (!isNaN(val)) {
          dimRawExtent[0] = Math.min(val, dimRawExtent[0]);
          dimRawExtent[1] = Math.max(val, dimRawExtent[1]);
        }
      }
      dim.ordinalMeta = ordinalMeta;
      dim.ordinalOffset = len;
      dim.type = "ordinal";
    };
    DataStore2.prototype.getOrdinalMeta = function(dimIdx) {
      var dimInfo = this._dimensions[dimIdx];
      var ordinalMeta = dimInfo.ordinalMeta;
      return ordinalMeta;
    };
    DataStore2.prototype.getDimensionProperty = function(dimIndex) {
      var item = this._dimensions[dimIndex];
      return item && item.property;
    };
    DataStore2.prototype.appendData = function(data) {
      if (true) {
        assert(!this._indices, "appendData can only be called on raw data.");
      }
      var provider = this._provider;
      var start = this.count();
      provider.appendData(data);
      var end = provider.count();
      if (!provider.persistent) {
        end += start;
      }
      if (start < end) {
        this._initDataFromProvider(start, end, true);
      }
      return [start, end];
    };
    DataStore2.prototype.appendValues = function(values, minFillLen) {
      var chunks = this._chunks;
      var dimensions = this._dimensions;
      var dimLen = dimensions.length;
      var rawExtent = this._rawExtent;
      var start = this.count();
      var end = start + Math.max(values.length, minFillLen || 0);
      for (var i = 0; i < dimLen; i++) {
        var dim = dimensions[i];
        prepareStore(chunks, i, dim.type, end, true);
      }
      var emptyDataItem = [];
      for (var idx = start; idx < end; idx++) {
        var sourceIdx = idx - start;
        for (var dimIdx = 0; dimIdx < dimLen; dimIdx++) {
          var dim = dimensions[dimIdx];
          var val = defaultDimValueGetters.arrayRows.call(this, values[sourceIdx] || emptyDataItem, dim.property, sourceIdx, dimIdx);
          chunks[dimIdx][idx] = val;
          var dimRawExtent = rawExtent[dimIdx];
          val < dimRawExtent[0] && (dimRawExtent[0] = val);
          val > dimRawExtent[1] && (dimRawExtent[1] = val);
        }
      }
      this._rawCount = this._count = end;
      return {
        start,
        end
      };
    };
    DataStore2.prototype._initDataFromProvider = function(start, end, append) {
      var provider = this._provider;
      var chunks = this._chunks;
      var dimensions = this._dimensions;
      var dimLen = dimensions.length;
      var rawExtent = this._rawExtent;
      var dimNames = map(dimensions, function(dim2) {
        return dim2.property;
      });
      for (var i = 0; i < dimLen; i++) {
        var dim = dimensions[i];
        if (!rawExtent[i]) {
          rawExtent[i] = getInitialExtent();
        }
        prepareStore(chunks, i, dim.type, end, append);
      }
      if (provider.fillStorage) {
        provider.fillStorage(start, end, chunks, rawExtent);
      } else {
        var dataItem = [];
        for (var idx = start; idx < end; idx++) {
          dataItem = provider.getItem(idx, dataItem);
          for (var dimIdx = 0; dimIdx < dimLen; dimIdx++) {
            var dimStorage = chunks[dimIdx];
            var val = this._dimValueGetter(dataItem, dimNames[dimIdx], idx, dimIdx);
            dimStorage[idx] = val;
            var dimRawExtent = rawExtent[dimIdx];
            val < dimRawExtent[0] && (dimRawExtent[0] = val);
            val > dimRawExtent[1] && (dimRawExtent[1] = val);
          }
        }
      }
      if (!provider.persistent && provider.clean) {
        provider.clean();
      }
      this._rawCount = this._count = end;
      this._extent = [];
    };
    DataStore2.prototype.count = function() {
      return this._count;
    };
    DataStore2.prototype.get = function(dim, idx) {
      if (!(idx >= 0 && idx < this._count)) {
        return NaN;
      }
      var dimStore = this._chunks[dim];
      return dimStore ? dimStore[this.getRawIndex(idx)] : NaN;
    };
    DataStore2.prototype.getValues = function(dimensions, idx) {
      var values = [];
      var dimArr = [];
      if (idx == null) {
        idx = dimensions;
        dimensions = [];
        for (var i = 0; i < this._dimensions.length; i++) {
          dimArr.push(i);
        }
      } else {
        dimArr = dimensions;
      }
      for (var i = 0, len = dimArr.length; i < len; i++) {
        values.push(this.get(dimArr[i], idx));
      }
      return values;
    };
    DataStore2.prototype.getByRawIndex = function(dim, rawIdx) {
      if (!(rawIdx >= 0 && rawIdx < this._rawCount)) {
        return NaN;
      }
      var dimStore = this._chunks[dim];
      return dimStore ? dimStore[rawIdx] : NaN;
    };
    DataStore2.prototype.getSum = function(dim) {
      var dimData = this._chunks[dim];
      var sum = 0;
      if (dimData) {
        for (var i = 0, len = this.count(); i < len; i++) {
          var value = this.get(dim, i);
          if (!isNaN(value)) {
            sum += value;
          }
        }
      }
      return sum;
    };
    DataStore2.prototype.getMedian = function(dim) {
      var dimDataArray = [];
      this.each([dim], function(val) {
        if (!isNaN(val)) {
          dimDataArray.push(val);
        }
      });
      var sortedDimDataArray = dimDataArray.sort(function(a, b) {
        return a - b;
      });
      var len = this.count();
      return len === 0 ? 0 : len % 2 === 1 ? sortedDimDataArray[(len - 1) / 2] : (sortedDimDataArray[len / 2] + sortedDimDataArray[len / 2 - 1]) / 2;
    };
    DataStore2.prototype.indexOfRawIndex = function(rawIndex) {
      if (rawIndex >= this._rawCount || rawIndex < 0) {
        return -1;
      }
      if (!this._indices) {
        return rawIndex;
      }
      var indices = this._indices;
      var rawDataIndex = indices[rawIndex];
      if (rawDataIndex != null && rawDataIndex < this._count && rawDataIndex === rawIndex) {
        return rawIndex;
      }
      var left = 0;
      var right = this._count - 1;
      while (left <= right) {
        var mid = (left + right) / 2 | 0;
        if (indices[mid] < rawIndex) {
          left = mid + 1;
        } else if (indices[mid] > rawIndex) {
          right = mid - 1;
        } else {
          return mid;
        }
      }
      return -1;
    };
    DataStore2.prototype.indicesOfNearest = function(dim, value, maxDistance) {
      var chunks = this._chunks;
      var dimData = chunks[dim];
      var nearestIndices = [];
      if (!dimData) {
        return nearestIndices;
      }
      if (maxDistance == null) {
        maxDistance = Infinity;
      }
      var minDist = Infinity;
      var minDiff = -1;
      var nearestIndicesLen = 0;
      for (var i = 0, len = this.count(); i < len; i++) {
        var dataIndex = this.getRawIndex(i);
        var diff = value - dimData[dataIndex];
        var dist3 = Math.abs(diff);
        if (dist3 <= maxDistance) {
          if (dist3 < minDist || dist3 === minDist && diff >= 0 && minDiff < 0) {
            minDist = dist3;
            minDiff = diff;
            nearestIndicesLen = 0;
          }
          if (diff === minDiff) {
            nearestIndices[nearestIndicesLen++] = i;
          }
        }
      }
      nearestIndices.length = nearestIndicesLen;
      return nearestIndices;
    };
    DataStore2.prototype.getIndices = function() {
      var newIndices;
      var indices = this._indices;
      if (indices) {
        var Ctor = indices.constructor;
        var thisCount = this._count;
        if (Ctor === Array) {
          newIndices = new Ctor(thisCount);
          for (var i = 0; i < thisCount; i++) {
            newIndices[i] = indices[i];
          }
        } else {
          newIndices = new Ctor(indices.buffer, 0, thisCount);
        }
      } else {
        var Ctor = getIndicesCtor(this._rawCount);
        newIndices = new Ctor(this.count());
        for (var i = 0; i < newIndices.length; i++) {
          newIndices[i] = i;
        }
      }
      return newIndices;
    };
    DataStore2.prototype.filter = function(dims, cb) {
      if (!this._count) {
        return this;
      }
      var newStore = this.clone();
      var count = newStore.count();
      var Ctor = getIndicesCtor(newStore._rawCount);
      var newIndices = new Ctor(count);
      var value = [];
      var dimSize = dims.length;
      var offset = 0;
      var dim0 = dims[0];
      var chunks = newStore._chunks;
      for (var i = 0; i < count; i++) {
        var keep = void 0;
        var rawIdx = newStore.getRawIndex(i);
        if (dimSize === 0) {
          keep = cb(i);
        } else if (dimSize === 1) {
          var val = chunks[dim0][rawIdx];
          keep = cb(val, i);
        } else {
          var k = 0;
          for (; k < dimSize; k++) {
            value[k] = chunks[dims[k]][rawIdx];
          }
          value[k] = i;
          keep = cb.apply(null, value);
        }
        if (keep) {
          newIndices[offset++] = rawIdx;
        }
      }
      if (offset < count) {
        newStore._indices = newIndices;
      }
      newStore._count = offset;
      newStore._extent = [];
      newStore._updateGetRawIdx();
      return newStore;
    };
    DataStore2.prototype.selectRange = function(range) {
      var newStore = this.clone();
      var len = newStore._count;
      if (!len) {
        return this;
      }
      var dims = keys(range);
      var dimSize = dims.length;
      if (!dimSize) {
        return this;
      }
      var originalCount = newStore.count();
      var Ctor = getIndicesCtor(newStore._rawCount);
      var newIndices = new Ctor(originalCount);
      var offset = 0;
      var dim0 = dims[0];
      var min2 = range[dim0][0];
      var max2 = range[dim0][1];
      var storeArr = newStore._chunks;
      var quickFinished = false;
      if (!newStore._indices) {
        var idx = 0;
        if (dimSize === 1) {
          var dimStorage = storeArr[dims[0]];
          for (var i = 0; i < len; i++) {
            var val = dimStorage[i];
            if (val >= min2 && val <= max2 || isNaN(val)) {
              newIndices[offset++] = idx;
            }
            idx++;
          }
          quickFinished = true;
        } else if (dimSize === 2) {
          var dimStorage = storeArr[dims[0]];
          var dimStorage2 = storeArr[dims[1]];
          var min22 = range[dims[1]][0];
          var max22 = range[dims[1]][1];
          for (var i = 0; i < len; i++) {
            var val = dimStorage[i];
            var val2 = dimStorage2[i];
            if ((val >= min2 && val <= max2 || isNaN(val)) && (val2 >= min22 && val2 <= max22 || isNaN(val2))) {
              newIndices[offset++] = idx;
            }
            idx++;
          }
          quickFinished = true;
        }
      }
      if (!quickFinished) {
        if (dimSize === 1) {
          for (var i = 0; i < originalCount; i++) {
            var rawIndex = newStore.getRawIndex(i);
            var val = storeArr[dims[0]][rawIndex];
            if (val >= min2 && val <= max2 || isNaN(val)) {
              newIndices[offset++] = rawIndex;
            }
          }
        } else {
          for (var i = 0; i < originalCount; i++) {
            var keep = true;
            var rawIndex = newStore.getRawIndex(i);
            for (var k = 0; k < dimSize; k++) {
              var dimk = dims[k];
              var val = storeArr[dimk][rawIndex];
              if (val < range[dimk][0] || val > range[dimk][1]) {
                keep = false;
              }
            }
            if (keep) {
              newIndices[offset++] = newStore.getRawIndex(i);
            }
          }
        }
      }
      if (offset < originalCount) {
        newStore._indices = newIndices;
      }
      newStore._count = offset;
      newStore._extent = [];
      newStore._updateGetRawIdx();
      return newStore;
    };
    DataStore2.prototype.map = function(dims, cb) {
      var target = this.clone(dims);
      this._updateDims(target, dims, cb);
      return target;
    };
    DataStore2.prototype.modify = function(dims, cb) {
      this._updateDims(this, dims, cb);
    };
    DataStore2.prototype._updateDims = function(target, dims, cb) {
      var targetChunks = target._chunks;
      var tmpRetValue = [];
      var dimSize = dims.length;
      var dataCount = target.count();
      var values = [];
      var rawExtent = target._rawExtent;
      for (var i = 0; i < dims.length; i++) {
        rawExtent[dims[i]] = getInitialExtent();
      }
      for (var dataIndex = 0; dataIndex < dataCount; dataIndex++) {
        var rawIndex = target.getRawIndex(dataIndex);
        for (var k = 0; k < dimSize; k++) {
          values[k] = targetChunks[dims[k]][rawIndex];
        }
        values[dimSize] = dataIndex;
        var retValue = cb && cb.apply(null, values);
        if (retValue != null) {
          if (typeof retValue !== "object") {
            tmpRetValue[0] = retValue;
            retValue = tmpRetValue;
          }
          for (var i = 0; i < retValue.length; i++) {
            var dim = dims[i];
            var val = retValue[i];
            var rawExtentOnDim = rawExtent[dim];
            var dimStore = targetChunks[dim];
            if (dimStore) {
              dimStore[rawIndex] = val;
            }
            if (val < rawExtentOnDim[0]) {
              rawExtentOnDim[0] = val;
            }
            if (val > rawExtentOnDim[1]) {
              rawExtentOnDim[1] = val;
            }
          }
        }
      }
    };
    DataStore2.prototype.lttbDownSample = function(valueDimension, rate) {
      var target = this.clone([valueDimension], true);
      var targetStorage = target._chunks;
      var dimStore = targetStorage[valueDimension];
      var len = this.count();
      var sampledIndex = 0;
      var frameSize = Math.floor(1 / rate);
      var currentRawIndex = this.getRawIndex(0);
      var maxArea;
      var area;
      var nextRawIndex;
      var newIndices = new (getIndicesCtor(this._rawCount))(Math.min((Math.ceil(len / frameSize) + 2) * 2, len));
      newIndices[sampledIndex++] = currentRawIndex;
      for (var i = 1; i < len - 1; i += frameSize) {
        var nextFrameStart = Math.min(i + frameSize, len - 1);
        var nextFrameEnd = Math.min(i + frameSize * 2, len);
        var avgX = (nextFrameEnd + nextFrameStart) / 2;
        var avgY = 0;
        for (var idx = nextFrameStart; idx < nextFrameEnd; idx++) {
          var rawIndex = this.getRawIndex(idx);
          var y = dimStore[rawIndex];
          if (isNaN(y)) {
            continue;
          }
          avgY += y;
        }
        avgY /= nextFrameEnd - nextFrameStart;
        var frameStart = i;
        var frameEnd = Math.min(i + frameSize, len);
        var pointAX = i - 1;
        var pointAY = dimStore[currentRawIndex];
        maxArea = -1;
        nextRawIndex = frameStart;
        var firstNaNIndex = -1;
        var countNaN = 0;
        for (var idx = frameStart; idx < frameEnd; idx++) {
          var rawIndex = this.getRawIndex(idx);
          var y = dimStore[rawIndex];
          if (isNaN(y)) {
            countNaN++;
            if (firstNaNIndex < 0) {
              firstNaNIndex = rawIndex;
            }
            continue;
          }
          area = Math.abs((pointAX - avgX) * (y - pointAY) - (pointAX - idx) * (avgY - pointAY));
          if (area > maxArea) {
            maxArea = area;
            nextRawIndex = rawIndex;
          }
        }
        if (countNaN > 0 && countNaN < frameEnd - frameStart) {
          newIndices[sampledIndex++] = Math.min(firstNaNIndex, nextRawIndex);
          nextRawIndex = Math.max(firstNaNIndex, nextRawIndex);
        }
        newIndices[sampledIndex++] = nextRawIndex;
        currentRawIndex = nextRawIndex;
      }
      newIndices[sampledIndex++] = this.getRawIndex(len - 1);
      target._count = sampledIndex;
      target._indices = newIndices;
      target.getRawIndex = this._getRawIdx;
      return target;
    };
    DataStore2.prototype.downSample = function(dimension, rate, sampleValue, sampleIndex) {
      var target = this.clone([dimension], true);
      var targetStorage = target._chunks;
      var frameValues = [];
      var frameSize = Math.floor(1 / rate);
      var dimStore = targetStorage[dimension];
      var len = this.count();
      var rawExtentOnDim = target._rawExtent[dimension] = getInitialExtent();
      var newIndices = new (getIndicesCtor(this._rawCount))(Math.ceil(len / frameSize));
      var offset = 0;
      for (var i = 0; i < len; i += frameSize) {
        if (frameSize > len - i) {
          frameSize = len - i;
          frameValues.length = frameSize;
        }
        for (var k = 0; k < frameSize; k++) {
          var dataIdx = this.getRawIndex(i + k);
          frameValues[k] = dimStore[dataIdx];
        }
        var value = sampleValue(frameValues);
        var sampleFrameIdx = this.getRawIndex(Math.min(i + sampleIndex(frameValues, value) || 0, len - 1));
        dimStore[sampleFrameIdx] = value;
        if (value < rawExtentOnDim[0]) {
          rawExtentOnDim[0] = value;
        }
        if (value > rawExtentOnDim[1]) {
          rawExtentOnDim[1] = value;
        }
        newIndices[offset++] = sampleFrameIdx;
      }
      target._count = offset;
      target._indices = newIndices;
      target._updateGetRawIdx();
      return target;
    };
    DataStore2.prototype.each = function(dims, cb) {
      if (!this._count) {
        return;
      }
      var dimSize = dims.length;
      var chunks = this._chunks;
      for (var i = 0, len = this.count(); i < len; i++) {
        var rawIdx = this.getRawIndex(i);
        switch (dimSize) {
          case 0:
            cb(i);
            break;
          case 1:
            cb(chunks[dims[0]][rawIdx], i);
            break;
          case 2:
            cb(chunks[dims[0]][rawIdx], chunks[dims[1]][rawIdx], i);
            break;
          default:
            var k = 0;
            var value = [];
            for (; k < dimSize; k++) {
              value[k] = chunks[dims[k]][rawIdx];
            }
            value[k] = i;
            cb.apply(null, value);
        }
      }
    };
    DataStore2.prototype.getDataExtent = function(dim) {
      var dimData = this._chunks[dim];
      var initialExtent = getInitialExtent();
      if (!dimData) {
        return initialExtent;
      }
      var currEnd = this.count();
      var useRaw = !this._indices;
      var dimExtent;
      if (useRaw) {
        return this._rawExtent[dim].slice();
      }
      dimExtent = this._extent[dim];
      if (dimExtent) {
        return dimExtent.slice();
      }
      dimExtent = initialExtent;
      var min2 = dimExtent[0];
      var max2 = dimExtent[1];
      for (var i = 0; i < currEnd; i++) {
        var rawIdx = this.getRawIndex(i);
        var value = dimData[rawIdx];
        value < min2 && (min2 = value);
        value > max2 && (max2 = value);
      }
      dimExtent = [min2, max2];
      this._extent[dim] = dimExtent;
      return dimExtent;
    };
    DataStore2.prototype.getRawDataItem = function(idx) {
      var rawIdx = this.getRawIndex(idx);
      if (!this._provider.persistent) {
        var val = [];
        var chunks = this._chunks;
        for (var i = 0; i < chunks.length; i++) {
          val.push(chunks[i][rawIdx]);
        }
        return val;
      } else {
        return this._provider.getItem(rawIdx);
      }
    };
    DataStore2.prototype.clone = function(clonedDims, ignoreIndices) {
      var target = new DataStore2();
      var chunks = this._chunks;
      var clonedDimsMap = clonedDims && reduce(clonedDims, function(obj, dimIdx) {
        obj[dimIdx] = true;
        return obj;
      }, {});
      if (clonedDimsMap) {
        for (var i = 0; i < chunks.length; i++) {
          target._chunks[i] = !clonedDimsMap[i] ? chunks[i] : cloneChunk(chunks[i]);
        }
      } else {
        target._chunks = chunks;
      }
      this._copyCommonProps(target);
      if (!ignoreIndices) {
        target._indices = this._cloneIndices();
      }
      target._updateGetRawIdx();
      return target;
    };
    DataStore2.prototype._copyCommonProps = function(target) {
      target._count = this._count;
      target._rawCount = this._rawCount;
      target._provider = this._provider;
      target._dimensions = this._dimensions;
      target._extent = clone(this._extent);
      target._rawExtent = clone(this._rawExtent);
    };
    DataStore2.prototype._cloneIndices = function() {
      if (this._indices) {
        var Ctor = this._indices.constructor;
        var indices = void 0;
        if (Ctor === Array) {
          var thisCount = this._indices.length;
          indices = new Ctor(thisCount);
          for (var i = 0; i < thisCount; i++) {
            indices[i] = this._indices[i];
          }
        } else {
          indices = new Ctor(this._indices);
        }
        return indices;
      }
      return null;
    };
    DataStore2.prototype._getRawIdxIdentity = function(idx) {
      return idx;
    };
    DataStore2.prototype._getRawIdx = function(idx) {
      if (idx < this._count && idx >= 0) {
        return this._indices[idx];
      }
      return -1;
    };
    DataStore2.prototype._updateGetRawIdx = function() {
      this.getRawIndex = this._indices ? this._getRawIdx : this._getRawIdxIdentity;
    };
    DataStore2.internalField = function() {
      function getDimValueSimply(dataItem, property, dataIndex, dimIndex) {
        return parseDataValue(dataItem[dimIndex], this._dimensions[dimIndex]);
      }
      defaultDimValueGetters = {
        arrayRows: getDimValueSimply,
        objectRows: function(dataItem, property, dataIndex, dimIndex) {
          return parseDataValue(dataItem[property], this._dimensions[dimIndex]);
        },
        keyedColumns: getDimValueSimply,
        original: function(dataItem, property, dataIndex, dimIndex) {
          var value = dataItem && (dataItem.value == null ? dataItem : dataItem.value);
          return parseDataValue(value instanceof Array ? value[dimIndex] : value, this._dimensions[dimIndex]);
        },
        typedArray: function(dataItem, property, dataIndex, dimIndex) {
          return dataItem[dimIndex];
        }
      };
    }();
    return DataStore2;
  }()
);
var DataStore_default = DataStore;

// node_modules/echarts/lib/data/helper/sourceManager.js
var SourceManager = (
  /** @class */
  function() {
    function SourceManager2(sourceHost) {
      this._sourceList = [];
      this._storeList = [];
      this._upstreamSignList = [];
      this._versionSignBase = 0;
      this._dirty = true;
      this._sourceHost = sourceHost;
    }
    SourceManager2.prototype.dirty = function() {
      this._setLocalSource([], []);
      this._storeList = [];
      this._dirty = true;
    };
    SourceManager2.prototype._setLocalSource = function(sourceList, upstreamSignList) {
      this._sourceList = sourceList;
      this._upstreamSignList = upstreamSignList;
      this._versionSignBase++;
      if (this._versionSignBase > 9e10) {
        this._versionSignBase = 0;
      }
    };
    SourceManager2.prototype._getVersionSign = function() {
      return this._sourceHost.uid + "_" + this._versionSignBase;
    };
    SourceManager2.prototype.prepareSource = function() {
      if (this._isDirty()) {
        this._createSource();
        this._dirty = false;
      }
    };
    SourceManager2.prototype._createSource = function() {
      this._setLocalSource([], []);
      var sourceHost = this._sourceHost;
      var upSourceMgrList = this._getUpstreamSourceManagers();
      var hasUpstream = !!upSourceMgrList.length;
      var resultSourceList;
      var upstreamSignList;
      if (isSeries(sourceHost)) {
        var seriesModel = sourceHost;
        var data = void 0;
        var sourceFormat = void 0;
        var upSource = void 0;
        if (hasUpstream) {
          var upSourceMgr = upSourceMgrList[0];
          upSourceMgr.prepareSource();
          upSource = upSourceMgr.getSource();
          data = upSource.data;
          sourceFormat = upSource.sourceFormat;
          upstreamSignList = [upSourceMgr._getVersionSign()];
        } else {
          data = seriesModel.get("data", true);
          sourceFormat = isTypedArray(data) ? SOURCE_FORMAT_TYPED_ARRAY : SOURCE_FORMAT_ORIGINAL;
          upstreamSignList = [];
        }
        var newMetaRawOption = this._getSourceMetaRawOption() || {};
        var upMetaRawOption = upSource && upSource.metaRawOption || {};
        var seriesLayoutBy = retrieve2(newMetaRawOption.seriesLayoutBy, upMetaRawOption.seriesLayoutBy) || null;
        var sourceHeader = retrieve2(newMetaRawOption.sourceHeader, upMetaRawOption.sourceHeader);
        var dimensions = retrieve2(newMetaRawOption.dimensions, upMetaRawOption.dimensions);
        var needsCreateSource = seriesLayoutBy !== upMetaRawOption.seriesLayoutBy || !!sourceHeader !== !!upMetaRawOption.sourceHeader || dimensions;
        resultSourceList = needsCreateSource ? [createSource(data, {
          seriesLayoutBy,
          sourceHeader,
          dimensions
        }, sourceFormat)] : [];
      } else {
        var datasetModel = sourceHost;
        if (hasUpstream) {
          var result = this._applyTransform(upSourceMgrList);
          resultSourceList = result.sourceList;
          upstreamSignList = result.upstreamSignList;
        } else {
          var sourceData = datasetModel.get("source", true);
          resultSourceList = [createSource(sourceData, this._getSourceMetaRawOption(), null)];
          upstreamSignList = [];
        }
      }
      if (true) {
        assert(resultSourceList && upstreamSignList);
      }
      this._setLocalSource(resultSourceList, upstreamSignList);
    };
    SourceManager2.prototype._applyTransform = function(upMgrList) {
      var datasetModel = this._sourceHost;
      var transformOption = datasetModel.get("transform", true);
      var fromTransformResult = datasetModel.get("fromTransformResult", true);
      if (true) {
        assert(fromTransformResult != null || transformOption != null);
      }
      if (fromTransformResult != null) {
        var errMsg = "";
        if (upMgrList.length !== 1) {
          if (true) {
            errMsg = "When using `fromTransformResult`, there should be only one upstream dataset";
          }
          doThrow(errMsg);
        }
      }
      var sourceList;
      var upSourceList = [];
      var upstreamSignList = [];
      each(upMgrList, function(upMgr) {
        upMgr.prepareSource();
        var upSource = upMgr.getSource(fromTransformResult || 0);
        var errMsg2 = "";
        if (fromTransformResult != null && !upSource) {
          if (true) {
            errMsg2 = "Can not retrieve result by `fromTransformResult`: " + fromTransformResult;
          }
          doThrow(errMsg2);
        }
        upSourceList.push(upSource);
        upstreamSignList.push(upMgr._getVersionSign());
      });
      if (transformOption) {
        sourceList = applyDataTransform(transformOption, upSourceList, {
          datasetIndex: datasetModel.componentIndex
        });
      } else if (fromTransformResult != null) {
        sourceList = [cloneSourceShallow(upSourceList[0])];
      }
      return {
        sourceList,
        upstreamSignList
      };
    };
    SourceManager2.prototype._isDirty = function() {
      if (this._dirty) {
        return true;
      }
      var upSourceMgrList = this._getUpstreamSourceManagers();
      for (var i = 0; i < upSourceMgrList.length; i++) {
        var upSrcMgr = upSourceMgrList[i];
        if (
          // Consider the case that there is ancestor diry, call it recursively.
          // The performance is probably not an issue because usually the chain is not long.
          upSrcMgr._isDirty() || this._upstreamSignList[i] !== upSrcMgr._getVersionSign()
        ) {
          return true;
        }
      }
    };
    SourceManager2.prototype.getSource = function(sourceIndex) {
      sourceIndex = sourceIndex || 0;
      var source = this._sourceList[sourceIndex];
      if (!source) {
        var upSourceMgrList = this._getUpstreamSourceManagers();
        return upSourceMgrList[0] && upSourceMgrList[0].getSource(sourceIndex);
      }
      return source;
    };
    SourceManager2.prototype.getSharedDataStore = function(seriesDimRequest) {
      if (true) {
        assert(isSeries(this._sourceHost), "Can only call getDataStore on series source manager.");
      }
      var schema = seriesDimRequest.makeStoreSchema();
      return this._innerGetDataStore(schema.dimensions, seriesDimRequest.source, schema.hash);
    };
    SourceManager2.prototype._innerGetDataStore = function(storeDims, seriesSource, sourceReadKey) {
      var sourceIndex = 0;
      var storeList = this._storeList;
      var cachedStoreMap = storeList[sourceIndex];
      if (!cachedStoreMap) {
        cachedStoreMap = storeList[sourceIndex] = {};
      }
      var cachedStore = cachedStoreMap[sourceReadKey];
      if (!cachedStore) {
        var upSourceMgr = this._getUpstreamSourceManagers()[0];
        if (isSeries(this._sourceHost) && upSourceMgr) {
          cachedStore = upSourceMgr._innerGetDataStore(storeDims, seriesSource, sourceReadKey);
        } else {
          cachedStore = new DataStore_default();
          cachedStore.initData(new DefaultDataProvider(seriesSource, storeDims.length), storeDims);
        }
        cachedStoreMap[sourceReadKey] = cachedStore;
      }
      return cachedStore;
    };
    SourceManager2.prototype._getUpstreamSourceManagers = function() {
      var sourceHost = this._sourceHost;
      if (isSeries(sourceHost)) {
        var datasetModel = querySeriesUpstreamDatasetModel(sourceHost);
        return !datasetModel ? [] : [datasetModel.getSourceManager()];
      } else {
        return map(queryDatasetUpstreamDatasetModels(sourceHost), function(datasetModel2) {
          return datasetModel2.getSourceManager();
        });
      }
    };
    SourceManager2.prototype._getSourceMetaRawOption = function() {
      var sourceHost = this._sourceHost;
      var seriesLayoutBy;
      var sourceHeader;
      var dimensions;
      if (isSeries(sourceHost)) {
        seriesLayoutBy = sourceHost.get("seriesLayoutBy", true);
        sourceHeader = sourceHost.get("sourceHeader", true);
        dimensions = sourceHost.get("dimensions", true);
      } else if (!this._getUpstreamSourceManagers().length) {
        var model = sourceHost;
        seriesLayoutBy = model.get("seriesLayoutBy", true);
        sourceHeader = model.get("sourceHeader", true);
        dimensions = model.get("dimensions", true);
      }
      return {
        seriesLayoutBy,
        sourceHeader,
        dimensions
      };
    };
    return SourceManager2;
  }()
);
function disableTransformOptionMerge(datasetModel) {
  var transformOption = datasetModel.option.transform;
  transformOption && setAsPrimitive(datasetModel.option.transform);
}
function isSeries(sourceHost) {
  return sourceHost.mainType === "series";
}
function doThrow(errMsg) {
  throw new Error(errMsg);
}

// node_modules/echarts/lib/component/tooltip/tooltipMarkup.js
var TOOLTIP_LINE_HEIGHT_CSS = "line-height:1";
function getTooltipTextStyle(textStyle, renderMode) {
  var nameFontColor = textStyle.color || "#6e7079";
  var nameFontSize = textStyle.fontSize || 12;
  var nameFontWeight = textStyle.fontWeight || "400";
  var valueFontColor = textStyle.color || "#464646";
  var valueFontSize = textStyle.fontSize || 14;
  var valueFontWeight = textStyle.fontWeight || "900";
  if (renderMode === "html") {
    return {
      // eslint-disable-next-line max-len
      nameStyle: "font-size:" + encodeHTML(nameFontSize + "") + "px;color:" + encodeHTML(nameFontColor) + ";font-weight:" + encodeHTML(nameFontWeight + ""),
      // eslint-disable-next-line max-len
      valueStyle: "font-size:" + encodeHTML(valueFontSize + "") + "px;color:" + encodeHTML(valueFontColor) + ";font-weight:" + encodeHTML(valueFontWeight + "")
    };
  } else {
    return {
      nameStyle: {
        fontSize: nameFontSize,
        fill: nameFontColor,
        fontWeight: nameFontWeight
      },
      valueStyle: {
        fontSize: valueFontSize,
        fill: valueFontColor,
        fontWeight: valueFontWeight
      }
    };
  }
}
var HTML_GAPS = [0, 10, 20, 30];
var RICH_TEXT_GAPS = ["", "\n", "\n\n", "\n\n\n"];
function createTooltipMarkup(type, option) {
  option.type = type;
  return option;
}
function isSectionFragment(frag) {
  return frag.type === "section";
}
function getBuilder(frag) {
  return isSectionFragment(frag) ? buildSection : buildNameValue;
}
function getBlockGapLevel(frag) {
  if (isSectionFragment(frag)) {
    var gapLevel_1 = 0;
    var subBlockLen = frag.blocks.length;
    var hasInnerGap_1 = subBlockLen > 1 || subBlockLen > 0 && !frag.noHeader;
    each(frag.blocks, function(subBlock) {
      var subGapLevel = getBlockGapLevel(subBlock);
      if (subGapLevel >= gapLevel_1) {
        gapLevel_1 = subGapLevel + +(hasInnerGap_1 && // 0 always can not be readable gap level.
        (!subGapLevel || isSectionFragment(subBlock) && !subBlock.noHeader));
      }
    });
    return gapLevel_1;
  }
  return 0;
}
function buildSection(ctx, fragment, topMarginForOuterGap, toolTipTextStyle) {
  var noHeader = fragment.noHeader;
  var gaps = getGap(getBlockGapLevel(fragment));
  var subMarkupTextList = [];
  var subBlocks = fragment.blocks || [];
  assert(!subBlocks || isArray(subBlocks));
  subBlocks = subBlocks || [];
  var orderMode = ctx.orderMode;
  if (fragment.sortBlocks && orderMode) {
    subBlocks = subBlocks.slice();
    var orderMap = {
      valueAsc: "asc",
      valueDesc: "desc"
    };
    if (hasOwn(orderMap, orderMode)) {
      var comparator_1 = new SortOrderComparator(orderMap[orderMode], null);
      subBlocks.sort(function(a, b) {
        return comparator_1.evaluate(a.sortParam, b.sortParam);
      });
    } else if (orderMode === "seriesDesc") {
      subBlocks.reverse();
    }
  }
  each(subBlocks, function(subBlock, idx) {
    var valueFormatter = fragment.valueFormatter;
    var subMarkupText2 = getBuilder(subBlock)(
      // Inherit valueFormatter
      valueFormatter ? extend(extend({}, ctx), {
        valueFormatter
      }) : ctx,
      subBlock,
      idx > 0 ? gaps.html : 0,
      toolTipTextStyle
    );
    subMarkupText2 != null && subMarkupTextList.push(subMarkupText2);
  });
  var subMarkupText = ctx.renderMode === "richText" ? subMarkupTextList.join(gaps.richText) : wrapBlockHTML(subMarkupTextList.join(""), noHeader ? topMarginForOuterGap : gaps.html);
  if (noHeader) {
    return subMarkupText;
  }
  var displayableHeader = makeValueReadable(fragment.header, "ordinal", ctx.useUTC);
  var nameStyle = getTooltipTextStyle(toolTipTextStyle, ctx.renderMode).nameStyle;
  if (ctx.renderMode === "richText") {
    return wrapInlineNameRichText(ctx, displayableHeader, nameStyle) + gaps.richText + subMarkupText;
  } else {
    return wrapBlockHTML('<div style="' + nameStyle + ";" + TOOLTIP_LINE_HEIGHT_CSS + ';">' + encodeHTML(displayableHeader) + "</div>" + subMarkupText, topMarginForOuterGap);
  }
}
function buildNameValue(ctx, fragment, topMarginForOuterGap, toolTipTextStyle) {
  var renderMode = ctx.renderMode;
  var noName = fragment.noName;
  var noValue = fragment.noValue;
  var noMarker = !fragment.markerType;
  var name = fragment.name;
  var useUTC = ctx.useUTC;
  var valueFormatter = fragment.valueFormatter || ctx.valueFormatter || function(value) {
    value = isArray(value) ? value : [value];
    return map(value, function(val, idx) {
      return makeValueReadable(val, isArray(valueTypeOption) ? valueTypeOption[idx] : valueTypeOption, useUTC);
    });
  };
  if (noName && noValue) {
    return;
  }
  var markerStr = noMarker ? "" : ctx.markupStyleCreator.makeTooltipMarker(fragment.markerType, fragment.markerColor || "#333", renderMode);
  var readableName = noName ? "" : makeValueReadable(name, "ordinal", useUTC);
  var valueTypeOption = fragment.valueType;
  var readableValueList = noValue ? [] : valueFormatter(fragment.value);
  var valueAlignRight = !noMarker || !noName;
  var valueCloseToMarker = !noMarker && noName;
  var _a2 = getTooltipTextStyle(toolTipTextStyle, renderMode), nameStyle = _a2.nameStyle, valueStyle = _a2.valueStyle;
  return renderMode === "richText" ? (noMarker ? "" : markerStr) + (noName ? "" : wrapInlineNameRichText(ctx, readableName, nameStyle)) + (noValue ? "" : wrapInlineValueRichText(ctx, readableValueList, valueAlignRight, valueCloseToMarker, valueStyle)) : wrapBlockHTML((noMarker ? "" : markerStr) + (noName ? "" : wrapInlineNameHTML(readableName, !noMarker, nameStyle)) + (noValue ? "" : wrapInlineValueHTML(readableValueList, valueAlignRight, valueCloseToMarker, valueStyle)), topMarginForOuterGap);
}
function buildTooltipMarkup(fragment, markupStyleCreator, renderMode, orderMode, useUTC, toolTipTextStyle) {
  if (!fragment) {
    return;
  }
  var builder = getBuilder(fragment);
  var ctx = {
    useUTC,
    renderMode,
    orderMode,
    markupStyleCreator,
    valueFormatter: fragment.valueFormatter
  };
  return builder(ctx, fragment, 0, toolTipTextStyle);
}
function getGap(gapLevel) {
  return {
    html: HTML_GAPS[gapLevel],
    richText: RICH_TEXT_GAPS[gapLevel]
  };
}
function wrapBlockHTML(encodedContent, topGap) {
  var clearfix = '<div style="clear:both"></div>';
  var marginCSS = "margin: " + topGap + "px 0 0";
  return '<div style="' + marginCSS + ";" + TOOLTIP_LINE_HEIGHT_CSS + ';">' + encodedContent + clearfix + "</div>";
}
function wrapInlineNameHTML(name, leftHasMarker, style) {
  var marginCss = leftHasMarker ? "margin-left:2px" : "";
  return '<span style="' + style + ";" + marginCss + '">' + encodeHTML(name) + "</span>";
}
function wrapInlineValueHTML(valueList, alignRight, valueCloseToMarker, style) {
  var paddingStr = valueCloseToMarker ? "10px" : "20px";
  var alignCSS = alignRight ? "float:right;margin-left:" + paddingStr : "";
  valueList = isArray(valueList) ? valueList : [valueList];
  return '<span style="' + alignCSS + ";" + style + '">' + map(valueList, function(value) {
    return encodeHTML(value);
  }).join("&nbsp;&nbsp;") + "</span>";
}
function wrapInlineNameRichText(ctx, name, style) {
  return ctx.markupStyleCreator.wrapRichTextStyle(name, style);
}
function wrapInlineValueRichText(ctx, values, alignRight, valueCloseToMarker, style) {
  var styles = [style];
  var paddingLeft = valueCloseToMarker ? 10 : 20;
  alignRight && styles.push({
    padding: [0, 0, 0, paddingLeft],
    align: "right"
  });
  return ctx.markupStyleCreator.wrapRichTextStyle(isArray(values) ? values.join("  ") : values, styles);
}
function retrieveVisualColorForTooltipMarker(series, dataIndex) {
  var style = series.getData().getItemVisual(dataIndex, "style");
  var color = style[series.visualDrawType];
  return convertToColorString(color);
}
function getPaddingFromTooltipModel(model, renderMode) {
  var padding = model.get("padding");
  return padding != null ? padding : renderMode === "richText" ? [8, 10] : 10;
}
var TooltipMarkupStyleCreator = (
  /** @class */
  function() {
    function TooltipMarkupStyleCreator2() {
      this.richTextStyles = {};
      this._nextStyleNameId = getRandomIdBase();
    }
    TooltipMarkupStyleCreator2.prototype._generateStyleName = function() {
      return "__EC_aUTo_" + this._nextStyleNameId++;
    };
    TooltipMarkupStyleCreator2.prototype.makeTooltipMarker = function(markerType, colorStr, renderMode) {
      var markerId = renderMode === "richText" ? this._generateStyleName() : null;
      var marker = getTooltipMarker({
        color: colorStr,
        type: markerType,
        renderMode,
        markerId
      });
      if (isString(marker)) {
        return marker;
      } else {
        if (true) {
          assert(markerId);
        }
        this.richTextStyles[markerId] = marker.style;
        return marker.content;
      }
    };
    TooltipMarkupStyleCreator2.prototype.wrapRichTextStyle = function(text, styles) {
      var finalStl = {};
      if (isArray(styles)) {
        each(styles, function(stl) {
          return extend(finalStl, stl);
        });
      } else {
        extend(finalStl, styles);
      }
      var styleName = this._generateStyleName();
      this.richTextStyles[styleName] = finalStl;
      return "{" + styleName + "|" + text + "}";
    };
    return TooltipMarkupStyleCreator2;
  }()
);

// node_modules/echarts/lib/component/tooltip/seriesFormatTooltip.js
function defaultSeriesFormatTooltip(opt) {
  var series = opt.series;
  var dataIndex = opt.dataIndex;
  var multipleSeries = opt.multipleSeries;
  var data = series.getData();
  var tooltipDims = data.mapDimensionsAll("defaultedTooltip");
  var tooltipDimLen = tooltipDims.length;
  var value = series.getRawValue(dataIndex);
  var isValueArr = isArray(value);
  var markerColor = retrieveVisualColorForTooltipMarker(series, dataIndex);
  var inlineValue;
  var inlineValueType;
  var subBlocks;
  var sortParam;
  if (tooltipDimLen > 1 || isValueArr && !tooltipDimLen) {
    var formatArrResult = formatTooltipArrayValue(value, series, dataIndex, tooltipDims, markerColor);
    inlineValue = formatArrResult.inlineValues;
    inlineValueType = formatArrResult.inlineValueTypes;
    subBlocks = formatArrResult.blocks;
    sortParam = formatArrResult.inlineValues[0];
  } else if (tooltipDimLen) {
    var dimInfo = data.getDimensionInfo(tooltipDims[0]);
    sortParam = inlineValue = retrieveRawValue(data, dataIndex, tooltipDims[0]);
    inlineValueType = dimInfo.type;
  } else {
    sortParam = inlineValue = isValueArr ? value[0] : value;
  }
  var seriesNameSpecified = isNameSpecified(series);
  var seriesName = seriesNameSpecified && series.name || "";
  var itemName = data.getName(dataIndex);
  var inlineName = multipleSeries ? seriesName : itemName;
  return createTooltipMarkup("section", {
    header: seriesName,
    // When series name is not specified, do not show a header line with only '-'.
    // This case always happens in tooltip.trigger: 'item'.
    noHeader: multipleSeries || !seriesNameSpecified,
    sortParam,
    blocks: [createTooltipMarkup("nameValue", {
      markerType: "item",
      markerColor,
      // Do not mix display seriesName and itemName in one tooltip,
      // which might confuses users.
      name: inlineName,
      // name dimension might be auto assigned, where the name might
      // be not readable. So we check trim here.
      noName: !trim(inlineName),
      value: inlineValue,
      valueType: inlineValueType
    })].concat(subBlocks || [])
  });
}
function formatTooltipArrayValue(value, series, dataIndex, tooltipDims, colorStr) {
  var data = series.getData();
  var isValueMultipleLine = reduce(value, function(isValueMultipleLine2, val, idx) {
    var dimItem = data.getDimensionInfo(idx);
    return isValueMultipleLine2 = isValueMultipleLine2 || dimItem && dimItem.tooltip !== false && dimItem.displayName != null;
  }, false);
  var inlineValues = [];
  var inlineValueTypes = [];
  var blocks = [];
  tooltipDims.length ? each(tooltipDims, function(dim) {
    setEachItem(retrieveRawValue(data, dataIndex, dim), dim);
  }) : each(value, setEachItem);
  function setEachItem(val, dim) {
    var dimInfo = data.getDimensionInfo(dim);
    if (!dimInfo || dimInfo.otherDims.tooltip === false) {
      return;
    }
    if (isValueMultipleLine) {
      blocks.push(createTooltipMarkup("nameValue", {
        markerType: "subItem",
        markerColor: colorStr,
        name: dimInfo.displayName,
        value: val,
        valueType: dimInfo.type
      }));
    } else {
      inlineValues.push(val);
      inlineValueTypes.push(dimInfo.type);
    }
  }
  return {
    inlineValues,
    inlineValueTypes,
    blocks
  };
}

// node_modules/echarts/lib/model/Series.js
var inner2 = makeInner();
function getSelectionKey(data, dataIndex) {
  return data.getName(dataIndex) || data.getId(dataIndex);
}
var SERIES_UNIVERSAL_TRANSITION_PROP = "__universalTransitionEnabled";
var SeriesModel = (
  /** @class */
  function(_super) {
    __extends(SeriesModel2, _super);
    function SeriesModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this._selectedDataIndicesMap = {};
      return _this;
    }
    SeriesModel2.prototype.init = function(option, parentModel, ecModel) {
      this.seriesIndex = this.componentIndex;
      this.dataTask = createTask({
        count: dataTaskCount,
        reset: dataTaskReset
      });
      this.dataTask.context = {
        model: this
      };
      this.mergeDefaultAndTheme(option, ecModel);
      var sourceManager = inner2(this).sourceManager = new SourceManager(this);
      sourceManager.prepareSource();
      var data = this.getInitialData(option, ecModel);
      wrapData(data, this);
      this.dataTask.context.data = data;
      if (true) {
        assert(data, "getInitialData returned invalid data.");
      }
      inner2(this).dataBeforeProcessed = data;
      autoSeriesName(this);
      this._initSelectedMapFromData(data);
    };
    SeriesModel2.prototype.mergeDefaultAndTheme = function(option, ecModel) {
      var layoutMode = fetchLayoutMode(this);
      var inputPositionParams = layoutMode ? getLayoutParams(option) : {};
      var themeSubType = this.subType;
      if (Component_default.hasClass(themeSubType)) {
        themeSubType += "Series";
      }
      merge(option, ecModel.getTheme().get(this.subType));
      merge(option, this.getDefaultOption());
      defaultEmphasis(option, "label", ["show"]);
      this.fillDataTextStyle(option.data);
      if (layoutMode) {
        mergeLayoutParam(option, inputPositionParams, layoutMode);
      }
    };
    SeriesModel2.prototype.mergeOption = function(newSeriesOption, ecModel) {
      newSeriesOption = merge(this.option, newSeriesOption, true);
      this.fillDataTextStyle(newSeriesOption.data);
      var layoutMode = fetchLayoutMode(this);
      if (layoutMode) {
        mergeLayoutParam(this.option, newSeriesOption, layoutMode);
      }
      var sourceManager = inner2(this).sourceManager;
      sourceManager.dirty();
      sourceManager.prepareSource();
      var data = this.getInitialData(newSeriesOption, ecModel);
      wrapData(data, this);
      this.dataTask.dirty();
      this.dataTask.context.data = data;
      inner2(this).dataBeforeProcessed = data;
      autoSeriesName(this);
      this._initSelectedMapFromData(data);
    };
    SeriesModel2.prototype.fillDataTextStyle = function(data) {
      if (data && !isTypedArray(data)) {
        var props = ["show"];
        for (var i = 0; i < data.length; i++) {
          if (data[i] && data[i].label) {
            defaultEmphasis(data[i], "label", props);
          }
        }
      }
    };
    SeriesModel2.prototype.getInitialData = function(option, ecModel) {
      return;
    };
    SeriesModel2.prototype.appendData = function(params) {
      var data = this.getRawData();
      data.appendData(params.data);
    };
    SeriesModel2.prototype.getData = function(dataType) {
      var task = getCurrentTask(this);
      if (task) {
        var data = task.context.data;
        return dataType == null ? data : data.getLinkedData(dataType);
      } else {
        return inner2(this).data;
      }
    };
    SeriesModel2.prototype.getAllData = function() {
      var mainData = this.getData();
      return mainData && mainData.getLinkedDataAll ? mainData.getLinkedDataAll() : [{
        data: mainData
      }];
    };
    SeriesModel2.prototype.setData = function(data) {
      var task = getCurrentTask(this);
      if (task) {
        var context = task.context;
        context.outputData = data;
        if (task !== this.dataTask) {
          context.data = data;
        }
      }
      inner2(this).data = data;
    };
    SeriesModel2.prototype.getEncode = function() {
      var encode = this.get("encode", true);
      if (encode) {
        return createHashMap(encode);
      }
    };
    SeriesModel2.prototype.getSourceManager = function() {
      return inner2(this).sourceManager;
    };
    SeriesModel2.prototype.getSource = function() {
      return this.getSourceManager().getSource();
    };
    SeriesModel2.prototype.getRawData = function() {
      return inner2(this).dataBeforeProcessed;
    };
    SeriesModel2.prototype.getColorBy = function() {
      var colorBy = this.get("colorBy");
      return colorBy || "series";
    };
    SeriesModel2.prototype.isColorBySeries = function() {
      return this.getColorBy() === "series";
    };
    SeriesModel2.prototype.getBaseAxis = function() {
      var coordSys = this.coordinateSystem;
      return coordSys && coordSys.getBaseAxis && coordSys.getBaseAxis();
    };
    SeriesModel2.prototype.formatTooltip = function(dataIndex, multipleSeries, dataType) {
      return defaultSeriesFormatTooltip({
        series: this,
        dataIndex,
        multipleSeries
      });
    };
    SeriesModel2.prototype.isAnimationEnabled = function() {
      var ecModel = this.ecModel;
      if (env_default.node && !(ecModel && ecModel.ssr)) {
        return false;
      }
      var animationEnabled = this.getShallow("animation");
      if (animationEnabled) {
        if (this.getData().count() > this.getShallow("animationThreshold")) {
          animationEnabled = false;
        }
      }
      return !!animationEnabled;
    };
    SeriesModel2.prototype.restoreData = function() {
      this.dataTask.dirty();
    };
    SeriesModel2.prototype.getColorFromPalette = function(name, scope, requestColorNum) {
      var ecModel = this.ecModel;
      var color = PaletteMixin.prototype.getColorFromPalette.call(this, name, scope, requestColorNum);
      if (!color) {
        color = ecModel.getColorFromPalette(name, scope, requestColorNum);
      }
      return color;
    };
    SeriesModel2.prototype.coordDimToDataDim = function(coordDim) {
      return this.getRawData().mapDimensionsAll(coordDim);
    };
    SeriesModel2.prototype.getProgressive = function() {
      return this.get("progressive");
    };
    SeriesModel2.prototype.getProgressiveThreshold = function() {
      return this.get("progressiveThreshold");
    };
    SeriesModel2.prototype.select = function(innerDataIndices, dataType) {
      this._innerSelect(this.getData(dataType), innerDataIndices);
    };
    SeriesModel2.prototype.unselect = function(innerDataIndices, dataType) {
      var selectedMap = this.option.selectedMap;
      if (!selectedMap) {
        return;
      }
      var selectedMode = this.option.selectedMode;
      var data = this.getData(dataType);
      if (selectedMode === "series" || selectedMap === "all") {
        this.option.selectedMap = {};
        this._selectedDataIndicesMap = {};
        return;
      }
      for (var i = 0; i < innerDataIndices.length; i++) {
        var dataIndex = innerDataIndices[i];
        var nameOrId = getSelectionKey(data, dataIndex);
        selectedMap[nameOrId] = false;
        this._selectedDataIndicesMap[nameOrId] = -1;
      }
    };
    SeriesModel2.prototype.toggleSelect = function(innerDataIndices, dataType) {
      var tmpArr = [];
      for (var i = 0; i < innerDataIndices.length; i++) {
        tmpArr[0] = innerDataIndices[i];
        this.isSelected(innerDataIndices[i], dataType) ? this.unselect(tmpArr, dataType) : this.select(tmpArr, dataType);
      }
    };
    SeriesModel2.prototype.getSelectedDataIndices = function() {
      if (this.option.selectedMap === "all") {
        return [].slice.call(this.getData().getIndices());
      }
      var selectedDataIndicesMap = this._selectedDataIndicesMap;
      var nameOrIds = keys(selectedDataIndicesMap);
      var dataIndices = [];
      for (var i = 0; i < nameOrIds.length; i++) {
        var dataIndex = selectedDataIndicesMap[nameOrIds[i]];
        if (dataIndex >= 0) {
          dataIndices.push(dataIndex);
        }
      }
      return dataIndices;
    };
    SeriesModel2.prototype.isSelected = function(dataIndex, dataType) {
      var selectedMap = this.option.selectedMap;
      if (!selectedMap) {
        return false;
      }
      var data = this.getData(dataType);
      return (selectedMap === "all" || selectedMap[getSelectionKey(data, dataIndex)]) && !data.getItemModel(dataIndex).get(["select", "disabled"]);
    };
    SeriesModel2.prototype.isUniversalTransitionEnabled = function() {
      if (this[SERIES_UNIVERSAL_TRANSITION_PROP]) {
        return true;
      }
      var universalTransitionOpt = this.option.universalTransition;
      if (!universalTransitionOpt) {
        return false;
      }
      if (universalTransitionOpt === true) {
        return true;
      }
      return universalTransitionOpt && universalTransitionOpt.enabled;
    };
    SeriesModel2.prototype._innerSelect = function(data, innerDataIndices) {
      var _a2, _b2;
      var option = this.option;
      var selectedMode = option.selectedMode;
      var len = innerDataIndices.length;
      if (!selectedMode || !len) {
        return;
      }
      if (selectedMode === "series") {
        option.selectedMap = "all";
      } else if (selectedMode === "multiple") {
        if (!isObject(option.selectedMap)) {
          option.selectedMap = {};
        }
        var selectedMap = option.selectedMap;
        for (var i = 0; i < len; i++) {
          var dataIndex = innerDataIndices[i];
          var nameOrId = getSelectionKey(data, dataIndex);
          selectedMap[nameOrId] = true;
          this._selectedDataIndicesMap[nameOrId] = data.getRawIndex(dataIndex);
        }
      } else if (selectedMode === "single" || selectedMode === true) {
        var lastDataIndex = innerDataIndices[len - 1];
        var nameOrId = getSelectionKey(data, lastDataIndex);
        option.selectedMap = (_a2 = {}, _a2[nameOrId] = true, _a2);
        this._selectedDataIndicesMap = (_b2 = {}, _b2[nameOrId] = data.getRawIndex(lastDataIndex), _b2);
      }
    };
    SeriesModel2.prototype._initSelectedMapFromData = function(data) {
      if (this.option.selectedMap) {
        return;
      }
      var dataIndices = [];
      if (data.hasItemOption) {
        data.each(function(idx) {
          var rawItem = data.getRawDataItem(idx);
          if (rawItem && rawItem.selected) {
            dataIndices.push(idx);
          }
        });
      }
      if (dataIndices.length > 0) {
        this._innerSelect(data, dataIndices);
      }
    };
    SeriesModel2.registerClass = function(clz) {
      return Component_default.registerClass(clz);
    };
    SeriesModel2.protoInitialize = function() {
      var proto2 = SeriesModel2.prototype;
      proto2.type = "series.__base__";
      proto2.seriesIndex = 0;
      proto2.ignoreStyleOnData = false;
      proto2.hasSymbolVisual = false;
      proto2.defaultSymbol = "circle";
      proto2.visualStyleAccessPath = "itemStyle";
      proto2.visualDrawType = "fill";
    }();
    return SeriesModel2;
  }(Component_default)
);
mixin(SeriesModel, DataFormatMixin);
mixin(SeriesModel, PaletteMixin);
mountExtend(SeriesModel, Component_default);
function autoSeriesName(seriesModel) {
  var name = seriesModel.name;
  if (!isNameSpecified(seriesModel)) {
    seriesModel.name = getSeriesAutoName(seriesModel) || name;
  }
}
function getSeriesAutoName(seriesModel) {
  var data = seriesModel.getRawData();
  var dataDims = data.mapDimensionsAll("seriesName");
  var nameArr = [];
  each(dataDims, function(dataDim) {
    var dimInfo = data.getDimensionInfo(dataDim);
    dimInfo.displayName && nameArr.push(dimInfo.displayName);
  });
  return nameArr.join(" ");
}
function dataTaskCount(context) {
  return context.model.getRawData().count();
}
function dataTaskReset(context) {
  var seriesModel = context.model;
  seriesModel.setData(seriesModel.getRawData().cloneShallow());
  return dataTaskProgress;
}
function dataTaskProgress(param, context) {
  if (context.outputData && param.end > context.outputData.count()) {
    context.model.getRawData().cloneShallow(context.outputData);
  }
}
function wrapData(data, seriesModel) {
  each(concatArray(data.CHANGABLE_METHODS, data.DOWNSAMPLE_METHODS), function(methodName) {
    data.wrapMethod(methodName, curry(onDataChange, seriesModel));
  });
}
function onDataChange(seriesModel, newList) {
  var task = getCurrentTask(seriesModel);
  if (task) {
    task.setOutputEnd((newList || this).count());
  }
  return newList;
}
function getCurrentTask(seriesModel) {
  var scheduler = (seriesModel.ecModel || {}).scheduler;
  var pipeline = scheduler && scheduler.getPipeline(seriesModel.uid);
  if (pipeline) {
    var task = pipeline.currentTask;
    if (task) {
      var agentStubMap = task.agentStubMap;
      if (agentStubMap) {
        task = agentStubMap.get(seriesModel.uid);
      }
    }
    return task;
  }
}
var Series_default = SeriesModel;

// node_modules/echarts/lib/view/Component.js
var ComponentView = (
  /** @class */
  function() {
    function ComponentView2() {
      this.group = new Group_default();
      this.uid = getUID("viewComponent");
    }
    ComponentView2.prototype.init = function(ecModel, api) {
    };
    ComponentView2.prototype.render = function(model, ecModel, api, payload) {
    };
    ComponentView2.prototype.dispose = function(ecModel, api) {
    };
    ComponentView2.prototype.updateView = function(model, ecModel, api, payload) {
    };
    ComponentView2.prototype.updateLayout = function(model, ecModel, api, payload) {
    };
    ComponentView2.prototype.updateVisual = function(model, ecModel, api, payload) {
    };
    ComponentView2.prototype.toggleBlurSeries = function(seriesModels, isBlur, ecModel) {
    };
    ComponentView2.prototype.eachRendered = function(cb) {
      var group = this.group;
      if (group) {
        group.traverse(cb);
      }
    };
    return ComponentView2;
  }()
);
enableClassExtend(ComponentView);
enableClassManagement(ComponentView);
var Component_default2 = ComponentView;

// node_modules/echarts/lib/chart/helper/createRenderPlanner.js
function createRenderPlanner() {
  var inner8 = makeInner();
  return function(seriesModel) {
    var fields = inner8(seriesModel);
    var pipelineContext = seriesModel.pipelineContext;
    var originalLarge = !!fields.large;
    var originalProgressive = !!fields.progressiveRender;
    var large = fields.large = !!(pipelineContext && pipelineContext.large);
    var progressive = fields.progressiveRender = !!(pipelineContext && pipelineContext.progressiveRender);
    return !!(originalLarge !== large || originalProgressive !== progressive) && "reset";
  };
}

// node_modules/echarts/lib/view/Chart.js
var inner3 = makeInner();
var renderPlanner = createRenderPlanner();
var ChartView = (
  /** @class */
  function() {
    function ChartView2() {
      this.group = new Group_default();
      this.uid = getUID("viewChart");
      this.renderTask = createTask({
        plan: renderTaskPlan,
        reset: renderTaskReset
      });
      this.renderTask.context = {
        view: this
      };
    }
    ChartView2.prototype.init = function(ecModel, api) {
    };
    ChartView2.prototype.render = function(seriesModel, ecModel, api, payload) {
      if (true) {
        throw new Error("render method must been implemented");
      }
    };
    ChartView2.prototype.highlight = function(seriesModel, ecModel, api, payload) {
      var data = seriesModel.getData(payload && payload.dataType);
      if (!data) {
        if (true) {
          error("Unknown dataType " + payload.dataType);
        }
        return;
      }
      toggleHighlight(data, payload, "emphasis");
    };
    ChartView2.prototype.downplay = function(seriesModel, ecModel, api, payload) {
      var data = seriesModel.getData(payload && payload.dataType);
      if (!data) {
        if (true) {
          error("Unknown dataType " + payload.dataType);
        }
        return;
      }
      toggleHighlight(data, payload, "normal");
    };
    ChartView2.prototype.remove = function(ecModel, api) {
      this.group.removeAll();
    };
    ChartView2.prototype.dispose = function(ecModel, api) {
    };
    ChartView2.prototype.updateView = function(seriesModel, ecModel, api, payload) {
      this.render(seriesModel, ecModel, api, payload);
    };
    ChartView2.prototype.updateLayout = function(seriesModel, ecModel, api, payload) {
      this.render(seriesModel, ecModel, api, payload);
    };
    ChartView2.prototype.updateVisual = function(seriesModel, ecModel, api, payload) {
      this.render(seriesModel, ecModel, api, payload);
    };
    ChartView2.prototype.eachRendered = function(cb) {
      traverseElements(this.group, cb);
    };
    ChartView2.markUpdateMethod = function(payload, methodName) {
      inner3(payload).updateMethod = methodName;
    };
    ChartView2.protoInitialize = function() {
      var proto2 = ChartView2.prototype;
      proto2.type = "chart";
    }();
    return ChartView2;
  }()
);
function elSetState(el, state, highlightDigit) {
  if (el && isHighDownDispatcher(el)) {
    (state === "emphasis" ? enterEmphasis : leaveEmphasis)(el, highlightDigit);
  }
}
function toggleHighlight(data, payload, state) {
  var dataIndex = queryDataIndex(data, payload);
  var highlightDigit = payload && payload.highlightKey != null ? getHighlightDigit(payload.highlightKey) : null;
  if (dataIndex != null) {
    each(normalizeToArray(dataIndex), function(dataIdx) {
      elSetState(data.getItemGraphicEl(dataIdx), state, highlightDigit);
    });
  } else {
    data.eachItemGraphicEl(function(el) {
      elSetState(el, state, highlightDigit);
    });
  }
}
enableClassExtend(ChartView, ["dispose"]);
enableClassManagement(ChartView);
function renderTaskPlan(context) {
  return renderPlanner(context.model);
}
function renderTaskReset(context) {
  var seriesModel = context.model;
  var ecModel = context.ecModel;
  var api = context.api;
  var payload = context.payload;
  var progressiveRender = seriesModel.pipelineContext.progressiveRender;
  var view = context.view;
  var updateMethod = payload && inner3(payload).updateMethod;
  var methodName = progressiveRender ? "incrementalPrepareRender" : updateMethod && view[updateMethod] ? updateMethod : "render";
  if (methodName !== "render") {
    view[methodName](seriesModel, ecModel, api, payload);
  }
  return progressMethodMap[methodName];
}
var progressMethodMap = {
  incrementalPrepareRender: {
    progress: function(params, context) {
      context.view.incrementalRender(params, context.model, context.ecModel, context.api, context.payload);
    }
  },
  render: {
    // Put view.render in `progress` to support appendData. But in this case
    // view.render should not be called in reset, otherwise it will be called
    // twise. Use `forceFirstProgress` to make sure that view.render is called
    // in any cases.
    forceFirstProgress: true,
    progress: function(params, context) {
      context.view.render(context.model, context.ecModel, context.api, context.payload);
    }
  }
};
var Chart_default = ChartView;

// node_modules/echarts/lib/util/throttle.js
var ORIGIN_METHOD = "\0__throttleOriginMethod";
var RATE = "\0__throttleRate";
var THROTTLE_TYPE = "\0__throttleType";
function throttle(fn, delay, debounce) {
  var currCall;
  var lastCall = 0;
  var lastExec = 0;
  var timer = null;
  var diff;
  var scope;
  var args;
  var debounceNextCall;
  delay = delay || 0;
  function exec() {
    lastExec = (/* @__PURE__ */ new Date()).getTime();
    timer = null;
    fn.apply(scope, args || []);
  }
  var cb = function() {
    var cbArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      cbArgs[_i] = arguments[_i];
    }
    currCall = (/* @__PURE__ */ new Date()).getTime();
    scope = this;
    args = cbArgs;
    var thisDelay = debounceNextCall || delay;
    var thisDebounce = debounceNextCall || debounce;
    debounceNextCall = null;
    diff = currCall - (thisDebounce ? lastCall : lastExec) - thisDelay;
    clearTimeout(timer);
    if (thisDebounce) {
      timer = setTimeout(exec, thisDelay);
    } else {
      if (diff >= 0) {
        exec();
      } else {
        timer = setTimeout(exec, -diff);
      }
    }
    lastCall = currCall;
  };
  cb.clear = function() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  cb.debounceNextCall = function(debounceDelay) {
    debounceNextCall = debounceDelay;
  };
  return cb;
}
function createOrUpdate(obj, fnAttr, rate, throttleType) {
  var fn = obj[fnAttr];
  if (!fn) {
    return;
  }
  var originFn = fn[ORIGIN_METHOD] || fn;
  var lastThrottleType = fn[THROTTLE_TYPE];
  var lastRate = fn[RATE];
  if (lastRate !== rate || lastThrottleType !== throttleType) {
    if (rate == null || !throttleType) {
      return obj[fnAttr] = originFn;
    }
    fn = obj[fnAttr] = throttle(originFn, rate, throttleType === "debounce");
    fn[ORIGIN_METHOD] = originFn;
    fn[THROTTLE_TYPE] = throttleType;
    fn[RATE] = rate;
  }
  return fn;
}
function clear(obj, fnAttr) {
  var fn = obj[fnAttr];
  if (fn && fn[ORIGIN_METHOD]) {
    fn.clear && fn.clear();
    obj[fnAttr] = fn[ORIGIN_METHOD];
  }
}

// node_modules/echarts/lib/model/globalDefault.js
var platform = "";
if (typeof navigator !== "undefined") {
  platform = navigator.platform || "";
}
var decalColor = "rgba(0, 0, 0, 0.2)";
var globalDefault_default = {
  darkMode: "auto",
  // backgroundColor: 'rgba(0,0,0,0)',
  colorBy: "series",
  color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
  gradientColor: ["#f6efa6", "#d88273", "#bf444c"],
  aria: {
    decal: {
      decals: [{
        color: decalColor,
        dashArrayX: [1, 0],
        dashArrayY: [2, 5],
        symbolSize: 1,
        rotation: Math.PI / 6
      }, {
        color: decalColor,
        symbol: "circle",
        dashArrayX: [[8, 8], [0, 8, 8, 0]],
        dashArrayY: [6, 0],
        symbolSize: 0.8
      }, {
        color: decalColor,
        dashArrayX: [1, 0],
        dashArrayY: [4, 3],
        rotation: -Math.PI / 4
      }, {
        color: decalColor,
        dashArrayX: [[6, 6], [0, 6, 6, 0]],
        dashArrayY: [6, 0]
      }, {
        color: decalColor,
        dashArrayX: [[1, 0], [1, 6]],
        dashArrayY: [1, 0, 6, 0],
        rotation: Math.PI / 4
      }, {
        color: decalColor,
        symbol: "triangle",
        dashArrayX: [[9, 9], [0, 9, 9, 0]],
        dashArrayY: [7, 2],
        symbolSize: 0.75
      }]
    }
  },
  // If xAxis and yAxis declared, grid is created by default.
  // grid: {},
  textStyle: {
    // color: '#000',
    // decoration: 'none',
    // PENDING
    fontFamily: platform.match(/^Win/) ? "Microsoft YaHei" : "sans-serif",
    // fontFamily: 'Arial, Verdana, sans-serif',
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal"
  },
  // http://blogs.adobe.com/webplatform/2014/02/24/using-blend-modes-in-html-canvas/
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  // Default is source-over
  blendMode: null,
  stateAnimation: {
    duration: 300,
    easing: "cubicOut"
  },
  animation: "auto",
  animationDuration: 1e3,
  animationDurationUpdate: 500,
  animationEasing: "cubicInOut",
  animationEasingUpdate: "cubicInOut",
  animationThreshold: 2e3,
  // Configuration for progressive/incremental rendering
  progressiveThreshold: 3e3,
  progressive: 400,
  // Threshold of if use single hover layer to optimize.
  // It is recommended that `hoverLayerThreshold` is equivalent to or less than
  // `progressiveThreshold`, otherwise hover will cause restart of progressive,
  // which is unexpected.
  // see example <echarts/test/heatmap-large.html>.
  hoverLayerThreshold: 3e3,
  // See: module:echarts/scale/Time
  useUTC: false
};

// node_modules/echarts/lib/model/internalComponentCreator.js
var internalOptionCreatorMap = createHashMap();
function registerInternalOptionCreator(mainType, creator) {
  assert(internalOptionCreatorMap.get(mainType) == null && creator);
  internalOptionCreatorMap.set(mainType, creator);
}
function concatInternalOptions(ecModel, mainType, newCmptOptionList) {
  var internalOptionCreator = internalOptionCreatorMap.get(mainType);
  if (!internalOptionCreator) {
    return newCmptOptionList;
  }
  var internalOptions = internalOptionCreator(ecModel);
  if (!internalOptions) {
    return newCmptOptionList;
  }
  if (true) {
    for (var i = 0; i < internalOptions.length; i++) {
      assert(isComponentIdInternal(internalOptions[i]));
    }
  }
  return newCmptOptionList.concat(internalOptions);
}

// node_modules/echarts/lib/model/Global.js
var reCreateSeriesIndices;
var assertSeriesInitialized;
var initBase;
var OPTION_INNER_KEY = "\0_ec_inner";
var OPTION_INNER_VALUE = 1;
var BUITIN_COMPONENTS_MAP = {
  grid: "GridComponent",
  polar: "PolarComponent",
  geo: "GeoComponent",
  singleAxis: "SingleAxisComponent",
  parallel: "ParallelComponent",
  calendar: "CalendarComponent",
  graphic: "GraphicComponent",
  toolbox: "ToolboxComponent",
  tooltip: "TooltipComponent",
  axisPointer: "AxisPointerComponent",
  brush: "BrushComponent",
  title: "TitleComponent",
  timeline: "TimelineComponent",
  markPoint: "MarkPointComponent",
  markLine: "MarkLineComponent",
  markArea: "MarkAreaComponent",
  legend: "LegendComponent",
  dataZoom: "DataZoomComponent",
  visualMap: "VisualMapComponent",
  // aria: 'AriaComponent',
  // dataset: 'DatasetComponent',
  // Dependencies
  xAxis: "GridComponent",
  yAxis: "GridComponent",
  angleAxis: "PolarComponent",
  radiusAxis: "PolarComponent"
};
var BUILTIN_CHARTS_MAP = {
  line: "LineChart",
  bar: "BarChart",
  pie: "PieChart",
  scatter: "ScatterChart",
  radar: "RadarChart",
  map: "MapChart",
  tree: "TreeChart",
  treemap: "TreemapChart",
  graph: "GraphChart",
  gauge: "GaugeChart",
  funnel: "FunnelChart",
  parallel: "ParallelChart",
  sankey: "SankeyChart",
  boxplot: "BoxplotChart",
  candlestick: "CandlestickChart",
  effectScatter: "EffectScatterChart",
  lines: "LinesChart",
  heatmap: "HeatmapChart",
  pictorialBar: "PictorialBarChart",
  themeRiver: "ThemeRiverChart",
  sunburst: "SunburstChart",
  custom: "CustomChart"
};
var componetsMissingLogPrinted = {};
function checkMissingComponents(option) {
  each(option, function(componentOption, mainType) {
    if (!Component_default.hasClass(mainType)) {
      var componentImportName = BUITIN_COMPONENTS_MAP[mainType];
      if (componentImportName && !componetsMissingLogPrinted[componentImportName]) {
        error("Component " + mainType + " is used but not imported.\nimport { " + componentImportName + " } from 'echarts/components';\necharts.use([" + componentImportName + "]);");
        componetsMissingLogPrinted[componentImportName] = true;
      }
    }
  });
}
var GlobalModel = (
  /** @class */
  function(_super) {
    __extends(GlobalModel2, _super);
    function GlobalModel2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    GlobalModel2.prototype.init = function(option, parentModel, ecModel, theme2, locale, optionManager) {
      theme2 = theme2 || {};
      this.option = null;
      this._theme = new Model_default(theme2);
      this._locale = new Model_default(locale);
      this._optionManager = optionManager;
    };
    GlobalModel2.prototype.setOption = function(option, opts, optionPreprocessorFuncs2) {
      if (true) {
        assert(option != null, "option is null/undefined");
        assert(option[OPTION_INNER_KEY] !== OPTION_INNER_VALUE, "please use chart.getOption()");
      }
      var innerOpt = normalizeSetOptionInput(opts);
      this._optionManager.setOption(option, optionPreprocessorFuncs2, innerOpt);
      this._resetOption(null, innerOpt);
    };
    GlobalModel2.prototype.resetOption = function(type, opt) {
      return this._resetOption(type, normalizeSetOptionInput(opt));
    };
    GlobalModel2.prototype._resetOption = function(type, opt) {
      var optionChanged = false;
      var optionManager = this._optionManager;
      if (!type || type === "recreate") {
        var baseOption = optionManager.mountOption(type === "recreate");
        if (true) {
          checkMissingComponents(baseOption);
        }
        if (!this.option || type === "recreate") {
          initBase(this, baseOption);
        } else {
          this.restoreData();
          this._mergeOption(baseOption, opt);
        }
        optionChanged = true;
      }
      if (type === "timeline" || type === "media") {
        this.restoreData();
      }
      if (!type || type === "recreate" || type === "timeline") {
        var timelineOption = optionManager.getTimelineOption(this);
        if (timelineOption) {
          optionChanged = true;
          this._mergeOption(timelineOption, opt);
        }
      }
      if (!type || type === "recreate" || type === "media") {
        var mediaOptions = optionManager.getMediaOption(this);
        if (mediaOptions.length) {
          each(mediaOptions, function(mediaOption) {
            optionChanged = true;
            this._mergeOption(mediaOption, opt);
          }, this);
        }
      }
      return optionChanged;
    };
    GlobalModel2.prototype.mergeOption = function(option) {
      this._mergeOption(option, null);
    };
    GlobalModel2.prototype._mergeOption = function(newOption, opt) {
      var option = this.option;
      var componentsMap = this._componentsMap;
      var componentsCount = this._componentsCount;
      var newCmptTypes = [];
      var newCmptTypeMap = createHashMap();
      var replaceMergeMainTypeMap = opt && opt.replaceMergeMainTypeMap;
      resetSourceDefaulter(this);
      each(newOption, function(componentOption, mainType) {
        if (componentOption == null) {
          return;
        }
        if (!Component_default.hasClass(mainType)) {
          option[mainType] = option[mainType] == null ? clone(componentOption) : merge(option[mainType], componentOption, true);
        } else if (mainType) {
          newCmptTypes.push(mainType);
          newCmptTypeMap.set(mainType, true);
        }
      });
      if (replaceMergeMainTypeMap) {
        replaceMergeMainTypeMap.each(function(val, mainTypeInReplaceMerge) {
          if (Component_default.hasClass(mainTypeInReplaceMerge) && !newCmptTypeMap.get(mainTypeInReplaceMerge)) {
            newCmptTypes.push(mainTypeInReplaceMerge);
            newCmptTypeMap.set(mainTypeInReplaceMerge, true);
          }
        });
      }
      Component_default.topologicalTravel(newCmptTypes, Component_default.getAllClassMainTypes(), visitComponent, this);
      function visitComponent(mainType) {
        var newCmptOptionList = concatInternalOptions(this, mainType, normalizeToArray(newOption[mainType]));
        var oldCmptList = componentsMap.get(mainType);
        var mergeMode = (
          // `!oldCmptList` means init. See the comment in `mappingToExists`
          !oldCmptList ? "replaceAll" : replaceMergeMainTypeMap && replaceMergeMainTypeMap.get(mainType) ? "replaceMerge" : "normalMerge"
        );
        var mappingResult = mappingToExists(oldCmptList, newCmptOptionList, mergeMode);
        setComponentTypeToKeyInfo(mappingResult, mainType, Component_default);
        option[mainType] = null;
        componentsMap.set(mainType, null);
        componentsCount.set(mainType, 0);
        var optionsByMainType = [];
        var cmptsByMainType = [];
        var cmptsCountByMainType = 0;
        var tooltipExists;
        var tooltipWarningLogged;
        each(mappingResult, function(resultItem, index) {
          var componentModel = resultItem.existing;
          var newCmptOption = resultItem.newOption;
          if (!newCmptOption) {
            if (componentModel) {
              componentModel.mergeOption({}, this);
              componentModel.optionUpdated({}, false);
            }
          } else {
            var isSeriesType = mainType === "series";
            var ComponentModelClass = Component_default.getClass(
              mainType,
              resultItem.keyInfo.subType,
              !isSeriesType
              // Give a more detailed warn later if series don't exists
            );
            if (!ComponentModelClass) {
              if (true) {
                var subType = resultItem.keyInfo.subType;
                var seriesImportName = BUILTIN_CHARTS_MAP[subType];
                if (!componetsMissingLogPrinted[subType]) {
                  componetsMissingLogPrinted[subType] = true;
                  if (seriesImportName) {
                    error("Series " + subType + " is used but not imported.\nimport { " + seriesImportName + " } from 'echarts/charts';\necharts.use([" + seriesImportName + "]);");
                  } else {
                    error("Unknown series " + subType);
                  }
                }
              }
              return;
            }
            if (mainType === "tooltip") {
              if (tooltipExists) {
                if (true) {
                  if (!tooltipWarningLogged) {
                    warn("Currently only one tooltip component is allowed.");
                    tooltipWarningLogged = true;
                  }
                }
                return;
              }
              tooltipExists = true;
            }
            if (componentModel && componentModel.constructor === ComponentModelClass) {
              componentModel.name = resultItem.keyInfo.name;
              componentModel.mergeOption(newCmptOption, this);
              componentModel.optionUpdated(newCmptOption, false);
            } else {
              var extraOpt = extend({
                componentIndex: index
              }, resultItem.keyInfo);
              componentModel = new ComponentModelClass(newCmptOption, this, this, extraOpt);
              extend(componentModel, extraOpt);
              if (resultItem.brandNew) {
                componentModel.__requireNewView = true;
              }
              componentModel.init(newCmptOption, this, this);
              componentModel.optionUpdated(null, true);
            }
          }
          if (componentModel) {
            optionsByMainType.push(componentModel.option);
            cmptsByMainType.push(componentModel);
            cmptsCountByMainType++;
          } else {
            optionsByMainType.push(void 0);
            cmptsByMainType.push(void 0);
          }
        }, this);
        option[mainType] = optionsByMainType;
        componentsMap.set(mainType, cmptsByMainType);
        componentsCount.set(mainType, cmptsCountByMainType);
        if (mainType === "series") {
          reCreateSeriesIndices(this);
        }
      }
      if (!this._seriesIndices) {
        reCreateSeriesIndices(this);
      }
    };
    GlobalModel2.prototype.getOption = function() {
      var option = clone(this.option);
      each(option, function(optInMainType, mainType) {
        if (Component_default.hasClass(mainType)) {
          var opts = normalizeToArray(optInMainType);
          var realLen = opts.length;
          var metNonInner = false;
          for (var i = realLen - 1; i >= 0; i--) {
            if (opts[i] && !isComponentIdInternal(opts[i])) {
              metNonInner = true;
            } else {
              opts[i] = null;
              !metNonInner && realLen--;
            }
          }
          opts.length = realLen;
          option[mainType] = opts;
        }
      });
      delete option[OPTION_INNER_KEY];
      return option;
    };
    GlobalModel2.prototype.getTheme = function() {
      return this._theme;
    };
    GlobalModel2.prototype.getLocaleModel = function() {
      return this._locale;
    };
    GlobalModel2.prototype.setUpdatePayload = function(payload) {
      this._payload = payload;
    };
    GlobalModel2.prototype.getUpdatePayload = function() {
      return this._payload;
    };
    GlobalModel2.prototype.getComponent = function(mainType, idx) {
      var list = this._componentsMap.get(mainType);
      if (list) {
        var cmpt = list[idx || 0];
        if (cmpt) {
          return cmpt;
        } else if (idx == null) {
          for (var i = 0; i < list.length; i++) {
            if (list[i]) {
              return list[i];
            }
          }
        }
      }
    };
    GlobalModel2.prototype.queryComponents = function(condition) {
      var mainType = condition.mainType;
      if (!mainType) {
        return [];
      }
      var index = condition.index;
      var id = condition.id;
      var name = condition.name;
      var cmpts = this._componentsMap.get(mainType);
      if (!cmpts || !cmpts.length) {
        return [];
      }
      var result;
      if (index != null) {
        result = [];
        each(normalizeToArray(index), function(idx) {
          cmpts[idx] && result.push(cmpts[idx]);
        });
      } else if (id != null) {
        result = queryByIdOrName("id", id, cmpts);
      } else if (name != null) {
        result = queryByIdOrName("name", name, cmpts);
      } else {
        result = filter(cmpts, function(cmpt) {
          return !!cmpt;
        });
      }
      return filterBySubType(result, condition);
    };
    GlobalModel2.prototype.findComponents = function(condition) {
      var query = condition.query;
      var mainType = condition.mainType;
      var queryCond = getQueryCond(query);
      var result = queryCond ? this.queryComponents(queryCond) : filter(this._componentsMap.get(mainType), function(cmpt) {
        return !!cmpt;
      });
      return doFilter(filterBySubType(result, condition));
      function getQueryCond(q) {
        var indexAttr = mainType + "Index";
        var idAttr = mainType + "Id";
        var nameAttr = mainType + "Name";
        return q && (q[indexAttr] != null || q[idAttr] != null || q[nameAttr] != null) ? {
          mainType,
          // subType will be filtered finally.
          index: q[indexAttr],
          id: q[idAttr],
          name: q[nameAttr]
        } : null;
      }
      function doFilter(res) {
        return condition.filter ? filter(res, condition.filter) : res;
      }
    };
    GlobalModel2.prototype.eachComponent = function(mainType, cb, context) {
      var componentsMap = this._componentsMap;
      if (isFunction(mainType)) {
        var ctxForAll_1 = cb;
        var cbForAll_1 = mainType;
        componentsMap.each(function(cmpts2, componentType) {
          for (var i2 = 0; cmpts2 && i2 < cmpts2.length; i2++) {
            var cmpt2 = cmpts2[i2];
            cmpt2 && cbForAll_1.call(ctxForAll_1, componentType, cmpt2, cmpt2.componentIndex);
          }
        });
      } else {
        var cmpts = isString(mainType) ? componentsMap.get(mainType) : isObject(mainType) ? this.findComponents(mainType) : null;
        for (var i = 0; cmpts && i < cmpts.length; i++) {
          var cmpt = cmpts[i];
          cmpt && cb.call(context, cmpt, cmpt.componentIndex);
        }
      }
    };
    GlobalModel2.prototype.getSeriesByName = function(name) {
      var nameStr = convertOptionIdName(name, null);
      return filter(this._componentsMap.get("series"), function(oneSeries) {
        return !!oneSeries && nameStr != null && oneSeries.name === nameStr;
      });
    };
    GlobalModel2.prototype.getSeriesByIndex = function(seriesIndex) {
      return this._componentsMap.get("series")[seriesIndex];
    };
    GlobalModel2.prototype.getSeriesByType = function(subType) {
      return filter(this._componentsMap.get("series"), function(oneSeries) {
        return !!oneSeries && oneSeries.subType === subType;
      });
    };
    GlobalModel2.prototype.getSeries = function() {
      return filter(this._componentsMap.get("series"), function(oneSeries) {
        return !!oneSeries;
      });
    };
    GlobalModel2.prototype.getSeriesCount = function() {
      return this._componentsCount.get("series");
    };
    GlobalModel2.prototype.eachSeries = function(cb, context) {
      assertSeriesInitialized(this);
      each(this._seriesIndices, function(rawSeriesIndex) {
        var series = this._componentsMap.get("series")[rawSeriesIndex];
        cb.call(context, series, rawSeriesIndex);
      }, this);
    };
    GlobalModel2.prototype.eachRawSeries = function(cb, context) {
      each(this._componentsMap.get("series"), function(series) {
        series && cb.call(context, series, series.componentIndex);
      });
    };
    GlobalModel2.prototype.eachSeriesByType = function(subType, cb, context) {
      assertSeriesInitialized(this);
      each(this._seriesIndices, function(rawSeriesIndex) {
        var series = this._componentsMap.get("series")[rawSeriesIndex];
        if (series.subType === subType) {
          cb.call(context, series, rawSeriesIndex);
        }
      }, this);
    };
    GlobalModel2.prototype.eachRawSeriesByType = function(subType, cb, context) {
      return each(this.getSeriesByType(subType), cb, context);
    };
    GlobalModel2.prototype.isSeriesFiltered = function(seriesModel) {
      assertSeriesInitialized(this);
      return this._seriesIndicesMap.get(seriesModel.componentIndex) == null;
    };
    GlobalModel2.prototype.getCurrentSeriesIndices = function() {
      return (this._seriesIndices || []).slice();
    };
    GlobalModel2.prototype.filterSeries = function(cb, context) {
      assertSeriesInitialized(this);
      var newSeriesIndices = [];
      each(this._seriesIndices, function(seriesRawIdx) {
        var series = this._componentsMap.get("series")[seriesRawIdx];
        cb.call(context, series, seriesRawIdx) && newSeriesIndices.push(seriesRawIdx);
      }, this);
      this._seriesIndices = newSeriesIndices;
      this._seriesIndicesMap = createHashMap(newSeriesIndices);
    };
    GlobalModel2.prototype.restoreData = function(payload) {
      reCreateSeriesIndices(this);
      var componentsMap = this._componentsMap;
      var componentTypes = [];
      componentsMap.each(function(components, componentType) {
        if (Component_default.hasClass(componentType)) {
          componentTypes.push(componentType);
        }
      });
      Component_default.topologicalTravel(componentTypes, Component_default.getAllClassMainTypes(), function(componentType) {
        each(componentsMap.get(componentType), function(component) {
          if (component && (componentType !== "series" || !isNotTargetSeries(component, payload))) {
            component.restoreData();
          }
        });
      });
    };
    GlobalModel2.internalField = function() {
      reCreateSeriesIndices = function(ecModel) {
        var seriesIndices = ecModel._seriesIndices = [];
        each(ecModel._componentsMap.get("series"), function(series) {
          series && seriesIndices.push(series.componentIndex);
        });
        ecModel._seriesIndicesMap = createHashMap(seriesIndices);
      };
      assertSeriesInitialized = function(ecModel) {
        if (true) {
          if (!ecModel._seriesIndices) {
            throw new Error("Option should contains series.");
          }
        }
      };
      initBase = function(ecModel, baseOption) {
        ecModel.option = {};
        ecModel.option[OPTION_INNER_KEY] = OPTION_INNER_VALUE;
        ecModel._componentsMap = createHashMap({
          series: []
        });
        ecModel._componentsCount = createHashMap();
        var airaOption = baseOption.aria;
        if (isObject(airaOption) && airaOption.enabled == null) {
          airaOption.enabled = true;
        }
        mergeTheme(baseOption, ecModel._theme.option);
        merge(baseOption, globalDefault_default, false);
        ecModel._mergeOption(baseOption, null);
      };
    }();
    return GlobalModel2;
  }(Model_default)
);
function isNotTargetSeries(seriesModel, payload) {
  if (payload) {
    var index = payload.seriesIndex;
    var id = payload.seriesId;
    var name_1 = payload.seriesName;
    return index != null && seriesModel.componentIndex !== index || id != null && seriesModel.id !== id || name_1 != null && seriesModel.name !== name_1;
  }
}
function mergeTheme(option, theme2) {
  var notMergeColorLayer = option.color && !option.colorLayer;
  each(theme2, function(themeItem, name) {
    if (name === "colorLayer" && notMergeColorLayer) {
      return;
    }
    if (!Component_default.hasClass(name)) {
      if (typeof themeItem === "object") {
        option[name] = !option[name] ? clone(themeItem) : merge(option[name], themeItem, false);
      } else {
        if (option[name] == null) {
          option[name] = themeItem;
        }
      }
    }
  });
}
function queryByIdOrName(attr, idOrName, cmpts) {
  if (isArray(idOrName)) {
    var keyMap_1 = createHashMap();
    each(idOrName, function(idOrNameItem) {
      if (idOrNameItem != null) {
        var idName = convertOptionIdName(idOrNameItem, null);
        idName != null && keyMap_1.set(idOrNameItem, true);
      }
    });
    return filter(cmpts, function(cmpt) {
      return cmpt && keyMap_1.get(cmpt[attr]);
    });
  } else {
    var idName_1 = convertOptionIdName(idOrName, null);
    return filter(cmpts, function(cmpt) {
      return cmpt && idName_1 != null && cmpt[attr] === idName_1;
    });
  }
}
function filterBySubType(components, condition) {
  return condition.hasOwnProperty("subType") ? filter(components, function(cmpt) {
    return cmpt && cmpt.subType === condition.subType;
  }) : components;
}
function normalizeSetOptionInput(opts) {
  var replaceMergeMainTypeMap = createHashMap();
  opts && each(normalizeToArray(opts.replaceMerge), function(mainType) {
    if (true) {
      assert(Component_default.hasClass(mainType), '"' + mainType + '" is not valid component main type in "replaceMerge"');
    }
    replaceMergeMainTypeMap.set(mainType, true);
  });
  return {
    replaceMergeMainTypeMap
  };
}
mixin(GlobalModel, PaletteMixin);
var Global_default = GlobalModel;

// node_modules/echarts/lib/core/ExtensionAPI.js
var availableMethods = [
  "getDom",
  "getZr",
  "getWidth",
  "getHeight",
  "getDevicePixelRatio",
  "dispatchAction",
  "isSSR",
  "isDisposed",
  "on",
  "off",
  "getDataURL",
  "getConnectedDataURL",
  // 'getModel',
  "getOption",
  // 'getViewOfComponentModel',
  // 'getViewOfSeriesModel',
  "getId",
  "updateLabelLayout"
];
var ExtensionAPI = (
  /** @class */
  function() {
    function ExtensionAPI2(ecInstance) {
      each(availableMethods, function(methodName) {
        this[methodName] = bind(ecInstance[methodName], ecInstance);
      }, this);
    }
    return ExtensionAPI2;
  }()
);
var ExtensionAPI_default = ExtensionAPI;

// node_modules/echarts/lib/core/CoordinateSystem.js
var coordinateSystemCreators = {};
var CoordinateSystemManager = (
  /** @class */
  function() {
    function CoordinateSystemManager2() {
      this._coordinateSystems = [];
    }
    CoordinateSystemManager2.prototype.create = function(ecModel, api) {
      var coordinateSystems = [];
      each(coordinateSystemCreators, function(creator, type) {
        var list = creator.create(ecModel, api);
        coordinateSystems = coordinateSystems.concat(list || []);
      });
      this._coordinateSystems = coordinateSystems;
    };
    CoordinateSystemManager2.prototype.update = function(ecModel, api) {
      each(this._coordinateSystems, function(coordSys) {
        coordSys.update && coordSys.update(ecModel, api);
      });
    };
    CoordinateSystemManager2.prototype.getCoordinateSystems = function() {
      return this._coordinateSystems.slice();
    };
    CoordinateSystemManager2.register = function(type, creator) {
      coordinateSystemCreators[type] = creator;
    };
    CoordinateSystemManager2.get = function(type) {
      return coordinateSystemCreators[type];
    };
    return CoordinateSystemManager2;
  }()
);
var CoordinateSystem_default = CoordinateSystemManager;

// node_modules/echarts/lib/model/OptionManager.js
var QUERY_REG = /^(min|max)?(.+)$/;
var OptionManager = (
  /** @class */
  function() {
    function OptionManager2(api) {
      this._timelineOptions = [];
      this._mediaList = [];
      this._currentMediaIndices = [];
      this._api = api;
    }
    OptionManager2.prototype.setOption = function(rawOption, optionPreprocessorFuncs2, opt) {
      if (rawOption) {
        each(normalizeToArray(rawOption.series), function(series) {
          series && series.data && isTypedArray(series.data) && setAsPrimitive(series.data);
        });
        each(normalizeToArray(rawOption.dataset), function(dataset) {
          dataset && dataset.source && isTypedArray(dataset.source) && setAsPrimitive(dataset.source);
        });
      }
      rawOption = clone(rawOption);
      var optionBackup = this._optionBackup;
      var newParsedOption = parseRawOption(rawOption, optionPreprocessorFuncs2, !optionBackup);
      this._newBaseOption = newParsedOption.baseOption;
      if (optionBackup) {
        if (newParsedOption.timelineOptions.length) {
          optionBackup.timelineOptions = newParsedOption.timelineOptions;
        }
        if (newParsedOption.mediaList.length) {
          optionBackup.mediaList = newParsedOption.mediaList;
        }
        if (newParsedOption.mediaDefault) {
          optionBackup.mediaDefault = newParsedOption.mediaDefault;
        }
      } else {
        this._optionBackup = newParsedOption;
      }
    };
    OptionManager2.prototype.mountOption = function(isRecreate) {
      var optionBackup = this._optionBackup;
      this._timelineOptions = optionBackup.timelineOptions;
      this._mediaList = optionBackup.mediaList;
      this._mediaDefault = optionBackup.mediaDefault;
      this._currentMediaIndices = [];
      return clone(isRecreate ? optionBackup.baseOption : this._newBaseOption);
    };
    OptionManager2.prototype.getTimelineOption = function(ecModel) {
      var option;
      var timelineOptions = this._timelineOptions;
      if (timelineOptions.length) {
        var timelineModel = ecModel.getComponent("timeline");
        if (timelineModel) {
          option = clone(
            // FIXME:TS as TimelineModel or quivlant interface
            timelineOptions[timelineModel.getCurrentIndex()]
          );
        }
      }
      return option;
    };
    OptionManager2.prototype.getMediaOption = function(ecModel) {
      var ecWidth = this._api.getWidth();
      var ecHeight = this._api.getHeight();
      var mediaList = this._mediaList;
      var mediaDefault = this._mediaDefault;
      var indices = [];
      var result = [];
      if (!mediaList.length && !mediaDefault) {
        return result;
      }
      for (var i = 0, len = mediaList.length; i < len; i++) {
        if (applyMediaQuery(mediaList[i].query, ecWidth, ecHeight)) {
          indices.push(i);
        }
      }
      if (!indices.length && mediaDefault) {
        indices = [-1];
      }
      if (indices.length && !indicesEquals(indices, this._currentMediaIndices)) {
        result = map(indices, function(index) {
          return clone(index === -1 ? mediaDefault.option : mediaList[index].option);
        });
      }
      this._currentMediaIndices = indices;
      return result;
    };
    return OptionManager2;
  }()
);
function parseRawOption(rawOption, optionPreprocessorFuncs2, isNew) {
  var mediaList = [];
  var mediaDefault;
  var baseOption;
  var declaredBaseOption = rawOption.baseOption;
  var timelineOnRoot = rawOption.timeline;
  var timelineOptionsOnRoot = rawOption.options;
  var mediaOnRoot = rawOption.media;
  var hasMedia = !!rawOption.media;
  var hasTimeline = !!(timelineOptionsOnRoot || timelineOnRoot || declaredBaseOption && declaredBaseOption.timeline);
  if (declaredBaseOption) {
    baseOption = declaredBaseOption;
    if (!baseOption.timeline) {
      baseOption.timeline = timelineOnRoot;
    }
  } else {
    if (hasTimeline || hasMedia) {
      rawOption.options = rawOption.media = null;
    }
    baseOption = rawOption;
  }
  if (hasMedia) {
    if (isArray(mediaOnRoot)) {
      each(mediaOnRoot, function(singleMedia) {
        if (true) {
          if (singleMedia && !singleMedia.option && isObject(singleMedia.query) && isObject(singleMedia.query.option)) {
            error("Illegal media option. Must be like { media: [ { query: {}, option: {} } ] }");
          }
        }
        if (singleMedia && singleMedia.option) {
          if (singleMedia.query) {
            mediaList.push(singleMedia);
          } else if (!mediaDefault) {
            mediaDefault = singleMedia;
          }
        }
      });
    } else {
      if (true) {
        error("Illegal media option. Must be an array. Like { media: [ {...}, {...} ] }");
      }
    }
  }
  doPreprocess(baseOption);
  each(timelineOptionsOnRoot, function(option) {
    return doPreprocess(option);
  });
  each(mediaList, function(media) {
    return doPreprocess(media.option);
  });
  function doPreprocess(option) {
    each(optionPreprocessorFuncs2, function(preProcess) {
      preProcess(option, isNew);
    });
  }
  return {
    baseOption,
    timelineOptions: timelineOptionsOnRoot || [],
    mediaDefault,
    mediaList
  };
}
function applyMediaQuery(query, ecWidth, ecHeight) {
  var realMap = {
    width: ecWidth,
    height: ecHeight,
    aspectratio: ecWidth / ecHeight
    // lower case for convenience.
  };
  var applicable = true;
  each(query, function(value, attr) {
    var matched = attr.match(QUERY_REG);
    if (!matched || !matched[1] || !matched[2]) {
      return;
    }
    var operator = matched[1];
    var realAttr = matched[2].toLowerCase();
    if (!compare(realMap[realAttr], value, operator)) {
      applicable = false;
    }
  });
  return applicable;
}
function compare(real, expect, operator) {
  if (operator === "min") {
    return real >= expect;
  } else if (operator === "max") {
    return real <= expect;
  } else {
    return real === expect;
  }
}
function indicesEquals(indices1, indices2) {
  return indices1.join(",") === indices2.join(",");
}
var OptionManager_default = OptionManager;

// node_modules/echarts/lib/preprocessor/helper/compatStyle.js
var each3 = each;
var isObject2 = isObject;
var POSSIBLE_STYLES = ["areaStyle", "lineStyle", "nodeStyle", "linkStyle", "chordStyle", "label", "labelLine"];
function compatEC2ItemStyle(opt) {
  var itemStyleOpt = opt && opt.itemStyle;
  if (!itemStyleOpt) {
    return;
  }
  for (var i = 0, len = POSSIBLE_STYLES.length; i < len; i++) {
    var styleName = POSSIBLE_STYLES[i];
    var normalItemStyleOpt = itemStyleOpt.normal;
    var emphasisItemStyleOpt = itemStyleOpt.emphasis;
    if (normalItemStyleOpt && normalItemStyleOpt[styleName]) {
      if (true) {
        deprecateReplaceLog("itemStyle.normal." + styleName, styleName);
      }
      opt[styleName] = opt[styleName] || {};
      if (!opt[styleName].normal) {
        opt[styleName].normal = normalItemStyleOpt[styleName];
      } else {
        merge(opt[styleName].normal, normalItemStyleOpt[styleName]);
      }
      normalItemStyleOpt[styleName] = null;
    }
    if (emphasisItemStyleOpt && emphasisItemStyleOpt[styleName]) {
      if (true) {
        deprecateReplaceLog("itemStyle.emphasis." + styleName, "emphasis." + styleName);
      }
      opt[styleName] = opt[styleName] || {};
      if (!opt[styleName].emphasis) {
        opt[styleName].emphasis = emphasisItemStyleOpt[styleName];
      } else {
        merge(opt[styleName].emphasis, emphasisItemStyleOpt[styleName]);
      }
      emphasisItemStyleOpt[styleName] = null;
    }
  }
}
function convertNormalEmphasis(opt, optType, useExtend) {
  if (opt && opt[optType] && (opt[optType].normal || opt[optType].emphasis)) {
    var normalOpt = opt[optType].normal;
    var emphasisOpt = opt[optType].emphasis;
    if (normalOpt) {
      if (true) {
        deprecateLog("'normal' hierarchy in " + optType + " has been removed since 4.0. All style properties are configured in " + optType + " directly now.");
      }
      if (useExtend) {
        opt[optType].normal = opt[optType].emphasis = null;
        defaults(opt[optType], normalOpt);
      } else {
        opt[optType] = normalOpt;
      }
    }
    if (emphasisOpt) {
      if (true) {
        deprecateLog(optType + ".emphasis has been changed to emphasis." + optType + " since 4.0");
      }
      opt.emphasis = opt.emphasis || {};
      opt.emphasis[optType] = emphasisOpt;
      if (emphasisOpt.focus) {
        opt.emphasis.focus = emphasisOpt.focus;
      }
      if (emphasisOpt.blurScope) {
        opt.emphasis.blurScope = emphasisOpt.blurScope;
      }
    }
  }
}
function removeEC3NormalStatus(opt) {
  convertNormalEmphasis(opt, "itemStyle");
  convertNormalEmphasis(opt, "lineStyle");
  convertNormalEmphasis(opt, "areaStyle");
  convertNormalEmphasis(opt, "label");
  convertNormalEmphasis(opt, "labelLine");
  convertNormalEmphasis(opt, "upperLabel");
  convertNormalEmphasis(opt, "edgeLabel");
}
function compatTextStyle(opt, propName) {
  var labelOptSingle = isObject2(opt) && opt[propName];
  var textStyle = isObject2(labelOptSingle) && labelOptSingle.textStyle;
  if (textStyle) {
    if (true) {
      deprecateLog("textStyle hierarchy in " + propName + " has been removed since 4.0. All textStyle properties are configured in " + propName + " directly now.");
    }
    for (var i = 0, len = TEXT_STYLE_OPTIONS.length; i < len; i++) {
      var textPropName = TEXT_STYLE_OPTIONS[i];
      if (textStyle.hasOwnProperty(textPropName)) {
        labelOptSingle[textPropName] = textStyle[textPropName];
      }
    }
  }
}
function compatEC3CommonStyles(opt) {
  if (opt) {
    removeEC3NormalStatus(opt);
    compatTextStyle(opt, "label");
    opt.emphasis && compatTextStyle(opt.emphasis, "label");
  }
}
function processSeries(seriesOpt) {
  if (!isObject2(seriesOpt)) {
    return;
  }
  compatEC2ItemStyle(seriesOpt);
  removeEC3NormalStatus(seriesOpt);
  compatTextStyle(seriesOpt, "label");
  compatTextStyle(seriesOpt, "upperLabel");
  compatTextStyle(seriesOpt, "edgeLabel");
  if (seriesOpt.emphasis) {
    compatTextStyle(seriesOpt.emphasis, "label");
    compatTextStyle(seriesOpt.emphasis, "upperLabel");
    compatTextStyle(seriesOpt.emphasis, "edgeLabel");
  }
  var markPoint = seriesOpt.markPoint;
  if (markPoint) {
    compatEC2ItemStyle(markPoint);
    compatEC3CommonStyles(markPoint);
  }
  var markLine = seriesOpt.markLine;
  if (markLine) {
    compatEC2ItemStyle(markLine);
    compatEC3CommonStyles(markLine);
  }
  var markArea = seriesOpt.markArea;
  if (markArea) {
    compatEC3CommonStyles(markArea);
  }
  var data = seriesOpt.data;
  if (seriesOpt.type === "graph") {
    data = data || seriesOpt.nodes;
    var edgeData = seriesOpt.links || seriesOpt.edges;
    if (edgeData && !isTypedArray(edgeData)) {
      for (var i = 0; i < edgeData.length; i++) {
        compatEC3CommonStyles(edgeData[i]);
      }
    }
    each(seriesOpt.categories, function(opt) {
      removeEC3NormalStatus(opt);
    });
  }
  if (data && !isTypedArray(data)) {
    for (var i = 0; i < data.length; i++) {
      compatEC3CommonStyles(data[i]);
    }
  }
  markPoint = seriesOpt.markPoint;
  if (markPoint && markPoint.data) {
    var mpData = markPoint.data;
    for (var i = 0; i < mpData.length; i++) {
      compatEC3CommonStyles(mpData[i]);
    }
  }
  markLine = seriesOpt.markLine;
  if (markLine && markLine.data) {
    var mlData = markLine.data;
    for (var i = 0; i < mlData.length; i++) {
      if (isArray(mlData[i])) {
        compatEC3CommonStyles(mlData[i][0]);
        compatEC3CommonStyles(mlData[i][1]);
      } else {
        compatEC3CommonStyles(mlData[i]);
      }
    }
  }
  if (seriesOpt.type === "gauge") {
    compatTextStyle(seriesOpt, "axisLabel");
    compatTextStyle(seriesOpt, "title");
    compatTextStyle(seriesOpt, "detail");
  } else if (seriesOpt.type === "treemap") {
    convertNormalEmphasis(seriesOpt.breadcrumb, "itemStyle");
    each(seriesOpt.levels, function(opt) {
      removeEC3NormalStatus(opt);
    });
  } else if (seriesOpt.type === "tree") {
    removeEC3NormalStatus(seriesOpt.leaves);
  }
}
function toArr(o) {
  return isArray(o) ? o : o ? [o] : [];
}
function toObj(o) {
  return (isArray(o) ? o[0] : o) || {};
}
function globalCompatStyle(option, isTheme) {
  each3(toArr(option.series), function(seriesOpt) {
    isObject2(seriesOpt) && processSeries(seriesOpt);
  });
  var axes = ["xAxis", "yAxis", "radiusAxis", "angleAxis", "singleAxis", "parallelAxis", "radar"];
  isTheme && axes.push("valueAxis", "categoryAxis", "logAxis", "timeAxis");
  each3(axes, function(axisName) {
    each3(toArr(option[axisName]), function(axisOpt) {
      if (axisOpt) {
        compatTextStyle(axisOpt, "axisLabel");
        compatTextStyle(axisOpt.axisPointer, "label");
      }
    });
  });
  each3(toArr(option.parallel), function(parallelOpt) {
    var parallelAxisDefault = parallelOpt && parallelOpt.parallelAxisDefault;
    compatTextStyle(parallelAxisDefault, "axisLabel");
    compatTextStyle(parallelAxisDefault && parallelAxisDefault.axisPointer, "label");
  });
  each3(toArr(option.calendar), function(calendarOpt) {
    convertNormalEmphasis(calendarOpt, "itemStyle");
    compatTextStyle(calendarOpt, "dayLabel");
    compatTextStyle(calendarOpt, "monthLabel");
    compatTextStyle(calendarOpt, "yearLabel");
  });
  each3(toArr(option.radar), function(radarOpt) {
    compatTextStyle(radarOpt, "name");
    if (radarOpt.name && radarOpt.axisName == null) {
      radarOpt.axisName = radarOpt.name;
      delete radarOpt.name;
      if (true) {
        deprecateLog("name property in radar component has been changed to axisName");
      }
    }
    if (radarOpt.nameGap != null && radarOpt.axisNameGap == null) {
      radarOpt.axisNameGap = radarOpt.nameGap;
      delete radarOpt.nameGap;
      if (true) {
        deprecateLog("nameGap property in radar component has been changed to axisNameGap");
      }
    }
    if (true) {
      each3(radarOpt.indicator, function(indicatorOpt) {
        if (indicatorOpt.text) {
          deprecateReplaceLog("text", "name", "radar.indicator");
        }
      });
    }
  });
  each3(toArr(option.geo), function(geoOpt) {
    if (isObject2(geoOpt)) {
      compatEC3CommonStyles(geoOpt);
      each3(toArr(geoOpt.regions), function(regionObj) {
        compatEC3CommonStyles(regionObj);
      });
    }
  });
  each3(toArr(option.timeline), function(timelineOpt) {
    compatEC3CommonStyles(timelineOpt);
    convertNormalEmphasis(timelineOpt, "label");
    convertNormalEmphasis(timelineOpt, "itemStyle");
    convertNormalEmphasis(timelineOpt, "controlStyle", true);
    var data = timelineOpt.data;
    isArray(data) && each(data, function(item) {
      if (isObject(item)) {
        convertNormalEmphasis(item, "label");
        convertNormalEmphasis(item, "itemStyle");
      }
    });
  });
  each3(toArr(option.toolbox), function(toolboxOpt) {
    convertNormalEmphasis(toolboxOpt, "iconStyle");
    each3(toolboxOpt.feature, function(featureOpt) {
      convertNormalEmphasis(featureOpt, "iconStyle");
    });
  });
  compatTextStyle(toObj(option.axisPointer), "label");
  compatTextStyle(toObj(option.tooltip).axisPointer, "label");
}

// node_modules/echarts/lib/preprocessor/backwardCompat.js
function get(opt, path) {
  var pathArr = path.split(",");
  var obj = opt;
  for (var i = 0; i < pathArr.length; i++) {
    obj = obj && obj[pathArr[i]];
    if (obj == null) {
      break;
    }
  }
  return obj;
}
function set(opt, path, val, overwrite) {
  var pathArr = path.split(",");
  var obj = opt;
  var key;
  var i = 0;
  for (; i < pathArr.length - 1; i++) {
    key = pathArr[i];
    if (obj[key] == null) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  if (overwrite || obj[pathArr[i]] == null) {
    obj[pathArr[i]] = val;
  }
}
function compatLayoutProperties(option) {
  option && each(LAYOUT_PROPERTIES, function(prop) {
    if (prop[0] in option && !(prop[1] in option)) {
      option[prop[1]] = option[prop[0]];
    }
  });
}
var LAYOUT_PROPERTIES = [["x", "left"], ["y", "top"], ["x2", "right"], ["y2", "bottom"]];
var COMPATITABLE_COMPONENTS = ["grid", "geo", "parallel", "legend", "toolbox", "title", "visualMap", "dataZoom", "timeline"];
var BAR_ITEM_STYLE_MAP = [["borderRadius", "barBorderRadius"], ["borderColor", "barBorderColor"], ["borderWidth", "barBorderWidth"]];
function compatBarItemStyle(option) {
  var itemStyle = option && option.itemStyle;
  if (itemStyle) {
    for (var i = 0; i < BAR_ITEM_STYLE_MAP.length; i++) {
      var oldName = BAR_ITEM_STYLE_MAP[i][1];
      var newName = BAR_ITEM_STYLE_MAP[i][0];
      if (itemStyle[oldName] != null) {
        itemStyle[newName] = itemStyle[oldName];
        if (true) {
          deprecateReplaceLog(oldName, newName);
        }
      }
    }
  }
}
function compatPieLabel(option) {
  if (!option) {
    return;
  }
  if (option.alignTo === "edge" && option.margin != null && option.edgeDistance == null) {
    if (true) {
      deprecateReplaceLog("label.margin", "label.edgeDistance", "pie");
    }
    option.edgeDistance = option.margin;
  }
}
function compatSunburstState(option) {
  if (!option) {
    return;
  }
  if (option.downplay && !option.blur) {
    option.blur = option.downplay;
    if (true) {
      deprecateReplaceLog("downplay", "blur", "sunburst");
    }
  }
}
function compatGraphFocus(option) {
  if (!option) {
    return;
  }
  if (option.focusNodeAdjacency != null) {
    option.emphasis = option.emphasis || {};
    if (option.emphasis.focus == null) {
      if (true) {
        deprecateReplaceLog("focusNodeAdjacency", "emphasis: { focus: 'adjacency'}", "graph/sankey");
      }
      option.emphasis.focus = "adjacency";
    }
  }
}
function traverseTree(data, cb) {
  if (data) {
    for (var i = 0; i < data.length; i++) {
      cb(data[i]);
      data[i] && traverseTree(data[i].children, cb);
    }
  }
}
function globalBackwardCompat(option, isTheme) {
  globalCompatStyle(option, isTheme);
  option.series = normalizeToArray(option.series);
  each(option.series, function(seriesOpt) {
    if (!isObject(seriesOpt)) {
      return;
    }
    var seriesType2 = seriesOpt.type;
    if (seriesType2 === "line") {
      if (seriesOpt.clipOverflow != null) {
        seriesOpt.clip = seriesOpt.clipOverflow;
        if (true) {
          deprecateReplaceLog("clipOverflow", "clip", "line");
        }
      }
    } else if (seriesType2 === "pie" || seriesType2 === "gauge") {
      if (seriesOpt.clockWise != null) {
        seriesOpt.clockwise = seriesOpt.clockWise;
        if (true) {
          deprecateReplaceLog("clockWise", "clockwise");
        }
      }
      compatPieLabel(seriesOpt.label);
      var data = seriesOpt.data;
      if (data && !isTypedArray(data)) {
        for (var i = 0; i < data.length; i++) {
          compatPieLabel(data[i]);
        }
      }
      if (seriesOpt.hoverOffset != null) {
        seriesOpt.emphasis = seriesOpt.emphasis || {};
        if (seriesOpt.emphasis.scaleSize = null) {
          if (true) {
            deprecateReplaceLog("hoverOffset", "emphasis.scaleSize");
          }
          seriesOpt.emphasis.scaleSize = seriesOpt.hoverOffset;
        }
      }
    } else if (seriesType2 === "gauge") {
      var pointerColor = get(seriesOpt, "pointer.color");
      pointerColor != null && set(seriesOpt, "itemStyle.color", pointerColor);
    } else if (seriesType2 === "bar") {
      compatBarItemStyle(seriesOpt);
      compatBarItemStyle(seriesOpt.backgroundStyle);
      compatBarItemStyle(seriesOpt.emphasis);
      var data = seriesOpt.data;
      if (data && !isTypedArray(data)) {
        for (var i = 0; i < data.length; i++) {
          if (typeof data[i] === "object") {
            compatBarItemStyle(data[i]);
            compatBarItemStyle(data[i] && data[i].emphasis);
          }
        }
      }
    } else if (seriesType2 === "sunburst") {
      var highlightPolicy = seriesOpt.highlightPolicy;
      if (highlightPolicy) {
        seriesOpt.emphasis = seriesOpt.emphasis || {};
        if (!seriesOpt.emphasis.focus) {
          seriesOpt.emphasis.focus = highlightPolicy;
          if (true) {
            deprecateReplaceLog("highlightPolicy", "emphasis.focus", "sunburst");
          }
        }
      }
      compatSunburstState(seriesOpt);
      traverseTree(seriesOpt.data, compatSunburstState);
    } else if (seriesType2 === "graph" || seriesType2 === "sankey") {
      compatGraphFocus(seriesOpt);
    } else if (seriesType2 === "map") {
      if (seriesOpt.mapType && !seriesOpt.map) {
        if (true) {
          deprecateReplaceLog("mapType", "map", "map");
        }
        seriesOpt.map = seriesOpt.mapType;
      }
      if (seriesOpt.mapLocation) {
        if (true) {
          deprecateLog("`mapLocation` is not used anymore.");
        }
        defaults(seriesOpt, seriesOpt.mapLocation);
      }
    }
    if (seriesOpt.hoverAnimation != null) {
      seriesOpt.emphasis = seriesOpt.emphasis || {};
      if (seriesOpt.emphasis && seriesOpt.emphasis.scale == null) {
        if (true) {
          deprecateReplaceLog("hoverAnimation", "emphasis.scale");
        }
        seriesOpt.emphasis.scale = seriesOpt.hoverAnimation;
      }
    }
    compatLayoutProperties(seriesOpt);
  });
  if (option.dataRange) {
    option.visualMap = option.dataRange;
  }
  each(COMPATITABLE_COMPONENTS, function(componentName) {
    var options = option[componentName];
    if (options) {
      if (!isArray(options)) {
        options = [options];
      }
      each(options, function(option2) {
        compatLayoutProperties(option2);
      });
    }
  });
}

// node_modules/echarts/lib/processor/dataStack.js
function dataStack(ecModel) {
  var stackInfoMap = createHashMap();
  ecModel.eachSeries(function(seriesModel) {
    var stack = seriesModel.get("stack");
    if (stack) {
      var stackInfoList = stackInfoMap.get(stack) || stackInfoMap.set(stack, []);
      var data = seriesModel.getData();
      var stackInfo = {
        // Used for calculate axis extent automatically.
        // TODO: Type getCalculationInfo return more specific type?
        stackResultDimension: data.getCalculationInfo("stackResultDimension"),
        stackedOverDimension: data.getCalculationInfo("stackedOverDimension"),
        stackedDimension: data.getCalculationInfo("stackedDimension"),
        stackedByDimension: data.getCalculationInfo("stackedByDimension"),
        isStackedByIndex: data.getCalculationInfo("isStackedByIndex"),
        data,
        seriesModel
      };
      if (!stackInfo.stackedDimension || !(stackInfo.isStackedByIndex || stackInfo.stackedByDimension)) {
        return;
      }
      stackInfoList.length && data.setCalculationInfo("stackedOnSeries", stackInfoList[stackInfoList.length - 1].seriesModel);
      stackInfoList.push(stackInfo);
    }
  });
  stackInfoMap.each(calculateStack);
}
function calculateStack(stackInfoList) {
  each(stackInfoList, function(targetStackInfo, idxInStack) {
    var resultVal = [];
    var resultNaN = [NaN, NaN];
    var dims = [targetStackInfo.stackResultDimension, targetStackInfo.stackedOverDimension];
    var targetData = targetStackInfo.data;
    var isStackedByIndex = targetStackInfo.isStackedByIndex;
    var stackStrategy = targetStackInfo.seriesModel.get("stackStrategy") || "samesign";
    targetData.modify(dims, function(v0, v1, dataIndex) {
      var sum = targetData.get(targetStackInfo.stackedDimension, dataIndex);
      if (isNaN(sum)) {
        return resultNaN;
      }
      var byValue;
      var stackedDataRawIndex;
      if (isStackedByIndex) {
        stackedDataRawIndex = targetData.getRawIndex(dataIndex);
      } else {
        byValue = targetData.get(targetStackInfo.stackedByDimension, dataIndex);
      }
      var stackedOver = NaN;
      for (var j = idxInStack - 1; j >= 0; j--) {
        var stackInfo = stackInfoList[j];
        if (!isStackedByIndex) {
          stackedDataRawIndex = stackInfo.data.rawIndexOf(stackInfo.stackedByDimension, byValue);
        }
        if (stackedDataRawIndex >= 0) {
          var val = stackInfo.data.getByRawIndex(stackInfo.stackResultDimension, stackedDataRawIndex);
          if (stackStrategy === "all" || stackStrategy === "positive" && val > 0 || stackStrategy === "negative" && val < 0 || stackStrategy === "samesign" && sum >= 0 && val > 0 || stackStrategy === "samesign" && sum <= 0 && val < 0) {
            sum = addSafe(sum, val);
            stackedOver = val;
            break;
          }
        }
      }
      resultVal[0] = sum;
      resultVal[1] = stackedOver;
      return resultVal;
    });
  });
}

// node_modules/echarts/lib/visual/style.js
var inner4 = makeInner();
var defaultStyleMappers = {
  itemStyle: makeStyleMapper(ITEM_STYLE_KEY_MAP, true),
  lineStyle: makeStyleMapper(LINE_STYLE_KEY_MAP, true)
};
var defaultColorKey = {
  lineStyle: "stroke",
  itemStyle: "fill"
};
function getStyleMapper(seriesModel, stylePath) {
  var styleMapper = seriesModel.visualStyleMapper || defaultStyleMappers[stylePath];
  if (!styleMapper) {
    console.warn("Unknown style type '" + stylePath + "'.");
    return defaultStyleMappers.itemStyle;
  }
  return styleMapper;
}
function getDefaultColorKey(seriesModel, stylePath) {
  var colorKey = seriesModel.visualDrawType || defaultColorKey[stylePath];
  if (!colorKey) {
    console.warn("Unknown style type '" + stylePath + "'.");
    return "fill";
  }
  return colorKey;
}
var seriesStyleTask = {
  createOnAllSeries: true,
  performRawSeries: true,
  reset: function(seriesModel, ecModel) {
    var data = seriesModel.getData();
    var stylePath = seriesModel.visualStyleAccessPath || "itemStyle";
    var styleModel = seriesModel.getModel(stylePath);
    var getStyle = getStyleMapper(seriesModel, stylePath);
    var globalStyle = getStyle(styleModel);
    var decalOption = styleModel.getShallow("decal");
    if (decalOption) {
      data.setVisual("decal", decalOption);
      decalOption.dirty = true;
    }
    var colorKey = getDefaultColorKey(seriesModel, stylePath);
    var color = globalStyle[colorKey];
    var colorCallback = isFunction(color) ? color : null;
    var hasAutoColor = globalStyle.fill === "auto" || globalStyle.stroke === "auto";
    if (!globalStyle[colorKey] || colorCallback || hasAutoColor) {
      var colorPalette2 = seriesModel.getColorFromPalette(
        // TODO series count changed.
        seriesModel.name,
        null,
        ecModel.getSeriesCount()
      );
      if (!globalStyle[colorKey]) {
        globalStyle[colorKey] = colorPalette2;
        data.setVisual("colorFromPalette", true);
      }
      globalStyle.fill = globalStyle.fill === "auto" || isFunction(globalStyle.fill) ? colorPalette2 : globalStyle.fill;
      globalStyle.stroke = globalStyle.stroke === "auto" || isFunction(globalStyle.stroke) ? colorPalette2 : globalStyle.stroke;
    }
    data.setVisual("style", globalStyle);
    data.setVisual("drawType", colorKey);
    if (!ecModel.isSeriesFiltered(seriesModel) && colorCallback) {
      data.setVisual("colorFromPalette", false);
      return {
        dataEach: function(data2, idx) {
          var dataParams = seriesModel.getDataParams(idx);
          var itemStyle = extend({}, globalStyle);
          itemStyle[colorKey] = colorCallback(dataParams);
          data2.setItemVisual(idx, "style", itemStyle);
        }
      };
    }
  }
};
var sharedModel = new Model_default();
var dataStyleTask = {
  createOnAllSeries: true,
  performRawSeries: true,
  reset: function(seriesModel, ecModel) {
    if (seriesModel.ignoreStyleOnData || ecModel.isSeriesFiltered(seriesModel)) {
      return;
    }
    var data = seriesModel.getData();
    var stylePath = seriesModel.visualStyleAccessPath || "itemStyle";
    var getStyle = getStyleMapper(seriesModel, stylePath);
    var colorKey = data.getVisual("drawType");
    return {
      dataEach: data.hasItemOption ? function(data2, idx) {
        var rawItem = data2.getRawDataItem(idx);
        if (rawItem && rawItem[stylePath]) {
          sharedModel.option = rawItem[stylePath];
          var style = getStyle(sharedModel);
          var existsStyle = data2.ensureUniqueItemVisual(idx, "style");
          extend(existsStyle, style);
          if (sharedModel.option.decal) {
            data2.setItemVisual(idx, "decal", sharedModel.option.decal);
            sharedModel.option.decal.dirty = true;
          }
          if (colorKey in style) {
            data2.setItemVisual(idx, "colorFromPalette", false);
          }
        }
      } : null
    };
  }
};
var dataColorPaletteTask = {
  performRawSeries: true,
  overallReset: function(ecModel) {
    var paletteScopeGroupByType = createHashMap();
    ecModel.eachSeries(function(seriesModel) {
      var colorBy = seriesModel.getColorBy();
      if (seriesModel.isColorBySeries()) {
        return;
      }
      var key = seriesModel.type + "-" + colorBy;
      var colorScope = paletteScopeGroupByType.get(key);
      if (!colorScope) {
        colorScope = {};
        paletteScopeGroupByType.set(key, colorScope);
      }
      inner4(seriesModel).scope = colorScope;
    });
    ecModel.eachSeries(function(seriesModel) {
      if (seriesModel.isColorBySeries() || ecModel.isSeriesFiltered(seriesModel)) {
        return;
      }
      var dataAll = seriesModel.getRawData();
      var idxMap = {};
      var data = seriesModel.getData();
      var colorScope = inner4(seriesModel).scope;
      var stylePath = seriesModel.visualStyleAccessPath || "itemStyle";
      var colorKey = getDefaultColorKey(seriesModel, stylePath);
      data.each(function(idx) {
        var rawIdx = data.getRawIndex(idx);
        idxMap[rawIdx] = idx;
      });
      dataAll.each(function(rawIdx) {
        var idx = idxMap[rawIdx];
        var fromPalette = data.getItemVisual(idx, "colorFromPalette");
        if (fromPalette) {
          var itemStyle = data.ensureUniqueItemVisual(idx, "style");
          var name_1 = dataAll.getName(rawIdx) || rawIdx + "";
          var dataCount = dataAll.count();
          itemStyle[colorKey] = seriesModel.getColorFromPalette(name_1, colorScope, dataCount);
        }
      });
    });
  }
};

// node_modules/echarts/lib/loading/default.js
var PI3 = Math.PI;
function defaultLoading(api, opts) {
  opts = opts || {};
  defaults(opts, {
    text: "loading",
    textColor: "#000",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    fontFamily: "sans-serif",
    maskColor: "rgba(255, 255, 255, 0.8)",
    showSpinner: true,
    color: "#5470c6",
    spinnerRadius: 10,
    lineWidth: 5,
    zlevel: 0
  });
  var group = new Group_default();
  var mask = new Rect_default({
    style: {
      fill: opts.maskColor
    },
    zlevel: opts.zlevel,
    z: 1e4
  });
  group.add(mask);
  var textContent = new Text_default({
    style: {
      text: opts.text,
      fill: opts.textColor,
      fontSize: opts.fontSize,
      fontWeight: opts.fontWeight,
      fontStyle: opts.fontStyle,
      fontFamily: opts.fontFamily
    },
    zlevel: opts.zlevel,
    z: 10001
  });
  var labelRect = new Rect_default({
    style: {
      fill: "none"
    },
    textContent,
    textConfig: {
      position: "right",
      distance: 10
    },
    zlevel: opts.zlevel,
    z: 10001
  });
  group.add(labelRect);
  var arc;
  if (opts.showSpinner) {
    arc = new Arc_default({
      shape: {
        startAngle: -PI3 / 2,
        endAngle: -PI3 / 2 + 0.1,
        r: opts.spinnerRadius
      },
      style: {
        stroke: opts.color,
        lineCap: "round",
        lineWidth: opts.lineWidth
      },
      zlevel: opts.zlevel,
      z: 10001
    });
    arc.animateShape(true).when(1e3, {
      endAngle: PI3 * 3 / 2
    }).start("circularInOut");
    arc.animateShape(true).when(1e3, {
      startAngle: PI3 * 3 / 2
    }).delay(300).start("circularInOut");
    group.add(arc);
  }
  group.resize = function() {
    var textWidth = textContent.getBoundingRect().width;
    var r = opts.showSpinner ? opts.spinnerRadius : 0;
    var cx = (api.getWidth() - r * 2 - (opts.showSpinner && textWidth ? 10 : 0) - textWidth) / 2 - (opts.showSpinner && textWidth ? 0 : 5 + textWidth / 2) + (opts.showSpinner ? 0 : textWidth / 2) + (textWidth ? 0 : r);
    var cy = api.getHeight() / 2;
    opts.showSpinner && arc.setShape({
      cx,
      cy
    });
    labelRect.setShape({
      x: cx - r,
      y: cy - r,
      width: r * 2,
      height: r * 2
    });
    mask.setShape({
      x: 0,
      y: 0,
      width: api.getWidth(),
      height: api.getHeight()
    });
  };
  group.resize();
  return group;
}

// node_modules/echarts/lib/core/Scheduler.js
var Scheduler = (
  /** @class */
  function() {
    function Scheduler2(ecInstance, api, dataProcessorHandlers, visualHandlers) {
      this._stageTaskMap = createHashMap();
      this.ecInstance = ecInstance;
      this.api = api;
      dataProcessorHandlers = this._dataProcessorHandlers = dataProcessorHandlers.slice();
      visualHandlers = this._visualHandlers = visualHandlers.slice();
      this._allHandlers = dataProcessorHandlers.concat(visualHandlers);
    }
    Scheduler2.prototype.restoreData = function(ecModel, payload) {
      ecModel.restoreData(payload);
      this._stageTaskMap.each(function(taskRecord) {
        var overallTask = taskRecord.overallTask;
        overallTask && overallTask.dirty();
      });
    };
    Scheduler2.prototype.getPerformArgs = function(task, isBlock) {
      if (!task.__pipeline) {
        return;
      }
      var pipeline = this._pipelineMap.get(task.__pipeline.id);
      var pCtx = pipeline.context;
      var incremental = !isBlock && pipeline.progressiveEnabled && (!pCtx || pCtx.progressiveRender) && task.__idxInPipeline > pipeline.blockIndex;
      var step = incremental ? pipeline.step : null;
      var modDataCount = pCtx && pCtx.modDataCount;
      var modBy = modDataCount != null ? Math.ceil(modDataCount / step) : null;
      return {
        step,
        modBy,
        modDataCount
      };
    };
    Scheduler2.prototype.getPipeline = function(pipelineId) {
      return this._pipelineMap.get(pipelineId);
    };
    Scheduler2.prototype.updateStreamModes = function(seriesModel, view) {
      var pipeline = this._pipelineMap.get(seriesModel.uid);
      var data = seriesModel.getData();
      var dataLen = data.count();
      var progressiveRender = pipeline.progressiveEnabled && view.incrementalPrepareRender && dataLen >= pipeline.threshold;
      var large = seriesModel.get("large") && dataLen >= seriesModel.get("largeThreshold");
      var modDataCount = seriesModel.get("progressiveChunkMode") === "mod" ? dataLen : null;
      seriesModel.pipelineContext = pipeline.context = {
        progressiveRender,
        modDataCount,
        large
      };
    };
    Scheduler2.prototype.restorePipelines = function(ecModel) {
      var scheduler = this;
      var pipelineMap = scheduler._pipelineMap = createHashMap();
      ecModel.eachSeries(function(seriesModel) {
        var progressive = seriesModel.getProgressive();
        var pipelineId = seriesModel.uid;
        pipelineMap.set(pipelineId, {
          id: pipelineId,
          head: null,
          tail: null,
          threshold: seriesModel.getProgressiveThreshold(),
          progressiveEnabled: progressive && !(seriesModel.preventIncremental && seriesModel.preventIncremental()),
          blockIndex: -1,
          step: Math.round(progressive || 700),
          count: 0
        });
        scheduler._pipe(seriesModel, seriesModel.dataTask);
      });
    };
    Scheduler2.prototype.prepareStageTasks = function() {
      var stageTaskMap = this._stageTaskMap;
      var ecModel = this.api.getModel();
      var api = this.api;
      each(this._allHandlers, function(handler) {
        var record = stageTaskMap.get(handler.uid) || stageTaskMap.set(handler.uid, {});
        var errMsg = "";
        if (true) {
          errMsg = '"reset" and "overallReset" must not be both specified.';
        }
        assert(!(handler.reset && handler.overallReset), errMsg);
        handler.reset && this._createSeriesStageTask(handler, record, ecModel, api);
        handler.overallReset && this._createOverallStageTask(handler, record, ecModel, api);
      }, this);
    };
    Scheduler2.prototype.prepareView = function(view, model, ecModel, api) {
      var renderTask = view.renderTask;
      var context = renderTask.context;
      context.model = model;
      context.ecModel = ecModel;
      context.api = api;
      renderTask.__block = !view.incrementalPrepareRender;
      this._pipe(model, renderTask);
    };
    Scheduler2.prototype.performDataProcessorTasks = function(ecModel, payload) {
      this._performStageTasks(this._dataProcessorHandlers, ecModel, payload, {
        block: true
      });
    };
    Scheduler2.prototype.performVisualTasks = function(ecModel, payload, opt) {
      this._performStageTasks(this._visualHandlers, ecModel, payload, opt);
    };
    Scheduler2.prototype._performStageTasks = function(stageHandlers, ecModel, payload, opt) {
      opt = opt || {};
      var unfinished = false;
      var scheduler = this;
      each(stageHandlers, function(stageHandler, idx) {
        if (opt.visualType && opt.visualType !== stageHandler.visualType) {
          return;
        }
        var stageHandlerRecord = scheduler._stageTaskMap.get(stageHandler.uid);
        var seriesTaskMap = stageHandlerRecord.seriesTaskMap;
        var overallTask = stageHandlerRecord.overallTask;
        if (overallTask) {
          var overallNeedDirty_1;
          var agentStubMap = overallTask.agentStubMap;
          agentStubMap.each(function(stub) {
            if (needSetDirty(opt, stub)) {
              stub.dirty();
              overallNeedDirty_1 = true;
            }
          });
          overallNeedDirty_1 && overallTask.dirty();
          scheduler.updatePayload(overallTask, payload);
          var performArgs_1 = scheduler.getPerformArgs(overallTask, opt.block);
          agentStubMap.each(function(stub) {
            stub.perform(performArgs_1);
          });
          if (overallTask.perform(performArgs_1)) {
            unfinished = true;
          }
        } else if (seriesTaskMap) {
          seriesTaskMap.each(function(task, pipelineId) {
            if (needSetDirty(opt, task)) {
              task.dirty();
            }
            var performArgs = scheduler.getPerformArgs(task, opt.block);
            performArgs.skip = !stageHandler.performRawSeries && ecModel.isSeriesFiltered(task.context.model);
            scheduler.updatePayload(task, payload);
            if (task.perform(performArgs)) {
              unfinished = true;
            }
          });
        }
      });
      function needSetDirty(opt2, task) {
        return opt2.setDirty && (!opt2.dirtyMap || opt2.dirtyMap.get(task.__pipeline.id));
      }
      this.unfinished = unfinished || this.unfinished;
    };
    Scheduler2.prototype.performSeriesTasks = function(ecModel) {
      var unfinished;
      ecModel.eachSeries(function(seriesModel) {
        unfinished = seriesModel.dataTask.perform() || unfinished;
      });
      this.unfinished = unfinished || this.unfinished;
    };
    Scheduler2.prototype.plan = function() {
      this._pipelineMap.each(function(pipeline) {
        var task = pipeline.tail;
        do {
          if (task.__block) {
            pipeline.blockIndex = task.__idxInPipeline;
            break;
          }
          task = task.getUpstream();
        } while (task);
      });
    };
    Scheduler2.prototype.updatePayload = function(task, payload) {
      payload !== "remain" && (task.context.payload = payload);
    };
    Scheduler2.prototype._createSeriesStageTask = function(stageHandler, stageHandlerRecord, ecModel, api) {
      var scheduler = this;
      var oldSeriesTaskMap = stageHandlerRecord.seriesTaskMap;
      var newSeriesTaskMap = stageHandlerRecord.seriesTaskMap = createHashMap();
      var seriesType2 = stageHandler.seriesType;
      var getTargetSeries = stageHandler.getTargetSeries;
      if (stageHandler.createOnAllSeries) {
        ecModel.eachRawSeries(create2);
      } else if (seriesType2) {
        ecModel.eachRawSeriesByType(seriesType2, create2);
      } else if (getTargetSeries) {
        getTargetSeries(ecModel, api).each(create2);
      }
      function create2(seriesModel) {
        var pipelineId = seriesModel.uid;
        var task = newSeriesTaskMap.set(pipelineId, oldSeriesTaskMap && oldSeriesTaskMap.get(pipelineId) || createTask({
          plan: seriesTaskPlan,
          reset: seriesTaskReset,
          count: seriesTaskCount
        }));
        task.context = {
          model: seriesModel,
          ecModel,
          api,
          // PENDING: `useClearVisual` not used?
          useClearVisual: stageHandler.isVisual && !stageHandler.isLayout,
          plan: stageHandler.plan,
          reset: stageHandler.reset,
          scheduler
        };
        scheduler._pipe(seriesModel, task);
      }
    };
    Scheduler2.prototype._createOverallStageTask = function(stageHandler, stageHandlerRecord, ecModel, api) {
      var scheduler = this;
      var overallTask = stageHandlerRecord.overallTask = stageHandlerRecord.overallTask || createTask({
        reset: overallTaskReset
      });
      overallTask.context = {
        ecModel,
        api,
        overallReset: stageHandler.overallReset,
        scheduler
      };
      var oldAgentStubMap = overallTask.agentStubMap;
      var newAgentStubMap = overallTask.agentStubMap = createHashMap();
      var seriesType2 = stageHandler.seriesType;
      var getTargetSeries = stageHandler.getTargetSeries;
      var overallProgress = true;
      var shouldOverallTaskDirty = false;
      var errMsg = "";
      if (true) {
        errMsg = '"createOnAllSeries" is not supported for "overallReset", because it will block all streams.';
      }
      assert(!stageHandler.createOnAllSeries, errMsg);
      if (seriesType2) {
        ecModel.eachRawSeriesByType(seriesType2, createStub);
      } else if (getTargetSeries) {
        getTargetSeries(ecModel, api).each(createStub);
      } else {
        overallProgress = false;
        each(ecModel.getSeries(), createStub);
      }
      function createStub(seriesModel) {
        var pipelineId = seriesModel.uid;
        var stub = newAgentStubMap.set(pipelineId, oldAgentStubMap && oldAgentStubMap.get(pipelineId) || // When the result of `getTargetSeries` changed, the overallTask
        // should be set as dirty and re-performed.
        (shouldOverallTaskDirty = true, createTask({
          reset: stubReset,
          onDirty: stubOnDirty
        })));
        stub.context = {
          model: seriesModel,
          overallProgress
          // FIXME:TS never used, so comment it
          // modifyOutputEnd: modifyOutputEnd
        };
        stub.agent = overallTask;
        stub.__block = overallProgress;
        scheduler._pipe(seriesModel, stub);
      }
      if (shouldOverallTaskDirty) {
        overallTask.dirty();
      }
    };
    Scheduler2.prototype._pipe = function(seriesModel, task) {
      var pipelineId = seriesModel.uid;
      var pipeline = this._pipelineMap.get(pipelineId);
      !pipeline.head && (pipeline.head = task);
      pipeline.tail && pipeline.tail.pipe(task);
      pipeline.tail = task;
      task.__idxInPipeline = pipeline.count++;
      task.__pipeline = pipeline;
    };
    Scheduler2.wrapStageHandler = function(stageHandler, visualType) {
      if (isFunction(stageHandler)) {
        stageHandler = {
          overallReset: stageHandler,
          seriesType: detectSeriseType(stageHandler)
        };
      }
      stageHandler.uid = getUID("stageHandler");
      visualType && (stageHandler.visualType = visualType);
      return stageHandler;
    };
    ;
    return Scheduler2;
  }()
);
function overallTaskReset(context) {
  context.overallReset(context.ecModel, context.api, context.payload);
}
function stubReset(context) {
  return context.overallProgress && stubProgress;
}
function stubProgress() {
  this.agent.dirty();
  this.getDownstream().dirty();
}
function stubOnDirty() {
  this.agent && this.agent.dirty();
}
function seriesTaskPlan(context) {
  return context.plan ? context.plan(context.model, context.ecModel, context.api, context.payload) : null;
}
function seriesTaskReset(context) {
  if (context.useClearVisual) {
    context.data.clearAllVisual();
  }
  var resetDefines = context.resetDefines = normalizeToArray(context.reset(context.model, context.ecModel, context.api, context.payload));
  return resetDefines.length > 1 ? map(resetDefines, function(v, idx) {
    return makeSeriesTaskProgress(idx);
  }) : singleSeriesTaskProgress;
}
var singleSeriesTaskProgress = makeSeriesTaskProgress(0);
function makeSeriesTaskProgress(resetDefineIdx) {
  return function(params, context) {
    var data = context.data;
    var resetDefine = context.resetDefines[resetDefineIdx];
    if (resetDefine && resetDefine.dataEach) {
      for (var i = params.start; i < params.end; i++) {
        resetDefine.dataEach(data, i);
      }
    } else if (resetDefine && resetDefine.progress) {
      resetDefine.progress(params, data);
    }
  };
}
function seriesTaskCount(context) {
  return context.data.count();
}
function detectSeriseType(legacyFunc) {
  seriesType = null;
  try {
    legacyFunc(ecModelMock, apiMock);
  } catch (e2) {
  }
  return seriesType;
}
var ecModelMock = {};
var apiMock = {};
var seriesType;
mockMethods(ecModelMock, Global_default);
mockMethods(apiMock, ExtensionAPI_default);
ecModelMock.eachSeriesByType = ecModelMock.eachRawSeriesByType = function(type) {
  seriesType = type;
};
ecModelMock.eachComponent = function(cond) {
  if (cond.mainType === "series" && cond.subType) {
    seriesType = cond.subType;
  }
};
function mockMethods(target, Clz) {
  for (var name_1 in Clz.prototype) {
    target[name_1] = noop;
  }
}
var Scheduler_default = Scheduler;

// node_modules/echarts/lib/theme/light.js
var colorAll = ["#37A2DA", "#32C5E9", "#67E0E3", "#9FE6B8", "#FFDB5C", "#ff9f7f", "#fb7293", "#E062AE", "#E690D1", "#e7bcf3", "#9d96f5", "#8378EA", "#96BFFF"];
var light_default = {
  color: colorAll,
  colorLayer: [["#37A2DA", "#ffd85c", "#fd7b5f"], ["#37A2DA", "#67E0E3", "#FFDB5C", "#ff9f7f", "#E062AE", "#9d96f5"], ["#37A2DA", "#32C5E9", "#9FE6B8", "#FFDB5C", "#ff9f7f", "#fb7293", "#e7bcf3", "#8378EA", "#96BFFF"], colorAll]
};

// node_modules/echarts/lib/theme/dark.js
var contrastColor = "#B9B8CE";
var backgroundColor = "#100C2A";
var axisCommon = function() {
  return {
    axisLine: {
      lineStyle: {
        color: contrastColor
      }
    },
    splitLine: {
      lineStyle: {
        color: "#484753"
      }
    },
    splitArea: {
      areaStyle: {
        color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"]
      }
    },
    minorSplitLine: {
      lineStyle: {
        color: "#20203B"
      }
    }
  };
};
var colorPalette = ["#4992ff", "#7cffb2", "#fddd60", "#ff6e76", "#58d9f9", "#05c091", "#ff8a45", "#8d48e3", "#dd79ff"];
var theme = {
  darkMode: true,
  color: colorPalette,
  backgroundColor,
  axisPointer: {
    lineStyle: {
      color: "#817f91"
    },
    crossStyle: {
      color: "#817f91"
    },
    label: {
      // TODO Contrast of label backgorundColor
      color: "#fff"
    }
  },
  legend: {
    textStyle: {
      color: contrastColor
    }
  },
  textStyle: {
    color: contrastColor
  },
  title: {
    textStyle: {
      color: "#EEF1FA"
    },
    subtextStyle: {
      color: "#B9B8CE"
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: contrastColor
    }
  },
  dataZoom: {
    borderColor: "#71708A",
    textStyle: {
      color: contrastColor
    },
    brushStyle: {
      color: "rgba(135,163,206,0.3)"
    },
    handleStyle: {
      color: "#353450",
      borderColor: "#C5CBE3"
    },
    moveHandleStyle: {
      color: "#B0B6C3",
      opacity: 0.3
    },
    fillerColor: "rgba(135,163,206,0.2)",
    emphasis: {
      handleStyle: {
        borderColor: "#91B7F2",
        color: "#4D587D"
      },
      moveHandleStyle: {
        color: "#636D9A",
        opacity: 0.7
      }
    },
    dataBackground: {
      lineStyle: {
        color: "#71708A",
        width: 1
      },
      areaStyle: {
        color: "#71708A"
      }
    },
    selectedDataBackground: {
      lineStyle: {
        color: "#87A3CE"
      },
      areaStyle: {
        color: "#87A3CE"
      }
    }
  },
  visualMap: {
    textStyle: {
      color: contrastColor
    }
  },
  timeline: {
    lineStyle: {
      color: contrastColor
    },
    label: {
      color: contrastColor
    },
    controlStyle: {
      color: contrastColor,
      borderColor: contrastColor
    }
  },
  calendar: {
    itemStyle: {
      color: backgroundColor
    },
    dayLabel: {
      color: contrastColor
    },
    monthLabel: {
      color: contrastColor
    },
    yearLabel: {
      color: contrastColor
    }
  },
  timeAxis: axisCommon(),
  logAxis: axisCommon(),
  valueAxis: axisCommon(),
  categoryAxis: axisCommon(),
  line: {
    symbol: "circle"
  },
  graph: {
    color: colorPalette
  },
  gauge: {
    title: {
      color: contrastColor
    },
    axisLine: {
      lineStyle: {
        color: [[1, "rgba(207,212,219,0.2)"]]
      }
    },
    axisLabel: {
      color: contrastColor
    },
    detail: {
      color: "#EEF1FA"
    }
  },
  candlestick: {
    itemStyle: {
      color: "#f64e56",
      color0: "#54ea92",
      borderColor: "#f64e56",
      borderColor0: "#54ea92"
      // borderColor: '#ca2824',
      // borderColor0: '#09a443'
    }
  }
};
theme.categoryAxis.splitLine.show = false;
var dark_default = theme;

// node_modules/echarts/lib/util/ECEventProcessor.js
var ECEventProcessor = (
  /** @class */
  function() {
    function ECEventProcessor2() {
    }
    ECEventProcessor2.prototype.normalizeQuery = function(query) {
      var cptQuery = {};
      var dataQuery = {};
      var otherQuery = {};
      if (isString(query)) {
        var condCptType = parseClassType(query);
        cptQuery.mainType = condCptType.main || null;
        cptQuery.subType = condCptType.sub || null;
      } else {
        var suffixes_1 = ["Index", "Name", "Id"];
        var dataKeys_1 = {
          name: 1,
          dataIndex: 1,
          dataType: 1
        };
        each(query, function(val, key) {
          var reserved = false;
          for (var i = 0; i < suffixes_1.length; i++) {
            var propSuffix = suffixes_1[i];
            var suffixPos = key.lastIndexOf(propSuffix);
            if (suffixPos > 0 && suffixPos === key.length - propSuffix.length) {
              var mainType = key.slice(0, suffixPos);
              if (mainType !== "data") {
                cptQuery.mainType = mainType;
                cptQuery[propSuffix.toLowerCase()] = val;
                reserved = true;
              }
            }
          }
          if (dataKeys_1.hasOwnProperty(key)) {
            dataQuery[key] = val;
            reserved = true;
          }
          if (!reserved) {
            otherQuery[key] = val;
          }
        });
      }
      return {
        cptQuery,
        dataQuery,
        otherQuery
      };
    };
    ECEventProcessor2.prototype.filter = function(eventType, query) {
      var eventInfo = this.eventInfo;
      if (!eventInfo) {
        return true;
      }
      var targetEl = eventInfo.targetEl;
      var packedEvent = eventInfo.packedEvent;
      var model = eventInfo.model;
      var view = eventInfo.view;
      if (!model || !view) {
        return true;
      }
      var cptQuery = query.cptQuery;
      var dataQuery = query.dataQuery;
      return check(cptQuery, model, "mainType") && check(cptQuery, model, "subType") && check(cptQuery, model, "index", "componentIndex") && check(cptQuery, model, "name") && check(cptQuery, model, "id") && check(dataQuery, packedEvent, "name") && check(dataQuery, packedEvent, "dataIndex") && check(dataQuery, packedEvent, "dataType") && (!view.filterForExposedEvent || view.filterForExposedEvent(eventType, query.otherQuery, targetEl, packedEvent));
      function check(query2, host, prop, propOnHost) {
        return query2[prop] == null || host[propOnHost || prop] === query2[prop];
      }
    };
    ECEventProcessor2.prototype.afterTrigger = function() {
      this.eventInfo = null;
    };
    return ECEventProcessor2;
  }()
);

// node_modules/echarts/lib/visual/symbol.js
var SYMBOL_PROPS_WITH_CB = ["symbol", "symbolSize", "symbolRotate", "symbolOffset"];
var SYMBOL_PROPS = SYMBOL_PROPS_WITH_CB.concat(["symbolKeepAspect"]);
var seriesSymbolTask = {
  createOnAllSeries: true,
  // For legend.
  performRawSeries: true,
  reset: function(seriesModel, ecModel) {
    var data = seriesModel.getData();
    if (seriesModel.legendIcon) {
      data.setVisual("legendIcon", seriesModel.legendIcon);
    }
    if (!seriesModel.hasSymbolVisual) {
      return;
    }
    var symbolOptions = {};
    var symbolOptionsCb = {};
    var hasCallback = false;
    for (var i = 0; i < SYMBOL_PROPS_WITH_CB.length; i++) {
      var symbolPropName = SYMBOL_PROPS_WITH_CB[i];
      var val = seriesModel.get(symbolPropName);
      if (isFunction(val)) {
        hasCallback = true;
        symbolOptionsCb[symbolPropName] = val;
      } else {
        symbolOptions[symbolPropName] = val;
      }
    }
    symbolOptions.symbol = symbolOptions.symbol || seriesModel.defaultSymbol;
    data.setVisual(extend({
      legendIcon: seriesModel.legendIcon || symbolOptions.symbol,
      symbolKeepAspect: seriesModel.get("symbolKeepAspect")
    }, symbolOptions));
    if (ecModel.isSeriesFiltered(seriesModel)) {
      return;
    }
    var symbolPropsCb = keys(symbolOptionsCb);
    function dataEach(data2, idx) {
      var rawValue = seriesModel.getRawValue(idx);
      var params = seriesModel.getDataParams(idx);
      for (var i2 = 0; i2 < symbolPropsCb.length; i2++) {
        var symbolPropName2 = symbolPropsCb[i2];
        data2.setItemVisual(idx, symbolPropName2, symbolOptionsCb[symbolPropName2](rawValue, params));
      }
    }
    return {
      dataEach: hasCallback ? dataEach : null
    };
  }
};
var dataSymbolTask = {
  createOnAllSeries: true,
  // For legend.
  performRawSeries: true,
  reset: function(seriesModel, ecModel) {
    if (!seriesModel.hasSymbolVisual) {
      return;
    }
    if (ecModel.isSeriesFiltered(seriesModel)) {
      return;
    }
    var data = seriesModel.getData();
    function dataEach(data2, idx) {
      var itemModel = data2.getItemModel(idx);
      for (var i = 0; i < SYMBOL_PROPS.length; i++) {
        var symbolPropName = SYMBOL_PROPS[i];
        var val = itemModel.getShallow(symbolPropName, true);
        if (val != null) {
          data2.setItemVisual(idx, symbolPropName, val);
        }
      }
    }
    return {
      dataEach: data.hasItemOption ? dataEach : null
    };
  }
};

// node_modules/echarts/lib/visual/helper.js
function getItemVisualFromData(data, dataIndex, key) {
  switch (key) {
    case "color":
      var style = data.getItemVisual(dataIndex, "style");
      return style[data.getVisual("drawType")];
    case "opacity":
      return data.getItemVisual(dataIndex, "style").opacity;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      return data.getItemVisual(dataIndex, key);
    default:
      if (true) {
        console.warn("Unknown visual type " + key);
      }
  }
}
function getVisualFromData(data, key) {
  switch (key) {
    case "color":
      var style = data.getVisual("style");
      return style[data.getVisual("drawType")];
    case "opacity":
      return data.getVisual("style").opacity;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      return data.getVisual(key);
    default:
      if (true) {
        console.warn("Unknown visual type " + key);
      }
  }
}
function setItemVisualFromData(data, dataIndex, key, value) {
  switch (key) {
    case "color":
      var style = data.ensureUniqueItemVisual(dataIndex, "style");
      style[data.getVisual("drawType")] = value;
      data.setItemVisual(dataIndex, "colorFromPalette", false);
      break;
    case "opacity":
      data.ensureUniqueItemVisual(dataIndex, "style").opacity = value;
      break;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      data.setItemVisual(dataIndex, key, value);
      break;
    default:
      if (true) {
        console.warn("Unknown visual type " + key);
      }
  }
}

// node_modules/echarts/lib/legacy/dataSelectAction.js
function createLegacyDataSelectAction(seriesType2, ecRegisterAction) {
  function getSeriesIndices(ecModel, payload) {
    var seriesIndices = [];
    ecModel.eachComponent({
      mainType: "series",
      subType: seriesType2,
      query: payload
    }, function(seriesModel) {
      seriesIndices.push(seriesModel.seriesIndex);
    });
    return seriesIndices;
  }
  each([[seriesType2 + "ToggleSelect", "toggleSelect"], [seriesType2 + "Select", "select"], [seriesType2 + "UnSelect", "unselect"]], function(eventsMap) {
    ecRegisterAction(eventsMap[0], function(payload, ecModel, api) {
      payload = extend({}, payload);
      if (true) {
        deprecateReplaceLog(payload.type, eventsMap[1]);
      }
      api.dispatchAction(extend(payload, {
        type: eventsMap[1],
        seriesIndex: getSeriesIndices(ecModel, payload)
      }));
    });
  });
}
function handleSeriesLegacySelectEvents(type, eventPostfix, ecIns, ecModel, payload) {
  var legacyEventName = type + eventPostfix;
  if (!ecIns.isSilent(legacyEventName)) {
    if (true) {
      deprecateLog("event " + legacyEventName + " is deprecated.");
    }
    ecModel.eachComponent({
      mainType: "series",
      subType: "pie"
    }, function(seriesModel) {
      var seriesIndex = seriesModel.seriesIndex;
      var selectedMap = seriesModel.option.selectedMap;
      var selected = payload.selected;
      for (var i = 0; i < selected.length; i++) {
        if (selected[i].seriesIndex === seriesIndex) {
          var data = seriesModel.getData();
          var dataIndex = queryDataIndex(data, payload.fromActionPayload);
          ecIns.trigger(legacyEventName, {
            type: legacyEventName,
            seriesId: seriesModel.id,
            name: isArray(dataIndex) ? data.getName(dataIndex[0]) : data.getName(dataIndex),
            selected: isString(selectedMap) ? selectedMap : extend({}, selectedMap)
          });
        }
      }
    });
  }
}
function handleLegacySelectEvents(messageCenter, ecIns, api) {
  messageCenter.on("selectchanged", function(params) {
    var ecModel = api.getModel();
    if (params.isFromClick) {
      handleSeriesLegacySelectEvents("map", "selectchanged", ecIns, ecModel, params);
      handleSeriesLegacySelectEvents("pie", "selectchanged", ecIns, ecModel, params);
    } else if (params.fromAction === "select") {
      handleSeriesLegacySelectEvents("map", "selected", ecIns, ecModel, params);
      handleSeriesLegacySelectEvents("pie", "selected", ecIns, ecModel, params);
    } else if (params.fromAction === "unselect") {
      handleSeriesLegacySelectEvents("map", "unselected", ecIns, ecModel, params);
      handleSeriesLegacySelectEvents("pie", "unselected", ecIns, ecModel, params);
    }
  });
}

// node_modules/echarts/lib/util/event.js
function findEventDispatcher(target, det, returnFirstMatch) {
  var found;
  while (target) {
    if (det(target)) {
      found = target;
      if (returnFirstMatch) {
        break;
      }
    }
    target = target.__hostTarget || target.parent;
  }
  return found;
}

// node_modules/zrender/lib/core/WeakMap.js
var wmUniqueIndex = Math.round(Math.random() * 9);
var supportDefineProperty = typeof Object.defineProperty === "function";
var WeakMap = function() {
  function WeakMap2() {
    this._id = "__ec_inner_" + wmUniqueIndex++;
  }
  WeakMap2.prototype.get = function(key) {
    return this._guard(key)[this._id];
  };
  WeakMap2.prototype.set = function(key, value) {
    var target = this._guard(key);
    if (supportDefineProperty) {
      Object.defineProperty(target, this._id, {
        value,
        enumerable: false,
        configurable: true
      });
    } else {
      target[this._id] = value;
    }
    return this;
  };
  WeakMap2.prototype["delete"] = function(key) {
    if (this.has(key)) {
      delete this._guard(key)[this._id];
      return true;
    }
    return false;
  };
  WeakMap2.prototype.has = function(key) {
    return !!this._guard(key)[this._id];
  };
  WeakMap2.prototype._guard = function(key) {
    if (key !== Object(key)) {
      throw TypeError("Value of WeakMap is not a non-null object.");
    }
    return key;
  };
  return WeakMap2;
}();
var WeakMap_default = WeakMap;

// node_modules/echarts/lib/util/symbol.js
var Triangle = Path_default.extend({
  type: "triangle",
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  },
  buildPath: function(path, shape) {
    var cx = shape.cx;
    var cy = shape.cy;
    var width = shape.width / 2;
    var height = shape.height / 2;
    path.moveTo(cx, cy - height);
    path.lineTo(cx + width, cy + height);
    path.lineTo(cx - width, cy + height);
    path.closePath();
  }
});
var Diamond = Path_default.extend({
  type: "diamond",
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  },
  buildPath: function(path, shape) {
    var cx = shape.cx;
    var cy = shape.cy;
    var width = shape.width / 2;
    var height = shape.height / 2;
    path.moveTo(cx, cy - height);
    path.lineTo(cx + width, cy);
    path.lineTo(cx, cy + height);
    path.lineTo(cx - width, cy);
    path.closePath();
  }
});
var Pin = Path_default.extend({
  type: "pin",
  shape: {
    // x, y on the cusp
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function(path, shape) {
    var x = shape.x;
    var y = shape.y;
    var w = shape.width / 5 * 3;
    var h = Math.max(w, shape.height);
    var r = w / 2;
    var dy = r * r / (h - r);
    var cy = y - h + r + dy;
    var angle = Math.asin(dy / r);
    var dx = Math.cos(angle) * r;
    var tanX = Math.sin(angle);
    var tanY = Math.cos(angle);
    var cpLen = r * 0.6;
    var cpLen2 = r * 0.7;
    path.moveTo(x - dx, cy + dy);
    path.arc(x, cy, r, Math.PI - angle, Math.PI * 2 + angle);
    path.bezierCurveTo(x + dx - tanX * cpLen, cy + dy + tanY * cpLen, x, y - cpLen2, x, y);
    path.bezierCurveTo(x, y - cpLen2, x - dx + tanX * cpLen, cy + dy + tanY * cpLen, x - dx, cy + dy);
    path.closePath();
  }
});
var Arrow = Path_default.extend({
  type: "arrow",
  shape: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function(ctx, shape) {
    var height = shape.height;
    var width = shape.width;
    var x = shape.x;
    var y = shape.y;
    var dx = width / 3 * 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + height);
    ctx.lineTo(x, y + height / 4 * 3);
    ctx.lineTo(x - dx, y + height);
    ctx.lineTo(x, y);
    ctx.closePath();
  }
});
var symbolCtors = {
  line: Line_default,
  rect: Rect_default,
  roundRect: Rect_default,
  square: Rect_default,
  circle: Circle_default,
  diamond: Diamond,
  pin: Pin,
  arrow: Arrow,
  triangle: Triangle
};
var symbolShapeMakers = {
  line: function(x, y, w, h, shape) {
    shape.x1 = x;
    shape.y1 = y + h / 2;
    shape.x2 = x + w;
    shape.y2 = y + h / 2;
  },
  rect: function(x, y, w, h, shape) {
    shape.x = x;
    shape.y = y;
    shape.width = w;
    shape.height = h;
  },
  roundRect: function(x, y, w, h, shape) {
    shape.x = x;
    shape.y = y;
    shape.width = w;
    shape.height = h;
    shape.r = Math.min(w, h) / 4;
  },
  square: function(x, y, w, h, shape) {
    var size = Math.min(w, h);
    shape.x = x;
    shape.y = y;
    shape.width = size;
    shape.height = size;
  },
  circle: function(x, y, w, h, shape) {
    shape.cx = x + w / 2;
    shape.cy = y + h / 2;
    shape.r = Math.min(w, h) / 2;
  },
  diamond: function(x, y, w, h, shape) {
    shape.cx = x + w / 2;
    shape.cy = y + h / 2;
    shape.width = w;
    shape.height = h;
  },
  pin: function(x, y, w, h, shape) {
    shape.x = x + w / 2;
    shape.y = y + h / 2;
    shape.width = w;
    shape.height = h;
  },
  arrow: function(x, y, w, h, shape) {
    shape.x = x + w / 2;
    shape.y = y + h / 2;
    shape.width = w;
    shape.height = h;
  },
  triangle: function(x, y, w, h, shape) {
    shape.cx = x + w / 2;
    shape.cy = y + h / 2;
    shape.width = w;
    shape.height = h;
  }
};
var symbolBuildProxies = {};
each(symbolCtors, function(Ctor, name) {
  symbolBuildProxies[name] = new Ctor();
});
var SymbolClz = Path_default.extend({
  type: "symbol",
  shape: {
    symbolType: "",
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  calculateTextPosition: function(out2, config, rect) {
    var res = calculateTextPosition(out2, config, rect);
    var shape = this.shape;
    if (shape && shape.symbolType === "pin" && config.position === "inside") {
      res.y = rect.y + rect.height * 0.4;
    }
    return res;
  },
  buildPath: function(ctx, shape, inBundle) {
    var symbolType = shape.symbolType;
    if (symbolType !== "none") {
      var proxySymbol = symbolBuildProxies[symbolType];
      if (!proxySymbol) {
        symbolType = "rect";
        proxySymbol = symbolBuildProxies[symbolType];
      }
      symbolShapeMakers[symbolType](shape.x, shape.y, shape.width, shape.height, proxySymbol.shape);
      proxySymbol.buildPath(ctx, proxySymbol.shape, inBundle);
    }
  }
});
function symbolPathSetColor(color, innerColor2) {
  if (this.type !== "image") {
    var symbolStyle = this.style;
    if (this.__isEmptyBrush) {
      symbolStyle.stroke = color;
      symbolStyle.fill = innerColor2 || "#fff";
      symbolStyle.lineWidth = 2;
    } else if (this.shape.symbolType === "line") {
      symbolStyle.stroke = color;
    } else {
      symbolStyle.fill = color;
    }
    this.markRedraw();
  }
}
function createSymbol(symbolType, x, y, w, h, color, keepAspect) {
  var isEmpty = symbolType.indexOf("empty") === 0;
  if (isEmpty) {
    symbolType = symbolType.substr(5, 1).toLowerCase() + symbolType.substr(6);
  }
  var symbolPath;
  if (symbolType.indexOf("image://") === 0) {
    symbolPath = makeImage(symbolType.slice(8), new BoundingRect_default(x, y, w, h), keepAspect ? "center" : "cover");
  } else if (symbolType.indexOf("path://") === 0) {
    symbolPath = makePath(symbolType.slice(7), {}, new BoundingRect_default(x, y, w, h), keepAspect ? "center" : "cover");
  } else {
    symbolPath = new SymbolClz({
      shape: {
        symbolType,
        x,
        y,
        width: w,
        height: h
      }
    });
  }
  symbolPath.__isEmptyBrush = isEmpty;
  symbolPath.setColor = symbolPathSetColor;
  if (color) {
    symbolPath.setColor(color);
  }
  return symbolPath;
}
function normalizeSymbolSize(symbolSize) {
  if (!isArray(symbolSize)) {
    symbolSize = [+symbolSize, +symbolSize];
  }
  return [symbolSize[0] || 0, symbolSize[1] || 0];
}
function normalizeSymbolOffset(symbolOffset, symbolSize) {
  if (symbolOffset == null) {
    return;
  }
  if (!isArray(symbolOffset)) {
    symbolOffset = [symbolOffset, symbolOffset];
  }
  return [parsePercent2(symbolOffset[0], symbolSize[0]) || 0, parsePercent2(retrieve2(symbolOffset[1], symbolOffset[0]), symbolSize[1]) || 0];
}

// node_modules/echarts/lib/util/decal.js
var decalMap = new WeakMap_default();
var decalCache = new LRU_default(100);
var decalKeys = ["symbol", "symbolSize", "symbolKeepAspect", "color", "backgroundColor", "dashArrayX", "dashArrayY", "maxTileWidth", "maxTileHeight"];
function createOrUpdatePatternFromDecal(decalObject, api) {
  if (decalObject === "none") {
    return null;
  }
  var dpr = api.getDevicePixelRatio();
  var zr = api.getZr();
  var isSVG = zr.painter.type === "svg";
  if (decalObject.dirty) {
    decalMap["delete"](decalObject);
  }
  var oldPattern = decalMap.get(decalObject);
  if (oldPattern) {
    return oldPattern;
  }
  var decalOpt = defaults(decalObject, {
    symbol: "rect",
    symbolSize: 1,
    symbolKeepAspect: true,
    color: "rgba(0, 0, 0, 0.2)",
    backgroundColor: null,
    dashArrayX: 5,
    dashArrayY: 5,
    rotation: 0,
    maxTileWidth: 512,
    maxTileHeight: 512
  });
  if (decalOpt.backgroundColor === "none") {
    decalOpt.backgroundColor = null;
  }
  var pattern = {
    repeat: "repeat"
  };
  setPatternnSource(pattern);
  pattern.rotation = decalOpt.rotation;
  pattern.scaleX = pattern.scaleY = isSVG ? 1 : 1 / dpr;
  decalMap.set(decalObject, pattern);
  decalObject.dirty = false;
  return pattern;
  function setPatternnSource(pattern2) {
    var keys2 = [dpr];
    var isValidKey = true;
    for (var i = 0; i < decalKeys.length; ++i) {
      var value = decalOpt[decalKeys[i]];
      if (value != null && !isArray(value) && !isString(value) && !isNumber(value) && typeof value !== "boolean") {
        isValidKey = false;
        break;
      }
      keys2.push(value);
    }
    var cacheKey;
    if (isValidKey) {
      cacheKey = keys2.join(",") + (isSVG ? "-svg" : "");
      var cache = decalCache.get(cacheKey);
      if (cache) {
        isSVG ? pattern2.svgElement = cache : pattern2.image = cache;
      }
    }
    var dashArrayX = normalizeDashArrayX(decalOpt.dashArrayX);
    var dashArrayY = normalizeDashArrayY(decalOpt.dashArrayY);
    var symbolArray = normalizeSymbolArray(decalOpt.symbol);
    var lineBlockLengthsX = getLineBlockLengthX(dashArrayX);
    var lineBlockLengthY = getLineBlockLengthY(dashArrayY);
    var canvas = !isSVG && platformApi.createCanvas();
    var svgRoot = isSVG && {
      tag: "g",
      attrs: {},
      key: "dcl",
      children: []
    };
    var pSize = getPatternSize();
    var ctx;
    if (canvas) {
      canvas.width = pSize.width * dpr;
      canvas.height = pSize.height * dpr;
      ctx = canvas.getContext("2d");
    }
    brushDecal();
    if (isValidKey) {
      decalCache.put(cacheKey, canvas || svgRoot);
    }
    pattern2.image = canvas;
    pattern2.svgElement = svgRoot;
    pattern2.svgWidth = pSize.width;
    pattern2.svgHeight = pSize.height;
    function getPatternSize() {
      var width = 1;
      for (var i2 = 0, xlen = lineBlockLengthsX.length; i2 < xlen; ++i2) {
        width = getLeastCommonMultiple(width, lineBlockLengthsX[i2]);
      }
      var symbolRepeats = 1;
      for (var i2 = 0, xlen = symbolArray.length; i2 < xlen; ++i2) {
        symbolRepeats = getLeastCommonMultiple(symbolRepeats, symbolArray[i2].length);
      }
      width *= symbolRepeats;
      var height = lineBlockLengthY * lineBlockLengthsX.length * symbolArray.length;
      if (true) {
        var warn2 = function(attrName) {
          console.warn("Calculated decal size is greater than " + attrName + " due to decal option settings so " + attrName + " is used for the decal size. Please consider changing the decal option to make a smaller decal or set " + attrName + " to be larger to avoid incontinuity.");
        };
        if (width > decalOpt.maxTileWidth) {
          warn2("maxTileWidth");
        }
        if (height > decalOpt.maxTileHeight) {
          warn2("maxTileHeight");
        }
      }
      return {
        width: Math.max(1, Math.min(width, decalOpt.maxTileWidth)),
        height: Math.max(1, Math.min(height, decalOpt.maxTileHeight))
      };
    }
    function brushDecal() {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (decalOpt.backgroundColor) {
          ctx.fillStyle = decalOpt.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      var ySum = 0;
      for (var i2 = 0; i2 < dashArrayY.length; ++i2) {
        ySum += dashArrayY[i2];
      }
      if (ySum <= 0) {
        return;
      }
      var y = -lineBlockLengthY;
      var yId = 0;
      var yIdTotal = 0;
      var xId0 = 0;
      while (y < pSize.height) {
        if (yId % 2 === 0) {
          var symbolYId = yIdTotal / 2 % symbolArray.length;
          var x = 0;
          var xId1 = 0;
          var xId1Total = 0;
          while (x < pSize.width * 2) {
            var xSum = 0;
            for (var i2 = 0; i2 < dashArrayX[xId0].length; ++i2) {
              xSum += dashArrayX[xId0][i2];
            }
            if (xSum <= 0) {
              break;
            }
            if (xId1 % 2 === 0) {
              var size = (1 - decalOpt.symbolSize) * 0.5;
              var left = x + dashArrayX[xId0][xId1] * size;
              var top_1 = y + dashArrayY[yId] * size;
              var width = dashArrayX[xId0][xId1] * decalOpt.symbolSize;
              var height = dashArrayY[yId] * decalOpt.symbolSize;
              var symbolXId = xId1Total / 2 % symbolArray[symbolYId].length;
              brushSymbol(left, top_1, width, height, symbolArray[symbolYId][symbolXId]);
            }
            x += dashArrayX[xId0][xId1];
            ++xId1Total;
            ++xId1;
            if (xId1 === dashArrayX[xId0].length) {
              xId1 = 0;
            }
          }
          ++xId0;
          if (xId0 === dashArrayX.length) {
            xId0 = 0;
          }
        }
        y += dashArrayY[yId];
        ++yIdTotal;
        ++yId;
        if (yId === dashArrayY.length) {
          yId = 0;
        }
      }
      function brushSymbol(x2, y2, width2, height2, symbolType) {
        var scale4 = isSVG ? 1 : dpr;
        var symbol = createSymbol(symbolType, x2 * scale4, y2 * scale4, width2 * scale4, height2 * scale4, decalOpt.color, decalOpt.symbolKeepAspect);
        if (isSVG) {
          var symbolVNode = zr.painter.renderOneToVNode(symbol);
          if (symbolVNode) {
            svgRoot.children.push(symbolVNode);
          }
        } else {
          brushSingle(ctx, symbol);
        }
      }
    }
  }
}
function normalizeSymbolArray(symbol) {
  if (!symbol || symbol.length === 0) {
    return [["rect"]];
  }
  if (isString(symbol)) {
    return [[symbol]];
  }
  var isAllString = true;
  for (var i = 0; i < symbol.length; ++i) {
    if (!isString(symbol[i])) {
      isAllString = false;
      break;
    }
  }
  if (isAllString) {
    return normalizeSymbolArray([symbol]);
  }
  var result = [];
  for (var i = 0; i < symbol.length; ++i) {
    if (isString(symbol[i])) {
      result.push([symbol[i]]);
    } else {
      result.push(symbol[i]);
    }
  }
  return result;
}
function normalizeDashArrayX(dash) {
  if (!dash || dash.length === 0) {
    return [[0, 0]];
  }
  if (isNumber(dash)) {
    var dashValue = Math.ceil(dash);
    return [[dashValue, dashValue]];
  }
  var isAllNumber = true;
  for (var i = 0; i < dash.length; ++i) {
    if (!isNumber(dash[i])) {
      isAllNumber = false;
      break;
    }
  }
  if (isAllNumber) {
    return normalizeDashArrayX([dash]);
  }
  var result = [];
  for (var i = 0; i < dash.length; ++i) {
    if (isNumber(dash[i])) {
      var dashValue = Math.ceil(dash[i]);
      result.push([dashValue, dashValue]);
    } else {
      var dashValue = map(dash[i], function(n) {
        return Math.ceil(n);
      });
      if (dashValue.length % 2 === 1) {
        result.push(dashValue.concat(dashValue));
      } else {
        result.push(dashValue);
      }
    }
  }
  return result;
}
function normalizeDashArrayY(dash) {
  if (!dash || typeof dash === "object" && dash.length === 0) {
    return [0, 0];
  }
  if (isNumber(dash)) {
    var dashValue_1 = Math.ceil(dash);
    return [dashValue_1, dashValue_1];
  }
  var dashValue = map(dash, function(n) {
    return Math.ceil(n);
  });
  return dash.length % 2 ? dashValue.concat(dashValue) : dashValue;
}
function getLineBlockLengthX(dash) {
  return map(dash, function(line) {
    return getLineBlockLengthY(line);
  });
}
function getLineBlockLengthY(dash) {
  var blockLength = 0;
  for (var i = 0; i < dash.length; ++i) {
    blockLength += dash[i];
  }
  if (dash.length % 2 === 1) {
    return blockLength * 2;
  }
  return blockLength;
}

// node_modules/echarts/lib/visual/decal.js
function decalVisual(ecModel, api) {
  ecModel.eachRawSeries(function(seriesModel) {
    if (ecModel.isSeriesFiltered(seriesModel)) {
      return;
    }
    var data = seriesModel.getData();
    if (data.hasItemVisual()) {
      data.each(function(idx) {
        var decal2 = data.getItemVisual(idx, "decal");
        if (decal2) {
          var itemStyle = data.ensureUniqueItemVisual(idx, "style");
          itemStyle.decal = createOrUpdatePatternFromDecal(decal2, api);
        }
      });
    }
    var decal = data.getVisual("decal");
    if (decal) {
      var style = data.getVisual("style");
      style.decal = createOrUpdatePatternFromDecal(decal, api);
    }
  });
}

// node_modules/echarts/lib/core/lifecycle.js
var lifecycle = new Eventful_default();
var lifecycle_default = lifecycle;

// node_modules/echarts/lib/core/impl.js
var implsStore = {};
function registerImpl(name, impl) {
  if (true) {
    if (implsStore[name]) {
      error("Already has an implementation of " + name + ".");
    }
  }
  implsStore[name] = impl;
}
function getImpl(name) {
  if (true) {
    if (!implsStore[name]) {
      error("Implementation of " + name + " doesn't exists.");
    }
  }
  return implsStore[name];
}

// node_modules/echarts/lib/core/echarts.js
var version2 = "5.4.2";
var dependencies = {
  zrender: "5.4.3"
};
var TEST_FRAME_REMAIN_TIME = 1;
var PRIORITY_PROCESSOR_SERIES_FILTER = 800;
var PRIORITY_PROCESSOR_DATASTACK = 900;
var PRIORITY_PROCESSOR_FILTER = 1e3;
var PRIORITY_PROCESSOR_DEFAULT = 2e3;
var PRIORITY_PROCESSOR_STATISTIC = 5e3;
var PRIORITY_VISUAL_LAYOUT = 1e3;
var PRIORITY_VISUAL_PROGRESSIVE_LAYOUT = 1100;
var PRIORITY_VISUAL_GLOBAL = 2e3;
var PRIORITY_VISUAL_CHART = 3e3;
var PRIORITY_VISUAL_COMPONENT = 4e3;
var PRIORITY_VISUAL_CHART_DATA_CUSTOM = 4500;
var PRIORITY_VISUAL_POST_CHART_LAYOUT = 4600;
var PRIORITY_VISUAL_BRUSH = 5e3;
var PRIORITY_VISUAL_ARIA = 6e3;
var PRIORITY_VISUAL_DECAL = 7e3;
var PRIORITY = {
  PROCESSOR: {
    FILTER: PRIORITY_PROCESSOR_FILTER,
    SERIES_FILTER: PRIORITY_PROCESSOR_SERIES_FILTER,
    STATISTIC: PRIORITY_PROCESSOR_STATISTIC
  },
  VISUAL: {
    LAYOUT: PRIORITY_VISUAL_LAYOUT,
    PROGRESSIVE_LAYOUT: PRIORITY_VISUAL_PROGRESSIVE_LAYOUT,
    GLOBAL: PRIORITY_VISUAL_GLOBAL,
    CHART: PRIORITY_VISUAL_CHART,
    POST_CHART_LAYOUT: PRIORITY_VISUAL_POST_CHART_LAYOUT,
    COMPONENT: PRIORITY_VISUAL_COMPONENT,
    BRUSH: PRIORITY_VISUAL_BRUSH,
    CHART_ITEM: PRIORITY_VISUAL_CHART_DATA_CUSTOM,
    ARIA: PRIORITY_VISUAL_ARIA,
    DECAL: PRIORITY_VISUAL_DECAL
  }
};
var IN_MAIN_PROCESS_KEY = "__flagInMainProcess";
var PENDING_UPDATE = "__pendingUpdate";
var STATUS_NEEDS_UPDATE_KEY = "__needsUpdateStatus";
var ACTION_REG = /^[a-zA-Z0-9_]+$/;
var CONNECT_STATUS_KEY = "__connectUpdateStatus";
var CONNECT_STATUS_PENDING = 0;
var CONNECT_STATUS_UPDATING = 1;
var CONNECT_STATUS_UPDATED = 2;
function createRegisterEventWithLowercaseECharts(method) {
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (this.isDisposed()) {
      disposedWarning(this.id);
      return;
    }
    return toLowercaseNameAndCallEventful(this, method, args);
  };
}
function createRegisterEventWithLowercaseMessageCenter(method) {
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    return toLowercaseNameAndCallEventful(this, method, args);
  };
}
function toLowercaseNameAndCallEventful(host, method, args) {
  args[0] = args[0] && args[0].toLowerCase();
  return Eventful_default.prototype[method].apply(host, args);
}
var MessageCenter = (
  /** @class */
  function(_super) {
    __extends(MessageCenter2, _super);
    function MessageCenter2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    return MessageCenter2;
  }(Eventful_default)
);
var messageCenterProto = MessageCenter.prototype;
messageCenterProto.on = createRegisterEventWithLowercaseMessageCenter("on");
messageCenterProto.off = createRegisterEventWithLowercaseMessageCenter("off");
var prepare;
var prepareView;
var updateDirectly;
var updateMethods;
var doConvertPixel;
var updateStreamModes;
var doDispatchAction;
var flushPendingActions;
var triggerUpdatedEvent;
var bindRenderedEvent;
var bindMouseEvent;
var render;
var renderComponents;
var renderSeries;
var createExtensionAPI;
var enableConnect;
var markStatusToUpdate;
var applyChangedStates;
var ECharts = (
  /** @class */
  function(_super) {
    __extends(ECharts2, _super);
    function ECharts2(dom, theme2, opts) {
      var _this = _super.call(this, new ECEventProcessor()) || this;
      _this._chartsViews = [];
      _this._chartsMap = {};
      _this._componentsViews = [];
      _this._componentsMap = {};
      _this._pendingActions = [];
      opts = opts || {};
      if (isString(theme2)) {
        theme2 = themeStorage[theme2];
      }
      _this._dom = dom;
      var defaultRenderer = "canvas";
      var defaultCoarsePointer = "auto";
      var defaultUseDirtyRect = false;
      if (true) {
        var root = (
          /* eslint-disable-next-line */
          env_default.hasGlobalWindow ? window : global
        );
        defaultRenderer = root.__ECHARTS__DEFAULT__RENDERER__ || defaultRenderer;
        defaultCoarsePointer = retrieve2(root.__ECHARTS__DEFAULT__COARSE_POINTER, defaultCoarsePointer);
        var devUseDirtyRect = root.__ECHARTS__DEFAULT__USE_DIRTY_RECT__;
        defaultUseDirtyRect = devUseDirtyRect == null ? defaultUseDirtyRect : devUseDirtyRect;
      }
      var zr = _this._zr = init(dom, {
        renderer: opts.renderer || defaultRenderer,
        devicePixelRatio: opts.devicePixelRatio,
        width: opts.width,
        height: opts.height,
        ssr: opts.ssr,
        useDirtyRect: retrieve2(opts.useDirtyRect, defaultUseDirtyRect),
        useCoarsePointer: retrieve2(opts.useCoarsePointer, defaultCoarsePointer),
        pointerSize: opts.pointerSize
      });
      _this._ssr = opts.ssr;
      _this._throttledZrFlush = throttle(bind(zr.flush, zr), 17);
      theme2 = clone(theme2);
      theme2 && globalBackwardCompat(theme2, true);
      _this._theme = theme2;
      _this._locale = createLocaleObject(opts.locale || SYSTEM_LANG);
      _this._coordSysMgr = new CoordinateSystem_default();
      var api = _this._api = createExtensionAPI(_this);
      function prioritySortFunc(a, b) {
        return a.__prio - b.__prio;
      }
      sort(visualFuncs, prioritySortFunc);
      sort(dataProcessorFuncs, prioritySortFunc);
      _this._scheduler = new Scheduler_default(_this, api, dataProcessorFuncs, visualFuncs);
      _this._messageCenter = new MessageCenter();
      _this._initEvents();
      _this.resize = bind(_this.resize, _this);
      zr.animation.on("frame", _this._onframe, _this);
      bindRenderedEvent(zr, _this);
      bindMouseEvent(zr, _this);
      setAsPrimitive(_this);
      return _this;
    }
    ECharts2.prototype._onframe = function() {
      if (this._disposed) {
        return;
      }
      applyChangedStates(this);
      var scheduler = this._scheduler;
      if (this[PENDING_UPDATE]) {
        var silent = this[PENDING_UPDATE].silent;
        this[IN_MAIN_PROCESS_KEY] = true;
        try {
          prepare(this);
          updateMethods.update.call(this, null, this[PENDING_UPDATE].updateParams);
        } catch (e2) {
          this[IN_MAIN_PROCESS_KEY] = false;
          this[PENDING_UPDATE] = null;
          throw e2;
        }
        this._zr.flush();
        this[IN_MAIN_PROCESS_KEY] = false;
        this[PENDING_UPDATE] = null;
        flushPendingActions.call(this, silent);
        triggerUpdatedEvent.call(this, silent);
      } else if (scheduler.unfinished) {
        var remainTime = TEST_FRAME_REMAIN_TIME;
        var ecModel = this._model;
        var api = this._api;
        scheduler.unfinished = false;
        do {
          var startTime = +/* @__PURE__ */ new Date();
          scheduler.performSeriesTasks(ecModel);
          scheduler.performDataProcessorTasks(ecModel);
          updateStreamModes(this, ecModel);
          scheduler.performVisualTasks(ecModel);
          renderSeries(this, this._model, api, "remain", {});
          remainTime -= +/* @__PURE__ */ new Date() - startTime;
        } while (remainTime > 0 && scheduler.unfinished);
        if (!scheduler.unfinished) {
          this._zr.flush();
        }
      }
    };
    ECharts2.prototype.getDom = function() {
      return this._dom;
    };
    ECharts2.prototype.getId = function() {
      return this.id;
    };
    ECharts2.prototype.getZr = function() {
      return this._zr;
    };
    ECharts2.prototype.isSSR = function() {
      return this._ssr;
    };
    ECharts2.prototype.setOption = function(option, notMerge, lazyUpdate) {
      if (this[IN_MAIN_PROCESS_KEY]) {
        if (true) {
          error("`setOption` should not be called during main process.");
        }
        return;
      }
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      var silent;
      var replaceMerge;
      var transitionOpt;
      if (isObject(notMerge)) {
        lazyUpdate = notMerge.lazyUpdate;
        silent = notMerge.silent;
        replaceMerge = notMerge.replaceMerge;
        transitionOpt = notMerge.transition;
        notMerge = notMerge.notMerge;
      }
      this[IN_MAIN_PROCESS_KEY] = true;
      if (!this._model || notMerge) {
        var optionManager = new OptionManager_default(this._api);
        var theme2 = this._theme;
        var ecModel = this._model = new Global_default();
        ecModel.scheduler = this._scheduler;
        ecModel.ssr = this._ssr;
        ecModel.init(null, null, null, theme2, this._locale, optionManager);
      }
      this._model.setOption(option, {
        replaceMerge
      }, optionPreprocessorFuncs);
      var updateParams = {
        seriesTransition: transitionOpt,
        optionChanged: true
      };
      if (lazyUpdate) {
        this[PENDING_UPDATE] = {
          silent,
          updateParams
        };
        this[IN_MAIN_PROCESS_KEY] = false;
        this.getZr().wakeUp();
      } else {
        try {
          prepare(this);
          updateMethods.update.call(this, null, updateParams);
        } catch (e2) {
          this[PENDING_UPDATE] = null;
          this[IN_MAIN_PROCESS_KEY] = false;
          throw e2;
        }
        if (!this._ssr) {
          this._zr.flush();
        }
        this[PENDING_UPDATE] = null;
        this[IN_MAIN_PROCESS_KEY] = false;
        flushPendingActions.call(this, silent);
        triggerUpdatedEvent.call(this, silent);
      }
    };
    ECharts2.prototype.setTheme = function() {
      deprecateLog("ECharts#setTheme() is DEPRECATED in ECharts 3.0");
    };
    ECharts2.prototype.getModel = function() {
      return this._model;
    };
    ECharts2.prototype.getOption = function() {
      return this._model && this._model.getOption();
    };
    ECharts2.prototype.getWidth = function() {
      return this._zr.getWidth();
    };
    ECharts2.prototype.getHeight = function() {
      return this._zr.getHeight();
    };
    ECharts2.prototype.getDevicePixelRatio = function() {
      return this._zr.painter.dpr || env_default.hasGlobalWindow && window.devicePixelRatio || 1;
    };
    ECharts2.prototype.getRenderedCanvas = function(opts) {
      if (true) {
        deprecateReplaceLog("getRenderedCanvas", "renderToCanvas");
      }
      return this.renderToCanvas(opts);
    };
    ECharts2.prototype.renderToCanvas = function(opts) {
      opts = opts || {};
      var painter = this._zr.painter;
      if (true) {
        if (painter.type !== "canvas") {
          throw new Error("renderToCanvas can only be used in the canvas renderer.");
        }
      }
      return painter.getRenderedCanvas({
        backgroundColor: opts.backgroundColor || this._model.get("backgroundColor"),
        pixelRatio: opts.pixelRatio || this.getDevicePixelRatio()
      });
    };
    ECharts2.prototype.renderToSVGString = function(opts) {
      opts = opts || {};
      var painter = this._zr.painter;
      if (true) {
        if (painter.type !== "svg") {
          throw new Error("renderToSVGString can only be used in the svg renderer.");
        }
      }
      return painter.renderToString({
        useViewBox: opts.useViewBox
      });
    };
    ECharts2.prototype.getSvgDataURL = function() {
      if (!env_default.svgSupported) {
        return;
      }
      var zr = this._zr;
      var list = zr.storage.getDisplayList();
      each(list, function(el) {
        el.stopAnimation(null, true);
      });
      return zr.painter.toDataURL();
    };
    ECharts2.prototype.getDataURL = function(opts) {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      opts = opts || {};
      var excludeComponents = opts.excludeComponents;
      var ecModel = this._model;
      var excludesComponentViews = [];
      var self = this;
      each(excludeComponents, function(componentType) {
        ecModel.eachComponent({
          mainType: componentType
        }, function(component) {
          var view = self._componentsMap[component.__viewId];
          if (!view.group.ignore) {
            excludesComponentViews.push(view);
            view.group.ignore = true;
          }
        });
      });
      var url = this._zr.painter.getType() === "svg" ? this.getSvgDataURL() : this.renderToCanvas(opts).toDataURL("image/" + (opts && opts.type || "png"));
      each(excludesComponentViews, function(view) {
        view.group.ignore = false;
      });
      return url;
    };
    ECharts2.prototype.getConnectedDataURL = function(opts) {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      var isSvg = opts.type === "svg";
      var groupId = this.group;
      var mathMin5 = Math.min;
      var mathMax5 = Math.max;
      var MAX_NUMBER = Infinity;
      if (connectedGroups[groupId]) {
        var left_1 = MAX_NUMBER;
        var top_1 = MAX_NUMBER;
        var right_1 = -MAX_NUMBER;
        var bottom_1 = -MAX_NUMBER;
        var canvasList_1 = [];
        var dpr_1 = opts && opts.pixelRatio || this.getDevicePixelRatio();
        each(instances2, function(chart, id) {
          if (chart.group === groupId) {
            var canvas = isSvg ? chart.getZr().painter.getSvgDom().innerHTML : chart.renderToCanvas(clone(opts));
            var boundingRect = chart.getDom().getBoundingClientRect();
            left_1 = mathMin5(boundingRect.left, left_1);
            top_1 = mathMin5(boundingRect.top, top_1);
            right_1 = mathMax5(boundingRect.right, right_1);
            bottom_1 = mathMax5(boundingRect.bottom, bottom_1);
            canvasList_1.push({
              dom: canvas,
              left: boundingRect.left,
              top: boundingRect.top
            });
          }
        });
        left_1 *= dpr_1;
        top_1 *= dpr_1;
        right_1 *= dpr_1;
        bottom_1 *= dpr_1;
        var width = right_1 - left_1;
        var height = bottom_1 - top_1;
        var targetCanvas = platformApi.createCanvas();
        var zr_1 = init(targetCanvas, {
          renderer: isSvg ? "svg" : "canvas"
        });
        zr_1.resize({
          width,
          height
        });
        if (isSvg) {
          var content_1 = "";
          each(canvasList_1, function(item) {
            var x = item.left - left_1;
            var y = item.top - top_1;
            content_1 += '<g transform="translate(' + x + "," + y + ')">' + item.dom + "</g>";
          });
          zr_1.painter.getSvgRoot().innerHTML = content_1;
          if (opts.connectedBackgroundColor) {
            zr_1.painter.setBackgroundColor(opts.connectedBackgroundColor);
          }
          zr_1.refreshImmediately();
          return zr_1.painter.toDataURL();
        } else {
          if (opts.connectedBackgroundColor) {
            zr_1.add(new Rect_default({
              shape: {
                x: 0,
                y: 0,
                width,
                height
              },
              style: {
                fill: opts.connectedBackgroundColor
              }
            }));
          }
          each(canvasList_1, function(item) {
            var img = new Image_default({
              style: {
                x: item.left * dpr_1 - left_1,
                y: item.top * dpr_1 - top_1,
                image: item.dom
              }
            });
            zr_1.add(img);
          });
          zr_1.refreshImmediately();
          return targetCanvas.toDataURL("image/" + (opts && opts.type || "png"));
        }
      } else {
        return this.getDataURL(opts);
      }
    };
    ECharts2.prototype.convertToPixel = function(finder, value) {
      return doConvertPixel(this, "convertToPixel", finder, value);
    };
    ECharts2.prototype.convertFromPixel = function(finder, value) {
      return doConvertPixel(this, "convertFromPixel", finder, value);
    };
    ECharts2.prototype.containPixel = function(finder, value) {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      var ecModel = this._model;
      var result;
      var findResult = parseFinder(ecModel, finder);
      each(findResult, function(models, key) {
        key.indexOf("Models") >= 0 && each(models, function(model) {
          var coordSys = model.coordinateSystem;
          if (coordSys && coordSys.containPoint) {
            result = result || !!coordSys.containPoint(value);
          } else if (key === "seriesModels") {
            var view = this._chartsMap[model.__viewId];
            if (view && view.containPoint) {
              result = result || view.containPoint(value, model);
            } else {
              if (true) {
                warn(key + ": " + (view ? "The found component do not support containPoint." : "No view mapping to the found component."));
              }
            }
          } else {
            if (true) {
              warn(key + ": containPoint is not supported");
            }
          }
        }, this);
      }, this);
      return !!result;
    };
    ECharts2.prototype.getVisual = function(finder, visualType) {
      var ecModel = this._model;
      var parsedFinder = parseFinder(ecModel, finder, {
        defaultMainType: "series"
      });
      var seriesModel = parsedFinder.seriesModel;
      if (true) {
        if (!seriesModel) {
          warn("There is no specified series model");
        }
      }
      var data = seriesModel.getData();
      var dataIndexInside = parsedFinder.hasOwnProperty("dataIndexInside") ? parsedFinder.dataIndexInside : parsedFinder.hasOwnProperty("dataIndex") ? data.indexOfRawIndex(parsedFinder.dataIndex) : null;
      return dataIndexInside != null ? getItemVisualFromData(data, dataIndexInside, visualType) : getVisualFromData(data, visualType);
    };
    ECharts2.prototype.getViewOfComponentModel = function(componentModel) {
      return this._componentsMap[componentModel.__viewId];
    };
    ECharts2.prototype.getViewOfSeriesModel = function(seriesModel) {
      return this._chartsMap[seriesModel.__viewId];
    };
    ECharts2.prototype._initEvents = function() {
      var _this = this;
      each(MOUSE_EVENT_NAMES, function(eveName) {
        var handler = function(e2) {
          var ecModel = _this.getModel();
          var el = e2.target;
          var params;
          var isGlobalOut = eveName === "globalout";
          if (isGlobalOut) {
            params = {};
          } else {
            el && findEventDispatcher(el, function(parent) {
              var ecData = getECData(parent);
              if (ecData && ecData.dataIndex != null) {
                var dataModel = ecData.dataModel || ecModel.getSeriesByIndex(ecData.seriesIndex);
                params = dataModel && dataModel.getDataParams(ecData.dataIndex, ecData.dataType) || {};
                return true;
              } else if (ecData.eventData) {
                params = extend({}, ecData.eventData);
                return true;
              }
            }, true);
          }
          if (params) {
            var componentType = params.componentType;
            var componentIndex = params.componentIndex;
            if (componentType === "markLine" || componentType === "markPoint" || componentType === "markArea") {
              componentType = "series";
              componentIndex = params.seriesIndex;
            }
            var model = componentType && componentIndex != null && ecModel.getComponent(componentType, componentIndex);
            var view = model && _this[model.mainType === "series" ? "_chartsMap" : "_componentsMap"][model.__viewId];
            if (true) {
              if (!isGlobalOut && !(model && view)) {
                warn("model or view can not be found by params");
              }
            }
            params.event = e2;
            params.type = eveName;
            _this._$eventProcessor.eventInfo = {
              targetEl: el,
              packedEvent: params,
              model,
              view
            };
            _this.trigger(eveName, params);
          }
        };
        handler.zrEventfulCallAtLast = true;
        _this._zr.on(eveName, handler, _this);
      });
      each(eventActionMap, function(actionType, eventType) {
        _this._messageCenter.on(eventType, function(event) {
          this.trigger(eventType, event);
        }, _this);
      });
      each(["selectchanged"], function(eventType) {
        _this._messageCenter.on(eventType, function(event) {
          this.trigger(eventType, event);
        }, _this);
      });
      handleLegacySelectEvents(this._messageCenter, this, this._api);
    };
    ECharts2.prototype.isDisposed = function() {
      return this._disposed;
    };
    ECharts2.prototype.clear = function() {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      this.setOption({
        series: []
      }, true);
    };
    ECharts2.prototype.dispose = function() {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      this._disposed = true;
      var dom = this.getDom();
      if (dom) {
        setAttribute(this.getDom(), DOM_ATTRIBUTE_KEY, "");
      }
      var chart = this;
      var api = chart._api;
      var ecModel = chart._model;
      each(chart._componentsViews, function(component) {
        component.dispose(ecModel, api);
      });
      each(chart._chartsViews, function(chart2) {
        chart2.dispose(ecModel, api);
      });
      chart._zr.dispose();
      chart._dom = chart._model = chart._chartsMap = chart._componentsMap = chart._chartsViews = chart._componentsViews = chart._scheduler = chart._api = chart._zr = chart._throttledZrFlush = chart._theme = chart._coordSysMgr = chart._messageCenter = null;
      delete instances2[chart.id];
    };
    ECharts2.prototype.resize = function(opts) {
      if (this[IN_MAIN_PROCESS_KEY]) {
        if (true) {
          error("`resize` should not be called during main process.");
        }
        return;
      }
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      this._zr.resize(opts);
      var ecModel = this._model;
      this._loadingFX && this._loadingFX.resize();
      if (!ecModel) {
        return;
      }
      var needPrepare = ecModel.resetOption("media");
      var silent = opts && opts.silent;
      if (this[PENDING_UPDATE]) {
        if (silent == null) {
          silent = this[PENDING_UPDATE].silent;
        }
        needPrepare = true;
        this[PENDING_UPDATE] = null;
      }
      this[IN_MAIN_PROCESS_KEY] = true;
      try {
        needPrepare && prepare(this);
        updateMethods.update.call(this, {
          type: "resize",
          animation: extend({
            // Disable animation
            duration: 0
          }, opts && opts.animation)
        });
      } catch (e2) {
        this[IN_MAIN_PROCESS_KEY] = false;
        throw e2;
      }
      this[IN_MAIN_PROCESS_KEY] = false;
      flushPendingActions.call(this, silent);
      triggerUpdatedEvent.call(this, silent);
    };
    ECharts2.prototype.showLoading = function(name, cfg) {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      if (isObject(name)) {
        cfg = name;
        name = "";
      }
      name = name || "default";
      this.hideLoading();
      if (!loadingEffects[name]) {
        if (true) {
          warn("Loading effects " + name + " not exists.");
        }
        return;
      }
      var el = loadingEffects[name](this._api, cfg);
      var zr = this._zr;
      this._loadingFX = el;
      zr.add(el);
    };
    ECharts2.prototype.hideLoading = function() {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      this._loadingFX && this._zr.remove(this._loadingFX);
      this._loadingFX = null;
    };
    ECharts2.prototype.makeActionFromEvent = function(eventObj) {
      var payload = extend({}, eventObj);
      payload.type = eventActionMap[eventObj.type];
      return payload;
    };
    ECharts2.prototype.dispatchAction = function(payload, opt) {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      if (!isObject(opt)) {
        opt = {
          silent: !!opt
        };
      }
      if (!actions[payload.type]) {
        return;
      }
      if (!this._model) {
        return;
      }
      if (this[IN_MAIN_PROCESS_KEY]) {
        this._pendingActions.push(payload);
        return;
      }
      var silent = opt.silent;
      doDispatchAction.call(this, payload, silent);
      var flush = opt.flush;
      if (flush) {
        this._zr.flush();
      } else if (flush !== false && env_default.browser.weChat) {
        this._throttledZrFlush();
      }
      flushPendingActions.call(this, silent);
      triggerUpdatedEvent.call(this, silent);
    };
    ECharts2.prototype.updateLabelLayout = function() {
      lifecycle_default.trigger("series:layoutlabels", this._model, this._api, {
        // Not adding series labels.
        // TODO
        updatedSeries: []
      });
    };
    ECharts2.prototype.appendData = function(params) {
      if (this._disposed) {
        disposedWarning(this.id);
        return;
      }
      var seriesIndex = params.seriesIndex;
      var ecModel = this.getModel();
      var seriesModel = ecModel.getSeriesByIndex(seriesIndex);
      if (true) {
        assert(params.data && seriesModel);
      }
      seriesModel.appendData(params);
      this._scheduler.unfinished = true;
      this.getZr().wakeUp();
    };
    ECharts2.internalField = function() {
      prepare = function(ecIns) {
        var scheduler = ecIns._scheduler;
        scheduler.restorePipelines(ecIns._model);
        scheduler.prepareStageTasks();
        prepareView(ecIns, true);
        prepareView(ecIns, false);
        scheduler.plan();
      };
      prepareView = function(ecIns, isComponent) {
        var ecModel = ecIns._model;
        var scheduler = ecIns._scheduler;
        var viewList = isComponent ? ecIns._componentsViews : ecIns._chartsViews;
        var viewMap = isComponent ? ecIns._componentsMap : ecIns._chartsMap;
        var zr = ecIns._zr;
        var api = ecIns._api;
        for (var i = 0; i < viewList.length; i++) {
          viewList[i].__alive = false;
        }
        isComponent ? ecModel.eachComponent(function(componentType, model) {
          componentType !== "series" && doPrepare(model);
        }) : ecModel.eachSeries(doPrepare);
        function doPrepare(model) {
          var requireNewView = model.__requireNewView;
          model.__requireNewView = false;
          var viewId = "_ec_" + model.id + "_" + model.type;
          var view2 = !requireNewView && viewMap[viewId];
          if (!view2) {
            var classType = parseClassType(model.type);
            var Clazz = isComponent ? Component_default2.getClass(classType.main, classType.sub) : (
              // FIXME:TS
              // (ChartView as ChartViewConstructor).getClass('series', classType.sub)
              // For backward compat, still support a chart type declared as only subType
              // like "liquidfill", but recommend "series.liquidfill"
              // But need a base class to make a type series.
              Chart_default.getClass(classType.sub)
            );
            if (true) {
              assert(Clazz, classType.sub + " does not exist.");
            }
            view2 = new Clazz();
            view2.init(ecModel, api);
            viewMap[viewId] = view2;
            viewList.push(view2);
            zr.add(view2.group);
          }
          model.__viewId = view2.__id = viewId;
          view2.__alive = true;
          view2.__model = model;
          view2.group.__ecComponentInfo = {
            mainType: model.mainType,
            index: model.componentIndex
          };
          !isComponent && scheduler.prepareView(view2, model, ecModel, api);
        }
        for (var i = 0; i < viewList.length; ) {
          var view = viewList[i];
          if (!view.__alive) {
            !isComponent && view.renderTask.dispose();
            zr.remove(view.group);
            view.dispose(ecModel, api);
            viewList.splice(i, 1);
            if (viewMap[view.__id] === view) {
              delete viewMap[view.__id];
            }
            view.__id = view.group.__ecComponentInfo = null;
          } else {
            i++;
          }
        }
      };
      updateDirectly = function(ecIns, method, payload, mainType, subType) {
        var ecModel = ecIns._model;
        ecModel.setUpdatePayload(payload);
        if (!mainType) {
          each([].concat(ecIns._componentsViews).concat(ecIns._chartsViews), callView);
          return;
        }
        var query = {};
        query[mainType + "Id"] = payload[mainType + "Id"];
        query[mainType + "Index"] = payload[mainType + "Index"];
        query[mainType + "Name"] = payload[mainType + "Name"];
        var condition = {
          mainType,
          query
        };
        subType && (condition.subType = subType);
        var excludeSeriesId = payload.excludeSeriesId;
        var excludeSeriesIdMap;
        if (excludeSeriesId != null) {
          excludeSeriesIdMap = createHashMap();
          each(normalizeToArray(excludeSeriesId), function(id) {
            var modelId = convertOptionIdName(id, null);
            if (modelId != null) {
              excludeSeriesIdMap.set(modelId, true);
            }
          });
        }
        ecModel && ecModel.eachComponent(condition, function(model) {
          var isExcluded = excludeSeriesIdMap && excludeSeriesIdMap.get(model.id) != null;
          if (isExcluded) {
            return;
          }
          ;
          if (isHighDownPayload(payload)) {
            if (model instanceof Series_default) {
              if (payload.type === HIGHLIGHT_ACTION_TYPE && !payload.notBlur && !model.get(["emphasis", "disabled"])) {
                blurSeriesFromHighlightPayload(model, payload, ecIns._api);
              }
            } else {
              var _a2 = findComponentHighDownDispatchers(model.mainType, model.componentIndex, payload.name, ecIns._api), focusSelf = _a2.focusSelf, dispatchers = _a2.dispatchers;
              if (payload.type === HIGHLIGHT_ACTION_TYPE && focusSelf && !payload.notBlur) {
                blurComponent(model.mainType, model.componentIndex, ecIns._api);
              }
              if (dispatchers) {
                each(dispatchers, function(dispatcher) {
                  payload.type === HIGHLIGHT_ACTION_TYPE ? enterEmphasis(dispatcher) : leaveEmphasis(dispatcher);
                });
              }
            }
          } else if (isSelectChangePayload(payload)) {
            if (model instanceof Series_default) {
              toggleSelectionFromPayload(model, payload, ecIns._api);
              updateSeriesElementSelection(model);
              markStatusToUpdate(ecIns);
            }
          }
        }, ecIns);
        ecModel && ecModel.eachComponent(condition, function(model) {
          var isExcluded = excludeSeriesIdMap && excludeSeriesIdMap.get(model.id) != null;
          if (isExcluded) {
            return;
          }
          ;
          callView(ecIns[mainType === "series" ? "_chartsMap" : "_componentsMap"][model.__viewId]);
        }, ecIns);
        function callView(view) {
          view && view.__alive && view[method] && view[method](view.__model, ecModel, ecIns._api, payload);
        }
      };
      updateMethods = {
        prepareAndUpdate: function(payload) {
          prepare(this);
          updateMethods.update.call(this, payload, {
            // Needs to mark option changed if newOption is given.
            // It's from MagicType.
            // TODO If use a separate flag optionChanged in payload?
            optionChanged: payload.newOption != null
          });
        },
        update: function(payload, updateParams) {
          var ecModel = this._model;
          var api = this._api;
          var zr = this._zr;
          var coordSysMgr = this._coordSysMgr;
          var scheduler = this._scheduler;
          if (!ecModel) {
            return;
          }
          ecModel.setUpdatePayload(payload);
          scheduler.restoreData(ecModel, payload);
          scheduler.performSeriesTasks(ecModel);
          coordSysMgr.create(ecModel, api);
          scheduler.performDataProcessorTasks(ecModel, payload);
          updateStreamModes(this, ecModel);
          coordSysMgr.update(ecModel, api);
          clearColorPalette(ecModel);
          scheduler.performVisualTasks(ecModel, payload);
          render(this, ecModel, api, payload, updateParams);
          var backgroundColor2 = ecModel.get("backgroundColor") || "transparent";
          var darkMode = ecModel.get("darkMode");
          zr.setBackgroundColor(backgroundColor2);
          if (darkMode != null && darkMode !== "auto") {
            zr.setDarkMode(darkMode);
          }
          lifecycle_default.trigger("afterupdate", ecModel, api);
        },
        updateTransform: function(payload) {
          var _this = this;
          var ecModel = this._model;
          var api = this._api;
          if (!ecModel) {
            return;
          }
          ecModel.setUpdatePayload(payload);
          var componentDirtyList = [];
          ecModel.eachComponent(function(componentType, componentModel) {
            if (componentType === "series") {
              return;
            }
            var componentView = _this.getViewOfComponentModel(componentModel);
            if (componentView && componentView.__alive) {
              if (componentView.updateTransform) {
                var result = componentView.updateTransform(componentModel, ecModel, api, payload);
                result && result.update && componentDirtyList.push(componentView);
              } else {
                componentDirtyList.push(componentView);
              }
            }
          });
          var seriesDirtyMap = createHashMap();
          ecModel.eachSeries(function(seriesModel) {
            var chartView = _this._chartsMap[seriesModel.__viewId];
            if (chartView.updateTransform) {
              var result = chartView.updateTransform(seriesModel, ecModel, api, payload);
              result && result.update && seriesDirtyMap.set(seriesModel.uid, 1);
            } else {
              seriesDirtyMap.set(seriesModel.uid, 1);
            }
          });
          clearColorPalette(ecModel);
          this._scheduler.performVisualTasks(ecModel, payload, {
            setDirty: true,
            dirtyMap: seriesDirtyMap
          });
          renderSeries(this, ecModel, api, payload, {}, seriesDirtyMap);
          lifecycle_default.trigger("afterupdate", ecModel, api);
        },
        updateView: function(payload) {
          var ecModel = this._model;
          if (!ecModel) {
            return;
          }
          ecModel.setUpdatePayload(payload);
          Chart_default.markUpdateMethod(payload, "updateView");
          clearColorPalette(ecModel);
          this._scheduler.performVisualTasks(ecModel, payload, {
            setDirty: true
          });
          render(this, ecModel, this._api, payload, {});
          lifecycle_default.trigger("afterupdate", ecModel, this._api);
        },
        updateVisual: function(payload) {
          var _this = this;
          var ecModel = this._model;
          if (!ecModel) {
            return;
          }
          ecModel.setUpdatePayload(payload);
          ecModel.eachSeries(function(seriesModel) {
            seriesModel.getData().clearAllVisual();
          });
          Chart_default.markUpdateMethod(payload, "updateVisual");
          clearColorPalette(ecModel);
          this._scheduler.performVisualTasks(ecModel, payload, {
            visualType: "visual",
            setDirty: true
          });
          ecModel.eachComponent(function(componentType, componentModel) {
            if (componentType !== "series") {
              var componentView = _this.getViewOfComponentModel(componentModel);
              componentView && componentView.__alive && componentView.updateVisual(componentModel, ecModel, _this._api, payload);
            }
          });
          ecModel.eachSeries(function(seriesModel) {
            var chartView = _this._chartsMap[seriesModel.__viewId];
            chartView.updateVisual(seriesModel, ecModel, _this._api, payload);
          });
          lifecycle_default.trigger("afterupdate", ecModel, this._api);
        },
        updateLayout: function(payload) {
          updateMethods.update.call(this, payload);
        }
      };
      doConvertPixel = function(ecIns, methodName, finder, value) {
        if (ecIns._disposed) {
          disposedWarning(ecIns.id);
          return;
        }
        var ecModel = ecIns._model;
        var coordSysList = ecIns._coordSysMgr.getCoordinateSystems();
        var result;
        var parsedFinder = parseFinder(ecModel, finder);
        for (var i = 0; i < coordSysList.length; i++) {
          var coordSys = coordSysList[i];
          if (coordSys[methodName] && (result = coordSys[methodName](ecModel, parsedFinder, value)) != null) {
            return result;
          }
        }
        if (true) {
          warn("No coordinate system that supports " + methodName + " found by the given finder.");
        }
      };
      updateStreamModes = function(ecIns, ecModel) {
        var chartsMap = ecIns._chartsMap;
        var scheduler = ecIns._scheduler;
        ecModel.eachSeries(function(seriesModel) {
          scheduler.updateStreamModes(seriesModel, chartsMap[seriesModel.__viewId]);
        });
      };
      doDispatchAction = function(payload, silent) {
        var _this = this;
        var ecModel = this.getModel();
        var payloadType = payload.type;
        var escapeConnect = payload.escapeConnect;
        var actionWrap = actions[payloadType];
        var actionInfo2 = actionWrap.actionInfo;
        var cptTypeTmp = (actionInfo2.update || "update").split(":");
        var updateMethod = cptTypeTmp.pop();
        var cptType = cptTypeTmp[0] != null && parseClassType(cptTypeTmp[0]);
        this[IN_MAIN_PROCESS_KEY] = true;
        var payloads = [payload];
        var batched = false;
        if (payload.batch) {
          batched = true;
          payloads = map(payload.batch, function(item) {
            item = defaults(extend({}, item), payload);
            item.batch = null;
            return item;
          });
        }
        var eventObjBatch = [];
        var eventObj;
        var isSelectChange = isSelectChangePayload(payload);
        var isHighDown = isHighDownPayload(payload);
        if (isHighDown) {
          allLeaveBlur(this._api);
        }
        each(payloads, function(batchItem) {
          eventObj = actionWrap.action(batchItem, _this._model, _this._api);
          eventObj = eventObj || extend({}, batchItem);
          eventObj.type = actionInfo2.event || eventObj.type;
          eventObjBatch.push(eventObj);
          if (isHighDown) {
            var _a2 = preParseFinder(payload), queryOptionMap = _a2.queryOptionMap, mainTypeSpecified = _a2.mainTypeSpecified;
            var componentMainType = mainTypeSpecified ? queryOptionMap.keys()[0] : "series";
            updateDirectly(_this, updateMethod, batchItem, componentMainType);
            markStatusToUpdate(_this);
          } else if (isSelectChange) {
            updateDirectly(_this, updateMethod, batchItem, "series");
            markStatusToUpdate(_this);
          } else if (cptType) {
            updateDirectly(_this, updateMethod, batchItem, cptType.main, cptType.sub);
          }
        });
        if (updateMethod !== "none" && !isHighDown && !isSelectChange && !cptType) {
          try {
            if (this[PENDING_UPDATE]) {
              prepare(this);
              updateMethods.update.call(this, payload);
              this[PENDING_UPDATE] = null;
            } else {
              updateMethods[updateMethod].call(this, payload);
            }
          } catch (e2) {
            this[IN_MAIN_PROCESS_KEY] = false;
            throw e2;
          }
        }
        if (batched) {
          eventObj = {
            type: actionInfo2.event || payloadType,
            escapeConnect,
            batch: eventObjBatch
          };
        } else {
          eventObj = eventObjBatch[0];
        }
        this[IN_MAIN_PROCESS_KEY] = false;
        if (!silent) {
          var messageCenter = this._messageCenter;
          messageCenter.trigger(eventObj.type, eventObj);
          if (isSelectChange) {
            var newObj = {
              type: "selectchanged",
              escapeConnect,
              selected: getAllSelectedIndices(ecModel),
              isFromClick: payload.isFromClick || false,
              fromAction: payload.type,
              fromActionPayload: payload
            };
            messageCenter.trigger(newObj.type, newObj);
          }
        }
      };
      flushPendingActions = function(silent) {
        var pendingActions = this._pendingActions;
        while (pendingActions.length) {
          var payload = pendingActions.shift();
          doDispatchAction.call(this, payload, silent);
        }
      };
      triggerUpdatedEvent = function(silent) {
        !silent && this.trigger("updated");
      };
      bindRenderedEvent = function(zr, ecIns) {
        zr.on("rendered", function(params) {
          ecIns.trigger("rendered", params);
          if (
            // Although zr is dirty if initial animation is not finished
            // and this checking is called on frame, we also check
            // animation finished for robustness.
            zr.animation.isFinished() && !ecIns[PENDING_UPDATE] && !ecIns._scheduler.unfinished && !ecIns._pendingActions.length
          ) {
            ecIns.trigger("finished");
          }
        });
      };
      bindMouseEvent = function(zr, ecIns) {
        zr.on("mouseover", function(e2) {
          var el = e2.target;
          var dispatcher = findEventDispatcher(el, isHighDownDispatcher);
          if (dispatcher) {
            handleGlobalMouseOverForHighDown(dispatcher, e2, ecIns._api);
            markStatusToUpdate(ecIns);
          }
        }).on("mouseout", function(e2) {
          var el = e2.target;
          var dispatcher = findEventDispatcher(el, isHighDownDispatcher);
          if (dispatcher) {
            handleGlobalMouseOutForHighDown(dispatcher, e2, ecIns._api);
            markStatusToUpdate(ecIns);
          }
        }).on("click", function(e2) {
          var el = e2.target;
          var dispatcher = findEventDispatcher(el, function(target) {
            return getECData(target).dataIndex != null;
          }, true);
          if (dispatcher) {
            var actionType = dispatcher.selected ? "unselect" : "select";
            var ecData = getECData(dispatcher);
            ecIns._api.dispatchAction({
              type: actionType,
              dataType: ecData.dataType,
              dataIndexInside: ecData.dataIndex,
              seriesIndex: ecData.seriesIndex,
              isFromClick: true
            });
          }
        });
      };
      function clearColorPalette(ecModel) {
        ecModel.clearColorPalette();
        ecModel.eachSeries(function(seriesModel) {
          seriesModel.clearColorPalette();
        });
      }
      ;
      function allocateZlevels(ecModel) {
        ;
        var componentZLevels = [];
        var seriesZLevels = [];
        var hasSeperateZLevel = false;
        ecModel.eachComponent(function(componentType, componentModel) {
          var zlevel = componentModel.get("zlevel") || 0;
          var z = componentModel.get("z") || 0;
          var zlevelKey = componentModel.getZLevelKey();
          hasSeperateZLevel = hasSeperateZLevel || !!zlevelKey;
          (componentType === "series" ? seriesZLevels : componentZLevels).push({
            zlevel,
            z,
            idx: componentModel.componentIndex,
            type: componentType,
            key: zlevelKey
          });
        });
        if (hasSeperateZLevel) {
          var zLevels = componentZLevels.concat(seriesZLevels);
          var lastSeriesZLevel_1;
          var lastSeriesKey_1;
          sort(zLevels, function(a, b) {
            if (a.zlevel === b.zlevel) {
              return a.z - b.z;
            }
            return a.zlevel - b.zlevel;
          });
          each(zLevels, function(item) {
            var componentModel = ecModel.getComponent(item.type, item.idx);
            var zlevel = item.zlevel;
            var key = item.key;
            if (lastSeriesZLevel_1 != null) {
              zlevel = Math.max(lastSeriesZLevel_1, zlevel);
            }
            if (key) {
              if (zlevel === lastSeriesZLevel_1 && key !== lastSeriesKey_1) {
                zlevel++;
              }
              lastSeriesKey_1 = key;
            } else if (lastSeriesKey_1) {
              if (zlevel === lastSeriesZLevel_1) {
                zlevel++;
              }
              lastSeriesKey_1 = "";
            }
            lastSeriesZLevel_1 = zlevel;
            componentModel.setZLevel(zlevel);
          });
        }
      }
      render = function(ecIns, ecModel, api, payload, updateParams) {
        allocateZlevels(ecModel);
        renderComponents(ecIns, ecModel, api, payload, updateParams);
        each(ecIns._chartsViews, function(chart) {
          chart.__alive = false;
        });
        renderSeries(ecIns, ecModel, api, payload, updateParams);
        each(ecIns._chartsViews, function(chart) {
          if (!chart.__alive) {
            chart.remove(ecModel, api);
          }
        });
      };
      renderComponents = function(ecIns, ecModel, api, payload, updateParams, dirtyList) {
        each(dirtyList || ecIns._componentsViews, function(componentView) {
          var componentModel = componentView.__model;
          clearStates(componentModel, componentView);
          componentView.render(componentModel, ecModel, api, payload);
          updateZ2(componentModel, componentView);
          updateStates(componentModel, componentView);
        });
      };
      renderSeries = function(ecIns, ecModel, api, payload, updateParams, dirtyMap) {
        var scheduler = ecIns._scheduler;
        updateParams = extend(updateParams || {}, {
          updatedSeries: ecModel.getSeries()
        });
        lifecycle_default.trigger("series:beforeupdate", ecModel, api, updateParams);
        var unfinished = false;
        ecModel.eachSeries(function(seriesModel) {
          var chartView = ecIns._chartsMap[seriesModel.__viewId];
          chartView.__alive = true;
          var renderTask = chartView.renderTask;
          scheduler.updatePayload(renderTask, payload);
          clearStates(seriesModel, chartView);
          if (dirtyMap && dirtyMap.get(seriesModel.uid)) {
            renderTask.dirty();
          }
          if (renderTask.perform(scheduler.getPerformArgs(renderTask))) {
            unfinished = true;
          }
          chartView.group.silent = !!seriesModel.get("silent");
          updateBlend(seriesModel, chartView);
          updateSeriesElementSelection(seriesModel);
        });
        scheduler.unfinished = unfinished || scheduler.unfinished;
        lifecycle_default.trigger("series:layoutlabels", ecModel, api, updateParams);
        lifecycle_default.trigger("series:transition", ecModel, api, updateParams);
        ecModel.eachSeries(function(seriesModel) {
          var chartView = ecIns._chartsMap[seriesModel.__viewId];
          updateZ2(seriesModel, chartView);
          updateStates(seriesModel, chartView);
        });
        updateHoverLayerStatus(ecIns, ecModel);
        lifecycle_default.trigger("series:afterupdate", ecModel, api, updateParams);
      };
      markStatusToUpdate = function(ecIns) {
        ecIns[STATUS_NEEDS_UPDATE_KEY] = true;
        ecIns.getZr().wakeUp();
      };
      applyChangedStates = function(ecIns) {
        if (!ecIns[STATUS_NEEDS_UPDATE_KEY]) {
          return;
        }
        ecIns.getZr().storage.traverse(function(el) {
          if (isElementRemoved(el)) {
            return;
          }
          applyElementStates(el);
        });
        ecIns[STATUS_NEEDS_UPDATE_KEY] = false;
      };
      function applyElementStates(el) {
        var newStates = [];
        var oldStates = el.currentStates;
        for (var i = 0; i < oldStates.length; i++) {
          var stateName = oldStates[i];
          if (!(stateName === "emphasis" || stateName === "blur" || stateName === "select")) {
            newStates.push(stateName);
          }
        }
        if (el.selected && el.states.select) {
          newStates.push("select");
        }
        if (el.hoverState === HOVER_STATE_EMPHASIS && el.states.emphasis) {
          newStates.push("emphasis");
        } else if (el.hoverState === HOVER_STATE_BLUR && el.states.blur) {
          newStates.push("blur");
        }
        el.useStates(newStates);
      }
      function updateHoverLayerStatus(ecIns, ecModel) {
        var zr = ecIns._zr;
        var storage2 = zr.storage;
        var elCount = 0;
        storage2.traverse(function(el) {
          if (!el.isGroup) {
            elCount++;
          }
        });
        if (elCount > ecModel.get("hoverLayerThreshold") && !env_default.node && !env_default.worker) {
          ecModel.eachSeries(function(seriesModel) {
            if (seriesModel.preventUsingHoverLayer) {
              return;
            }
            var chartView = ecIns._chartsMap[seriesModel.__viewId];
            if (chartView.__alive) {
              chartView.eachRendered(function(el) {
                if (el.states.emphasis) {
                  el.states.emphasis.hoverLayer = true;
                }
              });
            }
          });
        }
      }
      ;
      function updateBlend(seriesModel, chartView) {
        var blendMode = seriesModel.get("blendMode") || null;
        chartView.eachRendered(function(el) {
          if (!el.isGroup) {
            el.style.blend = blendMode;
          }
        });
      }
      ;
      function updateZ2(model, view) {
        if (model.preventAutoZ) {
          return;
        }
        var z = model.get("z") || 0;
        var zlevel = model.get("zlevel") || 0;
        view.eachRendered(function(el) {
          doUpdateZ(el, z, zlevel, -Infinity);
          return true;
        });
      }
      ;
      function doUpdateZ(el, z, zlevel, maxZ2) {
        var label = el.getTextContent();
        var labelLine = el.getTextGuideLine();
        var isGroup = el.isGroup;
        if (isGroup) {
          var children = el.childrenRef();
          for (var i = 0; i < children.length; i++) {
            maxZ2 = Math.max(doUpdateZ(children[i], z, zlevel, maxZ2), maxZ2);
          }
        } else {
          el.z = z;
          el.zlevel = zlevel;
          maxZ2 = Math.max(el.z2, maxZ2);
        }
        if (label) {
          label.z = z;
          label.zlevel = zlevel;
          isFinite(maxZ2) && (label.z2 = maxZ2 + 2);
        }
        if (labelLine) {
          var textGuideLineConfig = el.textGuideLineConfig;
          labelLine.z = z;
          labelLine.zlevel = zlevel;
          isFinite(maxZ2) && (labelLine.z2 = maxZ2 + (textGuideLineConfig && textGuideLineConfig.showAbove ? 1 : -1));
        }
        return maxZ2;
      }
      function clearStates(model, view) {
        view.eachRendered(function(el) {
          if (isElementRemoved(el)) {
            return;
          }
          var textContent = el.getTextContent();
          var textGuide = el.getTextGuideLine();
          if (el.stateTransition) {
            el.stateTransition = null;
          }
          if (textContent && textContent.stateTransition) {
            textContent.stateTransition = null;
          }
          if (textGuide && textGuide.stateTransition) {
            textGuide.stateTransition = null;
          }
          if (el.hasState()) {
            el.prevStates = el.currentStates;
            el.clearStates();
          } else if (el.prevStates) {
            el.prevStates = null;
          }
        });
      }
      function updateStates(model, view) {
        var stateAnimationModel = model.getModel("stateAnimation");
        var enableAnimation = model.isAnimationEnabled();
        var duration = stateAnimationModel.get("duration");
        var stateTransition = duration > 0 ? {
          duration,
          delay: stateAnimationModel.get("delay"),
          easing: stateAnimationModel.get("easing")
          // additive: stateAnimationModel.get('additive')
        } : null;
        view.eachRendered(function(el) {
          if (el.states && el.states.emphasis) {
            if (isElementRemoved(el)) {
              return;
            }
            if (el instanceof Path_default) {
              savePathStates(el);
            }
            if (el.__dirty) {
              var prevStates = el.prevStates;
              if (prevStates) {
                el.useStates(prevStates);
              }
            }
            if (enableAnimation) {
              el.stateTransition = stateTransition;
              var textContent = el.getTextContent();
              var textGuide = el.getTextGuideLine();
              if (textContent) {
                textContent.stateTransition = stateTransition;
              }
              if (textGuide) {
                textGuide.stateTransition = stateTransition;
              }
            }
            if (el.__dirty) {
              applyElementStates(el);
            }
          }
        });
      }
      ;
      createExtensionAPI = function(ecIns) {
        return new /** @class */
        (function(_super2) {
          __extends(class_1, _super2);
          function class_1() {
            return _super2 !== null && _super2.apply(this, arguments) || this;
          }
          class_1.prototype.getCoordinateSystems = function() {
            return ecIns._coordSysMgr.getCoordinateSystems();
          };
          class_1.prototype.getComponentByElement = function(el) {
            while (el) {
              var modelInfo = el.__ecComponentInfo;
              if (modelInfo != null) {
                return ecIns._model.getComponent(modelInfo.mainType, modelInfo.index);
              }
              el = el.parent;
            }
          };
          class_1.prototype.enterEmphasis = function(el, highlightDigit) {
            enterEmphasis(el, highlightDigit);
            markStatusToUpdate(ecIns);
          };
          class_1.prototype.leaveEmphasis = function(el, highlightDigit) {
            leaveEmphasis(el, highlightDigit);
            markStatusToUpdate(ecIns);
          };
          class_1.prototype.enterBlur = function(el) {
            enterBlur(el);
            markStatusToUpdate(ecIns);
          };
          class_1.prototype.leaveBlur = function(el) {
            leaveBlur(el);
            markStatusToUpdate(ecIns);
          };
          class_1.prototype.enterSelect = function(el) {
            enterSelect(el);
            markStatusToUpdate(ecIns);
          };
          class_1.prototype.leaveSelect = function(el) {
            leaveSelect(el);
            markStatusToUpdate(ecIns);
          };
          class_1.prototype.getModel = function() {
            return ecIns.getModel();
          };
          class_1.prototype.getViewOfComponentModel = function(componentModel) {
            return ecIns.getViewOfComponentModel(componentModel);
          };
          class_1.prototype.getViewOfSeriesModel = function(seriesModel) {
            return ecIns.getViewOfSeriesModel(seriesModel);
          };
          return class_1;
        }(ExtensionAPI_default))(ecIns);
      };
      enableConnect = function(chart) {
        function updateConnectedChartsStatus(charts, status) {
          for (var i = 0; i < charts.length; i++) {
            var otherChart = charts[i];
            otherChart[CONNECT_STATUS_KEY] = status;
          }
        }
        each(eventActionMap, function(actionType, eventType) {
          chart._messageCenter.on(eventType, function(event) {
            if (connectedGroups[chart.group] && chart[CONNECT_STATUS_KEY] !== CONNECT_STATUS_PENDING) {
              if (event && event.escapeConnect) {
                return;
              }
              var action_1 = chart.makeActionFromEvent(event);
              var otherCharts_1 = [];
              each(instances2, function(otherChart) {
                if (otherChart !== chart && otherChart.group === chart.group) {
                  otherCharts_1.push(otherChart);
                }
              });
              updateConnectedChartsStatus(otherCharts_1, CONNECT_STATUS_PENDING);
              each(otherCharts_1, function(otherChart) {
                if (otherChart[CONNECT_STATUS_KEY] !== CONNECT_STATUS_UPDATING) {
                  otherChart.dispatchAction(action_1);
                }
              });
              updateConnectedChartsStatus(otherCharts_1, CONNECT_STATUS_UPDATED);
            }
          });
        });
      };
    }();
    return ECharts2;
  }(Eventful_default)
);
var echartsProto = ECharts.prototype;
echartsProto.on = createRegisterEventWithLowercaseECharts("on");
echartsProto.off = createRegisterEventWithLowercaseECharts("off");
echartsProto.one = function(eventName, cb, ctx) {
  var self = this;
  deprecateLog("ECharts#one is deprecated.");
  function wrapped() {
    var args2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args2[_i] = arguments[_i];
    }
    cb && cb.apply && cb.apply(this, args2);
    self.off(eventName, wrapped);
  }
  ;
  this.on.call(this, eventName, wrapped, ctx);
};
var MOUSE_EVENT_NAMES = ["click", "dblclick", "mouseover", "mouseout", "mousemove", "mousedown", "mouseup", "globalout", "contextmenu"];
function disposedWarning(id) {
  if (true) {
    warn("Instance " + id + " has been disposed");
  }
}
var actions = {};
var eventActionMap = {};
var dataProcessorFuncs = [];
var optionPreprocessorFuncs = [];
var visualFuncs = [];
var themeStorage = {};
var loadingEffects = {};
var instances2 = {};
var connectedGroups = {};
var idBase = +/* @__PURE__ */ new Date() - 0;
var groupIdBase = +/* @__PURE__ */ new Date() - 0;
var DOM_ATTRIBUTE_KEY = "_echarts_instance_";
function init2(dom, theme2, opts) {
  var isClient = !(opts && opts.ssr);
  if (isClient) {
    if (true) {
      if (!dom) {
        throw new Error("Initialize failed: invalid dom.");
      }
    }
    var existInstance = getInstanceByDom(dom);
    if (existInstance) {
      if (true) {
        warn("There is a chart instance already initialized on the dom.");
      }
      return existInstance;
    }
    if (true) {
      if (isDom(dom) && dom.nodeName.toUpperCase() !== "CANVAS" && (!dom.clientWidth && (!opts || opts.width == null) || !dom.clientHeight && (!opts || opts.height == null))) {
        warn("Can't get DOM width or height. Please check dom.clientWidth and dom.clientHeight. They should not be 0.For example, you may need to call this in the callback of window.onload.");
      }
    }
  }
  var chart = new ECharts(dom, theme2, opts);
  chart.id = "ec_" + idBase++;
  instances2[chart.id] = chart;
  isClient && setAttribute(dom, DOM_ATTRIBUTE_KEY, chart.id);
  enableConnect(chart);
  lifecycle_default.trigger("afterinit", chart);
  return chart;
}
function connect(groupId) {
  if (isArray(groupId)) {
    var charts = groupId;
    groupId = null;
    each(charts, function(chart) {
      if (chart.group != null) {
        groupId = chart.group;
      }
    });
    groupId = groupId || "g_" + groupIdBase++;
    each(charts, function(chart) {
      chart.group = groupId;
    });
  }
  connectedGroups[groupId] = true;
  return groupId;
}
function disConnect(groupId) {
  connectedGroups[groupId] = false;
}
var disconnect = disConnect;
function dispose2(chart) {
  if (isString(chart)) {
    chart = instances2[chart];
  } else if (!(chart instanceof ECharts)) {
    chart = getInstanceByDom(chart);
  }
  if (chart instanceof ECharts && !chart.isDisposed()) {
    chart.dispose();
  }
}
function getInstanceByDom(dom) {
  return instances2[getAttribute(dom, DOM_ATTRIBUTE_KEY)];
}
function getInstanceById(key) {
  return instances2[key];
}
function registerTheme(name, theme2) {
  themeStorage[name] = theme2;
}
function registerPreprocessor(preprocessorFunc) {
  if (indexOf(optionPreprocessorFuncs, preprocessorFunc) < 0) {
    optionPreprocessorFuncs.push(preprocessorFunc);
  }
}
function registerProcessor(priority, processor) {
  normalizeRegister(dataProcessorFuncs, priority, processor, PRIORITY_PROCESSOR_DEFAULT);
}
function registerPostInit(postInitFunc) {
  registerUpdateLifecycle("afterinit", postInitFunc);
}
function registerPostUpdate(postUpdateFunc) {
  registerUpdateLifecycle("afterupdate", postUpdateFunc);
}
function registerUpdateLifecycle(name, cb) {
  lifecycle_default.on(name, cb);
}
function registerAction(actionInfo2, eventName, action) {
  if (isFunction(eventName)) {
    action = eventName;
    eventName = "";
  }
  var actionType = isObject(actionInfo2) ? actionInfo2.type : [actionInfo2, actionInfo2 = {
    event: eventName
  }][0];
  actionInfo2.event = (actionInfo2.event || actionType).toLowerCase();
  eventName = actionInfo2.event;
  if (eventActionMap[eventName]) {
    return;
  }
  assert(ACTION_REG.test(actionType) && ACTION_REG.test(eventName));
  if (!actions[actionType]) {
    actions[actionType] = {
      action,
      actionInfo: actionInfo2
    };
  }
  eventActionMap[eventName] = actionType;
}
function registerCoordinateSystem(type, coordSysCreator) {
  CoordinateSystem_default.register(type, coordSysCreator);
}
function getCoordinateSystemDimensions(type) {
  var coordSysCreator = CoordinateSystem_default.get(type);
  if (coordSysCreator) {
    return coordSysCreator.getDimensionsInfo ? coordSysCreator.getDimensionsInfo() : coordSysCreator.dimensions.slice();
  }
}
function registerLayout(priority, layoutTask) {
  normalizeRegister(visualFuncs, priority, layoutTask, PRIORITY_VISUAL_LAYOUT, "layout");
}
function registerVisual(priority, visualTask) {
  normalizeRegister(visualFuncs, priority, visualTask, PRIORITY_VISUAL_CHART, "visual");
}
var registeredTasks = [];
function normalizeRegister(targetList, priority, fn, defaultPriority, visualType) {
  if (isFunction(priority) || isObject(priority)) {
    fn = priority;
    priority = defaultPriority;
  }
  if (true) {
    if (isNaN(priority) || priority == null) {
      throw new Error("Illegal priority");
    }
    each(targetList, function(wrap) {
      assert(wrap.__raw !== fn);
    });
  }
  if (indexOf(registeredTasks, fn) >= 0) {
    return;
  }
  registeredTasks.push(fn);
  var stageHandler = Scheduler_default.wrapStageHandler(fn, visualType);
  stageHandler.__prio = priority;
  stageHandler.__raw = fn;
  targetList.push(stageHandler);
}
function registerLoading(name, loadingFx) {
  loadingEffects[name] = loadingFx;
}
function setCanvasCreator(creator) {
  if (true) {
    deprecateLog("setCanvasCreator is deprecated. Use setPlatformAPI({ createCanvas }) instead.");
  }
  setPlatformAPI({
    createCanvas: creator
  });
}
function registerMap(mapName, geoJson, specialAreas) {
  var registerMap3 = getImpl("registerMap");
  registerMap3 && registerMap3(mapName, geoJson, specialAreas);
}
function getMap(mapName) {
  var getMap2 = getImpl("getMap");
  return getMap2 && getMap2(mapName);
}
var registerTransform = registerExternalTransform;
registerVisual(PRIORITY_VISUAL_GLOBAL, seriesStyleTask);
registerVisual(PRIORITY_VISUAL_CHART_DATA_CUSTOM, dataStyleTask);
registerVisual(PRIORITY_VISUAL_CHART_DATA_CUSTOM, dataColorPaletteTask);
registerVisual(PRIORITY_VISUAL_GLOBAL, seriesSymbolTask);
registerVisual(PRIORITY_VISUAL_CHART_DATA_CUSTOM, dataSymbolTask);
registerVisual(PRIORITY_VISUAL_DECAL, decalVisual);
registerPreprocessor(globalBackwardCompat);
registerProcessor(PRIORITY_PROCESSOR_DATASTACK, dataStack);
registerLoading("default", defaultLoading);
registerAction({
  type: HIGHLIGHT_ACTION_TYPE,
  event: HIGHLIGHT_ACTION_TYPE,
  update: HIGHLIGHT_ACTION_TYPE
}, noop);
registerAction({
  type: DOWNPLAY_ACTION_TYPE,
  event: DOWNPLAY_ACTION_TYPE,
  update: DOWNPLAY_ACTION_TYPE
}, noop);
registerAction({
  type: SELECT_ACTION_TYPE,
  event: SELECT_ACTION_TYPE,
  update: SELECT_ACTION_TYPE
}, noop);
registerAction({
  type: UNSELECT_ACTION_TYPE,
  event: UNSELECT_ACTION_TYPE,
  update: UNSELECT_ACTION_TYPE
}, noop);
registerAction({
  type: TOGGLE_SELECT_ACTION_TYPE,
  event: TOGGLE_SELECT_ACTION_TYPE,
  update: TOGGLE_SELECT_ACTION_TYPE
}, noop);
registerTheme("light", light_default);
registerTheme("dark", dark_default);
var dataTool = {};

// node_modules/echarts/lib/extension.js
var extensions = [];
var extensionRegisters = {
  registerPreprocessor,
  registerProcessor,
  registerPostInit,
  registerPostUpdate,
  registerUpdateLifecycle,
  registerAction,
  registerCoordinateSystem,
  registerLayout,
  registerVisual,
  registerTransform,
  registerLoading,
  registerMap,
  registerImpl,
  PRIORITY,
  ComponentModel: Component_default,
  ComponentView: Component_default2,
  SeriesModel: Series_default,
  ChartView: Chart_default,
  // TODO Use ComponentModel and SeriesModel instead of Constructor
  registerComponentModel: function(ComponentModelClass) {
    Component_default.registerClass(ComponentModelClass);
  },
  registerComponentView: function(ComponentViewClass) {
    Component_default2.registerClass(ComponentViewClass);
  },
  registerSeriesModel: function(SeriesModelClass) {
    Series_default.registerClass(SeriesModelClass);
  },
  registerChartView: function(ChartViewClass) {
    Chart_default.registerClass(ChartViewClass);
  },
  registerSubTypeDefaulter: function(componentType, defaulter) {
    Component_default.registerSubTypeDefaulter(componentType, defaulter);
  },
  registerPainter: function(painterType, PainterCtor) {
    registerPainter(painterType, PainterCtor);
  }
};
function use(ext) {
  if (isArray(ext)) {
    each(ext, function(singleExt) {
      use(singleExt);
    });
    return;
  }
  if (indexOf(extensions, ext) >= 0) {
    return;
  }
  extensions.push(ext);
  if (isFunction(ext)) {
    ext = {
      install: ext
    };
  }
  ext.install(extensionRegisters);
}

// node_modules/echarts/lib/data/DataDiffer.js
function dataIndexMapValueLength(valNumOrArrLengthMoreThan2) {
  return valNumOrArrLengthMoreThan2 == null ? 0 : valNumOrArrLengthMoreThan2.length || 1;
}
function defaultKeyGetter(item) {
  return item;
}
var DataDiffer = (
  /** @class */
  function() {
    function DataDiffer2(oldArr, newArr, oldKeyGetter, newKeyGetter, context, diffMode) {
      this._old = oldArr;
      this._new = newArr;
      this._oldKeyGetter = oldKeyGetter || defaultKeyGetter;
      this._newKeyGetter = newKeyGetter || defaultKeyGetter;
      this.context = context;
      this._diffModeMultiple = diffMode === "multiple";
    }
    DataDiffer2.prototype.add = function(func) {
      this._add = func;
      return this;
    };
    DataDiffer2.prototype.update = function(func) {
      this._update = func;
      return this;
    };
    DataDiffer2.prototype.updateManyToOne = function(func) {
      this._updateManyToOne = func;
      return this;
    };
    DataDiffer2.prototype.updateOneToMany = function(func) {
      this._updateOneToMany = func;
      return this;
    };
    DataDiffer2.prototype.updateManyToMany = function(func) {
      this._updateManyToMany = func;
      return this;
    };
    DataDiffer2.prototype.remove = function(func) {
      this._remove = func;
      return this;
    };
    DataDiffer2.prototype.execute = function() {
      this[this._diffModeMultiple ? "_executeMultiple" : "_executeOneToOne"]();
    };
    DataDiffer2.prototype._executeOneToOne = function() {
      var oldArr = this._old;
      var newArr = this._new;
      var newDataIndexMap = {};
      var oldDataKeyArr = new Array(oldArr.length);
      var newDataKeyArr = new Array(newArr.length);
      this._initIndexMap(oldArr, null, oldDataKeyArr, "_oldKeyGetter");
      this._initIndexMap(newArr, newDataIndexMap, newDataKeyArr, "_newKeyGetter");
      for (var i = 0; i < oldArr.length; i++) {
        var oldKey = oldDataKeyArr[i];
        var newIdxMapVal = newDataIndexMap[oldKey];
        var newIdxMapValLen = dataIndexMapValueLength(newIdxMapVal);
        if (newIdxMapValLen > 1) {
          var newIdx = newIdxMapVal.shift();
          if (newIdxMapVal.length === 1) {
            newDataIndexMap[oldKey] = newIdxMapVal[0];
          }
          this._update && this._update(newIdx, i);
        } else if (newIdxMapValLen === 1) {
          newDataIndexMap[oldKey] = null;
          this._update && this._update(newIdxMapVal, i);
        } else {
          this._remove && this._remove(i);
        }
      }
      this._performRestAdd(newDataKeyArr, newDataIndexMap);
    };
    DataDiffer2.prototype._executeMultiple = function() {
      var oldArr = this._old;
      var newArr = this._new;
      var oldDataIndexMap = {};
      var newDataIndexMap = {};
      var oldDataKeyArr = [];
      var newDataKeyArr = [];
      this._initIndexMap(oldArr, oldDataIndexMap, oldDataKeyArr, "_oldKeyGetter");
      this._initIndexMap(newArr, newDataIndexMap, newDataKeyArr, "_newKeyGetter");
      for (var i = 0; i < oldDataKeyArr.length; i++) {
        var oldKey = oldDataKeyArr[i];
        var oldIdxMapVal = oldDataIndexMap[oldKey];
        var newIdxMapVal = newDataIndexMap[oldKey];
        var oldIdxMapValLen = dataIndexMapValueLength(oldIdxMapVal);
        var newIdxMapValLen = dataIndexMapValueLength(newIdxMapVal);
        if (oldIdxMapValLen > 1 && newIdxMapValLen === 1) {
          this._updateManyToOne && this._updateManyToOne(newIdxMapVal, oldIdxMapVal);
          newDataIndexMap[oldKey] = null;
        } else if (oldIdxMapValLen === 1 && newIdxMapValLen > 1) {
          this._updateOneToMany && this._updateOneToMany(newIdxMapVal, oldIdxMapVal);
          newDataIndexMap[oldKey] = null;
        } else if (oldIdxMapValLen === 1 && newIdxMapValLen === 1) {
          this._update && this._update(newIdxMapVal, oldIdxMapVal);
          newDataIndexMap[oldKey] = null;
        } else if (oldIdxMapValLen > 1 && newIdxMapValLen > 1) {
          this._updateManyToMany && this._updateManyToMany(newIdxMapVal, oldIdxMapVal);
          newDataIndexMap[oldKey] = null;
        } else if (oldIdxMapValLen > 1) {
          for (var i_1 = 0; i_1 < oldIdxMapValLen; i_1++) {
            this._remove && this._remove(oldIdxMapVal[i_1]);
          }
        } else {
          this._remove && this._remove(oldIdxMapVal);
        }
      }
      this._performRestAdd(newDataKeyArr, newDataIndexMap);
    };
    DataDiffer2.prototype._performRestAdd = function(newDataKeyArr, newDataIndexMap) {
      for (var i = 0; i < newDataKeyArr.length; i++) {
        var newKey = newDataKeyArr[i];
        var newIdxMapVal = newDataIndexMap[newKey];
        var idxMapValLen = dataIndexMapValueLength(newIdxMapVal);
        if (idxMapValLen > 1) {
          for (var j = 0; j < idxMapValLen; j++) {
            this._add && this._add(newIdxMapVal[j]);
          }
        } else if (idxMapValLen === 1) {
          this._add && this._add(newIdxMapVal);
        }
        newDataIndexMap[newKey] = null;
      }
    };
    DataDiffer2.prototype._initIndexMap = function(arr, map3, keyArr, keyGetterName) {
      var cbModeMultiple = this._diffModeMultiple;
      for (var i = 0; i < arr.length; i++) {
        var key = "_ec_" + this[keyGetterName](arr[i], i);
        if (!cbModeMultiple) {
          keyArr[i] = key;
        }
        if (!map3) {
          continue;
        }
        var idxMapVal = map3[key];
        var idxMapValLen = dataIndexMapValueLength(idxMapVal);
        if (idxMapValLen === 0) {
          map3[key] = i;
          if (cbModeMultiple) {
            keyArr.push(key);
          }
        } else if (idxMapValLen === 1) {
          map3[key] = [idxMapVal, i];
        } else {
          idxMapVal.push(i);
        }
      }
    };
    return DataDiffer2;
  }()
);
var DataDiffer_default = DataDiffer;

// node_modules/echarts/lib/data/helper/dimensionHelper.js
var DimensionUserOuput = (
  /** @class */
  function() {
    function DimensionUserOuput2(encode, dimRequest) {
      this._encode = encode;
      this._schema = dimRequest;
    }
    DimensionUserOuput2.prototype.get = function() {
      return {
        // Do not generate full dimension name until fist used.
        fullDimensions: this._getFullDimensionNames(),
        encode: this._encode
      };
    };
    DimensionUserOuput2.prototype._getFullDimensionNames = function() {
      if (!this._cachedDimNames) {
        this._cachedDimNames = this._schema ? this._schema.makeOutputDimensionNames() : [];
      }
      return this._cachedDimNames;
    };
    return DimensionUserOuput2;
  }()
);
function summarizeDimensions(data, schema) {
  var summary = {};
  var encode = summary.encode = {};
  var notExtraCoordDimMap = createHashMap();
  var defaultedLabel = [];
  var defaultedTooltip = [];
  var userOutputEncode = {};
  each(data.dimensions, function(dimName) {
    var dimItem = data.getDimensionInfo(dimName);
    var coordDim = dimItem.coordDim;
    if (coordDim) {
      if (true) {
        assert(VISUAL_DIMENSIONS.get(coordDim) == null);
      }
      var coordDimIndex = dimItem.coordDimIndex;
      getOrCreateEncodeArr(encode, coordDim)[coordDimIndex] = dimName;
      if (!dimItem.isExtraCoord) {
        notExtraCoordDimMap.set(coordDim, 1);
        if (mayLabelDimType(dimItem.type)) {
          defaultedLabel[0] = dimName;
        }
        getOrCreateEncodeArr(userOutputEncode, coordDim)[coordDimIndex] = data.getDimensionIndex(dimItem.name);
      }
      if (dimItem.defaultTooltip) {
        defaultedTooltip.push(dimName);
      }
    }
    VISUAL_DIMENSIONS.each(function(v, otherDim) {
      var encodeArr = getOrCreateEncodeArr(encode, otherDim);
      var dimIndex = dimItem.otherDims[otherDim];
      if (dimIndex != null && dimIndex !== false) {
        encodeArr[dimIndex] = dimItem.name;
      }
    });
  });
  var dataDimsOnCoord = [];
  var encodeFirstDimNotExtra = {};
  notExtraCoordDimMap.each(function(v, coordDim) {
    var dimArr = encode[coordDim];
    encodeFirstDimNotExtra[coordDim] = dimArr[0];
    dataDimsOnCoord = dataDimsOnCoord.concat(dimArr);
  });
  summary.dataDimsOnCoord = dataDimsOnCoord;
  summary.dataDimIndicesOnCoord = map(dataDimsOnCoord, function(dimName) {
    return data.getDimensionInfo(dimName).storeDimIndex;
  });
  summary.encodeFirstDimNotExtra = encodeFirstDimNotExtra;
  var encodeLabel = encode.label;
  if (encodeLabel && encodeLabel.length) {
    defaultedLabel = encodeLabel.slice();
  }
  var encodeTooltip = encode.tooltip;
  if (encodeTooltip && encodeTooltip.length) {
    defaultedTooltip = encodeTooltip.slice();
  } else if (!defaultedTooltip.length) {
    defaultedTooltip = defaultedLabel.slice();
  }
  encode.defaultedLabel = defaultedLabel;
  encode.defaultedTooltip = defaultedTooltip;
  summary.userOutput = new DimensionUserOuput(userOutputEncode, schema);
  return summary;
}
function getOrCreateEncodeArr(encode, dim) {
  if (!encode.hasOwnProperty(dim)) {
    encode[dim] = [];
  }
  return encode[dim];
}
function getDimensionTypeByAxis(axisType) {
  return axisType === "category" ? "ordinal" : axisType === "time" ? "time" : "float";
}
function mayLabelDimType(dimType) {
  return !(dimType === "ordinal" || dimType === "time");
}

// node_modules/echarts/lib/data/SeriesDimensionDefine.js
var SeriesDimensionDefine = (
  /** @class */
  function() {
    function SeriesDimensionDefine2(opt) {
      this.otherDims = {};
      if (opt != null) {
        extend(this, opt);
      }
    }
    return SeriesDimensionDefine2;
  }()
);
var SeriesDimensionDefine_default = SeriesDimensionDefine;

// node_modules/echarts/lib/data/helper/SeriesDataSchema.js
var inner5 = makeInner();
var dimTypeShort = {
  float: "f",
  int: "i",
  ordinal: "o",
  number: "n",
  time: "t"
};
var SeriesDataSchema = (
  /** @class */
  function() {
    function SeriesDataSchema2(opt) {
      this.dimensions = opt.dimensions;
      this._dimOmitted = opt.dimensionOmitted;
      this.source = opt.source;
      this._fullDimCount = opt.fullDimensionCount;
      this._updateDimOmitted(opt.dimensionOmitted);
    }
    SeriesDataSchema2.prototype.isDimensionOmitted = function() {
      return this._dimOmitted;
    };
    SeriesDataSchema2.prototype._updateDimOmitted = function(dimensionOmitted) {
      this._dimOmitted = dimensionOmitted;
      if (!dimensionOmitted) {
        return;
      }
      if (!this._dimNameMap) {
        this._dimNameMap = ensureSourceDimNameMap(this.source);
      }
    };
    SeriesDataSchema2.prototype.getSourceDimensionIndex = function(dimName) {
      return retrieve2(this._dimNameMap.get(dimName), -1);
    };
    SeriesDataSchema2.prototype.getSourceDimension = function(dimIndex) {
      var dimensionsDefine = this.source.dimensionsDefine;
      if (dimensionsDefine) {
        return dimensionsDefine[dimIndex];
      }
    };
    SeriesDataSchema2.prototype.makeStoreSchema = function() {
      var dimCount = this._fullDimCount;
      var willRetrieveDataByName = shouldRetrieveDataByName(this.source);
      var makeHashStrict = !shouldOmitUnusedDimensions(dimCount);
      var dimHash = "";
      var dims = [];
      for (var fullDimIdx = 0, seriesDimIdx = 0; fullDimIdx < dimCount; fullDimIdx++) {
        var property = void 0;
        var type = void 0;
        var ordinalMeta = void 0;
        var seriesDimDef = this.dimensions[seriesDimIdx];
        if (seriesDimDef && seriesDimDef.storeDimIndex === fullDimIdx) {
          property = willRetrieveDataByName ? seriesDimDef.name : null;
          type = seriesDimDef.type;
          ordinalMeta = seriesDimDef.ordinalMeta;
          seriesDimIdx++;
        } else {
          var sourceDimDef = this.getSourceDimension(fullDimIdx);
          if (sourceDimDef) {
            property = willRetrieveDataByName ? sourceDimDef.name : null;
            type = sourceDimDef.type;
          }
        }
        dims.push({
          property,
          type,
          ordinalMeta
        });
        if (willRetrieveDataByName && property != null && (!seriesDimDef || !seriesDimDef.isCalculationCoord)) {
          dimHash += makeHashStrict ? property.replace(/\`/g, "`1").replace(/\$/g, "`2") : property;
        }
        dimHash += "$";
        dimHash += dimTypeShort[type] || "f";
        if (ordinalMeta) {
          dimHash += ordinalMeta.uid;
        }
        dimHash += "$";
      }
      var source = this.source;
      var hash = [source.seriesLayoutBy, source.startIndex, dimHash].join("$$");
      return {
        dimensions: dims,
        hash
      };
    };
    SeriesDataSchema2.prototype.makeOutputDimensionNames = function() {
      var result = [];
      for (var fullDimIdx = 0, seriesDimIdx = 0; fullDimIdx < this._fullDimCount; fullDimIdx++) {
        var name_1 = void 0;
        var seriesDimDef = this.dimensions[seriesDimIdx];
        if (seriesDimDef && seriesDimDef.storeDimIndex === fullDimIdx) {
          if (!seriesDimDef.isCalculationCoord) {
            name_1 = seriesDimDef.name;
          }
          seriesDimIdx++;
        } else {
          var sourceDimDef = this.getSourceDimension(fullDimIdx);
          if (sourceDimDef) {
            name_1 = sourceDimDef.name;
          }
        }
        result.push(name_1);
      }
      return result;
    };
    SeriesDataSchema2.prototype.appendCalculationDimension = function(dimDef) {
      this.dimensions.push(dimDef);
      dimDef.isCalculationCoord = true;
      this._fullDimCount++;
      this._updateDimOmitted(true);
    };
    return SeriesDataSchema2;
  }()
);
function isSeriesDataSchema(schema) {
  return schema instanceof SeriesDataSchema;
}
function createDimNameMap(dimsDef) {
  var dataDimNameMap = createHashMap();
  for (var i = 0; i < (dimsDef || []).length; i++) {
    var dimDefItemRaw = dimsDef[i];
    var userDimName = isObject(dimDefItemRaw) ? dimDefItemRaw.name : dimDefItemRaw;
    if (userDimName != null && dataDimNameMap.get(userDimName) == null) {
      dataDimNameMap.set(userDimName, i);
    }
  }
  return dataDimNameMap;
}
function ensureSourceDimNameMap(source) {
  var innerSource = inner5(source);
  return innerSource.dimNameMap || (innerSource.dimNameMap = createDimNameMap(source.dimensionsDefine));
}
function shouldOmitUnusedDimensions(dimCount) {
  return dimCount > 30;
}

// node_modules/echarts/lib/data/SeriesData.js
var isObject3 = isObject;
var map2 = map;
var CtorInt32Array2 = typeof Int32Array === "undefined" ? Array : Int32Array;
var ID_PREFIX = "e\0\0";
var INDEX_NOT_FOUND = -1;
var TRANSFERABLE_PROPERTIES = ["hasItemOption", "_nameList", "_idList", "_invertedIndicesMap", "_dimSummary", "userOutput", "_rawData", "_dimValueGetter", "_nameDimIdx", "_idDimIdx", "_nameRepeatCount"];
var CLONE_PROPERTIES = ["_approximateExtent"];
var prepareInvertedIndex;
var getId;
var getIdNameFromStore;
var normalizeDimensions;
var transferProperties;
var cloneListForMapAndSample;
var makeIdFromName;
var SeriesData = (
  /** @class */
  function() {
    function SeriesData2(dimensionsInput, hostModel) {
      this.type = "list";
      this._dimOmitted = false;
      this._nameList = [];
      this._idList = [];
      this._visual = {};
      this._layout = {};
      this._itemVisuals = [];
      this._itemLayouts = [];
      this._graphicEls = [];
      this._approximateExtent = {};
      this._calculationInfo = {};
      this.hasItemOption = false;
      this.TRANSFERABLE_METHODS = ["cloneShallow", "downSample", "lttbDownSample", "map"];
      this.CHANGABLE_METHODS = ["filterSelf", "selectRange"];
      this.DOWNSAMPLE_METHODS = ["downSample", "lttbDownSample"];
      var dimensions;
      var assignStoreDimIdx = false;
      if (isSeriesDataSchema(dimensionsInput)) {
        dimensions = dimensionsInput.dimensions;
        this._dimOmitted = dimensionsInput.isDimensionOmitted();
        this._schema = dimensionsInput;
      } else {
        assignStoreDimIdx = true;
        dimensions = dimensionsInput;
      }
      dimensions = dimensions || ["x", "y"];
      var dimensionInfos = {};
      var dimensionNames = [];
      var invertedIndicesMap = {};
      var needsHasOwn = false;
      var emptyObj = {};
      for (var i = 0; i < dimensions.length; i++) {
        var dimInfoInput = dimensions[i];
        var dimensionInfo = isString(dimInfoInput) ? new SeriesDimensionDefine_default({
          name: dimInfoInput
        }) : !(dimInfoInput instanceof SeriesDimensionDefine_default) ? new SeriesDimensionDefine_default(dimInfoInput) : dimInfoInput;
        var dimensionName = dimensionInfo.name;
        dimensionInfo.type = dimensionInfo.type || "float";
        if (!dimensionInfo.coordDim) {
          dimensionInfo.coordDim = dimensionName;
          dimensionInfo.coordDimIndex = 0;
        }
        var otherDims = dimensionInfo.otherDims = dimensionInfo.otherDims || {};
        dimensionNames.push(dimensionName);
        dimensionInfos[dimensionName] = dimensionInfo;
        if (emptyObj[dimensionName] != null) {
          needsHasOwn = true;
        }
        if (dimensionInfo.createInvertedIndices) {
          invertedIndicesMap[dimensionName] = [];
        }
        if (otherDims.itemName === 0) {
          this._nameDimIdx = i;
        }
        if (otherDims.itemId === 0) {
          this._idDimIdx = i;
        }
        if (true) {
          assert(assignStoreDimIdx || dimensionInfo.storeDimIndex >= 0);
        }
        if (assignStoreDimIdx) {
          dimensionInfo.storeDimIndex = i;
        }
      }
      this.dimensions = dimensionNames;
      this._dimInfos = dimensionInfos;
      this._initGetDimensionInfo(needsHasOwn);
      this.hostModel = hostModel;
      this._invertedIndicesMap = invertedIndicesMap;
      if (this._dimOmitted) {
        var dimIdxToName_1 = this._dimIdxToName = createHashMap();
        each(dimensionNames, function(dimName) {
          dimIdxToName_1.set(dimensionInfos[dimName].storeDimIndex, dimName);
        });
      }
    }
    SeriesData2.prototype.getDimension = function(dim) {
      var dimIdx = this._recognizeDimIndex(dim);
      if (dimIdx == null) {
        return dim;
      }
      dimIdx = dim;
      if (!this._dimOmitted) {
        return this.dimensions[dimIdx];
      }
      var dimName = this._dimIdxToName.get(dimIdx);
      if (dimName != null) {
        return dimName;
      }
      var sourceDimDef = this._schema.getSourceDimension(dimIdx);
      if (sourceDimDef) {
        return sourceDimDef.name;
      }
    };
    SeriesData2.prototype.getDimensionIndex = function(dim) {
      var dimIdx = this._recognizeDimIndex(dim);
      if (dimIdx != null) {
        return dimIdx;
      }
      if (dim == null) {
        return -1;
      }
      var dimInfo = this._getDimInfo(dim);
      return dimInfo ? dimInfo.storeDimIndex : this._dimOmitted ? this._schema.getSourceDimensionIndex(dim) : -1;
    };
    SeriesData2.prototype._recognizeDimIndex = function(dim) {
      if (isNumber(dim) || dim != null && !isNaN(dim) && !this._getDimInfo(dim) && (!this._dimOmitted || this._schema.getSourceDimensionIndex(dim) < 0)) {
        return +dim;
      }
    };
    SeriesData2.prototype._getStoreDimIndex = function(dim) {
      var dimIdx = this.getDimensionIndex(dim);
      if (true) {
        if (dimIdx == null) {
          throw new Error("Unknown dimension " + dim);
        }
      }
      return dimIdx;
    };
    SeriesData2.prototype.getDimensionInfo = function(dim) {
      return this._getDimInfo(this.getDimension(dim));
    };
    SeriesData2.prototype._initGetDimensionInfo = function(needsHasOwn) {
      var dimensionInfos = this._dimInfos;
      this._getDimInfo = needsHasOwn ? function(dimName) {
        return dimensionInfos.hasOwnProperty(dimName) ? dimensionInfos[dimName] : void 0;
      } : function(dimName) {
        return dimensionInfos[dimName];
      };
    };
    SeriesData2.prototype.getDimensionsOnCoord = function() {
      return this._dimSummary.dataDimsOnCoord.slice();
    };
    SeriesData2.prototype.mapDimension = function(coordDim, idx) {
      var dimensionsSummary = this._dimSummary;
      if (idx == null) {
        return dimensionsSummary.encodeFirstDimNotExtra[coordDim];
      }
      var dims = dimensionsSummary.encode[coordDim];
      return dims ? dims[idx] : null;
    };
    SeriesData2.prototype.mapDimensionsAll = function(coordDim) {
      var dimensionsSummary = this._dimSummary;
      var dims = dimensionsSummary.encode[coordDim];
      return (dims || []).slice();
    };
    SeriesData2.prototype.getStore = function() {
      return this._store;
    };
    SeriesData2.prototype.initData = function(data, nameList, dimValueGetter) {
      var _this = this;
      var store;
      if (data instanceof DataStore_default) {
        store = data;
      }
      if (!store) {
        var dimensions = this.dimensions;
        var provider = isSourceInstance(data) || isArrayLike(data) ? new DefaultDataProvider(data, dimensions.length) : data;
        store = new DataStore_default();
        var dimensionInfos = map2(dimensions, function(dimName) {
          return {
            type: _this._dimInfos[dimName].type,
            property: dimName
          };
        });
        store.initData(provider, dimensionInfos, dimValueGetter);
      }
      this._store = store;
      this._nameList = (nameList || []).slice();
      this._idList = [];
      this._nameRepeatCount = {};
      this._doInit(0, store.count());
      this._dimSummary = summarizeDimensions(this, this._schema);
      this.userOutput = this._dimSummary.userOutput;
    };
    SeriesData2.prototype.appendData = function(data) {
      var range = this._store.appendData(data);
      this._doInit(range[0], range[1]);
    };
    SeriesData2.prototype.appendValues = function(values, names) {
      var _a2 = this._store.appendValues(values, names.length), start = _a2.start, end = _a2.end;
      var shouldMakeIdFromName = this._shouldMakeIdFromName();
      this._updateOrdinalMeta();
      if (names) {
        for (var idx = start; idx < end; idx++) {
          var sourceIdx = idx - start;
          this._nameList[idx] = names[sourceIdx];
          if (shouldMakeIdFromName) {
            makeIdFromName(this, idx);
          }
        }
      }
    };
    SeriesData2.prototype._updateOrdinalMeta = function() {
      var store = this._store;
      var dimensions = this.dimensions;
      for (var i = 0; i < dimensions.length; i++) {
        var dimInfo = this._dimInfos[dimensions[i]];
        if (dimInfo.ordinalMeta) {
          store.collectOrdinalMeta(dimInfo.storeDimIndex, dimInfo.ordinalMeta);
        }
      }
    };
    SeriesData2.prototype._shouldMakeIdFromName = function() {
      var provider = this._store.getProvider();
      return this._idDimIdx == null && provider.getSource().sourceFormat !== SOURCE_FORMAT_TYPED_ARRAY && !provider.fillStorage;
    };
    SeriesData2.prototype._doInit = function(start, end) {
      if (start >= end) {
        return;
      }
      var store = this._store;
      var provider = store.getProvider();
      this._updateOrdinalMeta();
      var nameList = this._nameList;
      var idList = this._idList;
      var sourceFormat = provider.getSource().sourceFormat;
      var isFormatOriginal = sourceFormat === SOURCE_FORMAT_ORIGINAL;
      if (isFormatOriginal && !provider.pure) {
        var sharedDataItem = [];
        for (var idx = start; idx < end; idx++) {
          var dataItem = provider.getItem(idx, sharedDataItem);
          if (!this.hasItemOption && isDataItemOption(dataItem)) {
            this.hasItemOption = true;
          }
          if (dataItem) {
            var itemName = dataItem.name;
            if (nameList[idx] == null && itemName != null) {
              nameList[idx] = convertOptionIdName(itemName, null);
            }
            var itemId = dataItem.id;
            if (idList[idx] == null && itemId != null) {
              idList[idx] = convertOptionIdName(itemId, null);
            }
          }
        }
      }
      if (this._shouldMakeIdFromName()) {
        for (var idx = start; idx < end; idx++) {
          makeIdFromName(this, idx);
        }
      }
      prepareInvertedIndex(this);
    };
    SeriesData2.prototype.getApproximateExtent = function(dim) {
      return this._approximateExtent[dim] || this._store.getDataExtent(this._getStoreDimIndex(dim));
    };
    SeriesData2.prototype.setApproximateExtent = function(extent3, dim) {
      dim = this.getDimension(dim);
      this._approximateExtent[dim] = extent3.slice();
    };
    SeriesData2.prototype.getCalculationInfo = function(key) {
      return this._calculationInfo[key];
    };
    SeriesData2.prototype.setCalculationInfo = function(key, value) {
      isObject3(key) ? extend(this._calculationInfo, key) : this._calculationInfo[key] = value;
    };
    SeriesData2.prototype.getName = function(idx) {
      var rawIndex = this.getRawIndex(idx);
      var name = this._nameList[rawIndex];
      if (name == null && this._nameDimIdx != null) {
        name = getIdNameFromStore(this, this._nameDimIdx, rawIndex);
      }
      if (name == null) {
        name = "";
      }
      return name;
    };
    SeriesData2.prototype._getCategory = function(dimIdx, idx) {
      var ordinal = this._store.get(dimIdx, idx);
      var ordinalMeta = this._store.getOrdinalMeta(dimIdx);
      if (ordinalMeta) {
        return ordinalMeta.categories[ordinal];
      }
      return ordinal;
    };
    SeriesData2.prototype.getId = function(idx) {
      return getId(this, this.getRawIndex(idx));
    };
    SeriesData2.prototype.count = function() {
      return this._store.count();
    };
    SeriesData2.prototype.get = function(dim, idx) {
      var store = this._store;
      var dimInfo = this._dimInfos[dim];
      if (dimInfo) {
        return store.get(dimInfo.storeDimIndex, idx);
      }
    };
    SeriesData2.prototype.getByRawIndex = function(dim, rawIdx) {
      var store = this._store;
      var dimInfo = this._dimInfos[dim];
      if (dimInfo) {
        return store.getByRawIndex(dimInfo.storeDimIndex, rawIdx);
      }
    };
    SeriesData2.prototype.getIndices = function() {
      return this._store.getIndices();
    };
    SeriesData2.prototype.getDataExtent = function(dim) {
      return this._store.getDataExtent(this._getStoreDimIndex(dim));
    };
    SeriesData2.prototype.getSum = function(dim) {
      return this._store.getSum(this._getStoreDimIndex(dim));
    };
    SeriesData2.prototype.getMedian = function(dim) {
      return this._store.getMedian(this._getStoreDimIndex(dim));
    };
    SeriesData2.prototype.getValues = function(dimensions, idx) {
      var _this = this;
      var store = this._store;
      return isArray(dimensions) ? store.getValues(map2(dimensions, function(dim) {
        return _this._getStoreDimIndex(dim);
      }), idx) : store.getValues(dimensions);
    };
    SeriesData2.prototype.hasValue = function(idx) {
      var dataDimIndicesOnCoord = this._dimSummary.dataDimIndicesOnCoord;
      for (var i = 0, len = dataDimIndicesOnCoord.length; i < len; i++) {
        if (isNaN(this._store.get(dataDimIndicesOnCoord[i], idx))) {
          return false;
        }
      }
      return true;
    };
    SeriesData2.prototype.indexOfName = function(name) {
      for (var i = 0, len = this._store.count(); i < len; i++) {
        if (this.getName(i) === name) {
          return i;
        }
      }
      return -1;
    };
    SeriesData2.prototype.getRawIndex = function(idx) {
      return this._store.getRawIndex(idx);
    };
    SeriesData2.prototype.indexOfRawIndex = function(rawIndex) {
      return this._store.indexOfRawIndex(rawIndex);
    };
    SeriesData2.prototype.rawIndexOf = function(dim, value) {
      var invertedIndices = dim && this._invertedIndicesMap[dim];
      if (true) {
        if (!invertedIndices) {
          throw new Error("Do not supported yet");
        }
      }
      var rawIndex = invertedIndices[value];
      if (rawIndex == null || isNaN(rawIndex)) {
        return INDEX_NOT_FOUND;
      }
      return rawIndex;
    };
    SeriesData2.prototype.indicesOfNearest = function(dim, value, maxDistance) {
      return this._store.indicesOfNearest(this._getStoreDimIndex(dim), value, maxDistance);
    };
    SeriesData2.prototype.each = function(dims, cb, ctx) {
      "use strict";
      if (isFunction(dims)) {
        ctx = cb;
        cb = dims;
        dims = [];
      }
      var fCtx = ctx || this;
      var dimIndices = map2(normalizeDimensions(dims), this._getStoreDimIndex, this);
      this._store.each(dimIndices, fCtx ? bind(cb, fCtx) : cb);
    };
    SeriesData2.prototype.filterSelf = function(dims, cb, ctx) {
      "use strict";
      if (isFunction(dims)) {
        ctx = cb;
        cb = dims;
        dims = [];
      }
      var fCtx = ctx || this;
      var dimIndices = map2(normalizeDimensions(dims), this._getStoreDimIndex, this);
      this._store = this._store.filter(dimIndices, fCtx ? bind(cb, fCtx) : cb);
      return this;
    };
    SeriesData2.prototype.selectRange = function(range) {
      "use strict";
      var _this = this;
      var innerRange = {};
      var dims = keys(range);
      var dimIndices = [];
      each(dims, function(dim) {
        var dimIdx = _this._getStoreDimIndex(dim);
        innerRange[dimIdx] = range[dim];
        dimIndices.push(dimIdx);
      });
      this._store = this._store.selectRange(innerRange);
      return this;
    };
    SeriesData2.prototype.mapArray = function(dims, cb, ctx) {
      "use strict";
      if (isFunction(dims)) {
        ctx = cb;
        cb = dims;
        dims = [];
      }
      ctx = ctx || this;
      var result = [];
      this.each(dims, function() {
        result.push(cb && cb.apply(this, arguments));
      }, ctx);
      return result;
    };
    SeriesData2.prototype.map = function(dims, cb, ctx, ctxCompat) {
      "use strict";
      var fCtx = ctx || ctxCompat || this;
      var dimIndices = map2(normalizeDimensions(dims), this._getStoreDimIndex, this);
      var list = cloneListForMapAndSample(this);
      list._store = this._store.map(dimIndices, fCtx ? bind(cb, fCtx) : cb);
      return list;
    };
    SeriesData2.prototype.modify = function(dims, cb, ctx, ctxCompat) {
      var _this = this;
      var fCtx = ctx || ctxCompat || this;
      if (true) {
        each(normalizeDimensions(dims), function(dim) {
          var dimInfo = _this.getDimensionInfo(dim);
          if (!dimInfo.isCalculationCoord) {
            console.error("Danger: only stack dimension can be modified");
          }
        });
      }
      var dimIndices = map2(normalizeDimensions(dims), this._getStoreDimIndex, this);
      this._store.modify(dimIndices, fCtx ? bind(cb, fCtx) : cb);
    };
    SeriesData2.prototype.downSample = function(dimension, rate, sampleValue, sampleIndex) {
      var list = cloneListForMapAndSample(this);
      list._store = this._store.downSample(this._getStoreDimIndex(dimension), rate, sampleValue, sampleIndex);
      return list;
    };
    SeriesData2.prototype.lttbDownSample = function(valueDimension, rate) {
      var list = cloneListForMapAndSample(this);
      list._store = this._store.lttbDownSample(this._getStoreDimIndex(valueDimension), rate);
      return list;
    };
    SeriesData2.prototype.getRawDataItem = function(idx) {
      return this._store.getRawDataItem(idx);
    };
    SeriesData2.prototype.getItemModel = function(idx) {
      var hostModel = this.hostModel;
      var dataItem = this.getRawDataItem(idx);
      return new Model_default(dataItem, hostModel, hostModel && hostModel.ecModel);
    };
    SeriesData2.prototype.diff = function(otherList) {
      var thisList = this;
      return new DataDiffer_default(otherList ? otherList.getStore().getIndices() : [], this.getStore().getIndices(), function(idx) {
        return getId(otherList, idx);
      }, function(idx) {
        return getId(thisList, idx);
      });
    };
    SeriesData2.prototype.getVisual = function(key) {
      var visual = this._visual;
      return visual && visual[key];
    };
    SeriesData2.prototype.setVisual = function(kvObj, val) {
      this._visual = this._visual || {};
      if (isObject3(kvObj)) {
        extend(this._visual, kvObj);
      } else {
        this._visual[kvObj] = val;
      }
    };
    SeriesData2.prototype.getItemVisual = function(idx, key) {
      var itemVisual = this._itemVisuals[idx];
      var val = itemVisual && itemVisual[key];
      if (val == null) {
        return this.getVisual(key);
      }
      return val;
    };
    SeriesData2.prototype.hasItemVisual = function() {
      return this._itemVisuals.length > 0;
    };
    SeriesData2.prototype.ensureUniqueItemVisual = function(idx, key) {
      var itemVisuals = this._itemVisuals;
      var itemVisual = itemVisuals[idx];
      if (!itemVisual) {
        itemVisual = itemVisuals[idx] = {};
      }
      var val = itemVisual[key];
      if (val == null) {
        val = this.getVisual(key);
        if (isArray(val)) {
          val = val.slice();
        } else if (isObject3(val)) {
          val = extend({}, val);
        }
        itemVisual[key] = val;
      }
      return val;
    };
    SeriesData2.prototype.setItemVisual = function(idx, key, value) {
      var itemVisual = this._itemVisuals[idx] || {};
      this._itemVisuals[idx] = itemVisual;
      if (isObject3(key)) {
        extend(itemVisual, key);
      } else {
        itemVisual[key] = value;
      }
    };
    SeriesData2.prototype.clearAllVisual = function() {
      this._visual = {};
      this._itemVisuals = [];
    };
    SeriesData2.prototype.setLayout = function(key, val) {
      isObject3(key) ? extend(this._layout, key) : this._layout[key] = val;
    };
    SeriesData2.prototype.getLayout = function(key) {
      return this._layout[key];
    };
    SeriesData2.prototype.getItemLayout = function(idx) {
      return this._itemLayouts[idx];
    };
    SeriesData2.prototype.setItemLayout = function(idx, layout3, merge2) {
      this._itemLayouts[idx] = merge2 ? extend(this._itemLayouts[idx] || {}, layout3) : layout3;
    };
    SeriesData2.prototype.clearItemLayouts = function() {
      this._itemLayouts.length = 0;
    };
    SeriesData2.prototype.setItemGraphicEl = function(idx, el) {
      var seriesIndex = this.hostModel && this.hostModel.seriesIndex;
      setCommonECData(seriesIndex, this.dataType, idx, el);
      this._graphicEls[idx] = el;
    };
    SeriesData2.prototype.getItemGraphicEl = function(idx) {
      return this._graphicEls[idx];
    };
    SeriesData2.prototype.eachItemGraphicEl = function(cb, context) {
      each(this._graphicEls, function(el, idx) {
        if (el) {
          cb && cb.call(context, el, idx);
        }
      });
    };
    SeriesData2.prototype.cloneShallow = function(list) {
      if (!list) {
        list = new SeriesData2(this._schema ? this._schema : map2(this.dimensions, this._getDimInfo, this), this.hostModel);
      }
      transferProperties(list, this);
      list._store = this._store;
      return list;
    };
    SeriesData2.prototype.wrapMethod = function(methodName, injectFunction) {
      var originalMethod = this[methodName];
      if (!isFunction(originalMethod)) {
        return;
      }
      this.__wrappedMethods = this.__wrappedMethods || [];
      this.__wrappedMethods.push(methodName);
      this[methodName] = function() {
        var res = originalMethod.apply(this, arguments);
        return injectFunction.apply(this, [res].concat(slice(arguments)));
      };
    };
    SeriesData2.internalField = function() {
      prepareInvertedIndex = function(data) {
        var invertedIndicesMap = data._invertedIndicesMap;
        each(invertedIndicesMap, function(invertedIndices, dim) {
          var dimInfo = data._dimInfos[dim];
          var ordinalMeta = dimInfo.ordinalMeta;
          var store = data._store;
          if (ordinalMeta) {
            invertedIndices = invertedIndicesMap[dim] = new CtorInt32Array2(ordinalMeta.categories.length);
            for (var i = 0; i < invertedIndices.length; i++) {
              invertedIndices[i] = INDEX_NOT_FOUND;
            }
            for (var i = 0; i < store.count(); i++) {
              invertedIndices[store.get(dimInfo.storeDimIndex, i)] = i;
            }
          }
        });
      };
      getIdNameFromStore = function(data, dimIdx, idx) {
        return convertOptionIdName(data._getCategory(dimIdx, idx), null);
      };
      getId = function(data, rawIndex) {
        var id = data._idList[rawIndex];
        if (id == null && data._idDimIdx != null) {
          id = getIdNameFromStore(data, data._idDimIdx, rawIndex);
        }
        if (id == null) {
          id = ID_PREFIX + rawIndex;
        }
        return id;
      };
      normalizeDimensions = function(dimensions) {
        if (!isArray(dimensions)) {
          dimensions = dimensions != null ? [dimensions] : [];
        }
        return dimensions;
      };
      cloneListForMapAndSample = function(original) {
        var list = new SeriesData2(original._schema ? original._schema : map2(original.dimensions, original._getDimInfo, original), original.hostModel);
        transferProperties(list, original);
        return list;
      };
      transferProperties = function(target, source) {
        each(TRANSFERABLE_PROPERTIES.concat(source.__wrappedMethods || []), function(propName) {
          if (source.hasOwnProperty(propName)) {
            target[propName] = source[propName];
          }
        });
        target.__wrappedMethods = source.__wrappedMethods;
        each(CLONE_PROPERTIES, function(propName) {
          target[propName] = clone(source[propName]);
        });
        target._calculationInfo = extend({}, source._calculationInfo);
      };
      makeIdFromName = function(data, idx) {
        var nameList = data._nameList;
        var idList = data._idList;
        var nameDimIdx = data._nameDimIdx;
        var idDimIdx = data._idDimIdx;
        var name = nameList[idx];
        var id = idList[idx];
        if (name == null && nameDimIdx != null) {
          nameList[idx] = name = getIdNameFromStore(data, nameDimIdx, idx);
        }
        if (id == null && idDimIdx != null) {
          idList[idx] = id = getIdNameFromStore(data, idDimIdx, idx);
        }
        if (id == null && name != null) {
          var nameRepeatCount = data._nameRepeatCount;
          var nmCnt = nameRepeatCount[name] = (nameRepeatCount[name] || 0) + 1;
          id = name;
          if (nmCnt > 1) {
            id += "__ec__" + nmCnt;
          }
          idList[idx] = id;
        }
      };
    }();
    return SeriesData2;
  }()
);
var SeriesData_default = SeriesData;

// node_modules/zrender/lib/contain/polygon.js
var EPSILON = 1e-8;
function isAroundEqual(a, b) {
  return Math.abs(a - b) < EPSILON;
}
function contain(points4, x, y) {
  var w = 0;
  var p = points4[0];
  if (!p) {
    return false;
  }
  for (var i = 1; i < points4.length; i++) {
    var p2 = points4[i];
    w += windingLine(p[0], p[1], p2[0], p2[1], x, y);
    p = p2;
  }
  var p0 = points4[0];
  if (!isAroundEqual(p[0], p0[0]) || !isAroundEqual(p[1], p0[1])) {
    w += windingLine(p[0], p[1], p0[0], p0[1], x, y);
  }
  return w !== 0;
}

// node_modules/echarts/lib/coord/geo/Region.js
var TMP_TRANSFORM = [];
function transformPoints(points4, transform) {
  for (var p = 0; p < points4.length; p++) {
    applyTransform(points4[p], points4[p], transform);
  }
}
function updateBBoxFromPoints(points4, min2, max2, projection) {
  for (var i = 0; i < points4.length; i++) {
    var p = points4[i];
    if (projection) {
      p = projection.project(p);
    }
    if (p && isFinite(p[0]) && isFinite(p[1])) {
      min(min2, min2, p);
      max(max2, max2, p);
    }
  }
}
function centroid(points4) {
  var signedArea = 0;
  var cx = 0;
  var cy = 0;
  var len = points4.length;
  var x0 = points4[len - 1][0];
  var y0 = points4[len - 1][1];
  for (var i = 0; i < len; i++) {
    var x1 = points4[i][0];
    var y1 = points4[i][1];
    var a = x0 * y1 - x1 * y0;
    signedArea += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
    x0 = x1;
    y0 = y1;
  }
  return signedArea ? [cx / signedArea / 3, cy / signedArea / 3, signedArea] : [points4[0][0] || 0, points4[0][1] || 0];
}
var Region = (
  /** @class */
  function() {
    function Region2(name) {
      this.name = name;
    }
    Region2.prototype.setCenter = function(center2) {
      this._center = center2;
    };
    Region2.prototype.getCenter = function() {
      var center2 = this._center;
      if (!center2) {
        center2 = this._center = this.calcCenter();
      }
      return center2;
    };
    return Region2;
  }()
);
var GeoJSONPolygonGeometry = (
  /** @class */
  function() {
    function GeoJSONPolygonGeometry2(exterior, interiors) {
      this.type = "polygon";
      this.exterior = exterior;
      this.interiors = interiors;
    }
    return GeoJSONPolygonGeometry2;
  }()
);
var GeoJSONLineStringGeometry = (
  /** @class */
  function() {
    function GeoJSONLineStringGeometry2(points4) {
      this.type = "linestring";
      this.points = points4;
    }
    return GeoJSONLineStringGeometry2;
  }()
);
var GeoJSONRegion = (
  /** @class */
  function(_super) {
    __extends(GeoJSONRegion2, _super);
    function GeoJSONRegion2(name, geometries, cp) {
      var _this = _super.call(this, name) || this;
      _this.type = "geoJSON";
      _this.geometries = geometries;
      _this._center = cp && [cp[0], cp[1]];
      return _this;
    }
    GeoJSONRegion2.prototype.calcCenter = function() {
      var geometries = this.geometries;
      var largestGeo;
      var largestGeoSize = 0;
      for (var i = 0; i < geometries.length; i++) {
        var geo = geometries[i];
        var exterior = geo.exterior;
        var size = exterior && exterior.length;
        if (size > largestGeoSize) {
          largestGeo = geo;
          largestGeoSize = size;
        }
      }
      if (largestGeo) {
        return centroid(largestGeo.exterior);
      }
      var rect = this.getBoundingRect();
      return [rect.x + rect.width / 2, rect.y + rect.height / 2];
    };
    GeoJSONRegion2.prototype.getBoundingRect = function(projection) {
      var rect = this._rect;
      if (rect && !projection) {
        return rect;
      }
      var min2 = [Infinity, Infinity];
      var max2 = [-Infinity, -Infinity];
      var geometries = this.geometries;
      each(geometries, function(geo) {
        if (geo.type === "polygon") {
          updateBBoxFromPoints(geo.exterior, min2, max2, projection);
        } else {
          each(geo.points, function(points4) {
            updateBBoxFromPoints(points4, min2, max2, projection);
          });
        }
      });
      if (!(isFinite(min2[0]) && isFinite(min2[1]) && isFinite(max2[0]) && isFinite(max2[1]))) {
        min2[0] = min2[1] = max2[0] = max2[1] = 0;
      }
      rect = new BoundingRect_default(min2[0], min2[1], max2[0] - min2[0], max2[1] - min2[1]);
      if (!projection) {
        this._rect = rect;
      }
      return rect;
    };
    GeoJSONRegion2.prototype.contain = function(coord) {
      var rect = this.getBoundingRect();
      var geometries = this.geometries;
      if (!rect.contain(coord[0], coord[1])) {
        return false;
      }
      loopGeo:
        for (var i = 0, len = geometries.length; i < len; i++) {
          var geo = geometries[i];
          if (geo.type !== "polygon") {
            continue;
          }
          var exterior = geo.exterior;
          var interiors = geo.interiors;
          if (contain(exterior, coord[0], coord[1])) {
            for (var k = 0; k < (interiors ? interiors.length : 0); k++) {
              if (contain(interiors[k], coord[0], coord[1])) {
                continue loopGeo;
              }
            }
            return true;
          }
        }
      return false;
    };
    GeoJSONRegion2.prototype.transformTo = function(x, y, width, height) {
      var rect = this.getBoundingRect();
      var aspect = rect.width / rect.height;
      if (!width) {
        width = aspect * height;
      } else if (!height) {
        height = width / aspect;
      }
      var target = new BoundingRect_default(x, y, width, height);
      var transform = rect.calculateTransform(target);
      var geometries = this.geometries;
      for (var i = 0; i < geometries.length; i++) {
        var geo = geometries[i];
        if (geo.type === "polygon") {
          transformPoints(geo.exterior, transform);
          each(geo.interiors, function(interior) {
            transformPoints(interior, transform);
          });
        } else {
          each(geo.points, function(points4) {
            transformPoints(points4, transform);
          });
        }
      }
      rect = this._rect;
      rect.copy(target);
      this._center = [rect.x + rect.width / 2, rect.y + rect.height / 2];
    };
    GeoJSONRegion2.prototype.cloneShallow = function(name) {
      name == null && (name = this.name);
      var newRegion = new GeoJSONRegion2(name, this.geometries, this._center);
      newRegion._rect = this._rect;
      newRegion.transformTo = null;
      return newRegion;
    };
    return GeoJSONRegion2;
  }(Region)
);
var GeoSVGRegion = (
  /** @class */
  function(_super) {
    __extends(GeoSVGRegion2, _super);
    function GeoSVGRegion2(name, elOnlyForCalculate) {
      var _this = _super.call(this, name) || this;
      _this.type = "geoSVG";
      _this._elOnlyForCalculate = elOnlyForCalculate;
      return _this;
    }
    GeoSVGRegion2.prototype.calcCenter = function() {
      var el = this._elOnlyForCalculate;
      var rect = el.getBoundingRect();
      var center2 = [rect.x + rect.width / 2, rect.y + rect.height / 2];
      var mat = identity(TMP_TRANSFORM);
      var target = el;
      while (target && !target.isGeoSVGGraphicRoot) {
        mul(mat, target.getLocalTransform(), mat);
        target = target.parent;
      }
      invert(mat, mat);
      applyTransform(center2, center2, mat);
      return center2;
    };
    return GeoSVGRegion2;
  }(Region)
);

// node_modules/echarts/lib/coord/geo/parseGeoJson.js
function decode(json) {
  if (!json.UTF8Encoding) {
    return json;
  }
  var jsonCompressed = json;
  var encodeScale = jsonCompressed.UTF8Scale;
  if (encodeScale == null) {
    encodeScale = 1024;
  }
  var features = jsonCompressed.features;
  each(features, function(feature) {
    var geometry = feature.geometry;
    var encodeOffsets = geometry.encodeOffsets;
    var coordinates = geometry.coordinates;
    if (!encodeOffsets) {
      return;
    }
    switch (geometry.type) {
      case "LineString":
        geometry.coordinates = decodeRing(coordinates, encodeOffsets, encodeScale);
        break;
      case "Polygon":
        decodeRings(coordinates, encodeOffsets, encodeScale);
        break;
      case "MultiLineString":
        decodeRings(coordinates, encodeOffsets, encodeScale);
        break;
      case "MultiPolygon":
        each(coordinates, function(rings, idx) {
          return decodeRings(rings, encodeOffsets[idx], encodeScale);
        });
    }
  });
  jsonCompressed.UTF8Encoding = false;
  return jsonCompressed;
}
function decodeRings(rings, encodeOffsets, encodeScale) {
  for (var c = 0; c < rings.length; c++) {
    rings[c] = decodeRing(rings[c], encodeOffsets[c], encodeScale);
  }
}
function decodeRing(coordinate, encodeOffsets, encodeScale) {
  var result = [];
  var prevX = encodeOffsets[0];
  var prevY = encodeOffsets[1];
  for (var i = 0; i < coordinate.length; i += 2) {
    var x = coordinate.charCodeAt(i) - 64;
    var y = coordinate.charCodeAt(i + 1) - 64;
    x = x >> 1 ^ -(x & 1);
    y = y >> 1 ^ -(y & 1);
    x += prevX;
    y += prevY;
    prevX = x;
    prevY = y;
    result.push([x / encodeScale, y / encodeScale]);
  }
  return result;
}
function parseGeoJSON(geoJson, nameProperty) {
  geoJson = decode(geoJson);
  return map(filter(geoJson.features, function(featureObj) {
    return featureObj.geometry && featureObj.properties && featureObj.geometry.coordinates.length > 0;
  }), function(featureObj) {
    var properties = featureObj.properties;
    var geo = featureObj.geometry;
    var geometries = [];
    switch (geo.type) {
      case "Polygon":
        var coordinates = geo.coordinates;
        geometries.push(new GeoJSONPolygonGeometry(coordinates[0], coordinates.slice(1)));
        break;
      case "MultiPolygon":
        each(geo.coordinates, function(item) {
          if (item[0]) {
            geometries.push(new GeoJSONPolygonGeometry(item[0], item.slice(1)));
          }
        });
        break;
      case "LineString":
        geometries.push(new GeoJSONLineStringGeometry([geo.coordinates]));
        break;
      case "MultiLineString":
        geometries.push(new GeoJSONLineStringGeometry(geo.coordinates));
    }
    var region = new GeoJSONRegion(properties[nameProperty || "name"], geometries, properties.cp);
    region.properties = properties;
    return region;
  });
}

// node_modules/echarts/lib/scale/Scale.js
var Scale = (
  /** @class */
  function() {
    function Scale2(setting) {
      this._setting = setting || {};
      this._extent = [Infinity, -Infinity];
    }
    Scale2.prototype.getSetting = function(name) {
      return this._setting[name];
    };
    Scale2.prototype.unionExtent = function(other) {
      var extent3 = this._extent;
      other[0] < extent3[0] && (extent3[0] = other[0]);
      other[1] > extent3[1] && (extent3[1] = other[1]);
    };
    Scale2.prototype.unionExtentFromData = function(data, dim) {
      this.unionExtent(data.getApproximateExtent(dim));
    };
    Scale2.prototype.getExtent = function() {
      return this._extent.slice();
    };
    Scale2.prototype.setExtent = function(start, end) {
      var thisExtent = this._extent;
      if (!isNaN(start)) {
        thisExtent[0] = start;
      }
      if (!isNaN(end)) {
        thisExtent[1] = end;
      }
    };
    Scale2.prototype.isInExtentRange = function(value) {
      return this._extent[0] <= value && this._extent[1] >= value;
    };
    Scale2.prototype.isBlank = function() {
      return this._isBlank;
    };
    Scale2.prototype.setBlank = function(isBlank) {
      this._isBlank = isBlank;
    };
    return Scale2;
  }()
);
enableClassManagement(Scale);
var Scale_default = Scale;

// node_modules/echarts/lib/data/OrdinalMeta.js
var uidBase = 0;
var OrdinalMeta = (
  /** @class */
  function() {
    function OrdinalMeta2(opt) {
      this.categories = opt.categories || [];
      this._needCollect = opt.needCollect;
      this._deduplication = opt.deduplication;
      this.uid = ++uidBase;
    }
    OrdinalMeta2.createByAxisModel = function(axisModel) {
      var option = axisModel.option;
      var data = option.data;
      var categories = data && map(data, getName);
      return new OrdinalMeta2({
        categories,
        needCollect: !categories,
        // deduplication is default in axis.
        deduplication: option.dedplication !== false
      });
    };
    ;
    OrdinalMeta2.prototype.getOrdinal = function(category) {
      return this._getOrCreateMap().get(category);
    };
    OrdinalMeta2.prototype.parseAndCollect = function(category) {
      var index;
      var needCollect = this._needCollect;
      if (!isString(category) && !needCollect) {
        return category;
      }
      if (needCollect && !this._deduplication) {
        index = this.categories.length;
        this.categories[index] = category;
        return index;
      }
      var map3 = this._getOrCreateMap();
      index = map3.get(category);
      if (index == null) {
        if (needCollect) {
          index = this.categories.length;
          this.categories[index] = category;
          map3.set(category, index);
        } else {
          index = NaN;
        }
      }
      return index;
    };
    OrdinalMeta2.prototype._getOrCreateMap = function() {
      return this._map || (this._map = createHashMap(this.categories));
    };
    return OrdinalMeta2;
  }()
);
function getName(obj) {
  if (isObject(obj) && obj.value != null) {
    return obj.value;
  } else {
    return obj + "";
  }
}
var OrdinalMeta_default = OrdinalMeta;

// node_modules/echarts/lib/scale/helper.js
function isValueNice(val) {
  var exp10 = Math.pow(10, quantityExponent(Math.abs(val)));
  var f = Math.abs(val / exp10);
  return f === 0 || f === 1 || f === 2 || f === 3 || f === 5;
}
function isIntervalOrLogScale(scale4) {
  return scale4.type === "interval" || scale4.type === "log";
}
function intervalScaleNiceTicks(extent3, splitNumber, minInterval, maxInterval) {
  var result = {};
  var span = extent3[1] - extent3[0];
  var interval = result.interval = nice(span / splitNumber, true);
  if (minInterval != null && interval < minInterval) {
    interval = result.interval = minInterval;
  }
  if (maxInterval != null && interval > maxInterval) {
    interval = result.interval = maxInterval;
  }
  var precision = result.intervalPrecision = getIntervalPrecision(interval);
  var niceTickExtent = result.niceTickExtent = [round(Math.ceil(extent3[0] / interval) * interval, precision), round(Math.floor(extent3[1] / interval) * interval, precision)];
  fixExtent(niceTickExtent, extent3);
  return result;
}
function increaseInterval(interval) {
  var exp10 = Math.pow(10, quantityExponent(interval));
  var f = interval / exp10;
  if (!f) {
    f = 1;
  } else if (f === 2) {
    f = 3;
  } else if (f === 3) {
    f = 5;
  } else {
    f *= 2;
  }
  return round(f * exp10);
}
function getIntervalPrecision(interval) {
  return getPrecision(interval) + 2;
}
function clamp(niceTickExtent, idx, extent3) {
  niceTickExtent[idx] = Math.max(Math.min(niceTickExtent[idx], extent3[1]), extent3[0]);
}
function fixExtent(niceTickExtent, extent3) {
  !isFinite(niceTickExtent[0]) && (niceTickExtent[0] = extent3[0]);
  !isFinite(niceTickExtent[1]) && (niceTickExtent[1] = extent3[1]);
  clamp(niceTickExtent, 0, extent3);
  clamp(niceTickExtent, 1, extent3);
  if (niceTickExtent[0] > niceTickExtent[1]) {
    niceTickExtent[0] = niceTickExtent[1];
  }
}
function contain2(val, extent3) {
  return val >= extent3[0] && val <= extent3[1];
}
function normalize2(val, extent3) {
  if (extent3[1] === extent3[0]) {
    return 0.5;
  }
  return (val - extent3[0]) / (extent3[1] - extent3[0]);
}
function scale3(val, extent3) {
  return val * (extent3[1] - extent3[0]) + extent3[0];
}

// node_modules/echarts/lib/scale/Ordinal.js
var OrdinalScale = (
  /** @class */
  function(_super) {
    __extends(OrdinalScale2, _super);
    function OrdinalScale2(setting) {
      var _this = _super.call(this, setting) || this;
      _this.type = "ordinal";
      var ordinalMeta = _this.getSetting("ordinalMeta");
      if (!ordinalMeta) {
        ordinalMeta = new OrdinalMeta_default({});
      }
      if (isArray(ordinalMeta)) {
        ordinalMeta = new OrdinalMeta_default({
          categories: map(ordinalMeta, function(item) {
            return isObject(item) ? item.value : item;
          })
        });
      }
      _this._ordinalMeta = ordinalMeta;
      _this._extent = _this.getSetting("extent") || [0, ordinalMeta.categories.length - 1];
      return _this;
    }
    OrdinalScale2.prototype.parse = function(val) {
      if (val == null) {
        return NaN;
      }
      return isString(val) ? this._ordinalMeta.getOrdinal(val) : Math.round(val);
    };
    OrdinalScale2.prototype.contain = function(rank) {
      rank = this.parse(rank);
      return contain2(rank, this._extent) && this._ordinalMeta.categories[rank] != null;
    };
    OrdinalScale2.prototype.normalize = function(val) {
      val = this._getTickNumber(this.parse(val));
      return normalize2(val, this._extent);
    };
    OrdinalScale2.prototype.scale = function(val) {
      val = Math.round(scale3(val, this._extent));
      return this.getRawOrdinalNumber(val);
    };
    OrdinalScale2.prototype.getTicks = function() {
      var ticks = [];
      var extent3 = this._extent;
      var rank = extent3[0];
      while (rank <= extent3[1]) {
        ticks.push({
          value: rank
        });
        rank++;
      }
      return ticks;
    };
    OrdinalScale2.prototype.getMinorTicks = function(splitNumber) {
      return;
    };
    OrdinalScale2.prototype.setSortInfo = function(info) {
      if (info == null) {
        this._ordinalNumbersByTick = this._ticksByOrdinalNumber = null;
        return;
      }
      var infoOrdinalNumbers = info.ordinalNumbers;
      var ordinalsByTick = this._ordinalNumbersByTick = [];
      var ticksByOrdinal = this._ticksByOrdinalNumber = [];
      var tickNum = 0;
      var allCategoryLen = this._ordinalMeta.categories.length;
      for (var len = Math.min(allCategoryLen, infoOrdinalNumbers.length); tickNum < len; ++tickNum) {
        var ordinalNumber = infoOrdinalNumbers[tickNum];
        ordinalsByTick[tickNum] = ordinalNumber;
        ticksByOrdinal[ordinalNumber] = tickNum;
      }
      var unusedOrdinal = 0;
      for (; tickNum < allCategoryLen; ++tickNum) {
        while (ticksByOrdinal[unusedOrdinal] != null) {
          unusedOrdinal++;
        }
        ;
        ordinalsByTick.push(unusedOrdinal);
        ticksByOrdinal[unusedOrdinal] = tickNum;
      }
    };
    OrdinalScale2.prototype._getTickNumber = function(ordinal) {
      var ticksByOrdinalNumber = this._ticksByOrdinalNumber;
      return ticksByOrdinalNumber && ordinal >= 0 && ordinal < ticksByOrdinalNumber.length ? ticksByOrdinalNumber[ordinal] : ordinal;
    };
    OrdinalScale2.prototype.getRawOrdinalNumber = function(tickNumber) {
      var ordinalNumbersByTick = this._ordinalNumbersByTick;
      return ordinalNumbersByTick && tickNumber >= 0 && tickNumber < ordinalNumbersByTick.length ? ordinalNumbersByTick[tickNumber] : tickNumber;
    };
    OrdinalScale2.prototype.getLabel = function(tick) {
      if (!this.isBlank()) {
        var ordinalNumber = this.getRawOrdinalNumber(tick.value);
        var cateogry = this._ordinalMeta.categories[ordinalNumber];
        return cateogry == null ? "" : cateogry + "";
      }
    };
    OrdinalScale2.prototype.count = function() {
      return this._extent[1] - this._extent[0] + 1;
    };
    OrdinalScale2.prototype.unionExtentFromData = function(data, dim) {
      this.unionExtent(data.getApproximateExtent(dim));
    };
    OrdinalScale2.prototype.isInExtentRange = function(value) {
      value = this._getTickNumber(value);
      return this._extent[0] <= value && this._extent[1] >= value;
    };
    OrdinalScale2.prototype.getOrdinalMeta = function() {
      return this._ordinalMeta;
    };
    OrdinalScale2.prototype.calcNiceTicks = function() {
    };
    OrdinalScale2.prototype.calcNiceExtent = function() {
    };
    OrdinalScale2.type = "ordinal";
    return OrdinalScale2;
  }(Scale_default)
);
Scale_default.registerClass(OrdinalScale);
var Ordinal_default = OrdinalScale;

// node_modules/echarts/lib/scale/Interval.js
var roundNumber = round;
var IntervalScale = (
  /** @class */
  function(_super) {
    __extends(IntervalScale2, _super);
    function IntervalScale2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = "interval";
      _this._interval = 0;
      _this._intervalPrecision = 2;
      return _this;
    }
    IntervalScale2.prototype.parse = function(val) {
      return val;
    };
    IntervalScale2.prototype.contain = function(val) {
      return contain2(val, this._extent);
    };
    IntervalScale2.prototype.normalize = function(val) {
      return normalize2(val, this._extent);
    };
    IntervalScale2.prototype.scale = function(val) {
      return scale3(val, this._extent);
    };
    IntervalScale2.prototype.setExtent = function(start, end) {
      var thisExtent = this._extent;
      if (!isNaN(start)) {
        thisExtent[0] = parseFloat(start);
      }
      if (!isNaN(end)) {
        thisExtent[1] = parseFloat(end);
      }
    };
    IntervalScale2.prototype.unionExtent = function(other) {
      var extent3 = this._extent;
      other[0] < extent3[0] && (extent3[0] = other[0]);
      other[1] > extent3[1] && (extent3[1] = other[1]);
      this.setExtent(extent3[0], extent3[1]);
    };
    IntervalScale2.prototype.getInterval = function() {
      return this._interval;
    };
    IntervalScale2.prototype.setInterval = function(interval) {
      this._interval = interval;
      this._niceExtent = this._extent.slice();
      this._intervalPrecision = getIntervalPrecision(interval);
    };
    IntervalScale2.prototype.getTicks = function(expandToNicedExtent) {
      var interval = this._interval;
      var extent3 = this._extent;
      var niceTickExtent = this._niceExtent;
      var intervalPrecision = this._intervalPrecision;
      var ticks = [];
      if (!interval) {
        return ticks;
      }
      var safeLimit = 1e4;
      if (extent3[0] < niceTickExtent[0]) {
        if (expandToNicedExtent) {
          ticks.push({
            value: roundNumber(niceTickExtent[0] - interval, intervalPrecision)
          });
        } else {
          ticks.push({
            value: extent3[0]
          });
        }
      }
      var tick = niceTickExtent[0];
      while (tick <= niceTickExtent[1]) {
        ticks.push({
          value: tick
        });
        tick = roundNumber(tick + interval, intervalPrecision);
        if (tick === ticks[ticks.length - 1].value) {
          break;
        }
        if (ticks.length > safeLimit) {
          return [];
        }
      }
      var lastNiceTick = ticks.length ? ticks[ticks.length - 1].value : niceTickExtent[1];
      if (extent3[1] > lastNiceTick) {
        if (expandToNicedExtent) {
          ticks.push({
            value: roundNumber(lastNiceTick + interval, intervalPrecision)
          });
        } else {
          ticks.push({
            value: extent3[1]
          });
        }
      }
      return ticks;
    };
    IntervalScale2.prototype.getMinorTicks = function(splitNumber) {
      var ticks = this.getTicks(true);
      var minorTicks = [];
      var extent3 = this.getExtent();
      for (var i = 1; i < ticks.length; i++) {
        var nextTick = ticks[i];
        var prevTick = ticks[i - 1];
        var count = 0;
        var minorTicksGroup = [];
        var interval = nextTick.value - prevTick.value;
        var minorInterval = interval / splitNumber;
        while (count < splitNumber - 1) {
          var minorTick = roundNumber(prevTick.value + (count + 1) * minorInterval);
          if (minorTick > extent3[0] && minorTick < extent3[1]) {
            minorTicksGroup.push(minorTick);
          }
          count++;
        }
        minorTicks.push(minorTicksGroup);
      }
      return minorTicks;
    };
    IntervalScale2.prototype.getLabel = function(data, opt) {
      if (data == null) {
        return "";
      }
      var precision = opt && opt.precision;
      if (precision == null) {
        precision = getPrecision(data.value) || 0;
      } else if (precision === "auto") {
        precision = this._intervalPrecision;
      }
      var dataNum = roundNumber(data.value, precision, true);
      return addCommas(dataNum);
    };
    IntervalScale2.prototype.calcNiceTicks = function(splitNumber, minInterval, maxInterval) {
      splitNumber = splitNumber || 5;
      var extent3 = this._extent;
      var span = extent3[1] - extent3[0];
      if (!isFinite(span)) {
        return;
      }
      if (span < 0) {
        span = -span;
        extent3.reverse();
      }
      var result = intervalScaleNiceTicks(extent3, splitNumber, minInterval, maxInterval);
      this._intervalPrecision = result.intervalPrecision;
      this._interval = result.interval;
      this._niceExtent = result.niceTickExtent;
    };
    IntervalScale2.prototype.calcNiceExtent = function(opt) {
      var extent3 = this._extent;
      if (extent3[0] === extent3[1]) {
        if (extent3[0] !== 0) {
          var expandSize = Math.abs(extent3[0]);
          if (!opt.fixMax) {
            extent3[1] += expandSize / 2;
            extent3[0] -= expandSize / 2;
          } else {
            extent3[0] -= expandSize / 2;
          }
        } else {
          extent3[1] = 1;
        }
      }
      var span = extent3[1] - extent3[0];
      if (!isFinite(span)) {
        extent3[0] = 0;
        extent3[1] = 1;
      }
      this.calcNiceTicks(opt.splitNumber, opt.minInterval, opt.maxInterval);
      var interval = this._interval;
      if (!opt.fixMin) {
        extent3[0] = roundNumber(Math.floor(extent3[0] / interval) * interval);
      }
      if (!opt.fixMax) {
        extent3[1] = roundNumber(Math.ceil(extent3[1] / interval) * interval);
      }
    };
    IntervalScale2.prototype.setNiceExtent = function(min2, max2) {
      this._niceExtent = [min2, max2];
    };
    IntervalScale2.type = "interval";
    return IntervalScale2;
  }(Scale_default)
);
Scale_default.registerClass(IntervalScale);
var Interval_default = IntervalScale;

// node_modules/echarts/lib/data/helper/dataStackHelper.js
function enableDataStack(seriesModel, dimensionsInput, opt) {
  opt = opt || {};
  var byIndex = opt.byIndex;
  var stackedCoordDimension = opt.stackedCoordDimension;
  var dimensionDefineList;
  var schema;
  var store;
  if (isLegacyDimensionsInput(dimensionsInput)) {
    dimensionDefineList = dimensionsInput;
  } else {
    schema = dimensionsInput.schema;
    dimensionDefineList = schema.dimensions;
    store = dimensionsInput.store;
  }
  var mayStack = !!(seriesModel && seriesModel.get("stack"));
  var stackedByDimInfo;
  var stackedDimInfo;
  var stackResultDimension;
  var stackedOverDimension;
  each(dimensionDefineList, function(dimensionInfo, index) {
    if (isString(dimensionInfo)) {
      dimensionDefineList[index] = dimensionInfo = {
        name: dimensionInfo
      };
    }
    if (mayStack && !dimensionInfo.isExtraCoord) {
      if (!byIndex && !stackedByDimInfo && dimensionInfo.ordinalMeta) {
        stackedByDimInfo = dimensionInfo;
      }
      if (!stackedDimInfo && dimensionInfo.type !== "ordinal" && dimensionInfo.type !== "time" && (!stackedCoordDimension || stackedCoordDimension === dimensionInfo.coordDim)) {
        stackedDimInfo = dimensionInfo;
      }
    }
  });
  if (stackedDimInfo && !byIndex && !stackedByDimInfo) {
    byIndex = true;
  }
  if (stackedDimInfo) {
    stackResultDimension = "__\0ecstackresult_" + seriesModel.id;
    stackedOverDimension = "__\0ecstackedover_" + seriesModel.id;
    if (stackedByDimInfo) {
      stackedByDimInfo.createInvertedIndices = true;
    }
    var stackedDimCoordDim_1 = stackedDimInfo.coordDim;
    var stackedDimType = stackedDimInfo.type;
    var stackedDimCoordIndex_1 = 0;
    each(dimensionDefineList, function(dimensionInfo) {
      if (dimensionInfo.coordDim === stackedDimCoordDim_1) {
        stackedDimCoordIndex_1++;
      }
    });
    var stackedOverDimensionDefine = {
      name: stackResultDimension,
      coordDim: stackedDimCoordDim_1,
      coordDimIndex: stackedDimCoordIndex_1,
      type: stackedDimType,
      isExtraCoord: true,
      isCalculationCoord: true,
      storeDimIndex: dimensionDefineList.length
    };
    var stackResultDimensionDefine = {
      name: stackedOverDimension,
      // This dimension contains stack base (generally, 0), so do not set it as
      // `stackedDimCoordDim` to avoid extent calculation, consider log scale.
      coordDim: stackedOverDimension,
      coordDimIndex: stackedDimCoordIndex_1 + 1,
      type: stackedDimType,
      isExtraCoord: true,
      isCalculationCoord: true,
      storeDimIndex: dimensionDefineList.length + 1
    };
    if (schema) {
      if (store) {
        stackedOverDimensionDefine.storeDimIndex = store.ensureCalculationDimension(stackedOverDimension, stackedDimType);
        stackResultDimensionDefine.storeDimIndex = store.ensureCalculationDimension(stackResultDimension, stackedDimType);
      }
      schema.appendCalculationDimension(stackedOverDimensionDefine);
      schema.appendCalculationDimension(stackResultDimensionDefine);
    } else {
      dimensionDefineList.push(stackedOverDimensionDefine);
      dimensionDefineList.push(stackResultDimensionDefine);
    }
  }
  return {
    stackedDimension: stackedDimInfo && stackedDimInfo.name,
    stackedByDimension: stackedByDimInfo && stackedByDimInfo.name,
    isStackedByIndex: byIndex,
    stackedOverDimension,
    stackResultDimension
  };
}
function isLegacyDimensionsInput(dimensionsInput) {
  return !isSeriesDataSchema(dimensionsInput.schema);
}
function isDimensionStacked(data, stackedDim) {
  return !!stackedDim && stackedDim === data.getCalculationInfo("stackedDimension");
}
function getStackedDimension(data, targetDim) {
  return isDimensionStacked(data, targetDim) ? data.getCalculationInfo("stackResultDimension") : targetDim;
}

// node_modules/echarts/lib/util/vendor.js
var supportFloat32Array = typeof Float32Array !== "undefined";
var Float32ArrayCtor = !supportFloat32Array ? Array : Float32Array;
function createFloat32Array(arg) {
  if (isArray(arg)) {
    return supportFloat32Array ? new Float32Array(arg) : arg;
  }
  return new Float32ArrayCtor(arg);
}

// node_modules/echarts/lib/layout/barGrid.js
var STACK_PREFIX = "__ec_stack_";
function getSeriesStackId(seriesModel) {
  return seriesModel.get("stack") || STACK_PREFIX + seriesModel.seriesIndex;
}
function getAxisKey(axis) {
  return axis.dim + axis.index;
}
function getLayoutOnAxis(opt) {
  var params = [];
  var baseAxis = opt.axis;
  var axisKey = "axis0";
  if (baseAxis.type !== "category") {
    return;
  }
  var bandWidth = baseAxis.getBandWidth();
  for (var i = 0; i < opt.count || 0; i++) {
    params.push(defaults({
      bandWidth,
      axisKey,
      stackId: STACK_PREFIX + i
    }, opt));
  }
  var widthAndOffsets = doCalBarWidthAndOffset(params);
  var result = [];
  for (var i = 0; i < opt.count; i++) {
    var item = widthAndOffsets[axisKey][STACK_PREFIX + i];
    item.offsetCenter = item.offset + item.width / 2;
    result.push(item);
  }
  return result;
}
function prepareLayoutBarSeries(seriesType2, ecModel) {
  var seriesModels = [];
  ecModel.eachSeriesByType(seriesType2, function(seriesModel) {
    if (isOnCartesian(seriesModel)) {
      seriesModels.push(seriesModel);
    }
  });
  return seriesModels;
}
function getValueAxesMinGaps(barSeries) {
  var axisValues = {};
  each(barSeries, function(seriesModel) {
    var cartesian = seriesModel.coordinateSystem;
    var baseAxis = cartesian.getBaseAxis();
    if (baseAxis.type !== "time" && baseAxis.type !== "value") {
      return;
    }
    var data = seriesModel.getData();
    var key2 = baseAxis.dim + "_" + baseAxis.index;
    var dimIdx = data.getDimensionIndex(data.mapDimension(baseAxis.dim));
    var store = data.getStore();
    for (var i = 0, cnt = store.count(); i < cnt; ++i) {
      var value = store.get(dimIdx, i);
      if (!axisValues[key2]) {
        axisValues[key2] = [value];
      } else {
        axisValues[key2].push(value);
      }
    }
  });
  var axisMinGaps = {};
  for (var key in axisValues) {
    if (axisValues.hasOwnProperty(key)) {
      var valuesInAxis = axisValues[key];
      if (valuesInAxis) {
        valuesInAxis.sort(function(a, b) {
          return a - b;
        });
        var min2 = null;
        for (var j = 1; j < valuesInAxis.length; ++j) {
          var delta = valuesInAxis[j] - valuesInAxis[j - 1];
          if (delta > 0) {
            min2 = min2 === null ? delta : Math.min(min2, delta);
          }
        }
        axisMinGaps[key] = min2;
      }
    }
  }
  return axisMinGaps;
}
function makeColumnLayout(barSeries) {
  var axisMinGaps = getValueAxesMinGaps(barSeries);
  var seriesInfoList = [];
  each(barSeries, function(seriesModel) {
    var cartesian = seriesModel.coordinateSystem;
    var baseAxis = cartesian.getBaseAxis();
    var axisExtent = baseAxis.getExtent();
    var bandWidth;
    if (baseAxis.type === "category") {
      bandWidth = baseAxis.getBandWidth();
    } else if (baseAxis.type === "value" || baseAxis.type === "time") {
      var key = baseAxis.dim + "_" + baseAxis.index;
      var minGap = axisMinGaps[key];
      var extentSpan = Math.abs(axisExtent[1] - axisExtent[0]);
      var scale4 = baseAxis.scale.getExtent();
      var scaleSpan = Math.abs(scale4[1] - scale4[0]);
      bandWidth = minGap ? extentSpan / scaleSpan * minGap : extentSpan;
    } else {
      var data = seriesModel.getData();
      bandWidth = Math.abs(axisExtent[1] - axisExtent[0]) / data.count();
    }
    var barWidth = parsePercent2(seriesModel.get("barWidth"), bandWidth);
    var barMaxWidth = parsePercent2(seriesModel.get("barMaxWidth"), bandWidth);
    var barMinWidth = parsePercent2(
      // barMinWidth by default is 0.5 / 1 in cartesian. Because in value axis,
      // the auto-calculated bar width might be less than 0.5 / 1.
      seriesModel.get("barMinWidth") || (isInLargeMode(seriesModel) ? 0.5 : 1),
      bandWidth
    );
    var barGap = seriesModel.get("barGap");
    var barCategoryGap = seriesModel.get("barCategoryGap");
    seriesInfoList.push({
      bandWidth,
      barWidth,
      barMaxWidth,
      barMinWidth,
      barGap,
      barCategoryGap,
      axisKey: getAxisKey(baseAxis),
      stackId: getSeriesStackId(seriesModel)
    });
  });
  return doCalBarWidthAndOffset(seriesInfoList);
}
function doCalBarWidthAndOffset(seriesInfoList) {
  var columnsMap = {};
  each(seriesInfoList, function(seriesInfo, idx) {
    var axisKey = seriesInfo.axisKey;
    var bandWidth = seriesInfo.bandWidth;
    var columnsOnAxis = columnsMap[axisKey] || {
      bandWidth,
      remainedWidth: bandWidth,
      autoWidthCount: 0,
      categoryGap: null,
      gap: "20%",
      stacks: {}
    };
    var stacks = columnsOnAxis.stacks;
    columnsMap[axisKey] = columnsOnAxis;
    var stackId = seriesInfo.stackId;
    if (!stacks[stackId]) {
      columnsOnAxis.autoWidthCount++;
    }
    stacks[stackId] = stacks[stackId] || {
      width: 0,
      maxWidth: 0
    };
    var barWidth = seriesInfo.barWidth;
    if (barWidth && !stacks[stackId].width) {
      stacks[stackId].width = barWidth;
      barWidth = Math.min(columnsOnAxis.remainedWidth, barWidth);
      columnsOnAxis.remainedWidth -= barWidth;
    }
    var barMaxWidth = seriesInfo.barMaxWidth;
    barMaxWidth && (stacks[stackId].maxWidth = barMaxWidth);
    var barMinWidth = seriesInfo.barMinWidth;
    barMinWidth && (stacks[stackId].minWidth = barMinWidth);
    var barGap = seriesInfo.barGap;
    barGap != null && (columnsOnAxis.gap = barGap);
    var barCategoryGap = seriesInfo.barCategoryGap;
    barCategoryGap != null && (columnsOnAxis.categoryGap = barCategoryGap);
  });
  var result = {};
  each(columnsMap, function(columnsOnAxis, coordSysName) {
    result[coordSysName] = {};
    var stacks = columnsOnAxis.stacks;
    var bandWidth = columnsOnAxis.bandWidth;
    var categoryGapPercent = columnsOnAxis.categoryGap;
    if (categoryGapPercent == null) {
      var columnCount = keys(stacks).length;
      categoryGapPercent = Math.max(35 - columnCount * 4, 15) + "%";
    }
    var categoryGap = parsePercent2(categoryGapPercent, bandWidth);
    var barGapPercent = parsePercent2(columnsOnAxis.gap, 1);
    var remainedWidth = columnsOnAxis.remainedWidth;
    var autoWidthCount = columnsOnAxis.autoWidthCount;
    var autoWidth = (remainedWidth - categoryGap) / (autoWidthCount + (autoWidthCount - 1) * barGapPercent);
    autoWidth = Math.max(autoWidth, 0);
    each(stacks, function(column) {
      var maxWidth = column.maxWidth;
      var minWidth = column.minWidth;
      if (!column.width) {
        var finalWidth = autoWidth;
        if (maxWidth && maxWidth < finalWidth) {
          finalWidth = Math.min(maxWidth, remainedWidth);
        }
        if (minWidth && minWidth > finalWidth) {
          finalWidth = minWidth;
        }
        if (finalWidth !== autoWidth) {
          column.width = finalWidth;
          remainedWidth -= finalWidth + barGapPercent * finalWidth;
          autoWidthCount--;
        }
      } else {
        var finalWidth = column.width;
        if (maxWidth) {
          finalWidth = Math.min(finalWidth, maxWidth);
        }
        if (minWidth) {
          finalWidth = Math.max(finalWidth, minWidth);
        }
        column.width = finalWidth;
        remainedWidth -= finalWidth + barGapPercent * finalWidth;
        autoWidthCount--;
      }
    });
    autoWidth = (remainedWidth - categoryGap) / (autoWidthCount + (autoWidthCount - 1) * barGapPercent);
    autoWidth = Math.max(autoWidth, 0);
    var widthSum = 0;
    var lastColumn;
    each(stacks, function(column, idx) {
      if (!column.width) {
        column.width = autoWidth;
      }
      lastColumn = column;
      widthSum += column.width * (1 + barGapPercent);
    });
    if (lastColumn) {
      widthSum -= lastColumn.width * barGapPercent;
    }
    var offset = -widthSum / 2;
    each(stacks, function(column, stackId) {
      result[coordSysName][stackId] = result[coordSysName][stackId] || {
        bandWidth,
        offset,
        width: column.width
      };
      offset += column.width * (1 + barGapPercent);
    });
  });
  return result;
}
function retrieveColumnLayout(barWidthAndOffset, axis, seriesModel) {
  if (barWidthAndOffset && axis) {
    var result = barWidthAndOffset[getAxisKey(axis)];
    if (result != null && seriesModel != null) {
      return result[getSeriesStackId(seriesModel)];
    }
    return result;
  }
}
function layout(seriesType2, ecModel) {
  var seriesModels = prepareLayoutBarSeries(seriesType2, ecModel);
  var barWidthAndOffset = makeColumnLayout(seriesModels);
  each(seriesModels, function(seriesModel) {
    var data = seriesModel.getData();
    var cartesian = seriesModel.coordinateSystem;
    var baseAxis = cartesian.getBaseAxis();
    var stackId = getSeriesStackId(seriesModel);
    var columnLayoutInfo = barWidthAndOffset[getAxisKey(baseAxis)][stackId];
    var columnOffset = columnLayoutInfo.offset;
    var columnWidth = columnLayoutInfo.width;
    data.setLayout({
      bandWidth: columnLayoutInfo.bandWidth,
      offset: columnOffset,
      size: columnWidth
    });
  });
}
function createProgressiveLayout(seriesType2) {
  return {
    seriesType: seriesType2,
    plan: createRenderPlanner(),
    reset: function(seriesModel) {
      if (!isOnCartesian(seriesModel)) {
        return;
      }
      var data = seriesModel.getData();
      var cartesian = seriesModel.coordinateSystem;
      var baseAxis = cartesian.getBaseAxis();
      var valueAxis2 = cartesian.getOtherAxis(baseAxis);
      var valueDimIdx = data.getDimensionIndex(data.mapDimension(valueAxis2.dim));
      var baseDimIdx = data.getDimensionIndex(data.mapDimension(baseAxis.dim));
      var drawBackground = seriesModel.get("showBackground", true);
      var valueDim = data.mapDimension(valueAxis2.dim);
      var stackResultDim = data.getCalculationInfo("stackResultDimension");
      var stacked = isDimensionStacked(data, valueDim) && !!data.getCalculationInfo("stackedOnSeries");
      var isValueAxisH = valueAxis2.isHorizontal();
      var valueAxisStart = getValueAxisStart(baseAxis, valueAxis2);
      var isLarge = isInLargeMode(seriesModel);
      var barMinHeight = seriesModel.get("barMinHeight") || 0;
      var stackedDimIdx = stackResultDim && data.getDimensionIndex(stackResultDim);
      var columnWidth = data.getLayout("size");
      var columnOffset = data.getLayout("offset");
      return {
        progress: function(params, data2) {
          var count = params.count;
          var largePoints = isLarge && createFloat32Array(count * 3);
          var largeBackgroundPoints = isLarge && drawBackground && createFloat32Array(count * 3);
          var largeDataIndices = isLarge && createFloat32Array(count);
          var coordLayout = cartesian.master.getRect();
          var bgSize = isValueAxisH ? coordLayout.width : coordLayout.height;
          var dataIndex;
          var store = data2.getStore();
          var idxOffset = 0;
          while ((dataIndex = params.next()) != null) {
            var value = store.get(stacked ? stackedDimIdx : valueDimIdx, dataIndex);
            var baseValue = store.get(baseDimIdx, dataIndex);
            var baseCoord = valueAxisStart;
            var startValue = void 0;
            if (stacked) {
              startValue = +value - store.get(valueDimIdx, dataIndex);
            }
            var x = void 0;
            var y = void 0;
            var width = void 0;
            var height = void 0;
            if (isValueAxisH) {
              var coord = cartesian.dataToPoint([value, baseValue]);
              if (stacked) {
                var startCoord = cartesian.dataToPoint([startValue, baseValue]);
                baseCoord = startCoord[0];
              }
              x = baseCoord;
              y = coord[1] + columnOffset;
              width = coord[0] - baseCoord;
              height = columnWidth;
              if (Math.abs(width) < barMinHeight) {
                width = (width < 0 ? -1 : 1) * barMinHeight;
              }
            } else {
              var coord = cartesian.dataToPoint([baseValue, value]);
              if (stacked) {
                var startCoord = cartesian.dataToPoint([baseValue, startValue]);
                baseCoord = startCoord[1];
              }
              x = coord[0] + columnOffset;
              y = baseCoord;
              width = columnWidth;
              height = coord[1] - baseCoord;
              if (Math.abs(height) < barMinHeight) {
                height = (height <= 0 ? -1 : 1) * barMinHeight;
              }
            }
            if (!isLarge) {
              data2.setItemLayout(dataIndex, {
                x,
                y,
                width,
                height
              });
            } else {
              largePoints[idxOffset] = x;
              largePoints[idxOffset + 1] = y;
              largePoints[idxOffset + 2] = isValueAxisH ? width : height;
              if (largeBackgroundPoints) {
                largeBackgroundPoints[idxOffset] = isValueAxisH ? coordLayout.x : x;
                largeBackgroundPoints[idxOffset + 1] = isValueAxisH ? y : coordLayout.y;
                largeBackgroundPoints[idxOffset + 2] = bgSize;
              }
              largeDataIndices[dataIndex] = dataIndex;
            }
            idxOffset += 3;
          }
          if (isLarge) {
            data2.setLayout({
              largePoints,
              largeDataIndices,
              largeBackgroundPoints,
              valueAxisHorizontal: isValueAxisH
            });
          }
        }
      };
    }
  };
}
function isOnCartesian(seriesModel) {
  return seriesModel.coordinateSystem && seriesModel.coordinateSystem.type === "cartesian2d";
}
function isInLargeMode(seriesModel) {
  return seriesModel.pipelineContext && seriesModel.pipelineContext.large;
}
function getValueAxisStart(baseAxis, valueAxis2) {
  return valueAxis2.toGlobalCoord(valueAxis2.dataToCoord(valueAxis2.type === "log" ? 1 : 0));
}

// node_modules/echarts/lib/scale/Time.js
var bisect = function(a, x, lo, hi) {
  while (lo < hi) {
    var mid = lo + hi >>> 1;
    if (a[mid][1] < x) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
};
var TimeScale = (
  /** @class */
  function(_super) {
    __extends(TimeScale2, _super);
    function TimeScale2(settings) {
      var _this = _super.call(this, settings) || this;
      _this.type = "time";
      return _this;
    }
    TimeScale2.prototype.getLabel = function(tick) {
      var useUTC = this.getSetting("useUTC");
      return format(tick.value, fullLeveledFormatter[getDefaultFormatPrecisionOfInterval(getPrimaryTimeUnit(this._minLevelUnit))] || fullLeveledFormatter.second, useUTC, this.getSetting("locale"));
    };
    TimeScale2.prototype.getFormattedLabel = function(tick, idx, labelFormatter) {
      var isUTC = this.getSetting("useUTC");
      var lang = this.getSetting("locale");
      return leveledFormat(tick, idx, labelFormatter, lang, isUTC);
    };
    TimeScale2.prototype.getTicks = function() {
      var interval = this._interval;
      var extent3 = this._extent;
      var ticks = [];
      if (!interval) {
        return ticks;
      }
      ticks.push({
        value: extent3[0],
        level: 0
      });
      var useUTC = this.getSetting("useUTC");
      var innerTicks = getIntervalTicks(this._minLevelUnit, this._approxInterval, useUTC, extent3);
      ticks = ticks.concat(innerTicks);
      ticks.push({
        value: extent3[1],
        level: 0
      });
      return ticks;
    };
    TimeScale2.prototype.calcNiceExtent = function(opt) {
      var extent3 = this._extent;
      if (extent3[0] === extent3[1]) {
        extent3[0] -= ONE_DAY;
        extent3[1] += ONE_DAY;
      }
      if (extent3[1] === -Infinity && extent3[0] === Infinity) {
        var d = /* @__PURE__ */ new Date();
        extent3[1] = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
        extent3[0] = extent3[1] - ONE_DAY;
      }
      this.calcNiceTicks(opt.splitNumber, opt.minInterval, opt.maxInterval);
    };
    TimeScale2.prototype.calcNiceTicks = function(approxTickNum, minInterval, maxInterval) {
      approxTickNum = approxTickNum || 10;
      var extent3 = this._extent;
      var span = extent3[1] - extent3[0];
      this._approxInterval = span / approxTickNum;
      if (minInterval != null && this._approxInterval < minInterval) {
        this._approxInterval = minInterval;
      }
      if (maxInterval != null && this._approxInterval > maxInterval) {
        this._approxInterval = maxInterval;
      }
      var scaleIntervalsLen = scaleIntervals.length;
      var idx = Math.min(bisect(scaleIntervals, this._approxInterval, 0, scaleIntervalsLen), scaleIntervalsLen - 1);
      this._interval = scaleIntervals[idx][1];
      this._minLevelUnit = scaleIntervals[Math.max(idx - 1, 0)][0];
    };
    TimeScale2.prototype.parse = function(val) {
      return isNumber(val) ? val : +parseDate(val);
    };
    TimeScale2.prototype.contain = function(val) {
      return contain2(this.parse(val), this._extent);
    };
    TimeScale2.prototype.normalize = function(val) {
      return normalize2(this.parse(val), this._extent);
    };
    TimeScale2.prototype.scale = function(val) {
      return scale3(val, this._extent);
    };
    TimeScale2.type = "time";
    return TimeScale2;
  }(Interval_default)
);
var scaleIntervals = [
  // Format                           interval
  ["second", ONE_SECOND],
  ["minute", ONE_MINUTE],
  ["hour", ONE_HOUR],
  ["quarter-day", ONE_HOUR * 6],
  ["half-day", ONE_HOUR * 12],
  ["day", ONE_DAY * 1.2],
  ["half-week", ONE_DAY * 3.5],
  ["week", ONE_DAY * 7],
  ["month", ONE_DAY * 31],
  ["quarter", ONE_DAY * 95],
  ["half-year", ONE_YEAR / 2],
  ["year", ONE_YEAR]
  // 1Y
];
function isUnitValueSame(unit, valueA, valueB, isUTC) {
  var dateA = parseDate(valueA);
  var dateB = parseDate(valueB);
  var isSame = function(unit2) {
    return getUnitValue(dateA, unit2, isUTC) === getUnitValue(dateB, unit2, isUTC);
  };
  var isSameYear = function() {
    return isSame("year");
  };
  var isSameMonth = function() {
    return isSameYear() && isSame("month");
  };
  var isSameDay = function() {
    return isSameMonth() && isSame("day");
  };
  var isSameHour = function() {
    return isSameDay() && isSame("hour");
  };
  var isSameMinute = function() {
    return isSameHour() && isSame("minute");
  };
  var isSameSecond = function() {
    return isSameMinute() && isSame("second");
  };
  var isSameMilliSecond = function() {
    return isSameSecond() && isSame("millisecond");
  };
  switch (unit) {
    case "year":
      return isSameYear();
    case "month":
      return isSameMonth();
    case "day":
      return isSameDay();
    case "hour":
      return isSameHour();
    case "minute":
      return isSameMinute();
    case "second":
      return isSameSecond();
    case "millisecond":
      return isSameMilliSecond();
  }
}
function getDateInterval(approxInterval, daysInMonth) {
  approxInterval /= ONE_DAY;
  return approxInterval > 16 ? 16 : approxInterval > 7.5 ? 7 : approxInterval > 3.5 ? 4 : approxInterval > 1.5 ? 2 : 1;
}
function getMonthInterval(approxInterval) {
  var APPROX_ONE_MONTH = 30 * ONE_DAY;
  approxInterval /= APPROX_ONE_MONTH;
  return approxInterval > 6 ? 6 : approxInterval > 3 ? 3 : approxInterval > 2 ? 2 : 1;
}
function getHourInterval(approxInterval) {
  approxInterval /= ONE_HOUR;
  return approxInterval > 12 ? 12 : approxInterval > 6 ? 6 : approxInterval > 3.5 ? 4 : approxInterval > 2 ? 2 : 1;
}
function getMinutesAndSecondsInterval(approxInterval, isMinutes) {
  approxInterval /= isMinutes ? ONE_MINUTE : ONE_SECOND;
  return approxInterval > 30 ? 30 : approxInterval > 20 ? 20 : approxInterval > 15 ? 15 : approxInterval > 10 ? 10 : approxInterval > 5 ? 5 : approxInterval > 2 ? 2 : 1;
}
function getMillisecondsInterval(approxInterval) {
  return nice(approxInterval, true);
}
function getFirstTimestampOfUnit(date, unitName, isUTC) {
  var outDate = new Date(date);
  switch (getPrimaryTimeUnit(unitName)) {
    case "year":
    case "month":
      outDate[monthSetterName(isUTC)](0);
    case "day":
      outDate[dateSetterName(isUTC)](1);
    case "hour":
      outDate[hoursSetterName(isUTC)](0);
    case "minute":
      outDate[minutesSetterName(isUTC)](0);
    case "second":
      outDate[secondsSetterName(isUTC)](0);
      outDate[millisecondsSetterName(isUTC)](0);
  }
  return outDate.getTime();
}
function getIntervalTicks(bottomUnitName, approxInterval, isUTC, extent3) {
  var safeLimit = 1e4;
  var unitNames = timeUnits;
  var iter = 0;
  function addTicksInSpan(interval, minTimestamp, maxTimestamp, getMethodName, setMethodName, isDate, out2) {
    var date = new Date(minTimestamp);
    var dateTime = minTimestamp;
    var d = date[getMethodName]();
    while (dateTime < maxTimestamp && dateTime <= extent3[1]) {
      out2.push({
        value: dateTime
      });
      d += interval;
      date[setMethodName](d);
      dateTime = date.getTime();
    }
    out2.push({
      value: dateTime,
      notAdd: true
    });
  }
  function addLevelTicks(unitName, lastLevelTicks, levelTicks2) {
    var newAddedTicks = [];
    var isFirstLevel = !lastLevelTicks.length;
    if (isUnitValueSame(getPrimaryTimeUnit(unitName), extent3[0], extent3[1], isUTC)) {
      return;
    }
    if (isFirstLevel) {
      lastLevelTicks = [{
        // TODO Optimize. Not include so may ticks.
        value: getFirstTimestampOfUnit(new Date(extent3[0]), unitName, isUTC)
      }, {
        value: extent3[1]
      }];
    }
    for (var i2 = 0; i2 < lastLevelTicks.length - 1; i2++) {
      var startTick = lastLevelTicks[i2].value;
      var endTick = lastLevelTicks[i2 + 1].value;
      if (startTick === endTick) {
        continue;
      }
      var interval = void 0;
      var getterName = void 0;
      var setterName = void 0;
      var isDate = false;
      switch (unitName) {
        case "year":
          interval = Math.max(1, Math.round(approxInterval / ONE_DAY / 365));
          getterName = fullYearGetterName(isUTC);
          setterName = fullYearSetterName(isUTC);
          break;
        case "half-year":
        case "quarter":
        case "month":
          interval = getMonthInterval(approxInterval);
          getterName = monthGetterName(isUTC);
          setterName = monthSetterName(isUTC);
          break;
        case "week":
        case "half-week":
        case "day":
          interval = getDateInterval(approxInterval, 31);
          getterName = dateGetterName(isUTC);
          setterName = dateSetterName(isUTC);
          isDate = true;
          break;
        case "half-day":
        case "quarter-day":
        case "hour":
          interval = getHourInterval(approxInterval);
          getterName = hoursGetterName(isUTC);
          setterName = hoursSetterName(isUTC);
          break;
        case "minute":
          interval = getMinutesAndSecondsInterval(approxInterval, true);
          getterName = minutesGetterName(isUTC);
          setterName = minutesSetterName(isUTC);
          break;
        case "second":
          interval = getMinutesAndSecondsInterval(approxInterval, false);
          getterName = secondsGetterName(isUTC);
          setterName = secondsSetterName(isUTC);
          break;
        case "millisecond":
          interval = getMillisecondsInterval(approxInterval);
          getterName = millisecondsGetterName(isUTC);
          setterName = millisecondsSetterName(isUTC);
          break;
      }
      addTicksInSpan(interval, startTick, endTick, getterName, setterName, isDate, newAddedTicks);
      if (unitName === "year" && levelTicks2.length > 1 && i2 === 0) {
        levelTicks2.unshift({
          value: levelTicks2[0].value - interval
        });
      }
    }
    for (var i2 = 0; i2 < newAddedTicks.length; i2++) {
      levelTicks2.push(newAddedTicks[i2]);
    }
    return newAddedTicks;
  }
  var levelsTicks = [];
  var currentLevelTicks = [];
  var tickCount = 0;
  var lastLevelTickCount = 0;
  for (var i = 0; i < unitNames.length && iter++ < safeLimit; ++i) {
    var primaryTimeUnit = getPrimaryTimeUnit(unitNames[i]);
    if (!isPrimaryTimeUnit(unitNames[i])) {
      continue;
    }
    addLevelTicks(unitNames[i], levelsTicks[levelsTicks.length - 1] || [], currentLevelTicks);
    var nextPrimaryTimeUnit = unitNames[i + 1] ? getPrimaryTimeUnit(unitNames[i + 1]) : null;
    if (primaryTimeUnit !== nextPrimaryTimeUnit) {
      if (currentLevelTicks.length) {
        lastLevelTickCount = tickCount;
        currentLevelTicks.sort(function(a, b) {
          return a.value - b.value;
        });
        var levelTicksRemoveDuplicated = [];
        for (var i_1 = 0; i_1 < currentLevelTicks.length; ++i_1) {
          var tickValue = currentLevelTicks[i_1].value;
          if (i_1 === 0 || currentLevelTicks[i_1 - 1].value !== tickValue) {
            levelTicksRemoveDuplicated.push(currentLevelTicks[i_1]);
            if (tickValue >= extent3[0] && tickValue <= extent3[1]) {
              tickCount++;
            }
          }
        }
        var targetTickNum = (extent3[1] - extent3[0]) / approxInterval;
        if (tickCount > targetTickNum * 1.5 && lastLevelTickCount > targetTickNum / 1.5) {
          break;
        }
        levelsTicks.push(levelTicksRemoveDuplicated);
        if (tickCount > targetTickNum || bottomUnitName === unitNames[i]) {
          break;
        }
      }
      currentLevelTicks = [];
    }
  }
  if (true) {
    if (iter >= safeLimit) {
      warn("Exceed safe limit.");
    }
  }
  var levelsTicksInExtent = filter(map(levelsTicks, function(levelTicks2) {
    return filter(levelTicks2, function(tick) {
      return tick.value >= extent3[0] && tick.value <= extent3[1] && !tick.notAdd;
    });
  }), function(levelTicks2) {
    return levelTicks2.length > 0;
  });
  var ticks = [];
  var maxLevel = levelsTicksInExtent.length - 1;
  for (var i = 0; i < levelsTicksInExtent.length; ++i) {
    var levelTicks = levelsTicksInExtent[i];
    for (var k = 0; k < levelTicks.length; ++k) {
      ticks.push({
        value: levelTicks[k].value,
        level: maxLevel - i
      });
    }
  }
  ticks.sort(function(a, b) {
    return a.value - b.value;
  });
  var result = [];
  for (var i = 0; i < ticks.length; ++i) {
    if (i === 0 || ticks[i].value !== ticks[i - 1].value) {
      result.push(ticks[i]);
    }
  }
  return result;
}
Scale_default.registerClass(TimeScale);
var Time_default = TimeScale;

// node_modules/echarts/lib/scale/Log.js
var scaleProto = Scale_default.prototype;
var intervalScaleProto = Interval_default.prototype;
var roundingErrorFix = round;
var mathFloor = Math.floor;
var mathCeil = Math.ceil;
var mathPow = Math.pow;
var mathLog = Math.log;
var LogScale = (
  /** @class */
  function(_super) {
    __extends(LogScale2, _super);
    function LogScale2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = "log";
      _this.base = 10;
      _this._originalScale = new Interval_default();
      _this._interval = 0;
      return _this;
    }
    LogScale2.prototype.getTicks = function(expandToNicedExtent) {
      var originalScale = this._originalScale;
      var extent3 = this._extent;
      var originalExtent = originalScale.getExtent();
      var ticks = intervalScaleProto.getTicks.call(this, expandToNicedExtent);
      return map(ticks, function(tick) {
        var val = tick.value;
        var powVal = round(mathPow(this.base, val));
        powVal = val === extent3[0] && this._fixMin ? fixRoundingError(powVal, originalExtent[0]) : powVal;
        powVal = val === extent3[1] && this._fixMax ? fixRoundingError(powVal, originalExtent[1]) : powVal;
        return {
          value: powVal
        };
      }, this);
    };
    LogScale2.prototype.setExtent = function(start, end) {
      var base2 = mathLog(this.base);
      start = mathLog(Math.max(0, start)) / base2;
      end = mathLog(Math.max(0, end)) / base2;
      intervalScaleProto.setExtent.call(this, start, end);
    };
    LogScale2.prototype.getExtent = function() {
      var base2 = this.base;
      var extent3 = scaleProto.getExtent.call(this);
      extent3[0] = mathPow(base2, extent3[0]);
      extent3[1] = mathPow(base2, extent3[1]);
      var originalScale = this._originalScale;
      var originalExtent = originalScale.getExtent();
      this._fixMin && (extent3[0] = fixRoundingError(extent3[0], originalExtent[0]));
      this._fixMax && (extent3[1] = fixRoundingError(extent3[1], originalExtent[1]));
      return extent3;
    };
    LogScale2.prototype.unionExtent = function(extent3) {
      this._originalScale.unionExtent(extent3);
      var base2 = this.base;
      extent3[0] = mathLog(extent3[0]) / mathLog(base2);
      extent3[1] = mathLog(extent3[1]) / mathLog(base2);
      scaleProto.unionExtent.call(this, extent3);
    };
    LogScale2.prototype.unionExtentFromData = function(data, dim) {
      this.unionExtent(data.getApproximateExtent(dim));
    };
    LogScale2.prototype.calcNiceTicks = function(approxTickNum) {
      approxTickNum = approxTickNum || 10;
      var extent3 = this._extent;
      var span = extent3[1] - extent3[0];
      if (span === Infinity || span <= 0) {
        return;
      }
      var interval = quantity(span);
      var err = approxTickNum / span * interval;
      if (err <= 0.5) {
        interval *= 10;
      }
      while (!isNaN(interval) && Math.abs(interval) < 1 && Math.abs(interval) > 0) {
        interval *= 10;
      }
      var niceExtent = [round(mathCeil(extent3[0] / interval) * interval), round(mathFloor(extent3[1] / interval) * interval)];
      this._interval = interval;
      this._niceExtent = niceExtent;
    };
    LogScale2.prototype.calcNiceExtent = function(opt) {
      intervalScaleProto.calcNiceExtent.call(this, opt);
      this._fixMin = opt.fixMin;
      this._fixMax = opt.fixMax;
    };
    LogScale2.prototype.parse = function(val) {
      return val;
    };
    LogScale2.prototype.contain = function(val) {
      val = mathLog(val) / mathLog(this.base);
      return contain2(val, this._extent);
    };
    LogScale2.prototype.normalize = function(val) {
      val = mathLog(val) / mathLog(this.base);
      return normalize2(val, this._extent);
    };
    LogScale2.prototype.scale = function(val) {
      val = scale3(val, this._extent);
      return mathPow(this.base, val);
    };
    LogScale2.type = "log";
    return LogScale2;
  }(Scale_default)
);
var proto = LogScale.prototype;
proto.getMinorTicks = intervalScaleProto.getMinorTicks;
proto.getLabel = intervalScaleProto.getLabel;
function fixRoundingError(val, originalVal) {
  return roundingErrorFix(val, getPrecision(originalVal));
}
Scale_default.registerClass(LogScale);
var Log_default = LogScale;

// node_modules/echarts/lib/coord/scaleRawExtentInfo.js
var ScaleRawExtentInfo = (
  /** @class */
  function() {
    function ScaleRawExtentInfo2(scale4, model, originalExtent) {
      this._prepareParams(scale4, model, originalExtent);
    }
    ScaleRawExtentInfo2.prototype._prepareParams = function(scale4, model, dataExtent) {
      if (dataExtent[1] < dataExtent[0]) {
        dataExtent = [NaN, NaN];
      }
      this._dataMin = dataExtent[0];
      this._dataMax = dataExtent[1];
      var isOrdinal = this._isOrdinal = scale4.type === "ordinal";
      this._needCrossZero = scale4.type === "interval" && model.getNeedCrossZero && model.getNeedCrossZero();
      var modelMinRaw = this._modelMinRaw = model.get("min", true);
      if (isFunction(modelMinRaw)) {
        this._modelMinNum = parseAxisModelMinMax(scale4, modelMinRaw({
          min: dataExtent[0],
          max: dataExtent[1]
        }));
      } else if (modelMinRaw !== "dataMin") {
        this._modelMinNum = parseAxisModelMinMax(scale4, modelMinRaw);
      }
      var modelMaxRaw = this._modelMaxRaw = model.get("max", true);
      if (isFunction(modelMaxRaw)) {
        this._modelMaxNum = parseAxisModelMinMax(scale4, modelMaxRaw({
          min: dataExtent[0],
          max: dataExtent[1]
        }));
      } else if (modelMaxRaw !== "dataMax") {
        this._modelMaxNum = parseAxisModelMinMax(scale4, modelMaxRaw);
      }
      if (isOrdinal) {
        this._axisDataLen = model.getCategories().length;
      } else {
        var boundaryGap = model.get("boundaryGap");
        var boundaryGapArr = isArray(boundaryGap) ? boundaryGap : [boundaryGap || 0, boundaryGap || 0];
        if (typeof boundaryGapArr[0] === "boolean" || typeof boundaryGapArr[1] === "boolean") {
          if (true) {
            console.warn('Boolean type for boundaryGap is only allowed for ordinal axis. Please use string in percentage instead, e.g., "20%". Currently, boundaryGap is set to be 0.');
          }
          this._boundaryGapInner = [0, 0];
        } else {
          this._boundaryGapInner = [parsePercent(boundaryGapArr[0], 1), parsePercent(boundaryGapArr[1], 1)];
        }
      }
    };
    ScaleRawExtentInfo2.prototype.calculate = function() {
      var isOrdinal = this._isOrdinal;
      var dataMin = this._dataMin;
      var dataMax = this._dataMax;
      var axisDataLen = this._axisDataLen;
      var boundaryGapInner = this._boundaryGapInner;
      var span = !isOrdinal ? dataMax - dataMin || Math.abs(dataMin) : null;
      var min2 = this._modelMinRaw === "dataMin" ? dataMin : this._modelMinNum;
      var max2 = this._modelMaxRaw === "dataMax" ? dataMax : this._modelMaxNum;
      var minFixed = min2 != null;
      var maxFixed = max2 != null;
      if (min2 == null) {
        min2 = isOrdinal ? axisDataLen ? 0 : NaN : dataMin - boundaryGapInner[0] * span;
      }
      if (max2 == null) {
        max2 = isOrdinal ? axisDataLen ? axisDataLen - 1 : NaN : dataMax + boundaryGapInner[1] * span;
      }
      (min2 == null || !isFinite(min2)) && (min2 = NaN);
      (max2 == null || !isFinite(max2)) && (max2 = NaN);
      var isBlank = eqNaN(min2) || eqNaN(max2) || isOrdinal && !axisDataLen;
      if (this._needCrossZero) {
        if (min2 > 0 && max2 > 0 && !minFixed) {
          min2 = 0;
        }
        if (min2 < 0 && max2 < 0 && !maxFixed) {
          max2 = 0;
        }
      }
      var determinedMin = this._determinedMin;
      var determinedMax = this._determinedMax;
      if (determinedMin != null) {
        min2 = determinedMin;
        minFixed = true;
      }
      if (determinedMax != null) {
        max2 = determinedMax;
        maxFixed = true;
      }
      return {
        min: min2,
        max: max2,
        minFixed,
        maxFixed,
        isBlank
      };
    };
    ScaleRawExtentInfo2.prototype.modifyDataMinMax = function(minMaxName, val) {
      if (true) {
        assert(!this.frozen);
      }
      this[DATA_MIN_MAX_ATTR[minMaxName]] = val;
    };
    ScaleRawExtentInfo2.prototype.setDeterminedMinMax = function(minMaxName, val) {
      var attr = DETERMINED_MIN_MAX_ATTR[minMaxName];
      if (true) {
        assert(!this.frozen && this[attr] == null);
      }
      this[attr] = val;
    };
    ScaleRawExtentInfo2.prototype.freeze = function() {
      this.frozen = true;
    };
    return ScaleRawExtentInfo2;
  }()
);
var DETERMINED_MIN_MAX_ATTR = {
  min: "_determinedMin",
  max: "_determinedMax"
};
var DATA_MIN_MAX_ATTR = {
  min: "_dataMin",
  max: "_dataMax"
};
function ensureScaleRawExtentInfo(scale4, model, originalExtent) {
  var rawExtentInfo = scale4.rawExtentInfo;
  if (rawExtentInfo) {
    return rawExtentInfo;
  }
  rawExtentInfo = new ScaleRawExtentInfo(scale4, model, originalExtent);
  scale4.rawExtentInfo = rawExtentInfo;
  return rawExtentInfo;
}
function parseAxisModelMinMax(scale4, minMax) {
  return minMax == null ? null : eqNaN(minMax) ? NaN : scale4.parse(minMax);
}

// node_modules/echarts/lib/coord/axisHelper.js
function getScaleExtent(scale4, model) {
  var scaleType = scale4.type;
  var rawExtentResult = ensureScaleRawExtentInfo(scale4, model, scale4.getExtent()).calculate();
  scale4.setBlank(rawExtentResult.isBlank);
  var min2 = rawExtentResult.min;
  var max2 = rawExtentResult.max;
  var ecModel = model.ecModel;
  if (ecModel && scaleType === "time") {
    var barSeriesModels = prepareLayoutBarSeries("bar", ecModel);
    var isBaseAxisAndHasBarSeries_1 = false;
    each(barSeriesModels, function(seriesModel) {
      isBaseAxisAndHasBarSeries_1 = isBaseAxisAndHasBarSeries_1 || seriesModel.getBaseAxis() === model.axis;
    });
    if (isBaseAxisAndHasBarSeries_1) {
      var barWidthAndOffset = makeColumnLayout(barSeriesModels);
      var adjustedScale = adjustScaleForOverflow(min2, max2, model, barWidthAndOffset);
      min2 = adjustedScale.min;
      max2 = adjustedScale.max;
    }
  }
  return {
    extent: [min2, max2],
    // "fix" means "fixed", the value should not be
    // changed in the subsequent steps.
    fixMin: rawExtentResult.minFixed,
    fixMax: rawExtentResult.maxFixed
  };
}
function adjustScaleForOverflow(min2, max2, model, barWidthAndOffset) {
  var axisExtent = model.axis.getExtent();
  var axisLength = axisExtent[1] - axisExtent[0];
  var barsOnCurrentAxis = retrieveColumnLayout(barWidthAndOffset, model.axis);
  if (barsOnCurrentAxis === void 0) {
    return {
      min: min2,
      max: max2
    };
  }
  var minOverflow = Infinity;
  each(barsOnCurrentAxis, function(item) {
    minOverflow = Math.min(item.offset, minOverflow);
  });
  var maxOverflow = -Infinity;
  each(barsOnCurrentAxis, function(item) {
    maxOverflow = Math.max(item.offset + item.width, maxOverflow);
  });
  minOverflow = Math.abs(minOverflow);
  maxOverflow = Math.abs(maxOverflow);
  var totalOverFlow = minOverflow + maxOverflow;
  var oldRange = max2 - min2;
  var oldRangePercentOfNew = 1 - (minOverflow + maxOverflow) / axisLength;
  var overflowBuffer = oldRange / oldRangePercentOfNew - oldRange;
  max2 += overflowBuffer * (maxOverflow / totalOverFlow);
  min2 -= overflowBuffer * (minOverflow / totalOverFlow);
  return {
    min: min2,
    max: max2
  };
}
function niceScaleExtent(scale4, inModel) {
  var model = inModel;
  var extentInfo = getScaleExtent(scale4, model);
  var extent3 = extentInfo.extent;
  var splitNumber = model.get("splitNumber");
  if (scale4 instanceof Log_default) {
    scale4.base = model.get("logBase");
  }
  var scaleType = scale4.type;
  var interval = model.get("interval");
  var isIntervalOrTime = scaleType === "interval" || scaleType === "time";
  scale4.setExtent(extent3[0], extent3[1]);
  scale4.calcNiceExtent({
    splitNumber,
    fixMin: extentInfo.fixMin,
    fixMax: extentInfo.fixMax,
    minInterval: isIntervalOrTime ? model.get("minInterval") : null,
    maxInterval: isIntervalOrTime ? model.get("maxInterval") : null
  });
  if (interval != null) {
    scale4.setInterval && scale4.setInterval(interval);
  }
}
function createScaleByModel(model, axisType) {
  axisType = axisType || model.get("type");
  if (axisType) {
    switch (axisType) {
      case "category":
        return new Ordinal_default({
          ordinalMeta: model.getOrdinalMeta ? model.getOrdinalMeta() : model.getCategories(),
          extent: [Infinity, -Infinity]
        });
      case "time":
        return new Time_default({
          locale: model.ecModel.getLocaleModel(),
          useUTC: model.ecModel.get("useUTC")
        });
      default:
        return new (Scale_default.getClass(axisType) || Interval_default)();
    }
  }
}
function ifAxisCrossZero(axis) {
  var dataExtent = axis.scale.getExtent();
  var min2 = dataExtent[0];
  var max2 = dataExtent[1];
  return !(min2 > 0 && max2 > 0 || min2 < 0 && max2 < 0);
}
function makeLabelFormatter(axis) {
  var labelFormatter = axis.getLabelModel().get("formatter");
  var categoryTickStart = axis.type === "category" ? axis.scale.getExtent()[0] : null;
  if (axis.scale.type === "time") {
    return function(tpl) {
      return function(tick, idx) {
        return axis.scale.getFormattedLabel(tick, idx, tpl);
      };
    }(labelFormatter);
  } else if (isString(labelFormatter)) {
    return function(tpl) {
      return function(tick) {
        var label = axis.scale.getLabel(tick);
        var text = tpl.replace("{value}", label != null ? label : "");
        return text;
      };
    }(labelFormatter);
  } else if (isFunction(labelFormatter)) {
    return function(cb) {
      return function(tick, idx) {
        if (categoryTickStart != null) {
          idx = tick.value - categoryTickStart;
        }
        return cb(getAxisRawValue(axis, tick), idx, tick.level != null ? {
          level: tick.level
        } : null);
      };
    }(labelFormatter);
  } else {
    return function(tick) {
      return axis.scale.getLabel(tick);
    };
  }
}
function getAxisRawValue(axis, tick) {
  return axis.type === "category" ? axis.scale.getLabel(tick) : tick.value;
}
function estimateLabelUnionRect(axis) {
  var axisModel = axis.model;
  var scale4 = axis.scale;
  if (!axisModel.get(["axisLabel", "show"]) || scale4.isBlank()) {
    return;
  }
  var realNumberScaleTicks;
  var tickCount;
  var categoryScaleExtent = scale4.getExtent();
  if (scale4 instanceof Ordinal_default) {
    tickCount = scale4.count();
  } else {
    realNumberScaleTicks = scale4.getTicks();
    tickCount = realNumberScaleTicks.length;
  }
  var axisLabelModel = axis.getLabelModel();
  var labelFormatter = makeLabelFormatter(axis);
  var rect;
  var step = 1;
  if (tickCount > 40) {
    step = Math.ceil(tickCount / 40);
  }
  for (var i = 0; i < tickCount; i += step) {
    var tick = realNumberScaleTicks ? realNumberScaleTicks[i] : {
      value: categoryScaleExtent[0] + i
    };
    var label = labelFormatter(tick, i);
    var unrotatedSingleRect = axisLabelModel.getTextRect(label);
    var singleRect = rotateTextRect(unrotatedSingleRect, axisLabelModel.get("rotate") || 0);
    rect ? rect.union(singleRect) : rect = singleRect;
  }
  return rect;
}
function rotateTextRect(textRect, rotate2) {
  var rotateRadians = rotate2 * Math.PI / 180;
  var beforeWidth = textRect.width;
  var beforeHeight = textRect.height;
  var afterWidth = beforeWidth * Math.abs(Math.cos(rotateRadians)) + Math.abs(beforeHeight * Math.sin(rotateRadians));
  var afterHeight = beforeWidth * Math.abs(Math.sin(rotateRadians)) + Math.abs(beforeHeight * Math.cos(rotateRadians));
  var rotatedRect = new BoundingRect_default(textRect.x, textRect.y, afterWidth, afterHeight);
  return rotatedRect;
}
function getOptionCategoryInterval(model) {
  var interval = model.get("interval");
  return interval == null ? "auto" : interval;
}
function shouldShowAllLabels(axis) {
  return axis.type === "category" && getOptionCategoryInterval(axis.getLabelModel()) === 0;
}
function getDataDimensionsOnAxis(data, axisDim) {
  var dataDimMap = {};
  each(data.mapDimensionsAll(axisDim), function(dataDim) {
    dataDimMap[getStackedDimension(data, dataDim)] = true;
  });
  return keys(dataDimMap);
}
function unionAxisExtentFromData(dataExtent, data, axisDim) {
  if (data) {
    each(getDataDimensionsOnAxis(data, axisDim), function(dim) {
      var seriesExtent = data.getApproximateExtent(dim);
      seriesExtent[0] < dataExtent[0] && (dataExtent[0] = seriesExtent[0]);
      seriesExtent[1] > dataExtent[1] && (dataExtent[1] = seriesExtent[1]);
    });
  }
}

// node_modules/echarts/lib/coord/axisTickLabelBuilder.js
var inner6 = makeInner();
function createAxisLabels(axis) {
  return axis.type === "category" ? makeCategoryLabels(axis) : makeRealNumberLabels(axis);
}
function createAxisTicks(axis, tickModel) {
  return axis.type === "category" ? makeCategoryTicks(axis, tickModel) : {
    ticks: map(axis.scale.getTicks(), function(tick) {
      return tick.value;
    })
  };
}
function makeCategoryLabels(axis) {
  var labelModel = axis.getLabelModel();
  var result = makeCategoryLabelsActually(axis, labelModel);
  return !labelModel.get("show") || axis.scale.isBlank() ? {
    labels: [],
    labelCategoryInterval: result.labelCategoryInterval
  } : result;
}
function makeCategoryLabelsActually(axis, labelModel) {
  var labelsCache = getListCache(axis, "labels");
  var optionLabelInterval = getOptionCategoryInterval(labelModel);
  var result = listCacheGet(labelsCache, optionLabelInterval);
  if (result) {
    return result;
  }
  var labels;
  var numericLabelInterval;
  if (isFunction(optionLabelInterval)) {
    labels = makeLabelsByCustomizedCategoryInterval(axis, optionLabelInterval);
  } else {
    numericLabelInterval = optionLabelInterval === "auto" ? makeAutoCategoryInterval(axis) : optionLabelInterval;
    labels = makeLabelsByNumericCategoryInterval(axis, numericLabelInterval);
  }
  return listCacheSet(labelsCache, optionLabelInterval, {
    labels,
    labelCategoryInterval: numericLabelInterval
  });
}
function makeCategoryTicks(axis, tickModel) {
  var ticksCache = getListCache(axis, "ticks");
  var optionTickInterval = getOptionCategoryInterval(tickModel);
  var result = listCacheGet(ticksCache, optionTickInterval);
  if (result) {
    return result;
  }
  var ticks;
  var tickCategoryInterval;
  if (!tickModel.get("show") || axis.scale.isBlank()) {
    ticks = [];
  }
  if (isFunction(optionTickInterval)) {
    ticks = makeLabelsByCustomizedCategoryInterval(axis, optionTickInterval, true);
  } else if (optionTickInterval === "auto") {
    var labelsResult = makeCategoryLabelsActually(axis, axis.getLabelModel());
    tickCategoryInterval = labelsResult.labelCategoryInterval;
    ticks = map(labelsResult.labels, function(labelItem) {
      return labelItem.tickValue;
    });
  } else {
    tickCategoryInterval = optionTickInterval;
    ticks = makeLabelsByNumericCategoryInterval(axis, tickCategoryInterval, true);
  }
  return listCacheSet(ticksCache, optionTickInterval, {
    ticks,
    tickCategoryInterval
  });
}
function makeRealNumberLabels(axis) {
  var ticks = axis.scale.getTicks();
  var labelFormatter = makeLabelFormatter(axis);
  return {
    labels: map(ticks, function(tick, idx) {
      return {
        level: tick.level,
        formattedLabel: labelFormatter(tick, idx),
        rawLabel: axis.scale.getLabel(tick),
        tickValue: tick.value
      };
    })
  };
}
function getListCache(axis, prop) {
  return inner6(axis)[prop] || (inner6(axis)[prop] = []);
}
function listCacheGet(cache, key) {
  for (var i = 0; i < cache.length; i++) {
    if (cache[i].key === key) {
      return cache[i].value;
    }
  }
}
function listCacheSet(cache, key, value) {
  cache.push({
    key,
    value
  });
  return value;
}
function makeAutoCategoryInterval(axis) {
  var result = inner6(axis).autoInterval;
  return result != null ? result : inner6(axis).autoInterval = axis.calculateCategoryInterval();
}
function calculateCategoryInterval(axis) {
  var params = fetchAutoCategoryIntervalCalculationParams(axis);
  var labelFormatter = makeLabelFormatter(axis);
  var rotation = (params.axisRotate - params.labelRotate) / 180 * Math.PI;
  var ordinalScale = axis.scale;
  var ordinalExtent = ordinalScale.getExtent();
  var tickCount = ordinalScale.count();
  if (ordinalExtent[1] - ordinalExtent[0] < 1) {
    return 0;
  }
  var step = 1;
  if (tickCount > 40) {
    step = Math.max(1, Math.floor(tickCount / 40));
  }
  var tickValue = ordinalExtent[0];
  var unitSpan = axis.dataToCoord(tickValue + 1) - axis.dataToCoord(tickValue);
  var unitW = Math.abs(unitSpan * Math.cos(rotation));
  var unitH = Math.abs(unitSpan * Math.sin(rotation));
  var maxW = 0;
  var maxH = 0;
  for (; tickValue <= ordinalExtent[1]; tickValue += step) {
    var width = 0;
    var height = 0;
    var rect = getBoundingRect(labelFormatter({
      value: tickValue
    }), params.font, "center", "top");
    width = rect.width * 1.3;
    height = rect.height * 1.3;
    maxW = Math.max(maxW, width, 7);
    maxH = Math.max(maxH, height, 7);
  }
  var dw = maxW / unitW;
  var dh = maxH / unitH;
  isNaN(dw) && (dw = Infinity);
  isNaN(dh) && (dh = Infinity);
  var interval = Math.max(0, Math.floor(Math.min(dw, dh)));
  var cache = inner6(axis.model);
  var axisExtent = axis.getExtent();
  var lastAutoInterval = cache.lastAutoInterval;
  var lastTickCount = cache.lastTickCount;
  if (lastAutoInterval != null && lastTickCount != null && Math.abs(lastAutoInterval - interval) <= 1 && Math.abs(lastTickCount - tickCount) <= 1 && lastAutoInterval > interval && cache.axisExtent0 === axisExtent[0] && cache.axisExtent1 === axisExtent[1]) {
    interval = lastAutoInterval;
  } else {
    cache.lastTickCount = tickCount;
    cache.lastAutoInterval = interval;
    cache.axisExtent0 = axisExtent[0];
    cache.axisExtent1 = axisExtent[1];
  }
  return interval;
}
function fetchAutoCategoryIntervalCalculationParams(axis) {
  var labelModel = axis.getLabelModel();
  return {
    axisRotate: axis.getRotate ? axis.getRotate() : axis.isHorizontal && !axis.isHorizontal() ? 90 : 0,
    labelRotate: labelModel.get("rotate") || 0,
    font: labelModel.getFont()
  };
}
function makeLabelsByNumericCategoryInterval(axis, categoryInterval, onlyTick) {
  var labelFormatter = makeLabelFormatter(axis);
  var ordinalScale = axis.scale;
  var ordinalExtent = ordinalScale.getExtent();
  var labelModel = axis.getLabelModel();
  var result = [];
  var step = Math.max((categoryInterval || 0) + 1, 1);
  var startTick = ordinalExtent[0];
  var tickCount = ordinalScale.count();
  if (startTick !== 0 && step > 1 && tickCount / step > 2) {
    startTick = Math.round(Math.ceil(startTick / step) * step);
  }
  var showAllLabel = shouldShowAllLabels(axis);
  var includeMinLabel = labelModel.get("showMinLabel") || showAllLabel;
  var includeMaxLabel = labelModel.get("showMaxLabel") || showAllLabel;
  if (includeMinLabel && startTick !== ordinalExtent[0]) {
    addItem(ordinalExtent[0]);
  }
  var tickValue = startTick;
  for (; tickValue <= ordinalExtent[1]; tickValue += step) {
    addItem(tickValue);
  }
  if (includeMaxLabel && tickValue - step !== ordinalExtent[1]) {
    addItem(ordinalExtent[1]);
  }
  function addItem(tickValue2) {
    var tickObj = {
      value: tickValue2
    };
    result.push(onlyTick ? tickValue2 : {
      formattedLabel: labelFormatter(tickObj),
      rawLabel: ordinalScale.getLabel(tickObj),
      tickValue: tickValue2
    });
  }
  return result;
}
function makeLabelsByCustomizedCategoryInterval(axis, categoryInterval, onlyTick) {
  var ordinalScale = axis.scale;
  var labelFormatter = makeLabelFormatter(axis);
  var result = [];
  each(ordinalScale.getTicks(), function(tick) {
    var rawLabel = ordinalScale.getLabel(tick);
    var tickValue = tick.value;
    if (categoryInterval(tick.value, rawLabel)) {
      result.push(onlyTick ? tickValue : {
        formattedLabel: labelFormatter(tick),
        rawLabel,
        tickValue
      });
    }
  });
  return result;
}

// node_modules/echarts/lib/coord/Axis.js
var NORMALIZED_EXTENT = [0, 1];
var Axis = (
  /** @class */
  function() {
    function Axis2(dim, scale4, extent3) {
      this.onBand = false;
      this.inverse = false;
      this.dim = dim;
      this.scale = scale4;
      this._extent = extent3 || [0, 0];
    }
    Axis2.prototype.contain = function(coord) {
      var extent3 = this._extent;
      var min2 = Math.min(extent3[0], extent3[1]);
      var max2 = Math.max(extent3[0], extent3[1]);
      return coord >= min2 && coord <= max2;
    };
    Axis2.prototype.containData = function(data) {
      return this.scale.contain(data);
    };
    Axis2.prototype.getExtent = function() {
      return this._extent.slice();
    };
    Axis2.prototype.getPixelPrecision = function(dataExtent) {
      return getPixelPrecision(dataExtent || this.scale.getExtent(), this._extent);
    };
    Axis2.prototype.setExtent = function(start, end) {
      var extent3 = this._extent;
      extent3[0] = start;
      extent3[1] = end;
    };
    Axis2.prototype.dataToCoord = function(data, clamp2) {
      var extent3 = this._extent;
      var scale4 = this.scale;
      data = scale4.normalize(data);
      if (this.onBand && scale4.type === "ordinal") {
        extent3 = extent3.slice();
        fixExtentWithBands(extent3, scale4.count());
      }
      return linearMap(data, NORMALIZED_EXTENT, extent3, clamp2);
    };
    Axis2.prototype.coordToData = function(coord, clamp2) {
      var extent3 = this._extent;
      var scale4 = this.scale;
      if (this.onBand && scale4.type === "ordinal") {
        extent3 = extent3.slice();
        fixExtentWithBands(extent3, scale4.count());
      }
      var t = linearMap(coord, extent3, NORMALIZED_EXTENT, clamp2);
      return this.scale.scale(t);
    };
    Axis2.prototype.pointToData = function(point, clamp2) {
      return;
    };
    Axis2.prototype.getTicksCoords = function(opt) {
      opt = opt || {};
      var tickModel = opt.tickModel || this.getTickModel();
      var result = createAxisTicks(this, tickModel);
      var ticks = result.ticks;
      var ticksCoords = map(ticks, function(tickVal) {
        return {
          coord: this.dataToCoord(this.scale.type === "ordinal" ? this.scale.getRawOrdinalNumber(tickVal) : tickVal),
          tickValue: tickVal
        };
      }, this);
      var alignWithLabel = tickModel.get("alignWithLabel");
      fixOnBandTicksCoords(this, ticksCoords, alignWithLabel, opt.clamp);
      return ticksCoords;
    };
    Axis2.prototype.getMinorTicksCoords = function() {
      if (this.scale.type === "ordinal") {
        return [];
      }
      var minorTickModel = this.model.getModel("minorTick");
      var splitNumber = minorTickModel.get("splitNumber");
      if (!(splitNumber > 0 && splitNumber < 100)) {
        splitNumber = 5;
      }
      var minorTicks = this.scale.getMinorTicks(splitNumber);
      var minorTicksCoords = map(minorTicks, function(minorTicksGroup) {
        return map(minorTicksGroup, function(minorTick) {
          return {
            coord: this.dataToCoord(minorTick),
            tickValue: minorTick
          };
        }, this);
      }, this);
      return minorTicksCoords;
    };
    Axis2.prototype.getViewLabels = function() {
      return createAxisLabels(this).labels;
    };
    Axis2.prototype.getLabelModel = function() {
      return this.model.getModel("axisLabel");
    };
    Axis2.prototype.getTickModel = function() {
      return this.model.getModel("axisTick");
    };
    Axis2.prototype.getBandWidth = function() {
      var axisExtent = this._extent;
      var dataExtent = this.scale.getExtent();
      var len = dataExtent[1] - dataExtent[0] + (this.onBand ? 1 : 0);
      len === 0 && (len = 1);
      var size = Math.abs(axisExtent[1] - axisExtent[0]);
      return Math.abs(size) / len;
    };
    Axis2.prototype.calculateCategoryInterval = function() {
      return calculateCategoryInterval(this);
    };
    return Axis2;
  }()
);
function fixExtentWithBands(extent3, nTick) {
  var size = extent3[1] - extent3[0];
  var len = nTick;
  var margin = size / len / 2;
  extent3[0] += margin;
  extent3[1] -= margin;
}
function fixOnBandTicksCoords(axis, ticksCoords, alignWithLabel, clamp2) {
  var ticksLen = ticksCoords.length;
  if (!axis.onBand || alignWithLabel || !ticksLen) {
    return;
  }
  var axisExtent = axis.getExtent();
  var last;
  var diffSize;
  if (ticksLen === 1) {
    ticksCoords[0].coord = axisExtent[0];
    last = ticksCoords[1] = {
      coord: axisExtent[0]
    };
  } else {
    var crossLen = ticksCoords[ticksLen - 1].tickValue - ticksCoords[0].tickValue;
    var shift_1 = (ticksCoords[ticksLen - 1].coord - ticksCoords[0].coord) / crossLen;
    each(ticksCoords, function(ticksItem) {
      ticksItem.coord -= shift_1 / 2;
    });
    var dataExtent = axis.scale.getExtent();
    diffSize = 1 + dataExtent[1] - ticksCoords[ticksLen - 1].tickValue;
    last = {
      coord: ticksCoords[ticksLen - 1].coord + shift_1 * diffSize
    };
    ticksCoords.push(last);
  }
  var inverse = axisExtent[0] > axisExtent[1];
  if (littleThan2(ticksCoords[0].coord, axisExtent[0])) {
    clamp2 ? ticksCoords[0].coord = axisExtent[0] : ticksCoords.shift();
  }
  if (clamp2 && littleThan2(axisExtent[0], ticksCoords[0].coord)) {
    ticksCoords.unshift({
      coord: axisExtent[0]
    });
  }
  if (littleThan2(axisExtent[1], last.coord)) {
    clamp2 ? last.coord = axisExtent[1] : ticksCoords.pop();
  }
  if (clamp2 && littleThan2(last.coord, axisExtent[1])) {
    ticksCoords.push({
      coord: axisExtent[1]
    });
  }
  function littleThan2(a, b) {
    a = round(a);
    b = round(b);
    return inverse ? a > b : a < b;
  }
}
var Axis_default = Axis;

// node_modules/echarts/lib/coord/cartesian/GridModel.js
var GridModel = (
  /** @class */
  function(_super) {
    __extends(GridModel2, _super);
    function GridModel2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    GridModel2.type = "grid";
    GridModel2.dependencies = ["xAxis", "yAxis"];
    GridModel2.layoutMode = "box";
    GridModel2.defaultOption = {
      show: false,
      // zlevel: 0,
      z: 0,
      left: "10%",
      top: 60,
      right: "10%",
      bottom: 70,
      // If grid size contain label
      containLabel: false,
      // width: {totalWidth} - left - right,
      // height: {totalHeight} - top - bottom,
      backgroundColor: "rgba(0,0,0,0)",
      borderWidth: 1,
      borderColor: "#ccc"
    };
    return GridModel2;
  }(Component_default)
);
var GridModel_default = GridModel;

// node_modules/echarts/lib/coord/axisModelCommonMixin.js
var AxisModelCommonMixin = (
  /** @class */
  function() {
    function AxisModelCommonMixin2() {
    }
    AxisModelCommonMixin2.prototype.getNeedCrossZero = function() {
      var option = this.option;
      return !option.scale;
    };
    AxisModelCommonMixin2.prototype.getCoordSysModel = function() {
      return;
    };
    return AxisModelCommonMixin2;
  }()
);

// node_modules/echarts/lib/coord/cartesian/AxisModel.js
var CartesianAxisModel = (
  /** @class */
  function(_super) {
    __extends(CartesianAxisModel2, _super);
    function CartesianAxisModel2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    CartesianAxisModel2.prototype.getCoordSysModel = function() {
      return this.getReferringComponents("grid", SINGLE_REFERRING).models[0];
    };
    CartesianAxisModel2.type = "cartesian2dAxis";
    return CartesianAxisModel2;
  }(Component_default)
);
mixin(CartesianAxisModel, AxisModelCommonMixin);

// node_modules/echarts/lib/coord/axisDefault.js
var defaultOption = {
  show: true,
  // zlevel: 0,
  z: 0,
  // Inverse the axis.
  inverse: false,
  // Axis name displayed.
  name: "",
  // 'start' | 'middle' | 'end'
  nameLocation: "end",
  // By degree. By default auto rotate by nameLocation.
  nameRotate: null,
  nameTruncate: {
    maxWidth: null,
    ellipsis: "...",
    placeholder: "."
  },
  // Use global text style by default.
  nameTextStyle: {},
  // The gap between axisName and axisLine.
  nameGap: 15,
  // Default `false` to support tooltip.
  silent: false,
  // Default `false` to avoid legacy user event listener fail.
  triggerEvent: false,
  tooltip: {
    show: false
  },
  axisPointer: {},
  axisLine: {
    show: true,
    onZero: true,
    onZeroAxisIndex: null,
    lineStyle: {
      color: "#6E7079",
      width: 1,
      type: "solid"
    },
    // The arrow at both ends the the axis.
    symbol: ["none", "none"],
    symbolSize: [10, 15]
  },
  axisTick: {
    show: true,
    // Whether axisTick is inside the grid or outside the grid.
    inside: false,
    // The length of axisTick.
    length: 5,
    lineStyle: {
      width: 1
    }
  },
  axisLabel: {
    show: true,
    // Whether axisLabel is inside the grid or outside the grid.
    inside: false,
    rotate: 0,
    // true | false | null/undefined (auto)
    showMinLabel: null,
    // true | false | null/undefined (auto)
    showMaxLabel: null,
    margin: 8,
    // formatter: null,
    fontSize: 12
  },
  splitLine: {
    show: true,
    lineStyle: {
      color: ["#E0E6F1"],
      width: 1,
      type: "solid"
    }
  },
  splitArea: {
    show: false,
    areaStyle: {
      color: ["rgba(250,250,250,0.2)", "rgba(210,219,238,0.2)"]
    }
  }
};
var categoryAxis = merge({
  // The gap at both ends of the axis. For categoryAxis, boolean.
  boundaryGap: true,
  // Set false to faster category collection.
  deduplication: null,
  // splitArea: {
  // show: false
  // },
  splitLine: {
    show: false
  },
  axisTick: {
    // If tick is align with label when boundaryGap is true
    alignWithLabel: false,
    interval: "auto"
  },
  axisLabel: {
    interval: "auto"
  }
}, defaultOption);
var valueAxis = merge({
  boundaryGap: [0, 0],
  axisLine: {
    // Not shown when other axis is categoryAxis in cartesian
    show: "auto"
  },
  axisTick: {
    // Not shown when other axis is categoryAxis in cartesian
    show: "auto"
  },
  // TODO
  // min/max: [30, datamin, 60] or [20, datamin] or [datamin, 60]
  splitNumber: 5,
  minorTick: {
    // Minor tick, not available for cateogry axis.
    show: false,
    // Split number of minor ticks. The value should be in range of (0, 100)
    splitNumber: 5,
    // Length of minor tick
    length: 3,
    // Line style
    lineStyle: {
      // Default to be same with axisTick
    }
  },
  minorSplitLine: {
    show: false,
    lineStyle: {
      color: "#F4F7FD",
      width: 1
    }
  }
}, defaultOption);
var timeAxis = merge({
  splitNumber: 6,
  axisLabel: {
    // To eliminate labels that are not nice
    showMinLabel: false,
    showMaxLabel: false,
    rich: {
      primary: {
        fontWeight: "bold"
      }
    }
  },
  splitLine: {
    show: false
  }
}, valueAxis);
var logAxis = defaults({
  logBase: 10
}, valueAxis);
var axisDefault_default = {
  category: categoryAxis,
  value: valueAxis,
  time: timeAxis,
  log: logAxis
};

// node_modules/echarts/lib/coord/axisCommonTypes.js
var AXIS_TYPES = {
  value: 1,
  category: 1,
  time: 1,
  log: 1
};

// node_modules/echarts/lib/coord/axisModelCreator.js
function axisModelCreator(registers, axisName, BaseAxisModelClass, extraDefaultOption) {
  each(AXIS_TYPES, function(v, axisType) {
    var defaultOption2 = merge(merge({}, axisDefault_default[axisType], true), extraDefaultOption, true);
    var AxisModel = (
      /** @class */
      function(_super) {
        __extends(AxisModel2, _super);
        function AxisModel2() {
          var _this = _super !== null && _super.apply(this, arguments) || this;
          _this.type = axisName + "Axis." + axisType;
          return _this;
        }
        AxisModel2.prototype.mergeDefaultAndTheme = function(option, ecModel) {
          var layoutMode = fetchLayoutMode(this);
          var inputPositionParams = layoutMode ? getLayoutParams(option) : {};
          var themeModel = ecModel.getTheme();
          merge(option, themeModel.get(axisType + "Axis"));
          merge(option, this.getDefaultOption());
          option.type = getAxisType(option);
          if (layoutMode) {
            mergeLayoutParam(option, inputPositionParams, layoutMode);
          }
        };
        AxisModel2.prototype.optionUpdated = function() {
          var thisOption = this.option;
          if (thisOption.type === "category") {
            this.__ordinalMeta = OrdinalMeta_default.createByAxisModel(this);
          }
        };
        AxisModel2.prototype.getCategories = function(rawData) {
          var option = this.option;
          if (option.type === "category") {
            if (rawData) {
              return option.data;
            }
            return this.__ordinalMeta.categories;
          }
        };
        AxisModel2.prototype.getOrdinalMeta = function() {
          return this.__ordinalMeta;
        };
        AxisModel2.type = axisName + "Axis." + axisType;
        AxisModel2.defaultOption = defaultOption2;
        return AxisModel2;
      }(BaseAxisModelClass)
    );
    registers.registerComponentModel(AxisModel);
  });
  registers.registerSubTypeDefaulter(axisName + "Axis", getAxisType);
}
function getAxisType(option) {
  return option.type || (option.data ? "category" : "value");
}

// node_modules/echarts/lib/coord/cartesian/Cartesian.js
var Cartesian = (
  /** @class */
  function() {
    function Cartesian2(name) {
      this.type = "cartesian";
      this._dimList = [];
      this._axes = {};
      this.name = name || "";
    }
    Cartesian2.prototype.getAxis = function(dim) {
      return this._axes[dim];
    };
    Cartesian2.prototype.getAxes = function() {
      return map(this._dimList, function(dim) {
        return this._axes[dim];
      }, this);
    };
    Cartesian2.prototype.getAxesByScale = function(scaleType) {
      scaleType = scaleType.toLowerCase();
      return filter(this.getAxes(), function(axis) {
        return axis.scale.type === scaleType;
      });
    };
    Cartesian2.prototype.addAxis = function(axis) {
      var dim = axis.dim;
      this._axes[dim] = axis;
      this._dimList.push(dim);
    };
    return Cartesian2;
  }()
);
var Cartesian_default = Cartesian;

// node_modules/echarts/lib/coord/cartesian/Cartesian2D.js
var cartesian2DDimensions = ["x", "y"];
function canCalculateAffineTransform(scale4) {
  return scale4.type === "interval" || scale4.type === "time";
}
var Cartesian2D = (
  /** @class */
  function(_super) {
    __extends(Cartesian2D2, _super);
    function Cartesian2D2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = "cartesian2d";
      _this.dimensions = cartesian2DDimensions;
      return _this;
    }
    Cartesian2D2.prototype.calcAffineTransform = function() {
      this._transform = this._invTransform = null;
      var xAxisScale = this.getAxis("x").scale;
      var yAxisScale = this.getAxis("y").scale;
      if (!canCalculateAffineTransform(xAxisScale) || !canCalculateAffineTransform(yAxisScale)) {
        return;
      }
      var xScaleExtent = xAxisScale.getExtent();
      var yScaleExtent = yAxisScale.getExtent();
      var start = this.dataToPoint([xScaleExtent[0], yScaleExtent[0]]);
      var end = this.dataToPoint([xScaleExtent[1], yScaleExtent[1]]);
      var xScaleSpan = xScaleExtent[1] - xScaleExtent[0];
      var yScaleSpan = yScaleExtent[1] - yScaleExtent[0];
      if (!xScaleSpan || !yScaleSpan) {
        return;
      }
      var scaleX = (end[0] - start[0]) / xScaleSpan;
      var scaleY = (end[1] - start[1]) / yScaleSpan;
      var translateX = start[0] - xScaleExtent[0] * scaleX;
      var translateY = start[1] - yScaleExtent[0] * scaleY;
      var m2 = this._transform = [scaleX, 0, 0, scaleY, translateX, translateY];
      this._invTransform = invert([], m2);
    };
    Cartesian2D2.prototype.getBaseAxis = function() {
      return this.getAxesByScale("ordinal")[0] || this.getAxesByScale("time")[0] || this.getAxis("x");
    };
    Cartesian2D2.prototype.containPoint = function(point) {
      var axisX = this.getAxis("x");
      var axisY = this.getAxis("y");
      return axisX.contain(axisX.toLocalCoord(point[0])) && axisY.contain(axisY.toLocalCoord(point[1]));
    };
    Cartesian2D2.prototype.containData = function(data) {
      return this.getAxis("x").containData(data[0]) && this.getAxis("y").containData(data[1]);
    };
    Cartesian2D2.prototype.containZone = function(data1, data2) {
      var zoneDiag1 = this.dataToPoint(data1);
      var zoneDiag2 = this.dataToPoint(data2);
      var area = this.getArea();
      var zone = new BoundingRect_default(zoneDiag1[0], zoneDiag1[1], zoneDiag2[0] - zoneDiag1[0], zoneDiag2[1] - zoneDiag1[1]);
      return area.intersect(zone);
    };
    Cartesian2D2.prototype.dataToPoint = function(data, clamp2, out2) {
      out2 = out2 || [];
      var xVal = data[0];
      var yVal = data[1];
      if (this._transform && xVal != null && isFinite(xVal) && yVal != null && isFinite(yVal)) {
        return applyTransform(out2, data, this._transform);
      }
      var xAxis = this.getAxis("x");
      var yAxis = this.getAxis("y");
      out2[0] = xAxis.toGlobalCoord(xAxis.dataToCoord(xVal, clamp2));
      out2[1] = yAxis.toGlobalCoord(yAxis.dataToCoord(yVal, clamp2));
      return out2;
    };
    Cartesian2D2.prototype.clampData = function(data, out2) {
      var xScale = this.getAxis("x").scale;
      var yScale = this.getAxis("y").scale;
      var xAxisExtent = xScale.getExtent();
      var yAxisExtent = yScale.getExtent();
      var x = xScale.parse(data[0]);
      var y = yScale.parse(data[1]);
      out2 = out2 || [];
      out2[0] = Math.min(Math.max(Math.min(xAxisExtent[0], xAxisExtent[1]), x), Math.max(xAxisExtent[0], xAxisExtent[1]));
      out2[1] = Math.min(Math.max(Math.min(yAxisExtent[0], yAxisExtent[1]), y), Math.max(yAxisExtent[0], yAxisExtent[1]));
      return out2;
    };
    Cartesian2D2.prototype.pointToData = function(point, clamp2) {
      var out2 = [];
      if (this._invTransform) {
        return applyTransform(out2, point, this._invTransform);
      }
      var xAxis = this.getAxis("x");
      var yAxis = this.getAxis("y");
      out2[0] = xAxis.coordToData(xAxis.toLocalCoord(point[0]), clamp2);
      out2[1] = yAxis.coordToData(yAxis.toLocalCoord(point[1]), clamp2);
      return out2;
    };
    Cartesian2D2.prototype.getOtherAxis = function(axis) {
      return this.getAxis(axis.dim === "x" ? "y" : "x");
    };
    Cartesian2D2.prototype.getArea = function() {
      var xExtent = this.getAxis("x").getGlobalExtent();
      var yExtent = this.getAxis("y").getGlobalExtent();
      var x = Math.min(xExtent[0], xExtent[1]);
      var y = Math.min(yExtent[0], yExtent[1]);
      var width = Math.max(xExtent[0], xExtent[1]) - x;
      var height = Math.max(yExtent[0], yExtent[1]) - y;
      return new BoundingRect_default(x, y, width, height);
    };
    return Cartesian2D2;
  }(Cartesian_default)
);
var Cartesian2D_default = Cartesian2D;

// node_modules/echarts/lib/coord/cartesian/Axis2D.js
var Axis2D = (
  /** @class */
  function(_super) {
    __extends(Axis2D2, _super);
    function Axis2D2(dim, scale4, coordExtent, axisType, position) {
      var _this = _super.call(this, dim, scale4, coordExtent) || this;
      _this.index = 0;
      _this.type = axisType || "value";
      _this.position = position || "bottom";
      return _this;
    }
    Axis2D2.prototype.isHorizontal = function() {
      var position = this.position;
      return position === "top" || position === "bottom";
    };
    Axis2D2.prototype.getGlobalExtent = function(asc2) {
      var ret = this.getExtent();
      ret[0] = this.toGlobalCoord(ret[0]);
      ret[1] = this.toGlobalCoord(ret[1]);
      asc2 && ret[0] > ret[1] && ret.reverse();
      return ret;
    };
    Axis2D2.prototype.pointToData = function(point, clamp2) {
      return this.coordToData(this.toLocalCoord(point[this.dim === "x" ? 0 : 1]), clamp2);
    };
    Axis2D2.prototype.setCategorySortInfo = function(info) {
      if (this.type !== "category") {
        return false;
      }
      this.model.option.categorySortInfo = info;
      this.scale.setSortInfo(info);
    };
    return Axis2D2;
  }(Axis_default)
);
var Axis2D_default = Axis2D;

// node_modules/echarts/lib/coord/cartesian/cartesianAxisHelper.js
function layout2(gridModel, axisModel, opt) {
  opt = opt || {};
  var grid = gridModel.coordinateSystem;
  var axis = axisModel.axis;
  var layout3 = {};
  var otherAxisOnZeroOf = axis.getAxesOnZeroOf()[0];
  var rawAxisPosition = axis.position;
  var axisPosition = otherAxisOnZeroOf ? "onZero" : rawAxisPosition;
  var axisDim = axis.dim;
  var rect = grid.getRect();
  var rectBound = [rect.x, rect.x + rect.width, rect.y, rect.y + rect.height];
  var idx = {
    left: 0,
    right: 1,
    top: 0,
    bottom: 1,
    onZero: 2
  };
  var axisOffset = axisModel.get("offset") || 0;
  var posBound = axisDim === "x" ? [rectBound[2] - axisOffset, rectBound[3] + axisOffset] : [rectBound[0] - axisOffset, rectBound[1] + axisOffset];
  if (otherAxisOnZeroOf) {
    var onZeroCoord = otherAxisOnZeroOf.toGlobalCoord(otherAxisOnZeroOf.dataToCoord(0));
    posBound[idx.onZero] = Math.max(Math.min(onZeroCoord, posBound[1]), posBound[0]);
  }
  layout3.position = [axisDim === "y" ? posBound[idx[axisPosition]] : rectBound[0], axisDim === "x" ? posBound[idx[axisPosition]] : rectBound[3]];
  layout3.rotation = Math.PI / 2 * (axisDim === "x" ? 0 : 1);
  var dirMap = {
    top: -1,
    bottom: 1,
    left: -1,
    right: 1
  };
  layout3.labelDirection = layout3.tickDirection = layout3.nameDirection = dirMap[rawAxisPosition];
  layout3.labelOffset = otherAxisOnZeroOf ? posBound[idx[rawAxisPosition]] - posBound[idx.onZero] : 0;
  if (axisModel.get(["axisTick", "inside"])) {
    layout3.tickDirection = -layout3.tickDirection;
  }
  if (retrieve(opt.labelInside, axisModel.get(["axisLabel", "inside"]))) {
    layout3.labelDirection = -layout3.labelDirection;
  }
  var labelRotate = axisModel.get(["axisLabel", "rotate"]);
  layout3.labelRotate = axisPosition === "top" ? -labelRotate : labelRotate;
  layout3.z2 = 1;
  return layout3;
}
function isCartesian2DSeries(seriesModel) {
  return seriesModel.get("coordinateSystem") === "cartesian2d";
}
function findAxisModels(seriesModel) {
  var axisModelMap = {
    xAxisModel: null,
    yAxisModel: null
  };
  each(axisModelMap, function(v, key) {
    var axisType = key.replace(/Model$/, "");
    var axisModel = seriesModel.getReferringComponents(axisType, SINGLE_REFERRING).models[0];
    if (true) {
      if (!axisModel) {
        throw new Error(axisType + ' "' + retrieve3(seriesModel.get(axisType + "Index"), seriesModel.get(axisType + "Id"), 0) + '" not found');
      }
    }
    axisModelMap[key] = axisModel;
  });
  return axisModelMap;
}

// node_modules/echarts/lib/coord/axisAlignTicks.js
var mathLog2 = Math.log;
function alignScaleTicks(scale4, axisModel, alignToScale) {
  var intervalScaleProto2 = Interval_default.prototype;
  var alignToTicks = intervalScaleProto2.getTicks.call(alignToScale);
  var alignToNicedTicks = intervalScaleProto2.getTicks.call(alignToScale, true);
  var alignToSplitNumber = alignToTicks.length - 1;
  var alignToInterval = intervalScaleProto2.getInterval.call(alignToScale);
  var scaleExtent = getScaleExtent(scale4, axisModel);
  var rawExtent = scaleExtent.extent;
  var isMinFixed = scaleExtent.fixMin;
  var isMaxFixed = scaleExtent.fixMax;
  if (scale4.type === "log") {
    var logBase = mathLog2(scale4.base);
    rawExtent = [mathLog2(rawExtent[0]) / logBase, mathLog2(rawExtent[1]) / logBase];
  }
  scale4.setExtent(rawExtent[0], rawExtent[1]);
  scale4.calcNiceExtent({
    splitNumber: alignToSplitNumber,
    fixMin: isMinFixed,
    fixMax: isMaxFixed
  });
  var extent3 = intervalScaleProto2.getExtent.call(scale4);
  if (isMinFixed) {
    rawExtent[0] = extent3[0];
  }
  if (isMaxFixed) {
    rawExtent[1] = extent3[1];
  }
  var interval = intervalScaleProto2.getInterval.call(scale4);
  var min2 = rawExtent[0];
  var max2 = rawExtent[1];
  if (isMinFixed && isMaxFixed) {
    interval = (max2 - min2) / alignToSplitNumber;
  } else if (isMinFixed) {
    max2 = rawExtent[0] + interval * alignToSplitNumber;
    while (max2 < rawExtent[1] && isFinite(max2) && isFinite(rawExtent[1])) {
      interval = increaseInterval(interval);
      max2 = rawExtent[0] + interval * alignToSplitNumber;
    }
  } else if (isMaxFixed) {
    min2 = rawExtent[1] - interval * alignToSplitNumber;
    while (min2 > rawExtent[0] && isFinite(min2) && isFinite(rawExtent[0])) {
      interval = increaseInterval(interval);
      min2 = rawExtent[1] - interval * alignToSplitNumber;
    }
  } else {
    var nicedSplitNumber = scale4.getTicks().length - 1;
    if (nicedSplitNumber > alignToSplitNumber) {
      interval = increaseInterval(interval);
    }
    var range = interval * alignToSplitNumber;
    max2 = Math.ceil(rawExtent[1] / interval) * interval;
    min2 = round(max2 - range);
    if (min2 < 0 && rawExtent[0] >= 0) {
      min2 = 0;
      max2 = round(range);
    } else if (max2 > 0 && rawExtent[1] <= 0) {
      max2 = 0;
      min2 = -round(range);
    }
  }
  var t0 = (alignToTicks[0].value - alignToNicedTicks[0].value) / alignToInterval;
  var t1 = (alignToTicks[alignToSplitNumber].value - alignToNicedTicks[alignToSplitNumber].value) / alignToInterval;
  intervalScaleProto2.setExtent.call(scale4, min2 + interval * t0, max2 + interval * t1);
  intervalScaleProto2.setInterval.call(scale4, interval);
  if (t0 || t1) {
    intervalScaleProto2.setNiceExtent.call(scale4, min2 + interval, max2 - interval);
  }
  if (true) {
    var ticks = intervalScaleProto2.getTicks.call(scale4);
    if (ticks[1] && (!isValueNice(interval) || getPrecisionSafe(ticks[1].value) > getPrecisionSafe(interval))) {
      warn(
        // eslint-disable-next-line
        "The ticks may be not readable when set min: " + axisModel.get("min") + ", max: " + axisModel.get("max") + " and alignTicks: true"
      );
    }
  }
}

// node_modules/echarts/lib/coord/cartesian/Grid.js
var Grid = (
  /** @class */
  function() {
    function Grid2(gridModel, ecModel, api) {
      this.type = "grid";
      this._coordsMap = {};
      this._coordsList = [];
      this._axesMap = {};
      this._axesList = [];
      this.axisPointerEnabled = true;
      this.dimensions = cartesian2DDimensions;
      this._initCartesian(gridModel, ecModel, api);
      this.model = gridModel;
    }
    Grid2.prototype.getRect = function() {
      return this._rect;
    };
    Grid2.prototype.update = function(ecModel, api) {
      var axesMap = this._axesMap;
      this._updateScale(ecModel, this.model);
      function updateAxisTicks(axes) {
        var alignTo;
        var axesIndices = keys(axes);
        var len = axesIndices.length;
        if (!len) {
          return;
        }
        var axisNeedsAlign = [];
        for (var i = len - 1; i >= 0; i--) {
          var idx = +axesIndices[i];
          var axis = axes[idx];
          var model = axis.model;
          var scale4 = axis.scale;
          if (
            // Only value and log axis without interval support alignTicks.
            isIntervalOrLogScale(scale4) && model.get("alignTicks") && model.get("interval") == null
          ) {
            axisNeedsAlign.push(axis);
          } else {
            niceScaleExtent(scale4, model);
            if (isIntervalOrLogScale(scale4)) {
              alignTo = axis;
            }
          }
        }
        ;
        if (axisNeedsAlign.length) {
          if (!alignTo) {
            alignTo = axisNeedsAlign.pop();
            niceScaleExtent(alignTo.scale, alignTo.model);
          }
          each(axisNeedsAlign, function(axis2) {
            alignScaleTicks(axis2.scale, axis2.model, alignTo.scale);
          });
        }
      }
      updateAxisTicks(axesMap.x);
      updateAxisTicks(axesMap.y);
      var onZeroRecords = {};
      each(axesMap.x, function(xAxis) {
        fixAxisOnZero(axesMap, "y", xAxis, onZeroRecords);
      });
      each(axesMap.y, function(yAxis) {
        fixAxisOnZero(axesMap, "x", yAxis, onZeroRecords);
      });
      this.resize(this.model, api);
    };
    Grid2.prototype.resize = function(gridModel, api, ignoreContainLabel) {
      var boxLayoutParams = gridModel.getBoxLayoutParams();
      var isContainLabel = !ignoreContainLabel && gridModel.get("containLabel");
      var gridRect = getLayoutRect(boxLayoutParams, {
        width: api.getWidth(),
        height: api.getHeight()
      });
      this._rect = gridRect;
      var axesList = this._axesList;
      adjustAxes();
      if (isContainLabel) {
        each(axesList, function(axis) {
          if (!axis.model.get(["axisLabel", "inside"])) {
            var labelUnionRect = estimateLabelUnionRect(axis);
            if (labelUnionRect) {
              var dim = axis.isHorizontal() ? "height" : "width";
              var margin = axis.model.get(["axisLabel", "margin"]);
              gridRect[dim] -= labelUnionRect[dim] + margin;
              if (axis.position === "top") {
                gridRect.y += labelUnionRect.height + margin;
              } else if (axis.position === "left") {
                gridRect.x += labelUnionRect.width + margin;
              }
            }
          }
        });
        adjustAxes();
      }
      each(this._coordsList, function(coord) {
        coord.calcAffineTransform();
      });
      function adjustAxes() {
        each(axesList, function(axis) {
          var isHorizontal = axis.isHorizontal();
          var extent3 = isHorizontal ? [0, gridRect.width] : [0, gridRect.height];
          var idx = axis.inverse ? 1 : 0;
          axis.setExtent(extent3[idx], extent3[1 - idx]);
          updateAxisTransform(axis, isHorizontal ? gridRect.x : gridRect.y);
        });
      }
    };
    Grid2.prototype.getAxis = function(dim, axisIndex) {
      var axesMapOnDim = this._axesMap[dim];
      if (axesMapOnDim != null) {
        return axesMapOnDim[axisIndex || 0];
      }
    };
    Grid2.prototype.getAxes = function() {
      return this._axesList.slice();
    };
    Grid2.prototype.getCartesian = function(xAxisIndex, yAxisIndex) {
      if (xAxisIndex != null && yAxisIndex != null) {
        var key = "x" + xAxisIndex + "y" + yAxisIndex;
        return this._coordsMap[key];
      }
      if (isObject(xAxisIndex)) {
        yAxisIndex = xAxisIndex.yAxisIndex;
        xAxisIndex = xAxisIndex.xAxisIndex;
      }
      for (var i = 0, coordList = this._coordsList; i < coordList.length; i++) {
        if (coordList[i].getAxis("x").index === xAxisIndex || coordList[i].getAxis("y").index === yAxisIndex) {
          return coordList[i];
        }
      }
    };
    Grid2.prototype.getCartesians = function() {
      return this._coordsList.slice();
    };
    Grid2.prototype.convertToPixel = function(ecModel, finder, value) {
      var target = this._findConvertTarget(finder);
      return target.cartesian ? target.cartesian.dataToPoint(value) : target.axis ? target.axis.toGlobalCoord(target.axis.dataToCoord(value)) : null;
    };
    Grid2.prototype.convertFromPixel = function(ecModel, finder, value) {
      var target = this._findConvertTarget(finder);
      return target.cartesian ? target.cartesian.pointToData(value) : target.axis ? target.axis.coordToData(target.axis.toLocalCoord(value)) : null;
    };
    Grid2.prototype._findConvertTarget = function(finder) {
      var seriesModel = finder.seriesModel;
      var xAxisModel = finder.xAxisModel || seriesModel && seriesModel.getReferringComponents("xAxis", SINGLE_REFERRING).models[0];
      var yAxisModel = finder.yAxisModel || seriesModel && seriesModel.getReferringComponents("yAxis", SINGLE_REFERRING).models[0];
      var gridModel = finder.gridModel;
      var coordsList = this._coordsList;
      var cartesian;
      var axis;
      if (seriesModel) {
        cartesian = seriesModel.coordinateSystem;
        indexOf(coordsList, cartesian) < 0 && (cartesian = null);
      } else if (xAxisModel && yAxisModel) {
        cartesian = this.getCartesian(xAxisModel.componentIndex, yAxisModel.componentIndex);
      } else if (xAxisModel) {
        axis = this.getAxis("x", xAxisModel.componentIndex);
      } else if (yAxisModel) {
        axis = this.getAxis("y", yAxisModel.componentIndex);
      } else if (gridModel) {
        var grid = gridModel.coordinateSystem;
        if (grid === this) {
          cartesian = this._coordsList[0];
        }
      }
      return {
        cartesian,
        axis
      };
    };
    Grid2.prototype.containPoint = function(point) {
      var coord = this._coordsList[0];
      if (coord) {
        return coord.containPoint(point);
      }
    };
    Grid2.prototype._initCartesian = function(gridModel, ecModel, api) {
      var _this = this;
      var grid = this;
      var axisPositionUsed = {
        left: false,
        right: false,
        top: false,
        bottom: false
      };
      var axesMap = {
        x: {},
        y: {}
      };
      var axesCount = {
        x: 0,
        y: 0
      };
      ecModel.eachComponent("xAxis", createAxisCreator("x"), this);
      ecModel.eachComponent("yAxis", createAxisCreator("y"), this);
      if (!axesCount.x || !axesCount.y) {
        this._axesMap = {};
        this._axesList = [];
        return;
      }
      this._axesMap = axesMap;
      each(axesMap.x, function(xAxis, xAxisIndex) {
        each(axesMap.y, function(yAxis, yAxisIndex) {
          var key = "x" + xAxisIndex + "y" + yAxisIndex;
          var cartesian = new Cartesian2D_default(key);
          cartesian.master = _this;
          cartesian.model = gridModel;
          _this._coordsMap[key] = cartesian;
          _this._coordsList.push(cartesian);
          cartesian.addAxis(xAxis);
          cartesian.addAxis(yAxis);
        });
      });
      function createAxisCreator(dimName) {
        return function(axisModel, idx) {
          if (!isAxisUsedInTheGrid(axisModel, gridModel)) {
            return;
          }
          var axisPosition = axisModel.get("position");
          if (dimName === "x") {
            if (axisPosition !== "top" && axisPosition !== "bottom") {
              axisPosition = axisPositionUsed.bottom ? "top" : "bottom";
            }
          } else {
            if (axisPosition !== "left" && axisPosition !== "right") {
              axisPosition = axisPositionUsed.left ? "right" : "left";
            }
          }
          axisPositionUsed[axisPosition] = true;
          var axis = new Axis2D_default(dimName, createScaleByModel(axisModel), [0, 0], axisModel.get("type"), axisPosition);
          var isCategory = axis.type === "category";
          axis.onBand = isCategory && axisModel.get("boundaryGap");
          axis.inverse = axisModel.get("inverse");
          axisModel.axis = axis;
          axis.model = axisModel;
          axis.grid = grid;
          axis.index = idx;
          grid._axesList.push(axis);
          axesMap[dimName][idx] = axis;
          axesCount[dimName]++;
        };
      }
    };
    Grid2.prototype._updateScale = function(ecModel, gridModel) {
      each(this._axesList, function(axis) {
        axis.scale.setExtent(Infinity, -Infinity);
        if (axis.type === "category") {
          var categorySortInfo = axis.model.get("categorySortInfo");
          axis.scale.setSortInfo(categorySortInfo);
        }
      });
      ecModel.eachSeries(function(seriesModel) {
        if (isCartesian2DSeries(seriesModel)) {
          var axesModelMap = findAxisModels(seriesModel);
          var xAxisModel = axesModelMap.xAxisModel;
          var yAxisModel = axesModelMap.yAxisModel;
          if (!isAxisUsedInTheGrid(xAxisModel, gridModel) || !isAxisUsedInTheGrid(yAxisModel, gridModel)) {
            return;
          }
          var cartesian = this.getCartesian(xAxisModel.componentIndex, yAxisModel.componentIndex);
          var data = seriesModel.getData();
          var xAxis = cartesian.getAxis("x");
          var yAxis = cartesian.getAxis("y");
          unionExtent(data, xAxis);
          unionExtent(data, yAxis);
        }
      }, this);
      function unionExtent(data, axis) {
        each(getDataDimensionsOnAxis(data, axis.dim), function(dim) {
          axis.scale.unionExtentFromData(data, dim);
        });
      }
    };
    Grid2.prototype.getTooltipAxes = function(dim) {
      var baseAxes = [];
      var otherAxes = [];
      each(this.getCartesians(), function(cartesian) {
        var baseAxis = dim != null && dim !== "auto" ? cartesian.getAxis(dim) : cartesian.getBaseAxis();
        var otherAxis = cartesian.getOtherAxis(baseAxis);
        indexOf(baseAxes, baseAxis) < 0 && baseAxes.push(baseAxis);
        indexOf(otherAxes, otherAxis) < 0 && otherAxes.push(otherAxis);
      });
      return {
        baseAxes,
        otherAxes
      };
    };
    Grid2.create = function(ecModel, api) {
      var grids = [];
      ecModel.eachComponent("grid", function(gridModel, idx) {
        var grid = new Grid2(gridModel, ecModel, api);
        grid.name = "grid_" + idx;
        grid.resize(gridModel, api, true);
        gridModel.coordinateSystem = grid;
        grids.push(grid);
      });
      ecModel.eachSeries(function(seriesModel) {
        if (!isCartesian2DSeries(seriesModel)) {
          return;
        }
        var axesModelMap = findAxisModels(seriesModel);
        var xAxisModel = axesModelMap.xAxisModel;
        var yAxisModel = axesModelMap.yAxisModel;
        var gridModel = xAxisModel.getCoordSysModel();
        if (true) {
          if (!gridModel) {
            throw new Error('Grid "' + retrieve3(xAxisModel.get("gridIndex"), xAxisModel.get("gridId"), 0) + '" not found');
          }
          if (xAxisModel.getCoordSysModel() !== yAxisModel.getCoordSysModel()) {
            throw new Error("xAxis and yAxis must use the same grid");
          }
        }
        var grid = gridModel.coordinateSystem;
        seriesModel.coordinateSystem = grid.getCartesian(xAxisModel.componentIndex, yAxisModel.componentIndex);
      });
      return grids;
    };
    Grid2.dimensions = cartesian2DDimensions;
    return Grid2;
  }()
);
function isAxisUsedInTheGrid(axisModel, gridModel) {
  return axisModel.getCoordSysModel() === gridModel;
}
function fixAxisOnZero(axesMap, otherAxisDim, axis, onZeroRecords) {
  axis.getAxesOnZeroOf = function() {
    return otherAxisOnZeroOf ? [otherAxisOnZeroOf] : [];
  };
  var otherAxes = axesMap[otherAxisDim];
  var otherAxisOnZeroOf;
  var axisModel = axis.model;
  var onZero = axisModel.get(["axisLine", "onZero"]);
  var onZeroAxisIndex = axisModel.get(["axisLine", "onZeroAxisIndex"]);
  if (!onZero) {
    return;
  }
  if (onZeroAxisIndex != null) {
    if (canOnZeroToAxis(otherAxes[onZeroAxisIndex])) {
      otherAxisOnZeroOf = otherAxes[onZeroAxisIndex];
    }
  } else {
    for (var idx in otherAxes) {
      if (otherAxes.hasOwnProperty(idx) && canOnZeroToAxis(otherAxes[idx]) && !onZeroRecords[getOnZeroRecordKey(otherAxes[idx])]) {
        otherAxisOnZeroOf = otherAxes[idx];
        break;
      }
    }
  }
  if (otherAxisOnZeroOf) {
    onZeroRecords[getOnZeroRecordKey(otherAxisOnZeroOf)] = true;
  }
  function getOnZeroRecordKey(axis2) {
    return axis2.dim + "_" + axis2.index;
  }
}
function canOnZeroToAxis(axis) {
  return axis && axis.type !== "category" && axis.type !== "time" && ifAxisCrossZero(axis);
}
function updateAxisTransform(axis, coordBase) {
  var axisExtent = axis.getExtent();
  var axisExtentSum = axisExtent[0] + axisExtent[1];
  axis.toGlobalCoord = axis.dim === "x" ? function(coord) {
    return coord + coordBase;
  } : function(coord) {
    return axisExtentSum - coord + coordBase;
  };
  axis.toLocalCoord = axis.dim === "x" ? function(coord) {
    return coord - coordBase;
  } : function(coord) {
    return axisExtentSum - coord + coordBase;
  };
}
var Grid_default = Grid;

// node_modules/echarts/lib/label/labelLayoutHelper.js
function prepareLayoutList(input) {
  var list = [];
  for (var i = 0; i < input.length; i++) {
    var rawItem = input[i];
    if (rawItem.defaultAttr.ignore) {
      continue;
    }
    var label = rawItem.label;
    var transform = label.getComputedTransform();
    var localRect = label.getBoundingRect();
    var isAxisAligned = !transform || transform[1] < 1e-5 && transform[2] < 1e-5;
    var minMargin = label.style.margin || 0;
    var globalRect = localRect.clone();
    globalRect.applyTransform(transform);
    globalRect.x -= minMargin / 2;
    globalRect.y -= minMargin / 2;
    globalRect.width += minMargin;
    globalRect.height += minMargin;
    var obb = isAxisAligned ? new OrientedBoundingRect_default(localRect, transform) : null;
    list.push({
      label,
      labelLine: rawItem.labelLine,
      rect: globalRect,
      localRect,
      obb,
      priority: rawItem.priority,
      defaultAttr: rawItem.defaultAttr,
      layoutOption: rawItem.computedLayoutOption,
      axisAligned: isAxisAligned,
      transform
    });
  }
  return list;
}
function shiftLayout(list, xyDim, sizeDim, minBound, maxBound, balanceShift) {
  var len = list.length;
  if (len < 2) {
    return;
  }
  list.sort(function(a, b) {
    return a.rect[xyDim] - b.rect[xyDim];
  });
  var lastPos = 0;
  var delta;
  var adjusted = false;
  var shifts = [];
  var totalShifts = 0;
  for (var i = 0; i < len; i++) {
    var item = list[i];
    var rect = item.rect;
    delta = rect[xyDim] - lastPos;
    if (delta < 0) {
      rect[xyDim] -= delta;
      item.label[xyDim] -= delta;
      adjusted = true;
    }
    var shift = Math.max(-delta, 0);
    shifts.push(shift);
    totalShifts += shift;
    lastPos = rect[xyDim] + rect[sizeDim];
  }
  if (totalShifts > 0 && balanceShift) {
    shiftList(-totalShifts / len, 0, len);
  }
  var first = list[0];
  var last = list[len - 1];
  var minGap;
  var maxGap;
  updateMinMaxGap();
  minGap < 0 && squeezeGaps(-minGap, 0.8);
  maxGap < 0 && squeezeGaps(maxGap, 0.8);
  updateMinMaxGap();
  takeBoundsGap(minGap, maxGap, 1);
  takeBoundsGap(maxGap, minGap, -1);
  updateMinMaxGap();
  if (minGap < 0) {
    squeezeWhenBailout(-minGap);
  }
  if (maxGap < 0) {
    squeezeWhenBailout(maxGap);
  }
  function updateMinMaxGap() {
    minGap = first.rect[xyDim] - minBound;
    maxGap = maxBound - last.rect[xyDim] - last.rect[sizeDim];
  }
  function takeBoundsGap(gapThisBound, gapOtherBound, moveDir) {
    if (gapThisBound < 0) {
      var moveFromMaxGap = Math.min(gapOtherBound, -gapThisBound);
      if (moveFromMaxGap > 0) {
        shiftList(moveFromMaxGap * moveDir, 0, len);
        var remained = moveFromMaxGap + gapThisBound;
        if (remained < 0) {
          squeezeGaps(-remained * moveDir, 1);
        }
      } else {
        squeezeGaps(-gapThisBound * moveDir, 1);
      }
    }
  }
  function shiftList(delta2, start, end) {
    if (delta2 !== 0) {
      adjusted = true;
    }
    for (var i2 = start; i2 < end; i2++) {
      var item2 = list[i2];
      var rect2 = item2.rect;
      rect2[xyDim] += delta2;
      item2.label[xyDim] += delta2;
    }
  }
  function squeezeGaps(delta2, maxSqeezePercent) {
    var gaps = [];
    var totalGaps = 0;
    for (var i2 = 1; i2 < len; i2++) {
      var prevItemRect = list[i2 - 1].rect;
      var gap = Math.max(list[i2].rect[xyDim] - prevItemRect[xyDim] - prevItemRect[sizeDim], 0);
      gaps.push(gap);
      totalGaps += gap;
    }
    if (!totalGaps) {
      return;
    }
    var squeezePercent = Math.min(Math.abs(delta2) / totalGaps, maxSqeezePercent);
    if (delta2 > 0) {
      for (var i2 = 0; i2 < len - 1; i2++) {
        var movement = gaps[i2] * squeezePercent;
        shiftList(movement, 0, i2 + 1);
      }
    } else {
      for (var i2 = len - 1; i2 > 0; i2--) {
        var movement = gaps[i2 - 1] * squeezePercent;
        shiftList(-movement, i2, len);
      }
    }
  }
  function squeezeWhenBailout(delta2) {
    var dir = delta2 < 0 ? -1 : 1;
    delta2 = Math.abs(delta2);
    var moveForEachLabel = Math.ceil(delta2 / (len - 1));
    for (var i2 = 0; i2 < len - 1; i2++) {
      if (dir > 0) {
        shiftList(moveForEachLabel, 0, i2 + 1);
      } else {
        shiftList(-moveForEachLabel, len - i2 - 1, len);
      }
      delta2 -= moveForEachLabel;
      if (delta2 <= 0) {
        return;
      }
    }
  }
  return adjusted;
}
function shiftLayoutOnX(list, leftBound, rightBound, balanceShift) {
  return shiftLayout(list, "x", "width", leftBound, rightBound, balanceShift);
}
function shiftLayoutOnY(list, topBound, bottomBound, balanceShift) {
  return shiftLayout(list, "y", "height", topBound, bottomBound, balanceShift);
}
function hideOverlap(labelList) {
  var displayedLabels = [];
  labelList.sort(function(a, b) {
    return b.priority - a.priority;
  });
  var globalRect = new BoundingRect_default(0, 0, 0, 0);
  function hideEl(el) {
    if (!el.ignore) {
      var emphasisState = el.ensureState("emphasis");
      if (emphasisState.ignore == null) {
        emphasisState.ignore = false;
      }
    }
    el.ignore = true;
  }
  for (var i = 0; i < labelList.length; i++) {
    var labelItem = labelList[i];
    var isAxisAligned = labelItem.axisAligned;
    var localRect = labelItem.localRect;
    var transform = labelItem.transform;
    var label = labelItem.label;
    var labelLine = labelItem.labelLine;
    globalRect.copy(labelItem.rect);
    globalRect.width -= 0.1;
    globalRect.height -= 0.1;
    globalRect.x += 0.05;
    globalRect.y += 0.05;
    var obb = labelItem.obb;
    var overlapped = false;
    for (var j = 0; j < displayedLabels.length; j++) {
      var existsTextCfg = displayedLabels[j];
      if (!globalRect.intersect(existsTextCfg.rect)) {
        continue;
      }
      if (isAxisAligned && existsTextCfg.axisAligned) {
        overlapped = true;
        break;
      }
      if (!existsTextCfg.obb) {
        existsTextCfg.obb = new OrientedBoundingRect_default(existsTextCfg.localRect, existsTextCfg.transform);
      }
      if (!obb) {
        obb = new OrientedBoundingRect_default(localRect, transform);
      }
      if (obb.intersect(existsTextCfg.obb)) {
        overlapped = true;
        break;
      }
    }
    if (overlapped) {
      hideEl(label);
      labelLine && hideEl(labelLine);
    } else {
      label.attr("ignore", labelItem.defaultAttr.ignore);
      labelLine && labelLine.attr("ignore", labelItem.defaultAttr.labelGuideIgnore);
      displayedLabels.push(labelItem);
    }
  }
}

// node_modules/echarts/lib/component/axis/AxisBuilder.js
var PI4 = Math.PI;
var AxisBuilder = (
  /** @class */
  function() {
    function AxisBuilder2(axisModel, opt) {
      this.group = new Group_default();
      this.opt = opt;
      this.axisModel = axisModel;
      defaults(opt, {
        labelOffset: 0,
        nameDirection: 1,
        tickDirection: 1,
        labelDirection: 1,
        silent: true,
        handleAutoShown: function() {
          return true;
        }
      });
      var transformGroup = new Group_default({
        x: opt.position[0],
        y: opt.position[1],
        rotation: opt.rotation
      });
      transformGroup.updateTransform();
      this._transformGroup = transformGroup;
    }
    AxisBuilder2.prototype.hasBuilder = function(name) {
      return !!builders[name];
    };
    AxisBuilder2.prototype.add = function(name) {
      builders[name](this.opt, this.axisModel, this.group, this._transformGroup);
    };
    AxisBuilder2.prototype.getGroup = function() {
      return this.group;
    };
    AxisBuilder2.innerTextLayout = function(axisRotation, textRotation, direction) {
      var rotationDiff = remRadian(textRotation - axisRotation);
      var textAlign;
      var textVerticalAlign;
      if (isRadianAroundZero(rotationDiff)) {
        textVerticalAlign = direction > 0 ? "top" : "bottom";
        textAlign = "center";
      } else if (isRadianAroundZero(rotationDiff - PI4)) {
        textVerticalAlign = direction > 0 ? "bottom" : "top";
        textAlign = "center";
      } else {
        textVerticalAlign = "middle";
        if (rotationDiff > 0 && rotationDiff < PI4) {
          textAlign = direction > 0 ? "right" : "left";
        } else {
          textAlign = direction > 0 ? "left" : "right";
        }
      }
      return {
        rotation: rotationDiff,
        textAlign,
        textVerticalAlign
      };
    };
    AxisBuilder2.makeAxisEventDataBase = function(axisModel) {
      var eventData = {
        componentType: axisModel.mainType,
        componentIndex: axisModel.componentIndex
      };
      eventData[axisModel.mainType + "Index"] = axisModel.componentIndex;
      return eventData;
    };
    AxisBuilder2.isLabelSilent = function(axisModel) {
      var tooltipOpt = axisModel.get("tooltip");
      return axisModel.get("silent") || !(axisModel.get("triggerEvent") || tooltipOpt && tooltipOpt.show);
    };
    return AxisBuilder2;
  }()
);
var builders = {
  axisLine: function(opt, axisModel, group, transformGroup) {
    var shown = axisModel.get(["axisLine", "show"]);
    if (shown === "auto" && opt.handleAutoShown) {
      shown = opt.handleAutoShown("axisLine");
    }
    if (!shown) {
      return;
    }
    var extent3 = axisModel.axis.getExtent();
    var matrix = transformGroup.transform;
    var pt1 = [extent3[0], 0];
    var pt2 = [extent3[1], 0];
    var inverse = pt1[0] > pt2[0];
    if (matrix) {
      applyTransform(pt1, pt1, matrix);
      applyTransform(pt2, pt2, matrix);
    }
    var lineStyle = extend({
      lineCap: "round"
    }, axisModel.getModel(["axisLine", "lineStyle"]).getLineStyle());
    var line = new Line_default({
      shape: {
        x1: pt1[0],
        y1: pt1[1],
        x2: pt2[0],
        y2: pt2[1]
      },
      style: lineStyle,
      strokeContainThreshold: opt.strokeContainThreshold || 5,
      silent: true,
      z2: 1
    });
    subPixelOptimizeLine2(line.shape, line.style.lineWidth);
    line.anid = "line";
    group.add(line);
    var arrows = axisModel.get(["axisLine", "symbol"]);
    if (arrows != null) {
      var arrowSize = axisModel.get(["axisLine", "symbolSize"]);
      if (isString(arrows)) {
        arrows = [arrows, arrows];
      }
      if (isString(arrowSize) || isNumber(arrowSize)) {
        arrowSize = [arrowSize, arrowSize];
      }
      var arrowOffset = normalizeSymbolOffset(axisModel.get(["axisLine", "symbolOffset"]) || 0, arrowSize);
      var symbolWidth_1 = arrowSize[0];
      var symbolHeight_1 = arrowSize[1];
      each([{
        rotate: opt.rotation + Math.PI / 2,
        offset: arrowOffset[0],
        r: 0
      }, {
        rotate: opt.rotation - Math.PI / 2,
        offset: arrowOffset[1],
        r: Math.sqrt((pt1[0] - pt2[0]) * (pt1[0] - pt2[0]) + (pt1[1] - pt2[1]) * (pt1[1] - pt2[1]))
      }], function(point, index) {
        if (arrows[index] !== "none" && arrows[index] != null) {
          var symbol = createSymbol(arrows[index], -symbolWidth_1 / 2, -symbolHeight_1 / 2, symbolWidth_1, symbolHeight_1, lineStyle.stroke, true);
          var r = point.r + point.offset;
          var pt = inverse ? pt2 : pt1;
          symbol.attr({
            rotation: point.rotate,
            x: pt[0] + r * Math.cos(opt.rotation),
            y: pt[1] - r * Math.sin(opt.rotation),
            silent: true,
            z2: 11
          });
          group.add(symbol);
        }
      });
    }
  },
  axisTickLabel: function(opt, axisModel, group, transformGroup) {
    var ticksEls = buildAxisMajorTicks(group, transformGroup, axisModel, opt);
    var labelEls = buildAxisLabel(group, transformGroup, axisModel, opt);
    fixMinMaxLabelShow(axisModel, labelEls, ticksEls);
    buildAxisMinorTicks(group, transformGroup, axisModel, opt.tickDirection);
    if (axisModel.get(["axisLabel", "hideOverlap"])) {
      var labelList = prepareLayoutList(map(labelEls, function(label) {
        return {
          label,
          priority: label.z2,
          defaultAttr: {
            ignore: label.ignore
          }
        };
      }));
      hideOverlap(labelList);
    }
  },
  axisName: function(opt, axisModel, group, transformGroup) {
    var name = retrieve(opt.axisName, axisModel.get("name"));
    if (!name) {
      return;
    }
    var nameLocation = axisModel.get("nameLocation");
    var nameDirection = opt.nameDirection;
    var textStyleModel = axisModel.getModel("nameTextStyle");
    var gap = axisModel.get("nameGap") || 0;
    var extent3 = axisModel.axis.getExtent();
    var gapSignal = extent3[0] > extent3[1] ? -1 : 1;
    var pos = [
      nameLocation === "start" ? extent3[0] - gapSignal * gap : nameLocation === "end" ? extent3[1] + gapSignal * gap : (extent3[0] + extent3[1]) / 2,
      // Reuse labelOffset.
      isNameLocationCenter(nameLocation) ? opt.labelOffset + nameDirection * gap : 0
    ];
    var labelLayout;
    var nameRotation = axisModel.get("nameRotate");
    if (nameRotation != null) {
      nameRotation = nameRotation * PI4 / 180;
    }
    var axisNameAvailableWidth;
    if (isNameLocationCenter(nameLocation)) {
      labelLayout = AxisBuilder.innerTextLayout(
        opt.rotation,
        nameRotation != null ? nameRotation : opt.rotation,
        // Adapt to axis.
        nameDirection
      );
    } else {
      labelLayout = endTextLayout(opt.rotation, nameLocation, nameRotation || 0, extent3);
      axisNameAvailableWidth = opt.axisNameAvailableWidth;
      if (axisNameAvailableWidth != null) {
        axisNameAvailableWidth = Math.abs(axisNameAvailableWidth / Math.sin(labelLayout.rotation));
        !isFinite(axisNameAvailableWidth) && (axisNameAvailableWidth = null);
      }
    }
    var textFont = textStyleModel.getFont();
    var truncateOpt = axisModel.get("nameTruncate", true) || {};
    var ellipsis = truncateOpt.ellipsis;
    var maxWidth = retrieve(opt.nameTruncateMaxWidth, truncateOpt.maxWidth, axisNameAvailableWidth);
    var textEl = new Text_default({
      x: pos[0],
      y: pos[1],
      rotation: labelLayout.rotation,
      silent: AxisBuilder.isLabelSilent(axisModel),
      style: createTextStyle(textStyleModel, {
        text: name,
        font: textFont,
        overflow: "truncate",
        width: maxWidth,
        ellipsis,
        fill: textStyleModel.getTextColor() || axisModel.get(["axisLine", "lineStyle", "color"]),
        align: textStyleModel.get("align") || labelLayout.textAlign,
        verticalAlign: textStyleModel.get("verticalAlign") || labelLayout.textVerticalAlign
      }),
      z2: 1
    });
    setTooltipConfig({
      el: textEl,
      componentModel: axisModel,
      itemName: name
    });
    textEl.__fullText = name;
    textEl.anid = "name";
    if (axisModel.get("triggerEvent")) {
      var eventData = AxisBuilder.makeAxisEventDataBase(axisModel);
      eventData.targetType = "axisName";
      eventData.name = name;
      getECData(textEl).eventData = eventData;
    }
    transformGroup.add(textEl);
    textEl.updateTransform();
    group.add(textEl);
    textEl.decomposeTransform();
  }
};
function endTextLayout(rotation, textPosition, textRotate, extent3) {
  var rotationDiff = remRadian(textRotate - rotation);
  var textAlign;
  var textVerticalAlign;
  var inverse = extent3[0] > extent3[1];
  var onLeft = textPosition === "start" && !inverse || textPosition !== "start" && inverse;
  if (isRadianAroundZero(rotationDiff - PI4 / 2)) {
    textVerticalAlign = onLeft ? "bottom" : "top";
    textAlign = "center";
  } else if (isRadianAroundZero(rotationDiff - PI4 * 1.5)) {
    textVerticalAlign = onLeft ? "top" : "bottom";
    textAlign = "center";
  } else {
    textVerticalAlign = "middle";
    if (rotationDiff < PI4 * 1.5 && rotationDiff > PI4 / 2) {
      textAlign = onLeft ? "left" : "right";
    } else {
      textAlign = onLeft ? "right" : "left";
    }
  }
  return {
    rotation: rotationDiff,
    textAlign,
    textVerticalAlign
  };
}
function fixMinMaxLabelShow(axisModel, labelEls, tickEls) {
  if (shouldShowAllLabels(axisModel.axis)) {
    return;
  }
  var showMinLabel = axisModel.get(["axisLabel", "showMinLabel"]);
  var showMaxLabel = axisModel.get(["axisLabel", "showMaxLabel"]);
  labelEls = labelEls || [];
  tickEls = tickEls || [];
  var firstLabel = labelEls[0];
  var nextLabel = labelEls[1];
  var lastLabel = labelEls[labelEls.length - 1];
  var prevLabel = labelEls[labelEls.length - 2];
  var firstTick = tickEls[0];
  var nextTick = tickEls[1];
  var lastTick = tickEls[tickEls.length - 1];
  var prevTick = tickEls[tickEls.length - 2];
  if (showMinLabel === false) {
    ignoreEl(firstLabel);
    ignoreEl(firstTick);
  } else if (isTwoLabelOverlapped(firstLabel, nextLabel)) {
    if (showMinLabel) {
      ignoreEl(nextLabel);
      ignoreEl(nextTick);
    } else {
      ignoreEl(firstLabel);
      ignoreEl(firstTick);
    }
  }
  if (showMaxLabel === false) {
    ignoreEl(lastLabel);
    ignoreEl(lastTick);
  } else if (isTwoLabelOverlapped(prevLabel, lastLabel)) {
    if (showMaxLabel) {
      ignoreEl(prevLabel);
      ignoreEl(prevTick);
    } else {
      ignoreEl(lastLabel);
      ignoreEl(lastTick);
    }
  }
}
function ignoreEl(el) {
  el && (el.ignore = true);
}
function isTwoLabelOverlapped(current, next) {
  var firstRect = current && current.getBoundingRect().clone();
  var nextRect = next && next.getBoundingRect().clone();
  if (!firstRect || !nextRect) {
    return;
  }
  var mRotationBack = identity([]);
  rotate(mRotationBack, mRotationBack, -current.rotation);
  firstRect.applyTransform(mul([], mRotationBack, current.getLocalTransform()));
  nextRect.applyTransform(mul([], mRotationBack, next.getLocalTransform()));
  return firstRect.intersect(nextRect);
}
function isNameLocationCenter(nameLocation) {
  return nameLocation === "middle" || nameLocation === "center";
}
function createTicks(ticksCoords, tickTransform, tickEndCoord, tickLineStyle, anidPrefix) {
  var tickEls = [];
  var pt1 = [];
  var pt2 = [];
  for (var i = 0; i < ticksCoords.length; i++) {
    var tickCoord = ticksCoords[i].coord;
    pt1[0] = tickCoord;
    pt1[1] = 0;
    pt2[0] = tickCoord;
    pt2[1] = tickEndCoord;
    if (tickTransform) {
      applyTransform(pt1, pt1, tickTransform);
      applyTransform(pt2, pt2, tickTransform);
    }
    var tickEl = new Line_default({
      shape: {
        x1: pt1[0],
        y1: pt1[1],
        x2: pt2[0],
        y2: pt2[1]
      },
      style: tickLineStyle,
      z2: 2,
      autoBatch: true,
      silent: true
    });
    subPixelOptimizeLine2(tickEl.shape, tickEl.style.lineWidth);
    tickEl.anid = anidPrefix + "_" + ticksCoords[i].tickValue;
    tickEls.push(tickEl);
  }
  return tickEls;
}
function buildAxisMajorTicks(group, transformGroup, axisModel, opt) {
  var axis = axisModel.axis;
  var tickModel = axisModel.getModel("axisTick");
  var shown = tickModel.get("show");
  if (shown === "auto" && opt.handleAutoShown) {
    shown = opt.handleAutoShown("axisTick");
  }
  if (!shown || axis.scale.isBlank()) {
    return;
  }
  var lineStyleModel = tickModel.getModel("lineStyle");
  var tickEndCoord = opt.tickDirection * tickModel.get("length");
  var ticksCoords = axis.getTicksCoords();
  var ticksEls = createTicks(ticksCoords, transformGroup.transform, tickEndCoord, defaults(lineStyleModel.getLineStyle(), {
    stroke: axisModel.get(["axisLine", "lineStyle", "color"])
  }), "ticks");
  for (var i = 0; i < ticksEls.length; i++) {
    group.add(ticksEls[i]);
  }
  return ticksEls;
}
function buildAxisMinorTicks(group, transformGroup, axisModel, tickDirection) {
  var axis = axisModel.axis;
  var minorTickModel = axisModel.getModel("minorTick");
  if (!minorTickModel.get("show") || axis.scale.isBlank()) {
    return;
  }
  var minorTicksCoords = axis.getMinorTicksCoords();
  if (!minorTicksCoords.length) {
    return;
  }
  var lineStyleModel = minorTickModel.getModel("lineStyle");
  var tickEndCoord = tickDirection * minorTickModel.get("length");
  var minorTickLineStyle = defaults(lineStyleModel.getLineStyle(), defaults(axisModel.getModel("axisTick").getLineStyle(), {
    stroke: axisModel.get(["axisLine", "lineStyle", "color"])
  }));
  for (var i = 0; i < minorTicksCoords.length; i++) {
    var minorTicksEls = createTicks(minorTicksCoords[i], transformGroup.transform, tickEndCoord, minorTickLineStyle, "minorticks_" + i);
    for (var k = 0; k < minorTicksEls.length; k++) {
      group.add(minorTicksEls[k]);
    }
  }
}
function buildAxisLabel(group, transformGroup, axisModel, opt) {
  var axis = axisModel.axis;
  var show = retrieve(opt.axisLabelShow, axisModel.get(["axisLabel", "show"]));
  if (!show || axis.scale.isBlank()) {
    return;
  }
  var labelModel = axisModel.getModel("axisLabel");
  var labelMargin = labelModel.get("margin");
  var labels = axis.getViewLabels();
  var labelRotation = (retrieve(opt.labelRotate, labelModel.get("rotate")) || 0) * PI4 / 180;
  var labelLayout = AxisBuilder.innerTextLayout(opt.rotation, labelRotation, opt.labelDirection);
  var rawCategoryData = axisModel.getCategories && axisModel.getCategories(true);
  var labelEls = [];
  var silent = AxisBuilder.isLabelSilent(axisModel);
  var triggerEvent = axisModel.get("triggerEvent");
  each(labels, function(labelItem, index) {
    var tickValue = axis.scale.type === "ordinal" ? axis.scale.getRawOrdinalNumber(labelItem.tickValue) : labelItem.tickValue;
    var formattedLabel = labelItem.formattedLabel;
    var rawLabel = labelItem.rawLabel;
    var itemLabelModel = labelModel;
    if (rawCategoryData && rawCategoryData[tickValue]) {
      var rawCategoryItem = rawCategoryData[tickValue];
      if (isObject(rawCategoryItem) && rawCategoryItem.textStyle) {
        itemLabelModel = new Model_default(rawCategoryItem.textStyle, labelModel, axisModel.ecModel);
      }
    }
    var textColor = itemLabelModel.getTextColor() || axisModel.get(["axisLine", "lineStyle", "color"]);
    var tickCoord = axis.dataToCoord(tickValue);
    var textEl = new Text_default({
      x: tickCoord,
      y: opt.labelOffset + opt.labelDirection * labelMargin,
      rotation: labelLayout.rotation,
      silent,
      z2: 10 + (labelItem.level || 0),
      style: createTextStyle(itemLabelModel, {
        text: formattedLabel,
        align: itemLabelModel.getShallow("align", true) || labelLayout.textAlign,
        verticalAlign: itemLabelModel.getShallow("verticalAlign", true) || itemLabelModel.getShallow("baseline", true) || labelLayout.textVerticalAlign,
        fill: isFunction(textColor) ? textColor(
          // (1) In category axis with data zoom, tick is not the original
          // index of axis.data. So tick should not be exposed to user
          // in category axis.
          // (2) Compatible with previous version, which always use formatted label as
          // input. But in interval scale the formatted label is like '223,445', which
          // maked user replace ','. So we modify it to return original val but remain
          // it as 'string' to avoid error in replacing.
          axis.type === "category" ? rawLabel : axis.type === "value" ? tickValue + "" : tickValue,
          index
        ) : textColor
      })
    });
    textEl.anid = "label_" + tickValue;
    if (triggerEvent) {
      var eventData = AxisBuilder.makeAxisEventDataBase(axisModel);
      eventData.targetType = "axisLabel";
      eventData.value = rawLabel;
      eventData.tickIndex = index;
      if (axis.type === "category") {
        eventData.dataIndex = tickValue;
      }
      getECData(textEl).eventData = eventData;
    }
    transformGroup.add(textEl);
    textEl.updateTransform();
    labelEls.push(textEl);
    group.add(textEl);
    textEl.decomposeTransform();
  });
  return labelEls;
}
var AxisBuilder_default = AxisBuilder;

// node_modules/echarts/lib/component/axisPointer/modelHelper.js
function collect(ecModel, api) {
  var result = {
    /**
     * key: makeKey(axis.model)
     * value: {
     *      axis,
     *      coordSys,
     *      axisPointerModel,
     *      triggerTooltip,
     *      involveSeries,
     *      snap,
     *      seriesModels,
     *      seriesDataCount
     * }
     */
    axesInfo: {},
    seriesInvolved: false,
    /**
     * key: makeKey(coordSys.model)
     * value: Object: key makeKey(axis.model), value: axisInfo
     */
    coordSysAxesInfo: {},
    coordSysMap: {}
  };
  collectAxesInfo(result, ecModel, api);
  result.seriesInvolved && collectSeriesInfo(result, ecModel);
  return result;
}
function collectAxesInfo(result, ecModel, api) {
  var globalTooltipModel = ecModel.getComponent("tooltip");
  var globalAxisPointerModel = ecModel.getComponent("axisPointer");
  var linksOption = globalAxisPointerModel.get("link", true) || [];
  var linkGroups = [];
  each(api.getCoordinateSystems(), function(coordSys) {
    if (!coordSys.axisPointerEnabled) {
      return;
    }
    var coordSysKey = makeKey(coordSys.model);
    var axesInfoInCoordSys = result.coordSysAxesInfo[coordSysKey] = {};
    result.coordSysMap[coordSysKey] = coordSys;
    var coordSysModel = coordSys.model;
    var baseTooltipModel = coordSysModel.getModel("tooltip", globalTooltipModel);
    each(coordSys.getAxes(), curry(saveTooltipAxisInfo, false, null));
    if (coordSys.getTooltipAxes && globalTooltipModel && baseTooltipModel.get("show")) {
      var triggerAxis = baseTooltipModel.get("trigger") === "axis";
      var cross = baseTooltipModel.get(["axisPointer", "type"]) === "cross";
      var tooltipAxes = coordSys.getTooltipAxes(baseTooltipModel.get(["axisPointer", "axis"]));
      if (triggerAxis || cross) {
        each(tooltipAxes.baseAxes, curry(saveTooltipAxisInfo, cross ? "cross" : true, triggerAxis));
      }
      if (cross) {
        each(tooltipAxes.otherAxes, curry(saveTooltipAxisInfo, "cross", false));
      }
    }
    function saveTooltipAxisInfo(fromTooltip, triggerTooltip, axis) {
      var axisPointerModel = axis.model.getModel("axisPointer", globalAxisPointerModel);
      var axisPointerShow = axisPointerModel.get("show");
      if (!axisPointerShow || axisPointerShow === "auto" && !fromTooltip && !isHandleTrigger(axisPointerModel)) {
        return;
      }
      if (triggerTooltip == null) {
        triggerTooltip = axisPointerModel.get("triggerTooltip");
      }
      axisPointerModel = fromTooltip ? makeAxisPointerModel(axis, baseTooltipModel, globalAxisPointerModel, ecModel, fromTooltip, triggerTooltip) : axisPointerModel;
      var snap = axisPointerModel.get("snap");
      var axisKey = makeKey(axis.model);
      var involveSeries = triggerTooltip || snap || axis.type === "category";
      var axisInfo = result.axesInfo[axisKey] = {
        key: axisKey,
        axis,
        coordSys,
        axisPointerModel,
        triggerTooltip,
        involveSeries,
        snap,
        useHandle: isHandleTrigger(axisPointerModel),
        seriesModels: [],
        linkGroup: null
      };
      axesInfoInCoordSys[axisKey] = axisInfo;
      result.seriesInvolved = result.seriesInvolved || involveSeries;
      var groupIndex = getLinkGroupIndex(linksOption, axis);
      if (groupIndex != null) {
        var linkGroup = linkGroups[groupIndex] || (linkGroups[groupIndex] = {
          axesInfo: {}
        });
        linkGroup.axesInfo[axisKey] = axisInfo;
        linkGroup.mapper = linksOption[groupIndex].mapper;
        axisInfo.linkGroup = linkGroup;
      }
    }
  });
}
function makeAxisPointerModel(axis, baseTooltipModel, globalAxisPointerModel, ecModel, fromTooltip, triggerTooltip) {
  var tooltipAxisPointerModel = baseTooltipModel.getModel("axisPointer");
  var fields = ["type", "snap", "lineStyle", "shadowStyle", "label", "animation", "animationDurationUpdate", "animationEasingUpdate", "z"];
  var volatileOption = {};
  each(fields, function(field) {
    volatileOption[field] = clone(tooltipAxisPointerModel.get(field));
  });
  volatileOption.snap = axis.type !== "category" && !!triggerTooltip;
  if (tooltipAxisPointerModel.get("type") === "cross") {
    volatileOption.type = "line";
  }
  var labelOption = volatileOption.label || (volatileOption.label = {});
  labelOption.show == null && (labelOption.show = false);
  if (fromTooltip === "cross") {
    var tooltipAxisPointerLabelShow = tooltipAxisPointerModel.get(["label", "show"]);
    labelOption.show = tooltipAxisPointerLabelShow != null ? tooltipAxisPointerLabelShow : true;
    if (!triggerTooltip) {
      var crossStyle = volatileOption.lineStyle = tooltipAxisPointerModel.get("crossStyle");
      crossStyle && defaults(labelOption, crossStyle.textStyle);
    }
  }
  return axis.model.getModel("axisPointer", new Model_default(volatileOption, globalAxisPointerModel, ecModel));
}
function collectSeriesInfo(result, ecModel) {
  ecModel.eachSeries(function(seriesModel) {
    var coordSys = seriesModel.coordinateSystem;
    var seriesTooltipTrigger = seriesModel.get(["tooltip", "trigger"], true);
    var seriesTooltipShow = seriesModel.get(["tooltip", "show"], true);
    if (!coordSys || seriesTooltipTrigger === "none" || seriesTooltipTrigger === false || seriesTooltipTrigger === "item" || seriesTooltipShow === false || seriesModel.get(["axisPointer", "show"], true) === false) {
      return;
    }
    each(result.coordSysAxesInfo[makeKey(coordSys.model)], function(axisInfo) {
      var axis = axisInfo.axis;
      if (coordSys.getAxis(axis.dim) === axis) {
        axisInfo.seriesModels.push(seriesModel);
        axisInfo.seriesDataCount == null && (axisInfo.seriesDataCount = 0);
        axisInfo.seriesDataCount += seriesModel.getData().count();
      }
    });
  });
}
function getLinkGroupIndex(linksOption, axis) {
  var axisModel = axis.model;
  var dim = axis.dim;
  for (var i = 0; i < linksOption.length; i++) {
    var linkOption = linksOption[i] || {};
    if (checkPropInLink(linkOption[dim + "AxisId"], axisModel.id) || checkPropInLink(linkOption[dim + "AxisIndex"], axisModel.componentIndex) || checkPropInLink(linkOption[dim + "AxisName"], axisModel.name)) {
      return i;
    }
  }
}
function checkPropInLink(linkPropValue, axisPropValue) {
  return linkPropValue === "all" || isArray(linkPropValue) && indexOf(linkPropValue, axisPropValue) >= 0 || linkPropValue === axisPropValue;
}
function fixValue(axisModel) {
  var axisInfo = getAxisInfo(axisModel);
  if (!axisInfo) {
    return;
  }
  var axisPointerModel = axisInfo.axisPointerModel;
  var scale4 = axisInfo.axis.scale;
  var option = axisPointerModel.option;
  var status = axisPointerModel.get("status");
  var value = axisPointerModel.get("value");
  if (value != null) {
    value = scale4.parse(value);
  }
  var useHandle = isHandleTrigger(axisPointerModel);
  if (status == null) {
    option.status = useHandle ? "show" : "hide";
  }
  var extent3 = scale4.getExtent().slice();
  extent3[0] > extent3[1] && extent3.reverse();
  if (
    // Pick a value on axis when initializing.
    value == null || value > extent3[1]
  ) {
    value = extent3[1];
  }
  if (value < extent3[0]) {
    value = extent3[0];
  }
  option.value = value;
  if (useHandle) {
    option.status = axisInfo.axis.scale.isBlank() ? "hide" : "show";
  }
}
function getAxisInfo(axisModel) {
  var coordSysAxesInfo = (axisModel.ecModel.getComponent("axisPointer") || {}).coordSysAxesInfo;
  return coordSysAxesInfo && coordSysAxesInfo.axesInfo[makeKey(axisModel)];
}
function getAxisPointerModel(axisModel) {
  var axisInfo = getAxisInfo(axisModel);
  return axisInfo && axisInfo.axisPointerModel;
}
function isHandleTrigger(axisPointerModel) {
  return !!axisPointerModel.get(["handle", "show"]);
}
function makeKey(model) {
  return model.type + "||" + model.id;
}

// node_modules/echarts/lib/component/axis/AxisView.js
var axisPointerClazz = {};
var AxisView = (
  /** @class */
  function(_super) {
    __extends(AxisView2, _super);
    function AxisView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = AxisView2.type;
      return _this;
    }
    AxisView2.prototype.render = function(axisModel, ecModel, api, payload) {
      this.axisPointerClass && fixValue(axisModel);
      _super.prototype.render.apply(this, arguments);
      this._doUpdateAxisPointerClass(axisModel, api, true);
    };
    AxisView2.prototype.updateAxisPointer = function(axisModel, ecModel, api, payload) {
      this._doUpdateAxisPointerClass(axisModel, api, false);
    };
    AxisView2.prototype.remove = function(ecModel, api) {
      var axisPointer = this._axisPointer;
      axisPointer && axisPointer.remove(api);
    };
    AxisView2.prototype.dispose = function(ecModel, api) {
      this._disposeAxisPointer(api);
      _super.prototype.dispose.apply(this, arguments);
    };
    AxisView2.prototype._doUpdateAxisPointerClass = function(axisModel, api, forceRender) {
      var Clazz = AxisView2.getAxisPointerClass(this.axisPointerClass);
      if (!Clazz) {
        return;
      }
      var axisPointerModel = getAxisPointerModel(axisModel);
      axisPointerModel ? (this._axisPointer || (this._axisPointer = new Clazz())).render(axisModel, axisPointerModel, api, forceRender) : this._disposeAxisPointer(api);
    };
    AxisView2.prototype._disposeAxisPointer = function(api) {
      this._axisPointer && this._axisPointer.dispose(api);
      this._axisPointer = null;
    };
    AxisView2.registerAxisPointerClass = function(type, clazz) {
      if (true) {
        if (axisPointerClazz[type]) {
          throw new Error("axisPointer " + type + " exists");
        }
      }
      axisPointerClazz[type] = clazz;
    };
    ;
    AxisView2.getAxisPointerClass = function(type) {
      return type && axisPointerClazz[type];
    };
    ;
    AxisView2.type = "axis";
    return AxisView2;
  }(Component_default2)
);
var AxisView_default = AxisView;

// node_modules/echarts/lib/component/axis/axisSplitHelper.js
var inner7 = makeInner();
function rectCoordAxisBuildSplitArea(axisView, axisGroup, axisModel, gridModel) {
  var axis = axisModel.axis;
  if (axis.scale.isBlank()) {
    return;
  }
  var splitAreaModel = axisModel.getModel("splitArea");
  var areaStyleModel = splitAreaModel.getModel("areaStyle");
  var areaColors = areaStyleModel.get("color");
  var gridRect = gridModel.coordinateSystem.getRect();
  var ticksCoords = axis.getTicksCoords({
    tickModel: splitAreaModel,
    clamp: true
  });
  if (!ticksCoords.length) {
    return;
  }
  var areaColorsLen = areaColors.length;
  var lastSplitAreaColors = inner7(axisView).splitAreaColors;
  var newSplitAreaColors = createHashMap();
  var colorIndex = 0;
  if (lastSplitAreaColors) {
    for (var i = 0; i < ticksCoords.length; i++) {
      var cIndex = lastSplitAreaColors.get(ticksCoords[i].tickValue);
      if (cIndex != null) {
        colorIndex = (cIndex + (areaColorsLen - 1) * i) % areaColorsLen;
        break;
      }
    }
  }
  var prev = axis.toGlobalCoord(ticksCoords[0].coord);
  var areaStyle = areaStyleModel.getAreaStyle();
  areaColors = isArray(areaColors) ? areaColors : [areaColors];
  for (var i = 1; i < ticksCoords.length; i++) {
    var tickCoord = axis.toGlobalCoord(ticksCoords[i].coord);
    var x = void 0;
    var y = void 0;
    var width = void 0;
    var height = void 0;
    if (axis.isHorizontal()) {
      x = prev;
      y = gridRect.y;
      width = tickCoord - x;
      height = gridRect.height;
      prev = x + width;
    } else {
      x = gridRect.x;
      y = prev;
      width = gridRect.width;
      height = tickCoord - y;
      prev = y + height;
    }
    var tickValue = ticksCoords[i - 1].tickValue;
    tickValue != null && newSplitAreaColors.set(tickValue, colorIndex);
    axisGroup.add(new Rect_default({
      anid: tickValue != null ? "area_" + tickValue : null,
      shape: {
        x,
        y,
        width,
        height
      },
      style: defaults({
        fill: areaColors[colorIndex]
      }, areaStyle),
      autoBatch: true,
      silent: true
    }));
    colorIndex = (colorIndex + 1) % areaColorsLen;
  }
  inner7(axisView).splitAreaColors = newSplitAreaColors;
}
function rectCoordAxisHandleRemove(axisView) {
  inner7(axisView).splitAreaColors = null;
}

// node_modules/echarts/lib/component/axis/CartesianAxisView.js
var axisBuilderAttrs = ["axisLine", "axisTickLabel", "axisName"];
var selfBuilderAttrs = ["splitArea", "splitLine", "minorSplitLine"];
var CartesianAxisView = (
  /** @class */
  function(_super) {
    __extends(CartesianAxisView2, _super);
    function CartesianAxisView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = CartesianAxisView2.type;
      _this.axisPointerClass = "CartesianAxisPointer";
      return _this;
    }
    CartesianAxisView2.prototype.render = function(axisModel, ecModel, api, payload) {
      this.group.removeAll();
      var oldAxisGroup = this._axisGroup;
      this._axisGroup = new Group_default();
      this.group.add(this._axisGroup);
      if (!axisModel.get("show")) {
        return;
      }
      var gridModel = axisModel.getCoordSysModel();
      var layout3 = layout2(gridModel, axisModel);
      var axisBuilder = new AxisBuilder_default(axisModel, extend({
        handleAutoShown: function(elementType) {
          var cartesians = gridModel.coordinateSystem.getCartesians();
          for (var i = 0; i < cartesians.length; i++) {
            if (isIntervalOrLogScale(cartesians[i].getOtherAxis(axisModel.axis).scale)) {
              return true;
            }
          }
          return false;
        }
      }, layout3));
      each(axisBuilderAttrs, axisBuilder.add, axisBuilder);
      this._axisGroup.add(axisBuilder.getGroup());
      each(selfBuilderAttrs, function(name) {
        if (axisModel.get([name, "show"])) {
          axisElementBuilders[name](this, this._axisGroup, axisModel, gridModel);
        }
      }, this);
      var isInitialSortFromBarRacing = payload && payload.type === "changeAxisOrder" && payload.isInitSort;
      if (!isInitialSortFromBarRacing) {
        groupTransition(oldAxisGroup, this._axisGroup, axisModel);
      }
      _super.prototype.render.call(this, axisModel, ecModel, api, payload);
    };
    CartesianAxisView2.prototype.remove = function() {
      rectCoordAxisHandleRemove(this);
    };
    CartesianAxisView2.type = "cartesianAxis";
    return CartesianAxisView2;
  }(AxisView_default)
);
var axisElementBuilders = {
  splitLine: function(axisView, axisGroup, axisModel, gridModel) {
    var axis = axisModel.axis;
    if (axis.scale.isBlank()) {
      return;
    }
    var splitLineModel = axisModel.getModel("splitLine");
    var lineStyleModel = splitLineModel.getModel("lineStyle");
    var lineColors = lineStyleModel.get("color");
    lineColors = isArray(lineColors) ? lineColors : [lineColors];
    var gridRect = gridModel.coordinateSystem.getRect();
    var isHorizontal = axis.isHorizontal();
    var lineCount = 0;
    var ticksCoords = axis.getTicksCoords({
      tickModel: splitLineModel
    });
    var p1 = [];
    var p2 = [];
    var lineStyle = lineStyleModel.getLineStyle();
    for (var i = 0; i < ticksCoords.length; i++) {
      var tickCoord = axis.toGlobalCoord(ticksCoords[i].coord);
      if (isHorizontal) {
        p1[0] = tickCoord;
        p1[1] = gridRect.y;
        p2[0] = tickCoord;
        p2[1] = gridRect.y + gridRect.height;
      } else {
        p1[0] = gridRect.x;
        p1[1] = tickCoord;
        p2[0] = gridRect.x + gridRect.width;
        p2[1] = tickCoord;
      }
      var colorIndex = lineCount++ % lineColors.length;
      var tickValue = ticksCoords[i].tickValue;
      var line = new Line_default({
        anid: tickValue != null ? "line_" + ticksCoords[i].tickValue : null,
        autoBatch: true,
        shape: {
          x1: p1[0],
          y1: p1[1],
          x2: p2[0],
          y2: p2[1]
        },
        style: defaults({
          stroke: lineColors[colorIndex]
        }, lineStyle),
        silent: true
      });
      subPixelOptimizeLine2(line.shape, lineStyle.lineWidth);
      axisGroup.add(line);
    }
  },
  minorSplitLine: function(axisView, axisGroup, axisModel, gridModel) {
    var axis = axisModel.axis;
    var minorSplitLineModel = axisModel.getModel("minorSplitLine");
    var lineStyleModel = minorSplitLineModel.getModel("lineStyle");
    var gridRect = gridModel.coordinateSystem.getRect();
    var isHorizontal = axis.isHorizontal();
    var minorTicksCoords = axis.getMinorTicksCoords();
    if (!minorTicksCoords.length) {
      return;
    }
    var p1 = [];
    var p2 = [];
    var lineStyle = lineStyleModel.getLineStyle();
    for (var i = 0; i < minorTicksCoords.length; i++) {
      for (var k = 0; k < minorTicksCoords[i].length; k++) {
        var tickCoord = axis.toGlobalCoord(minorTicksCoords[i][k].coord);
        if (isHorizontal) {
          p1[0] = tickCoord;
          p1[1] = gridRect.y;
          p2[0] = tickCoord;
          p2[1] = gridRect.y + gridRect.height;
        } else {
          p1[0] = gridRect.x;
          p1[1] = tickCoord;
          p2[0] = gridRect.x + gridRect.width;
          p2[1] = tickCoord;
        }
        var line = new Line_default({
          anid: "minor_line_" + minorTicksCoords[i][k].tickValue,
          autoBatch: true,
          shape: {
            x1: p1[0],
            y1: p1[1],
            x2: p2[0],
            y2: p2[1]
          },
          style: lineStyle,
          silent: true
        });
        subPixelOptimizeLine2(line.shape, lineStyle.lineWidth);
        axisGroup.add(line);
      }
    }
  },
  splitArea: function(axisView, axisGroup, axisModel, gridModel) {
    rectCoordAxisBuildSplitArea(axisView, axisGroup, axisModel, gridModel);
  }
};
var CartesianXAxisView = (
  /** @class */
  function(_super) {
    __extends(CartesianXAxisView2, _super);
    function CartesianXAxisView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = CartesianXAxisView2.type;
      return _this;
    }
    CartesianXAxisView2.type = "xAxis";
    return CartesianXAxisView2;
  }(CartesianAxisView)
);
var CartesianYAxisView = (
  /** @class */
  function(_super) {
    __extends(CartesianYAxisView2, _super);
    function CartesianYAxisView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = CartesianXAxisView.type;
      return _this;
    }
    CartesianYAxisView2.type = "yAxis";
    return CartesianYAxisView2;
  }(CartesianAxisView)
);

// node_modules/echarts/lib/component/grid/installSimple.js
var GridView = (
  /** @class */
  function(_super) {
    __extends(GridView2, _super);
    function GridView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = "grid";
      return _this;
    }
    GridView2.prototype.render = function(gridModel, ecModel) {
      this.group.removeAll();
      if (gridModel.get("show")) {
        this.group.add(new Rect_default({
          shape: gridModel.coordinateSystem.getRect(),
          style: defaults({
            fill: gridModel.get("backgroundColor")
          }, gridModel.getItemStyle()),
          silent: true,
          z2: -1
        }));
      }
    };
    GridView2.type = "grid";
    return GridView2;
  }(Component_default2)
);
var extraOption = {
  // gridIndex: 0,
  // gridId: '',
  offset: 0
};
function install(registers) {
  registers.registerComponentView(GridView);
  registers.registerComponentModel(GridModel_default);
  registers.registerCoordinateSystem("cartesian2d", Grid_default);
  axisModelCreator(registers, "x", CartesianAxisModel, extraOption);
  axisModelCreator(registers, "y", CartesianAxisModel, extraOption);
  registers.registerComponentView(CartesianXAxisView);
  registers.registerComponentView(CartesianYAxisView);
  registers.registerPreprocessor(function(option) {
    if (option.xAxis && option.yAxis && !option.grid) {
      option.grid = {};
    }
  });
}

// node_modules/echarts/lib/coord/radar/RadarModel.js
var valueAxisDefault = axisDefault_default.value;
function defaultsShow(opt, show) {
  return defaults({
    show
  }, opt);
}
var RadarModel = (
  /** @class */
  function(_super) {
    __extends(RadarModel2, _super);
    function RadarModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = RadarModel2.type;
      return _this;
    }
    RadarModel2.prototype.optionUpdated = function() {
      var boundaryGap = this.get("boundaryGap");
      var splitNumber = this.get("splitNumber");
      var scale4 = this.get("scale");
      var axisLine = this.get("axisLine");
      var axisTick = this.get("axisTick");
      var axisLabel = this.get("axisLabel");
      var nameTextStyle = this.get("axisName");
      var showName = this.get(["axisName", "show"]);
      var nameFormatter = this.get(["axisName", "formatter"]);
      var nameGap = this.get("axisNameGap");
      var triggerEvent = this.get("triggerEvent");
      var indicatorModels = map(this.get("indicator") || [], function(indicatorOpt) {
        if (indicatorOpt.max != null && indicatorOpt.max > 0 && !indicatorOpt.min) {
          indicatorOpt.min = 0;
        } else if (indicatorOpt.min != null && indicatorOpt.min < 0 && !indicatorOpt.max) {
          indicatorOpt.max = 0;
        }
        var iNameTextStyle = nameTextStyle;
        if (indicatorOpt.color != null) {
          iNameTextStyle = defaults({
            color: indicatorOpt.color
          }, nameTextStyle);
        }
        var innerIndicatorOpt = merge(clone(indicatorOpt), {
          boundaryGap,
          splitNumber,
          scale: scale4,
          axisLine,
          axisTick,
          // axisType: axisType,
          axisLabel,
          // Compatible with 2 and use text
          name: indicatorOpt.text,
          showName,
          nameLocation: "end",
          nameGap,
          // min: 0,
          nameTextStyle: iNameTextStyle,
          triggerEvent
        }, false);
        if (isString(nameFormatter)) {
          var indName = innerIndicatorOpt.name;
          innerIndicatorOpt.name = nameFormatter.replace("{value}", indName != null ? indName : "");
        } else if (isFunction(nameFormatter)) {
          innerIndicatorOpt.name = nameFormatter(innerIndicatorOpt.name, innerIndicatorOpt);
        }
        var model = new Model_default(innerIndicatorOpt, null, this.ecModel);
        mixin(model, AxisModelCommonMixin.prototype);
        model.mainType = "radar";
        model.componentIndex = this.componentIndex;
        return model;
      }, this);
      this._indicatorModels = indicatorModels;
    };
    RadarModel2.prototype.getIndicatorModels = function() {
      return this._indicatorModels;
    };
    RadarModel2.type = "radar";
    RadarModel2.defaultOption = {
      // zlevel: 0,
      z: 0,
      center: ["50%", "50%"],
      radius: "75%",
      startAngle: 90,
      axisName: {
        show: true
        // formatter: null
        // textStyle: {}
      },
      boundaryGap: [0, 0],
      splitNumber: 5,
      axisNameGap: 15,
      scale: false,
      // Polygon or circle
      shape: "polygon",
      axisLine: merge({
        lineStyle: {
          color: "#bbb"
        }
      }, valueAxisDefault.axisLine),
      axisLabel: defaultsShow(valueAxisDefault.axisLabel, false),
      axisTick: defaultsShow(valueAxisDefault.axisTick, false),
      // axisType: 'value',
      splitLine: defaultsShow(valueAxisDefault.splitLine, true),
      splitArea: defaultsShow(valueAxisDefault.splitArea, true),
      // {text, min, max}
      indicator: []
    };
    return RadarModel2;
  }(Component_default)
);
var RadarModel_default = RadarModel;

// node_modules/echarts/lib/component/radar/RadarView.js
var axisBuilderAttrs2 = ["axisLine", "axisTickLabel", "axisName"];
var RadarView = (
  /** @class */
  function(_super) {
    __extends(RadarView2, _super);
    function RadarView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = RadarView2.type;
      return _this;
    }
    RadarView2.prototype.render = function(radarModel, ecModel, api) {
      var group = this.group;
      group.removeAll();
      this._buildAxes(radarModel);
      this._buildSplitLineAndArea(radarModel);
    };
    RadarView2.prototype._buildAxes = function(radarModel) {
      var radar = radarModel.coordinateSystem;
      var indicatorAxes = radar.getIndicatorAxes();
      var axisBuilders = map(indicatorAxes, function(indicatorAxis) {
        var axisName = indicatorAxis.model.get("showName") ? indicatorAxis.name : "";
        var axisBuilder = new AxisBuilder_default(indicatorAxis.model, {
          axisName,
          position: [radar.cx, radar.cy],
          rotation: indicatorAxis.angle,
          labelDirection: -1,
          tickDirection: -1,
          nameDirection: 1
        });
        return axisBuilder;
      });
      each(axisBuilders, function(axisBuilder) {
        each(axisBuilderAttrs2, axisBuilder.add, axisBuilder);
        this.group.add(axisBuilder.getGroup());
      }, this);
    };
    RadarView2.prototype._buildSplitLineAndArea = function(radarModel) {
      var radar = radarModel.coordinateSystem;
      var indicatorAxes = radar.getIndicatorAxes();
      if (!indicatorAxes.length) {
        return;
      }
      var shape = radarModel.get("shape");
      var splitLineModel = radarModel.getModel("splitLine");
      var splitAreaModel = radarModel.getModel("splitArea");
      var lineStyleModel = splitLineModel.getModel("lineStyle");
      var areaStyleModel = splitAreaModel.getModel("areaStyle");
      var showSplitLine = splitLineModel.get("show");
      var showSplitArea = splitAreaModel.get("show");
      var splitLineColors = lineStyleModel.get("color");
      var splitAreaColors = areaStyleModel.get("color");
      var splitLineColorsArr = isArray(splitLineColors) ? splitLineColors : [splitLineColors];
      var splitAreaColorsArr = isArray(splitAreaColors) ? splitAreaColors : [splitAreaColors];
      var splitLines = [];
      var splitAreas = [];
      function getColorIndex(areaOrLine, areaOrLineColorList, idx) {
        var colorIndex2 = idx % areaOrLineColorList.length;
        areaOrLine[colorIndex2] = areaOrLine[colorIndex2] || [];
        return colorIndex2;
      }
      if (shape === "circle") {
        var ticksRadius = indicatorAxes[0].getTicksCoords();
        var cx = radar.cx;
        var cy = radar.cy;
        for (var i = 0; i < ticksRadius.length; i++) {
          if (showSplitLine) {
            var colorIndex = getColorIndex(splitLines, splitLineColorsArr, i);
            splitLines[colorIndex].push(new Circle_default({
              shape: {
                cx,
                cy,
                r: ticksRadius[i].coord
              }
            }));
          }
          if (showSplitArea && i < ticksRadius.length - 1) {
            var colorIndex = getColorIndex(splitAreas, splitAreaColorsArr, i);
            splitAreas[colorIndex].push(new Ring_default({
              shape: {
                cx,
                cy,
                r0: ticksRadius[i].coord,
                r: ticksRadius[i + 1].coord
              }
            }));
          }
        }
      } else {
        var realSplitNumber_1;
        var axesTicksPoints = map(indicatorAxes, function(indicatorAxis, idx) {
          var ticksCoords = indicatorAxis.getTicksCoords();
          realSplitNumber_1 = realSplitNumber_1 == null ? ticksCoords.length - 1 : Math.min(ticksCoords.length - 1, realSplitNumber_1);
          return map(ticksCoords, function(tickCoord) {
            return radar.coordToPoint(tickCoord.coord, idx);
          });
        });
        var prevPoints = [];
        for (var i = 0; i <= realSplitNumber_1; i++) {
          var points4 = [];
          for (var j = 0; j < indicatorAxes.length; j++) {
            points4.push(axesTicksPoints[j][i]);
          }
          if (points4[0]) {
            points4.push(points4[0].slice());
          } else {
            if (true) {
              console.error("Can't draw value axis " + i);
            }
          }
          if (showSplitLine) {
            var colorIndex = getColorIndex(splitLines, splitLineColorsArr, i);
            splitLines[colorIndex].push(new Polyline_default({
              shape: {
                points: points4
              }
            }));
          }
          if (showSplitArea && prevPoints) {
            var colorIndex = getColorIndex(splitAreas, splitAreaColorsArr, i - 1);
            splitAreas[colorIndex].push(new Polygon_default({
              shape: {
                points: points4.concat(prevPoints)
              }
            }));
          }
          prevPoints = points4.slice().reverse();
        }
      }
      var lineStyle = lineStyleModel.getLineStyle();
      var areaStyle = areaStyleModel.getAreaStyle();
      each(splitAreas, function(splitAreas2, idx) {
        this.group.add(mergePath2(splitAreas2, {
          style: defaults({
            stroke: "none",
            fill: splitAreaColorsArr[idx % splitAreaColorsArr.length]
          }, areaStyle),
          silent: true
        }));
      }, this);
      each(splitLines, function(splitLines2, idx) {
        this.group.add(mergePath2(splitLines2, {
          style: defaults({
            fill: "none",
            stroke: splitLineColorsArr[idx % splitLineColorsArr.length]
          }, lineStyle),
          silent: true
        }));
      }, this);
    };
    RadarView2.type = "radar";
    return RadarView2;
  }(Component_default2)
);
var RadarView_default = RadarView;

// node_modules/echarts/lib/coord/radar/IndicatorAxis.js
var IndicatorAxis = (
  /** @class */
  function(_super) {
    __extends(IndicatorAxis2, _super);
    function IndicatorAxis2(dim, scale4, radiusExtent) {
      var _this = _super.call(this, dim, scale4, radiusExtent) || this;
      _this.type = "value";
      _this.angle = 0;
      _this.name = "";
      return _this;
    }
    return IndicatorAxis2;
  }(Axis_default)
);
var IndicatorAxis_default = IndicatorAxis;

// node_modules/echarts/lib/coord/radar/Radar.js
var Radar = (
  /** @class */
  function() {
    function Radar2(radarModel, ecModel, api) {
      this.dimensions = [];
      this._model = radarModel;
      this._indicatorAxes = map(radarModel.getIndicatorModels(), function(indicatorModel, idx) {
        var dim = "indicator_" + idx;
        var indicatorAxis = new IndicatorAxis_default(
          dim,
          new Interval_default()
          // (indicatorModel.get('axisType') === 'log') ? new LogScale() : new IntervalScale()
        );
        indicatorAxis.name = indicatorModel.get("name");
        indicatorAxis.model = indicatorModel;
        indicatorModel.axis = indicatorAxis;
        this.dimensions.push(dim);
        return indicatorAxis;
      }, this);
      this.resize(radarModel, api);
    }
    Radar2.prototype.getIndicatorAxes = function() {
      return this._indicatorAxes;
    };
    Radar2.prototype.dataToPoint = function(value, indicatorIndex) {
      var indicatorAxis = this._indicatorAxes[indicatorIndex];
      return this.coordToPoint(indicatorAxis.dataToCoord(value), indicatorIndex);
    };
    Radar2.prototype.coordToPoint = function(coord, indicatorIndex) {
      var indicatorAxis = this._indicatorAxes[indicatorIndex];
      var angle = indicatorAxis.angle;
      var x = this.cx + coord * Math.cos(angle);
      var y = this.cy - coord * Math.sin(angle);
      return [x, y];
    };
    Radar2.prototype.pointToData = function(pt) {
      var dx = pt[0] - this.cx;
      var dy = pt[1] - this.cy;
      var radius = Math.sqrt(dx * dx + dy * dy);
      dx /= radius;
      dy /= radius;
      var radian = Math.atan2(-dy, dx);
      var minRadianDiff = Infinity;
      var closestAxis;
      var closestAxisIdx = -1;
      for (var i = 0; i < this._indicatorAxes.length; i++) {
        var indicatorAxis = this._indicatorAxes[i];
        var diff = Math.abs(radian - indicatorAxis.angle);
        if (diff < minRadianDiff) {
          closestAxis = indicatorAxis;
          closestAxisIdx = i;
          minRadianDiff = diff;
        }
      }
      return [closestAxisIdx, +(closestAxis && closestAxis.coordToData(radius))];
    };
    Radar2.prototype.resize = function(radarModel, api) {
      var center2 = radarModel.get("center");
      var viewWidth = api.getWidth();
      var viewHeight = api.getHeight();
      var viewSize = Math.min(viewWidth, viewHeight) / 2;
      this.cx = parsePercent2(center2[0], viewWidth);
      this.cy = parsePercent2(center2[1], viewHeight);
      this.startAngle = radarModel.get("startAngle") * Math.PI / 180;
      var radius = radarModel.get("radius");
      if (isString(radius) || isNumber(radius)) {
        radius = [0, radius];
      }
      this.r0 = parsePercent2(radius[0], viewSize);
      this.r = parsePercent2(radius[1], viewSize);
      each(this._indicatorAxes, function(indicatorAxis, idx) {
        indicatorAxis.setExtent(this.r0, this.r);
        var angle = this.startAngle + idx * Math.PI * 2 / this._indicatorAxes.length;
        angle = Math.atan2(Math.sin(angle), Math.cos(angle));
        indicatorAxis.angle = angle;
      }, this);
    };
    Radar2.prototype.update = function(ecModel, api) {
      var indicatorAxes = this._indicatorAxes;
      var radarModel = this._model;
      each(indicatorAxes, function(indicatorAxis) {
        indicatorAxis.scale.setExtent(Infinity, -Infinity);
      });
      ecModel.eachSeriesByType("radar", function(radarSeries, idx) {
        if (radarSeries.get("coordinateSystem") !== "radar" || ecModel.getComponent("radar", radarSeries.get("radarIndex")) !== radarModel) {
          return;
        }
        var data = radarSeries.getData();
        each(indicatorAxes, function(indicatorAxis) {
          indicatorAxis.scale.unionExtentFromData(data, data.mapDimension(indicatorAxis.dim));
        });
      }, this);
      var splitNumber = radarModel.get("splitNumber");
      var dummyScale = new Interval_default();
      dummyScale.setExtent(0, splitNumber);
      dummyScale.setInterval(1);
      each(indicatorAxes, function(indicatorAxis, idx) {
        alignScaleTicks(indicatorAxis.scale, indicatorAxis.model, dummyScale);
      });
    };
    Radar2.prototype.convertToPixel = function(ecModel, finder, value) {
      console.warn("Not implemented.");
      return null;
    };
    Radar2.prototype.convertFromPixel = function(ecModel, finder, pixel) {
      console.warn("Not implemented.");
      return null;
    };
    Radar2.prototype.containPoint = function(point) {
      console.warn("Not implemented.");
      return false;
    };
    Radar2.create = function(ecModel, api) {
      var radarList = [];
      ecModel.eachComponent("radar", function(radarModel) {
        var radar = new Radar2(radarModel, ecModel, api);
        radarList.push(radar);
        radarModel.coordinateSystem = radar;
      });
      ecModel.eachSeriesByType("radar", function(radarSeries) {
        if (radarSeries.get("coordinateSystem") === "radar") {
          radarSeries.coordinateSystem = radarList[radarSeries.get("radarIndex") || 0];
        }
      });
      return radarList;
    };
    Radar2.dimensions = [];
    return Radar2;
  }()
);
var Radar_default = Radar;

// node_modules/echarts/lib/component/radar/install.js
function install2(registers) {
  registers.registerCoordinateSystem("radar", Radar_default);
  registers.registerComponentModel(RadarModel_default);
  registers.registerComponentView(RadarView_default);
  registers.registerVisual({
    seriesType: "radar",
    reset: function(seriesModel) {
      var data = seriesModel.getData();
      data.each(function(idx) {
        data.setItemVisual(idx, "legendIcon", "roundRect");
      });
      data.setVisual("legendIcon", "roundRect");
    }
  });
}

// node_modules/echarts/lib/coord/View.js
var v2ApplyTransform = applyTransform;
var View = (
  /** @class */
  function(_super) {
    __extends(View2, _super);
    function View2(name) {
      var _this = _super.call(this) || this;
      _this.type = "view";
      _this.dimensions = ["x", "y"];
      _this._roamTransformable = new Transformable_default();
      _this._rawTransformable = new Transformable_default();
      _this.name = name;
      return _this;
    }
    View2.prototype.setBoundingRect = function(x, y, width, height) {
      this._rect = new BoundingRect_default(x, y, width, height);
      return this._rect;
    };
    View2.prototype.getBoundingRect = function() {
      return this._rect;
    };
    View2.prototype.setViewRect = function(x, y, width, height) {
      this._transformTo(x, y, width, height);
      this._viewRect = new BoundingRect_default(x, y, width, height);
    };
    View2.prototype._transformTo = function(x, y, width, height) {
      var rect = this.getBoundingRect();
      var rawTransform = this._rawTransformable;
      rawTransform.transform = rect.calculateTransform(new BoundingRect_default(x, y, width, height));
      var rawParent = rawTransform.parent;
      rawTransform.parent = null;
      rawTransform.decomposeTransform();
      rawTransform.parent = rawParent;
      this._updateTransform();
    };
    View2.prototype.setCenter = function(centerCoord, api) {
      if (!centerCoord) {
        return;
      }
      this._center = [parsePercent2(centerCoord[0], api.getWidth()), parsePercent2(centerCoord[1], api.getHeight())];
      this._updateCenterAndZoom();
    };
    View2.prototype.setZoom = function(zoom) {
      zoom = zoom || 1;
      var zoomLimit = this.zoomLimit;
      if (zoomLimit) {
        if (zoomLimit.max != null) {
          zoom = Math.min(zoomLimit.max, zoom);
        }
        if (zoomLimit.min != null) {
          zoom = Math.max(zoomLimit.min, zoom);
        }
      }
      this._zoom = zoom;
      this._updateCenterAndZoom();
    };
    View2.prototype.getDefaultCenter = function() {
      var rawRect = this.getBoundingRect();
      var cx = rawRect.x + rawRect.width / 2;
      var cy = rawRect.y + rawRect.height / 2;
      return [cx, cy];
    };
    View2.prototype.getCenter = function() {
      return this._center || this.getDefaultCenter();
    };
    View2.prototype.getZoom = function() {
      return this._zoom || 1;
    };
    View2.prototype.getRoamTransform = function() {
      return this._roamTransformable.getLocalTransform();
    };
    View2.prototype._updateCenterAndZoom = function() {
      var rawTransformMatrix = this._rawTransformable.getLocalTransform();
      var roamTransform = this._roamTransformable;
      var defaultCenter = this.getDefaultCenter();
      var center2 = this.getCenter();
      var zoom = this.getZoom();
      center2 = applyTransform([], center2, rawTransformMatrix);
      defaultCenter = applyTransform([], defaultCenter, rawTransformMatrix);
      roamTransform.originX = center2[0];
      roamTransform.originY = center2[1];
      roamTransform.x = defaultCenter[0] - center2[0];
      roamTransform.y = defaultCenter[1] - center2[1];
      roamTransform.scaleX = roamTransform.scaleY = zoom;
      this._updateTransform();
    };
    View2.prototype._updateTransform = function() {
      var roamTransformable = this._roamTransformable;
      var rawTransformable = this._rawTransformable;
      rawTransformable.parent = roamTransformable;
      roamTransformable.updateTransform();
      rawTransformable.updateTransform();
      copy2(this.transform || (this.transform = []), rawTransformable.transform || create());
      this._rawTransform = rawTransformable.getLocalTransform();
      this.invTransform = this.invTransform || [];
      invert(this.invTransform, this.transform);
      this.decomposeTransform();
    };
    View2.prototype.getTransformInfo = function() {
      var rawTransformable = this._rawTransformable;
      var roamTransformable = this._roamTransformable;
      var dummyTransformable = new Transformable_default();
      dummyTransformable.transform = roamTransformable.transform;
      dummyTransformable.decomposeTransform();
      return {
        roam: {
          x: dummyTransformable.x,
          y: dummyTransformable.y,
          scaleX: dummyTransformable.scaleX,
          scaleY: dummyTransformable.scaleY
        },
        raw: {
          x: rawTransformable.x,
          y: rawTransformable.y,
          scaleX: rawTransformable.scaleX,
          scaleY: rawTransformable.scaleY
        }
      };
    };
    View2.prototype.getViewRect = function() {
      return this._viewRect;
    };
    View2.prototype.getViewRectAfterRoam = function() {
      var rect = this.getBoundingRect().clone();
      rect.applyTransform(this.transform);
      return rect;
    };
    View2.prototype.dataToPoint = function(data, noRoam, out2) {
      var transform = noRoam ? this._rawTransform : this.transform;
      out2 = out2 || [];
      return transform ? v2ApplyTransform(out2, data, transform) : copy(out2, data);
    };
    View2.prototype.pointToData = function(point) {
      var invTransform = this.invTransform;
      return invTransform ? v2ApplyTransform([], point, invTransform) : [point[0], point[1]];
    };
    View2.prototype.convertToPixel = function(ecModel, finder, value) {
      var coordSys = getCoordSys(finder);
      return coordSys === this ? coordSys.dataToPoint(value) : null;
    };
    View2.prototype.convertFromPixel = function(ecModel, finder, pixel) {
      var coordSys = getCoordSys(finder);
      return coordSys === this ? coordSys.pointToData(pixel) : null;
    };
    View2.prototype.containPoint = function(point) {
      return this.getViewRectAfterRoam().contain(point[0], point[1]);
    };
    View2.dimensions = ["x", "y"];
    return View2;
  }(Transformable_default)
);
function getCoordSys(finder) {
  var seriesModel = finder.seriesModel;
  return seriesModel ? seriesModel.coordinateSystem : null;
}
var View_default = View;

// node_modules/zrender/lib/tool/parseXML.js
function parseXML(svg) {
  if (isString(svg)) {
    var parser = new DOMParser();
    svg = parser.parseFromString(svg, "text/xml");
  }
  var svgNode = svg;
  if (svgNode.nodeType === 9) {
    svgNode = svgNode.firstChild;
  }
  while (svgNode.nodeName.toLowerCase() !== "svg" || svgNode.nodeType !== 1) {
    svgNode = svgNode.nextSibling;
  }
  return svgNode;
}

// node_modules/zrender/lib/tool/parseSVG.js
var nodeParsers;
var INHERITABLE_STYLE_ATTRIBUTES_MAP = {
  "fill": "fill",
  "stroke": "stroke",
  "stroke-width": "lineWidth",
  "opacity": "opacity",
  "fill-opacity": "fillOpacity",
  "stroke-opacity": "strokeOpacity",
  "stroke-dasharray": "lineDash",
  "stroke-dashoffset": "lineDashOffset",
  "stroke-linecap": "lineCap",
  "stroke-linejoin": "lineJoin",
  "stroke-miterlimit": "miterLimit",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-style": "fontStyle",
  "font-weight": "fontWeight",
  "text-anchor": "textAlign",
  "visibility": "visibility",
  "display": "display"
};
var INHERITABLE_STYLE_ATTRIBUTES_MAP_KEYS = keys(INHERITABLE_STYLE_ATTRIBUTES_MAP);
var SELF_STYLE_ATTRIBUTES_MAP = {
  "alignment-baseline": "textBaseline",
  "stop-color": "stopColor"
};
var SELF_STYLE_ATTRIBUTES_MAP_KEYS = keys(SELF_STYLE_ATTRIBUTES_MAP);
var SVGParser = function() {
  function SVGParser2() {
    this._defs = {};
    this._root = null;
  }
  SVGParser2.prototype.parse = function(xml, opt) {
    opt = opt || {};
    var svg = parseXML(xml);
    if (true) {
      if (!svg) {
        throw new Error("Illegal svg");
      }
    }
    this._defsUsePending = [];
    var root = new Group_default();
    this._root = root;
    var named = [];
    var viewBox = svg.getAttribute("viewBox") || "";
    var width = parseFloat(svg.getAttribute("width") || opt.width);
    var height = parseFloat(svg.getAttribute("height") || opt.height);
    isNaN(width) && (width = null);
    isNaN(height) && (height = null);
    parseAttributes(svg, root, null, true, false);
    var child = svg.firstChild;
    while (child) {
      this._parseNode(child, root, named, null, false, false);
      child = child.nextSibling;
    }
    applyDefs(this._defs, this._defsUsePending);
    this._defsUsePending = [];
    var viewBoxRect;
    var viewBoxTransform;
    if (viewBox) {
      var viewBoxArr = splitNumberSequence(viewBox);
      if (viewBoxArr.length >= 4) {
        viewBoxRect = {
          x: parseFloat(viewBoxArr[0] || 0),
          y: parseFloat(viewBoxArr[1] || 0),
          width: parseFloat(viewBoxArr[2]),
          height: parseFloat(viewBoxArr[3])
        };
      }
    }
    if (viewBoxRect && width != null && height != null) {
      viewBoxTransform = makeViewBoxTransform(viewBoxRect, { x: 0, y: 0, width, height });
      if (!opt.ignoreViewBox) {
        var elRoot = root;
        root = new Group_default();
        root.add(elRoot);
        elRoot.scaleX = elRoot.scaleY = viewBoxTransform.scale;
        elRoot.x = viewBoxTransform.x;
        elRoot.y = viewBoxTransform.y;
      }
    }
    if (!opt.ignoreRootClip && width != null && height != null) {
      root.setClipPath(new Rect_default({
        shape: { x: 0, y: 0, width, height }
      }));
    }
    return {
      root,
      width,
      height,
      viewBoxRect,
      viewBoxTransform,
      named
    };
  };
  SVGParser2.prototype._parseNode = function(xmlNode, parentGroup, named, namedFrom, isInDefs, isInText) {
    var nodeName = xmlNode.nodeName.toLowerCase();
    var el;
    var namedFromForSub = namedFrom;
    if (nodeName === "defs") {
      isInDefs = true;
    }
    if (nodeName === "text") {
      isInText = true;
    }
    if (nodeName === "defs" || nodeName === "switch") {
      el = parentGroup;
    } else {
      if (!isInDefs) {
        var parser_1 = nodeParsers[nodeName];
        if (parser_1 && hasOwn(nodeParsers, nodeName)) {
          el = parser_1.call(this, xmlNode, parentGroup);
          var nameAttr = xmlNode.getAttribute("name");
          if (nameAttr) {
            var newNamed = {
              name: nameAttr,
              namedFrom: null,
              svgNodeTagLower: nodeName,
              el
            };
            named.push(newNamed);
            if (nodeName === "g") {
              namedFromForSub = newNamed;
            }
          } else if (namedFrom) {
            named.push({
              name: namedFrom.name,
              namedFrom,
              svgNodeTagLower: nodeName,
              el
            });
          }
          parentGroup.add(el);
        }
      }
      var parser = paintServerParsers[nodeName];
      if (parser && hasOwn(paintServerParsers, nodeName)) {
        var def = parser.call(this, xmlNode);
        var id = xmlNode.getAttribute("id");
        if (id) {
          this._defs[id] = def;
        }
      }
    }
    if (el && el.isGroup) {
      var child = xmlNode.firstChild;
      while (child) {
        if (child.nodeType === 1) {
          this._parseNode(child, el, named, namedFromForSub, isInDefs, isInText);
        } else if (child.nodeType === 3 && isInText) {
          this._parseText(child, el);
        }
        child = child.nextSibling;
      }
    }
  };
  SVGParser2.prototype._parseText = function(xmlNode, parentGroup) {
    var text = new TSpan_default({
      style: {
        text: xmlNode.textContent
      },
      silent: true,
      x: this._textX || 0,
      y: this._textY || 0
    });
    inheritStyle(parentGroup, text);
    parseAttributes(xmlNode, text, this._defsUsePending, false, false);
    applyTextAlignment(text, parentGroup);
    var textStyle = text.style;
    var fontSize = textStyle.fontSize;
    if (fontSize && fontSize < 9) {
      textStyle.fontSize = 9;
      text.scaleX *= fontSize / 9;
      text.scaleY *= fontSize / 9;
    }
    var font = (textStyle.fontSize || textStyle.fontFamily) && [
      textStyle.fontStyle,
      textStyle.fontWeight,
      (textStyle.fontSize || 12) + "px",
      textStyle.fontFamily || "sans-serif"
    ].join(" ");
    textStyle.font = font;
    var rect = text.getBoundingRect();
    this._textX += rect.width;
    parentGroup.add(text);
    return text;
  };
  SVGParser2.internalField = function() {
    nodeParsers = {
      "g": function(xmlNode, parentGroup) {
        var g = new Group_default();
        inheritStyle(parentGroup, g);
        parseAttributes(xmlNode, g, this._defsUsePending, false, false);
        return g;
      },
      "rect": function(xmlNode, parentGroup) {
        var rect = new Rect_default();
        inheritStyle(parentGroup, rect);
        parseAttributes(xmlNode, rect, this._defsUsePending, false, false);
        rect.setShape({
          x: parseFloat(xmlNode.getAttribute("x") || "0"),
          y: parseFloat(xmlNode.getAttribute("y") || "0"),
          width: parseFloat(xmlNode.getAttribute("width") || "0"),
          height: parseFloat(xmlNode.getAttribute("height") || "0")
        });
        rect.silent = true;
        return rect;
      },
      "circle": function(xmlNode, parentGroup) {
        var circle = new Circle_default();
        inheritStyle(parentGroup, circle);
        parseAttributes(xmlNode, circle, this._defsUsePending, false, false);
        circle.setShape({
          cx: parseFloat(xmlNode.getAttribute("cx") || "0"),
          cy: parseFloat(xmlNode.getAttribute("cy") || "0"),
          r: parseFloat(xmlNode.getAttribute("r") || "0")
        });
        circle.silent = true;
        return circle;
      },
      "line": function(xmlNode, parentGroup) {
        var line = new Line_default();
        inheritStyle(parentGroup, line);
        parseAttributes(xmlNode, line, this._defsUsePending, false, false);
        line.setShape({
          x1: parseFloat(xmlNode.getAttribute("x1") || "0"),
          y1: parseFloat(xmlNode.getAttribute("y1") || "0"),
          x2: parseFloat(xmlNode.getAttribute("x2") || "0"),
          y2: parseFloat(xmlNode.getAttribute("y2") || "0")
        });
        line.silent = true;
        return line;
      },
      "ellipse": function(xmlNode, parentGroup) {
        var ellipse = new Ellipse_default();
        inheritStyle(parentGroup, ellipse);
        parseAttributes(xmlNode, ellipse, this._defsUsePending, false, false);
        ellipse.setShape({
          cx: parseFloat(xmlNode.getAttribute("cx") || "0"),
          cy: parseFloat(xmlNode.getAttribute("cy") || "0"),
          rx: parseFloat(xmlNode.getAttribute("rx") || "0"),
          ry: parseFloat(xmlNode.getAttribute("ry") || "0")
        });
        ellipse.silent = true;
        return ellipse;
      },
      "polygon": function(xmlNode, parentGroup) {
        var pointsStr = xmlNode.getAttribute("points");
        var pointsArr;
        if (pointsStr) {
          pointsArr = parsePoints(pointsStr);
        }
        var polygon = new Polygon_default({
          shape: {
            points: pointsArr || []
          },
          silent: true
        });
        inheritStyle(parentGroup, polygon);
        parseAttributes(xmlNode, polygon, this._defsUsePending, false, false);
        return polygon;
      },
      "polyline": function(xmlNode, parentGroup) {
        var pointsStr = xmlNode.getAttribute("points");
        var pointsArr;
        if (pointsStr) {
          pointsArr = parsePoints(pointsStr);
        }
        var polyline = new Polyline_default({
          shape: {
            points: pointsArr || []
          },
          silent: true
        });
        inheritStyle(parentGroup, polyline);
        parseAttributes(xmlNode, polyline, this._defsUsePending, false, false);
        return polyline;
      },
      "image": function(xmlNode, parentGroup) {
        var img = new Image_default();
        inheritStyle(parentGroup, img);
        parseAttributes(xmlNode, img, this._defsUsePending, false, false);
        img.setStyle({
          image: xmlNode.getAttribute("xlink:href") || xmlNode.getAttribute("href"),
          x: +xmlNode.getAttribute("x"),
          y: +xmlNode.getAttribute("y"),
          width: +xmlNode.getAttribute("width"),
          height: +xmlNode.getAttribute("height")
        });
        img.silent = true;
        return img;
      },
      "text": function(xmlNode, parentGroup) {
        var x = xmlNode.getAttribute("x") || "0";
        var y = xmlNode.getAttribute("y") || "0";
        var dx = xmlNode.getAttribute("dx") || "0";
        var dy = xmlNode.getAttribute("dy") || "0";
        this._textX = parseFloat(x) + parseFloat(dx);
        this._textY = parseFloat(y) + parseFloat(dy);
        var g = new Group_default();
        inheritStyle(parentGroup, g);
        parseAttributes(xmlNode, g, this._defsUsePending, false, true);
        return g;
      },
      "tspan": function(xmlNode, parentGroup) {
        var x = xmlNode.getAttribute("x");
        var y = xmlNode.getAttribute("y");
        if (x != null) {
          this._textX = parseFloat(x);
        }
        if (y != null) {
          this._textY = parseFloat(y);
        }
        var dx = xmlNode.getAttribute("dx") || "0";
        var dy = xmlNode.getAttribute("dy") || "0";
        var g = new Group_default();
        inheritStyle(parentGroup, g);
        parseAttributes(xmlNode, g, this._defsUsePending, false, true);
        this._textX += parseFloat(dx);
        this._textY += parseFloat(dy);
        return g;
      },
      "path": function(xmlNode, parentGroup) {
        var d = xmlNode.getAttribute("d") || "";
        var path = createFromString(d);
        inheritStyle(parentGroup, path);
        parseAttributes(xmlNode, path, this._defsUsePending, false, false);
        path.silent = true;
        return path;
      }
    };
  }();
  return SVGParser2;
}();
var paintServerParsers = {
  "lineargradient": function(xmlNode) {
    var x1 = parseInt(xmlNode.getAttribute("x1") || "0", 10);
    var y1 = parseInt(xmlNode.getAttribute("y1") || "0", 10);
    var x2 = parseInt(xmlNode.getAttribute("x2") || "10", 10);
    var y2 = parseInt(xmlNode.getAttribute("y2") || "0", 10);
    var gradient = new LinearGradient_default(x1, y1, x2, y2);
    parsePaintServerUnit(xmlNode, gradient);
    parseGradientColorStops(xmlNode, gradient);
    return gradient;
  },
  "radialgradient": function(xmlNode) {
    var cx = parseInt(xmlNode.getAttribute("cx") || "0", 10);
    var cy = parseInt(xmlNode.getAttribute("cy") || "0", 10);
    var r = parseInt(xmlNode.getAttribute("r") || "0", 10);
    var gradient = new RadialGradient_default(cx, cy, r);
    parsePaintServerUnit(xmlNode, gradient);
    parseGradientColorStops(xmlNode, gradient);
    return gradient;
  }
};
function parsePaintServerUnit(xmlNode, gradient) {
  var gradientUnits = xmlNode.getAttribute("gradientUnits");
  if (gradientUnits === "userSpaceOnUse") {
    gradient.global = true;
  }
}
function parseGradientColorStops(xmlNode, gradient) {
  var stop2 = xmlNode.firstChild;
  while (stop2) {
    if (stop2.nodeType === 1 && stop2.nodeName.toLocaleLowerCase() === "stop") {
      var offsetStr = stop2.getAttribute("offset");
      var offset = void 0;
      if (offsetStr && offsetStr.indexOf("%") > 0) {
        offset = parseInt(offsetStr, 10) / 100;
      } else if (offsetStr) {
        offset = parseFloat(offsetStr);
      } else {
        offset = 0;
      }
      var styleVals = {};
      parseInlineStyle(stop2, styleVals, styleVals);
      var stopColor = styleVals.stopColor || stop2.getAttribute("stop-color") || "#000000";
      gradient.colorStops.push({
        offset,
        color: stopColor
      });
    }
    stop2 = stop2.nextSibling;
  }
}
function inheritStyle(parent, child) {
  if (parent && parent.__inheritedStyle) {
    if (!child.__inheritedStyle) {
      child.__inheritedStyle = {};
    }
    defaults(child.__inheritedStyle, parent.__inheritedStyle);
  }
}
function parsePoints(pointsString) {
  var list = splitNumberSequence(pointsString);
  var points4 = [];
  for (var i = 0; i < list.length; i += 2) {
    var x = parseFloat(list[i]);
    var y = parseFloat(list[i + 1]);
    points4.push([x, y]);
  }
  return points4;
}
function parseAttributes(xmlNode, el, defsUsePending, onlyInlineStyle, isTextGroup) {
  var disp = el;
  var inheritedStyle = disp.__inheritedStyle = disp.__inheritedStyle || {};
  var selfStyle = {};
  if (xmlNode.nodeType === 1) {
    parseTransformAttribute(xmlNode, el);
    parseInlineStyle(xmlNode, inheritedStyle, selfStyle);
    if (!onlyInlineStyle) {
      parseAttributeStyle(xmlNode, inheritedStyle, selfStyle);
    }
  }
  disp.style = disp.style || {};
  if (inheritedStyle.fill != null) {
    disp.style.fill = getFillStrokeStyle(disp, "fill", inheritedStyle.fill, defsUsePending);
  }
  if (inheritedStyle.stroke != null) {
    disp.style.stroke = getFillStrokeStyle(disp, "stroke", inheritedStyle.stroke, defsUsePending);
  }
  each([
    "lineWidth",
    "opacity",
    "fillOpacity",
    "strokeOpacity",
    "miterLimit",
    "fontSize"
  ], function(propName) {
    if (inheritedStyle[propName] != null) {
      disp.style[propName] = parseFloat(inheritedStyle[propName]);
    }
  });
  each([
    "lineDashOffset",
    "lineCap",
    "lineJoin",
    "fontWeight",
    "fontFamily",
    "fontStyle",
    "textAlign"
  ], function(propName) {
    if (inheritedStyle[propName] != null) {
      disp.style[propName] = inheritedStyle[propName];
    }
  });
  if (isTextGroup) {
    disp.__selfStyle = selfStyle;
  }
  if (inheritedStyle.lineDash) {
    disp.style.lineDash = map(splitNumberSequence(inheritedStyle.lineDash), function(str) {
      return parseFloat(str);
    });
  }
  if (inheritedStyle.visibility === "hidden" || inheritedStyle.visibility === "collapse") {
    disp.invisible = true;
  }
  if (inheritedStyle.display === "none") {
    disp.ignore = true;
  }
}
function applyTextAlignment(text, parentGroup) {
  var parentSelfStyle = parentGroup.__selfStyle;
  if (parentSelfStyle) {
    var textBaseline = parentSelfStyle.textBaseline;
    var zrTextBaseline = textBaseline;
    if (!textBaseline || textBaseline === "auto") {
      zrTextBaseline = "alphabetic";
    } else if (textBaseline === "baseline") {
      zrTextBaseline = "alphabetic";
    } else if (textBaseline === "before-edge" || textBaseline === "text-before-edge") {
      zrTextBaseline = "top";
    } else if (textBaseline === "after-edge" || textBaseline === "text-after-edge") {
      zrTextBaseline = "bottom";
    } else if (textBaseline === "central" || textBaseline === "mathematical") {
      zrTextBaseline = "middle";
    }
    text.style.textBaseline = zrTextBaseline;
  }
  var parentInheritedStyle = parentGroup.__inheritedStyle;
  if (parentInheritedStyle) {
    var textAlign = parentInheritedStyle.textAlign;
    var zrTextAlign = textAlign;
    if (textAlign) {
      if (textAlign === "middle") {
        zrTextAlign = "center";
      }
      text.style.textAlign = zrTextAlign;
    }
  }
}
var urlRegex = /^url\(\s*#(.*?)\)/;
function getFillStrokeStyle(el, method, str, defsUsePending) {
  var urlMatch = str && str.match(urlRegex);
  if (urlMatch) {
    var url = trim(urlMatch[1]);
    defsUsePending.push([el, method, url]);
    return;
  }
  if (str === "none") {
    str = null;
  }
  return str;
}
function applyDefs(defs, defsUsePending) {
  for (var i = 0; i < defsUsePending.length; i++) {
    var item = defsUsePending[i];
    item[0].style[item[1]] = defs[item[2]];
  }
}
var numberReg2 = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
function splitNumberSequence(rawStr) {
  return rawStr.match(numberReg2) || [];
}
var transformRegex = /(translate|scale|rotate|skewX|skewY|matrix)\(([\-\s0-9\.eE,]*)\)/g;
var DEGREE_TO_ANGLE = Math.PI / 180;
function parseTransformAttribute(xmlNode, node) {
  var transform = xmlNode.getAttribute("transform");
  if (transform) {
    transform = transform.replace(/,/g, " ");
    var transformOps_1 = [];
    var mt = null;
    transform.replace(transformRegex, function(str, type2, value2) {
      transformOps_1.push(type2, value2);
      return "";
    });
    for (var i = transformOps_1.length - 1; i > 0; i -= 2) {
      var value = transformOps_1[i];
      var type = transformOps_1[i - 1];
      var valueArr = splitNumberSequence(value);
      mt = mt || create();
      switch (type) {
        case "translate":
          translate(mt, mt, [parseFloat(valueArr[0]), parseFloat(valueArr[1] || "0")]);
          break;
        case "scale":
          scale2(mt, mt, [parseFloat(valueArr[0]), parseFloat(valueArr[1] || valueArr[0])]);
          break;
        case "rotate":
          rotate(mt, mt, -parseFloat(valueArr[0]) * DEGREE_TO_ANGLE);
          break;
        case "skewX":
          var sx = Math.tan(parseFloat(valueArr[0]) * DEGREE_TO_ANGLE);
          mul(mt, [1, 0, sx, 1, 0, 0], mt);
          break;
        case "skewY":
          var sy = Math.tan(parseFloat(valueArr[0]) * DEGREE_TO_ANGLE);
          mul(mt, [1, sy, 0, 1, 0, 0], mt);
          break;
        case "matrix":
          mt[0] = parseFloat(valueArr[0]);
          mt[1] = parseFloat(valueArr[1]);
          mt[2] = parseFloat(valueArr[2]);
          mt[3] = parseFloat(valueArr[3]);
          mt[4] = parseFloat(valueArr[4]);
          mt[5] = parseFloat(valueArr[5]);
          break;
      }
    }
    node.setLocalTransform(mt);
  }
}
var styleRegex = /([^\s:;]+)\s*:\s*([^:;]+)/g;
function parseInlineStyle(xmlNode, inheritableStyleResult, selfStyleResult) {
  var style = xmlNode.getAttribute("style");
  if (!style) {
    return;
  }
  styleRegex.lastIndex = 0;
  var styleRegResult;
  while ((styleRegResult = styleRegex.exec(style)) != null) {
    var svgStlAttr = styleRegResult[1];
    var zrInheritableStlAttr = hasOwn(INHERITABLE_STYLE_ATTRIBUTES_MAP, svgStlAttr) ? INHERITABLE_STYLE_ATTRIBUTES_MAP[svgStlAttr] : null;
    if (zrInheritableStlAttr) {
      inheritableStyleResult[zrInheritableStlAttr] = styleRegResult[2];
    }
    var zrSelfStlAttr = hasOwn(SELF_STYLE_ATTRIBUTES_MAP, svgStlAttr) ? SELF_STYLE_ATTRIBUTES_MAP[svgStlAttr] : null;
    if (zrSelfStlAttr) {
      selfStyleResult[zrSelfStlAttr] = styleRegResult[2];
    }
  }
}
function parseAttributeStyle(xmlNode, inheritableStyleResult, selfStyleResult) {
  for (var i = 0; i < INHERITABLE_STYLE_ATTRIBUTES_MAP_KEYS.length; i++) {
    var svgAttrName = INHERITABLE_STYLE_ATTRIBUTES_MAP_KEYS[i];
    var attrValue = xmlNode.getAttribute(svgAttrName);
    if (attrValue != null) {
      inheritableStyleResult[INHERITABLE_STYLE_ATTRIBUTES_MAP[svgAttrName]] = attrValue;
    }
  }
  for (var i = 0; i < SELF_STYLE_ATTRIBUTES_MAP_KEYS.length; i++) {
    var svgAttrName = SELF_STYLE_ATTRIBUTES_MAP_KEYS[i];
    var attrValue = xmlNode.getAttribute(svgAttrName);
    if (attrValue != null) {
      selfStyleResult[SELF_STYLE_ATTRIBUTES_MAP[svgAttrName]] = attrValue;
    }
  }
}
function makeViewBoxTransform(viewBoxRect, boundingRect) {
  var scaleX = boundingRect.width / viewBoxRect.width;
  var scaleY = boundingRect.height / viewBoxRect.height;
  var scale4 = Math.min(scaleX, scaleY);
  return {
    scale: scale4,
    x: -(viewBoxRect.x + viewBoxRect.width / 2) * scale4 + (boundingRect.x + boundingRect.width / 2),
    y: -(viewBoxRect.y + viewBoxRect.height / 2) * scale4 + (boundingRect.y + boundingRect.height / 2)
  };
}
function parseSVG(xml, opt) {
  var parser = new SVGParser();
  return parser.parse(xml, opt);
}

// node_modules/echarts/lib/coord/geo/GeoSVGResource.js
var REGION_AVAILABLE_SVG_TAG_MAP = createHashMap([
  "rect",
  "circle",
  "line",
  "ellipse",
  "polygon",
  "polyline",
  "path",
  // <text> <tspan> are also enabled because some SVG might paint text itself,
  // but still need to trigger events or tooltip.
  "text",
  "tspan",
  // <g> is also enabled because this case: if multiple tags share one name
  // and need label displayed, every tags will display the name, which is not
  // expected. So we can put them into a <g name="xxx">. Thereby only one label
  // displayed and located based on the bounding rect of the <g>.
  "g"
]);
var GeoSVGResource = (
  /** @class */
  function() {
    function GeoSVGResource2(mapName, svg) {
      this.type = "geoSVG";
      this._usedGraphicMap = createHashMap();
      this._freedGraphics = [];
      this._mapName = mapName;
      this._parsedXML = parseXML(svg);
    }
    GeoSVGResource2.prototype.load = function() {
      var firstGraphic = this._firstGraphic;
      if (!firstGraphic) {
        firstGraphic = this._firstGraphic = this._buildGraphic(this._parsedXML);
        this._freedGraphics.push(firstGraphic);
        this._boundingRect = this._firstGraphic.boundingRect.clone();
        var _a2 = createRegions(firstGraphic.named), regions = _a2.regions, regionsMap = _a2.regionsMap;
        this._regions = regions;
        this._regionsMap = regionsMap;
      }
      return {
        boundingRect: this._boundingRect,
        regions: this._regions,
        regionsMap: this._regionsMap
      };
    };
    GeoSVGResource2.prototype._buildGraphic = function(svgXML) {
      var result;
      var rootFromParse;
      try {
        result = svgXML && parseSVG(svgXML, {
          ignoreViewBox: true,
          ignoreRootClip: true
        }) || {};
        rootFromParse = result.root;
        assert(rootFromParse != null);
      } catch (e2) {
        throw new Error("Invalid svg format\n" + e2.message);
      }
      var root = new Group_default();
      root.add(rootFromParse);
      root.isGeoSVGGraphicRoot = true;
      var svgWidth = result.width;
      var svgHeight = result.height;
      var viewBoxRect = result.viewBoxRect;
      var boundingRect = this._boundingRect;
      if (!boundingRect) {
        var bRectX = void 0;
        var bRectY = void 0;
        var bRectWidth = void 0;
        var bRectHeight = void 0;
        if (svgWidth != null) {
          bRectX = 0;
          bRectWidth = svgWidth;
        } else if (viewBoxRect) {
          bRectX = viewBoxRect.x;
          bRectWidth = viewBoxRect.width;
        }
        if (svgHeight != null) {
          bRectY = 0;
          bRectHeight = svgHeight;
        } else if (viewBoxRect) {
          bRectY = viewBoxRect.y;
          bRectHeight = viewBoxRect.height;
        }
        if (bRectX == null || bRectY == null) {
          var calculatedBoundingRect = rootFromParse.getBoundingRect();
          if (bRectX == null) {
            bRectX = calculatedBoundingRect.x;
            bRectWidth = calculatedBoundingRect.width;
          }
          if (bRectY == null) {
            bRectY = calculatedBoundingRect.y;
            bRectHeight = calculatedBoundingRect.height;
          }
        }
        boundingRect = this._boundingRect = new BoundingRect_default(bRectX, bRectY, bRectWidth, bRectHeight);
      }
      if (viewBoxRect) {
        var viewBoxTransform = makeViewBoxTransform(viewBoxRect, boundingRect);
        rootFromParse.scaleX = rootFromParse.scaleY = viewBoxTransform.scale;
        rootFromParse.x = viewBoxTransform.x;
        rootFromParse.y = viewBoxTransform.y;
      }
      root.setClipPath(new Rect_default({
        shape: boundingRect.plain()
      }));
      var named = [];
      each(result.named, function(namedItem) {
        if (REGION_AVAILABLE_SVG_TAG_MAP.get(namedItem.svgNodeTagLower) != null) {
          named.push(namedItem);
          setSilent(namedItem.el);
        }
      });
      return {
        root,
        boundingRect,
        named
      };
    };
    GeoSVGResource2.prototype.useGraphic = function(hostKey) {
      var usedRootMap = this._usedGraphicMap;
      var svgGraphic = usedRootMap.get(hostKey);
      if (svgGraphic) {
        return svgGraphic;
      }
      svgGraphic = this._freedGraphics.pop() || this._buildGraphic(this._parsedXML);
      usedRootMap.set(hostKey, svgGraphic);
      return svgGraphic;
    };
    GeoSVGResource2.prototype.freeGraphic = function(hostKey) {
      var usedRootMap = this._usedGraphicMap;
      var svgGraphic = usedRootMap.get(hostKey);
      if (svgGraphic) {
        usedRootMap.removeKey(hostKey);
        this._freedGraphics.push(svgGraphic);
      }
    };
    return GeoSVGResource2;
  }()
);
function setSilent(el) {
  el.silent = false;
  if (el.isGroup) {
    el.traverse(function(child) {
      child.silent = false;
    });
  }
}
function createRegions(named) {
  var regions = [];
  var regionsMap = createHashMap();
  each(named, function(namedItem) {
    if (namedItem.namedFrom != null) {
      return;
    }
    var region = new GeoSVGRegion(namedItem.name, namedItem.el);
    regions.push(region);
    regionsMap.set(namedItem.name, region);
  });
  return {
    regions,
    regionsMap
  };
}

// node_modules/echarts/lib/coord/geo/fix/nanhai.js
var geoCoord = [126, 25];
var nanhaiName = "南海诸岛";
var points2 = [[[0, 3.5], [7, 11.2], [15, 11.9], [30, 7], [42, 0.7], [52, 0.7], [56, 7.7], [59, 0.7], [64, 0.7], [64, 0], [5, 0], [0, 3.5]], [[13, 16.1], [19, 14.7], [16, 21.7], [11, 23.1], [13, 16.1]], [[12, 32.2], [14, 38.5], [15, 38.5], [13, 32.2], [12, 32.2]], [[16, 47.6], [12, 53.2], [13, 53.2], [18, 47.6], [16, 47.6]], [[6, 64.4], [8, 70], [9, 70], [8, 64.4], [6, 64.4]], [[23, 82.6], [29, 79.8], [30, 79.8], [25, 82.6], [23, 82.6]], [[37, 70.7], [43, 62.3], [44, 62.3], [39, 70.7], [37, 70.7]], [[48, 51.1], [51, 45.5], [53, 45.5], [50, 51.1], [48, 51.1]], [[51, 35], [51, 28.7], [53, 28.7], [53, 35], [51, 35]], [[52, 22.4], [55, 17.5], [56, 17.5], [53, 22.4], [52, 22.4]], [[58, 12.6], [62, 7], [63, 7], [60, 12.6], [58, 12.6]], [[0, 3.5], [0, 93.1], [64, 93.1], [64, 0], [63, 0], [63, 92.4], [1, 92.4], [1, 3.5], [0, 3.5]]];
for (i = 0; i < points2.length; i++) {
  for (k = 0; k < points2[i].length; k++) {
    points2[i][k][0] /= 10.5;
    points2[i][k][1] /= -10.5 / 0.75;
    points2[i][k][0] += geoCoord[0];
    points2[i][k][1] += geoCoord[1];
  }
}
var k;
var i;
function fixNanhai(mapType, regions) {
  if (mapType === "china") {
    for (var i = 0; i < regions.length; i++) {
      if (regions[i].name === nanhaiName) {
        return;
      }
    }
    regions.push(new GeoJSONRegion(nanhaiName, map(points2, function(exterior) {
      return {
        type: "polygon",
        exterior
      };
    }), geoCoord));
  }
}

// node_modules/echarts/lib/coord/geo/fix/textCoord.js
var coordsOffsetMap = {
  "南海诸岛": [32, 80],
  // 全国
  "广东": [0, -10],
  "香港": [10, 5],
  "澳门": [-10, 10],
  // '北京': [-10, 0],
  "天津": [5, 5]
};
function fixTextCoords(mapType, region) {
  if (mapType === "china") {
    var coordFix = coordsOffsetMap[region.name];
    if (coordFix) {
      var cp = region.getCenter();
      cp[0] += coordFix[0] / 10.5;
      cp[1] += -coordFix[1] / (10.5 / 0.75);
      region.setCenter(cp);
    }
  }
}

// node_modules/echarts/lib/coord/geo/fix/diaoyuIsland.js
var points3 = [[[123.45165252685547, 25.73527164402261], [123.49731445312499, 25.73527164402261], [123.49731445312499, 25.750734064600884], [123.45165252685547, 25.750734064600884], [123.45165252685547, 25.73527164402261]]];
function fixDiaoyuIsland(mapType, region) {
  if (mapType === "china" && region.name === "台湾") {
    region.geometries.push({
      type: "polygon",
      exterior: points3[0]
    });
  }
}

// node_modules/echarts/lib/coord/geo/GeoJSONResource.js
var DEFAULT_NAME_PROPERTY = "name";
var GeoJSONResource = (
  /** @class */
  function() {
    function GeoJSONResource2(mapName, geoJSON, specialAreas) {
      this.type = "geoJSON";
      this._parsedMap = createHashMap();
      this._mapName = mapName;
      this._specialAreas = specialAreas;
      this._geoJSON = parseInput(geoJSON);
    }
    GeoJSONResource2.prototype.load = function(nameMap, nameProperty) {
      nameProperty = nameProperty || DEFAULT_NAME_PROPERTY;
      var parsed = this._parsedMap.get(nameProperty);
      if (!parsed) {
        var rawRegions = this._parseToRegions(nameProperty);
        parsed = this._parsedMap.set(nameProperty, {
          regions: rawRegions,
          boundingRect: calculateBoundingRect(rawRegions)
        });
      }
      var regionsMap = createHashMap();
      var finalRegions = [];
      each(parsed.regions, function(region) {
        var regionName = region.name;
        if (nameMap && hasOwn(nameMap, regionName)) {
          region = region.cloneShallow(regionName = nameMap[regionName]);
        }
        finalRegions.push(region);
        regionsMap.set(regionName, region);
      });
      return {
        regions: finalRegions,
        boundingRect: parsed.boundingRect || new BoundingRect_default(0, 0, 0, 0),
        regionsMap
      };
    };
    GeoJSONResource2.prototype._parseToRegions = function(nameProperty) {
      var mapName = this._mapName;
      var geoJSON = this._geoJSON;
      var rawRegions;
      try {
        rawRegions = geoJSON ? parseGeoJSON(geoJSON, nameProperty) : [];
      } catch (e2) {
        throw new Error("Invalid geoJson format\n" + e2.message);
      }
      fixNanhai(mapName, rawRegions);
      each(rawRegions, function(region) {
        var regionName = region.name;
        fixTextCoords(mapName, region);
        fixDiaoyuIsland(mapName, region);
        var specialArea = this._specialAreas && this._specialAreas[regionName];
        if (specialArea) {
          region.transformTo(specialArea.left, specialArea.top, specialArea.width, specialArea.height);
        }
      }, this);
      return rawRegions;
    };
    GeoJSONResource2.prototype.getMapForUser = function() {
      return {
        // For backward compatibility, use geoJson
        // PENDING: it has been returning them without clone.
        // do we need to avoid outsite modification?
        geoJson: this._geoJSON,
        geoJSON: this._geoJSON,
        specialAreas: this._specialAreas
      };
    };
    return GeoJSONResource2;
  }()
);
function calculateBoundingRect(regions) {
  var rect;
  for (var i = 0; i < regions.length; i++) {
    var regionRect = regions[i].getBoundingRect();
    rect = rect || regionRect.clone();
    rect.union(regionRect);
  }
  return rect;
}
function parseInput(source) {
  return !isString(source) ? source : typeof JSON !== "undefined" && JSON.parse ? JSON.parse(source) : new Function("return (" + source + ");")();
}

// node_modules/echarts/lib/coord/geo/geoSourceManager.js
var storage = createHashMap();
var geoSourceManager_default = {
  /**
   * Compatible with previous `echarts.registerMap`.
   *
   * @usage
   * ```js
   *
   * echarts.registerMap('USA', geoJson, specialAreas);
   *
   * echarts.registerMap('USA', {
   *     geoJson: geoJson,
   *     specialAreas: {...}
   * });
   * echarts.registerMap('USA', {
   *     geoJSON: geoJson,
   *     specialAreas: {...}
   * });
   *
   * echarts.registerMap('airport', {
   *     svg: svg
   * }
   * ```
   *
   * Note:
   * Do not support that register multiple geoJSON or SVG
   * one map name. Because different geoJSON and SVG have
   * different unit. It's not easy to make sure how those
   * units are mapping/normalize.
   * If intending to use multiple geoJSON or SVG, we can
   * use multiple geo coordinate system.
   */
  registerMap: function(mapName, rawDef, rawSpecialAreas) {
    if (rawDef.svg) {
      var resource = new GeoSVGResource(mapName, rawDef.svg);
      storage.set(mapName, resource);
    } else {
      var geoJSON = rawDef.geoJson || rawDef.geoJSON;
      if (geoJSON && !rawDef.features) {
        rawSpecialAreas = rawDef.specialAreas;
      } else {
        geoJSON = rawDef;
      }
      var resource = new GeoJSONResource(mapName, geoJSON, rawSpecialAreas);
      storage.set(mapName, resource);
    }
  },
  getGeoResource: function(mapName) {
    return storage.get(mapName);
  },
  /**
   * Only for exporting to users.
   * **MUST NOT** used internally.
   */
  getMapForUser: function(mapName) {
    var resource = storage.get(mapName);
    return resource && resource.type === "geoJSON" && resource.getMapForUser();
  },
  load: function(mapName, nameMap, nameProperty) {
    var resource = storage.get(mapName);
    if (!resource) {
      if (true) {
        console.error("Map " + mapName + " not exists. The GeoJSON of the map must be provided.");
      }
      return;
    }
    return resource.load(nameMap, nameProperty);
  }
};

// node_modules/echarts/lib/coord/geo/Geo.js
var GEO_DEFAULT_PARAMS = {
  "geoJSON": {
    aspectScale: 0.75,
    invertLongitute: true
  },
  "geoSVG": {
    aspectScale: 1,
    invertLongitute: false
  }
};
var geo2DDimensions = ["lng", "lat"];
var Geo = (
  /** @class */
  function(_super) {
    __extends(Geo2, _super);
    function Geo2(name, map3, opt) {
      var _this = _super.call(this, name) || this;
      _this.dimensions = geo2DDimensions;
      _this.type = "geo";
      _this._nameCoordMap = createHashMap();
      _this.map = map3;
      var projection = opt.projection;
      var source = geoSourceManager_default.load(map3, opt.nameMap, opt.nameProperty);
      var resource = geoSourceManager_default.getGeoResource(map3);
      var resourceType = _this.resourceType = resource ? resource.type : null;
      var regions = _this.regions = source.regions;
      var defaultParams = GEO_DEFAULT_PARAMS[resource.type];
      _this._regionsMap = source.regionsMap;
      _this.regions = source.regions;
      if (projection) {
        if (resourceType === "geoSVG") {
          if (true) {
            warn("Map " + map3 + " with SVG source can't use projection. Only GeoJSON source supports projection.");
          }
          projection = null;
        }
        if (!(projection.project && projection.unproject)) {
          if (true) {
            warn("project and unproject must be both provided in the projeciton.");
          }
          projection = null;
        }
      }
      _this.projection = projection;
      var boundingRect;
      if (projection) {
        for (var i = 0; i < regions.length; i++) {
          var regionRect = regions[i].getBoundingRect(projection);
          boundingRect = boundingRect || regionRect.clone();
          boundingRect.union(regionRect);
        }
      } else {
        boundingRect = source.boundingRect;
      }
      _this.setBoundingRect(boundingRect.x, boundingRect.y, boundingRect.width, boundingRect.height);
      _this.aspectScale = projection ? 1 : retrieve2(opt.aspectScale, defaultParams.aspectScale);
      _this._invertLongitute = projection ? false : defaultParams.invertLongitute;
      return _this;
    }
    Geo2.prototype._transformTo = function(x, y, width, height) {
      var rect = this.getBoundingRect();
      var invertLongitute = this._invertLongitute;
      rect = rect.clone();
      if (invertLongitute) {
        rect.y = -rect.y - rect.height;
      }
      var rawTransformable = this._rawTransformable;
      rawTransformable.transform = rect.calculateTransform(new BoundingRect_default(x, y, width, height));
      var rawParent = rawTransformable.parent;
      rawTransformable.parent = null;
      rawTransformable.decomposeTransform();
      rawTransformable.parent = rawParent;
      if (invertLongitute) {
        rawTransformable.scaleY = -rawTransformable.scaleY;
      }
      this._updateTransform();
    };
    Geo2.prototype.getRegion = function(name) {
      return this._regionsMap.get(name);
    };
    Geo2.prototype.getRegionByCoord = function(coord) {
      var regions = this.regions;
      for (var i = 0; i < regions.length; i++) {
        var region = regions[i];
        if (region.type === "geoJSON" && region.contain(coord)) {
          return regions[i];
        }
      }
    };
    Geo2.prototype.addGeoCoord = function(name, geoCoord2) {
      this._nameCoordMap.set(name, geoCoord2);
    };
    Geo2.prototype.getGeoCoord = function(name) {
      var region = this._regionsMap.get(name);
      return this._nameCoordMap.get(name) || region && region.getCenter();
    };
    Geo2.prototype.dataToPoint = function(data, noRoam, out2) {
      if (isString(data)) {
        data = this.getGeoCoord(data);
      }
      if (data) {
        var projection = this.projection;
        if (projection) {
          data = projection.project(data);
        }
        return data && this.projectedToPoint(data, noRoam, out2);
      }
    };
    Geo2.prototype.pointToData = function(point) {
      var projection = this.projection;
      if (projection) {
        point = projection.unproject(point);
      }
      return point && this.pointToProjected(point);
    };
    Geo2.prototype.pointToProjected = function(point) {
      return _super.prototype.pointToData.call(this, point);
    };
    Geo2.prototype.projectedToPoint = function(projected, noRoam, out2) {
      return _super.prototype.dataToPoint.call(this, projected, noRoam, out2);
    };
    Geo2.prototype.convertToPixel = function(ecModel, finder, value) {
      var coordSys = getCoordSys2(finder);
      return coordSys === this ? coordSys.dataToPoint(value) : null;
    };
    Geo2.prototype.convertFromPixel = function(ecModel, finder, pixel) {
      var coordSys = getCoordSys2(finder);
      return coordSys === this ? coordSys.pointToData(pixel) : null;
    };
    return Geo2;
  }(View_default)
);
mixin(Geo, View_default);
function getCoordSys2(finder) {
  var geoModel = finder.geoModel;
  var seriesModel = finder.seriesModel;
  return geoModel ? geoModel.coordinateSystem : seriesModel ? seriesModel.coordinateSystem || (seriesModel.getReferringComponents("geo", SINGLE_REFERRING).models[0] || {}).coordinateSystem : null;
}
var Geo_default = Geo;

// node_modules/echarts/lib/coord/geo/geoCreator.js
function resizeGeo(geoModel, api) {
  var boundingCoords = geoModel.get("boundingCoords");
  if (boundingCoords != null) {
    var leftTop_1 = boundingCoords[0];
    var rightBottom_1 = boundingCoords[1];
    if (!(isFinite(leftTop_1[0]) && isFinite(leftTop_1[1]) && isFinite(rightBottom_1[0]) && isFinite(rightBottom_1[1]))) {
      if (true) {
        console.error("Invalid boundingCoords");
      }
    } else {
      var projection_1 = this.projection;
      if (projection_1) {
        var xMin = leftTop_1[0];
        var yMin = leftTop_1[1];
        var xMax = rightBottom_1[0];
        var yMax = rightBottom_1[1];
        leftTop_1 = [Infinity, Infinity];
        rightBottom_1 = [-Infinity, -Infinity];
        var sampleLine = function(x0, y0, x1, y1) {
          var dx = x1 - x0;
          var dy = y1 - y0;
          for (var i = 0; i <= 100; i++) {
            var p = i / 100;
            var pt = projection_1.project([x0 + dx * p, y0 + dy * p]);
            min(leftTop_1, leftTop_1, pt);
            max(rightBottom_1, rightBottom_1, pt);
          }
        };
        sampleLine(xMin, yMin, xMax, yMin);
        sampleLine(xMax, yMin, xMax, yMax);
        sampleLine(xMax, yMax, xMin, yMax);
        sampleLine(xMin, yMax, xMax, yMin);
      }
      this.setBoundingRect(leftTop_1[0], leftTop_1[1], rightBottom_1[0] - leftTop_1[0], rightBottom_1[1] - leftTop_1[1]);
    }
  }
  var rect = this.getBoundingRect();
  var centerOption = geoModel.get("layoutCenter");
  var sizeOption = geoModel.get("layoutSize");
  var viewWidth = api.getWidth();
  var viewHeight = api.getHeight();
  var aspect = rect.width / rect.height * this.aspectScale;
  var useCenterAndSize = false;
  var center2;
  var size;
  if (centerOption && sizeOption) {
    center2 = [parsePercent2(centerOption[0], viewWidth), parsePercent2(centerOption[1], viewHeight)];
    size = parsePercent2(sizeOption, Math.min(viewWidth, viewHeight));
    if (!isNaN(center2[0]) && !isNaN(center2[1]) && !isNaN(size)) {
      useCenterAndSize = true;
    } else {
      if (true) {
        console.warn("Given layoutCenter or layoutSize data are invalid. Use left/top/width/height instead.");
      }
    }
  }
  var viewRect;
  if (useCenterAndSize) {
    viewRect = {};
    if (aspect > 1) {
      viewRect.width = size;
      viewRect.height = size / aspect;
    } else {
      viewRect.height = size;
      viewRect.width = size * aspect;
    }
    viewRect.y = center2[1] - viewRect.height / 2;
    viewRect.x = center2[0] - viewRect.width / 2;
  } else {
    var boxLayoutOption = geoModel.getBoxLayoutParams();
    boxLayoutOption.aspect = aspect;
    viewRect = getLayoutRect(boxLayoutOption, {
      width: viewWidth,
      height: viewHeight
    });
  }
  this.setViewRect(viewRect.x, viewRect.y, viewRect.width, viewRect.height);
  this.setCenter(geoModel.get("center"), api);
  this.setZoom(geoModel.get("zoom"));
}
function setGeoCoords(geo, model) {
  each(model.get("geoCoord"), function(geoCoord2, name) {
    geo.addGeoCoord(name, geoCoord2);
  });
}
var GeoCreator = (
  /** @class */
  function() {
    function GeoCreator2() {
      this.dimensions = geo2DDimensions;
    }
    GeoCreator2.prototype.create = function(ecModel, api) {
      var geoList = [];
      function getCommonGeoProperties(model) {
        return {
          nameProperty: model.get("nameProperty"),
          aspectScale: model.get("aspectScale"),
          projection: model.get("projection")
        };
      }
      ecModel.eachComponent("geo", function(geoModel, idx) {
        var mapName = geoModel.get("map");
        var geo = new Geo_default(mapName + idx, mapName, extend({
          nameMap: geoModel.get("nameMap")
        }, getCommonGeoProperties(geoModel)));
        geo.zoomLimit = geoModel.get("scaleLimit");
        geoList.push(geo);
        geoModel.coordinateSystem = geo;
        geo.model = geoModel;
        geo.resize = resizeGeo;
        geo.resize(geoModel, api);
      });
      ecModel.eachSeries(function(seriesModel) {
        var coordSys = seriesModel.get("coordinateSystem");
        if (coordSys === "geo") {
          var geoIndex = seriesModel.get("geoIndex") || 0;
          seriesModel.coordinateSystem = geoList[geoIndex];
        }
      });
      var mapModelGroupBySeries = {};
      ecModel.eachSeriesByType("map", function(seriesModel) {
        if (!seriesModel.getHostGeoModel()) {
          var mapType = seriesModel.getMapType();
          mapModelGroupBySeries[mapType] = mapModelGroupBySeries[mapType] || [];
          mapModelGroupBySeries[mapType].push(seriesModel);
        }
      });
      each(mapModelGroupBySeries, function(mapSeries, mapType) {
        var nameMapList = map(mapSeries, function(singleMapSeries) {
          return singleMapSeries.get("nameMap");
        });
        var geo = new Geo_default(mapType, mapType, extend({
          nameMap: mergeAll(nameMapList)
        }, getCommonGeoProperties(mapSeries[0])));
        geo.zoomLimit = retrieve.apply(null, map(mapSeries, function(singleMapSeries) {
          return singleMapSeries.get("scaleLimit");
        }));
        geoList.push(geo);
        geo.resize = resizeGeo;
        geo.resize(mapSeries[0], api);
        each(mapSeries, function(singleMapSeries) {
          singleMapSeries.coordinateSystem = geo;
          setGeoCoords(geo, singleMapSeries);
        });
      });
      return geoList;
    };
    GeoCreator2.prototype.getFilledRegions = function(originRegionArr, mapName, nameMap, nameProperty) {
      var regionsArr = (originRegionArr || []).slice();
      var dataNameMap = createHashMap();
      for (var i = 0; i < regionsArr.length; i++) {
        dataNameMap.set(regionsArr[i].name, regionsArr[i]);
      }
      var source = geoSourceManager_default.load(mapName, nameMap, nameProperty);
      each(source.regions, function(region) {
        var name = region.name;
        !dataNameMap.get(name) && regionsArr.push({
          name
        });
      });
      return regionsArr;
    };
    return GeoCreator2;
  }()
);
var geoCreator = new GeoCreator();
var geoCreator_default = geoCreator;

// node_modules/echarts/lib/coord/geo/GeoModel.js
var GeoModel = (
  /** @class */
  function(_super) {
    __extends(GeoModel2, _super);
    function GeoModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = GeoModel2.type;
      return _this;
    }
    GeoModel2.prototype.init = function(option, parentModel, ecModel) {
      var source = geoSourceManager_default.getGeoResource(option.map);
      if (source && source.type === "geoJSON") {
        var itemStyle = option.itemStyle = option.itemStyle || {};
        if (!("color" in itemStyle)) {
          itemStyle.color = "#eee";
        }
      }
      this.mergeDefaultAndTheme(option, ecModel);
      defaultEmphasis(option, "label", ["show"]);
    };
    GeoModel2.prototype.optionUpdated = function() {
      var _this = this;
      var option = this.option;
      option.regions = geoCreator_default.getFilledRegions(option.regions, option.map, option.nameMap, option.nameProperty);
      var selectedMap = {};
      this._optionModelMap = reduce(option.regions || [], function(optionModelMap, regionOpt) {
        var regionName = regionOpt.name;
        if (regionName) {
          optionModelMap.set(regionName, new Model_default(regionOpt, _this, _this.ecModel));
          if (regionOpt.selected) {
            selectedMap[regionName] = true;
          }
        }
        return optionModelMap;
      }, createHashMap());
      if (!option.selectedMap) {
        option.selectedMap = selectedMap;
      }
    };
    GeoModel2.prototype.getRegionModel = function(name) {
      return this._optionModelMap.get(name) || new Model_default(null, this, this.ecModel);
    };
    GeoModel2.prototype.getFormattedLabel = function(name, status) {
      var regionModel = this.getRegionModel(name);
      var formatter = status === "normal" ? regionModel.get(["label", "formatter"]) : regionModel.get(["emphasis", "label", "formatter"]);
      var params = {
        name
      };
      if (isFunction(formatter)) {
        params.status = status;
        return formatter(params);
      } else if (isString(formatter)) {
        return formatter.replace("{a}", name != null ? name : "");
      }
    };
    GeoModel2.prototype.setZoom = function(zoom) {
      this.option.zoom = zoom;
    };
    GeoModel2.prototype.setCenter = function(center2) {
      this.option.center = center2;
    };
    GeoModel2.prototype.select = function(name) {
      var option = this.option;
      var selectedMode = option.selectedMode;
      if (!selectedMode) {
        return;
      }
      if (selectedMode !== "multiple") {
        option.selectedMap = null;
      }
      var selectedMap = option.selectedMap || (option.selectedMap = {});
      selectedMap[name] = true;
    };
    GeoModel2.prototype.unSelect = function(name) {
      var selectedMap = this.option.selectedMap;
      if (selectedMap) {
        selectedMap[name] = false;
      }
    };
    GeoModel2.prototype.toggleSelected = function(name) {
      this[this.isSelected(name) ? "unSelect" : "select"](name);
    };
    GeoModel2.prototype.isSelected = function(name) {
      var selectedMap = this.option.selectedMap;
      return !!(selectedMap && selectedMap[name]);
    };
    GeoModel2.type = "geo";
    GeoModel2.layoutMode = "box";
    GeoModel2.defaultOption = {
      // zlevel: 0,
      z: 0,
      show: true,
      left: "center",
      top: "center",
      // Default value:
      // for geoSVG source: 1,
      // for geoJSON source: 0.75.
      aspectScale: null,
      // /// Layout with center and size
      // If you want to put map in a fixed size box with right aspect ratio
      // This two properties may be more convenient
      // layoutCenter: [50%, 50%]
      // layoutSize: 100
      silent: false,
      // Map type
      map: "",
      // Define left-top, right-bottom coords to control view
      // For example, [ [180, 90], [-180, -90] ]
      boundingCoords: null,
      // Default on center of map
      center: null,
      zoom: 1,
      scaleLimit: null,
      // selectedMode: false
      label: {
        show: false,
        color: "#000"
      },
      itemStyle: {
        borderWidth: 0.5,
        borderColor: "#444"
        // Default color:
        // + geoJSON: #eee
        // + geoSVG: null (use SVG original `fill`)
        // color: '#eee'
      },
      emphasis: {
        label: {
          show: true,
          color: "rgb(100,0,0)"
        },
        itemStyle: {
          color: "rgba(255,215,0,0.8)"
        }
      },
      select: {
        label: {
          show: true,
          color: "rgb(100,0,0)"
        },
        itemStyle: {
          color: "rgba(255,215,0,0.8)"
        }
      },
      regions: []
      // tooltip: {
      //     show: false
      // }
    };
    return GeoModel2;
  }(Component_default)
);
var GeoModel_default = GeoModel;

// node_modules/echarts/lib/action/roamHelper.js
function getCenterCoord(view, point) {
  return view.pointToProjected ? view.pointToProjected(point) : view.pointToData(point);
}
function updateCenterAndZoom(view, payload, zoomLimit, api) {
  var previousZoom = view.getZoom();
  var center2 = view.getCenter();
  var zoom = payload.zoom;
  var point = view.projectedToPoint ? view.projectedToPoint(center2) : view.dataToPoint(center2);
  if (payload.dx != null && payload.dy != null) {
    point[0] -= payload.dx;
    point[1] -= payload.dy;
    view.setCenter(getCenterCoord(view, point), api);
  }
  if (zoom != null) {
    if (zoomLimit) {
      var zoomMin = zoomLimit.min || 0;
      var zoomMax = zoomLimit.max || Infinity;
      zoom = Math.max(Math.min(previousZoom * zoom, zoomMax), zoomMin) / previousZoom;
    }
    view.scaleX *= zoom;
    view.scaleY *= zoom;
    var fixX = (payload.originX - view.x) * (zoom - 1);
    var fixY = (payload.originY - view.y) * (zoom - 1);
    view.x -= fixX;
    view.y -= fixY;
    view.updateTransform();
    view.setCenter(getCenterCoord(view, point), api);
    view.setZoom(zoom * previousZoom);
  }
  return {
    center: view.getCenter(),
    zoom: view.getZoom()
  };
}

// node_modules/echarts/lib/component/helper/interactionMutex.js
var ATTR = "\0_ec_interaction_mutex";
function take(zr, resourceKey, userKey) {
  var store = getStore(zr);
  store[resourceKey] = userKey;
}
function release(zr, resourceKey, userKey) {
  var store = getStore(zr);
  var uKey = store[resourceKey];
  if (uKey === userKey) {
    store[resourceKey] = null;
  }
}
function isTaken(zr, resourceKey) {
  return !!getStore(zr)[resourceKey];
}
function getStore(zr) {
  return zr[ATTR] || (zr[ATTR] = {});
}
registerAction({
  type: "takeGlobalCursor",
  event: "globalCursorTaken",
  update: "update"
}, noop);

// node_modules/echarts/lib/component/helper/RoamController.js
var RoamController = (
  /** @class */
  function(_super) {
    __extends(RoamController2, _super);
    function RoamController2(zr) {
      var _this = _super.call(this) || this;
      _this._zr = zr;
      var mousedownHandler = bind(_this._mousedownHandler, _this);
      var mousemoveHandler = bind(_this._mousemoveHandler, _this);
      var mouseupHandler = bind(_this._mouseupHandler, _this);
      var mousewheelHandler = bind(_this._mousewheelHandler, _this);
      var pinchHandler = bind(_this._pinchHandler, _this);
      _this.enable = function(controlType, opt) {
        this.disable();
        this._opt = defaults(clone(opt) || {}, {
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          // By default, wheel do not trigger move.
          moveOnMouseWheel: false,
          preventDefaultMouseMove: true
        });
        if (controlType == null) {
          controlType = true;
        }
        if (controlType === true || controlType === "move" || controlType === "pan") {
          zr.on("mousedown", mousedownHandler);
          zr.on("mousemove", mousemoveHandler);
          zr.on("mouseup", mouseupHandler);
        }
        if (controlType === true || controlType === "scale" || controlType === "zoom") {
          zr.on("mousewheel", mousewheelHandler);
          zr.on("pinch", pinchHandler);
        }
      };
      _this.disable = function() {
        zr.off("mousedown", mousedownHandler);
        zr.off("mousemove", mousemoveHandler);
        zr.off("mouseup", mouseupHandler);
        zr.off("mousewheel", mousewheelHandler);
        zr.off("pinch", pinchHandler);
      };
      return _this;
    }
    RoamController2.prototype.isDragging = function() {
      return this._dragging;
    };
    RoamController2.prototype.isPinching = function() {
      return this._pinching;
    };
    RoamController2.prototype.setPointerChecker = function(pointerChecker) {
      this.pointerChecker = pointerChecker;
    };
    RoamController2.prototype.dispose = function() {
      this.disable();
    };
    RoamController2.prototype._mousedownHandler = function(e2) {
      if (isMiddleOrRightButtonOnMouseUpDown(e2)) {
        return;
      }
      var el = e2.target;
      while (el) {
        if (el.draggable) {
          return;
        }
        el = el.__hostTarget || el.parent;
      }
      var x = e2.offsetX;
      var y = e2.offsetY;
      if (this.pointerChecker && this.pointerChecker(e2, x, y)) {
        this._x = x;
        this._y = y;
        this._dragging = true;
      }
    };
    RoamController2.prototype._mousemoveHandler = function(e2) {
      if (!this._dragging || !isAvailableBehavior("moveOnMouseMove", e2, this._opt) || e2.gestureEvent === "pinch" || isTaken(this._zr, "globalPan")) {
        return;
      }
      var x = e2.offsetX;
      var y = e2.offsetY;
      var oldX = this._x;
      var oldY = this._y;
      var dx = x - oldX;
      var dy = y - oldY;
      this._x = x;
      this._y = y;
      this._opt.preventDefaultMouseMove && stop(e2.event);
      trigger(this, "pan", "moveOnMouseMove", e2, {
        dx,
        dy,
        oldX,
        oldY,
        newX: x,
        newY: y,
        isAvailableBehavior: null
      });
    };
    RoamController2.prototype._mouseupHandler = function(e2) {
      if (!isMiddleOrRightButtonOnMouseUpDown(e2)) {
        this._dragging = false;
      }
    };
    RoamController2.prototype._mousewheelHandler = function(e2) {
      var shouldZoom = isAvailableBehavior("zoomOnMouseWheel", e2, this._opt);
      var shouldMove = isAvailableBehavior("moveOnMouseWheel", e2, this._opt);
      var wheelDelta = e2.wheelDelta;
      var absWheelDeltaDelta = Math.abs(wheelDelta);
      var originX = e2.offsetX;
      var originY = e2.offsetY;
      if (wheelDelta === 0 || !shouldZoom && !shouldMove) {
        return;
      }
      if (shouldZoom) {
        var factor = absWheelDeltaDelta > 3 ? 1.4 : absWheelDeltaDelta > 1 ? 1.2 : 1.1;
        var scale4 = wheelDelta > 0 ? factor : 1 / factor;
        checkPointerAndTrigger(this, "zoom", "zoomOnMouseWheel", e2, {
          scale: scale4,
          originX,
          originY,
          isAvailableBehavior: null
        });
      }
      if (shouldMove) {
        var absDelta = Math.abs(wheelDelta);
        var scrollDelta = (wheelDelta > 0 ? 1 : -1) * (absDelta > 3 ? 0.4 : absDelta > 1 ? 0.15 : 0.05);
        checkPointerAndTrigger(this, "scrollMove", "moveOnMouseWheel", e2, {
          scrollDelta,
          originX,
          originY,
          isAvailableBehavior: null
        });
      }
    };
    RoamController2.prototype._pinchHandler = function(e2) {
      if (isTaken(this._zr, "globalPan")) {
        return;
      }
      var scale4 = e2.pinchScale > 1 ? 1.1 : 1 / 1.1;
      checkPointerAndTrigger(this, "zoom", null, e2, {
        scale: scale4,
        originX: e2.pinchX,
        originY: e2.pinchY,
        isAvailableBehavior: null
      });
    };
    return RoamController2;
  }(Eventful_default)
);
function checkPointerAndTrigger(controller, eventName, behaviorToCheck, e2, contollerEvent) {
  if (controller.pointerChecker && controller.pointerChecker(e2, contollerEvent.originX, contollerEvent.originY)) {
    stop(e2.event);
    trigger(controller, eventName, behaviorToCheck, e2, contollerEvent);
  }
}
function trigger(controller, eventName, behaviorToCheck, e2, contollerEvent) {
  contollerEvent.isAvailableBehavior = bind(isAvailableBehavior, null, behaviorToCheck, e2);
  controller.trigger(eventName, contollerEvent);
}
function isAvailableBehavior(behaviorToCheck, e2, settings) {
  var setting = settings[behaviorToCheck];
  return !behaviorToCheck || setting && (!isString(setting) || e2.event[setting + "Key"]);
}
var RoamController_default = RoamController;

// node_modules/echarts/lib/component/helper/roamHelper.js
function updateViewOnPan(controllerHost, dx, dy) {
  var target = controllerHost.target;
  target.x += dx;
  target.y += dy;
  target.dirty();
}
function updateViewOnZoom(controllerHost, zoomDelta, zoomX, zoomY) {
  var target = controllerHost.target;
  var zoomLimit = controllerHost.zoomLimit;
  var newZoom = controllerHost.zoom = controllerHost.zoom || 1;
  newZoom *= zoomDelta;
  if (zoomLimit) {
    var zoomMin = zoomLimit.min || 0;
    var zoomMax = zoomLimit.max || Infinity;
    newZoom = Math.max(Math.min(zoomMax, newZoom), zoomMin);
  }
  var zoomScale = newZoom / controllerHost.zoom;
  controllerHost.zoom = newZoom;
  target.x -= (zoomX - target.x) * (zoomScale - 1);
  target.y -= (zoomY - target.y) * (zoomScale - 1);
  target.scaleX *= zoomScale;
  target.scaleY *= zoomScale;
  target.dirty();
}

// node_modules/echarts/lib/component/helper/cursorHelper.js
var IRRELEVANT_EXCLUDES = {
  "axisPointer": 1,
  "tooltip": 1,
  "brush": 1
};
function onIrrelevantElement(e2, api, targetCoordSysModel) {
  var model = api.getComponentByElement(e2.topTarget);
  var coordSys = model && model.coordinateSystem;
  return model && model !== targetCoordSysModel && !IRRELEVANT_EXCLUDES.hasOwnProperty(model.mainType) && coordSys && coordSys.model !== targetCoordSysModel;
}

// node_modules/echarts/lib/component/helper/MapDraw.js
var OPTION_STYLE_ENABLED_TAGS = ["rect", "circle", "line", "ellipse", "polygon", "polyline", "path"];
var OPTION_STYLE_ENABLED_TAG_MAP = createHashMap(OPTION_STYLE_ENABLED_TAGS);
var STATE_TRIGGER_TAG_MAP = createHashMap(OPTION_STYLE_ENABLED_TAGS.concat(["g"]));
var LABEL_HOST_MAP = createHashMap(OPTION_STYLE_ENABLED_TAGS.concat(["g"]));
var mapLabelRaw = makeInner();
function getFixedItemStyle(model) {
  var itemStyle = model.getItemStyle();
  var areaColor = model.get("areaColor");
  if (areaColor != null) {
    itemStyle.fill = areaColor;
  }
  return itemStyle;
}
function fixLineStyle(styleHost) {
  var style = styleHost.style;
  if (style) {
    style.stroke = style.stroke || style.fill;
    style.fill = null;
  }
}
var MapDraw = (
  /** @class */
  function() {
    function MapDraw2(api) {
      var group = new Group_default();
      this.uid = getUID("ec_map_draw");
      this._controller = new RoamController_default(api.getZr());
      this._controllerHost = {
        target: group
      };
      this.group = group;
      group.add(this._regionsGroup = new Group_default());
      group.add(this._svgGroup = new Group_default());
    }
    MapDraw2.prototype.draw = function(mapOrGeoModel, ecModel, api, fromView, payload) {
      var isGeo = mapOrGeoModel.mainType === "geo";
      var data = mapOrGeoModel.getData && mapOrGeoModel.getData();
      isGeo && ecModel.eachComponent({
        mainType: "series",
        subType: "map"
      }, function(mapSeries) {
        if (!data && mapSeries.getHostGeoModel() === mapOrGeoModel) {
          data = mapSeries.getData();
        }
      });
      var geo = mapOrGeoModel.coordinateSystem;
      var regionsGroup = this._regionsGroup;
      var group = this.group;
      var transformInfo = geo.getTransformInfo();
      var transformInfoRaw = transformInfo.raw;
      var transformInfoRoam = transformInfo.roam;
      var isFirstDraw = !regionsGroup.childAt(0) || payload;
      if (isFirstDraw) {
        group.x = transformInfoRoam.x;
        group.y = transformInfoRoam.y;
        group.scaleX = transformInfoRoam.scaleX;
        group.scaleY = transformInfoRoam.scaleY;
        group.dirty();
      } else {
        updateProps(group, transformInfoRoam, mapOrGeoModel);
      }
      var isVisualEncodedByVisualMap = data && data.getVisual("visualMeta") && data.getVisual("visualMeta").length > 0;
      var viewBuildCtx = {
        api,
        geo,
        mapOrGeoModel,
        data,
        isVisualEncodedByVisualMap,
        isGeo,
        transformInfoRaw
      };
      if (geo.resourceType === "geoJSON") {
        this._buildGeoJSON(viewBuildCtx);
      } else if (geo.resourceType === "geoSVG") {
        this._buildSVG(viewBuildCtx);
      }
      this._updateController(mapOrGeoModel, ecModel, api);
      this._updateMapSelectHandler(mapOrGeoModel, regionsGroup, api, fromView);
    };
    MapDraw2.prototype._buildGeoJSON = function(viewBuildCtx) {
      var regionsGroupByName = this._regionsGroupByName = createHashMap();
      var regionsInfoByName = createHashMap();
      var regionsGroup = this._regionsGroup;
      var transformInfoRaw = viewBuildCtx.transformInfoRaw;
      var mapOrGeoModel = viewBuildCtx.mapOrGeoModel;
      var data = viewBuildCtx.data;
      var projection = viewBuildCtx.geo.projection;
      var projectionStream = projection && projection.stream;
      function transformPoint(point, project) {
        if (project) {
          point = project(point);
        }
        return point && [point[0] * transformInfoRaw.scaleX + transformInfoRaw.x, point[1] * transformInfoRaw.scaleY + transformInfoRaw.y];
      }
      ;
      function transformPolygonPoints(inPoints) {
        var outPoints = [];
        var project = !projectionStream && projection && projection.project;
        for (var i = 0; i < inPoints.length; ++i) {
          var newPt = transformPoint(inPoints[i], project);
          newPt && outPoints.push(newPt);
        }
        return outPoints;
      }
      function getPolyShape(points4) {
        return {
          shape: {
            points: transformPolygonPoints(points4)
          }
        };
      }
      regionsGroup.removeAll();
      each(viewBuildCtx.geo.regions, function(region) {
        var regionName = region.name;
        var regionGroup = regionsGroupByName.get(regionName);
        var _a2 = regionsInfoByName.get(regionName) || {}, dataIdx = _a2.dataIdx, regionModel = _a2.regionModel;
        if (!regionGroup) {
          regionGroup = regionsGroupByName.set(regionName, new Group_default());
          regionsGroup.add(regionGroup);
          dataIdx = data ? data.indexOfName(regionName) : null;
          regionModel = viewBuildCtx.isGeo ? mapOrGeoModel.getRegionModel(regionName) : data ? data.getItemModel(dataIdx) : null;
          regionsInfoByName.set(regionName, {
            dataIdx,
            regionModel
          });
        }
        var polygonSubpaths = [];
        var polylineSubpaths = [];
        each(region.geometries, function(geometry) {
          if (geometry.type === "polygon") {
            var polys = [geometry.exterior].concat(geometry.interiors || []);
            if (projectionStream) {
              polys = projectPolys(polys, projectionStream);
            }
            each(polys, function(poly) {
              polygonSubpaths.push(new Polygon_default(getPolyShape(poly)));
            });
          } else {
            var points4 = geometry.points;
            if (projectionStream) {
              points4 = projectPolys(points4, projectionStream, true);
            }
            each(points4, function(points5) {
              polylineSubpaths.push(new Polyline_default(getPolyShape(points5)));
            });
          }
        });
        var centerPt = transformPoint(region.getCenter(), projection && projection.project);
        function createCompoundPath(subpaths, isLine) {
          if (!subpaths.length) {
            return;
          }
          var compoundPath = new CompoundPath_default({
            culling: true,
            segmentIgnoreThreshold: 1,
            shape: {
              paths: subpaths
            }
          });
          regionGroup.add(compoundPath);
          applyOptionStyleForRegion(viewBuildCtx, compoundPath, dataIdx, regionModel);
          resetLabelForRegion(viewBuildCtx, compoundPath, regionName, regionModel, mapOrGeoModel, dataIdx, centerPt);
          if (isLine) {
            fixLineStyle(compoundPath);
            each(compoundPath.states, fixLineStyle);
          }
        }
        createCompoundPath(polygonSubpaths);
        createCompoundPath(polylineSubpaths, true);
      });
      regionsGroupByName.each(function(regionGroup, regionName) {
        var _a2 = regionsInfoByName.get(regionName), dataIdx = _a2.dataIdx, regionModel = _a2.regionModel;
        resetEventTriggerForRegion(viewBuildCtx, regionGroup, regionName, regionModel, mapOrGeoModel, dataIdx);
        resetTooltipForRegion(viewBuildCtx, regionGroup, regionName, regionModel, mapOrGeoModel);
        resetStateTriggerForRegion(viewBuildCtx, regionGroup, regionName, regionModel, mapOrGeoModel);
      }, this);
    };
    MapDraw2.prototype._buildSVG = function(viewBuildCtx) {
      var mapName = viewBuildCtx.geo.map;
      var transformInfoRaw = viewBuildCtx.transformInfoRaw;
      this._svgGroup.x = transformInfoRaw.x;
      this._svgGroup.y = transformInfoRaw.y;
      this._svgGroup.scaleX = transformInfoRaw.scaleX;
      this._svgGroup.scaleY = transformInfoRaw.scaleY;
      if (this._svgResourceChanged(mapName)) {
        this._freeSVG();
        this._useSVG(mapName);
      }
      var svgDispatcherMap = this._svgDispatcherMap = createHashMap();
      var focusSelf = false;
      each(this._svgGraphicRecord.named, function(namedItem) {
        var regionName = namedItem.name;
        var mapOrGeoModel = viewBuildCtx.mapOrGeoModel;
        var data = viewBuildCtx.data;
        var svgNodeTagLower = namedItem.svgNodeTagLower;
        var el = namedItem.el;
        var dataIdx = data ? data.indexOfName(regionName) : null;
        var regionModel = mapOrGeoModel.getRegionModel(regionName);
        if (OPTION_STYLE_ENABLED_TAG_MAP.get(svgNodeTagLower) != null && el instanceof Displayable_default) {
          applyOptionStyleForRegion(viewBuildCtx, el, dataIdx, regionModel);
        }
        if (el instanceof Displayable_default) {
          el.culling = true;
        }
        el.z2EmphasisLift = 0;
        if (!namedItem.namedFrom) {
          if (LABEL_HOST_MAP.get(svgNodeTagLower) != null) {
            resetLabelForRegion(viewBuildCtx, el, regionName, regionModel, mapOrGeoModel, dataIdx, null);
          }
          resetEventTriggerForRegion(viewBuildCtx, el, regionName, regionModel, mapOrGeoModel, dataIdx);
          resetTooltipForRegion(viewBuildCtx, el, regionName, regionModel, mapOrGeoModel);
          if (STATE_TRIGGER_TAG_MAP.get(svgNodeTagLower) != null) {
            var focus_1 = resetStateTriggerForRegion(viewBuildCtx, el, regionName, regionModel, mapOrGeoModel);
            if (focus_1 === "self") {
              focusSelf = true;
            }
            var els = svgDispatcherMap.get(regionName) || svgDispatcherMap.set(regionName, []);
            els.push(el);
          }
        }
      }, this);
      this._enableBlurEntireSVG(focusSelf, viewBuildCtx);
    };
    MapDraw2.prototype._enableBlurEntireSVG = function(focusSelf, viewBuildCtx) {
      if (focusSelf && viewBuildCtx.isGeo) {
        var blurStyle = viewBuildCtx.mapOrGeoModel.getModel(["blur", "itemStyle"]).getItemStyle();
        var opacity_1 = blurStyle.opacity;
        this._svgGraphicRecord.root.traverse(function(el) {
          if (!el.isGroup) {
            setDefaultStateProxy(el);
            var style = el.ensureState("blur").style || {};
            if (style.opacity == null && opacity_1 != null) {
              style.opacity = opacity_1;
            }
            el.ensureState("emphasis");
          }
        });
      }
    };
    MapDraw2.prototype.remove = function() {
      this._regionsGroup.removeAll();
      this._regionsGroupByName = null;
      this._svgGroup.removeAll();
      this._freeSVG();
      this._controller.dispose();
      this._controllerHost = null;
    };
    MapDraw2.prototype.findHighDownDispatchers = function(name, geoModel) {
      if (name == null) {
        return [];
      }
      var geo = geoModel.coordinateSystem;
      if (geo.resourceType === "geoJSON") {
        var regionsGroupByName = this._regionsGroupByName;
        if (regionsGroupByName) {
          var regionGroup = regionsGroupByName.get(name);
          return regionGroup ? [regionGroup] : [];
        }
      } else if (geo.resourceType === "geoSVG") {
        return this._svgDispatcherMap && this._svgDispatcherMap.get(name) || [];
      }
    };
    MapDraw2.prototype._svgResourceChanged = function(mapName) {
      return this._svgMapName !== mapName;
    };
    MapDraw2.prototype._useSVG = function(mapName) {
      var resource = geoSourceManager_default.getGeoResource(mapName);
      if (resource && resource.type === "geoSVG") {
        var svgGraphic = resource.useGraphic(this.uid);
        this._svgGroup.add(svgGraphic.root);
        this._svgGraphicRecord = svgGraphic;
        this._svgMapName = mapName;
      }
    };
    MapDraw2.prototype._freeSVG = function() {
      var mapName = this._svgMapName;
      if (mapName == null) {
        return;
      }
      var resource = geoSourceManager_default.getGeoResource(mapName);
      if (resource && resource.type === "geoSVG") {
        resource.freeGraphic(this.uid);
      }
      this._svgGraphicRecord = null;
      this._svgDispatcherMap = null;
      this._svgGroup.removeAll();
      this._svgMapName = null;
    };
    MapDraw2.prototype._updateController = function(mapOrGeoModel, ecModel, api) {
      var geo = mapOrGeoModel.coordinateSystem;
      var controller = this._controller;
      var controllerHost = this._controllerHost;
      controllerHost.zoomLimit = mapOrGeoModel.get("scaleLimit");
      controllerHost.zoom = geo.getZoom();
      controller.enable(mapOrGeoModel.get("roam") || false);
      var mainType = mapOrGeoModel.mainType;
      function makeActionBase() {
        var action = {
          type: "geoRoam",
          componentType: mainType
        };
        action[mainType + "Id"] = mapOrGeoModel.id;
        return action;
      }
      controller.off("pan").on("pan", function(e2) {
        this._mouseDownFlag = false;
        updateViewOnPan(controllerHost, e2.dx, e2.dy);
        api.dispatchAction(extend(makeActionBase(), {
          dx: e2.dx,
          dy: e2.dy,
          animation: {
            duration: 0
          }
        }));
      }, this);
      controller.off("zoom").on("zoom", function(e2) {
        this._mouseDownFlag = false;
        updateViewOnZoom(controllerHost, e2.scale, e2.originX, e2.originY);
        api.dispatchAction(extend(makeActionBase(), {
          zoom: e2.scale,
          originX: e2.originX,
          originY: e2.originY,
          animation: {
            duration: 0
          }
        }));
      }, this);
      controller.setPointerChecker(function(e2, x, y) {
        return geo.containPoint([x, y]) && !onIrrelevantElement(e2, api, mapOrGeoModel);
      });
    };
    MapDraw2.prototype.resetForLabelLayout = function() {
      this.group.traverse(function(el) {
        var label = el.getTextContent();
        if (label) {
          label.ignore = mapLabelRaw(label).ignore;
        }
      });
    };
    MapDraw2.prototype._updateMapSelectHandler = function(mapOrGeoModel, regionsGroup, api, fromView) {
      var mapDraw = this;
      regionsGroup.off("mousedown");
      regionsGroup.off("click");
      if (mapOrGeoModel.get("selectedMode")) {
        regionsGroup.on("mousedown", function() {
          mapDraw._mouseDownFlag = true;
        });
        regionsGroup.on("click", function(e2) {
          if (!mapDraw._mouseDownFlag) {
            return;
          }
          mapDraw._mouseDownFlag = false;
        });
      }
    };
    return MapDraw2;
  }()
);
function applyOptionStyleForRegion(viewBuildCtx, el, dataIndex, regionModel) {
  var normalStyleModel = regionModel.getModel("itemStyle");
  var emphasisStyleModel = regionModel.getModel(["emphasis", "itemStyle"]);
  var blurStyleModel = regionModel.getModel(["blur", "itemStyle"]);
  var selectStyleModel = regionModel.getModel(["select", "itemStyle"]);
  var normalStyle = getFixedItemStyle(normalStyleModel);
  var emphasisStyle = getFixedItemStyle(emphasisStyleModel);
  var selectStyle = getFixedItemStyle(selectStyleModel);
  var blurStyle = getFixedItemStyle(blurStyleModel);
  var data = viewBuildCtx.data;
  if (data) {
    var style = data.getItemVisual(dataIndex, "style");
    var decal = data.getItemVisual(dataIndex, "decal");
    if (viewBuildCtx.isVisualEncodedByVisualMap && style.fill) {
      normalStyle.fill = style.fill;
    }
    if (decal) {
      normalStyle.decal = createOrUpdatePatternFromDecal(decal, viewBuildCtx.api);
    }
  }
  el.setStyle(normalStyle);
  el.style.strokeNoScale = true;
  el.ensureState("emphasis").style = emphasisStyle;
  el.ensureState("select").style = selectStyle;
  el.ensureState("blur").style = blurStyle;
  setDefaultStateProxy(el);
}
function resetLabelForRegion(viewBuildCtx, el, regionName, regionModel, mapOrGeoModel, dataIdx, labelXY) {
  var data = viewBuildCtx.data;
  var isGeo = viewBuildCtx.isGeo;
  var isDataNaN = data && isNaN(data.get(data.mapDimension("value"), dataIdx));
  var itemLayout = data && data.getItemLayout(dataIdx);
  if (isGeo || isDataNaN || itemLayout && itemLayout.showLabel) {
    var query = !isGeo ? dataIdx : regionName;
    var labelFetcher = void 0;
    if (!data || dataIdx >= 0) {
      labelFetcher = mapOrGeoModel;
    }
    var specifiedTextOpt = labelXY ? {
      normal: {
        align: "center",
        verticalAlign: "middle"
      }
    } : null;
    setLabelStyle(el, getLabelStatesModels(regionModel), {
      labelFetcher,
      labelDataIndex: query,
      defaultText: regionName
    }, specifiedTextOpt);
    var textEl = el.getTextContent();
    if (textEl) {
      mapLabelRaw(textEl).ignore = textEl.ignore;
      if (el.textConfig && labelXY) {
        var rect = el.getBoundingRect().clone();
        el.textConfig.layoutRect = rect;
        el.textConfig.position = [(labelXY[0] - rect.x) / rect.width * 100 + "%", (labelXY[1] - rect.y) / rect.height * 100 + "%"];
      }
    }
    el.disableLabelAnimation = true;
  } else {
    el.removeTextContent();
    el.removeTextConfig();
    el.disableLabelAnimation = null;
  }
}
function resetEventTriggerForRegion(viewBuildCtx, eventTrigger, regionName, regionModel, mapOrGeoModel, dataIdx) {
  if (viewBuildCtx.data) {
    viewBuildCtx.data.setItemGraphicEl(dataIdx, eventTrigger);
  } else {
    getECData(eventTrigger).eventData = {
      componentType: "geo",
      componentIndex: mapOrGeoModel.componentIndex,
      geoIndex: mapOrGeoModel.componentIndex,
      name: regionName,
      region: regionModel && regionModel.option || {}
    };
  }
}
function resetTooltipForRegion(viewBuildCtx, el, regionName, regionModel, mapOrGeoModel) {
  if (!viewBuildCtx.data) {
    setTooltipConfig({
      el,
      componentModel: mapOrGeoModel,
      itemName: regionName,
      // @ts-ignore FIXME:TS fix the "compatible with each other"?
      itemTooltipOption: regionModel.get("tooltip")
    });
  }
}
function resetStateTriggerForRegion(viewBuildCtx, el, regionName, regionModel, mapOrGeoModel) {
  el.highDownSilentOnTouch = !!mapOrGeoModel.get("selectedMode");
  var emphasisModel = regionModel.getModel("emphasis");
  var focus = emphasisModel.get("focus");
  toggleHoverEmphasis(el, focus, emphasisModel.get("blurScope"), emphasisModel.get("disabled"));
  if (viewBuildCtx.isGeo) {
    enableComponentHighDownFeatures(el, mapOrGeoModel, regionName);
  }
  return focus;
}
function projectPolys(rings, createStream, isLine) {
  var polygons = [];
  var curPoly;
  function startPolygon() {
    curPoly = [];
  }
  function endPolygon() {
    if (curPoly.length) {
      polygons.push(curPoly);
      curPoly = [];
    }
  }
  var stream = createStream({
    polygonStart: startPolygon,
    polygonEnd: endPolygon,
    lineStart: startPolygon,
    lineEnd: endPolygon,
    point: function(x, y) {
      if (isFinite(x) && isFinite(y)) {
        curPoly.push([x, y]);
      }
    },
    sphere: function() {
    }
  });
  !isLine && stream.polygonStart();
  each(rings, function(ring) {
    stream.lineStart();
    for (var i = 0; i < ring.length; i++) {
      stream.point(ring[i][0], ring[i][1]);
    }
    stream.lineEnd();
  });
  !isLine && stream.polygonEnd();
  return polygons;
}
var MapDraw_default = MapDraw;

// node_modules/echarts/lib/component/geo/GeoView.js
var GeoView = (
  /** @class */
  function(_super) {
    __extends(GeoView2, _super);
    function GeoView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = GeoView2.type;
      _this.focusBlurEnabled = true;
      return _this;
    }
    GeoView2.prototype.init = function(ecModel, api) {
      this._api = api;
    };
    GeoView2.prototype.render = function(geoModel, ecModel, api, payload) {
      this._model = geoModel;
      if (!geoModel.get("show")) {
        this._mapDraw && this._mapDraw.remove();
        this._mapDraw = null;
        return;
      }
      if (!this._mapDraw) {
        this._mapDraw = new MapDraw_default(api);
      }
      var mapDraw = this._mapDraw;
      mapDraw.draw(geoModel, ecModel, api, this, payload);
      mapDraw.group.on("click", this._handleRegionClick, this);
      mapDraw.group.silent = geoModel.get("silent");
      this.group.add(mapDraw.group);
      this.updateSelectStatus(geoModel, ecModel, api);
    };
    GeoView2.prototype._handleRegionClick = function(e2) {
      var eventData;
      findEventDispatcher(e2.target, function(current) {
        return (eventData = getECData(current).eventData) != null;
      }, true);
      if (eventData) {
        this._api.dispatchAction({
          type: "geoToggleSelect",
          geoId: this._model.id,
          name: eventData.name
        });
      }
    };
    GeoView2.prototype.updateSelectStatus = function(model, ecModel, api) {
      var _this = this;
      this._mapDraw.group.traverse(function(node) {
        var eventData = getECData(node).eventData;
        if (eventData) {
          _this._model.isSelected(eventData.name) ? api.enterSelect(node) : api.leaveSelect(node);
          return true;
        }
      });
    };
    GeoView2.prototype.findHighDownDispatchers = function(name) {
      return this._mapDraw && this._mapDraw.findHighDownDispatchers(name, this._model);
    };
    GeoView2.prototype.dispose = function() {
      this._mapDraw && this._mapDraw.remove();
    };
    GeoView2.type = "geo";
    return GeoView2;
  }(Component_default2)
);
var GeoView_default = GeoView;

// node_modules/echarts/lib/component/geo/install.js
function registerMap2(mapName, geoJson, specialAreas) {
  geoSourceManager_default.registerMap(mapName, geoJson, specialAreas);
}
function install3(registers) {
  registers.registerCoordinateSystem("geo", geoCreator_default);
  registers.registerComponentModel(GeoModel_default);
  registers.registerComponentView(GeoView_default);
  registers.registerImpl("registerMap", registerMap2);
  registers.registerImpl("getMap", function(mapName) {
    return geoSourceManager_default.getMapForUser(mapName);
  });
  function makeAction(method, actionInfo2) {
    actionInfo2.update = "geo:updateSelectStatus";
    registers.registerAction(actionInfo2, function(payload, ecModel) {
      var selected = {};
      var allSelected = [];
      ecModel.eachComponent({
        mainType: "geo",
        query: payload
      }, function(geoModel) {
        geoModel[method](payload.name);
        var geo = geoModel.coordinateSystem;
        each(geo.regions, function(region) {
          selected[region.name] = geoModel.isSelected(region.name) || false;
        });
        var names = [];
        each(selected, function(v, name) {
          selected[name] && names.push(name);
        });
        allSelected.push({
          geoIndex: geoModel.componentIndex,
          // Use singular, the same naming convention as the event `selectchanged`.
          name: names
        });
      });
      return {
        selected,
        allSelected,
        name: payload.name
      };
    });
  }
  makeAction("toggleSelected", {
    type: "geoToggleSelect",
    event: "geoselectchanged"
  });
  makeAction("select", {
    type: "geoSelect",
    event: "geoselected"
  });
  makeAction("unSelect", {
    type: "geoUnSelect",
    event: "geounselected"
  });
  registers.registerAction({
    type: "geoRoam",
    event: "geoRoam",
    update: "updateTransform"
  }, function(payload, ecModel, api) {
    var componentType = payload.componentType || "series";
    ecModel.eachComponent({
      mainType: componentType,
      query: payload
    }, function(componentModel) {
      var geo = componentModel.coordinateSystem;
      if (geo.type !== "geo") {
        return;
      }
      var res = updateCenterAndZoom(geo, payload, componentModel.get("scaleLimit"), api);
      componentModel.setCenter && componentModel.setCenter(res.center);
      componentModel.setZoom && componentModel.setZoom(res.zoom);
      if (componentType === "series") {
        each(componentModel.seriesGroup, function(seriesModel) {
          seriesModel.setCenter(res.center);
          seriesModel.setZoom(res.zoom);
        });
      }
    });
  });
}

// node_modules/echarts/lib/coord/parallel/parallelPreprocessor.js
function parallelPreprocessor(option) {
  createParallelIfNeeded(option);
  mergeAxisOptionFromParallel(option);
}
function createParallelIfNeeded(option) {
  if (option.parallel) {
    return;
  }
  var hasParallelSeries = false;
  each(option.series, function(seriesOpt) {
    if (seriesOpt && seriesOpt.type === "parallel") {
      hasParallelSeries = true;
    }
  });
  if (hasParallelSeries) {
    option.parallel = [{}];
  }
}
function mergeAxisOptionFromParallel(option) {
  var axes = normalizeToArray(option.parallelAxis);
  each(axes, function(axisOption) {
    if (!isObject(axisOption)) {
      return;
    }
    var parallelIndex = axisOption.parallelIndex || 0;
    var parallelOption = normalizeToArray(option.parallel)[parallelIndex];
    if (parallelOption && parallelOption.parallelAxisDefault) {
      merge(axisOption, parallelOption.parallelAxisDefault, false);
    }
  });
}

// node_modules/echarts/lib/component/parallel/ParallelView.js
var CLICK_THRESHOLD = 5;
var ParallelView = (
  /** @class */
  function(_super) {
    __extends(ParallelView2, _super);
    function ParallelView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = ParallelView2.type;
      return _this;
    }
    ParallelView2.prototype.render = function(parallelModel, ecModel, api) {
      this._model = parallelModel;
      this._api = api;
      if (!this._handlers) {
        this._handlers = {};
        each(handlers, function(handler, eventName) {
          api.getZr().on(eventName, this._handlers[eventName] = bind(handler, this));
        }, this);
      }
      createOrUpdate(this, "_throttledDispatchExpand", parallelModel.get("axisExpandRate"), "fixRate");
    };
    ParallelView2.prototype.dispose = function(ecModel, api) {
      clear(this, "_throttledDispatchExpand");
      each(this._handlers, function(handler, eventName) {
        api.getZr().off(eventName, handler);
      });
      this._handlers = null;
    };
    ParallelView2.prototype._throttledDispatchExpand = function(opt) {
      this._dispatchExpand(opt);
    };
    ParallelView2.prototype._dispatchExpand = function(opt) {
      opt && this._api.dispatchAction(extend({
        type: "parallelAxisExpand"
      }, opt));
    };
    ParallelView2.type = "parallel";
    return ParallelView2;
  }(Component_default2)
);
var handlers = {
  mousedown: function(e2) {
    if (checkTrigger(this, "click")) {
      this._mouseDownPoint = [e2.offsetX, e2.offsetY];
    }
  },
  mouseup: function(e2) {
    var mouseDownPoint = this._mouseDownPoint;
    if (checkTrigger(this, "click") && mouseDownPoint) {
      var point = [e2.offsetX, e2.offsetY];
      var dist3 = Math.pow(mouseDownPoint[0] - point[0], 2) + Math.pow(mouseDownPoint[1] - point[1], 2);
      if (dist3 > CLICK_THRESHOLD) {
        return;
      }
      var result = this._model.coordinateSystem.getSlidedAxisExpandWindow([e2.offsetX, e2.offsetY]);
      result.behavior !== "none" && this._dispatchExpand({
        axisExpandWindow: result.axisExpandWindow
      });
    }
    this._mouseDownPoint = null;
  },
  mousemove: function(e2) {
    if (this._mouseDownPoint || !checkTrigger(this, "mousemove")) {
      return;
    }
    var model = this._model;
    var result = model.coordinateSystem.getSlidedAxisExpandWindow([e2.offsetX, e2.offsetY]);
    var behavior = result.behavior;
    behavior === "jump" && this._throttledDispatchExpand.debounceNextCall(model.get("axisExpandDebounce"));
    this._throttledDispatchExpand(behavior === "none" ? null : {
      axisExpandWindow: result.axisExpandWindow,
      // Jumping uses animation, and sliding suppresses animation.
      animation: behavior === "jump" ? null : {
        duration: 0
        // Disable animation.
      }
    });
  }
};
function checkTrigger(view, triggerOn) {
  var model = view._model;
  return model.get("axisExpandable") && model.get("axisExpandTriggerOn") === triggerOn;
}
var ParallelView_default = ParallelView;

// node_modules/echarts/lib/coord/parallel/ParallelModel.js
var ParallelModel = (
  /** @class */
  function(_super) {
    __extends(ParallelModel2, _super);
    function ParallelModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = ParallelModel2.type;
      return _this;
    }
    ParallelModel2.prototype.init = function() {
      _super.prototype.init.apply(this, arguments);
      this.mergeOption({});
    };
    ParallelModel2.prototype.mergeOption = function(newOption) {
      var thisOption = this.option;
      newOption && merge(thisOption, newOption, true);
      this._initDimensions();
    };
    ParallelModel2.prototype.contains = function(model, ecModel) {
      var parallelIndex = model.get("parallelIndex");
      return parallelIndex != null && ecModel.getComponent("parallel", parallelIndex) === this;
    };
    ParallelModel2.prototype.setAxisExpand = function(opt) {
      each(["axisExpandable", "axisExpandCenter", "axisExpandCount", "axisExpandWidth", "axisExpandWindow"], function(name) {
        if (opt.hasOwnProperty(name)) {
          this.option[name] = opt[name];
        }
      }, this);
    };
    ParallelModel2.prototype._initDimensions = function() {
      var dimensions = this.dimensions = [];
      var parallelAxisIndex = this.parallelAxisIndex = [];
      var axisModels = filter(this.ecModel.queryComponents({
        mainType: "parallelAxis"
      }), function(axisModel) {
        return (axisModel.get("parallelIndex") || 0) === this.componentIndex;
      }, this);
      each(axisModels, function(axisModel) {
        dimensions.push("dim" + axisModel.get("dim"));
        parallelAxisIndex.push(axisModel.componentIndex);
      });
    };
    ParallelModel2.type = "parallel";
    ParallelModel2.dependencies = ["parallelAxis"];
    ParallelModel2.layoutMode = "box";
    ParallelModel2.defaultOption = {
      // zlevel: 0,
      z: 0,
      left: 80,
      top: 60,
      right: 80,
      bottom: 60,
      // width: {totalWidth} - left - right,
      // height: {totalHeight} - top - bottom,
      layout: "horizontal",
      // FIXME
      // naming?
      axisExpandable: false,
      axisExpandCenter: null,
      axisExpandCount: 0,
      axisExpandWidth: 50,
      axisExpandRate: 17,
      axisExpandDebounce: 50,
      // [out, in, jumpTarget]. In percentage. If use [null, 0.05], null means full.
      // Do not doc to user until necessary.
      axisExpandSlideTriggerArea: [-0.15, 0.05, 0.4],
      axisExpandTriggerOn: "click",
      parallelAxisDefault: null
    };
    return ParallelModel2;
  }(Component_default)
);
var ParallelModel_default = ParallelModel;

// node_modules/echarts/lib/coord/parallel/ParallelAxis.js
var ParallelAxis = (
  /** @class */
  function(_super) {
    __extends(ParallelAxis2, _super);
    function ParallelAxis2(dim, scale4, coordExtent, axisType, axisIndex) {
      var _this = _super.call(this, dim, scale4, coordExtent) || this;
      _this.type = axisType || "value";
      _this.axisIndex = axisIndex;
      return _this;
    }
    ParallelAxis2.prototype.isHorizontal = function() {
      return this.coordinateSystem.getModel().get("layout") !== "horizontal";
    };
    return ParallelAxis2;
  }(Axis_default)
);
var ParallelAxis_default = ParallelAxis;

// node_modules/echarts/lib/component/helper/sliderMove.js
function sliderMove(delta, handleEnds, extent3, handleIndex, minSpan, maxSpan) {
  delta = delta || 0;
  var extentSpan = extent3[1] - extent3[0];
  if (minSpan != null) {
    minSpan = restrict(minSpan, [0, extentSpan]);
  }
  if (maxSpan != null) {
    maxSpan = Math.max(maxSpan, minSpan != null ? minSpan : 0);
  }
  if (handleIndex === "all") {
    var handleSpan = Math.abs(handleEnds[1] - handleEnds[0]);
    handleSpan = restrict(handleSpan, [0, extentSpan]);
    minSpan = maxSpan = restrict(handleSpan, [minSpan, maxSpan]);
    handleIndex = 0;
  }
  handleEnds[0] = restrict(handleEnds[0], extent3);
  handleEnds[1] = restrict(handleEnds[1], extent3);
  var originalDistSign = getSpanSign(handleEnds, handleIndex);
  handleEnds[handleIndex] += delta;
  var extentMinSpan = minSpan || 0;
  var realExtent = extent3.slice();
  originalDistSign.sign < 0 ? realExtent[0] += extentMinSpan : realExtent[1] -= extentMinSpan;
  handleEnds[handleIndex] = restrict(handleEnds[handleIndex], realExtent);
  var currDistSign;
  currDistSign = getSpanSign(handleEnds, handleIndex);
  if (minSpan != null && (currDistSign.sign !== originalDistSign.sign || currDistSign.span < minSpan)) {
    handleEnds[1 - handleIndex] = handleEnds[handleIndex] + originalDistSign.sign * minSpan;
  }
  currDistSign = getSpanSign(handleEnds, handleIndex);
  if (maxSpan != null && currDistSign.span > maxSpan) {
    handleEnds[1 - handleIndex] = handleEnds[handleIndex] + currDistSign.sign * maxSpan;
  }
  return handleEnds;
}
function getSpanSign(handleEnds, handleIndex) {
  var dist3 = handleEnds[handleIndex] - handleEnds[1 - handleIndex];
  return {
    span: Math.abs(dist3),
    sign: dist3 > 0 ? -1 : dist3 < 0 ? 1 : handleIndex ? -1 : 1
  };
}
function restrict(value, extend2) {
  return Math.min(extend2[1] != null ? extend2[1] : Infinity, Math.max(extend2[0] != null ? extend2[0] : -Infinity, value));
}

// node_modules/echarts/lib/coord/parallel/Parallel.js
var each4 = each;
var mathMin3 = Math.min;
var mathMax3 = Math.max;
var mathFloor2 = Math.floor;
var mathCeil2 = Math.ceil;
var round2 = round;
var PI5 = Math.PI;
var Parallel = (
  /** @class */
  function() {
    function Parallel2(parallelModel, ecModel, api) {
      this.type = "parallel";
      this._axesMap = createHashMap();
      this._axesLayout = {};
      this.dimensions = parallelModel.dimensions;
      this._model = parallelModel;
      this._init(parallelModel, ecModel, api);
    }
    Parallel2.prototype._init = function(parallelModel, ecModel, api) {
      var dimensions = parallelModel.dimensions;
      var parallelAxisIndex = parallelModel.parallelAxisIndex;
      each4(dimensions, function(dim, idx) {
        var axisIndex = parallelAxisIndex[idx];
        var axisModel = ecModel.getComponent("parallelAxis", axisIndex);
        var axis = this._axesMap.set(dim, new ParallelAxis_default(dim, createScaleByModel(axisModel), [0, 0], axisModel.get("type"), axisIndex));
        var isCategory = axis.type === "category";
        axis.onBand = isCategory && axisModel.get("boundaryGap");
        axis.inverse = axisModel.get("inverse");
        axisModel.axis = axis;
        axis.model = axisModel;
        axis.coordinateSystem = axisModel.coordinateSystem = this;
      }, this);
    };
    Parallel2.prototype.update = function(ecModel, api) {
      this._updateAxesFromSeries(this._model, ecModel);
    };
    Parallel2.prototype.containPoint = function(point) {
      var layoutInfo = this._makeLayoutInfo();
      var axisBase = layoutInfo.axisBase;
      var layoutBase = layoutInfo.layoutBase;
      var pixelDimIndex = layoutInfo.pixelDimIndex;
      var pAxis = point[1 - pixelDimIndex];
      var pLayout = point[pixelDimIndex];
      return pAxis >= axisBase && pAxis <= axisBase + layoutInfo.axisLength && pLayout >= layoutBase && pLayout <= layoutBase + layoutInfo.layoutLength;
    };
    Parallel2.prototype.getModel = function() {
      return this._model;
    };
    Parallel2.prototype._updateAxesFromSeries = function(parallelModel, ecModel) {
      ecModel.eachSeries(function(seriesModel) {
        if (!parallelModel.contains(seriesModel, ecModel)) {
          return;
        }
        var data = seriesModel.getData();
        each4(this.dimensions, function(dim) {
          var axis = this._axesMap.get(dim);
          axis.scale.unionExtentFromData(data, data.mapDimension(dim));
          niceScaleExtent(axis.scale, axis.model);
        }, this);
      }, this);
    };
    Parallel2.prototype.resize = function(parallelModel, api) {
      this._rect = getLayoutRect(parallelModel.getBoxLayoutParams(), {
        width: api.getWidth(),
        height: api.getHeight()
      });
      this._layoutAxes();
    };
    Parallel2.prototype.getRect = function() {
      return this._rect;
    };
    Parallel2.prototype._makeLayoutInfo = function() {
      var parallelModel = this._model;
      var rect = this._rect;
      var xy = ["x", "y"];
      var wh = ["width", "height"];
      var layout3 = parallelModel.get("layout");
      var pixelDimIndex = layout3 === "horizontal" ? 0 : 1;
      var layoutLength = rect[wh[pixelDimIndex]];
      var layoutExtent = [0, layoutLength];
      var axisCount = this.dimensions.length;
      var axisExpandWidth = restrict2(parallelModel.get("axisExpandWidth"), layoutExtent);
      var axisExpandCount = restrict2(parallelModel.get("axisExpandCount") || 0, [0, axisCount]);
      var axisExpandable = parallelModel.get("axisExpandable") && axisCount > 3 && axisCount > axisExpandCount && axisExpandCount > 1 && axisExpandWidth > 0 && layoutLength > 0;
      var axisExpandWindow = parallelModel.get("axisExpandWindow");
      var winSize;
      if (!axisExpandWindow) {
        winSize = restrict2(axisExpandWidth * (axisExpandCount - 1), layoutExtent);
        var axisExpandCenter = parallelModel.get("axisExpandCenter") || mathFloor2(axisCount / 2);
        axisExpandWindow = [axisExpandWidth * axisExpandCenter - winSize / 2];
        axisExpandWindow[1] = axisExpandWindow[0] + winSize;
      } else {
        winSize = restrict2(axisExpandWindow[1] - axisExpandWindow[0], layoutExtent);
        axisExpandWindow[1] = axisExpandWindow[0] + winSize;
      }
      var axisCollapseWidth = (layoutLength - winSize) / (axisCount - axisExpandCount);
      axisCollapseWidth < 3 && (axisCollapseWidth = 0);
      var winInnerIndices = [mathFloor2(round2(axisExpandWindow[0] / axisExpandWidth, 1)) + 1, mathCeil2(round2(axisExpandWindow[1] / axisExpandWidth, 1)) - 1];
      var axisExpandWindow0Pos = axisCollapseWidth / axisExpandWidth * axisExpandWindow[0];
      return {
        layout: layout3,
        pixelDimIndex,
        layoutBase: rect[xy[pixelDimIndex]],
        layoutLength,
        axisBase: rect[xy[1 - pixelDimIndex]],
        axisLength: rect[wh[1 - pixelDimIndex]],
        axisExpandable,
        axisExpandWidth,
        axisCollapseWidth,
        axisExpandWindow,
        axisCount,
        winInnerIndices,
        axisExpandWindow0Pos
      };
    };
    Parallel2.prototype._layoutAxes = function() {
      var rect = this._rect;
      var axes = this._axesMap;
      var dimensions = this.dimensions;
      var layoutInfo = this._makeLayoutInfo();
      var layout3 = layoutInfo.layout;
      axes.each(function(axis) {
        var axisExtent = [0, layoutInfo.axisLength];
        var idx = axis.inverse ? 1 : 0;
        axis.setExtent(axisExtent[idx], axisExtent[1 - idx]);
      });
      each4(dimensions, function(dim, idx) {
        var posInfo = (layoutInfo.axisExpandable ? layoutAxisWithExpand : layoutAxisWithoutExpand)(idx, layoutInfo);
        var positionTable = {
          horizontal: {
            x: posInfo.position,
            y: layoutInfo.axisLength
          },
          vertical: {
            x: 0,
            y: posInfo.position
          }
        };
        var rotationTable = {
          horizontal: PI5 / 2,
          vertical: 0
        };
        var position = [positionTable[layout3].x + rect.x, positionTable[layout3].y + rect.y];
        var rotation = rotationTable[layout3];
        var transform = create();
        rotate(transform, transform, rotation);
        translate(transform, transform, position);
        this._axesLayout[dim] = {
          position,
          rotation,
          transform,
          axisNameAvailableWidth: posInfo.axisNameAvailableWidth,
          axisLabelShow: posInfo.axisLabelShow,
          nameTruncateMaxWidth: posInfo.nameTruncateMaxWidth,
          tickDirection: 1,
          labelDirection: 1
        };
      }, this);
    };
    Parallel2.prototype.getAxis = function(dim) {
      return this._axesMap.get(dim);
    };
    Parallel2.prototype.dataToPoint = function(value, dim) {
      return this.axisCoordToPoint(this._axesMap.get(dim).dataToCoord(value), dim);
    };
    Parallel2.prototype.eachActiveState = function(data, callback, start, end) {
      start == null && (start = 0);
      end == null && (end = data.count());
      var axesMap = this._axesMap;
      var dimensions = this.dimensions;
      var dataDimensions = [];
      var axisModels = [];
      each(dimensions, function(axisDim) {
        dataDimensions.push(data.mapDimension(axisDim));
        axisModels.push(axesMap.get(axisDim).model);
      });
      var hasActiveSet = this.hasAxisBrushed();
      for (var dataIndex = start; dataIndex < end; dataIndex++) {
        var activeState = void 0;
        if (!hasActiveSet) {
          activeState = "normal";
        } else {
          activeState = "active";
          var values = data.getValues(dataDimensions, dataIndex);
          for (var j = 0, lenj = dimensions.length; j < lenj; j++) {
            var state = axisModels[j].getActiveState(values[j]);
            if (state === "inactive") {
              activeState = "inactive";
              break;
            }
          }
        }
        callback(activeState, dataIndex);
      }
    };
    Parallel2.prototype.hasAxisBrushed = function() {
      var dimensions = this.dimensions;
      var axesMap = this._axesMap;
      var hasActiveSet = false;
      for (var j = 0, lenj = dimensions.length; j < lenj; j++) {
        if (axesMap.get(dimensions[j]).model.getActiveState() !== "normal") {
          hasActiveSet = true;
        }
      }
      return hasActiveSet;
    };
    Parallel2.prototype.axisCoordToPoint = function(coord, dim) {
      var axisLayout = this._axesLayout[dim];
      return applyTransform2([coord, 0], axisLayout.transform);
    };
    Parallel2.prototype.getAxisLayout = function(dim) {
      return clone(this._axesLayout[dim]);
    };
    Parallel2.prototype.getSlidedAxisExpandWindow = function(point) {
      var layoutInfo = this._makeLayoutInfo();
      var pixelDimIndex = layoutInfo.pixelDimIndex;
      var axisExpandWindow = layoutInfo.axisExpandWindow.slice();
      var winSize = axisExpandWindow[1] - axisExpandWindow[0];
      var extent3 = [0, layoutInfo.axisExpandWidth * (layoutInfo.axisCount - 1)];
      if (!this.containPoint(point)) {
        return {
          behavior: "none",
          axisExpandWindow
        };
      }
      var pointCoord = point[pixelDimIndex] - layoutInfo.layoutBase - layoutInfo.axisExpandWindow0Pos;
      var delta;
      var behavior = "slide";
      var axisCollapseWidth = layoutInfo.axisCollapseWidth;
      var triggerArea = this._model.get("axisExpandSlideTriggerArea");
      var useJump = triggerArea[0] != null;
      if (axisCollapseWidth) {
        if (useJump && axisCollapseWidth && pointCoord < winSize * triggerArea[0]) {
          behavior = "jump";
          delta = pointCoord - winSize * triggerArea[2];
        } else if (useJump && axisCollapseWidth && pointCoord > winSize * (1 - triggerArea[0])) {
          behavior = "jump";
          delta = pointCoord - winSize * (1 - triggerArea[2]);
        } else {
          (delta = pointCoord - winSize * triggerArea[1]) >= 0 && (delta = pointCoord - winSize * (1 - triggerArea[1])) <= 0 && (delta = 0);
        }
        delta *= layoutInfo.axisExpandWidth / axisCollapseWidth;
        delta ? sliderMove(delta, axisExpandWindow, extent3, "all") : behavior = "none";
      } else {
        var winSize2 = axisExpandWindow[1] - axisExpandWindow[0];
        var pos = extent3[1] * pointCoord / winSize2;
        axisExpandWindow = [mathMax3(0, pos - winSize2 / 2)];
        axisExpandWindow[1] = mathMin3(extent3[1], axisExpandWindow[0] + winSize2);
        axisExpandWindow[0] = axisExpandWindow[1] - winSize2;
      }
      return {
        axisExpandWindow,
        behavior
      };
    };
    return Parallel2;
  }()
);
function restrict2(len, extent3) {
  return mathMin3(mathMax3(len, extent3[0]), extent3[1]);
}
function layoutAxisWithoutExpand(axisIndex, layoutInfo) {
  var step = layoutInfo.layoutLength / (layoutInfo.axisCount - 1);
  return {
    position: step * axisIndex,
    axisNameAvailableWidth: step,
    axisLabelShow: true
  };
}
function layoutAxisWithExpand(axisIndex, layoutInfo) {
  var layoutLength = layoutInfo.layoutLength;
  var axisExpandWidth = layoutInfo.axisExpandWidth;
  var axisCount = layoutInfo.axisCount;
  var axisCollapseWidth = layoutInfo.axisCollapseWidth;
  var winInnerIndices = layoutInfo.winInnerIndices;
  var position;
  var axisNameAvailableWidth = axisCollapseWidth;
  var axisLabelShow = false;
  var nameTruncateMaxWidth;
  if (axisIndex < winInnerIndices[0]) {
    position = axisIndex * axisCollapseWidth;
    nameTruncateMaxWidth = axisCollapseWidth;
  } else if (axisIndex <= winInnerIndices[1]) {
    position = layoutInfo.axisExpandWindow0Pos + axisIndex * axisExpandWidth - layoutInfo.axisExpandWindow[0];
    axisNameAvailableWidth = axisExpandWidth;
    axisLabelShow = true;
  } else {
    position = layoutLength - (axisCount - 1 - axisIndex) * axisCollapseWidth;
    nameTruncateMaxWidth = axisCollapseWidth;
  }
  return {
    position,
    axisNameAvailableWidth,
    axisLabelShow,
    nameTruncateMaxWidth
  };
}
var Parallel_default = Parallel;

// node_modules/echarts/lib/coord/parallel/parallelCreator.js
function createParallelCoordSys(ecModel, api) {
  var coordSysList = [];
  ecModel.eachComponent("parallel", function(parallelModel, idx) {
    var coordSys = new Parallel_default(parallelModel, ecModel, api);
    coordSys.name = "parallel_" + idx;
    coordSys.resize(parallelModel, api);
    parallelModel.coordinateSystem = coordSys;
    coordSys.model = parallelModel;
    coordSysList.push(coordSys);
  });
  ecModel.eachSeries(function(seriesModel) {
    if (seriesModel.get("coordinateSystem") === "parallel") {
      var parallelModel = seriesModel.getReferringComponents("parallel", SINGLE_REFERRING).models[0];
      seriesModel.coordinateSystem = parallelModel.coordinateSystem;
    }
  });
  return coordSysList;
}
var parallelCoordSysCreator = {
  create: createParallelCoordSys
};
var parallelCreator_default = parallelCoordSysCreator;

// node_modules/echarts/lib/coord/parallel/AxisModel.js
var ParallelAxisModel = (
  /** @class */
  function(_super) {
    __extends(ParallelAxisModel2, _super);
    function ParallelAxisModel2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = ParallelAxisModel2.type;
      _this.activeIntervals = [];
      return _this;
    }
    ParallelAxisModel2.prototype.getAreaSelectStyle = function() {
      return makeStyleMapper([
        ["fill", "color"],
        ["lineWidth", "borderWidth"],
        ["stroke", "borderColor"],
        ["width", "width"],
        ["opacity", "opacity"]
        // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
        // So do not transfer decal directly.
      ])(this.getModel("areaSelectStyle"));
    };
    ParallelAxisModel2.prototype.setActiveIntervals = function(intervals) {
      var activeIntervals = this.activeIntervals = clone(intervals);
      if (activeIntervals) {
        for (var i = activeIntervals.length - 1; i >= 0; i--) {
          asc(activeIntervals[i]);
        }
      }
    };
    ParallelAxisModel2.prototype.getActiveState = function(value) {
      var activeIntervals = this.activeIntervals;
      if (!activeIntervals.length) {
        return "normal";
      }
      if (value == null || isNaN(+value)) {
        return "inactive";
      }
      if (activeIntervals.length === 1) {
        var interval = activeIntervals[0];
        if (interval[0] <= value && value <= interval[1]) {
          return "active";
        }
      } else {
        for (var i = 0, len = activeIntervals.length; i < len; i++) {
          if (activeIntervals[i][0] <= value && value <= activeIntervals[i][1]) {
            return "active";
          }
        }
      }
      return "inactive";
    };
    return ParallelAxisModel2;
  }(Component_default)
);
mixin(ParallelAxisModel, AxisModelCommonMixin);
var AxisModel_default = ParallelAxisModel;

// node_modules/echarts/lib/component/helper/BrushController.js
var BRUSH_PANEL_GLOBAL = true;
var mathMin4 = Math.min;
var mathMax4 = Math.max;
var mathPow2 = Math.pow;
var COVER_Z = 1e4;
var UNSELECT_THRESHOLD = 6;
var MIN_RESIZE_LINE_WIDTH = 6;
var MUTEX_RESOURCE_KEY = "globalPan";
var DIRECTION_MAP = {
  w: [0, 0],
  e: [0, 1],
  n: [1, 0],
  s: [1, 1]
};
var CURSOR_MAP = {
  w: "ew",
  e: "ew",
  n: "ns",
  s: "ns",
  ne: "nesw",
  sw: "nesw",
  nw: "nwse",
  se: "nwse"
};
var DEFAULT_BRUSH_OPT = {
  brushStyle: {
    lineWidth: 2,
    stroke: "rgba(210,219,238,0.3)",
    fill: "#D2DBEE"
  },
  transformable: true,
  brushMode: "single",
  removeOnClick: false
};
var baseUID = 0;
var BrushController = (
  /** @class */
  function(_super) {
    __extends(BrushController2, _super);
    function BrushController2(zr) {
      var _this = _super.call(this) || this;
      _this._track = [];
      _this._covers = [];
      _this._handlers = {};
      if (true) {
        assert(zr);
      }
      _this._zr = zr;
      _this.group = new Group_default();
      _this._uid = "brushController_" + baseUID++;
      each(pointerHandlers, function(handler, eventName) {
        this._handlers[eventName] = bind(handler, this);
      }, _this);
      return _this;
    }
    BrushController2.prototype.enableBrush = function(brushOption) {
      if (true) {
        assert(this._mounted);
      }
      this._brushType && this._doDisableBrush();
      brushOption.brushType && this._doEnableBrush(brushOption);
      return this;
    };
    BrushController2.prototype._doEnableBrush = function(brushOption) {
      var zr = this._zr;
      if (!this._enableGlobalPan) {
        take(zr, MUTEX_RESOURCE_KEY, this._uid);
      }
      each(this._handlers, function(handler, eventName) {
        zr.on(eventName, handler);
      });
      this._brushType = brushOption.brushType;
      this._brushOption = merge(clone(DEFAULT_BRUSH_OPT), brushOption, true);
    };
    BrushController2.prototype._doDisableBrush = function() {
      var zr = this._zr;
      release(zr, MUTEX_RESOURCE_KEY, this._uid);
      each(this._handlers, function(handler, eventName) {
        zr.off(eventName, handler);
      });
      this._brushType = this._brushOption = null;
    };
    BrushController2.prototype.setPanels = function(panelOpts) {
      if (panelOpts && panelOpts.length) {
        var panels_1 = this._panels = {};
        each(panelOpts, function(panelOpts2) {
          panels_1[panelOpts2.panelId] = clone(panelOpts2);
        });
      } else {
        this._panels = null;
      }
      return this;
    };
    BrushController2.prototype.mount = function(opt) {
      opt = opt || {};
      if (true) {
        this._mounted = true;
      }
      this._enableGlobalPan = opt.enableGlobalPan;
      var thisGroup = this.group;
      this._zr.add(thisGroup);
      thisGroup.attr({
        x: opt.x || 0,
        y: opt.y || 0,
        rotation: opt.rotation || 0,
        scaleX: opt.scaleX || 1,
        scaleY: opt.scaleY || 1
      });
      this._transform = thisGroup.getLocalTransform();
      return this;
    };
    BrushController2.prototype.updateCovers = function(coverConfigList) {
      if (true) {
        assert(this._mounted);
      }
      coverConfigList = map(coverConfigList, function(coverConfig) {
        return merge(clone(DEFAULT_BRUSH_OPT), coverConfig, true);
      });
      var tmpIdPrefix = "\0-brush-index-";
      var oldCovers = this._covers;
      var newCovers = this._covers = [];
      var controller = this;
      var creatingCover = this._creatingCover;
      new DataDiffer_default(oldCovers, coverConfigList, oldGetKey, getKey).add(addOrUpdate).update(addOrUpdate).remove(remove).execute();
      return this;
      function getKey(brushOption, index) {
        return (brushOption.id != null ? brushOption.id : tmpIdPrefix + index) + "-" + brushOption.brushType;
      }
      function oldGetKey(cover, index) {
        return getKey(cover.__brushOption, index);
      }
      function addOrUpdate(newIndex, oldIndex) {
        var newBrushInternal = coverConfigList[newIndex];
        if (oldIndex != null && oldCovers[oldIndex] === creatingCover) {
          newCovers[newIndex] = oldCovers[oldIndex];
        } else {
          var cover = newCovers[newIndex] = oldIndex != null ? (oldCovers[oldIndex].__brushOption = newBrushInternal, oldCovers[oldIndex]) : endCreating(controller, createCover(controller, newBrushInternal));
          updateCoverAfterCreation(controller, cover);
        }
      }
      function remove(oldIndex) {
        if (oldCovers[oldIndex] !== creatingCover) {
          controller.group.remove(oldCovers[oldIndex]);
        }
      }
    };
    BrushController2.prototype.unmount = function() {
      if (true) {
        if (!this._mounted) {
          return;
        }
      }
      this.enableBrush(false);
      clearCovers(this);
      this._zr.remove(this.group);
      if (true) {
        this._mounted = false;
      }
      return this;
    };
    BrushController2.prototype.dispose = function() {
      this.unmount();
      this.off();
    };
    return BrushController2;
  }(Eventful_default)
);
function createCover(controller, brushOption) {
  var cover = coverRenderers[brushOption.brushType].createCover(controller, brushOption);
  cover.__brushOption = brushOption;
  updateZ(cover, brushOption);
  controller.group.add(cover);
  return cover;
}
function endCreating(controller, creatingCover) {
  var coverRenderer = getCoverRenderer(creatingCover);
  if (coverRenderer.endCreating) {
    coverRenderer.endCreating(controller, creatingCover);
    updateZ(creatingCover, creatingCover.__brushOption);
  }
  return creatingCover;
}
function updateCoverShape(controller, cover) {
  var brushOption = cover.__brushOption;
  getCoverRenderer(cover).updateCoverShape(controller, cover, brushOption.range, brushOption);
}
function updateZ(cover, brushOption) {
  var z = brushOption.z;
  z == null && (z = COVER_Z);
  cover.traverse(function(el) {
    el.z = z;
    el.z2 = z;
  });
}
function updateCoverAfterCreation(controller, cover) {
  getCoverRenderer(cover).updateCommon(controller, cover);
  updateCoverShape(controller, cover);
}
function getCoverRenderer(cover) {
  return coverRenderers[cover.__brushOption.brushType];
}
function getPanelByPoint(controller, e2, localCursorPoint) {
  var panels = controller._panels;
  if (!panels) {
    return BRUSH_PANEL_GLOBAL;
  }
  var panel;
  var transform = controller._transform;
  each(panels, function(pn) {
    pn.isTargetByCursor(e2, localCursorPoint, transform) && (panel = pn);
  });
  return panel;
}
function getPanelByCover(controller, cover) {
  var panels = controller._panels;
  if (!panels) {
    return BRUSH_PANEL_GLOBAL;
  }
  var panelId = cover.__brushOption.panelId;
  return panelId != null ? panels[panelId] : BRUSH_PANEL_GLOBAL;
}
function clearCovers(controller) {
  var covers = controller._covers;
  var originalLength = covers.length;
  each(covers, function(cover) {
    controller.group.remove(cover);
  }, controller);
  covers.length = 0;
  return !!originalLength;
}
function trigger2(controller, opt) {
  var areas = map(controller._covers, function(cover) {
    var brushOption = cover.__brushOption;
    var range = clone(brushOption.range);
    return {
      brushType: brushOption.brushType,
      panelId: brushOption.panelId,
      range
    };
  });
  controller.trigger("brush", {
    areas,
    isEnd: !!opt.isEnd,
    removeOnClick: !!opt.removeOnClick
  });
}
function shouldShowCover(controller) {
  var track = controller._track;
  if (!track.length) {
    return false;
  }
  var p2 = track[track.length - 1];
  var p1 = track[0];
  var dx = p2[0] - p1[0];
  var dy = p2[1] - p1[1];
  var dist3 = mathPow2(dx * dx + dy * dy, 0.5);
  return dist3 > UNSELECT_THRESHOLD;
}
function getTrackEnds(track) {
  var tail = track.length - 1;
  tail < 0 && (tail = 0);
  return [track[0], track[tail]];
}
function createBaseRectCover(rectRangeConverter, controller, brushOption, edgeNameSequences) {
  var cover = new Group_default();
  cover.add(new Rect_default({
    name: "main",
    style: makeStyle(brushOption),
    silent: true,
    draggable: true,
    cursor: "move",
    drift: curry(driftRect, rectRangeConverter, controller, cover, ["n", "s", "w", "e"]),
    ondragend: curry(trigger2, controller, {
      isEnd: true
    })
  }));
  each(edgeNameSequences, function(nameSequence) {
    cover.add(new Rect_default({
      name: nameSequence.join(""),
      style: {
        opacity: 0
      },
      draggable: true,
      silent: true,
      invisible: true,
      drift: curry(driftRect, rectRangeConverter, controller, cover, nameSequence),
      ondragend: curry(trigger2, controller, {
        isEnd: true
      })
    }));
  });
  return cover;
}
function updateBaseRect(controller, cover, localRange, brushOption) {
  var lineWidth = brushOption.brushStyle.lineWidth || 0;
  var handleSize = mathMax4(lineWidth, MIN_RESIZE_LINE_WIDTH);
  var x = localRange[0][0];
  var y = localRange[1][0];
  var xa = x - lineWidth / 2;
  var ya = y - lineWidth / 2;
  var x2 = localRange[0][1];
  var y2 = localRange[1][1];
  var x2a = x2 - handleSize + lineWidth / 2;
  var y2a = y2 - handleSize + lineWidth / 2;
  var width = x2 - x;
  var height = y2 - y;
  var widtha = width + lineWidth;
  var heighta = height + lineWidth;
  updateRectShape(controller, cover, "main", x, y, width, height);
  if (brushOption.transformable) {
    updateRectShape(controller, cover, "w", xa, ya, handleSize, heighta);
    updateRectShape(controller, cover, "e", x2a, ya, handleSize, heighta);
    updateRectShape(controller, cover, "n", xa, ya, widtha, handleSize);
    updateRectShape(controller, cover, "s", xa, y2a, widtha, handleSize);
    updateRectShape(controller, cover, "nw", xa, ya, handleSize, handleSize);
    updateRectShape(controller, cover, "ne", x2a, ya, handleSize, handleSize);
    updateRectShape(controller, cover, "sw", xa, y2a, handleSize, handleSize);
    updateRectShape(controller, cover, "se", x2a, y2a, handleSize, handleSize);
  }
}
function updateCommon(controller, cover) {
  var brushOption = cover.__brushOption;
  var transformable = brushOption.transformable;
  var mainEl = cover.childAt(0);
  mainEl.useStyle(makeStyle(brushOption));
  mainEl.attr({
    silent: !transformable,
    cursor: transformable ? "move" : "default"
  });
  each([["w"], ["e"], ["n"], ["s"], ["s", "e"], ["s", "w"], ["n", "e"], ["n", "w"]], function(nameSequence) {
    var el = cover.childOfName(nameSequence.join(""));
    var globalDir = nameSequence.length === 1 ? getGlobalDirection1(controller, nameSequence[0]) : getGlobalDirection2(controller, nameSequence);
    el && el.attr({
      silent: !transformable,
      invisible: !transformable,
      cursor: transformable ? CURSOR_MAP[globalDir] + "-resize" : null
    });
  });
}
function updateRectShape(controller, cover, name, x, y, w, h) {
  var el = cover.childOfName(name);
  el && el.setShape(pointsToRect(clipByPanel(controller, cover, [[x, y], [x + w, y + h]])));
}
function makeStyle(brushOption) {
  return defaults({
    strokeNoScale: true
  }, brushOption.brushStyle);
}
function formatRectRange(x, y, x2, y2) {
  var min2 = [mathMin4(x, x2), mathMin4(y, y2)];
  var max2 = [mathMax4(x, x2), mathMax4(y, y2)];
  return [
    [min2[0], max2[0]],
    [min2[1], max2[1]]
    // y range
  ];
}
function getTransform2(controller) {
  return getTransform(controller.group);
}
function getGlobalDirection1(controller, localDirName) {
  var map3 = {
    w: "left",
    e: "right",
    n: "top",
    s: "bottom"
  };
  var inverseMap = {
    left: "w",
    right: "e",
    top: "n",
    bottom: "s"
  };
  var dir = transformDirection(map3[localDirName], getTransform2(controller));
  return inverseMap[dir];
}
function getGlobalDirection2(controller, localDirNameSeq) {
  var globalDir = [getGlobalDirection1(controller, localDirNameSeq[0]), getGlobalDirection1(controller, localDirNameSeq[1])];
  (globalDir[0] === "e" || globalDir[0] === "w") && globalDir.reverse();
  return globalDir.join("");
}
function driftRect(rectRangeConverter, controller, cover, dirNameSequence, dx, dy) {
  var brushOption = cover.__brushOption;
  var rectRange = rectRangeConverter.toRectRange(brushOption.range);
  var localDelta = toLocalDelta(controller, dx, dy);
  each(dirNameSequence, function(dirName) {
    var ind = DIRECTION_MAP[dirName];
    rectRange[ind[0]][ind[1]] += localDelta[ind[0]];
  });
  brushOption.range = rectRangeConverter.fromRectRange(formatRectRange(rectRange[0][0], rectRange[1][0], rectRange[0][1], rectRange[1][1]));
  updateCoverAfterCreation(controller, cover);
  trigger2(controller, {
    isEnd: false
  });
}
function driftPolygon(controller, cover, dx, dy) {
  var range = cover.__brushOption.range;
  var localDelta = toLocalDelta(controller, dx, dy);
  each(range, function(point) {
    point[0] += localDelta[0];
    point[1] += localDelta[1];
  });
  updateCoverAfterCreation(controller, cover);
  trigger2(controller, {
    isEnd: false
  });
}
function toLocalDelta(controller, dx, dy) {
  var thisGroup = controller.group;
  var localD = thisGroup.transformCoordToLocal(dx, dy);
  var localZero = thisGroup.transformCoordToLocal(0, 0);
  return [localD[0] - localZero[0], localD[1] - localZero[1]];
}
function clipByPanel(controller, cover, data) {
  var panel = getPanelByCover(controller, cover);
  return panel && panel !== BRUSH_PANEL_GLOBAL ? panel.clipPath(data, controller._transform) : clone(data);
}
function pointsToRect(points4) {
  var xmin = mathMin4(points4[0][0], points4[1][0]);
  var ymin = mathMin4(points4[0][1], points4[1][1]);
  var xmax = mathMax4(points4[0][0], points4[1][0]);
  var ymax = mathMax4(points4[0][1], points4[1][1]);
  return {
    x: xmin,
    y: ymin,
    width: xmax - xmin,
    height: ymax - ymin
  };
}
function resetCursor(controller, e2, localCursorPoint) {
  if (
    // Check active
    !controller._brushType || isOutsideZrArea(controller, e2.offsetX, e2.offsetY)
  ) {
    return;
  }
  var zr = controller._zr;
  var covers = controller._covers;
  var currPanel = getPanelByPoint(controller, e2, localCursorPoint);
  if (!controller._dragging) {
    for (var i = 0; i < covers.length; i++) {
      var brushOption = covers[i].__brushOption;
      if (currPanel && (currPanel === BRUSH_PANEL_GLOBAL || brushOption.panelId === currPanel.panelId) && coverRenderers[brushOption.brushType].contain(covers[i], localCursorPoint[0], localCursorPoint[1])) {
        return;
      }
    }
  }
  currPanel && zr.setCursorStyle("crosshair");
}
function preventDefault(e2) {
  var rawE = e2.event;
  rawE.preventDefault && rawE.preventDefault();
}
function mainShapeContain(cover, x, y) {
  return cover.childOfName("main").contain(x, y);
}
function updateCoverByMouse(controller, e2, localCursorPoint, isEnd) {
  var creatingCover = controller._creatingCover;
  var panel = controller._creatingPanel;
  var thisBrushOption = controller._brushOption;
  var eventParams;
  controller._track.push(localCursorPoint.slice());
  if (shouldShowCover(controller) || creatingCover) {
    if (panel && !creatingCover) {
      thisBrushOption.brushMode === "single" && clearCovers(controller);
      var brushOption = clone(thisBrushOption);
      brushOption.brushType = determineBrushType(brushOption.brushType, panel);
      brushOption.panelId = panel === BRUSH_PANEL_GLOBAL ? null : panel.panelId;
      creatingCover = controller._creatingCover = createCover(controller, brushOption);
      controller._covers.push(creatingCover);
    }
    if (creatingCover) {
      var coverRenderer = coverRenderers[determineBrushType(controller._brushType, panel)];
      var coverBrushOption = creatingCover.__brushOption;
      coverBrushOption.range = coverRenderer.getCreatingRange(clipByPanel(controller, creatingCover, controller._track));
      if (isEnd) {
        endCreating(controller, creatingCover);
        coverRenderer.updateCommon(controller, creatingCover);
      }
      updateCoverShape(controller, creatingCover);
      eventParams = {
        isEnd
      };
    }
  } else if (isEnd && thisBrushOption.brushMode === "single" && thisBrushOption.removeOnClick) {
    if (getPanelByPoint(controller, e2, localCursorPoint) && clearCovers(controller)) {
      eventParams = {
        isEnd,
        removeOnClick: true
      };
    }
  }
  return eventParams;
}
function determineBrushType(brushType, panel) {
  if (brushType === "auto") {
    if (true) {
      assert(panel && panel.defaultBrushType, 'MUST have defaultBrushType when brushType is "atuo"');
    }
    return panel.defaultBrushType;
  }
  return brushType;
}
var pointerHandlers = {
  mousedown: function(e2) {
    if (this._dragging) {
      handleDragEnd(this, e2);
    } else if (!e2.target || !e2.target.draggable) {
      preventDefault(e2);
      var localCursorPoint = this.group.transformCoordToLocal(e2.offsetX, e2.offsetY);
      this._creatingCover = null;
      var panel = this._creatingPanel = getPanelByPoint(this, e2, localCursorPoint);
      if (panel) {
        this._dragging = true;
        this._track = [localCursorPoint.slice()];
      }
    }
  },
  mousemove: function(e2) {
    var x = e2.offsetX;
    var y = e2.offsetY;
    var localCursorPoint = this.group.transformCoordToLocal(x, y);
    resetCursor(this, e2, localCursorPoint);
    if (this._dragging) {
      preventDefault(e2);
      var eventParams = updateCoverByMouse(this, e2, localCursorPoint, false);
      eventParams && trigger2(this, eventParams);
    }
  },
  mouseup: function(e2) {
    handleDragEnd(this, e2);
  }
};
function handleDragEnd(controller, e2) {
  if (controller._dragging) {
    preventDefault(e2);
    var x = e2.offsetX;
    var y = e2.offsetY;
    var localCursorPoint = controller.group.transformCoordToLocal(x, y);
    var eventParams = updateCoverByMouse(controller, e2, localCursorPoint, true);
    controller._dragging = false;
    controller._track = [];
    controller._creatingCover = null;
    eventParams && trigger2(controller, eventParams);
  }
}
function isOutsideZrArea(controller, x, y) {
  var zr = controller._zr;
  return x < 0 || x > zr.getWidth() || y < 0 || y > zr.getHeight();
}
var coverRenderers = {
  lineX: getLineRenderer(0),
  lineY: getLineRenderer(1),
  rect: {
    createCover: function(controller, brushOption) {
      function returnInput(range) {
        return range;
      }
      return createBaseRectCover({
        toRectRange: returnInput,
        fromRectRange: returnInput
      }, controller, brushOption, [["w"], ["e"], ["n"], ["s"], ["s", "e"], ["s", "w"], ["n", "e"], ["n", "w"]]);
    },
    getCreatingRange: function(localTrack) {
      var ends = getTrackEnds(localTrack);
      return formatRectRange(ends[1][0], ends[1][1], ends[0][0], ends[0][1]);
    },
    updateCoverShape: function(controller, cover, localRange, brushOption) {
      updateBaseRect(controller, cover, localRange, brushOption);
    },
    updateCommon,
    contain: mainShapeContain
  },
  polygon: {
    createCover: function(controller, brushOption) {
      var cover = new Group_default();
      cover.add(new Polyline_default({
        name: "main",
        style: makeStyle(brushOption),
        silent: true
      }));
      return cover;
    },
    getCreatingRange: function(localTrack) {
      return localTrack;
    },
    endCreating: function(controller, cover) {
      cover.remove(cover.childAt(0));
      cover.add(new Polygon_default({
        name: "main",
        draggable: true,
        drift: curry(driftPolygon, controller, cover),
        ondragend: curry(trigger2, controller, {
          isEnd: true
        })
      }));
    },
    updateCoverShape: function(controller, cover, localRange, brushOption) {
      cover.childAt(0).setShape({
        points: clipByPanel(controller, cover, localRange)
      });
    },
    updateCommon,
    contain: mainShapeContain
  }
};
function getLineRenderer(xyIndex) {
  return {
    createCover: function(controller, brushOption) {
      return createBaseRectCover({
        toRectRange: function(range) {
          var rectRange = [range, [0, 100]];
          xyIndex && rectRange.reverse();
          return rectRange;
        },
        fromRectRange: function(rectRange) {
          return rectRange[xyIndex];
        }
      }, controller, brushOption, [[["w"], ["e"]], [["n"], ["s"]]][xyIndex]);
    },
    getCreatingRange: function(localTrack) {
      var ends = getTrackEnds(localTrack);
      var min2 = mathMin4(ends[0][xyIndex], ends[1][xyIndex]);
      var max2 = mathMax4(ends[0][xyIndex], ends[1][xyIndex]);
      return [min2, max2];
    },
    updateCoverShape: function(controller, cover, localRange, brushOption) {
      var otherExtent;
      var panel = getPanelByCover(controller, cover);
      if (panel !== BRUSH_PANEL_GLOBAL && panel.getLinearBrushOtherExtent) {
        otherExtent = panel.getLinearBrushOtherExtent(xyIndex);
      } else {
        var zr = controller._zr;
        otherExtent = [0, [zr.getWidth(), zr.getHeight()][1 - xyIndex]];
      }
      var rectRange = [localRange, otherExtent];
      xyIndex && rectRange.reverse();
      updateBaseRect(controller, cover, rectRange, brushOption);
    },
    updateCommon,
    contain: mainShapeContain
  };
}
var BrushController_default = BrushController;

// node_modules/echarts/lib/component/helper/brushHelper.js
function makeRectPanelClipPath(rect) {
  rect = normalizeRect(rect);
  return function(localPoints) {
    return clipPointsByRect(localPoints, rect);
  };
}
function makeLinearBrushOtherExtent(rect, specifiedXYIndex) {
  rect = normalizeRect(rect);
  return function(xyIndex) {
    var idx = specifiedXYIndex != null ? specifiedXYIndex : xyIndex;
    var brushWidth = idx ? rect.width : rect.height;
    var base2 = idx ? rect.x : rect.y;
    return [base2, base2 + (brushWidth || 0)];
  };
}
function makeRectIsTargetByCursor(rect, api, targetModel) {
  var boundingRect = normalizeRect(rect);
  return function(e2, localCursorPoint) {
    return boundingRect.contain(localCursorPoint[0], localCursorPoint[1]) && !onIrrelevantElement(e2, api, targetModel);
  };
}
function normalizeRect(rect) {
  return BoundingRect_default.create(rect);
}

// node_modules/echarts/lib/component/axis/ParallelAxisView.js
var elementList = ["axisLine", "axisTickLabel", "axisName"];
var ParallelAxisView = (
  /** @class */
  function(_super) {
    __extends(ParallelAxisView2, _super);
    function ParallelAxisView2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this.type = ParallelAxisView2.type;
      return _this;
    }
    ParallelAxisView2.prototype.init = function(ecModel, api) {
      _super.prototype.init.apply(this, arguments);
      (this._brushController = new BrushController_default(api.getZr())).on("brush", bind(this._onBrush, this));
    };
    ParallelAxisView2.prototype.render = function(axisModel, ecModel, api, payload) {
      if (fromAxisAreaSelect(axisModel, ecModel, payload)) {
        return;
      }
      this.axisModel = axisModel;
      this.api = api;
      this.group.removeAll();
      var oldAxisGroup = this._axisGroup;
      this._axisGroup = new Group_default();
      this.group.add(this._axisGroup);
      if (!axisModel.get("show")) {
        return;
      }
      var coordSysModel = getCoordSysModel(axisModel, ecModel);
      var coordSys = coordSysModel.coordinateSystem;
      var areaSelectStyle = axisModel.getAreaSelectStyle();
      var areaWidth = areaSelectStyle.width;
      var dim = axisModel.axis.dim;
      var axisLayout = coordSys.getAxisLayout(dim);
      var builderOpt = extend({
        strokeContainThreshold: areaWidth
      }, axisLayout);
      var axisBuilder = new AxisBuilder_default(axisModel, builderOpt);
      each(elementList, axisBuilder.add, axisBuilder);
      this._axisGroup.add(axisBuilder.getGroup());
      this._refreshBrushController(builderOpt, areaSelectStyle, axisModel, coordSysModel, areaWidth, api);
      groupTransition(oldAxisGroup, this._axisGroup, axisModel);
    };
    ParallelAxisView2.prototype._refreshBrushController = function(builderOpt, areaSelectStyle, axisModel, coordSysModel, areaWidth, api) {
      var extent3 = axisModel.axis.getExtent();
      var extentLen = extent3[1] - extent3[0];
      var extra = Math.min(30, Math.abs(extentLen) * 0.1);
      var rect = BoundingRect_default.create({
        x: extent3[0],
        y: -areaWidth / 2,
        width: extentLen,
        height: areaWidth
      });
      rect.x -= extra;
      rect.width += 2 * extra;
      this._brushController.mount({
        enableGlobalPan: true,
        rotation: builderOpt.rotation,
        x: builderOpt.position[0],
        y: builderOpt.position[1]
      }).setPanels([{
        panelId: "pl",
        clipPath: makeRectPanelClipPath(rect),
        isTargetByCursor: makeRectIsTargetByCursor(rect, api, coordSysModel),
        getLinearBrushOtherExtent: makeLinearBrushOtherExtent(rect, 0)
      }]).enableBrush({
        brushType: "lineX",
        brushStyle: areaSelectStyle,
        removeOnClick: true
      }).updateCovers(getCoverInfoList(axisModel));
    };
    ParallelAxisView2.prototype._onBrush = function(eventParam) {
      var coverInfoList = eventParam.areas;
      var axisModel = this.axisModel;
      var axis = axisModel.axis;
      var intervals = map(coverInfoList, function(coverInfo) {
        return [axis.coordToData(coverInfo.range[0], true), axis.coordToData(coverInfo.range[1], true)];
      });
      if (!axisModel.option.realtime === eventParam.isEnd || eventParam.removeOnClick) {
        this.api.dispatchAction({
          type: "axisAreaSelect",
          parallelAxisId: axisModel.id,
          intervals
        });
      }
    };
    ParallelAxisView2.prototype.dispose = function() {
      this._brushController.dispose();
    };
    ParallelAxisView2.type = "parallelAxis";
    return ParallelAxisView2;
  }(Component_default2)
);
function fromAxisAreaSelect(axisModel, ecModel, payload) {
  return payload && payload.type === "axisAreaSelect" && ecModel.findComponents({
    mainType: "parallelAxis",
    query: payload
  })[0] === axisModel;
}
function getCoverInfoList(axisModel) {
  var axis = axisModel.axis;
  return map(axisModel.activeIntervals, function(interval) {
    return {
      brushType: "lineX",
      panelId: "pl",
      range: [axis.dataToCoord(interval[0], true), axis.dataToCoord(interval[1], true)]
    };
  });
}
function getCoordSysModel(axisModel, ecModel) {
  return ecModel.getComponent("parallel", axisModel.get("parallelIndex"));
}
var ParallelAxisView_default = ParallelAxisView;

// node_modules/echarts/lib/component/axis/parallelAxisAction.js
var actionInfo = {
  type: "axisAreaSelect",
  event: "axisAreaSelected"
  // update: 'updateVisual'
};
function installParallelActions(registers) {
  registers.registerAction(actionInfo, function(payload, ecModel) {
    ecModel.eachComponent({
      mainType: "parallelAxis",
      query: payload
    }, function(parallelAxisModel) {
      parallelAxisModel.axis.model.setActiveIntervals(payload.intervals);
    });
  });
  registers.registerAction("parallelAxisExpand", function(payload, ecModel) {
    ecModel.eachComponent({
      mainType: "parallel",
      query: payload
    }, function(parallelModel) {
      parallelModel.setAxisExpand(payload);
    });
  });
}

// node_modules/echarts/lib/component/parallel/install.js
var defaultAxisOption = {
  type: "value",
  areaSelectStyle: {
    width: 20,
    borderWidth: 1,
    borderColor: "rgba(160,197,232)",
    color: "rgba(160,197,232)",
    opacity: 0.3
  },
  realtime: true,
  z: 10
};
function install4(registers) {
  registers.registerComponentView(ParallelView_default);
  registers.registerComponentModel(ParallelModel_default);
  registers.registerCoordinateSystem("parallel", parallelCreator_default);
  registers.registerPreprocessor(parallelPreprocessor);
  registers.registerComponentModel(AxisModel_default);
  registers.registerComponentView(ParallelAxisView_default);
  axisModelCreator(registers, "parallel", AxisModel_default, defaultAxisOption);
  installParallelActions(registers);
}

// node_modules/echarts/lib/chart/helper/labelHelper.js
function getDefaultLabel(data, dataIndex) {
  var labelDims = data.mapDimensionsAll("defaultedLabel");
  var len = labelDims.length;
  if (len === 1) {
    var rawVal = retrieveRawValue(data, dataIndex, labelDims[0]);
    return rawVal != null ? rawVal + "" : null;
  } else if (len) {
    var vals = [];
    for (var i = 0; i < labelDims.length; i++) {
      vals.push(retrieveRawValue(data, dataIndex, labelDims[i]));
    }
    return vals.join(" ");
  }
}
function getDefaultInterpolatedLabel(data, interpolatedValue) {
  var labelDims = data.mapDimensionsAll("defaultedLabel");
  if (!isArray(interpolatedValue)) {
    return interpolatedValue + "";
  }
  var vals = [];
  for (var i = 0; i < labelDims.length; i++) {
    var dimIndex = data.getDimensionIndex(labelDims[i]);
    if (dimIndex >= 0) {
      vals.push(interpolatedValue[dimIndex]);
    }
  }
  return vals.join(" ");
}

// node_modules/echarts/lib/chart/helper/Symbol.js
var Symbol = (
  /** @class */
  function(_super) {
    __extends(Symbol2, _super);
    function Symbol2(data, idx, seriesScope, opts) {
      var _this = _super.call(this) || this;
      _this.updateData(data, idx, seriesScope, opts);
      return _this;
    }
    Symbol2.prototype._createSymbol = function(symbolType, data, idx, symbolSize, keepAspect) {
      this.removeAll();
      var symbolPath = createSymbol(symbolType, -1, -1, 2, 2, null, keepAspect);
      symbolPath.attr({
        z2: 100,
        culling: true,
        scaleX: symbolSize[0] / 2,
        scaleY: symbolSize[1] / 2
      });
      symbolPath.drift = driftSymbol;
      this._symbolType = symbolType;
      this.add(symbolPath);
    };
    Symbol2.prototype.stopSymbolAnimation = function(toLastFrame) {
      this.childAt(0).stopAnimation(null, toLastFrame);
    };
    Symbol2.prototype.getSymbolType = function() {
      return this._symbolType;
    };
    Symbol2.prototype.getSymbolPath = function() {
      return this.childAt(0);
    };
    Symbol2.prototype.highlight = function() {
      enterEmphasis(this.childAt(0));
    };
    Symbol2.prototype.downplay = function() {
      leaveEmphasis(this.childAt(0));
    };
    Symbol2.prototype.setZ = function(zlevel, z) {
      var symbolPath = this.childAt(0);
      symbolPath.zlevel = zlevel;
      symbolPath.z = z;
    };
    Symbol2.prototype.setDraggable = function(draggable, hasCursorOption) {
      var symbolPath = this.childAt(0);
      symbolPath.draggable = draggable;
      symbolPath.cursor = !hasCursorOption && draggable ? "move" : symbolPath.cursor;
    };
    Symbol2.prototype.updateData = function(data, idx, seriesScope, opts) {
      this.silent = false;
      var symbolType = data.getItemVisual(idx, "symbol") || "circle";
      var seriesModel = data.hostModel;
      var symbolSize = Symbol2.getSymbolSize(data, idx);
      var isInit = symbolType !== this._symbolType;
      var disableAnimation = opts && opts.disableAnimation;
      if (isInit) {
        var keepAspect = data.getItemVisual(idx, "symbolKeepAspect");
        this._createSymbol(symbolType, data, idx, symbolSize, keepAspect);
      } else {
        var symbolPath = this.childAt(0);
        symbolPath.silent = false;
        var target = {
          scaleX: symbolSize[0] / 2,
          scaleY: symbolSize[1] / 2
        };
        disableAnimation ? symbolPath.attr(target) : updateProps(symbolPath, target, seriesModel, idx);
        saveOldStyle(symbolPath);
      }
      this._updateCommon(data, idx, symbolSize, seriesScope, opts);
      if (isInit) {
        var symbolPath = this.childAt(0);
        if (!disableAnimation) {
          var target = {
            scaleX: this._sizeX,
            scaleY: this._sizeY,
            style: {
              // Always fadeIn. Because it has fadeOut animation when symbol is removed..
              opacity: symbolPath.style.opacity
            }
          };
          symbolPath.scaleX = symbolPath.scaleY = 0;
          symbolPath.style.opacity = 0;
          initProps(symbolPath, target, seriesModel, idx);
        }
      }
      if (disableAnimation) {
        this.childAt(0).stopAnimation("leave");
      }
    };
    Symbol2.prototype._updateCommon = function(data, idx, symbolSize, seriesScope, opts) {
      var symbolPath = this.childAt(0);
      var seriesModel = data.hostModel;
      var emphasisItemStyle;
      var blurItemStyle;
      var selectItemStyle;
      var focus;
      var blurScope;
      var emphasisDisabled;
      var labelStatesModels;
      var hoverScale;
      var cursorStyle;
      if (seriesScope) {
        emphasisItemStyle = seriesScope.emphasisItemStyle;
        blurItemStyle = seriesScope.blurItemStyle;
        selectItemStyle = seriesScope.selectItemStyle;
        focus = seriesScope.focus;
        blurScope = seriesScope.blurScope;
        labelStatesModels = seriesScope.labelStatesModels;
        hoverScale = seriesScope.hoverScale;
        cursorStyle = seriesScope.cursorStyle;
        emphasisDisabled = seriesScope.emphasisDisabled;
      }
      if (!seriesScope || data.hasItemOption) {
        var itemModel = seriesScope && seriesScope.itemModel ? seriesScope.itemModel : data.getItemModel(idx);
        var emphasisModel = itemModel.getModel("emphasis");
        emphasisItemStyle = emphasisModel.getModel("itemStyle").getItemStyle();
        selectItemStyle = itemModel.getModel(["select", "itemStyle"]).getItemStyle();
        blurItemStyle = itemModel.getModel(["blur", "itemStyle"]).getItemStyle();
        focus = emphasisModel.get("focus");
        blurScope = emphasisModel.get("blurScope");
        emphasisDisabled = emphasisModel.get("disabled");
        labelStatesModels = getLabelStatesModels(itemModel);
        hoverScale = emphasisModel.getShallow("scale");
        cursorStyle = itemModel.getShallow("cursor");
      }
      var symbolRotate = data.getItemVisual(idx, "symbolRotate");
      symbolPath.attr("rotation", (symbolRotate || 0) * Math.PI / 180 || 0);
      var symbolOffset = normalizeSymbolOffset(data.getItemVisual(idx, "symbolOffset"), symbolSize);
      if (symbolOffset) {
        symbolPath.x = symbolOffset[0];
        symbolPath.y = symbolOffset[1];
      }
      cursorStyle && symbolPath.attr("cursor", cursorStyle);
      var symbolStyle = data.getItemVisual(idx, "style");
      var visualColor = symbolStyle.fill;
      if (symbolPath instanceof Image_default) {
        var pathStyle = symbolPath.style;
        symbolPath.useStyle(extend({
          // TODO other properties like x, y ?
          image: pathStyle.image,
          x: pathStyle.x,
          y: pathStyle.y,
          width: pathStyle.width,
          height: pathStyle.height
        }, symbolStyle));
      } else {
        if (symbolPath.__isEmptyBrush) {
          symbolPath.useStyle(extend({}, symbolStyle));
        } else {
          symbolPath.useStyle(symbolStyle);
        }
        symbolPath.style.decal = null;
        symbolPath.setColor(visualColor, opts && opts.symbolInnerColor);
        symbolPath.style.strokeNoScale = true;
      }
      var liftZ = data.getItemVisual(idx, "liftZ");
      var z2Origin = this._z2;
      if (liftZ != null) {
        if (z2Origin == null) {
          this._z2 = symbolPath.z2;
          symbolPath.z2 += liftZ;
        }
      } else if (z2Origin != null) {
        symbolPath.z2 = z2Origin;
        this._z2 = null;
      }
      var useNameLabel = opts && opts.useNameLabel;
      setLabelStyle(symbolPath, labelStatesModels, {
        labelFetcher: seriesModel,
        labelDataIndex: idx,
        defaultText: getLabelDefaultText,
        inheritColor: visualColor,
        defaultOpacity: symbolStyle.opacity
      });
      function getLabelDefaultText(idx2) {
        return useNameLabel ? data.getName(idx2) : getDefaultLabel(data, idx2);
      }
      this._sizeX = symbolSize[0] / 2;
      this._sizeY = symbolSize[1] / 2;
      var emphasisState = symbolPath.ensureState("emphasis");
      emphasisState.style = emphasisItemStyle;
      symbolPath.ensureState("select").style = selectItemStyle;
      symbolPath.ensureState("blur").style = blurItemStyle;
      var scaleRatio = hoverScale == null || hoverScale === true ? Math.max(1.1, 3 / this._sizeY) : isFinite(hoverScale) && hoverScale > 0 ? +hoverScale : 1;
      emphasisState.scaleX = this._sizeX * scaleRatio;
      emphasisState.scaleY = this._sizeY * scaleRatio;
      this.setSymbolScale(1);
      toggleHoverEmphasis(this, focus, blurScope, emphasisDisabled);
    };
    Symbol2.prototype.setSymbolScale = function(scale4) {
      this.scaleX = this.scaleY = scale4;
    };
    Symbol2.prototype.fadeOut = function(cb, seriesModel, opt) {
      var symbolPath = this.childAt(0);
      var dataIndex = getECData(this).dataIndex;
      var animationOpt = opt && opt.animation;
      this.silent = symbolPath.silent = true;
      if (opt && opt.fadeLabel) {
        var textContent = symbolPath.getTextContent();
        if (textContent) {
          removeElement(textContent, {
            style: {
              opacity: 0
            }
          }, seriesModel, {
            dataIndex,
            removeOpt: animationOpt,
            cb: function() {
              symbolPath.removeTextContent();
            }
          });
        }
      } else {
        symbolPath.removeTextContent();
      }
      removeElement(symbolPath, {
        style: {
          opacity: 0
        },
        scaleX: 0,
        scaleY: 0
      }, seriesModel, {
        dataIndex,
        cb,
        removeOpt: animationOpt
      });
    };
    Symbol2.getSymbolSize = function(data, idx) {
      return normalizeSymbolSize(data.getItemVisual(idx, "symbolSize"));
    };
    return Symbol2;
  }(Group_default)
);
function driftSymbol(dx, dy) {
  this.parent.drift(dx, dy);
}
var Symbol_default = Symbol;

// node_modules/echarts/lib/chart/helper/SymbolDraw.js
function symbolNeedsDraw(data, point, idx, opt) {
  return point && !isNaN(point[0]) && !isNaN(point[1]) && !(opt.isIgnore && opt.isIgnore(idx)) && !(opt.clipShape && !opt.clipShape.contain(point[0], point[1])) && data.getItemVisual(idx, "symbol") !== "none";
}
function normalizeUpdateOpt(opt) {
  if (opt != null && !isObject(opt)) {
    opt = {
      isIgnore: opt
    };
  }
  return opt || {};
}
function makeSeriesScope(data) {
  var seriesModel = data.hostModel;
  var emphasisModel = seriesModel.getModel("emphasis");
  return {
    emphasisItemStyle: emphasisModel.getModel("itemStyle").getItemStyle(),
    blurItemStyle: seriesModel.getModel(["blur", "itemStyle"]).getItemStyle(),
    selectItemStyle: seriesModel.getModel(["select", "itemStyle"]).getItemStyle(),
    focus: emphasisModel.get("focus"),
    blurScope: emphasisModel.get("blurScope"),
    emphasisDisabled: emphasisModel.get("disabled"),
    hoverScale: emphasisModel.get("scale"),
    labelStatesModels: getLabelStatesModels(seriesModel),
    cursorStyle: seriesModel.get("cursor")
  };
}
var SymbolDraw = (
  /** @class */
  function() {
    function SymbolDraw2(SymbolCtor) {
      this.group = new Group_default();
      this._SymbolCtor = SymbolCtor || Symbol_default;
    }
    SymbolDraw2.prototype.updateData = function(data, opt) {
      this._progressiveEls = null;
      opt = normalizeUpdateOpt(opt);
      var group = this.group;
      var seriesModel = data.hostModel;
      var oldData = this._data;
      var SymbolCtor = this._SymbolCtor;
      var disableAnimation = opt.disableAnimation;
      var seriesScope = makeSeriesScope(data);
      var symbolUpdateOpt = {
        disableAnimation
      };
      var getSymbolPoint = opt.getSymbolPoint || function(idx) {
        return data.getItemLayout(idx);
      };
      if (!oldData) {
        group.removeAll();
      }
      data.diff(oldData).add(function(newIdx) {
        var point = getSymbolPoint(newIdx);
        if (symbolNeedsDraw(data, point, newIdx, opt)) {
          var symbolEl = new SymbolCtor(data, newIdx, seriesScope, symbolUpdateOpt);
          symbolEl.setPosition(point);
          data.setItemGraphicEl(newIdx, symbolEl);
          group.add(symbolEl);
        }
      }).update(function(newIdx, oldIdx) {
        var symbolEl = oldData.getItemGraphicEl(oldIdx);
        var point = getSymbolPoint(newIdx);
        if (!symbolNeedsDraw(data, point, newIdx, opt)) {
          group.remove(symbolEl);
          return;
        }
        var newSymbolType = data.getItemVisual(newIdx, "symbol") || "circle";
        var oldSymbolType = symbolEl && symbolEl.getSymbolType && symbolEl.getSymbolType();
        if (!symbolEl || oldSymbolType && oldSymbolType !== newSymbolType) {
          group.remove(symbolEl);
          symbolEl = new SymbolCtor(data, newIdx, seriesScope, symbolUpdateOpt);
          symbolEl.setPosition(point);
        } else {
          symbolEl.updateData(data, newIdx, seriesScope, symbolUpdateOpt);
          var target = {
            x: point[0],
            y: point[1]
          };
          disableAnimation ? symbolEl.attr(target) : updateProps(symbolEl, target, seriesModel);
        }
        group.add(symbolEl);
        data.setItemGraphicEl(newIdx, symbolEl);
      }).remove(function(oldIdx) {
        var el = oldData.getItemGraphicEl(oldIdx);
        el && el.fadeOut(function() {
          group.remove(el);
        }, seriesModel);
      }).execute();
      this._getSymbolPoint = getSymbolPoint;
      this._data = data;
    };
    ;
    SymbolDraw2.prototype.updateLayout = function() {
      var _this = this;
      var data = this._data;
      if (data) {
        data.eachItemGraphicEl(function(el, idx) {
          var point = _this._getSymbolPoint(idx);
          el.setPosition(point);
          el.markRedraw();
        });
      }
    };
    ;
    SymbolDraw2.prototype.incrementalPrepareUpdate = function(data) {
      this._seriesScope = makeSeriesScope(data);
      this._data = null;
      this.group.removeAll();
    };
    ;
    SymbolDraw2.prototype.incrementalUpdate = function(taskParams, data, opt) {
      this._progressiveEls = [];
      opt = normalizeUpdateOpt(opt);
      function updateIncrementalAndHover(el2) {
        if (!el2.isGroup) {
          el2.incremental = true;
          el2.ensureState("emphasis").hoverLayer = true;
        }
      }
      for (var idx = taskParams.start; idx < taskParams.end; idx++) {
        var point = data.getItemLayout(idx);
        if (symbolNeedsDraw(data, point, idx, opt)) {
          var el = new this._SymbolCtor(data, idx, this._seriesScope);
          el.traverse(updateIncrementalAndHover);
          el.setPosition(point);
          this.group.add(el);
          data.setItemGraphicEl(idx, el);
          this._progressiveEls.push(el);
        }
      }
    };
    ;
    SymbolDraw2.prototype.eachRendered = function(cb) {
      traverseElements(this._progressiveEls || this.group, cb);
    };
    SymbolDraw2.prototype.remove = function(enableAnimation) {
      var group = this.group;
      var data = this._data;
      if (data && enableAnimation) {
        data.eachItemGraphicEl(function(el) {
          el.fadeOut(function() {
            group.remove(el);
          }, data.hostModel);
        });
      } else {
        group.removeAll();
      }
    };
    ;
    return SymbolDraw2;
  }()
);
var SymbolDraw_default = SymbolDraw;

// node_modules/echarts/lib/coord/CoordinateSystem.js
function isCoordinateSystemType(coordSys, type) {
  return coordSys.type === type;
}

// node_modules/echarts/lib/visual/VisualMapping.js
var each5 = each;
var isObject4 = isObject;
var CATEGORY_DEFAULT_VISUAL_INDEX = -1;
var VisualMapping = (
  /** @class */
  function() {
    function VisualMapping2(option) {
      var mappingMethod = option.mappingMethod;
      var visualType = option.type;
      var thisOption = this.option = clone(option);
      this.type = visualType;
      this.mappingMethod = mappingMethod;
      this._normalizeData = normalizers[mappingMethod];
      var visualHandler = VisualMapping2.visualHandlers[visualType];
      this.applyVisual = visualHandler.applyVisual;
      this.getColorMapper = visualHandler.getColorMapper;
      this._normalizedToVisual = visualHandler._normalizedToVisual[mappingMethod];
      if (mappingMethod === "piecewise") {
        normalizeVisualRange(thisOption);
        preprocessForPiecewise(thisOption);
      } else if (mappingMethod === "category") {
        thisOption.categories ? preprocessForSpecifiedCategory(thisOption) : normalizeVisualRange(thisOption, true);
      } else {
        assert(mappingMethod !== "linear" || thisOption.dataExtent);
        normalizeVisualRange(thisOption);
      }
    }
    VisualMapping2.prototype.mapValueToVisual = function(value) {
      var normalized = this._normalizeData(value);
      return this._normalizedToVisual(normalized, value);
    };
    VisualMapping2.prototype.getNormalizer = function() {
      return bind(this._normalizeData, this);
    };
    VisualMapping2.listVisualTypes = function() {
      return keys(VisualMapping2.visualHandlers);
    };
    VisualMapping2.isValidType = function(visualType) {
      return VisualMapping2.visualHandlers.hasOwnProperty(visualType);
    };
    VisualMapping2.eachVisual = function(visual, callback, context) {
      if (isObject(visual)) {
        each(visual, callback, context);
      } else {
        callback.call(context, visual);
      }
    };
    VisualMapping2.mapVisual = function(visual, callback, context) {
      var isPrimary;
      var newVisual = isArray(visual) ? [] : isObject(visual) ? {} : (isPrimary = true, null);
      VisualMapping2.eachVisual(visual, function(v, key) {
        var newVal = callback.call(context, v, key);
        isPrimary ? newVisual = newVal : newVisual[key] = newVal;
      });
      return newVisual;
    };
    VisualMapping2.retrieveVisuals = function(obj) {
      var ret = {};
      var hasVisual;
      obj && each5(VisualMapping2.visualHandlers, function(h, visualType) {
        if (obj.hasOwnProperty(visualType)) {
          ret[visualType] = obj[visualType];
          hasVisual = true;
        }
      });
      return hasVisual ? ret : null;
    };
    VisualMapping2.prepareVisualTypes = function(visualTypes) {
      if (isArray(visualTypes)) {
        visualTypes = visualTypes.slice();
      } else if (isObject4(visualTypes)) {
        var types_1 = [];
        each5(visualTypes, function(item, type) {
          types_1.push(type);
        });
        visualTypes = types_1;
      } else {
        return [];
      }
      visualTypes.sort(function(type1, type2) {
        return type2 === "color" && type1 !== "color" && type1.indexOf("color") === 0 ? 1 : -1;
      });
      return visualTypes;
    };
    VisualMapping2.dependsOn = function(visualType1, visualType2) {
      return visualType2 === "color" ? !!(visualType1 && visualType1.indexOf(visualType2) === 0) : visualType1 === visualType2;
    };
    VisualMapping2.findPieceIndex = function(value, pieceList, findClosestWhenOutside) {
      var possibleI;
      var abs = Infinity;
      for (var i = 0, len = pieceList.length; i < len; i++) {
        var pieceValue = pieceList[i].value;
        if (pieceValue != null) {
          if (pieceValue === value || isString(pieceValue) && pieceValue === value + "") {
            return i;
          }
          findClosestWhenOutside && updatePossible(pieceValue, i);
        }
      }
      for (var i = 0, len = pieceList.length; i < len; i++) {
        var piece = pieceList[i];
        var interval = piece.interval;
        var close_1 = piece.close;
        if (interval) {
          if (interval[0] === -Infinity) {
            if (littleThan(close_1[1], value, interval[1])) {
              return i;
            }
          } else if (interval[1] === Infinity) {
            if (littleThan(close_1[0], interval[0], value)) {
              return i;
            }
          } else if (littleThan(close_1[0], interval[0], value) && littleThan(close_1[1], value, interval[1])) {
            return i;
          }
          findClosestWhenOutside && updatePossible(interval[0], i);
          findClosestWhenOutside && updatePossible(interval[1], i);
        }
      }
      if (findClosestWhenOutside) {
        return value === Infinity ? pieceList.length - 1 : value === -Infinity ? 0 : possibleI;
      }
      function updatePossible(val, index) {
        var newAbs = Math.abs(val - value);
        if (newAbs < abs) {
          abs = newAbs;
          possibleI = index;
        }
      }
    };
    VisualMapping2.visualHandlers = {
      color: {
        applyVisual: makeApplyVisual("color"),
        getColorMapper: function() {
          var thisOption = this.option;
          return bind(thisOption.mappingMethod === "category" ? function(value, isNormalized) {
            !isNormalized && (value = this._normalizeData(value));
            return doMapCategory.call(this, value);
          } : function(value, isNormalized, out2) {
            var returnRGBArray = !!out2;
            !isNormalized && (value = this._normalizeData(value));
            out2 = fastLerp(value, thisOption.parsedVisual, out2);
            return returnRGBArray ? out2 : stringify(out2, "rgba");
          }, this);
        },
        _normalizedToVisual: {
          linear: function(normalized) {
            return stringify(fastLerp(normalized, this.option.parsedVisual), "rgba");
          },
          category: doMapCategory,
          piecewise: function(normalized, value) {
            var result = getSpecifiedVisual.call(this, value);
            if (result == null) {
              result = stringify(fastLerp(normalized, this.option.parsedVisual), "rgba");
            }
            return result;
          },
          fixed: doMapFixed
        }
      },
      colorHue: makePartialColorVisualHandler(function(color, value) {
        return modifyHSL(color, value);
      }),
      colorSaturation: makePartialColorVisualHandler(function(color, value) {
        return modifyHSL(color, null, value);
      }),
      colorLightness: makePartialColorVisualHandler(function(color, value) {
        return modifyHSL(color, null, null, value);
      }),
      colorAlpha: makePartialColorVisualHandler(function(color, value) {
        return modifyAlpha(color, value);
      }),
      decal: {
        applyVisual: makeApplyVisual("decal"),
        _normalizedToVisual: {
          linear: null,
          category: doMapCategory,
          piecewise: null,
          fixed: null
        }
      },
      opacity: {
        applyVisual: makeApplyVisual("opacity"),
        _normalizedToVisual: createNormalizedToNumericVisual([0, 1])
      },
      liftZ: {
        applyVisual: makeApplyVisual("liftZ"),
        _normalizedToVisual: {
          linear: doMapFixed,
          category: doMapFixed,
          piecewise: doMapFixed,
          fixed: doMapFixed
        }
      },
      symbol: {
        applyVisual: function(value, getter, setter) {
          var symbolCfg = this.mapValueToVisual(value);
          setter("symbol", symbolCfg);
        },
        _normalizedToVisual: {
          linear: doMapToArray,
          category: doMapCategory,
          piecewise: function(normalized, value) {
            var result = getSpecifiedVisual.call(this, value);
            if (result == null) {
              result = doMapToArray.call(this, normalized);
            }
            return result;
          },
          fixed: doMapFixed
        }
      },
      symbolSize: {
        applyVisual: makeApplyVisual("symbolSize"),
        _normalizedToVisual: createNormalizedToNumericVisual([0, 1])
      }
    };
    return VisualMapping2;
  }()
);
function preprocessForPiecewise(thisOption) {
  var pieceList = thisOption.pieceList;
  thisOption.hasSpecialVisual = false;
  each(pieceList, function(piece, index) {
    piece.originIndex = index;
    if (piece.visual != null) {
      thisOption.hasSpecialVisual = true;
    }
  });
}
function preprocessForSpecifiedCategory(thisOption) {
  var categories = thisOption.categories;
  var categoryMap = thisOption.categoryMap = {};
  var visual = thisOption.visual;
  each5(categories, function(cate, index) {
    categoryMap[cate] = index;
  });
  if (!isArray(visual)) {
    var visualArr_1 = [];
    if (isObject(visual)) {
      each5(visual, function(v, cate) {
        var index = categoryMap[cate];
        visualArr_1[index != null ? index : CATEGORY_DEFAULT_VISUAL_INDEX] = v;
      });
    } else {
      visualArr_1[CATEGORY_DEFAULT_VISUAL_INDEX] = visual;
    }
    visual = setVisualToOption(thisOption, visualArr_1);
  }
  for (var i = categories.length - 1; i >= 0; i--) {
    if (visual[i] == null) {
      delete categoryMap[categories[i]];
      categories.pop();
    }
  }
}
function normalizeVisualRange(thisOption, isCategory) {
  var visual = thisOption.visual;
  var visualArr = [];
  if (isObject(visual)) {
    each5(visual, function(v) {
      visualArr.push(v);
    });
  } else if (visual != null) {
    visualArr.push(visual);
  }
  var doNotNeedPair = {
    color: 1,
    symbol: 1
  };
  if (!isCategory && visualArr.length === 1 && !doNotNeedPair.hasOwnProperty(thisOption.type)) {
    visualArr[1] = visualArr[0];
  }
  setVisualToOption(thisOption, visualArr);
}
function makePartialColorVisualHandler(applyValue) {
  return {
    applyVisual: function(value, getter, setter) {
      var colorChannel = this.mapValueToVisual(value);
      setter("color", applyValue(getter("color"), colorChannel));
    },
    _normalizedToVisual: createNormalizedToNumericVisual([0, 1])
  };
}
function doMapToArray(normalized) {
  var visual = this.option.visual;
  return visual[Math.round(linearMap(normalized, [0, 1], [0, visual.length - 1], true))] || {};
}
function makeApplyVisual(visualType) {
  return function(value, getter, setter) {
    setter(visualType, this.mapValueToVisual(value));
  };
}
function doMapCategory(normalized) {
  var visual = this.option.visual;
  return visual[this.option.loop && normalized !== CATEGORY_DEFAULT_VISUAL_INDEX ? normalized % visual.length : normalized];
}
function doMapFixed() {
  return this.option.visual[0];
}
function createNormalizedToNumericVisual(sourceExtent) {
  return {
    linear: function(normalized) {
      return linearMap(normalized, sourceExtent, this.option.visual, true);
    },
    category: doMapCategory,
    piecewise: function(normalized, value) {
      var result = getSpecifiedVisual.call(this, value);
      if (result == null) {
        result = linearMap(normalized, sourceExtent, this.option.visual, true);
      }
      return result;
    },
    fixed: doMapFixed
  };
}
function getSpecifiedVisual(value) {
  var thisOption = this.option;
  var pieceList = thisOption.pieceList;
  if (thisOption.hasSpecialVisual) {
    var pieceIndex = VisualMapping.findPieceIndex(value, pieceList);
    var piece = pieceList[pieceIndex];
    if (piece && piece.visual) {
      return piece.visual[this.type];
    }
  }
}
function setVisualToOption(thisOption, visualArr) {
  thisOption.visual = visualArr;
  if (thisOption.type === "color") {
    thisOption.parsedVisual = map(visualArr, function(item) {
      var color = parse(item);
      if (!color && true) {
        warn("'" + item + "' is an illegal color, fallback to '#000000'", true);
      }
      return color || [0, 0, 0, 1];
    });
  }
  return visualArr;
}
var normalizers = {
  linear: function(value) {
    return linearMap(value, this.option.dataExtent, [0, 1], true);
  },
  piecewise: function(value) {
    var pieceList = this.option.pieceList;
    var pieceIndex = VisualMapping.findPieceIndex(value, pieceList, true);
    if (pieceIndex != null) {
      return linearMap(pieceIndex, [0, pieceList.length - 1], [0, 1], true);
    }
  },
  category: function(value) {
    var index = this.option.categories ? this.option.categoryMap[value] : value;
    return index == null ? CATEGORY_DEFAULT_VISUAL_INDEX : index;
  },
  fixed: noop
};
function littleThan(close, a, b) {
  return close ? a <= b : a < b;
}
var VisualMapping_default = VisualMapping;

// node_modules/echarts/lib/chart/helper/LinePath.js
var straightLineProto = Line_default.prototype;
var bezierCurveProto = BezierCurve_default.prototype;
var StraightLineShape = (
  /** @class */
  function() {
    function StraightLineShape2() {
      this.x1 = 0;
      this.y1 = 0;
      this.x2 = 0;
      this.y2 = 0;
      this.percent = 1;
    }
    return StraightLineShape2;
  }()
);
var CurveShape = (
  /** @class */
  function(_super) {
    __extends(CurveShape2, _super);
    function CurveShape2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    return CurveShape2;
  }(StraightLineShape)
);
function isStraightLine(shape) {
  return isNaN(+shape.cpx1) || isNaN(+shape.cpy1);
}
var ECLinePath = (
  /** @class */
  function(_super) {
    __extends(ECLinePath2, _super);
    function ECLinePath2(opts) {
      var _this = _super.call(this, opts) || this;
      _this.type = "ec-line";
      return _this;
    }
    ECLinePath2.prototype.getDefaultStyle = function() {
      return {
        stroke: "#000",
        fill: null
      };
    };
    ECLinePath2.prototype.getDefaultShape = function() {
      return new StraightLineShape();
    };
    ECLinePath2.prototype.buildPath = function(ctx, shape) {
      if (isStraightLine(shape)) {
        straightLineProto.buildPath.call(this, ctx, shape);
      } else {
        bezierCurveProto.buildPath.call(this, ctx, shape);
      }
    };
    ECLinePath2.prototype.pointAt = function(t) {
      if (isStraightLine(this.shape)) {
        return straightLineProto.pointAt.call(this, t);
      } else {
        return bezierCurveProto.pointAt.call(this, t);
      }
    };
    ECLinePath2.prototype.tangentAt = function(t) {
      var shape = this.shape;
      var p = isStraightLine(shape) ? [shape.x2 - shape.x1, shape.y2 - shape.y1] : bezierCurveProto.tangentAt.call(this, t);
      return normalize(p, p);
    };
    return ECLinePath2;
  }(Path_default)
);
var LinePath_default = ECLinePath;

// node_modules/echarts/lib/chart/helper/Line.js
var SYMBOL_CATEGORIES = ["fromSymbol", "toSymbol"];
function makeSymbolTypeKey(symbolCategory) {
  return "_" + symbolCategory + "Type";
}
function createSymbol2(name, lineData, idx) {
  var symbolType = lineData.getItemVisual(idx, name);
  if (!symbolType || symbolType === "none") {
    return;
  }
  var symbolSize = lineData.getItemVisual(idx, name + "Size");
  var symbolRotate = lineData.getItemVisual(idx, name + "Rotate");
  var symbolOffset = lineData.getItemVisual(idx, name + "Offset");
  var symbolKeepAspect = lineData.getItemVisual(idx, name + "KeepAspect");
  var symbolSizeArr = normalizeSymbolSize(symbolSize);
  var symbolOffsetArr = normalizeSymbolOffset(symbolOffset || 0, symbolSizeArr);
  var symbolPath = createSymbol(symbolType, -symbolSizeArr[0] / 2 + symbolOffsetArr[0], -symbolSizeArr[1] / 2 + symbolOffsetArr[1], symbolSizeArr[0], symbolSizeArr[1], null, symbolKeepAspect);
  symbolPath.__specifiedRotation = symbolRotate == null || isNaN(symbolRotate) ? void 0 : +symbolRotate * Math.PI / 180 || 0;
  symbolPath.name = name;
  return symbolPath;
}
function createLine(points4) {
  var line = new LinePath_default({
    name: "line",
    subPixelOptimize: true
  });
  setLinePoints(line.shape, points4);
  return line;
}
function setLinePoints(targetShape, points4) {
  targetShape.x1 = points4[0][0];
  targetShape.y1 = points4[0][1];
  targetShape.x2 = points4[1][0];
  targetShape.y2 = points4[1][1];
  targetShape.percent = 1;
  var cp1 = points4[2];
  if (cp1) {
    targetShape.cpx1 = cp1[0];
    targetShape.cpy1 = cp1[1];
  } else {
    targetShape.cpx1 = NaN;
    targetShape.cpy1 = NaN;
  }
}
var Line2 = (
  /** @class */
  function(_super) {
    __extends(Line3, _super);
    function Line3(lineData, idx, seriesScope) {
      var _this = _super.call(this) || this;
      _this._createLine(lineData, idx, seriesScope);
      return _this;
    }
    Line3.prototype._createLine = function(lineData, idx, seriesScope) {
      var seriesModel = lineData.hostModel;
      var linePoints = lineData.getItemLayout(idx);
      var line = createLine(linePoints);
      line.shape.percent = 0;
      initProps(line, {
        shape: {
          percent: 1
        }
      }, seriesModel, idx);
      this.add(line);
      each(SYMBOL_CATEGORIES, function(symbolCategory) {
        var symbol = createSymbol2(symbolCategory, lineData, idx);
        this.add(symbol);
        this[makeSymbolTypeKey(symbolCategory)] = lineData.getItemVisual(idx, symbolCategory);
      }, this);
      this._updateCommonStl(lineData, idx, seriesScope);
    };
    Line3.prototype.updateData = function(lineData, idx, seriesScope) {
      var seriesModel = lineData.hostModel;
      var line = this.childOfName("line");
      var linePoints = lineData.getItemLayout(idx);
      var target = {
        shape: {}
      };
      setLinePoints(target.shape, linePoints);
      updateProps(line, target, seriesModel, idx);
      each(SYMBOL_CATEGORIES, function(symbolCategory) {
        var symbolType = lineData.getItemVisual(idx, symbolCategory);
        var key = makeSymbolTypeKey(symbolCategory);
        if (this[key] !== symbolType) {
          this.remove(this.childOfName(symbolCategory));
          var symbol = createSymbol2(symbolCategory, lineData, idx);
          this.add(symbol);
        }
        this[key] = symbolType;
      }, this);
      this._updateCommonStl(lineData, idx, seriesScope);
    };
    ;
    Line3.prototype.getLinePath = function() {
      return this.childAt(0);
    };
    Line3.prototype._updateCommonStl = function(lineData, idx, seriesScope) {
      var seriesModel = lineData.hostModel;
      var line = this.childOfName("line");
      var emphasisLineStyle = seriesScope && seriesScope.emphasisLineStyle;
      var blurLineStyle = seriesScope && seriesScope.blurLineStyle;
      var selectLineStyle = seriesScope && seriesScope.selectLineStyle;
      var labelStatesModels = seriesScope && seriesScope.labelStatesModels;
      var emphasisDisabled = seriesScope && seriesScope.emphasisDisabled;
      var focus = seriesScope && seriesScope.focus;
      var blurScope = seriesScope && seriesScope.blurScope;
      if (!seriesScope || lineData.hasItemOption) {
        var itemModel = lineData.getItemModel(idx);
        var emphasisModel = itemModel.getModel("emphasis");
        emphasisLineStyle = emphasisModel.getModel("lineStyle").getLineStyle();
        blurLineStyle = itemModel.getModel(["blur", "lineStyle"]).getLineStyle();
        selectLineStyle = itemModel.getModel(["select", "lineStyle"]).getLineStyle();
        emphasisDisabled = emphasisModel.get("disabled");
        focus = emphasisModel.get("focus");
        blurScope = emphasisModel.get("blurScope");
        labelStatesModels = getLabelStatesModels(itemModel);
      }
      var lineStyle = lineData.getItemVisual(idx, "style");
      var visualColor = lineStyle.stroke;
      line.useStyle(lineStyle);
      line.style.fill = null;
      line.style.strokeNoScale = true;
      line.ensureState("emphasis").style = emphasisLineStyle;
      line.ensureState("blur").style = blurLineStyle;
      line.ensureState("select").style = selectLineStyle;
      each(SYMBOL_CATEGORIES, function(symbolCategory) {
        var symbol = this.childOfName(symbolCategory);
        if (symbol) {
          symbol.setColor(visualColor);
          symbol.style.opacity = lineStyle.opacity;
          for (var i = 0; i < SPECIAL_STATES.length; i++) {
            var stateName = SPECIAL_STATES[i];
            var lineState = line.getState(stateName);
            if (lineState) {
              var lineStateStyle = lineState.style || {};
              var state = symbol.ensureState(stateName);
              var stateStyle = state.style || (state.style = {});
              if (lineStateStyle.stroke != null) {
                stateStyle[symbol.__isEmptyBrush ? "stroke" : "fill"] = lineStateStyle.stroke;
              }
              if (lineStateStyle.opacity != null) {
                stateStyle.opacity = lineStateStyle.opacity;
              }
            }
          }
          symbol.markRedraw();
        }
      }, this);
      var rawVal = seriesModel.getRawValue(idx);
      setLabelStyle(this, labelStatesModels, {
        labelDataIndex: idx,
        labelFetcher: {
          getFormattedLabel: function(dataIndex, stateName) {
            return seriesModel.getFormattedLabel(dataIndex, stateName, lineData.dataType);
          }
        },
        inheritColor: visualColor || "#000",
        defaultOpacity: lineStyle.opacity,
        defaultText: (rawVal == null ? lineData.getName(idx) : isFinite(rawVal) ? round(rawVal) : rawVal) + ""
      });
      var label = this.getTextContent();
      if (label) {
        var labelNormalModel = labelStatesModels.normal;
        label.__align = label.style.align;
        label.__verticalAlign = label.style.verticalAlign;
        label.__position = labelNormalModel.get("position") || "middle";
        var distance2 = labelNormalModel.get("distance");
        if (!isArray(distance2)) {
          distance2 = [distance2, distance2];
        }
        label.__labelDistance = distance2;
      }
      this.setTextConfig({
        position: null,
        local: true,
        inside: false
        // Can't be inside for stroke element.
      });
      toggleHoverEmphasis(this, focus, blurScope, emphasisDisabled);
    };
    Line3.prototype.highlight = function() {
      enterEmphasis(this);
    };
    Line3.prototype.downplay = function() {
      leaveEmphasis(this);
    };
    Line3.prototype.updateLayout = function(lineData, idx) {
      this.setLinePoints(lineData.getItemLayout(idx));
    };
    Line3.prototype.setLinePoints = function(points4) {
      var linePath = this.childOfName("line");
      setLinePoints(linePath.shape, points4);
      linePath.dirty();
    };
    Line3.prototype.beforeUpdate = function() {
      var lineGroup = this;
      var symbolFrom = lineGroup.childOfName("fromSymbol");
      var symbolTo = lineGroup.childOfName("toSymbol");
      var label = lineGroup.getTextContent();
      if (!symbolFrom && !symbolTo && (!label || label.ignore)) {
        return;
      }
      var invScale = 1;
      var parentNode = this.parent;
      while (parentNode) {
        if (parentNode.scaleX) {
          invScale /= parentNode.scaleX;
        }
        parentNode = parentNode.parent;
      }
      var line = lineGroup.childOfName("line");
      if (!this.__dirty && !line.__dirty) {
        return;
      }
      var percent = line.shape.percent;
      var fromPos = line.pointAt(0);
      var toPos = line.pointAt(percent);
      var d = sub([], toPos, fromPos);
      normalize(d, d);
      function setSymbolRotation(symbol, percent2) {
        var specifiedRotation = symbol.__specifiedRotation;
        if (specifiedRotation == null) {
          var tangent2 = line.tangentAt(percent2);
          symbol.attr("rotation", (percent2 === 1 ? -1 : 1) * Math.PI / 2 - Math.atan2(tangent2[1], tangent2[0]));
        } else {
          symbol.attr("rotation", specifiedRotation);
        }
      }
      if (symbolFrom) {
        symbolFrom.setPosition(fromPos);
        setSymbolRotation(symbolFrom, 0);
        symbolFrom.scaleX = symbolFrom.scaleY = invScale * percent;
        symbolFrom.markRedraw();
      }
      if (symbolTo) {
        symbolTo.setPosition(toPos);
        setSymbolRotation(symbolTo, 1);
        symbolTo.scaleX = symbolTo.scaleY = invScale * percent;
        symbolTo.markRedraw();
      }
      if (label && !label.ignore) {
        label.x = label.y = 0;
        label.originX = label.originY = 0;
        var textAlign = void 0;
        var textVerticalAlign = void 0;
        var distance2 = label.__labelDistance;
        var distanceX = distance2[0] * invScale;
        var distanceY = distance2[1] * invScale;
        var halfPercent = percent / 2;
        var tangent = line.tangentAt(halfPercent);
        var n = [tangent[1], -tangent[0]];
        var cp = line.pointAt(halfPercent);
        if (n[1] > 0) {
          n[0] = -n[0];
          n[1] = -n[1];
        }
        var dir = tangent[0] < 0 ? -1 : 1;
        if (label.__position !== "start" && label.__position !== "end") {
          var rotation = -Math.atan2(tangent[1], tangent[0]);
          if (toPos[0] < fromPos[0]) {
            rotation = Math.PI + rotation;
          }
          label.rotation = rotation;
        }
        var dy = void 0;
        switch (label.__position) {
          case "insideStartTop":
          case "insideMiddleTop":
          case "insideEndTop":
          case "middle":
            dy = -distanceY;
            textVerticalAlign = "bottom";
            break;
          case "insideStartBottom":
          case "insideMiddleBottom":
          case "insideEndBottom":
            dy = distanceY;
            textVerticalAlign = "top";
            break;
          default:
            dy = 0;
            textVerticalAlign = "middle";
        }
        switch (label.__position) {
          case "end":
            label.x = d[0] * distanceX + toPos[0];
            label.y = d[1] * distanceY + toPos[1];
            textAlign = d[0] > 0.8 ? "left" : d[0] < -0.8 ? "right" : "center";
            textVerticalAlign = d[1] > 0.8 ? "top" : d[1] < -0.8 ? "bottom" : "middle";
            break;
          case "start":
            label.x = -d[0] * distanceX + fromPos[0];
            label.y = -d[1] * distanceY + fromPos[1];
            textAlign = d[0] > 0.8 ? "right" : d[0] < -0.8 ? "left" : "center";
            textVerticalAlign = d[1] > 0.8 ? "bottom" : d[1] < -0.8 ? "top" : "middle";
            break;
          case "insideStartTop":
          case "insideStart":
          case "insideStartBottom":
            label.x = distanceX * dir + fromPos[0];
            label.y = fromPos[1] + dy;
            textAlign = tangent[0] < 0 ? "right" : "left";
            label.originX = -distanceX * dir;
            label.originY = -dy;
            break;
          case "insideMiddleTop":
          case "insideMiddle":
          case "insideMiddleBottom":
          case "middle":
            label.x = cp[0];
            label.y = cp[1] + dy;
            textAlign = "center";
            label.originY = -dy;
            break;
          case "insideEndTop":
          case "insideEnd":
          case "insideEndBottom":
            label.x = -distanceX * dir + toPos[0];
            label.y = toPos[1] + dy;
            textAlign = tangent[0] >= 0 ? "right" : "left";
            label.originX = distanceX * dir;
            label.originY = -dy;
            break;
        }
        label.scaleX = label.scaleY = invScale;
        label.setStyle({
          // Use the user specified text align and baseline first
          verticalAlign: label.__verticalAlign || textVerticalAlign,
          align: label.__align || textAlign
        });
      }
    };
    return Line3;
  }(Group_default)
);
var Line_default2 = Line2;

// node_modules/echarts/lib/chart/helper/LineDraw.js
var LineDraw = (
  /** @class */
  function() {
    function LineDraw2(LineCtor) {
      this.group = new Group_default();
      this._LineCtor = LineCtor || Line_default2;
    }
    LineDraw2.prototype.updateData = function(lineData) {
      var _this = this;
      this._progressiveEls = null;
      var lineDraw = this;
      var group = lineDraw.group;
      var oldLineData = lineDraw._lineData;
      lineDraw._lineData = lineData;
      if (!oldLineData) {
        group.removeAll();
      }
      var seriesScope = makeSeriesScope2(lineData);
      lineData.diff(oldLineData).add(function(idx) {
        _this._doAdd(lineData, idx, seriesScope);
      }).update(function(newIdx, oldIdx) {
        _this._doUpdate(oldLineData, lineData, oldIdx, newIdx, seriesScope);
      }).remove(function(idx) {
        group.remove(oldLineData.getItemGraphicEl(idx));
      }).execute();
    };
    ;
    LineDraw2.prototype.updateLayout = function() {
      var lineData = this._lineData;
      if (!lineData) {
        return;
      }
      lineData.eachItemGraphicEl(function(el, idx) {
        el.updateLayout(lineData, idx);
      }, this);
    };
    ;
    LineDraw2.prototype.incrementalPrepareUpdate = function(lineData) {
      this._seriesScope = makeSeriesScope2(lineData);
      this._lineData = null;
      this.group.removeAll();
    };
    ;
    LineDraw2.prototype.incrementalUpdate = function(taskParams, lineData) {
      this._progressiveEls = [];
      function updateIncrementalAndHover(el2) {
        if (!el2.isGroup && !isEffectObject(el2)) {
          el2.incremental = true;
          el2.ensureState("emphasis").hoverLayer = true;
        }
      }
      for (var idx = taskParams.start; idx < taskParams.end; idx++) {
        var itemLayout = lineData.getItemLayout(idx);
        if (lineNeedsDraw(itemLayout)) {
          var el = new this._LineCtor(lineData, idx, this._seriesScope);
          el.traverse(updateIncrementalAndHover);
          this.group.add(el);
          lineData.setItemGraphicEl(idx, el);
          this._progressiveEls.push(el);
        }
      }
    };
    ;
    LineDraw2.prototype.remove = function() {
      this.group.removeAll();
    };
    ;
    LineDraw2.prototype.eachRendered = function(cb) {
      traverseElements(this._progressiveEls || this.group, cb);
    };
    LineDraw2.prototype._doAdd = function(lineData, idx, seriesScope) {
      var itemLayout = lineData.getItemLayout(idx);
      if (!lineNeedsDraw(itemLayout)) {
        return;
      }
      var el = new this._LineCtor(lineData, idx, seriesScope);
      lineData.setItemGraphicEl(idx, el);
      this.group.add(el);
    };
    LineDraw2.prototype._doUpdate = function(oldLineData, newLineData, oldIdx, newIdx, seriesScope) {
      var itemEl = oldLineData.getItemGraphicEl(oldIdx);
      if (!lineNeedsDraw(newLineData.getItemLayout(newIdx))) {
        this.group.remove(itemEl);
        return;
      }
      if (!itemEl) {
        itemEl = new this._LineCtor(newLineData, newIdx, seriesScope);
      } else {
        itemEl.updateData(newLineData, newIdx, seriesScope);
      }
      newLineData.setItemGraphicEl(newIdx, itemEl);
      this.group.add(itemEl);
    };
    return LineDraw2;
  }()
);
function isEffectObject(el) {
  return el.animators && el.animators.length > 0;
}
function makeSeriesScope2(lineData) {
  var hostModel = lineData.hostModel;
  var emphasisModel = hostModel.getModel("emphasis");
  return {
    lineStyle: hostModel.getModel("lineStyle").getLineStyle(),
    emphasisLineStyle: emphasisModel.getModel(["lineStyle"]).getLineStyle(),
    blurLineStyle: hostModel.getModel(["blur", "lineStyle"]).getLineStyle(),
    selectLineStyle: hostModel.getModel(["select", "lineStyle"]).getLineStyle(),
    emphasisDisabled: emphasisModel.get("disabled"),
    blurScope: emphasisModel.get("blurScope"),
    focus: emphasisModel.get("focus"),
    labelStatesModels: getLabelStatesModels(hostModel)
  };
}
function isPointNaN(pt) {
  return isNaN(pt[0]) || isNaN(pt[1]);
}
function lineNeedsDraw(pts) {
  return pts && !isPointNaN(pts[0]) && !isPointNaN(pts[1]);
}
var LineDraw_default = LineDraw;

// node_modules/echarts/lib/util/styleCompat.js
var deprecatedLogs = {};
function isEC4CompatibleStyle(style, elType, hasOwnTextContentOption, hasOwnTextConfig) {
  return style && (style.legacy || style.legacy !== false && !hasOwnTextContentOption && !hasOwnTextConfig && elType !== "tspan" && (elType === "text" || hasOwn(style, "text")));
}
function convertFromEC4CompatibleStyle(hostStyle, elType, isNormal) {
  var srcStyle = hostStyle;
  var textConfig;
  var textContent;
  var textContentStyle;
  if (elType === "text") {
    textContentStyle = srcStyle;
  } else {
    textContentStyle = {};
    hasOwn(srcStyle, "text") && (textContentStyle.text = srcStyle.text);
    hasOwn(srcStyle, "rich") && (textContentStyle.rich = srcStyle.rich);
    hasOwn(srcStyle, "textFill") && (textContentStyle.fill = srcStyle.textFill);
    hasOwn(srcStyle, "textStroke") && (textContentStyle.stroke = srcStyle.textStroke);
    hasOwn(srcStyle, "fontFamily") && (textContentStyle.fontFamily = srcStyle.fontFamily);
    hasOwn(srcStyle, "fontSize") && (textContentStyle.fontSize = srcStyle.fontSize);
    hasOwn(srcStyle, "fontStyle") && (textContentStyle.fontStyle = srcStyle.fontStyle);
    hasOwn(srcStyle, "fontWeight") && (textContentStyle.fontWeight = srcStyle.fontWeight);
    textContent = {
      type: "text",
      style: textContentStyle,
      // ec4 does not support rectText trigger.
      // And when text position is different in normal and emphasis
      // => hover text trigger emphasis;
      // => text position changed, leave mouse pointer immediately;
      // That might cause incorrect state.
      silent: true
    };
    textConfig = {};
    var hasOwnPos = hasOwn(srcStyle, "textPosition");
    if (isNormal) {
      textConfig.position = hasOwnPos ? srcStyle.textPosition : "inside";
    } else {
      hasOwnPos && (textConfig.position = srcStyle.textPosition);
    }
    hasOwn(srcStyle, "textPosition") && (textConfig.position = srcStyle.textPosition);
    hasOwn(srcStyle, "textOffset") && (textConfig.offset = srcStyle.textOffset);
    hasOwn(srcStyle, "textRotation") && (textConfig.rotation = srcStyle.textRotation);
    hasOwn(srcStyle, "textDistance") && (textConfig.distance = srcStyle.textDistance);
  }
  convertEC4CompatibleRichItem(textContentStyle, hostStyle);
  each(textContentStyle.rich, function(richItem) {
    convertEC4CompatibleRichItem(richItem, richItem);
  });
  return {
    textConfig,
    textContent
  };
}
function convertEC4CompatibleRichItem(out2, richItem) {
  if (!richItem) {
    return;
  }
  richItem.font = richItem.textFont || richItem.font;
  hasOwn(richItem, "textStrokeWidth") && (out2.lineWidth = richItem.textStrokeWidth);
  hasOwn(richItem, "textAlign") && (out2.align = richItem.textAlign);
  hasOwn(richItem, "textVerticalAlign") && (out2.verticalAlign = richItem.textVerticalAlign);
  hasOwn(richItem, "textLineHeight") && (out2.lineHeight = richItem.textLineHeight);
  hasOwn(richItem, "textWidth") && (out2.width = richItem.textWidth);
  hasOwn(richItem, "textHeight") && (out2.height = richItem.textHeight);
  hasOwn(richItem, "textBackgroundColor") && (out2.backgroundColor = richItem.textBackgroundColor);
  hasOwn(richItem, "textPadding") && (out2.padding = richItem.textPadding);
  hasOwn(richItem, "textBorderColor") && (out2.borderColor = richItem.textBorderColor);
  hasOwn(richItem, "textBorderWidth") && (out2.borderWidth = richItem.textBorderWidth);
  hasOwn(richItem, "textBorderRadius") && (out2.borderRadius = richItem.textBorderRadius);
  hasOwn(richItem, "textBoxShadowColor") && (out2.shadowColor = richItem.textBoxShadowColor);
  hasOwn(richItem, "textBoxShadowBlur") && (out2.shadowBlur = richItem.textBoxShadowBlur);
  hasOwn(richItem, "textBoxShadowOffsetX") && (out2.shadowOffsetX = richItem.textBoxShadowOffsetX);
  hasOwn(richItem, "textBoxShadowOffsetY") && (out2.shadowOffsetY = richItem.textBoxShadowOffsetY);
}
function convertToEC4StyleForCustomSerise(itemStl, txStl, txCfg) {
  var out2 = itemStl;
  out2.textPosition = out2.textPosition || txCfg.position || "inside";
  txCfg.offset != null && (out2.textOffset = txCfg.offset);
  txCfg.rotation != null && (out2.textRotation = txCfg.rotation);
  txCfg.distance != null && (out2.textDistance = txCfg.distance);
  var isInside = out2.textPosition.indexOf("inside") >= 0;
  var hostFill = itemStl.fill || "#000";
  convertToEC4RichItem(out2, txStl);
  var textFillNotSet = out2.textFill == null;
  if (isInside) {
    if (textFillNotSet) {
      out2.textFill = txCfg.insideFill || "#fff";
      !out2.textStroke && txCfg.insideStroke && (out2.textStroke = txCfg.insideStroke);
      !out2.textStroke && (out2.textStroke = hostFill);
      out2.textStrokeWidth == null && (out2.textStrokeWidth = 2);
    }
  } else {
    if (textFillNotSet) {
      out2.textFill = itemStl.fill || txCfg.outsideFill || "#000";
    }
    !out2.textStroke && txCfg.outsideStroke && (out2.textStroke = txCfg.outsideStroke);
  }
  out2.text = txStl.text;
  out2.rich = txStl.rich;
  each(txStl.rich, function(richItem) {
    convertToEC4RichItem(richItem, richItem);
  });
  return out2;
}
function convertToEC4RichItem(out2, richItem) {
  if (!richItem) {
    return;
  }
  hasOwn(richItem, "fill") && (out2.textFill = richItem.fill);
  hasOwn(richItem, "stroke") && (out2.textStroke = richItem.fill);
  hasOwn(richItem, "lineWidth") && (out2.textStrokeWidth = richItem.lineWidth);
  hasOwn(richItem, "font") && (out2.font = richItem.font);
  hasOwn(richItem, "fontStyle") && (out2.fontStyle = richItem.fontStyle);
  hasOwn(richItem, "fontWeight") && (out2.fontWeight = richItem.fontWeight);
  hasOwn(richItem, "fontSize") && (out2.fontSize = richItem.fontSize);
  hasOwn(richItem, "fontFamily") && (out2.fontFamily = richItem.fontFamily);
  hasOwn(richItem, "align") && (out2.textAlign = richItem.align);
  hasOwn(richItem, "verticalAlign") && (out2.textVerticalAlign = richItem.verticalAlign);
  hasOwn(richItem, "lineHeight") && (out2.textLineHeight = richItem.lineHeight);
  hasOwn(richItem, "width") && (out2.textWidth = richItem.width);
  hasOwn(richItem, "height") && (out2.textHeight = richItem.height);
  hasOwn(richItem, "backgroundColor") && (out2.textBackgroundColor = richItem.backgroundColor);
  hasOwn(richItem, "padding") && (out2.textPadding = richItem.padding);
  hasOwn(richItem, "borderColor") && (out2.textBorderColor = richItem.borderColor);
  hasOwn(richItem, "borderWidth") && (out2.textBorderWidth = richItem.borderWidth);
  hasOwn(richItem, "borderRadius") && (out2.textBorderRadius = richItem.borderRadius);
  hasOwn(richItem, "shadowColor") && (out2.textBoxShadowColor = richItem.shadowColor);
  hasOwn(richItem, "shadowBlur") && (out2.textBoxShadowBlur = richItem.shadowBlur);
  hasOwn(richItem, "shadowOffsetX") && (out2.textBoxShadowOffsetX = richItem.shadowOffsetX);
  hasOwn(richItem, "shadowOffsetY") && (out2.textBoxShadowOffsetY = richItem.shadowOffsetY);
  hasOwn(richItem, "textShadowColor") && (out2.textShadowColor = richItem.textShadowColor);
  hasOwn(richItem, "textShadowBlur") && (out2.textShadowBlur = richItem.textShadowBlur);
  hasOwn(richItem, "textShadowOffsetX") && (out2.textShadowOffsetX = richItem.textShadowOffsetX);
  hasOwn(richItem, "textShadowOffsetY") && (out2.textShadowOffsetY = richItem.textShadowOffsetY);
}
function warnDeprecated(deprecated, insteadApproach) {
  if (true) {
    var key = deprecated + "^_^" + insteadApproach;
    if (!deprecatedLogs[key]) {
      console.warn('[ECharts] DEPRECATED: "' + deprecated + '" has been deprecated. ' + insteadApproach);
      deprecatedLogs[key] = true;
    }
  }
}

// node_modules/echarts/lib/animation/customGraphicTransition.js
var LEGACY_TRANSFORM_PROPS_MAP = {
  position: ["x", "y"],
  scale: ["scaleX", "scaleY"],
  origin: ["originX", "originY"]
};
var LEGACY_TRANSFORM_PROPS = keys(LEGACY_TRANSFORM_PROPS_MAP);
var TRANSFORM_PROPS_MAP = reduce(TRANSFORMABLE_PROPS, function(obj, key) {
  obj[key] = 1;
  return obj;
}, {});
var transformPropNamesStr = TRANSFORMABLE_PROPS.join(", ");
var ELEMENT_ANIMATABLE_PROPS = ["", "style", "shape", "extra"];
var transitionInnerStore = makeInner();
function getElementAnimationConfig(animationType, el, elOption, parentModel, dataIndex) {
  var animationProp = animationType + "Animation";
  var config = getAnimationConfig(animationType, parentModel, dataIndex) || {};
  var userDuring = transitionInnerStore(el).userDuring;
  if (config.duration > 0) {
    config.during = userDuring ? bind(duringCall, {
      el,
      userDuring
    }) : null;
    config.setToFinal = true;
    config.scope = animationType;
  }
  extend(config, elOption[animationProp]);
  return config;
}
function applyUpdateTransition(el, elOption, animatableModel, opts) {
  opts = opts || {};
  var dataIndex = opts.dataIndex, isInit = opts.isInit, clearStyle = opts.clearStyle;
  var hasAnimation = animatableModel.isAnimationEnabled();
  var store = transitionInnerStore(el);
  var styleOpt = elOption.style;
  store.userDuring = elOption.during;
  var transFromProps = {};
  var propsToSet = {};
  prepareTransformAllPropsFinal(el, elOption, propsToSet);
  prepareShapeOrExtraAllPropsFinal("shape", elOption, propsToSet);
  prepareShapeOrExtraAllPropsFinal("extra", elOption, propsToSet);
  if (!isInit && hasAnimation) {
    prepareTransformTransitionFrom(el, elOption, transFromProps);
    prepareShapeOrExtraTransitionFrom("shape", el, elOption, transFromProps);
    prepareShapeOrExtraTransitionFrom("extra", el, elOption, transFromProps);
    prepareStyleTransitionFrom(el, elOption, styleOpt, transFromProps);
  }
  propsToSet.style = styleOpt;
  applyPropsDirectly(el, propsToSet, clearStyle);
  applyMiscProps(el, elOption);
  if (hasAnimation) {
    if (isInit) {
      var enterFromProps_1 = {};
      each(ELEMENT_ANIMATABLE_PROPS, function(propName) {
        var prop = propName ? elOption[propName] : elOption;
        if (prop && prop.enterFrom) {
          if (propName) {
            enterFromProps_1[propName] = enterFromProps_1[propName] || {};
          }
          extend(propName ? enterFromProps_1[propName] : enterFromProps_1, prop.enterFrom);
        }
      });
      var config = getElementAnimationConfig("enter", el, elOption, animatableModel, dataIndex);
      if (config.duration > 0) {
        el.animateFrom(enterFromProps_1, config);
      }
    } else {
      applyPropsTransition(el, elOption, dataIndex || 0, animatableModel, transFromProps);
    }
  }
  updateLeaveTo(el, elOption);
  styleOpt ? el.dirty() : el.markRedraw();
}
function updateLeaveTo(el, elOption) {
  var leaveToProps = transitionInnerStore(el).leaveToProps;
  for (var i = 0; i < ELEMENT_ANIMATABLE_PROPS.length; i++) {
    var propName = ELEMENT_ANIMATABLE_PROPS[i];
    var prop = propName ? elOption[propName] : elOption;
    if (prop && prop.leaveTo) {
      if (!leaveToProps) {
        leaveToProps = transitionInnerStore(el).leaveToProps = {};
      }
      if (propName) {
        leaveToProps[propName] = leaveToProps[propName] || {};
      }
      extend(propName ? leaveToProps[propName] : leaveToProps, prop.leaveTo);
    }
  }
}
function applyLeaveTransition(el, elOption, animatableModel, onRemove) {
  if (el) {
    var parent_1 = el.parent;
    var leaveToProps = transitionInnerStore(el).leaveToProps;
    if (leaveToProps) {
      var config = getElementAnimationConfig("update", el, elOption, animatableModel, 0);
      config.done = function() {
        parent_1.remove(el);
        onRemove && onRemove();
      };
      el.animateTo(leaveToProps, config);
    } else {
      parent_1.remove(el);
      onRemove && onRemove();
    }
  }
}
function isTransitionAll(transition) {
  return transition === "all";
}
function applyPropsDirectly(el, allPropsFinal, clearStyle) {
  var styleOpt = allPropsFinal.style;
  if (!el.isGroup && styleOpt) {
    if (clearStyle) {
      el.useStyle({});
      var animators = el.animators;
      for (var i = 0; i < animators.length; i++) {
        var animator = animators[i];
        if (animator.targetName === "style") {
          animator.changeTarget(el.style);
        }
      }
    }
    el.setStyle(styleOpt);
  }
  if (allPropsFinal) {
    allPropsFinal.style = null;
    allPropsFinal && el.attr(allPropsFinal);
    allPropsFinal.style = styleOpt;
  }
}
function applyPropsTransition(el, elOption, dataIndex, model, transFromProps) {
  if (transFromProps) {
    var config = getElementAnimationConfig("update", el, elOption, model, dataIndex);
    if (config.duration > 0) {
      el.animateFrom(transFromProps, config);
    }
  }
}
function applyMiscProps(el, elOption) {
  hasOwn(elOption, "silent") && (el.silent = elOption.silent);
  hasOwn(elOption, "ignore") && (el.ignore = elOption.ignore);
  if (el instanceof Displayable_default) {
    hasOwn(elOption, "invisible") && (el.invisible = elOption.invisible);
  }
  if (el instanceof Path_default) {
    hasOwn(elOption, "autoBatch") && (el.autoBatch = elOption.autoBatch);
  }
}
var tmpDuringScope = {};
var transitionDuringAPI = {
  // Usually other props do not need to be changed in animation during.
  setTransform: function(key, val) {
    if (true) {
      assert(hasOwn(TRANSFORM_PROPS_MAP, key), "Only " + transformPropNamesStr + " available in `setTransform`.");
    }
    tmpDuringScope.el[key] = val;
    return this;
  },
  getTransform: function(key) {
    if (true) {
      assert(hasOwn(TRANSFORM_PROPS_MAP, key), "Only " + transformPropNamesStr + " available in `getTransform`.");
    }
    return tmpDuringScope.el[key];
  },
  setShape: function(key, val) {
    if (true) {
      assertNotReserved(key);
    }
    var el = tmpDuringScope.el;
    var shape = el.shape || (el.shape = {});
    shape[key] = val;
    el.dirtyShape && el.dirtyShape();
    return this;
  },
  getShape: function(key) {
    if (true) {
      assertNotReserved(key);
    }
    var shape = tmpDuringScope.el.shape;
    if (shape) {
      return shape[key];
    }
  },
  setStyle: function(key, val) {
    if (true) {
      assertNotReserved(key);
    }
    var el = tmpDuringScope.el;
    var style = el.style;
    if (style) {
      if (true) {
        if (eqNaN(val)) {
          warn("style." + key + " must not be assigned with NaN.");
        }
      }
      style[key] = val;
      el.dirtyStyle && el.dirtyStyle();
    }
    return this;
  },
  getStyle: function(key) {
    if (true) {
      assertNotReserved(key);
    }
    var style = tmpDuringScope.el.style;
    if (style) {
      return style[key];
    }
  },
  setExtra: function(key, val) {
    if (true) {
      assertNotReserved(key);
    }
    var extra = tmpDuringScope.el.extra || (tmpDuringScope.el.extra = {});
    extra[key] = val;
    return this;
  },
  getExtra: function(key) {
    if (true) {
      assertNotReserved(key);
    }
    var extra = tmpDuringScope.el.extra;
    if (extra) {
      return extra[key];
    }
  }
};
function assertNotReserved(key) {
  if (true) {
    if (key === "transition" || key === "enterFrom" || key === "leaveTo") {
      throw new Error('key must not be "' + key + '"');
    }
  }
}
function duringCall() {
  var scope = this;
  var el = scope.el;
  if (!el) {
    return;
  }
  var latestUserDuring = transitionInnerStore(el).userDuring;
  var scopeUserDuring = scope.userDuring;
  if (latestUserDuring !== scopeUserDuring) {
    scope.el = scope.userDuring = null;
    return;
  }
  tmpDuringScope.el = el;
  scopeUserDuring(transitionDuringAPI);
}
function prepareShapeOrExtraTransitionFrom(mainAttr, fromEl, elOption, transFromProps) {
  var attrOpt = elOption[mainAttr];
  if (!attrOpt) {
    return;
  }
  var elPropsInAttr = fromEl[mainAttr];
  var transFromPropsInAttr;
  if (elPropsInAttr) {
    var transition = elOption.transition;
    var attrTransition = attrOpt.transition;
    if (attrTransition) {
      !transFromPropsInAttr && (transFromPropsInAttr = transFromProps[mainAttr] = {});
      if (isTransitionAll(attrTransition)) {
        extend(transFromPropsInAttr, elPropsInAttr);
      } else {
        var transitionKeys = normalizeToArray(attrTransition);
        for (var i = 0; i < transitionKeys.length; i++) {
          var key = transitionKeys[i];
          var elVal = elPropsInAttr[key];
          transFromPropsInAttr[key] = elVal;
        }
      }
    } else if (isTransitionAll(transition) || indexOf(transition, mainAttr) >= 0) {
      !transFromPropsInAttr && (transFromPropsInAttr = transFromProps[mainAttr] = {});
      var elPropsInAttrKeys = keys(elPropsInAttr);
      for (var i = 0; i < elPropsInAttrKeys.length; i++) {
        var key = elPropsInAttrKeys[i];
        var elVal = elPropsInAttr[key];
        if (isNonStyleTransitionEnabled(attrOpt[key], elVal)) {
          transFromPropsInAttr[key] = elVal;
        }
      }
    }
  }
}
function prepareShapeOrExtraAllPropsFinal(mainAttr, elOption, allProps) {
  var attrOpt = elOption[mainAttr];
  if (!attrOpt) {
    return;
  }
  var allPropsInAttr = allProps[mainAttr] = {};
  var keysInAttr = keys(attrOpt);
  for (var i = 0; i < keysInAttr.length; i++) {
    var key = keysInAttr[i];
    allPropsInAttr[key] = cloneValue(attrOpt[key]);
  }
}
function prepareTransformTransitionFrom(el, elOption, transFromProps) {
  var transition = elOption.transition;
  var transitionKeys = isTransitionAll(transition) ? TRANSFORMABLE_PROPS : normalizeToArray(transition || []);
  for (var i = 0; i < transitionKeys.length; i++) {
    var key = transitionKeys[i];
    if (key === "style" || key === "shape" || key === "extra") {
      continue;
    }
    var elVal = el[key];
    if (true) {
      checkTransformPropRefer(key, "el.transition");
    }
    transFromProps[key] = elVal;
  }
}
function prepareTransformAllPropsFinal(el, elOption, allProps) {
  for (var i = 0; i < LEGACY_TRANSFORM_PROPS.length; i++) {
    var legacyName = LEGACY_TRANSFORM_PROPS[i];
    var xyName = LEGACY_TRANSFORM_PROPS_MAP[legacyName];
    var legacyArr = elOption[legacyName];
    if (legacyArr) {
      allProps[xyName[0]] = legacyArr[0];
      allProps[xyName[1]] = legacyArr[1];
    }
  }
  for (var i = 0; i < TRANSFORMABLE_PROPS.length; i++) {
    var key = TRANSFORMABLE_PROPS[i];
    if (elOption[key] != null) {
      allProps[key] = elOption[key];
    }
  }
}
function prepareStyleTransitionFrom(fromEl, elOption, styleOpt, transFromProps) {
  if (!styleOpt) {
    return;
  }
  var fromElStyle = fromEl.style;
  var transFromStyleProps;
  if (fromElStyle) {
    var styleTransition = styleOpt.transition;
    var elTransition = elOption.transition;
    if (styleTransition && !isTransitionAll(styleTransition)) {
      var transitionKeys = normalizeToArray(styleTransition);
      !transFromStyleProps && (transFromStyleProps = transFromProps.style = {});
      for (var i = 0; i < transitionKeys.length; i++) {
        var key = transitionKeys[i];
        var elVal = fromElStyle[key];
        transFromStyleProps[key] = elVal;
      }
    } else if (fromEl.getAnimationStyleProps && (isTransitionAll(elTransition) || isTransitionAll(styleTransition) || indexOf(elTransition, "style") >= 0)) {
      var animationProps = fromEl.getAnimationStyleProps();
      var animationStyleProps = animationProps ? animationProps.style : null;
      if (animationStyleProps) {
        !transFromStyleProps && (transFromStyleProps = transFromProps.style = {});
        var styleKeys = keys(styleOpt);
        for (var i = 0; i < styleKeys.length; i++) {
          var key = styleKeys[i];
          if (animationStyleProps[key]) {
            var elVal = fromElStyle[key];
            transFromStyleProps[key] = elVal;
          }
        }
      }
    }
  }
}
function isNonStyleTransitionEnabled(optVal, elVal) {
  return !isArrayLike(optVal) ? optVal != null && isFinite(optVal) : optVal !== elVal;
}
var checkTransformPropRefer;
if (true) {
  checkTransformPropRefer = function(key, usedIn) {
    if (!hasOwn(TRANSFORM_PROPS_MAP, key)) {
      warn("Prop `" + key + "` is not a permitted in `" + usedIn + "`. Only `" + keys(TRANSFORM_PROPS_MAP).join("`, `") + "` are permitted.");
    }
  };
}

// node_modules/echarts/lib/animation/customGraphicKeyframeAnimation.js
var getStateToRestore = makeInner();
var KEYFRAME_EXCLUDE_KEYS = ["percent", "easing", "shape", "style", "extra"];
function stopPreviousKeyframeAnimationAndRestore(el) {
  el.stopAnimation("keyframe");
  el.attr(getStateToRestore(el));
}
function applyKeyframeAnimation(el, animationOpts, animatableModel) {
  if (!animatableModel.isAnimationEnabled() || !animationOpts) {
    return;
  }
  if (isArray(animationOpts)) {
    each(animationOpts, function(singleAnimationOpts) {
      applyKeyframeAnimation(el, singleAnimationOpts, animatableModel);
    });
    return;
  }
  var keyframes = animationOpts.keyframes;
  var duration = animationOpts.duration;
  if (animatableModel && duration == null) {
    var config = getAnimationConfig("enter", animatableModel, 0);
    duration = config && config.duration;
  }
  if (!keyframes || !duration) {
    return;
  }
  var stateToRestore = getStateToRestore(el);
  each(ELEMENT_ANIMATABLE_PROPS, function(targetPropName) {
    if (targetPropName && !el[targetPropName]) {
      return;
    }
    var animator;
    var endFrameIsSet = false;
    keyframes.sort(function(a, b) {
      return a.percent - b.percent;
    });
    each(keyframes, function(kf) {
      var animators = el.animators;
      var kfValues = targetPropName ? kf[targetPropName] : kf;
      if (true) {
        if (kf.percent >= 1) {
          endFrameIsSet = true;
        }
      }
      if (!kfValues) {
        return;
      }
      var propKeys = keys(kfValues);
      if (!targetPropName) {
        propKeys = filter(propKeys, function(key) {
          return indexOf(KEYFRAME_EXCLUDE_KEYS, key) < 0;
        });
      }
      if (!propKeys.length) {
        return;
      }
      if (!animator) {
        animator = el.animate(targetPropName, animationOpts.loop, true);
        animator.scope = "keyframe";
      }
      for (var i = 0; i < animators.length; i++) {
        if (animators[i] !== animator && animators[i].targetName === animator.targetName) {
          animators[i].stopTracks(propKeys);
        }
      }
      targetPropName && (stateToRestore[targetPropName] = stateToRestore[targetPropName] || {});
      var savedTarget = targetPropName ? stateToRestore[targetPropName] : stateToRestore;
      each(propKeys, function(key) {
        savedTarget[key] = ((targetPropName ? el[targetPropName] : el) || {})[key];
      });
      animator.whenWithKeys(duration * kf.percent, kfValues, propKeys, kf.easing);
    });
    if (!animator) {
      return;
    }
    if (true) {
      if (!endFrameIsSet) {
        warn("End frame with percent: 1 is missing in the keyframeAnimation.", true);
      }
    }
    animator.delay(animationOpts.delay || 0).duration(duration).start(animationOpts.easing);
  });
}

export {
  normalizeEvent,
  addEventListener,
  stop,
  Group_default,
  zrender_exports,
  linearMap,
  parsePercent2 as parsePercent,
  round,
  asc,
  getPrecision,
  getPrecisionSafe,
  getPixelPrecision,
  getPercentWithPrecision,
  getPercentSeats,
  MAX_SAFE_INTEGER,
  remRadian,
  isRadianAroundZero,
  parseDate,
  quantity,
  quantityExponent,
  nice,
  quantile,
  reformIntervals,
  numericToNumber,
  isNumeric,
  warn,
  error,
  deprecateLog,
  deprecateReplaceLog,
  makePrintable,
  throwError,
  normalizeToArray,
  defaultEmphasis,
  getDataItemValue,
  mappingToExists,
  convertOptionIdName,
  isNameSpecified,
  makeInternalComponentId,
  compressBatches,
  queryDataIndex,
  makeInner,
  parseFinder,
  preParseFinder,
  SINGLE_REFERRING,
  MULTIPLE_REFERRING,
  queryReferringComponents,
  getTooltipRenderMode,
  groupData,
  interpolateRawValues,
  makeStyleMapper,
  getECData,
  setCommonECData,
  HOVER_STATE_BLUR,
  SPECIAL_STATES,
  DISPLAY_STATES,
  Z2_EMPHASIS_LIFT,
  setStatesFlag,
  setDefaultStateProxy,
  enterEmphasis,
  leaveEmphasis,
  enterBlur,
  leaveBlur,
  enableHoverEmphasis,
  toggleHoverEmphasis,
  enableHoverFocus,
  setStatesStylesFromModel,
  setAsHighDownDispatcher,
  isHighDownDispatcher,
  clonePath,
  Circle_default,
  Ellipse_default,
  Sector_default,
  Ring_default,
  Polygon_default,
  Polyline_default,
  Line_default,
  BezierCurve_default,
  Arc_default,
  LinearGradient_default,
  RadialGradient_default,
  IncrementalDisplayable_default,
  getAnimationConfig,
  updateProps,
  initProps,
  isElementRemoved,
  removeElement,
  removeElementWithFadeOut,
  saveOldStyle,
  getOldStyle,
  extendShape,
  extendPath,
  registerShape,
  getShapeClass,
  makePath,
  makeImage,
  mergePath2 as mergePath,
  resizePath,
  subPixelOptimizeLine2 as subPixelOptimizeLine,
  subPixelOptimize2 as subPixelOptimize,
  getTransform,
  applyTransform2 as applyTransform,
  transformDirection,
  groupTransition,
  clipPointsByRect,
  clipRectByRect,
  createIcon,
  linePolygonIntersect,
  setTooltipConfig,
  traverseElements,
  graphic_exports,
  setLabelStyle,
  getLabelStatesModels,
  createTextStyle,
  createTextConfig,
  getFont,
  labelInner,
  setLabelValueAnimation,
  animateLabelValue,
  Model_default,
  getUID,
  inheritDefaultOption,
  registerLocale,
  getLocaleModel,
  format,
  getTextRect,
  addCommas,
  toCamelCase,
  normalizeCssArray2 as normalizeCssArray,
  formatTpl,
  formatTplSimple,
  getTooltipMarker,
  formatTime,
  capitalFirst,
  convertToColorString,
  windowOpen,
  LOCATION_PARAMS,
  box,
  getAvailableSize,
  getLayoutRect,
  positionElement,
  sizeCalculable,
  mergeLayoutParam,
  getLayoutParams,
  copyLayoutParams,
  Component_default,
  VISUAL_DIMENSIONS,
  SOURCE_FORMAT_ORIGINAL,
  SOURCE_FORMAT_ARRAY_ROWS,
  SOURCE_FORMAT_OBJECT_ROWS,
  SERIES_LAYOUT_BY_COLUMN,
  BE_ORDINAL,
  makeSeriesEncodeForAxisCoordSys,
  makeSeriesEncodeForNameBased,
  guessOrdinal,
  registerInternalOptionCreator,
  getDecalFromPalette,
  CoordinateSystem_default,
  isSourceInstance,
  createSourceFromSeriesDataOption,
  DataFormatMixin,
  normalizeTooltipFormatResult,
  parseDataValue,
  getRawValueParser,
  SortOrderComparator,
  createFilterComparator,
  CtorInt32Array,
  SourceManager,
  disableTransformOptionMerge,
  createTooltipMarkup,
  buildTooltipMarkup,
  retrieveVisualColorForTooltipMarker,
  getPaddingFromTooltipModel,
  TooltipMarkupStyleCreator,
  defaultSeriesFormatTooltip,
  SERIES_UNIVERSAL_TRANSITION_PROP,
  Series_default,
  Component_default2,
  createRenderPlanner,
  Chart_default,
  throttle,
  createOrUpdate,
  clear,
  getItemVisualFromData,
  getVisualFromData,
  setItemVisualFromData,
  createLegacyDataSelectAction,
  findEventDispatcher,
  symbolBuildProxies,
  createSymbol,
  normalizeSymbolSize,
  normalizeSymbolOffset,
  createOrUpdatePatternFromDecal,
  version2 as version,
  dependencies,
  PRIORITY,
  init2 as init,
  connect,
  disConnect,
  disconnect,
  dispose2 as dispose,
  getInstanceByDom,
  getInstanceById,
  registerTheme,
  registerPreprocessor,
  registerProcessor,
  registerPostInit,
  registerPostUpdate,
  registerUpdateLifecycle,
  registerAction,
  registerCoordinateSystem,
  getCoordinateSystemDimensions,
  registerLayout,
  registerVisual,
  registerLoading,
  setCanvasCreator,
  registerMap,
  getMap,
  registerTransform,
  dataTool,
  use,
  DataDiffer_default,
  getDimensionTypeByAxis,
  SeriesDimensionDefine_default,
  SeriesDataSchema,
  createDimNameMap,
  ensureSourceDimNameMap,
  shouldOmitUnusedDimensions,
  SeriesData_default,
  enableDataStack,
  isDimensionStacked,
  getStackedDimension,
  Ordinal_default,
  Interval_default,
  createFloat32Array,
  getLayoutOnAxis,
  layout,
  createProgressiveLayout,
  Time_default,
  ensureScaleRawExtentInfo,
  niceScaleExtent,
  createScaleByModel,
  getAxisRawValue,
  getDataDimensionsOnAxis,
  unionAxisExtentFromData,
  AxisModelCommonMixin,
  contain,
  parseGeoJSON,
  Axis_default,
  prepareLayoutList,
  shiftLayoutOnX,
  shiftLayoutOnY,
  hideOverlap,
  getDefaultLabel,
  getDefaultInterpolatedLabel,
  Symbol_default,
  SymbolDraw_default,
  isCoordinateSystemType,
  axisModelCreator,
  layout2,
  AxisBuilder_default,
  collect,
  getAxisInfo,
  makeKey,
  AxisView_default,
  rectCoordAxisBuildSplitArea,
  rectCoordAxisHandleRemove,
  install,
  install2,
  RoamController_default,
  updateViewOnPan,
  updateViewOnZoom,
  onIrrelevantElement,
  geoSourceManager_default,
  MapDraw_default,
  View_default,
  updateCenterAndZoom,
  install3,
  VisualMapping_default,
  Line_default2,
  LineDraw_default,
  sliderMove,
  BrushController_default,
  makeRectPanelClipPath,
  makeLinearBrushOtherExtent,
  makeRectIsTargetByCursor,
  install4,
  isEC4CompatibleStyle,
  convertFromEC4CompatibleStyle,
  convertToEC4StyleForCustomSerise,
  warnDeprecated,
  applyUpdateTransition,
  updateLeaveTo,
  applyLeaveTransition,
  isTransitionAll,
  stopPreviousKeyframeAnimationAndRestore,
  applyKeyframeAnimation
};
/*! Bundled license information:

zrender/lib/zrender.js:
  (*!
  * ZRender, a high performance 2d drawing library.
  *
  * Copyright (c) 2013, Baidu Inc.
  * All rights reserved.
  *
  * LICENSE
  * https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
  *)
*/
//# sourceMappingURL=chunk-EF2GB5LM.js.map
