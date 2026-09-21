"use strict";
var fc = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // node_modules/fast-check/lib/check/precondition/PreconditionFailure.js
  var require_PreconditionFailure = __commonJS({
    "node_modules/fast-check/lib/check/precondition/PreconditionFailure.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PreconditionFailure = void 0;
      var PreconditionFailure = class _PreconditionFailure extends Error {
        constructor(interruptExecution = false) {
          super();
          this.interruptExecution = interruptExecution;
          this.footprint = _PreconditionFailure.SharedFootPrint;
        }
        static isFailure(err) {
          return err != null && err.footprint === _PreconditionFailure.SharedFootPrint;
        }
      };
      exports.PreconditionFailure = PreconditionFailure;
      PreconditionFailure.SharedFootPrint = /* @__PURE__ */ Symbol.for("fast-check/PreconditionFailure");
    }
  });

  // node_modules/fast-check/lib/check/precondition/Pre.js
  var require_Pre = __commonJS({
    "node_modules/fast-check/lib/check/precondition/Pre.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.pre = pre;
      var PreconditionFailure_1 = require_PreconditionFailure();
      function pre(expectTruthy) {
        if (!expectTruthy) {
          throw new PreconditionFailure_1.PreconditionFailure();
        }
      }
    }
  });

  // node_modules/fast-check/lib/stream/StreamHelpers.js
  var require_StreamHelpers = __commonJS({
    "node_modules/fast-check/lib/stream/StreamHelpers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.nilHelper = nilHelper;
      exports.mapHelper = mapHelper;
      exports.flatMapHelper = flatMapHelper;
      exports.filterHelper = filterHelper;
      exports.takeNHelper = takeNHelper;
      exports.takeWhileHelper = takeWhileHelper;
      exports.joinHelper = joinHelper;
      var Nil = class {
        [Symbol.iterator]() {
          return this;
        }
        next(value) {
          return { value, done: true };
        }
      };
      Nil.nil = new Nil();
      function nilHelper() {
        return Nil.nil;
      }
      function* mapHelper(g, f) {
        for (const v of g) {
          yield f(v);
        }
      }
      function* flatMapHelper(g, f) {
        for (const v of g) {
          yield* f(v);
        }
      }
      function* filterHelper(g, f) {
        for (const v of g) {
          if (f(v)) {
            yield v;
          }
        }
      }
      function* takeNHelper(g, n) {
        for (let i = 0; i < n; ++i) {
          const cur = g.next();
          if (cur.done) {
            break;
          }
          yield cur.value;
        }
      }
      function* takeWhileHelper(g, f) {
        let cur = g.next();
        while (!cur.done && f(cur.value)) {
          yield cur.value;
          cur = g.next();
        }
      }
      function* joinHelper(g, others) {
        for (let cur = g.next(); !cur.done; cur = g.next()) {
          yield cur.value;
        }
        for (const s of others) {
          for (let cur = s.next(); !cur.done; cur = s.next()) {
            yield cur.value;
          }
        }
      }
    }
  });

  // node_modules/fast-check/lib/stream/Stream.js
  var require_Stream = __commonJS({
    "node_modules/fast-check/lib/stream/Stream.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Stream = void 0;
      exports.stream = stream;
      var StreamHelpers_1 = require_StreamHelpers();
      var safeSymbolIterator = Symbol.iterator;
      var Stream = class _Stream {
        static nil() {
          return new _Stream((0, StreamHelpers_1.nilHelper)());
        }
        static of(...elements) {
          return new _Stream(elements[safeSymbolIterator]());
        }
        constructor(g) {
          this.g = g;
        }
        next() {
          return this.g.next();
        }
        [Symbol.iterator]() {
          return this.g;
        }
        map(f) {
          return new _Stream((0, StreamHelpers_1.mapHelper)(this.g, f));
        }
        flatMap(f) {
          return new _Stream((0, StreamHelpers_1.flatMapHelper)(this.g, f));
        }
        dropWhile(f) {
          let foundEligible = false;
          function* helper(v) {
            if (foundEligible || !f(v)) {
              foundEligible = true;
              yield v;
            }
          }
          return this.flatMap(helper);
        }
        drop(n) {
          if (n <= 0) {
            return this;
          }
          let idx = 0;
          function helper() {
            return idx++ < n;
          }
          return this.dropWhile(helper);
        }
        takeWhile(f) {
          return new _Stream((0, StreamHelpers_1.takeWhileHelper)(this.g, f));
        }
        take(n) {
          return new _Stream((0, StreamHelpers_1.takeNHelper)(this.g, n));
        }
        filter(f) {
          return new _Stream((0, StreamHelpers_1.filterHelper)(this.g, f));
        }
        every(f) {
          for (const v of this.g) {
            if (!f(v)) {
              return false;
            }
          }
          return true;
        }
        has(f) {
          for (const v of this.g) {
            if (f(v)) {
              return [true, v];
            }
          }
          return [false, null];
        }
        join(...others) {
          return new _Stream((0, StreamHelpers_1.joinHelper)(this.g, others));
        }
        getNthOrLast(nth) {
          let remaining = nth;
          let last = null;
          for (const v of this.g) {
            if (remaining-- === 0)
              return v;
            last = v;
          }
          return last;
        }
      };
      exports.Stream = Stream;
      function stream(g) {
        return new Stream(g);
      }
    }
  });

  // node_modules/fast-check/lib/check/symbols.js
  var require_symbols = __commonJS({
    "node_modules/fast-check/lib/check/symbols.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.cloneMethod = void 0;
      exports.hasCloneMethod = hasCloneMethod;
      exports.cloneIfNeeded = cloneIfNeeded;
      exports.cloneMethod = /* @__PURE__ */ Symbol.for("fast-check/cloneMethod");
      function hasCloneMethod(instance) {
        return instance !== null && (typeof instance === "object" || typeof instance === "function") && exports.cloneMethod in instance && typeof instance[exports.cloneMethod] === "function";
      }
      function cloneIfNeeded(instance) {
        return hasCloneMethod(instance) ? instance[exports.cloneMethod]() : instance;
      }
    }
  });

  // node_modules/fast-check/lib/check/arbitrary/definition/Value.js
  var require_Value = __commonJS({
    "node_modules/fast-check/lib/check/arbitrary/definition/Value.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Value = void 0;
      var symbols_1 = require_symbols();
      var safeObjectDefineProperty = Object.defineProperty;
      var Value = class {
        constructor(value_, context, customGetValue = void 0) {
          this.value_ = value_;
          this.context = context;
          this.hasToBeCloned = customGetValue !== void 0 || (0, symbols_1.hasCloneMethod)(value_);
          this.readOnce = false;
          if (this.hasToBeCloned) {
            safeObjectDefineProperty(this, "value", { get: customGetValue !== void 0 ? customGetValue : this.getValue });
          } else {
            this.value = value_;
          }
        }
        getValue() {
          if (this.hasToBeCloned) {
            if (!this.readOnce) {
              this.readOnce = true;
              return this.value_;
            }
            return this.value_[symbols_1.cloneMethod]();
          }
          return this.value_;
        }
      };
      exports.Value = Value;
    }
  });

  // node_modules/fast-check/lib/check/arbitrary/definition/Arbitrary.js
  var require_Arbitrary = __commonJS({
    "node_modules/fast-check/lib/check/arbitrary/definition/Arbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Arbitrary = void 0;
      exports.isArbitrary = isArbitrary;
      exports.assertIsArbitrary = assertIsArbitrary;
      var Stream_1 = require_Stream();
      var symbols_1 = require_symbols();
      var Value_1 = require_Value();
      var safeObjectAssign = Object.assign;
      var Arbitrary = class {
        filter(refinement) {
          return new FilterArbitrary(this, refinement);
        }
        map(mapper, unmapper) {
          return new MapArbitrary(this, mapper, unmapper);
        }
        chain(chainer) {
          return new ChainArbitrary(this, chainer);
        }
        noShrink() {
          return new NoShrinkArbitrary(this);
        }
        noBias() {
          return new NoBiasArbitrary(this);
        }
      };
      exports.Arbitrary = Arbitrary;
      var ChainArbitrary = class extends Arbitrary {
        constructor(arb, chainer) {
          super();
          this.arb = arb;
          this.chainer = chainer;
        }
        generate(mrng, biasFactor) {
          const clonedMrng = mrng.clone();
          const src = this.arb.generate(mrng, biasFactor);
          return this.valueChainer(src, mrng, clonedMrng, biasFactor);
        }
        canShrinkWithoutContext(value) {
          return false;
        }
        shrink(value, context) {
          if (this.isSafeContext(context)) {
            return (!context.stoppedForOriginal ? this.arb.shrink(context.originalValue, context.originalContext).map((v) => this.valueChainer(v, context.clonedMrng.clone(), context.clonedMrng, context.originalBias)) : Stream_1.Stream.nil()).join(context.chainedArbitrary.shrink(value, context.chainedContext).map((dst) => {
              const newContext = safeObjectAssign(safeObjectAssign({}, context), {
                chainedContext: dst.context,
                stoppedForOriginal: true
              });
              return new Value_1.Value(dst.value_, newContext);
            }));
          }
          return Stream_1.Stream.nil();
        }
        valueChainer(v, generateMrng, clonedMrng, biasFactor) {
          const chainedArbitrary = this.chainer(v.value_);
          const dst = chainedArbitrary.generate(generateMrng, biasFactor);
          const context = {
            originalBias: biasFactor,
            originalValue: v.value_,
            originalContext: v.context,
            stoppedForOriginal: false,
            chainedArbitrary,
            chainedContext: dst.context,
            clonedMrng
          };
          return new Value_1.Value(dst.value_, context);
        }
        isSafeContext(context) {
          return context != null && typeof context === "object" && "originalBias" in context && "originalValue" in context && "originalContext" in context && "stoppedForOriginal" in context && "chainedArbitrary" in context && "chainedContext" in context && "clonedMrng" in context;
        }
      };
      var MapArbitrary = class extends Arbitrary {
        constructor(arb, mapper, unmapper) {
          super();
          this.arb = arb;
          this.mapper = mapper;
          this.unmapper = unmapper;
          this.bindValueMapper = (v) => this.valueMapper(v);
        }
        generate(mrng, biasFactor) {
          const g = this.arb.generate(mrng, biasFactor);
          return this.valueMapper(g);
        }
        canShrinkWithoutContext(value) {
          if (this.unmapper !== void 0) {
            try {
              const unmapped = this.unmapper(value);
              return this.arb.canShrinkWithoutContext(unmapped);
            } catch (_err) {
              return false;
            }
          }
          return false;
        }
        shrink(value, context) {
          if (this.isSafeContext(context)) {
            return this.arb.shrink(context.originalValue, context.originalContext).map(this.bindValueMapper);
          }
          if (this.unmapper !== void 0) {
            const unmapped = this.unmapper(value);
            return this.arb.shrink(unmapped, void 0).map(this.bindValueMapper);
          }
          return Stream_1.Stream.nil();
        }
        mapperWithCloneIfNeeded(v) {
          const sourceValue = v.value;
          const mappedValue = this.mapper(sourceValue);
          if (v.hasToBeCloned && (typeof mappedValue === "object" && mappedValue !== null || typeof mappedValue === "function") && Object.isExtensible(mappedValue) && !(0, symbols_1.hasCloneMethod)(mappedValue)) {
            Object.defineProperty(mappedValue, symbols_1.cloneMethod, { get: () => () => this.mapperWithCloneIfNeeded(v)[0] });
          }
          return [mappedValue, sourceValue];
        }
        valueMapper(v) {
          const [mappedValue, sourceValue] = this.mapperWithCloneIfNeeded(v);
          const context = { originalValue: sourceValue, originalContext: v.context };
          return new Value_1.Value(mappedValue, context);
        }
        isSafeContext(context) {
          return context != null && typeof context === "object" && "originalValue" in context && "originalContext" in context;
        }
      };
      var FilterArbitrary = class extends Arbitrary {
        constructor(arb, refinement) {
          super();
          this.arb = arb;
          this.refinement = refinement;
          this.bindRefinementOnValue = (v) => this.refinementOnValue(v);
        }
        generate(mrng, biasFactor) {
          while (true) {
            const g = this.arb.generate(mrng, biasFactor);
            if (this.refinementOnValue(g)) {
              return g;
            }
          }
        }
        canShrinkWithoutContext(value) {
          return this.arb.canShrinkWithoutContext(value) && this.refinement(value);
        }
        shrink(value, context) {
          return this.arb.shrink(value, context).filter(this.bindRefinementOnValue);
        }
        refinementOnValue(v) {
          return this.refinement(v.value);
        }
      };
      var NoShrinkArbitrary = class extends Arbitrary {
        constructor(arb) {
          super();
          this.arb = arb;
        }
        generate(mrng, biasFactor) {
          return this.arb.generate(mrng, biasFactor);
        }
        canShrinkWithoutContext(value) {
          return this.arb.canShrinkWithoutContext(value);
        }
        shrink(_value, _context) {
          return Stream_1.Stream.nil();
        }
        noShrink() {
          return this;
        }
      };
      var NoBiasArbitrary = class extends Arbitrary {
        constructor(arb) {
          super();
          this.arb = arb;
        }
        generate(mrng, _biasFactor) {
          return this.arb.generate(mrng, void 0);
        }
        canShrinkWithoutContext(value) {
          return this.arb.canShrinkWithoutContext(value);
        }
        shrink(value, context) {
          return this.arb.shrink(value, context);
        }
        noBias() {
          return this;
        }
      };
      function isArbitrary(instance) {
        return typeof instance === "object" && instance !== null && "generate" in instance && "shrink" in instance && "canShrinkWithoutContext" in instance;
      }
      function assertIsArbitrary(instance) {
        if (!isArbitrary(instance)) {
          throw new Error("Unexpected value received: not an instance of Arbitrary");
        }
      }
    }
  });

  // node_modules/fast-check/lib/utils/apply.js
  var require_apply = __commonJS({
    "node_modules/fast-check/lib/utils/apply.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.safeApply = safeApply;
      var untouchedApply = Function.prototype.apply;
      var ApplySymbol = /* @__PURE__ */ Symbol("apply");
      function safeExtractApply(f) {
        try {
          return f.apply;
        } catch (err) {
          return void 0;
        }
      }
      function safeApplyHacky(f, instance, args) {
        const ff = f;
        ff[ApplySymbol] = untouchedApply;
        const out = ff[ApplySymbol](instance, args);
        delete ff[ApplySymbol];
        return out;
      }
      function safeApply(f, instance, args) {
        if (safeExtractApply(f) === untouchedApply) {
          return f.apply(instance, args);
        }
        return safeApplyHacky(f, instance, args);
      }
    }
  });

  // node_modules/fast-check/lib/utils/globals.js
  var require_globals = __commonJS({
    "node_modules/fast-check/lib/utils/globals.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.encodeURIComponent = exports.Uint32Array = exports.Uint16Array = exports.Uint8ClampedArray = exports.Uint8Array = exports.Set = exports.String = exports.Number = exports.Int32Array = exports.Int16Array = exports.Int8Array = exports.Float64Array = exports.Float32Array = exports.Error = exports.Date = exports.Boolean = exports.BigUint64Array = exports.BigInt64Array = exports.BigInt = exports.Array = void 0;
      exports.safeForEach = safeForEach;
      exports.safeIndexOf = safeIndexOf;
      exports.safeJoin = safeJoin;
      exports.safeMap = safeMap;
      exports.safeFilter = safeFilter;
      exports.safePush = safePush;
      exports.safePop = safePop;
      exports.safeSplice = safeSplice;
      exports.safeSlice = safeSlice;
      exports.safeSort = safeSort;
      exports.safeEvery = safeEvery;
      exports.safeGetTime = safeGetTime;
      exports.safeToISOString = safeToISOString;
      exports.safeAdd = safeAdd;
      exports.safeSplit = safeSplit;
      exports.safeStartsWith = safeStartsWith;
      exports.safeEndsWith = safeEndsWith;
      exports.safeSubstring = safeSubstring;
      exports.safeToLowerCase = safeToLowerCase;
      exports.safeToUpperCase = safeToUpperCase;
      exports.safePadStart = safePadStart;
      exports.safeCharCodeAt = safeCharCodeAt;
      exports.safeReplace = safeReplace;
      exports.safeNumberToString = safeNumberToString;
      exports.safeHasOwnProperty = safeHasOwnProperty;
      exports.safeToString = safeToString;
      var apply_1 = require_apply();
      var SArray = typeof Array !== "undefined" ? Array : void 0;
      exports.Array = SArray;
      var SBigInt = typeof BigInt !== "undefined" ? BigInt : void 0;
      exports.BigInt = SBigInt;
      var SBigInt64Array = typeof BigInt64Array !== "undefined" ? BigInt64Array : void 0;
      exports.BigInt64Array = SBigInt64Array;
      var SBigUint64Array = typeof BigUint64Array !== "undefined" ? BigUint64Array : void 0;
      exports.BigUint64Array = SBigUint64Array;
      var SBoolean = typeof Boolean !== "undefined" ? Boolean : void 0;
      exports.Boolean = SBoolean;
      var SDate = typeof Date !== "undefined" ? Date : void 0;
      exports.Date = SDate;
      var SError = typeof Error !== "undefined" ? Error : void 0;
      exports.Error = SError;
      var SFloat32Array = typeof Float32Array !== "undefined" ? Float32Array : void 0;
      exports.Float32Array = SFloat32Array;
      var SFloat64Array = typeof Float64Array !== "undefined" ? Float64Array : void 0;
      exports.Float64Array = SFloat64Array;
      var SInt8Array = typeof Int8Array !== "undefined" ? Int8Array : void 0;
      exports.Int8Array = SInt8Array;
      var SInt16Array = typeof Int16Array !== "undefined" ? Int16Array : void 0;
      exports.Int16Array = SInt16Array;
      var SInt32Array = typeof Int32Array !== "undefined" ? Int32Array : void 0;
      exports.Int32Array = SInt32Array;
      var SNumber = typeof Number !== "undefined" ? Number : void 0;
      exports.Number = SNumber;
      var SString = typeof String !== "undefined" ? String : void 0;
      exports.String = SString;
      var SSet = typeof Set !== "undefined" ? Set : void 0;
      exports.Set = SSet;
      var SUint8Array = typeof Uint8Array !== "undefined" ? Uint8Array : void 0;
      exports.Uint8Array = SUint8Array;
      var SUint8ClampedArray = typeof Uint8ClampedArray !== "undefined" ? Uint8ClampedArray : void 0;
      exports.Uint8ClampedArray = SUint8ClampedArray;
      var SUint16Array = typeof Uint16Array !== "undefined" ? Uint16Array : void 0;
      exports.Uint16Array = SUint16Array;
      var SUint32Array = typeof Uint32Array !== "undefined" ? Uint32Array : void 0;
      exports.Uint32Array = SUint32Array;
      var SencodeURIComponent = typeof encodeURIComponent !== "undefined" ? encodeURIComponent : void 0;
      exports.encodeURIComponent = SencodeURIComponent;
      var untouchedForEach = Array.prototype.forEach;
      var untouchedIndexOf = Array.prototype.indexOf;
      var untouchedJoin = Array.prototype.join;
      var untouchedMap = Array.prototype.map;
      var untouchedFilter = Array.prototype.filter;
      var untouchedPush = Array.prototype.push;
      var untouchedPop = Array.prototype.pop;
      var untouchedSplice = Array.prototype.splice;
      var untouchedSlice = Array.prototype.slice;
      var untouchedSort = Array.prototype.sort;
      var untouchedEvery = Array.prototype.every;
      function extractForEach(instance) {
        try {
          return instance.forEach;
        } catch (err) {
          return void 0;
        }
      }
      function extractIndexOf(instance) {
        try {
          return instance.indexOf;
        } catch (err) {
          return void 0;
        }
      }
      function extractJoin(instance) {
        try {
          return instance.join;
        } catch (err) {
          return void 0;
        }
      }
      function extractMap(instance) {
        try {
          return instance.map;
        } catch (err) {
          return void 0;
        }
      }
      function extractFilter(instance) {
        try {
          return instance.filter;
        } catch (err) {
          return void 0;
        }
      }
      function extractPush(instance) {
        try {
          return instance.push;
        } catch (err) {
          return void 0;
        }
      }
      function extractPop(instance) {
        try {
          return instance.pop;
        } catch (err) {
          return void 0;
        }
      }
      function extractSplice(instance) {
        try {
          return instance.splice;
        } catch (err) {
          return void 0;
        }
      }
      function extractSlice(instance) {
        try {
          return instance.slice;
        } catch (err) {
          return void 0;
        }
      }
      function extractSort(instance) {
        try {
          return instance.sort;
        } catch (err) {
          return void 0;
        }
      }
      function extractEvery(instance) {
        try {
          return instance.every;
        } catch (err) {
          return void 0;
        }
      }
      function safeForEach(instance, fn) {
        if (extractForEach(instance) === untouchedForEach) {
          return instance.forEach(fn);
        }
        return (0, apply_1.safeApply)(untouchedForEach, instance, [fn]);
      }
      function safeIndexOf(instance, ...args) {
        if (extractIndexOf(instance) === untouchedIndexOf) {
          return instance.indexOf(...args);
        }
        return (0, apply_1.safeApply)(untouchedIndexOf, instance, args);
      }
      function safeJoin(instance, ...args) {
        if (extractJoin(instance) === untouchedJoin) {
          return instance.join(...args);
        }
        return (0, apply_1.safeApply)(untouchedJoin, instance, args);
      }
      function safeMap(instance, fn) {
        if (extractMap(instance) === untouchedMap) {
          return instance.map(fn);
        }
        return (0, apply_1.safeApply)(untouchedMap, instance, [fn]);
      }
      function safeFilter(instance, predicate) {
        if (extractFilter(instance) === untouchedFilter) {
          return instance.filter(predicate);
        }
        return (0, apply_1.safeApply)(untouchedFilter, instance, [predicate]);
      }
      function safePush(instance, ...args) {
        if (extractPush(instance) === untouchedPush) {
          return instance.push(...args);
        }
        return (0, apply_1.safeApply)(untouchedPush, instance, args);
      }
      function safePop(instance) {
        if (extractPop(instance) === untouchedPop) {
          return instance.pop();
        }
        return (0, apply_1.safeApply)(untouchedPop, instance, []);
      }
      function safeSplice(instance, ...args) {
        if (extractSplice(instance) === untouchedSplice) {
          return instance.splice(...args);
        }
        return (0, apply_1.safeApply)(untouchedSplice, instance, args);
      }
      function safeSlice(instance, ...args) {
        if (extractSlice(instance) === untouchedSlice) {
          return instance.slice(...args);
        }
        return (0, apply_1.safeApply)(untouchedSlice, instance, args);
      }
      function safeSort(instance, ...args) {
        if (extractSort(instance) === untouchedSort) {
          return instance.sort(...args);
        }
        return (0, apply_1.safeApply)(untouchedSort, instance, args);
      }
      function safeEvery(instance, ...args) {
        if (extractEvery(instance) === untouchedEvery) {
          return instance.every(...args);
        }
        return (0, apply_1.safeApply)(untouchedEvery, instance, args);
      }
      var untouchedGetTime = Date.prototype.getTime;
      var untouchedToISOString = Date.prototype.toISOString;
      function extractGetTime(instance) {
        try {
          return instance.getTime;
        } catch (err) {
          return void 0;
        }
      }
      function extractToISOString(instance) {
        try {
          return instance.toISOString;
        } catch (err) {
          return void 0;
        }
      }
      function safeGetTime(instance) {
        if (extractGetTime(instance) === untouchedGetTime) {
          return instance.getTime();
        }
        return (0, apply_1.safeApply)(untouchedGetTime, instance, []);
      }
      function safeToISOString(instance) {
        if (extractToISOString(instance) === untouchedToISOString) {
          return instance.toISOString();
        }
        return (0, apply_1.safeApply)(untouchedToISOString, instance, []);
      }
      var untouchedAdd = Set.prototype.add;
      function extractAdd(instance) {
        try {
          return instance.add;
        } catch (err) {
          return void 0;
        }
      }
      function safeAdd(instance, value) {
        if (extractAdd(instance) === untouchedAdd) {
          return instance.add(value);
        }
        return (0, apply_1.safeApply)(untouchedAdd, instance, [value]);
      }
      var untouchedSplit = String.prototype.split;
      var untouchedStartsWith = String.prototype.startsWith;
      var untouchedEndsWith = String.prototype.endsWith;
      var untouchedSubstring = String.prototype.substring;
      var untouchedToLowerCase = String.prototype.toLowerCase;
      var untouchedToUpperCase = String.prototype.toUpperCase;
      var untouchedPadStart = String.prototype.padStart;
      var untouchedCharCodeAt = String.prototype.charCodeAt;
      var untouchedReplace = String.prototype.replace;
      function extractSplit(instance) {
        try {
          return instance.split;
        } catch (err) {
          return void 0;
        }
      }
      function extractStartsWith(instance) {
        try {
          return instance.startsWith;
        } catch (err) {
          return void 0;
        }
      }
      function extractEndsWith(instance) {
        try {
          return instance.endsWith;
        } catch (err) {
          return void 0;
        }
      }
      function extractSubstring(instance) {
        try {
          return instance.substring;
        } catch (err) {
          return void 0;
        }
      }
      function extractToLowerCase(instance) {
        try {
          return instance.toLowerCase;
        } catch (err) {
          return void 0;
        }
      }
      function extractToUpperCase(instance) {
        try {
          return instance.toUpperCase;
        } catch (err) {
          return void 0;
        }
      }
      function extractPadStart(instance) {
        try {
          return instance.padStart;
        } catch (err) {
          return void 0;
        }
      }
      function extractCharCodeAt(instance) {
        try {
          return instance.charCodeAt;
        } catch (err) {
          return void 0;
        }
      }
      function extractReplace(instance) {
        try {
          return instance.replace;
        } catch (err) {
          return void 0;
        }
      }
      function safeSplit(instance, ...args) {
        if (extractSplit(instance) === untouchedSplit) {
          return instance.split(...args);
        }
        return (0, apply_1.safeApply)(untouchedSplit, instance, args);
      }
      function safeStartsWith(instance, ...args) {
        if (extractStartsWith(instance) === untouchedStartsWith) {
          return instance.startsWith(...args);
        }
        return (0, apply_1.safeApply)(untouchedStartsWith, instance, args);
      }
      function safeEndsWith(instance, ...args) {
        if (extractEndsWith(instance) === untouchedEndsWith) {
          return instance.endsWith(...args);
        }
        return (0, apply_1.safeApply)(untouchedEndsWith, instance, args);
      }
      function safeSubstring(instance, ...args) {
        if (extractSubstring(instance) === untouchedSubstring) {
          return instance.substring(...args);
        }
        return (0, apply_1.safeApply)(untouchedSubstring, instance, args);
      }
      function safeToLowerCase(instance) {
        if (extractToLowerCase(instance) === untouchedToLowerCase) {
          return instance.toLowerCase();
        }
        return (0, apply_1.safeApply)(untouchedToLowerCase, instance, []);
      }
      function safeToUpperCase(instance) {
        if (extractToUpperCase(instance) === untouchedToUpperCase) {
          return instance.toUpperCase();
        }
        return (0, apply_1.safeApply)(untouchedToUpperCase, instance, []);
      }
      function safePadStart(instance, ...args) {
        if (extractPadStart(instance) === untouchedPadStart) {
          return instance.padStart(...args);
        }
        return (0, apply_1.safeApply)(untouchedPadStart, instance, args);
      }
      function safeCharCodeAt(instance, index) {
        if (extractCharCodeAt(instance) === untouchedCharCodeAt) {
          return instance.charCodeAt(index);
        }
        return (0, apply_1.safeApply)(untouchedCharCodeAt, instance, [index]);
      }
      function safeReplace(instance, pattern, replacement) {
        if (extractReplace(instance) === untouchedReplace) {
          return instance.replace(pattern, replacement);
        }
        return (0, apply_1.safeApply)(untouchedReplace, instance, [pattern, replacement]);
      }
      var untouchedNumberToString = Number.prototype.toString;
      function extractNumberToString(instance) {
        try {
          return instance.toString;
        } catch (err) {
          return void 0;
        }
      }
      function safeNumberToString(instance, ...args) {
        if (extractNumberToString(instance) === untouchedNumberToString) {
          return instance.toString(...args);
        }
        return (0, apply_1.safeApply)(untouchedNumberToString, instance, args);
      }
      var untouchedHasOwnProperty = Object.prototype.hasOwnProperty;
      var untouchedToString = Object.prototype.toString;
      function safeHasOwnProperty(instance, v) {
        return (0, apply_1.safeApply)(untouchedHasOwnProperty, instance, [v]);
      }
      function safeToString(instance) {
        return (0, apply_1.safeApply)(untouchedToString, instance, []);
      }
    }
  });

  // node_modules/fast-check/lib/stream/LazyIterableIterator.js
  var require_LazyIterableIterator = __commonJS({
    "node_modules/fast-check/lib/stream/LazyIterableIterator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.makeLazy = makeLazy;
      var LazyIterableIterator = class {
        constructor(producer) {
          this.producer = producer;
        }
        [Symbol.iterator]() {
          if (this.it === void 0) {
            this.it = this.producer();
          }
          return this.it;
        }
        next() {
          if (this.it === void 0) {
            this.it = this.producer();
          }
          return this.it.next();
        }
      };
      function makeLazy(producer) {
        return new LazyIterableIterator(producer);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/TupleArbitrary.js
  var require_TupleArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/TupleArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TupleArbitrary = void 0;
      exports.tupleShrink = tupleShrink;
      var Stream_1 = require_Stream();
      var symbols_1 = require_symbols();
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var globals_1 = require_globals();
      var LazyIterableIterator_1 = require_LazyIterableIterator();
      var safeArrayIsArray = Array.isArray;
      var safeObjectDefineProperty = Object.defineProperty;
      function tupleMakeItCloneable(vs, values) {
        return safeObjectDefineProperty(vs, symbols_1.cloneMethod, {
          value: () => {
            const cloned = [];
            for (let idx = 0; idx !== values.length; ++idx) {
              (0, globals_1.safePush)(cloned, values[idx].value);
            }
            tupleMakeItCloneable(cloned, values);
            return cloned;
          }
        });
      }
      function tupleWrapper(values) {
        let cloneable = false;
        const vs = [];
        const ctxs = [];
        for (let idx = 0; idx !== values.length; ++idx) {
          const v = values[idx];
          cloneable = cloneable || v.hasToBeCloned;
          (0, globals_1.safePush)(vs, v.value);
          (0, globals_1.safePush)(ctxs, v.context);
        }
        if (cloneable) {
          tupleMakeItCloneable(vs, values);
        }
        return new Value_1.Value(vs, ctxs);
      }
      function tupleShrink(arbs, value, context) {
        const shrinks = [];
        const safeContext = safeArrayIsArray(context) ? context : [];
        for (let idx = 0; idx !== arbs.length; ++idx) {
          (0, globals_1.safePush)(shrinks, (0, LazyIterableIterator_1.makeLazy)(() => arbs[idx].shrink(value[idx], safeContext[idx]).map((v) => {
            const nextValues = (0, globals_1.safeMap)(value, (v2, idx2) => new Value_1.Value((0, symbols_1.cloneIfNeeded)(v2), safeContext[idx2]));
            return [...(0, globals_1.safeSlice)(nextValues, 0, idx), v, ...(0, globals_1.safeSlice)(nextValues, idx + 1)];
          }).map(tupleWrapper)));
        }
        return Stream_1.Stream.nil().join(...shrinks);
      }
      var TupleArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor(arbs) {
          super();
          this.arbs = arbs;
          for (let idx = 0; idx !== arbs.length; ++idx) {
            const arb = arbs[idx];
            if (arb == null || arb.generate == null)
              throw new Error(`Invalid parameter encountered at index ${idx}: expecting an Arbitrary`);
          }
        }
        generate(mrng, biasFactor) {
          const mapped = [];
          for (let idx = 0; idx !== this.arbs.length; ++idx) {
            (0, globals_1.safePush)(mapped, this.arbs[idx].generate(mrng, biasFactor));
          }
          return tupleWrapper(mapped);
        }
        canShrinkWithoutContext(value) {
          if (!safeArrayIsArray(value) || value.length !== this.arbs.length) {
            return false;
          }
          for (let index = 0; index !== this.arbs.length; ++index) {
            if (!this.arbs[index].canShrinkWithoutContext(value[index])) {
              return false;
            }
          }
          return true;
        }
        shrink(value, context) {
          return tupleShrink(this.arbs, value, context);
        }
      };
      exports.TupleArbitrary = TupleArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/tuple.js
  var require_tuple = __commonJS({
    "node_modules/fast-check/lib/arbitrary/tuple.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.tuple = tuple;
      var TupleArbitrary_1 = require_TupleArbitrary();
      function tuple(...arbs) {
        return new TupleArbitrary_1.TupleArbitrary(arbs);
      }
    }
  });

  // node_modules/fast-check/lib/check/property/IRawProperty.js
  var require_IRawProperty = __commonJS({
    "node_modules/fast-check/lib/check/property/IRawProperty.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.runIdToFrequency = runIdToFrequency;
      var safeMathLog = Math.log;
      function runIdToFrequency(runId) {
        return 2 + ~~(safeMathLog(runId + 1) * 0.4342944819032518);
      }
    }
  });

  // node_modules/fast-check/lib/check/runner/configuration/GlobalParameters.js
  var require_GlobalParameters = __commonJS({
    "node_modules/fast-check/lib/check/runner/configuration/GlobalParameters.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.configureGlobal = configureGlobal;
      exports.readConfigureGlobal = readConfigureGlobal;
      exports.resetConfigureGlobal = resetConfigureGlobal;
      var globalParameters = {};
      function configureGlobal(parameters) {
        globalParameters = parameters;
      }
      function readConfigureGlobal() {
        return globalParameters;
      }
      function resetConfigureGlobal() {
        globalParameters = {};
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/NoUndefinedAsContext.js
  var require_NoUndefinedAsContext = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/NoUndefinedAsContext.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.UndefinedContextPlaceholder = void 0;
      exports.noUndefinedAsContext = noUndefinedAsContext;
      var Value_1 = require_Value();
      exports.UndefinedContextPlaceholder = /* @__PURE__ */ Symbol("UndefinedContextPlaceholder");
      function noUndefinedAsContext(value) {
        if (value.context !== void 0) {
          return value;
        }
        if (value.hasToBeCloned) {
          return new Value_1.Value(value.value_, exports.UndefinedContextPlaceholder, () => value.value);
        }
        return new Value_1.Value(value.value_, exports.UndefinedContextPlaceholder);
      }
    }
  });

  // node_modules/fast-check/lib/check/property/AsyncProperty.generic.js
  var require_AsyncProperty_generic = __commonJS({
    "node_modules/fast-check/lib/check/property/AsyncProperty.generic.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AsyncProperty = void 0;
      var PreconditionFailure_1 = require_PreconditionFailure();
      var IRawProperty_1 = require_IRawProperty();
      var GlobalParameters_1 = require_GlobalParameters();
      var Stream_1 = require_Stream();
      var NoUndefinedAsContext_1 = require_NoUndefinedAsContext();
      var globals_1 = require_globals();
      var AsyncProperty = class _AsyncProperty {
        constructor(arb, predicate) {
          this.arb = arb;
          this.predicate = predicate;
          const { asyncBeforeEach, asyncAfterEach, beforeEach, afterEach } = (0, GlobalParameters_1.readConfigureGlobal)() || {};
          if (asyncBeforeEach !== void 0 && beforeEach !== void 0) {
            throw (0, globals_1.Error)(`Global "asyncBeforeEach" and "beforeEach" parameters can't be set at the same time when running async properties`);
          }
          if (asyncAfterEach !== void 0 && afterEach !== void 0) {
            throw (0, globals_1.Error)(`Global "asyncAfterEach" and "afterEach" parameters can't be set at the same time when running async properties`);
          }
          this.beforeEachHook = asyncBeforeEach || beforeEach || _AsyncProperty.dummyHook;
          this.afterEachHook = asyncAfterEach || afterEach || _AsyncProperty.dummyHook;
        }
        isAsync() {
          return true;
        }
        generate(mrng, runId) {
          const value = this.arb.generate(mrng, runId != null ? (0, IRawProperty_1.runIdToFrequency)(runId) : void 0);
          return (0, NoUndefinedAsContext_1.noUndefinedAsContext)(value);
        }
        shrink(value) {
          if (value.context === void 0 && !this.arb.canShrinkWithoutContext(value.value_)) {
            return Stream_1.Stream.nil();
          }
          const safeContext = value.context !== NoUndefinedAsContext_1.UndefinedContextPlaceholder ? value.context : void 0;
          return this.arb.shrink(value.value_, safeContext).map(NoUndefinedAsContext_1.noUndefinedAsContext);
        }
        async runBeforeEach() {
          await this.beforeEachHook();
        }
        async runAfterEach() {
          await this.afterEachHook();
        }
        async run(v, dontRunHook) {
          if (!dontRunHook) {
            await this.beforeEachHook();
          }
          try {
            const output = await this.predicate(v);
            return output == null || output === true ? null : {
              error: new globals_1.Error("Property failed by returning false"),
              errorMessage: "Error: Property failed by returning false"
            };
          } catch (err) {
            if (PreconditionFailure_1.PreconditionFailure.isFailure(err))
              return err;
            if (err instanceof globals_1.Error && err.stack) {
              return { error: err, errorMessage: err.stack };
            }
            return { error: err, errorMessage: (0, globals_1.String)(err) };
          } finally {
            if (!dontRunHook) {
              await this.afterEachHook();
            }
          }
        }
        beforeEach(hookFunction) {
          const previousBeforeEachHook = this.beforeEachHook;
          this.beforeEachHook = () => hookFunction(previousBeforeEachHook);
          return this;
        }
        afterEach(hookFunction) {
          const previousAfterEachHook = this.afterEachHook;
          this.afterEachHook = () => hookFunction(previousAfterEachHook);
          return this;
        }
      };
      exports.AsyncProperty = AsyncProperty;
      AsyncProperty.dummyHook = () => {
      };
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/AlwaysShrinkableArbitrary.js
  var require_AlwaysShrinkableArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/AlwaysShrinkableArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AlwaysShrinkableArbitrary = void 0;
      var Arbitrary_1 = require_Arbitrary();
      var Stream_1 = require_Stream();
      var NoUndefinedAsContext_1 = require_NoUndefinedAsContext();
      var AlwaysShrinkableArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor(arb) {
          super();
          this.arb = arb;
        }
        generate(mrng, biasFactor) {
          const value = this.arb.generate(mrng, biasFactor);
          return (0, NoUndefinedAsContext_1.noUndefinedAsContext)(value);
        }
        canShrinkWithoutContext(value) {
          return true;
        }
        shrink(value, context) {
          if (context === void 0 && !this.arb.canShrinkWithoutContext(value)) {
            return Stream_1.Stream.nil();
          }
          const safeContext = context !== NoUndefinedAsContext_1.UndefinedContextPlaceholder ? context : void 0;
          return this.arb.shrink(value, safeContext).map(NoUndefinedAsContext_1.noUndefinedAsContext);
        }
      };
      exports.AlwaysShrinkableArbitrary = AlwaysShrinkableArbitrary;
    }
  });

  // node_modules/fast-check/lib/check/property/AsyncProperty.js
  var require_AsyncProperty = __commonJS({
    "node_modules/fast-check/lib/check/property/AsyncProperty.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.asyncProperty = asyncProperty;
      var Arbitrary_1 = require_Arbitrary();
      var tuple_1 = require_tuple();
      var AsyncProperty_generic_1 = require_AsyncProperty_generic();
      var AlwaysShrinkableArbitrary_1 = require_AlwaysShrinkableArbitrary();
      var globals_1 = require_globals();
      function asyncProperty(...args) {
        if (args.length < 2) {
          throw new Error("asyncProperty expects at least two parameters");
        }
        const arbs = (0, globals_1.safeSlice)(args, 0, args.length - 1);
        const p = args[args.length - 1];
        (0, globals_1.safeForEach)(arbs, Arbitrary_1.assertIsArbitrary);
        const mappedArbs = (0, globals_1.safeMap)(arbs, (arb) => new AlwaysShrinkableArbitrary_1.AlwaysShrinkableArbitrary(arb));
        return new AsyncProperty_generic_1.AsyncProperty((0, tuple_1.tuple)(...mappedArbs), (t) => p(...t));
      }
    }
  });

  // node_modules/fast-check/lib/check/property/Property.generic.js
  var require_Property_generic = __commonJS({
    "node_modules/fast-check/lib/check/property/Property.generic.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Property = void 0;
      var PreconditionFailure_1 = require_PreconditionFailure();
      var IRawProperty_1 = require_IRawProperty();
      var GlobalParameters_1 = require_GlobalParameters();
      var Stream_1 = require_Stream();
      var NoUndefinedAsContext_1 = require_NoUndefinedAsContext();
      var globals_1 = require_globals();
      var Property = class _Property {
        constructor(arb, predicate) {
          this.arb = arb;
          this.predicate = predicate;
          const { beforeEach = _Property.dummyHook, afterEach = _Property.dummyHook, asyncBeforeEach, asyncAfterEach } = (0, GlobalParameters_1.readConfigureGlobal)() || {};
          if (asyncBeforeEach !== void 0) {
            throw (0, globals_1.Error)(`"asyncBeforeEach" can't be set when running synchronous properties`);
          }
          if (asyncAfterEach !== void 0) {
            throw (0, globals_1.Error)(`"asyncAfterEach" can't be set when running synchronous properties`);
          }
          this.beforeEachHook = beforeEach;
          this.afterEachHook = afterEach;
        }
        isAsync() {
          return false;
        }
        generate(mrng, runId) {
          const value = this.arb.generate(mrng, runId != null ? (0, IRawProperty_1.runIdToFrequency)(runId) : void 0);
          return (0, NoUndefinedAsContext_1.noUndefinedAsContext)(value);
        }
        shrink(value) {
          if (value.context === void 0 && !this.arb.canShrinkWithoutContext(value.value_)) {
            return Stream_1.Stream.nil();
          }
          const safeContext = value.context !== NoUndefinedAsContext_1.UndefinedContextPlaceholder ? value.context : void 0;
          return this.arb.shrink(value.value_, safeContext).map(NoUndefinedAsContext_1.noUndefinedAsContext);
        }
        runBeforeEach() {
          this.beforeEachHook();
        }
        runAfterEach() {
          this.afterEachHook();
        }
        run(v, dontRunHook) {
          if (!dontRunHook) {
            this.beforeEachHook();
          }
          try {
            const output = this.predicate(v);
            return output == null || output === true ? null : {
              error: new globals_1.Error("Property failed by returning false"),
              errorMessage: "Error: Property failed by returning false"
            };
          } catch (err) {
            if (PreconditionFailure_1.PreconditionFailure.isFailure(err))
              return err;
            if (err instanceof globals_1.Error && err.stack) {
              return { error: err, errorMessage: err.stack };
            }
            return { error: err, errorMessage: (0, globals_1.String)(err) };
          } finally {
            if (!dontRunHook) {
              this.afterEachHook();
            }
          }
        }
        beforeEach(hookFunction) {
          const previousBeforeEachHook = this.beforeEachHook;
          this.beforeEachHook = () => hookFunction(previousBeforeEachHook);
          return this;
        }
        afterEach(hookFunction) {
          const previousAfterEachHook = this.afterEachHook;
          this.afterEachHook = () => hookFunction(previousAfterEachHook);
          return this;
        }
      };
      exports.Property = Property;
      Property.dummyHook = () => {
      };
    }
  });

  // node_modules/fast-check/lib/check/property/Property.js
  var require_Property = __commonJS({
    "node_modules/fast-check/lib/check/property/Property.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.property = property;
      var Arbitrary_1 = require_Arbitrary();
      var tuple_1 = require_tuple();
      var Property_generic_1 = require_Property_generic();
      var AlwaysShrinkableArbitrary_1 = require_AlwaysShrinkableArbitrary();
      var globals_1 = require_globals();
      function property(...args) {
        if (args.length < 2) {
          throw new Error("property expects at least two parameters");
        }
        const arbs = (0, globals_1.safeSlice)(args, 0, args.length - 1);
        const p = args[args.length - 1];
        (0, globals_1.safeForEach)(arbs, Arbitrary_1.assertIsArbitrary);
        const mappedArbs = (0, globals_1.safeMap)(arbs, (arb) => new AlwaysShrinkableArbitrary_1.AlwaysShrinkableArbitrary(arb));
        return new Property_generic_1.Property((0, tuple_1.tuple)(...mappedArbs), (t) => p(...t));
      }
    }
  });

  // node_modules/pure-rand/lib/generator/RandomGenerator.js
  var require_RandomGenerator = __commonJS({
    "node_modules/pure-rand/lib/generator/RandomGenerator.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.skipN = exports.unsafeSkipN = exports.generateN = exports.unsafeGenerateN = void 0;
      function unsafeGenerateN(rng, num) {
        var out = [];
        for (var idx = 0; idx != num; ++idx) {
          out.push(rng.unsafeNext());
        }
        return out;
      }
      exports.unsafeGenerateN = unsafeGenerateN;
      function generateN(rng, num) {
        var nextRng = rng.clone();
        var out = unsafeGenerateN(nextRng, num);
        return [out, nextRng];
      }
      exports.generateN = generateN;
      function unsafeSkipN(rng, num) {
        for (var idx = 0; idx != num; ++idx) {
          rng.unsafeNext();
        }
      }
      exports.unsafeSkipN = unsafeSkipN;
      function skipN(rng, num) {
        var nextRng = rng.clone();
        unsafeSkipN(nextRng, num);
        return nextRng;
      }
      exports.skipN = skipN;
    }
  });

  // node_modules/pure-rand/lib/generator/LinearCongruential.js
  var require_LinearCongruential = __commonJS({
    "node_modules/pure-rand/lib/generator/LinearCongruential.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.congruential32 = void 0;
      var MULTIPLIER = 214013;
      var INCREMENT = 2531011;
      var MASK = 4294967295;
      var MASK_2 = (1 << 31) - 1;
      var computeNextSeed = function(seed) {
        return seed * MULTIPLIER + INCREMENT & MASK;
      };
      var computeValueFromNextSeed = function(nextseed) {
        return (nextseed & MASK_2) >> 16;
      };
      var LinearCongruential32 = (function() {
        function LinearCongruential322(seed) {
          this.seed = seed;
        }
        LinearCongruential322.prototype.clone = function() {
          return new LinearCongruential322(this.seed);
        };
        LinearCongruential322.prototype.next = function() {
          var nextRng = new LinearCongruential322(this.seed);
          var out = nextRng.unsafeNext();
          return [out, nextRng];
        };
        LinearCongruential322.prototype.unsafeNext = function() {
          var s1 = computeNextSeed(this.seed);
          var v1 = computeValueFromNextSeed(s1);
          var s2 = computeNextSeed(s1);
          var v2 = computeValueFromNextSeed(s2);
          this.seed = computeNextSeed(s2);
          var v3 = computeValueFromNextSeed(this.seed);
          var vnext = v3 + (v2 + (v1 << 15) << 15);
          return vnext | 0;
        };
        LinearCongruential322.prototype.getState = function() {
          return [this.seed];
        };
        return LinearCongruential322;
      })();
      function fromState(state) {
        var valid = state.length === 1;
        if (!valid) {
          throw new Error("The state must have been produced by a congruential32 RandomGenerator");
        }
        return new LinearCongruential32(state[0]);
      }
      exports.congruential32 = Object.assign(function(seed) {
        return new LinearCongruential32(seed);
      }, { fromState });
    }
  });

  // node_modules/pure-rand/lib/generator/MersenneTwister.js
  var require_MersenneTwister = __commonJS({
    "node_modules/pure-rand/lib/generator/MersenneTwister.js"(exports) {
      "use strict";
      var __read = exports && exports.__read || function(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        } catch (error) {
          e = { error };
        } finally {
          try {
            if (r && !r.done && (m = i["return"])) m.call(i);
          } finally {
            if (e) throw e.error;
          }
        }
        return ar;
      };
      var __spreadArray = exports && exports.__spreadArray || function(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
      };
      exports.__esModule = true;
      var MersenneTwister = (function() {
        function MersenneTwister2(states, index) {
          this.states = states;
          this.index = index;
        }
        MersenneTwister2.twist = function(prev) {
          var mt = prev.slice();
          for (var idx = 0; idx !== MersenneTwister2.N - MersenneTwister2.M; ++idx) {
            var y_1 = (mt[idx] & MersenneTwister2.MASK_UPPER) + (mt[idx + 1] & MersenneTwister2.MASK_LOWER);
            mt[idx] = mt[idx + MersenneTwister2.M] ^ y_1 >>> 1 ^ -(y_1 & 1) & MersenneTwister2.A;
          }
          for (var idx = MersenneTwister2.N - MersenneTwister2.M; idx !== MersenneTwister2.N - 1; ++idx) {
            var y_2 = (mt[idx] & MersenneTwister2.MASK_UPPER) + (mt[idx + 1] & MersenneTwister2.MASK_LOWER);
            mt[idx] = mt[idx + MersenneTwister2.M - MersenneTwister2.N] ^ y_2 >>> 1 ^ -(y_2 & 1) & MersenneTwister2.A;
          }
          var y = (mt[MersenneTwister2.N - 1] & MersenneTwister2.MASK_UPPER) + (mt[0] & MersenneTwister2.MASK_LOWER);
          mt[MersenneTwister2.N - 1] = mt[MersenneTwister2.M - 1] ^ y >>> 1 ^ -(y & 1) & MersenneTwister2.A;
          return mt;
        };
        MersenneTwister2.seeded = function(seed) {
          var out = Array(MersenneTwister2.N);
          out[0] = seed;
          for (var idx = 1; idx !== MersenneTwister2.N; ++idx) {
            var xored = out[idx - 1] ^ out[idx - 1] >>> 30;
            out[idx] = Math.imul(MersenneTwister2.F, xored) + idx | 0;
          }
          return out;
        };
        MersenneTwister2.from = function(seed) {
          return new MersenneTwister2(MersenneTwister2.twist(MersenneTwister2.seeded(seed)), 0);
        };
        MersenneTwister2.prototype.clone = function() {
          return new MersenneTwister2(this.states, this.index);
        };
        MersenneTwister2.prototype.next = function() {
          var nextRng = new MersenneTwister2(this.states, this.index);
          var out = nextRng.unsafeNext();
          return [out, nextRng];
        };
        MersenneTwister2.prototype.unsafeNext = function() {
          var y = this.states[this.index];
          y ^= this.states[this.index] >>> MersenneTwister2.U;
          y ^= y << MersenneTwister2.S & MersenneTwister2.B;
          y ^= y << MersenneTwister2.T & MersenneTwister2.C;
          y ^= y >>> MersenneTwister2.L;
          if (++this.index >= MersenneTwister2.N) {
            this.states = MersenneTwister2.twist(this.states);
            this.index = 0;
          }
          return y;
        };
        MersenneTwister2.prototype.getState = function() {
          return __spreadArray([this.index], __read(this.states), false);
        };
        MersenneTwister2.fromState = function(state) {
          var valid = state.length === MersenneTwister2.N + 1 && state[0] >= 0 && state[0] < MersenneTwister2.N;
          if (!valid) {
            throw new Error("The state must have been produced by a mersenne RandomGenerator");
          }
          return new MersenneTwister2(state.slice(1), state[0]);
        };
        MersenneTwister2.N = 624;
        MersenneTwister2.M = 397;
        MersenneTwister2.R = 31;
        MersenneTwister2.A = 2567483615;
        MersenneTwister2.F = 1812433253;
        MersenneTwister2.U = 11;
        MersenneTwister2.S = 7;
        MersenneTwister2.B = 2636928640;
        MersenneTwister2.T = 15;
        MersenneTwister2.C = 4022730752;
        MersenneTwister2.L = 18;
        MersenneTwister2.MASK_LOWER = Math.pow(2, MersenneTwister2.R) - 1;
        MersenneTwister2.MASK_UPPER = Math.pow(2, MersenneTwister2.R);
        return MersenneTwister2;
      })();
      function fromState(state) {
        return MersenneTwister.fromState(state);
      }
      exports["default"] = Object.assign(function(seed) {
        return MersenneTwister.from(seed);
      }, { fromState });
    }
  });

  // node_modules/pure-rand/lib/generator/XorShift.js
  var require_XorShift = __commonJS({
    "node_modules/pure-rand/lib/generator/XorShift.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.xorshift128plus = void 0;
      var XorShift128Plus = (function() {
        function XorShift128Plus2(s01, s00, s11, s10) {
          this.s01 = s01;
          this.s00 = s00;
          this.s11 = s11;
          this.s10 = s10;
        }
        XorShift128Plus2.prototype.clone = function() {
          return new XorShift128Plus2(this.s01, this.s00, this.s11, this.s10);
        };
        XorShift128Plus2.prototype.next = function() {
          var nextRng = new XorShift128Plus2(this.s01, this.s00, this.s11, this.s10);
          var out = nextRng.unsafeNext();
          return [out, nextRng];
        };
        XorShift128Plus2.prototype.unsafeNext = function() {
          var a0 = this.s00 ^ this.s00 << 23;
          var a1 = this.s01 ^ (this.s01 << 23 | this.s00 >>> 9);
          var b0 = a0 ^ this.s10 ^ (a0 >>> 18 | a1 << 14) ^ (this.s10 >>> 5 | this.s11 << 27);
          var b1 = a1 ^ this.s11 ^ a1 >>> 18 ^ this.s11 >>> 5;
          var out = this.s00 + this.s10 | 0;
          this.s01 = this.s11;
          this.s00 = this.s10;
          this.s11 = b1;
          this.s10 = b0;
          return out;
        };
        XorShift128Plus2.prototype.jump = function() {
          var nextRng = new XorShift128Plus2(this.s01, this.s00, this.s11, this.s10);
          nextRng.unsafeJump();
          return nextRng;
        };
        XorShift128Plus2.prototype.unsafeJump = function() {
          var ns01 = 0;
          var ns00 = 0;
          var ns11 = 0;
          var ns10 = 0;
          var jump = [1667051007, 2321340297, 1548169110, 304075285];
          for (var i = 0; i !== 4; ++i) {
            for (var mask = 1; mask; mask <<= 1) {
              if (jump[i] & mask) {
                ns01 ^= this.s01;
                ns00 ^= this.s00;
                ns11 ^= this.s11;
                ns10 ^= this.s10;
              }
              this.unsafeNext();
            }
          }
          this.s01 = ns01;
          this.s00 = ns00;
          this.s11 = ns11;
          this.s10 = ns10;
        };
        XorShift128Plus2.prototype.getState = function() {
          return [this.s01, this.s00, this.s11, this.s10];
        };
        return XorShift128Plus2;
      })();
      function fromState(state) {
        var valid = state.length === 4;
        if (!valid) {
          throw new Error("The state must have been produced by a xorshift128plus RandomGenerator");
        }
        return new XorShift128Plus(state[0], state[1], state[2], state[3]);
      }
      exports.xorshift128plus = Object.assign(function(seed) {
        return new XorShift128Plus(-1, ~seed, seed | 0, 0);
      }, { fromState });
    }
  });

  // node_modules/pure-rand/lib/generator/XoroShiro.js
  var require_XoroShiro = __commonJS({
    "node_modules/pure-rand/lib/generator/XoroShiro.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.xoroshiro128plus = void 0;
      var XoroShiro128Plus = (function() {
        function XoroShiro128Plus2(s01, s00, s11, s10) {
          this.s01 = s01;
          this.s00 = s00;
          this.s11 = s11;
          this.s10 = s10;
        }
        XoroShiro128Plus2.prototype.clone = function() {
          return new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
        };
        XoroShiro128Plus2.prototype.next = function() {
          var nextRng = new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
          var out = nextRng.unsafeNext();
          return [out, nextRng];
        };
        XoroShiro128Plus2.prototype.unsafeNext = function() {
          var out = this.s00 + this.s10 | 0;
          var a0 = this.s10 ^ this.s00;
          var a1 = this.s11 ^ this.s01;
          var s00 = this.s00;
          var s01 = this.s01;
          this.s00 = s00 << 24 ^ s01 >>> 8 ^ a0 ^ a0 << 16;
          this.s01 = s01 << 24 ^ s00 >>> 8 ^ a1 ^ (a1 << 16 | a0 >>> 16);
          this.s10 = a1 << 5 ^ a0 >>> 27;
          this.s11 = a0 << 5 ^ a1 >>> 27;
          return out;
        };
        XoroShiro128Plus2.prototype.jump = function() {
          var nextRng = new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
          nextRng.unsafeJump();
          return nextRng;
        };
        XoroShiro128Plus2.prototype.unsafeJump = function() {
          var ns01 = 0;
          var ns00 = 0;
          var ns11 = 0;
          var ns10 = 0;
          var jump = [3639956645, 3750757012, 1261568508, 386426335];
          for (var i = 0; i !== 4; ++i) {
            for (var mask = 1; mask; mask <<= 1) {
              if (jump[i] & mask) {
                ns01 ^= this.s01;
                ns00 ^= this.s00;
                ns11 ^= this.s11;
                ns10 ^= this.s10;
              }
              this.unsafeNext();
            }
          }
          this.s01 = ns01;
          this.s00 = ns00;
          this.s11 = ns11;
          this.s10 = ns10;
        };
        XoroShiro128Plus2.prototype.getState = function() {
          return [this.s01, this.s00, this.s11, this.s10];
        };
        return XoroShiro128Plus2;
      })();
      function fromState(state) {
        var valid = state.length === 4;
        if (!valid) {
          throw new Error("The state must have been produced by a xoroshiro128plus RandomGenerator");
        }
        return new XoroShiro128Plus(state[0], state[1], state[2], state[3]);
      }
      exports.xoroshiro128plus = Object.assign(function(seed) {
        return new XoroShiro128Plus(-1, ~seed, seed | 0, 0);
      }, { fromState });
    }
  });

  // node_modules/pure-rand/lib/distribution/internals/ArrayInt.js
  var require_ArrayInt = __commonJS({
    "node_modules/pure-rand/lib/distribution/internals/ArrayInt.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.substractArrayInt64 = exports.fromNumberToArrayInt64 = exports.trimArrayIntInplace = exports.substractArrayIntToNew = exports.addOneToPositiveArrayInt = exports.addArrayIntToNew = void 0;
      function addArrayIntToNew(arrayIntA, arrayIntB) {
        if (arrayIntA.sign !== arrayIntB.sign) {
          return substractArrayIntToNew(arrayIntA, { sign: -arrayIntB.sign, data: arrayIntB.data });
        }
        var data = [];
        var reminder = 0;
        var dataA = arrayIntA.data;
        var dataB = arrayIntB.data;
        for (var indexA = dataA.length - 1, indexB = dataB.length - 1; indexA >= 0 || indexB >= 0; --indexA, --indexB) {
          var vA = indexA >= 0 ? dataA[indexA] : 0;
          var vB = indexB >= 0 ? dataB[indexB] : 0;
          var current = vA + vB + reminder;
          data.push(current >>> 0);
          reminder = ~~(current / 4294967296);
        }
        if (reminder !== 0) {
          data.push(reminder);
        }
        return { sign: arrayIntA.sign, data: data.reverse() };
      }
      exports.addArrayIntToNew = addArrayIntToNew;
      function addOneToPositiveArrayInt(arrayInt) {
        arrayInt.sign = 1;
        var data = arrayInt.data;
        for (var index = data.length - 1; index >= 0; --index) {
          if (data[index] === 4294967295) {
            data[index] = 0;
          } else {
            data[index] += 1;
            return arrayInt;
          }
        }
        data.unshift(1);
        return arrayInt;
      }
      exports.addOneToPositiveArrayInt = addOneToPositiveArrayInt;
      function isStrictlySmaller(dataA, dataB) {
        var maxLength = Math.max(dataA.length, dataB.length);
        for (var index = 0; index < maxLength; ++index) {
          var indexA = index + dataA.length - maxLength;
          var indexB = index + dataB.length - maxLength;
          var vA = indexA >= 0 ? dataA[indexA] : 0;
          var vB = indexB >= 0 ? dataB[indexB] : 0;
          if (vA < vB)
            return true;
          if (vA > vB)
            return false;
        }
        return false;
      }
      function substractArrayIntToNew(arrayIntA, arrayIntB) {
        if (arrayIntA.sign !== arrayIntB.sign) {
          return addArrayIntToNew(arrayIntA, { sign: -arrayIntB.sign, data: arrayIntB.data });
        }
        var dataA = arrayIntA.data;
        var dataB = arrayIntB.data;
        if (isStrictlySmaller(dataA, dataB)) {
          var out = substractArrayIntToNew(arrayIntB, arrayIntA);
          out.sign = -out.sign;
          return out;
        }
        var data = [];
        var reminder = 0;
        for (var indexA = dataA.length - 1, indexB = dataB.length - 1; indexA >= 0 || indexB >= 0; --indexA, --indexB) {
          var vA = indexA >= 0 ? dataA[indexA] : 0;
          var vB = indexB >= 0 ? dataB[indexB] : 0;
          var current = vA - vB - reminder;
          data.push(current >>> 0);
          reminder = current < 0 ? 1 : 0;
        }
        return { sign: arrayIntA.sign, data: data.reverse() };
      }
      exports.substractArrayIntToNew = substractArrayIntToNew;
      function trimArrayIntInplace(arrayInt) {
        var data = arrayInt.data;
        var firstNonZero = 0;
        for (; firstNonZero !== data.length && data[firstNonZero] === 0; ++firstNonZero) {
        }
        if (firstNonZero === data.length) {
          arrayInt.sign = 1;
          arrayInt.data = [0];
          return arrayInt;
        }
        data.splice(0, firstNonZero);
        return arrayInt;
      }
      exports.trimArrayIntInplace = trimArrayIntInplace;
      function fromNumberToArrayInt64(out, n) {
        if (n < 0) {
          var posN = -n;
          out.sign = -1;
          out.data[0] = ~~(posN / 4294967296);
          out.data[1] = posN >>> 0;
        } else {
          out.sign = 1;
          out.data[0] = ~~(n / 4294967296);
          out.data[1] = n >>> 0;
        }
        return out;
      }
      exports.fromNumberToArrayInt64 = fromNumberToArrayInt64;
      function substractArrayInt64(out, arrayIntA, arrayIntB) {
        var lowA = arrayIntA.data[1];
        var highA = arrayIntA.data[0];
        var signA = arrayIntA.sign;
        var lowB = arrayIntB.data[1];
        var highB = arrayIntB.data[0];
        var signB = arrayIntB.sign;
        out.sign = 1;
        if (signA === 1 && signB === -1) {
          var low_1 = lowA + lowB;
          var high = highA + highB + (low_1 > 4294967295 ? 1 : 0);
          out.data[0] = high >>> 0;
          out.data[1] = low_1 >>> 0;
          return out;
        }
        var lowFirst = lowA;
        var highFirst = highA;
        var lowSecond = lowB;
        var highSecond = highB;
        if (signA === -1) {
          lowFirst = lowB;
          highFirst = highB;
          lowSecond = lowA;
          highSecond = highA;
        }
        var reminderLow = 0;
        var low = lowFirst - lowSecond;
        if (low < 0) {
          reminderLow = 1;
          low = low >>> 0;
        }
        out.data[0] = highFirst - highSecond - reminderLow;
        out.data[1] = low;
        return out;
      }
      exports.substractArrayInt64 = substractArrayInt64;
    }
  });

  // node_modules/pure-rand/lib/distribution/internals/UnsafeUniformIntDistributionInternal.js
  var require_UnsafeUniformIntDistributionInternal = __commonJS({
    "node_modules/pure-rand/lib/distribution/internals/UnsafeUniformIntDistributionInternal.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.unsafeUniformIntDistributionInternal = void 0;
      function unsafeUniformIntDistributionInternal(rangeSize, rng) {
        var MaxAllowed = rangeSize > 2 ? ~~(4294967296 / rangeSize) * rangeSize : 4294967296;
        var deltaV = rng.unsafeNext() + 2147483648;
        while (deltaV >= MaxAllowed) {
          deltaV = rng.unsafeNext() + 2147483648;
        }
        return deltaV % rangeSize;
      }
      exports.unsafeUniformIntDistributionInternal = unsafeUniformIntDistributionInternal;
    }
  });

  // node_modules/pure-rand/lib/distribution/internals/UnsafeUniformArrayIntDistributionInternal.js
  var require_UnsafeUniformArrayIntDistributionInternal = __commonJS({
    "node_modules/pure-rand/lib/distribution/internals/UnsafeUniformArrayIntDistributionInternal.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.unsafeUniformArrayIntDistributionInternal = void 0;
      var UnsafeUniformIntDistributionInternal_1 = require_UnsafeUniformIntDistributionInternal();
      function unsafeUniformArrayIntDistributionInternal(out, rangeSize, rng) {
        var rangeLength = rangeSize.length;
        while (true) {
          for (var index = 0; index !== rangeLength; ++index) {
            var indexRangeSize = index === 0 ? rangeSize[0] + 1 : 4294967296;
            var g = (0, UnsafeUniformIntDistributionInternal_1.unsafeUniformIntDistributionInternal)(indexRangeSize, rng);
            out[index] = g;
          }
          for (var index = 0; index !== rangeLength; ++index) {
            var current = out[index];
            var currentInRange = rangeSize[index];
            if (current < currentInRange) {
              return out;
            } else if (current > currentInRange) {
              break;
            }
          }
        }
      }
      exports.unsafeUniformArrayIntDistributionInternal = unsafeUniformArrayIntDistributionInternal;
    }
  });

  // node_modules/pure-rand/lib/distribution/UnsafeUniformArrayIntDistribution.js
  var require_UnsafeUniformArrayIntDistribution = __commonJS({
    "node_modules/pure-rand/lib/distribution/UnsafeUniformArrayIntDistribution.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.unsafeUniformArrayIntDistribution = void 0;
      var ArrayInt_1 = require_ArrayInt();
      var UnsafeUniformArrayIntDistributionInternal_1 = require_UnsafeUniformArrayIntDistributionInternal();
      function unsafeUniformArrayIntDistribution(from, to, rng) {
        var rangeSize = (0, ArrayInt_1.trimArrayIntInplace)((0, ArrayInt_1.addOneToPositiveArrayInt)((0, ArrayInt_1.substractArrayIntToNew)(to, from)));
        var emptyArrayIntData = rangeSize.data.slice(0);
        var g = (0, UnsafeUniformArrayIntDistributionInternal_1.unsafeUniformArrayIntDistributionInternal)(emptyArrayIntData, rangeSize.data, rng);
        return (0, ArrayInt_1.trimArrayIntInplace)((0, ArrayInt_1.addArrayIntToNew)({ sign: 1, data: g }, from));
      }
      exports.unsafeUniformArrayIntDistribution = unsafeUniformArrayIntDistribution;
    }
  });

  // node_modules/pure-rand/lib/distribution/UniformArrayIntDistribution.js
  var require_UniformArrayIntDistribution = __commonJS({
    "node_modules/pure-rand/lib/distribution/UniformArrayIntDistribution.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.uniformArrayIntDistribution = void 0;
      var UnsafeUniformArrayIntDistribution_1 = require_UnsafeUniformArrayIntDistribution();
      function uniformArrayIntDistribution(from, to, rng) {
        if (rng != null) {
          var nextRng = rng.clone();
          return [(0, UnsafeUniformArrayIntDistribution_1.unsafeUniformArrayIntDistribution)(from, to, nextRng), nextRng];
        }
        return function(rng2) {
          var nextRng2 = rng2.clone();
          return [(0, UnsafeUniformArrayIntDistribution_1.unsafeUniformArrayIntDistribution)(from, to, nextRng2), nextRng2];
        };
      }
      exports.uniformArrayIntDistribution = uniformArrayIntDistribution;
    }
  });

  // node_modules/pure-rand/lib/distribution/UnsafeUniformBigIntDistribution.js
  var require_UnsafeUniformBigIntDistribution = __commonJS({
    "node_modules/pure-rand/lib/distribution/UnsafeUniformBigIntDistribution.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.unsafeUniformBigIntDistribution = void 0;
      var SBigInt = typeof BigInt !== "undefined" ? BigInt : void 0;
      function unsafeUniformBigIntDistribution(from, to, rng) {
        var diff = to - from + SBigInt(1);
        var MinRng = SBigInt(-2147483648);
        var NumValues = SBigInt(4294967296);
        var FinalNumValues = NumValues;
        var NumIterations = 1;
        while (FinalNumValues < diff) {
          FinalNumValues *= NumValues;
          ++NumIterations;
        }
        var MaxAcceptedRandom = FinalNumValues - FinalNumValues % diff;
        while (true) {
          var value = SBigInt(0);
          for (var num = 0; num !== NumIterations; ++num) {
            var out = rng.unsafeNext();
            value = NumValues * value + (SBigInt(out) - MinRng);
          }
          if (value < MaxAcceptedRandom) {
            var inDiff = value % diff;
            return inDiff + from;
          }
        }
      }
      exports.unsafeUniformBigIntDistribution = unsafeUniformBigIntDistribution;
    }
  });

  // node_modules/pure-rand/lib/distribution/UniformBigIntDistribution.js
  var require_UniformBigIntDistribution = __commonJS({
    "node_modules/pure-rand/lib/distribution/UniformBigIntDistribution.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.uniformBigIntDistribution = void 0;
      var UnsafeUniformBigIntDistribution_1 = require_UnsafeUniformBigIntDistribution();
      function uniformBigIntDistribution(from, to, rng) {
        if (rng != null) {
          var nextRng = rng.clone();
          return [(0, UnsafeUniformBigIntDistribution_1.unsafeUniformBigIntDistribution)(from, to, nextRng), nextRng];
        }
        return function(rng2) {
          var nextRng2 = rng2.clone();
          return [(0, UnsafeUniformBigIntDistribution_1.unsafeUniformBigIntDistribution)(from, to, nextRng2), nextRng2];
        };
      }
      exports.uniformBigIntDistribution = uniformBigIntDistribution;
    }
  });

  // node_modules/pure-rand/lib/distribution/UnsafeUniformIntDistribution.js
  var require_UnsafeUniformIntDistribution = __commonJS({
    "node_modules/pure-rand/lib/distribution/UnsafeUniformIntDistribution.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.unsafeUniformIntDistribution = void 0;
      var UnsafeUniformIntDistributionInternal_1 = require_UnsafeUniformIntDistributionInternal();
      var ArrayInt_1 = require_ArrayInt();
      var UnsafeUniformArrayIntDistributionInternal_1 = require_UnsafeUniformArrayIntDistributionInternal();
      var safeNumberMaxSafeInteger = Number.MAX_SAFE_INTEGER;
      var sharedA = { sign: 1, data: [0, 0] };
      var sharedB = { sign: 1, data: [0, 0] };
      var sharedC = { sign: 1, data: [0, 0] };
      var sharedData = [0, 0];
      function uniformLargeIntInternal(from, to, rangeSize, rng) {
        var rangeSizeArrayIntValue = rangeSize <= safeNumberMaxSafeInteger ? (0, ArrayInt_1.fromNumberToArrayInt64)(sharedC, rangeSize) : (0, ArrayInt_1.substractArrayInt64)(sharedC, (0, ArrayInt_1.fromNumberToArrayInt64)(sharedA, to), (0, ArrayInt_1.fromNumberToArrayInt64)(sharedB, from));
        if (rangeSizeArrayIntValue.data[1] === 4294967295) {
          rangeSizeArrayIntValue.data[0] += 1;
          rangeSizeArrayIntValue.data[1] = 0;
        } else {
          rangeSizeArrayIntValue.data[1] += 1;
        }
        (0, UnsafeUniformArrayIntDistributionInternal_1.unsafeUniformArrayIntDistributionInternal)(sharedData, rangeSizeArrayIntValue.data, rng);
        return sharedData[0] * 4294967296 + sharedData[1] + from;
      }
      function unsafeUniformIntDistribution(from, to, rng) {
        var rangeSize = to - from;
        if (rangeSize <= 4294967295) {
          var g = (0, UnsafeUniformIntDistributionInternal_1.unsafeUniformIntDistributionInternal)(rangeSize + 1, rng);
          return g + from;
        }
        return uniformLargeIntInternal(from, to, rangeSize, rng);
      }
      exports.unsafeUniformIntDistribution = unsafeUniformIntDistribution;
    }
  });

  // node_modules/pure-rand/lib/distribution/UniformIntDistribution.js
  var require_UniformIntDistribution = __commonJS({
    "node_modules/pure-rand/lib/distribution/UniformIntDistribution.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.uniformIntDistribution = void 0;
      var UnsafeUniformIntDistribution_1 = require_UnsafeUniformIntDistribution();
      function uniformIntDistribution(from, to, rng) {
        if (rng != null) {
          var nextRng = rng.clone();
          return [(0, UnsafeUniformIntDistribution_1.unsafeUniformIntDistribution)(from, to, nextRng), nextRng];
        }
        return function(rng2) {
          var nextRng2 = rng2.clone();
          return [(0, UnsafeUniformIntDistribution_1.unsafeUniformIntDistribution)(from, to, nextRng2), nextRng2];
        };
      }
      exports.uniformIntDistribution = uniformIntDistribution;
    }
  });

  // node_modules/pure-rand/lib/pure-rand-default.js
  var require_pure_rand_default = __commonJS({
    "node_modules/pure-rand/lib/pure-rand-default.js"(exports) {
      "use strict";
      exports.__esModule = true;
      exports.unsafeUniformIntDistribution = exports.unsafeUniformBigIntDistribution = exports.unsafeUniformArrayIntDistribution = exports.uniformIntDistribution = exports.uniformBigIntDistribution = exports.uniformArrayIntDistribution = exports.xoroshiro128plus = exports.xorshift128plus = exports.mersenne = exports.congruential32 = exports.unsafeSkipN = exports.unsafeGenerateN = exports.skipN = exports.generateN = exports.__commitHash = exports.__version = exports.__type = void 0;
      var RandomGenerator_1 = require_RandomGenerator();
      exports.generateN = RandomGenerator_1.generateN;
      exports.skipN = RandomGenerator_1.skipN;
      exports.unsafeGenerateN = RandomGenerator_1.unsafeGenerateN;
      exports.unsafeSkipN = RandomGenerator_1.unsafeSkipN;
      var LinearCongruential_1 = require_LinearCongruential();
      exports.congruential32 = LinearCongruential_1.congruential32;
      var MersenneTwister_1 = require_MersenneTwister();
      exports.mersenne = MersenneTwister_1["default"];
      var XorShift_1 = require_XorShift();
      exports.xorshift128plus = XorShift_1.xorshift128plus;
      var XoroShiro_1 = require_XoroShiro();
      exports.xoroshiro128plus = XoroShiro_1.xoroshiro128plus;
      var UniformArrayIntDistribution_1 = require_UniformArrayIntDistribution();
      exports.uniformArrayIntDistribution = UniformArrayIntDistribution_1.uniformArrayIntDistribution;
      var UniformBigIntDistribution_1 = require_UniformBigIntDistribution();
      exports.uniformBigIntDistribution = UniformBigIntDistribution_1.uniformBigIntDistribution;
      var UniformIntDistribution_1 = require_UniformIntDistribution();
      exports.uniformIntDistribution = UniformIntDistribution_1.uniformIntDistribution;
      var UnsafeUniformArrayIntDistribution_1 = require_UnsafeUniformArrayIntDistribution();
      exports.unsafeUniformArrayIntDistribution = UnsafeUniformArrayIntDistribution_1.unsafeUniformArrayIntDistribution;
      var UnsafeUniformBigIntDistribution_1 = require_UnsafeUniformBigIntDistribution();
      exports.unsafeUniformBigIntDistribution = UnsafeUniformBigIntDistribution_1.unsafeUniformBigIntDistribution;
      var UnsafeUniformIntDistribution_1 = require_UnsafeUniformIntDistribution();
      exports.unsafeUniformIntDistribution = UnsafeUniformIntDistribution_1.unsafeUniformIntDistribution;
      var __type = "commonjs";
      exports.__type = __type;
      var __version = "6.1.0";
      exports.__version = __version;
      var __commitHash = "a413dd2b721516be2ef29adffb515c5ae67bfbad";
      exports.__commitHash = __commitHash;
    }
  });

  // node_modules/pure-rand/lib/pure-rand.js
  var require_pure_rand = __commonJS({
    "node_modules/pure-rand/lib/pure-rand.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      }));
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      };
      exports.__esModule = true;
      var prand = require_pure_rand_default();
      exports["default"] = prand;
      __exportStar(require_pure_rand_default(), exports);
    }
  });

  // node_modules/fast-check/lib/check/runner/configuration/VerbosityLevel.js
  var require_VerbosityLevel = __commonJS({
    "node_modules/fast-check/lib/check/runner/configuration/VerbosityLevel.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.VerbosityLevel = void 0;
      var VerbosityLevel;
      (function(VerbosityLevel2) {
        VerbosityLevel2[VerbosityLevel2["None"] = 0] = "None";
        VerbosityLevel2[VerbosityLevel2["Verbose"] = 1] = "Verbose";
        VerbosityLevel2[VerbosityLevel2["VeryVerbose"] = 2] = "VeryVerbose";
      })(VerbosityLevel || (exports.VerbosityLevel = VerbosityLevel = {}));
    }
  });

  // node_modules/fast-check/lib/check/runner/configuration/QualifiedParameters.js
  var require_QualifiedParameters = __commonJS({
    "node_modules/fast-check/lib/check/runner/configuration/QualifiedParameters.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.QualifiedParameters = void 0;
      var pure_rand_1 = require_pure_rand();
      var VerbosityLevel_1 = require_VerbosityLevel();
      var safeDateNow = Date.now;
      var safeMathMin = Math.min;
      var safeMathRandom = Math.random;
      var QualifiedParameters = class _QualifiedParameters {
        constructor(op) {
          const p = op || {};
          this.seed = _QualifiedParameters.readSeed(p);
          this.randomType = _QualifiedParameters.readRandomType(p);
          this.numRuns = _QualifiedParameters.readNumRuns(p);
          this.verbose = _QualifiedParameters.readVerbose(p);
          this.maxSkipsPerRun = _QualifiedParameters.readOrDefault(p, "maxSkipsPerRun", 100);
          this.timeout = _QualifiedParameters.safeTimeout(_QualifiedParameters.readOrDefault(p, "timeout", null));
          this.skipAllAfterTimeLimit = _QualifiedParameters.safeTimeout(_QualifiedParameters.readOrDefault(p, "skipAllAfterTimeLimit", null));
          this.interruptAfterTimeLimit = _QualifiedParameters.safeTimeout(_QualifiedParameters.readOrDefault(p, "interruptAfterTimeLimit", null));
          this.markInterruptAsFailure = _QualifiedParameters.readBoolean(p, "markInterruptAsFailure");
          this.skipEqualValues = _QualifiedParameters.readBoolean(p, "skipEqualValues");
          this.ignoreEqualValues = _QualifiedParameters.readBoolean(p, "ignoreEqualValues");
          this.logger = _QualifiedParameters.readOrDefault(p, "logger", (v) => {
            console.log(v);
          });
          this.path = _QualifiedParameters.readOrDefault(p, "path", "");
          this.unbiased = _QualifiedParameters.readBoolean(p, "unbiased");
          this.examples = _QualifiedParameters.readOrDefault(p, "examples", []);
          this.endOnFailure = _QualifiedParameters.readBoolean(p, "endOnFailure");
          this.reporter = _QualifiedParameters.readOrDefault(p, "reporter", null);
          this.asyncReporter = _QualifiedParameters.readOrDefault(p, "asyncReporter", null);
          this.errorWithCause = _QualifiedParameters.readBoolean(p, "errorWithCause");
        }
        toParameters() {
          const orUndefined = (value) => value !== null ? value : void 0;
          const parameters = {
            seed: this.seed,
            randomType: this.randomType,
            numRuns: this.numRuns,
            maxSkipsPerRun: this.maxSkipsPerRun,
            timeout: orUndefined(this.timeout),
            skipAllAfterTimeLimit: orUndefined(this.skipAllAfterTimeLimit),
            interruptAfterTimeLimit: orUndefined(this.interruptAfterTimeLimit),
            markInterruptAsFailure: this.markInterruptAsFailure,
            skipEqualValues: this.skipEqualValues,
            ignoreEqualValues: this.ignoreEqualValues,
            path: this.path,
            logger: this.logger,
            unbiased: this.unbiased,
            verbose: this.verbose,
            examples: this.examples,
            endOnFailure: this.endOnFailure,
            reporter: orUndefined(this.reporter),
            asyncReporter: orUndefined(this.asyncReporter),
            errorWithCause: this.errorWithCause
          };
          return parameters;
        }
        static read(op) {
          return new _QualifiedParameters(op);
        }
      };
      exports.QualifiedParameters = QualifiedParameters;
      QualifiedParameters.createQualifiedRandomGenerator = (random) => {
        return (seed) => {
          const rng = random(seed);
          if (rng.unsafeJump === void 0) {
            rng.unsafeJump = () => (0, pure_rand_1.unsafeSkipN)(rng, 42);
          }
          return rng;
        };
      };
      QualifiedParameters.readSeed = (p) => {
        if (p.seed == null)
          return safeDateNow() ^ safeMathRandom() * 4294967296;
        const seed32 = p.seed | 0;
        if (p.seed === seed32)
          return seed32;
        const gap = p.seed - seed32;
        return seed32 ^ gap * 4294967296;
      };
      QualifiedParameters.readRandomType = (p) => {
        if (p.randomType == null)
          return pure_rand_1.default.xorshift128plus;
        if (typeof p.randomType === "string") {
          switch (p.randomType) {
            case "mersenne":
              return QualifiedParameters.createQualifiedRandomGenerator(pure_rand_1.default.mersenne);
            case "congruential":
            case "congruential32":
              return QualifiedParameters.createQualifiedRandomGenerator(pure_rand_1.default.congruential32);
            case "xorshift128plus":
              return pure_rand_1.default.xorshift128plus;
            case "xoroshiro128plus":
              return pure_rand_1.default.xoroshiro128plus;
            default:
              throw new Error(`Invalid random specified: '${p.randomType}'`);
          }
        }
        const mrng = p.randomType(0);
        if ("min" in mrng && mrng.min !== -2147483648) {
          throw new Error(`Invalid random number generator: min must equal -0x80000000, got ${String(mrng.min)}`);
        }
        if ("max" in mrng && mrng.max !== 2147483647) {
          throw new Error(`Invalid random number generator: max must equal 0x7fffffff, got ${String(mrng.max)}`);
        }
        if ("unsafeJump" in mrng) {
          return p.randomType;
        }
        return QualifiedParameters.createQualifiedRandomGenerator(p.randomType);
      };
      QualifiedParameters.readNumRuns = (p) => {
        const defaultValue = 100;
        if (p.numRuns != null)
          return p.numRuns;
        if (p.num_runs != null)
          return p.num_runs;
        return defaultValue;
      };
      QualifiedParameters.readVerbose = (p) => {
        if (p.verbose == null)
          return VerbosityLevel_1.VerbosityLevel.None;
        if (typeof p.verbose === "boolean") {
          return p.verbose === true ? VerbosityLevel_1.VerbosityLevel.Verbose : VerbosityLevel_1.VerbosityLevel.None;
        }
        if (p.verbose <= VerbosityLevel_1.VerbosityLevel.None) {
          return VerbosityLevel_1.VerbosityLevel.None;
        }
        if (p.verbose >= VerbosityLevel_1.VerbosityLevel.VeryVerbose) {
          return VerbosityLevel_1.VerbosityLevel.VeryVerbose;
        }
        return p.verbose | 0;
      };
      QualifiedParameters.readBoolean = (p, key) => p[key] === true;
      QualifiedParameters.readOrDefault = (p, key, defaultValue) => {
        const value = p[key];
        return value != null ? value : defaultValue;
      };
      QualifiedParameters.safeTimeout = (value) => {
        if (value === null) {
          return null;
        }
        return safeMathMin(value, 2147483647);
      };
    }
  });

  // node_modules/fast-check/lib/check/property/SkipAfterProperty.js
  var require_SkipAfterProperty = __commonJS({
    "node_modules/fast-check/lib/check/property/SkipAfterProperty.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SkipAfterProperty = void 0;
      var PreconditionFailure_1 = require_PreconditionFailure();
      function interruptAfter(timeMs, setTimeoutSafe, clearTimeoutSafe) {
        let timeoutHandle = null;
        const promise = new Promise((resolve) => {
          timeoutHandle = setTimeoutSafe(() => {
            const preconditionFailure = new PreconditionFailure_1.PreconditionFailure(true);
            resolve(preconditionFailure);
          }, timeMs);
        });
        return {
          clear: () => clearTimeoutSafe(timeoutHandle),
          promise
        };
      }
      var SkipAfterProperty = class {
        constructor(property, getTime, timeLimit, interruptExecution, setTimeoutSafe, clearTimeoutSafe) {
          this.property = property;
          this.getTime = getTime;
          this.interruptExecution = interruptExecution;
          this.setTimeoutSafe = setTimeoutSafe;
          this.clearTimeoutSafe = clearTimeoutSafe;
          this.skipAfterTime = this.getTime() + timeLimit;
          if (this.property.runBeforeEach !== void 0 && this.property.runAfterEach !== void 0) {
            this.runBeforeEach = () => this.property.runBeforeEach();
            this.runAfterEach = () => this.property.runAfterEach();
          }
        }
        isAsync() {
          return this.property.isAsync();
        }
        generate(mrng, runId) {
          return this.property.generate(mrng, runId);
        }
        shrink(value) {
          return this.property.shrink(value);
        }
        run(v, dontRunHook) {
          const remainingTime = this.skipAfterTime - this.getTime();
          if (remainingTime <= 0) {
            const preconditionFailure = new PreconditionFailure_1.PreconditionFailure(this.interruptExecution);
            if (this.isAsync()) {
              return Promise.resolve(preconditionFailure);
            } else {
              return preconditionFailure;
            }
          }
          if (this.interruptExecution && this.isAsync()) {
            const t = interruptAfter(remainingTime, this.setTimeoutSafe, this.clearTimeoutSafe);
            const propRun = Promise.race([this.property.run(v, dontRunHook), t.promise]);
            propRun.then(t.clear, t.clear);
            return propRun;
          }
          return this.property.run(v, dontRunHook);
        }
      };
      exports.SkipAfterProperty = SkipAfterProperty;
    }
  });

  // node_modules/fast-check/lib/check/property/TimeoutProperty.js
  var require_TimeoutProperty = __commonJS({
    "node_modules/fast-check/lib/check/property/TimeoutProperty.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TimeoutProperty = void 0;
      var globals_1 = require_globals();
      var timeoutAfter = (timeMs, setTimeoutSafe, clearTimeoutSafe) => {
        let timeoutHandle = null;
        const promise = new Promise((resolve) => {
          timeoutHandle = setTimeoutSafe(() => {
            resolve({
              error: new globals_1.Error(`Property timeout: exceeded limit of ${timeMs} milliseconds`),
              errorMessage: `Property timeout: exceeded limit of ${timeMs} milliseconds`
            });
          }, timeMs);
        });
        return {
          clear: () => clearTimeoutSafe(timeoutHandle),
          promise
        };
      };
      var TimeoutProperty = class {
        constructor(property, timeMs, setTimeoutSafe, clearTimeoutSafe) {
          this.property = property;
          this.timeMs = timeMs;
          this.setTimeoutSafe = setTimeoutSafe;
          this.clearTimeoutSafe = clearTimeoutSafe;
          if (this.property.runBeforeEach !== void 0 && this.property.runAfterEach !== void 0) {
            this.runBeforeEach = () => Promise.resolve(this.property.runBeforeEach());
            this.runAfterEach = () => Promise.resolve(this.property.runAfterEach());
          }
        }
        isAsync() {
          return true;
        }
        generate(mrng, runId) {
          return this.property.generate(mrng, runId);
        }
        shrink(value) {
          return this.property.shrink(value);
        }
        async run(v, dontRunHook) {
          const t = timeoutAfter(this.timeMs, this.setTimeoutSafe, this.clearTimeoutSafe);
          const propRun = Promise.race([this.property.run(v, dontRunHook), t.promise]);
          propRun.then(t.clear, t.clear);
          return propRun;
        }
      };
      exports.TimeoutProperty = TimeoutProperty;
    }
  });

  // node_modules/fast-check/lib/check/property/UnbiasedProperty.js
  var require_UnbiasedProperty = __commonJS({
    "node_modules/fast-check/lib/check/property/UnbiasedProperty.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.UnbiasedProperty = void 0;
      var UnbiasedProperty = class {
        constructor(property) {
          this.property = property;
          if (this.property.runBeforeEach !== void 0 && this.property.runAfterEach !== void 0) {
            this.runBeforeEach = () => this.property.runBeforeEach();
            this.runAfterEach = () => this.property.runAfterEach();
          }
        }
        isAsync() {
          return this.property.isAsync();
        }
        generate(mrng, _runId) {
          return this.property.generate(mrng, void 0);
        }
        shrink(value) {
          return this.property.shrink(value);
        }
        run(v, dontRunHook) {
          return this.property.run(v, dontRunHook);
        }
      };
      exports.UnbiasedProperty = UnbiasedProperty;
    }
  });

  // node_modules/fast-check/lib/utils/stringify.js
  var require_stringify = __commonJS({
    "node_modules/fast-check/lib/utils/stringify.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.asyncToStringMethod = exports.toStringMethod = void 0;
      exports.hasToStringMethod = hasToStringMethod;
      exports.hasAsyncToStringMethod = hasAsyncToStringMethod;
      exports.stringifyInternal = stringifyInternal;
      exports.stringify = stringify;
      exports.possiblyAsyncStringify = possiblyAsyncStringify;
      exports.asyncStringify = asyncStringify;
      var globals_1 = require_globals();
      var safeArrayFrom = Array.from;
      var safeBufferIsBuffer = typeof Buffer !== "undefined" ? Buffer.isBuffer : void 0;
      var safeJsonStringify = JSON.stringify;
      var safeNumberIsNaN = Number.isNaN;
      var safeObjectKeys = Object.keys;
      var safeObjectGetOwnPropertySymbols = Object.getOwnPropertySymbols;
      var safeObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var safeObjectGetPrototypeOf = Object.getPrototypeOf;
      var safeNegativeInfinity = Number.NEGATIVE_INFINITY;
      var safePositiveInfinity = Number.POSITIVE_INFINITY;
      exports.toStringMethod = /* @__PURE__ */ Symbol.for("fast-check/toStringMethod");
      function hasToStringMethod(instance) {
        return instance !== null && (typeof instance === "object" || typeof instance === "function") && exports.toStringMethod in instance && typeof instance[exports.toStringMethod] === "function";
      }
      exports.asyncToStringMethod = /* @__PURE__ */ Symbol.for("fast-check/asyncToStringMethod");
      function hasAsyncToStringMethod(instance) {
        return instance !== null && (typeof instance === "object" || typeof instance === "function") && exports.asyncToStringMethod in instance && typeof instance[exports.asyncToStringMethod] === "function";
      }
      var findSymbolNameRegex = /^Symbol\((.*)\)$/;
      function getSymbolDescription(s) {
        if (s.description !== void 0)
          return s.description;
        const m = findSymbolNameRegex.exec((0, globals_1.String)(s));
        return m && m[1].length ? m[1] : null;
      }
      function stringifyNumber(numValue) {
        switch (numValue) {
          case 0:
            return 1 / numValue === safeNegativeInfinity ? "-0" : "0";
          case safeNegativeInfinity:
            return "Number.NEGATIVE_INFINITY";
          case safePositiveInfinity:
            return "Number.POSITIVE_INFINITY";
          default:
            return numValue === numValue ? (0, globals_1.String)(numValue) : "Number.NaN";
        }
      }
      function isSparseArray(arr) {
        let previousNumberedIndex = -1;
        for (const index in arr) {
          const numberedIndex = Number(index);
          if (numberedIndex !== previousNumberedIndex + 1)
            return true;
          previousNumberedIndex = numberedIndex;
        }
        return previousNumberedIndex + 1 !== arr.length;
      }
      function stringifyInternal(value, previousValues, getAsyncContent) {
        const currentValues = [...previousValues, value];
        if (typeof value === "object") {
          if ((0, globals_1.safeIndexOf)(previousValues, value) !== -1) {
            return "[cyclic]";
          }
        }
        if (hasAsyncToStringMethod(value)) {
          const content = getAsyncContent(value);
          if (content.state === "fulfilled") {
            return content.value;
          }
        }
        if (hasToStringMethod(value)) {
          try {
            return value[exports.toStringMethod]();
          } catch (err) {
          }
        }
        switch ((0, globals_1.safeToString)(value)) {
          case "[object Array]": {
            const arr = value;
            if (arr.length >= 50 && isSparseArray(arr)) {
              const assignments = [];
              for (const index in arr) {
                if (!safeNumberIsNaN(Number(index)))
                  (0, globals_1.safePush)(assignments, `${index}:${stringifyInternal(arr[index], currentValues, getAsyncContent)}`);
              }
              return assignments.length !== 0 ? `Object.assign(Array(${arr.length}),{${(0, globals_1.safeJoin)(assignments, ",")}})` : `Array(${arr.length})`;
            }
            const stringifiedArray = (0, globals_1.safeJoin)((0, globals_1.safeMap)(arr, (v) => stringifyInternal(v, currentValues, getAsyncContent)), ",");
            return arr.length === 0 || arr.length - 1 in arr ? `[${stringifiedArray}]` : `[${stringifiedArray},]`;
          }
          case "[object BigInt]":
            return `${value}n`;
          case "[object Boolean]": {
            const unboxedToString = value == true ? "true" : "false";
            return typeof value === "boolean" ? unboxedToString : `new Boolean(${unboxedToString})`;
          }
          case "[object Date]": {
            const d = value;
            return safeNumberIsNaN((0, globals_1.safeGetTime)(d)) ? `new Date(NaN)` : `new Date(${safeJsonStringify((0, globals_1.safeToISOString)(d))})`;
          }
          case "[object Map]":
            return `new Map(${stringifyInternal(Array.from(value), currentValues, getAsyncContent)})`;
          case "[object Null]":
            return `null`;
          case "[object Number]":
            return typeof value === "number" ? stringifyNumber(value) : `new Number(${stringifyNumber(Number(value))})`;
          case "[object Object]": {
            try {
              const toStringAccessor = value.toString;
              if (typeof toStringAccessor === "function" && toStringAccessor !== Object.prototype.toString) {
                return value.toString();
              }
            } catch (err) {
              return "[object Object]";
            }
            const mapper = (k) => `${k === "__proto__" ? '["__proto__"]' : typeof k === "symbol" ? `[${stringifyInternal(k, currentValues, getAsyncContent)}]` : safeJsonStringify(k)}:${stringifyInternal(value[k], currentValues, getAsyncContent)}`;
            const stringifiedProperties = [
              ...(0, globals_1.safeMap)(safeObjectKeys(value), mapper),
              ...(0, globals_1.safeMap)((0, globals_1.safeFilter)(safeObjectGetOwnPropertySymbols(value), (s) => {
                const descriptor = safeObjectGetOwnPropertyDescriptor(value, s);
                return descriptor && descriptor.enumerable;
              }), mapper)
            ];
            const rawRepr = "{" + (0, globals_1.safeJoin)(stringifiedProperties, ",") + "}";
            if (safeObjectGetPrototypeOf(value) === null) {
              return rawRepr === "{}" ? "Object.create(null)" : `Object.assign(Object.create(null),${rawRepr})`;
            }
            return rawRepr;
          }
          case "[object Set]":
            return `new Set(${stringifyInternal(Array.from(value), currentValues, getAsyncContent)})`;
          case "[object String]":
            return typeof value === "string" ? safeJsonStringify(value) : `new String(${safeJsonStringify(value)})`;
          case "[object Symbol]": {
            const s = value;
            if (Symbol.keyFor(s) !== void 0) {
              return `Symbol.for(${safeJsonStringify(Symbol.keyFor(s))})`;
            }
            const desc = getSymbolDescription(s);
            if (desc === null) {
              return "Symbol()";
            }
            const knownSymbol = desc.startsWith("Symbol.") && Symbol[desc.substring(7)];
            return s === knownSymbol ? desc : `Symbol(${safeJsonStringify(desc)})`;
          }
          case "[object Promise]": {
            const promiseContent = getAsyncContent(value);
            switch (promiseContent.state) {
              case "fulfilled":
                return `Promise.resolve(${stringifyInternal(promiseContent.value, currentValues, getAsyncContent)})`;
              case "rejected":
                return `Promise.reject(${stringifyInternal(promiseContent.value, currentValues, getAsyncContent)})`;
              case "pending":
                return `new Promise(() => {/*pending*/})`;
              case "unknown":
              default:
                return `new Promise(() => {/*unknown*/})`;
            }
          }
          case "[object Error]":
            if (value instanceof Error) {
              return `new Error(${stringifyInternal(value.message, currentValues, getAsyncContent)})`;
            }
            break;
          case "[object Undefined]":
            return `undefined`;
          case "[object Int8Array]":
          case "[object Uint8Array]":
          case "[object Uint8ClampedArray]":
          case "[object Int16Array]":
          case "[object Uint16Array]":
          case "[object Int32Array]":
          case "[object Uint32Array]":
          case "[object Float32Array]":
          case "[object Float64Array]":
          case "[object BigInt64Array]":
          case "[object BigUint64Array]": {
            if (typeof safeBufferIsBuffer === "function" && safeBufferIsBuffer(value)) {
              return `Buffer.from(${stringifyInternal(safeArrayFrom(value.values()), currentValues, getAsyncContent)})`;
            }
            const valuePrototype = safeObjectGetPrototypeOf(value);
            const className = valuePrototype && valuePrototype.constructor && valuePrototype.constructor.name;
            if (typeof className === "string") {
              const typedArray = value;
              const valuesFromTypedArr = typedArray.values();
              return `${className}.from(${stringifyInternal(safeArrayFrom(valuesFromTypedArr), currentValues, getAsyncContent)})`;
            }
            break;
          }
        }
        try {
          return value.toString();
        } catch (_a) {
          return (0, globals_1.safeToString)(value);
        }
      }
      function stringify(value) {
        return stringifyInternal(value, [], () => ({ state: "unknown", value: void 0 }));
      }
      function possiblyAsyncStringify(value) {
        const stillPendingMarker = /* @__PURE__ */ Symbol();
        const pendingPromisesForCache = [];
        const cache = /* @__PURE__ */ new Map();
        function createDelay0() {
          let handleId = null;
          const cancel = () => {
            if (handleId !== null) {
              clearTimeout(handleId);
            }
          };
          const delay = new Promise((resolve) => {
            handleId = setTimeout(() => {
              handleId = null;
              resolve(stillPendingMarker);
            }, 0);
          });
          return { delay, cancel };
        }
        const unknownState = { state: "unknown", value: void 0 };
        const getAsyncContent = function getAsyncContent2(data) {
          const cacheKey = data;
          if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
          }
          const delay0 = createDelay0();
          const p = exports.asyncToStringMethod in data ? Promise.resolve().then(() => data[exports.asyncToStringMethod]()) : data;
          p.catch(() => {
          });
          pendingPromisesForCache.push(Promise.race([p, delay0.delay]).then((successValue) => {
            if (successValue === stillPendingMarker)
              cache.set(cacheKey, { state: "pending", value: void 0 });
            else
              cache.set(cacheKey, { state: "fulfilled", value: successValue });
            delay0.cancel();
          }, (errorValue) => {
            cache.set(cacheKey, { state: "rejected", value: errorValue });
            delay0.cancel();
          }));
          cache.set(cacheKey, unknownState);
          return unknownState;
        };
        function loop() {
          const stringifiedValue = stringifyInternal(value, [], getAsyncContent);
          if (pendingPromisesForCache.length === 0) {
            return stringifiedValue;
          }
          return Promise.all(pendingPromisesForCache.splice(0)).then(loop);
        }
        return loop();
      }
      async function asyncStringify(value) {
        return Promise.resolve(possiblyAsyncStringify(value));
      }
    }
  });

  // node_modules/fast-check/lib/check/property/IgnoreEqualValuesProperty.js
  var require_IgnoreEqualValuesProperty = __commonJS({
    "node_modules/fast-check/lib/check/property/IgnoreEqualValuesProperty.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.IgnoreEqualValuesProperty = void 0;
      var stringify_1 = require_stringify();
      var PreconditionFailure_1 = require_PreconditionFailure();
      function fromSyncCached(cachedValue) {
        return cachedValue === null ? new PreconditionFailure_1.PreconditionFailure() : cachedValue;
      }
      function fromCached(...data) {
        if (data[1])
          return data[0].then(fromSyncCached);
        return fromSyncCached(data[0]);
      }
      function fromCachedUnsafe(cachedValue, isAsync) {
        return fromCached(cachedValue, isAsync);
      }
      var IgnoreEqualValuesProperty = class {
        constructor(property, skipRuns) {
          this.property = property;
          this.skipRuns = skipRuns;
          this.coveredCases = /* @__PURE__ */ new Map();
          if (this.property.runBeforeEach !== void 0 && this.property.runAfterEach !== void 0) {
            this.runBeforeEach = () => this.property.runBeforeEach();
            this.runAfterEach = () => this.property.runAfterEach();
          }
        }
        isAsync() {
          return this.property.isAsync();
        }
        generate(mrng, runId) {
          return this.property.generate(mrng, runId);
        }
        shrink(value) {
          return this.property.shrink(value);
        }
        run(v, dontRunHook) {
          const stringifiedValue = (0, stringify_1.stringify)(v);
          if (this.coveredCases.has(stringifiedValue)) {
            const lastOutput = this.coveredCases.get(stringifiedValue);
            if (!this.skipRuns) {
              return lastOutput;
            }
            return fromCachedUnsafe(lastOutput, this.property.isAsync());
          }
          const out = this.property.run(v, dontRunHook);
          this.coveredCases.set(stringifiedValue, out);
          return out;
        }
      };
      exports.IgnoreEqualValuesProperty = IgnoreEqualValuesProperty;
    }
  });

  // node_modules/fast-check/lib/check/runner/DecorateProperty.js
  var require_DecorateProperty = __commonJS({
    "node_modules/fast-check/lib/check/runner/DecorateProperty.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.decorateProperty = decorateProperty;
      var SkipAfterProperty_1 = require_SkipAfterProperty();
      var TimeoutProperty_1 = require_TimeoutProperty();
      var UnbiasedProperty_1 = require_UnbiasedProperty();
      var IgnoreEqualValuesProperty_1 = require_IgnoreEqualValuesProperty();
      var safeDateNow = Date.now;
      var safeSetTimeout = setTimeout;
      var safeClearTimeout = clearTimeout;
      function decorateProperty(rawProperty, qParams) {
        let prop = rawProperty;
        if (rawProperty.isAsync() && qParams.timeout != null) {
          prop = new TimeoutProperty_1.TimeoutProperty(prop, qParams.timeout, safeSetTimeout, safeClearTimeout);
        }
        if (qParams.unbiased) {
          prop = new UnbiasedProperty_1.UnbiasedProperty(prop);
        }
        if (qParams.skipAllAfterTimeLimit != null) {
          prop = new SkipAfterProperty_1.SkipAfterProperty(prop, safeDateNow, qParams.skipAllAfterTimeLimit, false, safeSetTimeout, safeClearTimeout);
        }
        if (qParams.interruptAfterTimeLimit != null) {
          prop = new SkipAfterProperty_1.SkipAfterProperty(prop, safeDateNow, qParams.interruptAfterTimeLimit, true, safeSetTimeout, safeClearTimeout);
        }
        if (qParams.skipEqualValues) {
          prop = new IgnoreEqualValuesProperty_1.IgnoreEqualValuesProperty(prop, true);
        }
        if (qParams.ignoreEqualValues) {
          prop = new IgnoreEqualValuesProperty_1.IgnoreEqualValuesProperty(prop, false);
        }
        return prop;
      }
    }
  });

  // node_modules/fast-check/lib/check/runner/reporter/ExecutionStatus.js
  var require_ExecutionStatus = __commonJS({
    "node_modules/fast-check/lib/check/runner/reporter/ExecutionStatus.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ExecutionStatus = void 0;
      var ExecutionStatus;
      (function(ExecutionStatus2) {
        ExecutionStatus2[ExecutionStatus2["Success"] = 0] = "Success";
        ExecutionStatus2[ExecutionStatus2["Skipped"] = -1] = "Skipped";
        ExecutionStatus2[ExecutionStatus2["Failure"] = 1] = "Failure";
      })(ExecutionStatus || (exports.ExecutionStatus = ExecutionStatus = {}));
    }
  });

  // node_modules/fast-check/lib/check/runner/reporter/RunExecution.js
  var require_RunExecution = __commonJS({
    "node_modules/fast-check/lib/check/runner/reporter/RunExecution.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.RunExecution = void 0;
      var VerbosityLevel_1 = require_VerbosityLevel();
      var ExecutionStatus_1 = require_ExecutionStatus();
      var globals_1 = require_globals();
      var RunExecution = class _RunExecution {
        constructor(verbosity, interruptedAsFailure) {
          this.verbosity = verbosity;
          this.interruptedAsFailure = interruptedAsFailure;
          this.isSuccess = () => this.pathToFailure == null;
          this.firstFailure = () => this.pathToFailure ? +(0, globals_1.safeSplit)(this.pathToFailure, ":")[0] : -1;
          this.numShrinks = () => this.pathToFailure ? (0, globals_1.safeSplit)(this.pathToFailure, ":").length - 1 : 0;
          this.rootExecutionTrees = [];
          this.currentLevelExecutionTrees = this.rootExecutionTrees;
          this.failure = null;
          this.numSkips = 0;
          this.numSuccesses = 0;
          this.interrupted = false;
        }
        appendExecutionTree(status, value) {
          const currentTree = { status, value, children: [] };
          this.currentLevelExecutionTrees.push(currentTree);
          return currentTree;
        }
        fail(value, id, failure) {
          if (this.verbosity >= VerbosityLevel_1.VerbosityLevel.Verbose) {
            const currentTree = this.appendExecutionTree(ExecutionStatus_1.ExecutionStatus.Failure, value);
            this.currentLevelExecutionTrees = currentTree.children;
          }
          if (this.pathToFailure == null)
            this.pathToFailure = `${id}`;
          else
            this.pathToFailure += `:${id}`;
          this.value = value;
          this.failure = failure;
        }
        skip(value) {
          if (this.verbosity >= VerbosityLevel_1.VerbosityLevel.VeryVerbose) {
            this.appendExecutionTree(ExecutionStatus_1.ExecutionStatus.Skipped, value);
          }
          if (this.pathToFailure == null) {
            ++this.numSkips;
          }
        }
        success(value) {
          if (this.verbosity >= VerbosityLevel_1.VerbosityLevel.VeryVerbose) {
            this.appendExecutionTree(ExecutionStatus_1.ExecutionStatus.Success, value);
          }
          if (this.pathToFailure == null) {
            ++this.numSuccesses;
          }
        }
        interrupt() {
          this.interrupted = true;
        }
        extractFailures() {
          if (this.isSuccess()) {
            return [];
          }
          const failures = [];
          let cursor = this.rootExecutionTrees;
          while (cursor.length > 0 && cursor[cursor.length - 1].status === ExecutionStatus_1.ExecutionStatus.Failure) {
            const failureTree = cursor[cursor.length - 1];
            failures.push(failureTree.value);
            cursor = failureTree.children;
          }
          return failures;
        }
        toRunDetails(seed, basePath, maxSkips, qParams) {
          if (!this.isSuccess()) {
            return {
              failed: true,
              interrupted: this.interrupted,
              numRuns: this.firstFailure() + 1 - this.numSkips,
              numSkips: this.numSkips,
              numShrinks: this.numShrinks(),
              seed,
              counterexample: this.value,
              counterexamplePath: _RunExecution.mergePaths(basePath, this.pathToFailure),
              error: this.failure.errorMessage,
              errorInstance: this.failure.error,
              failures: this.extractFailures(),
              executionSummary: this.rootExecutionTrees,
              verbose: this.verbosity,
              runConfiguration: qParams.toParameters()
            };
          }
          const considerInterruptedAsFailure = this.interruptedAsFailure || this.numSuccesses === 0;
          const failed = this.numSkips > maxSkips || this.interrupted && considerInterruptedAsFailure;
          const out = {
            failed,
            interrupted: this.interrupted,
            numRuns: this.numSuccesses,
            numSkips: this.numSkips,
            numShrinks: 0,
            seed,
            counterexample: null,
            counterexamplePath: null,
            error: null,
            errorInstance: null,
            failures: [],
            executionSummary: this.rootExecutionTrees,
            verbose: this.verbosity,
            runConfiguration: qParams.toParameters()
          };
          return out;
        }
      };
      exports.RunExecution = RunExecution;
      RunExecution.mergePaths = (offsetPath, path) => {
        if (offsetPath.length === 0)
          return path;
        const offsetItems = offsetPath.split(":");
        const remainingItems = path.split(":");
        const middle = +offsetItems[offsetItems.length - 1] + +remainingItems[0];
        return [...offsetItems.slice(0, offsetItems.length - 1), `${middle}`, ...remainingItems.slice(1)].join(":");
      };
    }
  });

  // node_modules/fast-check/lib/check/runner/RunnerIterator.js
  var require_RunnerIterator = __commonJS({
    "node_modules/fast-check/lib/check/runner/RunnerIterator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.RunnerIterator = void 0;
      var PreconditionFailure_1 = require_PreconditionFailure();
      var RunExecution_1 = require_RunExecution();
      var RunnerIterator = class {
        constructor(sourceValues, shrink, verbose, interruptedAsFailure) {
          this.sourceValues = sourceValues;
          this.shrink = shrink;
          this.runExecution = new RunExecution_1.RunExecution(verbose, interruptedAsFailure);
          this.currentIdx = -1;
          this.nextValues = sourceValues;
        }
        [Symbol.iterator]() {
          return this;
        }
        next() {
          const nextValue = this.nextValues.next();
          if (nextValue.done || this.runExecution.interrupted) {
            return { done: true, value: void 0 };
          }
          this.currentValue = nextValue.value;
          ++this.currentIdx;
          return { done: false, value: nextValue.value.value_ };
        }
        handleResult(result) {
          if (result != null && typeof result === "object" && !PreconditionFailure_1.PreconditionFailure.isFailure(result)) {
            this.runExecution.fail(this.currentValue.value_, this.currentIdx, result);
            this.currentIdx = -1;
            this.nextValues = this.shrink(this.currentValue);
          } else if (result != null) {
            if (!result.interruptExecution) {
              this.runExecution.skip(this.currentValue.value_);
              this.sourceValues.skippedOne();
            } else {
              this.runExecution.interrupt();
            }
          } else {
            this.runExecution.success(this.currentValue.value_);
          }
        }
      };
      exports.RunnerIterator = RunnerIterator;
    }
  });

  // node_modules/fast-check/lib/check/runner/SourceValuesIterator.js
  var require_SourceValuesIterator = __commonJS({
    "node_modules/fast-check/lib/check/runner/SourceValuesIterator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SourceValuesIterator = void 0;
      var SourceValuesIterator = class {
        constructor(initialValues, maxInitialIterations, remainingSkips) {
          this.initialValues = initialValues;
          this.maxInitialIterations = maxInitialIterations;
          this.remainingSkips = remainingSkips;
        }
        [Symbol.iterator]() {
          return this;
        }
        next() {
          if (--this.maxInitialIterations !== -1 && this.remainingSkips >= 0) {
            const n = this.initialValues.next();
            if (!n.done)
              return { value: n.value, done: false };
          }
          return { value: void 0, done: true };
        }
        skippedOne() {
          --this.remainingSkips;
          ++this.maxInitialIterations;
        }
      };
      exports.SourceValuesIterator = SourceValuesIterator;
    }
  });

  // node_modules/fast-check/lib/random/generator/Random.js
  var require_Random = __commonJS({
    "node_modules/fast-check/lib/random/generator/Random.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Random = void 0;
      var pure_rand_1 = require_pure_rand();
      var Random = class _Random {
        constructor(sourceRng) {
          this.internalRng = sourceRng.clone();
        }
        clone() {
          return new _Random(this.internalRng);
        }
        next(bits) {
          return (0, pure_rand_1.unsafeUniformIntDistribution)(0, (1 << bits) - 1, this.internalRng);
        }
        nextBoolean() {
          return (0, pure_rand_1.unsafeUniformIntDistribution)(0, 1, this.internalRng) == 1;
        }
        nextInt(min, max) {
          return (0, pure_rand_1.unsafeUniformIntDistribution)(min == null ? _Random.MIN_INT : min, max == null ? _Random.MAX_INT : max, this.internalRng);
        }
        nextBigInt(min, max) {
          return (0, pure_rand_1.unsafeUniformBigIntDistribution)(min, max, this.internalRng);
        }
        nextArrayInt(min, max) {
          return (0, pure_rand_1.unsafeUniformArrayIntDistribution)(min, max, this.internalRng);
        }
        nextDouble() {
          const a = this.next(26);
          const b = this.next(27);
          return (a * _Random.DBL_FACTOR + b) * _Random.DBL_DIVISOR;
        }
        getState() {
          if ("getState" in this.internalRng && typeof this.internalRng.getState === "function") {
            return this.internalRng.getState();
          }
          return void 0;
        }
      };
      exports.Random = Random;
      Random.MIN_INT = 2147483648 | 0;
      Random.MAX_INT = 2147483647 | 0;
      Random.DBL_FACTOR = Math.pow(2, 27);
      Random.DBL_DIVISOR = Math.pow(2, -53);
    }
  });

  // node_modules/fast-check/lib/check/runner/Tosser.js
  var require_Tosser = __commonJS({
    "node_modules/fast-check/lib/check/runner/Tosser.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.toss = toss;
      exports.lazyToss = lazyToss;
      var pure_rand_1 = require_pure_rand();
      var Random_1 = require_Random();
      var Value_1 = require_Value();
      var globals_1 = require_globals();
      function tossNext(generator, rng, index) {
        rng.unsafeJump();
        return generator.generate(new Random_1.Random(rng), index);
      }
      function* toss(generator, seed, random, examples) {
        for (let idx = 0; idx !== examples.length; ++idx) {
          yield new Value_1.Value(examples[idx], void 0);
        }
        for (let idx = 0, rng = random(seed); ; ++idx) {
          yield tossNext(generator, rng, idx);
        }
      }
      function lazyGenerate(generator, rng, idx) {
        return () => generator.generate(new Random_1.Random(rng), idx);
      }
      function* lazyToss(generator, seed, random, examples) {
        yield* (0, globals_1.safeMap)(examples, (e) => () => new Value_1.Value(e, void 0));
        let idx = 0;
        let rng = random(seed);
        for (; ; ) {
          rng = rng.jump ? rng.jump() : (0, pure_rand_1.skipN)(rng, 42);
          yield lazyGenerate(generator, rng, idx++);
        }
      }
    }
  });

  // node_modules/fast-check/lib/check/runner/utils/PathWalker.js
  var require_PathWalker = __commonJS({
    "node_modules/fast-check/lib/check/runner/utils/PathWalker.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.pathWalk = pathWalk;
      function produce(producer) {
        return producer();
      }
      function pathWalk(path, initialProducers, shrink) {
        const producers = initialProducers;
        const segments = path.split(":").map((text) => +text);
        if (segments.length === 0) {
          return producers.map(produce);
        }
        if (!segments.every((v) => !Number.isNaN(v))) {
          throw new Error(`Unable to replay, got invalid path=${path}`);
        }
        let values = producers.drop(segments[0]).map(produce);
        for (const s of segments.slice(1)) {
          const valueToShrink = values.getNthOrLast(0);
          if (valueToShrink === null) {
            throw new Error(`Unable to replay, got wrong path=${path}`);
          }
          values = shrink(valueToShrink).drop(s);
        }
        return values;
      }
    }
  });

  // node_modules/fast-check/lib/check/runner/utils/RunDetailsFormatter.js
  var require_RunDetailsFormatter = __commonJS({
    "node_modules/fast-check/lib/check/runner/utils/RunDetailsFormatter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.reportRunDetails = reportRunDetails;
      exports.asyncReportRunDetails = asyncReportRunDetails;
      exports.defaultReportMessage = defaultReportMessage;
      exports.asyncDefaultReportMessage = asyncDefaultReportMessage;
      var globals_1 = require_globals();
      var stringify_1 = require_stringify();
      var VerbosityLevel_1 = require_VerbosityLevel();
      var ExecutionStatus_1 = require_ExecutionStatus();
      var safeObjectAssign = Object.assign;
      function formatHints(hints) {
        if (hints.length === 1) {
          return `Hint: ${hints[0]}`;
        }
        return hints.map((h, idx) => `Hint (${idx + 1}): ${h}`).join("\n");
      }
      function formatFailures(failures, stringifyOne) {
        return `Encountered failures were:
- ${failures.map(stringifyOne).join("\n- ")}`;
      }
      function formatExecutionSummary(executionTrees, stringifyOne) {
        const summaryLines = [];
        const remainingTreesAndDepth = [];
        for (const tree of executionTrees.slice().reverse()) {
          remainingTreesAndDepth.push({ depth: 1, tree });
        }
        while (remainingTreesAndDepth.length !== 0) {
          const currentTreeAndDepth = remainingTreesAndDepth.pop();
          const currentTree = currentTreeAndDepth.tree;
          const currentDepth = currentTreeAndDepth.depth;
          const statusIcon = currentTree.status === ExecutionStatus_1.ExecutionStatus.Success ? "\x1B[32m\u221A\x1B[0m" : currentTree.status === ExecutionStatus_1.ExecutionStatus.Failure ? "\x1B[31m\xD7\x1B[0m" : "\x1B[33m!\x1B[0m";
          const leftPadding = Array(currentDepth).join(". ");
          summaryLines.push(`${leftPadding}${statusIcon} ${stringifyOne(currentTree.value)}`);
          for (const tree of currentTree.children.slice().reverse()) {
            remainingTreesAndDepth.push({ depth: currentDepth + 1, tree });
          }
        }
        return `Execution summary:
${summaryLines.join("\n")}`;
      }
      function preFormatTooManySkipped(out, stringifyOne) {
        const message = `Failed to run property, too many pre-condition failures encountered
{ seed: ${out.seed} }

Ran ${out.numRuns} time(s)
Skipped ${out.numSkips} time(s)`;
        let details = null;
        const hints = [
          "Try to reduce the number of rejected values by combining map, flatMap and built-in arbitraries",
          "Increase failure tolerance by setting maxSkipsPerRun to an higher value"
        ];
        if (out.verbose >= VerbosityLevel_1.VerbosityLevel.VeryVerbose) {
          details = formatExecutionSummary(out.executionSummary, stringifyOne);
        } else {
          (0, globals_1.safePush)(hints, "Enable verbose mode at level VeryVerbose in order to check all generated values and their associated status");
        }
        return { message, details, hints };
      }
      function preFormatFailure(out, stringifyOne) {
        const noErrorInMessage = out.runConfiguration.errorWithCause;
        const messageErrorPart = noErrorInMessage ? "" : `
Got ${(0, globals_1.safeReplace)(out.error, /^Error: /, "error: ")}`;
        const message = `Property failed after ${out.numRuns} tests
{ seed: ${out.seed}, path: "${out.counterexamplePath}", endOnFailure: true }
Counterexample: ${stringifyOne(out.counterexample)}
Shrunk ${out.numShrinks} time(s)${messageErrorPart}`;
        let details = null;
        const hints = [];
        if (out.verbose >= VerbosityLevel_1.VerbosityLevel.VeryVerbose) {
          details = formatExecutionSummary(out.executionSummary, stringifyOne);
        } else if (out.verbose === VerbosityLevel_1.VerbosityLevel.Verbose) {
          details = formatFailures(out.failures, stringifyOne);
        } else {
          (0, globals_1.safePush)(hints, "Enable verbose mode in order to have the list of all failing values encountered during the run");
        }
        return { message, details, hints };
      }
      function preFormatEarlyInterrupted(out, stringifyOne) {
        const message = `Property interrupted after ${out.numRuns} tests
{ seed: ${out.seed} }`;
        let details = null;
        const hints = [];
        if (out.verbose >= VerbosityLevel_1.VerbosityLevel.VeryVerbose) {
          details = formatExecutionSummary(out.executionSummary, stringifyOne);
        } else {
          (0, globals_1.safePush)(hints, "Enable verbose mode at level VeryVerbose in order to check all generated values and their associated status");
        }
        return { message, details, hints };
      }
      function defaultReportMessageInternal(out, stringifyOne) {
        if (!out.failed)
          return;
        const { message, details, hints } = out.counterexamplePath === null ? out.interrupted ? preFormatEarlyInterrupted(out, stringifyOne) : preFormatTooManySkipped(out, stringifyOne) : preFormatFailure(out, stringifyOne);
        let errorMessage = message;
        if (details != null)
          errorMessage += `

${details}`;
        if (hints.length > 0)
          errorMessage += `

${formatHints(hints)}`;
        return errorMessage;
      }
      function defaultReportMessage(out) {
        return defaultReportMessageInternal(out, stringify_1.stringify);
      }
      async function asyncDefaultReportMessage(out) {
        const pendingStringifieds = [];
        function stringifyOne(value) {
          const stringified = (0, stringify_1.possiblyAsyncStringify)(value);
          if (typeof stringified === "string") {
            return stringified;
          }
          pendingStringifieds.push(Promise.all([value, stringified]));
          return "\u2026";
        }
        const firstTryMessage = defaultReportMessageInternal(out, stringifyOne);
        if (pendingStringifieds.length === 0) {
          return firstTryMessage;
        }
        const registeredValues = new Map(await Promise.all(pendingStringifieds));
        function stringifySecond(value) {
          const asyncStringifiedIfRegistered = registeredValues.get(value);
          if (asyncStringifiedIfRegistered !== void 0) {
            return asyncStringifiedIfRegistered;
          }
          return (0, stringify_1.stringify)(value);
        }
        return defaultReportMessageInternal(out, stringifySecond);
      }
      function buildError(errorMessage, out) {
        if (!out.runConfiguration.errorWithCause) {
          throw new globals_1.Error(errorMessage);
        }
        const ErrorWithCause = globals_1.Error;
        const error = new ErrorWithCause(errorMessage, { cause: out.errorInstance });
        if (!("cause" in error)) {
          safeObjectAssign(error, { cause: out.errorInstance });
        }
        return error;
      }
      function throwIfFailed(out) {
        if (!out.failed)
          return;
        throw buildError(defaultReportMessage(out), out);
      }
      async function asyncThrowIfFailed(out) {
        if (!out.failed)
          return;
        throw buildError(await asyncDefaultReportMessage(out), out);
      }
      function reportRunDetails(out) {
        if (out.runConfiguration.asyncReporter)
          return out.runConfiguration.asyncReporter(out);
        else if (out.runConfiguration.reporter)
          return out.runConfiguration.reporter(out);
        else
          return throwIfFailed(out);
      }
      async function asyncReportRunDetails(out) {
        if (out.runConfiguration.asyncReporter)
          return out.runConfiguration.asyncReporter(out);
        else if (out.runConfiguration.reporter)
          return out.runConfiguration.reporter(out);
        else
          return asyncThrowIfFailed(out);
      }
    }
  });

  // node_modules/fast-check/lib/check/runner/Runner.js
  var require_Runner = __commonJS({
    "node_modules/fast-check/lib/check/runner/Runner.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.check = check;
      exports.assert = assert;
      var Stream_1 = require_Stream();
      var GlobalParameters_1 = require_GlobalParameters();
      var QualifiedParameters_1 = require_QualifiedParameters();
      var DecorateProperty_1 = require_DecorateProperty();
      var RunnerIterator_1 = require_RunnerIterator();
      var SourceValuesIterator_1 = require_SourceValuesIterator();
      var Tosser_1 = require_Tosser();
      var PathWalker_1 = require_PathWalker();
      var RunDetailsFormatter_1 = require_RunDetailsFormatter();
      var safeObjectAssign = Object.assign;
      function runIt(property, shrink, sourceValues, verbose, interruptedAsFailure) {
        const isModernProperty = property.runBeforeEach !== void 0 && property.runAfterEach !== void 0;
        const runner = new RunnerIterator_1.RunnerIterator(sourceValues, shrink, verbose, interruptedAsFailure);
        for (const v of runner) {
          if (isModernProperty) {
            property.runBeforeEach();
          }
          const out = property.run(v, isModernProperty);
          if (isModernProperty) {
            property.runAfterEach();
          }
          runner.handleResult(out);
        }
        return runner.runExecution;
      }
      async function asyncRunIt(property, shrink, sourceValues, verbose, interruptedAsFailure) {
        const isModernProperty = property.runBeforeEach !== void 0 && property.runAfterEach !== void 0;
        const runner = new RunnerIterator_1.RunnerIterator(sourceValues, shrink, verbose, interruptedAsFailure);
        for (const v of runner) {
          if (isModernProperty) {
            await property.runBeforeEach();
          }
          const out = await property.run(v, isModernProperty);
          if (isModernProperty) {
            await property.runAfterEach();
          }
          runner.handleResult(out);
        }
        return runner.runExecution;
      }
      function check(rawProperty, params) {
        if (rawProperty == null || rawProperty.generate == null)
          throw new Error("Invalid property encountered, please use a valid property");
        if (rawProperty.run == null)
          throw new Error("Invalid property encountered, please use a valid property not an arbitrary");
        const qParams = QualifiedParameters_1.QualifiedParameters.read(safeObjectAssign(safeObjectAssign({}, (0, GlobalParameters_1.readConfigureGlobal)()), params));
        if (qParams.reporter !== null && qParams.asyncReporter !== null)
          throw new Error("Invalid parameters encountered, reporter and asyncReporter cannot be specified together");
        if (qParams.asyncReporter !== null && !rawProperty.isAsync())
          throw new Error("Invalid parameters encountered, only asyncProperty can be used when asyncReporter specified");
        const property = (0, DecorateProperty_1.decorateProperty)(rawProperty, qParams);
        const maxInitialIterations = qParams.path.length === 0 || qParams.path.indexOf(":") === -1 ? qParams.numRuns : -1;
        const maxSkips = qParams.numRuns * qParams.maxSkipsPerRun;
        const shrink = (...args) => property.shrink(...args);
        const initialValues = qParams.path.length === 0 ? (0, Tosser_1.toss)(property, qParams.seed, qParams.randomType, qParams.examples) : (0, PathWalker_1.pathWalk)(qParams.path, (0, Stream_1.stream)((0, Tosser_1.lazyToss)(property, qParams.seed, qParams.randomType, qParams.examples)), shrink);
        const sourceValues = new SourceValuesIterator_1.SourceValuesIterator(initialValues, maxInitialIterations, maxSkips);
        const finalShrink = !qParams.endOnFailure ? shrink : Stream_1.Stream.nil;
        return property.isAsync() ? asyncRunIt(property, finalShrink, sourceValues, qParams.verbose, qParams.markInterruptAsFailure).then((e) => e.toRunDetails(qParams.seed, qParams.path, maxSkips, qParams)) : runIt(property, finalShrink, sourceValues, qParams.verbose, qParams.markInterruptAsFailure).toRunDetails(qParams.seed, qParams.path, maxSkips, qParams);
      }
      function assert(property, params) {
        const out = check(property, params);
        if (property.isAsync())
          return out.then(RunDetailsFormatter_1.asyncReportRunDetails);
        else
          (0, RunDetailsFormatter_1.reportRunDetails)(out);
      }
    }
  });

  // node_modules/fast-check/lib/check/runner/Sampler.js
  var require_Sampler = __commonJS({
    "node_modules/fast-check/lib/check/runner/Sampler.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.sample = sample;
      exports.statistics = statistics;
      var Stream_1 = require_Stream();
      var Property_generic_1 = require_Property_generic();
      var UnbiasedProperty_1 = require_UnbiasedProperty();
      var GlobalParameters_1 = require_GlobalParameters();
      var QualifiedParameters_1 = require_QualifiedParameters();
      var Tosser_1 = require_Tosser();
      var PathWalker_1 = require_PathWalker();
      function toProperty(generator, qParams) {
        const prop = !Object.prototype.hasOwnProperty.call(generator, "isAsync") ? new Property_generic_1.Property(generator, () => true) : generator;
        return qParams.unbiased === true ? new UnbiasedProperty_1.UnbiasedProperty(prop) : prop;
      }
      function streamSample(generator, params) {
        const extendedParams = typeof params === "number" ? Object.assign(Object.assign({}, (0, GlobalParameters_1.readConfigureGlobal)()), { numRuns: params }) : Object.assign(Object.assign({}, (0, GlobalParameters_1.readConfigureGlobal)()), params);
        const qParams = QualifiedParameters_1.QualifiedParameters.read(extendedParams);
        const nextProperty = toProperty(generator, qParams);
        const shrink = nextProperty.shrink.bind(nextProperty);
        const tossedValues = qParams.path.length === 0 ? (0, Stream_1.stream)((0, Tosser_1.toss)(nextProperty, qParams.seed, qParams.randomType, qParams.examples)) : (0, PathWalker_1.pathWalk)(qParams.path, (0, Stream_1.stream)((0, Tosser_1.lazyToss)(nextProperty, qParams.seed, qParams.randomType, qParams.examples)), shrink);
        return tossedValues.take(qParams.numRuns).map((s) => s.value_);
      }
      function sample(generator, params) {
        return [...streamSample(generator, params)];
      }
      function round2(n) {
        return (Math.round(n * 100) / 100).toFixed(2);
      }
      function statistics(generator, classify, params) {
        const extendedParams = typeof params === "number" ? Object.assign(Object.assign({}, (0, GlobalParameters_1.readConfigureGlobal)()), { numRuns: params }) : Object.assign(Object.assign({}, (0, GlobalParameters_1.readConfigureGlobal)()), params);
        const qParams = QualifiedParameters_1.QualifiedParameters.read(extendedParams);
        const recorded = {};
        for (const g of streamSample(generator, params)) {
          const out = classify(g);
          const categories = Array.isArray(out) ? out : [out];
          for (const c of categories) {
            recorded[c] = (recorded[c] || 0) + 1;
          }
        }
        const data = Object.entries(recorded).sort((a, b) => b[1] - a[1]).map((i) => [i[0], `${round2(i[1] * 100 / qParams.numRuns)}%`]);
        const longestName = data.map((i) => i[0].length).reduce((p, c) => Math.max(p, c), 0);
        const longestPercent = data.map((i) => i[1].length).reduce((p, c) => Math.max(p, c), 0);
        for (const item of data) {
          qParams.logger(`${item[0].padEnd(longestName, ".")}..${item[1].padStart(longestPercent, ".")}`);
        }
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/GeneratorValueBuilder.js
  var require_GeneratorValueBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/GeneratorValueBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildGeneratorValue = buildGeneratorValue;
      var Value_1 = require_Value();
      var symbols_1 = require_symbols();
      var stringify_1 = require_stringify();
      function buildGeneratorValue(mrng, biasFactor, computePreBuiltValues, arbitraryCache) {
        const preBuiltValues = computePreBuiltValues();
        let localMrng = mrng.clone();
        const context = { mrng: mrng.clone(), biasFactor, history: [] };
        const valueFunction = (arb) => {
          const preBuiltValue = preBuiltValues[context.history.length];
          if (preBuiltValue !== void 0 && preBuiltValue.arb === arb) {
            const value2 = preBuiltValue.value;
            context.history.push({ arb, value: value2, context: preBuiltValue.context, mrng: preBuiltValue.mrng });
            localMrng = preBuiltValue.mrng.clone();
            return value2;
          }
          const g = arb.generate(localMrng, biasFactor);
          context.history.push({ arb, value: g.value_, context: g.context, mrng: localMrng.clone() });
          return g.value;
        };
        const memoedValueFunction = (arb, ...args) => {
          return valueFunction(arbitraryCache(arb, args));
        };
        const valueMethods = {
          values() {
            return context.history.map((c) => c.value);
          },
          [symbols_1.cloneMethod]() {
            return buildGeneratorValue(mrng, biasFactor, computePreBuiltValues, arbitraryCache).value;
          },
          [stringify_1.toStringMethod]() {
            return (0, stringify_1.stringify)(context.history.map((c) => c.value));
          }
        };
        const value = Object.assign(memoedValueFunction, valueMethods);
        return new Value_1.Value(value, context);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/StableArbitraryGeneratorCache.js
  var require_StableArbitraryGeneratorCache = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/StableArbitraryGeneratorCache.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildStableArbitraryGeneratorCache = buildStableArbitraryGeneratorCache;
      exports.naiveIsEqual = naiveIsEqual;
      function buildStableArbitraryGeneratorCache(isEqual) {
        const previousCallsPerBuilder = /* @__PURE__ */ new Map();
        return function stableArbitraryGeneratorCache(builder, args) {
          const entriesForBuilder = previousCallsPerBuilder.get(builder);
          if (entriesForBuilder === void 0) {
            const newValue2 = builder(...args);
            previousCallsPerBuilder.set(builder, [{ args, value: newValue2 }]);
            return newValue2;
          }
          const safeEntriesForBuilder = entriesForBuilder;
          for (const entry of safeEntriesForBuilder) {
            if (isEqual(args, entry.args)) {
              return entry.value;
            }
          }
          const newValue = builder(...args);
          safeEntriesForBuilder.push({ args, value: newValue });
          return newValue;
        };
      }
      function naiveIsEqual(v1, v2) {
        if (v1 !== null && typeof v1 === "object" && v2 !== null && typeof v2 === "object") {
          if (Array.isArray(v1)) {
            if (!Array.isArray(v2))
              return false;
            if (v1.length !== v2.length)
              return false;
          } else if (Array.isArray(v2)) {
            return false;
          }
          if (Object.keys(v1).length !== Object.keys(v2).length) {
            return false;
          }
          for (const index in v1) {
            if (!(index in v2)) {
              return false;
            }
            if (!naiveIsEqual(v1[index], v2[index])) {
              return false;
            }
          }
          return true;
        } else {
          return Object.is(v1, v2);
        }
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/GeneratorArbitrary.js
  var require_GeneratorArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/GeneratorArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.GeneratorArbitrary = void 0;
      var Arbitrary_1 = require_Arbitrary();
      var Stream_1 = require_Stream();
      var GeneratorValueBuilder_1 = require_GeneratorValueBuilder();
      var StableArbitraryGeneratorCache_1 = require_StableArbitraryGeneratorCache();
      var TupleArbitrary_1 = require_TupleArbitrary();
      var GeneratorArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor() {
          super(...arguments);
          this.arbitraryCache = (0, StableArbitraryGeneratorCache_1.buildStableArbitraryGeneratorCache)(StableArbitraryGeneratorCache_1.naiveIsEqual);
        }
        generate(mrng, biasFactor) {
          return (0, GeneratorValueBuilder_1.buildGeneratorValue)(mrng, biasFactor, () => [], this.arbitraryCache);
        }
        canShrinkWithoutContext(value) {
          return false;
        }
        shrink(_value, context) {
          if (context === void 0) {
            return Stream_1.Stream.nil();
          }
          const safeContext = context;
          const mrng = safeContext.mrng;
          const biasFactor = safeContext.biasFactor;
          const history = safeContext.history;
          return (0, TupleArbitrary_1.tupleShrink)(history.map((c) => c.arb), history.map((c) => c.value), history.map((c) => c.context)).map((shrink) => {
            function computePreBuiltValues() {
              const subValues = shrink.value;
              const subContexts = shrink.context;
              return history.map((entry, index) => ({
                arb: entry.arb,
                value: subValues[index],
                context: subContexts[index],
                mrng: entry.mrng
              }));
            }
            return (0, GeneratorValueBuilder_1.buildGeneratorValue)(mrng, biasFactor, computePreBuiltValues, this.arbitraryCache);
          });
        }
      };
      exports.GeneratorArbitrary = GeneratorArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/gen.js
  var require_gen = __commonJS({
    "node_modules/fast-check/lib/arbitrary/gen.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.gen = gen;
      var GeneratorArbitrary_1 = require_GeneratorArbitrary();
      function gen() {
        return new GeneratorArbitrary_1.GeneratorArbitrary();
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/BiasNumericRange.js
  var require_BiasNumericRange = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/BiasNumericRange.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.integerLogLike = integerLogLike;
      exports.bigIntLogLike = bigIntLogLike;
      exports.biasNumericRange = biasNumericRange;
      var globals_1 = require_globals();
      var safeMathFloor = Math.floor;
      var safeMathLog = Math.log;
      function integerLogLike(v) {
        return safeMathFloor(safeMathLog(v) / safeMathLog(2));
      }
      function bigIntLogLike(v) {
        if (v === (0, globals_1.BigInt)(0))
          return (0, globals_1.BigInt)(0);
        return (0, globals_1.BigInt)((0, globals_1.String)(v).length);
      }
      function biasNumericRange(min, max, logLike) {
        if (min === max) {
          return [{ min, max }];
        }
        if (min < 0 && max > 0) {
          const logMin = logLike(-min);
          const logMax = logLike(max);
          return [
            { min: -logMin, max: logMax },
            { min: max - logMax, max },
            { min, max: min + logMin }
          ];
        }
        const logGap = logLike(max - min);
        const arbCloseToMin = { min, max: min + logGap };
        const arbCloseToMax = { min: max - logGap, max };
        return min < 0 ? [arbCloseToMax, arbCloseToMin] : [arbCloseToMin, arbCloseToMax];
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/ShrinkInteger.js
  var require_ShrinkInteger = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/ShrinkInteger.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.shrinkInteger = shrinkInteger;
      var Value_1 = require_Value();
      var Stream_1 = require_Stream();
      var safeMathCeil = Math.ceil;
      var safeMathFloor = Math.floor;
      function halvePosInteger(n) {
        return safeMathFloor(n / 2);
      }
      function halveNegInteger(n) {
        return safeMathCeil(n / 2);
      }
      function shrinkInteger(current, target, tryTargetAsap) {
        const realGap = current - target;
        function* shrinkDecr() {
          let previous = tryTargetAsap ? void 0 : target;
          const gap = tryTargetAsap ? realGap : halvePosInteger(realGap);
          for (let toremove = gap; toremove > 0; toremove = halvePosInteger(toremove)) {
            const next = toremove === realGap ? target : current - toremove;
            yield new Value_1.Value(next, previous);
            previous = next;
          }
        }
        function* shrinkIncr() {
          let previous = tryTargetAsap ? void 0 : target;
          const gap = tryTargetAsap ? realGap : halveNegInteger(realGap);
          for (let toremove = gap; toremove < 0; toremove = halveNegInteger(toremove)) {
            const next = toremove === realGap ? target : current - toremove;
            yield new Value_1.Value(next, previous);
            previous = next;
          }
        }
        return realGap > 0 ? (0, Stream_1.stream)(shrinkDecr()) : (0, Stream_1.stream)(shrinkIncr());
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/IntegerArbitrary.js
  var require_IntegerArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/IntegerArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.IntegerArbitrary = void 0;
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var Stream_1 = require_Stream();
      var BiasNumericRange_1 = require_BiasNumericRange();
      var ShrinkInteger_1 = require_ShrinkInteger();
      var safeMathSign = Math.sign;
      var safeNumberIsInteger = Number.isInteger;
      var safeObjectIs = Object.is;
      var IntegerArbitrary = class _IntegerArbitrary extends Arbitrary_1.Arbitrary {
        constructor(min, max) {
          super();
          this.min = min;
          this.max = max;
        }
        generate(mrng, biasFactor) {
          const range = this.computeGenerateRange(mrng, biasFactor);
          return new Value_1.Value(mrng.nextInt(range.min, range.max), void 0);
        }
        canShrinkWithoutContext(value) {
          return typeof value === "number" && safeNumberIsInteger(value) && !safeObjectIs(value, -0) && this.min <= value && value <= this.max;
        }
        shrink(current, context) {
          if (!_IntegerArbitrary.isValidContext(current, context)) {
            const target = this.defaultTarget();
            return (0, ShrinkInteger_1.shrinkInteger)(current, target, true);
          }
          if (this.isLastChanceTry(current, context)) {
            return Stream_1.Stream.of(new Value_1.Value(context, void 0));
          }
          return (0, ShrinkInteger_1.shrinkInteger)(current, context, false);
        }
        defaultTarget() {
          if (this.min <= 0 && this.max >= 0) {
            return 0;
          }
          return this.min < 0 ? this.max : this.min;
        }
        computeGenerateRange(mrng, biasFactor) {
          if (biasFactor === void 0 || mrng.nextInt(1, biasFactor) !== 1) {
            return { min: this.min, max: this.max };
          }
          const ranges = (0, BiasNumericRange_1.biasNumericRange)(this.min, this.max, BiasNumericRange_1.integerLogLike);
          if (ranges.length === 1) {
            return ranges[0];
          }
          const id = mrng.nextInt(-2 * (ranges.length - 1), ranges.length - 2);
          return id < 0 ? ranges[0] : ranges[id + 1];
        }
        isLastChanceTry(current, context) {
          if (current > 0)
            return current === context + 1 && current > this.min;
          if (current < 0)
            return current === context - 1 && current < this.max;
          return false;
        }
        static isValidContext(current, context) {
          if (context === void 0) {
            return false;
          }
          if (typeof context !== "number") {
            throw new Error(`Invalid context type passed to IntegerArbitrary (#1)`);
          }
          if (context !== 0 && safeMathSign(current) !== safeMathSign(context)) {
            throw new Error(`Invalid context value passed to IntegerArbitrary (#2)`);
          }
          return true;
        }
      };
      exports.IntegerArbitrary = IntegerArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/integer.js
  var require_integer = __commonJS({
    "node_modules/fast-check/lib/arbitrary/integer.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.integer = integer;
      var IntegerArbitrary_1 = require_IntegerArbitrary();
      var safeNumberIsInteger = Number.isInteger;
      function buildCompleteIntegerConstraints(constraints) {
        const min = constraints.min !== void 0 ? constraints.min : -2147483648;
        const max = constraints.max !== void 0 ? constraints.max : 2147483647;
        return { min, max };
      }
      function integer(constraints = {}) {
        const fullConstraints = buildCompleteIntegerConstraints(constraints);
        if (fullConstraints.min > fullConstraints.max) {
          throw new Error("fc.integer maximum value should be equal or greater than the minimum one");
        }
        if (!safeNumberIsInteger(fullConstraints.min)) {
          throw new Error("fc.integer minimum value should be an integer");
        }
        if (!safeNumberIsInteger(fullConstraints.max)) {
          throw new Error("fc.integer maximum value should be an integer");
        }
        return new IntegerArbitrary_1.IntegerArbitrary(fullConstraints.min, fullConstraints.max);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/DepthContext.js
  var require_DepthContext = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/DepthContext.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getDepthContextFor = getDepthContextFor;
      exports.createDepthIdentifier = createDepthIdentifier;
      var depthContextCache = /* @__PURE__ */ new Map();
      function getDepthContextFor(contextMeta) {
        if (contextMeta === void 0) {
          return { depth: 0 };
        }
        if (typeof contextMeta !== "string") {
          return contextMeta;
        }
        const cachedContext = depthContextCache.get(contextMeta);
        if (cachedContext !== void 0) {
          return cachedContext;
        }
        const context = { depth: 0 };
        depthContextCache.set(contextMeta, context);
        return context;
      }
      function createDepthIdentifier() {
        const identifier = { depth: 0 };
        return identifier;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/implementations/NoopSlicedGenerator.js
  var require_NoopSlicedGenerator = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/implementations/NoopSlicedGenerator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.NoopSlicedGenerator = void 0;
      var NoopSlicedGenerator = class {
        constructor(arb, mrng, biasFactor) {
          this.arb = arb;
          this.mrng = mrng;
          this.biasFactor = biasFactor;
        }
        attemptExact() {
          return;
        }
        next() {
          return this.arb.generate(this.mrng, this.biasFactor);
        }
      };
      exports.NoopSlicedGenerator = NoopSlicedGenerator;
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/implementations/SlicedBasedGenerator.js
  var require_SlicedBasedGenerator = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/implementations/SlicedBasedGenerator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SlicedBasedGenerator = void 0;
      var Value_1 = require_Value();
      var globals_1 = require_globals();
      var safeMathMin = Math.min;
      var safeMathMax = Math.max;
      var SlicedBasedGenerator = class {
        constructor(arb, mrng, slices, biasFactor) {
          this.arb = arb;
          this.mrng = mrng;
          this.slices = slices;
          this.biasFactor = biasFactor;
          this.activeSliceIndex = 0;
          this.nextIndexInSlice = 0;
          this.lastIndexInSlice = -1;
        }
        attemptExact(targetLength) {
          if (targetLength !== 0 && this.mrng.nextInt(1, this.biasFactor) === 1) {
            const eligibleIndices = [];
            for (let index = 0; index !== this.slices.length; ++index) {
              const slice = this.slices[index];
              if (slice.length === targetLength) {
                (0, globals_1.safePush)(eligibleIndices, index);
              }
            }
            if (eligibleIndices.length === 0) {
              return;
            }
            this.activeSliceIndex = eligibleIndices[this.mrng.nextInt(0, eligibleIndices.length - 1)];
            this.nextIndexInSlice = 0;
            this.lastIndexInSlice = targetLength - 1;
          }
        }
        next() {
          if (this.nextIndexInSlice <= this.lastIndexInSlice) {
            return new Value_1.Value(this.slices[this.activeSliceIndex][this.nextIndexInSlice++], void 0);
          }
          if (this.mrng.nextInt(1, this.biasFactor) !== 1) {
            return this.arb.generate(this.mrng, this.biasFactor);
          }
          this.activeSliceIndex = this.mrng.nextInt(0, this.slices.length - 1);
          const slice = this.slices[this.activeSliceIndex];
          if (this.mrng.nextInt(1, this.biasFactor) !== 1) {
            this.nextIndexInSlice = 1;
            this.lastIndexInSlice = slice.length - 1;
            return new Value_1.Value(slice[0], void 0);
          }
          const rangeBoundaryA = this.mrng.nextInt(0, slice.length - 1);
          const rangeBoundaryB = this.mrng.nextInt(0, slice.length - 1);
          this.nextIndexInSlice = safeMathMin(rangeBoundaryA, rangeBoundaryB);
          this.lastIndexInSlice = safeMathMax(rangeBoundaryA, rangeBoundaryB);
          return new Value_1.Value(slice[this.nextIndexInSlice++], void 0);
        }
      };
      exports.SlicedBasedGenerator = SlicedBasedGenerator;
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/BuildSlicedGenerator.js
  var require_BuildSlicedGenerator = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/BuildSlicedGenerator.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildSlicedGenerator = buildSlicedGenerator;
      var NoopSlicedGenerator_1 = require_NoopSlicedGenerator();
      var SlicedBasedGenerator_1 = require_SlicedBasedGenerator();
      function buildSlicedGenerator(arb, mrng, slices, biasFactor) {
        if (biasFactor === void 0 || slices.length === 0 || mrng.nextInt(1, biasFactor) !== 1) {
          return new NoopSlicedGenerator_1.NoopSlicedGenerator(arb, mrng, biasFactor);
        }
        return new SlicedBasedGenerator_1.SlicedBasedGenerator(arb, mrng, slices, biasFactor);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/ArrayArbitrary.js
  var require_ArrayArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/ArrayArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ArrayArbitrary = void 0;
      var Stream_1 = require_Stream();
      var symbols_1 = require_symbols();
      var integer_1 = require_integer();
      var LazyIterableIterator_1 = require_LazyIterableIterator();
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var DepthContext_1 = require_DepthContext();
      var BuildSlicedGenerator_1 = require_BuildSlicedGenerator();
      var globals_1 = require_globals();
      var safeMathFloor = Math.floor;
      var safeMathLog = Math.log;
      var safeMathMax = Math.max;
      var safeArrayIsArray = Array.isArray;
      function biasedMaxLength(minLength, maxLength) {
        if (minLength === maxLength) {
          return minLength;
        }
        return minLength + safeMathFloor(safeMathLog(maxLength - minLength) / safeMathLog(2));
      }
      var ArrayArbitrary = class _ArrayArbitrary extends Arbitrary_1.Arbitrary {
        constructor(arb, minLength, maxGeneratedLength, maxLength, depthIdentifier, setBuilder, customSlices) {
          super();
          this.arb = arb;
          this.minLength = minLength;
          this.maxGeneratedLength = maxGeneratedLength;
          this.maxLength = maxLength;
          this.setBuilder = setBuilder;
          this.customSlices = customSlices;
          this.lengthArb = (0, integer_1.integer)({ min: minLength, max: maxGeneratedLength });
          this.depthContext = (0, DepthContext_1.getDepthContextFor)(depthIdentifier);
        }
        preFilter(tab) {
          if (this.setBuilder === void 0) {
            return tab;
          }
          const s = this.setBuilder();
          for (let index = 0; index !== tab.length; ++index) {
            s.tryAdd(tab[index]);
          }
          return s.getData();
        }
        static makeItCloneable(vs, shrinkables) {
          vs[symbols_1.cloneMethod] = () => {
            const cloned = [];
            for (let idx = 0; idx !== shrinkables.length; ++idx) {
              (0, globals_1.safePush)(cloned, shrinkables[idx].value);
            }
            this.makeItCloneable(cloned, shrinkables);
            return cloned;
          };
          return vs;
        }
        generateNItemsNoDuplicates(setBuilder, N, mrng, biasFactorItems) {
          let numSkippedInRow = 0;
          const s = setBuilder();
          const slicedGenerator = (0, BuildSlicedGenerator_1.buildSlicedGenerator)(this.arb, mrng, this.customSlices, biasFactorItems);
          while (s.size() < N && numSkippedInRow < this.maxGeneratedLength) {
            const current = slicedGenerator.next();
            if (s.tryAdd(current)) {
              numSkippedInRow = 0;
            } else {
              numSkippedInRow += 1;
            }
          }
          return s.getData();
        }
        safeGenerateNItemsNoDuplicates(setBuilder, N, mrng, biasFactorItems) {
          const depthImpact = safeMathMax(0, N - biasedMaxLength(this.minLength, this.maxGeneratedLength));
          this.depthContext.depth += depthImpact;
          try {
            return this.generateNItemsNoDuplicates(setBuilder, N, mrng, biasFactorItems);
          } finally {
            this.depthContext.depth -= depthImpact;
          }
        }
        generateNItems(N, mrng, biasFactorItems) {
          const items = [];
          const slicedGenerator = (0, BuildSlicedGenerator_1.buildSlicedGenerator)(this.arb, mrng, this.customSlices, biasFactorItems);
          slicedGenerator.attemptExact(N);
          for (let index = 0; index !== N; ++index) {
            const current = slicedGenerator.next();
            (0, globals_1.safePush)(items, current);
          }
          return items;
        }
        safeGenerateNItems(N, mrng, biasFactorItems) {
          const depthImpact = safeMathMax(0, N - biasedMaxLength(this.minLength, this.maxGeneratedLength));
          this.depthContext.depth += depthImpact;
          try {
            return this.generateNItems(N, mrng, biasFactorItems);
          } finally {
            this.depthContext.depth -= depthImpact;
          }
        }
        wrapper(itemsRaw, shrunkOnce, itemsRawLengthContext, startIndex) {
          const items = shrunkOnce ? this.preFilter(itemsRaw) : itemsRaw;
          let cloneable = false;
          const vs = [];
          const itemsContexts = [];
          for (let idx = 0; idx !== items.length; ++idx) {
            const s = items[idx];
            cloneable = cloneable || s.hasToBeCloned;
            (0, globals_1.safePush)(vs, s.value);
            (0, globals_1.safePush)(itemsContexts, s.context);
          }
          if (cloneable) {
            _ArrayArbitrary.makeItCloneable(vs, items);
          }
          const context = {
            shrunkOnce,
            lengthContext: itemsRaw.length === items.length && itemsRawLengthContext !== void 0 ? itemsRawLengthContext : void 0,
            itemsContexts,
            startIndex
          };
          return new Value_1.Value(vs, context);
        }
        generate(mrng, biasFactor) {
          const biasMeta = this.applyBias(mrng, biasFactor);
          const targetSize = biasMeta.size;
          const items = this.setBuilder !== void 0 ? this.safeGenerateNItemsNoDuplicates(this.setBuilder, targetSize, mrng, biasMeta.biasFactorItems) : this.safeGenerateNItems(targetSize, mrng, biasMeta.biasFactorItems);
          return this.wrapper(items, false, void 0, 0);
        }
        applyBias(mrng, biasFactor) {
          if (biasFactor === void 0) {
            return { size: this.lengthArb.generate(mrng, void 0).value };
          }
          if (this.minLength === this.maxGeneratedLength) {
            return { size: this.lengthArb.generate(mrng, void 0).value, biasFactorItems: biasFactor };
          }
          if (mrng.nextInt(1, biasFactor) !== 1) {
            return { size: this.lengthArb.generate(mrng, void 0).value };
          }
          if (mrng.nextInt(1, biasFactor) !== 1 || this.minLength === this.maxGeneratedLength) {
            return { size: this.lengthArb.generate(mrng, void 0).value, biasFactorItems: biasFactor };
          }
          const maxBiasedLength = biasedMaxLength(this.minLength, this.maxGeneratedLength);
          const targetSizeValue = (0, integer_1.integer)({ min: this.minLength, max: maxBiasedLength }).generate(mrng, void 0);
          return { size: targetSizeValue.value, biasFactorItems: biasFactor };
        }
        canShrinkWithoutContext(value) {
          if (!safeArrayIsArray(value) || this.minLength > value.length || value.length > this.maxLength) {
            return false;
          }
          for (let index = 0; index !== value.length; ++index) {
            if (!(index in value)) {
              return false;
            }
            if (!this.arb.canShrinkWithoutContext(value[index])) {
              return false;
            }
          }
          const filtered = this.preFilter((0, globals_1.safeMap)(value, (item) => new Value_1.Value(item, void 0)));
          return filtered.length === value.length;
        }
        shrinkItemByItem(value, safeContext, endIndex) {
          const shrinks = [];
          for (let index = safeContext.startIndex; index < endIndex; ++index) {
            (0, globals_1.safePush)(shrinks, (0, LazyIterableIterator_1.makeLazy)(() => this.arb.shrink(value[index], safeContext.itemsContexts[index]).map((v) => {
              const beforeCurrent = (0, globals_1.safeMap)((0, globals_1.safeSlice)(value, 0, index), (v2, i) => new Value_1.Value((0, symbols_1.cloneIfNeeded)(v2), safeContext.itemsContexts[i]));
              const afterCurrent = (0, globals_1.safeMap)((0, globals_1.safeSlice)(value, index + 1), (v2, i) => new Value_1.Value((0, symbols_1.cloneIfNeeded)(v2), safeContext.itemsContexts[i + index + 1]));
              return [
                [...beforeCurrent, v, ...afterCurrent],
                void 0,
                index
              ];
            })));
          }
          return Stream_1.Stream.nil().join(...shrinks);
        }
        shrinkImpl(value, context) {
          if (value.length === 0) {
            return Stream_1.Stream.nil();
          }
          const safeContext = context !== void 0 ? context : { shrunkOnce: false, lengthContext: void 0, itemsContexts: [], startIndex: 0 };
          return this.lengthArb.shrink(value.length, safeContext.lengthContext).drop(safeContext.shrunkOnce && safeContext.lengthContext === void 0 && value.length > this.minLength + 1 ? 1 : 0).map((lengthValue) => {
            const sliceStart = value.length - lengthValue.value;
            return [
              (0, globals_1.safeMap)((0, globals_1.safeSlice)(value, sliceStart), (v, index) => new Value_1.Value((0, symbols_1.cloneIfNeeded)(v), safeContext.itemsContexts[index + sliceStart])),
              lengthValue.context,
              0
            ];
          }).join((0, LazyIterableIterator_1.makeLazy)(() => value.length > this.minLength ? this.shrinkItemByItem(value, safeContext, 1) : this.shrinkItemByItem(value, safeContext, value.length))).join(value.length > this.minLength ? (0, LazyIterableIterator_1.makeLazy)(() => {
            const subContext = {
              shrunkOnce: false,
              lengthContext: void 0,
              itemsContexts: (0, globals_1.safeSlice)(safeContext.itemsContexts, 1),
              startIndex: 0
            };
            return this.shrinkImpl((0, globals_1.safeSlice)(value, 1), subContext).filter((v) => this.minLength <= v[0].length + 1).map((v) => {
              return [[new Value_1.Value((0, symbols_1.cloneIfNeeded)(value[0]), safeContext.itemsContexts[0]), ...v[0]], void 0, 0];
            });
          }) : Stream_1.Stream.nil());
        }
        shrink(value, context) {
          return this.shrinkImpl(value, context).map((contextualValue) => this.wrapper(contextualValue[0], true, contextualValue[1], contextualValue[2]));
        }
      };
      exports.ArrayArbitrary = ArrayArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/MaxLengthFromMinLength.js
  var require_MaxLengthFromMinLength = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/MaxLengthFromMinLength.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DefaultSize = exports.MaxLengthUpperBound = void 0;
      exports.maxLengthFromMinLength = maxLengthFromMinLength;
      exports.relativeSizeToSize = relativeSizeToSize;
      exports.maxGeneratedLengthFromSizeForArbitrary = maxGeneratedLengthFromSizeForArbitrary;
      exports.depthBiasFromSizeForArbitrary = depthBiasFromSizeForArbitrary;
      exports.resolveSize = resolveSize;
      var GlobalParameters_1 = require_GlobalParameters();
      var globals_1 = require_globals();
      var safeMathFloor = Math.floor;
      var safeMathMin = Math.min;
      exports.MaxLengthUpperBound = 2147483647;
      var orderedSize = ["xsmall", "small", "medium", "large", "xlarge"];
      var orderedRelativeSize = ["-4", "-3", "-2", "-1", "=", "+1", "+2", "+3", "+4"];
      exports.DefaultSize = "small";
      function maxLengthFromMinLength(minLength, size) {
        switch (size) {
          case "xsmall":
            return safeMathFloor(1.1 * minLength) + 1;
          case "small":
            return 2 * minLength + 10;
          case "medium":
            return 11 * minLength + 100;
          case "large":
            return 101 * minLength + 1e3;
          case "xlarge":
            return 1001 * minLength + 1e4;
          default:
            throw new Error(`Unable to compute lengths based on received size: ${size}`);
        }
      }
      function relativeSizeToSize(size, defaultSize) {
        const sizeInRelative = (0, globals_1.safeIndexOf)(orderedRelativeSize, size);
        if (sizeInRelative === -1) {
          return size;
        }
        const defaultSizeInSize = (0, globals_1.safeIndexOf)(orderedSize, defaultSize);
        if (defaultSizeInSize === -1) {
          throw new Error(`Unable to offset size based on the unknown defaulted one: ${defaultSize}`);
        }
        const resultingSizeInSize = defaultSizeInSize + sizeInRelative - 4;
        return resultingSizeInSize < 0 ? orderedSize[0] : resultingSizeInSize >= orderedSize.length ? orderedSize[orderedSize.length - 1] : orderedSize[resultingSizeInSize];
      }
      function maxGeneratedLengthFromSizeForArbitrary(size, minLength, maxLength, specifiedMaxLength) {
        const { baseSize: defaultSize = exports.DefaultSize, defaultSizeToMaxWhenMaxSpecified } = (0, GlobalParameters_1.readConfigureGlobal)() || {};
        const definedSize = size !== void 0 ? size : specifiedMaxLength && defaultSizeToMaxWhenMaxSpecified ? "max" : defaultSize;
        if (definedSize === "max") {
          return maxLength;
        }
        const finalSize = relativeSizeToSize(definedSize, defaultSize);
        return safeMathMin(maxLengthFromMinLength(minLength, finalSize), maxLength);
      }
      function depthBiasFromSizeForArbitrary(depthSizeOrSize, specifiedMaxDepth) {
        if (typeof depthSizeOrSize === "number") {
          return 1 / depthSizeOrSize;
        }
        const { baseSize: defaultSize = exports.DefaultSize, defaultSizeToMaxWhenMaxSpecified } = (0, GlobalParameters_1.readConfigureGlobal)() || {};
        const definedSize = depthSizeOrSize !== void 0 ? depthSizeOrSize : specifiedMaxDepth && defaultSizeToMaxWhenMaxSpecified ? "max" : defaultSize;
        if (definedSize === "max") {
          return 0;
        }
        const finalSize = relativeSizeToSize(definedSize, defaultSize);
        switch (finalSize) {
          case "xsmall":
            return 1;
          case "small":
            return 0.5;
          case "medium":
            return 0.25;
          case "large":
            return 0.125;
          case "xlarge":
            return 0.0625;
        }
      }
      function resolveSize(size) {
        const { baseSize: defaultSize = exports.DefaultSize } = (0, GlobalParameters_1.readConfigureGlobal)() || {};
        if (size === void 0) {
          return defaultSize;
        }
        return relativeSizeToSize(size, defaultSize);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/array.js
  var require_array = __commonJS({
    "node_modules/fast-check/lib/arbitrary/array.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.array = array;
      var ArrayArbitrary_1 = require_ArrayArbitrary();
      var MaxLengthFromMinLength_1 = require_MaxLengthFromMinLength();
      function array(arb, constraints = {}) {
        const size = constraints.size;
        const minLength = constraints.minLength || 0;
        const maxLengthOrUnset = constraints.maxLength;
        const depthIdentifier = constraints.depthIdentifier;
        const maxLength = maxLengthOrUnset !== void 0 ? maxLengthOrUnset : MaxLengthFromMinLength_1.MaxLengthUpperBound;
        const specifiedMaxLength = maxLengthOrUnset !== void 0;
        const maxGeneratedLength = (0, MaxLengthFromMinLength_1.maxGeneratedLengthFromSizeForArbitrary)(size, minLength, maxLength, specifiedMaxLength);
        const customSlices = constraints.experimentalCustomSlices || [];
        return new ArrayArbitrary_1.ArrayArbitrary(arb, minLength, maxGeneratedLength, maxLength, depthIdentifier, void 0, customSlices);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/ShrinkBigInt.js
  var require_ShrinkBigInt = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/ShrinkBigInt.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.shrinkBigInt = shrinkBigInt;
      var Stream_1 = require_Stream();
      var Value_1 = require_Value();
      var globals_1 = require_globals();
      function halveBigInt(n) {
        return n / (0, globals_1.BigInt)(2);
      }
      function shrinkBigInt(current, target, tryTargetAsap) {
        const realGap = current - target;
        function* shrinkDecr() {
          let previous = tryTargetAsap ? void 0 : target;
          const gap = tryTargetAsap ? realGap : halveBigInt(realGap);
          for (let toremove = gap; toremove > 0; toremove = halveBigInt(toremove)) {
            const next = current - toremove;
            yield new Value_1.Value(next, previous);
            previous = next;
          }
        }
        function* shrinkIncr() {
          let previous = tryTargetAsap ? void 0 : target;
          const gap = tryTargetAsap ? realGap : halveBigInt(realGap);
          for (let toremove = gap; toremove < 0; toremove = halveBigInt(toremove)) {
            const next = current - toremove;
            yield new Value_1.Value(next, previous);
            previous = next;
          }
        }
        return realGap > 0 ? (0, Stream_1.stream)(shrinkDecr()) : (0, Stream_1.stream)(shrinkIncr());
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/BigIntArbitrary.js
  var require_BigIntArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/BigIntArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.BigIntArbitrary = void 0;
      var Stream_1 = require_Stream();
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var BiasNumericRange_1 = require_BiasNumericRange();
      var ShrinkBigInt_1 = require_ShrinkBigInt();
      var globals_1 = require_globals();
      var BigIntArbitrary = class _BigIntArbitrary extends Arbitrary_1.Arbitrary {
        constructor(min, max) {
          super();
          this.min = min;
          this.max = max;
        }
        generate(mrng, biasFactor) {
          const range = this.computeGenerateRange(mrng, biasFactor);
          return new Value_1.Value(mrng.nextBigInt(range.min, range.max), void 0);
        }
        computeGenerateRange(mrng, biasFactor) {
          if (biasFactor === void 0 || mrng.nextInt(1, biasFactor) !== 1) {
            return { min: this.min, max: this.max };
          }
          const ranges = (0, BiasNumericRange_1.biasNumericRange)(this.min, this.max, BiasNumericRange_1.bigIntLogLike);
          if (ranges.length === 1) {
            return ranges[0];
          }
          const id = mrng.nextInt(-2 * (ranges.length - 1), ranges.length - 2);
          return id < 0 ? ranges[0] : ranges[id + 1];
        }
        canShrinkWithoutContext(value) {
          return typeof value === "bigint" && this.min <= value && value <= this.max;
        }
        shrink(current, context) {
          if (!_BigIntArbitrary.isValidContext(current, context)) {
            const target = this.defaultTarget();
            return (0, ShrinkBigInt_1.shrinkBigInt)(current, target, true);
          }
          if (this.isLastChanceTry(current, context)) {
            return Stream_1.Stream.of(new Value_1.Value(context, void 0));
          }
          return (0, ShrinkBigInt_1.shrinkBigInt)(current, context, false);
        }
        defaultTarget() {
          if (this.min <= 0 && this.max >= 0) {
            return (0, globals_1.BigInt)(0);
          }
          return this.min < 0 ? this.max : this.min;
        }
        isLastChanceTry(current, context) {
          if (current > 0)
            return current === context + (0, globals_1.BigInt)(1) && current > this.min;
          if (current < 0)
            return current === context - (0, globals_1.BigInt)(1) && current < this.max;
          return false;
        }
        static isValidContext(current, context) {
          if (context === void 0) {
            return false;
          }
          if (typeof context !== "bigint") {
            throw new Error(`Invalid context type passed to BigIntArbitrary (#1)`);
          }
          const differentSigns = current > 0 && context < 0 || current < 0 && context > 0;
          if (context !== (0, globals_1.BigInt)(0) && differentSigns) {
            throw new Error(`Invalid context value passed to BigIntArbitrary (#2)`);
          }
          return true;
        }
      };
      exports.BigIntArbitrary = BigIntArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/bigInt.js
  var require_bigInt = __commonJS({
    "node_modules/fast-check/lib/arbitrary/bigInt.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.bigInt = bigInt;
      var globals_1 = require_globals();
      var BigIntArbitrary_1 = require_BigIntArbitrary();
      function buildCompleteBigIntConstraints(constraints) {
        const DefaultPow = 256;
        const DefaultMin = (0, globals_1.BigInt)(-1) << (0, globals_1.BigInt)(DefaultPow - 1);
        const DefaultMax = ((0, globals_1.BigInt)(1) << (0, globals_1.BigInt)(DefaultPow - 1)) - (0, globals_1.BigInt)(1);
        const min = constraints.min;
        const max = constraints.max;
        return {
          min: min !== void 0 ? min : DefaultMin - (max !== void 0 && max < (0, globals_1.BigInt)(0) ? max * max : (0, globals_1.BigInt)(0)),
          max: max !== void 0 ? max : DefaultMax + (min !== void 0 && min > (0, globals_1.BigInt)(0) ? min * min : (0, globals_1.BigInt)(0))
        };
      }
      function extractBigIntConstraints(args) {
        if (args[0] === void 0) {
          return {};
        }
        if (args[1] === void 0) {
          const constraints = args[0];
          return constraints;
        }
        return { min: args[0], max: args[1] };
      }
      function bigInt(...args) {
        const constraints = buildCompleteBigIntConstraints(extractBigIntConstraints(args));
        if (constraints.min > constraints.max) {
          throw new Error("fc.bigInt expects max to be greater than or equal to min");
        }
        return new BigIntArbitrary_1.BigIntArbitrary(constraints.min, constraints.max);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/bigIntN.js
  var require_bigIntN = __commonJS({
    "node_modules/fast-check/lib/arbitrary/bigIntN.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.bigIntN = bigIntN;
      var globals_1 = require_globals();
      var BigIntArbitrary_1 = require_BigIntArbitrary();
      function bigIntN(n) {
        if (n < 1) {
          throw new Error("fc.bigIntN expects requested number of bits to be superior or equal to 1");
        }
        const min = (0, globals_1.BigInt)(-1) << (0, globals_1.BigInt)(n - 1);
        const max = ((0, globals_1.BigInt)(1) << (0, globals_1.BigInt)(n - 1)) - (0, globals_1.BigInt)(1);
        return new BigIntArbitrary_1.BigIntArbitrary(min, max);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/bigUint.js
  var require_bigUint = __commonJS({
    "node_modules/fast-check/lib/arbitrary/bigUint.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.bigUint = bigUint;
      var globals_1 = require_globals();
      var BigIntArbitrary_1 = require_BigIntArbitrary();
      function computeDefaultMax() {
        return ((0, globals_1.BigInt)(1) << (0, globals_1.BigInt)(256)) - (0, globals_1.BigInt)(1);
      }
      function bigUint(constraints) {
        const requestedMax = typeof constraints === "object" ? constraints.max : constraints;
        const max = requestedMax !== void 0 ? requestedMax : computeDefaultMax();
        if (max < 0) {
          throw new Error("fc.bigUint expects max to be greater than or equal to zero");
        }
        return new BigIntArbitrary_1.BigIntArbitrary((0, globals_1.BigInt)(0), max);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/bigUintN.js
  var require_bigUintN = __commonJS({
    "node_modules/fast-check/lib/arbitrary/bigUintN.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.bigUintN = bigUintN;
      var globals_1 = require_globals();
      var BigIntArbitrary_1 = require_BigIntArbitrary();
      function bigUintN(n) {
        if (n < 0) {
          throw new Error("fc.bigUintN expects requested number of bits to be superior or equal to 0");
        }
        const min = (0, globals_1.BigInt)(0);
        const max = ((0, globals_1.BigInt)(1) << (0, globals_1.BigInt)(n)) - (0, globals_1.BigInt)(1);
        return new BigIntArbitrary_1.BigIntArbitrary(min, max);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/noBias.js
  var require_noBias = __commonJS({
    "node_modules/fast-check/lib/arbitrary/noBias.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.noBias = noBias;
      function noBias(arb) {
        return arb.noBias();
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/boolean.js
  var require_boolean = __commonJS({
    "node_modules/fast-check/lib/arbitrary/boolean.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.boolean = boolean;
      var integer_1 = require_integer();
      var noBias_1 = require_noBias();
      function booleanMapper(v) {
        return v === 1;
      }
      function booleanUnmapper(v) {
        if (typeof v !== "boolean")
          throw new Error("Unsupported input type");
        return v === true ? 1 : 0;
      }
      function boolean() {
        return (0, noBias_1.noBias)((0, integer_1.integer)({ min: 0, max: 1 }).map(booleanMapper, booleanUnmapper));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/ConstantArbitrary.js
  var require_ConstantArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/ConstantArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ConstantArbitrary = void 0;
      var Stream_1 = require_Stream();
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var symbols_1 = require_symbols();
      var safeObjectIs = Object.is;
      var ConstantArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor(values) {
          super();
          this.values = values;
        }
        generate(mrng, _biasFactor) {
          const idx = this.values.length === 1 ? 0 : mrng.nextInt(0, this.values.length - 1);
          const value = this.values[idx];
          if (!(0, symbols_1.hasCloneMethod)(value)) {
            return new Value_1.Value(value, idx);
          }
          return new Value_1.Value(value, idx, () => value[symbols_1.cloneMethod]());
        }
        canShrinkWithoutContext(value) {
          for (let idx = 0; idx !== this.values.length; ++idx) {
            if (safeObjectIs(this.values[idx], value)) {
              return true;
            }
          }
          return false;
        }
        shrink(value, context) {
          if (context === 0 || safeObjectIs(value, this.values[0])) {
            return Stream_1.Stream.nil();
          }
          return Stream_1.Stream.of(new Value_1.Value(this.values[0], 0));
        }
      };
      exports.ConstantArbitrary = ConstantArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/constantFrom.js
  var require_constantFrom = __commonJS({
    "node_modules/fast-check/lib/arbitrary/constantFrom.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.constantFrom = constantFrom;
      var ConstantArbitrary_1 = require_ConstantArbitrary();
      function constantFrom(...values) {
        if (values.length === 0) {
          throw new Error("fc.constantFrom expects at least one parameter");
        }
        return new ConstantArbitrary_1.ConstantArbitrary(values);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/falsy.js
  var require_falsy = __commonJS({
    "node_modules/fast-check/lib/arbitrary/falsy.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.falsy = falsy;
      var globals_1 = require_globals();
      var constantFrom_1 = require_constantFrom();
      function falsy(constraints) {
        if (!constraints || !constraints.withBigInt) {
          return (0, constantFrom_1.constantFrom)(false, null, void 0, 0, "", NaN);
        }
        return (0, constantFrom_1.constantFrom)(false, null, void 0, 0, "", NaN, (0, globals_1.BigInt)(0));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/IndexToCharString.js
  var require_IndexToCharString = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/IndexToCharString.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.indexToCharStringMapper = void 0;
      exports.indexToCharStringUnmapper = indexToCharStringUnmapper;
      var globals_1 = require_globals();
      exports.indexToCharStringMapper = String.fromCodePoint;
      function indexToCharStringUnmapper(c) {
        if (typeof c !== "string") {
          throw new Error("Cannot unmap non-string");
        }
        if (c.length === 0 || c.length > 2) {
          throw new Error("Cannot unmap string with more or less than one character");
        }
        const c1 = (0, globals_1.safeCharCodeAt)(c, 0);
        if (c.length === 1) {
          return c1;
        }
        const c2 = (0, globals_1.safeCharCodeAt)(c, 1);
        if (c1 < 55296 || c1 > 56319 || c2 < 56320 || c2 > 57343) {
          throw new Error("Cannot unmap invalid surrogate pairs");
        }
        return c.codePointAt(0);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/CharacterArbitraryBuilder.js
  var require_CharacterArbitraryBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/CharacterArbitraryBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildCharacterArbitrary = buildCharacterArbitrary;
      var integer_1 = require_integer();
      var IndexToCharString_1 = require_IndexToCharString();
      function buildCharacterArbitrary(min, max, mapToCode, unmapFromCode) {
        return (0, integer_1.integer)({ min, max }).map((n) => (0, IndexToCharString_1.indexToCharStringMapper)(mapToCode(n)), (c) => unmapFromCode((0, IndexToCharString_1.indexToCharStringUnmapper)(c)));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/IndexToPrintableIndex.js
  var require_IndexToPrintableIndex = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/IndexToPrintableIndex.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.indexToPrintableIndexMapper = indexToPrintableIndexMapper;
      exports.indexToPrintableIndexUnmapper = indexToPrintableIndexUnmapper;
      function indexToPrintableIndexMapper(v) {
        if (v < 95)
          return v + 32;
        if (v <= 126)
          return v - 95;
        return v;
      }
      function indexToPrintableIndexUnmapper(v) {
        if (v >= 32 && v <= 126)
          return v - 32;
        if (v >= 0 && v <= 31)
          return v + 95;
        return v;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/ascii.js
  var require_ascii = __commonJS({
    "node_modules/fast-check/lib/arbitrary/ascii.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ascii = ascii;
      var CharacterArbitraryBuilder_1 = require_CharacterArbitraryBuilder();
      var IndexToPrintableIndex_1 = require_IndexToPrintableIndex();
      function ascii() {
        return (0, CharacterArbitraryBuilder_1.buildCharacterArbitrary)(0, 127, IndexToPrintableIndex_1.indexToPrintableIndexMapper, IndexToPrintableIndex_1.indexToPrintableIndexUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/base64.js
  var require_base64 = __commonJS({
    "node_modules/fast-check/lib/arbitrary/base64.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.base64 = base64;
      var CharacterArbitraryBuilder_1 = require_CharacterArbitraryBuilder();
      function base64Mapper(v) {
        if (v < 26)
          return v + 65;
        if (v < 52)
          return v + 97 - 26;
        if (v < 62)
          return v + 48 - 52;
        return v === 62 ? 43 : 47;
      }
      function base64Unmapper(v) {
        if (v >= 65 && v <= 90)
          return v - 65;
        if (v >= 97 && v <= 122)
          return v - 97 + 26;
        if (v >= 48 && v <= 57)
          return v - 48 + 52;
        return v === 43 ? 62 : v === 47 ? 63 : -1;
      }
      function base64() {
        return (0, CharacterArbitraryBuilder_1.buildCharacterArbitrary)(0, 63, base64Mapper, base64Unmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/char.js
  var require_char = __commonJS({
    "node_modules/fast-check/lib/arbitrary/char.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.char = char;
      var CharacterArbitraryBuilder_1 = require_CharacterArbitraryBuilder();
      function identity(v) {
        return v;
      }
      function char() {
        return (0, CharacterArbitraryBuilder_1.buildCharacterArbitrary)(32, 126, identity, identity);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/char16bits.js
  var require_char16bits = __commonJS({
    "node_modules/fast-check/lib/arbitrary/char16bits.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.char16bits = char16bits;
      var CharacterArbitraryBuilder_1 = require_CharacterArbitraryBuilder();
      var IndexToPrintableIndex_1 = require_IndexToPrintableIndex();
      function char16bits() {
        return (0, CharacterArbitraryBuilder_1.buildCharacterArbitrary)(0, 65535, IndexToPrintableIndex_1.indexToPrintableIndexMapper, IndexToPrintableIndex_1.indexToPrintableIndexUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/fullUnicode.js
  var require_fullUnicode = __commonJS({
    "node_modules/fast-check/lib/arbitrary/fullUnicode.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fullUnicode = fullUnicode;
      var CharacterArbitraryBuilder_1 = require_CharacterArbitraryBuilder();
      var IndexToPrintableIndex_1 = require_IndexToPrintableIndex();
      var gapSize = 57343 + 1 - 55296;
      function unicodeMapper(v) {
        if (v < 55296)
          return (0, IndexToPrintableIndex_1.indexToPrintableIndexMapper)(v);
        return v + gapSize;
      }
      function unicodeUnmapper(v) {
        if (v < 55296)
          return (0, IndexToPrintableIndex_1.indexToPrintableIndexUnmapper)(v);
        if (v <= 57343)
          return -1;
        return v - gapSize;
      }
      function fullUnicode() {
        return (0, CharacterArbitraryBuilder_1.buildCharacterArbitrary)(0, 1114111 - gapSize, unicodeMapper, unicodeUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/hexa.js
  var require_hexa = __commonJS({
    "node_modules/fast-check/lib/arbitrary/hexa.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.hexa = hexa;
      var CharacterArbitraryBuilder_1 = require_CharacterArbitraryBuilder();
      function hexaMapper(v) {
        return v < 10 ? v + 48 : v + 97 - 10;
      }
      function hexaUnmapper(v) {
        return v < 58 ? v - 48 : v >= 97 && v < 103 ? v - 97 + 10 : -1;
      }
      function hexa() {
        return (0, CharacterArbitraryBuilder_1.buildCharacterArbitrary)(0, 15, hexaMapper, hexaUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/unicode.js
  var require_unicode = __commonJS({
    "node_modules/fast-check/lib/arbitrary/unicode.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.unicode = unicode;
      var CharacterArbitraryBuilder_1 = require_CharacterArbitraryBuilder();
      var IndexToPrintableIndex_1 = require_IndexToPrintableIndex();
      var gapSize = 57343 + 1 - 55296;
      function unicodeMapper(v) {
        if (v < 55296)
          return (0, IndexToPrintableIndex_1.indexToPrintableIndexMapper)(v);
        return v + gapSize;
      }
      function unicodeUnmapper(v) {
        if (v < 55296)
          return (0, IndexToPrintableIndex_1.indexToPrintableIndexUnmapper)(v);
        if (v <= 57343)
          return -1;
        return v - gapSize;
      }
      function unicode() {
        return (0, CharacterArbitraryBuilder_1.buildCharacterArbitrary)(0, 65535 - gapSize, unicodeMapper, unicodeUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/constant.js
  var require_constant = __commonJS({
    "node_modules/fast-check/lib/arbitrary/constant.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.constant = constant;
      var ConstantArbitrary_1 = require_ConstantArbitrary();
      function constant(value) {
        return new ConstantArbitrary_1.ConstantArbitrary([value]);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/context.js
  var require_context = __commonJS({
    "node_modules/fast-check/lib/arbitrary/context.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.context = context;
      var symbols_1 = require_symbols();
      var constant_1 = require_constant();
      var ContextImplem = class _ContextImplem {
        constructor() {
          this.receivedLogs = [];
        }
        log(data) {
          this.receivedLogs.push(data);
        }
        size() {
          return this.receivedLogs.length;
        }
        toString() {
          return JSON.stringify({ logs: this.receivedLogs });
        }
        [symbols_1.cloneMethod]() {
          return new _ContextImplem();
        }
      };
      function context() {
        return (0, constant_1.constant)(new ContextImplem());
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/TimeToDate.js
  var require_TimeToDate = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/TimeToDate.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.timeToDateMapper = timeToDateMapper;
      exports.timeToDateUnmapper = timeToDateUnmapper;
      exports.timeToDateMapperWithNaN = timeToDateMapperWithNaN;
      exports.timeToDateUnmapperWithNaN = timeToDateUnmapperWithNaN;
      var globals_1 = require_globals();
      var safeNaN = Number.NaN;
      var safeNumberIsNaN = Number.isNaN;
      function timeToDateMapper(time) {
        return new globals_1.Date(time);
      }
      function timeToDateUnmapper(value) {
        if (!(value instanceof globals_1.Date) || value.constructor !== globals_1.Date) {
          throw new globals_1.Error("Not a valid value for date unmapper");
        }
        return (0, globals_1.safeGetTime)(value);
      }
      function timeToDateMapperWithNaN(valueForNaN) {
        return (time) => {
          return time === valueForNaN ? new globals_1.Date(safeNaN) : timeToDateMapper(time);
        };
      }
      function timeToDateUnmapperWithNaN(valueForNaN) {
        return (value) => {
          const time = timeToDateUnmapper(value);
          return safeNumberIsNaN(time) ? valueForNaN : time;
        };
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/date.js
  var require_date = __commonJS({
    "node_modules/fast-check/lib/arbitrary/date.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.date = date;
      var globals_1 = require_globals();
      var integer_1 = require_integer();
      var TimeToDate_1 = require_TimeToDate();
      var safeNumberIsNaN = Number.isNaN;
      function date(constraints = {}) {
        const intMin = constraints.min !== void 0 ? (0, globals_1.safeGetTime)(constraints.min) : -864e13;
        const intMax = constraints.max !== void 0 ? (0, globals_1.safeGetTime)(constraints.max) : 864e13;
        const noInvalidDate = constraints.noInvalidDate === void 0 || constraints.noInvalidDate;
        if (safeNumberIsNaN(intMin))
          throw new Error("fc.date min must be valid instance of Date");
        if (safeNumberIsNaN(intMax))
          throw new Error("fc.date max must be valid instance of Date");
        if (intMin > intMax)
          throw new Error("fc.date max must be greater or equal to min");
        if (noInvalidDate) {
          return (0, integer_1.integer)({ min: intMin, max: intMax }).map(TimeToDate_1.timeToDateMapper, TimeToDate_1.timeToDateUnmapper);
        }
        const valueForNaN = intMax + 1;
        return (0, integer_1.integer)({ min: intMin, max: intMax + 1 }).map((0, TimeToDate_1.timeToDateMapperWithNaN)(valueForNaN), (0, TimeToDate_1.timeToDateUnmapperWithNaN)(valueForNaN));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/CloneArbitrary.js
  var require_CloneArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/CloneArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CloneArbitrary = void 0;
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var symbols_1 = require_symbols();
      var Stream_1 = require_Stream();
      var globals_1 = require_globals();
      var safeSymbolIterator = Symbol.iterator;
      var safeIsArray = Array.isArray;
      var safeObjectIs = Object.is;
      var CloneArbitrary = class _CloneArbitrary extends Arbitrary_1.Arbitrary {
        constructor(arb, numValues) {
          super();
          this.arb = arb;
          this.numValues = numValues;
        }
        generate(mrng, biasFactor) {
          const items = [];
          if (this.numValues <= 0) {
            return this.wrapper(items);
          }
          for (let idx = 0; idx !== this.numValues - 1; ++idx) {
            (0, globals_1.safePush)(items, this.arb.generate(mrng.clone(), biasFactor));
          }
          (0, globals_1.safePush)(items, this.arb.generate(mrng, biasFactor));
          return this.wrapper(items);
        }
        canShrinkWithoutContext(value) {
          if (!safeIsArray(value) || value.length !== this.numValues) {
            return false;
          }
          if (value.length === 0) {
            return true;
          }
          for (let index = 1; index < value.length; ++index) {
            if (!safeObjectIs(value[0], value[index])) {
              return false;
            }
          }
          return this.arb.canShrinkWithoutContext(value[0]);
        }
        shrink(value, context) {
          if (value.length === 0) {
            return Stream_1.Stream.nil();
          }
          return new Stream_1.Stream(this.shrinkImpl(value, context !== void 0 ? context : [])).map((v) => this.wrapper(v));
        }
        *shrinkImpl(value, contexts) {
          const its = (0, globals_1.safeMap)(value, (v, idx) => this.arb.shrink(v, contexts[idx])[safeSymbolIterator]());
          let cur = (0, globals_1.safeMap)(its, (it) => it.next());
          while (!cur[0].done) {
            yield (0, globals_1.safeMap)(cur, (c) => c.value);
            cur = (0, globals_1.safeMap)(its, (it) => it.next());
          }
        }
        static makeItCloneable(vs, shrinkables) {
          vs[symbols_1.cloneMethod] = () => {
            const cloned = [];
            for (let idx = 0; idx !== shrinkables.length; ++idx) {
              (0, globals_1.safePush)(cloned, shrinkables[idx].value);
            }
            this.makeItCloneable(cloned, shrinkables);
            return cloned;
          };
          return vs;
        }
        wrapper(items) {
          let cloneable = false;
          const vs = [];
          const contexts = [];
          for (let idx = 0; idx !== items.length; ++idx) {
            const s = items[idx];
            cloneable = cloneable || s.hasToBeCloned;
            (0, globals_1.safePush)(vs, s.value);
            (0, globals_1.safePush)(contexts, s.context);
          }
          if (cloneable) {
            _CloneArbitrary.makeItCloneable(vs, items);
          }
          return new Value_1.Value(vs, contexts);
        }
      };
      exports.CloneArbitrary = CloneArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/clone.js
  var require_clone = __commonJS({
    "node_modules/fast-check/lib/arbitrary/clone.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.clone = clone;
      var CloneArbitrary_1 = require_CloneArbitrary();
      function clone(arb, numValues) {
        return new CloneArbitrary_1.CloneArbitrary(arb, numValues);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/CustomEqualSet.js
  var require_CustomEqualSet = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/CustomEqualSet.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CustomEqualSet = void 0;
      var globals_1 = require_globals();
      var CustomEqualSet = class {
        constructor(isEqual) {
          this.isEqual = isEqual;
          this.data = [];
        }
        tryAdd(value) {
          for (let idx = 0; idx !== this.data.length; ++idx) {
            if (this.isEqual(this.data[idx], value)) {
              return false;
            }
          }
          (0, globals_1.safePush)(this.data, value);
          return true;
        }
        size() {
          return this.data.length;
        }
        getData() {
          return this.data;
        }
      };
      exports.CustomEqualSet = CustomEqualSet;
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/StrictlyEqualSet.js
  var require_StrictlyEqualSet = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/StrictlyEqualSet.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StrictlyEqualSet = void 0;
      var globals_1 = require_globals();
      var safeNumberIsNaN = Number.isNaN;
      var StrictlyEqualSet = class {
        constructor(selector) {
          this.selector = selector;
          this.selectedItemsExceptNaN = new globals_1.Set();
          this.data = [];
        }
        tryAdd(value) {
          const selected = this.selector(value);
          if (safeNumberIsNaN(selected)) {
            (0, globals_1.safePush)(this.data, value);
            return true;
          }
          const sizeBefore = this.selectedItemsExceptNaN.size;
          (0, globals_1.safeAdd)(this.selectedItemsExceptNaN, selected);
          if (sizeBefore !== this.selectedItemsExceptNaN.size) {
            (0, globals_1.safePush)(this.data, value);
            return true;
          }
          return false;
        }
        size() {
          return this.data.length;
        }
        getData() {
          return this.data;
        }
      };
      exports.StrictlyEqualSet = StrictlyEqualSet;
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/SameValueSet.js
  var require_SameValueSet = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/SameValueSet.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SameValueSet = void 0;
      var globals_1 = require_globals();
      var safeObjectIs = Object.is;
      var SameValueSet = class {
        constructor(selector) {
          this.selector = selector;
          this.selectedItemsExceptMinusZero = new globals_1.Set();
          this.data = [];
          this.hasMinusZero = false;
        }
        tryAdd(value) {
          const selected = this.selector(value);
          if (safeObjectIs(selected, -0)) {
            if (this.hasMinusZero) {
              return false;
            }
            (0, globals_1.safePush)(this.data, value);
            this.hasMinusZero = true;
            return true;
          }
          const sizeBefore = this.selectedItemsExceptMinusZero.size;
          (0, globals_1.safeAdd)(this.selectedItemsExceptMinusZero, selected);
          if (sizeBefore !== this.selectedItemsExceptMinusZero.size) {
            (0, globals_1.safePush)(this.data, value);
            return true;
          }
          return false;
        }
        size() {
          return this.data.length;
        }
        getData() {
          return this.data;
        }
      };
      exports.SameValueSet = SameValueSet;
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/SameValueZeroSet.js
  var require_SameValueZeroSet = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/SameValueZeroSet.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SameValueZeroSet = void 0;
      var globals_1 = require_globals();
      var SameValueZeroSet = class {
        constructor(selector) {
          this.selector = selector;
          this.selectedItems = new globals_1.Set();
          this.data = [];
        }
        tryAdd(value) {
          const selected = this.selector(value);
          const sizeBefore = this.selectedItems.size;
          (0, globals_1.safeAdd)(this.selectedItems, selected);
          if (sizeBefore !== this.selectedItems.size) {
            (0, globals_1.safePush)(this.data, value);
            return true;
          }
          return false;
        }
        size() {
          return this.data.length;
        }
        getData() {
          return this.data;
        }
      };
      exports.SameValueZeroSet = SameValueZeroSet;
    }
  });

  // node_modules/fast-check/lib/arbitrary/uniqueArray.js
  var require_uniqueArray = __commonJS({
    "node_modules/fast-check/lib/arbitrary/uniqueArray.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.uniqueArray = uniqueArray;
      var ArrayArbitrary_1 = require_ArrayArbitrary();
      var MaxLengthFromMinLength_1 = require_MaxLengthFromMinLength();
      var CustomEqualSet_1 = require_CustomEqualSet();
      var StrictlyEqualSet_1 = require_StrictlyEqualSet();
      var SameValueSet_1 = require_SameValueSet();
      var SameValueZeroSet_1 = require_SameValueZeroSet();
      function buildUniqueArraySetBuilder(constraints) {
        if (typeof constraints.comparator === "function") {
          if (constraints.selector === void 0) {
            const comparator2 = constraints.comparator;
            const isEqualForBuilder2 = (nextA, nextB) => comparator2(nextA.value_, nextB.value_);
            return () => new CustomEqualSet_1.CustomEqualSet(isEqualForBuilder2);
          }
          const comparator = constraints.comparator;
          const selector2 = constraints.selector;
          const refinedSelector2 = (next) => selector2(next.value_);
          const isEqualForBuilder = (nextA, nextB) => comparator(refinedSelector2(nextA), refinedSelector2(nextB));
          return () => new CustomEqualSet_1.CustomEqualSet(isEqualForBuilder);
        }
        const selector = constraints.selector || ((v) => v);
        const refinedSelector = (next) => selector(next.value_);
        switch (constraints.comparator) {
          case "IsStrictlyEqual":
            return () => new StrictlyEqualSet_1.StrictlyEqualSet(refinedSelector);
          case "SameValueZero":
            return () => new SameValueZeroSet_1.SameValueZeroSet(refinedSelector);
          case "SameValue":
          case void 0:
            return () => new SameValueSet_1.SameValueSet(refinedSelector);
        }
      }
      function uniqueArray(arb, constraints = {}) {
        const minLength = constraints.minLength !== void 0 ? constraints.minLength : 0;
        const maxLength = constraints.maxLength !== void 0 ? constraints.maxLength : MaxLengthFromMinLength_1.MaxLengthUpperBound;
        const maxGeneratedLength = (0, MaxLengthFromMinLength_1.maxGeneratedLengthFromSizeForArbitrary)(constraints.size, minLength, maxLength, constraints.maxLength !== void 0);
        const depthIdentifier = constraints.depthIdentifier;
        const setBuilder = buildUniqueArraySetBuilder(constraints);
        const arrayArb = new ArrayArbitrary_1.ArrayArbitrary(arb, minLength, maxGeneratedLength, maxLength, depthIdentifier, setBuilder, []);
        if (minLength === 0)
          return arrayArb;
        return arrayArb.filter((tab) => tab.length >= minLength);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/KeyValuePairsToObject.js
  var require_KeyValuePairsToObject = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/KeyValuePairsToObject.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.keyValuePairsToObjectMapper = keyValuePairsToObjectMapper;
      exports.keyValuePairsToObjectUnmapper = keyValuePairsToObjectUnmapper;
      var globals_1 = require_globals();
      var safeObjectCreate = Object.create;
      var safeObjectDefineProperty = Object.defineProperty;
      var safeObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var safeObjectGetPrototypeOf = Object.getPrototypeOf;
      var safeObjectGetOwnPropertySymbols = Object.getOwnPropertySymbols;
      var safeObjectGetOwnPropertyNames = Object.getOwnPropertyNames;
      var safeObjectEntries = Object.entries;
      function keyValuePairsToObjectMapper(definition) {
        const obj = definition[1] ? safeObjectCreate(null) : {};
        for (const keyValue of definition[0]) {
          safeObjectDefineProperty(obj, keyValue[0], {
            enumerable: true,
            configurable: true,
            writable: true,
            value: keyValue[1]
          });
        }
        return obj;
      }
      function buildIsValidPropertyNameFilter(obj) {
        return function isValidPropertyNameFilter(key) {
          const descriptor = safeObjectGetOwnPropertyDescriptor(obj, key);
          return descriptor !== void 0 && !!descriptor.configurable && !!descriptor.enumerable && !!descriptor.writable && descriptor.get === void 0 && descriptor.set === void 0;
        };
      }
      function keyValuePairsToObjectUnmapper(value) {
        if (typeof value !== "object" || value === null) {
          throw new globals_1.Error("Incompatible instance received: should be a non-null object");
        }
        const hasNullPrototype = safeObjectGetPrototypeOf(value) === null;
        const hasObjectPrototype = "constructor" in value && value.constructor === Object;
        if (!hasNullPrototype && !hasObjectPrototype) {
          throw new globals_1.Error("Incompatible instance received: should be of exact type Object");
        }
        if (safeObjectGetOwnPropertySymbols(value).length > 0) {
          throw new globals_1.Error("Incompatible instance received: should contain symbols");
        }
        if (!(0, globals_1.safeEvery)(safeObjectGetOwnPropertyNames(value), buildIsValidPropertyNameFilter(value))) {
          throw new globals_1.Error("Incompatible instance received: should contain only c/e/w properties without get/set");
        }
        return [safeObjectEntries(value), hasNullPrototype];
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/dictionary.js
  var require_dictionary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/dictionary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.dictionary = dictionary;
      var tuple_1 = require_tuple();
      var uniqueArray_1 = require_uniqueArray();
      var KeyValuePairsToObject_1 = require_KeyValuePairsToObject();
      var constant_1 = require_constant();
      var boolean_1 = require_boolean();
      function dictionaryKeyExtractor(entry) {
        return entry[0];
      }
      function dictionary(keyArb, valueArb, constraints = {}) {
        const noNullPrototype = constraints.noNullPrototype !== false;
        return (0, tuple_1.tuple)((0, uniqueArray_1.uniqueArray)((0, tuple_1.tuple)(keyArb, valueArb), {
          minLength: constraints.minKeys,
          maxLength: constraints.maxKeys,
          size: constraints.size,
          selector: dictionaryKeyExtractor,
          depthIdentifier: constraints.depthIdentifier
        }), noNullPrototype ? (0, constant_1.constant)(false) : (0, boolean_1.boolean)()).map(KeyValuePairsToObject_1.keyValuePairsToObjectMapper, KeyValuePairsToObject_1.keyValuePairsToObjectUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/FrequencyArbitrary.js
  var require_FrequencyArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/FrequencyArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FrequencyArbitrary = void 0;
      var Stream_1 = require_Stream();
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var DepthContext_1 = require_DepthContext();
      var MaxLengthFromMinLength_1 = require_MaxLengthFromMinLength();
      var globals_1 = require_globals();
      var safePositiveInfinity = Number.POSITIVE_INFINITY;
      var safeMaxSafeInteger = Number.MAX_SAFE_INTEGER;
      var safeNumberIsInteger = Number.isInteger;
      var safeMathFloor = Math.floor;
      var safeMathPow = Math.pow;
      var safeMathMin = Math.min;
      var FrequencyArbitrary = class _FrequencyArbitrary extends Arbitrary_1.Arbitrary {
        static from(warbs, constraints, label) {
          if (warbs.length === 0) {
            throw new Error(`${label} expects at least one weighted arbitrary`);
          }
          let totalWeight = 0;
          for (let idx = 0; idx !== warbs.length; ++idx) {
            const currentArbitrary = warbs[idx].arbitrary;
            if (currentArbitrary === void 0) {
              throw new Error(`${label} expects arbitraries to be specified`);
            }
            const currentWeight = warbs[idx].weight;
            totalWeight += currentWeight;
            if (!safeNumberIsInteger(currentWeight)) {
              throw new Error(`${label} expects weights to be integer values`);
            }
            if (currentWeight < 0) {
              throw new Error(`${label} expects weights to be superior or equal to 0`);
            }
          }
          if (totalWeight <= 0) {
            throw new Error(`${label} expects the sum of weights to be strictly superior to 0`);
          }
          const sanitizedConstraints = {
            depthBias: (0, MaxLengthFromMinLength_1.depthBiasFromSizeForArbitrary)(constraints.depthSize, constraints.maxDepth !== void 0),
            maxDepth: constraints.maxDepth != void 0 ? constraints.maxDepth : safePositiveInfinity,
            withCrossShrink: !!constraints.withCrossShrink
          };
          return new _FrequencyArbitrary(warbs, sanitizedConstraints, (0, DepthContext_1.getDepthContextFor)(constraints.depthIdentifier));
        }
        constructor(warbs, constraints, context) {
          super();
          this.warbs = warbs;
          this.constraints = constraints;
          this.context = context;
          let currentWeight = 0;
          this.cumulatedWeights = [];
          for (let idx = 0; idx !== warbs.length; ++idx) {
            currentWeight += warbs[idx].weight;
            (0, globals_1.safePush)(this.cumulatedWeights, currentWeight);
          }
          this.totalWeight = currentWeight;
        }
        generate(mrng, biasFactor) {
          if (this.mustGenerateFirst()) {
            return this.safeGenerateForIndex(mrng, 0, biasFactor);
          }
          const selected = mrng.nextInt(this.computeNegDepthBenefit(), this.totalWeight - 1);
          for (let idx = 0; idx !== this.cumulatedWeights.length; ++idx) {
            if (selected < this.cumulatedWeights[idx]) {
              return this.safeGenerateForIndex(mrng, idx, biasFactor);
            }
          }
          throw new Error(`Unable to generate from fc.frequency`);
        }
        canShrinkWithoutContext(value) {
          return this.canShrinkWithoutContextIndex(value) !== -1;
        }
        shrink(value, context) {
          if (context !== void 0) {
            const safeContext = context;
            const selectedIndex = safeContext.selectedIndex;
            const originalBias = safeContext.originalBias;
            const originalArbitrary = this.warbs[selectedIndex].arbitrary;
            const originalShrinks = originalArbitrary.shrink(value, safeContext.originalContext).map((v) => this.mapIntoValue(selectedIndex, v, null, originalBias));
            if (safeContext.clonedMrngForFallbackFirst !== null) {
              if (safeContext.cachedGeneratedForFirst === void 0) {
                safeContext.cachedGeneratedForFirst = this.safeGenerateForIndex(safeContext.clonedMrngForFallbackFirst, 0, originalBias);
              }
              const valueFromFirst = safeContext.cachedGeneratedForFirst;
              return Stream_1.Stream.of(valueFromFirst).join(originalShrinks);
            }
            return originalShrinks;
          }
          const potentialSelectedIndex = this.canShrinkWithoutContextIndex(value);
          if (potentialSelectedIndex === -1) {
            return Stream_1.Stream.nil();
          }
          return this.defaultShrinkForFirst(potentialSelectedIndex).join(this.warbs[potentialSelectedIndex].arbitrary.shrink(value, void 0).map((v) => this.mapIntoValue(potentialSelectedIndex, v, null, void 0)));
        }
        defaultShrinkForFirst(selectedIndex) {
          ++this.context.depth;
          try {
            if (!this.mustFallbackToFirstInShrink(selectedIndex) || this.warbs[0].fallbackValue === void 0) {
              return Stream_1.Stream.nil();
            }
          } finally {
            --this.context.depth;
          }
          const rawShrinkValue = new Value_1.Value(this.warbs[0].fallbackValue.default, void 0);
          return Stream_1.Stream.of(this.mapIntoValue(0, rawShrinkValue, null, void 0));
        }
        canShrinkWithoutContextIndex(value) {
          if (this.mustGenerateFirst()) {
            return this.warbs[0].arbitrary.canShrinkWithoutContext(value) ? 0 : -1;
          }
          try {
            ++this.context.depth;
            for (let idx = 0; idx !== this.warbs.length; ++idx) {
              const warb = this.warbs[idx];
              if (warb.weight !== 0 && warb.arbitrary.canShrinkWithoutContext(value)) {
                return idx;
              }
            }
            return -1;
          } finally {
            --this.context.depth;
          }
        }
        mapIntoValue(idx, value, clonedMrngForFallbackFirst, biasFactor) {
          const context = {
            selectedIndex: idx,
            originalBias: biasFactor,
            originalContext: value.context,
            clonedMrngForFallbackFirst
          };
          return new Value_1.Value(value.value, context);
        }
        safeGenerateForIndex(mrng, idx, biasFactor) {
          ++this.context.depth;
          try {
            const value = this.warbs[idx].arbitrary.generate(mrng, biasFactor);
            const clonedMrngForFallbackFirst = this.mustFallbackToFirstInShrink(idx) ? mrng.clone() : null;
            return this.mapIntoValue(idx, value, clonedMrngForFallbackFirst, biasFactor);
          } finally {
            --this.context.depth;
          }
        }
        mustGenerateFirst() {
          return this.constraints.maxDepth <= this.context.depth;
        }
        mustFallbackToFirstInShrink(idx) {
          return idx !== 0 && this.constraints.withCrossShrink && this.warbs[0].weight !== 0;
        }
        computeNegDepthBenefit() {
          const depthBias = this.constraints.depthBias;
          if (depthBias <= 0 || this.warbs[0].weight === 0) {
            return 0;
          }
          const depthBenefit = safeMathFloor(safeMathPow(1 + depthBias, this.context.depth)) - 1;
          return -safeMathMin(this.totalWeight * depthBenefit, safeMaxSafeInteger) || 0;
        }
      };
      exports.FrequencyArbitrary = FrequencyArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/oneof.js
  var require_oneof = __commonJS({
    "node_modules/fast-check/lib/arbitrary/oneof.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.oneof = oneof;
      var Arbitrary_1 = require_Arbitrary();
      var globals_1 = require_globals();
      var FrequencyArbitrary_1 = require_FrequencyArbitrary();
      function isOneOfContraints(param) {
        return param != null && typeof param === "object" && !("generate" in param) && !("arbitrary" in param) && !("weight" in param);
      }
      function toWeightedArbitrary(maybeWeightedArbitrary) {
        if ((0, Arbitrary_1.isArbitrary)(maybeWeightedArbitrary)) {
          return { arbitrary: maybeWeightedArbitrary, weight: 1 };
        }
        return maybeWeightedArbitrary;
      }
      function oneof(...args) {
        const constraints = args[0];
        if (isOneOfContraints(constraints)) {
          const weightedArbs2 = (0, globals_1.safeMap)((0, globals_1.safeSlice)(args, 1), toWeightedArbitrary);
          return FrequencyArbitrary_1.FrequencyArbitrary.from(weightedArbs2, constraints, "fc.oneof");
        }
        const weightedArbs = (0, globals_1.safeMap)(args, toWeightedArbitrary);
        return FrequencyArbitrary_1.FrequencyArbitrary.from(weightedArbs, {}, "fc.oneof");
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/nat.js
  var require_nat = __commonJS({
    "node_modules/fast-check/lib/arbitrary/nat.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.nat = nat;
      var IntegerArbitrary_1 = require_IntegerArbitrary();
      var safeNumberIsInteger = Number.isInteger;
      function nat(arg) {
        const max = typeof arg === "number" ? arg : arg && arg.max !== void 0 ? arg.max : 2147483647;
        if (max < 0) {
          throw new Error("fc.nat value should be greater than or equal to 0");
        }
        if (!safeNumberIsInteger(max)) {
          throw new Error("fc.nat maximum value should be an integer");
        }
        return new IntegerArbitrary_1.IntegerArbitrary(0, max);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/IndexToMappedConstant.js
  var require_IndexToMappedConstant = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/IndexToMappedConstant.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.indexToMappedConstantMapperFor = indexToMappedConstantMapperFor;
      exports.indexToMappedConstantUnmapperFor = indexToMappedConstantUnmapperFor;
      function indexToMappedConstantMapperFor(entries) {
        return function indexToMappedConstantMapper(choiceIndex) {
          let idx = -1;
          let numSkips = 0;
          while (choiceIndex >= numSkips) {
            numSkips += entries[++idx].num;
          }
          return entries[idx].build(choiceIndex - numSkips + entries[idx].num);
        };
      }
      function buildReverseMapping(entries) {
        const reverseMapping = { mapping: /* @__PURE__ */ new Map(), negativeZeroIndex: void 0 };
        let choiceIndex = 0;
        for (let entryIdx = 0; entryIdx !== entries.length; ++entryIdx) {
          const entry = entries[entryIdx];
          for (let idxInEntry = 0; idxInEntry !== entry.num; ++idxInEntry) {
            const value = entry.build(idxInEntry);
            if (value === 0 && 1 / value === Number.NEGATIVE_INFINITY) {
              reverseMapping.negativeZeroIndex = choiceIndex;
            } else {
              reverseMapping.mapping.set(value, choiceIndex);
            }
            ++choiceIndex;
          }
        }
        return reverseMapping;
      }
      function indexToMappedConstantUnmapperFor(entries) {
        let reverseMapping = null;
        return function indexToMappedConstantUnmapper(value) {
          if (reverseMapping === null) {
            reverseMapping = buildReverseMapping(entries);
          }
          const choiceIndex = Object.is(value, -0) ? reverseMapping.negativeZeroIndex : reverseMapping.mapping.get(value);
          if (choiceIndex === void 0) {
            throw new Error("Unknown value encountered cannot be built using this mapToConstant");
          }
          return choiceIndex;
        };
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/mapToConstant.js
  var require_mapToConstant = __commonJS({
    "node_modules/fast-check/lib/arbitrary/mapToConstant.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.mapToConstant = mapToConstant;
      var nat_1 = require_nat();
      var IndexToMappedConstant_1 = require_IndexToMappedConstant();
      function computeNumChoices(options) {
        if (options.length === 0)
          throw new Error(`fc.mapToConstant expects at least one option`);
        let numChoices = 0;
        for (let idx = 0; idx !== options.length; ++idx) {
          if (options[idx].num < 0)
            throw new Error(`fc.mapToConstant expects all options to have a number of entries greater or equal to zero`);
          numChoices += options[idx].num;
        }
        if (numChoices === 0)
          throw new Error(`fc.mapToConstant expects at least one choice among options`);
        return numChoices;
      }
      function mapToConstant(...entries) {
        const numChoices = computeNumChoices(entries);
        return (0, nat_1.nat)({ max: numChoices - 1 }).map((0, IndexToMappedConstant_1.indexToMappedConstantMapperFor)(entries), (0, IndexToMappedConstant_1.indexToMappedConstantUnmapperFor)(entries));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/CharacterRangeArbitraryBuilder.js
  var require_CharacterRangeArbitraryBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/CharacterRangeArbitraryBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildAlphaNumericPercentArbitrary = exports.buildAlphaNumericArbitrary = exports.buildLowerAlphaNumericArbitrary = exports.buildLowerAlphaArbitrary = void 0;
      var fullUnicode_1 = require_fullUnicode();
      var oneof_1 = require_oneof();
      var mapToConstant_1 = require_mapToConstant();
      var globals_1 = require_globals();
      var safeStringFromCharCode = String.fromCharCode;
      var lowerCaseMapper = { num: 26, build: (v) => safeStringFromCharCode(v + 97) };
      var upperCaseMapper = { num: 26, build: (v) => safeStringFromCharCode(v + 65) };
      var numericMapper = { num: 10, build: (v) => safeStringFromCharCode(v + 48) };
      function percentCharArbMapper(c) {
        const encoded = (0, globals_1.encodeURIComponent)(c);
        return c !== encoded ? encoded : `%${(0, globals_1.safeNumberToString)((0, globals_1.safeCharCodeAt)(c, 0), 16)}`;
      }
      function percentCharArbUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Unsupported");
        }
        const decoded = decodeURIComponent(value);
        return decoded;
      }
      var percentCharArb = (0, fullUnicode_1.fullUnicode)().map(percentCharArbMapper, percentCharArbUnmapper);
      var buildLowerAlphaArbitrary = (others) => (0, mapToConstant_1.mapToConstant)(lowerCaseMapper, { num: others.length, build: (v) => others[v] });
      exports.buildLowerAlphaArbitrary = buildLowerAlphaArbitrary;
      var buildLowerAlphaNumericArbitrary = (others) => (0, mapToConstant_1.mapToConstant)(lowerCaseMapper, numericMapper, { num: others.length, build: (v) => others[v] });
      exports.buildLowerAlphaNumericArbitrary = buildLowerAlphaNumericArbitrary;
      var buildAlphaNumericArbitrary = (others) => (0, mapToConstant_1.mapToConstant)(lowerCaseMapper, upperCaseMapper, numericMapper, { num: others.length, build: (v) => others[v] });
      exports.buildAlphaNumericArbitrary = buildAlphaNumericArbitrary;
      var buildAlphaNumericPercentArbitrary = (others) => (0, oneof_1.oneof)({ weight: 10, arbitrary: (0, exports.buildAlphaNumericArbitrary)(others) }, { weight: 1, arbitrary: percentCharArb });
      exports.buildAlphaNumericPercentArbitrary = buildAlphaNumericPercentArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/option.js
  var require_option = __commonJS({
    "node_modules/fast-check/lib/arbitrary/option.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.option = option;
      var constant_1 = require_constant();
      var FrequencyArbitrary_1 = require_FrequencyArbitrary();
      var globals_1 = require_globals();
      function option(arb, constraints = {}) {
        const freq = constraints.freq == null ? 5 : constraints.freq;
        const nilValue = (0, globals_1.safeHasOwnProperty)(constraints, "nil") ? constraints.nil : null;
        const nilArb = (0, constant_1.constant)(nilValue);
        const weightedArbs = [
          { arbitrary: nilArb, weight: 1, fallbackValue: { default: nilValue } },
          { arbitrary: arb, weight: freq }
        ];
        const frequencyConstraints = {
          withCrossShrink: true,
          depthSize: constraints.depthSize,
          maxDepth: constraints.maxDepth,
          depthIdentifier: constraints.depthIdentifier
        };
        return FrequencyArbitrary_1.FrequencyArbitrary.from(weightedArbs, frequencyConstraints, "fc.option");
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/PatternsToString.js
  var require_PatternsToString = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/PatternsToString.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.patternsToStringMapper = patternsToStringMapper;
      exports.patternsToStringUnmapperFor = patternsToStringUnmapperFor;
      var MaxLengthFromMinLength_1 = require_MaxLengthFromMinLength();
      var globals_1 = require_globals();
      function patternsToStringMapper(tab) {
        return (0, globals_1.safeJoin)(tab, "");
      }
      function patternsToStringUnmapperFor(patternsArb, constraints) {
        return function patternsToStringUnmapper(value) {
          if (typeof value !== "string") {
            throw new Error("Unsupported value");
          }
          const minLength = constraints.minLength !== void 0 ? constraints.minLength : 0;
          const maxLength = constraints.maxLength !== void 0 ? constraints.maxLength : MaxLengthFromMinLength_1.MaxLengthUpperBound;
          if (value.length === 0) {
            if (minLength > 0) {
              throw new Error("Unable to unmap received string");
            }
            return [];
          }
          const stack = [{ endIndexChunks: 0, nextStartIndex: 1, chunks: [] }];
          while (stack.length > 0) {
            const last = (0, globals_1.safePop)(stack);
            for (let index = last.nextStartIndex; index <= value.length; ++index) {
              const chunk = (0, globals_1.safeSubstring)(value, last.endIndexChunks, index);
              if (patternsArb.canShrinkWithoutContext(chunk)) {
                const newChunks = [...last.chunks, chunk];
                if (index === value.length) {
                  if (newChunks.length < minLength || newChunks.length > maxLength) {
                    break;
                  }
                  return newChunks;
                }
                (0, globals_1.safePush)(stack, { endIndexChunks: last.endIndexChunks, nextStartIndex: index + 1, chunks: last.chunks });
                (0, globals_1.safePush)(stack, { endIndexChunks: index, nextStartIndex: index + 1, chunks: newChunks });
                break;
              }
            }
          }
          throw new Error("Unable to unmap received string");
        };
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/SlicesForStringBuilder.js
  var require_SlicesForStringBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/SlicesForStringBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createSlicesForString = createSlicesForString;
      var globals_1 = require_globals();
      var dangerousStrings = [
        "__defineGetter__",
        "__defineSetter__",
        "__lookupGetter__",
        "__lookupSetter__",
        "__proto__",
        "constructor",
        "hasOwnProperty",
        "isPrototypeOf",
        "propertyIsEnumerable",
        "toLocaleString",
        "toString",
        "valueOf",
        "apply",
        "arguments",
        "bind",
        "call",
        "caller",
        "length",
        "name",
        "prototype",
        "key",
        "ref"
      ];
      function computeCandidateString(dangerous, charArbitrary, stringSplitter) {
        let candidate;
        try {
          candidate = stringSplitter(dangerous);
        } catch (err) {
          return void 0;
        }
        for (const entry of candidate) {
          if (!charArbitrary.canShrinkWithoutContext(entry)) {
            return void 0;
          }
        }
        return candidate;
      }
      function createSlicesForString(charArbitrary, stringSplitter) {
        const slicesForString = [];
        for (const dangerous of dangerousStrings) {
          const candidate = computeCandidateString(dangerous, charArbitrary, stringSplitter);
          if (candidate !== void 0) {
            (0, globals_1.safePush)(slicesForString, candidate);
          }
        }
        return slicesForString;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/stringOf.js
  var require_stringOf = __commonJS({
    "node_modules/fast-check/lib/arbitrary/stringOf.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.stringOf = stringOf;
      var array_1 = require_array();
      var PatternsToString_1 = require_PatternsToString();
      var SlicesForStringBuilder_1 = require_SlicesForStringBuilder();
      var safeObjectAssign = Object.assign;
      function stringOf(charArb, constraints = {}) {
        const unmapper = (0, PatternsToString_1.patternsToStringUnmapperFor)(charArb, constraints);
        const experimentalCustomSlices = (0, SlicesForStringBuilder_1.createSlicesForString)(charArb, unmapper);
        const enrichedConstraints = safeObjectAssign(safeObjectAssign({}, constraints), {
          experimentalCustomSlices
        });
        return (0, array_1.array)(charArb, enrichedConstraints).map(PatternsToString_1.patternsToStringMapper, unmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/InvalidSubdomainLabelFiIter.js
  var require_InvalidSubdomainLabelFiIter = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/InvalidSubdomainLabelFiIter.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.filterInvalidSubdomainLabel = filterInvalidSubdomainLabel;
      function filterInvalidSubdomainLabel(subdomainLabel) {
        if (subdomainLabel.length > 63) {
          return false;
        }
        return subdomainLabel.length < 4 || subdomainLabel[0] !== "x" || subdomainLabel[1] !== "n" || subdomainLabel[2] !== "-" || subdomainLabel[3] !== "-";
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/AdapterArbitrary.js
  var require_AdapterArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/AdapterArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.adapter = adapter;
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var Stream_1 = require_Stream();
      var AdaptedValue = /* @__PURE__ */ Symbol("adapted-value");
      function toAdapterValue(rawValue, adapter2) {
        const adapted = adapter2(rawValue.value_);
        if (!adapted.adapted) {
          return rawValue;
        }
        return new Value_1.Value(adapted.value, AdaptedValue);
      }
      var AdapterArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor(sourceArb, adapter2) {
          super();
          this.sourceArb = sourceArb;
          this.adapter = adapter2;
          this.adaptValue = (rawValue) => toAdapterValue(rawValue, adapter2);
        }
        generate(mrng, biasFactor) {
          const rawValue = this.sourceArb.generate(mrng, biasFactor);
          return this.adaptValue(rawValue);
        }
        canShrinkWithoutContext(value) {
          return this.sourceArb.canShrinkWithoutContext(value) && !this.adapter(value).adapted;
        }
        shrink(value, context) {
          if (context === AdaptedValue) {
            if (!this.sourceArb.canShrinkWithoutContext(value)) {
              return Stream_1.Stream.nil();
            }
            return this.sourceArb.shrink(value, void 0).map(this.adaptValue);
          }
          return this.sourceArb.shrink(value, context).map(this.adaptValue);
        }
      };
      function adapter(sourceArb, adapter2) {
        return new AdapterArbitrary(sourceArb, adapter2);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/domain.js
  var require_domain = __commonJS({
    "node_modules/fast-check/lib/arbitrary/domain.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.domain = domain;
      var array_1 = require_array();
      var CharacterRangeArbitraryBuilder_1 = require_CharacterRangeArbitraryBuilder();
      var option_1 = require_option();
      var stringOf_1 = require_stringOf();
      var tuple_1 = require_tuple();
      var InvalidSubdomainLabelFiIter_1 = require_InvalidSubdomainLabelFiIter();
      var MaxLengthFromMinLength_1 = require_MaxLengthFromMinLength();
      var AdapterArbitrary_1 = require_AdapterArbitrary();
      var globals_1 = require_globals();
      function toSubdomainLabelMapper([f, d]) {
        return d === null ? f : `${f}${d[0]}${d[1]}`;
      }
      function toSubdomainLabelUnmapper(value) {
        if (typeof value !== "string" || value.length === 0) {
          throw new Error("Unsupported");
        }
        if (value.length === 1) {
          return [value[0], null];
        }
        return [value[0], [(0, globals_1.safeSubstring)(value, 1, value.length - 1), value[value.length - 1]]];
      }
      function subdomainLabel(size) {
        const alphaNumericArb = (0, CharacterRangeArbitraryBuilder_1.buildLowerAlphaNumericArbitrary)([]);
        const alphaNumericHyphenArb = (0, CharacterRangeArbitraryBuilder_1.buildLowerAlphaNumericArbitrary)(["-"]);
        return (0, tuple_1.tuple)(alphaNumericArb, (0, option_1.option)((0, tuple_1.tuple)((0, stringOf_1.stringOf)(alphaNumericHyphenArb, { size, maxLength: 61 }), alphaNumericArb))).map(toSubdomainLabelMapper, toSubdomainLabelUnmapper).filter(InvalidSubdomainLabelFiIter_1.filterInvalidSubdomainLabel);
      }
      function labelsMapper(elements) {
        return `${(0, globals_1.safeJoin)(elements[0], ".")}.${elements[1]}`;
      }
      function labelsUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Unsupported type");
        }
        const lastDotIndex = value.lastIndexOf(".");
        return [(0, globals_1.safeSplit)((0, globals_1.safeSubstring)(value, 0, lastDotIndex), "."), (0, globals_1.safeSubstring)(value, lastDotIndex + 1)];
      }
      function labelsAdapter(labels) {
        const [subDomains, suffix] = labels;
        let lengthNotIncludingIndex = suffix.length;
        for (let index = 0; index !== subDomains.length; ++index) {
          lengthNotIncludingIndex += 1 + subDomains[index].length;
          if (lengthNotIncludingIndex > 255) {
            return { adapted: true, value: [(0, globals_1.safeSlice)(subDomains, 0, index), suffix] };
          }
        }
        return { adapted: false, value: labels };
      }
      function domain(constraints = {}) {
        const resolvedSize = (0, MaxLengthFromMinLength_1.resolveSize)(constraints.size);
        const resolvedSizeMinusOne = (0, MaxLengthFromMinLength_1.relativeSizeToSize)("-1", resolvedSize);
        const alphaNumericArb = (0, CharacterRangeArbitraryBuilder_1.buildLowerAlphaArbitrary)([]);
        const publicSuffixArb = (0, stringOf_1.stringOf)(alphaNumericArb, { minLength: 2, maxLength: 63, size: resolvedSizeMinusOne });
        return (0, AdapterArbitrary_1.adapter)((0, tuple_1.tuple)((0, array_1.array)(subdomainLabel(resolvedSize), { size: resolvedSizeMinusOne, minLength: 1, maxLength: 127 }), publicSuffixArb), labelsAdapter).map(labelsMapper, labelsUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/emailAddress.js
  var require_emailAddress = __commonJS({
    "node_modules/fast-check/lib/arbitrary/emailAddress.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.emailAddress = emailAddress;
      var array_1 = require_array();
      var CharacterRangeArbitraryBuilder_1 = require_CharacterRangeArbitraryBuilder();
      var domain_1 = require_domain();
      var stringOf_1 = require_stringOf();
      var tuple_1 = require_tuple();
      var AdapterArbitrary_1 = require_AdapterArbitrary();
      var globals_1 = require_globals();
      function dotAdapter(a) {
        let currentLength = a[0].length;
        for (let index = 1; index !== a.length; ++index) {
          currentLength += 1 + a[index].length;
          if (currentLength > 64) {
            return { adapted: true, value: (0, globals_1.safeSlice)(a, 0, index) };
          }
        }
        return { adapted: false, value: a };
      }
      function dotMapper(a) {
        return (0, globals_1.safeJoin)(a, ".");
      }
      function dotUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Unsupported");
        }
        return (0, globals_1.safeSplit)(value, ".");
      }
      function atMapper(data) {
        return `${data[0]}@${data[1]}`;
      }
      function atUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Unsupported");
        }
        return (0, globals_1.safeSplit)(value, "@", 2);
      }
      function emailAddress(constraints = {}) {
        const others = ["!", "#", "$", "%", "&", "'", "*", "+", "-", "/", "=", "?", "^", "_", "`", "{", "|", "}", "~"];
        const atextArb = (0, CharacterRangeArbitraryBuilder_1.buildLowerAlphaNumericArbitrary)(others);
        const localPartArb = (0, AdapterArbitrary_1.adapter)((0, array_1.array)((0, stringOf_1.stringOf)(atextArb, {
          minLength: 1,
          maxLength: 64,
          size: constraints.size
        }), { minLength: 1, maxLength: 32, size: constraints.size }), dotAdapter).map(dotMapper, dotUnmapper);
        return (0, tuple_1.tuple)(localPartArb, (0, domain_1.domain)({ size: constraints.size })).map(atMapper, atUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/ArrayInt64.js
  var require_ArrayInt64 = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/ArrayInt64.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Unit64 = exports.Zero64 = void 0;
      exports.isZero64 = isZero64;
      exports.isStrictlyNegative64 = isStrictlyNegative64;
      exports.isStrictlyPositive64 = isStrictlyPositive64;
      exports.isEqual64 = isEqual64;
      exports.isStrictlySmaller64 = isStrictlySmaller64;
      exports.clone64 = clone64;
      exports.substract64 = substract64;
      exports.negative64 = negative64;
      exports.add64 = add64;
      exports.halve64 = halve64;
      exports.logLike64 = logLike64;
      exports.Zero64 = { sign: 1, data: [0, 0] };
      exports.Unit64 = { sign: 1, data: [0, 1] };
      function isZero64(a) {
        return a.data[0] === 0 && a.data[1] === 0;
      }
      function isStrictlyNegative64(a) {
        return a.sign === -1 && !isZero64(a);
      }
      function isStrictlyPositive64(a) {
        return a.sign === 1 && !isZero64(a);
      }
      function isEqual64(a, b) {
        if (a.data[0] === b.data[0] && a.data[1] === b.data[1]) {
          return a.sign === b.sign || a.data[0] === 0 && a.data[1] === 0;
        }
        return false;
      }
      function isStrictlySmaller64Internal(a, b) {
        return a[0] < b[0] || a[0] === b[0] && a[1] < b[1];
      }
      function isStrictlySmaller64(a, b) {
        if (a.sign === b.sign) {
          return a.sign === 1 ? isStrictlySmaller64Internal(a.data, b.data) : isStrictlySmaller64Internal(b.data, a.data);
        }
        return a.sign === -1 && (!isZero64(a) || !isZero64(b));
      }
      function clone64(a) {
        return { sign: a.sign, data: [a.data[0], a.data[1]] };
      }
      function substract64DataInternal(a, b) {
        let reminderLow = 0;
        let low = a[1] - b[1];
        if (low < 0) {
          reminderLow = 1;
          low = low >>> 0;
        }
        return [a[0] - b[0] - reminderLow, low];
      }
      function substract64Internal(a, b) {
        if (a.sign === 1 && b.sign === -1) {
          const low = a.data[1] + b.data[1];
          const high = a.data[0] + b.data[0] + (low > 4294967295 ? 1 : 0);
          return { sign: 1, data: [high >>> 0, low >>> 0] };
        }
        return {
          sign: 1,
          data: a.sign === 1 ? substract64DataInternal(a.data, b.data) : substract64DataInternal(b.data, a.data)
        };
      }
      function substract64(arrayIntA, arrayIntB) {
        if (isStrictlySmaller64(arrayIntA, arrayIntB)) {
          const out = substract64Internal(arrayIntB, arrayIntA);
          out.sign = -1;
          return out;
        }
        return substract64Internal(arrayIntA, arrayIntB);
      }
      function negative64(arrayIntA) {
        return {
          sign: -arrayIntA.sign,
          data: [arrayIntA.data[0], arrayIntA.data[1]]
        };
      }
      function add64(arrayIntA, arrayIntB) {
        if (isZero64(arrayIntB)) {
          if (isZero64(arrayIntA)) {
            return clone64(exports.Zero64);
          }
          return clone64(arrayIntA);
        }
        return substract64(arrayIntA, negative64(arrayIntB));
      }
      function halve64(a) {
        return {
          sign: a.sign,
          data: [Math.floor(a.data[0] / 2), (a.data[0] % 2 === 1 ? 2147483648 : 0) + Math.floor(a.data[1] / 2)]
        };
      }
      function logLike64(a) {
        return {
          sign: a.sign,
          data: [0, Math.floor(Math.log(a.data[0] * 4294967296 + a.data[1]) / Math.log(2))]
        };
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/ArrayInt64Arbitrary.js
  var require_ArrayInt64Arbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/ArrayInt64Arbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.arrayInt64 = arrayInt64;
      var Stream_1 = require_Stream();
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var ArrayInt64_1 = require_ArrayInt64();
      var ArrayInt64Arbitrary = class _ArrayInt64Arbitrary extends Arbitrary_1.Arbitrary {
        constructor(min, max) {
          super();
          this.min = min;
          this.max = max;
          this.biasedRanges = null;
        }
        generate(mrng, biasFactor) {
          const range = this.computeGenerateRange(mrng, biasFactor);
          const uncheckedValue = mrng.nextArrayInt(range.min, range.max);
          if (uncheckedValue.data.length === 1) {
            uncheckedValue.data.unshift(0);
          }
          return new Value_1.Value(uncheckedValue, void 0);
        }
        computeGenerateRange(mrng, biasFactor) {
          if (biasFactor === void 0 || mrng.nextInt(1, biasFactor) !== 1) {
            return { min: this.min, max: this.max };
          }
          const ranges = this.retrieveBiasedRanges();
          if (ranges.length === 1) {
            return ranges[0];
          }
          const id = mrng.nextInt(-2 * (ranges.length - 1), ranges.length - 2);
          return id < 0 ? ranges[0] : ranges[id + 1];
        }
        canShrinkWithoutContext(value) {
          const unsafeValue = value;
          return typeof value === "object" && value !== null && (unsafeValue.sign === -1 || unsafeValue.sign === 1) && Array.isArray(unsafeValue.data) && unsafeValue.data.length === 2 && ((0, ArrayInt64_1.isStrictlySmaller64)(this.min, unsafeValue) && (0, ArrayInt64_1.isStrictlySmaller64)(unsafeValue, this.max) || (0, ArrayInt64_1.isEqual64)(this.min, unsafeValue) || (0, ArrayInt64_1.isEqual64)(this.max, unsafeValue));
        }
        shrinkArrayInt64(value, target, tryTargetAsap) {
          const realGap = (0, ArrayInt64_1.substract64)(value, target);
          function* shrinkGen() {
            let previous = tryTargetAsap ? void 0 : target;
            const gap = tryTargetAsap ? realGap : (0, ArrayInt64_1.halve64)(realGap);
            for (let toremove = gap; !(0, ArrayInt64_1.isZero64)(toremove); toremove = (0, ArrayInt64_1.halve64)(toremove)) {
              const next = (0, ArrayInt64_1.substract64)(value, toremove);
              yield new Value_1.Value(next, previous);
              previous = next;
            }
          }
          return (0, Stream_1.stream)(shrinkGen());
        }
        shrink(current, context) {
          if (!_ArrayInt64Arbitrary.isValidContext(current, context)) {
            const target = this.defaultTarget();
            return this.shrinkArrayInt64(current, target, true);
          }
          if (this.isLastChanceTry(current, context)) {
            return Stream_1.Stream.of(new Value_1.Value(context, void 0));
          }
          return this.shrinkArrayInt64(current, context, false);
        }
        defaultTarget() {
          if (!(0, ArrayInt64_1.isStrictlyPositive64)(this.min) && !(0, ArrayInt64_1.isStrictlyNegative64)(this.max)) {
            return ArrayInt64_1.Zero64;
          }
          return (0, ArrayInt64_1.isStrictlyNegative64)(this.min) ? this.max : this.min;
        }
        isLastChanceTry(current, context) {
          if ((0, ArrayInt64_1.isZero64)(current)) {
            return false;
          }
          if (current.sign === 1) {
            return (0, ArrayInt64_1.isEqual64)(current, (0, ArrayInt64_1.add64)(context, ArrayInt64_1.Unit64)) && (0, ArrayInt64_1.isStrictlyPositive64)((0, ArrayInt64_1.substract64)(current, this.min));
          } else {
            return (0, ArrayInt64_1.isEqual64)(current, (0, ArrayInt64_1.substract64)(context, ArrayInt64_1.Unit64)) && (0, ArrayInt64_1.isStrictlyNegative64)((0, ArrayInt64_1.substract64)(current, this.max));
          }
        }
        static isValidContext(_current, context) {
          if (context === void 0) {
            return false;
          }
          if (typeof context !== "object" || context === null || !("sign" in context) || !("data" in context)) {
            throw new Error(`Invalid context type passed to ArrayInt64Arbitrary (#1)`);
          }
          return true;
        }
        retrieveBiasedRanges() {
          if (this.biasedRanges != null) {
            return this.biasedRanges;
          }
          if ((0, ArrayInt64_1.isEqual64)(this.min, this.max)) {
            this.biasedRanges = [{ min: this.min, max: this.max }];
            return this.biasedRanges;
          }
          const minStrictlySmallerZero = (0, ArrayInt64_1.isStrictlyNegative64)(this.min);
          const maxStrictlyGreaterZero = (0, ArrayInt64_1.isStrictlyPositive64)(this.max);
          if (minStrictlySmallerZero && maxStrictlyGreaterZero) {
            const logMin = (0, ArrayInt64_1.logLike64)(this.min);
            const logMax = (0, ArrayInt64_1.logLike64)(this.max);
            this.biasedRanges = [
              { min: logMin, max: logMax },
              { min: (0, ArrayInt64_1.substract64)(this.max, logMax), max: this.max },
              { min: this.min, max: (0, ArrayInt64_1.substract64)(this.min, logMin) }
            ];
          } else {
            const logGap = (0, ArrayInt64_1.logLike64)((0, ArrayInt64_1.substract64)(this.max, this.min));
            const arbCloseToMin = { min: this.min, max: (0, ArrayInt64_1.add64)(this.min, logGap) };
            const arbCloseToMax = { min: (0, ArrayInt64_1.substract64)(this.max, logGap), max: this.max };
            this.biasedRanges = minStrictlySmallerZero ? [arbCloseToMax, arbCloseToMin] : [arbCloseToMin, arbCloseToMax];
          }
          return this.biasedRanges;
        }
      };
      function arrayInt64(min, max) {
        const arb = new ArrayInt64Arbitrary(min, max);
        return arb;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/DoubleHelpers.js
  var require_DoubleHelpers = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/DoubleHelpers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.decomposeDouble = decomposeDouble;
      exports.doubleToIndex = doubleToIndex;
      exports.indexToDouble = indexToDouble;
      var ArrayInt64_1 = require_ArrayInt64();
      var safeNegativeInfinity = Number.NEGATIVE_INFINITY;
      var safePositiveInfinity = Number.POSITIVE_INFINITY;
      var safeEpsilon = Number.EPSILON;
      var INDEX_POSITIVE_INFINITY = { sign: 1, data: [2146435072, 0] };
      var INDEX_NEGATIVE_INFINITY = { sign: -1, data: [2146435072, 1] };
      var f64 = new Float64Array(1);
      var u32 = new Uint32Array(f64.buffer, f64.byteOffset);
      function bitCastDoubleToUInt64(f) {
        f64[0] = f;
        return [u32[1], u32[0]];
      }
      function decomposeDouble(d) {
        const { 0: hi, 1: lo } = bitCastDoubleToUInt64(d);
        const signBit = hi >>> 31;
        const exponentBits = hi >>> 20 & 2047;
        const significandBits = (hi & 1048575) * 4294967296 + lo;
        const exponent = exponentBits === 0 ? -1022 : exponentBits - 1023;
        let significand = exponentBits === 0 ? 0 : 1;
        significand += significandBits / 2 ** 52;
        significand *= signBit === 0 ? 1 : -1;
        return { exponent, significand };
      }
      function positiveNumberToInt64(n) {
        return [~~(n / 4294967296), n >>> 0];
      }
      function indexInDoubleFromDecomp(exponent, significand) {
        if (exponent === -1022) {
          const rescaledSignificand2 = significand * 2 ** 52;
          return positiveNumberToInt64(rescaledSignificand2);
        }
        const rescaledSignificand = (significand - 1) * 2 ** 52;
        const exponentOnlyHigh = (exponent + 1023) * 2 ** 20;
        const index = positiveNumberToInt64(rescaledSignificand);
        index[0] += exponentOnlyHigh;
        return index;
      }
      function doubleToIndex(d) {
        if (d === safePositiveInfinity) {
          return (0, ArrayInt64_1.clone64)(INDEX_POSITIVE_INFINITY);
        }
        if (d === safeNegativeInfinity) {
          return (0, ArrayInt64_1.clone64)(INDEX_NEGATIVE_INFINITY);
        }
        const decomp = decomposeDouble(d);
        const exponent = decomp.exponent;
        const significand = decomp.significand;
        if (d > 0 || d === 0 && 1 / d === safePositiveInfinity) {
          return { sign: 1, data: indexInDoubleFromDecomp(exponent, significand) };
        } else {
          const indexOpposite = indexInDoubleFromDecomp(exponent, -significand);
          if (indexOpposite[1] === 4294967295) {
            indexOpposite[0] += 1;
            indexOpposite[1] = 0;
          } else {
            indexOpposite[1] += 1;
          }
          return { sign: -1, data: indexOpposite };
        }
      }
      function indexToDouble(index) {
        if (index.sign === -1) {
          const indexOpposite = { sign: 1, data: [index.data[0], index.data[1]] };
          if (indexOpposite.data[1] === 0) {
            indexOpposite.data[0] -= 1;
            indexOpposite.data[1] = 4294967295;
          } else {
            indexOpposite.data[1] -= 1;
          }
          return -indexToDouble(indexOpposite);
        }
        if ((0, ArrayInt64_1.isEqual64)(index, INDEX_POSITIVE_INFINITY)) {
          return safePositiveInfinity;
        }
        if (index.data[0] < 2097152) {
          return (index.data[0] * 4294967296 + index.data[1]) * 2 ** -1074;
        }
        const postIndexHigh = index.data[0] - 2097152;
        const exponent = -1021 + (postIndexHigh >> 20);
        const significand = 1 + ((postIndexHigh & 1048575) * 2 ** 32 + index.data[1]) * safeEpsilon;
        return significand * 2 ** exponent;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/FloatingOnlyHelpers.js
  var require_FloatingOnlyHelpers = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/FloatingOnlyHelpers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.refineConstraintsForFloatingOnly = refineConstraintsForFloatingOnly;
      var safeNumberIsInteger = Number.isInteger;
      var safeObjectIs = Object.is;
      var safeNegativeInfinity = Number.NEGATIVE_INFINITY;
      var safePositiveInfinity = Number.POSITIVE_INFINITY;
      function refineConstraintsForFloatingOnly(constraints, maxValue, maxNonIntegerValue, onlyIntegersAfterThisValue) {
        const { noDefaultInfinity = false, minExcluded = false, maxExcluded = false, min = noDefaultInfinity ? -maxValue : safeNegativeInfinity, max = noDefaultInfinity ? maxValue : safePositiveInfinity } = constraints;
        const effectiveMin = minExcluded ? min < -maxNonIntegerValue ? -onlyIntegersAfterThisValue : Math.max(min, -maxNonIntegerValue) : min === safeNegativeInfinity ? Math.max(min, -onlyIntegersAfterThisValue) : Math.max(min, -maxNonIntegerValue);
        const effectiveMax = maxExcluded ? max > maxNonIntegerValue ? onlyIntegersAfterThisValue : Math.min(max, maxNonIntegerValue) : max === safePositiveInfinity ? Math.min(max, onlyIntegersAfterThisValue) : Math.min(max, maxNonIntegerValue);
        const fullConstraints = {
          noDefaultInfinity: false,
          minExcluded: minExcluded || (min !== safeNegativeInfinity || minExcluded) && safeNumberIsInteger(effectiveMin),
          maxExcluded: maxExcluded || (max !== safePositiveInfinity || maxExcluded) && safeNumberIsInteger(effectiveMax),
          min: safeObjectIs(effectiveMin, -0) ? 0 : effectiveMin,
          max: safeObjectIs(effectiveMax, 0) ? -0 : effectiveMax,
          noNaN: constraints.noNaN || false
        };
        return fullConstraints;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/DoubleOnlyHelpers.js
  var require_DoubleOnlyHelpers = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/DoubleOnlyHelpers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.onlyIntegersAfterThisValue = exports.maxNonIntegerValue = void 0;
      exports.refineConstraintsForDoubleOnly = refineConstraintsForDoubleOnly;
      exports.doubleOnlyMapper = doubleOnlyMapper;
      exports.doubleOnlyUnmapper = doubleOnlyUnmapper;
      var FloatingOnlyHelpers_1 = require_FloatingOnlyHelpers();
      var safeNegativeInfinity = Number.NEGATIVE_INFINITY;
      var safePositiveInfinity = Number.POSITIVE_INFINITY;
      var safeMaxValue = Number.MAX_VALUE;
      exports.maxNonIntegerValue = 45035996273704955e-1;
      exports.onlyIntegersAfterThisValue = 4503599627370496;
      function refineConstraintsForDoubleOnly(constraints) {
        return (0, FloatingOnlyHelpers_1.refineConstraintsForFloatingOnly)(constraints, safeMaxValue, exports.maxNonIntegerValue, exports.onlyIntegersAfterThisValue);
      }
      function doubleOnlyMapper(value) {
        return value === exports.onlyIntegersAfterThisValue ? safePositiveInfinity : value === -exports.onlyIntegersAfterThisValue ? safeNegativeInfinity : value;
      }
      function doubleOnlyUnmapper(value) {
        if (typeof value !== "number")
          throw new Error("Unsupported type");
        return value === safePositiveInfinity ? exports.onlyIntegersAfterThisValue : value === safeNegativeInfinity ? -exports.onlyIntegersAfterThisValue : value;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/double.js
  var require_double = __commonJS({
    "node_modules/fast-check/lib/arbitrary/double.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.double = double;
      var ArrayInt64_1 = require_ArrayInt64();
      var ArrayInt64Arbitrary_1 = require_ArrayInt64Arbitrary();
      var DoubleHelpers_1 = require_DoubleHelpers();
      var DoubleOnlyHelpers_1 = require_DoubleOnlyHelpers();
      var safeNumberIsInteger = Number.isInteger;
      var safeNumberIsNaN = Number.isNaN;
      var safeNegativeInfinity = Number.NEGATIVE_INFINITY;
      var safePositiveInfinity = Number.POSITIVE_INFINITY;
      var safeMaxValue = Number.MAX_VALUE;
      var safeNaN = Number.NaN;
      function safeDoubleToIndex(d, constraintsLabel) {
        if (safeNumberIsNaN(d)) {
          throw new Error("fc.double constraints." + constraintsLabel + " must be a 64-bit float");
        }
        return (0, DoubleHelpers_1.doubleToIndex)(d);
      }
      function unmapperDoubleToIndex(value) {
        if (typeof value !== "number")
          throw new Error("Unsupported type");
        return (0, DoubleHelpers_1.doubleToIndex)(value);
      }
      function numberIsNotInteger(value) {
        return !safeNumberIsInteger(value);
      }
      function anyDouble(constraints) {
        const { noDefaultInfinity = false, noNaN = false, minExcluded = false, maxExcluded = false, min = noDefaultInfinity ? -safeMaxValue : safeNegativeInfinity, max = noDefaultInfinity ? safeMaxValue : safePositiveInfinity } = constraints;
        const minIndexRaw = safeDoubleToIndex(min, "min");
        const minIndex = minExcluded ? (0, ArrayInt64_1.add64)(minIndexRaw, ArrayInt64_1.Unit64) : minIndexRaw;
        const maxIndexRaw = safeDoubleToIndex(max, "max");
        const maxIndex = maxExcluded ? (0, ArrayInt64_1.substract64)(maxIndexRaw, ArrayInt64_1.Unit64) : maxIndexRaw;
        if ((0, ArrayInt64_1.isStrictlySmaller64)(maxIndex, minIndex)) {
          throw new Error("fc.double constraints.min must be smaller or equal to constraints.max");
        }
        if (noNaN) {
          return (0, ArrayInt64Arbitrary_1.arrayInt64)(minIndex, maxIndex).map(DoubleHelpers_1.indexToDouble, unmapperDoubleToIndex);
        }
        const positiveMaxIdx = (0, ArrayInt64_1.isStrictlyPositive64)(maxIndex);
        const minIndexWithNaN = positiveMaxIdx ? minIndex : (0, ArrayInt64_1.substract64)(minIndex, ArrayInt64_1.Unit64);
        const maxIndexWithNaN = positiveMaxIdx ? (0, ArrayInt64_1.add64)(maxIndex, ArrayInt64_1.Unit64) : maxIndex;
        return (0, ArrayInt64Arbitrary_1.arrayInt64)(minIndexWithNaN, maxIndexWithNaN).map((index) => {
          if ((0, ArrayInt64_1.isStrictlySmaller64)(maxIndex, index) || (0, ArrayInt64_1.isStrictlySmaller64)(index, minIndex))
            return safeNaN;
          else
            return (0, DoubleHelpers_1.indexToDouble)(index);
        }, (value) => {
          if (typeof value !== "number")
            throw new Error("Unsupported type");
          if (safeNumberIsNaN(value))
            return !(0, ArrayInt64_1.isEqual64)(maxIndex, maxIndexWithNaN) ? maxIndexWithNaN : minIndexWithNaN;
          return (0, DoubleHelpers_1.doubleToIndex)(value);
        });
      }
      function double(constraints = {}) {
        if (!constraints.noInteger) {
          return anyDouble(constraints);
        }
        return anyDouble((0, DoubleOnlyHelpers_1.refineConstraintsForDoubleOnly)(constraints)).map(DoubleOnlyHelpers_1.doubleOnlyMapper, DoubleOnlyHelpers_1.doubleOnlyUnmapper).filter(numberIsNotInteger);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/FloatHelpers.js
  var require_FloatHelpers = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/FloatHelpers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.EPSILON_32 = exports.MAX_VALUE_32 = exports.MIN_VALUE_32 = void 0;
      exports.decomposeFloat = decomposeFloat;
      exports.floatToIndex = floatToIndex;
      exports.indexToFloat = indexToFloat;
      var safeNegativeInfinity = Number.NEGATIVE_INFINITY;
      var safePositiveInfinity = Number.POSITIVE_INFINITY;
      exports.MIN_VALUE_32 = 2 ** -126 * 2 ** -23;
      exports.MAX_VALUE_32 = 2 ** 127 * (1 + (2 ** 23 - 1) / 2 ** 23);
      exports.EPSILON_32 = 2 ** -23;
      var INDEX_POSITIVE_INFINITY = 2139095040;
      var INDEX_NEGATIVE_INFINITY = -2139095041;
      var f32 = new Float32Array(1);
      var u32 = new Uint32Array(f32.buffer, f32.byteOffset);
      function bitCastFloatToUInt32(f) {
        f32[0] = f;
        return u32[0];
      }
      function decomposeFloat(f) {
        const bits = bitCastFloatToUInt32(f);
        const signBit = bits >>> 31;
        const exponentBits = bits >>> 23 & 255;
        const significandBits = bits & 8388607;
        const exponent = exponentBits === 0 ? -126 : exponentBits - 127;
        let significand = exponentBits === 0 ? 0 : 1;
        significand += significandBits / 2 ** 23;
        significand *= signBit === 0 ? 1 : -1;
        return { exponent, significand };
      }
      function indexInFloatFromDecomp(exponent, significand) {
        if (exponent === -126) {
          return significand * 8388608;
        }
        return (exponent + 127) * 8388608 + (significand - 1) * 8388608;
      }
      function floatToIndex(f) {
        if (f === safePositiveInfinity) {
          return INDEX_POSITIVE_INFINITY;
        }
        if (f === safeNegativeInfinity) {
          return INDEX_NEGATIVE_INFINITY;
        }
        const decomp = decomposeFloat(f);
        const exponent = decomp.exponent;
        const significand = decomp.significand;
        if (f > 0 || f === 0 && 1 / f === safePositiveInfinity) {
          return indexInFloatFromDecomp(exponent, significand);
        } else {
          return -indexInFloatFromDecomp(exponent, -significand) - 1;
        }
      }
      function indexToFloat(index) {
        if (index < 0) {
          return -indexToFloat(-index - 1);
        }
        if (index === INDEX_POSITIVE_INFINITY) {
          return safePositiveInfinity;
        }
        if (index < 16777216) {
          return index * 2 ** -149;
        }
        const postIndex = index - 16777216;
        const exponent = -125 + (postIndex >> 23);
        const significand = 1 + (postIndex & 8388607) / 8388608;
        return significand * 2 ** exponent;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/FloatOnlyHelpers.js
  var require_FloatOnlyHelpers = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/FloatOnlyHelpers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.onlyIntegersAfterThisValue = exports.maxNonIntegerValue = void 0;
      exports.refineConstraintsForFloatOnly = refineConstraintsForFloatOnly;
      exports.floatOnlyMapper = floatOnlyMapper;
      exports.floatOnlyUnmapper = floatOnlyUnmapper;
      var FloatHelpers_1 = require_FloatHelpers();
      var FloatingOnlyHelpers_1 = require_FloatingOnlyHelpers();
      var safeNegativeInfinity = Number.NEGATIVE_INFINITY;
      var safePositiveInfinity = Number.POSITIVE_INFINITY;
      var safeMaxValue = FloatHelpers_1.MAX_VALUE_32;
      exports.maxNonIntegerValue = 83886075e-1;
      exports.onlyIntegersAfterThisValue = 8388608;
      function refineConstraintsForFloatOnly(constraints) {
        return (0, FloatingOnlyHelpers_1.refineConstraintsForFloatingOnly)(constraints, safeMaxValue, exports.maxNonIntegerValue, exports.onlyIntegersAfterThisValue);
      }
      function floatOnlyMapper(value) {
        return value === exports.onlyIntegersAfterThisValue ? safePositiveInfinity : value === -exports.onlyIntegersAfterThisValue ? safeNegativeInfinity : value;
      }
      function floatOnlyUnmapper(value) {
        if (typeof value !== "number")
          throw new Error("Unsupported type");
        return value === safePositiveInfinity ? exports.onlyIntegersAfterThisValue : value === safeNegativeInfinity ? -exports.onlyIntegersAfterThisValue : value;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/float.js
  var require_float = __commonJS({
    "node_modules/fast-check/lib/arbitrary/float.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.float = float;
      var integer_1 = require_integer();
      var FloatHelpers_1 = require_FloatHelpers();
      var FloatOnlyHelpers_1 = require_FloatOnlyHelpers();
      var safeNumberIsInteger = Number.isInteger;
      var safeNumberIsNaN = Number.isNaN;
      var safeMathFround = Math.fround;
      var safeNegativeInfinity = Number.NEGATIVE_INFINITY;
      var safePositiveInfinity = Number.POSITIVE_INFINITY;
      var safeNaN = Number.NaN;
      function safeFloatToIndex(f, constraintsLabel) {
        const conversionTrick = "you can convert any double to a 32-bit float by using `Math.fround(myDouble)`";
        const errorMessage = "fc.float constraints." + constraintsLabel + " must be a 32-bit float - " + conversionTrick;
        if (safeNumberIsNaN(f) || safeMathFround(f) !== f) {
          throw new Error(errorMessage);
        }
        return (0, FloatHelpers_1.floatToIndex)(f);
      }
      function unmapperFloatToIndex(value) {
        if (typeof value !== "number")
          throw new Error("Unsupported type");
        return (0, FloatHelpers_1.floatToIndex)(value);
      }
      function numberIsNotInteger(value) {
        return !safeNumberIsInteger(value);
      }
      function anyFloat(constraints) {
        const { noDefaultInfinity = false, noNaN = false, minExcluded = false, maxExcluded = false, min = noDefaultInfinity ? -FloatHelpers_1.MAX_VALUE_32 : safeNegativeInfinity, max = noDefaultInfinity ? FloatHelpers_1.MAX_VALUE_32 : safePositiveInfinity } = constraints;
        const minIndexRaw = safeFloatToIndex(min, "min");
        const minIndex = minExcluded ? minIndexRaw + 1 : minIndexRaw;
        const maxIndexRaw = safeFloatToIndex(max, "max");
        const maxIndex = maxExcluded ? maxIndexRaw - 1 : maxIndexRaw;
        if (minIndex > maxIndex) {
          throw new Error("fc.float constraints.min must be smaller or equal to constraints.max");
        }
        if (noNaN) {
          return (0, integer_1.integer)({ min: minIndex, max: maxIndex }).map(FloatHelpers_1.indexToFloat, unmapperFloatToIndex);
        }
        const minIndexWithNaN = maxIndex > 0 ? minIndex : minIndex - 1;
        const maxIndexWithNaN = maxIndex > 0 ? maxIndex + 1 : maxIndex;
        return (0, integer_1.integer)({ min: minIndexWithNaN, max: maxIndexWithNaN }).map((index) => {
          if (index > maxIndex || index < minIndex)
            return safeNaN;
          else
            return (0, FloatHelpers_1.indexToFloat)(index);
        }, (value) => {
          if (typeof value !== "number")
            throw new Error("Unsupported type");
          if (safeNumberIsNaN(value))
            return maxIndex !== maxIndexWithNaN ? maxIndexWithNaN : minIndexWithNaN;
          return (0, FloatHelpers_1.floatToIndex)(value);
        });
      }
      function float(constraints = {}) {
        if (!constraints.noInteger) {
          return anyFloat(constraints);
        }
        return anyFloat((0, FloatOnlyHelpers_1.refineConstraintsForFloatOnly)(constraints)).map(FloatOnlyHelpers_1.floatOnlyMapper, FloatOnlyHelpers_1.floatOnlyUnmapper).filter(numberIsNotInteger);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/TextEscaper.js
  var require_TextEscaper = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/TextEscaper.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.escapeForTemplateString = escapeForTemplateString;
      exports.escapeForMultilineComments = escapeForMultilineComments;
      function escapeForTemplateString(originalText) {
        return originalText.replace(/([$`\\])/g, "\\$1").replace(/\r/g, "\\r");
      }
      function escapeForMultilineComments(originalText) {
        return originalText.replace(/\*\//g, "*\\/");
      }
    }
  });

  // node_modules/fast-check/lib/utils/hash.js
  var require_hash = __commonJS({
    "node_modules/fast-check/lib/utils/hash.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.hash = hash;
      var globals_1 = require_globals();
      var crc32Table = [
        0,
        1996959894,
        3993919788,
        2567524794,
        124634137,
        1886057615,
        3915621685,
        2657392035,
        249268274,
        2044508324,
        3772115230,
        2547177864,
        162941995,
        2125561021,
        3887607047,
        2428444049,
        498536548,
        1789927666,
        4089016648,
        2227061214,
        450548861,
        1843258603,
        4107580753,
        2211677639,
        325883990,
        1684777152,
        4251122042,
        2321926636,
        335633487,
        1661365465,
        4195302755,
        2366115317,
        997073096,
        1281953886,
        3579855332,
        2724688242,
        1006888145,
        1258607687,
        3524101629,
        2768942443,
        901097722,
        1119000684,
        3686517206,
        2898065728,
        853044451,
        1172266101,
        3705015759,
        2882616665,
        651767980,
        1373503546,
        3369554304,
        3218104598,
        565507253,
        1454621731,
        3485111705,
        3099436303,
        671266974,
        1594198024,
        3322730930,
        2970347812,
        795835527,
        1483230225,
        3244367275,
        3060149565,
        1994146192,
        31158534,
        2563907772,
        4023717930,
        1907459465,
        112637215,
        2680153253,
        3904427059,
        2013776290,
        251722036,
        2517215374,
        3775830040,
        2137656763,
        141376813,
        2439277719,
        3865271297,
        1802195444,
        476864866,
        2238001368,
        4066508878,
        1812370925,
        453092731,
        2181625025,
        4111451223,
        1706088902,
        314042704,
        2344532202,
        4240017532,
        1658658271,
        366619977,
        2362670323,
        4224994405,
        1303535960,
        984961486,
        2747007092,
        3569037538,
        1256170817,
        1037604311,
        2765210733,
        3554079995,
        1131014506,
        879679996,
        2909243462,
        3663771856,
        1141124467,
        855842277,
        2852801631,
        3708648649,
        1342533948,
        654459306,
        3188396048,
        3373015174,
        1466479909,
        544179635,
        3110523913,
        3462522015,
        1591671054,
        702138776,
        2966460450,
        3352799412,
        1504918807,
        783551873,
        3082640443,
        3233442989,
        3988292384,
        2596254646,
        62317068,
        1957810842,
        3939845945,
        2647816111,
        81470997,
        1943803523,
        3814918930,
        2489596804,
        225274430,
        2053790376,
        3826175755,
        2466906013,
        167816743,
        2097651377,
        4027552580,
        2265490386,
        503444072,
        1762050814,
        4150417245,
        2154129355,
        426522225,
        1852507879,
        4275313526,
        2312317920,
        282753626,
        1742555852,
        4189708143,
        2394877945,
        397917763,
        1622183637,
        3604390888,
        2714866558,
        953729732,
        1340076626,
        3518719985,
        2797360999,
        1068828381,
        1219638859,
        3624741850,
        2936675148,
        906185462,
        1090812512,
        3747672003,
        2825379669,
        829329135,
        1181335161,
        3412177804,
        3160834842,
        628085408,
        1382605366,
        3423369109,
        3138078467,
        570562233,
        1426400815,
        3317316542,
        2998733608,
        733239954,
        1555261956,
        3268935591,
        3050360625,
        752459403,
        1541320221,
        2607071920,
        3965973030,
        1969922972,
        40735498,
        2617837225,
        3943577151,
        1913087877,
        83908371,
        2512341634,
        3803740692,
        2075208622,
        213261112,
        2463272603,
        3855990285,
        2094854071,
        198958881,
        2262029012,
        4057260610,
        1759359992,
        534414190,
        2176718541,
        4139329115,
        1873836001,
        414664567,
        2282248934,
        4279200368,
        1711684554,
        285281116,
        2405801727,
        4167216745,
        1634467795,
        376229701,
        2685067896,
        3608007406,
        1308918612,
        956543938,
        2808555105,
        3495958263,
        1231636301,
        1047427035,
        2932959818,
        3654703836,
        1088359270,
        936918e3,
        2847714899,
        3736837829,
        1202900863,
        817233897,
        3183342108,
        3401237130,
        1404277552,
        615818150,
        3134207493,
        3453421203,
        1423857449,
        601450431,
        3009837614,
        3294710456,
        1567103746,
        711928724,
        3020668471,
        3272380065,
        1510334235,
        755167117
      ];
      function hash(repr) {
        let crc = 4294967295;
        for (let idx = 0; idx < repr.length; ++idx) {
          const c = (0, globals_1.safeCharCodeAt)(repr, idx);
          if (c < 128) {
            crc = crc32Table[crc & 255 ^ c] ^ crc >> 8;
          } else if (c < 2048) {
            crc = crc32Table[crc & 255 ^ (192 | c >> 6 & 31)] ^ crc >> 8;
            crc = crc32Table[crc & 255 ^ (128 | c & 63)] ^ crc >> 8;
          } else if (c >= 55296 && c < 57344) {
            const cNext = (0, globals_1.safeCharCodeAt)(repr, ++idx);
            if (c >= 56320 || cNext < 56320 || cNext > 57343 || Number.isNaN(cNext)) {
              idx -= 1;
              crc = crc32Table[crc & 255 ^ 239] ^ crc >> 8;
              crc = crc32Table[crc & 255 ^ 191] ^ crc >> 8;
              crc = crc32Table[crc & 255 ^ 189] ^ crc >> 8;
            } else {
              const c1 = (c & 1023) + 64;
              const c2 = cNext & 1023;
              crc = crc32Table[crc & 255 ^ (240 | c1 >> 8 & 7)] ^ crc >> 8;
              crc = crc32Table[crc & 255 ^ (128 | c1 >> 2 & 63)] ^ crc >> 8;
              crc = crc32Table[crc & 255 ^ (128 | c2 >> 6 & 15 | (c1 & 3) << 4)] ^ crc >> 8;
              crc = crc32Table[crc & 255 ^ (128 | c2 & 63)] ^ crc >> 8;
            }
          } else {
            crc = crc32Table[crc & 255 ^ (224 | c >> 12 & 15)] ^ crc >> 8;
            crc = crc32Table[crc & 255 ^ (128 | c >> 6 & 63)] ^ crc >> 8;
            crc = crc32Table[crc & 255 ^ (128 | c & 63)] ^ crc >> 8;
          }
        }
        return (crc | 0) + 2147483648;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/noShrink.js
  var require_noShrink = __commonJS({
    "node_modules/fast-check/lib/arbitrary/noShrink.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.noShrink = noShrink;
      function noShrink(arb) {
        return arb.noShrink();
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/CompareFunctionArbitraryBuilder.js
  var require_CompareFunctionArbitraryBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/CompareFunctionArbitraryBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildCompareFunctionArbitrary = buildCompareFunctionArbitrary;
      var TextEscaper_1 = require_TextEscaper();
      var symbols_1 = require_symbols();
      var hash_1 = require_hash();
      var stringify_1 = require_stringify();
      var integer_1 = require_integer();
      var noShrink_1 = require_noShrink();
      var tuple_1 = require_tuple();
      var globals_1 = require_globals();
      var safeObjectAssign = Object.assign;
      var safeObjectKeys = Object.keys;
      function buildCompareFunctionArbitrary(cmp) {
        return (0, tuple_1.tuple)((0, noShrink_1.noShrink)((0, integer_1.integer)()), (0, noShrink_1.noShrink)((0, integer_1.integer)({ min: 1, max: 4294967295 }))).map(([seed, hashEnvSize]) => {
          const producer = () => {
            const recorded = {};
            const f = (a, b) => {
              const reprA = (0, stringify_1.stringify)(a);
              const reprB = (0, stringify_1.stringify)(b);
              const hA = (0, hash_1.hash)(`${seed}${reprA}`) % hashEnvSize;
              const hB = (0, hash_1.hash)(`${seed}${reprB}`) % hashEnvSize;
              const val = cmp(hA, hB);
              recorded[`[${reprA},${reprB}]`] = val;
              return val;
            };
            return safeObjectAssign(f, {
              toString: () => {
                const seenValues = safeObjectKeys(recorded).sort().map((k) => `${k} => ${(0, stringify_1.stringify)(recorded[k])}`).map((line) => `/* ${(0, TextEscaper_1.escapeForMultilineComments)(line)} */`);
                return `function(a, b) {
  // With hash and stringify coming from fast-check${seenValues.length !== 0 ? `
  ${(0, globals_1.safeJoin)(seenValues, "\n  ")}` : ""}
  const cmp = ${cmp};
  const hA = hash('${seed}' + stringify(a)) % ${hashEnvSize};
  const hB = hash('${seed}' + stringify(b)) % ${hashEnvSize};
  return cmp(hA, hB);
}`;
              },
              [symbols_1.cloneMethod]: producer
            });
          };
          return producer();
        });
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/compareBooleanFunc.js
  var require_compareBooleanFunc = __commonJS({
    "node_modules/fast-check/lib/arbitrary/compareBooleanFunc.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.compareBooleanFunc = compareBooleanFunc;
      var CompareFunctionArbitraryBuilder_1 = require_CompareFunctionArbitraryBuilder();
      var safeObjectAssign = Object.assign;
      function compareBooleanFunc() {
        return (0, CompareFunctionArbitraryBuilder_1.buildCompareFunctionArbitrary)(safeObjectAssign((hA, hB) => hA < hB, {
          toString() {
            return "(hA, hB) => hA < hB";
          }
        }));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/compareFunc.js
  var require_compareFunc = __commonJS({
    "node_modules/fast-check/lib/arbitrary/compareFunc.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.compareFunc = compareFunc;
      var CompareFunctionArbitraryBuilder_1 = require_CompareFunctionArbitraryBuilder();
      var safeObjectAssign = Object.assign;
      function compareFunc() {
        return (0, CompareFunctionArbitraryBuilder_1.buildCompareFunctionArbitrary)(safeObjectAssign((hA, hB) => hA - hB, {
          toString() {
            return "(hA, hB) => hA - hB";
          }
        }));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/func.js
  var require_func = __commonJS({
    "node_modules/fast-check/lib/arbitrary/func.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.func = func;
      var hash_1 = require_hash();
      var stringify_1 = require_stringify();
      var symbols_1 = require_symbols();
      var array_1 = require_array();
      var integer_1 = require_integer();
      var noShrink_1 = require_noShrink();
      var tuple_1 = require_tuple();
      var TextEscaper_1 = require_TextEscaper();
      var globals_1 = require_globals();
      var safeObjectDefineProperties = Object.defineProperties;
      var safeObjectKeys = Object.keys;
      function func(arb) {
        return (0, tuple_1.tuple)((0, array_1.array)(arb, { minLength: 1 }), (0, noShrink_1.noShrink)((0, integer_1.integer)())).map(([outs, seed]) => {
          const producer = () => {
            const recorded = {};
            const f = (...args) => {
              const repr = (0, stringify_1.stringify)(args);
              const val = outs[(0, hash_1.hash)(`${seed}${repr}`) % outs.length];
              recorded[repr] = val;
              return (0, symbols_1.hasCloneMethod)(val) ? val[symbols_1.cloneMethod]() : val;
            };
            function prettyPrint(stringifiedOuts) {
              const seenValues = (0, globals_1.safeMap)((0, globals_1.safeMap)((0, globals_1.safeSort)(safeObjectKeys(recorded)), (k) => `${k} => ${(0, stringify_1.stringify)(recorded[k])}`), (line) => `/* ${(0, TextEscaper_1.escapeForMultilineComments)(line)} */`);
              return `function(...args) {
  // With hash and stringify coming from fast-check${seenValues.length !== 0 ? `
  ${seenValues.join("\n  ")}` : ""}
  const outs = ${stringifiedOuts};
  return outs[hash('${seed}' + stringify(args)) % outs.length];
}`;
            }
            return safeObjectDefineProperties(f, {
              toString: { value: () => prettyPrint((0, stringify_1.stringify)(outs)) },
              [stringify_1.toStringMethod]: { value: () => prettyPrint((0, stringify_1.stringify)(outs)) },
              [stringify_1.asyncToStringMethod]: { value: async () => prettyPrint(await (0, stringify_1.asyncStringify)(outs)) },
              [symbols_1.cloneMethod]: { value: producer, configurable: true }
            });
          };
          return producer();
        });
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/maxSafeInteger.js
  var require_maxSafeInteger = __commonJS({
    "node_modules/fast-check/lib/arbitrary/maxSafeInteger.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.maxSafeInteger = maxSafeInteger;
      var IntegerArbitrary_1 = require_IntegerArbitrary();
      var safeMinSafeInteger = Number.MIN_SAFE_INTEGER;
      var safeMaxSafeInteger = Number.MAX_SAFE_INTEGER;
      function maxSafeInteger() {
        return new IntegerArbitrary_1.IntegerArbitrary(safeMinSafeInteger, safeMaxSafeInteger);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/maxSafeNat.js
  var require_maxSafeNat = __commonJS({
    "node_modules/fast-check/lib/arbitrary/maxSafeNat.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.maxSafeNat = maxSafeNat;
      var IntegerArbitrary_1 = require_IntegerArbitrary();
      var safeMaxSafeInteger = Number.MAX_SAFE_INTEGER;
      function maxSafeNat() {
        return new IntegerArbitrary_1.IntegerArbitrary(0, safeMaxSafeInteger);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/NatToStringifiedNat.js
  var require_NatToStringifiedNat = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/NatToStringifiedNat.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.natToStringifiedNatMapper = natToStringifiedNatMapper;
      exports.tryParseStringifiedNat = tryParseStringifiedNat;
      exports.natToStringifiedNatUnmapper = natToStringifiedNatUnmapper;
      var globals_1 = require_globals();
      var safeNumberParseInt = Number.parseInt;
      function natToStringifiedNatMapper(options) {
        const [style, v] = options;
        switch (style) {
          case "oct":
            return `0${(0, globals_1.safeNumberToString)(v, 8)}`;
          case "hex":
            return `0x${(0, globals_1.safeNumberToString)(v, 16)}`;
          case "dec":
          default:
            return `${v}`;
        }
      }
      function tryParseStringifiedNat(stringValue, radix) {
        const parsedNat = safeNumberParseInt(stringValue, radix);
        if ((0, globals_1.safeNumberToString)(parsedNat, radix) !== stringValue) {
          throw new Error("Invalid value");
        }
        return parsedNat;
      }
      function natToStringifiedNatUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Invalid type");
        }
        if (value.length >= 2 && value[0] === "0") {
          if (value[1] === "x") {
            return ["hex", tryParseStringifiedNat((0, globals_1.safeSubstring)(value, 2), 16)];
          }
          return ["oct", tryParseStringifiedNat((0, globals_1.safeSubstring)(value, 1), 8)];
        }
        return ["dec", tryParseStringifiedNat(value, 10)];
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/ipV4.js
  var require_ipV4 = __commonJS({
    "node_modules/fast-check/lib/arbitrary/ipV4.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ipV4 = ipV4;
      var globals_1 = require_globals();
      var nat_1 = require_nat();
      var tuple_1 = require_tuple();
      var NatToStringifiedNat_1 = require_NatToStringifiedNat();
      function dotJoinerMapper(data) {
        return (0, globals_1.safeJoin)(data, ".");
      }
      function dotJoinerUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Invalid type");
        }
        return (0, globals_1.safeMap)((0, globals_1.safeSplit)(value, "."), (v) => (0, NatToStringifiedNat_1.tryParseStringifiedNat)(v, 10));
      }
      function ipV4() {
        return (0, tuple_1.tuple)((0, nat_1.nat)(255), (0, nat_1.nat)(255), (0, nat_1.nat)(255), (0, nat_1.nat)(255)).map(dotJoinerMapper, dotJoinerUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/StringifiedNatArbitraryBuilder.js
  var require_StringifiedNatArbitraryBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/StringifiedNatArbitraryBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildStringifiedNatArbitrary = buildStringifiedNatArbitrary;
      var constantFrom_1 = require_constantFrom();
      var nat_1 = require_nat();
      var tuple_1 = require_tuple();
      var NatToStringifiedNat_1 = require_NatToStringifiedNat();
      function buildStringifiedNatArbitrary(maxValue) {
        return (0, tuple_1.tuple)((0, constantFrom_1.constantFrom)("dec", "oct", "hex"), (0, nat_1.nat)(maxValue)).map(NatToStringifiedNat_1.natToStringifiedNatMapper, NatToStringifiedNat_1.natToStringifiedNatUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/ipV4Extended.js
  var require_ipV4Extended = __commonJS({
    "node_modules/fast-check/lib/arbitrary/ipV4Extended.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ipV4Extended = ipV4Extended;
      var globals_1 = require_globals();
      var oneof_1 = require_oneof();
      var tuple_1 = require_tuple();
      var StringifiedNatArbitraryBuilder_1 = require_StringifiedNatArbitraryBuilder();
      function dotJoinerMapper(data) {
        return (0, globals_1.safeJoin)(data, ".");
      }
      function dotJoinerUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Invalid type");
        }
        return (0, globals_1.safeSplit)(value, ".");
      }
      function ipV4Extended() {
        return (0, oneof_1.oneof)((0, tuple_1.tuple)((0, StringifiedNatArbitraryBuilder_1.buildStringifiedNatArbitrary)(255), (0, StringifiedNatArbitraryBuilder_1.buildStringifiedNatArbitrary)(255), (0, StringifiedNatArbitraryBuilder_1.buildStringifiedNatArbitrary)(255), (0, StringifiedNatArbitraryBuilder_1.buildStringifiedNatArbitrary)(255)).map(dotJoinerMapper, dotJoinerUnmapper), (0, tuple_1.tuple)((0, StringifiedNatArbitraryBuilder_1.buildStringifiedNatArbitrary)(255), (0, StringifiedNatArbitraryBuilder_1.buildStringifiedNatArbitrary)(255), (0, StringifiedNatArbitraryBuilder_1.buildStringifiedNatArbitrary)(65535)).map(dotJoinerMapper, dotJoinerUnmapper), (0, tuple_1.tuple)((0, StringifiedNatArbitraryBuilder_1.buildStringifiedNatArbitrary)(255), (0, StringifiedNatArbitraryBuilder_1.buildStringifiedNatArbitrary)(16777215)).map(dotJoinerMapper, dotJoinerUnmapper), (0, StringifiedNatArbitraryBuilder_1.buildStringifiedNatArbitrary)(4294967295));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/CodePointsToString.js
  var require_CodePointsToString = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/CodePointsToString.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.codePointsToStringMapper = codePointsToStringMapper;
      exports.codePointsToStringUnmapper = codePointsToStringUnmapper;
      var globals_1 = require_globals();
      function codePointsToStringMapper(tab) {
        return (0, globals_1.safeJoin)(tab, "");
      }
      function codePointsToStringUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Cannot unmap the passed value");
        }
        return [...value];
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/hexaString.js
  var require_hexaString = __commonJS({
    "node_modules/fast-check/lib/arbitrary/hexaString.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.hexaString = hexaString;
      var array_1 = require_array();
      var hexa_1 = require_hexa();
      var CodePointsToString_1 = require_CodePointsToString();
      var SlicesForStringBuilder_1 = require_SlicesForStringBuilder();
      var safeObjectAssign = Object.assign;
      function hexaString(constraints = {}) {
        const charArbitrary = (0, hexa_1.hexa)();
        const experimentalCustomSlices = (0, SlicesForStringBuilder_1.createSlicesForString)(charArbitrary, CodePointsToString_1.codePointsToStringUnmapper);
        const enrichedConstraints = safeObjectAssign(safeObjectAssign({}, constraints), {
          experimentalCustomSlices
        });
        return (0, array_1.array)(charArbitrary, enrichedConstraints).map(CodePointsToString_1.codePointsToStringMapper, CodePointsToString_1.codePointsToStringUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/EntitiesToIPv6.js
  var require_EntitiesToIPv6 = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/EntitiesToIPv6.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fullySpecifiedMapper = fullySpecifiedMapper;
      exports.fullySpecifiedUnmapper = fullySpecifiedUnmapper;
      exports.onlyTrailingMapper = onlyTrailingMapper;
      exports.onlyTrailingUnmapper = onlyTrailingUnmapper;
      exports.multiTrailingMapper = multiTrailingMapper;
      exports.multiTrailingUnmapper = multiTrailingUnmapper;
      exports.multiTrailingMapperOne = multiTrailingMapperOne;
      exports.multiTrailingUnmapperOne = multiTrailingUnmapperOne;
      exports.singleTrailingMapper = singleTrailingMapper;
      exports.singleTrailingUnmapper = singleTrailingUnmapper;
      exports.noTrailingMapper = noTrailingMapper;
      exports.noTrailingUnmapper = noTrailingUnmapper;
      var globals_1 = require_globals();
      function readBh(value) {
        if (value.length === 0)
          return [];
        else
          return (0, globals_1.safeSplit)(value, ":");
      }
      function extractEhAndL(value) {
        const valueSplits = (0, globals_1.safeSplit)(value, ":");
        if (valueSplits.length >= 2 && valueSplits[valueSplits.length - 1].length <= 4) {
          return [
            (0, globals_1.safeSlice)(valueSplits, 0, valueSplits.length - 2),
            `${valueSplits[valueSplits.length - 2]}:${valueSplits[valueSplits.length - 1]}`
          ];
        }
        return [(0, globals_1.safeSlice)(valueSplits, 0, valueSplits.length - 1), valueSplits[valueSplits.length - 1]];
      }
      function fullySpecifiedMapper(data) {
        return `${(0, globals_1.safeJoin)(data[0], ":")}:${data[1]}`;
      }
      function fullySpecifiedUnmapper(value) {
        if (typeof value !== "string")
          throw new Error("Invalid type");
        return extractEhAndL(value);
      }
      function onlyTrailingMapper(data) {
        return `::${(0, globals_1.safeJoin)(data[0], ":")}:${data[1]}`;
      }
      function onlyTrailingUnmapper(value) {
        if (typeof value !== "string")
          throw new Error("Invalid type");
        if (!(0, globals_1.safeStartsWith)(value, "::"))
          throw new Error("Invalid value");
        return extractEhAndL((0, globals_1.safeSubstring)(value, 2));
      }
      function multiTrailingMapper(data) {
        return `${(0, globals_1.safeJoin)(data[0], ":")}::${(0, globals_1.safeJoin)(data[1], ":")}:${data[2]}`;
      }
      function multiTrailingUnmapper(value) {
        if (typeof value !== "string")
          throw new Error("Invalid type");
        const [bhString, trailingString] = (0, globals_1.safeSplit)(value, "::", 2);
        const [eh, l] = extractEhAndL(trailingString);
        return [readBh(bhString), eh, l];
      }
      function multiTrailingMapperOne(data) {
        return multiTrailingMapper([data[0], [data[1]], data[2]]);
      }
      function multiTrailingUnmapperOne(value) {
        const out = multiTrailingUnmapper(value);
        return [out[0], (0, globals_1.safeJoin)(out[1], ":"), out[2]];
      }
      function singleTrailingMapper(data) {
        return `${(0, globals_1.safeJoin)(data[0], ":")}::${data[1]}`;
      }
      function singleTrailingUnmapper(value) {
        if (typeof value !== "string")
          throw new Error("Invalid type");
        const [bhString, trailing] = (0, globals_1.safeSplit)(value, "::", 2);
        return [readBh(bhString), trailing];
      }
      function noTrailingMapper(data) {
        return `${(0, globals_1.safeJoin)(data[0], ":")}::`;
      }
      function noTrailingUnmapper(value) {
        if (typeof value !== "string")
          throw new Error("Invalid type");
        if (!(0, globals_1.safeEndsWith)(value, "::"))
          throw new Error("Invalid value");
        return [readBh((0, globals_1.safeSubstring)(value, 0, value.length - 2))];
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/ipV6.js
  var require_ipV6 = __commonJS({
    "node_modules/fast-check/lib/arbitrary/ipV6.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ipV6 = ipV6;
      var array_1 = require_array();
      var oneof_1 = require_oneof();
      var hexaString_1 = require_hexaString();
      var tuple_1 = require_tuple();
      var ipV4_1 = require_ipV4();
      var EntitiesToIPv6_1 = require_EntitiesToIPv6();
      function h16sTol32Mapper([a, b]) {
        return `${a}:${b}`;
      }
      function h16sTol32Unmapper(value) {
        if (typeof value !== "string")
          throw new Error("Invalid type");
        if (!value.includes(":"))
          throw new Error("Invalid value");
        return value.split(":", 2);
      }
      function ipV6() {
        const h16Arb = (0, hexaString_1.hexaString)({ minLength: 1, maxLength: 4, size: "max" });
        const ls32Arb = (0, oneof_1.oneof)((0, tuple_1.tuple)(h16Arb, h16Arb).map(h16sTol32Mapper, h16sTol32Unmapper), (0, ipV4_1.ipV4)());
        return (0, oneof_1.oneof)((0, tuple_1.tuple)((0, array_1.array)(h16Arb, { minLength: 6, maxLength: 6, size: "max" }), ls32Arb).map(EntitiesToIPv6_1.fullySpecifiedMapper, EntitiesToIPv6_1.fullySpecifiedUnmapper), (0, tuple_1.tuple)((0, array_1.array)(h16Arb, { minLength: 5, maxLength: 5, size: "max" }), ls32Arb).map(EntitiesToIPv6_1.onlyTrailingMapper, EntitiesToIPv6_1.onlyTrailingUnmapper), (0, tuple_1.tuple)((0, array_1.array)(h16Arb, { minLength: 0, maxLength: 1, size: "max" }), (0, array_1.array)(h16Arb, { minLength: 4, maxLength: 4, size: "max" }), ls32Arb).map(EntitiesToIPv6_1.multiTrailingMapper, EntitiesToIPv6_1.multiTrailingUnmapper), (0, tuple_1.tuple)((0, array_1.array)(h16Arb, { minLength: 0, maxLength: 2, size: "max" }), (0, array_1.array)(h16Arb, { minLength: 3, maxLength: 3, size: "max" }), ls32Arb).map(EntitiesToIPv6_1.multiTrailingMapper, EntitiesToIPv6_1.multiTrailingUnmapper), (0, tuple_1.tuple)((0, array_1.array)(h16Arb, { minLength: 0, maxLength: 3, size: "max" }), (0, array_1.array)(h16Arb, { minLength: 2, maxLength: 2, size: "max" }), ls32Arb).map(EntitiesToIPv6_1.multiTrailingMapper, EntitiesToIPv6_1.multiTrailingUnmapper), (0, tuple_1.tuple)((0, array_1.array)(h16Arb, { minLength: 0, maxLength: 4, size: "max" }), h16Arb, ls32Arb).map(EntitiesToIPv6_1.multiTrailingMapperOne, EntitiesToIPv6_1.multiTrailingUnmapperOne), (0, tuple_1.tuple)((0, array_1.array)(h16Arb, { minLength: 0, maxLength: 5, size: "max" }), ls32Arb).map(EntitiesToIPv6_1.singleTrailingMapper, EntitiesToIPv6_1.singleTrailingUnmapper), (0, tuple_1.tuple)((0, array_1.array)(h16Arb, { minLength: 0, maxLength: 6, size: "max" }), h16Arb).map(EntitiesToIPv6_1.singleTrailingMapper, EntitiesToIPv6_1.singleTrailingUnmapper), (0, tuple_1.tuple)((0, array_1.array)(h16Arb, { minLength: 0, maxLength: 7, size: "max" })).map(EntitiesToIPv6_1.noTrailingMapper, EntitiesToIPv6_1.noTrailingUnmapper));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/LazyArbitrary.js
  var require_LazyArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/LazyArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LazyArbitrary = void 0;
      var Arbitrary_1 = require_Arbitrary();
      var LazyArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor(name) {
          super();
          this.name = name;
          this.underlying = null;
        }
        generate(mrng, biasFactor) {
          if (!this.underlying) {
            throw new Error(`Lazy arbitrary ${JSON.stringify(this.name)} not correctly initialized`);
          }
          return this.underlying.generate(mrng, biasFactor);
        }
        canShrinkWithoutContext(value) {
          if (!this.underlying) {
            throw new Error(`Lazy arbitrary ${JSON.stringify(this.name)} not correctly initialized`);
          }
          return this.underlying.canShrinkWithoutContext(value);
        }
        shrink(value, context) {
          if (!this.underlying) {
            throw new Error(`Lazy arbitrary ${JSON.stringify(this.name)} not correctly initialized`);
          }
          return this.underlying.shrink(value, context);
        }
      };
      exports.LazyArbitrary = LazyArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/letrec.js
  var require_letrec = __commonJS({
    "node_modules/fast-check/lib/arbitrary/letrec.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.letrec = letrec;
      var LazyArbitrary_1 = require_LazyArbitrary();
      var globals_1 = require_globals();
      var safeObjectCreate = Object.create;
      function letrec(builder) {
        const lazyArbs = safeObjectCreate(null);
        const tie = (key) => {
          if (!(0, globals_1.safeHasOwnProperty)(lazyArbs, key)) {
            lazyArbs[key] = new LazyArbitrary_1.LazyArbitrary(String(key));
          }
          return lazyArbs[key];
        };
        const strictArbs = builder(tie);
        for (const key in strictArbs) {
          if (!(0, globals_1.safeHasOwnProperty)(strictArbs, key)) {
            continue;
          }
          const lazyAtKey = lazyArbs[key];
          const lazyArb = lazyAtKey !== void 0 ? lazyAtKey : new LazyArbitrary_1.LazyArbitrary(key);
          lazyArb.underlying = strictArbs[key];
          lazyArbs[key] = lazyArb;
        }
        return strictArbs;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/WordsToLorem.js
  var require_WordsToLorem = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/WordsToLorem.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.wordsToJoinedStringMapper = wordsToJoinedStringMapper;
      exports.wordsToJoinedStringUnmapperFor = wordsToJoinedStringUnmapperFor;
      exports.wordsToSentenceMapper = wordsToSentenceMapper;
      exports.wordsToSentenceUnmapperFor = wordsToSentenceUnmapperFor;
      exports.sentencesToParagraphMapper = sentencesToParagraphMapper;
      exports.sentencesToParagraphUnmapper = sentencesToParagraphUnmapper;
      var globals_1 = require_globals();
      function wordsToJoinedStringMapper(words) {
        return (0, globals_1.safeJoin)((0, globals_1.safeMap)(words, (w) => w[w.length - 1] === "," ? (0, globals_1.safeSubstring)(w, 0, w.length - 1) : w), " ");
      }
      function wordsToJoinedStringUnmapperFor(wordsArbitrary) {
        return function wordsToJoinedStringUnmapper(value) {
          if (typeof value !== "string") {
            throw new Error("Unsupported type");
          }
          const words = [];
          for (const candidate of (0, globals_1.safeSplit)(value, " ")) {
            if (wordsArbitrary.canShrinkWithoutContext(candidate))
              (0, globals_1.safePush)(words, candidate);
            else if (wordsArbitrary.canShrinkWithoutContext(candidate + ","))
              (0, globals_1.safePush)(words, candidate + ",");
            else
              throw new Error("Unsupported word");
          }
          return words;
        };
      }
      function wordsToSentenceMapper(words) {
        let sentence = (0, globals_1.safeJoin)(words, " ");
        if (sentence[sentence.length - 1] === ",") {
          sentence = (0, globals_1.safeSubstring)(sentence, 0, sentence.length - 1);
        }
        return (0, globals_1.safeToUpperCase)(sentence[0]) + (0, globals_1.safeSubstring)(sentence, 1) + ".";
      }
      function wordsToSentenceUnmapperFor(wordsArbitrary) {
        return function wordsToSentenceUnmapper(value) {
          if (typeof value !== "string") {
            throw new Error("Unsupported type");
          }
          if (value.length < 2 || value[value.length - 1] !== "." || value[value.length - 2] === "," || (0, globals_1.safeToUpperCase)((0, globals_1.safeToLowerCase)(value[0])) !== value[0]) {
            throw new Error("Unsupported value");
          }
          const adaptedValue = (0, globals_1.safeToLowerCase)(value[0]) + (0, globals_1.safeSubstring)(value, 1, value.length - 1);
          const words = [];
          const candidates = (0, globals_1.safeSplit)(adaptedValue, " ");
          for (let idx = 0; idx !== candidates.length; ++idx) {
            const candidate = candidates[idx];
            if (wordsArbitrary.canShrinkWithoutContext(candidate))
              (0, globals_1.safePush)(words, candidate);
            else if (idx === candidates.length - 1 && wordsArbitrary.canShrinkWithoutContext(candidate + ","))
              (0, globals_1.safePush)(words, candidate + ",");
            else
              throw new Error("Unsupported word");
          }
          return words;
        };
      }
      function sentencesToParagraphMapper(sentences) {
        return (0, globals_1.safeJoin)(sentences, " ");
      }
      function sentencesToParagraphUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Unsupported type");
        }
        const sentences = (0, globals_1.safeSplit)(value, ". ");
        for (let idx = 0; idx < sentences.length - 1; ++idx) {
          sentences[idx] += ".";
        }
        return sentences;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/lorem.js
  var require_lorem = __commonJS({
    "node_modules/fast-check/lib/arbitrary/lorem.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.lorem = lorem;
      var array_1 = require_array();
      var constant_1 = require_constant();
      var oneof_1 = require_oneof();
      var WordsToLorem_1 = require_WordsToLorem();
      var h = (v, w) => {
        return { arbitrary: (0, constant_1.constant)(v), weight: w };
      };
      function loremWord() {
        return (0, oneof_1.oneof)(h("non", 6), h("adipiscing", 5), h("ligula", 5), h("enim", 5), h("pellentesque", 5), h("in", 5), h("augue", 5), h("et", 5), h("nulla", 5), h("lorem", 4), h("sit", 4), h("sed", 4), h("diam", 4), h("fermentum", 4), h("ut", 4), h("eu", 4), h("aliquam", 4), h("mauris", 4), h("vitae", 4), h("felis", 4), h("ipsum", 3), h("dolor", 3), h("amet,", 3), h("elit", 3), h("euismod", 3), h("mi", 3), h("orci", 3), h("erat", 3), h("praesent", 3), h("egestas", 3), h("leo", 3), h("vel", 3), h("sapien", 3), h("integer", 3), h("curabitur", 3), h("convallis", 3), h("purus", 3), h("risus", 2), h("suspendisse", 2), h("lectus", 2), h("nec,", 2), h("ultricies", 2), h("sed,", 2), h("cras", 2), h("elementum", 2), h("ultrices", 2), h("maecenas", 2), h("massa,", 2), h("varius", 2), h("a,", 2), h("semper", 2), h("proin", 2), h("nec", 2), h("nisl", 2), h("amet", 2), h("duis", 2), h("congue", 2), h("libero", 2), h("vestibulum", 2), h("pede", 2), h("blandit", 2), h("sodales", 2), h("ante", 2), h("nibh", 2), h("ac", 2), h("aenean", 2), h("massa", 2), h("suscipit", 2), h("sollicitudin", 2), h("fusce", 2), h("tempus", 2), h("aliquam,", 2), h("nunc", 2), h("ullamcorper", 2), h("rhoncus", 2), h("metus", 2), h("faucibus,", 2), h("justo", 2), h("magna", 2), h("at", 2), h("tincidunt", 2), h("consectetur", 1), h("tortor,", 1), h("dignissim", 1), h("congue,", 1), h("non,", 1), h("porttitor,", 1), h("nonummy", 1), h("molestie,", 1), h("est", 1), h("eleifend", 1), h("mi,", 1), h("arcu", 1), h("scelerisque", 1), h("vitae,", 1), h("consequat", 1), h("in,", 1), h("pretium", 1), h("volutpat", 1), h("pharetra", 1), h("tempor", 1), h("bibendum", 1), h("odio", 1), h("dui", 1), h("primis", 1), h("faucibus", 1), h("luctus", 1), h("posuere", 1), h("cubilia", 1), h("curae,", 1), h("hendrerit", 1), h("velit", 1), h("mauris,", 1), h("gravida", 1), h("ornare", 1), h("ut,", 1), h("pulvinar", 1), h("varius,", 1), h("turpis", 1), h("nibh,", 1), h("eros", 1), h("id", 1), h("aliquet", 1), h("quis", 1), h("lobortis", 1), h("consectetuer", 1), h("morbi", 1), h("vehicula", 1), h("tortor", 1), h("tellus,", 1), h("id,", 1), h("eu,", 1), h("quam", 1), h("feugiat,", 1), h("posuere,", 1), h("iaculis", 1), h("lectus,", 1), h("tristique", 1), h("mollis,", 1), h("nisl,", 1), h("vulputate", 1), h("sem", 1), h("vivamus", 1), h("placerat", 1), h("imperdiet", 1), h("cursus", 1), h("rutrum", 1), h("iaculis,", 1), h("augue,", 1), h("lacus", 1));
      }
      function lorem(constraints = {}) {
        const { maxCount, mode = "words", size } = constraints;
        if (maxCount !== void 0 && maxCount < 1) {
          throw new Error(`lorem has to produce at least one word/sentence`);
        }
        const wordArbitrary = loremWord();
        if (mode === "sentences") {
          const sentence = (0, array_1.array)(wordArbitrary, { minLength: 1, size: "small" }).map(WordsToLorem_1.wordsToSentenceMapper, (0, WordsToLorem_1.wordsToSentenceUnmapperFor)(wordArbitrary));
          return (0, array_1.array)(sentence, { minLength: 1, maxLength: maxCount, size }).map(WordsToLorem_1.sentencesToParagraphMapper, WordsToLorem_1.sentencesToParagraphUnmapper);
        } else {
          return (0, array_1.array)(wordArbitrary, { minLength: 1, maxLength: maxCount, size }).map(WordsToLorem_1.wordsToJoinedStringMapper, (0, WordsToLorem_1.wordsToJoinedStringUnmapperFor)(wordArbitrary));
        }
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/memo.js
  var require_memo = __commonJS({
    "node_modules/fast-check/lib/arbitrary/memo.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.memo = memo;
      var globals_1 = require_globals();
      var contextRemainingDepth = 10;
      function memo(builder) {
        const previous = {};
        return ((maxDepth) => {
          const n = maxDepth !== void 0 ? maxDepth : contextRemainingDepth;
          if (!(0, globals_1.safeHasOwnProperty)(previous, n)) {
            const prev = contextRemainingDepth;
            contextRemainingDepth = n - 1;
            previous[n] = builder(n);
            contextRemainingDepth = prev;
          }
          return previous[n];
        });
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/ToggleFlags.js
  var require_ToggleFlags = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/ToggleFlags.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.countToggledBits = countToggledBits;
      exports.computeNextFlags = computeNextFlags;
      exports.computeTogglePositions = computeTogglePositions;
      exports.computeFlagsFromChars = computeFlagsFromChars;
      exports.applyFlagsOnChars = applyFlagsOnChars;
      var globals_1 = require_globals();
      function countToggledBits(n) {
        let count = 0;
        while (n > (0, globals_1.BigInt)(0)) {
          if (n & (0, globals_1.BigInt)(1))
            ++count;
          n >>= (0, globals_1.BigInt)(1);
        }
        return count;
      }
      function computeNextFlags(flags, nextSize) {
        const allowedMask = ((0, globals_1.BigInt)(1) << (0, globals_1.BigInt)(nextSize)) - (0, globals_1.BigInt)(1);
        const preservedFlags = flags & allowedMask;
        let numMissingFlags = countToggledBits(flags - preservedFlags);
        let nFlags = preservedFlags;
        for (let mask = (0, globals_1.BigInt)(1); mask <= allowedMask && numMissingFlags !== 0; mask <<= (0, globals_1.BigInt)(1)) {
          if (!(nFlags & mask)) {
            nFlags |= mask;
            --numMissingFlags;
          }
        }
        return nFlags;
      }
      function computeTogglePositions(chars, toggleCase) {
        const positions = [];
        for (let idx = chars.length - 1; idx !== -1; --idx) {
          if (toggleCase(chars[idx]) !== chars[idx])
            (0, globals_1.safePush)(positions, idx);
        }
        return positions;
      }
      function computeFlagsFromChars(untoggledChars, toggledChars, togglePositions) {
        let flags = (0, globals_1.BigInt)(0);
        for (let idx = 0, mask = (0, globals_1.BigInt)(1); idx !== togglePositions.length; ++idx, mask <<= (0, globals_1.BigInt)(1)) {
          if (untoggledChars[togglePositions[idx]] !== toggledChars[togglePositions[idx]]) {
            flags |= mask;
          }
        }
        return flags;
      }
      function applyFlagsOnChars(chars, flags, togglePositions, toggleCase) {
        for (let idx = 0, mask = (0, globals_1.BigInt)(1); idx !== togglePositions.length; ++idx, mask <<= (0, globals_1.BigInt)(1)) {
          if (flags & mask)
            chars[togglePositions[idx]] = toggleCase(chars[togglePositions[idx]]);
        }
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/MixedCaseArbitrary.js
  var require_MixedCaseArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/MixedCaseArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MixedCaseArbitrary = void 0;
      var bigUintN_1 = require_bigUintN();
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var LazyIterableIterator_1 = require_LazyIterableIterator();
      var ToggleFlags_1 = require_ToggleFlags();
      var globals_1 = require_globals();
      var globals_2 = require_globals();
      var MixedCaseArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor(stringArb, toggleCase, untoggleAll) {
          super();
          this.stringArb = stringArb;
          this.toggleCase = toggleCase;
          this.untoggleAll = untoggleAll;
        }
        buildContextFor(rawStringValue, flagsValue) {
          return {
            rawString: rawStringValue.value,
            rawStringContext: rawStringValue.context,
            flags: flagsValue.value,
            flagsContext: flagsValue.context
          };
        }
        generate(mrng, biasFactor) {
          const rawStringValue = this.stringArb.generate(mrng, biasFactor);
          const chars = [...rawStringValue.value];
          const togglePositions = (0, ToggleFlags_1.computeTogglePositions)(chars, this.toggleCase);
          const flagsArb = (0, bigUintN_1.bigUintN)(togglePositions.length);
          const flagsValue = flagsArb.generate(mrng, void 0);
          (0, ToggleFlags_1.applyFlagsOnChars)(chars, flagsValue.value, togglePositions, this.toggleCase);
          return new Value_1.Value((0, globals_1.safeJoin)(chars, ""), this.buildContextFor(rawStringValue, flagsValue));
        }
        canShrinkWithoutContext(value) {
          if (typeof value !== "string") {
            return false;
          }
          return this.untoggleAll !== void 0 ? this.stringArb.canShrinkWithoutContext(this.untoggleAll(value)) : this.stringArb.canShrinkWithoutContext(value);
        }
        shrink(value, context) {
          let contextSafe;
          if (context !== void 0) {
            contextSafe = context;
          } else {
            if (this.untoggleAll !== void 0) {
              const untoggledValue = this.untoggleAll(value);
              const valueChars = [...value];
              const untoggledValueChars = [...untoggledValue];
              const togglePositions = (0, ToggleFlags_1.computeTogglePositions)(untoggledValueChars, this.toggleCase);
              contextSafe = {
                rawString: untoggledValue,
                rawStringContext: void 0,
                flags: (0, ToggleFlags_1.computeFlagsFromChars)(untoggledValueChars, valueChars, togglePositions),
                flagsContext: void 0
              };
            } else {
              contextSafe = {
                rawString: value,
                rawStringContext: void 0,
                flags: (0, globals_2.BigInt)(0),
                flagsContext: void 0
              };
            }
          }
          const rawString = contextSafe.rawString;
          const flags = contextSafe.flags;
          return this.stringArb.shrink(rawString, contextSafe.rawStringContext).map((nRawStringValue) => {
            const nChars = [...nRawStringValue.value];
            const nTogglePositions = (0, ToggleFlags_1.computeTogglePositions)(nChars, this.toggleCase);
            const nFlags = (0, ToggleFlags_1.computeNextFlags)(flags, nTogglePositions.length);
            (0, ToggleFlags_1.applyFlagsOnChars)(nChars, nFlags, nTogglePositions, this.toggleCase);
            return new Value_1.Value((0, globals_1.safeJoin)(nChars, ""), this.buildContextFor(nRawStringValue, new Value_1.Value(nFlags, void 0)));
          }).join((0, LazyIterableIterator_1.makeLazy)(() => {
            const chars = [...rawString];
            const togglePositions = (0, ToggleFlags_1.computeTogglePositions)(chars, this.toggleCase);
            return (0, bigUintN_1.bigUintN)(togglePositions.length).shrink(flags, contextSafe.flagsContext).map((nFlagsValue) => {
              const nChars = (0, globals_1.safeSlice)(chars);
              (0, ToggleFlags_1.applyFlagsOnChars)(nChars, nFlagsValue.value, togglePositions, this.toggleCase);
              return new Value_1.Value((0, globals_1.safeJoin)(nChars, ""), this.buildContextFor(new Value_1.Value(rawString, contextSafe.rawStringContext), nFlagsValue));
            });
          }));
        }
      };
      exports.MixedCaseArbitrary = MixedCaseArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/mixedCase.js
  var require_mixedCase = __commonJS({
    "node_modules/fast-check/lib/arbitrary/mixedCase.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.mixedCase = mixedCase;
      var globals_1 = require_globals();
      var MixedCaseArbitrary_1 = require_MixedCaseArbitrary();
      function defaultToggleCase(rawChar) {
        const upper = (0, globals_1.safeToUpperCase)(rawChar);
        if (upper !== rawChar)
          return upper;
        return (0, globals_1.safeToLowerCase)(rawChar);
      }
      function mixedCase(stringArb, constraints) {
        if (typeof globals_1.BigInt === "undefined") {
          throw new globals_1.Error(`mixedCase requires BigInt support`);
        }
        const toggleCase = constraints && constraints.toggleCase || defaultToggleCase;
        const untoggleAll = constraints && constraints.untoggleAll;
        return new MixedCaseArbitrary_1.MixedCaseArbitrary(stringArb, toggleCase, untoggleAll);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/float32Array.js
  var require_float32Array = __commonJS({
    "node_modules/fast-check/lib/arbitrary/float32Array.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.float32Array = float32Array;
      var float_1 = require_float();
      var array_1 = require_array();
      var globals_1 = require_globals();
      function toTypedMapper(data) {
        return globals_1.Float32Array.from(data);
      }
      function fromTypedUnmapper(value) {
        if (!(value instanceof globals_1.Float32Array))
          throw new Error("Unexpected type");
        return [...value];
      }
      function float32Array(constraints = {}) {
        return (0, array_1.array)((0, float_1.float)(constraints), constraints).map(toTypedMapper, fromTypedUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/float64Array.js
  var require_float64Array = __commonJS({
    "node_modules/fast-check/lib/arbitrary/float64Array.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.float64Array = float64Array;
      var double_1 = require_double();
      var array_1 = require_array();
      var globals_1 = require_globals();
      function toTypedMapper(data) {
        return globals_1.Float64Array.from(data);
      }
      function fromTypedUnmapper(value) {
        if (!(value instanceof globals_1.Float64Array))
          throw new Error("Unexpected type");
        return [...value];
      }
      function float64Array(constraints = {}) {
        return (0, array_1.array)((0, double_1.double)(constraints), constraints).map(toTypedMapper, fromTypedUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/TypedIntArrayArbitraryBuilder.js
  var require_TypedIntArrayArbitraryBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/TypedIntArrayArbitraryBuilder.js"(exports) {
      "use strict";
      var __rest = exports && exports.__rest || function(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
          }
        return t;
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.typedIntArrayArbitraryArbitraryBuilder = typedIntArrayArbitraryArbitraryBuilder;
      var array_1 = require_array();
      function typedIntArrayArbitraryArbitraryBuilder(constraints, defaultMin, defaultMax, TypedArrayClass, arbitraryBuilder) {
        const generatorName = TypedArrayClass.name;
        const { min = defaultMin, max = defaultMax } = constraints, arrayConstraints = __rest(constraints, ["min", "max"]);
        if (min > max) {
          throw new Error(`Invalid range passed to ${generatorName}: min must be lower than or equal to max`);
        }
        if (min < defaultMin) {
          throw new Error(`Invalid min value passed to ${generatorName}: min must be greater than or equal to ${defaultMin}`);
        }
        if (max > defaultMax) {
          throw new Error(`Invalid max value passed to ${generatorName}: max must be lower than or equal to ${defaultMax}`);
        }
        return (0, array_1.array)(arbitraryBuilder({ min, max }), arrayConstraints).map((data) => TypedArrayClass.from(data), (value) => {
          if (!(value instanceof TypedArrayClass))
            throw new Error("Invalid type");
          return [...value];
        });
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/int16Array.js
  var require_int16Array = __commonJS({
    "node_modules/fast-check/lib/arbitrary/int16Array.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.int16Array = int16Array;
      var globals_1 = require_globals();
      var integer_1 = require_integer();
      var TypedIntArrayArbitraryBuilder_1 = require_TypedIntArrayArbitraryBuilder();
      function int16Array(constraints = {}) {
        return (0, TypedIntArrayArbitraryBuilder_1.typedIntArrayArbitraryArbitraryBuilder)(constraints, -32768, 32767, globals_1.Int16Array, integer_1.integer);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/int32Array.js
  var require_int32Array = __commonJS({
    "node_modules/fast-check/lib/arbitrary/int32Array.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.int32Array = int32Array;
      var globals_1 = require_globals();
      var integer_1 = require_integer();
      var TypedIntArrayArbitraryBuilder_1 = require_TypedIntArrayArbitraryBuilder();
      function int32Array(constraints = {}) {
        return (0, TypedIntArrayArbitraryBuilder_1.typedIntArrayArbitraryArbitraryBuilder)(constraints, -2147483648, 2147483647, globals_1.Int32Array, integer_1.integer);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/int8Array.js
  var require_int8Array = __commonJS({
    "node_modules/fast-check/lib/arbitrary/int8Array.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.int8Array = int8Array;
      var globals_1 = require_globals();
      var integer_1 = require_integer();
      var TypedIntArrayArbitraryBuilder_1 = require_TypedIntArrayArbitraryBuilder();
      function int8Array(constraints = {}) {
        return (0, TypedIntArrayArbitraryBuilder_1.typedIntArrayArbitraryArbitraryBuilder)(constraints, -128, 127, globals_1.Int8Array, integer_1.integer);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/uint16Array.js
  var require_uint16Array = __commonJS({
    "node_modules/fast-check/lib/arbitrary/uint16Array.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.uint16Array = uint16Array;
      var globals_1 = require_globals();
      var integer_1 = require_integer();
      var TypedIntArrayArbitraryBuilder_1 = require_TypedIntArrayArbitraryBuilder();
      function uint16Array(constraints = {}) {
        return (0, TypedIntArrayArbitraryBuilder_1.typedIntArrayArbitraryArbitraryBuilder)(constraints, 0, 65535, globals_1.Uint16Array, integer_1.integer);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/uint32Array.js
  var require_uint32Array = __commonJS({
    "node_modules/fast-check/lib/arbitrary/uint32Array.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.uint32Array = uint32Array;
      var globals_1 = require_globals();
      var integer_1 = require_integer();
      var TypedIntArrayArbitraryBuilder_1 = require_TypedIntArrayArbitraryBuilder();
      function uint32Array(constraints = {}) {
        return (0, TypedIntArrayArbitraryBuilder_1.typedIntArrayArbitraryArbitraryBuilder)(constraints, 0, 4294967295, globals_1.Uint32Array, integer_1.integer);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/uint8Array.js
  var require_uint8Array = __commonJS({
    "node_modules/fast-check/lib/arbitrary/uint8Array.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.uint8Array = uint8Array;
      var globals_1 = require_globals();
      var integer_1 = require_integer();
      var TypedIntArrayArbitraryBuilder_1 = require_TypedIntArrayArbitraryBuilder();
      function uint8Array(constraints = {}) {
        return (0, TypedIntArrayArbitraryBuilder_1.typedIntArrayArbitraryArbitraryBuilder)(constraints, 0, 255, globals_1.Uint8Array, integer_1.integer);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/uint8ClampedArray.js
  var require_uint8ClampedArray = __commonJS({
    "node_modules/fast-check/lib/arbitrary/uint8ClampedArray.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.uint8ClampedArray = uint8ClampedArray;
      var globals_1 = require_globals();
      var integer_1 = require_integer();
      var TypedIntArrayArbitraryBuilder_1 = require_TypedIntArrayArbitraryBuilder();
      function uint8ClampedArray(constraints = {}) {
        return (0, TypedIntArrayArbitraryBuilder_1.typedIntArrayArbitraryArbitraryBuilder)(constraints, 0, 255, globals_1.Uint8ClampedArray, integer_1.integer);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/WithShrinkFromOtherArbitrary.js
  var require_WithShrinkFromOtherArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/WithShrinkFromOtherArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WithShrinkFromOtherArbitrary = void 0;
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      function isSafeContext(context) {
        return context !== void 0;
      }
      function toGeneratorValue(value) {
        if (value.hasToBeCloned) {
          return new Value_1.Value(value.value_, { generatorContext: value.context }, () => value.value);
        }
        return new Value_1.Value(value.value_, { generatorContext: value.context });
      }
      function toShrinkerValue(value) {
        if (value.hasToBeCloned) {
          return new Value_1.Value(value.value_, { shrinkerContext: value.context }, () => value.value);
        }
        return new Value_1.Value(value.value_, { shrinkerContext: value.context });
      }
      var WithShrinkFromOtherArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor(generatorArbitrary, shrinkerArbitrary) {
          super();
          this.generatorArbitrary = generatorArbitrary;
          this.shrinkerArbitrary = shrinkerArbitrary;
        }
        generate(mrng, biasFactor) {
          return toGeneratorValue(this.generatorArbitrary.generate(mrng, biasFactor));
        }
        canShrinkWithoutContext(value) {
          return this.shrinkerArbitrary.canShrinkWithoutContext(value);
        }
        shrink(value, context) {
          if (!isSafeContext(context)) {
            return this.shrinkerArbitrary.shrink(value, void 0).map(toShrinkerValue);
          }
          if ("generatorContext" in context) {
            return this.generatorArbitrary.shrink(value, context.generatorContext).map(toGeneratorValue);
          }
          return this.shrinkerArbitrary.shrink(value, context.shrinkerContext).map(toShrinkerValue);
        }
      };
      exports.WithShrinkFromOtherArbitrary = WithShrinkFromOtherArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/RestrictedIntegerArbitraryBuilder.js
  var require_RestrictedIntegerArbitraryBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/RestrictedIntegerArbitraryBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.restrictedIntegerArbitraryBuilder = restrictedIntegerArbitraryBuilder;
      var integer_1 = require_integer();
      var WithShrinkFromOtherArbitrary_1 = require_WithShrinkFromOtherArbitrary();
      function restrictedIntegerArbitraryBuilder(min, maxGenerated, max) {
        const generatorArbitrary = (0, integer_1.integer)({ min, max: maxGenerated });
        if (maxGenerated === max) {
          return generatorArbitrary;
        }
        const shrinkerArbitrary = (0, integer_1.integer)({ min, max });
        return new WithShrinkFromOtherArbitrary_1.WithShrinkFromOtherArbitrary(generatorArbitrary, shrinkerArbitrary);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/sparseArray.js
  var require_sparseArray = __commonJS({
    "node_modules/fast-check/lib/arbitrary/sparseArray.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.sparseArray = sparseArray;
      var globals_1 = require_globals();
      var tuple_1 = require_tuple();
      var uniqueArray_1 = require_uniqueArray();
      var RestrictedIntegerArbitraryBuilder_1 = require_RestrictedIntegerArbitraryBuilder();
      var MaxLengthFromMinLength_1 = require_MaxLengthFromMinLength();
      var safeMathMin = Math.min;
      var safeMathMax = Math.max;
      var safeArrayIsArray = globals_1.Array.isArray;
      var safeObjectEntries = Object.entries;
      function extractMaxIndex(indexesAndValues) {
        let maxIndex = -1;
        for (let index = 0; index !== indexesAndValues.length; ++index) {
          maxIndex = safeMathMax(maxIndex, indexesAndValues[index][0]);
        }
        return maxIndex;
      }
      function arrayFromItems(length, indexesAndValues) {
        const array = (0, globals_1.Array)(length);
        for (let index = 0; index !== indexesAndValues.length; ++index) {
          const it = indexesAndValues[index];
          if (it[0] < length)
            array[it[0]] = it[1];
        }
        return array;
      }
      function sparseArray(arb, constraints = {}) {
        const { size, minNumElements = 0, maxLength = MaxLengthFromMinLength_1.MaxLengthUpperBound, maxNumElements = maxLength, noTrailingHole, depthIdentifier } = constraints;
        const maxGeneratedNumElements = (0, MaxLengthFromMinLength_1.maxGeneratedLengthFromSizeForArbitrary)(size, minNumElements, maxNumElements, constraints.maxNumElements !== void 0);
        const maxGeneratedLength = (0, MaxLengthFromMinLength_1.maxGeneratedLengthFromSizeForArbitrary)(size, maxGeneratedNumElements, maxLength, constraints.maxLength !== void 0);
        if (minNumElements > maxLength) {
          throw new Error(`The minimal number of non-hole elements cannot be higher than the maximal length of the array`);
        }
        if (minNumElements > maxNumElements) {
          throw new Error(`The minimal number of non-hole elements cannot be higher than the maximal number of non-holes`);
        }
        const resultedMaxNumElements = safeMathMin(maxNumElements, maxLength);
        const resultedSizeMaxNumElements = constraints.maxNumElements !== void 0 || size !== void 0 ? size : "=";
        const maxGeneratedIndexAuthorized = safeMathMax(maxGeneratedLength - 1, 0);
        const maxIndexAuthorized = safeMathMax(maxLength - 1, 0);
        const sparseArrayNoTrailingHole = (0, uniqueArray_1.uniqueArray)((0, tuple_1.tuple)((0, RestrictedIntegerArbitraryBuilder_1.restrictedIntegerArbitraryBuilder)(0, maxGeneratedIndexAuthorized, maxIndexAuthorized), arb), {
          size: resultedSizeMaxNumElements,
          minLength: minNumElements,
          maxLength: resultedMaxNumElements,
          selector: (item) => item[0],
          depthIdentifier
        }).map((items) => {
          const lastIndex = extractMaxIndex(items);
          return arrayFromItems(lastIndex + 1, items);
        }, (value) => {
          if (!safeArrayIsArray(value)) {
            throw new Error("Not supported entry type");
          }
          if (noTrailingHole && value.length !== 0 && !(value.length - 1 in value)) {
            throw new Error("No trailing hole");
          }
          return (0, globals_1.safeMap)(safeObjectEntries(value), (entry) => [Number(entry[0]), entry[1]]);
        });
        if (noTrailingHole || maxLength === minNumElements) {
          return sparseArrayNoTrailingHole;
        }
        return (0, tuple_1.tuple)(sparseArrayNoTrailingHole, (0, RestrictedIntegerArbitraryBuilder_1.restrictedIntegerArbitraryBuilder)(minNumElements, maxGeneratedLength, maxLength)).map((data) => {
          const sparse = data[0];
          const targetLength = data[1];
          if (sparse.length >= targetLength) {
            return sparse;
          }
          const longerSparse = (0, globals_1.safeSlice)(sparse);
          longerSparse.length = targetLength;
          return longerSparse;
        }, (value) => {
          if (!safeArrayIsArray(value)) {
            throw new Error("Not supported entry type");
          }
          return [value, value.length];
        });
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/ArrayToMap.js
  var require_ArrayToMap = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/ArrayToMap.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.arrayToMapMapper = arrayToMapMapper;
      exports.arrayToMapUnmapper = arrayToMapUnmapper;
      function arrayToMapMapper(data) {
        return new Map(data);
      }
      function arrayToMapUnmapper(value) {
        if (typeof value !== "object" || value === null) {
          throw new Error("Incompatible instance received: should be a non-null object");
        }
        if (!("constructor" in value) || value.constructor !== Map) {
          throw new Error("Incompatible instance received: should be of exact type Map");
        }
        return Array.from(value);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/ArrayToSet.js
  var require_ArrayToSet = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/ArrayToSet.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.arrayToSetMapper = arrayToSetMapper;
      exports.arrayToSetUnmapper = arrayToSetUnmapper;
      function arrayToSetMapper(data) {
        return new Set(data);
      }
      function arrayToSetUnmapper(value) {
        if (typeof value !== "object" || value === null) {
          throw new Error("Incompatible instance received: should be a non-null object");
        }
        if (!("constructor" in value) || value.constructor !== Set) {
          throw new Error("Incompatible instance received: should be of exact type Set");
        }
        return Array.from(value);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/AnyArbitraryBuilder.js
  var require_AnyArbitraryBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/AnyArbitraryBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.anyArbitraryBuilder = anyArbitraryBuilder;
      var stringify_1 = require_stringify();
      var array_1 = require_array();
      var oneof_1 = require_oneof();
      var tuple_1 = require_tuple();
      var bigInt_1 = require_bigInt();
      var date_1 = require_date();
      var float32Array_1 = require_float32Array();
      var float64Array_1 = require_float64Array();
      var int16Array_1 = require_int16Array();
      var int32Array_1 = require_int32Array();
      var int8Array_1 = require_int8Array();
      var uint16Array_1 = require_uint16Array();
      var uint32Array_1 = require_uint32Array();
      var uint8Array_1 = require_uint8Array();
      var uint8ClampedArray_1 = require_uint8ClampedArray();
      var sparseArray_1 = require_sparseArray();
      var ArrayToMap_1 = require_ArrayToMap();
      var ArrayToSet_1 = require_ArrayToSet();
      var letrec_1 = require_letrec();
      var uniqueArray_1 = require_uniqueArray();
      var DepthContext_1 = require_DepthContext();
      var dictionary_1 = require_dictionary();
      function mapOf(ka, va, maxKeys, size, depthIdentifier) {
        return (0, uniqueArray_1.uniqueArray)((0, tuple_1.tuple)(ka, va), {
          maxLength: maxKeys,
          size,
          comparator: "SameValueZero",
          selector: (t) => t[0],
          depthIdentifier
        }).map(ArrayToMap_1.arrayToMapMapper, ArrayToMap_1.arrayToMapUnmapper);
      }
      function dictOf(ka, va, maxKeys, size, depthIdentifier, withNullPrototype) {
        return (0, dictionary_1.dictionary)(ka, va, {
          maxKeys,
          noNullPrototype: !withNullPrototype,
          size,
          depthIdentifier
        });
      }
      function setOf(va, maxKeys, size, depthIdentifier) {
        return (0, uniqueArray_1.uniqueArray)(va, { maxLength: maxKeys, size, comparator: "SameValueZero", depthIdentifier }).map(ArrayToSet_1.arrayToSetMapper, ArrayToSet_1.arrayToSetUnmapper);
      }
      function typedArray(constraints) {
        return (0, oneof_1.oneof)((0, int8Array_1.int8Array)(constraints), (0, uint8Array_1.uint8Array)(constraints), (0, uint8ClampedArray_1.uint8ClampedArray)(constraints), (0, int16Array_1.int16Array)(constraints), (0, uint16Array_1.uint16Array)(constraints), (0, int32Array_1.int32Array)(constraints), (0, uint32Array_1.uint32Array)(constraints), (0, float32Array_1.float32Array)(constraints), (0, float64Array_1.float64Array)(constraints));
      }
      function anyArbitraryBuilder(constraints) {
        const arbitrariesForBase = constraints.values;
        const depthSize = constraints.depthSize;
        const depthIdentifier = (0, DepthContext_1.createDepthIdentifier)();
        const maxDepth = constraints.maxDepth;
        const maxKeys = constraints.maxKeys;
        const size = constraints.size;
        const baseArb = (0, oneof_1.oneof)(...arbitrariesForBase, ...constraints.withBigInt ? [(0, bigInt_1.bigInt)()] : [], ...constraints.withDate ? [(0, date_1.date)()] : []);
        return (0, letrec_1.letrec)((tie) => ({
          anything: (0, oneof_1.oneof)({ maxDepth, depthSize, depthIdentifier }, baseArb, tie("array"), tie("object"), ...constraints.withMap ? [tie("map")] : [], ...constraints.withSet ? [tie("set")] : [], ...constraints.withObjectString ? [tie("anything").map((o) => (0, stringify_1.stringify)(o))] : [], ...constraints.withTypedArray ? [typedArray({ maxLength: maxKeys, size })] : [], ...constraints.withSparseArray ? [(0, sparseArray_1.sparseArray)(tie("anything"), { maxNumElements: maxKeys, size, depthIdentifier })] : []),
          keys: constraints.withObjectString ? (0, oneof_1.oneof)({ arbitrary: constraints.key, weight: 10 }, { arbitrary: tie("anything").map((o) => (0, stringify_1.stringify)(o)), weight: 1 }) : constraints.key,
          array: (0, array_1.array)(tie("anything"), { maxLength: maxKeys, size, depthIdentifier }),
          set: setOf(tie("anything"), maxKeys, size, depthIdentifier),
          map: (0, oneof_1.oneof)(mapOf(tie("keys"), tie("anything"), maxKeys, size, depthIdentifier), mapOf(tie("anything"), tie("anything"), maxKeys, size, depthIdentifier)),
          object: dictOf(tie("keys"), tie("anything"), maxKeys, size, depthIdentifier, constraints.withNullPrototype)
        })).anything;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/fullUnicodeString.js
  var require_fullUnicodeString = __commonJS({
    "node_modules/fast-check/lib/arbitrary/fullUnicodeString.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.fullUnicodeString = fullUnicodeString;
      var array_1 = require_array();
      var fullUnicode_1 = require_fullUnicode();
      var CodePointsToString_1 = require_CodePointsToString();
      var SlicesForStringBuilder_1 = require_SlicesForStringBuilder();
      var safeObjectAssign = Object.assign;
      function fullUnicodeString(constraints = {}) {
        const charArbitrary = (0, fullUnicode_1.fullUnicode)();
        const experimentalCustomSlices = (0, SlicesForStringBuilder_1.createSlicesForString)(charArbitrary, CodePointsToString_1.codePointsToStringUnmapper);
        const enrichedConstraints = safeObjectAssign(safeObjectAssign({}, constraints), {
          experimentalCustomSlices
        });
        return (0, array_1.array)(charArbitrary, enrichedConstraints).map(CodePointsToString_1.codePointsToStringMapper, CodePointsToString_1.codePointsToStringUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/data/GraphemeRanges.js
  var require_GraphemeRanges = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/data/GraphemeRanges.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.autonomousDecomposableGraphemeRanges = exports.autonomousGraphemeRanges = exports.fullAlphabetRanges = exports.asciiAlphabetRanges = void 0;
      exports.asciiAlphabetRanges = [[0, 127]];
      exports.fullAlphabetRanges = [
        [0, 55295],
        [57344, 1114111]
      ];
      exports.autonomousGraphemeRanges = [
        [32, 126],
        [160, 172],
        [174, 767],
        [880, 887],
        [890, 895],
        [900, 906],
        [908],
        [910, 929],
        [931, 1154],
        [1162, 1327],
        [1329, 1366],
        [1369, 1418],
        [1421, 1423],
        [1470],
        [1472],
        [1475],
        [1478],
        [1488, 1514],
        [1519, 1524],
        [1542, 1551],
        [1563],
        [1565, 1610],
        [1632, 1647],
        [1649, 1749],
        [1758],
        [1765, 1766],
        [1769],
        [1774, 1805],
        [1808],
        [1810, 1839],
        [1869, 1957],
        [1969],
        [1984, 2026],
        [2036, 2042],
        [2046, 2069],
        [2074],
        [2084],
        [2088],
        [2096, 2110],
        [2112, 2136],
        [2142],
        [2144, 2154],
        [2160, 2190],
        [2208, 2249],
        [2308, 2361],
        [2365],
        [2384],
        [2392, 2401],
        [2404, 2432],
        [2437, 2444],
        [2447, 2448],
        [2451, 2472],
        [2474, 2480],
        [2482],
        [2486, 2489],
        [2493],
        [2510],
        [2524, 2525],
        [2527, 2529],
        [2534, 2557],
        [2565, 2570],
        [2575, 2576],
        [2579, 2600],
        [2602, 2608],
        [2610, 2611],
        [2613, 2614],
        [2616, 2617],
        [2649, 2652],
        [2654],
        [2662, 2671],
        [2674, 2676],
        [2678],
        [2693, 2701],
        [2703, 2705],
        [2707, 2728],
        [2730, 2736],
        [2738, 2739],
        [2741, 2745],
        [2749],
        [2768],
        [2784, 2785],
        [2790, 2801],
        [2809],
        [2821, 2828],
        [2831, 2832],
        [2835, 2856],
        [2858, 2864],
        [2866, 2867],
        [2869, 2873],
        [2877],
        [2908, 2909],
        [2911, 2913],
        [2918, 2935],
        [2947],
        [2949, 2954],
        [2958, 2960],
        [2962, 2965],
        [2969, 2970],
        [2972],
        [2974, 2975],
        [2979, 2980],
        [2984, 2986],
        [2990, 3001],
        [3024],
        [3046, 3066],
        [3077, 3084],
        [3086, 3088],
        [3090, 3112],
        [3114, 3129],
        [3133],
        [3160, 3162],
        [3165],
        [3168, 3169],
        [3174, 3183],
        [3191, 3200],
        [3204, 3212],
        [3214, 3216],
        [3218, 3240],
        [3242, 3251],
        [3253, 3257],
        [3261],
        [3293, 3294],
        [3296, 3297],
        [3302, 3311],
        [3313, 3314],
        [3332, 3340],
        [3342, 3344],
        [3346, 3386],
        [3389],
        [3407],
        [3412, 3414],
        [3416, 3425],
        [3430, 3455],
        [3461, 3478],
        [3482, 3505],
        [3507, 3515],
        [3517],
        [3520, 3526],
        [3558, 3567],
        [3572],
        [3585, 3632],
        [3634],
        [3647, 3654],
        [3663, 3675],
        [3713, 3714],
        [3716],
        [3718, 3722],
        [3724, 3747],
        [3749],
        [3751, 3760],
        [3762],
        [3773],
        [3776, 3780],
        [3782],
        [3792, 3801],
        [3804, 3807],
        [3840, 3863],
        [3866, 3892],
        [3894],
        [3896],
        [3898, 3901],
        [3904, 3911],
        [3913, 3948],
        [3973],
        [3976, 3980],
        [4030, 4037],
        [4039, 4044],
        [4046, 4058],
        [4096, 4138],
        [4159, 4181],
        [4186, 4189],
        [4193],
        [4197, 4198],
        [4206, 4208],
        [4213, 4225],
        [4238],
        [4240, 4249],
        [4254, 4293],
        [4295],
        [4301],
        [4304, 4351],
        [4608, 4680],
        [4682, 4685],
        [4688, 4694],
        [4696],
        [4698, 4701],
        [4704, 4744],
        [4746, 4749],
        [4752, 4784],
        [4786, 4789],
        [4792, 4798],
        [4800],
        [4802, 4805],
        [4808, 4822],
        [4824, 4880],
        [4882, 4885],
        [4888, 4954],
        [4960, 4988],
        [4992, 5017],
        [5024, 5109],
        [5112, 5117],
        [5120, 5788],
        [5792, 5880],
        [5888, 5905],
        [5919, 5937],
        [5941, 5942],
        [5952, 5969],
        [5984, 5996],
        [5998, 6e3],
        [6016, 6067],
        [6100, 6108],
        [6112, 6121],
        [6128, 6137],
        [6144, 6154],
        [6160, 6169],
        [6176, 6264],
        [6272, 6276],
        [6279, 6312],
        [6314],
        [6320, 6389],
        [6400, 6430],
        [6464],
        [6468, 6509],
        [6512, 6516],
        [6528, 6571],
        [6576, 6601],
        [6608, 6618],
        [6622, 6678],
        [6686, 6740],
        [6784, 6793],
        [6800, 6809],
        [6816, 6829],
        [6917, 6963],
        [6981, 6988],
        [6992, 7018],
        [7028, 7038],
        [7043, 7072],
        [7086, 7141],
        [7164, 7203],
        [7227, 7241],
        [7245, 7304],
        [7312, 7354],
        [7357, 7367],
        [7379],
        [7401, 7404],
        [7406, 7411],
        [7413, 7414],
        [7418],
        [7424, 7615],
        [7680, 7957],
        [7960, 7965],
        [7968, 8005],
        [8008, 8013],
        [8016, 8023],
        [8025],
        [8027],
        [8029],
        [8031, 8061],
        [8064, 8116],
        [8118, 8132],
        [8134, 8147],
        [8150, 8155],
        [8157, 8175],
        [8178, 8180],
        [8182, 8190],
        [8192, 8202],
        [8208, 8233],
        [8239, 8287],
        [8304, 8305],
        [8308, 8334],
        [8336, 8348],
        [8352, 8384],
        [8448, 8587],
        [8592, 9254],
        [9280, 9290],
        [9312, 11123],
        [11126, 11157],
        [11159, 11502],
        [11506, 11507],
        [11513, 11557],
        [11559],
        [11565],
        [11568, 11623],
        [11631, 11632],
        [11648, 11670],
        [11680, 11686],
        [11688, 11694],
        [11696, 11702],
        [11704, 11710],
        [11712, 11718],
        [11720, 11726],
        [11728, 11734],
        [11736, 11742],
        [11776, 11869],
        [11904, 11929],
        [11931, 12019],
        [12032, 12245],
        [12272, 12329],
        [12336, 12351],
        [12353, 12438],
        [12443, 12543],
        [12549, 12591],
        [12593, 12686],
        [12688, 12771],
        [12783, 12830],
        [12832, 13312],
        [19903, 19968],
        [40959, 42124],
        [42128, 42182],
        [42192, 42539],
        [42560, 42606],
        [42611],
        [42622, 42653],
        [42656, 42735],
        [42738, 42743],
        [42752, 42954],
        [42960, 42961],
        [42963],
        [42965, 42969],
        [42994, 43009],
        [43011, 43013],
        [43015, 43018],
        [43020, 43042],
        [43048, 43051],
        [43056, 43065],
        [43072, 43127],
        [43138, 43187],
        [43214, 43225],
        [43250, 43262],
        [43264, 43301],
        [43310, 43334],
        [43359],
        [43396, 43442],
        [43457, 43469],
        [43471, 43481],
        [43486, 43492],
        [43494, 43518],
        [43520, 43560],
        [43584, 43586],
        [43588, 43595],
        [43600, 43609],
        [43612, 43642],
        [43646, 43695],
        [43697],
        [43701, 43702],
        [43705, 43709],
        [43712],
        [43714],
        [43739, 43754],
        [43760, 43764],
        [43777, 43782],
        [43785, 43790],
        [43793, 43798],
        [43808, 43814],
        [43816, 43822],
        [43824, 43883],
        [43888, 44002],
        [44011],
        [44016, 44025],
        [44032],
        [55203],
        [63744, 64109],
        [64112, 64217],
        [64256, 64262],
        [64275, 64279],
        [64285],
        [64287, 64310],
        [64312, 64316],
        [64318],
        [64320, 64321],
        [64323, 64324],
        [64326, 64450],
        [64467, 64911],
        [64914, 64967],
        [64975],
        [65008, 65023],
        [65040, 65049],
        [65072, 65106],
        [65108, 65126],
        [65128, 65131],
        [65136, 65140],
        [65142, 65276],
        [65281, 65437],
        [65440, 65470],
        [65474, 65479],
        [65482, 65487],
        [65490, 65495],
        [65498, 65500],
        [65504, 65510],
        [65512, 65518],
        [65532, 65533],
        [65536, 65547],
        [65549, 65574],
        [65576, 65594],
        [65596, 65597],
        [65599, 65613],
        [65616, 65629],
        [65664, 65786],
        [65792, 65794],
        [65799, 65843],
        [65847, 65934],
        [65936, 65948],
        [65952],
        [66e3, 66044],
        [66176, 66204],
        [66208, 66256],
        [66273, 66299],
        [66304, 66339],
        [66349, 66378],
        [66384, 66421],
        [66432, 66461],
        [66463, 66499],
        [66504, 66517],
        [66560, 66717],
        [66720, 66729],
        [66736, 66771],
        [66776, 66811],
        [66816, 66855],
        [66864, 66915],
        [66927, 66938],
        [66940, 66954],
        [66956, 66962],
        [66964, 66965],
        [66967, 66977],
        [66979, 66993],
        [66995, 67001],
        [67003, 67004],
        [67072, 67382],
        [67392, 67413],
        [67424, 67431],
        [67456, 67461],
        [67463, 67504],
        [67506, 67514],
        [67584, 67589],
        [67592],
        [67594, 67637],
        [67639, 67640],
        [67644],
        [67647, 67669],
        [67671, 67742],
        [67751, 67759],
        [67808, 67826],
        [67828, 67829],
        [67835, 67867],
        [67871, 67897],
        [67903],
        [67968, 68023],
        [68028, 68047],
        [68050, 68096],
        [68112, 68115],
        [68117, 68119],
        [68121, 68149],
        [68160, 68168],
        [68176, 68184],
        [68192, 68255],
        [68288, 68324],
        [68331, 68342],
        [68352, 68405],
        [68409, 68437],
        [68440, 68466],
        [68472, 68497],
        [68505, 68508],
        [68521, 68527],
        [68608, 68680],
        [68736, 68786],
        [68800, 68850],
        [68858, 68899],
        [68912, 68921],
        [69216, 69246],
        [69248, 69289],
        [69293],
        [69296, 69297],
        [69376, 69415],
        [69424, 69445],
        [69457, 69465],
        [69488, 69505],
        [69510, 69513],
        [69552, 69579],
        [69600, 69622],
        [69635, 69687],
        [69703, 69709],
        [69714, 69743],
        [69745, 69746],
        [69749],
        [69763, 69807],
        [69819, 69820],
        [69822, 69825],
        [69840, 69864],
        [69872, 69881],
        [69891, 69926],
        [69942, 69956],
        [69959],
        [69968, 70002],
        [70004, 70006],
        [70019, 70066],
        [70081],
        [70084, 70088],
        [70093],
        [70096, 70111],
        [70113, 70132],
        [70144, 70161],
        [70163, 70187],
        [70200, 70205],
        [70207, 70208],
        [70272, 70278],
        [70280],
        [70282, 70285],
        [70287, 70301],
        [70303, 70313],
        [70320, 70366],
        [70384, 70393],
        [70405, 70412],
        [70415, 70416],
        [70419, 70440],
        [70442, 70448],
        [70450, 70451],
        [70453, 70457],
        [70461],
        [70480],
        [70493, 70497],
        [70656, 70708],
        [70727, 70747],
        [70749],
        [70751, 70753],
        [70784, 70831],
        [70852, 70855],
        [70864, 70873],
        [71040, 71086],
        [71105, 71131],
        [71168, 71215],
        [71233, 71236],
        [71248, 71257],
        [71264, 71276],
        [71296, 71338],
        [71352, 71353],
        [71360, 71369],
        [71424, 71450],
        [71472, 71494],
        [71680, 71723],
        [71739],
        [71840, 71922],
        [71935, 71942],
        [71945],
        [71948, 71955],
        [71957, 71958],
        [71960, 71983],
        [72004, 72006],
        [72016, 72025],
        [72096, 72103],
        [72106, 72144],
        [72161, 72163],
        [72192],
        [72203, 72242],
        [72255, 72262],
        [72272],
        [72284, 72323],
        [72346, 72354],
        [72368, 72440],
        [72448, 72457],
        [72704, 72712],
        [72714, 72750],
        [72768, 72773],
        [72784, 72812],
        [72816, 72847],
        [72960, 72966],
        [72968, 72969],
        [72971, 73008],
        [73040, 73049],
        [73056, 73061],
        [73063, 73064],
        [73066, 73097],
        [73112],
        [73120, 73129],
        [73440, 73458],
        [73463, 73464],
        [73476, 73488],
        [73490, 73523],
        [73539, 73561],
        [73648],
        [73664, 73713],
        [73727, 74649],
        [74752, 74862],
        [74864, 74868],
        [74880, 75075],
        [77712, 77810],
        [77824, 78895],
        [78913, 78918],
        [82944, 83526],
        [92160, 92728],
        [92736, 92766],
        [92768, 92777],
        [92782, 92862],
        [92864, 92873],
        [92880, 92909],
        [92917],
        [92928, 92975],
        [92983, 92997],
        [93008, 93017],
        [93019, 93025],
        [93027, 93047],
        [93053, 93071],
        [93760, 93850],
        [93952, 94026],
        [94032],
        [94099, 94111],
        [94176, 94179],
        [94208],
        [100343],
        [100352, 101589],
        [101632],
        [101640],
        [110576, 110579],
        [110581, 110587],
        [110589, 110590],
        [110592, 110882],
        [110898],
        [110928, 110930],
        [110933],
        [110948, 110951],
        [110960, 111355],
        [113664, 113770],
        [113776, 113788],
        [113792, 113800],
        [113808, 113817],
        [113820],
        [113823],
        [118608, 118723],
        [118784, 119029],
        [119040, 119078],
        [119081, 119140],
        [119146, 119148],
        [119171, 119172],
        [119180, 119209],
        [119214, 119274],
        [119296, 119361],
        [119365],
        [119488, 119507],
        [119520, 119539],
        [119552, 119638],
        [119648, 119672],
        [119808, 119892],
        [119894, 119964],
        [119966, 119967],
        [119970],
        [119973, 119974],
        [119977, 119980],
        [119982, 119993],
        [119995],
        [119997, 120003],
        [120005, 120069],
        [120071, 120074],
        [120077, 120084],
        [120086, 120092],
        [120094, 120121],
        [120123, 120126],
        [120128, 120132],
        [120134],
        [120138, 120144],
        [120146, 120485],
        [120488, 120779],
        [120782, 121343],
        [121399, 121402],
        [121453, 121460],
        [121462, 121475],
        [121477, 121483],
        [122624, 122654],
        [122661, 122666],
        [122928, 122989],
        [123136, 123180],
        [123191, 123197],
        [123200, 123209],
        [123214, 123215],
        [123536, 123565],
        [123584, 123627],
        [123632, 123641],
        [123647],
        [124112, 124139],
        [124144, 124153],
        [124896, 124902],
        [124904, 124907],
        [124909, 124910],
        [124912, 124926],
        [124928, 125124],
        [125127, 125135],
        [125184, 125251],
        [125259],
        [125264, 125273],
        [125278, 125279],
        [126065, 126132],
        [126209, 126269],
        [126464, 126467],
        [126469, 126495],
        [126497, 126498],
        [126500],
        [126503],
        [126505, 126514],
        [126516, 126519],
        [126521],
        [126523],
        [126530],
        [126535],
        [126537],
        [126539],
        [126541, 126543],
        [126545, 126546],
        [126548],
        [126551],
        [126553],
        [126555],
        [126557],
        [126559],
        [126561, 126562],
        [126564],
        [126567, 126570],
        [126572, 126578],
        [126580, 126583],
        [126585, 126588],
        [126590],
        [126592, 126601],
        [126603, 126619],
        [126625, 126627],
        [126629, 126633],
        [126635, 126651],
        [126704, 126705],
        [126976, 127019],
        [127024, 127123],
        [127136, 127150],
        [127153, 127167],
        [127169, 127183],
        [127185, 127221],
        [127232, 127405],
        [127488, 127490],
        [127504, 127547],
        [127552, 127560],
        [127568, 127569],
        [127584, 127589],
        [127744, 127994],
        [128e3, 128727],
        [128732, 128748],
        [128752, 128764],
        [128768, 128886],
        [128891, 128985],
        [128992, 129003],
        [129008],
        [129024, 129035],
        [129040, 129095],
        [129104, 129113],
        [129120, 129159],
        [129168, 129197],
        [129200, 129201],
        [129280, 129619],
        [129632, 129645],
        [129648, 129660],
        [129664, 129672],
        [129680, 129725],
        [129727, 129733],
        [129742, 129755],
        [129760, 129768],
        [129776, 129784],
        [129792, 129938],
        [129940, 129994],
        [130032, 130041],
        [131072],
        [173791],
        [173824],
        [177977],
        [177984],
        [178205],
        [178208],
        [183969],
        [183984],
        [191456],
        [191472],
        [192093],
        [194560, 195101],
        [196608],
        [201546],
        [201552],
        [205743]
      ];
      exports.autonomousDecomposableGraphemeRanges = [
        [192, 197],
        [199, 207],
        [209, 214],
        [217, 221],
        [224, 229],
        [231, 239],
        [241, 246],
        [249, 253],
        [255, 271],
        [274, 293],
        [296, 304],
        [308, 311],
        [313, 318],
        [323, 328],
        [332, 337],
        [340, 357],
        [360, 382],
        [416, 417],
        [431, 432],
        [461, 476],
        [478, 483],
        [486, 496],
        [500, 501],
        [504, 539],
        [542, 543],
        [550, 563],
        [901, 902],
        [904, 906],
        [908],
        [910, 912],
        [938, 944],
        [970, 974],
        [979, 980],
        [1024, 1025],
        [1027],
        [1031],
        [1036, 1038],
        [1049],
        [1081],
        [1104, 1105],
        [1107],
        [1111],
        [1116, 1118],
        [1142, 1143],
        [1217, 1218],
        [1232, 1235],
        [1238, 1239],
        [1242, 1247],
        [1250, 1255],
        [1258, 1269],
        [1272, 1273],
        [1570, 1574],
        [1728],
        [1730],
        [1747],
        [2345],
        [2353],
        [2356],
        [2392, 2399],
        [2524, 2525],
        [2527],
        [2611],
        [2614],
        [2649, 2651],
        [2654],
        [2908, 2909],
        [2964],
        [3907],
        [3917],
        [3922],
        [3927],
        [3932],
        [3945],
        [4134],
        [6918],
        [6920],
        [6922],
        [6924],
        [6926],
        [6930],
        [7680, 7833],
        [7835],
        [7840, 7929],
        [7936, 7957],
        [7960, 7965],
        [7968, 8005],
        [8008, 8013],
        [8016, 8023],
        [8025],
        [8027],
        [8029],
        [8031, 8048],
        [8050],
        [8052],
        [8054],
        [8056],
        [8058],
        [8060],
        [8064, 8116],
        [8118, 8122],
        [8124],
        [8129, 8132],
        [8134, 8136],
        [8138],
        [8140, 8146],
        [8150, 8154],
        [8157, 8162],
        [8164, 8170],
        [8172, 8173],
        [8178, 8180],
        [8182, 8184],
        [8186],
        [8188],
        [8602, 8603],
        [8622],
        [8653, 8655],
        [8708],
        [8713],
        [8716],
        [8740],
        [8742],
        [8769],
        [8772],
        [8775],
        [8777],
        [8800],
        [8802],
        [8813, 8817],
        [8820, 8821],
        [8824, 8825],
        [8832, 8833],
        [8836, 8837],
        [8840, 8841],
        [8876, 8879],
        [8928, 8931],
        [8938, 8941],
        [10972],
        [12364],
        [12366],
        [12368],
        [12370],
        [12372],
        [12374],
        [12376],
        [12378],
        [12380],
        [12382],
        [12384],
        [12386],
        [12389],
        [12391],
        [12393],
        [12400, 12401],
        [12403, 12404],
        [12406, 12407],
        [12409, 12410],
        [12412, 12413],
        [12436],
        [12446],
        [12460],
        [12462],
        [12464],
        [12466],
        [12468],
        [12470],
        [12472],
        [12474],
        [12476],
        [12478],
        [12480],
        [12482],
        [12485],
        [12487],
        [12489],
        [12496, 12497],
        [12499, 12500],
        [12502, 12503],
        [12505, 12506],
        [12508, 12509],
        [12532],
        [12535, 12538],
        [12542],
        [44032],
        [55203],
        [64285],
        [64287],
        [64298, 64310],
        [64312, 64316],
        [64318],
        [64320, 64321],
        [64323, 64324],
        [64326, 64334],
        [69786],
        [69788],
        [69803],
        [119134, 119140],
        [119227, 119232]
      ];
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/GraphemeRangesHelpers.js
  var require_GraphemeRangesHelpers = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/GraphemeRangesHelpers.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.convertGraphemeRangeToMapToConstantEntry = convertGraphemeRangeToMapToConstantEntry;
      exports.intersectGraphemeRanges = intersectGraphemeRanges;
      var safeStringFromCodePoint = String.fromCodePoint;
      var safeMathMin = Math.min;
      var safeMathMax = Math.max;
      function convertGraphemeRangeToMapToConstantEntry(range) {
        if (range.length === 1) {
          const codePointString = safeStringFromCodePoint(range[0]);
          return { num: 1, build: () => codePointString };
        }
        const rangeStart = range[0];
        return { num: range[1] - range[0] + 1, build: (idInGroup) => safeStringFromCodePoint(rangeStart + idInGroup) };
      }
      function intersectGraphemeRanges(rangesA, rangesB) {
        const mergedRanges = [];
        let cursorA = 0;
        let cursorB = 0;
        while (cursorA < rangesA.length && cursorB < rangesB.length) {
          const rangeA = rangesA[cursorA];
          const rangeAMin = rangeA[0];
          const rangeAMax = rangeA.length === 1 ? rangeA[0] : rangeA[1];
          const rangeB = rangesB[cursorB];
          const rangeBMin = rangeB[0];
          const rangeBMax = rangeB.length === 1 ? rangeB[0] : rangeB[1];
          if (rangeAMax < rangeBMin) {
            cursorA += 1;
          } else if (rangeBMax < rangeAMin) {
            cursorB += 1;
          } else {
            let min = safeMathMax(rangeAMin, rangeBMin);
            const max = safeMathMin(rangeAMax, rangeBMax);
            if (mergedRanges.length >= 1) {
              const lastMergedRange = mergedRanges[mergedRanges.length - 1];
              const lastMergedRangeMax = lastMergedRange.length === 1 ? lastMergedRange[0] : lastMergedRange[1];
              if (lastMergedRangeMax + 1 === min) {
                min = lastMergedRange[0];
                mergedRanges.pop();
              }
            }
            mergedRanges.push(min === max ? [min] : [min, max]);
            if (rangeAMax <= max) {
              cursorA += 1;
            }
            if (rangeBMax <= max) {
              cursorB += 1;
            }
          }
        }
        return mergedRanges;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/StringUnitArbitrary.js
  var require_StringUnitArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/StringUnitArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.stringUnit = stringUnit;
      var mapToConstant_1 = require_mapToConstant();
      var GraphemeRanges_1 = require_GraphemeRanges();
      var GraphemeRangesHelpers_1 = require_GraphemeRangesHelpers();
      var registeredStringUnitInstancesMap = /* @__PURE__ */ Object.create(null);
      function getAlphabetRanges(alphabet) {
        switch (alphabet) {
          case "full":
            return GraphemeRanges_1.fullAlphabetRanges;
          case "ascii":
            return GraphemeRanges_1.asciiAlphabetRanges;
        }
      }
      function getOrCreateStringUnitInstance(type, alphabet) {
        const key = `${type}:${alphabet}`;
        const registered = registeredStringUnitInstancesMap[key];
        if (registered !== void 0) {
          return registered;
        }
        const alphabetRanges = getAlphabetRanges(alphabet);
        const ranges = type === "binary" ? alphabetRanges : (0, GraphemeRangesHelpers_1.intersectGraphemeRanges)(alphabetRanges, GraphemeRanges_1.autonomousGraphemeRanges);
        const entries = [];
        for (const range of ranges) {
          entries.push((0, GraphemeRangesHelpers_1.convertGraphemeRangeToMapToConstantEntry)(range));
        }
        if (type === "grapheme") {
          const decomposedRanges = (0, GraphemeRangesHelpers_1.intersectGraphemeRanges)(alphabetRanges, GraphemeRanges_1.autonomousDecomposableGraphemeRanges);
          for (const range of decomposedRanges) {
            const rawEntry = (0, GraphemeRangesHelpers_1.convertGraphemeRangeToMapToConstantEntry)(range);
            entries.push({
              num: rawEntry.num,
              build: (idInGroup) => rawEntry.build(idInGroup).normalize("NFD")
            });
          }
        }
        const stringUnitInstance = (0, mapToConstant_1.mapToConstant)(...entries);
        registeredStringUnitInstancesMap[key] = stringUnitInstance;
        return stringUnitInstance;
      }
      function stringUnit(type, alphabet) {
        return getOrCreateStringUnitInstance(type, alphabet);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/string.js
  var require_string = __commonJS({
    "node_modules/fast-check/lib/arbitrary/string.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.string = string;
      var array_1 = require_array();
      var SlicesForStringBuilder_1 = require_SlicesForStringBuilder();
      var StringUnitArbitrary_1 = require_StringUnitArbitrary();
      var PatternsToString_1 = require_PatternsToString();
      var safeObjectAssign = Object.assign;
      function extractUnitArbitrary(constraints) {
        if (typeof constraints.unit === "object") {
          return constraints.unit;
        }
        switch (constraints.unit) {
          case "grapheme":
            return (0, StringUnitArbitrary_1.stringUnit)("grapheme", "full");
          case "grapheme-composite":
            return (0, StringUnitArbitrary_1.stringUnit)("composite", "full");
          case "grapheme-ascii":
          case void 0:
            return (0, StringUnitArbitrary_1.stringUnit)("grapheme", "ascii");
          case "binary":
            return (0, StringUnitArbitrary_1.stringUnit)("binary", "full");
          case "binary-ascii":
            return (0, StringUnitArbitrary_1.stringUnit)("binary", "ascii");
        }
      }
      function string(constraints = {}) {
        const charArbitrary = extractUnitArbitrary(constraints);
        const unmapper = (0, PatternsToString_1.patternsToStringUnmapperFor)(charArbitrary, constraints);
        const experimentalCustomSlices = (0, SlicesForStringBuilder_1.createSlicesForString)(charArbitrary, unmapper);
        const enrichedConstraints = safeObjectAssign(safeObjectAssign({}, constraints), {
          experimentalCustomSlices
        });
        return (0, array_1.array)(charArbitrary, enrichedConstraints).map(PatternsToString_1.patternsToStringMapper, unmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/UnboxedToBoxed.js
  var require_UnboxedToBoxed = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/UnboxedToBoxed.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.unboxedToBoxedMapper = unboxedToBoxedMapper;
      exports.unboxedToBoxedUnmapper = unboxedToBoxedUnmapper;
      var globals_1 = require_globals();
      function unboxedToBoxedMapper(value) {
        switch (typeof value) {
          case "boolean":
            return new globals_1.Boolean(value);
          case "number":
            return new globals_1.Number(value);
          case "string":
            return new globals_1.String(value);
          default:
            return value;
        }
      }
      function unboxedToBoxedUnmapper(value) {
        if (typeof value !== "object" || value === null || !("constructor" in value)) {
          return value;
        }
        return value.constructor === globals_1.Boolean || value.constructor === globals_1.Number || value.constructor === globals_1.String ? value.valueOf() : value;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/BoxedArbitraryBuilder.js
  var require_BoxedArbitraryBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/BoxedArbitraryBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.boxedArbitraryBuilder = boxedArbitraryBuilder;
      var UnboxedToBoxed_1 = require_UnboxedToBoxed();
      function boxedArbitraryBuilder(arb) {
        return arb.map(UnboxedToBoxed_1.unboxedToBoxedMapper, UnboxedToBoxed_1.unboxedToBoxedUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/QualifiedObjectConstraints.js
  var require_QualifiedObjectConstraints = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/QualifiedObjectConstraints.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.toQualifiedObjectConstraints = toQualifiedObjectConstraints;
      var boolean_1 = require_boolean();
      var constant_1 = require_constant();
      var double_1 = require_double();
      var fullUnicodeString_1 = require_fullUnicodeString();
      var maxSafeInteger_1 = require_maxSafeInteger();
      var oneof_1 = require_oneof();
      var string_1 = require_string();
      var BoxedArbitraryBuilder_1 = require_BoxedArbitraryBuilder();
      function defaultValues(constraints, stringArbitrary) {
        return [
          (0, boolean_1.boolean)(),
          (0, maxSafeInteger_1.maxSafeInteger)(),
          (0, double_1.double)(),
          stringArbitrary(constraints),
          (0, oneof_1.oneof)(stringArbitrary(constraints), (0, constant_1.constant)(null), (0, constant_1.constant)(void 0))
        ];
      }
      function boxArbitraries(arbs) {
        return arbs.map((arb) => (0, BoxedArbitraryBuilder_1.boxedArbitraryBuilder)(arb));
      }
      function boxArbitrariesIfNeeded(arbs, boxEnabled) {
        return boxEnabled ? boxArbitraries(arbs).concat(arbs) : arbs;
      }
      function toQualifiedObjectConstraints(settings = {}) {
        function orDefault(optionalValue, defaultValue) {
          return optionalValue !== void 0 ? optionalValue : defaultValue;
        }
        const stringArbitrary = settings.withUnicodeString ? fullUnicodeString_1.fullUnicodeString : string_1.string;
        const valueConstraints = { size: settings.size };
        return {
          key: orDefault(settings.key, stringArbitrary(valueConstraints)),
          values: boxArbitrariesIfNeeded(orDefault(settings.values, defaultValues(valueConstraints, stringArbitrary)), orDefault(settings.withBoxedValues, false)),
          depthSize: settings.depthSize,
          maxDepth: settings.maxDepth,
          maxKeys: settings.maxKeys,
          size: settings.size,
          withSet: orDefault(settings.withSet, false),
          withMap: orDefault(settings.withMap, false),
          withObjectString: orDefault(settings.withObjectString, false),
          withNullPrototype: orDefault(settings.withNullPrototype, false),
          withBigInt: orDefault(settings.withBigInt, false),
          withDate: orDefault(settings.withDate, false),
          withTypedArray: orDefault(settings.withTypedArray, false),
          withSparseArray: orDefault(settings.withSparseArray, false)
        };
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/object.js
  var require_object = __commonJS({
    "node_modules/fast-check/lib/arbitrary/object.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.object = object;
      var dictionary_1 = require_dictionary();
      var AnyArbitraryBuilder_1 = require_AnyArbitraryBuilder();
      var QualifiedObjectConstraints_1 = require_QualifiedObjectConstraints();
      function objectInternal(constraints) {
        return (0, dictionary_1.dictionary)(constraints.key, (0, AnyArbitraryBuilder_1.anyArbitraryBuilder)(constraints), {
          maxKeys: constraints.maxKeys,
          noNullPrototype: !constraints.withNullPrototype,
          size: constraints.size
        });
      }
      function object(constraints) {
        return objectInternal((0, QualifiedObjectConstraints_1.toQualifiedObjectConstraints)(constraints));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/JsonConstraintsBuilder.js
  var require_JsonConstraintsBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/JsonConstraintsBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.jsonConstraintsBuilder = jsonConstraintsBuilder;
      var boolean_1 = require_boolean();
      var constant_1 = require_constant();
      var double_1 = require_double();
      function jsonConstraintsBuilder(stringArbitrary, constraints) {
        const { depthSize, maxDepth } = constraints;
        const key = stringArbitrary;
        const values = [
          (0, boolean_1.boolean)(),
          (0, double_1.double)({ noDefaultInfinity: true, noNaN: true }),
          stringArbitrary,
          (0, constant_1.constant)(null)
        ];
        return { key, values, depthSize, maxDepth };
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/anything.js
  var require_anything = __commonJS({
    "node_modules/fast-check/lib/arbitrary/anything.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.anything = anything;
      var AnyArbitraryBuilder_1 = require_AnyArbitraryBuilder();
      var QualifiedObjectConstraints_1 = require_QualifiedObjectConstraints();
      function anything(constraints) {
        return (0, AnyArbitraryBuilder_1.anyArbitraryBuilder)((0, QualifiedObjectConstraints_1.toQualifiedObjectConstraints)(constraints));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/jsonValue.js
  var require_jsonValue = __commonJS({
    "node_modules/fast-check/lib/arbitrary/jsonValue.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.jsonValue = jsonValue;
      var string_1 = require_string();
      var JsonConstraintsBuilder_1 = require_JsonConstraintsBuilder();
      var anything_1 = require_anything();
      var fullUnicodeString_1 = require_fullUnicodeString();
      function jsonValue(constraints = {}) {
        const noUnicodeString = constraints.noUnicodeString === void 0 || constraints.noUnicodeString === true;
        const stringArbitrary = noUnicodeString ? (0, string_1.string)() : (0, fullUnicodeString_1.fullUnicodeString)();
        return (0, anything_1.anything)((0, JsonConstraintsBuilder_1.jsonConstraintsBuilder)(stringArbitrary, constraints));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/json.js
  var require_json = __commonJS({
    "node_modules/fast-check/lib/arbitrary/json.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.json = json;
      var jsonValue_1 = require_jsonValue();
      function json(constraints = {}) {
        const arb = (0, jsonValue_1.jsonValue)(constraints);
        return arb.map(JSON.stringify);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/unicodeString.js
  var require_unicodeString = __commonJS({
    "node_modules/fast-check/lib/arbitrary/unicodeString.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.unicodeString = unicodeString;
      var array_1 = require_array();
      var unicode_1 = require_unicode();
      var CodePointsToString_1 = require_CodePointsToString();
      var SlicesForStringBuilder_1 = require_SlicesForStringBuilder();
      var safeObjectAssign = Object.assign;
      function unicodeString(constraints = {}) {
        const charArbitrary = (0, unicode_1.unicode)();
        const experimentalCustomSlices = (0, SlicesForStringBuilder_1.createSlicesForString)(charArbitrary, CodePointsToString_1.codePointsToStringUnmapper);
        const enrichedConstraints = safeObjectAssign(safeObjectAssign({}, constraints), {
          experimentalCustomSlices
        });
        return (0, array_1.array)(charArbitrary, enrichedConstraints).map(CodePointsToString_1.codePointsToStringMapper, CodePointsToString_1.codePointsToStringUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/unicodeJsonValue.js
  var require_unicodeJsonValue = __commonJS({
    "node_modules/fast-check/lib/arbitrary/unicodeJsonValue.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.unicodeJsonValue = unicodeJsonValue;
      var unicodeString_1 = require_unicodeString();
      var JsonConstraintsBuilder_1 = require_JsonConstraintsBuilder();
      var anything_1 = require_anything();
      function unicodeJsonValue(constraints = {}) {
        return (0, anything_1.anything)((0, JsonConstraintsBuilder_1.jsonConstraintsBuilder)((0, unicodeString_1.unicodeString)(), constraints));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/unicodeJson.js
  var require_unicodeJson = __commonJS({
    "node_modules/fast-check/lib/arbitrary/unicodeJson.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.unicodeJson = unicodeJson;
      var unicodeJsonValue_1 = require_unicodeJsonValue();
      function unicodeJson(constraints = {}) {
        const arb = (0, unicodeJsonValue_1.unicodeJsonValue)(constraints);
        return arb.map(JSON.stringify);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/EnumerableKeysExtractor.js
  var require_EnumerableKeysExtractor = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/EnumerableKeysExtractor.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.extractEnumerableKeys = extractEnumerableKeys;
      var safeObjectKeys = Object.keys;
      var safeObjectGetOwnPropertySymbols = Object.getOwnPropertySymbols;
      var safeObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      function extractEnumerableKeys(instance) {
        const keys = safeObjectKeys(instance);
        const symbols = safeObjectGetOwnPropertySymbols(instance);
        for (let index = 0; index !== symbols.length; ++index) {
          const symbol = symbols[index];
          const descriptor = safeObjectGetOwnPropertyDescriptor(instance, symbol);
          if (descriptor && descriptor.enumerable) {
            keys.push(symbol);
          }
        }
        return keys;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/ValuesAndSeparateKeysToObject.js
  var require_ValuesAndSeparateKeysToObject = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/ValuesAndSeparateKeysToObject.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildValuesAndSeparateKeysToObjectMapper = buildValuesAndSeparateKeysToObjectMapper;
      exports.buildValuesAndSeparateKeysToObjectUnmapper = buildValuesAndSeparateKeysToObjectUnmapper;
      var globals_1 = require_globals();
      var safeObjectCreate = Object.create;
      var safeObjectDefineProperty = Object.defineProperty;
      var safeObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var safeObjectGetOwnPropertyNames = Object.getOwnPropertyNames;
      var safeObjectGetOwnPropertySymbols = Object.getOwnPropertySymbols;
      function buildValuesAndSeparateKeysToObjectMapper(keys, noKeyValue) {
        return function valuesAndSeparateKeysToObjectMapper(definition) {
          const obj = definition[1] ? safeObjectCreate(null) : {};
          for (let idx = 0; idx !== keys.length; ++idx) {
            const valueWrapper = definition[0][idx];
            if (valueWrapper !== noKeyValue) {
              safeObjectDefineProperty(obj, keys[idx], {
                value: valueWrapper,
                configurable: true,
                enumerable: true,
                writable: true
              });
            }
          }
          return obj;
        };
      }
      function buildValuesAndSeparateKeysToObjectUnmapper(keys, noKeyValue) {
        return function valuesAndSeparateKeysToObjectUnmapper(value) {
          if (typeof value !== "object" || value === null) {
            throw new Error("Incompatible instance received: should be a non-null object");
          }
          const hasNullPrototype = Object.getPrototypeOf(value) === null;
          const hasObjectPrototype = "constructor" in value && value.constructor === Object;
          if (!hasNullPrototype && !hasObjectPrototype) {
            throw new Error("Incompatible instance received: should be of exact type Object");
          }
          let extractedPropertiesCount = 0;
          const extractedValues = [];
          for (let idx = 0; idx !== keys.length; ++idx) {
            const descriptor = safeObjectGetOwnPropertyDescriptor(value, keys[idx]);
            if (descriptor !== void 0) {
              if (!descriptor.configurable || !descriptor.enumerable || !descriptor.writable) {
                throw new Error("Incompatible instance received: should contain only c/e/w properties");
              }
              if (descriptor.get !== void 0 || descriptor.set !== void 0) {
                throw new Error("Incompatible instance received: should contain only no get/set properties");
              }
              ++extractedPropertiesCount;
              (0, globals_1.safePush)(extractedValues, descriptor.value);
            } else {
              (0, globals_1.safePush)(extractedValues, noKeyValue);
            }
          }
          const namePropertiesCount = safeObjectGetOwnPropertyNames(value).length;
          const symbolPropertiesCount = safeObjectGetOwnPropertySymbols(value).length;
          if (extractedPropertiesCount !== namePropertiesCount + symbolPropertiesCount) {
            throw new Error("Incompatible instance received: should not contain extra properties");
          }
          return [extractedValues, hasNullPrototype];
        };
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/PartialRecordArbitraryBuilder.js
  var require_PartialRecordArbitraryBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/PartialRecordArbitraryBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildPartialRecordArbitrary = buildPartialRecordArbitrary;
      var globals_1 = require_globals();
      var boolean_1 = require_boolean();
      var constant_1 = require_constant();
      var option_1 = require_option();
      var tuple_1 = require_tuple();
      var EnumerableKeysExtractor_1 = require_EnumerableKeysExtractor();
      var ValuesAndSeparateKeysToObject_1 = require_ValuesAndSeparateKeysToObject();
      var noKeyValue = /* @__PURE__ */ Symbol("no-key");
      function buildPartialRecordArbitrary(recordModel, requiredKeys, noNullPrototype) {
        const keys = (0, EnumerableKeysExtractor_1.extractEnumerableKeys)(recordModel);
        const arbs = [];
        for (let index = 0; index !== keys.length; ++index) {
          const k = keys[index];
          const requiredArbitrary = recordModel[k];
          if (requiredKeys === void 0 || (0, globals_1.safeIndexOf)(requiredKeys, k) !== -1) {
            (0, globals_1.safePush)(arbs, requiredArbitrary);
          } else {
            (0, globals_1.safePush)(arbs, (0, option_1.option)(requiredArbitrary, { nil: noKeyValue }));
          }
        }
        return (0, tuple_1.tuple)((0, tuple_1.tuple)(...arbs), noNullPrototype ? (0, constant_1.constant)(false) : (0, boolean_1.boolean)()).map((0, ValuesAndSeparateKeysToObject_1.buildValuesAndSeparateKeysToObjectMapper)(keys, noKeyValue), (0, ValuesAndSeparateKeysToObject_1.buildValuesAndSeparateKeysToObjectUnmapper)(keys, noKeyValue));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/record.js
  var require_record = __commonJS({
    "node_modules/fast-check/lib/arbitrary/record.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.record = record;
      var PartialRecordArbitraryBuilder_1 = require_PartialRecordArbitraryBuilder();
      function record(recordModel, constraints) {
        const noNullPrototype = constraints === void 0 || constraints.noNullPrototype === void 0 || constraints.noNullPrototype;
        if (constraints == null) {
          return (0, PartialRecordArbitraryBuilder_1.buildPartialRecordArbitrary)(recordModel, void 0, noNullPrototype);
        }
        if ("withDeletedKeys" in constraints && "requiredKeys" in constraints) {
          throw new Error(`requiredKeys and withDeletedKeys cannot be used together in fc.record`);
        }
        const requireDeletedKeys = "requiredKeys" in constraints && constraints.requiredKeys !== void 0 || "withDeletedKeys" in constraints && !!constraints.withDeletedKeys;
        if (!requireDeletedKeys) {
          return (0, PartialRecordArbitraryBuilder_1.buildPartialRecordArbitrary)(recordModel, void 0, noNullPrototype);
        }
        const requiredKeys = ("requiredKeys" in constraints ? constraints.requiredKeys : void 0) || [];
        for (let idx = 0; idx !== requiredKeys.length; ++idx) {
          const descriptor = Object.getOwnPropertyDescriptor(recordModel, requiredKeys[idx]);
          if (descriptor === void 0) {
            throw new Error(`requiredKeys cannot reference keys that have not been defined in recordModel`);
          }
          if (!descriptor.enumerable) {
            throw new Error(`requiredKeys cannot reference keys that have are enumerable in recordModel`);
          }
        }
        return (0, PartialRecordArbitraryBuilder_1.buildPartialRecordArbitrary)(recordModel, requiredKeys, noNullPrototype);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/StreamArbitrary.js
  var require_StreamArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/StreamArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.StreamArbitrary = void 0;
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var symbols_1 = require_symbols();
      var Stream_1 = require_Stream();
      var globals_1 = require_globals();
      var stringify_1 = require_stringify();
      var safeObjectDefineProperties = Object.defineProperties;
      function prettyPrint(seenValuesStrings) {
        return `Stream(${(0, globals_1.safeJoin)(seenValuesStrings, ",")}\u2026)`;
      }
      var StreamArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor(arb) {
          super();
          this.arb = arb;
        }
        generate(mrng, biasFactor) {
          const appliedBiasFactor = biasFactor !== void 0 && mrng.nextInt(1, biasFactor) === 1 ? biasFactor : void 0;
          const enrichedProducer = () => {
            const seenValues = [];
            const g = function* (arb, clonedMrng) {
              while (true) {
                const value = arb.generate(clonedMrng, appliedBiasFactor).value;
                (0, globals_1.safePush)(seenValues, value);
                yield value;
              }
            };
            const s = new Stream_1.Stream(g(this.arb, mrng.clone()));
            return safeObjectDefineProperties(s, {
              toString: { value: () => prettyPrint(seenValues.map(stringify_1.stringify)) },
              [stringify_1.toStringMethod]: { value: () => prettyPrint(seenValues.map(stringify_1.stringify)) },
              [stringify_1.asyncToStringMethod]: { value: async () => prettyPrint(await Promise.all(seenValues.map(stringify_1.asyncStringify))) },
              [symbols_1.cloneMethod]: { value: enrichedProducer, enumerable: true }
            });
          };
          return new Value_1.Value(enrichedProducer(), void 0);
        }
        canShrinkWithoutContext(value) {
          return false;
        }
        shrink(_value, _context) {
          return Stream_1.Stream.nil();
        }
      };
      exports.StreamArbitrary = StreamArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/infiniteStream.js
  var require_infiniteStream = __commonJS({
    "node_modules/fast-check/lib/arbitrary/infiniteStream.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.infiniteStream = infiniteStream;
      var StreamArbitrary_1 = require_StreamArbitrary();
      function infiniteStream(arb) {
        return new StreamArbitrary_1.StreamArbitrary(arb);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/asciiString.js
  var require_asciiString = __commonJS({
    "node_modules/fast-check/lib/arbitrary/asciiString.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.asciiString = asciiString;
      var array_1 = require_array();
      var ascii_1 = require_ascii();
      var CodePointsToString_1 = require_CodePointsToString();
      var SlicesForStringBuilder_1 = require_SlicesForStringBuilder();
      var safeObjectAssign = Object.assign;
      function asciiString(constraints = {}) {
        const charArbitrary = (0, ascii_1.ascii)();
        const experimentalCustomSlices = (0, SlicesForStringBuilder_1.createSlicesForString)(charArbitrary, CodePointsToString_1.codePointsToStringUnmapper);
        const enrichedConstraints = safeObjectAssign(safeObjectAssign({}, constraints), {
          experimentalCustomSlices
        });
        return (0, array_1.array)(charArbitrary, enrichedConstraints).map(CodePointsToString_1.codePointsToStringMapper, CodePointsToString_1.codePointsToStringUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/StringToBase64.js
  var require_StringToBase64 = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/StringToBase64.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.stringToBase64Mapper = stringToBase64Mapper;
      exports.stringToBase64Unmapper = stringToBase64Unmapper;
      var globals_1 = require_globals();
      function stringToBase64Mapper(s) {
        switch (s.length % 4) {
          case 0:
            return s;
          case 3:
            return `${s}=`;
          case 2:
            return `${s}==`;
          default:
            return (0, globals_1.safeSubstring)(s, 1);
        }
      }
      function stringToBase64Unmapper(value) {
        if (typeof value !== "string" || value.length % 4 !== 0) {
          throw new Error("Invalid string received");
        }
        const lastTrailingIndex = value.indexOf("=");
        if (lastTrailingIndex === -1) {
          return value;
        }
        const numTrailings = value.length - lastTrailingIndex;
        if (numTrailings > 2) {
          throw new Error("Cannot unmap the passed value");
        }
        return (0, globals_1.safeSubstring)(value, 0, lastTrailingIndex);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/base64String.js
  var require_base64String = __commonJS({
    "node_modules/fast-check/lib/arbitrary/base64String.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.base64String = base64String;
      var array_1 = require_array();
      var base64_1 = require_base64();
      var MaxLengthFromMinLength_1 = require_MaxLengthFromMinLength();
      var CodePointsToString_1 = require_CodePointsToString();
      var StringToBase64_1 = require_StringToBase64();
      var SlicesForStringBuilder_1 = require_SlicesForStringBuilder();
      function base64String(constraints = {}) {
        const { minLength: unscaledMinLength = 0, maxLength: unscaledMaxLength = MaxLengthFromMinLength_1.MaxLengthUpperBound, size } = constraints;
        const minLength = unscaledMinLength + 3 - (unscaledMinLength + 3) % 4;
        const maxLength = unscaledMaxLength - unscaledMaxLength % 4;
        const requestedSize = constraints.maxLength === void 0 && size === void 0 ? "=" : size;
        if (minLength > maxLength)
          throw new Error("Minimal length should be inferior or equal to maximal length");
        if (minLength % 4 !== 0)
          throw new Error("Minimal length of base64 strings must be a multiple of 4");
        if (maxLength % 4 !== 0)
          throw new Error("Maximal length of base64 strings must be a multiple of 4");
        const charArbitrary = (0, base64_1.base64)();
        const experimentalCustomSlices = (0, SlicesForStringBuilder_1.createSlicesForString)(charArbitrary, CodePointsToString_1.codePointsToStringUnmapper);
        const enrichedConstraints = {
          minLength,
          maxLength,
          size: requestedSize,
          experimentalCustomSlices
        };
        return (0, array_1.array)(charArbitrary, enrichedConstraints).map(CodePointsToString_1.codePointsToStringMapper, CodePointsToString_1.codePointsToStringUnmapper).map(StringToBase64_1.stringToBase64Mapper, StringToBase64_1.stringToBase64Unmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/CharsToString.js
  var require_CharsToString = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/CharsToString.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.charsToStringMapper = charsToStringMapper;
      exports.charsToStringUnmapper = charsToStringUnmapper;
      var globals_1 = require_globals();
      function charsToStringMapper(tab) {
        return (0, globals_1.safeJoin)(tab, "");
      }
      function charsToStringUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Cannot unmap the passed value");
        }
        return (0, globals_1.safeSplit)(value, "");
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/string16bits.js
  var require_string16bits = __commonJS({
    "node_modules/fast-check/lib/arbitrary/string16bits.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.string16bits = string16bits;
      var array_1 = require_array();
      var char16bits_1 = require_char16bits();
      var CharsToString_1 = require_CharsToString();
      var SlicesForStringBuilder_1 = require_SlicesForStringBuilder();
      var safeObjectAssign = Object.assign;
      function string16bits(constraints = {}) {
        const charArbitrary = (0, char16bits_1.char16bits)();
        const experimentalCustomSlices = (0, SlicesForStringBuilder_1.createSlicesForString)(charArbitrary, CharsToString_1.charsToStringUnmapper);
        const enrichedConstraints = safeObjectAssign(safeObjectAssign({}, constraints), {
          experimentalCustomSlices
        });
        return (0, array_1.array)(charArbitrary, enrichedConstraints).map(CharsToString_1.charsToStringMapper, CharsToString_1.charsToStringUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/IsSubarrayOf.js
  var require_IsSubarrayOf = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/IsSubarrayOf.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.isSubarrayOf = isSubarrayOf;
      function isSubarrayOf(source, small) {
        const countMap = /* @__PURE__ */ new Map();
        let countMinusZero = 0;
        for (const sourceEntry of source) {
          if (Object.is(sourceEntry, -0)) {
            ++countMinusZero;
          } else {
            const oldCount = countMap.get(sourceEntry) || 0;
            countMap.set(sourceEntry, oldCount + 1);
          }
        }
        for (let index = 0; index !== small.length; ++index) {
          if (!(index in small)) {
            return false;
          }
          const smallEntry = small[index];
          if (Object.is(smallEntry, -0)) {
            if (countMinusZero === 0)
              return false;
            --countMinusZero;
          } else {
            const oldCount = countMap.get(smallEntry) || 0;
            if (oldCount === 0)
              return false;
            countMap.set(smallEntry, oldCount - 1);
          }
        }
        return true;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/SubarrayArbitrary.js
  var require_SubarrayArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/SubarrayArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SubarrayArbitrary = void 0;
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var LazyIterableIterator_1 = require_LazyIterableIterator();
      var Stream_1 = require_Stream();
      var globals_1 = require_globals();
      var IsSubarrayOf_1 = require_IsSubarrayOf();
      var IntegerArbitrary_1 = require_IntegerArbitrary();
      var safeMathFloor = Math.floor;
      var safeMathLog = Math.log;
      var safeArrayIsArray = Array.isArray;
      var SubarrayArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor(originalArray, isOrdered, minLength, maxLength) {
          super();
          this.originalArray = originalArray;
          this.isOrdered = isOrdered;
          this.minLength = minLength;
          this.maxLength = maxLength;
          if (minLength < 0 || minLength > originalArray.length)
            throw new Error("fc.*{s|S}ubarrayOf expects the minimal length to be between 0 and the size of the original array");
          if (maxLength < 0 || maxLength > originalArray.length)
            throw new Error("fc.*{s|S}ubarrayOf expects the maximal length to be between 0 and the size of the original array");
          if (minLength > maxLength)
            throw new Error("fc.*{s|S}ubarrayOf expects the minimal length to be inferior or equal to the maximal length");
          this.lengthArb = new IntegerArbitrary_1.IntegerArbitrary(minLength, maxLength);
          this.biasedLengthArb = minLength !== maxLength ? new IntegerArbitrary_1.IntegerArbitrary(minLength, minLength + safeMathFloor(safeMathLog(maxLength - minLength) / safeMathLog(2))) : this.lengthArb;
        }
        generate(mrng, biasFactor) {
          const lengthArb = biasFactor !== void 0 && mrng.nextInt(1, biasFactor) === 1 ? this.biasedLengthArb : this.lengthArb;
          const size = lengthArb.generate(mrng, void 0);
          const sizeValue = size.value;
          const remainingElements = (0, globals_1.safeMap)(this.originalArray, (_v, idx) => idx);
          const ids = [];
          for (let index = 0; index !== sizeValue; ++index) {
            const selectedIdIndex = mrng.nextInt(0, remainingElements.length - 1);
            (0, globals_1.safePush)(ids, remainingElements[selectedIdIndex]);
            (0, globals_1.safeSplice)(remainingElements, selectedIdIndex, 1);
          }
          if (this.isOrdered) {
            (0, globals_1.safeSort)(ids, (a, b) => a - b);
          }
          return new Value_1.Value((0, globals_1.safeMap)(ids, (i) => this.originalArray[i]), size.context);
        }
        canShrinkWithoutContext(value) {
          if (!safeArrayIsArray(value)) {
            return false;
          }
          if (!this.lengthArb.canShrinkWithoutContext(value.length)) {
            return false;
          }
          return (0, IsSubarrayOf_1.isSubarrayOf)(this.originalArray, value);
        }
        shrink(value, context) {
          if (value.length === 0) {
            return Stream_1.Stream.nil();
          }
          return this.lengthArb.shrink(value.length, context).map((newSize) => {
            return new Value_1.Value((0, globals_1.safeSlice)(value, value.length - newSize.value), newSize.context);
          }).join(value.length > this.minLength ? (0, LazyIterableIterator_1.makeLazy)(() => this.shrink((0, globals_1.safeSlice)(value, 1), void 0).filter((newValue) => this.minLength <= newValue.value.length + 1).map((newValue) => new Value_1.Value([value[0], ...newValue.value], void 0))) : Stream_1.Stream.nil());
        }
      };
      exports.SubarrayArbitrary = SubarrayArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/subarray.js
  var require_subarray = __commonJS({
    "node_modules/fast-check/lib/arbitrary/subarray.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.subarray = subarray;
      var SubarrayArbitrary_1 = require_SubarrayArbitrary();
      function subarray(originalArray, constraints = {}) {
        const { minLength = 0, maxLength = originalArray.length } = constraints;
        return new SubarrayArbitrary_1.SubarrayArbitrary(originalArray, true, minLength, maxLength);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/shuffledSubarray.js
  var require_shuffledSubarray = __commonJS({
    "node_modules/fast-check/lib/arbitrary/shuffledSubarray.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.shuffledSubarray = shuffledSubarray;
      var SubarrayArbitrary_1 = require_SubarrayArbitrary();
      function shuffledSubarray(originalArray, constraints = {}) {
        const { minLength = 0, maxLength = originalArray.length } = constraints;
        return new SubarrayArbitrary_1.SubarrayArbitrary(originalArray, false, minLength, maxLength);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/UintToBase32String.js
  var require_UintToBase32String = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/UintToBase32String.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.uintToBase32StringMapper = uintToBase32StringMapper;
      exports.paddedUintToBase32StringMapper = paddedUintToBase32StringMapper;
      exports.uintToBase32StringUnmapper = uintToBase32StringUnmapper;
      var globals_1 = require_globals();
      var encodeSymbolLookupTable = {
        10: "A",
        11: "B",
        12: "C",
        13: "D",
        14: "E",
        15: "F",
        16: "G",
        17: "H",
        18: "J",
        19: "K",
        20: "M",
        21: "N",
        22: "P",
        23: "Q",
        24: "R",
        25: "S",
        26: "T",
        27: "V",
        28: "W",
        29: "X",
        30: "Y",
        31: "Z"
      };
      var decodeSymbolLookupTable = {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
        "6": 6,
        "7": 7,
        "8": 8,
        "9": 9,
        A: 10,
        B: 11,
        C: 12,
        D: 13,
        E: 14,
        F: 15,
        G: 16,
        H: 17,
        J: 18,
        K: 19,
        M: 20,
        N: 21,
        P: 22,
        Q: 23,
        R: 24,
        S: 25,
        T: 26,
        V: 27,
        W: 28,
        X: 29,
        Y: 30,
        Z: 31
      };
      function encodeSymbol(symbol) {
        return symbol < 10 ? (0, globals_1.String)(symbol) : encodeSymbolLookupTable[symbol];
      }
      function pad(value, paddingLength) {
        let extraPadding = "";
        while (value.length + extraPadding.length < paddingLength) {
          extraPadding += "0";
        }
        return extraPadding + value;
      }
      function smallUintToBase32StringMapper(num) {
        let base32Str = "";
        for (let remaining = num; remaining !== 0; ) {
          const next = remaining >> 5;
          const current = remaining - (next << 5);
          base32Str = encodeSymbol(current) + base32Str;
          remaining = next;
        }
        return base32Str;
      }
      function uintToBase32StringMapper(num, paddingLength) {
        const head = ~~(num / 1073741824);
        const tail = num & 1073741823;
        return pad(smallUintToBase32StringMapper(head), paddingLength - 6) + pad(smallUintToBase32StringMapper(tail), 6);
      }
      function paddedUintToBase32StringMapper(paddingLength) {
        return function padded(num) {
          return uintToBase32StringMapper(num, paddingLength);
        };
      }
      function uintToBase32StringUnmapper(value) {
        if (typeof value !== "string") {
          throw new globals_1.Error("Unsupported type");
        }
        let accumulated = 0;
        let power = 1;
        for (let index = value.length - 1; index >= 0; --index) {
          const char = value[index];
          const numericForChar = decodeSymbolLookupTable[char];
          if (numericForChar === void 0) {
            throw new globals_1.Error("Unsupported type");
          }
          accumulated += numericForChar * power;
          power *= 32;
        }
        return accumulated;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/ulid.js
  var require_ulid = __commonJS({
    "node_modules/fast-check/lib/arbitrary/ulid.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ulid = ulid;
      var tuple_1 = require_tuple();
      var integer_1 = require_integer();
      var UintToBase32String_1 = require_UintToBase32String();
      var padded10Mapper = (0, UintToBase32String_1.paddedUintToBase32StringMapper)(10);
      var padded8Mapper = (0, UintToBase32String_1.paddedUintToBase32StringMapper)(8);
      function ulidMapper(parts) {
        return padded10Mapper(parts[0]) + padded8Mapper(parts[1]) + padded8Mapper(parts[2]);
      }
      function ulidUnmapper(value) {
        if (typeof value !== "string" || value.length !== 26) {
          throw new Error("Unsupported type");
        }
        return [
          (0, UintToBase32String_1.uintToBase32StringUnmapper)(value.slice(0, 10)),
          (0, UintToBase32String_1.uintToBase32StringUnmapper)(value.slice(10, 18)),
          (0, UintToBase32String_1.uintToBase32StringUnmapper)(value.slice(18))
        ];
      }
      function ulid() {
        const timestampPartArbitrary = (0, integer_1.integer)({ min: 0, max: 281474976710655 });
        const randomnessPartOneArbitrary = (0, integer_1.integer)({ min: 0, max: 1099511627775 });
        const randomnessPartTwoArbitrary = (0, integer_1.integer)({ min: 0, max: 1099511627775 });
        return (0, tuple_1.tuple)(timestampPartArbitrary, randomnessPartOneArbitrary, randomnessPartTwoArbitrary).map(ulidMapper, ulidUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/NumberToPaddedEight.js
  var require_NumberToPaddedEight = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/NumberToPaddedEight.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.numberToPaddedEightMapper = numberToPaddedEightMapper;
      exports.numberToPaddedEightUnmapper = numberToPaddedEightUnmapper;
      var globals_1 = require_globals();
      function numberToPaddedEightMapper(n) {
        return (0, globals_1.safePadStart)((0, globals_1.safeNumberToString)(n, 16), 8, "0");
      }
      function numberToPaddedEightUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Unsupported type");
        }
        if (value.length !== 8) {
          throw new Error("Unsupported value: invalid length");
        }
        const n = parseInt(value, 16);
        if (value !== numberToPaddedEightMapper(n)) {
          throw new Error("Unsupported value: invalid content");
        }
        return n;
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/PaddedNumberArbitraryBuilder.js
  var require_PaddedNumberArbitraryBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/PaddedNumberArbitraryBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildPaddedNumberArbitrary = buildPaddedNumberArbitrary;
      var integer_1 = require_integer();
      var NumberToPaddedEight_1 = require_NumberToPaddedEight();
      function buildPaddedNumberArbitrary(min, max) {
        return (0, integer_1.integer)({ min, max }).map(NumberToPaddedEight_1.numberToPaddedEightMapper, NumberToPaddedEight_1.numberToPaddedEightUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/PaddedEightsToUuid.js
  var require_PaddedEightsToUuid = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/PaddedEightsToUuid.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.paddedEightsToUuidMapper = paddedEightsToUuidMapper;
      exports.paddedEightsToUuidUnmapper = paddedEightsToUuidUnmapper;
      var globals_1 = require_globals();
      function paddedEightsToUuidMapper(t) {
        return `${t[0]}-${(0, globals_1.safeSubstring)(t[1], 4)}-${(0, globals_1.safeSubstring)(t[1], 0, 4)}-${(0, globals_1.safeSubstring)(t[2], 0, 4)}-${(0, globals_1.safeSubstring)(t[2], 4)}${t[3]}`;
      }
      var UuidRegex = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/;
      function paddedEightsToUuidUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Unsupported type");
        }
        const m = UuidRegex.exec(value);
        if (m === null) {
          throw new Error("Unsupported type");
        }
        return [m[1], m[3] + m[2], m[4] + (0, globals_1.safeSubstring)(m[5], 0, 4), (0, globals_1.safeSubstring)(m[5], 4)];
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/VersionsApplierForUuid.js
  var require_VersionsApplierForUuid = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/VersionsApplierForUuid.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildVersionsAppliersForUuid = buildVersionsAppliersForUuid;
      var globals_1 = require_globals();
      var quickNumberToHexaString = "0123456789abcdef";
      function buildVersionsAppliersForUuid(versions) {
        const mapping = {};
        const reversedMapping = {};
        for (let index = 0; index !== versions.length; ++index) {
          const from = quickNumberToHexaString[index];
          const to = quickNumberToHexaString[versions[index]];
          mapping[from] = to;
          reversedMapping[to] = from;
        }
        function versionsApplierMapper(value) {
          return mapping[value[0]] + (0, globals_1.safeSubstring)(value, 1);
        }
        function versionsApplierUnmapper(value) {
          if (typeof value !== "string") {
            throw new globals_1.Error("Cannot produce non-string values");
          }
          const rev = reversedMapping[value[0]];
          if (rev === void 0) {
            throw new globals_1.Error("Cannot produce strings not starting by the version in hexa code");
          }
          return rev + (0, globals_1.safeSubstring)(value, 1);
        }
        return { versionsApplierMapper, versionsApplierUnmapper };
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/uuid.js
  var require_uuid = __commonJS({
    "node_modules/fast-check/lib/arbitrary/uuid.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.uuid = uuid;
      var tuple_1 = require_tuple();
      var PaddedNumberArbitraryBuilder_1 = require_PaddedNumberArbitraryBuilder();
      var PaddedEightsToUuid_1 = require_PaddedEightsToUuid();
      var globals_1 = require_globals();
      var VersionsApplierForUuid_1 = require_VersionsApplierForUuid();
      function assertValidVersions(versions) {
        const found = {};
        for (const version of versions) {
          if (found[version]) {
            throw new globals_1.Error(`Version ${version} has been requested at least twice for uuid`);
          }
          found[version] = true;
          if (version < 1 || version > 15) {
            throw new globals_1.Error(`Version must be a value in [1-15] for uuid, but received ${version}`);
          }
          if (~~version !== version) {
            throw new globals_1.Error(`Version must be an integer value for uuid, but received ${version}`);
          }
        }
        if (versions.length === 0) {
          throw new globals_1.Error(`Must provide at least one version for uuid`);
        }
      }
      function uuid(constraints = {}) {
        const padded = (0, PaddedNumberArbitraryBuilder_1.buildPaddedNumberArbitrary)(0, 4294967295);
        const version = constraints.version !== void 0 ? typeof constraints.version === "number" ? [constraints.version] : constraints.version : [1, 2, 3, 4, 5];
        assertValidVersions(version);
        const { versionsApplierMapper, versionsApplierUnmapper } = (0, VersionsApplierForUuid_1.buildVersionsAppliersForUuid)(version);
        const secondPadded = (0, PaddedNumberArbitraryBuilder_1.buildPaddedNumberArbitrary)(0, 268435456 * version.length - 1).map(versionsApplierMapper, versionsApplierUnmapper);
        const thirdPadded = (0, PaddedNumberArbitraryBuilder_1.buildPaddedNumberArbitrary)(2147483648, 3221225471);
        return (0, tuple_1.tuple)(padded, secondPadded, thirdPadded, padded).map(PaddedEightsToUuid_1.paddedEightsToUuidMapper, PaddedEightsToUuid_1.paddedEightsToUuidUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/uuidV.js
  var require_uuidV = __commonJS({
    "node_modules/fast-check/lib/arbitrary/uuidV.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.uuidV = uuidV;
      var tuple_1 = require_tuple();
      var PaddedNumberArbitraryBuilder_1 = require_PaddedNumberArbitraryBuilder();
      var PaddedEightsToUuid_1 = require_PaddedEightsToUuid();
      function uuidV(versionNumber) {
        const padded = (0, PaddedNumberArbitraryBuilder_1.buildPaddedNumberArbitrary)(0, 4294967295);
        const offsetSecond = versionNumber * 268435456;
        const secondPadded = (0, PaddedNumberArbitraryBuilder_1.buildPaddedNumberArbitrary)(offsetSecond, offsetSecond + 268435455);
        const thirdPadded = (0, PaddedNumberArbitraryBuilder_1.buildPaddedNumberArbitrary)(2147483648, 3221225471);
        return (0, tuple_1.tuple)(padded, secondPadded, thirdPadded, padded).map(PaddedEightsToUuid_1.paddedEightsToUuidMapper, PaddedEightsToUuid_1.paddedEightsToUuidUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/webAuthority.js
  var require_webAuthority = __commonJS({
    "node_modules/fast-check/lib/arbitrary/webAuthority.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.webAuthority = webAuthority;
      var CharacterRangeArbitraryBuilder_1 = require_CharacterRangeArbitraryBuilder();
      var constant_1 = require_constant();
      var domain_1 = require_domain();
      var ipV4_1 = require_ipV4();
      var ipV4Extended_1 = require_ipV4Extended();
      var ipV6_1 = require_ipV6();
      var nat_1 = require_nat();
      var oneof_1 = require_oneof();
      var option_1 = require_option();
      var stringOf_1 = require_stringOf();
      var tuple_1 = require_tuple();
      function hostUserInfo(size) {
        const others = ["-", ".", "_", "~", "!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "=", ":"];
        return (0, stringOf_1.stringOf)((0, CharacterRangeArbitraryBuilder_1.buildAlphaNumericPercentArbitrary)(others), { size });
      }
      function userHostPortMapper([u, h, p]) {
        return (u === null ? "" : `${u}@`) + h + (p === null ? "" : `:${p}`);
      }
      function userHostPortUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Unsupported");
        }
        const atPosition = value.indexOf("@");
        const user = atPosition !== -1 ? value.substring(0, atPosition) : null;
        const portRegex = /:(\d+)$/;
        const m = portRegex.exec(value);
        const port = m !== null ? Number(m[1]) : null;
        const host = m !== null ? value.substring(atPosition + 1, value.length - m[1].length - 1) : value.substring(atPosition + 1);
        return [user, host, port];
      }
      function bracketedMapper(s) {
        return `[${s}]`;
      }
      function bracketedUnmapper(value) {
        if (typeof value !== "string" || value[0] !== "[" || value[value.length - 1] !== "]") {
          throw new Error("Unsupported");
        }
        return value.substring(1, value.length - 1);
      }
      function webAuthority(constraints) {
        const c = constraints || {};
        const size = c.size;
        const hostnameArbs = [
          (0, domain_1.domain)({ size }),
          ...c.withIPv4 === true ? [(0, ipV4_1.ipV4)()] : [],
          ...c.withIPv6 === true ? [(0, ipV6_1.ipV6)().map(bracketedMapper, bracketedUnmapper)] : [],
          ...c.withIPv4Extended === true ? [(0, ipV4Extended_1.ipV4Extended)()] : []
        ];
        return (0, tuple_1.tuple)(c.withUserInfo === true ? (0, option_1.option)(hostUserInfo(size)) : (0, constant_1.constant)(null), (0, oneof_1.oneof)(...hostnameArbs), c.withPort === true ? (0, option_1.option)((0, nat_1.nat)(65535)) : (0, constant_1.constant)(null)).map(userHostPortMapper, userHostPortUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/UriQueryOrFragmentArbitraryBuilder.js
  var require_UriQueryOrFragmentArbitraryBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/UriQueryOrFragmentArbitraryBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildUriQueryOrFragmentArbitrary = buildUriQueryOrFragmentArbitrary;
      var CharacterRangeArbitraryBuilder_1 = require_CharacterRangeArbitraryBuilder();
      var stringOf_1 = require_stringOf();
      function buildUriQueryOrFragmentArbitrary(size) {
        const others = ["-", ".", "_", "~", "!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "=", ":", "@", "/", "?"];
        return (0, stringOf_1.stringOf)((0, CharacterRangeArbitraryBuilder_1.buildAlphaNumericPercentArbitrary)(others), { size });
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/webFragments.js
  var require_webFragments = __commonJS({
    "node_modules/fast-check/lib/arbitrary/webFragments.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.webFragments = webFragments;
      var UriQueryOrFragmentArbitraryBuilder_1 = require_UriQueryOrFragmentArbitraryBuilder();
      function webFragments(constraints = {}) {
        return (0, UriQueryOrFragmentArbitraryBuilder_1.buildUriQueryOrFragmentArbitrary)(constraints.size);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/webSegment.js
  var require_webSegment = __commonJS({
    "node_modules/fast-check/lib/arbitrary/webSegment.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.webSegment = webSegment;
      var CharacterRangeArbitraryBuilder_1 = require_CharacterRangeArbitraryBuilder();
      var stringOf_1 = require_stringOf();
      function webSegment(constraints = {}) {
        const others = ["-", ".", "_", "~", "!", "$", "&", "'", "(", ")", "*", "+", ",", ";", "=", ":", "@"];
        return (0, stringOf_1.stringOf)((0, CharacterRangeArbitraryBuilder_1.buildAlphaNumericPercentArbitrary)(others), { size: constraints.size });
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/SegmentsToPath.js
  var require_SegmentsToPath = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/SegmentsToPath.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.segmentsToPathMapper = segmentsToPathMapper;
      exports.segmentsToPathUnmapper = segmentsToPathUnmapper;
      var globals_1 = require_globals();
      function segmentsToPathMapper(segments) {
        return (0, globals_1.safeJoin)((0, globals_1.safeMap)(segments, (v) => `/${v}`), "");
      }
      function segmentsToPathUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Incompatible value received: type");
        }
        if (value.length !== 0 && value[0] !== "/") {
          throw new Error("Incompatible value received: start");
        }
        return (0, globals_1.safeSplice)((0, globals_1.safeSplit)(value, "/"), 1);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/builders/UriPathArbitraryBuilder.js
  var require_UriPathArbitraryBuilder = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/builders/UriPathArbitraryBuilder.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildUriPathArbitrary = buildUriPathArbitrary;
      var webSegment_1 = require_webSegment();
      var array_1 = require_array();
      var SegmentsToPath_1 = require_SegmentsToPath();
      var oneof_1 = require_oneof();
      function sqrtSize(size) {
        switch (size) {
          case "xsmall":
            return ["xsmall", "xsmall"];
          case "small":
            return ["small", "xsmall"];
          case "medium":
            return ["small", "small"];
          case "large":
            return ["medium", "small"];
          case "xlarge":
            return ["medium", "medium"];
        }
      }
      function buildUriPathArbitraryInternal(segmentSize, numSegmentSize) {
        return (0, array_1.array)((0, webSegment_1.webSegment)({ size: segmentSize }), { size: numSegmentSize }).map(SegmentsToPath_1.segmentsToPathMapper, SegmentsToPath_1.segmentsToPathUnmapper);
      }
      function buildUriPathArbitrary(resolvedSize) {
        const [segmentSize, numSegmentSize] = sqrtSize(resolvedSize);
        if (segmentSize === numSegmentSize) {
          return buildUriPathArbitraryInternal(segmentSize, numSegmentSize);
        }
        return (0, oneof_1.oneof)(buildUriPathArbitraryInternal(segmentSize, numSegmentSize), buildUriPathArbitraryInternal(numSegmentSize, segmentSize));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/webPath.js
  var require_webPath = __commonJS({
    "node_modules/fast-check/lib/arbitrary/webPath.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.webPath = webPath;
      var MaxLengthFromMinLength_1 = require_MaxLengthFromMinLength();
      var UriPathArbitraryBuilder_1 = require_UriPathArbitraryBuilder();
      function webPath(constraints) {
        const c = constraints || {};
        const resolvedSize = (0, MaxLengthFromMinLength_1.resolveSize)(c.size);
        return (0, UriPathArbitraryBuilder_1.buildUriPathArbitrary)(resolvedSize);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/webQueryParameters.js
  var require_webQueryParameters = __commonJS({
    "node_modules/fast-check/lib/arbitrary/webQueryParameters.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.webQueryParameters = webQueryParameters;
      var UriQueryOrFragmentArbitraryBuilder_1 = require_UriQueryOrFragmentArbitraryBuilder();
      function webQueryParameters(constraints = {}) {
        return (0, UriQueryOrFragmentArbitraryBuilder_1.buildUriQueryOrFragmentArbitrary)(constraints.size);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/mappers/PartsToUrl.js
  var require_PartsToUrl = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/mappers/PartsToUrl.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.partsToUrlMapper = partsToUrlMapper;
      exports.partsToUrlUnmapper = partsToUrlUnmapper;
      function partsToUrlMapper(data) {
        const [scheme, authority, path] = data;
        const query = data[3] === null ? "" : `?${data[3]}`;
        const fragments = data[4] === null ? "" : `#${data[4]}`;
        return `${scheme}://${authority}${path}${query}${fragments}`;
      }
      var UrlSplitRegex = /^([[A-Za-z][A-Za-z0-9+.-]*):\/\/([^/?#]*)([^?#]*)(\?[A-Za-z0-9\-._~!$&'()*+,;=:@/?%]*)?(#[A-Za-z0-9\-._~!$&'()*+,;=:@/?%]*)?$/;
      function partsToUrlUnmapper(value) {
        if (typeof value !== "string") {
          throw new Error("Incompatible value received: type");
        }
        const m = UrlSplitRegex.exec(value);
        if (m === null) {
          throw new Error("Incompatible value received");
        }
        const scheme = m[1];
        const authority = m[2];
        const path = m[3];
        const query = m[4];
        const fragments = m[5];
        return [
          scheme,
          authority,
          path,
          query !== void 0 ? query.substring(1) : null,
          fragments !== void 0 ? fragments.substring(1) : null
        ];
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/webUrl.js
  var require_webUrl = __commonJS({
    "node_modules/fast-check/lib/arbitrary/webUrl.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.webUrl = webUrl;
      var constantFrom_1 = require_constantFrom();
      var constant_1 = require_constant();
      var option_1 = require_option();
      var tuple_1 = require_tuple();
      var webQueryParameters_1 = require_webQueryParameters();
      var webFragments_1 = require_webFragments();
      var webAuthority_1 = require_webAuthority();
      var PartsToUrl_1 = require_PartsToUrl();
      var MaxLengthFromMinLength_1 = require_MaxLengthFromMinLength();
      var webPath_1 = require_webPath();
      var safeObjectAssign = Object.assign;
      function webUrl(constraints) {
        const c = constraints || {};
        const resolvedSize = (0, MaxLengthFromMinLength_1.resolveSize)(c.size);
        const resolvedAuthoritySettingsSize = c.authoritySettings !== void 0 && c.authoritySettings.size !== void 0 ? (0, MaxLengthFromMinLength_1.relativeSizeToSize)(c.authoritySettings.size, resolvedSize) : resolvedSize;
        const resolvedAuthoritySettings = safeObjectAssign(safeObjectAssign({}, c.authoritySettings), {
          size: resolvedAuthoritySettingsSize
        });
        const validSchemes = c.validSchemes || ["http", "https"];
        const schemeArb = (0, constantFrom_1.constantFrom)(...validSchemes);
        const authorityArb = (0, webAuthority_1.webAuthority)(resolvedAuthoritySettings);
        return (0, tuple_1.tuple)(schemeArb, authorityArb, (0, webPath_1.webPath)({ size: resolvedSize }), c.withQueryParameters === true ? (0, option_1.option)((0, webQueryParameters_1.webQueryParameters)({ size: resolvedSize })) : (0, constant_1.constant)(null), c.withFragments === true ? (0, option_1.option)((0, webFragments_1.webFragments)({ size: resolvedSize })) : (0, constant_1.constant)(null)).map(PartsToUrl_1.partsToUrlMapper, PartsToUrl_1.partsToUrlUnmapper);
      }
    }
  });

  // node_modules/fast-check/lib/check/model/commands/CommandsIterable.js
  var require_CommandsIterable = __commonJS({
    "node_modules/fast-check/lib/check/model/commands/CommandsIterable.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CommandsIterable = void 0;
      var symbols_1 = require_symbols();
      var CommandsIterable = class _CommandsIterable {
        constructor(commands, metadataForReplay) {
          this.commands = commands;
          this.metadataForReplay = metadataForReplay;
        }
        [Symbol.iterator]() {
          return this.commands[Symbol.iterator]();
        }
        [symbols_1.cloneMethod]() {
          return new _CommandsIterable(this.commands.map((c) => c.clone()), this.metadataForReplay);
        }
        toString() {
          const serializedCommands = this.commands.filter((c) => c.hasRan).map((c) => c.toString()).join(",");
          const metadata = this.metadataForReplay();
          return metadata.length !== 0 ? `${serializedCommands} /*${metadata}*/` : serializedCommands;
        }
      };
      exports.CommandsIterable = CommandsIterable;
    }
  });

  // node_modules/fast-check/lib/check/model/commands/CommandWrapper.js
  var require_CommandWrapper = __commonJS({
    "node_modules/fast-check/lib/check/model/commands/CommandWrapper.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CommandWrapper = void 0;
      var stringify_1 = require_stringify();
      var symbols_1 = require_symbols();
      var CommandWrapper = class _CommandWrapper {
        constructor(cmd) {
          this.cmd = cmd;
          this.hasRan = false;
          if ((0, stringify_1.hasToStringMethod)(cmd)) {
            const method = cmd[stringify_1.toStringMethod];
            this[stringify_1.toStringMethod] = function toStringMethod() {
              return method.call(cmd);
            };
          }
          if ((0, stringify_1.hasAsyncToStringMethod)(cmd)) {
            const method = cmd[stringify_1.asyncToStringMethod];
            this[stringify_1.asyncToStringMethod] = function asyncToStringMethod() {
              return method.call(cmd);
            };
          }
        }
        check(m) {
          return this.cmd.check(m);
        }
        run(m, r) {
          this.hasRan = true;
          return this.cmd.run(m, r);
        }
        clone() {
          if ((0, symbols_1.hasCloneMethod)(this.cmd))
            return new _CommandWrapper(this.cmd[symbols_1.cloneMethod]());
          return new _CommandWrapper(this.cmd);
        }
        toString() {
          return this.cmd.toString();
        }
      };
      exports.CommandWrapper = CommandWrapper;
    }
  });

  // node_modules/fast-check/lib/check/model/ReplayPath.js
  var require_ReplayPath = __commonJS({
    "node_modules/fast-check/lib/check/model/ReplayPath.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReplayPath = void 0;
      var ReplayPath = class {
        static parse(replayPathStr) {
          const [serializedCount, serializedChanges] = replayPathStr.split(":");
          const counts = this.parseCounts(serializedCount);
          const changes = this.parseChanges(serializedChanges);
          return this.parseOccurences(counts, changes);
        }
        static stringify(replayPath) {
          const occurences = this.countOccurences(replayPath);
          const serializedCount = this.stringifyCounts(occurences);
          const serializedChanges = this.stringifyChanges(occurences);
          return `${serializedCount}:${serializedChanges}`;
        }
        static intToB64(n) {
          if (n < 26)
            return String.fromCharCode(n + 65);
          if (n < 52)
            return String.fromCharCode(n + 97 - 26);
          if (n < 62)
            return String.fromCharCode(n + 48 - 52);
          return String.fromCharCode(n === 62 ? 43 : 47);
        }
        static b64ToInt(c) {
          if (c >= "a")
            return c.charCodeAt(0) - 97 + 26;
          if (c >= "A")
            return c.charCodeAt(0) - 65;
          if (c >= "0")
            return c.charCodeAt(0) - 48 + 52;
          return c === "+" ? 62 : 63;
        }
        static countOccurences(replayPath) {
          return replayPath.reduce((counts, cur) => {
            if (counts.length === 0 || counts[counts.length - 1].count === 64 || counts[counts.length - 1].value !== cur)
              counts.push({ value: cur, count: 1 });
            else
              counts[counts.length - 1].count += 1;
            return counts;
          }, []);
        }
        static parseOccurences(counts, changes) {
          const replayPath = [];
          for (let idx = 0; idx !== counts.length; ++idx) {
            const count = counts[idx];
            const value = changes[idx];
            for (let num = 0; num !== count; ++num)
              replayPath.push(value);
          }
          return replayPath;
        }
        static stringifyChanges(occurences) {
          let serializedChanges = "";
          for (let idx = 0; idx < occurences.length; idx += 6) {
            const changesInt = occurences.slice(idx, idx + 6).reduceRight((prev, cur) => prev * 2 + (cur.value ? 1 : 0), 0);
            serializedChanges += this.intToB64(changesInt);
          }
          return serializedChanges;
        }
        static parseChanges(serializedChanges) {
          const changesInt = serializedChanges.split("").map((c) => this.b64ToInt(c));
          const changes = [];
          for (let idx = 0; idx !== changesInt.length; ++idx) {
            let current = changesInt[idx];
            for (let n = 0; n !== 6; ++n, current >>= 1) {
              changes.push(current % 2 === 1);
            }
          }
          return changes;
        }
        static stringifyCounts(occurences) {
          return occurences.map(({ count }) => this.intToB64(count - 1)).join("");
        }
        static parseCounts(serializedCount) {
          return serializedCount.split("").map((c) => this.b64ToInt(c) + 1);
        }
      };
      exports.ReplayPath = ReplayPath;
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/CommandsArbitrary.js
  var require_CommandsArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/CommandsArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CommandsArbitrary = void 0;
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var CommandsIterable_1 = require_CommandsIterable();
      var CommandWrapper_1 = require_CommandWrapper();
      var ReplayPath_1 = require_ReplayPath();
      var LazyIterableIterator_1 = require_LazyIterableIterator();
      var Stream_1 = require_Stream();
      var oneof_1 = require_oneof();
      var RestrictedIntegerArbitraryBuilder_1 = require_RestrictedIntegerArbitraryBuilder();
      var CommandsArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor(commandArbs, maxGeneratedCommands, maxCommands, sourceReplayPath, disableReplayLog) {
          super();
          this.sourceReplayPath = sourceReplayPath;
          this.disableReplayLog = disableReplayLog;
          this.oneCommandArb = (0, oneof_1.oneof)(...commandArbs).map((c) => new CommandWrapper_1.CommandWrapper(c));
          this.lengthArb = (0, RestrictedIntegerArbitraryBuilder_1.restrictedIntegerArbitraryBuilder)(0, maxGeneratedCommands, maxCommands);
          this.replayPath = [];
          this.replayPathPosition = 0;
        }
        metadataForReplay() {
          return this.disableReplayLog ? "" : `replayPath=${JSON.stringify(ReplayPath_1.ReplayPath.stringify(this.replayPath))}`;
        }
        buildValueFor(items, shrunkOnce) {
          const commands = items.map((item) => item.value_);
          const context = { shrunkOnce, items };
          return new Value_1.Value(new CommandsIterable_1.CommandsIterable(commands, () => this.metadataForReplay()), context);
        }
        generate(mrng) {
          const size = this.lengthArb.generate(mrng, void 0);
          const sizeValue = size.value;
          const items = Array(sizeValue);
          for (let idx = 0; idx !== sizeValue; ++idx) {
            const item = this.oneCommandArb.generate(mrng, void 0);
            items[idx] = item;
          }
          this.replayPathPosition = 0;
          return this.buildValueFor(items, false);
        }
        canShrinkWithoutContext(value) {
          return false;
        }
        filterOnExecution(itemsRaw) {
          const items = [];
          for (const c of itemsRaw) {
            if (c.value_.hasRan) {
              this.replayPath.push(true);
              items.push(c);
            } else
              this.replayPath.push(false);
          }
          return items;
        }
        filterOnReplay(itemsRaw) {
          return itemsRaw.filter((c, idx) => {
            const state = this.replayPath[this.replayPathPosition + idx];
            if (state === void 0)
              throw new Error(`Too short replayPath`);
            if (!state && c.value_.hasRan)
              throw new Error(`Mismatch between replayPath and real execution`);
            return state;
          });
        }
        filterForShrinkImpl(itemsRaw) {
          if (this.replayPathPosition === 0) {
            this.replayPath = this.sourceReplayPath !== null ? ReplayPath_1.ReplayPath.parse(this.sourceReplayPath) : [];
          }
          const items = this.replayPathPosition < this.replayPath.length ? this.filterOnReplay(itemsRaw) : this.filterOnExecution(itemsRaw);
          this.replayPathPosition += itemsRaw.length;
          return items;
        }
        shrink(_value, context) {
          if (context === void 0) {
            return Stream_1.Stream.nil();
          }
          const safeContext = context;
          const shrunkOnce = safeContext.shrunkOnce;
          const itemsRaw = safeContext.items;
          const items = this.filterForShrinkImpl(itemsRaw);
          if (items.length === 0) {
            return Stream_1.Stream.nil();
          }
          const rootShrink = shrunkOnce ? Stream_1.Stream.nil() : new Stream_1.Stream([[]][Symbol.iterator]());
          const nextShrinks = [];
          for (let numToKeep = 0; numToKeep !== items.length; ++numToKeep) {
            nextShrinks.push((0, LazyIterableIterator_1.makeLazy)(() => {
              const fixedStart = items.slice(0, numToKeep);
              return this.lengthArb.shrink(items.length - 1 - numToKeep, void 0).map((l) => fixedStart.concat(items.slice(items.length - (l.value + 1))));
            }));
          }
          for (let itemAt = 0; itemAt !== items.length; ++itemAt) {
            nextShrinks.push((0, LazyIterableIterator_1.makeLazy)(() => this.oneCommandArb.shrink(items[itemAt].value_, items[itemAt].context).map((v) => items.slice(0, itemAt).concat([v], items.slice(itemAt + 1)))));
          }
          return rootShrink.join(...nextShrinks).map((shrinkables) => {
            return this.buildValueFor(shrinkables.map((c) => new Value_1.Value(c.value_.clone(), c.context)), true);
          });
        }
      };
      exports.CommandsArbitrary = CommandsArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/commands.js
  var require_commands = __commonJS({
    "node_modules/fast-check/lib/arbitrary/commands.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.commands = commands;
      var CommandsArbitrary_1 = require_CommandsArbitrary();
      var MaxLengthFromMinLength_1 = require_MaxLengthFromMinLength();
      function commands(commandArbs, constraints = {}) {
        const { size, maxCommands = MaxLengthFromMinLength_1.MaxLengthUpperBound, disableReplayLog = false, replayPath = null } = constraints;
        const specifiedMaxCommands = constraints.maxCommands !== void 0;
        const maxGeneratedCommands = (0, MaxLengthFromMinLength_1.maxGeneratedLengthFromSizeForArbitrary)(size, 0, maxCommands, specifiedMaxCommands);
        return new CommandsArbitrary_1.CommandsArbitrary(commandArbs, maxGeneratedCommands, maxCommands, replayPath, disableReplayLog);
      }
    }
  });

  // node_modules/fast-check/lib/check/model/commands/ScheduledCommand.js
  var require_ScheduledCommand = __commonJS({
    "node_modules/fast-check/lib/check/model/commands/ScheduledCommand.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.scheduleCommands = exports.ScheduledCommand = void 0;
      var ScheduledCommand = class {
        constructor(s, cmd) {
          this.s = s;
          this.cmd = cmd;
        }
        async check(m) {
          let error = null;
          let checkPassed = false;
          const status = await this.s.scheduleSequence([
            {
              label: `check@${this.cmd.toString()}`,
              builder: async () => {
                try {
                  checkPassed = await Promise.resolve(this.cmd.check(m));
                } catch (err) {
                  error = err;
                  throw err;
                }
              }
            }
          ]).task;
          if (status.faulty) {
            throw error;
          }
          return checkPassed;
        }
        async run(m, r) {
          let error = null;
          const status = await this.s.scheduleSequence([
            {
              label: `run@${this.cmd.toString()}`,
              builder: async () => {
                try {
                  await this.cmd.run(m, r);
                } catch (err) {
                  error = err;
                  throw err;
                }
              }
            }
          ]).task;
          if (status.faulty) {
            throw error;
          }
        }
      };
      exports.ScheduledCommand = ScheduledCommand;
      var scheduleCommands = function* (s, cmds) {
        for (const cmd of cmds) {
          yield new ScheduledCommand(s, cmd);
        }
      };
      exports.scheduleCommands = scheduleCommands;
    }
  });

  // node_modules/fast-check/lib/check/model/ModelRunner.js
  var require_ModelRunner = __commonJS({
    "node_modules/fast-check/lib/check/model/ModelRunner.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.modelRun = modelRun;
      exports.asyncModelRun = asyncModelRun;
      exports.scheduledModelRun = scheduledModelRun;
      var ScheduledCommand_1 = require_ScheduledCommand();
      var genericModelRun = (s, cmds, initialValue, runCmd, then) => {
        return s.then((o) => {
          const { model, real } = o;
          let state = initialValue;
          for (const c of cmds) {
            state = then(state, () => {
              return runCmd(c, model, real);
            });
          }
          return state;
        });
      };
      var internalModelRun = (s, cmds) => {
        const then = (_p, c) => c();
        const setupProducer = {
          then: (fun) => {
            fun(s());
            return void 0;
          }
        };
        const runSync = (cmd, m, r) => {
          if (cmd.check(m))
            cmd.run(m, r);
          return void 0;
        };
        return genericModelRun(setupProducer, cmds, void 0, runSync, then);
      };
      var isAsyncSetup = (s) => {
        return typeof s.then === "function";
      };
      var internalAsyncModelRun = async (s, cmds, defaultPromise = Promise.resolve()) => {
        const then = (p, c) => p.then(c);
        const setupProducer = {
          then: (fun) => {
            const out = s();
            if (isAsyncSetup(out))
              return out.then(fun);
            else
              return fun(out);
          }
        };
        const runAsync = async (cmd, m, r) => {
          if (await cmd.check(m))
            await cmd.run(m, r);
        };
        return await genericModelRun(setupProducer, cmds, defaultPromise, runAsync, then);
      };
      function modelRun(s, cmds) {
        internalModelRun(s, cmds);
      }
      async function asyncModelRun(s, cmds) {
        await internalAsyncModelRun(s, cmds);
      }
      async function scheduledModelRun(scheduler, s, cmds) {
        const scheduledCommands = (0, ScheduledCommand_1.scheduleCommands)(scheduler, cmds);
        const out = internalAsyncModelRun(s, scheduledCommands, scheduler.schedule(Promise.resolve(), "startModel"));
        await scheduler.waitFor(out);
        await scheduler.waitAll();
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/implementations/SchedulerImplem.js
  var require_SchedulerImplem = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/implementations/SchedulerImplem.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SchedulerImplem = void 0;
      var TextEscaper_1 = require_TextEscaper();
      var symbols_1 = require_symbols();
      var stringify_1 = require_stringify();
      var defaultSchedulerAct = (f) => f();
      var SchedulerImplem = class _SchedulerImplem {
        constructor(act, taskSelector) {
          this.act = act;
          this.taskSelector = taskSelector;
          this.lastTaskId = 0;
          this.sourceTaskSelector = taskSelector.clone();
          this.scheduledTasks = [];
          this.triggeredTasks = [];
          this.scheduledWatchers = [];
        }
        static buildLog(reportItem) {
          return `[task\${${reportItem.taskId}}] ${reportItem.label.length !== 0 ? `${reportItem.schedulingType}::${reportItem.label}` : reportItem.schedulingType} ${reportItem.status}${reportItem.outputValue !== void 0 ? ` with value ${(0, TextEscaper_1.escapeForTemplateString)(reportItem.outputValue)}` : ""}`;
        }
        log(schedulingType, taskId, label, metadata, status, data) {
          this.triggeredTasks.push({
            status,
            schedulingType,
            taskId,
            label,
            metadata,
            outputValue: data !== void 0 ? (0, stringify_1.stringify)(data) : void 0
          });
        }
        scheduleInternal(schedulingType, label, task, metadata, customAct, thenTaskToBeAwaited) {
          let trigger = null;
          const taskId = ++this.lastTaskId;
          const scheduledPromise = new Promise((resolve, reject) => {
            trigger = () => {
              (thenTaskToBeAwaited ? task.then(() => thenTaskToBeAwaited()) : task).then((data) => {
                this.log(schedulingType, taskId, label, metadata, "resolved", data);
                return resolve(data);
              }, (err) => {
                this.log(schedulingType, taskId, label, metadata, "rejected", err);
                return reject(err);
              });
            };
          });
          this.scheduledTasks.push({
            original: task,
            scheduled: scheduledPromise,
            trigger,
            schedulingType,
            taskId,
            label,
            metadata,
            customAct
          });
          if (this.scheduledWatchers.length !== 0) {
            this.scheduledWatchers[0]();
          }
          return scheduledPromise;
        }
        schedule(task, label, metadata, customAct) {
          return this.scheduleInternal("promise", label || "", task, metadata, customAct || defaultSchedulerAct);
        }
        scheduleFunction(asyncFunction, customAct) {
          return (...args) => this.scheduleInternal("function", `${asyncFunction.name}(${args.map(stringify_1.stringify).join(",")})`, asyncFunction(...args), void 0, customAct || defaultSchedulerAct);
        }
        scheduleSequence(sequenceBuilders, customAct) {
          const status = { done: false, faulty: false };
          const dummyResolvedPromise = { then: (f) => f() };
          let resolveSequenceTask = () => {
          };
          const sequenceTask = new Promise((resolve) => resolveSequenceTask = resolve);
          sequenceBuilders.reduce((previouslyScheduled, item) => {
            const [builder, label, metadata] = typeof item === "function" ? [item, item.name, void 0] : [item.builder, item.label, item.metadata];
            return previouslyScheduled.then(() => {
              const scheduled = this.scheduleInternal("sequence", label, dummyResolvedPromise, metadata, customAct || defaultSchedulerAct, () => builder());
              scheduled.catch(() => {
                status.faulty = true;
                resolveSequenceTask();
              });
              return scheduled;
            });
          }, dummyResolvedPromise).then(() => {
            status.done = true;
            resolveSequenceTask();
          }, () => {
          });
          return Object.assign(status, {
            task: Promise.resolve(sequenceTask).then(() => {
              return { done: status.done, faulty: status.faulty };
            })
          });
        }
        count() {
          return this.scheduledTasks.length;
        }
        internalWaitOne() {
          if (this.scheduledTasks.length === 0) {
            throw new Error("No task scheduled");
          }
          const taskIndex = this.taskSelector.nextTaskIndex(this.scheduledTasks);
          const [scheduledTask] = this.scheduledTasks.splice(taskIndex, 1);
          return scheduledTask.customAct(async () => {
            scheduledTask.trigger();
            try {
              await scheduledTask.scheduled;
            } catch (_err) {
            }
          });
        }
        async waitOne(customAct) {
          const waitAct = customAct || defaultSchedulerAct;
          await this.act(() => waitAct(async () => await this.internalWaitOne()));
        }
        async waitAll(customAct) {
          while (this.scheduledTasks.length > 0) {
            await this.waitOne(customAct);
          }
        }
        async waitFor(unscheduledTask, customAct) {
          let taskResolved = false;
          let awaiterPromise = null;
          const awaiter = async () => {
            while (!taskResolved && this.scheduledTasks.length > 0) {
              await this.waitOne(customAct);
            }
            awaiterPromise = null;
          };
          const handleNotified = () => {
            if (awaiterPromise !== null) {
              return;
            }
            awaiterPromise = Promise.resolve().then(awaiter);
          };
          const clearAndReplaceWatcher = () => {
            const handleNotifiedIndex = this.scheduledWatchers.indexOf(handleNotified);
            if (handleNotifiedIndex !== -1) {
              this.scheduledWatchers.splice(handleNotifiedIndex, 1);
            }
            if (handleNotifiedIndex === 0 && this.scheduledWatchers.length !== 0) {
              this.scheduledWatchers[0]();
            }
          };
          const rewrappedTask = unscheduledTask.then((ret) => {
            taskResolved = true;
            if (awaiterPromise === null) {
              clearAndReplaceWatcher();
              return ret;
            }
            return awaiterPromise.then(() => {
              clearAndReplaceWatcher();
              return ret;
            });
          }, (err) => {
            taskResolved = true;
            if (awaiterPromise === null) {
              clearAndReplaceWatcher();
              throw err;
            }
            return awaiterPromise.then(() => {
              clearAndReplaceWatcher();
              throw err;
            });
          });
          if (this.scheduledTasks.length > 0 && this.scheduledWatchers.length === 0) {
            handleNotified();
          }
          this.scheduledWatchers.push(handleNotified);
          return rewrappedTask;
        }
        report() {
          return [
            ...this.triggeredTasks,
            ...this.scheduledTasks.map((t) => ({
              status: "pending",
              schedulingType: t.schedulingType,
              taskId: t.taskId,
              label: t.label,
              metadata: t.metadata
            }))
          ];
        }
        toString() {
          return "schedulerFor()`\n" + this.report().map(_SchedulerImplem.buildLog).map((log) => `-> ${log}`).join("\n") + "`";
        }
        [symbols_1.cloneMethod]() {
          return new _SchedulerImplem(this.act, this.sourceTaskSelector);
        }
      };
      exports.SchedulerImplem = SchedulerImplem;
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/BuildSchedulerFor.js
  var require_BuildSchedulerFor = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/BuildSchedulerFor.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.buildSchedulerFor = buildSchedulerFor;
      var SchedulerImplem_1 = require_SchedulerImplem();
      function buildNextTaskIndex(ordering) {
        let numTasks = 0;
        return {
          clone: () => buildNextTaskIndex(ordering),
          nextTaskIndex: (scheduledTasks) => {
            if (ordering.length <= numTasks) {
              throw new Error(`Invalid schedulerFor defined: too many tasks have been scheduled`);
            }
            const taskIndex = scheduledTasks.findIndex((t) => t.taskId === ordering[numTasks]);
            if (taskIndex === -1) {
              throw new Error(`Invalid schedulerFor defined: unable to find next task`);
            }
            ++numTasks;
            return taskIndex;
          }
        };
      }
      function buildSchedulerFor(act, ordering) {
        return new SchedulerImplem_1.SchedulerImplem(act, buildNextTaskIndex(ordering));
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/SchedulerArbitrary.js
  var require_SchedulerArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/SchedulerArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SchedulerArbitrary = void 0;
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var Stream_1 = require_Stream();
      var SchedulerImplem_1 = require_SchedulerImplem();
      function buildNextTaskIndex(mrng) {
        const clonedMrng = mrng.clone();
        return {
          clone: () => buildNextTaskIndex(clonedMrng),
          nextTaskIndex: (scheduledTasks) => {
            return mrng.nextInt(0, scheduledTasks.length - 1);
          }
        };
      }
      var SchedulerArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor(act) {
          super();
          this.act = act;
        }
        generate(mrng, _biasFactor) {
          return new Value_1.Value(new SchedulerImplem_1.SchedulerImplem(this.act, buildNextTaskIndex(mrng.clone())), void 0);
        }
        canShrinkWithoutContext(value) {
          return false;
        }
        shrink(_value, _context) {
          return Stream_1.Stream.nil();
        }
      };
      exports.SchedulerArbitrary = SchedulerArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/scheduler.js
  var require_scheduler = __commonJS({
    "node_modules/fast-check/lib/arbitrary/scheduler.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.scheduler = scheduler;
      exports.schedulerFor = schedulerFor;
      var BuildSchedulerFor_1 = require_BuildSchedulerFor();
      var SchedulerArbitrary_1 = require_SchedulerArbitrary();
      function scheduler(constraints) {
        const { act = (f) => f() } = constraints || {};
        return new SchedulerArbitrary_1.SchedulerArbitrary(act);
      }
      function schedulerFor(customOrderingOrConstraints, constraintsOrUndefined) {
        const { act = (f) => f() } = Array.isArray(customOrderingOrConstraints) ? constraintsOrUndefined || {} : customOrderingOrConstraints || {};
        if (Array.isArray(customOrderingOrConstraints)) {
          return (0, BuildSchedulerFor_1.buildSchedulerFor)(act, customOrderingOrConstraints);
        }
        return function(_strs, ...ordering) {
          return (0, BuildSchedulerFor_1.buildSchedulerFor)(act, ordering);
        };
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/bigInt64Array.js
  var require_bigInt64Array = __commonJS({
    "node_modules/fast-check/lib/arbitrary/bigInt64Array.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.bigInt64Array = bigInt64Array;
      var globals_1 = require_globals();
      var bigInt_1 = require_bigInt();
      var TypedIntArrayArbitraryBuilder_1 = require_TypedIntArrayArbitraryBuilder();
      function bigInt64Array(constraints = {}) {
        return (0, TypedIntArrayArbitraryBuilder_1.typedIntArrayArbitraryArbitraryBuilder)(constraints, (0, globals_1.BigInt)("-9223372036854775808"), (0, globals_1.BigInt)("9223372036854775807"), globals_1.BigInt64Array, bigInt_1.bigInt);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/bigUint64Array.js
  var require_bigUint64Array = __commonJS({
    "node_modules/fast-check/lib/arbitrary/bigUint64Array.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.bigUint64Array = bigUint64Array;
      var globals_1 = require_globals();
      var bigInt_1 = require_bigInt();
      var TypedIntArrayArbitraryBuilder_1 = require_TypedIntArrayArbitraryBuilder();
      function bigUint64Array(constraints = {}) {
        return (0, TypedIntArrayArbitraryBuilder_1.typedIntArrayArbitraryArbitraryBuilder)(constraints, (0, globals_1.BigInt)(0), (0, globals_1.BigInt)("18446744073709551615"), globals_1.BigUint64Array, bigInt_1.bigInt);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/SanitizeRegexAst.js
  var require_SanitizeRegexAst = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/SanitizeRegexAst.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.addMissingDotStar = addMissingDotStar;
      var stringify_1 = require_stringify();
      function raiseUnsupportedASTNode(astNode) {
        return new Error(`Unsupported AST node! Received: ${(0, stringify_1.stringify)(astNode)}`);
      }
      function addMissingDotStarTraversalAddMissing(astNode, isFirst, isLast) {
        if (!isFirst && !isLast) {
          return astNode;
        }
        const traversalResults = { hasStart: false, hasEnd: false };
        const revampedNode = addMissingDotStarTraversal(astNode, isFirst, isLast, traversalResults);
        const missingStart = isFirst && !traversalResults.hasStart;
        const missingEnd = isLast && !traversalResults.hasEnd;
        if (!missingStart && !missingEnd) {
          return revampedNode;
        }
        const expressions = [];
        if (missingStart) {
          expressions.push({ type: "Assertion", kind: "^" });
          expressions.push({
            type: "Repetition",
            quantifier: { type: "Quantifier", kind: "*", greedy: true },
            expression: { type: "Char", kind: "meta", symbol: ".", value: ".", codePoint: Number.NaN }
          });
        }
        expressions.push(revampedNode);
        if (missingEnd) {
          expressions.push({
            type: "Repetition",
            quantifier: { type: "Quantifier", kind: "*", greedy: true },
            expression: { type: "Char", kind: "meta", symbol: ".", value: ".", codePoint: Number.NaN }
          });
          expressions.push({ type: "Assertion", kind: "$" });
        }
        return { type: "Group", capturing: false, expression: { type: "Alternative", expressions } };
      }
      function addMissingDotStarTraversal(astNode, isFirst, isLast, traversalResults) {
        switch (astNode.type) {
          case "Char":
            return astNode;
          case "Repetition":
            return astNode;
          case "Quantifier":
            throw new Error(`Wrongly defined AST tree, Quantifier nodes not supposed to be scanned!`);
          case "Alternative":
            traversalResults.hasStart = true;
            traversalResults.hasEnd = true;
            return Object.assign(Object.assign({}, astNode), { expressions: astNode.expressions.map((node, index) => addMissingDotStarTraversalAddMissing(node, isFirst && index === 0, isLast && index === astNode.expressions.length - 1)) });
          case "CharacterClass":
            return astNode;
          case "ClassRange":
            return astNode;
          case "Group": {
            return Object.assign(Object.assign({}, astNode), { expression: addMissingDotStarTraversal(astNode.expression, isFirst, isLast, traversalResults) });
          }
          case "Disjunction": {
            traversalResults.hasStart = true;
            traversalResults.hasEnd = true;
            return Object.assign(Object.assign({}, astNode), { left: astNode.left !== null ? addMissingDotStarTraversalAddMissing(astNode.left, isFirst, isLast) : null, right: astNode.right !== null ? addMissingDotStarTraversalAddMissing(astNode.right, isFirst, isLast) : null });
          }
          case "Assertion": {
            if (astNode.kind === "^" || astNode.kind === "Lookahead") {
              traversalResults.hasStart = true;
              return astNode;
            } else if (astNode.kind === "$" || astNode.kind === "Lookbehind") {
              traversalResults.hasEnd = true;
              return astNode;
            } else {
              throw new Error(`Assertions of kind ${astNode.kind} not implemented yet!`);
            }
          }
          case "Backreference":
            return astNode;
          default:
            throw raiseUnsupportedASTNode(astNode);
        }
      }
      function addMissingDotStar(astNode) {
        return addMissingDotStarTraversalAddMissing(astNode, true, true);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/ReadRegex.js
  var require_ReadRegex = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/ReadRegex.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TokenizerBlockMode = void 0;
      exports.readFrom = readFrom;
      function charSizeAt(text, pos) {
        return text[pos] >= "\uD800" && text[pos] <= "\uDBFF" && text[pos + 1] >= "\uDC00" && text[pos + 1] <= "\uDFFF" ? 2 : 1;
      }
      function isHexaDigit(char) {
        return char >= "0" && char <= "9" || char >= "a" && char <= "f" || char >= "A" && char <= "F";
      }
      function isDigit(char) {
        return char >= "0" && char <= "9";
      }
      function squaredBracketBlockContentEndFrom(text, from) {
        for (let index = from; index !== text.length; ++index) {
          const char = text[index];
          if (char === "\\") {
            index += 1;
          } else if (char === "]") {
            return index;
          }
        }
        throw new Error(`Missing closing ']'`);
      }
      function parenthesisBlockContentEndFrom(text, from) {
        let numExtraOpened = 0;
        for (let index = from; index !== text.length; ++index) {
          const char = text[index];
          if (char === "\\") {
            index += 1;
          } else if (char === ")") {
            if (numExtraOpened === 0) {
              return index;
            }
            numExtraOpened -= 1;
          } else if (char === "[") {
            index = squaredBracketBlockContentEndFrom(text, index);
          } else if (char === "(") {
            numExtraOpened += 1;
          }
        }
        throw new Error(`Missing closing ')'`);
      }
      function curlyBracketBlockContentEndFrom(text, from) {
        let foundComma = false;
        for (let index = from; index !== text.length; ++index) {
          const char = text[index];
          if (isDigit(char)) {
          } else if (from === index) {
            return -1;
          } else if (char === ",") {
            if (foundComma) {
              return -1;
            }
            foundComma = true;
          } else if (char === "}") {
            return index;
          } else {
            return -1;
          }
        }
        return -1;
      }
      var TokenizerBlockMode;
      (function(TokenizerBlockMode2) {
        TokenizerBlockMode2[TokenizerBlockMode2["Full"] = 0] = "Full";
        TokenizerBlockMode2[TokenizerBlockMode2["Character"] = 1] = "Character";
      })(TokenizerBlockMode || (exports.TokenizerBlockMode = TokenizerBlockMode = {}));
      function blockEndFrom(text, from, unicodeMode, mode) {
        switch (text[from]) {
          case "[": {
            if (mode === TokenizerBlockMode.Character) {
              return from + 1;
            }
            return squaredBracketBlockContentEndFrom(text, from + 1) + 1;
          }
          case "{": {
            if (mode === TokenizerBlockMode.Character) {
              return from + 1;
            }
            const foundEnd = curlyBracketBlockContentEndFrom(text, from + 1);
            if (foundEnd === -1) {
              return from + 1;
            }
            return foundEnd + 1;
          }
          case "(": {
            if (mode === TokenizerBlockMode.Character) {
              return from + 1;
            }
            return parenthesisBlockContentEndFrom(text, from + 1) + 1;
          }
          case "]":
          case "}":
          case ")":
            return from + 1;
          case "\\": {
            const next1 = text[from + 1];
            switch (next1) {
              case "x":
                if (isHexaDigit(text[from + 2]) && isHexaDigit(text[from + 3])) {
                  return from + 4;
                }
                throw new Error(`Unexpected token '${text.substring(from, from + 4)}' found`);
              case "u":
                if (text[from + 2] === "{") {
                  if (!unicodeMode) {
                    return from + 2;
                  }
                  if (text[from + 4] === "}") {
                    if (isHexaDigit(text[from + 3])) {
                      return from + 5;
                    }
                    throw new Error(`Unexpected token '${text.substring(from, from + 5)}' found`);
                  }
                  if (text[from + 5] === "}") {
                    if (isHexaDigit(text[from + 3]) && isHexaDigit(text[from + 4])) {
                      return from + 6;
                    }
                    throw new Error(`Unexpected token '${text.substring(from, from + 6)}' found`);
                  }
                  if (text[from + 6] === "}") {
                    if (isHexaDigit(text[from + 3]) && isHexaDigit(text[from + 4]) && isHexaDigit(text[from + 5])) {
                      return from + 7;
                    }
                    throw new Error(`Unexpected token '${text.substring(from, from + 7)}' found`);
                  }
                  if (text[from + 7] === "}") {
                    if (isHexaDigit(text[from + 3]) && isHexaDigit(text[from + 4]) && isHexaDigit(text[from + 5]) && isHexaDigit(text[from + 6])) {
                      return from + 8;
                    }
                    throw new Error(`Unexpected token '${text.substring(from, from + 8)}' found`);
                  }
                  if (text[from + 8] === "}" && isHexaDigit(text[from + 3]) && isHexaDigit(text[from + 4]) && isHexaDigit(text[from + 5]) && isHexaDigit(text[from + 6]) && isHexaDigit(text[from + 7])) {
                    return from + 9;
                  }
                  throw new Error(`Unexpected token '${text.substring(from, from + 9)}' found`);
                }
                if (isHexaDigit(text[from + 2]) && isHexaDigit(text[from + 3]) && isHexaDigit(text[from + 4]) && isHexaDigit(text[from + 5])) {
                  return from + 6;
                }
                throw new Error(`Unexpected token '${text.substring(from, from + 6)}' found`);
              case "p":
              case "P": {
                if (!unicodeMode) {
                  return from + 2;
                }
                let subIndex = from + 2;
                for (; subIndex < text.length && text[subIndex] !== "}"; subIndex += text[subIndex] === "\\" ? 2 : 1) {
                }
                if (text[subIndex] !== "}") {
                  throw new Error(`Invalid \\P definition`);
                }
                return subIndex + 1;
              }
              case "k": {
                let subIndex = from + 2;
                for (; subIndex < text.length && text[subIndex] !== ">"; ++subIndex) {
                }
                if (text[subIndex] !== ">") {
                  if (!unicodeMode) {
                    return from + 2;
                  }
                  throw new Error(`Invalid \\k definition`);
                }
                return subIndex + 1;
              }
              default: {
                if (isDigit(next1)) {
                  const maxIndex = unicodeMode ? text.length : Math.min(from + 4, text.length);
                  let subIndex = from + 2;
                  for (; subIndex < maxIndex && isDigit(text[subIndex]); ++subIndex) {
                  }
                  return subIndex;
                }
                const charSize = unicodeMode ? charSizeAt(text, from + 1) : 1;
                return from + charSize + 1;
              }
            }
          }
          default: {
            const charSize = unicodeMode ? charSizeAt(text, from) : 1;
            return from + charSize;
          }
        }
      }
      function readFrom(text, from, unicodeMode, mode) {
        const to = blockEndFrom(text, from, unicodeMode, mode);
        return text.substring(from, to);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/TokenizeRegex.js
  var require_TokenizeRegex = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/TokenizeRegex.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.tokenizeRegex = tokenizeRegex;
      var globals_1 = require_globals();
      var ReadRegex_1 = require_ReadRegex();
      var safeStringFromCodePoint = String.fromCodePoint;
      function safePop(tokens) {
        const previous = tokens.pop();
        if (previous === void 0) {
          throw new Error("Unable to extract token preceeding the currently parsed one");
        }
        return previous;
      }
      function isDigit(char) {
        return char >= "0" && char <= "9";
      }
      function simpleChar(char, escaped) {
        return {
          type: "Char",
          kind: "simple",
          symbol: char,
          value: char,
          codePoint: char.codePointAt(0) || -1,
          escaped
        };
      }
      function metaEscapedChar(block, symbol) {
        return {
          type: "Char",
          kind: "meta",
          symbol,
          value: block,
          codePoint: symbol.codePointAt(0) || -1
        };
      }
      function toSingleToken(tokens, allowEmpty) {
        if (tokens.length > 1) {
          return {
            type: "Alternative",
            expressions: tokens
          };
        }
        if (!allowEmpty && tokens.length === 0) {
          throw new Error(`Unsupported no token`);
        }
        return tokens[0];
      }
      function blockToCharToken(block) {
        if (block[0] === "\\") {
          const next = block[1];
          switch (next) {
            case "x": {
              const allDigits = block.substring(2);
              const codePoint = Number.parseInt(allDigits, 16);
              const symbol = safeStringFromCodePoint(codePoint);
              return { type: "Char", kind: "hex", symbol, value: block, codePoint };
            }
            case "u": {
              if (block === "\\u") {
                return simpleChar("u", true);
              }
              const allDigits = block[2] === "{" ? block.substring(3, block.length - 1) : block.substring(2);
              const codePoint = Number.parseInt(allDigits, 16);
              const symbol = safeStringFromCodePoint(codePoint);
              return { type: "Char", kind: "unicode", symbol, value: block, codePoint };
            }
            case "0": {
              return metaEscapedChar(block, "\0");
            }
            case "n": {
              return metaEscapedChar(block, "\n");
            }
            case "f": {
              return metaEscapedChar(block, "\f");
            }
            case "r": {
              return metaEscapedChar(block, "\r");
            }
            case "t": {
              return metaEscapedChar(block, "	");
            }
            case "v": {
              return metaEscapedChar(block, "\v");
            }
            case "w":
            case "W":
            case "d":
            case "D":
            case "s":
            case "S":
            case "b":
            case "B": {
              return { type: "Char", kind: "meta", symbol: void 0, value: block, codePoint: Number.NaN };
            }
            default: {
              if (isDigit(next)) {
                const allDigits = block.substring(1);
                const codePoint = Number(allDigits);
                const symbol = safeStringFromCodePoint(codePoint);
                return { type: "Char", kind: "decimal", symbol, value: block, codePoint };
              }
              if (block.length > 2 && (next === "p" || next === "P")) {
                throw new Error(`UnicodeProperty not implemented yet!`);
              }
              const char = block.substring(1);
              return simpleChar(char, true);
            }
          }
        }
        return simpleChar(block);
      }
      function pushTokens(tokens, regexSource, unicodeMode, groups) {
        let disjunctions = null;
        for (let index = 0, block = (0, ReadRegex_1.readFrom)(regexSource, index, unicodeMode, ReadRegex_1.TokenizerBlockMode.Full); index !== regexSource.length; index += block.length, block = (0, ReadRegex_1.readFrom)(regexSource, index, unicodeMode, ReadRegex_1.TokenizerBlockMode.Full)) {
          const firstInBlock = block[0];
          switch (firstInBlock) {
            case "|": {
              if (disjunctions === null) {
                disjunctions = [];
              }
              disjunctions.push(toSingleToken(tokens.splice(0), true) || null);
              break;
            }
            case ".": {
              tokens.push({ type: "Char", kind: "meta", symbol: block, value: block, codePoint: Number.NaN });
              break;
            }
            case "*":
            case "+": {
              const previous = safePop(tokens);
              tokens.push({
                type: "Repetition",
                expression: previous,
                quantifier: { type: "Quantifier", kind: firstInBlock, greedy: true }
              });
              break;
            }
            case "?": {
              const previous = safePop(tokens);
              if (previous.type === "Repetition") {
                previous.quantifier.greedy = false;
                tokens.push(previous);
              } else {
                tokens.push({
                  type: "Repetition",
                  expression: previous,
                  quantifier: { type: "Quantifier", kind: firstInBlock, greedy: true }
                });
              }
              break;
            }
            case "{": {
              if (block === "{") {
                tokens.push(simpleChar(block));
                break;
              }
              const previous = safePop(tokens);
              const quantifierText = block.substring(1, block.length - 1);
              const quantifierTokens = quantifierText.split(",");
              const from = Number(quantifierTokens[0]);
              const to = quantifierTokens.length === 1 ? from : quantifierTokens[1].length !== 0 ? Number(quantifierTokens[1]) : void 0;
              tokens.push({
                type: "Repetition",
                expression: previous,
                quantifier: { type: "Quantifier", kind: "Range", greedy: true, from, to }
              });
              break;
            }
            case "[": {
              const blockContent = block.substring(1, block.length - 1);
              const subTokens = [];
              let negative = void 0;
              let previousWasSimpleDash = false;
              for (let subIndex = 0, subBlock = (0, ReadRegex_1.readFrom)(blockContent, subIndex, unicodeMode, ReadRegex_1.TokenizerBlockMode.Character); subIndex !== blockContent.length; subIndex += subBlock.length, subBlock = (0, ReadRegex_1.readFrom)(blockContent, subIndex, unicodeMode, ReadRegex_1.TokenizerBlockMode.Character)) {
                if (subIndex === 0 && subBlock === "^") {
                  negative = true;
                  continue;
                }
                const newToken = blockToCharToken(subBlock);
                if (subBlock === "-") {
                  subTokens.push(newToken);
                  previousWasSimpleDash = true;
                } else {
                  const operand1Token = subTokens.length >= 2 ? subTokens[subTokens.length - 2] : void 0;
                  if (previousWasSimpleDash && operand1Token !== void 0 && operand1Token.type === "Char") {
                    subTokens.pop();
                    subTokens.pop();
                    subTokens.push({ type: "ClassRange", from: operand1Token, to: newToken });
                  } else {
                    subTokens.push(newToken);
                  }
                  previousWasSimpleDash = false;
                }
              }
              tokens.push({ type: "CharacterClass", expressions: subTokens, negative });
              break;
            }
            case "(": {
              const blockContent = block.substring(1, block.length - 1);
              const subTokens = [];
              if (blockContent[0] === "?") {
                if (blockContent[1] === ":") {
                  pushTokens(subTokens, blockContent.substring(2), unicodeMode, groups);
                  tokens.push({
                    type: "Group",
                    capturing: false,
                    expression: toSingleToken(subTokens)
                  });
                } else if (blockContent[1] === "=" || blockContent[1] === "!") {
                  pushTokens(subTokens, blockContent.substring(2), unicodeMode, groups);
                  tokens.push({
                    type: "Assertion",
                    kind: "Lookahead",
                    negative: blockContent[1] === "!" ? true : void 0,
                    assertion: toSingleToken(subTokens)
                  });
                } else if (blockContent[1] === "<" && (blockContent[2] === "=" || blockContent[2] === "!")) {
                  pushTokens(subTokens, blockContent.substring(3), unicodeMode, groups);
                  tokens.push({
                    type: "Assertion",
                    kind: "Lookbehind",
                    negative: blockContent[2] === "!" ? true : void 0,
                    assertion: toSingleToken(subTokens)
                  });
                } else {
                  const chunks = blockContent.split(">");
                  if (chunks.length < 2 || chunks[0][1] !== "<") {
                    throw new Error(`Unsupported regex content found at ${JSON.stringify(block)}`);
                  }
                  const groupIndex = ++groups.lastIndex;
                  const nameRaw = chunks[0].substring(2);
                  groups.named.set(nameRaw, groupIndex);
                  pushTokens(subTokens, chunks.slice(1).join(">"), unicodeMode, groups);
                  tokens.push({
                    type: "Group",
                    capturing: true,
                    nameRaw,
                    name: nameRaw,
                    number: groupIndex,
                    expression: toSingleToken(subTokens)
                  });
                }
              } else {
                const groupIndex = ++groups.lastIndex;
                pushTokens(subTokens, blockContent, unicodeMode, groups);
                tokens.push({
                  type: "Group",
                  capturing: true,
                  number: groupIndex,
                  expression: toSingleToken(subTokens)
                });
              }
              break;
            }
            default: {
              if (block === "^") {
                tokens.push({ type: "Assertion", kind: block });
              } else if (block === "$") {
                tokens.push({ type: "Assertion", kind: block });
              } else if (block[0] === "\\" && isDigit(block[1])) {
                const reference = Number(block.substring(1));
                if (unicodeMode || reference <= groups.lastIndex) {
                  tokens.push({ type: "Backreference", kind: "number", number: reference, reference });
                } else {
                  tokens.push(blockToCharToken(block));
                }
              } else if (block[0] === "\\" && block[1] === "k" && block.length !== 2) {
                const referenceRaw = block.substring(3, block.length - 1);
                tokens.push({
                  type: "Backreference",
                  kind: "name",
                  number: groups.named.get(referenceRaw) || 0,
                  referenceRaw,
                  reference: referenceRaw
                });
              } else {
                tokens.push(blockToCharToken(block));
              }
              break;
            }
          }
        }
        if (disjunctions !== null) {
          disjunctions.push(toSingleToken(tokens.splice(0), true) || null);
          let currentDisjunction = {
            type: "Disjunction",
            left: disjunctions[0],
            right: disjunctions[1]
          };
          for (let index = 2; index < disjunctions.length; ++index) {
            currentDisjunction = {
              type: "Disjunction",
              left: currentDisjunction,
              right: disjunctions[index]
            };
          }
          tokens.push(currentDisjunction);
        }
      }
      function tokenizeRegex(regex) {
        const unicodeMode = (0, globals_1.safeIndexOf)([...regex.flags], "u") !== -1;
        const regexSource = regex.source;
        const tokens = [];
        pushTokens(tokens, regexSource, unicodeMode, { lastIndex: 0, named: /* @__PURE__ */ new Map() });
        return toSingleToken(tokens);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/stringMatching.js
  var require_stringMatching = __commonJS({
    "node_modules/fast-check/lib/arbitrary/stringMatching.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.stringMatching = stringMatching;
      var globals_1 = require_globals();
      var globals_2 = require_globals();
      var stringify_1 = require_stringify();
      var SanitizeRegexAst_1 = require_SanitizeRegexAst();
      var TokenizeRegex_1 = require_TokenizeRegex();
      var char_1 = require_char();
      var constant_1 = require_constant();
      var constantFrom_1 = require_constantFrom();
      var integer_1 = require_integer();
      var oneof_1 = require_oneof();
      var stringOf_1 = require_stringOf();
      var tuple_1 = require_tuple();
      var safeStringFromCodePoint = String.fromCodePoint;
      var wordChars = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"];
      var digitChars = [..."0123456789"];
      var spaceChars = [..." 	\r\n\v\f"];
      var newLineChars = [..."\r\n"];
      var terminatorChars = [...""];
      var newLineAndTerminatorChars = [...newLineChars, ...terminatorChars];
      var defaultChar = (0, char_1.char)();
      function raiseUnsupportedASTNode(astNode) {
        return new globals_2.Error(`Unsupported AST node! Received: ${(0, stringify_1.stringify)(astNode)}`);
      }
      function toMatchingArbitrary(astNode, constraints, flags) {
        switch (astNode.type) {
          case "Char": {
            if (astNode.kind === "meta") {
              switch (astNode.value) {
                case "\\w": {
                  return (0, constantFrom_1.constantFrom)(...wordChars);
                }
                case "\\W": {
                  return defaultChar.filter((c) => (0, globals_2.safeIndexOf)(wordChars, c) === -1);
                }
                case "\\d": {
                  return (0, constantFrom_1.constantFrom)(...digitChars);
                }
                case "\\D": {
                  return defaultChar.filter((c) => (0, globals_2.safeIndexOf)(digitChars, c) === -1);
                }
                case "\\s": {
                  return (0, constantFrom_1.constantFrom)(...spaceChars);
                }
                case "\\S": {
                  return defaultChar.filter((c) => (0, globals_2.safeIndexOf)(spaceChars, c) === -1);
                }
                case "\\b":
                case "\\B": {
                  throw new globals_2.Error(`Meta character ${astNode.value} not implemented yet!`);
                }
                case ".": {
                  const forbiddenChars = flags.dotAll ? terminatorChars : newLineAndTerminatorChars;
                  return defaultChar.filter((c) => (0, globals_2.safeIndexOf)(forbiddenChars, c) === -1);
                }
              }
            }
            if (astNode.symbol === void 0) {
              throw new globals_2.Error(`Unexpected undefined symbol received for non-meta Char! Received: ${(0, stringify_1.stringify)(astNode)}`);
            }
            return (0, constant_1.constant)(astNode.symbol);
          }
          case "Repetition": {
            const node = toMatchingArbitrary(astNode.expression, constraints, flags);
            switch (astNode.quantifier.kind) {
              case "*": {
                return (0, stringOf_1.stringOf)(node, constraints);
              }
              case "+": {
                return (0, stringOf_1.stringOf)(node, Object.assign(Object.assign({}, constraints), { minLength: 1 }));
              }
              case "?": {
                return (0, stringOf_1.stringOf)(node, Object.assign(Object.assign({}, constraints), { minLength: 0, maxLength: 1 }));
              }
              case "Range": {
                return (0, stringOf_1.stringOf)(node, Object.assign(Object.assign({}, constraints), { minLength: astNode.quantifier.from, maxLength: astNode.quantifier.to }));
              }
              default: {
                throw raiseUnsupportedASTNode(astNode.quantifier);
              }
            }
          }
          case "Quantifier": {
            throw new globals_2.Error(`Wrongly defined AST tree, Quantifier nodes not supposed to be scanned!`);
          }
          case "Alternative": {
            return (0, tuple_1.tuple)(...(0, globals_2.safeMap)(astNode.expressions, (n) => toMatchingArbitrary(n, constraints, flags))).map((vs) => (0, globals_1.safeJoin)(vs, ""));
          }
          case "CharacterClass":
            if (astNode.negative) {
              const childrenArbitraries = (0, globals_2.safeMap)(astNode.expressions, (n) => toMatchingArbitrary(n, constraints, flags));
              return defaultChar.filter((c) => (0, globals_1.safeEvery)(childrenArbitraries, (arb) => !arb.canShrinkWithoutContext(c)));
            }
            return (0, oneof_1.oneof)(...(0, globals_2.safeMap)(astNode.expressions, (n) => toMatchingArbitrary(n, constraints, flags)));
          case "ClassRange": {
            const min = astNode.from.codePoint;
            const max = astNode.to.codePoint;
            return (0, integer_1.integer)({ min, max }).map((n) => safeStringFromCodePoint(n), (c) => {
              if (typeof c !== "string")
                throw new globals_2.Error("Invalid type");
              if ([...c].length !== 1)
                throw new globals_2.Error("Invalid length");
              return c.codePointAt(0);
            });
          }
          case "Group": {
            return toMatchingArbitrary(astNode.expression, constraints, flags);
          }
          case "Disjunction": {
            const left = astNode.left !== null ? toMatchingArbitrary(astNode.left, constraints, flags) : (0, constant_1.constant)("");
            const right = astNode.right !== null ? toMatchingArbitrary(astNode.right, constraints, flags) : (0, constant_1.constant)("");
            return (0, oneof_1.oneof)(left, right);
          }
          case "Assertion": {
            if (astNode.kind === "^" || astNode.kind === "$") {
              if (flags.multiline) {
                if (astNode.kind === "^") {
                  return (0, oneof_1.oneof)((0, constant_1.constant)(""), (0, tuple_1.tuple)((0, stringOf_1.stringOf)(defaultChar), (0, constantFrom_1.constantFrom)(...newLineChars)).map((t) => `${t[0]}${t[1]}`, (value) => {
                    if (typeof value !== "string" || value.length === 0)
                      throw new globals_2.Error("Invalid type");
                    return [value.substring(0, value.length - 1), value[value.length - 1]];
                  }));
                } else {
                  return (0, oneof_1.oneof)((0, constant_1.constant)(""), (0, tuple_1.tuple)((0, constantFrom_1.constantFrom)(...newLineChars), (0, stringOf_1.stringOf)(defaultChar)).map((t) => `${t[0]}${t[1]}`, (value) => {
                    if (typeof value !== "string" || value.length === 0)
                      throw new globals_2.Error("Invalid type");
                    return [value[0], value.substring(1)];
                  }));
                }
              }
              return (0, constant_1.constant)("");
            }
            throw new globals_2.Error(`Assertions of kind ${astNode.kind} not implemented yet!`);
          }
          case "Backreference": {
            throw new globals_2.Error(`Backreference nodes not implemented yet!`);
          }
          default: {
            throw raiseUnsupportedASTNode(astNode);
          }
        }
      }
      function stringMatching(regex, constraints = {}) {
        for (const flag of regex.flags) {
          if (flag !== "d" && flag !== "g" && flag !== "m" && flag !== "s" && flag !== "u") {
            throw new globals_2.Error(`Unable to use "stringMatching" against a regex using the flag ${flag}`);
          }
        }
        const sanitizedConstraints = { size: constraints.size };
        const flags = { multiline: regex.multiline, dotAll: regex.dotAll };
        const regexRootToken = (0, SanitizeRegexAst_1.addMissingDotStar)((0, TokenizeRegex_1.tokenizeRegex)(regex));
        return toMatchingArbitrary(regexRootToken, sanitizedConstraints, flags);
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/helpers/ZipIterableIterators.js
  var require_ZipIterableIterators = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/helpers/ZipIterableIterators.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.zipIterableIterators = zipIterableIterators;
      function initZippedValues(its) {
        const vs = [];
        for (let index = 0; index !== its.length; ++index) {
          vs.push(its[index].next());
        }
        return vs;
      }
      function nextZippedValues(its, vs) {
        for (let index = 0; index !== its.length; ++index) {
          vs[index] = its[index].next();
        }
      }
      function isDoneZippedValues(vs) {
        for (let index = 0; index !== vs.length; ++index) {
          if (vs[index].done) {
            return true;
          }
        }
        return false;
      }
      function* zipIterableIterators(...its) {
        const vs = initZippedValues(its);
        while (!isDoneZippedValues(vs)) {
          yield vs.map((v) => v.value);
          nextZippedValues(its, vs);
        }
      }
    }
  });

  // node_modules/fast-check/lib/arbitrary/_internals/LimitedShrinkArbitrary.js
  var require_LimitedShrinkArbitrary = __commonJS({
    "node_modules/fast-check/lib/arbitrary/_internals/LimitedShrinkArbitrary.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LimitedShrinkArbitrary = void 0;
      var Arbitrary_1 = require_Arbitrary();
      var Value_1 = require_Value();
      var Stream_1 = require_Stream();
      var ZipIterableIterators_1 = require_ZipIterableIterators();
      function* iotaFrom(startValue) {
        let value = startValue;
        while (true) {
          yield value;
          ++value;
        }
      }
      var LimitedShrinkArbitrary = class extends Arbitrary_1.Arbitrary {
        constructor(arb, maxShrinks) {
          super();
          this.arb = arb;
          this.maxShrinks = maxShrinks;
        }
        generate(mrng, biasFactor) {
          const value = this.arb.generate(mrng, biasFactor);
          return this.valueMapper(value, 0);
        }
        canShrinkWithoutContext(value) {
          return this.arb.canShrinkWithoutContext(value);
        }
        shrink(value, context) {
          if (this.isSafeContext(context)) {
            return this.safeShrink(value, context.originalContext, context.length);
          }
          return this.safeShrink(value, void 0, 0);
        }
        safeShrink(value, originalContext, currentLength) {
          const remaining = this.maxShrinks - currentLength;
          if (remaining <= 0) {
            return Stream_1.Stream.nil();
          }
          return new Stream_1.Stream((0, ZipIterableIterators_1.zipIterableIterators)(this.arb.shrink(value, originalContext), iotaFrom(currentLength + 1))).take(remaining).map((valueAndLength) => this.valueMapper(valueAndLength[0], valueAndLength[1]));
        }
        valueMapper(v, newLength) {
          const context = { originalContext: v.context, length: newLength };
          return new Value_1.Value(v.value, context);
        }
        isSafeContext(context) {
          return context != null && typeof context === "object" && "originalContext" in context && "length" in context;
        }
      };
      exports.LimitedShrinkArbitrary = LimitedShrinkArbitrary;
    }
  });

  // node_modules/fast-check/lib/arbitrary/limitShrink.js
  var require_limitShrink = __commonJS({
    "node_modules/fast-check/lib/arbitrary/limitShrink.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.limitShrink = limitShrink;
      var LimitedShrinkArbitrary_1 = require_LimitedShrinkArbitrary();
      function limitShrink(arbitrary, maxShrinks) {
        return new LimitedShrinkArbitrary_1.LimitedShrinkArbitrary(arbitrary, maxShrinks);
      }
    }
  });

  // node_modules/fast-check/lib/fast-check-default.js
  var require_fast_check_default = __commonJS({
    "node_modules/fast-check/lib/fast-check-default.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.noShrink = exports.noBias = exports.clone = exports.oneof = exports.option = exports.mapToConstant = exports.constantFrom = exports.constant = exports.lorem = exports.limitShrink = exports.stringMatching = exports.base64String = exports.hexaString = exports.fullUnicodeString = exports.unicodeString = exports.stringOf = exports.string16bits = exports.asciiString = exports.string = exports.mixedCase = exports.base64 = exports.hexa = exports.fullUnicode = exports.unicode = exports.char16bits = exports.ascii = exports.char = exports.bigUint = exports.bigInt = exports.bigUintN = exports.bigIntN = exports.maxSafeNat = exports.maxSafeInteger = exports.nat = exports.integer = exports.double = exports.float = exports.falsy = exports.boolean = exports.asyncProperty = exports.property = exports.PreconditionFailure = exports.pre = exports.assert = exports.check = exports.statistics = exports.sample = exports.__commitHash = exports.__version = exports.__type = void 0;
      exports.modelRun = exports.asyncModelRun = exports.bigUint64Array = exports.bigInt64Array = exports.float64Array = exports.float32Array = exports.uint32Array = exports.int32Array = exports.uint16Array = exports.int16Array = exports.uint8ClampedArray = exports.uint8Array = exports.int8Array = exports.uuidV = exports.uuid = exports.ulid = exports.emailAddress = exports.webUrl = exports.webQueryParameters = exports.webPath = exports.webFragments = exports.webSegment = exports.webAuthority = exports.domain = exports.ipV6 = exports.ipV4Extended = exports.ipV4 = exports.date = exports.gen = exports.context = exports.func = exports.compareFunc = exports.compareBooleanFunc = exports.memo = exports.letrec = exports.unicodeJsonValue = exports.unicodeJson = exports.jsonValue = exports.json = exports.object = exports.anything = exports.dictionary = exports.record = exports.tuple = exports.uniqueArray = exports.infiniteStream = exports.sparseArray = exports.array = exports.subarray = exports.shuffledSubarray = void 0;
      exports.createDepthIdentifier = exports.stream = exports.Stream = exports.Random = exports.ExecutionStatus = exports.resetConfigureGlobal = exports.readConfigureGlobal = exports.configureGlobal = exports.VerbosityLevel = exports.hash = exports.asyncDefaultReportMessage = exports.defaultReportMessage = exports.asyncStringify = exports.stringify = exports.getDepthContextFor = exports.hasAsyncToStringMethod = exports.asyncToStringMethod = exports.hasToStringMethod = exports.toStringMethod = exports.hasCloneMethod = exports.cloneIfNeeded = exports.cloneMethod = exports.Value = exports.Arbitrary = exports.schedulerFor = exports.scheduler = exports.commands = exports.scheduledModelRun = void 0;
      var Pre_1 = require_Pre();
      Object.defineProperty(exports, "pre", { enumerable: true, get: function() {
        return Pre_1.pre;
      } });
      var AsyncProperty_1 = require_AsyncProperty();
      Object.defineProperty(exports, "asyncProperty", { enumerable: true, get: function() {
        return AsyncProperty_1.asyncProperty;
      } });
      var Property_1 = require_Property();
      Object.defineProperty(exports, "property", { enumerable: true, get: function() {
        return Property_1.property;
      } });
      var Runner_1 = require_Runner();
      Object.defineProperty(exports, "assert", { enumerable: true, get: function() {
        return Runner_1.assert;
      } });
      Object.defineProperty(exports, "check", { enumerable: true, get: function() {
        return Runner_1.check;
      } });
      var Sampler_1 = require_Sampler();
      Object.defineProperty(exports, "sample", { enumerable: true, get: function() {
        return Sampler_1.sample;
      } });
      Object.defineProperty(exports, "statistics", { enumerable: true, get: function() {
        return Sampler_1.statistics;
      } });
      var gen_1 = require_gen();
      Object.defineProperty(exports, "gen", { enumerable: true, get: function() {
        return gen_1.gen;
      } });
      var array_1 = require_array();
      Object.defineProperty(exports, "array", { enumerable: true, get: function() {
        return array_1.array;
      } });
      var bigInt_1 = require_bigInt();
      Object.defineProperty(exports, "bigInt", { enumerable: true, get: function() {
        return bigInt_1.bigInt;
      } });
      var bigIntN_1 = require_bigIntN();
      Object.defineProperty(exports, "bigIntN", { enumerable: true, get: function() {
        return bigIntN_1.bigIntN;
      } });
      var bigUint_1 = require_bigUint();
      Object.defineProperty(exports, "bigUint", { enumerable: true, get: function() {
        return bigUint_1.bigUint;
      } });
      var bigUintN_1 = require_bigUintN();
      Object.defineProperty(exports, "bigUintN", { enumerable: true, get: function() {
        return bigUintN_1.bigUintN;
      } });
      var boolean_1 = require_boolean();
      Object.defineProperty(exports, "boolean", { enumerable: true, get: function() {
        return boolean_1.boolean;
      } });
      var falsy_1 = require_falsy();
      Object.defineProperty(exports, "falsy", { enumerable: true, get: function() {
        return falsy_1.falsy;
      } });
      var ascii_1 = require_ascii();
      Object.defineProperty(exports, "ascii", { enumerable: true, get: function() {
        return ascii_1.ascii;
      } });
      var base64_1 = require_base64();
      Object.defineProperty(exports, "base64", { enumerable: true, get: function() {
        return base64_1.base64;
      } });
      var char_1 = require_char();
      Object.defineProperty(exports, "char", { enumerable: true, get: function() {
        return char_1.char;
      } });
      var char16bits_1 = require_char16bits();
      Object.defineProperty(exports, "char16bits", { enumerable: true, get: function() {
        return char16bits_1.char16bits;
      } });
      var fullUnicode_1 = require_fullUnicode();
      Object.defineProperty(exports, "fullUnicode", { enumerable: true, get: function() {
        return fullUnicode_1.fullUnicode;
      } });
      var hexa_1 = require_hexa();
      Object.defineProperty(exports, "hexa", { enumerable: true, get: function() {
        return hexa_1.hexa;
      } });
      var unicode_1 = require_unicode();
      Object.defineProperty(exports, "unicode", { enumerable: true, get: function() {
        return unicode_1.unicode;
      } });
      var constant_1 = require_constant();
      Object.defineProperty(exports, "constant", { enumerable: true, get: function() {
        return constant_1.constant;
      } });
      var constantFrom_1 = require_constantFrom();
      Object.defineProperty(exports, "constantFrom", { enumerable: true, get: function() {
        return constantFrom_1.constantFrom;
      } });
      var context_1 = require_context();
      Object.defineProperty(exports, "context", { enumerable: true, get: function() {
        return context_1.context;
      } });
      var date_1 = require_date();
      Object.defineProperty(exports, "date", { enumerable: true, get: function() {
        return date_1.date;
      } });
      var clone_1 = require_clone();
      Object.defineProperty(exports, "clone", { enumerable: true, get: function() {
        return clone_1.clone;
      } });
      var dictionary_1 = require_dictionary();
      Object.defineProperty(exports, "dictionary", { enumerable: true, get: function() {
        return dictionary_1.dictionary;
      } });
      var emailAddress_1 = require_emailAddress();
      Object.defineProperty(exports, "emailAddress", { enumerable: true, get: function() {
        return emailAddress_1.emailAddress;
      } });
      var double_1 = require_double();
      Object.defineProperty(exports, "double", { enumerable: true, get: function() {
        return double_1.double;
      } });
      var float_1 = require_float();
      Object.defineProperty(exports, "float", { enumerable: true, get: function() {
        return float_1.float;
      } });
      var compareBooleanFunc_1 = require_compareBooleanFunc();
      Object.defineProperty(exports, "compareBooleanFunc", { enumerable: true, get: function() {
        return compareBooleanFunc_1.compareBooleanFunc;
      } });
      var compareFunc_1 = require_compareFunc();
      Object.defineProperty(exports, "compareFunc", { enumerable: true, get: function() {
        return compareFunc_1.compareFunc;
      } });
      var func_1 = require_func();
      Object.defineProperty(exports, "func", { enumerable: true, get: function() {
        return func_1.func;
      } });
      var domain_1 = require_domain();
      Object.defineProperty(exports, "domain", { enumerable: true, get: function() {
        return domain_1.domain;
      } });
      var integer_1 = require_integer();
      Object.defineProperty(exports, "integer", { enumerable: true, get: function() {
        return integer_1.integer;
      } });
      var maxSafeInteger_1 = require_maxSafeInteger();
      Object.defineProperty(exports, "maxSafeInteger", { enumerable: true, get: function() {
        return maxSafeInteger_1.maxSafeInteger;
      } });
      var maxSafeNat_1 = require_maxSafeNat();
      Object.defineProperty(exports, "maxSafeNat", { enumerable: true, get: function() {
        return maxSafeNat_1.maxSafeNat;
      } });
      var nat_1 = require_nat();
      Object.defineProperty(exports, "nat", { enumerable: true, get: function() {
        return nat_1.nat;
      } });
      var ipV4_1 = require_ipV4();
      Object.defineProperty(exports, "ipV4", { enumerable: true, get: function() {
        return ipV4_1.ipV4;
      } });
      var ipV4Extended_1 = require_ipV4Extended();
      Object.defineProperty(exports, "ipV4Extended", { enumerable: true, get: function() {
        return ipV4Extended_1.ipV4Extended;
      } });
      var ipV6_1 = require_ipV6();
      Object.defineProperty(exports, "ipV6", { enumerable: true, get: function() {
        return ipV6_1.ipV6;
      } });
      var letrec_1 = require_letrec();
      Object.defineProperty(exports, "letrec", { enumerable: true, get: function() {
        return letrec_1.letrec;
      } });
      var lorem_1 = require_lorem();
      Object.defineProperty(exports, "lorem", { enumerable: true, get: function() {
        return lorem_1.lorem;
      } });
      var mapToConstant_1 = require_mapToConstant();
      Object.defineProperty(exports, "mapToConstant", { enumerable: true, get: function() {
        return mapToConstant_1.mapToConstant;
      } });
      var memo_1 = require_memo();
      Object.defineProperty(exports, "memo", { enumerable: true, get: function() {
        return memo_1.memo;
      } });
      var mixedCase_1 = require_mixedCase();
      Object.defineProperty(exports, "mixedCase", { enumerable: true, get: function() {
        return mixedCase_1.mixedCase;
      } });
      var object_1 = require_object();
      Object.defineProperty(exports, "object", { enumerable: true, get: function() {
        return object_1.object;
      } });
      var json_1 = require_json();
      Object.defineProperty(exports, "json", { enumerable: true, get: function() {
        return json_1.json;
      } });
      var anything_1 = require_anything();
      Object.defineProperty(exports, "anything", { enumerable: true, get: function() {
        return anything_1.anything;
      } });
      var unicodeJsonValue_1 = require_unicodeJsonValue();
      Object.defineProperty(exports, "unicodeJsonValue", { enumerable: true, get: function() {
        return unicodeJsonValue_1.unicodeJsonValue;
      } });
      var jsonValue_1 = require_jsonValue();
      Object.defineProperty(exports, "jsonValue", { enumerable: true, get: function() {
        return jsonValue_1.jsonValue;
      } });
      var unicodeJson_1 = require_unicodeJson();
      Object.defineProperty(exports, "unicodeJson", { enumerable: true, get: function() {
        return unicodeJson_1.unicodeJson;
      } });
      var oneof_1 = require_oneof();
      Object.defineProperty(exports, "oneof", { enumerable: true, get: function() {
        return oneof_1.oneof;
      } });
      var option_1 = require_option();
      Object.defineProperty(exports, "option", { enumerable: true, get: function() {
        return option_1.option;
      } });
      var record_1 = require_record();
      Object.defineProperty(exports, "record", { enumerable: true, get: function() {
        return record_1.record;
      } });
      var uniqueArray_1 = require_uniqueArray();
      Object.defineProperty(exports, "uniqueArray", { enumerable: true, get: function() {
        return uniqueArray_1.uniqueArray;
      } });
      var infiniteStream_1 = require_infiniteStream();
      Object.defineProperty(exports, "infiniteStream", { enumerable: true, get: function() {
        return infiniteStream_1.infiniteStream;
      } });
      var asciiString_1 = require_asciiString();
      Object.defineProperty(exports, "asciiString", { enumerable: true, get: function() {
        return asciiString_1.asciiString;
      } });
      var base64String_1 = require_base64String();
      Object.defineProperty(exports, "base64String", { enumerable: true, get: function() {
        return base64String_1.base64String;
      } });
      var fullUnicodeString_1 = require_fullUnicodeString();
      Object.defineProperty(exports, "fullUnicodeString", { enumerable: true, get: function() {
        return fullUnicodeString_1.fullUnicodeString;
      } });
      var hexaString_1 = require_hexaString();
      Object.defineProperty(exports, "hexaString", { enumerable: true, get: function() {
        return hexaString_1.hexaString;
      } });
      var string_1 = require_string();
      Object.defineProperty(exports, "string", { enumerable: true, get: function() {
        return string_1.string;
      } });
      var string16bits_1 = require_string16bits();
      Object.defineProperty(exports, "string16bits", { enumerable: true, get: function() {
        return string16bits_1.string16bits;
      } });
      var stringOf_1 = require_stringOf();
      Object.defineProperty(exports, "stringOf", { enumerable: true, get: function() {
        return stringOf_1.stringOf;
      } });
      var unicodeString_1 = require_unicodeString();
      Object.defineProperty(exports, "unicodeString", { enumerable: true, get: function() {
        return unicodeString_1.unicodeString;
      } });
      var subarray_1 = require_subarray();
      Object.defineProperty(exports, "subarray", { enumerable: true, get: function() {
        return subarray_1.subarray;
      } });
      var shuffledSubarray_1 = require_shuffledSubarray();
      Object.defineProperty(exports, "shuffledSubarray", { enumerable: true, get: function() {
        return shuffledSubarray_1.shuffledSubarray;
      } });
      var tuple_1 = require_tuple();
      Object.defineProperty(exports, "tuple", { enumerable: true, get: function() {
        return tuple_1.tuple;
      } });
      var ulid_1 = require_ulid();
      Object.defineProperty(exports, "ulid", { enumerable: true, get: function() {
        return ulid_1.ulid;
      } });
      var uuid_1 = require_uuid();
      Object.defineProperty(exports, "uuid", { enumerable: true, get: function() {
        return uuid_1.uuid;
      } });
      var uuidV_1 = require_uuidV();
      Object.defineProperty(exports, "uuidV", { enumerable: true, get: function() {
        return uuidV_1.uuidV;
      } });
      var webAuthority_1 = require_webAuthority();
      Object.defineProperty(exports, "webAuthority", { enumerable: true, get: function() {
        return webAuthority_1.webAuthority;
      } });
      var webFragments_1 = require_webFragments();
      Object.defineProperty(exports, "webFragments", { enumerable: true, get: function() {
        return webFragments_1.webFragments;
      } });
      var webPath_1 = require_webPath();
      Object.defineProperty(exports, "webPath", { enumerable: true, get: function() {
        return webPath_1.webPath;
      } });
      var webQueryParameters_1 = require_webQueryParameters();
      Object.defineProperty(exports, "webQueryParameters", { enumerable: true, get: function() {
        return webQueryParameters_1.webQueryParameters;
      } });
      var webSegment_1 = require_webSegment();
      Object.defineProperty(exports, "webSegment", { enumerable: true, get: function() {
        return webSegment_1.webSegment;
      } });
      var webUrl_1 = require_webUrl();
      Object.defineProperty(exports, "webUrl", { enumerable: true, get: function() {
        return webUrl_1.webUrl;
      } });
      var commands_1 = require_commands();
      Object.defineProperty(exports, "commands", { enumerable: true, get: function() {
        return commands_1.commands;
      } });
      var ModelRunner_1 = require_ModelRunner();
      Object.defineProperty(exports, "asyncModelRun", { enumerable: true, get: function() {
        return ModelRunner_1.asyncModelRun;
      } });
      Object.defineProperty(exports, "modelRun", { enumerable: true, get: function() {
        return ModelRunner_1.modelRun;
      } });
      Object.defineProperty(exports, "scheduledModelRun", { enumerable: true, get: function() {
        return ModelRunner_1.scheduledModelRun;
      } });
      var Random_1 = require_Random();
      Object.defineProperty(exports, "Random", { enumerable: true, get: function() {
        return Random_1.Random;
      } });
      var GlobalParameters_1 = require_GlobalParameters();
      Object.defineProperty(exports, "configureGlobal", { enumerable: true, get: function() {
        return GlobalParameters_1.configureGlobal;
      } });
      Object.defineProperty(exports, "readConfigureGlobal", { enumerable: true, get: function() {
        return GlobalParameters_1.readConfigureGlobal;
      } });
      Object.defineProperty(exports, "resetConfigureGlobal", { enumerable: true, get: function() {
        return GlobalParameters_1.resetConfigureGlobal;
      } });
      var VerbosityLevel_1 = require_VerbosityLevel();
      Object.defineProperty(exports, "VerbosityLevel", { enumerable: true, get: function() {
        return VerbosityLevel_1.VerbosityLevel;
      } });
      var ExecutionStatus_1 = require_ExecutionStatus();
      Object.defineProperty(exports, "ExecutionStatus", { enumerable: true, get: function() {
        return ExecutionStatus_1.ExecutionStatus;
      } });
      var symbols_1 = require_symbols();
      Object.defineProperty(exports, "cloneMethod", { enumerable: true, get: function() {
        return symbols_1.cloneMethod;
      } });
      Object.defineProperty(exports, "cloneIfNeeded", { enumerable: true, get: function() {
        return symbols_1.cloneIfNeeded;
      } });
      Object.defineProperty(exports, "hasCloneMethod", { enumerable: true, get: function() {
        return symbols_1.hasCloneMethod;
      } });
      var Stream_1 = require_Stream();
      Object.defineProperty(exports, "Stream", { enumerable: true, get: function() {
        return Stream_1.Stream;
      } });
      Object.defineProperty(exports, "stream", { enumerable: true, get: function() {
        return Stream_1.stream;
      } });
      var hash_1 = require_hash();
      Object.defineProperty(exports, "hash", { enumerable: true, get: function() {
        return hash_1.hash;
      } });
      var stringify_1 = require_stringify();
      Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
        return stringify_1.stringify;
      } });
      Object.defineProperty(exports, "asyncStringify", { enumerable: true, get: function() {
        return stringify_1.asyncStringify;
      } });
      Object.defineProperty(exports, "toStringMethod", { enumerable: true, get: function() {
        return stringify_1.toStringMethod;
      } });
      Object.defineProperty(exports, "hasToStringMethod", { enumerable: true, get: function() {
        return stringify_1.hasToStringMethod;
      } });
      Object.defineProperty(exports, "asyncToStringMethod", { enumerable: true, get: function() {
        return stringify_1.asyncToStringMethod;
      } });
      Object.defineProperty(exports, "hasAsyncToStringMethod", { enumerable: true, get: function() {
        return stringify_1.hasAsyncToStringMethod;
      } });
      var scheduler_1 = require_scheduler();
      Object.defineProperty(exports, "scheduler", { enumerable: true, get: function() {
        return scheduler_1.scheduler;
      } });
      Object.defineProperty(exports, "schedulerFor", { enumerable: true, get: function() {
        return scheduler_1.schedulerFor;
      } });
      var RunDetailsFormatter_1 = require_RunDetailsFormatter();
      Object.defineProperty(exports, "defaultReportMessage", { enumerable: true, get: function() {
        return RunDetailsFormatter_1.defaultReportMessage;
      } });
      Object.defineProperty(exports, "asyncDefaultReportMessage", { enumerable: true, get: function() {
        return RunDetailsFormatter_1.asyncDefaultReportMessage;
      } });
      var PreconditionFailure_1 = require_PreconditionFailure();
      Object.defineProperty(exports, "PreconditionFailure", { enumerable: true, get: function() {
        return PreconditionFailure_1.PreconditionFailure;
      } });
      var int8Array_1 = require_int8Array();
      Object.defineProperty(exports, "int8Array", { enumerable: true, get: function() {
        return int8Array_1.int8Array;
      } });
      var int16Array_1 = require_int16Array();
      Object.defineProperty(exports, "int16Array", { enumerable: true, get: function() {
        return int16Array_1.int16Array;
      } });
      var int32Array_1 = require_int32Array();
      Object.defineProperty(exports, "int32Array", { enumerable: true, get: function() {
        return int32Array_1.int32Array;
      } });
      var uint8Array_1 = require_uint8Array();
      Object.defineProperty(exports, "uint8Array", { enumerable: true, get: function() {
        return uint8Array_1.uint8Array;
      } });
      var uint8ClampedArray_1 = require_uint8ClampedArray();
      Object.defineProperty(exports, "uint8ClampedArray", { enumerable: true, get: function() {
        return uint8ClampedArray_1.uint8ClampedArray;
      } });
      var uint16Array_1 = require_uint16Array();
      Object.defineProperty(exports, "uint16Array", { enumerable: true, get: function() {
        return uint16Array_1.uint16Array;
      } });
      var uint32Array_1 = require_uint32Array();
      Object.defineProperty(exports, "uint32Array", { enumerable: true, get: function() {
        return uint32Array_1.uint32Array;
      } });
      var float32Array_1 = require_float32Array();
      Object.defineProperty(exports, "float32Array", { enumerable: true, get: function() {
        return float32Array_1.float32Array;
      } });
      var float64Array_1 = require_float64Array();
      Object.defineProperty(exports, "float64Array", { enumerable: true, get: function() {
        return float64Array_1.float64Array;
      } });
      var sparseArray_1 = require_sparseArray();
      Object.defineProperty(exports, "sparseArray", { enumerable: true, get: function() {
        return sparseArray_1.sparseArray;
      } });
      var Arbitrary_1 = require_Arbitrary();
      Object.defineProperty(exports, "Arbitrary", { enumerable: true, get: function() {
        return Arbitrary_1.Arbitrary;
      } });
      var Value_1 = require_Value();
      Object.defineProperty(exports, "Value", { enumerable: true, get: function() {
        return Value_1.Value;
      } });
      var DepthContext_1 = require_DepthContext();
      Object.defineProperty(exports, "createDepthIdentifier", { enumerable: true, get: function() {
        return DepthContext_1.createDepthIdentifier;
      } });
      Object.defineProperty(exports, "getDepthContextFor", { enumerable: true, get: function() {
        return DepthContext_1.getDepthContextFor;
      } });
      var bigInt64Array_1 = require_bigInt64Array();
      Object.defineProperty(exports, "bigInt64Array", { enumerable: true, get: function() {
        return bigInt64Array_1.bigInt64Array;
      } });
      var bigUint64Array_1 = require_bigUint64Array();
      Object.defineProperty(exports, "bigUint64Array", { enumerable: true, get: function() {
        return bigUint64Array_1.bigUint64Array;
      } });
      var stringMatching_1 = require_stringMatching();
      Object.defineProperty(exports, "stringMatching", { enumerable: true, get: function() {
        return stringMatching_1.stringMatching;
      } });
      var noShrink_1 = require_noShrink();
      Object.defineProperty(exports, "noShrink", { enumerable: true, get: function() {
        return noShrink_1.noShrink;
      } });
      var noBias_1 = require_noBias();
      Object.defineProperty(exports, "noBias", { enumerable: true, get: function() {
        return noBias_1.noBias;
      } });
      var limitShrink_1 = require_limitShrink();
      Object.defineProperty(exports, "limitShrink", { enumerable: true, get: function() {
        return limitShrink_1.limitShrink;
      } });
      var __type = "commonjs";
      exports.__type = __type;
      var __version = "3.22.0";
      exports.__version = __version;
      var __commitHash = "4e04fda63d913c2b5b1ed604db12341b618b56c5";
      exports.__commitHash = __commitHash;
    }
  });

  // node_modules/fast-check/lib/fast-check.js
  var require_fast_check = __commonJS({
    "node_modules/fast-check/lib/fast-check.js"(exports) {
      var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      }) : (function(o, m, k, k2) {
        if (k2 === void 0) k2 = k;
        o[k2] = m[k];
      }));
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      var fc = require_fast_check_default();
      exports.default = fc;
      __exportStar(require_fast_check_default(), exports);
    }
  });
  return require_fast_check();
})();
