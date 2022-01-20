(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  /**
   * Animate
   * ======================================
   * - add class to element in viewport
   * - if you want disable animate delay on mobile use [animate-delay-desktop]
   * - set animation delay via [animate-delay] html attribute
   * - set visible threshold via [animate-threshold] html attribute
   */
  var ISMOBILE = window.matchMedia("only screen and (max-width: 768px)").matches;
  var THRESHOLD = '0.75';
  var LOAD_THRESHOLD = '0.2';
  var ELEMENTS$1 = '.animate';
  var VISIBLE_CLASS = 'animate--visible';

  var Animate = function Animate() {
    var _this = this;

    _classCallCheck(this, Animate);

    _defineProperty(this, "observeCallback", function (entries) {
      entries.map(function (entry) {
        var section = entry.target;

        var delay = _this.getDelay(section);

        var sectionBodyClass = section.getAttribute('animate-body-class');

        if (entry.isIntersecting) {
          if (ISMOBILE && section.getAttribute('animate-delay-desktop')) {
            section.classList.add(VISIBLE_CLASS);

            _this.bodyClass(sectionBodyClass, 'add');
          } else {
            setTimeout(function () {
              section.classList.add(VISIBLE_CLASS);

              _this.bodyClass(sectionBodyClass, 'add');
            }, delay);
          }
        } else {
          _this.bodyClass(sectionBodyClass, 'remove');
        }
      });
    });

    _defineProperty(this, "getDelay", function (section) {
      var delay = section.getAttribute('animate-delay');

      if (!ISMOBILE && section.getAttribute('animate-delay-desktop')) {
        var delay = section.getAttribute('animate-delay-desktop');
      }

      if (delay === null) {
        return 0;
      } else if (delay.includes('.')) {
        return parseInt(delay * 1000);
      } else {
        return parseInt(delay);
      }
    });

    _defineProperty(this, "bodyClass", function (htmlclass, type) {
      if (!htmlclass) {
        return;
      }

      if (type == 'add') {
        document.body.classList.add(htmlclass);
      } else {
        document.body.classList.remove(htmlclass);
      }
    });

    this.sections = document.querySelectorAll(ELEMENTS$1);
    this.THRESHOLD = THRESHOLD;
    this.LOAD_THRESHOLD = LOAD_THRESHOLD;

    if ('IntersectionObserver' in window) {
      this.sections.forEach(function (el) {
        var BoundingClientRect = el.getBoundingClientRect();
        var visibleRatio = BoundingClientRect.height / window.innerHeight;

        if (visibleRatio > 0.95) {
          _this.THRESHOLD = window.innerHeight / BoundingClientRect.height / 100 * 30;
          _this.LOAD_THRESHOLD = window.innerHeight / BoundingClientRect.height / 100 * 20;
        } // observe on page load


        var loadObserver = new IntersectionObserver(_this.observeCallback, {
          threshold: _this.LOAD_THRESHOLD
        });
        loadObserver.observe(el);
        setTimeout(function () {
          loadObserver.disconnect();
        }, 100); // observe

        var observerThreshold = el.getAttribute('animate-threshold') ? el.getAttribute('animate-threshold') : _this.THRESHOLD;
        var observer = new IntersectionObserver(_this.observeCallback, {
          threshold: observerThreshold
        });
        observer.observe(el);
      });
    } else {
      this.sections.forEach(function (el) {
        el.classList.add(VISIBLE_CLASS);
      });
    }
  };

  new Animate();

  /*!
   * Splide.js
   * Version  : 3.2.5
   * License  : MIT
   * Copyright: 2021 Naotoshi Fujita
   */
  const PROJECT_CODE = "splide";
  const DATA_ATTRIBUTE = `data-${PROJECT_CODE}`;

  const CREATED = 1;
  const MOUNTED = 2;
  const IDLE = 3;
  const MOVING = 4;
  const DESTROYED = 5;
  const STATES = {
    CREATED,
    MOUNTED,
    IDLE,
    MOVING,
    DESTROYED
  };

  const DEFAULT_EVENT_PRIORITY = 10;
  const DEFAULT_USER_EVENT_PRIORITY = 20;

  function empty(array) {
    array.length = 0;
  }

  function isObject(subject) {
    return !isNull(subject) && typeof subject === "object";
  }
  function isArray(subject) {
    return Array.isArray(subject);
  }
  function isFunction(subject) {
    return typeof subject === "function";
  }
  function isString(subject) {
    return typeof subject === "string";
  }
  function isUndefined(subject) {
    return typeof subject === "undefined";
  }
  function isNull(subject) {
    return subject === null;
  }
  function isHTMLElement(subject) {
    return subject instanceof HTMLElement;
  }

  function toArray(value) {
    return isArray(value) ? value : [value];
  }

  function forEach(values, iteratee) {
    toArray(values).forEach(iteratee);
  }

  function includes(array, value) {
    return array.indexOf(value) > -1;
  }

  function push(array, items) {
    array.push(...toArray(items));
    return array;
  }

  const arrayProto = Array.prototype;

  function slice(arrayLike, start, end) {
    return arrayProto.slice.call(arrayLike, start, end);
  }

  function find(arrayLike, predicate) {
    return slice(arrayLike).filter(predicate)[0];
  }

  function toggleClass(elm, classes, add) {
    if (elm) {
      forEach(classes, (name) => {
        if (name) {
          elm.classList[add ? "add" : "remove"](name);
        }
      });
    }
  }

  function addClass(elm, classes) {
    toggleClass(elm, isString(classes) ? classes.split(" ") : classes, true);
  }

  function append(parent, children) {
    forEach(children, parent.appendChild.bind(parent));
  }

  function before(nodes, ref) {
    forEach(nodes, (node) => {
      const parent = ref.parentNode;
      if (parent) {
        parent.insertBefore(node, ref);
      }
    });
  }

  function matches(elm, selector) {
    return (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
  }

  function children(parent, selector) {
    return parent ? slice(parent.children).filter((child) => matches(child, selector)) : [];
  }

  function child(parent, selector) {
    return selector ? children(parent, selector)[0] : parent.firstElementChild;
  }

  function forOwn(object, iteratee, right) {
    if (object) {
      let keys = Object.keys(object);
      keys = right ? keys.reverse() : keys;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== "__proto__") {
          if (iteratee(object[key], key) === false) {
            break;
          }
        }
      }
    }
    return object;
  }

  function assign(object) {
    slice(arguments, 1).forEach((source) => {
      forOwn(source, (value, key) => {
        object[key] = source[key];
      });
    });
    return object;
  }

  function merge(object, source) {
    forOwn(source, (value, key) => {
      if (isArray(value)) {
        object[key] = value.slice();
      } else if (isObject(value)) {
        object[key] = merge(isObject(object[key]) ? object[key] : {}, value);
      } else {
        object[key] = value;
      }
    });
    return object;
  }

  function removeAttribute(elm, attrs) {
    if (elm) {
      forEach(attrs, (attr) => {
        elm.removeAttribute(attr);
      });
    }
  }

  function setAttribute(elm, attrs, value) {
    if (isObject(attrs)) {
      forOwn(attrs, (value2, name) => {
        setAttribute(elm, name, value2);
      });
    } else {
      isNull(value) ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
    }
  }

  function create(tag, attrs, parent) {
    const elm = document.createElement(tag);
    if (attrs) {
      isString(attrs) ? addClass(elm, attrs) : setAttribute(elm, attrs);
    }
    parent && append(parent, elm);
    return elm;
  }

  function style(elm, prop, value) {
    if (isUndefined(value)) {
      return getComputedStyle(elm)[prop];
    }
    if (!isNull(value)) {
      const { style: style2 } = elm;
      value = `${value}`;
      if (style2[prop] !== value) {
        style2[prop] = value;
      }
    }
  }

  function display(elm, display2) {
    style(elm, "display", display2);
  }

  function focus(elm) {
    elm["setActive"] && elm["setActive"]() || elm.focus({ preventScroll: true });
  }

  function getAttribute(elm, attr) {
    return elm.getAttribute(attr);
  }

  function hasClass(elm, className) {
    return elm && elm.classList.contains(className);
  }

  function rect(target) {
    return target.getBoundingClientRect();
  }

  function remove(nodes) {
    forEach(nodes, (node) => {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
  }

  function measure(parent, value) {
    if (isString(value)) {
      const div = create("div", { style: `width: ${value}; position: absolute;` }, parent);
      value = rect(div).width;
      remove(div);
    }
    return value;
  }

  function parseHtml(html) {
    return child(new DOMParser().parseFromString(html, "text/html").body);
  }

  function prevent(e, stopPropagation) {
    e.preventDefault();
    if (stopPropagation) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  function query(parent, selector) {
    return parent && parent.querySelector(selector);
  }

  function queryAll(parent, selector) {
    return slice(parent.querySelectorAll(selector));
  }

  function removeClass(elm, classes) {
    toggleClass(elm, classes, false);
  }

  function unit(value) {
    return isString(value) ? value : value ? `${value}px` : "";
  }

  function assert(condition, message = "") {
    if (!condition) {
      throw new Error(`[${PROJECT_CODE}] ${message}`);
    }
  }

  function nextTick(callback) {
    setTimeout(callback);
  }

  const noop = () => {
  };

  function raf(func) {
    return requestAnimationFrame(func);
  }

  const { min, max, floor, ceil, abs } = Math;

  function approximatelyEqual(x, y, epsilon) {
    return abs(x - y) < epsilon;
  }

  function between(number, minOrMax, maxOrMin, exclusive) {
    const minimum = min(minOrMax, maxOrMin);
    const maximum = max(minOrMax, maxOrMin);
    return exclusive ? minimum < number && number < maximum : minimum <= number && number <= maximum;
  }

  function clamp(number, x, y) {
    const minimum = min(x, y);
    const maximum = max(x, y);
    return min(max(minimum, number), maximum);
  }

  function sign(x) {
    return +(x > 0) - +(x < 0);
  }

  function format(string, replacements) {
    forEach(replacements, (replacement) => {
      string = string.replace("%s", `${replacement}`);
    });
    return string;
  }

  function pad(number) {
    return number < 10 ? `0${number}` : `${number}`;
  }

  const ids = {};
  function uniqueId(prefix) {
    return `${prefix}${pad(ids[prefix] = (ids[prefix] || 0) + 1)}`;
  }

  function EventBus() {
    let handlers = {};
    function on(events, callback, key, priority = DEFAULT_EVENT_PRIORITY) {
      forEachEvent(events, (event, namespace) => {
        handlers[event] = handlers[event] || [];
        push(handlers[event], {
          _event: event,
          _callback: callback,
          _namespace: namespace,
          _priority: priority,
          _key: key
        }).sort((handler1, handler2) => handler1._priority - handler2._priority);
      });
    }
    function off(events, key) {
      forEachEvent(events, (event, namespace) => {
        const eventHandlers = handlers[event];
        handlers[event] = eventHandlers && eventHandlers.filter((handler) => {
          return handler._key ? handler._key !== key : key || handler._namespace !== namespace;
        });
      });
    }
    function offBy(key) {
      forOwn(handlers, (eventHandlers, event) => {
        off(event, key);
      });
    }
    function emit(event) {
      (handlers[event] || []).forEach((handler) => {
        handler._callback.apply(handler, slice(arguments, 1));
      });
    }
    function destroy() {
      handlers = {};
    }
    function forEachEvent(events, iteratee) {
      toArray(events).join(" ").split(" ").forEach((eventNS) => {
        const fragments = eventNS.split(".");
        iteratee(fragments[0], fragments[1]);
      });
    }
    return {
      on,
      off,
      offBy,
      emit,
      destroy
    };
  }

  const EVENT_MOUNTED = "mounted";
  const EVENT_READY = "ready";
  const EVENT_MOVE = "move";
  const EVENT_MOVED = "moved";
  const EVENT_CLICK = "click";
  const EVENT_ACTIVE = "active";
  const EVENT_INACTIVE = "inactive";
  const EVENT_VISIBLE = "visible";
  const EVENT_HIDDEN = "hidden";
  const EVENT_SLIDE_KEYDOWN = "slide:keydown";
  const EVENT_REFRESH = "refresh";
  const EVENT_UPDATED = "updated";
  const EVENT_RESIZE = "resize";
  const EVENT_RESIZED = "resized";
  const EVENT_REPOSITIONED = "repositioned";
  const EVENT_DRAG = "drag";
  const EVENT_DRAGGING = "dragging";
  const EVENT_DRAGGED = "dragged";
  const EVENT_SCROLL = "scroll";
  const EVENT_SCROLLED = "scrolled";
  const EVENT_DESTROY = "destroy";
  const EVENT_ARROWS_MOUNTED = "arrows:mounted";
  const EVENT_ARROWS_UPDATED = "arrows:updated";
  const EVENT_PAGINATION_MOUNTED = "pagination:mounted";
  const EVENT_PAGINATION_UPDATED = "pagination:updated";
  const EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
  const EVENT_AUTOPLAY_PLAY = "autoplay:play";
  const EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
  const EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
  const EVENT_LAZYLOAD_LOADED = "lazyload:loaded";

  function EventInterface(Splide2) {
    const { event } = Splide2;
    const key = {};
    let listeners = [];
    function on(events, callback, priority) {
      event.on(events, callback, key, priority);
    }
    function off(events) {
      event.off(events, key);
    }
    function bind(targets, events, callback, options) {
      forEachEvent(targets, events, (target, event2) => {
        listeners.push([target, event2, callback, options]);
        target.addEventListener(event2, callback, options);
      });
    }
    function unbind(targets, events, callback) {
      forEachEvent(targets, events, (target, event2) => {
        listeners = listeners.filter((listener) => {
          if (listener[0] === target && listener[1] === event2 && (!callback || listener[2] === callback)) {
            target.removeEventListener(event2, listener[2], listener[3]);
            return false;
          }
          return true;
        });
      });
    }
    function forEachEvent(targets, events, iteratee) {
      forEach(targets, (target) => {
        if (target) {
          events.split(" ").forEach(iteratee.bind(null, target));
        }
      });
    }
    function destroy() {
      listeners = listeners.filter((data) => unbind(data[0], data[1]));
      event.offBy(key);
    }
    event.on(EVENT_DESTROY, destroy, key);
    return {
      on,
      off,
      emit: event.emit,
      bind,
      unbind,
      destroy
    };
  }

  function RequestInterval(interval, onInterval, onUpdate, limit) {
    const { now } = Date;
    let startTime;
    let rate = 0;
    let id;
    let paused = true;
    let count = 0;
    function update() {
      if (!paused) {
        const elapsed = now() - startTime;
        if (elapsed >= interval) {
          rate = 1;
          startTime = now();
        } else {
          rate = elapsed / interval;
        }
        if (onUpdate) {
          onUpdate(rate);
        }
        if (rate === 1) {
          onInterval();
          if (limit && ++count >= limit) {
            return pause();
          }
        }
        raf(update);
      }
    }
    function start(resume) {
      !resume && cancel();
      startTime = now() - (resume ? rate * interval : 0);
      paused = false;
      raf(update);
    }
    function pause() {
      paused = true;
    }
    function rewind() {
      startTime = now();
      rate = 0;
      if (onUpdate) {
        onUpdate(rate);
      }
    }
    function cancel() {
      cancelAnimationFrame(id);
      rate = 0;
      id = 0;
      paused = true;
    }
    function isPaused() {
      return paused;
    }
    return {
      start,
      rewind,
      pause,
      cancel,
      isPaused
    };
  }

  function State(initialState) {
    let state = initialState;
    function set(value) {
      state = value;
    }
    function is(states) {
      return includes(toArray(states), state);
    }
    return { set, is };
  }

  function Throttle(func, duration) {
    let interval;
    function throttled() {
      if (!interval) {
        interval = RequestInterval(duration || 0, () => {
          func.apply(this, arguments);
          interval = null;
        }, null, 1);
        interval.start();
      }
    }
    return throttled;
  }

  function Options(Splide2, Components2, options) {
    const throttledObserve = Throttle(observe);
    let initialOptions;
    let points;
    let currPoint;
    function setup() {
      try {
        merge(options, JSON.parse(getAttribute(Splide2.root, DATA_ATTRIBUTE)));
      } catch (e) {
        assert(false, e.message);
      }
      initialOptions = merge({}, options);
      const { breakpoints } = options;
      if (breakpoints) {
        const isMin = options.mediaQuery === "min";
        points = Object.keys(breakpoints).sort((n, m) => isMin ? +m - +n : +n - +m).map((point) => [
          point,
          matchMedia(`(${isMin ? "min" : "max"}-width:${point}px)`)
        ]);
        observe();
      }
    }
    function mount() {
      if (points) {
        addEventListener("resize", throttledObserve);
      }
    }
    function destroy(completely) {
      if (completely) {
        removeEventListener("resize", throttledObserve);
      }
    }
    function observe() {
      const item = find(points, (item2) => item2[1].matches) || [];
      if (item[0] !== currPoint) {
        onMatch(currPoint = item[0]);
      }
    }
    function onMatch(point) {
      const newOptions = options.breakpoints[point] || initialOptions;
      if (newOptions.destroy) {
        Splide2.options = initialOptions;
        Splide2.destroy(newOptions.destroy === "completely");
      } else {
        if (Splide2.state.is(DESTROYED)) {
          destroy(true);
          Splide2.mount();
        }
        Splide2.options = newOptions;
      }
    }
    return {
      setup,
      mount,
      destroy
    };
  }

  const RTL = "rtl";
  const TTB = "ttb";

  const ORIENTATION_MAP = {
    marginRight: ["marginBottom", "marginLeft"],
    autoWidth: ["autoHeight"],
    fixedWidth: ["fixedHeight"],
    paddingLeft: ["paddingTop", "paddingRight"],
    paddingRight: ["paddingBottom", "paddingLeft"],
    width: ["height"],
    left: ["top", "right"],
    right: ["bottom", "left"],
    x: ["y"],
    X: ["Y"],
    Y: ["X"],
    ArrowLeft: ["ArrowUp", "ArrowRight"],
    ArrowRight: ["ArrowDown", "ArrowLeft"]
  };
  function Direction(Splide2, Components2, options) {
    function resolve(prop, axisOnly) {
      const { direction } = options;
      const index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
      return ORIENTATION_MAP[prop][index] || prop;
    }
    function orient(value) {
      return value * (options.direction === RTL ? 1 : -1);
    }
    return {
      resolve,
      orient
    };
  }

  const CLASS_ROOT = PROJECT_CODE;
  const CLASS_SLIDER = `${PROJECT_CODE}__slider`;
  const CLASS_TRACK = `${PROJECT_CODE}__track`;
  const CLASS_LIST = `${PROJECT_CODE}__list`;
  const CLASS_SLIDE = `${PROJECT_CODE}__slide`;
  const CLASS_CLONE = `${CLASS_SLIDE}--clone`;
  const CLASS_CONTAINER = `${CLASS_SLIDE}__container`;
  const CLASS_ARROWS = `${PROJECT_CODE}__arrows`;
  const CLASS_ARROW = `${PROJECT_CODE}__arrow`;
  const CLASS_ARROW_PREV = `${CLASS_ARROW}--prev`;
  const CLASS_ARROW_NEXT = `${CLASS_ARROW}--next`;
  const CLASS_PAGINATION = `${PROJECT_CODE}__pagination`;
  const CLASS_PAGINATION_PAGE = `${CLASS_PAGINATION}__page`;
  const CLASS_PROGRESS = `${PROJECT_CODE}__progress`;
  const CLASS_PROGRESS_BAR = `${CLASS_PROGRESS}__bar`;
  const CLASS_AUTOPLAY = `${PROJECT_CODE}__autoplay`;
  const CLASS_PLAY = `${PROJECT_CODE}__play`;
  const CLASS_PAUSE = `${PROJECT_CODE}__pause`;
  const CLASS_SPINNER = `${PROJECT_CODE}__spinner`;
  const CLASS_INITIALIZED = "is-initialized";
  const CLASS_ACTIVE = "is-active";
  const CLASS_PREV = "is-prev";
  const CLASS_NEXT = "is-next";
  const CLASS_VISIBLE = "is-visible";
  const CLASS_LOADING = "is-loading";
  const STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING];
  const CLASSES = {
    slide: CLASS_SLIDE,
    clone: CLASS_CLONE,
    arrows: CLASS_ARROWS,
    arrow: CLASS_ARROW,
    prev: CLASS_ARROW_PREV,
    next: CLASS_ARROW_NEXT,
    pagination: CLASS_PAGINATION,
    page: CLASS_PAGINATION_PAGE,
    spinner: CLASS_SPINNER
  };

  function Elements(Splide2, Components2, options) {
    const { on } = EventInterface(Splide2);
    const { root } = Splide2;
    const elements = {};
    const slides = [];
    let classes;
    let slider;
    let track;
    let list;
    function setup() {
      collect();
      identify();
      addClass(root, classes = getClasses());
    }
    function mount() {
      on(EVENT_REFRESH, refresh, DEFAULT_EVENT_PRIORITY - 2);
      on(EVENT_UPDATED, update);
    }
    function destroy() {
      [root, track, list].forEach((elm) => {
        removeAttribute(elm, "style");
      });
      empty(slides);
      removeClass(root, classes);
    }
    function refresh() {
      destroy();
      setup();
    }
    function update() {
      removeClass(root, classes);
      addClass(root, classes = getClasses());
    }
    function collect() {
      slider = child(root, `.${CLASS_SLIDER}`);
      track = query(root, `.${CLASS_TRACK}`);
      list = child(track, `.${CLASS_LIST}`);
      assert(track && list, "A track/list element is missing.");
      push(slides, children(list, `.${CLASS_SLIDE}:not(.${CLASS_CLONE})`));
      const autoplay = find(`.${CLASS_AUTOPLAY}`);
      const arrows = find(`.${CLASS_ARROWS}`);
      assign(elements, {
        root,
        slider,
        track,
        list,
        slides,
        arrows,
        autoplay,
        prev: query(arrows, `.${CLASS_ARROW_PREV}`),
        next: query(arrows, `.${CLASS_ARROW_NEXT}`),
        bar: query(find(`.${CLASS_PROGRESS}`), `.${CLASS_PROGRESS_BAR}`),
        play: query(autoplay, `.${CLASS_PLAY}`),
        pause: query(autoplay, `.${CLASS_PAUSE}`)
      });
    }
    function identify() {
      const id = root.id || uniqueId(PROJECT_CODE);
      root.id = id;
      track.id = track.id || `${id}-track`;
      list.id = list.id || `${id}-list`;
    }
    function find(selector) {
      return child(root, selector) || child(slider, selector);
    }
    function getClasses() {
      return [
        `${CLASS_ROOT}--${options.type}`,
        `${CLASS_ROOT}--${options.direction}`,
        options.drag && `${CLASS_ROOT}--draggable`,
        options.isNavigation && `${CLASS_ROOT}--nav`,
        CLASS_ACTIVE
      ];
    }
    return assign(elements, {
      setup,
      mount,
      destroy
    });
  }

  const ROLE = "role";
  const ARIA_CONTROLS = "aria-controls";
  const ARIA_CURRENT = "aria-current";
  const ARIA_LABEL = "aria-label";
  const ARIA_HIDDEN = "aria-hidden";
  const TAB_INDEX = "tabindex";
  const DISABLED = "disabled";
  const ARIA_ORIENTATION = "aria-orientation";
  const ALL_ATTRIBUTES = [
    ROLE,
    ARIA_CONTROLS,
    ARIA_CURRENT,
    ARIA_LABEL,
    ARIA_HIDDEN,
    ARIA_ORIENTATION,
    TAB_INDEX,
    DISABLED
  ];

  const SLIDE = "slide";
  const LOOP = "loop";
  const FADE = "fade";

  function Slide$1(Splide2, index, slideIndex, slide) {
    const { on, emit, bind, destroy: destroyEvents } = EventInterface(Splide2);
    const { Components, root, options } = Splide2;
    const { isNavigation, updateOnMove } = options;
    const { resolve } = Components.Direction;
    const styles = getAttribute(slide, "style");
    const isClone = slideIndex > -1;
    const container = child(slide, `.${CLASS_CONTAINER}`);
    const focusableNodes = options.focusableNodes && queryAll(slide, options.focusableNodes);
    let destroyed;
    function mount() {
      init();
      bind(slide, "click keydown", (e) => {
        emit(e.type === "click" ? EVENT_CLICK : EVENT_SLIDE_KEYDOWN, this, e);
      });
      on([EVENT_REFRESH, EVENT_REPOSITIONED, EVENT_MOVED, EVENT_SCROLLED], update.bind(this));
      if (updateOnMove) {
        on(EVENT_MOVE, onMove.bind(this));
      }
    }
    function init() {
      if (!isClone) {
        slide.id = `${root.id}-slide${pad(index + 1)}`;
      }
      if (isNavigation) {
        const idx = isClone ? slideIndex : index;
        const label = format(options.i18n.slideX, idx + 1);
        const controls = Splide2.splides.map((splide) => splide.root.id).join(" ");
        setAttribute(slide, ARIA_LABEL, label);
        setAttribute(slide, ARIA_CONTROLS, controls);
        setAttribute(slide, ROLE, "menuitem");
      }
    }
    function destroy() {
      destroyed = true;
      destroyEvents();
      removeClass(slide, STATUS_CLASSES);
      removeAttribute(slide, ALL_ATTRIBUTES);
      setAttribute(slide, "style", styles);
    }
    function onMove(next, prev, dest) {
      if (!destroyed) {
        update.call(this);
        if (dest === index) {
          updateActivity.call(this, true);
        }
      }
    }
    function update() {
      if (!destroyed) {
        const { index: currIndex } = Splide2;
        updateActivity.call(this, isActive());
        updateVisibility.call(this, isVisible());
        toggleClass(slide, CLASS_PREV, index === currIndex - 1);
        toggleClass(slide, CLASS_NEXT, index === currIndex + 1);
      }
    }
    function updateActivity(active) {
      if (active !== hasClass(slide, CLASS_ACTIVE)) {
        toggleClass(slide, CLASS_ACTIVE, active);
        if (isNavigation) {
          setAttribute(slide, ARIA_CURRENT, active || null);
        }
        emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, this);
      }
    }
    function updateVisibility(visible) {
      const ariaHidden = !visible && !isActive();
      setAttribute(slide, ARIA_HIDDEN, ariaHidden || null);
      setAttribute(slide, TAB_INDEX, !ariaHidden && options.slideFocus ? 0 : null);
      if (focusableNodes) {
        focusableNodes.forEach((node) => {
          setAttribute(node, TAB_INDEX, ariaHidden ? -1 : null);
        });
      }
      if (visible !== hasClass(slide, CLASS_VISIBLE)) {
        toggleClass(slide, CLASS_VISIBLE, visible);
        emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, this);
      }
    }
    function style$1(prop, value, useContainer) {
      style(useContainer && container || slide, prop, value);
    }
    function isActive() {
      return Splide2.index === index;
    }
    function isVisible() {
      if (Splide2.is(FADE)) {
        return isActive();
      }
      const trackRect = rect(Components.Elements.track);
      const slideRect = rect(slide);
      const left = resolve("left");
      const right = resolve("right");
      return floor(trackRect[left]) <= ceil(slideRect[left]) && floor(slideRect[right]) <= ceil(trackRect[right]);
    }
    function isWithin(from, distance) {
      let diff = abs(from - index);
      if (!isClone && (options.rewind || Splide2.is(LOOP))) {
        diff = min(diff, Splide2.length - diff);
      }
      return diff <= distance;
    }
    return {
      index,
      slideIndex,
      slide,
      container,
      isClone,
      mount,
      destroy,
      style: style$1,
      isWithin
    };
  }

  function Slides(Splide2, Components2, options) {
    const { on, emit, bind } = EventInterface(Splide2);
    const { slides, list } = Components2.Elements;
    const Slides2 = [];
    function mount() {
      init();
      on(EVENT_REFRESH, refresh);
      on([EVENT_MOUNTED, EVENT_REFRESH], () => {
        Slides2.sort((Slide1, Slide2) => Slide1.index - Slide2.index);
      });
    }
    function init() {
      slides.forEach((slide, index) => {
        register(slide, index, -1);
      });
    }
    function destroy() {
      forEach$1((Slide2) => {
        Slide2.destroy();
      });
      empty(Slides2);
    }
    function refresh() {
      destroy();
      init();
    }
    function register(slide, index, slideIndex) {
      const object = Slide$1(Splide2, index, slideIndex, slide);
      object.mount();
      Slides2.push(object);
    }
    function get(excludeClones) {
      return excludeClones ? filter((Slide2) => !Slide2.isClone) : Slides2;
    }
    function getIn(page) {
      const { Controller } = Components2;
      const index = Controller.toIndex(page);
      const max = Controller.hasFocus() ? 1 : options.perPage;
      return filter((Slide2) => between(Slide2.index, index, index + max - 1));
    }
    function getAt(index) {
      return filter(index)[0];
    }
    function add(items, index) {
      forEach(items, (slide) => {
        if (isString(slide)) {
          slide = parseHtml(slide);
        }
        if (isHTMLElement(slide)) {
          const ref = slides[index];
          ref ? before(slide, ref) : append(list, slide);
          addClass(slide, options.classes.slide);
          observeImages(slide, emit.bind(null, EVENT_RESIZE));
        }
      });
      emit(EVENT_REFRESH);
    }
    function remove$1(matcher) {
      remove(filter(matcher).map((Slide2) => Slide2.slide));
      emit(EVENT_REFRESH);
    }
    function forEach$1(iteratee, excludeClones) {
      get(excludeClones).forEach(iteratee);
    }
    function filter(matcher) {
      return Slides2.filter(isFunction(matcher) ? matcher : (Slide2) => isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index));
    }
    function style(prop, value, useContainer) {
      forEach$1((Slide2) => {
        Slide2.style(prop, value, useContainer);
      });
    }
    function observeImages(elm, callback) {
      const images = queryAll(elm, "img");
      let { length } = images;
      if (length) {
        images.forEach((img) => {
          bind(img, "load error", () => {
            if (!--length) {
              callback();
            }
          });
        });
      } else {
        callback();
      }
    }
    function getLength(excludeClones) {
      return excludeClones ? slides.length : Slides2.length;
    }
    function isEnough() {
      return Slides2.length > options.perPage;
    }
    return {
      mount,
      destroy,
      register,
      get,
      getIn,
      getAt,
      add,
      remove: remove$1,
      forEach: forEach$1,
      filter,
      style,
      getLength,
      isEnough
    };
  }

  function Layout(Splide2, Components2, options) {
    const { on, bind, emit } = EventInterface(Splide2);
    const { Slides } = Components2;
    const { resolve } = Components2.Direction;
    const { root, track, list } = Components2.Elements;
    const { getAt } = Slides;
    let vertical;
    let rootRect;
    function mount() {
      init();
      bind(window, "resize load", Throttle(emit.bind(this, EVENT_RESIZE)));
      on([EVENT_UPDATED, EVENT_REFRESH], init);
      on(EVENT_RESIZE, resize);
    }
    function init() {
      rootRect = null;
      vertical = options.direction === TTB;
      style(root, "maxWidth", unit(options.width));
      style(track, resolve("paddingLeft"), cssPadding(false));
      style(track, resolve("paddingRight"), cssPadding(true));
      resize();
    }
    function resize() {
      const newRect = rect(root);
      if (!rootRect || rootRect.width !== newRect.width || rootRect.height !== newRect.height) {
        style(track, "height", cssTrackHeight());
        Slides.style(resolve("marginRight"), unit(options.gap));
        Slides.style("width", cssSlideWidth() || null);
        setSlidesHeight();
        rootRect = newRect;
        emit(EVENT_RESIZED);
      }
    }
    function setSlidesHeight() {
      Slides.style("height", cssSlideHeight() || null, true);
    }
    function cssPadding(right) {
      const { padding } = options;
      const prop = resolve(right ? "right" : "left");
      return padding && unit(padding[prop] || (isObject(padding) ? 0 : padding)) || "0px";
    }
    function cssTrackHeight() {
      let height = "";
      if (vertical) {
        height = cssHeight();
        assert(height, "height or heightRatio is missing.");
        height = `calc(${height} - ${cssPadding(false)} - ${cssPadding(true)})`;
      }
      return height;
    }
    function cssHeight() {
      return unit(options.height || rect(list).width * options.heightRatio);
    }
    function cssSlideWidth() {
      return options.autoWidth ? "" : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
    }
    function cssSlideHeight() {
      return unit(options.fixedHeight) || (vertical ? options.autoHeight ? "" : cssSlideSize() : cssHeight());
    }
    function cssSlideSize() {
      const gap = unit(options.gap);
      return `calc((100%${gap && ` + ${gap}`})/${options.perPage || 1}${gap && ` - ${gap}`})`;
    }
    function listSize() {
      return rect(list)[resolve("width")];
    }
    function slideSize(index, withoutGap) {
      const Slide = getAt(index || 0);
      return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
    }
    function totalSize(index, withoutGap) {
      const Slide = getAt(index);
      if (Slide) {
        const right = rect(Slide.slide)[resolve("right")];
        const left = rect(list)[resolve("left")];
        return abs(right - left) + (withoutGap ? 0 : getGap());
      }
      return 0;
    }
    function sliderSize() {
      return totalSize(Splide2.length - 1, true) - totalSize(-1, true);
    }
    function getGap() {
      const Slide = getAt(0);
      return Slide && parseFloat(style(Slide.slide, resolve("marginRight"))) || 0;
    }
    function getPadding(right) {
      return parseFloat(style(track, resolve(`padding${right ? "Right" : "Left"}`))) || 0;
    }
    return {
      mount,
      listSize,
      slideSize,
      sliderSize,
      totalSize,
      getPadding
    };
  }

  function Clones(Splide2, Components2, options) {
    const { on, emit } = EventInterface(Splide2);
    const { Elements, Slides } = Components2;
    const { resolve } = Components2.Direction;
    const clones = [];
    let cloneCount;
    function mount() {
      init();
      on(EVENT_REFRESH, refresh);
      on([EVENT_UPDATED, EVENT_RESIZE], observe);
    }
    function init() {
      if (cloneCount = computeCloneCount()) {
        generate(cloneCount);
        emit(EVENT_RESIZE);
      }
    }
    function destroy() {
      remove(clones);
      empty(clones);
    }
    function refresh() {
      destroy();
      init();
    }
    function observe() {
      if (cloneCount < computeCloneCount()) {
        emit(EVENT_REFRESH);
      }
    }
    function generate(count) {
      const slides = Slides.get().slice();
      const { length } = slides;
      if (length) {
        while (slides.length < count) {
          push(slides, slides);
        }
        push(slides.slice(-count), slides.slice(0, count)).forEach((Slide, index) => {
          const isHead = index < count;
          const clone = cloneDeep(Slide.slide, index);
          isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
          push(clones, clone);
          Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
        });
      }
    }
    function cloneDeep(elm, index) {
      const clone = elm.cloneNode(true);
      addClass(clone, options.classes.clone);
      clone.id = `${Splide2.root.id}-clone${pad(index + 1)}`;
      return clone;
    }
    function computeCloneCount() {
      let { clones: clones2 } = options;
      if (!Splide2.is(LOOP)) {
        clones2 = 0;
      } else if (!clones2) {
        const fixedSize = measure(Elements.list, options[resolve("fixedWidth")]);
        const fixedCount = fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
        const baseCount = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage;
        clones2 = baseCount * (options.drag ? (options.flickMaxPages || 1) + 1 : 2);
      }
      return clones2;
    }
    return {
      mount,
      destroy
    };
  }

  function Move(Splide2, Components2, options) {
    const { on, emit } = EventInterface(Splide2);
    const { slideSize, getPadding, totalSize, listSize, sliderSize } = Components2.Layout;
    const { resolve, orient } = Components2.Direction;
    const { list, track } = Components2.Elements;
    let waiting;
    function mount() {
      on([EVENT_MOUNTED, EVENT_RESIZED, EVENT_UPDATED, EVENT_REFRESH], reposition);
    }
    function destroy() {
      removeAttribute(list, "style");
    }
    function reposition() {
      if (!isBusy()) {
        Components2.Scroll.cancel();
        jump(Splide2.index);
        emit(EVENT_REPOSITIONED);
      }
    }
    function move(dest, index, prev, callback) {
      if (!isBusy()) {
        const { set } = Splide2.state;
        const position = getPosition();
        const looping = dest !== index;
        waiting = looping || options.waitForTransition;
        set(MOVING);
        emit(EVENT_MOVE, index, prev, dest);
        Components2.Transition.start(dest, () => {
          looping && jump(index);
          waiting = false;
          set(IDLE);
          emit(EVENT_MOVED, index, prev, dest);
          if (options.trimSpace === "move" && dest !== prev && position === getPosition()) {
            Components2.Controller.go(dest > prev ? ">" : "<", false, callback);
          } else {
            callback && callback();
          }
        });
      }
    }
    function jump(index) {
      translate(toPosition(index, true));
    }
    function translate(position, preventLoop) {
      if (!Splide2.is(FADE)) {
        list.style.transform = `translate${resolve("X")}(${preventLoop ? position : loop(position)}px)`;
      }
    }
    function loop(position) {
      if (!waiting && Splide2.is(LOOP)) {
        const diff = orient(position - getPosition());
        const exceededMin = exceededLimit(false, position) && diff < 0;
        const exceededMax = exceededLimit(true, position) && diff > 0;
        if (exceededMin || exceededMax) {
          position = shift(position, exceededMax);
        }
      }
      return position;
    }
    function shift(position, backwards) {
      const excess = position - getLimit(backwards);
      const size = sliderSize();
      position -= sign(excess) * size * ceil(abs(excess) / size);
      return position;
    }
    function cancel() {
      waiting = false;
      translate(getPosition());
      Components2.Transition.cancel();
    }
    function toIndex(position) {
      const Slides = Components2.Slides.get();
      let index = 0;
      let minDistance = Infinity;
      for (let i = 0; i < Slides.length; i++) {
        const slideIndex = Slides[i].index;
        const distance = abs(toPosition(slideIndex, true) - position);
        if (distance <= minDistance) {
          minDistance = distance;
          index = slideIndex;
        } else {
          break;
        }
      }
      return index;
    }
    function toPosition(index, trimming) {
      const position = orient(totalSize(index - 1) - offset(index));
      return trimming ? trim(position) : position;
    }
    function getPosition() {
      const left = resolve("left");
      return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
    }
    function trim(position) {
      if (options.trimSpace && Splide2.is(SLIDE)) {
        position = clamp(position, 0, orient(sliderSize() - listSize()));
      }
      return position;
    }
    function offset(index) {
      const { focus } = options;
      return focus === "center" ? (listSize() - slideSize(index, true)) / 2 : +focus * slideSize(index) || 0;
    }
    function getLimit(max) {
      return toPosition(max ? Components2.Controller.getEnd() : 0, !!options.trimSpace);
    }
    function isBusy() {
      return !!waiting;
    }
    function exceededLimit(max, position) {
      position = isUndefined(position) ? getPosition() : position;
      const exceededMin = max !== true && orient(position) < orient(getLimit(false));
      const exceededMax = max !== false && orient(position) > orient(getLimit(true));
      return exceededMin || exceededMax;
    }
    return {
      mount,
      destroy,
      move,
      jump,
      translate,
      shift,
      cancel,
      toIndex,
      toPosition,
      getPosition,
      getLimit,
      isBusy,
      exceededLimit
    };
  }

  function Controller(Splide2, Components2, options) {
    const { on } = EventInterface(Splide2);
    const { Move } = Components2;
    const { getPosition, getLimit } = Move;
    const { isEnough, getLength } = Components2.Slides;
    const isLoop = Splide2.is(LOOP);
    const isSlide = Splide2.is(SLIDE);
    let currIndex = options.start || 0;
    let prevIndex = currIndex;
    let slideCount;
    let perMove;
    let perPage;
    function mount() {
      init();
      on([EVENT_UPDATED, EVENT_REFRESH], init, DEFAULT_EVENT_PRIORITY - 1);
    }
    function init() {
      slideCount = getLength(true);
      perMove = options.perMove;
      perPage = options.perPage;
      currIndex = clamp(currIndex, 0, slideCount - 1);
    }
    function go(control, allowSameIndex, callback) {
      const dest = parse(control);
      if (options.useScroll) {
        scroll(dest, true, true, options.speed, callback);
      } else {
        const index = loop(dest);
        if (index > -1 && !Move.isBusy() && (allowSameIndex || index !== currIndex)) {
          setIndex(index);
          Move.move(dest, index, prevIndex, callback);
        }
      }
    }
    function scroll(destination, useIndex, snap, duration, callback) {
      const dest = useIndex ? destination : toDest(destination);
      Components2.Scroll.scroll(useIndex || snap ? Move.toPosition(dest, true) : destination, duration, () => {
        setIndex(Move.toIndex(Move.getPosition()));
        callback && callback();
      });
    }
    function parse(control) {
      let index = currIndex;
      if (isString(control)) {
        const [, indicator, number] = control.match(/([+\-<>])(\d+)?/) || [];
        if (indicator === "+" || indicator === "-") {
          index = computeDestIndex(currIndex + +`${indicator}${+number || 1}`, currIndex, true);
        } else if (indicator === ">") {
          index = number ? toIndex(+number) : getNext(true);
        } else if (indicator === "<") {
          index = getPrev(true);
        }
      } else {
        if (isLoop) {
          index = clamp(control, -perPage, slideCount + perPage - 1);
        } else {
          index = clamp(control, 0, getEnd());
        }
      }
      return index;
    }
    function getNext(destination) {
      return getAdjacent(false, destination);
    }
    function getPrev(destination) {
      return getAdjacent(true, destination);
    }
    function getAdjacent(prev, destination) {
      const number = perMove || (hasFocus() ? 1 : perPage);
      const dest = computeDestIndex(currIndex + number * (prev ? -1 : 1), currIndex);
      if (dest === -1 && isSlide) {
        if (!approximatelyEqual(getPosition(), getLimit(!prev), 1)) {
          return prev ? 0 : getEnd();
        }
      }
      return destination ? dest : loop(dest);
    }
    function computeDestIndex(dest, from, incremental) {
      if (isEnough()) {
        const end = getEnd();
        if (dest < 0 || dest > end) {
          if (between(0, dest, from, true) || between(end, from, dest, true)) {
            dest = toIndex(toPage(dest));
          } else {
            if (isLoop) {
              dest = perMove ? dest : dest < 0 ? -(slideCount % perPage || perPage) : slideCount;
            } else if (options.rewind) {
              dest = dest < 0 ? end : 0;
            } else {
              dest = -1;
            }
          }
        } else {
          if (!incremental && dest !== from) {
            dest = perMove ? dest : toIndex(toPage(from) + (dest < from ? -1 : 1));
          }
        }
      } else {
        dest = -1;
      }
      return dest;
    }
    function getEnd() {
      let end = slideCount - perPage;
      if (hasFocus() || isLoop && perMove) {
        end = slideCount - 1;
      }
      return max(end, 0);
    }
    function loop(index) {
      if (isLoop) {
        return isEnough() ? index % slideCount + (index < 0 ? slideCount : 0) : -1;
      }
      return index;
    }
    function toIndex(page) {
      return clamp(hasFocus() ? page : perPage * page, 0, getEnd());
    }
    function toPage(index) {
      if (!hasFocus()) {
        index = between(index, slideCount - perPage, slideCount - 1) ? slideCount - 1 : index;
        index = floor(index / perPage);
      }
      return index;
    }
    function toDest(destination) {
      const closest = Move.toIndex(destination);
      return isSlide ? clamp(closest, 0, getEnd()) : closest;
    }
    function setIndex(index) {
      if (index !== currIndex) {
        prevIndex = currIndex;
        currIndex = index;
      }
    }
    function getIndex(prev) {
      return prev ? prevIndex : currIndex;
    }
    function hasFocus() {
      return !isUndefined(options.focus) || options.isNavigation;
    }
    return {
      mount,
      go,
      scroll,
      getNext,
      getPrev,
      getEnd,
      setIndex,
      getIndex,
      toIndex,
      toPage,
      toDest,
      hasFocus
    };
  }

  const XML_NAME_SPACE = "http://www.w3.org/2000/svg";
  const PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
  const SIZE = 40;

  function Arrows(Splide2, Components2, options) {
    const { on, bind, emit } = EventInterface(Splide2);
    const { classes, i18n } = options;
    const { Elements, Controller } = Components2;
    let wrapper = Elements.arrows;
    let prev = Elements.prev;
    let next = Elements.next;
    let created;
    const arrows = {};
    function mount() {
      init();
      on(EVENT_UPDATED, init);
    }
    function init() {
      if (options.arrows) {
        if (!prev || !next) {
          createArrows();
        }
      }
      if (prev && next) {
        if (!arrows.prev) {
          const { id } = Elements.track;
          setAttribute(prev, ARIA_CONTROLS, id);
          setAttribute(next, ARIA_CONTROLS, id);
          arrows.prev = prev;
          arrows.next = next;
          listen();
          emit(EVENT_ARROWS_MOUNTED, prev, next);
        } else {
          display(wrapper, options.arrows === false ? "none" : "");
        }
      }
    }
    function destroy() {
      if (created) {
        remove(wrapper);
      } else {
        removeAttribute(prev, ALL_ATTRIBUTES);
        removeAttribute(next, ALL_ATTRIBUTES);
      }
    }
    function listen() {
      const { go } = Controller;
      on([EVENT_MOUNTED, EVENT_MOVED, EVENT_UPDATED, EVENT_REFRESH, EVENT_SCROLLED], update);
      bind(next, "click", () => {
        go(">", true);
      });
      bind(prev, "click", () => {
        go("<", true);
      });
    }
    function createArrows() {
      wrapper = create("div", classes.arrows);
      prev = createArrow(true);
      next = createArrow(false);
      created = true;
      append(wrapper, [prev, next]);
      before(wrapper, child(options.arrows === "slider" && Elements.slider || Splide2.root));
    }
    function createArrow(prev2) {
      const arrow = `<button class="${classes.arrow} ${prev2 ? classes.prev : classes.next}" type="button"><svg xmlns="${XML_NAME_SPACE}" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}"><path d="${options.arrowPath || PATH}" />`;
      return parseHtml(arrow);
    }
    function update() {
      const index = Splide2.index;
      const prevIndex = Controller.getPrev();
      const nextIndex = Controller.getNext();
      const prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
      const nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
      prev.disabled = prevIndex < 0;
      next.disabled = nextIndex < 0;
      setAttribute(prev, ARIA_LABEL, prevLabel);
      setAttribute(next, ARIA_LABEL, nextLabel);
      emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
    }
    return {
      arrows,
      mount,
      destroy
    };
  }

  function Autoplay(Splide2, Components2, options) {
    const { on, bind, emit } = EventInterface(Splide2);
    const { Elements } = Components2;
    const interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), update);
    const { isPaused } = interval;
    let hovered;
    let focused;
    let paused;
    function mount() {
      const { autoplay } = options;
      if (autoplay) {
        initButton(true);
        initButton(false);
        listen();
        if (autoplay !== "pause") {
          play();
        }
      }
    }
    function initButton(forPause) {
      const prop = forPause ? "pause" : "play";
      const button = Elements[prop];
      if (button) {
        setAttribute(button, ARIA_CONTROLS, Elements.track.id);
        setAttribute(button, ARIA_LABEL, options.i18n[prop]);
        bind(button, "click", forPause ? pause : play);
      }
    }
    function listen() {
      const { root } = Elements;
      if (options.pauseOnHover) {
        bind(root, "mouseenter mouseleave", (e) => {
          hovered = e.type === "mouseenter";
          autoToggle();
        });
      }
      if (options.pauseOnFocus) {
        bind(root, "focusin focusout", (e) => {
          focused = e.type === "focusin";
          autoToggle();
        });
      }
      on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
    }
    function play() {
      if (isPaused() && Components2.Slides.isEnough()) {
        interval.start(!options.resetProgress);
        focused = hovered = paused = false;
        emit(EVENT_AUTOPLAY_PLAY);
      }
    }
    function pause(manual = true) {
      if (!isPaused()) {
        interval.pause();
        emit(EVENT_AUTOPLAY_PAUSE);
      }
      paused = manual;
    }
    function autoToggle() {
      if (!paused) {
        if (!hovered && !focused) {
          play();
        } else {
          pause(false);
        }
      }
    }
    function update(rate) {
      const { bar } = Elements;
      if (bar) {
        style(bar, "width", `${rate * 100}%`);
      }
      emit(EVENT_AUTOPLAY_PLAYING, rate);
    }
    return {
      mount,
      destroy: interval.cancel,
      play,
      pause,
      isPaused
    };
  }

  function Cover(Splide2, Components2, options) {
    const { on } = EventInterface(Splide2);
    function mount() {
      if (options.cover) {
        on(EVENT_LAZYLOAD_LOADED, (img, Slide) => {
          toggle(true, img, Slide);
        });
        on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply.bind(null, true));
      }
    }
    function destroy() {
      apply(false);
    }
    function apply(cover) {
      Components2.Slides.forEach((Slide) => {
        const img = child(Slide.container || Slide.slide, "img");
        if (img && img.src) {
          toggle(cover, img, Slide);
        }
      });
    }
    function toggle(cover, img, Slide) {
      Slide.style("background", cover ? `center/cover no-repeat url("${img.src}")` : "", true);
      display(img, cover ? "none" : "");
    }
    return {
      mount,
      destroy
    };
  }

  const BOUNCE_DIFF_THRESHOLD = 10;
  const BOUNCE_DURATION = 600;
  const FRICTION_FACTOR = 0.6;
  const BASE_VELOCITY = 1.5;
  const MIN_DURATION = 800;

  function Scroll(Splide2, Components2, options) {
    const { on, emit } = EventInterface(Splide2);
    const { Move } = Components2;
    const { getPosition, getLimit, exceededLimit } = Move;
    let interval;
    let scrollCallback;
    function mount() {
      on(EVENT_MOVE, clear);
      on([EVENT_UPDATED, EVENT_REFRESH], cancel);
    }
    function scroll(destination, duration, callback, suppressConstraint) {
      const start = getPosition();
      let friction = 1;
      duration = duration || computeDuration(abs(destination - start));
      scrollCallback = callback;
      clear();
      interval = RequestInterval(duration, onScrolled, (rate) => {
        const position = getPosition();
        const target = start + (destination - start) * easing(rate);
        const diff = (target - getPosition()) * friction;
        Move.translate(position + diff);
        if (Splide2.is(SLIDE) && !suppressConstraint && exceededLimit()) {
          friction *= FRICTION_FACTOR;
          if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
            bounce(exceededLimit(false));
          }
        }
      }, 1);
      emit(EVENT_SCROLL);
      interval.start();
    }
    function bounce(backwards) {
      scroll(getLimit(!backwards), BOUNCE_DURATION, null, true);
    }
    function onScrolled() {
      const position = getPosition();
      const index = Move.toIndex(position);
      if (!between(index, 0, Splide2.length - 1)) {
        Move.translate(Move.shift(position, index > 0), true);
      }
      scrollCallback && scrollCallback();
      emit(EVENT_SCROLLED);
    }
    function computeDuration(distance) {
      return max(distance / BASE_VELOCITY, MIN_DURATION);
    }
    function clear() {
      if (interval) {
        interval.cancel();
      }
    }
    function cancel() {
      if (interval && !interval.isPaused()) {
        clear();
        onScrolled();
      }
    }
    function easing(t) {
      const { easingFunc } = options;
      return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
    }
    return {
      mount,
      destroy: clear,
      scroll,
      cancel
    };
  }

  const FRICTION = 5;
  const LOG_INTERVAL = 200;
  const POINTER_DOWN_EVENTS = "touchstart mousedown";
  const POINTER_MOVE_EVENTS = "touchmove mousemove";
  const POINTER_UP_EVENTS = "touchend touchcancel mouseup";

  function Drag(Splide2, Components2, options) {
    const { on, emit, bind, unbind } = EventInterface(Splide2);
    const { Move, Scroll, Controller } = Components2;
    const { track } = Components2.Elements;
    const { resolve, orient } = Components2.Direction;
    const { getPosition, exceededLimit } = Move;
    const listenerOptions = { passive: false, capture: true };
    let basePosition;
    let baseEvent;
    let prevBaseEvent;
    let lastEvent;
    let isFree;
    let dragging;
    let hasExceeded = false;
    let clickPrevented;
    let disabled;
    let target;
    function mount() {
      bind(track, POINTER_MOVE_EVENTS, noop, listenerOptions);
      bind(track, POINTER_UP_EVENTS, noop, listenerOptions);
      bind(track, POINTER_DOWN_EVENTS, onPointerDown, listenerOptions);
      bind(track, "click", onClick, { capture: true });
      bind(track, "dragstart", prevent);
      on([EVENT_MOUNTED, EVENT_UPDATED], init);
    }
    function init() {
      const { drag } = options;
      disable(!drag);
      isFree = drag === "free";
    }
    function onPointerDown(e) {
      if (!disabled) {
        const { noDrag } = options;
        const isTouch = isTouchEvent(e);
        const isDraggable = !noDrag || isHTMLElement(e.target) && !matches(e.target, noDrag);
        if (isDraggable && (isTouch || !e.button)) {
          if (!Move.isBusy()) {
            target = isTouch ? track : window;
            prevBaseEvent = null;
            lastEvent = null;
            clickPrevented = false;
            bind(target, POINTER_MOVE_EVENTS, onPointerMove, listenerOptions);
            bind(target, POINTER_UP_EVENTS, onPointerUp, listenerOptions);
            Move.cancel();
            Scroll.cancel();
            save(e);
          } else {
            prevent(e, true);
          }
        }
      }
    }
    function onPointerMove(e) {
      if (!lastEvent) {
        emit(EVENT_DRAG);
      }
      lastEvent = e;
      if (e.cancelable) {
        const diff = coordOf(e) - coordOf(baseEvent);
        if (dragging) {
          Move.translate(basePosition + constrain(diff));
          const expired = timeOf(e) - timeOf(baseEvent) > LOG_INTERVAL;
          const exceeded = hasExceeded !== (hasExceeded = exceededLimit());
          if (expired || exceeded) {
            save(e);
          }
          emit(EVENT_DRAGGING);
          clickPrevented = true;
          prevent(e);
        } else {
          let { dragMinThreshold: thresholds } = options;
          thresholds = isObject(thresholds) ? thresholds : { mouse: 0, touch: +thresholds || 10 };
          dragging = abs(diff) > (isTouchEvent(e) ? thresholds.touch : thresholds.mouse);
          if (isSliderDirection()) {
            prevent(e);
          }
        }
      }
    }
    function onPointerUp(e) {
      unbind(target, POINTER_MOVE_EVENTS, onPointerMove);
      unbind(target, POINTER_UP_EVENTS, onPointerUp);
      if (lastEvent) {
        if (dragging || e.cancelable && isSliderDirection()) {
          const velocity = computeVelocity(e);
          const destination = computeDestination(velocity);
          if (isFree) {
            Controller.scroll(destination);
          } else if (Splide2.is(FADE)) {
            Controller.go(Splide2.index + orient(sign(velocity)));
          } else {
            Controller.go(Controller.toDest(destination), true);
          }
          prevent(e);
        }
        emit(EVENT_DRAGGED);
      }
      dragging = false;
    }
    function save(e) {
      prevBaseEvent = baseEvent;
      baseEvent = e;
      basePosition = getPosition();
    }
    function onClick(e) {
      if (!disabled && clickPrevented) {
        prevent(e, true);
      }
    }
    function isSliderDirection() {
      const diffX = abs(coordOf(lastEvent) - coordOf(baseEvent));
      const diffY = abs(coordOf(lastEvent, true) - coordOf(baseEvent, true));
      return diffX > diffY;
    }
    function computeVelocity(e) {
      if (Splide2.is(LOOP) || !hasExceeded) {
        const base = baseEvent === lastEvent && prevBaseEvent || baseEvent;
        const diffCoord = coordOf(lastEvent) - coordOf(base);
        const diffTime = timeOf(e) - timeOf(base);
        const isFlick = timeOf(e) - timeOf(lastEvent) < LOG_INTERVAL;
        if (diffTime && isFlick) {
          return diffCoord / diffTime;
        }
      }
      return 0;
    }
    function computeDestination(velocity) {
      return getPosition() + sign(velocity) * min(abs(velocity) * (options.flickPower || 600), isFree ? Infinity : Components2.Layout.listSize() * (options.flickMaxPages || 1));
    }
    function coordOf(e, orthogonal) {
      return (isTouchEvent(e) ? e.touches[0] : e)[`page${resolve(orthogonal ? "Y" : "X")}`];
    }
    function timeOf(e) {
      return e.timeStamp;
    }
    function constrain(diff) {
      return diff / (hasExceeded && Splide2.is(SLIDE) ? FRICTION : 1);
    }
    function isTouchEvent(e) {
      return typeof TouchEvent !== "undefined" && e instanceof TouchEvent;
    }
    function isDragging() {
      return dragging;
    }
    function disable(value) {
      disabled = value;
    }
    return {
      mount,
      disable,
      isDragging
    };
  }

  const IE_ARROW_KEYS = ["Left", "Right", "Up", "Down"];
  function Keyboard(Splide2, Components2, options) {
    const { on, bind, unbind } = EventInterface(Splide2);
    const { root } = Components2.Elements;
    const { resolve } = Components2.Direction;
    let target;
    function mount() {
      init();
      on(EVENT_UPDATED, () => {
        destroy();
        init();
      });
    }
    function init() {
      const { keyboard = "global" } = options;
      if (keyboard) {
        if (keyboard === "focused") {
          target = root;
          setAttribute(root, TAB_INDEX, 0);
        } else {
          target = window;
        }
        bind(target, "keydown", onKeydown);
      }
    }
    function destroy() {
      unbind(target, "keydown");
      if (isHTMLElement(target)) {
        removeAttribute(target, TAB_INDEX);
      }
    }
    function onKeydown(e) {
      const { key } = e;
      const normalizedKey = includes(IE_ARROW_KEYS, key) ? `Arrow${key}` : key;
      if (normalizedKey === resolve("ArrowLeft")) {
        Splide2.go("<");
      } else if (normalizedKey === resolve("ArrowRight")) {
        Splide2.go(">");
      }
    }
    return {
      mount,
      destroy
    };
  }

  const SRC_DATA_ATTRIBUTE = `${DATA_ATTRIBUTE}-lazy`;
  const SRCSET_DATA_ATTRIBUTE = `${SRC_DATA_ATTRIBUTE}-srcset`;
  const IMAGE_SELECTOR = `[${SRC_DATA_ATTRIBUTE}], [${SRCSET_DATA_ATTRIBUTE}]`;

  function LazyLoad(Splide2, Components2, options) {
    const { on, off, bind, emit } = EventInterface(Splide2);
    const isSequential = options.lazyLoad === "sequential";
    let images = [];
    let index = 0;
    function mount() {
      if (options.lazyLoad) {
        on([EVENT_MOUNTED, EVENT_REFRESH], () => {
          destroy();
          init();
        });
        if (!isSequential) {
          on([EVENT_MOUNTED, EVENT_REFRESH, EVENT_MOVED], observe);
        }
      }
    }
    function init() {
      Components2.Slides.forEach((_Slide) => {
        queryAll(_Slide.slide, IMAGE_SELECTOR).forEach((_img) => {
          const src = getAttribute(_img, SRC_DATA_ATTRIBUTE);
          const srcset = getAttribute(_img, SRCSET_DATA_ATTRIBUTE);
          if (src !== _img.src || srcset !== _img.srcset) {
            const _spinner = create("span", options.classes.spinner, _img.parentElement);
            setAttribute(_spinner, ROLE, "presentation");
            images.push({ _img, _Slide, src, srcset, _spinner });
            !_img.src && display(_img, "none");
          }
        });
      });
      if (isSequential) {
        loadNext();
      }
    }
    function destroy() {
      index = 0;
      images = [];
    }
    function observe() {
      images = images.filter((data) => {
        const distance = options.perPage * ((options.preloadPages || 1) + 1) - 1;
        if (data._Slide.isWithin(Splide2.index, distance)) {
          return load(data);
        }
        return true;
      });
      if (!images.length) {
        off(EVENT_MOVED);
      }
    }
    function load(data) {
      const { _img } = data;
      addClass(data._Slide.slide, CLASS_LOADING);
      bind(_img, "load error", (e) => {
        onLoad(data, e.type === "error");
      });
      ["src", "srcset"].forEach((name) => {
        if (data[name]) {
          setAttribute(_img, name, data[name]);
          removeAttribute(_img, name === "src" ? SRC_DATA_ATTRIBUTE : SRCSET_DATA_ATTRIBUTE);
        }
      });
    }
    function onLoad(data, error) {
      const { _Slide } = data;
      removeClass(_Slide.slide, CLASS_LOADING);
      if (!error) {
        remove(data._spinner);
        display(data._img, "");
        emit(EVENT_LAZYLOAD_LOADED, data._img, _Slide);
        emit(EVENT_RESIZE);
      }
      if (isSequential) {
        loadNext();
      }
    }
    function loadNext() {
      if (index < images.length) {
        load(images[index++]);
      }
    }
    return {
      mount,
      destroy
    };
  }

  function Pagination(Splide2, Components2, options) {
    const { on, emit, bind, unbind } = EventInterface(Splide2);
    const { Slides, Elements, Controller } = Components2;
    const { hasFocus, getIndex } = Controller;
    const items = [];
    let list;
    function mount() {
      init();
      on([EVENT_UPDATED, EVENT_REFRESH], init);
      on([EVENT_MOVE, EVENT_SCROLLED], update);
    }
    function init() {
      destroy();
      if (options.pagination && Slides.isEnough()) {
        createPagination();
        emit(EVENT_PAGINATION_MOUNTED, { list, items }, getAt(Splide2.index));
        update();
      }
    }
    function destroy() {
      if (list) {
        remove(list);
        items.forEach((item) => {
          unbind(item.button, "click");
        });
        empty(items);
        list = null;
      }
    }
    function createPagination() {
      const { length } = Splide2;
      const { classes, i18n, perPage } = options;
      const parent = options.pagination === "slider" && Elements.slider || Elements.root;
      const max = hasFocus() ? length : ceil(length / perPage);
      list = create("ul", classes.pagination, parent);
      for (let i = 0; i < max; i++) {
        const li = create("li", null, list);
        const button = create("button", { class: classes.page, type: "button" }, li);
        const controls = Slides.getIn(i).map((Slide) => Slide.slide.id);
        const text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
        bind(button, "click", onClick.bind(null, i));
        setAttribute(button, ARIA_CONTROLS, controls.join(" "));
        setAttribute(button, ARIA_LABEL, format(text, i + 1));
        items.push({ li, button, page: i });
      }
    }
    function onClick(page) {
      Controller.go(`>${page}`, true, () => {
        const Slide = Slides.getAt(Controller.toIndex(page));
        Slide && focus(Slide.slide);
      });
    }
    function getAt(index) {
      return items[Controller.toPage(index)];
    }
    function update() {
      const prev = getAt(getIndex(true));
      const curr = getAt(getIndex());
      if (prev) {
        removeClass(prev.button, CLASS_ACTIVE);
        removeAttribute(prev.button, ARIA_CURRENT);
      }
      if (curr) {
        addClass(curr.button, CLASS_ACTIVE);
        setAttribute(curr.button, ARIA_CURRENT, true);
      }
      emit(EVENT_PAGINATION_UPDATED, { list, items }, prev, curr);
    }
    return {
      items,
      mount,
      destroy,
      getAt
    };
  }

  const TRIGGER_KEYS = [" ", "Enter", "Spacebar"];
  function Sync(Splide2, Components2, options) {
    const { splides } = Splide2;
    const { list } = Components2.Elements;
    function mount() {
      if (options.isNavigation) {
        navigate();
      } else {
        sync();
      }
    }
    function destroy() {
      removeAttribute(list, ALL_ATTRIBUTES);
    }
    function sync() {
      const processed = [];
      splides.concat(Splide2).forEach((splide, index, instances) => {
        EventInterface(splide).on(EVENT_MOVE, (index2, prev, dest) => {
          instances.forEach((instance) => {
            if (instance !== splide && !includes(processed, splide)) {
              processed.push(instance);
              instance.go(instance.is(LOOP) ? dest : index2);
            }
          });
          empty(processed);
        });
      });
    }
    function navigate() {
      const { on, emit } = EventInterface(Splide2);
      on(EVENT_CLICK, onClick);
      on(EVENT_SLIDE_KEYDOWN, onKeydown);
      on([EVENT_MOUNTED, EVENT_UPDATED], update);
      setAttribute(list, ROLE, "menu");
      emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
    }
    function update() {
      setAttribute(list, ARIA_ORIENTATION, options.direction !== TTB ? "horizontal" : null);
    }
    function onClick(Slide) {
      Splide2.go(Slide.index);
    }
    function onKeydown(Slide, e) {
      if (includes(TRIGGER_KEYS, e.key)) {
        onClick(Slide);
        prevent(e);
      }
    }
    return {
      mount,
      destroy
    };
  }

  function Wheel(Splide2, Components2, options) {
    const { bind } = EventInterface(Splide2);
    function mount() {
      if (options.wheel) {
        bind(Components2.Elements.track, "wheel", onWheel, { passive: false, capture: true });
      }
    }
    function onWheel(e) {
      const { deltaY } = e;
      if (deltaY) {
        Splide2.go(deltaY < 0 ? "<" : ">");
        prevent(e);
      }
    }
    return {
      mount
    };
  }

  var ComponentConstructors = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Options: Options,
    Direction: Direction,
    Elements: Elements,
    Slides: Slides,
    Layout: Layout,
    Clones: Clones,
    Move: Move,
    Controller: Controller,
    Arrows: Arrows,
    Autoplay: Autoplay,
    Cover: Cover,
    Scroll: Scroll,
    Drag: Drag,
    Keyboard: Keyboard,
    LazyLoad: LazyLoad,
    Pagination: Pagination,
    Sync: Sync,
    Wheel: Wheel
  });

  const I18N = {
    prev: "Previous slide",
    next: "Next slide",
    first: "Go to first slide",
    last: "Go to last slide",
    slideX: "Go to slide %s",
    pageX: "Go to page %s",
    play: "Start autoplay",
    pause: "Pause autoplay"
  };

  const DEFAULTS = {
    type: "slide",
    speed: 400,
    waitForTransition: true,
    perPage: 1,
    arrows: true,
    pagination: true,
    interval: 5e3,
    pauseOnHover: true,
    pauseOnFocus: true,
    resetProgress: true,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    drag: true,
    direction: "ltr",
    slideFocus: true,
    trimSpace: true,
    focusableNodes: "a, button, textarea, input, select, iframe",
    classes: CLASSES,
    i18n: I18N
  };

  function Fade(Splide2, Components2, options) {
    const { on } = EventInterface(Splide2);
    function mount() {
      on([EVENT_MOUNTED, EVENT_REFRESH], () => {
        nextTick(() => {
          Components2.Slides.style("transition", `opacity ${options.speed}ms ${options.easing}`);
        });
      });
    }
    function start(index, done) {
      const { track } = Components2.Elements;
      style(track, "height", unit(rect(track).height));
      nextTick(() => {
        done();
        style(track, "height", "");
      });
    }
    return {
      mount,
      start,
      cancel: noop
    };
  }

  function Slide(Splide2, Components2, options) {
    const { bind } = EventInterface(Splide2);
    const { Move, Controller } = Components2;
    const { list } = Components2.Elements;
    let endCallback;
    function mount() {
      bind(list, "transitionend", (e) => {
        if (e.target === list && endCallback) {
          cancel();
          endCallback();
        }
      });
    }
    function start(index, done) {
      const destination = Move.toPosition(index, true);
      const position = Move.getPosition();
      const speed = getSpeed(index);
      if (abs(destination - position) >= 1 && speed >= 1) {
        apply(`transform ${speed}ms ${options.easing}`);
        Move.translate(destination, true);
        endCallback = done;
      } else {
        Move.jump(index);
        done();
      }
    }
    function cancel() {
      apply("");
    }
    function getSpeed(index) {
      const { rewindSpeed } = options;
      if (Splide2.is(SLIDE) && rewindSpeed) {
        const prev = Controller.getIndex(true);
        const end = Controller.getEnd();
        if (prev === 0 && index >= end || prev >= end && index === 0) {
          return rewindSpeed;
        }
      }
      return options.speed;
    }
    function apply(transition) {
      style(list, "transition", transition);
    }
    return {
      mount,
      start,
      cancel
    };
  }

  const _Splide = class {
    constructor(target, options) {
      this.event = EventBus();
      this.Components = {};
      this.state = State(CREATED);
      this.splides = [];
      this._options = {};
      this._Extensions = {};
      const root = isString(target) ? query(document, target) : target;
      assert(root, `${root} is invalid.`);
      this.root = root;
      merge(DEFAULTS, _Splide.defaults);
      merge(merge(this._options, DEFAULTS), options || {});
    }
    mount(Extensions, Transition) {
      const { state, Components: Components2 } = this;
      assert(state.is([CREATED, DESTROYED]), "Already mounted!");
      state.set(CREATED);
      this._Components = Components2;
      this._Transition = Transition || this._Transition || (this.is(FADE) ? Fade : Slide);
      this._Extensions = Extensions || this._Extensions;
      const Constructors = assign({}, ComponentConstructors, this._Extensions, { Transition: this._Transition });
      forOwn(Constructors, (Component, key) => {
        const component = Component(this, Components2, this._options);
        Components2[key] = component;
        component.setup && component.setup();
      });
      forOwn(Components2, (component) => {
        component.mount && component.mount();
      });
      this.emit(EVENT_MOUNTED);
      addClass(this.root, CLASS_INITIALIZED);
      state.set(IDLE);
      this.emit(EVENT_READY);
      return this;
    }
    sync(splide) {
      this.splides.push(splide);
      splide.splides.push(this);
      return this;
    }
    go(control) {
      this._Components.Controller.go(control);
      return this;
    }
    on(events, callback) {
      this.event.on(events, callback, null, DEFAULT_USER_EVENT_PRIORITY);
      return this;
    }
    off(events) {
      this.event.off(events);
      return this;
    }
    emit(event) {
      this.event.emit(event, ...slice(arguments, 1));
      return this;
    }
    add(slides, index) {
      this._Components.Slides.add(slides, index);
      return this;
    }
    remove(matcher) {
      this._Components.Slides.remove(matcher);
      return this;
    }
    is(type) {
      return this._options.type === type;
    }
    refresh() {
      this.emit(EVENT_REFRESH);
      return this;
    }
    destroy(completely = true) {
      const { event, state } = this;
      if (state.is(CREATED)) {
        event.on(EVENT_READY, this.destroy.bind(this, completely), this);
      } else {
        forOwn(this._Components, (component) => {
          component.destroy && component.destroy(completely);
        }, true);
        event.emit(EVENT_DESTROY);
        event.destroy();
        completely && empty(this.splides);
        state.set(DESTROYED);
      }
      return this;
    }
    get options() {
      return this._options;
    }
    set options(options) {
      const { _options } = this;
      merge(_options, options);
      if (!this.state.is(CREATED)) {
        this.emit(EVENT_UPDATED, _options);
      }
    }
    get length() {
      return this._Components.Slides.getLength(true);
    }
    get index() {
      return this._Components.Controller.getIndex();
    }
  };
  let Splide = _Splide;
  Splide.defaults = {};
  Splide.STATES = STATES;

  if (document.querySelector('#carousel')) {
    new Splide('#carousel', {
      pagination: false,
      type: 'slide',
      perPage: 4,
      perMove: 1,
      gap: 32,
      breakpoints: {
        500: {
          perPage: 1,
          gap: 10
        },
        767: {
          perPage: 2,
          gap: 10
        },
        1024: {
          perPage: 2,
          gap: 16
        },
        1400: {
          perPage: 3,
          gap: 32
        }
      }
    }).mount();
  }

  /**
   * Toggle Nav
   * ======================================
   * - toggle class on body
   */
  var ELEMENTS = '.togglenav__button';
  var TOGGLE_CLASS = 'nav-is-open';

  var ToggleNav = /*#__PURE__*/function () {
    function ToggleNav() {
      var _this = this;

      _classCallCheck(this, ToggleNav);

      this.elements = document.querySelectorAll(ELEMENTS);

      if (!this.elements) {
        return false;
      }

      this.elements.forEach(function (el) {
        el.addEventListener('click', _this.toggleNav, false);
      });
    }

    _createClass(ToggleNav, [{
      key: "toggleNav",
      value: function toggleNav(e) {
        document.body.classList.toggle(TOGGLE_CLASS);
        document.body.classList.toggle('lock');
        e.preventDefault();
      }
    }]);

    return ToggleNav;
  }();

  new ToggleNav();

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var simpleLightbox_modules = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var SimpleLightbox = /*#__PURE__*/function () {
    function SimpleLightbox(elements, options) {
      var _this = this;

      _classCallCheck(this, SimpleLightbox);

      _defineProperty(this, "defaultOptions", {
        sourceAttr: 'href',
        overlay: true,
        spinner: true,
        nav: true,
        navText: ['&lsaquo;', '&rsaquo;'],
        captions: true,
        captionDelay: 0,
        captionSelector: 'img',
        captionType: 'attr',
        captionsData: 'title',
        captionPosition: 'bottom',
        captionClass: '',
        close: true,
        closeText: '&times;',
        swipeClose: true,
        showCounter: true,
        fileExt: 'png|jpg|jpeg|gif|webp',
        animationSlide: true,
        animationSpeed: 250,
        preloading: true,
        enableKeyboard: true,
        loop: true,
        rel: false,
        docClose: true,
        swipeTolerance: 50,
        className: 'simple-lightbox',
        widthRatio: 0.8,
        heightRatio: 0.9,
        scaleImageToRatio: false,
        disableRightClick: false,
        disableScroll: true,
        alertError: true,
        alertErrorMessage: 'Image not found, next image will be loaded',
        additionalHtml: false,
        history: true,
        throttleInterval: 0,
        doubleTapZoom: 2,
        maxZoom: 10,
        htmlClass: 'has-lightbox',
        rtl: false,
        fixedClass: 'sl-fixed',
        fadeSpeed: 300,
        uniqueImages: true,
        focus: true,
        scrollZoom: true,
        scrollZoomFactor: 0.5
      });

      _defineProperty(this, "transitionPrefix", void 0);

      _defineProperty(this, "isPassiveEventsSupported", void 0);

      _defineProperty(this, "transitionCapable", false);

      _defineProperty(this, "isTouchDevice", 'ontouchstart' in window);

      _defineProperty(this, "isAppleDevice", /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform));

      _defineProperty(this, "initialLocationHash", void 0);

      _defineProperty(this, "pushStateSupport", 'pushState' in history);

      _defineProperty(this, "isOpen", false);

      _defineProperty(this, "isAnimating", false);

      _defineProperty(this, "isClosing", false);

      _defineProperty(this, "isFadeIn", false);

      _defineProperty(this, "urlChangedOnce", false);

      _defineProperty(this, "hashReseted", false);

      _defineProperty(this, "historyHasChanges", false);

      _defineProperty(this, "historyUpdateTimeout", null);

      _defineProperty(this, "currentImage", void 0);

      _defineProperty(this, "eventNamespace", 'simplelightbox');

      _defineProperty(this, "domNodes", {});

      _defineProperty(this, "loadedImages", []);

      _defineProperty(this, "initialImageIndex", 0);

      _defineProperty(this, "currentImageIndex", 0);

      _defineProperty(this, "initialSelector", null);

      _defineProperty(this, "globalScrollbarWidth", 0);

      _defineProperty(this, "controlCoordinates", {
        swipeDiff: 0,
        swipeYDiff: 0,
        swipeStart: 0,
        swipeEnd: 0,
        swipeYStart: 0,
        swipeYEnd: 0,
        mousedown: false,
        imageLeft: 0,
        zoomed: false,
        containerHeight: 0,
        containerWidth: 0,
        containerOffsetX: 0,
        containerOffsetY: 0,
        imgHeight: 0,
        imgWidth: 0,
        capture: false,
        initialOffsetX: 0,
        initialOffsetY: 0,
        initialPointerOffsetX: 0,
        initialPointerOffsetY: 0,
        initialPointerOffsetX2: 0,
        initialPointerOffsetY2: 0,
        initialScale: 1,
        initialPinchDistance: 0,
        pointerOffsetX: 0,
        pointerOffsetY: 0,
        pointerOffsetX2: 0,
        pointerOffsetY2: 0,
        targetOffsetX: 0,
        targetOffsetY: 0,
        targetScale: 0,
        pinchOffsetX: 0,
        pinchOffsetY: 0,
        limitOffsetX: 0,
        limitOffsetY: 0,
        scaleDifference: 0,
        targetPinchDistance: 0,
        touchCount: 0,
        doubleTapped: false,
        touchmoveCount: 0
      });

      this.options = Object.assign(this.defaultOptions, options);
      this.isPassiveEventsSupported = this.checkPassiveEventsSupport();

      if (typeof elements === 'string') {
        this.initialSelector = elements;
        this.elements = Array.from(document.querySelectorAll(elements));
      } else {
        this.elements = typeof elements.length !== 'undefined' && elements.length > 0 ? Array.from(elements) : [elements];
      }

      this.relatedElements = [];
      this.transitionPrefix = this.calculateTransitionPrefix();
      this.transitionCapable = this.transitionPrefix !== false;
      this.initialLocationHash = this.hash; // this should be handled by attribute selector IMHO! => 'a[rel=bla]'...

      if (this.options.rel) {
        this.elements = this.getRelated(this.options.rel);
      }

      if (this.options.uniqueImages) {
        var imgArr = [];
        this.elements = Array.from(this.elements).filter(function (element) {
          var src = element.getAttribute(_this.options.sourceAttr);

          if (imgArr.indexOf(src) === -1) {
            imgArr.push(src);
            return true;
          }

          return false;
        });
      }

      this.createDomNodes();

      if (this.options.close) {
        this.domNodes.wrapper.appendChild(this.domNodes.closeButton);
      }

      if (this.options.nav) {
        this.domNodes.wrapper.appendChild(this.domNodes.navigation);
      }

      if (this.options.spinner) {
        this.domNodes.wrapper.appendChild(this.domNodes.spinner);
      }

      this.addEventListener(this.elements, 'click.' + this.eventNamespace, function (event) {
        if (_this.isValidLink(event.currentTarget)) {
          event.preventDefault();

          if (_this.isAnimating) {
            return false;
          }

          _this.initialImageIndex = _this.elements.indexOf(event.currentTarget);

          _this.openImage(event.currentTarget);
        }
      }); // close addEventListener click addEventListener doc

      if (this.options.docClose) {
        this.addEventListener(this.domNodes.wrapper, ['click.' + this.eventNamespace, 'touchstart.' + this.eventNamespace], function (event) {
          if (_this.isOpen && event.target === event.currentTarget) {
            _this.close();
          }
        });
      } // disable rightclick


      if (this.options.disableRightClick) {
        this.addEventListener(document.body, 'contextmenu.' + this.eventNamespace, function (event) {
          if (event.target.parentElement.classList.contains("sl-image")) {
            event.preventDefault();
          }
        });
      } // keyboard-control


      if (this.options.enableKeyboard) {
        this.addEventListener(document.body, 'keyup.' + this.eventNamespace, this.throttle(function (event) {
          _this.controlCoordinates.swipeDiff = 0; // keyboard control only if lightbox is open

          if (_this.isAnimating && event.key === 'Escape') {
            _this.currentImage.setAttribute('src', '');

            _this.isAnimating = false;
            return _this.close();
          }

          if (_this.isOpen) {
            event.preventDefault();

            if (event.key === 'Escape') {
              _this.close();
            }

            if (!_this.isAnimating && ['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1) {
              _this.loadImage(event.key === 'ArrowRight' ? 1 : -1);
            }
          }
        }, this.options.throttleInterval));
      }

      this.addEvents();
    }

    _createClass(SimpleLightbox, [{
      key: "checkPassiveEventsSupport",
      value: function checkPassiveEventsSupport() {
        // https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
        // Test via a getter in the options object to see if the passive property is accessed
        var supportsPassive = false;

        try {
          var opts = Object.defineProperty({}, 'passive', {
            get: function get() {
              supportsPassive = true;
            }
          });
          window.addEventListener("testPassive", null, opts);
          window.removeEventListener("testPassive", null, opts);
        } catch (e) {}

        return supportsPassive;
      }
    }, {
      key: "createDomNodes",
      value: function createDomNodes() {
        this.domNodes.overlay = document.createElement('div');
        this.domNodes.overlay.classList.add('sl-overlay');
        this.domNodes.overlay.dataset.opacityTarget = ".7";
        this.domNodes.closeButton = document.createElement('button');
        this.domNodes.closeButton.classList.add('sl-close');
        this.domNodes.closeButton.innerHTML = this.options.closeText;
        this.domNodes.spinner = document.createElement('div');
        this.domNodes.spinner.classList.add('sl-spinner');
        this.domNodes.spinner.innerHTML = '<div></div>';
        this.domNodes.navigation = document.createElement('div');
        this.domNodes.navigation.classList.add('sl-navigation');
        this.domNodes.navigation.innerHTML = "<button class=\"sl-prev\">".concat(this.options.navText[0], "</button><button class=\"sl-next\">").concat(this.options.navText[1], "</button>");
        this.domNodes.counter = document.createElement('div');
        this.domNodes.counter.classList.add('sl-counter');
        this.domNodes.counter.innerHTML = '<span class="sl-current"></span>/<span class="sl-total"></span>';
        this.domNodes.caption = document.createElement('div');
        this.domNodes.caption.classList.add('sl-caption', 'pos-' + this.options.captionPosition);

        if (this.options.captionClass) {
          this.domNodes.caption.classList.add(this.options.captionClass);
        }

        this.domNodes.image = document.createElement('div');
        this.domNodes.image.classList.add('sl-image');
        this.domNodes.wrapper = document.createElement('div');
        this.domNodes.wrapper.classList.add('sl-wrapper');
        this.domNodes.wrapper.setAttribute('tabindex', -1);
        this.domNodes.wrapper.setAttribute('role', 'dialog');
        this.domNodes.wrapper.setAttribute('aria-hidden', false);

        if (this.options.className) {
          this.domNodes.wrapper.classList.add(this.options.className);
        }

        if (this.options.rtl) {
          this.domNodes.wrapper.classList.add('sl-dir-rtl');
        }
      }
    }, {
      key: "throttle",
      value: function throttle(func, limit) {
        var inThrottle;
        return function () {
          if (!inThrottle) {
            func.apply(this, arguments);
            inThrottle = true;
            setTimeout(function () {
              return inThrottle = false;
            }, limit);
          }
        };
      }
    }, {
      key: "isValidLink",
      value: function isValidLink(element) {
        return !this.options.fileExt || element.getAttribute(this.options.sourceAttr) && new RegExp('(' + this.options.fileExt + ')$', 'i').test(element.getAttribute(this.options.sourceAttr));
      }
    }, {
      key: "calculateTransitionPrefix",
      value: function calculateTransitionPrefix() {
        var s = (document.body || document.documentElement).style;
        return 'transition' in s ? '' : 'WebkitTransition' in s ? '-webkit-' : 'MozTransition' in s ? '-moz-' : 'OTransition' in s ? '-o' : false;
      }
    }, {
      key: "toggleScrollbar",
      value: function toggleScrollbar(type) {
        var scrollbarWidth = 0;
        var fixedElements = [].slice.call(document.querySelectorAll('.' + this.options.fixedClass));

        if (type === 'hide') {
          var fullWindowWidth = window.innerWidth;

          if (!fullWindowWidth) {
            var documentElementRect = document.documentElement.getBoundingClientRect();
            fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
          }

          if (document.body.clientWidth < fullWindowWidth || this.isAppleDevice) {
            var scrollDiv = document.createElement('div'),
                paddingRight = parseInt(document.body.style.paddingRight || 0, 10);
            scrollDiv.classList.add('sl-scrollbar-measure');
            document.body.appendChild(scrollDiv);
            scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            document.body.dataset.originalPaddingRight = paddingRight;

            if (scrollbarWidth > 0 || scrollbarWidth == 0 && this.isAppleDevice) {
              document.body.classList.add('hidden-scroll');
              document.body.style.paddingRight = paddingRight + scrollbarWidth + 'px';
              fixedElements.forEach(function (element) {
                var actualPadding = element.style.paddingRight;
                var calculatedPadding = window.getComputedStyle(element)['padding-right'];
                element.dataset.originalPaddingRight = actualPadding;
                element.style.paddingRight = "".concat(parseFloat(calculatedPadding) + scrollbarWidth, "px");
              });
            }
          }
        } else {
          document.body.classList.remove('hidden-scroll');
          document.body.style.paddingRight = document.body.dataset.originalPaddingRight;
          fixedElements.forEach(function (element) {
            var padding = element.dataset.originalPaddingRight;

            if (typeof padding !== 'undefined') {
              element.style.paddingRight = padding;
            }
          });
        }

        return scrollbarWidth;
      }
    }, {
      key: "close",
      value: function close() {
        var _this2 = this;

        if (!this.isOpen || this.isAnimating || this.isClosing) {
          return false;
        }

        this.isClosing = true;
        var element = this.relatedElements[this.currentImageIndex];
        element.dispatchEvent(new Event('close.simplelightbox'));

        if (this.options.history) {
          this.historyHasChanges = false;

          if (!this.hashReseted) {
            this.resetHash();
          }
        }

        this.removeEventListener(document, 'focusin.' + this.eventNamespace);
        this.fadeOut(document.querySelectorAll('.sl-image img, .sl-overlay, .sl-close, .sl-navigation, .sl-image .sl-caption, .sl-counter'), this.options.fadeSpeed, function () {
          if (_this2.options.disableScroll) {
            _this2.toggleScrollbar('show');
          }

          if (_this2.options.htmlClass && _this2.options.htmlClass !== '') {
            document.querySelector('html').classList.remove(_this2.options.htmlClass);
          }

          document.body.removeChild(_this2.domNodes.wrapper);
          document.body.removeChild(_this2.domNodes.overlay);
          _this2.domNodes.additionalHtml = null;
          element.dispatchEvent(new Event('closed.simplelightbox'));
          _this2.isClosing = false;
        });
        this.currentImage = null;
        this.isOpen = false;
        this.isAnimating = false; // reset touchcontrol coordinates

        for (var key in this.controlCoordinates) {
          this.controlCoordinates[key] = 0;
        }

        this.controlCoordinates.mousedown = false;
        this.controlCoordinates.zoomed = false;
        this.controlCoordinates.capture = false;
        this.controlCoordinates.initialScale = this.minMax(1, 1, this.options.maxZoom);
        this.controlCoordinates.doubleTapped = false;
      }
    }, {
      key: "hash",
      get: function get() {
        return window.location.hash.substring(1);
      }
    }, {
      key: "preload",
      value: function preload() {
        var _this3 = this;

        var index = this.currentImageIndex,
            length = this.relatedElements.length,
            next = index + 1 < 0 ? length - 1 : index + 1 >= length - 1 ? 0 : index + 1,
            prev = index - 1 < 0 ? length - 1 : index - 1 >= length - 1 ? 0 : index - 1,
            nextImage = new Image(),
            prevImage = new Image();
        nextImage.addEventListener('load', function (event) {
          var src = event.target.getAttribute('src');

          if (_this3.loadedImages.indexOf(src) === -1) {
            //is this condition even required... setting multiple times will not change usage...
            _this3.loadedImages.push(src);
          }

          _this3.relatedElements[index].dispatchEvent(new Event('nextImageLoaded.' + _this3.eventNamespace));
        });
        nextImage.setAttribute('src', this.relatedElements[next].getAttribute(this.options.sourceAttr));
        prevImage.addEventListener('load', function (event) {
          var src = event.target.getAttribute('src');

          if (_this3.loadedImages.indexOf(src) === -1) {
            _this3.loadedImages.push(src);
          }

          _this3.relatedElements[index].dispatchEvent(new Event('prevImageLoaded.' + _this3.eventNamespace));
        });
        prevImage.setAttribute('src', this.relatedElements[prev].getAttribute(this.options.sourceAttr));
      }
    }, {
      key: "loadImage",
      value: function loadImage(direction) {
        var _this4 = this;

        var slideDirection = direction;

        if (this.options.rtl) {
          direction = -direction;
        }

        this.relatedElements[this.currentImageIndex].dispatchEvent(new Event('change.' + this.eventNamespace));
        this.relatedElements[this.currentImageIndex].dispatchEvent(new Event((direction === 1 ? 'next' : 'prev') + '.' + this.eventNamespace));
        var newIndex = this.currentImageIndex + direction;

        if (this.isAnimating || (newIndex < 0 || newIndex >= this.relatedElements.length) && this.options.loop === false) {
          return false;
        }

        this.currentImageIndex = newIndex < 0 ? this.relatedElements.length - 1 : newIndex > this.relatedElements.length - 1 ? 0 : newIndex;
        this.domNodes.counter.querySelector('.sl-current').innerHTML = this.currentImageIndex + 1;

        if (this.options.animationSlide) {
          this.slide(this.options.animationSpeed / 1000, -100 * slideDirection - this.controlCoordinates.swipeDiff + 'px');
        }

        this.fadeOut(this.domNodes.image, this.options.fadeSpeed, function () {
          _this4.isAnimating = true;

          if (!_this4.isClosing) {
            setTimeout(function () {
              var element = _this4.relatedElements[_this4.currentImageIndex];

              _this4.currentImage.setAttribute('src', element.getAttribute(_this4.options.sourceAttr));

              if (_this4.loadedImages.indexOf(element.getAttribute(_this4.options.sourceAttr)) === -1) {
                _this4.show(_this4.domNodes.spinner);
              }

              if (_this4.domNodes.image.contains(_this4.domNodes.caption)) {
                _this4.domNodes.image.removeChild(_this4.domNodes.caption);
              }

              _this4.adjustImage(slideDirection);

              if (_this4.options.preloading) _this4.preload();
            }, 100);
          } else {
            _this4.isAnimating = false;
          }
        });
      }
    }, {
      key: "adjustImage",
      value: function adjustImage(direction) {
        var _this5 = this;

        if (!this.currentImage) {
          return false;
        }

        var tmpImage = new Image(),
            windowWidth = window.innerWidth * this.options.widthRatio,
            windowHeight = window.innerHeight * this.options.heightRatio;
        tmpImage.setAttribute('src', this.currentImage.getAttribute('src'));
        this.currentImage.dataset.scale = 1;
        this.currentImage.dataset.translateX = 0;
        this.currentImage.dataset.translateY = 0;
        this.zoomPanElement(0, 0, 1);
        tmpImage.addEventListener('error', function (event) {
          _this5.relatedElements[_this5.currentImageIndex].dispatchEvent(new Event('error.' + _this5.eventNamespace));

          _this5.isAnimating = false;
          _this5.isOpen = true;
          _this5.domNodes.spinner.style.display = 'none';
          var dirIsDefined = direction === 1 || direction === -1;

          if (_this5.initialImageIndex === _this5.currentImageIndex && dirIsDefined) {
            return _this5.close();
          }

          if (_this5.options.alertError) {
            alert(_this5.options.alertErrorMessage);
          }

          _this5.loadImage(dirIsDefined ? direction : 1);
        });
        tmpImage.addEventListener('load', function (event) {
          if (typeof direction !== 'undefined') {
            _this5.relatedElements[_this5.currentImageIndex].dispatchEvent(new Event('changed.' + _this5.eventNamespace));

            _this5.relatedElements[_this5.currentImageIndex].dispatchEvent(new Event((direction === 1 ? 'nextDone' : 'prevDone') + '.' + _this5.eventNamespace));
          } // history


          if (_this5.options.history) {
            _this5.updateURL();
          }

          if (_this5.loadedImages.indexOf(_this5.currentImage.getAttribute('src')) === -1) {
            _this5.loadedImages.push(_this5.currentImage.getAttribute('src'));
          }

          var imageWidth = event.target.width,
              imageHeight = event.target.height;

          if (_this5.options.scaleImageToRatio || imageWidth > windowWidth || imageHeight > windowHeight) {
            var ratio = imageWidth / imageHeight > windowWidth / windowHeight ? imageWidth / windowWidth : imageHeight / windowHeight;
            imageWidth /= ratio;
            imageHeight /= ratio;
          }

          _this5.domNodes.image.style.top = (window.innerHeight - imageHeight) / 2 + 'px';
          _this5.domNodes.image.style.left = (window.innerWidth - imageWidth - _this5.globalScrollbarWidth) / 2 + 'px';
          _this5.domNodes.image.style.width = imageWidth + 'px';
          _this5.domNodes.image.style.height = imageHeight + 'px';
          _this5.domNodes.spinner.style.display = 'none';

          if (_this5.options.focus) {
            _this5.forceFocus();
          }

          _this5.fadeIn(_this5.currentImage, _this5.options.fadeSpeed, function () {
            if (_this5.options.focus) {
              _this5.domNodes.wrapper.focus();
            }
          });

          _this5.isOpen = true;
          var captionContainer, captionText;

          if (typeof _this5.options.captionSelector === 'string') {
            captionContainer = _this5.options.captionSelector === 'self' ? _this5.relatedElements[_this5.currentImageIndex] : _this5.relatedElements[_this5.currentImageIndex].querySelector(_this5.options.captionSelector);
          } else if (typeof _this5.options.captionSelector === 'function') {
            captionContainer = _this5.options.captionSelector(_this5.relatedElements[_this5.currentImageIndex]);
          }

          if (_this5.options.captions && captionContainer) {
            if (_this5.options.captionType === 'data') {
              captionText = captionContainer.dataset[_this5.options.captionsData];
            } else if (_this5.options.captionType === 'text') {
              captionText = captionContainer.innerHTML;
            } else {
              captionText = captionContainer.getAttribute(_this5.options.captionsData);
            }
          }

          if (!_this5.options.loop) {
            if (_this5.currentImageIndex === 0) {
              _this5.hide(_this5.domNodes.navigation.querySelector('.sl-prev'));
            }

            if (_this5.currentImageIndex >= _this5.relatedElements.length - 1) {
              _this5.hide(_this5.domNodes.navigation.querySelector('.sl-next'));
            }

            if (_this5.currentImageIndex > 0) {
              _this5.show(_this5.domNodes.navigation.querySelector('.sl-prev'));
            }

            if (_this5.currentImageIndex < _this5.relatedElements.length - 1) {
              _this5.show(_this5.domNodes.navigation.querySelector('.sl-next'));
            }
          } else {
            if (_this5.relatedElements.length === 1) {
              _this5.hide(_this5.domNodes.navigation.querySelectorAll('.sl-prev, .sl-next'));
            } else {
              _this5.show(_this5.domNodes.navigation.querySelectorAll('.sl-prev, .sl-next'));
            }
          }

          if (direction === 1 || direction === -1) {
            if (_this5.options.animationSlide) {
              _this5.slide(0, 100 * direction + 'px');

              setTimeout(function () {
                _this5.slide(_this5.options.animationSpeed / 1000, 0 + 'px');
              }, 50);
            }

            _this5.fadeIn(_this5.domNodes.image, _this5.options.fadeSpeed, function () {
              _this5.isAnimating = false;

              _this5.setCaption(captionText, imageWidth);
            });
          } else {
            _this5.isAnimating = false;

            _this5.setCaption(captionText, imageWidth);
          }

          if (_this5.options.additionalHtml && !_this5.domNodes.additionalHtml) {
            _this5.domNodes.additionalHtml = document.createElement('div');

            _this5.domNodes.additionalHtml.classList.add('sl-additional-html');

            _this5.domNodes.additionalHtml.innerHTML = _this5.options.additionalHtml;

            _this5.domNodes.image.appendChild(_this5.domNodes.additionalHtml);
          }
        });
      }
    }, {
      key: "zoomPanElement",
      value: function zoomPanElement(targetOffsetX, targetOffsetY, targetScale) {
        this.currentImage.style[this.transitionPrefix + 'transform'] = 'translate(' + targetOffsetX + ',' + targetOffsetY + ') scale(' + targetScale + ')';
      }
    }, {
      key: "minMax",
      value: function minMax(value, min, max) {
        return value < min ? min : value > max ? max : value;
      }
    }, {
      key: "setZoomData",
      value: function setZoomData(initialScale, targetOffsetX, targetOffsetY) {
        this.currentImage.dataset.scale = initialScale;
        this.currentImage.dataset.translateX = targetOffsetX;
        this.currentImage.dataset.translateY = targetOffsetY;
      }
    }, {
      key: "hashchangeHandler",
      value: function hashchangeHandler() {
        if (this.isOpen && this.hash === this.initialLocationHash) {
          this.hashReseted = true;
          this.close();
        }
      }
    }, {
      key: "addEvents",
      value: function addEvents() {
        var _this6 = this;

        // resize/responsive
        this.addEventListener(window, 'resize.' + this.eventNamespace, function (event) {
          //this.adjustImage.bind(this)
          if (_this6.isOpen) {
            _this6.adjustImage();
          }
        });
        this.addEventListener(this.domNodes.closeButton, ['click.' + this.eventNamespace, 'touchstart.' + this.eventNamespace], this.close.bind(this));

        if (this.options.history) {
          setTimeout(function () {
            _this6.addEventListener(window, 'hashchange.' + _this6.eventNamespace, function (event) {
              if (_this6.isOpen) {
                _this6.hashchangeHandler();
              }
            });
          }, 40);
        }

        this.addEventListener(this.domNodes.navigation.getElementsByTagName('button'), 'click.' + this.eventNamespace, function (event) {
          if (!event.currentTarget.tagName.match(/button/i)) {
            return true;
          }

          event.preventDefault();
          _this6.controlCoordinates.swipeDiff = 0;

          _this6.loadImage(event.currentTarget.classList.contains('sl-next') ? 1 : -1);
        });

        if (this.options.scrollZoom) {
          var scale = 1;
          this.addEventListener(this.domNodes.image, ['mousewheel', 'DOMMouseScroll'], function (event) {
            if (_this6.controlCoordinates.mousedown || _this6.isAnimating || _this6.isClosing || !_this6.isOpen) {
              return true;
            }

            if (_this6.controlCoordinates.containerHeight == 0) {
              _this6.controlCoordinates.containerHeight = _this6.getDimensions(_this6.domNodes.image).height;
              _this6.controlCoordinates.containerWidth = _this6.getDimensions(_this6.domNodes.image).width;
              _this6.controlCoordinates.imgHeight = _this6.getDimensions(_this6.currentImage).height;
              _this6.controlCoordinates.imgWidth = _this6.getDimensions(_this6.currentImage).width;
              _this6.controlCoordinates.containerOffsetX = _this6.domNodes.image.offsetLeft;
              _this6.controlCoordinates.containerOffsetY = _this6.domNodes.image.offsetTop;
              _this6.controlCoordinates.initialOffsetX = parseFloat(_this6.currentImage.dataset.translateX);
              _this6.controlCoordinates.initialOffsetY = parseFloat(_this6.currentImage.dataset.translateY);
            }

            event.preventDefault();
            var delta = event.delta || event.wheelDelta;

            if (delta === undefined) {
              //we are on firefox
              delta = event.detail;
            }

            delta = Math.max(-1, Math.min(1, delta)); // cap the delta to [-1,1] for cross browser consistency
            // apply zoom

            scale += delta * _this6.options.scrollZoomFactor * scale;
            scale = Math.max(1, Math.min(_this6.options.maxZoom, scale));
            _this6.controlCoordinates.targetScale = scale;
            _this6.controlCoordinates.pinchOffsetX = event.pageX;
            _this6.controlCoordinates.pinchOffsetY = event.pageY;
            _this6.controlCoordinates.limitOffsetX = (_this6.controlCoordinates.imgWidth * _this6.controlCoordinates.targetScale - _this6.controlCoordinates.containerWidth) / 2;
            _this6.controlCoordinates.limitOffsetY = (_this6.controlCoordinates.imgHeight * _this6.controlCoordinates.targetScale - _this6.controlCoordinates.containerHeight) / 2;
            _this6.controlCoordinates.scaleDifference = _this6.controlCoordinates.targetScale - _this6.controlCoordinates.initialScale;
            _this6.controlCoordinates.targetOffsetX = _this6.controlCoordinates.imgWidth * _this6.controlCoordinates.targetScale <= _this6.controlCoordinates.containerWidth ? 0 : _this6.minMax(_this6.controlCoordinates.initialOffsetX - (_this6.controlCoordinates.pinchOffsetX - _this6.controlCoordinates.containerOffsetX - _this6.controlCoordinates.containerWidth / 2 - _this6.controlCoordinates.initialOffsetX) / (_this6.controlCoordinates.targetScale - _this6.controlCoordinates.scaleDifference) * _this6.controlCoordinates.scaleDifference, _this6.controlCoordinates.limitOffsetX * -1, _this6.controlCoordinates.limitOffsetX);
            _this6.controlCoordinates.targetOffsetY = _this6.controlCoordinates.imgHeight * _this6.controlCoordinates.targetScale <= _this6.controlCoordinates.containerHeight ? 0 : _this6.minMax(_this6.controlCoordinates.initialOffsetY - (_this6.controlCoordinates.pinchOffsetY - _this6.controlCoordinates.containerOffsetY - _this6.controlCoordinates.containerHeight / 2 - _this6.controlCoordinates.initialOffsetY) / (_this6.controlCoordinates.targetScale - _this6.controlCoordinates.scaleDifference) * _this6.controlCoordinates.scaleDifference, _this6.controlCoordinates.limitOffsetY * -1, _this6.controlCoordinates.limitOffsetY);

            _this6.zoomPanElement(_this6.controlCoordinates.targetOffsetX + "px", _this6.controlCoordinates.targetOffsetY + "px", _this6.controlCoordinates.targetScale);

            if (_this6.controlCoordinates.targetScale > 1) {
              _this6.controlCoordinates.zoomed = true;

              if (!_this6.domNodes.caption.style.opacity && _this6.domNodes.caption.style.display !== 'none') {
                _this6.fadeOut(_this6.domNodes.caption, _this6.options.fadeSpeed);
              }
            } else {
              if (_this6.controlCoordinates.initialScale === 1) {
                _this6.controlCoordinates.zoomed = false;

                if (_this6.domNodes.caption.style.display === 'none') {
                  _this6.fadeIn(_this6.domNodes.caption, _this6.options.fadeSpeed);
                }
              }

              _this6.controlCoordinates.initialPinchDistance = null;
              _this6.controlCoordinates.capture = false;
            }

            _this6.controlCoordinates.initialPinchDistance = _this6.controlCoordinates.targetPinchDistance;
            _this6.controlCoordinates.initialScale = _this6.controlCoordinates.targetScale;
            _this6.controlCoordinates.initialOffsetX = _this6.controlCoordinates.targetOffsetX;
            _this6.controlCoordinates.initialOffsetY = _this6.controlCoordinates.targetOffsetY;

            _this6.setZoomData(_this6.controlCoordinates.targetScale, _this6.controlCoordinates.targetOffsetX, _this6.controlCoordinates.targetOffsetY);

            _this6.zoomPanElement(_this6.controlCoordinates.targetOffsetX + "px", _this6.controlCoordinates.targetOffsetY + "px", _this6.controlCoordinates.targetScale);
          });
        }

        this.addEventListener(this.domNodes.image, ['touchstart.' + this.eventNamespace, 'mousedown.' + this.eventNamespace], function (event) {
          if (event.target.tagName === 'A' && event.type === 'touchstart') {
            return true;
          }

          if (event.type === 'mousedown') {
            event.preventDefault();
            _this6.controlCoordinates.initialPointerOffsetX = event.clientX;
            _this6.controlCoordinates.initialPointerOffsetY = event.clientY;
            _this6.controlCoordinates.containerHeight = _this6.getDimensions(_this6.domNodes.image).height;
            _this6.controlCoordinates.containerWidth = _this6.getDimensions(_this6.domNodes.image).width;
            _this6.controlCoordinates.imgHeight = _this6.getDimensions(_this6.currentImage).height;
            _this6.controlCoordinates.imgWidth = _this6.getDimensions(_this6.currentImage).width;
            _this6.controlCoordinates.containerOffsetX = _this6.domNodes.image.offsetLeft;
            _this6.controlCoordinates.containerOffsetY = _this6.domNodes.image.offsetTop;
            _this6.controlCoordinates.initialOffsetX = parseFloat(_this6.currentImage.dataset.translateX);
            _this6.controlCoordinates.initialOffsetY = parseFloat(_this6.currentImage.dataset.translateY);
            _this6.controlCoordinates.capture = true;
          } else {
            _this6.controlCoordinates.touchCount = event.touches.length;
            _this6.controlCoordinates.initialPointerOffsetX = event.touches[0].clientX;
            _this6.controlCoordinates.initialPointerOffsetY = event.touches[0].clientY;
            _this6.controlCoordinates.containerHeight = _this6.getDimensions(_this6.domNodes.image).height;
            _this6.controlCoordinates.containerWidth = _this6.getDimensions(_this6.domNodes.image).width;
            _this6.controlCoordinates.imgHeight = _this6.getDimensions(_this6.currentImage).height;
            _this6.controlCoordinates.imgWidth = _this6.getDimensions(_this6.currentImage).width;
            _this6.controlCoordinates.containerOffsetX = _this6.domNodes.image.offsetLeft;
            _this6.controlCoordinates.containerOffsetY = _this6.domNodes.image.offsetTop;

            if (_this6.controlCoordinates.touchCount === 1)
              /* Single touch */
              {
                if (!_this6.controlCoordinates.doubleTapped) {
                  _this6.controlCoordinates.doubleTapped = true;
                  setTimeout(function () {
                    _this6.controlCoordinates.doubleTapped = false;
                  }, 300);
                } else {
                  _this6.currentImage.classList.add('sl-transition');

                  if (!_this6.controlCoordinates.zoomed) {
                    _this6.controlCoordinates.initialScale = _this6.options.doubleTapZoom;

                    _this6.setZoomData(_this6.controlCoordinates.initialScale, 0, 0);

                    _this6.zoomPanElement(0 + "px", 0 + "px", _this6.controlCoordinates.initialScale);

                    if (!_this6.domNodes.caption.style.opacity && _this6.domNodes.caption.style.display !== 'none') {
                      _this6.fadeOut(_this6.domNodes.caption, _this6.options.fadeSpeed);
                    }

                    _this6.controlCoordinates.zoomed = true;
                  } else {
                    _this6.controlCoordinates.initialScale = 1;

                    _this6.setZoomData(_this6.controlCoordinates.initialScale, 0, 0);

                    _this6.zoomPanElement(0 + "px", 0 + "px", _this6.controlCoordinates.initialScale);

                    _this6.controlCoordinates.zoomed = false;
                  }

                  setTimeout(function () {
                    if (_this6.currentImage) {
                      _this6.currentImage.classList.remove('sl-transition');
                    }
                  }, 200);
                  return false;
                }

                _this6.controlCoordinates.initialOffsetX = parseFloat(_this6.currentImage.dataset.translateX);
                _this6.controlCoordinates.initialOffsetY = parseFloat(_this6.currentImage.dataset.translateY);
              } else if (_this6.controlCoordinates.touchCount === 2)
              /* Pinch */
              {
                _this6.controlCoordinates.initialPointerOffsetX2 = event.touches[1].clientX;
                _this6.controlCoordinates.initialPointerOffsetY2 = event.touches[1].clientY;
                _this6.controlCoordinates.initialOffsetX = parseFloat(_this6.currentImage.dataset.translateX);
                _this6.controlCoordinates.initialOffsetY = parseFloat(_this6.currentImage.dataset.translateY);
                _this6.controlCoordinates.pinchOffsetX = (_this6.controlCoordinates.initialPointerOffsetX + _this6.controlCoordinates.initialPointerOffsetX2) / 2;
                _this6.controlCoordinates.pinchOffsetY = (_this6.controlCoordinates.initialPointerOffsetY + _this6.controlCoordinates.initialPointerOffsetY2) / 2;
                _this6.controlCoordinates.initialPinchDistance = Math.sqrt((_this6.controlCoordinates.initialPointerOffsetX - _this6.controlCoordinates.initialPointerOffsetX2) * (_this6.controlCoordinates.initialPointerOffsetX - _this6.controlCoordinates.initialPointerOffsetX2) + (_this6.controlCoordinates.initialPointerOffsetY - _this6.controlCoordinates.initialPointerOffsetY2) * (_this6.controlCoordinates.initialPointerOffsetY - _this6.controlCoordinates.initialPointerOffsetY2));
              }

            _this6.controlCoordinates.capture = true;
          }

          if (_this6.controlCoordinates.mousedown) return true;

          if (_this6.transitionCapable) {
            _this6.controlCoordinates.imageLeft = parseInt(_this6.domNodes.image.style.left, 10);
          }

          _this6.controlCoordinates.mousedown = true;
          _this6.controlCoordinates.swipeDiff = 0;
          _this6.controlCoordinates.swipeYDiff = 0;
          _this6.controlCoordinates.swipeStart = event.pageX || event.touches[0].pageX;
          _this6.controlCoordinates.swipeYStart = event.pageY || event.touches[0].pageY;
          return false;
        });
        this.addEventListener(this.domNodes.image, ['touchmove.' + this.eventNamespace, 'mousemove.' + this.eventNamespace, 'MSPointerMove'], function (event) {
          if (!_this6.controlCoordinates.mousedown) {
            return true;
          }

          if (event.type === 'touchmove') {
            if (_this6.controlCoordinates.capture === false) {
              return false;
            }

            _this6.controlCoordinates.pointerOffsetX = event.touches[0].clientX;
            _this6.controlCoordinates.pointerOffsetY = event.touches[0].clientY;
            _this6.controlCoordinates.touchCount = event.touches.length;
            _this6.controlCoordinates.touchmoveCount++;

            if (_this6.controlCoordinates.touchCount > 1)
              /* Pinch */
              {
                _this6.controlCoordinates.pointerOffsetX2 = event.touches[1].clientX;
                _this6.controlCoordinates.pointerOffsetY2 = event.touches[1].clientY;
                _this6.controlCoordinates.targetPinchDistance = Math.sqrt((_this6.controlCoordinates.pointerOffsetX - _this6.controlCoordinates.pointerOffsetX2) * (_this6.controlCoordinates.pointerOffsetX - _this6.controlCoordinates.pointerOffsetX2) + (_this6.controlCoordinates.pointerOffsetY - _this6.controlCoordinates.pointerOffsetY2) * (_this6.controlCoordinates.pointerOffsetY - _this6.controlCoordinates.pointerOffsetY2));

                if (_this6.controlCoordinates.initialPinchDistance === null) {
                  _this6.controlCoordinates.initialPinchDistance = _this6.controlCoordinates.targetPinchDistance;
                }

                if (Math.abs(_this6.controlCoordinates.initialPinchDistance - _this6.controlCoordinates.targetPinchDistance) >= 1) {
                  /* Initialize helpers */
                  _this6.controlCoordinates.targetScale = _this6.minMax(_this6.controlCoordinates.targetPinchDistance / _this6.controlCoordinates.initialPinchDistance * _this6.controlCoordinates.initialScale, 1, _this6.options.maxZoom);
                  _this6.controlCoordinates.limitOffsetX = (_this6.controlCoordinates.imgWidth * _this6.controlCoordinates.targetScale - _this6.controlCoordinates.containerWidth) / 2;
                  _this6.controlCoordinates.limitOffsetY = (_this6.controlCoordinates.imgHeight * _this6.controlCoordinates.targetScale - _this6.controlCoordinates.containerHeight) / 2;
                  _this6.controlCoordinates.scaleDifference = _this6.controlCoordinates.targetScale - _this6.controlCoordinates.initialScale;
                  _this6.controlCoordinates.targetOffsetX = _this6.controlCoordinates.imgWidth * _this6.controlCoordinates.targetScale <= _this6.controlCoordinates.containerWidth ? 0 : _this6.minMax(_this6.controlCoordinates.initialOffsetX - (_this6.controlCoordinates.pinchOffsetX - _this6.controlCoordinates.containerOffsetX - _this6.controlCoordinates.containerWidth / 2 - _this6.controlCoordinates.initialOffsetX) / (_this6.controlCoordinates.targetScale - _this6.controlCoordinates.scaleDifference) * _this6.controlCoordinates.scaleDifference, _this6.controlCoordinates.limitOffsetX * -1, _this6.controlCoordinates.limitOffsetX);
                  _this6.controlCoordinates.targetOffsetY = _this6.controlCoordinates.imgHeight * _this6.controlCoordinates.targetScale <= _this6.controlCoordinates.containerHeight ? 0 : _this6.minMax(_this6.controlCoordinates.initialOffsetY - (_this6.controlCoordinates.pinchOffsetY - _this6.controlCoordinates.containerOffsetY - _this6.controlCoordinates.containerHeight / 2 - _this6.controlCoordinates.initialOffsetY) / (_this6.controlCoordinates.targetScale - _this6.controlCoordinates.scaleDifference) * _this6.controlCoordinates.scaleDifference, _this6.controlCoordinates.limitOffsetY * -1, _this6.controlCoordinates.limitOffsetY);

                  _this6.zoomPanElement(_this6.controlCoordinates.targetOffsetX + "px", _this6.controlCoordinates.targetOffsetY + "px", _this6.controlCoordinates.targetScale);

                  if (_this6.controlCoordinates.targetScale > 1) {
                    _this6.controlCoordinates.zoomed = true;

                    if (!_this6.domNodes.caption.style.opacity && _this6.domNodes.caption.style.display !== 'none') {
                      _this6.fadeOut(_this6.domNodes.caption, _this6.options.fadeSpeed);
                    }
                  }

                  _this6.controlCoordinates.initialPinchDistance = _this6.controlCoordinates.targetPinchDistance;
                  _this6.controlCoordinates.initialScale = _this6.controlCoordinates.targetScale;
                  _this6.controlCoordinates.initialOffsetX = _this6.controlCoordinates.targetOffsetX;
                  _this6.controlCoordinates.initialOffsetY = _this6.controlCoordinates.targetOffsetY;
                }
              } else {
              _this6.controlCoordinates.targetScale = _this6.controlCoordinates.initialScale;
              _this6.controlCoordinates.limitOffsetX = (_this6.controlCoordinates.imgWidth * _this6.controlCoordinates.targetScale - _this6.controlCoordinates.containerWidth) / 2;
              _this6.controlCoordinates.limitOffsetY = (_this6.controlCoordinates.imgHeight * _this6.controlCoordinates.targetScale - _this6.controlCoordinates.containerHeight) / 2;
              _this6.controlCoordinates.targetOffsetX = _this6.controlCoordinates.imgWidth * _this6.controlCoordinates.targetScale <= _this6.controlCoordinates.containerWidth ? 0 : _this6.minMax(_this6.controlCoordinates.pointerOffsetX - (_this6.controlCoordinates.initialPointerOffsetX - _this6.controlCoordinates.initialOffsetX), _this6.controlCoordinates.limitOffsetX * -1, _this6.controlCoordinates.limitOffsetX);
              _this6.controlCoordinates.targetOffsetY = _this6.controlCoordinates.imgHeight * _this6.controlCoordinates.targetScale <= _this6.controlCoordinates.containerHeight ? 0 : _this6.minMax(_this6.controlCoordinates.pointerOffsetY - (_this6.controlCoordinates.initialPointerOffsetY - _this6.controlCoordinates.initialOffsetY), _this6.controlCoordinates.limitOffsetY * -1, _this6.controlCoordinates.limitOffsetY);

              if (Math.abs(_this6.controlCoordinates.targetOffsetX) === Math.abs(_this6.controlCoordinates.limitOffsetX)) {
                _this6.controlCoordinates.initialOffsetX = _this6.controlCoordinates.targetOffsetX;
                _this6.controlCoordinates.initialPointerOffsetX = _this6.controlCoordinates.pointerOffsetX;
              }

              if (Math.abs(_this6.controlCoordinates.targetOffsetY) === Math.abs(_this6.controlCoordinates.limitOffsetY)) {
                _this6.controlCoordinates.initialOffsetY = _this6.controlCoordinates.targetOffsetY;
                _this6.controlCoordinates.initialPointerOffsetY = _this6.controlCoordinates.pointerOffsetY;
              }

              _this6.setZoomData(_this6.controlCoordinates.initialScale, _this6.controlCoordinates.targetOffsetX, _this6.controlCoordinates.targetOffsetY);

              _this6.zoomPanElement(_this6.controlCoordinates.targetOffsetX + "px", _this6.controlCoordinates.targetOffsetY + "px", _this6.controlCoordinates.targetScale);
            }
          }
          /* Mouse Move implementation */


          if (event.type === 'mousemove' && _this6.controlCoordinates.mousedown) {
            if (event.type == 'touchmove') return true;
            event.preventDefault();
            if (_this6.controlCoordinates.capture === false) return false;
            _this6.controlCoordinates.pointerOffsetX = event.clientX;
            _this6.controlCoordinates.pointerOffsetY = event.clientY;
            _this6.controlCoordinates.targetScale = _this6.controlCoordinates.initialScale;
            _this6.controlCoordinates.limitOffsetX = (_this6.controlCoordinates.imgWidth * _this6.controlCoordinates.targetScale - _this6.controlCoordinates.containerWidth) / 2;
            _this6.controlCoordinates.limitOffsetY = (_this6.controlCoordinates.imgHeight * _this6.controlCoordinates.targetScale - _this6.controlCoordinates.containerHeight) / 2;
            _this6.controlCoordinates.targetOffsetX = _this6.controlCoordinates.imgWidth * _this6.controlCoordinates.targetScale <= _this6.controlCoordinates.containerWidth ? 0 : _this6.minMax(_this6.controlCoordinates.pointerOffsetX - (_this6.controlCoordinates.initialPointerOffsetX - _this6.controlCoordinates.initialOffsetX), _this6.controlCoordinates.limitOffsetX * -1, _this6.controlCoordinates.limitOffsetX);
            _this6.controlCoordinates.targetOffsetY = _this6.controlCoordinates.imgHeight * _this6.controlCoordinates.targetScale <= _this6.controlCoordinates.containerHeight ? 0 : _this6.minMax(_this6.controlCoordinates.pointerOffsetY - (_this6.controlCoordinates.initialPointerOffsetY - _this6.controlCoordinates.initialOffsetY), _this6.controlCoordinates.limitOffsetY * -1, _this6.controlCoordinates.limitOffsetY);

            if (Math.abs(_this6.controlCoordinates.targetOffsetX) === Math.abs(_this6.controlCoordinates.limitOffsetX)) {
              _this6.controlCoordinates.initialOffsetX = _this6.controlCoordinates.targetOffsetX;
              _this6.controlCoordinates.initialPointerOffsetX = _this6.controlCoordinates.pointerOffsetX;
            }

            if (Math.abs(_this6.controlCoordinates.targetOffsetY) === Math.abs(_this6.controlCoordinates.limitOffsetY)) {
              _this6.controlCoordinates.initialOffsetY = _this6.controlCoordinates.targetOffsetY;
              _this6.controlCoordinates.initialPointerOffsetY = _this6.controlCoordinates.pointerOffsetY;
            }

            _this6.setZoomData(_this6.controlCoordinates.initialScale, _this6.controlCoordinates.targetOffsetX, _this6.controlCoordinates.targetOffsetY);

            _this6.zoomPanElement(_this6.controlCoordinates.targetOffsetX + "px", _this6.controlCoordinates.targetOffsetY + "px", _this6.controlCoordinates.targetScale);
          }

          if (!_this6.controlCoordinates.zoomed) {
            _this6.controlCoordinates.swipeEnd = event.pageX || event.touches[0].pageX;
            _this6.controlCoordinates.swipeYEnd = event.pageY || event.touches[0].pageY;
            _this6.controlCoordinates.swipeDiff = _this6.controlCoordinates.swipeStart - _this6.controlCoordinates.swipeEnd;
            _this6.controlCoordinates.swipeYDiff = _this6.controlCoordinates.swipeYStart - _this6.controlCoordinates.swipeYEnd;

            if (_this6.options.animationSlide) {
              _this6.slide(0, -_this6.controlCoordinates.swipeDiff + 'px');
            }
          }
        });
        this.addEventListener(this.domNodes.image, ['touchend.' + this.eventNamespace, 'mouseup.' + this.eventNamespace, 'touchcancel.' + this.eventNamespace, 'mouseleave.' + this.eventNamespace, 'pointerup', 'pointercancel', 'MSPointerUp', 'MSPointerCancel'], function (event) {
          if (_this6.isTouchDevice && event.type === 'touchend') {
            _this6.controlCoordinates.touchCount = event.touches.length;

            if (_this6.controlCoordinates.touchCount === 0)
              /* No touch */
              {
                /* Set attributes */
                if (_this6.currentImage) {
                  _this6.setZoomData(_this6.controlCoordinates.initialScale, _this6.controlCoordinates.targetOffsetX, _this6.controlCoordinates.targetOffsetY);
                }

                if (_this6.controlCoordinates.initialScale === 1) {
                  _this6.controlCoordinates.zoomed = false;

                  if (_this6.domNodes.caption.style.display === 'none') {
                    _this6.fadeIn(_this6.domNodes.caption, _this6.options.fadeSpeed);
                  }
                }

                _this6.controlCoordinates.initialPinchDistance = null;
                _this6.controlCoordinates.capture = false;
              } else if (_this6.controlCoordinates.touchCount === 1)
              /* Single touch */
              {
                _this6.controlCoordinates.initialPointerOffsetX = event.touches[0].clientX;
                _this6.controlCoordinates.initialPointerOffsetY = event.touches[0].clientY;
              } else if (_this6.controlCoordinates.touchCount > 1)
              /* Pinch */
              {
                _this6.controlCoordinates.initialPinchDistance = null;
              }
          }

          if (_this6.controlCoordinates.mousedown) {
            _this6.controlCoordinates.mousedown = false;
            var possibleDir = true;

            if (!_this6.options.loop) {
              if (_this6.currentImageIndex === 0 && _this6.controlCoordinates.swipeDiff < 0) {
                possibleDir = false;
              }

              if (_this6.currentImageIndex >= _this6.relatedElements.length - 1 && _this6.controlCoordinates.swipeDiff > 0) {
                possibleDir = false;
              }
            }

            if (Math.abs(_this6.controlCoordinates.swipeDiff) > _this6.options.swipeTolerance && possibleDir) {
              _this6.loadImage(_this6.controlCoordinates.swipeDiff > 0 ? 1 : -1);
            } else if (_this6.options.animationSlide) {
              _this6.slide(_this6.options.animationSpeed / 1000, 0 + 'px');
            }

            if (_this6.options.swipeClose && Math.abs(_this6.controlCoordinates.swipeYDiff) > 50 && Math.abs(_this6.controlCoordinates.swipeDiff) < _this6.options.swipeTolerance) {
              _this6.close();
            }
          }
        });
        this.addEventListener(this.domNodes.image, ['dblclick'], function (event) {
          if (_this6.isTouchDevice) return;
          _this6.controlCoordinates.initialPointerOffsetX = event.clientX;
          _this6.controlCoordinates.initialPointerOffsetY = event.clientY;
          _this6.controlCoordinates.containerHeight = _this6.getDimensions(_this6.domNodes.image).height;
          _this6.controlCoordinates.containerWidth = _this6.getDimensions(_this6.domNodes.image).width;
          _this6.controlCoordinates.imgHeight = _this6.getDimensions(_this6.currentImage).height;
          _this6.controlCoordinates.imgWidth = _this6.getDimensions(_this6.currentImage).width;
          _this6.controlCoordinates.containerOffsetX = _this6.domNodes.image.offsetLeft;
          _this6.controlCoordinates.containerOffsetY = _this6.domNodes.image.offsetTop;

          _this6.currentImage.classList.add('sl-transition');

          if (!_this6.controlCoordinates.zoomed) {
            _this6.controlCoordinates.initialScale = _this6.options.doubleTapZoom;

            _this6.setZoomData(_this6.controlCoordinates.initialScale, 0, 0);

            _this6.zoomPanElement(0 + "px", 0 + "px", _this6.controlCoordinates.initialScale);

            if (!_this6.domNodes.caption.style.opacity && _this6.domNodes.caption.style.display !== 'none') {
              _this6.fadeOut(_this6.domNodes.caption, _this6.options.fadeSpeed);
            }

            _this6.controlCoordinates.zoomed = true;
          } else {
            _this6.controlCoordinates.initialScale = 1;

            _this6.setZoomData(_this6.controlCoordinates.initialScale, 0, 0);

            _this6.zoomPanElement(0 + "px", 0 + "px", _this6.controlCoordinates.initialScale);

            _this6.controlCoordinates.zoomed = false;

            if (_this6.domNodes.caption.style.display === 'none') {
              _this6.fadeIn(_this6.domNodes.caption, _this6.options.fadeSpeed);
            }
          }

          setTimeout(function () {
            if (_this6.currentImage) {
              _this6.currentImage.classList.remove('sl-transition');

              _this6.currentImage.style[_this6.transitionPrefix + 'transform-origin'] = null;
            }
          }, 200);
          _this6.controlCoordinates.capture = true;
          return false;
        });
      }
    }, {
      key: "getDimensions",
      value: function getDimensions(element) {
        var styles = window.getComputedStyle(element),
            height = element.offsetHeight,
            width = element.offsetWidth,
            borderTopWidth = parseFloat(styles.borderTopWidth),
            borderBottomWidth = parseFloat(styles.borderBottomWidth),
            paddingTop = parseFloat(styles.paddingTop),
            paddingBottom = parseFloat(styles.paddingBottom),
            borderLeftWidth = parseFloat(styles.borderLeftWidth),
            borderRightWidth = parseFloat(styles.borderRightWidth),
            paddingLeft = parseFloat(styles.paddingLeft),
            paddingRight = parseFloat(styles.paddingRight);
        return {
          height: height - borderBottomWidth - borderTopWidth - paddingTop - paddingBottom,
          width: width - borderLeftWidth - borderRightWidth - paddingLeft - paddingRight
        };
      }
    }, {
      key: "updateHash",
      value: function updateHash() {
        var newHash = 'pid=' + (this.currentImageIndex + 1),
            newURL = window.location.href.split('#')[0] + '#' + newHash;
        this.hashReseted = false;

        if (this.pushStateSupport) {
          window.history[this.historyHasChanges ? 'replaceState' : 'pushState']('', document.title, newURL);
        } else {
          // what is the browser target of this?
          if (this.historyHasChanges) {
            window.location.replace(newURL);
          } else {
            window.location.hash = newHash;
          }
        }

        if (!this.historyHasChanges) {
          this.urlChangedOnce = true;
        }

        this.historyHasChanges = true;
      }
    }, {
      key: "resetHash",
      value: function resetHash() {
        this.hashReseted = true;

        if (this.urlChangedOnce) {
          history.back();
        } else {
          if (this.pushStateSupport) {
            history.pushState('', document.title, window.location.pathname + window.location.search);
          } else {
            window.location.hash = '';
          }
        } //
        //in case an history operation is still pending


        clearTimeout(this.historyUpdateTimeout);
      }
    }, {
      key: "updateURL",
      value: function updateURL() {
        clearTimeout(this.historyUpdateTimeout);

        if (!this.historyHasChanges) {
          this.updateHash(); // first time
        } else {
          this.historyUpdateTimeout = setTimeout(this.updateHash.bind(this), 800);
        }
      }
    }, {
      key: "setCaption",
      value: function setCaption(captionText, imageWidth) {
        var _this7 = this;

        if (this.options.captions && captionText && captionText !== '' && typeof captionText !== "undefined") {
          this.hide(this.domNodes.caption);
          this.domNodes.caption.style.width = imageWidth + 'px';
          this.domNodes.caption.innerHTML = captionText;
          this.domNodes.image.appendChild(this.domNodes.caption);
          setTimeout(function () {
            _this7.fadeIn(_this7.domNodes.caption, _this7.options.fadeSpeed);
          }, this.options.captionDelay);
        }
      }
    }, {
      key: "slide",
      value: function slide(speed, pos) {
        if (!this.transitionCapable) {
          return this.domNodes.image.style.left = pos;
        }

        this.domNodes.image.style[this.transitionPrefix + 'transform'] = 'translateX(' + pos + ')';
        this.domNodes.image.style[this.transitionPrefix + 'transition'] = this.transitionPrefix + 'transform ' + speed + 's linear';
      }
    }, {
      key: "getRelated",
      value: function getRelated(rel) {
        var elems;

        if (rel && rel !== false && rel !== 'nofollow') {
          elems = Array.from(this.elements).filter(function (element) {
            return element.getAttribute('rel') === rel;
          });
        } else {
          elems = this.elements;
        }

        return elems;
      }
    }, {
      key: "openImage",
      value: function openImage(element) {
        var _this8 = this;

        element.dispatchEvent(new Event('show.' + this.eventNamespace));

        if (this.options.disableScroll) {
          this.globalScrollbarWidth = this.toggleScrollbar('hide');
        }

        if (this.options.htmlClass && this.options.htmlClass !== '') {
          document.querySelector('html').classList.add(this.options.htmlClass);
        }

        document.body.appendChild(this.domNodes.wrapper);
        this.domNodes.wrapper.appendChild(this.domNodes.image);

        if (this.options.overlay) {
          document.body.appendChild(this.domNodes.overlay);
        }

        this.relatedElements = this.getRelated(element.rel);

        if (this.options.showCounter) {
          if (this.relatedElements.length == 1 && this.domNodes.wrapper.contains(this.domNodes.counter)) {
            this.domNodes.wrapper.removeChild(this.domNodes.counter);
          } else if (this.relatedElements.length > 1 && !this.domNodes.wrapper.contains(this.domNodes.counter)) {
            this.domNodes.wrapper.appendChild(this.domNodes.counter);
          }
        }

        this.isAnimating = true;
        this.currentImageIndex = this.relatedElements.indexOf(element);
        var targetURL = element.getAttribute(this.options.sourceAttr);
        this.currentImage = document.createElement('img');
        this.currentImage.style.display = 'none';
        this.currentImage.setAttribute('src', targetURL);
        this.currentImage.dataset.scale = 1;
        this.currentImage.dataset.translateX = 0;
        this.currentImage.dataset.translateY = 0;

        if (this.loadedImages.indexOf(targetURL) === -1) {
          this.loadedImages.push(targetURL);
        }

        this.domNodes.image.innerHTML = '';
        this.domNodes.image.setAttribute('style', '');
        this.domNodes.image.appendChild(this.currentImage);
        this.fadeIn(this.domNodes.overlay, this.options.fadeSpeed);
        this.fadeIn([this.domNodes.counter, this.domNodes.navigation, this.domNodes.closeButton], this.options.fadeSpeed);
        this.show(this.domNodes.spinner);
        this.domNodes.counter.querySelector('.sl-current').innerHTML = this.currentImageIndex + 1;
        this.domNodes.counter.querySelector('.sl-total').innerHTML = this.relatedElements.length;
        this.adjustImage();

        if (this.options.preloading) {
          this.preload();
        }

        setTimeout(function () {
          element.dispatchEvent(new Event('shown.' + _this8.eventNamespace));
        }, this.options.animationSpeed);
      }
    }, {
      key: "forceFocus",
      value: function forceFocus() {
        var _this9 = this;

        this.removeEventListener(document, 'focusin.' + this.eventNamespace);
        this.addEventListener(document, 'focusin.' + this.eventNamespace, function (event) {
          if (document !== event.target && _this9.domNodes.wrapper !== event.target && !_this9.domNodes.wrapper.contains(event.target)) {
            _this9.domNodes.wrapper.focus();
          }
        });
      } // utility

    }, {
      key: "addEventListener",
      value: function addEventListener(elements, events, callback, opts) {
        elements = this.wrap(elements);
        events = this.wrap(events);

        var _iterator = _createForOfIteratorHelper(elements),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var element = _step.value;

            if (!element.namespaces) {
              element.namespaces = {};
            } // save the namespaces addEventListener the DOM element itself


            var _iterator2 = _createForOfIteratorHelper(events),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var event = _step2.value;
                var options = opts || false;
                var needsPassiveFix = ['touchstart', 'touchmove'].indexOf(event.split('.')[0]) >= 0;

                if (needsPassiveFix && this.isPassiveEventsSupported) {
                  if (_typeof(options) === 'object') {
                    options.passive = true;
                  } else {
                    options = {
                      passive: true
                    };
                  }
                }

                element.namespaces[event] = callback;
                element.addEventListener(event.split('.')[0], callback, options);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }, {
      key: "removeEventListener",
      value: function removeEventListener(elements, events) {
        elements = this.wrap(elements);
        events = this.wrap(events);

        var _iterator3 = _createForOfIteratorHelper(elements),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var element = _step3.value;

            var _iterator4 = _createForOfIteratorHelper(events),
                _step4;

            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var event = _step4.value;

                if (element.namespaces && element.namespaces[event]) {
                  element.removeEventListener(event.split('.')[0], element.namespaces[event]);
                  delete element.namespaces[event];
                }
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }, {
      key: "fadeOut",
      value: function fadeOut(elements, duration, callback) {
        var _this10 = this;

        elements = this.wrap(elements);

        var _iterator5 = _createForOfIteratorHelper(elements),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var element = _step5.value;
            element.style.opacity = 1;
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }

        this.isFadeIn = false;

        var step = 16.66666 / (duration || this.options.fadeSpeed),
            fade = function fade() {
          var currentOpacity = parseFloat(elements[0].style.opacity);

          if ((currentOpacity -= step) < 0) {
            var _iterator6 = _createForOfIteratorHelper(elements),
                _step6;

            try {
              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                var element = _step6.value;
                element.style.display = "none"; // element.style.opacity = '';

                element.style.opacity = 1;
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }

            callback && callback.call(_this10, elements);
          } else {
            var _iterator7 = _createForOfIteratorHelper(elements),
                _step7;

            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                var _element = _step7.value;
                _element.style.opacity = currentOpacity;
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }

            requestAnimationFrame(fade);
          }
        };

        fade();
      }
    }, {
      key: "fadeIn",
      value: function fadeIn(elements, duration, callback, display) {
        var _this11 = this;

        elements = this.wrap(elements);

        var _iterator8 = _createForOfIteratorHelper(elements),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var element = _step8.value;
            element.style.opacity = 0;
            element.style.display = display || "block";
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }

        this.isFadeIn = true;

        var opacityTarget = parseFloat(elements[0].dataset.opacityTarget || 1),
            step = 16.66666 * opacityTarget / (duration || this.options.fadeSpeed),
            fade = function fade() {
          var currentOpacity = parseFloat(elements[0].style.opacity);

          if (!((currentOpacity += step) > opacityTarget)) {
            var _iterator9 = _createForOfIteratorHelper(elements),
                _step9;

            try {
              for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                var element = _step9.value;
                element.style.opacity = currentOpacity;
              }
            } catch (err) {
              _iterator9.e(err);
            } finally {
              _iterator9.f();
            }

            if (!_this11.isFadeIn) return;
            requestAnimationFrame(fade);
          } else {
            var _iterator10 = _createForOfIteratorHelper(elements),
                _step10;

            try {
              for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
                var _element2 = _step10.value;
                _element2.style.opacity = '';
              }
            } catch (err) {
              _iterator10.e(err);
            } finally {
              _iterator10.f();
            }

            callback && callback.call(_this11, elements);
          }
        };

        fade();
      }
    }, {
      key: "hide",
      value: function hide(elements) {
        elements = this.wrap(elements);

        var _iterator11 = _createForOfIteratorHelper(elements),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var element = _step11.value;

            if (element.style.display != 'none') {
              element.dataset.initialDisplay = element.style.display;
            }

            element.style.display = 'none';
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }
      }
    }, {
      key: "show",
      value: function show(elements, display) {
        elements = this.wrap(elements);

        var _iterator12 = _createForOfIteratorHelper(elements),
            _step12;

        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var element = _step12.value;
            element.style.display = element.dataset.initialDisplay || display || 'block';
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }
      }
    }, {
      key: "wrap",
      value: function wrap(input) {
        return typeof input[Symbol.iterator] === 'function' && typeof input !== 'string' ? input : [input];
      }
    }, {
      key: "on",
      value: function on(events, callback) {
        events = this.wrap(events);

        var _iterator13 = _createForOfIteratorHelper(this.elements),
            _step13;

        try {
          for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
            var element = _step13.value;

            if (!element.fullyNamespacedEvents) {
              element.fullyNamespacedEvents = {};
            }

            var _iterator14 = _createForOfIteratorHelper(events),
                _step14;

            try {
              for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
                var event = _step14.value;
                element.fullyNamespacedEvents[event] = callback;
                element.addEventListener(event, callback);
              }
            } catch (err) {
              _iterator14.e(err);
            } finally {
              _iterator14.f();
            }
          }
        } catch (err) {
          _iterator13.e(err);
        } finally {
          _iterator13.f();
        }

        return this;
      }
    }, {
      key: "off",
      value: function off(events) {
        events = this.wrap(events);

        var _iterator15 = _createForOfIteratorHelper(this.elements),
            _step15;

        try {
          for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
            var element = _step15.value;

            var _iterator16 = _createForOfIteratorHelper(events),
                _step16;

            try {
              for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
                var event = _step16.value;

                if (typeof element.fullyNamespacedEvents !== 'undefined' && event in element.fullyNamespacedEvents) {
                  element.removeEventListener(event, element.fullyNamespacedEvents[event]);
                }
              }
            } catch (err) {
              _iterator16.e(err);
            } finally {
              _iterator16.f();
            }
          }
        } catch (err) {
          _iterator15.e(err);
        } finally {
          _iterator15.f();
        }

        return this;
      } // api

    }, {
      key: "open",
      value: function open(elem) {
        elem = elem || this.elements[0];

        if (typeof jQuery !== "undefined" && elem instanceof jQuery) {
          elem = elem.get(0);
        }

        this.initialImageIndex = this.elements.indexOf(elem);

        if (this.initialImageIndex > -1) {
          this.openImage(elem);
        }
      }
    }, {
      key: "next",
      value: function next() {
        this.loadImage(1);
      }
    }, {
      key: "prev",
      value: function prev() {
        this.loadImage(-1);
      } // get some useful data

    }, {
      key: "getLighboxData",
      value: function getLighboxData() {
        return {
          currentImageIndex: this.currentImageIndex,
          currentImage: this.currentImage,
          globalScrollbarWidth: this.globalScrollbarWidth
        };
      } //close is exposed anyways..

    }, {
      key: "destroy",
      value: function destroy() {
        //remove all custom event listeners from elements
        this.off(['close.' + this.eventNamespace, 'closed.' + this.eventNamespace, 'nextImageLoaded.' + this.eventNamespace, 'prevImageLoaded.' + this.eventNamespace, 'change.' + this.eventNamespace, 'nextDone.' + this.eventNamespace, 'prevDone.' + this.eventNamespace, 'error.' + this.eventNamespace, 'changed.' + this.eventNamespace, 'next.' + this.eventNamespace, 'prev.' + this.eventNamespace, 'show.' + this.eventNamespace, 'shown.' + this.eventNamespace]);
        this.removeEventListener(this.elements, 'click.' + this.eventNamespace);
        this.removeEventListener(document, 'focusin.' + this.eventNamespace);
        this.removeEventListener(document.body, 'contextmenu.' + this.eventNamespace);
        this.removeEventListener(document.body, 'keyup.' + this.eventNamespace);
        this.removeEventListener(this.domNodes.navigation.getElementsByTagName('button'), 'click.' + this.eventNamespace);
        this.removeEventListener(this.domNodes.closeButton, 'click.' + this.eventNamespace);
        this.removeEventListener(window, 'resize.' + this.eventNamespace);
        this.removeEventListener(window, 'hashchange.' + this.eventNamespace);
        this.close();

        if (this.isOpen) {
          document.body.removeChild(this.domNodes.wrapper);
          document.body.removeChild(this.domNodes.overlay);
        }

        this.elements = null;
      }
    }, {
      key: "refresh",
      value: function refresh() {
        if (!this.initialSelector) {
          throw 'refreshing only works when you initialize using a selector!';
        }

        var options = this.options,
            selector = this.initialSelector;
        this.destroy();
        this.constructor(selector, options);
        return this;
      }
    }]);

    return SimpleLightbox;
  }();

  var _default = SimpleLightbox;
  exports["default"] = _default;
  commonjsGlobal.SimpleLightbox = SimpleLightbox;
  });

  var SimpleLightbox = unwrapExports(simpleLightbox_modules);

  new SimpleLightbox('.gallery__fancybox', {
    /* options */
  });

  /**
   * Sticky Sidebar JavaScript Plugin.
   * @version 3.3.1
   * @author Ahmed Bouhuolia <a.bouhuolia@gmail.com>
   * @license The MIT License (MIT)
   */
  const StickySidebar = (() => {
    
      // ---------------------------------
      // # Define Constants
      // ---------------------------------
      //
      const EVENT_KEY = '.stickySidebar';
    
      const DEFAULTS = {
        
        /**
         * Additional top spacing of the element when it becomes sticky.
         * @type {Numeric|Function}
         */
        topSpacing: 0,
    
        /**
         * Additional bottom spacing of the element when it becomes sticky.
         * @type {Numeric|Function}
         */
        bottomSpacing: 0,
    
        /**
         * Container sidebar selector to know what the beginning and end of sticky element.
         * @type {String|False}
         */
        containerSelector: false,
    
        /**
         * Inner wrapper selector.
         * @type {String}
         */
        innerWrapperSelector: '.inner-wrapper-sticky',
    
        /**
         * The name of CSS class to apply to elements when they have become stuck.
         * @type {String|False}
         */
        stickyClass: 'is-affixed',
    
        /**
         * Detect when sidebar and its container change height so re-calculate their dimensions.
         * @type {Boolean}
         */
        resizeSensor: true,
    
        /**
         * The sidebar returns to its normal position if its width below this value.
         * @type {Numeric}
         */
        minWidth: false
      };
    
      // ---------------------------------
      // # Class Definition
      // ---------------------------------
      //
      /**
       * Sticky Sidebar Class.
       * @public
       */
      class StickySidebar{
    
        /**
         * Sticky Sidebar Constructor.
         * @constructor
         * @param {HTMLElement|String} sidebar - The sidebar element or sidebar selector.
         * @param {Object} options - The options of sticky sidebar.
         */
        constructor(sidebar, options = {}){
          this.options = StickySidebar.extend(DEFAULTS, options);
    
          // Sidebar element query if there's no one, throw error.
          this.sidebar = ('string' === typeof sidebar ) ? document.querySelector(sidebar) : sidebar;
          if( 'undefined' === typeof this.sidebar )
            throw new Error("There is no specific sidebar element.");
    
          this.sidebarInner = false;
          this.container = this.sidebar.parentElement;
    
          // Current Affix Type of sidebar element.
          this.affixedType = 'STATIC';
          this.direction = 'down';
          this.support = {
            transform:   false,
            transform3d: false
          };
    
          this._initialized = false;
          this._reStyle = false;
          this._breakpoint = false;
          this._resizeListeners = [];
          
          // Dimensions of sidebar, container and screen viewport.
          this.dimensions = {
            translateY: 0,
            topSpacing: 0,
            lastTopSpacing: 0,
            bottomSpacing: 0,
            lastBottomSpacing: 0,
            sidebarHeight: 0,
            sidebarWidth: 0,
            containerTop: 0,
            containerHeight: 0,
            viewportHeight: 0,
            viewportTop: 0, 
            lastViewportTop: 0,
          };
    
          // Bind event handlers for referencability.
          ['handleEvent'].forEach( (method) => {
            this[method] = this[method].bind(this);
          });
    
          // Initialize sticky sidebar for first time.
          this.initialize();
        }
    
        /**
         * Initializes the sticky sidebar by adding inner wrapper, define its container, 
         * min-width breakpoint, calculating dimensions, adding helper classes and inline style.
         * @private
         */
        initialize(){
          this._setSupportFeatures();
    
          // Get sticky sidebar inner wrapper, if not found, will create one.
          if( this.options.innerWrapperSelector ){
            this.sidebarInner = this.sidebar.querySelector(this.options.innerWrapperSelector);
    
            if( null === this.sidebarInner )
              this.sidebarInner = false;
          }
          
          if( ! this.sidebarInner ){
            let wrapper = document.createElement('div');
            wrapper.setAttribute('class', 'inner-wrapper-sticky');
            this.sidebar.appendChild(wrapper);
    
            while( this.sidebar.firstChild != wrapper )
              wrapper.appendChild(this.sidebar.firstChild);
    
            this.sidebarInner = this.sidebar.querySelector('.inner-wrapper-sticky');
          }
    
          // Container wrapper of the sidebar.
          if( this.options.containerSelector ){
            let containers = document.querySelectorAll(this.options.containerSelector);
            containers = Array.prototype.slice.call(containers);
    
            containers.forEach((container, item) => {
              if( ! container.contains(this.sidebar) ) return;
              this.container = container;
            });
    
            if( ! containers.length )
              throw new Error("The container does not contains on the sidebar.");
          }
          
          // If top/bottom spacing is not function parse value to integer.
          if( 'function' !== typeof this.options.topSpacing )
            this.options.topSpacing = parseInt(this.options.topSpacing) || 0;
    
          if( 'function' !== typeof this.options.bottomSpacing )
            this.options.bottomSpacing = parseInt(this.options.bottomSpacing) || 0;
              
          // Breakdown sticky sidebar if screen width below `options.minWidth`.
          this._widthBreakpoint();
    
          // Calculate dimensions of sidebar, container and viewport.
          this.calcDimensions();
    
          // Affix sidebar in proper position.
          this.stickyPosition();
    
          // Bind all events.
          this.bindEvents();
          
          // Inform other properties the sticky sidebar is initialized.
          this._initialized = true;
        }
    
        /**
         * Bind all events of sticky sidebar plugin.
         * @protected
         */
        bindEvents(){
          window.addEventListener('resize', this, {passive: true, capture: false});
          window.addEventListener('scroll', this, {passive: true, capture: false});
    
          this.sidebar.addEventListener('update' + EVENT_KEY, this);
    
          if( this.options.resizeSensor && 'undefined' !== typeof ResizeSensor ){
            new ResizeSensor(this.sidebarInner, this.handleEvent);
            new ResizeSensor(this.container, this.handleEvent);
          }
        }
    
        /**
         * Handles all events of the plugin.
         * @param {Object} event - Event object passed from listener.
         */
        handleEvent(event){
          this.updateSticky(event);
        }
    
        /**
         * Calculates dimensions of sidebar, container and screen viewpoint
         * @public
         */
        calcDimensions(){
          if( this._breakpoint ) return;
          var dims = this.dimensions;
    
          // Container of sticky sidebar dimensions.
          dims.containerTop    = StickySidebar.offsetRelative(this.container).top;
          dims.containerHeight = this.container.clientHeight;
          dims.containerBottom = dims.containerTop + dims.containerHeight;
    
          // Sidebar dimensions.
          dims.sidebarHeight = this.sidebarInner.offsetHeight;
          dims.sidebarWidth  = this.sidebar.offsetWidth;
          
          // Screen viewport dimensions.
          dims.viewportHeight = window.innerHeight;
    
          this._calcDimensionsWithScroll();
        }
    
        /**
         * Some dimensions values need to be up-to-date when scrolling the page.
         * @private
         */
        _calcDimensionsWithScroll(){
          var dims = this.dimensions;
    
          dims.sidebarLeft = StickySidebar.offsetRelative(this.sidebar).left;
    
          dims.viewportTop    = document.documentElement.scrollTop || document.body.scrollTop;
          dims.viewportBottom = dims.viewportTop + dims.viewportHeight;
          dims.viewportLeft   = document.documentElement.scrollLeft || document.body.scrollLeft;
    
          dims.topSpacing    = this.options.topSpacing;
          dims.bottomSpacing = this.options.bottomSpacing;
    
          if( 'function' === typeof dims.topSpacing )
              dims.topSpacing = parseInt(dims.topSpacing(this.sidebar)) || 0;
    
          if( 'function' === typeof dims.bottomSpacing )
              dims.bottomSpacing = parseInt(dims.bottomSpacing(this.sidebar)) || 0;
          
          if( 'VIEWPORT-TOP' === this.affixedType ){
            // Adjust translate Y in the case decrease top spacing value.
            if( dims.topSpacing < dims.lastTopSpacing ){
              dims.translateY += dims.lastTopSpacing - dims.topSpacing;
              this._reStyle = true; 
            }
          
          } else if( 'VIEWPORT-BOTTOM' === this.affixedType ){
            // Adjust translate Y in the case decrease bottom spacing value.
            if( dims.bottomSpacing < dims.lastBottomSpacing ){
              dims.translateY += dims.lastBottomSpacing - dims.bottomSpacing;
              this._reStyle = true;
            }
          }
          
          dims.lastTopSpacing    = dims.topSpacing;
          dims.lastBottomSpacing = dims.bottomSpacing;
        }
        
        /**
         * Determine whether the sidebar is bigger than viewport.
         * @public
         * @return {Boolean}
         */
        isSidebarFitsViewport(){
          return this.dimensions.sidebarHeight < this.dimensions.viewportHeight;
        }
    
        /**
         * Observe browser scrolling direction top and down.
         */
        observeScrollDir(){
          var dims = this.dimensions;
          if( dims.lastViewportTop === dims.viewportTop ) return;
    
          var furthest = 'down' === this.direction ? Math.min : Math.max;
          
          // If the browser is scrolling not in the same direction.
          if( dims.viewportTop === furthest(dims.viewportTop, dims.lastViewportTop) )
            this.direction = 'down' === this.direction ?  'up' : 'down';
        }
    
        /**
         * Gets affix type of sidebar according to current scrollTop and scrollLeft.
         * Holds all logical affix of the sidebar when scrolling up and down and when sidebar 
         * is bigger than viewport and vice versa.
         * @public
         * @return {String|False} - Proper affix type.
         */
        getAffixType(){
          var dims = this.dimensions, affixType = false;
    
          this._calcDimensionsWithScroll();
    
          var sidebarBottom = dims.sidebarHeight + dims.containerTop;
          var colliderTop = dims.viewportTop + dims.topSpacing;
          var colliderBottom = dims.viewportBottom - dims.bottomSpacing;
    
          // When browser is scrolling top.
          if( 'up' === this.direction ){
            if( colliderTop <= dims.containerTop ){
              dims.translateY = 0;
              affixType = 'STATIC';
    
            } else if( colliderTop <= dims.translateY + dims.containerTop ){
              dims.translateY = colliderTop - dims.containerTop;
              affixType = 'VIEWPORT-TOP';
    
            } else if( ! this.isSidebarFitsViewport() && dims.containerTop <= colliderTop ){
              affixType = 'VIEWPORT-UNBOTTOM';
            }
          // When browser is scrolling up.
          } else {
            // When sidebar element is not bigger than screen viewport.
            if( this.isSidebarFitsViewport() ){
    
              if( dims.sidebarHeight + colliderTop >= dims.containerBottom ){
                dims.translateY = dims.containerBottom - sidebarBottom;
                affixType = 'CONTAINER-BOTTOM'; 
    
              } else if( colliderTop >= dims.containerTop ){
                dims.translateY = colliderTop - dims.containerTop;
                affixType = 'VIEWPORT-TOP';
              }
            // When sidebar element is bigger than screen viewport.
            } else {
        
              if( dims.containerBottom <= colliderBottom ){
                dims.translateY = dims.containerBottom - sidebarBottom; 
                affixType = 'CONTAINER-BOTTOM';    
    
              } else if( sidebarBottom + dims.translateY <= colliderBottom ){
                dims.translateY = colliderBottom - sidebarBottom;
                affixType = 'VIEWPORT-BOTTOM';
              
              } else if( dims.containerTop + dims.translateY <= colliderTop ){
                affixType = 'VIEWPORT-UNBOTTOM';
              }
            }
          }
    
          // Make sure the translate Y is not bigger than container height.
          dims.translateY = Math.max(0, dims.translateY);
          dims.translateY = Math.min(dims.containerHeight, dims.translateY);
    
          dims.lastViewportTop = dims.viewportTop;
          return affixType;
        }
    
        /**
         * Gets inline style of sticky sidebar wrapper and inner wrapper according 
         * to its affix type.
         * @private
         * @param {String} affixType - Affix type of sticky sidebar.
         * @return {Object}
         */
        _getStyle(affixType){
          if( 'undefined' === typeof affixType ) return;
    
          var style = {inner: {}, outer: {}};
          var dims = this.dimensions;
    
          switch( affixType ){
            case 'VIEWPORT-TOP':
              style.inner = {position: 'fixed', top: dims.topSpacing,
                    left: dims.sidebarLeft - dims.viewportLeft, width: dims.sidebarWidth};
              break;
            case 'VIEWPORT-BOTTOM':
              style.inner = {position: 'fixed', top: 'auto', left: dims.sidebarLeft,
                    bottom: dims.bottomSpacing, width: dims.sidebarWidth};
              break;
            case 'CONTAINER-BOTTOM':
            case 'VIEWPORT-UNBOTTOM':
              let translate = this._getTranslate(0, dims.translateY + 'px');
              
              if( translate )
                style.inner = {transform: translate};
              else 
                style.inner = {position: 'absolute', top: dims.translateY, width: dims.sidebarWidth};
              break;
          }
          
          switch( affixType ){
            case 'VIEWPORT-TOP':
            case 'VIEWPORT-BOTTOM':
            case 'VIEWPORT-UNBOTTOM':
            case 'CONTAINER-BOTTOM':
              style.outer = {height: dims.sidebarHeight, position: 'relative'};
              break;
          }
    
          style.outer = StickySidebar.extend({height: '', position: ''}, style.outer);
          style.inner = StickySidebar.extend({position: 'relative', top: '', left: '',
              bottom: '', width: '',  transform: this._getTranslate()}, style.inner);
    
          return style;
        }
       
        /**
         * Cause the sidebar to be sticky according to affix type by adding inline
         * style, adding helper class and trigger events.
         * @function
         * @protected
         * @param {string} force - Update sticky sidebar position by force.
         */
        stickyPosition(force){
          if( this._breakpoint ) return;
    
          force = this._reStyle || force || false;
          
          this.options.topSpacing;
          this.options.bottomSpacing;
    
          var affixType = this.getAffixType();
          var style = this._getStyle(affixType);
          
          if( (this.affixedType != affixType || force) && affixType ){
            let affixEvent = 'affix.' + affixType.toLowerCase().replace('viewport-', '') + EVENT_KEY;
            StickySidebar.eventTrigger(this.sidebar, affixEvent);
    
            if( 'STATIC' === affixType )
              StickySidebar.removeClass(this.sidebar, this.options.stickyClass);
            else
              StickySidebar.addClass(this.sidebar, this.options.stickyClass);
            
            for( let key in style.outer ){
              ('number' === typeof style.outer[key]) ? 'px' : '';
              this.sidebar.style[key] = style.outer[key];
            }
    
            for( let key in style.inner ){
              let _unit = ('number' === typeof style.inner[key]) ? 'px' : '';
              this.sidebarInner.style[key] = style.inner[key] + _unit;
            }
            
            let affixedEvent = 'affixed.'+ affixType.toLowerCase().replace('viewport-', '') + EVENT_KEY;
            StickySidebar.eventTrigger(this.sidebar, affixedEvent);
          } else {
            if( this._initialized ) this.sidebarInner.style.left = style.inner.left;
          }
    
          this.affixedType = affixType;
        }
    
        /**
         * Breakdown sticky sidebar when window width is below `options.minWidth` value.
         * @protected
         */
        _widthBreakpoint(){
    
          if( window.innerWidth <= this.options.minWidth ){
            this._breakpoint = true;
            this.affixedType = 'STATIC';
    
            this.sidebar.removeAttribute('style');
            StickySidebar.removeClass(this.sidebar, this.options.stickyClass);
            this.sidebarInner.removeAttribute('style');
          } else {
            this._breakpoint = false;
          }
        }
    
        /**
         * Switches between functions stack for each event type, if there's no 
         * event, it will re-initialize sticky sidebar.
         * @public
         */
        updateSticky(event = {}){
          if( this._running ) return;
          this._running = true;
    
          ((eventType) => {

            requestAnimationFrame(() => {
              switch( eventType ){
                // When browser is scrolling and re-calculate just dimensions
                // within scroll. 
                case 'scroll':
                  this._calcDimensionsWithScroll();
                  this.observeScrollDir();
                  this.stickyPosition();
                  break;
    
                // When browser is resizing or there's no event, observe width
                // breakpoint and re-calculate dimensions.
                case 'resize':
                default: 
                  this._widthBreakpoint();
                  this.calcDimensions();
                  this.stickyPosition(true);
                  break;
              }
              this._running = false;
            });
          })(event.type);
        }
    
        /**
         * Set browser support features to the public property.
         * @private
         */
        _setSupportFeatures(){
          var support = this.support;
    
          support.transform = StickySidebar.supportTransform();
          support.transform3d = StickySidebar.supportTransform(true);
        }
    
        /**
         * Get translate value, if the browser supports transfrom3d, it will adopt it.
         * and the same with translate. if browser doesn't support both return false.
         * @param {Number} y - Value of Y-axis.
         * @param {Number} x - Value of X-axis.
         * @param {Number} z - Value of Z-axis.
         * @return {String|False}
         */
        _getTranslate(y = 0, x = 0, z = 0){
          if( this.support.transform3d ) return 'translate3d(' + y +', '+ x +', '+ z +')';
          else if( this.support.translate ) return 'translate('+ y +', '+ x +')';
          else return false;
        }
    
        /**
         * Destroy sticky sidebar plugin.
         * @public
         */
        destroy(){
          window.removeEventListener('resize', this, {caption: false});
          window.removeEventListener('scroll', this, {caption: false});
    
          this.sidebar.classList.remove(this.options.stickyClass);
          this.sidebar.style.minHeight = '';
    
          this.sidebar.removeEventListener('update' + EVENT_KEY, this);
    
          var styleReset = {inner: {}, outer: {}};
    
          styleReset.inner = {position: '', top: '', left: '', bottom: '', width: '',  transform: ''};
          styleReset.outer = {height: '', position: ''};
    
          for( let key in styleReset.outer )
            this.sidebar.style[key] = styleReset.outer[key];
    
          for( let key in styleReset.inner )
            this.sidebarInner.style[key] = styleReset.inner[key];
    
          if( this.options.resizeSensor && 'undefined' !== typeof ResizeSensor ){
            ResizeSensor.detach(this.sidebarInner, this.handleEvent);
            ResizeSensor.detach(this.container, this.handleEvent);
          }
        }
    
        /**
         * Determine if the browser supports CSS transform feature.
         * @function
         * @static
         * @param {Boolean} transform3d - Detect transform with translate3d.
         * @return {String}
         */
        static supportTransform(transform3d){
          var result = false,
              property = (transform3d) ? 'perspective' : 'transform',
              upper = property.charAt(0).toUpperCase() + property.slice(1),
              prefixes = ['Webkit', 'Moz', 'O', 'ms'],
              support = document.createElement('support'),
              style = support.style;
    
          (property + ' ' + prefixes.join(upper + ' ') + upper).split(' ').forEach(function(property, i) {
            if (style[property] !== undefined) {
              result = property;
              return false;
            }
          });
          return result;
        }
    
        /**
         * Trigger custom event.
         * @static
         * @param {DOMObject} element - Target element on the DOM.
         * @param {String} eventName - Event name.
         * @param {Object} data - 
         */
        static eventTrigger(element, eventName, data){
          try{
            var event = new CustomEvent(eventName, {detail: data});
          } catch(e){
            var event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, data);
          }
          element.dispatchEvent(event);
        }
    
        /**
         * Extend options object with defaults.
         * @function
         * @static
         */
        static extend(defaults, options){
          var results = {};
          for( let key in defaults ){
            if( 'undefined' !== typeof options[key] ) results[key] = options[key];
            else results[key] = defaults[key];
          }
          return results;
        }
    
        /**
         * Get current coordinates left and top of specific element.
         * @static
         */
        static offsetRelative(element){
          var result = {left: 0, top: 0};

          do{
            let offsetTop = element.offsetTop;
            let offsetLeft = element.offsetLeft;
    
            if( ! isNaN(offsetTop) )
              result.top += offsetTop;
    
            if( ! isNaN(offsetLeft) )
              result.left += offsetLeft;

            element = ( 'BODY' === element.tagName ) ?
                        element.parentElement : element.offsetParent;
          } while(element)
          return result;
        }
    
        /**
         * Add specific class name to specific element.
         * @static 
         * @param {ObjectDOM} element 
         * @param {String} className 
         */
        static addClass(element, className){
          if( ! StickySidebar.hasClass(element, className) ){
            if (element.classList)
              element.classList.add(className);
            else
              element.className += ' ' + className;
          }
        }
        
        /**
         * Remove specific class name to specific element
         * @static
         * @param {ObjectDOM} element 
         * @param {String} className 
         */
        static removeClass(element, className){
          if( StickySidebar.hasClass(element, className) ){
            if (element.classList)
              element.classList.remove(className);
            else
              element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
          }
        }

        /**
         * Determine weather the element has specific class name.
         * @static
         * @param {ObjectDOM} element 
         * @param {String} className 
         */
        static hasClass(element, className){
          if (element.classList)
            return element.classList.contains(className);
          else
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        }
      }
    
      return StickySidebar;
    })();
    
    // Global
    // -------------------------
    window.StickySidebar = StickySidebar;

  if (document.querySelector('.sidebar')) {
    new StickySidebar('.sidebar', {
      containerSelector: '.layout',
      innerWrapperSelector: '.sidebar__inner',
      topSpacing: 30,
      bottomSpacing: 20
    });
  }

}());

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXMiOlsic3JjL3NjcmlwdHMvbW9kdWxlcy9BbmltYXRlLmpzIiwibm9kZV9tb2R1bGVzL0BzcGxpZGVqcy9zcGxpZGUvZGlzdC9qcy9zcGxpZGUuZXNtLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9DYXJvdXNlbC5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvVG9nZ2xlTmF2LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZWxpZ2h0Ym94L2Rpc3Qvc2ltcGxlLWxpZ2h0Ym94Lm1vZHVsZXMuanMiLCJzcmMvc2NyaXB0cy9tb2R1bGVzL0xpZ2h0Ym94LmpzIiwibm9kZV9tb2R1bGVzL3N0aWNreS1zaWRlYmFyL3NyYy9zdGlja3ktc2lkZWJhci5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvU3RpY2t5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBBbmltYXRlXHJcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIC0gYWRkIGNsYXNzIHRvIGVsZW1lbnQgaW4gdmlld3BvcnRcclxuICogLSBpZiB5b3Ugd2FudCBkaXNhYmxlIGFuaW1hdGUgZGVsYXkgb24gbW9iaWxlIHVzZSBbYW5pbWF0ZS1kZWxheS1kZXNrdG9wXVxyXG4gKiAtIHNldCBhbmltYXRpb24gZGVsYXkgdmlhIFthbmltYXRlLWRlbGF5XSBodG1sIGF0dHJpYnV0ZVxyXG4gKiAtIHNldCB2aXNpYmxlIHRocmVzaG9sZCB2aWEgW2FuaW1hdGUtdGhyZXNob2xkXSBodG1sIGF0dHJpYnV0ZVxyXG4gKi9cclxuXHJcbiBjb25zdCBJU01PQklMRSA9IHdpbmRvdy5tYXRjaE1lZGlhKFwib25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2OHB4KVwiKS5tYXRjaGVzXHJcbiBjb25zdCBUSFJFU0hPTEQgPSAnMC43NSdcclxuIGNvbnN0IExPQURfVEhSRVNIT0xEID0gJzAuMidcclxuIGNvbnN0IEVMRU1FTlRTID0gJy5hbmltYXRlJ1xyXG4gY29uc3QgVklTSUJMRV9DTEFTUyA9ICdhbmltYXRlLS12aXNpYmxlJ1xyXG5cclxuIGNsYXNzIEFuaW1hdGUge1xyXG4gICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VjdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKEVMRU1FTlRTKVxyXG4gICAgdGhpcy5USFJFU0hPTEQgPSBUSFJFU0hPTERcclxuICAgIHRoaXMuTE9BRF9USFJFU0hPTEQgPSBMT0FEX1RIUkVTSE9MRFxyXG5cclxuICAgICAgaWYoJ0ludGVyc2VjdGlvbk9ic2VydmVyJyBpbiB3aW5kb3cpIHtcclxuICAgICAgICB0aGlzLnNlY3Rpb25zLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgIGNvbnN0IEJvdW5kaW5nQ2xpZW50UmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgIGNvbnN0IHZpc2libGVSYXRpbyA9ICBCb3VuZGluZ0NsaWVudFJlY3QuaGVpZ2h0IC8gd2luZG93LmlubmVySGVpZ2h0XHJcblxyXG4gICAgICAgICBpZih2aXNpYmxlUmF0aW8gPiAwLjk1KXtcclxuICAgICAgICAgICB0aGlzLlRIUkVTSE9MRCA9ICB3aW5kb3cuaW5uZXJIZWlnaHQgLyBCb3VuZGluZ0NsaWVudFJlY3QuaGVpZ2h0IC8gMTAwICogMzBcclxuICAgICAgICAgICB0aGlzLkxPQURfVEhSRVNIT0xEID0gd2luZG93LmlubmVySGVpZ2h0IC8gQm91bmRpbmdDbGllbnRSZWN0LmhlaWdodCAvIDEwMCAqIDIwXHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBvYnNlcnZlIG9uIHBhZ2UgbG9hZFxyXG4gICAgICAgICAgY29uc3QgbG9hZE9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKHRoaXMub2JzZXJ2ZUNhbGxiYWNrLCB7XHJcbiAgICAgICAgICAgIHRocmVzaG9sZDogdGhpcy5MT0FEX1RIUkVTSE9MRFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBsb2FkT2JzZXJ2ZXIub2JzZXJ2ZShlbCk7XHJcblxyXG5cclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgfSwgMTAwKTtcclxuXHJcbiAgICAgICAgICAvLyBvYnNlcnZlXHJcbiAgICAgICAgICBjb25zdCBvYnNlcnZlclRocmVzaG9sZCA9IGVsLmdldEF0dHJpYnV0ZSgnYW5pbWF0ZS10aHJlc2hvbGQnKSA/IGVsLmdldEF0dHJpYnV0ZSgnYW5pbWF0ZS10aHJlc2hvbGQnKSA6IHRoaXMuVEhSRVNIT0xEXHJcbiAgICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcih0aGlzLm9ic2VydmVDYWxsYmFjaywge1xyXG4gICAgICAgICAgICB0aHJlc2hvbGQ6IG9ic2VydmVyVGhyZXNob2xkXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWwpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZWN0aW9ucy5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChWSVNJQkxFX0NMQVNTKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgfVxyXG5cclxuICAgIG9ic2VydmVDYWxsYmFjayA9IChlbnRyaWVzKSA9PiB7XHJcbiAgICAgIGVudHJpZXMubWFwKChlbnRyeSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlY3Rpb24gPSBlbnRyeS50YXJnZXQ7XHJcbiAgICAgICAgY29uc3QgZGVsYXkgPSB0aGlzLmdldERlbGF5KHNlY3Rpb24pXHJcbiAgICAgICAgY29uc3Qgc2VjdGlvbkJvZHlDbGFzcyA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCdhbmltYXRlLWJvZHktY2xhc3MnKVxyXG5cclxuICAgICAgICBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcclxuICAgICAgICAgIGlmKElTTU9CSUxFICYmIHNlY3Rpb24uZ2V0QXR0cmlidXRlKCdhbmltYXRlLWRlbGF5LWRlc2t0b3AnKSl7XHJcbiAgICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZChWSVNJQkxFX0NMQVNTKVxyXG5cclxuICAgICAgICAgICAgdGhpcy5ib2R5Q2xhc3Moc2VjdGlvbkJvZHlDbGFzcywgJ2FkZCcpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoVklTSUJMRV9DTEFTUylcclxuICAgICAgICAgICAgICB0aGlzLmJvZHlDbGFzcyhzZWN0aW9uQm9keUNsYXNzLCAnYWRkJylcclxuICAgICAgICAgICAgfSwgZGVsYXkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuYm9keUNsYXNzKHNlY3Rpb25Cb2R5Q2xhc3MsICdyZW1vdmUnKVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICBnZXREZWxheSA9IChzZWN0aW9uKSA9PiB7XHJcbiAgIHZhciBkZWxheSA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCdhbmltYXRlLWRlbGF5JylcclxuXHJcbiAgIGlmKCFJU01PQklMRSAmJiBzZWN0aW9uLmdldEF0dHJpYnV0ZSgnYW5pbWF0ZS1kZWxheS1kZXNrdG9wJykpe1xyXG4gICAgIHZhciBkZWxheSA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCdhbmltYXRlLWRlbGF5LWRlc2t0b3AnKVxyXG4gICB9XHJcblxyXG4gICBpZiAoZGVsYXkgPT09IG51bGwpIHtcclxuICAgICByZXR1cm4gMFxyXG4gICB9IGVsc2UgaWYgKGRlbGF5LmluY2x1ZGVzKCcuJykpIHtcclxuICAgICByZXR1cm4gcGFyc2VJbnQoZGVsYXkgKiAxMDAwKVxyXG4gICB9IGVsc2Uge1xyXG4gICAgIHJldHVybiBwYXJzZUludChkZWxheSlcclxuICAgfVxyXG4gICB9XHJcblxyXG4gICBib2R5Q2xhc3MgPSAoaHRtbGNsYXNzLCB0eXBlKSA9PiB7XHJcbiAgICAgaWYoIWh0bWxjbGFzcyl7XHJcbiAgICAgICByZXR1cm5cclxuICAgICB9XHJcblxyXG4gICAgICBpZih0eXBlID09ICdhZGQnKXtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoaHRtbGNsYXNzKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShodG1sY2xhc3MpXHJcbiAgICAgIH1cclxuICAgIH1cclxuIH1cclxuXHJcbiBuZXcgQW5pbWF0ZSgpXHJcbiIsIi8qIVxuICogU3BsaWRlLmpzXG4gKiBWZXJzaW9uICA6IDMuMi41XG4gKiBMaWNlbnNlICA6IE1JVFxuICogQ29weXJpZ2h0OiAyMDIxIE5hb3Rvc2hpIEZ1aml0YVxuICovXG5jb25zdCBQUk9KRUNUX0NPREUgPSBcInNwbGlkZVwiO1xuY29uc3QgREFUQV9BVFRSSUJVVEUgPSBgZGF0YS0ke1BST0pFQ1RfQ09ERX1gO1xuXG5jb25zdCBDUkVBVEVEID0gMTtcbmNvbnN0IE1PVU5URUQgPSAyO1xuY29uc3QgSURMRSA9IDM7XG5jb25zdCBNT1ZJTkcgPSA0O1xuY29uc3QgREVTVFJPWUVEID0gNTtcbmNvbnN0IFNUQVRFUyA9IHtcbiAgQ1JFQVRFRCxcbiAgTU9VTlRFRCxcbiAgSURMRSxcbiAgTU9WSU5HLFxuICBERVNUUk9ZRURcbn07XG5cbmNvbnN0IERFRkFVTFRfRVZFTlRfUFJJT1JJVFkgPSAxMDtcbmNvbnN0IERFRkFVTFRfVVNFUl9FVkVOVF9QUklPUklUWSA9IDIwO1xuXG5mdW5jdGlvbiBlbXB0eShhcnJheSkge1xuICBhcnJheS5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChzdWJqZWN0KSB7XG4gIHJldHVybiAhaXNOdWxsKHN1YmplY3QpICYmIHR5cGVvZiBzdWJqZWN0ID09PSBcIm9iamVjdFwiO1xufVxuZnVuY3Rpb24gaXNBcnJheShzdWJqZWN0KSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHN1YmplY3QpO1xufVxuZnVuY3Rpb24gaXNGdW5jdGlvbihzdWJqZWN0KSB7XG4gIHJldHVybiB0eXBlb2Ygc3ViamVjdCA9PT0gXCJmdW5jdGlvblwiO1xufVxuZnVuY3Rpb24gaXNTdHJpbmcoc3ViamVjdCkge1xuICByZXR1cm4gdHlwZW9mIHN1YmplY3QgPT09IFwic3RyaW5nXCI7XG59XG5mdW5jdGlvbiBpc1VuZGVmaW5lZChzdWJqZWN0KSB7XG4gIHJldHVybiB0eXBlb2Ygc3ViamVjdCA9PT0gXCJ1bmRlZmluZWRcIjtcbn1cbmZ1bmN0aW9uIGlzTnVsbChzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0ID09PSBudWxsO1xufVxuZnVuY3Rpb24gaXNIVE1MRWxlbWVudChzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIHRvQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdO1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoKHZhbHVlcywgaXRlcmF0ZWUpIHtcbiAgdG9BcnJheSh2YWx1ZXMpLmZvckVhY2goaXRlcmF0ZWUpO1xufVxuXG5mdW5jdGlvbiBpbmNsdWRlcyhhcnJheSwgdmFsdWUpIHtcbiAgcmV0dXJuIGFycmF5LmluZGV4T2YodmFsdWUpID4gLTE7XG59XG5cbmZ1bmN0aW9uIHB1c2goYXJyYXksIGl0ZW1zKSB7XG4gIGFycmF5LnB1c2goLi4udG9BcnJheShpdGVtcykpO1xuICByZXR1cm4gYXJyYXk7XG59XG5cbmNvbnN0IGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbmZ1bmN0aW9uIHNsaWNlKGFycmF5TGlrZSwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gYXJyYXlQcm90by5zbGljZS5jYWxsKGFycmF5TGlrZSwgc3RhcnQsIGVuZCk7XG59XG5cbmZ1bmN0aW9uIGZpbmQoYXJyYXlMaWtlLCBwcmVkaWNhdGUpIHtcbiAgcmV0dXJuIHNsaWNlKGFycmF5TGlrZSkuZmlsdGVyKHByZWRpY2F0ZSlbMF07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUNsYXNzKGVsbSwgY2xhc3NlcywgYWRkKSB7XG4gIGlmIChlbG0pIHtcbiAgICBmb3JFYWNoKGNsYXNzZXMsIChuYW1lKSA9PiB7XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICBlbG0uY2xhc3NMaXN0W2FkZCA/IFwiYWRkXCIgOiBcInJlbW92ZVwiXShuYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRDbGFzcyhlbG0sIGNsYXNzZXMpIHtcbiAgdG9nZ2xlQ2xhc3MoZWxtLCBpc1N0cmluZyhjbGFzc2VzKSA/IGNsYXNzZXMuc3BsaXQoXCIgXCIpIDogY2xhc3NlcywgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZChwYXJlbnQsIGNoaWxkcmVuKSB7XG4gIGZvckVhY2goY2hpbGRyZW4sIHBhcmVudC5hcHBlbmRDaGlsZC5iaW5kKHBhcmVudCkpO1xufVxuXG5mdW5jdGlvbiBiZWZvcmUobm9kZXMsIHJlZikge1xuICBmb3JFYWNoKG5vZGVzLCAobm9kZSkgPT4ge1xuICAgIGNvbnN0IHBhcmVudCA9IHJlZi5wYXJlbnROb2RlO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgcmVmKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzKGVsbSwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIChlbG1bXCJtc01hdGNoZXNTZWxlY3RvclwiXSB8fCBlbG0ubWF0Y2hlcykuY2FsbChlbG0sIHNlbGVjdG9yKTtcbn1cblxuZnVuY3Rpb24gY2hpbGRyZW4ocGFyZW50LCBzZWxlY3Rvcikge1xuICByZXR1cm4gcGFyZW50ID8gc2xpY2UocGFyZW50LmNoaWxkcmVuKS5maWx0ZXIoKGNoaWxkKSA9PiBtYXRjaGVzKGNoaWxkLCBzZWxlY3RvcikpIDogW107XG59XG5cbmZ1bmN0aW9uIGNoaWxkKHBhcmVudCwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHNlbGVjdG9yID8gY2hpbGRyZW4ocGFyZW50LCBzZWxlY3RvcilbMF0gOiBwYXJlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGZvck93bihvYmplY3QsIGl0ZXJhdGVlLCByaWdodCkge1xuICBpZiAob2JqZWN0KSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuICAgIGtleXMgPSByaWdodCA/IGtleXMucmV2ZXJzZSgpIDoga2V5cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoa2V5ICE9PSBcIl9fcHJvdG9fX1wiKSB7XG4gICAgICAgIGlmIChpdGVyYXRlZShvYmplY3Rba2V5XSwga2V5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBhc3NpZ24ob2JqZWN0KSB7XG4gIHNsaWNlKGFyZ3VtZW50cywgMSkuZm9yRWFjaCgoc291cmNlKSA9PiB7XG4gICAgZm9yT3duKHNvdXJjZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIG9iamVjdFtrZXldID0gc291cmNlW2tleV07XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBtZXJnZShvYmplY3QsIHNvdXJjZSkge1xuICBmb3JPd24oc291cmNlLCAodmFsdWUsIGtleSkgPT4ge1xuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgb2JqZWN0W2tleV0gPSB2YWx1ZS5zbGljZSgpO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICBvYmplY3Rba2V5XSA9IG1lcmdlKGlzT2JqZWN0KG9iamVjdFtrZXldKSA/IG9iamVjdFtrZXldIDoge30sIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiByZW1vdmVBdHRyaWJ1dGUoZWxtLCBhdHRycykge1xuICBpZiAoZWxtKSB7XG4gICAgZm9yRWFjaChhdHRycywgKGF0dHIpID0+IHtcbiAgICAgIGVsbS5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0QXR0cmlidXRlKGVsbSwgYXR0cnMsIHZhbHVlKSB7XG4gIGlmIChpc09iamVjdChhdHRycykpIHtcbiAgICBmb3JPd24oYXR0cnMsICh2YWx1ZTIsIG5hbWUpID0+IHtcbiAgICAgIHNldEF0dHJpYnV0ZShlbG0sIG5hbWUsIHZhbHVlMik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgaXNOdWxsKHZhbHVlKSA/IHJlbW92ZUF0dHJpYnV0ZShlbG0sIGF0dHJzKSA6IGVsbS5zZXRBdHRyaWJ1dGUoYXR0cnMsIFN0cmluZyh2YWx1ZSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZSh0YWcsIGF0dHJzLCBwYXJlbnQpIHtcbiAgY29uc3QgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBpZiAoYXR0cnMpIHtcbiAgICBpc1N0cmluZyhhdHRycykgPyBhZGRDbGFzcyhlbG0sIGF0dHJzKSA6IHNldEF0dHJpYnV0ZShlbG0sIGF0dHJzKTtcbiAgfVxuICBwYXJlbnQgJiYgYXBwZW5kKHBhcmVudCwgZWxtKTtcbiAgcmV0dXJuIGVsbTtcbn1cblxuZnVuY3Rpb24gc3R5bGUoZWxtLCBwcm9wLCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUoZWxtKVtwcm9wXTtcbiAgfVxuICBpZiAoIWlzTnVsbCh2YWx1ZSkpIHtcbiAgICBjb25zdCB7IHN0eWxlOiBzdHlsZTIgfSA9IGVsbTtcbiAgICB2YWx1ZSA9IGAke3ZhbHVlfWA7XG4gICAgaWYgKHN0eWxlMltwcm9wXSAhPT0gdmFsdWUpIHtcbiAgICAgIHN0eWxlMltwcm9wXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkaXNwbGF5KGVsbSwgZGlzcGxheTIpIHtcbiAgc3R5bGUoZWxtLCBcImRpc3BsYXlcIiwgZGlzcGxheTIpO1xufVxuXG5mdW5jdGlvbiBmb2N1cyhlbG0pIHtcbiAgZWxtW1wic2V0QWN0aXZlXCJdICYmIGVsbVtcInNldEFjdGl2ZVwiXSgpIHx8IGVsbS5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEF0dHJpYnV0ZShlbG0sIGF0dHIpIHtcbiAgcmV0dXJuIGVsbS5nZXRBdHRyaWJ1dGUoYXR0cik7XG59XG5cbmZ1bmN0aW9uIGhhc0NsYXNzKGVsbSwgY2xhc3NOYW1lKSB7XG4gIHJldHVybiBlbG0gJiYgZWxtLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpO1xufVxuXG5mdW5jdGlvbiByZWN0KHRhcmdldCkge1xuICByZXR1cm4gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xufVxuXG5mdW5jdGlvbiByZW1vdmUobm9kZXMpIHtcbiAgZm9yRWFjaChub2RlcywgKG5vZGUpID0+IHtcbiAgICBpZiAobm9kZSAmJiBub2RlLnBhcmVudE5vZGUpIHtcbiAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtZWFzdXJlKHBhcmVudCwgdmFsdWUpIHtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIGNvbnN0IGRpdiA9IGNyZWF0ZShcImRpdlwiLCB7IHN0eWxlOiBgd2lkdGg6ICR7dmFsdWV9OyBwb3NpdGlvbjogYWJzb2x1dGU7YCB9LCBwYXJlbnQpO1xuICAgIHZhbHVlID0gcmVjdChkaXYpLndpZHRoO1xuICAgIHJlbW92ZShkaXYpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VIdG1sKGh0bWwpIHtcbiAgcmV0dXJuIGNoaWxkKG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoaHRtbCwgXCJ0ZXh0L2h0bWxcIikuYm9keSk7XG59XG5cbmZ1bmN0aW9uIHByZXZlbnQoZSwgc3RvcFByb3BhZ2F0aW9uKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgaWYgKHN0b3BQcm9wYWdhdGlvbikge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBxdWVyeShwYXJlbnQsIHNlbGVjdG9yKSB7XG4gIHJldHVybiBwYXJlbnQgJiYgcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xufVxuXG5mdW5jdGlvbiBxdWVyeUFsbChwYXJlbnQsIHNlbGVjdG9yKSB7XG4gIHJldHVybiBzbGljZShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbG0sIGNsYXNzZXMpIHtcbiAgdG9nZ2xlQ2xhc3MoZWxtLCBjbGFzc2VzLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVuaXQodmFsdWUpIHtcbiAgcmV0dXJuIGlzU3RyaW5nKHZhbHVlKSA/IHZhbHVlIDogdmFsdWUgPyBgJHt2YWx1ZX1weGAgOiBcIlwiO1xufVxuXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtZXNzYWdlID0gXCJcIikge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihgWyR7UFJPSkVDVF9DT0RFfV0gJHttZXNzYWdlfWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIG5leHRUaWNrKGNhbGxiYWNrKSB7XG4gIHNldFRpbWVvdXQoY2FsbGJhY2spO1xufVxuXG5jb25zdCBub29wID0gKCkgPT4ge1xufTtcblxuZnVuY3Rpb24gcmFmKGZ1bmMpIHtcbiAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jKTtcbn1cblxuY29uc3QgeyBtaW4sIG1heCwgZmxvb3IsIGNlaWwsIGFicyB9ID0gTWF0aDtcblxuZnVuY3Rpb24gYXBwcm94aW1hdGVseUVxdWFsKHgsIHksIGVwc2lsb24pIHtcbiAgcmV0dXJuIGFicyh4IC0geSkgPCBlcHNpbG9uO1xufVxuXG5mdW5jdGlvbiBiZXR3ZWVuKG51bWJlciwgbWluT3JNYXgsIG1heE9yTWluLCBleGNsdXNpdmUpIHtcbiAgY29uc3QgbWluaW11bSA9IG1pbihtaW5Pck1heCwgbWF4T3JNaW4pO1xuICBjb25zdCBtYXhpbXVtID0gbWF4KG1pbk9yTWF4LCBtYXhPck1pbik7XG4gIHJldHVybiBleGNsdXNpdmUgPyBtaW5pbXVtIDwgbnVtYmVyICYmIG51bWJlciA8IG1heGltdW0gOiBtaW5pbXVtIDw9IG51bWJlciAmJiBudW1iZXIgPD0gbWF4aW11bTtcbn1cblxuZnVuY3Rpb24gY2xhbXAobnVtYmVyLCB4LCB5KSB7XG4gIGNvbnN0IG1pbmltdW0gPSBtaW4oeCwgeSk7XG4gIGNvbnN0IG1heGltdW0gPSBtYXgoeCwgeSk7XG4gIHJldHVybiBtaW4obWF4KG1pbmltdW0sIG51bWJlciksIG1heGltdW0pO1xufVxuXG5mdW5jdGlvbiBzaWduKHgpIHtcbiAgcmV0dXJuICsoeCA+IDApIC0gKyh4IDwgMCk7XG59XG5cbmZ1bmN0aW9uIGNhbWVsVG9LZWJhYihzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8oW2EtejAtOV0pKFtBLVpdKS9nLCBcIiQxLSQyXCIpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdChzdHJpbmcsIHJlcGxhY2VtZW50cykge1xuICBmb3JFYWNoKHJlcGxhY2VtZW50cywgKHJlcGxhY2VtZW50KSA9PiB7XG4gICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoXCIlc1wiLCBgJHtyZXBsYWNlbWVudH1gKTtcbiAgfSk7XG4gIHJldHVybiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHBhZChudW1iZXIpIHtcbiAgcmV0dXJuIG51bWJlciA8IDEwID8gYDAke251bWJlcn1gIDogYCR7bnVtYmVyfWA7XG59XG5cbmNvbnN0IGlkcyA9IHt9O1xuZnVuY3Rpb24gdW5pcXVlSWQocHJlZml4KSB7XG4gIHJldHVybiBgJHtwcmVmaXh9JHtwYWQoaWRzW3ByZWZpeF0gPSAoaWRzW3ByZWZpeF0gfHwgMCkgKyAxKX1gO1xufVxuXG5mdW5jdGlvbiBFdmVudEJ1cygpIHtcbiAgbGV0IGhhbmRsZXJzID0ge307XG4gIGZ1bmN0aW9uIG9uKGV2ZW50cywgY2FsbGJhY2ssIGtleSwgcHJpb3JpdHkgPSBERUZBVUxUX0VWRU5UX1BSSU9SSVRZKSB7XG4gICAgZm9yRWFjaEV2ZW50KGV2ZW50cywgKGV2ZW50LCBuYW1lc3BhY2UpID0+IHtcbiAgICAgIGhhbmRsZXJzW2V2ZW50XSA9IGhhbmRsZXJzW2V2ZW50XSB8fCBbXTtcbiAgICAgIHB1c2goaGFuZGxlcnNbZXZlbnRdLCB7XG4gICAgICAgIF9ldmVudDogZXZlbnQsXG4gICAgICAgIF9jYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICAgIF9uYW1lc3BhY2U6IG5hbWVzcGFjZSxcbiAgICAgICAgX3ByaW9yaXR5OiBwcmlvcml0eSxcbiAgICAgICAgX2tleToga2V5XG4gICAgICB9KS5zb3J0KChoYW5kbGVyMSwgaGFuZGxlcjIpID0+IGhhbmRsZXIxLl9wcmlvcml0eSAtIGhhbmRsZXIyLl9wcmlvcml0eSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb2ZmKGV2ZW50cywga2V5KSB7XG4gICAgZm9yRWFjaEV2ZW50KGV2ZW50cywgKGV2ZW50LCBuYW1lc3BhY2UpID0+IHtcbiAgICAgIGNvbnN0IGV2ZW50SGFuZGxlcnMgPSBoYW5kbGVyc1tldmVudF07XG4gICAgICBoYW5kbGVyc1tldmVudF0gPSBldmVudEhhbmRsZXJzICYmIGV2ZW50SGFuZGxlcnMuZmlsdGVyKChoYW5kbGVyKSA9PiB7XG4gICAgICAgIHJldHVybiBoYW5kbGVyLl9rZXkgPyBoYW5kbGVyLl9rZXkgIT09IGtleSA6IGtleSB8fCBoYW5kbGVyLl9uYW1lc3BhY2UgIT09IG5hbWVzcGFjZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9mZkJ5KGtleSkge1xuICAgIGZvck93bihoYW5kbGVycywgKGV2ZW50SGFuZGxlcnMsIGV2ZW50KSA9PiB7XG4gICAgICBvZmYoZXZlbnQsIGtleSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gZW1pdChldmVudCkge1xuICAgIChoYW5kbGVyc1tldmVudF0gfHwgW10pLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgIGhhbmRsZXIuX2NhbGxiYWNrLmFwcGx5KGhhbmRsZXIsIHNsaWNlKGFyZ3VtZW50cywgMSkpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgaGFuZGxlcnMgPSB7fTtcbiAgfVxuICBmdW5jdGlvbiBmb3JFYWNoRXZlbnQoZXZlbnRzLCBpdGVyYXRlZSkge1xuICAgIHRvQXJyYXkoZXZlbnRzKS5qb2luKFwiIFwiKS5zcGxpdChcIiBcIikuZm9yRWFjaCgoZXZlbnROUykgPT4ge1xuICAgICAgY29uc3QgZnJhZ21lbnRzID0gZXZlbnROUy5zcGxpdChcIi5cIik7XG4gICAgICBpdGVyYXRlZShmcmFnbWVudHNbMF0sIGZyYWdtZW50c1sxXSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBvbixcbiAgICBvZmYsXG4gICAgb2ZmQnksXG4gICAgZW1pdCxcbiAgICBkZXN0cm95XG4gIH07XG59XG5cbmNvbnN0IEVWRU5UX01PVU5URUQgPSBcIm1vdW50ZWRcIjtcbmNvbnN0IEVWRU5UX1JFQURZID0gXCJyZWFkeVwiO1xuY29uc3QgRVZFTlRfTU9WRSA9IFwibW92ZVwiO1xuY29uc3QgRVZFTlRfTU9WRUQgPSBcIm1vdmVkXCI7XG5jb25zdCBFVkVOVF9DTElDSyA9IFwiY2xpY2tcIjtcbmNvbnN0IEVWRU5UX0FDVElWRSA9IFwiYWN0aXZlXCI7XG5jb25zdCBFVkVOVF9JTkFDVElWRSA9IFwiaW5hY3RpdmVcIjtcbmNvbnN0IEVWRU5UX1ZJU0lCTEUgPSBcInZpc2libGVcIjtcbmNvbnN0IEVWRU5UX0hJRERFTiA9IFwiaGlkZGVuXCI7XG5jb25zdCBFVkVOVF9TTElERV9LRVlET1dOID0gXCJzbGlkZTprZXlkb3duXCI7XG5jb25zdCBFVkVOVF9SRUZSRVNIID0gXCJyZWZyZXNoXCI7XG5jb25zdCBFVkVOVF9VUERBVEVEID0gXCJ1cGRhdGVkXCI7XG5jb25zdCBFVkVOVF9SRVNJWkUgPSBcInJlc2l6ZVwiO1xuY29uc3QgRVZFTlRfUkVTSVpFRCA9IFwicmVzaXplZFwiO1xuY29uc3QgRVZFTlRfUkVQT1NJVElPTkVEID0gXCJyZXBvc2l0aW9uZWRcIjtcbmNvbnN0IEVWRU5UX0RSQUcgPSBcImRyYWdcIjtcbmNvbnN0IEVWRU5UX0RSQUdHSU5HID0gXCJkcmFnZ2luZ1wiO1xuY29uc3QgRVZFTlRfRFJBR0dFRCA9IFwiZHJhZ2dlZFwiO1xuY29uc3QgRVZFTlRfU0NST0xMID0gXCJzY3JvbGxcIjtcbmNvbnN0IEVWRU5UX1NDUk9MTEVEID0gXCJzY3JvbGxlZFwiO1xuY29uc3QgRVZFTlRfREVTVFJPWSA9IFwiZGVzdHJveVwiO1xuY29uc3QgRVZFTlRfQVJST1dTX01PVU5URUQgPSBcImFycm93czptb3VudGVkXCI7XG5jb25zdCBFVkVOVF9BUlJPV1NfVVBEQVRFRCA9IFwiYXJyb3dzOnVwZGF0ZWRcIjtcbmNvbnN0IEVWRU5UX1BBR0lOQVRJT05fTU9VTlRFRCA9IFwicGFnaW5hdGlvbjptb3VudGVkXCI7XG5jb25zdCBFVkVOVF9QQUdJTkFUSU9OX1VQREFURUQgPSBcInBhZ2luYXRpb246dXBkYXRlZFwiO1xuY29uc3QgRVZFTlRfTkFWSUdBVElPTl9NT1VOVEVEID0gXCJuYXZpZ2F0aW9uOm1vdW50ZWRcIjtcbmNvbnN0IEVWRU5UX0FVVE9QTEFZX1BMQVkgPSBcImF1dG9wbGF5OnBsYXlcIjtcbmNvbnN0IEVWRU5UX0FVVE9QTEFZX1BMQVlJTkcgPSBcImF1dG9wbGF5OnBsYXlpbmdcIjtcbmNvbnN0IEVWRU5UX0FVVE9QTEFZX1BBVVNFID0gXCJhdXRvcGxheTpwYXVzZVwiO1xuY29uc3QgRVZFTlRfTEFaWUxPQURfTE9BREVEID0gXCJsYXp5bG9hZDpsb2FkZWRcIjtcblxuZnVuY3Rpb24gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMikge1xuICBjb25zdCB7IGV2ZW50IH0gPSBTcGxpZGUyO1xuICBjb25zdCBrZXkgPSB7fTtcbiAgbGV0IGxpc3RlbmVycyA9IFtdO1xuICBmdW5jdGlvbiBvbihldmVudHMsIGNhbGxiYWNrLCBwcmlvcml0eSkge1xuICAgIGV2ZW50Lm9uKGV2ZW50cywgY2FsbGJhY2ssIGtleSwgcHJpb3JpdHkpO1xuICB9XG4gIGZ1bmN0aW9uIG9mZihldmVudHMpIHtcbiAgICBldmVudC5vZmYoZXZlbnRzLCBrZXkpO1xuICB9XG4gIGZ1bmN0aW9uIGJpbmQodGFyZ2V0cywgZXZlbnRzLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvckVhY2hFdmVudCh0YXJnZXRzLCBldmVudHMsICh0YXJnZXQsIGV2ZW50MikgPT4ge1xuICAgICAgbGlzdGVuZXJzLnB1c2goW3RhcmdldCwgZXZlbnQyLCBjYWxsYmFjaywgb3B0aW9uc10pO1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQyLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gdW5iaW5kKHRhcmdldHMsIGV2ZW50cywgY2FsbGJhY2spIHtcbiAgICBmb3JFYWNoRXZlbnQodGFyZ2V0cywgZXZlbnRzLCAodGFyZ2V0LCBldmVudDIpID0+IHtcbiAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5maWx0ZXIoKGxpc3RlbmVyKSA9PiB7XG4gICAgICAgIGlmIChsaXN0ZW5lclswXSA9PT0gdGFyZ2V0ICYmIGxpc3RlbmVyWzFdID09PSBldmVudDIgJiYgKCFjYWxsYmFjayB8fCBsaXN0ZW5lclsyXSA9PT0gY2FsbGJhY2spKSB7XG4gICAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQyLCBsaXN0ZW5lclsyXSwgbGlzdGVuZXJbM10pO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGZvckVhY2hFdmVudCh0YXJnZXRzLCBldmVudHMsIGl0ZXJhdGVlKSB7XG4gICAgZm9yRWFjaCh0YXJnZXRzLCAodGFyZ2V0KSA9PiB7XG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIGV2ZW50cy5zcGxpdChcIiBcIikuZm9yRWFjaChpdGVyYXRlZS5iaW5kKG51bGwsIHRhcmdldCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLmZpbHRlcigoZGF0YSkgPT4gdW5iaW5kKGRhdGFbMF0sIGRhdGFbMV0pKTtcbiAgICBldmVudC5vZmZCeShrZXkpO1xuICB9XG4gIGV2ZW50Lm9uKEVWRU5UX0RFU1RST1ksIGRlc3Ryb3ksIGtleSk7XG4gIHJldHVybiB7XG4gICAgb24sXG4gICAgb2ZmLFxuICAgIGVtaXQ6IGV2ZW50LmVtaXQsXG4gICAgYmluZCxcbiAgICB1bmJpbmQsXG4gICAgZGVzdHJveVxuICB9O1xufVxuXG5mdW5jdGlvbiBSZXF1ZXN0SW50ZXJ2YWwoaW50ZXJ2YWwsIG9uSW50ZXJ2YWwsIG9uVXBkYXRlLCBsaW1pdCkge1xuICBjb25zdCB7IG5vdyB9ID0gRGF0ZTtcbiAgbGV0IHN0YXJ0VGltZTtcbiAgbGV0IHJhdGUgPSAwO1xuICBsZXQgaWQ7XG4gIGxldCBwYXVzZWQgPSB0cnVlO1xuICBsZXQgY291bnQgPSAwO1xuICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgaWYgKCFwYXVzZWQpIHtcbiAgICAgIGNvbnN0IGVsYXBzZWQgPSBub3coKSAtIHN0YXJ0VGltZTtcbiAgICAgIGlmIChlbGFwc2VkID49IGludGVydmFsKSB7XG4gICAgICAgIHJhdGUgPSAxO1xuICAgICAgICBzdGFydFRpbWUgPSBub3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJhdGUgPSBlbGFwc2VkIC8gaW50ZXJ2YWw7XG4gICAgICB9XG4gICAgICBpZiAob25VcGRhdGUpIHtcbiAgICAgICAgb25VcGRhdGUocmF0ZSk7XG4gICAgICB9XG4gICAgICBpZiAocmF0ZSA9PT0gMSkge1xuICAgICAgICBvbkludGVydmFsKCk7XG4gICAgICAgIGlmIChsaW1pdCAmJiArK2NvdW50ID49IGxpbWl0KSB7XG4gICAgICAgICAgcmV0dXJuIHBhdXNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJhZih1cGRhdGUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzdGFydChyZXN1bWUpIHtcbiAgICAhcmVzdW1lICYmIGNhbmNlbCgpO1xuICAgIHN0YXJ0VGltZSA9IG5vdygpIC0gKHJlc3VtZSA/IHJhdGUgKiBpbnRlcnZhbCA6IDApO1xuICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgIHJhZih1cGRhdGUpO1xuICB9XG4gIGZ1bmN0aW9uIHBhdXNlKCkge1xuICAgIHBhdXNlZCA9IHRydWU7XG4gIH1cbiAgZnVuY3Rpb24gcmV3aW5kKCkge1xuICAgIHN0YXJ0VGltZSA9IG5vdygpO1xuICAgIHJhdGUgPSAwO1xuICAgIGlmIChvblVwZGF0ZSkge1xuICAgICAgb25VcGRhdGUocmF0ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShpZCk7XG4gICAgcmF0ZSA9IDA7XG4gICAgaWQgPSAwO1xuICAgIHBhdXNlZCA9IHRydWU7XG4gIH1cbiAgZnVuY3Rpb24gaXNQYXVzZWQoKSB7XG4gICAgcmV0dXJuIHBhdXNlZDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHN0YXJ0LFxuICAgIHJld2luZCxcbiAgICBwYXVzZSxcbiAgICBjYW5jZWwsXG4gICAgaXNQYXVzZWRcbiAgfTtcbn1cblxuZnVuY3Rpb24gU3RhdGUoaW5pdGlhbFN0YXRlKSB7XG4gIGxldCBzdGF0ZSA9IGluaXRpYWxTdGF0ZTtcbiAgZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgc3RhdGUgPSB2YWx1ZTtcbiAgfVxuICBmdW5jdGlvbiBpcyhzdGF0ZXMpIHtcbiAgICByZXR1cm4gaW5jbHVkZXModG9BcnJheShzdGF0ZXMpLCBzdGF0ZSk7XG4gIH1cbiAgcmV0dXJuIHsgc2V0LCBpcyB9O1xufVxuXG5mdW5jdGlvbiBUaHJvdHRsZShmdW5jLCBkdXJhdGlvbikge1xuICBsZXQgaW50ZXJ2YWw7XG4gIGZ1bmN0aW9uIHRocm90dGxlZCgpIHtcbiAgICBpZiAoIWludGVydmFsKSB7XG4gICAgICBpbnRlcnZhbCA9IFJlcXVlc3RJbnRlcnZhbChkdXJhdGlvbiB8fCAwLCAoKSA9PiB7XG4gICAgICAgIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgaW50ZXJ2YWwgPSBudWxsO1xuICAgICAgfSwgbnVsbCwgMSk7XG4gICAgICBpbnRlcnZhbC5zdGFydCgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhyb3R0bGVkO1xufVxuXG5mdW5jdGlvbiBPcHRpb25zKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHRocm90dGxlZE9ic2VydmUgPSBUaHJvdHRsZShvYnNlcnZlKTtcbiAgbGV0IGluaXRpYWxPcHRpb25zO1xuICBsZXQgcG9pbnRzO1xuICBsZXQgY3VyclBvaW50O1xuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICB0cnkge1xuICAgICAgbWVyZ2Uob3B0aW9ucywgSlNPTi5wYXJzZShnZXRBdHRyaWJ1dGUoU3BsaWRlMi5yb290LCBEQVRBX0FUVFJJQlVURSkpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBhc3NlcnQoZmFsc2UsIGUubWVzc2FnZSk7XG4gICAgfVxuICAgIGluaXRpYWxPcHRpb25zID0gbWVyZ2Uoe30sIG9wdGlvbnMpO1xuICAgIGNvbnN0IHsgYnJlYWtwb2ludHMgfSA9IG9wdGlvbnM7XG4gICAgaWYgKGJyZWFrcG9pbnRzKSB7XG4gICAgICBjb25zdCBpc01pbiA9IG9wdGlvbnMubWVkaWFRdWVyeSA9PT0gXCJtaW5cIjtcbiAgICAgIHBvaW50cyA9IE9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKS5zb3J0KChuLCBtKSA9PiBpc01pbiA/ICttIC0gK24gOiArbiAtICttKS5tYXAoKHBvaW50KSA9PiBbXG4gICAgICAgIHBvaW50LFxuICAgICAgICBtYXRjaE1lZGlhKGAoJHtpc01pbiA/IFwibWluXCIgOiBcIm1heFwifS13aWR0aDoke3BvaW50fXB4KWApXG4gICAgICBdKTtcbiAgICAgIG9ic2VydmUoKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaWYgKHBvaW50cykge1xuICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aHJvdHRsZWRPYnNlcnZlKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZGVzdHJveShjb21wbGV0ZWx5KSB7XG4gICAgaWYgKGNvbXBsZXRlbHkpIHtcbiAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhyb3R0bGVkT2JzZXJ2ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG9ic2VydmUoKSB7XG4gICAgY29uc3QgaXRlbSA9IGZpbmQocG9pbnRzLCAoaXRlbTIpID0+IGl0ZW0yWzFdLm1hdGNoZXMpIHx8IFtdO1xuICAgIGlmIChpdGVtWzBdICE9PSBjdXJyUG9pbnQpIHtcbiAgICAgIG9uTWF0Y2goY3VyclBvaW50ID0gaXRlbVswXSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG9uTWF0Y2gocG9pbnQpIHtcbiAgICBjb25zdCBuZXdPcHRpb25zID0gb3B0aW9ucy5icmVha3BvaW50c1twb2ludF0gfHwgaW5pdGlhbE9wdGlvbnM7XG4gICAgaWYgKG5ld09wdGlvbnMuZGVzdHJveSkge1xuICAgICAgU3BsaWRlMi5vcHRpb25zID0gaW5pdGlhbE9wdGlvbnM7XG4gICAgICBTcGxpZGUyLmRlc3Ryb3kobmV3T3B0aW9ucy5kZXN0cm95ID09PSBcImNvbXBsZXRlbHlcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChTcGxpZGUyLnN0YXRlLmlzKERFU1RST1lFRCkpIHtcbiAgICAgICAgZGVzdHJveSh0cnVlKTtcbiAgICAgICAgU3BsaWRlMi5tb3VudCgpO1xuICAgICAgfVxuICAgICAgU3BsaWRlMi5vcHRpb25zID0gbmV3T3B0aW9ucztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBzZXR1cCxcbiAgICBtb3VudCxcbiAgICBkZXN0cm95XG4gIH07XG59XG5cbmNvbnN0IFJUTCA9IFwicnRsXCI7XG5jb25zdCBUVEIgPSBcInR0YlwiO1xuXG5jb25zdCBPUklFTlRBVElPTl9NQVAgPSB7XG4gIG1hcmdpblJpZ2h0OiBbXCJtYXJnaW5Cb3R0b21cIiwgXCJtYXJnaW5MZWZ0XCJdLFxuICBhdXRvV2lkdGg6IFtcImF1dG9IZWlnaHRcIl0sXG4gIGZpeGVkV2lkdGg6IFtcImZpeGVkSGVpZ2h0XCJdLFxuICBwYWRkaW5nTGVmdDogW1wicGFkZGluZ1RvcFwiLCBcInBhZGRpbmdSaWdodFwiXSxcbiAgcGFkZGluZ1JpZ2h0OiBbXCJwYWRkaW5nQm90dG9tXCIsIFwicGFkZGluZ0xlZnRcIl0sXG4gIHdpZHRoOiBbXCJoZWlnaHRcIl0sXG4gIGxlZnQ6IFtcInRvcFwiLCBcInJpZ2h0XCJdLFxuICByaWdodDogW1wiYm90dG9tXCIsIFwibGVmdFwiXSxcbiAgeDogW1wieVwiXSxcbiAgWDogW1wiWVwiXSxcbiAgWTogW1wiWFwiXSxcbiAgQXJyb3dMZWZ0OiBbXCJBcnJvd1VwXCIsIFwiQXJyb3dSaWdodFwiXSxcbiAgQXJyb3dSaWdodDogW1wiQXJyb3dEb3duXCIsIFwiQXJyb3dMZWZ0XCJdXG59O1xuZnVuY3Rpb24gRGlyZWN0aW9uKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGZ1bmN0aW9uIHJlc29sdmUocHJvcCwgYXhpc09ubHkpIHtcbiAgICBjb25zdCB7IGRpcmVjdGlvbiB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBpbmRleCA9IGRpcmVjdGlvbiA9PT0gUlRMICYmICFheGlzT25seSA/IDEgOiBkaXJlY3Rpb24gPT09IFRUQiA/IDAgOiAtMTtcbiAgICByZXR1cm4gT1JJRU5UQVRJT05fTUFQW3Byb3BdW2luZGV4XSB8fCBwcm9wO1xuICB9XG4gIGZ1bmN0aW9uIG9yaWVudCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAqIChvcHRpb25zLmRpcmVjdGlvbiA9PT0gUlRMID8gMSA6IC0xKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHJlc29sdmUsXG4gICAgb3JpZW50XG4gIH07XG59XG5cbmNvbnN0IENMQVNTX1JPT1QgPSBQUk9KRUNUX0NPREU7XG5jb25zdCBDTEFTU19TTElERVIgPSBgJHtQUk9KRUNUX0NPREV9X19zbGlkZXJgO1xuY29uc3QgQ0xBU1NfVFJBQ0sgPSBgJHtQUk9KRUNUX0NPREV9X190cmFja2A7XG5jb25zdCBDTEFTU19MSVNUID0gYCR7UFJPSkVDVF9DT0RFfV9fbGlzdGA7XG5jb25zdCBDTEFTU19TTElERSA9IGAke1BST0pFQ1RfQ09ERX1fX3NsaWRlYDtcbmNvbnN0IENMQVNTX0NMT05FID0gYCR7Q0xBU1NfU0xJREV9LS1jbG9uZWA7XG5jb25zdCBDTEFTU19DT05UQUlORVIgPSBgJHtDTEFTU19TTElERX1fX2NvbnRhaW5lcmA7XG5jb25zdCBDTEFTU19BUlJPV1MgPSBgJHtQUk9KRUNUX0NPREV9X19hcnJvd3NgO1xuY29uc3QgQ0xBU1NfQVJST1cgPSBgJHtQUk9KRUNUX0NPREV9X19hcnJvd2A7XG5jb25zdCBDTEFTU19BUlJPV19QUkVWID0gYCR7Q0xBU1NfQVJST1d9LS1wcmV2YDtcbmNvbnN0IENMQVNTX0FSUk9XX05FWFQgPSBgJHtDTEFTU19BUlJPV30tLW5leHRgO1xuY29uc3QgQ0xBU1NfUEFHSU5BVElPTiA9IGAke1BST0pFQ1RfQ09ERX1fX3BhZ2luYXRpb25gO1xuY29uc3QgQ0xBU1NfUEFHSU5BVElPTl9QQUdFID0gYCR7Q0xBU1NfUEFHSU5BVElPTn1fX3BhZ2VgO1xuY29uc3QgQ0xBU1NfUFJPR1JFU1MgPSBgJHtQUk9KRUNUX0NPREV9X19wcm9ncmVzc2A7XG5jb25zdCBDTEFTU19QUk9HUkVTU19CQVIgPSBgJHtDTEFTU19QUk9HUkVTU31fX2JhcmA7XG5jb25zdCBDTEFTU19BVVRPUExBWSA9IGAke1BST0pFQ1RfQ09ERX1fX2F1dG9wbGF5YDtcbmNvbnN0IENMQVNTX1BMQVkgPSBgJHtQUk9KRUNUX0NPREV9X19wbGF5YDtcbmNvbnN0IENMQVNTX1BBVVNFID0gYCR7UFJPSkVDVF9DT0RFfV9fcGF1c2VgO1xuY29uc3QgQ0xBU1NfU1BJTk5FUiA9IGAke1BST0pFQ1RfQ09ERX1fX3NwaW5uZXJgO1xuY29uc3QgQ0xBU1NfSU5JVElBTElaRUQgPSBcImlzLWluaXRpYWxpemVkXCI7XG5jb25zdCBDTEFTU19BQ1RJVkUgPSBcImlzLWFjdGl2ZVwiO1xuY29uc3QgQ0xBU1NfUFJFViA9IFwiaXMtcHJldlwiO1xuY29uc3QgQ0xBU1NfTkVYVCA9IFwiaXMtbmV4dFwiO1xuY29uc3QgQ0xBU1NfVklTSUJMRSA9IFwiaXMtdmlzaWJsZVwiO1xuY29uc3QgQ0xBU1NfTE9BRElORyA9IFwiaXMtbG9hZGluZ1wiO1xuY29uc3QgU1RBVFVTX0NMQVNTRVMgPSBbQ0xBU1NfQUNUSVZFLCBDTEFTU19WSVNJQkxFLCBDTEFTU19QUkVWLCBDTEFTU19ORVhULCBDTEFTU19MT0FESU5HXTtcbmNvbnN0IENMQVNTRVMgPSB7XG4gIHNsaWRlOiBDTEFTU19TTElERSxcbiAgY2xvbmU6IENMQVNTX0NMT05FLFxuICBhcnJvd3M6IENMQVNTX0FSUk9XUyxcbiAgYXJyb3c6IENMQVNTX0FSUk9XLFxuICBwcmV2OiBDTEFTU19BUlJPV19QUkVWLFxuICBuZXh0OiBDTEFTU19BUlJPV19ORVhULFxuICBwYWdpbmF0aW9uOiBDTEFTU19QQUdJTkFUSU9OLFxuICBwYWdlOiBDTEFTU19QQUdJTkFUSU9OX1BBR0UsXG4gIHNwaW5uZXI6IENMQVNTX1NQSU5ORVJcbn07XG5cbmZ1bmN0aW9uIEVsZW1lbnRzKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24gfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICBjb25zdCB7IHJvb3QgfSA9IFNwbGlkZTI7XG4gIGNvbnN0IGVsZW1lbnRzID0ge307XG4gIGNvbnN0IHNsaWRlcyA9IFtdO1xuICBsZXQgY2xhc3NlcztcbiAgbGV0IHNsaWRlcjtcbiAgbGV0IHRyYWNrO1xuICBsZXQgbGlzdDtcbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgY29sbGVjdCgpO1xuICAgIGlkZW50aWZ5KCk7XG4gICAgYWRkQ2xhc3Mocm9vdCwgY2xhc3NlcyA9IGdldENsYXNzZXMoKSk7XG4gIH1cbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgb24oRVZFTlRfUkVGUkVTSCwgcmVmcmVzaCwgREVGQVVMVF9FVkVOVF9QUklPUklUWSAtIDIpO1xuICAgIG9uKEVWRU5UX1VQREFURUQsIHVwZGF0ZSk7XG4gIH1cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBbcm9vdCwgdHJhY2ssIGxpc3RdLmZvckVhY2goKGVsbSkgPT4ge1xuICAgICAgcmVtb3ZlQXR0cmlidXRlKGVsbSwgXCJzdHlsZVwiKTtcbiAgICB9KTtcbiAgICBlbXB0eShzbGlkZXMpO1xuICAgIHJlbW92ZUNsYXNzKHJvb3QsIGNsYXNzZXMpO1xuICB9XG4gIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgZGVzdHJveSgpO1xuICAgIHNldHVwKCk7XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHJlbW92ZUNsYXNzKHJvb3QsIGNsYXNzZXMpO1xuICAgIGFkZENsYXNzKHJvb3QsIGNsYXNzZXMgPSBnZXRDbGFzc2VzKCkpO1xuICB9XG4gIGZ1bmN0aW9uIGNvbGxlY3QoKSB7XG4gICAgc2xpZGVyID0gY2hpbGQocm9vdCwgYC4ke0NMQVNTX1NMSURFUn1gKTtcbiAgICB0cmFjayA9IHF1ZXJ5KHJvb3QsIGAuJHtDTEFTU19UUkFDS31gKTtcbiAgICBsaXN0ID0gY2hpbGQodHJhY2ssIGAuJHtDTEFTU19MSVNUfWApO1xuICAgIGFzc2VydCh0cmFjayAmJiBsaXN0LCBcIkEgdHJhY2svbGlzdCBlbGVtZW50IGlzIG1pc3NpbmcuXCIpO1xuICAgIHB1c2goc2xpZGVzLCBjaGlsZHJlbihsaXN0LCBgLiR7Q0xBU1NfU0xJREV9Om5vdCguJHtDTEFTU19DTE9ORX0pYCkpO1xuICAgIGNvbnN0IGF1dG9wbGF5ID0gZmluZChgLiR7Q0xBU1NfQVVUT1BMQVl9YCk7XG4gICAgY29uc3QgYXJyb3dzID0gZmluZChgLiR7Q0xBU1NfQVJST1dTfWApO1xuICAgIGFzc2lnbihlbGVtZW50cywge1xuICAgICAgcm9vdCxcbiAgICAgIHNsaWRlcixcbiAgICAgIHRyYWNrLFxuICAgICAgbGlzdCxcbiAgICAgIHNsaWRlcyxcbiAgICAgIGFycm93cyxcbiAgICAgIGF1dG9wbGF5LFxuICAgICAgcHJldjogcXVlcnkoYXJyb3dzLCBgLiR7Q0xBU1NfQVJST1dfUFJFVn1gKSxcbiAgICAgIG5leHQ6IHF1ZXJ5KGFycm93cywgYC4ke0NMQVNTX0FSUk9XX05FWFR9YCksXG4gICAgICBiYXI6IHF1ZXJ5KGZpbmQoYC4ke0NMQVNTX1BST0dSRVNTfWApLCBgLiR7Q0xBU1NfUFJPR1JFU1NfQkFSfWApLFxuICAgICAgcGxheTogcXVlcnkoYXV0b3BsYXksIGAuJHtDTEFTU19QTEFZfWApLFxuICAgICAgcGF1c2U6IHF1ZXJ5KGF1dG9wbGF5LCBgLiR7Q0xBU1NfUEFVU0V9YClcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBpZGVudGlmeSgpIHtcbiAgICBjb25zdCBpZCA9IHJvb3QuaWQgfHwgdW5pcXVlSWQoUFJPSkVDVF9DT0RFKTtcbiAgICByb290LmlkID0gaWQ7XG4gICAgdHJhY2suaWQgPSB0cmFjay5pZCB8fCBgJHtpZH0tdHJhY2tgO1xuICAgIGxpc3QuaWQgPSBsaXN0LmlkIHx8IGAke2lkfS1saXN0YDtcbiAgfVxuICBmdW5jdGlvbiBmaW5kKHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIGNoaWxkKHJvb3QsIHNlbGVjdG9yKSB8fCBjaGlsZChzbGlkZXIsIHNlbGVjdG9yKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRDbGFzc2VzKCkge1xuICAgIHJldHVybiBbXG4gICAgICBgJHtDTEFTU19ST09UfS0tJHtvcHRpb25zLnR5cGV9YCxcbiAgICAgIGAke0NMQVNTX1JPT1R9LS0ke29wdGlvbnMuZGlyZWN0aW9ufWAsXG4gICAgICBvcHRpb25zLmRyYWcgJiYgYCR7Q0xBU1NfUk9PVH0tLWRyYWdnYWJsZWAsXG4gICAgICBvcHRpb25zLmlzTmF2aWdhdGlvbiAmJiBgJHtDTEFTU19ST09UfS0tbmF2YCxcbiAgICAgIENMQVNTX0FDVElWRVxuICAgIF07XG4gIH1cbiAgcmV0dXJuIGFzc2lnbihlbGVtZW50cywge1xuICAgIHNldHVwLFxuICAgIG1vdW50LFxuICAgIGRlc3Ryb3lcbiAgfSk7XG59XG5cbmNvbnN0IFJPTEUgPSBcInJvbGVcIjtcbmNvbnN0IEFSSUFfQ09OVFJPTFMgPSBcImFyaWEtY29udHJvbHNcIjtcbmNvbnN0IEFSSUFfQ1VSUkVOVCA9IFwiYXJpYS1jdXJyZW50XCI7XG5jb25zdCBBUklBX0xBQkVMID0gXCJhcmlhLWxhYmVsXCI7XG5jb25zdCBBUklBX0hJRERFTiA9IFwiYXJpYS1oaWRkZW5cIjtcbmNvbnN0IFRBQl9JTkRFWCA9IFwidGFiaW5kZXhcIjtcbmNvbnN0IERJU0FCTEVEID0gXCJkaXNhYmxlZFwiO1xuY29uc3QgQVJJQV9PUklFTlRBVElPTiA9IFwiYXJpYS1vcmllbnRhdGlvblwiO1xuY29uc3QgQUxMX0FUVFJJQlVURVMgPSBbXG4gIFJPTEUsXG4gIEFSSUFfQ09OVFJPTFMsXG4gIEFSSUFfQ1VSUkVOVCxcbiAgQVJJQV9MQUJFTCxcbiAgQVJJQV9ISURERU4sXG4gIEFSSUFfT1JJRU5UQVRJT04sXG4gIFRBQl9JTkRFWCxcbiAgRElTQUJMRURcbl07XG5cbmNvbnN0IFNMSURFID0gXCJzbGlkZVwiO1xuY29uc3QgTE9PUCA9IFwibG9vcFwiO1xuY29uc3QgRkFERSA9IFwiZmFkZVwiO1xuXG5mdW5jdGlvbiBTbGlkZSQxKFNwbGlkZTIsIGluZGV4LCBzbGlkZUluZGV4LCBzbGlkZSkge1xuICBjb25zdCB7IG9uLCBlbWl0LCBiaW5kLCBkZXN0cm95OiBkZXN0cm95RXZlbnRzIH0gPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgY29uc3QgeyBDb21wb25lbnRzLCByb290LCBvcHRpb25zIH0gPSBTcGxpZGUyO1xuICBjb25zdCB7IGlzTmF2aWdhdGlvbiwgdXBkYXRlT25Nb3ZlIH0gPSBvcHRpb25zO1xuICBjb25zdCB7IHJlc29sdmUgfSA9IENvbXBvbmVudHMuRGlyZWN0aW9uO1xuICBjb25zdCBzdHlsZXMgPSBnZXRBdHRyaWJ1dGUoc2xpZGUsIFwic3R5bGVcIik7XG4gIGNvbnN0IGlzQ2xvbmUgPSBzbGlkZUluZGV4ID4gLTE7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGNoaWxkKHNsaWRlLCBgLiR7Q0xBU1NfQ09OVEFJTkVSfWApO1xuICBjb25zdCBmb2N1c2FibGVOb2RlcyA9IG9wdGlvbnMuZm9jdXNhYmxlTm9kZXMgJiYgcXVlcnlBbGwoc2xpZGUsIG9wdGlvbnMuZm9jdXNhYmxlTm9kZXMpO1xuICBsZXQgZGVzdHJveWVkO1xuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBpbml0KCk7XG4gICAgYmluZChzbGlkZSwgXCJjbGljayBrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICBlbWl0KGUudHlwZSA9PT0gXCJjbGlja1wiID8gRVZFTlRfQ0xJQ0sgOiBFVkVOVF9TTElERV9LRVlET1dOLCB0aGlzLCBlKTtcbiAgICB9KTtcbiAgICBvbihbRVZFTlRfUkVGUkVTSCwgRVZFTlRfUkVQT1NJVElPTkVELCBFVkVOVF9NT1ZFRCwgRVZFTlRfU0NST0xMRURdLCB1cGRhdGUuYmluZCh0aGlzKSk7XG4gICAgaWYgKHVwZGF0ZU9uTW92ZSkge1xuICAgICAgb24oRVZFTlRfTU9WRSwgb25Nb3ZlLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGlmICghaXNDbG9uZSkge1xuICAgICAgc2xpZGUuaWQgPSBgJHtyb290LmlkfS1zbGlkZSR7cGFkKGluZGV4ICsgMSl9YDtcbiAgICB9XG4gICAgaWYgKGlzTmF2aWdhdGlvbikge1xuICAgICAgY29uc3QgaWR4ID0gaXNDbG9uZSA/IHNsaWRlSW5kZXggOiBpbmRleDtcbiAgICAgIGNvbnN0IGxhYmVsID0gZm9ybWF0KG9wdGlvbnMuaTE4bi5zbGlkZVgsIGlkeCArIDEpO1xuICAgICAgY29uc3QgY29udHJvbHMgPSBTcGxpZGUyLnNwbGlkZXMubWFwKChzcGxpZGUpID0+IHNwbGlkZS5yb290LmlkKS5qb2luKFwiIFwiKTtcbiAgICAgIHNldEF0dHJpYnV0ZShzbGlkZSwgQVJJQV9MQUJFTCwgbGFiZWwpO1xuICAgICAgc2V0QXR0cmlidXRlKHNsaWRlLCBBUklBX0NPTlRST0xTLCBjb250cm9scyk7XG4gICAgICBzZXRBdHRyaWJ1dGUoc2xpZGUsIFJPTEUsIFwibWVudWl0ZW1cIik7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgZGVzdHJveWVkID0gdHJ1ZTtcbiAgICBkZXN0cm95RXZlbnRzKCk7XG4gICAgcmVtb3ZlQ2xhc3Moc2xpZGUsIFNUQVRVU19DTEFTU0VTKTtcbiAgICByZW1vdmVBdHRyaWJ1dGUoc2xpZGUsIEFMTF9BVFRSSUJVVEVTKTtcbiAgICBzZXRBdHRyaWJ1dGUoc2xpZGUsIFwic3R5bGVcIiwgc3R5bGVzKTtcbiAgfVxuICBmdW5jdGlvbiBvbk1vdmUobmV4dCwgcHJldiwgZGVzdCkge1xuICAgIGlmICghZGVzdHJveWVkKSB7XG4gICAgICB1cGRhdGUuY2FsbCh0aGlzKTtcbiAgICAgIGlmIChkZXN0ID09PSBpbmRleCkge1xuICAgICAgICB1cGRhdGVBY3Rpdml0eS5jYWxsKHRoaXMsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgaWYgKCFkZXN0cm95ZWQpIHtcbiAgICAgIGNvbnN0IHsgaW5kZXg6IGN1cnJJbmRleCB9ID0gU3BsaWRlMjtcbiAgICAgIHVwZGF0ZUFjdGl2aXR5LmNhbGwodGhpcywgaXNBY3RpdmUoKSk7XG4gICAgICB1cGRhdGVWaXNpYmlsaXR5LmNhbGwodGhpcywgaXNWaXNpYmxlKCkpO1xuICAgICAgdG9nZ2xlQ2xhc3Moc2xpZGUsIENMQVNTX1BSRVYsIGluZGV4ID09PSBjdXJySW5kZXggLSAxKTtcbiAgICAgIHRvZ2dsZUNsYXNzKHNsaWRlLCBDTEFTU19ORVhULCBpbmRleCA9PT0gY3VyckluZGV4ICsgMSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZUFjdGl2aXR5KGFjdGl2ZSkge1xuICAgIGlmIChhY3RpdmUgIT09IGhhc0NsYXNzKHNsaWRlLCBDTEFTU19BQ1RJVkUpKSB7XG4gICAgICB0b2dnbGVDbGFzcyhzbGlkZSwgQ0xBU1NfQUNUSVZFLCBhY3RpdmUpO1xuICAgICAgaWYgKGlzTmF2aWdhdGlvbikge1xuICAgICAgICBzZXRBdHRyaWJ1dGUoc2xpZGUsIEFSSUFfQ1VSUkVOVCwgYWN0aXZlIHx8IG51bGwpO1xuICAgICAgfVxuICAgICAgZW1pdChhY3RpdmUgPyBFVkVOVF9BQ1RJVkUgOiBFVkVOVF9JTkFDVElWRSwgdGhpcyk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZVZpc2liaWxpdHkodmlzaWJsZSkge1xuICAgIGNvbnN0IGFyaWFIaWRkZW4gPSAhdmlzaWJsZSAmJiAhaXNBY3RpdmUoKTtcbiAgICBzZXRBdHRyaWJ1dGUoc2xpZGUsIEFSSUFfSElEREVOLCBhcmlhSGlkZGVuIHx8IG51bGwpO1xuICAgIHNldEF0dHJpYnV0ZShzbGlkZSwgVEFCX0lOREVYLCAhYXJpYUhpZGRlbiAmJiBvcHRpb25zLnNsaWRlRm9jdXMgPyAwIDogbnVsbCk7XG4gICAgaWYgKGZvY3VzYWJsZU5vZGVzKSB7XG4gICAgICBmb2N1c2FibGVOb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIHNldEF0dHJpYnV0ZShub2RlLCBUQUJfSU5ERVgsIGFyaWFIaWRkZW4gPyAtMSA6IG51bGwpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh2aXNpYmxlICE9PSBoYXNDbGFzcyhzbGlkZSwgQ0xBU1NfVklTSUJMRSkpIHtcbiAgICAgIHRvZ2dsZUNsYXNzKHNsaWRlLCBDTEFTU19WSVNJQkxFLCB2aXNpYmxlKTtcbiAgICAgIGVtaXQodmlzaWJsZSA/IEVWRU5UX1ZJU0lCTEUgOiBFVkVOVF9ISURERU4sIHRoaXMpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzdHlsZSQxKHByb3AsIHZhbHVlLCB1c2VDb250YWluZXIpIHtcbiAgICBzdHlsZSh1c2VDb250YWluZXIgJiYgY29udGFpbmVyIHx8IHNsaWRlLCBwcm9wLCB2YWx1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gaXNBY3RpdmUoKSB7XG4gICAgcmV0dXJuIFNwbGlkZTIuaW5kZXggPT09IGluZGV4O1xuICB9XG4gIGZ1bmN0aW9uIGlzVmlzaWJsZSgpIHtcbiAgICBpZiAoU3BsaWRlMi5pcyhGQURFKSkge1xuICAgICAgcmV0dXJuIGlzQWN0aXZlKCk7XG4gICAgfVxuICAgIGNvbnN0IHRyYWNrUmVjdCA9IHJlY3QoQ29tcG9uZW50cy5FbGVtZW50cy50cmFjayk7XG4gICAgY29uc3Qgc2xpZGVSZWN0ID0gcmVjdChzbGlkZSk7XG4gICAgY29uc3QgbGVmdCA9IHJlc29sdmUoXCJsZWZ0XCIpO1xuICAgIGNvbnN0IHJpZ2h0ID0gcmVzb2x2ZShcInJpZ2h0XCIpO1xuICAgIHJldHVybiBmbG9vcih0cmFja1JlY3RbbGVmdF0pIDw9IGNlaWwoc2xpZGVSZWN0W2xlZnRdKSAmJiBmbG9vcihzbGlkZVJlY3RbcmlnaHRdKSA8PSBjZWlsKHRyYWNrUmVjdFtyaWdodF0pO1xuICB9XG4gIGZ1bmN0aW9uIGlzV2l0aGluKGZyb20sIGRpc3RhbmNlKSB7XG4gICAgbGV0IGRpZmYgPSBhYnMoZnJvbSAtIGluZGV4KTtcbiAgICBpZiAoIWlzQ2xvbmUgJiYgKG9wdGlvbnMucmV3aW5kIHx8IFNwbGlkZTIuaXMoTE9PUCkpKSB7XG4gICAgICBkaWZmID0gbWluKGRpZmYsIFNwbGlkZTIubGVuZ3RoIC0gZGlmZik7XG4gICAgfVxuICAgIHJldHVybiBkaWZmIDw9IGRpc3RhbmNlO1xuICB9XG4gIHJldHVybiB7XG4gICAgaW5kZXgsXG4gICAgc2xpZGVJbmRleCxcbiAgICBzbGlkZSxcbiAgICBjb250YWluZXIsXG4gICAgaXNDbG9uZSxcbiAgICBtb3VudCxcbiAgICBkZXN0cm95LFxuICAgIHN0eWxlOiBzdHlsZSQxLFxuICAgIGlzV2l0aGluXG4gIH07XG59XG5cbmZ1bmN0aW9uIFNsaWRlcyhTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICBjb25zdCB7IG9uLCBlbWl0LCBiaW5kIH0gPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgY29uc3QgeyBzbGlkZXMsIGxpc3QgfSA9IENvbXBvbmVudHMyLkVsZW1lbnRzO1xuICBjb25zdCBTbGlkZXMyID0gW107XG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGluaXQoKTtcbiAgICBvbihFVkVOVF9SRUZSRVNILCByZWZyZXNoKTtcbiAgICBvbihbRVZFTlRfTU9VTlRFRCwgRVZFTlRfUkVGUkVTSF0sICgpID0+IHtcbiAgICAgIFNsaWRlczIuc29ydCgoU2xpZGUxLCBTbGlkZTIpID0+IFNsaWRlMS5pbmRleCAtIFNsaWRlMi5pbmRleCk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBzbGlkZXMuZm9yRWFjaCgoc2xpZGUsIGluZGV4KSA9PiB7XG4gICAgICByZWdpc3RlcihzbGlkZSwgaW5kZXgsIC0xKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGZvckVhY2gkMSgoU2xpZGUyKSA9PiB7XG4gICAgICBTbGlkZTIuZGVzdHJveSgpO1xuICAgIH0pO1xuICAgIGVtcHR5KFNsaWRlczIpO1xuICB9XG4gIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgZGVzdHJveSgpO1xuICAgIGluaXQoKTtcbiAgfVxuICBmdW5jdGlvbiByZWdpc3RlcihzbGlkZSwgaW5kZXgsIHNsaWRlSW5kZXgpIHtcbiAgICBjb25zdCBvYmplY3QgPSBTbGlkZSQxKFNwbGlkZTIsIGluZGV4LCBzbGlkZUluZGV4LCBzbGlkZSk7XG4gICAgb2JqZWN0Lm1vdW50KCk7XG4gICAgU2xpZGVzMi5wdXNoKG9iamVjdCk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0KGV4Y2x1ZGVDbG9uZXMpIHtcbiAgICByZXR1cm4gZXhjbHVkZUNsb25lcyA/IGZpbHRlcigoU2xpZGUyKSA9PiAhU2xpZGUyLmlzQ2xvbmUpIDogU2xpZGVzMjtcbiAgfVxuICBmdW5jdGlvbiBnZXRJbihwYWdlKSB7XG4gICAgY29uc3QgeyBDb250cm9sbGVyIH0gPSBDb21wb25lbnRzMjtcbiAgICBjb25zdCBpbmRleCA9IENvbnRyb2xsZXIudG9JbmRleChwYWdlKTtcbiAgICBjb25zdCBtYXggPSBDb250cm9sbGVyLmhhc0ZvY3VzKCkgPyAxIDogb3B0aW9ucy5wZXJQYWdlO1xuICAgIHJldHVybiBmaWx0ZXIoKFNsaWRlMikgPT4gYmV0d2VlbihTbGlkZTIuaW5kZXgsIGluZGV4LCBpbmRleCArIG1heCAtIDEpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRBdChpbmRleCkge1xuICAgIHJldHVybiBmaWx0ZXIoaW5kZXgpWzBdO1xuICB9XG4gIGZ1bmN0aW9uIGFkZChpdGVtcywgaW5kZXgpIHtcbiAgICBmb3JFYWNoKGl0ZW1zLCAoc2xpZGUpID0+IHtcbiAgICAgIGlmIChpc1N0cmluZyhzbGlkZSkpIHtcbiAgICAgICAgc2xpZGUgPSBwYXJzZUh0bWwoc2xpZGUpO1xuICAgICAgfVxuICAgICAgaWYgKGlzSFRNTEVsZW1lbnQoc2xpZGUpKSB7XG4gICAgICAgIGNvbnN0IHJlZiA9IHNsaWRlc1tpbmRleF07XG4gICAgICAgIHJlZiA/IGJlZm9yZShzbGlkZSwgcmVmKSA6IGFwcGVuZChsaXN0LCBzbGlkZSk7XG4gICAgICAgIGFkZENsYXNzKHNsaWRlLCBvcHRpb25zLmNsYXNzZXMuc2xpZGUpO1xuICAgICAgICBvYnNlcnZlSW1hZ2VzKHNsaWRlLCBlbWl0LmJpbmQobnVsbCwgRVZFTlRfUkVTSVpFKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZW1pdChFVkVOVF9SRUZSRVNIKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmUkMShtYXRjaGVyKSB7XG4gICAgcmVtb3ZlKGZpbHRlcihtYXRjaGVyKS5tYXAoKFNsaWRlMikgPT4gU2xpZGUyLnNsaWRlKSk7XG4gICAgZW1pdChFVkVOVF9SRUZSRVNIKTtcbiAgfVxuICBmdW5jdGlvbiBmb3JFYWNoJDEoaXRlcmF0ZWUsIGV4Y2x1ZGVDbG9uZXMpIHtcbiAgICBnZXQoZXhjbHVkZUNsb25lcykuZm9yRWFjaChpdGVyYXRlZSk7XG4gIH1cbiAgZnVuY3Rpb24gZmlsdGVyKG1hdGNoZXIpIHtcbiAgICByZXR1cm4gU2xpZGVzMi5maWx0ZXIoaXNGdW5jdGlvbihtYXRjaGVyKSA/IG1hdGNoZXIgOiAoU2xpZGUyKSA9PiBpc1N0cmluZyhtYXRjaGVyKSA/IG1hdGNoZXMoU2xpZGUyLnNsaWRlLCBtYXRjaGVyKSA6IGluY2x1ZGVzKHRvQXJyYXkobWF0Y2hlciksIFNsaWRlMi5pbmRleCkpO1xuICB9XG4gIGZ1bmN0aW9uIHN0eWxlKHByb3AsIHZhbHVlLCB1c2VDb250YWluZXIpIHtcbiAgICBmb3JFYWNoJDEoKFNsaWRlMikgPT4ge1xuICAgICAgU2xpZGUyLnN0eWxlKHByb3AsIHZhbHVlLCB1c2VDb250YWluZXIpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9ic2VydmVJbWFnZXMoZWxtLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGltYWdlcyA9IHF1ZXJ5QWxsKGVsbSwgXCJpbWdcIik7XG4gICAgbGV0IHsgbGVuZ3RoIH0gPSBpbWFnZXM7XG4gICAgaWYgKGxlbmd0aCkge1xuICAgICAgaW1hZ2VzLmZvckVhY2goKGltZykgPT4ge1xuICAgICAgICBiaW5kKGltZywgXCJsb2FkIGVycm9yXCIsICgpID0+IHtcbiAgICAgICAgICBpZiAoIS0tbGVuZ3RoKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZ2V0TGVuZ3RoKGV4Y2x1ZGVDbG9uZXMpIHtcbiAgICByZXR1cm4gZXhjbHVkZUNsb25lcyA/IHNsaWRlcy5sZW5ndGggOiBTbGlkZXMyLmxlbmd0aDtcbiAgfVxuICBmdW5jdGlvbiBpc0Vub3VnaCgpIHtcbiAgICByZXR1cm4gU2xpZGVzMi5sZW5ndGggPiBvcHRpb25zLnBlclBhZ2U7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBtb3VudCxcbiAgICBkZXN0cm95LFxuICAgIHJlZ2lzdGVyLFxuICAgIGdldCxcbiAgICBnZXRJbixcbiAgICBnZXRBdCxcbiAgICBhZGQsXG4gICAgcmVtb3ZlOiByZW1vdmUkMSxcbiAgICBmb3JFYWNoOiBmb3JFYWNoJDEsXG4gICAgZmlsdGVyLFxuICAgIHN0eWxlLFxuICAgIGdldExlbmd0aCxcbiAgICBpc0Vub3VnaFxuICB9O1xufVxuXG5mdW5jdGlvbiBMYXlvdXQoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBvbiwgYmluZCwgZW1pdCB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IHsgU2xpZGVzIH0gPSBDb21wb25lbnRzMjtcbiAgY29uc3QgeyByZXNvbHZlIH0gPSBDb21wb25lbnRzMi5EaXJlY3Rpb247XG4gIGNvbnN0IHsgcm9vdCwgdHJhY2ssIGxpc3QgfSA9IENvbXBvbmVudHMyLkVsZW1lbnRzO1xuICBjb25zdCB7IGdldEF0IH0gPSBTbGlkZXM7XG4gIGxldCB2ZXJ0aWNhbDtcbiAgbGV0IHJvb3RSZWN0O1xuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBpbml0KCk7XG4gICAgYmluZCh3aW5kb3csIFwicmVzaXplIGxvYWRcIiwgVGhyb3R0bGUoZW1pdC5iaW5kKHRoaXMsIEVWRU5UX1JFU0laRSkpKTtcbiAgICBvbihbRVZFTlRfVVBEQVRFRCwgRVZFTlRfUkVGUkVTSF0sIGluaXQpO1xuICAgIG9uKEVWRU5UX1JFU0laRSwgcmVzaXplKTtcbiAgfVxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIHJvb3RSZWN0ID0gbnVsbDtcbiAgICB2ZXJ0aWNhbCA9IG9wdGlvbnMuZGlyZWN0aW9uID09PSBUVEI7XG4gICAgc3R5bGUocm9vdCwgXCJtYXhXaWR0aFwiLCB1bml0KG9wdGlvbnMud2lkdGgpKTtcbiAgICBzdHlsZSh0cmFjaywgcmVzb2x2ZShcInBhZGRpbmdMZWZ0XCIpLCBjc3NQYWRkaW5nKGZhbHNlKSk7XG4gICAgc3R5bGUodHJhY2ssIHJlc29sdmUoXCJwYWRkaW5nUmlnaHRcIiksIGNzc1BhZGRpbmcodHJ1ZSkpO1xuICAgIHJlc2l6ZSgpO1xuICB9XG4gIGZ1bmN0aW9uIHJlc2l6ZSgpIHtcbiAgICBjb25zdCBuZXdSZWN0ID0gcmVjdChyb290KTtcbiAgICBpZiAoIXJvb3RSZWN0IHx8IHJvb3RSZWN0LndpZHRoICE9PSBuZXdSZWN0LndpZHRoIHx8IHJvb3RSZWN0LmhlaWdodCAhPT0gbmV3UmVjdC5oZWlnaHQpIHtcbiAgICAgIHN0eWxlKHRyYWNrLCBcImhlaWdodFwiLCBjc3NUcmFja0hlaWdodCgpKTtcbiAgICAgIFNsaWRlcy5zdHlsZShyZXNvbHZlKFwibWFyZ2luUmlnaHRcIiksIHVuaXQob3B0aW9ucy5nYXApKTtcbiAgICAgIFNsaWRlcy5zdHlsZShcIndpZHRoXCIsIGNzc1NsaWRlV2lkdGgoKSB8fCBudWxsKTtcbiAgICAgIHNldFNsaWRlc0hlaWdodCgpO1xuICAgICAgcm9vdFJlY3QgPSBuZXdSZWN0O1xuICAgICAgZW1pdChFVkVOVF9SRVNJWkVEKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2V0U2xpZGVzSGVpZ2h0KCkge1xuICAgIFNsaWRlcy5zdHlsZShcImhlaWdodFwiLCBjc3NTbGlkZUhlaWdodCgpIHx8IG51bGwsIHRydWUpO1xuICB9XG4gIGZ1bmN0aW9uIGNzc1BhZGRpbmcocmlnaHQpIHtcbiAgICBjb25zdCB7IHBhZGRpbmcgfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgcHJvcCA9IHJlc29sdmUocmlnaHQgPyBcInJpZ2h0XCIgOiBcImxlZnRcIik7XG4gICAgcmV0dXJuIHBhZGRpbmcgJiYgdW5pdChwYWRkaW5nW3Byb3BdIHx8IChpc09iamVjdChwYWRkaW5nKSA/IDAgOiBwYWRkaW5nKSkgfHwgXCIwcHhcIjtcbiAgfVxuICBmdW5jdGlvbiBjc3NUcmFja0hlaWdodCgpIHtcbiAgICBsZXQgaGVpZ2h0ID0gXCJcIjtcbiAgICBpZiAodmVydGljYWwpIHtcbiAgICAgIGhlaWdodCA9IGNzc0hlaWdodCgpO1xuICAgICAgYXNzZXJ0KGhlaWdodCwgXCJoZWlnaHQgb3IgaGVpZ2h0UmF0aW8gaXMgbWlzc2luZy5cIik7XG4gICAgICBoZWlnaHQgPSBgY2FsYygke2hlaWdodH0gLSAke2Nzc1BhZGRpbmcoZmFsc2UpfSAtICR7Y3NzUGFkZGluZyh0cnVlKX0pYDtcbiAgICB9XG4gICAgcmV0dXJuIGhlaWdodDtcbiAgfVxuICBmdW5jdGlvbiBjc3NIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHVuaXQob3B0aW9ucy5oZWlnaHQgfHwgcmVjdChsaXN0KS53aWR0aCAqIG9wdGlvbnMuaGVpZ2h0UmF0aW8pO1xuICB9XG4gIGZ1bmN0aW9uIGNzc1NsaWRlV2lkdGgoKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuYXV0b1dpZHRoID8gXCJcIiA6IHVuaXQob3B0aW9ucy5maXhlZFdpZHRoKSB8fCAodmVydGljYWwgPyBcIlwiIDogY3NzU2xpZGVTaXplKCkpO1xuICB9XG4gIGZ1bmN0aW9uIGNzc1NsaWRlSGVpZ2h0KCkge1xuICAgIHJldHVybiB1bml0KG9wdGlvbnMuZml4ZWRIZWlnaHQpIHx8ICh2ZXJ0aWNhbCA/IG9wdGlvbnMuYXV0b0hlaWdodCA/IFwiXCIgOiBjc3NTbGlkZVNpemUoKSA6IGNzc0hlaWdodCgpKTtcbiAgfVxuICBmdW5jdGlvbiBjc3NTbGlkZVNpemUoKSB7XG4gICAgY29uc3QgZ2FwID0gdW5pdChvcHRpb25zLmdhcCk7XG4gICAgcmV0dXJuIGBjYWxjKCgxMDAlJHtnYXAgJiYgYCArICR7Z2FwfWB9KS8ke29wdGlvbnMucGVyUGFnZSB8fCAxfSR7Z2FwICYmIGAgLSAke2dhcH1gfSlgO1xuICB9XG4gIGZ1bmN0aW9uIGxpc3RTaXplKCkge1xuICAgIHJldHVybiByZWN0KGxpc3QpW3Jlc29sdmUoXCJ3aWR0aFwiKV07XG4gIH1cbiAgZnVuY3Rpb24gc2xpZGVTaXplKGluZGV4LCB3aXRob3V0R2FwKSB7XG4gICAgY29uc3QgU2xpZGUgPSBnZXRBdChpbmRleCB8fCAwKTtcbiAgICByZXR1cm4gU2xpZGUgPyByZWN0KFNsaWRlLnNsaWRlKVtyZXNvbHZlKFwid2lkdGhcIildICsgKHdpdGhvdXRHYXAgPyAwIDogZ2V0R2FwKCkpIDogMDtcbiAgfVxuICBmdW5jdGlvbiB0b3RhbFNpemUoaW5kZXgsIHdpdGhvdXRHYXApIHtcbiAgICBjb25zdCBTbGlkZSA9IGdldEF0KGluZGV4KTtcbiAgICBpZiAoU2xpZGUpIHtcbiAgICAgIGNvbnN0IHJpZ2h0ID0gcmVjdChTbGlkZS5zbGlkZSlbcmVzb2x2ZShcInJpZ2h0XCIpXTtcbiAgICAgIGNvbnN0IGxlZnQgPSByZWN0KGxpc3QpW3Jlc29sdmUoXCJsZWZ0XCIpXTtcbiAgICAgIHJldHVybiBhYnMocmlnaHQgLSBsZWZ0KSArICh3aXRob3V0R2FwID8gMCA6IGdldEdhcCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgZnVuY3Rpb24gc2xpZGVyU2l6ZSgpIHtcbiAgICByZXR1cm4gdG90YWxTaXplKFNwbGlkZTIubGVuZ3RoIC0gMSwgdHJ1ZSkgLSB0b3RhbFNpemUoLTEsIHRydWUpO1xuICB9XG4gIGZ1bmN0aW9uIGdldEdhcCgpIHtcbiAgICBjb25zdCBTbGlkZSA9IGdldEF0KDApO1xuICAgIHJldHVybiBTbGlkZSAmJiBwYXJzZUZsb2F0KHN0eWxlKFNsaWRlLnNsaWRlLCByZXNvbHZlKFwibWFyZ2luUmlnaHRcIikpKSB8fCAwO1xuICB9XG4gIGZ1bmN0aW9uIGdldFBhZGRpbmcocmlnaHQpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdChzdHlsZSh0cmFjaywgcmVzb2x2ZShgcGFkZGluZyR7cmlnaHQgPyBcIlJpZ2h0XCIgOiBcIkxlZnRcIn1gKSkpIHx8IDA7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBtb3VudCxcbiAgICBsaXN0U2l6ZSxcbiAgICBzbGlkZVNpemUsXG4gICAgc2xpZGVyU2l6ZSxcbiAgICB0b3RhbFNpemUsXG4gICAgZ2V0UGFkZGluZ1xuICB9O1xufVxuXG5mdW5jdGlvbiBDbG9uZXMoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBvbiwgZW1pdCB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IHsgRWxlbWVudHMsIFNsaWRlcyB9ID0gQ29tcG9uZW50czI7XG4gIGNvbnN0IHsgcmVzb2x2ZSB9ID0gQ29tcG9uZW50czIuRGlyZWN0aW9uO1xuICBjb25zdCBjbG9uZXMgPSBbXTtcbiAgbGV0IGNsb25lQ291bnQ7XG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGluaXQoKTtcbiAgICBvbihFVkVOVF9SRUZSRVNILCByZWZyZXNoKTtcbiAgICBvbihbRVZFTlRfVVBEQVRFRCwgRVZFTlRfUkVTSVpFXSwgb2JzZXJ2ZSk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpZiAoY2xvbmVDb3VudCA9IGNvbXB1dGVDbG9uZUNvdW50KCkpIHtcbiAgICAgIGdlbmVyYXRlKGNsb25lQ291bnQpO1xuICAgICAgZW1pdChFVkVOVF9SRVNJWkUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZShjbG9uZXMpO1xuICAgIGVtcHR5KGNsb25lcyk7XG4gIH1cbiAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICBkZXN0cm95KCk7XG4gICAgaW5pdCgpO1xuICB9XG4gIGZ1bmN0aW9uIG9ic2VydmUoKSB7XG4gICAgaWYgKGNsb25lQ291bnQgPCBjb21wdXRlQ2xvbmVDb3VudCgpKSB7XG4gICAgICBlbWl0KEVWRU5UX1JFRlJFU0gpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZW5lcmF0ZShjb3VudCkge1xuICAgIGNvbnN0IHNsaWRlcyA9IFNsaWRlcy5nZXQoKS5zbGljZSgpO1xuICAgIGNvbnN0IHsgbGVuZ3RoIH0gPSBzbGlkZXM7XG4gICAgaWYgKGxlbmd0aCkge1xuICAgICAgd2hpbGUgKHNsaWRlcy5sZW5ndGggPCBjb3VudCkge1xuICAgICAgICBwdXNoKHNsaWRlcywgc2xpZGVzKTtcbiAgICAgIH1cbiAgICAgIHB1c2goc2xpZGVzLnNsaWNlKC1jb3VudCksIHNsaWRlcy5zbGljZSgwLCBjb3VudCkpLmZvckVhY2goKFNsaWRlLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBpc0hlYWQgPSBpbmRleCA8IGNvdW50O1xuICAgICAgICBjb25zdCBjbG9uZSA9IGNsb25lRGVlcChTbGlkZS5zbGlkZSwgaW5kZXgpO1xuICAgICAgICBpc0hlYWQgPyBiZWZvcmUoY2xvbmUsIHNsaWRlc1swXS5zbGlkZSkgOiBhcHBlbmQoRWxlbWVudHMubGlzdCwgY2xvbmUpO1xuICAgICAgICBwdXNoKGNsb25lcywgY2xvbmUpO1xuICAgICAgICBTbGlkZXMucmVnaXN0ZXIoY2xvbmUsIGluZGV4IC0gY291bnQgKyAoaXNIZWFkID8gMCA6IGxlbmd0aCksIFNsaWRlLmluZGV4KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBjbG9uZURlZXAoZWxtLCBpbmRleCkge1xuICAgIGNvbnN0IGNsb25lID0gZWxtLmNsb25lTm9kZSh0cnVlKTtcbiAgICBhZGRDbGFzcyhjbG9uZSwgb3B0aW9ucy5jbGFzc2VzLmNsb25lKTtcbiAgICBjbG9uZS5pZCA9IGAke1NwbGlkZTIucm9vdC5pZH0tY2xvbmUke3BhZChpbmRleCArIDEpfWA7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG4gIGZ1bmN0aW9uIGNvbXB1dGVDbG9uZUNvdW50KCkge1xuICAgIGxldCB7IGNsb25lczogY2xvbmVzMiB9ID0gb3B0aW9ucztcbiAgICBpZiAoIVNwbGlkZTIuaXMoTE9PUCkpIHtcbiAgICAgIGNsb25lczIgPSAwO1xuICAgIH0gZWxzZSBpZiAoIWNsb25lczIpIHtcbiAgICAgIGNvbnN0IGZpeGVkU2l6ZSA9IG1lYXN1cmUoRWxlbWVudHMubGlzdCwgb3B0aW9uc1tyZXNvbHZlKFwiZml4ZWRXaWR0aFwiKV0pO1xuICAgICAgY29uc3QgZml4ZWRDb3VudCA9IGZpeGVkU2l6ZSAmJiBjZWlsKHJlY3QoRWxlbWVudHMudHJhY2spW3Jlc29sdmUoXCJ3aWR0aFwiKV0gLyBmaXhlZFNpemUpO1xuICAgICAgY29uc3QgYmFzZUNvdW50ID0gZml4ZWRDb3VudCB8fCBvcHRpb25zW3Jlc29sdmUoXCJhdXRvV2lkdGhcIildICYmIFNwbGlkZTIubGVuZ3RoIHx8IG9wdGlvbnMucGVyUGFnZTtcbiAgICAgIGNsb25lczIgPSBiYXNlQ291bnQgKiAob3B0aW9ucy5kcmFnID8gKG9wdGlvbnMuZmxpY2tNYXhQYWdlcyB8fCAxKSArIDEgOiAyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsb25lczI7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBtb3VudCxcbiAgICBkZXN0cm95XG4gIH07XG59XG5cbmZ1bmN0aW9uIE1vdmUoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBvbiwgZW1pdCB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IHsgc2xpZGVTaXplLCBnZXRQYWRkaW5nLCB0b3RhbFNpemUsIGxpc3RTaXplLCBzbGlkZXJTaXplIH0gPSBDb21wb25lbnRzMi5MYXlvdXQ7XG4gIGNvbnN0IHsgcmVzb2x2ZSwgb3JpZW50IH0gPSBDb21wb25lbnRzMi5EaXJlY3Rpb247XG4gIGNvbnN0IHsgbGlzdCwgdHJhY2sgfSA9IENvbXBvbmVudHMyLkVsZW1lbnRzO1xuICBsZXQgd2FpdGluZztcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgb24oW0VWRU5UX01PVU5URUQsIEVWRU5UX1JFU0laRUQsIEVWRU5UX1VQREFURUQsIEVWRU5UX1JFRlJFU0hdLCByZXBvc2l0aW9uKTtcbiAgfVxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUF0dHJpYnV0ZShsaXN0LCBcInN0eWxlXCIpO1xuICB9XG4gIGZ1bmN0aW9uIHJlcG9zaXRpb24oKSB7XG4gICAgaWYgKCFpc0J1c3koKSkge1xuICAgICAgQ29tcG9uZW50czIuU2Nyb2xsLmNhbmNlbCgpO1xuICAgICAganVtcChTcGxpZGUyLmluZGV4KTtcbiAgICAgIGVtaXQoRVZFTlRfUkVQT1NJVElPTkVEKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbW92ZShkZXN0LCBpbmRleCwgcHJldiwgY2FsbGJhY2spIHtcbiAgICBpZiAoIWlzQnVzeSgpKSB7XG4gICAgICBjb25zdCB7IHNldCB9ID0gU3BsaWRlMi5zdGF0ZTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gZ2V0UG9zaXRpb24oKTtcbiAgICAgIGNvbnN0IGxvb3BpbmcgPSBkZXN0ICE9PSBpbmRleDtcbiAgICAgIHdhaXRpbmcgPSBsb29waW5nIHx8IG9wdGlvbnMud2FpdEZvclRyYW5zaXRpb247XG4gICAgICBzZXQoTU9WSU5HKTtcbiAgICAgIGVtaXQoRVZFTlRfTU9WRSwgaW5kZXgsIHByZXYsIGRlc3QpO1xuICAgICAgQ29tcG9uZW50czIuVHJhbnNpdGlvbi5zdGFydChkZXN0LCAoKSA9PiB7XG4gICAgICAgIGxvb3BpbmcgJiYganVtcChpbmRleCk7XG4gICAgICAgIHdhaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgc2V0KElETEUpO1xuICAgICAgICBlbWl0KEVWRU5UX01PVkVELCBpbmRleCwgcHJldiwgZGVzdCk7XG4gICAgICAgIGlmIChvcHRpb25zLnRyaW1TcGFjZSA9PT0gXCJtb3ZlXCIgJiYgZGVzdCAhPT0gcHJldiAmJiBwb3NpdGlvbiA9PT0gZ2V0UG9zaXRpb24oKSkge1xuICAgICAgICAgIENvbXBvbmVudHMyLkNvbnRyb2xsZXIuZ28oZGVzdCA+IHByZXYgPyBcIj5cIiA6IFwiPFwiLCBmYWxzZSwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBqdW1wKGluZGV4KSB7XG4gICAgdHJhbnNsYXRlKHRvUG9zaXRpb24oaW5kZXgsIHRydWUpKTtcbiAgfVxuICBmdW5jdGlvbiB0cmFuc2xhdGUocG9zaXRpb24sIHByZXZlbnRMb29wKSB7XG4gICAgaWYgKCFTcGxpZGUyLmlzKEZBREUpKSB7XG4gICAgICBsaXN0LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUke3Jlc29sdmUoXCJYXCIpfSgke3ByZXZlbnRMb29wID8gcG9zaXRpb24gOiBsb29wKHBvc2l0aW9uKX1weClgO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBsb29wKHBvc2l0aW9uKSB7XG4gICAgaWYgKCF3YWl0aW5nICYmIFNwbGlkZTIuaXMoTE9PUCkpIHtcbiAgICAgIGNvbnN0IGRpZmYgPSBvcmllbnQocG9zaXRpb24gLSBnZXRQb3NpdGlvbigpKTtcbiAgICAgIGNvbnN0IGV4Y2VlZGVkTWluID0gZXhjZWVkZWRMaW1pdChmYWxzZSwgcG9zaXRpb24pICYmIGRpZmYgPCAwO1xuICAgICAgY29uc3QgZXhjZWVkZWRNYXggPSBleGNlZWRlZExpbWl0KHRydWUsIHBvc2l0aW9uKSAmJiBkaWZmID4gMDtcbiAgICAgIGlmIChleGNlZWRlZE1pbiB8fCBleGNlZWRlZE1heCkge1xuICAgICAgICBwb3NpdGlvbiA9IHNoaWZ0KHBvc2l0aW9uLCBleGNlZWRlZE1heCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwb3NpdGlvbjtcbiAgfVxuICBmdW5jdGlvbiBzaGlmdChwb3NpdGlvbiwgYmFja3dhcmRzKSB7XG4gICAgY29uc3QgZXhjZXNzID0gcG9zaXRpb24gLSBnZXRMaW1pdChiYWNrd2FyZHMpO1xuICAgIGNvbnN0IHNpemUgPSBzbGlkZXJTaXplKCk7XG4gICAgcG9zaXRpb24gLT0gc2lnbihleGNlc3MpICogc2l6ZSAqIGNlaWwoYWJzKGV4Y2VzcykgLyBzaXplKTtcbiAgICByZXR1cm4gcG9zaXRpb247XG4gIH1cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIHdhaXRpbmcgPSBmYWxzZTtcbiAgICB0cmFuc2xhdGUoZ2V0UG9zaXRpb24oKSk7XG4gICAgQ29tcG9uZW50czIuVHJhbnNpdGlvbi5jYW5jZWwoKTtcbiAgfVxuICBmdW5jdGlvbiB0b0luZGV4KHBvc2l0aW9uKSB7XG4gICAgY29uc3QgU2xpZGVzID0gQ29tcG9uZW50czIuU2xpZGVzLmdldCgpO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IG1pbkRpc3RhbmNlID0gSW5maW5pdHk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBTbGlkZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHNsaWRlSW5kZXggPSBTbGlkZXNbaV0uaW5kZXg7XG4gICAgICBjb25zdCBkaXN0YW5jZSA9IGFicyh0b1Bvc2l0aW9uKHNsaWRlSW5kZXgsIHRydWUpIC0gcG9zaXRpb24pO1xuICAgICAgaWYgKGRpc3RhbmNlIDw9IG1pbkRpc3RhbmNlKSB7XG4gICAgICAgIG1pbkRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICAgIGluZGV4ID0gc2xpZGVJbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cbiAgZnVuY3Rpb24gdG9Qb3NpdGlvbihpbmRleCwgdHJpbW1pbmcpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IG9yaWVudCh0b3RhbFNpemUoaW5kZXggLSAxKSAtIG9mZnNldChpbmRleCkpO1xuICAgIHJldHVybiB0cmltbWluZyA/IHRyaW0ocG9zaXRpb24pIDogcG9zaXRpb247XG4gIH1cbiAgZnVuY3Rpb24gZ2V0UG9zaXRpb24oKSB7XG4gICAgY29uc3QgbGVmdCA9IHJlc29sdmUoXCJsZWZ0XCIpO1xuICAgIHJldHVybiByZWN0KGxpc3QpW2xlZnRdIC0gcmVjdCh0cmFjaylbbGVmdF0gKyBvcmllbnQoZ2V0UGFkZGluZyhmYWxzZSkpO1xuICB9XG4gIGZ1bmN0aW9uIHRyaW0ocG9zaXRpb24pIHtcbiAgICBpZiAob3B0aW9ucy50cmltU3BhY2UgJiYgU3BsaWRlMi5pcyhTTElERSkpIHtcbiAgICAgIHBvc2l0aW9uID0gY2xhbXAocG9zaXRpb24sIDAsIG9yaWVudChzbGlkZXJTaXplKCkgLSBsaXN0U2l6ZSgpKSk7XG4gICAgfVxuICAgIHJldHVybiBwb3NpdGlvbjtcbiAgfVxuICBmdW5jdGlvbiBvZmZzZXQoaW5kZXgpIHtcbiAgICBjb25zdCB7IGZvY3VzIH0gPSBvcHRpb25zO1xuICAgIHJldHVybiBmb2N1cyA9PT0gXCJjZW50ZXJcIiA/IChsaXN0U2l6ZSgpIC0gc2xpZGVTaXplKGluZGV4LCB0cnVlKSkgLyAyIDogK2ZvY3VzICogc2xpZGVTaXplKGluZGV4KSB8fCAwO1xuICB9XG4gIGZ1bmN0aW9uIGdldExpbWl0KG1heCkge1xuICAgIHJldHVybiB0b1Bvc2l0aW9uKG1heCA/IENvbXBvbmVudHMyLkNvbnRyb2xsZXIuZ2V0RW5kKCkgOiAwLCAhIW9wdGlvbnMudHJpbVNwYWNlKTtcbiAgfVxuICBmdW5jdGlvbiBpc0J1c3koKSB7XG4gICAgcmV0dXJuICEhd2FpdGluZztcbiAgfVxuICBmdW5jdGlvbiBleGNlZWRlZExpbWl0KG1heCwgcG9zaXRpb24pIHtcbiAgICBwb3NpdGlvbiA9IGlzVW5kZWZpbmVkKHBvc2l0aW9uKSA/IGdldFBvc2l0aW9uKCkgOiBwb3NpdGlvbjtcbiAgICBjb25zdCBleGNlZWRlZE1pbiA9IG1heCAhPT0gdHJ1ZSAmJiBvcmllbnQocG9zaXRpb24pIDwgb3JpZW50KGdldExpbWl0KGZhbHNlKSk7XG4gICAgY29uc3QgZXhjZWVkZWRNYXggPSBtYXggIT09IGZhbHNlICYmIG9yaWVudChwb3NpdGlvbikgPiBvcmllbnQoZ2V0TGltaXQodHJ1ZSkpO1xuICAgIHJldHVybiBleGNlZWRlZE1pbiB8fCBleGNlZWRlZE1heDtcbiAgfVxuICByZXR1cm4ge1xuICAgIG1vdW50LFxuICAgIGRlc3Ryb3ksXG4gICAgbW92ZSxcbiAgICBqdW1wLFxuICAgIHRyYW5zbGF0ZSxcbiAgICBzaGlmdCxcbiAgICBjYW5jZWwsXG4gICAgdG9JbmRleCxcbiAgICB0b1Bvc2l0aW9uLFxuICAgIGdldFBvc2l0aW9uLFxuICAgIGdldExpbWl0LFxuICAgIGlzQnVzeSxcbiAgICBleGNlZWRlZExpbWl0XG4gIH07XG59XG5cbmZ1bmN0aW9uIENvbnRyb2xsZXIoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBvbiB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IHsgTW92ZSB9ID0gQ29tcG9uZW50czI7XG4gIGNvbnN0IHsgZ2V0UG9zaXRpb24sIGdldExpbWl0IH0gPSBNb3ZlO1xuICBjb25zdCB7IGlzRW5vdWdoLCBnZXRMZW5ndGggfSA9IENvbXBvbmVudHMyLlNsaWRlcztcbiAgY29uc3QgaXNMb29wID0gU3BsaWRlMi5pcyhMT09QKTtcbiAgY29uc3QgaXNTbGlkZSA9IFNwbGlkZTIuaXMoU0xJREUpO1xuICBsZXQgY3VyckluZGV4ID0gb3B0aW9ucy5zdGFydCB8fCAwO1xuICBsZXQgcHJldkluZGV4ID0gY3VyckluZGV4O1xuICBsZXQgc2xpZGVDb3VudDtcbiAgbGV0IHBlck1vdmU7XG4gIGxldCBwZXJQYWdlO1xuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBpbml0KCk7XG4gICAgb24oW0VWRU5UX1VQREFURUQsIEVWRU5UX1JFRlJFU0hdLCBpbml0LCBERUZBVUxUX0VWRU5UX1BSSU9SSVRZIC0gMSk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBzbGlkZUNvdW50ID0gZ2V0TGVuZ3RoKHRydWUpO1xuICAgIHBlck1vdmUgPSBvcHRpb25zLnBlck1vdmU7XG4gICAgcGVyUGFnZSA9IG9wdGlvbnMucGVyUGFnZTtcbiAgICBjdXJySW5kZXggPSBjbGFtcChjdXJySW5kZXgsIDAsIHNsaWRlQ291bnQgLSAxKTtcbiAgfVxuICBmdW5jdGlvbiBnbyhjb250cm9sLCBhbGxvd1NhbWVJbmRleCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBkZXN0ID0gcGFyc2UoY29udHJvbCk7XG4gICAgaWYgKG9wdGlvbnMudXNlU2Nyb2xsKSB7XG4gICAgICBzY3JvbGwoZGVzdCwgdHJ1ZSwgdHJ1ZSwgb3B0aW9ucy5zcGVlZCwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbmRleCA9IGxvb3AoZGVzdCk7XG4gICAgICBpZiAoaW5kZXggPiAtMSAmJiAhTW92ZS5pc0J1c3koKSAmJiAoYWxsb3dTYW1lSW5kZXggfHwgaW5kZXggIT09IGN1cnJJbmRleCkpIHtcbiAgICAgICAgc2V0SW5kZXgoaW5kZXgpO1xuICAgICAgICBNb3ZlLm1vdmUoZGVzdCwgaW5kZXgsIHByZXZJbmRleCwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzY3JvbGwoZGVzdGluYXRpb24sIHVzZUluZGV4LCBzbmFwLCBkdXJhdGlvbiwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBkZXN0ID0gdXNlSW5kZXggPyBkZXN0aW5hdGlvbiA6IHRvRGVzdChkZXN0aW5hdGlvbik7XG4gICAgQ29tcG9uZW50czIuU2Nyb2xsLnNjcm9sbCh1c2VJbmRleCB8fCBzbmFwID8gTW92ZS50b1Bvc2l0aW9uKGRlc3QsIHRydWUpIDogZGVzdGluYXRpb24sIGR1cmF0aW9uLCAoKSA9PiB7XG4gICAgICBzZXRJbmRleChNb3ZlLnRvSW5kZXgoTW92ZS5nZXRQb3NpdGlvbigpKSk7XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHBhcnNlKGNvbnRyb2wpIHtcbiAgICBsZXQgaW5kZXggPSBjdXJySW5kZXg7XG4gICAgaWYgKGlzU3RyaW5nKGNvbnRyb2wpKSB7XG4gICAgICBjb25zdCBbLCBpbmRpY2F0b3IsIG51bWJlcl0gPSBjb250cm9sLm1hdGNoKC8oWytcXC08Pl0pKFxcZCspPy8pIHx8IFtdO1xuICAgICAgaWYgKGluZGljYXRvciA9PT0gXCIrXCIgfHwgaW5kaWNhdG9yID09PSBcIi1cIikge1xuICAgICAgICBpbmRleCA9IGNvbXB1dGVEZXN0SW5kZXgoY3VyckluZGV4ICsgK2Ake2luZGljYXRvcn0keytudW1iZXIgfHwgMX1gLCBjdXJySW5kZXgsIHRydWUpO1xuICAgICAgfSBlbHNlIGlmIChpbmRpY2F0b3IgPT09IFwiPlwiKSB7XG4gICAgICAgIGluZGV4ID0gbnVtYmVyID8gdG9JbmRleCgrbnVtYmVyKSA6IGdldE5leHQodHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGluZGljYXRvciA9PT0gXCI8XCIpIHtcbiAgICAgICAgaW5kZXggPSBnZXRQcmV2KHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNMb29wKSB7XG4gICAgICAgIGluZGV4ID0gY2xhbXAoY29udHJvbCwgLXBlclBhZ2UsIHNsaWRlQ291bnQgKyBwZXJQYWdlIC0gMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleCA9IGNsYW1wKGNvbnRyb2wsIDAsIGdldEVuZCgpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG4gIGZ1bmN0aW9uIGdldE5leHQoZGVzdGluYXRpb24pIHtcbiAgICByZXR1cm4gZ2V0QWRqYWNlbnQoZmFsc2UsIGRlc3RpbmF0aW9uKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRQcmV2KGRlc3RpbmF0aW9uKSB7XG4gICAgcmV0dXJuIGdldEFkamFjZW50KHRydWUsIGRlc3RpbmF0aW9uKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRBZGphY2VudChwcmV2LCBkZXN0aW5hdGlvbikge1xuICAgIGNvbnN0IG51bWJlciA9IHBlck1vdmUgfHwgKGhhc0ZvY3VzKCkgPyAxIDogcGVyUGFnZSk7XG4gICAgY29uc3QgZGVzdCA9IGNvbXB1dGVEZXN0SW5kZXgoY3VyckluZGV4ICsgbnVtYmVyICogKHByZXYgPyAtMSA6IDEpLCBjdXJySW5kZXgpO1xuICAgIGlmIChkZXN0ID09PSAtMSAmJiBpc1NsaWRlKSB7XG4gICAgICBpZiAoIWFwcHJveGltYXRlbHlFcXVhbChnZXRQb3NpdGlvbigpLCBnZXRMaW1pdCghcHJldiksIDEpKSB7XG4gICAgICAgIHJldHVybiBwcmV2ID8gMCA6IGdldEVuZCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGVzdGluYXRpb24gPyBkZXN0IDogbG9vcChkZXN0KTtcbiAgfVxuICBmdW5jdGlvbiBjb21wdXRlRGVzdEluZGV4KGRlc3QsIGZyb20sIGluY3JlbWVudGFsKSB7XG4gICAgaWYgKGlzRW5vdWdoKCkpIHtcbiAgICAgIGNvbnN0IGVuZCA9IGdldEVuZCgpO1xuICAgICAgaWYgKGRlc3QgPCAwIHx8IGRlc3QgPiBlbmQpIHtcbiAgICAgICAgaWYgKGJldHdlZW4oMCwgZGVzdCwgZnJvbSwgdHJ1ZSkgfHwgYmV0d2VlbihlbmQsIGZyb20sIGRlc3QsIHRydWUpKSB7XG4gICAgICAgICAgZGVzdCA9IHRvSW5kZXgodG9QYWdlKGRlc3QpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaXNMb29wKSB7XG4gICAgICAgICAgICBkZXN0ID0gcGVyTW92ZSA/IGRlc3QgOiBkZXN0IDwgMCA/IC0oc2xpZGVDb3VudCAlIHBlclBhZ2UgfHwgcGVyUGFnZSkgOiBzbGlkZUNvdW50O1xuICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5yZXdpbmQpIHtcbiAgICAgICAgICAgIGRlc3QgPSBkZXN0IDwgMCA/IGVuZCA6IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlc3QgPSAtMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaW5jcmVtZW50YWwgJiYgZGVzdCAhPT0gZnJvbSkge1xuICAgICAgICAgIGRlc3QgPSBwZXJNb3ZlID8gZGVzdCA6IHRvSW5kZXgodG9QYWdlKGZyb20pICsgKGRlc3QgPCBmcm9tID8gLTEgOiAxKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVzdCA9IC0xO1xuICAgIH1cbiAgICByZXR1cm4gZGVzdDtcbiAgfVxuICBmdW5jdGlvbiBnZXRFbmQoKSB7XG4gICAgbGV0IGVuZCA9IHNsaWRlQ291bnQgLSBwZXJQYWdlO1xuICAgIGlmIChoYXNGb2N1cygpIHx8IGlzTG9vcCAmJiBwZXJNb3ZlKSB7XG4gICAgICBlbmQgPSBzbGlkZUNvdW50IC0gMTtcbiAgICB9XG4gICAgcmV0dXJuIG1heChlbmQsIDApO1xuICB9XG4gIGZ1bmN0aW9uIGxvb3AoaW5kZXgpIHtcbiAgICBpZiAoaXNMb29wKSB7XG4gICAgICByZXR1cm4gaXNFbm91Z2goKSA/IGluZGV4ICUgc2xpZGVDb3VudCArIChpbmRleCA8IDAgPyBzbGlkZUNvdW50IDogMCkgOiAtMTtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG4gIGZ1bmN0aW9uIHRvSW5kZXgocGFnZSkge1xuICAgIHJldHVybiBjbGFtcChoYXNGb2N1cygpID8gcGFnZSA6IHBlclBhZ2UgKiBwYWdlLCAwLCBnZXRFbmQoKSk7XG4gIH1cbiAgZnVuY3Rpb24gdG9QYWdlKGluZGV4KSB7XG4gICAgaWYgKCFoYXNGb2N1cygpKSB7XG4gICAgICBpbmRleCA9IGJldHdlZW4oaW5kZXgsIHNsaWRlQ291bnQgLSBwZXJQYWdlLCBzbGlkZUNvdW50IC0gMSkgPyBzbGlkZUNvdW50IC0gMSA6IGluZGV4O1xuICAgICAgaW5kZXggPSBmbG9vcihpbmRleCAvIHBlclBhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cbiAgZnVuY3Rpb24gdG9EZXN0KGRlc3RpbmF0aW9uKSB7XG4gICAgY29uc3QgY2xvc2VzdCA9IE1vdmUudG9JbmRleChkZXN0aW5hdGlvbik7XG4gICAgcmV0dXJuIGlzU2xpZGUgPyBjbGFtcChjbG9zZXN0LCAwLCBnZXRFbmQoKSkgOiBjbG9zZXN0O1xuICB9XG4gIGZ1bmN0aW9uIHNldEluZGV4KGluZGV4KSB7XG4gICAgaWYgKGluZGV4ICE9PSBjdXJySW5kZXgpIHtcbiAgICAgIHByZXZJbmRleCA9IGN1cnJJbmRleDtcbiAgICAgIGN1cnJJbmRleCA9IGluZGV4O1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZXRJbmRleChwcmV2KSB7XG4gICAgcmV0dXJuIHByZXYgPyBwcmV2SW5kZXggOiBjdXJySW5kZXg7XG4gIH1cbiAgZnVuY3Rpb24gaGFzRm9jdXMoKSB7XG4gICAgcmV0dXJuICFpc1VuZGVmaW5lZChvcHRpb25zLmZvY3VzKSB8fCBvcHRpb25zLmlzTmF2aWdhdGlvbjtcbiAgfVxuICByZXR1cm4ge1xuICAgIG1vdW50LFxuICAgIGdvLFxuICAgIHNjcm9sbCxcbiAgICBnZXROZXh0LFxuICAgIGdldFByZXYsXG4gICAgZ2V0RW5kLFxuICAgIHNldEluZGV4LFxuICAgIGdldEluZGV4LFxuICAgIHRvSW5kZXgsXG4gICAgdG9QYWdlLFxuICAgIHRvRGVzdCxcbiAgICBoYXNGb2N1c1xuICB9O1xufVxuXG5jb25zdCBYTUxfTkFNRV9TUEFDRSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcbmNvbnN0IFBBVEggPSBcIm0xNS41IDAuOTMyLTQuMyA0LjM4IDE0LjUgMTQuNi0xNC41IDE0LjUgNC4zIDQuNCAxNC42LTE0LjYgNC40LTQuMy00LjQtNC40LTE0LjYtMTQuNnpcIjtcbmNvbnN0IFNJWkUgPSA0MDtcblxuZnVuY3Rpb24gQXJyb3dzKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24sIGJpbmQsIGVtaXQgfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICBjb25zdCB7IGNsYXNzZXMsIGkxOG4gfSA9IG9wdGlvbnM7XG4gIGNvbnN0IHsgRWxlbWVudHMsIENvbnRyb2xsZXIgfSA9IENvbXBvbmVudHMyO1xuICBsZXQgd3JhcHBlciA9IEVsZW1lbnRzLmFycm93cztcbiAgbGV0IHByZXYgPSBFbGVtZW50cy5wcmV2O1xuICBsZXQgbmV4dCA9IEVsZW1lbnRzLm5leHQ7XG4gIGxldCBjcmVhdGVkO1xuICBjb25zdCBhcnJvd3MgPSB7fTtcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaW5pdCgpO1xuICAgIG9uKEVWRU5UX1VQREFURUQsIGluaXQpO1xuICB9XG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgaWYgKG9wdGlvbnMuYXJyb3dzKSB7XG4gICAgICBpZiAoIXByZXYgfHwgIW5leHQpIHtcbiAgICAgICAgY3JlYXRlQXJyb3dzKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwcmV2ICYmIG5leHQpIHtcbiAgICAgIGlmICghYXJyb3dzLnByZXYpIHtcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gRWxlbWVudHMudHJhY2s7XG4gICAgICAgIHNldEF0dHJpYnV0ZShwcmV2LCBBUklBX0NPTlRST0xTLCBpZCk7XG4gICAgICAgIHNldEF0dHJpYnV0ZShuZXh0LCBBUklBX0NPTlRST0xTLCBpZCk7XG4gICAgICAgIGFycm93cy5wcmV2ID0gcHJldjtcbiAgICAgICAgYXJyb3dzLm5leHQgPSBuZXh0O1xuICAgICAgICBsaXN0ZW4oKTtcbiAgICAgICAgZW1pdChFVkVOVF9BUlJPV1NfTU9VTlRFRCwgcHJldiwgbmV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwbGF5KHdyYXBwZXIsIG9wdGlvbnMuYXJyb3dzID09PSBmYWxzZSA/IFwibm9uZVwiIDogXCJcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgaWYgKGNyZWF0ZWQpIHtcbiAgICAgIHJlbW92ZSh3cmFwcGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVtb3ZlQXR0cmlidXRlKHByZXYsIEFMTF9BVFRSSUJVVEVTKTtcbiAgICAgIHJlbW92ZUF0dHJpYnV0ZShuZXh0LCBBTExfQVRUUklCVVRFUyk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGxpc3RlbigpIHtcbiAgICBjb25zdCB7IGdvIH0gPSBDb250cm9sbGVyO1xuICAgIG9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9NT1ZFRCwgRVZFTlRfVVBEQVRFRCwgRVZFTlRfUkVGUkVTSCwgRVZFTlRfU0NST0xMRURdLCB1cGRhdGUpO1xuICAgIGJpbmQobmV4dCwgXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBnbyhcIj5cIiwgdHJ1ZSk7XG4gICAgfSk7XG4gICAgYmluZChwcmV2LCBcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGdvKFwiPFwiLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVBcnJvd3MoKSB7XG4gICAgd3JhcHBlciA9IGNyZWF0ZShcImRpdlwiLCBjbGFzc2VzLmFycm93cyk7XG4gICAgcHJldiA9IGNyZWF0ZUFycm93KHRydWUpO1xuICAgIG5leHQgPSBjcmVhdGVBcnJvdyhmYWxzZSk7XG4gICAgY3JlYXRlZCA9IHRydWU7XG4gICAgYXBwZW5kKHdyYXBwZXIsIFtwcmV2LCBuZXh0XSk7XG4gICAgYmVmb3JlKHdyYXBwZXIsIGNoaWxkKG9wdGlvbnMuYXJyb3dzID09PSBcInNsaWRlclwiICYmIEVsZW1lbnRzLnNsaWRlciB8fCBTcGxpZGUyLnJvb3QpKTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVBcnJvdyhwcmV2Mikge1xuICAgIGNvbnN0IGFycm93ID0gYDxidXR0b24gY2xhc3M9XCIke2NsYXNzZXMuYXJyb3d9ICR7cHJldjIgPyBjbGFzc2VzLnByZXYgOiBjbGFzc2VzLm5leHR9XCIgdHlwZT1cImJ1dHRvblwiPjxzdmcgeG1sbnM9XCIke1hNTF9OQU1FX1NQQUNFfVwiIHZpZXdCb3g9XCIwIDAgJHtTSVpFfSAke1NJWkV9XCIgd2lkdGg9XCIke1NJWkV9XCIgaGVpZ2h0PVwiJHtTSVpFfVwiPjxwYXRoIGQ9XCIke29wdGlvbnMuYXJyb3dQYXRoIHx8IFBBVEh9XCIgLz5gO1xuICAgIHJldHVybiBwYXJzZUh0bWwoYXJyb3cpO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICBjb25zdCBpbmRleCA9IFNwbGlkZTIuaW5kZXg7XG4gICAgY29uc3QgcHJldkluZGV4ID0gQ29udHJvbGxlci5nZXRQcmV2KCk7XG4gICAgY29uc3QgbmV4dEluZGV4ID0gQ29udHJvbGxlci5nZXROZXh0KCk7XG4gICAgY29uc3QgcHJldkxhYmVsID0gcHJldkluZGV4ID4gLTEgJiYgaW5kZXggPCBwcmV2SW5kZXggPyBpMThuLmxhc3QgOiBpMThuLnByZXY7XG4gICAgY29uc3QgbmV4dExhYmVsID0gbmV4dEluZGV4ID4gLTEgJiYgaW5kZXggPiBuZXh0SW5kZXggPyBpMThuLmZpcnN0IDogaTE4bi5uZXh0O1xuICAgIHByZXYuZGlzYWJsZWQgPSBwcmV2SW5kZXggPCAwO1xuICAgIG5leHQuZGlzYWJsZWQgPSBuZXh0SW5kZXggPCAwO1xuICAgIHNldEF0dHJpYnV0ZShwcmV2LCBBUklBX0xBQkVMLCBwcmV2TGFiZWwpO1xuICAgIHNldEF0dHJpYnV0ZShuZXh0LCBBUklBX0xBQkVMLCBuZXh0TGFiZWwpO1xuICAgIGVtaXQoRVZFTlRfQVJST1dTX1VQREFURUQsIHByZXYsIG5leHQsIHByZXZJbmRleCwgbmV4dEluZGV4KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGFycm93cyxcbiAgICBtb3VudCxcbiAgICBkZXN0cm95XG4gIH07XG59XG5cbmZ1bmN0aW9uIEF1dG9wbGF5KFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24sIGJpbmQsIGVtaXQgfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICBjb25zdCB7IEVsZW1lbnRzIH0gPSBDb21wb25lbnRzMjtcbiAgY29uc3QgaW50ZXJ2YWwgPSBSZXF1ZXN0SW50ZXJ2YWwob3B0aW9ucy5pbnRlcnZhbCwgU3BsaWRlMi5nby5iaW5kKFNwbGlkZTIsIFwiPlwiKSwgdXBkYXRlKTtcbiAgY29uc3QgeyBpc1BhdXNlZCB9ID0gaW50ZXJ2YWw7XG4gIGxldCBob3ZlcmVkO1xuICBsZXQgZm9jdXNlZDtcbiAgbGV0IHBhdXNlZDtcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgY29uc3QgeyBhdXRvcGxheSB9ID0gb3B0aW9ucztcbiAgICBpZiAoYXV0b3BsYXkpIHtcbiAgICAgIGluaXRCdXR0b24odHJ1ZSk7XG4gICAgICBpbml0QnV0dG9uKGZhbHNlKTtcbiAgICAgIGxpc3RlbigpO1xuICAgICAgaWYgKGF1dG9wbGF5ICE9PSBcInBhdXNlXCIpIHtcbiAgICAgICAgcGxheSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpbml0QnV0dG9uKGZvclBhdXNlKSB7XG4gICAgY29uc3QgcHJvcCA9IGZvclBhdXNlID8gXCJwYXVzZVwiIDogXCJwbGF5XCI7XG4gICAgY29uc3QgYnV0dG9uID0gRWxlbWVudHNbcHJvcF07XG4gICAgaWYgKGJ1dHRvbikge1xuICAgICAgc2V0QXR0cmlidXRlKGJ1dHRvbiwgQVJJQV9DT05UUk9MUywgRWxlbWVudHMudHJhY2suaWQpO1xuICAgICAgc2V0QXR0cmlidXRlKGJ1dHRvbiwgQVJJQV9MQUJFTCwgb3B0aW9ucy5pMThuW3Byb3BdKTtcbiAgICAgIGJpbmQoYnV0dG9uLCBcImNsaWNrXCIsIGZvclBhdXNlID8gcGF1c2UgOiBwbGF5KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbGlzdGVuKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gRWxlbWVudHM7XG4gICAgaWYgKG9wdGlvbnMucGF1c2VPbkhvdmVyKSB7XG4gICAgICBiaW5kKHJvb3QsIFwibW91c2VlbnRlciBtb3VzZWxlYXZlXCIsIChlKSA9PiB7XG4gICAgICAgIGhvdmVyZWQgPSBlLnR5cGUgPT09IFwibW91c2VlbnRlclwiO1xuICAgICAgICBhdXRvVG9nZ2xlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMucGF1c2VPbkZvY3VzKSB7XG4gICAgICBiaW5kKHJvb3QsIFwiZm9jdXNpbiBmb2N1c291dFwiLCAoZSkgPT4ge1xuICAgICAgICBmb2N1c2VkID0gZS50eXBlID09PSBcImZvY3VzaW5cIjtcbiAgICAgICAgYXV0b1RvZ2dsZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIG9uKFtFVkVOVF9NT1ZFLCBFVkVOVF9TQ1JPTEwsIEVWRU5UX1JFRlJFU0hdLCBpbnRlcnZhbC5yZXdpbmQpO1xuICB9XG4gIGZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgaWYgKGlzUGF1c2VkKCkgJiYgQ29tcG9uZW50czIuU2xpZGVzLmlzRW5vdWdoKCkpIHtcbiAgICAgIGludGVydmFsLnN0YXJ0KCFvcHRpb25zLnJlc2V0UHJvZ3Jlc3MpO1xuICAgICAgZm9jdXNlZCA9IGhvdmVyZWQgPSBwYXVzZWQgPSBmYWxzZTtcbiAgICAgIGVtaXQoRVZFTlRfQVVUT1BMQVlfUExBWSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHBhdXNlKG1hbnVhbCA9IHRydWUpIHtcbiAgICBpZiAoIWlzUGF1c2VkKCkpIHtcbiAgICAgIGludGVydmFsLnBhdXNlKCk7XG4gICAgICBlbWl0KEVWRU5UX0FVVE9QTEFZX1BBVVNFKTtcbiAgICB9XG4gICAgcGF1c2VkID0gbWFudWFsO1xuICB9XG4gIGZ1bmN0aW9uIGF1dG9Ub2dnbGUoKSB7XG4gICAgaWYgKCFwYXVzZWQpIHtcbiAgICAgIGlmICghaG92ZXJlZCAmJiAhZm9jdXNlZCkge1xuICAgICAgICBwbGF5KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXVzZShmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZShyYXRlKSB7XG4gICAgY29uc3QgeyBiYXIgfSA9IEVsZW1lbnRzO1xuICAgIGlmIChiYXIpIHtcbiAgICAgIHN0eWxlKGJhciwgXCJ3aWR0aFwiLCBgJHtyYXRlICogMTAwfSVgKTtcbiAgICB9XG4gICAgZW1pdChFVkVOVF9BVVRPUExBWV9QTEFZSU5HLCByYXRlKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIG1vdW50LFxuICAgIGRlc3Ryb3k6IGludGVydmFsLmNhbmNlbCxcbiAgICBwbGF5LFxuICAgIHBhdXNlLFxuICAgIGlzUGF1c2VkXG4gIH07XG59XG5cbmZ1bmN0aW9uIENvdmVyKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24gfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBpZiAob3B0aW9ucy5jb3Zlcikge1xuICAgICAgb24oRVZFTlRfTEFaWUxPQURfTE9BREVELCAoaW1nLCBTbGlkZSkgPT4ge1xuICAgICAgICB0b2dnbGUodHJ1ZSwgaW1nLCBTbGlkZSk7XG4gICAgICB9KTtcbiAgICAgIG9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9VUERBVEVELCBFVkVOVF9SRUZSRVNIXSwgYXBwbHkuYmluZChudWxsLCB0cnVlKSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgYXBwbHkoZmFsc2UpO1xuICB9XG4gIGZ1bmN0aW9uIGFwcGx5KGNvdmVyKSB7XG4gICAgQ29tcG9uZW50czIuU2xpZGVzLmZvckVhY2goKFNsaWRlKSA9PiB7XG4gICAgICBjb25zdCBpbWcgPSBjaGlsZChTbGlkZS5jb250YWluZXIgfHwgU2xpZGUuc2xpZGUsIFwiaW1nXCIpO1xuICAgICAgaWYgKGltZyAmJiBpbWcuc3JjKSB7XG4gICAgICAgIHRvZ2dsZShjb3ZlciwgaW1nLCBTbGlkZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gdG9nZ2xlKGNvdmVyLCBpbWcsIFNsaWRlKSB7XG4gICAgU2xpZGUuc3R5bGUoXCJiYWNrZ3JvdW5kXCIsIGNvdmVyID8gYGNlbnRlci9jb3ZlciBuby1yZXBlYXQgdXJsKFwiJHtpbWcuc3JjfVwiKWAgOiBcIlwiLCB0cnVlKTtcbiAgICBkaXNwbGF5KGltZywgY292ZXIgPyBcIm5vbmVcIiA6IFwiXCIpO1xuICB9XG4gIHJldHVybiB7XG4gICAgbW91bnQsXG4gICAgZGVzdHJveVxuICB9O1xufVxuXG5jb25zdCBCT1VOQ0VfRElGRl9USFJFU0hPTEQgPSAxMDtcbmNvbnN0IEJPVU5DRV9EVVJBVElPTiA9IDYwMDtcbmNvbnN0IEZSSUNUSU9OX0ZBQ1RPUiA9IDAuNjtcbmNvbnN0IEJBU0VfVkVMT0NJVFkgPSAxLjU7XG5jb25zdCBNSU5fRFVSQVRJT04gPSA4MDA7XG5cbmZ1bmN0aW9uIFNjcm9sbChTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICBjb25zdCB7IG9uLCBlbWl0IH0gPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgY29uc3QgeyBNb3ZlIH0gPSBDb21wb25lbnRzMjtcbiAgY29uc3QgeyBnZXRQb3NpdGlvbiwgZ2V0TGltaXQsIGV4Y2VlZGVkTGltaXQgfSA9IE1vdmU7XG4gIGxldCBpbnRlcnZhbDtcbiAgbGV0IHNjcm9sbENhbGxiYWNrO1xuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBvbihFVkVOVF9NT1ZFLCBjbGVhcik7XG4gICAgb24oW0VWRU5UX1VQREFURUQsIEVWRU5UX1JFRlJFU0hdLCBjYW5jZWwpO1xuICB9XG4gIGZ1bmN0aW9uIHNjcm9sbChkZXN0aW5hdGlvbiwgZHVyYXRpb24sIGNhbGxiYWNrLCBzdXBwcmVzc0NvbnN0cmFpbnQpIHtcbiAgICBjb25zdCBzdGFydCA9IGdldFBvc2l0aW9uKCk7XG4gICAgbGV0IGZyaWN0aW9uID0gMTtcbiAgICBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IGNvbXB1dGVEdXJhdGlvbihhYnMoZGVzdGluYXRpb24gLSBzdGFydCkpO1xuICAgIHNjcm9sbENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgY2xlYXIoKTtcbiAgICBpbnRlcnZhbCA9IFJlcXVlc3RJbnRlcnZhbChkdXJhdGlvbiwgb25TY3JvbGxlZCwgKHJhdGUpID0+IHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gZ2V0UG9zaXRpb24oKTtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHN0YXJ0ICsgKGRlc3RpbmF0aW9uIC0gc3RhcnQpICogZWFzaW5nKHJhdGUpO1xuICAgICAgY29uc3QgZGlmZiA9ICh0YXJnZXQgLSBnZXRQb3NpdGlvbigpKSAqIGZyaWN0aW9uO1xuICAgICAgTW92ZS50cmFuc2xhdGUocG9zaXRpb24gKyBkaWZmKTtcbiAgICAgIGlmIChTcGxpZGUyLmlzKFNMSURFKSAmJiAhc3VwcHJlc3NDb25zdHJhaW50ICYmIGV4Y2VlZGVkTGltaXQoKSkge1xuICAgICAgICBmcmljdGlvbiAqPSBGUklDVElPTl9GQUNUT1I7XG4gICAgICAgIGlmIChhYnMoZGlmZikgPCBCT1VOQ0VfRElGRl9USFJFU0hPTEQpIHtcbiAgICAgICAgICBib3VuY2UoZXhjZWVkZWRMaW1pdChmYWxzZSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgMSk7XG4gICAgZW1pdChFVkVOVF9TQ1JPTEwpO1xuICAgIGludGVydmFsLnN0YXJ0KCk7XG4gIH1cbiAgZnVuY3Rpb24gYm91bmNlKGJhY2t3YXJkcykge1xuICAgIHNjcm9sbChnZXRMaW1pdCghYmFja3dhcmRzKSwgQk9VTkNFX0RVUkFUSU9OLCBudWxsLCB0cnVlKTtcbiAgfVxuICBmdW5jdGlvbiBvblNjcm9sbGVkKCkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gZ2V0UG9zaXRpb24oKTtcbiAgICBjb25zdCBpbmRleCA9IE1vdmUudG9JbmRleChwb3NpdGlvbik7XG4gICAgaWYgKCFiZXR3ZWVuKGluZGV4LCAwLCBTcGxpZGUyLmxlbmd0aCAtIDEpKSB7XG4gICAgICBNb3ZlLnRyYW5zbGF0ZShNb3ZlLnNoaWZ0KHBvc2l0aW9uLCBpbmRleCA+IDApLCB0cnVlKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2FsbGJhY2sgJiYgc2Nyb2xsQ2FsbGJhY2soKTtcbiAgICBlbWl0KEVWRU5UX1NDUk9MTEVEKTtcbiAgfVxuICBmdW5jdGlvbiBjb21wdXRlRHVyYXRpb24oZGlzdGFuY2UpIHtcbiAgICByZXR1cm4gbWF4KGRpc3RhbmNlIC8gQkFTRV9WRUxPQ0lUWSwgTUlOX0RVUkFUSU9OKTtcbiAgfVxuICBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICBpZiAoaW50ZXJ2YWwpIHtcbiAgICAgIGludGVydmFsLmNhbmNlbCgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKGludGVydmFsICYmICFpbnRlcnZhbC5pc1BhdXNlZCgpKSB7XG4gICAgICBjbGVhcigpO1xuICAgICAgb25TY3JvbGxlZCgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBlYXNpbmcodCkge1xuICAgIGNvbnN0IHsgZWFzaW5nRnVuYyB9ID0gb3B0aW9ucztcbiAgICByZXR1cm4gZWFzaW5nRnVuYyA/IGVhc2luZ0Z1bmModCkgOiAxIC0gTWF0aC5wb3coMSAtIHQsIDQpO1xuICB9XG4gIHJldHVybiB7XG4gICAgbW91bnQsXG4gICAgZGVzdHJveTogY2xlYXIsXG4gICAgc2Nyb2xsLFxuICAgIGNhbmNlbFxuICB9O1xufVxuXG5jb25zdCBGUklDVElPTiA9IDU7XG5jb25zdCBMT0dfSU5URVJWQUwgPSAyMDA7XG5jb25zdCBQT0lOVEVSX0RPV05fRVZFTlRTID0gXCJ0b3VjaHN0YXJ0IG1vdXNlZG93blwiO1xuY29uc3QgUE9JTlRFUl9NT1ZFX0VWRU5UUyA9IFwidG91Y2htb3ZlIG1vdXNlbW92ZVwiO1xuY29uc3QgUE9JTlRFUl9VUF9FVkVOVFMgPSBcInRvdWNoZW5kIHRvdWNoY2FuY2VsIG1vdXNldXBcIjtcblxuZnVuY3Rpb24gRHJhZyhTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICBjb25zdCB7IG9uLCBlbWl0LCBiaW5kLCB1bmJpbmQgfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICBjb25zdCB7IE1vdmUsIFNjcm9sbCwgQ29udHJvbGxlciB9ID0gQ29tcG9uZW50czI7XG4gIGNvbnN0IHsgdHJhY2sgfSA9IENvbXBvbmVudHMyLkVsZW1lbnRzO1xuICBjb25zdCB7IHJlc29sdmUsIG9yaWVudCB9ID0gQ29tcG9uZW50czIuRGlyZWN0aW9uO1xuICBjb25zdCB7IGdldFBvc2l0aW9uLCBleGNlZWRlZExpbWl0IH0gPSBNb3ZlO1xuICBjb25zdCBsaXN0ZW5lck9wdGlvbnMgPSB7IHBhc3NpdmU6IGZhbHNlLCBjYXB0dXJlOiB0cnVlIH07XG4gIGxldCBiYXNlUG9zaXRpb247XG4gIGxldCBiYXNlRXZlbnQ7XG4gIGxldCBwcmV2QmFzZUV2ZW50O1xuICBsZXQgbGFzdEV2ZW50O1xuICBsZXQgaXNGcmVlO1xuICBsZXQgZHJhZ2dpbmc7XG4gIGxldCBoYXNFeGNlZWRlZCA9IGZhbHNlO1xuICBsZXQgY2xpY2tQcmV2ZW50ZWQ7XG4gIGxldCBkaXNhYmxlZDtcbiAgbGV0IHRhcmdldDtcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgYmluZCh0cmFjaywgUE9JTlRFUl9NT1ZFX0VWRU5UUywgbm9vcCwgbGlzdGVuZXJPcHRpb25zKTtcbiAgICBiaW5kKHRyYWNrLCBQT0lOVEVSX1VQX0VWRU5UUywgbm9vcCwgbGlzdGVuZXJPcHRpb25zKTtcbiAgICBiaW5kKHRyYWNrLCBQT0lOVEVSX0RPV05fRVZFTlRTLCBvblBvaW50ZXJEb3duLCBsaXN0ZW5lck9wdGlvbnMpO1xuICAgIGJpbmQodHJhY2ssIFwiY2xpY2tcIiwgb25DbGljaywgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgIGJpbmQodHJhY2ssIFwiZHJhZ3N0YXJ0XCIsIHByZXZlbnQpO1xuICAgIG9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9VUERBVEVEXSwgaW5pdCk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zdCB7IGRyYWcgfSA9IG9wdGlvbnM7XG4gICAgZGlzYWJsZSghZHJhZyk7XG4gICAgaXNGcmVlID0gZHJhZyA9PT0gXCJmcmVlXCI7XG4gIH1cbiAgZnVuY3Rpb24gb25Qb2ludGVyRG93bihlKSB7XG4gICAgaWYgKCFkaXNhYmxlZCkge1xuICAgICAgY29uc3QgeyBub0RyYWcgfSA9IG9wdGlvbnM7XG4gICAgICBjb25zdCBpc1RvdWNoID0gaXNUb3VjaEV2ZW50KGUpO1xuICAgICAgY29uc3QgaXNEcmFnZ2FibGUgPSAhbm9EcmFnIHx8IGlzSFRNTEVsZW1lbnQoZS50YXJnZXQpICYmICFtYXRjaGVzKGUudGFyZ2V0LCBub0RyYWcpO1xuICAgICAgaWYgKGlzRHJhZ2dhYmxlICYmIChpc1RvdWNoIHx8ICFlLmJ1dHRvbikpIHtcbiAgICAgICAgaWYgKCFNb3ZlLmlzQnVzeSgpKSB7XG4gICAgICAgICAgdGFyZ2V0ID0gaXNUb3VjaCA/IHRyYWNrIDogd2luZG93O1xuICAgICAgICAgIHByZXZCYXNlRXZlbnQgPSBudWxsO1xuICAgICAgICAgIGxhc3RFdmVudCA9IG51bGw7XG4gICAgICAgICAgY2xpY2tQcmV2ZW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICBiaW5kKHRhcmdldCwgUE9JTlRFUl9NT1ZFX0VWRU5UUywgb25Qb2ludGVyTW92ZSwgbGlzdGVuZXJPcHRpb25zKTtcbiAgICAgICAgICBiaW5kKHRhcmdldCwgUE9JTlRFUl9VUF9FVkVOVFMsIG9uUG9pbnRlclVwLCBsaXN0ZW5lck9wdGlvbnMpO1xuICAgICAgICAgIE1vdmUuY2FuY2VsKCk7XG4gICAgICAgICAgU2Nyb2xsLmNhbmNlbCgpO1xuICAgICAgICAgIHNhdmUoZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJldmVudChlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBvblBvaW50ZXJNb3ZlKGUpIHtcbiAgICBpZiAoIWxhc3RFdmVudCkge1xuICAgICAgZW1pdChFVkVOVF9EUkFHKTtcbiAgICB9XG4gICAgbGFzdEV2ZW50ID0gZTtcbiAgICBpZiAoZS5jYW5jZWxhYmxlKSB7XG4gICAgICBjb25zdCBkaWZmID0gY29vcmRPZihlKSAtIGNvb3JkT2YoYmFzZUV2ZW50KTtcbiAgICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgICBNb3ZlLnRyYW5zbGF0ZShiYXNlUG9zaXRpb24gKyBjb25zdHJhaW4oZGlmZikpO1xuICAgICAgICBjb25zdCBleHBpcmVkID0gdGltZU9mKGUpIC0gdGltZU9mKGJhc2VFdmVudCkgPiBMT0dfSU5URVJWQUw7XG4gICAgICAgIGNvbnN0IGV4Y2VlZGVkID0gaGFzRXhjZWVkZWQgIT09IChoYXNFeGNlZWRlZCA9IGV4Y2VlZGVkTGltaXQoKSk7XG4gICAgICAgIGlmIChleHBpcmVkIHx8IGV4Y2VlZGVkKSB7XG4gICAgICAgICAgc2F2ZShlKTtcbiAgICAgICAgfVxuICAgICAgICBlbWl0KEVWRU5UX0RSQUdHSU5HKTtcbiAgICAgICAgY2xpY2tQcmV2ZW50ZWQgPSB0cnVlO1xuICAgICAgICBwcmV2ZW50KGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHsgZHJhZ01pblRocmVzaG9sZDogdGhyZXNob2xkcyB9ID0gb3B0aW9ucztcbiAgICAgICAgdGhyZXNob2xkcyA9IGlzT2JqZWN0KHRocmVzaG9sZHMpID8gdGhyZXNob2xkcyA6IHsgbW91c2U6IDAsIHRvdWNoOiArdGhyZXNob2xkcyB8fCAxMCB9O1xuICAgICAgICBkcmFnZ2luZyA9IGFicyhkaWZmKSA+IChpc1RvdWNoRXZlbnQoZSkgPyB0aHJlc2hvbGRzLnRvdWNoIDogdGhyZXNob2xkcy5tb3VzZSk7XG4gICAgICAgIGlmIChpc1NsaWRlckRpcmVjdGlvbigpKSB7XG4gICAgICAgICAgcHJldmVudChlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBvblBvaW50ZXJVcChlKSB7XG4gICAgdW5iaW5kKHRhcmdldCwgUE9JTlRFUl9NT1ZFX0VWRU5UUywgb25Qb2ludGVyTW92ZSk7XG4gICAgdW5iaW5kKHRhcmdldCwgUE9JTlRFUl9VUF9FVkVOVFMsIG9uUG9pbnRlclVwKTtcbiAgICBpZiAobGFzdEV2ZW50KSB7XG4gICAgICBpZiAoZHJhZ2dpbmcgfHwgZS5jYW5jZWxhYmxlICYmIGlzU2xpZGVyRGlyZWN0aW9uKCkpIHtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSBjb21wdXRlVmVsb2NpdHkoZSk7XG4gICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gY29tcHV0ZURlc3RpbmF0aW9uKHZlbG9jaXR5KTtcbiAgICAgICAgaWYgKGlzRnJlZSkge1xuICAgICAgICAgIENvbnRyb2xsZXIuc2Nyb2xsKGRlc3RpbmF0aW9uKTtcbiAgICAgICAgfSBlbHNlIGlmIChTcGxpZGUyLmlzKEZBREUpKSB7XG4gICAgICAgICAgQ29udHJvbGxlci5nbyhTcGxpZGUyLmluZGV4ICsgb3JpZW50KHNpZ24odmVsb2NpdHkpKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgQ29udHJvbGxlci5nbyhDb250cm9sbGVyLnRvRGVzdChkZXN0aW5hdGlvbiksIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHByZXZlbnQoZSk7XG4gICAgICB9XG4gICAgICBlbWl0KEVWRU5UX0RSQUdHRUQpO1xuICAgIH1cbiAgICBkcmFnZ2luZyA9IGZhbHNlO1xuICB9XG4gIGZ1bmN0aW9uIHNhdmUoZSkge1xuICAgIHByZXZCYXNlRXZlbnQgPSBiYXNlRXZlbnQ7XG4gICAgYmFzZUV2ZW50ID0gZTtcbiAgICBiYXNlUG9zaXRpb24gPSBnZXRQb3NpdGlvbigpO1xuICB9XG4gIGZ1bmN0aW9uIG9uQ2xpY2soZSkge1xuICAgIGlmICghZGlzYWJsZWQgJiYgY2xpY2tQcmV2ZW50ZWQpIHtcbiAgICAgIHByZXZlbnQoZSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGlzU2xpZGVyRGlyZWN0aW9uKCkge1xuICAgIGNvbnN0IGRpZmZYID0gYWJzKGNvb3JkT2YobGFzdEV2ZW50KSAtIGNvb3JkT2YoYmFzZUV2ZW50KSk7XG4gICAgY29uc3QgZGlmZlkgPSBhYnMoY29vcmRPZihsYXN0RXZlbnQsIHRydWUpIC0gY29vcmRPZihiYXNlRXZlbnQsIHRydWUpKTtcbiAgICByZXR1cm4gZGlmZlggPiBkaWZmWTtcbiAgfVxuICBmdW5jdGlvbiBjb21wdXRlVmVsb2NpdHkoZSkge1xuICAgIGlmIChTcGxpZGUyLmlzKExPT1ApIHx8ICFoYXNFeGNlZWRlZCkge1xuICAgICAgY29uc3QgYmFzZSA9IGJhc2VFdmVudCA9PT0gbGFzdEV2ZW50ICYmIHByZXZCYXNlRXZlbnQgfHwgYmFzZUV2ZW50O1xuICAgICAgY29uc3QgZGlmZkNvb3JkID0gY29vcmRPZihsYXN0RXZlbnQpIC0gY29vcmRPZihiYXNlKTtcbiAgICAgIGNvbnN0IGRpZmZUaW1lID0gdGltZU9mKGUpIC0gdGltZU9mKGJhc2UpO1xuICAgICAgY29uc3QgaXNGbGljayA9IHRpbWVPZihlKSAtIHRpbWVPZihsYXN0RXZlbnQpIDwgTE9HX0lOVEVSVkFMO1xuICAgICAgaWYgKGRpZmZUaW1lICYmIGlzRmxpY2spIHtcbiAgICAgICAgcmV0dXJuIGRpZmZDb29yZCAvIGRpZmZUaW1lO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuICBmdW5jdGlvbiBjb21wdXRlRGVzdGluYXRpb24odmVsb2NpdHkpIHtcbiAgICByZXR1cm4gZ2V0UG9zaXRpb24oKSArIHNpZ24odmVsb2NpdHkpICogbWluKGFicyh2ZWxvY2l0eSkgKiAob3B0aW9ucy5mbGlja1Bvd2VyIHx8IDYwMCksIGlzRnJlZSA/IEluZmluaXR5IDogQ29tcG9uZW50czIuTGF5b3V0Lmxpc3RTaXplKCkgKiAob3B0aW9ucy5mbGlja01heFBhZ2VzIHx8IDEpKTtcbiAgfVxuICBmdW5jdGlvbiBjb29yZE9mKGUsIG9ydGhvZ29uYWwpIHtcbiAgICByZXR1cm4gKGlzVG91Y2hFdmVudChlKSA/IGUudG91Y2hlc1swXSA6IGUpW2BwYWdlJHtyZXNvbHZlKG9ydGhvZ29uYWwgPyBcIllcIiA6IFwiWFwiKX1gXTtcbiAgfVxuICBmdW5jdGlvbiB0aW1lT2YoZSkge1xuICAgIHJldHVybiBlLnRpbWVTdGFtcDtcbiAgfVxuICBmdW5jdGlvbiBjb25zdHJhaW4oZGlmZikge1xuICAgIHJldHVybiBkaWZmIC8gKGhhc0V4Y2VlZGVkICYmIFNwbGlkZTIuaXMoU0xJREUpID8gRlJJQ1RJT04gOiAxKTtcbiAgfVxuICBmdW5jdGlvbiBpc1RvdWNoRXZlbnQoZSkge1xuICAgIHJldHVybiB0eXBlb2YgVG91Y2hFdmVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudDtcbiAgfVxuICBmdW5jdGlvbiBpc0RyYWdnaW5nKCkge1xuICAgIHJldHVybiBkcmFnZ2luZztcbiAgfVxuICBmdW5jdGlvbiBkaXNhYmxlKHZhbHVlKSB7XG4gICAgZGlzYWJsZWQgPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4ge1xuICAgIG1vdW50LFxuICAgIGRpc2FibGUsXG4gICAgaXNEcmFnZ2luZ1xuICB9O1xufVxuXG5jb25zdCBJRV9BUlJPV19LRVlTID0gW1wiTGVmdFwiLCBcIlJpZ2h0XCIsIFwiVXBcIiwgXCJEb3duXCJdO1xuZnVuY3Rpb24gS2V5Ym9hcmQoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBvbiwgYmluZCwgdW5iaW5kIH0gPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgY29uc3QgeyByb290IH0gPSBDb21wb25lbnRzMi5FbGVtZW50cztcbiAgY29uc3QgeyByZXNvbHZlIH0gPSBDb21wb25lbnRzMi5EaXJlY3Rpb247XG4gIGxldCB0YXJnZXQ7XG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGluaXQoKTtcbiAgICBvbihFVkVOVF9VUERBVEVELCAoKSA9PiB7XG4gICAgICBkZXN0cm95KCk7XG4gICAgICBpbml0KCk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zdCB7IGtleWJvYXJkID0gXCJnbG9iYWxcIiB9ID0gb3B0aW9ucztcbiAgICBpZiAoa2V5Ym9hcmQpIHtcbiAgICAgIGlmIChrZXlib2FyZCA9PT0gXCJmb2N1c2VkXCIpIHtcbiAgICAgICAgdGFyZ2V0ID0gcm9vdDtcbiAgICAgICAgc2V0QXR0cmlidXRlKHJvb3QsIFRBQl9JTkRFWCwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXQgPSB3aW5kb3c7XG4gICAgICB9XG4gICAgICBiaW5kKHRhcmdldCwgXCJrZXlkb3duXCIsIG9uS2V5ZG93bik7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgdW5iaW5kKHRhcmdldCwgXCJrZXlkb3duXCIpO1xuICAgIGlmIChpc0hUTUxFbGVtZW50KHRhcmdldCkpIHtcbiAgICAgIHJlbW92ZUF0dHJpYnV0ZSh0YXJnZXQsIFRBQl9JTkRFWCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG9uS2V5ZG93bihlKSB7XG4gICAgY29uc3QgeyBrZXkgfSA9IGU7XG4gICAgY29uc3Qgbm9ybWFsaXplZEtleSA9IGluY2x1ZGVzKElFX0FSUk9XX0tFWVMsIGtleSkgPyBgQXJyb3cke2tleX1gIDoga2V5O1xuICAgIGlmIChub3JtYWxpemVkS2V5ID09PSByZXNvbHZlKFwiQXJyb3dMZWZ0XCIpKSB7XG4gICAgICBTcGxpZGUyLmdvKFwiPFwiKTtcbiAgICB9IGVsc2UgaWYgKG5vcm1hbGl6ZWRLZXkgPT09IHJlc29sdmUoXCJBcnJvd1JpZ2h0XCIpKSB7XG4gICAgICBTcGxpZGUyLmdvKFwiPlwiKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBtb3VudCxcbiAgICBkZXN0cm95XG4gIH07XG59XG5cbmNvbnN0IFNSQ19EQVRBX0FUVFJJQlVURSA9IGAke0RBVEFfQVRUUklCVVRFfS1sYXp5YDtcbmNvbnN0IFNSQ1NFVF9EQVRBX0FUVFJJQlVURSA9IGAke1NSQ19EQVRBX0FUVFJJQlVURX0tc3Jjc2V0YDtcbmNvbnN0IElNQUdFX1NFTEVDVE9SID0gYFske1NSQ19EQVRBX0FUVFJJQlVURX1dLCBbJHtTUkNTRVRfREFUQV9BVFRSSUJVVEV9XWA7XG5cbmZ1bmN0aW9uIExhenlMb2FkKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24sIG9mZiwgYmluZCwgZW1pdCB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IGlzU2VxdWVudGlhbCA9IG9wdGlvbnMubGF6eUxvYWQgPT09IFwic2VxdWVudGlhbFwiO1xuICBsZXQgaW1hZ2VzID0gW107XG4gIGxldCBpbmRleCA9IDA7XG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGlmIChvcHRpb25zLmxhenlMb2FkKSB7XG4gICAgICBvbihbRVZFTlRfTU9VTlRFRCwgRVZFTlRfUkVGUkVTSF0sICgpID0+IHtcbiAgICAgICAgZGVzdHJveSgpO1xuICAgICAgICBpbml0KCk7XG4gICAgICB9KTtcbiAgICAgIGlmICghaXNTZXF1ZW50aWFsKSB7XG4gICAgICAgIG9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9SRUZSRVNILCBFVkVOVF9NT1ZFRF0sIG9ic2VydmUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIENvbXBvbmVudHMyLlNsaWRlcy5mb3JFYWNoKChfU2xpZGUpID0+IHtcbiAgICAgIHF1ZXJ5QWxsKF9TbGlkZS5zbGlkZSwgSU1BR0VfU0VMRUNUT1IpLmZvckVhY2goKF9pbWcpID0+IHtcbiAgICAgICAgY29uc3Qgc3JjID0gZ2V0QXR0cmlidXRlKF9pbWcsIFNSQ19EQVRBX0FUVFJJQlVURSk7XG4gICAgICAgIGNvbnN0IHNyY3NldCA9IGdldEF0dHJpYnV0ZShfaW1nLCBTUkNTRVRfREFUQV9BVFRSSUJVVEUpO1xuICAgICAgICBpZiAoc3JjICE9PSBfaW1nLnNyYyB8fCBzcmNzZXQgIT09IF9pbWcuc3Jjc2V0KSB7XG4gICAgICAgICAgY29uc3QgX3NwaW5uZXIgPSBjcmVhdGUoXCJzcGFuXCIsIG9wdGlvbnMuY2xhc3Nlcy5zcGlubmVyLCBfaW1nLnBhcmVudEVsZW1lbnQpO1xuICAgICAgICAgIHNldEF0dHJpYnV0ZShfc3Bpbm5lciwgUk9MRSwgXCJwcmVzZW50YXRpb25cIik7XG4gICAgICAgICAgaW1hZ2VzLnB1c2goeyBfaW1nLCBfU2xpZGUsIHNyYywgc3Jjc2V0LCBfc3Bpbm5lciB9KTtcbiAgICAgICAgICAhX2ltZy5zcmMgJiYgZGlzcGxheShfaW1nLCBcIm5vbmVcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChpc1NlcXVlbnRpYWwpIHtcbiAgICAgIGxvYWROZXh0KCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgaW5kZXggPSAwO1xuICAgIGltYWdlcyA9IFtdO1xuICB9XG4gIGZ1bmN0aW9uIG9ic2VydmUoKSB7XG4gICAgaW1hZ2VzID0gaW1hZ2VzLmZpbHRlcigoZGF0YSkgPT4ge1xuICAgICAgY29uc3QgZGlzdGFuY2UgPSBvcHRpb25zLnBlclBhZ2UgKiAoKG9wdGlvbnMucHJlbG9hZFBhZ2VzIHx8IDEpICsgMSkgLSAxO1xuICAgICAgaWYgKGRhdGEuX1NsaWRlLmlzV2l0aGluKFNwbGlkZTIuaW5kZXgsIGRpc3RhbmNlKSkge1xuICAgICAgICByZXR1cm4gbG9hZChkYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIGlmICghaW1hZ2VzLmxlbmd0aCkge1xuICAgICAgb2ZmKEVWRU5UX01PVkVEKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbG9hZChkYXRhKSB7XG4gICAgY29uc3QgeyBfaW1nIH0gPSBkYXRhO1xuICAgIGFkZENsYXNzKGRhdGEuX1NsaWRlLnNsaWRlLCBDTEFTU19MT0FESU5HKTtcbiAgICBiaW5kKF9pbWcsIFwibG9hZCBlcnJvclwiLCAoZSkgPT4ge1xuICAgICAgb25Mb2FkKGRhdGEsIGUudHlwZSA9PT0gXCJlcnJvclwiKTtcbiAgICB9KTtcbiAgICBbXCJzcmNcIiwgXCJzcmNzZXRcIl0uZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgaWYgKGRhdGFbbmFtZV0pIHtcbiAgICAgICAgc2V0QXR0cmlidXRlKF9pbWcsIG5hbWUsIGRhdGFbbmFtZV0pO1xuICAgICAgICByZW1vdmVBdHRyaWJ1dGUoX2ltZywgbmFtZSA9PT0gXCJzcmNcIiA/IFNSQ19EQVRBX0FUVFJJQlVURSA6IFNSQ1NFVF9EQVRBX0FUVFJJQlVURSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25Mb2FkKGRhdGEsIGVycm9yKSB7XG4gICAgY29uc3QgeyBfU2xpZGUgfSA9IGRhdGE7XG4gICAgcmVtb3ZlQ2xhc3MoX1NsaWRlLnNsaWRlLCBDTEFTU19MT0FESU5HKTtcbiAgICBpZiAoIWVycm9yKSB7XG4gICAgICByZW1vdmUoZGF0YS5fc3Bpbm5lcik7XG4gICAgICBkaXNwbGF5KGRhdGEuX2ltZywgXCJcIik7XG4gICAgICBlbWl0KEVWRU5UX0xBWllMT0FEX0xPQURFRCwgZGF0YS5faW1nLCBfU2xpZGUpO1xuICAgICAgZW1pdChFVkVOVF9SRVNJWkUpO1xuICAgIH1cbiAgICBpZiAoaXNTZXF1ZW50aWFsKSB7XG4gICAgICBsb2FkTmV4dCgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBsb2FkTmV4dCgpIHtcbiAgICBpZiAoaW5kZXggPCBpbWFnZXMubGVuZ3RoKSB7XG4gICAgICBsb2FkKGltYWdlc1tpbmRleCsrXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgbW91bnQsXG4gICAgZGVzdHJveVxuICB9O1xufVxuXG5mdW5jdGlvbiBQYWdpbmF0aW9uKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24sIGVtaXQsIGJpbmQsIHVuYmluZCB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IHsgU2xpZGVzLCBFbGVtZW50cywgQ29udHJvbGxlciB9ID0gQ29tcG9uZW50czI7XG4gIGNvbnN0IHsgaGFzRm9jdXMsIGdldEluZGV4IH0gPSBDb250cm9sbGVyO1xuICBjb25zdCBpdGVtcyA9IFtdO1xuICBsZXQgbGlzdDtcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaW5pdCgpO1xuICAgIG9uKFtFVkVOVF9VUERBVEVELCBFVkVOVF9SRUZSRVNIXSwgaW5pdCk7XG4gICAgb24oW0VWRU5UX01PVkUsIEVWRU5UX1NDUk9MTEVEXSwgdXBkYXRlKTtcbiAgfVxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGRlc3Ryb3koKTtcbiAgICBpZiAob3B0aW9ucy5wYWdpbmF0aW9uICYmIFNsaWRlcy5pc0Vub3VnaCgpKSB7XG4gICAgICBjcmVhdGVQYWdpbmF0aW9uKCk7XG4gICAgICBlbWl0KEVWRU5UX1BBR0lOQVRJT05fTU9VTlRFRCwgeyBsaXN0LCBpdGVtcyB9LCBnZXRBdChTcGxpZGUyLmluZGV4KSk7XG4gICAgICB1cGRhdGUoKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBpZiAobGlzdCkge1xuICAgICAgcmVtb3ZlKGxpc3QpO1xuICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICB1bmJpbmQoaXRlbS5idXR0b24sIFwiY2xpY2tcIik7XG4gICAgICB9KTtcbiAgICAgIGVtcHR5KGl0ZW1zKTtcbiAgICAgIGxpc3QgPSBudWxsO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uKCkge1xuICAgIGNvbnN0IHsgbGVuZ3RoIH0gPSBTcGxpZGUyO1xuICAgIGNvbnN0IHsgY2xhc3NlcywgaTE4biwgcGVyUGFnZSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBwYXJlbnQgPSBvcHRpb25zLnBhZ2luYXRpb24gPT09IFwic2xpZGVyXCIgJiYgRWxlbWVudHMuc2xpZGVyIHx8IEVsZW1lbnRzLnJvb3Q7XG4gICAgY29uc3QgbWF4ID0gaGFzRm9jdXMoKSA/IGxlbmd0aCA6IGNlaWwobGVuZ3RoIC8gcGVyUGFnZSk7XG4gICAgbGlzdCA9IGNyZWF0ZShcInVsXCIsIGNsYXNzZXMucGFnaW5hdGlvbiwgcGFyZW50KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1heDsgaSsrKSB7XG4gICAgICBjb25zdCBsaSA9IGNyZWF0ZShcImxpXCIsIG51bGwsIGxpc3QpO1xuICAgICAgY29uc3QgYnV0dG9uID0gY3JlYXRlKFwiYnV0dG9uXCIsIHsgY2xhc3M6IGNsYXNzZXMucGFnZSwgdHlwZTogXCJidXR0b25cIiB9LCBsaSk7XG4gICAgICBjb25zdCBjb250cm9scyA9IFNsaWRlcy5nZXRJbihpKS5tYXAoKFNsaWRlKSA9PiBTbGlkZS5zbGlkZS5pZCk7XG4gICAgICBjb25zdCB0ZXh0ID0gIWhhc0ZvY3VzKCkgJiYgcGVyUGFnZSA+IDEgPyBpMThuLnBhZ2VYIDogaTE4bi5zbGlkZVg7XG4gICAgICBiaW5kKGJ1dHRvbiwgXCJjbGlja1wiLCBvbkNsaWNrLmJpbmQobnVsbCwgaSkpO1xuICAgICAgc2V0QXR0cmlidXRlKGJ1dHRvbiwgQVJJQV9DT05UUk9MUywgY29udHJvbHMuam9pbihcIiBcIikpO1xuICAgICAgc2V0QXR0cmlidXRlKGJ1dHRvbiwgQVJJQV9MQUJFTCwgZm9ybWF0KHRleHQsIGkgKyAxKSk7XG4gICAgICBpdGVtcy5wdXNoKHsgbGksIGJ1dHRvbiwgcGFnZTogaSB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gb25DbGljayhwYWdlKSB7XG4gICAgQ29udHJvbGxlci5nbyhgPiR7cGFnZX1gLCB0cnVlLCAoKSA9PiB7XG4gICAgICBjb25zdCBTbGlkZSA9IFNsaWRlcy5nZXRBdChDb250cm9sbGVyLnRvSW5kZXgocGFnZSkpO1xuICAgICAgU2xpZGUgJiYgZm9jdXMoU2xpZGUuc2xpZGUpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGdldEF0KGluZGV4KSB7XG4gICAgcmV0dXJuIGl0ZW1zW0NvbnRyb2xsZXIudG9QYWdlKGluZGV4KV07XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIGNvbnN0IHByZXYgPSBnZXRBdChnZXRJbmRleCh0cnVlKSk7XG4gICAgY29uc3QgY3VyciA9IGdldEF0KGdldEluZGV4KCkpO1xuICAgIGlmIChwcmV2KSB7XG4gICAgICByZW1vdmVDbGFzcyhwcmV2LmJ1dHRvbiwgQ0xBU1NfQUNUSVZFKTtcbiAgICAgIHJlbW92ZUF0dHJpYnV0ZShwcmV2LmJ1dHRvbiwgQVJJQV9DVVJSRU5UKTtcbiAgICB9XG4gICAgaWYgKGN1cnIpIHtcbiAgICAgIGFkZENsYXNzKGN1cnIuYnV0dG9uLCBDTEFTU19BQ1RJVkUpO1xuICAgICAgc2V0QXR0cmlidXRlKGN1cnIuYnV0dG9uLCBBUklBX0NVUlJFTlQsIHRydWUpO1xuICAgIH1cbiAgICBlbWl0KEVWRU5UX1BBR0lOQVRJT05fVVBEQVRFRCwgeyBsaXN0LCBpdGVtcyB9LCBwcmV2LCBjdXJyKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGl0ZW1zLFxuICAgIG1vdW50LFxuICAgIGRlc3Ryb3ksXG4gICAgZ2V0QXRcbiAgfTtcbn1cblxuY29uc3QgVFJJR0dFUl9LRVlTID0gW1wiIFwiLCBcIkVudGVyXCIsIFwiU3BhY2ViYXJcIl07XG5mdW5jdGlvbiBTeW5jKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgc3BsaWRlcyB9ID0gU3BsaWRlMjtcbiAgY29uc3QgeyBsaXN0IH0gPSBDb21wb25lbnRzMi5FbGVtZW50cztcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaWYgKG9wdGlvbnMuaXNOYXZpZ2F0aW9uKSB7XG4gICAgICBuYXZpZ2F0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzeW5jKCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlQXR0cmlidXRlKGxpc3QsIEFMTF9BVFRSSUJVVEVTKTtcbiAgfVxuICBmdW5jdGlvbiBzeW5jKCkge1xuICAgIGNvbnN0IHByb2Nlc3NlZCA9IFtdO1xuICAgIHNwbGlkZXMuY29uY2F0KFNwbGlkZTIpLmZvckVhY2goKHNwbGlkZSwgaW5kZXgsIGluc3RhbmNlcykgPT4ge1xuICAgICAgRXZlbnRJbnRlcmZhY2Uoc3BsaWRlKS5vbihFVkVOVF9NT1ZFLCAoaW5kZXgyLCBwcmV2LCBkZXN0KSA9PiB7XG4gICAgICAgIGluc3RhbmNlcy5mb3JFYWNoKChpbnN0YW5jZSkgPT4ge1xuICAgICAgICAgIGlmIChpbnN0YW5jZSAhPT0gc3BsaWRlICYmICFpbmNsdWRlcyhwcm9jZXNzZWQsIHNwbGlkZSkpIHtcbiAgICAgICAgICAgIHByb2Nlc3NlZC5wdXNoKGluc3RhbmNlKTtcbiAgICAgICAgICAgIGluc3RhbmNlLmdvKGluc3RhbmNlLmlzKExPT1ApID8gZGVzdCA6IGluZGV4Mik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZW1wdHkocHJvY2Vzc2VkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG5hdmlnYXRlKCkge1xuICAgIGNvbnN0IHsgb24sIGVtaXQgfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICAgIG9uKEVWRU5UX0NMSUNLLCBvbkNsaWNrKTtcbiAgICBvbihFVkVOVF9TTElERV9LRVlET1dOLCBvbktleWRvd24pO1xuICAgIG9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9VUERBVEVEXSwgdXBkYXRlKTtcbiAgICBzZXRBdHRyaWJ1dGUobGlzdCwgUk9MRSwgXCJtZW51XCIpO1xuICAgIGVtaXQoRVZFTlRfTkFWSUdBVElPTl9NT1VOVEVELCBTcGxpZGUyLnNwbGlkZXMpO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICBzZXRBdHRyaWJ1dGUobGlzdCwgQVJJQV9PUklFTlRBVElPTiwgb3B0aW9ucy5kaXJlY3Rpb24gIT09IFRUQiA/IFwiaG9yaXpvbnRhbFwiIDogbnVsbCk7XG4gIH1cbiAgZnVuY3Rpb24gb25DbGljayhTbGlkZSkge1xuICAgIFNwbGlkZTIuZ28oU2xpZGUuaW5kZXgpO1xuICB9XG4gIGZ1bmN0aW9uIG9uS2V5ZG93bihTbGlkZSwgZSkge1xuICAgIGlmIChpbmNsdWRlcyhUUklHR0VSX0tFWVMsIGUua2V5KSkge1xuICAgICAgb25DbGljayhTbGlkZSk7XG4gICAgICBwcmV2ZW50KGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIG1vdW50LFxuICAgIGRlc3Ryb3lcbiAgfTtcbn1cblxuZnVuY3Rpb24gV2hlZWwoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBiaW5kIH0gPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaWYgKG9wdGlvbnMud2hlZWwpIHtcbiAgICAgIGJpbmQoQ29tcG9uZW50czIuRWxlbWVudHMudHJhY2ssIFwid2hlZWxcIiwgb25XaGVlbCwgeyBwYXNzaXZlOiBmYWxzZSwgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gb25XaGVlbChlKSB7XG4gICAgY29uc3QgeyBkZWx0YVkgfSA9IGU7XG4gICAgaWYgKGRlbHRhWSkge1xuICAgICAgU3BsaWRlMi5nbyhkZWx0YVkgPCAwID8gXCI8XCIgOiBcIj5cIik7XG4gICAgICBwcmV2ZW50KGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIG1vdW50XG4gIH07XG59XG5cbnZhciBDb21wb25lbnRDb25zdHJ1Y3RvcnMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gIF9fcHJvdG9fXzogbnVsbCxcbiAgT3B0aW9uczogT3B0aW9ucyxcbiAgRGlyZWN0aW9uOiBEaXJlY3Rpb24sXG4gIEVsZW1lbnRzOiBFbGVtZW50cyxcbiAgU2xpZGVzOiBTbGlkZXMsXG4gIExheW91dDogTGF5b3V0LFxuICBDbG9uZXM6IENsb25lcyxcbiAgTW92ZTogTW92ZSxcbiAgQ29udHJvbGxlcjogQ29udHJvbGxlcixcbiAgQXJyb3dzOiBBcnJvd3MsXG4gIEF1dG9wbGF5OiBBdXRvcGxheSxcbiAgQ292ZXI6IENvdmVyLFxuICBTY3JvbGw6IFNjcm9sbCxcbiAgRHJhZzogRHJhZyxcbiAgS2V5Ym9hcmQ6IEtleWJvYXJkLFxuICBMYXp5TG9hZDogTGF6eUxvYWQsXG4gIFBhZ2luYXRpb246IFBhZ2luYXRpb24sXG4gIFN5bmM6IFN5bmMsXG4gIFdoZWVsOiBXaGVlbFxufSk7XG5cbmNvbnN0IEkxOE4gPSB7XG4gIHByZXY6IFwiUHJldmlvdXMgc2xpZGVcIixcbiAgbmV4dDogXCJOZXh0IHNsaWRlXCIsXG4gIGZpcnN0OiBcIkdvIHRvIGZpcnN0IHNsaWRlXCIsXG4gIGxhc3Q6IFwiR28gdG8gbGFzdCBzbGlkZVwiLFxuICBzbGlkZVg6IFwiR28gdG8gc2xpZGUgJXNcIixcbiAgcGFnZVg6IFwiR28gdG8gcGFnZSAlc1wiLFxuICBwbGF5OiBcIlN0YXJ0IGF1dG9wbGF5XCIsXG4gIHBhdXNlOiBcIlBhdXNlIGF1dG9wbGF5XCJcbn07XG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICB0eXBlOiBcInNsaWRlXCIsXG4gIHNwZWVkOiA0MDAsXG4gIHdhaXRGb3JUcmFuc2l0aW9uOiB0cnVlLFxuICBwZXJQYWdlOiAxLFxuICBhcnJvd3M6IHRydWUsXG4gIHBhZ2luYXRpb246IHRydWUsXG4gIGludGVydmFsOiA1ZTMsXG4gIHBhdXNlT25Ib3ZlcjogdHJ1ZSxcbiAgcGF1c2VPbkZvY3VzOiB0cnVlLFxuICByZXNldFByb2dyZXNzOiB0cnVlLFxuICBlYXNpbmc6IFwiY3ViaWMtYmV6aWVyKDAuMjUsIDEsIDAuNSwgMSlcIixcbiAgZHJhZzogdHJ1ZSxcbiAgZGlyZWN0aW9uOiBcImx0clwiLFxuICBzbGlkZUZvY3VzOiB0cnVlLFxuICB0cmltU3BhY2U6IHRydWUsXG4gIGZvY3VzYWJsZU5vZGVzOiBcImEsIGJ1dHRvbiwgdGV4dGFyZWEsIGlucHV0LCBzZWxlY3QsIGlmcmFtZVwiLFxuICBjbGFzc2VzOiBDTEFTU0VTLFxuICBpMThuOiBJMThOXG59O1xuXG5mdW5jdGlvbiBGYWRlKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24gfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBvbihbRVZFTlRfTU9VTlRFRCwgRVZFTlRfUkVGUkVTSF0sICgpID0+IHtcbiAgICAgIG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgQ29tcG9uZW50czIuU2xpZGVzLnN0eWxlKFwidHJhbnNpdGlvblwiLCBgb3BhY2l0eSAke29wdGlvbnMuc3BlZWR9bXMgJHtvcHRpb25zLmVhc2luZ31gKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHN0YXJ0KGluZGV4LCBkb25lKSB7XG4gICAgY29uc3QgeyB0cmFjayB9ID0gQ29tcG9uZW50czIuRWxlbWVudHM7XG4gICAgc3R5bGUodHJhY2ssIFwiaGVpZ2h0XCIsIHVuaXQocmVjdCh0cmFjaykuaGVpZ2h0KSk7XG4gICAgbmV4dFRpY2soKCkgPT4ge1xuICAgICAgZG9uZSgpO1xuICAgICAgc3R5bGUodHJhY2ssIFwiaGVpZ2h0XCIsIFwiXCIpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgbW91bnQsXG4gICAgc3RhcnQsXG4gICAgY2FuY2VsOiBub29wXG4gIH07XG59XG5cbmZ1bmN0aW9uIFNsaWRlKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgYmluZCB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IHsgTW92ZSwgQ29udHJvbGxlciB9ID0gQ29tcG9uZW50czI7XG4gIGNvbnN0IHsgbGlzdCB9ID0gQ29tcG9uZW50czIuRWxlbWVudHM7XG4gIGxldCBlbmRDYWxsYmFjaztcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgYmluZChsaXN0LCBcInRyYW5zaXRpb25lbmRcIiwgKGUpID0+IHtcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gbGlzdCAmJiBlbmRDYWxsYmFjaykge1xuICAgICAgICBjYW5jZWwoKTtcbiAgICAgICAgZW5kQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBzdGFydChpbmRleCwgZG9uZSkge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gTW92ZS50b1Bvc2l0aW9uKGluZGV4LCB0cnVlKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IE1vdmUuZ2V0UG9zaXRpb24oKTtcbiAgICBjb25zdCBzcGVlZCA9IGdldFNwZWVkKGluZGV4KTtcbiAgICBpZiAoYWJzKGRlc3RpbmF0aW9uIC0gcG9zaXRpb24pID49IDEgJiYgc3BlZWQgPj0gMSkge1xuICAgICAgYXBwbHkoYHRyYW5zZm9ybSAke3NwZWVkfW1zICR7b3B0aW9ucy5lYXNpbmd9YCk7XG4gICAgICBNb3ZlLnRyYW5zbGF0ZShkZXN0aW5hdGlvbiwgdHJ1ZSk7XG4gICAgICBlbmRDYWxsYmFjayA9IGRvbmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIE1vdmUuanVtcChpbmRleCk7XG4gICAgICBkb25lKCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBhcHBseShcIlwiKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRTcGVlZChpbmRleCkge1xuICAgIGNvbnN0IHsgcmV3aW5kU3BlZWQgfSA9IG9wdGlvbnM7XG4gICAgaWYgKFNwbGlkZTIuaXMoU0xJREUpICYmIHJld2luZFNwZWVkKSB7XG4gICAgICBjb25zdCBwcmV2ID0gQ29udHJvbGxlci5nZXRJbmRleCh0cnVlKTtcbiAgICAgIGNvbnN0IGVuZCA9IENvbnRyb2xsZXIuZ2V0RW5kKCk7XG4gICAgICBpZiAocHJldiA9PT0gMCAmJiBpbmRleCA+PSBlbmQgfHwgcHJldiA+PSBlbmQgJiYgaW5kZXggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHJld2luZFNwZWVkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3B0aW9ucy5zcGVlZDtcbiAgfVxuICBmdW5jdGlvbiBhcHBseSh0cmFuc2l0aW9uKSB7XG4gICAgc3R5bGUobGlzdCwgXCJ0cmFuc2l0aW9uXCIsIHRyYW5zaXRpb24pO1xuICB9XG4gIHJldHVybiB7XG4gICAgbW91bnQsXG4gICAgc3RhcnQsXG4gICAgY2FuY2VsXG4gIH07XG59XG5cbmNvbnN0IF9TcGxpZGUgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKHRhcmdldCwgb3B0aW9ucykge1xuICAgIHRoaXMuZXZlbnQgPSBFdmVudEJ1cygpO1xuICAgIHRoaXMuQ29tcG9uZW50cyA9IHt9O1xuICAgIHRoaXMuc3RhdGUgPSBTdGF0ZShDUkVBVEVEKTtcbiAgICB0aGlzLnNwbGlkZXMgPSBbXTtcbiAgICB0aGlzLl9vcHRpb25zID0ge307XG4gICAgdGhpcy5fRXh0ZW5zaW9ucyA9IHt9O1xuICAgIGNvbnN0IHJvb3QgPSBpc1N0cmluZyh0YXJnZXQpID8gcXVlcnkoZG9jdW1lbnQsIHRhcmdldCkgOiB0YXJnZXQ7XG4gICAgYXNzZXJ0KHJvb3QsIGAke3Jvb3R9IGlzIGludmFsaWQuYCk7XG4gICAgdGhpcy5yb290ID0gcm9vdDtcbiAgICBtZXJnZShERUZBVUxUUywgX1NwbGlkZS5kZWZhdWx0cyk7XG4gICAgbWVyZ2UobWVyZ2UodGhpcy5fb3B0aW9ucywgREVGQVVMVFMpLCBvcHRpb25zIHx8IHt9KTtcbiAgfVxuICBtb3VudChFeHRlbnNpb25zLCBUcmFuc2l0aW9uKSB7XG4gICAgY29uc3QgeyBzdGF0ZSwgQ29tcG9uZW50czogQ29tcG9uZW50czIgfSA9IHRoaXM7XG4gICAgYXNzZXJ0KHN0YXRlLmlzKFtDUkVBVEVELCBERVNUUk9ZRURdKSwgXCJBbHJlYWR5IG1vdW50ZWQhXCIpO1xuICAgIHN0YXRlLnNldChDUkVBVEVEKTtcbiAgICB0aGlzLl9Db21wb25lbnRzID0gQ29tcG9uZW50czI7XG4gICAgdGhpcy5fVHJhbnNpdGlvbiA9IFRyYW5zaXRpb24gfHwgdGhpcy5fVHJhbnNpdGlvbiB8fCAodGhpcy5pcyhGQURFKSA/IEZhZGUgOiBTbGlkZSk7XG4gICAgdGhpcy5fRXh0ZW5zaW9ucyA9IEV4dGVuc2lvbnMgfHwgdGhpcy5fRXh0ZW5zaW9ucztcbiAgICBjb25zdCBDb25zdHJ1Y3RvcnMgPSBhc3NpZ24oe30sIENvbXBvbmVudENvbnN0cnVjdG9ycywgdGhpcy5fRXh0ZW5zaW9ucywgeyBUcmFuc2l0aW9uOiB0aGlzLl9UcmFuc2l0aW9uIH0pO1xuICAgIGZvck93bihDb25zdHJ1Y3RvcnMsIChDb21wb25lbnQsIGtleSkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gQ29tcG9uZW50KHRoaXMsIENvbXBvbmVudHMyLCB0aGlzLl9vcHRpb25zKTtcbiAgICAgIENvbXBvbmVudHMyW2tleV0gPSBjb21wb25lbnQ7XG4gICAgICBjb21wb25lbnQuc2V0dXAgJiYgY29tcG9uZW50LnNldHVwKCk7XG4gICAgfSk7XG4gICAgZm9yT3duKENvbXBvbmVudHMyLCAoY29tcG9uZW50KSA9PiB7XG4gICAgICBjb21wb25lbnQubW91bnQgJiYgY29tcG9uZW50Lm1vdW50KCk7XG4gICAgfSk7XG4gICAgdGhpcy5lbWl0KEVWRU5UX01PVU5URUQpO1xuICAgIGFkZENsYXNzKHRoaXMucm9vdCwgQ0xBU1NfSU5JVElBTElaRUQpO1xuICAgIHN0YXRlLnNldChJRExFKTtcbiAgICB0aGlzLmVtaXQoRVZFTlRfUkVBRFkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHN5bmMoc3BsaWRlKSB7XG4gICAgdGhpcy5zcGxpZGVzLnB1c2goc3BsaWRlKTtcbiAgICBzcGxpZGUuc3BsaWRlcy5wdXNoKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGdvKGNvbnRyb2wpIHtcbiAgICB0aGlzLl9Db21wb25lbnRzLkNvbnRyb2xsZXIuZ28oY29udHJvbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgb24oZXZlbnRzLCBjYWxsYmFjaykge1xuICAgIHRoaXMuZXZlbnQub24oZXZlbnRzLCBjYWxsYmFjaywgbnVsbCwgREVGQVVMVF9VU0VSX0VWRU5UX1BSSU9SSVRZKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBvZmYoZXZlbnRzKSB7XG4gICAgdGhpcy5ldmVudC5vZmYoZXZlbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBlbWl0KGV2ZW50KSB7XG4gICAgdGhpcy5ldmVudC5lbWl0KGV2ZW50LCAuLi5zbGljZShhcmd1bWVudHMsIDEpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBhZGQoc2xpZGVzLCBpbmRleCkge1xuICAgIHRoaXMuX0NvbXBvbmVudHMuU2xpZGVzLmFkZChzbGlkZXMsIGluZGV4KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICByZW1vdmUobWF0Y2hlcikge1xuICAgIHRoaXMuX0NvbXBvbmVudHMuU2xpZGVzLnJlbW92ZShtYXRjaGVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBpcyh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnMudHlwZSA9PT0gdHlwZTtcbiAgfVxuICByZWZyZXNoKCkge1xuICAgIHRoaXMuZW1pdChFVkVOVF9SRUZSRVNIKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBkZXN0cm95KGNvbXBsZXRlbHkgPSB0cnVlKSB7XG4gICAgY29uc3QgeyBldmVudCwgc3RhdGUgfSA9IHRoaXM7XG4gICAgaWYgKHN0YXRlLmlzKENSRUFURUQpKSB7XG4gICAgICBldmVudC5vbihFVkVOVF9SRUFEWSwgdGhpcy5kZXN0cm95LmJpbmQodGhpcywgY29tcGxldGVseSksIHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JPd24odGhpcy5fQ29tcG9uZW50cywgKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICBjb21wb25lbnQuZGVzdHJveSAmJiBjb21wb25lbnQuZGVzdHJveShjb21wbGV0ZWx5KTtcbiAgICAgIH0sIHRydWUpO1xuICAgICAgZXZlbnQuZW1pdChFVkVOVF9ERVNUUk9ZKTtcbiAgICAgIGV2ZW50LmRlc3Ryb3koKTtcbiAgICAgIGNvbXBsZXRlbHkgJiYgZW1wdHkodGhpcy5zcGxpZGVzKTtcbiAgICAgIHN0YXRlLnNldChERVNUUk9ZRUQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7XG4gICAgY29uc3QgeyBfb3B0aW9ucyB9ID0gdGhpcztcbiAgICBtZXJnZShfb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmlzKENSRUFURUQpKSB7XG4gICAgICB0aGlzLmVtaXQoRVZFTlRfVVBEQVRFRCwgX29wdGlvbnMpO1xuICAgIH1cbiAgfVxuICBnZXQgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLl9Db21wb25lbnRzLlNsaWRlcy5nZXRMZW5ndGgodHJ1ZSk7XG4gIH1cbiAgZ2V0IGluZGV4KCkge1xuICAgIHJldHVybiB0aGlzLl9Db21wb25lbnRzLkNvbnRyb2xsZXIuZ2V0SW5kZXgoKTtcbiAgfVxufTtcbmxldCBTcGxpZGUgPSBfU3BsaWRlO1xuU3BsaWRlLmRlZmF1bHRzID0ge307XG5TcGxpZGUuU1RBVEVTID0gU1RBVEVTO1xuXG5jb25zdCBDTEFTU19SRU5ERVJFRCA9IFwiaXMtcmVuZGVyZWRcIjtcblxuY29uc3QgUkVOREVSRVJfREVGQVVMVF9DT05GSUcgPSB7XG4gIGxpc3RUYWc6IFwidWxcIixcbiAgc2xpZGVUYWc6IFwibGlcIlxufTtcblxuY2xhc3MgU3R5bGUge1xuICBjb25zdHJ1Y3RvcihpZCwgb3B0aW9ucykge1xuICAgIHRoaXMuc3R5bGVzID0ge307XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgcnVsZShzZWxlY3RvciwgcHJvcCwgdmFsdWUsIGJyZWFrcG9pbnQpIHtcbiAgICBicmVha3BvaW50ID0gYnJlYWtwb2ludCB8fCBcImRlZmF1bHRcIjtcbiAgICBjb25zdCBzZWxlY3RvcnMgPSB0aGlzLnN0eWxlc1ticmVha3BvaW50XSA9IHRoaXMuc3R5bGVzW2JyZWFrcG9pbnRdIHx8IHt9O1xuICAgIGNvbnN0IHN0eWxlcyA9IHNlbGVjdG9yc1tzZWxlY3Rvcl0gPSBzZWxlY3RvcnNbc2VsZWN0b3JdIHx8IHt9O1xuICAgIHN0eWxlc1twcm9wXSA9IHZhbHVlO1xuICB9XG4gIGJ1aWxkKCkge1xuICAgIGxldCBjc3MgPSBcIlwiO1xuICAgIGlmICh0aGlzLnN0eWxlcy5kZWZhdWx0KSB7XG4gICAgICBjc3MgKz0gdGhpcy5idWlsZFNlbGVjdG9ycyh0aGlzLnN0eWxlcy5kZWZhdWx0KTtcbiAgICB9XG4gICAgT2JqZWN0LmtleXModGhpcy5zdHlsZXMpLnNvcnQoKG4sIG0pID0+IHRoaXMub3B0aW9ucy5tZWRpYVF1ZXJ5ID09PSBcIm1pblwiID8gK24gLSArbSA6ICttIC0gK24pLmZvckVhY2goKGJyZWFrcG9pbnQpID0+IHtcbiAgICAgIGlmIChicmVha3BvaW50ICE9PSBcImRlZmF1bHRcIikge1xuICAgICAgICBjc3MgKz0gYEBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6ICR7YnJlYWtwb2ludH1weCkge2A7XG4gICAgICAgIGNzcyArPSB0aGlzLmJ1aWxkU2VsZWN0b3JzKHRoaXMuc3R5bGVzW2JyZWFrcG9pbnRdKTtcbiAgICAgICAgY3NzICs9IGB9YDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY3NzO1xuICB9XG4gIGJ1aWxkU2VsZWN0b3JzKHNlbGVjdG9ycykge1xuICAgIGxldCBjc3MgPSBcIlwiO1xuICAgIGZvck93bihzZWxlY3RvcnMsIChzdHlsZXMsIHNlbGVjdG9yKSA9PiB7XG4gICAgICBjc3MgKz0gYCMke3RoaXMuaWR9ICR7c2VsZWN0b3J9IHtgO1xuICAgICAgZm9yT3duKHN0eWxlcywgKHZhbHVlLCBwcm9wKSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMCkge1xuICAgICAgICAgIGNzcyArPSBgJHtwcm9wfTogJHt2YWx1ZX07YDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjc3MgKz0gXCJ9XCI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNzcztcbiAgfVxufVxuXG5jbGFzcyBTcGxpZGVSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRlbnRzLCBvcHRpb25zLCBjb25maWcsIGRlZmF1bHRzKSB7XG4gICAgdGhpcy5zbGlkZXMgPSBbXTtcbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLmJyZWFrcG9pbnRzID0gW107XG4gICAgbWVyZ2UoREVGQVVMVFMsIGRlZmF1bHRzIHx8IHt9KTtcbiAgICBtZXJnZShtZXJnZSh0aGlzLm9wdGlvbnMsIERFRkFVTFRTKSwgb3B0aW9ucyB8fCB7fSk7XG4gICAgdGhpcy5jb250ZW50cyA9IGNvbnRlbnRzO1xuICAgIHRoaXMuY29uZmlnID0gYXNzaWduKHt9LCBSRU5ERVJFUl9ERUZBVUxUX0NPTkZJRywgY29uZmlnIHx8IHt9KTtcbiAgICB0aGlzLmlkID0gdGhpcy5jb25maWcuaWQgfHwgdW5pcXVlSWQoXCJzcGxpZGVcIik7XG4gICAgdGhpcy5TdHlsZSA9IG5ldyBTdHlsZSh0aGlzLmlkLCB0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMuRGlyZWN0aW9uID0gRGlyZWN0aW9uKG51bGwsIG51bGwsIHRoaXMub3B0aW9ucyk7XG4gICAgYXNzZXJ0KHRoaXMuY29udGVudHMubGVuZ3RoLCBcIlByb3ZpZGUgYXQgbGVhc3QgMSBjb250ZW50LlwiKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuICBzdGF0aWMgY2xlYW4oc3BsaWRlKSB7XG4gICAgY29uc3QgeyBvbiB9ID0gRXZlbnRJbnRlcmZhY2Uoc3BsaWRlKTtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHNwbGlkZTtcbiAgICBjb25zdCBjbG9uZXMgPSBxdWVyeUFsbChyb290LCBgLiR7Q0xBU1NfQ0xPTkV9YCk7XG4gICAgb24oRVZFTlRfTU9VTlRFRCwgKCkgPT4ge1xuICAgICAgcmVtb3ZlKGNoaWxkKHJvb3QsIFwic3R5bGVcIikpO1xuICAgIH0pO1xuICAgIHJlbW92ZShjbG9uZXMpO1xuICB9XG4gIGluaXQoKSB7XG4gICAgdGhpcy5wYXJzZUJyZWFrcG9pbnRzKCk7XG4gICAgdGhpcy5pbml0U2xpZGVzKCk7XG4gICAgdGhpcy5yZWdpc3RlclJvb3RTdHlsZXMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyVHJhY2tTdHlsZXMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyU2xpZGVTdHlsZXMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdFN0eWxlcygpO1xuICB9XG4gIGluaXRTbGlkZXMoKSB7XG4gICAgcHVzaCh0aGlzLnNsaWRlcywgdGhpcy5jb250ZW50cy5tYXAoKGNvbnRlbnQsIGluZGV4KSA9PiB7XG4gICAgICBjb250ZW50ID0gaXNTdHJpbmcoY29udGVudCkgPyB7IGh0bWw6IGNvbnRlbnQgfSA6IGNvbnRlbnQ7XG4gICAgICBjb250ZW50LnN0eWxlcyA9IGNvbnRlbnQuc3R5bGVzIHx8IHt9O1xuICAgICAgY29udGVudC5hdHRycyA9IGNvbnRlbnQuYXR0cnMgfHwge307XG4gICAgICB0aGlzLmNvdmVyKGNvbnRlbnQpO1xuICAgICAgY29uc3QgY2xhc3NlcyA9IGAke3RoaXMub3B0aW9ucy5jbGFzc2VzLnNsaWRlfSAke2luZGV4ID09PSAwID8gQ0xBU1NfQUNUSVZFIDogXCJcIn1gO1xuICAgICAgYXNzaWduKGNvbnRlbnQuYXR0cnMsIHtcbiAgICAgICAgY2xhc3M6IGAke2NsYXNzZXN9ICR7Y29udGVudC5hdHRycy5jbGFzcyB8fCBcIlwifWAudHJpbSgpLFxuICAgICAgICBzdHlsZTogdGhpcy5idWlsZFN0eWxlcyhjb250ZW50LnN0eWxlcylcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkpO1xuICAgIGlmICh0aGlzLmlzTG9vcCgpKSB7XG4gICAgICB0aGlzLmdlbmVyYXRlQ2xvbmVzKHRoaXMuc2xpZGVzKTtcbiAgICB9XG4gIH1cbiAgcmVnaXN0ZXJSb290U3R5bGVzKCkge1xuICAgIHRoaXMuYnJlYWtwb2ludHMuZm9yRWFjaCgoW3dpZHRoLCBvcHRpb25zXSkgPT4ge1xuICAgICAgdGhpcy5TdHlsZS5ydWxlKFwiIFwiLCBcIm1heC13aWR0aFwiLCB1bml0KG9wdGlvbnMud2lkdGgpLCB3aWR0aCk7XG4gICAgfSk7XG4gIH1cbiAgcmVnaXN0ZXJUcmFja1N0eWxlcygpIHtcbiAgICBjb25zdCB7IFN0eWxlOiBTdHlsZTIgfSA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBgLiR7Q0xBU1NfVFJBQ0t9YDtcbiAgICB0aGlzLmJyZWFrcG9pbnRzLmZvckVhY2goKFt3aWR0aCwgb3B0aW9uc10pID0+IHtcbiAgICAgIFN0eWxlMi5ydWxlKHNlbGVjdG9yLCB0aGlzLnJlc29sdmUoXCJwYWRkaW5nTGVmdFwiKSwgdGhpcy5jc3NQYWRkaW5nKG9wdGlvbnMsIGZhbHNlKSwgd2lkdGgpO1xuICAgICAgU3R5bGUyLnJ1bGUoc2VsZWN0b3IsIHRoaXMucmVzb2x2ZShcInBhZGRpbmdSaWdodFwiKSwgdGhpcy5jc3NQYWRkaW5nKG9wdGlvbnMsIHRydWUpLCB3aWR0aCk7XG4gICAgICBTdHlsZTIucnVsZShzZWxlY3RvciwgXCJoZWlnaHRcIiwgdGhpcy5jc3NUcmFja0hlaWdodChvcHRpb25zKSwgd2lkdGgpO1xuICAgIH0pO1xuICB9XG4gIHJlZ2lzdGVyTGlzdFN0eWxlcygpIHtcbiAgICBjb25zdCB7IFN0eWxlOiBTdHlsZTIgfSA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBgLiR7Q0xBU1NfTElTVH1gO1xuICAgIHRoaXMuYnJlYWtwb2ludHMuZm9yRWFjaCgoW3dpZHRoLCBvcHRpb25zXSkgPT4ge1xuICAgICAgU3R5bGUyLnJ1bGUoc2VsZWN0b3IsIFwidHJhbnNmb3JtXCIsIHRoaXMuYnVpbGRUcmFuc2xhdGUob3B0aW9ucyksIHdpZHRoKTtcbiAgICB9KTtcbiAgfVxuICByZWdpc3RlclNsaWRlU3R5bGVzKCkge1xuICAgIGNvbnN0IHsgU3R5bGU6IFN0eWxlMiB9ID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RvciA9IGAuJHtDTEFTU19TTElERX1gO1xuICAgIHRoaXMuYnJlYWtwb2ludHMuZm9yRWFjaCgoW3dpZHRoLCBvcHRpb25zXSkgPT4ge1xuICAgICAgU3R5bGUyLnJ1bGUoc2VsZWN0b3IsIFwid2lkdGhcIiwgdGhpcy5jc3NTbGlkZVdpZHRoKG9wdGlvbnMpLCB3aWR0aCk7XG4gICAgICBTdHlsZTIucnVsZShzZWxlY3RvciwgdGhpcy5yZXNvbHZlKFwibWFyZ2luUmlnaHRcIiksIHVuaXQob3B0aW9ucy5nYXApIHx8IFwiMHB4XCIsIHdpZHRoKTtcbiAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY3NzU2xpZGVIZWlnaHQob3B0aW9ucyk7XG4gICAgICBpZiAoaGVpZ2h0KSB7XG4gICAgICAgIFN0eWxlMi5ydWxlKHNlbGVjdG9yLCBcImhlaWdodFwiLCBoZWlnaHQsIHdpZHRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFN0eWxlMi5ydWxlKHNlbGVjdG9yLCBcInBhZGRpbmctdG9wXCIsIHRoaXMuY3NzU2xpZGVQYWRkaW5nKG9wdGlvbnMpLCB3aWR0aCk7XG4gICAgICB9XG4gICAgICBTdHlsZTIucnVsZShgJHtzZWxlY3Rvcn0gPiBpbWdgLCBcImRpc3BsYXlcIiwgb3B0aW9ucy5jb3ZlciA/IFwibm9uZVwiIDogXCJpbmxpbmVcIiwgd2lkdGgpO1xuICAgIH0pO1xuICB9XG4gIGJ1aWxkVHJhbnNsYXRlKG9wdGlvbnMpIHtcbiAgICBjb25zdCB7IHJlc29sdmUsIG9yaWVudCB9ID0gdGhpcy5EaXJlY3Rpb247XG4gICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgdmFsdWVzLnB1c2godGhpcy5jc3NPZmZzZXRDbG9uZXMob3B0aW9ucykpO1xuICAgIHZhbHVlcy5wdXNoKHRoaXMuY3NzT2Zmc2V0R2FwcyhvcHRpb25zKSk7XG4gICAgaWYgKHRoaXMuaXNDZW50ZXIob3B0aW9ucykpIHtcbiAgICAgIHZhbHVlcy5wdXNoKHRoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQoLTUwKSwgXCIlXCIpKTtcbiAgICAgIHZhbHVlcy5wdXNoKC4uLnRoaXMuY3NzT2Zmc2V0Q2VudGVyKG9wdGlvbnMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcy5maWx0ZXIoQm9vbGVhbikubWFwKCh2YWx1ZSkgPT4gYHRyYW5zbGF0ZSR7cmVzb2x2ZShcIlhcIil9KCR7dmFsdWV9KWApLmpvaW4oXCIgXCIpO1xuICB9XG4gIGNzc09mZnNldENsb25lcyhvcHRpb25zKSB7XG4gICAgY29uc3QgeyByZXNvbHZlLCBvcmllbnQgfSA9IHRoaXMuRGlyZWN0aW9uO1xuICAgIGNvbnN0IGNsb25lQ291bnQgPSB0aGlzLmdldENsb25lQ291bnQoKTtcbiAgICBpZiAodGhpcy5pc0ZpeGVkV2lkdGgob3B0aW9ucykpIHtcbiAgICAgIGNvbnN0IHsgdmFsdWUsIHVuaXQ6IHVuaXQyIH0gPSB0aGlzLnBhcnNlQ3NzVmFsdWUob3B0aW9uc1tyZXNvbHZlKFwiZml4ZWRXaWR0aFwiKV0pO1xuICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQodmFsdWUpICogY2xvbmVDb3VudCwgdW5pdDIpO1xuICAgIH1cbiAgICBjb25zdCBwZXJjZW50ID0gMTAwICogY2xvbmVDb3VudCAvIG9wdGlvbnMucGVyUGFnZTtcbiAgICByZXR1cm4gYCR7b3JpZW50KHBlcmNlbnQpfSVgO1xuICB9XG4gIGNzc09mZnNldENlbnRlcihvcHRpb25zKSB7XG4gICAgY29uc3QgeyByZXNvbHZlLCBvcmllbnQgfSA9IHRoaXMuRGlyZWN0aW9uO1xuICAgIGlmICh0aGlzLmlzRml4ZWRXaWR0aChvcHRpb25zKSkge1xuICAgICAgY29uc3QgeyB2YWx1ZSwgdW5pdDogdW5pdDIgfSA9IHRoaXMucGFyc2VDc3NWYWx1ZShvcHRpb25zW3Jlc29sdmUoXCJmaXhlZFdpZHRoXCIpXSk7XG4gICAgICByZXR1cm4gW3RoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQodmFsdWUgLyAyKSwgdW5pdDIpXTtcbiAgICB9XG4gICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgY29uc3QgeyBwZXJQYWdlLCBnYXAgfSA9IG9wdGlvbnM7XG4gICAgdmFsdWVzLnB1c2goYCR7b3JpZW50KDUwIC8gcGVyUGFnZSl9JWApO1xuICAgIGlmIChnYXApIHtcbiAgICAgIGNvbnN0IHsgdmFsdWUsIHVuaXQ6IHVuaXQyIH0gPSB0aGlzLnBhcnNlQ3NzVmFsdWUoZ2FwKTtcbiAgICAgIGNvbnN0IGdhcE9mZnNldCA9ICh2YWx1ZSAvIHBlclBhZ2UgLSB2YWx1ZSkgLyAyO1xuICAgICAgdmFsdWVzLnB1c2godGhpcy5idWlsZENzc1ZhbHVlKG9yaWVudChnYXBPZmZzZXQpLCB1bml0MikpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG4gIGNzc09mZnNldEdhcHMob3B0aW9ucykge1xuICAgIGNvbnN0IGNsb25lQ291bnQgPSB0aGlzLmdldENsb25lQ291bnQoKTtcbiAgICBpZiAoY2xvbmVDb3VudCAmJiBvcHRpb25zLmdhcCkge1xuICAgICAgY29uc3QgeyBvcmllbnQgfSA9IHRoaXMuRGlyZWN0aW9uO1xuICAgICAgY29uc3QgeyB2YWx1ZSwgdW5pdDogdW5pdDIgfSA9IHRoaXMucGFyc2VDc3NWYWx1ZShvcHRpb25zLmdhcCk7XG4gICAgICBpZiAodGhpcy5pc0ZpeGVkV2lkdGgob3B0aW9ucykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQodmFsdWUgKiBjbG9uZUNvdW50KSwgdW5pdDIpO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBwZXJQYWdlIH0gPSBvcHRpb25zO1xuICAgICAgY29uc3QgZ2FwcyA9IGNsb25lQ291bnQgLyBwZXJQYWdlO1xuICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQoZ2FwcyAqIHZhbHVlKSwgdW5pdDIpO1xuICAgIH1cbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICByZXNvbHZlKHByb3ApIHtcbiAgICByZXR1cm4gY2FtZWxUb0tlYmFiKHRoaXMuRGlyZWN0aW9uLnJlc29sdmUocHJvcCkpO1xuICB9XG4gIGNzc1BhZGRpbmcob3B0aW9ucywgcmlnaHQpIHtcbiAgICBjb25zdCB7IHBhZGRpbmcgfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgcHJvcCA9IHRoaXMuRGlyZWN0aW9uLnJlc29sdmUocmlnaHQgPyBcInJpZ2h0XCIgOiBcImxlZnRcIiwgdHJ1ZSk7XG4gICAgcmV0dXJuIHBhZGRpbmcgJiYgdW5pdChwYWRkaW5nW3Byb3BdIHx8IChpc09iamVjdChwYWRkaW5nKSA/IDAgOiBwYWRkaW5nKSkgfHwgXCIwcHhcIjtcbiAgfVxuICBjc3NUcmFja0hlaWdodChvcHRpb25zKSB7XG4gICAgbGV0IGhlaWdodCA9IFwiXCI7XG4gICAgaWYgKHRoaXMuaXNWZXJ0aWNhbCgpKSB7XG4gICAgICBoZWlnaHQgPSB0aGlzLmNzc0hlaWdodChvcHRpb25zKTtcbiAgICAgIGFzc2VydChoZWlnaHQsICdcImhlaWdodFwiIGlzIG1pc3NpbmcuJyk7XG4gICAgICBoZWlnaHQgPSBgY2FsYygke2hlaWdodH0gLSAke3RoaXMuY3NzUGFkZGluZyhvcHRpb25zLCBmYWxzZSl9IC0gJHt0aGlzLmNzc1BhZGRpbmcob3B0aW9ucywgdHJ1ZSl9KWA7XG4gICAgfVxuICAgIHJldHVybiBoZWlnaHQ7XG4gIH1cbiAgY3NzSGVpZ2h0KG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdW5pdChvcHRpb25zLmhlaWdodCk7XG4gIH1cbiAgY3NzU2xpZGVXaWR0aChvcHRpb25zKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuYXV0b1dpZHRoID8gXCJcIiA6IHVuaXQob3B0aW9ucy5maXhlZFdpZHRoKSB8fCAodGhpcy5pc1ZlcnRpY2FsKCkgPyBcIlwiIDogdGhpcy5jc3NTbGlkZVNpemUob3B0aW9ucykpO1xuICB9XG4gIGNzc1NsaWRlSGVpZ2h0KG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdW5pdChvcHRpb25zLmZpeGVkSGVpZ2h0KSB8fCAodGhpcy5pc1ZlcnRpY2FsKCkgPyBvcHRpb25zLmF1dG9IZWlnaHQgPyBcIlwiIDogdGhpcy5jc3NTbGlkZVNpemUob3B0aW9ucykgOiB0aGlzLmNzc0hlaWdodChvcHRpb25zKSk7XG4gIH1cbiAgY3NzU2xpZGVTaXplKG9wdGlvbnMpIHtcbiAgICBjb25zdCBnYXAgPSB1bml0KG9wdGlvbnMuZ2FwKTtcbiAgICByZXR1cm4gYGNhbGMoKDEwMCUke2dhcCAmJiBgICsgJHtnYXB9YH0pLyR7b3B0aW9ucy5wZXJQYWdlIHx8IDF9JHtnYXAgJiYgYCAtICR7Z2FwfWB9KWA7XG4gIH1cbiAgY3NzU2xpZGVQYWRkaW5nKG9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGhlaWdodFJhdGlvIH0gPSBvcHRpb25zO1xuICAgIHJldHVybiBoZWlnaHRSYXRpbyA/IGAke2hlaWdodFJhdGlvICogMTAwfSVgIDogXCJcIjtcbiAgfVxuICBidWlsZENzc1ZhbHVlKHZhbHVlLCB1bml0Mikge1xuICAgIHJldHVybiBgJHt2YWx1ZX0ke3VuaXQyfWA7XG4gIH1cbiAgcGFyc2VDc3NWYWx1ZSh2YWx1ZSkge1xuICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgIGNvbnN0IG51bWJlciA9IHBhcnNlRmxvYXQodmFsdWUpIHx8IDA7XG4gICAgICBjb25zdCB1bml0MiA9IHZhbHVlLnJlcGxhY2UoL1xcZCooXFwuXFxkKik/LywgXCJcIikgfHwgXCJweFwiO1xuICAgICAgcmV0dXJuIHsgdmFsdWU6IG51bWJlciwgdW5pdDogdW5pdDIgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdmFsdWUsIHVuaXQ6IFwicHhcIiB9O1xuICB9XG4gIHBhcnNlQnJlYWtwb2ludHMoKSB7XG4gICAgY29uc3QgeyBicmVha3BvaW50cyB9ID0gdGhpcy5vcHRpb25zO1xuICAgIHRoaXMuYnJlYWtwb2ludHMucHVzaChbXCJkZWZhdWx0XCIsIHRoaXMub3B0aW9uc10pO1xuICAgIGlmIChicmVha3BvaW50cykge1xuICAgICAgZm9yT3duKGJyZWFrcG9pbnRzLCAob3B0aW9ucywgd2lkdGgpID0+IHtcbiAgICAgICAgdGhpcy5icmVha3BvaW50cy5wdXNoKFt3aWR0aCwgbWVyZ2UobWVyZ2Uoe30sIHRoaXMub3B0aW9ucyksIG9wdGlvbnMpXSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaXNGaXhlZFdpZHRoKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gISFvcHRpb25zW3RoaXMuRGlyZWN0aW9uLnJlc29sdmUoXCJmaXhlZFdpZHRoXCIpXTtcbiAgfVxuICBpc0xvb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy50eXBlID09PSBMT09QO1xuICB9XG4gIGlzQ2VudGVyKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5mb2N1cyA9PT0gXCJjZW50ZXJcIikge1xuICAgICAgaWYgKHRoaXMuaXNMb29wKCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnR5cGUgPT09IFNMSURFKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5vcHRpb25zLnRyaW1TcGFjZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlzVmVydGljYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gPT09IFRUQjtcbiAgfVxuICBidWlsZENsYXNzZXMoKSB7XG4gICAgY29uc3QgeyBvcHRpb25zIH0gPSB0aGlzO1xuICAgIHJldHVybiBbXG4gICAgICBDTEFTU19ST09ULFxuICAgICAgYCR7Q0xBU1NfUk9PVH0tLSR7b3B0aW9ucy50eXBlfWAsXG4gICAgICBgJHtDTEFTU19ST09UfS0tJHtvcHRpb25zLmRpcmVjdGlvbn1gLFxuICAgICAgb3B0aW9ucy5kcmFnICYmIGAke0NMQVNTX1JPT1R9LS1kcmFnZ2FibGVgLFxuICAgICAgb3B0aW9ucy5pc05hdmlnYXRpb24gJiYgYCR7Q0xBU1NfUk9PVH0tLW5hdmAsXG4gICAgICBDTEFTU19BQ1RJVkUsXG4gICAgICAhdGhpcy5jb25maWcuaGlkZGVuICYmIENMQVNTX1JFTkRFUkVEXG4gICAgXS5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIik7XG4gIH1cbiAgYnVpbGRBdHRycyhhdHRycykge1xuICAgIGxldCBhdHRyID0gXCJcIjtcbiAgICBmb3JPd24oYXR0cnMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBhdHRyICs9IHZhbHVlID8gYCAke2NhbWVsVG9LZWJhYihrZXkpfT1cIiR7dmFsdWV9XCJgIDogXCJcIjtcbiAgICB9KTtcbiAgICByZXR1cm4gYXR0ci50cmltKCk7XG4gIH1cbiAgYnVpbGRTdHlsZXMoc3R5bGVzKSB7XG4gICAgbGV0IHN0eWxlID0gXCJcIjtcbiAgICBmb3JPd24oc3R5bGVzLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgc3R5bGUgKz0gYCAke2NhbWVsVG9LZWJhYihrZXkpfToke3ZhbHVlfTtgO1xuICAgIH0pO1xuICAgIHJldHVybiBzdHlsZS50cmltKCk7XG4gIH1cbiAgcmVuZGVyU2xpZGVzKCkge1xuICAgIGNvbnN0IHsgc2xpZGVUYWc6IHRhZyB9ID0gdGhpcy5jb25maWc7XG4gICAgcmV0dXJuIHRoaXMuc2xpZGVzLm1hcCgoY29udGVudCkgPT4ge1xuICAgICAgcmV0dXJuIGA8JHt0YWd9ICR7dGhpcy5idWlsZEF0dHJzKGNvbnRlbnQuYXR0cnMpfT4ke2NvbnRlbnQuaHRtbCB8fCBcIlwifTwvJHt0YWd9PmA7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfVxuICBjb3Zlcihjb250ZW50KSB7XG4gICAgY29uc3QgeyBzdHlsZXMsIGh0bWwgPSBcIlwiIH0gPSBjb250ZW50O1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY292ZXIgJiYgIXRoaXMub3B0aW9ucy5sYXp5TG9hZCkge1xuICAgICAgY29uc3Qgc3JjID0gaHRtbC5tYXRjaCgvPGltZy4qP3NyY1xccyo9XFxzKihbJ1wiXSkoLis/KVxcMS4qPz4vKTtcbiAgICAgIGlmIChzcmMgJiYgc3JjWzJdKSB7XG4gICAgICAgIHN0eWxlcy5iYWNrZ3JvdW5kID0gYGNlbnRlci9jb3ZlciBuby1yZXBlYXQgdXJsKCcke3NyY1syXX0nKWA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdlbmVyYXRlQ2xvbmVzKGNvbnRlbnRzKSB7XG4gICAgY29uc3QgeyBjbGFzc2VzIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLmdldENsb25lQ291bnQoKTtcbiAgICBjb25zdCBzbGlkZXMgPSBjb250ZW50cy5zbGljZSgpO1xuICAgIHdoaWxlIChzbGlkZXMubGVuZ3RoIDwgY291bnQpIHtcbiAgICAgIHB1c2goc2xpZGVzLCBzbGlkZXMpO1xuICAgIH1cbiAgICBwdXNoKHNsaWRlcy5zbGljZSgtY291bnQpLnJldmVyc2UoKSwgc2xpZGVzLnNsaWNlKDAsIGNvdW50KSkuZm9yRWFjaCgoY29udGVudCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGF0dHJzID0gYXNzaWduKHt9LCBjb250ZW50LmF0dHJzLCB7IGNsYXNzOiBgJHtjb250ZW50LmF0dHJzLmNsYXNzfSAke2NsYXNzZXMuY2xvbmV9YCB9KTtcbiAgICAgIGNvbnN0IGNsb25lID0gYXNzaWduKHt9LCBjb250ZW50LCB7IGF0dHJzIH0pO1xuICAgICAgaW5kZXggPCBjb3VudCA/IGNvbnRlbnRzLnVuc2hpZnQoY2xvbmUpIDogY29udGVudHMucHVzaChjbG9uZSk7XG4gICAgfSk7XG4gIH1cbiAgZ2V0Q2xvbmVDb3VudCgpIHtcbiAgICBpZiAodGhpcy5pc0xvb3AoKSkge1xuICAgICAgY29uc3QgeyBvcHRpb25zIH0gPSB0aGlzO1xuICAgICAgaWYgKG9wdGlvbnMuY2xvbmVzKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLmNsb25lcztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBlclBhZ2UgPSBtYXgoLi4udGhpcy5icmVha3BvaW50cy5tYXAoKFssIG9wdGlvbnMyXSkgPT4gb3B0aW9uczIucGVyUGFnZSkpO1xuICAgICAgcmV0dXJuIHBlclBhZ2UgKiAoKG9wdGlvbnMuZmxpY2tNYXhQYWdlcyB8fCAxKSArIDEpO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuICByZW5kZXJBcnJvd3MoKSB7XG4gICAgbGV0IGh0bWwgPSBcIlwiO1xuICAgIGh0bWwgKz0gYDxkaXYgY2xhc3M9XCIke3RoaXMub3B0aW9ucy5jbGFzc2VzLmFycm93c31cIj5gO1xuICAgIGh0bWwgKz0gdGhpcy5yZW5kZXJBcnJvdyh0cnVlKTtcbiAgICBodG1sICs9IHRoaXMucmVuZGVyQXJyb3coZmFsc2UpO1xuICAgIGh0bWwgKz0gYDwvZGl2PmA7XG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cbiAgcmVuZGVyQXJyb3cocHJldikge1xuICAgIGNvbnN0IHsgY2xhc3NlcywgaTE4biB9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IGF0dHJzID0ge1xuICAgICAgY2xhc3M6IGAke2NsYXNzZXMuYXJyb3d9ICR7cHJldiA/IGNsYXNzZXMucHJldiA6IGNsYXNzZXMubmV4dH1gLFxuICAgICAgdHlwZTogXCJidXR0b25cIixcbiAgICAgIGFyaWFMYWJlbDogcHJldiA/IGkxOG4ucHJldiA6IGkxOG4ubmV4dFxuICAgIH07XG4gICAgcmV0dXJuIGA8YnV0dG9uICR7dGhpcy5idWlsZEF0dHJzKGF0dHJzKX0+PHN2ZyB4bWxucz1cIiR7WE1MX05BTUVfU1BBQ0V9XCIgdmlld0JveD1cIjAgMCAke1NJWkV9ICR7U0laRX1cIiB3aWR0aD1cIiR7U0laRX1cIiBoZWlnaHQ9XCIke1NJWkV9XCI+PHBhdGggZD1cIiR7dGhpcy5vcHRpb25zLmFycm93UGF0aCB8fCBQQVRIfVwiIC8+PC9zdmc+PC9idXR0b24+YDtcbiAgfVxuICBodG1sKCkge1xuICAgIGNvbnN0IHsgcm9vdENsYXNzLCBsaXN0VGFnLCBhcnJvd3MsIGJlZm9yZVRyYWNrLCBhZnRlclRyYWNrLCBzbGlkZXIsIGJlZm9yZVNsaWRlciwgYWZ0ZXJTbGlkZXIgfSA9IHRoaXMuY29uZmlnO1xuICAgIGxldCBodG1sID0gXCJcIjtcbiAgICBodG1sICs9IGA8ZGl2IGlkPVwiJHt0aGlzLmlkfVwiIGNsYXNzPVwiJHt0aGlzLmJ1aWxkQ2xhc3NlcygpfSAke3Jvb3RDbGFzcyB8fCBcIlwifVwiPmA7XG4gICAgaHRtbCArPSBgPHN0eWxlPiR7dGhpcy5TdHlsZS5idWlsZCgpfTwvc3R5bGU+YDtcbiAgICBpZiAoc2xpZGVyKSB7XG4gICAgICBodG1sICs9IGJlZm9yZVNsaWRlciB8fCBcIlwiO1xuICAgICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cInNwbGlkZV9fc2xpZGVyXCI+YDtcbiAgICB9XG4gICAgaHRtbCArPSBiZWZvcmVUcmFjayB8fCBcIlwiO1xuICAgIGlmIChhcnJvd3MpIHtcbiAgICAgIGh0bWwgKz0gdGhpcy5yZW5kZXJBcnJvd3MoKTtcbiAgICB9XG4gICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cInNwbGlkZV9fdHJhY2tcIj5gO1xuICAgIGh0bWwgKz0gYDwke2xpc3RUYWd9IGNsYXNzPVwic3BsaWRlX19saXN0XCI+YDtcbiAgICBodG1sICs9IHRoaXMucmVuZGVyU2xpZGVzKCk7XG4gICAgaHRtbCArPSBgPC8ke2xpc3RUYWd9PmA7XG4gICAgaHRtbCArPSBgPC9kaXY+YDtcbiAgICBodG1sICs9IGFmdGVyVHJhY2sgfHwgXCJcIjtcbiAgICBpZiAoc2xpZGVyKSB7XG4gICAgICBodG1sICs9IGA8L2Rpdj5gO1xuICAgICAgaHRtbCArPSBhZnRlclNsaWRlciB8fCBcIlwiO1xuICAgIH1cbiAgICBodG1sICs9IGA8L2Rpdj5gO1xuICAgIHJldHVybiBodG1sO1xuICB9XG59XG5cbmV4cG9ydCB7IENMQVNTRVMsIENMQVNTX0FDVElWRSwgQ0xBU1NfQVJST1csIENMQVNTX0FSUk9XUywgQ0xBU1NfQVJST1dfTkVYVCwgQ0xBU1NfQVJST1dfUFJFViwgQ0xBU1NfQVVUT1BMQVksIENMQVNTX0NMT05FLCBDTEFTU19DT05UQUlORVIsIENMQVNTX0lOSVRJQUxJWkVELCBDTEFTU19MSVNULCBDTEFTU19MT0FESU5HLCBDTEFTU19ORVhULCBDTEFTU19QQUdJTkFUSU9OLCBDTEFTU19QQUdJTkFUSU9OX1BBR0UsIENMQVNTX1BBVVNFLCBDTEFTU19QTEFZLCBDTEFTU19QUkVWLCBDTEFTU19QUk9HUkVTUywgQ0xBU1NfUFJPR1JFU1NfQkFSLCBDTEFTU19ST09ULCBDTEFTU19TTElERSwgQ0xBU1NfU0xJREVSLCBDTEFTU19TUElOTkVSLCBDTEFTU19UUkFDSywgQ0xBU1NfVklTSUJMRSwgRVZFTlRfQUNUSVZFLCBFVkVOVF9BUlJPV1NfTU9VTlRFRCwgRVZFTlRfQVJST1dTX1VQREFURUQsIEVWRU5UX0FVVE9QTEFZX1BBVVNFLCBFVkVOVF9BVVRPUExBWV9QTEFZLCBFVkVOVF9BVVRPUExBWV9QTEFZSU5HLCBFVkVOVF9DTElDSywgRVZFTlRfREVTVFJPWSwgRVZFTlRfRFJBRywgRVZFTlRfRFJBR0dFRCwgRVZFTlRfRFJBR0dJTkcsIEVWRU5UX0hJRERFTiwgRVZFTlRfSU5BQ1RJVkUsIEVWRU5UX0xBWllMT0FEX0xPQURFRCwgRVZFTlRfTU9VTlRFRCwgRVZFTlRfTU9WRSwgRVZFTlRfTU9WRUQsIEVWRU5UX05BVklHQVRJT05fTU9VTlRFRCwgRVZFTlRfUEFHSU5BVElPTl9NT1VOVEVELCBFVkVOVF9QQUdJTkFUSU9OX1VQREFURUQsIEVWRU5UX1JFQURZLCBFVkVOVF9SRUZSRVNILCBFVkVOVF9SRVBPU0lUSU9ORUQsIEVWRU5UX1JFU0laRSwgRVZFTlRfUkVTSVpFRCwgRVZFTlRfU0NST0xMLCBFVkVOVF9TQ1JPTExFRCwgRVZFTlRfU0xJREVfS0VZRE9XTiwgRVZFTlRfVVBEQVRFRCwgRVZFTlRfVklTSUJMRSwgRXZlbnRCdXMsIEV2ZW50SW50ZXJmYWNlLCBSZXF1ZXN0SW50ZXJ2YWwsIFNUQVRVU19DTEFTU0VTLCBTcGxpZGUsIFNwbGlkZVJlbmRlcmVyLCBTdGF0ZSwgVGhyb3R0bGUsIFNwbGlkZSBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgU3BsaWRlIGZyb20gJ0BzcGxpZGVqcy9zcGxpZGUnO1xyXG5cclxuXHJcbmlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2Fyb3VzZWwnKSkge1xyXG4gIG5ldyBTcGxpZGUoICcjY2Fyb3VzZWwnLCB7XHJcbiAgICBwYWdpbmF0aW9uOiBmYWxzZSxcclxuICAgIHR5cGU6ICdzbGlkZScsXHJcbiAgICBwZXJQYWdlOiA0LFxyXG4gICAgcGVyTW92ZTogMSxcclxuICAgIGdhcDogMzIsXHJcbiAgICBicmVha3BvaW50czoge1xyXG4gICAgICA1MDA6IHtcclxuICAgICAgICBwZXJQYWdlOiAxLFxyXG4gICAgICAgIGdhcDogMTAsXHJcbiAgICAgIH0sXHJcbiAgICAgIDc2Nzoge1xyXG4gICAgICAgIHBlclBhZ2U6IDIsXHJcbiAgICAgICAgZ2FwOiAxMCxcclxuICAgICAgfSxcclxuICAgICAgMTAyNDoge1xyXG4gICAgICAgIHBlclBhZ2U6IDIsXHJcbiAgICAgICAgZ2FwOiAxNixcclxuICAgICAgfSxcclxuICAgICAgMTQwMDoge1xyXG4gICAgICAgIHBlclBhZ2U6IDMsXHJcbiAgICAgICAgZ2FwOiAzMixcclxuICAgICAgfSxcclxuICAgIH1cclxuICB9ICkubW91bnQoKTtcclxufVxyXG4iLCIvKipcclxuICogVG9nZ2xlIE5hdlxyXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiAtIHRvZ2dsZSBjbGFzcyBvbiBib2R5XHJcbiAqL1xyXG5cclxuY29uc3QgRUxFTUVOVFMgPSAnLnRvZ2dsZW5hdl9fYnV0dG9uJ1xyXG5jb25zdCBUT0dHTEVfQ0xBU1MgPSAnbmF2LWlzLW9wZW4nXHJcblxyXG5jbGFzcyBUb2dnbGVOYXYge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoRUxFTUVOVFMpXHJcblxyXG4gICAgaWYgKCF0aGlzLmVsZW1lbnRzKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZWxlbWVudHMuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnRvZ2dsZU5hdiwgZmFsc2UpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgdG9nZ2xlTmF2KGUpIHtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShUT0dHTEVfQ0xBU1MpXHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2xvY2snKVxyXG5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gIH1cclxufVxyXG5cclxubmV3IFRvZ2dsZU5hdigpXHJcbiIsIi8qIVxyXG5cdEJ5IEFuZHLDqSBSaW5hcywgd3d3LmFuZHJlcmluYXMuZGVcclxuXHREb2N1bWVudGF0aW9uLCB3d3cuc2ltcGxlbGlnaHRib3guZGVcclxuXHRBdmFpbGFibGUgZm9yIHVzZSB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuXHRWZXJzaW9uIDIuMTAuMVxyXG4qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihvLCBhbGxvd0FycmF5TGlrZSkgeyB2YXIgaXQgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSB8fCBvW1wiQEBpdGVyYXRvclwiXTsgaWYgKCFpdCkgeyBpZiAoQXJyYXkuaXNBcnJheShvKSB8fCAoaXQgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobykpIHx8IGFsbG93QXJyYXlMaWtlICYmIG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSB7IGlmIChpdCkgbyA9IGl0OyB2YXIgaSA9IDA7IHZhciBGID0gZnVuY3Rpb24gRigpIHt9OyByZXR1cm4geyBzOiBGLCBuOiBmdW5jdGlvbiBuKCkgeyBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9OyByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IG9baSsrXSB9OyB9LCBlOiBmdW5jdGlvbiBlKF9lKSB7IHRocm93IF9lOyB9LCBmOiBGIH07IH0gdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9IHZhciBub3JtYWxDb21wbGV0aW9uID0gdHJ1ZSwgZGlkRXJyID0gZmFsc2UsIGVycjsgcmV0dXJuIHsgczogZnVuY3Rpb24gcygpIHsgaXQgPSBpdC5jYWxsKG8pOyB9LCBuOiBmdW5jdGlvbiBuKCkgeyB2YXIgc3RlcCA9IGl0Lm5leHQoKTsgbm9ybWFsQ29tcGxldGlvbiA9IHN0ZXAuZG9uZTsgcmV0dXJuIHN0ZXA7IH0sIGU6IGZ1bmN0aW9uIGUoX2UyKSB7IGRpZEVyciA9IHRydWU7IGVyciA9IF9lMjsgfSwgZjogZnVuY3Rpb24gZigpIHsgdHJ5IHsgaWYgKCFub3JtYWxDb21wbGV0aW9uICYmIGl0W1wicmV0dXJuXCJdICE9IG51bGwpIGl0W1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChkaWRFcnIpIHRocm93IGVycjsgfSB9IH07IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBTaW1wbGVMaWdodGJveCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNpbXBsZUxpZ2h0Ym94KGVsZW1lbnRzLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTaW1wbGVMaWdodGJveCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJkZWZhdWx0T3B0aW9uc1wiLCB7XG4gICAgICBzb3VyY2VBdHRyOiAnaHJlZicsXG4gICAgICBvdmVybGF5OiB0cnVlLFxuICAgICAgc3Bpbm5lcjogdHJ1ZSxcbiAgICAgIG5hdjogdHJ1ZSxcbiAgICAgIG5hdlRleHQ6IFsnJmxzYXF1bzsnLCAnJnJzYXF1bzsnXSxcbiAgICAgIGNhcHRpb25zOiB0cnVlLFxuICAgICAgY2FwdGlvbkRlbGF5OiAwLFxuICAgICAgY2FwdGlvblNlbGVjdG9yOiAnaW1nJyxcbiAgICAgIGNhcHRpb25UeXBlOiAnYXR0cicsXG4gICAgICBjYXB0aW9uc0RhdGE6ICd0aXRsZScsXG4gICAgICBjYXB0aW9uUG9zaXRpb246ICdib3R0b20nLFxuICAgICAgY2FwdGlvbkNsYXNzOiAnJyxcbiAgICAgIGNsb3NlOiB0cnVlLFxuICAgICAgY2xvc2VUZXh0OiAnJnRpbWVzOycsXG4gICAgICBzd2lwZUNsb3NlOiB0cnVlLFxuICAgICAgc2hvd0NvdW50ZXI6IHRydWUsXG4gICAgICBmaWxlRXh0OiAncG5nfGpwZ3xqcGVnfGdpZnx3ZWJwJyxcbiAgICAgIGFuaW1hdGlvblNsaWRlOiB0cnVlLFxuICAgICAgYW5pbWF0aW9uU3BlZWQ6IDI1MCxcbiAgICAgIHByZWxvYWRpbmc6IHRydWUsXG4gICAgICBlbmFibGVLZXlib2FyZDogdHJ1ZSxcbiAgICAgIGxvb3A6IHRydWUsXG4gICAgICByZWw6IGZhbHNlLFxuICAgICAgZG9jQ2xvc2U6IHRydWUsXG4gICAgICBzd2lwZVRvbGVyYW5jZTogNTAsXG4gICAgICBjbGFzc05hbWU6ICdzaW1wbGUtbGlnaHRib3gnLFxuICAgICAgd2lkdGhSYXRpbzogMC44LFxuICAgICAgaGVpZ2h0UmF0aW86IDAuOSxcbiAgICAgIHNjYWxlSW1hZ2VUb1JhdGlvOiBmYWxzZSxcbiAgICAgIGRpc2FibGVSaWdodENsaWNrOiBmYWxzZSxcbiAgICAgIGRpc2FibGVTY3JvbGw6IHRydWUsXG4gICAgICBhbGVydEVycm9yOiB0cnVlLFxuICAgICAgYWxlcnRFcnJvck1lc3NhZ2U6ICdJbWFnZSBub3QgZm91bmQsIG5leHQgaW1hZ2Ugd2lsbCBiZSBsb2FkZWQnLFxuICAgICAgYWRkaXRpb25hbEh0bWw6IGZhbHNlLFxuICAgICAgaGlzdG9yeTogdHJ1ZSxcbiAgICAgIHRocm90dGxlSW50ZXJ2YWw6IDAsXG4gICAgICBkb3VibGVUYXBab29tOiAyLFxuICAgICAgbWF4Wm9vbTogMTAsXG4gICAgICBodG1sQ2xhc3M6ICdoYXMtbGlnaHRib3gnLFxuICAgICAgcnRsOiBmYWxzZSxcbiAgICAgIGZpeGVkQ2xhc3M6ICdzbC1maXhlZCcsXG4gICAgICBmYWRlU3BlZWQ6IDMwMCxcbiAgICAgIHVuaXF1ZUltYWdlczogdHJ1ZSxcbiAgICAgIGZvY3VzOiB0cnVlLFxuICAgICAgc2Nyb2xsWm9vbTogdHJ1ZSxcbiAgICAgIHNjcm9sbFpvb21GYWN0b3I6IDAuNVxuICAgIH0pO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwidHJhbnNpdGlvblByZWZpeFwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaXNQYXNzaXZlRXZlbnRzU3VwcG9ydGVkXCIsIHZvaWQgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJ0cmFuc2l0aW9uQ2FwYWJsZVwiLCBmYWxzZSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJpc1RvdWNoRGV2aWNlXCIsICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJpc0FwcGxlRGV2aWNlXCIsIC8oTWFjfGlQaG9uZXxpUG9kfGlQYWQpL2kudGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImluaXRpYWxMb2NhdGlvbkhhc2hcIiwgdm9pZCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInB1c2hTdGF0ZVN1cHBvcnRcIiwgJ3B1c2hTdGF0ZScgaW4gaGlzdG9yeSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJpc09wZW5cIiwgZmFsc2UpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaXNBbmltYXRpbmdcIiwgZmFsc2UpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaXNDbG9zaW5nXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImlzRmFkZUluXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInVybENoYW5nZWRPbmNlXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImhhc2hSZXNldGVkXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImhpc3RvcnlIYXNDaGFuZ2VzXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImhpc3RvcnlVcGRhdGVUaW1lb3V0XCIsIG51bGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiY3VycmVudEltYWdlXCIsIHZvaWQgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJldmVudE5hbWVzcGFjZVwiLCAnc2ltcGxlbGlnaHRib3gnKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImRvbU5vZGVzXCIsIHt9KTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImxvYWRlZEltYWdlc1wiLCBbXSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJpbml0aWFsSW1hZ2VJbmRleFwiLCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImN1cnJlbnRJbWFnZUluZGV4XCIsIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaW5pdGlhbFNlbGVjdG9yXCIsIG51bGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiZ2xvYmFsU2Nyb2xsYmFyV2lkdGhcIiwgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJjb250cm9sQ29vcmRpbmF0ZXNcIiwge1xuICAgICAgc3dpcGVEaWZmOiAwLFxuICAgICAgc3dpcGVZRGlmZjogMCxcbiAgICAgIHN3aXBlU3RhcnQ6IDAsXG4gICAgICBzd2lwZUVuZDogMCxcbiAgICAgIHN3aXBlWVN0YXJ0OiAwLFxuICAgICAgc3dpcGVZRW5kOiAwLFxuICAgICAgbW91c2Vkb3duOiBmYWxzZSxcbiAgICAgIGltYWdlTGVmdDogMCxcbiAgICAgIHpvb21lZDogZmFsc2UsXG4gICAgICBjb250YWluZXJIZWlnaHQ6IDAsXG4gICAgICBjb250YWluZXJXaWR0aDogMCxcbiAgICAgIGNvbnRhaW5lck9mZnNldFg6IDAsXG4gICAgICBjb250YWluZXJPZmZzZXRZOiAwLFxuICAgICAgaW1nSGVpZ2h0OiAwLFxuICAgICAgaW1nV2lkdGg6IDAsXG4gICAgICBjYXB0dXJlOiBmYWxzZSxcbiAgICAgIGluaXRpYWxPZmZzZXRYOiAwLFxuICAgICAgaW5pdGlhbE9mZnNldFk6IDAsXG4gICAgICBpbml0aWFsUG9pbnRlck9mZnNldFg6IDAsXG4gICAgICBpbml0aWFsUG9pbnRlck9mZnNldFk6IDAsXG4gICAgICBpbml0aWFsUG9pbnRlck9mZnNldFgyOiAwLFxuICAgICAgaW5pdGlhbFBvaW50ZXJPZmZzZXRZMjogMCxcbiAgICAgIGluaXRpYWxTY2FsZTogMSxcbiAgICAgIGluaXRpYWxQaW5jaERpc3RhbmNlOiAwLFxuICAgICAgcG9pbnRlck9mZnNldFg6IDAsXG4gICAgICBwb2ludGVyT2Zmc2V0WTogMCxcbiAgICAgIHBvaW50ZXJPZmZzZXRYMjogMCxcbiAgICAgIHBvaW50ZXJPZmZzZXRZMjogMCxcbiAgICAgIHRhcmdldE9mZnNldFg6IDAsXG4gICAgICB0YXJnZXRPZmZzZXRZOiAwLFxuICAgICAgdGFyZ2V0U2NhbGU6IDAsXG4gICAgICBwaW5jaE9mZnNldFg6IDAsXG4gICAgICBwaW5jaE9mZnNldFk6IDAsXG4gICAgICBsaW1pdE9mZnNldFg6IDAsXG4gICAgICBsaW1pdE9mZnNldFk6IDAsXG4gICAgICBzY2FsZURpZmZlcmVuY2U6IDAsXG4gICAgICB0YXJnZXRQaW5jaERpc3RhbmNlOiAwLFxuICAgICAgdG91Y2hDb3VudDogMCxcbiAgICAgIGRvdWJsZVRhcHBlZDogZmFsc2UsXG4gICAgICB0b3VjaG1vdmVDb3VudDogMFxuICAgIH0pO1xuXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB0aGlzLmlzUGFzc2l2ZUV2ZW50c1N1cHBvcnRlZCA9IHRoaXMuY2hlY2tQYXNzaXZlRXZlbnRzU3VwcG9ydCgpO1xuXG4gICAgaWYgKHR5cGVvZiBlbGVtZW50cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuaW5pdGlhbFNlbGVjdG9yID0gZWxlbWVudHM7XG4gICAgICB0aGlzLmVsZW1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnRzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudHMgPSB0eXBlb2YgZWxlbWVudHMubGVuZ3RoICE9PSAndW5kZWZpbmVkJyAmJiBlbGVtZW50cy5sZW5ndGggPiAwID8gQXJyYXkuZnJvbShlbGVtZW50cykgOiBbZWxlbWVudHNdO1xuICAgIH1cblxuICAgIHRoaXMucmVsYXRlZEVsZW1lbnRzID0gW107XG4gICAgdGhpcy50cmFuc2l0aW9uUHJlZml4ID0gdGhpcy5jYWxjdWxhdGVUcmFuc2l0aW9uUHJlZml4KCk7XG4gICAgdGhpcy50cmFuc2l0aW9uQ2FwYWJsZSA9IHRoaXMudHJhbnNpdGlvblByZWZpeCAhPT0gZmFsc2U7XG4gICAgdGhpcy5pbml0aWFsTG9jYXRpb25IYXNoID0gdGhpcy5oYXNoOyAvLyB0aGlzIHNob3VsZCBiZSBoYW5kbGVkIGJ5IGF0dHJpYnV0ZSBzZWxlY3RvciBJTUhPISA9PiAnYVtyZWw9YmxhXScuLi5cblxuICAgIGlmICh0aGlzLm9wdGlvbnMucmVsKSB7XG4gICAgICB0aGlzLmVsZW1lbnRzID0gdGhpcy5nZXRSZWxhdGVkKHRoaXMub3B0aW9ucy5yZWwpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMudW5pcXVlSW1hZ2VzKSB7XG4gICAgICB2YXIgaW1nQXJyID0gW107XG4gICAgICB0aGlzLmVsZW1lbnRzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnRzKS5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHNyYyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKF90aGlzLm9wdGlvbnMuc291cmNlQXR0cik7XG5cbiAgICAgICAgaWYgKGltZ0Fyci5pbmRleE9mKHNyYykgPT09IC0xKSB7XG4gICAgICAgICAgaW1nQXJyLnB1c2goc3JjKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuY3JlYXRlRG9tTm9kZXMoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xvc2UpIHtcbiAgICAgIHRoaXMuZG9tTm9kZXMud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmRvbU5vZGVzLmNsb3NlQnV0dG9uKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm5hdikge1xuICAgICAgdGhpcy5kb21Ob2Rlcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZG9tTm9kZXMubmF2aWdhdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zcGlubmVyKSB7XG4gICAgICB0aGlzLmRvbU5vZGVzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5kb21Ob2Rlcy5zcGlubmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5lbGVtZW50cywgJ2NsaWNrLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChfdGhpcy5pc1ZhbGlkTGluayhldmVudC5jdXJyZW50VGFyZ2V0KSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmIChfdGhpcy5pc0FuaW1hdGluZykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLmluaXRpYWxJbWFnZUluZGV4ID0gX3RoaXMuZWxlbWVudHMuaW5kZXhPZihldmVudC5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICBfdGhpcy5vcGVuSW1hZ2UoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICB9XG4gICAgfSk7IC8vIGNsb3NlIGFkZEV2ZW50TGlzdGVuZXIgY2xpY2sgYWRkRXZlbnRMaXN0ZW5lciBkb2NcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZG9jQ2xvc2UpIHtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmRvbU5vZGVzLndyYXBwZXIsIFsnY2xpY2suJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICd0b3VjaHN0YXJ0LicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlXSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChfdGhpcy5pc09wZW4gJiYgZXZlbnQudGFyZ2V0ID09PSBldmVudC5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSAvLyBkaXNhYmxlIHJpZ2h0Y2xpY2tcblxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlUmlnaHRDbGljaykge1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKGRvY3VtZW50LmJvZHksICdjb250ZXh0bWVudS4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJzbC1pbWFnZVwiKSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gLy8ga2V5Ym9hcmQtY29udHJvbFxuXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmVuYWJsZUtleWJvYXJkKSB7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQuYm9keSwgJ2tleXVwLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlLCB0aGlzLnRocm90dGxlKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBfdGhpcy5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVEaWZmID0gMDsgLy8ga2V5Ym9hcmQgY29udHJvbCBvbmx5IGlmIGxpZ2h0Ym94IGlzIG9wZW5cblxuICAgICAgICBpZiAoX3RoaXMuaXNBbmltYXRpbmcgJiYgZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICAgIF90aGlzLmN1cnJlbnRJbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcnKTtcblxuICAgICAgICAgIF90aGlzLmlzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgICAgICBfdGhpcy5jbG9zZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghX3RoaXMuaXNBbmltYXRpbmcgJiYgWydBcnJvd0xlZnQnLCAnQXJyb3dSaWdodCddLmluZGV4T2YoZXZlbnQua2V5KSA+IC0xKSB7XG4gICAgICAgICAgICBfdGhpcy5sb2FkSW1hZ2UoZXZlbnQua2V5ID09PSAnQXJyb3dSaWdodCcgPyAxIDogLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgdGhpcy5vcHRpb25zLnRocm90dGxlSW50ZXJ2YWwpKTtcbiAgICB9XG5cbiAgICB0aGlzLmFkZEV2ZW50cygpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNpbXBsZUxpZ2h0Ym94LCBbe1xuICAgIGtleTogXCJjaGVja1Bhc3NpdmVFdmVudHNTdXBwb3J0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNoZWNrUGFzc2l2ZUV2ZW50c1N1cHBvcnQoKSB7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9FdmVudExpc3RlbmVyT3B0aW9ucy9ibG9iL2doLXBhZ2VzL2V4cGxhaW5lci5tZCNmZWF0dXJlLWRldGVjdGlvblxuICAgICAgLy8gVGVzdCB2aWEgYSBnZXR0ZXIgaW4gdGhlIG9wdGlvbnMgb2JqZWN0IHRvIHNlZSBpZiB0aGUgcGFzc2l2ZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZFxuICAgICAgdmFyIHN1cHBvcnRzUGFzc2l2ZSA9IGZhbHNlO1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgb3B0cyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ3Bhc3NpdmUnLCB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICBzdXBwb3J0c1Bhc3NpdmUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidGVzdFBhc3NpdmVcIiwgbnVsbCwgb3B0cyk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwidGVzdFBhc3NpdmVcIiwgbnVsbCwgb3B0cyk7XG4gICAgICB9IGNhdGNoIChlKSB7fVxuXG4gICAgICByZXR1cm4gc3VwcG9ydHNQYXNzaXZlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVEb21Ob2Rlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVEb21Ob2RlcygpIHtcbiAgICAgIHRoaXMuZG9tTm9kZXMub3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5kb21Ob2Rlcy5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ3NsLW92ZXJsYXknKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMub3ZlcmxheS5kYXRhc2V0Lm9wYWNpdHlUYXJnZXQgPSBcIi43XCI7XG4gICAgICB0aGlzLmRvbU5vZGVzLmNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLmNsb3NlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3NsLWNsb3NlJyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLmNsb3NlQnV0dG9uLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5jbG9zZVRleHQ7XG4gICAgICB0aGlzLmRvbU5vZGVzLnNwaW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMuc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCdzbC1zcGlubmVyJyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLnNwaW5uZXIuaW5uZXJIVE1MID0gJzxkaXY+PC9kaXY+JztcbiAgICAgIHRoaXMuZG9tTm9kZXMubmF2aWdhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5kb21Ob2Rlcy5uYXZpZ2F0aW9uLmNsYXNzTGlzdC5hZGQoJ3NsLW5hdmlnYXRpb24nKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMubmF2aWdhdGlvbi5pbm5lckhUTUwgPSBcIjxidXR0b24gY2xhc3M9XFxcInNsLXByZXZcXFwiPlwiLmNvbmNhdCh0aGlzLm9wdGlvbnMubmF2VGV4dFswXSwgXCI8L2J1dHRvbj48YnV0dG9uIGNsYXNzPVxcXCJzbC1uZXh0XFxcIj5cIikuY29uY2F0KHRoaXMub3B0aW9ucy5uYXZUZXh0WzFdLCBcIjwvYnV0dG9uPlwiKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMuY291bnRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5kb21Ob2Rlcy5jb3VudGVyLmNsYXNzTGlzdC5hZGQoJ3NsLWNvdW50ZXInKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMuY291bnRlci5pbm5lckhUTUwgPSAnPHNwYW4gY2xhc3M9XCJzbC1jdXJyZW50XCI+PC9zcGFuPi88c3BhbiBjbGFzcz1cInNsLXRvdGFsXCI+PC9zcGFuPic7XG4gICAgICB0aGlzLmRvbU5vZGVzLmNhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMuY2FwdGlvbi5jbGFzc0xpc3QuYWRkKCdzbC1jYXB0aW9uJywgJ3Bvcy0nICsgdGhpcy5vcHRpb25zLmNhcHRpb25Qb3NpdGlvbik7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FwdGlvbkNsYXNzKSB7XG4gICAgICAgIHRoaXMuZG9tTm9kZXMuY2FwdGlvbi5jbGFzc0xpc3QuYWRkKHRoaXMub3B0aW9ucy5jYXB0aW9uQ2xhc3MpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRvbU5vZGVzLmltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLmltYWdlLmNsYXNzTGlzdC5hZGQoJ3NsLWltYWdlJyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLndyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdzbC13cmFwcGVyJyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLndyYXBwZXIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMud3JhcHBlci5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZGlhbG9nJyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLndyYXBwZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jbGFzc05hbWUpIHtcbiAgICAgICAgdGhpcy5kb21Ob2Rlcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQodGhpcy5vcHRpb25zLmNsYXNzTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucnRsKSB7XG4gICAgICAgIHRoaXMuZG9tTm9kZXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdzbC1kaXItcnRsJyk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRocm90dGxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIGxpbWl0KSB7XG4gICAgICB2YXIgaW5UaHJvdHRsZTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaW5UaHJvdHRsZSkge1xuICAgICAgICAgIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICBpblRocm90dGxlID0gdHJ1ZTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBpblRocm90dGxlID0gZmFsc2U7XG4gICAgICAgICAgfSwgbGltaXQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpc1ZhbGlkTGlua1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc1ZhbGlkTGluayhlbGVtZW50KSB7XG4gICAgICByZXR1cm4gIXRoaXMub3B0aW9ucy5maWxlRXh0IHx8IGVsZW1lbnQuZ2V0QXR0cmlidXRlKHRoaXMub3B0aW9ucy5zb3VyY2VBdHRyKSAmJiBuZXcgUmVnRXhwKCcoJyArIHRoaXMub3B0aW9ucy5maWxlRXh0ICsgJykkJywgJ2knKS50ZXN0KGVsZW1lbnQuZ2V0QXR0cmlidXRlKHRoaXMub3B0aW9ucy5zb3VyY2VBdHRyKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNhbGN1bGF0ZVRyYW5zaXRpb25QcmVmaXhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2FsY3VsYXRlVHJhbnNpdGlvblByZWZpeCgpIHtcbiAgICAgIHZhciBzID0gKGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5zdHlsZTtcbiAgICAgIHJldHVybiAndHJhbnNpdGlvbicgaW4gcyA/ICcnIDogJ1dlYmtpdFRyYW5zaXRpb24nIGluIHMgPyAnLXdlYmtpdC0nIDogJ01velRyYW5zaXRpb24nIGluIHMgPyAnLW1vei0nIDogJ09UcmFuc2l0aW9uJyBpbiBzID8gJy1vJyA6IGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b2dnbGVTY3JvbGxiYXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlU2Nyb2xsYmFyKHR5cGUpIHtcbiAgICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IDA7XG4gICAgICB2YXIgZml4ZWRFbGVtZW50cyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLm9wdGlvbnMuZml4ZWRDbGFzcykpO1xuXG4gICAgICBpZiAodHlwZSA9PT0gJ2hpZGUnKSB7XG4gICAgICAgIHZhciBmdWxsV2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblxuICAgICAgICBpZiAoIWZ1bGxXaW5kb3dXaWR0aCkge1xuICAgICAgICAgIHZhciBkb2N1bWVudEVsZW1lbnRSZWN0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgIGZ1bGxXaW5kb3dXaWR0aCA9IGRvY3VtZW50RWxlbWVudFJlY3QucmlnaHQgLSBNYXRoLmFicyhkb2N1bWVudEVsZW1lbnRSZWN0LmxlZnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPCBmdWxsV2luZG93V2lkdGggfHwgdGhpcy5pc0FwcGxlRGV2aWNlKSB7XG4gICAgICAgICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQgPSBwYXJzZUludChkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCB8fCAwLCAxMCk7XG4gICAgICAgICAgc2Nyb2xsRGl2LmNsYXNzTGlzdC5hZGQoJ3NsLXNjcm9sbGJhci1tZWFzdXJlJyk7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JvbGxEaXYpO1xuICAgICAgICAgIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQub3JpZ2luYWxQYWRkaW5nUmlnaHQgPSBwYWRkaW5nUmlnaHQ7XG5cbiAgICAgICAgICBpZiAoc2Nyb2xsYmFyV2lkdGggPiAwIHx8IHNjcm9sbGJhcldpZHRoID09IDAgJiYgdGhpcy5pc0FwcGxlRGV2aWNlKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1zY3JvbGwnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZ1JpZ2h0ICsgc2Nyb2xsYmFyV2lkdGggKyAncHgnO1xuICAgICAgICAgICAgZml4ZWRFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgIHZhciBhY3R1YWxQYWRkaW5nID0gZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQ7XG4gICAgICAgICAgICAgIHZhciBjYWxjdWxhdGVkUGFkZGluZyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpWydwYWRkaW5nLXJpZ2h0J107XG4gICAgICAgICAgICAgIGVsZW1lbnQuZGF0YXNldC5vcmlnaW5hbFBhZGRpbmdSaWdodCA9IGFjdHVhbFBhZGRpbmc7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCJcIi5jb25jYXQocGFyc2VGbG9hdChjYWxjdWxhdGVkUGFkZGluZykgKyBzY3JvbGxiYXJXaWR0aCwgXCJweFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tc2Nyb2xsJyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gZG9jdW1lbnQuYm9keS5kYXRhc2V0Lm9yaWdpbmFsUGFkZGluZ1JpZ2h0O1xuICAgICAgICBmaXhlZEVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICB2YXIgcGFkZGluZyA9IGVsZW1lbnQuZGF0YXNldC5vcmlnaW5hbFBhZGRpbmdSaWdodDtcblxuICAgICAgICAgIGlmICh0eXBlb2YgcGFkZGluZyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsb3NlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIGlmICghdGhpcy5pc09wZW4gfHwgdGhpcy5pc0FuaW1hdGluZyB8fCB0aGlzLmlzQ2xvc2luZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNDbG9zaW5nID0gdHJ1ZTtcbiAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5yZWxhdGVkRWxlbWVudHNbdGhpcy5jdXJyZW50SW1hZ2VJbmRleF07XG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjbG9zZS5zaW1wbGVsaWdodGJveCcpKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oaXN0b3J5KSB7XG4gICAgICAgIHRoaXMuaGlzdG9yeUhhc0NoYW5nZXMgPSBmYWxzZTtcblxuICAgICAgICBpZiAoIXRoaXMuaGFzaFJlc2V0ZWQpIHtcbiAgICAgICAgICB0aGlzLnJlc2V0SGFzaCgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb2N1bWVudCwgJ2ZvY3VzaW4uJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpO1xuICAgICAgdGhpcy5mYWRlT3V0KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbC1pbWFnZSBpbWcsIC5zbC1vdmVybGF5LCAuc2wtY2xvc2UsIC5zbC1uYXZpZ2F0aW9uLCAuc2wtaW1hZ2UgLnNsLWNhcHRpb24sIC5zbC1jb3VudGVyJyksIHRoaXMub3B0aW9ucy5mYWRlU3BlZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLmRpc2FibGVTY3JvbGwpIHtcbiAgICAgICAgICBfdGhpczIudG9nZ2xlU2Nyb2xsYmFyKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXMyLm9wdGlvbnMuaHRtbENsYXNzICYmIF90aGlzMi5vcHRpb25zLmh0bWxDbGFzcyAhPT0gJycpIHtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykuY2xhc3NMaXN0LnJlbW92ZShfdGhpczIub3B0aW9ucy5odG1sQ2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChfdGhpczIuZG9tTm9kZXMud3JhcHBlcik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoX3RoaXMyLmRvbU5vZGVzLm92ZXJsYXkpO1xuICAgICAgICBfdGhpczIuZG9tTm9kZXMuYWRkaXRpb25hbEh0bWwgPSBudWxsO1xuICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjbG9zZWQuc2ltcGxlbGlnaHRib3gnKSk7XG4gICAgICAgIF90aGlzMi5pc0Nsb3NpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5jdXJyZW50SW1hZ2UgPSBudWxsO1xuICAgICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuaXNBbmltYXRpbmcgPSBmYWxzZTsgLy8gcmVzZXQgdG91Y2hjb250cm9sIGNvb3JkaW5hdGVzXG5cbiAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmNvbnRyb2xDb29yZGluYXRlcykge1xuICAgICAgICB0aGlzLmNvbnRyb2xDb29yZGluYXRlc1trZXldID0gMDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb250cm9sQ29vcmRpbmF0ZXMubW91c2Vkb3duID0gZmFsc2U7XG4gICAgICB0aGlzLmNvbnRyb2xDb29yZGluYXRlcy56b29tZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuY29udHJvbENvb3JkaW5hdGVzLmNhcHR1cmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSA9IHRoaXMubWluTWF4KDEsIDEsIHRoaXMub3B0aW9ucy5tYXhab29tKTtcbiAgICAgIHRoaXMuY29udHJvbENvb3JkaW5hdGVzLmRvdWJsZVRhcHBlZCA9IGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoYXNoXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwcmVsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByZWxvYWQoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIGluZGV4ID0gdGhpcy5jdXJyZW50SW1hZ2VJbmRleCxcbiAgICAgICAgICBsZW5ndGggPSB0aGlzLnJlbGF0ZWRFbGVtZW50cy5sZW5ndGgsXG4gICAgICAgICAgbmV4dCA9IGluZGV4ICsgMSA8IDAgPyBsZW5ndGggLSAxIDogaW5kZXggKyAxID49IGxlbmd0aCAtIDEgPyAwIDogaW5kZXggKyAxLFxuICAgICAgICAgIHByZXYgPSBpbmRleCAtIDEgPCAwID8gbGVuZ3RoIC0gMSA6IGluZGV4IC0gMSA+PSBsZW5ndGggLSAxID8gMCA6IGluZGV4IC0gMSxcbiAgICAgICAgICBuZXh0SW1hZ2UgPSBuZXcgSW1hZ2UoKSxcbiAgICAgICAgICBwcmV2SW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIG5leHRJbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBzcmMgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcblxuICAgICAgICBpZiAoX3RoaXMzLmxvYWRlZEltYWdlcy5pbmRleE9mKHNyYykgPT09IC0xKSB7XG4gICAgICAgICAgLy9pcyB0aGlzIGNvbmRpdGlvbiBldmVuIHJlcXVpcmVkLi4uIHNldHRpbmcgbXVsdGlwbGUgdGltZXMgd2lsbCBub3QgY2hhbmdlIHVzYWdlLi4uXG4gICAgICAgICAgX3RoaXMzLmxvYWRlZEltYWdlcy5wdXNoKHNyYyk7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczMucmVsYXRlZEVsZW1lbnRzW2luZGV4XS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbmV4dEltYWdlTG9hZGVkLicgKyBfdGhpczMuZXZlbnROYW1lc3BhY2UpKTtcbiAgICAgIH0pO1xuICAgICAgbmV4dEltYWdlLnNldEF0dHJpYnV0ZSgnc3JjJywgdGhpcy5yZWxhdGVkRWxlbWVudHNbbmV4dF0uZ2V0QXR0cmlidXRlKHRoaXMub3B0aW9ucy5zb3VyY2VBdHRyKSk7XG4gICAgICBwcmV2SW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgc3JjID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnc3JjJyk7XG5cbiAgICAgICAgaWYgKF90aGlzMy5sb2FkZWRJbWFnZXMuaW5kZXhPZihzcmMpID09PSAtMSkge1xuICAgICAgICAgIF90aGlzMy5sb2FkZWRJbWFnZXMucHVzaChzcmMpO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMzLnJlbGF0ZWRFbGVtZW50c1tpbmRleF0uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3ByZXZJbWFnZUxvYWRlZC4nICsgX3RoaXMzLmV2ZW50TmFtZXNwYWNlKSk7XG4gICAgICB9KTtcbiAgICAgIHByZXZJbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHRoaXMucmVsYXRlZEVsZW1lbnRzW3ByZXZdLmdldEF0dHJpYnV0ZSh0aGlzLm9wdGlvbnMuc291cmNlQXR0cikpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsb2FkSW1hZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZEltYWdlKGRpcmVjdGlvbikge1xuICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgIHZhciBzbGlkZURpcmVjdGlvbiA9IGRpcmVjdGlvbjtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5ydGwpIHtcbiAgICAgICAgZGlyZWN0aW9uID0gLWRpcmVjdGlvbjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWxhdGVkRWxlbWVudHNbdGhpcy5jdXJyZW50SW1hZ2VJbmRleF0uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZS4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSkpO1xuICAgICAgdGhpcy5yZWxhdGVkRWxlbWVudHNbdGhpcy5jdXJyZW50SW1hZ2VJbmRleF0uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoKGRpcmVjdGlvbiA9PT0gMSA/ICduZXh0JyA6ICdwcmV2JykgKyAnLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlKSk7XG4gICAgICB2YXIgbmV3SW5kZXggPSB0aGlzLmN1cnJlbnRJbWFnZUluZGV4ICsgZGlyZWN0aW9uO1xuXG4gICAgICBpZiAodGhpcy5pc0FuaW1hdGluZyB8fCAobmV3SW5kZXggPCAwIHx8IG5ld0luZGV4ID49IHRoaXMucmVsYXRlZEVsZW1lbnRzLmxlbmd0aCkgJiYgdGhpcy5vcHRpb25zLmxvb3AgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXJyZW50SW1hZ2VJbmRleCA9IG5ld0luZGV4IDwgMCA/IHRoaXMucmVsYXRlZEVsZW1lbnRzLmxlbmd0aCAtIDEgOiBuZXdJbmRleCA+IHRoaXMucmVsYXRlZEVsZW1lbnRzLmxlbmd0aCAtIDEgPyAwIDogbmV3SW5kZXg7XG4gICAgICB0aGlzLmRvbU5vZGVzLmNvdW50ZXIucXVlcnlTZWxlY3RvcignLnNsLWN1cnJlbnQnKS5pbm5lckhUTUwgPSB0aGlzLmN1cnJlbnRJbWFnZUluZGV4ICsgMTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb25TbGlkZSkge1xuICAgICAgICB0aGlzLnNsaWRlKHRoaXMub3B0aW9ucy5hbmltYXRpb25TcGVlZCAvIDEwMDAsIC0xMDAgKiBzbGlkZURpcmVjdGlvbiAtIHRoaXMuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlRGlmZiArICdweCcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmZhZGVPdXQodGhpcy5kb21Ob2Rlcy5pbWFnZSwgdGhpcy5vcHRpb25zLmZhZGVTcGVlZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpczQuaXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgIGlmICghX3RoaXM0LmlzQ2xvc2luZykge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBfdGhpczQucmVsYXRlZEVsZW1lbnRzW190aGlzNC5jdXJyZW50SW1hZ2VJbmRleF07XG5cbiAgICAgICAgICAgIF90aGlzNC5jdXJyZW50SW1hZ2Uuc2V0QXR0cmlidXRlKCdzcmMnLCBlbGVtZW50LmdldEF0dHJpYnV0ZShfdGhpczQub3B0aW9ucy5zb3VyY2VBdHRyKSk7XG5cbiAgICAgICAgICAgIGlmIChfdGhpczQubG9hZGVkSW1hZ2VzLmluZGV4T2YoZWxlbWVudC5nZXRBdHRyaWJ1dGUoX3RoaXM0Lm9wdGlvbnMuc291cmNlQXR0cikpID09PSAtMSkge1xuICAgICAgICAgICAgICBfdGhpczQuc2hvdyhfdGhpczQuZG9tTm9kZXMuc3Bpbm5lcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfdGhpczQuZG9tTm9kZXMuaW1hZ2UuY29udGFpbnMoX3RoaXM0LmRvbU5vZGVzLmNhcHRpb24pKSB7XG4gICAgICAgICAgICAgIF90aGlzNC5kb21Ob2Rlcy5pbWFnZS5yZW1vdmVDaGlsZChfdGhpczQuZG9tTm9kZXMuY2FwdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF90aGlzNC5hZGp1c3RJbWFnZShzbGlkZURpcmVjdGlvbik7XG5cbiAgICAgICAgICAgIGlmIChfdGhpczQub3B0aW9ucy5wcmVsb2FkaW5nKSBfdGhpczQucHJlbG9hZCgpO1xuICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXM0LmlzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGp1c3RJbWFnZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGp1c3RJbWFnZShkaXJlY3Rpb24pIHtcbiAgICAgIHZhciBfdGhpczUgPSB0aGlzO1xuXG4gICAgICBpZiAoIXRoaXMuY3VycmVudEltYWdlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRtcEltYWdlID0gbmV3IEltYWdlKCksXG4gICAgICAgICAgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAqIHRoaXMub3B0aW9ucy53aWR0aFJhdGlvLFxuICAgICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIHRoaXMub3B0aW9ucy5oZWlnaHRSYXRpbztcbiAgICAgIHRtcEltYWdlLnNldEF0dHJpYnV0ZSgnc3JjJywgdGhpcy5jdXJyZW50SW1hZ2UuZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZS5kYXRhc2V0LnNjYWxlID0gMTtcbiAgICAgIHRoaXMuY3VycmVudEltYWdlLmRhdGFzZXQudHJhbnNsYXRlWCA9IDA7XG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgdGhpcy56b29tUGFuRWxlbWVudCgwLCAwLCAxKTtcbiAgICAgIHRtcEltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIF90aGlzNS5yZWxhdGVkRWxlbWVudHNbX3RoaXM1LmN1cnJlbnRJbWFnZUluZGV4XS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnZXJyb3IuJyArIF90aGlzNS5ldmVudE5hbWVzcGFjZSkpO1xuXG4gICAgICAgIF90aGlzNS5pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICBfdGhpczUuaXNPcGVuID0gdHJ1ZTtcbiAgICAgICAgX3RoaXM1LmRvbU5vZGVzLnNwaW5uZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgdmFyIGRpcklzRGVmaW5lZCA9IGRpcmVjdGlvbiA9PT0gMSB8fCBkaXJlY3Rpb24gPT09IC0xO1xuXG4gICAgICAgIGlmIChfdGhpczUuaW5pdGlhbEltYWdlSW5kZXggPT09IF90aGlzNS5jdXJyZW50SW1hZ2VJbmRleCAmJiBkaXJJc0RlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXM1LmNsb3NlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXM1Lm9wdGlvbnMuYWxlcnRFcnJvcikge1xuICAgICAgICAgIGFsZXJ0KF90aGlzNS5vcHRpb25zLmFsZXJ0RXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzNS5sb2FkSW1hZ2UoZGlySXNEZWZpbmVkID8gZGlyZWN0aW9uIDogMSk7XG4gICAgICB9KTtcbiAgICAgIHRtcEltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBkaXJlY3Rpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgX3RoaXM1LnJlbGF0ZWRFbGVtZW50c1tfdGhpczUuY3VycmVudEltYWdlSW5kZXhdLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2VkLicgKyBfdGhpczUuZXZlbnROYW1lc3BhY2UpKTtcblxuICAgICAgICAgIF90aGlzNS5yZWxhdGVkRWxlbWVudHNbX3RoaXM1LmN1cnJlbnRJbWFnZUluZGV4XS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgoZGlyZWN0aW9uID09PSAxID8gJ25leHREb25lJyA6ICdwcmV2RG9uZScpICsgJy4nICsgX3RoaXM1LmV2ZW50TmFtZXNwYWNlKSk7XG4gICAgICAgIH0gLy8gaGlzdG9yeVxuXG5cbiAgICAgICAgaWYgKF90aGlzNS5vcHRpb25zLmhpc3RvcnkpIHtcbiAgICAgICAgICBfdGhpczUudXBkYXRlVVJMKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXM1LmxvYWRlZEltYWdlcy5pbmRleE9mKF90aGlzNS5jdXJyZW50SW1hZ2UuZ2V0QXR0cmlidXRlKCdzcmMnKSkgPT09IC0xKSB7XG4gICAgICAgICAgX3RoaXM1LmxvYWRlZEltYWdlcy5wdXNoKF90aGlzNS5jdXJyZW50SW1hZ2UuZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW1hZ2VXaWR0aCA9IGV2ZW50LnRhcmdldC53aWR0aCxcbiAgICAgICAgICAgIGltYWdlSGVpZ2h0ID0gZXZlbnQudGFyZ2V0LmhlaWdodDtcblxuICAgICAgICBpZiAoX3RoaXM1Lm9wdGlvbnMuc2NhbGVJbWFnZVRvUmF0aW8gfHwgaW1hZ2VXaWR0aCA+IHdpbmRvd1dpZHRoIHx8IGltYWdlSGVpZ2h0ID4gd2luZG93SGVpZ2h0KSB7XG4gICAgICAgICAgdmFyIHJhdGlvID0gaW1hZ2VXaWR0aCAvIGltYWdlSGVpZ2h0ID4gd2luZG93V2lkdGggLyB3aW5kb3dIZWlnaHQgPyBpbWFnZVdpZHRoIC8gd2luZG93V2lkdGggOiBpbWFnZUhlaWdodCAvIHdpbmRvd0hlaWdodDtcbiAgICAgICAgICBpbWFnZVdpZHRoIC89IHJhdGlvO1xuICAgICAgICAgIGltYWdlSGVpZ2h0IC89IHJhdGlvO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXM1LmRvbU5vZGVzLmltYWdlLnN0eWxlLnRvcCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLSBpbWFnZUhlaWdodCkgLyAyICsgJ3B4JztcbiAgICAgICAgX3RoaXM1LmRvbU5vZGVzLmltYWdlLnN0eWxlLmxlZnQgPSAod2luZG93LmlubmVyV2lkdGggLSBpbWFnZVdpZHRoIC0gX3RoaXM1Lmdsb2JhbFNjcm9sbGJhcldpZHRoKSAvIDIgKyAncHgnO1xuICAgICAgICBfdGhpczUuZG9tTm9kZXMuaW1hZ2Uuc3R5bGUud2lkdGggPSBpbWFnZVdpZHRoICsgJ3B4JztcbiAgICAgICAgX3RoaXM1LmRvbU5vZGVzLmltYWdlLnN0eWxlLmhlaWdodCA9IGltYWdlSGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgX3RoaXM1LmRvbU5vZGVzLnNwaW5uZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgICBpZiAoX3RoaXM1Lm9wdGlvbnMuZm9jdXMpIHtcbiAgICAgICAgICBfdGhpczUuZm9yY2VGb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXM1LmZhZGVJbihfdGhpczUuY3VycmVudEltYWdlLCBfdGhpczUub3B0aW9ucy5mYWRlU3BlZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoX3RoaXM1Lm9wdGlvbnMuZm9jdXMpIHtcbiAgICAgICAgICAgIF90aGlzNS5kb21Ob2Rlcy53cmFwcGVyLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBfdGhpczUuaXNPcGVuID0gdHJ1ZTtcbiAgICAgICAgdmFyIGNhcHRpb25Db250YWluZXIsIGNhcHRpb25UZXh0O1xuXG4gICAgICAgIGlmICh0eXBlb2YgX3RoaXM1Lm9wdGlvbnMuY2FwdGlvblNlbGVjdG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNhcHRpb25Db250YWluZXIgPSBfdGhpczUub3B0aW9ucy5jYXB0aW9uU2VsZWN0b3IgPT09ICdzZWxmJyA/IF90aGlzNS5yZWxhdGVkRWxlbWVudHNbX3RoaXM1LmN1cnJlbnRJbWFnZUluZGV4XSA6IF90aGlzNS5yZWxhdGVkRWxlbWVudHNbX3RoaXM1LmN1cnJlbnRJbWFnZUluZGV4XS5xdWVyeVNlbGVjdG9yKF90aGlzNS5vcHRpb25zLmNhcHRpb25TZWxlY3Rvcik7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIF90aGlzNS5vcHRpb25zLmNhcHRpb25TZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNhcHRpb25Db250YWluZXIgPSBfdGhpczUub3B0aW9ucy5jYXB0aW9uU2VsZWN0b3IoX3RoaXM1LnJlbGF0ZWRFbGVtZW50c1tfdGhpczUuY3VycmVudEltYWdlSW5kZXhdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfdGhpczUub3B0aW9ucy5jYXB0aW9ucyAmJiBjYXB0aW9uQ29udGFpbmVyKSB7XG4gICAgICAgICAgaWYgKF90aGlzNS5vcHRpb25zLmNhcHRpb25UeXBlID09PSAnZGF0YScpIHtcbiAgICAgICAgICAgIGNhcHRpb25UZXh0ID0gY2FwdGlvbkNvbnRhaW5lci5kYXRhc2V0W190aGlzNS5vcHRpb25zLmNhcHRpb25zRGF0YV07XG4gICAgICAgICAgfSBlbHNlIGlmIChfdGhpczUub3B0aW9ucy5jYXB0aW9uVHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBjYXB0aW9uVGV4dCA9IGNhcHRpb25Db250YWluZXIuaW5uZXJIVE1MO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYXB0aW9uVGV4dCA9IGNhcHRpb25Db250YWluZXIuZ2V0QXR0cmlidXRlKF90aGlzNS5vcHRpb25zLmNhcHRpb25zRGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFfdGhpczUub3B0aW9ucy5sb29wKSB7XG4gICAgICAgICAgaWYgKF90aGlzNS5jdXJyZW50SW1hZ2VJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgX3RoaXM1LmhpZGUoX3RoaXM1LmRvbU5vZGVzLm5hdmlnYXRpb24ucXVlcnlTZWxlY3RvcignLnNsLXByZXYnKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKF90aGlzNS5jdXJyZW50SW1hZ2VJbmRleCA+PSBfdGhpczUucmVsYXRlZEVsZW1lbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIF90aGlzNS5oaWRlKF90aGlzNS5kb21Ob2Rlcy5uYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zbC1uZXh0JykpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChfdGhpczUuY3VycmVudEltYWdlSW5kZXggPiAwKSB7XG4gICAgICAgICAgICBfdGhpczUuc2hvdyhfdGhpczUuZG9tTm9kZXMubmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2wtcHJldicpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoX3RoaXM1LmN1cnJlbnRJbWFnZUluZGV4IDwgX3RoaXM1LnJlbGF0ZWRFbGVtZW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBfdGhpczUuc2hvdyhfdGhpczUuZG9tTm9kZXMubmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2wtbmV4dCcpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKF90aGlzNS5yZWxhdGVkRWxlbWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBfdGhpczUuaGlkZShfdGhpczUuZG9tTm9kZXMubmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2wtcHJldiwgLnNsLW5leHQnKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90aGlzNS5zaG93KF90aGlzNS5kb21Ob2Rlcy5uYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbC1wcmV2LCAuc2wtbmV4dCcpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAxIHx8IGRpcmVjdGlvbiA9PT0gLTEpIHtcbiAgICAgICAgICBpZiAoX3RoaXM1Lm9wdGlvbnMuYW5pbWF0aW9uU2xpZGUpIHtcbiAgICAgICAgICAgIF90aGlzNS5zbGlkZSgwLCAxMDAgKiBkaXJlY3Rpb24gKyAncHgnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIF90aGlzNS5zbGlkZShfdGhpczUub3B0aW9ucy5hbmltYXRpb25TcGVlZCAvIDEwMDAsIDAgKyAncHgnKTtcbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfdGhpczUuZmFkZUluKF90aGlzNS5kb21Ob2Rlcy5pbWFnZSwgX3RoaXM1Lm9wdGlvbnMuZmFkZVNwZWVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczUuaXNBbmltYXRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgX3RoaXM1LnNldENhcHRpb24oY2FwdGlvblRleHQsIGltYWdlV2lkdGgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzNS5pc0FuaW1hdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgX3RoaXM1LnNldENhcHRpb24oY2FwdGlvblRleHQsIGltYWdlV2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF90aGlzNS5vcHRpb25zLmFkZGl0aW9uYWxIdG1sICYmICFfdGhpczUuZG9tTm9kZXMuYWRkaXRpb25hbEh0bWwpIHtcbiAgICAgICAgICBfdGhpczUuZG9tTm9kZXMuYWRkaXRpb25hbEh0bWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICAgIF90aGlzNS5kb21Ob2Rlcy5hZGRpdGlvbmFsSHRtbC5jbGFzc0xpc3QuYWRkKCdzbC1hZGRpdGlvbmFsLWh0bWwnKTtcblxuICAgICAgICAgIF90aGlzNS5kb21Ob2Rlcy5hZGRpdGlvbmFsSHRtbC5pbm5lckhUTUwgPSBfdGhpczUub3B0aW9ucy5hZGRpdGlvbmFsSHRtbDtcblxuICAgICAgICAgIF90aGlzNS5kb21Ob2Rlcy5pbWFnZS5hcHBlbmRDaGlsZChfdGhpczUuZG9tTm9kZXMuYWRkaXRpb25hbEh0bWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiem9vbVBhbkVsZW1lbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gem9vbVBhbkVsZW1lbnQodGFyZ2V0T2Zmc2V0WCwgdGFyZ2V0T2Zmc2V0WSwgdGFyZ2V0U2NhbGUpIHtcbiAgICAgIHRoaXMuY3VycmVudEltYWdlLnN0eWxlW3RoaXMudHJhbnNpdGlvblByZWZpeCArICd0cmFuc2Zvcm0nXSA9ICd0cmFuc2xhdGUoJyArIHRhcmdldE9mZnNldFggKyAnLCcgKyB0YXJnZXRPZmZzZXRZICsgJykgc2NhbGUoJyArIHRhcmdldFNjYWxlICsgJyknO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtaW5NYXhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWluTWF4KHZhbHVlLCBtaW4sIG1heCkge1xuICAgICAgcmV0dXJuIHZhbHVlIDwgbWluID8gbWluIDogdmFsdWUgPiBtYXggPyBtYXggOiB2YWx1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0Wm9vbURhdGFcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0Wm9vbURhdGEoaW5pdGlhbFNjYWxlLCB0YXJnZXRPZmZzZXRYLCB0YXJnZXRPZmZzZXRZKSB7XG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZS5kYXRhc2V0LnNjYWxlID0gaW5pdGlhbFNjYWxlO1xuICAgICAgdGhpcy5jdXJyZW50SW1hZ2UuZGF0YXNldC50cmFuc2xhdGVYID0gdGFyZ2V0T2Zmc2V0WDtcbiAgICAgIHRoaXMuY3VycmVudEltYWdlLmRhdGFzZXQudHJhbnNsYXRlWSA9IHRhcmdldE9mZnNldFk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhc2hjaGFuZ2VIYW5kbGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhc2hjaGFuZ2VIYW5kbGVyKCkge1xuICAgICAgaWYgKHRoaXMuaXNPcGVuICYmIHRoaXMuaGFzaCA9PT0gdGhpcy5pbml0aWFsTG9jYXRpb25IYXNoKSB7XG4gICAgICAgIHRoaXMuaGFzaFJlc2V0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZEV2ZW50c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRFdmVudHMoKSB7XG4gICAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgICAgLy8gcmVzaXplL3Jlc3BvbnNpdmVcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdyZXNpemUuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvL3RoaXMuYWRqdXN0SW1hZ2UuYmluZCh0aGlzKVxuICAgICAgICBpZiAoX3RoaXM2LmlzT3Blbikge1xuICAgICAgICAgIF90aGlzNi5hZGp1c3RJbWFnZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmRvbU5vZGVzLmNsb3NlQnV0dG9uLCBbJ2NsaWNrLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlLCAndG91Y2hzdGFydC4nICsgdGhpcy5ldmVudE5hbWVzcGFjZV0sIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGlzdG9yeSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpczYuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdoYXNoY2hhbmdlLicgKyBfdGhpczYuZXZlbnROYW1lc3BhY2UsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKF90aGlzNi5pc09wZW4pIHtcbiAgICAgICAgICAgICAgX3RoaXM2Lmhhc2hjaGFuZ2VIYW5kbGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIDQwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHRoaXMuZG9tTm9kZXMubmF2aWdhdGlvbi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYnV0dG9uJyksICdjbGljay4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICghZXZlbnQuY3VycmVudFRhcmdldC50YWdOYW1lLm1hdGNoKC9idXR0b24vaSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVEaWZmID0gMDtcblxuICAgICAgICBfdGhpczYubG9hZEltYWdlKGV2ZW50LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbC1uZXh0JykgPyAxIDogLTEpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2Nyb2xsWm9vbSkge1xuICAgICAgICB2YXIgc2NhbGUgPSAxO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5kb21Ob2Rlcy5pbWFnZSwgWydtb3VzZXdoZWVsJywgJ0RPTU1vdXNlU2Nyb2xsJ10sIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLm1vdXNlZG93biB8fCBfdGhpczYuaXNBbmltYXRpbmcgfHwgX3RoaXM2LmlzQ2xvc2luZyB8fCAhX3RoaXM2LmlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVySGVpZ2h0ID09IDApIHtcbiAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVySGVpZ2h0ID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmRvbU5vZGVzLmltYWdlKS5oZWlnaHQ7XG4gICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lcldpZHRoID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmRvbU5vZGVzLmltYWdlKS53aWR0aDtcbiAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nSGVpZ2h0ID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmN1cnJlbnRJbWFnZSkuaGVpZ2h0O1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWdXaWR0aCA9IF90aGlzNi5nZXREaW1lbnNpb25zKF90aGlzNi5jdXJyZW50SW1hZ2UpLndpZHRoO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRYID0gX3RoaXM2LmRvbU5vZGVzLmltYWdlLm9mZnNldExlZnQ7XG4gICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lck9mZnNldFkgPSBfdGhpczYuZG9tTm9kZXMuaW1hZ2Uub2Zmc2V0VG9wO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WCA9IHBhcnNlRmxvYXQoX3RoaXM2LmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVgpO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WSA9IHBhcnNlRmxvYXQoX3RoaXM2LmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdmFyIGRlbHRhID0gZXZlbnQuZGVsdGEgfHwgZXZlbnQud2hlZWxEZWx0YTtcblxuICAgICAgICAgIGlmIChkZWx0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvL3dlIGFyZSBvbiBmaXJlZm94XG4gICAgICAgICAgICBkZWx0YSA9IGV2ZW50LmRldGFpbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkZWx0YSA9IE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCBkZWx0YSkpOyAvLyBjYXAgdGhlIGRlbHRhIHRvIFstMSwxXSBmb3IgY3Jvc3MgYnJvd3NlciBjb25zaXN0ZW5jeVxuICAgICAgICAgIC8vIGFwcGx5IHpvb21cblxuICAgICAgICAgIHNjYWxlICs9IGRlbHRhICogX3RoaXM2Lm9wdGlvbnMuc2Nyb2xsWm9vbUZhY3RvciAqIHNjYWxlO1xuICAgICAgICAgIHNjYWxlID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oX3RoaXM2Lm9wdGlvbnMubWF4Wm9vbSwgc2NhbGUpKTtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlID0gc2NhbGU7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5waW5jaE9mZnNldFggPSBldmVudC5wYWdlWDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBpbmNoT2Zmc2V0WSA9IGV2ZW50LnBhZ2VZO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRYID0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nV2lkdGggKiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCkgLyAyO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRZID0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nSGVpZ2h0ICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVySGVpZ2h0KSAvIDI7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zY2FsZURpZmZlcmVuY2UgPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsU2NhbGU7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWdXaWR0aCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgPD0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCA/IDAgOiBfdGhpczYubWluTWF4KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFggLSAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5waW5jaE9mZnNldFggLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lck9mZnNldFggLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lcldpZHRoIC8gMiAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFgpIC8gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnNjYWxlRGlmZmVyZW5jZSkgKiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnNjYWxlRGlmZmVyZW5jZSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFggKiAtMSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFgpO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nSGVpZ2h0ICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSA8PSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lckhlaWdodCA/IDAgOiBfdGhpczYubWluTWF4KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFkgLSAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5waW5jaE9mZnNldFkgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lck9mZnNldFkgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lckhlaWdodCAvIDIgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRZKSAvIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zY2FsZURpZmZlcmVuY2UpICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zY2FsZURpZmZlcmVuY2UsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRZICogLTEsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRZKTtcblxuICAgICAgICAgIF90aGlzNi56b29tUGFuRWxlbWVudChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFggKyBcInB4XCIsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WSArIFwicHhcIiwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSk7XG5cbiAgICAgICAgICBpZiAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSA+IDEpIHtcbiAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuem9vbWVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKCFfdGhpczYuZG9tTm9kZXMuY2FwdGlvbi5zdHlsZS5vcGFjaXR5ICYmIF90aGlzNi5kb21Ob2Rlcy5jYXB0aW9uLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJykge1xuICAgICAgICAgICAgICBfdGhpczYuZmFkZU91dChfdGhpczYuZG9tTm9kZXMuY2FwdGlvbiwgX3RoaXM2Lm9wdGlvbnMuZmFkZVNwZWVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlID09PSAxKSB7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuem9vbWVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgaWYgKF90aGlzNi5kb21Ob2Rlcy5jYXB0aW9uLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJykge1xuICAgICAgICAgICAgICAgIF90aGlzNi5mYWRlSW4oX3RoaXM2LmRvbU5vZGVzLmNhcHRpb24sIF90aGlzNi5vcHRpb25zLmZhZGVTcGVlZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUGluY2hEaXN0YW5jZSA9IG51bGw7XG4gICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNhcHR1cmUgPSBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQaW5jaERpc3RhbmNlID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRQaW5jaERpc3RhbmNlO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZTtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRYID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFkgPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFk7XG5cbiAgICAgICAgICBfdGhpczYuc2V0Wm9vbURhdGEoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFkpO1xuXG4gICAgICAgICAgX3RoaXM2Lnpvb21QYW5FbGVtZW50KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WCArIFwicHhcIiwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZICsgXCJweFwiLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmRvbU5vZGVzLmltYWdlLCBbJ3RvdWNoc3RhcnQuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdtb3VzZWRvd24uJyArIHRoaXMuZXZlbnROYW1lc3BhY2VdLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lID09PSAnQScgJiYgZXZlbnQudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRYID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WSA9IGV2ZW50LmNsaWVudFk7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJIZWlnaHQgPSBfdGhpczYuZ2V0RGltZW5zaW9ucyhfdGhpczYuZG9tTm9kZXMuaW1hZ2UpLmhlaWdodDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lcldpZHRoID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmRvbU5vZGVzLmltYWdlKS53aWR0aDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ0hlaWdodCA9IF90aGlzNi5nZXREaW1lbnNpb25zKF90aGlzNi5jdXJyZW50SW1hZ2UpLmhlaWdodDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ1dpZHRoID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmN1cnJlbnRJbWFnZSkud2lkdGg7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRYID0gX3RoaXM2LmRvbU5vZGVzLmltYWdlLm9mZnNldExlZnQ7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRZID0gX3RoaXM2LmRvbU5vZGVzLmltYWdlLm9mZnNldFRvcDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRYID0gcGFyc2VGbG9hdChfdGhpczYuY3VycmVudEltYWdlLmRhdGFzZXQudHJhbnNsYXRlWCk7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WSA9IHBhcnNlRmxvYXQoX3RoaXM2LmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVkpO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY2FwdHVyZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50b3VjaENvdW50ID0gZXZlbnQudG91Y2hlcy5sZW5ndGg7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFkgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFk7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJIZWlnaHQgPSBfdGhpczYuZ2V0RGltZW5zaW9ucyhfdGhpczYuZG9tTm9kZXMuaW1hZ2UpLmhlaWdodDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lcldpZHRoID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmRvbU5vZGVzLmltYWdlKS53aWR0aDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ0hlaWdodCA9IF90aGlzNi5nZXREaW1lbnNpb25zKF90aGlzNi5jdXJyZW50SW1hZ2UpLmhlaWdodDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ1dpZHRoID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmN1cnJlbnRJbWFnZSkud2lkdGg7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRYID0gX3RoaXM2LmRvbU5vZGVzLmltYWdlLm9mZnNldExlZnQ7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRZID0gX3RoaXM2LmRvbU5vZGVzLmltYWdlLm9mZnNldFRvcDtcblxuICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRvdWNoQ291bnQgPT09IDEpXG4gICAgICAgICAgICAvKiBTaW5nbGUgdG91Y2ggKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWYgKCFfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmRvdWJsZVRhcHBlZCkge1xuICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuZG91YmxlVGFwcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuZG91YmxlVGFwcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpczYuY3VycmVudEltYWdlLmNsYXNzTGlzdC5hZGQoJ3NsLXRyYW5zaXRpb24nKTtcblxuICAgICAgICAgICAgICAgIGlmICghX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy56b29tZWQpIHtcbiAgICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlID0gX3RoaXM2Lm9wdGlvbnMuZG91YmxlVGFwWm9vbTtcblxuICAgICAgICAgICAgICAgICAgX3RoaXM2LnNldFpvb21EYXRhKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlLCAwLCAwKTtcblxuICAgICAgICAgICAgICAgICAgX3RoaXM2Lnpvb21QYW5FbGVtZW50KDAgKyBcInB4XCIsIDAgKyBcInB4XCIsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlKTtcblxuICAgICAgICAgICAgICAgICAgaWYgKCFfdGhpczYuZG9tTm9kZXMuY2FwdGlvbi5zdHlsZS5vcGFjaXR5ICYmIF90aGlzNi5kb21Ob2Rlcy5jYXB0aW9uLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczYuZmFkZU91dChfdGhpczYuZG9tTm9kZXMuY2FwdGlvbiwgX3RoaXM2Lm9wdGlvbnMuZmFkZVNwZWVkKTtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy56b29tZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSA9IDE7XG5cbiAgICAgICAgICAgICAgICAgIF90aGlzNi5zZXRab29tRGF0YShfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSwgMCwgMCk7XG5cbiAgICAgICAgICAgICAgICAgIF90aGlzNi56b29tUGFuRWxlbWVudCgwICsgXCJweFwiLCAwICsgXCJweFwiLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSk7XG5cbiAgICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuem9vbWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoX3RoaXM2LmN1cnJlbnRJbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczYuY3VycmVudEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3NsLXRyYW5zaXRpb24nKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFggPSBwYXJzZUZsb2F0KF90aGlzNi5jdXJyZW50SW1hZ2UuZGF0YXNldC50cmFuc2xhdGVYKTtcbiAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WSA9IHBhcnNlRmxvYXQoX3RoaXM2LmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRvdWNoQ291bnQgPT09IDIpXG4gICAgICAgICAgICAvKiBQaW5jaCAqL1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WDIgPSBldmVudC50b3VjaGVzWzFdLmNsaWVudFg7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRZMiA9IGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WTtcbiAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WCA9IHBhcnNlRmxvYXQoX3RoaXM2LmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVgpO1xuICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRZID0gcGFyc2VGbG9hdChfdGhpczYuY3VycmVudEltYWdlLmRhdGFzZXQudHJhbnNsYXRlWSk7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucGluY2hPZmZzZXRYID0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRYICsgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFgyKSAvIDI7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucGluY2hPZmZzZXRZID0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRZICsgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFkyKSAvIDI7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBpbmNoRGlzdGFuY2UgPSBNYXRoLnNxcnQoKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRYIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFgyKSAqIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WCAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRYMikgKyAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFkgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WTIpICogKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRZIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFkyKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNhcHR1cmUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubW91c2Vkb3duKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICBpZiAoX3RoaXM2LnRyYW5zaXRpb25DYXBhYmxlKSB7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWFnZUxlZnQgPSBwYXJzZUludChfdGhpczYuZG9tTm9kZXMuaW1hZ2Uuc3R5bGUubGVmdCwgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5tb3VzZWRvd24gPSB0cnVlO1xuICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlRGlmZiA9IDA7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVZRGlmZiA9IDA7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVTdGFydCA9IGV2ZW50LnBhZ2VYIHx8IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVZU3RhcnQgPSBldmVudC5wYWdlWSB8fCBldmVudC50b3VjaGVzWzBdLnBhZ2VZO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmRvbU5vZGVzLmltYWdlLCBbJ3RvdWNobW92ZS4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgJ21vdXNlbW92ZS4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgJ01TUG9pbnRlck1vdmUnXSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICghX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5tb3VzZWRvd24pIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC50eXBlID09PSAndG91Y2htb3ZlJykge1xuICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNhcHR1cmUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBvaW50ZXJPZmZzZXRZID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudG91Y2hDb3VudCA9IGV2ZW50LnRvdWNoZXMubGVuZ3RoO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudG91Y2htb3ZlQ291bnQrKztcblxuICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRvdWNoQ291bnQgPiAxKVxuICAgICAgICAgICAgLyogUGluY2ggKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WDIgPSBldmVudC50b3VjaGVzWzFdLmNsaWVudFg7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFkyID0gZXZlbnQudG91Y2hlc1sxXS5jbGllbnRZO1xuICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFBpbmNoRGlzdGFuY2UgPSBNYXRoLnNxcnQoKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFggLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBvaW50ZXJPZmZzZXRYMikgKiAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WCAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFgyKSArIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBvaW50ZXJPZmZzZXRZIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WTIpICogKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFkgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBvaW50ZXJPZmZzZXRZMikpO1xuXG4gICAgICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQaW5jaERpc3RhbmNlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUGluY2hEaXN0YW5jZSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0UGluY2hEaXN0YW5jZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChNYXRoLmFicyhfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQaW5jaERpc3RhbmNlIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRQaW5jaERpc3RhbmNlKSA+PSAxKSB7XG4gICAgICAgICAgICAgICAgLyogSW5pdGlhbGl6ZSBoZWxwZXJzICovXG4gICAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSA9IF90aGlzNi5taW5NYXgoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRQaW5jaERpc3RhbmNlIC8gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUGluY2hEaXN0YW5jZSAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlLCAxLCBfdGhpczYub3B0aW9ucy5tYXhab29tKTtcbiAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WCA9IChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ1dpZHRoICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVyV2lkdGgpIC8gMjtcbiAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WSA9IChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ0hlaWdodCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lckhlaWdodCkgLyAyO1xuICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc2NhbGVEaWZmZXJlbmNlID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlO1xuICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WCA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nV2lkdGggKiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIDw9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVyV2lkdGggPyAwIDogX3RoaXM2Lm1pbk1heChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRYIC0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucGluY2hPZmZzZXRYIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRYIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCAvIDIgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRYKSAvIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zY2FsZURpZmZlcmVuY2UpICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zY2FsZURpZmZlcmVuY2UsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRYICogLTEsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRYKTtcbiAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFkgPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ0hlaWdodCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgPD0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJIZWlnaHQgPyAwIDogX3RoaXM2Lm1pbk1heChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRZIC0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucGluY2hPZmZzZXRZIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRZIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJIZWlnaHQgLyAyIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WSkgLyAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc2NhbGVEaWZmZXJlbmNlKSAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc2NhbGVEaWZmZXJlbmNlLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WSAqIC0xLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WSk7XG5cbiAgICAgICAgICAgICAgICBfdGhpczYuem9vbVBhbkVsZW1lbnQoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYICsgXCJweFwiLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFkgKyBcInB4XCIsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnpvb21lZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgIGlmICghX3RoaXM2LmRvbU5vZGVzLmNhcHRpb24uc3R5bGUub3BhY2l0eSAmJiBfdGhpczYuZG9tTm9kZXMuY2FwdGlvbi5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXM2LmZhZGVPdXQoX3RoaXM2LmRvbU5vZGVzLmNhcHRpb24sIF90aGlzNi5vcHRpb25zLmZhZGVTcGVlZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUGluY2hEaXN0YW5jZSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0UGluY2hEaXN0YW5jZTtcbiAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGU7XG4gICAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WCA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WDtcbiAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRZID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFggPSAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWdXaWR0aCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lcldpZHRoKSAvIDI7XG4gICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WSA9IChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ0hlaWdodCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lckhlaWdodCkgLyAyO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWdXaWR0aCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgPD0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCA/IDAgOiBfdGhpczYubWluTWF4KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFggLSAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFggLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRYKSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFggKiAtMSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFgpO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWdIZWlnaHQgKiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIDw9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVySGVpZ2h0ID8gMCA6IF90aGlzNi5taW5NYXgoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WSAtIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WSAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFkpLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WSAqIC0xLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WSk7XG5cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFgpID09PSBNYXRoLmFicyhfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WCkpIHtcbiAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WCA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WDtcbiAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFggPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBvaW50ZXJPZmZzZXRYO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZKSA9PT0gTWF0aC5hYnMoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFkpKSB7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFkgPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFk7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRZID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3RoaXM2LnNldFpvb21EYXRhKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFgsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WSk7XG5cbiAgICAgICAgICAgIF90aGlzNi56b29tUGFuRWxlbWVudChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFggKyBcInB4XCIsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WSArIFwicHhcIiwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qIE1vdXNlIE1vdmUgaW1wbGVtZW50YXRpb24gKi9cblxuXG4gICAgICAgIGlmIChldmVudC50eXBlID09PSAnbW91c2Vtb3ZlJyAmJiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLm1vdXNlZG93bikge1xuICAgICAgICAgIGlmIChldmVudC50eXBlID09ICd0b3VjaG1vdmUnKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNhcHR1cmUgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WSA9IGV2ZW50LmNsaWVudFk7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRYID0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nV2lkdGggKiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCkgLyAyO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRZID0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nSGVpZ2h0ICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVySGVpZ2h0KSAvIDI7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWdXaWR0aCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgPD0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCA/IDAgOiBfdGhpczYubWluTWF4KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFggLSAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFggLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRYKSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFggKiAtMSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFgpO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nSGVpZ2h0ICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSA8PSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lckhlaWdodCA/IDAgOiBfdGhpczYubWluTWF4KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFkgLSAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFkgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRZKSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFkgKiAtMSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFkpO1xuXG4gICAgICAgICAgaWYgKE1hdGguYWJzKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WCkgPT09IE1hdGguYWJzKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRYKSkge1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WCA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WDtcbiAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRYID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoTWF0aC5hYnMoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZKSA9PT0gTWF0aC5hYnMoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFkpKSB7XG4gICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRZID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFkgPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBvaW50ZXJPZmZzZXRZO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF90aGlzNi5zZXRab29tRGF0YShfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFkpO1xuXG4gICAgICAgICAgX3RoaXM2Lnpvb21QYW5FbGVtZW50KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WCArIFwicHhcIiwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZICsgXCJweFwiLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy56b29tZWQpIHtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlRW5kID0gZXZlbnQucGFnZVggfHwgZXZlbnQudG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlWUVuZCA9IGV2ZW50LnBhZ2VZIHx8IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVk7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zd2lwZURpZmYgPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlU3RhcnQgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlRW5kO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVZRGlmZiA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVZU3RhcnQgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlWUVuZDtcblxuICAgICAgICAgIGlmIChfdGhpczYub3B0aW9ucy5hbmltYXRpb25TbGlkZSkge1xuICAgICAgICAgICAgX3RoaXM2LnNsaWRlKDAsIC1fdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlRGlmZiArICdweCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5kb21Ob2Rlcy5pbWFnZSwgWyd0b3VjaGVuZC4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgJ21vdXNldXAuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICd0b3VjaGNhbmNlbC4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgJ21vdXNlbGVhdmUuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdwb2ludGVydXAnLCAncG9pbnRlcmNhbmNlbCcsICdNU1BvaW50ZXJVcCcsICdNU1BvaW50ZXJDYW5jZWwnXSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChfdGhpczYuaXNUb3VjaERldmljZSAmJiBldmVudC50eXBlID09PSAndG91Y2hlbmQnKSB7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50b3VjaENvdW50ID0gZXZlbnQudG91Y2hlcy5sZW5ndGg7XG5cbiAgICAgICAgICBpZiAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50b3VjaENvdW50ID09PSAwKVxuICAgICAgICAgICAgLyogTm8gdG91Y2ggKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLyogU2V0IGF0dHJpYnV0ZXMgKi9cbiAgICAgICAgICAgICAgaWYgKF90aGlzNi5jdXJyZW50SW1hZ2UpIHtcbiAgICAgICAgICAgICAgICBfdGhpczYuc2V0Wm9vbURhdGEoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsU2NhbGUsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WCwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuem9vbWVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoX3RoaXM2LmRvbU5vZGVzLmNhcHRpb24uc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgICAgICBfdGhpczYuZmFkZUluKF90aGlzNi5kb21Ob2Rlcy5jYXB0aW9uLCBfdGhpczYub3B0aW9ucy5mYWRlU3BlZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBpbmNoRGlzdGFuY2UgPSBudWxsO1xuICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNhcHR1cmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50b3VjaENvdW50ID09PSAxKVxuICAgICAgICAgICAgLyogU2luZ2xlIHRvdWNoICovXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRYID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WSA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50b3VjaENvdW50ID4gMSlcbiAgICAgICAgICAgIC8qIFBpbmNoICovXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBpbmNoRGlzdGFuY2UgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubW91c2Vkb3duKSB7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5tb3VzZWRvd24gPSBmYWxzZTtcbiAgICAgICAgICB2YXIgcG9zc2libGVEaXIgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKCFfdGhpczYub3B0aW9ucy5sb29wKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXM2LmN1cnJlbnRJbWFnZUluZGV4ID09PSAwICYmIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVEaWZmIDwgMCkge1xuICAgICAgICAgICAgICBwb3NzaWJsZURpciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3RoaXM2LmN1cnJlbnRJbWFnZUluZGV4ID49IF90aGlzNi5yZWxhdGVkRWxlbWVudHMubGVuZ3RoIC0gMSAmJiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlRGlmZiA+IDApIHtcbiAgICAgICAgICAgICAgcG9zc2libGVEaXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoTWF0aC5hYnMoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zd2lwZURpZmYpID4gX3RoaXM2Lm9wdGlvbnMuc3dpcGVUb2xlcmFuY2UgJiYgcG9zc2libGVEaXIpIHtcbiAgICAgICAgICAgIF90aGlzNi5sb2FkSW1hZ2UoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zd2lwZURpZmYgPiAwID8gMSA6IC0xKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKF90aGlzNi5vcHRpb25zLmFuaW1hdGlvblNsaWRlKSB7XG4gICAgICAgICAgICBfdGhpczYuc2xpZGUoX3RoaXM2Lm9wdGlvbnMuYW5pbWF0aW9uU3BlZWQgLyAxMDAwLCAwICsgJ3B4Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKF90aGlzNi5vcHRpb25zLnN3aXBlQ2xvc2UgJiYgTWF0aC5hYnMoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zd2lwZVlEaWZmKSA+IDUwICYmIE1hdGguYWJzKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVEaWZmKSA8IF90aGlzNi5vcHRpb25zLnN3aXBlVG9sZXJhbmNlKSB7XG4gICAgICAgICAgICBfdGhpczYuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHRoaXMuZG9tTm9kZXMuaW1hZ2UsIFsnZGJsY2xpY2snXSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChfdGhpczYuaXNUb3VjaERldmljZSkgcmV0dXJuO1xuICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRZID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJIZWlnaHQgPSBfdGhpczYuZ2V0RGltZW5zaW9ucyhfdGhpczYuZG9tTm9kZXMuaW1hZ2UpLmhlaWdodDtcbiAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCA9IF90aGlzNi5nZXREaW1lbnNpb25zKF90aGlzNi5kb21Ob2Rlcy5pbWFnZSkud2lkdGg7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nSGVpZ2h0ID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmN1cnJlbnRJbWFnZSkuaGVpZ2h0O1xuICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ1dpZHRoID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmN1cnJlbnRJbWFnZSkud2lkdGg7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVyT2Zmc2V0WCA9IF90aGlzNi5kb21Ob2Rlcy5pbWFnZS5vZmZzZXRMZWZ0O1xuICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lck9mZnNldFkgPSBfdGhpczYuZG9tTm9kZXMuaW1hZ2Uub2Zmc2V0VG9wO1xuXG4gICAgICAgIF90aGlzNi5jdXJyZW50SW1hZ2UuY2xhc3NMaXN0LmFkZCgnc2wtdHJhbnNpdGlvbicpO1xuXG4gICAgICAgIGlmICghX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy56b29tZWQpIHtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSA9IF90aGlzNi5vcHRpb25zLmRvdWJsZVRhcFpvb207XG5cbiAgICAgICAgICBfdGhpczYuc2V0Wm9vbURhdGEoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsU2NhbGUsIDAsIDApO1xuXG4gICAgICAgICAgX3RoaXM2Lnpvb21QYW5FbGVtZW50KDAgKyBcInB4XCIsIDAgKyBcInB4XCIsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlKTtcblxuICAgICAgICAgIGlmICghX3RoaXM2LmRvbU5vZGVzLmNhcHRpb24uc3R5bGUub3BhY2l0eSAmJiBfdGhpczYuZG9tTm9kZXMuY2FwdGlvbi5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcbiAgICAgICAgICAgIF90aGlzNi5mYWRlT3V0KF90aGlzNi5kb21Ob2Rlcy5jYXB0aW9uLCBfdGhpczYub3B0aW9ucy5mYWRlU3BlZWQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuem9vbWVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSA9IDE7XG5cbiAgICAgICAgICBfdGhpczYuc2V0Wm9vbURhdGEoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsU2NhbGUsIDAsIDApO1xuXG4gICAgICAgICAgX3RoaXM2Lnpvb21QYW5FbGVtZW50KDAgKyBcInB4XCIsIDAgKyBcInB4XCIsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlKTtcblxuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuem9vbWVkID0gZmFsc2U7XG5cbiAgICAgICAgICBpZiAoX3RoaXM2LmRvbU5vZGVzLmNhcHRpb24uc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICAgICAgICBfdGhpczYuZmFkZUluKF90aGlzNi5kb21Ob2Rlcy5jYXB0aW9uLCBfdGhpczYub3B0aW9ucy5mYWRlU3BlZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChfdGhpczYuY3VycmVudEltYWdlKSB7XG4gICAgICAgICAgICBfdGhpczYuY3VycmVudEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3NsLXRyYW5zaXRpb24nKTtcblxuICAgICAgICAgICAgX3RoaXM2LmN1cnJlbnRJbWFnZS5zdHlsZVtfdGhpczYudHJhbnNpdGlvblByZWZpeCArICd0cmFuc2Zvcm0tb3JpZ2luJ10gPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jYXB0dXJlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldERpbWVuc2lvbnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RGltZW5zaW9ucyhlbGVtZW50KSB7XG4gICAgICB2YXIgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCksXG4gICAgICAgICAgaGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgd2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoLFxuICAgICAgICAgIGJvcmRlclRvcFdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyVG9wV2lkdGgpLFxuICAgICAgICAgIGJvcmRlckJvdHRvbVdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyQm90dG9tV2lkdGgpLFxuICAgICAgICAgIHBhZGRpbmdUb3AgPSBwYXJzZUZsb2F0KHN0eWxlcy5wYWRkaW5nVG9wKSxcbiAgICAgICAgICBwYWRkaW5nQm90dG9tID0gcGFyc2VGbG9hdChzdHlsZXMucGFkZGluZ0JvdHRvbSksXG4gICAgICAgICAgYm9yZGVyTGVmdFdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyTGVmdFdpZHRoKSxcbiAgICAgICAgICBib3JkZXJSaWdodFdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyUmlnaHRXaWR0aCksXG4gICAgICAgICAgcGFkZGluZ0xlZnQgPSBwYXJzZUZsb2F0KHN0eWxlcy5wYWRkaW5nTGVmdCksXG4gICAgICAgICAgcGFkZGluZ1JpZ2h0ID0gcGFyc2VGbG9hdChzdHlsZXMucGFkZGluZ1JpZ2h0KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlaWdodDogaGVpZ2h0IC0gYm9yZGVyQm90dG9tV2lkdGggLSBib3JkZXJUb3BXaWR0aCAtIHBhZGRpbmdUb3AgLSBwYWRkaW5nQm90dG9tLFxuICAgICAgICB3aWR0aDogd2lkdGggLSBib3JkZXJMZWZ0V2lkdGggLSBib3JkZXJSaWdodFdpZHRoIC0gcGFkZGluZ0xlZnQgLSBwYWRkaW5nUmlnaHRcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZUhhc2hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlSGFzaCgpIHtcbiAgICAgIHZhciBuZXdIYXNoID0gJ3BpZD0nICsgKHRoaXMuY3VycmVudEltYWdlSW5kZXggKyAxKSxcbiAgICAgICAgICBuZXdVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdICsgJyMnICsgbmV3SGFzaDtcbiAgICAgIHRoaXMuaGFzaFJlc2V0ZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMucHVzaFN0YXRlU3VwcG9ydCkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeVt0aGlzLmhpc3RvcnlIYXNDaGFuZ2VzID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJ10oJycsIGRvY3VtZW50LnRpdGxlLCBuZXdVUkwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gd2hhdCBpcyB0aGUgYnJvd3NlciB0YXJnZXQgb2YgdGhpcz9cbiAgICAgICAgaWYgKHRoaXMuaGlzdG9yeUhhc0NoYW5nZXMpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShuZXdVUkwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaGlzdG9yeUhhc0NoYW5nZXMpIHtcbiAgICAgICAgdGhpcy51cmxDaGFuZ2VkT25jZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGlzdG9yeUhhc0NoYW5nZXMgPSB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXNldEhhc2hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXRIYXNoKCkge1xuICAgICAgdGhpcy5oYXNoUmVzZXRlZCA9IHRydWU7XG5cbiAgICAgIGlmICh0aGlzLnVybENoYW5nZWRPbmNlKSB7XG4gICAgICAgIGhpc3RvcnkuYmFjaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMucHVzaFN0YXRlU3VwcG9ydCkge1xuICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKCcnLCBkb2N1bWVudC50aXRsZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnJztcbiAgICAgICAgfVxuICAgICAgfSAvL1xuICAgICAgLy9pbiBjYXNlIGFuIGhpc3Rvcnkgb3BlcmF0aW9uIGlzIHN0aWxsIHBlbmRpbmdcblxuXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5oaXN0b3J5VXBkYXRlVGltZW91dCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVVSTFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVVUkwoKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5oaXN0b3J5VXBkYXRlVGltZW91dCk7XG5cbiAgICAgIGlmICghdGhpcy5oaXN0b3J5SGFzQ2hhbmdlcykge1xuICAgICAgICB0aGlzLnVwZGF0ZUhhc2goKTsgLy8gZmlyc3QgdGltZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaXN0b3J5VXBkYXRlVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy51cGRhdGVIYXNoLmJpbmQodGhpcyksIDgwMCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldENhcHRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0Q2FwdGlvbihjYXB0aW9uVGV4dCwgaW1hZ2VXaWR0aCkge1xuICAgICAgdmFyIF90aGlzNyA9IHRoaXM7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FwdGlvbnMgJiYgY2FwdGlvblRleHQgJiYgY2FwdGlvblRleHQgIT09ICcnICYmIHR5cGVvZiBjYXB0aW9uVGV4dCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB0aGlzLmhpZGUodGhpcy5kb21Ob2Rlcy5jYXB0aW9uKTtcbiAgICAgICAgdGhpcy5kb21Ob2Rlcy5jYXB0aW9uLnN0eWxlLndpZHRoID0gaW1hZ2VXaWR0aCArICdweCc7XG4gICAgICAgIHRoaXMuZG9tTm9kZXMuY2FwdGlvbi5pbm5lckhUTUwgPSBjYXB0aW9uVGV4dDtcbiAgICAgICAgdGhpcy5kb21Ob2Rlcy5pbWFnZS5hcHBlbmRDaGlsZCh0aGlzLmRvbU5vZGVzLmNhcHRpb24pO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpczcuZmFkZUluKF90aGlzNy5kb21Ob2Rlcy5jYXB0aW9uLCBfdGhpczcub3B0aW9ucy5mYWRlU3BlZWQpO1xuICAgICAgICB9LCB0aGlzLm9wdGlvbnMuY2FwdGlvbkRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2xpZGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2xpZGUoc3BlZWQsIHBvcykge1xuICAgICAgaWYgKCF0aGlzLnRyYW5zaXRpb25DYXBhYmxlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbU5vZGVzLmltYWdlLnN0eWxlLmxlZnQgPSBwb3M7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZG9tTm9kZXMuaW1hZ2Uuc3R5bGVbdGhpcy50cmFuc2l0aW9uUHJlZml4ICsgJ3RyYW5zZm9ybSddID0gJ3RyYW5zbGF0ZVgoJyArIHBvcyArICcpJztcbiAgICAgIHRoaXMuZG9tTm9kZXMuaW1hZ2Uuc3R5bGVbdGhpcy50cmFuc2l0aW9uUHJlZml4ICsgJ3RyYW5zaXRpb24nXSA9IHRoaXMudHJhbnNpdGlvblByZWZpeCArICd0cmFuc2Zvcm0gJyArIHNwZWVkICsgJ3MgbGluZWFyJztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0UmVsYXRlZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRSZWxhdGVkKHJlbCkge1xuICAgICAgdmFyIGVsZW1zO1xuXG4gICAgICBpZiAocmVsICYmIHJlbCAhPT0gZmFsc2UgJiYgcmVsICE9PSAnbm9mb2xsb3cnKSB7XG4gICAgICAgIGVsZW1zID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnRzKS5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSByZWw7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbXMgPSB0aGlzLmVsZW1lbnRzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZWxlbXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9wZW5JbWFnZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvcGVuSW1hZ2UoZWxlbWVudCkge1xuICAgICAgdmFyIF90aGlzOCA9IHRoaXM7XG5cbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3Nob3cuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlU2Nyb2xsKSB7XG4gICAgICAgIHRoaXMuZ2xvYmFsU2Nyb2xsYmFyV2lkdGggPSB0aGlzLnRvZ2dsZVNjcm9sbGJhcignaGlkZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmh0bWxDbGFzcyAmJiB0aGlzLm9wdGlvbnMuaHRtbENsYXNzICE9PSAnJykge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykuY2xhc3NMaXN0LmFkZCh0aGlzLm9wdGlvbnMuaHRtbENsYXNzKTtcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbU5vZGVzLndyYXBwZXIpO1xuICAgICAgdGhpcy5kb21Ob2Rlcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZG9tTm9kZXMuaW1hZ2UpO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLm92ZXJsYXkpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbU5vZGVzLm92ZXJsYXkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbGF0ZWRFbGVtZW50cyA9IHRoaXMuZ2V0UmVsYXRlZChlbGVtZW50LnJlbCk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0NvdW50ZXIpIHtcbiAgICAgICAgaWYgKHRoaXMucmVsYXRlZEVsZW1lbnRzLmxlbmd0aCA9PSAxICYmIHRoaXMuZG9tTm9kZXMud3JhcHBlci5jb250YWlucyh0aGlzLmRvbU5vZGVzLmNvdW50ZXIpKSB7XG4gICAgICAgICAgdGhpcy5kb21Ob2Rlcy53cmFwcGVyLnJlbW92ZUNoaWxkKHRoaXMuZG9tTm9kZXMuY291bnRlcik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZWxhdGVkRWxlbWVudHMubGVuZ3RoID4gMSAmJiAhdGhpcy5kb21Ob2Rlcy53cmFwcGVyLmNvbnRhaW5zKHRoaXMuZG9tTm9kZXMuY291bnRlcikpIHtcbiAgICAgICAgICB0aGlzLmRvbU5vZGVzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5kb21Ob2Rlcy5jb3VudGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3VycmVudEltYWdlSW5kZXggPSB0aGlzLnJlbGF0ZWRFbGVtZW50cy5pbmRleE9mKGVsZW1lbnQpO1xuICAgICAgdmFyIHRhcmdldFVSTCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKHRoaXMub3B0aW9ucy5zb3VyY2VBdHRyKTtcbiAgICAgIHRoaXMuY3VycmVudEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgdGhpcy5jdXJyZW50SW1hZ2Uuc2V0QXR0cmlidXRlKCdzcmMnLCB0YXJnZXRVUkwpO1xuICAgICAgdGhpcy5jdXJyZW50SW1hZ2UuZGF0YXNldC5zY2FsZSA9IDE7XG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVggPSAwO1xuICAgICAgdGhpcy5jdXJyZW50SW1hZ2UuZGF0YXNldC50cmFuc2xhdGVZID0gMDtcblxuICAgICAgaWYgKHRoaXMubG9hZGVkSW1hZ2VzLmluZGV4T2YodGFyZ2V0VVJMKSA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5sb2FkZWRJbWFnZXMucHVzaCh0YXJnZXRVUkwpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRvbU5vZGVzLmltYWdlLmlubmVySFRNTCA9ICcnO1xuICAgICAgdGhpcy5kb21Ob2Rlcy5pbWFnZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xuICAgICAgdGhpcy5kb21Ob2Rlcy5pbWFnZS5hcHBlbmRDaGlsZCh0aGlzLmN1cnJlbnRJbWFnZSk7XG4gICAgICB0aGlzLmZhZGVJbih0aGlzLmRvbU5vZGVzLm92ZXJsYXksIHRoaXMub3B0aW9ucy5mYWRlU3BlZWQpO1xuICAgICAgdGhpcy5mYWRlSW4oW3RoaXMuZG9tTm9kZXMuY291bnRlciwgdGhpcy5kb21Ob2Rlcy5uYXZpZ2F0aW9uLCB0aGlzLmRvbU5vZGVzLmNsb3NlQnV0dG9uXSwgdGhpcy5vcHRpb25zLmZhZGVTcGVlZCk7XG4gICAgICB0aGlzLnNob3codGhpcy5kb21Ob2Rlcy5zcGlubmVyKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMuY291bnRlci5xdWVyeVNlbGVjdG9yKCcuc2wtY3VycmVudCcpLmlubmVySFRNTCA9IHRoaXMuY3VycmVudEltYWdlSW5kZXggKyAxO1xuICAgICAgdGhpcy5kb21Ob2Rlcy5jb3VudGVyLnF1ZXJ5U2VsZWN0b3IoJy5zbC10b3RhbCcpLmlubmVySFRNTCA9IHRoaXMucmVsYXRlZEVsZW1lbnRzLmxlbmd0aDtcbiAgICAgIHRoaXMuYWRqdXN0SW1hZ2UoKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wcmVsb2FkaW5nKSB7XG4gICAgICAgIHRoaXMucHJlbG9hZCgpO1xuICAgICAgfVxuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnc2hvd24uJyArIF90aGlzOC5ldmVudE5hbWVzcGFjZSkpO1xuICAgICAgfSwgdGhpcy5vcHRpb25zLmFuaW1hdGlvblNwZWVkKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZm9yY2VGb2N1c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmb3JjZUZvY3VzKCkge1xuICAgICAgdmFyIF90aGlzOSA9IHRoaXM7XG5cbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb2N1bWVudCwgJ2ZvY3VzaW4uJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKGRvY3VtZW50LCAnZm9jdXNpbi4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChkb2N1bWVudCAhPT0gZXZlbnQudGFyZ2V0ICYmIF90aGlzOS5kb21Ob2Rlcy53cmFwcGVyICE9PSBldmVudC50YXJnZXQgJiYgIV90aGlzOS5kb21Ob2Rlcy53cmFwcGVyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICBfdGhpczkuZG9tTm9kZXMud3JhcHBlci5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IC8vIHV0aWxpdHlcblxuICB9LCB7XG4gICAga2V5OiBcImFkZEV2ZW50TGlzdGVuZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcihlbGVtZW50cywgZXZlbnRzLCBjYWxsYmFjaywgb3B0cykge1xuICAgICAgZWxlbWVudHMgPSB0aGlzLndyYXAoZWxlbWVudHMpO1xuICAgICAgZXZlbnRzID0gdGhpcy53cmFwKGV2ZW50cyk7XG5cbiAgICAgIHZhciBfaXRlcmF0b3IgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihlbGVtZW50cyksXG4gICAgICAgICAgX3N0ZXA7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yLnMoKTsgIShfc3RlcCA9IF9pdGVyYXRvci5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcC52YWx1ZTtcblxuICAgICAgICAgIGlmICghZWxlbWVudC5uYW1lc3BhY2VzKSB7XG4gICAgICAgICAgICBlbGVtZW50Lm5hbWVzcGFjZXMgPSB7fTtcbiAgICAgICAgICB9IC8vIHNhdmUgdGhlIG5hbWVzcGFjZXMgYWRkRXZlbnRMaXN0ZW5lciB0aGUgRE9NIGVsZW1lbnQgaXRzZWxmXG5cblxuICAgICAgICAgIHZhciBfaXRlcmF0b3IyID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoZXZlbnRzKSxcbiAgICAgICAgICAgICAgX3N0ZXAyO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yMi5zKCk7ICEoX3N0ZXAyID0gX2l0ZXJhdG9yMi5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBldmVudCA9IF9zdGVwMi52YWx1ZTtcbiAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBvcHRzIHx8IGZhbHNlO1xuICAgICAgICAgICAgICB2YXIgbmVlZHNQYXNzaXZlRml4ID0gWyd0b3VjaHN0YXJ0JywgJ3RvdWNobW92ZSddLmluZGV4T2YoZXZlbnQuc3BsaXQoJy4nKVswXSkgPj0gMDtcblxuICAgICAgICAgICAgICBpZiAobmVlZHNQYXNzaXZlRml4ICYmIHRoaXMuaXNQYXNzaXZlRXZlbnRzU3VwcG9ydGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90eXBlb2Yob3B0aW9ucykgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICBvcHRpb25zLnBhc3NpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBwYXNzaXZlOiB0cnVlXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGVsZW1lbnQubmFtZXNwYWNlc1tldmVudF0gPSBjYWxsYmFjaztcbiAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LnNwbGl0KCcuJylbMF0sIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjIuZShlcnIpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IyLmYoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yLmYoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVyKGVsZW1lbnRzLCBldmVudHMpIHtcbiAgICAgIGVsZW1lbnRzID0gdGhpcy53cmFwKGVsZW1lbnRzKTtcbiAgICAgIGV2ZW50cyA9IHRoaXMud3JhcChldmVudHMpO1xuXG4gICAgICB2YXIgX2l0ZXJhdG9yMyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKGVsZW1lbnRzKSxcbiAgICAgICAgICBfc3RlcDM7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMy5zKCk7ICEoX3N0ZXAzID0gX2l0ZXJhdG9yMy5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcDMudmFsdWU7XG5cbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yNCA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKGV2ZW50cyksXG4gICAgICAgICAgICAgIF9zdGVwNDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKF9pdGVyYXRvcjQucygpOyAhKF9zdGVwNCA9IF9pdGVyYXRvcjQubigpKS5kb25lOykge1xuICAgICAgICAgICAgICB2YXIgZXZlbnQgPSBfc3RlcDQudmFsdWU7XG5cbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQubmFtZXNwYWNlcyAmJiBlbGVtZW50Lm5hbWVzcGFjZXNbZXZlbnRdKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LnNwbGl0KCcuJylbMF0sIGVsZW1lbnQubmFtZXNwYWNlc1tldmVudF0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50Lm5hbWVzcGFjZXNbZXZlbnRdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfaXRlcmF0b3I0LmUoZXJyKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgX2l0ZXJhdG9yNC5mKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yMy5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IzLmYoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmFkZU91dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmYWRlT3V0KGVsZW1lbnRzLCBkdXJhdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpczEwID0gdGhpcztcblxuICAgICAgZWxlbWVudHMgPSB0aGlzLndyYXAoZWxlbWVudHMpO1xuXG4gICAgICB2YXIgX2l0ZXJhdG9yNSA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKGVsZW1lbnRzKSxcbiAgICAgICAgICBfc3RlcDU7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yNS5zKCk7ICEoX3N0ZXA1ID0gX2l0ZXJhdG9yNS5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcDUudmFsdWU7XG4gICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjUuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yNS5mKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNGYWRlSW4gPSBmYWxzZTtcblxuICAgICAgdmFyIHN0ZXAgPSAxNi42NjY2NiAvIChkdXJhdGlvbiB8fCB0aGlzLm9wdGlvbnMuZmFkZVNwZWVkKSxcbiAgICAgICAgICBmYWRlID0gZnVuY3Rpb24gZmFkZSgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRPcGFjaXR5ID0gcGFyc2VGbG9hdChlbGVtZW50c1swXS5zdHlsZS5vcGFjaXR5KTtcblxuICAgICAgICBpZiAoKGN1cnJlbnRPcGFjaXR5IC09IHN0ZXApIDwgMCkge1xuICAgICAgICAgIHZhciBfaXRlcmF0b3I2ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoZWxlbWVudHMpLFxuICAgICAgICAgICAgICBfc3RlcDY7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChfaXRlcmF0b3I2LnMoKTsgIShfc3RlcDYgPSBfaXRlcmF0b3I2Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcDYudmFsdWU7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiOyAvLyBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnJztcblxuICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgX2l0ZXJhdG9yNi5lKGVycik7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjYuZigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwoX3RoaXMxMCwgZWxlbWVudHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBfaXRlcmF0b3I3ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoZWxlbWVudHMpLFxuICAgICAgICAgICAgICBfc3RlcDc7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChfaXRlcmF0b3I3LnMoKTsgIShfc3RlcDcgPSBfaXRlcmF0b3I3Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgdmFyIF9lbGVtZW50ID0gX3N0ZXA3LnZhbHVlO1xuICAgICAgICAgICAgICBfZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gY3VycmVudE9wYWNpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfaXRlcmF0b3I3LmUoZXJyKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgX2l0ZXJhdG9yNy5mKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZhZGUpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmYWRlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZhZGVJblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmYWRlSW4oZWxlbWVudHMsIGR1cmF0aW9uLCBjYWxsYmFjaywgZGlzcGxheSkge1xuICAgICAgdmFyIF90aGlzMTEgPSB0aGlzO1xuXG4gICAgICBlbGVtZW50cyA9IHRoaXMud3JhcChlbGVtZW50cyk7XG5cbiAgICAgIHZhciBfaXRlcmF0b3I4ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoZWxlbWVudHMpLFxuICAgICAgICAgIF9zdGVwODtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3I4LnMoKTsgIShfc3RlcDggPSBfaXRlcmF0b3I4Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgZWxlbWVudCA9IF9zdGVwOC52YWx1ZTtcbiAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXkgfHwgXCJibG9ja1wiO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yOC5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3I4LmYoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pc0ZhZGVJbiA9IHRydWU7XG5cbiAgICAgIHZhciBvcGFjaXR5VGFyZ2V0ID0gcGFyc2VGbG9hdChlbGVtZW50c1swXS5kYXRhc2V0Lm9wYWNpdHlUYXJnZXQgfHwgMSksXG4gICAgICAgICAgc3RlcCA9IDE2LjY2NjY2ICogb3BhY2l0eVRhcmdldCAvIChkdXJhdGlvbiB8fCB0aGlzLm9wdGlvbnMuZmFkZVNwZWVkKSxcbiAgICAgICAgICBmYWRlID0gZnVuY3Rpb24gZmFkZSgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRPcGFjaXR5ID0gcGFyc2VGbG9hdChlbGVtZW50c1swXS5zdHlsZS5vcGFjaXR5KTtcblxuICAgICAgICBpZiAoISgoY3VycmVudE9wYWNpdHkgKz0gc3RlcCkgPiBvcGFjaXR5VGFyZ2V0KSkge1xuICAgICAgICAgIHZhciBfaXRlcmF0b3I5ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoZWxlbWVudHMpLFxuICAgICAgICAgICAgICBfc3RlcDk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChfaXRlcmF0b3I5LnMoKTsgIShfc3RlcDkgPSBfaXRlcmF0b3I5Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcDkudmFsdWU7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IGN1cnJlbnRPcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgX2l0ZXJhdG9yOS5lKGVycik7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjkuZigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghX3RoaXMxMS5pc0ZhZGVJbikgcmV0dXJuO1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmYWRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yMTAgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihlbGVtZW50cyksXG4gICAgICAgICAgICAgIF9zdGVwMTA7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChfaXRlcmF0b3IxMC5zKCk7ICEoX3N0ZXAxMCA9IF9pdGVyYXRvcjEwLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgdmFyIF9lbGVtZW50MiA9IF9zdGVwMTAudmFsdWU7XG4gICAgICAgICAgICAgIF9lbGVtZW50Mi5zdHlsZS5vcGFjaXR5ID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IxMC5lKGVycik7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjEwLmYoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjay5jYWxsKF90aGlzMTEsIGVsZW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZmFkZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoaWRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhpZGUoZWxlbWVudHMpIHtcbiAgICAgIGVsZW1lbnRzID0gdGhpcy53cmFwKGVsZW1lbnRzKTtcblxuICAgICAgdmFyIF9pdGVyYXRvcjExID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoZWxlbWVudHMpLFxuICAgICAgICAgIF9zdGVwMTE7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMTEucygpOyAhKF9zdGVwMTEgPSBfaXRlcmF0b3IxMS5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcDExLnZhbHVlO1xuXG4gICAgICAgICAgaWYgKGVsZW1lbnQuc3R5bGUuZGlzcGxheSAhPSAnbm9uZScpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YXNldC5pbml0aWFsRGlzcGxheSA9IGVsZW1lbnQuc3R5bGUuZGlzcGxheTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IxMS5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IxMS5mKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNob3dcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2hvdyhlbGVtZW50cywgZGlzcGxheSkge1xuICAgICAgZWxlbWVudHMgPSB0aGlzLndyYXAoZWxlbWVudHMpO1xuXG4gICAgICB2YXIgX2l0ZXJhdG9yMTIgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihlbGVtZW50cyksXG4gICAgICAgICAgX3N0ZXAxMjtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IxMi5zKCk7ICEoX3N0ZXAxMiA9IF9pdGVyYXRvcjEyLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgZWxlbWVudCA9IF9zdGVwMTIudmFsdWU7XG4gICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZWxlbWVudC5kYXRhc2V0LmluaXRpYWxEaXNwbGF5IHx8IGRpc3BsYXkgfHwgJ2Jsb2NrJztcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjEyLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjEyLmYoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwid3JhcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3cmFwKGlucHV0KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGlucHV0W1N5bWJvbC5pdGVyYXRvcl0gPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJyA/IGlucHV0IDogW2lucHV0XTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwib25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb24oZXZlbnRzLCBjYWxsYmFjaykge1xuICAgICAgZXZlbnRzID0gdGhpcy53cmFwKGV2ZW50cyk7XG5cbiAgICAgIHZhciBfaXRlcmF0b3IxMyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMuZWxlbWVudHMpLFxuICAgICAgICAgIF9zdGVwMTM7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMTMucygpOyAhKF9zdGVwMTMgPSBfaXRlcmF0b3IxMy5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcDEzLnZhbHVlO1xuXG4gICAgICAgICAgaWYgKCFlbGVtZW50LmZ1bGx5TmFtZXNwYWNlZEV2ZW50cykge1xuICAgICAgICAgICAgZWxlbWVudC5mdWxseU5hbWVzcGFjZWRFdmVudHMgPSB7fTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yMTQgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihldmVudHMpLFxuICAgICAgICAgICAgICBfc3RlcDE0O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yMTQucygpOyAhKF9zdGVwMTQgPSBfaXRlcmF0b3IxNC5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBldmVudCA9IF9zdGVwMTQudmFsdWU7XG4gICAgICAgICAgICAgIGVsZW1lbnQuZnVsbHlOYW1lc3BhY2VkRXZlbnRzW2V2ZW50XSA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjE0LmUoZXJyKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgX2l0ZXJhdG9yMTQuZigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjEzLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjEzLmYoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9mZlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvZmYoZXZlbnRzKSB7XG4gICAgICBldmVudHMgPSB0aGlzLndyYXAoZXZlbnRzKTtcblxuICAgICAgdmFyIF9pdGVyYXRvcjE1ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5lbGVtZW50cyksXG4gICAgICAgICAgX3N0ZXAxNTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IxNS5zKCk7ICEoX3N0ZXAxNSA9IF9pdGVyYXRvcjE1Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgZWxlbWVudCA9IF9zdGVwMTUudmFsdWU7XG5cbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yMTYgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihldmVudHMpLFxuICAgICAgICAgICAgICBfc3RlcDE2O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yMTYucygpOyAhKF9zdGVwMTYgPSBfaXRlcmF0b3IxNi5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBldmVudCA9IF9zdGVwMTYudmFsdWU7XG5cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50LmZ1bGx5TmFtZXNwYWNlZEV2ZW50cyAhPT0gJ3VuZGVmaW5lZCcgJiYgZXZlbnQgaW4gZWxlbWVudC5mdWxseU5hbWVzcGFjZWRFdmVudHMpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGVsZW1lbnQuZnVsbHlOYW1lc3BhY2VkRXZlbnRzW2V2ZW50XSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjE2LmUoZXJyKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgX2l0ZXJhdG9yMTYuZigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjE1LmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjE1LmYoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBhcGlcblxuICB9LCB7XG4gICAga2V5OiBcIm9wZW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb3BlbihlbGVtKSB7XG4gICAgICBlbGVtID0gZWxlbSB8fCB0aGlzLmVsZW1lbnRzWzBdO1xuXG4gICAgICBpZiAodHlwZW9mIGpRdWVyeSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlbGVtIGluc3RhbmNlb2YgalF1ZXJ5KSB7XG4gICAgICAgIGVsZW0gPSBlbGVtLmdldCgwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbml0aWFsSW1hZ2VJbmRleCA9IHRoaXMuZWxlbWVudHMuaW5kZXhPZihlbGVtKTtcblxuICAgICAgaWYgKHRoaXMuaW5pdGlhbEltYWdlSW5kZXggPiAtMSkge1xuICAgICAgICB0aGlzLm9wZW5JbWFnZShlbGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibmV4dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgdGhpcy5sb2FkSW1hZ2UoMSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInByZXZcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJldigpIHtcbiAgICAgIHRoaXMubG9hZEltYWdlKC0xKTtcbiAgICB9IC8vIGdldCBzb21lIHVzZWZ1bCBkYXRhXG5cbiAgfSwge1xuICAgIGtleTogXCJnZXRMaWdoYm94RGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRMaWdoYm94RGF0YSgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGN1cnJlbnRJbWFnZUluZGV4OiB0aGlzLmN1cnJlbnRJbWFnZUluZGV4LFxuICAgICAgICBjdXJyZW50SW1hZ2U6IHRoaXMuY3VycmVudEltYWdlLFxuICAgICAgICBnbG9iYWxTY3JvbGxiYXJXaWR0aDogdGhpcy5nbG9iYWxTY3JvbGxiYXJXaWR0aFxuICAgICAgfTtcbiAgICB9IC8vY2xvc2UgaXMgZXhwb3NlZCBhbnl3YXlzLi5cblxuICB9LCB7XG4gICAga2V5OiBcImRlc3Ryb3lcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIC8vcmVtb3ZlIGFsbCBjdXN0b20gZXZlbnQgbGlzdGVuZXJzIGZyb20gZWxlbWVudHNcbiAgICAgIHRoaXMub2ZmKFsnY2xvc2UuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdjbG9zZWQuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICduZXh0SW1hZ2VMb2FkZWQuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdwcmV2SW1hZ2VMb2FkZWQuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdjaGFuZ2UuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICduZXh0RG9uZS4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgJ3ByZXZEb25lLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlLCAnZXJyb3IuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdjaGFuZ2VkLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlLCAnbmV4dC4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgJ3ByZXYuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdzaG93LicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlLCAnc2hvd24uJyArIHRoaXMuZXZlbnROYW1lc3BhY2VdKTtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmVsZW1lbnRzLCAnY2xpY2suJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGRvY3VtZW50LCAnZm9jdXNpbi4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSk7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9jdW1lbnQuYm9keSwgJ2NvbnRleHRtZW51LicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlKTtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb2N1bWVudC5ib2R5LCAna2V5dXAuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuZG9tTm9kZXMubmF2aWdhdGlvbi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYnV0dG9uJyksICdjbGljay4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSk7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5kb21Ob2Rlcy5jbG9zZUJ1dHRvbiwgJ2NsaWNrLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlKTtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih3aW5kb3csICdyZXNpemUuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ2hhc2hjaGFuZ2UuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpO1xuICAgICAgdGhpcy5jbG9zZSgpO1xuXG4gICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmRvbU5vZGVzLndyYXBwZXIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuZG9tTm9kZXMub3ZlcmxheSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZWxlbWVudHMgPSBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZWZyZXNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbFNlbGVjdG9yKSB7XG4gICAgICAgIHRocm93ICdyZWZyZXNoaW5nIG9ubHkgd29ya3Mgd2hlbiB5b3UgaW5pdGlhbGl6ZSB1c2luZyBhIHNlbGVjdG9yISc7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIHNlbGVjdG9yID0gdGhpcy5pbml0aWFsU2VsZWN0b3I7XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFNpbXBsZUxpZ2h0Ym94O1xufSgpO1xuXG52YXIgX2RlZmF1bHQgPSBTaW1wbGVMaWdodGJveDtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5nbG9iYWwuU2ltcGxlTGlnaHRib3ggPSBTaW1wbGVMaWdodGJveDsiLCJpbXBvcnQgU2ltcGxlTGlnaHRib3ggZnJvbSBcInNpbXBsZWxpZ2h0Ym94XCI7XHJcblxyXG5uZXcgU2ltcGxlTGlnaHRib3goJy5nYWxsZXJ5X19mYW5jeWJveCcsIHsgLyogb3B0aW9ucyAqLyB9KTtcclxuIiwiLyoqXHJcbiAqIFN0aWNreSBTaWRlYmFyIEphdmFTY3JpcHQgUGx1Z2luLlxyXG4gKiBAdmVyc2lvbiAzLjMuMVxyXG4gKiBAYXV0aG9yIEFobWVkIEJvdWh1b2xpYSA8YS5ib3VodW9saWFAZ21haWwuY29tPlxyXG4gKiBAbGljZW5zZSBUaGUgTUlUIExpY2Vuc2UgKE1JVClcclxuICovXHJcbmNvbnN0IFN0aWNreVNpZGViYXIgPSAoKCkgPT4ge1xyXG4gIFxyXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyAjIERlZmluZSBDb25zdGFudHNcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy9cclxuICAgIGNvbnN0IEVWRU5UX0tFWSA9ICcuc3RpY2t5U2lkZWJhcic7XHJcbiAgICBjb25zdCBWRVJTSU9OICAgPSAnMy4zLjEnO1xyXG4gIFxyXG4gICAgY29uc3QgREVGQVVMVFMgPSB7XHJcbiAgICAgIFxyXG4gICAgICAvKipcclxuICAgICAgICogQWRkaXRpb25hbCB0b3Agc3BhY2luZyBvZiB0aGUgZWxlbWVudCB3aGVuIGl0IGJlY29tZXMgc3RpY2t5LlxyXG4gICAgICAgKiBAdHlwZSB7TnVtZXJpY3xGdW5jdGlvbn1cclxuICAgICAgICovXHJcbiAgICAgIHRvcFNwYWNpbmc6IDAsXHJcbiAgXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBBZGRpdGlvbmFsIGJvdHRvbSBzcGFjaW5nIG9mIHRoZSBlbGVtZW50IHdoZW4gaXQgYmVjb21lcyBzdGlja3kuXHJcbiAgICAgICAqIEB0eXBlIHtOdW1lcmljfEZ1bmN0aW9ufVxyXG4gICAgICAgKi9cclxuICAgICAgYm90dG9tU3BhY2luZzogMCxcclxuICBcclxuICAgICAgLyoqXHJcbiAgICAgICAqIENvbnRhaW5lciBzaWRlYmFyIHNlbGVjdG9yIHRvIGtub3cgd2hhdCB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2Ygc3RpY2t5IGVsZW1lbnQuXHJcbiAgICAgICAqIEB0eXBlIHtTdHJpbmd8RmFsc2V9XHJcbiAgICAgICAqL1xyXG4gICAgICBjb250YWluZXJTZWxlY3RvcjogZmFsc2UsXHJcbiAgXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBJbm5lciB3cmFwcGVyIHNlbGVjdG9yLlxyXG4gICAgICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAgICAgKi9cclxuICAgICAgaW5uZXJXcmFwcGVyU2VsZWN0b3I6ICcuaW5uZXItd3JhcHBlci1zdGlja3knLFxyXG4gIFxyXG4gICAgICAvKipcclxuICAgICAgICogVGhlIG5hbWUgb2YgQ1NTIGNsYXNzIHRvIGFwcGx5IHRvIGVsZW1lbnRzIHdoZW4gdGhleSBoYXZlIGJlY29tZSBzdHVjay5cclxuICAgICAgICogQHR5cGUge1N0cmluZ3xGYWxzZX1cclxuICAgICAgICovXHJcbiAgICAgIHN0aWNreUNsYXNzOiAnaXMtYWZmaXhlZCcsXHJcbiAgXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBEZXRlY3Qgd2hlbiBzaWRlYmFyIGFuZCBpdHMgY29udGFpbmVyIGNoYW5nZSBoZWlnaHQgc28gcmUtY2FsY3VsYXRlIHRoZWlyIGRpbWVuc2lvbnMuXHJcbiAgICAgICAqIEB0eXBlIHtCb29sZWFufVxyXG4gICAgICAgKi9cclxuICAgICAgcmVzaXplU2Vuc29yOiB0cnVlLFxyXG4gIFxyXG4gICAgICAvKipcclxuICAgICAgICogVGhlIHNpZGViYXIgcmV0dXJucyB0byBpdHMgbm9ybWFsIHBvc2l0aW9uIGlmIGl0cyB3aWR0aCBiZWxvdyB0aGlzIHZhbHVlLlxyXG4gICAgICAgKiBAdHlwZSB7TnVtZXJpY31cclxuICAgICAgICovXHJcbiAgICAgIG1pbldpZHRoOiBmYWxzZVxyXG4gICAgfTtcclxuICBcclxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8gIyBDbGFzcyBEZWZpbml0aW9uXHJcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vXHJcbiAgICAvKipcclxuICAgICAqIFN0aWNreSBTaWRlYmFyIENsYXNzLlxyXG4gICAgICogQHB1YmxpY1xyXG4gICAgICovXHJcbiAgICBjbGFzcyBTdGlja3lTaWRlYmFye1xyXG4gIFxyXG4gICAgICAvKipcclxuICAgICAgICogU3RpY2t5IFNpZGViYXIgQ29uc3RydWN0b3IuXHJcbiAgICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fFN0cmluZ30gc2lkZWJhciAtIFRoZSBzaWRlYmFyIGVsZW1lbnQgb3Igc2lkZWJhciBzZWxlY3Rvci5cclxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyBvZiBzdGlja3kgc2lkZWJhci5cclxuICAgICAgICovXHJcbiAgICAgIGNvbnN0cnVjdG9yKHNpZGViYXIsIG9wdGlvbnMgPSB7fSl7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gU3RpY2t5U2lkZWJhci5leHRlbmQoREVGQVVMVFMsIG9wdGlvbnMpO1xyXG4gIFxyXG4gICAgICAgIC8vIFNpZGViYXIgZWxlbWVudCBxdWVyeSBpZiB0aGVyZSdzIG5vIG9uZSwgdGhyb3cgZXJyb3IuXHJcbiAgICAgICAgdGhpcy5zaWRlYmFyID0gKCdzdHJpbmcnID09PSB0eXBlb2Ygc2lkZWJhciApID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzaWRlYmFyKSA6IHNpZGViYXI7XHJcbiAgICAgICAgaWYoICd1bmRlZmluZWQnID09PSB0eXBlb2YgdGhpcy5zaWRlYmFyIClcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIHNwZWNpZmljIHNpZGViYXIgZWxlbWVudC5cIik7XHJcbiAgXHJcbiAgICAgICAgdGhpcy5zaWRlYmFySW5uZXIgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IHRoaXMuc2lkZWJhci5wYXJlbnRFbGVtZW50O1xyXG4gIFxyXG4gICAgICAgIC8vIEN1cnJlbnQgQWZmaXggVHlwZSBvZiBzaWRlYmFyIGVsZW1lbnQuXHJcbiAgICAgICAgdGhpcy5hZmZpeGVkVHlwZSA9ICdTVEFUSUMnO1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xyXG4gICAgICAgIHRoaXMuc3VwcG9ydCA9IHtcclxuICAgICAgICAgIHRyYW5zZm9ybTogICBmYWxzZSxcclxuICAgICAgICAgIHRyYW5zZm9ybTNkOiBmYWxzZVxyXG4gICAgICAgIH07XHJcbiAgXHJcbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9yZVN0eWxlID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fYnJlYWtwb2ludCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3Jlc2l6ZUxpc3RlbmVycyA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIERpbWVuc2lvbnMgb2Ygc2lkZWJhciwgY29udGFpbmVyIGFuZCBzY3JlZW4gdmlld3BvcnQuXHJcbiAgICAgICAgdGhpcy5kaW1lbnNpb25zID0ge1xyXG4gICAgICAgICAgdHJhbnNsYXRlWTogMCxcclxuICAgICAgICAgIHRvcFNwYWNpbmc6IDAsXHJcbiAgICAgICAgICBsYXN0VG9wU3BhY2luZzogMCxcclxuICAgICAgICAgIGJvdHRvbVNwYWNpbmc6IDAsXHJcbiAgICAgICAgICBsYXN0Qm90dG9tU3BhY2luZzogMCxcclxuICAgICAgICAgIHNpZGViYXJIZWlnaHQ6IDAsXHJcbiAgICAgICAgICBzaWRlYmFyV2lkdGg6IDAsXHJcbiAgICAgICAgICBjb250YWluZXJUb3A6IDAsXHJcbiAgICAgICAgICBjb250YWluZXJIZWlnaHQ6IDAsXHJcbiAgICAgICAgICB2aWV3cG9ydEhlaWdodDogMCxcclxuICAgICAgICAgIHZpZXdwb3J0VG9wOiAwLCBcclxuICAgICAgICAgIGxhc3RWaWV3cG9ydFRvcDogMCxcclxuICAgICAgICB9O1xyXG4gIFxyXG4gICAgICAgIC8vIEJpbmQgZXZlbnQgaGFuZGxlcnMgZm9yIHJlZmVyZW5jYWJpbGl0eS5cclxuICAgICAgICBbJ2hhbmRsZUV2ZW50J10uZm9yRWFjaCggKG1ldGhvZCkgPT4ge1xyXG4gICAgICAgICAgdGhpc1ttZXRob2RdID0gdGhpc1ttZXRob2RdLmJpbmQodGhpcyk7XHJcbiAgICAgICAgfSk7XHJcbiAgXHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBzdGlja3kgc2lkZWJhciBmb3IgZmlyc3QgdGltZS5cclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvKipcclxuICAgICAgICogSW5pdGlhbGl6ZXMgdGhlIHN0aWNreSBzaWRlYmFyIGJ5IGFkZGluZyBpbm5lciB3cmFwcGVyLCBkZWZpbmUgaXRzIGNvbnRhaW5lciwgXHJcbiAgICAgICAqIG1pbi13aWR0aCBicmVha3BvaW50LCBjYWxjdWxhdGluZyBkaW1lbnNpb25zLCBhZGRpbmcgaGVscGVyIGNsYXNzZXMgYW5kIGlubGluZSBzdHlsZS5cclxuICAgICAgICogQHByaXZhdGVcclxuICAgICAgICovXHJcbiAgICAgIGluaXRpYWxpemUoKXtcclxuICAgICAgICB0aGlzLl9zZXRTdXBwb3J0RmVhdHVyZXMoKTtcclxuICBcclxuICAgICAgICAvLyBHZXQgc3RpY2t5IHNpZGViYXIgaW5uZXIgd3JhcHBlciwgaWYgbm90IGZvdW5kLCB3aWxsIGNyZWF0ZSBvbmUuXHJcbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5pbm5lcldyYXBwZXJTZWxlY3RvciApe1xyXG4gICAgICAgICAgdGhpcy5zaWRlYmFySW5uZXIgPSB0aGlzLnNpZGViYXIucXVlcnlTZWxlY3Rvcih0aGlzLm9wdGlvbnMuaW5uZXJXcmFwcGVyU2VsZWN0b3IpO1xyXG4gIFxyXG4gICAgICAgICAgaWYoIG51bGwgPT09IHRoaXMuc2lkZWJhcklubmVyIClcclxuICAgICAgICAgICAgdGhpcy5zaWRlYmFySW5uZXIgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoICEgdGhpcy5zaWRlYmFySW5uZXIgKXtcclxuICAgICAgICAgIGxldCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICB3cmFwcGVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnaW5uZXItd3JhcHBlci1zdGlja3knKTtcclxuICAgICAgICAgIHRoaXMuc2lkZWJhci5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcclxuICBcclxuICAgICAgICAgIHdoaWxlKCB0aGlzLnNpZGViYXIuZmlyc3RDaGlsZCAhPSB3cmFwcGVyIClcclxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLnNpZGViYXIuZmlyc3RDaGlsZCk7XHJcbiAgXHJcbiAgICAgICAgICB0aGlzLnNpZGViYXJJbm5lciA9IHRoaXMuc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcuaW5uZXItd3JhcHBlci1zdGlja3knKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgLy8gQ29udGFpbmVyIHdyYXBwZXIgb2YgdGhlIHNpZGViYXIuXHJcbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5jb250YWluZXJTZWxlY3RvciApe1xyXG4gICAgICAgICAgbGV0IGNvbnRhaW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy5jb250YWluZXJTZWxlY3Rvcik7XHJcbiAgICAgICAgICBjb250YWluZXJzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoY29udGFpbmVycyk7XHJcbiAgXHJcbiAgICAgICAgICBjb250YWluZXJzLmZvckVhY2goKGNvbnRhaW5lciwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpZiggISBjb250YWluZXIuY29udGFpbnModGhpcy5zaWRlYmFyKSApIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgICB9KTtcclxuICBcclxuICAgICAgICAgIGlmKCAhIGNvbnRhaW5lcnMubGVuZ3RoIClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGNvbnRhaW5lciBkb2VzIG5vdCBjb250YWlucyBvbiB0aGUgc2lkZWJhci5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIElmIHRvcC9ib3R0b20gc3BhY2luZyBpcyBub3QgZnVuY3Rpb24gcGFyc2UgdmFsdWUgdG8gaW50ZWdlci5cclxuICAgICAgICBpZiggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRoaXMub3B0aW9ucy50b3BTcGFjaW5nIClcclxuICAgICAgICAgIHRoaXMub3B0aW9ucy50b3BTcGFjaW5nID0gcGFyc2VJbnQodGhpcy5vcHRpb25zLnRvcFNwYWNpbmcpIHx8IDA7XHJcbiAgXHJcbiAgICAgICAgaWYoICdmdW5jdGlvbicgIT09IHR5cGVvZiB0aGlzLm9wdGlvbnMuYm90dG9tU3BhY2luZyApXHJcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuYm90dG9tU3BhY2luZyA9IHBhcnNlSW50KHRoaXMub3B0aW9ucy5ib3R0b21TcGFjaW5nKSB8fCAwO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAvLyBCcmVha2Rvd24gc3RpY2t5IHNpZGViYXIgaWYgc2NyZWVuIHdpZHRoIGJlbG93IGBvcHRpb25zLm1pbldpZHRoYC5cclxuICAgICAgICB0aGlzLl93aWR0aEJyZWFrcG9pbnQoKTtcclxuICBcclxuICAgICAgICAvLyBDYWxjdWxhdGUgZGltZW5zaW9ucyBvZiBzaWRlYmFyLCBjb250YWluZXIgYW5kIHZpZXdwb3J0LlxyXG4gICAgICAgIHRoaXMuY2FsY0RpbWVuc2lvbnMoKTtcclxuICBcclxuICAgICAgICAvLyBBZmZpeCBzaWRlYmFyIGluIHByb3BlciBwb3NpdGlvbi5cclxuICAgICAgICB0aGlzLnN0aWNreVBvc2l0aW9uKCk7XHJcbiAgXHJcbiAgICAgICAgLy8gQmluZCBhbGwgZXZlbnRzLlxyXG4gICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEluZm9ybSBvdGhlciBwcm9wZXJ0aWVzIHRoZSBzdGlja3kgc2lkZWJhciBpcyBpbml0aWFsaXplZC5cclxuICAgICAgICB0aGlzLl9pbml0aWFsaXplZCA9IHRydWU7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLyoqXHJcbiAgICAgICAqIEJpbmQgYWxsIGV2ZW50cyBvZiBzdGlja3kgc2lkZWJhciBwbHVnaW4uXHJcbiAgICAgICAqIEBwcm90ZWN0ZWRcclxuICAgICAgICovXHJcbiAgICAgIGJpbmRFdmVudHMoKXtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcywge3Bhc3NpdmU6IHRydWUsIGNhcHR1cmU6IGZhbHNlfSk7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMsIHtwYXNzaXZlOiB0cnVlLCBjYXB0dXJlOiBmYWxzZX0pO1xyXG4gIFxyXG4gICAgICAgIHRoaXMuc2lkZWJhci5hZGRFdmVudExpc3RlbmVyKCd1cGRhdGUnICsgRVZFTlRfS0VZLCB0aGlzKTtcclxuICBcclxuICAgICAgICBpZiggdGhpcy5vcHRpb25zLnJlc2l6ZVNlbnNvciAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIFJlc2l6ZVNlbnNvciApe1xyXG4gICAgICAgICAgbmV3IFJlc2l6ZVNlbnNvcih0aGlzLnNpZGViYXJJbm5lciwgdGhpcy5oYW5kbGVFdmVudCk7XHJcbiAgICAgICAgICBuZXcgUmVzaXplU2Vuc29yKHRoaXMuY29udGFpbmVyLCB0aGlzLmhhbmRsZUV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLyoqXHJcbiAgICAgICAqIEhhbmRsZXMgYWxsIGV2ZW50cyBvZiB0aGUgcGx1Z2luLlxyXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgLSBFdmVudCBvYmplY3QgcGFzc2VkIGZyb20gbGlzdGVuZXIuXHJcbiAgICAgICAqL1xyXG4gICAgICBoYW5kbGVFdmVudChldmVudCl7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTdGlja3koZXZlbnQpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBDYWxjdWxhdGVzIGRpbWVuc2lvbnMgb2Ygc2lkZWJhciwgY29udGFpbmVyIGFuZCBzY3JlZW4gdmlld3BvaW50XHJcbiAgICAgICAqIEBwdWJsaWNcclxuICAgICAgICovXHJcbiAgICAgIGNhbGNEaW1lbnNpb25zKCl7XHJcbiAgICAgICAgaWYoIHRoaXMuX2JyZWFrcG9pbnQgKSByZXR1cm47XHJcbiAgICAgICAgdmFyIGRpbXMgPSB0aGlzLmRpbWVuc2lvbnM7XHJcbiAgXHJcbiAgICAgICAgLy8gQ29udGFpbmVyIG9mIHN0aWNreSBzaWRlYmFyIGRpbWVuc2lvbnMuXHJcbiAgICAgICAgZGltcy5jb250YWluZXJUb3AgICAgPSBTdGlja3lTaWRlYmFyLm9mZnNldFJlbGF0aXZlKHRoaXMuY29udGFpbmVyKS50b3A7XHJcbiAgICAgICAgZGltcy5jb250YWluZXJIZWlnaHQgPSB0aGlzLmNvbnRhaW5lci5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgZGltcy5jb250YWluZXJCb3R0b20gPSBkaW1zLmNvbnRhaW5lclRvcCArIGRpbXMuY29udGFpbmVySGVpZ2h0O1xyXG4gIFxyXG4gICAgICAgIC8vIFNpZGViYXIgZGltZW5zaW9ucy5cclxuICAgICAgICBkaW1zLnNpZGViYXJIZWlnaHQgPSB0aGlzLnNpZGViYXJJbm5lci5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgZGltcy5zaWRlYmFyV2lkdGggID0gdGhpcy5zaWRlYmFyLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFNjcmVlbiB2aWV3cG9ydCBkaW1lbnNpb25zLlxyXG4gICAgICAgIGRpbXMudmlld3BvcnRIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgXHJcbiAgICAgICAgdGhpcy5fY2FsY0RpbWVuc2lvbnNXaXRoU2Nyb2xsKCk7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLyoqXHJcbiAgICAgICAqIFNvbWUgZGltZW5zaW9ucyB2YWx1ZXMgbmVlZCB0byBiZSB1cC10by1kYXRlIHdoZW4gc2Nyb2xsaW5nIHRoZSBwYWdlLlxyXG4gICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgKi9cclxuICAgICAgX2NhbGNEaW1lbnNpb25zV2l0aFNjcm9sbCgpe1xyXG4gICAgICAgIHZhciBkaW1zID0gdGhpcy5kaW1lbnNpb25zO1xyXG4gIFxyXG4gICAgICAgIGRpbXMuc2lkZWJhckxlZnQgPSBTdGlja3lTaWRlYmFyLm9mZnNldFJlbGF0aXZlKHRoaXMuc2lkZWJhcikubGVmdDtcclxuICBcclxuICAgICAgICBkaW1zLnZpZXdwb3J0VG9wICAgID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcclxuICAgICAgICBkaW1zLnZpZXdwb3J0Qm90dG9tID0gZGltcy52aWV3cG9ydFRvcCArIGRpbXMudmlld3BvcnRIZWlnaHQ7XHJcbiAgICAgICAgZGltcy52aWV3cG9ydExlZnQgICA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdDtcclxuICBcclxuICAgICAgICBkaW1zLnRvcFNwYWNpbmcgICAgPSB0aGlzLm9wdGlvbnMudG9wU3BhY2luZztcclxuICAgICAgICBkaW1zLmJvdHRvbVNwYWNpbmcgPSB0aGlzLm9wdGlvbnMuYm90dG9tU3BhY2luZztcclxuICBcclxuICAgICAgICBpZiggJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGRpbXMudG9wU3BhY2luZyApXHJcbiAgICAgICAgICAgIGRpbXMudG9wU3BhY2luZyA9IHBhcnNlSW50KGRpbXMudG9wU3BhY2luZyh0aGlzLnNpZGViYXIpKSB8fCAwO1xyXG4gIFxyXG4gICAgICAgIGlmKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgZGltcy5ib3R0b21TcGFjaW5nIClcclxuICAgICAgICAgICAgZGltcy5ib3R0b21TcGFjaW5nID0gcGFyc2VJbnQoZGltcy5ib3R0b21TcGFjaW5nKHRoaXMuc2lkZWJhcikpIHx8IDA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYoICdWSUVXUE9SVC1UT1AnID09PSB0aGlzLmFmZml4ZWRUeXBlICl7XHJcbiAgICAgICAgICAvLyBBZGp1c3QgdHJhbnNsYXRlIFkgaW4gdGhlIGNhc2UgZGVjcmVhc2UgdG9wIHNwYWNpbmcgdmFsdWUuXHJcbiAgICAgICAgICBpZiggZGltcy50b3BTcGFjaW5nIDwgZGltcy5sYXN0VG9wU3BhY2luZyApe1xyXG4gICAgICAgICAgICBkaW1zLnRyYW5zbGF0ZVkgKz0gZGltcy5sYXN0VG9wU3BhY2luZyAtIGRpbXMudG9wU3BhY2luZztcclxuICAgICAgICAgICAgdGhpcy5fcmVTdHlsZSA9IHRydWU7IFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIH0gZWxzZSBpZiggJ1ZJRVdQT1JULUJPVFRPTScgPT09IHRoaXMuYWZmaXhlZFR5cGUgKXtcclxuICAgICAgICAgIC8vIEFkanVzdCB0cmFuc2xhdGUgWSBpbiB0aGUgY2FzZSBkZWNyZWFzZSBib3R0b20gc3BhY2luZyB2YWx1ZS5cclxuICAgICAgICAgIGlmKCBkaW1zLmJvdHRvbVNwYWNpbmcgPCBkaW1zLmxhc3RCb3R0b21TcGFjaW5nICl7XHJcbiAgICAgICAgICAgIGRpbXMudHJhbnNsYXRlWSArPSBkaW1zLmxhc3RCb3R0b21TcGFjaW5nIC0gZGltcy5ib3R0b21TcGFjaW5nO1xyXG4gICAgICAgICAgICB0aGlzLl9yZVN0eWxlID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZGltcy5sYXN0VG9wU3BhY2luZyAgICA9IGRpbXMudG9wU3BhY2luZztcclxuICAgICAgICBkaW1zLmxhc3RCb3R0b21TcGFjaW5nID0gZGltcy5ib3R0b21TcGFjaW5nO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvKipcclxuICAgICAgICogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHNpZGViYXIgaXMgYmlnZ2VyIHRoYW4gdmlld3BvcnQuXHJcbiAgICAgICAqIEBwdWJsaWNcclxuICAgICAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgICAgICovXHJcbiAgICAgIGlzU2lkZWJhckZpdHNWaWV3cG9ydCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRpbWVuc2lvbnMuc2lkZWJhckhlaWdodCA8IHRoaXMuZGltZW5zaW9ucy52aWV3cG9ydEhlaWdodDtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvKipcclxuICAgICAgICogT2JzZXJ2ZSBicm93c2VyIHNjcm9sbGluZyBkaXJlY3Rpb24gdG9wIGFuZCBkb3duLlxyXG4gICAgICAgKi9cclxuICAgICAgb2JzZXJ2ZVNjcm9sbERpcigpe1xyXG4gICAgICAgIHZhciBkaW1zID0gdGhpcy5kaW1lbnNpb25zO1xyXG4gICAgICAgIGlmKCBkaW1zLmxhc3RWaWV3cG9ydFRvcCA9PT0gZGltcy52aWV3cG9ydFRvcCApIHJldHVybjtcclxuICBcclxuICAgICAgICB2YXIgZnVydGhlc3QgPSAnZG93bicgPT09IHRoaXMuZGlyZWN0aW9uID8gTWF0aC5taW4gOiBNYXRoLm1heDtcclxuICAgICAgICBcclxuICAgICAgICAvLyBJZiB0aGUgYnJvd3NlciBpcyBzY3JvbGxpbmcgbm90IGluIHRoZSBzYW1lIGRpcmVjdGlvbi5cclxuICAgICAgICBpZiggZGltcy52aWV3cG9ydFRvcCA9PT0gZnVydGhlc3QoZGltcy52aWV3cG9ydFRvcCwgZGltcy5sYXN0Vmlld3BvcnRUb3ApIClcclxuICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nID09PSB0aGlzLmRpcmVjdGlvbiA/ICAndXAnIDogJ2Rvd24nO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBHZXRzIGFmZml4IHR5cGUgb2Ygc2lkZWJhciBhY2NvcmRpbmcgdG8gY3VycmVudCBzY3JvbGxUb3AgYW5kIHNjcm9sbExlZnQuXHJcbiAgICAgICAqIEhvbGRzIGFsbCBsb2dpY2FsIGFmZml4IG9mIHRoZSBzaWRlYmFyIHdoZW4gc2Nyb2xsaW5nIHVwIGFuZCBkb3duIGFuZCB3aGVuIHNpZGViYXIgXHJcbiAgICAgICAqIGlzIGJpZ2dlciB0aGFuIHZpZXdwb3J0IGFuZCB2aWNlIHZlcnNhLlxyXG4gICAgICAgKiBAcHVibGljXHJcbiAgICAgICAqIEByZXR1cm4ge1N0cmluZ3xGYWxzZX0gLSBQcm9wZXIgYWZmaXggdHlwZS5cclxuICAgICAgICovXHJcbiAgICAgIGdldEFmZml4VHlwZSgpe1xyXG4gICAgICAgIHZhciBkaW1zID0gdGhpcy5kaW1lbnNpb25zLCBhZmZpeFR5cGUgPSBmYWxzZTtcclxuICBcclxuICAgICAgICB0aGlzLl9jYWxjRGltZW5zaW9uc1dpdGhTY3JvbGwoKTtcclxuICBcclxuICAgICAgICB2YXIgc2lkZWJhckJvdHRvbSA9IGRpbXMuc2lkZWJhckhlaWdodCArIGRpbXMuY29udGFpbmVyVG9wO1xyXG4gICAgICAgIHZhciBjb2xsaWRlclRvcCA9IGRpbXMudmlld3BvcnRUb3AgKyBkaW1zLnRvcFNwYWNpbmc7XHJcbiAgICAgICAgdmFyIGNvbGxpZGVyQm90dG9tID0gZGltcy52aWV3cG9ydEJvdHRvbSAtIGRpbXMuYm90dG9tU3BhY2luZztcclxuICBcclxuICAgICAgICAvLyBXaGVuIGJyb3dzZXIgaXMgc2Nyb2xsaW5nIHRvcC5cclxuICAgICAgICBpZiggJ3VwJyA9PT0gdGhpcy5kaXJlY3Rpb24gKXtcclxuICAgICAgICAgIGlmKCBjb2xsaWRlclRvcCA8PSBkaW1zLmNvbnRhaW5lclRvcCApe1xyXG4gICAgICAgICAgICBkaW1zLnRyYW5zbGF0ZVkgPSAwO1xyXG4gICAgICAgICAgICBhZmZpeFR5cGUgPSAnU1RBVElDJztcclxuICBcclxuICAgICAgICAgIH0gZWxzZSBpZiggY29sbGlkZXJUb3AgPD0gZGltcy50cmFuc2xhdGVZICsgZGltcy5jb250YWluZXJUb3AgKXtcclxuICAgICAgICAgICAgZGltcy50cmFuc2xhdGVZID0gY29sbGlkZXJUb3AgLSBkaW1zLmNvbnRhaW5lclRvcDtcclxuICAgICAgICAgICAgYWZmaXhUeXBlID0gJ1ZJRVdQT1JULVRPUCc7XHJcbiAgXHJcbiAgICAgICAgICB9IGVsc2UgaWYoICEgdGhpcy5pc1NpZGViYXJGaXRzVmlld3BvcnQoKSAmJiBkaW1zLmNvbnRhaW5lclRvcCA8PSBjb2xsaWRlclRvcCApe1xyXG4gICAgICAgICAgICBhZmZpeFR5cGUgPSAnVklFV1BPUlQtVU5CT1RUT00nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIC8vIFdoZW4gYnJvd3NlciBpcyBzY3JvbGxpbmcgdXAuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIFdoZW4gc2lkZWJhciBlbGVtZW50IGlzIG5vdCBiaWdnZXIgdGhhbiBzY3JlZW4gdmlld3BvcnQuXHJcbiAgICAgICAgICBpZiggdGhpcy5pc1NpZGViYXJGaXRzVmlld3BvcnQoKSApe1xyXG4gIFxyXG4gICAgICAgICAgICBpZiggZGltcy5zaWRlYmFySGVpZ2h0ICsgY29sbGlkZXJUb3AgPj0gZGltcy5jb250YWluZXJCb3R0b20gKXtcclxuICAgICAgICAgICAgICBkaW1zLnRyYW5zbGF0ZVkgPSBkaW1zLmNvbnRhaW5lckJvdHRvbSAtIHNpZGViYXJCb3R0b207XHJcbiAgICAgICAgICAgICAgYWZmaXhUeXBlID0gJ0NPTlRBSU5FUi1CT1RUT00nOyBcclxuICBcclxuICAgICAgICAgICAgfSBlbHNlIGlmKCBjb2xsaWRlclRvcCA+PSBkaW1zLmNvbnRhaW5lclRvcCApe1xyXG4gICAgICAgICAgICAgIGRpbXMudHJhbnNsYXRlWSA9IGNvbGxpZGVyVG9wIC0gZGltcy5jb250YWluZXJUb3A7XHJcbiAgICAgICAgICAgICAgYWZmaXhUeXBlID0gJ1ZJRVdQT1JULVRPUCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIFdoZW4gc2lkZWJhciBlbGVtZW50IGlzIGJpZ2dlciB0aGFuIHNjcmVlbiB2aWV3cG9ydC5cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgIFxyXG4gICAgICAgICAgICBpZiggZGltcy5jb250YWluZXJCb3R0b20gPD0gY29sbGlkZXJCb3R0b20gKXtcclxuICAgICAgICAgICAgICBkaW1zLnRyYW5zbGF0ZVkgPSBkaW1zLmNvbnRhaW5lckJvdHRvbSAtIHNpZGViYXJCb3R0b207IFxyXG4gICAgICAgICAgICAgIGFmZml4VHlwZSA9ICdDT05UQUlORVItQk9UVE9NJzsgICAgXHJcbiAgXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiggc2lkZWJhckJvdHRvbSArIGRpbXMudHJhbnNsYXRlWSA8PSBjb2xsaWRlckJvdHRvbSApe1xyXG4gICAgICAgICAgICAgIGRpbXMudHJhbnNsYXRlWSA9IGNvbGxpZGVyQm90dG9tIC0gc2lkZWJhckJvdHRvbTtcclxuICAgICAgICAgICAgICBhZmZpeFR5cGUgPSAnVklFV1BPUlQtQk9UVE9NJztcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiggZGltcy5jb250YWluZXJUb3AgKyBkaW1zLnRyYW5zbGF0ZVkgPD0gY29sbGlkZXJUb3AgKXtcclxuICAgICAgICAgICAgICBhZmZpeFR5cGUgPSAnVklFV1BPUlQtVU5CT1RUT00nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgdHJhbnNsYXRlIFkgaXMgbm90IGJpZ2dlciB0aGFuIGNvbnRhaW5lciBoZWlnaHQuXHJcbiAgICAgICAgZGltcy50cmFuc2xhdGVZID0gTWF0aC5tYXgoMCwgZGltcy50cmFuc2xhdGVZKTtcclxuICAgICAgICBkaW1zLnRyYW5zbGF0ZVkgPSBNYXRoLm1pbihkaW1zLmNvbnRhaW5lckhlaWdodCwgZGltcy50cmFuc2xhdGVZKTtcclxuICBcclxuICAgICAgICBkaW1zLmxhc3RWaWV3cG9ydFRvcCA9IGRpbXMudmlld3BvcnRUb3A7XHJcbiAgICAgICAgcmV0dXJuIGFmZml4VHlwZTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvKipcclxuICAgICAgICogR2V0cyBpbmxpbmUgc3R5bGUgb2Ygc3RpY2t5IHNpZGViYXIgd3JhcHBlciBhbmQgaW5uZXIgd3JhcHBlciBhY2NvcmRpbmcgXHJcbiAgICAgICAqIHRvIGl0cyBhZmZpeCB0eXBlLlxyXG4gICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gYWZmaXhUeXBlIC0gQWZmaXggdHlwZSBvZiBzdGlja3kgc2lkZWJhci5cclxuICAgICAgICogQHJldHVybiB7T2JqZWN0fVxyXG4gICAgICAgKi9cclxuICAgICAgX2dldFN0eWxlKGFmZml4VHlwZSl7XHJcbiAgICAgICAgaWYoICd1bmRlZmluZWQnID09PSB0eXBlb2YgYWZmaXhUeXBlICkgcmV0dXJuO1xyXG4gIFxyXG4gICAgICAgIHZhciBzdHlsZSA9IHtpbm5lcjoge30sIG91dGVyOiB7fX07XHJcbiAgICAgICAgdmFyIGRpbXMgPSB0aGlzLmRpbWVuc2lvbnM7XHJcbiAgXHJcbiAgICAgICAgc3dpdGNoKCBhZmZpeFR5cGUgKXtcclxuICAgICAgICAgIGNhc2UgJ1ZJRVdQT1JULVRPUCc6XHJcbiAgICAgICAgICAgIHN0eWxlLmlubmVyID0ge3Bvc2l0aW9uOiAnZml4ZWQnLCB0b3A6IGRpbXMudG9wU3BhY2luZyxcclxuICAgICAgICAgICAgICAgICAgbGVmdDogZGltcy5zaWRlYmFyTGVmdCAtIGRpbXMudmlld3BvcnRMZWZ0LCB3aWR0aDogZGltcy5zaWRlYmFyV2lkdGh9O1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ1ZJRVdQT1JULUJPVFRPTSc6XHJcbiAgICAgICAgICAgIHN0eWxlLmlubmVyID0ge3Bvc2l0aW9uOiAnZml4ZWQnLCB0b3A6ICdhdXRvJywgbGVmdDogZGltcy5zaWRlYmFyTGVmdCxcclxuICAgICAgICAgICAgICAgICAgYm90dG9tOiBkaW1zLmJvdHRvbVNwYWNpbmcsIHdpZHRoOiBkaW1zLnNpZGViYXJXaWR0aH07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAnQ09OVEFJTkVSLUJPVFRPTSc6XHJcbiAgICAgICAgICBjYXNlICdWSUVXUE9SVC1VTkJPVFRPTSc6XHJcbiAgICAgICAgICAgIGxldCB0cmFuc2xhdGUgPSB0aGlzLl9nZXRUcmFuc2xhdGUoMCwgZGltcy50cmFuc2xhdGVZICsgJ3B4Jyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiggdHJhbnNsYXRlIClcclxuICAgICAgICAgICAgICBzdHlsZS5pbm5lciA9IHt0cmFuc2Zvcm06IHRyYW5zbGF0ZX07XHJcbiAgICAgICAgICAgIGVsc2UgXHJcbiAgICAgICAgICAgICAgc3R5bGUuaW5uZXIgPSB7cG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogZGltcy50cmFuc2xhdGVZLCB3aWR0aDogZGltcy5zaWRlYmFyV2lkdGh9O1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3dpdGNoKCBhZmZpeFR5cGUgKXtcclxuICAgICAgICAgIGNhc2UgJ1ZJRVdQT1JULVRPUCc6XHJcbiAgICAgICAgICBjYXNlICdWSUVXUE9SVC1CT1RUT00nOlxyXG4gICAgICAgICAgY2FzZSAnVklFV1BPUlQtVU5CT1RUT00nOlxyXG4gICAgICAgICAgY2FzZSAnQ09OVEFJTkVSLUJPVFRPTSc6XHJcbiAgICAgICAgICAgIHN0eWxlLm91dGVyID0ge2hlaWdodDogZGltcy5zaWRlYmFySGVpZ2h0LCBwb3NpdGlvbjogJ3JlbGF0aXZlJ307XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBzdHlsZS5vdXRlciA9IFN0aWNreVNpZGViYXIuZXh0ZW5kKHtoZWlnaHQ6ICcnLCBwb3NpdGlvbjogJyd9LCBzdHlsZS5vdXRlcik7XHJcbiAgICAgICAgc3R5bGUuaW5uZXIgPSBTdGlja3lTaWRlYmFyLmV4dGVuZCh7cG9zaXRpb246ICdyZWxhdGl2ZScsIHRvcDogJycsIGxlZnQ6ICcnLFxyXG4gICAgICAgICAgICBib3R0b206ICcnLCB3aWR0aDogJycsICB0cmFuc2Zvcm06IHRoaXMuX2dldFRyYW5zbGF0ZSgpfSwgc3R5bGUuaW5uZXIpO1xyXG4gIFxyXG4gICAgICAgIHJldHVybiBzdHlsZTtcclxuICAgICAgfVxyXG4gICAgIFxyXG4gICAgICAvKipcclxuICAgICAgICogQ2F1c2UgdGhlIHNpZGViYXIgdG8gYmUgc3RpY2t5IGFjY29yZGluZyB0byBhZmZpeCB0eXBlIGJ5IGFkZGluZyBpbmxpbmVcclxuICAgICAgICogc3R5bGUsIGFkZGluZyBoZWxwZXIgY2xhc3MgYW5kIHRyaWdnZXIgZXZlbnRzLlxyXG4gICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICogQHByb3RlY3RlZFxyXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZm9yY2UgLSBVcGRhdGUgc3RpY2t5IHNpZGViYXIgcG9zaXRpb24gYnkgZm9yY2UuXHJcbiAgICAgICAqL1xyXG4gICAgICBzdGlja3lQb3NpdGlvbihmb3JjZSl7XHJcbiAgICAgICAgaWYoIHRoaXMuX2JyZWFrcG9pbnQgKSByZXR1cm47XHJcbiAgXHJcbiAgICAgICAgZm9yY2UgPSB0aGlzLl9yZVN0eWxlIHx8IGZvcmNlIHx8IGZhbHNlO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBvZmZzZXRUb3AgPSB0aGlzLm9wdGlvbnMudG9wU3BhY2luZztcclxuICAgICAgICB2YXIgb2Zmc2V0Qm90dG9tID0gdGhpcy5vcHRpb25zLmJvdHRvbVNwYWNpbmc7XHJcbiAgXHJcbiAgICAgICAgdmFyIGFmZml4VHlwZSA9IHRoaXMuZ2V0QWZmaXhUeXBlKCk7XHJcbiAgICAgICAgdmFyIHN0eWxlID0gdGhpcy5fZ2V0U3R5bGUoYWZmaXhUeXBlKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiggKHRoaXMuYWZmaXhlZFR5cGUgIT0gYWZmaXhUeXBlIHx8IGZvcmNlKSAmJiBhZmZpeFR5cGUgKXtcclxuICAgICAgICAgIGxldCBhZmZpeEV2ZW50ID0gJ2FmZml4LicgKyBhZmZpeFR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCd2aWV3cG9ydC0nLCAnJykgKyBFVkVOVF9LRVk7XHJcbiAgICAgICAgICBTdGlja3lTaWRlYmFyLmV2ZW50VHJpZ2dlcih0aGlzLnNpZGViYXIsIGFmZml4RXZlbnQpO1xyXG4gIFxyXG4gICAgICAgICAgaWYoICdTVEFUSUMnID09PSBhZmZpeFR5cGUgKVxyXG4gICAgICAgICAgICBTdGlja3lTaWRlYmFyLnJlbW92ZUNsYXNzKHRoaXMuc2lkZWJhciwgdGhpcy5vcHRpb25zLnN0aWNreUNsYXNzKTtcclxuICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgU3RpY2t5U2lkZWJhci5hZGRDbGFzcyh0aGlzLnNpZGViYXIsIHRoaXMub3B0aW9ucy5zdGlja3lDbGFzcyk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGZvciggbGV0IGtleSBpbiBzdHlsZS5vdXRlciApe1xyXG4gICAgICAgICAgICBsZXQgX3VuaXQgPSAoJ251bWJlcicgPT09IHR5cGVvZiBzdHlsZS5vdXRlcltrZXldKSA/ICdweCcgOiAnJztcclxuICAgICAgICAgICAgdGhpcy5zaWRlYmFyLnN0eWxlW2tleV0gPSBzdHlsZS5vdXRlcltrZXldO1xyXG4gICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgZm9yKCBsZXQga2V5IGluIHN0eWxlLmlubmVyICl7XHJcbiAgICAgICAgICAgIGxldCBfdW5pdCA9ICgnbnVtYmVyJyA9PT0gdHlwZW9mIHN0eWxlLmlubmVyW2tleV0pID8gJ3B4JyA6ICcnO1xyXG4gICAgICAgICAgICB0aGlzLnNpZGViYXJJbm5lci5zdHlsZVtrZXldID0gc3R5bGUuaW5uZXJba2V5XSArIF91bml0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBsZXQgYWZmaXhlZEV2ZW50ID0gJ2FmZml4ZWQuJysgYWZmaXhUeXBlLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgndmlld3BvcnQtJywgJycpICsgRVZFTlRfS0VZO1xyXG4gICAgICAgICAgU3RpY2t5U2lkZWJhci5ldmVudFRyaWdnZXIodGhpcy5zaWRlYmFyLCBhZmZpeGVkRXZlbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiggdGhpcy5faW5pdGlhbGl6ZWQgKSB0aGlzLnNpZGViYXJJbm5lci5zdHlsZS5sZWZ0ID0gc3R5bGUuaW5uZXIubGVmdDtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgdGhpcy5hZmZpeGVkVHlwZSA9IGFmZml4VHlwZTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvKipcclxuICAgICAgICogQnJlYWtkb3duIHN0aWNreSBzaWRlYmFyIHdoZW4gd2luZG93IHdpZHRoIGlzIGJlbG93IGBvcHRpb25zLm1pbldpZHRoYCB2YWx1ZS5cclxuICAgICAgICogQHByb3RlY3RlZFxyXG4gICAgICAgKi9cclxuICAgICAgX3dpZHRoQnJlYWtwb2ludCgpe1xyXG4gIFxyXG4gICAgICAgIGlmKCB3aW5kb3cuaW5uZXJXaWR0aCA8PSB0aGlzLm9wdGlvbnMubWluV2lkdGggKXtcclxuICAgICAgICAgIHRoaXMuX2JyZWFrcG9pbnQgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5hZmZpeGVkVHlwZSA9ICdTVEFUSUMnO1xyXG4gIFxyXG4gICAgICAgICAgdGhpcy5zaWRlYmFyLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcclxuICAgICAgICAgIFN0aWNreVNpZGViYXIucmVtb3ZlQ2xhc3ModGhpcy5zaWRlYmFyLCB0aGlzLm9wdGlvbnMuc3RpY2t5Q2xhc3MpO1xyXG4gICAgICAgICAgdGhpcy5zaWRlYmFySW5uZXIucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLl9icmVha3BvaW50ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBTd2l0Y2hlcyBiZXR3ZWVuIGZ1bmN0aW9ucyBzdGFjayBmb3IgZWFjaCBldmVudCB0eXBlLCBpZiB0aGVyZSdzIG5vIFxyXG4gICAgICAgKiBldmVudCwgaXQgd2lsbCByZS1pbml0aWFsaXplIHN0aWNreSBzaWRlYmFyLlxyXG4gICAgICAgKiBAcHVibGljXHJcbiAgICAgICAqL1xyXG4gICAgICB1cGRhdGVTdGlja3koZXZlbnQgPSB7fSl7XHJcbiAgICAgICAgaWYoIHRoaXMuX3J1bm5pbmcgKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fcnVubmluZyA9IHRydWU7XHJcbiAgXHJcbiAgICAgICAgKChldmVudFR5cGUpID0+IHtcclxuXHJcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG4gICAgICAgICAgICBzd2l0Y2goIGV2ZW50VHlwZSApe1xyXG4gICAgICAgICAgICAgIC8vIFdoZW4gYnJvd3NlciBpcyBzY3JvbGxpbmcgYW5kIHJlLWNhbGN1bGF0ZSBqdXN0IGRpbWVuc2lvbnNcclxuICAgICAgICAgICAgICAvLyB3aXRoaW4gc2Nyb2xsLiBcclxuICAgICAgICAgICAgICBjYXNlICdzY3JvbGwnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsY0RpbWVuc2lvbnNXaXRoU2Nyb2xsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9ic2VydmVTY3JvbGxEaXIoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RpY2t5UG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gIFxyXG4gICAgICAgICAgICAgIC8vIFdoZW4gYnJvd3NlciBpcyByZXNpemluZyBvciB0aGVyZSdzIG5vIGV2ZW50LCBvYnNlcnZlIHdpZHRoXHJcbiAgICAgICAgICAgICAgLy8gYnJlYWtwb2ludCBhbmQgcmUtY2FsY3VsYXRlIGRpbWVuc2lvbnMuXHJcbiAgICAgICAgICAgICAgY2FzZSAncmVzaXplJzpcclxuICAgICAgICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoQnJlYWtwb2ludCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjRGltZW5zaW9ucygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGlja3lQb3NpdGlvbih0cnVlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pKGV2ZW50LnR5cGUpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBTZXQgYnJvd3NlciBzdXBwb3J0IGZlYXR1cmVzIHRvIHRoZSBwdWJsaWMgcHJvcGVydHkuXHJcbiAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAqL1xyXG4gICAgICBfc2V0U3VwcG9ydEZlYXR1cmVzKCl7XHJcbiAgICAgICAgdmFyIHN1cHBvcnQgPSB0aGlzLnN1cHBvcnQ7XHJcbiAgXHJcbiAgICAgICAgc3VwcG9ydC50cmFuc2Zvcm0gPSBTdGlja3lTaWRlYmFyLnN1cHBvcnRUcmFuc2Zvcm0oKTtcclxuICAgICAgICBzdXBwb3J0LnRyYW5zZm9ybTNkID0gU3RpY2t5U2lkZWJhci5zdXBwb3J0VHJhbnNmb3JtKHRydWUpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBHZXQgdHJhbnNsYXRlIHZhbHVlLCBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0cmFuc2Zyb20zZCwgaXQgd2lsbCBhZG9wdCBpdC5cclxuICAgICAgICogYW5kIHRoZSBzYW1lIHdpdGggdHJhbnNsYXRlLiBpZiBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBib3RoIHJldHVybiBmYWxzZS5cclxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHkgLSBWYWx1ZSBvZiBZLWF4aXMuXHJcbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB4IC0gVmFsdWUgb2YgWC1heGlzLlxyXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0geiAtIFZhbHVlIG9mIFotYXhpcy5cclxuICAgICAgICogQHJldHVybiB7U3RyaW5nfEZhbHNlfVxyXG4gICAgICAgKi9cclxuICAgICAgX2dldFRyYW5zbGF0ZSh5ID0gMCwgeCA9IDAsIHogPSAwKXtcclxuICAgICAgICBpZiggdGhpcy5zdXBwb3J0LnRyYW5zZm9ybTNkICkgcmV0dXJuICd0cmFuc2xhdGUzZCgnICsgeSArJywgJysgeCArJywgJysgeiArJyknO1xyXG4gICAgICAgIGVsc2UgaWYoIHRoaXMuc3VwcG9ydC50cmFuc2xhdGUgKSByZXR1cm4gJ3RyYW5zbGF0ZSgnKyB5ICsnLCAnKyB4ICsnKSc7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLyoqXHJcbiAgICAgICAqIERlc3Ryb3kgc3RpY2t5IHNpZGViYXIgcGx1Z2luLlxyXG4gICAgICAgKiBAcHVibGljXHJcbiAgICAgICAqL1xyXG4gICAgICBkZXN0cm95KCl7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMsIHtjYXB0aW9uOiBmYWxzZX0pO1xyXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLCB7Y2FwdGlvbjogZmFsc2V9KTtcclxuICBcclxuICAgICAgICB0aGlzLnNpZGViYXIuY2xhc3NMaXN0LnJlbW92ZSh0aGlzLm9wdGlvbnMuc3RpY2t5Q2xhc3MpO1xyXG4gICAgICAgIHRoaXMuc2lkZWJhci5zdHlsZS5taW5IZWlnaHQgPSAnJztcclxuICBcclxuICAgICAgICB0aGlzLnNpZGViYXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndXBkYXRlJyArIEVWRU5UX0tFWSwgdGhpcyk7XHJcbiAgXHJcbiAgICAgICAgdmFyIHN0eWxlUmVzZXQgPSB7aW5uZXI6IHt9LCBvdXRlcjoge319O1xyXG4gIFxyXG4gICAgICAgIHN0eWxlUmVzZXQuaW5uZXIgPSB7cG9zaXRpb246ICcnLCB0b3A6ICcnLCBsZWZ0OiAnJywgYm90dG9tOiAnJywgd2lkdGg6ICcnLCAgdHJhbnNmb3JtOiAnJ307XHJcbiAgICAgICAgc3R5bGVSZXNldC5vdXRlciA9IHtoZWlnaHQ6ICcnLCBwb3NpdGlvbjogJyd9O1xyXG4gIFxyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiBzdHlsZVJlc2V0Lm91dGVyIClcclxuICAgICAgICAgIHRoaXMuc2lkZWJhci5zdHlsZVtrZXldID0gc3R5bGVSZXNldC5vdXRlcltrZXldO1xyXG4gIFxyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiBzdHlsZVJlc2V0LmlubmVyIClcclxuICAgICAgICAgIHRoaXMuc2lkZWJhcklubmVyLnN0eWxlW2tleV0gPSBzdHlsZVJlc2V0LmlubmVyW2tleV07XHJcbiAgXHJcbiAgICAgICAgaWYoIHRoaXMub3B0aW9ucy5yZXNpemVTZW5zb3IgJiYgJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBSZXNpemVTZW5zb3IgKXtcclxuICAgICAgICAgIFJlc2l6ZVNlbnNvci5kZXRhY2godGhpcy5zaWRlYmFySW5uZXIsIHRoaXMuaGFuZGxlRXZlbnQpO1xyXG4gICAgICAgICAgUmVzaXplU2Vuc29yLmRldGFjaCh0aGlzLmNvbnRhaW5lciwgdGhpcy5oYW5kbGVFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBEZXRlcm1pbmUgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgQ1NTIHRyYW5zZm9ybSBmZWF0dXJlLlxyXG4gICAgICAgKiBAZnVuY3Rpb25cclxuICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHRyYW5zZm9ybTNkIC0gRGV0ZWN0IHRyYW5zZm9ybSB3aXRoIHRyYW5zbGF0ZTNkLlxyXG4gICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgICAqL1xyXG4gICAgICBzdGF0aWMgc3VwcG9ydFRyYW5zZm9ybSh0cmFuc2Zvcm0zZCl7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBwcm9wZXJ0eSA9ICh0cmFuc2Zvcm0zZCkgPyAncGVyc3BlY3RpdmUnIDogJ3RyYW5zZm9ybScsXHJcbiAgICAgICAgICAgIHVwcGVyID0gcHJvcGVydHkuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBwcm9wZXJ0eS5zbGljZSgxKSxcclxuICAgICAgICAgICAgcHJlZml4ZXMgPSBbJ1dlYmtpdCcsICdNb3onLCAnTycsICdtcyddLFxyXG4gICAgICAgICAgICBzdXBwb3J0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3VwcG9ydCcpLFxyXG4gICAgICAgICAgICBzdHlsZSA9IHN1cHBvcnQuc3R5bGU7XHJcbiAgXHJcbiAgICAgICAgKHByb3BlcnR5ICsgJyAnICsgcHJlZml4ZXMuam9pbih1cHBlciArICcgJykgKyB1cHBlcikuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5LCBpKSB7XHJcbiAgICAgICAgICBpZiAoc3R5bGVbcHJvcGVydHldICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBUcmlnZ2VyIGN1c3RvbSBldmVudC5cclxuICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgKiBAcGFyYW0ge0RPTU9iamVjdH0gZWxlbWVudCAtIFRhcmdldCBlbGVtZW50IG9uIHRoZSBET00uXHJcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgLSBFdmVudCBuYW1lLlxyXG4gICAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIFxyXG4gICAgICAgKi9cclxuICAgICAgc3RhdGljIGV2ZW50VHJpZ2dlcihlbGVtZW50LCBldmVudE5hbWUsIGRhdGEpe1xyXG4gICAgICAgIHRyeXtcclxuICAgICAgICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtkZXRhaWw6IGRhdGF9KTtcclxuICAgICAgICB9IGNhdGNoKGUpe1xyXG4gICAgICAgICAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XHJcbiAgICAgICAgICBldmVudC5pbml0Q3VzdG9tRXZlbnQoZXZlbnROYW1lLCB0cnVlLCB0cnVlLCBkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvKipcclxuICAgICAgICogRXh0ZW5kIG9wdGlvbnMgb2JqZWN0IHdpdGggZGVmYXVsdHMuXHJcbiAgICAgICAqIEBmdW5jdGlvblxyXG4gICAgICAgKiBAc3RhdGljXHJcbiAgICAgICAqL1xyXG4gICAgICBzdGF0aWMgZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKXtcclxuICAgICAgICB2YXIgcmVzdWx0cyA9IHt9O1xyXG4gICAgICAgIGZvciggbGV0IGtleSBpbiBkZWZhdWx0cyApe1xyXG4gICAgICAgICAgaWYoICd1bmRlZmluZWQnICE9PSB0eXBlb2Ygb3B0aW9uc1trZXldICkgcmVzdWx0c1trZXldID0gb3B0aW9uc1trZXldO1xyXG4gICAgICAgICAgZWxzZSByZXN1bHRzW2tleV0gPSBkZWZhdWx0c1trZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvKipcclxuICAgICAgICogR2V0IGN1cnJlbnQgY29vcmRpbmF0ZXMgbGVmdCBhbmQgdG9wIG9mIHNwZWNpZmljIGVsZW1lbnQuXHJcbiAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICovXHJcbiAgICAgIHN0YXRpYyBvZmZzZXRSZWxhdGl2ZShlbGVtZW50KXtcclxuICAgICAgICB2YXIgcmVzdWx0ID0ge2xlZnQ6IDAsIHRvcDogMH07XHJcblxyXG4gICAgICAgIGRve1xyXG4gICAgICAgICAgbGV0IG9mZnNldFRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wO1xyXG4gICAgICAgICAgbGV0IG9mZnNldExlZnQgPSBlbGVtZW50Lm9mZnNldExlZnQ7XHJcbiAgXHJcbiAgICAgICAgICBpZiggISBpc05hTihvZmZzZXRUb3ApIClcclxuICAgICAgICAgICAgcmVzdWx0LnRvcCArPSBvZmZzZXRUb3A7XHJcbiAgXHJcbiAgICAgICAgICBpZiggISBpc05hTihvZmZzZXRMZWZ0KSApXHJcbiAgICAgICAgICAgIHJlc3VsdC5sZWZ0ICs9IG9mZnNldExlZnQ7XHJcblxyXG4gICAgICAgICAgZWxlbWVudCA9ICggJ0JPRFknID09PSBlbGVtZW50LnRhZ05hbWUgKSA/XHJcbiAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQgOiBlbGVtZW50Lm9mZnNldFBhcmVudDtcclxuICAgICAgICB9IHdoaWxlKGVsZW1lbnQpXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvKipcclxuICAgICAgICogQWRkIHNwZWNpZmljIGNsYXNzIG5hbWUgdG8gc3BlY2lmaWMgZWxlbWVudC5cclxuICAgICAgICogQHN0YXRpYyBcclxuICAgICAgICogQHBhcmFtIHtPYmplY3RET019IGVsZW1lbnQgXHJcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgXHJcbiAgICAgICAqL1xyXG4gICAgICBzdGF0aWMgYWRkQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKXtcclxuICAgICAgICBpZiggISBTdGlja3lTaWRlYmFyLmhhc0NsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkgKXtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdClcclxuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzTmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBSZW1vdmUgc3BlY2lmaWMgY2xhc3MgbmFtZSB0byBzcGVjaWZpYyBlbGVtZW50XHJcbiAgICAgICAqIEBzdGF0aWNcclxuICAgICAgICogQHBhcmFtIHtPYmplY3RET019IGVsZW1lbnQgXHJcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgXHJcbiAgICAgICAqL1xyXG4gICAgICBzdGF0aWMgcmVtb3ZlQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKXtcclxuICAgICAgICBpZiggU3RpY2t5U2lkZWJhci5oYXNDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpICl7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpXHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnKF58XFxcXGIpJyArIGNsYXNzTmFtZS5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBEZXRlcm1pbmUgd2VhdGhlciB0aGUgZWxlbWVudCBoYXMgc3BlY2lmaWMgY2xhc3MgbmFtZS5cclxuICAgICAgICogQHN0YXRpY1xyXG4gICAgICAgKiBAcGFyYW0ge09iamVjdERPTX0gZWxlbWVudCBcclxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZSBcclxuICAgICAgICovXHJcbiAgICAgIHN0YXRpYyBoYXNDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpe1xyXG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdClcclxuICAgICAgICAgIHJldHVybiBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKCcoXnwgKScgKyBjbGFzc05hbWUgKyAnKCB8JCknLCAnZ2knKS50ZXN0KGVsZW1lbnQuY2xhc3NOYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIFxyXG4gICAgcmV0dXJuIFN0aWNreVNpZGViYXI7XHJcbiAgfSkoKTtcclxuICBcclxuICBleHBvcnQgZGVmYXVsdCBTdGlja3lTaWRlYmFyO1xyXG4gIFxyXG4gIC8vIEdsb2JhbFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICB3aW5kb3cuU3RpY2t5U2lkZWJhciA9IFN0aWNreVNpZGViYXI7IiwiaW1wb3J0IFN0aWNreVNpZGViYXIgZnJvbSBcInN0aWNreS1zaWRlYmFyXCI7XHJcblxyXG5pZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpZGViYXInKSkge1xyXG4gIHZhciBzaWRlYmFyID0gbmV3IFN0aWNreVNpZGViYXIoJy5zaWRlYmFyJywge1xyXG4gICAgICAgICAgY29udGFpbmVyU2VsZWN0b3I6ICcubGF5b3V0JyxcclxuICAgICAgICAgIGlubmVyV3JhcHBlclNlbGVjdG9yOiAnLnNpZGViYXJfX2lubmVyJyxcclxuICAgICAgICAgIHRvcFNwYWNpbmc6IDMwLFxyXG4gICAgICAgICAgYm90dG9tU3BhY2luZzogMjBcclxuICB9KTtcclxufVxyXG4iXSwibmFtZXMiOlsiSVNNT0JJTEUiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwibWF0Y2hlcyIsIlRIUkVTSE9MRCIsIkxPQURfVEhSRVNIT0xEIiwiRUxFTUVOVFMiLCJWSVNJQkxFX0NMQVNTIiwiQW5pbWF0ZSIsImVudHJpZXMiLCJtYXAiLCJlbnRyeSIsInNlY3Rpb24iLCJ0YXJnZXQiLCJkZWxheSIsImdldERlbGF5Iiwic2VjdGlvbkJvZHlDbGFzcyIsImdldEF0dHJpYnV0ZSIsImlzSW50ZXJzZWN0aW5nIiwiY2xhc3NMaXN0IiwiYWRkIiwiYm9keUNsYXNzIiwic2V0VGltZW91dCIsImluY2x1ZGVzIiwicGFyc2VJbnQiLCJodG1sY2xhc3MiLCJ0eXBlIiwiZG9jdW1lbnQiLCJib2R5IiwicmVtb3ZlIiwic2VjdGlvbnMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImVsIiwiQm91bmRpbmdDbGllbnRSZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidmlzaWJsZVJhdGlvIiwiaGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJsb2FkT2JzZXJ2ZXIiLCJJbnRlcnNlY3Rpb25PYnNlcnZlciIsIm9ic2VydmVDYWxsYmFjayIsInRocmVzaG9sZCIsIm9ic2VydmUiLCJkaXNjb25uZWN0Iiwib2JzZXJ2ZXJUaHJlc2hvbGQiLCJvYnNlcnZlciIsInF1ZXJ5U2VsZWN0b3IiLCJTcGxpZGUiLCJwYWdpbmF0aW9uIiwicGVyUGFnZSIsInBlck1vdmUiLCJnYXAiLCJicmVha3BvaW50cyIsIm1vdW50IiwiVE9HR0xFX0NMQVNTIiwiVG9nZ2xlTmF2IiwiZWxlbWVudHMiLCJhZGRFdmVudExpc3RlbmVyIiwidG9nZ2xlTmF2IiwiZSIsInRvZ2dsZSIsInByZXZlbnREZWZhdWx0IiwiZ2xvYmFsIiwiU2ltcGxlTGlnaHRib3giLCJTdGlja3lTaWRlYmFyIiwiY29udGFpbmVyU2VsZWN0b3IiLCJpbm5lcldyYXBwZXJTZWxlY3RvciIsInRvcFNwYWNpbmciLCJib3R0b21TcGFjaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBQUE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUVDLElBQU1BLFFBQVEsR0FBR0MsTUFBTSxDQUFDQyxVQUFQLENBQWtCLG9DQUFsQixFQUF3REMsT0FBekU7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LENBQUMsQ0FBQztFQUNsRCxDQUFDO0FBQ0Q7RUFDQSxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7RUFDZixTQUFTLFFBQVEsQ0FBQyxNQUFNLEVBQUU7RUFDMUIsRUFBRSxPQUFPLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDakUsQ0FBQztBQUNEO0VBQ0EsU0FBUyxRQUFRLEdBQUc7RUFDcEIsRUFBRSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7RUFDcEIsRUFBRSxTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxRQUFRLEdBQUcsc0JBQXNCLEVBQUU7RUFDeEUsSUFBSSxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLFNBQVMsS0FBSztFQUMvQyxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0VBQzlDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtFQUM1QixRQUFRLE1BQU0sRUFBRSxLQUFLO0VBQ3JCLFFBQVEsU0FBUyxFQUFFLFFBQVE7RUFDM0IsUUFBUSxVQUFVLEVBQUUsU0FBUztFQUM3QixRQUFRLFNBQVMsRUFBRSxRQUFRO0VBQzNCLFFBQVEsSUFBSSxFQUFFLEdBQUc7RUFDakIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsS0FBSyxRQUFRLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUMvRSxLQUFLLENBQUMsQ0FBQztFQUNQLEdBQUc7RUFDSCxFQUFFLFNBQVMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7RUFDNUIsSUFBSSxZQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxF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RyxDQUFDLENBQUMsRUFBRTtBQUMxWDtFQUNBLFNBQVMsMEJBQTBCLENBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksY0FBYyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUssUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxJQUFJLFNBQVMsQ0FBQyx1SUFBdUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLGdCQUFnQixHQUFHLElBQUksRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsZ0JBQWdCLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDNStCO0VBQ0EsU0FBUywyQkFBMkIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUUsT0FBTyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUUsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssV0FBVyxJQUFJLDBDQUEwQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLGlCQUFpQixDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFFO0FBQ2hhO0VBQ0EsU0FBUyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLElBQUksQ0FBQyxFQUFFO0FBQ3ZMO0VBQ0EsU0FBUyxlQUFlLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLFlBQVksV0FBVyxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsRUFBRSxFQUFFO0FBQ3pKO0VBQ0EsU0FBUyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxJ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USxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQ3hELE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQztFQUN0RCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDL0QsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0VBQzlELE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLDRCQUE0QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxxQ0FBcUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztFQUM1TCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDNUQsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQ3hELE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLGlFQUFpRSxDQUFDO0VBQzFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUM1RCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQy9GO0VBQ0EsTUFBTSxJQUFJLElB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LENBQUMsa0JBQWtCLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUNsbkIsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsZUFBZSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsZUFBZSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxLQUFLLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDcm5CO0VBQ0EsVUFBVSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsSUFBSSxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsSUFBSSxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN2SztFQUNBLFVBQVUsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRTtFQUN6RCxZQUFZLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ3BEO0VBQ0EsWUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLE1BQU0sRUFBRTtFQUM1RyxjQUFjLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUNoRixhQUFhO0VBQ2IsV0FBVyxNQUFNO0VBQ2pCLFlBQVksSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxLQUFLLENBQUMsRUFBRTtFQUM5RCxjQUFjLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3ZEO0VBQ0EsY0FBYyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssTUFBTSxFQUFFO0VBQ3BFLGdCQUFnQixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDakYsZUFBZTtFQUNmLGFBQWE7QUFDYjtFQUNBLFlBQVksTUFBTSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztFQUNsRSxZQUFZLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0VBQ3RELFdBQVc7QUFDWDtFQUNBLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsQ0FBQztFQUN6RyxVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztFQUN6RixVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQztFQUM3RixVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQztBQUM3RjtFQUNBLFVBQVUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3RKO0VBQ0EsVUFBVSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsSUFBSSxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsSUFBSSxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztFQUN2SyxTQUFTLENBQUMsQ0FBQztFQUNYLE9BQU87QUFDUDtFQUNBLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxVQUFVLEtBQUssRUFBRTtFQUM3SSxRQUFRLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFFO0VBQ3pFLFVBQVUsT0FBTyxJQUFJLENBQUM7RUFDdEIsU0FBUztBQUNUO0VBQ0EsUUFBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO0VBQ3hDLFVBQVUsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO0VBQ2pDLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7RUFDMUUsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztFQUMxRSxVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQztFQUN6RyxVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUN2RyxVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDO0VBQ2pHLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUM7RUFDL0YsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO0VBQ3hGLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztFQUN2RixVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQ3hHLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDeEcsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztFQUNuRCxTQUFTLE1BQU07RUFDZixVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7RUFDdEUsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7RUFDckYsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7RUFDckYsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDekcsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUM7RUFDdkcsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLE1BQU0sQ0FBQztFQUNqRyxVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxDQUFDO0VBQy9GLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztFQUN4RixVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7QUFDdkY7RUFDQSxVQUFVLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxDQUFDO0VBQ3hEO0VBQ0EsWUFBWTtFQUNaLGNBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUU7RUFDM0QsZ0JBQWdCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0VBQzlELGdCQUFnQixVQUFVLENBQUMsWUFBWTtFQUN2QyxrQkFBa0IsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7RUFDakUsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDeEIsZUFBZSxNQUFNO0VBQ3JCLGdCQUFnQixNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDbkU7RUFDQSxnQkFBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUU7RUFDdkQsa0JBQWtCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7QUFDeEY7RUFDQSxrQkFBa0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNuRjtFQUNBLGtCQUFrQixNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDcEc7RUFDQSxrQkFBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUU7RUFDbEgsb0JBQW9CLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUN0RixtQkFBbUI7QUFDbkI7RUFDQSxrQkFBa0IsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7RUFDMUQsaUJBQWlCLE1BQU07RUFDdkIsa0JBQWtCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQzdEO0VBQ0Esa0JBQWtCLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkY7RUFDQSxrQkFBa0IsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BHO0VBQ0Esa0JBQWtCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0VBQzNELGlCQUFpQjtBQUNqQjtFQUNBLGdCQUFnQixVQUFVLENBQUMsWUFBWTtFQUN2QyxrQkFBa0IsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFO0VBQzNDLG9CQUFvQixNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7RUFDMUUsbUJBQW1CO0VBQ25CLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ3hCLGdCQUFnQixPQUFPLEtBQUssQ0FBQztFQUM3QixlQUFlO0FBQ2Y7RUFDQSxjQUFjLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQzVHLGNBQWMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDNUcsYUFBYSxNQUFNLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxDQUFDO0VBQ2pFO0VBQ0EsWUFBWTtFQUNaLGNBQWMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0VBQzFGLGNBQWMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0VBQzFGLGNBQWMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDNUcsY0FBYyxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztFQUM1RyxjQUFjLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHNCQUFzQixJQUFJLENBQUMsQ0FBQztFQUNoSyxjQUFjLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHNCQUFzQixJQUFJLENBQUMsQ0FBQztFQUNoSyxjQUFjLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxzQkFBc0IsS0FBSyxNQUFNLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHNCQUFzQixLQUFLLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0VBQ3BlLGFBQWE7QUFDYjtFQUNBLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7RUFDbkQsU0FBUztBQUNUO0VBQ0EsUUFBUSxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxJQUFJLENBQUM7QUFDN0Q7RUFDQSxRQUFRLElBQUksTUFBTSxDQUFDLGlCQUFpQixFQUFFO0VBQ3RDLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztFQUMvRixTQUFTO0FBQ1Q7RUFDQSxRQUFRLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0VBQ25ELFFBQVEsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7RUFDaEQsUUFBUSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztFQUNqRCxRQUFRLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUNyRixRQUFRLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUN0RixRQUFRLE9BQU8sS0FBSyxDQUFDO0VBQ3JCLE9BQU8sQ0FBQyxDQUFDO0VBQ1QsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsRUFBRSxVQUFVLEtBQUssRUFBRTtFQUM3SixRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFO0VBQ2xELFVBQVUsT0FBTyxJQUFJLENBQUM7RUFDdEIsU0FBUztBQUNUO0VBQ0EsUUFBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO0VBQ3hDLFVBQVUsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxLQUFLLEtBQUssRUFBRTtFQUMzRCxZQUFZLE9BQU8sS0FBSyxDQUFDO0VBQ3pCLFdBQVc7QUFDWDtFQUNBLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztFQUM5RSxVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7RUFDOUUsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0VBQ3RFLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3JEO0VBQ0EsVUFBVSxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEdBQUcsQ0FBQztFQUN0RDtFQUNBLFlBQVk7RUFDWixjQUFjLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7RUFDbkYsY0FBYyxNQUFNLENBQUMsa0JBQWtCLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0VBQ25GLGNBQWMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEtBQUssTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEtBQUssTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztBQUMzYTtFQUNBLGNBQWMsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEtBQUssSUFBSSxFQUFFO0VBQzNFLGdCQUFnQixNQUFNLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDO0VBQy9HLGVBQWU7QUFDZjtFQUNBLGNBQWMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEVBQUU7RUFDakk7RUFDQSxnQkFBZ0IsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUMxTyxnQkFBZ0IsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxJQUFJLENBQUMsQ0FBQztFQUNyTCxnQkFBZ0IsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsZUFBZSxJQUFJLENBQUMsQ0FBQztFQUN2TCxnQkFBZ0IsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUM7RUFDM0ksZ0JBQWdCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUN4bkIsZ0JBQWdCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEtBQUssTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMzbkI7RUFDQSxnQkFBZ0IsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsYUFBYSxHQUFHLElBQUksRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsYUFBYSxHQUFHLElBQUksRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDN0s7RUFDQSxnQkFBZ0IsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRTtFQUMvRCxrQkFBa0IsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDMUQ7RUFDQSxrQkFBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUU7RUFDbEgsb0JBQW9CLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUN0RixtQkFBbUI7RUFDbkIsaUJBQWlCO0FBQ2pCO0VBQ0EsZ0JBQWdCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUM7RUFDL0csZ0JBQWdCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQztFQUMvRixnQkFBZ0IsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDO0VBQ25HLGdCQUFnQixNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUM7RUFDbkcsZUFBZTtFQUNmLGFBQWEsTUFBTTtFQUNuQixZQUFZLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQztFQUMzRixZQUFZLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUM7RUFDakwsWUFBWSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDO0VBQ25MLFlBQVksTUFBTSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEVBQUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7RUFDL1osWUFBWSxNQUFNLENBQUMsa0JBQWtCLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsZUFBZSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNqYTtFQUNBLFlBQVksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsRUFBRTtFQUN4SCxjQUFjLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQztFQUNqRyxjQUFjLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDO0VBQ3pHLGFBQWE7QUFDYjtFQUNBLFlBQVksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsRUFBRTtFQUN4SCxjQUFjLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQztFQUNqRyxjQUFjLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDO0VBQ3pHLGFBQWE7QUFDYjtFQUNBLFlBQVksTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ3pKO0VBQ0EsWUFBWSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsSUFBSSxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsSUFBSSxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztFQUN6SyxXQUFXO0VBQ1gsU0FBUztFQUNUO0FBQ0E7QUFDQTtFQUNBLFFBQVEsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFO0VBQy9FLFVBQVUsSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLFdBQVcsRUFBRSxPQUFPLElBQUksQ0FBQztFQUNyRCxVQUFVLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztFQUNqQyxVQUFVLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sS0FBSyxLQUFLLEVBQUUsT0FBTyxLQUFLLENBQUM7RUFDeEUsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7RUFDbkUsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7RUFDbkUsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUM7RUFDekYsVUFBVSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLElBQUksQ0FBQyxDQUFDO0VBQy9LLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsZUFBZSxJQUFJLENBQUMsQ0FBQztFQUNqTCxVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQzdaLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLEVBQUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDL1o7RUFDQSxVQUFVLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLEVBQUU7RUFDdEgsWUFBWSxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUM7RUFDL0YsWUFBWSxNQUFNLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQztFQUN2RyxXQUFXO0FBQ1g7RUFDQSxVQUFVLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLEVBQUU7RUFDdEgsWUFBWSxNQUFNLENBQUMsa0JBQWtCLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUM7RUFDL0YsWUFBWSxNQUFNLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQztFQUN2RyxXQUFXO0FBQ1g7RUFDQSxVQUFVLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN2SjtFQUNBLFVBQVUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsYUFBYSxHQUFHLElBQUksRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsYUFBYSxHQUFHLElBQUksRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDdkssU0FBUztBQUNUO0VBQ0EsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRTtFQUMvQyxVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUNyRixVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUN0RixVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDO0VBQzFILFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7QUFDN0g7RUFDQSxVQUFVLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUU7RUFDN0MsWUFBWSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUM7RUFDekUsV0FBVztFQUNYLFNBQVM7RUFDVCxPQUFPLENBQUMsQ0FBQztFQUNULE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLENBQUMsRUFBRSxVQUFVLEtBQUssRUFBRTtFQUNwUixRQUFRLElBQUksTUFBTSxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtFQUMvRCxVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDdEU7RUFDQSxVQUFVLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxDQUFDO0VBQ3hEO0VBQ0EsWUFBWTtFQUNaO0VBQ0EsY0FBYyxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUU7RUFDdkMsZ0JBQWdCLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztFQUM3SixlQUFlO0FBQ2Y7RUFDQSxjQUFjLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksS0FBSyxDQUFDLEVBQUU7RUFDaEUsZ0JBQWdCLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQ3pEO0VBQ0EsZ0JBQWdCLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUU7RUFDdEUsa0JBQWtCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUNuRixpQkFBaUI7RUFDakIsZUFBZTtBQUNmO0VBQ0EsY0FBYyxNQUFNLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0VBQ3BFLGNBQWMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7RUFDeEQsYUFBYSxNQUFNLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsS0FBSyxDQUFDO0VBQ2pFO0VBQ0EsWUFBWTtFQUNaLGNBQWMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0VBQ3pGLGNBQWMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0VBQ3pGLGFBQWEsTUFBTSxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLEdBQUcsQ0FBQztFQUMvRDtFQUNBLFlBQVk7RUFDWixjQUFjLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7RUFDcEUsYUFBYTtFQUNiLFNBQVM7QUFDVDtFQUNBLFFBQVEsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxFQUFFO0VBQ2pELFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7RUFDdEQsVUFBVSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDakM7RUFDQSxVQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtFQUNwQyxZQUFZLElBQUksTUFBTSxDQUFDLGlCQUFpQixLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRTtFQUMzRixjQUFjLFdBQVcsR0FBRyxLQUFLLENBQUM7RUFDbEMsYUFBYTtBQUNiO0VBQ0EsWUFBWSxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsSUFBSSxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUU7RUFDMUgsY0FBYyxXQUFXLEdBQUcsS0FBSyxDQUFDO0VBQ2xDLGFBQWE7RUFDYixXQUFXO0FBQ1g7RUFDQSxVQUFVLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLElBQUksV0FBVyxFQUFFO0VBQzVHLFlBQVksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsU0FBUyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMvRSxXQUFXLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRTtFQUNwRCxZQUFZLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztFQUN6RSxXQUFXO0FBQ1g7RUFDQSxVQUFVLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFO0VBQ2pMLFlBQVksTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0VBQzNCLFdBQVc7RUFDWCxTQUFTO0VBQ1QsT0FBTyxDQUFDLENBQUM7RUFDVCxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQVUsS0FBSyxFQUFFO0VBQ2hGLFFBQVEsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFLE9BQU87RUFDekMsUUFBUSxNQUFNLENBQUMsa0JBQWtCLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztFQUN4RSxRQUFRLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0VBQ3hFLFFBQVEsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDO0VBQ3ZHLFFBQVEsTUFBTSxDQUFDLGtCQUFrQixDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO0VBQ3JHLFFBQVEsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUM7RUFDL0YsUUFBUSxNQUFNLENBQUMsa0JBQWtCLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQztFQUM3RixRQUFRLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7RUFDdEYsUUFBUSxNQUFNLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0FBQ3JGO0VBQ0EsUUFBUSxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDM0Q7RUFDQSxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFO0VBQy9DLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztBQUNoRjtFQUNBLFVBQVUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMzRTtFQUNBLFVBQVUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzVGO0VBQ0EsVUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLE1BQU0sRUFBRTtFQUMxRyxZQUFZLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUM5RSxXQUFXO0FBQ1g7RUFDQSxVQUFVLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0VBQ2xELFNBQVMsTUFBTTtFQUNmLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7QUFDckQ7RUFDQSxVQUFVLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0U7RUFDQSxVQUFVLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM1RjtFQUNBLFVBQVUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7QUFDbkQ7RUFDQSxVQUFVLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUU7RUFDaEUsWUFBWSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDN0UsV0FBVztFQUNYLFNBQVM7QUFDVDtFQUNBLFFBQVEsVUFBVSxDQUFDLFlBQVk7RUFDL0IsVUFBVSxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUU7RUFDbkMsWUFBWSxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDbEU7RUFDQSxZQUFZLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLElBQUksQ0FBQztFQUMzRixXQUFXO0VBQ1gsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ2hCLFFBQVEsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7RUFDakQsUUFBUSxPQUFPLEtBQUssQ0FBQztFQUNyQixPQUFPLENBQUMsQ0FBQztFQUNULEtBQUs7RUFDTCxHQUFHLEVBQUU7RUFDTCxJQUFJLEdBQUcsRUFBRSxlQUFlO0VBQ3hCLElBQUksS0FBSyxFQUFFLFNBQVMsYUFBYSxDQUFDLE9BQU8sRUFBRTtFQUMzQyxNQUFNLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7RUFDbkQsVUFBVSxNQUFNLEdBQUcsT0FBTyxDQUFDLFlBQVk7RUFDdkMsVUFBVSxLQUFLLEdBQUcsT0FBTyxDQUFDLFdBQVc7RUFDckMsVUFBVSxjQUFjLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7RUFDNUQsVUFBVSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0VBQ2xFLFVBQVUsVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0VBQ3BELFVBQVUsYUFBYSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDO0VBQzFELFVBQVUsZUFBZSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDO0VBQzlELFVBQVUsZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztFQUNoRSxVQUFVLFdBQVcsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztFQUN0RCxVQUFVLFlBQVksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQ3pELE1BQU0sT0FBTztFQUNiLFFBQVEsTUFBTSxFQUFFLE1BQU0sR0FBRyxpQkFBaUIsR0FBRyxjQUFjLEdBQUcsVUFBVSxHQUFHLGFBQWE7RUFDeEYsUUFBUSxLQUFLLEVBQUUsS0FBSyxHQUFHLGVBQWUsR0FBRyxnQkFBZ0IsR0FBRyxXQUFXLEdBQUcsWUFBWTtFQUN0RixPQUFPLENBQUM7RUFDUixLQUFLO0VBQ0wsR0FBRyxFQUFFO0VBQ0wsSUFBSSxHQUFHLEVBQUUsWUFBWTtFQUNyQixJQUFJLEtBQUssRUFBRSxTQUFTLFVBQVUsR0FBRztFQUNqQyxNQUFNLElBQUksT0FBTyxHQUFHLE1BQU0sSUFBSSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDO0VBQ3pELFVBQVUsTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsT0FBTyxDQUFDO0VBQ3RFLE1BQU0sSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDL0I7RUFDQSxNQUFNLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO0VBQ2pDLFFBQVEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsY0FBYyxHQUFHLFdBQVcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0VBQzFHLE9BQU8sTUFBTTtFQUNiO0VBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtFQUNwQyxVQUFVLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQzFDLFNBQVMsTUFBTTtFQUNmLFVBQVUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO0VBQ3pDLFNBQVM7RUFDVCxPQUFPO0FBQ1A7RUFDQSxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7RUFDbkMsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztFQUNuQyxPQUFPO0FBQ1A7RUFDQSxNQUFNLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7RUFDcEMsS0FBSztFQUNMLEdBQUcsRUFBRTtFQUNMLElBQUksR0FBRyxFQUFFLFdBQVc7RUFDcEIsSUFBSSxLQUFLLEVBQUUsU0FBUyxTQUFTLEdBQUc7RUFDaEMsTUFBTSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUM5QjtFQUNBLE1BQU0sSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0VBQy9CLFFBQVEsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0VBQ3ZCLE9BQU8sTUFBTTtFQUNiLFFBQVEsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7RUFDbkMsVUFBVSxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7RUFDbkcsU0FBUyxNQUFNO0VBQ2YsVUFBVSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7RUFDcEMsU0FBUztFQUNULE9BQU87RUFDUDtBQUNBO0FBQ0E7RUFDQSxNQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztFQUM5QyxLQUFLO0VBQ0wsR0FBRyxFQUFFO0VBQ0wsSUFBSSxHQUFHLEVBQUUsV0FBVztFQUNwQixJQUFJLEtBQUssRUFBRSxTQUFTLFNBQVMsR0FBRztFQUNoQyxNQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUM5QztFQUNBLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtFQUNuQyxRQUFRLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztFQUMxQixPQUFPLE1BQU07RUFDYixRQUFRLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7RUFDaEYsT0FBTztFQUNQLEtBQUs7RUFDTCxHQUFHLEVBQUU7RUFDTCxJQUFJLEdBQUcsRUFBRSxZQUFZO0VBQ3JCLElBQUksS0FBSyxFQUFFLFNBQVMsVUFBVSxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUU7RUFDeEQsTUFBTSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDeEI7RUFDQSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksV0FBVyxJQUFJLFdBQVcsS0FBSyxFQUFFLElBQUksT0FBTyxXQUFXLEtBQUssV0FBVyxFQUFFO0VBQzVHLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ3pDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDO0VBQzlELFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQztFQUN0RCxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQy9ELFFBQVEsVUFBVSxDQUFDLFlBQVk7RUFDL0IsVUFBVSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDM0UsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7RUFDdEMsT0FBTztFQUNQLEtBQUs7RUFDTCxHQUFHLEVBQUU7RUFDTCxJQUFJLEdBQUcsRUFBRSxPQUFPO0VBQ2hCLElBQUksS0FBSyxFQUFFLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7RUFDdEMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO0VBQ25DLFFBQVEsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztFQUNwRCxPQUFPO0FBQ1A7RUFDQSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLEdBQUcsYUFBYSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7RUFDakcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxZQUFZLEdBQUcsS0FBSyxHQUFHLFVBQVUsQ0FBQztFQUNsSSxLQUFLO0VBQ0wsR0FBRyxFQUFFO0VBQ0wsSUFBSSxHQUFHLEVBQUUsWUFBWTtFQUNyQixJQUFJLEtBQUssRUFBRSxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUU7RUFDcEMsTUFBTSxJQUFJLEtBQUssQ0FBQztBQUNoQjtFQUNBLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxLQUFLLEtBQUssSUFBSSxHQUFHLEtBQUssVUFBVSxFQUFFO0VBQ3RELFFBQVEsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLE9BQU8sRUFBRTtFQUNwRSxVQUFVLE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUM7RUFDckQsU0FBUyxDQUFDLENBQUM7RUFDWCxPQUFPLE1BQU07RUFDYixRQUFRLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0VBQzlCLE9BQU87QUFDUDtFQUNBLE1BQU0sT0FBTyxLQUFLLENBQUM7RUFDbkIsS0FBSztFQUNMLEdBQUcsRUFBRTtFQUNMLElBQUksR0FBRyxFQUFFLFdBQVc7RUFDcEIsSUFBSSxLQUFLLEVBQUUsU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFO0VBQ3ZDLE1BQU0sSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ3hCO0VBQ0EsTUFBTSxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUN0RTtFQUNBLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRTtFQUN0QyxRQUFRLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ2pFLE9BQU87QUFDUDtFQUNBLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsS0FBSyxFQUFFLEVBQUU7RUFDbkUsUUFBUSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUM3RSxPQUFPO0FBQ1A7RUFDQSxNQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDdkQsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3RDtFQUNBLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtFQUNoQyxRQUFRLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDekQsT0FBTztBQUNQO0VBQ0EsTUFBTSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFEO0VBQ0EsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO0VBQ3BDLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7RUFDdkcsVUFBVSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUNuRSxTQUFTLE1BQU0sSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRTtFQUM5RyxVQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ25FLFNBQVM7RUFDVCxPQUFPO0FBQ1A7RUFDQSxNQUFNLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0VBQzlCLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0VBQ3JFLE1BQU0sSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQ3BFLE1BQU0sSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ3hELE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztFQUMvQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztFQUN2RCxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7RUFDMUMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0VBQy9DLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztBQUMvQztFQUNBLE1BQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtFQUN2RCxRQUFRLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzFDLE9BQU87QUFDUDtFQUNBLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztFQUN6QyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDcEQsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQ3pELE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ2pFLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUN4SCxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUN2QyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztFQUNoRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUM7RUFDL0YsTUFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDekI7RUFDQSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7RUFDbkMsUUFBUSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7RUFDdkIsT0FBTztBQUNQO0VBQ0EsTUFBTSxVQUFVLENBQUMsWUFBWTtFQUM3QixRQUFRLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0VBQzNFLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0VBQ3RDLEtBQUs7RUFDTCxHQUFHLEVBQUU7RUFDTCxJQUFJLEdBQUcsRUFBRSxZQUFZO0VBQ3JCLElBQUksS0FBSyxFQUFFLFNBQVMsVUFBVSxHQUFHO0VBQ2pDLE1BQU0sSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ3hCO0VBQ0EsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7RUFDM0UsTUFBTSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLFVBQVUsS0FBSyxFQUFFO0VBQ3pGLFFBQVEsSUFBSSxRQUFRLEtBQUssS0FBSyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtFQUN0SSxVQUFVLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO0VBQzFDLFNBQVM7RUFDVCxPQUFPLENBQUMsQ0FBQztFQUNULEtBQUs7QUFDTDtFQUNBLEdBQUcsRUFBRTtFQUNMLElBQUksR0FBRyxFQUFFLGtCQUFrQjtFQUMzQixJQUFJLEtBQUssRUFBRSxTQUFTLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtFQUN2RSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0VBQ3JDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDakM7RUFDQSxNQUFNLElBQUksU0FBUyxHQUFHLDBCQUEwQixDQUFDLFFBQVEsQ0FBQztFQUMxRCxVQUFVLEtBQUssQ0FBQztBQUNoQjtFQUNBLE1BQU0sSUFBSTtFQUNWLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHO0VBQzVELFVBQVUsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUNwQztFQUNBLFVBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7RUFDbkMsWUFBWSxPQUFPLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztFQUNwQyxXQUFXO0FBQ1g7QUFDQTtFQUNBLFVBQVUsSUFBSSxVQUFVLEdBQUcsMEJBQTBCLENBQUMsTUFBTSxDQUFDO0VBQzdELGNBQWMsTUFBTSxDQUFDO0FBQ3JCO0VBQ0EsVUFBVSxJQUFJO0VBQ2QsWUFBWSxLQUFLLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUc7RUFDbkUsY0FBYyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0VBQ3ZDLGNBQWMsSUFBSSxPQUFPLEdBQUcsSUFBSSxJQUFJLEtBQUssQ0FBQztFQUMxQyxjQUFjLElBQUksZUFBZSxHQUFHLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xHO0VBQ0EsY0FBYyxJQUFJLGVBQWUsSUFBSSxJQUFJLENBQUMsd0JBQXdCLEVBQUU7RUFDcEUsZ0JBQWdCLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtFQUNuRCxrQkFBa0IsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7RUFDekMsaUJBQWlCLE1BQU07RUFDdkIsa0JBQWtCLE9BQU8sR0FBRztFQUM1QixvQkFBb0IsT0FBTyxFQUFFLElBQUk7RUFDakMsbUJBQW1CLENBQUM7RUFDcEIsaUJBQWlCO0VBQ2pCLGVBQWU7QUFDZjtFQUNBLGNBQWMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUM7RUFDbkQsY0FBYyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7RUFDL0UsYUFBYTtFQUNiLFdBQVcsQ0FBQyxPQUFPLEdBQUcsRUFBRTtFQUN4QixZQUFZLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDOUIsV0FBVyxTQUFTO0VBQ3BCLFlBQVksVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDO0VBQzNCLFdBQVc7RUFDWCxTQUFTO0VBQ1QsT0FBTyxDQUFDLE9BQU8sR0FBRyxFQUFFO0VBQ3BCLFFBQVEsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUN6QixPQUFPLFNBQVM7RUFDaEIsUUFBUSxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUM7RUFDdEIsT0FBTztFQUNQLEtBQUs7RUFDTCxHQUFHLEVBQUU7RUFDTCxJQUFJLEdBQUcsRUFBRSxxQkFBcUI7RUFDOUIsSUFBSSxLQUFLLEVBQUUsU0FBUyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFO0VBQzFELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7RUFDckMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQztFQUNBLE1BQU0sSUFBSSxVQUFVLEdBQUcsMEJBQTBCLENBQUMsUUFBUSxDQUFDO0VBQzNELFVBQVUsTUFBTSxDQUFDO0FBQ2pCO0VBQ0EsTUFBTSxJQUFJO0VBQ1YsUUFBUSxLQUFLLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUc7RUFDL0QsVUFBVSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0FBQ3JDO0VBQ0EsVUFBVSxJQUFJLFVBQVUsR0FBRywwQkFBMEIsQ0FBQyxNQUFNLENBQUM7RUFDN0QsY0FBYyxNQUFNLENBQUM7QUFDckI7RUFDQSxVQUFVLElBQUk7RUFDZCxZQUFZLEtBQUssVUFBVSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksR0FBRztFQUNuRSxjQUFjLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDdkM7RUFDQSxjQUFjLElBQUksT0FBTyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQ25FLGdCQUFnQixPQUFPLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7RUFDNUYsZ0JBQWdCLE9BQU8sT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNqRCxlQUFlO0VBQ2YsYUFBYTtFQUNiLFdBQVcsQ0FBQyxPQUFPLEdBQUcsRUFBRTtFQUN4QixZQUFZLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDOUIsV0FBVyxTQUFTO0VBQ3BCLFlBQVksVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDO0VBQzNCLFdBQVc7RUFDWCxTQUFTO0VBQ1QsT0FBTyxDQUFDLE9BQU8sR0FBRyxFQUFFO0VBQ3BCLFFBQVEsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUMxQixPQUFPLFNBQVM7RUFDaEIsUUFBUSxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUM7RUFDdkIsT0FBTztFQUNQLEtBQUs7RUFDTCxHQUFHLEVBQUU7RUFDTCxJQUFJLEdBQUcsRUFBRSxTQUFTO0VBQ2xCLElBQUksS0FBSyxFQUFFLFNBQVMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFO0VBQzFELE1BQU0sSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3pCO0VBQ0EsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQztFQUNBLE1BQU0sSUFBSSxVQUFVLEdBQUcsMEJBQTBCLENBQUMsUUFBUSxDQUFDO0VBQzNELFVBQVUsTUFBTSxDQUFDO0FBQ2pCO0VBQ0EsTUFBTSxJQUFJO0VBQ1YsUUFBUSxLQUFLLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUc7RUFDL0QsVUFBVSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0VBQ3JDLFVBQVUsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0VBQ3BDLFNBQVM7RUFDVCxPQUFPLENBQUMsT0FBTyxHQUFHLEVBQUU7RUFDcEIsUUFBUSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzFCLE9BQU8sU0FBUztFQUNoQixRQUFRLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztFQUN2QixPQUFPO0FBQ1A7RUFDQSxNQUFNLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQzVCO0VBQ0EsTUFBTSxJQUFJLElBQUksR0FBRyxRQUFRLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0VBQ2hFLFVBQVUsSUFBSSxHQUFHLFNBQVMsSUFBSSxHQUFHO0VBQ2pDLFFBQVEsSUFBSSxjQUFjLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbkU7RUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxJQUFJLENBQUMsRUFBRTtFQUMxQyxVQUFVLElBQUksVUFBVSxHQUFHLDBCQUEwQixDQUFDLFFBQVEsQ0FBQztFQUMvRCxjQUFjLE1BQU0sQ0FBQztBQUNyQjtFQUNBLFVBQVUsSUFBSTtFQUNkLFlBQVksS0FBSyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHO0VBQ25FLGNBQWMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztFQUN6QyxjQUFjLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUM3QztFQUNBLGNBQWMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0VBQ3hDLGFBQWE7RUFDYixXQUFXLENBQUMsT0FBTyxHQUFHLEVBQUU7RUFDeEIsWUFBWSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzlCLFdBQVcsU0FBUztFQUNwQixZQUFZLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztFQUMzQixXQUFXO0FBQ1g7RUFDQSxVQUFVLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztFQUN2RCxTQUFTLE1BQU07RUFDZixVQUFVLElBQUksVUFBVSxHQUFHLDBCQUEwQixDQUFDLFFBQVEsQ0FBQztFQUMvRCxjQUFjLE1BQU0sQ0FBQztBQUNyQjtFQUNBLFVBQVUsSUFBSTtFQUNkLFlBQVksS0FBSyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHO0VBQ25FLGNBQWMsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztFQUMxQyxjQUFjLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQztFQUN0RCxhQUFhO0VBQ2IsV0FBVyxDQUFDLE9BQU8sR0FBRyxFQUFFO0VBQ3hCLFlBQVksVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUM5QixXQUFXLFNBQVM7RUFDcEIsWUFBWSxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUM7RUFDM0IsV0FBVztBQUNYO0VBQ0EsVUFBVSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUN0QyxTQUFTO0VBQ1QsT0FBTyxDQUFDO0FBQ1I7RUFDQSxNQUFNLElBQUksRUFBRSxDQUFDO0VBQ2IsS0FBSztFQUNMLEdBQUcsRUFBRTtFQUNMLElBQUksR0FBRyxFQUFFLFFBQVE7RUFDakIsSUFBSSxLQUFLLEVBQUUsU0FBUyxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFO0VBQ2xFLE1BQU0sSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3pCO0VBQ0EsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQztFQUNBLE1BQU0sSUFBSSxVQUFVLEdBQUcsMEJBQTBCLENBQUMsUUFBUSxDQUFDO0VBQzNELFVBQVUsTUFBTSxDQUFDO0FBQ2pCO0VBQ0EsTUFBTSxJQUFJO0VBQ1YsUUFBUSxLQUFLLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUc7RUFDL0QsVUFBVSxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0VBQ3JDLFVBQVUsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0VBQ3BDLFVBQVUsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQztFQUNyRCxTQUFTO0VBQ1QsT0FBTyxDQUFDLE9BQU8sR0FBRyxFQUFFO0VBQ3BCLFFBQVEsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUMxQixPQUFPLFNBQVM7RUFDaEIsUUFBUSxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUM7RUFDdkIsT0FBTztBQUNQO0VBQ0EsTUFBTSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztBQUMzQjtFQUNBLE1BQU0sSUFBSSxhQUFhLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQztFQUM1RSxVQUFVLElBQUksR0FBRyxRQUFRLEdBQUcsYUFBYSxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztFQUNoRixVQUFVLElBQUksR0FBRyxTQUFTLElBQUksR0FBRztFQUNqQyxRQUFRLElBQUksY0FBYyxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ25FO0VBQ0EsUUFBUSxJQUFJLEVBQUUsQ0FBQyxjQUFjLElBQUksSUFBSSxJQUFJLGFBQWEsQ0FBQyxFQUFFO0VBQ3pELFVBQVUsSUFBSSxVQUFVLEdBQUcsMEJBQTBCLENBQUMsUUFBUSxDQUFDO0VBQy9ELGNBQWMsTUFBTSxDQUFDO0FBQ3JCO0VBQ0EsVUFBVSxJQUFJO0VBQ2QsWUFBWSxLQUFLLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUc7RUFDbkUsY0FBYyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0VBQ3pDLGNBQWMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDO0VBQ3JELGFBQWE7RUFDYixXQUFXLENBQUMsT0FBTyxHQUFHLEVBQUU7RUFDeEIsWUFBWSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzlCLFdBQVcsU0FBUztFQUNwQixZQUFZLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztFQUMzQixXQUFXO0FBQ1g7RUFDQSxVQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE9BQU87RUFDeEMsVUFBVSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUN0QyxTQUFTLE1BQU07RUFDZixVQUFVLElBQUksV0FBVyxHQUFHLDBCQUEwQixDQUFDLFFBQVEsQ0FBQztFQUNoRSxjQUFjLE9BQU8sQ0FBQztBQUN0QjtFQUNBLFVBQVUsSUFBSTtFQUNkLFlBQVksS0FBSyxXQUFXLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHO0VBQ3RFLGNBQWMsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztFQUM1QyxjQUFjLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztFQUMzQyxhQUFhO0VBQ2IsV0FBVyxDQUFDLE9BQU8sR0FBRyxFQUFFO0VBQ3hCLFlBQVksV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUMvQixXQUFXLFNBQVM7RUFDcEIsWUFBWSxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUM7RUFDNUIsV0FBVztBQUNYO0VBQ0EsVUFBVSxRQUFRLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7RUFDdkQsU0FBUztFQUNULE9BQU8sQ0FBQztBQUNSO0VBQ0EsTUFBTSxJQUFJLEVBQUUsQ0FBQztFQUNiLEtBQUs7RUFDTCxHQUFHLEVBQUU7RUFDTCxJQUFJLEdBQUcsRUFBRSxNQUFNO0VBQ2YsSUFBSSxLQUFLLEVBQUUsU0FBUyxJQUFJLENBQUMsUUFBUSxFQUFFO0VBQ25DLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDckM7RUFDQSxNQUFNLElBQUksV0FBVyxHQUFHLDBCQUEwQixDQUFDLFFBQVEsQ0FBQztFQUM1RCxVQUFVLE9BQU8sQ0FBQztBQUNsQjtFQUNBLE1BQU0sSUFBSTtFQUNWLFFBQVEsS0FBSyxXQUFXLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHO0VBQ2xFLFVBQVUsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUN0QztFQUNBLFVBQVUsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxNQUFNLEVBQUU7RUFDL0MsWUFBWSxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztFQUNuRSxXQUFXO0FBQ1g7RUFDQSxVQUFVLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztFQUN6QyxTQUFTO0VBQ1QsT0FBTyxDQUFDLE9BQU8sR0FBRyxFQUFFO0VBQ3BCLFFBQVEsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUMzQixPQUFPLFNBQVM7RUFDaEIsUUFBUSxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUM7RUFDeEIsT0FBTztFQUNQLEtBQUs7RUFDTCxHQUFHLEVBQUU7RUFDTCxJQUFJLEdBQUcsRUFBRSxNQUFNO0VBQ2YsSUFBSSxLQUFLLEVBQUUsU0FBUyxJQUFJLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRTtFQUM1QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JDO0VBQ0EsTUFBTSxJQUFJLFdBQVcsR0FBRywwQkFBMEIsQ0FBQyxRQUFRLENBQUM7RUFDNUQsVUFBVSxPQUFPLENBQUM7QUFDbEI7RUFDQSxNQUFNLElBQUk7RUFDVixRQUFRLEtBQUssV0FBVyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksR0FBRztFQUNsRSxVQUFVLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7RUFDdEMsVUFBVSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLGNBQWMsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDO0VBQ3ZGLFNBQVM7RUFDVCxPQUFPLENBQUMsT0FBTyxHQUFHLEVBQUU7RUFDcEIsUUFBUSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzNCLE9BQU8sU0FBUztFQUNoQixRQUFRLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztFQUN4QixPQUFPO0VBQ1AsS0FBSztFQUNMLEdBQUcsRUFBRTtFQUNMLElBQUksR0FBRyxFQUFFLE1BQU07RUFDZixJQUFJLEtBQUssRUFBRSxTQUFTLElBQUksQ0FBQyxLQUFLLEVBQUU7RUFDaEMsTUFBTSxPQUFPLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxVQUFVLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxHQUFHLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ3pHLEtBQUs7RUFDTCxHQUFHLEVBQUU7RUFDTCxJQUFJLEdBQUcsRUFBRSxJQUFJO0VBQ2IsSUFBSSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtFQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDO0VBQ0EsTUFBTSxJQUFJLFdBQVcsR0FBRywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0VBQ2pFLFVBQVUsT0FBTyxDQUFDO0FBQ2xCO0VBQ0EsTUFBTSxJQUFJO0VBQ1YsUUFBUSxLQUFLLFdBQVcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUc7RUFDbEUsVUFBVSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQ3RDO0VBQ0EsVUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFO0VBQzlDLFlBQVksT0FBTyxDQUFDLHFCQUFxQixHQUFHLEVBQUUsQ0FBQztFQUMvQyxXQUFXO0FBQ1g7RUFDQSxVQUFVLElBQUksV0FBVyxHQUFHLDBCQUEwQixDQUFDLE1BQU0sQ0FBQztFQUM5RCxjQUFjLE9BQU8sQ0FBQztBQUN0QjtFQUNBLFVBQVUsSUFBSTtFQUNkLFlBQVksS0FBSyxXQUFXLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHO0VBQ3RFLGNBQWMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztFQUN4QyxjQUFjLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUM7RUFDOUQsY0FBYyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0VBQ3hELGFBQWE7RUFDYixXQUFXLENBQUMsT0FBTyxHQUFHLEVBQUU7RUFDeEIsWUFBWSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQy9CLFdBQVcsU0FBUztFQUNwQixZQUFZLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztFQUM1QixXQUFXO0VBQ1gsU0FBUztFQUNULE9BQU8sQ0FBQyxPQUFPLEdBQUcsRUFBRTtFQUNwQixRQUFRLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDM0IsT0FBTyxTQUFTO0VBQ2hCLFFBQVEsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDO0VBQ3hCLE9BQU87QUFDUDtFQUNBLE1BQU0sT0FBTyxJQUFJLENBQUM7RUFDbEIsS0FBSztFQUNMLEdBQUcsRUFBRTtFQUNMLElBQUksR0FBRyxFQUFFLEtBQUs7RUFDZCxJQUFJLEtBQUssRUFBRSxTQUFTLEdBQUcsQ0FBQyxNQUFNLEVBQUU7RUFDaEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNqQztFQUNBLE1BQU0sSUFBSSxXQUFXLEdBQUcsMEJBQTBCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztFQUNqRSxVQUFVLE9BQU8sQ0FBQztBQUNsQjtFQUNBLE1BQU0sSUFBSTtFQUNWLFFBQVEsS0FBSyxXQUFXLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxHQUFHO0VBQ2xFLFVBQVUsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUN0QztFQUNBLFVBQVUsSUFBSSxXQUFXLEdBQUcsMEJBQTBCLENBQUMsTUFBTSxDQUFDO0VBQzlELGNBQWMsT0FBTyxDQUFDO0FBQ3RCO0VBQ0EsVUFBVSxJQUFJO0VBQ2QsWUFBWSxLQUFLLFdBQVcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxJQUFJLEdBQUc7RUFDdEUsY0FBYyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0FBQ3hDO0VBQ0EsY0FBYyxJQUFJLE9BQU8sT0FBTyxDQUFDLHFCQUFxQixLQUFLLFdBQVcsSUFBSSxLQUFLLElBQUksT0FBTyxDQUFDLHFCQUFxQixFQUFFO0VBQ2xILGdCQUFnQixPQUFPLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0VBQ3pGLGVBQWU7RUFDZixhQUFhO0VBQ2IsV0FBVyxDQUFDLE9BQU8sR0FBRyxFQUFFO0VBQ3hCLFlBQVksV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUMvQixXQUFXLFNBQVM7RUFDcEIsWUFBWSxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUM7RUFDNUIsV0FBVztFQUNYLFNBQVM7RUFDVCxPQUFPLENBQUMsT0FBTyxHQUFHLEVBQUU7RUFDcEIsUUFBUSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzNCLE9BQU8sU0FBUztFQUNoQixRQUFRLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztFQUN4QixPQUFPO0FBQ1A7RUFDQSxNQUFNLE9BQU8sSUFBSSxDQUFDO0VBQ2xCLEtBQUs7QUFDTDtFQUNBLEdBQUcsRUFBRTtFQUNMLElBQUksR0FBRyxFQUFFLE1BQU07RUFDZixJQUFJLEtBQUssRUFBRSxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUU7RUFDL0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEM7RUFDQSxNQUFNLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLElBQUksWUFBWSxNQUFNLEVBQUU7RUFDbkUsUUFBUSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUMzQixPQUFPO0FBQ1A7RUFDQSxNQUFNLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRDtFQUNBLE1BQU0sSUFBSSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLEVBQUU7RUFDdkMsUUFBUSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzdCLE9BQU87RUFDUCxLQUFLO0VBQ0wsR0FBRyxFQUFFO0VBQ0wsSUFBSSxHQUFHLEVBQUUsTUFBTTtFQUNmLElBQUksS0FBSyxFQUFFLFNBQVMsSUFBSSxHQUFHO0VBQzNCLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN4QixLQUFLO0VBQ0wsR0FBRyxFQUFFO0VBQ0wsSUFBSSxHQUFHLEVBQUUsTUFBTTtFQUNmLElBQUksS0FBSyxFQUFFLFNBQVMsSUFBSSxHQUFHO0VBQzNCLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQ3pCLEtBQUs7QUFDTDtFQUNBLEdBQUcsRUFBRTtFQUNMLElBQUksR0FBRyxFQUFFLGdCQUFnQjtFQUN6QixJQUFJLEtBQUssRUFBRSxTQUFTLGNBQWMsR0FBRztFQUNyQyxNQUFNLE9BQU87RUFDYixRQUFRLGlCQUFpQixFQUFFLElBQUksQ0FBQyxpQkFBaUI7RUFDakQsUUFBUSxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7RUFDdkMsUUFBUSxvQkFBb0IsRUFBRSxJQUFJLENBQUMsb0JBQW9CO0VBQ3ZELE9BQU8sQ0FBQztFQUNSLEtBQUs7QUFDTDtFQUNBLEdBQUcsRUFBRTtFQUNMLElBQUksR0FBRyxFQUFFLFNBQVM7RUFDbEIsSUFBSSxLQUFLLEVBQUUsU0FBUyxPQUFPLEdBQUc7RUFDOUI7RUFDQSxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLGtCQUFrQixHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0VBQzVjLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUM5RSxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUMzRSxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7RUFDcEYsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0VBQzlFLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7RUFDeEgsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUMxRixNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUN4RSxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztFQUM1RSxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNuQjtFQUNBLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0VBQ3ZCLFFBQVEsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUN6RCxRQUFRLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDekQsT0FBTztBQUNQO0VBQ0EsTUFBTSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztFQUMzQixLQUFLO0VBQ0wsR0FBRyxFQUFFO0VBQ0wsSUFBSSxHQUFHLEVBQUUsU0FBUztFQUNsQixJQUFJLEtBQUssRUFBRSxTQUFTLE9BQU8sR0FBRztFQUM5QixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO0VBQ2pDLFFBQVEsTUFBTSw2REFBNkQsQ0FBQztFQUM1RSxPQUFPO0FBQ1A7RUFDQSxNQUFNLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPO0VBQ2hDLFVBQVUsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7RUFDMUMsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7RUFDckIsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztFQUMxQyxNQUFNLE9BQU8sSUFBSSxDQUFDO0VBQ2xCLEtBQUs7RUFDTCxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ047RUFDQSxFQUFFLE9BQU8sY0FBYyxDQUFDO0VBQ3hCLENBQUMsRUFBRSxDQUFDO0FBQ0o7RUFDQSxJQUFJLFFBQVEsR0FBRyxjQUFjLENBQUM7RUFDOUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztBQUM5Qk8sZ0JBQU0sQ0FBQyxjQUFjLEdBQUcsY0FBYzs7Ozs7RUMzdUR0QyxJQUFJQyxjQUFKLENBQW1CLG9CQUFuQixFQUF5QztFQUFFO0VBQUYsQ0FBekM7O0VDRkE7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxhQUFhLEdBQUcsQ0FBQyxNQUFNO0VBQzdCO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxJQUFJLE1BQU0sU0FBUyxHQUFHLGdCQUFnQixDQUFDO0VBRXZDO0VBQ0EsSUFBSSxNQUFNLFFBQVEsR0FBRztFQUNyQjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxVQUFVLEVBQUUsQ0FBQztFQUNuQjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxhQUFhLEVBQUUsQ0FBQztFQUN0QjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxpQkFBaUIsRUFBRSxLQUFLO0VBQzlCO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLG9CQUFvQixFQUFFLHVCQUF1QjtFQUNuRDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxXQUFXLEVBQUUsWUFBWTtFQUMvQjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxZQUFZLEVBQUUsSUFBSTtFQUN4QjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxRQUFRLEVBQUUsS0FBSztFQUNyQixLQUFLLENBQUM7RUFDTjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxJQUFJLE1BQU0sYUFBYTtFQUN2QjtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sV0FBVyxDQUFDLE9BQU8sRUFBRSxPQUFPLEdBQUcsRUFBRSxDQUFDO0VBQ3hDLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztFQUMvRDtFQUNBO0VBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxLQUFLLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0VBQ2xHLFFBQVEsSUFBSSxXQUFXLEtBQUssT0FBTyxJQUFJLENBQUMsT0FBTztFQUMvQyxVQUFVLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQztFQUNuRTtFQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7RUFDbEMsUUFBUSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0VBQ3BEO0VBQ0E7RUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO0VBQ3BDLFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7RUFDaEMsUUFBUSxJQUFJLENBQUMsT0FBTyxHQUFHO0VBQ3ZCLFVBQVUsU0FBUyxJQUFJLEtBQUs7RUFDNUIsVUFBVSxXQUFXLEVBQUUsS0FBSztFQUM1QixTQUFTLENBQUM7RUFDVjtFQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7RUFDbEMsUUFBUSxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztFQUM5QixRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0VBQ2pDLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztFQUNuQztFQUNBO0VBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHO0VBQzFCLFVBQVUsVUFBVSxFQUFFLENBQUM7RUFDdkIsVUFBVSxVQUFVLEVBQUUsQ0FBQztFQUN2QixVQUFVLGNBQWMsRUFBRSxDQUFDO0VBQzNCLFVBQVUsYUFBYSxFQUFFLENBQUM7RUFDMUIsVUFBVSxpQkFBaUIsRUFBRSxDQUFDO0VBQzlCLFVBQVUsYUFBYSxFQUFFLENBQUM7RUFDMUIsVUFBVSxZQUFZLEVBQUUsQ0FBQztFQUN6QixVQUFVLFlBQVksRUFBRSxDQUFDO0VBQ3pCLFVBQVUsZUFBZSxFQUFFLENBQUM7RUFDNUIsVUFBVSxjQUFjLEVBQUUsQ0FBQztFQUMzQixVQUFVLFdBQVcsRUFBRSxDQUFDO0VBQ3hCLFVBQVUsZUFBZSxFQUFFLENBQUM7RUFDNUIsU0FBUyxDQUFDO0VBQ1Y7RUFDQTtFQUNBLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLEtBQUs7RUFDN0MsVUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNqRCxTQUFTLENBQUMsQ0FBQztFQUNYO0VBQ0E7RUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztFQUMxQixPQUFPO0VBQ1A7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxVQUFVLEVBQUU7RUFDbEIsUUFBUSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztFQUNuQztFQUNBO0VBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUU7RUFDL0MsVUFBVSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztFQUM1RjtFQUNBLFVBQVUsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFlBQVk7RUFDeEMsWUFBWSxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztFQUN0QyxTQUFTO0VBQ1Q7RUFDQSxRQUFRLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFO0VBQ2pDLFVBQVUsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUN0RCxVQUFVLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLHNCQUFzQixDQUFDLENBQUM7RUFDaEUsVUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUM1QztFQUNBLFVBQVUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxPQUFPO0VBQ25ELFlBQVksT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQ3pEO0VBQ0EsVUFBVSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUM7RUFDbEYsU0FBUztFQUNUO0VBQ0E7RUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRTtFQUM1QyxVQUFVLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7RUFDckYsVUFBVSxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQzlEO0VBQ0EsVUFBVSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksS0FBSztFQUNsRCxZQUFZLElBQUksRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPO0VBQzVELFlBQVksSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7RUFDdkMsV0FBVyxDQUFDLENBQUM7RUFDYjtFQUNBLFVBQVUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxNQUFNO0VBQ2pDLFlBQVksTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO0VBQy9FLFNBQVM7RUFDVDtFQUNBO0VBQ0EsUUFBUSxJQUFJLFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVTtFQUN6RCxVQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUMzRTtFQUNBLFFBQVEsSUFBSSxVQUFVLEtBQUssT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWE7RUFDNUQsVUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDakY7RUFDQTtFQUNBLFFBQVEsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7RUFDaEM7RUFDQTtFQUNBLFFBQVEsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0VBQzlCO0VBQ0E7RUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztFQUM5QjtFQUNBO0VBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7RUFDMUI7RUFDQTtFQUNBLFFBQVEsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7RUFDakMsT0FBTztFQUNQO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLFVBQVUsRUFBRTtFQUNsQixRQUFRLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztFQUNqRixRQUFRLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztFQUNqRjtFQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEdBQUcsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0VBQ2xFO0VBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLFdBQVcsS0FBSyxPQUFPLFlBQVksRUFBRTtFQUM5RSxVQUFVLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQ2hFLFVBQVUsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDN0QsU0FBUztFQUNULE9BQU87RUFDUDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDO0VBQ3hCLFFBQVEsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNqQyxPQUFPO0VBQ1A7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sY0FBYyxFQUFFO0VBQ3RCLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU87RUFDdEMsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO0VBQ25DO0VBQ0E7RUFDQSxRQUFRLElBQUksQ0FBQyxZQUFZLE1BQU0sYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO0VBQ2hGLFFBQVEsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztFQUMzRCxRQUFRLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO0VBQ3hFO0VBQ0E7RUFDQSxRQUFRLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUM7RUFDNUQsUUFBUSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO0VBQ3REO0VBQ0E7RUFDQSxRQUFRLElBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztFQUNqRDtFQUNBLFFBQVEsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7RUFDekMsT0FBTztFQUNQO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLHlCQUF5QixFQUFFO0VBQ2pDLFFBQVEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztFQUNuQztFQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxhQUFhLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUM7RUFDM0U7RUFDQSxRQUFRLElBQUksQ0FBQyxXQUFXLE1BQU0sUUFBUSxDQUFDLGVBQWUsQ0FBQyxTQUFTLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7RUFDNUYsUUFBUSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztFQUNyRSxRQUFRLElBQUksQ0FBQyxZQUFZLEtBQUssUUFBUSxDQUFDLGVBQWUsQ0FBQyxVQUFVLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7RUFDOUY7RUFDQSxRQUFRLElBQUksQ0FBQyxVQUFVLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7RUFDckQsUUFBUSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0VBQ3hEO0VBQ0EsUUFBUSxJQUFJLFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxVQUFVO0VBQ2pELFlBQVksSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDM0U7RUFDQSxRQUFRLElBQUksVUFBVSxLQUFLLE9BQU8sSUFBSSxDQUFDLGFBQWE7RUFDcEQsWUFBWSxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNqRjtFQUNBLFFBQVEsSUFBSSxjQUFjLEtBQUssSUFBSSxDQUFDLFdBQVcsRUFBRTtFQUNqRDtFQUNBLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUU7RUFDckQsWUFBWSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztFQUNyRSxZQUFZLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0VBQ2pDLFdBQVc7RUFDWDtFQUNBLFNBQVMsTUFBTSxJQUFJLGlCQUFpQixLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUU7RUFDM0Q7RUFDQSxVQUFVLElBQUksSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7RUFDM0QsWUFBWSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0VBQzNFLFlBQVksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7RUFDakMsV0FBVztFQUNYLFNBQVM7RUFDVDtFQUNBLFFBQVEsSUFBSSxDQUFDLGNBQWMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDO0VBQ2pELFFBQVEsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7RUFDcEQsT0FBTztFQUNQO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0scUJBQXFCLEVBQUU7RUFDN0IsUUFBUSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDO0VBQzlFLE9BQU87RUFDUDtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sZ0JBQWdCLEVBQUU7RUFDeEIsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO0VBQ25DLFFBQVEsSUFBSSxJQUFJLENBQUMsZUFBZSxLQUFLLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTztFQUMvRDtFQUNBLFFBQVEsSUFBSSxRQUFRLEdBQUcsTUFBTSxLQUFLLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0VBQ3ZFO0VBQ0E7RUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDO0VBQ2pGLFVBQVUsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLEtBQUssSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDO0VBQ3RFLE9BQU87RUFDUDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxZQUFZLEVBQUU7RUFDcEIsUUFBUSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLFNBQVMsR0FBRyxLQUFLLENBQUM7RUFDdEQ7RUFDQSxRQUFRLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0VBQ3pDO0VBQ0EsUUFBUSxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7RUFDbkUsUUFBUSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7RUFDN0QsUUFBUSxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7RUFDdEU7RUFDQTtFQUNBLFFBQVEsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtFQUNyQyxVQUFVLElBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7RUFDaEQsWUFBWSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztFQUNoQyxZQUFZLFNBQVMsR0FBRyxRQUFRLENBQUM7RUFDakM7RUFDQSxXQUFXLE1BQU0sSUFBSSxXQUFXLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFO0VBQ3pFLFlBQVksSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztFQUM5RCxZQUFZLFNBQVMsR0FBRyxjQUFjLENBQUM7RUFDdkM7RUFDQSxXQUFXLE1BQU0sSUFBSSxFQUFFLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksV0FBVyxFQUFFO0VBQ3pGLFlBQVksU0FBUyxHQUFHLG1CQUFtQixDQUFDO0VBQzVDLFdBQVc7RUFDWDtFQUNBLFNBQVMsTUFBTTtFQUNmO0VBQ0EsVUFBVSxJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxFQUFFO0VBQzVDO0VBQ0EsWUFBWSxJQUFJLElBQUksQ0FBQyxhQUFhLEdBQUcsV0FBVyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7RUFDMUUsY0FBYyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUcsYUFBYSxDQUFDO0VBQ3JFLGNBQWMsU0FBUyxHQUFHLGtCQUFrQixDQUFDO0VBQzdDO0VBQ0EsYUFBYSxNQUFNLElBQUksV0FBVyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7RUFDekQsY0FBYyxJQUFJLENBQUMsVUFBVSxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0VBQ2hFLGNBQWMsU0FBUyxHQUFHLGNBQWMsQ0FBQztFQUN6QyxhQUFhO0VBQ2I7RUFDQSxXQUFXLE1BQU07RUFDakI7RUFDQSxZQUFZLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxjQUFjLEVBQUU7RUFDeEQsY0FBYyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLEdBQUcsYUFBYSxDQUFDO0VBQ3JFLGNBQWMsU0FBUyxHQUFHLGtCQUFrQixDQUFDO0VBQzdDO0VBQ0EsYUFBYSxNQUFNLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksY0FBYyxFQUFFO0VBQzFFLGNBQWMsSUFBSSxDQUFDLFVBQVUsR0FBRyxjQUFjLEdBQUcsYUFBYSxDQUFDO0VBQy9ELGNBQWMsU0FBUyxHQUFHLGlCQUFpQixDQUFDO0VBQzVDO0VBQ0EsYUFBYSxNQUFNLElBQUksSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLFdBQVcsRUFBRTtFQUMzRSxjQUFjLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztFQUM5QyxhQUFhO0VBQ2IsV0FBVztFQUNYLFNBQVM7RUFDVDtFQUNBO0VBQ0EsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztFQUN2RCxRQUFRLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztFQUMxRTtFQUNBLFFBQVEsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO0VBQ2hELFFBQVEsT0FBTyxTQUFTLENBQUM7RUFDekIsT0FBTztFQUNQO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLFNBQVMsQ0FBQyxTQUFTLENBQUM7RUFDMUIsUUFBUSxJQUFJLFdBQVcsS0FBSyxPQUFPLFNBQVMsR0FBRyxPQUFPO0VBQ3REO0VBQ0EsUUFBUSxJQUFJLEtBQUssR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQzNDLFFBQVEsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztFQUNuQztFQUNBLFFBQVEsUUFBUSxTQUFTO0VBQ3pCLFVBQVUsS0FBSyxjQUFjO0VBQzdCLFlBQVksS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxVQUFVO0VBQ2xFLGtCQUFrQixJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7RUFDeEYsWUFBWSxNQUFNO0VBQ2xCLFVBQVUsS0FBSyxpQkFBaUI7RUFDaEMsWUFBWSxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVztFQUNqRixrQkFBa0IsTUFBTSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztFQUN4RSxZQUFZLE1BQU07RUFDbEIsVUFBVSxLQUFLLGtCQUFrQixDQUFDO0VBQ2xDLFVBQVUsS0FBSyxtQkFBbUI7RUFDbEMsWUFBWSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDO0VBQzFFO0VBQ0EsWUFBWSxJQUFJLFNBQVM7RUFDekIsY0FBYyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0VBQ25EO0VBQ0EsY0FBYyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0VBQ25HLFlBQVksTUFBTTtFQUNsQixTQUFTO0VBQ1Q7RUFDQSxRQUFRLFFBQVEsU0FBUztFQUN6QixVQUFVLEtBQUssY0FBYyxDQUFDO0VBQzlCLFVBQVUsS0FBSyxpQkFBaUIsQ0FBQztFQUNqQyxVQUFVLEtBQUssbUJBQW1CLENBQUM7RUFDbkMsVUFBVSxLQUFLLGtCQUFrQjtFQUNqQyxZQUFZLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7RUFDN0UsWUFBWSxNQUFNO0VBQ2xCLFNBQVM7RUFDVDtFQUNBLFFBQVEsS0FBSyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ3BGLFFBQVEsS0FBSyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFO0VBQ25GLFlBQVksTUFBTSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxHQUFHLFNBQVMsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7RUFDbkY7RUFDQSxRQUFRLE9BQU8sS0FBSyxDQUFDO0VBQ3JCLE9BQU87RUFDUDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxjQUFjLENBQUMsS0FBSyxDQUFDO0VBQzNCLFFBQVEsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU87RUFDdEM7RUFDQSxRQUFRLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUM7RUFDaEQ7RUFDQSxRQUF3QixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVc7RUFDaEQsUUFBMkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjO0VBQ3REO0VBQ0EsUUFBUSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7RUFDNUMsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQzlDO0VBQ0EsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxTQUFTLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtFQUNuRSxVQUFVLElBQUksVUFBVSxHQUFHLFFBQVEsR0FBRyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUM7RUFDbkcsVUFBVSxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7RUFDL0Q7RUFDQSxVQUFVLElBQUksUUFBUSxLQUFLLFNBQVM7RUFDcEMsWUFBWSxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztFQUM5RTtFQUNBLFlBQVksYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDM0U7RUFDQSxVQUFVLEtBQUssSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtFQUN2QyxZQUF3QixDQUFDLFFBQVEsS0FBSyxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLEdBQUc7RUFDM0UsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ3ZELFdBQVc7RUFDWDtFQUNBLFVBQVUsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO0VBQ3ZDLFlBQVksSUFBSSxLQUFLLEdBQUcsQ0FBQyxRQUFRLEtBQUssT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7RUFDM0UsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztFQUNwRSxXQUFXO0VBQ1g7RUFDQSxVQUFVLElBQUksWUFBWSxHQUFHLFVBQVUsRUFBRSxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUM7RUFDdEcsVUFBVSxhQUFhLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7RUFDakUsU0FBUyxNQUFNO0VBQ2YsVUFBVSxJQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0VBQ2xGLFNBQVM7RUFDVDtFQUNBLFFBQVEsSUFBSSxDQUFDLFdBQVcsR0FBRyxTQUFTLENBQUM7RUFDckMsT0FBTztFQUNQO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLGdCQUFnQixFQUFFO0VBQ3hCO0VBQ0EsUUFBUSxJQUFJLE1BQU0sQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7RUFDeEQsVUFBVSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztFQUNsQyxVQUFVLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO0VBQ3RDO0VBQ0EsVUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztFQUNoRCxVQUFVLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0VBQzVFLFVBQVUsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDckQsU0FBUyxNQUFNO0VBQ2YsVUFBVSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztFQUNuQyxTQUFTO0VBQ1QsT0FBTztFQUNQO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sWUFBWSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7RUFDOUIsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTztFQUNuQyxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0VBQzdCO0VBQ0EsUUFBUSxDQUFDLENBQUMsU0FBUyxLQUFLO0FBQ3hCO0VBQ0EsVUFBVSxxQkFBcUIsQ0FBQyxNQUFNO0VBQ3RDLFlBQVksUUFBUSxTQUFTO0VBQzdCO0VBQ0E7RUFDQSxjQUFjLEtBQUssUUFBUTtFQUMzQixnQkFBZ0IsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7RUFDakQsZ0JBQWdCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0VBQ3hDLGdCQUFnQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7RUFDdEMsZ0JBQWdCLE1BQU07RUFDdEI7RUFDQTtFQUNBO0VBQ0EsY0FBYyxLQUFLLFFBQVEsQ0FBQztFQUM1QixjQUFjO0VBQ2QsZ0JBQWdCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0VBQ3hDLGdCQUFnQixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7RUFDdEMsZ0JBQWdCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDMUMsZ0JBQWdCLE1BQU07RUFDdEIsYUFBYTtFQUNiLFlBQVksSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7RUFDbEMsV0FBVyxDQUFDLENBQUM7RUFDYixTQUFTLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ3ZCLE9BQU87RUFDUDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxtQkFBbUIsRUFBRTtFQUMzQixRQUFRLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7RUFDbkM7RUFDQSxRQUFRLE9BQU8sQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUM7RUFDN0QsUUFBUSxPQUFPLENBQUMsV0FBVyxHQUFHLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUNuRSxPQUFPO0VBQ1A7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDeEMsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sY0FBYyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDO0VBQ3hGLGFBQWEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLFlBQVksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUM7RUFDL0UsYUFBYSxPQUFPLEtBQUssQ0FBQztFQUMxQixPQUFPO0VBQ1A7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sT0FBTyxFQUFFO0VBQ2YsUUFBUSxNQUFNLENBQUMsbUJBQW1CLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0VBQ3JFLFFBQVEsTUFBTSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztFQUNyRTtFQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDaEUsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0VBQzFDO0VBQ0EsUUFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFFBQVEsR0FBRyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDckU7RUFDQSxRQUFRLElBQUksVUFBVSxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7RUFDaEQ7RUFDQSxRQUFRLFVBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEdBQUcsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQ3BHLFFBQVEsVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQ3REO0VBQ0EsUUFBUSxLQUFLLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxLQUFLO0VBQ3hDLFVBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUMxRDtFQUNBLFFBQVEsS0FBSyxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSztFQUN4QyxVQUFVLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7RUFDL0Q7RUFDQSxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksV0FBVyxLQUFLLE9BQU8sWUFBWSxFQUFFO0VBQzlFLFVBQVUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztFQUNuRSxVQUFVLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7RUFDaEUsU0FBUztFQUNULE9BQU87RUFDUDtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxPQUFPLGdCQUFnQixDQUFDLFdBQVcsQ0FBQztFQUMxQyxRQUFRLElBQUksTUFBTSxHQUFHLEtBQUs7RUFDMUIsWUFBWSxRQUFRLEdBQUcsQ0FBQyxXQUFXLElBQUksYUFBYSxHQUFHLFdBQVc7RUFDbEUsWUFBWSxLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztFQUN4RSxZQUFZLFFBQVEsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQztFQUNuRCxZQUFZLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztFQUN2RCxZQUFZLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0VBQ2xDO0VBQ0EsUUFBUSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSyxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxRQUFRLEVBQUUsQ0FBQyxFQUFFO0VBQ3ZHLFVBQVUsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssU0FBUyxFQUFFO0VBQzdDLFlBQVksTUFBTSxHQUFHLFFBQVEsQ0FBQztFQUM5QixZQUFZLE9BQU8sS0FBSyxDQUFDO0VBQ3pCLFdBQVc7RUFDWCxTQUFTLENBQUMsQ0FBQztFQUNYLFFBQVEsT0FBTyxNQUFNLENBQUM7RUFDdEIsT0FBTztFQUNQO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLE9BQU8sWUFBWSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDO0VBQ25ELFFBQVEsR0FBRztFQUNYLFVBQVUsSUFBSSxLQUFLLEdBQUcsSUFBSSxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7RUFDakUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0VBQ2xCLFVBQVUsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztFQUMxRCxVQUFVLEtBQUssQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7RUFDN0QsU0FBUztFQUNULFFBQVEsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUNyQyxPQUFPO0VBQ1A7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxPQUFPLE1BQU0sQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDO0VBQ3RDLFFBQVEsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO0VBQ3pCLFFBQVEsS0FBSyxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUU7RUFDbEMsVUFBVSxJQUFJLFdBQVcsS0FBSyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQ2hGLGVBQWUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztFQUM1QyxTQUFTO0VBQ1QsUUFBUSxPQUFPLE9BQU8sQ0FBQztFQUN2QixPQUFPO0VBQ1A7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBLE1BQU0sT0FBTyxjQUFjLENBQUMsT0FBTyxDQUFDO0VBQ3BDLFFBQVEsSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2QztFQUNBLFFBQVEsRUFBRTtFQUNWLFVBQVUsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztFQUM1QyxVQUFVLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7RUFDOUM7RUFDQSxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDO0VBQ2hDLFlBQVksTUFBTSxDQUFDLEdBQUcsSUFBSSxTQUFTLENBQUM7RUFDcEM7RUFDQSxVQUFVLElBQUksRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDO0VBQ2pDLFlBQVksTUFBTSxDQUFDLElBQUksSUFBSSxVQUFVLENBQUM7QUFDdEM7RUFDQSxVQUFVLE9BQU8sR0FBRyxFQUFFLE1BQU0sS0FBSyxPQUFPLENBQUMsT0FBTztFQUNoRCxzQkFBc0IsT0FBTyxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO0VBQ25FLFNBQVMsT0FBTyxPQUFPLENBQUM7RUFDeEIsUUFBUSxPQUFPLE1BQU0sQ0FBQztFQUN0QixPQUFPO0VBQ1A7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLE9BQU8sUUFBUSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUM7RUFDekMsUUFBUSxJQUFJLEVBQUUsYUFBYSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLEVBQUU7RUFDMUQsVUFBVSxJQUFJLE9BQU8sQ0FBQyxTQUFTO0VBQy9CLFlBQVksT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7RUFDN0M7RUFDQSxZQUFZLE9BQU8sQ0FBQyxTQUFTLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQztFQUNqRCxTQUFTO0VBQ1QsT0FBTztFQUNQO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsTUFBTSxPQUFPLFdBQVcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDO0VBQzVDLFFBQVEsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsRUFBRTtFQUN4RCxVQUFVLElBQUksT0FBTyxDQUFDLFNBQVM7RUFDL0IsWUFBWSxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUNoRDtFQUNBLFlBQVksT0FBTyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0VBQ3pJLFNBQVM7RUFDVCxPQUFPO0FBQ1A7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxNQUFNLE9BQU8sUUFBUSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUM7RUFDekMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxTQUFTO0VBQzdCLFVBQVUsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztFQUN2RDtFQUNBLFVBQVUsT0FBTyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3pGLE9BQU87RUFDUCxLQUFLO0VBQ0w7RUFDQSxJQUFJLE9BQU8sYUFBYSxDQUFDO0VBQ3pCLEdBQUcsR0FBRyxDQUFDO0VBR1A7RUFDQTtFQUNBO0VBQ0EsRUFBRSxNQUFNLENBQUMsYUFBYSxHQUFHLGFBQWE7O0VDenJCdEMsSUFBSXJDLFFBQVEsQ0FBQ29CLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBSixFQUF3QztFQUN0QyxFQUFjLElBQUlrQixhQUFKLENBQWtCLFVBQWxCLEVBQThCO0VBQ3BDQyxJQUFBQSxpQkFBaUIsRUFBRSxTQURpQjtFQUVwQ0MsSUFBQUEsb0JBQW9CLEVBQUUsaUJBRmM7RUFHcENDLElBQUFBLFVBQVUsRUFBRSxFQUh3QjtFQUlwQ0MsSUFBQUEsYUFBYSxFQUFFO0VBSnFCLEdBQTlCO0VBTWY7Ozs7OzsifQ==
