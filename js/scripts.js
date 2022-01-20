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
   * Sticky Sidebar v2 JavaScript Plugin.
   * @version 1.0.1
   * @author Øystein Blixhavn <oystein@blixhavn.no>
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
         * Parent element where the scrolling happens.
         */
        scrollContainer: false,

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

          // Dimensions of sidebar, container and screen viewport.
          this.dimensions = {
            translateY: 0,
            maxTranslateY: 0,
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

          // Get scroll container, if provided
          this.scrollContainer = this.options.scrollContainer ? document.querySelector(this.options.scrollContainer) : undefined;

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
          this.eventTarget = this.scrollContainer ? this.scrollContainer : window;

          this.eventTarget.addEventListener('resize', this, { passive: true, capture: false });
          this.eventTarget.addEventListener('scroll', this, { passive: true, capture: false });

          this.sidebar.addEventListener('update' + EVENT_KEY, this);

          if( 'undefined' !== typeof ResizeObserver ){
            const resizeObserver = new ResizeObserver(() => this.handleEvent());
            resizeObserver.observe(this.sidebarInner);
            resizeObserver.observe(this.container);
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
          dims.sidebarWidth  = this.sidebarInner.offsetWidth;

          // Screen viewport dimensions.
          dims.viewportHeight = window.innerHeight;

          // Maximum sidebar translate Y.
          dims.maxTranslateY = dims.containerHeight - dims.sidebarHeight;

          this._calcDimensionsWithScroll();
        }

        /**
         * Some dimensions values need to be up-to-date when scrolling the page.
         * @private
         */
        _calcDimensionsWithScroll(){
          var dims = this.dimensions;

          dims.sidebarLeft = StickySidebar.offsetRelative(this.sidebar).left;

          if (this.scrollContainer) {
            dims.viewportTop = this.scrollContainer.scrollTop;
            dims.viewportLeft = this.scrollContainer.scrollLeft;
          } else {
            dims.viewportTop = document.documentElement.scrollTop || document.body.scrollTop;
            dims.viewportLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
          }
          dims.viewportBottom = dims.viewportTop + dims.viewportHeight;

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
        isSidebarFitsViewport() {
          return this.dimensions.viewportHeight >= (
            this.dimensions.lastBottomSpacing +
            this.dimensions.lastTopSpacing +
            this.dimensions.sidebarHeight
          );
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
         * Gets affix type of sidebar according to current scroll top and scrolling direction.
         * @public
         * @return {String|False} - Proper affix type.
         */
        getAffixType(){
          this._calcDimensionsWithScroll();
          var dims = this.dimensions;
          var colliderTop = dims.viewportTop + dims.topSpacing;
          var affixType = this.affixedType;

         if( colliderTop <= dims.containerTop || dims.containerHeight <= dims.sidebarHeight ){
            dims.translateY = 0;
            affixType = 'STATIC';
          } else {
            affixType = ( 'up' === this.direction ) ?
              this._getAffixTypeScrollingUp() : this._getAffixTypeScrollingDown();
          }

          // Make sure the translate Y is not bigger than container height.
          dims.translateY = Math.max(0, dims.translateY);
          dims.translateY = Math.min(dims.containerHeight, dims.translateY);
          dims.translateY = Math.round(dims.translateY);

          dims.lastViewportTop = dims.viewportTop;
          return affixType;
        }

        /**
         * Get affix type while scrolling down.
         * @private
         * @return {String} - Proper affix type of scrolling down direction.
         */
        _getAffixTypeScrollingDown(){
          var dims = this.dimensions;
          var sidebarBottom = dims.sidebarHeight + dims.containerTop;
          var colliderTop = dims.viewportTop + dims.topSpacing;
          var colliderBottom = dims.viewportBottom - dims.bottomSpacing;
          var affixType = this.affixedType;

          if( this.isSidebarFitsViewport() ){
            if( dims.sidebarHeight + colliderTop >= dims.containerBottom ){
              dims.translateY = dims.containerBottom - sidebarBottom;
              affixType = 'CONTAINER-BOTTOM';

            } else if( colliderTop >= dims.containerTop ){
              dims.translateY = colliderTop - dims.containerTop;
              affixType = 'VIEWPORT-TOP';
            }
          } else {
            if( dims.containerBottom <= colliderBottom ){
              dims.translateY = dims.containerBottom - sidebarBottom;
              affixType = 'CONTAINER-BOTTOM';

            } else if( sidebarBottom + dims.translateY <= colliderBottom ){
              dims.translateY = colliderBottom - sidebarBottom;
              affixType = 'VIEWPORT-BOTTOM';

            } else if( dims.containerTop + dims.translateY <= colliderTop &&
              (0 !== dims.translateY && dims.maxTranslateY !== dims.translateY) ){
              affixType = 'VIEWPORT-UNBOTTOM';
            }
          }

          return affixType;
        }

        /**
         * Get affix type while scrolling up.
         * @private
         * @return {String} - Proper affix type of scrolling up direction.
         */
        _getAffixTypeScrollingUp(){
          var dims = this.dimensions;
          var sidebarBottom = dims.sidebarHeight + dims.containerTop;
          var colliderTop = dims.viewportTop + dims.topSpacing;
          var colliderBottom = dims.viewportBottom - dims.bottomSpacing;
          var affixType = this.affixedType;

          if( colliderTop <= dims.translateY + dims.containerTop ){
            dims.translateY = colliderTop - dims.containerTop;
            affixType = 'VIEWPORT-TOP';

          } else if( dims.containerBottom <= colliderBottom ){
            dims.translateY = dims.containerBottom - sidebarBottom;
            affixType = 'CONTAINER-BOTTOM';

          } else if( ! this.isSidebarFitsViewport() ){

            if( dims.containerTop <= colliderTop &&
                (0 !== dims.translateY && dims.maxTranslateY !== dims.translateY) ){
              affixType = 'VIEWPORT-UNBOTTOM';
            }
          }

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
              bottom: '', width: '',  transform: ''}, style.inner);

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
              let unit = ('number' === typeof style.outer[key]) ? 'px' : '';
              this.sidebar.style[key] = style.outer[key] + unit;
            }

            for( let key in style.inner ){
              let unit = ('number' === typeof style.inner[key]) ? 'px' : '';
              this.sidebarInner.style[key] = style.inner[key] + unit;
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
          window.removeEventListener('resize', this, {capture: false});
          window.removeEventListener('scroll', this, {capture: false});

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

        /**
         * Gets default values of configuration options.
         * @static
         * @return {Object}
         */
        static get defaults(){
          return DEFAULTS;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXMiOlsic3JjL3NjcmlwdHMvbW9kdWxlcy9BbmltYXRlLmpzIiwibm9kZV9tb2R1bGVzL0BzcGxpZGVqcy9zcGxpZGUvZGlzdC9qcy9zcGxpZGUuZXNtLmpzIiwic3JjL3NjcmlwdHMvbW9kdWxlcy9DYXJvdXNlbC5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvVG9nZ2xlTmF2LmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsZWxpZ2h0Ym94L2Rpc3Qvc2ltcGxlLWxpZ2h0Ym94Lm1vZHVsZXMuanMiLCJzcmMvc2NyaXB0cy9tb2R1bGVzL0xpZ2h0Ym94LmpzIiwibm9kZV9tb2R1bGVzL3N0aWNreS1zaWRlYmFyLXYyL3NyYy9zdGlja3ktc2lkZWJhci5qcyIsInNyYy9zY3JpcHRzL21vZHVsZXMvU3RpY2t5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBBbmltYXRlXHJcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIC0gYWRkIGNsYXNzIHRvIGVsZW1lbnQgaW4gdmlld3BvcnRcclxuICogLSBpZiB5b3Ugd2FudCBkaXNhYmxlIGFuaW1hdGUgZGVsYXkgb24gbW9iaWxlIHVzZSBbYW5pbWF0ZS1kZWxheS1kZXNrdG9wXVxyXG4gKiAtIHNldCBhbmltYXRpb24gZGVsYXkgdmlhIFthbmltYXRlLWRlbGF5XSBodG1sIGF0dHJpYnV0ZVxyXG4gKiAtIHNldCB2aXNpYmxlIHRocmVzaG9sZCB2aWEgW2FuaW1hdGUtdGhyZXNob2xkXSBodG1sIGF0dHJpYnV0ZVxyXG4gKi9cclxuXHJcbiBjb25zdCBJU01PQklMRSA9IHdpbmRvdy5tYXRjaE1lZGlhKFwib25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDc2OHB4KVwiKS5tYXRjaGVzXHJcbiBjb25zdCBUSFJFU0hPTEQgPSAnMC43NSdcclxuIGNvbnN0IExPQURfVEhSRVNIT0xEID0gJzAuMidcclxuIGNvbnN0IEVMRU1FTlRTID0gJy5hbmltYXRlJ1xyXG4gY29uc3QgVklTSUJMRV9DTEFTUyA9ICdhbmltYXRlLS12aXNpYmxlJ1xyXG5cclxuIGNsYXNzIEFuaW1hdGUge1xyXG4gICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuc2VjdGlvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKEVMRU1FTlRTKVxyXG4gICAgdGhpcy5USFJFU0hPTEQgPSBUSFJFU0hPTERcclxuICAgIHRoaXMuTE9BRF9USFJFU0hPTEQgPSBMT0FEX1RIUkVTSE9MRFxyXG5cclxuICAgICAgaWYoJ0ludGVyc2VjdGlvbk9ic2VydmVyJyBpbiB3aW5kb3cpIHtcclxuICAgICAgICB0aGlzLnNlY3Rpb25zLmZvckVhY2goKGVsKSA9PiB7XHJcbiAgICAgICAgIGNvbnN0IEJvdW5kaW5nQ2xpZW50UmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXHJcbiAgICAgICAgIGNvbnN0IHZpc2libGVSYXRpbyA9ICBCb3VuZGluZ0NsaWVudFJlY3QuaGVpZ2h0IC8gd2luZG93LmlubmVySGVpZ2h0XHJcblxyXG4gICAgICAgICBpZih2aXNpYmxlUmF0aW8gPiAwLjk1KXtcclxuICAgICAgICAgICB0aGlzLlRIUkVTSE9MRCA9ICB3aW5kb3cuaW5uZXJIZWlnaHQgLyBCb3VuZGluZ0NsaWVudFJlY3QuaGVpZ2h0IC8gMTAwICogMzBcclxuICAgICAgICAgICB0aGlzLkxPQURfVEhSRVNIT0xEID0gd2luZG93LmlubmVySGVpZ2h0IC8gQm91bmRpbmdDbGllbnRSZWN0LmhlaWdodCAvIDEwMCAqIDIwXHJcbiAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBvYnNlcnZlIG9uIHBhZ2UgbG9hZFxyXG4gICAgICAgICAgY29uc3QgbG9hZE9ic2VydmVyID0gbmV3IEludGVyc2VjdGlvbk9ic2VydmVyKHRoaXMub2JzZXJ2ZUNhbGxiYWNrLCB7XHJcbiAgICAgICAgICAgIHRocmVzaG9sZDogdGhpcy5MT0FEX1RIUkVTSE9MRFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICBsb2FkT2JzZXJ2ZXIub2JzZXJ2ZShlbCk7XHJcblxyXG5cclxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBsb2FkT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG4gICAgICAgICAgfSwgMTAwKTtcclxuXHJcbiAgICAgICAgICAvLyBvYnNlcnZlXHJcbiAgICAgICAgICBjb25zdCBvYnNlcnZlclRocmVzaG9sZCA9IGVsLmdldEF0dHJpYnV0ZSgnYW5pbWF0ZS10aHJlc2hvbGQnKSA/IGVsLmdldEF0dHJpYnV0ZSgnYW5pbWF0ZS10aHJlc2hvbGQnKSA6IHRoaXMuVEhSRVNIT0xEXHJcbiAgICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcih0aGlzLm9ic2VydmVDYWxsYmFjaywge1xyXG4gICAgICAgICAgICB0aHJlc2hvbGQ6IG9ic2VydmVyVGhyZXNob2xkXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIG9ic2VydmVyLm9ic2VydmUoZWwpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZWN0aW9ucy5mb3JFYWNoKChlbCkgPT4ge1xyXG4gICAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChWSVNJQkxFX0NMQVNTKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgfVxyXG5cclxuICAgIG9ic2VydmVDYWxsYmFjayA9IChlbnRyaWVzKSA9PiB7XHJcbiAgICAgIGVudHJpZXMubWFwKChlbnRyeSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlY3Rpb24gPSBlbnRyeS50YXJnZXQ7XHJcbiAgICAgICAgY29uc3QgZGVsYXkgPSB0aGlzLmdldERlbGF5KHNlY3Rpb24pXHJcbiAgICAgICAgY29uc3Qgc2VjdGlvbkJvZHlDbGFzcyA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCdhbmltYXRlLWJvZHktY2xhc3MnKVxyXG5cclxuICAgICAgICBpZiAoZW50cnkuaXNJbnRlcnNlY3RpbmcpIHtcclxuICAgICAgICAgIGlmKElTTU9CSUxFICYmIHNlY3Rpb24uZ2V0QXR0cmlidXRlKCdhbmltYXRlLWRlbGF5LWRlc2t0b3AnKSl7XHJcbiAgICAgICAgICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZChWSVNJQkxFX0NMQVNTKVxyXG5cclxuICAgICAgICAgICAgdGhpcy5ib2R5Q2xhc3Moc2VjdGlvbkJvZHlDbGFzcywgJ2FkZCcpXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICBzZWN0aW9uLmNsYXNzTGlzdC5hZGQoVklTSUJMRV9DTEFTUylcclxuICAgICAgICAgICAgICB0aGlzLmJvZHlDbGFzcyhzZWN0aW9uQm9keUNsYXNzLCAnYWRkJylcclxuICAgICAgICAgICAgfSwgZGVsYXkpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuYm9keUNsYXNzKHNlY3Rpb25Cb2R5Q2xhc3MsICdyZW1vdmUnKVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICBnZXREZWxheSA9IChzZWN0aW9uKSA9PiB7XHJcbiAgIHZhciBkZWxheSA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCdhbmltYXRlLWRlbGF5JylcclxuXHJcbiAgIGlmKCFJU01PQklMRSAmJiBzZWN0aW9uLmdldEF0dHJpYnV0ZSgnYW5pbWF0ZS1kZWxheS1kZXNrdG9wJykpe1xyXG4gICAgIHZhciBkZWxheSA9IHNlY3Rpb24uZ2V0QXR0cmlidXRlKCdhbmltYXRlLWRlbGF5LWRlc2t0b3AnKVxyXG4gICB9XHJcblxyXG4gICBpZiAoZGVsYXkgPT09IG51bGwpIHtcclxuICAgICByZXR1cm4gMFxyXG4gICB9IGVsc2UgaWYgKGRlbGF5LmluY2x1ZGVzKCcuJykpIHtcclxuICAgICByZXR1cm4gcGFyc2VJbnQoZGVsYXkgKiAxMDAwKVxyXG4gICB9IGVsc2Uge1xyXG4gICAgIHJldHVybiBwYXJzZUludChkZWxheSlcclxuICAgfVxyXG4gICB9XHJcblxyXG4gICBib2R5Q2xhc3MgPSAoaHRtbGNsYXNzLCB0eXBlKSA9PiB7XHJcbiAgICAgaWYoIWh0bWxjbGFzcyl7XHJcbiAgICAgICByZXR1cm5cclxuICAgICB9XHJcblxyXG4gICAgICBpZih0eXBlID09ICdhZGQnKXtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoaHRtbGNsYXNzKVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZShodG1sY2xhc3MpXHJcbiAgICAgIH1cclxuICAgIH1cclxuIH1cclxuXHJcbiBuZXcgQW5pbWF0ZSgpXHJcbiIsIi8qIVxuICogU3BsaWRlLmpzXG4gKiBWZXJzaW9uICA6IDMuMi41XG4gKiBMaWNlbnNlICA6IE1JVFxuICogQ29weXJpZ2h0OiAyMDIxIE5hb3Rvc2hpIEZ1aml0YVxuICovXG5jb25zdCBQUk9KRUNUX0NPREUgPSBcInNwbGlkZVwiO1xuY29uc3QgREFUQV9BVFRSSUJVVEUgPSBgZGF0YS0ke1BST0pFQ1RfQ09ERX1gO1xuXG5jb25zdCBDUkVBVEVEID0gMTtcbmNvbnN0IE1PVU5URUQgPSAyO1xuY29uc3QgSURMRSA9IDM7XG5jb25zdCBNT1ZJTkcgPSA0O1xuY29uc3QgREVTVFJPWUVEID0gNTtcbmNvbnN0IFNUQVRFUyA9IHtcbiAgQ1JFQVRFRCxcbiAgTU9VTlRFRCxcbiAgSURMRSxcbiAgTU9WSU5HLFxuICBERVNUUk9ZRURcbn07XG5cbmNvbnN0IERFRkFVTFRfRVZFTlRfUFJJT1JJVFkgPSAxMDtcbmNvbnN0IERFRkFVTFRfVVNFUl9FVkVOVF9QUklPUklUWSA9IDIwO1xuXG5mdW5jdGlvbiBlbXB0eShhcnJheSkge1xuICBhcnJheS5sZW5ndGggPSAwO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChzdWJqZWN0KSB7XG4gIHJldHVybiAhaXNOdWxsKHN1YmplY3QpICYmIHR5cGVvZiBzdWJqZWN0ID09PSBcIm9iamVjdFwiO1xufVxuZnVuY3Rpb24gaXNBcnJheShzdWJqZWN0KSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHN1YmplY3QpO1xufVxuZnVuY3Rpb24gaXNGdW5jdGlvbihzdWJqZWN0KSB7XG4gIHJldHVybiB0eXBlb2Ygc3ViamVjdCA9PT0gXCJmdW5jdGlvblwiO1xufVxuZnVuY3Rpb24gaXNTdHJpbmcoc3ViamVjdCkge1xuICByZXR1cm4gdHlwZW9mIHN1YmplY3QgPT09IFwic3RyaW5nXCI7XG59XG5mdW5jdGlvbiBpc1VuZGVmaW5lZChzdWJqZWN0KSB7XG4gIHJldHVybiB0eXBlb2Ygc3ViamVjdCA9PT0gXCJ1bmRlZmluZWRcIjtcbn1cbmZ1bmN0aW9uIGlzTnVsbChzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0ID09PSBudWxsO1xufVxuZnVuY3Rpb24gaXNIVE1MRWxlbWVudChzdWJqZWN0KSB7XG4gIHJldHVybiBzdWJqZWN0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIHRvQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdO1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoKHZhbHVlcywgaXRlcmF0ZWUpIHtcbiAgdG9BcnJheSh2YWx1ZXMpLmZvckVhY2goaXRlcmF0ZWUpO1xufVxuXG5mdW5jdGlvbiBpbmNsdWRlcyhhcnJheSwgdmFsdWUpIHtcbiAgcmV0dXJuIGFycmF5LmluZGV4T2YodmFsdWUpID4gLTE7XG59XG5cbmZ1bmN0aW9uIHB1c2goYXJyYXksIGl0ZW1zKSB7XG4gIGFycmF5LnB1c2goLi4udG9BcnJheShpdGVtcykpO1xuICByZXR1cm4gYXJyYXk7XG59XG5cbmNvbnN0IGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbmZ1bmN0aW9uIHNsaWNlKGFycmF5TGlrZSwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gYXJyYXlQcm90by5zbGljZS5jYWxsKGFycmF5TGlrZSwgc3RhcnQsIGVuZCk7XG59XG5cbmZ1bmN0aW9uIGZpbmQoYXJyYXlMaWtlLCBwcmVkaWNhdGUpIHtcbiAgcmV0dXJuIHNsaWNlKGFycmF5TGlrZSkuZmlsdGVyKHByZWRpY2F0ZSlbMF07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUNsYXNzKGVsbSwgY2xhc3NlcywgYWRkKSB7XG4gIGlmIChlbG0pIHtcbiAgICBmb3JFYWNoKGNsYXNzZXMsIChuYW1lKSA9PiB7XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICBlbG0uY2xhc3NMaXN0W2FkZCA/IFwiYWRkXCIgOiBcInJlbW92ZVwiXShuYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRDbGFzcyhlbG0sIGNsYXNzZXMpIHtcbiAgdG9nZ2xlQ2xhc3MoZWxtLCBpc1N0cmluZyhjbGFzc2VzKSA/IGNsYXNzZXMuc3BsaXQoXCIgXCIpIDogY2xhc3NlcywgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZChwYXJlbnQsIGNoaWxkcmVuKSB7XG4gIGZvckVhY2goY2hpbGRyZW4sIHBhcmVudC5hcHBlbmRDaGlsZC5iaW5kKHBhcmVudCkpO1xufVxuXG5mdW5jdGlvbiBiZWZvcmUobm9kZXMsIHJlZikge1xuICBmb3JFYWNoKG5vZGVzLCAobm9kZSkgPT4ge1xuICAgIGNvbnN0IHBhcmVudCA9IHJlZi5wYXJlbnROb2RlO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobm9kZSwgcmVmKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzKGVsbSwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIChlbG1bXCJtc01hdGNoZXNTZWxlY3RvclwiXSB8fCBlbG0ubWF0Y2hlcykuY2FsbChlbG0sIHNlbGVjdG9yKTtcbn1cblxuZnVuY3Rpb24gY2hpbGRyZW4ocGFyZW50LCBzZWxlY3Rvcikge1xuICByZXR1cm4gcGFyZW50ID8gc2xpY2UocGFyZW50LmNoaWxkcmVuKS5maWx0ZXIoKGNoaWxkKSA9PiBtYXRjaGVzKGNoaWxkLCBzZWxlY3RvcikpIDogW107XG59XG5cbmZ1bmN0aW9uIGNoaWxkKHBhcmVudCwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHNlbGVjdG9yID8gY2hpbGRyZW4ocGFyZW50LCBzZWxlY3RvcilbMF0gOiBwYXJlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG59XG5cbmZ1bmN0aW9uIGZvck93bihvYmplY3QsIGl0ZXJhdGVlLCByaWdodCkge1xuICBpZiAob2JqZWN0KSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuICAgIGtleXMgPSByaWdodCA/IGtleXMucmV2ZXJzZSgpIDoga2V5cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICBpZiAoa2V5ICE9PSBcIl9fcHJvdG9fX1wiKSB7XG4gICAgICAgIGlmIChpdGVyYXRlZShvYmplY3Rba2V5XSwga2V5KSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBhc3NpZ24ob2JqZWN0KSB7XG4gIHNsaWNlKGFyZ3VtZW50cywgMSkuZm9yRWFjaCgoc291cmNlKSA9PiB7XG4gICAgZm9yT3duKHNvdXJjZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIG9iamVjdFtrZXldID0gc291cmNlW2tleV07XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBtZXJnZShvYmplY3QsIHNvdXJjZSkge1xuICBmb3JPd24oc291cmNlLCAodmFsdWUsIGtleSkgPT4ge1xuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgb2JqZWN0W2tleV0gPSB2YWx1ZS5zbGljZSgpO1xuICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICBvYmplY3Rba2V5XSA9IG1lcmdlKGlzT2JqZWN0KG9iamVjdFtrZXldKSA/IG9iamVjdFtrZXldIDoge30sIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiByZW1vdmVBdHRyaWJ1dGUoZWxtLCBhdHRycykge1xuICBpZiAoZWxtKSB7XG4gICAgZm9yRWFjaChhdHRycywgKGF0dHIpID0+IHtcbiAgICAgIGVsbS5yZW1vdmVBdHRyaWJ1dGUoYXR0cik7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0QXR0cmlidXRlKGVsbSwgYXR0cnMsIHZhbHVlKSB7XG4gIGlmIChpc09iamVjdChhdHRycykpIHtcbiAgICBmb3JPd24oYXR0cnMsICh2YWx1ZTIsIG5hbWUpID0+IHtcbiAgICAgIHNldEF0dHJpYnV0ZShlbG0sIG5hbWUsIHZhbHVlMik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgaXNOdWxsKHZhbHVlKSA/IHJlbW92ZUF0dHJpYnV0ZShlbG0sIGF0dHJzKSA6IGVsbS5zZXRBdHRyaWJ1dGUoYXR0cnMsIFN0cmluZyh2YWx1ZSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZSh0YWcsIGF0dHJzLCBwYXJlbnQpIHtcbiAgY29uc3QgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBpZiAoYXR0cnMpIHtcbiAgICBpc1N0cmluZyhhdHRycykgPyBhZGRDbGFzcyhlbG0sIGF0dHJzKSA6IHNldEF0dHJpYnV0ZShlbG0sIGF0dHJzKTtcbiAgfVxuICBwYXJlbnQgJiYgYXBwZW5kKHBhcmVudCwgZWxtKTtcbiAgcmV0dXJuIGVsbTtcbn1cblxuZnVuY3Rpb24gc3R5bGUoZWxtLCBwcm9wLCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUoZWxtKVtwcm9wXTtcbiAgfVxuICBpZiAoIWlzTnVsbCh2YWx1ZSkpIHtcbiAgICBjb25zdCB7IHN0eWxlOiBzdHlsZTIgfSA9IGVsbTtcbiAgICB2YWx1ZSA9IGAke3ZhbHVlfWA7XG4gICAgaWYgKHN0eWxlMltwcm9wXSAhPT0gdmFsdWUpIHtcbiAgICAgIHN0eWxlMltwcm9wXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkaXNwbGF5KGVsbSwgZGlzcGxheTIpIHtcbiAgc3R5bGUoZWxtLCBcImRpc3BsYXlcIiwgZGlzcGxheTIpO1xufVxuXG5mdW5jdGlvbiBmb2N1cyhlbG0pIHtcbiAgZWxtW1wic2V0QWN0aXZlXCJdICYmIGVsbVtcInNldEFjdGl2ZVwiXSgpIHx8IGVsbS5mb2N1cyh7IHByZXZlbnRTY3JvbGw6IHRydWUgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEF0dHJpYnV0ZShlbG0sIGF0dHIpIHtcbiAgcmV0dXJuIGVsbS5nZXRBdHRyaWJ1dGUoYXR0cik7XG59XG5cbmZ1bmN0aW9uIGhhc0NsYXNzKGVsbSwgY2xhc3NOYW1lKSB7XG4gIHJldHVybiBlbG0gJiYgZWxtLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpO1xufVxuXG5mdW5jdGlvbiByZWN0KHRhcmdldCkge1xuICByZXR1cm4gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xufVxuXG5mdW5jdGlvbiByZW1vdmUobm9kZXMpIHtcbiAgZm9yRWFjaChub2RlcywgKG5vZGUpID0+IHtcbiAgICBpZiAobm9kZSAmJiBub2RlLnBhcmVudE5vZGUpIHtcbiAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBtZWFzdXJlKHBhcmVudCwgdmFsdWUpIHtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIGNvbnN0IGRpdiA9IGNyZWF0ZShcImRpdlwiLCB7IHN0eWxlOiBgd2lkdGg6ICR7dmFsdWV9OyBwb3NpdGlvbjogYWJzb2x1dGU7YCB9LCBwYXJlbnQpO1xuICAgIHZhbHVlID0gcmVjdChkaXYpLndpZHRoO1xuICAgIHJlbW92ZShkaXYpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VIdG1sKGh0bWwpIHtcbiAgcmV0dXJuIGNoaWxkKG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoaHRtbCwgXCJ0ZXh0L2h0bWxcIikuYm9keSk7XG59XG5cbmZ1bmN0aW9uIHByZXZlbnQoZSwgc3RvcFByb3BhZ2F0aW9uKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgaWYgKHN0b3BQcm9wYWdhdGlvbikge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBxdWVyeShwYXJlbnQsIHNlbGVjdG9yKSB7XG4gIHJldHVybiBwYXJlbnQgJiYgcGFyZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xufVxuXG5mdW5jdGlvbiBxdWVyeUFsbChwYXJlbnQsIHNlbGVjdG9yKSB7XG4gIHJldHVybiBzbGljZShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVDbGFzcyhlbG0sIGNsYXNzZXMpIHtcbiAgdG9nZ2xlQ2xhc3MoZWxtLCBjbGFzc2VzLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIHVuaXQodmFsdWUpIHtcbiAgcmV0dXJuIGlzU3RyaW5nKHZhbHVlKSA/IHZhbHVlIDogdmFsdWUgPyBgJHt2YWx1ZX1weGAgOiBcIlwiO1xufVxuXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtZXNzYWdlID0gXCJcIikge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihgWyR7UFJPSkVDVF9DT0RFfV0gJHttZXNzYWdlfWApO1xuICB9XG59XG5cbmZ1bmN0aW9uIG5leHRUaWNrKGNhbGxiYWNrKSB7XG4gIHNldFRpbWVvdXQoY2FsbGJhY2spO1xufVxuXG5jb25zdCBub29wID0gKCkgPT4ge1xufTtcblxuZnVuY3Rpb24gcmFmKGZ1bmMpIHtcbiAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jKTtcbn1cblxuY29uc3QgeyBtaW4sIG1heCwgZmxvb3IsIGNlaWwsIGFicyB9ID0gTWF0aDtcblxuZnVuY3Rpb24gYXBwcm94aW1hdGVseUVxdWFsKHgsIHksIGVwc2lsb24pIHtcbiAgcmV0dXJuIGFicyh4IC0geSkgPCBlcHNpbG9uO1xufVxuXG5mdW5jdGlvbiBiZXR3ZWVuKG51bWJlciwgbWluT3JNYXgsIG1heE9yTWluLCBleGNsdXNpdmUpIHtcbiAgY29uc3QgbWluaW11bSA9IG1pbihtaW5Pck1heCwgbWF4T3JNaW4pO1xuICBjb25zdCBtYXhpbXVtID0gbWF4KG1pbk9yTWF4LCBtYXhPck1pbik7XG4gIHJldHVybiBleGNsdXNpdmUgPyBtaW5pbXVtIDwgbnVtYmVyICYmIG51bWJlciA8IG1heGltdW0gOiBtaW5pbXVtIDw9IG51bWJlciAmJiBudW1iZXIgPD0gbWF4aW11bTtcbn1cblxuZnVuY3Rpb24gY2xhbXAobnVtYmVyLCB4LCB5KSB7XG4gIGNvbnN0IG1pbmltdW0gPSBtaW4oeCwgeSk7XG4gIGNvbnN0IG1heGltdW0gPSBtYXgoeCwgeSk7XG4gIHJldHVybiBtaW4obWF4KG1pbmltdW0sIG51bWJlciksIG1heGltdW0pO1xufVxuXG5mdW5jdGlvbiBzaWduKHgpIHtcbiAgcmV0dXJuICsoeCA+IDApIC0gKyh4IDwgMCk7XG59XG5cbmZ1bmN0aW9uIGNhbWVsVG9LZWJhYihzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC8oW2EtejAtOV0pKFtBLVpdKS9nLCBcIiQxLSQyXCIpLnRvTG93ZXJDYXNlKCk7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdChzdHJpbmcsIHJlcGxhY2VtZW50cykge1xuICBmb3JFYWNoKHJlcGxhY2VtZW50cywgKHJlcGxhY2VtZW50KSA9PiB7XG4gICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoXCIlc1wiLCBgJHtyZXBsYWNlbWVudH1gKTtcbiAgfSk7XG4gIHJldHVybiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHBhZChudW1iZXIpIHtcbiAgcmV0dXJuIG51bWJlciA8IDEwID8gYDAke251bWJlcn1gIDogYCR7bnVtYmVyfWA7XG59XG5cbmNvbnN0IGlkcyA9IHt9O1xuZnVuY3Rpb24gdW5pcXVlSWQocHJlZml4KSB7XG4gIHJldHVybiBgJHtwcmVmaXh9JHtwYWQoaWRzW3ByZWZpeF0gPSAoaWRzW3ByZWZpeF0gfHwgMCkgKyAxKX1gO1xufVxuXG5mdW5jdGlvbiBFdmVudEJ1cygpIHtcbiAgbGV0IGhhbmRsZXJzID0ge307XG4gIGZ1bmN0aW9uIG9uKGV2ZW50cywgY2FsbGJhY2ssIGtleSwgcHJpb3JpdHkgPSBERUZBVUxUX0VWRU5UX1BSSU9SSVRZKSB7XG4gICAgZm9yRWFjaEV2ZW50KGV2ZW50cywgKGV2ZW50LCBuYW1lc3BhY2UpID0+IHtcbiAgICAgIGhhbmRsZXJzW2V2ZW50XSA9IGhhbmRsZXJzW2V2ZW50XSB8fCBbXTtcbiAgICAgIHB1c2goaGFuZGxlcnNbZXZlbnRdLCB7XG4gICAgICAgIF9ldmVudDogZXZlbnQsXG4gICAgICAgIF9jYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICAgIF9uYW1lc3BhY2U6IG5hbWVzcGFjZSxcbiAgICAgICAgX3ByaW9yaXR5OiBwcmlvcml0eSxcbiAgICAgICAgX2tleToga2V5XG4gICAgICB9KS5zb3J0KChoYW5kbGVyMSwgaGFuZGxlcjIpID0+IGhhbmRsZXIxLl9wcmlvcml0eSAtIGhhbmRsZXIyLl9wcmlvcml0eSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb2ZmKGV2ZW50cywga2V5KSB7XG4gICAgZm9yRWFjaEV2ZW50KGV2ZW50cywgKGV2ZW50LCBuYW1lc3BhY2UpID0+IHtcbiAgICAgIGNvbnN0IGV2ZW50SGFuZGxlcnMgPSBoYW5kbGVyc1tldmVudF07XG4gICAgICBoYW5kbGVyc1tldmVudF0gPSBldmVudEhhbmRsZXJzICYmIGV2ZW50SGFuZGxlcnMuZmlsdGVyKChoYW5kbGVyKSA9PiB7XG4gICAgICAgIHJldHVybiBoYW5kbGVyLl9rZXkgPyBoYW5kbGVyLl9rZXkgIT09IGtleSA6IGtleSB8fCBoYW5kbGVyLl9uYW1lc3BhY2UgIT09IG5hbWVzcGFjZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9mZkJ5KGtleSkge1xuICAgIGZvck93bihoYW5kbGVycywgKGV2ZW50SGFuZGxlcnMsIGV2ZW50KSA9PiB7XG4gICAgICBvZmYoZXZlbnQsIGtleSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gZW1pdChldmVudCkge1xuICAgIChoYW5kbGVyc1tldmVudF0gfHwgW10pLmZvckVhY2goKGhhbmRsZXIpID0+IHtcbiAgICAgIGhhbmRsZXIuX2NhbGxiYWNrLmFwcGx5KGhhbmRsZXIsIHNsaWNlKGFyZ3VtZW50cywgMSkpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgaGFuZGxlcnMgPSB7fTtcbiAgfVxuICBmdW5jdGlvbiBmb3JFYWNoRXZlbnQoZXZlbnRzLCBpdGVyYXRlZSkge1xuICAgIHRvQXJyYXkoZXZlbnRzKS5qb2luKFwiIFwiKS5zcGxpdChcIiBcIikuZm9yRWFjaCgoZXZlbnROUykgPT4ge1xuICAgICAgY29uc3QgZnJhZ21lbnRzID0gZXZlbnROUy5zcGxpdChcIi5cIik7XG4gICAgICBpdGVyYXRlZShmcmFnbWVudHNbMF0sIGZyYWdtZW50c1sxXSk7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBvbixcbiAgICBvZmYsXG4gICAgb2ZmQnksXG4gICAgZW1pdCxcbiAgICBkZXN0cm95XG4gIH07XG59XG5cbmNvbnN0IEVWRU5UX01PVU5URUQgPSBcIm1vdW50ZWRcIjtcbmNvbnN0IEVWRU5UX1JFQURZID0gXCJyZWFkeVwiO1xuY29uc3QgRVZFTlRfTU9WRSA9IFwibW92ZVwiO1xuY29uc3QgRVZFTlRfTU9WRUQgPSBcIm1vdmVkXCI7XG5jb25zdCBFVkVOVF9DTElDSyA9IFwiY2xpY2tcIjtcbmNvbnN0IEVWRU5UX0FDVElWRSA9IFwiYWN0aXZlXCI7XG5jb25zdCBFVkVOVF9JTkFDVElWRSA9IFwiaW5hY3RpdmVcIjtcbmNvbnN0IEVWRU5UX1ZJU0lCTEUgPSBcInZpc2libGVcIjtcbmNvbnN0IEVWRU5UX0hJRERFTiA9IFwiaGlkZGVuXCI7XG5jb25zdCBFVkVOVF9TTElERV9LRVlET1dOID0gXCJzbGlkZTprZXlkb3duXCI7XG5jb25zdCBFVkVOVF9SRUZSRVNIID0gXCJyZWZyZXNoXCI7XG5jb25zdCBFVkVOVF9VUERBVEVEID0gXCJ1cGRhdGVkXCI7XG5jb25zdCBFVkVOVF9SRVNJWkUgPSBcInJlc2l6ZVwiO1xuY29uc3QgRVZFTlRfUkVTSVpFRCA9IFwicmVzaXplZFwiO1xuY29uc3QgRVZFTlRfUkVQT1NJVElPTkVEID0gXCJyZXBvc2l0aW9uZWRcIjtcbmNvbnN0IEVWRU5UX0RSQUcgPSBcImRyYWdcIjtcbmNvbnN0IEVWRU5UX0RSQUdHSU5HID0gXCJkcmFnZ2luZ1wiO1xuY29uc3QgRVZFTlRfRFJBR0dFRCA9IFwiZHJhZ2dlZFwiO1xuY29uc3QgRVZFTlRfU0NST0xMID0gXCJzY3JvbGxcIjtcbmNvbnN0IEVWRU5UX1NDUk9MTEVEID0gXCJzY3JvbGxlZFwiO1xuY29uc3QgRVZFTlRfREVTVFJPWSA9IFwiZGVzdHJveVwiO1xuY29uc3QgRVZFTlRfQVJST1dTX01PVU5URUQgPSBcImFycm93czptb3VudGVkXCI7XG5jb25zdCBFVkVOVF9BUlJPV1NfVVBEQVRFRCA9IFwiYXJyb3dzOnVwZGF0ZWRcIjtcbmNvbnN0IEVWRU5UX1BBR0lOQVRJT05fTU9VTlRFRCA9IFwicGFnaW5hdGlvbjptb3VudGVkXCI7XG5jb25zdCBFVkVOVF9QQUdJTkFUSU9OX1VQREFURUQgPSBcInBhZ2luYXRpb246dXBkYXRlZFwiO1xuY29uc3QgRVZFTlRfTkFWSUdBVElPTl9NT1VOVEVEID0gXCJuYXZpZ2F0aW9uOm1vdW50ZWRcIjtcbmNvbnN0IEVWRU5UX0FVVE9QTEFZX1BMQVkgPSBcImF1dG9wbGF5OnBsYXlcIjtcbmNvbnN0IEVWRU5UX0FVVE9QTEFZX1BMQVlJTkcgPSBcImF1dG9wbGF5OnBsYXlpbmdcIjtcbmNvbnN0IEVWRU5UX0FVVE9QTEFZX1BBVVNFID0gXCJhdXRvcGxheTpwYXVzZVwiO1xuY29uc3QgRVZFTlRfTEFaWUxPQURfTE9BREVEID0gXCJsYXp5bG9hZDpsb2FkZWRcIjtcblxuZnVuY3Rpb24gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMikge1xuICBjb25zdCB7IGV2ZW50IH0gPSBTcGxpZGUyO1xuICBjb25zdCBrZXkgPSB7fTtcbiAgbGV0IGxpc3RlbmVycyA9IFtdO1xuICBmdW5jdGlvbiBvbihldmVudHMsIGNhbGxiYWNrLCBwcmlvcml0eSkge1xuICAgIGV2ZW50Lm9uKGV2ZW50cywgY2FsbGJhY2ssIGtleSwgcHJpb3JpdHkpO1xuICB9XG4gIGZ1bmN0aW9uIG9mZihldmVudHMpIHtcbiAgICBldmVudC5vZmYoZXZlbnRzLCBrZXkpO1xuICB9XG4gIGZ1bmN0aW9uIGJpbmQodGFyZ2V0cywgZXZlbnRzLCBjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIGZvckVhY2hFdmVudCh0YXJnZXRzLCBldmVudHMsICh0YXJnZXQsIGV2ZW50MikgPT4ge1xuICAgICAgbGlzdGVuZXJzLnB1c2goW3RhcmdldCwgZXZlbnQyLCBjYWxsYmFjaywgb3B0aW9uc10pO1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQyLCBjYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gdW5iaW5kKHRhcmdldHMsIGV2ZW50cywgY2FsbGJhY2spIHtcbiAgICBmb3JFYWNoRXZlbnQodGFyZ2V0cywgZXZlbnRzLCAodGFyZ2V0LCBldmVudDIpID0+IHtcbiAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5maWx0ZXIoKGxpc3RlbmVyKSA9PiB7XG4gICAgICAgIGlmIChsaXN0ZW5lclswXSA9PT0gdGFyZ2V0ICYmIGxpc3RlbmVyWzFdID09PSBldmVudDIgJiYgKCFjYWxsYmFjayB8fCBsaXN0ZW5lclsyXSA9PT0gY2FsbGJhY2spKSB7XG4gICAgICAgICAgdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQyLCBsaXN0ZW5lclsyXSwgbGlzdGVuZXJbM10pO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGZvckVhY2hFdmVudCh0YXJnZXRzLCBldmVudHMsIGl0ZXJhdGVlKSB7XG4gICAgZm9yRWFjaCh0YXJnZXRzLCAodGFyZ2V0KSA9PiB7XG4gICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgIGV2ZW50cy5zcGxpdChcIiBcIikuZm9yRWFjaChpdGVyYXRlZS5iaW5kKG51bGwsIHRhcmdldCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzLmZpbHRlcigoZGF0YSkgPT4gdW5iaW5kKGRhdGFbMF0sIGRhdGFbMV0pKTtcbiAgICBldmVudC5vZmZCeShrZXkpO1xuICB9XG4gIGV2ZW50Lm9uKEVWRU5UX0RFU1RST1ksIGRlc3Ryb3ksIGtleSk7XG4gIHJldHVybiB7XG4gICAgb24sXG4gICAgb2ZmLFxuICAgIGVtaXQ6IGV2ZW50LmVtaXQsXG4gICAgYmluZCxcbiAgICB1bmJpbmQsXG4gICAgZGVzdHJveVxuICB9O1xufVxuXG5mdW5jdGlvbiBSZXF1ZXN0SW50ZXJ2YWwoaW50ZXJ2YWwsIG9uSW50ZXJ2YWwsIG9uVXBkYXRlLCBsaW1pdCkge1xuICBjb25zdCB7IG5vdyB9ID0gRGF0ZTtcbiAgbGV0IHN0YXJ0VGltZTtcbiAgbGV0IHJhdGUgPSAwO1xuICBsZXQgaWQ7XG4gIGxldCBwYXVzZWQgPSB0cnVlO1xuICBsZXQgY291bnQgPSAwO1xuICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgaWYgKCFwYXVzZWQpIHtcbiAgICAgIGNvbnN0IGVsYXBzZWQgPSBub3coKSAtIHN0YXJ0VGltZTtcbiAgICAgIGlmIChlbGFwc2VkID49IGludGVydmFsKSB7XG4gICAgICAgIHJhdGUgPSAxO1xuICAgICAgICBzdGFydFRpbWUgPSBub3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJhdGUgPSBlbGFwc2VkIC8gaW50ZXJ2YWw7XG4gICAgICB9XG4gICAgICBpZiAob25VcGRhdGUpIHtcbiAgICAgICAgb25VcGRhdGUocmF0ZSk7XG4gICAgICB9XG4gICAgICBpZiAocmF0ZSA9PT0gMSkge1xuICAgICAgICBvbkludGVydmFsKCk7XG4gICAgICAgIGlmIChsaW1pdCAmJiArK2NvdW50ID49IGxpbWl0KSB7XG4gICAgICAgICAgcmV0dXJuIHBhdXNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJhZih1cGRhdGUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzdGFydChyZXN1bWUpIHtcbiAgICAhcmVzdW1lICYmIGNhbmNlbCgpO1xuICAgIHN0YXJ0VGltZSA9IG5vdygpIC0gKHJlc3VtZSA/IHJhdGUgKiBpbnRlcnZhbCA6IDApO1xuICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgIHJhZih1cGRhdGUpO1xuICB9XG4gIGZ1bmN0aW9uIHBhdXNlKCkge1xuICAgIHBhdXNlZCA9IHRydWU7XG4gIH1cbiAgZnVuY3Rpb24gcmV3aW5kKCkge1xuICAgIHN0YXJ0VGltZSA9IG5vdygpO1xuICAgIHJhdGUgPSAwO1xuICAgIGlmIChvblVwZGF0ZSkge1xuICAgICAgb25VcGRhdGUocmF0ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZShpZCk7XG4gICAgcmF0ZSA9IDA7XG4gICAgaWQgPSAwO1xuICAgIHBhdXNlZCA9IHRydWU7XG4gIH1cbiAgZnVuY3Rpb24gaXNQYXVzZWQoKSB7XG4gICAgcmV0dXJuIHBhdXNlZDtcbiAgfVxuICByZXR1cm4ge1xuICAgIHN0YXJ0LFxuICAgIHJld2luZCxcbiAgICBwYXVzZSxcbiAgICBjYW5jZWwsXG4gICAgaXNQYXVzZWRcbiAgfTtcbn1cblxuZnVuY3Rpb24gU3RhdGUoaW5pdGlhbFN0YXRlKSB7XG4gIGxldCBzdGF0ZSA9IGluaXRpYWxTdGF0ZTtcbiAgZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgc3RhdGUgPSB2YWx1ZTtcbiAgfVxuICBmdW5jdGlvbiBpcyhzdGF0ZXMpIHtcbiAgICByZXR1cm4gaW5jbHVkZXModG9BcnJheShzdGF0ZXMpLCBzdGF0ZSk7XG4gIH1cbiAgcmV0dXJuIHsgc2V0LCBpcyB9O1xufVxuXG5mdW5jdGlvbiBUaHJvdHRsZShmdW5jLCBkdXJhdGlvbikge1xuICBsZXQgaW50ZXJ2YWw7XG4gIGZ1bmN0aW9uIHRocm90dGxlZCgpIHtcbiAgICBpZiAoIWludGVydmFsKSB7XG4gICAgICBpbnRlcnZhbCA9IFJlcXVlc3RJbnRlcnZhbChkdXJhdGlvbiB8fCAwLCAoKSA9PiB7XG4gICAgICAgIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgaW50ZXJ2YWwgPSBudWxsO1xuICAgICAgfSwgbnVsbCwgMSk7XG4gICAgICBpbnRlcnZhbC5zdGFydCgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhyb3R0bGVkO1xufVxuXG5mdW5jdGlvbiBPcHRpb25zKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHRocm90dGxlZE9ic2VydmUgPSBUaHJvdHRsZShvYnNlcnZlKTtcbiAgbGV0IGluaXRpYWxPcHRpb25zO1xuICBsZXQgcG9pbnRzO1xuICBsZXQgY3VyclBvaW50O1xuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICB0cnkge1xuICAgICAgbWVyZ2Uob3B0aW9ucywgSlNPTi5wYXJzZShnZXRBdHRyaWJ1dGUoU3BsaWRlMi5yb290LCBEQVRBX0FUVFJJQlVURSkpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBhc3NlcnQoZmFsc2UsIGUubWVzc2FnZSk7XG4gICAgfVxuICAgIGluaXRpYWxPcHRpb25zID0gbWVyZ2Uoe30sIG9wdGlvbnMpO1xuICAgIGNvbnN0IHsgYnJlYWtwb2ludHMgfSA9IG9wdGlvbnM7XG4gICAgaWYgKGJyZWFrcG9pbnRzKSB7XG4gICAgICBjb25zdCBpc01pbiA9IG9wdGlvbnMubWVkaWFRdWVyeSA9PT0gXCJtaW5cIjtcbiAgICAgIHBvaW50cyA9IE9iamVjdC5rZXlzKGJyZWFrcG9pbnRzKS5zb3J0KChuLCBtKSA9PiBpc01pbiA/ICttIC0gK24gOiArbiAtICttKS5tYXAoKHBvaW50KSA9PiBbXG4gICAgICAgIHBvaW50LFxuICAgICAgICBtYXRjaE1lZGlhKGAoJHtpc01pbiA/IFwibWluXCIgOiBcIm1heFwifS13aWR0aDoke3BvaW50fXB4KWApXG4gICAgICBdKTtcbiAgICAgIG9ic2VydmUoKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaWYgKHBvaW50cykge1xuICAgICAgYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aHJvdHRsZWRPYnNlcnZlKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZGVzdHJveShjb21wbGV0ZWx5KSB7XG4gICAgaWYgKGNvbXBsZXRlbHkpIHtcbiAgICAgIHJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhyb3R0bGVkT2JzZXJ2ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG9ic2VydmUoKSB7XG4gICAgY29uc3QgaXRlbSA9IGZpbmQocG9pbnRzLCAoaXRlbTIpID0+IGl0ZW0yWzFdLm1hdGNoZXMpIHx8IFtdO1xuICAgIGlmIChpdGVtWzBdICE9PSBjdXJyUG9pbnQpIHtcbiAgICAgIG9uTWF0Y2goY3VyclBvaW50ID0gaXRlbVswXSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG9uTWF0Y2gocG9pbnQpIHtcbiAgICBjb25zdCBuZXdPcHRpb25zID0gb3B0aW9ucy5icmVha3BvaW50c1twb2ludF0gfHwgaW5pdGlhbE9wdGlvbnM7XG4gICAgaWYgKG5ld09wdGlvbnMuZGVzdHJveSkge1xuICAgICAgU3BsaWRlMi5vcHRpb25zID0gaW5pdGlhbE9wdGlvbnM7XG4gICAgICBTcGxpZGUyLmRlc3Ryb3kobmV3T3B0aW9ucy5kZXN0cm95ID09PSBcImNvbXBsZXRlbHlcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChTcGxpZGUyLnN0YXRlLmlzKERFU1RST1lFRCkpIHtcbiAgICAgICAgZGVzdHJveSh0cnVlKTtcbiAgICAgICAgU3BsaWRlMi5tb3VudCgpO1xuICAgICAgfVxuICAgICAgU3BsaWRlMi5vcHRpb25zID0gbmV3T3B0aW9ucztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBzZXR1cCxcbiAgICBtb3VudCxcbiAgICBkZXN0cm95XG4gIH07XG59XG5cbmNvbnN0IFJUTCA9IFwicnRsXCI7XG5jb25zdCBUVEIgPSBcInR0YlwiO1xuXG5jb25zdCBPUklFTlRBVElPTl9NQVAgPSB7XG4gIG1hcmdpblJpZ2h0OiBbXCJtYXJnaW5Cb3R0b21cIiwgXCJtYXJnaW5MZWZ0XCJdLFxuICBhdXRvV2lkdGg6IFtcImF1dG9IZWlnaHRcIl0sXG4gIGZpeGVkV2lkdGg6IFtcImZpeGVkSGVpZ2h0XCJdLFxuICBwYWRkaW5nTGVmdDogW1wicGFkZGluZ1RvcFwiLCBcInBhZGRpbmdSaWdodFwiXSxcbiAgcGFkZGluZ1JpZ2h0OiBbXCJwYWRkaW5nQm90dG9tXCIsIFwicGFkZGluZ0xlZnRcIl0sXG4gIHdpZHRoOiBbXCJoZWlnaHRcIl0sXG4gIGxlZnQ6IFtcInRvcFwiLCBcInJpZ2h0XCJdLFxuICByaWdodDogW1wiYm90dG9tXCIsIFwibGVmdFwiXSxcbiAgeDogW1wieVwiXSxcbiAgWDogW1wiWVwiXSxcbiAgWTogW1wiWFwiXSxcbiAgQXJyb3dMZWZ0OiBbXCJBcnJvd1VwXCIsIFwiQXJyb3dSaWdodFwiXSxcbiAgQXJyb3dSaWdodDogW1wiQXJyb3dEb3duXCIsIFwiQXJyb3dMZWZ0XCJdXG59O1xuZnVuY3Rpb24gRGlyZWN0aW9uKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGZ1bmN0aW9uIHJlc29sdmUocHJvcCwgYXhpc09ubHkpIHtcbiAgICBjb25zdCB7IGRpcmVjdGlvbiB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBpbmRleCA9IGRpcmVjdGlvbiA9PT0gUlRMICYmICFheGlzT25seSA/IDEgOiBkaXJlY3Rpb24gPT09IFRUQiA/IDAgOiAtMTtcbiAgICByZXR1cm4gT1JJRU5UQVRJT05fTUFQW3Byb3BdW2luZGV4XSB8fCBwcm9wO1xuICB9XG4gIGZ1bmN0aW9uIG9yaWVudCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAqIChvcHRpb25zLmRpcmVjdGlvbiA9PT0gUlRMID8gMSA6IC0xKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIHJlc29sdmUsXG4gICAgb3JpZW50XG4gIH07XG59XG5cbmNvbnN0IENMQVNTX1JPT1QgPSBQUk9KRUNUX0NPREU7XG5jb25zdCBDTEFTU19TTElERVIgPSBgJHtQUk9KRUNUX0NPREV9X19zbGlkZXJgO1xuY29uc3QgQ0xBU1NfVFJBQ0sgPSBgJHtQUk9KRUNUX0NPREV9X190cmFja2A7XG5jb25zdCBDTEFTU19MSVNUID0gYCR7UFJPSkVDVF9DT0RFfV9fbGlzdGA7XG5jb25zdCBDTEFTU19TTElERSA9IGAke1BST0pFQ1RfQ09ERX1fX3NsaWRlYDtcbmNvbnN0IENMQVNTX0NMT05FID0gYCR7Q0xBU1NfU0xJREV9LS1jbG9uZWA7XG5jb25zdCBDTEFTU19DT05UQUlORVIgPSBgJHtDTEFTU19TTElERX1fX2NvbnRhaW5lcmA7XG5jb25zdCBDTEFTU19BUlJPV1MgPSBgJHtQUk9KRUNUX0NPREV9X19hcnJvd3NgO1xuY29uc3QgQ0xBU1NfQVJST1cgPSBgJHtQUk9KRUNUX0NPREV9X19hcnJvd2A7XG5jb25zdCBDTEFTU19BUlJPV19QUkVWID0gYCR7Q0xBU1NfQVJST1d9LS1wcmV2YDtcbmNvbnN0IENMQVNTX0FSUk9XX05FWFQgPSBgJHtDTEFTU19BUlJPV30tLW5leHRgO1xuY29uc3QgQ0xBU1NfUEFHSU5BVElPTiA9IGAke1BST0pFQ1RfQ09ERX1fX3BhZ2luYXRpb25gO1xuY29uc3QgQ0xBU1NfUEFHSU5BVElPTl9QQUdFID0gYCR7Q0xBU1NfUEFHSU5BVElPTn1fX3BhZ2VgO1xuY29uc3QgQ0xBU1NfUFJPR1JFU1MgPSBgJHtQUk9KRUNUX0NPREV9X19wcm9ncmVzc2A7XG5jb25zdCBDTEFTU19QUk9HUkVTU19CQVIgPSBgJHtDTEFTU19QUk9HUkVTU31fX2JhcmA7XG5jb25zdCBDTEFTU19BVVRPUExBWSA9IGAke1BST0pFQ1RfQ09ERX1fX2F1dG9wbGF5YDtcbmNvbnN0IENMQVNTX1BMQVkgPSBgJHtQUk9KRUNUX0NPREV9X19wbGF5YDtcbmNvbnN0IENMQVNTX1BBVVNFID0gYCR7UFJPSkVDVF9DT0RFfV9fcGF1c2VgO1xuY29uc3QgQ0xBU1NfU1BJTk5FUiA9IGAke1BST0pFQ1RfQ09ERX1fX3NwaW5uZXJgO1xuY29uc3QgQ0xBU1NfSU5JVElBTElaRUQgPSBcImlzLWluaXRpYWxpemVkXCI7XG5jb25zdCBDTEFTU19BQ1RJVkUgPSBcImlzLWFjdGl2ZVwiO1xuY29uc3QgQ0xBU1NfUFJFViA9IFwiaXMtcHJldlwiO1xuY29uc3QgQ0xBU1NfTkVYVCA9IFwiaXMtbmV4dFwiO1xuY29uc3QgQ0xBU1NfVklTSUJMRSA9IFwiaXMtdmlzaWJsZVwiO1xuY29uc3QgQ0xBU1NfTE9BRElORyA9IFwiaXMtbG9hZGluZ1wiO1xuY29uc3QgU1RBVFVTX0NMQVNTRVMgPSBbQ0xBU1NfQUNUSVZFLCBDTEFTU19WSVNJQkxFLCBDTEFTU19QUkVWLCBDTEFTU19ORVhULCBDTEFTU19MT0FESU5HXTtcbmNvbnN0IENMQVNTRVMgPSB7XG4gIHNsaWRlOiBDTEFTU19TTElERSxcbiAgY2xvbmU6IENMQVNTX0NMT05FLFxuICBhcnJvd3M6IENMQVNTX0FSUk9XUyxcbiAgYXJyb3c6IENMQVNTX0FSUk9XLFxuICBwcmV2OiBDTEFTU19BUlJPV19QUkVWLFxuICBuZXh0OiBDTEFTU19BUlJPV19ORVhULFxuICBwYWdpbmF0aW9uOiBDTEFTU19QQUdJTkFUSU9OLFxuICBwYWdlOiBDTEFTU19QQUdJTkFUSU9OX1BBR0UsXG4gIHNwaW5uZXI6IENMQVNTX1NQSU5ORVJcbn07XG5cbmZ1bmN0aW9uIEVsZW1lbnRzKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24gfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICBjb25zdCB7IHJvb3QgfSA9IFNwbGlkZTI7XG4gIGNvbnN0IGVsZW1lbnRzID0ge307XG4gIGNvbnN0IHNsaWRlcyA9IFtdO1xuICBsZXQgY2xhc3NlcztcbiAgbGV0IHNsaWRlcjtcbiAgbGV0IHRyYWNrO1xuICBsZXQgbGlzdDtcbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgY29sbGVjdCgpO1xuICAgIGlkZW50aWZ5KCk7XG4gICAgYWRkQ2xhc3Mocm9vdCwgY2xhc3NlcyA9IGdldENsYXNzZXMoKSk7XG4gIH1cbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgb24oRVZFTlRfUkVGUkVTSCwgcmVmcmVzaCwgREVGQVVMVF9FVkVOVF9QUklPUklUWSAtIDIpO1xuICAgIG9uKEVWRU5UX1VQREFURUQsIHVwZGF0ZSk7XG4gIH1cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBbcm9vdCwgdHJhY2ssIGxpc3RdLmZvckVhY2goKGVsbSkgPT4ge1xuICAgICAgcmVtb3ZlQXR0cmlidXRlKGVsbSwgXCJzdHlsZVwiKTtcbiAgICB9KTtcbiAgICBlbXB0eShzbGlkZXMpO1xuICAgIHJlbW92ZUNsYXNzKHJvb3QsIGNsYXNzZXMpO1xuICB9XG4gIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgZGVzdHJveSgpO1xuICAgIHNldHVwKCk7XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHJlbW92ZUNsYXNzKHJvb3QsIGNsYXNzZXMpO1xuICAgIGFkZENsYXNzKHJvb3QsIGNsYXNzZXMgPSBnZXRDbGFzc2VzKCkpO1xuICB9XG4gIGZ1bmN0aW9uIGNvbGxlY3QoKSB7XG4gICAgc2xpZGVyID0gY2hpbGQocm9vdCwgYC4ke0NMQVNTX1NMSURFUn1gKTtcbiAgICB0cmFjayA9IHF1ZXJ5KHJvb3QsIGAuJHtDTEFTU19UUkFDS31gKTtcbiAgICBsaXN0ID0gY2hpbGQodHJhY2ssIGAuJHtDTEFTU19MSVNUfWApO1xuICAgIGFzc2VydCh0cmFjayAmJiBsaXN0LCBcIkEgdHJhY2svbGlzdCBlbGVtZW50IGlzIG1pc3NpbmcuXCIpO1xuICAgIHB1c2goc2xpZGVzLCBjaGlsZHJlbihsaXN0LCBgLiR7Q0xBU1NfU0xJREV9Om5vdCguJHtDTEFTU19DTE9ORX0pYCkpO1xuICAgIGNvbnN0IGF1dG9wbGF5ID0gZmluZChgLiR7Q0xBU1NfQVVUT1BMQVl9YCk7XG4gICAgY29uc3QgYXJyb3dzID0gZmluZChgLiR7Q0xBU1NfQVJST1dTfWApO1xuICAgIGFzc2lnbihlbGVtZW50cywge1xuICAgICAgcm9vdCxcbiAgICAgIHNsaWRlcixcbiAgICAgIHRyYWNrLFxuICAgICAgbGlzdCxcbiAgICAgIHNsaWRlcyxcbiAgICAgIGFycm93cyxcbiAgICAgIGF1dG9wbGF5LFxuICAgICAgcHJldjogcXVlcnkoYXJyb3dzLCBgLiR7Q0xBU1NfQVJST1dfUFJFVn1gKSxcbiAgICAgIG5leHQ6IHF1ZXJ5KGFycm93cywgYC4ke0NMQVNTX0FSUk9XX05FWFR9YCksXG4gICAgICBiYXI6IHF1ZXJ5KGZpbmQoYC4ke0NMQVNTX1BST0dSRVNTfWApLCBgLiR7Q0xBU1NfUFJPR1JFU1NfQkFSfWApLFxuICAgICAgcGxheTogcXVlcnkoYXV0b3BsYXksIGAuJHtDTEFTU19QTEFZfWApLFxuICAgICAgcGF1c2U6IHF1ZXJ5KGF1dG9wbGF5LCBgLiR7Q0xBU1NfUEFVU0V9YClcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBpZGVudGlmeSgpIHtcbiAgICBjb25zdCBpZCA9IHJvb3QuaWQgfHwgdW5pcXVlSWQoUFJPSkVDVF9DT0RFKTtcbiAgICByb290LmlkID0gaWQ7XG4gICAgdHJhY2suaWQgPSB0cmFjay5pZCB8fCBgJHtpZH0tdHJhY2tgO1xuICAgIGxpc3QuaWQgPSBsaXN0LmlkIHx8IGAke2lkfS1saXN0YDtcbiAgfVxuICBmdW5jdGlvbiBmaW5kKHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIGNoaWxkKHJvb3QsIHNlbGVjdG9yKSB8fCBjaGlsZChzbGlkZXIsIHNlbGVjdG9yKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRDbGFzc2VzKCkge1xuICAgIHJldHVybiBbXG4gICAgICBgJHtDTEFTU19ST09UfS0tJHtvcHRpb25zLnR5cGV9YCxcbiAgICAgIGAke0NMQVNTX1JPT1R9LS0ke29wdGlvbnMuZGlyZWN0aW9ufWAsXG4gICAgICBvcHRpb25zLmRyYWcgJiYgYCR7Q0xBU1NfUk9PVH0tLWRyYWdnYWJsZWAsXG4gICAgICBvcHRpb25zLmlzTmF2aWdhdGlvbiAmJiBgJHtDTEFTU19ST09UfS0tbmF2YCxcbiAgICAgIENMQVNTX0FDVElWRVxuICAgIF07XG4gIH1cbiAgcmV0dXJuIGFzc2lnbihlbGVtZW50cywge1xuICAgIHNldHVwLFxuICAgIG1vdW50LFxuICAgIGRlc3Ryb3lcbiAgfSk7XG59XG5cbmNvbnN0IFJPTEUgPSBcInJvbGVcIjtcbmNvbnN0IEFSSUFfQ09OVFJPTFMgPSBcImFyaWEtY29udHJvbHNcIjtcbmNvbnN0IEFSSUFfQ1VSUkVOVCA9IFwiYXJpYS1jdXJyZW50XCI7XG5jb25zdCBBUklBX0xBQkVMID0gXCJhcmlhLWxhYmVsXCI7XG5jb25zdCBBUklBX0hJRERFTiA9IFwiYXJpYS1oaWRkZW5cIjtcbmNvbnN0IFRBQl9JTkRFWCA9IFwidGFiaW5kZXhcIjtcbmNvbnN0IERJU0FCTEVEID0gXCJkaXNhYmxlZFwiO1xuY29uc3QgQVJJQV9PUklFTlRBVElPTiA9IFwiYXJpYS1vcmllbnRhdGlvblwiO1xuY29uc3QgQUxMX0FUVFJJQlVURVMgPSBbXG4gIFJPTEUsXG4gIEFSSUFfQ09OVFJPTFMsXG4gIEFSSUFfQ1VSUkVOVCxcbiAgQVJJQV9MQUJFTCxcbiAgQVJJQV9ISURERU4sXG4gIEFSSUFfT1JJRU5UQVRJT04sXG4gIFRBQl9JTkRFWCxcbiAgRElTQUJMRURcbl07XG5cbmNvbnN0IFNMSURFID0gXCJzbGlkZVwiO1xuY29uc3QgTE9PUCA9IFwibG9vcFwiO1xuY29uc3QgRkFERSA9IFwiZmFkZVwiO1xuXG5mdW5jdGlvbiBTbGlkZSQxKFNwbGlkZTIsIGluZGV4LCBzbGlkZUluZGV4LCBzbGlkZSkge1xuICBjb25zdCB7IG9uLCBlbWl0LCBiaW5kLCBkZXN0cm95OiBkZXN0cm95RXZlbnRzIH0gPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgY29uc3QgeyBDb21wb25lbnRzLCByb290LCBvcHRpb25zIH0gPSBTcGxpZGUyO1xuICBjb25zdCB7IGlzTmF2aWdhdGlvbiwgdXBkYXRlT25Nb3ZlIH0gPSBvcHRpb25zO1xuICBjb25zdCB7IHJlc29sdmUgfSA9IENvbXBvbmVudHMuRGlyZWN0aW9uO1xuICBjb25zdCBzdHlsZXMgPSBnZXRBdHRyaWJ1dGUoc2xpZGUsIFwic3R5bGVcIik7XG4gIGNvbnN0IGlzQ2xvbmUgPSBzbGlkZUluZGV4ID4gLTE7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGNoaWxkKHNsaWRlLCBgLiR7Q0xBU1NfQ09OVEFJTkVSfWApO1xuICBjb25zdCBmb2N1c2FibGVOb2RlcyA9IG9wdGlvbnMuZm9jdXNhYmxlTm9kZXMgJiYgcXVlcnlBbGwoc2xpZGUsIG9wdGlvbnMuZm9jdXNhYmxlTm9kZXMpO1xuICBsZXQgZGVzdHJveWVkO1xuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBpbml0KCk7XG4gICAgYmluZChzbGlkZSwgXCJjbGljayBrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICBlbWl0KGUudHlwZSA9PT0gXCJjbGlja1wiID8gRVZFTlRfQ0xJQ0sgOiBFVkVOVF9TTElERV9LRVlET1dOLCB0aGlzLCBlKTtcbiAgICB9KTtcbiAgICBvbihbRVZFTlRfUkVGUkVTSCwgRVZFTlRfUkVQT1NJVElPTkVELCBFVkVOVF9NT1ZFRCwgRVZFTlRfU0NST0xMRURdLCB1cGRhdGUuYmluZCh0aGlzKSk7XG4gICAgaWYgKHVwZGF0ZU9uTW92ZSkge1xuICAgICAgb24oRVZFTlRfTU9WRSwgb25Nb3ZlLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGlmICghaXNDbG9uZSkge1xuICAgICAgc2xpZGUuaWQgPSBgJHtyb290LmlkfS1zbGlkZSR7cGFkKGluZGV4ICsgMSl9YDtcbiAgICB9XG4gICAgaWYgKGlzTmF2aWdhdGlvbikge1xuICAgICAgY29uc3QgaWR4ID0gaXNDbG9uZSA/IHNsaWRlSW5kZXggOiBpbmRleDtcbiAgICAgIGNvbnN0IGxhYmVsID0gZm9ybWF0KG9wdGlvbnMuaTE4bi5zbGlkZVgsIGlkeCArIDEpO1xuICAgICAgY29uc3QgY29udHJvbHMgPSBTcGxpZGUyLnNwbGlkZXMubWFwKChzcGxpZGUpID0+IHNwbGlkZS5yb290LmlkKS5qb2luKFwiIFwiKTtcbiAgICAgIHNldEF0dHJpYnV0ZShzbGlkZSwgQVJJQV9MQUJFTCwgbGFiZWwpO1xuICAgICAgc2V0QXR0cmlidXRlKHNsaWRlLCBBUklBX0NPTlRST0xTLCBjb250cm9scyk7XG4gICAgICBzZXRBdHRyaWJ1dGUoc2xpZGUsIFJPTEUsIFwibWVudWl0ZW1cIik7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgZGVzdHJveWVkID0gdHJ1ZTtcbiAgICBkZXN0cm95RXZlbnRzKCk7XG4gICAgcmVtb3ZlQ2xhc3Moc2xpZGUsIFNUQVRVU19DTEFTU0VTKTtcbiAgICByZW1vdmVBdHRyaWJ1dGUoc2xpZGUsIEFMTF9BVFRSSUJVVEVTKTtcbiAgICBzZXRBdHRyaWJ1dGUoc2xpZGUsIFwic3R5bGVcIiwgc3R5bGVzKTtcbiAgfVxuICBmdW5jdGlvbiBvbk1vdmUobmV4dCwgcHJldiwgZGVzdCkge1xuICAgIGlmICghZGVzdHJveWVkKSB7XG4gICAgICB1cGRhdGUuY2FsbCh0aGlzKTtcbiAgICAgIGlmIChkZXN0ID09PSBpbmRleCkge1xuICAgICAgICB1cGRhdGVBY3Rpdml0eS5jYWxsKHRoaXMsIHRydWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgaWYgKCFkZXN0cm95ZWQpIHtcbiAgICAgIGNvbnN0IHsgaW5kZXg6IGN1cnJJbmRleCB9ID0gU3BsaWRlMjtcbiAgICAgIHVwZGF0ZUFjdGl2aXR5LmNhbGwodGhpcywgaXNBY3RpdmUoKSk7XG4gICAgICB1cGRhdGVWaXNpYmlsaXR5LmNhbGwodGhpcywgaXNWaXNpYmxlKCkpO1xuICAgICAgdG9nZ2xlQ2xhc3Moc2xpZGUsIENMQVNTX1BSRVYsIGluZGV4ID09PSBjdXJySW5kZXggLSAxKTtcbiAgICAgIHRvZ2dsZUNsYXNzKHNsaWRlLCBDTEFTU19ORVhULCBpbmRleCA9PT0gY3VyckluZGV4ICsgMSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZUFjdGl2aXR5KGFjdGl2ZSkge1xuICAgIGlmIChhY3RpdmUgIT09IGhhc0NsYXNzKHNsaWRlLCBDTEFTU19BQ1RJVkUpKSB7XG4gICAgICB0b2dnbGVDbGFzcyhzbGlkZSwgQ0xBU1NfQUNUSVZFLCBhY3RpdmUpO1xuICAgICAgaWYgKGlzTmF2aWdhdGlvbikge1xuICAgICAgICBzZXRBdHRyaWJ1dGUoc2xpZGUsIEFSSUFfQ1VSUkVOVCwgYWN0aXZlIHx8IG51bGwpO1xuICAgICAgfVxuICAgICAgZW1pdChhY3RpdmUgPyBFVkVOVF9BQ1RJVkUgOiBFVkVOVF9JTkFDVElWRSwgdGhpcyk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZVZpc2liaWxpdHkodmlzaWJsZSkge1xuICAgIGNvbnN0IGFyaWFIaWRkZW4gPSAhdmlzaWJsZSAmJiAhaXNBY3RpdmUoKTtcbiAgICBzZXRBdHRyaWJ1dGUoc2xpZGUsIEFSSUFfSElEREVOLCBhcmlhSGlkZGVuIHx8IG51bGwpO1xuICAgIHNldEF0dHJpYnV0ZShzbGlkZSwgVEFCX0lOREVYLCAhYXJpYUhpZGRlbiAmJiBvcHRpb25zLnNsaWRlRm9jdXMgPyAwIDogbnVsbCk7XG4gICAgaWYgKGZvY3VzYWJsZU5vZGVzKSB7XG4gICAgICBmb2N1c2FibGVOb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIHNldEF0dHJpYnV0ZShub2RlLCBUQUJfSU5ERVgsIGFyaWFIaWRkZW4gPyAtMSA6IG51bGwpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh2aXNpYmxlICE9PSBoYXNDbGFzcyhzbGlkZSwgQ0xBU1NfVklTSUJMRSkpIHtcbiAgICAgIHRvZ2dsZUNsYXNzKHNsaWRlLCBDTEFTU19WSVNJQkxFLCB2aXNpYmxlKTtcbiAgICAgIGVtaXQodmlzaWJsZSA/IEVWRU5UX1ZJU0lCTEUgOiBFVkVOVF9ISURERU4sIHRoaXMpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzdHlsZSQxKHByb3AsIHZhbHVlLCB1c2VDb250YWluZXIpIHtcbiAgICBzdHlsZSh1c2VDb250YWluZXIgJiYgY29udGFpbmVyIHx8IHNsaWRlLCBwcm9wLCB2YWx1ZSk7XG4gIH1cbiAgZnVuY3Rpb24gaXNBY3RpdmUoKSB7XG4gICAgcmV0dXJuIFNwbGlkZTIuaW5kZXggPT09IGluZGV4O1xuICB9XG4gIGZ1bmN0aW9uIGlzVmlzaWJsZSgpIHtcbiAgICBpZiAoU3BsaWRlMi5pcyhGQURFKSkge1xuICAgICAgcmV0dXJuIGlzQWN0aXZlKCk7XG4gICAgfVxuICAgIGNvbnN0IHRyYWNrUmVjdCA9IHJlY3QoQ29tcG9uZW50cy5FbGVtZW50cy50cmFjayk7XG4gICAgY29uc3Qgc2xpZGVSZWN0ID0gcmVjdChzbGlkZSk7XG4gICAgY29uc3QgbGVmdCA9IHJlc29sdmUoXCJsZWZ0XCIpO1xuICAgIGNvbnN0IHJpZ2h0ID0gcmVzb2x2ZShcInJpZ2h0XCIpO1xuICAgIHJldHVybiBmbG9vcih0cmFja1JlY3RbbGVmdF0pIDw9IGNlaWwoc2xpZGVSZWN0W2xlZnRdKSAmJiBmbG9vcihzbGlkZVJlY3RbcmlnaHRdKSA8PSBjZWlsKHRyYWNrUmVjdFtyaWdodF0pO1xuICB9XG4gIGZ1bmN0aW9uIGlzV2l0aGluKGZyb20sIGRpc3RhbmNlKSB7XG4gICAgbGV0IGRpZmYgPSBhYnMoZnJvbSAtIGluZGV4KTtcbiAgICBpZiAoIWlzQ2xvbmUgJiYgKG9wdGlvbnMucmV3aW5kIHx8IFNwbGlkZTIuaXMoTE9PUCkpKSB7XG4gICAgICBkaWZmID0gbWluKGRpZmYsIFNwbGlkZTIubGVuZ3RoIC0gZGlmZik7XG4gICAgfVxuICAgIHJldHVybiBkaWZmIDw9IGRpc3RhbmNlO1xuICB9XG4gIHJldHVybiB7XG4gICAgaW5kZXgsXG4gICAgc2xpZGVJbmRleCxcbiAgICBzbGlkZSxcbiAgICBjb250YWluZXIsXG4gICAgaXNDbG9uZSxcbiAgICBtb3VudCxcbiAgICBkZXN0cm95LFxuICAgIHN0eWxlOiBzdHlsZSQxLFxuICAgIGlzV2l0aGluXG4gIH07XG59XG5cbmZ1bmN0aW9uIFNsaWRlcyhTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICBjb25zdCB7IG9uLCBlbWl0LCBiaW5kIH0gPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgY29uc3QgeyBzbGlkZXMsIGxpc3QgfSA9IENvbXBvbmVudHMyLkVsZW1lbnRzO1xuICBjb25zdCBTbGlkZXMyID0gW107XG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGluaXQoKTtcbiAgICBvbihFVkVOVF9SRUZSRVNILCByZWZyZXNoKTtcbiAgICBvbihbRVZFTlRfTU9VTlRFRCwgRVZFTlRfUkVGUkVTSF0sICgpID0+IHtcbiAgICAgIFNsaWRlczIuc29ydCgoU2xpZGUxLCBTbGlkZTIpID0+IFNsaWRlMS5pbmRleCAtIFNsaWRlMi5pbmRleCk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBzbGlkZXMuZm9yRWFjaCgoc2xpZGUsIGluZGV4KSA9PiB7XG4gICAgICByZWdpc3RlcihzbGlkZSwgaW5kZXgsIC0xKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGZvckVhY2gkMSgoU2xpZGUyKSA9PiB7XG4gICAgICBTbGlkZTIuZGVzdHJveSgpO1xuICAgIH0pO1xuICAgIGVtcHR5KFNsaWRlczIpO1xuICB9XG4gIGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgZGVzdHJveSgpO1xuICAgIGluaXQoKTtcbiAgfVxuICBmdW5jdGlvbiByZWdpc3RlcihzbGlkZSwgaW5kZXgsIHNsaWRlSW5kZXgpIHtcbiAgICBjb25zdCBvYmplY3QgPSBTbGlkZSQxKFNwbGlkZTIsIGluZGV4LCBzbGlkZUluZGV4LCBzbGlkZSk7XG4gICAgb2JqZWN0Lm1vdW50KCk7XG4gICAgU2xpZGVzMi5wdXNoKG9iamVjdCk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0KGV4Y2x1ZGVDbG9uZXMpIHtcbiAgICByZXR1cm4gZXhjbHVkZUNsb25lcyA/IGZpbHRlcigoU2xpZGUyKSA9PiAhU2xpZGUyLmlzQ2xvbmUpIDogU2xpZGVzMjtcbiAgfVxuICBmdW5jdGlvbiBnZXRJbihwYWdlKSB7XG4gICAgY29uc3QgeyBDb250cm9sbGVyIH0gPSBDb21wb25lbnRzMjtcbiAgICBjb25zdCBpbmRleCA9IENvbnRyb2xsZXIudG9JbmRleChwYWdlKTtcbiAgICBjb25zdCBtYXggPSBDb250cm9sbGVyLmhhc0ZvY3VzKCkgPyAxIDogb3B0aW9ucy5wZXJQYWdlO1xuICAgIHJldHVybiBmaWx0ZXIoKFNsaWRlMikgPT4gYmV0d2VlbihTbGlkZTIuaW5kZXgsIGluZGV4LCBpbmRleCArIG1heCAtIDEpKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRBdChpbmRleCkge1xuICAgIHJldHVybiBmaWx0ZXIoaW5kZXgpWzBdO1xuICB9XG4gIGZ1bmN0aW9uIGFkZChpdGVtcywgaW5kZXgpIHtcbiAgICBmb3JFYWNoKGl0ZW1zLCAoc2xpZGUpID0+IHtcbiAgICAgIGlmIChpc1N0cmluZyhzbGlkZSkpIHtcbiAgICAgICAgc2xpZGUgPSBwYXJzZUh0bWwoc2xpZGUpO1xuICAgICAgfVxuICAgICAgaWYgKGlzSFRNTEVsZW1lbnQoc2xpZGUpKSB7XG4gICAgICAgIGNvbnN0IHJlZiA9IHNsaWRlc1tpbmRleF07XG4gICAgICAgIHJlZiA/IGJlZm9yZShzbGlkZSwgcmVmKSA6IGFwcGVuZChsaXN0LCBzbGlkZSk7XG4gICAgICAgIGFkZENsYXNzKHNsaWRlLCBvcHRpb25zLmNsYXNzZXMuc2xpZGUpO1xuICAgICAgICBvYnNlcnZlSW1hZ2VzKHNsaWRlLCBlbWl0LmJpbmQobnVsbCwgRVZFTlRfUkVTSVpFKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZW1pdChFVkVOVF9SRUZSRVNIKTtcbiAgfVxuICBmdW5jdGlvbiByZW1vdmUkMShtYXRjaGVyKSB7XG4gICAgcmVtb3ZlKGZpbHRlcihtYXRjaGVyKS5tYXAoKFNsaWRlMikgPT4gU2xpZGUyLnNsaWRlKSk7XG4gICAgZW1pdChFVkVOVF9SRUZSRVNIKTtcbiAgfVxuICBmdW5jdGlvbiBmb3JFYWNoJDEoaXRlcmF0ZWUsIGV4Y2x1ZGVDbG9uZXMpIHtcbiAgICBnZXQoZXhjbHVkZUNsb25lcykuZm9yRWFjaChpdGVyYXRlZSk7XG4gIH1cbiAgZnVuY3Rpb24gZmlsdGVyKG1hdGNoZXIpIHtcbiAgICByZXR1cm4gU2xpZGVzMi5maWx0ZXIoaXNGdW5jdGlvbihtYXRjaGVyKSA/IG1hdGNoZXIgOiAoU2xpZGUyKSA9PiBpc1N0cmluZyhtYXRjaGVyKSA/IG1hdGNoZXMoU2xpZGUyLnNsaWRlLCBtYXRjaGVyKSA6IGluY2x1ZGVzKHRvQXJyYXkobWF0Y2hlciksIFNsaWRlMi5pbmRleCkpO1xuICB9XG4gIGZ1bmN0aW9uIHN0eWxlKHByb3AsIHZhbHVlLCB1c2VDb250YWluZXIpIHtcbiAgICBmb3JFYWNoJDEoKFNsaWRlMikgPT4ge1xuICAgICAgU2xpZGUyLnN0eWxlKHByb3AsIHZhbHVlLCB1c2VDb250YWluZXIpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG9ic2VydmVJbWFnZXMoZWxtLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGltYWdlcyA9IHF1ZXJ5QWxsKGVsbSwgXCJpbWdcIik7XG4gICAgbGV0IHsgbGVuZ3RoIH0gPSBpbWFnZXM7XG4gICAgaWYgKGxlbmd0aCkge1xuICAgICAgaW1hZ2VzLmZvckVhY2goKGltZykgPT4ge1xuICAgICAgICBiaW5kKGltZywgXCJsb2FkIGVycm9yXCIsICgpID0+IHtcbiAgICAgICAgICBpZiAoIS0tbGVuZ3RoKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZ2V0TGVuZ3RoKGV4Y2x1ZGVDbG9uZXMpIHtcbiAgICByZXR1cm4gZXhjbHVkZUNsb25lcyA/IHNsaWRlcy5sZW5ndGggOiBTbGlkZXMyLmxlbmd0aDtcbiAgfVxuICBmdW5jdGlvbiBpc0Vub3VnaCgpIHtcbiAgICByZXR1cm4gU2xpZGVzMi5sZW5ndGggPiBvcHRpb25zLnBlclBhZ2U7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBtb3VudCxcbiAgICBkZXN0cm95LFxuICAgIHJlZ2lzdGVyLFxuICAgIGdldCxcbiAgICBnZXRJbixcbiAgICBnZXRBdCxcbiAgICBhZGQsXG4gICAgcmVtb3ZlOiByZW1vdmUkMSxcbiAgICBmb3JFYWNoOiBmb3JFYWNoJDEsXG4gICAgZmlsdGVyLFxuICAgIHN0eWxlLFxuICAgIGdldExlbmd0aCxcbiAgICBpc0Vub3VnaFxuICB9O1xufVxuXG5mdW5jdGlvbiBMYXlvdXQoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBvbiwgYmluZCwgZW1pdCB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IHsgU2xpZGVzIH0gPSBDb21wb25lbnRzMjtcbiAgY29uc3QgeyByZXNvbHZlIH0gPSBDb21wb25lbnRzMi5EaXJlY3Rpb247XG4gIGNvbnN0IHsgcm9vdCwgdHJhY2ssIGxpc3QgfSA9IENvbXBvbmVudHMyLkVsZW1lbnRzO1xuICBjb25zdCB7IGdldEF0IH0gPSBTbGlkZXM7XG4gIGxldCB2ZXJ0aWNhbDtcbiAgbGV0IHJvb3RSZWN0O1xuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBpbml0KCk7XG4gICAgYmluZCh3aW5kb3csIFwicmVzaXplIGxvYWRcIiwgVGhyb3R0bGUoZW1pdC5iaW5kKHRoaXMsIEVWRU5UX1JFU0laRSkpKTtcbiAgICBvbihbRVZFTlRfVVBEQVRFRCwgRVZFTlRfUkVGUkVTSF0sIGluaXQpO1xuICAgIG9uKEVWRU5UX1JFU0laRSwgcmVzaXplKTtcbiAgfVxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIHJvb3RSZWN0ID0gbnVsbDtcbiAgICB2ZXJ0aWNhbCA9IG9wdGlvbnMuZGlyZWN0aW9uID09PSBUVEI7XG4gICAgc3R5bGUocm9vdCwgXCJtYXhXaWR0aFwiLCB1bml0KG9wdGlvbnMud2lkdGgpKTtcbiAgICBzdHlsZSh0cmFjaywgcmVzb2x2ZShcInBhZGRpbmdMZWZ0XCIpLCBjc3NQYWRkaW5nKGZhbHNlKSk7XG4gICAgc3R5bGUodHJhY2ssIHJlc29sdmUoXCJwYWRkaW5nUmlnaHRcIiksIGNzc1BhZGRpbmcodHJ1ZSkpO1xuICAgIHJlc2l6ZSgpO1xuICB9XG4gIGZ1bmN0aW9uIHJlc2l6ZSgpIHtcbiAgICBjb25zdCBuZXdSZWN0ID0gcmVjdChyb290KTtcbiAgICBpZiAoIXJvb3RSZWN0IHx8IHJvb3RSZWN0LndpZHRoICE9PSBuZXdSZWN0LndpZHRoIHx8IHJvb3RSZWN0LmhlaWdodCAhPT0gbmV3UmVjdC5oZWlnaHQpIHtcbiAgICAgIHN0eWxlKHRyYWNrLCBcImhlaWdodFwiLCBjc3NUcmFja0hlaWdodCgpKTtcbiAgICAgIFNsaWRlcy5zdHlsZShyZXNvbHZlKFwibWFyZ2luUmlnaHRcIiksIHVuaXQob3B0aW9ucy5nYXApKTtcbiAgICAgIFNsaWRlcy5zdHlsZShcIndpZHRoXCIsIGNzc1NsaWRlV2lkdGgoKSB8fCBudWxsKTtcbiAgICAgIHNldFNsaWRlc0hlaWdodCgpO1xuICAgICAgcm9vdFJlY3QgPSBuZXdSZWN0O1xuICAgICAgZW1pdChFVkVOVF9SRVNJWkVEKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gc2V0U2xpZGVzSGVpZ2h0KCkge1xuICAgIFNsaWRlcy5zdHlsZShcImhlaWdodFwiLCBjc3NTbGlkZUhlaWdodCgpIHx8IG51bGwsIHRydWUpO1xuICB9XG4gIGZ1bmN0aW9uIGNzc1BhZGRpbmcocmlnaHQpIHtcbiAgICBjb25zdCB7IHBhZGRpbmcgfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgcHJvcCA9IHJlc29sdmUocmlnaHQgPyBcInJpZ2h0XCIgOiBcImxlZnRcIik7XG4gICAgcmV0dXJuIHBhZGRpbmcgJiYgdW5pdChwYWRkaW5nW3Byb3BdIHx8IChpc09iamVjdChwYWRkaW5nKSA/IDAgOiBwYWRkaW5nKSkgfHwgXCIwcHhcIjtcbiAgfVxuICBmdW5jdGlvbiBjc3NUcmFja0hlaWdodCgpIHtcbiAgICBsZXQgaGVpZ2h0ID0gXCJcIjtcbiAgICBpZiAodmVydGljYWwpIHtcbiAgICAgIGhlaWdodCA9IGNzc0hlaWdodCgpO1xuICAgICAgYXNzZXJ0KGhlaWdodCwgXCJoZWlnaHQgb3IgaGVpZ2h0UmF0aW8gaXMgbWlzc2luZy5cIik7XG4gICAgICBoZWlnaHQgPSBgY2FsYygke2hlaWdodH0gLSAke2Nzc1BhZGRpbmcoZmFsc2UpfSAtICR7Y3NzUGFkZGluZyh0cnVlKX0pYDtcbiAgICB9XG4gICAgcmV0dXJuIGhlaWdodDtcbiAgfVxuICBmdW5jdGlvbiBjc3NIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHVuaXQob3B0aW9ucy5oZWlnaHQgfHwgcmVjdChsaXN0KS53aWR0aCAqIG9wdGlvbnMuaGVpZ2h0UmF0aW8pO1xuICB9XG4gIGZ1bmN0aW9uIGNzc1NsaWRlV2lkdGgoKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuYXV0b1dpZHRoID8gXCJcIiA6IHVuaXQob3B0aW9ucy5maXhlZFdpZHRoKSB8fCAodmVydGljYWwgPyBcIlwiIDogY3NzU2xpZGVTaXplKCkpO1xuICB9XG4gIGZ1bmN0aW9uIGNzc1NsaWRlSGVpZ2h0KCkge1xuICAgIHJldHVybiB1bml0KG9wdGlvbnMuZml4ZWRIZWlnaHQpIHx8ICh2ZXJ0aWNhbCA/IG9wdGlvbnMuYXV0b0hlaWdodCA/IFwiXCIgOiBjc3NTbGlkZVNpemUoKSA6IGNzc0hlaWdodCgpKTtcbiAgfVxuICBmdW5jdGlvbiBjc3NTbGlkZVNpemUoKSB7XG4gICAgY29uc3QgZ2FwID0gdW5pdChvcHRpb25zLmdhcCk7XG4gICAgcmV0dXJuIGBjYWxjKCgxMDAlJHtnYXAgJiYgYCArICR7Z2FwfWB9KS8ke29wdGlvbnMucGVyUGFnZSB8fCAxfSR7Z2FwICYmIGAgLSAke2dhcH1gfSlgO1xuICB9XG4gIGZ1bmN0aW9uIGxpc3RTaXplKCkge1xuICAgIHJldHVybiByZWN0KGxpc3QpW3Jlc29sdmUoXCJ3aWR0aFwiKV07XG4gIH1cbiAgZnVuY3Rpb24gc2xpZGVTaXplKGluZGV4LCB3aXRob3V0R2FwKSB7XG4gICAgY29uc3QgU2xpZGUgPSBnZXRBdChpbmRleCB8fCAwKTtcbiAgICByZXR1cm4gU2xpZGUgPyByZWN0KFNsaWRlLnNsaWRlKVtyZXNvbHZlKFwid2lkdGhcIildICsgKHdpdGhvdXRHYXAgPyAwIDogZ2V0R2FwKCkpIDogMDtcbiAgfVxuICBmdW5jdGlvbiB0b3RhbFNpemUoaW5kZXgsIHdpdGhvdXRHYXApIHtcbiAgICBjb25zdCBTbGlkZSA9IGdldEF0KGluZGV4KTtcbiAgICBpZiAoU2xpZGUpIHtcbiAgICAgIGNvbnN0IHJpZ2h0ID0gcmVjdChTbGlkZS5zbGlkZSlbcmVzb2x2ZShcInJpZ2h0XCIpXTtcbiAgICAgIGNvbnN0IGxlZnQgPSByZWN0KGxpc3QpW3Jlc29sdmUoXCJsZWZ0XCIpXTtcbiAgICAgIHJldHVybiBhYnMocmlnaHQgLSBsZWZ0KSArICh3aXRob3V0R2FwID8gMCA6IGdldEdhcCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgZnVuY3Rpb24gc2xpZGVyU2l6ZSgpIHtcbiAgICByZXR1cm4gdG90YWxTaXplKFNwbGlkZTIubGVuZ3RoIC0gMSwgdHJ1ZSkgLSB0b3RhbFNpemUoLTEsIHRydWUpO1xuICB9XG4gIGZ1bmN0aW9uIGdldEdhcCgpIHtcbiAgICBjb25zdCBTbGlkZSA9IGdldEF0KDApO1xuICAgIHJldHVybiBTbGlkZSAmJiBwYXJzZUZsb2F0KHN0eWxlKFNsaWRlLnNsaWRlLCByZXNvbHZlKFwibWFyZ2luUmlnaHRcIikpKSB8fCAwO1xuICB9XG4gIGZ1bmN0aW9uIGdldFBhZGRpbmcocmlnaHQpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdChzdHlsZSh0cmFjaywgcmVzb2x2ZShgcGFkZGluZyR7cmlnaHQgPyBcIlJpZ2h0XCIgOiBcIkxlZnRcIn1gKSkpIHx8IDA7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBtb3VudCxcbiAgICBsaXN0U2l6ZSxcbiAgICBzbGlkZVNpemUsXG4gICAgc2xpZGVyU2l6ZSxcbiAgICB0b3RhbFNpemUsXG4gICAgZ2V0UGFkZGluZ1xuICB9O1xufVxuXG5mdW5jdGlvbiBDbG9uZXMoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBvbiwgZW1pdCB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IHsgRWxlbWVudHMsIFNsaWRlcyB9ID0gQ29tcG9uZW50czI7XG4gIGNvbnN0IHsgcmVzb2x2ZSB9ID0gQ29tcG9uZW50czIuRGlyZWN0aW9uO1xuICBjb25zdCBjbG9uZXMgPSBbXTtcbiAgbGV0IGNsb25lQ291bnQ7XG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGluaXQoKTtcbiAgICBvbihFVkVOVF9SRUZSRVNILCByZWZyZXNoKTtcbiAgICBvbihbRVZFTlRfVVBEQVRFRCwgRVZFTlRfUkVTSVpFXSwgb2JzZXJ2ZSk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBpZiAoY2xvbmVDb3VudCA9IGNvbXB1dGVDbG9uZUNvdW50KCkpIHtcbiAgICAgIGdlbmVyYXRlKGNsb25lQ291bnQpO1xuICAgICAgZW1pdChFVkVOVF9SRVNJWkUpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZShjbG9uZXMpO1xuICAgIGVtcHR5KGNsb25lcyk7XG4gIH1cbiAgZnVuY3Rpb24gcmVmcmVzaCgpIHtcbiAgICBkZXN0cm95KCk7XG4gICAgaW5pdCgpO1xuICB9XG4gIGZ1bmN0aW9uIG9ic2VydmUoKSB7XG4gICAgaWYgKGNsb25lQ291bnQgPCBjb21wdXRlQ2xvbmVDb3VudCgpKSB7XG4gICAgICBlbWl0KEVWRU5UX1JFRlJFU0gpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZW5lcmF0ZShjb3VudCkge1xuICAgIGNvbnN0IHNsaWRlcyA9IFNsaWRlcy5nZXQoKS5zbGljZSgpO1xuICAgIGNvbnN0IHsgbGVuZ3RoIH0gPSBzbGlkZXM7XG4gICAgaWYgKGxlbmd0aCkge1xuICAgICAgd2hpbGUgKHNsaWRlcy5sZW5ndGggPCBjb3VudCkge1xuICAgICAgICBwdXNoKHNsaWRlcywgc2xpZGVzKTtcbiAgICAgIH1cbiAgICAgIHB1c2goc2xpZGVzLnNsaWNlKC1jb3VudCksIHNsaWRlcy5zbGljZSgwLCBjb3VudCkpLmZvckVhY2goKFNsaWRlLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBpc0hlYWQgPSBpbmRleCA8IGNvdW50O1xuICAgICAgICBjb25zdCBjbG9uZSA9IGNsb25lRGVlcChTbGlkZS5zbGlkZSwgaW5kZXgpO1xuICAgICAgICBpc0hlYWQgPyBiZWZvcmUoY2xvbmUsIHNsaWRlc1swXS5zbGlkZSkgOiBhcHBlbmQoRWxlbWVudHMubGlzdCwgY2xvbmUpO1xuICAgICAgICBwdXNoKGNsb25lcywgY2xvbmUpO1xuICAgICAgICBTbGlkZXMucmVnaXN0ZXIoY2xvbmUsIGluZGV4IC0gY291bnQgKyAoaXNIZWFkID8gMCA6IGxlbmd0aCksIFNsaWRlLmluZGV4KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBjbG9uZURlZXAoZWxtLCBpbmRleCkge1xuICAgIGNvbnN0IGNsb25lID0gZWxtLmNsb25lTm9kZSh0cnVlKTtcbiAgICBhZGRDbGFzcyhjbG9uZSwgb3B0aW9ucy5jbGFzc2VzLmNsb25lKTtcbiAgICBjbG9uZS5pZCA9IGAke1NwbGlkZTIucm9vdC5pZH0tY2xvbmUke3BhZChpbmRleCArIDEpfWA7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG4gIGZ1bmN0aW9uIGNvbXB1dGVDbG9uZUNvdW50KCkge1xuICAgIGxldCB7IGNsb25lczogY2xvbmVzMiB9ID0gb3B0aW9ucztcbiAgICBpZiAoIVNwbGlkZTIuaXMoTE9PUCkpIHtcbiAgICAgIGNsb25lczIgPSAwO1xuICAgIH0gZWxzZSBpZiAoIWNsb25lczIpIHtcbiAgICAgIGNvbnN0IGZpeGVkU2l6ZSA9IG1lYXN1cmUoRWxlbWVudHMubGlzdCwgb3B0aW9uc1tyZXNvbHZlKFwiZml4ZWRXaWR0aFwiKV0pO1xuICAgICAgY29uc3QgZml4ZWRDb3VudCA9IGZpeGVkU2l6ZSAmJiBjZWlsKHJlY3QoRWxlbWVudHMudHJhY2spW3Jlc29sdmUoXCJ3aWR0aFwiKV0gLyBmaXhlZFNpemUpO1xuICAgICAgY29uc3QgYmFzZUNvdW50ID0gZml4ZWRDb3VudCB8fCBvcHRpb25zW3Jlc29sdmUoXCJhdXRvV2lkdGhcIildICYmIFNwbGlkZTIubGVuZ3RoIHx8IG9wdGlvbnMucGVyUGFnZTtcbiAgICAgIGNsb25lczIgPSBiYXNlQ291bnQgKiAob3B0aW9ucy5kcmFnID8gKG9wdGlvbnMuZmxpY2tNYXhQYWdlcyB8fCAxKSArIDEgOiAyKTtcbiAgICB9XG4gICAgcmV0dXJuIGNsb25lczI7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBtb3VudCxcbiAgICBkZXN0cm95XG4gIH07XG59XG5cbmZ1bmN0aW9uIE1vdmUoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBvbiwgZW1pdCB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IHsgc2xpZGVTaXplLCBnZXRQYWRkaW5nLCB0b3RhbFNpemUsIGxpc3RTaXplLCBzbGlkZXJTaXplIH0gPSBDb21wb25lbnRzMi5MYXlvdXQ7XG4gIGNvbnN0IHsgcmVzb2x2ZSwgb3JpZW50IH0gPSBDb21wb25lbnRzMi5EaXJlY3Rpb247XG4gIGNvbnN0IHsgbGlzdCwgdHJhY2sgfSA9IENvbXBvbmVudHMyLkVsZW1lbnRzO1xuICBsZXQgd2FpdGluZztcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgb24oW0VWRU5UX01PVU5URUQsIEVWRU5UX1JFU0laRUQsIEVWRU5UX1VQREFURUQsIEVWRU5UX1JFRlJFU0hdLCByZXBvc2l0aW9uKTtcbiAgfVxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZUF0dHJpYnV0ZShsaXN0LCBcInN0eWxlXCIpO1xuICB9XG4gIGZ1bmN0aW9uIHJlcG9zaXRpb24oKSB7XG4gICAgaWYgKCFpc0J1c3koKSkge1xuICAgICAgQ29tcG9uZW50czIuU2Nyb2xsLmNhbmNlbCgpO1xuICAgICAganVtcChTcGxpZGUyLmluZGV4KTtcbiAgICAgIGVtaXQoRVZFTlRfUkVQT1NJVElPTkVEKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbW92ZShkZXN0LCBpbmRleCwgcHJldiwgY2FsbGJhY2spIHtcbiAgICBpZiAoIWlzQnVzeSgpKSB7XG4gICAgICBjb25zdCB7IHNldCB9ID0gU3BsaWRlMi5zdGF0ZTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gZ2V0UG9zaXRpb24oKTtcbiAgICAgIGNvbnN0IGxvb3BpbmcgPSBkZXN0ICE9PSBpbmRleDtcbiAgICAgIHdhaXRpbmcgPSBsb29waW5nIHx8IG9wdGlvbnMud2FpdEZvclRyYW5zaXRpb247XG4gICAgICBzZXQoTU9WSU5HKTtcbiAgICAgIGVtaXQoRVZFTlRfTU9WRSwgaW5kZXgsIHByZXYsIGRlc3QpO1xuICAgICAgQ29tcG9uZW50czIuVHJhbnNpdGlvbi5zdGFydChkZXN0LCAoKSA9PiB7XG4gICAgICAgIGxvb3BpbmcgJiYganVtcChpbmRleCk7XG4gICAgICAgIHdhaXRpbmcgPSBmYWxzZTtcbiAgICAgICAgc2V0KElETEUpO1xuICAgICAgICBlbWl0KEVWRU5UX01PVkVELCBpbmRleCwgcHJldiwgZGVzdCk7XG4gICAgICAgIGlmIChvcHRpb25zLnRyaW1TcGFjZSA9PT0gXCJtb3ZlXCIgJiYgZGVzdCAhPT0gcHJldiAmJiBwb3NpdGlvbiA9PT0gZ2V0UG9zaXRpb24oKSkge1xuICAgICAgICAgIENvbXBvbmVudHMyLkNvbnRyb2xsZXIuZ28oZGVzdCA+IHByZXYgPyBcIj5cIiA6IFwiPFwiLCBmYWxzZSwgY2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBqdW1wKGluZGV4KSB7XG4gICAgdHJhbnNsYXRlKHRvUG9zaXRpb24oaW5kZXgsIHRydWUpKTtcbiAgfVxuICBmdW5jdGlvbiB0cmFuc2xhdGUocG9zaXRpb24sIHByZXZlbnRMb29wKSB7XG4gICAgaWYgKCFTcGxpZGUyLmlzKEZBREUpKSB7XG4gICAgICBsaXN0LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUke3Jlc29sdmUoXCJYXCIpfSgke3ByZXZlbnRMb29wID8gcG9zaXRpb24gOiBsb29wKHBvc2l0aW9uKX1weClgO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBsb29wKHBvc2l0aW9uKSB7XG4gICAgaWYgKCF3YWl0aW5nICYmIFNwbGlkZTIuaXMoTE9PUCkpIHtcbiAgICAgIGNvbnN0IGRpZmYgPSBvcmllbnQocG9zaXRpb24gLSBnZXRQb3NpdGlvbigpKTtcbiAgICAgIGNvbnN0IGV4Y2VlZGVkTWluID0gZXhjZWVkZWRMaW1pdChmYWxzZSwgcG9zaXRpb24pICYmIGRpZmYgPCAwO1xuICAgICAgY29uc3QgZXhjZWVkZWRNYXggPSBleGNlZWRlZExpbWl0KHRydWUsIHBvc2l0aW9uKSAmJiBkaWZmID4gMDtcbiAgICAgIGlmIChleGNlZWRlZE1pbiB8fCBleGNlZWRlZE1heCkge1xuICAgICAgICBwb3NpdGlvbiA9IHNoaWZ0KHBvc2l0aW9uLCBleGNlZWRlZE1heCk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwb3NpdGlvbjtcbiAgfVxuICBmdW5jdGlvbiBzaGlmdChwb3NpdGlvbiwgYmFja3dhcmRzKSB7XG4gICAgY29uc3QgZXhjZXNzID0gcG9zaXRpb24gLSBnZXRMaW1pdChiYWNrd2FyZHMpO1xuICAgIGNvbnN0IHNpemUgPSBzbGlkZXJTaXplKCk7XG4gICAgcG9zaXRpb24gLT0gc2lnbihleGNlc3MpICogc2l6ZSAqIGNlaWwoYWJzKGV4Y2VzcykgLyBzaXplKTtcbiAgICByZXR1cm4gcG9zaXRpb247XG4gIH1cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIHdhaXRpbmcgPSBmYWxzZTtcbiAgICB0cmFuc2xhdGUoZ2V0UG9zaXRpb24oKSk7XG4gICAgQ29tcG9uZW50czIuVHJhbnNpdGlvbi5jYW5jZWwoKTtcbiAgfVxuICBmdW5jdGlvbiB0b0luZGV4KHBvc2l0aW9uKSB7XG4gICAgY29uc3QgU2xpZGVzID0gQ29tcG9uZW50czIuU2xpZGVzLmdldCgpO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IG1pbkRpc3RhbmNlID0gSW5maW5pdHk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBTbGlkZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHNsaWRlSW5kZXggPSBTbGlkZXNbaV0uaW5kZXg7XG4gICAgICBjb25zdCBkaXN0YW5jZSA9IGFicyh0b1Bvc2l0aW9uKHNsaWRlSW5kZXgsIHRydWUpIC0gcG9zaXRpb24pO1xuICAgICAgaWYgKGRpc3RhbmNlIDw9IG1pbkRpc3RhbmNlKSB7XG4gICAgICAgIG1pbkRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICAgIGluZGV4ID0gc2xpZGVJbmRleDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cbiAgZnVuY3Rpb24gdG9Qb3NpdGlvbihpbmRleCwgdHJpbW1pbmcpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IG9yaWVudCh0b3RhbFNpemUoaW5kZXggLSAxKSAtIG9mZnNldChpbmRleCkpO1xuICAgIHJldHVybiB0cmltbWluZyA/IHRyaW0ocG9zaXRpb24pIDogcG9zaXRpb247XG4gIH1cbiAgZnVuY3Rpb24gZ2V0UG9zaXRpb24oKSB7XG4gICAgY29uc3QgbGVmdCA9IHJlc29sdmUoXCJsZWZ0XCIpO1xuICAgIHJldHVybiByZWN0KGxpc3QpW2xlZnRdIC0gcmVjdCh0cmFjaylbbGVmdF0gKyBvcmllbnQoZ2V0UGFkZGluZyhmYWxzZSkpO1xuICB9XG4gIGZ1bmN0aW9uIHRyaW0ocG9zaXRpb24pIHtcbiAgICBpZiAob3B0aW9ucy50cmltU3BhY2UgJiYgU3BsaWRlMi5pcyhTTElERSkpIHtcbiAgICAgIHBvc2l0aW9uID0gY2xhbXAocG9zaXRpb24sIDAsIG9yaWVudChzbGlkZXJTaXplKCkgLSBsaXN0U2l6ZSgpKSk7XG4gICAgfVxuICAgIHJldHVybiBwb3NpdGlvbjtcbiAgfVxuICBmdW5jdGlvbiBvZmZzZXQoaW5kZXgpIHtcbiAgICBjb25zdCB7IGZvY3VzIH0gPSBvcHRpb25zO1xuICAgIHJldHVybiBmb2N1cyA9PT0gXCJjZW50ZXJcIiA/IChsaXN0U2l6ZSgpIC0gc2xpZGVTaXplKGluZGV4LCB0cnVlKSkgLyAyIDogK2ZvY3VzICogc2xpZGVTaXplKGluZGV4KSB8fCAwO1xuICB9XG4gIGZ1bmN0aW9uIGdldExpbWl0KG1heCkge1xuICAgIHJldHVybiB0b1Bvc2l0aW9uKG1heCA/IENvbXBvbmVudHMyLkNvbnRyb2xsZXIuZ2V0RW5kKCkgOiAwLCAhIW9wdGlvbnMudHJpbVNwYWNlKTtcbiAgfVxuICBmdW5jdGlvbiBpc0J1c3koKSB7XG4gICAgcmV0dXJuICEhd2FpdGluZztcbiAgfVxuICBmdW5jdGlvbiBleGNlZWRlZExpbWl0KG1heCwgcG9zaXRpb24pIHtcbiAgICBwb3NpdGlvbiA9IGlzVW5kZWZpbmVkKHBvc2l0aW9uKSA/IGdldFBvc2l0aW9uKCkgOiBwb3NpdGlvbjtcbiAgICBjb25zdCBleGNlZWRlZE1pbiA9IG1heCAhPT0gdHJ1ZSAmJiBvcmllbnQocG9zaXRpb24pIDwgb3JpZW50KGdldExpbWl0KGZhbHNlKSk7XG4gICAgY29uc3QgZXhjZWVkZWRNYXggPSBtYXggIT09IGZhbHNlICYmIG9yaWVudChwb3NpdGlvbikgPiBvcmllbnQoZ2V0TGltaXQodHJ1ZSkpO1xuICAgIHJldHVybiBleGNlZWRlZE1pbiB8fCBleGNlZWRlZE1heDtcbiAgfVxuICByZXR1cm4ge1xuICAgIG1vdW50LFxuICAgIGRlc3Ryb3ksXG4gICAgbW92ZSxcbiAgICBqdW1wLFxuICAgIHRyYW5zbGF0ZSxcbiAgICBzaGlmdCxcbiAgICBjYW5jZWwsXG4gICAgdG9JbmRleCxcbiAgICB0b1Bvc2l0aW9uLFxuICAgIGdldFBvc2l0aW9uLFxuICAgIGdldExpbWl0LFxuICAgIGlzQnVzeSxcbiAgICBleGNlZWRlZExpbWl0XG4gIH07XG59XG5cbmZ1bmN0aW9uIENvbnRyb2xsZXIoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBvbiB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IHsgTW92ZSB9ID0gQ29tcG9uZW50czI7XG4gIGNvbnN0IHsgZ2V0UG9zaXRpb24sIGdldExpbWl0IH0gPSBNb3ZlO1xuICBjb25zdCB7IGlzRW5vdWdoLCBnZXRMZW5ndGggfSA9IENvbXBvbmVudHMyLlNsaWRlcztcbiAgY29uc3QgaXNMb29wID0gU3BsaWRlMi5pcyhMT09QKTtcbiAgY29uc3QgaXNTbGlkZSA9IFNwbGlkZTIuaXMoU0xJREUpO1xuICBsZXQgY3VyckluZGV4ID0gb3B0aW9ucy5zdGFydCB8fCAwO1xuICBsZXQgcHJldkluZGV4ID0gY3VyckluZGV4O1xuICBsZXQgc2xpZGVDb3VudDtcbiAgbGV0IHBlck1vdmU7XG4gIGxldCBwZXJQYWdlO1xuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBpbml0KCk7XG4gICAgb24oW0VWRU5UX1VQREFURUQsIEVWRU5UX1JFRlJFU0hdLCBpbml0LCBERUZBVUxUX0VWRU5UX1BSSU9SSVRZIC0gMSk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBzbGlkZUNvdW50ID0gZ2V0TGVuZ3RoKHRydWUpO1xuICAgIHBlck1vdmUgPSBvcHRpb25zLnBlck1vdmU7XG4gICAgcGVyUGFnZSA9IG9wdGlvbnMucGVyUGFnZTtcbiAgICBjdXJySW5kZXggPSBjbGFtcChjdXJySW5kZXgsIDAsIHNsaWRlQ291bnQgLSAxKTtcbiAgfVxuICBmdW5jdGlvbiBnbyhjb250cm9sLCBhbGxvd1NhbWVJbmRleCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBkZXN0ID0gcGFyc2UoY29udHJvbCk7XG4gICAgaWYgKG9wdGlvbnMudXNlU2Nyb2xsKSB7XG4gICAgICBzY3JvbGwoZGVzdCwgdHJ1ZSwgdHJ1ZSwgb3B0aW9ucy5zcGVlZCwgY2FsbGJhY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbmRleCA9IGxvb3AoZGVzdCk7XG4gICAgICBpZiAoaW5kZXggPiAtMSAmJiAhTW92ZS5pc0J1c3koKSAmJiAoYWxsb3dTYW1lSW5kZXggfHwgaW5kZXggIT09IGN1cnJJbmRleCkpIHtcbiAgICAgICAgc2V0SW5kZXgoaW5kZXgpO1xuICAgICAgICBNb3ZlLm1vdmUoZGVzdCwgaW5kZXgsIHByZXZJbmRleCwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBzY3JvbGwoZGVzdGluYXRpb24sIHVzZUluZGV4LCBzbmFwLCBkdXJhdGlvbiwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBkZXN0ID0gdXNlSW5kZXggPyBkZXN0aW5hdGlvbiA6IHRvRGVzdChkZXN0aW5hdGlvbik7XG4gICAgQ29tcG9uZW50czIuU2Nyb2xsLnNjcm9sbCh1c2VJbmRleCB8fCBzbmFwID8gTW92ZS50b1Bvc2l0aW9uKGRlc3QsIHRydWUpIDogZGVzdGluYXRpb24sIGR1cmF0aW9uLCAoKSA9PiB7XG4gICAgICBzZXRJbmRleChNb3ZlLnRvSW5kZXgoTW92ZS5nZXRQb3NpdGlvbigpKSk7XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHBhcnNlKGNvbnRyb2wpIHtcbiAgICBsZXQgaW5kZXggPSBjdXJySW5kZXg7XG4gICAgaWYgKGlzU3RyaW5nKGNvbnRyb2wpKSB7XG4gICAgICBjb25zdCBbLCBpbmRpY2F0b3IsIG51bWJlcl0gPSBjb250cm9sLm1hdGNoKC8oWytcXC08Pl0pKFxcZCspPy8pIHx8IFtdO1xuICAgICAgaWYgKGluZGljYXRvciA9PT0gXCIrXCIgfHwgaW5kaWNhdG9yID09PSBcIi1cIikge1xuICAgICAgICBpbmRleCA9IGNvbXB1dGVEZXN0SW5kZXgoY3VyckluZGV4ICsgK2Ake2luZGljYXRvcn0keytudW1iZXIgfHwgMX1gLCBjdXJySW5kZXgsIHRydWUpO1xuICAgICAgfSBlbHNlIGlmIChpbmRpY2F0b3IgPT09IFwiPlwiKSB7XG4gICAgICAgIGluZGV4ID0gbnVtYmVyID8gdG9JbmRleCgrbnVtYmVyKSA6IGdldE5leHQodHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGluZGljYXRvciA9PT0gXCI8XCIpIHtcbiAgICAgICAgaW5kZXggPSBnZXRQcmV2KHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNMb29wKSB7XG4gICAgICAgIGluZGV4ID0gY2xhbXAoY29udHJvbCwgLXBlclBhZ2UsIHNsaWRlQ291bnQgKyBwZXJQYWdlIC0gMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleCA9IGNsYW1wKGNvbnRyb2wsIDAsIGdldEVuZCgpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG4gIGZ1bmN0aW9uIGdldE5leHQoZGVzdGluYXRpb24pIHtcbiAgICByZXR1cm4gZ2V0QWRqYWNlbnQoZmFsc2UsIGRlc3RpbmF0aW9uKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRQcmV2KGRlc3RpbmF0aW9uKSB7XG4gICAgcmV0dXJuIGdldEFkamFjZW50KHRydWUsIGRlc3RpbmF0aW9uKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRBZGphY2VudChwcmV2LCBkZXN0aW5hdGlvbikge1xuICAgIGNvbnN0IG51bWJlciA9IHBlck1vdmUgfHwgKGhhc0ZvY3VzKCkgPyAxIDogcGVyUGFnZSk7XG4gICAgY29uc3QgZGVzdCA9IGNvbXB1dGVEZXN0SW5kZXgoY3VyckluZGV4ICsgbnVtYmVyICogKHByZXYgPyAtMSA6IDEpLCBjdXJySW5kZXgpO1xuICAgIGlmIChkZXN0ID09PSAtMSAmJiBpc1NsaWRlKSB7XG4gICAgICBpZiAoIWFwcHJveGltYXRlbHlFcXVhbChnZXRQb3NpdGlvbigpLCBnZXRMaW1pdCghcHJldiksIDEpKSB7XG4gICAgICAgIHJldHVybiBwcmV2ID8gMCA6IGdldEVuZCgpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGVzdGluYXRpb24gPyBkZXN0IDogbG9vcChkZXN0KTtcbiAgfVxuICBmdW5jdGlvbiBjb21wdXRlRGVzdEluZGV4KGRlc3QsIGZyb20sIGluY3JlbWVudGFsKSB7XG4gICAgaWYgKGlzRW5vdWdoKCkpIHtcbiAgICAgIGNvbnN0IGVuZCA9IGdldEVuZCgpO1xuICAgICAgaWYgKGRlc3QgPCAwIHx8IGRlc3QgPiBlbmQpIHtcbiAgICAgICAgaWYgKGJldHdlZW4oMCwgZGVzdCwgZnJvbSwgdHJ1ZSkgfHwgYmV0d2VlbihlbmQsIGZyb20sIGRlc3QsIHRydWUpKSB7XG4gICAgICAgICAgZGVzdCA9IHRvSW5kZXgodG9QYWdlKGRlc3QpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaXNMb29wKSB7XG4gICAgICAgICAgICBkZXN0ID0gcGVyTW92ZSA/IGRlc3QgOiBkZXN0IDwgMCA/IC0oc2xpZGVDb3VudCAlIHBlclBhZ2UgfHwgcGVyUGFnZSkgOiBzbGlkZUNvdW50O1xuICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5yZXdpbmQpIHtcbiAgICAgICAgICAgIGRlc3QgPSBkZXN0IDwgMCA/IGVuZCA6IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlc3QgPSAtMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaW5jcmVtZW50YWwgJiYgZGVzdCAhPT0gZnJvbSkge1xuICAgICAgICAgIGRlc3QgPSBwZXJNb3ZlID8gZGVzdCA6IHRvSW5kZXgodG9QYWdlKGZyb20pICsgKGRlc3QgPCBmcm9tID8gLTEgOiAxKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGVzdCA9IC0xO1xuICAgIH1cbiAgICByZXR1cm4gZGVzdDtcbiAgfVxuICBmdW5jdGlvbiBnZXRFbmQoKSB7XG4gICAgbGV0IGVuZCA9IHNsaWRlQ291bnQgLSBwZXJQYWdlO1xuICAgIGlmIChoYXNGb2N1cygpIHx8IGlzTG9vcCAmJiBwZXJNb3ZlKSB7XG4gICAgICBlbmQgPSBzbGlkZUNvdW50IC0gMTtcbiAgICB9XG4gICAgcmV0dXJuIG1heChlbmQsIDApO1xuICB9XG4gIGZ1bmN0aW9uIGxvb3AoaW5kZXgpIHtcbiAgICBpZiAoaXNMb29wKSB7XG4gICAgICByZXR1cm4gaXNFbm91Z2goKSA/IGluZGV4ICUgc2xpZGVDb3VudCArIChpbmRleCA8IDAgPyBzbGlkZUNvdW50IDogMCkgOiAtMTtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG4gIGZ1bmN0aW9uIHRvSW5kZXgocGFnZSkge1xuICAgIHJldHVybiBjbGFtcChoYXNGb2N1cygpID8gcGFnZSA6IHBlclBhZ2UgKiBwYWdlLCAwLCBnZXRFbmQoKSk7XG4gIH1cbiAgZnVuY3Rpb24gdG9QYWdlKGluZGV4KSB7XG4gICAgaWYgKCFoYXNGb2N1cygpKSB7XG4gICAgICBpbmRleCA9IGJldHdlZW4oaW5kZXgsIHNsaWRlQ291bnQgLSBwZXJQYWdlLCBzbGlkZUNvdW50IC0gMSkgPyBzbGlkZUNvdW50IC0gMSA6IGluZGV4O1xuICAgICAgaW5kZXggPSBmbG9vcihpbmRleCAvIHBlclBhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cbiAgZnVuY3Rpb24gdG9EZXN0KGRlc3RpbmF0aW9uKSB7XG4gICAgY29uc3QgY2xvc2VzdCA9IE1vdmUudG9JbmRleChkZXN0aW5hdGlvbik7XG4gICAgcmV0dXJuIGlzU2xpZGUgPyBjbGFtcChjbG9zZXN0LCAwLCBnZXRFbmQoKSkgOiBjbG9zZXN0O1xuICB9XG4gIGZ1bmN0aW9uIHNldEluZGV4KGluZGV4KSB7XG4gICAgaWYgKGluZGV4ICE9PSBjdXJySW5kZXgpIHtcbiAgICAgIHByZXZJbmRleCA9IGN1cnJJbmRleDtcbiAgICAgIGN1cnJJbmRleCA9IGluZGV4O1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBnZXRJbmRleChwcmV2KSB7XG4gICAgcmV0dXJuIHByZXYgPyBwcmV2SW5kZXggOiBjdXJySW5kZXg7XG4gIH1cbiAgZnVuY3Rpb24gaGFzRm9jdXMoKSB7XG4gICAgcmV0dXJuICFpc1VuZGVmaW5lZChvcHRpb25zLmZvY3VzKSB8fCBvcHRpb25zLmlzTmF2aWdhdGlvbjtcbiAgfVxuICByZXR1cm4ge1xuICAgIG1vdW50LFxuICAgIGdvLFxuICAgIHNjcm9sbCxcbiAgICBnZXROZXh0LFxuICAgIGdldFByZXYsXG4gICAgZ2V0RW5kLFxuICAgIHNldEluZGV4LFxuICAgIGdldEluZGV4LFxuICAgIHRvSW5kZXgsXG4gICAgdG9QYWdlLFxuICAgIHRvRGVzdCxcbiAgICBoYXNGb2N1c1xuICB9O1xufVxuXG5jb25zdCBYTUxfTkFNRV9TUEFDRSA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcbmNvbnN0IFBBVEggPSBcIm0xNS41IDAuOTMyLTQuMyA0LjM4IDE0LjUgMTQuNi0xNC41IDE0LjUgNC4zIDQuNCAxNC42LTE0LjYgNC40LTQuMy00LjQtNC40LTE0LjYtMTQuNnpcIjtcbmNvbnN0IFNJWkUgPSA0MDtcblxuZnVuY3Rpb24gQXJyb3dzKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24sIGJpbmQsIGVtaXQgfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICBjb25zdCB7IGNsYXNzZXMsIGkxOG4gfSA9IG9wdGlvbnM7XG4gIGNvbnN0IHsgRWxlbWVudHMsIENvbnRyb2xsZXIgfSA9IENvbXBvbmVudHMyO1xuICBsZXQgd3JhcHBlciA9IEVsZW1lbnRzLmFycm93cztcbiAgbGV0IHByZXYgPSBFbGVtZW50cy5wcmV2O1xuICBsZXQgbmV4dCA9IEVsZW1lbnRzLm5leHQ7XG4gIGxldCBjcmVhdGVkO1xuICBjb25zdCBhcnJvd3MgPSB7fTtcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaW5pdCgpO1xuICAgIG9uKEVWRU5UX1VQREFURUQsIGluaXQpO1xuICB9XG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgaWYgKG9wdGlvbnMuYXJyb3dzKSB7XG4gICAgICBpZiAoIXByZXYgfHwgIW5leHQpIHtcbiAgICAgICAgY3JlYXRlQXJyb3dzKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwcmV2ICYmIG5leHQpIHtcbiAgICAgIGlmICghYXJyb3dzLnByZXYpIHtcbiAgICAgICAgY29uc3QgeyBpZCB9ID0gRWxlbWVudHMudHJhY2s7XG4gICAgICAgIHNldEF0dHJpYnV0ZShwcmV2LCBBUklBX0NPTlRST0xTLCBpZCk7XG4gICAgICAgIHNldEF0dHJpYnV0ZShuZXh0LCBBUklBX0NPTlRST0xTLCBpZCk7XG4gICAgICAgIGFycm93cy5wcmV2ID0gcHJldjtcbiAgICAgICAgYXJyb3dzLm5leHQgPSBuZXh0O1xuICAgICAgICBsaXN0ZW4oKTtcbiAgICAgICAgZW1pdChFVkVOVF9BUlJPV1NfTU9VTlRFRCwgcHJldiwgbmV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXNwbGF5KHdyYXBwZXIsIG9wdGlvbnMuYXJyb3dzID09PSBmYWxzZSA/IFwibm9uZVwiIDogXCJcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgaWYgKGNyZWF0ZWQpIHtcbiAgICAgIHJlbW92ZSh3cmFwcGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVtb3ZlQXR0cmlidXRlKHByZXYsIEFMTF9BVFRSSUJVVEVTKTtcbiAgICAgIHJlbW92ZUF0dHJpYnV0ZShuZXh0LCBBTExfQVRUUklCVVRFUyk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGxpc3RlbigpIHtcbiAgICBjb25zdCB7IGdvIH0gPSBDb250cm9sbGVyO1xuICAgIG9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9NT1ZFRCwgRVZFTlRfVVBEQVRFRCwgRVZFTlRfUkVGUkVTSCwgRVZFTlRfU0NST0xMRURdLCB1cGRhdGUpO1xuICAgIGJpbmQobmV4dCwgXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBnbyhcIj5cIiwgdHJ1ZSk7XG4gICAgfSk7XG4gICAgYmluZChwcmV2LCBcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGdvKFwiPFwiLCB0cnVlKTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVBcnJvd3MoKSB7XG4gICAgd3JhcHBlciA9IGNyZWF0ZShcImRpdlwiLCBjbGFzc2VzLmFycm93cyk7XG4gICAgcHJldiA9IGNyZWF0ZUFycm93KHRydWUpO1xuICAgIG5leHQgPSBjcmVhdGVBcnJvdyhmYWxzZSk7XG4gICAgY3JlYXRlZCA9IHRydWU7XG4gICAgYXBwZW5kKHdyYXBwZXIsIFtwcmV2LCBuZXh0XSk7XG4gICAgYmVmb3JlKHdyYXBwZXIsIGNoaWxkKG9wdGlvbnMuYXJyb3dzID09PSBcInNsaWRlclwiICYmIEVsZW1lbnRzLnNsaWRlciB8fCBTcGxpZGUyLnJvb3QpKTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVBcnJvdyhwcmV2Mikge1xuICAgIGNvbnN0IGFycm93ID0gYDxidXR0b24gY2xhc3M9XCIke2NsYXNzZXMuYXJyb3d9ICR7cHJldjIgPyBjbGFzc2VzLnByZXYgOiBjbGFzc2VzLm5leHR9XCIgdHlwZT1cImJ1dHRvblwiPjxzdmcgeG1sbnM9XCIke1hNTF9OQU1FX1NQQUNFfVwiIHZpZXdCb3g9XCIwIDAgJHtTSVpFfSAke1NJWkV9XCIgd2lkdGg9XCIke1NJWkV9XCIgaGVpZ2h0PVwiJHtTSVpFfVwiPjxwYXRoIGQ9XCIke29wdGlvbnMuYXJyb3dQYXRoIHx8IFBBVEh9XCIgLz5gO1xuICAgIHJldHVybiBwYXJzZUh0bWwoYXJyb3cpO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICBjb25zdCBpbmRleCA9IFNwbGlkZTIuaW5kZXg7XG4gICAgY29uc3QgcHJldkluZGV4ID0gQ29udHJvbGxlci5nZXRQcmV2KCk7XG4gICAgY29uc3QgbmV4dEluZGV4ID0gQ29udHJvbGxlci5nZXROZXh0KCk7XG4gICAgY29uc3QgcHJldkxhYmVsID0gcHJldkluZGV4ID4gLTEgJiYgaW5kZXggPCBwcmV2SW5kZXggPyBpMThuLmxhc3QgOiBpMThuLnByZXY7XG4gICAgY29uc3QgbmV4dExhYmVsID0gbmV4dEluZGV4ID4gLTEgJiYgaW5kZXggPiBuZXh0SW5kZXggPyBpMThuLmZpcnN0IDogaTE4bi5uZXh0O1xuICAgIHByZXYuZGlzYWJsZWQgPSBwcmV2SW5kZXggPCAwO1xuICAgIG5leHQuZGlzYWJsZWQgPSBuZXh0SW5kZXggPCAwO1xuICAgIHNldEF0dHJpYnV0ZShwcmV2LCBBUklBX0xBQkVMLCBwcmV2TGFiZWwpO1xuICAgIHNldEF0dHJpYnV0ZShuZXh0LCBBUklBX0xBQkVMLCBuZXh0TGFiZWwpO1xuICAgIGVtaXQoRVZFTlRfQVJST1dTX1VQREFURUQsIHByZXYsIG5leHQsIHByZXZJbmRleCwgbmV4dEluZGV4KTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGFycm93cyxcbiAgICBtb3VudCxcbiAgICBkZXN0cm95XG4gIH07XG59XG5cbmZ1bmN0aW9uIEF1dG9wbGF5KFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24sIGJpbmQsIGVtaXQgfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICBjb25zdCB7IEVsZW1lbnRzIH0gPSBDb21wb25lbnRzMjtcbiAgY29uc3QgaW50ZXJ2YWwgPSBSZXF1ZXN0SW50ZXJ2YWwob3B0aW9ucy5pbnRlcnZhbCwgU3BsaWRlMi5nby5iaW5kKFNwbGlkZTIsIFwiPlwiKSwgdXBkYXRlKTtcbiAgY29uc3QgeyBpc1BhdXNlZCB9ID0gaW50ZXJ2YWw7XG4gIGxldCBob3ZlcmVkO1xuICBsZXQgZm9jdXNlZDtcbiAgbGV0IHBhdXNlZDtcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgY29uc3QgeyBhdXRvcGxheSB9ID0gb3B0aW9ucztcbiAgICBpZiAoYXV0b3BsYXkpIHtcbiAgICAgIGluaXRCdXR0b24odHJ1ZSk7XG4gICAgICBpbml0QnV0dG9uKGZhbHNlKTtcbiAgICAgIGxpc3RlbigpO1xuICAgICAgaWYgKGF1dG9wbGF5ICE9PSBcInBhdXNlXCIpIHtcbiAgICAgICAgcGxheSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpbml0QnV0dG9uKGZvclBhdXNlKSB7XG4gICAgY29uc3QgcHJvcCA9IGZvclBhdXNlID8gXCJwYXVzZVwiIDogXCJwbGF5XCI7XG4gICAgY29uc3QgYnV0dG9uID0gRWxlbWVudHNbcHJvcF07XG4gICAgaWYgKGJ1dHRvbikge1xuICAgICAgc2V0QXR0cmlidXRlKGJ1dHRvbiwgQVJJQV9DT05UUk9MUywgRWxlbWVudHMudHJhY2suaWQpO1xuICAgICAgc2V0QXR0cmlidXRlKGJ1dHRvbiwgQVJJQV9MQUJFTCwgb3B0aW9ucy5pMThuW3Byb3BdKTtcbiAgICAgIGJpbmQoYnV0dG9uLCBcImNsaWNrXCIsIGZvclBhdXNlID8gcGF1c2UgOiBwbGF5KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbGlzdGVuKCkge1xuICAgIGNvbnN0IHsgcm9vdCB9ID0gRWxlbWVudHM7XG4gICAgaWYgKG9wdGlvbnMucGF1c2VPbkhvdmVyKSB7XG4gICAgICBiaW5kKHJvb3QsIFwibW91c2VlbnRlciBtb3VzZWxlYXZlXCIsIChlKSA9PiB7XG4gICAgICAgIGhvdmVyZWQgPSBlLnR5cGUgPT09IFwibW91c2VlbnRlclwiO1xuICAgICAgICBhdXRvVG9nZ2xlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMucGF1c2VPbkZvY3VzKSB7XG4gICAgICBiaW5kKHJvb3QsIFwiZm9jdXNpbiBmb2N1c291dFwiLCAoZSkgPT4ge1xuICAgICAgICBmb2N1c2VkID0gZS50eXBlID09PSBcImZvY3VzaW5cIjtcbiAgICAgICAgYXV0b1RvZ2dsZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIG9uKFtFVkVOVF9NT1ZFLCBFVkVOVF9TQ1JPTEwsIEVWRU5UX1JFRlJFU0hdLCBpbnRlcnZhbC5yZXdpbmQpO1xuICB9XG4gIGZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgaWYgKGlzUGF1c2VkKCkgJiYgQ29tcG9uZW50czIuU2xpZGVzLmlzRW5vdWdoKCkpIHtcbiAgICAgIGludGVydmFsLnN0YXJ0KCFvcHRpb25zLnJlc2V0UHJvZ3Jlc3MpO1xuICAgICAgZm9jdXNlZCA9IGhvdmVyZWQgPSBwYXVzZWQgPSBmYWxzZTtcbiAgICAgIGVtaXQoRVZFTlRfQVVUT1BMQVlfUExBWSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHBhdXNlKG1hbnVhbCA9IHRydWUpIHtcbiAgICBpZiAoIWlzUGF1c2VkKCkpIHtcbiAgICAgIGludGVydmFsLnBhdXNlKCk7XG4gICAgICBlbWl0KEVWRU5UX0FVVE9QTEFZX1BBVVNFKTtcbiAgICB9XG4gICAgcGF1c2VkID0gbWFudWFsO1xuICB9XG4gIGZ1bmN0aW9uIGF1dG9Ub2dnbGUoKSB7XG4gICAgaWYgKCFwYXVzZWQpIHtcbiAgICAgIGlmICghaG92ZXJlZCAmJiAhZm9jdXNlZCkge1xuICAgICAgICBwbGF5KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXVzZShmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZShyYXRlKSB7XG4gICAgY29uc3QgeyBiYXIgfSA9IEVsZW1lbnRzO1xuICAgIGlmIChiYXIpIHtcbiAgICAgIHN0eWxlKGJhciwgXCJ3aWR0aFwiLCBgJHtyYXRlICogMTAwfSVgKTtcbiAgICB9XG4gICAgZW1pdChFVkVOVF9BVVRPUExBWV9QTEFZSU5HLCByYXRlKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIG1vdW50LFxuICAgIGRlc3Ryb3k6IGludGVydmFsLmNhbmNlbCxcbiAgICBwbGF5LFxuICAgIHBhdXNlLFxuICAgIGlzUGF1c2VkXG4gIH07XG59XG5cbmZ1bmN0aW9uIENvdmVyKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24gfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBpZiAob3B0aW9ucy5jb3Zlcikge1xuICAgICAgb24oRVZFTlRfTEFaWUxPQURfTE9BREVELCAoaW1nLCBTbGlkZSkgPT4ge1xuICAgICAgICB0b2dnbGUodHJ1ZSwgaW1nLCBTbGlkZSk7XG4gICAgICB9KTtcbiAgICAgIG9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9VUERBVEVELCBFVkVOVF9SRUZSRVNIXSwgYXBwbHkuYmluZChudWxsLCB0cnVlKSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgYXBwbHkoZmFsc2UpO1xuICB9XG4gIGZ1bmN0aW9uIGFwcGx5KGNvdmVyKSB7XG4gICAgQ29tcG9uZW50czIuU2xpZGVzLmZvckVhY2goKFNsaWRlKSA9PiB7XG4gICAgICBjb25zdCBpbWcgPSBjaGlsZChTbGlkZS5jb250YWluZXIgfHwgU2xpZGUuc2xpZGUsIFwiaW1nXCIpO1xuICAgICAgaWYgKGltZyAmJiBpbWcuc3JjKSB7XG4gICAgICAgIHRvZ2dsZShjb3ZlciwgaW1nLCBTbGlkZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gdG9nZ2xlKGNvdmVyLCBpbWcsIFNsaWRlKSB7XG4gICAgU2xpZGUuc3R5bGUoXCJiYWNrZ3JvdW5kXCIsIGNvdmVyID8gYGNlbnRlci9jb3ZlciBuby1yZXBlYXQgdXJsKFwiJHtpbWcuc3JjfVwiKWAgOiBcIlwiLCB0cnVlKTtcbiAgICBkaXNwbGF5KGltZywgY292ZXIgPyBcIm5vbmVcIiA6IFwiXCIpO1xuICB9XG4gIHJldHVybiB7XG4gICAgbW91bnQsXG4gICAgZGVzdHJveVxuICB9O1xufVxuXG5jb25zdCBCT1VOQ0VfRElGRl9USFJFU0hPTEQgPSAxMDtcbmNvbnN0IEJPVU5DRV9EVVJBVElPTiA9IDYwMDtcbmNvbnN0IEZSSUNUSU9OX0ZBQ1RPUiA9IDAuNjtcbmNvbnN0IEJBU0VfVkVMT0NJVFkgPSAxLjU7XG5jb25zdCBNSU5fRFVSQVRJT04gPSA4MDA7XG5cbmZ1bmN0aW9uIFNjcm9sbChTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICBjb25zdCB7IG9uLCBlbWl0IH0gPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgY29uc3QgeyBNb3ZlIH0gPSBDb21wb25lbnRzMjtcbiAgY29uc3QgeyBnZXRQb3NpdGlvbiwgZ2V0TGltaXQsIGV4Y2VlZGVkTGltaXQgfSA9IE1vdmU7XG4gIGxldCBpbnRlcnZhbDtcbiAgbGV0IHNjcm9sbENhbGxiYWNrO1xuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBvbihFVkVOVF9NT1ZFLCBjbGVhcik7XG4gICAgb24oW0VWRU5UX1VQREFURUQsIEVWRU5UX1JFRlJFU0hdLCBjYW5jZWwpO1xuICB9XG4gIGZ1bmN0aW9uIHNjcm9sbChkZXN0aW5hdGlvbiwgZHVyYXRpb24sIGNhbGxiYWNrLCBzdXBwcmVzc0NvbnN0cmFpbnQpIHtcbiAgICBjb25zdCBzdGFydCA9IGdldFBvc2l0aW9uKCk7XG4gICAgbGV0IGZyaWN0aW9uID0gMTtcbiAgICBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IGNvbXB1dGVEdXJhdGlvbihhYnMoZGVzdGluYXRpb24gLSBzdGFydCkpO1xuICAgIHNjcm9sbENhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgY2xlYXIoKTtcbiAgICBpbnRlcnZhbCA9IFJlcXVlc3RJbnRlcnZhbChkdXJhdGlvbiwgb25TY3JvbGxlZCwgKHJhdGUpID0+IHtcbiAgICAgIGNvbnN0IHBvc2l0aW9uID0gZ2V0UG9zaXRpb24oKTtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHN0YXJ0ICsgKGRlc3RpbmF0aW9uIC0gc3RhcnQpICogZWFzaW5nKHJhdGUpO1xuICAgICAgY29uc3QgZGlmZiA9ICh0YXJnZXQgLSBnZXRQb3NpdGlvbigpKSAqIGZyaWN0aW9uO1xuICAgICAgTW92ZS50cmFuc2xhdGUocG9zaXRpb24gKyBkaWZmKTtcbiAgICAgIGlmIChTcGxpZGUyLmlzKFNMSURFKSAmJiAhc3VwcHJlc3NDb25zdHJhaW50ICYmIGV4Y2VlZGVkTGltaXQoKSkge1xuICAgICAgICBmcmljdGlvbiAqPSBGUklDVElPTl9GQUNUT1I7XG4gICAgICAgIGlmIChhYnMoZGlmZikgPCBCT1VOQ0VfRElGRl9USFJFU0hPTEQpIHtcbiAgICAgICAgICBib3VuY2UoZXhjZWVkZWRMaW1pdChmYWxzZSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgMSk7XG4gICAgZW1pdChFVkVOVF9TQ1JPTEwpO1xuICAgIGludGVydmFsLnN0YXJ0KCk7XG4gIH1cbiAgZnVuY3Rpb24gYm91bmNlKGJhY2t3YXJkcykge1xuICAgIHNjcm9sbChnZXRMaW1pdCghYmFja3dhcmRzKSwgQk9VTkNFX0RVUkFUSU9OLCBudWxsLCB0cnVlKTtcbiAgfVxuICBmdW5jdGlvbiBvblNjcm9sbGVkKCkge1xuICAgIGNvbnN0IHBvc2l0aW9uID0gZ2V0UG9zaXRpb24oKTtcbiAgICBjb25zdCBpbmRleCA9IE1vdmUudG9JbmRleChwb3NpdGlvbik7XG4gICAgaWYgKCFiZXR3ZWVuKGluZGV4LCAwLCBTcGxpZGUyLmxlbmd0aCAtIDEpKSB7XG4gICAgICBNb3ZlLnRyYW5zbGF0ZShNb3ZlLnNoaWZ0KHBvc2l0aW9uLCBpbmRleCA+IDApLCB0cnVlKTtcbiAgICB9XG4gICAgc2Nyb2xsQ2FsbGJhY2sgJiYgc2Nyb2xsQ2FsbGJhY2soKTtcbiAgICBlbWl0KEVWRU5UX1NDUk9MTEVEKTtcbiAgfVxuICBmdW5jdGlvbiBjb21wdXRlRHVyYXRpb24oZGlzdGFuY2UpIHtcbiAgICByZXR1cm4gbWF4KGRpc3RhbmNlIC8gQkFTRV9WRUxPQ0lUWSwgTUlOX0RVUkFUSU9OKTtcbiAgfVxuICBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICBpZiAoaW50ZXJ2YWwpIHtcbiAgICAgIGludGVydmFsLmNhbmNlbCgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKGludGVydmFsICYmICFpbnRlcnZhbC5pc1BhdXNlZCgpKSB7XG4gICAgICBjbGVhcigpO1xuICAgICAgb25TY3JvbGxlZCgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBlYXNpbmcodCkge1xuICAgIGNvbnN0IHsgZWFzaW5nRnVuYyB9ID0gb3B0aW9ucztcbiAgICByZXR1cm4gZWFzaW5nRnVuYyA/IGVhc2luZ0Z1bmModCkgOiAxIC0gTWF0aC5wb3coMSAtIHQsIDQpO1xuICB9XG4gIHJldHVybiB7XG4gICAgbW91bnQsXG4gICAgZGVzdHJveTogY2xlYXIsXG4gICAgc2Nyb2xsLFxuICAgIGNhbmNlbFxuICB9O1xufVxuXG5jb25zdCBGUklDVElPTiA9IDU7XG5jb25zdCBMT0dfSU5URVJWQUwgPSAyMDA7XG5jb25zdCBQT0lOVEVSX0RPV05fRVZFTlRTID0gXCJ0b3VjaHN0YXJ0IG1vdXNlZG93blwiO1xuY29uc3QgUE9JTlRFUl9NT1ZFX0VWRU5UUyA9IFwidG91Y2htb3ZlIG1vdXNlbW92ZVwiO1xuY29uc3QgUE9JTlRFUl9VUF9FVkVOVFMgPSBcInRvdWNoZW5kIHRvdWNoY2FuY2VsIG1vdXNldXBcIjtcblxuZnVuY3Rpb24gRHJhZyhTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICBjb25zdCB7IG9uLCBlbWl0LCBiaW5kLCB1bmJpbmQgfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICBjb25zdCB7IE1vdmUsIFNjcm9sbCwgQ29udHJvbGxlciB9ID0gQ29tcG9uZW50czI7XG4gIGNvbnN0IHsgdHJhY2sgfSA9IENvbXBvbmVudHMyLkVsZW1lbnRzO1xuICBjb25zdCB7IHJlc29sdmUsIG9yaWVudCB9ID0gQ29tcG9uZW50czIuRGlyZWN0aW9uO1xuICBjb25zdCB7IGdldFBvc2l0aW9uLCBleGNlZWRlZExpbWl0IH0gPSBNb3ZlO1xuICBjb25zdCBsaXN0ZW5lck9wdGlvbnMgPSB7IHBhc3NpdmU6IGZhbHNlLCBjYXB0dXJlOiB0cnVlIH07XG4gIGxldCBiYXNlUG9zaXRpb247XG4gIGxldCBiYXNlRXZlbnQ7XG4gIGxldCBwcmV2QmFzZUV2ZW50O1xuICBsZXQgbGFzdEV2ZW50O1xuICBsZXQgaXNGcmVlO1xuICBsZXQgZHJhZ2dpbmc7XG4gIGxldCBoYXNFeGNlZWRlZCA9IGZhbHNlO1xuICBsZXQgY2xpY2tQcmV2ZW50ZWQ7XG4gIGxldCBkaXNhYmxlZDtcbiAgbGV0IHRhcmdldDtcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgYmluZCh0cmFjaywgUE9JTlRFUl9NT1ZFX0VWRU5UUywgbm9vcCwgbGlzdGVuZXJPcHRpb25zKTtcbiAgICBiaW5kKHRyYWNrLCBQT0lOVEVSX1VQX0VWRU5UUywgbm9vcCwgbGlzdGVuZXJPcHRpb25zKTtcbiAgICBiaW5kKHRyYWNrLCBQT0lOVEVSX0RPV05fRVZFTlRTLCBvblBvaW50ZXJEb3duLCBsaXN0ZW5lck9wdGlvbnMpO1xuICAgIGJpbmQodHJhY2ssIFwiY2xpY2tcIiwgb25DbGljaywgeyBjYXB0dXJlOiB0cnVlIH0pO1xuICAgIGJpbmQodHJhY2ssIFwiZHJhZ3N0YXJ0XCIsIHByZXZlbnQpO1xuICAgIG9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9VUERBVEVEXSwgaW5pdCk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zdCB7IGRyYWcgfSA9IG9wdGlvbnM7XG4gICAgZGlzYWJsZSghZHJhZyk7XG4gICAgaXNGcmVlID0gZHJhZyA9PT0gXCJmcmVlXCI7XG4gIH1cbiAgZnVuY3Rpb24gb25Qb2ludGVyRG93bihlKSB7XG4gICAgaWYgKCFkaXNhYmxlZCkge1xuICAgICAgY29uc3QgeyBub0RyYWcgfSA9IG9wdGlvbnM7XG4gICAgICBjb25zdCBpc1RvdWNoID0gaXNUb3VjaEV2ZW50KGUpO1xuICAgICAgY29uc3QgaXNEcmFnZ2FibGUgPSAhbm9EcmFnIHx8IGlzSFRNTEVsZW1lbnQoZS50YXJnZXQpICYmICFtYXRjaGVzKGUudGFyZ2V0LCBub0RyYWcpO1xuICAgICAgaWYgKGlzRHJhZ2dhYmxlICYmIChpc1RvdWNoIHx8ICFlLmJ1dHRvbikpIHtcbiAgICAgICAgaWYgKCFNb3ZlLmlzQnVzeSgpKSB7XG4gICAgICAgICAgdGFyZ2V0ID0gaXNUb3VjaCA/IHRyYWNrIDogd2luZG93O1xuICAgICAgICAgIHByZXZCYXNlRXZlbnQgPSBudWxsO1xuICAgICAgICAgIGxhc3RFdmVudCA9IG51bGw7XG4gICAgICAgICAgY2xpY2tQcmV2ZW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICBiaW5kKHRhcmdldCwgUE9JTlRFUl9NT1ZFX0VWRU5UUywgb25Qb2ludGVyTW92ZSwgbGlzdGVuZXJPcHRpb25zKTtcbiAgICAgICAgICBiaW5kKHRhcmdldCwgUE9JTlRFUl9VUF9FVkVOVFMsIG9uUG9pbnRlclVwLCBsaXN0ZW5lck9wdGlvbnMpO1xuICAgICAgICAgIE1vdmUuY2FuY2VsKCk7XG4gICAgICAgICAgU2Nyb2xsLmNhbmNlbCgpO1xuICAgICAgICAgIHNhdmUoZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJldmVudChlLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBvblBvaW50ZXJNb3ZlKGUpIHtcbiAgICBpZiAoIWxhc3RFdmVudCkge1xuICAgICAgZW1pdChFVkVOVF9EUkFHKTtcbiAgICB9XG4gICAgbGFzdEV2ZW50ID0gZTtcbiAgICBpZiAoZS5jYW5jZWxhYmxlKSB7XG4gICAgICBjb25zdCBkaWZmID0gY29vcmRPZihlKSAtIGNvb3JkT2YoYmFzZUV2ZW50KTtcbiAgICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgICBNb3ZlLnRyYW5zbGF0ZShiYXNlUG9zaXRpb24gKyBjb25zdHJhaW4oZGlmZikpO1xuICAgICAgICBjb25zdCBleHBpcmVkID0gdGltZU9mKGUpIC0gdGltZU9mKGJhc2VFdmVudCkgPiBMT0dfSU5URVJWQUw7XG4gICAgICAgIGNvbnN0IGV4Y2VlZGVkID0gaGFzRXhjZWVkZWQgIT09IChoYXNFeGNlZWRlZCA9IGV4Y2VlZGVkTGltaXQoKSk7XG4gICAgICAgIGlmIChleHBpcmVkIHx8IGV4Y2VlZGVkKSB7XG4gICAgICAgICAgc2F2ZShlKTtcbiAgICAgICAgfVxuICAgICAgICBlbWl0KEVWRU5UX0RSQUdHSU5HKTtcbiAgICAgICAgY2xpY2tQcmV2ZW50ZWQgPSB0cnVlO1xuICAgICAgICBwcmV2ZW50KGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHsgZHJhZ01pblRocmVzaG9sZDogdGhyZXNob2xkcyB9ID0gb3B0aW9ucztcbiAgICAgICAgdGhyZXNob2xkcyA9IGlzT2JqZWN0KHRocmVzaG9sZHMpID8gdGhyZXNob2xkcyA6IHsgbW91c2U6IDAsIHRvdWNoOiArdGhyZXNob2xkcyB8fCAxMCB9O1xuICAgICAgICBkcmFnZ2luZyA9IGFicyhkaWZmKSA+IChpc1RvdWNoRXZlbnQoZSkgPyB0aHJlc2hvbGRzLnRvdWNoIDogdGhyZXNob2xkcy5tb3VzZSk7XG4gICAgICAgIGlmIChpc1NsaWRlckRpcmVjdGlvbigpKSB7XG4gICAgICAgICAgcHJldmVudChlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBvblBvaW50ZXJVcChlKSB7XG4gICAgdW5iaW5kKHRhcmdldCwgUE9JTlRFUl9NT1ZFX0VWRU5UUywgb25Qb2ludGVyTW92ZSk7XG4gICAgdW5iaW5kKHRhcmdldCwgUE9JTlRFUl9VUF9FVkVOVFMsIG9uUG9pbnRlclVwKTtcbiAgICBpZiAobGFzdEV2ZW50KSB7XG4gICAgICBpZiAoZHJhZ2dpbmcgfHwgZS5jYW5jZWxhYmxlICYmIGlzU2xpZGVyRGlyZWN0aW9uKCkpIHtcbiAgICAgICAgY29uc3QgdmVsb2NpdHkgPSBjb21wdXRlVmVsb2NpdHkoZSk7XG4gICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gY29tcHV0ZURlc3RpbmF0aW9uKHZlbG9jaXR5KTtcbiAgICAgICAgaWYgKGlzRnJlZSkge1xuICAgICAgICAgIENvbnRyb2xsZXIuc2Nyb2xsKGRlc3RpbmF0aW9uKTtcbiAgICAgICAgfSBlbHNlIGlmIChTcGxpZGUyLmlzKEZBREUpKSB7XG4gICAgICAgICAgQ29udHJvbGxlci5nbyhTcGxpZGUyLmluZGV4ICsgb3JpZW50KHNpZ24odmVsb2NpdHkpKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgQ29udHJvbGxlci5nbyhDb250cm9sbGVyLnRvRGVzdChkZXN0aW5hdGlvbiksIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHByZXZlbnQoZSk7XG4gICAgICB9XG4gICAgICBlbWl0KEVWRU5UX0RSQUdHRUQpO1xuICAgIH1cbiAgICBkcmFnZ2luZyA9IGZhbHNlO1xuICB9XG4gIGZ1bmN0aW9uIHNhdmUoZSkge1xuICAgIHByZXZCYXNlRXZlbnQgPSBiYXNlRXZlbnQ7XG4gICAgYmFzZUV2ZW50ID0gZTtcbiAgICBiYXNlUG9zaXRpb24gPSBnZXRQb3NpdGlvbigpO1xuICB9XG4gIGZ1bmN0aW9uIG9uQ2xpY2soZSkge1xuICAgIGlmICghZGlzYWJsZWQgJiYgY2xpY2tQcmV2ZW50ZWQpIHtcbiAgICAgIHByZXZlbnQoZSwgdHJ1ZSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGlzU2xpZGVyRGlyZWN0aW9uKCkge1xuICAgIGNvbnN0IGRpZmZYID0gYWJzKGNvb3JkT2YobGFzdEV2ZW50KSAtIGNvb3JkT2YoYmFzZUV2ZW50KSk7XG4gICAgY29uc3QgZGlmZlkgPSBhYnMoY29vcmRPZihsYXN0RXZlbnQsIHRydWUpIC0gY29vcmRPZihiYXNlRXZlbnQsIHRydWUpKTtcbiAgICByZXR1cm4gZGlmZlggPiBkaWZmWTtcbiAgfVxuICBmdW5jdGlvbiBjb21wdXRlVmVsb2NpdHkoZSkge1xuICAgIGlmIChTcGxpZGUyLmlzKExPT1ApIHx8ICFoYXNFeGNlZWRlZCkge1xuICAgICAgY29uc3QgYmFzZSA9IGJhc2VFdmVudCA9PT0gbGFzdEV2ZW50ICYmIHByZXZCYXNlRXZlbnQgfHwgYmFzZUV2ZW50O1xuICAgICAgY29uc3QgZGlmZkNvb3JkID0gY29vcmRPZihsYXN0RXZlbnQpIC0gY29vcmRPZihiYXNlKTtcbiAgICAgIGNvbnN0IGRpZmZUaW1lID0gdGltZU9mKGUpIC0gdGltZU9mKGJhc2UpO1xuICAgICAgY29uc3QgaXNGbGljayA9IHRpbWVPZihlKSAtIHRpbWVPZihsYXN0RXZlbnQpIDwgTE9HX0lOVEVSVkFMO1xuICAgICAgaWYgKGRpZmZUaW1lICYmIGlzRmxpY2spIHtcbiAgICAgICAgcmV0dXJuIGRpZmZDb29yZCAvIGRpZmZUaW1lO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuICBmdW5jdGlvbiBjb21wdXRlRGVzdGluYXRpb24odmVsb2NpdHkpIHtcbiAgICByZXR1cm4gZ2V0UG9zaXRpb24oKSArIHNpZ24odmVsb2NpdHkpICogbWluKGFicyh2ZWxvY2l0eSkgKiAob3B0aW9ucy5mbGlja1Bvd2VyIHx8IDYwMCksIGlzRnJlZSA/IEluZmluaXR5IDogQ29tcG9uZW50czIuTGF5b3V0Lmxpc3RTaXplKCkgKiAob3B0aW9ucy5mbGlja01heFBhZ2VzIHx8IDEpKTtcbiAgfVxuICBmdW5jdGlvbiBjb29yZE9mKGUsIG9ydGhvZ29uYWwpIHtcbiAgICByZXR1cm4gKGlzVG91Y2hFdmVudChlKSA/IGUudG91Y2hlc1swXSA6IGUpW2BwYWdlJHtyZXNvbHZlKG9ydGhvZ29uYWwgPyBcIllcIiA6IFwiWFwiKX1gXTtcbiAgfVxuICBmdW5jdGlvbiB0aW1lT2YoZSkge1xuICAgIHJldHVybiBlLnRpbWVTdGFtcDtcbiAgfVxuICBmdW5jdGlvbiBjb25zdHJhaW4oZGlmZikge1xuICAgIHJldHVybiBkaWZmIC8gKGhhc0V4Y2VlZGVkICYmIFNwbGlkZTIuaXMoU0xJREUpID8gRlJJQ1RJT04gOiAxKTtcbiAgfVxuICBmdW5jdGlvbiBpc1RvdWNoRXZlbnQoZSkge1xuICAgIHJldHVybiB0eXBlb2YgVG91Y2hFdmVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudDtcbiAgfVxuICBmdW5jdGlvbiBpc0RyYWdnaW5nKCkge1xuICAgIHJldHVybiBkcmFnZ2luZztcbiAgfVxuICBmdW5jdGlvbiBkaXNhYmxlKHZhbHVlKSB7XG4gICAgZGlzYWJsZWQgPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4ge1xuICAgIG1vdW50LFxuICAgIGRpc2FibGUsXG4gICAgaXNEcmFnZ2luZ1xuICB9O1xufVxuXG5jb25zdCBJRV9BUlJPV19LRVlTID0gW1wiTGVmdFwiLCBcIlJpZ2h0XCIsIFwiVXBcIiwgXCJEb3duXCJdO1xuZnVuY3Rpb24gS2V5Ym9hcmQoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBvbiwgYmluZCwgdW5iaW5kIH0gPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgY29uc3QgeyByb290IH0gPSBDb21wb25lbnRzMi5FbGVtZW50cztcbiAgY29uc3QgeyByZXNvbHZlIH0gPSBDb21wb25lbnRzMi5EaXJlY3Rpb247XG4gIGxldCB0YXJnZXQ7XG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGluaXQoKTtcbiAgICBvbihFVkVOVF9VUERBVEVELCAoKSA9PiB7XG4gICAgICBkZXN0cm95KCk7XG4gICAgICBpbml0KCk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBjb25zdCB7IGtleWJvYXJkID0gXCJnbG9iYWxcIiB9ID0gb3B0aW9ucztcbiAgICBpZiAoa2V5Ym9hcmQpIHtcbiAgICAgIGlmIChrZXlib2FyZCA9PT0gXCJmb2N1c2VkXCIpIHtcbiAgICAgICAgdGFyZ2V0ID0gcm9vdDtcbiAgICAgICAgc2V0QXR0cmlidXRlKHJvb3QsIFRBQl9JTkRFWCwgMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXQgPSB3aW5kb3c7XG4gICAgICB9XG4gICAgICBiaW5kKHRhcmdldCwgXCJrZXlkb3duXCIsIG9uS2V5ZG93bik7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgdW5iaW5kKHRhcmdldCwgXCJrZXlkb3duXCIpO1xuICAgIGlmIChpc0hUTUxFbGVtZW50KHRhcmdldCkpIHtcbiAgICAgIHJlbW92ZUF0dHJpYnV0ZSh0YXJnZXQsIFRBQl9JTkRFWCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIG9uS2V5ZG93bihlKSB7XG4gICAgY29uc3QgeyBrZXkgfSA9IGU7XG4gICAgY29uc3Qgbm9ybWFsaXplZEtleSA9IGluY2x1ZGVzKElFX0FSUk9XX0tFWVMsIGtleSkgPyBgQXJyb3cke2tleX1gIDoga2V5O1xuICAgIGlmIChub3JtYWxpemVkS2V5ID09PSByZXNvbHZlKFwiQXJyb3dMZWZ0XCIpKSB7XG4gICAgICBTcGxpZGUyLmdvKFwiPFwiKTtcbiAgICB9IGVsc2UgaWYgKG5vcm1hbGl6ZWRLZXkgPT09IHJlc29sdmUoXCJBcnJvd1JpZ2h0XCIpKSB7XG4gICAgICBTcGxpZGUyLmdvKFwiPlwiKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBtb3VudCxcbiAgICBkZXN0cm95XG4gIH07XG59XG5cbmNvbnN0IFNSQ19EQVRBX0FUVFJJQlVURSA9IGAke0RBVEFfQVRUUklCVVRFfS1sYXp5YDtcbmNvbnN0IFNSQ1NFVF9EQVRBX0FUVFJJQlVURSA9IGAke1NSQ19EQVRBX0FUVFJJQlVURX0tc3Jjc2V0YDtcbmNvbnN0IElNQUdFX1NFTEVDVE9SID0gYFske1NSQ19EQVRBX0FUVFJJQlVURX1dLCBbJHtTUkNTRVRfREFUQV9BVFRSSUJVVEV9XWA7XG5cbmZ1bmN0aW9uIExhenlMb2FkKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24sIG9mZiwgYmluZCwgZW1pdCB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IGlzU2VxdWVudGlhbCA9IG9wdGlvbnMubGF6eUxvYWQgPT09IFwic2VxdWVudGlhbFwiO1xuICBsZXQgaW1hZ2VzID0gW107XG4gIGxldCBpbmRleCA9IDA7XG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGlmIChvcHRpb25zLmxhenlMb2FkKSB7XG4gICAgICBvbihbRVZFTlRfTU9VTlRFRCwgRVZFTlRfUkVGUkVTSF0sICgpID0+IHtcbiAgICAgICAgZGVzdHJveSgpO1xuICAgICAgICBpbml0KCk7XG4gICAgICB9KTtcbiAgICAgIGlmICghaXNTZXF1ZW50aWFsKSB7XG4gICAgICAgIG9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9SRUZSRVNILCBFVkVOVF9NT1ZFRF0sIG9ic2VydmUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIENvbXBvbmVudHMyLlNsaWRlcy5mb3JFYWNoKChfU2xpZGUpID0+IHtcbiAgICAgIHF1ZXJ5QWxsKF9TbGlkZS5zbGlkZSwgSU1BR0VfU0VMRUNUT1IpLmZvckVhY2goKF9pbWcpID0+IHtcbiAgICAgICAgY29uc3Qgc3JjID0gZ2V0QXR0cmlidXRlKF9pbWcsIFNSQ19EQVRBX0FUVFJJQlVURSk7XG4gICAgICAgIGNvbnN0IHNyY3NldCA9IGdldEF0dHJpYnV0ZShfaW1nLCBTUkNTRVRfREFUQV9BVFRSSUJVVEUpO1xuICAgICAgICBpZiAoc3JjICE9PSBfaW1nLnNyYyB8fCBzcmNzZXQgIT09IF9pbWcuc3Jjc2V0KSB7XG4gICAgICAgICAgY29uc3QgX3NwaW5uZXIgPSBjcmVhdGUoXCJzcGFuXCIsIG9wdGlvbnMuY2xhc3Nlcy5zcGlubmVyLCBfaW1nLnBhcmVudEVsZW1lbnQpO1xuICAgICAgICAgIHNldEF0dHJpYnV0ZShfc3Bpbm5lciwgUk9MRSwgXCJwcmVzZW50YXRpb25cIik7XG4gICAgICAgICAgaW1hZ2VzLnB1c2goeyBfaW1nLCBfU2xpZGUsIHNyYywgc3Jjc2V0LCBfc3Bpbm5lciB9KTtcbiAgICAgICAgICAhX2ltZy5zcmMgJiYgZGlzcGxheShfaW1nLCBcIm5vbmVcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChpc1NlcXVlbnRpYWwpIHtcbiAgICAgIGxvYWROZXh0KCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgaW5kZXggPSAwO1xuICAgIGltYWdlcyA9IFtdO1xuICB9XG4gIGZ1bmN0aW9uIG9ic2VydmUoKSB7XG4gICAgaW1hZ2VzID0gaW1hZ2VzLmZpbHRlcigoZGF0YSkgPT4ge1xuICAgICAgY29uc3QgZGlzdGFuY2UgPSBvcHRpb25zLnBlclBhZ2UgKiAoKG9wdGlvbnMucHJlbG9hZFBhZ2VzIHx8IDEpICsgMSkgLSAxO1xuICAgICAgaWYgKGRhdGEuX1NsaWRlLmlzV2l0aGluKFNwbGlkZTIuaW5kZXgsIGRpc3RhbmNlKSkge1xuICAgICAgICByZXR1cm4gbG9hZChkYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICAgIGlmICghaW1hZ2VzLmxlbmd0aCkge1xuICAgICAgb2ZmKEVWRU5UX01PVkVEKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gbG9hZChkYXRhKSB7XG4gICAgY29uc3QgeyBfaW1nIH0gPSBkYXRhO1xuICAgIGFkZENsYXNzKGRhdGEuX1NsaWRlLnNsaWRlLCBDTEFTU19MT0FESU5HKTtcbiAgICBiaW5kKF9pbWcsIFwibG9hZCBlcnJvclwiLCAoZSkgPT4ge1xuICAgICAgb25Mb2FkKGRhdGEsIGUudHlwZSA9PT0gXCJlcnJvclwiKTtcbiAgICB9KTtcbiAgICBbXCJzcmNcIiwgXCJzcmNzZXRcIl0uZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgaWYgKGRhdGFbbmFtZV0pIHtcbiAgICAgICAgc2V0QXR0cmlidXRlKF9pbWcsIG5hbWUsIGRhdGFbbmFtZV0pO1xuICAgICAgICByZW1vdmVBdHRyaWJ1dGUoX2ltZywgbmFtZSA9PT0gXCJzcmNcIiA/IFNSQ19EQVRBX0FUVFJJQlVURSA6IFNSQ1NFVF9EQVRBX0FUVFJJQlVURSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gb25Mb2FkKGRhdGEsIGVycm9yKSB7XG4gICAgY29uc3QgeyBfU2xpZGUgfSA9IGRhdGE7XG4gICAgcmVtb3ZlQ2xhc3MoX1NsaWRlLnNsaWRlLCBDTEFTU19MT0FESU5HKTtcbiAgICBpZiAoIWVycm9yKSB7XG4gICAgICByZW1vdmUoZGF0YS5fc3Bpbm5lcik7XG4gICAgICBkaXNwbGF5KGRhdGEuX2ltZywgXCJcIik7XG4gICAgICBlbWl0KEVWRU5UX0xBWllMT0FEX0xPQURFRCwgZGF0YS5faW1nLCBfU2xpZGUpO1xuICAgICAgZW1pdChFVkVOVF9SRVNJWkUpO1xuICAgIH1cbiAgICBpZiAoaXNTZXF1ZW50aWFsKSB7XG4gICAgICBsb2FkTmV4dCgpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBsb2FkTmV4dCgpIHtcbiAgICBpZiAoaW5kZXggPCBpbWFnZXMubGVuZ3RoKSB7XG4gICAgICBsb2FkKGltYWdlc1tpbmRleCsrXSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB7XG4gICAgbW91bnQsXG4gICAgZGVzdHJveVxuICB9O1xufVxuXG5mdW5jdGlvbiBQYWdpbmF0aW9uKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24sIGVtaXQsIGJpbmQsIHVuYmluZCB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IHsgU2xpZGVzLCBFbGVtZW50cywgQ29udHJvbGxlciB9ID0gQ29tcG9uZW50czI7XG4gIGNvbnN0IHsgaGFzRm9jdXMsIGdldEluZGV4IH0gPSBDb250cm9sbGVyO1xuICBjb25zdCBpdGVtcyA9IFtdO1xuICBsZXQgbGlzdDtcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaW5pdCgpO1xuICAgIG9uKFtFVkVOVF9VUERBVEVELCBFVkVOVF9SRUZSRVNIXSwgaW5pdCk7XG4gICAgb24oW0VWRU5UX01PVkUsIEVWRU5UX1NDUk9MTEVEXSwgdXBkYXRlKTtcbiAgfVxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIGRlc3Ryb3koKTtcbiAgICBpZiAob3B0aW9ucy5wYWdpbmF0aW9uICYmIFNsaWRlcy5pc0Vub3VnaCgpKSB7XG4gICAgICBjcmVhdGVQYWdpbmF0aW9uKCk7XG4gICAgICBlbWl0KEVWRU5UX1BBR0lOQVRJT05fTU9VTlRFRCwgeyBsaXN0LCBpdGVtcyB9LCBnZXRBdChTcGxpZGUyLmluZGV4KSk7XG4gICAgICB1cGRhdGUoKTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBpZiAobGlzdCkge1xuICAgICAgcmVtb3ZlKGxpc3QpO1xuICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICB1bmJpbmQoaXRlbS5idXR0b24sIFwiY2xpY2tcIik7XG4gICAgICB9KTtcbiAgICAgIGVtcHR5KGl0ZW1zKTtcbiAgICAgIGxpc3QgPSBudWxsO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBjcmVhdGVQYWdpbmF0aW9uKCkge1xuICAgIGNvbnN0IHsgbGVuZ3RoIH0gPSBTcGxpZGUyO1xuICAgIGNvbnN0IHsgY2xhc3NlcywgaTE4biwgcGVyUGFnZSB9ID0gb3B0aW9ucztcbiAgICBjb25zdCBwYXJlbnQgPSBvcHRpb25zLnBhZ2luYXRpb24gPT09IFwic2xpZGVyXCIgJiYgRWxlbWVudHMuc2xpZGVyIHx8IEVsZW1lbnRzLnJvb3Q7XG4gICAgY29uc3QgbWF4ID0gaGFzRm9jdXMoKSA/IGxlbmd0aCA6IGNlaWwobGVuZ3RoIC8gcGVyUGFnZSk7XG4gICAgbGlzdCA9IGNyZWF0ZShcInVsXCIsIGNsYXNzZXMucGFnaW5hdGlvbiwgcGFyZW50KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1heDsgaSsrKSB7XG4gICAgICBjb25zdCBsaSA9IGNyZWF0ZShcImxpXCIsIG51bGwsIGxpc3QpO1xuICAgICAgY29uc3QgYnV0dG9uID0gY3JlYXRlKFwiYnV0dG9uXCIsIHsgY2xhc3M6IGNsYXNzZXMucGFnZSwgdHlwZTogXCJidXR0b25cIiB9LCBsaSk7XG4gICAgICBjb25zdCBjb250cm9scyA9IFNsaWRlcy5nZXRJbihpKS5tYXAoKFNsaWRlKSA9PiBTbGlkZS5zbGlkZS5pZCk7XG4gICAgICBjb25zdCB0ZXh0ID0gIWhhc0ZvY3VzKCkgJiYgcGVyUGFnZSA+IDEgPyBpMThuLnBhZ2VYIDogaTE4bi5zbGlkZVg7XG4gICAgICBiaW5kKGJ1dHRvbiwgXCJjbGlja1wiLCBvbkNsaWNrLmJpbmQobnVsbCwgaSkpO1xuICAgICAgc2V0QXR0cmlidXRlKGJ1dHRvbiwgQVJJQV9DT05UUk9MUywgY29udHJvbHMuam9pbihcIiBcIikpO1xuICAgICAgc2V0QXR0cmlidXRlKGJ1dHRvbiwgQVJJQV9MQUJFTCwgZm9ybWF0KHRleHQsIGkgKyAxKSk7XG4gICAgICBpdGVtcy5wdXNoKHsgbGksIGJ1dHRvbiwgcGFnZTogaSB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gb25DbGljayhwYWdlKSB7XG4gICAgQ29udHJvbGxlci5nbyhgPiR7cGFnZX1gLCB0cnVlLCAoKSA9PiB7XG4gICAgICBjb25zdCBTbGlkZSA9IFNsaWRlcy5nZXRBdChDb250cm9sbGVyLnRvSW5kZXgocGFnZSkpO1xuICAgICAgU2xpZGUgJiYgZm9jdXMoU2xpZGUuc2xpZGUpO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIGdldEF0KGluZGV4KSB7XG4gICAgcmV0dXJuIGl0ZW1zW0NvbnRyb2xsZXIudG9QYWdlKGluZGV4KV07XG4gIH1cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIGNvbnN0IHByZXYgPSBnZXRBdChnZXRJbmRleCh0cnVlKSk7XG4gICAgY29uc3QgY3VyciA9IGdldEF0KGdldEluZGV4KCkpO1xuICAgIGlmIChwcmV2KSB7XG4gICAgICByZW1vdmVDbGFzcyhwcmV2LmJ1dHRvbiwgQ0xBU1NfQUNUSVZFKTtcbiAgICAgIHJlbW92ZUF0dHJpYnV0ZShwcmV2LmJ1dHRvbiwgQVJJQV9DVVJSRU5UKTtcbiAgICB9XG4gICAgaWYgKGN1cnIpIHtcbiAgICAgIGFkZENsYXNzKGN1cnIuYnV0dG9uLCBDTEFTU19BQ1RJVkUpO1xuICAgICAgc2V0QXR0cmlidXRlKGN1cnIuYnV0dG9uLCBBUklBX0NVUlJFTlQsIHRydWUpO1xuICAgIH1cbiAgICBlbWl0KEVWRU5UX1BBR0lOQVRJT05fVVBEQVRFRCwgeyBsaXN0LCBpdGVtcyB9LCBwcmV2LCBjdXJyKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIGl0ZW1zLFxuICAgIG1vdW50LFxuICAgIGRlc3Ryb3ksXG4gICAgZ2V0QXRcbiAgfTtcbn1cblxuY29uc3QgVFJJR0dFUl9LRVlTID0gW1wiIFwiLCBcIkVudGVyXCIsIFwiU3BhY2ViYXJcIl07XG5mdW5jdGlvbiBTeW5jKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgc3BsaWRlcyB9ID0gU3BsaWRlMjtcbiAgY29uc3QgeyBsaXN0IH0gPSBDb21wb25lbnRzMi5FbGVtZW50cztcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaWYgKG9wdGlvbnMuaXNOYXZpZ2F0aW9uKSB7XG4gICAgICBuYXZpZ2F0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzeW5jKCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGRlc3Ryb3koKSB7XG4gICAgcmVtb3ZlQXR0cmlidXRlKGxpc3QsIEFMTF9BVFRSSUJVVEVTKTtcbiAgfVxuICBmdW5jdGlvbiBzeW5jKCkge1xuICAgIGNvbnN0IHByb2Nlc3NlZCA9IFtdO1xuICAgIHNwbGlkZXMuY29uY2F0KFNwbGlkZTIpLmZvckVhY2goKHNwbGlkZSwgaW5kZXgsIGluc3RhbmNlcykgPT4ge1xuICAgICAgRXZlbnRJbnRlcmZhY2Uoc3BsaWRlKS5vbihFVkVOVF9NT1ZFLCAoaW5kZXgyLCBwcmV2LCBkZXN0KSA9PiB7XG4gICAgICAgIGluc3RhbmNlcy5mb3JFYWNoKChpbnN0YW5jZSkgPT4ge1xuICAgICAgICAgIGlmIChpbnN0YW5jZSAhPT0gc3BsaWRlICYmICFpbmNsdWRlcyhwcm9jZXNzZWQsIHNwbGlkZSkpIHtcbiAgICAgICAgICAgIHByb2Nlc3NlZC5wdXNoKGluc3RhbmNlKTtcbiAgICAgICAgICAgIGluc3RhbmNlLmdvKGluc3RhbmNlLmlzKExPT1ApID8gZGVzdCA6IGluZGV4Mik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZW1wdHkocHJvY2Vzc2VkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIG5hdmlnYXRlKCkge1xuICAgIGNvbnN0IHsgb24sIGVtaXQgfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICAgIG9uKEVWRU5UX0NMSUNLLCBvbkNsaWNrKTtcbiAgICBvbihFVkVOVF9TTElERV9LRVlET1dOLCBvbktleWRvd24pO1xuICAgIG9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9VUERBVEVEXSwgdXBkYXRlKTtcbiAgICBzZXRBdHRyaWJ1dGUobGlzdCwgUk9MRSwgXCJtZW51XCIpO1xuICAgIGVtaXQoRVZFTlRfTkFWSUdBVElPTl9NT1VOVEVELCBTcGxpZGUyLnNwbGlkZXMpO1xuICB9XG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICBzZXRBdHRyaWJ1dGUobGlzdCwgQVJJQV9PUklFTlRBVElPTiwgb3B0aW9ucy5kaXJlY3Rpb24gIT09IFRUQiA/IFwiaG9yaXpvbnRhbFwiIDogbnVsbCk7XG4gIH1cbiAgZnVuY3Rpb24gb25DbGljayhTbGlkZSkge1xuICAgIFNwbGlkZTIuZ28oU2xpZGUuaW5kZXgpO1xuICB9XG4gIGZ1bmN0aW9uIG9uS2V5ZG93bihTbGlkZSwgZSkge1xuICAgIGlmIChpbmNsdWRlcyhUUklHR0VSX0tFWVMsIGUua2V5KSkge1xuICAgICAgb25DbGljayhTbGlkZSk7XG4gICAgICBwcmV2ZW50KGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIG1vdW50LFxuICAgIGRlc3Ryb3lcbiAgfTtcbn1cblxuZnVuY3Rpb24gV2hlZWwoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBiaW5kIH0gPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaWYgKG9wdGlvbnMud2hlZWwpIHtcbiAgICAgIGJpbmQoQ29tcG9uZW50czIuRWxlbWVudHMudHJhY2ssIFwid2hlZWxcIiwgb25XaGVlbCwgeyBwYXNzaXZlOiBmYWxzZSwgY2FwdHVyZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gb25XaGVlbChlKSB7XG4gICAgY29uc3QgeyBkZWx0YVkgfSA9IGU7XG4gICAgaWYgKGRlbHRhWSkge1xuICAgICAgU3BsaWRlMi5nbyhkZWx0YVkgPCAwID8gXCI8XCIgOiBcIj5cIik7XG4gICAgICBwcmV2ZW50KGUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4ge1xuICAgIG1vdW50XG4gIH07XG59XG5cbnZhciBDb21wb25lbnRDb25zdHJ1Y3RvcnMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gIF9fcHJvdG9fXzogbnVsbCxcbiAgT3B0aW9uczogT3B0aW9ucyxcbiAgRGlyZWN0aW9uOiBEaXJlY3Rpb24sXG4gIEVsZW1lbnRzOiBFbGVtZW50cyxcbiAgU2xpZGVzOiBTbGlkZXMsXG4gIExheW91dDogTGF5b3V0LFxuICBDbG9uZXM6IENsb25lcyxcbiAgTW92ZTogTW92ZSxcbiAgQ29udHJvbGxlcjogQ29udHJvbGxlcixcbiAgQXJyb3dzOiBBcnJvd3MsXG4gIEF1dG9wbGF5OiBBdXRvcGxheSxcbiAgQ292ZXI6IENvdmVyLFxuICBTY3JvbGw6IFNjcm9sbCxcbiAgRHJhZzogRHJhZyxcbiAgS2V5Ym9hcmQ6IEtleWJvYXJkLFxuICBMYXp5TG9hZDogTGF6eUxvYWQsXG4gIFBhZ2luYXRpb246IFBhZ2luYXRpb24sXG4gIFN5bmM6IFN5bmMsXG4gIFdoZWVsOiBXaGVlbFxufSk7XG5cbmNvbnN0IEkxOE4gPSB7XG4gIHByZXY6IFwiUHJldmlvdXMgc2xpZGVcIixcbiAgbmV4dDogXCJOZXh0IHNsaWRlXCIsXG4gIGZpcnN0OiBcIkdvIHRvIGZpcnN0IHNsaWRlXCIsXG4gIGxhc3Q6IFwiR28gdG8gbGFzdCBzbGlkZVwiLFxuICBzbGlkZVg6IFwiR28gdG8gc2xpZGUgJXNcIixcbiAgcGFnZVg6IFwiR28gdG8gcGFnZSAlc1wiLFxuICBwbGF5OiBcIlN0YXJ0IGF1dG9wbGF5XCIsXG4gIHBhdXNlOiBcIlBhdXNlIGF1dG9wbGF5XCJcbn07XG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICB0eXBlOiBcInNsaWRlXCIsXG4gIHNwZWVkOiA0MDAsXG4gIHdhaXRGb3JUcmFuc2l0aW9uOiB0cnVlLFxuICBwZXJQYWdlOiAxLFxuICBhcnJvd3M6IHRydWUsXG4gIHBhZ2luYXRpb246IHRydWUsXG4gIGludGVydmFsOiA1ZTMsXG4gIHBhdXNlT25Ib3ZlcjogdHJ1ZSxcbiAgcGF1c2VPbkZvY3VzOiB0cnVlLFxuICByZXNldFByb2dyZXNzOiB0cnVlLFxuICBlYXNpbmc6IFwiY3ViaWMtYmV6aWVyKDAuMjUsIDEsIDAuNSwgMSlcIixcbiAgZHJhZzogdHJ1ZSxcbiAgZGlyZWN0aW9uOiBcImx0clwiLFxuICBzbGlkZUZvY3VzOiB0cnVlLFxuICB0cmltU3BhY2U6IHRydWUsXG4gIGZvY3VzYWJsZU5vZGVzOiBcImEsIGJ1dHRvbiwgdGV4dGFyZWEsIGlucHV0LCBzZWxlY3QsIGlmcmFtZVwiLFxuICBjbGFzc2VzOiBDTEFTU0VTLFxuICBpMThuOiBJMThOXG59O1xuXG5mdW5jdGlvbiBGYWRlKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgb24gfSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBvbihbRVZFTlRfTU9VTlRFRCwgRVZFTlRfUkVGUkVTSF0sICgpID0+IHtcbiAgICAgIG5leHRUaWNrKCgpID0+IHtcbiAgICAgICAgQ29tcG9uZW50czIuU2xpZGVzLnN0eWxlKFwidHJhbnNpdGlvblwiLCBgb3BhY2l0eSAke29wdGlvbnMuc3BlZWR9bXMgJHtvcHRpb25zLmVhc2luZ31gKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIGZ1bmN0aW9uIHN0YXJ0KGluZGV4LCBkb25lKSB7XG4gICAgY29uc3QgeyB0cmFjayB9ID0gQ29tcG9uZW50czIuRWxlbWVudHM7XG4gICAgc3R5bGUodHJhY2ssIFwiaGVpZ2h0XCIsIHVuaXQocmVjdCh0cmFjaykuaGVpZ2h0KSk7XG4gICAgbmV4dFRpY2soKCkgPT4ge1xuICAgICAgZG9uZSgpO1xuICAgICAgc3R5bGUodHJhY2ssIFwiaGVpZ2h0XCIsIFwiXCIpO1xuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgbW91bnQsXG4gICAgc3RhcnQsXG4gICAgY2FuY2VsOiBub29wXG4gIH07XG59XG5cbmZ1bmN0aW9uIFNsaWRlKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgYmluZCB9ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMik7XG4gIGNvbnN0IHsgTW92ZSwgQ29udHJvbGxlciB9ID0gQ29tcG9uZW50czI7XG4gIGNvbnN0IHsgbGlzdCB9ID0gQ29tcG9uZW50czIuRWxlbWVudHM7XG4gIGxldCBlbmRDYWxsYmFjaztcbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgYmluZChsaXN0LCBcInRyYW5zaXRpb25lbmRcIiwgKGUpID0+IHtcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gbGlzdCAmJiBlbmRDYWxsYmFjaykge1xuICAgICAgICBjYW5jZWwoKTtcbiAgICAgICAgZW5kQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBzdGFydChpbmRleCwgZG9uZSkge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gTW92ZS50b1Bvc2l0aW9uKGluZGV4LCB0cnVlKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IE1vdmUuZ2V0UG9zaXRpb24oKTtcbiAgICBjb25zdCBzcGVlZCA9IGdldFNwZWVkKGluZGV4KTtcbiAgICBpZiAoYWJzKGRlc3RpbmF0aW9uIC0gcG9zaXRpb24pID49IDEgJiYgc3BlZWQgPj0gMSkge1xuICAgICAgYXBwbHkoYHRyYW5zZm9ybSAke3NwZWVkfW1zICR7b3B0aW9ucy5lYXNpbmd9YCk7XG4gICAgICBNb3ZlLnRyYW5zbGF0ZShkZXN0aW5hdGlvbiwgdHJ1ZSk7XG4gICAgICBlbmRDYWxsYmFjayA9IGRvbmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIE1vdmUuanVtcChpbmRleCk7XG4gICAgICBkb25lKCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBhcHBseShcIlwiKTtcbiAgfVxuICBmdW5jdGlvbiBnZXRTcGVlZChpbmRleCkge1xuICAgIGNvbnN0IHsgcmV3aW5kU3BlZWQgfSA9IG9wdGlvbnM7XG4gICAgaWYgKFNwbGlkZTIuaXMoU0xJREUpICYmIHJld2luZFNwZWVkKSB7XG4gICAgICBjb25zdCBwcmV2ID0gQ29udHJvbGxlci5nZXRJbmRleCh0cnVlKTtcbiAgICAgIGNvbnN0IGVuZCA9IENvbnRyb2xsZXIuZ2V0RW5kKCk7XG4gICAgICBpZiAocHJldiA9PT0gMCAmJiBpbmRleCA+PSBlbmQgfHwgcHJldiA+PSBlbmQgJiYgaW5kZXggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHJld2luZFNwZWVkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3B0aW9ucy5zcGVlZDtcbiAgfVxuICBmdW5jdGlvbiBhcHBseSh0cmFuc2l0aW9uKSB7XG4gICAgc3R5bGUobGlzdCwgXCJ0cmFuc2l0aW9uXCIsIHRyYW5zaXRpb24pO1xuICB9XG4gIHJldHVybiB7XG4gICAgbW91bnQsXG4gICAgc3RhcnQsXG4gICAgY2FuY2VsXG4gIH07XG59XG5cbmNvbnN0IF9TcGxpZGUgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKHRhcmdldCwgb3B0aW9ucykge1xuICAgIHRoaXMuZXZlbnQgPSBFdmVudEJ1cygpO1xuICAgIHRoaXMuQ29tcG9uZW50cyA9IHt9O1xuICAgIHRoaXMuc3RhdGUgPSBTdGF0ZShDUkVBVEVEKTtcbiAgICB0aGlzLnNwbGlkZXMgPSBbXTtcbiAgICB0aGlzLl9vcHRpb25zID0ge307XG4gICAgdGhpcy5fRXh0ZW5zaW9ucyA9IHt9O1xuICAgIGNvbnN0IHJvb3QgPSBpc1N0cmluZyh0YXJnZXQpID8gcXVlcnkoZG9jdW1lbnQsIHRhcmdldCkgOiB0YXJnZXQ7XG4gICAgYXNzZXJ0KHJvb3QsIGAke3Jvb3R9IGlzIGludmFsaWQuYCk7XG4gICAgdGhpcy5yb290ID0gcm9vdDtcbiAgICBtZXJnZShERUZBVUxUUywgX1NwbGlkZS5kZWZhdWx0cyk7XG4gICAgbWVyZ2UobWVyZ2UodGhpcy5fb3B0aW9ucywgREVGQVVMVFMpLCBvcHRpb25zIHx8IHt9KTtcbiAgfVxuICBtb3VudChFeHRlbnNpb25zLCBUcmFuc2l0aW9uKSB7XG4gICAgY29uc3QgeyBzdGF0ZSwgQ29tcG9uZW50czogQ29tcG9uZW50czIgfSA9IHRoaXM7XG4gICAgYXNzZXJ0KHN0YXRlLmlzKFtDUkVBVEVELCBERVNUUk9ZRURdKSwgXCJBbHJlYWR5IG1vdW50ZWQhXCIpO1xuICAgIHN0YXRlLnNldChDUkVBVEVEKTtcbiAgICB0aGlzLl9Db21wb25lbnRzID0gQ29tcG9uZW50czI7XG4gICAgdGhpcy5fVHJhbnNpdGlvbiA9IFRyYW5zaXRpb24gfHwgdGhpcy5fVHJhbnNpdGlvbiB8fCAodGhpcy5pcyhGQURFKSA/IEZhZGUgOiBTbGlkZSk7XG4gICAgdGhpcy5fRXh0ZW5zaW9ucyA9IEV4dGVuc2lvbnMgfHwgdGhpcy5fRXh0ZW5zaW9ucztcbiAgICBjb25zdCBDb25zdHJ1Y3RvcnMgPSBhc3NpZ24oe30sIENvbXBvbmVudENvbnN0cnVjdG9ycywgdGhpcy5fRXh0ZW5zaW9ucywgeyBUcmFuc2l0aW9uOiB0aGlzLl9UcmFuc2l0aW9uIH0pO1xuICAgIGZvck93bihDb25zdHJ1Y3RvcnMsIChDb21wb25lbnQsIGtleSkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gQ29tcG9uZW50KHRoaXMsIENvbXBvbmVudHMyLCB0aGlzLl9vcHRpb25zKTtcbiAgICAgIENvbXBvbmVudHMyW2tleV0gPSBjb21wb25lbnQ7XG4gICAgICBjb21wb25lbnQuc2V0dXAgJiYgY29tcG9uZW50LnNldHVwKCk7XG4gICAgfSk7XG4gICAgZm9yT3duKENvbXBvbmVudHMyLCAoY29tcG9uZW50KSA9PiB7XG4gICAgICBjb21wb25lbnQubW91bnQgJiYgY29tcG9uZW50Lm1vdW50KCk7XG4gICAgfSk7XG4gICAgdGhpcy5lbWl0KEVWRU5UX01PVU5URUQpO1xuICAgIGFkZENsYXNzKHRoaXMucm9vdCwgQ0xBU1NfSU5JVElBTElaRUQpO1xuICAgIHN0YXRlLnNldChJRExFKTtcbiAgICB0aGlzLmVtaXQoRVZFTlRfUkVBRFkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHN5bmMoc3BsaWRlKSB7XG4gICAgdGhpcy5zcGxpZGVzLnB1c2goc3BsaWRlKTtcbiAgICBzcGxpZGUuc3BsaWRlcy5wdXNoKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGdvKGNvbnRyb2wpIHtcbiAgICB0aGlzLl9Db21wb25lbnRzLkNvbnRyb2xsZXIuZ28oY29udHJvbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgb24oZXZlbnRzLCBjYWxsYmFjaykge1xuICAgIHRoaXMuZXZlbnQub24oZXZlbnRzLCBjYWxsYmFjaywgbnVsbCwgREVGQVVMVF9VU0VSX0VWRU5UX1BSSU9SSVRZKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBvZmYoZXZlbnRzKSB7XG4gICAgdGhpcy5ldmVudC5vZmYoZXZlbnRzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBlbWl0KGV2ZW50KSB7XG4gICAgdGhpcy5ldmVudC5lbWl0KGV2ZW50LCAuLi5zbGljZShhcmd1bWVudHMsIDEpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBhZGQoc2xpZGVzLCBpbmRleCkge1xuICAgIHRoaXMuX0NvbXBvbmVudHMuU2xpZGVzLmFkZChzbGlkZXMsIGluZGV4KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICByZW1vdmUobWF0Y2hlcikge1xuICAgIHRoaXMuX0NvbXBvbmVudHMuU2xpZGVzLnJlbW92ZShtYXRjaGVyKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBpcyh0eXBlKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbnMudHlwZSA9PT0gdHlwZTtcbiAgfVxuICByZWZyZXNoKCkge1xuICAgIHRoaXMuZW1pdChFVkVOVF9SRUZSRVNIKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBkZXN0cm95KGNvbXBsZXRlbHkgPSB0cnVlKSB7XG4gICAgY29uc3QgeyBldmVudCwgc3RhdGUgfSA9IHRoaXM7XG4gICAgaWYgKHN0YXRlLmlzKENSRUFURUQpKSB7XG4gICAgICBldmVudC5vbihFVkVOVF9SRUFEWSwgdGhpcy5kZXN0cm95LmJpbmQodGhpcywgY29tcGxldGVseSksIHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3JPd24odGhpcy5fQ29tcG9uZW50cywgKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICBjb21wb25lbnQuZGVzdHJveSAmJiBjb21wb25lbnQuZGVzdHJveShjb21wbGV0ZWx5KTtcbiAgICAgIH0sIHRydWUpO1xuICAgICAgZXZlbnQuZW1pdChFVkVOVF9ERVNUUk9ZKTtcbiAgICAgIGV2ZW50LmRlc3Ryb3koKTtcbiAgICAgIGNvbXBsZXRlbHkgJiYgZW1wdHkodGhpcy5zcGxpZGVzKTtcbiAgICAgIHN0YXRlLnNldChERVNUUk9ZRUQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBnZXQgb3B0aW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgfVxuICBzZXQgb3B0aW9ucyhvcHRpb25zKSB7XG4gICAgY29uc3QgeyBfb3B0aW9ucyB9ID0gdGhpcztcbiAgICBtZXJnZShfb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmlzKENSRUFURUQpKSB7XG4gICAgICB0aGlzLmVtaXQoRVZFTlRfVVBEQVRFRCwgX29wdGlvbnMpO1xuICAgIH1cbiAgfVxuICBnZXQgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLl9Db21wb25lbnRzLlNsaWRlcy5nZXRMZW5ndGgodHJ1ZSk7XG4gIH1cbiAgZ2V0IGluZGV4KCkge1xuICAgIHJldHVybiB0aGlzLl9Db21wb25lbnRzLkNvbnRyb2xsZXIuZ2V0SW5kZXgoKTtcbiAgfVxufTtcbmxldCBTcGxpZGUgPSBfU3BsaWRlO1xuU3BsaWRlLmRlZmF1bHRzID0ge307XG5TcGxpZGUuU1RBVEVTID0gU1RBVEVTO1xuXG5jb25zdCBDTEFTU19SRU5ERVJFRCA9IFwiaXMtcmVuZGVyZWRcIjtcblxuY29uc3QgUkVOREVSRVJfREVGQVVMVF9DT05GSUcgPSB7XG4gIGxpc3RUYWc6IFwidWxcIixcbiAgc2xpZGVUYWc6IFwibGlcIlxufTtcblxuY2xhc3MgU3R5bGUge1xuICBjb25zdHJ1Y3RvcihpZCwgb3B0aW9ucykge1xuICAgIHRoaXMuc3R5bGVzID0ge307XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgcnVsZShzZWxlY3RvciwgcHJvcCwgdmFsdWUsIGJyZWFrcG9pbnQpIHtcbiAgICBicmVha3BvaW50ID0gYnJlYWtwb2ludCB8fCBcImRlZmF1bHRcIjtcbiAgICBjb25zdCBzZWxlY3RvcnMgPSB0aGlzLnN0eWxlc1ticmVha3BvaW50XSA9IHRoaXMuc3R5bGVzW2JyZWFrcG9pbnRdIHx8IHt9O1xuICAgIGNvbnN0IHN0eWxlcyA9IHNlbGVjdG9yc1tzZWxlY3Rvcl0gPSBzZWxlY3RvcnNbc2VsZWN0b3JdIHx8IHt9O1xuICAgIHN0eWxlc1twcm9wXSA9IHZhbHVlO1xuICB9XG4gIGJ1aWxkKCkge1xuICAgIGxldCBjc3MgPSBcIlwiO1xuICAgIGlmICh0aGlzLnN0eWxlcy5kZWZhdWx0KSB7XG4gICAgICBjc3MgKz0gdGhpcy5idWlsZFNlbGVjdG9ycyh0aGlzLnN0eWxlcy5kZWZhdWx0KTtcbiAgICB9XG4gICAgT2JqZWN0LmtleXModGhpcy5zdHlsZXMpLnNvcnQoKG4sIG0pID0+IHRoaXMub3B0aW9ucy5tZWRpYVF1ZXJ5ID09PSBcIm1pblwiID8gK24gLSArbSA6ICttIC0gK24pLmZvckVhY2goKGJyZWFrcG9pbnQpID0+IHtcbiAgICAgIGlmIChicmVha3BvaW50ICE9PSBcImRlZmF1bHRcIikge1xuICAgICAgICBjc3MgKz0gYEBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6ICR7YnJlYWtwb2ludH1weCkge2A7XG4gICAgICAgIGNzcyArPSB0aGlzLmJ1aWxkU2VsZWN0b3JzKHRoaXMuc3R5bGVzW2JyZWFrcG9pbnRdKTtcbiAgICAgICAgY3NzICs9IGB9YDtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY3NzO1xuICB9XG4gIGJ1aWxkU2VsZWN0b3JzKHNlbGVjdG9ycykge1xuICAgIGxldCBjc3MgPSBcIlwiO1xuICAgIGZvck93bihzZWxlY3RvcnMsIChzdHlsZXMsIHNlbGVjdG9yKSA9PiB7XG4gICAgICBjc3MgKz0gYCMke3RoaXMuaWR9ICR7c2VsZWN0b3J9IHtgO1xuICAgICAgZm9yT3duKHN0eWxlcywgKHZhbHVlLCBwcm9wKSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSB8fCB2YWx1ZSA9PT0gMCkge1xuICAgICAgICAgIGNzcyArPSBgJHtwcm9wfTogJHt2YWx1ZX07YDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjc3MgKz0gXCJ9XCI7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNzcztcbiAgfVxufVxuXG5jbGFzcyBTcGxpZGVSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKGNvbnRlbnRzLCBvcHRpb25zLCBjb25maWcsIGRlZmF1bHRzKSB7XG4gICAgdGhpcy5zbGlkZXMgPSBbXTtcbiAgICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLmJyZWFrcG9pbnRzID0gW107XG4gICAgbWVyZ2UoREVGQVVMVFMsIGRlZmF1bHRzIHx8IHt9KTtcbiAgICBtZXJnZShtZXJnZSh0aGlzLm9wdGlvbnMsIERFRkFVTFRTKSwgb3B0aW9ucyB8fCB7fSk7XG4gICAgdGhpcy5jb250ZW50cyA9IGNvbnRlbnRzO1xuICAgIHRoaXMuY29uZmlnID0gYXNzaWduKHt9LCBSRU5ERVJFUl9ERUZBVUxUX0NPTkZJRywgY29uZmlnIHx8IHt9KTtcbiAgICB0aGlzLmlkID0gdGhpcy5jb25maWcuaWQgfHwgdW5pcXVlSWQoXCJzcGxpZGVcIik7XG4gICAgdGhpcy5TdHlsZSA9IG5ldyBTdHlsZSh0aGlzLmlkLCB0aGlzLm9wdGlvbnMpO1xuICAgIHRoaXMuRGlyZWN0aW9uID0gRGlyZWN0aW9uKG51bGwsIG51bGwsIHRoaXMub3B0aW9ucyk7XG4gICAgYXNzZXJ0KHRoaXMuY29udGVudHMubGVuZ3RoLCBcIlByb3ZpZGUgYXQgbGVhc3QgMSBjb250ZW50LlwiKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuICBzdGF0aWMgY2xlYW4oc3BsaWRlKSB7XG4gICAgY29uc3QgeyBvbiB9ID0gRXZlbnRJbnRlcmZhY2Uoc3BsaWRlKTtcbiAgICBjb25zdCB7IHJvb3QgfSA9IHNwbGlkZTtcbiAgICBjb25zdCBjbG9uZXMgPSBxdWVyeUFsbChyb290LCBgLiR7Q0xBU1NfQ0xPTkV9YCk7XG4gICAgb24oRVZFTlRfTU9VTlRFRCwgKCkgPT4ge1xuICAgICAgcmVtb3ZlKGNoaWxkKHJvb3QsIFwic3R5bGVcIikpO1xuICAgIH0pO1xuICAgIHJlbW92ZShjbG9uZXMpO1xuICB9XG4gIGluaXQoKSB7XG4gICAgdGhpcy5wYXJzZUJyZWFrcG9pbnRzKCk7XG4gICAgdGhpcy5pbml0U2xpZGVzKCk7XG4gICAgdGhpcy5yZWdpc3RlclJvb3RTdHlsZXMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyVHJhY2tTdHlsZXMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyU2xpZGVTdHlsZXMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdFN0eWxlcygpO1xuICB9XG4gIGluaXRTbGlkZXMoKSB7XG4gICAgcHVzaCh0aGlzLnNsaWRlcywgdGhpcy5jb250ZW50cy5tYXAoKGNvbnRlbnQsIGluZGV4KSA9PiB7XG4gICAgICBjb250ZW50ID0gaXNTdHJpbmcoY29udGVudCkgPyB7IGh0bWw6IGNvbnRlbnQgfSA6IGNvbnRlbnQ7XG4gICAgICBjb250ZW50LnN0eWxlcyA9IGNvbnRlbnQuc3R5bGVzIHx8IHt9O1xuICAgICAgY29udGVudC5hdHRycyA9IGNvbnRlbnQuYXR0cnMgfHwge307XG4gICAgICB0aGlzLmNvdmVyKGNvbnRlbnQpO1xuICAgICAgY29uc3QgY2xhc3NlcyA9IGAke3RoaXMub3B0aW9ucy5jbGFzc2VzLnNsaWRlfSAke2luZGV4ID09PSAwID8gQ0xBU1NfQUNUSVZFIDogXCJcIn1gO1xuICAgICAgYXNzaWduKGNvbnRlbnQuYXR0cnMsIHtcbiAgICAgICAgY2xhc3M6IGAke2NsYXNzZXN9ICR7Y29udGVudC5hdHRycy5jbGFzcyB8fCBcIlwifWAudHJpbSgpLFxuICAgICAgICBzdHlsZTogdGhpcy5idWlsZFN0eWxlcyhjb250ZW50LnN0eWxlcylcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkpO1xuICAgIGlmICh0aGlzLmlzTG9vcCgpKSB7XG4gICAgICB0aGlzLmdlbmVyYXRlQ2xvbmVzKHRoaXMuc2xpZGVzKTtcbiAgICB9XG4gIH1cbiAgcmVnaXN0ZXJSb290U3R5bGVzKCkge1xuICAgIHRoaXMuYnJlYWtwb2ludHMuZm9yRWFjaCgoW3dpZHRoLCBvcHRpb25zXSkgPT4ge1xuICAgICAgdGhpcy5TdHlsZS5ydWxlKFwiIFwiLCBcIm1heC13aWR0aFwiLCB1bml0KG9wdGlvbnMud2lkdGgpLCB3aWR0aCk7XG4gICAgfSk7XG4gIH1cbiAgcmVnaXN0ZXJUcmFja1N0eWxlcygpIHtcbiAgICBjb25zdCB7IFN0eWxlOiBTdHlsZTIgfSA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBgLiR7Q0xBU1NfVFJBQ0t9YDtcbiAgICB0aGlzLmJyZWFrcG9pbnRzLmZvckVhY2goKFt3aWR0aCwgb3B0aW9uc10pID0+IHtcbiAgICAgIFN0eWxlMi5ydWxlKHNlbGVjdG9yLCB0aGlzLnJlc29sdmUoXCJwYWRkaW5nTGVmdFwiKSwgdGhpcy5jc3NQYWRkaW5nKG9wdGlvbnMsIGZhbHNlKSwgd2lkdGgpO1xuICAgICAgU3R5bGUyLnJ1bGUoc2VsZWN0b3IsIHRoaXMucmVzb2x2ZShcInBhZGRpbmdSaWdodFwiKSwgdGhpcy5jc3NQYWRkaW5nKG9wdGlvbnMsIHRydWUpLCB3aWR0aCk7XG4gICAgICBTdHlsZTIucnVsZShzZWxlY3RvciwgXCJoZWlnaHRcIiwgdGhpcy5jc3NUcmFja0hlaWdodChvcHRpb25zKSwgd2lkdGgpO1xuICAgIH0pO1xuICB9XG4gIHJlZ2lzdGVyTGlzdFN0eWxlcygpIHtcbiAgICBjb25zdCB7IFN0eWxlOiBTdHlsZTIgfSA9IHRoaXM7XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBgLiR7Q0xBU1NfTElTVH1gO1xuICAgIHRoaXMuYnJlYWtwb2ludHMuZm9yRWFjaCgoW3dpZHRoLCBvcHRpb25zXSkgPT4ge1xuICAgICAgU3R5bGUyLnJ1bGUoc2VsZWN0b3IsIFwidHJhbnNmb3JtXCIsIHRoaXMuYnVpbGRUcmFuc2xhdGUob3B0aW9ucyksIHdpZHRoKTtcbiAgICB9KTtcbiAgfVxuICByZWdpc3RlclNsaWRlU3R5bGVzKCkge1xuICAgIGNvbnN0IHsgU3R5bGU6IFN0eWxlMiB9ID0gdGhpcztcbiAgICBjb25zdCBzZWxlY3RvciA9IGAuJHtDTEFTU19TTElERX1gO1xuICAgIHRoaXMuYnJlYWtwb2ludHMuZm9yRWFjaCgoW3dpZHRoLCBvcHRpb25zXSkgPT4ge1xuICAgICAgU3R5bGUyLnJ1bGUoc2VsZWN0b3IsIFwid2lkdGhcIiwgdGhpcy5jc3NTbGlkZVdpZHRoKG9wdGlvbnMpLCB3aWR0aCk7XG4gICAgICBTdHlsZTIucnVsZShzZWxlY3RvciwgdGhpcy5yZXNvbHZlKFwibWFyZ2luUmlnaHRcIiksIHVuaXQob3B0aW9ucy5nYXApIHx8IFwiMHB4XCIsIHdpZHRoKTtcbiAgICAgIGNvbnN0IGhlaWdodCA9IHRoaXMuY3NzU2xpZGVIZWlnaHQob3B0aW9ucyk7XG4gICAgICBpZiAoaGVpZ2h0KSB7XG4gICAgICAgIFN0eWxlMi5ydWxlKHNlbGVjdG9yLCBcImhlaWdodFwiLCBoZWlnaHQsIHdpZHRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFN0eWxlMi5ydWxlKHNlbGVjdG9yLCBcInBhZGRpbmctdG9wXCIsIHRoaXMuY3NzU2xpZGVQYWRkaW5nKG9wdGlvbnMpLCB3aWR0aCk7XG4gICAgICB9XG4gICAgICBTdHlsZTIucnVsZShgJHtzZWxlY3Rvcn0gPiBpbWdgLCBcImRpc3BsYXlcIiwgb3B0aW9ucy5jb3ZlciA/IFwibm9uZVwiIDogXCJpbmxpbmVcIiwgd2lkdGgpO1xuICAgIH0pO1xuICB9XG4gIGJ1aWxkVHJhbnNsYXRlKG9wdGlvbnMpIHtcbiAgICBjb25zdCB7IHJlc29sdmUsIG9yaWVudCB9ID0gdGhpcy5EaXJlY3Rpb247XG4gICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgdmFsdWVzLnB1c2godGhpcy5jc3NPZmZzZXRDbG9uZXMob3B0aW9ucykpO1xuICAgIHZhbHVlcy5wdXNoKHRoaXMuY3NzT2Zmc2V0R2FwcyhvcHRpb25zKSk7XG4gICAgaWYgKHRoaXMuaXNDZW50ZXIob3B0aW9ucykpIHtcbiAgICAgIHZhbHVlcy5wdXNoKHRoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQoLTUwKSwgXCIlXCIpKTtcbiAgICAgIHZhbHVlcy5wdXNoKC4uLnRoaXMuY3NzT2Zmc2V0Q2VudGVyKG9wdGlvbnMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlcy5maWx0ZXIoQm9vbGVhbikubWFwKCh2YWx1ZSkgPT4gYHRyYW5zbGF0ZSR7cmVzb2x2ZShcIlhcIil9KCR7dmFsdWV9KWApLmpvaW4oXCIgXCIpO1xuICB9XG4gIGNzc09mZnNldENsb25lcyhvcHRpb25zKSB7XG4gICAgY29uc3QgeyByZXNvbHZlLCBvcmllbnQgfSA9IHRoaXMuRGlyZWN0aW9uO1xuICAgIGNvbnN0IGNsb25lQ291bnQgPSB0aGlzLmdldENsb25lQ291bnQoKTtcbiAgICBpZiAodGhpcy5pc0ZpeGVkV2lkdGgob3B0aW9ucykpIHtcbiAgICAgIGNvbnN0IHsgdmFsdWUsIHVuaXQ6IHVuaXQyIH0gPSB0aGlzLnBhcnNlQ3NzVmFsdWUob3B0aW9uc1tyZXNvbHZlKFwiZml4ZWRXaWR0aFwiKV0pO1xuICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQodmFsdWUpICogY2xvbmVDb3VudCwgdW5pdDIpO1xuICAgIH1cbiAgICBjb25zdCBwZXJjZW50ID0gMTAwICogY2xvbmVDb3VudCAvIG9wdGlvbnMucGVyUGFnZTtcbiAgICByZXR1cm4gYCR7b3JpZW50KHBlcmNlbnQpfSVgO1xuICB9XG4gIGNzc09mZnNldENlbnRlcihvcHRpb25zKSB7XG4gICAgY29uc3QgeyByZXNvbHZlLCBvcmllbnQgfSA9IHRoaXMuRGlyZWN0aW9uO1xuICAgIGlmICh0aGlzLmlzRml4ZWRXaWR0aChvcHRpb25zKSkge1xuICAgICAgY29uc3QgeyB2YWx1ZSwgdW5pdDogdW5pdDIgfSA9IHRoaXMucGFyc2VDc3NWYWx1ZShvcHRpb25zW3Jlc29sdmUoXCJmaXhlZFdpZHRoXCIpXSk7XG4gICAgICByZXR1cm4gW3RoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQodmFsdWUgLyAyKSwgdW5pdDIpXTtcbiAgICB9XG4gICAgY29uc3QgdmFsdWVzID0gW107XG4gICAgY29uc3QgeyBwZXJQYWdlLCBnYXAgfSA9IG9wdGlvbnM7XG4gICAgdmFsdWVzLnB1c2goYCR7b3JpZW50KDUwIC8gcGVyUGFnZSl9JWApO1xuICAgIGlmIChnYXApIHtcbiAgICAgIGNvbnN0IHsgdmFsdWUsIHVuaXQ6IHVuaXQyIH0gPSB0aGlzLnBhcnNlQ3NzVmFsdWUoZ2FwKTtcbiAgICAgIGNvbnN0IGdhcE9mZnNldCA9ICh2YWx1ZSAvIHBlclBhZ2UgLSB2YWx1ZSkgLyAyO1xuICAgICAgdmFsdWVzLnB1c2godGhpcy5idWlsZENzc1ZhbHVlKG9yaWVudChnYXBPZmZzZXQpLCB1bml0MikpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG4gIGNzc09mZnNldEdhcHMob3B0aW9ucykge1xuICAgIGNvbnN0IGNsb25lQ291bnQgPSB0aGlzLmdldENsb25lQ291bnQoKTtcbiAgICBpZiAoY2xvbmVDb3VudCAmJiBvcHRpb25zLmdhcCkge1xuICAgICAgY29uc3QgeyBvcmllbnQgfSA9IHRoaXMuRGlyZWN0aW9uO1xuICAgICAgY29uc3QgeyB2YWx1ZSwgdW5pdDogdW5pdDIgfSA9IHRoaXMucGFyc2VDc3NWYWx1ZShvcHRpb25zLmdhcCk7XG4gICAgICBpZiAodGhpcy5pc0ZpeGVkV2lkdGgob3B0aW9ucykpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQodmFsdWUgKiBjbG9uZUNvdW50KSwgdW5pdDIpO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBwZXJQYWdlIH0gPSBvcHRpb25zO1xuICAgICAgY29uc3QgZ2FwcyA9IGNsb25lQ291bnQgLyBwZXJQYWdlO1xuICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQoZ2FwcyAqIHZhbHVlKSwgdW5pdDIpO1xuICAgIH1cbiAgICByZXR1cm4gXCJcIjtcbiAgfVxuICByZXNvbHZlKHByb3ApIHtcbiAgICByZXR1cm4gY2FtZWxUb0tlYmFiKHRoaXMuRGlyZWN0aW9uLnJlc29sdmUocHJvcCkpO1xuICB9XG4gIGNzc1BhZGRpbmcob3B0aW9ucywgcmlnaHQpIHtcbiAgICBjb25zdCB7IHBhZGRpbmcgfSA9IG9wdGlvbnM7XG4gICAgY29uc3QgcHJvcCA9IHRoaXMuRGlyZWN0aW9uLnJlc29sdmUocmlnaHQgPyBcInJpZ2h0XCIgOiBcImxlZnRcIiwgdHJ1ZSk7XG4gICAgcmV0dXJuIHBhZGRpbmcgJiYgdW5pdChwYWRkaW5nW3Byb3BdIHx8IChpc09iamVjdChwYWRkaW5nKSA/IDAgOiBwYWRkaW5nKSkgfHwgXCIwcHhcIjtcbiAgfVxuICBjc3NUcmFja0hlaWdodChvcHRpb25zKSB7XG4gICAgbGV0IGhlaWdodCA9IFwiXCI7XG4gICAgaWYgKHRoaXMuaXNWZXJ0aWNhbCgpKSB7XG4gICAgICBoZWlnaHQgPSB0aGlzLmNzc0hlaWdodChvcHRpb25zKTtcbiAgICAgIGFzc2VydChoZWlnaHQsICdcImhlaWdodFwiIGlzIG1pc3NpbmcuJyk7XG4gICAgICBoZWlnaHQgPSBgY2FsYygke2hlaWdodH0gLSAke3RoaXMuY3NzUGFkZGluZyhvcHRpb25zLCBmYWxzZSl9IC0gJHt0aGlzLmNzc1BhZGRpbmcob3B0aW9ucywgdHJ1ZSl9KWA7XG4gICAgfVxuICAgIHJldHVybiBoZWlnaHQ7XG4gIH1cbiAgY3NzSGVpZ2h0KG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdW5pdChvcHRpb25zLmhlaWdodCk7XG4gIH1cbiAgY3NzU2xpZGVXaWR0aChvcHRpb25zKSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuYXV0b1dpZHRoID8gXCJcIiA6IHVuaXQob3B0aW9ucy5maXhlZFdpZHRoKSB8fCAodGhpcy5pc1ZlcnRpY2FsKCkgPyBcIlwiIDogdGhpcy5jc3NTbGlkZVNpemUob3B0aW9ucykpO1xuICB9XG4gIGNzc1NsaWRlSGVpZ2h0KG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdW5pdChvcHRpb25zLmZpeGVkSGVpZ2h0KSB8fCAodGhpcy5pc1ZlcnRpY2FsKCkgPyBvcHRpb25zLmF1dG9IZWlnaHQgPyBcIlwiIDogdGhpcy5jc3NTbGlkZVNpemUob3B0aW9ucykgOiB0aGlzLmNzc0hlaWdodChvcHRpb25zKSk7XG4gIH1cbiAgY3NzU2xpZGVTaXplKG9wdGlvbnMpIHtcbiAgICBjb25zdCBnYXAgPSB1bml0KG9wdGlvbnMuZ2FwKTtcbiAgICByZXR1cm4gYGNhbGMoKDEwMCUke2dhcCAmJiBgICsgJHtnYXB9YH0pLyR7b3B0aW9ucy5wZXJQYWdlIHx8IDF9JHtnYXAgJiYgYCAtICR7Z2FwfWB9KWA7XG4gIH1cbiAgY3NzU2xpZGVQYWRkaW5nKG9wdGlvbnMpIHtcbiAgICBjb25zdCB7IGhlaWdodFJhdGlvIH0gPSBvcHRpb25zO1xuICAgIHJldHVybiBoZWlnaHRSYXRpbyA/IGAke2hlaWdodFJhdGlvICogMTAwfSVgIDogXCJcIjtcbiAgfVxuICBidWlsZENzc1ZhbHVlKHZhbHVlLCB1bml0Mikge1xuICAgIHJldHVybiBgJHt2YWx1ZX0ke3VuaXQyfWA7XG4gIH1cbiAgcGFyc2VDc3NWYWx1ZSh2YWx1ZSkge1xuICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgIGNvbnN0IG51bWJlciA9IHBhcnNlRmxvYXQodmFsdWUpIHx8IDA7XG4gICAgICBjb25zdCB1bml0MiA9IHZhbHVlLnJlcGxhY2UoL1xcZCooXFwuXFxkKik/LywgXCJcIikgfHwgXCJweFwiO1xuICAgICAgcmV0dXJuIHsgdmFsdWU6IG51bWJlciwgdW5pdDogdW5pdDIgfTtcbiAgICB9XG4gICAgcmV0dXJuIHsgdmFsdWUsIHVuaXQ6IFwicHhcIiB9O1xuICB9XG4gIHBhcnNlQnJlYWtwb2ludHMoKSB7XG4gICAgY29uc3QgeyBicmVha3BvaW50cyB9ID0gdGhpcy5vcHRpb25zO1xuICAgIHRoaXMuYnJlYWtwb2ludHMucHVzaChbXCJkZWZhdWx0XCIsIHRoaXMub3B0aW9uc10pO1xuICAgIGlmIChicmVha3BvaW50cykge1xuICAgICAgZm9yT3duKGJyZWFrcG9pbnRzLCAob3B0aW9ucywgd2lkdGgpID0+IHtcbiAgICAgICAgdGhpcy5icmVha3BvaW50cy5wdXNoKFt3aWR0aCwgbWVyZ2UobWVyZ2Uoe30sIHRoaXMub3B0aW9ucyksIG9wdGlvbnMpXSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaXNGaXhlZFdpZHRoKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gISFvcHRpb25zW3RoaXMuRGlyZWN0aW9uLnJlc29sdmUoXCJmaXhlZFdpZHRoXCIpXTtcbiAgfVxuICBpc0xvb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy50eXBlID09PSBMT09QO1xuICB9XG4gIGlzQ2VudGVyKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5mb2N1cyA9PT0gXCJjZW50ZXJcIikge1xuICAgICAgaWYgKHRoaXMuaXNMb29wKCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnR5cGUgPT09IFNMSURFKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5vcHRpb25zLnRyaW1TcGFjZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlzVmVydGljYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gPT09IFRUQjtcbiAgfVxuICBidWlsZENsYXNzZXMoKSB7XG4gICAgY29uc3QgeyBvcHRpb25zIH0gPSB0aGlzO1xuICAgIHJldHVybiBbXG4gICAgICBDTEFTU19ST09ULFxuICAgICAgYCR7Q0xBU1NfUk9PVH0tLSR7b3B0aW9ucy50eXBlfWAsXG4gICAgICBgJHtDTEFTU19ST09UfS0tJHtvcHRpb25zLmRpcmVjdGlvbn1gLFxuICAgICAgb3B0aW9ucy5kcmFnICYmIGAke0NMQVNTX1JPT1R9LS1kcmFnZ2FibGVgLFxuICAgICAgb3B0aW9ucy5pc05hdmlnYXRpb24gJiYgYCR7Q0xBU1NfUk9PVH0tLW5hdmAsXG4gICAgICBDTEFTU19BQ1RJVkUsXG4gICAgICAhdGhpcy5jb25maWcuaGlkZGVuICYmIENMQVNTX1JFTkRFUkVEXG4gICAgXS5maWx0ZXIoQm9vbGVhbikuam9pbihcIiBcIik7XG4gIH1cbiAgYnVpbGRBdHRycyhhdHRycykge1xuICAgIGxldCBhdHRyID0gXCJcIjtcbiAgICBmb3JPd24oYXR0cnMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICBhdHRyICs9IHZhbHVlID8gYCAke2NhbWVsVG9LZWJhYihrZXkpfT1cIiR7dmFsdWV9XCJgIDogXCJcIjtcbiAgICB9KTtcbiAgICByZXR1cm4gYXR0ci50cmltKCk7XG4gIH1cbiAgYnVpbGRTdHlsZXMoc3R5bGVzKSB7XG4gICAgbGV0IHN0eWxlID0gXCJcIjtcbiAgICBmb3JPd24oc3R5bGVzLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgc3R5bGUgKz0gYCAke2NhbWVsVG9LZWJhYihrZXkpfToke3ZhbHVlfTtgO1xuICAgIH0pO1xuICAgIHJldHVybiBzdHlsZS50cmltKCk7XG4gIH1cbiAgcmVuZGVyU2xpZGVzKCkge1xuICAgIGNvbnN0IHsgc2xpZGVUYWc6IHRhZyB9ID0gdGhpcy5jb25maWc7XG4gICAgcmV0dXJuIHRoaXMuc2xpZGVzLm1hcCgoY29udGVudCkgPT4ge1xuICAgICAgcmV0dXJuIGA8JHt0YWd9ICR7dGhpcy5idWlsZEF0dHJzKGNvbnRlbnQuYXR0cnMpfT4ke2NvbnRlbnQuaHRtbCB8fCBcIlwifTwvJHt0YWd9PmA7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfVxuICBjb3Zlcihjb250ZW50KSB7XG4gICAgY29uc3QgeyBzdHlsZXMsIGh0bWwgPSBcIlwiIH0gPSBjb250ZW50O1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY292ZXIgJiYgIXRoaXMub3B0aW9ucy5sYXp5TG9hZCkge1xuICAgICAgY29uc3Qgc3JjID0gaHRtbC5tYXRjaCgvPGltZy4qP3NyY1xccyo9XFxzKihbJ1wiXSkoLis/KVxcMS4qPz4vKTtcbiAgICAgIGlmIChzcmMgJiYgc3JjWzJdKSB7XG4gICAgICAgIHN0eWxlcy5iYWNrZ3JvdW5kID0gYGNlbnRlci9jb3ZlciBuby1yZXBlYXQgdXJsKCcke3NyY1syXX0nKWA7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGdlbmVyYXRlQ2xvbmVzKGNvbnRlbnRzKSB7XG4gICAgY29uc3QgeyBjbGFzc2VzIH0gPSB0aGlzLm9wdGlvbnM7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLmdldENsb25lQ291bnQoKTtcbiAgICBjb25zdCBzbGlkZXMgPSBjb250ZW50cy5zbGljZSgpO1xuICAgIHdoaWxlIChzbGlkZXMubGVuZ3RoIDwgY291bnQpIHtcbiAgICAgIHB1c2goc2xpZGVzLCBzbGlkZXMpO1xuICAgIH1cbiAgICBwdXNoKHNsaWRlcy5zbGljZSgtY291bnQpLnJldmVyc2UoKSwgc2xpZGVzLnNsaWNlKDAsIGNvdW50KSkuZm9yRWFjaCgoY29udGVudCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGF0dHJzID0gYXNzaWduKHt9LCBjb250ZW50LmF0dHJzLCB7IGNsYXNzOiBgJHtjb250ZW50LmF0dHJzLmNsYXNzfSAke2NsYXNzZXMuY2xvbmV9YCB9KTtcbiAgICAgIGNvbnN0IGNsb25lID0gYXNzaWduKHt9LCBjb250ZW50LCB7IGF0dHJzIH0pO1xuICAgICAgaW5kZXggPCBjb3VudCA/IGNvbnRlbnRzLnVuc2hpZnQoY2xvbmUpIDogY29udGVudHMucHVzaChjbG9uZSk7XG4gICAgfSk7XG4gIH1cbiAgZ2V0Q2xvbmVDb3VudCgpIHtcbiAgICBpZiAodGhpcy5pc0xvb3AoKSkge1xuICAgICAgY29uc3QgeyBvcHRpb25zIH0gPSB0aGlzO1xuICAgICAgaWYgKG9wdGlvbnMuY2xvbmVzKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLmNsb25lcztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBlclBhZ2UgPSBtYXgoLi4udGhpcy5icmVha3BvaW50cy5tYXAoKFssIG9wdGlvbnMyXSkgPT4gb3B0aW9uczIucGVyUGFnZSkpO1xuICAgICAgcmV0dXJuIHBlclBhZ2UgKiAoKG9wdGlvbnMuZmxpY2tNYXhQYWdlcyB8fCAxKSArIDEpO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuICByZW5kZXJBcnJvd3MoKSB7XG4gICAgbGV0IGh0bWwgPSBcIlwiO1xuICAgIGh0bWwgKz0gYDxkaXYgY2xhc3M9XCIke3RoaXMub3B0aW9ucy5jbGFzc2VzLmFycm93c31cIj5gO1xuICAgIGh0bWwgKz0gdGhpcy5yZW5kZXJBcnJvdyh0cnVlKTtcbiAgICBodG1sICs9IHRoaXMucmVuZGVyQXJyb3coZmFsc2UpO1xuICAgIGh0bWwgKz0gYDwvZGl2PmA7XG4gICAgcmV0dXJuIGh0bWw7XG4gIH1cbiAgcmVuZGVyQXJyb3cocHJldikge1xuICAgIGNvbnN0IHsgY2xhc3NlcywgaTE4biB9ID0gdGhpcy5vcHRpb25zO1xuICAgIGNvbnN0IGF0dHJzID0ge1xuICAgICAgY2xhc3M6IGAke2NsYXNzZXMuYXJyb3d9ICR7cHJldiA/IGNsYXNzZXMucHJldiA6IGNsYXNzZXMubmV4dH1gLFxuICAgICAgdHlwZTogXCJidXR0b25cIixcbiAgICAgIGFyaWFMYWJlbDogcHJldiA/IGkxOG4ucHJldiA6IGkxOG4ubmV4dFxuICAgIH07XG4gICAgcmV0dXJuIGA8YnV0dG9uICR7dGhpcy5idWlsZEF0dHJzKGF0dHJzKX0+PHN2ZyB4bWxucz1cIiR7WE1MX05BTUVfU1BBQ0V9XCIgdmlld0JveD1cIjAgMCAke1NJWkV9ICR7U0laRX1cIiB3aWR0aD1cIiR7U0laRX1cIiBoZWlnaHQ9XCIke1NJWkV9XCI+PHBhdGggZD1cIiR7dGhpcy5vcHRpb25zLmFycm93UGF0aCB8fCBQQVRIfVwiIC8+PC9zdmc+PC9idXR0b24+YDtcbiAgfVxuICBodG1sKCkge1xuICAgIGNvbnN0IHsgcm9vdENsYXNzLCBsaXN0VGFnLCBhcnJvd3MsIGJlZm9yZVRyYWNrLCBhZnRlclRyYWNrLCBzbGlkZXIsIGJlZm9yZVNsaWRlciwgYWZ0ZXJTbGlkZXIgfSA9IHRoaXMuY29uZmlnO1xuICAgIGxldCBodG1sID0gXCJcIjtcbiAgICBodG1sICs9IGA8ZGl2IGlkPVwiJHt0aGlzLmlkfVwiIGNsYXNzPVwiJHt0aGlzLmJ1aWxkQ2xhc3NlcygpfSAke3Jvb3RDbGFzcyB8fCBcIlwifVwiPmA7XG4gICAgaHRtbCArPSBgPHN0eWxlPiR7dGhpcy5TdHlsZS5idWlsZCgpfTwvc3R5bGU+YDtcbiAgICBpZiAoc2xpZGVyKSB7XG4gICAgICBodG1sICs9IGJlZm9yZVNsaWRlciB8fCBcIlwiO1xuICAgICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cInNwbGlkZV9fc2xpZGVyXCI+YDtcbiAgICB9XG4gICAgaHRtbCArPSBiZWZvcmVUcmFjayB8fCBcIlwiO1xuICAgIGlmIChhcnJvd3MpIHtcbiAgICAgIGh0bWwgKz0gdGhpcy5yZW5kZXJBcnJvd3MoKTtcbiAgICB9XG4gICAgaHRtbCArPSBgPGRpdiBjbGFzcz1cInNwbGlkZV9fdHJhY2tcIj5gO1xuICAgIGh0bWwgKz0gYDwke2xpc3RUYWd9IGNsYXNzPVwic3BsaWRlX19saXN0XCI+YDtcbiAgICBodG1sICs9IHRoaXMucmVuZGVyU2xpZGVzKCk7XG4gICAgaHRtbCArPSBgPC8ke2xpc3RUYWd9PmA7XG4gICAgaHRtbCArPSBgPC9kaXY+YDtcbiAgICBodG1sICs9IGFmdGVyVHJhY2sgfHwgXCJcIjtcbiAgICBpZiAoc2xpZGVyKSB7XG4gICAgICBodG1sICs9IGA8L2Rpdj5gO1xuICAgICAgaHRtbCArPSBhZnRlclNsaWRlciB8fCBcIlwiO1xuICAgIH1cbiAgICBodG1sICs9IGA8L2Rpdj5gO1xuICAgIHJldHVybiBodG1sO1xuICB9XG59XG5cbmV4cG9ydCB7IENMQVNTRVMsIENMQVNTX0FDVElWRSwgQ0xBU1NfQVJST1csIENMQVNTX0FSUk9XUywgQ0xBU1NfQVJST1dfTkVYVCwgQ0xBU1NfQVJST1dfUFJFViwgQ0xBU1NfQVVUT1BMQVksIENMQVNTX0NMT05FLCBDTEFTU19DT05UQUlORVIsIENMQVNTX0lOSVRJQUxJWkVELCBDTEFTU19MSVNULCBDTEFTU19MT0FESU5HLCBDTEFTU19ORVhULCBDTEFTU19QQUdJTkFUSU9OLCBDTEFTU19QQUdJTkFUSU9OX1BBR0UsIENMQVNTX1BBVVNFLCBDTEFTU19QTEFZLCBDTEFTU19QUkVWLCBDTEFTU19QUk9HUkVTUywgQ0xBU1NfUFJPR1JFU1NfQkFSLCBDTEFTU19ST09ULCBDTEFTU19TTElERSwgQ0xBU1NfU0xJREVSLCBDTEFTU19TUElOTkVSLCBDTEFTU19UUkFDSywgQ0xBU1NfVklTSUJMRSwgRVZFTlRfQUNUSVZFLCBFVkVOVF9BUlJPV1NfTU9VTlRFRCwgRVZFTlRfQVJST1dTX1VQREFURUQsIEVWRU5UX0FVVE9QTEFZX1BBVVNFLCBFVkVOVF9BVVRPUExBWV9QTEFZLCBFVkVOVF9BVVRPUExBWV9QTEFZSU5HLCBFVkVOVF9DTElDSywgRVZFTlRfREVTVFJPWSwgRVZFTlRfRFJBRywgRVZFTlRfRFJBR0dFRCwgRVZFTlRfRFJBR0dJTkcsIEVWRU5UX0hJRERFTiwgRVZFTlRfSU5BQ1RJVkUsIEVWRU5UX0xBWllMT0FEX0xPQURFRCwgRVZFTlRfTU9VTlRFRCwgRVZFTlRfTU9WRSwgRVZFTlRfTU9WRUQsIEVWRU5UX05BVklHQVRJT05fTU9VTlRFRCwgRVZFTlRfUEFHSU5BVElPTl9NT1VOVEVELCBFVkVOVF9QQUdJTkFUSU9OX1VQREFURUQsIEVWRU5UX1JFQURZLCBFVkVOVF9SRUZSRVNILCBFVkVOVF9SRVBPU0lUSU9ORUQsIEVWRU5UX1JFU0laRSwgRVZFTlRfUkVTSVpFRCwgRVZFTlRfU0NST0xMLCBFVkVOVF9TQ1JPTExFRCwgRVZFTlRfU0xJREVfS0VZRE9XTiwgRVZFTlRfVVBEQVRFRCwgRVZFTlRfVklTSUJMRSwgRXZlbnRCdXMsIEV2ZW50SW50ZXJmYWNlLCBSZXF1ZXN0SW50ZXJ2YWwsIFNUQVRVU19DTEFTU0VTLCBTcGxpZGUsIFNwbGlkZVJlbmRlcmVyLCBTdGF0ZSwgVGhyb3R0bGUsIFNwbGlkZSBhcyBkZWZhdWx0IH07XG4iLCJpbXBvcnQgU3BsaWRlIGZyb20gJ0BzcGxpZGVqcy9zcGxpZGUnO1xyXG5cclxuXHJcbmlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY2Fyb3VzZWwnKSkge1xyXG4gIG5ldyBTcGxpZGUoICcjY2Fyb3VzZWwnLCB7XHJcbiAgICBwYWdpbmF0aW9uOiBmYWxzZSxcclxuICAgIHR5cGU6ICdzbGlkZScsXHJcbiAgICBwZXJQYWdlOiA0LFxyXG4gICAgcGVyTW92ZTogMSxcclxuICAgIGdhcDogMzIsXHJcbiAgICBicmVha3BvaW50czoge1xyXG4gICAgICA1MDA6IHtcclxuICAgICAgICBwZXJQYWdlOiAxLFxyXG4gICAgICAgIGdhcDogMTAsXHJcbiAgICAgIH0sXHJcbiAgICAgIDc2Nzoge1xyXG4gICAgICAgIHBlclBhZ2U6IDIsXHJcbiAgICAgICAgZ2FwOiAxMCxcclxuICAgICAgfSxcclxuICAgICAgMTAyNDoge1xyXG4gICAgICAgIHBlclBhZ2U6IDIsXHJcbiAgICAgICAgZ2FwOiAxNixcclxuICAgICAgfSxcclxuICAgICAgMTQwMDoge1xyXG4gICAgICAgIHBlclBhZ2U6IDMsXHJcbiAgICAgICAgZ2FwOiAzMixcclxuICAgICAgfSxcclxuICAgIH1cclxuICB9ICkubW91bnQoKTtcclxufVxyXG4iLCIvKipcclxuICogVG9nZ2xlIE5hdlxyXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiAtIHRvZ2dsZSBjbGFzcyBvbiBib2R5XHJcbiAqL1xyXG5cclxuY29uc3QgRUxFTUVOVFMgPSAnLnRvZ2dsZW5hdl9fYnV0dG9uJ1xyXG5jb25zdCBUT0dHTEVfQ0xBU1MgPSAnbmF2LWlzLW9wZW4nXHJcblxyXG5jbGFzcyBUb2dnbGVOYXYge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5lbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoRUxFTUVOVFMpXHJcblxyXG4gICAgaWYgKCF0aGlzLmVsZW1lbnRzKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZWxlbWVudHMuZm9yRWFjaCgoZWwpID0+IHtcclxuICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnRvZ2dsZU5hdiwgZmFsc2UpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgdG9nZ2xlTmF2KGUpIHtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZShUT0dHTEVfQ0xBU1MpXHJcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC50b2dnbGUoJ2xvY2snKVxyXG5cclxuICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gIH1cclxufVxyXG5cclxubmV3IFRvZ2dsZU5hdigpXHJcbiIsIi8qIVxyXG5cdEJ5IEFuZHLDqSBSaW5hcywgd3d3LmFuZHJlcmluYXMuZGVcclxuXHREb2N1bWVudGF0aW9uLCB3d3cuc2ltcGxlbGlnaHRib3guZGVcclxuXHRBdmFpbGFibGUgZm9yIHVzZSB1bmRlciB0aGUgTUlUIExpY2Vuc2VcclxuXHRWZXJzaW9uIDIuMTAuMVxyXG4qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG5mdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihvLCBhbGxvd0FycmF5TGlrZSkgeyB2YXIgaXQgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSB8fCBvW1wiQEBpdGVyYXRvclwiXTsgaWYgKCFpdCkgeyBpZiAoQXJyYXkuaXNBcnJheShvKSB8fCAoaXQgPSBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobykpIHx8IGFsbG93QXJyYXlMaWtlICYmIG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSB7IGlmIChpdCkgbyA9IGl0OyB2YXIgaSA9IDA7IHZhciBGID0gZnVuY3Rpb24gRigpIHt9OyByZXR1cm4geyBzOiBGLCBuOiBmdW5jdGlvbiBuKCkgeyBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHsgZG9uZTogdHJ1ZSB9OyByZXR1cm4geyBkb25lOiBmYWxzZSwgdmFsdWU6IG9baSsrXSB9OyB9LCBlOiBmdW5jdGlvbiBlKF9lKSB7IHRocm93IF9lOyB9LCBmOiBGIH07IH0gdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9IHZhciBub3JtYWxDb21wbGV0aW9uID0gdHJ1ZSwgZGlkRXJyID0gZmFsc2UsIGVycjsgcmV0dXJuIHsgczogZnVuY3Rpb24gcygpIHsgaXQgPSBpdC5jYWxsKG8pOyB9LCBuOiBmdW5jdGlvbiBuKCkgeyB2YXIgc3RlcCA9IGl0Lm5leHQoKTsgbm9ybWFsQ29tcGxldGlvbiA9IHN0ZXAuZG9uZTsgcmV0dXJuIHN0ZXA7IH0sIGU6IGZ1bmN0aW9uIGUoX2UyKSB7IGRpZEVyciA9IHRydWU7IGVyciA9IF9lMjsgfSwgZjogZnVuY3Rpb24gZigpIHsgdHJ5IHsgaWYgKCFub3JtYWxDb21wbGV0aW9uICYmIGl0W1wicmV0dXJuXCJdICE9IG51bGwpIGl0W1wicmV0dXJuXCJdKCk7IH0gZmluYWxseSB7IGlmIChkaWRFcnIpIHRocm93IGVycjsgfSB9IH07IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBTaW1wbGVMaWdodGJveCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNpbXBsZUxpZ2h0Ym94KGVsZW1lbnRzLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTaW1wbGVMaWdodGJveCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJkZWZhdWx0T3B0aW9uc1wiLCB7XG4gICAgICBzb3VyY2VBdHRyOiAnaHJlZicsXG4gICAgICBvdmVybGF5OiB0cnVlLFxuICAgICAgc3Bpbm5lcjogdHJ1ZSxcbiAgICAgIG5hdjogdHJ1ZSxcbiAgICAgIG5hdlRleHQ6IFsnJmxzYXF1bzsnLCAnJnJzYXF1bzsnXSxcbiAgICAgIGNhcHRpb25zOiB0cnVlLFxuICAgICAgY2FwdGlvbkRlbGF5OiAwLFxuICAgICAgY2FwdGlvblNlbGVjdG9yOiAnaW1nJyxcbiAgICAgIGNhcHRpb25UeXBlOiAnYXR0cicsXG4gICAgICBjYXB0aW9uc0RhdGE6ICd0aXRsZScsXG4gICAgICBjYXB0aW9uUG9zaXRpb246ICdib3R0b20nLFxuICAgICAgY2FwdGlvbkNsYXNzOiAnJyxcbiAgICAgIGNsb3NlOiB0cnVlLFxuICAgICAgY2xvc2VUZXh0OiAnJnRpbWVzOycsXG4gICAgICBzd2lwZUNsb3NlOiB0cnVlLFxuICAgICAgc2hvd0NvdW50ZXI6IHRydWUsXG4gICAgICBmaWxlRXh0OiAncG5nfGpwZ3xqcGVnfGdpZnx3ZWJwJyxcbiAgICAgIGFuaW1hdGlvblNsaWRlOiB0cnVlLFxuICAgICAgYW5pbWF0aW9uU3BlZWQ6IDI1MCxcbiAgICAgIHByZWxvYWRpbmc6IHRydWUsXG4gICAgICBlbmFibGVLZXlib2FyZDogdHJ1ZSxcbiAgICAgIGxvb3A6IHRydWUsXG4gICAgICByZWw6IGZhbHNlLFxuICAgICAgZG9jQ2xvc2U6IHRydWUsXG4gICAgICBzd2lwZVRvbGVyYW5jZTogNTAsXG4gICAgICBjbGFzc05hbWU6ICdzaW1wbGUtbGlnaHRib3gnLFxuICAgICAgd2lkdGhSYXRpbzogMC44LFxuICAgICAgaGVpZ2h0UmF0aW86IDAuOSxcbiAgICAgIHNjYWxlSW1hZ2VUb1JhdGlvOiBmYWxzZSxcbiAgICAgIGRpc2FibGVSaWdodENsaWNrOiBmYWxzZSxcbiAgICAgIGRpc2FibGVTY3JvbGw6IHRydWUsXG4gICAgICBhbGVydEVycm9yOiB0cnVlLFxuICAgICAgYWxlcnRFcnJvck1lc3NhZ2U6ICdJbWFnZSBub3QgZm91bmQsIG5leHQgaW1hZ2Ugd2lsbCBiZSBsb2FkZWQnLFxuICAgICAgYWRkaXRpb25hbEh0bWw6IGZhbHNlLFxuICAgICAgaGlzdG9yeTogdHJ1ZSxcbiAgICAgIHRocm90dGxlSW50ZXJ2YWw6IDAsXG4gICAgICBkb3VibGVUYXBab29tOiAyLFxuICAgICAgbWF4Wm9vbTogMTAsXG4gICAgICBodG1sQ2xhc3M6ICdoYXMtbGlnaHRib3gnLFxuICAgICAgcnRsOiBmYWxzZSxcbiAgICAgIGZpeGVkQ2xhc3M6ICdzbC1maXhlZCcsXG4gICAgICBmYWRlU3BlZWQ6IDMwMCxcbiAgICAgIHVuaXF1ZUltYWdlczogdHJ1ZSxcbiAgICAgIGZvY3VzOiB0cnVlLFxuICAgICAgc2Nyb2xsWm9vbTogdHJ1ZSxcbiAgICAgIHNjcm9sbFpvb21GYWN0b3I6IDAuNVxuICAgIH0pO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwidHJhbnNpdGlvblByZWZpeFwiLCB2b2lkIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaXNQYXNzaXZlRXZlbnRzU3VwcG9ydGVkXCIsIHZvaWQgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJ0cmFuc2l0aW9uQ2FwYWJsZVwiLCBmYWxzZSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJpc1RvdWNoRGV2aWNlXCIsICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJpc0FwcGxlRGV2aWNlXCIsIC8oTWFjfGlQaG9uZXxpUG9kfGlQYWQpL2kudGVzdChuYXZpZ2F0b3IucGxhdGZvcm0pKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImluaXRpYWxMb2NhdGlvbkhhc2hcIiwgdm9pZCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInB1c2hTdGF0ZVN1cHBvcnRcIiwgJ3B1c2hTdGF0ZScgaW4gaGlzdG9yeSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJpc09wZW5cIiwgZmFsc2UpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaXNBbmltYXRpbmdcIiwgZmFsc2UpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaXNDbG9zaW5nXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImlzRmFkZUluXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInVybENoYW5nZWRPbmNlXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImhhc2hSZXNldGVkXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImhpc3RvcnlIYXNDaGFuZ2VzXCIsIGZhbHNlKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImhpc3RvcnlVcGRhdGVUaW1lb3V0XCIsIG51bGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiY3VycmVudEltYWdlXCIsIHZvaWQgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJldmVudE5hbWVzcGFjZVwiLCAnc2ltcGxlbGlnaHRib3gnKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImRvbU5vZGVzXCIsIHt9KTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImxvYWRlZEltYWdlc1wiLCBbXSk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJpbml0aWFsSW1hZ2VJbmRleFwiLCAwKTtcblxuICAgIF9kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImN1cnJlbnRJbWFnZUluZGV4XCIsIDApO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiaW5pdGlhbFNlbGVjdG9yXCIsIG51bGwpO1xuXG4gICAgX2RlZmluZVByb3BlcnR5KHRoaXMsIFwiZ2xvYmFsU2Nyb2xsYmFyV2lkdGhcIiwgMCk7XG5cbiAgICBfZGVmaW5lUHJvcGVydHkodGhpcywgXCJjb250cm9sQ29vcmRpbmF0ZXNcIiwge1xuICAgICAgc3dpcGVEaWZmOiAwLFxuICAgICAgc3dpcGVZRGlmZjogMCxcbiAgICAgIHN3aXBlU3RhcnQ6IDAsXG4gICAgICBzd2lwZUVuZDogMCxcbiAgICAgIHN3aXBlWVN0YXJ0OiAwLFxuICAgICAgc3dpcGVZRW5kOiAwLFxuICAgICAgbW91c2Vkb3duOiBmYWxzZSxcbiAgICAgIGltYWdlTGVmdDogMCxcbiAgICAgIHpvb21lZDogZmFsc2UsXG4gICAgICBjb250YWluZXJIZWlnaHQ6IDAsXG4gICAgICBjb250YWluZXJXaWR0aDogMCxcbiAgICAgIGNvbnRhaW5lck9mZnNldFg6IDAsXG4gICAgICBjb250YWluZXJPZmZzZXRZOiAwLFxuICAgICAgaW1nSGVpZ2h0OiAwLFxuICAgICAgaW1nV2lkdGg6IDAsXG4gICAgICBjYXB0dXJlOiBmYWxzZSxcbiAgICAgIGluaXRpYWxPZmZzZXRYOiAwLFxuICAgICAgaW5pdGlhbE9mZnNldFk6IDAsXG4gICAgICBpbml0aWFsUG9pbnRlck9mZnNldFg6IDAsXG4gICAgICBpbml0aWFsUG9pbnRlck9mZnNldFk6IDAsXG4gICAgICBpbml0aWFsUG9pbnRlck9mZnNldFgyOiAwLFxuICAgICAgaW5pdGlhbFBvaW50ZXJPZmZzZXRZMjogMCxcbiAgICAgIGluaXRpYWxTY2FsZTogMSxcbiAgICAgIGluaXRpYWxQaW5jaERpc3RhbmNlOiAwLFxuICAgICAgcG9pbnRlck9mZnNldFg6IDAsXG4gICAgICBwb2ludGVyT2Zmc2V0WTogMCxcbiAgICAgIHBvaW50ZXJPZmZzZXRYMjogMCxcbiAgICAgIHBvaW50ZXJPZmZzZXRZMjogMCxcbiAgICAgIHRhcmdldE9mZnNldFg6IDAsXG4gICAgICB0YXJnZXRPZmZzZXRZOiAwLFxuICAgICAgdGFyZ2V0U2NhbGU6IDAsXG4gICAgICBwaW5jaE9mZnNldFg6IDAsXG4gICAgICBwaW5jaE9mZnNldFk6IDAsXG4gICAgICBsaW1pdE9mZnNldFg6IDAsXG4gICAgICBsaW1pdE9mZnNldFk6IDAsXG4gICAgICBzY2FsZURpZmZlcmVuY2U6IDAsXG4gICAgICB0YXJnZXRQaW5jaERpc3RhbmNlOiAwLFxuICAgICAgdG91Y2hDb3VudDogMCxcbiAgICAgIGRvdWJsZVRhcHBlZDogZmFsc2UsXG4gICAgICB0b3VjaG1vdmVDb3VudDogMFxuICAgIH0pO1xuXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih0aGlzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICB0aGlzLmlzUGFzc2l2ZUV2ZW50c1N1cHBvcnRlZCA9IHRoaXMuY2hlY2tQYXNzaXZlRXZlbnRzU3VwcG9ydCgpO1xuXG4gICAgaWYgKHR5cGVvZiBlbGVtZW50cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuaW5pdGlhbFNlbGVjdG9yID0gZWxlbWVudHM7XG4gICAgICB0aGlzLmVsZW1lbnRzID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGVsZW1lbnRzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWxlbWVudHMgPSB0eXBlb2YgZWxlbWVudHMubGVuZ3RoICE9PSAndW5kZWZpbmVkJyAmJiBlbGVtZW50cy5sZW5ndGggPiAwID8gQXJyYXkuZnJvbShlbGVtZW50cykgOiBbZWxlbWVudHNdO1xuICAgIH1cblxuICAgIHRoaXMucmVsYXRlZEVsZW1lbnRzID0gW107XG4gICAgdGhpcy50cmFuc2l0aW9uUHJlZml4ID0gdGhpcy5jYWxjdWxhdGVUcmFuc2l0aW9uUHJlZml4KCk7XG4gICAgdGhpcy50cmFuc2l0aW9uQ2FwYWJsZSA9IHRoaXMudHJhbnNpdGlvblByZWZpeCAhPT0gZmFsc2U7XG4gICAgdGhpcy5pbml0aWFsTG9jYXRpb25IYXNoID0gdGhpcy5oYXNoOyAvLyB0aGlzIHNob3VsZCBiZSBoYW5kbGVkIGJ5IGF0dHJpYnV0ZSBzZWxlY3RvciBJTUhPISA9PiAnYVtyZWw9YmxhXScuLi5cblxuICAgIGlmICh0aGlzLm9wdGlvbnMucmVsKSB7XG4gICAgICB0aGlzLmVsZW1lbnRzID0gdGhpcy5nZXRSZWxhdGVkKHRoaXMub3B0aW9ucy5yZWwpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9wdGlvbnMudW5pcXVlSW1hZ2VzKSB7XG4gICAgICB2YXIgaW1nQXJyID0gW107XG4gICAgICB0aGlzLmVsZW1lbnRzID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnRzKS5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHNyYyA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKF90aGlzLm9wdGlvbnMuc291cmNlQXR0cik7XG5cbiAgICAgICAgaWYgKGltZ0Fyci5pbmRleE9mKHNyYykgPT09IC0xKSB7XG4gICAgICAgICAgaW1nQXJyLnB1c2goc3JjKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuY3JlYXRlRG9tTm9kZXMoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xvc2UpIHtcbiAgICAgIHRoaXMuZG9tTm9kZXMud3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmRvbU5vZGVzLmNsb3NlQnV0dG9uKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLm5hdikge1xuICAgICAgdGhpcy5kb21Ob2Rlcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZG9tTm9kZXMubmF2aWdhdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zcGlubmVyKSB7XG4gICAgICB0aGlzLmRvbU5vZGVzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5kb21Ob2Rlcy5zcGlubmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5lbGVtZW50cywgJ2NsaWNrLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChfdGhpcy5pc1ZhbGlkTGluayhldmVudC5jdXJyZW50VGFyZ2V0KSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmIChfdGhpcy5pc0FuaW1hdGluZykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLmluaXRpYWxJbWFnZUluZGV4ID0gX3RoaXMuZWxlbWVudHMuaW5kZXhPZihldmVudC5jdXJyZW50VGFyZ2V0KTtcblxuICAgICAgICBfdGhpcy5vcGVuSW1hZ2UoZXZlbnQuY3VycmVudFRhcmdldCk7XG4gICAgICB9XG4gICAgfSk7IC8vIGNsb3NlIGFkZEV2ZW50TGlzdGVuZXIgY2xpY2sgYWRkRXZlbnRMaXN0ZW5lciBkb2NcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuZG9jQ2xvc2UpIHtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmRvbU5vZGVzLndyYXBwZXIsIFsnY2xpY2suJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICd0b3VjaHN0YXJ0LicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlXSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChfdGhpcy5pc09wZW4gJiYgZXZlbnQudGFyZ2V0ID09PSBldmVudC5jdXJyZW50VGFyZ2V0KSB7XG4gICAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSAvLyBkaXNhYmxlIHJpZ2h0Y2xpY2tcblxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlUmlnaHRDbGljaykge1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKGRvY3VtZW50LmJvZHksICdjb250ZXh0bWVudS4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoXCJzbC1pbWFnZVwiKSkge1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gLy8ga2V5Ym9hcmQtY29udHJvbFxuXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmVuYWJsZUtleWJvYXJkKSB7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQuYm9keSwgJ2tleXVwLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlLCB0aGlzLnRocm90dGxlKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBfdGhpcy5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVEaWZmID0gMDsgLy8ga2V5Ym9hcmQgY29udHJvbCBvbmx5IGlmIGxpZ2h0Ym94IGlzIG9wZW5cblxuICAgICAgICBpZiAoX3RoaXMuaXNBbmltYXRpbmcgJiYgZXZlbnQua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICAgIF90aGlzLmN1cnJlbnRJbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsICcnKTtcblxuICAgICAgICAgIF90aGlzLmlzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmNsb3NlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXMuaXNPcGVuKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgICAgICBfdGhpcy5jbG9zZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghX3RoaXMuaXNBbmltYXRpbmcgJiYgWydBcnJvd0xlZnQnLCAnQXJyb3dSaWdodCddLmluZGV4T2YoZXZlbnQua2V5KSA+IC0xKSB7XG4gICAgICAgICAgICBfdGhpcy5sb2FkSW1hZ2UoZXZlbnQua2V5ID09PSAnQXJyb3dSaWdodCcgPyAxIDogLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSwgdGhpcy5vcHRpb25zLnRocm90dGxlSW50ZXJ2YWwpKTtcbiAgICB9XG5cbiAgICB0aGlzLmFkZEV2ZW50cygpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKFNpbXBsZUxpZ2h0Ym94LCBbe1xuICAgIGtleTogXCJjaGVja1Bhc3NpdmVFdmVudHNTdXBwb3J0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNoZWNrUGFzc2l2ZUV2ZW50c1N1cHBvcnQoKSB7XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9FdmVudExpc3RlbmVyT3B0aW9ucy9ibG9iL2doLXBhZ2VzL2V4cGxhaW5lci5tZCNmZWF0dXJlLWRldGVjdGlvblxuICAgICAgLy8gVGVzdCB2aWEgYSBnZXR0ZXIgaW4gdGhlIG9wdGlvbnMgb2JqZWN0IHRvIHNlZSBpZiB0aGUgcGFzc2l2ZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZFxuICAgICAgdmFyIHN1cHBvcnRzUGFzc2l2ZSA9IGZhbHNlO1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgb3B0cyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ3Bhc3NpdmUnLCB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICBzdXBwb3J0c1Bhc3NpdmUgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidGVzdFBhc3NpdmVcIiwgbnVsbCwgb3B0cyk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwidGVzdFBhc3NpdmVcIiwgbnVsbCwgb3B0cyk7XG4gICAgICB9IGNhdGNoIChlKSB7fVxuXG4gICAgICByZXR1cm4gc3VwcG9ydHNQYXNzaXZlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjcmVhdGVEb21Ob2Rlc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVEb21Ob2RlcygpIHtcbiAgICAgIHRoaXMuZG9tTm9kZXMub3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5kb21Ob2Rlcy5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ3NsLW92ZXJsYXknKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMub3ZlcmxheS5kYXRhc2V0Lm9wYWNpdHlUYXJnZXQgPSBcIi43XCI7XG4gICAgICB0aGlzLmRvbU5vZGVzLmNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLmNsb3NlQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3NsLWNsb3NlJyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLmNsb3NlQnV0dG9uLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5jbG9zZVRleHQ7XG4gICAgICB0aGlzLmRvbU5vZGVzLnNwaW5uZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMuc3Bpbm5lci5jbGFzc0xpc3QuYWRkKCdzbC1zcGlubmVyJyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLnNwaW5uZXIuaW5uZXJIVE1MID0gJzxkaXY+PC9kaXY+JztcbiAgICAgIHRoaXMuZG9tTm9kZXMubmF2aWdhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5kb21Ob2Rlcy5uYXZpZ2F0aW9uLmNsYXNzTGlzdC5hZGQoJ3NsLW5hdmlnYXRpb24nKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMubmF2aWdhdGlvbi5pbm5lckhUTUwgPSBcIjxidXR0b24gY2xhc3M9XFxcInNsLXByZXZcXFwiPlwiLmNvbmNhdCh0aGlzLm9wdGlvbnMubmF2VGV4dFswXSwgXCI8L2J1dHRvbj48YnV0dG9uIGNsYXNzPVxcXCJzbC1uZXh0XFxcIj5cIikuY29uY2F0KHRoaXMub3B0aW9ucy5uYXZUZXh0WzFdLCBcIjwvYnV0dG9uPlwiKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMuY291bnRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgdGhpcy5kb21Ob2Rlcy5jb3VudGVyLmNsYXNzTGlzdC5hZGQoJ3NsLWNvdW50ZXInKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMuY291bnRlci5pbm5lckhUTUwgPSAnPHNwYW4gY2xhc3M9XCJzbC1jdXJyZW50XCI+PC9zcGFuPi88c3BhbiBjbGFzcz1cInNsLXRvdGFsXCI+PC9zcGFuPic7XG4gICAgICB0aGlzLmRvbU5vZGVzLmNhcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMuY2FwdGlvbi5jbGFzc0xpc3QuYWRkKCdzbC1jYXB0aW9uJywgJ3Bvcy0nICsgdGhpcy5vcHRpb25zLmNhcHRpb25Qb3NpdGlvbik7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FwdGlvbkNsYXNzKSB7XG4gICAgICAgIHRoaXMuZG9tTm9kZXMuY2FwdGlvbi5jbGFzc0xpc3QuYWRkKHRoaXMub3B0aW9ucy5jYXB0aW9uQ2xhc3MpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRvbU5vZGVzLmltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLmltYWdlLmNsYXNzTGlzdC5hZGQoJ3NsLWltYWdlJyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLndyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdzbC13cmFwcGVyJyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLndyYXBwZXIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMud3JhcHBlci5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnZGlhbG9nJyk7XG4gICAgICB0aGlzLmRvbU5vZGVzLndyYXBwZXIuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jbGFzc05hbWUpIHtcbiAgICAgICAgdGhpcy5kb21Ob2Rlcy53cmFwcGVyLmNsYXNzTGlzdC5hZGQodGhpcy5vcHRpb25zLmNsYXNzTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucnRsKSB7XG4gICAgICAgIHRoaXMuZG9tTm9kZXMud3JhcHBlci5jbGFzc0xpc3QuYWRkKCdzbC1kaXItcnRsJyk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRocm90dGxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIGxpbWl0KSB7XG4gICAgICB2YXIgaW5UaHJvdHRsZTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghaW5UaHJvdHRsZSkge1xuICAgICAgICAgIGZ1bmMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICBpblRocm90dGxlID0gdHJ1ZTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBpblRocm90dGxlID0gZmFsc2U7XG4gICAgICAgICAgfSwgbGltaXQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpc1ZhbGlkTGlua1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc1ZhbGlkTGluayhlbGVtZW50KSB7XG4gICAgICByZXR1cm4gIXRoaXMub3B0aW9ucy5maWxlRXh0IHx8IGVsZW1lbnQuZ2V0QXR0cmlidXRlKHRoaXMub3B0aW9ucy5zb3VyY2VBdHRyKSAmJiBuZXcgUmVnRXhwKCcoJyArIHRoaXMub3B0aW9ucy5maWxlRXh0ICsgJykkJywgJ2knKS50ZXN0KGVsZW1lbnQuZ2V0QXR0cmlidXRlKHRoaXMub3B0aW9ucy5zb3VyY2VBdHRyKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNhbGN1bGF0ZVRyYW5zaXRpb25QcmVmaXhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gY2FsY3VsYXRlVHJhbnNpdGlvblByZWZpeCgpIHtcbiAgICAgIHZhciBzID0gKGRvY3VtZW50LmJvZHkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5zdHlsZTtcbiAgICAgIHJldHVybiAndHJhbnNpdGlvbicgaW4gcyA/ICcnIDogJ1dlYmtpdFRyYW5zaXRpb24nIGluIHMgPyAnLXdlYmtpdC0nIDogJ01velRyYW5zaXRpb24nIGluIHMgPyAnLW1vei0nIDogJ09UcmFuc2l0aW9uJyBpbiBzID8gJy1vJyA6IGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0b2dnbGVTY3JvbGxiYXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9nZ2xlU2Nyb2xsYmFyKHR5cGUpIHtcbiAgICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IDA7XG4gICAgICB2YXIgZml4ZWRFbGVtZW50cyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgKyB0aGlzLm9wdGlvbnMuZml4ZWRDbGFzcykpO1xuXG4gICAgICBpZiAodHlwZSA9PT0gJ2hpZGUnKSB7XG4gICAgICAgIHZhciBmdWxsV2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblxuICAgICAgICBpZiAoIWZ1bGxXaW5kb3dXaWR0aCkge1xuICAgICAgICAgIHZhciBkb2N1bWVudEVsZW1lbnRSZWN0ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgIGZ1bGxXaW5kb3dXaWR0aCA9IGRvY3VtZW50RWxlbWVudFJlY3QucmlnaHQgLSBNYXRoLmFicyhkb2N1bWVudEVsZW1lbnRSZWN0LmxlZnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggPCBmdWxsV2luZG93V2lkdGggfHwgdGhpcy5pc0FwcGxlRGV2aWNlKSB7XG4gICAgICAgICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQgPSBwYXJzZUludChkb2N1bWVudC5ib2R5LnN0eWxlLnBhZGRpbmdSaWdodCB8fCAwLCAxMCk7XG4gICAgICAgICAgc2Nyb2xsRGl2LmNsYXNzTGlzdC5hZGQoJ3NsLXNjcm9sbGJhci1tZWFzdXJlJyk7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JvbGxEaXYpO1xuICAgICAgICAgIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KTtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmRhdGFzZXQub3JpZ2luYWxQYWRkaW5nUmlnaHQgPSBwYWRkaW5nUmlnaHQ7XG5cbiAgICAgICAgICBpZiAoc2Nyb2xsYmFyV2lkdGggPiAwIHx8IHNjcm9sbGJhcldpZHRoID09IDAgJiYgdGhpcy5pc0FwcGxlRGV2aWNlKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1zY3JvbGwnKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZ1JpZ2h0ICsgc2Nyb2xsYmFyV2lkdGggKyAncHgnO1xuICAgICAgICAgICAgZml4ZWRFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgIHZhciBhY3R1YWxQYWRkaW5nID0gZWxlbWVudC5zdHlsZS5wYWRkaW5nUmlnaHQ7XG4gICAgICAgICAgICAgIHZhciBjYWxjdWxhdGVkUGFkZGluZyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpWydwYWRkaW5nLXJpZ2h0J107XG4gICAgICAgICAgICAgIGVsZW1lbnQuZGF0YXNldC5vcmlnaW5hbFBhZGRpbmdSaWdodCA9IGFjdHVhbFBhZGRpbmc7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gXCJcIi5jb25jYXQocGFyc2VGbG9hdChjYWxjdWxhdGVkUGFkZGluZykgKyBzY3JvbGxiYXJXaWR0aCwgXCJweFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tc2Nyb2xsJyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0ID0gZG9jdW1lbnQuYm9keS5kYXRhc2V0Lm9yaWdpbmFsUGFkZGluZ1JpZ2h0O1xuICAgICAgICBmaXhlZEVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICB2YXIgcGFkZGluZyA9IGVsZW1lbnQuZGF0YXNldC5vcmlnaW5hbFBhZGRpbmdSaWdodDtcblxuICAgICAgICAgIGlmICh0eXBlb2YgcGFkZGluZyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ1JpZ2h0ID0gcGFkZGluZztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImNsb3NlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIGlmICghdGhpcy5pc09wZW4gfHwgdGhpcy5pc0FuaW1hdGluZyB8fCB0aGlzLmlzQ2xvc2luZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNDbG9zaW5nID0gdHJ1ZTtcbiAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5yZWxhdGVkRWxlbWVudHNbdGhpcy5jdXJyZW50SW1hZ2VJbmRleF07XG4gICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjbG9zZS5zaW1wbGVsaWdodGJveCcpKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oaXN0b3J5KSB7XG4gICAgICAgIHRoaXMuaGlzdG9yeUhhc0NoYW5nZXMgPSBmYWxzZTtcblxuICAgICAgICBpZiAoIXRoaXMuaGFzaFJlc2V0ZWQpIHtcbiAgICAgICAgICB0aGlzLnJlc2V0SGFzaCgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb2N1bWVudCwgJ2ZvY3VzaW4uJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpO1xuICAgICAgdGhpcy5mYWRlT3V0KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbC1pbWFnZSBpbWcsIC5zbC1vdmVybGF5LCAuc2wtY2xvc2UsIC5zbC1uYXZpZ2F0aW9uLCAuc2wtaW1hZ2UgLnNsLWNhcHRpb24sIC5zbC1jb3VudGVyJyksIHRoaXMub3B0aW9ucy5mYWRlU3BlZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKF90aGlzMi5vcHRpb25zLmRpc2FibGVTY3JvbGwpIHtcbiAgICAgICAgICBfdGhpczIudG9nZ2xlU2Nyb2xsYmFyKCdzaG93Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXMyLm9wdGlvbnMuaHRtbENsYXNzICYmIF90aGlzMi5vcHRpb25zLmh0bWxDbGFzcyAhPT0gJycpIHtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykuY2xhc3NMaXN0LnJlbW92ZShfdGhpczIub3B0aW9ucy5odG1sQ2xhc3MpO1xuICAgICAgICB9XG5cbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChfdGhpczIuZG9tTm9kZXMud3JhcHBlcik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoX3RoaXMyLmRvbU5vZGVzLm92ZXJsYXkpO1xuICAgICAgICBfdGhpczIuZG9tTm9kZXMuYWRkaXRpb25hbEh0bWwgPSBudWxsO1xuICAgICAgICBlbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjbG9zZWQuc2ltcGxlbGlnaHRib3gnKSk7XG4gICAgICAgIF90aGlzMi5pc0Nsb3NpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5jdXJyZW50SW1hZ2UgPSBudWxsO1xuICAgICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuaXNBbmltYXRpbmcgPSBmYWxzZTsgLy8gcmVzZXQgdG91Y2hjb250cm9sIGNvb3JkaW5hdGVzXG5cbiAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmNvbnRyb2xDb29yZGluYXRlcykge1xuICAgICAgICB0aGlzLmNvbnRyb2xDb29yZGluYXRlc1trZXldID0gMDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb250cm9sQ29vcmRpbmF0ZXMubW91c2Vkb3duID0gZmFsc2U7XG4gICAgICB0aGlzLmNvbnRyb2xDb29yZGluYXRlcy56b29tZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuY29udHJvbENvb3JkaW5hdGVzLmNhcHR1cmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSA9IHRoaXMubWluTWF4KDEsIDEsIHRoaXMub3B0aW9ucy5tYXhab29tKTtcbiAgICAgIHRoaXMuY29udHJvbENvb3JkaW5hdGVzLmRvdWJsZVRhcHBlZCA9IGZhbHNlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoYXNoXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJwcmVsb2FkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHByZWxvYWQoKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIGluZGV4ID0gdGhpcy5jdXJyZW50SW1hZ2VJbmRleCxcbiAgICAgICAgICBsZW5ndGggPSB0aGlzLnJlbGF0ZWRFbGVtZW50cy5sZW5ndGgsXG4gICAgICAgICAgbmV4dCA9IGluZGV4ICsgMSA8IDAgPyBsZW5ndGggLSAxIDogaW5kZXggKyAxID49IGxlbmd0aCAtIDEgPyAwIDogaW5kZXggKyAxLFxuICAgICAgICAgIHByZXYgPSBpbmRleCAtIDEgPCAwID8gbGVuZ3RoIC0gMSA6IGluZGV4IC0gMSA+PSBsZW5ndGggLSAxID8gMCA6IGluZGV4IC0gMSxcbiAgICAgICAgICBuZXh0SW1hZ2UgPSBuZXcgSW1hZ2UoKSxcbiAgICAgICAgICBwcmV2SW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgIG5leHRJbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBzcmMgPSBldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcblxuICAgICAgICBpZiAoX3RoaXMzLmxvYWRlZEltYWdlcy5pbmRleE9mKHNyYykgPT09IC0xKSB7XG4gICAgICAgICAgLy9pcyB0aGlzIGNvbmRpdGlvbiBldmVuIHJlcXVpcmVkLi4uIHNldHRpbmcgbXVsdGlwbGUgdGltZXMgd2lsbCBub3QgY2hhbmdlIHVzYWdlLi4uXG4gICAgICAgICAgX3RoaXMzLmxvYWRlZEltYWdlcy5wdXNoKHNyYyk7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczMucmVsYXRlZEVsZW1lbnRzW2luZGV4XS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbmV4dEltYWdlTG9hZGVkLicgKyBfdGhpczMuZXZlbnROYW1lc3BhY2UpKTtcbiAgICAgIH0pO1xuICAgICAgbmV4dEltYWdlLnNldEF0dHJpYnV0ZSgnc3JjJywgdGhpcy5yZWxhdGVkRWxlbWVudHNbbmV4dF0uZ2V0QXR0cmlidXRlKHRoaXMub3B0aW9ucy5zb3VyY2VBdHRyKSk7XG4gICAgICBwcmV2SW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgc3JjID0gZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnc3JjJyk7XG5cbiAgICAgICAgaWYgKF90aGlzMy5sb2FkZWRJbWFnZXMuaW5kZXhPZihzcmMpID09PSAtMSkge1xuICAgICAgICAgIF90aGlzMy5sb2FkZWRJbWFnZXMucHVzaChzcmMpO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMzLnJlbGF0ZWRFbGVtZW50c1tpbmRleF0uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3ByZXZJbWFnZUxvYWRlZC4nICsgX3RoaXMzLmV2ZW50TmFtZXNwYWNlKSk7XG4gICAgICB9KTtcbiAgICAgIHByZXZJbWFnZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIHRoaXMucmVsYXRlZEVsZW1lbnRzW3ByZXZdLmdldEF0dHJpYnV0ZSh0aGlzLm9wdGlvbnMuc291cmNlQXR0cikpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJsb2FkSW1hZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZEltYWdlKGRpcmVjdGlvbikge1xuICAgICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICAgIHZhciBzbGlkZURpcmVjdGlvbiA9IGRpcmVjdGlvbjtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5ydGwpIHtcbiAgICAgICAgZGlyZWN0aW9uID0gLWRpcmVjdGlvbjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWxhdGVkRWxlbWVudHNbdGhpcy5jdXJyZW50SW1hZ2VJbmRleF0uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ2NoYW5nZS4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSkpO1xuICAgICAgdGhpcy5yZWxhdGVkRWxlbWVudHNbdGhpcy5jdXJyZW50SW1hZ2VJbmRleF0uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoKGRpcmVjdGlvbiA9PT0gMSA/ICduZXh0JyA6ICdwcmV2JykgKyAnLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlKSk7XG4gICAgICB2YXIgbmV3SW5kZXggPSB0aGlzLmN1cnJlbnRJbWFnZUluZGV4ICsgZGlyZWN0aW9uO1xuXG4gICAgICBpZiAodGhpcy5pc0FuaW1hdGluZyB8fCAobmV3SW5kZXggPCAwIHx8IG5ld0luZGV4ID49IHRoaXMucmVsYXRlZEVsZW1lbnRzLmxlbmd0aCkgJiYgdGhpcy5vcHRpb25zLmxvb3AgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXJyZW50SW1hZ2VJbmRleCA9IG5ld0luZGV4IDwgMCA/IHRoaXMucmVsYXRlZEVsZW1lbnRzLmxlbmd0aCAtIDEgOiBuZXdJbmRleCA+IHRoaXMucmVsYXRlZEVsZW1lbnRzLmxlbmd0aCAtIDEgPyAwIDogbmV3SW5kZXg7XG4gICAgICB0aGlzLmRvbU5vZGVzLmNvdW50ZXIucXVlcnlTZWxlY3RvcignLnNsLWN1cnJlbnQnKS5pbm5lckhUTUwgPSB0aGlzLmN1cnJlbnRJbWFnZUluZGV4ICsgMTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5hbmltYXRpb25TbGlkZSkge1xuICAgICAgICB0aGlzLnNsaWRlKHRoaXMub3B0aW9ucy5hbmltYXRpb25TcGVlZCAvIDEwMDAsIC0xMDAgKiBzbGlkZURpcmVjdGlvbiAtIHRoaXMuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlRGlmZiArICdweCcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmZhZGVPdXQodGhpcy5kb21Ob2Rlcy5pbWFnZSwgdGhpcy5vcHRpb25zLmZhZGVTcGVlZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpczQuaXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgIGlmICghX3RoaXM0LmlzQ2xvc2luZykge1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBfdGhpczQucmVsYXRlZEVsZW1lbnRzW190aGlzNC5jdXJyZW50SW1hZ2VJbmRleF07XG5cbiAgICAgICAgICAgIF90aGlzNC5jdXJyZW50SW1hZ2Uuc2V0QXR0cmlidXRlKCdzcmMnLCBlbGVtZW50LmdldEF0dHJpYnV0ZShfdGhpczQub3B0aW9ucy5zb3VyY2VBdHRyKSk7XG5cbiAgICAgICAgICAgIGlmIChfdGhpczQubG9hZGVkSW1hZ2VzLmluZGV4T2YoZWxlbWVudC5nZXRBdHRyaWJ1dGUoX3RoaXM0Lm9wdGlvbnMuc291cmNlQXR0cikpID09PSAtMSkge1xuICAgICAgICAgICAgICBfdGhpczQuc2hvdyhfdGhpczQuZG9tTm9kZXMuc3Bpbm5lcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfdGhpczQuZG9tTm9kZXMuaW1hZ2UuY29udGFpbnMoX3RoaXM0LmRvbU5vZGVzLmNhcHRpb24pKSB7XG4gICAgICAgICAgICAgIF90aGlzNC5kb21Ob2Rlcy5pbWFnZS5yZW1vdmVDaGlsZChfdGhpczQuZG9tTm9kZXMuY2FwdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF90aGlzNC5hZGp1c3RJbWFnZShzbGlkZURpcmVjdGlvbik7XG5cbiAgICAgICAgICAgIGlmIChfdGhpczQub3B0aW9ucy5wcmVsb2FkaW5nKSBfdGhpczQucHJlbG9hZCgpO1xuICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXM0LmlzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJhZGp1c3RJbWFnZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGp1c3RJbWFnZShkaXJlY3Rpb24pIHtcbiAgICAgIHZhciBfdGhpczUgPSB0aGlzO1xuXG4gICAgICBpZiAoIXRoaXMuY3VycmVudEltYWdlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRtcEltYWdlID0gbmV3IEltYWdlKCksXG4gICAgICAgICAgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAqIHRoaXMub3B0aW9ucy53aWR0aFJhdGlvLFxuICAgICAgICAgIHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAqIHRoaXMub3B0aW9ucy5oZWlnaHRSYXRpbztcbiAgICAgIHRtcEltYWdlLnNldEF0dHJpYnV0ZSgnc3JjJywgdGhpcy5jdXJyZW50SW1hZ2UuZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZS5kYXRhc2V0LnNjYWxlID0gMTtcbiAgICAgIHRoaXMuY3VycmVudEltYWdlLmRhdGFzZXQudHJhbnNsYXRlWCA9IDA7XG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVkgPSAwO1xuICAgICAgdGhpcy56b29tUGFuRWxlbWVudCgwLCAwLCAxKTtcbiAgICAgIHRtcEltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIF90aGlzNS5yZWxhdGVkRWxlbWVudHNbX3RoaXM1LmN1cnJlbnRJbWFnZUluZGV4XS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnZXJyb3IuJyArIF90aGlzNS5ldmVudE5hbWVzcGFjZSkpO1xuXG4gICAgICAgIF90aGlzNS5pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICBfdGhpczUuaXNPcGVuID0gdHJ1ZTtcbiAgICAgICAgX3RoaXM1LmRvbU5vZGVzLnNwaW5uZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgdmFyIGRpcklzRGVmaW5lZCA9IGRpcmVjdGlvbiA9PT0gMSB8fCBkaXJlY3Rpb24gPT09IC0xO1xuXG4gICAgICAgIGlmIChfdGhpczUuaW5pdGlhbEltYWdlSW5kZXggPT09IF90aGlzNS5jdXJyZW50SW1hZ2VJbmRleCAmJiBkaXJJc0RlZmluZWQpIHtcbiAgICAgICAgICByZXR1cm4gX3RoaXM1LmNsb3NlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXM1Lm9wdGlvbnMuYWxlcnRFcnJvcikge1xuICAgICAgICAgIGFsZXJ0KF90aGlzNS5vcHRpb25zLmFsZXJ0RXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzNS5sb2FkSW1hZ2UoZGlySXNEZWZpbmVkID8gZGlyZWN0aW9uIDogMSk7XG4gICAgICB9KTtcbiAgICAgIHRtcEltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBkaXJlY3Rpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgX3RoaXM1LnJlbGF0ZWRFbGVtZW50c1tfdGhpczUuY3VycmVudEltYWdlSW5kZXhdLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdjaGFuZ2VkLicgKyBfdGhpczUuZXZlbnROYW1lc3BhY2UpKTtcblxuICAgICAgICAgIF90aGlzNS5yZWxhdGVkRWxlbWVudHNbX3RoaXM1LmN1cnJlbnRJbWFnZUluZGV4XS5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgoZGlyZWN0aW9uID09PSAxID8gJ25leHREb25lJyA6ICdwcmV2RG9uZScpICsgJy4nICsgX3RoaXM1LmV2ZW50TmFtZXNwYWNlKSk7XG4gICAgICAgIH0gLy8gaGlzdG9yeVxuXG5cbiAgICAgICAgaWYgKF90aGlzNS5vcHRpb25zLmhpc3RvcnkpIHtcbiAgICAgICAgICBfdGhpczUudXBkYXRlVVJMKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3RoaXM1LmxvYWRlZEltYWdlcy5pbmRleE9mKF90aGlzNS5jdXJyZW50SW1hZ2UuZ2V0QXR0cmlidXRlKCdzcmMnKSkgPT09IC0xKSB7XG4gICAgICAgICAgX3RoaXM1LmxvYWRlZEltYWdlcy5wdXNoKF90aGlzNS5jdXJyZW50SW1hZ2UuZ2V0QXR0cmlidXRlKCdzcmMnKSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW1hZ2VXaWR0aCA9IGV2ZW50LnRhcmdldC53aWR0aCxcbiAgICAgICAgICAgIGltYWdlSGVpZ2h0ID0gZXZlbnQudGFyZ2V0LmhlaWdodDtcblxuICAgICAgICBpZiAoX3RoaXM1Lm9wdGlvbnMuc2NhbGVJbWFnZVRvUmF0aW8gfHwgaW1hZ2VXaWR0aCA+IHdpbmRvd1dpZHRoIHx8IGltYWdlSGVpZ2h0ID4gd2luZG93SGVpZ2h0KSB7XG4gICAgICAgICAgdmFyIHJhdGlvID0gaW1hZ2VXaWR0aCAvIGltYWdlSGVpZ2h0ID4gd2luZG93V2lkdGggLyB3aW5kb3dIZWlnaHQgPyBpbWFnZVdpZHRoIC8gd2luZG93V2lkdGggOiBpbWFnZUhlaWdodCAvIHdpbmRvd0hlaWdodDtcbiAgICAgICAgICBpbWFnZVdpZHRoIC89IHJhdGlvO1xuICAgICAgICAgIGltYWdlSGVpZ2h0IC89IHJhdGlvO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXM1LmRvbU5vZGVzLmltYWdlLnN0eWxlLnRvcCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLSBpbWFnZUhlaWdodCkgLyAyICsgJ3B4JztcbiAgICAgICAgX3RoaXM1LmRvbU5vZGVzLmltYWdlLnN0eWxlLmxlZnQgPSAod2luZG93LmlubmVyV2lkdGggLSBpbWFnZVdpZHRoIC0gX3RoaXM1Lmdsb2JhbFNjcm9sbGJhcldpZHRoKSAvIDIgKyAncHgnO1xuICAgICAgICBfdGhpczUuZG9tTm9kZXMuaW1hZ2Uuc3R5bGUud2lkdGggPSBpbWFnZVdpZHRoICsgJ3B4JztcbiAgICAgICAgX3RoaXM1LmRvbU5vZGVzLmltYWdlLnN0eWxlLmhlaWdodCA9IGltYWdlSGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgX3RoaXM1LmRvbU5vZGVzLnNwaW5uZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgICAgICBpZiAoX3RoaXM1Lm9wdGlvbnMuZm9jdXMpIHtcbiAgICAgICAgICBfdGhpczUuZm9yY2VGb2N1cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXM1LmZhZGVJbihfdGhpczUuY3VycmVudEltYWdlLCBfdGhpczUub3B0aW9ucy5mYWRlU3BlZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoX3RoaXM1Lm9wdGlvbnMuZm9jdXMpIHtcbiAgICAgICAgICAgIF90aGlzNS5kb21Ob2Rlcy53cmFwcGVyLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBfdGhpczUuaXNPcGVuID0gdHJ1ZTtcbiAgICAgICAgdmFyIGNhcHRpb25Db250YWluZXIsIGNhcHRpb25UZXh0O1xuXG4gICAgICAgIGlmICh0eXBlb2YgX3RoaXM1Lm9wdGlvbnMuY2FwdGlvblNlbGVjdG9yID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGNhcHRpb25Db250YWluZXIgPSBfdGhpczUub3B0aW9ucy5jYXB0aW9uU2VsZWN0b3IgPT09ICdzZWxmJyA/IF90aGlzNS5yZWxhdGVkRWxlbWVudHNbX3RoaXM1LmN1cnJlbnRJbWFnZUluZGV4XSA6IF90aGlzNS5yZWxhdGVkRWxlbWVudHNbX3RoaXM1LmN1cnJlbnRJbWFnZUluZGV4XS5xdWVyeVNlbGVjdG9yKF90aGlzNS5vcHRpb25zLmNhcHRpb25TZWxlY3Rvcik7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIF90aGlzNS5vcHRpb25zLmNhcHRpb25TZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNhcHRpb25Db250YWluZXIgPSBfdGhpczUub3B0aW9ucy5jYXB0aW9uU2VsZWN0b3IoX3RoaXM1LnJlbGF0ZWRFbGVtZW50c1tfdGhpczUuY3VycmVudEltYWdlSW5kZXhdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfdGhpczUub3B0aW9ucy5jYXB0aW9ucyAmJiBjYXB0aW9uQ29udGFpbmVyKSB7XG4gICAgICAgICAgaWYgKF90aGlzNS5vcHRpb25zLmNhcHRpb25UeXBlID09PSAnZGF0YScpIHtcbiAgICAgICAgICAgIGNhcHRpb25UZXh0ID0gY2FwdGlvbkNvbnRhaW5lci5kYXRhc2V0W190aGlzNS5vcHRpb25zLmNhcHRpb25zRGF0YV07XG4gICAgICAgICAgfSBlbHNlIGlmIChfdGhpczUub3B0aW9ucy5jYXB0aW9uVHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBjYXB0aW9uVGV4dCA9IGNhcHRpb25Db250YWluZXIuaW5uZXJIVE1MO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYXB0aW9uVGV4dCA9IGNhcHRpb25Db250YWluZXIuZ2V0QXR0cmlidXRlKF90aGlzNS5vcHRpb25zLmNhcHRpb25zRGF0YSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFfdGhpczUub3B0aW9ucy5sb29wKSB7XG4gICAgICAgICAgaWYgKF90aGlzNS5jdXJyZW50SW1hZ2VJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgX3RoaXM1LmhpZGUoX3RoaXM1LmRvbU5vZGVzLm5hdmlnYXRpb24ucXVlcnlTZWxlY3RvcignLnNsLXByZXYnKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKF90aGlzNS5jdXJyZW50SW1hZ2VJbmRleCA+PSBfdGhpczUucmVsYXRlZEVsZW1lbnRzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIF90aGlzNS5oaWRlKF90aGlzNS5kb21Ob2Rlcy5uYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zbC1uZXh0JykpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChfdGhpczUuY3VycmVudEltYWdlSW5kZXggPiAwKSB7XG4gICAgICAgICAgICBfdGhpczUuc2hvdyhfdGhpczUuZG9tTm9kZXMubmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2wtcHJldicpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoX3RoaXM1LmN1cnJlbnRJbWFnZUluZGV4IDwgX3RoaXM1LnJlbGF0ZWRFbGVtZW50cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBfdGhpczUuc2hvdyhfdGhpczUuZG9tTm9kZXMubmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2wtbmV4dCcpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKF90aGlzNS5yZWxhdGVkRWxlbWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBfdGhpczUuaGlkZShfdGhpczUuZG9tTm9kZXMubmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuc2wtcHJldiwgLnNsLW5leHQnKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF90aGlzNS5zaG93KF90aGlzNS5kb21Ob2Rlcy5uYXZpZ2F0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zbC1wcmV2LCAuc2wtbmV4dCcpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAxIHx8IGRpcmVjdGlvbiA9PT0gLTEpIHtcbiAgICAgICAgICBpZiAoX3RoaXM1Lm9wdGlvbnMuYW5pbWF0aW9uU2xpZGUpIHtcbiAgICAgICAgICAgIF90aGlzNS5zbGlkZSgwLCAxMDAgKiBkaXJlY3Rpb24gKyAncHgnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIF90aGlzNS5zbGlkZShfdGhpczUub3B0aW9ucy5hbmltYXRpb25TcGVlZCAvIDEwMDAsIDAgKyAncHgnKTtcbiAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfdGhpczUuZmFkZUluKF90aGlzNS5kb21Ob2Rlcy5pbWFnZSwgX3RoaXM1Lm9wdGlvbnMuZmFkZVNwZWVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpczUuaXNBbmltYXRpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgX3RoaXM1LnNldENhcHRpb24oY2FwdGlvblRleHQsIGltYWdlV2lkdGgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF90aGlzNS5pc0FuaW1hdGluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgX3RoaXM1LnNldENhcHRpb24oY2FwdGlvblRleHQsIGltYWdlV2lkdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF90aGlzNS5vcHRpb25zLmFkZGl0aW9uYWxIdG1sICYmICFfdGhpczUuZG9tTm9kZXMuYWRkaXRpb25hbEh0bWwpIHtcbiAgICAgICAgICBfdGhpczUuZG9tTm9kZXMuYWRkaXRpb25hbEh0bWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICAgIF90aGlzNS5kb21Ob2Rlcy5hZGRpdGlvbmFsSHRtbC5jbGFzc0xpc3QuYWRkKCdzbC1hZGRpdGlvbmFsLWh0bWwnKTtcblxuICAgICAgICAgIF90aGlzNS5kb21Ob2Rlcy5hZGRpdGlvbmFsSHRtbC5pbm5lckhUTUwgPSBfdGhpczUub3B0aW9ucy5hZGRpdGlvbmFsSHRtbDtcblxuICAgICAgICAgIF90aGlzNS5kb21Ob2Rlcy5pbWFnZS5hcHBlbmRDaGlsZChfdGhpczUuZG9tTm9kZXMuYWRkaXRpb25hbEh0bWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiem9vbVBhbkVsZW1lbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gem9vbVBhbkVsZW1lbnQodGFyZ2V0T2Zmc2V0WCwgdGFyZ2V0T2Zmc2V0WSwgdGFyZ2V0U2NhbGUpIHtcbiAgICAgIHRoaXMuY3VycmVudEltYWdlLnN0eWxlW3RoaXMudHJhbnNpdGlvblByZWZpeCArICd0cmFuc2Zvcm0nXSA9ICd0cmFuc2xhdGUoJyArIHRhcmdldE9mZnNldFggKyAnLCcgKyB0YXJnZXRPZmZzZXRZICsgJykgc2NhbGUoJyArIHRhcmdldFNjYWxlICsgJyknO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJtaW5NYXhcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWluTWF4KHZhbHVlLCBtaW4sIG1heCkge1xuICAgICAgcmV0dXJuIHZhbHVlIDwgbWluID8gbWluIDogdmFsdWUgPiBtYXggPyBtYXggOiB2YWx1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2V0Wm9vbURhdGFcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0Wm9vbURhdGEoaW5pdGlhbFNjYWxlLCB0YXJnZXRPZmZzZXRYLCB0YXJnZXRPZmZzZXRZKSB7XG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZS5kYXRhc2V0LnNjYWxlID0gaW5pdGlhbFNjYWxlO1xuICAgICAgdGhpcy5jdXJyZW50SW1hZ2UuZGF0YXNldC50cmFuc2xhdGVYID0gdGFyZ2V0T2Zmc2V0WDtcbiAgICAgIHRoaXMuY3VycmVudEltYWdlLmRhdGFzZXQudHJhbnNsYXRlWSA9IHRhcmdldE9mZnNldFk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImhhc2hjaGFuZ2VIYW5kbGVyXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhhc2hjaGFuZ2VIYW5kbGVyKCkge1xuICAgICAgaWYgKHRoaXMuaXNPcGVuICYmIHRoaXMuaGFzaCA9PT0gdGhpcy5pbml0aWFsTG9jYXRpb25IYXNoKSB7XG4gICAgICAgIHRoaXMuaGFzaFJlc2V0ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImFkZEV2ZW50c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRFdmVudHMoKSB7XG4gICAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgICAgLy8gcmVzaXplL3Jlc3BvbnNpdmVcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdyZXNpemUuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAvL3RoaXMuYWRqdXN0SW1hZ2UuYmluZCh0aGlzKVxuICAgICAgICBpZiAoX3RoaXM2LmlzT3Blbikge1xuICAgICAgICAgIF90aGlzNi5hZGp1c3RJbWFnZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmRvbU5vZGVzLmNsb3NlQnV0dG9uLCBbJ2NsaWNrLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlLCAndG91Y2hzdGFydC4nICsgdGhpcy5ldmVudE5hbWVzcGFjZV0sIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGlzdG9yeSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpczYuYWRkRXZlbnRMaXN0ZW5lcih3aW5kb3csICdoYXNoY2hhbmdlLicgKyBfdGhpczYuZXZlbnROYW1lc3BhY2UsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKF90aGlzNi5pc09wZW4pIHtcbiAgICAgICAgICAgICAgX3RoaXM2Lmhhc2hjaGFuZ2VIYW5kbGVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIDQwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHRoaXMuZG9tTm9kZXMubmF2aWdhdGlvbi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYnV0dG9uJyksICdjbGljay4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICghZXZlbnQuY3VycmVudFRhcmdldC50YWdOYW1lLm1hdGNoKC9idXR0b24vaSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVEaWZmID0gMDtcblxuICAgICAgICBfdGhpczYubG9hZEltYWdlKGV2ZW50LmN1cnJlbnRUYXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzbC1uZXh0JykgPyAxIDogLTEpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2Nyb2xsWm9vbSkge1xuICAgICAgICB2YXIgc2NhbGUgPSAxO1xuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5kb21Ob2Rlcy5pbWFnZSwgWydtb3VzZXdoZWVsJywgJ0RPTU1vdXNlU2Nyb2xsJ10sIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLm1vdXNlZG93biB8fCBfdGhpczYuaXNBbmltYXRpbmcgfHwgX3RoaXM2LmlzQ2xvc2luZyB8fCAhX3RoaXM2LmlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVySGVpZ2h0ID09IDApIHtcbiAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVySGVpZ2h0ID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmRvbU5vZGVzLmltYWdlKS5oZWlnaHQ7XG4gICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lcldpZHRoID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmRvbU5vZGVzLmltYWdlKS53aWR0aDtcbiAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nSGVpZ2h0ID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmN1cnJlbnRJbWFnZSkuaGVpZ2h0O1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWdXaWR0aCA9IF90aGlzNi5nZXREaW1lbnNpb25zKF90aGlzNi5jdXJyZW50SW1hZ2UpLndpZHRoO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRYID0gX3RoaXM2LmRvbU5vZGVzLmltYWdlLm9mZnNldExlZnQ7XG4gICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lck9mZnNldFkgPSBfdGhpczYuZG9tTm9kZXMuaW1hZ2Uub2Zmc2V0VG9wO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WCA9IHBhcnNlRmxvYXQoX3RoaXM2LmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVgpO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WSA9IHBhcnNlRmxvYXQoX3RoaXM2LmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdmFyIGRlbHRhID0gZXZlbnQuZGVsdGEgfHwgZXZlbnQud2hlZWxEZWx0YTtcblxuICAgICAgICAgIGlmIChkZWx0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvL3dlIGFyZSBvbiBmaXJlZm94XG4gICAgICAgICAgICBkZWx0YSA9IGV2ZW50LmRldGFpbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkZWx0YSA9IE1hdGgubWF4KC0xLCBNYXRoLm1pbigxLCBkZWx0YSkpOyAvLyBjYXAgdGhlIGRlbHRhIHRvIFstMSwxXSBmb3IgY3Jvc3MgYnJvd3NlciBjb25zaXN0ZW5jeVxuICAgICAgICAgIC8vIGFwcGx5IHpvb21cblxuICAgICAgICAgIHNjYWxlICs9IGRlbHRhICogX3RoaXM2Lm9wdGlvbnMuc2Nyb2xsWm9vbUZhY3RvciAqIHNjYWxlO1xuICAgICAgICAgIHNjYWxlID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oX3RoaXM2Lm9wdGlvbnMubWF4Wm9vbSwgc2NhbGUpKTtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlID0gc2NhbGU7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5waW5jaE9mZnNldFggPSBldmVudC5wYWdlWDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBpbmNoT2Zmc2V0WSA9IGV2ZW50LnBhZ2VZO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRYID0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nV2lkdGggKiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCkgLyAyO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRZID0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nSGVpZ2h0ICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVySGVpZ2h0KSAvIDI7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zY2FsZURpZmZlcmVuY2UgPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsU2NhbGU7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWdXaWR0aCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgPD0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCA/IDAgOiBfdGhpczYubWluTWF4KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFggLSAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5waW5jaE9mZnNldFggLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lck9mZnNldFggLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lcldpZHRoIC8gMiAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFgpIC8gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnNjYWxlRGlmZmVyZW5jZSkgKiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnNjYWxlRGlmZmVyZW5jZSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFggKiAtMSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFgpO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nSGVpZ2h0ICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSA8PSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lckhlaWdodCA/IDAgOiBfdGhpczYubWluTWF4KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFkgLSAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5waW5jaE9mZnNldFkgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lck9mZnNldFkgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lckhlaWdodCAvIDIgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRZKSAvIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zY2FsZURpZmZlcmVuY2UpICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zY2FsZURpZmZlcmVuY2UsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRZICogLTEsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRZKTtcblxuICAgICAgICAgIF90aGlzNi56b29tUGFuRWxlbWVudChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFggKyBcInB4XCIsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WSArIFwicHhcIiwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSk7XG5cbiAgICAgICAgICBpZiAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSA+IDEpIHtcbiAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuem9vbWVkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKCFfdGhpczYuZG9tTm9kZXMuY2FwdGlvbi5zdHlsZS5vcGFjaXR5ICYmIF90aGlzNi5kb21Ob2Rlcy5jYXB0aW9uLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJykge1xuICAgICAgICAgICAgICBfdGhpczYuZmFkZU91dChfdGhpczYuZG9tTm9kZXMuY2FwdGlvbiwgX3RoaXM2Lm9wdGlvbnMuZmFkZVNwZWVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlID09PSAxKSB7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuem9vbWVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgaWYgKF90aGlzNi5kb21Ob2Rlcy5jYXB0aW9uLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJykge1xuICAgICAgICAgICAgICAgIF90aGlzNi5mYWRlSW4oX3RoaXM2LmRvbU5vZGVzLmNhcHRpb24sIF90aGlzNi5vcHRpb25zLmZhZGVTcGVlZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUGluY2hEaXN0YW5jZSA9IG51bGw7XG4gICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNhcHR1cmUgPSBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQaW5jaERpc3RhbmNlID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRQaW5jaERpc3RhbmNlO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZTtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRYID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFkgPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFk7XG5cbiAgICAgICAgICBfdGhpczYuc2V0Wm9vbURhdGEoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFkpO1xuXG4gICAgICAgICAgX3RoaXM2Lnpvb21QYW5FbGVtZW50KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WCArIFwicHhcIiwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZICsgXCJweFwiLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmRvbU5vZGVzLmltYWdlLCBbJ3RvdWNoc3RhcnQuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdtb3VzZWRvd24uJyArIHRoaXMuZXZlbnROYW1lc3BhY2VdLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC50YWdOYW1lID09PSAnQScgJiYgZXZlbnQudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ21vdXNlZG93bicpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRYID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WSA9IGV2ZW50LmNsaWVudFk7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJIZWlnaHQgPSBfdGhpczYuZ2V0RGltZW5zaW9ucyhfdGhpczYuZG9tTm9kZXMuaW1hZ2UpLmhlaWdodDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lcldpZHRoID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmRvbU5vZGVzLmltYWdlKS53aWR0aDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ0hlaWdodCA9IF90aGlzNi5nZXREaW1lbnNpb25zKF90aGlzNi5jdXJyZW50SW1hZ2UpLmhlaWdodDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ1dpZHRoID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmN1cnJlbnRJbWFnZSkud2lkdGg7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRYID0gX3RoaXM2LmRvbU5vZGVzLmltYWdlLm9mZnNldExlZnQ7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRZID0gX3RoaXM2LmRvbU5vZGVzLmltYWdlLm9mZnNldFRvcDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRYID0gcGFyc2VGbG9hdChfdGhpczYuY3VycmVudEltYWdlLmRhdGFzZXQudHJhbnNsYXRlWCk7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WSA9IHBhcnNlRmxvYXQoX3RoaXM2LmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVkpO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY2FwdHVyZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50b3VjaENvdW50ID0gZXZlbnQudG91Y2hlcy5sZW5ndGg7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFkgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFk7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJIZWlnaHQgPSBfdGhpczYuZ2V0RGltZW5zaW9ucyhfdGhpczYuZG9tTm9kZXMuaW1hZ2UpLmhlaWdodDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lcldpZHRoID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmRvbU5vZGVzLmltYWdlKS53aWR0aDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ0hlaWdodCA9IF90aGlzNi5nZXREaW1lbnNpb25zKF90aGlzNi5jdXJyZW50SW1hZ2UpLmhlaWdodDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ1dpZHRoID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmN1cnJlbnRJbWFnZSkud2lkdGg7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRYID0gX3RoaXM2LmRvbU5vZGVzLmltYWdlLm9mZnNldExlZnQ7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRZID0gX3RoaXM2LmRvbU5vZGVzLmltYWdlLm9mZnNldFRvcDtcblxuICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRvdWNoQ291bnQgPT09IDEpXG4gICAgICAgICAgICAvKiBTaW5nbGUgdG91Y2ggKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWYgKCFfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmRvdWJsZVRhcHBlZCkge1xuICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuZG91YmxlVGFwcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuZG91YmxlVGFwcGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSwgMzAwKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpczYuY3VycmVudEltYWdlLmNsYXNzTGlzdC5hZGQoJ3NsLXRyYW5zaXRpb24nKTtcblxuICAgICAgICAgICAgICAgIGlmICghX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy56b29tZWQpIHtcbiAgICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlID0gX3RoaXM2Lm9wdGlvbnMuZG91YmxlVGFwWm9vbTtcblxuICAgICAgICAgICAgICAgICAgX3RoaXM2LnNldFpvb21EYXRhKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlLCAwLCAwKTtcblxuICAgICAgICAgICAgICAgICAgX3RoaXM2Lnpvb21QYW5FbGVtZW50KDAgKyBcInB4XCIsIDAgKyBcInB4XCIsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlKTtcblxuICAgICAgICAgICAgICAgICAgaWYgKCFfdGhpczYuZG9tTm9kZXMuY2FwdGlvbi5zdHlsZS5vcGFjaXR5ICYmIF90aGlzNi5kb21Ob2Rlcy5jYXB0aW9uLnN0eWxlLmRpc3BsYXkgIT09ICdub25lJykge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczYuZmFkZU91dChfdGhpczYuZG9tTm9kZXMuY2FwdGlvbiwgX3RoaXM2Lm9wdGlvbnMuZmFkZVNwZWVkKTtcbiAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy56b29tZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSA9IDE7XG5cbiAgICAgICAgICAgICAgICAgIF90aGlzNi5zZXRab29tRGF0YShfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSwgMCwgMCk7XG5cbiAgICAgICAgICAgICAgICAgIF90aGlzNi56b29tUGFuRWxlbWVudCgwICsgXCJweFwiLCAwICsgXCJweFwiLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSk7XG5cbiAgICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuem9vbWVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoX3RoaXM2LmN1cnJlbnRJbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpczYuY3VycmVudEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3NsLXRyYW5zaXRpb24nKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFggPSBwYXJzZUZsb2F0KF90aGlzNi5jdXJyZW50SW1hZ2UuZGF0YXNldC50cmFuc2xhdGVYKTtcbiAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WSA9IHBhcnNlRmxvYXQoX3RoaXM2LmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRvdWNoQ291bnQgPT09IDIpXG4gICAgICAgICAgICAvKiBQaW5jaCAqL1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WDIgPSBldmVudC50b3VjaGVzWzFdLmNsaWVudFg7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRZMiA9IGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WTtcbiAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WCA9IHBhcnNlRmxvYXQoX3RoaXM2LmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVgpO1xuICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRZID0gcGFyc2VGbG9hdChfdGhpczYuY3VycmVudEltYWdlLmRhdGFzZXQudHJhbnNsYXRlWSk7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucGluY2hPZmZzZXRYID0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRYICsgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFgyKSAvIDI7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucGluY2hPZmZzZXRZID0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRZICsgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFkyKSAvIDI7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBpbmNoRGlzdGFuY2UgPSBNYXRoLnNxcnQoKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRYIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFgyKSAqIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WCAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRYMikgKyAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFkgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WTIpICogKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRZIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFkyKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNhcHR1cmUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubW91c2Vkb3duKSByZXR1cm4gdHJ1ZTtcblxuICAgICAgICBpZiAoX3RoaXM2LnRyYW5zaXRpb25DYXBhYmxlKSB7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWFnZUxlZnQgPSBwYXJzZUludChfdGhpczYuZG9tTm9kZXMuaW1hZ2Uuc3R5bGUubGVmdCwgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5tb3VzZWRvd24gPSB0cnVlO1xuICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlRGlmZiA9IDA7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVZRGlmZiA9IDA7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVTdGFydCA9IGV2ZW50LnBhZ2VYIHx8IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVZU3RhcnQgPSBldmVudC5wYWdlWSB8fCBldmVudC50b3VjaGVzWzBdLnBhZ2VZO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmRvbU5vZGVzLmltYWdlLCBbJ3RvdWNobW92ZS4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgJ21vdXNlbW92ZS4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgJ01TUG9pbnRlck1vdmUnXSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmICghX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5tb3VzZWRvd24pIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC50eXBlID09PSAndG91Y2htb3ZlJykge1xuICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNhcHR1cmUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBvaW50ZXJPZmZzZXRZID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudG91Y2hDb3VudCA9IGV2ZW50LnRvdWNoZXMubGVuZ3RoO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudG91Y2htb3ZlQ291bnQrKztcblxuICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRvdWNoQ291bnQgPiAxKVxuICAgICAgICAgICAgLyogUGluY2ggKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WDIgPSBldmVudC50b3VjaGVzWzFdLmNsaWVudFg7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFkyID0gZXZlbnQudG91Y2hlc1sxXS5jbGllbnRZO1xuICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFBpbmNoRGlzdGFuY2UgPSBNYXRoLnNxcnQoKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFggLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBvaW50ZXJPZmZzZXRYMikgKiAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WCAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFgyKSArIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBvaW50ZXJPZmZzZXRZIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WTIpICogKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFkgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBvaW50ZXJPZmZzZXRZMikpO1xuXG4gICAgICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQaW5jaERpc3RhbmNlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUGluY2hEaXN0YW5jZSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0UGluY2hEaXN0YW5jZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChNYXRoLmFicyhfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQaW5jaERpc3RhbmNlIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRQaW5jaERpc3RhbmNlKSA+PSAxKSB7XG4gICAgICAgICAgICAgICAgLyogSW5pdGlhbGl6ZSBoZWxwZXJzICovXG4gICAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSA9IF90aGlzNi5taW5NYXgoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRQaW5jaERpc3RhbmNlIC8gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUGluY2hEaXN0YW5jZSAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlLCAxLCBfdGhpczYub3B0aW9ucy5tYXhab29tKTtcbiAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WCA9IChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ1dpZHRoICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVyV2lkdGgpIC8gMjtcbiAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WSA9IChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ0hlaWdodCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lckhlaWdodCkgLyAyO1xuICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc2NhbGVEaWZmZXJlbmNlID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlO1xuICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WCA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nV2lkdGggKiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIDw9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVyV2lkdGggPyAwIDogX3RoaXM2Lm1pbk1heChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRYIC0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucGluY2hPZmZzZXRYIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRYIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCAvIDIgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRYKSAvIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zY2FsZURpZmZlcmVuY2UpICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zY2FsZURpZmZlcmVuY2UsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRYICogLTEsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRYKTtcbiAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFkgPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ0hlaWdodCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgPD0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJIZWlnaHQgPyAwIDogX3RoaXM2Lm1pbk1heChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRZIC0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucGluY2hPZmZzZXRZIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJPZmZzZXRZIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJIZWlnaHQgLyAyIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WSkgLyAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc2NhbGVEaWZmZXJlbmNlKSAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc2NhbGVEaWZmZXJlbmNlLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WSAqIC0xLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WSk7XG5cbiAgICAgICAgICAgICAgICBfdGhpczYuem9vbVBhbkVsZW1lbnQoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYICsgXCJweFwiLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFkgKyBcInB4XCIsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnpvb21lZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgIGlmICghX3RoaXM2LmRvbU5vZGVzLmNhcHRpb24uc3R5bGUub3BhY2l0eSAmJiBfdGhpczYuZG9tTm9kZXMuY2FwdGlvbi5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXM2LmZhZGVPdXQoX3RoaXM2LmRvbU5vZGVzLmNhcHRpb24sIF90aGlzNi5vcHRpb25zLmZhZGVTcGVlZCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUGluY2hEaXN0YW5jZSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0UGluY2hEaXN0YW5jZTtcbiAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGU7XG4gICAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WCA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WDtcbiAgICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRZID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFggPSAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWdXaWR0aCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lcldpZHRoKSAvIDI7XG4gICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WSA9IChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ0hlaWdodCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lckhlaWdodCkgLyAyO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWdXaWR0aCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgPD0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCA/IDAgOiBfdGhpczYubWluTWF4KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFggLSAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFggLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRYKSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFggKiAtMSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFgpO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWdIZWlnaHQgKiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIDw9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVySGVpZ2h0ID8gMCA6IF90aGlzNi5taW5NYXgoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WSAtIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WSAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFkpLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WSAqIC0xLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WSk7XG5cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyhfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFgpID09PSBNYXRoLmFicyhfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmxpbWl0T2Zmc2V0WCkpIHtcbiAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WCA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WDtcbiAgICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFggPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBvaW50ZXJPZmZzZXRYO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZKSA9PT0gTWF0aC5hYnMoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFkpKSB7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbE9mZnNldFkgPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFk7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRZID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3RoaXM2LnNldFpvb21EYXRhKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFgsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WSk7XG5cbiAgICAgICAgICAgIF90aGlzNi56b29tUGFuRWxlbWVudChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFggKyBcInB4XCIsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WSArIFwicHhcIiwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qIE1vdXNlIE1vdmUgaW1wbGVtZW50YXRpb24gKi9cblxuXG4gICAgICAgIGlmIChldmVudC50eXBlID09PSAnbW91c2Vtb3ZlJyAmJiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLm1vdXNlZG93bikge1xuICAgICAgICAgIGlmIChldmVudC50eXBlID09ICd0b3VjaG1vdmUnKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNhcHR1cmUgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WSA9IGV2ZW50LmNsaWVudFk7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRYID0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nV2lkdGggKiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlIC0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCkgLyAyO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRZID0gKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nSGVpZ2h0ICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSAtIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVySGVpZ2h0KSAvIDI7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbWdXaWR0aCAqIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0U2NhbGUgPD0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCA/IDAgOiBfdGhpczYubWluTWF4KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFggLSAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFggLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRYKSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFggKiAtMSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFgpO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WSA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nSGVpZ2h0ICogX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRTY2FsZSA8PSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lckhlaWdodCA/IDAgOiBfdGhpczYubWluTWF4KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMucG9pbnRlck9mZnNldFkgLSAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFkgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRZKSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFkgKiAtMSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFkpO1xuXG4gICAgICAgICAgaWYgKE1hdGguYWJzKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WCkgPT09IE1hdGguYWJzKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubGltaXRPZmZzZXRYKSkge1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsT2Zmc2V0WCA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WDtcbiAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRYID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5wb2ludGVyT2Zmc2V0WDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoTWF0aC5hYnMoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZKSA9PT0gTWF0aC5hYnMoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5saW1pdE9mZnNldFkpKSB7XG4gICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxPZmZzZXRZID0gX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZO1xuICAgICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsUG9pbnRlck9mZnNldFkgPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnBvaW50ZXJPZmZzZXRZO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF90aGlzNi5zZXRab29tRGF0YShfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRYLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldE9mZnNldFkpO1xuXG4gICAgICAgICAgX3RoaXM2Lnpvb21QYW5FbGVtZW50KF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WCArIFwicHhcIiwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZICsgXCJweFwiLCBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnRhcmdldFNjYWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy56b29tZWQpIHtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlRW5kID0gZXZlbnQucGFnZVggfHwgZXZlbnQudG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlWUVuZCA9IGV2ZW50LnBhZ2VZIHx8IGV2ZW50LnRvdWNoZXNbMF0ucGFnZVk7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zd2lwZURpZmYgPSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlU3RhcnQgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlRW5kO1xuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVZRGlmZiA9IF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVZU3RhcnQgLSBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlWUVuZDtcblxuICAgICAgICAgIGlmIChfdGhpczYub3B0aW9ucy5hbmltYXRpb25TbGlkZSkge1xuICAgICAgICAgICAgX3RoaXM2LnNsaWRlKDAsIC1fdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlRGlmZiArICdweCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5kb21Ob2Rlcy5pbWFnZSwgWyd0b3VjaGVuZC4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgJ21vdXNldXAuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICd0b3VjaGNhbmNlbC4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgJ21vdXNlbGVhdmUuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdwb2ludGVydXAnLCAncG9pbnRlcmNhbmNlbCcsICdNU1BvaW50ZXJVcCcsICdNU1BvaW50ZXJDYW5jZWwnXSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChfdGhpczYuaXNUb3VjaERldmljZSAmJiBldmVudC50eXBlID09PSAndG91Y2hlbmQnKSB7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50b3VjaENvdW50ID0gZXZlbnQudG91Y2hlcy5sZW5ndGg7XG5cbiAgICAgICAgICBpZiAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50b3VjaENvdW50ID09PSAwKVxuICAgICAgICAgICAgLyogTm8gdG91Y2ggKi9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLyogU2V0IGF0dHJpYnV0ZXMgKi9cbiAgICAgICAgICAgICAgaWYgKF90aGlzNi5jdXJyZW50SW1hZ2UpIHtcbiAgICAgICAgICAgICAgICBfdGhpczYuc2V0Wm9vbURhdGEoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsU2NhbGUsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMudGFyZ2V0T2Zmc2V0WCwgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50YXJnZXRPZmZzZXRZKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmIChfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSA9PT0gMSkge1xuICAgICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuem9vbWVkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoX3RoaXM2LmRvbU5vZGVzLmNhcHRpb24uc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICAgICAgICAgICAgICBfdGhpczYuZmFkZUluKF90aGlzNi5kb21Ob2Rlcy5jYXB0aW9uLCBfdGhpczYub3B0aW9ucy5mYWRlU3BlZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBpbmNoRGlzdGFuY2UgPSBudWxsO1xuICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNhcHR1cmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50b3VjaENvdW50ID09PSAxKVxuICAgICAgICAgICAgLyogU2luZ2xlIHRvdWNoICovXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRYID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WSA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy50b3VjaENvdW50ID4gMSlcbiAgICAgICAgICAgIC8qIFBpbmNoICovXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBpbmNoRGlzdGFuY2UgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMubW91c2Vkb3duKSB7XG4gICAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5tb3VzZWRvd24gPSBmYWxzZTtcbiAgICAgICAgICB2YXIgcG9zc2libGVEaXIgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKCFfdGhpczYub3B0aW9ucy5sb29wKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXM2LmN1cnJlbnRJbWFnZUluZGV4ID09PSAwICYmIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVEaWZmIDwgMCkge1xuICAgICAgICAgICAgICBwb3NzaWJsZURpciA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoX3RoaXM2LmN1cnJlbnRJbWFnZUluZGV4ID49IF90aGlzNi5yZWxhdGVkRWxlbWVudHMubGVuZ3RoIC0gMSAmJiBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLnN3aXBlRGlmZiA+IDApIHtcbiAgICAgICAgICAgICAgcG9zc2libGVEaXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoTWF0aC5hYnMoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zd2lwZURpZmYpID4gX3RoaXM2Lm9wdGlvbnMuc3dpcGVUb2xlcmFuY2UgJiYgcG9zc2libGVEaXIpIHtcbiAgICAgICAgICAgIF90aGlzNi5sb2FkSW1hZ2UoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zd2lwZURpZmYgPiAwID8gMSA6IC0xKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKF90aGlzNi5vcHRpb25zLmFuaW1hdGlvblNsaWRlKSB7XG4gICAgICAgICAgICBfdGhpczYuc2xpZGUoX3RoaXM2Lm9wdGlvbnMuYW5pbWF0aW9uU3BlZWQgLyAxMDAwLCAwICsgJ3B4Jyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKF90aGlzNi5vcHRpb25zLnN3aXBlQ2xvc2UgJiYgTWF0aC5hYnMoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5zd2lwZVlEaWZmKSA+IDUwICYmIE1hdGguYWJzKF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuc3dpcGVEaWZmKSA8IF90aGlzNi5vcHRpb25zLnN3aXBlVG9sZXJhbmNlKSB7XG4gICAgICAgICAgICBfdGhpczYuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHRoaXMuZG9tTm9kZXMuaW1hZ2UsIFsnZGJsY2xpY2snXSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChfdGhpczYuaXNUb3VjaERldmljZSkgcmV0dXJuO1xuICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxQb2ludGVyT2Zmc2V0WCA9IGV2ZW50LmNsaWVudFg7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFBvaW50ZXJPZmZzZXRZID0gZXZlbnQuY2xpZW50WTtcbiAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJIZWlnaHQgPSBfdGhpczYuZ2V0RGltZW5zaW9ucyhfdGhpczYuZG9tTm9kZXMuaW1hZ2UpLmhlaWdodDtcbiAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jb250YWluZXJXaWR0aCA9IF90aGlzNi5nZXREaW1lbnNpb25zKF90aGlzNi5kb21Ob2Rlcy5pbWFnZSkud2lkdGg7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW1nSGVpZ2h0ID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmN1cnJlbnRJbWFnZSkuaGVpZ2h0O1xuICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmltZ1dpZHRoID0gX3RoaXM2LmdldERpbWVuc2lvbnMoX3RoaXM2LmN1cnJlbnRJbWFnZSkud2lkdGg7XG4gICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuY29udGFpbmVyT2Zmc2V0WCA9IF90aGlzNi5kb21Ob2Rlcy5pbWFnZS5vZmZzZXRMZWZ0O1xuICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmNvbnRhaW5lck9mZnNldFkgPSBfdGhpczYuZG9tTm9kZXMuaW1hZ2Uub2Zmc2V0VG9wO1xuXG4gICAgICAgIF90aGlzNi5jdXJyZW50SW1hZ2UuY2xhc3NMaXN0LmFkZCgnc2wtdHJhbnNpdGlvbicpO1xuXG4gICAgICAgIGlmICghX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy56b29tZWQpIHtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSA9IF90aGlzNi5vcHRpb25zLmRvdWJsZVRhcFpvb207XG5cbiAgICAgICAgICBfdGhpczYuc2V0Wm9vbURhdGEoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsU2NhbGUsIDAsIDApO1xuXG4gICAgICAgICAgX3RoaXM2Lnpvb21QYW5FbGVtZW50KDAgKyBcInB4XCIsIDAgKyBcInB4XCIsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlKTtcblxuICAgICAgICAgIGlmICghX3RoaXM2LmRvbU5vZGVzLmNhcHRpb24uc3R5bGUub3BhY2l0eSAmJiBfdGhpczYuZG9tTm9kZXMuY2FwdGlvbi5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcbiAgICAgICAgICAgIF90aGlzNi5mYWRlT3V0KF90aGlzNi5kb21Ob2Rlcy5jYXB0aW9uLCBfdGhpczYub3B0aW9ucy5mYWRlU3BlZWQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuem9vbWVkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpczYuY29udHJvbENvb3JkaW5hdGVzLmluaXRpYWxTY2FsZSA9IDE7XG5cbiAgICAgICAgICBfdGhpczYuc2V0Wm9vbURhdGEoX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5pbml0aWFsU2NhbGUsIDAsIDApO1xuXG4gICAgICAgICAgX3RoaXM2Lnpvb21QYW5FbGVtZW50KDAgKyBcInB4XCIsIDAgKyBcInB4XCIsIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuaW5pdGlhbFNjYWxlKTtcblxuICAgICAgICAgIF90aGlzNi5jb250cm9sQ29vcmRpbmF0ZXMuem9vbWVkID0gZmFsc2U7XG5cbiAgICAgICAgICBpZiAoX3RoaXM2LmRvbU5vZGVzLmNhcHRpb24uc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICAgICAgICBfdGhpczYuZmFkZUluKF90aGlzNi5kb21Ob2Rlcy5jYXB0aW9uLCBfdGhpczYub3B0aW9ucy5mYWRlU3BlZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmIChfdGhpczYuY3VycmVudEltYWdlKSB7XG4gICAgICAgICAgICBfdGhpczYuY3VycmVudEltYWdlLmNsYXNzTGlzdC5yZW1vdmUoJ3NsLXRyYW5zaXRpb24nKTtcblxuICAgICAgICAgICAgX3RoaXM2LmN1cnJlbnRJbWFnZS5zdHlsZVtfdGhpczYudHJhbnNpdGlvblByZWZpeCArICd0cmFuc2Zvcm0tb3JpZ2luJ10gPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgX3RoaXM2LmNvbnRyb2xDb29yZGluYXRlcy5jYXB0dXJlID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldERpbWVuc2lvbnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0RGltZW5zaW9ucyhlbGVtZW50KSB7XG4gICAgICB2YXIgc3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCksXG4gICAgICAgICAgaGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAgICAgd2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoLFxuICAgICAgICAgIGJvcmRlclRvcFdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyVG9wV2lkdGgpLFxuICAgICAgICAgIGJvcmRlckJvdHRvbVdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyQm90dG9tV2lkdGgpLFxuICAgICAgICAgIHBhZGRpbmdUb3AgPSBwYXJzZUZsb2F0KHN0eWxlcy5wYWRkaW5nVG9wKSxcbiAgICAgICAgICBwYWRkaW5nQm90dG9tID0gcGFyc2VGbG9hdChzdHlsZXMucGFkZGluZ0JvdHRvbSksXG4gICAgICAgICAgYm9yZGVyTGVmdFdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyTGVmdFdpZHRoKSxcbiAgICAgICAgICBib3JkZXJSaWdodFdpZHRoID0gcGFyc2VGbG9hdChzdHlsZXMuYm9yZGVyUmlnaHRXaWR0aCksXG4gICAgICAgICAgcGFkZGluZ0xlZnQgPSBwYXJzZUZsb2F0KHN0eWxlcy5wYWRkaW5nTGVmdCksXG4gICAgICAgICAgcGFkZGluZ1JpZ2h0ID0gcGFyc2VGbG9hdChzdHlsZXMucGFkZGluZ1JpZ2h0KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlaWdodDogaGVpZ2h0IC0gYm9yZGVyQm90dG9tV2lkdGggLSBib3JkZXJUb3BXaWR0aCAtIHBhZGRpbmdUb3AgLSBwYWRkaW5nQm90dG9tLFxuICAgICAgICB3aWR0aDogd2lkdGggLSBib3JkZXJMZWZ0V2lkdGggLSBib3JkZXJSaWdodFdpZHRoIC0gcGFkZGluZ0xlZnQgLSBwYWRkaW5nUmlnaHRcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZUhhc2hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlSGFzaCgpIHtcbiAgICAgIHZhciBuZXdIYXNoID0gJ3BpZD0nICsgKHRoaXMuY3VycmVudEltYWdlSW5kZXggKyAxKSxcbiAgICAgICAgICBuZXdVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdICsgJyMnICsgbmV3SGFzaDtcbiAgICAgIHRoaXMuaGFzaFJlc2V0ZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMucHVzaFN0YXRlU3VwcG9ydCkge1xuICAgICAgICB3aW5kb3cuaGlzdG9yeVt0aGlzLmhpc3RvcnlIYXNDaGFuZ2VzID8gJ3JlcGxhY2VTdGF0ZScgOiAncHVzaFN0YXRlJ10oJycsIGRvY3VtZW50LnRpdGxlLCBuZXdVUkwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gd2hhdCBpcyB0aGUgYnJvd3NlciB0YXJnZXQgb2YgdGhpcz9cbiAgICAgICAgaWYgKHRoaXMuaGlzdG9yeUhhc0NoYW5nZXMpIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShuZXdVUkwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuaGlzdG9yeUhhc0NoYW5nZXMpIHtcbiAgICAgICAgdGhpcy51cmxDaGFuZ2VkT25jZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaGlzdG9yeUhhc0NoYW5nZXMgPSB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZXNldEhhc2hcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXRIYXNoKCkge1xuICAgICAgdGhpcy5oYXNoUmVzZXRlZCA9IHRydWU7XG5cbiAgICAgIGlmICh0aGlzLnVybENoYW5nZWRPbmNlKSB7XG4gICAgICAgIGhpc3RvcnkuYmFjaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMucHVzaFN0YXRlU3VwcG9ydCkge1xuICAgICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKCcnLCBkb2N1bWVudC50aXRsZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnJztcbiAgICAgICAgfVxuICAgICAgfSAvL1xuICAgICAgLy9pbiBjYXNlIGFuIGhpc3Rvcnkgb3BlcmF0aW9uIGlzIHN0aWxsIHBlbmRpbmdcblxuXG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5oaXN0b3J5VXBkYXRlVGltZW91dCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInVwZGF0ZVVSTFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVVUkwoKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5oaXN0b3J5VXBkYXRlVGltZW91dCk7XG5cbiAgICAgIGlmICghdGhpcy5oaXN0b3J5SGFzQ2hhbmdlcykge1xuICAgICAgICB0aGlzLnVwZGF0ZUhhc2goKTsgLy8gZmlyc3QgdGltZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5oaXN0b3J5VXBkYXRlVGltZW91dCA9IHNldFRpbWVvdXQodGhpcy51cGRhdGVIYXNoLmJpbmQodGhpcyksIDgwMCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNldENhcHRpb25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0Q2FwdGlvbihjYXB0aW9uVGV4dCwgaW1hZ2VXaWR0aCkge1xuICAgICAgdmFyIF90aGlzNyA9IHRoaXM7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2FwdGlvbnMgJiYgY2FwdGlvblRleHQgJiYgY2FwdGlvblRleHQgIT09ICcnICYmIHR5cGVvZiBjYXB0aW9uVGV4dCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB0aGlzLmhpZGUodGhpcy5kb21Ob2Rlcy5jYXB0aW9uKTtcbiAgICAgICAgdGhpcy5kb21Ob2Rlcy5jYXB0aW9uLnN0eWxlLndpZHRoID0gaW1hZ2VXaWR0aCArICdweCc7XG4gICAgICAgIHRoaXMuZG9tTm9kZXMuY2FwdGlvbi5pbm5lckhUTUwgPSBjYXB0aW9uVGV4dDtcbiAgICAgICAgdGhpcy5kb21Ob2Rlcy5pbWFnZS5hcHBlbmRDaGlsZCh0aGlzLmRvbU5vZGVzLmNhcHRpb24pO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpczcuZmFkZUluKF90aGlzNy5kb21Ob2Rlcy5jYXB0aW9uLCBfdGhpczcub3B0aW9ucy5mYWRlU3BlZWQpO1xuICAgICAgICB9LCB0aGlzLm9wdGlvbnMuY2FwdGlvbkRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwic2xpZGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2xpZGUoc3BlZWQsIHBvcykge1xuICAgICAgaWYgKCF0aGlzLnRyYW5zaXRpb25DYXBhYmxlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbU5vZGVzLmltYWdlLnN0eWxlLmxlZnQgPSBwb3M7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZG9tTm9kZXMuaW1hZ2Uuc3R5bGVbdGhpcy50cmFuc2l0aW9uUHJlZml4ICsgJ3RyYW5zZm9ybSddID0gJ3RyYW5zbGF0ZVgoJyArIHBvcyArICcpJztcbiAgICAgIHRoaXMuZG9tTm9kZXMuaW1hZ2Uuc3R5bGVbdGhpcy50cmFuc2l0aW9uUHJlZml4ICsgJ3RyYW5zaXRpb24nXSA9IHRoaXMudHJhbnNpdGlvblByZWZpeCArICd0cmFuc2Zvcm0gJyArIHNwZWVkICsgJ3MgbGluZWFyJztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZ2V0UmVsYXRlZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRSZWxhdGVkKHJlbCkge1xuICAgICAgdmFyIGVsZW1zO1xuXG4gICAgICBpZiAocmVsICYmIHJlbCAhPT0gZmFsc2UgJiYgcmVsICE9PSAnbm9mb2xsb3cnKSB7XG4gICAgICAgIGVsZW1zID0gQXJyYXkuZnJvbSh0aGlzLmVsZW1lbnRzKS5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3JlbCcpID09PSByZWw7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbXMgPSB0aGlzLmVsZW1lbnRzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZWxlbXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9wZW5JbWFnZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvcGVuSW1hZ2UoZWxlbWVudCkge1xuICAgICAgdmFyIF90aGlzOCA9IHRoaXM7XG5cbiAgICAgIGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ3Nob3cuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlU2Nyb2xsKSB7XG4gICAgICAgIHRoaXMuZ2xvYmFsU2Nyb2xsYmFyV2lkdGggPSB0aGlzLnRvZ2dsZVNjcm9sbGJhcignaGlkZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmh0bWxDbGFzcyAmJiB0aGlzLm9wdGlvbnMuaHRtbENsYXNzICE9PSAnJykge1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJykuY2xhc3NMaXN0LmFkZCh0aGlzLm9wdGlvbnMuaHRtbENsYXNzKTtcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbU5vZGVzLndyYXBwZXIpO1xuICAgICAgdGhpcy5kb21Ob2Rlcy53cmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuZG9tTm9kZXMuaW1hZ2UpO1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLm92ZXJsYXkpIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbU5vZGVzLm92ZXJsYXkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbGF0ZWRFbGVtZW50cyA9IHRoaXMuZ2V0UmVsYXRlZChlbGVtZW50LnJlbCk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0NvdW50ZXIpIHtcbiAgICAgICAgaWYgKHRoaXMucmVsYXRlZEVsZW1lbnRzLmxlbmd0aCA9PSAxICYmIHRoaXMuZG9tTm9kZXMud3JhcHBlci5jb250YWlucyh0aGlzLmRvbU5vZGVzLmNvdW50ZXIpKSB7XG4gICAgICAgICAgdGhpcy5kb21Ob2Rlcy53cmFwcGVyLnJlbW92ZUNoaWxkKHRoaXMuZG9tTm9kZXMuY291bnRlcik7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZWxhdGVkRWxlbWVudHMubGVuZ3RoID4gMSAmJiAhdGhpcy5kb21Ob2Rlcy53cmFwcGVyLmNvbnRhaW5zKHRoaXMuZG9tTm9kZXMuY291bnRlcikpIHtcbiAgICAgICAgICB0aGlzLmRvbU5vZGVzLndyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5kb21Ob2Rlcy5jb3VudGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmlzQW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuY3VycmVudEltYWdlSW5kZXggPSB0aGlzLnJlbGF0ZWRFbGVtZW50cy5pbmRleE9mKGVsZW1lbnQpO1xuICAgICAgdmFyIHRhcmdldFVSTCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKHRoaXMub3B0aW9ucy5zb3VyY2VBdHRyKTtcbiAgICAgIHRoaXMuY3VycmVudEltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgdGhpcy5jdXJyZW50SW1hZ2Uuc2V0QXR0cmlidXRlKCdzcmMnLCB0YXJnZXRVUkwpO1xuICAgICAgdGhpcy5jdXJyZW50SW1hZ2UuZGF0YXNldC5zY2FsZSA9IDE7XG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZS5kYXRhc2V0LnRyYW5zbGF0ZVggPSAwO1xuICAgICAgdGhpcy5jdXJyZW50SW1hZ2UuZGF0YXNldC50cmFuc2xhdGVZID0gMDtcblxuICAgICAgaWYgKHRoaXMubG9hZGVkSW1hZ2VzLmluZGV4T2YodGFyZ2V0VVJMKSA9PT0gLTEpIHtcbiAgICAgICAgdGhpcy5sb2FkZWRJbWFnZXMucHVzaCh0YXJnZXRVUkwpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRvbU5vZGVzLmltYWdlLmlubmVySFRNTCA9ICcnO1xuICAgICAgdGhpcy5kb21Ob2Rlcy5pbWFnZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpO1xuICAgICAgdGhpcy5kb21Ob2Rlcy5pbWFnZS5hcHBlbmRDaGlsZCh0aGlzLmN1cnJlbnRJbWFnZSk7XG4gICAgICB0aGlzLmZhZGVJbih0aGlzLmRvbU5vZGVzLm92ZXJsYXksIHRoaXMub3B0aW9ucy5mYWRlU3BlZWQpO1xuICAgICAgdGhpcy5mYWRlSW4oW3RoaXMuZG9tTm9kZXMuY291bnRlciwgdGhpcy5kb21Ob2Rlcy5uYXZpZ2F0aW9uLCB0aGlzLmRvbU5vZGVzLmNsb3NlQnV0dG9uXSwgdGhpcy5vcHRpb25zLmZhZGVTcGVlZCk7XG4gICAgICB0aGlzLnNob3codGhpcy5kb21Ob2Rlcy5zcGlubmVyKTtcbiAgICAgIHRoaXMuZG9tTm9kZXMuY291bnRlci5xdWVyeVNlbGVjdG9yKCcuc2wtY3VycmVudCcpLmlubmVySFRNTCA9IHRoaXMuY3VycmVudEltYWdlSW5kZXggKyAxO1xuICAgICAgdGhpcy5kb21Ob2Rlcy5jb3VudGVyLnF1ZXJ5U2VsZWN0b3IoJy5zbC10b3RhbCcpLmlubmVySFRNTCA9IHRoaXMucmVsYXRlZEVsZW1lbnRzLmxlbmd0aDtcbiAgICAgIHRoaXMuYWRqdXN0SW1hZ2UoKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wcmVsb2FkaW5nKSB7XG4gICAgICAgIHRoaXMucHJlbG9hZCgpO1xuICAgICAgfVxuXG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnc2hvd24uJyArIF90aGlzOC5ldmVudE5hbWVzcGFjZSkpO1xuICAgICAgfSwgdGhpcy5vcHRpb25zLmFuaW1hdGlvblNwZWVkKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZm9yY2VGb2N1c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmb3JjZUZvY3VzKCkge1xuICAgICAgdmFyIF90aGlzOSA9IHRoaXM7XG5cbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb2N1bWVudCwgJ2ZvY3VzaW4uJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKGRvY3VtZW50LCAnZm9jdXNpbi4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChkb2N1bWVudCAhPT0gZXZlbnQudGFyZ2V0ICYmIF90aGlzOS5kb21Ob2Rlcy53cmFwcGVyICE9PSBldmVudC50YXJnZXQgJiYgIV90aGlzOS5kb21Ob2Rlcy53cmFwcGVyLmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICBfdGhpczkuZG9tTm9kZXMud3JhcHBlci5mb2N1cygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IC8vIHV0aWxpdHlcblxuICB9LCB7XG4gICAga2V5OiBcImFkZEV2ZW50TGlzdGVuZXJcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcihlbGVtZW50cywgZXZlbnRzLCBjYWxsYmFjaywgb3B0cykge1xuICAgICAgZWxlbWVudHMgPSB0aGlzLndyYXAoZWxlbWVudHMpO1xuICAgICAgZXZlbnRzID0gdGhpcy53cmFwKGV2ZW50cyk7XG5cbiAgICAgIHZhciBfaXRlcmF0b3IgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihlbGVtZW50cyksXG4gICAgICAgICAgX3N0ZXA7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yLnMoKTsgIShfc3RlcCA9IF9pdGVyYXRvci5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcC52YWx1ZTtcblxuICAgICAgICAgIGlmICghZWxlbWVudC5uYW1lc3BhY2VzKSB7XG4gICAgICAgICAgICBlbGVtZW50Lm5hbWVzcGFjZXMgPSB7fTtcbiAgICAgICAgICB9IC8vIHNhdmUgdGhlIG5hbWVzcGFjZXMgYWRkRXZlbnRMaXN0ZW5lciB0aGUgRE9NIGVsZW1lbnQgaXRzZWxmXG5cblxuICAgICAgICAgIHZhciBfaXRlcmF0b3IyID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoZXZlbnRzKSxcbiAgICAgICAgICAgICAgX3N0ZXAyO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yMi5zKCk7ICEoX3N0ZXAyID0gX2l0ZXJhdG9yMi5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBldmVudCA9IF9zdGVwMi52YWx1ZTtcbiAgICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSBvcHRzIHx8IGZhbHNlO1xuICAgICAgICAgICAgICB2YXIgbmVlZHNQYXNzaXZlRml4ID0gWyd0b3VjaHN0YXJ0JywgJ3RvdWNobW92ZSddLmluZGV4T2YoZXZlbnQuc3BsaXQoJy4nKVswXSkgPj0gMDtcblxuICAgICAgICAgICAgICBpZiAobmVlZHNQYXNzaXZlRml4ICYmIHRoaXMuaXNQYXNzaXZlRXZlbnRzU3VwcG9ydGVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKF90eXBlb2Yob3B0aW9ucykgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICBvcHRpb25zLnBhc3NpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBwYXNzaXZlOiB0cnVlXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGVsZW1lbnQubmFtZXNwYWNlc1tldmVudF0gPSBjYWxsYmFjaztcbiAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LnNwbGl0KCcuJylbMF0sIGNhbGxiYWNrLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjIuZShlcnIpO1xuICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IyLmYoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yLmYoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVyKGVsZW1lbnRzLCBldmVudHMpIHtcbiAgICAgIGVsZW1lbnRzID0gdGhpcy53cmFwKGVsZW1lbnRzKTtcbiAgICAgIGV2ZW50cyA9IHRoaXMud3JhcChldmVudHMpO1xuXG4gICAgICB2YXIgX2l0ZXJhdG9yMyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKGVsZW1lbnRzKSxcbiAgICAgICAgICBfc3RlcDM7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMy5zKCk7ICEoX3N0ZXAzID0gX2l0ZXJhdG9yMy5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcDMudmFsdWU7XG5cbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yNCA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKGV2ZW50cyksXG4gICAgICAgICAgICAgIF9zdGVwNDtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKF9pdGVyYXRvcjQucygpOyAhKF9zdGVwNCA9IF9pdGVyYXRvcjQubigpKS5kb25lOykge1xuICAgICAgICAgICAgICB2YXIgZXZlbnQgPSBfc3RlcDQudmFsdWU7XG5cbiAgICAgICAgICAgICAgaWYgKGVsZW1lbnQubmFtZXNwYWNlcyAmJiBlbGVtZW50Lm5hbWVzcGFjZXNbZXZlbnRdKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LnNwbGl0KCcuJylbMF0sIGVsZW1lbnQubmFtZXNwYWNlc1tldmVudF0pO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50Lm5hbWVzcGFjZXNbZXZlbnRdO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfaXRlcmF0b3I0LmUoZXJyKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgX2l0ZXJhdG9yNC5mKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yMy5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IzLmYoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZmFkZU91dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmYWRlT3V0KGVsZW1lbnRzLCBkdXJhdGlvbiwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpczEwID0gdGhpcztcblxuICAgICAgZWxlbWVudHMgPSB0aGlzLndyYXAoZWxlbWVudHMpO1xuXG4gICAgICB2YXIgX2l0ZXJhdG9yNSA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKGVsZW1lbnRzKSxcbiAgICAgICAgICBfc3RlcDU7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yNS5zKCk7ICEoX3N0ZXA1ID0gX2l0ZXJhdG9yNS5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcDUudmFsdWU7XG4gICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjUuZShlcnIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgX2l0ZXJhdG9yNS5mKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNGYWRlSW4gPSBmYWxzZTtcblxuICAgICAgdmFyIHN0ZXAgPSAxNi42NjY2NiAvIChkdXJhdGlvbiB8fCB0aGlzLm9wdGlvbnMuZmFkZVNwZWVkKSxcbiAgICAgICAgICBmYWRlID0gZnVuY3Rpb24gZmFkZSgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRPcGFjaXR5ID0gcGFyc2VGbG9hdChlbGVtZW50c1swXS5zdHlsZS5vcGFjaXR5KTtcblxuICAgICAgICBpZiAoKGN1cnJlbnRPcGFjaXR5IC09IHN0ZXApIDwgMCkge1xuICAgICAgICAgIHZhciBfaXRlcmF0b3I2ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoZWxlbWVudHMpLFxuICAgICAgICAgICAgICBfc3RlcDY7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChfaXRlcmF0b3I2LnMoKTsgIShfc3RlcDYgPSBfaXRlcmF0b3I2Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcDYudmFsdWU7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiOyAvLyBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnJztcblxuICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgX2l0ZXJhdG9yNi5lKGVycik7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjYuZigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrLmNhbGwoX3RoaXMxMCwgZWxlbWVudHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBfaXRlcmF0b3I3ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoZWxlbWVudHMpLFxuICAgICAgICAgICAgICBfc3RlcDc7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChfaXRlcmF0b3I3LnMoKTsgIShfc3RlcDcgPSBfaXRlcmF0b3I3Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgdmFyIF9lbGVtZW50ID0gX3N0ZXA3LnZhbHVlO1xuICAgICAgICAgICAgICBfZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gY3VycmVudE9wYWNpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfaXRlcmF0b3I3LmUoZXJyKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgX2l0ZXJhdG9yNy5mKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZhZGUpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmYWRlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImZhZGVJblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBmYWRlSW4oZWxlbWVudHMsIGR1cmF0aW9uLCBjYWxsYmFjaywgZGlzcGxheSkge1xuICAgICAgdmFyIF90aGlzMTEgPSB0aGlzO1xuXG4gICAgICBlbGVtZW50cyA9IHRoaXMud3JhcChlbGVtZW50cyk7XG5cbiAgICAgIHZhciBfaXRlcmF0b3I4ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoZWxlbWVudHMpLFxuICAgICAgICAgIF9zdGVwODtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3I4LnMoKTsgIShfc3RlcDggPSBfaXRlcmF0b3I4Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgZWxlbWVudCA9IF9zdGVwOC52YWx1ZTtcbiAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXkgfHwgXCJibG9ja1wiO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgX2l0ZXJhdG9yOC5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3I4LmYoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pc0ZhZGVJbiA9IHRydWU7XG5cbiAgICAgIHZhciBvcGFjaXR5VGFyZ2V0ID0gcGFyc2VGbG9hdChlbGVtZW50c1swXS5kYXRhc2V0Lm9wYWNpdHlUYXJnZXQgfHwgMSksXG4gICAgICAgICAgc3RlcCA9IDE2LjY2NjY2ICogb3BhY2l0eVRhcmdldCAvIChkdXJhdGlvbiB8fCB0aGlzLm9wdGlvbnMuZmFkZVNwZWVkKSxcbiAgICAgICAgICBmYWRlID0gZnVuY3Rpb24gZmFkZSgpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRPcGFjaXR5ID0gcGFyc2VGbG9hdChlbGVtZW50c1swXS5zdHlsZS5vcGFjaXR5KTtcblxuICAgICAgICBpZiAoISgoY3VycmVudE9wYWNpdHkgKz0gc3RlcCkgPiBvcGFjaXR5VGFyZ2V0KSkge1xuICAgICAgICAgIHZhciBfaXRlcmF0b3I5ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoZWxlbWVudHMpLFxuICAgICAgICAgICAgICBfc3RlcDk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChfaXRlcmF0b3I5LnMoKTsgIShfc3RlcDkgPSBfaXRlcmF0b3I5Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcDkudmFsdWU7XG4gICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IGN1cnJlbnRPcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgX2l0ZXJhdG9yOS5lKGVycik7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjkuZigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghX3RoaXMxMS5pc0ZhZGVJbikgcmV0dXJuO1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmYWRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yMTAgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihlbGVtZW50cyksXG4gICAgICAgICAgICAgIF9zdGVwMTA7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChfaXRlcmF0b3IxMC5zKCk7ICEoX3N0ZXAxMCA9IF9pdGVyYXRvcjEwLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgdmFyIF9lbGVtZW50MiA9IF9zdGVwMTAudmFsdWU7XG4gICAgICAgICAgICAgIF9lbGVtZW50Mi5zdHlsZS5vcGFjaXR5ID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBfaXRlcmF0b3IxMC5lKGVycik7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjEwLmYoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjay5jYWxsKF90aGlzMTEsIGVsZW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZmFkZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJoaWRlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhpZGUoZWxlbWVudHMpIHtcbiAgICAgIGVsZW1lbnRzID0gdGhpcy53cmFwKGVsZW1lbnRzKTtcblxuICAgICAgdmFyIF9pdGVyYXRvcjExID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIoZWxlbWVudHMpLFxuICAgICAgICAgIF9zdGVwMTE7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMTEucygpOyAhKF9zdGVwMTEgPSBfaXRlcmF0b3IxMS5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcDExLnZhbHVlO1xuXG4gICAgICAgICAgaWYgKGVsZW1lbnQuc3R5bGUuZGlzcGxheSAhPSAnbm9uZScpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuZGF0YXNldC5pbml0aWFsRGlzcGxheSA9IGVsZW1lbnQuc3R5bGUuZGlzcGxheTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBfaXRlcmF0b3IxMS5lKGVycik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBfaXRlcmF0b3IxMS5mKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInNob3dcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2hvdyhlbGVtZW50cywgZGlzcGxheSkge1xuICAgICAgZWxlbWVudHMgPSB0aGlzLndyYXAoZWxlbWVudHMpO1xuXG4gICAgICB2YXIgX2l0ZXJhdG9yMTIgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihlbGVtZW50cyksXG4gICAgICAgICAgX3N0ZXAxMjtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IxMi5zKCk7ICEoX3N0ZXAxMiA9IF9pdGVyYXRvcjEyLm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgZWxlbWVudCA9IF9zdGVwMTIudmFsdWU7XG4gICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gZWxlbWVudC5kYXRhc2V0LmluaXRpYWxEaXNwbGF5IHx8IGRpc3BsYXkgfHwgJ2Jsb2NrJztcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjEyLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjEyLmYoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwid3JhcFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3cmFwKGlucHV0KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGlucHV0W1N5bWJvbC5pdGVyYXRvcl0gPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGlucHV0ICE9PSAnc3RyaW5nJyA/IGlucHV0IDogW2lucHV0XTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwib25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb24oZXZlbnRzLCBjYWxsYmFjaykge1xuICAgICAgZXZlbnRzID0gdGhpcy53cmFwKGV2ZW50cyk7XG5cbiAgICAgIHZhciBfaXRlcmF0b3IxMyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyKHRoaXMuZWxlbWVudHMpLFxuICAgICAgICAgIF9zdGVwMTM7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGZvciAoX2l0ZXJhdG9yMTMucygpOyAhKF9zdGVwMTMgPSBfaXRlcmF0b3IxMy5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgdmFyIGVsZW1lbnQgPSBfc3RlcDEzLnZhbHVlO1xuXG4gICAgICAgICAgaWYgKCFlbGVtZW50LmZ1bGx5TmFtZXNwYWNlZEV2ZW50cykge1xuICAgICAgICAgICAgZWxlbWVudC5mdWxseU5hbWVzcGFjZWRFdmVudHMgPSB7fTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yMTQgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihldmVudHMpLFxuICAgICAgICAgICAgICBfc3RlcDE0O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yMTQucygpOyAhKF9zdGVwMTQgPSBfaXRlcmF0b3IxNC5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBldmVudCA9IF9zdGVwMTQudmFsdWU7XG4gICAgICAgICAgICAgIGVsZW1lbnQuZnVsbHlOYW1lc3BhY2VkRXZlbnRzW2V2ZW50XSA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjE0LmUoZXJyKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgX2l0ZXJhdG9yMTQuZigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjEzLmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjEzLmYoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIm9mZlwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvZmYoZXZlbnRzKSB7XG4gICAgICBldmVudHMgPSB0aGlzLndyYXAoZXZlbnRzKTtcblxuICAgICAgdmFyIF9pdGVyYXRvcjE1ID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIodGhpcy5lbGVtZW50cyksXG4gICAgICAgICAgX3N0ZXAxNTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChfaXRlcmF0b3IxNS5zKCk7ICEoX3N0ZXAxNSA9IF9pdGVyYXRvcjE1Lm4oKSkuZG9uZTspIHtcbiAgICAgICAgICB2YXIgZWxlbWVudCA9IF9zdGVwMTUudmFsdWU7XG5cbiAgICAgICAgICB2YXIgX2l0ZXJhdG9yMTYgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlcihldmVudHMpLFxuICAgICAgICAgICAgICBfc3RlcDE2O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoX2l0ZXJhdG9yMTYucygpOyAhKF9zdGVwMTYgPSBfaXRlcmF0b3IxNi5uKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciBldmVudCA9IF9zdGVwMTYudmFsdWU7XG5cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlbGVtZW50LmZ1bGx5TmFtZXNwYWNlZEV2ZW50cyAhPT0gJ3VuZGVmaW5lZCcgJiYgZXZlbnQgaW4gZWxlbWVudC5mdWxseU5hbWVzcGFjZWRFdmVudHMpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGVsZW1lbnQuZnVsbHlOYW1lc3BhY2VkRXZlbnRzW2V2ZW50XSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIF9pdGVyYXRvcjE2LmUoZXJyKTtcbiAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgX2l0ZXJhdG9yMTYuZigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIF9pdGVyYXRvcjE1LmUoZXJyKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIF9pdGVyYXRvcjE1LmYoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSAvLyBhcGlcblxuICB9LCB7XG4gICAga2V5OiBcIm9wZW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb3BlbihlbGVtKSB7XG4gICAgICBlbGVtID0gZWxlbSB8fCB0aGlzLmVsZW1lbnRzWzBdO1xuXG4gICAgICBpZiAodHlwZW9mIGpRdWVyeSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlbGVtIGluc3RhbmNlb2YgalF1ZXJ5KSB7XG4gICAgICAgIGVsZW0gPSBlbGVtLmdldCgwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbml0aWFsSW1hZ2VJbmRleCA9IHRoaXMuZWxlbWVudHMuaW5kZXhPZihlbGVtKTtcblxuICAgICAgaWYgKHRoaXMuaW5pdGlhbEltYWdlSW5kZXggPiAtMSkge1xuICAgICAgICB0aGlzLm9wZW5JbWFnZShlbGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibmV4dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgdGhpcy5sb2FkSW1hZ2UoMSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInByZXZcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJldigpIHtcbiAgICAgIHRoaXMubG9hZEltYWdlKC0xKTtcbiAgICB9IC8vIGdldCBzb21lIHVzZWZ1bCBkYXRhXG5cbiAgfSwge1xuICAgIGtleTogXCJnZXRMaWdoYm94RGF0YVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRMaWdoYm94RGF0YSgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGN1cnJlbnRJbWFnZUluZGV4OiB0aGlzLmN1cnJlbnRJbWFnZUluZGV4LFxuICAgICAgICBjdXJyZW50SW1hZ2U6IHRoaXMuY3VycmVudEltYWdlLFxuICAgICAgICBnbG9iYWxTY3JvbGxiYXJXaWR0aDogdGhpcy5nbG9iYWxTY3JvbGxiYXJXaWR0aFxuICAgICAgfTtcbiAgICB9IC8vY2xvc2UgaXMgZXhwb3NlZCBhbnl3YXlzLi5cblxuICB9LCB7XG4gICAga2V5OiBcImRlc3Ryb3lcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgIC8vcmVtb3ZlIGFsbCBjdXN0b20gZXZlbnQgbGlzdGVuZXJzIGZyb20gZWxlbWVudHNcbiAgICAgIHRoaXMub2ZmKFsnY2xvc2UuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdjbG9zZWQuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICduZXh0SW1hZ2VMb2FkZWQuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdwcmV2SW1hZ2VMb2FkZWQuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdjaGFuZ2UuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICduZXh0RG9uZS4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgJ3ByZXZEb25lLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlLCAnZXJyb3IuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdjaGFuZ2VkLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlLCAnbmV4dC4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSwgJ3ByZXYuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UsICdzaG93LicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlLCAnc2hvd24uJyArIHRoaXMuZXZlbnROYW1lc3BhY2VdKTtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih0aGlzLmVsZW1lbnRzLCAnY2xpY2suJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKGRvY3VtZW50LCAnZm9jdXNpbi4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSk7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoZG9jdW1lbnQuYm9keSwgJ2NvbnRleHRtZW51LicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlKTtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihkb2N1bWVudC5ib2R5LCAna2V5dXAuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuZG9tTm9kZXMubmF2aWdhdGlvbi5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYnV0dG9uJyksICdjbGljay4nICsgdGhpcy5ldmVudE5hbWVzcGFjZSk7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIodGhpcy5kb21Ob2Rlcy5jbG9zZUJ1dHRvbiwgJ2NsaWNrLicgKyB0aGlzLmV2ZW50TmFtZXNwYWNlKTtcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcih3aW5kb3csICdyZXNpemUuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKHdpbmRvdywgJ2hhc2hjaGFuZ2UuJyArIHRoaXMuZXZlbnROYW1lc3BhY2UpO1xuICAgICAgdGhpcy5jbG9zZSgpO1xuXG4gICAgICBpZiAodGhpcy5pc09wZW4pIHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLmRvbU5vZGVzLndyYXBwZXIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuZG9tTm9kZXMub3ZlcmxheSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZWxlbWVudHMgPSBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJyZWZyZXNoXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlZnJlc2goKSB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbFNlbGVjdG9yKSB7XG4gICAgICAgIHRocm93ICdyZWZyZXNoaW5nIG9ubHkgd29ya3Mgd2hlbiB5b3UgaW5pdGlhbGl6ZSB1c2luZyBhIHNlbGVjdG9yISc7XG4gICAgICB9XG5cbiAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgIHNlbGVjdG9yID0gdGhpcy5pbml0aWFsU2VsZWN0b3I7XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFNpbXBsZUxpZ2h0Ym94O1xufSgpO1xuXG52YXIgX2RlZmF1bHQgPSBTaW1wbGVMaWdodGJveDtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gX2RlZmF1bHQ7XG5nbG9iYWwuU2ltcGxlTGlnaHRib3ggPSBTaW1wbGVMaWdodGJveDsiLCJpbXBvcnQgU2ltcGxlTGlnaHRib3ggZnJvbSBcInNpbXBsZWxpZ2h0Ym94XCI7XHJcblxyXG5uZXcgU2ltcGxlTGlnaHRib3goJy5nYWxsZXJ5X19mYW5jeWJveCcsIHsgLyogb3B0aW9ucyAqLyB9KTtcclxuIiwiLyoqXG4gKiBTdGlja3kgU2lkZWJhciB2MiBKYXZhU2NyaXB0IFBsdWdpbi5cbiAqIEB2ZXJzaW9uIDEuMC4xXG4gKiBAYXV0aG9yIMOYeXN0ZWluIEJsaXhoYXZuIDxveXN0ZWluQGJsaXhoYXZuLm5vPlxuICogQGxpY2Vuc2UgVGhlIE1JVCBMaWNlbnNlIChNSVQpXG4gKi9cbmNvbnN0IFN0aWNreVNpZGViYXIgPSAoKCkgPT4ge1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gIyBEZWZpbmUgQ29uc3RhbnRzXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy9cbiAgICBjb25zdCBFVkVOVF9LRVkgPSAnLnN0aWNreVNpZGViYXInO1xuICAgIGNvbnN0IFZFUlNJT04gICA9ICcxLjAuMSc7XG5cbiAgICBjb25zdCBERUZBVUxUUyA9IHtcbiAgICAgIC8qKlxuICAgICAgICogQWRkaXRpb25hbCB0b3Agc3BhY2luZyBvZiB0aGUgZWxlbWVudCB3aGVuIGl0IGJlY29tZXMgc3RpY2t5LlxuICAgICAgICogQHR5cGUge051bWVyaWN8RnVuY3Rpb259XG4gICAgICAgKi9cbiAgICAgIHRvcFNwYWNpbmc6IDAsXG5cbiAgICAgIC8qKlxuICAgICAgICogQWRkaXRpb25hbCBib3R0b20gc3BhY2luZyBvZiB0aGUgZWxlbWVudCB3aGVuIGl0IGJlY29tZXMgc3RpY2t5LlxuICAgICAgICogQHR5cGUge051bWVyaWN8RnVuY3Rpb259XG4gICAgICAgKi9cbiAgICAgIGJvdHRvbVNwYWNpbmc6IDAsXG5cbiAgICAgIC8qKlxuICAgICAgICogQ29udGFpbmVyIHNpZGViYXIgc2VsZWN0b3IgdG8ga25vdyB3aGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBzdGlja3kgZWxlbWVudC5cbiAgICAgICAqIEB0eXBlIHtTdHJpbmd8RmFsc2V9XG4gICAgICAgKi9cbiAgICAgIGNvbnRhaW5lclNlbGVjdG9yOiBmYWxzZSxcblxuICAgICAgLyoqXG4gICAgICAgKiBQYXJlbnQgZWxlbWVudCB3aGVyZSB0aGUgc2Nyb2xsaW5nIGhhcHBlbnMuXG4gICAgICAgKi9cbiAgICAgIHNjcm9sbENvbnRhaW5lcjogZmFsc2UsXG5cbiAgICAgIC8qKlxuICAgICAgICogSW5uZXIgd3JhcHBlciBzZWxlY3Rvci5cbiAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgKi9cbiAgICAgIGlubmVyV3JhcHBlclNlbGVjdG9yOiAnLmlubmVyLXdyYXBwZXItc3RpY2t5JyxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgbmFtZSBvZiBDU1MgY2xhc3MgdG8gYXBwbHkgdG8gZWxlbWVudHMgd2hlbiB0aGV5IGhhdmUgYmVjb21lIHN0dWNrLlxuICAgICAgICogQHR5cGUge1N0cmluZ3xGYWxzZX1cbiAgICAgICAqL1xuICAgICAgc3RpY2t5Q2xhc3M6ICdpcy1hZmZpeGVkJyxcblxuICAgICAgLyoqXG4gICAgICAgKiBUaGUgc2lkZWJhciByZXR1cm5zIHRvIGl0cyBub3JtYWwgcG9zaXRpb24gaWYgaXRzIHdpZHRoIGJlbG93IHRoaXMgdmFsdWUuXG4gICAgICAgKiBAdHlwZSB7TnVtZXJpY31cbiAgICAgICAqL1xuICAgICAgbWluV2lkdGg6IGZhbHNlXG4gICAgfTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vICMgQ2xhc3MgRGVmaW5pdGlvblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vXG4gICAgLyoqXG4gICAgICogU3RpY2t5IFNpZGViYXIgQ2xhc3MuXG4gICAgICogQHB1YmxpY1xuICAgICAqL1xuICAgIGNsYXNzIFN0aWNreVNpZGViYXJ7XG5cbiAgICAgIC8qKlxuICAgICAgICogU3RpY2t5IFNpZGViYXIgQ29uc3RydWN0b3IuXG4gICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR8U3RyaW5nfSBzaWRlYmFyIC0gVGhlIHNpZGViYXIgZWxlbWVudCBvciBzaWRlYmFyIHNlbGVjdG9yLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyBvZiBzdGlja3kgc2lkZWJhci5cbiAgICAgICAqL1xuICAgICAgY29uc3RydWN0b3Ioc2lkZWJhciwgb3B0aW9ucyA9IHt9KXtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gU3RpY2t5U2lkZWJhci5leHRlbmQoREVGQVVMVFMsIG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIFNpZGViYXIgZWxlbWVudCBxdWVyeSBpZiB0aGVyZSdzIG5vIG9uZSwgdGhyb3cgZXJyb3IuXG4gICAgICAgIHRoaXMuc2lkZWJhciA9ICgnc3RyaW5nJyA9PT0gdHlwZW9mIHNpZGViYXIgKSA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2lkZWJhcikgOiBzaWRlYmFyO1xuICAgICAgICBpZiggJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiB0aGlzLnNpZGViYXIgKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZXJlIGlzIG5vIHNwZWNpZmljIHNpZGViYXIgZWxlbWVudC5cIik7XG5cbiAgICAgICAgdGhpcy5zaWRlYmFySW5uZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSB0aGlzLnNpZGViYXIucGFyZW50RWxlbWVudDtcblxuICAgICAgICAvLyBDdXJyZW50IEFmZml4IFR5cGUgb2Ygc2lkZWJhciBlbGVtZW50LlxuICAgICAgICB0aGlzLmFmZml4ZWRUeXBlID0gJ1NUQVRJQyc7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nO1xuICAgICAgICB0aGlzLnN1cHBvcnQgPSB7XG4gICAgICAgICAgdHJhbnNmb3JtOiAgIGZhbHNlLFxuICAgICAgICAgIHRyYW5zZm9ybTNkOiBmYWxzZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3JlU3R5bGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fYnJlYWtwb2ludCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIERpbWVuc2lvbnMgb2Ygc2lkZWJhciwgY29udGFpbmVyIGFuZCBzY3JlZW4gdmlld3BvcnQuXG4gICAgICAgIHRoaXMuZGltZW5zaW9ucyA9IHtcbiAgICAgICAgICB0cmFuc2xhdGVZOiAwLFxuICAgICAgICAgIG1heFRyYW5zbGF0ZVk6IDAsXG4gICAgICAgICAgdG9wU3BhY2luZzogMCxcbiAgICAgICAgICBsYXN0VG9wU3BhY2luZzogMCxcbiAgICAgICAgICBib3R0b21TcGFjaW5nOiAwLFxuICAgICAgICAgIGxhc3RCb3R0b21TcGFjaW5nOiAwLFxuICAgICAgICAgIHNpZGViYXJIZWlnaHQ6IDAsXG4gICAgICAgICAgc2lkZWJhcldpZHRoOiAwLFxuICAgICAgICAgIGNvbnRhaW5lclRvcDogMCxcbiAgICAgICAgICBjb250YWluZXJIZWlnaHQ6IDAsXG4gICAgICAgICAgdmlld3BvcnRIZWlnaHQ6IDAsXG4gICAgICAgICAgdmlld3BvcnRUb3A6IDAsXG4gICAgICAgICAgbGFzdFZpZXdwb3J0VG9wOiAwLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEJpbmQgZXZlbnQgaGFuZGxlcnMgZm9yIHJlZmVyZW5jYWJpbGl0eS5cbiAgICAgICAgWydoYW5kbGVFdmVudCddLmZvckVhY2goIChtZXRob2QpID0+IHtcbiAgICAgICAgICB0aGlzW21ldGhvZF0gPSB0aGlzW21ldGhvZF0uYmluZCh0aGlzKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBzdGlja3kgc2lkZWJhciBmb3IgZmlyc3QgdGltZS5cbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogSW5pdGlhbGl6ZXMgdGhlIHN0aWNreSBzaWRlYmFyIGJ5IGFkZGluZyBpbm5lciB3cmFwcGVyLCBkZWZpbmUgaXRzIGNvbnRhaW5lcixcbiAgICAgICAqIG1pbi13aWR0aCBicmVha3BvaW50LCBjYWxjdWxhdGluZyBkaW1lbnNpb25zLCBhZGRpbmcgaGVscGVyIGNsYXNzZXMgYW5kIGlubGluZSBzdHlsZS5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIGluaXRpYWxpemUoKXtcbiAgICAgICAgdGhpcy5fc2V0U3VwcG9ydEZlYXR1cmVzKCk7XG5cbiAgICAgICAgLy8gR2V0IHN0aWNreSBzaWRlYmFyIGlubmVyIHdyYXBwZXIsIGlmIG5vdCBmb3VuZCwgd2lsbCBjcmVhdGUgb25lLlxuICAgICAgICBpZiggdGhpcy5vcHRpb25zLmlubmVyV3JhcHBlclNlbGVjdG9yICl7XG4gICAgICAgICAgdGhpcy5zaWRlYmFySW5uZXIgPSB0aGlzLnNpZGViYXIucXVlcnlTZWxlY3Rvcih0aGlzLm9wdGlvbnMuaW5uZXJXcmFwcGVyU2VsZWN0b3IpO1xuXG4gICAgICAgICAgaWYoIG51bGwgPT09IHRoaXMuc2lkZWJhcklubmVyIClcbiAgICAgICAgICAgIHRoaXMuc2lkZWJhcklubmVyID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiggISB0aGlzLnNpZGViYXJJbm5lciApe1xuICAgICAgICAgIGxldCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgd3JhcHBlci5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2lubmVyLXdyYXBwZXItc3RpY2t5Jyk7XG4gICAgICAgICAgdGhpcy5zaWRlYmFyLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXG4gICAgICAgICAgd2hpbGUoIHRoaXMuc2lkZWJhci5maXJzdENoaWxkICE9IHdyYXBwZXIgKVxuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLnNpZGViYXIuZmlyc3RDaGlsZCk7XG5cbiAgICAgICAgICB0aGlzLnNpZGViYXJJbm5lciA9IHRoaXMuc2lkZWJhci5xdWVyeVNlbGVjdG9yKCcuaW5uZXItd3JhcHBlci1zdGlja3knKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvbnRhaW5lciB3cmFwcGVyIG9mIHRoZSBzaWRlYmFyLlxuICAgICAgICBpZiggdGhpcy5vcHRpb25zLmNvbnRhaW5lclNlbGVjdG9yICl7XG4gICAgICAgICAgbGV0IGNvbnRhaW5lcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMub3B0aW9ucy5jb250YWluZXJTZWxlY3Rvcik7XG4gICAgICAgICAgY29udGFpbmVycyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGNvbnRhaW5lcnMpO1xuXG4gICAgICAgICAgY29udGFpbmVycy5mb3JFYWNoKChjb250YWluZXIsIGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGlmKCAhIGNvbnRhaW5lci5jb250YWlucyh0aGlzLnNpZGViYXIpICkgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpZiggISBjb250YWluZXJzLmxlbmd0aCApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgY29udGFpbmVyIGRvZXMgbm90IGNvbnRhaW5zIG9uIHRoZSBzaWRlYmFyLlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdldCBzY3JvbGwgY29udGFpbmVyLCBpZiBwcm92aWRlZFxuICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lciA9IHRoaXMub3B0aW9ucy5zY3JvbGxDb250YWluZXIgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMub3B0aW9ucy5zY3JvbGxDb250YWluZXIpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIElmIHRvcC9ib3R0b20gc3BhY2luZyBpcyBub3QgZnVuY3Rpb24gcGFyc2UgdmFsdWUgdG8gaW50ZWdlci5cbiAgICAgICAgaWYoICdmdW5jdGlvbicgIT09IHR5cGVvZiB0aGlzLm9wdGlvbnMudG9wU3BhY2luZyApXG4gICAgICAgICAgdGhpcy5vcHRpb25zLnRvcFNwYWNpbmcgPSBwYXJzZUludCh0aGlzLm9wdGlvbnMudG9wU3BhY2luZykgfHwgMDtcblxuICAgICAgICBpZiggJ2Z1bmN0aW9uJyAhPT0gdHlwZW9mIHRoaXMub3B0aW9ucy5ib3R0b21TcGFjaW5nIClcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuYm90dG9tU3BhY2luZyA9IHBhcnNlSW50KHRoaXMub3B0aW9ucy5ib3R0b21TcGFjaW5nKSB8fCAwO1xuXG4gICAgICAgIC8vIEJyZWFrZG93biBzdGlja3kgc2lkZWJhciBpZiBzY3JlZW4gd2lkdGggYmVsb3cgYG9wdGlvbnMubWluV2lkdGhgLlxuICAgICAgICB0aGlzLl93aWR0aEJyZWFrcG9pbnQoKTtcblxuICAgICAgICAvLyBDYWxjdWxhdGUgZGltZW5zaW9ucyBvZiBzaWRlYmFyLCBjb250YWluZXIgYW5kIHZpZXdwb3J0LlxuICAgICAgICB0aGlzLmNhbGNEaW1lbnNpb25zKCk7XG5cbiAgICAgICAgLy8gQWZmaXggc2lkZWJhciBpbiBwcm9wZXIgcG9zaXRpb24uXG4gICAgICAgIHRoaXMuc3RpY2t5UG9zaXRpb24oKTtcblxuICAgICAgICAvLyBCaW5kIGFsbCBldmVudHMuXG4gICAgICAgIHRoaXMuYmluZEV2ZW50cygpO1xuXG4gICAgICAgIC8vIEluZm9ybSBvdGhlciBwcm9wZXJ0aWVzIHRoZSBzdGlja3kgc2lkZWJhciBpcyBpbml0aWFsaXplZC5cbiAgICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEJpbmQgYWxsIGV2ZW50cyBvZiBzdGlja3kgc2lkZWJhciBwbHVnaW4uXG4gICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgKi9cbiAgICAgIGJpbmRFdmVudHMoKXtcbiAgICAgICAgdGhpcy5ldmVudFRhcmdldCA9IHRoaXMuc2Nyb2xsQ29udGFpbmVyID8gdGhpcy5zY3JvbGxDb250YWluZXIgOiB3aW5kb3c7XG5cbiAgICAgICAgdGhpcy5ldmVudFRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLCB7IHBhc3NpdmU6IHRydWUsIGNhcHR1cmU6IGZhbHNlIH0pO1xuICAgICAgICB0aGlzLmV2ZW50VGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMsIHsgcGFzc2l2ZTogdHJ1ZSwgY2FwdHVyZTogZmFsc2UgfSk7XG5cbiAgICAgICAgdGhpcy5zaWRlYmFyLmFkZEV2ZW50TGlzdGVuZXIoJ3VwZGF0ZScgKyBFVkVOVF9LRVksIHRoaXMpO1xuXG4gICAgICAgIGlmKCAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIFJlc2l6ZU9ic2VydmVyICl7XG4gICAgICAgICAgY29uc3QgcmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKCkgPT4gdGhpcy5oYW5kbGVFdmVudCgpKVxuICAgICAgICAgIHJlc2l6ZU9ic2VydmVyLm9ic2VydmUodGhpcy5zaWRlYmFySW5uZXIpXG4gICAgICAgICAgcmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmNvbnRhaW5lcilcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEhhbmRsZXMgYWxsIGV2ZW50cyBvZiB0aGUgcGx1Z2luLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IC0gRXZlbnQgb2JqZWN0IHBhc3NlZCBmcm9tIGxpc3RlbmVyLlxuICAgICAgICovXG4gICAgICBoYW5kbGVFdmVudChldmVudCl7XG4gICAgICAgIHRoaXMudXBkYXRlU3RpY2t5KGV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGVzIGRpbWVuc2lvbnMgb2Ygc2lkZWJhciwgY29udGFpbmVyIGFuZCBzY3JlZW4gdmlld3BvaW50XG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIGNhbGNEaW1lbnNpb25zKCl7XG4gICAgICAgIGlmKCB0aGlzLl9icmVha3BvaW50ICkgcmV0dXJuO1xuICAgICAgICB2YXIgZGltcyA9IHRoaXMuZGltZW5zaW9ucztcblxuICAgICAgICAvLyBDb250YWluZXIgb2Ygc3RpY2t5IHNpZGViYXIgZGltZW5zaW9ucy5cbiAgICAgICAgZGltcy5jb250YWluZXJUb3AgICAgPSBTdGlja3lTaWRlYmFyLm9mZnNldFJlbGF0aXZlKHRoaXMuY29udGFpbmVyKS50b3A7XG4gICAgICAgIGRpbXMuY29udGFpbmVySGVpZ2h0ID0gdGhpcy5jb250YWluZXIuY2xpZW50SGVpZ2h0O1xuICAgICAgICBkaW1zLmNvbnRhaW5lckJvdHRvbSA9IGRpbXMuY29udGFpbmVyVG9wICsgZGltcy5jb250YWluZXJIZWlnaHQ7XG5cbiAgICAgICAgLy8gU2lkZWJhciBkaW1lbnNpb25zLlxuICAgICAgICBkaW1zLnNpZGViYXJIZWlnaHQgPSB0aGlzLnNpZGViYXJJbm5lci5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGRpbXMuc2lkZWJhcldpZHRoICA9IHRoaXMuc2lkZWJhcklubmVyLm9mZnNldFdpZHRoO1xuXG4gICAgICAgIC8vIFNjcmVlbiB2aWV3cG9ydCBkaW1lbnNpb25zLlxuICAgICAgICBkaW1zLnZpZXdwb3J0SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICAgIC8vIE1heGltdW0gc2lkZWJhciB0cmFuc2xhdGUgWS5cbiAgICAgICAgZGltcy5tYXhUcmFuc2xhdGVZID0gZGltcy5jb250YWluZXJIZWlnaHQgLSBkaW1zLnNpZGViYXJIZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5fY2FsY0RpbWVuc2lvbnNXaXRoU2Nyb2xsKCk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogU29tZSBkaW1lbnNpb25zIHZhbHVlcyBuZWVkIHRvIGJlIHVwLXRvLWRhdGUgd2hlbiBzY3JvbGxpbmcgdGhlIHBhZ2UuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBfY2FsY0RpbWVuc2lvbnNXaXRoU2Nyb2xsKCl7XG4gICAgICAgIHZhciBkaW1zID0gdGhpcy5kaW1lbnNpb25zO1xuXG4gICAgICAgIGRpbXMuc2lkZWJhckxlZnQgPSBTdGlja3lTaWRlYmFyLm9mZnNldFJlbGF0aXZlKHRoaXMuc2lkZWJhcikubGVmdDtcblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxDb250YWluZXIpIHtcbiAgICAgICAgICBkaW1zLnZpZXdwb3J0VG9wID0gdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsVG9wO1xuICAgICAgICAgIGRpbXMudmlld3BvcnRMZWZ0ID0gdGhpcy5zY3JvbGxDb250YWluZXIuc2Nyb2xsTGVmdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkaW1zLnZpZXdwb3J0VG9wID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcbiAgICAgICAgICBkaW1zLnZpZXdwb3J0TGVmdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgICBkaW1zLnZpZXdwb3J0Qm90dG9tID0gZGltcy52aWV3cG9ydFRvcCArIGRpbXMudmlld3BvcnRIZWlnaHQ7XG5cbiAgICAgICAgZGltcy50b3BTcGFjaW5nICAgID0gdGhpcy5vcHRpb25zLnRvcFNwYWNpbmc7XG4gICAgICAgIGRpbXMuYm90dG9tU3BhY2luZyA9IHRoaXMub3B0aW9ucy5ib3R0b21TcGFjaW5nO1xuXG4gICAgICAgIGlmKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgZGltcy50b3BTcGFjaW5nIClcbiAgICAgICAgICAgIGRpbXMudG9wU3BhY2luZyA9IHBhcnNlSW50KGRpbXMudG9wU3BhY2luZyh0aGlzLnNpZGViYXIpKSB8fCAwO1xuXG4gICAgICAgIGlmKCAnZnVuY3Rpb24nID09PSB0eXBlb2YgZGltcy5ib3R0b21TcGFjaW5nIClcbiAgICAgICAgICAgIGRpbXMuYm90dG9tU3BhY2luZyA9IHBhcnNlSW50KGRpbXMuYm90dG9tU3BhY2luZyh0aGlzLnNpZGViYXIpKSB8fCAwO1xuXG4gICAgICAgIGlmKCAnVklFV1BPUlQtVE9QJyA9PT0gdGhpcy5hZmZpeGVkVHlwZSApe1xuICAgICAgICAgIC8vIEFkanVzdCB0cmFuc2xhdGUgWSBpbiB0aGUgY2FzZSBkZWNyZWFzZSB0b3Agc3BhY2luZyB2YWx1ZS5cbiAgICAgICAgICBpZiggZGltcy50b3BTcGFjaW5nIDwgZGltcy5sYXN0VG9wU3BhY2luZyApe1xuICAgICAgICAgICAgZGltcy50cmFuc2xhdGVZICs9IGRpbXMubGFzdFRvcFNwYWNpbmcgLSBkaW1zLnRvcFNwYWNpbmc7XG4gICAgICAgICAgICB0aGlzLl9yZVN0eWxlID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiggJ1ZJRVdQT1JULUJPVFRPTScgPT09IHRoaXMuYWZmaXhlZFR5cGUgKXtcbiAgICAgICAgICAvLyBBZGp1c3QgdHJhbnNsYXRlIFkgaW4gdGhlIGNhc2UgZGVjcmVhc2UgYm90dG9tIHNwYWNpbmcgdmFsdWUuXG4gICAgICAgICAgaWYoIGRpbXMuYm90dG9tU3BhY2luZyA8IGRpbXMubGFzdEJvdHRvbVNwYWNpbmcgKXtcbiAgICAgICAgICAgIGRpbXMudHJhbnNsYXRlWSArPSBkaW1zLmxhc3RCb3R0b21TcGFjaW5nIC0gZGltcy5ib3R0b21TcGFjaW5nO1xuICAgICAgICAgICAgdGhpcy5fcmVTdHlsZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZGltcy5sYXN0VG9wU3BhY2luZyAgICA9IGRpbXMudG9wU3BhY2luZztcbiAgICAgICAgZGltcy5sYXN0Qm90dG9tU3BhY2luZyA9IGRpbXMuYm90dG9tU3BhY2luZztcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBEZXRlcm1pbmUgd2hldGhlciB0aGUgc2lkZWJhciBpcyBiaWdnZXIgdGhhbiB2aWV3cG9ydC5cbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICAgKi9cbiAgICAgIGlzU2lkZWJhckZpdHNWaWV3cG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGltZW5zaW9ucy52aWV3cG9ydEhlaWdodCA+PSAoXG4gICAgICAgICAgdGhpcy5kaW1lbnNpb25zLmxhc3RCb3R0b21TcGFjaW5nICtcbiAgICAgICAgICB0aGlzLmRpbWVuc2lvbnMubGFzdFRvcFNwYWNpbmcgK1xuICAgICAgICAgIHRoaXMuZGltZW5zaW9ucy5zaWRlYmFySGVpZ2h0XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogT2JzZXJ2ZSBicm93c2VyIHNjcm9sbGluZyBkaXJlY3Rpb24gdG9wIGFuZCBkb3duLlxuICAgICAgICovXG4gICAgICBvYnNlcnZlU2Nyb2xsRGlyKCl7XG4gICAgICAgIHZhciBkaW1zID0gdGhpcy5kaW1lbnNpb25zO1xuICAgICAgICBpZiggZGltcy5sYXN0Vmlld3BvcnRUb3AgPT09IGRpbXMudmlld3BvcnRUb3AgKSByZXR1cm47XG5cbiAgICAgICAgdmFyIGZ1cnRoZXN0ID0gJ2Rvd24nID09PSB0aGlzLmRpcmVjdGlvbiA/IE1hdGgubWluIDogTWF0aC5tYXg7XG5cbiAgICAgICAgLy8gSWYgdGhlIGJyb3dzZXIgaXMgc2Nyb2xsaW5nIG5vdCBpbiB0aGUgc2FtZSBkaXJlY3Rpb24uXG4gICAgICAgIGlmKCBkaW1zLnZpZXdwb3J0VG9wID09PSBmdXJ0aGVzdChkaW1zLnZpZXdwb3J0VG9wLCBkaW1zLmxhc3RWaWV3cG9ydFRvcCkgKVxuICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gJ2Rvd24nID09PSB0aGlzLmRpcmVjdGlvbiA/ICAndXAnIDogJ2Rvd24nO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEdldHMgYWZmaXggdHlwZSBvZiBzaWRlYmFyIGFjY29yZGluZyB0byBjdXJyZW50IHNjcm9sbCB0b3AgYW5kIHNjcm9sbGluZyBkaXJlY3Rpb24uXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKiBAcmV0dXJuIHtTdHJpbmd8RmFsc2V9IC0gUHJvcGVyIGFmZml4IHR5cGUuXG4gICAgICAgKi9cbiAgICAgIGdldEFmZml4VHlwZSgpe1xuICAgICAgICB0aGlzLl9jYWxjRGltZW5zaW9uc1dpdGhTY3JvbGwoKTtcbiAgICAgICAgdmFyIGRpbXMgPSB0aGlzLmRpbWVuc2lvbnM7XG4gICAgICAgIHZhciBjb2xsaWRlclRvcCA9IGRpbXMudmlld3BvcnRUb3AgKyBkaW1zLnRvcFNwYWNpbmc7XG4gICAgICAgIHZhciBhZmZpeFR5cGUgPSB0aGlzLmFmZml4ZWRUeXBlO1xuXG4gICAgICAgaWYoIGNvbGxpZGVyVG9wIDw9IGRpbXMuY29udGFpbmVyVG9wIHx8IGRpbXMuY29udGFpbmVySGVpZ2h0IDw9IGRpbXMuc2lkZWJhckhlaWdodCApe1xuICAgICAgICAgIGRpbXMudHJhbnNsYXRlWSA9IDA7XG4gICAgICAgICAgYWZmaXhUeXBlID0gJ1NUQVRJQyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWZmaXhUeXBlID0gKCAndXAnID09PSB0aGlzLmRpcmVjdGlvbiApID9cbiAgICAgICAgICAgIHRoaXMuX2dldEFmZml4VHlwZVNjcm9sbGluZ1VwKCkgOiB0aGlzLl9nZXRBZmZpeFR5cGVTY3JvbGxpbmdEb3duKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHRyYW5zbGF0ZSBZIGlzIG5vdCBiaWdnZXIgdGhhbiBjb250YWluZXIgaGVpZ2h0LlxuICAgICAgICBkaW1zLnRyYW5zbGF0ZVkgPSBNYXRoLm1heCgwLCBkaW1zLnRyYW5zbGF0ZVkpO1xuICAgICAgICBkaW1zLnRyYW5zbGF0ZVkgPSBNYXRoLm1pbihkaW1zLmNvbnRhaW5lckhlaWdodCwgZGltcy50cmFuc2xhdGVZKTtcbiAgICAgICAgZGltcy50cmFuc2xhdGVZID0gTWF0aC5yb3VuZChkaW1zLnRyYW5zbGF0ZVkpO1xuXG4gICAgICAgIGRpbXMubGFzdFZpZXdwb3J0VG9wID0gZGltcy52aWV3cG9ydFRvcDtcbiAgICAgICAgcmV0dXJuIGFmZml4VHlwZTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgYWZmaXggdHlwZSB3aGlsZSBzY3JvbGxpbmcgZG93bi5cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IC0gUHJvcGVyIGFmZml4IHR5cGUgb2Ygc2Nyb2xsaW5nIGRvd24gZGlyZWN0aW9uLlxuICAgICAgICovXG4gICAgICBfZ2V0QWZmaXhUeXBlU2Nyb2xsaW5nRG93bigpe1xuICAgICAgICB2YXIgZGltcyA9IHRoaXMuZGltZW5zaW9ucztcbiAgICAgICAgdmFyIHNpZGViYXJCb3R0b20gPSBkaW1zLnNpZGViYXJIZWlnaHQgKyBkaW1zLmNvbnRhaW5lclRvcDtcbiAgICAgICAgdmFyIGNvbGxpZGVyVG9wID0gZGltcy52aWV3cG9ydFRvcCArIGRpbXMudG9wU3BhY2luZztcbiAgICAgICAgdmFyIGNvbGxpZGVyQm90dG9tID0gZGltcy52aWV3cG9ydEJvdHRvbSAtIGRpbXMuYm90dG9tU3BhY2luZztcbiAgICAgICAgdmFyIGFmZml4VHlwZSA9IHRoaXMuYWZmaXhlZFR5cGU7XG5cbiAgICAgICAgaWYoIHRoaXMuaXNTaWRlYmFyRml0c1ZpZXdwb3J0KCkgKXtcbiAgICAgICAgICBpZiggZGltcy5zaWRlYmFySGVpZ2h0ICsgY29sbGlkZXJUb3AgPj0gZGltcy5jb250YWluZXJCb3R0b20gKXtcbiAgICAgICAgICAgIGRpbXMudHJhbnNsYXRlWSA9IGRpbXMuY29udGFpbmVyQm90dG9tIC0gc2lkZWJhckJvdHRvbTtcbiAgICAgICAgICAgIGFmZml4VHlwZSA9ICdDT05UQUlORVItQk9UVE9NJztcblxuICAgICAgICAgIH0gZWxzZSBpZiggY29sbGlkZXJUb3AgPj0gZGltcy5jb250YWluZXJUb3AgKXtcbiAgICAgICAgICAgIGRpbXMudHJhbnNsYXRlWSA9IGNvbGxpZGVyVG9wIC0gZGltcy5jb250YWluZXJUb3A7XG4gICAgICAgICAgICBhZmZpeFR5cGUgPSAnVklFV1BPUlQtVE9QJztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYoIGRpbXMuY29udGFpbmVyQm90dG9tIDw9IGNvbGxpZGVyQm90dG9tICl7XG4gICAgICAgICAgICBkaW1zLnRyYW5zbGF0ZVkgPSBkaW1zLmNvbnRhaW5lckJvdHRvbSAtIHNpZGViYXJCb3R0b207XG4gICAgICAgICAgICBhZmZpeFR5cGUgPSAnQ09OVEFJTkVSLUJPVFRPTSc7XG5cbiAgICAgICAgICB9IGVsc2UgaWYoIHNpZGViYXJCb3R0b20gKyBkaW1zLnRyYW5zbGF0ZVkgPD0gY29sbGlkZXJCb3R0b20gKXtcbiAgICAgICAgICAgIGRpbXMudHJhbnNsYXRlWSA9IGNvbGxpZGVyQm90dG9tIC0gc2lkZWJhckJvdHRvbTtcbiAgICAgICAgICAgIGFmZml4VHlwZSA9ICdWSUVXUE9SVC1CT1RUT00nO1xuXG4gICAgICAgICAgfSBlbHNlIGlmKCBkaW1zLmNvbnRhaW5lclRvcCArIGRpbXMudHJhbnNsYXRlWSA8PSBjb2xsaWRlclRvcCAmJlxuICAgICAgICAgICAgKDAgIT09IGRpbXMudHJhbnNsYXRlWSAmJiBkaW1zLm1heFRyYW5zbGF0ZVkgIT09IGRpbXMudHJhbnNsYXRlWSkgKXtcbiAgICAgICAgICAgIGFmZml4VHlwZSA9ICdWSUVXUE9SVC1VTkJPVFRPTSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFmZml4VHlwZTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgYWZmaXggdHlwZSB3aGlsZSBzY3JvbGxpbmcgdXAuXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICogQHJldHVybiB7U3RyaW5nfSAtIFByb3BlciBhZmZpeCB0eXBlIG9mIHNjcm9sbGluZyB1cCBkaXJlY3Rpb24uXG4gICAgICAgKi9cbiAgICAgIF9nZXRBZmZpeFR5cGVTY3JvbGxpbmdVcCgpe1xuICAgICAgICB2YXIgZGltcyA9IHRoaXMuZGltZW5zaW9ucztcbiAgICAgICAgdmFyIHNpZGViYXJCb3R0b20gPSBkaW1zLnNpZGViYXJIZWlnaHQgKyBkaW1zLmNvbnRhaW5lclRvcDtcbiAgICAgICAgdmFyIGNvbGxpZGVyVG9wID0gZGltcy52aWV3cG9ydFRvcCArIGRpbXMudG9wU3BhY2luZztcbiAgICAgICAgdmFyIGNvbGxpZGVyQm90dG9tID0gZGltcy52aWV3cG9ydEJvdHRvbSAtIGRpbXMuYm90dG9tU3BhY2luZztcbiAgICAgICAgdmFyIGFmZml4VHlwZSA9IHRoaXMuYWZmaXhlZFR5cGU7XG5cbiAgICAgICAgaWYoIGNvbGxpZGVyVG9wIDw9IGRpbXMudHJhbnNsYXRlWSArIGRpbXMuY29udGFpbmVyVG9wICl7XG4gICAgICAgICAgZGltcy50cmFuc2xhdGVZID0gY29sbGlkZXJUb3AgLSBkaW1zLmNvbnRhaW5lclRvcDtcbiAgICAgICAgICBhZmZpeFR5cGUgPSAnVklFV1BPUlQtVE9QJztcblxuICAgICAgICB9IGVsc2UgaWYoIGRpbXMuY29udGFpbmVyQm90dG9tIDw9IGNvbGxpZGVyQm90dG9tICl7XG4gICAgICAgICAgZGltcy50cmFuc2xhdGVZID0gZGltcy5jb250YWluZXJCb3R0b20gLSBzaWRlYmFyQm90dG9tO1xuICAgICAgICAgIGFmZml4VHlwZSA9ICdDT05UQUlORVItQk9UVE9NJztcblxuICAgICAgICB9IGVsc2UgaWYoICEgdGhpcy5pc1NpZGViYXJGaXRzVmlld3BvcnQoKSApe1xuXG4gICAgICAgICAgaWYoIGRpbXMuY29udGFpbmVyVG9wIDw9IGNvbGxpZGVyVG9wICYmXG4gICAgICAgICAgICAgICgwICE9PSBkaW1zLnRyYW5zbGF0ZVkgJiYgZGltcy5tYXhUcmFuc2xhdGVZICE9PSBkaW1zLnRyYW5zbGF0ZVkpICl7XG4gICAgICAgICAgICBhZmZpeFR5cGUgPSAnVklFV1BPUlQtVU5CT1RUT00nO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhZmZpeFR5cGU7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0cyBpbmxpbmUgc3R5bGUgb2Ygc3RpY2t5IHNpZGViYXIgd3JhcHBlciBhbmQgaW5uZXIgd3JhcHBlciBhY2NvcmRpbmdcbiAgICAgICAqIHRvIGl0cyBhZmZpeCB0eXBlLlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBhZmZpeFR5cGUgLSBBZmZpeCB0eXBlIG9mIHN0aWNreSBzaWRlYmFyLlxuICAgICAgICogQHJldHVybiB7T2JqZWN0fVxuICAgICAgICovXG4gICAgICBfZ2V0U3R5bGUoYWZmaXhUeXBlKXtcbiAgICAgICAgaWYoICd1bmRlZmluZWQnID09PSB0eXBlb2YgYWZmaXhUeXBlICkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBzdHlsZSA9IHtpbm5lcjoge30sIG91dGVyOiB7fX07XG4gICAgICAgIHZhciBkaW1zID0gdGhpcy5kaW1lbnNpb25zO1xuXG4gICAgICAgIHN3aXRjaCggYWZmaXhUeXBlICl7XG4gICAgICAgICAgY2FzZSAnVklFV1BPUlQtVE9QJzpcbiAgICAgICAgICAgIHN0eWxlLmlubmVyID0ge3Bvc2l0aW9uOiAnZml4ZWQnLCB0b3A6IGRpbXMudG9wU3BhY2luZyxcbiAgICAgICAgICAgICAgICAgIGxlZnQ6IGRpbXMuc2lkZWJhckxlZnQgLSBkaW1zLnZpZXdwb3J0TGVmdCwgd2lkdGg6IGRpbXMuc2lkZWJhcldpZHRofTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1ZJRVdQT1JULUJPVFRPTSc6XG4gICAgICAgICAgICBzdHlsZS5pbm5lciA9IHtwb3NpdGlvbjogJ2ZpeGVkJywgdG9wOiAnYXV0bycsIGxlZnQ6IGRpbXMuc2lkZWJhckxlZnQsXG4gICAgICAgICAgICAgICAgICBib3R0b206IGRpbXMuYm90dG9tU3BhY2luZywgd2lkdGg6IGRpbXMuc2lkZWJhcldpZHRofTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ0NPTlRBSU5FUi1CT1RUT00nOlxuICAgICAgICAgIGNhc2UgJ1ZJRVdQT1JULVVOQk9UVE9NJzpcbiAgICAgICAgICAgIGxldCB0cmFuc2xhdGUgPSB0aGlzLl9nZXRUcmFuc2xhdGUoMCwgZGltcy50cmFuc2xhdGVZICsgJ3B4Jyk7XG5cbiAgICAgICAgICAgIGlmKCB0cmFuc2xhdGUgKVxuICAgICAgICAgICAgICBzdHlsZS5pbm5lciA9IHt0cmFuc2Zvcm06IHRyYW5zbGF0ZX07XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHN0eWxlLmlubmVyID0ge3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6IGRpbXMudHJhbnNsYXRlWSwgd2lkdGg6IGRpbXMuc2lkZWJhcldpZHRofTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoKCBhZmZpeFR5cGUgKXtcbiAgICAgICAgICBjYXNlICdWSUVXUE9SVC1UT1AnOlxuICAgICAgICAgIGNhc2UgJ1ZJRVdQT1JULUJPVFRPTSc6XG4gICAgICAgICAgY2FzZSAnVklFV1BPUlQtVU5CT1RUT00nOlxuICAgICAgICAgIGNhc2UgJ0NPTlRBSU5FUi1CT1RUT00nOlxuICAgICAgICAgICAgc3R5bGUub3V0ZXIgPSB7aGVpZ2h0OiBkaW1zLnNpZGViYXJIZWlnaHQsIHBvc2l0aW9uOiAncmVsYXRpdmUnfTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgc3R5bGUub3V0ZXIgPSBTdGlja3lTaWRlYmFyLmV4dGVuZCh7aGVpZ2h0OiAnJywgcG9zaXRpb246ICcnfSwgc3R5bGUub3V0ZXIpO1xuICAgICAgICBzdHlsZS5pbm5lciA9IFN0aWNreVNpZGViYXIuZXh0ZW5kKHtwb3NpdGlvbjogJ3JlbGF0aXZlJywgdG9wOiAnJywgbGVmdDogJycsXG4gICAgICAgICAgICBib3R0b206ICcnLCB3aWR0aDogJycsICB0cmFuc2Zvcm06ICcnfSwgc3R5bGUuaW5uZXIpO1xuXG4gICAgICAgIHJldHVybiBzdHlsZTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDYXVzZSB0aGUgc2lkZWJhciB0byBiZSBzdGlja3kgYWNjb3JkaW5nIHRvIGFmZml4IHR5cGUgYnkgYWRkaW5nIGlubGluZVxuICAgICAgICogc3R5bGUsIGFkZGluZyBoZWxwZXIgY2xhc3MgYW5kIHRyaWdnZXIgZXZlbnRzLlxuICAgICAgICogQGZ1bmN0aW9uXG4gICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZm9yY2UgLSBVcGRhdGUgc3RpY2t5IHNpZGViYXIgcG9zaXRpb24gYnkgZm9yY2UuXG4gICAgICAgKi9cbiAgICAgIHN0aWNreVBvc2l0aW9uKGZvcmNlKXtcbiAgICAgICAgaWYoIHRoaXMuX2JyZWFrcG9pbnQgKSByZXR1cm47XG5cbiAgICAgICAgZm9yY2UgPSB0aGlzLl9yZVN0eWxlIHx8IGZvcmNlIHx8IGZhbHNlO1xuXG4gICAgICAgIHZhciBvZmZzZXRUb3AgPSB0aGlzLm9wdGlvbnMudG9wU3BhY2luZztcbiAgICAgICAgdmFyIG9mZnNldEJvdHRvbSA9IHRoaXMub3B0aW9ucy5ib3R0b21TcGFjaW5nO1xuXG4gICAgICAgIHZhciBhZmZpeFR5cGUgPSB0aGlzLmdldEFmZml4VHlwZSgpO1xuICAgICAgICB2YXIgc3R5bGUgPSB0aGlzLl9nZXRTdHlsZShhZmZpeFR5cGUpO1xuXG4gICAgICAgIGlmKCAodGhpcy5hZmZpeGVkVHlwZSAhPSBhZmZpeFR5cGUgfHwgZm9yY2UpICYmIGFmZml4VHlwZSApe1xuICAgICAgICAgIGxldCBhZmZpeEV2ZW50ID0gJ2FmZml4LicgKyBhZmZpeFR5cGUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCd2aWV3cG9ydC0nLCAnJykgKyBFVkVOVF9LRVk7XG4gICAgICAgICAgU3RpY2t5U2lkZWJhci5ldmVudFRyaWdnZXIodGhpcy5zaWRlYmFyLCBhZmZpeEV2ZW50KTtcblxuICAgICAgICAgIGlmKCAnU1RBVElDJyA9PT0gYWZmaXhUeXBlIClcbiAgICAgICAgICAgIFN0aWNreVNpZGViYXIucmVtb3ZlQ2xhc3ModGhpcy5zaWRlYmFyLCB0aGlzLm9wdGlvbnMuc3RpY2t5Q2xhc3MpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIFN0aWNreVNpZGViYXIuYWRkQ2xhc3ModGhpcy5zaWRlYmFyLCB0aGlzLm9wdGlvbnMuc3RpY2t5Q2xhc3MpO1xuXG4gICAgICAgICAgZm9yKCBsZXQga2V5IGluIHN0eWxlLm91dGVyICl7XG4gICAgICAgICAgICBsZXQgdW5pdCA9ICgnbnVtYmVyJyA9PT0gdHlwZW9mIHN0eWxlLm91dGVyW2tleV0pID8gJ3B4JyA6ICcnO1xuICAgICAgICAgICAgdGhpcy5zaWRlYmFyLnN0eWxlW2tleV0gPSBzdHlsZS5vdXRlcltrZXldICsgdW5pdDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IoIGxldCBrZXkgaW4gc3R5bGUuaW5uZXIgKXtcbiAgICAgICAgICAgIGxldCB1bml0ID0gKCdudW1iZXInID09PSB0eXBlb2Ygc3R5bGUuaW5uZXJba2V5XSkgPyAncHgnIDogJyc7XG4gICAgICAgICAgICB0aGlzLnNpZGViYXJJbm5lci5zdHlsZVtrZXldID0gc3R5bGUuaW5uZXJba2V5XSArIHVuaXQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IGFmZml4ZWRFdmVudCA9ICdhZmZpeGVkLicrIGFmZml4VHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ3ZpZXdwb3J0LScsICcnKSArIEVWRU5UX0tFWTtcbiAgICAgICAgICBTdGlja3lTaWRlYmFyLmV2ZW50VHJpZ2dlcih0aGlzLnNpZGViYXIsIGFmZml4ZWRFdmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYoIHRoaXMuX2luaXRpYWxpemVkICkgdGhpcy5zaWRlYmFySW5uZXIuc3R5bGUubGVmdCA9IHN0eWxlLmlubmVyLmxlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFmZml4ZWRUeXBlID0gYWZmaXhUeXBlO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEJyZWFrZG93biBzdGlja3kgc2lkZWJhciB3aGVuIHdpbmRvdyB3aWR0aCBpcyBiZWxvdyBgb3B0aW9ucy5taW5XaWR0aGAgdmFsdWUuXG4gICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgKi9cbiAgICAgIF93aWR0aEJyZWFrcG9pbnQoKXtcblxuICAgICAgICBpZiggd2luZG93LmlubmVyV2lkdGggPD0gdGhpcy5vcHRpb25zLm1pbldpZHRoICl7XG4gICAgICAgICAgdGhpcy5fYnJlYWtwb2ludCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5hZmZpeGVkVHlwZSA9ICdTVEFUSUMnO1xuXG4gICAgICAgICAgdGhpcy5zaWRlYmFyLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICBTdGlja3lTaWRlYmFyLnJlbW92ZUNsYXNzKHRoaXMuc2lkZWJhciwgdGhpcy5vcHRpb25zLnN0aWNreUNsYXNzKTtcbiAgICAgICAgICB0aGlzLnNpZGViYXJJbm5lci5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fYnJlYWtwb2ludCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogU3dpdGNoZXMgYmV0d2VlbiBmdW5jdGlvbnMgc3RhY2sgZm9yIGVhY2ggZXZlbnQgdHlwZSwgaWYgdGhlcmUncyBub1xuICAgICAgICogZXZlbnQsIGl0IHdpbGwgcmUtaW5pdGlhbGl6ZSBzdGlja3kgc2lkZWJhci5cbiAgICAgICAqIEBwdWJsaWNcbiAgICAgICAqL1xuICAgICAgdXBkYXRlU3RpY2t5KGV2ZW50ID0ge30pe1xuICAgICAgICBpZiggdGhpcy5fcnVubmluZyApIHJldHVybjtcbiAgICAgICAgdGhpcy5fcnVubmluZyA9IHRydWU7XG5cbiAgICAgICAgKChldmVudFR5cGUpID0+IHtcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoKCBldmVudFR5cGUgKXtcbiAgICAgICAgICAgICAgLy8gV2hlbiBicm93c2VyIGlzIHNjcm9sbGluZyBhbmQgcmUtY2FsY3VsYXRlIGp1c3QgZGltZW5zaW9uc1xuICAgICAgICAgICAgICAvLyB3aXRoaW4gc2Nyb2xsLlxuICAgICAgICAgICAgICBjYXNlICdzY3JvbGwnOlxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGNEaW1lbnNpb25zV2l0aFNjcm9sbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMub2JzZXJ2ZVNjcm9sbERpcigpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RpY2t5UG9zaXRpb24oKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAvLyBXaGVuIGJyb3dzZXIgaXMgcmVzaXppbmcgb3IgdGhlcmUncyBubyBldmVudCwgb2JzZXJ2ZSB3aWR0aFxuICAgICAgICAgICAgICAvLyBicmVha3BvaW50IGFuZCByZS1jYWxjdWxhdGUgZGltZW5zaW9ucy5cbiAgICAgICAgICAgICAgY2FzZSAncmVzaXplJzpcbiAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLl93aWR0aEJyZWFrcG9pbnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGNEaW1lbnNpb25zKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGlja3lQb3NpdGlvbih0cnVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkoZXZlbnQudHlwZSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogU2V0IGJyb3dzZXIgc3VwcG9ydCBmZWF0dXJlcyB0byB0aGUgcHVibGljIHByb3BlcnR5LlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgX3NldFN1cHBvcnRGZWF0dXJlcygpe1xuICAgICAgICB2YXIgc3VwcG9ydCA9IHRoaXMuc3VwcG9ydDtcblxuICAgICAgICBzdXBwb3J0LnRyYW5zZm9ybSA9IFN0aWNreVNpZGViYXIuc3VwcG9ydFRyYW5zZm9ybSgpO1xuICAgICAgICBzdXBwb3J0LnRyYW5zZm9ybTNkID0gU3RpY2t5U2lkZWJhci5zdXBwb3J0VHJhbnNmb3JtKHRydWUpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEdldCB0cmFuc2xhdGUgdmFsdWUsIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIHRyYW5zZnJvbTNkLCBpdCB3aWxsIGFkb3B0IGl0LlxuICAgICAgICogYW5kIHRoZSBzYW1lIHdpdGggdHJhbnNsYXRlLiBpZiBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCBib3RoIHJldHVybiBmYWxzZS5cbiAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB5IC0gVmFsdWUgb2YgWS1heGlzLlxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHggLSBWYWx1ZSBvZiBYLWF4aXMuXG4gICAgICAgKiBAcGFyYW0ge051bWJlcn0geiAtIFZhbHVlIG9mIFotYXhpcy5cbiAgICAgICAqIEByZXR1cm4ge1N0cmluZ3xGYWxzZX1cbiAgICAgICAqL1xuICAgICAgX2dldFRyYW5zbGF0ZSh5ID0gMCwgeCA9IDAsIHogPSAwKXtcbiAgICAgICAgaWYoIHRoaXMuc3VwcG9ydC50cmFuc2Zvcm0zZCApIHJldHVybiAndHJhbnNsYXRlM2QoJyArIHkgKycsICcrIHggKycsICcrIHogKycpJztcbiAgICAgICAgZWxzZSBpZiggdGhpcy5zdXBwb3J0LnRyYW5zbGF0ZSApIHJldHVybiAndHJhbnNsYXRlKCcrIHkgKycsICcrIHggKycpJztcbiAgICAgICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogRGVzdHJveSBzdGlja3kgc2lkZWJhciBwbHVnaW4uXG4gICAgICAgKiBAcHVibGljXG4gICAgICAgKi9cbiAgICAgIGRlc3Ryb3koKXtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMsIHtjYXB0dXJlOiBmYWxzZX0pO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcywge2NhcHR1cmU6IGZhbHNlfSk7XG5cbiAgICAgICAgdGhpcy5zaWRlYmFyLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5vcHRpb25zLnN0aWNreUNsYXNzKTtcbiAgICAgICAgdGhpcy5zaWRlYmFyLnN0eWxlLm1pbkhlaWdodCA9ICcnO1xuXG4gICAgICAgIHRoaXMuc2lkZWJhci5yZW1vdmVFdmVudExpc3RlbmVyKCd1cGRhdGUnICsgRVZFTlRfS0VZLCB0aGlzKTtcblxuICAgICAgICB2YXIgc3R5bGVSZXNldCA9IHtpbm5lcjoge30sIG91dGVyOiB7fX07XG5cbiAgICAgICAgc3R5bGVSZXNldC5pbm5lciA9IHtwb3NpdGlvbjogJycsIHRvcDogJycsIGxlZnQ6ICcnLCBib3R0b206ICcnLCB3aWR0aDogJycsICB0cmFuc2Zvcm06ICcnfTtcbiAgICAgICAgc3R5bGVSZXNldC5vdXRlciA9IHtoZWlnaHQ6ICcnLCBwb3NpdGlvbjogJyd9O1xuXG4gICAgICAgIGZvciggbGV0IGtleSBpbiBzdHlsZVJlc2V0Lm91dGVyIClcbiAgICAgICAgICB0aGlzLnNpZGViYXIuc3R5bGVba2V5XSA9IHN0eWxlUmVzZXQub3V0ZXJba2V5XTtcblxuICAgICAgICBmb3IoIGxldCBrZXkgaW4gc3R5bGVSZXNldC5pbm5lciApXG4gICAgICAgICAgdGhpcy5zaWRlYmFySW5uZXIuc3R5bGVba2V5XSA9IHN0eWxlUmVzZXQuaW5uZXJba2V5XTtcblxuICAgICAgICBpZiggdGhpcy5vcHRpb25zLnJlc2l6ZVNlbnNvciAmJiAndW5kZWZpbmVkJyAhPT0gdHlwZW9mIFJlc2l6ZVNlbnNvciApe1xuICAgICAgICAgIFJlc2l6ZVNlbnNvci5kZXRhY2godGhpcy5zaWRlYmFySW5uZXIsIHRoaXMuaGFuZGxlRXZlbnQpO1xuICAgICAgICAgIFJlc2l6ZVNlbnNvci5kZXRhY2godGhpcy5jb250YWluZXIsIHRoaXMuaGFuZGxlRXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogRGV0ZXJtaW5lIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIENTUyB0cmFuc2Zvcm0gZmVhdHVyZS5cbiAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICogQHN0YXRpY1xuICAgICAgICogQHBhcmFtIHtCb29sZWFufSB0cmFuc2Zvcm0zZCAtIERldGVjdCB0cmFuc2Zvcm0gd2l0aCB0cmFuc2xhdGUzZC5cbiAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgICAqL1xuICAgICAgc3RhdGljIHN1cHBvcnRUcmFuc2Zvcm0odHJhbnNmb3JtM2Qpe1xuICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2UsXG4gICAgICAgICAgICBwcm9wZXJ0eSA9ICh0cmFuc2Zvcm0zZCkgPyAncGVyc3BlY3RpdmUnIDogJ3RyYW5zZm9ybScsXG4gICAgICAgICAgICB1cHBlciA9IHByb3BlcnR5LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc2xpY2UoMSksXG4gICAgICAgICAgICBwcmVmaXhlcyA9IFsnV2Via2l0JywgJ01veicsICdPJywgJ21zJ10sXG4gICAgICAgICAgICBzdXBwb3J0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3VwcG9ydCcpLFxuICAgICAgICAgICAgc3R5bGUgPSBzdXBwb3J0LnN0eWxlO1xuXG4gICAgICAgIChwcm9wZXJ0eSArICcgJyArIHByZWZpeGVzLmpvaW4odXBwZXIgKyAnICcpICsgdXBwZXIpLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSwgaSkge1xuICAgICAgICAgIGlmIChzdHlsZVtwcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmVzdWx0ID0gcHJvcGVydHk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBUcmlnZ2VyIGN1c3RvbSBldmVudC5cbiAgICAgICAqIEBzdGF0aWNcbiAgICAgICAqIEBwYXJhbSB7RE9NT2JqZWN0fSBlbGVtZW50IC0gVGFyZ2V0IGVsZW1lbnQgb24gdGhlIERPTS5cbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgLSBFdmVudCBuYW1lLlxuICAgICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgLVxuICAgICAgICovXG4gICAgICBzdGF0aWMgZXZlbnRUcmlnZ2VyKGVsZW1lbnQsIGV2ZW50TmFtZSwgZGF0YSl7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7ZGV0YWlsOiBkYXRhfSk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgdmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICAgICAgZXZlbnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgdHJ1ZSwgdHJ1ZSwgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBFeHRlbmQgb3B0aW9ucyBvYmplY3Qgd2l0aCBkZWZhdWx0cy5cbiAgICAgICAqIEBmdW5jdGlvblxuICAgICAgICogQHN0YXRpY1xuICAgICAgICovXG4gICAgICBzdGF0aWMgZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKXtcbiAgICAgICAgdmFyIHJlc3VsdHMgPSB7fTtcbiAgICAgICAgZm9yKCBsZXQga2V5IGluIGRlZmF1bHRzICl7XG4gICAgICAgICAgaWYoICd1bmRlZmluZWQnICE9PSB0eXBlb2Ygb3B0aW9uc1trZXldICkgcmVzdWx0c1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICAgIGVsc2UgcmVzdWx0c1trZXldID0gZGVmYXVsdHNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgY3VycmVudCBjb29yZGluYXRlcyBsZWZ0IGFuZCB0b3Agb2Ygc3BlY2lmaWMgZWxlbWVudC5cbiAgICAgICAqIEBzdGF0aWNcbiAgICAgICAqL1xuICAgICAgc3RhdGljIG9mZnNldFJlbGF0aXZlKGVsZW1lbnQpe1xuICAgICAgICB2YXIgcmVzdWx0ID0ge2xlZnQ6IDAsIHRvcDogMH07XG5cbiAgICAgICAgZG97XG4gICAgICAgICAgbGV0IG9mZnNldFRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICAgIGxldCBvZmZzZXRMZWZ0ID0gZWxlbWVudC5vZmZzZXRMZWZ0O1xuXG4gICAgICAgICAgaWYoICEgaXNOYU4ob2Zmc2V0VG9wKSApXG4gICAgICAgICAgICByZXN1bHQudG9wICs9IG9mZnNldFRvcDtcblxuICAgICAgICAgIGlmKCAhIGlzTmFOKG9mZnNldExlZnQpIClcbiAgICAgICAgICAgIHJlc3VsdC5sZWZ0ICs9IG9mZnNldExlZnQ7XG5cbiAgICAgICAgICBlbGVtZW50ID0gKCAnQk9EWScgPT09IGVsZW1lbnQudGFnTmFtZSApID9cbiAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnBhcmVudEVsZW1lbnQgOiBlbGVtZW50Lm9mZnNldFBhcmVudDtcbiAgICAgICAgfSB3aGlsZShlbGVtZW50KVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEFkZCBzcGVjaWZpYyBjbGFzcyBuYW1lIHRvIHNwZWNpZmljIGVsZW1lbnQuXG4gICAgICAgKiBAc3RhdGljXG4gICAgICAgKiBAcGFyYW0ge09iamVjdERPTX0gZWxlbWVudFxuICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGNsYXNzTmFtZVxuICAgICAgICovXG4gICAgICBzdGF0aWMgYWRkQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKXtcbiAgICAgICAgaWYoICEgU3RpY2t5U2lkZWJhci5oYXNDbGFzcyhlbGVtZW50LCBjbGFzc05hbWUpICl7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KVxuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIHNwZWNpZmljIGNsYXNzIG5hbWUgdG8gc3BlY2lmaWMgZWxlbWVudFxuICAgICAgICogQHN0YXRpY1xuICAgICAgICogQHBhcmFtIHtPYmplY3RET019IGVsZW1lbnRcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWVcbiAgICAgICAqL1xuICAgICAgc3RhdGljIHJlbW92ZUNsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSl7XG4gICAgICAgIGlmKCBTdGlja3lTaWRlYmFyLmhhc0NsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkgKXtcbiAgICAgICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGVsZW1lbnQuY2xhc3NOYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnKF58XFxcXGIpJyArIGNsYXNzTmFtZS5zcGxpdCgnICcpLmpvaW4oJ3wnKSArICcoXFxcXGJ8JCknLCAnZ2knKSwgJyAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIERldGVybWluZSB3ZWF0aGVyIHRoZSBlbGVtZW50IGhhcyBzcGVjaWZpYyBjbGFzcyBuYW1lLlxuICAgICAgICogQHN0YXRpY1xuICAgICAgICogQHBhcmFtIHtPYmplY3RET019IGVsZW1lbnRcbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWVcbiAgICAgICAqL1xuICAgICAgc3RhdGljIGhhc0NsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSl7XG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdClcbiAgICAgICAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKCcoXnwgKScgKyBjbGFzc05hbWUgKyAnKCB8JCknLCAnZ2knKS50ZXN0KGVsZW1lbnQuY2xhc3NOYW1lKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBHZXRzIGRlZmF1bHQgdmFsdWVzIG9mIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAgICAgICAqIEBzdGF0aWNcbiAgICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgICAqL1xuICAgICAgc3RhdGljIGdldCBkZWZhdWx0cygpe1xuICAgICAgICByZXR1cm4gREVGQVVMVFM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0aWNreVNpZGViYXI7XG4gIH0pKCk7XG5cbiAgZXhwb3J0IGRlZmF1bHQgU3RpY2t5U2lkZWJhcjtcblxuICAvLyBHbG9iYWxcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICB3aW5kb3cuU3RpY2t5U2lkZWJhciA9IFN0aWNreVNpZGViYXI7XG4iLCJpbXBvcnQgU3RpY2t5U2lkZWJhciBmcm9tIFwic3RpY2t5LXNpZGViYXItdjJcIjtcclxuXHJcbmlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2lkZWJhcicpKSB7XHJcbiAgdmFyIHNpZGViYXIgPSBuZXcgU3RpY2t5U2lkZWJhcignLnNpZGViYXInLCB7XHJcbiAgICAgICAgICBjb250YWluZXJTZWxlY3RvcjogJy5sYXlvdXQnLFxyXG4gICAgICAgICAgaW5uZXJXcmFwcGVyU2VsZWN0b3I6ICcuc2lkZWJhcl9faW5uZXInLFxyXG4gICAgICAgICAgdG9wU3BhY2luZzogMzAsXHJcbiAgICAgICAgICBib3R0b21TcGFjaW5nOiAyMFxyXG4gIH0pO1xyXG59XHJcbiJdLCJuYW1lcyI6WyJJU01PQklMRSIsIndpbmRvdyIsIm1hdGNoTWVkaWEiLCJtYXRjaGVzIiwiVEhSRVNIT0xEIiwiTE9BRF9USFJFU0hPTEQiLCJFTEVNRU5UUyIsIlZJU0lCTEVfQ0xBU1MiLCJBbmltYXRlIiwiZW50cmllcyIsIm1hcCIsImVudHJ5Iiwic2VjdGlvbiIsInRhcmdldCIsImRlbGF5IiwiZ2V0RGVsYXkiLCJzZWN0aW9uQm9keUNsYXNzIiwiZ2V0QXR0cmlidXRlIiwiaXNJbnRlcnNlY3RpbmciLCJjbGFzc0xpc3QiLCJhZGQiLCJib2R5Q2xhc3MiLCJzZXRUaW1lb3V0IiwiaW5jbHVkZXMiLCJwYXJzZUludCIsImh0bWxjbGFzcyIsInR5cGUiLCJkb2N1bWVudCIsImJvZHkiLCJyZW1vdmUiLCJzZWN0aW9ucyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJmb3JFYWNoIiwiZWwiLCJCb3VuZGluZ0NsaWVudFJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ2aXNpYmxlUmF0aW8iLCJoZWlnaHQiLCJpbm5lckhlaWdodCIsImxvYWRPYnNlcnZlciIsIkludGVyc2VjdGlvbk9ic2VydmVyIiwib2JzZXJ2ZUNhbGxiYWNrIiwidGhyZXNob2xkIiwib2JzZXJ2ZSIsImRpc2Nvbm5lY3QiLCJvYnNlcnZlclRocmVzaG9sZCIsIm9ic2VydmVyIiwicXVlcnlTZWxlY3RvciIsIlNwbGlkZSIsInBhZ2luYXRpb24iLCJwZXJQYWdlIiwicGVyTW92ZSIsImdhcCIsImJyZWFrcG9pbnRzIiwibW91bnQiLCJUT0dHTEVfQ0xBU1MiLCJUb2dnbGVOYXYiLCJlbGVtZW50cyIsImFkZEV2ZW50TGlzdGVuZXIiLCJ0b2dnbGVOYXYiLCJlIiwidG9nZ2xlIiwicHJldmVudERlZmF1bHQiLCJnbG9iYWwiLCJTaW1wbGVMaWdodGJveCIsIlN0aWNreVNpZGViYXIiLCJjb250YWluZXJTZWxlY3RvciIsImlubmVyV3JhcHBlclNlbGVjdG9yIiwidG9wU3BhY2luZyIsImJvdHRvbVNwYWNpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7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LENBQUM7QUFDRDtFQUNBLFNBQVMsR0FBRyxDQUFDLE1BQU0sRUFBRTtFQUNyQixFQUFFLE9BQU8sTUFBTSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0VBQ2xELENBQUM7QUFDRDtFQUNBLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztFQUNmLFNBQVMsUUFBUSxDQUFDLE1BQU0sRUFBRTtFQUMxQixFQUFFLE9BQU8sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUNqRSxDQUFDO0FBQ0Q7RUFDQSxTQUFTLFFBQVEsR0FBRztFQUNwQixFQUFFLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztFQUNwQixFQUFFLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLFFBQVEsR0FBRyxzQkFBc0IsRUFBRTtFQUN4RSxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxLQUFLO0VBQy9DLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7RUFDOUMsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO0VBQzVCLFFBQVEsTUFBTSxFQUFFLEtBQUs7RUFDckIsUUFBUSxTQUFTLEVBQUUsUUFBUTtFQUMzQixRQUFRLFVBQVUsRUFBRSxTQUFTO0VBQzdCLFFBQVEsU0FBUyxFQUFFLFFBQVE7RUFDM0IsUUFBUSxJQUFJLEVBQUUsR0FBRztFQUNqQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxLQUFLLFFBQVEsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLFNB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QVUsSUFBSSxHQUFHLENBQUMsV0FBVyxLQUFLLE1BQU0sSUFBSSxHQUFHLEtBQUssTUFBTSxDQUFDLFNBQVMsR0FBRyxRQUFRLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0FBQzFYO0VBQ0EsU0FBUywwQkFBMEIsQ0FBQyxDQUFDLEVBQUUsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFjLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE1BQU0sS0FBSyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFDLHVJQUF1SSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUM1K0I7RUFDQSxTQUFTLDJCQUEyQixDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRSxPQUFPLGlCQUFpQixDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FB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
