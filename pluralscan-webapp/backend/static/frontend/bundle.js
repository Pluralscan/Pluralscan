
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.49.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.49.0 */

    const { Error: Error_1, Object: Object_1$2, console: console_1$1 } = globals;

    // (251:0) {:else}
    function create_else_block$f(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$f.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$C(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$C.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$W(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$C, create_else_block$f];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$W.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$W($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$W, create_fragment$W, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$W.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\carbon-components-svelte\src\icons\ChevronRight.svelte generated by Svelte v3.49.0 */

    const file$T = "node_modules\\carbon-components-svelte\\src\\icons\\ChevronRight.svelte";

    // (24:2) {#if title}
    function create_if_block$B(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$T, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$B.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$V(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$B(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M22 16L12 26 10.6 24.6 19.2 16 10.6 7.4 12 6z");
    			add_location(path, file$T, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$T, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$B(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$V.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$V($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChevronRight', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class ChevronRight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$V, create_fragment$V, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronRight",
    			options,
    			id: create_fragment$V.name
    		});
    	}

    	get size() {
    		throw new Error("<ChevronRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ChevronRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ChevronRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ChevronRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ChevronRight$1 = ChevronRight;

    /* node_modules\carbon-components-svelte\src\SkeletonText\SkeletonText.svelte generated by Svelte v3.49.0 */

    const file$S = "node_modules\\carbon-components-svelte\\src\\SkeletonText\\SkeletonText.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i].width;
    	return child_ctx;
    }

    // (40:0) {:else}
    function create_else_block$e(ctx) {
    	let p;
    	let p_style_value;
    	let mounted;
    	let dispose;

    	let p_levels = [
    		/*$$restProps*/ ctx[4],
    		{
    			style: p_style_value = "width: " + /*width*/ ctx[2] + ";" + /*$$restProps*/ ctx[4].style
    		}
    	];

    	let p_data = {};

    	for (let i = 0; i < p_levels.length; i += 1) {
    		p_data = assign(p_data, p_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			set_attributes(p, p_data);
    			toggle_class(p, "bx--skeleton__text", true);
    			toggle_class(p, "bx--skeleton__heading", /*heading*/ ctx[0]);
    			add_location(p, file$S, 40, 2, 1146);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(p, "click", /*click_handler_1*/ ctx[12], false, false, false),
    					listen_dev(p, "mouseover", /*mouseover_handler_1*/ ctx[13], false, false, false),
    					listen_dev(p, "mouseenter", /*mouseenter_handler_1*/ ctx[14], false, false, false),
    					listen_dev(p, "mouseleave", /*mouseleave_handler_1*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(p, p_data = get_spread_update(p_levels, [
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4],
    				dirty & /*width, $$restProps*/ 20 && p_style_value !== (p_style_value = "width: " + /*width*/ ctx[2] + ";" + /*$$restProps*/ ctx[4].style) && { style: p_style_value }
    			]));

    			toggle_class(p, "bx--skeleton__text", true);
    			toggle_class(p, "bx--skeleton__heading", /*heading*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$e.name,
    		type: "else",
    		source: "(40:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (30:0) {#if paragraph}
    function create_if_block$A(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	let each_value = /*rows*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	let div_levels = [/*$$restProps*/ ctx[4]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_attributes(div, div_data);
    			add_location(div, file$S, 30, 2, 870);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler*/ ctx[9], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler*/ ctx[10], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rows, heading*/ 9) {
    				each_value = /*rows*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$A.name,
    		type: "if",
    		source: "(30:0) {#if paragraph}",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#each rows as { width }}
    function create_each_block$6(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			set_style(p, "width", /*width*/ ctx[2]);
    			toggle_class(p, "bx--skeleton__text", true);
    			toggle_class(p, "bx--skeleton__heading", /*heading*/ ctx[0]);
    			add_location(p, file$S, 32, 6, 979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*rows*/ 8) {
    				set_style(p, "width", /*width*/ ctx[2]);
    			}

    			if (dirty & /*heading*/ 1) {
    				toggle_class(p, "bx--skeleton__heading", /*heading*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(32:4) {#each rows as { width }}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$U(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*paragraph*/ ctx[1]) return create_if_block$A;
    		return create_else_block$e;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$U.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$U($$self, $$props, $$invalidate) {
    	let rows;
    	let widthNum;
    	let widthPx;
    	const omit_props_names = ["lines","heading","paragraph","width"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SkeletonText', slots, []);
    	let { lines = 3 } = $$props;
    	let { heading = false } = $$props;
    	let { paragraph = false } = $$props;
    	let { width = "100%" } = $$props;
    	const RANDOM = [0.973, 0.153, 0.567];

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('lines' in $$new_props) $$invalidate(5, lines = $$new_props.lines);
    		if ('heading' in $$new_props) $$invalidate(0, heading = $$new_props.heading);
    		if ('paragraph' in $$new_props) $$invalidate(1, paragraph = $$new_props.paragraph);
    		if ('width' in $$new_props) $$invalidate(2, width = $$new_props.width);
    	};

    	$$self.$capture_state = () => ({
    		lines,
    		heading,
    		paragraph,
    		width,
    		RANDOM,
    		widthPx,
    		rows,
    		widthNum
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('lines' in $$props) $$invalidate(5, lines = $$new_props.lines);
    		if ('heading' in $$props) $$invalidate(0, heading = $$new_props.heading);
    		if ('paragraph' in $$props) $$invalidate(1, paragraph = $$new_props.paragraph);
    		if ('width' in $$props) $$invalidate(2, width = $$new_props.width);
    		if ('widthPx' in $$props) $$invalidate(6, widthPx = $$new_props.widthPx);
    		if ('rows' in $$props) $$invalidate(3, rows = $$new_props.rows);
    		if ('widthNum' in $$props) $$invalidate(7, widthNum = $$new_props.widthNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 4) {
    			$$invalidate(7, widthNum = parseInt(width, 10));
    		}

    		if ($$self.$$.dirty & /*width*/ 4) {
    			$$invalidate(6, widthPx = width.includes("px"));
    		}

    		if ($$self.$$.dirty & /*paragraph, lines, widthPx, widthNum, rows, width*/ 238) {
    			if (paragraph) {
    				for (let i = 0; i < lines; i++) {
    					const min = widthPx ? widthNum - 75 : 0;
    					const max = widthPx ? widthNum : 75;
    					const rand = Math.floor(RANDOM[i % 3] * (max - min + 1)) + min + "px";

    					$$invalidate(3, rows = [
    						...rows,
    						{
    							width: widthPx ? rand : `calc(${width} - ${rand})`
    						}
    					]);
    				}
    			}
    		}
    	};

    	$$invalidate(3, rows = []);

    	return [
    		heading,
    		paragraph,
    		width,
    		rows,
    		$$restProps,
    		lines,
    		widthPx,
    		widthNum,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1
    	];
    }

    class SkeletonText extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$U, create_fragment$U, safe_not_equal, {
    			lines: 5,
    			heading: 0,
    			paragraph: 1,
    			width: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SkeletonText",
    			options,
    			id: create_fragment$U.name
    		});
    	}

    	get lines() {
    		throw new Error("<SkeletonText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lines(value) {
    		throw new Error("<SkeletonText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get heading() {
    		throw new Error("<SkeletonText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set heading(value) {
    		throw new Error("<SkeletonText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paragraph() {
    		throw new Error("<SkeletonText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paragraph(value) {
    		throw new Error("<SkeletonText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<SkeletonText>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<SkeletonText>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SkeletonText$1 = SkeletonText;

    /* node_modules\carbon-components-svelte\src\Accordion\AccordionSkeleton.svelte generated by Svelte v3.49.0 */
    const file$R = "node_modules\\carbon-components-svelte\\src\\Accordion\\AccordionSkeleton.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (38:2) {#if open}
    function create_if_block$z(ctx) {
    	let li;
    	let span;
    	let chevronright;
    	let t0;
    	let skeletontext0;
    	let t1;
    	let div;
    	let skeletontext1;
    	let t2;
    	let skeletontext2;
    	let t3;
    	let skeletontext3;
    	let current;

    	chevronright = new ChevronRight$1({
    			props: { class: "bx--accordion__arrow" },
    			$$inline: true
    		});

    	skeletontext0 = new SkeletonText$1({
    			props: { class: "bx--accordion__title" },
    			$$inline: true
    		});

    	skeletontext1 = new SkeletonText$1({ props: { width: "90%" }, $$inline: true });
    	skeletontext2 = new SkeletonText$1({ props: { width: "80%" }, $$inline: true });
    	skeletontext3 = new SkeletonText$1({ props: { width: "95%" }, $$inline: true });

    	const block = {
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			create_component(chevronright.$$.fragment);
    			t0 = space();
    			create_component(skeletontext0.$$.fragment);
    			t1 = space();
    			div = element("div");
    			create_component(skeletontext1.$$.fragment);
    			t2 = space();
    			create_component(skeletontext2.$$.fragment);
    			t3 = space();
    			create_component(skeletontext3.$$.fragment);
    			toggle_class(span, "bx--accordion__heading", true);
    			add_location(span, file$R, 42, 6, 1054);
    			toggle_class(div, "bx--accordion__content", true);
    			add_location(div, file$R, 46, 6, 1227);
    			toggle_class(li, "bx--accordion__item", true);
    			toggle_class(li, "bx--accordion__item--active", true);
    			add_location(li, file$R, 38, 4, 948);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			mount_component(chevronright, span, null);
    			append_dev(span, t0);
    			mount_component(skeletontext0, span, null);
    			append_dev(li, t1);
    			append_dev(li, div);
    			mount_component(skeletontext1, div, null);
    			append_dev(div, t2);
    			mount_component(skeletontext2, div, null);
    			append_dev(div, t3);
    			mount_component(skeletontext3, div, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronright.$$.fragment, local);
    			transition_in(skeletontext0.$$.fragment, local);
    			transition_in(skeletontext1.$$.fragment, local);
    			transition_in(skeletontext2.$$.fragment, local);
    			transition_in(skeletontext3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronright.$$.fragment, local);
    			transition_out(skeletontext0.$$.fragment, local);
    			transition_out(skeletontext1.$$.fragment, local);
    			transition_out(skeletontext2.$$.fragment, local);
    			transition_out(skeletontext3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(chevronright);
    			destroy_component(skeletontext0);
    			destroy_component(skeletontext1);
    			destroy_component(skeletontext2);
    			destroy_component(skeletontext3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$z.name,
    		type: "if",
    		source: "(38:2) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (54:2) {#each Array.from({ length: open ? count - 1 : count }, (_, i) => i) as item (item)}
    function create_each_block$5(key_1, ctx) {
    	let li;
    	let span;
    	let chevronright;
    	let t0;
    	let skeletontext;
    	let t1;
    	let current;

    	chevronright = new ChevronRight$1({
    			props: { class: "bx--accordion__arrow" },
    			$$inline: true
    		});

    	skeletontext = new SkeletonText$1({
    			props: { class: "bx--accordion__title" },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			create_component(chevronright.$$.fragment);
    			t0 = space();
    			create_component(skeletontext.$$.fragment);
    			t1 = space();
    			toggle_class(span, "bx--accordion__heading", true);
    			add_location(span, file$R, 55, 6, 1550);
    			toggle_class(li, "bx--accordion__item", true);
    			add_location(li, file$R, 54, 4, 1504);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			mount_component(chevronright, span, null);
    			append_dev(span, t0);
    			mount_component(skeletontext, span, null);
    			append_dev(li, t1);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronright.$$.fragment, local);
    			transition_in(skeletontext.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronright.$$.fragment, local);
    			transition_out(skeletontext.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(chevronright);
    			destroy_component(skeletontext);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(54:2) {#each Array.from({ length: open ? count - 1 : count }, (_, i) => i) as item (item)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$T(ctx) {
    	let ul;
    	let t;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*open*/ ctx[3] && create_if_block$z(ctx);

    	let each_value = Array.from(
    		{
    			length: /*open*/ ctx[3]
    			? /*count*/ ctx[0] - 1
    			: /*count*/ ctx[0]
    		},
    		func$1
    	);

    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[9];
    	validate_each_keys(ctx, each_value, get_each_context$5, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$5(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
    	}

    	let ul_levels = [/*$$restProps*/ ctx[4]];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (if_block) if_block.c();
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_attributes(ul, ul_data);
    			toggle_class(ul, "bx--skeleton", true);
    			toggle_class(ul, "bx--accordion", true);
    			toggle_class(ul, "bx--accordion--start", /*align*/ ctx[1] === 'start');
    			toggle_class(ul, "bx--accordion--end", /*align*/ ctx[1] === 'end');
    			toggle_class(ul, "bx--accordion--sm", /*size*/ ctx[2] === 'sm');
    			toggle_class(ul, "bx--accordion--xl", /*size*/ ctx[2] === 'xl');
    			add_location(ul, file$R, 24, 0, 601);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			if (if_block) if_block.m(ul, null);
    			append_dev(ul, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(ul, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(ul, "mouseover", /*mouseover_handler*/ ctx[6], false, false, false),
    					listen_dev(ul, "mouseenter", /*mouseenter_handler*/ ctx[7], false, false, false),
    					listen_dev(ul, "mouseleave", /*mouseleave_handler*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*open*/ ctx[3]) {
    				if (if_block) {
    					if (dirty & /*open*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$z(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(ul, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*open, count*/ 9) {
    				each_value = Array.from(
    					{
    						length: /*open*/ ctx[3]
    						? /*count*/ ctx[0] - 1
    						: /*count*/ ctx[0]
    					},
    					func$1
    				);

    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$5, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$5, null, get_each_context$5);
    				check_outros();
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]]));
    			toggle_class(ul, "bx--skeleton", true);
    			toggle_class(ul, "bx--accordion", true);
    			toggle_class(ul, "bx--accordion--start", /*align*/ ctx[1] === 'start');
    			toggle_class(ul, "bx--accordion--end", /*align*/ ctx[1] === 'end');
    			toggle_class(ul, "bx--accordion--sm", /*size*/ ctx[2] === 'sm');
    			toggle_class(ul, "bx--accordion--xl", /*size*/ ctx[2] === 'xl');
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (if_block) if_block.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$T.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func$1 = (_, i) => i;

    function instance$T($$self, $$props, $$invalidate) {
    	const omit_props_names = ["count","align","size","open"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AccordionSkeleton', slots, []);
    	let { count = 4 } = $$props;
    	let { align = "end" } = $$props;
    	let { size = undefined } = $$props;
    	let { open = true } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('count' in $$new_props) $$invalidate(0, count = $$new_props.count);
    		if ('align' in $$new_props) $$invalidate(1, align = $$new_props.align);
    		if ('size' in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ('open' in $$new_props) $$invalidate(3, open = $$new_props.open);
    	};

    	$$self.$capture_state = () => ({
    		count,
    		align,
    		size,
    		open,
    		ChevronRight: ChevronRight$1,
    		SkeletonText: SkeletonText$1
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('count' in $$props) $$invalidate(0, count = $$new_props.count);
    		if ('align' in $$props) $$invalidate(1, align = $$new_props.align);
    		if ('size' in $$props) $$invalidate(2, size = $$new_props.size);
    		if ('open' in $$props) $$invalidate(3, open = $$new_props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		count,
    		align,
    		size,
    		open,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class AccordionSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$T, create_fragment$T, safe_not_equal, { count: 0, align: 1, size: 2, open: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AccordionSkeleton",
    			options,
    			id: create_fragment$T.name
    		});
    	}

    	get count() {
    		throw new Error("<AccordionSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set count(value) {
    		throw new Error("<AccordionSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<AccordionSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<AccordionSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<AccordionSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<AccordionSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<AccordionSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<AccordionSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var AccordionSkeleton$1 = AccordionSkeleton;

    /* node_modules\carbon-components-svelte\src\Accordion\Accordion.svelte generated by Svelte v3.49.0 */
    const file$Q = "node_modules\\carbon-components-svelte\\src\\Accordion\\Accordion.svelte";

    // (44:0) {:else}
    function create_else_block$d(ctx) {
    	let ul;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let ul_levels = [/*$$restProps*/ ctx[3]];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			toggle_class(ul, "bx--accordion", true);
    			toggle_class(ul, "bx--accordion--start", /*align*/ ctx[0] === 'start');
    			toggle_class(ul, "bx--accordion--end", /*align*/ ctx[0] === 'end');
    			toggle_class(ul, "bx--accordion--sm", /*size*/ ctx[1] === 'sm');
    			toggle_class(ul, "bx--accordion--xl", /*size*/ ctx[1] === 'xl');
    			add_location(ul, file$Q, 44, 2, 991);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(ul, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(ul, "mouseover", /*mouseover_handler_1*/ ctx[8], false, false, false),
    					listen_dev(ul, "mouseenter", /*mouseenter_handler_1*/ ctx[9], false, false, false),
    					listen_dev(ul, "mouseleave", /*mouseleave_handler_1*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]]));
    			toggle_class(ul, "bx--accordion", true);
    			toggle_class(ul, "bx--accordion--start", /*align*/ ctx[0] === 'start');
    			toggle_class(ul, "bx--accordion--end", /*align*/ ctx[0] === 'end');
    			toggle_class(ul, "bx--accordion--sm", /*size*/ ctx[1] === 'sm');
    			toggle_class(ul, "bx--accordion--xl", /*size*/ ctx[1] === 'xl');
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$d.name,
    		type: "else",
    		source: "(44:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:0) {#if skeleton}
    function create_if_block$y(ctx) {
    	let accordionskeleton;
    	let current;
    	const accordionskeleton_spread_levels = [/*$$restProps*/ ctx[3], { align: /*align*/ ctx[0] }, { size: /*size*/ ctx[1] }];
    	let accordionskeleton_props = {};

    	for (let i = 0; i < accordionskeleton_spread_levels.length; i += 1) {
    		accordionskeleton_props = assign(accordionskeleton_props, accordionskeleton_spread_levels[i]);
    	}

    	accordionskeleton = new AccordionSkeleton$1({
    			props: accordionskeleton_props,
    			$$inline: true
    		});

    	accordionskeleton.$on("click", /*click_handler*/ ctx[11]);
    	accordionskeleton.$on("mouseover", /*mouseover_handler*/ ctx[12]);
    	accordionskeleton.$on("mouseenter", /*mouseenter_handler*/ ctx[13]);
    	accordionskeleton.$on("mouseleave", /*mouseleave_handler*/ ctx[14]);

    	const block = {
    		c: function create() {
    			create_component(accordionskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(accordionskeleton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const accordionskeleton_changes = (dirty & /*$$restProps, align, size*/ 11)
    			? get_spread_update(accordionskeleton_spread_levels, [
    					dirty & /*$$restProps*/ 8 && get_spread_object(/*$$restProps*/ ctx[3]),
    					dirty & /*align*/ 1 && { align: /*align*/ ctx[0] },
    					dirty & /*size*/ 2 && { size: /*size*/ ctx[1] }
    				])
    			: {};

    			accordionskeleton.$set(accordionskeleton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accordionskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accordionskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(accordionskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$y.name,
    		type: "if",
    		source: "(34:0) {#if skeleton}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$S(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$y, create_else_block$d];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*skeleton*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$S.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$S($$self, $$props, $$invalidate) {
    	const omit_props_names = ["align","size","disabled","skeleton"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Accordion', slots, ['default']);
    	let { align = "end" } = $$props;
    	let { size = undefined } = $$props;
    	let { disabled = false } = $$props;
    	let { skeleton = false } = $$props;
    	const disableItems = writable(disabled);
    	setContext("Accordion", { disableItems });

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('align' in $$new_props) $$invalidate(0, align = $$new_props.align);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ('disabled' in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('skeleton' in $$new_props) $$invalidate(2, skeleton = $$new_props.skeleton);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		align,
    		size,
    		disabled,
    		skeleton,
    		setContext,
    		writable,
    		AccordionSkeleton: AccordionSkeleton$1,
    		disableItems
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('align' in $$props) $$invalidate(0, align = $$new_props.align);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('skeleton' in $$props) $$invalidate(2, skeleton = $$new_props.skeleton);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*disabled*/ 16) {
    			disableItems.set(disabled);
    		}
    	};

    	return [
    		align,
    		size,
    		skeleton,
    		$$restProps,
    		disabled,
    		$$scope,
    		slots,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class Accordion extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$S, create_fragment$S, safe_not_equal, {
    			align: 0,
    			size: 1,
    			disabled: 4,
    			skeleton: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Accordion",
    			options,
    			id: create_fragment$S.name
    		});
    	}

    	get align() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skeleton() {
    		throw new Error("<Accordion>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skeleton(value) {
    		throw new Error("<Accordion>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Accordion$1 = Accordion;

    /* node_modules\carbon-components-svelte\src\Accordion\AccordionItem.svelte generated by Svelte v3.49.0 */
    const file$P = "node_modules\\carbon-components-svelte\\src\\Accordion\\AccordionItem.svelte";
    const get_title_slot_changes$1 = dirty => ({});
    const get_title_slot_context$1 = ctx => ({});

    // (73:25) {title}
    function fallback_block$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$8.name,
    		type: "fallback",
    		source: "(73:25) {title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$R(ctx) {
    	let li;
    	let button;
    	let chevronright;
    	let t0;
    	let div0;
    	let t1;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;

    	chevronright = new ChevronRight$1({
    			props: {
    				class: "bx--accordion__arrow",
    				"aria-label": /*iconDescription*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const title_slot_template = /*#slots*/ ctx[7].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[6], get_title_slot_context$1);
    	const title_slot_or_fallback = title_slot || fallback_block$8(ctx);
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let li_levels = [/*$$restProps*/ ctx[5]];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			create_component(chevronright.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			if (title_slot_or_fallback) title_slot_or_fallback.c();
    			t1 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			toggle_class(div0, "bx--accordion__title", true);
    			add_location(div0, file$P, 71, 4, 1867);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "title", /*iconDescription*/ ctx[3]);
    			attr_dev(button, "aria-expanded", /*open*/ ctx[0]);
    			button.disabled = /*disabled*/ ctx[1];
    			toggle_class(button, "bx--accordion__heading", true);
    			add_location(button, file$P, 49, 2, 1334);
    			toggle_class(div1, "bx--accordion__content", true);
    			add_location(div1, file$P, 75, 2, 1974);
    			set_attributes(li, li_data);
    			toggle_class(li, "bx--accordion__item", true);
    			toggle_class(li, "bx--accordion__item--active", /*open*/ ctx[0]);
    			toggle_class(li, "bx--accordion__item--disabled", /*disabled*/ ctx[1]);
    			toggle_class(li, "bx--accordion__item--expanding", /*animation*/ ctx[4] === 'expanding');
    			toggle_class(li, "bx--accordion__item--collapsing", /*animation*/ ctx[4] === 'collapsing');
    			add_location(li, file$P, 37, 0, 955);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			mount_component(chevronright, button, null);
    			append_dev(button, t0);
    			append_dev(button, div0);

    			if (title_slot_or_fallback) {
    				title_slot_or_fallback.m(div0, null);
    			}

    			append_dev(li, t1);
    			append_dev(li, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[9], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[14], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler*/ ctx[10], false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler*/ ctx[11], false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler*/ ctx[12], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[13], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler_1*/ ctx[15], false, false, false),
    					listen_dev(li, "animationend", /*animationend_handler*/ ctx[8], false, false, false),
    					listen_dev(li, "animationend", /*animationend_handler_1*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const chevronright_changes = {};
    			if (dirty & /*iconDescription*/ 8) chevronright_changes["aria-label"] = /*iconDescription*/ ctx[3];
    			chevronright.$set(chevronright_changes);

    			if (title_slot) {
    				if (title_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[6], dirty, get_title_slot_changes$1),
    						get_title_slot_context$1
    					);
    				}
    			} else {
    				if (title_slot_or_fallback && title_slot_or_fallback.p && (!current || dirty & /*title*/ 4)) {
    					title_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (!current || dirty & /*iconDescription*/ 8) {
    				attr_dev(button, "title", /*iconDescription*/ ctx[3]);
    			}

    			if (!current || dirty & /*open*/ 1) {
    				attr_dev(button, "aria-expanded", /*open*/ ctx[0]);
    			}

    			if (!current || dirty & /*disabled*/ 2) {
    				prop_dev(button, "disabled", /*disabled*/ ctx[1]);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]]));
    			toggle_class(li, "bx--accordion__item", true);
    			toggle_class(li, "bx--accordion__item--active", /*open*/ ctx[0]);
    			toggle_class(li, "bx--accordion__item--disabled", /*disabled*/ ctx[1]);
    			toggle_class(li, "bx--accordion__item--expanding", /*animation*/ ctx[4] === 'expanding');
    			toggle_class(li, "bx--accordion__item--collapsing", /*animation*/ ctx[4] === 'collapsing');
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronright.$$.fragment, local);
    			transition_in(title_slot_or_fallback, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronright.$$.fragment, local);
    			transition_out(title_slot_or_fallback, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(chevronright);
    			if (title_slot_or_fallback) title_slot_or_fallback.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$R.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$R($$self, $$props, $$invalidate) {
    	const omit_props_names = ["title","open","disabled","iconDescription"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AccordionItem', slots, ['title','default']);
    	let { title = "title" } = $$props;
    	let { open = false } = $$props;
    	let { disabled = false } = $$props;
    	let { iconDescription = "Expand/Collapse" } = $$props;
    	let initialDisabled = disabled;
    	const ctx = getContext("Accordion");

    	const unsubscribe = ctx.disableItems.subscribe(value => {
    		if (!value && initialDisabled) return;
    		$$invalidate(1, disabled = value);
    	});

    	let animation = undefined;

    	onMount(() => {
    		return () => {
    			unsubscribe();
    		};
    	});

    	function animationend_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_1 = () => {
    		$$invalidate(0, open = !open);
    		$$invalidate(4, animation = open ? 'expanding' : 'collapsing');
    	};

    	const keydown_handler_1 = ({ key }) => {
    		if (open && key === 'Escape') {
    			$$invalidate(0, open = false);
    		}
    	};

    	const animationend_handler_1 = () => {
    		$$invalidate(4, animation = undefined);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('title' in $$new_props) $$invalidate(2, title = $$new_props.title);
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('disabled' in $$new_props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ('iconDescription' in $$new_props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		open,
    		disabled,
    		iconDescription,
    		onMount,
    		getContext,
    		ChevronRight: ChevronRight$1,
    		initialDisabled,
    		ctx,
    		unsubscribe,
    		animation
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ('iconDescription' in $$props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    		if ('initialDisabled' in $$props) initialDisabled = $$new_props.initialDisabled;
    		if ('animation' in $$props) $$invalidate(4, animation = $$new_props.animation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open,
    		disabled,
    		title,
    		iconDescription,
    		animation,
    		$$restProps,
    		$$scope,
    		slots,
    		animationend_handler,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keydown_handler,
    		click_handler_1,
    		keydown_handler_1,
    		animationend_handler_1
    	];
    }

    class AccordionItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$R, create_fragment$R, safe_not_equal, {
    			title: 2,
    			open: 0,
    			disabled: 1,
    			iconDescription: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AccordionItem",
    			options,
    			id: create_fragment$R.name
    		});
    	}

    	get title() {
    		throw new Error("<AccordionItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<AccordionItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<AccordionItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<AccordionItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<AccordionItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<AccordionItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<AccordionItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<AccordionItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var AccordionItem$1 = AccordionItem;

    /* node_modules\carbon-components-svelte\src\Button\ButtonSkeleton.svelte generated by Svelte v3.49.0 */

    const file$O = "node_modules\\carbon-components-svelte\\src\\Button\\ButtonSkeleton.svelte";

    // (35:0) {:else}
    function create_else_block$c(ctx) {
    	let div;
    	let mounted;
    	let dispose;
    	let div_levels = [/*$$restProps*/ ctx[2]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--skeleton", true);
    			toggle_class(div, "bx--btn", true);
    			toggle_class(div, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(div, "bx--btn--sm", /*size*/ ctx[1] === 'small');
    			toggle_class(div, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(div, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    			add_location(div, file$O, 35, 2, 801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler_1*/ ctx[8], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler_1*/ ctx[9], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler_1*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]]));
    			toggle_class(div, "bx--skeleton", true);
    			toggle_class(div, "bx--btn", true);
    			toggle_class(div, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(div, "bx--btn--sm", /*size*/ ctx[1] === 'small');
    			toggle_class(div, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(div, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$c.name,
    		type: "else",
    		source: "(35:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:0) {#if href}
    function create_if_block$x(ctx) {
    	let a;
    	let t_value = "" + "";
    	let t;
    	let a_rel_value;
    	let mounted;
    	let dispose;

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{
    			rel: a_rel_value = /*$$restProps*/ ctx[2].target === '_blank'
    			? 'noopener noreferrer'
    			: undefined
    		},
    		{ role: "button" },
    		/*$$restProps*/ ctx[2]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--skeleton", true);
    			toggle_class(a, "bx--btn", true);
    			toggle_class(a, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(a, "bx--btn--sm", /*size*/ ctx[1] === 'small');
    			toggle_class(a, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(a, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    			add_location(a, file$O, 16, 2, 337);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler*/ ctx[4], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler*/ ctx[5], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*href*/ 1 && { href: /*href*/ ctx[0] },
    				dirty & /*$$restProps*/ 4 && a_rel_value !== (a_rel_value = /*$$restProps*/ ctx[2].target === '_blank'
    				? 'noopener noreferrer'
    				: undefined) && { rel: a_rel_value },
    				{ role: "button" },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));

    			toggle_class(a, "bx--skeleton", true);
    			toggle_class(a, "bx--btn", true);
    			toggle_class(a, "bx--btn--field", /*size*/ ctx[1] === 'field');
    			toggle_class(a, "bx--btn--sm", /*size*/ ctx[1] === 'small');
    			toggle_class(a, "bx--btn--lg", /*size*/ ctx[1] === 'lg');
    			toggle_class(a, "bx--btn--xl", /*size*/ ctx[1] === 'xl');
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$x.name,
    		type: "if",
    		source: "(16:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$Q(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[0]) return create_if_block$x;
    		return create_else_block$c;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$Q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$Q($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","size"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ButtonSkeleton', slots, []);
    	let { href = undefined } = $$props;
    	let { size = "default" } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    	};

    	$$self.$capture_state = () => ({ href, size });

    	$$self.$inject_state = $$new_props => {
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		href,
    		size,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1
    	];
    }

    class ButtonSkeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$Q, create_fragment$Q, safe_not_equal, { href: 0, size: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonSkeleton",
    			options,
    			id: create_fragment$Q.name
    		});
    	}

    	get href() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ButtonSkeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ButtonSkeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ButtonSkeleton$1 = ButtonSkeleton;

    /* node_modules\carbon-components-svelte\src\Button\Button.svelte generated by Svelte v3.49.0 */
    const file$N = "node_modules\\carbon-components-svelte\\src\\Button\\Button.svelte";
    const get_default_slot_changes$4 = dirty => ({ props: dirty[0] & /*buttonProps*/ 512 });
    const get_default_slot_context$4 = ctx => ({ props: /*buttonProps*/ ctx[9] });

    // (163:0) {:else}
    function create_else_block$b(ctx) {
    	let button;
    	let t;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasIconOnly*/ ctx[8] && create_if_block_4$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	var switch_value = /*icon*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-hidden": "true",
    				class: "bx--btn__icon",
    				"aria-label": /*iconDescription*/ ctx[3]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	let button_levels = [/*buttonProps*/ ctx[9]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(button, button_data);
    			add_location(button, file$N, 163, 2, 4429);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (switch_instance) {
    				mount_component(switch_instance, button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[33](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_2*/ ctx[24], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler_2*/ ctx[25], false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler_2*/ ctx[26], false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler_2*/ ctx[27], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hasIconOnly*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4$3(ctx);
    					if_block.c();
    					if_block.m(button, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*iconDescription*/ 8) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[3];

    			if (switch_value !== (switch_value = /*icon*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, button, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty[0] & /*buttonProps*/ 512 && /*buttonProps*/ ctx[9]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (switch_instance) destroy_component(switch_instance);
    			/*button_binding*/ ctx[33](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$b.name,
    		type: "else",
    		source: "(163:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (143:28) 
    function create_if_block_2$5(ctx) {
    	let a;
    	let t;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*hasIconOnly*/ ctx[8] && create_if_block_3$4(ctx);
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	var switch_value = /*icon*/ ctx[2];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-hidden": "true",
    				class: "bx--btn__icon",
    				"aria-label": /*iconDescription*/ ctx[3]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	let a_levels = [/*buttonProps*/ ctx[9]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(a, a_data);
    			add_location(a, file$N, 144, 2, 4046);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if (if_block) if_block.m(a, null);
    			append_dev(a, t);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			if (switch_instance) {
    				mount_component(switch_instance, a, null);
    			}

    			/*a_binding*/ ctx[32](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler_1*/ ctx[20], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler_1*/ ctx[21], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler_1*/ ctx[22], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler_1*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*hasIconOnly*/ ctx[8]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$4(ctx);
    					if_block.c();
    					if_block.m(a, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			const switch_instance_changes = {};
    			if (dirty[0] & /*iconDescription*/ 8) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[3];

    			if (switch_value !== (switch_value = /*icon*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, a, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [dirty[0] & /*buttonProps*/ 512 && /*buttonProps*/ ctx[9]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			if (switch_instance) destroy_component(switch_instance);
    			/*a_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(143:28) ",
    		ctx
    	});

    	return block;
    }

    // (141:13) 
    function create_if_block_1$8(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context$4);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope, buttonProps*/ 262656)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes$4),
    						get_default_slot_context$4
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(141:13) ",
    		ctx
    	});

    	return block;
    }

    // (130:0) {#if skeleton}
    function create_if_block$w(ctx) {
    	let buttonskeleton;
    	let current;

    	const buttonskeleton_spread_levels = [
    		{ href: /*href*/ ctx[7] },
    		{ size: /*size*/ ctx[1] },
    		/*$$restProps*/ ctx[10],
    		{
    			style: /*hasIconOnly*/ ctx[8] && 'width: 3rem;'
    		}
    	];

    	let buttonskeleton_props = {};

    	for (let i = 0; i < buttonskeleton_spread_levels.length; i += 1) {
    		buttonskeleton_props = assign(buttonskeleton_props, buttonskeleton_spread_levels[i]);
    	}

    	buttonskeleton = new ButtonSkeleton$1({
    			props: buttonskeleton_props,
    			$$inline: true
    		});

    	buttonskeleton.$on("click", /*click_handler*/ ctx[28]);
    	buttonskeleton.$on("mouseover", /*mouseover_handler*/ ctx[29]);
    	buttonskeleton.$on("mouseenter", /*mouseenter_handler*/ ctx[30]);
    	buttonskeleton.$on("mouseleave", /*mouseleave_handler*/ ctx[31]);

    	const block = {
    		c: function create() {
    			create_component(buttonskeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(buttonskeleton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const buttonskeleton_changes = (dirty[0] & /*href, size, $$restProps, hasIconOnly*/ 1410)
    			? get_spread_update(buttonskeleton_spread_levels, [
    					dirty[0] & /*href*/ 128 && { href: /*href*/ ctx[7] },
    					dirty[0] & /*size*/ 2 && { size: /*size*/ ctx[1] },
    					dirty[0] & /*$$restProps*/ 1024 && get_spread_object(/*$$restProps*/ ctx[10]),
    					dirty[0] & /*hasIconOnly*/ 256 && {
    						style: /*hasIconOnly*/ ctx[8] && 'width: 3rem;'
    					}
    				])
    			: {};

    			buttonskeleton.$set(buttonskeleton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttonskeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttonskeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(buttonskeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$w.name,
    		type: "if",
    		source: "(130:0) {#if skeleton}",
    		ctx
    	});

    	return block;
    }

    // (172:4) {#if hasIconOnly}
    function create_if_block_4$3(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*iconDescription*/ ctx[3]);
    			toggle_class(span, "bx--assistive-text", true);
    			add_location(span, file$N, 172, 6, 4578);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconDescription*/ 8) set_data_dev(t, /*iconDescription*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(172:4) {#if hasIconOnly}",
    		ctx
    	});

    	return block;
    }

    // (153:4) {#if hasIconOnly}
    function create_if_block_3$4(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*iconDescription*/ ctx[3]);
    			toggle_class(span, "bx--assistive-text", true);
    			add_location(span, file$N, 153, 6, 4190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*iconDescription*/ 8) set_data_dev(t, /*iconDescription*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(153:4) {#if hasIconOnly}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$P(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$w, create_if_block_1$8, create_if_block_2$5, create_else_block$b];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*skeleton*/ ctx[5]) return 0;
    		if (/*as*/ ctx[4]) return 1;
    		if (/*href*/ ctx[7] && !/*disabled*/ ctx[6]) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$P.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$P($$self, $$props, $$invalidate) {
    	let hasIconOnly;
    	let buttonProps;

    	const omit_props_names = [
    		"kind","size","expressive","isSelected","icon","iconDescription","tooltipAlignment","tooltipPosition","as","skeleton","disabled","href","tabindex","type","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { kind = "primary" } = $$props;
    	let { size = "default" } = $$props;
    	let { expressive = false } = $$props;
    	let { isSelected = false } = $$props;
    	let { icon = undefined } = $$props;
    	let { iconDescription = undefined } = $$props;
    	let { tooltipAlignment = "center" } = $$props;
    	let { tooltipPosition = "bottom" } = $$props;
    	let { as = false } = $$props;
    	let { skeleton = false } = $$props;
    	let { disabled = false } = $$props;
    	let { href = undefined } = $$props;
    	let { tabindex = "0" } = $$props;
    	let { type = "button" } = $$props;
    	let { ref = null } = $$props;
    	const ctx = getContext("ComposedModal");

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('kind' in $$new_props) $$invalidate(11, kind = $$new_props.kind);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ('expressive' in $$new_props) $$invalidate(12, expressive = $$new_props.expressive);
    		if ('isSelected' in $$new_props) $$invalidate(13, isSelected = $$new_props.isSelected);
    		if ('icon' in $$new_props) $$invalidate(2, icon = $$new_props.icon);
    		if ('iconDescription' in $$new_props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    		if ('tooltipAlignment' in $$new_props) $$invalidate(14, tooltipAlignment = $$new_props.tooltipAlignment);
    		if ('tooltipPosition' in $$new_props) $$invalidate(15, tooltipPosition = $$new_props.tooltipPosition);
    		if ('as' in $$new_props) $$invalidate(4, as = $$new_props.as);
    		if ('skeleton' in $$new_props) $$invalidate(5, skeleton = $$new_props.skeleton);
    		if ('disabled' in $$new_props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(7, href = $$new_props.href);
    		if ('tabindex' in $$new_props) $$invalidate(16, tabindex = $$new_props.tabindex);
    		if ('type' in $$new_props) $$invalidate(17, type = $$new_props.type);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		kind,
    		size,
    		expressive,
    		isSelected,
    		icon,
    		iconDescription,
    		tooltipAlignment,
    		tooltipPosition,
    		as,
    		skeleton,
    		disabled,
    		href,
    		tabindex,
    		type,
    		ref,
    		getContext,
    		ButtonSkeleton: ButtonSkeleton$1,
    		ctx,
    		hasIconOnly,
    		buttonProps
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('kind' in $$props) $$invalidate(11, kind = $$new_props.kind);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    		if ('expressive' in $$props) $$invalidate(12, expressive = $$new_props.expressive);
    		if ('isSelected' in $$props) $$invalidate(13, isSelected = $$new_props.isSelected);
    		if ('icon' in $$props) $$invalidate(2, icon = $$new_props.icon);
    		if ('iconDescription' in $$props) $$invalidate(3, iconDescription = $$new_props.iconDescription);
    		if ('tooltipAlignment' in $$props) $$invalidate(14, tooltipAlignment = $$new_props.tooltipAlignment);
    		if ('tooltipPosition' in $$props) $$invalidate(15, tooltipPosition = $$new_props.tooltipPosition);
    		if ('as' in $$props) $$invalidate(4, as = $$new_props.as);
    		if ('skeleton' in $$props) $$invalidate(5, skeleton = $$new_props.skeleton);
    		if ('disabled' in $$props) $$invalidate(6, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(7, href = $$new_props.href);
    		if ('tabindex' in $$props) $$invalidate(16, tabindex = $$new_props.tabindex);
    		if ('type' in $$props) $$invalidate(17, type = $$new_props.type);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('hasIconOnly' in $$props) $$invalidate(8, hasIconOnly = $$new_props.hasIconOnly);
    		if ('buttonProps' in $$props) $$invalidate(9, buttonProps = $$new_props.buttonProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*ref*/ 1) {
    			if (ctx && ref) {
    				ctx.declareRef(ref);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*icon*/ 4) {
    			$$invalidate(8, hasIconOnly = icon && !$$slots.default);
    		}

    		$$invalidate(9, buttonProps = {
    			type: href && !disabled ? undefined : type,
    			tabindex,
    			disabled: disabled === true ? true : undefined,
    			href,
    			"aria-pressed": hasIconOnly && kind === "ghost" && !href
    			? isSelected
    			: undefined,
    			...$$restProps,
    			class: [
    				"bx--btn",
    				expressive && "bx--btn--expressive",
    				(size === "small" && !expressive || size === "sm" && !expressive || size === "small" && !expressive) && "bx--btn--sm",
    				size === "field" && !expressive || size === "md" && !expressive && "bx--btn--md",
    				size === "field" && "bx--btn--field",
    				size === "small" && "bx--btn--sm",
    				size === "lg" && "bx--btn--lg",
    				size === "xl" && "bx--btn--xl",
    				kind && `bx--btn--${kind}`,
    				disabled && "bx--btn--disabled",
    				hasIconOnly && "bx--btn--icon-only",
    				hasIconOnly && "bx--tooltip__trigger",
    				hasIconOnly && "bx--tooltip--a11y",
    				hasIconOnly && tooltipPosition && `bx--btn--icon-only--${tooltipPosition}`,
    				hasIconOnly && tooltipAlignment && `bx--tooltip--align-${tooltipAlignment}`,
    				hasIconOnly && isSelected && kind === "ghost" && "bx--btn--selected",
    				$$restProps.class
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		ref,
    		size,
    		icon,
    		iconDescription,
    		as,
    		skeleton,
    		disabled,
    		href,
    		hasIconOnly,
    		buttonProps,
    		$$restProps,
    		kind,
    		expressive,
    		isSelected,
    		tooltipAlignment,
    		tooltipPosition,
    		tabindex,
    		type,
    		$$scope,
    		slots,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1,
    		click_handler_2,
    		mouseover_handler_2,
    		mouseenter_handler_2,
    		mouseleave_handler_2,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$P,
    			create_fragment$P,
    			safe_not_equal,
    			{
    				kind: 11,
    				size: 1,
    				expressive: 12,
    				isSelected: 13,
    				icon: 2,
    				iconDescription: 3,
    				tooltipAlignment: 14,
    				tooltipPosition: 15,
    				as: 4,
    				skeleton: 5,
    				disabled: 6,
    				href: 7,
    				tabindex: 16,
    				type: 17,
    				ref: 0
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$P.name
    		});
    	}

    	get kind() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kind(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expressive() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expressive(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelected() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipAlignment() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipAlignment(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipPosition() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipPosition(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get as() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skeleton() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skeleton(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Button$1 = Button;

    /* node_modules\carbon-components-svelte\src\Checkbox\InlineCheckbox.svelte generated by Svelte v3.49.0 */

    const file$M = "node_modules\\carbon-components-svelte\\src\\Checkbox\\InlineCheckbox.svelte";

    function create_fragment$O(ctx) {
    	let div;
    	let input;
    	let input_checked_value;
    	let input_aria_checked_value;
    	let t;
    	let label;
    	let label_aria_label_value;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ type: "checkbox" },
    		{
    			checked: input_checked_value = /*indeterminate*/ ctx[2] ? false : /*checked*/ ctx[1]
    		},
    		{ indeterminate: /*indeterminate*/ ctx[2] },
    		{ id: /*id*/ ctx[4] },
    		/*$$restProps*/ ctx[5],
    		{
    			"aria-checked": input_aria_checked_value = /*indeterminate*/ ctx[2] ? 'mixed' : /*checked*/ ctx[1]
    		}
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t = space();
    			label = element("label");
    			set_attributes(input, input_data);
    			toggle_class(input, "bx--checkbox", true);
    			add_location(input, file$M, 21, 2, 530);
    			attr_dev(label, "for", /*id*/ ctx[4]);
    			attr_dev(label, "title", /*title*/ ctx[3]);
    			attr_dev(label, "aria-label", label_aria_label_value = /*$$props*/ ctx[6]['aria-label']);
    			toggle_class(label, "bx--checkbox-label", true);
    			add_location(label, file$M, 32, 2, 806);
    			toggle_class(div, "bx--checkbox--inline", true);
    			add_location(div, file$M, 20, 0, 486);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[8](input);
    			append_dev(div, t);
    			append_dev(div, label);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*change_handler*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				{ type: "checkbox" },
    				dirty & /*indeterminate, checked*/ 6 && input_checked_value !== (input_checked_value = /*indeterminate*/ ctx[2] ? false : /*checked*/ ctx[1]) && { checked: input_checked_value },
    				dirty & /*indeterminate*/ 4 && { indeterminate: /*indeterminate*/ ctx[2] },
    				dirty & /*id*/ 16 && { id: /*id*/ ctx[4] },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5],
    				dirty & /*indeterminate, checked*/ 6 && input_aria_checked_value !== (input_aria_checked_value = /*indeterminate*/ ctx[2] ? 'mixed' : /*checked*/ ctx[1]) && { "aria-checked": input_aria_checked_value }
    			]));

    			toggle_class(input, "bx--checkbox", true);

    			if (dirty & /*id*/ 16) {
    				attr_dev(label, "for", /*id*/ ctx[4]);
    			}

    			if (dirty & /*title*/ 8) {
    				attr_dev(label, "title", /*title*/ ctx[3]);
    			}

    			if (dirty & /*$$props*/ 64 && label_aria_label_value !== (label_aria_label_value = /*$$props*/ ctx[6]['aria-label'])) {
    				attr_dev(label, "aria-label", label_aria_label_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input_binding*/ ctx[8](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$O.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$O($$self, $$props, $$invalidate) {
    	const omit_props_names = ["checked","indeterminate","title","id","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InlineCheckbox', slots, []);
    	let { checked = false } = $$props;
    	let { indeterminate = false } = $$props;
    	let { title = undefined } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('checked' in $$new_props) $$invalidate(1, checked = $$new_props.checked);
    		if ('indeterminate' in $$new_props) $$invalidate(2, indeterminate = $$new_props.indeterminate);
    		if ('title' in $$new_props) $$invalidate(3, title = $$new_props.title);
    		if ('id' in $$new_props) $$invalidate(4, id = $$new_props.id);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({ checked, indeterminate, title, id, ref });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
    		if ('checked' in $$props) $$invalidate(1, checked = $$new_props.checked);
    		if ('indeterminate' in $$props) $$invalidate(2, indeterminate = $$new_props.indeterminate);
    		if ('title' in $$props) $$invalidate(3, title = $$new_props.title);
    		if ('id' in $$props) $$invalidate(4, id = $$new_props.id);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		ref,
    		checked,
    		indeterminate,
    		title,
    		id,
    		$$restProps,
    		$$props,
    		change_handler,
    		input_binding
    	];
    }

    class InlineCheckbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$O, create_fragment$O, safe_not_equal, {
    			checked: 1,
    			indeterminate: 2,
    			title: 3,
    			id: 4,
    			ref: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InlineCheckbox",
    			options,
    			id: create_fragment$O.name
    		});
    	}

    	get checked() {
    		throw new Error("<InlineCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<InlineCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indeterminate() {
    		throw new Error("<InlineCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indeterminate(value) {
    		throw new Error("<InlineCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<InlineCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<InlineCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<InlineCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<InlineCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<InlineCheckbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<InlineCheckbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var InlineCheckbox$1 = InlineCheckbox;

    /* node_modules\carbon-components-svelte\src\icons\CaretRight.svelte generated by Svelte v3.49.0 */

    const file$L = "node_modules\\carbon-components-svelte\\src\\icons\\CaretRight.svelte";

    // (24:2) {#if title}
    function create_if_block$v(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$L, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$v.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$N(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$v(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M12 8L22 16 12 24z");
    			add_location(path, file$L, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$L, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$v(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$N.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$N($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CaretRight', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class CaretRight extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$N, create_fragment$N, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CaretRight",
    			options,
    			id: create_fragment$N.name
    		});
    	}

    	get size() {
    		throw new Error("<CaretRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<CaretRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<CaretRight>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<CaretRight>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var CaretRight$1 = CaretRight;

    /* node_modules\carbon-components-svelte\src\icons\WarningFilled.svelte generated by Svelte v3.49.0 */

    const file$K = "node_modules\\carbon-components-svelte\\src\\icons\\WarningFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$u(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$K, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$u.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$M(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let if_block = /*title*/ ctx[1] && create_if_block$u(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14C30,8.3,23.7,2,16,2z M14.9,8h2.2v11h-2.2V8z M16,25\tc-0.8,0-1.5-0.7-1.5-1.5S15.2,22,16,22c0.8,0,1.5,0.7,1.5,1.5S16.8,25,16,25z");
    			add_location(path0, file$K, 24, 2, 579);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M17.5,23.5c0,0.8-0.7,1.5-1.5,1.5c-0.8,0-1.5-0.7-1.5-1.5S15.2,22,16,22\tC16.8,22,17.5,22.7,17.5,23.5z M17.1,8h-2.2v11h2.2V8z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$K, 26, 10, 777);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$K, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$u(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$M.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$M($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WarningFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class WarningFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$M, create_fragment$M, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WarningFilled",
    			options,
    			id: create_fragment$M.name
    		});
    	}

    	get size() {
    		throw new Error("<WarningFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<WarningFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<WarningFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<WarningFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var WarningFilled$1 = WarningFilled;

    /* node_modules\carbon-components-svelte\src\icons\WarningAltFilled.svelte generated by Svelte v3.49.0 */

    const file$J = "node_modules\\carbon-components-svelte\\src\\icons\\WarningAltFilled.svelte";

    // (24:2) {#if title}
    function create_if_block$t(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$J, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$t.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$L(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let path2;
    	let if_block = /*title*/ ctx[1] && create_if_block$t(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			attr_dev(path0, "fill", "none");
    			attr_dev(path0, "d", "M16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Zm-1.125-5h2.25V12h-2.25Z");
    			attr_dev(path0, "data-icon-path", "inner-path");
    			add_location(path0, file$J, 24, 2, 579);
    			attr_dev(path1, "d", "M16.002,6.1714h-.004L4.6487,27.9966,4.6506,28H27.3494l.0019-.0034ZM14.875,12h2.25v9h-2.25ZM16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Z");
    			add_location(path1, file$J, 27, 39, 722);
    			attr_dev(path2, "d", "M29,30H3a1,1,0,0,1-.8872-1.4614l13-25a1,1,0,0,1,1.7744,0l13,25A1,1,0,0,1,29,30ZM4.6507,28H27.3493l.002-.0033L16.002,6.1714h-.004L4.6487,27.9967Z");
    			add_location(path2, file$J, 29, 10, 886);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$J, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			append_dev(svg, path2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$t(ctx);
    					if_block.c();
    					if_block.m(svg, path0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$L.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$L($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('WarningAltFilled', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class WarningAltFilled extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$L, create_fragment$L, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "WarningAltFilled",
    			options,
    			id: create_fragment$L.name
    		});
    	}

    	get size() {
    		throw new Error("<WarningAltFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<WarningAltFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<WarningAltFilled>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<WarningAltFilled>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var WarningAltFilled$1 = WarningAltFilled;

    /* node_modules\carbon-components-svelte\src\icons\ChevronDown.svelte generated by Svelte v3.49.0 */

    const file$I = "node_modules\\carbon-components-svelte\\src\\icons\\ChevronDown.svelte";

    // (24:2) {#if title}
    function create_if_block$s(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$I, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$s.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$K(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$s(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M16 22L6 12 7.4 10.6 16 19.2 24.6 10.6 26 12z");
    			add_location(path, file$I, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$I, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$s(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$K.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$K($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChevronDown', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class ChevronDown extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$K, create_fragment$K, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChevronDown",
    			options,
    			id: create_fragment$K.name
    		});
    	}

    	get size() {
    		throw new Error("<ChevronDown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ChevronDown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ChevronDown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ChevronDown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ChevronDown$1 = ChevronDown;

    /* node_modules\carbon-components-svelte\src\icons\Close.svelte generated by Svelte v3.49.0 */

    const file$H = "node_modules\\carbon-components-svelte\\src\\icons\\Close.svelte";

    // (24:2) {#if title}
    function create_if_block$r(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$H, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$r.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$J(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$r(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z");
    			add_location(path, file$H, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$H, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$r(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$J.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$J($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Close', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class Close extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$J, create_fragment$J, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close",
    			options,
    			id: create_fragment$J.name
    		});
    	}

    	get size() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Close>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Close>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Close$1 = Close;

    /* node_modules\carbon-components-svelte\src\RadioButton\RadioButton.svelte generated by Svelte v3.49.0 */
    const file$G = "node_modules\\carbon-components-svelte\\src\\RadioButton\\RadioButton.svelte";
    const get_labelText_slot_changes$2 = dirty => ({});
    const get_labelText_slot_context$2 = ctx => ({});

    // (74:4) {#if labelText || $$slots.labelText}
    function create_if_block$q(ctx) {
    	let span;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[16].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[15], get_labelText_slot_context$2);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block$7(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			toggle_class(span, "bx--visually-hidden", /*hideLabel*/ ctx[7]);
    			add_location(span, file$G, 74, 6, 1826);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[15], dirty, get_labelText_slot_changes$2),
    						get_labelText_slot_context$2
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty & /*labelText*/ 64)) {
    					labelText_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (dirty & /*hideLabel*/ 128) {
    				toggle_class(span, "bx--visually-hidden", /*hideLabel*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$q.name,
    		type: "if",
    		source: "(74:4) {#if labelText || $$slots.labelText}",
    		ctx
    	});

    	return block;
    }

    // (76:31)            
    function fallback_block$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[6]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*labelText*/ 64) set_data_dev(t, /*labelText*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$7.name,
    		type: "fallback",
    		source: "(76:31)            ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$I(ctx) {
    	let div;
    	let input;
    	let t0;
    	let label;
    	let span;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = (/*labelText*/ ctx[6] || /*$$slots*/ ctx[13].labelText) && create_if_block$q(ctx);
    	let div_levels = [/*$$restProps*/ ctx[12]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			span = element("span");
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "id", /*id*/ ctx[8]);
    			attr_dev(input, "name", /*name*/ ctx[9]);
    			input.checked = /*checked*/ ctx[0];
    			input.disabled = /*disabled*/ ctx[3];
    			input.required = /*required*/ ctx[4];
    			input.value = /*value*/ ctx[2];
    			toggle_class(input, "bx--radio-button", true);
    			add_location(input, file$G, 54, 2, 1344);
    			toggle_class(span, "bx--radio-button__appearance", true);
    			add_location(span, file$G, 72, 4, 1721);
    			attr_dev(label, "for", /*id*/ ctx[8]);
    			toggle_class(label, "bx--radio-button__label", true);
    			add_location(label, file$G, 71, 2, 1659);
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--radio-button-wrapper", true);
    			toggle_class(div, "bx--radio-button-wrapper--label-left", /*labelPosition*/ ctx[5] === 'left');
    			add_location(div, file$G, 49, 0, 1200);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			/*input_binding*/ ctx[18](input);
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, span);
    			append_dev(label, t1);
    			if (if_block) if_block.m(label, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler*/ ctx[17], false, false, false),
    					listen_dev(input, "change", /*change_handler_1*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*id*/ 256) {
    				attr_dev(input, "id", /*id*/ ctx[8]);
    			}

    			if (!current || dirty & /*name*/ 512) {
    				attr_dev(input, "name", /*name*/ ctx[9]);
    			}

    			if (!current || dirty & /*checked*/ 1) {
    				prop_dev(input, "checked", /*checked*/ ctx[0]);
    			}

    			if (!current || dirty & /*disabled*/ 8) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[3]);
    			}

    			if (!current || dirty & /*required*/ 16) {
    				prop_dev(input, "required", /*required*/ ctx[4]);
    			}

    			if (!current || dirty & /*value*/ 4) {
    				prop_dev(input, "value", /*value*/ ctx[2]);
    			}

    			if (/*labelText*/ ctx[6] || /*$$slots*/ ctx[13].labelText) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*labelText, $$slots*/ 8256) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$q(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(label, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*id*/ 256) {
    				attr_dev(label, "for", /*id*/ ctx[8]);
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]]));
    			toggle_class(div, "bx--radio-button-wrapper", true);
    			toggle_class(div, "bx--radio-button-wrapper--label-left", /*labelPosition*/ ctx[5] === 'left');
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*input_binding*/ ctx[18](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$I.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$I($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"value","checked","disabled","required","labelPosition","labelText","hideLabel","id","name","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $selectedValue;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RadioButton', slots, ['labelText']);
    	const $$slots = compute_slots(slots);
    	let { value = "" } = $$props;
    	let { checked = false } = $$props;
    	let { disabled = false } = $$props;
    	let { required = false } = $$props;
    	let { labelPosition = "right" } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = "" } = $$props;
    	let { ref = null } = $$props;
    	const ctx = getContext("RadioButtonGroup");

    	const selectedValue = ctx
    	? ctx.selectedValue
    	: writable(checked ? value : undefined);

    	validate_store(selectedValue, 'selectedValue');
    	component_subscribe($$self, selectedValue, value => $$invalidate(14, $selectedValue = value));

    	if (ctx) {
    		ctx.add({ id, checked, disabled, value });
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const change_handler_1 = () => {
    		if (ctx) {
    			ctx.update(value);
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(2, value = $$new_props.value);
    		if ('checked' in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ('disabled' in $$new_props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('required' in $$new_props) $$invalidate(4, required = $$new_props.required);
    		if ('labelPosition' in $$new_props) $$invalidate(5, labelPosition = $$new_props.labelPosition);
    		if ('labelText' in $$new_props) $$invalidate(6, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$new_props) $$invalidate(7, hideLabel = $$new_props.hideLabel);
    		if ('id' in $$new_props) $$invalidate(8, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(9, name = $$new_props.name);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		checked,
    		disabled,
    		required,
    		labelPosition,
    		labelText,
    		hideLabel,
    		id,
    		name,
    		ref,
    		getContext,
    		writable,
    		ctx,
    		selectedValue,
    		$selectedValue
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(2, value = $$new_props.value);
    		if ('checked' in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('required' in $$props) $$invalidate(4, required = $$new_props.required);
    		if ('labelPosition' in $$props) $$invalidate(5, labelPosition = $$new_props.labelPosition);
    		if ('labelText' in $$props) $$invalidate(6, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$props) $$invalidate(7, hideLabel = $$new_props.hideLabel);
    		if ('id' in $$props) $$invalidate(8, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(9, name = $$new_props.name);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$selectedValue, value*/ 16388) {
    			$$invalidate(0, checked = $selectedValue === value);
    		}
    	};

    	return [
    		checked,
    		ref,
    		value,
    		disabled,
    		required,
    		labelPosition,
    		labelText,
    		hideLabel,
    		id,
    		name,
    		ctx,
    		selectedValue,
    		$$restProps,
    		$$slots,
    		$selectedValue,
    		$$scope,
    		slots,
    		change_handler,
    		input_binding,
    		change_handler_1
    	];
    }

    class RadioButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$I, create_fragment$I, safe_not_equal, {
    			value: 2,
    			checked: 0,
    			disabled: 3,
    			required: 4,
    			labelPosition: 5,
    			labelText: 6,
    			hideLabel: 7,
    			id: 8,
    			name: 9,
    			ref: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RadioButton",
    			options,
    			id: create_fragment$I.name
    		});
    	}

    	get value() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelPosition() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelPosition(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var RadioButton$1 = RadioButton;

    /* node_modules\carbon-components-svelte\src\DataTable\Table.svelte generated by Svelte v3.49.0 */

    const file$F = "node_modules\\carbon-components-svelte\\src\\DataTable\\Table.svelte";

    // (44:0) {:else}
    function create_else_block$a(ctx) {
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let table_levels = [/*$$restProps*/ ctx[6], { style: /*tableStyle*/ ctx[5] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (default_slot) default_slot.c();
    			set_attributes(table, table_data);
    			toggle_class(table, "bx--data-table", true);
    			toggle_class(table, "bx--data-table--compact", /*size*/ ctx[0] === 'compact');
    			toggle_class(table, "bx--data-table--short", /*size*/ ctx[0] === 'short');
    			toggle_class(table, "bx--data-table--tall", /*size*/ ctx[0] === 'tall');
    			toggle_class(table, "bx--data-table--md", /*size*/ ctx[0] === 'medium');
    			toggle_class(table, "bx--data-table--sort", /*sortable*/ ctx[3]);
    			toggle_class(table, "bx--data-table--zebra", /*zebra*/ ctx[1]);
    			toggle_class(table, "bx--data-table--static", /*useStaticWidth*/ ctx[2]);
    			toggle_class(table, "bx--data-table--sticky-header", /*stickyHeader*/ ctx[4]);
    			add_location(table, file$F, 44, 2, 1235);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*tableStyle*/ 32) && { style: /*tableStyle*/ ctx[5] }
    			]));

    			toggle_class(table, "bx--data-table", true);
    			toggle_class(table, "bx--data-table--compact", /*size*/ ctx[0] === 'compact');
    			toggle_class(table, "bx--data-table--short", /*size*/ ctx[0] === 'short');
    			toggle_class(table, "bx--data-table--tall", /*size*/ ctx[0] === 'tall');
    			toggle_class(table, "bx--data-table--md", /*size*/ ctx[0] === 'medium');
    			toggle_class(table, "bx--data-table--sort", /*sortable*/ ctx[3]);
    			toggle_class(table, "bx--data-table--zebra", /*zebra*/ ctx[1]);
    			toggle_class(table, "bx--data-table--static", /*useStaticWidth*/ ctx[2]);
    			toggle_class(table, "bx--data-table--sticky-header", /*stickyHeader*/ ctx[4]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$a.name,
    		type: "else",
    		source: "(44:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (27:0) {#if stickyHeader}
    function create_if_block$p(ctx) {
    	let section;
    	let table;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);
    	let section_levels = [/*$$restProps*/ ctx[6]];
    	let section_data = {};

    	for (let i = 0; i < section_levels.length; i += 1) {
    		section_data = assign(section_data, section_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			table = element("table");
    			if (default_slot) default_slot.c();
    			attr_dev(table, "style", /*tableStyle*/ ctx[5]);
    			toggle_class(table, "bx--data-table", true);
    			toggle_class(table, "bx--data-table--compact", /*size*/ ctx[0] === 'compact');
    			toggle_class(table, "bx--data-table--short", /*size*/ ctx[0] === 'short');
    			toggle_class(table, "bx--data-table--tall", /*size*/ ctx[0] === 'tall');
    			toggle_class(table, "bx--data-table--md", /*size*/ ctx[0] === 'medium');
    			toggle_class(table, "bx--data-table--sort", /*sortable*/ ctx[3]);
    			toggle_class(table, "bx--data-table--zebra", /*zebra*/ ctx[1]);
    			toggle_class(table, "bx--data-table--static", /*useStaticWidth*/ ctx[2]);
    			toggle_class(table, "bx--data-table--sticky-header", /*stickyHeader*/ ctx[4]);
    			add_location(table, file$F, 28, 4, 685);
    			set_attributes(section, section_data);
    			toggle_class(section, "bx--data-table_inner-container", true);
    			add_location(section, file$F, 27, 2, 608);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, table);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*tableStyle*/ 32) {
    				attr_dev(table, "style", /*tableStyle*/ ctx[5]);
    			}

    			if (dirty & /*size*/ 1) {
    				toggle_class(table, "bx--data-table--compact", /*size*/ ctx[0] === 'compact');
    			}

    			if (dirty & /*size*/ 1) {
    				toggle_class(table, "bx--data-table--short", /*size*/ ctx[0] === 'short');
    			}

    			if (dirty & /*size*/ 1) {
    				toggle_class(table, "bx--data-table--tall", /*size*/ ctx[0] === 'tall');
    			}

    			if (dirty & /*size*/ 1) {
    				toggle_class(table, "bx--data-table--md", /*size*/ ctx[0] === 'medium');
    			}

    			if (dirty & /*sortable*/ 8) {
    				toggle_class(table, "bx--data-table--sort", /*sortable*/ ctx[3]);
    			}

    			if (dirty & /*zebra*/ 2) {
    				toggle_class(table, "bx--data-table--zebra", /*zebra*/ ctx[1]);
    			}

    			if (dirty & /*useStaticWidth*/ 4) {
    				toggle_class(table, "bx--data-table--static", /*useStaticWidth*/ ctx[2]);
    			}

    			if (dirty & /*stickyHeader*/ 16) {
    				toggle_class(table, "bx--data-table--sticky-header", /*stickyHeader*/ ctx[4]);
    			}

    			set_attributes(section, section_data = get_spread_update(section_levels, [dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]]));
    			toggle_class(section, "bx--data-table_inner-container", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$p.name,
    		type: "if",
    		source: "(27:0) {#if stickyHeader}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$H(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$p, create_else_block$a];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*stickyHeader*/ ctx[4]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$H.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$H($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size","zebra","useStaticWidth","sortable","stickyHeader","tableStyle"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, ['default']);
    	let { size = undefined } = $$props;
    	let { zebra = false } = $$props;
    	let { useStaticWidth = false } = $$props;
    	let { sortable = false } = $$props;
    	let { stickyHeader = false } = $$props;
    	let { tableStyle = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('zebra' in $$new_props) $$invalidate(1, zebra = $$new_props.zebra);
    		if ('useStaticWidth' in $$new_props) $$invalidate(2, useStaticWidth = $$new_props.useStaticWidth);
    		if ('sortable' in $$new_props) $$invalidate(3, sortable = $$new_props.sortable);
    		if ('stickyHeader' in $$new_props) $$invalidate(4, stickyHeader = $$new_props.stickyHeader);
    		if ('tableStyle' in $$new_props) $$invalidate(5, tableStyle = $$new_props.tableStyle);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		zebra,
    		useStaticWidth,
    		sortable,
    		stickyHeader,
    		tableStyle
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('zebra' in $$props) $$invalidate(1, zebra = $$new_props.zebra);
    		if ('useStaticWidth' in $$props) $$invalidate(2, useStaticWidth = $$new_props.useStaticWidth);
    		if ('sortable' in $$props) $$invalidate(3, sortable = $$new_props.sortable);
    		if ('stickyHeader' in $$props) $$invalidate(4, stickyHeader = $$new_props.stickyHeader);
    		if ('tableStyle' in $$props) $$invalidate(5, tableStyle = $$new_props.tableStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		size,
    		zebra,
    		useStaticWidth,
    		sortable,
    		stickyHeader,
    		tableStyle,
    		$$restProps,
    		$$scope,
    		slots
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$H, create_fragment$H, safe_not_equal, {
    			size: 0,
    			zebra: 1,
    			useStaticWidth: 2,
    			sortable: 3,
    			stickyHeader: 4,
    			tableStyle: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$H.name
    		});
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zebra() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zebra(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useStaticWidth() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useStaticWidth(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortable() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortable(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stickyHeader() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stickyHeader(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tableStyle() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tableStyle(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Table$1 = Table;

    /* node_modules\carbon-components-svelte\src\DataTable\TableBody.svelte generated by Svelte v3.49.0 */

    const file$E = "node_modules\\carbon-components-svelte\\src\\DataTable\\TableBody.svelte";

    function create_fragment$G(ctx) {
    	let tbody;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let tbody_levels = [{ "aria-live": "polite" }, /*$$restProps*/ ctx[0]];
    	let tbody_data = {};

    	for (let i = 0; i < tbody_levels.length; i += 1) {
    		tbody_data = assign(tbody_data, tbody_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			tbody = element("tbody");
    			if (default_slot) default_slot.c();
    			set_attributes(tbody, tbody_data);
    			add_location(tbody, file$E, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);

    			if (default_slot) {
    				default_slot.m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(tbody, tbody_data = get_spread_update(tbody_levels, [
    				{ "aria-live": "polite" },
    				dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$G.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$G($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableBody', slots, ['default']);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	return [$$restProps, $$scope, slots];
    }

    class TableBody extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$G, create_fragment$G, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableBody",
    			options,
    			id: create_fragment$G.name
    		});
    	}
    }

    var TableBody$1 = TableBody;

    /* node_modules\carbon-components-svelte\src\DataTable\TableCell.svelte generated by Svelte v3.49.0 */

    const file$D = "node_modules\\carbon-components-svelte\\src\\DataTable\\TableCell.svelte";

    function create_fragment$F(ctx) {
    	let td;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let td_levels = [/*$$restProps*/ ctx[0]];
    	let td_data = {};

    	for (let i = 0; i < td_levels.length; i += 1) {
    		td_data = assign(td_data, td_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (default_slot) default_slot.c();
    			set_attributes(td, td_data);
    			add_location(td, file$D, 1, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			if (default_slot) {
    				default_slot.m(td, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(td, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(td, "mouseover", /*mouseover_handler*/ ctx[4], false, false, false),
    					listen_dev(td, "mouseenter", /*mouseenter_handler*/ ctx[5], false, false, false),
    					listen_dev(td, "mouseleave", /*mouseleave_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(td, td_data = get_spread_update(td_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$F.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$F($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableCell', slots, ['default']);

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	return [
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class TableCell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$F, create_fragment$F, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableCell",
    			options,
    			id: create_fragment$F.name
    		});
    	}
    }

    var TableCell$1 = TableCell;

    /* node_modules\carbon-components-svelte\src\DataTable\TableContainer.svelte generated by Svelte v3.49.0 */

    const file$C = "node_modules\\carbon-components-svelte\\src\\DataTable\\TableContainer.svelte";

    // (21:2) {#if title}
    function create_if_block$o(ctx) {
    	let div;
    	let h4;
    	let t0;
    	let t1;
    	let p;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*description*/ ctx[1]);
    			toggle_class(h4, "bx--data-table-header__title", true);
    			add_location(h4, file$C, 22, 6, 585);
    			toggle_class(p, "bx--data-table-header__description", true);
    			add_location(p, file$C, 23, 6, 652);
    			toggle_class(div, "bx--data-table-header", true);
    			add_location(div, file$C, 21, 4, 536);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(h4, t0);
    			append_dev(div, t1);
    			append_dev(div, p);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (dirty & /*description*/ 2) set_data_dev(t2, /*description*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$o.name,
    		type: "if",
    		source: "(21:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$E(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block$o(ctx);
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let div_levels = [/*$$restProps*/ ctx[4]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--data-table-container", true);
    			toggle_class(div, "bx--data-table-container--static", /*useStaticWidth*/ ctx[3]);
    			toggle_class(div, "bx--data-table--max-width", /*stickyHeader*/ ctx[2]);
    			add_location(div, file$C, 14, 0, 339);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$o(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]]));
    			toggle_class(div, "bx--data-table-container", true);
    			toggle_class(div, "bx--data-table-container--static", /*useStaticWidth*/ ctx[3]);
    			toggle_class(div, "bx--data-table--max-width", /*stickyHeader*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$E.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$E($$self, $$props, $$invalidate) {
    	const omit_props_names = ["title","description","stickyHeader","useStaticWidth"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableContainer', slots, ['default']);
    	let { title = "" } = $$props;
    	let { description = "" } = $$props;
    	let { stickyHeader = false } = $$props;
    	let { useStaticWidth = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('title' in $$new_props) $$invalidate(0, title = $$new_props.title);
    		if ('description' in $$new_props) $$invalidate(1, description = $$new_props.description);
    		if ('stickyHeader' in $$new_props) $$invalidate(2, stickyHeader = $$new_props.stickyHeader);
    		if ('useStaticWidth' in $$new_props) $$invalidate(3, useStaticWidth = $$new_props.useStaticWidth);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		title,
    		description,
    		stickyHeader,
    		useStaticWidth
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('title' in $$props) $$invalidate(0, title = $$new_props.title);
    		if ('description' in $$props) $$invalidate(1, description = $$new_props.description);
    		if ('stickyHeader' in $$props) $$invalidate(2, stickyHeader = $$new_props.stickyHeader);
    		if ('useStaticWidth' in $$props) $$invalidate(3, useStaticWidth = $$new_props.useStaticWidth);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, description, stickyHeader, useStaticWidth, $$restProps, $$scope, slots];
    }

    class TableContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$E, create_fragment$E, safe_not_equal, {
    			title: 0,
    			description: 1,
    			stickyHeader: 2,
    			useStaticWidth: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableContainer",
    			options,
    			id: create_fragment$E.name
    		});
    	}

    	get title() {
    		throw new Error("<TableContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<TableContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<TableContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<TableContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stickyHeader() {
    		throw new Error("<TableContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stickyHeader(value) {
    		throw new Error("<TableContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useStaticWidth() {
    		throw new Error("<TableContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useStaticWidth(value) {
    		throw new Error("<TableContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TableContainer$1 = TableContainer;

    /* node_modules\carbon-components-svelte\src\DataTable\TableHead.svelte generated by Svelte v3.49.0 */

    const file$B = "node_modules\\carbon-components-svelte\\src\\DataTable\\TableHead.svelte";

    function create_fragment$D(ctx) {
    	let thead;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let thead_levels = [/*$$restProps*/ ctx[0]];
    	let thead_data = {};

    	for (let i = 0; i < thead_levels.length; i += 1) {
    		thead_data = assign(thead_data, thead_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			if (default_slot) default_slot.c();
    			set_attributes(thead, thead_data);
    			add_location(thead, file$B, 1, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);

    			if (default_slot) {
    				default_slot.m(thead, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(thead, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(thead, "mouseover", /*mouseover_handler*/ ctx[4], false, false, false),
    					listen_dev(thead, "mouseenter", /*mouseenter_handler*/ ctx[5], false, false, false),
    					listen_dev(thead, "mouseleave", /*mouseleave_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(thead, thead_data = get_spread_update(thead_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$D.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$D($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableHead', slots, ['default']);

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	return [
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class TableHead extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$D, create_fragment$D, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableHead",
    			options,
    			id: create_fragment$D.name
    		});
    	}
    }

    var TableHead$1 = TableHead;

    /* node_modules\carbon-components-svelte\src\icons\ArrowUp.svelte generated by Svelte v3.49.0 */

    const file$A = "node_modules\\carbon-components-svelte\\src\\icons\\ArrowUp.svelte";

    // (24:2) {#if title}
    function create_if_block$n(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$A, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$n.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$n(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M16 4L6 14 7.41 15.41 15 7.83 15 28 17 28 17 7.83 24.59 15.41 26 14 16 4z");
    			add_location(path, file$A, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$A, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$n(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArrowUp', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class ArrowUp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$C, create_fragment$C, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrowUp",
    			options,
    			id: create_fragment$C.name
    		});
    	}

    	get size() {
    		throw new Error("<ArrowUp>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ArrowUp>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ArrowUp>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ArrowUp>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ArrowUp$1 = ArrowUp;

    /* node_modules\carbon-components-svelte\src\icons\ArrowsVertical.svelte generated by Svelte v3.49.0 */

    const file$z = "node_modules\\carbon-components-svelte\\src\\icons\\ArrowsVertical.svelte";

    // (24:2) {#if title}
    function create_if_block$m(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$z, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$m.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$B(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$m(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M27.6 20.6L24 24.2 24 4 22 4 22 24.2 18.4 20.6 17 22 23 28 29 22zM9 4L3 10 4.4 11.4 8 7.8 8 28 10 28 10 7.8 13.6 11.4 15 10z");
    			add_location(path, file$z, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$z, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$m(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ArrowsVertical', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class ArrowsVertical extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ArrowsVertical",
    			options,
    			id: create_fragment$B.name
    		});
    	}

    	get size() {
    		throw new Error("<ArrowsVertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ArrowsVertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ArrowsVertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ArrowsVertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var ArrowsVertical$1 = ArrowsVertical;

    /* node_modules\carbon-components-svelte\src\DataTable\TableHeader.svelte generated by Svelte v3.49.0 */
    const file$y = "node_modules\\carbon-components-svelte\\src\\DataTable\\TableHeader.svelte";

    // (66:0) {:else}
    function create_else_block$9(ctx) {
    	let th;
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let th_levels = [
    		{ scope: /*scope*/ ctx[3] },
    		{ "data-header": /*id*/ ctx[4] },
    		/*$$restProps*/ ctx[6]
    	];

    	let th_data = {};

    	for (let i = 0; i < th_levels.length; i += 1) {
    		th_data = assign(th_data, th_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			toggle_class(div, "bx--table-header-label", true);
    			add_location(div, file$y, 75, 4, 1728);
    			set_attributes(th, th_data);
    			add_location(th, file$y, 66, 2, 1586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(th, "click", /*click_handler_1*/ ctx[14], false, false, false),
    					listen_dev(th, "mouseover", /*mouseover_handler_1*/ ctx[15], false, false, false),
    					listen_dev(th, "mouseenter", /*mouseenter_handler_1*/ ctx[16], false, false, false),
    					listen_dev(th, "mouseleave", /*mouseleave_handler_1*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(th, th_data = get_spread_update(th_levels, [
    				(!current || dirty & /*scope*/ 8) && { scope: /*scope*/ ctx[3] },
    				(!current || dirty & /*id*/ 16) && { "data-header": /*id*/ ctx[4] },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(66:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:0) {#if sortable}
    function create_if_block$l(ctx) {
    	let th;
    	let button;
    	let div;
    	let t0;
    	let arrowup;
    	let t1;
    	let arrowsvertical;
    	let th_aria_sort_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	arrowup = new ArrowUp$1({
    			props: {
    				size: 20,
    				"aria-label": /*ariaLabel*/ ctx[5],
    				class: "bx--table-sort__icon"
    			},
    			$$inline: true
    		});

    	arrowsvertical = new ArrowsVertical$1({
    			props: {
    				size: 20,
    				"aria-label": /*ariaLabel*/ ctx[5],
    				class: "bx--table-sort__icon-unsorted"
    			},
    			$$inline: true
    		});

    	let th_levels = [
    		{
    			"aria-sort": th_aria_sort_value = /*active*/ ctx[2] ? /*sortDirection*/ ctx[1] : 'none'
    		},
    		{ scope: /*scope*/ ctx[3] },
    		{ "data-header": /*id*/ ctx[4] },
    		/*$$restProps*/ ctx[6]
    	];

    	let th_data = {};

    	for (let i = 0; i < th_levels.length; i += 1) {
    		th_data = assign(th_data, th_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			button = element("button");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			create_component(arrowup.$$.fragment);
    			t1 = space();
    			create_component(arrowsvertical.$$.fragment);
    			toggle_class(div, "bx--table-header-label", true);
    			add_location(div, file$y, 50, 6, 1236);
    			toggle_class(button, "bx--table-sort", true);
    			toggle_class(button, "bx--table-sort--active", /*active*/ ctx[2]);
    			toggle_class(button, "bx--table-sort--ascending", /*active*/ ctx[2] && /*sortDirection*/ ctx[1] === 'descending');
    			add_location(button, file$y, 43, 4, 1028);
    			set_attributes(th, th_data);
    			add_location(th, file$y, 34, 2, 849);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, button);
    			append_dev(button, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(button, t0);
    			mount_component(arrowup, button, null);
    			append_dev(button, t1);
    			mount_component(arrowsvertical, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[13], false, false, false),
    					listen_dev(th, "mouseover", /*mouseover_handler*/ ctx[10], false, false, false),
    					listen_dev(th, "mouseenter", /*mouseenter_handler*/ ctx[11], false, false, false),
    					listen_dev(th, "mouseleave", /*mouseleave_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			const arrowup_changes = {};
    			if (dirty & /*ariaLabel*/ 32) arrowup_changes["aria-label"] = /*ariaLabel*/ ctx[5];
    			arrowup.$set(arrowup_changes);
    			const arrowsvertical_changes = {};
    			if (dirty & /*ariaLabel*/ 32) arrowsvertical_changes["aria-label"] = /*ariaLabel*/ ctx[5];
    			arrowsvertical.$set(arrowsvertical_changes);

    			if (dirty & /*active*/ 4) {
    				toggle_class(button, "bx--table-sort--active", /*active*/ ctx[2]);
    			}

    			if (dirty & /*active, sortDirection*/ 6) {
    				toggle_class(button, "bx--table-sort--ascending", /*active*/ ctx[2] && /*sortDirection*/ ctx[1] === 'descending');
    			}

    			set_attributes(th, th_data = get_spread_update(th_levels, [
    				(!current || dirty & /*active, sortDirection*/ 6 && th_aria_sort_value !== (th_aria_sort_value = /*active*/ ctx[2] ? /*sortDirection*/ ctx[1] : 'none')) && { "aria-sort": th_aria_sort_value },
    				(!current || dirty & /*scope*/ 8) && { scope: /*scope*/ ctx[3] },
    				(!current || dirty & /*id*/ 16) && { "data-header": /*id*/ ctx[4] },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(arrowup.$$.fragment, local);
    			transition_in(arrowsvertical.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(arrowup.$$.fragment, local);
    			transition_out(arrowsvertical.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(arrowup);
    			destroy_component(arrowsvertical);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$l.name,
    		type: "if",
    		source: "(34:0) {#if sortable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$A(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$l, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*sortable*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	const omit_props_names = ["sortable","sortDirection","active","scope","translateWithId","id"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableHeader', slots, ['default']);
    	let { sortable = false } = $$props;
    	let { sortDirection = "none" } = $$props;
    	let { active = false } = $$props;
    	let { scope = "col" } = $$props;
    	let { translateWithId = () => "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('sortable' in $$new_props) $$invalidate(0, sortable = $$new_props.sortable);
    		if ('sortDirection' in $$new_props) $$invalidate(1, sortDirection = $$new_props.sortDirection);
    		if ('active' in $$new_props) $$invalidate(2, active = $$new_props.active);
    		if ('scope' in $$new_props) $$invalidate(3, scope = $$new_props.scope);
    		if ('translateWithId' in $$new_props) $$invalidate(7, translateWithId = $$new_props.translateWithId);
    		if ('id' in $$new_props) $$invalidate(4, id = $$new_props.id);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		sortable,
    		sortDirection,
    		active,
    		scope,
    		translateWithId,
    		id,
    		ArrowUp: ArrowUp$1,
    		ArrowsVertical: ArrowsVertical$1,
    		ariaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('sortable' in $$props) $$invalidate(0, sortable = $$new_props.sortable);
    		if ('sortDirection' in $$props) $$invalidate(1, sortDirection = $$new_props.sortDirection);
    		if ('active' in $$props) $$invalidate(2, active = $$new_props.active);
    		if ('scope' in $$props) $$invalidate(3, scope = $$new_props.scope);
    		if ('translateWithId' in $$props) $$invalidate(7, translateWithId = $$new_props.translateWithId);
    		if ('id' in $$props) $$invalidate(4, id = $$new_props.id);
    		if ('ariaLabel' in $$props) $$invalidate(5, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*translateWithId*/ 128) {
    			// TODO: translate with id
    			$$invalidate(5, ariaLabel = translateWithId());
    		}
    	};

    	return [
    		sortable,
    		sortDirection,
    		active,
    		scope,
    		id,
    		ariaLabel,
    		$$restProps,
    		translateWithId,
    		$$scope,
    		slots,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		click_handler,
    		click_handler_1,
    		mouseover_handler_1,
    		mouseenter_handler_1,
    		mouseleave_handler_1
    	];
    }

    class TableHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$A, create_fragment$A, safe_not_equal, {
    			sortable: 0,
    			sortDirection: 1,
    			active: 2,
    			scope: 3,
    			translateWithId: 7,
    			id: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableHeader",
    			options,
    			id: create_fragment$A.name
    		});
    	}

    	get sortable() {
    		throw new Error("<TableHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortable(value) {
    		throw new Error("<TableHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortDirection() {
    		throw new Error("<TableHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortDirection(value) {
    		throw new Error("<TableHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<TableHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<TableHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scope() {
    		throw new Error("<TableHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scope(value) {
    		throw new Error("<TableHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translateWithId() {
    		throw new Error("<TableHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translateWithId(value) {
    		throw new Error("<TableHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<TableHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TableHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TableHeader$1 = TableHeader;

    /* node_modules\carbon-components-svelte\src\DataTable\TableRow.svelte generated by Svelte v3.49.0 */

    const file$x = "node_modules\\carbon-components-svelte\\src\\DataTable\\TableRow.svelte";

    function create_fragment$z(ctx) {
    	let tr;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let tr_levels = [/*$$restProps*/ ctx[0]];
    	let tr_data = {};

    	for (let i = 0; i < tr_levels.length; i += 1) {
    		tr_data = assign(tr_data, tr_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			set_attributes(tr, tr_data);
    			add_location(tr, file$x, 1, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(tr, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(tr, "mouseover", /*mouseover_handler*/ ctx[4], false, false, false),
    					listen_dev(tr, "mouseenter", /*mouseenter_handler*/ ctx[5], false, false, false),
    					listen_dev(tr, "mouseleave", /*mouseleave_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(tr, tr_data = get_spread_update(tr_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableRow', slots, ['default']);

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	return [
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class TableRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableRow",
    			options,
    			id: create_fragment$z.name
    		});
    	}
    }

    var TableRow$1 = TableRow;

    /* node_modules\carbon-components-svelte\src\DataTable\DataTable.svelte generated by Svelte v3.49.0 */
    const file$w = "node_modules\\carbon-components-svelte\\src\\DataTable\\DataTable.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[66] = list[i];
    	child_ctx[68] = i;
    	return child_ctx;
    }

    const get_expanded_row_slot_changes = dirty => ({
    	row: dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880
    });

    const get_expanded_row_slot_context = ctx => ({ row: /*row*/ ctx[66] });

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[69] = list[i];
    	child_ctx[71] = i;
    	return child_ctx;
    }

    const get_cell_slot_changes_1 = dirty => ({
    	row: dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880,
    	cell: dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336,
    	rowIndex: dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880,
    	cellIndex: dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336
    });

    const get_cell_slot_context_1 = ctx => ({
    	row: /*row*/ ctx[66],
    	cell: /*cell*/ ctx[69],
    	rowIndex: /*i*/ ctx[68],
    	cellIndex: /*j*/ ctx[71]
    });

    const get_cell_slot_changes = dirty => ({
    	row: dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880,
    	cell: dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336,
    	rowIndex: dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880,
    	cellIndex: dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336
    });

    const get_cell_slot_context = ctx => ({
    	row: /*row*/ ctx[66],
    	cell: /*cell*/ ctx[69],
    	rowIndex: /*i*/ ctx[68],
    	cellIndex: /*j*/ ctx[71]
    });

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[72] = list[i];
    	return child_ctx;
    }

    const get_cell_header_slot_changes = dirty => ({ header: dirty[0] & /*headers*/ 64 });
    const get_cell_header_slot_context = ctx => ({ header: /*header*/ ctx[72] });
    const get_description_slot_changes = dirty => ({});
    const get_description_slot_context = ctx => ({});
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (260:2) {#if title || $$slots.title || description || $$slots.description}
    function create_if_block_13(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block0 = (/*title*/ ctx[8] || /*$$slots*/ ctx[38].title) && create_if_block_15(ctx);
    	let if_block1 = (/*description*/ ctx[9] || /*$$slots*/ ctx[38].description) && create_if_block_14(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			toggle_class(div, "bx--data-table-header", true);
    			add_location(div, file$w, 260, 4, 8556);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[8] || /*$$slots*/ ctx[38].title) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*title*/ 256 | dirty[1] & /*$$slots*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_15(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*description*/ ctx[9] || /*$$slots*/ ctx[38].description) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*description*/ 512 | dirty[1] & /*$$slots*/ 128) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_14(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(260:2) {#if title || $$slots.title || description || $$slots.description}",
    		ctx
    	});

    	return block;
    }

    // (262:6) {#if title || $$slots.title}
    function create_if_block_15(ctx) {
    	let h4;
    	let current;
    	const title_slot_template = /*#slots*/ ctx[48].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[62], get_title_slot_context);
    	const title_slot_or_fallback = title_slot || fallback_block_4(ctx);

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			if (title_slot_or_fallback) title_slot_or_fallback.c();
    			toggle_class(h4, "bx--data-table-header__title", true);
    			add_location(h4, file$w, 262, 8, 8642);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);

    			if (title_slot_or_fallback) {
    				title_slot_or_fallback.m(h4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (title_slot) {
    				if (title_slot.p && (!current || dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[62], dirty, get_title_slot_changes),
    						get_title_slot_context
    					);
    				}
    			} else {
    				if (title_slot_or_fallback && title_slot_or_fallback.p && (!current || dirty[0] & /*title*/ 256)) {
    					title_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (title_slot_or_fallback) title_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(262:6) {#if title || $$slots.title}",
    		ctx
    	});

    	return block;
    }

    // (264:29) {title}
    function fallback_block_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[8]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*title*/ 256) set_data_dev(t, /*title*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_4.name,
    		type: "fallback",
    		source: "(264:29) {title}",
    		ctx
    	});

    	return block;
    }

    // (267:6) {#if description || $$slots.description}
    function create_if_block_14(ctx) {
    	let p;
    	let current;
    	const description_slot_template = /*#slots*/ ctx[48].description;
    	const description_slot = create_slot(description_slot_template, ctx, /*$$scope*/ ctx[62], get_description_slot_context);
    	const description_slot_or_fallback = description_slot || fallback_block_3(ctx);

    	const block = {
    		c: function create() {
    			p = element("p");
    			if (description_slot_or_fallback) description_slot_or_fallback.c();
    			toggle_class(p, "bx--data-table-header__description", true);
    			add_location(p, file$w, 267, 8, 8816);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);

    			if (description_slot_or_fallback) {
    				description_slot_or_fallback.m(p, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (description_slot) {
    				if (description_slot.p && (!current || dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						description_slot,
    						description_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(description_slot_template, /*$$scope*/ ctx[62], dirty, get_description_slot_changes),
    						get_description_slot_context
    					);
    				}
    			} else {
    				if (description_slot_or_fallback && description_slot_or_fallback.p && (!current || dirty[0] & /*description*/ 512)) {
    					description_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(description_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(description_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (description_slot_or_fallback) description_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(267:6) {#if description || $$slots.description}",
    		ctx
    	});

    	return block;
    }

    // (269:35) {description}
    function fallback_block_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*description*/ ctx[9]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*description*/ 512) set_data_dev(t, /*description*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(269:35) {description}",
    		ctx
    	});

    	return block;
    }

    // (285:8) {#if expandable}
    function create_if_block_11$1(ctx) {
    	let th;
    	let th_data_previous_value_value;
    	let current;
    	let if_block = /*batchExpansion*/ ctx[12] && create_if_block_12$1(ctx);

    	const block = {
    		c: function create() {
    			th = element("th");
    			if (if_block) if_block.c();
    			attr_dev(th, "scope", "col");
    			attr_dev(th, "data-previous-value", th_data_previous_value_value = /*expanded*/ ctx[22] ? 'collapsed' : undefined);
    			toggle_class(th, "bx--table-expand", true);
    			add_location(th, file$w, 285, 10, 9263);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			if (if_block) if_block.m(th, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*batchExpansion*/ ctx[12]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*batchExpansion*/ 4096) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_12$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(th, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*expanded*/ 4194304 && th_data_previous_value_value !== (th_data_previous_value_value = /*expanded*/ ctx[22] ? 'collapsed' : undefined)) {
    				attr_dev(th, "data-previous-value", th_data_previous_value_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$1.name,
    		type: "if",
    		source: "(285:8) {#if expandable}",
    		ctx
    	});

    	return block;
    }

    // (291:12) {#if batchExpansion}
    function create_if_block_12$1(ctx) {
    	let button;
    	let chevronright;
    	let current;
    	let mounted;
    	let dispose;

    	chevronright = new ChevronRight$1({
    			props: { class: "bx--table-expand__svg" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(chevronright.$$.fragment);
    			attr_dev(button, "type", "button");
    			toggle_class(button, "bx--table-expand__button", true);
    			add_location(button, file$w, 291, 14, 9465);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(chevronright, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[49], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronright.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronright.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(chevronright);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12$1.name,
    		type: "if",
    		source: "(291:12) {#if batchExpansion}",
    		ctx
    	});

    	return block;
    }

    // (307:8) {#if selectable && !batchSelection}
    function create_if_block_10$2(ctx) {
    	let th;

    	const block = {
    		c: function create() {
    			th = element("th");
    			attr_dev(th, "scope", "col");
    			add_location(th, file$w, 307, 10, 9995);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$2.name,
    		type: "if",
    		source: "(307:8) {#if selectable && !batchSelection}",
    		ctx
    	});

    	return block;
    }

    // (310:8) {#if batchSelection && !radio}
    function create_if_block_9$2(ctx) {
    	let th;
    	let inlinecheckbox;
    	let updating_ref;
    	let current;

    	function inlinecheckbox_ref_binding(value) {
    		/*inlinecheckbox_ref_binding*/ ctx[50](value);
    	}

    	let inlinecheckbox_props = {
    		"aria-label": "Select all rows",
    		checked: /*selectAll*/ ctx[30],
    		indeterminate: /*indeterminate*/ ctx[29]
    	};

    	if (/*refSelectAll*/ ctx[24] !== void 0) {
    		inlinecheckbox_props.ref = /*refSelectAll*/ ctx[24];
    	}

    	inlinecheckbox = new InlineCheckbox$1({
    			props: inlinecheckbox_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(inlinecheckbox, 'ref', inlinecheckbox_ref_binding));
    	inlinecheckbox.$on("change", /*change_handler*/ ctx[51]);

    	const block = {
    		c: function create() {
    			th = element("th");
    			create_component(inlinecheckbox.$$.fragment);
    			attr_dev(th, "scope", "col");
    			toggle_class(th, "bx--table-column-checkbox", true);
    			add_location(th, file$w, 310, 10, 10080);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			mount_component(inlinecheckbox, th, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inlinecheckbox_changes = {};
    			if (dirty[0] & /*selectAll*/ 1073741824) inlinecheckbox_changes.checked = /*selectAll*/ ctx[30];
    			if (dirty[0] & /*indeterminate*/ 536870912) inlinecheckbox_changes.indeterminate = /*indeterminate*/ ctx[29];

    			if (!updating_ref && dirty[0] & /*refSelectAll*/ 16777216) {
    				updating_ref = true;
    				inlinecheckbox_changes.ref = /*refSelectAll*/ ctx[24];
    				add_flush_callback(() => updating_ref = false);
    			}

    			inlinecheckbox.$set(inlinecheckbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inlinecheckbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inlinecheckbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			destroy_component(inlinecheckbox);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$2.name,
    		type: "if",
    		source: "(310:8) {#if batchSelection && !radio}",
    		ctx
    	});

    	return block;
    }

    // (337:10) {:else}
    function create_else_block_2(ctx) {
    	let tableheader;
    	let current;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[52](/*header*/ ctx[72]);
    	}

    	tableheader = new TableHeader$1({
    			props: {
    				id: /*header*/ ctx[72].key,
    				style: /*formatHeaderWidth*/ ctx[36](/*header*/ ctx[72]),
    				sortable: /*sortable*/ ctx[11] && /*header*/ ctx[72].sort !== false,
    				sortDirection: /*sortKey*/ ctx[0] === /*header*/ ctx[72].key
    				? /*sortDirection*/ ctx[1]
    				: 'none',
    				active: /*sortKey*/ ctx[0] === /*header*/ ctx[72].key,
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tableheader.$on("click", click_handler_1);

    	const block = {
    		c: function create() {
    			create_component(tableheader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tableheader, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const tableheader_changes = {};
    			if (dirty[0] & /*headers*/ 64) tableheader_changes.id = /*header*/ ctx[72].key;
    			if (dirty[0] & /*headers*/ 64) tableheader_changes.style = /*formatHeaderWidth*/ ctx[36](/*header*/ ctx[72]);
    			if (dirty[0] & /*sortable, headers*/ 2112) tableheader_changes.sortable = /*sortable*/ ctx[11] && /*header*/ ctx[72].sort !== false;

    			if (dirty[0] & /*sortKey, headers, sortDirection*/ 67) tableheader_changes.sortDirection = /*sortKey*/ ctx[0] === /*header*/ ctx[72].key
    			? /*sortDirection*/ ctx[1]
    			: 'none';

    			if (dirty[0] & /*sortKey, headers*/ 65) tableheader_changes.active = /*sortKey*/ ctx[0] === /*header*/ ctx[72].key;

    			if (dirty[0] & /*headers*/ 64 | dirty[2] & /*$$scope*/ 1) {
    				tableheader_changes.$$scope = { dirty, ctx };
    			}

    			tableheader.$set(tableheader_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tableheader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tableheader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tableheader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(337:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (335:10) {#if header.empty}
    function create_if_block_8$2(ctx) {
    	let th;
    	let th_style_value;

    	const block = {
    		c: function create() {
    			th = element("th");
    			attr_dev(th, "scope", "col");
    			attr_dev(th, "style", th_style_value = /*formatHeaderWidth*/ ctx[36](/*header*/ ctx[72]));
    			add_location(th, file$w, 335, 12, 10894);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*headers*/ 64 && th_style_value !== (th_style_value = /*formatHeaderWidth*/ ctx[36](/*header*/ ctx[72]))) {
    				attr_dev(th, "style", th_style_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$2.name,
    		type: "if",
    		source: "(335:10) {#if header.empty}",
    		ctx
    	});

    	return block;
    }

    // (359:57) {header.value}
    function fallback_block_2(ctx) {
    	let t_value = /*header*/ ctx[72].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*headers*/ 64 && t_value !== (t_value = /*header*/ ctx[72].value + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(359:57) {header.value}",
    		ctx
    	});

    	return block;
    }

    // (338:12) <TableHeader               id="{header.key}"               style="{formatHeaderWidth(header)}"               sortable="{sortable && header.sort !== false}"               sortDirection="{sortKey === header.key ? sortDirection : 'none'}"               active="{sortKey === header.key}"               on:click="{() => {                 dispatch('click', { header });                  if (header.sort === false) {                   dispatch('click:header', { header });                 } else {                   let currentSortDirection =                     sortKey === header.key ? sortDirection : 'none';                   sortDirection = sortDirectionMap[currentSortDirection];                   sortKey =                     sortDirection === 'none' ? null : thKeys[header.key];                   dispatch('click:header', { header, sortDirection });                 }               }}"             >
    function create_default_slot_9$1(ctx) {
    	let t;
    	let current;
    	const cell_header_slot_template = /*#slots*/ ctx[48]["cell-header"];
    	const cell_header_slot = create_slot(cell_header_slot_template, ctx, /*$$scope*/ ctx[62], get_cell_header_slot_context);
    	const cell_header_slot_or_fallback = cell_header_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (cell_header_slot_or_fallback) cell_header_slot_or_fallback.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (cell_header_slot_or_fallback) {
    				cell_header_slot_or_fallback.m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (cell_header_slot) {
    				if (cell_header_slot.p && (!current || dirty[0] & /*headers*/ 64 | dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						cell_header_slot,
    						cell_header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(cell_header_slot_template, /*$$scope*/ ctx[62], dirty, get_cell_header_slot_changes),
    						get_cell_header_slot_context
    					);
    				}
    			} else {
    				if (cell_header_slot_or_fallback && cell_header_slot_or_fallback.p && (!current || dirty[0] & /*headers*/ 64)) {
    					cell_header_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell_header_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell_header_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (cell_header_slot_or_fallback) cell_header_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(338:12) <TableHeader               id=\\\"{header.key}\\\"               style=\\\"{formatHeaderWidth(header)}\\\"               sortable=\\\"{sortable && header.sort !== false}\\\"               sortDirection=\\\"{sortKey === header.key ? sortDirection : 'none'}\\\"               active=\\\"{sortKey === header.key}\\\"               on:click=\\\"{() => {                 dispatch('click', { header });                  if (header.sort === false) {                   dispatch('click:header', { header });                 } else {                   let currentSortDirection =                     sortKey === header.key ? sortDirection : 'none';                   sortDirection = sortDirectionMap[currentSortDirection];                   sortKey =                     sortDirection === 'none' ? null : thKeys[header.key];                   dispatch('click:header', { header, sortDirection });                 }               }}\\\"             >",
    		ctx
    	});

    	return block;
    }

    // (334:8) {#each headers as header (header.key)}
    function create_each_block_2(key_1, ctx) {
    	let first;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_8$2, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*header*/ ctx[72].empty) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(334:8) {#each headers as header (header.key)}",
    		ctx
    	});

    	return block;
    }

    // (284:6) <TableRow>
    function create_default_slot_8$1(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let if_block0 = /*expandable*/ ctx[4] && create_if_block_11$1(ctx);
    	let if_block1 = /*selectable*/ ctx[5] && !/*batchSelection*/ ctx[15] && create_if_block_10$2(ctx);
    	let if_block2 = /*batchSelection*/ ctx[15] && !/*radio*/ ctx[14] && create_if_block_9$2(ctx);
    	let each_value_2 = /*headers*/ ctx[6];
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*header*/ ctx[72].key;
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*expandable*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*expandable*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_11$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*selectable*/ ctx[5] && !/*batchSelection*/ ctx[15]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_10$2(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*batchSelection*/ ctx[15] && !/*radio*/ ctx[14]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*batchSelection, radio*/ 49152) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_9$2(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*headers, sortable, sortKey, sortDirection*/ 2115 | dirty[1] & /*formatHeaderWidth, dispatch, sortDirectionMap, thKeys*/ 46 | dirty[2] & /*$$scope*/ 1) {
    				each_value_2 = /*headers*/ ctx[6];
    				validate_each_argument(each_value_2);
    				group_outros();
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_2, each_1_anchor, get_each_context_2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(284:6) <TableRow>",
    		ctx
    	});

    	return block;
    }

    // (283:4) <TableHead>
    function create_default_slot_7$1(ctx) {
    	let tablerow;
    	let current;

    	tablerow = new TableRow$1({
    			props: {
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablerow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablerow, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablerow_changes = {};

    			if (dirty[0] & /*headers, sortable, sortKey, sortDirection, selectAll, indeterminate, refSelectAll, selectedRowIds, selectableRowIds, batchSelection, radio, selectable, expanded, expandedRowIds, expandableRowIds, batchExpansion, expandable*/ 1634785407 | dirty[1] & /*thKeys*/ 2 | dirty[2] & /*$$scope*/ 1) {
    				tablerow_changes.$$scope = { dirty, ctx };
    			}

    			tablerow.$set(tablerow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablerow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablerow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablerow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(283:4) <TableHead>",
    		ctx
    	});

    	return block;
    }

    // (397:10) {#if expandable}
    function create_if_block_6$2(ctx) {
    	let tablecell;
    	let current;

    	tablecell = new TableCell$1({
    			props: {
    				class: "bx--table-expand",
    				headers: "expand",
    				"data-previous-value": !/*nonExpandableRowIds*/ ctx[13].includes(/*row*/ ctx[66].id) && /*expandedRows*/ ctx[31][/*row*/ ctx[66].id]
    				? 'collapsed'
    				: undefined,
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablecell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablecell, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablecell_changes = {};

    			if (dirty[0] & /*nonExpandableRowIds, sorting, displayedSortedRows, displayedRows*/ 201859072 | dirty[1] & /*expandedRows*/ 1) tablecell_changes["data-previous-value"] = !/*nonExpandableRowIds*/ ctx[13].includes(/*row*/ ctx[66].id) && /*expandedRows*/ ctx[31][/*row*/ ctx[66].id]
    			? 'collapsed'
    			: undefined;

    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows, expandedRowIds, nonExpandableRowIds*/ 201859076 | dirty[1] & /*expandedRows*/ 1 | dirty[2] & /*$$scope*/ 1) {
    				tablecell_changes.$$scope = { dirty, ctx };
    			}

    			tablecell.$set(tablecell_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablecell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablecell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablecell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(397:10) {#if expandable}",
    		ctx
    	});

    	return block;
    }

    // (406:14) {#if !nonExpandableRowIds.includes(row.id)}
    function create_if_block_7$2(ctx) {
    	let button;
    	let chevronright;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;

    	chevronright = new ChevronRight$1({
    			props: { class: "bx--table-expand__svg" },
    			$$inline: true
    		});

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[53](/*row*/ ctx[66]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(chevronright.$$.fragment);
    			attr_dev(button, "type", "button");

    			attr_dev(button, "aria-label", button_aria_label_value = /*expandedRows*/ ctx[31][/*row*/ ctx[66].id]
    			? 'Collapse current row'
    			: 'Expand current row');

    			toggle_class(button, "bx--table-expand__button", true);
    			add_location(button, file$w, 406, 16, 13627);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(chevronright, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", stop_propagation(click_handler_2), false, false, true);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880 | dirty[1] & /*expandedRows*/ 1 && button_aria_label_value !== (button_aria_label_value = /*expandedRows*/ ctx[31][/*row*/ ctx[66].id]
    			? 'Collapse current row'
    			: 'Expand current row')) {
    				attr_dev(button, "aria-label", button_aria_label_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chevronright.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chevronright.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(chevronright);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$2.name,
    		type: "if",
    		source: "(406:14) {#if !nonExpandableRowIds.includes(row.id)}",
    		ctx
    	});

    	return block;
    }

    // (398:12) <TableCell               class="bx--table-expand"               headers="expand"               data-previous-value="{!nonExpandableRowIds.includes(row.id) &&               expandedRows[row.id]                 ? 'collapsed'                 : undefined}"             >
    function create_default_slot_6$1(ctx) {
    	let show_if = !/*nonExpandableRowIds*/ ctx[13].includes(/*row*/ ctx[66].id);
    	let if_block_anchor;
    	let current;
    	let if_block = show_if && create_if_block_7$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*nonExpandableRowIds, sorting, displayedSortedRows, displayedRows*/ 201859072) show_if = !/*nonExpandableRowIds*/ ctx[13].includes(/*row*/ ctx[66].id);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*nonExpandableRowIds, sorting, displayedSortedRows, displayedRows*/ 201859072) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_7$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(398:12) <TableCell               class=\\\"bx--table-expand\\\"               headers=\\\"expand\\\"               data-previous-value=\\\"{!nonExpandableRowIds.includes(row.id) &&               expandedRows[row.id]                 ? 'collapsed'                 : undefined}\\\"             >",
    		ctx
    	});

    	return block;
    }

    // (431:10) {#if selectable}
    function create_if_block_3$3(ctx) {
    	let td;
    	let show_if = !/*nonSelectableRowIds*/ ctx[16].includes(/*row*/ ctx[66].id);
    	let current;
    	let if_block = show_if && create_if_block_4$2(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (if_block) if_block.c();
    			toggle_class(td, "bx--table-column-checkbox", true);
    			toggle_class(td, "bx--table-column-radio", /*radio*/ ctx[14]);
    			add_location(td, file$w, 431, 12, 14537);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if (if_block) if_block.m(td, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*nonSelectableRowIds, sorting, displayedSortedRows, displayedRows*/ 201916416) show_if = !/*nonSelectableRowIds*/ ctx[16].includes(/*row*/ ctx[66].id);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*nonSelectableRowIds, sorting, displayedSortedRows, displayedRows*/ 201916416) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_4$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(td, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*radio*/ 16384) {
    				toggle_class(td, "bx--table-column-radio", /*radio*/ ctx[14]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(431:10) {#if selectable}",
    		ctx
    	});

    	return block;
    }

    // (436:14) {#if !nonSelectableRowIds.includes(row.id)}
    function create_if_block_4$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_5$2, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*radio*/ ctx[14]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(436:14) {#if !nonSelectableRowIds.includes(row.id)}",
    		ctx
    	});

    	return block;
    }

    // (445:16) {:else}
    function create_else_block_1$1(ctx) {
    	let inlinecheckbox;
    	let current;

    	function change_handler_2() {
    		return /*change_handler_2*/ ctx[55](/*row*/ ctx[66]);
    	}

    	inlinecheckbox = new InlineCheckbox$1({
    			props: {
    				name: "select-row-" + /*row*/ ctx[66].id,
    				checked: /*selectedRowIds*/ ctx[3].includes(/*row*/ ctx[66].id)
    			},
    			$$inline: true
    		});

    	inlinecheckbox.$on("change", change_handler_2);

    	const block = {
    		c: function create() {
    			create_component(inlinecheckbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inlinecheckbox, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const inlinecheckbox_changes = {};
    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880) inlinecheckbox_changes.name = "select-row-" + /*row*/ ctx[66].id;
    			if (dirty[0] & /*selectedRowIds, sorting, displayedSortedRows, displayedRows*/ 201850888) inlinecheckbox_changes.checked = /*selectedRowIds*/ ctx[3].includes(/*row*/ ctx[66].id);
    			inlinecheckbox.$set(inlinecheckbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inlinecheckbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inlinecheckbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inlinecheckbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(445:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (437:16) {#if radio}
    function create_if_block_5$2(ctx) {
    	let radiobutton;
    	let current;

    	function change_handler_1() {
    		return /*change_handler_1*/ ctx[54](/*row*/ ctx[66]);
    	}

    	radiobutton = new RadioButton$1({
    			props: {
    				name: "select-row-" + /*row*/ ctx[66].id,
    				checked: /*selectedRowIds*/ ctx[3].includes(/*row*/ ctx[66].id)
    			},
    			$$inline: true
    		});

    	radiobutton.$on("change", change_handler_1);

    	const block = {
    		c: function create() {
    			create_component(radiobutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(radiobutton, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const radiobutton_changes = {};
    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880) radiobutton_changes.name = "select-row-" + /*row*/ ctx[66].id;
    			if (dirty[0] & /*selectedRowIds, sorting, displayedSortedRows, displayedRows*/ 201850888) radiobutton_changes.checked = /*selectedRowIds*/ ctx[3].includes(/*row*/ ctx[66].id);
    			radiobutton.$set(radiobutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radiobutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radiobutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(radiobutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(437:16) {#if radio}",
    		ctx
    	});

    	return block;
    }

    // (476:12) {:else}
    function create_else_block$8(ctx) {
    	let tablecell;
    	let current;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[56](/*row*/ ctx[66], /*cell*/ ctx[69]);
    	}

    	tablecell = new TableCell$1({
    			props: {
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tablecell.$on("click", click_handler_3);

    	const block = {
    		c: function create() {
    			create_component(tablecell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablecell, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const tablecell_changes = {};

    			if (dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336 | dirty[2] & /*$$scope*/ 1) {
    				tablecell_changes.$$scope = { dirty, ctx };
    			}

    			tablecell.$set(tablecell_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablecell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablecell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablecell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(476:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (464:12) {#if headers[j].empty}
    function create_if_block_2$4(ctx) {
    	let td;
    	let t;
    	let current;
    	const cell_slot_template = /*#slots*/ ctx[48].cell;
    	const cell_slot = create_slot(cell_slot_template, ctx, /*$$scope*/ ctx[62], get_cell_slot_context);
    	const cell_slot_or_fallback = cell_slot || fallback_block$6(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (cell_slot_or_fallback) cell_slot_or_fallback.c();
    			t = space();
    			toggle_class(td, "bx--table-column-menu", /*headers*/ ctx[6][/*j*/ ctx[71]].columnMenu);
    			add_location(td, file$w, 464, 14, 15795);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			if (cell_slot_or_fallback) {
    				cell_slot_or_fallback.m(td, null);
    			}

    			append_dev(td, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (cell_slot) {
    				if (cell_slot.p && (!current || dirty[0] & /*sorting, displayedSortedRows, displayedRows, tableCellsByRowId*/ 470286336 | dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						cell_slot,
    						cell_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(cell_slot_template, /*$$scope*/ ctx[62], dirty, get_cell_slot_changes),
    						get_cell_slot_context
    					);
    				}
    			} else {
    				if (cell_slot_or_fallback && cell_slot_or_fallback.p && (!current || dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336)) {
    					cell_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}

    			if (dirty[0] & /*headers, tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286400) {
    				toggle_class(td, "bx--table-column-menu", /*headers*/ ctx[6][/*j*/ ctx[71]].columnMenu);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (cell_slot_or_fallback) cell_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(464:12) {#if headers[j].empty}",
    		ctx
    	});

    	return block;
    }

    // (489:17)                    
    function fallback_block_1$2(ctx) {
    	let t_value = (/*cell*/ ctx[69].display
    	? /*cell*/ ctx[69].display(/*cell*/ ctx[69].value)
    	: /*cell*/ ctx[69].value) + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336 && t_value !== (t_value = (/*cell*/ ctx[69].display
    			? /*cell*/ ctx[69].display(/*cell*/ ctx[69].value)
    			: /*cell*/ ctx[69].value) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1$2.name,
    		type: "fallback",
    		source: "(489:17)                    ",
    		ctx
    	});

    	return block;
    }

    // (477:14) <TableCell                 on:click="{() => {                   dispatch('click', { row, cell });                   dispatch('click:cell', cell);                 }}"               >
    function create_default_slot_5$1(ctx) {
    	let t;
    	let current;
    	const cell_slot_template = /*#slots*/ ctx[48].cell;
    	const cell_slot = create_slot(cell_slot_template, ctx, /*$$scope*/ ctx[62], get_cell_slot_context_1);
    	const cell_slot_or_fallback = cell_slot || fallback_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			if (cell_slot_or_fallback) cell_slot_or_fallback.c();
    			t = space();
    		},
    		m: function mount(target, anchor) {
    			if (cell_slot_or_fallback) {
    				cell_slot_or_fallback.m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (cell_slot) {
    				if (cell_slot.p && (!current || dirty[0] & /*sorting, displayedSortedRows, displayedRows, tableCellsByRowId*/ 470286336 | dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						cell_slot,
    						cell_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(cell_slot_template, /*$$scope*/ ctx[62], dirty, get_cell_slot_changes_1),
    						get_cell_slot_context_1
    					);
    				}
    			} else {
    				if (cell_slot_or_fallback && cell_slot_or_fallback.p && (!current || dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336)) {
    					cell_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (cell_slot_or_fallback) cell_slot_or_fallback.d(detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(477:14) <TableCell                 on:click=\\\"{() => {                   dispatch('click', { row, cell });                   dispatch('click:cell', cell);                 }}\\\"               >",
    		ctx
    	});

    	return block;
    }

    // (472:17)                    
    function fallback_block$6(ctx) {
    	let t_value = (/*cell*/ ctx[69].display
    	? /*cell*/ ctx[69].display(/*cell*/ ctx[69].value)
    	: /*cell*/ ctx[69].value) + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286336 && t_value !== (t_value = (/*cell*/ ctx[69].display
    			? /*cell*/ ctx[69].display(/*cell*/ ctx[69].value)
    			: /*cell*/ ctx[69].value) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$6.name,
    		type: "fallback",
    		source: "(472:17)                    ",
    		ctx
    	});

    	return block;
    }

    // (463:10) {#each tableCellsByRowId[row.id] as cell, j (cell.key)}
    function create_each_block_1$1(key_1, ctx) {
    	let first;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$4, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*headers*/ ctx[6][/*j*/ ctx[71]].empty) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(463:10) {#each tableCellsByRowId[row.id] as cell, j (cell.key)}",
    		ctx
    	});

    	return block;
    }

    // (367:8) <TableRow           data-row="{row.id}"           data-parent-row="{expandable ? true : undefined}"           class="{selectedRowIds.includes(row.id)             ? 'bx--data-table--selected'             : ''} {expandedRows[row.id] ? 'bx--expandable-row' : ''} {expandable             ? 'bx--parent-row'             : ''} {expandable && parentRowId === row.id             ? 'bx--expandable-row--hover'             : ''}"           on:click="{({ target }) => {             // forgo "click", "click:row" events if target             // resembles an overflow menu, a checkbox, or radio button             if (               [...target.classList].some((name) =>                 /^bx--(overflow-menu|checkbox|radio-button)/.test(name)               )             ) {               return;             }             dispatch('click', { row });             dispatch('click:row', row);           }}"           on:mouseenter="{() => {             dispatch('mouseenter:row', row);           }}"           on:mouseleave="{() => {             dispatch('mouseleave:row', row);           }}"         >
    function create_default_slot_4$3(ctx) {
    	let t0;
    	let t1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let if_block0 = /*expandable*/ ctx[4] && create_if_block_6$2(ctx);
    	let if_block1 = /*selectable*/ ctx[5] && create_if_block_3$3(ctx);
    	let each_value_1 = /*tableCellsByRowId*/ ctx[28][/*row*/ ctx[66].id];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*cell*/ ctx[69].key;
    	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*expandable*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*expandable*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*selectable*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*selectable*/ 32) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*headers, tableCellsByRowId, sorting, displayedSortedRows, displayedRows*/ 470286400 | dirty[1] & /*dispatch*/ 8 | dirty[2] & /*$$scope*/ 1) {
    				each_value_1 = /*tableCellsByRowId*/ ctx[28][/*row*/ ctx[66].id];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_1$1, each_1_anchor, get_each_context_1$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$3.name,
    		type: "slot",
    		source: "(367:8) <TableRow           data-row=\\\"{row.id}\\\"           data-parent-row=\\\"{expandable ? true : undefined}\\\"           class=\\\"{selectedRowIds.includes(row.id)             ? 'bx--data-table--selected'             : ''} {expandedRows[row.id] ? 'bx--expandable-row' : ''} {expandable             ? 'bx--parent-row'             : ''} {expandable && parentRowId === row.id             ? 'bx--expandable-row--hover'             : ''}\\\"           on:click=\\\"{({ target }) => {             // forgo \\\"click\\\", \\\"click:row\\\" events if target             // resembles an overflow menu, a checkbox, or radio button             if (               [...target.classList].some((name) =>                 /^bx--(overflow-menu|checkbox|radio-button)/.test(name)               )             ) {               return;             }             dispatch('click', { row });             dispatch('click:row', row);           }}\\\"           on:mouseenter=\\\"{() => {             dispatch('mouseenter:row', row);           }}\\\"           on:mouseleave=\\\"{() => {             dispatch('mouseleave:row', row);           }}\\\"         >",
    		ctx
    	});

    	return block;
    }

    // (497:8) {#if expandable}
    function create_if_block$k(ctx) {
    	let tr;
    	let show_if = /*expandedRows*/ ctx[31][/*row*/ ctx[66].id] && !/*nonExpandableRowIds*/ ctx[13].includes(/*row*/ ctx[66].id);
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = show_if && create_if_block_1$7(ctx);

    	function mouseenter_handler_1() {
    		return /*mouseenter_handler_1*/ ctx[60](/*row*/ ctx[66]);
    	}

    	function mouseleave_handler_1() {
    		return /*mouseleave_handler_1*/ ctx[61](/*row*/ ctx[66]);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(tr, "data-child-row", "");
    			toggle_class(tr, "bx--expandable-row", true);
    			add_location(tr, file$w, 497, 10, 16801);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			if (if_block) if_block.m(tr, null);
    			append_dev(tr, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(tr, "mouseenter", mouseenter_handler_1, false, false, false),
    					listen_dev(tr, "mouseleave", mouseleave_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows, nonExpandableRowIds*/ 201859072 | dirty[1] & /*expandedRows*/ 1) show_if = /*expandedRows*/ ctx[31][/*row*/ ctx[66].id] && !/*nonExpandableRowIds*/ ctx[13].includes(/*row*/ ctx[66].id);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*sorting, displayedSortedRows, displayedRows, nonExpandableRowIds*/ 201859072 | dirty[1] & /*expandedRows*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(tr, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(497:8) {#if expandable}",
    		ctx
    	});

    	return block;
    }

    // (510:12) {#if expandedRows[row.id] && !nonExpandableRowIds.includes(row.id)}
    function create_if_block_1$7(ctx) {
    	let tablecell;
    	let current;

    	tablecell = new TableCell$1({
    			props: {
    				colspan: /*selectable*/ ctx[5]
    				? /*headers*/ ctx[6].length + 2
    				: /*headers*/ ctx[6].length + 1,
    				$$slots: { default: [create_default_slot_3$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablecell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablecell, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablecell_changes = {};

    			if (dirty[0] & /*selectable, headers*/ 96) tablecell_changes.colspan = /*selectable*/ ctx[5]
    			? /*headers*/ ctx[6].length + 2
    			: /*headers*/ ctx[6].length + 1;

    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880 | dirty[2] & /*$$scope*/ 1) {
    				tablecell_changes.$$scope = { dirty, ctx };
    			}

    			tablecell.$set(tablecell_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablecell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablecell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablecell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(510:12) {#if expandedRows[row.id] && !nonExpandableRowIds.includes(row.id)}",
    		ctx
    	});

    	return block;
    }

    // (511:14) <TableCell                 colspan="{selectable ? headers.length + 2 : headers.length + 1}"               >
    function create_default_slot_3$5(ctx) {
    	let div;
    	let current;
    	const expanded_row_slot_template = /*#slots*/ ctx[48]["expanded-row"];
    	const expanded_row_slot = create_slot(expanded_row_slot_template, ctx, /*$$scope*/ ctx[62], get_expanded_row_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (expanded_row_slot) expanded_row_slot.c();
    			toggle_class(div, "bx--child-row-inner-container", true);
    			add_location(div, file$w, 513, 16, 17410);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (expanded_row_slot) {
    				expanded_row_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (expanded_row_slot) {
    				if (expanded_row_slot.p && (!current || dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880 | dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						expanded_row_slot,
    						expanded_row_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(expanded_row_slot_template, /*$$scope*/ ctx[62], dirty, get_expanded_row_slot_changes),
    						get_expanded_row_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(expanded_row_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(expanded_row_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (expanded_row_slot) expanded_row_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$5.name,
    		type: "slot",
    		source: "(511:14) <TableCell                 colspan=\\\"{selectable ? headers.length + 2 : headers.length + 1}\\\"               >",
    		ctx
    	});

    	return block;
    }

    // (366:6) {#each sorting ? displayedSortedRows : displayedRows as row, i (row.id)}
    function create_each_block$4(key_1, ctx) {
    	let first;
    	let tablerow;
    	let t;
    	let if_block_anchor;
    	let current;

    	function click_handler_4(...args) {
    		return /*click_handler_4*/ ctx[57](/*row*/ ctx[66], ...args);
    	}

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[58](/*row*/ ctx[66]);
    	}

    	function mouseleave_handler() {
    		return /*mouseleave_handler*/ ctx[59](/*row*/ ctx[66]);
    	}

    	tablerow = new TableRow$1({
    			props: {
    				"data-row": /*row*/ ctx[66].id,
    				"data-parent-row": /*expandable*/ ctx[4] ? true : undefined,
    				class: "" + ((/*selectedRowIds*/ ctx[3].includes(/*row*/ ctx[66].id)
    				? 'bx--data-table--selected'
    				: '') + " " + (/*expandedRows*/ ctx[31][/*row*/ ctx[66].id]
    				? 'bx--expandable-row'
    				: '') + " " + (/*expandable*/ ctx[4] ? 'bx--parent-row' : '') + " " + (/*expandable*/ ctx[4] && /*parentRowId*/ ctx[23] === /*row*/ ctx[66].id
    				? 'bx--expandable-row--hover'
    				: '')),
    				$$slots: { default: [create_default_slot_4$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tablerow.$on("click", click_handler_4);
    	tablerow.$on("mouseenter", mouseenter_handler);
    	tablerow.$on("mouseleave", mouseleave_handler);
    	let if_block = /*expandable*/ ctx[4] && create_if_block$k(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(tablerow.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(tablerow, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const tablerow_changes = {};
    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows*/ 201850880) tablerow_changes["data-row"] = /*row*/ ctx[66].id;
    			if (dirty[0] & /*expandable*/ 16) tablerow_changes["data-parent-row"] = /*expandable*/ ctx[4] ? true : undefined;

    			if (dirty[0] & /*selectedRowIds, sorting, displayedSortedRows, displayedRows, expandable, parentRowId*/ 210239512 | dirty[1] & /*expandedRows*/ 1) tablerow_changes.class = "" + ((/*selectedRowIds*/ ctx[3].includes(/*row*/ ctx[66].id)
    			? 'bx--data-table--selected'
    			: '') + " " + (/*expandedRows*/ ctx[31][/*row*/ ctx[66].id]
    			? 'bx--expandable-row'
    			: '') + " " + (/*expandable*/ ctx[4] ? 'bx--parent-row' : '') + " " + (/*expandable*/ ctx[4] && /*parentRowId*/ ctx[23] === /*row*/ ctx[66].id
    			? 'bx--expandable-row--hover'
    			: ''));

    			if (dirty[0] & /*tableCellsByRowId, sorting, displayedSortedRows, displayedRows, headers, radio, selectedRowIds, nonSelectableRowIds, selectable, nonExpandableRowIds, expandedRowIds, expandable*/ 470376572 | dirty[1] & /*expandedRows*/ 1 | dirty[2] & /*$$scope*/ 1) {
    				tablerow_changes.$$scope = { dirty, ctx };
    			}

    			tablerow.$set(tablerow_changes);

    			if (/*expandable*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*expandable*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$k(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablerow.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablerow.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(tablerow, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(366:6) {#each sorting ? displayedSortedRows : displayedRows as row, i (row.id)}",
    		ctx
    	});

    	return block;
    }

    // (365:4) <TableBody>
    function create_default_slot_2$6(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;

    	let each_value = /*sorting*/ ctx[19]
    	? /*displayedSortedRows*/ ctx[26]
    	: /*displayedRows*/ ctx[27];

    	validate_each_argument(each_value);
    	const get_key = ctx => /*row*/ ctx[66].id;
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*nonExpandableRowIds, sorting, displayedSortedRows, displayedRows, parentRowId, selectable, headers, expandable, selectedRowIds, tableCellsByRowId, radio, nonSelectableRowIds, expandedRowIds*/ 478765180 | dirty[1] & /*expandedRows, dispatch*/ 9 | dirty[2] & /*$$scope*/ 1) {
    				each_value = /*sorting*/ ctx[19]
    				? /*displayedSortedRows*/ ctx[26]
    				: /*displayedRows*/ ctx[27];

    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$4, each_1_anchor, get_each_context$4);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$6.name,
    		type: "slot",
    		source: "(365:4) <TableBody>",
    		ctx
    	});

    	return block;
    }

    // (275:2) <Table     zebra="{zebra}"     size="{size}"     stickyHeader="{stickyHeader}"     sortable="{sortable}"     useStaticWidth="{useStaticWidth}"     tableStyle="{hasCustomHeaderWidth && 'table-layout: fixed'}"   >
    function create_default_slot_1$9(ctx) {
    	let tablehead;
    	let t;
    	let tablebody;
    	let current;

    	tablehead = new TableHead$1({
    			props: {
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tablebody = new TableBody$1({
    			props: {
    				$$slots: { default: [create_default_slot_2$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablehead.$$.fragment);
    			t = space();
    			create_component(tablebody.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablehead, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(tablebody, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablehead_changes = {};

    			if (dirty[0] & /*headers, sortable, sortKey, sortDirection, selectAll, indeterminate, refSelectAll, selectedRowIds, selectableRowIds, batchSelection, radio, selectable, expanded, expandedRowIds, expandableRowIds, batchExpansion, expandable*/ 1634785407 | dirty[1] & /*thKeys*/ 2 | dirty[2] & /*$$scope*/ 1) {
    				tablehead_changes.$$scope = { dirty, ctx };
    			}

    			tablehead.$set(tablehead_changes);
    			const tablebody_changes = {};

    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows, nonExpandableRowIds, parentRowId, selectable, headers, expandable, selectedRowIds, tableCellsByRowId, radio, nonSelectableRowIds, expandedRowIds*/ 478765180 | dirty[1] & /*expandedRows*/ 1 | dirty[2] & /*$$scope*/ 1) {
    				tablebody_changes.$$scope = { dirty, ctx };
    			}

    			tablebody.$set(tablebody_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablehead.$$.fragment, local);
    			transition_in(tablebody.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablehead.$$.fragment, local);
    			transition_out(tablebody.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablehead, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(tablebody, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$9.name,
    		type: "slot",
    		source: "(275:2) <Table     zebra=\\\"{zebra}\\\"     size=\\\"{size}\\\"     stickyHeader=\\\"{stickyHeader}\\\"     sortable=\\\"{sortable}\\\"     useStaticWidth=\\\"{useStaticWidth}\\\"     tableStyle=\\\"{hasCustomHeaderWidth && 'table-layout: fixed'}\\\"   >",
    		ctx
    	});

    	return block;
    }

    // (259:0) <TableContainer useStaticWidth="{useStaticWidth}" {...$$restProps}>
    function create_default_slot$a(ctx) {
    	let t0;
    	let t1;
    	let table;
    	let current;
    	let if_block = (/*title*/ ctx[8] || /*$$slots*/ ctx[38].title || /*description*/ ctx[9] || /*$$slots*/ ctx[38].description) && create_if_block_13(ctx);
    	const default_slot_template = /*#slots*/ ctx[48].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[62], null);

    	table = new Table$1({
    			props: {
    				zebra: /*zebra*/ ctx[10],
    				size: /*size*/ ctx[7],
    				stickyHeader: /*stickyHeader*/ ctx[17],
    				sortable: /*sortable*/ ctx[11],
    				useStaticWidth: /*useStaticWidth*/ ctx[18],
    				tableStyle: /*hasCustomHeaderWidth*/ ctx[25] && 'table-layout: fixed',
    				$$slots: { default: [create_default_slot_1$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*title*/ ctx[8] || /*$$slots*/ ctx[38].title || /*description*/ ctx[9] || /*$$slots*/ ctx[38].description) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*title, description*/ 768 | dirty[1] & /*$$slots*/ 128) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_13(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[2] & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[62],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[62])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[62], dirty, null),
    						null
    					);
    				}
    			}

    			const table_changes = {};
    			if (dirty[0] & /*zebra*/ 1024) table_changes.zebra = /*zebra*/ ctx[10];
    			if (dirty[0] & /*size*/ 128) table_changes.size = /*size*/ ctx[7];
    			if (dirty[0] & /*stickyHeader*/ 131072) table_changes.stickyHeader = /*stickyHeader*/ ctx[17];
    			if (dirty[0] & /*sortable*/ 2048) table_changes.sortable = /*sortable*/ ctx[11];
    			if (dirty[0] & /*useStaticWidth*/ 262144) table_changes.useStaticWidth = /*useStaticWidth*/ ctx[18];
    			if (dirty[0] & /*hasCustomHeaderWidth*/ 33554432) table_changes.tableStyle = /*hasCustomHeaderWidth*/ ctx[25] && 'table-layout: fixed';

    			if (dirty[0] & /*sorting, displayedSortedRows, displayedRows, nonExpandableRowIds, parentRowId, selectable, headers, expandable, selectedRowIds, tableCellsByRowId, radio, nonSelectableRowIds, expandedRowIds, sortable, sortKey, sortDirection, selectAll, indeterminate, refSelectAll, selectableRowIds, batchSelection, expanded, expandableRowIds, batchExpansion*/ 2113534079 | dirty[1] & /*expandedRows, thKeys*/ 3 | dirty[2] & /*$$scope*/ 1) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(259:0) <TableContainer useStaticWidth=\\\"{useStaticWidth}\\\" {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$y(ctx) {
    	let tablecontainer;
    	let current;

    	const tablecontainer_spread_levels = [
    		{
    			useStaticWidth: /*useStaticWidth*/ ctx[18]
    		},
    		/*$$restProps*/ ctx[37]
    	];

    	let tablecontainer_props = {
    		$$slots: { default: [create_default_slot$a] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < tablecontainer_spread_levels.length; i += 1) {
    		tablecontainer_props = assign(tablecontainer_props, tablecontainer_spread_levels[i]);
    	}

    	tablecontainer = new TableContainer$1({
    			props: tablecontainer_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tablecontainer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablecontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablecontainer_changes = (dirty[0] & /*useStaticWidth*/ 262144 | dirty[1] & /*$$restProps*/ 64)
    			? get_spread_update(tablecontainer_spread_levels, [
    					dirty[0] & /*useStaticWidth*/ 262144 && {
    						useStaticWidth: /*useStaticWidth*/ ctx[18]
    					},
    					dirty[1] & /*$$restProps*/ 64 && get_spread_object(/*$$restProps*/ ctx[37])
    				])
    			: {};

    			if (dirty[0] & /*zebra, size, stickyHeader, sortable, useStaticWidth, hasCustomHeaderWidth, sorting, displayedSortedRows, displayedRows, nonExpandableRowIds, parentRowId, selectable, headers, expandable, selectedRowIds, tableCellsByRowId, radio, nonSelectableRowIds, expandedRowIds, sortKey, sortDirection, selectAll, indeterminate, refSelectAll, selectableRowIds, batchSelection, expanded, expandableRowIds, batchExpansion, description, title*/ 2147483647 | dirty[1] & /*expandedRows, thKeys, $$slots*/ 131 | dirty[2] & /*$$scope*/ 1) {
    				tablecontainer_changes.$$scope = { dirty, ctx };
    			}

    			tablecontainer.$set(tablecontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablecontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablecontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablecontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	let thKeys;
    	let expandedRows;
    	let rowIds;
    	let expandableRowIds;
    	let selectableRowIds;
    	let selectAll;
    	let indeterminate;
    	let headerKeys;
    	let tableCellsByRowId;
    	let sortedRows;
    	let ascending;
    	let sorting;
    	let sortingHeader;
    	let displayedRows;
    	let displayedSortedRows;
    	let hasCustomHeaderWidth;

    	const omit_props_names = [
    		"headers","rows","size","title","description","zebra","sortable","sortKey","sortDirection","expandable","batchExpansion","expandedRowIds","nonExpandableRowIds","radio","selectable","batchSelection","selectedRowIds","nonSelectableRowIds","stickyHeader","useStaticWidth","pageSize","page"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $tableRows;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DataTable', slots, ['title','description','default','cell-header','cell','expanded-row']);
    	const $$slots = compute_slots(slots);
    	let { headers = [] } = $$props;
    	let { rows = [] } = $$props;
    	let { size = undefined } = $$props;
    	let { title = "" } = $$props;
    	let { description = "" } = $$props;
    	let { zebra = false } = $$props;
    	let { sortable = false } = $$props;
    	let { sortKey = null } = $$props;
    	let { sortDirection = "none" } = $$props;
    	let { expandable = false } = $$props;
    	let { batchExpansion = false } = $$props;
    	let { expandedRowIds = [] } = $$props;
    	let { nonExpandableRowIds = [] } = $$props;
    	let { radio = false } = $$props;
    	let { selectable = false } = $$props;
    	let { batchSelection = false } = $$props;
    	let { selectedRowIds = [] } = $$props;
    	let { nonSelectableRowIds = [] } = $$props;
    	let { stickyHeader = false } = $$props;
    	let { useStaticWidth = false } = $$props;
    	let { pageSize = 0 } = $$props;
    	let { page = 0 } = $$props;

    	const sortDirectionMap = {
    		none: "ascending",
    		ascending: "descending",
    		descending: "none"
    	};

    	const dispatch = createEventDispatcher();
    	const batchSelectedIds = writable(false);
    	const tableRows = writable(rows);
    	validate_store(tableRows, 'tableRows');
    	component_subscribe($$self, tableRows, value => $$invalidate(47, $tableRows = value));

    	const resolvePath = (object, path) => {
    		if (path in object) return object[path];
    		return path.split(/[\.\[\]\'\"]/).filter(p => p).reduce((o, p) => o && typeof o === "object" ? o[p] : o, object);
    	};

    	setContext("DataTable", {
    		batchSelectedIds,
    		tableRows,
    		resetSelectedRowIds: () => {
    			$$invalidate(30, selectAll = false);
    			$$invalidate(3, selectedRowIds = []);
    			if (refSelectAll) $$invalidate(24, refSelectAll.checked = false, refSelectAll);
    		}
    	});

    	let expanded = false;
    	let parentRowId = null;
    	let refSelectAll = null;

    	const getDisplayedRows = (rows, page, pageSize) => page && pageSize
    	? rows.slice((page - 1) * pageSize, page * pageSize)
    	: rows;

    	/** @type {(header: DataTableHeader) => undefined | string} */
    	const formatHeaderWidth = header => {
    		const styles = [
    			header.width && `width: ${header.width}`,
    			header.minWidth && `min-width: ${header.minWidth}`
    		].filter(Boolean);

    		if (styles.length === 0) return undefined;
    		return styles.join(";");
    	};

    	const click_handler = () => {
    		$$invalidate(22, expanded = !expanded);
    		$$invalidate(2, expandedRowIds = expanded ? expandableRowIds : []);
    		dispatch('click:header--expand', { expanded });
    	};

    	function inlinecheckbox_ref_binding(value) {
    		refSelectAll = value;
    		$$invalidate(24, refSelectAll);
    	}

    	const change_handler = e => {
    		if (indeterminate) {
    			e.target.checked = false;
    			$$invalidate(30, selectAll = false);
    			$$invalidate(3, selectedRowIds = []);
    			return;
    		}

    		if (e.target.checked) {
    			$$invalidate(3, selectedRowIds = selectableRowIds);
    		} else {
    			$$invalidate(3, selectedRowIds = []);
    		}
    	};

    	const click_handler_1 = header => {
    		dispatch('click', { header });

    		if (header.sort === false) {
    			dispatch('click:header', { header });
    		} else {
    			let currentSortDirection = sortKey === header.key ? sortDirection : 'none';
    			$$invalidate(1, sortDirection = sortDirectionMap[currentSortDirection]);
    			$$invalidate(0, sortKey = sortDirection === 'none' ? null : thKeys[header.key]);
    			dispatch('click:header', { header, sortDirection });
    		}
    	};

    	const click_handler_2 = row => {
    		const rowExpanded = !!expandedRows[row.id];

    		$$invalidate(2, expandedRowIds = rowExpanded
    		? expandedRowIds.filter(id => id !== row.id)
    		: [...expandedRowIds, row.id]);

    		dispatch('click:row--expand', { row, expanded: !rowExpanded });
    	};

    	const change_handler_1 = row => {
    		$$invalidate(3, selectedRowIds = [row.id]);
    	};

    	const change_handler_2 = row => {
    		if (selectedRowIds.includes(row.id)) {
    			$$invalidate(3, selectedRowIds = selectedRowIds.filter(id => id !== row.id));
    		} else {
    			$$invalidate(3, selectedRowIds = [...selectedRowIds, row.id]);
    		}
    	};

    	const click_handler_3 = (row, cell) => {
    		dispatch('click', { row, cell });
    		dispatch('click:cell', cell);
    	};

    	const click_handler_4 = (row, { target }) => {
    		// forgo "click", "click:row" events if target
    		// resembles an overflow menu, a checkbox, or radio button
    		if ([...target.classList].some(name => (/^bx--(overflow-menu|checkbox|radio-button)/).test(name))) {
    			return;
    		}

    		dispatch('click', { row });
    		dispatch('click:row', row);
    	};

    	const mouseenter_handler = row => {
    		dispatch('mouseenter:row', row);
    	};

    	const mouseleave_handler = row => {
    		dispatch('mouseleave:row', row);
    	};

    	const mouseenter_handler_1 = row => {
    		if (nonExpandableRowIds.includes(row.id)) return;
    		$$invalidate(23, parentRowId = row.id);
    	};

    	const mouseleave_handler_1 = row => {
    		if (nonExpandableRowIds.includes(row.id)) return;
    		$$invalidate(23, parentRowId = null);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(37, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('headers' in $$new_props) $$invalidate(6, headers = $$new_props.headers);
    		if ('rows' in $$new_props) $$invalidate(39, rows = $$new_props.rows);
    		if ('size' in $$new_props) $$invalidate(7, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(8, title = $$new_props.title);
    		if ('description' in $$new_props) $$invalidate(9, description = $$new_props.description);
    		if ('zebra' in $$new_props) $$invalidate(10, zebra = $$new_props.zebra);
    		if ('sortable' in $$new_props) $$invalidate(11, sortable = $$new_props.sortable);
    		if ('sortKey' in $$new_props) $$invalidate(0, sortKey = $$new_props.sortKey);
    		if ('sortDirection' in $$new_props) $$invalidate(1, sortDirection = $$new_props.sortDirection);
    		if ('expandable' in $$new_props) $$invalidate(4, expandable = $$new_props.expandable);
    		if ('batchExpansion' in $$new_props) $$invalidate(12, batchExpansion = $$new_props.batchExpansion);
    		if ('expandedRowIds' in $$new_props) $$invalidate(2, expandedRowIds = $$new_props.expandedRowIds);
    		if ('nonExpandableRowIds' in $$new_props) $$invalidate(13, nonExpandableRowIds = $$new_props.nonExpandableRowIds);
    		if ('radio' in $$new_props) $$invalidate(14, radio = $$new_props.radio);
    		if ('selectable' in $$new_props) $$invalidate(5, selectable = $$new_props.selectable);
    		if ('batchSelection' in $$new_props) $$invalidate(15, batchSelection = $$new_props.batchSelection);
    		if ('selectedRowIds' in $$new_props) $$invalidate(3, selectedRowIds = $$new_props.selectedRowIds);
    		if ('nonSelectableRowIds' in $$new_props) $$invalidate(16, nonSelectableRowIds = $$new_props.nonSelectableRowIds);
    		if ('stickyHeader' in $$new_props) $$invalidate(17, stickyHeader = $$new_props.stickyHeader);
    		if ('useStaticWidth' in $$new_props) $$invalidate(18, useStaticWidth = $$new_props.useStaticWidth);
    		if ('pageSize' in $$new_props) $$invalidate(40, pageSize = $$new_props.pageSize);
    		if ('page' in $$new_props) $$invalidate(41, page = $$new_props.page);
    		if ('$$scope' in $$new_props) $$invalidate(62, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		headers,
    		rows,
    		size,
    		title,
    		description,
    		zebra,
    		sortable,
    		sortKey,
    		sortDirection,
    		expandable,
    		batchExpansion,
    		expandedRowIds,
    		nonExpandableRowIds,
    		radio,
    		selectable,
    		batchSelection,
    		selectedRowIds,
    		nonSelectableRowIds,
    		stickyHeader,
    		useStaticWidth,
    		pageSize,
    		page,
    		createEventDispatcher,
    		setContext,
    		writable,
    		derived,
    		ChevronRight: ChevronRight$1,
    		InlineCheckbox: InlineCheckbox$1,
    		RadioButton: RadioButton$1,
    		Table: Table$1,
    		TableBody: TableBody$1,
    		TableCell: TableCell$1,
    		TableContainer: TableContainer$1,
    		TableHead: TableHead$1,
    		TableHeader: TableHeader$1,
    		TableRow: TableRow$1,
    		sortDirectionMap,
    		dispatch,
    		batchSelectedIds,
    		tableRows,
    		resolvePath,
    		expanded,
    		parentRowId,
    		refSelectAll,
    		getDisplayedRows,
    		formatHeaderWidth,
    		hasCustomHeaderWidth,
    		sortedRows,
    		displayedSortedRows,
    		displayedRows,
    		ascending,
    		sortingHeader,
    		sorting,
    		headerKeys,
    		tableCellsByRowId,
    		expandableRowIds,
    		selectableRowIds,
    		indeterminate,
    		selectAll,
    		rowIds,
    		expandedRows,
    		thKeys,
    		$tableRows
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('headers' in $$props) $$invalidate(6, headers = $$new_props.headers);
    		if ('rows' in $$props) $$invalidate(39, rows = $$new_props.rows);
    		if ('size' in $$props) $$invalidate(7, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(8, title = $$new_props.title);
    		if ('description' in $$props) $$invalidate(9, description = $$new_props.description);
    		if ('zebra' in $$props) $$invalidate(10, zebra = $$new_props.zebra);
    		if ('sortable' in $$props) $$invalidate(11, sortable = $$new_props.sortable);
    		if ('sortKey' in $$props) $$invalidate(0, sortKey = $$new_props.sortKey);
    		if ('sortDirection' in $$props) $$invalidate(1, sortDirection = $$new_props.sortDirection);
    		if ('expandable' in $$props) $$invalidate(4, expandable = $$new_props.expandable);
    		if ('batchExpansion' in $$props) $$invalidate(12, batchExpansion = $$new_props.batchExpansion);
    		if ('expandedRowIds' in $$props) $$invalidate(2, expandedRowIds = $$new_props.expandedRowIds);
    		if ('nonExpandableRowIds' in $$props) $$invalidate(13, nonExpandableRowIds = $$new_props.nonExpandableRowIds);
    		if ('radio' in $$props) $$invalidate(14, radio = $$new_props.radio);
    		if ('selectable' in $$props) $$invalidate(5, selectable = $$new_props.selectable);
    		if ('batchSelection' in $$props) $$invalidate(15, batchSelection = $$new_props.batchSelection);
    		if ('selectedRowIds' in $$props) $$invalidate(3, selectedRowIds = $$new_props.selectedRowIds);
    		if ('nonSelectableRowIds' in $$props) $$invalidate(16, nonSelectableRowIds = $$new_props.nonSelectableRowIds);
    		if ('stickyHeader' in $$props) $$invalidate(17, stickyHeader = $$new_props.stickyHeader);
    		if ('useStaticWidth' in $$props) $$invalidate(18, useStaticWidth = $$new_props.useStaticWidth);
    		if ('pageSize' in $$props) $$invalidate(40, pageSize = $$new_props.pageSize);
    		if ('page' in $$props) $$invalidate(41, page = $$new_props.page);
    		if ('expanded' in $$props) $$invalidate(22, expanded = $$new_props.expanded);
    		if ('parentRowId' in $$props) $$invalidate(23, parentRowId = $$new_props.parentRowId);
    		if ('refSelectAll' in $$props) $$invalidate(24, refSelectAll = $$new_props.refSelectAll);
    		if ('hasCustomHeaderWidth' in $$props) $$invalidate(25, hasCustomHeaderWidth = $$new_props.hasCustomHeaderWidth);
    		if ('sortedRows' in $$props) $$invalidate(42, sortedRows = $$new_props.sortedRows);
    		if ('displayedSortedRows' in $$props) $$invalidate(26, displayedSortedRows = $$new_props.displayedSortedRows);
    		if ('displayedRows' in $$props) $$invalidate(27, displayedRows = $$new_props.displayedRows);
    		if ('ascending' in $$props) $$invalidate(43, ascending = $$new_props.ascending);
    		if ('sortingHeader' in $$props) $$invalidate(44, sortingHeader = $$new_props.sortingHeader);
    		if ('sorting' in $$props) $$invalidate(19, sorting = $$new_props.sorting);
    		if ('headerKeys' in $$props) $$invalidate(45, headerKeys = $$new_props.headerKeys);
    		if ('tableCellsByRowId' in $$props) $$invalidate(28, tableCellsByRowId = $$new_props.tableCellsByRowId);
    		if ('expandableRowIds' in $$props) $$invalidate(20, expandableRowIds = $$new_props.expandableRowIds);
    		if ('selectableRowIds' in $$props) $$invalidate(21, selectableRowIds = $$new_props.selectableRowIds);
    		if ('indeterminate' in $$props) $$invalidate(29, indeterminate = $$new_props.indeterminate);
    		if ('selectAll' in $$props) $$invalidate(30, selectAll = $$new_props.selectAll);
    		if ('rowIds' in $$props) $$invalidate(46, rowIds = $$new_props.rowIds);
    		if ('expandedRows' in $$props) $$invalidate(31, expandedRows = $$new_props.expandedRows);
    		if ('thKeys' in $$props) $$invalidate(32, thKeys = $$new_props.thKeys);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*headers*/ 64) {
    			$$invalidate(32, thKeys = headers.reduce((a, c) => ({ ...a, [c.key]: c.key }), {}));
    		}

    		if ($$self.$$.dirty[0] & /*expandedRowIds*/ 4) {
    			$$invalidate(31, expandedRows = expandedRowIds.reduce((a, id) => ({ ...a, [id]: true }), {}));
    		}

    		if ($$self.$$.dirty[0] & /*selectedRowIds*/ 8) {
    			batchSelectedIds.set(selectedRowIds);
    		}

    		if ($$self.$$.dirty[0] & /*headers*/ 64) {
    			$$invalidate(45, headerKeys = headers.map(({ key }) => key));
    		}

    		if ($$self.$$.dirty[0] & /*headers*/ 64 | $$self.$$.dirty[1] & /*rows, headerKeys*/ 16640) {
    			$$invalidate(28, tableCellsByRowId = rows.reduce(
    				(rows, row) => {
    					rows[row.id] = headerKeys.map((key, index) => ({
    						key,
    						value: resolvePath(row, key),
    						display: headers[index].display
    					}));

    					return rows;
    				},
    				{}
    			));
    		}

    		if ($$self.$$.dirty[1] & /*rows*/ 256) {
    			set_store_value(tableRows, $tableRows = rows, $tableRows);
    		}

    		if ($$self.$$.dirty[1] & /*$tableRows*/ 65536) {
    			$$invalidate(46, rowIds = $tableRows.map(row => row.id));
    		}

    		if ($$self.$$.dirty[0] & /*nonExpandableRowIds*/ 8192 | $$self.$$.dirty[1] & /*rowIds*/ 32768) {
    			$$invalidate(20, expandableRowIds = rowIds.filter(id => !nonExpandableRowIds.includes(id)));
    		}

    		if ($$self.$$.dirty[0] & /*nonSelectableRowIds*/ 65536 | $$self.$$.dirty[1] & /*rowIds*/ 32768) {
    			$$invalidate(21, selectableRowIds = rowIds.filter(id => !nonSelectableRowIds.includes(id)));
    		}

    		if ($$self.$$.dirty[0] & /*selectableRowIds, selectedRowIds*/ 2097160) {
    			$$invalidate(30, selectAll = selectableRowIds.length > 0 && selectedRowIds.length === selectableRowIds.length);
    		}

    		if ($$self.$$.dirty[0] & /*selectedRowIds, selectableRowIds*/ 2097160) {
    			$$invalidate(29, indeterminate = selectedRowIds.length > 0 && selectedRowIds.length < selectableRowIds.length);
    		}

    		if ($$self.$$.dirty[0] & /*batchExpansion, expandedRowIds, expandableRowIds*/ 1052676) {
    			if (batchExpansion) {
    				$$invalidate(4, expandable = true);
    				$$invalidate(22, expanded = expandedRowIds.length === expandableRowIds.length);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*radio, batchSelection*/ 49152) {
    			if (radio || batchSelection) $$invalidate(5, selectable = true);
    		}

    		if ($$self.$$.dirty[1] & /*$tableRows*/ 65536) {
    			$$invalidate(42, sortedRows = [...$tableRows]);
    		}

    		if ($$self.$$.dirty[0] & /*sortDirection*/ 2) {
    			$$invalidate(43, ascending = sortDirection === "ascending");
    		}

    		if ($$self.$$.dirty[0] & /*sortable, sortKey*/ 2049) {
    			$$invalidate(19, sorting = sortable && sortKey != null);
    		}

    		if ($$self.$$.dirty[0] & /*headers, sortKey*/ 65) {
    			$$invalidate(44, sortingHeader = headers.find(header => header.key === sortKey));
    		}

    		if ($$self.$$.dirty[0] & /*sorting, sortDirection, sortKey*/ 524291 | $$self.$$.dirty[1] & /*$tableRows, ascending, sortingHeader*/ 77824) {
    			if (sorting) {
    				if (sortDirection === "none") {
    					$$invalidate(42, sortedRows = $tableRows);
    				} else {
    					$$invalidate(42, sortedRows = [...$tableRows].sort((a, b) => {
    						const itemA = ascending
    						? resolvePath(a, sortKey)
    						: resolvePath(b, sortKey);

    						const itemB = ascending
    						? resolvePath(b, sortKey)
    						: resolvePath(a, sortKey);

    						if (sortingHeader?.sort) return sortingHeader.sort(itemA, itemB);
    						if (typeof itemA === "number" && typeof itemB === "number") return itemA - itemB;
    						if ([itemA, itemB].every(item => !item && item !== 0)) return 0;
    						if (!itemA && itemA !== 0) return ascending ? 1 : -1;
    						if (!itemB && itemB !== 0) return ascending ? -1 : 1;
    						return itemA.toString().localeCompare(itemB.toString(), "en", { numeric: true });
    					}));
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*$tableRows, page, pageSize*/ 67072) {
    			$$invalidate(27, displayedRows = getDisplayedRows($tableRows, page, pageSize));
    		}

    		if ($$self.$$.dirty[1] & /*sortedRows, page, pageSize*/ 3584) {
    			$$invalidate(26, displayedSortedRows = getDisplayedRows(sortedRows, page, pageSize));
    		}

    		if ($$self.$$.dirty[0] & /*headers*/ 64) {
    			$$invalidate(25, hasCustomHeaderWidth = headers.some(header => header.width || header.minWidth));
    		}
    	};

    	return [
    		sortKey,
    		sortDirection,
    		expandedRowIds,
    		selectedRowIds,
    		expandable,
    		selectable,
    		headers,
    		size,
    		title,
    		description,
    		zebra,
    		sortable,
    		batchExpansion,
    		nonExpandableRowIds,
    		radio,
    		batchSelection,
    		nonSelectableRowIds,
    		stickyHeader,
    		useStaticWidth,
    		sorting,
    		expandableRowIds,
    		selectableRowIds,
    		expanded,
    		parentRowId,
    		refSelectAll,
    		hasCustomHeaderWidth,
    		displayedSortedRows,
    		displayedRows,
    		tableCellsByRowId,
    		indeterminate,
    		selectAll,
    		expandedRows,
    		thKeys,
    		sortDirectionMap,
    		dispatch,
    		tableRows,
    		formatHeaderWidth,
    		$$restProps,
    		$$slots,
    		rows,
    		pageSize,
    		page,
    		sortedRows,
    		ascending,
    		sortingHeader,
    		headerKeys,
    		rowIds,
    		$tableRows,
    		slots,
    		click_handler,
    		inlinecheckbox_ref_binding,
    		change_handler,
    		click_handler_1,
    		click_handler_2,
    		change_handler_1,
    		change_handler_2,
    		click_handler_3,
    		click_handler_4,
    		mouseenter_handler,
    		mouseleave_handler,
    		mouseenter_handler_1,
    		mouseleave_handler_1,
    		$$scope
    	];
    }

    class DataTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$y,
    			create_fragment$y,
    			safe_not_equal,
    			{
    				headers: 6,
    				rows: 39,
    				size: 7,
    				title: 8,
    				description: 9,
    				zebra: 10,
    				sortable: 11,
    				sortKey: 0,
    				sortDirection: 1,
    				expandable: 4,
    				batchExpansion: 12,
    				expandedRowIds: 2,
    				nonExpandableRowIds: 13,
    				radio: 14,
    				selectable: 5,
    				batchSelection: 15,
    				selectedRowIds: 3,
    				nonSelectableRowIds: 16,
    				stickyHeader: 17,
    				useStaticWidth: 18,
    				pageSize: 40,
    				page: 41
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DataTable",
    			options,
    			id: create_fragment$y.name
    		});
    	}

    	get headers() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headers(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zebra() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zebra(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortable() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortable(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortKey() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortKey(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortDirection() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortDirection(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expandable() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expandable(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get batchExpansion() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set batchExpansion(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expandedRowIds() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expandedRowIds(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nonExpandableRowIds() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nonExpandableRowIds(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get radio() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set radio(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectable() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectable(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get batchSelection() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set batchSelection(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedRowIds() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedRowIds(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nonSelectableRowIds() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nonSelectableRowIds(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stickyHeader() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stickyHeader(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get useStaticWidth() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set useStaticWidth(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSize() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSize(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get page() {
    		throw new Error("<DataTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<DataTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var DataTable$1 = DataTable;

    /* node_modules\carbon-components-svelte\src\icons\OverflowMenuVertical.svelte generated by Svelte v3.49.0 */

    const file$v = "node_modules\\carbon-components-svelte\\src\\icons\\OverflowMenuVertical.svelte";

    // (24:2) {#if title}
    function create_if_block$j(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$v, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let svg;
    	let circle0;
    	let circle1;
    	let circle2;
    	let if_block = /*title*/ ctx[1] && create_if_block$j(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			attr_dev(circle0, "cx", "16");
    			attr_dev(circle0, "cy", "8");
    			attr_dev(circle0, "r", "2");
    			add_location(circle0, file$v, 24, 2, 579);
    			attr_dev(circle1, "cx", "16");
    			attr_dev(circle1, "cy", "16");
    			attr_dev(circle1, "r", "2");
    			add_location(circle1, file$v, 24, 40, 617);
    			attr_dev(circle2, "cx", "16");
    			attr_dev(circle2, "cy", "24");
    			attr_dev(circle2, "r", "2");
    			add_location(circle2, file$v, 25, 12, 659);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$v, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, circle2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$j(ctx);
    					if_block.c();
    					if_block.m(svg, circle0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OverflowMenuVertical', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class OverflowMenuVertical extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverflowMenuVertical",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get size() {
    		throw new Error("<OverflowMenuVertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<OverflowMenuVertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<OverflowMenuVertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<OverflowMenuVertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var OverflowMenuVertical$1 = OverflowMenuVertical;

    /* node_modules\carbon-components-svelte\src\icons\OverflowMenuHorizontal.svelte generated by Svelte v3.49.0 */

    const file$u = "node_modules\\carbon-components-svelte\\src\\icons\\OverflowMenuHorizontal.svelte";

    // (24:2) {#if title}
    function create_if_block$i(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$u, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let svg;
    	let circle0;
    	let circle1;
    	let circle2;
    	let if_block = /*title*/ ctx[1] && create_if_block$i(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			attr_dev(circle0, "cx", "8");
    			attr_dev(circle0, "cy", "16");
    			attr_dev(circle0, "r", "2");
    			add_location(circle0, file$u, 24, 2, 579);
    			attr_dev(circle1, "cx", "16");
    			attr_dev(circle1, "cy", "16");
    			attr_dev(circle1, "r", "2");
    			add_location(circle1, file$u, 24, 40, 617);
    			attr_dev(circle2, "cx", "24");
    			attr_dev(circle2, "cy", "16");
    			attr_dev(circle2, "r", "2");
    			add_location(circle2, file$u, 25, 12, 659);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$u, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, circle0);
    			append_dev(svg, circle1);
    			append_dev(svg, circle2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$i(ctx);
    					if_block.c();
    					if_block.m(svg, circle0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OverflowMenuHorizontal', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class OverflowMenuHorizontal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$w, create_fragment$w, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverflowMenuHorizontal",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get size() {
    		throw new Error("<OverflowMenuHorizontal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<OverflowMenuHorizontal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<OverflowMenuHorizontal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<OverflowMenuHorizontal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var OverflowMenuHorizontal$1 = OverflowMenuHorizontal;

    /* node_modules\carbon-components-svelte\src\OverflowMenu\OverflowMenu.svelte generated by Svelte v3.49.0 */
    const file$t = "node_modules\\carbon-components-svelte\\src\\OverflowMenu\\OverflowMenu.svelte";
    const get_menu_slot_changes = dirty => ({});
    const get_menu_slot_context = ctx => ({});

    // (233:20)      
    function fallback_block$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*icon*/ ctx[1];

    	function switch_props(ctx) {
    		return {
    			props: {
    				"aria-label": /*iconDescription*/ ctx[10],
    				title: /*iconDescription*/ ctx[10],
    				class: "bx--overflow-menu__icon " + /*iconClass*/ ctx[9]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*iconDescription*/ 1024) switch_instance_changes["aria-label"] = /*iconDescription*/ ctx[10];
    			if (dirty[0] & /*iconDescription*/ 1024) switch_instance_changes.title = /*iconDescription*/ ctx[10];
    			if (dirty[0] & /*iconClass*/ 512) switch_instance_changes.class = "bx--overflow-menu__icon " + /*iconClass*/ ctx[9];

    			if (switch_value !== (switch_value = /*icon*/ ctx[1])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$5.name,
    		type: "fallback",
    		source: "(233:20)      ",
    		ctx
    	});

    	return block;
    }

    // (241:2) {#if open}
    function create_if_block$h(ctx) {
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[23].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[22], null);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			attr_dev(ul, "role", "menu");
    			attr_dev(ul, "tabindex", "-1");
    			attr_dev(ul, "aria-label", /*ariaLabel*/ ctx[13]);
    			attr_dev(ul, "data-floating-menu-direction", /*direction*/ ctx[5]);
    			attr_dev(ul, "class", /*menuOptionsClass*/ ctx[8]);
    			toggle_class(ul, "bx--overflow-menu-options", true);
    			toggle_class(ul, "bx--overflow-menu--flip", /*flipped*/ ctx[7]);
    			toggle_class(ul, "bx--overflow-menu-options--open", /*open*/ ctx[0]);
    			toggle_class(ul, "bx--overflow-menu-options--light", /*light*/ ctx[6]);
    			toggle_class(ul, "bx--overflow-menu-options--sm", /*size*/ ctx[4] === 'sm');
    			toggle_class(ul, "bx--overflow-menu-options--xl", /*size*/ ctx[4] === 'xl');
    			toggle_class(ul, "bx--breadcrumb-menu-options", !!/*ctxBreadcrumbItem*/ ctx[14]);
    			add_location(ul, file$t, 241, 4, 5720);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			/*ul_binding*/ ctx[30](ul);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[22], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*ariaLabel*/ 8192) {
    				attr_dev(ul, "aria-label", /*ariaLabel*/ ctx[13]);
    			}

    			if (!current || dirty[0] & /*direction*/ 32) {
    				attr_dev(ul, "data-floating-menu-direction", /*direction*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*menuOptionsClass*/ 256) {
    				attr_dev(ul, "class", /*menuOptionsClass*/ ctx[8]);
    			}

    			if (dirty[0] & /*menuOptionsClass*/ 256) {
    				toggle_class(ul, "bx--overflow-menu-options", true);
    			}

    			if (dirty[0] & /*menuOptionsClass, flipped*/ 384) {
    				toggle_class(ul, "bx--overflow-menu--flip", /*flipped*/ ctx[7]);
    			}

    			if (dirty[0] & /*menuOptionsClass, open*/ 257) {
    				toggle_class(ul, "bx--overflow-menu-options--open", /*open*/ ctx[0]);
    			}

    			if (dirty[0] & /*menuOptionsClass, light*/ 320) {
    				toggle_class(ul, "bx--overflow-menu-options--light", /*light*/ ctx[6]);
    			}

    			if (dirty[0] & /*menuOptionsClass, size*/ 272) {
    				toggle_class(ul, "bx--overflow-menu-options--sm", /*size*/ ctx[4] === 'sm');
    			}

    			if (dirty[0] & /*menuOptionsClass, size*/ 272) {
    				toggle_class(ul, "bx--overflow-menu-options--xl", /*size*/ ctx[4] === 'xl');
    			}

    			if (dirty[0] & /*menuOptionsClass, ctxBreadcrumbItem*/ 16640) {
    				toggle_class(ul, "bx--breadcrumb-menu-options", !!/*ctxBreadcrumbItem*/ ctx[14]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    			/*ul_binding*/ ctx[30](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(241:2) {#if open}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let html_tag;
    	let html_anchor;
    	let t0;
    	let button;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	const menu_slot_template = /*#slots*/ ctx[23].menu;
    	const menu_slot = create_slot(menu_slot_template, ctx, /*$$scope*/ ctx[22], get_menu_slot_context);
    	const menu_slot_or_fallback = menu_slot || fallback_block$5(ctx);
    	let if_block = /*open*/ ctx[0] && create_if_block$h(ctx);

    	let button_levels = [
    		{ type: "button" },
    		{ "aria-haspopup": "" },
    		{ "aria-expanded": /*open*/ ctx[0] },
    		{ "aria-label": /*ariaLabel*/ ctx[13] },
    		{ id: /*id*/ ctx[11] },
    		/*$$restProps*/ ctx[18]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			t0 = space();
    			button = element("button");
    			if (menu_slot_or_fallback) menu_slot_or_fallback.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			html_tag.a = html_anchor;
    			set_attributes(button, button_data);
    			toggle_class(button, "bx--overflow-menu", true);
    			toggle_class(button, "bx--overflow-menu--open", /*open*/ ctx[0]);
    			toggle_class(button, "bx--overflow-menu--light", /*light*/ ctx[6]);
    			toggle_class(button, "bx--overflow-menu--sm", /*size*/ ctx[4] === 'sm');
    			toggle_class(button, "bx--overflow-menu--xl", /*size*/ ctx[4] === 'xl');
    			add_location(button, file$t, 190, 0, 4535);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*styles*/ ctx[12], document.head);
    			append_dev(document.head, html_anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);

    			if (menu_slot_or_fallback) {
    				menu_slot_or_fallback.m(button, null);
    			}

    			append_dev(button, t1);
    			if (if_block) if_block.m(button, null);
    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[31](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "click", /*click_handler_1*/ ctx[29], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[24], false, false, false),
    					listen_dev(button, "click", /*click_handler_2*/ ctx[32], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover_handler*/ ctx[25], false, false, false),
    					listen_dev(button, "mouseenter", /*mouseenter_handler*/ ctx[26], false, false, false),
    					listen_dev(button, "mouseleave", /*mouseleave_handler*/ ctx[27], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[28], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler_1*/ ctx[33], false, false, false),
    					listen_dev(button, "focusout", /*focusout_handler*/ ctx[34], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*styles*/ 4096) html_tag.p(/*styles*/ ctx[12]);

    			if (menu_slot) {
    				if (menu_slot.p && (!current || dirty[0] & /*$$scope*/ 4194304)) {
    					update_slot_base(
    						menu_slot,
    						menu_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(menu_slot_template, /*$$scope*/ ctx[22], dirty, get_menu_slot_changes),
    						get_menu_slot_context
    					);
    				}
    			} else {
    				if (menu_slot_or_fallback && menu_slot_or_fallback.p && (!current || dirty[0] & /*icon, iconDescription, iconClass*/ 1538)) {
    					menu_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*open*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$h(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(button, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				{ "aria-haspopup": "" },
    				(!current || dirty[0] & /*open*/ 1) && { "aria-expanded": /*open*/ ctx[0] },
    				(!current || dirty[0] & /*ariaLabel*/ 8192) && { "aria-label": /*ariaLabel*/ ctx[13] },
    				(!current || dirty[0] & /*id*/ 2048) && { id: /*id*/ ctx[11] },
    				dirty[0] & /*$$restProps*/ 262144 && /*$$restProps*/ ctx[18]
    			]));

    			toggle_class(button, "bx--overflow-menu", true);
    			toggle_class(button, "bx--overflow-menu--open", /*open*/ ctx[0]);
    			toggle_class(button, "bx--overflow-menu--light", /*light*/ ctx[6]);
    			toggle_class(button, "bx--overflow-menu--sm", /*size*/ ctx[4] === 'sm');
    			toggle_class(button, "bx--overflow-menu--xl", /*size*/ ctx[4] === 'xl');
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu_slot_or_fallback, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu_slot_or_fallback, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			if (menu_slot_or_fallback) menu_slot_or_fallback.d(detaching);
    			if (if_block) if_block.d();
    			/*button_binding*/ ctx[31](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let styles;

    	const omit_props_names = [
    		"size","direction","open","light","flipped","menuOptionsClass","icon","iconClass","iconDescription","id","buttonRef","menuRef"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $currentIndex;
    	let $items;
    	let $currentId;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OverflowMenu', slots, ['menu','default']);
    	let { size = undefined } = $$props;
    	let { direction = "bottom" } = $$props;
    	let { open = false } = $$props;
    	let { light = false } = $$props;
    	let { flipped = false } = $$props;
    	let { menuOptionsClass = undefined } = $$props;
    	let { icon = OverflowMenuVertical$1 } = $$props;
    	let { iconClass = undefined } = $$props;
    	let { iconDescription = "Open and close list of options" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { buttonRef = null } = $$props;
    	let { menuRef = null } = $$props;
    	const ctxBreadcrumbItem = getContext("BreadcrumbItem");
    	const dispatch = createEventDispatcher();
    	const items = writable([]);
    	validate_store(items, 'items');
    	component_subscribe($$self, items, value => $$invalidate(21, $items = value));
    	const currentId = writable(undefined);
    	validate_store(currentId, 'currentId');
    	component_subscribe($$self, currentId, value => $$invalidate(36, $currentId = value));
    	const focusedId = writable(undefined);
    	const currentIndex = writable(-1);
    	validate_store(currentIndex, 'currentIndex');
    	component_subscribe($$self, currentIndex, value => $$invalidate(20, $currentIndex = value));
    	let buttonWidth = undefined;
    	let onMountAfterUpdate = true;

    	setContext("OverflowMenu", {
    		focusedId,
    		add: ({ id, text, primaryFocus, disabled }) => {
    			items.update(_ => {
    				if (primaryFocus) {
    					currentIndex.set(_.length);
    				}

    				return [
    					..._,
    					{
    						id,
    						text,
    						primaryFocus,
    						disabled,
    						index: _.length
    					}
    				];
    			});
    		},
    		update: id => {
    			currentId.set(id);
    		},
    		change: direction => {
    			let index = $currentIndex + direction;

    			if (index < 0) {
    				index = $items.length - 1;
    			} else if (index >= $items.length) {
    				index = 0;
    			}

    			let disabled = $items[index].disabled;

    			while (disabled) {
    				index = index + direction;

    				if (index < 0) {
    					index = $items.length - 1;
    				} else if (index >= $items.length) {
    					index = 0;
    				}

    				disabled = $items[index].disabled;
    			}

    			currentIndex.set(index);
    		}
    	});

    	afterUpdate(() => {
    		if ($currentId) {
    			const { index, text } = $items.filter(_ => _.id === $currentId)[0];
    			dispatch("close", { index, text });
    			$$invalidate(0, open = false);
    		}

    		if (open) {
    			const { width, height } = buttonRef.getBoundingClientRect();
    			$$invalidate(19, buttonWidth = width);

    			if (!onMountAfterUpdate && $currentIndex < 0) {
    				menuRef.focus();
    			}

    			if (flipped) {
    				$$invalidate(3, menuRef.style.left = "auto", menuRef);
    				$$invalidate(3, menuRef.style.right = 0, menuRef);
    			}

    			if (direction === "top") {
    				$$invalidate(3, menuRef.style.top = "auto", menuRef);
    				$$invalidate(3, menuRef.style.bottom = height + "px", menuRef);
    			} else if (direction === "bottom") {
    				$$invalidate(3, menuRef.style.top = height + "px", menuRef);
    			}

    			if (ctxBreadcrumbItem) {
    				$$invalidate(3, menuRef.style.top = height + 10 + "px", menuRef);
    				$$invalidate(3, menuRef.style.left = -11 + "px", menuRef);
    			}
    		}

    		if (!open) {
    			items.set([]);
    			currentId.set(undefined);
    			currentIndex.set(0);
    		}

    		onMountAfterUpdate = false;
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler_1 = ({ target }) => {
    		if (buttonRef && buttonRef.contains(target)) return;

    		if (menuRef && !menuRef.contains(target)) {
    			$$invalidate(0, open = false);
    		}
    	};

    	function ul_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			menuRef = $$value;
    			$$invalidate(3, menuRef);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			buttonRef = $$value;
    			$$invalidate(2, buttonRef);
    		});
    	}

    	const click_handler_2 = ({ target }) => {
    		if (!(menuRef && menuRef.contains(target))) {
    			$$invalidate(0, open = !open);
    		}
    	};

    	const keydown_handler_1 = e => {
    		if (open) {
    			if (['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(e.key)) {
    				e.preventDefault();
    			} else if (e.key === 'Escape') {
    				e.stopPropagation();
    				$$invalidate(0, open = false);
    				buttonRef.focus();
    			}
    		}
    	};

    	const focusout_handler = e => {
    		if (open) {
    			if (!buttonRef.contains(e.relatedTarget)) {
    				$$invalidate(0, open = false);
    			}
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(39, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(4, size = $$new_props.size);
    		if ('direction' in $$new_props) $$invalidate(5, direction = $$new_props.direction);
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('light' in $$new_props) $$invalidate(6, light = $$new_props.light);
    		if ('flipped' in $$new_props) $$invalidate(7, flipped = $$new_props.flipped);
    		if ('menuOptionsClass' in $$new_props) $$invalidate(8, menuOptionsClass = $$new_props.menuOptionsClass);
    		if ('icon' in $$new_props) $$invalidate(1, icon = $$new_props.icon);
    		if ('iconClass' in $$new_props) $$invalidate(9, iconClass = $$new_props.iconClass);
    		if ('iconDescription' in $$new_props) $$invalidate(10, iconDescription = $$new_props.iconDescription);
    		if ('id' in $$new_props) $$invalidate(11, id = $$new_props.id);
    		if ('buttonRef' in $$new_props) $$invalidate(2, buttonRef = $$new_props.buttonRef);
    		if ('menuRef' in $$new_props) $$invalidate(3, menuRef = $$new_props.menuRef);
    		if ('$$scope' in $$new_props) $$invalidate(22, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		direction,
    		open,
    		light,
    		flipped,
    		menuOptionsClass,
    		icon,
    		iconClass,
    		iconDescription,
    		id,
    		buttonRef,
    		menuRef,
    		createEventDispatcher,
    		getContext,
    		setContext,
    		afterUpdate,
    		writable,
    		OverflowMenuVertical: OverflowMenuVertical$1,
    		OverflowMenuHorizontal: OverflowMenuHorizontal$1,
    		ctxBreadcrumbItem,
    		dispatch,
    		items,
    		currentId,
    		focusedId,
    		currentIndex,
    		buttonWidth,
    		onMountAfterUpdate,
    		styles,
    		ariaLabel,
    		$currentIndex,
    		$items,
    		$currentId
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(39, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(4, size = $$new_props.size);
    		if ('direction' in $$props) $$invalidate(5, direction = $$new_props.direction);
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('light' in $$props) $$invalidate(6, light = $$new_props.light);
    		if ('flipped' in $$props) $$invalidate(7, flipped = $$new_props.flipped);
    		if ('menuOptionsClass' in $$props) $$invalidate(8, menuOptionsClass = $$new_props.menuOptionsClass);
    		if ('icon' in $$props) $$invalidate(1, icon = $$new_props.icon);
    		if ('iconClass' in $$props) $$invalidate(9, iconClass = $$new_props.iconClass);
    		if ('iconDescription' in $$props) $$invalidate(10, iconDescription = $$new_props.iconDescription);
    		if ('id' in $$props) $$invalidate(11, id = $$new_props.id);
    		if ('buttonRef' in $$props) $$invalidate(2, buttonRef = $$new_props.buttonRef);
    		if ('menuRef' in $$props) $$invalidate(3, menuRef = $$new_props.menuRef);
    		if ('buttonWidth' in $$props) $$invalidate(19, buttonWidth = $$new_props.buttonWidth);
    		if ('onMountAfterUpdate' in $$props) onMountAfterUpdate = $$new_props.onMountAfterUpdate;
    		if ('styles' in $$props) $$invalidate(12, styles = $$new_props.styles);
    		if ('ariaLabel' in $$props) $$invalidate(13, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(13, ariaLabel = $$props["aria-label"] || "menu");

    		if ($$self.$$.dirty[0] & /*$items, $currentIndex*/ 3145728) {
    			if ($items[$currentIndex]) {
    				focusedId.set($items[$currentIndex].id);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*id, buttonWidth*/ 526336) {
    			$$invalidate(12, styles = `<style>
    #${id} .bx--overflow-menu-options.bx--overflow-menu-options:after {
      width: ${buttonWidth ? buttonWidth + "px" : "2rem"};
    }
  <\/style>`);
    		}
    	};

    	if (ctxBreadcrumbItem) {
    		$$invalidate(1, icon = OverflowMenuHorizontal$1);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		open,
    		icon,
    		buttonRef,
    		menuRef,
    		size,
    		direction,
    		light,
    		flipped,
    		menuOptionsClass,
    		iconClass,
    		iconDescription,
    		id,
    		styles,
    		ariaLabel,
    		ctxBreadcrumbItem,
    		items,
    		currentId,
    		currentIndex,
    		$$restProps,
    		buttonWidth,
    		$currentIndex,
    		$items,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keydown_handler,
    		click_handler_1,
    		ul_binding,
    		button_binding,
    		click_handler_2,
    		keydown_handler_1,
    		focusout_handler
    	];
    }

    class OverflowMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$v,
    			create_fragment$v,
    			safe_not_equal,
    			{
    				size: 4,
    				direction: 5,
    				open: 0,
    				light: 6,
    				flipped: 7,
    				menuOptionsClass: 8,
    				icon: 1,
    				iconClass: 9,
    				iconDescription: 10,
    				id: 11,
    				buttonRef: 2,
    				menuRef: 3
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverflowMenu",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get size() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flipped() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flipped(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuOptionsClass() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuOptionsClass(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconClass() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconClass(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDescription() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDescription(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonRef() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonRef(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuRef() {
    		throw new Error("<OverflowMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuRef(value) {
    		throw new Error("<OverflowMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var OverflowMenu$1 = OverflowMenu;

    /* node_modules\carbon-components-svelte\src\OverflowMenu\OverflowMenuItem.svelte generated by Svelte v3.49.0 */
    const file$s = "node_modules\\carbon-components-svelte\\src\\OverflowMenu\\OverflowMenuItem.svelte";

    // (88:2) {:else}
    function create_else_block$7(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);
    	const default_slot_or_fallback = default_slot || fallback_block_1$1(ctx);
    	let button_levels = [/*buttonProps*/ ctx[7]];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$s, 88, 4, 2234);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[24](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler_1*/ ctx[19], false, false, false),
    					listen_dev(button, "click", /*click_handler_3*/ ctx[25], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler_1*/ ctx[20], false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler_3*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*text*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [dirty & /*buttonProps*/ 128 && /*buttonProps*/ ctx[7]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*button_binding*/ ctx[24](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(88:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (64:2) {#if href}
    function create_if_block$g(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);
    	const default_slot_or_fallback = default_slot || fallback_block$4(ctx);
    	let a_levels = [/*buttonProps*/ ctx[7]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(a, a_data);
    			add_location(a, file$s, 65, 4, 1766);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(a, null);
    			}

    			/*a_binding*/ ctx[21](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[17], false, false, false),
    					listen_dev(a, "click", /*click_handler_2*/ ctx[22], false, false, false),
    					listen_dev(a, "keydown", /*keydown_handler*/ ctx[18], false, false, false),
    					listen_dev(a, "keydown", /*keydown_handler_2*/ ctx[23], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*text*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [dirty & /*buttonProps*/ 128 && /*buttonProps*/ ctx[7]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*a_binding*/ ctx[21](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(64:2) {#if href}",
    		ctx
    	});

    	return block;
    }

    // (105:12)          
    function fallback_block_1$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*text*/ ctx[1]);
    			toggle_class(div, "bx--overflow-menu-options__option-content", true);
    			add_location(div, file$s, 105, 8, 2575);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1$1.name,
    		type: "fallback",
    		source: "(105:12)          ",
    		ctx
    	});

    	return block;
    }

    // (82:12)          
    function fallback_block$4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*text*/ ctx[1]);
    			toggle_class(div, "bx--overflow-menu-options__option-content", true);
    			add_location(div, file$s, 82, 8, 2102);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$4.name,
    		type: "fallback",
    		source: "(82:12)          ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let li;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$g, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let li_levels = [{ role: "none" }, { id: /*id*/ ctx[6] }, /*$$restProps*/ ctx[11]];
    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			set_attributes(li, li_data);
    			toggle_class(li, "bx--overflow-menu-options__option", true);
    			toggle_class(li, "bx--overflow-menu--divider", /*hasDivider*/ ctx[4]);
    			toggle_class(li, "bx--overflow-menu-options__option--danger", /*danger*/ ctx[5]);
    			toggle_class(li, "bx--overflow-menu-options__option--disabled", /*disabled*/ ctx[3]);
    			add_location(li, file$s, 54, 0, 1421);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_blocks[current_block_type_index].m(li, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(li, null);
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				{ role: "none" },
    				(!current || dirty & /*id*/ 64) && { id: /*id*/ ctx[6] },
    				dirty & /*$$restProps*/ 2048 && /*$$restProps*/ ctx[11]
    			]));

    			toggle_class(li, "bx--overflow-menu-options__option", true);
    			toggle_class(li, "bx--overflow-menu--divider", /*hasDivider*/ ctx[4]);
    			toggle_class(li, "bx--overflow-menu-options__option--danger", /*danger*/ ctx[5]);
    			toggle_class(li, "bx--overflow-menu-options__option--disabled", /*disabled*/ ctx[3]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let buttonProps;

    	const omit_props_names = [
    		"text","href","primaryFocus","disabled","hasDivider","danger","requireTitle","id","ref"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $focusedId;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OverflowMenuItem', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { text = "Provide text" } = $$props;
    	let { href = "" } = $$props;
    	let { primaryFocus = false } = $$props;
    	let { disabled = false } = $$props;
    	let { hasDivider = false } = $$props;
    	let { danger = false } = $$props;
    	let { requireTitle = true } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { ref = null } = $$props;
    	const { focusedId, add, update, change } = getContext("OverflowMenu");
    	validate_store(focusedId, 'focusedId');
    	component_subscribe($$self, focusedId, value => $$invalidate(14, $focusedId = value));
    	add({ id, text, primaryFocus, disabled });

    	afterUpdate(() => {
    		if (ref && primaryFocus) {
    			ref.focus();
    		}
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const click_handler_2 = () => {
    		update(id);
    	};

    	const keydown_handler_2 = ({ key }) => {
    		if (key === 'ArrowDown') {
    			change(1);
    		} else if (key === 'ArrowUp') {
    			change(-1);
    		}
    	};

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const click_handler_3 = () => {
    		update(id);
    	};

    	const keydown_handler_3 = ({ key }) => {
    		if (key === 'ArrowDown') {
    			change(1);
    		} else if (key === 'ArrowUp') {
    			change(-1);
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('text' in $$new_props) $$invalidate(1, text = $$new_props.text);
    		if ('href' in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ('primaryFocus' in $$new_props) $$invalidate(12, primaryFocus = $$new_props.primaryFocus);
    		if ('disabled' in $$new_props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('hasDivider' in $$new_props) $$invalidate(4, hasDivider = $$new_props.hasDivider);
    		if ('danger' in $$new_props) $$invalidate(5, danger = $$new_props.danger);
    		if ('requireTitle' in $$new_props) $$invalidate(13, requireTitle = $$new_props.requireTitle);
    		if ('id' in $$new_props) $$invalidate(6, id = $$new_props.id);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		text,
    		href,
    		primaryFocus,
    		disabled,
    		hasDivider,
    		danger,
    		requireTitle,
    		id,
    		ref,
    		getContext,
    		afterUpdate,
    		focusedId,
    		add,
    		update,
    		change,
    		buttonProps,
    		$focusedId
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('text' in $$props) $$invalidate(1, text = $$new_props.text);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    		if ('primaryFocus' in $$props) $$invalidate(12, primaryFocus = $$new_props.primaryFocus);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('hasDivider' in $$props) $$invalidate(4, hasDivider = $$new_props.hasDivider);
    		if ('danger' in $$props) $$invalidate(5, danger = $$new_props.danger);
    		if ('requireTitle' in $$props) $$invalidate(13, requireTitle = $$new_props.requireTitle);
    		if ('id' in $$props) $$invalidate(6, id = $$new_props.id);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('buttonProps' in $$props) $$invalidate(7, buttonProps = $$new_props.buttonProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$focusedId, id*/ 16448) {
    			$$invalidate(12, primaryFocus = $focusedId === id);
    		}

    		if ($$self.$$.dirty & /*href, disabled, requireTitle, text*/ 8206) {
    			$$invalidate(7, buttonProps = {
    				role: "menuitem",
    				tabindex: "-1",
    				class: "bx--overflow-menu-options__btn",
    				disabled: href ? undefined : disabled,
    				href: href ? href : undefined,
    				title: requireTitle
    				? $$slots.default ? undefined : text
    				: undefined
    			});
    		}
    	};

    	return [
    		ref,
    		text,
    		href,
    		disabled,
    		hasDivider,
    		danger,
    		id,
    		buttonProps,
    		focusedId,
    		update,
    		change,
    		$$restProps,
    		primaryFocus,
    		requireTitle,
    		$focusedId,
    		$$scope,
    		slots,
    		click_handler,
    		keydown_handler,
    		click_handler_1,
    		keydown_handler_1,
    		a_binding,
    		click_handler_2,
    		keydown_handler_2,
    		button_binding,
    		click_handler_3,
    		keydown_handler_3
    	];
    }

    class OverflowMenuItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			text: 1,
    			href: 2,
    			primaryFocus: 12,
    			disabled: 3,
    			hasDivider: 4,
    			danger: 5,
    			requireTitle: 13,
    			id: 6,
    			ref: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverflowMenuItem",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get text() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryFocus() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryFocus(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasDivider() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasDivider(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get danger() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set danger(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get requireTitle() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set requireTitle(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<OverflowMenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<OverflowMenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var OverflowMenuItem$1 = OverflowMenuItem;

    /* node_modules\carbon-components-svelte\src\Grid\Grid.svelte generated by Svelte v3.49.0 */

    const file$r = "node_modules\\carbon-components-svelte\\src\\Grid\\Grid.svelte";
    const get_default_slot_changes$3 = dirty => ({ props: dirty & /*props*/ 2 });
    const get_default_slot_context$3 = ctx => ({ props: /*props*/ ctx[1] });

    // (54:0) {:else}
    function create_else_block$6(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let div_levels = [/*props*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$r, 54, 2, 1398);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*props*/ 2 && /*props*/ ctx[1]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(54:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:0) {#if as}
    function create_if_block$f(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context$3);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, props*/ 514)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes$3),
    						get_default_slot_context$3
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(52:0) {#if as}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$f, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*as*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let props;

    	const omit_props_names = [
    		"as","condensed","narrow","fullWidth","noGutter","noGutterLeft","noGutterRight","padding"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, ['default']);
    	let { as = false } = $$props;
    	let { condensed = false } = $$props;
    	let { narrow = false } = $$props;
    	let { fullWidth = false } = $$props;
    	let { noGutter = false } = $$props;
    	let { noGutterLeft = false } = $$props;
    	let { noGutterRight = false } = $$props;
    	let { padding = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('as' in $$new_props) $$invalidate(0, as = $$new_props.as);
    		if ('condensed' in $$new_props) $$invalidate(2, condensed = $$new_props.condensed);
    		if ('narrow' in $$new_props) $$invalidate(3, narrow = $$new_props.narrow);
    		if ('fullWidth' in $$new_props) $$invalidate(4, fullWidth = $$new_props.fullWidth);
    		if ('noGutter' in $$new_props) $$invalidate(5, noGutter = $$new_props.noGutter);
    		if ('noGutterLeft' in $$new_props) $$invalidate(6, noGutterLeft = $$new_props.noGutterLeft);
    		if ('noGutterRight' in $$new_props) $$invalidate(7, noGutterRight = $$new_props.noGutterRight);
    		if ('padding' in $$new_props) $$invalidate(8, padding = $$new_props.padding);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		as,
    		condensed,
    		narrow,
    		fullWidth,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('as' in $$props) $$invalidate(0, as = $$new_props.as);
    		if ('condensed' in $$props) $$invalidate(2, condensed = $$new_props.condensed);
    		if ('narrow' in $$props) $$invalidate(3, narrow = $$new_props.narrow);
    		if ('fullWidth' in $$props) $$invalidate(4, fullWidth = $$new_props.fullWidth);
    		if ('noGutter' in $$props) $$invalidate(5, noGutter = $$new_props.noGutter);
    		if ('noGutterLeft' in $$props) $$invalidate(6, noGutterLeft = $$new_props.noGutterLeft);
    		if ('noGutterRight' in $$props) $$invalidate(7, noGutterRight = $$new_props.noGutterRight);
    		if ('padding' in $$props) $$invalidate(8, padding = $$new_props.padding);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(1, props = {
    			...$$restProps,
    			class: [
    				$$restProps.class,
    				"bx--grid",
    				condensed && "bx--grid--condensed",
    				narrow && "bx--grid--narrow",
    				fullWidth && "bx--grid--full-width",
    				noGutter && "bx--no-gutter",
    				noGutterLeft && "bx--no-gutter--left",
    				noGutterRight && "bx--no-gutter--right",
    				padding && "bx--row-padding"
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		as,
    		props,
    		condensed,
    		narrow,
    		fullWidth,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		$$scope,
    		slots
    	];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
    			as: 0,
    			condensed: 2,
    			narrow: 3,
    			fullWidth: 4,
    			noGutter: 5,
    			noGutterLeft: 6,
    			noGutterRight: 7,
    			padding: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get as() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get condensed() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set condensed(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get narrow() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set narrow(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fullWidth() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fullWidth(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutter() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutter(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterLeft() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterLeft(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterRight() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterRight(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Grid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Grid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Grid$1 = Grid;

    /* node_modules\carbon-components-svelte\src\Grid\Row.svelte generated by Svelte v3.49.0 */

    const file$q = "node_modules\\carbon-components-svelte\\src\\Grid\\Row.svelte";
    const get_default_slot_changes$2 = dirty => ({ props: dirty & /*props*/ 2 });
    const get_default_slot_context$2 = ctx => ({ props: /*props*/ ctx[1] });

    // (50:0) {:else}
    function create_else_block$5(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);
    	let div_levels = [/*props*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$q, 50, 2, 1267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*props*/ 2 && /*props*/ ctx[1]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(50:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (48:0) {#if as}
    function create_if_block$e(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context$2);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, props*/ 258)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes$2),
    						get_default_slot_context$2
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(48:0) {#if as}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$e, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*as*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let props;
    	const omit_props_names = ["as","condensed","narrow","noGutter","noGutterLeft","noGutterRight","padding"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Row', slots, ['default']);
    	let { as = false } = $$props;
    	let { condensed = false } = $$props;
    	let { narrow = false } = $$props;
    	let { noGutter = false } = $$props;
    	let { noGutterLeft = false } = $$props;
    	let { noGutterRight = false } = $$props;
    	let { padding = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('as' in $$new_props) $$invalidate(0, as = $$new_props.as);
    		if ('condensed' in $$new_props) $$invalidate(2, condensed = $$new_props.condensed);
    		if ('narrow' in $$new_props) $$invalidate(3, narrow = $$new_props.narrow);
    		if ('noGutter' in $$new_props) $$invalidate(4, noGutter = $$new_props.noGutter);
    		if ('noGutterLeft' in $$new_props) $$invalidate(5, noGutterLeft = $$new_props.noGutterLeft);
    		if ('noGutterRight' in $$new_props) $$invalidate(6, noGutterRight = $$new_props.noGutterRight);
    		if ('padding' in $$new_props) $$invalidate(7, padding = $$new_props.padding);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		as,
    		condensed,
    		narrow,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('as' in $$props) $$invalidate(0, as = $$new_props.as);
    		if ('condensed' in $$props) $$invalidate(2, condensed = $$new_props.condensed);
    		if ('narrow' in $$props) $$invalidate(3, narrow = $$new_props.narrow);
    		if ('noGutter' in $$props) $$invalidate(4, noGutter = $$new_props.noGutter);
    		if ('noGutterLeft' in $$props) $$invalidate(5, noGutterLeft = $$new_props.noGutterLeft);
    		if ('noGutterRight' in $$props) $$invalidate(6, noGutterRight = $$new_props.noGutterRight);
    		if ('padding' in $$props) $$invalidate(7, padding = $$new_props.padding);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(1, props = {
    			...$$restProps,
    			class: [
    				$$restProps.class,
    				"bx--row",
    				condensed && "bx--row--condensed",
    				narrow && "bx--row--narrow",
    				noGutter && "bx--no-gutter",
    				noGutterLeft && "bx--no-gutter--left",
    				noGutterRight && "bx--no-gutter--right",
    				padding && "bx--row-padding"
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		as,
    		props,
    		condensed,
    		narrow,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		$$scope,
    		slots
    	];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			as: 0,
    			condensed: 2,
    			narrow: 3,
    			noGutter: 4,
    			noGutterLeft: 5,
    			noGutterRight: 6,
    			padding: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get as() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get condensed() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set condensed(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get narrow() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set narrow(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutter() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutter(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterLeft() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterLeft(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterRight() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterRight(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Row$1 = Row;

    /* node_modules\carbon-components-svelte\src\Grid\Column.svelte generated by Svelte v3.49.0 */

    const file$p = "node_modules\\carbon-components-svelte\\src\\Grid\\Column.svelte";
    const get_default_slot_changes$1 = dirty => ({ props: dirty & /*props*/ 2 });
    const get_default_slot_context$1 = ctx => ({ props: /*props*/ ctx[1] });

    // (115:0) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	let div_levels = [/*props*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$p, 115, 2, 2896);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*props*/ 2 && /*props*/ ctx[1]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(115:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (113:0) {#if as}
    function create_if_block$d(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, props*/ 8194)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(113:0) {#if as}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$d, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*as*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let columnClass;
    	let props;

    	const omit_props_names = [
    		"as","noGutter","noGutterLeft","noGutterRight","padding","aspectRatio","sm","md","lg","xlg","max"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Column', slots, ['default']);
    	let { as = false } = $$props;
    	let { noGutter = false } = $$props;
    	let { noGutterLeft = false } = $$props;
    	let { noGutterRight = false } = $$props;
    	let { padding = false } = $$props;
    	let { aspectRatio = undefined } = $$props;
    	let { sm = undefined } = $$props;
    	let { md = undefined } = $$props;
    	let { lg = undefined } = $$props;
    	let { xlg = undefined } = $$props;
    	let { max = undefined } = $$props;
    	const breakpoints = ["sm", "md", "lg", "xlg", "max"];

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('as' in $$new_props) $$invalidate(0, as = $$new_props.as);
    		if ('noGutter' in $$new_props) $$invalidate(2, noGutter = $$new_props.noGutter);
    		if ('noGutterLeft' in $$new_props) $$invalidate(3, noGutterLeft = $$new_props.noGutterLeft);
    		if ('noGutterRight' in $$new_props) $$invalidate(4, noGutterRight = $$new_props.noGutterRight);
    		if ('padding' in $$new_props) $$invalidate(5, padding = $$new_props.padding);
    		if ('aspectRatio' in $$new_props) $$invalidate(6, aspectRatio = $$new_props.aspectRatio);
    		if ('sm' in $$new_props) $$invalidate(7, sm = $$new_props.sm);
    		if ('md' in $$new_props) $$invalidate(8, md = $$new_props.md);
    		if ('lg' in $$new_props) $$invalidate(9, lg = $$new_props.lg);
    		if ('xlg' in $$new_props) $$invalidate(10, xlg = $$new_props.xlg);
    		if ('max' in $$new_props) $$invalidate(11, max = $$new_props.max);
    		if ('$$scope' in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		as,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		aspectRatio,
    		sm,
    		md,
    		lg,
    		xlg,
    		max,
    		breakpoints,
    		columnClass,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('as' in $$props) $$invalidate(0, as = $$new_props.as);
    		if ('noGutter' in $$props) $$invalidate(2, noGutter = $$new_props.noGutter);
    		if ('noGutterLeft' in $$props) $$invalidate(3, noGutterLeft = $$new_props.noGutterLeft);
    		if ('noGutterRight' in $$props) $$invalidate(4, noGutterRight = $$new_props.noGutterRight);
    		if ('padding' in $$props) $$invalidate(5, padding = $$new_props.padding);
    		if ('aspectRatio' in $$props) $$invalidate(6, aspectRatio = $$new_props.aspectRatio);
    		if ('sm' in $$props) $$invalidate(7, sm = $$new_props.sm);
    		if ('md' in $$props) $$invalidate(8, md = $$new_props.md);
    		if ('lg' in $$props) $$invalidate(9, lg = $$new_props.lg);
    		if ('xlg' in $$props) $$invalidate(10, xlg = $$new_props.xlg);
    		if ('max' in $$props) $$invalidate(11, max = $$new_props.max);
    		if ('columnClass' in $$props) $$invalidate(12, columnClass = $$new_props.columnClass);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*sm, md, lg, xlg, max*/ 3968) {
    			$$invalidate(12, columnClass = [sm, md, lg, xlg, max].map((breakpoint, i) => {
    				const name = breakpoints[i];

    				if (breakpoint === true) {
    					return `bx--col-${name}`;
    				} else if (typeof breakpoint === "number") {
    					return `bx--col-${name}-${breakpoint}`;
    				} else if (typeof breakpoint === "object") {
    					let bp = [];

    					if (typeof breakpoint.span === "number") {
    						bp = [...bp, `bx--col-${name}-${breakpoint.span}`];
    					} else if (breakpoint.span === true) {
    						bp = [...bp, `bx--col-${name}`];
    					}

    					if (typeof breakpoint.offset === "number") {
    						bp = [...bp, `bx--offset-${name}-${breakpoint.offset}`];
    					}

    					return bp.join(" ");
    				}
    			}).filter(Boolean).join(" "));
    		}

    		$$invalidate(1, props = {
    			...$$restProps,
    			class: [
    				$$restProps.class,
    				columnClass,
    				!columnClass && "bx--col",
    				noGutter && "bx--no-gutter",
    				noGutterLeft && "bx--no-gutter--left",
    				noGutterRight && "bx--no-gutter--right",
    				aspectRatio && `bx--aspect-ratio bx--aspect-ratio--${aspectRatio}`,
    				padding && "bx--col-padding"
    			].filter(Boolean).join(" ")
    		});
    	};

    	return [
    		as,
    		props,
    		noGutter,
    		noGutterLeft,
    		noGutterRight,
    		padding,
    		aspectRatio,
    		sm,
    		md,
    		lg,
    		xlg,
    		max,
    		columnClass,
    		$$scope,
    		slots
    	];
    }

    class Column extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			as: 0,
    			noGutter: 2,
    			noGutterLeft: 3,
    			noGutterRight: 4,
    			padding: 5,
    			aspectRatio: 6,
    			sm: 7,
    			md: 8,
    			lg: 9,
    			xlg: 10,
    			max: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Column",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get as() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set as(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutter() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutter(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterLeft() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterLeft(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noGutterRight() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noGutterRight(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get aspectRatio() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set aspectRatio(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get md() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set md(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xlg() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xlg(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Column$1 = Column;

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* node_modules\carbon-components-svelte\src\icons\EditOff.svelte generated by Svelte v3.49.0 */

    const file$o = "node_modules\\carbon-components-svelte\\src\\icons\\EditOff.svelte";

    // (24:2) {#if title}
    function create_if_block$c(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$o, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$c(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M30 28.6L3.4 2 2 3.4l10.1 10.1L4 21.6V28h6.4l8.1-8.1L28.6 30 30 28.6zM9.6 26H6v-3.6l7.5-7.5 3.6 3.6L9.6 26zM29.4 6.2L29.4 6.2l-3.6-3.6c-.8-.8-2-.8-2.8 0l0 0 0 0-8 8 1.4 1.4L20 8.4l3.6 3.6L20 15.6l1.4 1.4 8-8C30.2 8.2 30.2 7 29.4 6.2L29.4 6.2zM25 10.6L21.4 7l3-3L28 7.6 25 10.6z");
    			add_location(path, file$o, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$o, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$c(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditOff', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class EditOff extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditOff",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get size() {
    		throw new Error("<EditOff>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<EditOff>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<EditOff>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<EditOff>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var EditOff$1 = EditOff;

    /* node_modules\carbon-components-svelte\src\icons\CaretLeft.svelte generated by Svelte v3.49.0 */

    const file$n = "node_modules\\carbon-components-svelte\\src\\icons\\CaretLeft.svelte";

    // (24:2) {#if title}
    function create_if_block$b(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$n, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$b(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M20 24L10 16 20 8z");
    			add_location(path, file$n, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$n, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CaretLeft', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class CaretLeft extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CaretLeft",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get size() {
    		throw new Error("<CaretLeft>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<CaretLeft>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<CaretLeft>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<CaretLeft>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var CaretLeft$1 = CaretLeft;

    /* node_modules\carbon-components-svelte\src\Select\Select.svelte generated by Svelte v3.49.0 */
    const file$m = "node_modules\\carbon-components-svelte\\src\\Select\\Select.svelte";
    const get_labelText_slot_changes$1 = dirty => ({});
    const get_labelText_slot_context$1 = ctx => ({});

    // (95:4) {#if !noLabel}
    function create_if_block_10$1(ctx) {
    	let label;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[21].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[20], get_labelText_slot_context$1);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block$3(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			attr_dev(label, "for", /*id*/ ctx[5]);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[14]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[4]);
    			add_location(label, file$m, 95, 6, 2414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty[0] & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[20], dirty, get_labelText_slot_changes$1),
    						get_labelText_slot_context$1
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty[0] & /*labelText*/ 8192)) {
    					labelText_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 32) {
    				attr_dev(label, "for", /*id*/ ctx[5]);
    			}

    			if (dirty[0] & /*hideLabel*/ 16384) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[14]);
    			}

    			if (dirty[0] & /*disabled*/ 16) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(95:4) {#if !noLabel}",
    		ctx
    	});

    	return block;
    }

    // (102:31)            
    function fallback_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[13]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 8192) set_data_dev(t, /*labelText*/ ctx[13]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$3.name,
    		type: "fallback",
    		source: "(102:31)            ",
    		ctx
    	});

    	return block;
    }

    // (107:4) {#if inline}
    function create_if_block_6$1(ctx) {
    	let div1;
    	let div0;
    	let select;
    	let select_aria_describedby_value;
    	let select_aria_invalid_value;
    	let select_disabled_value;
    	let select_required_value;
    	let t0;
    	let chevrondown;
    	let t1;
    	let div0_data_invalid_value;
    	let t2;
    	let t3;
    	let if_block2_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);

    	chevrondown = new ChevronDown$1({
    			props: { class: "bx--select__arrow" },
    			$$inline: true
    		});

    	let if_block0 = /*invalid*/ ctx[7] && create_if_block_9$1(ctx);
    	let if_block1 = /*invalid*/ ctx[7] && create_if_block_8$1(ctx);
    	let if_block2 = /*helperText*/ ctx[11] && create_if_block_7$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			select = element("select");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			create_component(chevrondown.$$.fragment);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			attr_dev(select, "aria-describedby", select_aria_describedby_value = /*invalid*/ ctx[7] ? /*errorId*/ ctx[16] : undefined);
    			attr_dev(select, "aria-invalid", select_aria_invalid_value = /*invalid*/ ctx[7] || undefined);
    			select.disabled = select_disabled_value = /*disabled*/ ctx[4] || undefined;
    			select.required = select_required_value = /*required*/ ctx[15] || undefined;
    			attr_dev(select, "id", /*id*/ ctx[5]);
    			attr_dev(select, "name", /*name*/ ctx[6]);
    			toggle_class(select, "bx--select-input", true);
    			toggle_class(select, "bx--select-input--sm", /*size*/ ctx[1] === 'sm');
    			toggle_class(select, "bx--select-input--xl", /*size*/ ctx[1] === 'xl');
    			add_location(select, file$m, 112, 10, 2881);
    			attr_dev(div0, "data-invalid", div0_data_invalid_value = /*invalid*/ ctx[7] || undefined);
    			toggle_class(div0, "bx--select-input__wrapper", true);
    			add_location(div0, file$m, 108, 8, 2757);
    			toggle_class(div1, "bx--select-input--inline__wrapper", true);
    			add_location(div1, file$m, 107, 6, 2694);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, select);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			/*select_binding*/ ctx[28](select);
    			append_dev(div0, t0);
    			mount_component(chevrondown, div0, null);
    			append_dev(div0, t1);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div1, t2);
    			if (if_block1) if_block1.m(div1, null);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*change_handler*/ ctx[29], false, false, false),
    					listen_dev(select, "input", /*input_handler*/ ctx[25], false, false, false),
    					listen_dev(select, "focus", /*focus_handler*/ ctx[26], false, false, false),
    					listen_dev(select, "blur", /*blur_handler*/ ctx[27], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*invalid, errorId*/ 65664 && select_aria_describedby_value !== (select_aria_describedby_value = /*invalid*/ ctx[7] ? /*errorId*/ ctx[16] : undefined)) {
    				attr_dev(select, "aria-describedby", select_aria_describedby_value);
    			}

    			if (!current || dirty[0] & /*invalid*/ 128 && select_aria_invalid_value !== (select_aria_invalid_value = /*invalid*/ ctx[7] || undefined)) {
    				attr_dev(select, "aria-invalid", select_aria_invalid_value);
    			}

    			if (!current || dirty[0] & /*disabled*/ 16 && select_disabled_value !== (select_disabled_value = /*disabled*/ ctx[4] || undefined)) {
    				prop_dev(select, "disabled", select_disabled_value);
    			}

    			if (!current || dirty[0] & /*required*/ 32768 && select_required_value !== (select_required_value = /*required*/ ctx[15] || undefined)) {
    				prop_dev(select, "required", select_required_value);
    			}

    			if (!current || dirty[0] & /*id*/ 32) {
    				attr_dev(select, "id", /*id*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*name*/ 64) {
    				attr_dev(select, "name", /*name*/ ctx[6]);
    			}

    			if (dirty[0] & /*size*/ 2) {
    				toggle_class(select, "bx--select-input--sm", /*size*/ ctx[1] === 'sm');
    			}

    			if (dirty[0] & /*size*/ 2) {
    				toggle_class(select, "bx--select-input--xl", /*size*/ ctx[1] === 'xl');
    			}

    			if (/*invalid*/ ctx[7]) {
    				if (if_block0) {
    					if (dirty[0] & /*invalid*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_9$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*invalid*/ 128 && div0_data_invalid_value !== (div0_data_invalid_value = /*invalid*/ ctx[7] || undefined)) {
    				attr_dev(div0, "data-invalid", div0_data_invalid_value);
    			}

    			if (/*invalid*/ ctx[7]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_8$1(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*helperText*/ ctx[11]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_7$1(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(chevrondown.$$.fragment, local);
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(chevrondown.$$.fragment, local);
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*select_binding*/ ctx[28](null);
    			destroy_component(chevrondown);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(107:4) {#if inline}",
    		ctx
    	});

    	return block;
    }

    // (134:10) {#if invalid}
    function create_if_block_9$1(ctx) {
    	let warningfilled;
    	let current;

    	warningfilled = new WarningFilled$1({
    			props: { class: "bx--select__invalid-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(134:10) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (138:8) {#if invalid}
    function create_if_block_8$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[8]);
    			attr_dev(div, "id", /*errorId*/ ctx[16]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$m, 138, 10, 3754);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 256) set_data_dev(t, /*invalidText*/ ctx[8]);

    			if (dirty[0] & /*errorId*/ 65536) {
    				attr_dev(div, "id", /*errorId*/ ctx[16]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(138:8) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (144:6) {#if helperText}
    function create_if_block_7$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[11]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[4]);
    			add_location(div, file$m, 144, 8, 3912);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 2048) set_data_dev(t, /*helperText*/ ctx[11]);

    			if (dirty[0] & /*disabled*/ 16) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(144:6) {#if helperText}",
    		ctx
    	});

    	return block;
    }

    // (153:4) {#if !inline}
    function create_if_block$a(ctx) {
    	let div;
    	let select;
    	let select_aria_describedby_value;
    	let select_disabled_value;
    	let select_required_value;
    	let select_aria_invalid_value;
    	let t0;
    	let chevrondown;
    	let t1;
    	let t2;
    	let div_data_invalid_value;
    	let t3;
    	let t4;
    	let t5;
    	let if_block4_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[20], null);

    	chevrondown = new ChevronDown$1({
    			props: { class: "bx--select__arrow" },
    			$$inline: true
    		});

    	let if_block0 = /*invalid*/ ctx[7] && create_if_block_5$1(ctx);
    	let if_block1 = !/*invalid*/ ctx[7] && /*warn*/ ctx[9] && create_if_block_4$1(ctx);
    	let if_block2 = !/*invalid*/ ctx[7] && /*helperText*/ ctx[11] && create_if_block_3$2(ctx);
    	let if_block3 = /*invalid*/ ctx[7] && create_if_block_2$3(ctx);
    	let if_block4 = !/*invalid*/ ctx[7] && /*warn*/ ctx[9] && create_if_block_1$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			select = element("select");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			create_component(chevrondown.$$.fragment);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			if (if_block3) if_block3.c();
    			t5 = space();
    			if (if_block4) if_block4.c();
    			if_block4_anchor = empty();
    			attr_dev(select, "id", /*id*/ ctx[5]);
    			attr_dev(select, "name", /*name*/ ctx[6]);
    			attr_dev(select, "aria-describedby", select_aria_describedby_value = /*invalid*/ ctx[7] ? /*errorId*/ ctx[16] : undefined);
    			select.disabled = select_disabled_value = /*disabled*/ ctx[4] || undefined;
    			select.required = select_required_value = /*required*/ ctx[15] || undefined;
    			attr_dev(select, "aria-invalid", select_aria_invalid_value = /*invalid*/ ctx[7] || undefined);
    			toggle_class(select, "bx--select-input", true);
    			toggle_class(select, "bx--select-input--sm", /*size*/ ctx[1] === 'sm');
    			toggle_class(select, "bx--select-input--xl", /*size*/ ctx[1] === 'xl');
    			add_location(select, file$m, 157, 8, 4235);
    			attr_dev(div, "data-invalid", div_data_invalid_value = /*invalid*/ ctx[7] || undefined);
    			toggle_class(div, "bx--select-input__wrapper", true);
    			add_location(div, file$m, 153, 6, 4119);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, select);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			/*select_binding_1*/ ctx[30](select);
    			append_dev(div, t0);
    			mount_component(chevrondown, div, null);
    			append_dev(div, t1);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t2);
    			if (if_block1) if_block1.m(div, null);
    			insert_dev(target, t3, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t5, anchor);
    			if (if_block4) if_block4.m(target, anchor);
    			insert_dev(target, if_block4_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*change_handler_1*/ ctx[31], false, false, false),
    					listen_dev(select, "input", /*input_handler_1*/ ctx[22], false, false, false),
    					listen_dev(select, "focus", /*focus_handler_1*/ ctx[23], false, false, false),
    					listen_dev(select, "blur", /*blur_handler_1*/ ctx[24], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[20],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[20])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[20], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 32) {
    				attr_dev(select, "id", /*id*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*name*/ 64) {
    				attr_dev(select, "name", /*name*/ ctx[6]);
    			}

    			if (!current || dirty[0] & /*invalid, errorId*/ 65664 && select_aria_describedby_value !== (select_aria_describedby_value = /*invalid*/ ctx[7] ? /*errorId*/ ctx[16] : undefined)) {
    				attr_dev(select, "aria-describedby", select_aria_describedby_value);
    			}

    			if (!current || dirty[0] & /*disabled*/ 16 && select_disabled_value !== (select_disabled_value = /*disabled*/ ctx[4] || undefined)) {
    				prop_dev(select, "disabled", select_disabled_value);
    			}

    			if (!current || dirty[0] & /*required*/ 32768 && select_required_value !== (select_required_value = /*required*/ ctx[15] || undefined)) {
    				prop_dev(select, "required", select_required_value);
    			}

    			if (!current || dirty[0] & /*invalid*/ 128 && select_aria_invalid_value !== (select_aria_invalid_value = /*invalid*/ ctx[7] || undefined)) {
    				attr_dev(select, "aria-invalid", select_aria_invalid_value);
    			}

    			if (dirty[0] & /*size*/ 2) {
    				toggle_class(select, "bx--select-input--sm", /*size*/ ctx[1] === 'sm');
    			}

    			if (dirty[0] & /*size*/ 2) {
    				toggle_class(select, "bx--select-input--xl", /*size*/ ctx[1] === 'xl');
    			}

    			if (/*invalid*/ ctx[7]) {
    				if (if_block0) {
    					if (dirty[0] & /*invalid*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t2);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*invalid*/ ctx[7] && /*warn*/ ctx[9]) {
    				if (if_block1) {
    					if (dirty[0] & /*invalid, warn*/ 640) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_4$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*invalid*/ 128 && div_data_invalid_value !== (div_data_invalid_value = /*invalid*/ ctx[7] || undefined)) {
    				attr_dev(div, "data-invalid", div_data_invalid_value);
    			}

    			if (!/*invalid*/ ctx[7] && /*helperText*/ ctx[11]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3$2(ctx);
    					if_block2.c();
    					if_block2.m(t4.parentNode, t4);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*invalid*/ ctx[7]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_2$3(ctx);
    					if_block3.c();
    					if_block3.m(t5.parentNode, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (!/*invalid*/ ctx[7] && /*warn*/ ctx[9]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_1$6(ctx);
    					if_block4.c();
    					if_block4.m(if_block4_anchor.parentNode, if_block4_anchor);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(chevrondown.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(chevrondown.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*select_binding_1*/ ctx[30](null);
    			destroy_component(chevrondown);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (detaching) detach_dev(t3);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t5);
    			if (if_block4) if_block4.d(detaching);
    			if (detaching) detach_dev(if_block4_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(153:4) {#if !inline}",
    		ctx
    	});

    	return block;
    }

    // (179:8) {#if invalid}
    function create_if_block_5$1(ctx) {
    	let warningfilled;
    	let current;

    	warningfilled = new WarningFilled$1({
    			props: { class: "bx--select__invalid-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(179:8) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (182:8) {#if !invalid && warn}
    function create_if_block_4$1(ctx) {
    	let warningaltfilled;
    	let current;

    	warningaltfilled = new WarningAltFilled$1({
    			props: {
    				class: "bx--select__invalid-icon bx--select__invalid-icon--warning"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningaltfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningaltfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningaltfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningaltfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningaltfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(182:8) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    // (188:6) {#if !invalid && helperText}
    function create_if_block_3$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[11]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[4]);
    			add_location(div, file$m, 188, 8, 5236);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 2048) set_data_dev(t, /*helperText*/ ctx[11]);

    			if (dirty[0] & /*disabled*/ 16) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(188:6) {#if !invalid && helperText}",
    		ctx
    	});

    	return block;
    }

    // (196:6) {#if invalid}
    function create_if_block_2$3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[8]);
    			attr_dev(div, "id", /*errorId*/ ctx[16]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$m, 196, 8, 5437);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 256) set_data_dev(t, /*invalidText*/ ctx[8]);

    			if (dirty[0] & /*errorId*/ 65536) {
    				attr_dev(div, "id", /*errorId*/ ctx[16]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(196:6) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (201:6) {#if !invalid && warn}
    function create_if_block_1$6(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[10]);
    			attr_dev(div, "id", /*errorId*/ ctx[16]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$m, 201, 8, 5582);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*warnText*/ 1024) set_data_dev(t, /*warnText*/ ctx[10]);

    			if (dirty[0] & /*errorId*/ 65536) {
    				attr_dev(div, "id", /*errorId*/ ctx[16]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(201:6) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let current;
    	let if_block0 = !/*noLabel*/ ctx[12] && create_if_block_10$1(ctx);
    	let if_block1 = /*inline*/ ctx[2] && create_if_block_6$1(ctx);
    	let if_block2 = !/*inline*/ ctx[2] && create_if_block$a(ctx);
    	let div1_levels = [/*$$restProps*/ ctx[18]];
    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			toggle_class(div0, "bx--select", true);
    			toggle_class(div0, "bx--select--inline", /*inline*/ ctx[2]);
    			toggle_class(div0, "bx--select--light", /*light*/ ctx[3]);
    			toggle_class(div0, "bx--select--invalid", /*invalid*/ ctx[7]);
    			toggle_class(div0, "bx--select--disabled", /*disabled*/ ctx[4]);
    			toggle_class(div0, "bx--select--warning", /*warn*/ ctx[9]);
    			add_location(div0, file$m, 86, 2, 2147);
    			set_attributes(div1, div1_data);
    			toggle_class(div1, "bx--form-item", true);
    			add_location(div1, file$m, 85, 0, 2093);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t1);
    			if (if_block2) if_block2.m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*noLabel*/ ctx[12]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*noLabel*/ 4096) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_10$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*inline*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*inline*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_6$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div0, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!/*inline*/ ctx[2]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*inline*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$a(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div0, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*inline*/ 4) {
    				toggle_class(div0, "bx--select--inline", /*inline*/ ctx[2]);
    			}

    			if (dirty[0] & /*light*/ 8) {
    				toggle_class(div0, "bx--select--light", /*light*/ ctx[3]);
    			}

    			if (dirty[0] & /*invalid*/ 128) {
    				toggle_class(div0, "bx--select--invalid", /*invalid*/ ctx[7]);
    			}

    			if (dirty[0] & /*disabled*/ 16) {
    				toggle_class(div0, "bx--select--disabled", /*disabled*/ ctx[4]);
    			}

    			if (dirty[0] & /*warn*/ 512) {
    				toggle_class(div0, "bx--select--warning", /*warn*/ ctx[9]);
    			}

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [dirty[0] & /*$$restProps*/ 262144 && /*$$restProps*/ ctx[18]]));
    			toggle_class(div1, "bx--form-item", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let errorId;

    	const omit_props_names = [
    		"selected","size","inline","light","disabled","id","name","invalid","invalidText","warn","warnText","helperText","noLabel","labelText","hideLabel","ref","required"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $selectedValue;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Select', slots, ['labelText','default']);
    	let { selected = undefined } = $$props;
    	let { size = undefined } = $$props;
    	let { inline = false } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;
    	let { helperText = "" } = $$props;
    	let { noLabel = false } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { ref = null } = $$props;
    	let { required = false } = $$props;
    	const dispatch = createEventDispatcher();
    	const selectedValue = writable(selected);
    	validate_store(selectedValue, 'selectedValue');
    	component_subscribe($$self, selectedValue, value => $$invalidate(32, $selectedValue = value));
    	setContext("Select", { selectedValue });

    	afterUpdate(() => {
    		$$invalidate(19, selected = $selectedValue);
    		dispatch("change", $selectedValue);
    	});

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function select_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const change_handler = ({ target }) => {
    		selectedValue.set(target.value);
    	};

    	function select_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const change_handler_1 = ({ target }) => {
    		selectedValue.set(target.value);
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('selected' in $$new_props) $$invalidate(19, selected = $$new_props.selected);
    		if ('size' in $$new_props) $$invalidate(1, size = $$new_props.size);
    		if ('inline' in $$new_props) $$invalidate(2, inline = $$new_props.inline);
    		if ('light' in $$new_props) $$invalidate(3, light = $$new_props.light);
    		if ('disabled' in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('id' in $$new_props) $$invalidate(5, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(6, name = $$new_props.name);
    		if ('invalid' in $$new_props) $$invalidate(7, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(8, invalidText = $$new_props.invalidText);
    		if ('warn' in $$new_props) $$invalidate(9, warn = $$new_props.warn);
    		if ('warnText' in $$new_props) $$invalidate(10, warnText = $$new_props.warnText);
    		if ('helperText' in $$new_props) $$invalidate(11, helperText = $$new_props.helperText);
    		if ('noLabel' in $$new_props) $$invalidate(12, noLabel = $$new_props.noLabel);
    		if ('labelText' in $$new_props) $$invalidate(13, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$new_props) $$invalidate(14, hideLabel = $$new_props.hideLabel);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    		if ('required' in $$new_props) $$invalidate(15, required = $$new_props.required);
    		if ('$$scope' in $$new_props) $$invalidate(20, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		selected,
    		size,
    		inline,
    		light,
    		disabled,
    		id,
    		name,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		helperText,
    		noLabel,
    		labelText,
    		hideLabel,
    		ref,
    		required,
    		createEventDispatcher,
    		setContext,
    		afterUpdate,
    		writable,
    		ChevronDown: ChevronDown$1,
    		WarningFilled: WarningFilled$1,
    		WarningAltFilled: WarningAltFilled$1,
    		dispatch,
    		selectedValue,
    		errorId,
    		$selectedValue
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('selected' in $$props) $$invalidate(19, selected = $$new_props.selected);
    		if ('size' in $$props) $$invalidate(1, size = $$new_props.size);
    		if ('inline' in $$props) $$invalidate(2, inline = $$new_props.inline);
    		if ('light' in $$props) $$invalidate(3, light = $$new_props.light);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('id' in $$props) $$invalidate(5, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(6, name = $$new_props.name);
    		if ('invalid' in $$props) $$invalidate(7, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(8, invalidText = $$new_props.invalidText);
    		if ('warn' in $$props) $$invalidate(9, warn = $$new_props.warn);
    		if ('warnText' in $$props) $$invalidate(10, warnText = $$new_props.warnText);
    		if ('helperText' in $$props) $$invalidate(11, helperText = $$new_props.helperText);
    		if ('noLabel' in $$props) $$invalidate(12, noLabel = $$new_props.noLabel);
    		if ('labelText' in $$props) $$invalidate(13, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$props) $$invalidate(14, hideLabel = $$new_props.hideLabel);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('required' in $$props) $$invalidate(15, required = $$new_props.required);
    		if ('errorId' in $$props) $$invalidate(16, errorId = $$new_props.errorId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*id*/ 32) {
    			$$invalidate(16, errorId = `error-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*selected*/ 524288) {
    			selectedValue.set(selected);
    		}
    	};

    	return [
    		ref,
    		size,
    		inline,
    		light,
    		disabled,
    		id,
    		name,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		helperText,
    		noLabel,
    		labelText,
    		hideLabel,
    		required,
    		errorId,
    		selectedValue,
    		$$restProps,
    		selected,
    		$$scope,
    		slots,
    		input_handler_1,
    		focus_handler_1,
    		blur_handler_1,
    		input_handler,
    		focus_handler,
    		blur_handler,
    		select_binding,
    		change_handler,
    		select_binding_1,
    		change_handler_1
    	];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$o,
    			create_fragment$o,
    			safe_not_equal,
    			{
    				selected: 19,
    				size: 1,
    				inline: 2,
    				light: 3,
    				disabled: 4,
    				id: 5,
    				name: 6,
    				invalid: 7,
    				invalidText: 8,
    				warn: 9,
    				warnText: 10,
    				helperText: 11,
    				noLabel: 12,
    				labelText: 13,
    				hideLabel: 14,
    				ref: 0,
    				required: 15
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get selected() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Select$1 = Select;

    /* node_modules\carbon-components-svelte\src\Select\SelectItem.svelte generated by Svelte v3.49.0 */
    const file$l = "node_modules\\carbon-components-svelte\\src\\Select\\SelectItem.svelte";

    function create_fragment$n(ctx) {
    	let option;
    	let t_value = (/*text*/ ctx[1] || /*value*/ ctx[0]) + "";
    	let t;
    	let option_class_value;
    	let option_style_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = /*value*/ ctx[0];
    			option.value = option.__value;
    			option.disabled = /*disabled*/ ctx[3];
    			option.hidden = /*hidden*/ ctx[2];
    			option.selected = /*selected*/ ctx[4];
    			attr_dev(option, "class", option_class_value = /*$$restProps*/ ctx[5].class);
    			attr_dev(option, "style", option_style_value = /*$$restProps*/ ctx[5].style);
    			toggle_class(option, "bx--select-option", true);
    			add_location(option, file$l, 28, 0, 604);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text, value*/ 3 && t_value !== (t_value = (/*text*/ ctx[1] || /*value*/ ctx[0]) + "")) set_data_dev(t, t_value);

    			if (dirty & /*value*/ 1) {
    				prop_dev(option, "__value", /*value*/ ctx[0]);
    				option.value = option.__value;
    			}

    			if (dirty & /*disabled*/ 8) {
    				prop_dev(option, "disabled", /*disabled*/ ctx[3]);
    			}

    			if (dirty & /*hidden*/ 4) {
    				prop_dev(option, "hidden", /*hidden*/ ctx[2]);
    			}

    			if (dirty & /*selected*/ 16) {
    				prop_dev(option, "selected", /*selected*/ ctx[4]);
    			}

    			if (dirty & /*$$restProps*/ 32 && option_class_value !== (option_class_value = /*$$restProps*/ ctx[5].class)) {
    				attr_dev(option, "class", option_class_value);
    			}

    			if (dirty & /*$$restProps*/ 32 && option_style_value !== (option_style_value = /*$$restProps*/ ctx[5].style)) {
    				attr_dev(option, "style", option_style_value);
    			}

    			if (dirty & /*$$restProps*/ 32) {
    				toggle_class(option, "bx--select-option", true);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	const omit_props_names = ["value","text","hidden","disabled"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectItem', slots, []);
    	let { value = "" } = $$props;
    	let { text = "" } = $$props;
    	let { hidden = false } = $$props;
    	let { disabled = false } = $$props;
    	const ctx = getContext("Select") || getContext("TimePickerSelect");
    	let selected = false;

    	const unsubscribe = ctx.selectedValue.subscribe(currentValue => {
    		$$invalidate(4, selected = currentValue === value);
    	});

    	onMount(() => {
    		return () => unsubscribe();
    	});

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('text' in $$new_props) $$invalidate(1, text = $$new_props.text);
    		if ('hidden' in $$new_props) $$invalidate(2, hidden = $$new_props.hidden);
    		if ('disabled' in $$new_props) $$invalidate(3, disabled = $$new_props.disabled);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		text,
    		hidden,
    		disabled,
    		getContext,
    		onMount,
    		ctx,
    		selected,
    		unsubscribe
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('text' in $$props) $$invalidate(1, text = $$new_props.text);
    		if ('hidden' in $$props) $$invalidate(2, hidden = $$new_props.hidden);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('selected' in $$props) $$invalidate(4, selected = $$new_props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, text, hidden, disabled, selected, $$restProps];
    }

    class SelectItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
    			value: 0,
    			text: 1,
    			hidden: 2,
    			disabled: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectItem",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get value() {
    		throw new Error("<SelectItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<SelectItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<SelectItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SelectItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hidden() {
    		throw new Error("<SelectItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hidden(value) {
    		throw new Error("<SelectItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<SelectItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<SelectItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SelectItem$1 = SelectItem;

    /* node_modules\carbon-components-svelte\src\Pagination\Pagination.svelte generated by Svelte v3.49.0 */
    const file$k = "node_modules\\carbon-components-svelte\\src\\Pagination\\Pagination.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[28] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	child_ctx[28] = i;
    	return child_ctx;
    }

    // (107:4) {#if !pageSizeInputDisabled}
    function create_if_block_3$1(ctx) {
    	let label;
    	let t0;
    	let label_id_value;
    	let label_for_value;
    	let t1;
    	let select;
    	let updating_selected;
    	let current;

    	function select_selected_binding(value) {
    		/*select_selected_binding*/ ctx[22](value);
    	}

    	let select_props = {
    		id: "bx--pagination-select-" + /*id*/ ctx[14],
    		class: "bx--select__item-count",
    		hideLabel: true,
    		noLabel: true,
    		inline: true,
    		$$slots: { default: [create_default_slot_1$8] },
    		$$scope: { ctx }
    	};

    	if (/*pageSize*/ ctx[1] !== void 0) {
    		select_props.selected = /*pageSize*/ ctx[1];
    	}

    	select = new Select$1({ props: select_props, $$inline: true });
    	binding_callbacks.push(() => bind(select, 'selected', select_selected_binding));

    	const block = {
    		c: function create() {
    			label = element("label");
    			t0 = text(/*itemsPerPageText*/ ctx[5]);
    			t1 = space();
    			create_component(select.$$.fragment);
    			attr_dev(label, "id", label_id_value = "bx--pagination-select-" + /*id*/ ctx[14] + "-count-label");
    			attr_dev(label, "for", label_for_value = "bx--pagination-select-" + /*id*/ ctx[14]);
    			toggle_class(label, "bx--pagination__text", true);
    			add_location(label, file$k, 107, 6, 3003);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(select, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*itemsPerPageText*/ 32) set_data_dev(t0, /*itemsPerPageText*/ ctx[5]);

    			if (!current || dirty & /*id*/ 16384 && label_id_value !== (label_id_value = "bx--pagination-select-" + /*id*/ ctx[14] + "-count-label")) {
    				attr_dev(label, "id", label_id_value);
    			}

    			if (!current || dirty & /*id*/ 16384 && label_for_value !== (label_for_value = "bx--pagination-select-" + /*id*/ ctx[14])) {
    				attr_dev(label, "for", label_for_value);
    			}

    			const select_changes = {};
    			if (dirty & /*id*/ 16384) select_changes.id = "bx--pagination-select-" + /*id*/ ctx[14];

    			if (dirty & /*$$scope, pageSizes*/ 1073742848) {
    				select_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_selected && dirty & /*pageSize*/ 2) {
    				updating_selected = true;
    				select_changes.selected = /*pageSize*/ ctx[1];
    				add_flush_callback(() => updating_selected = false);
    			}

    			select.$set(select_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			destroy_component(select, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(107:4) {#if !pageSizeInputDisabled}",
    		ctx
    	});

    	return block;
    }

    // (123:8) {#each pageSizes as size, i (size)}
    function create_each_block_1(key_1, ctx) {
    	let first;
    	let selectitem;
    	let current;

    	selectitem = new SelectItem$1({
    			props: {
    				value: /*size*/ ctx[26],
    				text: /*size*/ ctx[26].toString()
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(selectitem.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(selectitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const selectitem_changes = {};
    			if (dirty & /*pageSizes*/ 1024) selectitem_changes.value = /*size*/ ctx[26];
    			if (dirty & /*pageSizes*/ 1024) selectitem_changes.text = /*size*/ ctx[26].toString();
    			selectitem.$set(selectitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(selectitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(123:8) {#each pageSizes as size, i (size)}",
    		ctx
    	});

    	return block;
    }

    // (115:6) <Select         id="bx--pagination-select-{id}"         class="bx--select__item-count"         hideLabel         noLabel         inline         bind:selected="{pageSize}"       >
    function create_default_slot_1$8(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value_1 = /*pageSizes*/ ctx[10];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*size*/ ctx[26];
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pageSizes*/ 1024) {
    				each_value_1 = /*pageSizes*/ ctx[10];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block_1, each_1_anchor, get_each_context_1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(115:6) <Select         id=\\\"bx--pagination-select-{id}\\\"         class=\\\"bx--select__item-count\\\"         hideLabel         noLabel         inline         bind:selected=\\\"{pageSize}\\\"       >",
    		ctx
    	});

    	return block;
    }

    // (131:6) {:else}
    function create_else_block_1(ctx) {
    	let t_value = /*itemRangeText*/ ctx[7](Math.min(/*pageSize*/ ctx[1] * (/*page*/ ctx[0] - 1) + 1, /*totalItems*/ ctx[2]), Math.min(/*page*/ ctx[0] * /*pageSize*/ ctx[1], /*totalItems*/ ctx[2]), /*totalItems*/ ctx[2]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*itemRangeText, pageSize, page, totalItems*/ 135 && t_value !== (t_value = /*itemRangeText*/ ctx[7](Math.min(/*pageSize*/ ctx[1] * (/*page*/ ctx[0] - 1) + 1, /*totalItems*/ ctx[2]), Math.min(/*page*/ ctx[0] * /*pageSize*/ ctx[1], /*totalItems*/ ctx[2]), /*totalItems*/ ctx[2]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(131:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (129:6) {#if pagesUnknown}
    function create_if_block_2$2(ctx) {
    	let t_value = /*itemText*/ ctx[6](/*pageSize*/ ctx[1] * (/*page*/ ctx[0] - 1) + 1, /*page*/ ctx[0] * /*pageSize*/ ctx[1]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*itemText, pageSize, page*/ 67 && t_value !== (t_value = /*itemText*/ ctx[6](/*pageSize*/ ctx[1] * (/*page*/ ctx[0] - 1) + 1, /*page*/ ctx[0] * /*pageSize*/ ctx[1]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(129:6) {#if pagesUnknown}",
    		ctx
    	});

    	return block;
    }

    // (141:4) {#if !pageInputDisabled}
    function create_if_block$9(ctx) {
    	let select;
    	let updating_selected;
    	let t;
    	let span;
    	let current;

    	function select_selected_binding_1(value) {
    		/*select_selected_binding_1*/ ctx[23](value);
    	}

    	let select_props = {
    		id: "bx--pagination-select-" + (/*id*/ ctx[14] + 2),
    		class: "bx--select__page-number",
    		labelText: "Page number, of " + /*totalPages*/ ctx[15] + " pages",
    		inline: true,
    		hideLabel: true,
    		$$slots: { default: [create_default_slot$9] },
    		$$scope: { ctx }
    	};

    	if (/*page*/ ctx[0] !== void 0) {
    		select_props.selected = /*page*/ ctx[0];
    	}

    	select = new Select$1({ props: select_props, $$inline: true });
    	binding_callbacks.push(() => bind(select, 'selected', select_selected_binding_1));

    	function select_block_type_1(ctx, dirty) {
    		if (/*pagesUnknown*/ ctx[11]) return create_if_block_1$5;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			create_component(select.$$.fragment);
    			t = space();
    			span = element("span");
    			if_block.c();
    			toggle_class(span, "bx--pagination__text", true);
    			add_location(span, file$k, 153, 6, 4355);
    		},
    		m: function mount(target, anchor) {
    			mount_component(select, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, span, anchor);
    			if_block.m(span, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const select_changes = {};
    			if (dirty & /*id*/ 16384) select_changes.id = "bx--pagination-select-" + (/*id*/ ctx[14] + 2);
    			if (dirty & /*totalPages*/ 32768) select_changes.labelText = "Page number, of " + /*totalPages*/ ctx[15] + " pages";

    			if (dirty & /*$$scope, selectItems*/ 1074003968) {
    				select_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_selected && dirty & /*page*/ 1) {
    				updating_selected = true;
    				select_changes.selected = /*page*/ ctx[0];
    				add_flush_callback(() => updating_selected = false);
    			}

    			select.$set(select_changes);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(span, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(select, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(span);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(141:4) {#if !pageInputDisabled}",
    		ctx
    	});

    	return block;
    }

    // (150:8) {#each selectItems as size, i (size)}
    function create_each_block$3(key_1, ctx) {
    	let first;
    	let selectitem;
    	let current;

    	selectitem = new SelectItem$1({
    			props: {
    				value: /*size*/ ctx[26] + 1,
    				text: (/*size*/ ctx[26] + 1).toString()
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(selectitem.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(selectitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const selectitem_changes = {};
    			if (dirty & /*selectItems*/ 262144) selectitem_changes.value = /*size*/ ctx[26] + 1;
    			if (dirty & /*selectItems*/ 262144) selectitem_changes.text = (/*size*/ ctx[26] + 1).toString();
    			selectitem.$set(selectitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(selectitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(150:8) {#each selectItems as size, i (size)}",
    		ctx
    	});

    	return block;
    }

    // (142:6) <Select         id="bx--pagination-select-{id + 2}"         class="bx--select__page-number"         labelText="Page number, of {totalPages} pages"         inline         hideLabel         bind:selected="{page}"       >
    function create_default_slot$9(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*selectItems*/ ctx[18];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*size*/ ctx[26];
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectItems*/ 262144) {
    				each_value = /*selectItems*/ ctx[18];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$3, each_1_anchor, get_each_context$3);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(142:6) <Select         id=\\\"bx--pagination-select-{id + 2}\\\"         class=\\\"bx--select__page-number\\\"         labelText=\\\"Page number, of {totalPages} pages\\\"         inline         hideLabel         bind:selected=\\\"{page}\\\"       >",
    		ctx
    	});

    	return block;
    }

    // (157:8) {:else}
    function create_else_block$3(ctx) {
    	let t_value = /*pageRangeText*/ ctx[13](/*page*/ ctx[0], /*totalPages*/ ctx[15]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pageRangeText, page, totalPages*/ 40961 && t_value !== (t_value = /*pageRangeText*/ ctx[13](/*page*/ ctx[0], /*totalPages*/ ctx[15]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(157:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (155:8) {#if pagesUnknown}
    function create_if_block_1$5(ctx) {
    	let t_value = /*pageText*/ ctx[12](/*page*/ ctx[0]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pageText, page*/ 4097 && t_value !== (t_value = /*pageText*/ ctx[12](/*page*/ ctx[0]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(155:8) {#if pagesUnknown}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let span;
    	let t1;
    	let div1;
    	let t2;
    	let button0;
    	let t3;
    	let button1;
    	let current;
    	let if_block0 = !/*pageSizeInputDisabled*/ ctx[9] && create_if_block_3$1(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*pagesUnknown*/ ctx[11]) return create_if_block_2$2;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);
    	let if_block2 = !/*pageInputDisabled*/ ctx[8] && create_if_block$9(ctx);

    	button0 = new Button$1({
    			props: {
    				kind: "ghost",
    				tooltipAlignment: "center",
    				tooltipPosition: "top",
    				icon: CaretLeft$1,
    				iconDescription: /*backwardText*/ ctx[4],
    				disabled: /*backButtonDisabled*/ ctx[17],
    				class: "bx--pagination__button bx--pagination__button--backward " + (/*backButtonDisabled*/ ctx[17]
    				? 'bx--pagination__button--no-index'
    				: '')
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler*/ ctx[24]);

    	button1 = new Button$1({
    			props: {
    				kind: "ghost",
    				tooltipAlignment: "end",
    				tooltipPosition: "top",
    				icon: CaretRight$1,
    				iconDescription: /*forwardText*/ ctx[3],
    				disabled: /*forwardButtonDisabled*/ ctx[16],
    				class: "bx--pagination__button bx--pagination__button--forward " + (/*forwardButtonDisabled*/ ctx[16]
    				? 'bx--pagination__button--no-index'
    				: '')
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_1*/ ctx[25]);
    	let div2_levels = [{ id: /*id*/ ctx[14] }, /*$$restProps*/ ctx[20]];
    	let div2_data = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div2_data = assign(div2_data, div2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			span = element("span");
    			if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			if (if_block2) if_block2.c();
    			t2 = space();
    			create_component(button0.$$.fragment);
    			t3 = space();
    			create_component(button1.$$.fragment);
    			toggle_class(span, "bx--pagination__text", !/*pageSizeInputDisabled*/ ctx[9]);
    			add_location(span, file$k, 127, 4, 3537);
    			toggle_class(div0, "bx--pagination__left", true);
    			add_location(div0, file$k, 105, 2, 2922);
    			toggle_class(div1, "bx--pagination__right", true);
    			add_location(div1, file$k, 139, 2, 3899);
    			set_attributes(div2, div2_data);
    			toggle_class(div2, "bx--pagination", true);
    			add_location(div2, file$k, 104, 0, 2857);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, span);
    			if_block1.m(span, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t2);
    			mount_component(button0, div1, null);
    			append_dev(div1, t3);
    			mount_component(button1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*pageSizeInputDisabled*/ ctx[9]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*pageSizeInputDisabled*/ 512) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(span, null);
    				}
    			}

    			if (dirty & /*pageSizeInputDisabled*/ 512) {
    				toggle_class(span, "bx--pagination__text", !/*pageSizeInputDisabled*/ ctx[9]);
    			}

    			if (!/*pageInputDisabled*/ ctx[8]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*pageInputDisabled*/ 256) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$9(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			const button0_changes = {};
    			if (dirty & /*backwardText*/ 16) button0_changes.iconDescription = /*backwardText*/ ctx[4];
    			if (dirty & /*backButtonDisabled*/ 131072) button0_changes.disabled = /*backButtonDisabled*/ ctx[17];

    			if (dirty & /*backButtonDisabled*/ 131072) button0_changes.class = "bx--pagination__button bx--pagination__button--backward " + (/*backButtonDisabled*/ ctx[17]
    			? 'bx--pagination__button--no-index'
    			: '');

    			button0.$set(button0_changes);
    			const button1_changes = {};
    			if (dirty & /*forwardText*/ 8) button1_changes.iconDescription = /*forwardText*/ ctx[3];
    			if (dirty & /*forwardButtonDisabled*/ 65536) button1_changes.disabled = /*forwardButtonDisabled*/ ctx[16];

    			if (dirty & /*forwardButtonDisabled*/ 65536) button1_changes.class = "bx--pagination__button bx--pagination__button--forward " + (/*forwardButtonDisabled*/ ctx[16]
    			? 'bx--pagination__button--no-index'
    			: '');

    			button1.$set(button1_changes);

    			set_attributes(div2, div2_data = get_spread_update(div2_levels, [
    				(!current || dirty & /*id*/ 16384) && { id: /*id*/ ctx[14] },
    				dirty & /*$$restProps*/ 1048576 && /*$$restProps*/ ctx[20]
    			]));

    			toggle_class(div2, "bx--pagination", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let totalPages;
    	let selectItems;
    	let backButtonDisabled;
    	let forwardButtonDisabled;

    	const omit_props_names = [
    		"page","totalItems","disabled","forwardText","backwardText","itemsPerPageText","itemText","itemRangeText","pageInputDisabled","pageSizeInputDisabled","pageSize","pageSizes","pagesUnknown","pageText","pageRangeText","id"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pagination', slots, []);
    	let { page = 1 } = $$props;
    	let { totalItems = 0 } = $$props;
    	let { disabled = false } = $$props;
    	let { forwardText = "Next page" } = $$props;
    	let { backwardText = "Previous page" } = $$props;
    	let { itemsPerPageText = "Items per page:" } = $$props;
    	let { itemText = (min, max) => `${min}–${max} items` } = $$props;
    	let { itemRangeText = (min, max, total) => `${min}–${max} of ${total} items` } = $$props;
    	let { pageInputDisabled = false } = $$props;
    	let { pageSizeInputDisabled = false } = $$props;
    	let { pageSize = 10 } = $$props;
    	let { pageSizes = [10] } = $$props;
    	let { pagesUnknown = false } = $$props;
    	let { pageText = page => `page ${page}` } = $$props;
    	let { pageRangeText = (current, total) => `of ${total} page${total === 1 ? "" : "s"}` } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	const dispatch = createEventDispatcher();

    	afterUpdate(() => {
    		if (page > totalPages) {
    			$$invalidate(0, page = totalPages);
    		}
    	});

    	function select_selected_binding(value) {
    		pageSize = value;
    		($$invalidate(1, pageSize), $$invalidate(0, page));
    	}

    	function select_selected_binding_1(value) {
    		page = value;
    		($$invalidate(0, page), $$invalidate(1, pageSize));
    	}

    	const click_handler = () => {
    		$$invalidate(0, page--, page);
    		dispatch('click:button--previous', { page });
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, page++, page);
    		dispatch('click:button--next', { page });
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(20, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('page' in $$new_props) $$invalidate(0, page = $$new_props.page);
    		if ('totalItems' in $$new_props) $$invalidate(2, totalItems = $$new_props.totalItems);
    		if ('disabled' in $$new_props) $$invalidate(21, disabled = $$new_props.disabled);
    		if ('forwardText' in $$new_props) $$invalidate(3, forwardText = $$new_props.forwardText);
    		if ('backwardText' in $$new_props) $$invalidate(4, backwardText = $$new_props.backwardText);
    		if ('itemsPerPageText' in $$new_props) $$invalidate(5, itemsPerPageText = $$new_props.itemsPerPageText);
    		if ('itemText' in $$new_props) $$invalidate(6, itemText = $$new_props.itemText);
    		if ('itemRangeText' in $$new_props) $$invalidate(7, itemRangeText = $$new_props.itemRangeText);
    		if ('pageInputDisabled' in $$new_props) $$invalidate(8, pageInputDisabled = $$new_props.pageInputDisabled);
    		if ('pageSizeInputDisabled' in $$new_props) $$invalidate(9, pageSizeInputDisabled = $$new_props.pageSizeInputDisabled);
    		if ('pageSize' in $$new_props) $$invalidate(1, pageSize = $$new_props.pageSize);
    		if ('pageSizes' in $$new_props) $$invalidate(10, pageSizes = $$new_props.pageSizes);
    		if ('pagesUnknown' in $$new_props) $$invalidate(11, pagesUnknown = $$new_props.pagesUnknown);
    		if ('pageText' in $$new_props) $$invalidate(12, pageText = $$new_props.pageText);
    		if ('pageRangeText' in $$new_props) $$invalidate(13, pageRangeText = $$new_props.pageRangeText);
    		if ('id' in $$new_props) $$invalidate(14, id = $$new_props.id);
    	};

    	$$self.$capture_state = () => ({
    		page,
    		totalItems,
    		disabled,
    		forwardText,
    		backwardText,
    		itemsPerPageText,
    		itemText,
    		itemRangeText,
    		pageInputDisabled,
    		pageSizeInputDisabled,
    		pageSize,
    		pageSizes,
    		pagesUnknown,
    		pageText,
    		pageRangeText,
    		id,
    		afterUpdate,
    		createEventDispatcher,
    		CaretLeft: CaretLeft$1,
    		CaretRight: CaretRight$1,
    		Button: Button$1,
    		Select: Select$1,
    		SelectItem: SelectItem$1,
    		dispatch,
    		totalPages,
    		forwardButtonDisabled,
    		backButtonDisabled,
    		selectItems
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('page' in $$props) $$invalidate(0, page = $$new_props.page);
    		if ('totalItems' in $$props) $$invalidate(2, totalItems = $$new_props.totalItems);
    		if ('disabled' in $$props) $$invalidate(21, disabled = $$new_props.disabled);
    		if ('forwardText' in $$props) $$invalidate(3, forwardText = $$new_props.forwardText);
    		if ('backwardText' in $$props) $$invalidate(4, backwardText = $$new_props.backwardText);
    		if ('itemsPerPageText' in $$props) $$invalidate(5, itemsPerPageText = $$new_props.itemsPerPageText);
    		if ('itemText' in $$props) $$invalidate(6, itemText = $$new_props.itemText);
    		if ('itemRangeText' in $$props) $$invalidate(7, itemRangeText = $$new_props.itemRangeText);
    		if ('pageInputDisabled' in $$props) $$invalidate(8, pageInputDisabled = $$new_props.pageInputDisabled);
    		if ('pageSizeInputDisabled' in $$props) $$invalidate(9, pageSizeInputDisabled = $$new_props.pageSizeInputDisabled);
    		if ('pageSize' in $$props) $$invalidate(1, pageSize = $$new_props.pageSize);
    		if ('pageSizes' in $$props) $$invalidate(10, pageSizes = $$new_props.pageSizes);
    		if ('pagesUnknown' in $$props) $$invalidate(11, pagesUnknown = $$new_props.pagesUnknown);
    		if ('pageText' in $$props) $$invalidate(12, pageText = $$new_props.pageText);
    		if ('pageRangeText' in $$props) $$invalidate(13, pageRangeText = $$new_props.pageRangeText);
    		if ('id' in $$props) $$invalidate(14, id = $$new_props.id);
    		if ('totalPages' in $$props) $$invalidate(15, totalPages = $$new_props.totalPages);
    		if ('forwardButtonDisabled' in $$props) $$invalidate(16, forwardButtonDisabled = $$new_props.forwardButtonDisabled);
    		if ('backButtonDisabled' in $$props) $$invalidate(17, backButtonDisabled = $$new_props.backButtonDisabled);
    		if ('selectItems' in $$props) $$invalidate(18, selectItems = $$new_props.selectItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*page, pageSize*/ 3) {
    			{
    				if (typeof page !== "number") {
    					$$invalidate(0, page = Number(page));
    				}

    				if (typeof pageSize !== "number") {
    					$$invalidate(1, pageSize = Number(pageSize));
    				}

    				dispatch("update", { pageSize, page });
    			}
    		}

    		if ($$self.$$.dirty & /*totalItems, pageSize*/ 6) {
    			$$invalidate(15, totalPages = Math.max(Math.ceil(totalItems / pageSize), 1));
    		}

    		if ($$self.$$.dirty & /*totalPages*/ 32768) {
    			$$invalidate(18, selectItems = Array.from({ length: totalPages }, (_, i) => i));
    		}

    		if ($$self.$$.dirty & /*disabled, page*/ 2097153) {
    			$$invalidate(17, backButtonDisabled = disabled || page === 1);
    		}

    		if ($$self.$$.dirty & /*disabled, page, totalPages*/ 2129921) {
    			$$invalidate(16, forwardButtonDisabled = disabled || page === totalPages);
    		}
    	};

    	return [
    		page,
    		pageSize,
    		totalItems,
    		forwardText,
    		backwardText,
    		itemsPerPageText,
    		itemText,
    		itemRangeText,
    		pageInputDisabled,
    		pageSizeInputDisabled,
    		pageSizes,
    		pagesUnknown,
    		pageText,
    		pageRangeText,
    		id,
    		totalPages,
    		forwardButtonDisabled,
    		backButtonDisabled,
    		selectItems,
    		dispatch,
    		$$restProps,
    		disabled,
    		select_selected_binding,
    		select_selected_binding_1,
    		click_handler,
    		click_handler_1
    	];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			page: 0,
    			totalItems: 2,
    			disabled: 21,
    			forwardText: 3,
    			backwardText: 4,
    			itemsPerPageText: 5,
    			itemText: 6,
    			itemRangeText: 7,
    			pageInputDisabled: 8,
    			pageSizeInputDisabled: 9,
    			pageSize: 1,
    			pageSizes: 10,
    			pagesUnknown: 11,
    			pageText: 12,
    			pageRangeText: 13,
    			id: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get page() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set page(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get totalItems() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalItems(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get forwardText() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set forwardText(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backwardText() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backwardText(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemsPerPageText() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemsPerPageText(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemText() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemText(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemRangeText() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemRangeText(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageInputDisabled() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageInputDisabled(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSizeInputDisabled() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSizeInputDisabled(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSize() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSize(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSizes() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSizes(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pagesUnknown() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pagesUnknown(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageText() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageText(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageRangeText() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageRangeText(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Pagination$1 = Pagination;

    /* node_modules\carbon-components-svelte\src\TextInput\TextInput.svelte generated by Svelte v3.49.0 */
    const file$j = "node_modules\\carbon-components-svelte\\src\\TextInput\\TextInput.svelte";
    const get_labelText_slot_changes_1 = dirty => ({});
    const get_labelText_slot_context_1 = ctx => ({});
    const get_labelText_slot_changes = dirty => ({});
    const get_labelText_slot_context = ctx => ({});

    // (114:2) {#if inline}
    function create_if_block_10(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block0 = /*labelText*/ ctx[9] && create_if_block_12(ctx);
    	let if_block1 = !/*isFluid*/ ctx[20] && /*helperText*/ ctx[6] && create_if_block_11(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			toggle_class(div, "bx--text-input__label-helper-wrapper", true);
    			add_location(div, file$j, 114, 4, 2839);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*labelText*/ ctx[9]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*labelText*/ 512) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_12(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*isFluid*/ ctx[20] && /*helperText*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_11(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(114:2) {#if inline}",
    		ctx
    	});

    	return block;
    }

    // (116:6) {#if labelText}
    function create_if_block_12(ctx) {
    	let label;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[26].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[25], get_labelText_slot_context);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			attr_dev(label, "for", /*id*/ ctx[7]);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[10]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[5]);
    			toggle_class(label, "bx--label--inline", /*inline*/ ctx[16]);
    			toggle_class(label, "bx--label--inline--sm", /*size*/ ctx[2] === 'sm');
    			toggle_class(label, "bx--label--inline--xl", /*size*/ ctx[2] === 'xl');
    			add_location(label, file$j, 116, 8, 2927);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[25], dirty, get_labelText_slot_changes),
    						get_labelText_slot_context
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty[0] & /*labelText*/ 512)) {
    					labelText_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 128) {
    				attr_dev(label, "for", /*id*/ ctx[7]);
    			}

    			if (dirty[0] & /*hideLabel*/ 1024) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[10]);
    			}

    			if (dirty[0] & /*disabled*/ 32) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[5]);
    			}

    			if (dirty[0] & /*inline*/ 65536) {
    				toggle_class(label, "bx--label--inline", /*inline*/ ctx[16]);
    			}

    			if (dirty[0] & /*size*/ 4) {
    				toggle_class(label, "bx--label--inline--sm", /*size*/ ctx[2] === 'sm');
    			}

    			if (dirty[0] & /*size*/ 4) {
    				toggle_class(label, "bx--label--inline--xl", /*size*/ ctx[2] === 'xl');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(116:6) {#if labelText}",
    		ctx
    	});

    	return block;
    }

    // (126:33)              
    function fallback_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[9]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 512) set_data_dev(t, /*labelText*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(126:33)              ",
    		ctx
    	});

    	return block;
    }

    // (131:6) {#if !isFluid && helperText}
    function create_if_block_11(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[6]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[5]);
    			toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[16]);
    			add_location(div, file$j, 131, 8, 3404);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 64) set_data_dev(t, /*helperText*/ ctx[6]);

    			if (dirty[0] & /*disabled*/ 32) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[5]);
    			}

    			if (dirty[0] & /*inline*/ 65536) {
    				toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[16]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(131:6) {#if !isFluid && helperText}",
    		ctx
    	});

    	return block;
    }

    // (142:2) {#if !inline && (labelText || $$slots.labelText)}
    function create_if_block_9(ctx) {
    	let label;
    	let label_class_value;
    	let current;
    	const labelText_slot_template = /*#slots*/ ctx[26].labelText;
    	const labelText_slot = create_slot(labelText_slot_template, ctx, /*$$scope*/ ctx[25], get_labelText_slot_context_1);
    	const labelText_slot_or_fallback = labelText_slot || fallback_block$2(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.c();
    			attr_dev(label, "for", /*id*/ ctx[7]);
    			attr_dev(label, "class", label_class_value = /*inline*/ ctx[16] && !!/*size*/ ctx[2] && `bx--label--inline--${/*size*/ ctx[2]}`);
    			toggle_class(label, "bx--label", true);
    			toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[10]);
    			toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[5]);
    			toggle_class(label, "bx--label--inline", /*inline*/ ctx[16]);
    			add_location(label, file$j, 142, 4, 3709);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (labelText_slot_or_fallback) {
    				labelText_slot_or_fallback.m(label, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (labelText_slot) {
    				if (labelText_slot.p && (!current || dirty[0] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						labelText_slot,
    						labelText_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(labelText_slot_template, /*$$scope*/ ctx[25], dirty, get_labelText_slot_changes_1),
    						get_labelText_slot_context_1
    					);
    				}
    			} else {
    				if (labelText_slot_or_fallback && labelText_slot_or_fallback.p && (!current || dirty[0] & /*labelText*/ 512)) {
    					labelText_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*id*/ 128) {
    				attr_dev(label, "for", /*id*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*inline, size*/ 65540 && label_class_value !== (label_class_value = /*inline*/ ctx[16] && !!/*size*/ ctx[2] && `bx--label--inline--${/*size*/ ctx[2]}`)) {
    				attr_dev(label, "class", label_class_value);
    			}

    			if (dirty[0] & /*inline, size*/ 65540) {
    				toggle_class(label, "bx--label", true);
    			}

    			if (dirty[0] & /*inline, size, hideLabel*/ 66564) {
    				toggle_class(label, "bx--visually-hidden", /*hideLabel*/ ctx[10]);
    			}

    			if (dirty[0] & /*inline, size, disabled*/ 65572) {
    				toggle_class(label, "bx--label--disabled", /*disabled*/ ctx[5]);
    			}

    			if (dirty[0] & /*inline, size, inline*/ 65540) {
    				toggle_class(label, "bx--label--inline", /*inline*/ ctx[16]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(labelText_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(labelText_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (labelText_slot_or_fallback) labelText_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(142:2) {#if !inline && (labelText || $$slots.labelText)}",
    		ctx
    	});

    	return block;
    }

    // (151:29)          
    function fallback_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*labelText*/ ctx[9]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*labelText*/ 512) set_data_dev(t, /*labelText*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(151:29)          ",
    		ctx
    	});

    	return block;
    }

    // (166:6) {#if invalid}
    function create_if_block_8(ctx) {
    	let warningfilled;
    	let current;

    	warningfilled = new WarningFilled$1({
    			props: { class: "bx--text-input__invalid-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(166:6) {#if invalid}",
    		ctx
    	});

    	return block;
    }

    // (169:6) {#if !invalid && warn}
    function create_if_block_7(ctx) {
    	let warningaltfilled;
    	let current;

    	warningaltfilled = new WarningAltFilled$1({
    			props: {
    				class: "bx--text-input__invalid-icon\n            bx--text-input__invalid-icon--warning"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(warningaltfilled.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(warningaltfilled, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(warningaltfilled.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(warningaltfilled.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(warningaltfilled, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(169:6) {#if !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    // (175:6) {#if readonly}
    function create_if_block_6(ctx) {
    	let editoff;
    	let current;

    	editoff = new EditOff$1({
    			props: { class: "bx--text-input__readonly-icon" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(editoff.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(editoff, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editoff.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editoff.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(editoff, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(175:6) {#if readonly}",
    		ctx
    	});

    	return block;
    }

    // (206:6) {#if isFluid}
    function create_if_block_5(ctx) {
    	let hr;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			toggle_class(hr, "bx--text-input__divider", true);
    			add_location(hr, file$j, 206, 8, 5683);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(206:6) {#if isFluid}",
    		ctx
    	});

    	return block;
    }

    // (209:6) {#if isFluid && !inline && invalid}
    function create_if_block_4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[12]);
    			attr_dev(div, "id", /*errorId*/ ctx[19]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$j, 209, 8, 5791);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 4096) set_data_dev(t, /*invalidText*/ ctx[12]);

    			if (dirty[0] & /*errorId*/ 524288) {
    				attr_dev(div, "id", /*errorId*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(209:6) {#if isFluid && !inline && invalid}",
    		ctx
    	});

    	return block;
    }

    // (214:6) {#if isFluid && !inline && warn}
    function create_if_block_3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[14]);
    			attr_dev(div, "id", /*warnId*/ ctx[18]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$j, 214, 8, 5946);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*warnText*/ 16384) set_data_dev(t, /*warnText*/ ctx[14]);

    			if (dirty[0] & /*warnId*/ 262144) {
    				attr_dev(div, "id", /*warnId*/ ctx[18]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(214:6) {#if isFluid && !inline && warn}",
    		ctx
    	});

    	return block;
    }

    // (218:4) {#if !invalid && !warn && !isFluid && !inline && helperText}
    function create_if_block_2$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*helperText*/ ctx[6]);
    			toggle_class(div, "bx--form__helper-text", true);
    			toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[5]);
    			toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[16]);
    			add_location(div, file$j, 218, 6, 6112);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*helperText*/ 64) set_data_dev(t, /*helperText*/ ctx[6]);

    			if (dirty[0] & /*disabled*/ 32) {
    				toggle_class(div, "bx--form__helper-text--disabled", /*disabled*/ ctx[5]);
    			}

    			if (dirty[0] & /*inline*/ 65536) {
    				toggle_class(div, "bx--form__helper-text--inline", /*inline*/ ctx[16]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(218:4) {#if !invalid && !warn && !isFluid && !inline && helperText}",
    		ctx
    	});

    	return block;
    }

    // (227:4) {#if !isFluid && invalid}
    function create_if_block_1$4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*invalidText*/ ctx[12]);
    			attr_dev(div, "id", /*errorId*/ ctx[19]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$j, 227, 6, 6364);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*invalidText*/ 4096) set_data_dev(t, /*invalidText*/ ctx[12]);

    			if (dirty[0] & /*errorId*/ 524288) {
    				attr_dev(div, "id", /*errorId*/ ctx[19]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(227:4) {#if !isFluid && invalid}",
    		ctx
    	});

    	return block;
    }

    // (232:4) {#if !isFluid && !invalid && warn}
    function create_if_block$8(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*warnText*/ ctx[14]);
    			attr_dev(div, "id", /*warnId*/ ctx[18]);
    			toggle_class(div, "bx--form-requirement", true);
    			add_location(div, file$j, 232, 6, 6511);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*warnText*/ 16384) set_data_dev(t, /*warnText*/ ctx[14]);

    			if (dirty[0] & /*warnId*/ 262144) {
    				attr_dev(div, "id", /*warnId*/ ctx[18]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(232:4) {#if !isFluid && !invalid && warn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div2;
    	let t0;
    	let t1;
    	let div1;
    	let div0;
    	let t2;
    	let t3;
    	let t4;
    	let input;
    	let input_data_invalid_value;
    	let input_aria_invalid_value;
    	let input_data_warn_value;
    	let input_aria_describedby_value;
    	let t5;
    	let t6;
    	let t7;
    	let div0_data_invalid_value;
    	let div0_data_warn_value;
    	let t8;
    	let t9;
    	let t10;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*inline*/ ctx[16] && create_if_block_10(ctx);
    	let if_block1 = !/*inline*/ ctx[16] && (/*labelText*/ ctx[9] || /*$$slots*/ ctx[24].labelText) && create_if_block_9(ctx);
    	let if_block2 = /*invalid*/ ctx[11] && create_if_block_8(ctx);
    	let if_block3 = !/*invalid*/ ctx[11] && /*warn*/ ctx[13] && create_if_block_7(ctx);
    	let if_block4 = /*readonly*/ ctx[17] && create_if_block_6(ctx);

    	let input_levels = [
    		{
    			"data-invalid": input_data_invalid_value = /*invalid*/ ctx[11] || undefined
    		},
    		{
    			"aria-invalid": input_aria_invalid_value = /*invalid*/ ctx[11] || undefined
    		},
    		{
    			"data-warn": input_data_warn_value = /*warn*/ ctx[13] || undefined
    		},
    		{
    			"aria-describedby": input_aria_describedby_value = /*invalid*/ ctx[11]
    			? /*errorId*/ ctx[19]
    			: /*warn*/ ctx[13] ? /*warnId*/ ctx[18] : undefined
    		},
    		{ disabled: /*disabled*/ ctx[5] },
    		{ id: /*id*/ ctx[7] },
    		{ name: /*name*/ ctx[8] },
    		{ placeholder: /*placeholder*/ ctx[3] },
    		{ required: /*required*/ ctx[15] },
    		{ readOnly: /*readonly*/ ctx[17] },
    		/*$$restProps*/ ctx[23]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let if_block5 = /*isFluid*/ ctx[20] && create_if_block_5(ctx);
    	let if_block6 = /*isFluid*/ ctx[20] && !/*inline*/ ctx[16] && /*invalid*/ ctx[11] && create_if_block_4(ctx);
    	let if_block7 = /*isFluid*/ ctx[20] && !/*inline*/ ctx[16] && /*warn*/ ctx[13] && create_if_block_3(ctx);
    	let if_block8 = !/*invalid*/ ctx[11] && !/*warn*/ ctx[13] && !/*isFluid*/ ctx[20] && !/*inline*/ ctx[16] && /*helperText*/ ctx[6] && create_if_block_2$1(ctx);
    	let if_block9 = !/*isFluid*/ ctx[20] && /*invalid*/ ctx[11] && create_if_block_1$4(ctx);
    	let if_block10 = !/*isFluid*/ ctx[20] && !/*invalid*/ ctx[11] && /*warn*/ ctx[13] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			input = element("input");
    			t5 = space();
    			if (if_block5) if_block5.c();
    			t6 = space();
    			if (if_block6) if_block6.c();
    			t7 = space();
    			if (if_block7) if_block7.c();
    			t8 = space();
    			if (if_block8) if_block8.c();
    			t9 = space();
    			if (if_block9) if_block9.c();
    			t10 = space();
    			if (if_block10) if_block10.c();
    			set_attributes(input, input_data);
    			toggle_class(input, "bx--text-input", true);
    			toggle_class(input, "bx--text-input--light", /*light*/ ctx[4]);
    			toggle_class(input, "bx--text-input--invalid", /*invalid*/ ctx[11]);
    			toggle_class(input, "bx--text-input--warn", /*warn*/ ctx[13]);
    			toggle_class(input, "bx--text-input--sm", /*size*/ ctx[2] === 'sm');
    			toggle_class(input, "bx--text-input--xl", /*size*/ ctx[2] === 'xl');
    			add_location(input, file$j, 177, 6, 4770);
    			attr_dev(div0, "data-invalid", div0_data_invalid_value = /*invalid*/ ctx[11] || undefined);
    			attr_dev(div0, "data-warn", div0_data_warn_value = /*warn*/ ctx[13] || undefined);
    			toggle_class(div0, "bx--text-input__field-wrapper", true);
    			toggle_class(div0, "bx--text-input__field-wrapper--warning", !/*invalid*/ ctx[11] && /*warn*/ ctx[13]);
    			add_location(div0, file$j, 159, 4, 4187);
    			toggle_class(div1, "bx--text-input__field-outer-wrapper", true);
    			toggle_class(div1, "bx--text-input__field-outer-wrapper--inline", /*inline*/ ctx[16]);
    			add_location(div1, file$j, 155, 2, 4054);
    			toggle_class(div2, "bx--form-item", true);
    			toggle_class(div2, "bx--text-input-wrapper", true);
    			toggle_class(div2, "bx--text-input-wrapper--inline", /*inline*/ ctx[16]);
    			toggle_class(div2, "bx--text-input-wrapper--light", /*light*/ ctx[4]);
    			toggle_class(div2, "bx--text-input-wrapper--readonly", /*readonly*/ ctx[17]);
    			add_location(div2, file$j, 102, 0, 2532);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t0);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div0, t2);
    			if (if_block3) if_block3.m(div0, null);
    			append_dev(div0, t3);
    			if (if_block4) if_block4.m(div0, null);
    			append_dev(div0, t4);
    			append_dev(div0, input);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[36](input);
    			set_input_value(input, /*value*/ ctx[0]);
    			append_dev(div0, t5);
    			if (if_block5) if_block5.m(div0, null);
    			append_dev(div0, t6);
    			if (if_block6) if_block6.m(div0, null);
    			append_dev(div0, t7);
    			if (if_block7) if_block7.m(div0, null);
    			append_dev(div1, t8);
    			if (if_block8) if_block8.m(div1, null);
    			append_dev(div1, t9);
    			if (if_block9) if_block9.m(div1, null);
    			append_dev(div1, t10);
    			if (if_block10) if_block10.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[37]),
    					listen_dev(input, "change", /*onChange*/ ctx[22], false, false, false),
    					listen_dev(input, "input", /*onInput*/ ctx[21], false, false, false),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[31], false, false, false),
    					listen_dev(input, "keyup", /*keyup_handler*/ ctx[32], false, false, false),
    					listen_dev(input, "focus", /*focus_handler*/ ctx[33], false, false, false),
    					listen_dev(input, "blur", /*blur_handler*/ ctx[34], false, false, false),
    					listen_dev(input, "paste", /*paste_handler*/ ctx[35], false, false, false),
    					listen_dev(div2, "click", /*click_handler*/ ctx[27], false, false, false),
    					listen_dev(div2, "mouseover", /*mouseover_handler*/ ctx[28], false, false, false),
    					listen_dev(div2, "mouseenter", /*mouseenter_handler*/ ctx[29], false, false, false),
    					listen_dev(div2, "mouseleave", /*mouseleave_handler*/ ctx[30], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*inline*/ ctx[16]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*inline*/ 65536) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*inline*/ ctx[16] && (/*labelText*/ ctx[9] || /*$$slots*/ ctx[24].labelText)) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*inline, labelText, $$slots*/ 16843264) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*invalid*/ ctx[11]) {
    				if (if_block2) {
    					if (dirty[0] & /*invalid*/ 2048) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_8(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div0, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!/*invalid*/ ctx[11] && /*warn*/ ctx[13]) {
    				if (if_block3) {
    					if (dirty[0] & /*invalid, warn*/ 10240) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_7(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div0, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*readonly*/ ctx[17]) {
    				if (if_block4) {
    					if (dirty[0] & /*readonly*/ 131072) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_6(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div0, t4);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				(!current || dirty[0] & /*invalid*/ 2048 && input_data_invalid_value !== (input_data_invalid_value = /*invalid*/ ctx[11] || undefined)) && { "data-invalid": input_data_invalid_value },
    				(!current || dirty[0] & /*invalid*/ 2048 && input_aria_invalid_value !== (input_aria_invalid_value = /*invalid*/ ctx[11] || undefined)) && { "aria-invalid": input_aria_invalid_value },
    				(!current || dirty[0] & /*warn*/ 8192 && input_data_warn_value !== (input_data_warn_value = /*warn*/ ctx[13] || undefined)) && { "data-warn": input_data_warn_value },
    				(!current || dirty[0] & /*invalid, errorId, warn, warnId*/ 796672 && input_aria_describedby_value !== (input_aria_describedby_value = /*invalid*/ ctx[11]
    				? /*errorId*/ ctx[19]
    				: /*warn*/ ctx[13] ? /*warnId*/ ctx[18] : undefined)) && {
    					"aria-describedby": input_aria_describedby_value
    				},
    				(!current || dirty[0] & /*disabled*/ 32) && { disabled: /*disabled*/ ctx[5] },
    				(!current || dirty[0] & /*id*/ 128) && { id: /*id*/ ctx[7] },
    				(!current || dirty[0] & /*name*/ 256) && { name: /*name*/ ctx[8] },
    				(!current || dirty[0] & /*placeholder*/ 8) && { placeholder: /*placeholder*/ ctx[3] },
    				(!current || dirty[0] & /*required*/ 32768) && { required: /*required*/ ctx[15] },
    				(!current || dirty[0] & /*readonly*/ 131072) && { readOnly: /*readonly*/ ctx[17] },
    				dirty[0] & /*$$restProps*/ 8388608 && /*$$restProps*/ ctx[23]
    			]));

    			if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "bx--text-input", true);
    			toggle_class(input, "bx--text-input--light", /*light*/ ctx[4]);
    			toggle_class(input, "bx--text-input--invalid", /*invalid*/ ctx[11]);
    			toggle_class(input, "bx--text-input--warn", /*warn*/ ctx[13]);
    			toggle_class(input, "bx--text-input--sm", /*size*/ ctx[2] === 'sm');
    			toggle_class(input, "bx--text-input--xl", /*size*/ ctx[2] === 'xl');

    			if (/*isFluid*/ ctx[20]) {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_5(ctx);
    					if_block5.c();
    					if_block5.m(div0, t6);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*isFluid*/ ctx[20] && !/*inline*/ ctx[16] && /*invalid*/ ctx[11]) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_4(ctx);
    					if_block6.c();
    					if_block6.m(div0, t7);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*isFluid*/ ctx[20] && !/*inline*/ ctx[16] && /*warn*/ ctx[13]) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_3(ctx);
    					if_block7.c();
    					if_block7.m(div0, null);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (!current || dirty[0] & /*invalid*/ 2048 && div0_data_invalid_value !== (div0_data_invalid_value = /*invalid*/ ctx[11] || undefined)) {
    				attr_dev(div0, "data-invalid", div0_data_invalid_value);
    			}

    			if (!current || dirty[0] & /*warn*/ 8192 && div0_data_warn_value !== (div0_data_warn_value = /*warn*/ ctx[13] || undefined)) {
    				attr_dev(div0, "data-warn", div0_data_warn_value);
    			}

    			if (dirty[0] & /*invalid, warn*/ 10240) {
    				toggle_class(div0, "bx--text-input__field-wrapper--warning", !/*invalid*/ ctx[11] && /*warn*/ ctx[13]);
    			}

    			if (!/*invalid*/ ctx[11] && !/*warn*/ ctx[13] && !/*isFluid*/ ctx[20] && !/*inline*/ ctx[16] && /*helperText*/ ctx[6]) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_2$1(ctx);
    					if_block8.c();
    					if_block8.m(div1, t9);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (!/*isFluid*/ ctx[20] && /*invalid*/ ctx[11]) {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block_1$4(ctx);
    					if_block9.c();
    					if_block9.m(div1, t10);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (!/*isFluid*/ ctx[20] && !/*invalid*/ ctx[11] && /*warn*/ ctx[13]) {
    				if (if_block10) {
    					if_block10.p(ctx, dirty);
    				} else {
    					if_block10 = create_if_block$8(ctx);
    					if_block10.c();
    					if_block10.m(div1, null);
    				}
    			} else if (if_block10) {
    				if_block10.d(1);
    				if_block10 = null;
    			}

    			if (dirty[0] & /*inline*/ 65536) {
    				toggle_class(div1, "bx--text-input__field-outer-wrapper--inline", /*inline*/ ctx[16]);
    			}

    			if (dirty[0] & /*inline*/ 65536) {
    				toggle_class(div2, "bx--text-input-wrapper--inline", /*inline*/ ctx[16]);
    			}

    			if (dirty[0] & /*light*/ 16) {
    				toggle_class(div2, "bx--text-input-wrapper--light", /*light*/ ctx[4]);
    			}

    			if (dirty[0] & /*readonly*/ 131072) {
    				toggle_class(div2, "bx--text-input-wrapper--readonly", /*readonly*/ ctx[17]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			/*input_binding*/ ctx[36](null);
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			if (if_block10) if_block10.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let isFluid;
    	let errorId;
    	let warnId;

    	const omit_props_names = [
    		"size","value","placeholder","light","disabled","helperText","id","name","labelText","hideLabel","invalid","invalidText","warn","warnText","ref","required","inline","readonly"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextInput', slots, ['labelText']);
    	const $$slots = compute_slots(slots);
    	let { size = undefined } = $$props;
    	let { value = "" } = $$props;
    	let { placeholder = "" } = $$props;
    	let { light = false } = $$props;
    	let { disabled = false } = $$props;
    	let { helperText = "" } = $$props;
    	let { id = "ccs-" + Math.random().toString(36) } = $$props;
    	let { name = undefined } = $$props;
    	let { labelText = "" } = $$props;
    	let { hideLabel = false } = $$props;
    	let { invalid = false } = $$props;
    	let { invalidText = "" } = $$props;
    	let { warn = false } = $$props;
    	let { warnText = "" } = $$props;
    	let { ref = null } = $$props;
    	let { required = false } = $$props;
    	let { inline = false } = $$props;
    	let { readonly = false } = $$props;
    	const ctx = getContext("Form");
    	const dispatch = createEventDispatcher();

    	function parse(raw) {
    		if ($$restProps.type !== "number") return raw;
    		return raw != "" ? Number(raw) : null;
    	}

    	/** @type {(e: Event) => void} */
    	const onInput = e => {
    		$$invalidate(0, value = parse(e.target.value));
    		dispatch("input", value);
    	};

    	/** @type {(e: Event) => void} */
    	const onChange = e => {
    		dispatch("change", parse(e.target.value));
    	};

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function paste_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(23, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('placeholder' in $$new_props) $$invalidate(3, placeholder = $$new_props.placeholder);
    		if ('light' in $$new_props) $$invalidate(4, light = $$new_props.light);
    		if ('disabled' in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('helperText' in $$new_props) $$invalidate(6, helperText = $$new_props.helperText);
    		if ('id' in $$new_props) $$invalidate(7, id = $$new_props.id);
    		if ('name' in $$new_props) $$invalidate(8, name = $$new_props.name);
    		if ('labelText' in $$new_props) $$invalidate(9, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$new_props) $$invalidate(10, hideLabel = $$new_props.hideLabel);
    		if ('invalid' in $$new_props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('invalidText' in $$new_props) $$invalidate(12, invalidText = $$new_props.invalidText);
    		if ('warn' in $$new_props) $$invalidate(13, warn = $$new_props.warn);
    		if ('warnText' in $$new_props) $$invalidate(14, warnText = $$new_props.warnText);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('required' in $$new_props) $$invalidate(15, required = $$new_props.required);
    		if ('inline' in $$new_props) $$invalidate(16, inline = $$new_props.inline);
    		if ('readonly' in $$new_props) $$invalidate(17, readonly = $$new_props.readonly);
    		if ('$$scope' in $$new_props) $$invalidate(25, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		value,
    		placeholder,
    		light,
    		disabled,
    		helperText,
    		id,
    		name,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		ref,
    		required,
    		inline,
    		readonly,
    		createEventDispatcher,
    		getContext,
    		WarningFilled: WarningFilled$1,
    		WarningAltFilled: WarningAltFilled$1,
    		EditOff: EditOff$1,
    		ctx,
    		dispatch,
    		parse,
    		onInput,
    		onChange,
    		warnId,
    		errorId,
    		isFluid
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(2, size = $$new_props.size);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$new_props.placeholder);
    		if ('light' in $$props) $$invalidate(4, light = $$new_props.light);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('helperText' in $$props) $$invalidate(6, helperText = $$new_props.helperText);
    		if ('id' in $$props) $$invalidate(7, id = $$new_props.id);
    		if ('name' in $$props) $$invalidate(8, name = $$new_props.name);
    		if ('labelText' in $$props) $$invalidate(9, labelText = $$new_props.labelText);
    		if ('hideLabel' in $$props) $$invalidate(10, hideLabel = $$new_props.hideLabel);
    		if ('invalid' in $$props) $$invalidate(11, invalid = $$new_props.invalid);
    		if ('invalidText' in $$props) $$invalidate(12, invalidText = $$new_props.invalidText);
    		if ('warn' in $$props) $$invalidate(13, warn = $$new_props.warn);
    		if ('warnText' in $$props) $$invalidate(14, warnText = $$new_props.warnText);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ('required' in $$props) $$invalidate(15, required = $$new_props.required);
    		if ('inline' in $$props) $$invalidate(16, inline = $$new_props.inline);
    		if ('readonly' in $$props) $$invalidate(17, readonly = $$new_props.readonly);
    		if ('warnId' in $$props) $$invalidate(18, warnId = $$new_props.warnId);
    		if ('errorId' in $$props) $$invalidate(19, errorId = $$new_props.errorId);
    		if ('isFluid' in $$props) $$invalidate(20, isFluid = $$new_props.isFluid);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*id*/ 128) {
    			$$invalidate(19, errorId = `error-${id}`);
    		}

    		if ($$self.$$.dirty[0] & /*id*/ 128) {
    			$$invalidate(18, warnId = `warn-${id}`);
    		}
    	};

    	$$invalidate(20, isFluid = !!ctx && ctx.isFluid);

    	return [
    		value,
    		ref,
    		size,
    		placeholder,
    		light,
    		disabled,
    		helperText,
    		id,
    		name,
    		labelText,
    		hideLabel,
    		invalid,
    		invalidText,
    		warn,
    		warnText,
    		required,
    		inline,
    		readonly,
    		warnId,
    		errorId,
    		isFluid,
    		onInput,
    		onChange,
    		$$restProps,
    		$$slots,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keydown_handler,
    		keyup_handler,
    		focus_handler,
    		blur_handler,
    		paste_handler,
    		input_binding,
    		input_input_handler
    	];
    }

    class TextInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$l,
    			create_fragment$l,
    			safe_not_equal,
    			{
    				size: 2,
    				value: 0,
    				placeholder: 3,
    				light: 4,
    				disabled: 5,
    				helperText: 6,
    				id: 7,
    				name: 8,
    				labelText: 9,
    				hideLabel: 10,
    				invalid: 11,
    				invalidText: 12,
    				warn: 13,
    				warnText: 14,
    				ref: 1,
    				required: 15,
    				inline: 16,
    				readonly: 17
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextInput",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get size() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get light() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideLabel() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideLabel(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalid() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalid(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get invalidText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set invalidText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warn() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warn(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get warnText() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set warnText(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get required() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set required(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inline() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TextInput$1 = TextInput;

    /* node_modules\carbon-components-svelte\src\Tile\Tile.svelte generated by Svelte v3.49.0 */

    const file$i = "node_modules\\carbon-components-svelte\\src\\Tile\\Tile.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	let div_levels = [/*$$restProps*/ ctx[1]];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "bx--tile", true);
    			toggle_class(div, "bx--tile--light", /*light*/ ctx[0]);
    			add_location(div, file$i, 6, 0, 156);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler*/ ctx[4], false, false, false),
    					listen_dev(div, "mouseover", /*mouseover_handler*/ ctx[5], false, false, false),
    					listen_dev(div, "mouseenter", /*mouseenter_handler*/ ctx[6], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]]));
    			toggle_class(div, "bx--tile", true);
    			toggle_class(div, "bx--tile--light", /*light*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	const omit_props_names = ["light"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tile', slots, ['default']);
    	let { light = false } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('light' in $$new_props) $$invalidate(0, light = $$new_props.light);
    		if ('$$scope' in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ light });

    	$$self.$inject_state = $$new_props => {
    		if ('light' in $$props) $$invalidate(0, light = $$new_props.light);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		light,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class Tile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { light: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tile",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get light() {
    		throw new Error("<Tile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set light(value) {
    		throw new Error("<Tile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Tile$1 = Tile;

    /* node_modules\carbon-components-svelte\src\icons\Menu.svelte generated by Svelte v3.49.0 */

    const file$h = "node_modules\\carbon-components-svelte\\src\\icons\\Menu.svelte";

    // (24:2) {#if title}
    function create_if_block$7(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[1]);
    			add_location(title_1, file$h, 23, 13, 549);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(24:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let svg;
    	let path;
    	let if_block = /*title*/ ctx[1] && create_if_block$7(ctx);

    	let svg_levels = [
    		{ xmlns: "http://www.w3.org/2000/svg" },
    		{ viewBox: "0 0 32 32" },
    		{ fill: "currentColor" },
    		{ preserveAspectRatio: "xMidYMid meet" },
    		{ width: /*size*/ ctx[0] },
    		{ height: /*size*/ ctx[0] },
    		/*attributes*/ ctx[2],
    		/*$$restProps*/ ctx[3]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			path = svg_element("path");
    			attr_dev(path, "d", "M4 6H28V8H4zM4 24H28V26H4zM4 12H28V14H4zM4 18H28V20H4z");
    			add_location(path, file$h, 24, 2, 579);
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$h, 13, 0, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(svg, path);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ xmlns: "http://www.w3.org/2000/svg" },
    				{ viewBox: "0 0 32 32" },
    				{ fill: "currentColor" },
    				{ preserveAspectRatio: "xMidYMid meet" },
    				dirty & /*size*/ 1 && { width: /*size*/ ctx[0] },
    				dirty & /*size*/ 1 && { height: /*size*/ ctx[0] },
    				dirty & /*attributes*/ 4 && /*attributes*/ ctx[2],
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let labelled;
    	let attributes;
    	const omit_props_names = ["size","title"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	let { size = 16 } = $$props;
    	let { title = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    	};

    	$$self.$capture_state = () => ({ size, title, labelled, attributes });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('size' in $$props) $$invalidate(0, size = $$new_props.size);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('labelled' in $$props) $$invalidate(4, labelled = $$new_props.labelled);
    		if ('attributes' in $$props) $$invalidate(2, attributes = $$new_props.attributes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(4, labelled = $$props["aria-label"] || $$props["aria-labelledby"] || title);

    		$$invalidate(2, attributes = {
    			"aria-hidden": labelled ? undefined : true,
    			role: labelled ? "img" : undefined,
    			focusable: Number($$props["tabindex"]) === 0 ? true : undefined
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [size, title, attributes, $$restProps, labelled];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { size: 0, title: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get size() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Menu$1 = Menu;

    const shouldRenderHamburgerMenu = writable(false);

    /* node_modules\carbon-components-svelte\src\UIShell\HamburgerMenu.svelte generated by Svelte v3.49.0 */
    const file$g = "node_modules\\carbon-components-svelte\\src\\UIShell\\HamburgerMenu.svelte";

    function create_fragment$i(ctx) {
    	let button;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;

    	var switch_value = /*isOpen*/ ctx[0]
    	? /*iconClose*/ ctx[4]
    	: /*iconMenu*/ ctx[3];

    	function switch_props(ctx) {
    		return { props: { size: 20 }, $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	let button_levels = [
    		{ type: "button" },
    		{ title: /*ariaLabel*/ ctx[2] },
    		{ "aria-label": /*ariaLabel*/ ctx[2] },
    		/*$$restProps*/ ctx[5]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			set_attributes(button, button_data);
    			toggle_class(button, "bx--header__action", true);
    			toggle_class(button, "bx--header__menu-trigger", true);
    			toggle_class(button, "bx--header__menu-toggle", true);
    			add_location(button, file$g, 31, 0, 758);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[7](button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(button, "click", /*click_handler_1*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (switch_value !== (switch_value = /*isOpen*/ ctx[0]
    			? /*iconClose*/ ctx[4]
    			: /*iconMenu*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, button, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				(!current || dirty & /*ariaLabel*/ 4) && { title: /*ariaLabel*/ ctx[2] },
    				(!current || dirty & /*ariaLabel*/ 4) && { "aria-label": /*ariaLabel*/ ctx[2] },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]
    			]));

    			toggle_class(button, "bx--header__action", true);
    			toggle_class(button, "bx--header__menu-trigger", true);
    			toggle_class(button, "bx--header__menu-toggle", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (switch_instance) destroy_component(switch_instance);
    			/*button_binding*/ ctx[7](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	const omit_props_names = ["ariaLabel","isOpen","iconMenu","iconClose","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HamburgerMenu', slots, []);
    	let { ariaLabel = undefined } = $$props;
    	let { isOpen = false } = $$props;
    	let { iconMenu = Menu$1 } = $$props;
    	let { iconClose = Close$1 } = $$props;
    	let { ref = null } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	const click_handler_1 = () => $$invalidate(0, isOpen = !isOpen);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('ariaLabel' in $$new_props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ('isOpen' in $$new_props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('iconMenu' in $$new_props) $$invalidate(3, iconMenu = $$new_props.iconMenu);
    		if ('iconClose' in $$new_props) $$invalidate(4, iconClose = $$new_props.iconClose);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({
    		ariaLabel,
    		isOpen,
    		iconMenu,
    		iconClose,
    		ref,
    		Close: Close$1,
    		Menu: Menu$1
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('ariaLabel' in $$props) $$invalidate(2, ariaLabel = $$new_props.ariaLabel);
    		if ('isOpen' in $$props) $$invalidate(0, isOpen = $$new_props.isOpen);
    		if ('iconMenu' in $$props) $$invalidate(3, iconMenu = $$new_props.iconMenu);
    		if ('iconClose' in $$props) $$invalidate(4, iconClose = $$new_props.iconClose);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isOpen,
    		ref,
    		ariaLabel,
    		iconMenu,
    		iconClose,
    		$$restProps,
    		click_handler,
    		button_binding,
    		click_handler_1
    	];
    }

    class HamburgerMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			ariaLabel: 2,
    			isOpen: 0,
    			iconMenu: 3,
    			iconClose: 4,
    			ref: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HamburgerMenu",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get ariaLabel() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOpen() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOpen(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconMenu() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconMenu(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconClose() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconClose(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<HamburgerMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<HamburgerMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var HamburgerMenu$1 = HamburgerMenu;

    /* node_modules\carbon-components-svelte\src\UIShell\Header.svelte generated by Svelte v3.49.0 */
    const file$f = "node_modules\\carbon-components-svelte\\src\\UIShell\\Header.svelte";
    const get_platform_slot_changes = dirty => ({});
    const get_platform_slot_context = ctx => ({});
    const get_skip_to_content_slot_changes = dirty => ({});
    const get_skip_to_content_slot_context = ctx => ({});

    // (83:2) {#if ($shouldRenderHamburgerMenu && winWidth < expansionBreakpoint) || persistentHamburgerMenu}
    function create_if_block_1$3(ctx) {
    	let hamburgermenu;
    	let updating_isOpen;
    	let current;

    	function hamburgermenu_isOpen_binding(value) {
    		/*hamburgermenu_isOpen_binding*/ ctx[19](value);
    	}

    	let hamburgermenu_props = {
    		iconClose: /*iconClose*/ ctx[8],
    		iconMenu: /*iconMenu*/ ctx[7]
    	};

    	if (/*isSideNavOpen*/ ctx[0] !== void 0) {
    		hamburgermenu_props.isOpen = /*isSideNavOpen*/ ctx[0];
    	}

    	hamburgermenu = new HamburgerMenu$1({
    			props: hamburgermenu_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(hamburgermenu, 'isOpen', hamburgermenu_isOpen_binding));

    	const block = {
    		c: function create() {
    			create_component(hamburgermenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hamburgermenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const hamburgermenu_changes = {};
    			if (dirty & /*iconClose*/ 256) hamburgermenu_changes.iconClose = /*iconClose*/ ctx[8];
    			if (dirty & /*iconMenu*/ 128) hamburgermenu_changes.iconMenu = /*iconMenu*/ ctx[7];

    			if (!updating_isOpen && dirty & /*isSideNavOpen*/ 1) {
    				updating_isOpen = true;
    				hamburgermenu_changes.isOpen = /*isSideNavOpen*/ ctx[0];
    				add_flush_callback(() => updating_isOpen = false);
    			}

    			hamburgermenu.$set(hamburgermenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hamburgermenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hamburgermenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hamburgermenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(83:2) {#if ($shouldRenderHamburgerMenu && winWidth < expansionBreakpoint) || persistentHamburgerMenu}",
    		ctx
    	});

    	return block;
    }

    // (97:4) {#if company}
    function create_if_block$6(ctx) {
    	let span;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(/*company*/ ctx[3]);
    			t1 = text(" ");
    			toggle_class(span, "bx--header__name--prefix", true);
    			add_location(span, file$f, 97, 6, 2527);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*company*/ 8) set_data_dev(t0, /*company*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(97:4) {#if company}",
    		ctx
    	});

    	return block;
    }

    // (100:26) {platformName}
    function fallback_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*platformName*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*platformName*/ 16) set_data_dev(t, /*platformName*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(100:26) {platformName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let header;
    	let t0;
    	let t1;
    	let a;
    	let t2;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[18]);
    	const skip_to_content_slot_template = /*#slots*/ ctx[16]["skip-to-content"];
    	const skip_to_content_slot = create_slot(skip_to_content_slot_template, ctx, /*$$scope*/ ctx[15], get_skip_to_content_slot_context);
    	let if_block0 = (/*$shouldRenderHamburgerMenu*/ ctx[11] && /*winWidth*/ ctx[9] < /*expansionBreakpoint*/ ctx[6] || /*persistentHamburgerMenu*/ ctx[5]) && create_if_block_1$3(ctx);
    	let if_block1 = /*company*/ ctx[3] && create_if_block$6(ctx);
    	const platform_slot_template = /*#slots*/ ctx[16].platform;
    	const platform_slot = create_slot(platform_slot_template, ctx, /*$$scope*/ ctx[15], get_platform_slot_context);
    	const platform_slot_or_fallback = platform_slot || fallback_block$1(ctx);
    	let a_levels = [{ href: /*href*/ ctx[2] }, /*$$restProps*/ ctx[12]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const default_slot_template = /*#slots*/ ctx[16].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	const block = {
    		c: function create() {
    			header = element("header");
    			if (skip_to_content_slot) skip_to_content_slot.c();
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			a = element("a");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (platform_slot_or_fallback) platform_slot_or_fallback.c();
    			t3 = space();
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--header__name", true);
    			add_location(a, file$f, 89, 2, 2386);
    			attr_dev(header, "aria-label", /*ariaLabel*/ ctx[10]);
    			toggle_class(header, "bx--header", true);
    			add_location(header, file$f, 80, 0, 2064);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);

    			if (skip_to_content_slot) {
    				skip_to_content_slot.m(header, null);
    			}

    			append_dev(header, t0);
    			if (if_block0) if_block0.m(header, null);
    			append_dev(header, t1);
    			append_dev(header, a);
    			if (if_block1) if_block1.m(a, null);
    			append_dev(a, t2);

    			if (platform_slot_or_fallback) {
    				platform_slot_or_fallback.m(a, null);
    			}

    			/*a_binding*/ ctx[20](a);
    			append_dev(header, t3);

    			if (default_slot) {
    				default_slot.m(header, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "resize", /*onwindowresize*/ ctx[18]),
    					listen_dev(a, "click", /*click_handler*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (skip_to_content_slot) {
    				if (skip_to_content_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						skip_to_content_slot,
    						skip_to_content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(skip_to_content_slot_template, /*$$scope*/ ctx[15], dirty, get_skip_to_content_slot_changes),
    						get_skip_to_content_slot_context
    					);
    				}
    			}

    			if (/*$shouldRenderHamburgerMenu*/ ctx[11] && /*winWidth*/ ctx[9] < /*expansionBreakpoint*/ ctx[6] || /*persistentHamburgerMenu*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$shouldRenderHamburgerMenu, winWidth, expansionBreakpoint, persistentHamburgerMenu*/ 2656) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(header, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*company*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					if_block1.m(a, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (platform_slot) {
    				if (platform_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						platform_slot,
    						platform_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(platform_slot_template, /*$$scope*/ ctx[15], dirty, get_platform_slot_changes),
    						get_platform_slot_context
    					);
    				}
    			} else {
    				if (platform_slot_or_fallback && platform_slot_or_fallback.p && (!current || dirty & /*platformName*/ 16)) {
    					platform_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 4) && { href: /*href*/ ctx[2] },
    				dirty & /*$$restProps*/ 4096 && /*$$restProps*/ ctx[12]
    			]));

    			toggle_class(a, "bx--header__name", true);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[15],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[15])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[15], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*ariaLabel*/ 1024) {
    				attr_dev(header, "aria-label", /*ariaLabel*/ ctx[10]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skip_to_content_slot, local);
    			transition_in(if_block0);
    			transition_in(platform_slot_or_fallback, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skip_to_content_slot, local);
    			transition_out(if_block0);
    			transition_out(platform_slot_or_fallback, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (skip_to_content_slot) skip_to_content_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (platform_slot_or_fallback) platform_slot_or_fallback.d(detaching);
    			/*a_binding*/ ctx[20](null);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let ariaLabel;

    	const omit_props_names = [
    		"expandedByDefault","isSideNavOpen","uiShellAriaLabel","href","company","platformName","persistentHamburgerMenu","expansionBreakpoint","ref","iconMenu","iconClose"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $shouldRenderHamburgerMenu;
    	validate_store(shouldRenderHamburgerMenu, 'shouldRenderHamburgerMenu');
    	component_subscribe($$self, shouldRenderHamburgerMenu, $$value => $$invalidate(11, $shouldRenderHamburgerMenu = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, ['skip-to-content','platform','default']);
    	let { expandedByDefault = true } = $$props;
    	let { isSideNavOpen = false } = $$props;
    	let { uiShellAriaLabel = undefined } = $$props;
    	let { href = undefined } = $$props;
    	let { company = undefined } = $$props;
    	let { platformName = "" } = $$props;
    	let { persistentHamburgerMenu = false } = $$props;
    	let { expansionBreakpoint = 1056 } = $$props;
    	let { ref = null } = $$props;
    	let { iconMenu = Menu$1 } = $$props;
    	let { iconClose = Close$1 } = $$props;
    	let winWidth = undefined;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function onwindowresize() {
    		$$invalidate(9, winWidth = window.innerWidth);
    	}

    	function hamburgermenu_isOpen_binding(value) {
    		isSideNavOpen = value;
    		(((($$invalidate(0, isSideNavOpen), $$invalidate(13, expandedByDefault)), $$invalidate(9, winWidth)), $$invalidate(6, expansionBreakpoint)), $$invalidate(5, persistentHamburgerMenu));
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(1, ref);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(21, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('expandedByDefault' in $$new_props) $$invalidate(13, expandedByDefault = $$new_props.expandedByDefault);
    		if ('isSideNavOpen' in $$new_props) $$invalidate(0, isSideNavOpen = $$new_props.isSideNavOpen);
    		if ('uiShellAriaLabel' in $$new_props) $$invalidate(14, uiShellAriaLabel = $$new_props.uiShellAriaLabel);
    		if ('href' in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ('company' in $$new_props) $$invalidate(3, company = $$new_props.company);
    		if ('platformName' in $$new_props) $$invalidate(4, platformName = $$new_props.platformName);
    		if ('persistentHamburgerMenu' in $$new_props) $$invalidate(5, persistentHamburgerMenu = $$new_props.persistentHamburgerMenu);
    		if ('expansionBreakpoint' in $$new_props) $$invalidate(6, expansionBreakpoint = $$new_props.expansionBreakpoint);
    		if ('ref' in $$new_props) $$invalidate(1, ref = $$new_props.ref);
    		if ('iconMenu' in $$new_props) $$invalidate(7, iconMenu = $$new_props.iconMenu);
    		if ('iconClose' in $$new_props) $$invalidate(8, iconClose = $$new_props.iconClose);
    		if ('$$scope' in $$new_props) $$invalidate(15, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		expandedByDefault,
    		isSideNavOpen,
    		uiShellAriaLabel,
    		href,
    		company,
    		platformName,
    		persistentHamburgerMenu,
    		expansionBreakpoint,
    		ref,
    		iconMenu,
    		iconClose,
    		Close: Close$1,
    		Menu: Menu$1,
    		shouldRenderHamburgerMenu,
    		HamburgerMenu: HamburgerMenu$1,
    		winWidth,
    		ariaLabel,
    		$shouldRenderHamburgerMenu
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(21, $$props = assign(assign({}, $$props), $$new_props));
    		if ('expandedByDefault' in $$props) $$invalidate(13, expandedByDefault = $$new_props.expandedByDefault);
    		if ('isSideNavOpen' in $$props) $$invalidate(0, isSideNavOpen = $$new_props.isSideNavOpen);
    		if ('uiShellAriaLabel' in $$props) $$invalidate(14, uiShellAriaLabel = $$new_props.uiShellAriaLabel);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    		if ('company' in $$props) $$invalidate(3, company = $$new_props.company);
    		if ('platformName' in $$props) $$invalidate(4, platformName = $$new_props.platformName);
    		if ('persistentHamburgerMenu' in $$props) $$invalidate(5, persistentHamburgerMenu = $$new_props.persistentHamburgerMenu);
    		if ('expansionBreakpoint' in $$props) $$invalidate(6, expansionBreakpoint = $$new_props.expansionBreakpoint);
    		if ('ref' in $$props) $$invalidate(1, ref = $$new_props.ref);
    		if ('iconMenu' in $$props) $$invalidate(7, iconMenu = $$new_props.iconMenu);
    		if ('iconClose' in $$props) $$invalidate(8, iconClose = $$new_props.iconClose);
    		if ('winWidth' in $$props) $$invalidate(9, winWidth = $$new_props.winWidth);
    		if ('ariaLabel' in $$props) $$invalidate(10, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*expandedByDefault, winWidth, expansionBreakpoint, persistentHamburgerMenu*/ 8800) {
    			$$invalidate(0, isSideNavOpen = expandedByDefault && winWidth >= expansionBreakpoint && !persistentHamburgerMenu);
    		}

    		$$invalidate(10, ariaLabel = company
    		? `${company} `
    		: "" + (uiShellAriaLabel || $$props["aria-label"] || platformName));
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		isSideNavOpen,
    		ref,
    		href,
    		company,
    		platformName,
    		persistentHamburgerMenu,
    		expansionBreakpoint,
    		iconMenu,
    		iconClose,
    		winWidth,
    		ariaLabel,
    		$shouldRenderHamburgerMenu,
    		$$restProps,
    		expandedByDefault,
    		uiShellAriaLabel,
    		$$scope,
    		slots,
    		click_handler,
    		onwindowresize,
    		hamburgermenu_isOpen_binding,
    		a_binding
    	];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			expandedByDefault: 13,
    			isSideNavOpen: 0,
    			uiShellAriaLabel: 14,
    			href: 2,
    			company: 3,
    			platformName: 4,
    			persistentHamburgerMenu: 5,
    			expansionBreakpoint: 6,
    			ref: 1,
    			iconMenu: 7,
    			iconClose: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get expandedByDefault() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expandedByDefault(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSideNavOpen() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSideNavOpen(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uiShellAriaLabel() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uiShellAriaLabel(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get company() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set company(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get platformName() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set platformName(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get persistentHamburgerMenu() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set persistentHamburgerMenu(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expansionBreakpoint() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expansionBreakpoint(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconMenu() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconMenu(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconClose() {
    		throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconClose(value) {
    		throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Header$1 = Header;

    /* node_modules\carbon-components-svelte\src\UIShell\HeaderNav.svelte generated by Svelte v3.49.0 */

    const file$e = "node_modules\\carbon-components-svelte\\src\\UIShell\\HeaderNav.svelte";

    function create_fragment$g(ctx) {
    	let nav;
    	let ul;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	let ul_levels = [/*props*/ ctx[0], { role: "menubar" }];
    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	let nav_levels = [/*props*/ ctx[0], /*$$restProps*/ ctx[1]];
    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			toggle_class(ul, "bx--header__menu-bar", true);
    			add_location(ul, file$e, 8, 2, 199);
    			set_attributes(nav, nav_data);
    			toggle_class(nav, "bx--header__nav", true);
    			add_location(nav, file$e, 7, 0, 132);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [dirty & /*props*/ 1 && /*props*/ ctx[0], { role: "menubar" }]));
    			toggle_class(ul, "bx--header__menu-bar", true);

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*props*/ 1 && /*props*/ ctx[0],
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]
    			]));

    			toggle_class(nav, "bx--header__nav", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let props;
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HeaderNav', slots, ['default']);

    	$$self.$$set = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ props });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
    		if ('props' in $$props) $$invalidate(0, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(0, props = {
    			"aria-label": $$props["aria-label"],
    			"aria-labelledby": $$props["aria-labelledby"]
    		});
    	};

    	$$props = exclude_internal_props($$props);
    	return [props, $$restProps, $$scope, slots];
    }

    class HeaderNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeaderNav",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    var HeaderNav$1 = HeaderNav;

    /* node_modules\carbon-components-svelte\src\UIShell\HeaderNavItem.svelte generated by Svelte v3.49.0 */
    const file$d = "node_modules\\carbon-components-svelte\\src\\UIShell\\HeaderNavItem.svelte";

    function create_fragment$f(ctx) {
    	let li;
    	let a;
    	let span;
    	let t;
    	let a_rel_value;
    	let a_aria_current_value;
    	let mounted;
    	let dispose;

    	let a_levels = [
    		{ role: "menuitem" },
    		{ tabindex: "0" },
    		{ href: /*href*/ ctx[1] },
    		{
    			rel: a_rel_value = /*$$restProps*/ ctx[7].target === '_blank'
    			? 'noopener noreferrer'
    			: undefined
    		},
    		{
    			"aria-current": a_aria_current_value = /*isSelected*/ ctx[3] ? 'page' : undefined
    		},
    		/*$$restProps*/ ctx[7]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			span = element("span");
    			t = text(/*text*/ ctx[2]);
    			toggle_class(span, "bx--text-truncate--end", true);
    			add_location(span, file$d, 63, 4, 1382);
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--header__menu-item", true);
    			add_location(a, file$d, 40, 2, 844);
    			attr_dev(li, "role", "none");
    			add_location(li, file$d, 39, 0, 825);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, span);
    			append_dev(span, t);
    			/*a_binding*/ ctx[16](a);

    			if (!mounted) {
    				dispose = [
    					listen_dev(a, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(a, "mouseover", /*mouseover_handler*/ ctx[9], false, false, false),
    					listen_dev(a, "mouseenter", /*mouseenter_handler*/ ctx[10], false, false, false),
    					listen_dev(a, "mouseleave", /*mouseleave_handler*/ ctx[11], false, false, false),
    					listen_dev(a, "keyup", /*keyup_handler*/ ctx[12], false, false, false),
    					listen_dev(a, "keydown", /*keydown_handler*/ ctx[13], false, false, false),
    					listen_dev(a, "focus", /*focus_handler*/ ctx[14], false, false, false),
    					listen_dev(a, "blur", /*blur_handler*/ ctx[15], false, false, false),
    					listen_dev(a, "blur", /*blur_handler_1*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 4) set_data_dev(t, /*text*/ ctx[2]);

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				{ role: "menuitem" },
    				{ tabindex: "0" },
    				dirty & /*href*/ 2 && { href: /*href*/ ctx[1] },
    				dirty & /*$$restProps*/ 128 && a_rel_value !== (a_rel_value = /*$$restProps*/ ctx[7].target === '_blank'
    				? 'noopener noreferrer'
    				: undefined) && { rel: a_rel_value },
    				dirty & /*isSelected*/ 8 && a_aria_current_value !== (a_aria_current_value = /*isSelected*/ ctx[3] ? 'page' : undefined) && { "aria-current": a_aria_current_value },
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7]
    			]));

    			toggle_class(a, "bx--header__menu-item", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			/*a_binding*/ ctx[16](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","text","isSelected","ref"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HeaderNavItem', slots, []);
    	let { href = undefined } = $$props;
    	let { text = undefined } = $$props;
    	let { isSelected = false } = $$props;
    	let { ref = null } = $$props;
    	const id = "ccs-" + Math.random().toString(36);
    	const ctx = getContext("HeaderNavMenu");
    	let selectedItemIds = [];

    	const unsubSelectedItems = ctx?.selectedItems.subscribe(_selectedItems => {
    		$$invalidate(4, selectedItemIds = Object.keys(_selectedItems));
    	});

    	onMount(() => {
    		return () => {
    			if (unsubSelectedItems) unsubSelectedItems();
    		};
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ref = $$value;
    			$$invalidate(0, ref);
    		});
    	}

    	const blur_handler_1 = () => {
    		if (selectedItemIds.indexOf(id) === selectedItemIds.length - 1) {
    			ctx?.closeMenu();
    		}
    	};

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('href' in $$new_props) $$invalidate(1, href = $$new_props.href);
    		if ('text' in $$new_props) $$invalidate(2, text = $$new_props.text);
    		if ('isSelected' in $$new_props) $$invalidate(3, isSelected = $$new_props.isSelected);
    		if ('ref' in $$new_props) $$invalidate(0, ref = $$new_props.ref);
    	};

    	$$self.$capture_state = () => ({
    		href,
    		text,
    		isSelected,
    		ref,
    		getContext,
    		onMount,
    		id,
    		ctx,
    		selectedItemIds,
    		unsubSelectedItems
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('href' in $$props) $$invalidate(1, href = $$new_props.href);
    		if ('text' in $$props) $$invalidate(2, text = $$new_props.text);
    		if ('isSelected' in $$props) $$invalidate(3, isSelected = $$new_props.isSelected);
    		if ('ref' in $$props) $$invalidate(0, ref = $$new_props.ref);
    		if ('selectedItemIds' in $$props) $$invalidate(4, selectedItemIds = $$new_props.selectedItemIds);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isSelected*/ 8) {
    			ctx?.updateSelectedItems({ id, isSelected });
    		}
    	};

    	return [
    		ref,
    		href,
    		text,
    		isSelected,
    		selectedItemIds,
    		id,
    		ctx,
    		$$restProps,
    		click_handler,
    		mouseover_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keyup_handler,
    		keydown_handler,
    		focus_handler,
    		blur_handler,
    		a_binding,
    		blur_handler_1
    	];
    }

    class HeaderNavItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { href: 1, text: 2, isSelected: 3, ref: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HeaderNavItem",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get href() {
    		throw new Error("<HeaderNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<HeaderNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<HeaderNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<HeaderNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelected() {
    		throw new Error("<HeaderNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelected(value) {
    		throw new Error("<HeaderNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<HeaderNavItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<HeaderNavItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var HeaderNavItem$1 = HeaderNavItem;

    /* node_modules\carbon-components-svelte\src\UIShell\Content.svelte generated by Svelte v3.49.0 */

    const file$c = "node_modules\\carbon-components-svelte\\src\\UIShell\\Content.svelte";

    function create_fragment$e(ctx) {
    	let main;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);
    	let main_levels = [{ id: /*id*/ ctx[0] }, /*$$restProps*/ ctx[1]];
    	let main_data = {};

    	for (let i = 0; i < main_levels.length; i += 1) {
    		main_data = assign(main_data, main_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (default_slot) default_slot.c();
    			set_attributes(main, main_data);
    			toggle_class(main, "bx--content", true);
    			add_location(main, file$c, 5, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(main, main_data = get_spread_update(main_levels, [
    				(!current || dirty & /*id*/ 1) && { id: /*id*/ ctx[0] },
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1]
    			]));

    			toggle_class(main, "bx--content", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	const omit_props_names = ["id"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Content', slots, ['default']);
    	let { id = "main-content" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('id' in $$new_props) $$invalidate(0, id = $$new_props.id);
    		if ('$$scope' in $$new_props) $$invalidate(2, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ id });

    	$$self.$inject_state = $$new_props => {
    		if ('id' in $$props) $$invalidate(0, id = $$new_props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, $$restProps, $$scope, slots];
    }

    class Content extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Content",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get id() {
    		throw new Error("<Content>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Content>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Content$1 = Content;

    /* node_modules\carbon-components-svelte\src\UIShell\SkipToContent.svelte generated by Svelte v3.49.0 */

    const file$b = "node_modules\\carbon-components-svelte\\src\\UIShell\\SkipToContent.svelte";

    // (16:8) Skip to main content
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Skip to main content");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(16:8) Skip to main content",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ tabindex: /*tabindex*/ ctx[1] },
    		/*$$restProps*/ ctx[2]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(a, a_data);
    			toggle_class(a, "bx--skip-to-content", true);
    			add_location(a, file$b, 8, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*tabindex*/ 2) && { tabindex: /*tabindex*/ ctx[1] },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));

    			toggle_class(a, "bx--skip-to-content", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","tabindex"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SkipToContent', slots, ['default']);
    	let { href = "#main-content" } = $$props;
    	let { tabindex = "0" } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('href' in $$new_props) $$invalidate(0, href = $$new_props.href);
    		if ('tabindex' in $$new_props) $$invalidate(1, tabindex = $$new_props.tabindex);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ href, tabindex });

    	$$self.$inject_state = $$new_props => {
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('tabindex' in $$props) $$invalidate(1, tabindex = $$new_props.tabindex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [href, tabindex, $$restProps, $$scope, slots, click_handler];
    }

    class SkipToContent extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { href: 0, tabindex: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SkipToContent",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get href() {
    		throw new Error("<SkipToContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<SkipToContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tabindex() {
    		throw new Error("<SkipToContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tabindex(value) {
    		throw new Error("<SkipToContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SkipToContent$1 = SkipToContent;

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var ApiRequest_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ApiRequest = void 0;
    class ApiRequest {
        constructor(method, path, parameters, body) {
            this.method = method;
            this.path = path;
            this.parameters = parameters;
            this.body = body;
        }
        getUrl(basePath) {
            this.url = basePath;
            let path = `${this.url}${this.path}`;
            if (this.parameters)
                path += this.parameters.toString();
            return path;
        }
    }
    exports.ApiRequest = ApiRequest;
    });

    var AnalyzerClient_1 = createCommonjsModule(function (module, exports) {
    var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AnalyzerClient = void 0;

    const FIND_ALL_ROUTE = "api/analyzers?";
    const FIND_BY_TECHNOLOGIES_ROUTE = "api/analyzers/technologies?";
    class AnalyzerClient {
        constructor(client) {
            this.client = client;
        }
        list(page, limit) {
            return __awaiter(this, void 0, void 0, function* () {
                const request = new ApiRequest_1.ApiRequest("GET", FIND_ALL_ROUTE, new URLSearchParams({ "page": page.toString(), "limit": limit.toString() }));
                const response = yield this.client.sendRequest(request);
                if (response.success)
                    return response.data;
                throw `Error: ${response.error}`;
            });
        }
        findByTechnologies(technologies) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!technologies || !technologies.length) {
                    throw 'At least one technology code must be defined.';
                }
                const request = new ApiRequest_1.ApiRequest("GET", FIND_BY_TECHNOLOGIES_ROUTE, new URLSearchParams(technologies.map(t => ['code', t])));
                const response = yield this.client.sendRequest(request);
                if (response.success)
                    return response.data;
                throw `Error: ${response.error}`;
            });
        }
    }
    exports.AnalyzerClient = AnalyzerClient;
    });

    var PackageClient_1 = createCommonjsModule(function (module, exports) {
    var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PackageClient = void 0;

    const FIND_ALL_ROUTE = "api/packages?";
    class PackageClient {
        constructor(client) {
            this.client = client;
        }
        list(page, limit) {
            return __awaiter(this, void 0, void 0, function* () {
                const request = new ApiRequest_1.ApiRequest("GET", FIND_ALL_ROUTE, new URLSearchParams({ "page": page.toString(), "limit": limit.toString() }));
                const response = yield this.client.sendRequest(request);
                if (response.success)
                    return response.data;
                throw `Error: ${response.error}`;
            });
        }
    }
    exports.PackageClient = PackageClient;
    });

    var ProjectClient_1 = createCommonjsModule(function (module, exports) {
    var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectClient = void 0;

    const FIND_ALL_ROUTE = "api/projects";
    const FIND_PROJECT_ROUTE = "api/projects/";
    const CREATE_PROJECT_ROUTE = "api/projects";
    class ProjectClient {
        constructor(client) {
            this.client = client;
        }
        list(page, limit) {
            return __awaiter(this, void 0, void 0, function* () {
                const request = new ApiRequest_1.ApiRequest("GET", FIND_ALL_ROUTE);
                const response = yield this.client.sendRequest(request);
                if (response.success)
                    return response.data;
                throw `Error: ${response.error}`;
            });
        }
        findProject(name, source) {
            return __awaiter(this, void 0, void 0, function* () {
                const request = new ApiRequest_1.ApiRequest("GET", FIND_PROJECT_ROUTE + `${source}/${name}`);
                const response = yield this.client.sendRequest(request);
                if (response.success)
                    return response.data;
                throw `Error: ${response.error}`;
            });
        }
        createProject(uri) {
            return __awaiter(this, void 0, void 0, function* () {
                const request = new ApiRequest_1.ApiRequest("POST", CREATE_PROJECT_ROUTE);
                request.body = { uri: uri };
                const response = yield this.client.sendRequest(request);
                if (response.success)
                    return response.data;
                throw `Error: ${response.error}`;
            });
        }
    }
    exports.ProjectClient = ProjectClient;
    });

    var ScanClient_1 = createCommonjsModule(function (module, exports) {
    var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScanClient = void 0;

    const FIND_ALL_ROUTE = "api/scans";
    class ScanClient {
        constructor(client) {
            this.client = client;
        }
        findAll() {
            return __awaiter(this, void 0, void 0, function* () {
                const request = new ApiRequest_1.ApiRequest("GET", FIND_ALL_ROUTE);
                const response = yield this.client.sendRequest(request);
                if (response.success)
                    return response.data;
                throw `Error: ${response.error}`;
            });
        }
    }
    exports.ScanClient = ScanClient;
    });

    var browserPonyfill = createCommonjsModule(function (module, exports) {
    var global = typeof self !== 'undefined' ? self : commonjsGlobal;
    var __self__ = (function () {
    function F() {
    this.fetch = false;
    this.DOMException = global.DOMException;
    }
    F.prototype = global;
    return new F();
    })();
    (function(self) {

    ((function (exports) {

      var support = {
        searchParams: 'URLSearchParams' in self,
        iterable: 'Symbol' in self && 'iterator' in Symbol,
        blob:
          'FileReader' in self &&
          'Blob' in self &&
          (function() {
            try {
              new Blob();
              return true
            } catch (e) {
              return false
            }
          })(),
        formData: 'FormData' in self,
        arrayBuffer: 'ArrayBuffer' in self
      };

      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj)
      }

      if (support.arrayBuffer) {
        var viewClasses = [
          '[object Int8Array]',
          '[object Uint8Array]',
          '[object Uint8ClampedArray]',
          '[object Int16Array]',
          '[object Uint16Array]',
          '[object Int32Array]',
          '[object Uint32Array]',
          '[object Float32Array]',
          '[object Float64Array]'
        ];

        var isArrayBufferView =
          ArrayBuffer.isView ||
          function(obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
          };
      }

      function normalizeName(name) {
        if (typeof name !== 'string') {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
          throw new TypeError('Invalid character in header field name')
        }
        return name.toLowerCase()
      }

      function normalizeValue(value) {
        if (typeof value !== 'string') {
          value = String(value);
        }
        return value
      }

      // Build a destructive iterator for the value list
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return {done: value === undefined, value: value}
          }
        };

        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator
          };
        }

        return iterator
      }

      function Headers(headers) {
        this.map = {};

        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }

      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ', ' + value : value;
      };

      Headers.prototype['delete'] = function(name) {
        delete this.map[normalizeName(name)];
      };

      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null
      };

      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name))
      };

      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };

      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };

      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items)
      };

      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items)
      };

      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items)
      };

      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }

      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError('Already read'))
        }
        body.bodyUsed = true;
      }

      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        })
      }

      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise
      }

      function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise
      }

      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);

        for (var i = 0; i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join('')
      }

      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0)
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer
        }
      }

      function Body() {
        this.bodyUsed = false;

        this._initBody = function(body) {
          this._bodyInit = body;
          if (!body) {
            this._bodyText = '';
          } else if (typeof body === 'string') {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            // IE 10-11 can't handle a DataView body.
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }

          if (!this.headers.get('content-type')) {
            if (typeof body === 'string') {
              this.headers.set('content-type', 'text/plain;charset=UTF-8');
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set('content-type', this._bodyBlob.type);
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
          }
        };

        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected
            }

            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob)
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]))
            } else if (this._bodyFormData) {
              throw new Error('could not read FormData body as blob')
            } else {
              return Promise.resolve(new Blob([this._bodyText]))
            }
          };

          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
            } else {
              return this.blob().then(readBlobAsArrayBuffer)
            }
          };
        }

        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected
          }

          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob)
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
          } else if (this._bodyFormData) {
            throw new Error('could not read FormData body as text')
          } else {
            return Promise.resolve(this._bodyText)
          }
        };

        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode)
          };
        }

        this.json = function() {
          return this.text().then(JSON.parse)
        };

        return this
      }

      // HTTP methods whose capitalization should be normalized
      var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method
      }

      function Request(input, options) {
        options = options || {};
        var body = options.body;

        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError('Already read')
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit != null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }

        this.credentials = options.credentials || this.credentials || 'same-origin';
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || 'GET');
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;

        if ((this.method === 'GET' || this.method === 'HEAD') && body) {
          throw new TypeError('Body not allowed for GET or HEAD requests')
        }
        this._initBody(body);
      }

      Request.prototype.clone = function() {
        return new Request(this, {body: this._bodyInit})
      };

      function decode(body) {
        var form = new FormData();
        body
          .trim()
          .split('&')
          .forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split('=');
              var name = split.shift().replace(/\+/g, ' ');
              var value = split.join('=').replace(/\+/g, ' ');
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
        return form
      }

      function parseHeaders(rawHeaders) {
        var headers = new Headers();
        // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
        // https://tools.ietf.org/html/rfc7230#section-3.2
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
        preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
          var parts = line.split(':');
          var key = parts.shift().trim();
          if (key) {
            var value = parts.join(':').trim();
            headers.append(key, value);
          }
        });
        return headers
      }

      Body.call(Request.prototype);

      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }

        this.type = 'default';
        this.status = options.status === undefined ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = 'statusText' in options ? options.statusText : 'OK';
        this.headers = new Headers(options.headers);
        this.url = options.url || '';
        this._initBody(bodyInit);
      }

      Body.call(Response.prototype);

      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        })
      };

      Response.error = function() {
        var response = new Response(null, {status: 0, statusText: ''});
        response.type = 'error';
        return response
      };

      var redirectStatuses = [301, 302, 303, 307, 308];

      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError('Invalid status code')
        }

        return new Response(null, {status: status, headers: {location: url}})
      };

      exports.DOMException = self.DOMException;
      try {
        new exports.DOMException();
      } catch (err) {
        exports.DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        exports.DOMException.prototype = Object.create(Error.prototype);
        exports.DOMException.prototype.constructor = exports.DOMException;
      }

      function fetch(input, init) {
        return new Promise(function(resolve, reject) {
          var request = new Request(input, init);

          if (request.signal && request.signal.aborted) {
            return reject(new exports.DOMException('Aborted', 'AbortError'))
          }

          var xhr = new XMLHttpRequest();

          function abortXhr() {
            xhr.abort();
          }

          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || '')
            };
            options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
            var body = 'response' in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, options));
          };

          xhr.onerror = function() {
            reject(new TypeError('Network request failed'));
          };

          xhr.ontimeout = function() {
            reject(new TypeError('Network request failed'));
          };

          xhr.onabort = function() {
            reject(new exports.DOMException('Aborted', 'AbortError'));
          };

          xhr.open(request.method, request.url, true);

          if (request.credentials === 'include') {
            xhr.withCredentials = true;
          } else if (request.credentials === 'omit') {
            xhr.withCredentials = false;
          }

          if ('responseType' in xhr && support.blob) {
            xhr.responseType = 'blob';
          }

          request.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });

          if (request.signal) {
            request.signal.addEventListener('abort', abortXhr);

            xhr.onreadystatechange = function() {
              // DONE (success or failure)
              if (xhr.readyState === 4) {
                request.signal.removeEventListener('abort', abortXhr);
              }
            };
          }

          xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
        })
      }

      fetch.polyfill = true;

      if (!self.fetch) {
        self.fetch = fetch;
        self.Headers = Headers;
        self.Request = Request;
        self.Response = Response;
      }

      exports.Headers = Headers;
      exports.Request = Request;
      exports.Response = Response;
      exports.fetch = fetch;

      Object.defineProperty(exports, '__esModule', { value: true });

      return exports;

    }))({});
    })(__self__);
    __self__.fetch.ponyfill = true;
    // Remove "polyfill" property added by whatwg-fetch
    delete __self__.fetch.polyfill;
    // Choose between native implementation (global) or custom implementation (__self__)
    // var ctx = global.fetch ? global : __self__;
    var ctx = __self__; // this line disable service worker support temporarily
    exports = ctx.fetch; // To enable: import fetch from 'cross-fetch'
    exports.default = ctx.fetch; // For TypeScript consumers without esModuleInterop.
    exports.fetch = ctx.fetch; // To enable: import {fetch} from 'cross-fetch'
    exports.Headers = ctx.Headers;
    exports.Request = ctx.Request;
    exports.Response = ctx.Response;
    module.exports = exports;
    });

    var ApiError_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ApiError = void 0;
    class ApiError {
        constructor(message, status) {
            this.message = message;
            this.status = status;
        }
    }
    exports.ApiError = ApiError;
    });

    var ApiResponse_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SocketResponse = exports.ApiResponse = void 0;
    /**
     *
     */
    class ApiResponse {
        constructor() {
            this.success = !this.error;
        }
    }
    exports.ApiResponse = ApiResponse;
    /**
     *
     */
    class SocketResponse {
        constructor() {
            this.success = !this.error;
        }
    }
    exports.SocketResponse = SocketResponse;
    });

    var ApiClient_1 = createCommonjsModule(function (module, exports) {
    var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ApiClient = void 0;
    const cross_fetch_1 = __importDefault(browserPonyfill);


    class ApiClient {
        constructor(basePath) {
            this.basePath = basePath;
        }
        sendRequest(apiRequest) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = new ApiResponse_1.ApiResponse();
                response.request = apiRequest;
                try {
                    console.log(apiRequest.getUrl(this.basePath));
                    const result = yield (0, cross_fetch_1.default)(apiRequest.getUrl(this.basePath), {
                        method: apiRequest.method,
                        body: apiRequest.body ? JSON.stringify(apiRequest.body) : null,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!result.ok) {
                        throw new Error(result.statusText);
                    }
                    const jsonBody = yield result.json();
                    response.data = jsonBody;
                    return response;
                }
                catch (err) {
                    response.error = new ApiError_1.ApiError(err.message);
                    return response;
                }
            });
        }
    }
    exports.ApiClient = ApiClient;
    });

    var RestClient_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RestClient = void 0;





    class RestClient {
        constructor(options) {
            this.apiClient = new ApiClient_1.ApiClient(options.apiUrl);
            this.analyzer = new AnalyzerClient_1.AnalyzerClient(this.apiClient);
            this.project = new ProjectClient_1.ProjectClient(this.apiClient);
            this.package = new PackageClient_1.PackageClient(this.apiClient);
            this.scan = new ScanClient_1.ScanClient(this.apiClient);
        }
    }
    exports.RestClient = RestClient;
    });

    var ProjectSource_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectSource = void 0;
    (function (ProjectSource) {
        ProjectSource["LOCAL"] = "local";
        ProjectSource["GIT"] = "git";
        ProjectSource["GITHUB"] = "github";
        ProjectSource["GITLAB"] = "gitlab";
        ProjectSource["BITBUCKET"] = "bitbucket";
    })(exports.ProjectSource || (exports.ProjectSource = {}));
    });

    var uri = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extractProjectSource = exports.GITLAB_URI_REGEX = exports.GITHUB_URI_REGEX = void 0;

    exports.GITHUB_URI_REGEX = RegExp("(http(s)?)(:(//)?)(github.com/)([-_a-zA-Z0-9.]*)(/)([-_a-zA-Z0-9.]*)(/)?");
    exports.GITLAB_URI_REGEX = RegExp("(http(s)?)(:(//)?)(gitlab.com/)([a-zA-Z0-9.]*)(/)([a-zA-Z0-9.]*)(/)?");
    function extractProjectSource(uri) {
        const match_github = exports.GITHUB_URI_REGEX.exec(uri);
        if (match_github) {
            return {
                name: `${match_github[6]}/${match_github[8]}`,
                source: ProjectSource_1.ProjectSource.GITHUB
            };
        }
        const match_gitlab = exports.GITLAB_URI_REGEX.exec(uri);
        if (match_gitlab) {
            return {
                name: `${match_gitlab[6]}/${match_gitlab[8]}`,
                source: ProjectSource_1.ProjectSource.GITLAB
            };
        }
        throw new Error("Not supported project source.");
    }
    exports.extractProjectSource = extractProjectSource;
    });

    /* src\common\components\loader\OverlayLoading.svelte generated by Svelte v3.49.0 */
    const file$a = "src\\common\\components\\loader\\OverlayLoading.svelte";
    const get_default_slot_changes = dirty => ({});
    const get_default_slot_context = ctx => ({ class: "loader svelte-1y15jr0" });

    function create_fragment$c(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let p;
    	let t1;
    	let div1_transition;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			p = element("p");
    			t1 = text(/*message*/ ctx[1]);
    			attr_dev(p, "class", "message svelte-1y15jr0");
    			add_location(p, file$a, 9, 8, 249);
    			attr_dev(div0, "class", "svelte-1y15jr0");
    			add_location(div0, file$a, 7, 4, 201);
    			attr_dev(div1, "class", "overlay svelte-1y15jr0");
    			add_location(div1, file$a, 6, 0, 133);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			append_dev(div0, t0);
    			append_dev(div0, p);
    			append_dev(p, t1);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*message*/ 2) set_data_dev(t1, /*message*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: /*duration*/ ctx[0] }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, { duration: /*duration*/ ctx[0] }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div1_transition) div1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OverlayLoading', slots, ['default']);
    	let { duration } = $$props;
    	let { message = "Loading" } = $$props;
    	const writable_props = ['duration', 'message'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OverlayLoading> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('duration' in $$props) $$invalidate(0, duration = $$props.duration);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ fade, duration, message });

    	$$self.$inject_state = $$props => {
    		if ('duration' in $$props) $$invalidate(0, duration = $$props.duration);
    		if ('message' in $$props) $$invalidate(1, message = $$props.message);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [duration, message, $$scope, slots];
    }

    class OverlayLoading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { duration: 0, message: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OverlayLoading",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*duration*/ ctx[0] === undefined && !('duration' in props)) {
    			console.warn("<OverlayLoading> was created without expected prop 'duration'");
    		}
    	}

    	get duration() {
    		throw new Error("<OverlayLoading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<OverlayLoading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<OverlayLoading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<OverlayLoading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const range = (size, startAt = 0) => [...Array(size).keys()].map(i => i + startAt);

    /* src\common\components\loader\Wave.svelte generated by Svelte v3.49.0 */
    const file$9 = "src\\common\\components\\loader\\Wave.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (14:4) {#each range(10, 0) as version}
    function create_each_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "bar svelte-15i7ly");
    			set_style(div, "left", /*version*/ ctx[6] * (+/*size*/ ctx[3] / 5 + (+/*size*/ ctx[3] / 15 - +/*size*/ ctx[3] / 100)) + /*unit*/ ctx[1]);
    			set_style(div, "animation-delay", /*version*/ ctx[6] * (+/*durationNum*/ ctx[5] / 8.3) + /*durationUnit*/ ctx[4]);
    			add_location(div, file$9, 14, 8, 434);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "left", /*version*/ ctx[6] * (+/*size*/ ctx[3] / 5 + (+/*size*/ ctx[3] / 15 - +/*size*/ ctx[3] / 100)) + /*unit*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(14:4) {#each range(10, 0) as version}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let each_value = range(10, 0);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "wrapper svelte-15i7ly");
    			set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			set_style(div, "--color", /*color*/ ctx[0]);
    			set_style(div, "--duration", /*duration*/ ctx[2]);
    			add_location(div, file$9, 9, 0, 282);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*range, size, unit, durationNum, durationUnit*/ 58) {
    				each_value = range(10, 0);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*size, unit*/ 10) {
    				set_style(div, "--size", /*size*/ ctx[3] + /*unit*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div, "--color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*duration*/ 4) {
    				set_style(div, "--duration", /*duration*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Wave', slots, []);
    	let { color = "#FF3E00" } = $$props;
    	let { unit = "px" } = $$props;
    	let { duration = "1.25s" } = $$props;
    	let { size = "60" } = $$props;
    	let durationUnit = duration.match(/[a-zA-Z]/)[0];
    	let durationNum = duration.replace(/[a-zA-Z]/, "");
    	const writable_props = ['color', 'unit', 'duration', 'size'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Wave> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    	};

    	$$self.$capture_state = () => ({
    		range,
    		color,
    		unit,
    		duration,
    		size,
    		durationUnit,
    		durationNum
    	});

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('unit' in $$props) $$invalidate(1, unit = $$props.unit);
    		if ('duration' in $$props) $$invalidate(2, duration = $$props.duration);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('durationUnit' in $$props) $$invalidate(4, durationUnit = $$props.durationUnit);
    		if ('durationNum' in $$props) $$invalidate(5, durationNum = $$props.durationNum);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, unit, duration, size, durationUnit, durationNum];
    }

    class Wave extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { color: 0, unit: 1, duration: 2, size: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Wave",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get color() {
    		throw new Error("<Wave>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Wave>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unit() {
    		throw new Error("<Wave>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unit(value) {
    		throw new Error("<Wave>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Wave>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Wave>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Wave>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Wave>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\common\layouts\DefaultLayout.svelte generated by Svelte v3.49.0 */
    const get_content_slot_changes = dirty => ({});
    const get_content_slot_context = ctx => ({});

    // (15:4) <HeaderNav>
    function create_default_slot_2$5(ctx) {
    	let headernavitem0;
    	let t0;
    	let headernavitem1;
    	let t1;
    	let headernavitem2;
    	let t2;
    	let headernavitem3;
    	let t3;
    	let headernavitem4;
    	let current;

    	headernavitem0 = new HeaderNavItem$1({
    			props: { href: "#/", text: "Home" },
    			$$inline: true
    		});

    	headernavitem1 = new HeaderNavItem$1({
    			props: { href: "#/projects", text: "Projects" },
    			$$inline: true
    		});

    	headernavitem2 = new HeaderNavItem$1({
    			props: { href: "#/packages", text: "Packages" },
    			$$inline: true
    		});

    	headernavitem3 = new HeaderNavItem$1({
    			props: { href: "#/analyzers", text: "Analyzers" },
    			$$inline: true
    		});

    	headernavitem4 = new HeaderNavItem$1({
    			props: { href: "#/scans", text: "Scans" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(headernavitem0.$$.fragment);
    			t0 = space();
    			create_component(headernavitem1.$$.fragment);
    			t1 = space();
    			create_component(headernavitem2.$$.fragment);
    			t2 = space();
    			create_component(headernavitem3.$$.fragment);
    			t3 = space();
    			create_component(headernavitem4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headernavitem0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(headernavitem1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(headernavitem2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(headernavitem3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(headernavitem4, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headernavitem0.$$.fragment, local);
    			transition_in(headernavitem1.$$.fragment, local);
    			transition_in(headernavitem2.$$.fragment, local);
    			transition_in(headernavitem3.$$.fragment, local);
    			transition_in(headernavitem4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headernavitem0.$$.fragment, local);
    			transition_out(headernavitem1.$$.fragment, local);
    			transition_out(headernavitem2.$$.fragment, local);
    			transition_out(headernavitem3.$$.fragment, local);
    			transition_out(headernavitem4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headernavitem0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(headernavitem1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(headernavitem2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(headernavitem3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(headernavitem4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(15:4) <HeaderNav>",
    		ctx
    	});

    	return block;
    }

    // (11:0) <Header company="Pluralscan" platformName="Web Platform">
    function create_default_slot_1$7(ctx) {
    	let headernav;
    	let current;

    	headernav = new HeaderNav$1({
    			props: {
    				$$slots: { default: [create_default_slot_2$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(headernav.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(headernav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const headernav_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				headernav_changes.$$scope = { dirty, ctx };
    			}

    			headernav.$set(headernav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(headernav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(headernav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(headernav, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(11:0) <Header company=\\\"Pluralscan\\\" platformName=\\\"Web Platform\\\">",
    		ctx
    	});

    	return block;
    }

    // (12:4) <svelte:fragment slot="skip-to-content">
    function create_skip_to_content_slot(ctx) {
    	let skiptocontent;
    	let current;
    	skiptocontent = new SkipToContent$1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(skiptocontent.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(skiptocontent, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skiptocontent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skiptocontent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(skiptocontent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_skip_to_content_slot.name,
    		type: "slot",
    		source: "(12:4) <svelte:fragment slot=\\\"skip-to-content\\\">",
    		ctx
    	});

    	return block;
    }

    // (24:0) <Content>
    function create_default_slot$8(ctx) {
    	let current;
    	const content_slot_template = /*#slots*/ ctx[0].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[1], get_content_slot_context);

    	const block = {
    		c: function create() {
    			if (content_slot) content_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (content_slot) {
    				content_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (content_slot) {
    				if (content_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						content_slot,
    						content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(content_slot_template, /*$$scope*/ ctx[1], dirty, get_content_slot_changes),
    						get_content_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (content_slot) content_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(24:0) <Content>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let header;
    	let t;
    	let content;
    	let current;

    	header = new Header$1({
    			props: {
    				company: "Pluralscan",
    				platformName: "Web Platform",
    				$$slots: {
    					"skip-to-content": [create_skip_to_content_slot],
    					default: [create_default_slot_1$7]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	content = new Content$1({
    			props: {
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t = space();
    			create_component(content.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(content, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const header_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				header_changes.$$scope = { dirty, ctx };
    			}

    			header.$set(header_changes);
    			const content_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				content_changes.$$scope = { dirty, ctx };
    			}

    			content.$set(content_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(content.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(content.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(content, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DefaultLayout', slots, ['content']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DefaultLayout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Header: Header$1,
    		HeaderNav: HeaderNav$1,
    		HeaderNavItem: HeaderNavItem$1,
    		SkipToContent: SkipToContent$1,
    		Content: Content$1
    	});

    	return [slots, $$scope];
    }

    class DefaultLayout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DefaultLayout",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    function getErrorMessage(error) {
        if (error instanceof Error)
            return error.message;
        return String(error);
    }
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /* src\home\Home.svelte generated by Svelte v3.49.0 */

    const { console: console_1 } = globals;
    const file$8 = "src\\home\\Home.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (65:8) {#if isLoading}
    function create_if_block_2(ctx) {
    	let overlayloading;
    	let current;

    	overlayloading = new OverlayLoading({
    			props: {
    				duration: "400",
    				message: /*loadingMessage*/ ctx[2],
    				$$slots: { default: [create_default_slot_19] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overlayloading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overlayloading, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const overlayloading_changes = {};
    			if (dirty & /*loadingMessage*/ 4) overlayloading_changes.message = /*loadingMessage*/ ctx[2];

    			if (dirty & /*$$scope*/ 2048) {
    				overlayloading_changes.$$scope = { dirty, ctx };
    			}

    			overlayloading.$set(overlayloading_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overlayloading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overlayloading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overlayloading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(65:8) {#if isLoading}",
    		ctx
    	});

    	return block;
    }

    // (66:12) <OverlayLoading duration="400" message={loadingMessage}>
    function create_default_slot_19(ctx) {
    	let wave;
    	let current;
    	wave = new Wave({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(wave.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(wave, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wave.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wave.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(wave, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_19.name,
    		type: "slot",
    		source: "(66:12) <OverlayLoading duration=\\\"400\\\" message={loadingMessage}>",
    		ctx
    	});

    	return block;
    }

    // (71:12) <Row>
    function create_default_slot_18(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Pluralscan";
    			add_location(h1, file$8, 71, 16, 2661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_18.name,
    		type: "slot",
    		source: "(71:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (75:12) {#if !state.project}
    function create_if_block_1$2(ctx) {
    	let row;
    	let current;

    	row = new Row$1({
    			props: {
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, searchData*/ 2049) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(75:12) {#if !state.project}",
    		ctx
    	});

    	return block;
    }

    // (83:32) <Column>
    function create_default_slot_17(ctx) {
    	let textinput;
    	let updating_value;
    	let current;

    	function textinput_value_binding(value) {
    		/*textinput_value_binding*/ ctx[5](value);
    	}

    	let textinput_props = {
    		light: true,
    		labelText: "Source",
    		helperText: "Exemple: https://github.com/gromatluidgi/Cast.RestClient",
    		placeholder: "Enter project or package url...."
    	};

    	if (/*searchData*/ ctx[0].uri !== void 0) {
    		textinput_props.value = /*searchData*/ ctx[0].uri;
    	}

    	textinput = new TextInput$1({ props: textinput_props, $$inline: true });
    	binding_callbacks.push(() => bind(textinput, 'value', textinput_value_binding));

    	const block = {
    		c: function create() {
    			create_component(textinput.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textinput, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textinput_changes = {};

    			if (!updating_value && dirty & /*searchData*/ 1) {
    				updating_value = true;
    				textinput_changes.value = /*searchData*/ ctx[0].uri;
    				add_flush_callback(() => updating_value = false);
    			}

    			textinput.$set(textinput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textinput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(83:32) <Column>",
    		ctx
    	});

    	return block;
    }

    // (82:28) <Row>
    function create_default_slot_16(ctx) {
    	let column;
    	let current;

    	column = new Column$1({
    			props: {
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};

    			if (dirty & /*$$scope, searchData*/ 2049) {
    				column_changes.$$scope = { dirty, ctx };
    			}

    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(82:28) <Row>",
    		ctx
    	});

    	return block;
    }

    // (93:28) <Button                                  on:click={search_project}                                  class="load-repo-button">
    function create_default_slot_15(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Search");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(93:28) <Button                                  on:click={search_project}                                  class=\\\"load-repo-button\\\">",
    		ctx
    	});

    	return block;
    }

    // (78:24) <Tile class="repo-input-tile">
    function create_default_slot_14(ctx) {
    	let h5;
    	let t1;
    	let row;
    	let t2;
    	let button;
    	let current;

    	row = new Row$1({
    			props: {
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button$1({
    			props: {
    				class: "load-repo-button",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*search_project*/ ctx[4]);

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Search for an open-source projet or package to analize";
    			t1 = space();
    			create_component(row.$$.fragment);
    			t2 = space();
    			create_component(button.$$.fragment);
    			attr_dev(h5, "class", "svelte-9oh3u5");
    			add_location(h5, file$8, 78, 28, 2892);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(row, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, searchData*/ 2049) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t1);
    			destroy_component(row, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(78:24) <Tile class=\\\"repo-input-tile\\\">",
    		ctx
    	});

    	return block;
    }

    // (77:20) <Column noGutter padding>
    function create_default_slot_13(ctx) {
    	let tile;
    	let current;

    	tile = new Tile$1({
    			props: {
    				class: "repo-input-tile",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tile, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tile_changes = {};

    			if (dirty & /*$$scope, searchData*/ 2049) {
    				tile_changes.$$scope = { dirty, ctx };
    			}

    			tile.$set(tile_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(77:20) <Column noGutter padding>",
    		ctx
    	});

    	return block;
    }

    // (76:16) <Row>
    function create_default_slot_12(ctx) {
    	let column;
    	let current;

    	column = new Column$1({
    			props: {
    				noGutter: true,
    				padding: true,
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};

    			if (dirty & /*$$scope, searchData*/ 2049) {
    				column_changes.$$scope = { dirty, ctx };
    			}

    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(76:16) <Row>",
    		ctx
    	});

    	return block;
    }

    // (102:12) {#if state.project}
    function create_if_block$5(ctx) {
    	let row;
    	let current;

    	row = new Row$1({
    			props: {
    				$$slots: { default: [create_default_slot_1$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, state*/ 2050) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(102:12) {#if state.project}",
    		ctx
    	});

    	return block;
    }

    // (108:32) <Tile>
    function create_default_slot_11(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Project Informations";
    			add_location(h6, file$8, 107, 38, 4204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(108:32) <Tile>",
    		ctx
    	});

    	return block;
    }

    // (109:32) <Tile>
    function create_default_slot_10(ctx) {
    	let h6;

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Package Informations";
    			add_location(h6, file$8, 108, 38, 4280);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(109:32) <Tile>",
    		ctx
    	});

    	return block;
    }

    // (107:28) <Column>
    function create_default_slot_9(ctx) {
    	let tile0;
    	let t;
    	let tile1;
    	let current;

    	tile0 = new Tile$1({
    			props: {
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tile1 = new Tile$1({
    			props: {
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tile0.$$.fragment);
    			t = space();
    			create_component(tile1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tile0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(tile1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tile0_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				tile0_changes.$$scope = { dirty, ctx };
    			}

    			tile0.$set(tile0_changes);
    			const tile1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				tile1_changes.$$scope = { dirty, ctx };
    			}

    			tile1.$set(tile1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tile0.$$.fragment, local);
    			transition_in(tile1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tile0.$$.fragment, local);
    			transition_out(tile1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tile0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(tile1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(107:28) <Column>",
    		ctx
    	});

    	return block;
    }

    // (117:40) <AccordionItem title="{analyzer.name}">
    function create_default_slot_8(ctx) {
    	let p;
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Translate text, documents, and websites from one language to another.\r\n                                              Create industry or region-specific translations via the service's\r\n                                              customization capability.";
    			t1 = space();
    			add_location(p, file$8, 117, 44, 4761);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(117:40) <AccordionItem title=\\\"{analyzer.name}\\\">",
    		ctx
    	});

    	return block;
    }

    // (116:40) {#each state.analyzers as analyzer}
    function create_each_block$1(ctx) {
    	let accordionitem;
    	let current;

    	accordionitem = new AccordionItem$1({
    			props: {
    				title: /*analyzer*/ ctx[8].name,
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(accordionitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(accordionitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const accordionitem_changes = {};
    			if (dirty & /*state*/ 2) accordionitem_changes.title = /*analyzer*/ ctx[8].name;

    			if (dirty & /*$$scope*/ 2048) {
    				accordionitem_changes.$$scope = { dirty, ctx };
    			}

    			accordionitem.$set(accordionitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accordionitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accordionitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(accordionitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(116:40) {#each state.analyzers as analyzer}",
    		ctx
    	});

    	return block;
    }

    // (115:36) <Accordion align="start">
    function create_default_slot_7(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*state*/ ctx[1].analyzers;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*state*/ 2) {
    				each_value = /*state*/ ctx[1].analyzers;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(115:36) <Accordion align=\\\"start\\\">",
    		ctx
    	});

    	return block;
    }

    // (113:32) <Tile>
    function create_default_slot_6(ctx) {
    	let h6;
    	let t1;
    	let accordion;
    	let current;

    	accordion = new Accordion$1({
    			props: {
    				align: "start",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			h6.textContent = "Scan Package";
    			t1 = space();
    			create_component(accordion.$$.fragment);
    			add_location(h6, file$8, 113, 36, 4473);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(accordion, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const accordion_changes = {};

    			if (dirty & /*$$scope, state*/ 2050) {
    				accordion_changes.$$scope = { dirty, ctx };
    			}

    			accordion.$set(accordion_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accordion.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accordion.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    			if (detaching) detach_dev(t1);
    			destroy_component(accordion, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(113:32) <Tile>",
    		ctx
    	});

    	return block;
    }

    // (127:32) <Button                                      on:click={search_project}                                      class="load-repo-button">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Scan");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(127:32) <Button                                      on:click={search_project}                                      class=\\\"load-repo-button\\\">",
    		ctx
    	});

    	return block;
    }

    // (112:28) <Column>
    function create_default_slot_4$2(ctx) {
    	let tile;
    	let t;
    	let button;
    	let current;

    	tile = new Tile$1({
    			props: {
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button$1({
    			props: {
    				class: "load-repo-button",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*search_project*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(tile.$$.fragment);
    			t = space();
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tile, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tile_changes = {};

    			if (dirty & /*$$scope, state*/ 2050) {
    				tile_changes.$$scope = { dirty, ctx };
    			}

    			tile.$set(tile_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tile.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tile.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tile, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(112:28) <Column>",
    		ctx
    	});

    	return block;
    }

    // (106:24) <Row>
    function create_default_slot_3$4(ctx) {
    	let column0;
    	let t;
    	let column1;
    	let current;

    	column0 = new Column$1({
    			props: {
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	column1 = new Column$1({
    			props: {
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column0.$$.fragment);
    			t = space();
    			create_component(column1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(column1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column0_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				column0_changes.$$scope = { dirty, ctx };
    			}

    			column0.$set(column0_changes);
    			const column1_changes = {};

    			if (dirty & /*$$scope, state*/ 2050) {
    				column1_changes.$$scope = { dirty, ctx };
    			}

    			column1.$set(column1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column0.$$.fragment, local);
    			transition_in(column1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column0.$$.fragment, local);
    			transition_out(column1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(column1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$4.name,
    		type: "slot",
    		source: "(106:24) <Row>",
    		ctx
    	});

    	return block;
    }

    // (104:20) <Column noGutter padding>
    function create_default_slot_2$4(ctx) {
    	let h5;
    	let t1;
    	let row;
    	let current;

    	row = new Row$1({
    			props: {
    				$$slots: { default: [create_default_slot_3$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Homepage:";
    			t1 = space();
    			create_component(row.$$.fragment);
    			attr_dev(h5, "class", "svelte-9oh3u5");
    			add_location(h5, file$8, 104, 24, 4076);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, state*/ 2050) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t1);
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(104:20) <Column noGutter padding>",
    		ctx
    	});

    	return block;
    }

    // (103:16) <Row>
    function create_default_slot_1$6(ctx) {
    	let column;
    	let current;

    	column = new Column$1({
    			props: {
    				noGutter: true,
    				padding: true,
    				$$slots: { default: [create_default_slot_2$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};

    			if (dirty & /*$$scope, state*/ 2050) {
    				column_changes.$$scope = { dirty, ctx };
    			}

    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(103:16) <Row>",
    		ctx
    	});

    	return block;
    }

    // (70:8) <Grid>
    function create_default_slot$7(ctx) {
    	let row;
    	let t0;
    	let t1;
    	let if_block1_anchor;
    	let current;

    	row = new Row$1({
    			props: {
    				$$slots: { default: [create_default_slot_18] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = !/*state*/ ctx[1].project && create_if_block_1$2(ctx);
    	let if_block1 = /*state*/ ctx[1].project && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);

    			if (!/*state*/ ctx[1].project) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*state*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t1.parentNode, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*state*/ ctx[1].project) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*state*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(70:8) <Grid>",
    		ctx
    	});

    	return block;
    }

    // (64:4) 
    function create_content_slot$4(ctx) {
    	let div;
    	let t;
    	let grid;
    	let current;
    	let if_block = /*isLoading*/ ctx[3] && create_if_block_2(ctx);

    	grid = new Grid$1({
    			props: {
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			create_component(grid.$$.fragment);
    			attr_dev(div, "slot", "content");
    			add_location(div, file$8, 63, 4, 2421);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    			mount_component(grid, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*isLoading*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isLoading*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const grid_changes = {};

    			if (dirty & /*$$scope, state, searchData*/ 2051) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(grid);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$4.name,
    		type: "slot",
    		source: "(64:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let defaultlayout;
    	let current;

    	defaultlayout = new DefaultLayout({
    			props: {
    				$$slots: { content: [create_content_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(defaultlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(defaultlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const defaultlayout_changes = {};

    			if (dirty & /*$$scope, state, searchData, loadingMessage, isLoading*/ 2063) {
    				defaultlayout_changes.$$scope = { dirty, ctx };
    			}

    			defaultlayout.$set(defaultlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(defaultlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(defaultlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(defaultlayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const searchData = { uri: "" };

    	let state = {
    		analyzers: [],
    		project: null,
    		package: null
    	};

    	let loadingMessage = "Verify if project is already registred in Pluralscan repository...";
    	let title = "Pluralscan";
    	let isLoading = false;

    	function refreshTitle(value) {
    		if (!value) {
    			title = "Pluralscan";
    			return;
    		}

    		title = value;
    	}

    	async function search_project() {
    		const restClient = new RestClient_1.RestClient({ apiUrl: 'http://localhost:5400/' });
    		$$invalidate(2, loadingMessage = "Verify if project is already registred in Pluralscan repository...");
    		$$invalidate(3, isLoading = true);

    		try {
    			const projectNameAndSource = uri.extractProjectSource(searchData.uri);
    			let response = await restClient.project.findProject(projectNameAndSource.name, projectNameAndSource.source);

    			if (!response) {
    				$$invalidate(2, loadingMessage = "No project found, try to create a new one...");
    				await delay(1000);
    				response = await restClient.project.createProject(searchData.uri);
    				console.log(response);
    				$$invalidate(2, loadingMessage = "Project synchronized with new snapshot package...");
    				$$invalidate(1, state.project = response.project, state);
    				$$invalidate(1, state.package = response.package, state);
    				await delay(1000);
    				$$invalidate(2, loadingMessage = "Retrieve analyzers...");
    				$$invalidate(1, state.analyzers = await restClient.analyzer.findByTechnologies(state.package['technologies']), state);
    				await delay(1000);
    				$$invalidate(3, isLoading = false);
    				return;
    			}

    			$$invalidate(1, state.project = response, state);
    		} catch(error) {
    			reportError({ message: getErrorMessage(error) });
    		}

    		$$invalidate(3, isLoading = false);
    	}

    	onMount(async () => {
    		new RestClient_1.RestClient({ apiUrl: 'http://localhost:5400/' });
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	function textinput_value_binding(value) {
    		if ($$self.$$.not_equal(searchData.uri, value)) {
    			searchData.uri = value;
    			$$invalidate(0, searchData);
    		}
    	}

    	$$self.$capture_state = () => ({
    		Grid: Grid$1,
    		Row: Row$1,
    		Column: Column$1,
    		Button: Button$1,
    		Tile: Tile$1,
    		TextInput: TextInput$1,
    		Accordion: Accordion$1,
    		AccordionItem: AccordionItem$1,
    		onMount,
    		RestClient: RestClient_1.RestClient,
    		extractProjectSource: uri.extractProjectSource,
    		OverlayLoading,
    		Wave,
    		DefaultLayout,
    		delay,
    		getErrorMessage,
    		searchData,
    		state,
    		loadingMessage,
    		title,
    		isLoading,
    		refreshTitle,
    		search_project
    	});

    	$$self.$inject_state = $$props => {
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('loadingMessage' in $$props) $$invalidate(2, loadingMessage = $$props.loadingMessage);
    		if ('title' in $$props) title = $$props.title;
    		if ('isLoading' in $$props) $$invalidate(3, isLoading = $$props.isLoading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		searchData,
    		state,
    		loadingMessage,
    		isLoading,
    		search_project,
    		textinput_value_binding
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\analyzers\components\AnalyzerList.svelte generated by Svelte v3.49.0 */

    const file$7 = "src\\analyzers\\components\\AnalyzerList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (42:8) {:else}
    function create_else_block$2(ctx) {
    	let t_value = /*cell*/ ctx[11].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cell*/ 2048 && t_value !== (t_value = /*cell*/ ctx[11].value + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(42:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (39:46) 
    function create_if_block_1$1(ctx) {
    	let t_value = /*cell*/ ctx[11].value.map(func_1).join(" / ") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cell*/ 2048 && t_value !== (t_value = /*cell*/ ctx[11].value.map(func_1).join(" / ") + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(39:46) ",
    		ctx
    	});

    	return block;
    }

    // (35:8) {#if cell.key === "overflow"}
    function create_if_block$4(ctx) {
    	let overflowmenu;
    	let current;

    	overflowmenu = new OverflowMenu$1({
    			props: {
    				flipped: true,
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overflowmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overflowmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const overflowmenu_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				overflowmenu_changes.$$scope = { dirty, ctx };
    			}

    			overflowmenu.$set(overflowmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overflowmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overflowmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overflowmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(35:8) {#if cell.key === \\\"overflow\\\"}",
    		ctx
    	});

    	return block;
    }

    // (36:12) <OverflowMenu flipped>
    function create_default_slot_1$5(ctx) {
    	let overflowmenuitem;
    	let current;

    	overflowmenuitem = new OverflowMenuItem$1({
    			props: { text: "Show Details" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overflowmenuitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overflowmenuitem, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overflowmenuitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overflowmenuitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overflowmenuitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(36:12) <OverflowMenu flipped>",
    		ctx
    	});

    	return block;
    }

    // (34:4) <svelte:fragment slot="cell" let:cell>
    function create_cell_slot$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_if_block_1$1, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*cell*/ ctx[11].key === "overflow") return 0;
    		if (/*cell*/ ctx[11].key === "technologies") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_cell_slot$2.name,
    		type: "slot",
    		source: "(34:4) <svelte:fragment slot=\\\"cell\\\" let:cell>",
    		ctx
    	});

    	return block;
    }

    // (49:12) <Tile>
    function create_default_slot$6(ctx) {
    	let h4;
    	let t0_value = /*executable*/ ctx[8].name + "";
    	let t0;
    	let t1;
    	let t2_value = /*executable*/ ctx[8].version + "";
    	let t2;
    	let t3;
    	let p0;
    	let strong0;
    	let t5;
    	let t6_value = /*executable*/ ctx[8].platform + "";
    	let t6;
    	let t7;
    	let p1;
    	let strong1;
    	let t9;
    	let t10_value = /*executable*/ ctx[8].commands.map(func).join(", ") + "";
    	let t10;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			p0 = element("p");
    			strong0 = element("strong");
    			strong0.textContent = "Platform:";
    			t5 = space();
    			t6 = text(t6_value);
    			t7 = space();
    			p1 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "Commands:";
    			t9 = space();
    			t10 = text(t10_value);
    			add_location(h4, file$7, 49, 16, 1328);
    			add_location(strong0, file$7, 53, 19, 1457);
    			add_location(p0, file$7, 53, 16, 1454);
    			add_location(strong1, file$7, 55, 20, 1552);
    			add_location(p1, file$7, 54, 16, 1527);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t0);
    			append_dev(h4, t1);
    			append_dev(h4, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, p0, anchor);
    			append_dev(p0, strong0);
    			append_dev(p0, t5);
    			append_dev(p0, t6);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p1, anchor);
    			append_dev(p1, strong1);
    			append_dev(p1, t9);
    			append_dev(p1, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row*/ 128 && t0_value !== (t0_value = /*executable*/ ctx[8].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*row*/ 128 && t2_value !== (t2_value = /*executable*/ ctx[8].version + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*row*/ 128 && t6_value !== (t6_value = /*executable*/ ctx[8].platform + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*row*/ 128 && t10_value !== (t10_value = /*executable*/ ctx[8].commands.map(func).join(", ") + "")) set_data_dev(t10, t10_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(49:12) <Tile>",
    		ctx
    	});

    	return block;
    }

    // (48:8) {#each row.executables as executable}
    function create_each_block(ctx) {
    	let tile;
    	let t;
    	let hr;
    	let current;

    	tile = new Tile$1({
    			props: {
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tile.$$.fragment);
    			t = space();
    			hr = element("hr");
    			add_location(hr, file$7, 61, 12, 1774);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tile, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, hr, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tile_changes = {};

    			if (dirty & /*$$scope, row*/ 4224) {
    				tile_changes.$$scope = { dirty, ctx };
    			}

    			tile.$set(tile_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tile, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(hr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(48:8) {#each row.executables as executable}",
    		ctx
    	});

    	return block;
    }

    // (47:4) <svelte:fragment slot="expanded-row" let:row>
    function create_expanded_row_slot$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*row*/ ctx[7].executables;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row*/ 128) {
    				each_value = /*row*/ ctx[7].executables;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_expanded_row_slot$2.name,
    		type: "slot",
    		source: "(47:4) <svelte:fragment slot=\\\"expanded-row\\\" let:row>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let datatable;
    	let t;
    	let pagination;
    	let updating_pageSize;
    	let updating_page;
    	let current;

    	datatable = new DataTable$1({
    			props: {
    				title: "Analyzers",
    				description: "Pluralscan supported analyzers.",
    				size: "medium",
    				pageSize: /*pageSize*/ ctx[1],
    				page: /*pageNumber*/ ctx[0],
    				sortable: true,
    				expandable: true,
    				rows: /*analyzers*/ ctx[2],
    				headers: /*headers*/ ctx[4],
    				$$slots: {
    					"expanded-row": [
    						create_expanded_row_slot$2,
    						({ row }) => ({ 7: row }),
    						({ row }) => row ? 128 : 0
    					],
    					cell: [
    						create_cell_slot$2,
    						({ cell }) => ({ 11: cell }),
    						({ cell }) => cell ? 2048 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function pagination_pageSize_binding(value) {
    		/*pagination_pageSize_binding*/ ctx[5](value);
    	}

    	function pagination_page_binding(value) {
    		/*pagination_page_binding*/ ctx[6](value);
    	}

    	let pagination_props = {
    		totalItems: /*totalItems*/ ctx[3],
    		pageSizeInputDisabled: true
    	};

    	if (/*pageSize*/ ctx[1] !== void 0) {
    		pagination_props.pageSize = /*pageSize*/ ctx[1];
    	}

    	if (/*pageNumber*/ ctx[0] !== void 0) {
    		pagination_props.page = /*pageNumber*/ ctx[0];
    	}

    	pagination = new Pagination$1({ props: pagination_props, $$inline: true });
    	binding_callbacks.push(() => bind(pagination, 'pageSize', pagination_pageSize_binding));
    	binding_callbacks.push(() => bind(pagination, 'page', pagination_page_binding));

    	const block = {
    		c: function create() {
    			create_component(datatable.$$.fragment);
    			t = space();
    			create_component(pagination.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(datatable, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(pagination, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const datatable_changes = {};
    			if (dirty & /*pageSize*/ 2) datatable_changes.pageSize = /*pageSize*/ ctx[1];
    			if (dirty & /*pageNumber*/ 1) datatable_changes.page = /*pageNumber*/ ctx[0];
    			if (dirty & /*analyzers*/ 4) datatable_changes.rows = /*analyzers*/ ctx[2];

    			if (dirty & /*$$scope, row, cell*/ 6272) {
    				datatable_changes.$$scope = { dirty, ctx };
    			}

    			datatable.$set(datatable_changes);
    			const pagination_changes = {};
    			if (dirty & /*totalItems*/ 8) pagination_changes.totalItems = /*totalItems*/ ctx[3];

    			if (!updating_pageSize && dirty & /*pageSize*/ 2) {
    				updating_pageSize = true;
    				pagination_changes.pageSize = /*pageSize*/ ctx[1];
    				add_flush_callback(() => updating_pageSize = false);
    			}

    			if (!updating_page && dirty & /*pageNumber*/ 1) {
    				updating_page = true;
    				pagination_changes.page = /*pageNumber*/ ctx[0];
    				add_flush_callback(() => updating_page = false);
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datatable.$$.fragment, local);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datatable.$$.fragment, local);
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(datatable, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(pagination, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = command => command.action;
    const func_1 = tech => tech.display_name;

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AnalyzerList', slots, []);
    	let { analyzers = [] } = $$props;
    	let { pageNumber = 1 } = $$props;
    	let { pageSize = 15 } = $$props;
    	let { totalItems = 0 } = $$props;

    	const headers = [
    		{ key: "id", value: "Id" },
    		{ key: "name", value: "Name" },
    		{
    			key: "technologies",
    			value: "Supported Technology"
    		},
    		{ key: "overflow", empty: true }
    	];

    	const writable_props = ['analyzers', 'pageNumber', 'pageSize', 'totalItems'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AnalyzerList> was created with unknown prop '${key}'`);
    	});

    	function pagination_pageSize_binding(value) {
    		pageSize = value;
    		$$invalidate(1, pageSize);
    	}

    	function pagination_page_binding(value) {
    		pageNumber = value;
    		$$invalidate(0, pageNumber);
    	}

    	$$self.$$set = $$props => {
    		if ('analyzers' in $$props) $$invalidate(2, analyzers = $$props.analyzers);
    		if ('pageNumber' in $$props) $$invalidate(0, pageNumber = $$props.pageNumber);
    		if ('pageSize' in $$props) $$invalidate(1, pageSize = $$props.pageSize);
    		if ('totalItems' in $$props) $$invalidate(3, totalItems = $$props.totalItems);
    	};

    	$$self.$capture_state = () => ({
    		DataTable: DataTable$1,
    		Pagination: Pagination$1,
    		OverflowMenu: OverflowMenu$1,
    		OverflowMenuItem: OverflowMenuItem$1,
    		Tile: Tile$1,
    		analyzers,
    		pageNumber,
    		pageSize,
    		totalItems,
    		headers
    	});

    	$$self.$inject_state = $$props => {
    		if ('analyzers' in $$props) $$invalidate(2, analyzers = $$props.analyzers);
    		if ('pageNumber' in $$props) $$invalidate(0, pageNumber = $$props.pageNumber);
    		if ('pageSize' in $$props) $$invalidate(1, pageSize = $$props.pageSize);
    		if ('totalItems' in $$props) $$invalidate(3, totalItems = $$props.totalItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		pageNumber,
    		pageSize,
    		analyzers,
    		totalItems,
    		headers,
    		pagination_pageSize_binding,
    		pagination_page_binding
    	];
    }

    class AnalyzerList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			analyzers: 2,
    			pageNumber: 0,
    			pageSize: 1,
    			totalItems: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AnalyzerList",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get analyzers() {
    		throw new Error("<AnalyzerList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set analyzers(value) {
    		throw new Error("<AnalyzerList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageNumber() {
    		throw new Error("<AnalyzerList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageNumber(value) {
    		throw new Error("<AnalyzerList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSize() {
    		throw new Error("<AnalyzerList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSize(value) {
    		throw new Error("<AnalyzerList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get totalItems() {
    		throw new Error("<AnalyzerList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalItems(value) {
    		throw new Error("<AnalyzerList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\analyzers\Analyzers.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1$1 } = globals;
    const file$6 = "src\\analyzers\\Analyzers.svelte";

    // (32:8) {#if loading}
    function create_if_block$3(ctx) {
    	let overlayloading;
    	let current;

    	overlayloading = new OverlayLoading({
    			props: {
    				duration: "400",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overlayloading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overlayloading, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overlayloading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overlayloading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overlayloading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(32:8) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (33:12) <OverlayLoading duration="400">
    function create_default_slot_4$1(ctx) {
    	let wave;
    	let current;
    	wave = new Wave({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(wave.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(wave, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wave.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wave.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(wave, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(33:12) <OverlayLoading duration=\\\"400\\\">",
    		ctx
    	});

    	return block;
    }

    // (38:12) <Row>
    function create_default_slot_3$3(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Analyzers Registry";
    			add_location(h1, file$6, 38, 16, 1176);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(38:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (42:16) <Column noGutter>
    function create_default_slot_2$3(ctx) {
    	let analyzerlist;
    	let current;

    	analyzerlist = new AnalyzerList({
    			props: {
    				analyzers: /*state*/ ctx[1].analyzers,
    				pageNumber: /*state*/ ctx[1].pageNumber,
    				pageSize: /*state*/ ctx[1].pageSize,
    				totalItems: /*state*/ ctx[1].totalItems
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(analyzerlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(analyzerlist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const analyzerlist_changes = {};
    			if (dirty & /*state*/ 2) analyzerlist_changes.analyzers = /*state*/ ctx[1].analyzers;
    			if (dirty & /*state*/ 2) analyzerlist_changes.pageNumber = /*state*/ ctx[1].pageNumber;
    			if (dirty & /*state*/ 2) analyzerlist_changes.pageSize = /*state*/ ctx[1].pageSize;
    			if (dirty & /*state*/ 2) analyzerlist_changes.totalItems = /*state*/ ctx[1].totalItems;
    			analyzerlist.$set(analyzerlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(analyzerlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(analyzerlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(analyzerlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(42:16) <Column noGutter>",
    		ctx
    	});

    	return block;
    }

    // (41:12) <Row padding>
    function create_default_slot_1$4(ctx) {
    	let column;
    	let current;

    	column = new Column$1({
    			props: {
    				noGutter: true,
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};

    			if (dirty & /*$$scope, state*/ 6) {
    				column_changes.$$scope = { dirty, ctx };
    			}

    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(41:12) <Row padding>",
    		ctx
    	});

    	return block;
    }

    // (37:8) <Grid fullWidth>
    function create_default_slot$5(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row$1({
    			props: {
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row$1({
    			props: {
    				padding: true,
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope, state*/ 6) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(row1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(37:8) <Grid fullWidth>",
    		ctx
    	});

    	return block;
    }

    // (31:4) 
    function create_content_slot$3(ctx) {
    	let div;
    	let t;
    	let grid;
    	let current;
    	let if_block = /*loading*/ ctx[0] && create_if_block$3(ctx);

    	grid = new Grid$1({
    			props: {
    				fullWidth: true,
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			create_component(grid.$$.fragment);
    			attr_dev(div, "slot", "content");
    			add_location(div, file$6, 30, 4, 953);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    			mount_component(grid, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*loading*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*loading*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const grid_changes = {};

    			if (dirty & /*$$scope, state*/ 6) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(grid);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$3.name,
    		type: "slot",
    		source: "(31:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let defaultlayout;
    	let current;

    	defaultlayout = new DefaultLayout({
    			props: {
    				$$slots: { content: [create_content_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(defaultlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(defaultlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const defaultlayout_changes = {};

    			if (dirty & /*$$scope, state, loading*/ 7) {
    				defaultlayout_changes.$$scope = { dirty, ctx };
    			}

    			defaultlayout.$set(defaultlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(defaultlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(defaultlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(defaultlayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Analyzers', slots, []);
    	let loading = false;

    	let state = {
    		analyzers: [],
    		pageNumber: 1,
    		pageSize: 15,
    		totalItems: 0
    	};

    	onMount(async () => {
    		$$invalidate(0, loading = true);
    		const restClient = new RestClient_1.RestClient({ apiUrl: 'http://localhost:5400/' });

    		try {
    			const result = await restClient.analyzer.list(state.pageNumber, state.pageSize);
    			$$invalidate(1, state = Object.assign({}, result));
    		} catch(_a) {
    			
    		} finally {
    			$$invalidate(0, loading = false);
    		}
    	});

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Analyzers> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Column: Column$1,
    		Grid: Grid$1,
    		Row: Row$1,
    		onMount,
    		RestClient: RestClient_1.RestClient,
    		OverlayLoading,
    		Wave,
    		DefaultLayout,
    		AnalyzerList,
    		loading,
    		state
    	});

    	$$self.$inject_state = $$props => {
    		if ('loading' in $$props) $$invalidate(0, loading = $$props.loading);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loading, state];
    }

    class Analyzers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Analyzers",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\projects\components\ProjectList.svelte generated by Svelte v3.49.0 */

    const file$5 = "src\\projects\\components\\ProjectList.svelte";

    // (38:4) <svelte:fragment slot="expanded-row" let:row>
    function create_expanded_row_slot$1(ctx) {
    	let h5;
    	let t1;
    	let p;
    	let t2_value = /*row*/ ctx[8].description + "";
    	let t2;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			h5.textContent = "Description";
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			add_location(h5, file$5, 38, 8, 845);
    			add_location(p, file$5, 39, 8, 875);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row*/ 256 && t2_value !== (t2_value = /*row*/ ctx[8].description + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_expanded_row_slot$1.name,
    		type: "slot",
    		source: "(38:4) <svelte:fragment slot=\\\"expanded-row\\\" let:row>",
    		ctx
    	});

    	return block;
    }

    // (47:8) {:else}
    function create_else_block$1(ctx) {
    	let t_value = /*cell*/ ctx[7].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cell*/ 128 && t_value !== (t_value = /*cell*/ ctx[7].value + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(47:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (43:8) {#if cell.key === "overflow"}
    function create_if_block$2(ctx) {
    	let overflowmenu;
    	let current;

    	overflowmenu = new OverflowMenu$1({
    			props: {
    				flipped: true,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overflowmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overflowmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const overflowmenu_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				overflowmenu_changes.$$scope = { dirty, ctx };
    			}

    			overflowmenu.$set(overflowmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overflowmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overflowmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overflowmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(43:8) {#if cell.key === \\\"overflow\\\"}",
    		ctx
    	});

    	return block;
    }

    // (44:12) <OverflowMenu flipped>
    function create_default_slot$4(ctx) {
    	let overflowmenuitem;
    	let current;

    	overflowmenuitem = new OverflowMenuItem$1({
    			props: { text: "Show Details" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overflowmenuitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overflowmenuitem, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overflowmenuitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overflowmenuitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overflowmenuitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(44:12) <OverflowMenu flipped>",
    		ctx
    	});

    	return block;
    }

    // (42:4) <svelte:fragment slot="cell" let:cell>
    function create_cell_slot$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*cell*/ ctx[7].key === "overflow") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_cell_slot$1.name,
    		type: "slot",
    		source: "(42:4) <svelte:fragment slot=\\\"cell\\\" let:cell>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let datatable;
    	let t;
    	let pagination;
    	let updating_pageSize;
    	let updating_page;
    	let current;

    	datatable = new DataTable$1({
    			props: {
    				title: "Projects",
    				description: "Pluralscan source projects registry.",
    				size: "medium",
    				pageSize: /*pageSize*/ ctx[1],
    				page: /*pageNumber*/ ctx[0],
    				sortable: true,
    				expandable: true,
    				rows: /*projects*/ ctx[2],
    				headers: /*headers*/ ctx[4],
    				$$slots: {
    					cell: [
    						create_cell_slot$1,
    						({ cell }) => ({ 7: cell }),
    						({ cell }) => cell ? 128 : 0
    					],
    					"expanded-row": [
    						create_expanded_row_slot$1,
    						({ row }) => ({ 8: row }),
    						({ row }) => row ? 256 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function pagination_pageSize_binding(value) {
    		/*pagination_pageSize_binding*/ ctx[5](value);
    	}

    	function pagination_page_binding(value) {
    		/*pagination_page_binding*/ ctx[6](value);
    	}

    	let pagination_props = {
    		totalItems: /*totalItems*/ ctx[3],
    		pageSizeInputDisabled: true
    	};

    	if (/*pageSize*/ ctx[1] !== void 0) {
    		pagination_props.pageSize = /*pageSize*/ ctx[1];
    	}

    	if (/*pageNumber*/ ctx[0] !== void 0) {
    		pagination_props.page = /*pageNumber*/ ctx[0];
    	}

    	pagination = new Pagination$1({ props: pagination_props, $$inline: true });
    	binding_callbacks.push(() => bind(pagination, 'pageSize', pagination_pageSize_binding));
    	binding_callbacks.push(() => bind(pagination, 'page', pagination_page_binding));

    	const block = {
    		c: function create() {
    			create_component(datatable.$$.fragment);
    			t = space();
    			create_component(pagination.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(datatable, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(pagination, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const datatable_changes = {};
    			if (dirty & /*pageSize*/ 2) datatable_changes.pageSize = /*pageSize*/ ctx[1];
    			if (dirty & /*pageNumber*/ 1) datatable_changes.page = /*pageNumber*/ ctx[0];
    			if (dirty & /*projects*/ 4) datatable_changes.rows = /*projects*/ ctx[2];

    			if (dirty & /*$$scope, cell, row*/ 896) {
    				datatable_changes.$$scope = { dirty, ctx };
    			}

    			datatable.$set(datatable_changes);
    			const pagination_changes = {};
    			if (dirty & /*totalItems*/ 8) pagination_changes.totalItems = /*totalItems*/ ctx[3];

    			if (!updating_pageSize && dirty & /*pageSize*/ 2) {
    				updating_pageSize = true;
    				pagination_changes.pageSize = /*pageSize*/ ctx[1];
    				add_flush_callback(() => updating_pageSize = false);
    			}

    			if (!updating_page && dirty & /*pageNumber*/ 1) {
    				updating_page = true;
    				pagination_changes.page = /*pageNumber*/ ctx[0];
    				add_flush_callback(() => updating_page = false);
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datatable.$$.fragment, local);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datatable.$$.fragment, local);
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(datatable, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(pagination, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProjectList', slots, []);
    	let { projects = [] } = $$props;
    	let { pageNumber = 1 } = $$props;
    	let { pageSize = 15 } = $$props;
    	let { totalItems = 0 } = $$props;

    	const headers = [
    		{ key: "name", value: "Name" },
    		{ key: "source", value: "Source" },
    		{ key: "namespace", value: "Namespace" },
    		{ key: "homepage", value: "Homepage" },
    		{ key: "overflow", empty: true }
    	];

    	const writable_props = ['projects', 'pageNumber', 'pageSize', 'totalItems'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProjectList> was created with unknown prop '${key}'`);
    	});

    	function pagination_pageSize_binding(value) {
    		pageSize = value;
    		$$invalidate(1, pageSize);
    	}

    	function pagination_page_binding(value) {
    		pageNumber = value;
    		$$invalidate(0, pageNumber);
    	}

    	$$self.$$set = $$props => {
    		if ('projects' in $$props) $$invalidate(2, projects = $$props.projects);
    		if ('pageNumber' in $$props) $$invalidate(0, pageNumber = $$props.pageNumber);
    		if ('pageSize' in $$props) $$invalidate(1, pageSize = $$props.pageSize);
    		if ('totalItems' in $$props) $$invalidate(3, totalItems = $$props.totalItems);
    	};

    	$$self.$capture_state = () => ({
    		DataTable: DataTable$1,
    		Pagination: Pagination$1,
    		OverflowMenu: OverflowMenu$1,
    		OverflowMenuItem: OverflowMenuItem$1,
    		projects,
    		pageNumber,
    		pageSize,
    		totalItems,
    		headers
    	});

    	$$self.$inject_state = $$props => {
    		if ('projects' in $$props) $$invalidate(2, projects = $$props.projects);
    		if ('pageNumber' in $$props) $$invalidate(0, pageNumber = $$props.pageNumber);
    		if ('pageSize' in $$props) $$invalidate(1, pageSize = $$props.pageSize);
    		if ('totalItems' in $$props) $$invalidate(3, totalItems = $$props.totalItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		pageNumber,
    		pageSize,
    		projects,
    		totalItems,
    		headers,
    		pagination_pageSize_binding,
    		pagination_page_binding
    	];
    }

    class ProjectList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			projects: 2,
    			pageNumber: 0,
    			pageSize: 1,
    			totalItems: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProjectList",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get projects() {
    		throw new Error("<ProjectList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set projects(value) {
    		throw new Error("<ProjectList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageNumber() {
    		throw new Error("<ProjectList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageNumber(value) {
    		throw new Error("<ProjectList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSize() {
    		throw new Error("<ProjectList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSize(value) {
    		throw new Error("<ProjectList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get totalItems() {
    		throw new Error("<ProjectList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalItems(value) {
    		throw new Error("<ProjectList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\projects\Projects.svelte generated by Svelte v3.49.0 */

    const { Object: Object_1 } = globals;
    const file$4 = "src\\projects\\Projects.svelte";

    // (32:8) {#if loading}
    function create_if_block$1(ctx) {
    	let overlayloading;
    	let current;

    	overlayloading = new OverlayLoading({
    			props: {
    				duration: "400",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overlayloading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overlayloading, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overlayloading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overlayloading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overlayloading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(32:8) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (33:12) <OverlayLoading duration="400">
    function create_default_slot_4(ctx) {
    	let wave;
    	let current;
    	wave = new Wave({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(wave.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(wave, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wave.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wave.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(wave, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(33:12) <OverlayLoading duration=\\\"400\\\">",
    		ctx
    	});

    	return block;
    }

    // (38:12) <Row>
    function create_default_slot_3$2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Projects Registry";
    			add_location(h1, file$4, 38, 16, 1172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(38:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (42:16) <Column noGutter>
    function create_default_slot_2$2(ctx) {
    	let projectlist;
    	let current;

    	projectlist = new ProjectList({
    			props: {
    				projects: /*state*/ ctx[1].projects,
    				pageNumber: /*state*/ ctx[1].pageNumber,
    				pageSize: /*state*/ ctx[1].pageSize,
    				totalItems: /*state*/ ctx[1].totalItems
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(projectlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(projectlist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const projectlist_changes = {};
    			if (dirty & /*state*/ 2) projectlist_changes.projects = /*state*/ ctx[1].projects;
    			if (dirty & /*state*/ 2) projectlist_changes.pageNumber = /*state*/ ctx[1].pageNumber;
    			if (dirty & /*state*/ 2) projectlist_changes.pageSize = /*state*/ ctx[1].pageSize;
    			if (dirty & /*state*/ 2) projectlist_changes.totalItems = /*state*/ ctx[1].totalItems;
    			projectlist.$set(projectlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projectlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projectlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(projectlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(42:16) <Column noGutter>",
    		ctx
    	});

    	return block;
    }

    // (41:12) <Row padding>
    function create_default_slot_1$3(ctx) {
    	let column;
    	let current;

    	column = new Column$1({
    			props: {
    				noGutter: true,
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};

    			if (dirty & /*$$scope, state*/ 6) {
    				column_changes.$$scope = { dirty, ctx };
    			}

    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(41:12) <Row padding>",
    		ctx
    	});

    	return block;
    }

    // (37:8) <Grid fullWidth>
    function create_default_slot$3(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row$1({
    			props: {
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row$1({
    			props: {
    				padding: true,
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope, state*/ 6) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(row1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(37:8) <Grid fullWidth>",
    		ctx
    	});

    	return block;
    }

    // (31:4) 
    function create_content_slot$2(ctx) {
    	let div;
    	let t;
    	let grid;
    	let current;
    	let if_block = /*loading*/ ctx[0] && create_if_block$1(ctx);

    	grid = new Grid$1({
    			props: {
    				fullWidth: true,
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			create_component(grid.$$.fragment);
    			attr_dev(div, "slot", "content");
    			add_location(div, file$4, 30, 4, 949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);
    			mount_component(grid, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*loading*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*loading*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const grid_changes = {};

    			if (dirty & /*$$scope, state*/ 6) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(grid);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$2.name,
    		type: "slot",
    		source: "(31:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let defaultlayout;
    	let current;

    	defaultlayout = new DefaultLayout({
    			props: {
    				$$slots: { content: [create_content_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(defaultlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(defaultlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const defaultlayout_changes = {};

    			if (dirty & /*$$scope, state, loading*/ 7) {
    				defaultlayout_changes.$$scope = { dirty, ctx };
    			}

    			defaultlayout.$set(defaultlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(defaultlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(defaultlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(defaultlayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	let loading = false;

    	let state = {
    		projects: [],
    		pageNumber: 1,
    		pageSize: 15,
    		totalItems: 0
    	};

    	onMount(async () => {
    		$$invalidate(0, loading = true);
    		const restClient = new RestClient_1.RestClient({ apiUrl: 'http://localhost:5400/' });

    		try {
    			const result = await restClient.project.list(state.pageNumber, state.pageSize);
    			$$invalidate(1, state = Object.assign({}, result));
    		} catch(_a) {
    			
    		} finally {
    			$$invalidate(0, loading = false);
    		}
    	});

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Grid: Grid$1,
    		Row: Row$1,
    		Column: Column$1,
    		onMount,
    		RestClient: RestClient_1.RestClient,
    		OverlayLoading,
    		Wave,
    		DefaultLayout,
    		ProjectList,
    		loading,
    		state
    	});

    	$$self.$inject_state = $$props => {
    		if ('loading' in $$props) $$invalidate(0, loading = $$props.loading);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loading, state];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\packages\components\PackageList.svelte generated by Svelte v3.49.0 */
    const file$3 = "src\\packages\\components\\PackageList.svelte";

    // (48:0) {#if loading}
    function create_if_block_1(ctx) {
    	let overlayloading;
    	let current;

    	overlayloading = new OverlayLoading({
    			props: {
    				duration: "400",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overlayloading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overlayloading, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overlayloading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overlayloading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overlayloading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(48:0) {#if loading}",
    		ctx
    	});

    	return block;
    }

    // (49:4) <OverlayLoading duration="400">
    function create_default_slot_1$2(ctx) {
    	let wave;
    	let current;
    	wave = new Wave({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(wave.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(wave, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(wave.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(wave.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(wave, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(49:4) <OverlayLoading duration=\\\"400\\\">",
    		ctx
    	});

    	return block;
    }

    // (65:4) <svelte:fragment slot="expanded-row" let:row>
    function create_expanded_row_slot(ctx) {
    	let h4;
    	let t1;
    	let p;
    	let t2_value = /*row*/ ctx[9].description + "";
    	let t2;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			h4.textContent = "Description";
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			add_location(h4, file$3, 65, 8, 1667);
    			add_location(p, file$3, 66, 8, 1697);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row*/ 512 && t2_value !== (t2_value = /*row*/ ctx[9].description + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_expanded_row_slot.name,
    		type: "slot",
    		source: "(65:4) <svelte:fragment slot=\\\"expanded-row\\\" let:row>",
    		ctx
    	});

    	return block;
    }

    // (76:8) {:else}
    function create_else_block(ctx) {
    	let t_value = /*cell*/ ctx[8].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cell*/ 256 && t_value !== (t_value = /*cell*/ ctx[8].value + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(76:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (71:8) {#if cell.key === "overflow"}
    function create_if_block(ctx) {
    	let overflowmenu;
    	let current;

    	overflowmenu = new OverflowMenu$1({
    			props: {
    				flipped: true,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overflowmenu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overflowmenu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const overflowmenu_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				overflowmenu_changes.$$scope = { dirty, ctx };
    			}

    			overflowmenu.$set(overflowmenu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overflowmenu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overflowmenu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overflowmenu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(71:8) {#if cell.key === \\\"overflow\\\"}",
    		ctx
    	});

    	return block;
    }

    // (72:12) <OverflowMenu flipped>
    function create_default_slot$2(ctx) {
    	let overflowmenuitem0;
    	let t;
    	let overflowmenuitem1;
    	let current;

    	overflowmenuitem0 = new OverflowMenuItem$1({
    			props: { text: "Show Details" },
    			$$inline: true
    		});

    	overflowmenuitem1 = new OverflowMenuItem$1({
    			props: { text: "Schedule Scan" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(overflowmenuitem0.$$.fragment);
    			t = space();
    			create_component(overflowmenuitem1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(overflowmenuitem0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(overflowmenuitem1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overflowmenuitem0.$$.fragment, local);
    			transition_in(overflowmenuitem1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overflowmenuitem0.$$.fragment, local);
    			transition_out(overflowmenuitem1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(overflowmenuitem0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(overflowmenuitem1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(72:12) <OverflowMenu flipped>",
    		ctx
    	});

    	return block;
    }

    // (70:4) <svelte:fragment slot="cell" let:cell>
    function create_cell_slot(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*cell*/ ctx[8].key === "overflow") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_cell_slot.name,
    		type: "slot",
    		source: "(70:4) <svelte:fragment slot=\\\"cell\\\" let:cell>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t0;
    	let datatable;
    	let t1;
    	let pagination;
    	let updating_pageSize;
    	let updating_page;
    	let current;
    	let if_block = /*loading*/ ctx[4] && create_if_block_1(ctx);

    	datatable = new DataTable$1({
    			props: {
    				title: "Packages",
    				description: "Pluralscan package registry.",
    				size: "medium",
    				pageSize: /*pageSize*/ ctx[2],
    				page: /*pageNumber*/ ctx[1],
    				sortable: true,
    				expandable: true,
    				rows: /*packages*/ ctx[0],
    				headers: /*headers*/ ctx[5],
    				$$slots: {
    					cell: [
    						create_cell_slot,
    						({ cell }) => ({ 8: cell }),
    						({ cell }) => cell ? 256 : 0
    					],
    					"expanded-row": [
    						create_expanded_row_slot,
    						({ row }) => ({ 9: row }),
    						({ row }) => row ? 512 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function pagination_pageSize_binding(value) {
    		/*pagination_pageSize_binding*/ ctx[6](value);
    	}

    	function pagination_page_binding(value) {
    		/*pagination_page_binding*/ ctx[7](value);
    	}

    	let pagination_props = {
    		totalItems: /*totalItems*/ ctx[3],
    		pageSizeInputDisabled: true
    	};

    	if (/*pageSize*/ ctx[2] !== void 0) {
    		pagination_props.pageSize = /*pageSize*/ ctx[2];
    	}

    	if (/*pageNumber*/ ctx[1] !== void 0) {
    		pagination_props.page = /*pageNumber*/ ctx[1];
    	}

    	pagination = new Pagination$1({ props: pagination_props, $$inline: true });
    	binding_callbacks.push(() => bind(pagination, 'pageSize', pagination_pageSize_binding));
    	binding_callbacks.push(() => bind(pagination, 'page', pagination_page_binding));

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(datatable.$$.fragment);
    			t1 = space();
    			create_component(pagination.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(datatable, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(pagination, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*loading*/ ctx[4]) {
    				if (if_block) {
    					if (dirty & /*loading*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const datatable_changes = {};
    			if (dirty & /*pageSize*/ 4) datatable_changes.pageSize = /*pageSize*/ ctx[2];
    			if (dirty & /*pageNumber*/ 2) datatable_changes.page = /*pageNumber*/ ctx[1];
    			if (dirty & /*packages*/ 1) datatable_changes.rows = /*packages*/ ctx[0];

    			if (dirty & /*$$scope, cell, row*/ 1792) {
    				datatable_changes.$$scope = { dirty, ctx };
    			}

    			datatable.$set(datatable_changes);
    			const pagination_changes = {};
    			if (dirty & /*totalItems*/ 8) pagination_changes.totalItems = /*totalItems*/ ctx[3];

    			if (!updating_pageSize && dirty & /*pageSize*/ 4) {
    				updating_pageSize = true;
    				pagination_changes.pageSize = /*pageSize*/ ctx[2];
    				add_flush_callback(() => updating_pageSize = false);
    			}

    			if (!updating_page && dirty & /*pageNumber*/ 2) {
    				updating_page = true;
    				pagination_changes.page = /*pageNumber*/ ctx[1];
    				add_flush_callback(() => updating_page = false);
    			}

    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(datatable.$$.fragment, local);
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(datatable.$$.fragment, local);
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(datatable, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(pagination, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PackageList', slots, []);
    	let { packages = [] } = $$props;
    	let { pageNumber = 1 } = $$props;
    	let { pageSize = 15 } = $$props;
    	let { totalItems = 0 } = $$props;
    	let loading = false;

    	onMount(async () => {
    		const restClient = new RestClient_1.RestClient({ apiUrl: 'http://localhost:5400/' });

    		try {
    			$$invalidate(4, loading = true);
    			const result = await restClient.package.list(pageNumber, pageSize);
    			$$invalidate(0, packages = result.packages);
    			$$invalidate(3, totalItems = result.totalItems);
    			$$invalidate(1, pageNumber = result.pageNumber);
    			$$invalidate(2, pageSize = result.pageSize);
    		} catch(_a) {
    			
    		} finally {
    			$$invalidate(4, loading = false);
    		}
    	});

    	const headers = [
    		{ key: "name", value: "Name" },
    		{ key: "version", value: "Version" },
    		{ key: "registry", value: "Registry" },
    		{
    			key: "published_at",
    			value: "Published at"
    		},
    		{ key: "overflow", empty: true }
    	];

    	const writable_props = ['packages', 'pageNumber', 'pageSize', 'totalItems'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PackageList> was created with unknown prop '${key}'`);
    	});

    	function pagination_pageSize_binding(value) {
    		pageSize = value;
    		$$invalidate(2, pageSize);
    	}

    	function pagination_page_binding(value) {
    		pageNumber = value;
    		$$invalidate(1, pageNumber);
    	}

    	$$self.$$set = $$props => {
    		if ('packages' in $$props) $$invalidate(0, packages = $$props.packages);
    		if ('pageNumber' in $$props) $$invalidate(1, pageNumber = $$props.pageNumber);
    		if ('pageSize' in $$props) $$invalidate(2, pageSize = $$props.pageSize);
    		if ('totalItems' in $$props) $$invalidate(3, totalItems = $$props.totalItems);
    	};

    	$$self.$capture_state = () => ({
    		DataTable: DataTable$1,
    		OverflowMenu: OverflowMenu$1,
    		OverflowMenuItem: OverflowMenuItem$1,
    		Pagination: Pagination$1,
    		onMount,
    		RestClient: RestClient_1.RestClient,
    		OverlayLoading,
    		Wave,
    		packages,
    		pageNumber,
    		pageSize,
    		totalItems,
    		loading,
    		headers
    	});

    	$$self.$inject_state = $$props => {
    		if ('packages' in $$props) $$invalidate(0, packages = $$props.packages);
    		if ('pageNumber' in $$props) $$invalidate(1, pageNumber = $$props.pageNumber);
    		if ('pageSize' in $$props) $$invalidate(2, pageSize = $$props.pageSize);
    		if ('totalItems' in $$props) $$invalidate(3, totalItems = $$props.totalItems);
    		if ('loading' in $$props) $$invalidate(4, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		packages,
    		pageNumber,
    		pageSize,
    		totalItems,
    		loading,
    		headers,
    		pagination_pageSize_binding,
    		pagination_page_binding
    	];
    }

    class PackageList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			packages: 0,
    			pageNumber: 1,
    			pageSize: 2,
    			totalItems: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PackageList",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get packages() {
    		throw new Error("<PackageList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set packages(value) {
    		throw new Error("<PackageList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageNumber() {
    		throw new Error("<PackageList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageNumber(value) {
    		throw new Error("<PackageList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSize() {
    		throw new Error("<PackageList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSize(value) {
    		throw new Error("<PackageList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get totalItems() {
    		throw new Error("<PackageList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalItems(value) {
    		throw new Error("<PackageList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\packages\Packages.svelte generated by Svelte v3.49.0 */
    const file$2 = "src\\packages\\Packages.svelte";

    // (9:12) <Row>
    function create_default_slot_3$1(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Packages";
    			add_location(h1, file$2, 9, 16, 327);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(9:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (13:16) <Column noGutter>
    function create_default_slot_2$1(ctx) {
    	let packagelist;
    	let current;
    	packagelist = new PackageList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(packagelist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(packagelist, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(packagelist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(packagelist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(packagelist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(13:16) <Column noGutter>",
    		ctx
    	});

    	return block;
    }

    // (12:12) <Row padding>
    function create_default_slot_1$1(ctx) {
    	let column;
    	let current;

    	column = new Column$1({
    			props: {
    				noGutter: true,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				column_changes.$$scope = { dirty, ctx };
    			}

    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(12:12) <Row padding>",
    		ctx
    	});

    	return block;
    }

    // (8:8) <Grid fullWidth>
    function create_default_slot$1(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row$1({
    			props: {
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row$1({
    			props: {
    				padding: true,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(row1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(8:8) <Grid fullWidth>",
    		ctx
    	});

    	return block;
    }

    // (7:4) 
    function create_content_slot$1(ctx) {
    	let div;
    	let grid;
    	let current;

    	grid = new Grid$1({
    			props: {
    				fullWidth: true,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(grid.$$.fragment);
    			attr_dev(div, "slot", "content");
    			add_location(div, file$2, 6, 4, 244);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(grid, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grid_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(grid);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$1.name,
    		type: "slot",
    		source: "(7:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let defaultlayout;
    	let current;

    	defaultlayout = new DefaultLayout({
    			props: {
    				$$slots: { content: [create_content_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(defaultlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(defaultlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const defaultlayout_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				defaultlayout_changes.$$scope = { dirty, ctx };
    			}

    			defaultlayout.$set(defaultlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(defaultlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(defaultlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(defaultlayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Packages', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Packages> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Grid: Grid$1,
    		Row: Row$1,
    		Column: Column$1,
    		DefaultLayout,
    		PackageList
    	});

    	return [];
    }

    class Packages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Packages",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\scans\components\ScanList.svelte generated by Svelte v3.49.0 */

    function create_fragment$2(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScanList', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ScanList> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class ScanList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScanList",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\scans\Scans.svelte generated by Svelte v3.49.0 */
    const file$1 = "src\\scans\\Scans.svelte";

    // (9:12) <Row>
    function create_default_slot_3(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Scans";
    			add_location(h1, file$1, 9, 16, 321);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(9:12) <Row>",
    		ctx
    	});

    	return block;
    }

    // (13:16) <Column noGutter>
    function create_default_slot_2(ctx) {
    	let scanlist;
    	let current;
    	scanlist = new ScanList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(scanlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(scanlist, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scanlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scanlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scanlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(13:16) <Column noGutter>",
    		ctx
    	});

    	return block;
    }

    // (12:12) <Row padding>
    function create_default_slot_1(ctx) {
    	let column;
    	let current;

    	column = new Column$1({
    			props: {
    				noGutter: true,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				column_changes.$$scope = { dirty, ctx };
    			}

    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(12:12) <Row padding>",
    		ctx
    	});

    	return block;
    }

    // (8:8) <Grid fullWidth>
    function create_default_slot(ctx) {
    	let row0;
    	let t;
    	let row1;
    	let current;

    	row0 = new Row$1({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	row1 = new Row$1({
    			props: {
    				padding: true,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row0.$$.fragment);
    			t = space();
    			create_component(row1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(row1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row0_changes.$$scope = { dirty, ctx };
    			}

    			row0.$set(row0_changes);
    			const row1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				row1_changes.$$scope = { dirty, ctx };
    			}

    			row1.$set(row1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row0.$$.fragment, local);
    			transition_in(row1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row0.$$.fragment, local);
    			transition_out(row1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(row1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(8:8) <Grid fullWidth>",
    		ctx
    	});

    	return block;
    }

    // (7:4) 
    function create_content_slot(ctx) {
    	let div;
    	let grid;
    	let current;

    	grid = new Grid$1({
    			props: {
    				fullWidth: true,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(grid.$$.fragment);
    			attr_dev(div, "slot", "content");
    			add_location(div, file$1, 6, 4, 238);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(grid, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const grid_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				grid_changes.$$scope = { dirty, ctx };
    			}

    			grid.$set(grid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(grid);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot.name,
    		type: "slot",
    		source: "(7:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let defaultlayout;
    	let current;

    	defaultlayout = new DefaultLayout({
    			props: {
    				$$slots: { content: [create_content_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(defaultlayout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(defaultlayout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const defaultlayout_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				defaultlayout_changes.$$scope = { dirty, ctx };
    			}

    			defaultlayout.$set(defaultlayout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(defaultlayout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(defaultlayout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(defaultlayout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Scans', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Scans> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Grid: Grid$1,
    		Row: Row$1,
    		Column: Column$1,
    		DefaultLayout,
    		ScanList
    	});

    	return [];
    }

    class Scans extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scans",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.49.0 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let router;
    	let current;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(router.$$.fragment);
    			attr_dev(main, "class", "svelte-161625f");
    			add_location(main, file, 17, 0, 556);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const routes = {
    		"/": Home,
    		"/analyzers": Analyzers,
    		"/packages": Packages,
    		"/projects": Projects,
    		"/scans": Scans
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Home,
    		Analyzers,
    		Projects,
    		Packages,
    		Scans,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
