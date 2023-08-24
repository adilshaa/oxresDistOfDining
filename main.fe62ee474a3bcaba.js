"use strict";
(self.webpackChunkdining_app = self.webpackChunkdining_app || []).push([
  [179],
  {
    624: (Pu, Dm, Fu) => {
      var xo = {};
      function be(e) {
        return "function" == typeof e;
      }
      function ku(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      Fu.r(xo),
        Fu.d(xo, {
          Decoder: () => Xp,
          Encoder: () => WU,
          PacketType: () => U,
          protocol: () => GU,
        });
      const Lu = ku(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, i) => `${i + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          }
      );
      function wa(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class Rt {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._finalizers = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const o of n) o.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (be(r))
              try {
                r();
              } catch (o) {
                t = o instanceof Lu ? o.errors : [o];
              }
            const { _finalizers: i } = this;
            if (i) {
              this._finalizers = null;
              for (const o of i)
                try {
                  Mm(o);
                } catch (s) {
                  (t = t ?? []),
                    s instanceof Lu ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new Lu(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) Mm(t);
            else {
              if (t instanceof Rt) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._finalizers =
                null !== (n = this._finalizers) && void 0 !== n ? n : []).push(
                t
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && wa(n, t);
        }
        remove(t) {
          const { _finalizers: n } = this;
          n && wa(n, t), t instanceof Rt && t._removeParent(this);
        }
      }
      Rt.EMPTY = (() => {
        const e = new Rt();
        return (e.closed = !0), e;
      })();
      const Em = Rt.EMPTY;
      function Sm(e) {
        return (
          e instanceof Rt ||
          (e && "closed" in e && be(e.remove) && be(e.add) && be(e.unsubscribe))
        );
      }
      function Mm(e) {
        be(e) ? e() : e.unsubscribe();
      }
      const Vr = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        Da = {
          setTimeout(e, t, ...n) {
            const { delegate: r } = Da;
            return r?.setTimeout
              ? r.setTimeout(e, t, ...n)
              : setTimeout(e, t, ...n);
          },
          clearTimeout(e) {
            const { delegate: t } = Da;
            return (t?.clearTimeout || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function Tm(e) {
        Da.setTimeout(() => {
          const { onUnhandledError: t } = Vr;
          if (!t) throw e;
          t(e);
        });
      }
      function Ea() {}
      const yA = Vu("C", void 0, void 0);
      function Vu(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let Br = null;
      function Sa(e) {
        if (Vr.useDeprecatedSynchronousErrorHandling) {
          const t = !Br;
          if ((t && (Br = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = Br;
            if (((Br = null), n)) throw r;
          }
        } else e();
      }
      class Bu extends Rt {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), Sm(t) && t.add(this))
              : (this.destination = EA);
        }
        static create(t, n, r) {
          return new Oo(t, n, r);
        }
        next(t) {
          this.isStopped
            ? Hu(
                (function _A(e) {
                  return Vu("N", e, void 0);
                })(t),
                this
              )
            : this._next(t);
        }
        error(t) {
          this.isStopped
            ? Hu(
                (function vA(e) {
                  return Vu("E", void 0, e);
                })(t),
                this
              )
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? Hu(yA, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      const bA = Function.prototype.bind;
      function ju(e, t) {
        return bA.call(e, t);
      }
      class wA {
        constructor(t) {
          this.partialObserver = t;
        }
        next(t) {
          const { partialObserver: n } = this;
          if (n.next)
            try {
              n.next(t);
            } catch (r) {
              Ma(r);
            }
        }
        error(t) {
          const { partialObserver: n } = this;
          if (n.error)
            try {
              n.error(t);
            } catch (r) {
              Ma(r);
            }
          else Ma(t);
        }
        complete() {
          const { partialObserver: t } = this;
          if (t.complete)
            try {
              t.complete();
            } catch (n) {
              Ma(n);
            }
        }
      }
      class Oo extends Bu {
        constructor(t, n, r) {
          let i;
          if ((super(), be(t) || !t))
            i = {
              next: t ?? void 0,
              error: n ?? void 0,
              complete: r ?? void 0,
            };
          else {
            let o;
            this && Vr.useDeprecatedNextContext
              ? ((o = Object.create(t)),
                (o.unsubscribe = () => this.unsubscribe()),
                (i = {
                  next: t.next && ju(t.next, o),
                  error: t.error && ju(t.error, o),
                  complete: t.complete && ju(t.complete, o),
                }))
              : (i = t);
          }
          this.destination = new wA(i);
        }
      }
      function Ma(e) {
        Vr.useDeprecatedSynchronousErrorHandling
          ? (function CA(e) {
              Vr.useDeprecatedSynchronousErrorHandling &&
                Br &&
                ((Br.errorThrown = !0), (Br.error = e));
            })(e)
          : Tm(e);
      }
      function Hu(e, t) {
        const { onStoppedNotification: n } = Vr;
        n && Da.setTimeout(() => n(e, t));
      }
      const EA = {
          closed: !0,
          next: Ea,
          error: function DA(e) {
            throw e;
          },
          complete: Ea,
        },
        Uu =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function Wn(e) {
        return e;
      }
      function Am(e) {
        return 0 === e.length
          ? Wn
          : 1 === e.length
          ? e[0]
          : function (n) {
              return e.reduce((r, i) => i(r), n);
            };
      }
      let ve = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, i) {
            const o = (function TA(e) {
              return (
                (e && e instanceof Bu) ||
                ((function MA(e) {
                  return e && be(e.next) && be(e.error) && be(e.complete);
                })(e) &&
                  Sm(e))
              );
            })(n)
              ? n
              : new Oo(n, r, i);
            return (
              Sa(() => {
                const { operator: s, source: a } = this;
                o.add(
                  s
                    ? s.call(o, a)
                    : a
                    ? this._subscribe(o)
                    : this._trySubscribe(o)
                );
              }),
              o
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = Im(r))((i, o) => {
              const s = new Oo({
                next: (a) => {
                  try {
                    n(a);
                  } catch (l) {
                    o(l), s.unsubscribe();
                  }
                },
                error: o,
                complete: i,
              });
              this.subscribe(s);
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [Uu]() {
            return this;
          }
          pipe(...n) {
            return Am(n)(this);
          }
          toPromise(n) {
            return new (n = Im(n))((r, i) => {
              let o;
              this.subscribe(
                (s) => (o = s),
                (s) => i(s),
                () => r(o)
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function Im(e) {
        var t;
        return null !== (t = e ?? Vr.Promise) && void 0 !== t ? t : Promise;
      }
      const AA = ku(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          }
      );
      let We = (() => {
        class e extends ve {
          constructor() {
            super(),
              (this.closed = !1),
              (this.currentObservers = null),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new xm(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new AA();
          }
          next(n) {
            Sa(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.currentObservers ||
                  (this.currentObservers = Array.from(this.observers));
                for (const r of this.currentObservers) r.next(n);
              }
            });
          }
          error(n) {
            Sa(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            Sa(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0),
              (this.observers = this.currentObservers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: i, observers: o } = this;
            return r || i
              ? Em
              : ((this.currentObservers = null),
                o.push(n),
                new Rt(() => {
                  (this.currentObservers = null), wa(o, n);
                }));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: i, isStopped: o } = this;
            r ? n.error(i) : o && n.complete();
          }
          asObservable() {
            const n = new ve();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new xm(t, n)), e;
      })();
      class xm extends We {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : Em;
        }
      }
      class gt extends We {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      function Om(e) {
        return be(e?.lift);
      }
      function Me(e) {
        return (t) => {
          if (Om(t))
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      function _e(e, t, n, r, i) {
        return new Nm(e, t, n, r, i);
      }
      class Nm extends Bu {
        constructor(t, n, r, i, o, s) {
          super(t),
            (this.onFinalize = o),
            (this.shouldUnsubscribe = s),
            (this._next = n
              ? function (a) {
                  try {
                    n(a);
                  } catch (l) {
                    t.error(l);
                  }
                }
              : super._next),
            (this._error = i
              ? function (a) {
                  try {
                    i(a);
                  } catch (l) {
                    t.error(l);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
            const { closed: n } = this;
            super.unsubscribe(),
              !n &&
                (null === (t = this.onFinalize) ||
                  void 0 === t ||
                  t.call(this));
          }
        }
      }
      function te(e, t) {
        return Me((n, r) => {
          let i = 0;
          n.subscribe(
            _e(r, (o) => {
              r.next(e.call(t, o, i++));
            })
          );
        });
      }
      function mr(e) {
        return this instanceof mr ? ((this.v = e), this) : new mr(e);
      }
      function km(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function Gu(e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined."
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(o) {
          n[o] =
            e[o] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function i(o, s, a, l) {
                  Promise.resolve(l).then(function (c) {
                    o({ value: c, done: a });
                  }, s);
                })(a, l, (s = e[o](s)).done, s.value);
              });
            };
        }
      }
      const Lm = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function Vm(e) {
        return be(e?.then);
      }
      function Bm(e) {
        return be(e[Uu]);
      }
      function jm(e) {
        return Symbol.asyncIterator && be(e?.[Symbol.asyncIterator]);
      }
      function Hm(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
        );
      }
      const Um = (function WA() {
        return "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      })();
      function $m(e) {
        return be(e?.[Um]);
      }
      function zm(e) {
        return (function Fm(e, t, n) {
          if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
          var i,
            r = n.apply(e, t || []),
            o = [];
          return (
            (i = {}),
            s("next"),
            s("throw"),
            s("return"),
            (i[Symbol.asyncIterator] = function () {
              return this;
            }),
            i
          );
          function s(f) {
            r[f] &&
              (i[f] = function (h) {
                return new Promise(function (p, g) {
                  o.push([f, h, p, g]) > 1 || a(f, h);
                });
              });
          }
          function a(f, h) {
            try {
              !(function l(f) {
                f.value instanceof mr
                  ? Promise.resolve(f.value.v).then(c, u)
                  : d(o[0][2], f);
              })(r[f](h));
            } catch (p) {
              d(o[0][3], p);
            }
          }
          function c(f) {
            a("next", f);
          }
          function u(f) {
            a("throw", f);
          }
          function d(f, h) {
            f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
          }
        })(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: i } = yield mr(n.read());
              if (i) return yield mr(void 0);
              yield yield mr(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function qm(e) {
        return be(e?.getReader);
      }
      function at(e) {
        if (e instanceof ve) return e;
        if (null != e) {
          if (Bm(e))
            return (function KA(e) {
              return new ve((t) => {
                const n = e[Uu]();
                if (be(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable"
                );
              });
            })(e);
          if (Lm(e))
            return (function QA(e) {
              return new ve((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (Vm(e))
            return (function ZA(e) {
              return new ve((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n)
                ).then(null, Tm);
              });
            })(e);
          if (jm(e)) return Gm(e);
          if ($m(e))
            return (function YA(e) {
              return new ve((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (qm(e))
            return (function XA(e) {
              return Gm(zm(e));
            })(e);
        }
        throw Hm(e);
      }
      function Gm(e) {
        return new ve((t) => {
          (function JA(e, t) {
            var n, r, i, o;
            return (function Rm(e, t, n, r) {
              return new (n || (n = Promise))(function (o, s) {
                function a(u) {
                  try {
                    c(r.next(u));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(u) {
                  try {
                    c(r.throw(u));
                  } catch (d) {
                    s(d);
                  }
                }
                function c(u) {
                  u.done
                    ? o(u.value)
                    : (function i(o) {
                        return o instanceof n
                          ? o
                          : new n(function (s) {
                              s(o);
                            });
                      })(u.value).then(a, l);
                }
                c((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = km(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                i = { error: s };
              } finally {
                try {
                  r && !r.done && (o = n.return) && (yield o.call(n));
                } finally {
                  if (i) throw i.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function Kn(e, t, n, r = 0, i = !1) {
        const o = t.schedule(function () {
          n(), i ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(o), !i)) return o;
      }
      function Ke(e, t, n = 1 / 0) {
        return be(t)
          ? Ke((r, i) => te((o, s) => t(r, o, i, s))(at(e(r, i))), n)
          : ("number" == typeof t && (n = t),
            Me((r, i) =>
              (function eI(e, t, n, r, i, o, s, a) {
                const l = [];
                let c = 0,
                  u = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !c && t.complete();
                  },
                  h = (g) => (c < r ? p(g) : l.push(g)),
                  p = (g) => {
                    o && t.next(g), c++;
                    let m = !1;
                    at(n(g, u++)).subscribe(
                      _e(
                        t,
                        (_) => {
                          i?.(_), o ? h(_) : t.next(_);
                        },
                        () => {
                          m = !0;
                        },
                        void 0,
                        () => {
                          if (m)
                            try {
                              for (c--; l.length && c < r; ) {
                                const _ = l.shift();
                                s ? Kn(t, s, () => p(_)) : p(_);
                              }
                              f();
                            } catch (_) {
                              t.error(_);
                            }
                        }
                      )
                    );
                  };
                return (
                  e.subscribe(
                    _e(t, h, () => {
                      (d = !0), f();
                    })
                  ),
                  () => {
                    a?.();
                  }
                );
              })(r, i, e, n)
            ));
      }
      function wi(e = 1 / 0) {
        return Ke(Wn, e);
      }
      const dn = new ve((e) => e.complete());
      function Wu(e) {
        return e[e.length - 1];
      }
      function Ku(e) {
        return be(Wu(e)) ? e.pop() : void 0;
      }
      function No(e) {
        return (function nI(e) {
          return e && be(e.schedule);
        })(Wu(e))
          ? e.pop()
          : void 0;
      }
      function Qu(e, t = 0) {
        return Me((n, r) => {
          n.subscribe(
            _e(
              r,
              (i) => Kn(r, e, () => r.next(i), t),
              () => Kn(r, e, () => r.complete(), t),
              (i) => Kn(r, e, () => r.error(i), t)
            )
          );
        });
      }
      function Wm(e, t = 0) {
        return Me((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function Km(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new ve((n) => {
          Kn(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            Kn(
              n,
              t,
              () => {
                r.next().then((i) => {
                  i.done ? n.complete() : n.next(i.value);
                });
              },
              0,
              !0
            );
          });
        });
      }
      function Qe(e, t) {
        return t
          ? (function cI(e, t) {
              if (null != e) {
                if (Bm(e))
                  return (function iI(e, t) {
                    return at(e).pipe(Wm(t), Qu(t));
                  })(e, t);
                if (Lm(e))
                  return (function sI(e, t) {
                    return new ve((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (Vm(e))
                  return (function oI(e, t) {
                    return at(e).pipe(Wm(t), Qu(t));
                  })(e, t);
                if (jm(e)) return Km(e, t);
                if ($m(e))
                  return (function aI(e, t) {
                    return new ve((n) => {
                      let r;
                      return (
                        Kn(n, t, () => {
                          (r = e[Um]()),
                            Kn(
                              n,
                              t,
                              () => {
                                let i, o;
                                try {
                                  ({ value: i, done: o } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                o ? n.complete() : n.next(i);
                              },
                              0,
                              !0
                            );
                        }),
                        () => be(r?.return) && r.return()
                      );
                    });
                  })(e, t);
                if (qm(e))
                  return (function lI(e, t) {
                    return Km(zm(e), t);
                  })(e, t);
              }
              throw Hm(e);
            })(e, t)
          : at(e);
      }
      function Zu(...e) {
        const t = No(e),
          n = (function rI(e, t) {
            return "number" == typeof Wu(e) ? e.pop() : t;
          })(e, 1 / 0),
          r = e;
        return r.length ? (1 === r.length ? at(r[0]) : wi(n)(Qe(r, t))) : dn;
      }
      function $(...e) {
        return Qe(e, No(e));
      }
      function Qm(e = {}) {
        const {
          connector: t = () => new We(),
          resetOnError: n = !0,
          resetOnComplete: r = !0,
          resetOnRefCountZero: i = !0,
        } = e;
        return (o) => {
          let s,
            a,
            l,
            c = 0,
            u = !1,
            d = !1;
          const f = () => {
              a?.unsubscribe(), (a = void 0);
            },
            h = () => {
              f(), (s = l = void 0), (u = d = !1);
            },
            p = () => {
              const g = s;
              h(), g?.unsubscribe();
            };
          return Me((g, m) => {
            c++, !d && !u && f();
            const _ = (l = l ?? t());
            m.add(() => {
              c--, 0 === c && !d && !u && (a = Yu(p, i));
            }),
              _.subscribe(m),
              !s &&
                c > 0 &&
                ((s = new Oo({
                  next: (y) => _.next(y),
                  error: (y) => {
                    (d = !0), f(), (a = Yu(h, n, y)), _.error(y);
                  },
                  complete: () => {
                    (u = !0), f(), (a = Yu(h, r)), _.complete();
                  },
                })),
                at(g).subscribe(s));
          })(o);
        };
      }
      function Yu(e, t, ...n) {
        if (!0 === t) return void e();
        if (!1 === t) return;
        const r = new Oo({
          next: () => {
            r.unsubscribe(), e();
          },
        });
        return at(t(...n)).subscribe(r);
      }
      function Zt(e, t) {
        return Me((n, r) => {
          let i = null,
            o = 0,
            s = !1;
          const a = () => s && !i && r.complete();
          n.subscribe(
            _e(
              r,
              (l) => {
                i?.unsubscribe();
                let c = 0;
                const u = o++;
                at(e(l, u)).subscribe(
                  (i = _e(
                    r,
                    (d) => r.next(t ? t(l, d, u, c++) : d),
                    () => {
                      (i = null), a();
                    }
                  ))
                );
              },
              () => {
                (s = !0), a();
              }
            )
          );
        });
      }
      function Zm(e, t = Wn) {
        return (
          (e = e ?? uI),
          Me((n, r) => {
            let i,
              o = !0;
            n.subscribe(
              _e(r, (s) => {
                const a = t(s);
                (o || !e(i, a)) && ((o = !1), (i = a), r.next(s));
              })
            );
          })
        );
      }
      function uI(e, t) {
        return e === t;
      }
      function pe(e) {
        for (let t in e) if (e[t] === pe) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function Ta(e, t) {
        for (const n in t)
          t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
      }
      function Ze(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(Ze).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function Xu(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const dI = pe({ __forward_ref__: pe });
      function we(e) {
        return (
          (e.__forward_ref__ = we),
          (e.toString = function () {
            return Ze(this());
          }),
          e
        );
      }
      function K(e) {
        return Ju(e) ? e() : e;
      }
      function Ju(e) {
        return (
          "function" == typeof e &&
          e.hasOwnProperty(dI) &&
          e.__forward_ref__ === we
        );
      }
      function ed(e) {
        return e && !!e.ɵproviders;
      }
      const Ym = "https://g.co/ng/security#xss";
      class v extends Error {
        constructor(t, n) {
          super(
            (function Aa(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function Q(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function Ia(e, t) {
        throw new v(-201, !1);
      }
      function Yt(e, t) {
        null == e &&
          (function fe(e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
            );
          })(t, e, null, "!=");
      }
      function O(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function Fe(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function xa(e) {
        return Xm(e, Oa) || Xm(e, ey);
      }
      function Xm(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function Jm(e) {
        return e && (e.hasOwnProperty(td) || e.hasOwnProperty(_I))
          ? e[td]
          : null;
      }
      const Oa = pe({ ɵprov: pe }),
        td = pe({ ɵinj: pe }),
        ey = pe({ ngInjectableDef: pe }),
        _I = pe({ ngInjectorDef: pe });
      var B = (() => (
        ((B = B || {})[(B.Default = 0)] = "Default"),
        (B[(B.Host = 1)] = "Host"),
        (B[(B.Self = 2)] = "Self"),
        (B[(B.SkipSelf = 4)] = "SkipSelf"),
        (B[(B.Optional = 8)] = "Optional"),
        B
      ))();
      let nd;
      function ty() {
        return nd;
      }
      function wt(e) {
        const t = nd;
        return (nd = e), t;
      }
      function ny(e, t, n) {
        const r = xa(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & B.Optional
          ? null
          : void 0 !== t
          ? t
          : void Ia(Ze(e));
      }
      const De = (() =>
          (typeof globalThis < "u" && globalThis) ||
          (typeof global < "u" && global) ||
          (typeof window < "u" && window) ||
          (typeof self < "u" &&
            typeof WorkerGlobalScope < "u" &&
            self instanceof WorkerGlobalScope &&
            self))(),
        Ro = {},
        rd = "__NG_DI_FLAG__",
        Na = "ngTempTokenPath",
        bI = /\n/gm,
        ry = "__source";
      let Di;
      function vr(e) {
        const t = Di;
        return (Di = e), t;
      }
      function EI(e, t = B.Default) {
        if (void 0 === Di) throw new v(-203, !1);
        return null === Di
          ? ny(e, void 0, t)
          : Di.get(e, t & B.Optional ? null : void 0, t);
      }
      function D(e, t = B.Default) {
        return (ty() || EI)(K(e), t);
      }
      function M(e, t = B.Default) {
        return D(e, Ra(t));
      }
      function Ra(e) {
        return typeof e > "u" || "number" == typeof e
          ? e
          : 0 |
              (e.optional && 8) |
              (e.host && 1) |
              (e.self && 2) |
              (e.skipSelf && 4);
      }
      function id(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = K(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length) throw new v(900, !1);
            let i,
              o = B.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                l = SI(a);
              "number" == typeof l
                ? -1 === l
                  ? (i = a.token)
                  : (o |= l)
                : (i = a);
            }
            t.push(D(i, o));
          } else t.push(D(r));
        }
        return t;
      }
      function Po(e, t) {
        return (e[rd] = t), (e.prototype[rd] = t), e;
      }
      function SI(e) {
        return e[rd];
      }
      function Qn(e) {
        return { toString: e }.toString();
      }
      var Sn = (() => (
          ((Sn = Sn || {})[(Sn.OnPush = 0)] = "OnPush"),
          (Sn[(Sn.Default = 1)] = "Default"),
          Sn
        ))(),
        Dt = (() => {
          return (
            ((e = Dt || (Dt = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            Dt
          );
          var e;
        })();
      const Mn = {},
        le = [],
        Pa = pe({ ɵcmp: pe }),
        od = pe({ ɵdir: pe }),
        sd = pe({ ɵpipe: pe }),
        oy = pe({ ɵmod: pe }),
        Zn = pe({ ɵfac: pe }),
        Fo = pe({ __NG_ELEMENT_ID__: pe }),
        sy = pe({ __NG_ENV_ID__: pe });
      function ay(e, t, n) {
        let r = e.length;
        for (;;) {
          const i = e.indexOf(t, n);
          if (-1 === i) return i;
          if (0 === i || e.charCodeAt(i - 1) <= 32) {
            const o = t.length;
            if (i + o === r || e.charCodeAt(i + o) <= 32) return i;
          }
          n = i + 1;
        }
      }
      function ad(e, t, n) {
        let r = 0;
        for (; r < n.length; ) {
          const i = n[r];
          if ("number" == typeof i) {
            if (0 !== i) break;
            r++;
            const o = n[r++],
              s = n[r++],
              a = n[r++];
            e.setAttribute(t, s, a, o);
          } else {
            const o = i,
              s = n[++r];
            cy(o) ? e.setProperty(t, o, s) : e.setAttribute(t, o, s), r++;
          }
        }
        return r;
      }
      function ly(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function cy(e) {
        return 64 === e.charCodeAt(0);
      }
      function ko(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const i = t[r];
              "number" == typeof i
                ? (n = i)
                : 0 === n ||
                  uy(e, n, i, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function uy(e, t, n, r, i) {
        let o = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; o < e.length; ) {
            const a = e[o++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = o - 1;
                break;
              }
            }
          }
        for (; o < e.length; ) {
          const a = e[o];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== i && (e[o + 1] = i));
            if (r === e[o + 1]) return void (e[o + 2] = i);
          }
          o++, null !== r && o++, null !== i && o++;
        }
        -1 !== s && (e.splice(s, 0, t), (o = s + 1)),
          e.splice(o++, 0, n),
          null !== r && e.splice(o++, 0, r),
          null !== i && e.splice(o++, 0, i);
      }
      const dy = "ng-template";
      function AI(e, t, n) {
        let r = 0,
          i = !0;
        for (; r < e.length; ) {
          let o = e[r++];
          if ("string" == typeof o && i) {
            const s = e[r++];
            if (n && "class" === o && -1 !== ay(s.toLowerCase(), t, 0))
              return !0;
          } else {
            if (1 === o) {
              for (; r < e.length && "string" == typeof (o = e[r++]); )
                if (o.toLowerCase() === t) return !0;
              return !1;
            }
            "number" == typeof o && (i = !1);
          }
        }
        return !1;
      }
      function fy(e) {
        return 4 === e.type && e.value !== dy;
      }
      function II(e, t, n) {
        return t === (4 !== e.type || n ? e.value : dy);
      }
      function xI(e, t, n) {
        let r = 4;
        const i = e.attrs || [],
          o = (function RI(e) {
            for (let t = 0; t < e.length; t++) if (ly(e[t])) return t;
            return e.length;
          })(i);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const l = t[a];
          if ("number" != typeof l) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== l && !II(e, l, n)) || ("" === l && 1 === t.length))
                ) {
                  if (fn(r)) return !1;
                  s = !0;
                }
              } else {
                const c = 8 & r ? l : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!AI(e.attrs, c, n)) {
                    if (fn(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = OI(8 & r ? "class" : l, i, fy(e), n);
                if (-1 === d) {
                  if (fn(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== c) {
                  let f;
                  f = d > o ? "" : i[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== ay(h, c, 0)) || (2 & r && c !== f)) {
                    if (fn(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !fn(r) && !fn(l)) return !1;
            if (s && fn(l)) continue;
            (s = !1), (r = l | (1 & r));
          }
        }
        return fn(r) || s;
      }
      function fn(e) {
        return 0 == (1 & e);
      }
      function OI(e, t, n, r) {
        if (null === t) return -1;
        let i = 0;
        if (r || !n) {
          let o = !1;
          for (; i < t.length; ) {
            const s = t[i];
            if (s === e) return i;
            if (3 === s || 6 === s) o = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++i];
                for (; "string" == typeof a; ) a = t[++i];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                i += 4;
                continue;
              }
            }
            i += o ? 1 : 2;
          }
          return -1;
        }
        return (function PI(e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function hy(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (xI(e, t[r], n)) return !0;
        return !1;
      }
      function py(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function kI(e) {
        let t = e[0],
          n = 1,
          r = 2,
          i = "",
          o = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              i += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (i += "." + s) : 4 & r && (i += " " + s);
          else
            "" !== i && !fn(s) && ((t += py(o, i)), (i = "")),
              (r = s),
              (o = o || !fn(r));
          n++;
        }
        return "" !== i && (t += py(o, i)), t;
      }
      function Xt(e) {
        return Qn(() => {
          const t = my(e),
            n = {
              ...t,
              decls: e.decls,
              vars: e.vars,
              template: e.template,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              onPush: e.changeDetection === Sn.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              dependencies: (t.standalone && e.dependencies) || null,
              getStandaloneInjector: null,
              signals: e.signals ?? !1,
              data: e.data || {},
              encapsulation: e.encapsulation || Dt.Emulated,
              styles: e.styles || le,
              _: null,
              schemas: e.schemas || null,
              tView: null,
              id: "",
            };
          yy(n);
          const r = e.dependencies;
          return (
            (n.directiveDefs = Fa(r, !1)),
            (n.pipeDefs = Fa(r, !0)),
            (n.id = (function zI(e) {
              let t = 0;
              const n = [
                e.selectors,
                e.ngContentSelectors,
                e.hostVars,
                e.hostAttrs,
                e.consts,
                e.vars,
                e.decls,
                e.encapsulation,
                e.standalone,
                e.signals,
                e.exportAs,
                JSON.stringify(e.inputs),
                JSON.stringify(e.outputs),
                Object.getOwnPropertyNames(e.type.prototype),
                !!e.contentQueries,
                !!e.viewQuery,
              ].join("|");
              for (const i of n) t = (Math.imul(31, t) + i.charCodeAt(0)) << 0;
              return (t += 2147483648), "c" + t;
            })(n)),
            n
          );
        });
      }
      function jI(e) {
        return ce(e) || lt(e);
      }
      function HI(e) {
        return null !== e;
      }
      function Ve(e) {
        return Qn(() => ({
          type: e.type,
          bootstrap: e.bootstrap || le,
          declarations: e.declarations || le,
          imports: e.imports || le,
          exports: e.exports || le,
          transitiveCompileScopes: null,
          schemas: e.schemas || null,
          id: e.id || null,
        }));
      }
      function gy(e, t) {
        if (null == e) return Mn;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let i = e[r],
              o = i;
            Array.isArray(i) && ((o = i[1]), (i = i[0])),
              (n[i] = r),
              t && (t[i] = o);
          }
        return n;
      }
      function W(e) {
        return Qn(() => {
          const t = my(e);
          return yy(t), t;
        });
      }
      function ce(e) {
        return e[Pa] || null;
      }
      function lt(e) {
        return e[od] || null;
      }
      function St(e) {
        return e[sd] || null;
      }
      function Ft(e, t) {
        const n = e[oy] || null;
        if (!n && !0 === t)
          throw new Error(`Type ${Ze(e)} does not have '\u0275mod' property.`);
        return n;
      }
      function my(e) {
        const t = {};
        return {
          type: e.type,
          providersResolver: null,
          factory: null,
          hostBindings: e.hostBindings || null,
          hostVars: e.hostVars || 0,
          hostAttrs: e.hostAttrs || null,
          contentQueries: e.contentQueries || null,
          declaredInputs: t,
          inputTransforms: null,
          inputConfig: e.inputs || Mn,
          exportAs: e.exportAs || null,
          standalone: !0 === e.standalone,
          signals: !0 === e.signals,
          selectors: e.selectors || le,
          viewQuery: e.viewQuery || null,
          features: e.features || null,
          setInput: null,
          findHostDirectiveDefs: null,
          hostDirectives: null,
          inputs: gy(e.inputs, t),
          outputs: gy(e.outputs),
        };
      }
      function yy(e) {
        e.features?.forEach((t) => t(e));
      }
      function Fa(e, t) {
        if (!e) return null;
        const n = t ? St : jI;
        return () =>
          ("function" == typeof e ? e() : e).map((r) => n(r)).filter(HI);
      }
      const Ye = 0,
        R = 1,
        Z = 2,
        Ie = 3,
        hn = 4,
        Lo = 5,
        ct = 6,
        Si = 7,
        Be = 8,
        Mi = 9,
        jr = 10,
        Y = 11,
        Vo = 12,
        vy = 13,
        Ti = 14,
        je = 15,
        Bo = 16,
        Ai = 17,
        Tn = 18,
        jo = 19,
        _y = 20,
        _r = 21,
        Yn = 22,
        ka = 23,
        La = 24,
        ie = 25,
        ld = 1,
        Cy = 2,
        An = 7,
        Ii = 9,
        ut = 11;
      function kt(e) {
        return Array.isArray(e) && "object" == typeof e[ld];
      }
      function Mt(e) {
        return Array.isArray(e) && !0 === e[ld];
      }
      function cd(e) {
        return 0 != (4 & e.flags);
      }
      function Hr(e) {
        return e.componentOffset > -1;
      }
      function Ba(e) {
        return 1 == (1 & e.flags);
      }
      function pn(e) {
        return !!e.template;
      }
      function ud(e) {
        return 0 != (512 & e[Z]);
      }
      function Ur(e, t) {
        return e.hasOwnProperty(Zn) ? e[Zn] : null;
      }
      const Dy = Symbol("SIGNAL");
      function dd(e, t, n = {}) {
        return (t[Dy] = e), Object.assign(t, n);
      }
      function Ey(e, t) {
        return (null === e || "object" != typeof e) && Object.is(e, t);
      }
      let ZI =
          De.WeakRef ??
          class QI {
            constructor(t) {
              this.ref = t;
            }
            deref() {
              return this.ref;
            }
          },
        XI = 0,
        In = null,
        ja = !1;
      function nt(e) {
        const t = In;
        return (In = e), t;
      }
      class Ha {
        constructor() {
          (this.id = XI++),
            (this.ref = (function YI(e) {
              return new ZI(e);
            })(this)),
            (this.producers = new Map()),
            (this.consumers = new Map()),
            (this.trackingVersion = 0),
            (this.valueVersion = 0);
        }
        consumerPollProducersForChange() {
          for (const [t, n] of this.producers) {
            const r = n.producerNode.deref();
            if (void 0 !== r && n.atTrackingVersion === this.trackingVersion) {
              if (r.producerPollStatus(n.seenValueVersion)) return !0;
            } else this.producers.delete(t), r?.consumers.delete(this.id);
          }
          return !1;
        }
        producerMayHaveChanged() {
          const t = ja;
          ja = !0;
          try {
            for (const [n, r] of this.consumers) {
              const i = r.consumerNode.deref();
              void 0 !== i && i.trackingVersion === r.atTrackingVersion
                ? i.onConsumerDependencyMayHaveChanged()
                : (this.consumers.delete(n), i?.producers.delete(this.id));
            }
          } finally {
            ja = t;
          }
        }
        producerAccessed() {
          if (ja) throw new Error("");
          if (null === In) return;
          let t = In.producers.get(this.id);
          void 0 === t
            ? ((t = {
                consumerNode: In.ref,
                producerNode: this.ref,
                seenValueVersion: this.valueVersion,
                atTrackingVersion: In.trackingVersion,
              }),
              In.producers.set(this.id, t),
              this.consumers.set(In.id, t))
            : ((t.seenValueVersion = this.valueVersion),
              (t.atTrackingVersion = In.trackingVersion));
        }
        get hasProducers() {
          return this.producers.size > 0;
        }
        get producerUpdatesAllowed() {
          return !1 !== In?.consumerAllowSignalWrites;
        }
        producerPollStatus(t) {
          return (
            this.valueVersion !== t ||
            (this.onProducerUpdateValueVersion(), this.valueVersion !== t)
          );
        }
      }
      function Sy(e, t) {
        const n = new JI(e, t?.equal ?? Ey);
        return dd(n, n.signal.bind(n));
      }
      const fd = Symbol("UNSET"),
        hd = Symbol("COMPUTING"),
        Ua = Symbol("ERRORED");
      class JI extends Ha {
        constructor(t, n) {
          super(),
            (this.computation = t),
            (this.equal = n),
            (this.value = fd),
            (this.error = null),
            (this.stale = !0),
            (this.consumerAllowSignalWrites = !1);
        }
        onConsumerDependencyMayHaveChanged() {
          this.stale || ((this.stale = !0), this.producerMayHaveChanged());
        }
        onProducerUpdateValueVersion() {
          if (this.stale) {
            if (
              this.value !== fd &&
              this.value !== hd &&
              !this.consumerPollProducersForChange()
            )
              return void (this.stale = !1);
            this.recomputeValue();
          }
        }
        recomputeValue() {
          if (this.value === hd)
            throw new Error("Detected cycle in computations.");
          const t = this.value;
          (this.value = hd), this.trackingVersion++;
          const n = nt(this);
          let r;
          try {
            r = this.computation();
          } catch (i) {
            (r = Ua), (this.error = i);
          } finally {
            nt(n);
          }
          (this.stale = !1),
            t !== fd && t !== Ua && r !== Ua && this.equal(t, r)
              ? (this.value = t)
              : ((this.value = r), this.valueVersion++);
        }
        signal() {
          if (
            (this.onProducerUpdateValueVersion(),
            this.producerAccessed(),
            this.value === Ua)
          )
            throw this.error;
          return this.value;
        }
      }
      let My = function ex() {
        throw new Error();
      };
      function pd() {
        My();
      }
      class nx extends Ha {
        constructor(t, n) {
          super(),
            (this.value = t),
            (this.equal = n),
            (this.consumerAllowSignalWrites = !1);
        }
        onConsumerDependencyMayHaveChanged() {}
        onProducerUpdateValueVersion() {}
        set(t) {
          this.producerUpdatesAllowed || pd(),
            this.equal(this.value, t) ||
              ((this.value = t),
              this.valueVersion++,
              this.producerMayHaveChanged());
        }
        update(t) {
          this.producerUpdatesAllowed || pd(), this.set(t(this.value));
        }
        mutate(t) {
          this.producerUpdatesAllowed || pd(),
            t(this.value),
            this.valueVersion++,
            this.producerMayHaveChanged();
        }
        asReadonly() {
          return (
            void 0 === this.readonlySignal &&
              (this.readonlySignal = dd(this, () => this.signal())),
            this.readonlySignal
          );
        }
        signal() {
          return this.producerAccessed(), this.value;
        }
      }
      const Iy = () => {};
      class rx extends Ha {
        constructor(t, n, r) {
          super(),
            (this.watch = t),
            (this.schedule = n),
            (this.dirty = !1),
            (this.cleanupFn = Iy),
            (this.registerOnCleanup = (i) => {
              this.cleanupFn = i;
            }),
            (this.consumerAllowSignalWrites = r);
        }
        notify() {
          this.dirty || this.schedule(this), (this.dirty = !0);
        }
        onConsumerDependencyMayHaveChanged() {
          this.notify();
        }
        onProducerUpdateValueVersion() {}
        run() {
          if (
            ((this.dirty = !1),
            0 !== this.trackingVersion &&
              !this.consumerPollProducersForChange())
          )
            return;
          const t = nt(this);
          this.trackingVersion++;
          try {
            this.cleanupFn(),
              (this.cleanupFn = Iy),
              this.watch(this.registerOnCleanup);
          } finally {
            nt(t);
          }
        }
        cleanup() {
          this.cleanupFn();
        }
      }
      class ix {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Jt() {
        return xy;
      }
      function xy(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = sx), ox;
      }
      function ox() {
        const e = Ny(this),
          t = e?.current;
        if (t) {
          const n = e.previous;
          if (n === Mn) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function sx(e, t, n, r) {
        const i = this.declaredInputs[n],
          o =
            Ny(e) ||
            (function ax(e, t) {
              return (e[Oy] = t);
            })(e, { previous: Mn, current: null }),
          s = o.current || (o.current = {}),
          a = o.previous,
          l = a[i];
        (s[i] = new ix(l && l.currentValue, t, a === Mn)), (e[r] = t);
      }
      Jt.ngInherit = !0;
      const Oy = "__ngSimpleChanges__";
      function Ny(e) {
        return e[Oy] || null;
      }
      const xn = function (e, t, n) {};
      function Se(e) {
        for (; Array.isArray(e); ) e = e[Ye];
        return e;
      }
      function za(e, t) {
        return Se(t[e]);
      }
      function Tt(e, t) {
        return Se(t[e.index]);
      }
      function Fy(e, t) {
        return e.data[t];
      }
      function Lt(e, t) {
        const n = t[e];
        return kt(n) ? n : n[Ye];
      }
      function Cr(e, t) {
        return null == t ? null : e[t];
      }
      function ky(e) {
        e[Ai] = 0;
      }
      function px(e) {
        1024 & e[Z] || ((e[Z] |= 1024), Vy(e, 1));
      }
      function Ly(e) {
        1024 & e[Z] && ((e[Z] &= -1025), Vy(e, -1));
      }
      function Vy(e, t) {
        let n = e[Ie];
        if (null === n) return;
        n[Lo] += t;
        let r = n;
        for (
          n = n[Ie];
          null !== n && ((1 === t && 1 === r[Lo]) || (-1 === t && 0 === r[Lo]));

        )
          (n[Lo] += t), (r = n), (n = n[Ie]);
      }
      function By(e, t) {
        if (256 == (256 & e[Z])) throw new v(911, !1);
        null === e[_r] && (e[_r] = []), e[_r].push(t);
      }
      const G = {
        lFrame: Qy(null),
        bindingsEnabled: !0,
        skipHydrationRootTNode: null,
      };
      function Hy() {
        return G.bindingsEnabled;
      }
      function E() {
        return G.lFrame.lView;
      }
      function oe() {
        return G.lFrame.tView;
      }
      function Vt(e) {
        return (G.lFrame.contextLView = e), e[Be];
      }
      function Bt(e) {
        return (G.lFrame.contextLView = null), e;
      }
      function ot() {
        let e = Uy();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function Uy() {
        return G.lFrame.currentTNode;
      }
      function On(e, t) {
        const n = G.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function md() {
        return G.lFrame.isParent;
      }
      function yd() {
        G.lFrame.isParent = !1;
      }
      function Ni() {
        return G.lFrame.bindingIndex++;
      }
      function Jn(e) {
        const t = G.lFrame,
          n = t.bindingIndex;
        return (t.bindingIndex = t.bindingIndex + e), n;
      }
      function Mx(e, t) {
        const n = G.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), vd(t);
      }
      function vd(e) {
        G.lFrame.currentDirectiveIndex = e;
      }
      function _d(e) {
        const t = G.lFrame.currentDirectiveIndex;
        return -1 === t ? null : e[t];
      }
      function Gy() {
        return G.lFrame.currentQueryIndex;
      }
      function Cd(e) {
        G.lFrame.currentQueryIndex = e;
      }
      function Ax(e) {
        const t = e[R];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[ct] : null;
      }
      function Wy(e, t, n) {
        if (n & B.SkipSelf) {
          let i = t,
            o = e;
          for (
            ;
            !((i = i.parent),
            null !== i ||
              n & B.Host ||
              ((i = Ax(o)), null === i || ((o = o[Ti]), 10 & i.type)));

          );
          if (null === i) return !1;
          (t = i), (e = o);
        }
        const r = (G.lFrame = Ky());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function bd(e) {
        const t = Ky(),
          n = e[R];
        (G.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function Ky() {
        const e = G.lFrame,
          t = null === e ? null : e.child;
        return null === t ? Qy(e) : t;
      }
      function Qy(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function Zy() {
        const e = G.lFrame;
        return (
          (G.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const Yy = Zy;
      function wd() {
        const e = Zy();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function yt() {
        return G.lFrame.selectedIndex;
      }
      function $r(e) {
        G.lFrame.selectedIndex = e;
      }
      function xe() {
        const e = G.lFrame;
        return Fy(e.tView, e.selectedIndex);
      }
      let Jy = !0;
      function qa() {
        return Jy;
      }
      function br(e) {
        Jy = e;
      }
      function Ga(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const o = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: c,
              ngOnDestroy: u,
            } = o;
          s && (e.contentHooks ??= []).push(-n, s),
            a &&
              ((e.contentHooks ??= []).push(n, a),
              (e.contentCheckHooks ??= []).push(n, a)),
            l && (e.viewHooks ??= []).push(-n, l),
            c &&
              ((e.viewHooks ??= []).push(n, c),
              (e.viewCheckHooks ??= []).push(n, c)),
            null != u && (e.destroyHooks ??= []).push(n, u);
        }
      }
      function Wa(e, t, n) {
        ev(e, t, 3, n);
      }
      function Ka(e, t, n, r) {
        (3 & e[Z]) === n && ev(e, t, n, r);
      }
      function Dd(e, t) {
        let n = e[Z];
        (3 & n) === t && ((n &= 8191), (n += 1), (e[Z] = n));
      }
      function ev(e, t, n, r) {
        const o = r ?? -1,
          s = t.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & e[Ai] : 0; l < s; l++)
          if ("number" == typeof t[l + 1]) {
            if (((a = t[l]), null != r && a >= r)) break;
          } else
            t[l] < 0 && (e[Ai] += 65536),
              (a < o || -1 == o) &&
                (kx(e, n, t, l), (e[Ai] = (4294901760 & e[Ai]) + l + 2)),
              l++;
      }
      function tv(e, t) {
        xn(4, e, t);
        const n = nt(null);
        try {
          t.call(e);
        } finally {
          nt(n), xn(5, e, t);
        }
      }
      function kx(e, t, n, r) {
        const i = n[r] < 0,
          o = n[r + 1],
          a = e[i ? -n[r] : n[r]];
        i
          ? e[Z] >> 13 < e[Ai] >> 16 &&
            (3 & e[Z]) === t &&
            ((e[Z] += 8192), tv(a, o))
          : tv(a, o);
      }
      const Ri = -1;
      class $o {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function nv(e) {
        return e !== Ri;
      }
      function Qa(e) {
        return 32767 & e;
      }
      function Za(e, t) {
        let n = (function jx(e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[Ti]), n--;
        return r;
      }
      let Sd = !0;
      function Ya(e) {
        const t = Sd;
        return (Sd = e), t;
      }
      const rv = 255,
        iv = 5;
      let Hx = 0;
      const Nn = {};
      function Xa(e, t) {
        const n = ov(e, t);
        if (-1 !== n) return n;
        const r = t[R];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          Md(r.data, e),
          Md(t, null),
          Md(r.blueprint, null));
        const i = Td(e, t),
          o = e.injectorIndex;
        if (nv(i)) {
          const s = Qa(i),
            a = Za(i, t),
            l = a[R].data;
          for (let c = 0; c < 8; c++) t[o + c] = a[s + c] | l[s + c];
        }
        return (t[o + 8] = i), o;
      }
      function Md(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function ov(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function Td(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          i = t;
        for (; null !== i; ) {
          if (((r = fv(i)), null === r)) return Ri;
          if ((n++, (i = i[Ti]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return Ri;
      }
      function Ad(e, t, n) {
        !(function Ux(e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(Fo) && (r = n[Fo]),
            null == r && (r = n[Fo] = Hx++);
          const i = r & rv;
          t.data[e + (i >> iv)] |= 1 << i;
        })(e, t, n);
      }
      function sv(e, t, n) {
        if (n & B.Optional || void 0 !== e) return e;
        Ia();
      }
      function av(e, t, n, r) {
        if (
          (n & B.Optional && void 0 === r && (r = null),
          !(n & (B.Self | B.Host)))
        ) {
          const i = e[Mi],
            o = wt(void 0);
          try {
            return i ? i.get(t, r, n & B.Optional) : ny(t, r, n & B.Optional);
          } finally {
            wt(o);
          }
        }
        return sv(r, 0, n);
      }
      function lv(e, t, n, r = B.Default, i) {
        if (null !== e) {
          if (2048 & t[Z] && !(r & B.Self)) {
            const s = (function Wx(e, t, n, r, i) {
              let o = e,
                s = t;
              for (
                ;
                null !== o && null !== s && 2048 & s[Z] && !(512 & s[Z]);

              ) {
                const a = cv(o, s, n, r | B.Self, Nn);
                if (a !== Nn) return a;
                let l = o.parent;
                if (!l) {
                  const c = s[_y];
                  if (c) {
                    const u = c.get(n, Nn, r);
                    if (u !== Nn) return u;
                  }
                  (l = fv(s)), (s = s[Ti]);
                }
                o = l;
              }
              return i;
            })(e, t, n, r, Nn);
            if (s !== Nn) return s;
          }
          const o = cv(e, t, n, r, Nn);
          if (o !== Nn) return o;
        }
        return av(t, n, r, i);
      }
      function cv(e, t, n, r, i) {
        const o = (function qx(e) {
          if ("string" == typeof e) return e.charCodeAt(0) || 0;
          const t = e.hasOwnProperty(Fo) ? e[Fo] : void 0;
          return "number" == typeof t ? (t >= 0 ? t & rv : Gx) : t;
        })(n);
        if ("function" == typeof o) {
          if (!Wy(t, e, r)) return r & B.Host ? sv(i, 0, r) : av(t, n, r, i);
          try {
            const s = o(r);
            if (null != s || r & B.Optional) return s;
            Ia();
          } finally {
            Yy();
          }
        } else if ("number" == typeof o) {
          let s = null,
            a = ov(e, t),
            l = Ri,
            c = r & B.Host ? t[je][ct] : null;
          for (
            (-1 === a || r & B.SkipSelf) &&
            ((l = -1 === a ? Td(e, t) : t[a + 8]),
            l !== Ri && dv(r, !1)
              ? ((s = t[R]), (a = Qa(l)), (t = Za(l, t)))
              : (a = -1));
            -1 !== a;

          ) {
            const u = t[R];
            if (uv(o, a, u.data)) {
              const d = zx(a, t, n, s, r, c);
              if (d !== Nn) return d;
            }
            (l = t[a + 8]),
              l !== Ri && dv(r, t[R].data[a + 8] === c) && uv(o, a, t)
                ? ((s = u), (a = Qa(l)), (t = Za(l, t)))
                : (a = -1);
          }
        }
        return i;
      }
      function zx(e, t, n, r, i, o) {
        const s = t[R],
          a = s.data[e + 8],
          u = Ja(
            a,
            s,
            n,
            null == r ? Hr(a) && Sd : r != s && 0 != (3 & a.type),
            i & B.Host && o === a
          );
        return null !== u ? zr(t, s, u, a) : Nn;
      }
      function Ja(e, t, n, r, i) {
        const o = e.providerIndexes,
          s = t.data,
          a = 1048575 & o,
          l = e.directiveStart,
          u = o >> 20,
          f = i ? a + u : e.directiveEnd;
        for (let h = r ? a : a + u; h < f; h++) {
          const p = s[h];
          if ((h < l && n === p) || (h >= l && p.type === n)) return h;
        }
        if (i) {
          const h = s[l];
          if (h && pn(h) && h.type === n) return l;
        }
        return null;
      }
      function zr(e, t, n, r) {
        let i = e[n];
        const o = t.data;
        if (
          (function Lx(e) {
            return e instanceof $o;
          })(i)
        ) {
          const s = i;
          s.resolving &&
            (function fI(e, t) {
              const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
              throw new v(
                -200,
                `Circular dependency in DI detected for ${e}${n}`
              );
            })(
              (function de(e) {
                return "function" == typeof e
                  ? e.name || e.toString()
                  : "object" == typeof e &&
                    null != e &&
                    "function" == typeof e.type
                  ? e.type.name || e.type.toString()
                  : Q(e);
              })(o[n])
            );
          const a = Ya(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? wt(s.injectImpl) : null;
          Wy(e, r, B.Default);
          try {
            (i = e[n] = s.factory(void 0, o, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function Fx(e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: i,
                    ngDoCheck: o,
                  } = t.type.prototype;
                  if (r) {
                    const s = xy(t);
                    (n.preOrderHooks ??= []).push(e, s),
                      (n.preOrderCheckHooks ??= []).push(e, s);
                  }
                  i && (n.preOrderHooks ??= []).push(0 - e, i),
                    o &&
                      ((n.preOrderHooks ??= []).push(e, o),
                      (n.preOrderCheckHooks ??= []).push(e, o));
                })(n, o[n], t);
          } finally {
            null !== l && wt(l), Ya(a), (s.resolving = !1), Yy();
          }
        }
        return i;
      }
      function uv(e, t, n) {
        return !!(n[t + (e >> iv)] & (1 << e));
      }
      function dv(e, t) {
        return !(e & B.Self || (e & B.Host && t));
      }
      class Pi {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return lv(this._tNode, this._lView, t, Ra(r), n);
        }
      }
      function Gx() {
        return new Pi(ot(), E());
      }
      function rt(e) {
        return Qn(() => {
          const t = e.prototype.constructor,
            n = t[Zn] || Id(t),
            r = Object.prototype;
          let i = Object.getPrototypeOf(e.prototype).constructor;
          for (; i && i !== r; ) {
            const o = i[Zn] || Id(i);
            if (o && o !== n) return o;
            i = Object.getPrototypeOf(i);
          }
          return (o) => new o();
        });
      }
      function Id(e) {
        return Ju(e)
          ? () => {
              const t = Id(K(e));
              return t && t();
            }
          : Ur(e);
      }
      function fv(e) {
        const t = e[R],
          n = t.type;
        return 2 === n ? t.declTNode : 1 === n ? e[ct] : null;
      }
      const ki = "__parameters__";
      function Vi(e, t, n) {
        return Qn(() => {
          const r = (function xd(e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const i in r) this[i] = r[i];
              }
            };
          })(t);
          function i(...o) {
            if (this instanceof i) return r.apply(this, o), this;
            const s = new i(...o);
            return (a.annotation = s), a;
            function a(l, c, u) {
              const d = l.hasOwnProperty(ki)
                ? l[ki]
                : Object.defineProperty(l, ki, { value: [] })[ki];
              for (; d.length <= u; ) d.push(null);
              return (d[u] = d[u] || []).push(s), l;
            }
          }
          return (
            n && (i.prototype = Object.create(n.prototype)),
            (i.prototype.ngMetadataName = e),
            (i.annotationCls = i),
            i
          );
        });
      }
      function Go(e, t) {
        e.forEach((n) => (Array.isArray(n) ? Go(n, t) : t(n)));
      }
      function pv(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function tl(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      function jt(e, t, n) {
        let r = Bi(e, t);
        return (
          r >= 0
            ? (e[1 | r] = n)
            : ((r = ~r),
              (function Xx(e, t, n, r) {
                let i = e.length;
                if (i == t) e.push(n, r);
                else if (1 === i) e.push(r, e[0]), (e[0] = n);
                else {
                  for (i--, e.push(e[i - 1], e[i]); i > t; )
                    (e[i] = e[i - 2]), i--;
                  (e[t] = n), (e[t + 1] = r);
                }
              })(e, r, t, n)),
          r
        );
      }
      function Od(e, t) {
        const n = Bi(e, t);
        if (n >= 0) return e[1 | n];
      }
      function Bi(e, t) {
        return (function gv(e, t, n) {
          let r = 0,
            i = e.length >> n;
          for (; i !== r; ) {
            const o = r + ((i - r) >> 1),
              s = e[o << n];
            if (t === s) return o << n;
            s > t ? (i = o) : (r = o + 1);
          }
          return ~(i << n);
        })(e, t, 1);
      }
      const Rd = Po(
          Vi("Inject", (e) => ({ token: e })),
          -1
        ),
        rl = Po(Vi("Optional"), 8),
        il = Po(Vi("SkipSelf"), 4);
      function ll(e) {
        return 128 == (128 & e.flags);
      }
      var At = (() => (
        ((At = At || {})[(At.Important = 1)] = "Important"),
        (At[(At.DashCase = 2)] = "DashCase"),
        At
      ))();
      const vO = /^>|^->|<!--|-->|--!>|<!-$/g,
        _O = /(<|>)/,
        CO = "\u200b$1\u200b";
      const Vd = new Map();
      let bO = 0;
      const jd = "__ngContext__";
      function dt(e, t) {
        kt(t)
          ? ((e[jd] = t[jo]),
            (function DO(e) {
              Vd.set(e[jo], e);
            })(t))
          : (e[jd] = t);
      }
      let Hd;
      function Ud(e, t) {
        return Hd(e, t);
      }
      function Zo(e) {
        const t = e[Ie];
        return Mt(t) ? t[Ie] : t;
      }
      function Fv(e) {
        return Lv(e[Vo]);
      }
      function kv(e) {
        return Lv(e[hn]);
      }
      function Lv(e) {
        for (; null !== e && !Mt(e); ) e = e[hn];
        return e;
      }
      function Ui(e, t, n, r, i) {
        if (null != r) {
          let o,
            s = !1;
          Mt(r) ? (o = r) : kt(r) && ((s = !0), (r = r[Ye]));
          const a = Se(r);
          0 === e && null !== n
            ? null == i
              ? Uv(t, n, a)
              : qr(t, n, a, i || null, !0)
            : 1 === e && null !== n
            ? qr(t, n, a, i || null, !0)
            : 2 === e
            ? (function pl(e, t, n) {
                const r = fl(e, t);
                r &&
                  (function UO(e, t, n, r) {
                    e.removeChild(t, n, r);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != o &&
              (function qO(e, t, n, r, i) {
                const o = n[An];
                o !== Se(n) && Ui(t, e, r, o, i);
                for (let a = ut; a < n.length; a++) {
                  const l = n[a];
                  Xo(l[R], l, e, t, r, o);
                }
              })(t, e, o, n, i);
        }
      }
      function $d(e, t) {
        return e.createComment(
          (function Tv(e) {
            return e.replace(vO, (t) => t.replace(_O, CO));
          })(t)
        );
      }
      function dl(e, t, n) {
        return e.createElement(t, n);
      }
      function Bv(e, t) {
        const n = e[Ii],
          r = n.indexOf(t);
        Ly(t), n.splice(r, 1);
      }
      function zd(e, t) {
        if (e.length <= ut) return;
        const n = ut + t,
          r = e[n];
        if (r) {
          const i = r[Bo];
          null !== i && i !== e && Bv(i, r), t > 0 && (e[n - 1][hn] = r[hn]);
          const o = tl(e, ut + t);
          !(function PO(e, t) {
            Xo(e, t, t[Y], 2, null, null), (t[Ye] = null), (t[ct] = null);
          })(r[R], r);
          const s = o[Tn];
          null !== s && s.detachView(o[R]),
            (r[Ie] = null),
            (r[hn] = null),
            (r[Z] &= -129);
        }
        return r;
      }
      function jv(e, t) {
        if (!(256 & t[Z])) {
          const n = t[Y];
          t[ka]?.destroy(),
            t[La]?.destroy(),
            n.destroyNode && Xo(e, t, n, 3, null, null),
            (function LO(e) {
              let t = e[Vo];
              if (!t) return qd(e[R], e);
              for (; t; ) {
                let n = null;
                if (kt(t)) n = t[Vo];
                else {
                  const r = t[ut];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[hn] && t !== e; )
                    kt(t) && qd(t[R], t), (t = t[Ie]);
                  null === t && (t = e), kt(t) && qd(t[R], t), (n = t && t[hn]);
                }
                t = n;
              }
            })(t);
        }
      }
      function qd(e, t) {
        if (!(256 & t[Z])) {
          (t[Z] &= -129),
            (t[Z] |= 256),
            (function HO(e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const i = t[n[r]];
                  if (!(i instanceof $o)) {
                    const o = n[r + 1];
                    if (Array.isArray(o))
                      for (let s = 0; s < o.length; s += 2) {
                        const a = i[o[s]],
                          l = o[s + 1];
                        xn(4, a, l);
                        try {
                          l.call(a);
                        } finally {
                          xn(5, a, l);
                        }
                      }
                    else {
                      xn(4, i, o);
                      try {
                        o.call(i);
                      } finally {
                        xn(5, i, o);
                      }
                    }
                  }
                }
            })(e, t),
            (function jO(e, t) {
              const n = e.cleanup,
                r = t[Si];
              if (null !== n)
                for (let o = 0; o < n.length - 1; o += 2)
                  if ("string" == typeof n[o]) {
                    const s = n[o + 3];
                    s >= 0 ? r[s]() : r[-s].unsubscribe(), (o += 2);
                  } else n[o].call(r[n[o + 1]]);
              null !== r && (t[Si] = null);
              const i = t[_r];
              if (null !== i) {
                t[_r] = null;
                for (let o = 0; o < i.length; o++) (0, i[o])();
              }
            })(e, t),
            1 === t[R].type && t[Y].destroy();
          const n = t[Bo];
          if (null !== n && Mt(t[Ie])) {
            n !== t[Ie] && Bv(n, t);
            const r = t[Tn];
            null !== r && r.detachView(e);
          }
          !(function EO(e) {
            Vd.delete(e[jo]);
          })(t);
        }
      }
      function Gd(e, t, n) {
        return (function Hv(e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[Ye];
          {
            const { componentOffset: i } = r;
            if (i > -1) {
              const { encapsulation: o } = e.data[r.directiveStart + i];
              if (o === Dt.None || o === Dt.Emulated) return null;
            }
            return Tt(r, n);
          }
        })(e, t.parent, n);
      }
      function qr(e, t, n, r, i) {
        e.insertBefore(t, n, r, i);
      }
      function Uv(e, t, n) {
        e.appendChild(t, n);
      }
      function $v(e, t, n, r, i) {
        null !== r ? qr(e, t, n, r, i) : Uv(e, t, n);
      }
      function fl(e, t) {
        return e.parentNode(t);
      }
      let Wd,
        gl,
        Yd,
        ml,
        Gv = function qv(e, t, n) {
          return 40 & e.type ? Tt(e, n) : null;
        };
      function hl(e, t, n, r) {
        const i = Gd(e, r, t),
          o = t[Y],
          a = (function zv(e, t, n) {
            return Gv(e, t, n);
          })(r.parent || t[ct], r, t);
        if (null != i)
          if (Array.isArray(n))
            for (let l = 0; l < n.length; l++) $v(o, i, n[l], a, !1);
          else $v(o, i, n, a, !1);
        void 0 !== Wd && Wd(o, r, t, n, i);
      }
      function Yo(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return Tt(t, e);
          if (4 & n) return Kd(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return Yo(e, r);
            {
              const i = e[t.index];
              return Mt(i) ? Kd(-1, i) : Se(i);
            }
          }
          if (32 & n) return Ud(t, e)() || Se(e[t.index]);
          {
            const r = Kv(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : Yo(Zo(e[je]), r)
              : Yo(e, t.next);
          }
        }
        return null;
      }
      function Kv(e, t) {
        return null !== t ? e[je][ct].projection[t.projection] : null;
      }
      function Kd(e, t) {
        const n = ut + e + 1;
        if (n < t.length) {
          const r = t[n],
            i = r[R].firstChild;
          if (null !== i) return Yo(r, i);
        }
        return t[An];
      }
      function Qd(e, t, n, r, i, o, s) {
        for (; null != n; ) {
          const a = r[n.index],
            l = n.type;
          if (
            (s && 0 === t && (a && dt(Se(a), r), (n.flags |= 2)),
            32 != (32 & n.flags))
          )
            if (8 & l) Qd(e, t, n.child, r, i, o, !1), Ui(t, e, i, a, o);
            else if (32 & l) {
              const c = Ud(n, r);
              let u;
              for (; (u = c()); ) Ui(t, e, i, u, o);
              Ui(t, e, i, a, o);
            } else 16 & l ? Zv(e, t, r, n, i, o) : Ui(t, e, i, a, o);
          n = s ? n.projectionNext : n.next;
        }
      }
      function Xo(e, t, n, r, i, o) {
        Qd(n, r, e.firstChild, t, i, o, !1);
      }
      function Zv(e, t, n, r, i, o) {
        const s = n[je],
          l = s[ct].projection[r.projection];
        if (Array.isArray(l))
          for (let c = 0; c < l.length; c++) Ui(t, e, i, l[c], o);
        else {
          let c = l;
          const u = s[Ie];
          ll(r) && (c.flags |= 128), Qd(e, t, c, u, i, o, !0);
        }
      }
      function Yv(e, t, n) {
        "" === n
          ? e.removeAttribute(t, "class")
          : e.setAttribute(t, "class", n);
      }
      function Xv(e, t, n) {
        const { mergedAttrs: r, classes: i, styles: o } = n;
        null !== r && ad(e, t, r),
          null !== i && Yv(e, t, i),
          null !== o &&
            (function WO(e, t, n) {
              e.setAttribute(t, "style", n);
            })(e, t, o);
      }
      function $i(e) {
        return (
          (function Zd() {
            if (void 0 === gl && ((gl = null), De.trustedTypes))
              try {
                gl = De.trustedTypes.createPolicy("angular", {
                  createHTML: (e) => e,
                  createScript: (e) => e,
                  createScriptURL: (e) => e,
                });
              } catch {}
            return gl;
          })()?.createHTML(e) || e
        );
      }
      function Jo() {
        if (void 0 !== Yd) return Yd;
        if (typeof document < "u") return document;
        throw new v(210, !1);
      }
      function Xd() {
        if (void 0 === ml && ((ml = null), De.trustedTypes))
          try {
            ml = De.trustedTypes.createPolicy("angular#unsafe-bypass", {
              createHTML: (e) => e,
              createScript: (e) => e,
              createScriptURL: (e) => e,
            });
          } catch {}
        return ml;
      }
      function Jv(e) {
        return Xd()?.createHTML(e) || e;
      }
      function t_(e) {
        return Xd()?.createScriptURL(e) || e;
      }
      class Gr {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Ym})`;
        }
      }
      class XO extends Gr {
        getTypeName() {
          return "HTML";
        }
      }
      class JO extends Gr {
        getTypeName() {
          return "Style";
        }
      }
      class e1 extends Gr {
        getTypeName() {
          return "Script";
        }
      }
      class t1 extends Gr {
        getTypeName() {
          return "URL";
        }
      }
      class n1 extends Gr {
        getTypeName() {
          return "ResourceURL";
        }
      }
      function Ht(e) {
        return e instanceof Gr ? e.changingThisBreaksApplicationSecurity : e;
      }
      function Rn(e, t) {
        const n = (function r1(e) {
          return (e instanceof Gr && e.getTypeName()) || null;
        })(e);
        if (null != n && n !== t) {
          if ("ResourceURL" === n && "URL" === t) return !0;
          throw new Error(`Required a safe ${t}, got a ${n} (see ${Ym})`);
        }
        return n === t;
      }
      class c1 {
        constructor(t) {
          this.inertDocumentHelper = t;
        }
        getInertBodyElement(t) {
          t = "<body><remove></remove>" + t;
          try {
            const n = new window.DOMParser().parseFromString(
              $i(t),
              "text/html"
            ).body;
            return null === n
              ? this.inertDocumentHelper.getInertBodyElement(t)
              : (n.removeChild(n.firstChild), n);
          } catch {
            return null;
          }
        }
      }
      class u1 {
        constructor(t) {
          (this.defaultDoc = t),
            (this.inertDocument =
              this.defaultDoc.implementation.createHTMLDocument(
                "sanitization-inert"
              ));
        }
        getInertBodyElement(t) {
          const n = this.inertDocument.createElement("template");
          return (n.innerHTML = $i(t)), n;
        }
      }
      const f1 = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
      function yl(e) {
        return (e = String(e)).match(f1) ? e : "unsafe:" + e;
      }
      function er(e) {
        const t = {};
        for (const n of e.split(",")) t[n] = !0;
        return t;
      }
      function es(...e) {
        const t = {};
        for (const n of e)
          for (const r in n) n.hasOwnProperty(r) && (t[r] = !0);
        return t;
      }
      const r_ = er("area,br,col,hr,img,wbr"),
        i_ = er("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        o_ = er("rp,rt"),
        Jd = es(
          r_,
          es(
            i_,
            er(
              "address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul"
            )
          ),
          es(
            o_,
            er(
              "a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video"
            )
          ),
          es(o_, i_)
        ),
        ef = er("background,cite,href,itemtype,longdesc,poster,src,xlink:href"),
        s_ = es(
          ef,
          er(
            "abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,srcset,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"
          ),
          er(
            "aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"
          )
        ),
        h1 = er("script,style,template");
      class p1 {
        constructor() {
          (this.sanitizedSomething = !1), (this.buf = []);
        }
        sanitizeChildren(t) {
          let n = t.firstChild,
            r = !0;
          for (; n; )
            if (
              (n.nodeType === Node.ELEMENT_NODE
                ? (r = this.startElement(n))
                : n.nodeType === Node.TEXT_NODE
                ? this.chars(n.nodeValue)
                : (this.sanitizedSomething = !0),
              r && n.firstChild)
            )
              n = n.firstChild;
            else
              for (; n; ) {
                n.nodeType === Node.ELEMENT_NODE && this.endElement(n);
                let i = this.checkClobberedElement(n, n.nextSibling);
                if (i) {
                  n = i;
                  break;
                }
                n = this.checkClobberedElement(n, n.parentNode);
              }
          return this.buf.join("");
        }
        startElement(t) {
          const n = t.nodeName.toLowerCase();
          if (!Jd.hasOwnProperty(n))
            return (this.sanitizedSomething = !0), !h1.hasOwnProperty(n);
          this.buf.push("<"), this.buf.push(n);
          const r = t.attributes;
          for (let i = 0; i < r.length; i++) {
            const o = r.item(i),
              s = o.name,
              a = s.toLowerCase();
            if (!s_.hasOwnProperty(a)) {
              this.sanitizedSomething = !0;
              continue;
            }
            let l = o.value;
            ef[a] && (l = yl(l)), this.buf.push(" ", s, '="', a_(l), '"');
          }
          return this.buf.push(">"), !0;
        }
        endElement(t) {
          const n = t.nodeName.toLowerCase();
          Jd.hasOwnProperty(n) &&
            !r_.hasOwnProperty(n) &&
            (this.buf.push("</"), this.buf.push(n), this.buf.push(">"));
        }
        chars(t) {
          this.buf.push(a_(t));
        }
        checkClobberedElement(t, n) {
          if (
            n &&
            (t.compareDocumentPosition(n) &
              Node.DOCUMENT_POSITION_CONTAINED_BY) ===
              Node.DOCUMENT_POSITION_CONTAINED_BY
          )
            throw new Error(
              `Failed to sanitize html because the element is clobbered: ${t.outerHTML}`
            );
          return n;
        }
      }
      const g1 = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g,
        m1 = /([^\#-~ |!])/g;
      function a_(e) {
        return e
          .replace(/&/g, "&amp;")
          .replace(g1, function (t) {
            return (
              "&#" +
              (1024 * (t.charCodeAt(0) - 55296) +
                (t.charCodeAt(1) - 56320) +
                65536) +
              ";"
            );
          })
          .replace(m1, function (t) {
            return "&#" + t.charCodeAt(0) + ";";
          })
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      }
      let vl;
      function l_(e, t) {
        let n = null;
        try {
          vl =
            vl ||
            (function n_(e) {
              const t = new u1(e);
              return (function d1() {
                try {
                  return !!new window.DOMParser().parseFromString(
                    $i(""),
                    "text/html"
                  );
                } catch {
                  return !1;
                }
              })()
                ? new c1(t)
                : t;
            })(e);
          let r = t ? String(t) : "";
          n = vl.getInertBodyElement(r);
          let i = 5,
            o = r;
          do {
            if (0 === i)
              throw new Error(
                "Failed to sanitize html because the input is unstable"
              );
            i--, (r = o), (o = n.innerHTML), (n = vl.getInertBodyElement(r));
          } while (r !== o);
          return $i(new p1().sanitizeChildren(tf(n) || n));
        } finally {
          if (n) {
            const r = tf(n) || n;
            for (; r.firstChild; ) r.removeChild(r.firstChild);
          }
        }
      }
      function tf(e) {
        return "content" in e &&
          (function y1(e) {
            return (
              e.nodeType === Node.ELEMENT_NODE && "TEMPLATE" === e.nodeName
            );
          })(e)
          ? e.content
          : null;
      }
      var Ce = (() => (
        ((Ce = Ce || {})[(Ce.NONE = 0)] = "NONE"),
        (Ce[(Ce.HTML = 1)] = "HTML"),
        (Ce[(Ce.STYLE = 2)] = "STYLE"),
        (Ce[(Ce.SCRIPT = 3)] = "SCRIPT"),
        (Ce[(Ce.URL = 4)] = "URL"),
        (Ce[(Ce.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        Ce
      ))();
      function nf(e) {
        const t = ts();
        return t
          ? Jv(t.sanitize(Ce.HTML, e) || "")
          : Rn(e, "HTML")
          ? Jv(Ht(e))
          : l_(Jo(), Q(e));
      }
      function Wr(e) {
        const t = ts();
        return t
          ? t.sanitize(Ce.URL, e) || ""
          : Rn(e, "URL")
          ? Ht(e)
          : yl(Q(e));
      }
      function c_(e) {
        const t = ts();
        if (t) return t_(t.sanitize(Ce.RESOURCE_URL, e) || "");
        if (Rn(e, "ResourceURL")) return t_(Ht(e));
        throw new v(904, !1);
      }
      function ts() {
        const e = E();
        return e && e[jr].sanitizer;
      }
      class S {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = O({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        get multi() {
          return this;
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const Kr = new S("ENVIRONMENT_INITIALIZER"),
        d_ = new S("INJECTOR", -1),
        f_ = new S("INJECTOR_DEF_TYPES");
      class h_ {
        get(t, n = Ro) {
          if (n === Ro) {
            const r = new Error(`NullInjectorError: No provider for ${Ze(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      function _l(e) {
        return { ɵproviders: e };
      }
      function D1(...e) {
        return { ɵproviders: p_(0, e), ɵfromNgModule: !0 };
      }
      function p_(e, ...t) {
        const n = [],
          r = new Set();
        let i;
        return (
          Go(t, (o) => {
            const s = o;
            rf(s, n, [], r) && ((i ||= []), i.push(s));
          }),
          void 0 !== i && g_(i, n),
          n
        );
      }
      function g_(e, t) {
        for (let n = 0; n < e.length; n++) {
          const { providers: i } = e[n];
          sf(i, (o) => {
            t.push(o);
          });
        }
      }
      function rf(e, t, n, r) {
        if (!(e = K(e))) return !1;
        let i = null,
          o = Jm(e);
        const s = !o && ce(e);
        if (o || s) {
          if (s && !s.standalone) return !1;
          i = e;
        } else {
          const l = e.ngModule;
          if (((o = Jm(l)), !o)) return !1;
          i = l;
        }
        const a = r.has(i);
        if (s) {
          if (a) return !1;
          if ((r.add(i), s.dependencies)) {
            const l =
              "function" == typeof s.dependencies
                ? s.dependencies()
                : s.dependencies;
            for (const c of l) rf(c, t, n, r);
          }
        } else {
          if (!o) return !1;
          {
            if (null != o.imports && !a) {
              let c;
              r.add(i);
              try {
                Go(o.imports, (u) => {
                  rf(u, t, n, r) && ((c ||= []), c.push(u));
                });
              } finally {
              }
              void 0 !== c && g_(c, t);
            }
            if (!a) {
              const c = Ur(i) || (() => new i());
              t.push(
                { provide: i, useFactory: c, deps: le },
                { provide: f_, useValue: i, multi: !0 },
                { provide: Kr, useValue: () => D(i), multi: !0 }
              );
            }
            const l = o.providers;
            null == l ||
              a ||
              sf(l, (u) => {
                t.push(u);
              });
          }
        }
        return i !== e && void 0 !== e.providers;
      }
      function sf(e, t) {
        for (let n of e)
          ed(n) && (n = n.ɵproviders), Array.isArray(n) ? sf(n, t) : t(n);
      }
      const E1 = pe({ provide: String, useValue: pe });
      function af(e) {
        return null !== e && "object" == typeof e && E1 in e;
      }
      function Qr(e) {
        return "function" == typeof e;
      }
      const lf = new S("Set Injector scope."),
        Cl = {},
        M1 = {};
      let cf;
      function bl() {
        return void 0 === cf && (cf = new h_()), cf;
      }
      class Pn {}
      class uf extends Pn {
        get destroyed() {
          return this._destroyed;
        }
        constructor(t, n, r, i) {
          super(),
            (this.parent = n),
            (this.source = r),
            (this.scopes = i),
            (this.records = new Map()),
            (this._ngOnDestroyHooks = new Set()),
            (this._onDestroyHooks = []),
            (this._destroyed = !1),
            ff(t, (s) => this.processProvider(s)),
            this.records.set(d_, zi(void 0, this)),
            i.has("environment") && this.records.set(Pn, zi(void 0, this));
          const o = this.records.get(lf);
          null != o && "string" == typeof o.value && this.scopes.add(o.value),
            (this.injectorDefTypes = new Set(this.get(f_.multi, le, B.Self)));
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            for (const n of this._ngOnDestroyHooks) n.ngOnDestroy();
            const t = this._onDestroyHooks;
            this._onDestroyHooks = [];
            for (const n of t) n();
          } finally {
            this.records.clear(),
              this._ngOnDestroyHooks.clear(),
              this.injectorDefTypes.clear();
          }
        }
        onDestroy(t) {
          return (
            this.assertNotDestroyed(),
            this._onDestroyHooks.push(t),
            () => this.removeOnDestroy(t)
          );
        }
        runInContext(t) {
          this.assertNotDestroyed();
          const n = vr(this),
            r = wt(void 0);
          try {
            return t();
          } finally {
            vr(n), wt(r);
          }
        }
        get(t, n = Ro, r = B.Default) {
          if ((this.assertNotDestroyed(), t.hasOwnProperty(sy)))
            return t[sy](this);
          r = Ra(r);
          const i = vr(this),
            o = wt(void 0);
          try {
            if (!(r & B.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const l =
                  (function O1(e) {
                    return (
                      "function" == typeof e ||
                      ("object" == typeof e && e instanceof S)
                    );
                  })(t) && xa(t);
                (a = l && this.injectableDefInScope(l) ? zi(df(t), Cl) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & B.Self ? bl() : this.parent).get(
              t,
              (n = r & B.Optional && n === Ro ? null : n)
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Na] = s[Na] || []).unshift(Ze(t)), i)) throw s;
              return (function MI(e, t, n, r) {
                const i = e[Na];
                throw (
                  (t[ry] && i.unshift(t[ry]),
                  (e.message = (function TI(e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.slice(2)
                        : e;
                    let i = Ze(t);
                    if (Array.isArray(t)) i = t.map(Ze).join(" -> ");
                    else if ("object" == typeof t) {
                      let o = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          o.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : Ze(a))
                          );
                        }
                      i = `{${o.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${i}]: ${e.replace(
                      bI,
                      "\n  "
                    )}`;
                  })("\n" + e.message, i, n, r)),
                  (e.ngTokenPath = i),
                  (e[Na] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            wt(o), vr(i);
          }
        }
        resolveInjectorInitializers() {
          const t = vr(this),
            n = wt(void 0);
          try {
            const r = this.get(Kr.multi, le, B.Self);
            for (const i of r) i();
          } finally {
            vr(t), wt(n);
          }
        }
        toString() {
          const t = [],
            n = this.records;
          for (const r of n.keys()) t.push(Ze(r));
          return `R3Injector[${t.join(", ")}]`;
        }
        assertNotDestroyed() {
          if (this._destroyed) throw new v(205, !1);
        }
        processProvider(t) {
          let n = Qr((t = K(t))) ? t : K(t && t.provide);
          const r = (function A1(e) {
            return af(e) ? zi(void 0, e.useValue) : zi(v_(e), Cl);
          })(t);
          if (Qr(t) || !0 !== t.multi) this.records.get(n);
          else {
            let i = this.records.get(n);
            i ||
              ((i = zi(void 0, Cl, !0)),
              (i.factory = () => id(i.multi)),
              this.records.set(n, i)),
              (n = t),
              i.multi.push(t);
          }
          this.records.set(n, r);
        }
        hydrate(t, n) {
          return (
            n.value === Cl && ((n.value = M1), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              (function x1(e) {
                return (
                  null !== e &&
                  "object" == typeof e &&
                  "function" == typeof e.ngOnDestroy
                );
              })(n.value) &&
              this._ngOnDestroyHooks.add(n.value),
            n.value
          );
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = K(t.providedIn);
          return "string" == typeof n
            ? "any" === n || this.scopes.has(n)
            : this.injectorDefTypes.has(n);
        }
        removeOnDestroy(t) {
          const n = this._onDestroyHooks.indexOf(t);
          -1 !== n && this._onDestroyHooks.splice(n, 1);
        }
      }
      function df(e) {
        const t = xa(e),
          n = null !== t ? t.factory : Ur(e);
        if (null !== n) return n;
        if (e instanceof S) throw new v(204, !1);
        if (e instanceof Function)
          return (function T1(e) {
            const t = e.length;
            if (t > 0)
              throw (
                ((function Wo(e, t) {
                  const n = [];
                  for (let r = 0; r < e; r++) n.push(t);
                  return n;
                })(t, "?"),
                new v(204, !1))
              );
            const n = (function vI(e) {
              return (e && (e[Oa] || e[ey])) || null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new v(204, !1);
      }
      function v_(e, t, n) {
        let r;
        if (Qr(e)) {
          const i = K(e);
          return Ur(i) || df(i);
        }
        if (af(e)) r = () => K(e.useValue);
        else if (
          (function y_(e) {
            return !(!e || !e.useFactory);
          })(e)
        )
          r = () => e.useFactory(...id(e.deps || []));
        else if (
          (function m_(e) {
            return !(!e || !e.useExisting);
          })(e)
        )
          r = () => D(K(e.useExisting));
        else {
          const i = K(e && (e.useClass || e.provide));
          if (
            !(function I1(e) {
              return !!e.deps;
            })(e)
          )
            return Ur(i) || df(i);
          r = () => new i(...id(e.deps));
        }
        return r;
      }
      function zi(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function ff(e, t) {
        for (const n of e)
          Array.isArray(n) ? ff(n, t) : n && ed(n) ? ff(n.ɵproviders, t) : t(n);
      }
      const wl = new S("AppId", { providedIn: "root", factory: () => N1 }),
        N1 = "ng",
        __ = new S("Platform Initializer"),
        Zr = new S("Platform ID", {
          providedIn: "platform",
          factory: () => "unknown",
        }),
        C_ = new S("AnimationModuleType"),
        b_ = new S("CSP nonce", {
          providedIn: "root",
          factory: () =>
            Jo()
              .body?.querySelector("[ngCspNonce]")
              ?.getAttribute("ngCspNonce") || null,
        });
      let D_ = (e, t) => null;
      function E_(e, t) {
        return D_(e, t);
      }
      class H1 {}
      class T_ {}
      class $1 {
        resolveComponentFactory(t) {
          throw (function U1(e) {
            const t = Error(`No component factory found for ${Ze(e)}.`);
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let os = (() => {
        class e {}
        return (e.NULL = new $1()), e;
      })();
      function z1() {
        return qi(ot(), E());
      }
      function qi(e, t) {
        return new Ut(Tt(e, t));
      }
      let Ut = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = z1), e;
      })();
      function q1(e) {
        return e instanceof Ut ? e.nativeElement : e;
      }
      class ss {}
      let tr = (() => {
          class e {
            constructor() {
              this.destroyNode = null;
            }
          }
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function G1() {
                const e = E(),
                  n = Lt(ot().index, e);
                return (kt(n) ? n : e)[Y];
              })()),
            e
          );
        })(),
        W1 = (() => {
          class e {}
          return (
            (e.ɵprov = O({
              token: e,
              providedIn: "root",
              factory: () => null,
            })),
            e
          );
        })();
      class as {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const K1 = new as("16.1.1"),
        Df = {};
      function ls(e) {
        for (; e; ) {
          e[Z] |= 64;
          const t = Zo(e);
          if (ud(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function Ef(e) {
        return e.ngOriginalError;
      }
      class wr {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t);
          this._console.error("ERROR", t),
            n && this._console.error("ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Ef(t);
          for (; n && Ef(n); ) n = Ef(n);
          return n || null;
        }
      }
      const O_ = new S("", { providedIn: "root", factory: () => !1 });
      function nr(e) {
        return e instanceof Function ? e() : e;
      }
      class k_ extends Ha {
        constructor() {
          super(...arguments),
            (this.consumerAllowSignalWrites = !1),
            (this._lView = null);
        }
        set lView(t) {
          this._lView = t;
        }
        onConsumerDependencyMayHaveChanged() {
          ls(this._lView);
        }
        onProducerUpdateValueVersion() {}
        get hasReadASignal() {
          return this.hasProducers;
        }
        runInContext(t, n, r) {
          const i = nt(this);
          this.trackingVersion++;
          try {
            t(n, r);
          } finally {
            nt(i);
          }
        }
        destroy() {
          this.trackingVersion++;
        }
      }
      let Al = null;
      function L_() {
        return (Al ??= new k_()), Al;
      }
      function V_(e, t) {
        return e[t] ?? L_();
      }
      function B_(e, t) {
        const n = L_();
        n.hasReadASignal && ((e[t] = Al), (n.lView = e), (Al = new k_()));
      }
      const X = {};
      function A(e) {
        j_(oe(), E(), yt() + e, !1);
      }
      function j_(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[Z])) {
            const o = e.preOrderCheckHooks;
            null !== o && Wa(t, o, n);
          } else {
            const o = e.preOrderHooks;
            null !== o && Ka(t, o, 0, n);
          }
        $r(n);
      }
      function q_(e, t = null, n = null, r) {
        const i = G_(e, t, n, r);
        return i.resolveInjectorInitializers(), i;
      }
      function G_(e, t = null, n = null, r, i = new Set()) {
        const o = [n || le, D1(e)];
        return (
          (r = r || ("object" == typeof e ? void 0 : Ze(e))),
          new uf(o, t || bl(), r || null, i)
        );
      }
      let $t = (() => {
        class e {
          static create(n, r) {
            if (Array.isArray(n)) return q_({ name: "" }, r, n, "");
            {
              const i = n.name ?? "";
              return q_({ name: i }, n.parent, n.providers, i);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = Ro),
          (e.NULL = new h_()),
          (e.ɵprov = O({ token: e, providedIn: "any", factory: () => D(d_) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function C(e, t = B.Default) {
        const n = E();
        return null === n ? D(e, t) : lv(ot(), n, K(e), t);
      }
      function Il(e, t, n, r, i, o, s, a, l, c, u) {
        const d = t.blueprint.slice();
        return (
          (d[Ye] = i),
          (d[Z] = 140 | r),
          (null !== c || (e && 2048 & e[Z])) && (d[Z] |= 2048),
          ky(d),
          (d[Ie] = d[Ti] = e),
          (d[Be] = n),
          (d[jr] = s || (e && e[jr])),
          (d[Y] = a || (e && e[Y])),
          (d[Mi] = l || (e && e[Mi]) || null),
          (d[ct] = o),
          (d[jo] = (function wO() {
            return bO++;
          })()),
          (d[Yn] = u),
          (d[_y] = c),
          (d[je] = 2 == t.type ? e[je] : d),
          d
        );
      }
      function Wi(e, t, n, r, i) {
        let o = e.data[t];
        if (null === o)
          (o = (function Sf(e, t, n, r, i) {
            const o = Uy(),
              s = md(),
              l = (e.data[t] = (function pN(e, t, n, r, i, o) {
                let s = t ? t.injectorIndex : -1,
                  a = 0;
                return (
                  (function Oi() {
                    return null !== G.skipHydrationRootTNode;
                  })() && (a |= 128),
                  {
                    type: n,
                    index: r,
                    insertBeforeIndex: null,
                    injectorIndex: s,
                    directiveStart: -1,
                    directiveEnd: -1,
                    directiveStylingLast: -1,
                    componentOffset: -1,
                    propertyBindings: null,
                    flags: a,
                    providerIndexes: 0,
                    value: i,
                    attrs: o,
                    mergedAttrs: null,
                    localNames: null,
                    initialInputs: void 0,
                    inputs: null,
                    outputs: null,
                    tView: null,
                    next: null,
                    prev: null,
                    projectionNext: null,
                    child: null,
                    parent: t,
                    projection: null,
                    styles: null,
                    stylesWithoutHost: null,
                    residualStyles: void 0,
                    classes: null,
                    classesWithoutHost: null,
                    residualClasses: void 0,
                    classBindings: 0,
                    styleBindings: 0,
                  }
                );
              })(0, s ? o : o && o.parent, n, t, r, i));
            return (
              null === e.firstChild && (e.firstChild = l),
              null !== o &&
                (s
                  ? null == o.child && null !== l.parent && (o.child = l)
                  : null === o.next && ((o.next = l), (l.prev = o))),
              l
            );
          })(e, t, n, r, i)),
            (function Sx() {
              return G.lFrame.inI18n;
            })() && (o.flags |= 32);
        else if (64 & o.type) {
          (o.type = n), (o.value = r), (o.attrs = i);
          const s = (function Uo() {
            const e = G.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          o.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return On(o, !0), o;
      }
      function cs(e, t, n, r) {
        if (0 === n) return -1;
        const i = t.length;
        for (let o = 0; o < n; o++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return i;
      }
      function K_(e, t, n, r, i) {
        const o = V_(t, ka),
          s = yt(),
          a = 2 & r;
        try {
          if (
            ($r(-1),
            a && t.length > ie && j_(e, t, ie, !1),
            xn(a ? 2 : 0, i),
            a)
          )
            o.runInContext(n, r, i);
          else {
            const c = nt(null);
            try {
              n(r, i);
            } finally {
              nt(c);
            }
          }
        } finally {
          a && null === t[ka] && B_(t, ka), $r(s), xn(a ? 3 : 1, i);
        }
      }
      function Mf(e, t, n) {
        if (cd(t)) {
          const r = nt(null);
          try {
            const o = t.directiveEnd;
            for (let s = t.directiveStart; s < o; s++) {
              const a = e.data[s];
              a.contentQueries && a.contentQueries(1, n[s], s);
            }
          } finally {
            nt(r);
          }
        }
      }
      function Tf(e, t, n) {
        Hy() &&
          ((function bN(e, t, n, r) {
            const i = n.directiveStart,
              o = n.directiveEnd;
            Hr(n) &&
              (function AN(e, t, n) {
                const r = Tt(t, e),
                  i = Q_(n);
                let s = 16;
                n.signals ? (s = 4096) : n.onPush && (s = 64);
                const a = xl(
                  e,
                  Il(
                    e,
                    i,
                    null,
                    s,
                    r,
                    t,
                    null,
                    e[jr].rendererFactory.createRenderer(r, n),
                    null,
                    null,
                    null
                  )
                );
                e[t.index] = a;
              })(t, n, e.data[i + n.componentOffset]),
              e.firstCreatePass || Xa(n, t),
              dt(r, t);
            const s = n.initialInputs;
            for (let a = i; a < o; a++) {
              const l = e.data[a],
                c = zr(t, e, a, n);
              dt(c, t),
                null !== s && IN(0, a - i, c, l, 0, s),
                pn(l) && (Lt(n.index, t)[Be] = zr(t, e, a, n));
            }
          })(e, t, n, Tt(n, t)),
          64 == (64 & n.flags) && eC(e, t, n));
      }
      function Af(e, t, n = Tt) {
        const r = t.localNames;
        if (null !== r) {
          let i = t.index + 1;
          for (let o = 0; o < r.length; o += 2) {
            const s = r[o + 1],
              a = -1 === s ? n(t, e) : e[s];
            e[i++] = a;
          }
        }
      }
      function Q_(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = If(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
              e.id
            ))
          : t;
      }
      function If(e, t, n, r, i, o, s, a, l, c, u) {
        const d = ie + r,
          f = d + i,
          h = (function lN(e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : X);
            return n;
          })(d, f),
          p = "function" == typeof c ? c() : c;
        return (h[R] = {
          type: e,
          blueprint: h,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: h.slice().fill(null, d),
          bindingStartIndex: d,
          expandoStartIndex: f,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof o ? o() : o,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: p,
          incompleteFirstPass: !1,
          ssrId: u,
        });
      }
      let Z_ = (e) => null;
      function Y_(e, t, n, r) {
        for (let i in e)
          if (e.hasOwnProperty(i)) {
            n = null === n ? {} : n;
            const o = e[i];
            null === r
              ? X_(n, t, i, o)
              : r.hasOwnProperty(i) && X_(n, t, r[i], o);
          }
        return n;
      }
      function X_(e, t, n, r) {
        e.hasOwnProperty(n) ? e[n].push(t, r) : (e[n] = [t, r]);
      }
      function zt(e, t, n, r, i, o, s, a) {
        const l = Tt(t, n);
        let u,
          c = t.inputs;
        !a && null != c && (u = c[r])
          ? (Pf(e, n, u, r, i),
            Hr(t) &&
              (function yN(e, t) {
                const n = Lt(t, e);
                16 & n[Z] || (n[Z] |= 64);
              })(n, t.index))
          : 3 & t.type &&
            ((r = (function mN(e) {
              return "class" === e
                ? "className"
                : "for" === e
                ? "htmlFor"
                : "formaction" === e
                ? "formAction"
                : "innerHtml" === e
                ? "innerHTML"
                : "readonly" === e
                ? "readOnly"
                : "tabindex" === e
                ? "tabIndex"
                : e;
            })(r)),
            (i = null != s ? s(i, t.value || "", r) : i),
            o.setProperty(l, r, i));
      }
      function xf(e, t, n, r) {
        if (Hy()) {
          const i = null === r ? null : { "": -1 },
            o = (function DN(e, t) {
              const n = e.directiveRegistry;
              let r = null,
                i = null;
              if (n)
                for (let o = 0; o < n.length; o++) {
                  const s = n[o];
                  if (hy(t, s.selectors, !1))
                    if ((r || (r = []), pn(s)))
                      if (null !== s.findHostDirectiveDefs) {
                        const a = [];
                        (i = i || new Map()),
                          s.findHostDirectiveDefs(s, a, i),
                          r.unshift(...a, s),
                          Of(e, t, a.length);
                      } else r.unshift(s), Of(e, t, 0);
                    else
                      (i = i || new Map()),
                        s.findHostDirectiveDefs?.(s, r, i),
                        r.push(s);
                }
              return null === r ? null : [r, i];
            })(e, n);
          let s, a;
          null === o ? (s = a = null) : ([s, a] = o),
            null !== s && J_(e, t, n, s, i, a),
            i &&
              (function EN(e, t, n) {
                if (t) {
                  const r = (e.localNames = []);
                  for (let i = 0; i < t.length; i += 2) {
                    const o = n[t[i + 1]];
                    if (null == o) throw new v(-301, !1);
                    r.push(t[i], o);
                  }
                }
              })(n, r, i);
        }
        n.mergedAttrs = ko(n.mergedAttrs, n.attrs);
      }
      function J_(e, t, n, r, i, o) {
        for (let c = 0; c < r.length; c++) Ad(Xa(n, t), e, r[c].type);
        !(function MN(e, t, n) {
          (e.flags |= 1),
            (e.directiveStart = t),
            (e.directiveEnd = t + n),
            (e.providerIndexes = t);
        })(n, e.data.length, r.length);
        for (let c = 0; c < r.length; c++) {
          const u = r[c];
          u.providersResolver && u.providersResolver(u);
        }
        let s = !1,
          a = !1,
          l = cs(e, t, r.length, null);
        for (let c = 0; c < r.length; c++) {
          const u = r[c];
          (n.mergedAttrs = ko(n.mergedAttrs, u.hostAttrs)),
            TN(e, n, t, l, u),
            SN(l, u, i),
            null !== u.contentQueries && (n.flags |= 4),
            (null !== u.hostBindings ||
              null !== u.hostAttrs ||
              0 !== u.hostVars) &&
              (n.flags |= 64);
          const d = u.type.prototype;
          !s &&
            (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
            ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
            !a &&
              (d.ngOnChanges || d.ngDoCheck) &&
              ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
            l++;
        }
        !(function gN(e, t, n) {
          const i = t.directiveEnd,
            o = e.data,
            s = t.attrs,
            a = [];
          let l = null,
            c = null;
          for (let u = t.directiveStart; u < i; u++) {
            const d = o[u],
              f = n ? n.get(d) : null,
              p = f ? f.outputs : null;
            (l = Y_(d.inputs, u, l, f ? f.inputs : null)),
              (c = Y_(d.outputs, u, c, p));
            const g = null === l || null === s || fy(t) ? null : xN(l, u, s);
            a.push(g);
          }
          null !== l &&
            (l.hasOwnProperty("class") && (t.flags |= 8),
            l.hasOwnProperty("style") && (t.flags |= 16)),
            (t.initialInputs = a),
            (t.inputs = l),
            (t.outputs = c);
        })(e, n, o);
      }
      function eC(e, t, n) {
        const r = n.directiveStart,
          i = n.directiveEnd,
          o = n.index,
          s = (function Tx() {
            return G.lFrame.currentDirectiveIndex;
          })();
        try {
          $r(o);
          for (let a = r; a < i; a++) {
            const l = e.data[a],
              c = t[a];
            vd(a),
              (null !== l.hostBindings ||
                0 !== l.hostVars ||
                null !== l.hostAttrs) &&
                wN(l, c);
          }
        } finally {
          $r(-1), vd(s);
        }
      }
      function wN(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Of(e, t, n) {
        (t.componentOffset = n), (e.components ??= []).push(t.index);
      }
      function SN(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          pn(t) && (n[""] = e);
        }
      }
      function TN(e, t, n, r, i) {
        e.data[r] = i;
        const o = i.factory || (i.factory = Ur(i.type)),
          s = new $o(o, pn(i), C);
        (e.blueprint[r] = s),
          (n[r] = s),
          (function _N(e, t, n, r, i) {
            const o = i.hostBindings;
            if (o) {
              let s = e.hostBindingOpCodes;
              null === s && (s = e.hostBindingOpCodes = []);
              const a = ~t.index;
              (function CN(e) {
                let t = e.length;
                for (; t > 0; ) {
                  const n = e[--t];
                  if ("number" == typeof n && n < 0) return n;
                }
                return 0;
              })(s) != a && s.push(a),
                s.push(n, r, o);
            }
          })(e, t, r, cs(e, n, i.hostVars, X), i);
      }
      function Fn(e, t, n, r, i, o) {
        const s = Tt(e, t);
        !(function Nf(e, t, n, r, i, o, s) {
          if (null == o) e.removeAttribute(t, i, n);
          else {
            const a = null == s ? Q(o) : s(o, r || "", i);
            e.setAttribute(t, i, a, n);
          }
        })(t[Y], s, o, e.value, n, r, i);
      }
      function IN(e, t, n, r, i, o) {
        const s = o[t];
        if (null !== s)
          for (let a = 0; a < s.length; ) tC(r, n, s[a++], s[a++], s[a++]);
      }
      function tC(e, t, n, r, i) {
        const o = nt(null);
        try {
          const s = e.inputTransforms;
          null !== s && s.hasOwnProperty(r) && (i = s[r].call(t, i)),
            null !== e.setInput ? e.setInput(t, i, n, r) : (t[r] = i);
        } finally {
          nt(o);
        }
      }
      function xN(e, t, n) {
        let r = null,
          i = 0;
        for (; i < n.length; ) {
          const o = n[i];
          if (0 !== o)
            if (5 !== o) {
              if ("number" == typeof o) break;
              if (e.hasOwnProperty(o)) {
                null === r && (r = []);
                const s = e[o];
                for (let a = 0; a < s.length; a += 2)
                  if (s[a] === t) {
                    r.push(o, s[a + 1], n[i + 1]);
                    break;
                  }
              }
              i += 2;
            } else i += 2;
          else i += 4;
        }
        return r;
      }
      function nC(e, t, n, r) {
        return [e, !0, !1, t, null, 0, r, n, null, null, null];
      }
      function rC(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const o = n[r + 1];
            if (-1 !== o) {
              const s = e.data[o];
              Cd(n[r]), s.contentQueries(2, t[o], o);
            }
          }
      }
      function xl(e, t) {
        return e[Vo] ? (e[vy][hn] = t) : (e[Vo] = t), (e[vy] = t), t;
      }
      function Rf(e, t, n) {
        Cd(0);
        const r = nt(null);
        try {
          t(e, n);
        } finally {
          nt(r);
        }
      }
      function iC(e) {
        return e[Si] || (e[Si] = []);
      }
      function oC(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function aC(e, t) {
        const n = e[Mi],
          r = n ? n.get(wr, null) : null;
        r && r.handleError(t);
      }
      function Pf(e, t, n, r, i) {
        for (let o = 0; o < n.length; ) {
          const s = n[o++],
            a = n[o++];
          tC(e.data[s], t[s], r, a, i);
        }
      }
      function rr(e, t, n) {
        const r = za(t, e);
        !(function Vv(e, t, n) {
          e.setValue(t, n);
        })(e[Y], r, n);
      }
      function ON(e, t) {
        const n = Lt(t, e),
          r = n[R];
        !(function NN(e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n);
        const i = n[Ye];
        null !== i && null === n[Yn] && (n[Yn] = E_(i, n[Mi])), Ff(r, n, n[Be]);
      }
      function Ff(e, t, n) {
        bd(t);
        try {
          const r = e.viewQuery;
          null !== r && Rf(1, r, n);
          const i = e.template;
          null !== i && K_(e, t, i, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && rC(e, t),
            e.staticViewQueries && Rf(2, e.viewQuery, n);
          const o = e.components;
          null !== o &&
            (function RN(e, t) {
              for (let n = 0; n < t.length; n++) ON(e, t[n]);
            })(t, o);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[Z] &= -5), wd();
        }
      }
      let Ol = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = FN), (e.__NG_ENV_ID__ = (t) => t), e;
      })();
      class PN extends Ol {
        constructor(t) {
          super(), (this._lView = t);
        }
        onDestroy(t) {
          return (
            By(this._lView, t),
            () =>
              (function gx(e, t) {
                if (null === e[_r]) return;
                const n = e[_r].indexOf(t);
                -1 !== n && e[_r].splice(n, 1);
              })(this._lView, t)
          );
        }
      }
      function FN() {
        return new PN(E());
      }
      let lC = (() => {
        class e {
          constructor() {
            (this.all = new Set()), (this.queue = new Map());
          }
          create(n, r, i) {
            const o = typeof Zone > "u" ? null : Zone.current,
              s = new rx(
                n,
                (c) => {
                  this.all.has(c) && this.queue.set(c, o);
                },
                i
              );
            let a;
            this.all.add(s), s.notify();
            const l = () => {
              s.cleanup(), a?.(), this.all.delete(s), this.queue.delete(s);
            };
            return (a = r?.onDestroy(l)), { destroy: l };
          }
          flush() {
            if (0 !== this.queue.size)
              for (const [n, r] of this.queue)
                this.queue.delete(n), r ? r.run(() => n.run()) : n.run();
          }
          get isQueueEmpty() {
            return 0 === this.queue.size;
          }
        }
        return (
          (e.ɵprov = O({
            token: e,
            providedIn: "root",
            factory: () => new e(),
          })),
          e
        );
      })();
      function Nl(e, t, n) {
        let r = n ? e.styles : null,
          i = n ? e.classes : null,
          o = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (o = a)
              : 1 == o
              ? (i = Xu(i, a))
              : 2 == o && (r = Xu(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = i) : (e.classesWithoutHost = i);
      }
      function us(e, t, n, r, i = !1) {
        for (; null !== n; ) {
          const o = t[n.index];
          if ((null !== o && r.push(Se(o)), Mt(o))) {
            for (let a = ut; a < o.length; a++) {
              const l = o[a],
                c = l[R].firstChild;
              null !== c && us(l[R], l, c, r);
            }
            o[An] !== o[Ye] && r.push(o[An]);
          }
          const s = n.type;
          if (8 & s) us(e, t, n.child, r);
          else if (32 & s) {
            const a = Ud(n, t);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & s) {
            const a = Kv(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = Zo(t[je]);
              us(l[R], l, a, r, !0);
            }
          }
          n = i ? n.projectionNext : n.next;
        }
        return r;
      }
      function Rl(e, t, n, r = !0) {
        const i = t[jr].rendererFactory;
        i.begin && i.begin();
        try {
          cC(e, t, e.template, n);
        } catch (s) {
          throw (r && aC(t, s), s);
        } finally {
          i.end && i.end(), t[jr].effectManager?.flush();
        }
      }
      function cC(e, t, n, r) {
        const i = t[Z];
        if (256 != (256 & i)) {
          t[jr].effectManager?.flush(), bd(t);
          try {
            ky(t),
              (function zy(e) {
                return (G.lFrame.bindingIndex = e);
              })(e.bindingStartIndex),
              null !== n && K_(e, t, n, 2, r);
            const s = 3 == (3 & i);
            if (s) {
              const c = e.preOrderCheckHooks;
              null !== c && Wa(t, c, null);
            } else {
              const c = e.preOrderHooks;
              null !== c && Ka(t, c, 0, null), Dd(t, 0);
            }
            if (
              ((function VN(e) {
                for (let t = Fv(e); null !== t; t = kv(t)) {
                  if (!t[Cy]) continue;
                  const n = t[Ii];
                  for (let r = 0; r < n.length; r++) {
                    px(n[r]);
                  }
                }
              })(t),
              uC(t, 2),
              null !== e.contentQueries && rC(e, t),
              s)
            ) {
              const c = e.contentCheckHooks;
              null !== c && Wa(t, c);
            } else {
              const c = e.contentHooks;
              null !== c && Ka(t, c, 1), Dd(t, 1);
            }
            !(function aN(e, t) {
              const n = e.hostBindingOpCodes;
              if (null === n) return;
              const r = V_(t, La);
              try {
                for (let i = 0; i < n.length; i++) {
                  const o = n[i];
                  if (o < 0) $r(~o);
                  else {
                    const s = o,
                      a = n[++i],
                      l = n[++i];
                    Mx(a, s), r.runInContext(l, 2, t[s]);
                  }
                }
              } finally {
                null === t[La] && B_(t, La), $r(-1);
              }
            })(e, t);
            const a = e.components;
            null !== a && fC(t, a, 0);
            const l = e.viewQuery;
            if ((null !== l && Rf(2, l, r), s)) {
              const c = e.viewCheckHooks;
              null !== c && Wa(t, c);
            } else {
              const c = e.viewHooks;
              null !== c && Ka(t, c, 2), Dd(t, 2);
            }
            !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
              (t[Z] &= -73),
              Ly(t);
          } finally {
            wd();
          }
        }
      }
      function uC(e, t) {
        for (let n = Fv(e); null !== n; n = kv(n))
          for (let r = ut; r < n.length; r++) dC(n[r], t);
      }
      function BN(e, t, n) {
        dC(Lt(t, e), n);
      }
      function dC(e, t) {
        if (
          !(function fx(e) {
            return 128 == (128 & e[Z]);
          })(e)
        )
          return;
        const n = e[R];
        if ((80 & e[Z] && 0 === t) || 1024 & e[Z] || 2 === t)
          cC(n, e, n.template, e[Be]);
        else if (e[Lo] > 0) {
          uC(e, 1);
          const i = e[R].components;
          null !== i && fC(e, i, 1);
        }
      }
      function fC(e, t, n) {
        for (let r = 0; r < t.length; r++) BN(e, t[r], n);
      }
      class ds {
        get rootNodes() {
          const t = this._lView,
            n = t[R];
          return us(n, t, n.firstChild, []);
        }
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get context() {
          return this._lView[Be];
        }
        set context(t) {
          this._lView[Be] = t;
        }
        get destroyed() {
          return 256 == (256 & this._lView[Z]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[Ie];
            if (Mt(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (zd(t, r), tl(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          jv(this._lView[R], this._lView);
        }
        onDestroy(t) {
          By(this._lView, t);
        }
        markForCheck() {
          ls(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[Z] &= -129;
        }
        reattach() {
          this._lView[Z] |= 128;
        }
        detectChanges() {
          Rl(this._lView[R], this._lView, this.context);
        }
        checkNoChanges() {}
        attachToViewContainerRef() {
          if (this._appRef) throw new v(902, !1);
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          (this._appRef = null),
            (function kO(e, t) {
              Xo(e, t, t[Y], 2, null, null);
            })(this._lView[R], this._lView);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer) throw new v(902, !1);
          this._appRef = t;
        }
      }
      class jN extends ds {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          const t = this._view;
          Rl(t[R], t, t[Be], !1);
        }
        checkNoChanges() {}
        get context() {
          return null;
        }
      }
      class hC extends os {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = ce(t);
          return new fs(n, this.ngModule);
        }
      }
      function pC(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      class UN {
        constructor(t, n) {
          (this.injector = t), (this.parentInjector = n);
        }
        get(t, n, r) {
          r = Ra(r);
          const i = this.injector.get(t, Df, r);
          return i !== Df || n === Df ? i : this.parentInjector.get(t, n, r);
        }
      }
      class fs extends T_ {
        get inputs() {
          return pC(this.componentDef.inputs);
        }
        get outputs() {
          return pC(this.componentDef.outputs);
        }
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = (function LI(e) {
              return e.map(kI).join(",");
            })(t.selectors)),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        create(t, n, r, i) {
          let o = (i = i || this.ngModule) instanceof Pn ? i : i?.injector;
          o &&
            null !== this.componentDef.getStandaloneInjector &&
            (o = this.componentDef.getStandaloneInjector(o) || o);
          const s = o ? new UN(t, o) : t,
            a = s.get(ss, null);
          if (null === a) throw new v(407, !1);
          const u = {
              rendererFactory: a,
              sanitizer: s.get(W1, null),
              effectManager: s.get(lC, null),
            },
            d = a.createRenderer(null, this.componentDef),
            f = this.componentDef.selectors[0][0] || "div",
            h = r
              ? (function cN(e, t, n, r) {
                  const o = r.get(O_, !1) || n === Dt.ShadowDom,
                    s = e.selectRootElement(t, o);
                  return (
                    (function uN(e) {
                      Z_(e);
                    })(s),
                    s
                  );
                })(d, r, this.componentDef.encapsulation, s)
              : dl(
                  d,
                  f,
                  (function HN(e) {
                    const t = e.toLowerCase();
                    return "svg" === t ? "svg" : "math" === t ? "math" : null;
                  })(f)
                ),
            m = this.componentDef.signals
              ? 4608
              : this.componentDef.onPush
              ? 576
              : 528,
            _ = If(0, null, null, 1, 0, null, null, null, null, null, null),
            y = Il(null, _, null, m, null, null, u, d, s, null, null);
          let I, P;
          bd(y);
          try {
            const L = this.componentDef;
            let he,
              Ge = null;
            L.findHostDirectiveDefs
              ? ((he = []),
                (Ge = new Map()),
                L.findHostDirectiveDefs(L, he, Ge),
                he.push(L))
              : (he = [L]);
            const Dn = (function zN(e, t) {
                const n = e[R],
                  r = ie;
                return (e[r] = t), Wi(n, r, 2, "#host", null);
              })(y, h),
              En = (function qN(e, t, n, r, i, o, s) {
                const a = i[R];
                !(function GN(e, t, n, r) {
                  for (const i of e)
                    t.mergedAttrs = ko(t.mergedAttrs, i.hostAttrs);
                  null !== t.mergedAttrs &&
                    (Nl(t, t.mergedAttrs, !0), null !== n && Xv(r, n, t));
                })(r, e, t, s);
                let l = null;
                null !== t && (l = E_(t, i[Mi]));
                const c = o.rendererFactory.createRenderer(t, n);
                let u = 16;
                n.signals ? (u = 4096) : n.onPush && (u = 64);
                const d = Il(
                  i,
                  Q_(n),
                  null,
                  u,
                  i[e.index],
                  e,
                  o,
                  c,
                  null,
                  null,
                  l
                );
                return (
                  a.firstCreatePass && Of(a, e, r.length - 1),
                  xl(i, d),
                  (i[e.index] = d)
                );
              })(Dn, h, L, he, y, u, d);
            (P = Fy(_, ie)),
              h &&
                (function KN(e, t, n, r) {
                  if (r) ad(e, n, ["ng-version", K1.full]);
                  else {
                    const { attrs: i, classes: o } = (function VI(e) {
                      const t = [],
                        n = [];
                      let r = 1,
                        i = 2;
                      for (; r < e.length; ) {
                        let o = e[r];
                        if ("string" == typeof o)
                          2 === i
                            ? "" !== o && t.push(o, e[++r])
                            : 8 === i && n.push(o);
                        else {
                          if (!fn(i)) break;
                          i = o;
                        }
                        r++;
                      }
                      return { attrs: t, classes: n };
                    })(t.selectors[0]);
                    i && ad(e, n, i),
                      o && o.length > 0 && Yv(e, n, o.join(" "));
                  }
                })(d, L, h, r),
              void 0 !== n &&
                (function QN(e, t, n) {
                  const r = (e.projection = []);
                  for (let i = 0; i < t.length; i++) {
                    const o = n[i];
                    r.push(null != o ? Array.from(o) : null);
                  }
                })(P, this.ngContentSelectors, n),
              (I = (function WN(e, t, n, r, i, o) {
                const s = ot(),
                  a = i[R],
                  l = Tt(s, i);
                J_(a, i, s, n, null, r);
                for (let u = 0; u < n.length; u++)
                  dt(zr(i, a, s.directiveStart + u, s), i);
                eC(a, i, s), l && dt(l, i);
                const c = zr(i, a, s.directiveStart + s.componentOffset, s);
                if (((e[Be] = i[Be] = c), null !== o))
                  for (const u of o) u(c, t);
                return Mf(a, s, e), c;
              })(En, L, he, Ge, y, [ZN])),
              Ff(_, y, null);
          } finally {
            wd();
          }
          return new $N(this.componentType, I, qi(P, y), y, P);
        }
      }
      class $N extends H1 {
        constructor(t, n, r, i, o) {
          super(),
            (this.location = r),
            (this._rootLView = i),
            (this._tNode = o),
            (this.previousInputValues = null),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new jN(i)),
            (this.componentType = t);
        }
        setInput(t, n) {
          const r = this._tNode.inputs;
          let i;
          if (null !== r && (i = r[t])) {
            if (
              ((this.previousInputValues ??= new Map()),
              this.previousInputValues.has(t) &&
                Object.is(this.previousInputValues.get(t), n))
            )
              return;
            const o = this._rootLView;
            Pf(o[R], o, i, t, n),
              this.previousInputValues.set(t, n),
              ls(Lt(this._tNode.index, o));
          }
        }
        get injector() {
          return new Pi(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      function ZN() {
        const e = ot();
        Ga(E()[R], e);
      }
      function ge(e) {
        let t = (function gC(e) {
            return Object.getPrototypeOf(e.prototype).constructor;
          })(e.type),
          n = !0;
        const r = [e];
        for (; t; ) {
          let i;
          if (pn(e)) i = t.ɵcmp || t.ɵdir;
          else {
            if (t.ɵcmp) throw new v(903, !1);
            i = t.ɵdir;
          }
          if (i) {
            if (n) {
              r.push(i);
              const s = e;
              (s.inputs = Pl(e.inputs)),
                (s.inputTransforms = Pl(e.inputTransforms)),
                (s.declaredInputs = Pl(e.declaredInputs)),
                (s.outputs = Pl(e.outputs));
              const a = i.hostBindings;
              a && eR(e, a);
              const l = i.viewQuery,
                c = i.contentQueries;
              if (
                (l && XN(e, l),
                c && JN(e, c),
                Ta(e.inputs, i.inputs),
                Ta(e.declaredInputs, i.declaredInputs),
                Ta(e.outputs, i.outputs),
                null !== i.inputTransforms &&
                  (null === s.inputTransforms && (s.inputTransforms = {}),
                  Ta(s.inputTransforms, i.inputTransforms)),
                pn(i) && i.data.animation)
              ) {
                const u = e.data;
                u.animation = (u.animation || []).concat(i.data.animation);
              }
            }
            const o = i.features;
            if (o)
              for (let s = 0; s < o.length; s++) {
                const a = o[s];
                a && a.ngInherit && a(e), a === ge && (n = !1);
              }
          }
          t = Object.getPrototypeOf(t);
        }
        !(function YN(e) {
          let t = 0,
            n = null;
          for (let r = e.length - 1; r >= 0; r--) {
            const i = e[r];
            (i.hostVars = t += i.hostVars),
              (i.hostAttrs = ko(i.hostAttrs, (n = ko(n, i.hostAttrs))));
          }
        })(r);
      }
      function Pl(e) {
        return e === Mn ? {} : e === le ? [] : e;
      }
      function XN(e, t) {
        const n = e.viewQuery;
        e.viewQuery = n
          ? (r, i) => {
              t(r, i), n(r, i);
            }
          : t;
      }
      function JN(e, t) {
        const n = e.contentQueries;
        e.contentQueries = n
          ? (r, i, o) => {
              t(r, i, o), n(r, i, o);
            }
          : t;
      }
      function eR(e, t) {
        const n = e.hostBindings;
        e.hostBindings = n
          ? (r, i) => {
              t(r, i), n(r, i);
            }
          : t;
      }
      function _C(e) {
        const t = e.inputConfig,
          n = {};
        for (const r in t)
          if (t.hasOwnProperty(r)) {
            const i = t[r];
            Array.isArray(i) && i[2] && (n[r] = i[2]);
          }
        e.inputTransforms = n;
      }
      function Fl(e) {
        return (
          !!kf(e) &&
          (Array.isArray(e) || (!(e instanceof Map) && Symbol.iterator in e))
        );
      }
      function kf(e) {
        return null !== e && ("function" == typeof e || "object" == typeof e);
      }
      function ft(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function Yr(e, t, n, r) {
        const i = ft(e, t, n);
        return ft(e, t + 1, r) || i;
      }
      function xt(e, t, n, r) {
        const i = E();
        return ft(i, Ni(), t) && (oe(), Fn(xe(), i, e, t, n, r)), xt;
      }
      function Zi(e, t, n, r, i, o) {
        const a = Yr(
          e,
          (function Xn() {
            return G.lFrame.bindingIndex;
          })(),
          n,
          i
        );
        return Jn(2), a ? t + Q(n) + r + Q(i) + o : X;
      }
      function H(e, t, n, r, i, o, s, a) {
        const l = E(),
          c = oe(),
          u = e + ie,
          d = c.firstCreatePass
            ? (function SR(e, t, n, r, i, o, s, a, l) {
                const c = t.consts,
                  u = Wi(t, e, 4, s || null, Cr(c, a));
                xf(t, n, u, Cr(c, l)), Ga(t, u);
                const d = (u.tView = If(
                  2,
                  u,
                  r,
                  i,
                  o,
                  t.directiveRegistry,
                  t.pipeRegistry,
                  null,
                  t.schemas,
                  c,
                  null
                ));
                return (
                  null !== t.queries &&
                    (t.queries.template(t, u),
                    (d.queries = t.queries.embeddedTView(u))),
                  u
                );
              })(u, c, l, t, n, r, i, o, s)
            : c.data[u];
        On(d, !1);
        const f = NC(c, l, d, e);
        qa() && hl(c, l, f, d),
          dt(f, l),
          xl(l, (l[u] = nC(f, l, f, d))),
          Ba(d) && Tf(c, l, d),
          null != s && Af(l, d, a);
      }
      let NC = function RC(e, t, n, r) {
        return br(!0), t[Y].createComment("");
      };
      function F(e, t, n) {
        const r = E();
        return ft(r, Ni(), t) && zt(oe(), xe(), r, e, t, r[Y], n, !1), F;
      }
      function Uf(e, t, n, r, i) {
        const s = i ? "class" : "style";
        Pf(e, n, t.inputs[s], s, r);
      }
      function b(e, t, n, r) {
        const i = E(),
          o = oe(),
          s = ie + e,
          a = i[Y],
          l = o.firstCreatePass
            ? (function xR(e, t, n, r, i, o) {
                const s = t.consts,
                  l = Wi(t, e, 2, r, Cr(s, i));
                return (
                  xf(t, n, l, Cr(s, o)),
                  null !== l.attrs && Nl(l, l.attrs, !1),
                  null !== l.mergedAttrs && Nl(l, l.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, l),
                  l
                );
              })(s, o, i, t, n, r)
            : o.data[s],
          c = PC(o, i, l, a, t, e);
        i[s] = c;
        const u = Ba(l);
        return (
          On(l, !0),
          Xv(a, c, l),
          32 != (32 & l.flags) && qa() && hl(o, i, c, l),
          0 ===
            (function mx() {
              return G.lFrame.elementDepthCount;
            })() && dt(c, i),
          (function yx() {
            G.lFrame.elementDepthCount++;
          })(),
          u && (Tf(o, i, l), Mf(o, l, i)),
          null !== r && Af(i, l),
          b
        );
      }
      function w() {
        let e = ot();
        md() ? yd() : ((e = e.parent), On(e, !1));
        const t = e;
        (function _x(e) {
          return G.skipHydrationRootTNode === e;
        })(t) &&
          (function Dx() {
            G.skipHydrationRootTNode = null;
          })(),
          (function vx() {
            G.lFrame.elementDepthCount--;
          })();
        const n = oe();
        return (
          n.firstCreatePass && (Ga(n, e), cd(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function Vx(e) {
              return 0 != (8 & e.flags);
            })(t) &&
            Uf(n, t, E(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function Bx(e) {
              return 0 != (16 & e.flags);
            })(t) &&
            Uf(n, t, E(), t.stylesWithoutHost, !1),
          w
        );
      }
      function se(e, t, n, r) {
        return b(e, t, n, r), w(), se;
      }
      let PC = (e, t, n, r, i, o) => (
        br(!0),
        dl(
          r,
          i,
          (function Xy() {
            return G.lFrame.currentNamespace;
          })()
        )
      );
      function ys(e, t, n) {
        const r = E(),
          i = oe(),
          o = e + ie,
          s = i.firstCreatePass
            ? (function RR(e, t, n, r, i) {
                const o = t.consts,
                  s = Cr(o, r),
                  a = Wi(t, e, 8, "ng-container", s);
                return (
                  null !== s && Nl(a, s, !0),
                  xf(t, n, a, Cr(o, i)),
                  null !== t.queries && t.queries.elementStart(t, a),
                  a
                );
              })(o, i, r, t, n)
            : i.data[o];
        On(s, !0);
        const a = kC(i, r, s, e);
        return (
          (r[o] = a),
          qa() && hl(i, r, a, s),
          dt(a, r),
          Ba(s) && (Tf(i, r, s), Mf(i, s, r)),
          null != n && Af(r, s),
          ys
        );
      }
      function vs() {
        let e = ot();
        const t = oe();
        return (
          md() ? yd() : ((e = e.parent), On(e, !1)),
          t.firstCreatePass && (Ga(t, e), cd(e) && t.queries.elementEnd(e)),
          vs
        );
      }
      let kC = (e, t, n, r) => (br(!0), $d(t[Y], ""));
      function nn() {
        return E();
      }
      function _s(e) {
        return !!e && "function" == typeof e.then;
      }
      function LC(e) {
        return !!e && "function" == typeof e.subscribe;
      }
      function ue(e, t, n, r) {
        const i = E(),
          o = oe(),
          s = ot();
        return (
          (function BC(e, t, n, r, i, o, s) {
            const a = Ba(r),
              c = e.firstCreatePass && oC(e),
              u = t[Be],
              d = iC(t);
            let f = !0;
            if (3 & r.type || s) {
              const g = Tt(r, t),
                m = s ? s(g) : g,
                _ = d.length,
                y = s ? (P) => s(Se(P[r.index])) : r.index;
              let I = null;
              if (
                (!s &&
                  a &&
                  (I = (function kR(e, t, n, r) {
                    const i = e.cleanup;
                    if (null != i)
                      for (let o = 0; o < i.length - 1; o += 2) {
                        const s = i[o];
                        if (s === n && i[o + 1] === r) {
                          const a = t[Si],
                            l = i[o + 2];
                          return a.length > l ? a[l] : null;
                        }
                        "string" == typeof s && (o += 2);
                      }
                    return null;
                  })(e, t, i, r.index)),
                null !== I)
              )
                ((I.__ngLastListenerFn__ || I).__ngNextListenerFn__ = o),
                  (I.__ngLastListenerFn__ = o),
                  (f = !1);
              else {
                o = HC(r, t, u, o, !1);
                const P = n.listen(m, i, o);
                d.push(o, P), c && c.push(i, y, _, _ + 1);
              }
            } else o = HC(r, t, u, o, !1);
            const h = r.outputs;
            let p;
            if (f && null !== h && (p = h[i])) {
              const g = p.length;
              if (g)
                for (let m = 0; m < g; m += 2) {
                  const L = t[p[m]][p[m + 1]].subscribe(o),
                    he = d.length;
                  d.push(o, L), c && c.push(i, r.index, he, -(he + 1));
                }
            }
          })(o, i, i[Y], s, e, t, r),
          ue
        );
      }
      function jC(e, t, n, r) {
        try {
          return xn(6, t, n), !1 !== n(r);
        } catch (i) {
          return aC(e, i), !1;
        } finally {
          xn(7, t, n);
        }
      }
      function HC(e, t, n, r, i) {
        return function o(s) {
          if (s === Function) return r;
          ls(e.componentOffset > -1 ? Lt(e.index, t) : t);
          let l = jC(t, n, r, s),
            c = o.__ngNextListenerFn__;
          for (; c; ) (l = jC(t, n, c, s) && l), (c = c.__ngNextListenerFn__);
          return i && !1 === l && s.preventDefault(), l;
        };
      }
      function ne(e = 1) {
        return (function Ix(e) {
          return (G.lFrame.contextLView = (function xx(e, t) {
            for (; e > 0; ) (t = t[Ti]), e--;
            return t;
          })(e, G.lFrame.contextLView))[Be];
        })(e);
      }
      function jl(e, t) {
        return (e << 17) | (t << 2);
      }
      function Dr(e) {
        return (e >> 17) & 32767;
      }
      function zf(e) {
        return 2 | e;
      }
      function Xr(e) {
        return (131068 & e) >> 2;
      }
      function qf(e, t) {
        return (-131069 & e) | (t << 2);
      }
      function Gf(e) {
        return 1 | e;
      }
      function YC(e, t, n, r, i) {
        const o = e[n + 1],
          s = null === t;
        let a = r ? Dr(o) : Xr(o),
          l = !1;
        for (; 0 !== a && (!1 === l || s); ) {
          const u = e[a + 1];
          qR(e[a], t) && ((l = !0), (e[a + 1] = r ? Gf(u) : zf(u))),
            (a = r ? Dr(u) : Xr(u));
        }
        l && (e[n + 1] = r ? zf(o) : Gf(o));
      }
      function qR(e, t) {
        return (
          null === e ||
          null == t ||
          (Array.isArray(e) ? e[1] : e) === t ||
          (!(!Array.isArray(e) || "string" != typeof t) && Bi(e, t) >= 0)
        );
      }
      const Je = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
      function XC(e) {
        return e.substring(Je.key, Je.keyEnd);
      }
      function JC(e, t) {
        const n = Je.textEnd;
        return n === t
          ? -1
          : ((t = Je.keyEnd =
              (function QR(e, t, n) {
                for (; t < n && e.charCodeAt(t) > 32; ) t++;
                return t;
              })(e, (Je.key = t), n)),
            ro(e, t, n));
      }
      function ro(e, t, n) {
        for (; t < n && e.charCodeAt(t) <= 32; ) t++;
        return t;
      }
      function io(e, t, n) {
        return gn(e, t, n, !1), io;
      }
      function Hl(e, t) {
        return gn(e, t, null, !0), Hl;
      }
      function ir(e) {
        !(function mn(e, t, n, r) {
          const i = oe(),
            o = Jn(2);
          i.firstUpdatePass && ob(i, null, o, r);
          const s = E();
          if (n !== X && ft(s, o, n)) {
            const a = i.data[yt()];
            if (cb(a, r) && !ib(i, o)) {
              let l = r ? a.classesWithoutHost : a.stylesWithoutHost;
              null !== l && (n = Xu(l, n || "")), Uf(i, a, s, n, r);
            } else
              !(function oP(e, t, n, r, i, o, s, a) {
                i === X && (i = le);
                let l = 0,
                  c = 0,
                  u = 0 < i.length ? i[0] : null,
                  d = 0 < o.length ? o[0] : null;
                for (; null !== u || null !== d; ) {
                  const f = l < i.length ? i[l + 1] : void 0,
                    h = c < o.length ? o[c + 1] : void 0;
                  let g,
                    p = null;
                  u === d
                    ? ((l += 2), (c += 2), f !== h && ((p = d), (g = h)))
                    : null === d || (null !== u && u < d)
                    ? ((l += 2), (p = u))
                    : ((c += 2), (p = d), (g = h)),
                    null !== p && ab(e, t, n, r, p, g, s, a),
                    (u = l < i.length ? i[l] : null),
                    (d = c < o.length ? o[c] : null);
                }
              })(
                i,
                a,
                s,
                s[Y],
                s[o + 1],
                (s[o + 1] = (function rP(e, t, n) {
                  if (null == n || "" === n) return le;
                  const r = [],
                    i = Ht(n);
                  if (Array.isArray(i))
                    for (let o = 0; o < i.length; o++) e(r, i[o], !0);
                  else if ("object" == typeof i)
                    for (const o in i) i.hasOwnProperty(o) && e(r, o, i[o]);
                  else "string" == typeof i && t(r, i);
                  return r;
                })(e, t, n)),
                r,
                o
              );
          }
        })(iP, Vn, e, !0);
      }
      function Vn(e, t) {
        for (
          let n = (function WR(e) {
            return (
              (function tb(e) {
                (Je.key = 0),
                  (Je.keyEnd = 0),
                  (Je.value = 0),
                  (Je.valueEnd = 0),
                  (Je.textEnd = e.length);
              })(e),
              JC(e, ro(e, 0, Je.textEnd))
            );
          })(t);
          n >= 0;
          n = JC(t, n)
        )
          jt(e, XC(t), !0);
      }
      function gn(e, t, n, r) {
        const i = E(),
          o = oe(),
          s = Jn(2);
        o.firstUpdatePass && ob(o, e, s, r),
          t !== X &&
            ft(i, s, t) &&
            ab(
              o,
              o.data[yt()],
              i,
              i[Y],
              e,
              (i[s + 1] = (function sP(e, t) {
                return (
                  null == e ||
                    "" === e ||
                    ("string" == typeof t
                      ? (e += t)
                      : "object" == typeof e && (e = Ze(Ht(e)))),
                  e
                );
              })(t, n)),
              r,
              s
            );
      }
      function ib(e, t) {
        return t >= e.expandoStartIndex;
      }
      function ob(e, t, n, r) {
        const i = e.data;
        if (null === i[n + 1]) {
          const o = i[yt()],
            s = ib(e, n);
          cb(o, r) && null === t && !s && (t = !1),
            (t = (function JR(e, t, n, r) {
              const i = _d(e);
              let o = r ? t.residualClasses : t.residualStyles;
              if (null === i)
                0 === (r ? t.classBindings : t.styleBindings) &&
                  ((n = Cs((n = Wf(null, e, t, n, r)), t.attrs, r)),
                  (o = null));
              else {
                const s = t.directiveStylingLast;
                if (-1 === s || e[s] !== i)
                  if (((n = Wf(i, e, t, n, r)), null === o)) {
                    let l = (function eP(e, t, n) {
                      const r = n ? t.classBindings : t.styleBindings;
                      if (0 !== Xr(r)) return e[Dr(r)];
                    })(e, t, r);
                    void 0 !== l &&
                      Array.isArray(l) &&
                      ((l = Wf(null, e, t, l[1], r)),
                      (l = Cs(l, t.attrs, r)),
                      (function tP(e, t, n, r) {
                        e[Dr(n ? t.classBindings : t.styleBindings)] = r;
                      })(e, t, r, l));
                  } else
                    o = (function nP(e, t, n) {
                      let r;
                      const i = t.directiveEnd;
                      for (let o = 1 + t.directiveStylingLast; o < i; o++)
                        r = Cs(r, e[o].hostAttrs, n);
                      return Cs(r, t.attrs, n);
                    })(e, t, r);
              }
              return (
                void 0 !== o &&
                  (r ? (t.residualClasses = o) : (t.residualStyles = o)),
                n
              );
            })(i, o, t, r)),
            (function $R(e, t, n, r, i, o) {
              let s = o ? t.classBindings : t.styleBindings,
                a = Dr(s),
                l = Xr(s);
              e[r] = n;
              let u,
                c = !1;
              if (
                (Array.isArray(n)
                  ? ((u = n[1]), (null === u || Bi(n, u) > 0) && (c = !0))
                  : (u = n),
                i)
              )
                if (0 !== l) {
                  const f = Dr(e[a + 1]);
                  (e[r + 1] = jl(f, a)),
                    0 !== f && (e[f + 1] = qf(e[f + 1], r)),
                    (e[a + 1] = (function HR(e, t) {
                      return (131071 & e) | (t << 17);
                    })(e[a + 1], r));
                } else
                  (e[r + 1] = jl(a, 0)),
                    0 !== a && (e[a + 1] = qf(e[a + 1], r)),
                    (a = r);
              else
                (e[r + 1] = jl(l, 0)),
                  0 === a ? (a = r) : (e[l + 1] = qf(e[l + 1], r)),
                  (l = r);
              c && (e[r + 1] = zf(e[r + 1])),
                YC(e, u, r, !0),
                YC(e, u, r, !1),
                (function zR(e, t, n, r, i) {
                  const o = i ? e.residualClasses : e.residualStyles;
                  null != o &&
                    "string" == typeof t &&
                    Bi(o, t) >= 0 &&
                    (n[r + 1] = Gf(n[r + 1]));
                })(t, u, e, r, o),
                (s = jl(a, l)),
                o ? (t.classBindings = s) : (t.styleBindings = s);
            })(i, o, t, n, s, r);
        }
      }
      function Wf(e, t, n, r, i) {
        let o = null;
        const s = n.directiveEnd;
        let a = n.directiveStylingLast;
        for (
          -1 === a ? (a = n.directiveStart) : a++;
          a < s && ((o = t[a]), (r = Cs(r, o.hostAttrs, i)), o !== e);

        )
          a++;
        return null !== e && (n.directiveStylingLast = a), r;
      }
      function Cs(e, t, n) {
        const r = n ? 1 : 2;
        let i = -1;
        if (null !== t)
          for (let o = 0; o < t.length; o++) {
            const s = t[o];
            "number" == typeof s
              ? (i = s)
              : i === r &&
                (Array.isArray(e) || (e = void 0 === e ? [] : ["", e]),
                jt(e, s, !!n || t[++o]));
          }
        return void 0 === e ? null : e;
      }
      function iP(e, t, n) {
        const r = String(t);
        "" !== r && !r.includes(" ") && jt(e, r, n);
      }
      function ab(e, t, n, r, i, o, s, a) {
        if (!(3 & t.type)) return;
        const l = e.data,
          c = l[a + 1],
          u = (function UR(e) {
            return 1 == (1 & e);
          })(c)
            ? lb(l, t, n, i, Xr(c), s)
            : void 0;
        Ul(u) ||
          (Ul(o) ||
            ((function jR(e) {
              return 2 == (2 & e);
            })(c) &&
              (o = lb(l, null, n, i, a, s))),
          (function GO(e, t, n, r, i) {
            if (t) i ? e.addClass(n, r) : e.removeClass(n, r);
            else {
              let o = -1 === r.indexOf("-") ? void 0 : At.DashCase;
              null == i
                ? e.removeStyle(n, r, o)
                : ("string" == typeof i &&
                    i.endsWith("!important") &&
                    ((i = i.slice(0, -10)), (o |= At.Important)),
                  e.setStyle(n, r, i, o));
            }
          })(r, s, za(yt(), n), i, o));
      }
      function lb(e, t, n, r, i, o) {
        const s = null === t;
        let a;
        for (; i > 0; ) {
          const l = e[i],
            c = Array.isArray(l),
            u = c ? l[1] : l,
            d = null === u;
          let f = n[i + 1];
          f === X && (f = d ? le : void 0);
          let h = d ? Od(f, r) : u === r ? f : void 0;
          if ((c && !Ul(h) && (h = Od(l, r)), Ul(h) && ((a = h), s))) return a;
          const p = e[i + 1];
          i = s ? Dr(p) : Xr(p);
        }
        if (null !== t) {
          let l = o ? t.residualClasses : t.residualStyles;
          null != l && (a = Od(l, r));
        }
        return a;
      }
      function Ul(e) {
        return void 0 !== e;
      }
      function cb(e, t) {
        return 0 != (e.flags & (t ? 8 : 16));
      }
      function x(e, t = "") {
        const n = E(),
          r = oe(),
          i = e + ie,
          o = r.firstCreatePass ? Wi(r, i, 1, t, null) : r.data[i],
          s = ub(r, n, o, t, e);
        (n[i] = s), qa() && hl(r, n, s, o), On(o, !1);
      }
      let ub = (e, t, n, r, i) => (
        br(!0),
        (function ul(e, t) {
          return e.createText(t);
        })(t[Y], r)
      );
      function qt(e) {
        return He("", e, ""), qt;
      }
      function He(e, t, n) {
        const r = E(),
          i = (function Qi(e, t, n, r) {
            return ft(e, Ni(), n) ? t + Q(n) + r : X;
          })(r, e, t, n);
        return i !== X && rr(r, yt(), i), He;
      }
      function oo(e, t, n, r, i) {
        const o = E(),
          s = Zi(o, e, t, n, r, i);
        return s !== X && rr(o, yt(), s), oo;
      }
      function Kf(e, t, n) {
        const r = E();
        if (ft(r, Ni(), t)) {
          const o = oe(),
            s = xe();
          zt(
            o,
            s,
            r,
            e,
            t,
            (function sC(e, t, n) {
              return (
                (null === e || pn(e)) &&
                  (n = (function cx(e) {
                    for (; Array.isArray(e); ) {
                      if ("object" == typeof e[ld]) return e;
                      e = e[Ye];
                    }
                    return null;
                  })(n[t.index])),
                n[Y]
              );
            })(_d(o.data), s, r),
            n,
            !0
          );
        }
        return Kf;
      }
      const ao = "en-US";
      let xb = ao;
      function Yf(e, t, n, r, i) {
        if (((e = K(e)), Array.isArray(e)))
          for (let o = 0; o < e.length; o++) Yf(e[o], t, n, r, i);
        else {
          const o = oe(),
            s = E();
          let a = Qr(e) ? e : K(e.provide),
            l = v_(e);
          const c = ot(),
            u = 1048575 & c.providerIndexes,
            d = c.directiveStart,
            f = c.providerIndexes >> 20;
          if (Qr(e) || !e.multi) {
            const h = new $o(l, i, C),
              p = Jf(a, t, i ? u : u + f, d);
            -1 === p
              ? (Ad(Xa(c, s), o, a),
                Xf(o, e, t.length),
                t.push(a),
                c.directiveStart++,
                c.directiveEnd++,
                i && (c.providerIndexes += 1048576),
                n.push(h),
                s.push(h))
              : ((n[p] = h), (s[p] = h));
          } else {
            const h = Jf(a, t, u + f, d),
              p = Jf(a, t, u, u + f),
              m = p >= 0 && n[p];
            if ((i && !m) || (!i && !(h >= 0 && n[h]))) {
              Ad(Xa(c, s), o, a);
              const _ = (function MF(e, t, n, r, i) {
                const o = new $o(e, n, C);
                return (
                  (o.multi = []),
                  (o.index = t),
                  (o.componentProviders = 0),
                  tw(o, i, r && !n),
                  o
                );
              })(i ? SF : EF, n.length, i, r, l);
              !i && m && (n[p].providerFactory = _),
                Xf(o, e, t.length, 0),
                t.push(a),
                c.directiveStart++,
                c.directiveEnd++,
                i && (c.providerIndexes += 1048576),
                n.push(_),
                s.push(_);
            } else Xf(o, e, h > -1 ? h : p, tw(n[i ? p : h], l, !i && r));
            !i && r && m && n[p].componentProviders++;
          }
        }
      }
      function Xf(e, t, n, r) {
        const i = Qr(t),
          o = (function S1(e) {
            return !!e.useClass;
          })(t);
        if (i || o) {
          const l = (o ? K(t.useClass) : t).prototype.ngOnDestroy;
          if (l) {
            const c = e.destroyHooks || (e.destroyHooks = []);
            if (!i && t.multi) {
              const u = c.indexOf(n);
              -1 === u ? c.push(n, [r, l]) : c[u + 1].push(r, l);
            } else c.push(n, l);
          }
        }
      }
      function tw(e, t, n) {
        return n && e.componentProviders++, e.multi.push(t) - 1;
      }
      function Jf(e, t, n, r) {
        for (let i = n; i < r; i++) if (t[i] === e) return i;
        return -1;
      }
      function EF(e, t, n, r) {
        return eh(this.multi, []);
      }
      function SF(e, t, n, r) {
        const i = this.multi;
        let o;
        if (this.providerFactory) {
          const s = this.providerFactory.componentProviders,
            a = zr(n, n[R], this.providerFactory.index, r);
          (o = a.slice(0, s)), eh(i, o);
          for (let l = s; l < a.length; l++) o.push(a[l]);
        } else (o = []), eh(i, o);
        return o;
      }
      function eh(e, t) {
        for (let n = 0; n < e.length; n++) t.push((0, e[n])());
        return t;
      }
      function Te(e, t = []) {
        return (n) => {
          n.providersResolver = (r, i) =>
            (function DF(e, t, n) {
              const r = oe();
              if (r.firstCreatePass) {
                const i = pn(e);
                Yf(n, r.data, r.blueprint, i, !0),
                  Yf(t, r.data, r.blueprint, i, !1);
              }
            })(r, i ? i(e) : e, t);
        };
      }
      class lo {}
      class nw {}
      class th extends lo {
        constructor(t, n, r) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new hC(this));
          const i = Ft(t);
          (this._bootstrapComponents = nr(i.bootstrap)),
            (this._r3Injector = G_(
              t,
              n,
              [
                { provide: lo, useValue: this },
                { provide: os, useValue: this.componentFactoryResolver },
                ...r,
              ],
              Ze(t),
              new Set(["environment"])
            )),
            this._r3Injector.resolveInjectorInitializers(),
            (this.instance = this._r3Injector.get(t));
        }
        get injector() {
          return this._r3Injector;
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class nh extends nw {
        constructor(t) {
          super(), (this.moduleType = t);
        }
        create(t) {
          return new th(this.moduleType, t, []);
        }
      }
      class rw extends lo {
        constructor(t) {
          super(),
            (this.componentFactoryResolver = new hC(this)),
            (this.instance = null);
          const n = new uf(
            [
              ...t.providers,
              { provide: lo, useValue: this },
              { provide: os, useValue: this.componentFactoryResolver },
            ],
            t.parent || bl(),
            t.debugName,
            new Set(["environment"])
          );
          (this.injector = n),
            t.runEnvironmentInitializers && n.resolveInjectorInitializers();
        }
        destroy() {
          this.injector.destroy();
        }
        onDestroy(t) {
          this.injector.onDestroy(t);
        }
      }
      function rh(e, t, n = null) {
        return new rw({
          providers: e,
          parent: t,
          debugName: n,
          runEnvironmentInitializers: !0,
        }).injector;
      }
      let IF = (() => {
        class e {
          constructor(n) {
            (this._injector = n), (this.cachedInjectors = new Map());
          }
          getOrCreateStandaloneInjector(n) {
            if (!n.standalone) return null;
            if (!this.cachedInjectors.has(n.id)) {
              const r = p_(0, n.type),
                i =
                  r.length > 0
                    ? rh([r], this._injector, `Standalone[${n.type.name}]`)
                    : null;
              this.cachedInjectors.set(n.id, i);
            }
            return this.cachedInjectors.get(n.id);
          }
          ngOnDestroy() {
            try {
              for (const n of this.cachedInjectors.values())
                null !== n && n.destroy();
            } finally {
              this.cachedInjectors.clear();
            }
          }
        }
        return (
          (e.ɵprov = O({
            token: e,
            providedIn: "environment",
            factory: () => new e(D(Pn)),
          })),
          e
        );
      })();
      function Wl(e) {
        e.getStandaloneInjector = (t) =>
          t.get(IF).getOrCreateStandaloneInjector(e);
      }
      function uw(e, t, n, r, i) {
        return (function fw(e, t, n, r, i, o, s) {
          const a = t + n;
          return Yr(e, a, i, o)
            ? (function kn(e, t, n) {
                return (e[t] = n);
              })(e, a + 2, s ? r.call(s, i, o) : r(i, o))
            : (function Ms(e, t) {
                const n = e[t];
                return n === X ? void 0 : n;
              })(e, a + 2);
        })(
          E(),
          (function mt() {
            const e = G.lFrame;
            let t = e.bindingRootIndex;
            return (
              -1 === t && (t = e.bindingRootIndex = e.tView.bindingStartIndex),
              t
            );
          })(),
          e,
          t,
          n,
          r,
          i
        );
      }
      function oh(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const Pe = class ek extends We {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          let i = t,
            o = n || (() => null),
            s = r;
          if (t && "object" == typeof t) {
            const l = t;
            (i = l.next?.bind(l)),
              (o = l.error?.bind(l)),
              (s = l.complete?.bind(l));
          }
          this.__isAsync && ((o = oh(o)), i && (i = oh(i)), s && (s = oh(s)));
          const a = super.subscribe({ next: i, error: o, complete: s });
          return t instanceof Rt && t.add(a), a;
        }
      };
      function tk() {
        return this._results[Symbol.iterator]();
      }
      class sh {
        get changes() {
          return this._changes || (this._changes = new Pe());
        }
        constructor(t = !1) {
          (this._emitDistinctChangesOnly = t),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const n = sh.prototype;
          n[Symbol.iterator] || (n[Symbol.iterator] = tk);
        }
        get(t) {
          return this._results[t];
        }
        map(t) {
          return this._results.map(t);
        }
        filter(t) {
          return this._results.filter(t);
        }
        find(t) {
          return this._results.find(t);
        }
        reduce(t, n) {
          return this._results.reduce(t, n);
        }
        forEach(t) {
          this._results.forEach(t);
        }
        some(t) {
          return this._results.some(t);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(t, n) {
          const r = this;
          r.dirty = !1;
          const i = (function en(e) {
            return e.flat(Number.POSITIVE_INFINITY);
          })(t);
          (this._changesDetected = !(function Zx(e, t, n) {
            if (e.length !== t.length) return !1;
            for (let r = 0; r < e.length; r++) {
              let i = e[r],
                o = t[r];
              if ((n && ((i = n(i)), (o = n(o))), o !== i)) return !1;
            }
            return !0;
          })(r._results, i, n)) &&
            ((r._results = i),
            (r.length = i.length),
            (r.last = i[this.length - 1]),
            (r.first = i[0]));
        }
        notifyOnChanges() {
          this._changes &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      let or = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = ik), e;
      })();
      const nk = or,
        rk = class extends nk {
          constructor(t, n, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          get ssrId() {
            return this._declarationTContainer.tView?.ssrId || null;
          }
          createEmbeddedView(t, n) {
            return this.createEmbeddedViewImpl(t, n, null);
          }
          createEmbeddedViewImpl(t, n, r) {
            const s = this._declarationTContainer.tView,
              a = Il(
                this._declarationLView,
                s,
                t,
                4096 & this._declarationLView[Z] ? 4096 : 16,
                null,
                s.declTNode,
                null,
                null,
                null,
                n || null,
                r || null
              );
            a[Bo] = this._declarationLView[this._declarationTContainer.index];
            const c = this._declarationLView[Tn];
            return (
              null !== c && (a[Tn] = c.createEmbeddedView(s)),
              Ff(s, a, t),
              new ds(a)
            );
          }
        };
      function ik() {
        return Kl(ot(), E());
      }
      function Kl(e, t) {
        return 4 & e.type ? new rk(t, e, qi(e, t)) : null;
      }
      let yn = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = dk), e;
      })();
      function dk() {
        return bw(ot(), E());
      }
      const fk = yn,
        _w = class extends fk {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return qi(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new Pi(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = Td(this._hostTNode, this._hostLView);
            if (nv(t)) {
              const n = Za(t, this._hostLView),
                r = Qa(t);
              return new Pi(n[R].data[r + 8], n);
            }
            return new Pi(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = Cw(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - ut;
          }
          createEmbeddedView(t, n, r) {
            let i, o;
            "number" == typeof r
              ? (i = r)
              : null != r && ((i = r.index), (o = r.injector));
            const a = t.createEmbeddedViewImpl(n || {}, o, null);
            return this.insertImpl(a, i, false), a;
          }
          createComponent(t, n, r, i, o) {
            const s =
              t &&
              !(function qo(e) {
                return "function" == typeof e;
              })(t);
            let a;
            if (s) a = n;
            else {
              const g = n || {};
              (a = g.index),
                (r = g.injector),
                (i = g.projectableNodes),
                (o = g.environmentInjector || g.ngModuleRef);
            }
            const l = s ? t : new fs(ce(t)),
              c = r || this.parentInjector;
            if (!o && null == l.ngModule) {
              const m = (s ? c : this.parentInjector).get(Pn, null);
              m && (o = m);
            }
            ce(l.componentType ?? {});
            const h = l.create(c, i, null, o);
            return this.insertImpl(h.hostView, a, false), h;
          }
          insert(t, n) {
            return this.insertImpl(t, n, !1);
          }
          insertImpl(t, n, r) {
            const i = t._lView,
              o = i[R];
            if (
              (function hx(e) {
                return Mt(e[Ie]);
              })(i)
            ) {
              const l = this.indexOf(t);
              if (-1 !== l) this.detach(l);
              else {
                const c = i[Ie],
                  u = new _w(c, c[ct], c[Ie]);
                u.detach(u.indexOf(t));
              }
            }
            const s = this._adjustIndex(n),
              a = this._lContainer;
            if (
              ((function VO(e, t, n, r) {
                const i = ut + r,
                  o = n.length;
                r > 0 && (n[i - 1][hn] = t),
                  r < o - ut
                    ? ((t[hn] = n[i]), pv(n, ut + r, t))
                    : (n.push(t), (t[hn] = null)),
                  (t[Ie] = n);
                const s = t[Bo];
                null !== s &&
                  n !== s &&
                  (function BO(e, t) {
                    const n = e[Ii];
                    t[je] !== t[Ie][Ie][je] && (e[Cy] = !0),
                      null === n ? (e[Ii] = [t]) : n.push(t);
                  })(s, t);
                const a = t[Tn];
                null !== a && a.insertView(e), (t[Z] |= 128);
              })(o, i, a, s),
              !r)
            ) {
              const l = Kd(s, a),
                c = i[Y],
                u = fl(c, a[An]);
              null !== u &&
                (function FO(e, t, n, r, i, o) {
                  (r[Ye] = i), (r[ct] = t), Xo(e, r, n, 1, i, o);
                })(o, a[ct], c, i, u, l);
            }
            return t.attachToViewContainerRef(), pv(lh(a), s, t), t;
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = Cw(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = zd(this._lContainer, n);
            r && (tl(lh(this._lContainer), n), jv(r[R], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = zd(this._lContainer, n);
            return r && null != tl(lh(this._lContainer), n) ? new ds(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return t ?? this.length + n;
          }
        };
      function Cw(e) {
        return e[8];
      }
      function lh(e) {
        return e[8] || (e[8] = []);
      }
      function bw(e, t) {
        let n;
        const r = t[e.index];
        return (
          Mt(r)
            ? (n = r)
            : ((n = nC(r, t, null, e)), (t[e.index] = n), xl(t, n)),
          ww(n, t, e, r),
          new _w(n, e, t)
        );
      }
      let ww = function Dw(e, t, n, r) {
        if (e[An]) return;
        let i;
        (i =
          8 & n.type
            ? Se(r)
            : (function hk(e, t) {
                const n = e[Y],
                  r = n.createComment(""),
                  i = Tt(t, e);
                return (
                  qr(
                    n,
                    fl(n, i),
                    r,
                    (function $O(e, t) {
                      return e.nextSibling(t);
                    })(n, i),
                    !1
                  ),
                  r
                );
              })(t, n)),
          (e[An] = i);
      };
      class ch {
        constructor(t) {
          (this.queryList = t), (this.matches = null);
        }
        clone() {
          return new ch(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class uh {
        constructor(t = []) {
          this.queries = t;
        }
        createEmbeddedView(t) {
          const n = t.queries;
          if (null !== n) {
            const r =
                null !== t.contentQueries ? t.contentQueries[0] : n.length,
              i = [];
            for (let o = 0; o < r; o++) {
              const s = n.getByIndex(o);
              i.push(this.queries[s.indexInDeclarationView].clone());
            }
            return new uh(i);
          }
          return null;
        }
        insertView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        detachView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        dirtyQueriesWithMatches(t) {
          for (let n = 0; n < this.queries.length; n++)
            null !== Iw(t, n).matches && this.queries[n].setDirty();
        }
      }
      class Ew {
        constructor(t, n, r = null) {
          (this.predicate = t), (this.flags = n), (this.read = r);
        }
      }
      class dh {
        constructor(t = []) {
          this.queries = t;
        }
        elementStart(t, n) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].elementStart(t, n);
        }
        elementEnd(t) {
          for (let n = 0; n < this.queries.length; n++)
            this.queries[n].elementEnd(t);
        }
        embeddedTView(t) {
          let n = null;
          for (let r = 0; r < this.length; r++) {
            const i = null !== n ? n.length : 0,
              o = this.getByIndex(r).embeddedTView(t, i);
            o &&
              ((o.indexInDeclarationView = r),
              null !== n ? n.push(o) : (n = [o]));
          }
          return null !== n ? new dh(n) : null;
        }
        template(t, n) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].template(t, n);
        }
        getByIndex(t) {
          return this.queries[t];
        }
        get length() {
          return this.queries.length;
        }
        track(t) {
          this.queries.push(t);
        }
      }
      class fh {
        constructor(t, n = -1) {
          (this.metadata = t),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = n);
        }
        elementStart(t, n) {
          this.isApplyingToNode(n) && this.matchTNode(t, n);
        }
        elementEnd(t) {
          this._declarationNodeIndex === t.index &&
            (this._appliesToNextNode = !1);
        }
        template(t, n) {
          this.elementStart(t, n);
        }
        embeddedTView(t, n) {
          return this.isApplyingToNode(t)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-t.index, n),
              new fh(this.metadata))
            : null;
        }
        isApplyingToNode(t) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const n = this._declarationNodeIndex;
            let r = t.parent;
            for (; null !== r && 8 & r.type && r.index !== n; ) r = r.parent;
            return n === (null !== r ? r.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(t, n) {
          const r = this.metadata.predicate;
          if (Array.isArray(r))
            for (let i = 0; i < r.length; i++) {
              const o = r[i];
              this.matchTNodeWithReadOption(t, n, mk(n, o)),
                this.matchTNodeWithReadOption(t, n, Ja(n, t, o, !1, !1));
            }
          else
            r === or
              ? 4 & n.type && this.matchTNodeWithReadOption(t, n, -1)
              : this.matchTNodeWithReadOption(t, n, Ja(n, t, r, !1, !1));
        }
        matchTNodeWithReadOption(t, n, r) {
          if (null !== r) {
            const i = this.metadata.read;
            if (null !== i)
              if (i === Ut || i === yn || (i === or && 4 & n.type))
                this.addMatch(n.index, -2);
              else {
                const o = Ja(n, t, i, !1, !1);
                null !== o && this.addMatch(n.index, o);
              }
            else this.addMatch(n.index, r);
          }
        }
        addMatch(t, n) {
          null === this.matches
            ? (this.matches = [t, n])
            : this.matches.push(t, n);
        }
      }
      function mk(e, t) {
        const n = e.localNames;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
        return null;
      }
      function vk(e, t, n, r) {
        return -1 === n
          ? (function yk(e, t) {
              return 11 & e.type ? qi(e, t) : 4 & e.type ? Kl(e, t) : null;
            })(t, e)
          : -2 === n
          ? (function _k(e, t, n) {
              return n === Ut
                ? qi(t, e)
                : n === or
                ? Kl(t, e)
                : n === yn
                ? bw(t, e)
                : void 0;
            })(e, t, r)
          : zr(e, e[R], n, t);
      }
      function Sw(e, t, n, r) {
        const i = t[Tn].queries[r];
        if (null === i.matches) {
          const o = e.data,
            s = n.matches,
            a = [];
          for (let l = 0; l < s.length; l += 2) {
            const c = s[l];
            a.push(c < 0 ? null : vk(t, o[c], s[l + 1], n.metadata.read));
          }
          i.matches = a;
        }
        return i.matches;
      }
      function hh(e, t, n, r) {
        const i = e.queries.getByIndex(n),
          o = i.matches;
        if (null !== o) {
          const s = Sw(e, t, i, n);
          for (let a = 0; a < o.length; a += 2) {
            const l = o[a];
            if (l > 0) r.push(s[a / 2]);
            else {
              const c = o[a + 1],
                u = t[-l];
              for (let d = ut; d < u.length; d++) {
                const f = u[d];
                f[Bo] === f[Ie] && hh(f[R], f, c, r);
              }
              if (null !== u[Ii]) {
                const d = u[Ii];
                for (let f = 0; f < d.length; f++) {
                  const h = d[f];
                  hh(h[R], h, c, r);
                }
              }
            }
          }
        }
        return r;
      }
      function Ql(e) {
        const t = E(),
          n = oe(),
          r = Gy();
        Cd(r + 1);
        const i = Iw(n, r);
        if (
          e.dirty &&
          (function dx(e) {
            return 4 == (4 & e[Z]);
          })(t) ===
            (2 == (2 & i.metadata.flags))
        ) {
          if (null === i.matches) e.reset([]);
          else {
            const o = i.crossesNgTemplate ? hh(n, t, r, []) : Sw(n, t, i, r);
            e.reset(o, q1), e.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function ph(e, t, n) {
        const r = oe();
        r.firstCreatePass &&
          ((function Aw(e, t, n) {
            null === e.queries && (e.queries = new dh()),
              e.queries.track(new fh(t, n));
          })(r, new Ew(e, t, n), -1),
          2 == (2 & t) && (r.staticViewQueries = !0)),
          (function Tw(e, t, n) {
            const r = new sh(4 == (4 & n));
            (function hN(e, t, n, r) {
              const i = iC(t);
              i.push(n), e.firstCreatePass && oC(e).push(r, i.length - 1);
            })(e, t, r, r.destroy),
              null === t[Tn] && (t[Tn] = new uh()),
              t[Tn].queries.push(new ch(r));
          })(r, E(), t);
      }
      function Zl() {
        return (function Ck(e, t) {
          return e[Tn].queries[t].queryList;
        })(E(), Gy());
      }
      function Iw(e, t) {
        return e.queries.getByIndex(t);
      }
      const Ch = new S("Application Initializer");
      let bh = (() => {
          class e {
            constructor() {
              (this.initialized = !1),
                (this.done = !1),
                (this.donePromise = new Promise((n, r) => {
                  (this.resolve = n), (this.reject = r);
                })),
                (this.appInits = M(Ch, { optional: !0 }) ?? []);
            }
            runInitializers() {
              if (this.initialized) return;
              const n = [];
              for (const i of this.appInits) {
                const o = i();
                if (_s(o)) n.push(o);
                else if (LC(o)) {
                  const s = new Promise((a, l) => {
                    o.subscribe({ complete: a, error: l });
                  });
                  n.push(s);
                }
              }
              const r = () => {
                (this.done = !0), this.resolve();
              };
              Promise.all(n)
                .then(() => {
                  r();
                })
                .catch((i) => {
                  this.reject(i);
                }),
                0 === n.length && r(),
                (this.initialized = !0);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        Gw = (() => {
          class e {
            log(n) {
              console.log(n);
            }
            warn(n) {
              console.warn(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })();
      const sr = new S("LocaleId", {
        providedIn: "root",
        factory: () =>
          M(sr, B.Optional | B.SkipSelf) ||
          (function $k() {
            return (typeof $localize < "u" && $localize.locale) || ao;
          })(),
      });
      let Xl = (() => {
        class e {
          constructor() {
            (this.taskId = 0),
              (this.pendingTasks = new Set()),
              (this.hasPendingTasks = new gt(!1));
          }
          add() {
            this.hasPendingTasks.next(!0);
            const n = this.taskId++;
            return this.pendingTasks.add(n), n;
          }
          remove(n) {
            this.pendingTasks.delete(n),
              0 === this.pendingTasks.size && this.hasPendingTasks.next(!1);
          }
          ngOnDestroy() {
            this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      class qk {
        constructor(t, n) {
          (this.ngModuleFactory = t), (this.componentFactories = n);
        }
      }
      let Ww = (() => {
        class e {
          compileModuleSync(n) {
            return new nh(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              o = nr(Ft(n).declarations).reduce((s, a) => {
                const l = ce(a);
                return l && s.push(new fs(l)), s;
              }, []);
            return new qk(r, o);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const Kk = (() => Promise.resolve(0))();
      function wh(e) {
        typeof Zone > "u"
          ? Kk.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      function Zw(...e) {}
      class ye {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Pe(!1)),
            (this.onMicrotaskEmpty = new Pe(!1)),
            (this.onStable = new Pe(!1)),
            (this.onError = new Pe(!1)),
            typeof Zone > "u")
          )
            throw new v(908, !1);
          Zone.assertZonePatched();
          const i = this;
          (i._nesting = 0),
            (i._outer = i._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
            (i.shouldCoalesceEventChangeDetection = !r && n),
            (i.shouldCoalesceRunChangeDetection = r),
            (i.lastRequestAnimationFrameId = -1),
            (i.nativeRequestAnimationFrame = (function Qk() {
              let e = De.requestAnimationFrame,
                t = De.cancelAnimationFrame;
              if (typeof Zone < "u" && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function Xk(e) {
              const t = () => {
                !(function Yk(e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(De, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                Eh(e),
                                (e.isCheckStableRunning = !0),
                                Dh(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {}
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    Eh(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, i, o, s, a) => {
                  try {
                    return Yw(e), n.invokeTask(i, o, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === o.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      Xw(e);
                  }
                },
                onInvoke: (n, r, i, o, s, a, l) => {
                  try {
                    return Yw(e), n.invoke(i, o, s, a, l);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), Xw(e);
                  }
                },
                onHasTask: (n, r, i, o) => {
                  n.hasTask(i, o),
                    r === i &&
                      ("microTask" == o.change
                        ? ((e._hasPendingMicrotasks = o.microTask),
                          Eh(e),
                          Dh(e))
                        : "macroTask" == o.change &&
                          (e.hasPendingMacrotasks = o.macroTask));
                },
                onHandleError: (n, r, i, o) => (
                  n.handleError(i, o),
                  e.runOutsideAngular(() => e.onError.emit(o)),
                  !1
                ),
              });
            })(i);
        }
        static isInAngularZone() {
          return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!ye.isInAngularZone()) throw new v(909, !1);
        }
        static assertNotInAngularZone() {
          if (ye.isInAngularZone()) throw new v(909, !1);
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, i) {
          const o = this._inner,
            s = o.scheduleEventTask("NgZoneEvent: " + i, t, Zk, Zw, Zw);
          try {
            return o.runTask(s, n, r);
          } finally {
            o.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const Zk = {};
      function Dh(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function Eh(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Yw(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function Xw(e) {
        e._nesting--, Dh(e);
      }
      class Jk {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new Pe()),
            (this.onMicrotaskEmpty = new Pe()),
            (this.onStable = new Pe()),
            (this.onError = new Pe());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, i) {
          return t.apply(n, r);
        }
      }
      const Jw = new S("", { providedIn: "root", factory: eD });
      function eD() {
        const e = M(ye);
        let t = !0;
        return Zu(
          new ve((i) => {
            (t =
              e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks),
              e.runOutsideAngular(() => {
                i.next(t), i.complete();
              });
          }),
          new ve((i) => {
            let o;
            e.runOutsideAngular(() => {
              o = e.onStable.subscribe(() => {
                ye.assertNotInAngularZone(),
                  wh(() => {
                    !t &&
                      !e.hasPendingMacrotasks &&
                      !e.hasPendingMicrotasks &&
                      ((t = !0), i.next(!0));
                  });
              });
            });
            const s = e.onUnstable.subscribe(() => {
              ye.assertInAngularZone(),
                t &&
                  ((t = !1),
                  e.runOutsideAngular(() => {
                    i.next(!1);
                  }));
            });
            return () => {
              o.unsubscribe(), s.unsubscribe();
            };
          }).pipe(Qm())
        );
      }
      const tD = new S(""),
        Jl = new S("");
      let Th,
        Sh = (() => {
          class e {
            constructor(n, r, i) {
              (this._ngZone = n),
                (this.registry = r),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                Th ||
                  ((function eL(e) {
                    Th = e;
                  })(i),
                  i.addToWindow(r)),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    typeof Zone > "u"
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      ye.assertNotInAngularZone(),
                        wh(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                wh(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1)
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, i) {
              let o = -1;
              r &&
                r > 0 &&
                (o = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== o
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: o, updateCb: i });
            }
            whenStable(n, r, i) {
              if (i && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?'
                );
              this.addCallback(n, r, i), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            registerApplication(n) {
              this.registry.registerApplication(n, this);
            }
            unregisterApplication(n) {
              this.registry.unregisterApplication(n);
            }
            findProviders(n, r, i) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(ye), D(Mh), D(Jl));
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Mh = (() => {
          class e {
            constructor() {
              this._applications = new Map();
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return Th?.findTestabilityInTree(this, n, r) ?? null;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({
              token: e,
              factory: e.ɵfac,
              providedIn: "platform",
            })),
            e
          );
        })(),
        Er = null;
      const nD = new S("AllowMultipleToken"),
        Ah = new S("PlatformDestroyListeners"),
        Ih = new S("appBootstrapListener");
      class iD {
        constructor(t, n) {
          (this.name = t), (this.token = n);
        }
      }
      function sD(e, t, n = []) {
        const r = `Platform: ${t}`,
          i = new S(r);
        return (o = []) => {
          let s = xh();
          if (!s || s.injector.get(nD, !1)) {
            const a = [...n, ...o, { provide: i, useValue: !0 }];
            e
              ? e(a)
              : (function rL(e) {
                  if (Er && !Er.get(nD, !1)) throw new v(400, !1);
                  (function rD() {
                    !(function tx(e) {
                      My = e;
                    })(() => {
                      throw new v(600, !1);
                    });
                  })(),
                    (Er = e);
                  const t = e.get(lD);
                  (function oD(e) {
                    e.get(__, null)?.forEach((n) => n());
                  })(e);
                })(
                  (function aD(e = [], t) {
                    return $t.create({
                      name: t,
                      providers: [
                        { provide: lf, useValue: "platform" },
                        { provide: Ah, useValue: new Set([() => (Er = null)]) },
                        ...e,
                      ],
                    });
                  })(a, r)
                );
          }
          return (function oL(e) {
            const t = xh();
            if (!t) throw new v(401, !1);
            return t;
          })();
        };
      }
      function xh() {
        return Er?.get(lD) ?? null;
      }
      let lD = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const i = (function sL(e = "zone.js", t) {
              return "noop" === e ? new Jk() : "zone.js" === e ? new ye(t) : e;
            })(
              r?.ngZone,
              (function cD(e) {
                return {
                  enableLongStackTrace: !1,
                  shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
                  shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
                };
              })({
                eventCoalescing: r?.ngZoneEventCoalescing,
                runCoalescing: r?.ngZoneRunCoalescing,
              })
            );
            return i.run(() => {
              const o = (function AF(e, t, n) {
                  return new th(e, t, n);
                })(
                  n.moduleType,
                  this.injector,
                  (function pD(e) {
                    return [
                      { provide: ye, useFactory: e },
                      {
                        provide: Kr,
                        multi: !0,
                        useFactory: () => {
                          const t = M(lL, { optional: !0 });
                          return () => t.initialize();
                        },
                      },
                      { provide: hD, useFactory: aL },
                      { provide: Jw, useFactory: eD },
                    ];
                  })(() => i)
                ),
                s = o.injector.get(wr, null);
              return (
                i.runOutsideAngular(() => {
                  const a = i.onError.subscribe({
                    next: (l) => {
                      s.handleError(l);
                    },
                  });
                  o.onDestroy(() => {
                    ec(this._modules, o), a.unsubscribe();
                  });
                }),
                (function uD(e, t, n) {
                  try {
                    const r = n();
                    return _s(r)
                      ? r.catch((i) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(i)), i)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(s, i, () => {
                  const a = o.injector.get(bh);
                  return (
                    a.runInitializers(),
                    a.donePromise.then(
                      () => (
                        (function Ob(e) {
                          Yt(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (xb = e.toLowerCase().replace(/_/g, "-"));
                        })(o.injector.get(sr, ao) || ao),
                        this._moduleDoBootstrap(o),
                        o
                      )
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const i = dD({}, r);
            return (function tL(e, t, n) {
              const r = new nh(n);
              return Promise.resolve(r);
            })(0, 0, n).then((o) => this.bootstrapModuleFactory(o, i));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(ar);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((i) => r.bootstrap(i));
            else {
              if (!n.instance.ngDoBootstrap) throw new v(-403, !1);
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new v(404, !1);
            this._modules.slice().forEach((r) => r.destroy()),
              this._destroyListeners.forEach((r) => r());
            const n = this._injector.get(Ah, null);
            n && (n.forEach((r) => r()), n.clear()), (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D($t));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "platform" })),
          e
        );
      })();
      function dD(e, t) {
        return Array.isArray(t) ? t.reduce(dD, e) : { ...e, ...t };
      }
      let ar = (() => {
        class e {
          constructor() {
            (this._bootstrapListeners = []),
              (this._runningTick = !1),
              (this._destroyed = !1),
              (this._destroyListeners = []),
              (this._views = []),
              (this.internalErrorHandler = M(hD)),
              (this.zoneIsStable = M(Jw)),
              (this.componentTypes = []),
              (this.components = []),
              (this.isStable = M(Xl).hasPendingTasks.pipe(
                Zt((n) => (n ? $(!1) : this.zoneIsStable)),
                Zm(),
                Qm()
              )),
              (this._injector = M(Pn));
          }
          get destroyed() {
            return this._destroyed;
          }
          get injector() {
            return this._injector;
          }
          bootstrap(n, r) {
            const i = n instanceof T_;
            if (!this._injector.get(bh).done)
              throw (
                (!i &&
                  (function Ei(e) {
                    const t = ce(e) || lt(e) || St(e);
                    return null !== t && t.standalone;
                  })(n),
                new v(405, !1))
              );
            let s;
            (s = i ? n : this._injector.get(os).resolveComponentFactory(n)),
              this.componentTypes.push(s.componentType);
            const a = (function nL(e) {
                return e.isBoundToModule;
              })(s)
                ? void 0
                : this._injector.get(lo),
              c = s.create($t.NULL, [], r || s.selector, a),
              u = c.location.nativeElement,
              d = c.injector.get(tD, null);
            return (
              d?.registerApplication(u),
              c.onDestroy(() => {
                this.detachView(c.hostView),
                  ec(this.components, c),
                  d?.unregisterApplication(u);
              }),
              this._loadComponent(c),
              c
            );
          }
          tick() {
            if (this._runningTick) throw new v(101, !1);
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this.internalErrorHandler(n);
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            ec(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView), this.tick(), this.components.push(n);
            const r = this._injector.get(Ih, []);
            r.push(...this._bootstrapListeners), r.forEach((i) => i(n));
          }
          ngOnDestroy() {
            if (!this._destroyed)
              try {
                this._destroyListeners.forEach((n) => n()),
                  this._views.slice().forEach((n) => n.destroy());
              } finally {
                (this._destroyed = !0),
                  (this._views = []),
                  (this._bootstrapListeners = []),
                  (this._destroyListeners = []);
              }
          }
          onDestroy(n) {
            return (
              this._destroyListeners.push(n),
              () => ec(this._destroyListeners, n)
            );
          }
          destroy() {
            if (this._destroyed) throw new v(406, !1);
            const n = this._injector;
            n.destroy && !n.destroyed && n.destroy();
          }
          get viewCount() {
            return this._views.length;
          }
          warnIfDestroyed() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function ec(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      const hD = new S("", {
        providedIn: "root",
        factory: () => M(wr).handleError.bind(void 0),
      });
      function aL() {
        const e = M(ye),
          t = M(wr);
        return (n) => e.runOutsideAngular(() => t.handleError(n));
      }
      let lL = (() => {
        class e {
          constructor() {
            (this.zone = M(ye)), (this.applicationRef = M(ar));
          }
          initialize() {
            this._onMicrotaskEmptySubscription ||
              (this._onMicrotaskEmptySubscription =
                this.zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this.zone.run(() => {
                      this.applicationRef.tick();
                    });
                  },
                }));
          }
          ngOnDestroy() {
            this._onMicrotaskEmptySubscription?.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      let tc = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = dL), e;
      })();
      function dL(e) {
        return (function fL(e, t, n) {
          if (Hr(e) && !n) {
            const r = Lt(e.index, t);
            return new ds(r, r);
          }
          return 47 & e.type ? new ds(t[je], t) : null;
        })(ot(), E(), 16 == (16 & e));
      }
      class vD {
        constructor() {}
        supports(t) {
          return Fl(t);
        }
        create(t) {
          return new vL(t);
        }
      }
      const yL = (e, t) => t;
      class vL {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || yL);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            i = 0,
            o = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < CD(r, i, o)) ? n : r,
              a = CD(s, i, o),
              l = s.currentIndex;
            if (s === r) i--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) i++;
            else {
              o || (o = []);
              const c = a - i,
                u = l - i;
              if (c != u) {
                for (let f = 0; f < c; f++) {
                  const h = f < o.length ? o[f] : (o[f] = 0),
                    p = h + f;
                  u <= p && p < c && (o[f] = h + 1);
                }
                o[s.previousIndex] = u - c;
              }
            }
            a !== l && t(s, a, l);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !Fl(t))) throw new v(900, !1);
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let i,
            o,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (o = t[a]),
                (s = this._trackByFn(a, o)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, o, s, a)),
                    Object.is(n.item, o) || this._addIdentityChange(n, o))
                  : ((n = this._mismatch(n, o, s, a)), (r = !0)),
                (n = n._next);
          } else
            (i = 0),
              (function aR(e, t) {
                if (Array.isArray(e))
                  for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[Symbol.iterator]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (s = this._trackByFn(i, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, i)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, i)), (r = !0)),
                  (n = n._next),
                  i++;
              }),
              (this.length = i);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, i) {
          let o;
          return (
            null === t ? (o = this._itTail) : ((o = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._reinsertAfter(t, o, i))
              : null !==
                (t =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, i))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, o, i))
              : (t = this._addAfter(new _L(n, r), o, i)),
            t
          );
        }
        _verifyReinsertion(t, n, r, i) {
          let o =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== o
              ? (t = this._reinsertAfter(o, t._prev, i))
              : t.currentIndex != i &&
                ((t.currentIndex = i), this._addToMoves(t, i)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const i = t._prevRemoved,
            o = t._nextRemoved;
          return (
            null === i ? (this._removalsHead = o) : (i._nextRemoved = o),
            null === o ? (this._removalsTail = i) : (o._prevRemoved = i),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, n, r) {
          return (
            this._unlink(t),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _addAfter(t, n, r) {
          return (
            this._insertAfter(t, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, n, r) {
          const i = null === n ? this._itHead : n._next;
          return (
            (t._next = i),
            (t._prev = n),
            null === i ? (this._itTail = t) : (i._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new _D()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            t
          );
        }
        _addToMoves(t, n) {
          return (
            t.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new _D()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (
            (t.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class _L {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class CL {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, t)
            )
              return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class _D {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new CL()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const i = this.map.get(t);
          return i ? i.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function CD(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let i = 0;
        return n && r < n.length && (i = n[r]), r + t + i;
      }
      class bD {
        constructor() {}
        supports(t) {
          return t instanceof Map || kf(t);
        }
        create() {
          return new bL();
        }
      }
      class bL {
        constructor() {
          (this._records = new Map()),
            (this._mapHead = null),
            (this._appendAfter = null),
            (this._previousMapHead = null),
            (this._changesHead = null),
            (this._changesTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null);
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._changesHead ||
            null !== this._removalsHead
          );
        }
        forEachItem(t) {
          let n;
          for (n = this._mapHead; null !== n; n = n._next) t(n);
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousMapHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachChangedItem(t) {
          let n;
          for (n = this._changesHead; null !== n; n = n._nextChanged) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        diff(t) {
          if (t) {
            if (!(t instanceof Map || kf(t))) throw new v(900, !1);
          } else t = new Map();
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let n = this._mapHead;
          if (
            ((this._appendAfter = null),
            this._forEach(t, (r, i) => {
              if (n && n.key === i)
                this._maybeAddToChanges(n, r),
                  (this._appendAfter = n),
                  (n = n._next);
              else {
                const o = this._getOrCreateRecordForKey(i, r);
                n = this._insertBeforeOrAppend(n, o);
              }
            }),
            n)
          ) {
            n._prev && (n._prev._next = null), (this._removalsHead = n);
            for (let r = n; null !== r; r = r._nextRemoved)
              r === this._mapHead && (this._mapHead = null),
                this._records.delete(r.key),
                (r._nextRemoved = r._next),
                (r.previousValue = r.currentValue),
                (r.currentValue = null),
                (r._prev = null),
                (r._next = null);
          }
          return (
            this._changesTail && (this._changesTail._nextChanged = null),
            this._additionsTail && (this._additionsTail._nextAdded = null),
            this.isDirty
          );
        }
        _insertBeforeOrAppend(t, n) {
          if (t) {
            const r = t._prev;
            return (
              (n._next = t),
              (n._prev = r),
              (t._prev = n),
              r && (r._next = n),
              t === this._mapHead && (this._mapHead = n),
              (this._appendAfter = t),
              t
            );
          }
          return (
            this._appendAfter
              ? ((this._appendAfter._next = n), (n._prev = this._appendAfter))
              : (this._mapHead = n),
            (this._appendAfter = n),
            null
          );
        }
        _getOrCreateRecordForKey(t, n) {
          if (this._records.has(t)) {
            const i = this._records.get(t);
            this._maybeAddToChanges(i, n);
            const o = i._prev,
              s = i._next;
            return (
              o && (o._next = s),
              s && (s._prev = o),
              (i._next = null),
              (i._prev = null),
              i
            );
          }
          const r = new wL(t);
          return (
            this._records.set(t, r),
            (r.currentValue = n),
            this._addToAdditions(r),
            r
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              this._previousMapHead = this._mapHead, t = this._previousMapHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._changesHead; null !== t; t = t._nextChanged)
              t.previousValue = t.currentValue;
            for (t = this._additionsHead; null != t; t = t._nextAdded)
              t.previousValue = t.currentValue;
            (this._changesHead = this._changesTail = null),
              (this._additionsHead = this._additionsTail = null),
              (this._removalsHead = null);
          }
        }
        _maybeAddToChanges(t, n) {
          Object.is(n, t.currentValue) ||
            ((t.previousValue = t.currentValue),
            (t.currentValue = n),
            this._addToChanges(t));
        }
        _addToAdditions(t) {
          null === this._additionsHead
            ? (this._additionsHead = this._additionsTail = t)
            : ((this._additionsTail._nextAdded = t), (this._additionsTail = t));
        }
        _addToChanges(t) {
          null === this._changesHead
            ? (this._changesHead = this._changesTail = t)
            : ((this._changesTail._nextChanged = t), (this._changesTail = t));
        }
        _forEach(t, n) {
          t instanceof Map
            ? t.forEach(n)
            : Object.keys(t).forEach((r) => n(t[r], r));
        }
      }
      class wL {
        constructor(t) {
          (this.key = t),
            (this.previousValue = null),
            (this.currentValue = null),
            (this._nextPrevious = null),
            (this._next = null),
            (this._prev = null),
            (this._nextAdded = null),
            (this._nextRemoved = null),
            (this._nextChanged = null);
        }
      }
      function wD() {
        return new ic([new vD()]);
      }
      let ic = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const i = r.factories.slice();
              n = n.concat(i);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || wD()),
              deps: [[e, new il(), new rl()]],
            };
          }
          find(n) {
            const r = this.factories.find((i) => i.supports(n));
            if (null != r) return r;
            throw new v(901, !1);
          }
        }
        return (e.ɵprov = O({ token: e, providedIn: "root", factory: wD })), e;
      })();
      function DD() {
        return new Is([new bD()]);
      }
      let Is = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (r) {
              const i = r.factories.slice();
              n = n.concat(i);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || DD()),
              deps: [[e, new il(), new rl()]],
            };
          }
          find(n) {
            const r = this.factories.find((i) => i.supports(n));
            if (r) return r;
            throw new v(901, !1);
          }
        }
        return (e.ɵprov = O({ token: e, providedIn: "root", factory: DD })), e;
      })();
      const SL = sD(null, "core", []);
      let ML = (() => {
        class e {
          constructor(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(ar));
          }),
          (e.ɵmod = Ve({ type: e })),
          (e.ɵinj = Fe({})),
          e
        );
      })();
      function fo(e) {
        return "boolean" == typeof e ? e : null != e && "false" !== e;
      }
      let Lh = null;
      function Sr() {
        return Lh;
      }
      class VL {}
      const et = new S("DocumentToken");
      let Vh = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({
            token: e,
            factory: function () {
              return M(jL);
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      const BL = new S("Location Initialized");
      let jL = (() => {
        class e extends Vh {
          constructor() {
            super(),
              (this._doc = M(et)),
              (this._location = window.location),
              (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return Sr().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = Sr().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = Sr().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this._location.href;
          }
          get protocol() {
            return this._location.protocol;
          }
          get hostname() {
            return this._location.hostname;
          }
          get port() {
            return this._location.port;
          }
          get pathname() {
            return this._location.pathname;
          }
          get search() {
            return this._location.search;
          }
          get hash() {
            return this._location.hash;
          }
          set pathname(n) {
            this._location.pathname = n;
          }
          pushState(n, r, i) {
            this._history.pushState(n, r, i);
          }
          replaceState(n, r, i) {
            this._history.replaceState(n, r, i);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({
            token: e,
            factory: function () {
              return new e();
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      function Bh(e, t) {
        if (0 == e.length) return t;
        if (0 == t.length) return e;
        let n = 0;
        return (
          e.endsWith("/") && n++,
          t.startsWith("/") && n++,
          2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
        );
      }
      function xD(e) {
        const t = e.match(/#|\?|$/),
          n = (t && t.index) || e.length;
        return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n);
      }
      function lr(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let ti = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({
            token: e,
            factory: function () {
              return M(ND);
            },
            providedIn: "root",
          })),
          e
        );
      })();
      const OD = new S("appBaseHref");
      let ND = (() => {
          class e extends ti {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                (this._baseHref =
                  r ??
                  this._platformLocation.getBaseHrefFromDOM() ??
                  M(et).location?.origin ??
                  "");
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return Bh(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  lr(this._platformLocation.search),
                i = this._platformLocation.hash;
              return i && n ? `${r}${i}` : r;
            }
            pushState(n, r, i, o) {
              const s = this.prepareExternalUrl(i + lr(o));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, i, o) {
              const s = this.prepareExternalUrl(i + lr(o));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(Vh), D(OD, 8));
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        HL = (() => {
          class e extends ti {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = Bh(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, i, o) {
              let s = this.prepareExternalUrl(i + lr(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, i, o) {
              let s = this.prepareExternalUrl(i + lr(o));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            getState() {
              return this._platformLocation.getState();
            }
            historyGo(n = 0) {
              this._platformLocation.historyGo?.(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(Vh), D(OD, 8));
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        jh = (() => {
          class e {
            constructor(n) {
              (this._subject = new Pe()),
                (this._urlChangeListeners = []),
                (this._urlChangeSubscription = null),
                (this._locationStrategy = n);
              const r = this._locationStrategy.getBaseHref();
              (this._basePath = (function zL(e) {
                if (new RegExp("^(https?:)?//").test(e)) {
                  const [, n] = e.split(/\/\/[^\/]+/);
                  return n;
                }
                return e;
              })(xD(RD(r)))),
                this._locationStrategy.onPopState((i) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: i.state,
                    type: i.type,
                  });
                });
            }
            ngOnDestroy() {
              this._urlChangeSubscription?.unsubscribe(),
                (this._urlChangeListeners = []);
            }
            path(n = !1) {
              return this.normalize(this._locationStrategy.path(n));
            }
            getState() {
              return this._locationStrategy.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + lr(r));
            }
            normalize(n) {
              return e.stripTrailingSlash(
                (function $L(e, t) {
                  if (!e || !t.startsWith(e)) return t;
                  const n = t.substring(e.length);
                  return "" === n || ["/", ";", "?", "#"].includes(n[0])
                    ? n
                    : t;
                })(this._basePath, RD(n))
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._locationStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", i = null) {
              this._locationStrategy.pushState(i, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + lr(r)),
                  i
                );
            }
            replaceState(n, r = "", i = null) {
              this._locationStrategy.replaceState(i, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + lr(r)),
                  i
                );
            }
            forward() {
              this._locationStrategy.forward();
            }
            back() {
              this._locationStrategy.back();
            }
            historyGo(n = 0) {
              this._locationStrategy.historyGo?.(n);
            }
            onUrlChange(n) {
              return (
                this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  })),
                () => {
                  const r = this._urlChangeListeners.indexOf(n);
                  this._urlChangeListeners.splice(r, 1),
                    0 === this._urlChangeListeners.length &&
                      (this._urlChangeSubscription?.unsubscribe(),
                      (this._urlChangeSubscription = null));
                }
              );
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((i) => i(n, r));
            }
            subscribe(n, r, i) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: i,
              });
            }
          }
          return (
            (e.normalizeQueryParams = lr),
            (e.joinWithSlash = Bh),
            (e.stripTrailingSlash = xD),
            (e.ɵfac = function (n) {
              return new (n || e)(D(ti));
            }),
            (e.ɵprov = O({
              token: e,
              factory: function () {
                return (function UL() {
                  return new jh(D(ti));
                })();
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function RD(e) {
        return e.replace(/\/index.html$/, "");
      }
      function UD(e, t) {
        t = encodeURIComponent(t);
        for (const n of e.split(";")) {
          const r = n.indexOf("="),
            [i, o] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
          if (i.trim() === t) return decodeURIComponent(o);
        }
        return null;
      }
      const Zh = /\s+/,
        $D = [];
      let zD = (() => {
        class e {
          constructor(n, r, i, o) {
            (this._iterableDiffers = n),
              (this._keyValueDiffers = r),
              (this._ngEl = i),
              (this._renderer = o),
              (this.initialClasses = $D),
              (this.stateMap = new Map());
          }
          set klass(n) {
            this.initialClasses = null != n ? n.trim().split(Zh) : $D;
          }
          set ngClass(n) {
            this.rawClass = "string" == typeof n ? n.trim().split(Zh) : n;
          }
          ngDoCheck() {
            for (const r of this.initialClasses) this._updateState(r, !0);
            const n = this.rawClass;
            if (Array.isArray(n) || n instanceof Set)
              for (const r of n) this._updateState(r, !0);
            else if (null != n)
              for (const r of Object.keys(n)) this._updateState(r, !!n[r]);
            this._applyStateDiff();
          }
          _updateState(n, r) {
            const i = this.stateMap.get(n);
            void 0 !== i
              ? (i.enabled !== r && ((i.changed = !0), (i.enabled = r)),
                (i.touched = !0))
              : this.stateMap.set(n, { enabled: r, changed: !0, touched: !0 });
          }
          _applyStateDiff() {
            for (const n of this.stateMap) {
              const r = n[0],
                i = n[1];
              i.changed
                ? (this._toggleClass(r, i.enabled), (i.changed = !1))
                : i.touched ||
                  (i.enabled && this._toggleClass(r, !1),
                  this.stateMap.delete(r)),
                (i.touched = !1);
            }
          }
          _toggleClass(n, r) {
            (n = n.trim()).length > 0 &&
              n.split(Zh).forEach((i) => {
                r
                  ? this._renderer.addClass(this._ngEl.nativeElement, i)
                  : this._renderer.removeClass(this._ngEl.nativeElement, i);
              });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(C(ic), C(Is), C(Ut), C(tr));
          }),
          (e.ɵdir = W({
            type: e,
            selectors: [["", "ngClass", ""]],
            inputs: { klass: ["class", "klass"], ngClass: "ngClass" },
            standalone: !0,
          })),
          e
        );
      })();
      class AV {
        constructor(t, n, r, i) {
          (this.$implicit = t),
            (this.ngForOf = n),
            (this.index = r),
            (this.count = i);
        }
        get first() {
          return 0 === this.index;
        }
        get last() {
          return this.index === this.count - 1;
        }
        get even() {
          return this.index % 2 == 0;
        }
        get odd() {
          return !this.even;
        }
      }
      let gc = (() => {
        class e {
          set ngForOf(n) {
            (this._ngForOf = n), (this._ngForOfDirty = !0);
          }
          set ngForTrackBy(n) {
            this._trackByFn = n;
          }
          get ngForTrackBy() {
            return this._trackByFn;
          }
          constructor(n, r, i) {
            (this._viewContainer = n),
              (this._template = r),
              (this._differs = i),
              (this._ngForOf = null),
              (this._ngForOfDirty = !0),
              (this._differ = null);
          }
          set ngForTemplate(n) {
            n && (this._template = n);
          }
          ngDoCheck() {
            if (this._ngForOfDirty) {
              this._ngForOfDirty = !1;
              const n = this._ngForOf;
              !this._differ &&
                n &&
                (this._differ = this._differs
                  .find(n)
                  .create(this.ngForTrackBy));
            }
            if (this._differ) {
              const n = this._differ.diff(this._ngForOf);
              n && this._applyChanges(n);
            }
          }
          _applyChanges(n) {
            const r = this._viewContainer;
            n.forEachOperation((i, o, s) => {
              if (null == i.previousIndex)
                r.createEmbeddedView(
                  this._template,
                  new AV(i.item, this._ngForOf, -1, -1),
                  null === s ? void 0 : s
                );
              else if (null == s) r.remove(null === o ? void 0 : o);
              else if (null !== o) {
                const a = r.get(o);
                r.move(a, s), GD(a, i);
              }
            });
            for (let i = 0, o = r.length; i < o; i++) {
              const a = r.get(i).context;
              (a.index = i), (a.count = o), (a.ngForOf = this._ngForOf);
            }
            n.forEachIdentityChange((i) => {
              GD(r.get(i.currentIndex), i);
            });
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(C(yn), C(or), C(ic));
          }),
          (e.ɵdir = W({
            type: e,
            selectors: [["", "ngFor", "", "ngForOf", ""]],
            inputs: {
              ngForOf: "ngForOf",
              ngForTrackBy: "ngForTrackBy",
              ngForTemplate: "ngForTemplate",
            },
            standalone: !0,
          })),
          e
        );
      })();
      function GD(e, t) {
        e.context.$implicit = t.item;
      }
      let ni = (() => {
        class e {
          constructor(n, r) {
            (this._viewContainer = n),
              (this._context = new IV()),
              (this._thenTemplateRef = null),
              (this._elseTemplateRef = null),
              (this._thenViewRef = null),
              (this._elseViewRef = null),
              (this._thenTemplateRef = r);
          }
          set ngIf(n) {
            (this._context.$implicit = this._context.ngIf = n),
              this._updateView();
          }
          set ngIfThen(n) {
            WD("ngIfThen", n),
              (this._thenTemplateRef = n),
              (this._thenViewRef = null),
              this._updateView();
          }
          set ngIfElse(n) {
            WD("ngIfElse", n),
              (this._elseTemplateRef = n),
              (this._elseViewRef = null),
              this._updateView();
          }
          _updateView() {
            this._context.$implicit
              ? this._thenViewRef ||
                (this._viewContainer.clear(),
                (this._elseViewRef = null),
                this._thenTemplateRef &&
                  (this._thenViewRef = this._viewContainer.createEmbeddedView(
                    this._thenTemplateRef,
                    this._context
                  )))
              : this._elseViewRef ||
                (this._viewContainer.clear(),
                (this._thenViewRef = null),
                this._elseTemplateRef &&
                  (this._elseViewRef = this._viewContainer.createEmbeddedView(
                    this._elseTemplateRef,
                    this._context
                  )));
          }
          static ngTemplateContextGuard(n, r) {
            return !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(C(yn), C(or));
          }),
          (e.ɵdir = W({
            type: e,
            selectors: [["", "ngIf", ""]],
            inputs: {
              ngIf: "ngIf",
              ngIfThen: "ngIfThen",
              ngIfElse: "ngIfElse",
            },
            standalone: !0,
          })),
          e
        );
      })();
      class IV {
        constructor() {
          (this.$implicit = null), (this.ngIf = null);
        }
      }
      function WD(e, t) {
        if (t && !t.createEmbeddedView)
          throw new Error(
            `${e} must be a TemplateRef, but received '${Ze(t)}'.`
          );
      }
      let e2 = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = Ve({ type: e })),
          (e.ɵinj = Fe({})),
          e
        );
      })();
      function YD(e) {
        return "server" === e;
      }
      let i2 = (() => {
        class e {}
        return (
          (e.ɵprov = O({
            token: e,
            providedIn: "root",
            factory: () => new o2(D(et), window),
          })),
          e
        );
      })();
      class o2 {
        constructor(t, n) {
          (this.document = t), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const n = (function s2(e, t) {
            const n = e.getElementById(t) || e.getElementsByName(t)[0];
            if (n) return n;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              "function" == typeof e.body.attachShadow
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let i = r.currentNode;
              for (; i; ) {
                const o = i.shadowRoot;
                if (o) {
                  const s =
                    o.getElementById(t) || o.querySelector(`[name="${t}"]`);
                  if (s) return s;
                }
                i = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          n && (this.scrollToElement(n), n.focus());
        }
        setHistoryScrollRestoration(t) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = t);
          }
        }
        scrollToElement(t) {
          const n = t.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            i = n.top + this.window.pageYOffset,
            o = this.offset();
          this.window.scrollTo(r - o[0], i - o[1]);
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const t =
              XD(this.window.history) ||
              XD(Object.getPrototypeOf(this.window.history));
            return !(!t || (!t.writable && !t.set));
          } catch {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch {
            return !1;
          }
        }
      }
      function XD(e) {
        return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
      }
      class JD {}
      class I2 extends VL {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      }
      class rp extends I2 {
        static makeCurrent() {
          !(function LL(e) {
            Lh || (Lh = e);
          })(new rp());
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r),
            () => {
              t.removeEventListener(n, r);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n = (function x2() {
            return (
              (Rs = Rs || document.querySelector("base")),
              Rs ? Rs.getAttribute("href") : null
            );
          })();
          return null == n
            ? null
            : (function O2(e) {
                (vc = vc || document.createElement("a")),
                  vc.setAttribute("href", e);
                const t = vc.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          Rs = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return UD(document.cookie, t);
        }
      }
      let vc,
        Rs = null,
        R2 = (() => {
          class e {
            build() {
              return new XMLHttpRequest();
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const ip = new S("EventManagerPlugins");
      let iE = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((i) => {
                i.manager = this;
              }),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, i) {
            return this._findPluginFor(r).addEventListener(n, r, i);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            let r = this._eventNameToPlugin.get(n);
            if (r) return r;
            if (((r = this._plugins.find((o) => o.supports(n))), !r))
              throw new v(5101, !1);
            return this._eventNameToPlugin.set(n, r), r;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(ip), D(ye));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class oE {
        constructor(t) {
          this._doc = t;
        }
      }
      const op = "ng-app-id";
      let sE = (() => {
        class e {
          constructor(n, r, i, o = {}) {
            (this.doc = n),
              (this.appId = r),
              (this.nonce = i),
              (this.platformId = o),
              (this.styleRef = new Map()),
              (this.hostNodes = new Set()),
              (this.styleNodesInDOM = this.collectServerRenderedStyles()),
              (this.platformIsServer = YD(o)),
              this.resetHostNodes();
          }
          addStyles(n) {
            for (const r of n)
              1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r);
          }
          removeStyles(n) {
            for (const r of n)
              this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
          }
          ngOnDestroy() {
            const n = this.styleNodesInDOM;
            n && (n.forEach((r) => r.remove()), n.clear());
            for (const r of this.getAllStyles()) this.onStyleRemoved(r);
            this.resetHostNodes();
          }
          addHost(n) {
            this.hostNodes.add(n);
            for (const r of this.getAllStyles()) this.addStyleToHost(n, r);
          }
          removeHost(n) {
            this.hostNodes.delete(n);
          }
          getAllStyles() {
            return this.styleRef.keys();
          }
          onStyleAdded(n) {
            for (const r of this.hostNodes) this.addStyleToHost(r, n);
          }
          onStyleRemoved(n) {
            const r = this.styleRef;
            r.get(n)?.elements?.forEach((i) => i.remove()), r.delete(n);
          }
          collectServerRenderedStyles() {
            const n = this.doc.head?.querySelectorAll(
              `style[${op}="${this.appId}"]`
            );
            if (n?.length) {
              const r = new Map();
              return (
                n.forEach((i) => {
                  null != i.textContent && r.set(i.textContent, i);
                }),
                r
              );
            }
            return null;
          }
          changeUsageCount(n, r) {
            const i = this.styleRef;
            if (i.has(n)) {
              const o = i.get(n);
              return (o.usage += r), o.usage;
            }
            return i.set(n, { usage: r, elements: [] }), r;
          }
          getStyleElement(n, r) {
            const i = this.styleNodesInDOM,
              o = i?.get(r);
            if (o?.parentNode === n)
              return i.delete(r), o.removeAttribute(op), o;
            {
              const s = this.doc.createElement("style");
              return (
                this.nonce && s.setAttribute("nonce", this.nonce),
                (s.textContent = r),
                this.platformIsServer && s.setAttribute(op, this.appId),
                s
              );
            }
          }
          addStyleToHost(n, r) {
            const i = this.getStyleElement(n, r);
            n.appendChild(i);
            const o = this.styleRef,
              s = o.get(r)?.elements;
            s ? s.push(i) : o.set(r, { elements: [i], usage: 1 });
          }
          resetHostNodes() {
            const n = this.hostNodes;
            n.clear(), n.add(this.doc.head);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(et), D(wl), D(b_, 8), D(Zr));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const sp = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
          math: "http://www.w3.org/1998/MathML/",
        },
        ap = /%COMP%/g,
        L2 = new S("RemoveStylesOnCompDestory", {
          providedIn: "root",
          factory: () => !1,
        });
      function lE(e, t) {
        return t.map((n) => n.replace(ap, e));
      }
      let lp = (() => {
        class e {
          constructor(n, r, i, o, s, a, l, c = null) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = i),
              (this.removeStylesOnCompDestory = o),
              (this.doc = s),
              (this.platformId = a),
              (this.ngZone = l),
              (this.nonce = c),
              (this.rendererByCompId = new Map()),
              (this.platformIsServer = YD(a)),
              (this.defaultRenderer = new cp(n, s, l, this.platformIsServer));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            this.platformIsServer &&
              r.encapsulation === Dt.ShadowDom &&
              (r = { ...r, encapsulation: Dt.Emulated });
            const i = this.getOrCreateRenderer(n, r);
            return (
              i instanceof uE
                ? i.applyToHost(n)
                : i instanceof up && i.applyStyles(),
              i
            );
          }
          getOrCreateRenderer(n, r) {
            const i = this.rendererByCompId;
            let o = i.get(r.id);
            if (!o) {
              const s = this.doc,
                a = this.ngZone,
                l = this.eventManager,
                c = this.sharedStylesHost,
                u = this.removeStylesOnCompDestory,
                d = this.platformIsServer;
              switch (r.encapsulation) {
                case Dt.Emulated:
                  o = new uE(l, c, r, this.appId, u, s, a, d);
                  break;
                case Dt.ShadowDom:
                  return new H2(l, c, n, r, s, a, this.nonce, d);
                default:
                  o = new up(l, c, r, u, s, a, d);
              }
              (o.onDestroy = () => i.delete(r.id)), i.set(r.id, o);
            }
            return o;
          }
          ngOnDestroy() {
            this.rendererByCompId.clear();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(
              D(iE),
              D(sE),
              D(wl),
              D(L2),
              D(et),
              D(Zr),
              D(ye),
              D(b_)
            );
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class cp {
        constructor(t, n, r, i) {
          (this.eventManager = t),
            (this.doc = n),
            (this.ngZone = r),
            (this.platformIsServer = i),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? this.doc.createElementNS(sp[n] || n, t)
            : this.doc.createElement(t);
        }
        createComment(t) {
          return this.doc.createComment(t);
        }
        createText(t) {
          return this.doc.createTextNode(t);
        }
        appendChild(t, n) {
          (cE(t) ? t.content : t).appendChild(n);
        }
        insertBefore(t, n, r) {
          t && (cE(t) ? t.content : t).insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? this.doc.querySelector(t) : t;
          if (!r) throw new v(5104, !1);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, i) {
          if (i) {
            n = i + ":" + n;
            const o = sp[i];
            o ? t.setAttributeNS(o, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const i = sp[r];
            i ? t.removeAttributeNS(i, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, i) {
          i & (At.DashCase | At.Important)
            ? t.style.setProperty(n, r, i & At.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & At.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          if (
            "string" == typeof t &&
            !(t = Sr().getGlobalEventTarget(this.doc, t))
          )
            throw new Error(`Unsupported event target ${t} for event ${n}`);
          return this.eventManager.addEventListener(
            t,
            n,
            this.decoratePreventDefault(r)
          );
        }
        decoratePreventDefault(t) {
          return (n) => {
            if ("__ngUnwrap__" === n) return t;
            !1 ===
              (this.platformIsServer
                ? this.ngZone.runGuarded(() => t(n))
                : t(n)) && n.preventDefault();
          };
        }
      }
      function cE(e) {
        return "TEMPLATE" === e.tagName && void 0 !== e.content;
      }
      class H2 extends cp {
        constructor(t, n, r, i, o, s, a, l) {
          super(t, o, s, l),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const c = lE(i.id, i.styles);
          for (const u of c) {
            const d = document.createElement("style");
            a && d.setAttribute("nonce", a),
              (d.textContent = u),
              this.shadowRoot.appendChild(d);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t))
          );
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
      }
      class up extends cp {
        constructor(t, n, r, i, o, s, a, l) {
          super(t, o, s, a),
            (this.sharedStylesHost = n),
            (this.removeStylesOnCompDestory = i),
            (this.rendererUsageCount = 0),
            (this.styles = l ? lE(l, r.styles) : r.styles);
        }
        applyStyles() {
          this.sharedStylesHost.addStyles(this.styles),
            this.rendererUsageCount++;
        }
        destroy() {
          this.removeStylesOnCompDestory &&
            (this.sharedStylesHost.removeStyles(this.styles),
            this.rendererUsageCount--,
            0 === this.rendererUsageCount && this.onDestroy?.());
        }
      }
      class uE extends up {
        constructor(t, n, r, i, o, s, a, l) {
          const c = i + "-" + r.id;
          super(t, n, r, o, s, a, l, c),
            (this.contentAttr = (function V2(e) {
              return "_ngcontent-%COMP%".replace(ap, e);
            })(c)),
            (this.hostAttr = (function B2(e) {
              return "_nghost-%COMP%".replace(ap, e);
            })(c));
        }
        applyToHost(t) {
          this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      let U2 = (() => {
        class e extends oE {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, i) {
            return (
              n.addEventListener(r, i, !1),
              () => this.removeEventListener(n, r, i)
            );
          }
          removeEventListener(n, r, i) {
            return n.removeEventListener(r, i);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(et));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const dE = ["alt", "control", "meta", "shift"],
        $2 = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        z2 = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let q2 = (() => {
        class e extends oE {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, i) {
            const o = e.parseEventName(r),
              s = e.eventCallback(o.fullKey, i, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => Sr().onAndCancel(n, o.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              i = r.shift();
            if (0 === r.length || ("keydown" !== i && "keyup" !== i))
              return null;
            const o = e._normalizeKey(r.pop());
            let s = "",
              a = r.indexOf("code");
            if (
              (a > -1 && (r.splice(a, 1), (s = "code.")),
              dE.forEach((c) => {
                const u = r.indexOf(c);
                u > -1 && (r.splice(u, 1), (s += c + "."));
              }),
              (s += o),
              0 != r.length || 0 === o.length)
            )
              return null;
            const l = {};
            return (l.domEventName = i), (l.fullKey = s), l;
          }
          static matchEventFullKeyCode(n, r) {
            let i = $2[n.key] || n.key,
              o = "";
            return (
              r.indexOf("code.") > -1 && ((i = n.code), (o = "code.")),
              !(null == i || !i) &&
                ((i = i.toLowerCase()),
                " " === i ? (i = "space") : "." === i && (i = "dot"),
                dE.forEach((s) => {
                  s !== i && (0, z2[s])(n) && (o += s + ".");
                }),
                (o += i),
                o === r)
            );
          }
          static eventCallback(n, r, i) {
            return (o) => {
              e.matchEventFullKeyCode(o, n) && i.runGuarded(() => r(o));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(et));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Q2 = sD(SL, "browser", [
          { provide: Zr, useValue: "browser" },
          {
            provide: __,
            useValue: function G2() {
              rp.makeCurrent();
            },
            multi: !0,
          },
          {
            provide: et,
            useFactory: function K2() {
              return (
                (function YO(e) {
                  Yd = e;
                })(document),
                document
              );
            },
            deps: [],
          },
        ]),
        Z2 = new S(""),
        pE = [
          {
            provide: Jl,
            useClass: class N2 {
              addToWindow(t) {
                (De.getAngularTestability = (r, i = !0) => {
                  const o = t.findTestabilityInTree(r, i);
                  if (null == o) throw new v(5103, !1);
                  return o;
                }),
                  (De.getAllAngularTestabilities = () =>
                    t.getAllTestabilities()),
                  (De.getAllAngularRootElements = () => t.getAllRootElements()),
                  De.frameworkStabilizers || (De.frameworkStabilizers = []),
                  De.frameworkStabilizers.push((r) => {
                    const i = De.getAllAngularTestabilities();
                    let o = i.length,
                      s = !1;
                    const a = function (l) {
                      (s = s || l), o--, 0 == o && r(s);
                    };
                    i.forEach(function (l) {
                      l.whenStable(a);
                    });
                  });
              }
              findTestabilityInTree(t, n, r) {
                return null == n
                  ? null
                  : t.getTestability(n) ??
                      (r
                        ? Sr().isShadowRoot(n)
                          ? this.findTestabilityInTree(t, n.host, !0)
                          : this.findTestabilityInTree(t, n.parentElement, !0)
                        : null);
              }
            },
            deps: [],
          },
          { provide: tD, useClass: Sh, deps: [ye, Mh, Jl] },
          { provide: Sh, useClass: Sh, deps: [ye, Mh, Jl] },
        ],
        gE = [
          { provide: lf, useValue: "root" },
          {
            provide: wr,
            useFactory: function W2() {
              return new wr();
            },
            deps: [],
          },
          { provide: ip, useClass: U2, multi: !0, deps: [et, ye, Zr] },
          { provide: ip, useClass: q2, multi: !0, deps: [et] },
          lp,
          sE,
          iE,
          { provide: ss, useExisting: lp },
          { provide: JD, useClass: R2, deps: [] },
          [],
        ];
      let mE = (() => {
          class e {
            constructor(n) {}
            static withServerTransition(n) {
              return {
                ngModule: e,
                providers: [{ provide: wl, useValue: n.appId }],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(Z2, 12));
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({ providers: [...gE, ...pE], imports: [e2, ML] })),
            e
          );
        })(),
        yE = (() => {
          class e {
            constructor(n) {
              this._doc = n;
            }
            getTitle() {
              return this._doc.title;
            }
            setTitle(n) {
              this._doc.title = n || "";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(et));
            }),
            (e.ɵprov = O({
              token: e,
              factory: function (n) {
                let r = null;
                return (
                  (r = n
                    ? new n()
                    : (function X2() {
                        return new yE(D(et));
                      })()),
                  r
                );
              },
              providedIn: "root",
            })),
            e
          );
        })();
      typeof window < "u" && window;
      let CE = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({
              token: e,
              factory: function (n) {
                let r = null;
                return (r = n ? new (n || e)() : D(bE)), r;
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        bE = (() => {
          class e extends CE {
            constructor(n) {
              super(), (this._doc = n);
            }
            sanitize(n, r) {
              if (null == r) return null;
              switch (n) {
                case Ce.NONE:
                  return r;
                case Ce.HTML:
                  return Rn(r, "HTML")
                    ? Ht(r)
                    : l_(this._doc, String(r)).toString();
                case Ce.STYLE:
                  return Rn(r, "Style") ? Ht(r) : r;
                case Ce.SCRIPT:
                  if (Rn(r, "Script")) return Ht(r);
                  throw new v(5200, !1);
                case Ce.URL:
                  return Rn(r, "URL") ? Ht(r) : yl(String(r));
                case Ce.RESOURCE_URL:
                  if (Rn(r, "ResourceURL")) return Ht(r);
                  throw new v(5201, !1);
                default:
                  throw new v(5202, !1);
              }
            }
            bypassSecurityTrustHtml(n) {
              return (function i1(e) {
                return new XO(e);
              })(n);
            }
            bypassSecurityTrustStyle(n) {
              return (function o1(e) {
                return new JO(e);
              })(n);
            }
            bypassSecurityTrustScript(n) {
              return (function s1(e) {
                return new e1(e);
              })(n);
            }
            bypassSecurityTrustUrl(n) {
              return (function a1(e) {
                return new t1(e);
              })(n);
            }
            bypassSecurityTrustResourceUrl(n) {
              return (function l1(e) {
                return new n1(e);
              })(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(et));
            }),
            (e.ɵprov = O({
              token: e,
              factory: function (n) {
                let r = null;
                return (
                  (r = n
                    ? new n()
                    : (function nB(e) {
                        return new bE(e.get(et));
                      })(D($t))),
                  r
                );
              },
              providedIn: "root",
            })),
            e
          );
        })();
      const { isArray: iB } = Array,
        { getPrototypeOf: oB, prototype: sB, keys: aB } = Object;
      function DE(e) {
        if (1 === e.length) {
          const t = e[0];
          if (iB(t)) return { args: t, keys: null };
          if (
            (function lB(e) {
              return e && "object" == typeof e && oB(e) === sB;
            })(t)
          ) {
            const n = aB(t);
            return { args: n.map((r) => t[r]), keys: n };
          }
        }
        return { args: e, keys: null };
      }
      const { isArray: cB } = Array;
      function EE(e) {
        return te((t) =>
          (function uB(e, t) {
            return cB(t) ? e(...t) : e(t);
          })(e, t)
        );
      }
      function SE(e, t) {
        return e.reduce((n, r, i) => ((n[r] = t[i]), n), {});
      }
      function fp(...e) {
        const t = No(e),
          n = Ku(e),
          { args: r, keys: i } = DE(e);
        if (0 === r.length) return Qe([], t);
        const o = new ve(
          (function dB(e, t, n = Wn) {
            return (r) => {
              ME(
                t,
                () => {
                  const { length: i } = e,
                    o = new Array(i);
                  let s = i,
                    a = i;
                  for (let l = 0; l < i; l++)
                    ME(
                      t,
                      () => {
                        const c = Qe(e[l], t);
                        let u = !1;
                        c.subscribe(
                          _e(
                            r,
                            (d) => {
                              (o[l] = d),
                                u || ((u = !0), a--),
                                a || r.next(n(o.slice()));
                            },
                            () => {
                              --s || r.complete();
                            }
                          )
                        );
                      },
                      r
                    );
                },
                r
              );
            };
          })(r, t, i ? (s) => SE(i, s) : Wn)
        );
        return n ? o.pipe(EE(n)) : o;
      }
      function ME(e, t, n) {
        e ? Kn(n, e, t) : t();
      }
      const _c = ku(
        (e) =>
          function () {
            e(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          }
      );
      function hp(...e) {
        return (function fB() {
          return wi(1);
        })()(Qe(e, No(e)));
      }
      function TE(e) {
        return new ve((t) => {
          at(e()).subscribe(t);
        });
      }
      function ho(e, t) {
        const n = be(e) ? e : () => e,
          r = (i) => i.error(n());
        return new ve(t ? (i) => t.schedule(r, 0, i) : r);
      }
      function pp() {
        return Me((e, t) => {
          let n = null;
          e._refCount++;
          const r = _e(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (n = null);
            const i = e._connection,
              o = n;
            (n = null),
              i && (!o || i === o) && i.unsubscribe(),
              t.unsubscribe();
          });
          e.subscribe(r), r.closed || (n = e.connect());
        });
      }
      class AE extends ve {
        constructor(t, n) {
          super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            Om(t) && (this.lift = t.lift);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: t } = this;
          (this._subject = this._connection = null), t?.unsubscribe();
        }
        connect() {
          let t = this._connection;
          if (!t) {
            t = this._connection = new Rt();
            const n = this.getSubject();
            t.add(
              this.source.subscribe(
                _e(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown()
                )
              )
            ),
              t.closed && ((this._connection = null), (t = Rt.EMPTY));
          }
          return t;
        }
        refCount() {
          return pp()(this);
        }
      }
      function ri(e) {
        return e <= 0
          ? () => dn
          : Me((t, n) => {
              let r = 0;
              t.subscribe(
                _e(n, (i) => {
                  ++r <= e && (n.next(i), e <= r && n.complete());
                })
              );
            });
      }
      function sn(e, t) {
        return Me((n, r) => {
          let i = 0;
          n.subscribe(_e(r, (o) => e.call(t, o, i++) && r.next(o)));
        });
      }
      function Cc(e) {
        return Me((t, n) => {
          let r = !1;
          t.subscribe(
            _e(
              n,
              (i) => {
                (r = !0), n.next(i);
              },
              () => {
                r || n.next(e), n.complete();
              }
            )
          );
        });
      }
      function IE(e = pB) {
        return Me((t, n) => {
          let r = !1;
          t.subscribe(
            _e(
              n,
              (i) => {
                (r = !0), n.next(i);
              },
              () => (r ? n.complete() : n.error(e()))
            )
          );
        });
      }
      function pB() {
        return new _c();
      }
      function ii(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? sn((i, o) => e(i, o, r)) : Wn,
            ri(1),
            n ? Cc(t) : IE(() => new _c())
          );
      }
      function po(e, t) {
        return be(t) ? Ke(e, t, 1) : Ke(e, 1);
      }
      function Ct(e, t, n) {
        const r = be(e) || t || n ? { next: e, error: t, complete: n } : e;
        return r
          ? Me((i, o) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              i.subscribe(
                _e(
                  o,
                  (l) => {
                    var c;
                    null === (c = r.next) || void 0 === c || c.call(r, l),
                      o.next(l);
                  },
                  () => {
                    var l;
                    (a = !1),
                      null === (l = r.complete) || void 0 === l || l.call(r),
                      o.complete();
                  },
                  (l) => {
                    var c;
                    (a = !1),
                      null === (c = r.error) || void 0 === c || c.call(r, l),
                      o.error(l);
                  },
                  () => {
                    var l, c;
                    a &&
                      (null === (l = r.unsubscribe) ||
                        void 0 === l ||
                        l.call(r)),
                      null === (c = r.finalize) || void 0 === c || c.call(r);
                  }
                )
              );
            })
          : Wn;
      }
      function Tr(e) {
        return Me((t, n) => {
          let o,
            r = null,
            i = !1;
          (r = t.subscribe(
            _e(n, void 0, void 0, (s) => {
              (o = at(e(s, Tr(e)(t)))),
                r ? (r.unsubscribe(), (r = null), o.subscribe(n)) : (i = !0);
            })
          )),
            i && (r.unsubscribe(), (r = null), o.subscribe(n));
        });
      }
      function xE(e, t) {
        return Me(
          (function gB(e, t, n, r, i) {
            return (o, s) => {
              let a = n,
                l = t,
                c = 0;
              o.subscribe(
                _e(
                  s,
                  (u) => {
                    const d = c++;
                    (l = a ? e(l, u, d) : ((a = !0), u)), r && s.next(l);
                  },
                  i &&
                    (() => {
                      a && s.next(l), s.complete();
                    })
                )
              );
            };
          })(e, t, arguments.length >= 2, !0)
        );
      }
      function gp(e) {
        return e <= 0
          ? () => dn
          : Me((t, n) => {
              let r = [];
              t.subscribe(
                _e(
                  n,
                  (i) => {
                    r.push(i), e < r.length && r.shift();
                  },
                  () => {
                    for (const i of r) n.next(i);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  }
                )
              );
            });
      }
      function Ps(e) {
        return Me((t, n) => {
          try {
            t.subscribe(n);
          } finally {
            n.add(e);
          }
        });
      }
      const J = "primary",
        Fs = Symbol("RouteTitle");
      class vB {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function go(e) {
        return new vB(e);
      }
      function _B(e, t, n) {
        const r = n.path.split("/");
        if (
          r.length > e.length ||
          ("full" === n.pathMatch && (t.hasChildren() || r.length < e.length))
        )
          return null;
        const i = {};
        for (let o = 0; o < r.length; o++) {
          const s = r[o],
            a = e[o];
          if (s.startsWith(":")) i[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: i };
      }
      function Bn(e, t) {
        const n = e ? Object.keys(e) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let i;
        for (let o = 0; o < n.length; o++)
          if (((i = n[o]), !OE(e[i], t[i]))) return !1;
        return !0;
      }
      function OE(e, t) {
        if (Array.isArray(e) && Array.isArray(t)) {
          if (e.length !== t.length) return !1;
          const n = [...e].sort(),
            r = [...t].sort();
          return n.every((i, o) => r[o] === i);
        }
        return e === t;
      }
      function NE(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function Ar(e) {
        return (function rB(e) {
          return !!e && (e instanceof ve || (be(e.lift) && be(e.subscribe)));
        })(e)
          ? e
          : _s(e)
          ? Qe(Promise.resolve(e))
          : $(e);
      }
      const bB = {
          exact: function FE(e, t, n) {
            if (
              !oi(e.segments, t.segments) ||
              !bc(e.segments, t.segments, n) ||
              e.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children)
              if (!e.children[r] || !FE(e.children[r], t.children[r], n))
                return !1;
            return !0;
          },
          subset: kE,
        },
        RE = {
          exact: function wB(e, t) {
            return Bn(e, t);
          },
          subset: function DB(e, t) {
            return (
              Object.keys(t).length <= Object.keys(e).length &&
              Object.keys(t).every((n) => OE(e[n], t[n]))
            );
          },
          ignored: () => !0,
        };
      function PE(e, t, n) {
        return (
          bB[n.paths](e.root, t.root, n.matrixParams) &&
          RE[n.queryParams](e.queryParams, t.queryParams) &&
          !("exact" === n.fragment && e.fragment !== t.fragment)
        );
      }
      function kE(e, t, n) {
        return LE(e, t, t.segments, n);
      }
      function LE(e, t, n, r) {
        if (e.segments.length > n.length) {
          const i = e.segments.slice(0, n.length);
          return !(!oi(i, n) || t.hasChildren() || !bc(i, n, r));
        }
        if (e.segments.length === n.length) {
          if (!oi(e.segments, n) || !bc(e.segments, n, r)) return !1;
          for (const i in t.children)
            if (!e.children[i] || !kE(e.children[i], t.children[i], r))
              return !1;
          return !0;
        }
        {
          const i = n.slice(0, e.segments.length),
            o = n.slice(e.segments.length);
          return (
            !!(oi(e.segments, i) && bc(e.segments, i, r) && e.children[J]) &&
            LE(e.children[J], t, o, r)
          );
        }
      }
      function bc(e, t, n) {
        return t.every((r, i) => RE[n](e[i].parameters, r.parameters));
      }
      class mo {
        constructor(t = new me([], {}), n = {}, r = null) {
          (this.root = t), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = go(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return MB.serialize(this);
        }
      }
      class me {
        constructor(t, n) {
          (this.segments = t),
            (this.children = n),
            (this.parent = null),
            Object.values(n).forEach((r) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return wc(this);
        }
      }
      class ks {
        constructor(t, n) {
          (this.path = t), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = go(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return jE(this);
        }
      }
      function oi(e, t) {
        return e.length === t.length && e.every((n, r) => n.path === t[r].path);
      }
      let Ls = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({
            token: e,
            factory: function () {
              return new mp();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      class mp {
        parse(t) {
          const n = new LB(t);
          return new mo(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment()
          );
        }
        serialize(t) {
          const n = `/${Vs(t.root, !0)}`,
            r = (function IB(e) {
              const t = Object.keys(e)
                .map((n) => {
                  const r = e[n];
                  return Array.isArray(r)
                    ? r.map((i) => `${Dc(n)}=${Dc(i)}`).join("&")
                    : `${Dc(n)}=${Dc(r)}`;
                })
                .filter((n) => !!n);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams);
          return `${n}${r}${
            "string" == typeof t.fragment
              ? `#${(function TB(e) {
                  return encodeURI(e);
                })(t.fragment)}`
              : ""
          }`;
        }
      }
      const MB = new mp();
      function wc(e) {
        return e.segments.map((t) => jE(t)).join("/");
      }
      function Vs(e, t) {
        if (!e.hasChildren()) return wc(e);
        if (t) {
          const n = e.children[J] ? Vs(e.children[J], !1) : "",
            r = [];
          return (
            Object.entries(e.children).forEach(([i, o]) => {
              i !== J && r.push(`${i}:${Vs(o, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function SB(e, t) {
            let n = [];
            return (
              Object.entries(e.children).forEach(([r, i]) => {
                r === J && (n = n.concat(t(i, r)));
              }),
              Object.entries(e.children).forEach(([r, i]) => {
                r !== J && (n = n.concat(t(i, r)));
              }),
              n
            );
          })(e, (r, i) =>
            i === J ? [Vs(e.children[J], !1)] : [`${i}:${Vs(r, !1)}`]
          );
          return 1 === Object.keys(e.children).length && null != e.children[J]
            ? `${wc(e)}/${n[0]}`
            : `${wc(e)}/(${n.join("//")})`;
        }
      }
      function VE(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function Dc(e) {
        return VE(e).replace(/%3B/gi, ";");
      }
      function yp(e) {
        return VE(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function Ec(e) {
        return decodeURIComponent(e);
      }
      function BE(e) {
        return Ec(e.replace(/\+/g, "%20"));
      }
      function jE(e) {
        return `${yp(e.path)}${(function AB(e) {
          return Object.keys(e)
            .map((t) => `;${yp(t)}=${yp(e[t])}`)
            .join("");
        })(e.parameters)}`;
      }
      const xB = /^[^\/()?;#]+/;
      function vp(e) {
        const t = e.match(xB);
        return t ? t[0] : "";
      }
      const OB = /^[^\/()?;=#]+/,
        RB = /^[^=?&#]+/,
        FB = /^[^&#]+/;
      class LB {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new me([], {})
              : new me([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(n).length > 0) &&
              (r[J] = new me(t, n)),
            r
          );
        }
        parseSegment() {
          const t = vp(this.remaining);
          if ("" === t && this.peekStartsWith(";")) throw new v(4009, !1);
          return this.capture(t), new ks(Ec(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const n = (function NB(e) {
            const t = e.match(OB);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const i = vp(this.remaining);
            i && ((r = i), this.capture(r));
          }
          t[Ec(n)] = Ec(r);
        }
        parseQueryParam(t) {
          const n = (function PB(e) {
            const t = e.match(RB);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function kB(e) {
              const t = e.match(FB);
              return t ? t[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const i = BE(n),
            o = BE(r);
          if (t.hasOwnProperty(i)) {
            let s = t[i];
            Array.isArray(s) || ((s = [s]), (t[i] = s)), s.push(o);
          } else t[i] = o;
        }
        parseParens(t) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = vp(this.remaining),
              i = this.remaining[r.length];
            if ("/" !== i && ")" !== i && ";" !== i) throw new v(4010, !1);
            let o;
            r.indexOf(":") > -1
              ? ((o = r.slice(0, r.indexOf(":"))),
                this.capture(o),
                this.capture(":"))
              : t && (o = J);
            const s = this.parseChildren();
            (n[o] = 1 === Object.keys(s).length ? s[J] : new me([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new v(4011, !1);
        }
      }
      function HE(e) {
        return e.segments.length > 0 ? new me([], { [J]: e }) : e;
      }
      function UE(e) {
        const t = {};
        for (const r of Object.keys(e.children)) {
          const o = UE(e.children[r]);
          if (r === J && 0 === o.segments.length && o.hasChildren())
            for (const [s, a] of Object.entries(o.children)) t[s] = a;
          else (o.segments.length > 0 || o.hasChildren()) && (t[r] = o);
        }
        return (function VB(e) {
          if (1 === e.numberOfChildren && e.children[J]) {
            const t = e.children[J];
            return new me(e.segments.concat(t.segments), t.children);
          }
          return e;
        })(new me(e.segments, t));
      }
      function si(e) {
        return e instanceof mo;
      }
      function $E(e) {
        let t;
        const i = HE(
          (function n(o) {
            const s = {};
            for (const l of o.children) {
              const c = n(l);
              s[l.outlet] = c;
            }
            const a = new me(o.url, s);
            return o === e && (t = a), a;
          })(e.root)
        );
        return t ?? i;
      }
      function zE(e, t, n, r) {
        let i = e;
        for (; i.parent; ) i = i.parent;
        if (0 === t.length) return _p(i, i, i, n, r);
        const o = (function jB(e) {
          if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
            return new GE(!0, 0, e);
          let t = 0,
            n = !1;
          const r = e.reduce((i, o, s) => {
            if ("object" == typeof o && null != o) {
              if (o.outlets) {
                const a = {};
                return (
                  Object.entries(o.outlets).forEach(([l, c]) => {
                    a[l] = "string" == typeof c ? c.split("/") : c;
                  }),
                  [...i, { outlets: a }]
                );
              }
              if (o.segmentPath) return [...i, o.segmentPath];
            }
            return "string" != typeof o
              ? [...i, o]
              : 0 === s
              ? (o.split("/").forEach((a, l) => {
                  (0 == l && "." === a) ||
                    (0 == l && "" === a
                      ? (n = !0)
                      : ".." === a
                      ? t++
                      : "" != a && i.push(a));
                }),
                i)
              : [...i, o];
          }, []);
          return new GE(n, t, r);
        })(t);
        if (o.toRoot()) return _p(i, i, new me([], {}), n, r);
        const s = (function HB(e, t, n) {
            if (e.isAbsolute) return new Mc(t, !0, 0);
            if (!n) return new Mc(t, !1, NaN);
            if (null === n.parent) return new Mc(n, !0, 0);
            const r = Sc(e.commands[0]) ? 0 : 1;
            return (function UB(e, t, n) {
              let r = e,
                i = t,
                o = n;
              for (; o > i; ) {
                if (((o -= i), (r = r.parent), !r)) throw new v(4005, !1);
                i = r.segments.length;
              }
              return new Mc(r, !1, i - o);
            })(n, n.segments.length - 1 + r, e.numberOfDoubleDots);
          })(o, i, e),
          a = s.processChildren
            ? js(s.segmentGroup, s.index, o.commands)
            : WE(s.segmentGroup, s.index, o.commands);
        return _p(i, s.segmentGroup, a, n, r);
      }
      function Sc(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function Bs(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function _p(e, t, n, r, i) {
        let s,
          o = {};
        r &&
          Object.entries(r).forEach(([l, c]) => {
            o[l] = Array.isArray(c) ? c.map((u) => `${u}`) : `${c}`;
          }),
          (s = e === t ? n : qE(e, t, n));
        const a = HE(UE(s));
        return new mo(a, o, i);
      }
      function qE(e, t, n) {
        const r = {};
        return (
          Object.entries(e.children).forEach(([i, o]) => {
            r[i] = o === t ? n : qE(o, t, n);
          }),
          new me(e.segments, r)
        );
      }
      class GE {
        constructor(t, n, r) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            t && r.length > 0 && Sc(r[0]))
          )
            throw new v(4003, !1);
          const i = r.find(Bs);
          if (i && i !== NE(r)) throw new v(4004, !1);
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class Mc {
        constructor(t, n, r) {
          (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
        }
      }
      function WE(e, t, n) {
        if (
          (e || (e = new me([], {})),
          0 === e.segments.length && e.hasChildren())
        )
          return js(e, t, n);
        const r = (function zB(e, t, n) {
            let r = 0,
              i = t;
            const o = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; i < e.segments.length; ) {
              if (r >= n.length) return o;
              const s = e.segments[i],
                a = n[r];
              if (Bs(a)) break;
              const l = `${a}`,
                c = r < n.length - 1 ? n[r + 1] : null;
              if (i > 0 && void 0 === l) break;
              if (l && c && "object" == typeof c && void 0 === c.outlets) {
                if (!QE(l, c, s)) return o;
                r += 2;
              } else {
                if (!QE(l, {}, s)) return o;
                r++;
              }
              i++;
            }
            return { match: !0, pathIndex: i, commandIndex: r };
          })(e, t, n),
          i = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const o = new me(e.segments.slice(0, r.pathIndex), {});
          return (
            (o.children[J] = new me(e.segments.slice(r.pathIndex), e.children)),
            js(o, 0, i)
          );
        }
        return r.match && 0 === i.length
          ? new me(e.segments, {})
          : r.match && !e.hasChildren()
          ? Cp(e, t, n)
          : r.match
          ? js(e, 0, i)
          : Cp(e, t, n);
      }
      function js(e, t, n) {
        if (0 === n.length) return new me(e.segments, {});
        {
          const r = (function $B(e) {
              return Bs(e[0]) ? e[0].outlets : { [J]: e };
            })(n),
            i = {};
          if (
            !r[J] &&
            e.children[J] &&
            1 === e.numberOfChildren &&
            0 === e.children[J].segments.length
          ) {
            const o = js(e.children[J], t, n);
            return new me(e.segments, o.children);
          }
          return (
            Object.entries(r).forEach(([o, s]) => {
              "string" == typeof s && (s = [s]),
                null !== s && (i[o] = WE(e.children[o], t, s));
            }),
            Object.entries(e.children).forEach(([o, s]) => {
              void 0 === r[o] && (i[o] = s);
            }),
            new me(e.segments, i)
          );
        }
      }
      function Cp(e, t, n) {
        const r = e.segments.slice(0, t);
        let i = 0;
        for (; i < n.length; ) {
          const o = n[i];
          if (Bs(o)) {
            const l = qB(o.outlets);
            return new me(r, l);
          }
          if (0 === i && Sc(n[0])) {
            r.push(new ks(e.segments[t].path, KE(n[0]))), i++;
            continue;
          }
          const s = Bs(o) ? o.outlets[J] : `${o}`,
            a = i < n.length - 1 ? n[i + 1] : null;
          s && a && Sc(a)
            ? (r.push(new ks(s, KE(a))), (i += 2))
            : (r.push(new ks(s, {})), i++);
        }
        return new me(r, {});
      }
      function qB(e) {
        const t = {};
        return (
          Object.entries(e).forEach(([n, r]) => {
            "string" == typeof r && (r = [r]),
              null !== r && (t[n] = Cp(new me([], {}), 0, r));
          }),
          t
        );
      }
      function KE(e) {
        const t = {};
        return Object.entries(e).forEach(([n, r]) => (t[n] = `${r}`)), t;
      }
      function QE(e, t, n) {
        return e == n.path && Bn(t, n.parameters);
      }
      const Hs = "imperative";
      class jn {
        constructor(t, n) {
          (this.id = t), (this.url = n);
        }
      }
      class bp extends jn {
        constructor(t, n, r = "imperative", i = null) {
          super(t, n),
            (this.type = 0),
            (this.navigationTrigger = r),
            (this.restoredState = i);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class ai extends jn {
        constructor(t, n, r) {
          super(t, n), (this.urlAfterRedirects = r), (this.type = 1);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class Tc extends jn {
        constructor(t, n, r, i) {
          super(t, n), (this.reason = r), (this.code = i), (this.type = 2);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Us extends jn {
        constructor(t, n, r, i) {
          super(t, n), (this.reason = r), (this.code = i), (this.type = 16);
        }
      }
      class wp extends jn {
        constructor(t, n, r, i) {
          super(t, n), (this.error = r), (this.target = i), (this.type = 3);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class GB extends jn {
        constructor(t, n, r, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 4);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class WB extends jn {
        constructor(t, n, r, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 7);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class KB extends jn {
        constructor(t, n, r, i, o) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.shouldActivate = o),
            (this.type = 8);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class QB extends jn {
        constructor(t, n, r, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 5);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class ZB extends jn {
        constructor(t, n, r, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = i),
            (this.type = 6);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class YB {
        constructor(t) {
          (this.route = t), (this.type = 9);
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class XB {
        constructor(t) {
          (this.route = t), (this.type = 10);
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class JB {
        constructor(t) {
          (this.snapshot = t), (this.type = 11);
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class ej {
        constructor(t) {
          (this.snapshot = t), (this.type = 12);
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class tj {
        constructor(t) {
          (this.snapshot = t), (this.type = 13);
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class nj {
        constructor(t) {
          (this.snapshot = t), (this.type = 14);
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class ZE {
        constructor(t, n, r) {
          (this.routerEvent = t),
            (this.position = n),
            (this.anchor = r),
            (this.type = 15);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      class rj {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.injector = null),
            (this.children = new $s()),
            (this.attachRef = null);
        }
      }
      let $s = (() => {
        class e {
          constructor() {
            this.contexts = new Map();
          }
          onChildOutletCreated(n, r) {
            const i = this.getOrCreateContext(n);
            (i.outlet = r), this.contexts.set(n, i);
          }
          onChildOutletDestroyed(n) {
            const r = this.getContext(n);
            r && ((r.outlet = null), (r.attachRef = null));
          }
          onOutletDeactivated() {
            const n = this.contexts;
            return (this.contexts = new Map()), n;
          }
          onOutletReAttached(n) {
            this.contexts = n;
          }
          getOrCreateContext(n) {
            let r = this.getContext(n);
            return r || ((r = new rj()), this.contexts.set(n, r)), r;
          }
          getContext(n) {
            return this.contexts.get(n) || null;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      class YE {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const n = this.pathFromRoot(t);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(t) {
          const n = Dp(t, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(t) {
          const n = Dp(t, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(t) {
          const n = Ep(t, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((i) => i.value)
                .filter((i) => i !== t);
        }
        pathFromRoot(t) {
          return Ep(t, this._root).map((n) => n.value);
        }
      }
      function Dp(e, t) {
        if (e === t.value) return t;
        for (const n of t.children) {
          const r = Dp(e, n);
          if (r) return r;
        }
        return null;
      }
      function Ep(e, t) {
        if (e === t.value) return [t];
        for (const n of t.children) {
          const r = Ep(e, n);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class ur {
        constructor(t, n) {
          (this.value = t), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function yo(e) {
        const t = {};
        return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
      }
      class XE extends YE {
        constructor(t, n) {
          super(t), (this.snapshot = n), Sp(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function JE(e, t) {
        const n = (function ij(e, t) {
            const s = new Ac([], {}, {}, "", {}, J, t, null, {});
            return new t0("", new ur(s, []));
          })(0, t),
          r = new gt([new ks("", {})]),
          i = new gt({}),
          o = new gt({}),
          s = new gt({}),
          a = new gt(""),
          l = new li(r, i, s, a, o, J, t, n.root);
        return (l.snapshot = n.root), new XE(new ur(l, []), n);
      }
      class li {
        constructor(t, n, r, i, o, s, a, l) {
          (this.urlSubject = t),
            (this.paramsSubject = n),
            (this.queryParamsSubject = r),
            (this.fragmentSubject = i),
            (this.dataSubject = o),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = l),
            (this.title =
              this.dataSubject?.pipe(te((c) => c[Fs])) ?? $(void 0)),
            (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(te((t) => go(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(te((t) => go(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function e0(e, t = "emptyOnly") {
        const n = e.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = n.length - 1; r >= 1; ) {
            const i = n[r],
              o = n[r - 1];
            if (i.routeConfig && "" === i.routeConfig.path) r--;
            else {
              if (o.component) break;
              r--;
            }
          }
        return (function oj(e) {
          return e.reduce(
            (t, n) => ({
              params: { ...t.params, ...n.params },
              data: { ...t.data, ...n.data },
              resolve: {
                ...n.data,
                ...t.resolve,
                ...n.routeConfig?.data,
                ...n._resolvedData,
              },
            }),
            { params: {}, data: {}, resolve: {} }
          );
        })(n.slice(r));
      }
      class Ac {
        get title() {
          return this.data?.[Fs];
        }
        constructor(t, n, r, i, o, s, a, l, c) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = i),
            (this.data = o),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = l),
            (this._resolve = c);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = go(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = go(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class t0 extends YE {
        constructor(t, n) {
          super(n), (this.url = t), Sp(this, n);
        }
        toString() {
          return n0(this._root);
        }
      }
      function Sp(e, t) {
        (t.value._routerState = e), t.children.forEach((n) => Sp(e, n));
      }
      function n0(e) {
        const t =
          e.children.length > 0 ? ` { ${e.children.map(n0).join(", ")} } ` : "";
        return `${e.value}${t}`;
      }
      function Mp(e) {
        if (e.snapshot) {
          const t = e.snapshot,
            n = e._futureSnapshot;
          (e.snapshot = n),
            Bn(t.queryParams, n.queryParams) ||
              e.queryParamsSubject.next(n.queryParams),
            t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment),
            Bn(t.params, n.params) || e.paramsSubject.next(n.params),
            (function CB(e, t) {
              if (e.length !== t.length) return !1;
              for (let n = 0; n < e.length; ++n) if (!Bn(e[n], t[n])) return !1;
              return !0;
            })(t.url, n.url) || e.urlSubject.next(n.url),
            Bn(t.data, n.data) || e.dataSubject.next(n.data);
        } else
          (e.snapshot = e._futureSnapshot),
            e.dataSubject.next(e._futureSnapshot.data);
      }
      function Tp(e, t) {
        const n =
          Bn(e.params, t.params) &&
          (function EB(e, t) {
            return (
              oi(e, t) && e.every((n, r) => Bn(n.parameters, t[r].parameters))
            );
          })(e.url, t.url);
        return (
          n &&
          !(!e.parent != !t.parent) &&
          (!e.parent || Tp(e.parent, t.parent))
        );
      }
      let Ic = (() => {
        class e {
          constructor() {
            (this.activated = null),
              (this._activatedRoute = null),
              (this.name = J),
              (this.activateEvents = new Pe()),
              (this.deactivateEvents = new Pe()),
              (this.attachEvents = new Pe()),
              (this.detachEvents = new Pe()),
              (this.parentContexts = M($s)),
              (this.location = M(yn)),
              (this.changeDetector = M(tc)),
              (this.environmentInjector = M(Pn)),
              (this.inputBinder = M(xc, { optional: !0 })),
              (this.supportsBindingToComponentInputs = !0);
          }
          get activatedComponentRef() {
            return this.activated;
          }
          ngOnChanges(n) {
            if (n.name) {
              const { firstChange: r, previousValue: i } = n.name;
              if (r) return;
              this.isTrackedInParentContexts(i) &&
                (this.deactivate(),
                this.parentContexts.onChildOutletDestroyed(i)),
                this.initializeOutletWithName();
            }
          }
          ngOnDestroy() {
            this.isTrackedInParentContexts(this.name) &&
              this.parentContexts.onChildOutletDestroyed(this.name),
              this.inputBinder?.unsubscribeFromRouteData(this);
          }
          isTrackedInParentContexts(n) {
            return this.parentContexts.getContext(n)?.outlet === this;
          }
          ngOnInit() {
            this.initializeOutletWithName();
          }
          initializeOutletWithName() {
            if (
              (this.parentContexts.onChildOutletCreated(this.name, this),
              this.activated)
            )
              return;
            const n = this.parentContexts.getContext(this.name);
            n?.route &&
              (n.attachRef
                ? this.attach(n.attachRef, n.route)
                : this.activateWith(n.route, n.injector));
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new v(4012, !1);
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new v(4012, !1);
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new v(4012, !1);
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated) throw new v(4013, !1);
            this._activatedRoute = n;
            const i = this.location,
              s = n.snapshot.component,
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new sj(n, a, i.injector);
            (this.activated = i.createComponent(s, {
              index: i.length,
              injector: l,
              environmentInjector: r ?? this.environmentInjector,
            })),
              this.changeDetector.markForCheck(),
              this.inputBinder?.bindActivatedRouteToOutletComponent(this),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵdir = W({
            type: e,
            selectors: [["router-outlet"]],
            inputs: { name: "name" },
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
            standalone: !0,
            features: [Jt],
          })),
          e
        );
      })();
      class sj {
        constructor(t, n, r) {
          (this.route = t), (this.childContexts = n), (this.parent = r);
        }
        get(t, n) {
          return t === li
            ? this.route
            : t === $s
            ? this.childContexts
            : this.parent.get(t, n);
        }
      }
      const xc = new S("");
      let r0 = (() => {
        class e {
          constructor() {
            this.outletDataSubscriptions = new Map();
          }
          bindActivatedRouteToOutletComponent(n) {
            this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n);
          }
          unsubscribeFromRouteData(n) {
            this.outletDataSubscriptions.get(n)?.unsubscribe(),
              this.outletDataSubscriptions.delete(n);
          }
          subscribeToRouteData(n) {
            const { activatedRoute: r } = n,
              i = fp([r.queryParams, r.params, r.data])
                .pipe(
                  Zt(
                    ([o, s, a], l) => (
                      (a = { ...o, ...s, ...a }),
                      0 === l ? $(a) : Promise.resolve(a)
                    )
                  )
                )
                .subscribe((o) => {
                  if (
                    !n.isActivated ||
                    !n.activatedComponentRef ||
                    n.activatedRoute !== r ||
                    null === r.component
                  )
                    return void this.unsubscribeFromRouteData(n);
                  const s = (function kL(e) {
                    const t = ce(e);
                    if (!t) return null;
                    const n = new fs(t);
                    return {
                      get selector() {
                        return n.selector;
                      },
                      get type() {
                        return n.componentType;
                      },
                      get inputs() {
                        return n.inputs;
                      },
                      get outputs() {
                        return n.outputs;
                      },
                      get ngContentSelectors() {
                        return n.ngContentSelectors;
                      },
                      get isStandalone() {
                        return t.standalone;
                      },
                      get isSignal() {
                        return t.signals;
                      },
                    };
                  })(r.component);
                  if (s)
                    for (const { templateName: a } of s.inputs)
                      n.activatedComponentRef.setInput(a, o[a]);
                  else this.unsubscribeFromRouteData(n);
                });
            this.outletDataSubscriptions.set(n, i);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function zs(e, t, n) {
        if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = t.value;
          const i = (function lj(e, t, n) {
            return t.children.map((r) => {
              for (const i of n.children)
                if (e.shouldReuseRoute(r.value, i.value.snapshot))
                  return zs(e, r, i);
              return zs(e, r);
            });
          })(e, t, n);
          return new ur(r, i);
        }
        {
          if (e.shouldAttach(t.value)) {
            const o = e.retrieve(t.value);
            if (null !== o) {
              const s = o.route;
              return (
                (s.value._futureSnapshot = t.value),
                (s.children = t.children.map((a) => zs(e, a))),
                s
              );
            }
          }
          const r = (function cj(e) {
              return new li(
                new gt(e.url),
                new gt(e.params),
                new gt(e.queryParams),
                new gt(e.fragment),
                new gt(e.data),
                e.outlet,
                e.component,
                e
              );
            })(t.value),
            i = t.children.map((o) => zs(e, o));
          return new ur(r, i);
        }
      }
      const Ap = "ngNavigationCancelingError";
      function o0(e, t) {
        const { redirectTo: n, navigationBehaviorOptions: r } = si(t)
            ? { redirectTo: t, navigationBehaviorOptions: void 0 }
            : t,
          i = s0(!1, 0, t);
        return (i.url = n), (i.navigationBehaviorOptions = r), i;
      }
      function s0(e, t, n) {
        const r = new Error("NavigationCancelingError: " + (e || ""));
        return (r[Ap] = !0), (r.cancellationCode = t), n && (r.url = n), r;
      }
      function a0(e) {
        return l0(e) && si(e.url);
      }
      function l0(e) {
        return e && e[Ap];
      }
      let c0 = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = Xt({
            type: e,
            selectors: [["ng-component"]],
            standalone: !0,
            features: [Wl],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && se(0, "router-outlet");
            },
            dependencies: [Ic],
            encapsulation: 2,
          })),
          e
        );
      })();
      function Ip(e) {
        const t = e.children && e.children.map(Ip),
          n = t ? { ...e, children: t } : { ...e };
        return (
          !n.component &&
            !n.loadComponent &&
            (t || n.loadChildren) &&
            n.outlet &&
            n.outlet !== J &&
            (n.component = c0),
          n
        );
      }
      function bn(e) {
        return e.outlet || J;
      }
      function qs(e) {
        if (!e) return null;
        if (e.routeConfig?._injector) return e.routeConfig._injector;
        for (let t = e.parent; t; t = t.parent) {
          const n = t.routeConfig;
          if (n?._loadedInjector) return n._loadedInjector;
          if (n?._injector) return n._injector;
        }
        return null;
      }
      class mj {
        constructor(t, n, r, i, o) {
          (this.routeReuseStrategy = t),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = i),
            (this.inputBindingEnabled = o);
        }
        activate(t) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, t),
            Mp(this.futureState.root),
            this.activateChildRoutes(n, r, t);
        }
        deactivateChildRoutes(t, n, r) {
          const i = yo(n);
          t.children.forEach((o) => {
            const s = o.value.outlet;
            this.deactivateRoutes(o, i[s], r), delete i[s];
          }),
            Object.values(i).forEach((o) => {
              this.deactivateRouteAndItsChildren(o, r);
            });
        }
        deactivateRoutes(t, n, r) {
          const i = t.value,
            o = n ? n.value : null;
          if (i === o)
            if (i.component) {
              const s = r.getContext(i.outlet);
              s && this.deactivateChildRoutes(t, n, s.children);
            } else this.deactivateChildRoutes(t, n, r);
          else o && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(t, n) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, n)
            : this.deactivateRouteAndOutlet(t, n);
        }
        detachAndStoreRouteSubtree(t, n) {
          const r = n.getContext(t.value.outlet),
            i = r && t.value.component ? r.children : n,
            o = yo(t);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: s,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, n) {
          const r = n.getContext(t.value.outlet),
            i = r && t.value.component ? r.children : n,
            o = yo(t);
          for (const s of Object.keys(o))
            this.deactivateRouteAndItsChildren(o[s], i);
          r &&
            (r.outlet &&
              (r.outlet.deactivate(), r.children.onOutletDeactivated()),
            (r.attachRef = null),
            (r.route = null));
        }
        activateChildRoutes(t, n, r) {
          const i = yo(n);
          t.children.forEach((o) => {
            this.activateRoutes(o, i[o.value.outlet], r),
              this.forwardEvent(new nj(o.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new ej(t.value.snapshot));
        }
        activateRoutes(t, n, r) {
          const i = t.value,
            o = n ? n.value : null;
          if ((Mp(i), i === o))
            if (i.component) {
              const s = r.getOrCreateContext(i.outlet);
              this.activateChildRoutes(t, n, s.children);
            } else this.activateChildRoutes(t, n, r);
          else if (i.component) {
            const s = r.getOrCreateContext(i.outlet);
            if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(i.snapshot);
              this.routeReuseStrategy.store(i.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                Mp(a.route.value),
                this.activateChildRoutes(t, null, s.children);
            } else {
              const a = qs(i.snapshot);
              (s.attachRef = null),
                (s.route = i),
                (s.injector = a),
                s.outlet && s.outlet.activateWith(i, s.injector),
                this.activateChildRoutes(t, null, s.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class u0 {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class Oc {
        constructor(t, n) {
          (this.component = t), (this.route = n);
        }
      }
      function yj(e, t, n) {
        const r = e._root;
        return Gs(r, t ? t._root : null, n, [r.value]);
      }
      function vo(e, t) {
        const n = Symbol(),
          r = t.get(e, n);
        return r === n
          ? "function" != typeof e ||
            (function yI(e) {
              return null !== xa(e);
            })(e)
            ? t.get(e)
            : e
          : r;
      }
      function Gs(
        e,
        t,
        n,
        r,
        i = { canDeactivateChecks: [], canActivateChecks: [] }
      ) {
        const o = yo(t);
        return (
          e.children.forEach((s) => {
            (function _j(
              e,
              t,
              n,
              r,
              i = { canDeactivateChecks: [], canActivateChecks: [] }
            ) {
              const o = e.value,
                s = t ? t.value : null,
                a = n ? n.getContext(e.value.outlet) : null;
              if (s && o.routeConfig === s.routeConfig) {
                const l = (function Cj(e, t, n) {
                  if ("function" == typeof n) return n(e, t);
                  switch (n) {
                    case "pathParamsChange":
                      return !oi(e.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !oi(e.url, t.url) || !Bn(e.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !Tp(e, t) || !Bn(e.queryParams, t.queryParams);
                    default:
                      return !Tp(e, t);
                  }
                })(s, o, o.routeConfig.runGuardsAndResolvers);
                l
                  ? i.canActivateChecks.push(new u0(r))
                  : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
                  Gs(e, t, o.component ? (a ? a.children : null) : n, r, i),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    i.canDeactivateChecks.push(new Oc(a.outlet.component, s));
              } else
                s && Ws(t, a, i),
                  i.canActivateChecks.push(new u0(r)),
                  Gs(e, null, o.component ? (a ? a.children : null) : n, r, i);
            })(s, o[s.value.outlet], n, r.concat([s.value]), i),
              delete o[s.value.outlet];
          }),
          Object.entries(o).forEach(([s, a]) => Ws(a, n.getContext(s), i)),
          i
        );
      }
      function Ws(e, t, n) {
        const r = yo(e),
          i = e.value;
        Object.entries(r).forEach(([o, s]) => {
          Ws(s, i.component ? (t ? t.children.getContext(o) : null) : t, n);
        }),
          n.canDeactivateChecks.push(
            new Oc(
              i.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              i
            )
          );
      }
      function Ks(e) {
        return "function" == typeof e;
      }
      function d0(e) {
        return e instanceof _c || "EmptyError" === e?.name;
      }
      const Nc = Symbol("INITIAL_VALUE");
      function _o() {
        return Zt((e) =>
          fp(
            e.map((t) =>
              t.pipe(
                ri(1),
                (function hB(...e) {
                  const t = No(e);
                  return Me((n, r) => {
                    (t ? hp(e, n, t) : hp(e, n)).subscribe(r);
                  });
                })(Nc)
              )
            )
          ).pipe(
            te((t) => {
              for (const n of t)
                if (!0 !== n) {
                  if (n === Nc) return Nc;
                  if (!1 === n || n instanceof mo) return n;
                }
              return !0;
            }),
            sn((t) => t !== Nc),
            ri(1)
          )
        );
      }
      function f0(e) {
        return (function SA(...e) {
          return Am(e);
        })(
          Ct((t) => {
            if (si(t)) throw o0(0, t);
          }),
          te((t) => !0 === t)
        );
      }
      class Rc {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class h0 {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function Co(e) {
        return ho(new Rc(e));
      }
      function p0(e) {
        return ho(new h0(e));
      }
      class jj {
        constructor(t, n) {
          (this.urlSerializer = t), (this.urlTree = n);
        }
        noMatchError(t) {
          return new v(4002, !1);
        }
        lineralizeSegments(t, n) {
          let r = [],
            i = n.root;
          for (;;) {
            if (((r = r.concat(i.segments)), 0 === i.numberOfChildren))
              return $(r);
            if (i.numberOfChildren > 1 || !i.children[J])
              return ho(new v(4e3, !1));
            i = i.children[J];
          }
        }
        applyRedirectCommands(t, n, r) {
          return this.applyRedirectCreateUrlTree(
            n,
            this.urlSerializer.parse(n),
            t,
            r
          );
        }
        applyRedirectCreateUrlTree(t, n, r, i) {
          const o = this.createSegmentGroup(t, n.root, r, i);
          return new mo(
            o,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment
          );
        }
        createQueryParams(t, n) {
          const r = {};
          return (
            Object.entries(t).forEach(([i, o]) => {
              if ("string" == typeof o && o.startsWith(":")) {
                const a = o.substring(1);
                r[i] = n[a];
              } else r[i] = o;
            }),
            r
          );
        }
        createSegmentGroup(t, n, r, i) {
          const o = this.createSegments(t, n.segments, r, i);
          let s = {};
          return (
            Object.entries(n.children).forEach(([a, l]) => {
              s[a] = this.createSegmentGroup(t, l, r, i);
            }),
            new me(o, s)
          );
        }
        createSegments(t, n, r, i) {
          return n.map((o) =>
            o.path.startsWith(":")
              ? this.findPosParam(t, o, i)
              : this.findOrReturn(o, r)
          );
        }
        findPosParam(t, n, r) {
          const i = r[n.path.substring(1)];
          if (!i) throw new v(4001, !1);
          return i;
        }
        findOrReturn(t, n) {
          let r = 0;
          for (const i of n) {
            if (i.path === t.path) return n.splice(r), i;
            r++;
          }
          return t;
        }
      }
      const xp = {
        matched: !1,
        consumedSegments: [],
        remainingSegments: [],
        parameters: {},
        positionalParamSegments: {},
      };
      function Hj(e, t, n, r, i) {
        const o = Op(e, t, n);
        return o.matched
          ? ((r = (function uj(e, t) {
              return (
                e.providers &&
                  !e._injector &&
                  (e._injector = rh(e.providers, t, `Route: ${e.path}`)),
                e._injector ?? t
              );
            })(t, r)),
            (function Lj(e, t, n, r) {
              const i = t.canMatch;
              return i && 0 !== i.length
                ? $(
                    i.map((s) => {
                      const a = vo(s, e);
                      return Ar(
                        (function Mj(e) {
                          return e && Ks(e.canMatch);
                        })(a)
                          ? a.canMatch(t, n)
                          : e.runInContext(() => a(t, n))
                      );
                    })
                  ).pipe(_o(), f0())
                : $(!0);
            })(r, t, n).pipe(te((s) => (!0 === s ? o : { ...xp }))))
          : $(o);
      }
      function Op(e, t, n) {
        if ("" === t.path)
          return "full" === t.pathMatch && (e.hasChildren() || n.length > 0)
            ? { ...xp }
            : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {},
              };
        const i = (t.matcher || _B)(n, e, t);
        if (!i) return { ...xp };
        const o = {};
        Object.entries(i.posParams ?? {}).forEach(([a, l]) => {
          o[a] = l.path;
        });
        const s =
          i.consumed.length > 0
            ? { ...o, ...i.consumed[i.consumed.length - 1].parameters }
            : o;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          remainingSegments: n.slice(i.consumed.length),
          parameters: s,
          positionalParamSegments: i.posParams ?? {},
        };
      }
      function g0(e, t, n, r) {
        return n.length > 0 &&
          (function zj(e, t, n) {
            return n.some((r) => Pc(e, t, r) && bn(r) !== J);
          })(e, n, r)
          ? {
              segmentGroup: new me(t, $j(r, new me(n, e.children))),
              slicedSegments: [],
            }
          : 0 === n.length &&
            (function qj(e, t, n) {
              return n.some((r) => Pc(e, t, r));
            })(e, n, r)
          ? {
              segmentGroup: new me(e.segments, Uj(e, 0, n, r, e.children)),
              slicedSegments: n,
            }
          : { segmentGroup: new me(e.segments, e.children), slicedSegments: n };
      }
      function Uj(e, t, n, r, i) {
        const o = {};
        for (const s of r)
          if (Pc(e, n, s) && !i[bn(s)]) {
            const a = new me([], {});
            o[bn(s)] = a;
          }
        return { ...i, ...o };
      }
      function $j(e, t) {
        const n = {};
        n[J] = t;
        for (const r of e)
          if ("" === r.path && bn(r) !== J) {
            const i = new me([], {});
            n[bn(r)] = i;
          }
        return n;
      }
      function Pc(e, t, n) {
        return (
          (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      class Qj {
        constructor(t, n, r, i, o, s, a) {
          (this.injector = t),
            (this.configLoader = n),
            (this.rootComponentType = r),
            (this.config = i),
            (this.urlTree = o),
            (this.paramsInheritanceStrategy = s),
            (this.urlSerializer = a),
            (this.allowRedirects = !0),
            (this.applyRedirects = new jj(this.urlSerializer, this.urlTree));
        }
        noMatchError(t) {
          return new v(4002, !1);
        }
        recognize() {
          const t = g0(this.urlTree.root, [], [], this.config).segmentGroup;
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t,
            J
          ).pipe(
            Tr((n) => {
              if (n instanceof h0)
                return (
                  (this.allowRedirects = !1),
                  (this.urlTree = n.urlTree),
                  this.match(n.urlTree)
                );
              throw n instanceof Rc ? this.noMatchError(n) : n;
            }),
            te((n) => {
              const r = new Ac(
                  [],
                  Object.freeze({}),
                  Object.freeze({ ...this.urlTree.queryParams }),
                  this.urlTree.fragment,
                  {},
                  J,
                  this.rootComponentType,
                  null,
                  {}
                ),
                i = new ur(r, n),
                o = new t0("", i),
                s = (function BB(e, t, n = null, r = null) {
                  return zE($E(e), t, n, r);
                })(r, [], this.urlTree.queryParams, this.urlTree.fragment);
              return (
                (s.queryParams = this.urlTree.queryParams),
                (o.url = this.urlSerializer.serialize(s)),
                this.inheritParamsAndData(o._root),
                { state: o, tree: s }
              );
            })
          );
        }
        match(t) {
          return this.processSegmentGroup(
            this.injector,
            this.config,
            t.root,
            J
          ).pipe(
            Tr((r) => {
              throw r instanceof Rc ? this.noMatchError(r) : r;
            })
          );
        }
        inheritParamsAndData(t) {
          const n = t.value,
            r = e0(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            t.children.forEach((i) => this.inheritParamsAndData(i));
        }
        processSegmentGroup(t, n, r, i) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.processChildren(t, n, r)
            : this.processSegment(t, n, r, r.segments, i, !0);
        }
        processChildren(t, n, r) {
          const i = [];
          for (const o of Object.keys(r.children))
            "primary" === o ? i.unshift(o) : i.push(o);
          return Qe(i).pipe(
            po((o) => {
              const s = r.children[o],
                a = (function pj(e, t) {
                  const n = e.filter((r) => bn(r) === t);
                  return n.push(...e.filter((r) => bn(r) !== t)), n;
                })(n, o);
              return this.processSegmentGroup(t, a, s, o);
            }),
            xE((o, s) => (o.push(...s), o)),
            Cc(null),
            (function mB(e, t) {
              const n = arguments.length >= 2;
              return (r) =>
                r.pipe(
                  e ? sn((i, o) => e(i, o, r)) : Wn,
                  gp(1),
                  n ? Cc(t) : IE(() => new _c())
                );
            })(),
            Ke((o) => {
              if (null === o) return Co(r);
              const s = m0(o);
              return (
                (function Zj(e) {
                  e.sort((t, n) =>
                    t.value.outlet === J
                      ? -1
                      : n.value.outlet === J
                      ? 1
                      : t.value.outlet.localeCompare(n.value.outlet)
                  );
                })(s),
                $(s)
              );
            })
          );
        }
        processSegment(t, n, r, i, o, s) {
          return Qe(n).pipe(
            po((a) =>
              this.processSegmentAgainstRoute(
                a._injector ?? t,
                n,
                a,
                r,
                i,
                o,
                s
              ).pipe(
                Tr((l) => {
                  if (l instanceof Rc) return $(null);
                  throw l;
                })
              )
            ),
            ii((a) => !!a),
            Tr((a) => {
              if (d0(a))
                return (function Wj(e, t, n) {
                  return 0 === t.length && !e.children[n];
                })(r, i, o)
                  ? $([])
                  : Co(r);
              throw a;
            })
          );
        }
        processSegmentAgainstRoute(t, n, r, i, o, s, a) {
          return (function Gj(e, t, n, r) {
            return (
              !!(bn(e) === r || (r !== J && Pc(t, n, e))) &&
              ("**" === e.path || Op(t, e, n).matched)
            );
          })(r, i, o, s)
            ? void 0 === r.redirectTo
              ? this.matchSegmentAgainstRoute(t, i, r, o, s, a)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, i, n, r, o, s)
              : Co(i)
            : Co(i);
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s) {
          return "**" === i.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, i, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                n,
                r,
                i,
                o,
                s
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, i) {
          const o = this.applyRedirects.applyRedirectCommands(
            [],
            r.redirectTo,
            {}
          );
          return r.redirectTo.startsWith("/")
            ? p0(o)
            : this.applyRedirects.lineralizeSegments(r, o).pipe(
                Ke((s) => {
                  const a = new me(s, {});
                  return this.processSegment(t, n, a, s, i, !1);
                })
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, i, o, s) {
          const {
            matched: a,
            consumedSegments: l,
            remainingSegments: c,
            positionalParamSegments: u,
          } = Op(n, i, o);
          if (!a) return Co(n);
          const d = this.applyRedirects.applyRedirectCommands(
            l,
            i.redirectTo,
            u
          );
          return i.redirectTo.startsWith("/")
            ? p0(d)
            : this.applyRedirects
                .lineralizeSegments(i, d)
                .pipe(
                  Ke((f) => this.processSegment(t, r, n, f.concat(c), s, !1))
                );
        }
        matchSegmentAgainstRoute(t, n, r, i, o, s) {
          let a;
          if ("**" === r.path) {
            const l = i.length > 0 ? NE(i).parameters : {};
            (a = $({
              snapshot: new Ac(
                i,
                l,
                Object.freeze({ ...this.urlTree.queryParams }),
                this.urlTree.fragment,
                y0(r),
                bn(r),
                r.component ?? r._loadedComponent ?? null,
                r,
                v0(r)
              ),
              consumedSegments: [],
              remainingSegments: [],
            })),
              (n.children = {});
          } else
            a = Hj(n, r, i, t).pipe(
              te(
                ({
                  matched: l,
                  consumedSegments: c,
                  remainingSegments: u,
                  parameters: d,
                }) =>
                  l
                    ? {
                        snapshot: new Ac(
                          c,
                          d,
                          Object.freeze({ ...this.urlTree.queryParams }),
                          this.urlTree.fragment,
                          y0(r),
                          bn(r),
                          r.component ?? r._loadedComponent ?? null,
                          r,
                          v0(r)
                        ),
                        consumedSegments: c,
                        remainingSegments: u,
                      }
                    : null
              )
            );
          return a.pipe(
            Zt((l) =>
              null === l
                ? Co(n)
                : this.getChildConfig((t = r._injector ?? t), r, i).pipe(
                    Zt(({ routes: c }) => {
                      const u = r._loadedInjector ?? t,
                        {
                          snapshot: d,
                          consumedSegments: f,
                          remainingSegments: h,
                        } = l,
                        { segmentGroup: p, slicedSegments: g } = g0(n, f, h, c);
                      if (0 === g.length && p.hasChildren())
                        return this.processChildren(u, c, p).pipe(
                          te((_) => (null === _ ? null : [new ur(d, _)]))
                        );
                      if (0 === c.length && 0 === g.length)
                        return $([new ur(d, [])]);
                      const m = bn(r) === o;
                      return this.processSegment(
                        u,
                        c,
                        p,
                        g,
                        m ? J : o,
                        !0
                      ).pipe(te((_) => [new ur(d, _)]));
                    })
                  )
            )
          );
        }
        getChildConfig(t, n, r) {
          return n.children
            ? $({ routes: n.children, injector: t })
            : n.loadChildren
            ? void 0 !== n._loadedRoutes
              ? $({ routes: n._loadedRoutes, injector: n._loadedInjector })
              : (function kj(e, t, n, r) {
                  const i = t.canLoad;
                  return void 0 === i || 0 === i.length
                    ? $(!0)
                    : $(
                        i.map((s) => {
                          const a = vo(s, e);
                          return Ar(
                            (function wj(e) {
                              return e && Ks(e.canLoad);
                            })(a)
                              ? a.canLoad(t, n)
                              : e.runInContext(() => a(t, n))
                          );
                        })
                      ).pipe(_o(), f0());
                })(t, n, r).pipe(
                  Ke((i) =>
                    i
                      ? this.configLoader.loadChildren(t, n).pipe(
                          Ct((o) => {
                            (n._loadedRoutes = o.routes),
                              (n._loadedInjector = o.injector);
                          })
                        )
                      : (function Bj(e) {
                          return ho(s0(!1, 3));
                        })()
                  )
                )
            : $({ routes: [], injector: t });
        }
      }
      function Yj(e) {
        const t = e.value.routeConfig;
        return t && "" === t.path;
      }
      function m0(e) {
        const t = [],
          n = new Set();
        for (const r of e) {
          if (!Yj(r)) {
            t.push(r);
            continue;
          }
          const i = t.find((o) => r.value.routeConfig === o.value.routeConfig);
          void 0 !== i ? (i.children.push(...r.children), n.add(i)) : t.push(r);
        }
        for (const r of n) {
          const i = m0(r.children);
          t.push(new ur(r.value, i));
        }
        return t.filter((r) => !n.has(r));
      }
      function y0(e) {
        return e.data || {};
      }
      function v0(e) {
        return e.resolve || {};
      }
      function _0(e) {
        return "string" == typeof e.title || null === e.title;
      }
      function Np(e) {
        return Zt((t) => {
          const n = e(t);
          return n ? Qe(n).pipe(te(() => t)) : $(t);
        });
      }
      const bo = new S("ROUTES");
      let Rp = (() => {
        class e {
          constructor() {
            (this.componentLoaders = new WeakMap()),
              (this.childrenLoaders = new WeakMap()),
              (this.compiler = M(Ww));
          }
          loadComponent(n) {
            if (this.componentLoaders.get(n))
              return this.componentLoaders.get(n);
            if (n._loadedComponent) return $(n._loadedComponent);
            this.onLoadStartListener && this.onLoadStartListener(n);
            const r = Ar(n.loadComponent()).pipe(
                te(C0),
                Ct((o) => {
                  this.onLoadEndListener && this.onLoadEndListener(n),
                    (n._loadedComponent = o);
                }),
                Ps(() => {
                  this.componentLoaders.delete(n);
                })
              ),
              i = new AE(r, () => new We()).pipe(pp());
            return this.componentLoaders.set(n, i), i;
          }
          loadChildren(n, r) {
            if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
            if (r._loadedRoutes)
              return $({
                routes: r._loadedRoutes,
                injector: r._loadedInjector,
              });
            this.onLoadStartListener && this.onLoadStartListener(r);
            const o = this.loadModuleFactoryOrRoutes(r.loadChildren).pipe(
                te((a) => {
                  this.onLoadEndListener && this.onLoadEndListener(r);
                  let l, c;
                  return (
                    Array.isArray(a)
                      ? (c = a)
                      : ((l = a.create(n).injector),
                        (c = l.get(bo, [], B.Self | B.Optional).flat())),
                    { routes: c.map(Ip), injector: l }
                  );
                }),
                Ps(() => {
                  this.childrenLoaders.delete(r);
                })
              ),
              s = new AE(o, () => new We()).pipe(pp());
            return this.childrenLoaders.set(r, s), s;
          }
          loadModuleFactoryOrRoutes(n) {
            return Ar(n()).pipe(
              te(C0),
              Ke((r) =>
                r instanceof nw || Array.isArray(r)
                  ? $(r)
                  : Qe(this.compiler.compileModuleAsync(r))
              )
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function C0(e) {
        return (function iH(e) {
          return e && "object" == typeof e && "default" in e;
        })(e)
          ? e.default
          : e;
      }
      let Fc = (() => {
        class e {
          get hasRequestedNavigation() {
            return 0 !== this.navigationId;
          }
          constructor() {
            (this.currentNavigation = null),
              (this.lastSuccessfulNavigation = null),
              (this.events = new We()),
              (this.configLoader = M(Rp)),
              (this.environmentInjector = M(Pn)),
              (this.urlSerializer = M(Ls)),
              (this.rootContexts = M($s)),
              (this.inputBindingEnabled = null !== M(xc, { optional: !0 })),
              (this.navigationId = 0),
              (this.afterPreactivation = () => $(void 0)),
              (this.rootComponentType = null),
              (this.configLoader.onLoadEndListener = (i) =>
                this.events.next(new XB(i))),
              (this.configLoader.onLoadStartListener = (i) =>
                this.events.next(new YB(i)));
          }
          complete() {
            this.transitions?.complete();
          }
          handleNavigationRequest(n) {
            const r = ++this.navigationId;
            this.transitions?.next({ ...this.transitions.value, ...n, id: r });
          }
          setupNavigations(n) {
            return (
              (this.transitions = new gt({
                id: 0,
                currentUrlTree: n.currentUrlTree,
                currentRawUrl: n.currentUrlTree,
                extractedUrl: n.urlHandlingStrategy.extract(n.currentUrlTree),
                urlAfterRedirects: n.urlHandlingStrategy.extract(
                  n.currentUrlTree
                ),
                rawUrl: n.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: Hs,
                restoredState: null,
                currentSnapshot: n.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: n.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              this.transitions.pipe(
                sn((r) => 0 !== r.id),
                te((r) => ({
                  ...r,
                  extractedUrl: n.urlHandlingStrategy.extract(r.rawUrl),
                })),
                Zt((r) => {
                  let i = !1,
                    o = !1;
                  return $(r).pipe(
                    Ct((s) => {
                      this.currentNavigation = {
                        id: s.id,
                        initialUrl: s.rawUrl,
                        extractedUrl: s.extractedUrl,
                        trigger: s.source,
                        extras: s.extras,
                        previousNavigation: this.lastSuccessfulNavigation
                          ? {
                              ...this.lastSuccessfulNavigation,
                              previousNavigation: null,
                            }
                          : null,
                      };
                    }),
                    Zt((s) => {
                      const a = n.browserUrlTree.toString(),
                        l =
                          !n.navigated ||
                          s.extractedUrl.toString() !== a ||
                          a !== n.currentUrlTree.toString();
                      if (
                        !l &&
                        "reload" !==
                          (s.extras.onSameUrlNavigation ??
                            n.onSameUrlNavigation)
                      ) {
                        const u = "";
                        return (
                          this.events.next(
                            new Us(s.id, n.serializeUrl(r.rawUrl), u, 0)
                          ),
                          (n.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          dn
                        );
                      }
                      if (n.urlHandlingStrategy.shouldProcessUrl(s.rawUrl))
                        return (
                          b0(s.source) && (n.browserUrlTree = s.extractedUrl),
                          $(s).pipe(
                            Zt((u) => {
                              const d = this.transitions?.getValue();
                              return (
                                this.events.next(
                                  new bp(
                                    u.id,
                                    this.urlSerializer.serialize(
                                      u.extractedUrl
                                    ),
                                    u.source,
                                    u.restoredState
                                  )
                                ),
                                d !== this.transitions?.getValue()
                                  ? dn
                                  : Promise.resolve(u)
                              );
                            }),
                            (function Xj(e, t, n, r, i, o) {
                              return Ke((s) =>
                                (function Kj(
                                  e,
                                  t,
                                  n,
                                  r,
                                  i,
                                  o,
                                  s = "emptyOnly"
                                ) {
                                  return new Qj(
                                    e,
                                    t,
                                    n,
                                    r,
                                    i,
                                    s,
                                    o
                                  ).recognize();
                                })(e, t, n, r, s.extractedUrl, i, o).pipe(
                                  te(({ state: a, tree: l }) => ({
                                    ...s,
                                    targetSnapshot: a,
                                    urlAfterRedirects: l,
                                  }))
                                )
                              );
                            })(
                              this.environmentInjector,
                              this.configLoader,
                              this.rootComponentType,
                              n.config,
                              this.urlSerializer,
                              n.paramsInheritanceStrategy
                            ),
                            Ct((u) => {
                              if (
                                ((r.targetSnapshot = u.targetSnapshot),
                                (r.urlAfterRedirects = u.urlAfterRedirects),
                                (this.currentNavigation = {
                                  ...this.currentNavigation,
                                  finalUrl: u.urlAfterRedirects,
                                }),
                                "eager" === n.urlUpdateStrategy)
                              ) {
                                if (!u.extras.skipLocationChange) {
                                  const f = n.urlHandlingStrategy.merge(
                                    u.urlAfterRedirects,
                                    u.rawUrl
                                  );
                                  n.setBrowserUrl(f, u);
                                }
                                n.browserUrlTree = u.urlAfterRedirects;
                              }
                              const d = new GB(
                                u.id,
                                this.urlSerializer.serialize(u.extractedUrl),
                                this.urlSerializer.serialize(
                                  u.urlAfterRedirects
                                ),
                                u.targetSnapshot
                              );
                              this.events.next(d);
                            })
                          )
                        );
                      if (
                        l &&
                        n.urlHandlingStrategy.shouldProcessUrl(n.rawUrlTree)
                      ) {
                        const {
                            id: u,
                            extractedUrl: d,
                            source: f,
                            restoredState: h,
                            extras: p,
                          } = s,
                          g = new bp(u, this.urlSerializer.serialize(d), f, h);
                        this.events.next(g);
                        const m = JE(0, this.rootComponentType).snapshot;
                        return $(
                          (r = {
                            ...s,
                            targetSnapshot: m,
                            urlAfterRedirects: d,
                            extras: {
                              ...p,
                              skipLocationChange: !1,
                              replaceUrl: !1,
                            },
                          })
                        );
                      }
                      {
                        const u = "";
                        return (
                          this.events.next(
                            new Us(s.id, n.serializeUrl(r.extractedUrl), u, 1)
                          ),
                          (n.rawUrlTree = s.rawUrl),
                          s.resolve(null),
                          dn
                        );
                      }
                    }),
                    Ct((s) => {
                      const a = new WB(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot
                      );
                      this.events.next(a);
                    }),
                    te(
                      (s) =>
                        (r = {
                          ...s,
                          guards: yj(
                            s.targetSnapshot,
                            s.currentSnapshot,
                            this.rootContexts
                          ),
                        })
                    ),
                    (function Aj(e, t) {
                      return Ke((n) => {
                        const {
                          targetSnapshot: r,
                          currentSnapshot: i,
                          guards: {
                            canActivateChecks: o,
                            canDeactivateChecks: s,
                          },
                        } = n;
                        return 0 === s.length && 0 === o.length
                          ? $({ ...n, guardsResult: !0 })
                          : (function Ij(e, t, n, r) {
                              return Qe(e).pipe(
                                Ke((i) =>
                                  (function Fj(e, t, n, r, i) {
                                    const o =
                                      t && t.routeConfig
                                        ? t.routeConfig.canDeactivate
                                        : null;
                                    return o && 0 !== o.length
                                      ? $(
                                          o.map((a) => {
                                            const l = qs(t) ?? i,
                                              c = vo(a, l);
                                            return Ar(
                                              (function Sj(e) {
                                                return e && Ks(e.canDeactivate);
                                              })(c)
                                                ? c.canDeactivate(e, t, n, r)
                                                : l.runInContext(() =>
                                                    c(e, t, n, r)
                                                  )
                                            ).pipe(ii());
                                          })
                                        ).pipe(_o())
                                      : $(!0);
                                  })(i.component, i.route, n, t, r)
                                ),
                                ii((i) => !0 !== i, !0)
                              );
                            })(s, r, i, e).pipe(
                              Ke((a) =>
                                a &&
                                (function bj(e) {
                                  return "boolean" == typeof e;
                                })(a)
                                  ? (function xj(e, t, n, r) {
                                      return Qe(t).pipe(
                                        po((i) =>
                                          hp(
                                            (function Nj(e, t) {
                                              return (
                                                null !== e && t && t(new JB(e)),
                                                $(!0)
                                              );
                                            })(i.route.parent, r),
                                            (function Oj(e, t) {
                                              return (
                                                null !== e && t && t(new tj(e)),
                                                $(!0)
                                              );
                                            })(i.route, r),
                                            (function Pj(e, t, n) {
                                              const r = t[t.length - 1],
                                                o = t
                                                  .slice(0, t.length - 1)
                                                  .reverse()
                                                  .map((s) =>
                                                    (function vj(e) {
                                                      const t = e.routeConfig
                                                        ? e.routeConfig
                                                            .canActivateChild
                                                        : null;
                                                      return t && 0 !== t.length
                                                        ? { node: e, guards: t }
                                                        : null;
                                                    })(s)
                                                  )
                                                  .filter((s) => null !== s)
                                                  .map((s) =>
                                                    TE(() =>
                                                      $(
                                                        s.guards.map((l) => {
                                                          const c =
                                                              qs(s.node) ?? n,
                                                            u = vo(l, c);
                                                          return Ar(
                                                            (function Ej(e) {
                                                              return (
                                                                e &&
                                                                Ks(
                                                                  e.canActivateChild
                                                                )
                                                              );
                                                            })(u)
                                                              ? u.canActivateChild(
                                                                  r,
                                                                  e
                                                                )
                                                              : c.runInContext(
                                                                  () => u(r, e)
                                                                )
                                                          ).pipe(ii());
                                                        })
                                                      ).pipe(_o())
                                                    )
                                                  );
                                              return $(o).pipe(_o());
                                            })(e, i.path, n),
                                            (function Rj(e, t, n) {
                                              const r = t.routeConfig
                                                ? t.routeConfig.canActivate
                                                : null;
                                              if (!r || 0 === r.length)
                                                return $(!0);
                                              const i = r.map((o) =>
                                                TE(() => {
                                                  const s = qs(t) ?? n,
                                                    a = vo(o, s);
                                                  return Ar(
                                                    (function Dj(e) {
                                                      return (
                                                        e && Ks(e.canActivate)
                                                      );
                                                    })(a)
                                                      ? a.canActivate(t, e)
                                                      : s.runInContext(() =>
                                                          a(t, e)
                                                        )
                                                  ).pipe(ii());
                                                })
                                              );
                                              return $(i).pipe(_o());
                                            })(e, i.route, n)
                                          )
                                        ),
                                        ii((i) => !0 !== i, !0)
                                      );
                                    })(r, o, e, t)
                                  : $(a)
                              ),
                              te((a) => ({ ...n, guardsResult: a }))
                            );
                      });
                    })(this.environmentInjector, (s) => this.events.next(s)),
                    Ct((s) => {
                      if (
                        ((r.guardsResult = s.guardsResult), si(s.guardsResult))
                      )
                        throw o0(0, s.guardsResult);
                      const a = new KB(
                        s.id,
                        this.urlSerializer.serialize(s.extractedUrl),
                        this.urlSerializer.serialize(s.urlAfterRedirects),
                        s.targetSnapshot,
                        !!s.guardsResult
                      );
                      this.events.next(a);
                    }),
                    sn(
                      (s) =>
                        !!s.guardsResult ||
                        (n.restoreHistory(s),
                        this.cancelNavigationTransition(s, "", 3),
                        !1)
                    ),
                    Np((s) => {
                      if (s.guards.canActivateChecks.length)
                        return $(s).pipe(
                          Ct((a) => {
                            const l = new QB(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          }),
                          Zt((a) => {
                            let l = !1;
                            return $(a).pipe(
                              (function Jj(e, t) {
                                return Ke((n) => {
                                  const {
                                    targetSnapshot: r,
                                    guards: { canActivateChecks: i },
                                  } = n;
                                  if (!i.length) return $(n);
                                  let o = 0;
                                  return Qe(i).pipe(
                                    po((s) =>
                                      (function eH(e, t, n, r) {
                                        const i = e.routeConfig,
                                          o = e._resolve;
                                        return (
                                          void 0 !== i?.title &&
                                            !_0(i) &&
                                            (o[Fs] = i.title),
                                          (function tH(e, t, n, r) {
                                            const i = (function nH(e) {
                                              return [
                                                ...Object.keys(e),
                                                ...Object.getOwnPropertySymbols(
                                                  e
                                                ),
                                              ];
                                            })(e);
                                            if (0 === i.length) return $({});
                                            const o = {};
                                            return Qe(i).pipe(
                                              Ke((s) =>
                                                (function rH(e, t, n, r) {
                                                  const i = qs(t) ?? r,
                                                    o = vo(e, i);
                                                  return Ar(
                                                    o.resolve
                                                      ? o.resolve(t, n)
                                                      : i.runInContext(() =>
                                                          o(t, n)
                                                        )
                                                  );
                                                })(e[s], t, n, r).pipe(
                                                  ii(),
                                                  Ct((a) => {
                                                    o[s] = a;
                                                  })
                                                )
                                              ),
                                              gp(1),
                                              (function yB(e) {
                                                return te(() => e);
                                              })(o),
                                              Tr((s) => (d0(s) ? dn : ho(s)))
                                            );
                                          })(o, e, t, r).pipe(
                                            te(
                                              (s) => (
                                                (e._resolvedData = s),
                                                (e.data = e0(e, n).resolve),
                                                i &&
                                                  _0(i) &&
                                                  (e.data[Fs] = i.title),
                                                null
                                              )
                                            )
                                          )
                                        );
                                      })(s.route, r, e, t)
                                    ),
                                    Ct(() => o++),
                                    gp(1),
                                    Ke((s) => (o === i.length ? $(n) : dn))
                                  );
                                });
                              })(
                                n.paramsInheritanceStrategy,
                                this.environmentInjector
                              ),
                              Ct({
                                next: () => (l = !0),
                                complete: () => {
                                  l ||
                                    (n.restoreHistory(a),
                                    this.cancelNavigationTransition(a, "", 2));
                                },
                              })
                            );
                          }),
                          Ct((a) => {
                            const l = new ZB(
                              a.id,
                              this.urlSerializer.serialize(a.extractedUrl),
                              this.urlSerializer.serialize(a.urlAfterRedirects),
                              a.targetSnapshot
                            );
                            this.events.next(l);
                          })
                        );
                    }),
                    Np((s) => {
                      const a = (l) => {
                        const c = [];
                        l.routeConfig?.loadComponent &&
                          !l.routeConfig._loadedComponent &&
                          c.push(
                            this.configLoader.loadComponent(l.routeConfig).pipe(
                              Ct((u) => {
                                l.component = u;
                              }),
                              te(() => {})
                            )
                          );
                        for (const u of l.children) c.push(...a(u));
                        return c;
                      };
                      return fp(a(s.targetSnapshot.root)).pipe(Cc(), ri(1));
                    }),
                    Np(() => this.afterPreactivation()),
                    te((s) => {
                      const a = (function aj(e, t, n) {
                        const r = zs(e, t._root, n ? n._root : void 0);
                        return new XE(r, t);
                      })(
                        n.routeReuseStrategy,
                        s.targetSnapshot,
                        s.currentRouterState
                      );
                      return (r = { ...s, targetRouterState: a });
                    }),
                    Ct((s) => {
                      (n.currentUrlTree = s.urlAfterRedirects),
                        (n.rawUrlTree = n.urlHandlingStrategy.merge(
                          s.urlAfterRedirects,
                          s.rawUrl
                        )),
                        (n.routerState = s.targetRouterState),
                        "deferred" === n.urlUpdateStrategy &&
                          (s.extras.skipLocationChange ||
                            n.setBrowserUrl(n.rawUrlTree, s),
                          (n.browserUrlTree = s.urlAfterRedirects));
                    }),
                    ((e, t, n, r) =>
                      te(
                        (i) => (
                          new mj(
                            t,
                            i.targetRouterState,
                            i.currentRouterState,
                            n,
                            r
                          ).activate(e),
                          i
                        )
                      ))(
                      this.rootContexts,
                      n.routeReuseStrategy,
                      (s) => this.events.next(s),
                      this.inputBindingEnabled
                    ),
                    ri(1),
                    Ct({
                      next: (s) => {
                        (i = !0),
                          (this.lastSuccessfulNavigation =
                            this.currentNavigation),
                          (n.navigated = !0),
                          this.events.next(
                            new ai(
                              s.id,
                              this.urlSerializer.serialize(s.extractedUrl),
                              this.urlSerializer.serialize(n.currentUrlTree)
                            )
                          ),
                          n.titleStrategy?.updateTitle(
                            s.targetRouterState.snapshot
                          ),
                          s.resolve(!0);
                      },
                      complete: () => {
                        i = !0;
                      },
                    }),
                    Ps(() => {
                      i || o || this.cancelNavigationTransition(r, "", 1),
                        this.currentNavigation?.id === r.id &&
                          (this.currentNavigation = null);
                    }),
                    Tr((s) => {
                      if (((o = !0), l0(s))) {
                        a0(s) || ((n.navigated = !0), n.restoreHistory(r, !0));
                        const a = new Tc(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s.message,
                          s.cancellationCode
                        );
                        if ((this.events.next(a), a0(s))) {
                          const l = n.urlHandlingStrategy.merge(
                              s.url,
                              n.rawUrlTree
                            ),
                            c = {
                              skipLocationChange: r.extras.skipLocationChange,
                              replaceUrl:
                                "eager" === n.urlUpdateStrategy || b0(r.source),
                            };
                          n.scheduleNavigation(l, Hs, null, c, {
                            resolve: r.resolve,
                            reject: r.reject,
                            promise: r.promise,
                          });
                        } else r.resolve(!1);
                      } else {
                        n.restoreHistory(r, !0);
                        const a = new wp(
                          r.id,
                          this.urlSerializer.serialize(r.extractedUrl),
                          s,
                          r.targetSnapshot ?? void 0
                        );
                        this.events.next(a);
                        try {
                          r.resolve(n.errorHandler(s));
                        } catch (l) {
                          r.reject(l);
                        }
                      }
                      return dn;
                    })
                  );
                })
              )
            );
          }
          cancelNavigationTransition(n, r, i) {
            const o = new Tc(
              n.id,
              this.urlSerializer.serialize(n.extractedUrl),
              r,
              i
            );
            this.events.next(o), n.resolve(!1);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function b0(e) {
        return e !== Hs;
      }
      let w0 = (() => {
          class e {
            buildTitle(n) {
              let r,
                i = n.root;
              for (; void 0 !== i; )
                (r = this.getResolvedTitleForRoute(i) ?? r),
                  (i = i.children.find((o) => o.outlet === J));
              return r;
            }
            getResolvedTitleForRoute(n) {
              return n.data[Fs];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({
              token: e,
              factory: function () {
                return M(oH);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        oH = (() => {
          class e extends w0 {
            constructor(n) {
              super(), (this.title = n);
            }
            updateTitle(n) {
              const r = this.buildTitle(n);
              void 0 !== r && this.title.setTitle(r);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(yE));
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        sH = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({
              token: e,
              factory: function () {
                return M(lH);
              },
              providedIn: "root",
            })),
            e
          );
        })();
      class aH {
        shouldDetach(t) {
          return !1;
        }
        store(t, n) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, n) {
          return t.routeConfig === n.routeConfig;
        }
      }
      let lH = (() => {
        class e extends aH {}
        return (
          (e.ɵfac = (function () {
            let t;
            return function (r) {
              return (t || (t = rt(e)))(r || e);
            };
          })()),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const kc = new S("", { providedIn: "root", factory: () => ({}) });
      let cH = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({
              token: e,
              factory: function () {
                return M(uH);
              },
              providedIn: "root",
            })),
            e
          );
        })(),
        uH = (() => {
          class e {
            shouldProcessUrl(n) {
              return !0;
            }
            extract(n) {
              return n;
            }
            merge(n, r) {
              return n;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })();
      var Gt = (() => (
        ((Gt = Gt || {})[(Gt.COMPLETE = 0)] = "COMPLETE"),
        (Gt[(Gt.FAILED = 1)] = "FAILED"),
        (Gt[(Gt.REDIRECTING = 2)] = "REDIRECTING"),
        Gt
      ))();
      function D0(e, t) {
        e.events
          .pipe(
            sn(
              (n) =>
                n instanceof ai ||
                n instanceof Tc ||
                n instanceof wp ||
                n instanceof Us
            ),
            te((n) =>
              n instanceof ai || n instanceof Us
                ? Gt.COMPLETE
                : n instanceof Tc && (0 === n.code || 1 === n.code)
                ? Gt.REDIRECTING
                : Gt.FAILED
            ),
            sn((n) => n !== Gt.REDIRECTING),
            ri(1)
          )
          .subscribe(() => {
            t();
          });
      }
      function dH(e) {
        throw e;
      }
      function fH(e, t, n) {
        return t.parse("/");
      }
      const hH = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        pH = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let st = (() => {
          class e {
            get navigationId() {
              return this.navigationTransitions.navigationId;
            }
            get browserPageId() {
              if ("computed" === this.canceledNavigationResolution)
                return this.location.getState()?.ɵrouterPageId;
            }
            get events() {
              return this.navigationTransitions.events;
            }
            constructor() {
              (this.disposed = !1),
                (this.currentPageId = 0),
                (this.console = M(Gw)),
                (this.isNgZoneEnabled = !1),
                (this.options = M(kc, { optional: !0 }) || {}),
                (this.pendingTasks = M(Xl)),
                (this.errorHandler = this.options.errorHandler || dH),
                (this.malformedUriErrorHandler =
                  this.options.malformedUriErrorHandler || fH),
                (this.navigated = !1),
                (this.lastSuccessfulId = -1),
                (this.urlHandlingStrategy = M(cH)),
                (this.routeReuseStrategy = M(sH)),
                (this.titleStrategy = M(w0)),
                (this.onSameUrlNavigation =
                  this.options.onSameUrlNavigation || "ignore"),
                (this.paramsInheritanceStrategy =
                  this.options.paramsInheritanceStrategy || "emptyOnly"),
                (this.urlUpdateStrategy =
                  this.options.urlUpdateStrategy || "deferred"),
                (this.canceledNavigationResolution =
                  this.options.canceledNavigationResolution || "replace"),
                (this.config = M(bo, { optional: !0 })?.flat() ?? []),
                (this.navigationTransitions = M(Fc)),
                (this.urlSerializer = M(Ls)),
                (this.location = M(jh)),
                (this.componentInputBindingEnabled = !!M(xc, { optional: !0 })),
                (this.isNgZoneEnabled =
                  M(ye) instanceof ye && ye.isInAngularZone()),
                this.resetConfig(this.config),
                (this.currentUrlTree = new mo()),
                (this.rawUrlTree = this.currentUrlTree),
                (this.browserUrlTree = this.currentUrlTree),
                (this.routerState = JE(0, null)),
                this.navigationTransitions.setupNavigations(this).subscribe(
                  (n) => {
                    (this.lastSuccessfulId = n.id),
                      (this.currentPageId = this.browserPageId ?? 0);
                  },
                  (n) => {
                    this.console.warn(`Unhandled Navigation Error: ${n}`);
                  }
                );
            }
            resetRootComponentType(n) {
              (this.routerState.root.component = n),
                (this.navigationTransitions.rootComponentType = n);
            }
            initialNavigation() {
              if (
                (this.setUpLocationChangeListener(),
                !this.navigationTransitions.hasRequestedNavigation)
              ) {
                const n = this.location.getState();
                this.navigateToSyncWithBrowser(this.location.path(!0), Hs, n);
              }
            }
            setUpLocationChangeListener() {
              this.locationSubscription ||
                (this.locationSubscription = this.location.subscribe((n) => {
                  const r = "popstate" === n.type ? "popstate" : "hashchange";
                  "popstate" === r &&
                    setTimeout(() => {
                      this.navigateToSyncWithBrowser(n.url, r, n.state);
                    }, 0);
                }));
            }
            navigateToSyncWithBrowser(n, r, i) {
              const o = { replaceUrl: !0 },
                s = i?.navigationId ? i : null;
              if (i) {
                const l = { ...i };
                delete l.navigationId,
                  delete l.ɵrouterPageId,
                  0 !== Object.keys(l).length && (o.state = l);
              }
              const a = this.parseUrl(n);
              this.scheduleNavigation(a, r, s, o);
            }
            get url() {
              return this.serializeUrl(this.currentUrlTree);
            }
            getCurrentNavigation() {
              return this.navigationTransitions.currentNavigation;
            }
            get lastSuccessfulNavigation() {
              return this.navigationTransitions.lastSuccessfulNavigation;
            }
            resetConfig(n) {
              (this.config = n.map(Ip)),
                (this.navigated = !1),
                (this.lastSuccessfulId = -1);
            }
            ngOnDestroy() {
              this.dispose();
            }
            dispose() {
              this.navigationTransitions.complete(),
                this.locationSubscription &&
                  (this.locationSubscription.unsubscribe(),
                  (this.locationSubscription = void 0)),
                (this.disposed = !0);
            }
            createUrlTree(n, r = {}) {
              const {
                  relativeTo: i,
                  queryParams: o,
                  fragment: s,
                  queryParamsHandling: a,
                  preserveFragment: l,
                } = r,
                c = l ? this.currentUrlTree.fragment : s;
              let d,
                u = null;
              switch (a) {
                case "merge":
                  u = { ...this.currentUrlTree.queryParams, ...o };
                  break;
                case "preserve":
                  u = this.currentUrlTree.queryParams;
                  break;
                default:
                  u = o || null;
              }
              null !== u && (u = this.removeEmptyProps(u));
              try {
                d = $E(i ? i.snapshot : this.routerState.snapshot.root);
              } catch {
                ("string" != typeof n[0] || !n[0].startsWith("/")) && (n = []),
                  (d = this.currentUrlTree.root);
              }
              return zE(d, n, u, c ?? null);
            }
            navigateByUrl(n, r = { skipLocationChange: !1 }) {
              const i = si(n) ? n : this.parseUrl(n),
                o = this.urlHandlingStrategy.merge(i, this.rawUrlTree);
              return this.scheduleNavigation(o, Hs, null, r);
            }
            navigate(n, r = { skipLocationChange: !1 }) {
              return (
                (function gH(e) {
                  for (let t = 0; t < e.length; t++)
                    if (null == e[t]) throw new v(4008, !1);
                })(n),
                this.navigateByUrl(this.createUrlTree(n, r), r)
              );
            }
            serializeUrl(n) {
              return this.urlSerializer.serialize(n);
            }
            parseUrl(n) {
              let r;
              try {
                r = this.urlSerializer.parse(n);
              } catch (i) {
                r = this.malformedUriErrorHandler(i, this.urlSerializer, n);
              }
              return r;
            }
            isActive(n, r) {
              let i;
              if (
                ((i = !0 === r ? { ...hH } : !1 === r ? { ...pH } : r), si(n))
              )
                return PE(this.currentUrlTree, n, i);
              const o = this.parseUrl(n);
              return PE(this.currentUrlTree, o, i);
            }
            removeEmptyProps(n) {
              return Object.keys(n).reduce((r, i) => {
                const o = n[i];
                return null != o && (r[i] = o), r;
              }, {});
            }
            scheduleNavigation(n, r, i, o, s) {
              if (this.disposed) return Promise.resolve(!1);
              let a, l, c;
              s
                ? ((a = s.resolve), (l = s.reject), (c = s.promise))
                : (c = new Promise((d, f) => {
                    (a = d), (l = f);
                  }));
              const u = this.pendingTasks.add();
              return (
                D0(this, () => {
                  Promise.resolve().then(() => this.pendingTasks.remove(u));
                }),
                this.navigationTransitions.handleNavigationRequest({
                  source: r,
                  restoredState: i,
                  currentUrlTree: this.currentUrlTree,
                  currentRawUrl: this.currentUrlTree,
                  rawUrl: n,
                  extras: o,
                  resolve: a,
                  reject: l,
                  promise: c,
                  currentSnapshot: this.routerState.snapshot,
                  currentRouterState: this.routerState,
                }),
                c.catch((d) => Promise.reject(d))
              );
            }
            setBrowserUrl(n, r) {
              const i = this.urlSerializer.serialize(n);
              if (
                this.location.isCurrentPathEqualTo(i) ||
                r.extras.replaceUrl
              ) {
                const s = {
                  ...r.extras.state,
                  ...this.generateNgRouterState(r.id, this.browserPageId),
                };
                this.location.replaceState(i, "", s);
              } else {
                const o = {
                  ...r.extras.state,
                  ...this.generateNgRouterState(
                    r.id,
                    (this.browserPageId ?? 0) + 1
                  ),
                };
                this.location.go(i, "", o);
              }
            }
            restoreHistory(n, r = !1) {
              if ("computed" === this.canceledNavigationResolution) {
                const o =
                  this.currentPageId -
                  (this.browserPageId ?? this.currentPageId);
                0 !== o
                  ? this.location.historyGo(o)
                  : this.currentUrlTree ===
                      this.getCurrentNavigation()?.finalUrl &&
                    0 === o &&
                    (this.resetState(n),
                    (this.browserUrlTree = n.currentUrlTree),
                    this.resetUrlToCurrentUrlTree());
              } else
                "replace" === this.canceledNavigationResolution &&
                  (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
            }
            resetState(n) {
              (this.routerState = n.currentRouterState),
                (this.currentUrlTree = n.currentUrlTree),
                (this.rawUrlTree = this.urlHandlingStrategy.merge(
                  this.currentUrlTree,
                  n.rawUrl
                ));
            }
            resetUrlToCurrentUrlTree() {
              this.location.replaceState(
                this.urlSerializer.serialize(this.rawUrlTree),
                "",
                this.generateNgRouterState(
                  this.lastSuccessfulId,
                  this.currentPageId
                )
              );
            }
            generateNgRouterState(n, r) {
              return "computed" === this.canceledNavigationResolution
                ? { navigationId: n, ɵrouterPageId: r }
                : { navigationId: n };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        Lc = (() => {
          class e {
            constructor(n, r, i, o, s, a) {
              (this.router = n),
                (this.route = r),
                (this.tabIndexAttribute = i),
                (this.renderer = o),
                (this.el = s),
                (this.locationStrategy = a),
                (this.href = null),
                (this.commands = null),
                (this.onChanges = new We()),
                (this.preserveFragment = !1),
                (this.skipLocationChange = !1),
                (this.replaceUrl = !1);
              const l = s.nativeElement.tagName?.toLowerCase();
              (this.isAnchorElement = "a" === l || "area" === l),
                this.isAnchorElement
                  ? (this.subscription = n.events.subscribe((c) => {
                      c instanceof ai && this.updateHref();
                    }))
                  : this.setTabIndexIfNotOnNativeEl("0");
            }
            setTabIndexIfNotOnNativeEl(n) {
              null != this.tabIndexAttribute ||
                this.isAnchorElement ||
                this.applyAttributeValue("tabindex", n);
            }
            ngOnChanges(n) {
              this.isAnchorElement && this.updateHref(),
                this.onChanges.next(this);
            }
            set routerLink(n) {
              null != n
                ? ((this.commands = Array.isArray(n) ? n : [n]),
                  this.setTabIndexIfNotOnNativeEl("0"))
                : ((this.commands = null),
                  this.setTabIndexIfNotOnNativeEl(null));
            }
            onClick(n, r, i, o, s) {
              return (
                !!(
                  null === this.urlTree ||
                  (this.isAnchorElement &&
                    (0 !== n ||
                      r ||
                      i ||
                      o ||
                      s ||
                      ("string" == typeof this.target &&
                        "_self" != this.target)))
                ) ||
                (this.router.navigateByUrl(this.urlTree, {
                  skipLocationChange: this.skipLocationChange,
                  replaceUrl: this.replaceUrl,
                  state: this.state,
                }),
                !this.isAnchorElement)
              );
            }
            ngOnDestroy() {
              this.subscription?.unsubscribe();
            }
            updateHref() {
              this.href =
                null !== this.urlTree && this.locationStrategy
                  ? this.locationStrategy?.prepareExternalUrl(
                      this.router.serializeUrl(this.urlTree)
                    )
                  : null;
              const n =
                null === this.href
                  ? null
                  : (function u_(e, t, n) {
                      return (function w1(e, t) {
                        return ("src" === t &&
                          ("embed" === e ||
                            "frame" === e ||
                            "iframe" === e ||
                            "media" === e ||
                            "script" === e)) ||
                          ("href" === t && ("base" === e || "link" === e))
                          ? c_
                          : Wr;
                      })(
                        t,
                        n
                      )(e);
                    })(
                      this.href,
                      this.el.nativeElement.tagName.toLowerCase(),
                      "href"
                    );
              this.applyAttributeValue("href", n);
            }
            applyAttributeValue(n, r) {
              const i = this.renderer,
                o = this.el.nativeElement;
              null !== r ? i.setAttribute(o, n, r) : i.removeAttribute(o, n);
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: this.preserveFragment,
                  });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(
                C(st),
                C(li),
                (function el(e) {
                  return (function $x(e, t) {
                    if ("class" === t) return e.classes;
                    if ("style" === t) return e.styles;
                    const n = e.attrs;
                    if (n) {
                      const r = n.length;
                      let i = 0;
                      for (; i < r; ) {
                        const o = n[i];
                        if (ly(o)) break;
                        if (0 === o) i += 2;
                        else if ("number" == typeof o)
                          for (i++; i < r && "string" == typeof n[i]; ) i++;
                        else {
                          if (o === t) return n[i + 1];
                          i += 2;
                        }
                      }
                    }
                    return null;
                  })(ot(), e);
                })("tabindex"),
                C(tr),
                C(Ut),
                C(ti)
              );
            }),
            (e.ɵdir = W({
              type: e,
              selectors: [["", "routerLink", ""]],
              hostVars: 1,
              hostBindings: function (n, r) {
                1 & n &&
                  ue("click", function (o) {
                    return r.onClick(
                      o.button,
                      o.ctrlKey,
                      o.shiftKey,
                      o.altKey,
                      o.metaKey
                    );
                  }),
                  2 & n && xt("target", r.target);
              },
              inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                state: "state",
                relativeTo: "relativeTo",
                preserveFragment: ["preserveFragment", "preserveFragment", fo],
                skipLocationChange: [
                  "skipLocationChange",
                  "skipLocationChange",
                  fo,
                ],
                replaceUrl: ["replaceUrl", "replaceUrl", fo],
                routerLink: "routerLink",
              },
              standalone: !0,
              features: [_C, Jt],
            })),
            e
          );
        })();
      class E0 {}
      let vH = (() => {
        class e {
          constructor(n, r, i, o, s) {
            (this.router = n),
              (this.injector = i),
              (this.preloadingStrategy = o),
              (this.loader = s);
          }
          setUpPreloading() {
            this.subscription = this.router.events
              .pipe(
                sn((n) => n instanceof ai),
                po(() => this.preload())
              )
              .subscribe(() => {});
          }
          preload() {
            return this.processRoutes(this.injector, this.router.config);
          }
          ngOnDestroy() {
            this.subscription && this.subscription.unsubscribe();
          }
          processRoutes(n, r) {
            const i = [];
            for (const o of r) {
              o.providers &&
                !o._injector &&
                (o._injector = rh(o.providers, n, `Route: ${o.path}`));
              const s = o._injector ?? n,
                a = o._loadedInjector ?? s;
              ((o.loadChildren && !o._loadedRoutes && void 0 === o.canLoad) ||
                (o.loadComponent && !o._loadedComponent)) &&
                i.push(this.preloadConfig(s, o)),
                (o.children || o._loadedRoutes) &&
                  i.push(this.processRoutes(a, o.children ?? o._loadedRoutes));
            }
            return Qe(i).pipe(wi());
          }
          preloadConfig(n, r) {
            return this.preloadingStrategy.preload(r, () => {
              let i;
              i =
                r.loadChildren && void 0 === r.canLoad
                  ? this.loader.loadChildren(n, r)
                  : $(null);
              const o = i.pipe(
                Ke((s) =>
                  null === s
                    ? $(void 0)
                    : ((r._loadedRoutes = s.routes),
                      (r._loadedInjector = s.injector),
                      this.processRoutes(s.injector ?? n, s.routes))
                )
              );
              return r.loadComponent && !r._loadedComponent
                ? Qe([o, this.loader.loadComponent(r)]).pipe(wi())
                : o;
            });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(st), D(Ww), D(Pn), D(E0), D(Rp));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const Pp = new S("");
      let S0 = (() => {
        class e {
          constructor(n, r, i, o, s = {}) {
            (this.urlSerializer = n),
              (this.transitions = r),
              (this.viewportScroller = i),
              (this.zone = o),
              (this.options = s),
              (this.lastId = 0),
              (this.lastSource = "imperative"),
              (this.restoredId = 0),
              (this.store = {}),
              (s.scrollPositionRestoration =
                s.scrollPositionRestoration || "disabled"),
              (s.anchorScrolling = s.anchorScrolling || "disabled");
          }
          init() {
            "disabled" !== this.options.scrollPositionRestoration &&
              this.viewportScroller.setHistoryScrollRestoration("manual"),
              (this.routerEventsSubscription = this.createScrollEvents()),
              (this.scrollEventsSubscription = this.consumeScrollEvents());
          }
          createScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof bp
                ? ((this.store[this.lastId] =
                    this.viewportScroller.getScrollPosition()),
                  (this.lastSource = n.navigationTrigger),
                  (this.restoredId = n.restoredState
                    ? n.restoredState.navigationId
                    : 0))
                : n instanceof ai
                ? ((this.lastId = n.id),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.urlAfterRedirects).fragment
                  ))
                : n instanceof Us &&
                  0 === n.code &&
                  ((this.lastSource = void 0),
                  (this.restoredId = 0),
                  this.scheduleScrollEvent(
                    n,
                    this.urlSerializer.parse(n.url).fragment
                  ));
            });
          }
          consumeScrollEvents() {
            return this.transitions.events.subscribe((n) => {
              n instanceof ZE &&
                (n.position
                  ? "top" === this.options.scrollPositionRestoration
                    ? this.viewportScroller.scrollToPosition([0, 0])
                    : "enabled" === this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition(n.position)
                  : n.anchor && "enabled" === this.options.anchorScrolling
                  ? this.viewportScroller.scrollToAnchor(n.anchor)
                  : "disabled" !== this.options.scrollPositionRestoration &&
                    this.viewportScroller.scrollToPosition([0, 0]));
            });
          }
          scheduleScrollEvent(n, r) {
            this.zone.runOutsideAngular(() => {
              setTimeout(() => {
                this.zone.run(() => {
                  this.transitions.events.next(
                    new ZE(
                      n,
                      "popstate" === this.lastSource
                        ? this.store[this.restoredId]
                        : null,
                      r
                    )
                  );
                });
              }, 0);
            });
          }
          ngOnDestroy() {
            this.routerEventsSubscription?.unsubscribe(),
              this.scrollEventsSubscription?.unsubscribe();
          }
        }
        return (
          (e.ɵfac = function (n) {
            !(function W_() {
              throw new Error("invalid");
            })();
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function dr(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      function T0() {
        const e = M($t);
        return (t) => {
          const n = e.get(ar);
          if (t !== n.components[0]) return;
          const r = e.get(st),
            i = e.get(A0);
          1 === e.get(Fp) && r.initialNavigation(),
            e.get(I0, null, B.Optional)?.setUpPreloading(),
            e.get(Pp, null, B.Optional)?.init(),
            r.resetRootComponentType(n.componentTypes[0]),
            i.closed || (i.next(), i.complete(), i.unsubscribe());
        };
      }
      const A0 = new S("", { factory: () => new We() }),
        Fp = new S("", { providedIn: "root", factory: () => 1 }),
        I0 = new S("");
      function wH(e) {
        return dr(0, [
          { provide: I0, useExisting: vH },
          { provide: E0, useExisting: e },
        ]);
      }
      const x0 = new S("ROUTER_FORROOT_GUARD"),
        EH = [
          jh,
          { provide: Ls, useClass: mp },
          st,
          $s,
          {
            provide: li,
            useFactory: function M0(e) {
              return e.routerState.root;
            },
            deps: [st],
          },
          Rp,
          [],
        ];
      function SH() {
        return new iD("Router", st);
      }
      let kp = (() => {
        class e {
          constructor(n) {}
          static forRoot(n, r) {
            return {
              ngModule: e,
              providers: [
                EH,
                [],
                { provide: bo, multi: !0, useValue: n },
                {
                  provide: x0,
                  useFactory: IH,
                  deps: [[st, new rl(), new il()]],
                },
                { provide: kc, useValue: r || {} },
                r?.useHash
                  ? { provide: ti, useClass: HL }
                  : { provide: ti, useClass: ND },
                {
                  provide: Pp,
                  useFactory: () => {
                    const e = M(i2),
                      t = M(ye),
                      n = M(kc),
                      r = M(Fc),
                      i = M(Ls);
                    return (
                      n.scrollOffset && e.setOffset(n.scrollOffset),
                      new S0(i, r, e, t, n)
                    );
                  },
                },
                r?.preloadingStrategy
                  ? wH(r.preloadingStrategy).ɵproviders
                  : [],
                { provide: iD, multi: !0, useFactory: SH },
                r?.initialNavigation ? xH(r) : [],
                r?.bindToComponentInputs
                  ? dr(8, [r0, { provide: xc, useExisting: r0 }]).ɵproviders
                  : [],
                [
                  { provide: O0, useFactory: T0 },
                  { provide: Ih, multi: !0, useExisting: O0 },
                ],
              ],
            };
          }
          static forChild(n) {
            return {
              ngModule: e,
              providers: [{ provide: bo, multi: !0, useValue: n }],
            };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(x0, 8));
          }),
          (e.ɵmod = Ve({ type: e })),
          (e.ɵinj = Fe({})),
          e
        );
      })();
      function IH(e) {
        return "guarded";
      }
      function xH(e) {
        return [
          "disabled" === e.initialNavigation
            ? dr(3, [
                {
                  provide: Ch,
                  multi: !0,
                  useFactory: () => {
                    const t = M(st);
                    return () => {
                      t.setUpLocationChangeListener();
                    };
                  },
                },
                { provide: Fp, useValue: 2 },
              ]).ɵproviders
            : [],
          "enabledBlocking" === e.initialNavigation
            ? dr(2, [
                { provide: Fp, useValue: 0 },
                {
                  provide: Ch,
                  multi: !0,
                  deps: [$t],
                  useFactory: (t) => {
                    const n = t.get(BL, Promise.resolve());
                    return () =>
                      n.then(
                        () =>
                          new Promise((r) => {
                            const i = t.get(st),
                              o = t.get(A0);
                            D0(i, () => {
                              r(!0);
                            }),
                              (t.get(Fc).afterPreactivation = () => (
                                r(!0), o.closed ? $(void 0) : o
                              )),
                              i.initialNavigation();
                          })
                      );
                  },
                },
              ]).ɵproviders
            : [],
        ];
      }
      const O0 = new S("");
      class Vc {}
      class Bc {}
      class Hn {
        constructor(t) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            t
              ? "string" == typeof t
                ? (this.lazyInit = () => {
                    (this.headers = new Map()),
                      t.split("\n").forEach((n) => {
                        const r = n.indexOf(":");
                        if (r > 0) {
                          const i = n.slice(0, r),
                            o = i.toLowerCase(),
                            s = n.slice(r + 1).trim();
                          this.maybeSetNormalizedName(i, o),
                            this.headers.has(o)
                              ? this.headers.get(o).push(s)
                              : this.headers.set(o, [s]);
                        }
                      });
                  })
                : typeof Headers < "u" && t instanceof Headers
                ? ((this.headers = new Map()),
                  t.forEach((n, r) => {
                    this.setHeaderEntries(r, n);
                  }))
                : (this.lazyInit = () => {
                    (this.headers = new Map()),
                      Object.entries(t).forEach(([n, r]) => {
                        this.setHeaderEntries(n, r);
                      });
                  })
              : (this.headers = new Map());
        }
        has(t) {
          return this.init(), this.headers.has(t.toLowerCase());
        }
        get(t) {
          this.init();
          const n = this.headers.get(t.toLowerCase());
          return n && n.length > 0 ? n[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(t) {
          return this.init(), this.headers.get(t.toLowerCase()) || null;
        }
        append(t, n) {
          return this.clone({ name: t, value: n, op: "a" });
        }
        set(t, n) {
          return this.clone({ name: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ name: t, value: n, op: "d" });
        }
        maybeSetNormalizedName(t, n) {
          this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof Hn
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
              (this.lazyUpdate = null)));
        }
        copyFrom(t) {
          t.init(),
            Array.from(t.headers.keys()).forEach((n) => {
              this.headers.set(n, t.headers.get(n)),
                this.normalizedNames.set(n, t.normalizedNames.get(n));
            });
        }
        clone(t) {
          const n = new Hn();
          return (
            (n.lazyInit =
              this.lazyInit && this.lazyInit instanceof Hn
                ? this.lazyInit
                : this),
            (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
            n
          );
        }
        applyUpdate(t) {
          const n = t.name.toLowerCase();
          switch (t.op) {
            case "a":
            case "s":
              let r = t.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(t.name, n);
              const i = ("a" === t.op ? this.headers.get(n) : void 0) || [];
              i.push(...r), this.headers.set(n, i);
              break;
            case "d":
              const o = t.value;
              if (o) {
                let s = this.headers.get(n);
                if (!s) return;
                (s = s.filter((a) => -1 === o.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(n), this.normalizedNames.delete(n))
                    : this.headers.set(n, s);
              } else this.headers.delete(n), this.normalizedNames.delete(n);
          }
        }
        setHeaderEntries(t, n) {
          const r = (Array.isArray(n) ? n : [n]).map((o) => o.toString()),
            i = t.toLowerCase();
          this.headers.set(i, r), this.maybeSetNormalizedName(t, i);
        }
        forEach(t) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((n) =>
              t(this.normalizedNames.get(n), this.headers.get(n))
            );
        }
      }
      class NH {
        encodeKey(t) {
          return N0(t);
        }
        encodeValue(t) {
          return N0(t);
        }
        decodeKey(t) {
          return decodeURIComponent(t);
        }
        decodeValue(t) {
          return decodeURIComponent(t);
        }
      }
      const PH = /%(\d[a-f0-9])/gi,
        FH = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function N0(e) {
        return encodeURIComponent(e).replace(PH, (t, n) => FH[n] ?? t);
      }
      function jc(e) {
        return `${e}`;
      }
      class Ir {
        constructor(t = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = t.encoder || new NH()),
            t.fromString)
          ) {
            if (t.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function RH(e, t) {
              const n = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((i) => {
                      const o = i.indexOf("="),
                        [s, a] =
                          -1 == o
                            ? [t.decodeKey(i), ""]
                            : [
                                t.decodeKey(i.slice(0, o)),
                                t.decodeValue(i.slice(o + 1)),
                              ],
                        l = n.get(s) || [];
                      l.push(a), n.set(s, l);
                    }),
                n
              );
            })(t.fromString, this.encoder);
          } else
            t.fromObject
              ? ((this.map = new Map()),
                Object.keys(t.fromObject).forEach((n) => {
                  const r = t.fromObject[n],
                    i = Array.isArray(r) ? r.map(jc) : [jc(r)];
                  this.map.set(n, i);
                }))
              : (this.map = null);
        }
        has(t) {
          return this.init(), this.map.has(t);
        }
        get(t) {
          this.init();
          const n = this.map.get(t);
          return n ? n[0] : null;
        }
        getAll(t) {
          return this.init(), this.map.get(t) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(t, n) {
          return this.clone({ param: t, value: n, op: "a" });
        }
        appendAll(t) {
          const n = [];
          return (
            Object.keys(t).forEach((r) => {
              const i = t[r];
              Array.isArray(i)
                ? i.forEach((o) => {
                    n.push({ param: r, value: o, op: "a" });
                  })
                : n.push({ param: r, value: i, op: "a" });
            }),
            this.clone(n)
          );
        }
        set(t, n) {
          return this.clone({ param: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ param: t, value: n, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((t) => {
                const n = this.encoder.encodeKey(t);
                return this.map
                  .get(t)
                  .map((r) => n + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((t) => "" !== t)
              .join("&")
          );
        }
        clone(t) {
          const n = new Ir({ encoder: this.encoder });
          return (
            (n.cloneFrom = this.cloneFrom || this),
            (n.updates = (this.updates || []).concat(t)),
            n
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
              this.updates.forEach((t) => {
                switch (t.op) {
                  case "a":
                  case "s":
                    const n =
                      ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                    n.push(jc(t.value)), this.map.set(t.param, n);
                    break;
                  case "d":
                    if (void 0 === t.value) {
                      this.map.delete(t.param);
                      break;
                    }
                    {
                      let r = this.map.get(t.param) || [];
                      const i = r.indexOf(jc(t.value));
                      -1 !== i && r.splice(i, 1),
                        r.length > 0
                          ? this.map.set(t.param, r)
                          : this.map.delete(t.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class kH {
        constructor() {
          this.map = new Map();
        }
        set(t, n) {
          return this.map.set(t, n), this;
        }
        get(t) {
          return (
            this.map.has(t) || this.map.set(t, t.defaultValue()),
            this.map.get(t)
          );
        }
        delete(t) {
          return this.map.delete(t), this;
        }
        has(t) {
          return this.map.has(t);
        }
        keys() {
          return this.map.keys();
        }
      }
      function R0(e) {
        return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
      }
      function P0(e) {
        return typeof Blob < "u" && e instanceof Blob;
      }
      function F0(e) {
        return typeof FormData < "u" && e instanceof FormData;
      }
      class Qs {
        constructor(t, n, r, i) {
          let o;
          if (
            ((this.url = n),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = t.toUpperCase()),
            (function LH(e) {
              switch (e) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || i
              ? ((this.body = void 0 !== r ? r : null), (o = i))
              : (o = r),
            o &&
              ((this.reportProgress = !!o.reportProgress),
              (this.withCredentials = !!o.withCredentials),
              o.responseType && (this.responseType = o.responseType),
              o.headers && (this.headers = o.headers),
              o.context && (this.context = o.context),
              o.params && (this.params = o.params)),
            this.headers || (this.headers = new Hn()),
            this.context || (this.context = new kH()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = n;
            else {
              const a = n.indexOf("?");
              this.urlWithParams =
                n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new Ir()), (this.urlWithParams = n);
        }
        serializeBody() {
          return null === this.body
            ? null
            : R0(this.body) ||
              P0(this.body) ||
              F0(this.body) ||
              (function VH(e) {
                return (
                  typeof URLSearchParams < "u" && e instanceof URLSearchParams
                );
              })(this.body) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof Ir
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || F0(this.body)
            ? null
            : P0(this.body)
            ? this.body.type || null
            : R0(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof Ir
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(t = {}) {
          const n = t.method || this.method,
            r = t.url || this.url,
            i = t.responseType || this.responseType,
            o = void 0 !== t.body ? t.body : this.body,
            s =
              void 0 !== t.withCredentials
                ? t.withCredentials
                : this.withCredentials,
            a =
              void 0 !== t.reportProgress
                ? t.reportProgress
                : this.reportProgress;
          let l = t.headers || this.headers,
            c = t.params || this.params;
          const u = t.context ?? this.context;
          return (
            void 0 !== t.setHeaders &&
              (l = Object.keys(t.setHeaders).reduce(
                (d, f) => d.set(f, t.setHeaders[f]),
                l
              )),
            t.setParams &&
              (c = Object.keys(t.setParams).reduce(
                (d, f) => d.set(f, t.setParams[f]),
                c
              )),
            new Qs(n, r, o, {
              params: c,
              headers: l,
              context: u,
              reportProgress: a,
              responseType: i,
              withCredentials: s,
            })
          );
        }
      }
      var ze = (() => (
        ((ze = ze || {})[(ze.Sent = 0)] = "Sent"),
        (ze[(ze.UploadProgress = 1)] = "UploadProgress"),
        (ze[(ze.ResponseHeader = 2)] = "ResponseHeader"),
        (ze[(ze.DownloadProgress = 3)] = "DownloadProgress"),
        (ze[(ze.Response = 4)] = "Response"),
        (ze[(ze.User = 5)] = "User"),
        ze
      ))();
      class Lp {
        constructor(t, n = 200, r = "OK") {
          (this.headers = t.headers || new Hn()),
            (this.status = void 0 !== t.status ? t.status : n),
            (this.statusText = t.statusText || r),
            (this.url = t.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class Vp extends Lp {
        constructor(t = {}) {
          super(t), (this.type = ze.ResponseHeader);
        }
        clone(t = {}) {
          return new Vp({
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class wo extends Lp {
        constructor(t = {}) {
          super(t),
            (this.type = ze.Response),
            (this.body = void 0 !== t.body ? t.body : null);
        }
        clone(t = {}) {
          return new wo({
            body: void 0 !== t.body ? t.body : this.body,
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class k0 extends Lp {
        constructor(t) {
          super(t, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${t.url || "(unknown url)"}`
                : `Http failure response for ${t.url || "(unknown url)"}: ${
                    t.status
                  } ${t.statusText}`),
            (this.error = t.error || null);
        }
      }
      function Bp(e, t) {
        return {
          body: t,
          headers: e.headers,
          context: e.context,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let L0 = (() => {
        class e {
          constructor(n) {
            this.handler = n;
          }
          request(n, r, i = {}) {
            let o;
            if (n instanceof Qs) o = n;
            else {
              let l, c;
              (l = i.headers instanceof Hn ? i.headers : new Hn(i.headers)),
                i.params &&
                  (c =
                    i.params instanceof Ir
                      ? i.params
                      : new Ir({ fromObject: i.params })),
                (o = new Qs(n, r, void 0 !== i.body ? i.body : null, {
                  headers: l,
                  context: i.context,
                  params: c,
                  reportProgress: i.reportProgress,
                  responseType: i.responseType || "json",
                  withCredentials: i.withCredentials,
                }));
            }
            const s = $(o).pipe(po((l) => this.handler.handle(l)));
            if (n instanceof Qs || "events" === i.observe) return s;
            const a = s.pipe(sn((l) => l instanceof wo));
            switch (i.observe || "body") {
              case "body":
                switch (o.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      te((l) => {
                        if (null !== l.body && !(l.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return l.body;
                      })
                    );
                  case "blob":
                    return a.pipe(
                      te((l) => {
                        if (null !== l.body && !(l.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return l.body;
                      })
                    );
                  case "text":
                    return a.pipe(
                      te((l) => {
                        if (null !== l.body && "string" != typeof l.body)
                          throw new Error("Response is not a string.");
                        return l.body;
                      })
                    );
                  default:
                    return a.pipe(te((l) => l.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${i.observe}}`
                );
            }
          }
          delete(n, r = {}) {
            return this.request("DELETE", n, r);
          }
          get(n, r = {}) {
            return this.request("GET", n, r);
          }
          head(n, r = {}) {
            return this.request("HEAD", n, r);
          }
          jsonp(n, r) {
            return this.request("JSONP", n, {
              params: new Ir().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(n, r = {}) {
            return this.request("OPTIONS", n, r);
          }
          patch(n, r, i = {}) {
            return this.request("PATCH", n, Bp(i, r));
          }
          post(n, r, i = {}) {
            return this.request("POST", n, Bp(i, r));
          }
          put(n, r, i = {}) {
            return this.request("PUT", n, Bp(i, r));
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(Vc));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function j0(e, t) {
        return t(e);
      }
      function jH(e, t) {
        return (n, r) => t.intercept(n, { handle: (i) => e(i, r) });
      }
      const H0 = new S(""),
        Zs = new S(""),
        U0 = new S("");
      function UH() {
        let e = null;
        return (t, n) => {
          null === e &&
            (e = (M(H0, { optional: !0 }) ?? []).reduceRight(jH, j0));
          const r = M(Xl),
            i = r.add();
          return e(t, n).pipe(Ps(() => r.remove(i)));
        };
      }
      let $0 = (() => {
        class e extends Vc {
          constructor(n, r) {
            super(),
              (this.backend = n),
              (this.injector = r),
              (this.chain = null),
              (this.pendingTasks = M(Xl));
          }
          handle(n) {
            if (null === this.chain) {
              const i = Array.from(
                new Set([
                  ...this.injector.get(Zs),
                  ...this.injector.get(U0, []),
                ])
              );
              this.chain = i.reduceRight(
                (o, s) =>
                  (function HH(e, t, n) {
                    return (r, i) => n.runInContext(() => t(r, (o) => e(o, i)));
                  })(o, s, this.injector),
                j0
              );
            }
            const r = this.pendingTasks.add();
            return this.chain(n, (i) => this.backend.handle(i)).pipe(
              Ps(() => this.pendingTasks.remove(r))
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(Bc), D(Pn));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const GH = /^\)\]\}',?\n/;
      let q0 = (() => {
        class e {
          constructor(n) {
            this.xhrFactory = n;
          }
          handle(n) {
            if ("JSONP" === n.method) throw new v(-2800, !1);
            const r = this.xhrFactory;
            return (r.ɵloadImpl ? Qe(r.ɵloadImpl()) : $(null)).pipe(
              Zt(
                () =>
                  new ve((o) => {
                    const s = r.build();
                    if (
                      (s.open(n.method, n.urlWithParams),
                      n.withCredentials && (s.withCredentials = !0),
                      n.headers.forEach((g, m) =>
                        s.setRequestHeader(g, m.join(","))
                      ),
                      n.headers.has("Accept") ||
                        s.setRequestHeader(
                          "Accept",
                          "application/json, text/plain, */*"
                        ),
                      !n.headers.has("Content-Type"))
                    ) {
                      const g = n.detectContentTypeHeader();
                      null !== g && s.setRequestHeader("Content-Type", g);
                    }
                    if (n.responseType) {
                      const g = n.responseType.toLowerCase();
                      s.responseType = "json" !== g ? g : "text";
                    }
                    const a = n.serializeBody();
                    let l = null;
                    const c = () => {
                        if (null !== l) return l;
                        const g = s.statusText || "OK",
                          m = new Hn(s.getAllResponseHeaders()),
                          _ =
                            (function WH(e) {
                              return "responseURL" in e && e.responseURL
                                ? e.responseURL
                                : /^X-Request-URL:/m.test(
                                    e.getAllResponseHeaders()
                                  )
                                ? e.getResponseHeader("X-Request-URL")
                                : null;
                            })(s) || n.url;
                        return (
                          (l = new Vp({
                            headers: m,
                            status: s.status,
                            statusText: g,
                            url: _,
                          })),
                          l
                        );
                      },
                      u = () => {
                        let {
                            headers: g,
                            status: m,
                            statusText: _,
                            url: y,
                          } = c(),
                          I = null;
                        204 !== m &&
                          (I =
                            typeof s.response > "u"
                              ? s.responseText
                              : s.response),
                          0 === m && (m = I ? 200 : 0);
                        let P = m >= 200 && m < 300;
                        if ("json" === n.responseType && "string" == typeof I) {
                          const L = I;
                          I = I.replace(GH, "");
                          try {
                            I = "" !== I ? JSON.parse(I) : null;
                          } catch (he) {
                            (I = L),
                              P && ((P = !1), (I = { error: he, text: I }));
                          }
                        }
                        P
                          ? (o.next(
                              new wo({
                                body: I,
                                headers: g,
                                status: m,
                                statusText: _,
                                url: y || void 0,
                              })
                            ),
                            o.complete())
                          : o.error(
                              new k0({
                                error: I,
                                headers: g,
                                status: m,
                                statusText: _,
                                url: y || void 0,
                              })
                            );
                      },
                      d = (g) => {
                        const { url: m } = c(),
                          _ = new k0({
                            error: g,
                            status: s.status || 0,
                            statusText: s.statusText || "Unknown Error",
                            url: m || void 0,
                          });
                        o.error(_);
                      };
                    let f = !1;
                    const h = (g) => {
                        f || (o.next(c()), (f = !0));
                        let m = { type: ze.DownloadProgress, loaded: g.loaded };
                        g.lengthComputable && (m.total = g.total),
                          "text" === n.responseType &&
                            s.responseText &&
                            (m.partialText = s.responseText),
                          o.next(m);
                      },
                      p = (g) => {
                        let m = { type: ze.UploadProgress, loaded: g.loaded };
                        g.lengthComputable && (m.total = g.total), o.next(m);
                      };
                    return (
                      s.addEventListener("load", u),
                      s.addEventListener("error", d),
                      s.addEventListener("timeout", d),
                      s.addEventListener("abort", d),
                      n.reportProgress &&
                        (s.addEventListener("progress", h),
                        null !== a &&
                          s.upload &&
                          s.upload.addEventListener("progress", p)),
                      s.send(a),
                      o.next({ type: ze.Sent }),
                      () => {
                        s.removeEventListener("error", d),
                          s.removeEventListener("abort", d),
                          s.removeEventListener("load", u),
                          s.removeEventListener("timeout", d),
                          n.reportProgress &&
                            (s.removeEventListener("progress", h),
                            null !== a &&
                              s.upload &&
                              s.upload.removeEventListener("progress", p)),
                          s.readyState !== s.DONE && s.abort();
                      }
                    );
                  })
              )
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(JD));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const jp = new S("XSRF_ENABLED"),
        G0 = new S("XSRF_COOKIE_NAME", {
          providedIn: "root",
          factory: () => "XSRF-TOKEN",
        }),
        W0 = new S("XSRF_HEADER_NAME", {
          providedIn: "root",
          factory: () => "X-XSRF-TOKEN",
        });
      class K0 {}
      let ZH = (() => {
        class e {
          constructor(n, r, i) {
            (this.doc = n),
              (this.platform = r),
              (this.cookieName = i),
              (this.lastCookieString = ""),
              (this.lastToken = null),
              (this.parseCount = 0);
          }
          getToken() {
            if ("server" === this.platform) return null;
            const n = this.doc.cookie || "";
            return (
              n !== this.lastCookieString &&
                (this.parseCount++,
                (this.lastToken = UD(n, this.cookieName)),
                (this.lastCookieString = n)),
              this.lastToken
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(et), D(Zr), D(G0));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function YH(e, t) {
        const n = e.url.toLowerCase();
        if (
          !M(jp) ||
          "GET" === e.method ||
          "HEAD" === e.method ||
          n.startsWith("http://") ||
          n.startsWith("https://")
        )
          return t(e);
        const r = M(K0).getToken(),
          i = M(W0);
        return (
          null != r &&
            !e.headers.has(i) &&
            (e = e.clone({ headers: e.headers.set(i, r) })),
          t(e)
        );
      }
      var Ae = (() => (
        ((Ae = Ae || {})[(Ae.Interceptors = 0)] = "Interceptors"),
        (Ae[(Ae.LegacyInterceptors = 1)] = "LegacyInterceptors"),
        (Ae[(Ae.CustomXsrfConfiguration = 2)] = "CustomXsrfConfiguration"),
        (Ae[(Ae.NoXsrfProtection = 3)] = "NoXsrfProtection"),
        (Ae[(Ae.JsonpSupport = 4)] = "JsonpSupport"),
        (Ae[(Ae.RequestsMadeViaParent = 5)] = "RequestsMadeViaParent"),
        (Ae[(Ae.Fetch = 6)] = "Fetch"),
        Ae
      ))();
      function ci(e, t) {
        return { ɵkind: e, ɵproviders: t };
      }
      function XH(...e) {
        const t = [
          L0,
          q0,
          $0,
          { provide: Vc, useExisting: $0 },
          { provide: Bc, useExisting: q0 },
          { provide: Zs, useValue: YH, multi: !0 },
          { provide: jp, useValue: !0 },
          { provide: K0, useClass: ZH },
        ];
        for (const n of e) t.push(...n.ɵproviders);
        return _l(t);
      }
      const Q0 = new S("LEGACY_INTERCEPTOR_FN");
      let eU = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({
              providers: [
                XH(
                  ci(Ae.LegacyInterceptors, [
                    { provide: Q0, useFactory: UH },
                    { provide: Zs, useExisting: Q0, multi: !0 },
                  ])
                ),
              ],
            })),
            e
          );
        })(),
        xr = (() => {
          class e {
            constructor(n) {
              (this.http = n),
                (this.mainUrl = "http://localhost:5000/"),
                (this.backRouterUrl = "dining/");
            }
            fetchFoods() {
              return (
                console.log("ON Dinig Service"),
                this.http.get(
                  `${this.mainUrl}${this.backRouterUrl}fetchFoods`,
                  { withCredentials: !0 }
                )
              );
            }
            leadTables() {
              return this.http.get(
                `${this.mainUrl}${this.backRouterUrl}loadTable`,
                { withCredentials: !0 }
              );
            }
            diningLogin(n) {
              return this.http.post(
                `${this.mainUrl}${this.backRouterUrl}dinigLogin`,
                n,
                { withCredentials: !0 }
              );
            }
            verifyStaffs() {
              return this.http.get(
                `${this.mainUrl}${this.backRouterUrl}verifyStaff`,
                { withCredentials: !0 }
              );
            }
            logoutStaff() {
              return this.http.get(
                `${this.mainUrl}${this.backRouterUrl}logoutStaff`,
                { withCredentials: !0 }
              );
            }
            proceedOrder(n, r) {
              return this.http.post(
                `${this.mainUrl}${this.backRouterUrl}orderFoods`,
                { orders: n, table: r },
                { withCredentials: !0 }
              );
            }
            getAllOrders() {
              return this.http.get(
                `${this.mainUrl}${this.backRouterUrl}allOrder`,
                { withCredentials: !0 }
              );
            }
            loadOrders() {
              return this.http.get(
                `${this.mainUrl}${this.backRouterUrl}allOrder`,
                { withCredentials: !0 }
              );
            }
            filterFood(n) {
              return this.http.get(
                `${this.mainUrl}${this.backRouterUrl}filterFood/${n}`,
                { withCredentials: !0 }
              );
            }
            updateServingStatus(n) {
              return this.http.get(
                `${this.mainUrl}${this.backRouterUrl}updatingStatus/${n}`
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(L0));
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        sU = (() => {
          class e {
            constructor(n, r) {
              (this.diningService = n), (this.router = r);
            }
            ngOnInit() {}
            logoutStaff() {
              this.diningService.logoutStaff().subscribe((n) => {
                localStorage.removeItem("token"),
                  (location.href = "http://localhost:1200/diningLogin");
              });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(C(xr), C(st));
            }),
            (e.ɵcmp = Xt({
              type: e,
              selectors: [["app-sidebar"]],
              decls: 35,
              vars: 0,
              consts: [
                [1, "sidebar-container"],
                [1, "sidebar"],
                [1, "sidebar__logo"],
                [1, "sidebar__menu"],
                [1, "sidebar__item"],
                [1, "sidebar_design"],
                ["routerLink", "/viewFoods", 1, "sidebar__link", "active-link"],
                [1, "bx", "bx-home-alt", "sidebar__icon"],
                [1, "sidebar__name"],
                ["routerLink", "/orders", 1, "sidebar__link"],
                [1, "bx", "bx-user", "sidebar__icon"],
                ["routerLink", "tables", 1, "sidebar__link"],
                [1, "bx", "bx-book-alt", "sidebar__icon"],
                ["href", "#portfolio", 1, "sidebar__link"],
                [1, "bx", "bx-briefcase-alt", "sidebar__icon"],
                ["type", "button", 1, "sidebar__link", 3, "click"],
                [1, "bx", "bx-message-square-detail", "sidebar__icon"],
              ],
              template: function (n, r) {
                1 & n &&
                  (b(0, "div", 0)(1, "div", 1)(2, "div", 2),
                  x(3, "Turfyo"),
                  w(),
                  b(4, "ul", 3)(5, "li", 4)(6, "div", 5)(7, "a", 6),
                  se(8, "i", 7),
                  b(9, "span", 8),
                  x(10, "Foods"),
                  w()()()(),
                  b(11, "li", 4)(12, "div", 5)(13, "a", 9),
                  se(14, "i", 10),
                  b(15, "span", 8),
                  x(16, "Orders"),
                  w()()()(),
                  b(17, "li", 4)(18, "div", 5)(19, "a", 11),
                  se(20, "i", 12),
                  b(21, "span", 8),
                  x(22, "Tables"),
                  w()()()(),
                  b(23, "li", 4)(24, "div", 5)(25, "a", 13),
                  se(26, "i", 14),
                  b(27, "span", 8),
                  x(28, "Portfolio"),
                  w()()()(),
                  b(29, "li", 4)(30, "div", 5)(31, "a", 15),
                  ue("click", function () {
                    return r.logoutStaff();
                  }),
                  se(32, "i", 16),
                  b(33, "span", 8),
                  x(34, "Logout"),
                  w()()()()()()());
              },
              dependencies: [Lc],
              styles: [
                ".sidebar-container[_ngcontent-%COMP%]{height:100%;overflow-y:auto}ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{list-style:none}.sidebar[_ngcontent-%COMP%]{position:fixed;bottom:0;left:0;width:240px;height:100vh;background-color:#fff;z-index:1;transition:.4s;display:flex;flex-direction:column;align-items:center}.sidebar__logo[_ngcontent-%COMP%]{margin-top:1rem;color:var(--title-color);font-weight:600;font-size:1.25rem}.sidebar__menu[_ngcontent-%COMP%]{width:100%;margin-top:2rem;display:flex;flex-direction:column;align-items:center}.sidebar_design[_ngcontent-%COMP%]{background-color:#fff;box-shadow:0 0 11px orange;height:46px;width:177px;border-radius:20px}.sidebar_design[_ngcontent-%COMP%]:hover{background-color:#fff;transition:.4s;box-shadow:0 0 11px #ff8000;height:46px;width:177px;border-radius:20px}.sidebar__item[_ngcontent-%COMP%]{margin-bottom:1rem;display:flex;align-items:center}.sidebar__link[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;color:var(--title-color);font-weight:600;text-decoration:none}.sidebar__icon[_ngcontent-%COMP%]{font-size:1.5rem;margin-right:8px;margin-top:9px;color:orange}.sidebar__name[_ngcontent-%COMP%]{font-size:.75rem;margin-top:9px;display:flex;align-items:center;color:orange}.sidebar__img[_ngcontent-%COMP%]{margin-top:auto;margin-bottom:1rem}.sidebar__img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:32px;border-radius:50%}.active-link[_ngcontent-%COMP%]{color:var(--first-color)}.scroll-sidebar[_ngcontent-%COMP%]{box-shadow:0 1px 12px hsla(var(--hue),var(--sat),15%,.15)}@media screen and (max-width: 767px){.sidebar[_ngcontent-%COMP%]{position:fixed;bottom:0;left:0;background-color:#fff;box-shadow:0 -1px 12px hsla(var(--hue),var(--sat),15%,.15);width:100%;height:4rem;padding:0 1rem;display:grid;align-content:center;border-radius:1.25rem 1.25rem 0 0;transition:.4s}.sidebar__logo[_ngcontent-%COMP%]{display:none}.sidebar__menu[_ngcontent-%COMP%]{flex-direction:row;justify-content:space-around;width:calc(100% - 80px)}.sidebar_design[_ngcontent-%COMP%]{background-color:#fff;box-shadow:none;height:60px;width:24px}.sidebar_design[_ngcontent-%COMP%]:hover{background-color:#fff;transition:.4s;box-shadow:none;height:60px;width:24px}.sidebar__item[_ngcontent-%COMP%]{margin-bottom:0;text-align:center}.sidebar__link[_ngcontent-%COMP%]{flex-direction:column;align-items:center;text-align:center}.sidebar__icon[_ngcontent-%COMP%]{margin-right:0}.sidebar__name[_ngcontent-%COMP%]{font-size:.628rem;text-align:center}.sidebar__img[_ngcontent-%COMP%]{margin-top:0;margin-bottom:0}.sidebar__img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:24px}}@media screen and (min-width: 576px){.sidebar__item[_ngcontent-%COMP%]{justify-content:center;column-gap:3rem}}",
              ],
            })),
            e
          );
        })(),
        aU = (() => {
          class e {
            constructor(n, r) {
              (this.diningService = n), (this.router = r);
            }
            ngOnInit() {
              this.diningService.verifyStaffs().subscribe(
                (n) => {},
                (n) => {
                  console.log(n),
                    localStorage.removeItem("token"),
                    this.router.navigate(["/diningLogin"]);
                }
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(C(xr), C(st));
            }),
            (e.ɵcmp = Xt({
              type: e,
              selectors: [["app-dining-desk"]],
              decls: 7,
              vars: 0,
              consts: [
                [1, "container-fluid", "w-100"],
                [1, "row"],
                [1, "col-md-2"],
                [1, "col-md-10"],
                [1, "foem-sign"],
              ],
              template: function (n, r) {
                1 & n &&
                  (b(0, "div", 0)(1, "div", 1)(2, "div", 2),
                  se(3, "app-sidebar"),
                  w(),
                  b(4, "div", 3)(5, "main", 4),
                  se(6, "router-outlet"),
                  w()()()());
              },
              dependencies: [Ic, sU],
              styles: [
                ".scroll__content[_ngcontent-%COMP%]{width:28%}.main__content[_ngcontent-%COMP%]{width:72%}@media screen and (max-width:817px){.main__content[_ngcontent-%COMP%]{width:100%}}",
              ],
            })),
            e
          );
        })();
      const Un = Object.create(null);
      (Un.open = "0"),
        (Un.close = "1"),
        (Un.ping = "2"),
        (Un.pong = "3"),
        (Un.message = "4"),
        (Un.upgrade = "5"),
        (Un.noop = "6");
      const Uc = Object.create(null);
      Object.keys(Un).forEach((e) => {
        Uc[Un[e]] = e;
      });
      const lU = { type: "error", data: "parser error" },
        Z0 =
          "function" == typeof Blob ||
          (typeof Blob < "u" &&
            "[object BlobConstructor]" ===
              Object.prototype.toString.call(Blob)),
        Y0 = "function" == typeof ArrayBuffer,
        X0 = (e) =>
          "function" == typeof ArrayBuffer.isView
            ? ArrayBuffer.isView(e)
            : e && e.buffer instanceof ArrayBuffer,
        Hp = ({ type: e, data: t }, n, r) =>
          Z0 && t instanceof Blob
            ? n
              ? r(t)
              : J0(t, r)
            : Y0 && (t instanceof ArrayBuffer || X0(t))
            ? n
              ? r(t)
              : J0(new Blob([t]), r)
            : r(Un[e] + (t || "")),
        J0 = (e, t) => {
          const n = new FileReader();
          return (
            (n.onload = function () {
              const r = n.result.split(",")[1];
              t("b" + (r || ""));
            }),
            n.readAsDataURL(e)
          );
        };
      function eS(e) {
        return e instanceof Uint8Array
          ? e
          : e instanceof ArrayBuffer
          ? new Uint8Array(e)
          : new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
      }
      let Up;
      function cU(e, t) {
        return Z0 && e.data instanceof Blob
          ? e.data.arrayBuffer().then(eS).then(t)
          : Y0 && (e.data instanceof ArrayBuffer || X0(e.data))
          ? t(eS(e.data))
          : void Hp(e, !1, (n) => {
              Up || (Up = new TextEncoder()), t(Up.encode(n));
            });
      }
      const Ys = typeof Uint8Array > "u" ? [] : new Uint8Array(256);
      for (let e = 0; e < 64; e++)
        Ys[
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charCodeAt(
            e
          )
        ] = e;
      const dU = "function" == typeof ArrayBuffer,
        $p = (e, t) => {
          if ("string" != typeof e) return { type: "message", data: tS(e, t) };
          const n = e.charAt(0);
          return "b" === n
            ? { type: "message", data: fU(e.substring(1), t) }
            : Uc[n]
            ? e.length > 1
              ? { type: Uc[n], data: e.substring(1) }
              : { type: Uc[n] }
            : lU;
        },
        fU = (e, t) => {
          if (dU) {
            const n = ((e) => {
              let r,
                o,
                s,
                a,
                l,
                t = 0.75 * e.length,
                n = e.length,
                i = 0;
              "=" === e[e.length - 1] && (t--, "=" === e[e.length - 2] && t--);
              const c = new ArrayBuffer(t),
                u = new Uint8Array(c);
              for (r = 0; r < n; r += 4)
                (o = Ys[e.charCodeAt(r)]),
                  (s = Ys[e.charCodeAt(r + 1)]),
                  (a = Ys[e.charCodeAt(r + 2)]),
                  (l = Ys[e.charCodeAt(r + 3)]),
                  (u[i++] = (o << 2) | (s >> 4)),
                  (u[i++] = ((15 & s) << 4) | (a >> 2)),
                  (u[i++] = ((3 & a) << 6) | (63 & l));
              return c;
            })(e);
            return tS(n, t);
          }
          return { base64: !0, data: e };
        },
        tS = (e, t) =>
          "blob" === t
            ? e instanceof Blob
              ? e
              : new Blob([e])
            : e instanceof ArrayBuffer
            ? e
            : e.buffer,
        nS = String.fromCharCode(30);
      let zp;
      function qe(e) {
        if (e)
          return (function mU(e) {
            for (var t in qe.prototype) e[t] = qe.prototype[t];
            return e;
          })(e);
      }
      (qe.prototype.on = qe.prototype.addEventListener =
        function (e, t) {
          return (
            (this._callbacks = this._callbacks || {}),
            (this._callbacks["$" + e] = this._callbacks["$" + e] || []).push(t),
            this
          );
        }),
        (qe.prototype.once = function (e, t) {
          function n() {
            this.off(e, n), t.apply(this, arguments);
          }
          return (n.fn = t), this.on(e, n), this;
        }),
        (qe.prototype.off =
          qe.prototype.removeListener =
          qe.prototype.removeAllListeners =
          qe.prototype.removeEventListener =
            function (e, t) {
              if (
                ((this._callbacks = this._callbacks || {}),
                0 == arguments.length)
              )
                return (this._callbacks = {}), this;
              var n = this._callbacks["$" + e];
              if (!n) return this;
              if (1 == arguments.length)
                return delete this._callbacks["$" + e], this;
              for (var r, i = 0; i < n.length; i++)
                if ((r = n[i]) === t || r.fn === t) {
                  n.splice(i, 1);
                  break;
                }
              return 0 === n.length && delete this._callbacks["$" + e], this;
            }),
        (qe.prototype.emitReserved = qe.prototype.emit =
          function (e) {
            this._callbacks = this._callbacks || {};
            for (
              var t = new Array(arguments.length - 1),
                n = this._callbacks["$" + e],
                r = 1;
              r < arguments.length;
              r++
            )
              t[r - 1] = arguments[r];
            if (n) {
              r = 0;
              for (var i = (n = n.slice(0)).length; r < i; ++r)
                n[r].apply(this, t);
            }
            return this;
          }),
        (qe.prototype.listeners = function (e) {
          return (
            (this._callbacks = this._callbacks || {}),
            this._callbacks["$" + e] || []
          );
        }),
        (qe.prototype.hasListeners = function (e) {
          return !!this.listeners(e).length;
        });
      const an =
        typeof self < "u"
          ? self
          : typeof window < "u"
          ? window
          : Function("return this")();
      function iS(e, ...t) {
        return t.reduce(
          (n, r) => (e.hasOwnProperty(r) && (n[r] = e[r]), n),
          {}
        );
      }
      const yU = an.setTimeout,
        vU = an.clearTimeout;
      function $c(e, t) {
        t.useNativeTimers
          ? ((e.setTimeoutFn = yU.bind(an)), (e.clearTimeoutFn = vU.bind(an)))
          : ((e.setTimeoutFn = an.setTimeout.bind(an)),
            (e.clearTimeoutFn = an.clearTimeout.bind(an)));
      }
      function CU(e) {
        return "string" == typeof e
          ? (function bU(e) {
              let t = 0,
                n = 0;
              for (let r = 0, i = e.length; r < i; r++)
                (t = e.charCodeAt(r)),
                  t < 128
                    ? (n += 1)
                    : t < 2048
                    ? (n += 2)
                    : t < 55296 || t >= 57344
                    ? (n += 3)
                    : (r++, (n += 4));
              return n;
            })(e)
          : Math.ceil(1.33 * (e.byteLength || e.size));
      }
      class EU extends Error {
        constructor(t, n, r) {
          super(t),
            (this.description = n),
            (this.context = r),
            (this.type = "TransportError");
        }
      }
      class qp extends qe {
        constructor(t) {
          super(),
            (this.writable = !1),
            $c(this, t),
            (this.opts = t),
            (this.query = t.query),
            (this.socket = t.socket);
        }
        onError(t, n, r) {
          return super.emitReserved("error", new EU(t, n, r)), this;
        }
        open() {
          return (this.readyState = "opening"), this.doOpen(), this;
        }
        close() {
          return (
            ("opening" === this.readyState || "open" === this.readyState) &&
              (this.doClose(), this.onClose()),
            this
          );
        }
        send(t) {
          "open" === this.readyState && this.write(t);
        }
        onOpen() {
          (this.readyState = "open"),
            (this.writable = !0),
            super.emitReserved("open");
        }
        onData(t) {
          const n = $p(t, this.socket.binaryType);
          this.onPacket(n);
        }
        onPacket(t) {
          super.emitReserved("packet", t);
        }
        onClose(t) {
          (this.readyState = "closed"), super.emitReserved("close", t);
        }
        pause(t) {}
        createUri(t, n = {}) {
          return (
            t +
            "://" +
            this._hostname() +
            this._port() +
            this.opts.path +
            this._query(n)
          );
        }
        _hostname() {
          const t = this.opts.hostname;
          return -1 === t.indexOf(":") ? t : "[" + t + "]";
        }
        _port() {
          return this.opts.port &&
            ((this.opts.secure && +(443 !== this.opts.port)) ||
              (!this.opts.secure && 80 !== Number(this.opts.port)))
            ? ":" + this.opts.port
            : "";
        }
        _query(t) {
          const n = (function wU(e) {
            let t = "";
            for (let n in e)
              e.hasOwnProperty(n) &&
                (t.length && (t += "&"),
                (t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n])));
            return t;
          })(t);
          return n.length ? "?" + n : "";
        }
      }
      const oS =
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(
            ""
          ),
        zc = 64,
        sS = {};
      let lS,
        aS = 0,
        Or = 0;
      function cS(e) {
        let t = "";
        do {
          (t = oS[e % zc] + t), (e = Math.floor(e / zc));
        } while (e > 0);
        return t;
      }
      function uS() {
        const e = cS(+new Date());
        return e !== lS ? ((aS = 0), (lS = e)) : e + "." + cS(aS++);
      }
      for (; Or < zc; Or++) sS[oS[Or]] = Or;
      let dS = !1;
      try {
        dS =
          typeof XMLHttpRequest < "u" &&
          "withCredentials" in new XMLHttpRequest();
      } catch {}
      const SU = dS;
      function fS(e) {
        const t = e.xdomain;
        try {
          if (typeof XMLHttpRequest < "u" && (!t || SU))
            return new XMLHttpRequest();
        } catch {}
        if (!t)
          try {
            return new an[["Active"].concat("Object").join("X")](
              "Microsoft.XMLHTTP"
            );
          } catch {}
      }
      function MU() {}
      const TU = null != new fS({ xdomain: !1 }).responseType;
      let qc = (() => {
        class e extends qe {
          constructor(n, r) {
            super(),
              $c(this, r),
              (this.opts = r),
              (this.method = r.method || "GET"),
              (this.uri = n),
              (this.data = void 0 !== r.data ? r.data : null),
              this.create();
          }
          create() {
            var n;
            const r = iS(
              this.opts,
              "agent",
              "pfx",
              "key",
              "passphrase",
              "cert",
              "ca",
              "ciphers",
              "rejectUnauthorized",
              "autoUnref"
            );
            r.xdomain = !!this.opts.xd;
            const i = (this.xhr = new fS(r));
            try {
              i.open(this.method, this.uri, !0);
              try {
                if (this.opts.extraHeaders) {
                  i.setDisableHeaderCheck && i.setDisableHeaderCheck(!0);
                  for (let o in this.opts.extraHeaders)
                    this.opts.extraHeaders.hasOwnProperty(o) &&
                      i.setRequestHeader(o, this.opts.extraHeaders[o]);
                }
              } catch {}
              if ("POST" === this.method)
                try {
                  i.setRequestHeader(
                    "Content-type",
                    "text/plain;charset=UTF-8"
                  );
                } catch {}
              try {
                i.setRequestHeader("Accept", "*/*");
              } catch {}
              null === (n = this.opts.cookieJar) ||
                void 0 === n ||
                n.addCookies(i),
                "withCredentials" in i &&
                  (i.withCredentials = this.opts.withCredentials),
                this.opts.requestTimeout &&
                  (i.timeout = this.opts.requestTimeout),
                (i.onreadystatechange = () => {
                  var o;
                  3 === i.readyState &&
                    (null === (o = this.opts.cookieJar) ||
                      void 0 === o ||
                      o.parseCookies(i)),
                    4 === i.readyState &&
                      (200 === i.status || 1223 === i.status
                        ? this.onLoad()
                        : this.setTimeoutFn(() => {
                            this.onError(
                              "number" == typeof i.status ? i.status : 0
                            );
                          }, 0));
                }),
                i.send(this.data);
            } catch (o) {
              return void this.setTimeoutFn(() => {
                this.onError(o);
              }, 0);
            }
            typeof document < "u" &&
              ((this.index = e.requestsCount++),
              (e.requests[this.index] = this));
          }
          onError(n) {
            this.emitReserved("error", n, this.xhr), this.cleanup(!0);
          }
          cleanup(n) {
            if (!(typeof this.xhr > "u" || null === this.xhr)) {
              if (((this.xhr.onreadystatechange = MU), n))
                try {
                  this.xhr.abort();
                } catch {}
              typeof document < "u" && delete e.requests[this.index],
                (this.xhr = null);
            }
          }
          onLoad() {
            const n = this.xhr.responseText;
            null !== n &&
              (this.emitReserved("data", n),
              this.emitReserved("success"),
              this.cleanup());
          }
          abort() {
            this.cleanup();
          }
        }
        return (e.requestsCount = 0), (e.requests = {}), e;
      })();
      function hS() {
        for (let e in qc.requests)
          qc.requests.hasOwnProperty(e) && qc.requests[e].abort();
      }
      typeof document < "u" &&
        ("function" == typeof attachEvent
          ? attachEvent("onunload", hS)
          : "function" == typeof addEventListener &&
            addEventListener(
              "onpagehide" in an ? "pagehide" : "unload",
              hS,
              !1
            ));
      const Gp =
          "function" == typeof Promise && "function" == typeof Promise.resolve
            ? (t) => Promise.resolve().then(t)
            : (t, n) => n(t, 0),
        Gc = an.WebSocket || an.MozWebSocket,
        pS =
          typeof navigator < "u" &&
          "string" == typeof navigator.product &&
          "reactnative" === navigator.product.toLowerCase();
      function OU(e, t) {
        return (
          "message" === e.type &&
          "string" != typeof e.data &&
          t[0] >= 48 &&
          t[0] <= 54
        );
      }
      const RU = {
          websocket: class xU extends qp {
            constructor(t) {
              super(t), (this.supportsBinary = !t.forceBase64);
            }
            get name() {
              return "websocket";
            }
            doOpen() {
              if (!this.check()) return;
              const t = this.uri(),
                n = this.opts.protocols,
                r = pS
                  ? {}
                  : iS(
                      this.opts,
                      "agent",
                      "perMessageDeflate",
                      "pfx",
                      "key",
                      "passphrase",
                      "cert",
                      "ca",
                      "ciphers",
                      "rejectUnauthorized",
                      "localAddress",
                      "protocolVersion",
                      "origin",
                      "maxPayload",
                      "family",
                      "checkServerIdentity"
                    );
              this.opts.extraHeaders && (r.headers = this.opts.extraHeaders);
              try {
                this.ws = pS ? new Gc(t, n, r) : n ? new Gc(t, n) : new Gc(t);
              } catch (i) {
                return this.emitReserved("error", i);
              }
              (this.ws.binaryType = this.socket.binaryType || "arraybuffer"),
                this.addEventListeners();
            }
            addEventListeners() {
              (this.ws.onopen = () => {
                this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
              }),
                (this.ws.onclose = (t) =>
                  this.onClose({
                    description: "websocket connection closed",
                    context: t,
                  })),
                (this.ws.onmessage = (t) => this.onData(t.data)),
                (this.ws.onerror = (t) => this.onError("websocket error", t));
            }
            write(t) {
              this.writable = !1;
              for (let n = 0; n < t.length; n++) {
                const i = n === t.length - 1;
                Hp(t[n], this.supportsBinary, (o) => {
                  try {
                    this.ws.send(o);
                  } catch {}
                  i &&
                    Gp(() => {
                      (this.writable = !0), this.emitReserved("drain");
                    }, this.setTimeoutFn);
                });
              }
            }
            doClose() {
              typeof this.ws < "u" && (this.ws.close(), (this.ws = null));
            }
            uri() {
              const t = this.opts.secure ? "wss" : "ws",
                n = this.query || {};
              return (
                this.opts.timestampRequests &&
                  (n[this.opts.timestampParam] = uS()),
                this.supportsBinary || (n.b64 = 1),
                this.createUri(t, n)
              );
            }
            check() {
              return !!Gc;
            }
          },
          webtransport: class NU extends qp {
            get name() {
              return "webtransport";
            }
            doOpen() {
              "function" == typeof WebTransport &&
                ((this.transport = new WebTransport(
                  this.createUri("https"),
                  this.opts.transportOptions[this.name]
                )),
                this.transport.closed
                  .then(() => {
                    this.onClose();
                  })
                  .catch((t) => {
                    this.onError("webtransport error", t);
                  }),
                this.transport.ready.then(() => {
                  this.transport.createBidirectionalStream().then((t) => {
                    const n = t.readable.getReader();
                    let r;
                    this.writer = t.writable.getWriter();
                    const i = () => {
                      n.read()
                        .then(({ done: s, value: a }) => {
                          s ||
                            (r || 1 !== a.byteLength || 54 !== a[0]
                              ? (this.onPacket(
                                  (function gU(e, t, n) {
                                    return (
                                      zp || (zp = new TextDecoder()),
                                      $p(
                                        t || e[0] < 48 || e[0] > 54
                                          ? e
                                          : zp.decode(e),
                                        n
                                      )
                                    );
                                  })(a, r, "arraybuffer")
                                ),
                                (r = !1))
                              : (r = !0),
                            i());
                        })
                        .catch((s) => {});
                    };
                    i();
                    const o = this.query.sid
                      ? `0{"sid":"${this.query.sid}"}`
                      : "0";
                    this.writer
                      .write(new TextEncoder().encode(o))
                      .then(() => this.onOpen());
                  });
                }));
            }
            write(t) {
              this.writable = !1;
              for (let n = 0; n < t.length; n++) {
                const r = t[n],
                  i = n === t.length - 1;
                cU(r, (o) => {
                  OU(r, o) && this.writer.write(Uint8Array.of(54)),
                    this.writer.write(o).then(() => {
                      i &&
                        Gp(() => {
                          (this.writable = !0), this.emitReserved("drain");
                        }, this.setTimeoutFn);
                    });
                });
              }
            }
            doClose() {
              var t;
              null === (t = this.transport) || void 0 === t || t.close();
            }
          },
          polling: class AU extends qp {
            constructor(t) {
              if ((super(t), (this.polling = !1), typeof location < "u")) {
                const r = "https:" === location.protocol;
                let i = location.port;
                i || (i = r ? "443" : "80"),
                  (this.xd =
                    (typeof location < "u" &&
                      t.hostname !== location.hostname) ||
                    i !== t.port);
              }
              (this.supportsBinary = TU && !(t && t.forceBase64)),
                this.opts.withCredentials && (this.cookieJar = void 0);
            }
            get name() {
              return "polling";
            }
            doOpen() {
              this.poll();
            }
            pause(t) {
              this.readyState = "pausing";
              const n = () => {
                (this.readyState = "paused"), t();
              };
              if (this.polling || !this.writable) {
                let r = 0;
                this.polling &&
                  (r++,
                  this.once("pollComplete", function () {
                    --r || n();
                  })),
                  this.writable ||
                    (r++,
                    this.once("drain", function () {
                      --r || n();
                    }));
              } else n();
            }
            poll() {
              (this.polling = !0), this.doPoll(), this.emitReserved("poll");
            }
            onData(t) {
              ((e, t) => {
                const n = e.split(nS),
                  r = [];
                for (let i = 0; i < n.length; i++) {
                  const o = $p(n[i], t);
                  if ((r.push(o), "error" === o.type)) break;
                }
                return r;
              })(t, this.socket.binaryType).forEach((r) => {
                if (
                  ("opening" === this.readyState &&
                    "open" === r.type &&
                    this.onOpen(),
                  "close" === r.type)
                )
                  return (
                    this.onClose({
                      description: "transport closed by the server",
                    }),
                    !1
                  );
                this.onPacket(r);
              }),
                "closed" !== this.readyState &&
                  ((this.polling = !1),
                  this.emitReserved("pollComplete"),
                  "open" === this.readyState && this.poll());
            }
            doClose() {
              const t = () => {
                this.write([{ type: "close" }]);
              };
              "open" === this.readyState ? t() : this.once("open", t);
            }
            write(t) {
              (this.writable = !1),
                ((e, t) => {
                  const n = e.length,
                    r = new Array(n);
                  let i = 0;
                  e.forEach((o, s) => {
                    Hp(o, !1, (a) => {
                      (r[s] = a), ++i === n && t(r.join(nS));
                    });
                  });
                })(t, (n) => {
                  this.doWrite(n, () => {
                    (this.writable = !0), this.emitReserved("drain");
                  });
                });
            }
            uri() {
              const t = this.opts.secure ? "https" : "http",
                n = this.query || {};
              return (
                !1 !== this.opts.timestampRequests &&
                  (n[this.opts.timestampParam] = uS()),
                !this.supportsBinary && !n.sid && (n.b64 = 1),
                this.createUri(t, n)
              );
            }
            request(t = {}) {
              return (
                Object.assign(
                  t,
                  { xd: this.xd, cookieJar: this.cookieJar },
                  this.opts
                ),
                new qc(this.uri(), t)
              );
            }
            doWrite(t, n) {
              const r = this.request({ method: "POST", data: t });
              r.on("success", n),
                r.on("error", (i, o) => {
                  this.onError("xhr post error", i, o);
                });
            }
            doPoll() {
              const t = this.request();
              t.on("data", this.onData.bind(this)),
                t.on("error", (n, r) => {
                  this.onError("xhr poll error", n, r);
                }),
                (this.pollXhr = t);
            }
          },
        },
        PU =
          /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
        FU = [
          "source",
          "protocol",
          "authority",
          "userInfo",
          "user",
          "password",
          "host",
          "port",
          "relative",
          "path",
          "directory",
          "file",
          "query",
          "anchor",
        ];
      function Kp(e) {
        const t = e,
          n = e.indexOf("["),
          r = e.indexOf("]");
        -1 != n &&
          -1 != r &&
          (e =
            e.substring(0, n) +
            e.substring(n, r).replace(/:/g, ";") +
            e.substring(r, e.length));
        let i = PU.exec(e || ""),
          o = {},
          s = 14;
        for (; s--; ) o[FU[s]] = i[s] || "";
        return (
          -1 != n &&
            -1 != r &&
            ((o.source = t),
            (o.host = o.host
              .substring(1, o.host.length - 1)
              .replace(/;/g, ":")),
            (o.authority = o.authority
              .replace("[", "")
              .replace("]", "")
              .replace(/;/g, ":")),
            (o.ipv6uri = !0)),
          (o.pathNames = (function kU(e, t) {
            const r = t.replace(/\/{2,9}/g, "/").split("/");
            return (
              ("/" == t.slice(0, 1) || 0 === t.length) && r.splice(0, 1),
              "/" == t.slice(-1) && r.splice(r.length - 1, 1),
              r
            );
          })(0, o.path)),
          (o.queryKey = (function LU(e, t) {
            const n = {};
            return (
              t.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (r, i, o) {
                i && (n[i] = o);
              }),
              n
            );
          })(0, o.query)),
          o
        );
      }
      let gS = (() => {
        class e extends qe {
          constructor(n, r = {}) {
            super(),
              (this.writeBuffer = []),
              n && "object" == typeof n && ((r = n), (n = null)),
              n
                ? ((n = Kp(n)),
                  (r.hostname = n.host),
                  (r.secure = "https" === n.protocol || "wss" === n.protocol),
                  (r.port = n.port),
                  n.query && (r.query = n.query))
                : r.host && (r.hostname = Kp(r.host).host),
              $c(this, r),
              (this.secure =
                null != r.secure
                  ? r.secure
                  : typeof location < "u" && "https:" === location.protocol),
              r.hostname && !r.port && (r.port = this.secure ? "443" : "80"),
              (this.hostname =
                r.hostname ||
                (typeof location < "u" ? location.hostname : "localhost")),
              (this.port =
                r.port ||
                (typeof location < "u" && location.port
                  ? location.port
                  : this.secure
                  ? "443"
                  : "80")),
              (this.transports = r.transports || [
                "polling",
                "websocket",
                "webtransport",
              ]),
              (this.writeBuffer = []),
              (this.prevBufferLen = 0),
              (this.opts = Object.assign(
                {
                  path: "/engine.io",
                  agent: !1,
                  withCredentials: !1,
                  upgrade: !0,
                  timestampParam: "t",
                  rememberUpgrade: !1,
                  addTrailingSlash: !0,
                  rejectUnauthorized: !0,
                  perMessageDeflate: { threshold: 1024 },
                  transportOptions: {},
                  closeOnBeforeunload: !1,
                },
                r
              )),
              (this.opts.path =
                this.opts.path.replace(/\/$/, "") +
                (this.opts.addTrailingSlash ? "/" : "")),
              "string" == typeof this.opts.query &&
                (this.opts.query = (function DU(e) {
                  let t = {},
                    n = e.split("&");
                  for (let r = 0, i = n.length; r < i; r++) {
                    let o = n[r].split("=");
                    t[decodeURIComponent(o[0])] = decodeURIComponent(o[1]);
                  }
                  return t;
                })(this.opts.query)),
              (this.id = null),
              (this.upgrades = null),
              (this.pingInterval = null),
              (this.pingTimeout = null),
              (this.pingTimeoutTimer = null),
              "function" == typeof addEventListener &&
                (this.opts.closeOnBeforeunload &&
                  ((this.beforeunloadEventListener = () => {
                    this.transport &&
                      (this.transport.removeAllListeners(),
                      this.transport.close());
                  }),
                  addEventListener(
                    "beforeunload",
                    this.beforeunloadEventListener,
                    !1
                  )),
                "localhost" !== this.hostname &&
                  ((this.offlineEventListener = () => {
                    this.onClose("transport close", {
                      description: "network connection lost",
                    });
                  }),
                  addEventListener("offline", this.offlineEventListener, !1))),
              this.open();
          }
          createTransport(n) {
            const r = Object.assign({}, this.opts.query);
            (r.EIO = 4), (r.transport = n), this.id && (r.sid = this.id);
            const i = Object.assign(
              {},
              this.opts,
              {
                query: r,
                socket: this,
                hostname: this.hostname,
                secure: this.secure,
                port: this.port,
              },
              this.opts.transportOptions[n]
            );
            return new RU[n](i);
          }
          open() {
            let n;
            if (
              this.opts.rememberUpgrade &&
              e.priorWebsocketSuccess &&
              -1 !== this.transports.indexOf("websocket")
            )
              n = "websocket";
            else {
              if (0 === this.transports.length)
                return void this.setTimeoutFn(() => {
                  this.emitReserved("error", "No transports available");
                }, 0);
              n = this.transports[0];
            }
            this.readyState = "opening";
            try {
              n = this.createTransport(n);
            } catch {
              return this.transports.shift(), void this.open();
            }
            n.open(), this.setTransport(n);
          }
          setTransport(n) {
            this.transport && this.transport.removeAllListeners(),
              (this.transport = n),
              n
                .on("drain", this.onDrain.bind(this))
                .on("packet", this.onPacket.bind(this))
                .on("error", this.onError.bind(this))
                .on("close", (r) => this.onClose("transport close", r));
          }
          probe(n) {
            let r = this.createTransport(n),
              i = !1;
            e.priorWebsocketSuccess = !1;
            const o = () => {
              i ||
                (r.send([{ type: "ping", data: "probe" }]),
                r.once("packet", (f) => {
                  if (!i)
                    if ("pong" === f.type && "probe" === f.data) {
                      if (
                        ((this.upgrading = !0),
                        this.emitReserved("upgrading", r),
                        !r)
                      )
                        return;
                      (e.priorWebsocketSuccess = "websocket" === r.name),
                        this.transport.pause(() => {
                          i ||
                            ("closed" !== this.readyState &&
                              (d(),
                              this.setTransport(r),
                              r.send([{ type: "upgrade" }]),
                              this.emitReserved("upgrade", r),
                              (r = null),
                              (this.upgrading = !1),
                              this.flush()));
                        });
                    } else {
                      const h = new Error("probe error");
                      (h.transport = r.name),
                        this.emitReserved("upgradeError", h);
                    }
                }));
            };
            function s() {
              i || ((i = !0), d(), r.close(), (r = null));
            }
            const a = (f) => {
              const h = new Error("probe error: " + f);
              (h.transport = r.name), s(), this.emitReserved("upgradeError", h);
            };
            function l() {
              a("transport closed");
            }
            function c() {
              a("socket closed");
            }
            function u(f) {
              r && f.name !== r.name && s();
            }
            const d = () => {
              r.removeListener("open", o),
                r.removeListener("error", a),
                r.removeListener("close", l),
                this.off("close", c),
                this.off("upgrading", u);
            };
            r.once("open", o),
              r.once("error", a),
              r.once("close", l),
              this.once("close", c),
              this.once("upgrading", u),
              -1 !== this.upgrades.indexOf("webtransport") &&
              "webtransport" !== n
                ? this.setTimeoutFn(() => {
                    i || r.open();
                  }, 200)
                : r.open();
          }
          onOpen() {
            if (
              ((this.readyState = "open"),
              (e.priorWebsocketSuccess = "websocket" === this.transport.name),
              this.emitReserved("open"),
              this.flush(),
              "open" === this.readyState && this.opts.upgrade)
            ) {
              let n = 0;
              const r = this.upgrades.length;
              for (; n < r; n++) this.probe(this.upgrades[n]);
            }
          }
          onPacket(n) {
            if (
              "opening" === this.readyState ||
              "open" === this.readyState ||
              "closing" === this.readyState
            )
              switch (
                (this.emitReserved("packet", n),
                this.emitReserved("heartbeat"),
                n.type)
              ) {
                case "open":
                  this.onHandshake(JSON.parse(n.data));
                  break;
                case "ping":
                  this.resetPingTimeout(),
                    this.sendPacket("pong"),
                    this.emitReserved("ping"),
                    this.emitReserved("pong");
                  break;
                case "error":
                  const r = new Error("server error");
                  (r.code = n.data), this.onError(r);
                  break;
                case "message":
                  this.emitReserved("data", n.data),
                    this.emitReserved("message", n.data);
              }
          }
          onHandshake(n) {
            this.emitReserved("handshake", n),
              (this.id = n.sid),
              (this.transport.query.sid = n.sid),
              (this.upgrades = this.filterUpgrades(n.upgrades)),
              (this.pingInterval = n.pingInterval),
              (this.pingTimeout = n.pingTimeout),
              (this.maxPayload = n.maxPayload),
              this.onOpen(),
              "closed" !== this.readyState && this.resetPingTimeout();
          }
          resetPingTimeout() {
            this.clearTimeoutFn(this.pingTimeoutTimer),
              (this.pingTimeoutTimer = this.setTimeoutFn(() => {
                this.onClose("ping timeout");
              }, this.pingInterval + this.pingTimeout)),
              this.opts.autoUnref && this.pingTimeoutTimer.unref();
          }
          onDrain() {
            this.writeBuffer.splice(0, this.prevBufferLen),
              (this.prevBufferLen = 0),
              0 === this.writeBuffer.length
                ? this.emitReserved("drain")
                : this.flush();
          }
          flush() {
            if (
              "closed" !== this.readyState &&
              this.transport.writable &&
              !this.upgrading &&
              this.writeBuffer.length
            ) {
              const n = this.getWritablePackets();
              this.transport.send(n),
                (this.prevBufferLen = n.length),
                this.emitReserved("flush");
            }
          }
          getWritablePackets() {
            if (
              !(
                this.maxPayload &&
                "polling" === this.transport.name &&
                this.writeBuffer.length > 1
              )
            )
              return this.writeBuffer;
            let r = 1;
            for (let i = 0; i < this.writeBuffer.length; i++) {
              const o = this.writeBuffer[i].data;
              if ((o && (r += CU(o)), i > 0 && r > this.maxPayload))
                return this.writeBuffer.slice(0, i);
              r += 2;
            }
            return this.writeBuffer;
          }
          write(n, r, i) {
            return this.sendPacket("message", n, r, i), this;
          }
          send(n, r, i) {
            return this.sendPacket("message", n, r, i), this;
          }
          sendPacket(n, r, i, o) {
            if (
              ("function" == typeof r && ((o = r), (r = void 0)),
              "function" == typeof i && ((o = i), (i = null)),
              "closing" === this.readyState || "closed" === this.readyState)
            )
              return;
            (i = i || {}).compress = !1 !== i.compress;
            const s = { type: n, data: r, options: i };
            this.emitReserved("packetCreate", s),
              this.writeBuffer.push(s),
              o && this.once("flush", o),
              this.flush();
          }
          close() {
            const n = () => {
                this.onClose("forced close"), this.transport.close();
              },
              r = () => {
                this.off("upgrade", r), this.off("upgradeError", r), n();
              },
              i = () => {
                this.once("upgrade", r), this.once("upgradeError", r);
              };
            return (
              ("opening" === this.readyState || "open" === this.readyState) &&
                ((this.readyState = "closing"),
                this.writeBuffer.length
                  ? this.once("drain", () => {
                      this.upgrading ? i() : n();
                    })
                  : this.upgrading
                  ? i()
                  : n()),
              this
            );
          }
          onError(n) {
            (e.priorWebsocketSuccess = !1),
              this.emitReserved("error", n),
              this.onClose("transport error", n);
          }
          onClose(n, r) {
            ("opening" === this.readyState ||
              "open" === this.readyState ||
              "closing" === this.readyState) &&
              (this.clearTimeoutFn(this.pingTimeoutTimer),
              this.transport.removeAllListeners("close"),
              this.transport.close(),
              this.transport.removeAllListeners(),
              "function" == typeof removeEventListener &&
                (removeEventListener(
                  "beforeunload",
                  this.beforeunloadEventListener,
                  !1
                ),
                removeEventListener("offline", this.offlineEventListener, !1)),
              (this.readyState = "closed"),
              (this.id = null),
              this.emitReserved("close", n, r),
              (this.writeBuffer = []),
              (this.prevBufferLen = 0));
          }
          filterUpgrades(n) {
            const r = [];
            let i = 0;
            const o = n.length;
            for (; i < o; i++) ~this.transports.indexOf(n[i]) && r.push(n[i]);
            return r;
          }
        }
        return (e.protocol = 4), e;
      })();
      const BU = "function" == typeof ArrayBuffer,
        jU = (e) =>
          "function" == typeof ArrayBuffer.isView
            ? ArrayBuffer.isView(e)
            : e.buffer instanceof ArrayBuffer,
        mS = Object.prototype.toString,
        HU =
          "function" == typeof Blob ||
          (typeof Blob < "u" && "[object BlobConstructor]" === mS.call(Blob)),
        UU =
          "function" == typeof File ||
          (typeof File < "u" && "[object FileConstructor]" === mS.call(File));
      function Qp(e) {
        return (
          (BU && (e instanceof ArrayBuffer || jU(e))) ||
          (HU && e instanceof Blob) ||
          (UU && e instanceof File)
        );
      }
      function Wc(e, t) {
        if (!e || "object" != typeof e) return !1;
        if (Array.isArray(e)) {
          for (let n = 0, r = e.length; n < r; n++) if (Wc(e[n])) return !0;
          return !1;
        }
        if (Qp(e)) return !0;
        if (e.toJSON && "function" == typeof e.toJSON && 1 === arguments.length)
          return Wc(e.toJSON(), !0);
        for (const n in e)
          if (Object.prototype.hasOwnProperty.call(e, n) && Wc(e[n])) return !0;
        return !1;
      }
      function $U(e) {
        const t = [],
          r = e;
        return (
          (r.data = Zp(e.data, t)),
          (r.attachments = t.length),
          { packet: r, buffers: t }
        );
      }
      function Zp(e, t) {
        if (!e) return e;
        if (Qp(e)) {
          const n = { _placeholder: !0, num: t.length };
          return t.push(e), n;
        }
        if (Array.isArray(e)) {
          const n = new Array(e.length);
          for (let r = 0; r < e.length; r++) n[r] = Zp(e[r], t);
          return n;
        }
        if ("object" == typeof e && !(e instanceof Date)) {
          const n = {};
          for (const r in e)
            Object.prototype.hasOwnProperty.call(e, r) && (n[r] = Zp(e[r], t));
          return n;
        }
        return e;
      }
      function zU(e, t) {
        return (e.data = Yp(e.data, t)), delete e.attachments, e;
      }
      function Yp(e, t) {
        if (!e) return e;
        if (e && !0 === e._placeholder) {
          if ("number" == typeof e.num && e.num >= 0 && e.num < t.length)
            return t[e.num];
          throw new Error("illegal attachments");
        }
        if (Array.isArray(e))
          for (let n = 0; n < e.length; n++) e[n] = Yp(e[n], t);
        else if ("object" == typeof e)
          for (const n in e)
            Object.prototype.hasOwnProperty.call(e, n) && (e[n] = Yp(e[n], t));
        return e;
      }
      const qU = [
          "connect",
          "connect_error",
          "disconnect",
          "disconnecting",
          "newListener",
          "removeListener",
        ],
        GU = 5;
      var U = (() => (
        ((U = U || {})[(U.CONNECT = 0)] = "CONNECT"),
        (U[(U.DISCONNECT = 1)] = "DISCONNECT"),
        (U[(U.EVENT = 2)] = "EVENT"),
        (U[(U.ACK = 3)] = "ACK"),
        (U[(U.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
        (U[(U.BINARY_EVENT = 5)] = "BINARY_EVENT"),
        (U[(U.BINARY_ACK = 6)] = "BINARY_ACK"),
        U
      ))();
      class WU {
        constructor(t) {
          this.replacer = t;
        }
        encode(t) {
          return (t.type !== U.EVENT && t.type !== U.ACK) || !Wc(t)
            ? [this.encodeAsString(t)]
            : this.encodeAsBinary({
                type: t.type === U.EVENT ? U.BINARY_EVENT : U.BINARY_ACK,
                nsp: t.nsp,
                data: t.data,
                id: t.id,
              });
        }
        encodeAsString(t) {
          let n = "" + t.type;
          return (
            (t.type === U.BINARY_EVENT || t.type === U.BINARY_ACK) &&
              (n += t.attachments + "-"),
            t.nsp && "/" !== t.nsp && (n += t.nsp + ","),
            null != t.id && (n += t.id),
            null != t.data && (n += JSON.stringify(t.data, this.replacer)),
            n
          );
        }
        encodeAsBinary(t) {
          const n = $U(t),
            r = this.encodeAsString(n.packet),
            i = n.buffers;
          return i.unshift(r), i;
        }
      }
      function yS(e) {
        return "[object Object]" === Object.prototype.toString.call(e);
      }
      class Xp extends qe {
        constructor(t) {
          super(), (this.reviver = t);
        }
        add(t) {
          let n;
          if ("string" == typeof t) {
            if (this.reconstructor)
              throw new Error(
                "got plaintext data when reconstructing a packet"
              );
            n = this.decodeString(t);
            const r = n.type === U.BINARY_EVENT;
            r || n.type === U.BINARY_ACK
              ? ((n.type = r ? U.EVENT : U.ACK),
                (this.reconstructor = new KU(n)),
                0 === n.attachments && super.emitReserved("decoded", n))
              : super.emitReserved("decoded", n);
          } else {
            if (!Qp(t) && !t.base64) throw new Error("Unknown type: " + t);
            if (!this.reconstructor)
              throw new Error(
                "got binary data when not reconstructing a packet"
              );
            (n = this.reconstructor.takeBinaryData(t)),
              n &&
                ((this.reconstructor = null), super.emitReserved("decoded", n));
          }
        }
        decodeString(t) {
          let n = 0;
          const r = { type: Number(t.charAt(0)) };
          if (void 0 === U[r.type])
            throw new Error("unknown packet type " + r.type);
          if (r.type === U.BINARY_EVENT || r.type === U.BINARY_ACK) {
            const o = n + 1;
            for (; "-" !== t.charAt(++n) && n != t.length; );
            const s = t.substring(o, n);
            if (s != Number(s) || "-" !== t.charAt(n))
              throw new Error("Illegal attachments");
            r.attachments = Number(s);
          }
          if ("/" === t.charAt(n + 1)) {
            const o = n + 1;
            for (; ++n && "," !== t.charAt(n) && n !== t.length; );
            r.nsp = t.substring(o, n);
          } else r.nsp = "/";
          const i = t.charAt(n + 1);
          if ("" !== i && Number(i) == i) {
            const o = n + 1;
            for (; ++n; ) {
              const s = t.charAt(n);
              if (null == s || Number(s) != s) {
                --n;
                break;
              }
              if (n === t.length) break;
            }
            r.id = Number(t.substring(o, n + 1));
          }
          if (t.charAt(++n)) {
            const o = this.tryParse(t.substr(n));
            if (!Xp.isPayloadValid(r.type, o))
              throw new Error("invalid payload");
            r.data = o;
          }
          return r;
        }
        tryParse(t) {
          try {
            return JSON.parse(t, this.reviver);
          } catch {
            return !1;
          }
        }
        static isPayloadValid(t, n) {
          switch (t) {
            case U.CONNECT:
              return yS(n);
            case U.DISCONNECT:
              return void 0 === n;
            case U.CONNECT_ERROR:
              return "string" == typeof n || yS(n);
            case U.EVENT:
            case U.BINARY_EVENT:
              return (
                Array.isArray(n) &&
                ("number" == typeof n[0] ||
                  ("string" == typeof n[0] && -1 === qU.indexOf(n[0])))
              );
            case U.ACK:
            case U.BINARY_ACK:
              return Array.isArray(n);
          }
        }
        destroy() {
          this.reconstructor &&
            (this.reconstructor.finishedReconstruction(),
            (this.reconstructor = null));
        }
      }
      class KU {
        constructor(t) {
          (this.packet = t), (this.buffers = []), (this.reconPack = t);
        }
        takeBinaryData(t) {
          if (
            (this.buffers.push(t),
            this.buffers.length === this.reconPack.attachments)
          ) {
            const n = zU(this.reconPack, this.buffers);
            return this.finishedReconstruction(), n;
          }
          return null;
        }
        finishedReconstruction() {
          (this.reconPack = null), (this.buffers = []);
        }
      }
      function wn(e, t, n) {
        return (
          e.on(t, n),
          function () {
            e.off(t, n);
          }
        );
      }
      const QU = Object.freeze({
        connect: 1,
        connect_error: 1,
        disconnect: 1,
        disconnecting: 1,
        newListener: 1,
        removeListener: 1,
      });
      class vS extends qe {
        constructor(t, n, r) {
          super(),
            (this.connected = !1),
            (this.recovered = !1),
            (this.receiveBuffer = []),
            (this.sendBuffer = []),
            (this._queue = []),
            (this._queueSeq = 0),
            (this.ids = 0),
            (this.acks = {}),
            (this.flags = {}),
            (this.io = t),
            (this.nsp = n),
            r && r.auth && (this.auth = r.auth),
            (this._opts = Object.assign({}, r)),
            this.io._autoConnect && this.open();
        }
        get disconnected() {
          return !this.connected;
        }
        subEvents() {
          if (this.subs) return;
          const t = this.io;
          this.subs = [
            wn(t, "open", this.onopen.bind(this)),
            wn(t, "packet", this.onpacket.bind(this)),
            wn(t, "error", this.onerror.bind(this)),
            wn(t, "close", this.onclose.bind(this)),
          ];
        }
        get active() {
          return !!this.subs;
        }
        connect() {
          return (
            this.connected ||
              (this.subEvents(),
              this.io._reconnecting || this.io.open(),
              "open" === this.io._readyState && this.onopen()),
            this
          );
        }
        open() {
          return this.connect();
        }
        send(...t) {
          return t.unshift("message"), this.emit.apply(this, t), this;
        }
        emit(t, ...n) {
          if (QU.hasOwnProperty(t))
            throw new Error('"' + t.toString() + '" is a reserved event name');
          if (
            (n.unshift(t),
            this._opts.retries && !this.flags.fromQueue && !this.flags.volatile)
          )
            return this._addToQueue(n), this;
          const r = { type: U.EVENT, data: n, options: {} };
          if (
            ((r.options.compress = !1 !== this.flags.compress),
            "function" == typeof n[n.length - 1])
          ) {
            const s = this.ids++,
              a = n.pop();
            this._registerAckCallback(s, a), (r.id = s);
          }
          return (
            (this.flags.volatile &&
              (!(
                this.io.engine &&
                this.io.engine.transport &&
                this.io.engine.transport.writable
              ) ||
                !this.connected)) ||
              (this.connected
                ? (this.notifyOutgoingListeners(r), this.packet(r))
                : this.sendBuffer.push(r)),
            (this.flags = {}),
            this
          );
        }
        _registerAckCallback(t, n) {
          var r;
          const i =
            null !== (r = this.flags.timeout) && void 0 !== r
              ? r
              : this._opts.ackTimeout;
          if (void 0 === i) return void (this.acks[t] = n);
          const o = this.io.setTimeoutFn(() => {
            delete this.acks[t];
            for (let s = 0; s < this.sendBuffer.length; s++)
              this.sendBuffer[s].id === t && this.sendBuffer.splice(s, 1);
            n.call(this, new Error("operation has timed out"));
          }, i);
          this.acks[t] = (...s) => {
            this.io.clearTimeoutFn(o), n.apply(this, [null, ...s]);
          };
        }
        emitWithAck(t, ...n) {
          const r =
            void 0 !== this.flags.timeout || void 0 !== this._opts.ackTimeout;
          return new Promise((i, o) => {
            n.push((s, a) => (r ? (s ? o(s) : i(a)) : i(s))),
              this.emit(t, ...n);
          });
        }
        _addToQueue(t) {
          let n;
          "function" == typeof t[t.length - 1] && (n = t.pop());
          const r = {
            id: this._queueSeq++,
            tryCount: 0,
            pending: !1,
            args: t,
            flags: Object.assign({ fromQueue: !0 }, this.flags),
          };
          t.push((i, ...o) =>
            r !== this._queue[0]
              ? void 0
              : (null !== i
                  ? r.tryCount > this._opts.retries &&
                    (this._queue.shift(), n && n(i))
                  : (this._queue.shift(), n && n(null, ...o)),
                (r.pending = !1),
                this._drainQueue())
          ),
            this._queue.push(r),
            this._drainQueue();
        }
        _drainQueue(t = !1) {
          if (!this.connected || 0 === this._queue.length) return;
          const n = this._queue[0];
          (n.pending && !t) ||
            ((n.pending = !0),
            n.tryCount++,
            (this.flags = n.flags),
            this.emit.apply(this, n.args));
        }
        packet(t) {
          (t.nsp = this.nsp), this.io._packet(t);
        }
        onopen() {
          "function" == typeof this.auth
            ? this.auth((t) => {
                this._sendConnectPacket(t);
              })
            : this._sendConnectPacket(this.auth);
        }
        _sendConnectPacket(t) {
          this.packet({
            type: U.CONNECT,
            data: this._pid
              ? Object.assign({ pid: this._pid, offset: this._lastOffset }, t)
              : t,
          });
        }
        onerror(t) {
          this.connected || this.emitReserved("connect_error", t);
        }
        onclose(t, n) {
          (this.connected = !1),
            delete this.id,
            this.emitReserved("disconnect", t, n);
        }
        onpacket(t) {
          if (t.nsp === this.nsp)
            switch (t.type) {
              case U.CONNECT:
                t.data && t.data.sid
                  ? this.onconnect(t.data.sid, t.data.pid)
                  : this.emitReserved(
                      "connect_error",
                      new Error(
                        "It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"
                      )
                    );
                break;
              case U.EVENT:
              case U.BINARY_EVENT:
                this.onevent(t);
                break;
              case U.ACK:
              case U.BINARY_ACK:
                this.onack(t);
                break;
              case U.DISCONNECT:
                this.ondisconnect();
                break;
              case U.CONNECT_ERROR:
                this.destroy();
                const r = new Error(t.data.message);
                (r.data = t.data.data), this.emitReserved("connect_error", r);
            }
        }
        onevent(t) {
          const n = t.data || [];
          null != t.id && n.push(this.ack(t.id)),
            this.connected
              ? this.emitEvent(n)
              : this.receiveBuffer.push(Object.freeze(n));
        }
        emitEvent(t) {
          if (this._anyListeners && this._anyListeners.length) {
            const n = this._anyListeners.slice();
            for (const r of n) r.apply(this, t);
          }
          super.emit.apply(this, t),
            this._pid &&
              t.length &&
              "string" == typeof t[t.length - 1] &&
              (this._lastOffset = t[t.length - 1]);
        }
        ack(t) {
          const n = this;
          let r = !1;
          return function (...i) {
            r || ((r = !0), n.packet({ type: U.ACK, id: t, data: i }));
          };
        }
        onack(t) {
          const n = this.acks[t.id];
          "function" == typeof n &&
            (n.apply(this, t.data), delete this.acks[t.id]);
        }
        onconnect(t, n) {
          (this.id = t),
            (this.recovered = n && this._pid === n),
            (this._pid = n),
            (this.connected = !0),
            this.emitBuffered(),
            this.emitReserved("connect"),
            this._drainQueue(!0);
        }
        emitBuffered() {
          this.receiveBuffer.forEach((t) => this.emitEvent(t)),
            (this.receiveBuffer = []),
            this.sendBuffer.forEach((t) => {
              this.notifyOutgoingListeners(t), this.packet(t);
            }),
            (this.sendBuffer = []);
        }
        ondisconnect() {
          this.destroy(), this.onclose("io server disconnect");
        }
        destroy() {
          this.subs && (this.subs.forEach((t) => t()), (this.subs = void 0)),
            this.io._destroy(this);
        }
        disconnect() {
          return (
            this.connected && this.packet({ type: U.DISCONNECT }),
            this.destroy(),
            this.connected && this.onclose("io client disconnect"),
            this
          );
        }
        close() {
          return this.disconnect();
        }
        compress(t) {
          return (this.flags.compress = t), this;
        }
        get volatile() {
          return (this.flags.volatile = !0), this;
        }
        timeout(t) {
          return (this.flags.timeout = t), this;
        }
        onAny(t) {
          return (
            (this._anyListeners = this._anyListeners || []),
            this._anyListeners.push(t),
            this
          );
        }
        prependAny(t) {
          return (
            (this._anyListeners = this._anyListeners || []),
            this._anyListeners.unshift(t),
            this
          );
        }
        offAny(t) {
          if (!this._anyListeners) return this;
          if (t) {
            const n = this._anyListeners;
            for (let r = 0; r < n.length; r++)
              if (t === n[r]) return n.splice(r, 1), this;
          } else this._anyListeners = [];
          return this;
        }
        listenersAny() {
          return this._anyListeners || [];
        }
        onAnyOutgoing(t) {
          return (
            (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
            this._anyOutgoingListeners.push(t),
            this
          );
        }
        prependAnyOutgoing(t) {
          return (
            (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
            this._anyOutgoingListeners.unshift(t),
            this
          );
        }
        offAnyOutgoing(t) {
          if (!this._anyOutgoingListeners) return this;
          if (t) {
            const n = this._anyOutgoingListeners;
            for (let r = 0; r < n.length; r++)
              if (t === n[r]) return n.splice(r, 1), this;
          } else this._anyOutgoingListeners = [];
          return this;
        }
        listenersAnyOutgoing() {
          return this._anyOutgoingListeners || [];
        }
        notifyOutgoingListeners(t) {
          if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
            const n = this._anyOutgoingListeners.slice();
            for (const r of n) r.apply(this, t.data);
          }
        }
      }
      function Eo(e) {
        (this.ms = (e = e || {}).min || 100),
          (this.max = e.max || 1e4),
          (this.factor = e.factor || 2),
          (this.jitter = e.jitter > 0 && e.jitter <= 1 ? e.jitter : 0),
          (this.attempts = 0);
      }
      (Eo.prototype.duration = function () {
        var e = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
          var t = Math.random(),
            n = Math.floor(t * this.jitter * e);
          e = 1 & Math.floor(10 * t) ? e + n : e - n;
        }
        return 0 | Math.min(e, this.max);
      }),
        (Eo.prototype.reset = function () {
          this.attempts = 0;
        }),
        (Eo.prototype.setMin = function (e) {
          this.ms = e;
        }),
        (Eo.prototype.setMax = function (e) {
          this.max = e;
        }),
        (Eo.prototype.setJitter = function (e) {
          this.jitter = e;
        });
      class Jp extends qe {
        constructor(t, n) {
          var r;
          super(),
            (this.nsps = {}),
            (this.subs = []),
            t && "object" == typeof t && ((n = t), (t = void 0)),
            ((n = n || {}).path = n.path || "/socket.io"),
            (this.opts = n),
            $c(this, n),
            this.reconnection(!1 !== n.reconnection),
            this.reconnectionAttempts(n.reconnectionAttempts || 1 / 0),
            this.reconnectionDelay(n.reconnectionDelay || 1e3),
            this.reconnectionDelayMax(n.reconnectionDelayMax || 5e3),
            this.randomizationFactor(
              null !== (r = n.randomizationFactor) && void 0 !== r ? r : 0.5
            ),
            (this.backoff = new Eo({
              min: this.reconnectionDelay(),
              max: this.reconnectionDelayMax(),
              jitter: this.randomizationFactor(),
            })),
            this.timeout(null == n.timeout ? 2e4 : n.timeout),
            (this._readyState = "closed"),
            (this.uri = t);
          const i = n.parser || xo;
          (this.encoder = new i.Encoder()),
            (this.decoder = new i.Decoder()),
            (this._autoConnect = !1 !== n.autoConnect),
            this._autoConnect && this.open();
        }
        reconnection(t) {
          return arguments.length
            ? ((this._reconnection = !!t), this)
            : this._reconnection;
        }
        reconnectionAttempts(t) {
          return void 0 === t
            ? this._reconnectionAttempts
            : ((this._reconnectionAttempts = t), this);
        }
        reconnectionDelay(t) {
          var n;
          return void 0 === t
            ? this._reconnectionDelay
            : ((this._reconnectionDelay = t),
              null === (n = this.backoff) || void 0 === n || n.setMin(t),
              this);
        }
        randomizationFactor(t) {
          var n;
          return void 0 === t
            ? this._randomizationFactor
            : ((this._randomizationFactor = t),
              null === (n = this.backoff) || void 0 === n || n.setJitter(t),
              this);
        }
        reconnectionDelayMax(t) {
          var n;
          return void 0 === t
            ? this._reconnectionDelayMax
            : ((this._reconnectionDelayMax = t),
              null === (n = this.backoff) || void 0 === n || n.setMax(t),
              this);
        }
        timeout(t) {
          return arguments.length ? ((this._timeout = t), this) : this._timeout;
        }
        maybeReconnectOnOpen() {
          !this._reconnecting &&
            this._reconnection &&
            0 === this.backoff.attempts &&
            this.reconnect();
        }
        open(t) {
          if (~this._readyState.indexOf("open")) return this;
          this.engine = new gS(this.uri, this.opts);
          const n = this.engine,
            r = this;
          (this._readyState = "opening"), (this.skipReconnect = !1);
          const i = wn(n, "open", function () {
              r.onopen(), t && t();
            }),
            o = (a) => {
              this.cleanup(),
                (this._readyState = "closed"),
                this.emitReserved("error", a),
                t ? t(a) : this.maybeReconnectOnOpen();
            },
            s = wn(n, "error", o);
          if (!1 !== this._timeout) {
            const l = this.setTimeoutFn(() => {
              i(), o(new Error("timeout")), n.close();
            }, this._timeout);
            this.opts.autoUnref && l.unref(),
              this.subs.push(() => {
                this.clearTimeoutFn(l);
              });
          }
          return this.subs.push(i), this.subs.push(s), this;
        }
        connect(t) {
          return this.open(t);
        }
        onopen() {
          this.cleanup(),
            (this._readyState = "open"),
            this.emitReserved("open");
          const t = this.engine;
          this.subs.push(
            wn(t, "ping", this.onping.bind(this)),
            wn(t, "data", this.ondata.bind(this)),
            wn(t, "error", this.onerror.bind(this)),
            wn(t, "close", this.onclose.bind(this)),
            wn(this.decoder, "decoded", this.ondecoded.bind(this))
          );
        }
        onping() {
          this.emitReserved("ping");
        }
        ondata(t) {
          try {
            this.decoder.add(t);
          } catch (n) {
            this.onclose("parse error", n);
          }
        }
        ondecoded(t) {
          Gp(() => {
            this.emitReserved("packet", t);
          }, this.setTimeoutFn);
        }
        onerror(t) {
          this.emitReserved("error", t);
        }
        socket(t, n) {
          let r = this.nsps[t];
          return (
            r
              ? this._autoConnect && !r.active && r.connect()
              : ((r = new vS(this, t, n)), (this.nsps[t] = r)),
            r
          );
        }
        _destroy(t) {
          const n = Object.keys(this.nsps);
          for (const r of n) if (this.nsps[r].active) return;
          this._close();
        }
        _packet(t) {
          const n = this.encoder.encode(t);
          for (let r = 0; r < n.length; r++) this.engine.write(n[r], t.options);
        }
        cleanup() {
          this.subs.forEach((t) => t()),
            (this.subs.length = 0),
            this.decoder.destroy();
        }
        _close() {
          (this.skipReconnect = !0),
            (this._reconnecting = !1),
            this.onclose("forced close"),
            this.engine && this.engine.close();
        }
        disconnect() {
          return this._close();
        }
        onclose(t, n) {
          this.cleanup(),
            this.backoff.reset(),
            (this._readyState = "closed"),
            this.emitReserved("close", t, n),
            this._reconnection && !this.skipReconnect && this.reconnect();
        }
        reconnect() {
          if (this._reconnecting || this.skipReconnect) return this;
          const t = this;
          if (this.backoff.attempts >= this._reconnectionAttempts)
            this.backoff.reset(),
              this.emitReserved("reconnect_failed"),
              (this._reconnecting = !1);
          else {
            const n = this.backoff.duration();
            this._reconnecting = !0;
            const r = this.setTimeoutFn(() => {
              t.skipReconnect ||
                (this.emitReserved("reconnect_attempt", t.backoff.attempts),
                !t.skipReconnect &&
                  t.open((i) => {
                    i
                      ? ((t._reconnecting = !1),
                        t.reconnect(),
                        this.emitReserved("reconnect_error", i))
                      : t.onreconnect();
                  }));
            }, n);
            this.opts.autoUnref && r.unref(),
              this.subs.push(() => {
                this.clearTimeoutFn(r);
              });
          }
        }
        onreconnect() {
          const t = this.backoff.attempts;
          (this._reconnecting = !1),
            this.backoff.reset(),
            this.emitReserved("reconnect", t);
        }
      }
      const Xs = {};
      function So(e, t) {
        "object" == typeof e && ((t = e), (e = void 0));
        const n = (function VU(e, t = "", n) {
            let r = e;
            (n = n || (typeof location < "u" && location)),
              null == e && (e = n.protocol + "//" + n.host),
              "string" == typeof e &&
                ("/" === e.charAt(0) &&
                  (e = "/" === e.charAt(1) ? n.protocol + e : n.host + e),
                /^(https?|wss?):\/\//.test(e) ||
                  (e = typeof n < "u" ? n.protocol + "//" + e : "https://" + e),
                (r = Kp(e))),
              r.port ||
                (/^(http|ws)$/.test(r.protocol)
                  ? (r.port = "80")
                  : /^(http|ws)s$/.test(r.protocol) && (r.port = "443")),
              (r.path = r.path || "/");
            const o = -1 !== r.host.indexOf(":") ? "[" + r.host + "]" : r.host;
            return (
              (r.id = r.protocol + "://" + o + ":" + r.port + t),
              (r.href =
                r.protocol +
                "://" +
                o +
                (n && n.port === r.port ? "" : ":" + r.port)),
              r
            );
          })(e, (t = t || {}).path || "/socket.io"),
          r = n.source,
          i = n.id;
        let l;
        return (
          t.forceNew ||
          t["force new connection"] ||
          !1 === t.multiplex ||
          (Xs[i] && n.path in Xs[i].nsps)
            ? (l = new Jp(r, t))
            : (Xs[i] || (Xs[i] = new Jp(r, t)), (l = Xs[i])),
          n.query && !t.query && (t.query = n.queryKey),
          l.socket(n.path, t)
        );
      }
      Object.assign(So, { Manager: Jp, Socket: vS, io: So, connect: So });
      class _S {}
      class ZU {}
      const fr = "*";
      function Kc(e, t) {
        return { type: 7, name: e, definitions: t, options: {} };
      }
      function Mo(e, t = null) {
        return { type: 4, styles: t, timings: e };
      }
      function CS(e, t = null) {
        return { type: 2, steps: e, options: t };
      }
      function Nt(e) {
        return { type: 6, styles: e, offset: null };
      }
      function ui(e, t, n) {
        return { type: 0, name: e, styles: t, options: n };
      }
      function Js(e, t, n = null) {
        return { type: 1, expr: e, animation: t, options: n };
      }
      function bS(e, t, n = null) {
        return { type: 11, selector: e, animation: t, options: n };
      }
      function wS(e) {
        Promise.resolve().then(e);
      }
      class ea {
        constructor(t = 0, n = 0) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this._started = !1),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._position = 0),
            (this.parentPlayer = null),
            (this.totalTime = t + n);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((t) => t()),
            (this._onDoneFns = []));
        }
        onStart(t) {
          this._originalOnStartFns.push(t), this._onStartFns.push(t);
        }
        onDone(t) {
          this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        hasStarted() {
          return this._started;
        }
        init() {}
        play() {
          this.hasStarted() || (this._onStart(), this.triggerMicrotask()),
            (this._started = !0);
        }
        triggerMicrotask() {
          wS(() => this._onFinish());
        }
        _onStart() {
          this._onStartFns.forEach((t) => t()), (this._onStartFns = []);
        }
        pause() {}
        restart() {}
        finish() {
          this._onFinish();
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this.hasStarted() || this._onStart(),
            this.finish(),
            this._onDestroyFns.forEach((t) => t()),
            (this._onDestroyFns = []));
        }
        reset() {
          (this._started = !1),
            (this._finished = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        setPosition(t) {
          this._position = this.totalTime ? t * this.totalTime : 1;
        }
        getPosition() {
          return this.totalTime ? this._position / this.totalTime : 1;
        }
        triggerCallback(t) {
          const n = "start" == t ? this._onStartFns : this._onDoneFns;
          n.forEach((r) => r()), (n.length = 0);
        }
      }
      class DS {
        constructor(t) {
          (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._onDestroyFns = []),
            (this.parentPlayer = null),
            (this.totalTime = 0),
            (this.players = t);
          let n = 0,
            r = 0,
            i = 0;
          const o = this.players.length;
          0 == o
            ? wS(() => this._onFinish())
            : this.players.forEach((s) => {
                s.onDone(() => {
                  ++n == o && this._onFinish();
                }),
                  s.onDestroy(() => {
                    ++r == o && this._onDestroy();
                  }),
                  s.onStart(() => {
                    ++i == o && this._onStart();
                  });
              }),
            (this.totalTime = this.players.reduce(
              (s, a) => Math.max(s, a.totalTime),
              0
            ));
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((t) => t()),
            (this._onDoneFns = []));
        }
        init() {
          this.players.forEach((t) => t.init());
        }
        onStart(t) {
          this._onStartFns.push(t);
        }
        _onStart() {
          this.hasStarted() ||
            ((this._started = !0),
            this._onStartFns.forEach((t) => t()),
            (this._onStartFns = []));
        }
        onDone(t) {
          this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this.parentPlayer || this.init(),
            this._onStart(),
            this.players.forEach((t) => t.play());
        }
        pause() {
          this.players.forEach((t) => t.pause());
        }
        restart() {
          this.players.forEach((t) => t.restart());
        }
        finish() {
          this._onFinish(), this.players.forEach((t) => t.finish());
        }
        destroy() {
          this._onDestroy();
        }
        _onDestroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._onFinish(),
            this.players.forEach((t) => t.destroy()),
            this._onDestroyFns.forEach((t) => t()),
            (this._onDestroyFns = []));
        }
        reset() {
          this.players.forEach((t) => t.reset()),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1);
        }
        setPosition(t) {
          const n = t * this.totalTime;
          this.players.forEach((r) => {
            const i = r.totalTime ? Math.min(1, n / r.totalTime) : 1;
            r.setPosition(i);
          });
        }
        getPosition() {
          const t = this.players.reduce(
            (n, r) => (null === n || r.totalTime > n.totalTime ? r : n),
            null
          );
          return null != t ? t.getPosition() : 0;
        }
        beforeDestroy() {
          this.players.forEach((t) => {
            t.beforeDestroy && t.beforeDestroy();
          });
        }
        triggerCallback(t) {
          const n = "start" == t ? this._onStartFns : this._onDoneFns;
          n.forEach((r) => r()), (n.length = 0);
        }
      }
      const ES = Kc("fadeOut", [
          ui("visible", Nt({ opacity: 1 })),
          ui("hidden", Nt({ opacity: 0 })),
          Js("visible => hidden", [
            Nt({ transform: "scale(0)" }),
            Mo("300ms ease-out"),
          ]),
        ]),
        SS = Kc("fadeIn", [
          ui("visible", Nt({ opacity: 1 })),
          ui("hidden", Nt({ opacity: 0 })),
          Js("hidden => visible", [
            Nt({ transform: "scale(0)" }),
            Mo("300ms ease-in"),
          ]),
        ]),
        XU = Kc("showFood", [
          Js("* => *", [
            bS(
              ":enter",
              [
                Nt({ opacity: 0, transform: "translateY(-20px)" }),
                (function YU(e, t) {
                  return { type: 12, timings: e, animation: t };
                })(100, [
                  Mo("300ms ease-in", Nt({ opacity: 1, transform: "none" })),
                ]),
              ],
              { optional: !0 }
            ),
            bS(
              ":leave",
              [
                Mo(
                  "300ms ease-out",
                  Nt({ opacity: 0, transform: "translateY(-20px)" })
                ),
              ],
              { optional: !0 }
            ),
          ]),
        ]);
      let tg = (() => {
        class e {
          constructor() {
            (this.resId = localStorage.getItem("resId")),
              (this.socket = So("http://localhost:5000"));
          }
          listen(n) {
            return new ve((r) => {
              this.socket.on(n, (i) => {
                r.next(i);
              });
            });
          }
          emit(n, r) {
            this.socket.emit(n, { data: r, resId: this.resId });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function ta(e) {
        return (ta =
          "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
            ? function (t) {
                return typeof t;
              }
            : function (t) {
                return t &&
                  "function" == typeof Symbol &&
                  t.constructor === Symbol &&
                  t !== Symbol.prototype
                  ? "symbol"
                  : typeof t;
              })(e);
      }
      function T(e, t, n) {
        return (
          (t = (function e$(e) {
            var t = (function JU(e, t) {
              if ("object" !== ta(e) || null === e) return e;
              var n = e[Symbol.toPrimitive];
              if (void 0 !== n) {
                var r = n.call(e, t || "default");
                if ("object" !== ta(r)) return r;
                throw new TypeError(
                  "@@toPrimitive must return a primitive value."
                );
              }
              return ("string" === t ? String : Number)(e);
            })(e, "string");
            return "symbol" === ta(t) ? t : String(t);
          })(t)) in e
            ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (e[t] = n),
          e
        );
      }
      const MS = ["toast-component", ""];
      function t$(e, t) {
        if (1 & e) {
          const n = nn();
          b(0, "button", 5),
            ue("click", function () {
              return Vt(n), Bt(ne().remove());
            }),
            b(1, "span", 6),
            x(2, "\xd7"),
            w()();
        }
      }
      function n$(e, t) {
        if ((1 & e && (ys(0), x(1), vs()), 2 & e)) {
          const n = ne(2);
          A(1), He("[", n.duplicatesCount + 1, "]");
        }
      }
      function r$(e, t) {
        if (
          (1 & e && (b(0, "div"), x(1), H(2, n$, 2, 1, "ng-container", 4), w()),
          2 & e)
        ) {
          const n = ne();
          ir(n.options.titleClass),
            xt("aria-label", n.title),
            A(1),
            He(" ", n.title, " "),
            A(1),
            F("ngIf", n.duplicatesCount);
        }
      }
      function i$(e, t) {
        if ((1 & e && se(0, "div", 7), 2 & e)) {
          const n = ne();
          ir(n.options.messageClass), F("innerHTML", n.message, nf);
        }
      }
      function o$(e, t) {
        if ((1 & e && (b(0, "div", 8), x(1), w()), 2 & e)) {
          const n = ne();
          ir(n.options.messageClass),
            xt("aria-label", n.message),
            A(1),
            He(" ", n.message, " ");
        }
      }
      function s$(e, t) {
        if ((1 & e && (b(0, "div"), se(1, "div", 9), w()), 2 & e)) {
          const n = ne();
          A(1), io("width", n.width + "%");
        }
      }
      class h$ {
        constructor(t, n) {
          T(this, "_attachedHost", void 0),
            T(this, "component", void 0),
            T(this, "viewContainerRef", void 0),
            T(this, "injector", void 0),
            (this.component = t),
            (this.injector = n);
        }
        attach(t, n) {
          return (this._attachedHost = t), t.attach(this, n);
        }
        detach() {
          const t = this._attachedHost;
          if (t) return (this._attachedHost = void 0), t.detach();
        }
        get isAttached() {
          return null != this._attachedHost;
        }
        setAttachedHost(t) {
          this._attachedHost = t;
        }
      }
      class p$ {
        constructor() {
          T(this, "_attachedPortal", void 0), T(this, "_disposeFn", void 0);
        }
        attach(t, n) {
          return (this._attachedPortal = t), this.attachComponentPortal(t, n);
        }
        detach() {
          this._attachedPortal && this._attachedPortal.setAttachedHost(),
            (this._attachedPortal = void 0),
            this._disposeFn && (this._disposeFn(), (this._disposeFn = void 0));
        }
        setDisposeFn(t) {
          this._disposeFn = t;
        }
      }
      class g$ {
        constructor(t) {
          T(this, "_overlayRef", void 0),
            T(this, "componentInstance", void 0),
            T(this, "duplicatesCount", 0),
            T(this, "_afterClosed", new We()),
            T(this, "_activate", new We()),
            T(this, "_manualClose", new We()),
            T(this, "_resetTimeout", new We()),
            T(this, "_countDuplicate", new We()),
            (this._overlayRef = t);
        }
        manualClose() {
          this._manualClose.next(), this._manualClose.complete();
        }
        manualClosed() {
          return this._manualClose.asObservable();
        }
        timeoutReset() {
          return this._resetTimeout.asObservable();
        }
        countDuplicate() {
          return this._countDuplicate.asObservable();
        }
        close() {
          this._overlayRef.detach(),
            this._afterClosed.next(),
            this._manualClose.next(),
            this._afterClosed.complete(),
            this._manualClose.complete(),
            this._activate.complete(),
            this._resetTimeout.complete(),
            this._countDuplicate.complete();
        }
        afterClosed() {
          return this._afterClosed.asObservable();
        }
        isInactive() {
          return this._activate.isStopped;
        }
        activate() {
          this._activate.next(), this._activate.complete();
        }
        afterActivate() {
          return this._activate.asObservable();
        }
        onDuplicate(t, n) {
          t && this._resetTimeout.next(),
            n && this._countDuplicate.next(++this.duplicatesCount);
        }
      }
      class Qc {
        constructor(t, n, r, i, o, s) {
          T(this, "toastId", void 0),
            T(this, "config", void 0),
            T(this, "message", void 0),
            T(this, "title", void 0),
            T(this, "toastType", void 0),
            T(this, "toastRef", void 0),
            T(this, "_onTap", new We()),
            T(this, "_onAction", new We()),
            (this.toastId = t),
            (this.config = n),
            (this.message = r),
            (this.title = i),
            (this.toastType = o),
            (this.toastRef = s),
            this.toastRef.afterClosed().subscribe(() => {
              this._onAction.complete(), this._onTap.complete();
            });
        }
        triggerTap() {
          this._onTap.next(),
            this.config.tapToDismiss && this._onTap.complete();
        }
        onTap() {
          return this._onTap.asObservable();
        }
        triggerAction(t) {
          this._onAction.next(t);
        }
        onAction() {
          return this._onAction.asObservable();
        }
      }
      const AS = new S("ToastConfig");
      class m$ extends p$ {
        constructor(t, n, r) {
          super(),
            T(this, "_hostDomElement", void 0),
            T(this, "_componentFactoryResolver", void 0),
            T(this, "_appRef", void 0),
            (this._hostDomElement = t),
            (this._componentFactoryResolver = n),
            (this._appRef = r);
        }
        attachComponentPortal(t, n) {
          const r = this._componentFactoryResolver.resolveComponentFactory(
            t.component
          );
          let i;
          return (
            (i = r.create(t.injector)),
            this._appRef.attachView(i.hostView),
            this.setDisposeFn(() => {
              this._appRef.detachView(i.hostView), i.destroy();
            }),
            n
              ? this._hostDomElement.insertBefore(
                  this._getComponentRootNode(i),
                  this._hostDomElement.firstChild
                )
              : this._hostDomElement.appendChild(this._getComponentRootNode(i)),
            i
          );
        }
        _getComponentRootNode(t) {
          return t.hostView.rootNodes[0];
        }
      }
      let y$ = (() => {
        class e {
          constructor() {
            T(this, "_document", M(et)), T(this, "_containerElement", void 0);
          }
          ngOnDestroy() {
            this._containerElement &&
              this._containerElement.parentNode &&
              this._containerElement.parentNode.removeChild(
                this._containerElement
              );
          }
          getContainerElement() {
            return (
              this._containerElement || this._createContainer(),
              this._containerElement
            );
          }
          _createContainer() {
            const n = this._document.createElement("div");
            n.classList.add("overlay-container"),
              n.setAttribute("aria-live", "polite"),
              this._document.body.appendChild(n),
              (this._containerElement = n);
          }
        }
        return (
          T(e, "\u0275fac", function (n) {
            return new (n || e)();
          }),
          T(
            e,
            "\u0275prov",
            O({ token: e, factory: e.ɵfac, providedIn: "root" })
          ),
          e
        );
      })();
      class v$ {
        constructor(t) {
          T(this, "_portalHost", void 0), (this._portalHost = t);
        }
        attach(t, n = !0) {
          return this._portalHost.attach(t, n);
        }
        detach() {
          return this._portalHost.detach();
        }
      }
      let _$ = (() => {
          class e {
            constructor() {
              T(this, "_overlayContainer", M(y$)),
                T(this, "_componentFactoryResolver", M(os)),
                T(this, "_appRef", M(ar)),
                T(this, "_document", M(et)),
                T(this, "_paneElements", new Map());
            }
            create(n, r) {
              return this._createOverlayRef(this.getPaneElement(n, r));
            }
            getPaneElement(n = "", r) {
              return (
                this._paneElements.get(r) || this._paneElements.set(r, {}),
                this._paneElements.get(r)[n] ||
                  (this._paneElements.get(r)[n] = this._createPaneElement(
                    n,
                    r
                  )),
                this._paneElements.get(r)[n]
              );
            }
            _createPaneElement(n, r) {
              const i = this._document.createElement("div");
              return (
                (i.id = "toast-container"),
                i.classList.add(n),
                i.classList.add("toast-container"),
                r
                  ? r.getContainerElement().appendChild(i)
                  : this._overlayContainer.getContainerElement().appendChild(i),
                i
              );
            }
            _createPortalHost(n) {
              return new m$(n, this._componentFactoryResolver, this._appRef);
            }
            _createOverlayRef(n) {
              return new v$(this._createPortalHost(n));
            }
          }
          return (
            T(e, "\u0275fac", function (n) {
              return new (n || e)();
            }),
            T(
              e,
              "\u0275prov",
              O({ token: e, factory: e.ɵfac, providedIn: "root" })
            ),
            e
          );
        })(),
        na = (() => {
          class e {
            constructor(n, r, i, o, s) {
              T(this, "overlay", void 0),
                T(this, "_injector", void 0),
                T(this, "sanitizer", void 0),
                T(this, "ngZone", void 0),
                T(this, "toastrConfig", void 0),
                T(this, "currentlyActive", 0),
                T(this, "toasts", []),
                T(this, "overlayContainer", void 0),
                T(this, "previousToastMessage", void 0),
                T(this, "index", 0),
                (this.overlay = r),
                (this._injector = i),
                (this.sanitizer = o),
                (this.ngZone = s),
                (this.toastrConfig = { ...n.default, ...n.config }),
                n.config.iconClasses &&
                  (this.toastrConfig.iconClasses = {
                    ...n.default.iconClasses,
                    ...n.config.iconClasses,
                  });
            }
            show(n, r, i = {}, o = "") {
              return this._preBuildNotification(o, n, r, this.applyConfig(i));
            }
            success(n, r, i = {}) {
              return this._preBuildNotification(
                this.toastrConfig.iconClasses.success || "",
                n,
                r,
                this.applyConfig(i)
              );
            }
            error(n, r, i = {}) {
              return this._preBuildNotification(
                this.toastrConfig.iconClasses.error || "",
                n,
                r,
                this.applyConfig(i)
              );
            }
            info(n, r, i = {}) {
              return this._preBuildNotification(
                this.toastrConfig.iconClasses.info || "",
                n,
                r,
                this.applyConfig(i)
              );
            }
            warning(n, r, i = {}) {
              return this._preBuildNotification(
                this.toastrConfig.iconClasses.warning || "",
                n,
                r,
                this.applyConfig(i)
              );
            }
            clear(n) {
              for (const r of this.toasts)
                if (void 0 !== n) {
                  if (r.toastId === n) return void r.toastRef.manualClose();
                } else r.toastRef.manualClose();
            }
            remove(n) {
              const r = this._findToast(n);
              if (
                !r ||
                (r.activeToast.toastRef.close(),
                this.toasts.splice(r.index, 1),
                (this.currentlyActive = this.currentlyActive - 1),
                !this.toastrConfig.maxOpened || !this.toasts.length)
              )
                return !1;
              if (
                this.currentlyActive < this.toastrConfig.maxOpened &&
                this.toasts[this.currentlyActive]
              ) {
                const i = this.toasts[this.currentlyActive].toastRef;
                i.isInactive() ||
                  ((this.currentlyActive = this.currentlyActive + 1),
                  i.activate());
              }
              return !0;
            }
            findDuplicate(n = "", r = "", i, o) {
              const { includeTitleDuplicates: s } = this.toastrConfig;
              for (const a of this.toasts)
                if ((!s || (s && a.title === n)) && a.message === r)
                  return a.toastRef.onDuplicate(i, o), a;
              return null;
            }
            applyConfig(n = {}) {
              return { ...this.toastrConfig, ...n };
            }
            _findToast(n) {
              for (let r = 0; r < this.toasts.length; r++)
                if (this.toasts[r].toastId === n)
                  return { index: r, activeToast: this.toasts[r] };
              return null;
            }
            _preBuildNotification(n, r, i, o) {
              return o.onActivateTick
                ? this.ngZone.run(() => this._buildNotification(n, r, i, o))
                : this._buildNotification(n, r, i, o);
            }
            _buildNotification(n, r, i, o) {
              if (!o.toastComponent) throw new Error("toastComponent required");
              const s = this.findDuplicate(
                i,
                r,
                this.toastrConfig.resetTimeoutOnDuplicate && o.timeOut > 0,
                this.toastrConfig.countDuplicates
              );
              if (
                ((this.toastrConfig.includeTitleDuplicates && i) || r) &&
                this.toastrConfig.preventDuplicates &&
                null !== s
              )
                return s;
              this.previousToastMessage = r;
              let a = !1;
              this.toastrConfig.maxOpened &&
                this.currentlyActive >= this.toastrConfig.maxOpened &&
                ((a = !0),
                this.toastrConfig.autoDismiss &&
                  this.clear(this.toasts[0].toastId));
              const l = this.overlay.create(
                o.positionClass,
                this.overlayContainer
              );
              this.index = this.index + 1;
              let c = r;
              r && o.enableHtml && (c = this.sanitizer.sanitize(Ce.HTML, r));
              const u = new g$(l),
                d = new Qc(this.index, o, c, i, n, u),
                h = $t.create({
                  providers: [{ provide: Qc, useValue: d }],
                  parent: this._injector,
                }),
                p = new h$(o.toastComponent, h),
                g = l.attach(p, o.newestOnTop);
              u.componentInstance = g.instance;
              const m = {
                toastId: this.index,
                title: i || "",
                message: r || "",
                toastRef: u,
                onShown: u.afterActivate(),
                onHidden: u.afterClosed(),
                onTap: d.onTap(),
                onAction: d.onAction(),
                portal: g,
              };
              return (
                a ||
                  ((this.currentlyActive = this.currentlyActive + 1),
                  setTimeout(() => {
                    m.toastRef.activate();
                  })),
                this.toasts.push(m),
                m
              );
            }
          }
          return (
            T(e, "\u0275fac", function (n) {
              return new (n || e)(D(AS), D(_$), D($t), D(CE), D(ye));
            }),
            T(
              e,
              "\u0275prov",
              O({ token: e, factory: e.ɵfac, providedIn: "root" })
            ),
            e
          );
        })();
      const C$ = {
          maxOpened: 0,
          autoDismiss: !1,
          newestOnTop: !0,
          preventDuplicates: !1,
          countDuplicates: !1,
          resetTimeoutOnDuplicate: !1,
          includeTitleDuplicates: !1,
          iconClasses: {
            error: "toast-error",
            info: "toast-info",
            success: "toast-success",
            warning: "toast-warning",
          },
          closeButton: !1,
          disableTimeOut: !1,
          timeOut: 5e3,
          extendedTimeOut: 1e3,
          enableHtml: !1,
          progressBar: !1,
          toastClass: "ngx-toastr",
          positionClass: "toast-top-right",
          titleClass: "toast-title",
          messageClass: "toast-message",
          easing: "ease-in",
          easeTime: 300,
          tapToDismiss: !0,
          onActivateTick: !1,
          progressAnimation: "decreasing",
          toastComponent: (() => {
            class e {
              get displayStyle() {
                if ("inactive" === this.state.value) return "none";
              }
              constructor(n, r, i) {
                T(this, "toastrService", void 0),
                  T(this, "toastPackage", void 0),
                  T(this, "ngZone", void 0),
                  T(this, "message", void 0),
                  T(this, "title", void 0),
                  T(this, "options", void 0),
                  T(this, "duplicatesCount", void 0),
                  T(this, "originalTimeout", void 0),
                  T(this, "width", -1),
                  T(this, "toastClasses", ""),
                  T(this, "state", void 0),
                  T(this, "timeout", void 0),
                  T(this, "intervalId", void 0),
                  T(this, "hideTime", void 0),
                  T(this, "sub", void 0),
                  T(this, "sub1", void 0),
                  T(this, "sub2", void 0),
                  T(this, "sub3", void 0),
                  (this.toastrService = n),
                  (this.toastPackage = r),
                  (this.ngZone = i),
                  (this.message = r.message),
                  (this.title = r.title),
                  (this.options = r.config),
                  (this.originalTimeout = r.config.timeOut),
                  (this.toastClasses = `${r.toastType} ${r.config.toastClass}`),
                  (this.sub = r.toastRef.afterActivate().subscribe(() => {
                    this.activateToast();
                  })),
                  (this.sub1 = r.toastRef.manualClosed().subscribe(() => {
                    this.remove();
                  })),
                  (this.sub2 = r.toastRef.timeoutReset().subscribe(() => {
                    this.resetTimeout();
                  })),
                  (this.sub3 = r.toastRef.countDuplicate().subscribe((o) => {
                    this.duplicatesCount = o;
                  })),
                  (this.state = {
                    value: "inactive",
                    params: {
                      easeTime: this.toastPackage.config.easeTime,
                      easing: "ease-in",
                    },
                  });
              }
              ngOnDestroy() {
                this.sub.unsubscribe(),
                  this.sub1.unsubscribe(),
                  this.sub2.unsubscribe(),
                  this.sub3.unsubscribe(),
                  clearInterval(this.intervalId),
                  clearTimeout(this.timeout);
              }
              activateToast() {
                (this.state = { ...this.state, value: "active" }),
                  !0 !== this.options.disableTimeOut &&
                    "timeOut" !== this.options.disableTimeOut &&
                    this.options.timeOut &&
                    (this.outsideTimeout(
                      () => this.remove(),
                      this.options.timeOut
                    ),
                    (this.hideTime =
                      new Date().getTime() + this.options.timeOut),
                    this.options.progressBar &&
                      this.outsideInterval(() => this.updateProgress(), 10));
              }
              updateProgress() {
                if (
                  0 === this.width ||
                  100 === this.width ||
                  !this.options.timeOut
                )
                  return;
                const n = new Date().getTime();
                (this.width =
                  ((this.hideTime - n) / this.options.timeOut) * 100),
                  "increasing" === this.options.progressAnimation &&
                    (this.width = 100 - this.width),
                  this.width <= 0 && (this.width = 0),
                  this.width >= 100 && (this.width = 100);
              }
              resetTimeout() {
                clearTimeout(this.timeout),
                  clearInterval(this.intervalId),
                  (this.state = { ...this.state, value: "active" }),
                  this.outsideTimeout(
                    () => this.remove(),
                    this.originalTimeout
                  ),
                  (this.options.timeOut = this.originalTimeout),
                  (this.hideTime =
                    new Date().getTime() + (this.options.timeOut || 0)),
                  (this.width = -1),
                  this.options.progressBar &&
                    this.outsideInterval(() => this.updateProgress(), 10);
              }
              remove() {
                "removed" !== this.state.value &&
                  (clearTimeout(this.timeout),
                  (this.state = { ...this.state, value: "removed" }),
                  this.outsideTimeout(
                    () => this.toastrService.remove(this.toastPackage.toastId),
                    +this.toastPackage.config.easeTime
                  ));
              }
              tapToast() {
                "removed" !== this.state.value &&
                  (this.toastPackage.triggerTap(),
                  this.options.tapToDismiss && this.remove());
              }
              stickAround() {
                "removed" !== this.state.value &&
                  "extendedTimeOut" !== this.options.disableTimeOut &&
                  (clearTimeout(this.timeout),
                  (this.options.timeOut = 0),
                  (this.hideTime = 0),
                  clearInterval(this.intervalId),
                  (this.width = 0));
              }
              delayedHideToast() {
                !0 === this.options.disableTimeOut ||
                  "extendedTimeOut" === this.options.disableTimeOut ||
                  0 === this.options.extendedTimeOut ||
                  "removed" === this.state.value ||
                  (this.outsideTimeout(
                    () => this.remove(),
                    this.options.extendedTimeOut
                  ),
                  (this.options.timeOut = this.options.extendedTimeOut),
                  (this.hideTime =
                    new Date().getTime() + (this.options.timeOut || 0)),
                  (this.width = -1),
                  this.options.progressBar &&
                    this.outsideInterval(() => this.updateProgress(), 10));
              }
              outsideTimeout(n, r) {
                this.ngZone
                  ? this.ngZone.runOutsideAngular(
                      () =>
                        (this.timeout = setTimeout(
                          () => this.runInsideAngular(n),
                          r
                        ))
                    )
                  : (this.timeout = setTimeout(() => n(), r));
              }
              outsideInterval(n, r) {
                this.ngZone
                  ? this.ngZone.runOutsideAngular(
                      () =>
                        (this.intervalId = setInterval(
                          () => this.runInsideAngular(n),
                          r
                        ))
                    )
                  : (this.intervalId = setInterval(() => n(), r));
              }
              runInsideAngular(n) {
                this.ngZone ? this.ngZone.run(() => n()) : n();
              }
            }
            return (
              T(e, "\u0275fac", function (n) {
                return new (n || e)(C(na), C(Qc), C(ye));
              }),
              T(
                e,
                "\u0275cmp",
                Xt({
                  type: e,
                  selectors: [["", "toast-component", ""]],
                  hostVars: 5,
                  hostBindings: function (n, r) {
                    1 & n &&
                      ue("click", function () {
                        return r.tapToast();
                      })("mouseenter", function () {
                        return r.stickAround();
                      })("mouseleave", function () {
                        return r.delayedHideToast();
                      }),
                      2 & n &&
                        (Kf("@flyInOut", r.state),
                        ir(r.toastClasses),
                        io("display", r.displayStyle));
                  },
                  standalone: !0,
                  features: [Wl],
                  attrs: MS,
                  decls: 5,
                  vars: 5,
                  consts: [
                    [
                      "type",
                      "button",
                      "class",
                      "toast-close-button",
                      "aria-label",
                      "Close",
                      3,
                      "click",
                      4,
                      "ngIf",
                    ],
                    [3, "class", 4, "ngIf"],
                    ["role", "alert", 3, "class", "innerHTML", 4, "ngIf"],
                    ["role", "alert", 3, "class", 4, "ngIf"],
                    [4, "ngIf"],
                    [
                      "type",
                      "button",
                      "aria-label",
                      "Close",
                      1,
                      "toast-close-button",
                      3,
                      "click",
                    ],
                    ["aria-hidden", "true"],
                    ["role", "alert", 3, "innerHTML"],
                    ["role", "alert"],
                    [1, "toast-progress"],
                  ],
                  template: function (n, r) {
                    1 & n &&
                      (H(0, t$, 3, 0, "button", 0),
                      H(1, r$, 3, 5, "div", 1),
                      H(2, i$, 1, 3, "div", 2),
                      H(3, o$, 2, 4, "div", 3),
                      H(4, s$, 2, 2, "div", 4)),
                      2 & n &&
                        (F("ngIf", r.options.closeButton),
                        A(1),
                        F("ngIf", r.title),
                        A(1),
                        F("ngIf", r.message && r.options.enableHtml),
                        A(1),
                        F("ngIf", r.message && !r.options.enableHtml),
                        A(1),
                        F("ngIf", r.options.progressBar));
                  },
                  dependencies: [ni],
                  encapsulation: 2,
                  data: {
                    animation: [
                      Kc("flyInOut", [
                        ui("inactive", Nt({ opacity: 0 })),
                        ui("active", Nt({ opacity: 1 })),
                        ui("removed", Nt({ opacity: 0 })),
                        Js(
                          "inactive => active",
                          Mo("{{ easeTime }}ms {{ easing }}")
                        ),
                        Js(
                          "active => removed",
                          Mo("{{ easeTime }}ms {{ easing }}")
                        ),
                      ]),
                    ],
                  },
                })
              ),
              e
            );
          })(),
        },
        b$ = (e = {}) =>
          _l([{ provide: AS, useValue: { default: C$, config: e } }]);
      let w$ = (() => {
        class e {
          static forRoot(n = {}) {
            return { ngModule: e, providers: [b$(n)] };
          }
        }
        return (
          T(e, "\u0275fac", function (n) {
            return new (n || e)();
          }),
          T(e, "\u0275mod", Ve({ type: e })),
          T(e, "\u0275inj", Fe({})),
          e
        );
      })();
      class D$ extends Rt {
        constructor(t, n) {
          super();
        }
        schedule(t, n = 0) {
          return this;
        }
      }
      const Zc = {
        setInterval(e, t, ...n) {
          const { delegate: r } = Zc;
          return r?.setInterval
            ? r.setInterval(e, t, ...n)
            : setInterval(e, t, ...n);
        },
        clearInterval(e) {
          const { delegate: t } = Zc;
          return (t?.clearInterval || clearInterval)(e);
        },
        delegate: void 0,
      };
      class E$ extends D$ {
        constructor(t, n) {
          super(t, n),
            (this.scheduler = t),
            (this.work = n),
            (this.pending = !1);
        }
        schedule(t, n = 0) {
          var r;
          if (this.closed) return this;
          this.state = t;
          const i = this.id,
            o = this.scheduler;
          return (
            null != i && (this.id = this.recycleAsyncId(o, i, n)),
            (this.pending = !0),
            (this.delay = n),
            (this.id =
              null !== (r = this.id) && void 0 !== r
                ? r
                : this.requestAsyncId(o, this.id, n)),
            this
          );
        }
        requestAsyncId(t, n, r = 0) {
          return Zc.setInterval(t.flush.bind(t, this), r);
        }
        recycleAsyncId(t, n, r = 0) {
          if (null != r && this.delay === r && !1 === this.pending) return n;
          null != n && Zc.clearInterval(n);
        }
        execute(t, n) {
          if (this.closed) return new Error("executing a cancelled action");
          this.pending = !1;
          const r = this._execute(t, n);
          if (r) return r;
          !1 === this.pending &&
            null != this.id &&
            (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
        }
        _execute(t, n) {
          let i,
            r = !1;
          try {
            this.work(t);
          } catch (o) {
            (r = !0),
              (i = o || new Error("Scheduled action threw falsy error"));
          }
          if (r) return this.unsubscribe(), i;
        }
        unsubscribe() {
          if (!this.closed) {
            const { id: t, scheduler: n } = this,
              { actions: r } = n;
            (this.work = this.state = this.scheduler = null),
              (this.pending = !1),
              wa(r, this),
              null != t && (this.id = this.recycleAsyncId(n, t, null)),
              (this.delay = null),
              super.unsubscribe();
          }
        }
      }
      const IS = { now: () => (IS.delegate || Date).now(), delegate: void 0 };
      class ra {
        constructor(t, n = ra.now) {
          (this.schedulerActionCtor = t), (this.now = n);
        }
        schedule(t, n = 0, r) {
          return new this.schedulerActionCtor(this, t).schedule(r, n);
        }
      }
      ra.now = IS.now;
      class M$ extends ra {
        constructor(t, n = ra.now) {
          super(t, n), (this.actions = []), (this._active = !1);
        }
        flush(t) {
          const { actions: n } = this;
          if (this._active) return void n.push(t);
          let r;
          this._active = !0;
          do {
            if ((r = t.execute(t.state, t.delay))) break;
          } while ((t = n.shift()));
          if (((this._active = !1), r)) {
            for (; (t = n.shift()); ) t.unsubscribe();
            throw r;
          }
        }
      }
      const A$ = new (class T$ extends M$ {})(
        class S$ extends E$ {
          constructor(t, n) {
            super(t, n), (this.scheduler = t), (this.work = n);
          }
          schedule(t, n = 0) {
            return n > 0
              ? super.schedule(t, n)
              : ((this.delay = n),
                (this.state = t),
                this.scheduler.flush(this),
                this);
          }
          execute(t, n) {
            return n > 0 || this.closed
              ? super.execute(t, n)
              : this._execute(t, n);
          }
          requestAsyncId(t, n, r = 0) {
            return (null != r && r > 0) || (null == r && this.delay > 0)
              ? super.requestAsyncId(t, n, r)
              : (t.flush(this), 0);
          }
        }
      );
      class R$ extends Error {
        constructor(t, n) {
          super(
            (function P$(e, t) {
              return `NG0${Math.abs(e)}${t ? ": " + t : ""}`;
            })(t, n)
          ),
            (this.code = t);
        }
      }
      function FS(e, t) {
        const n = !t?.manualCleanup;
        n &&
          !t?.injector &&
          (function H_(e) {
            if (
              !ty() &&
              !(function DI() {
                return Di;
              })()
            )
              throw new v(-203, !1);
          })();
        const r = n ? t?.injector?.get(Ol) ?? M(Ol) : null;
        let i;
        i = (function Ty(e, t) {
          const n = new nx(e, t?.equal ?? Ey);
          return dd(n, n.signal.bind(n), {
            set: n.set.bind(n),
            update: n.update.bind(n),
            mutate: n.mutate.bind(n),
            asReadonly: n.asReadonly.bind(n),
          });
        })(t?.requireSync ? { kind: 0 } : { kind: 1, value: t?.initialValue });
        const o = e.subscribe({
          next: (s) => i.set({ kind: 1, value: s }),
          error: (s) => i.set({ kind: 2, error: s }),
        });
        return (
          r?.onDestroy(o.unsubscribe.bind(o)),
          Sy(() => {
            const s = i();
            switch (s.kind) {
              case 1:
                return s.value;
              case 2:
                throw s.error;
              case 0:
                throw new R$(
                  601,
                  "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously."
                );
            }
          })
        );
      }
      const ia = {};
      function eu(e, t) {
        if (((ia[e] = (ia[e] || 0) + 1), "function" == typeof t))
          return sg(e, (...r) => ({ ...t(...r), type: e }));
        switch (t ? t._as : "empty") {
          case "empty":
            return sg(e, () => ({ type: e }));
          case "props":
            return sg(e, (r) => ({ ...r, type: e }));
          default:
            throw new Error("Unexpected config.");
        }
      }
      function sg(e, t) {
        return Object.defineProperty(t, "type", { value: e, writable: !1 });
      }
      const LS = "@ngrx/store/init";
      let di = (() => {
        class e extends gt {
          constructor() {
            super({ type: LS });
          }
          next(n) {
            if ("function" == typeof n)
              throw new TypeError(
                "\n        Dispatch expected an object, instead it received a function.\n        If you're using the createAction function, make sure to invoke the function\n        before dispatching the action. For example, someAction should be someAction()."
              );
            if (typeof n > "u") throw new TypeError("Actions must be objects");
            if (typeof n.type > "u")
              throw new TypeError("Actions must have a type property");
            super.next(n);
          }
          complete() {}
          ngOnDestroy() {
            super.complete();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const z$ = [di],
        lg = new S("@ngrx/store Internal Root Guard"),
        VS = new S("@ngrx/store Internal Initial State"),
        cg = new S("@ngrx/store Initial State"),
        BS = new S("@ngrx/store Reducer Factory"),
        jS = new S("@ngrx/store Internal Reducer Factory Provider"),
        HS = new S("@ngrx/store Initial Reducers"),
        ug = new S("@ngrx/store Internal Initial Reducers"),
        US = new S("@ngrx/store Store Features"),
        $S = new S("@ngrx/store Internal Store Reducers"),
        dg = new S("@ngrx/store Internal Feature Reducers"),
        zS = new S("@ngrx/store Internal Feature Configs"),
        fg = new S("@ngrx/store Internal Store Features"),
        qS = new S("@ngrx/store Internal Feature Reducers Token"),
        hg = new S("@ngrx/store Feature Reducers"),
        GS = new S("@ngrx/store User Provided Meta Reducers"),
        tu = new S("@ngrx/store Meta Reducers"),
        WS = new S("@ngrx/store Internal Resolved Meta Reducers"),
        KS = new S("@ngrx/store User Runtime Checks Config"),
        QS = new S("@ngrx/store Internal User Runtime Checks Config"),
        oa = new S("@ngrx/store Internal Runtime Checks"),
        sa = new S("@ngrx/store Check if Action types are unique");
      function gg(e, t = {}) {
        const n = Object.keys(e),
          r = {};
        for (let o = 0; o < n.length; o++) {
          const s = n[o];
          "function" == typeof e[s] && (r[s] = e[s]);
        }
        const i = Object.keys(r);
        return function (s, a) {
          s = void 0 === s ? t : s;
          let l = !1;
          const c = {};
          for (let u = 0; u < i.length; u++) {
            const d = i[u],
              h = s[d],
              p = (0, r[d])(h, a);
            (c[d] = p), (l = l || p !== h);
          }
          return l ? c : s;
        };
      }
      function YS(...e) {
        return function (t) {
          if (0 === e.length) return t;
          const n = e[e.length - 1];
          return e.slice(0, -1).reduceRight((i, o) => o(i), n(t));
        };
      }
      function XS(e, t) {
        return (
          Array.isArray(t) && t.length > 0 && (e = YS.apply(null, [...t, e])),
          (n, r) => {
            const i = e(n);
            return (o, s) => i((o = void 0 === o ? r : o), s);
          }
        );
      }
      new S("@ngrx/store Root Store Provider"),
        new S("@ngrx/store Feature State Provider");
      class nu extends ve {}
      class JS extends di {}
      let aa = (() => {
        class e extends gt {
          get currentReducers() {
            return this.reducers;
          }
          constructor(n, r, i, o) {
            super(o(i, r)),
              (this.dispatcher = n),
              (this.initialState = r),
              (this.reducers = i),
              (this.reducerFactory = o);
          }
          addFeature(n) {
            this.addFeatures([n]);
          }
          addFeatures(n) {
            const r = n.reduce(
              (
                i,
                {
                  reducers: o,
                  reducerFactory: s,
                  metaReducers: a,
                  initialState: l,
                  key: c,
                }
              ) => {
                const u =
                  "function" == typeof o
                    ? (function G$(e) {
                        const t =
                          Array.isArray(e) && e.length > 0
                            ? YS(...e)
                            : (n) => n;
                        return (n, r) => (
                          (n = t(n)), (i, o) => n((i = void 0 === i ? r : i), o)
                        );
                      })(a)(o, l)
                    : XS(s, a)(o, l);
                return (i[c] = u), i;
              },
              {}
            );
            this.addReducers(r);
          }
          removeFeature(n) {
            this.removeFeatures([n]);
          }
          removeFeatures(n) {
            this.removeReducers(n.map((r) => r.key));
          }
          addReducer(n, r) {
            this.addReducers({ [n]: r });
          }
          addReducers(n) {
            (this.reducers = { ...this.reducers, ...n }),
              this.updateReducers(Object.keys(n));
          }
          removeReducer(n) {
            this.removeReducers([n]);
          }
          removeReducers(n) {
            n.forEach((r) => {
              this.reducers = (function q$(e, t) {
                return Object.keys(e)
                  .filter((n) => n !== t)
                  .reduce((n, r) => Object.assign(n, { [r]: e[r] }), {});
              })(this.reducers, r);
            }),
              this.updateReducers(n);
          }
          updateReducers(n) {
            this.next(this.reducerFactory(this.reducers, this.initialState)),
              this.dispatcher.next({
                type: "@ngrx/store/update-reducers",
                features: n,
              });
          }
          ngOnDestroy() {
            this.complete();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(JS), D(cg), D(HS), D(BS));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const K$ = [
        aa,
        { provide: nu, useExisting: aa },
        { provide: JS, useExisting: di },
      ];
      let la = (() => {
        class e extends We {
          ngOnDestroy() {
            this.complete();
          }
        }
        return (
          (e.ɵfac = (function () {
            let t;
            return function (r) {
              return (t || (t = rt(e)))(r || e);
            };
          })()),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Q$ = [la];
      class eM extends ve {}
      let tM = (() => {
        class e extends gt {
          constructor(n, r, i, o) {
            super(o);
            const a = n.pipe(Qu(A$)).pipe(
                (function I$(...e) {
                  const t = Ku(e);
                  return Me((n, r) => {
                    const i = e.length,
                      o = new Array(i);
                    let s = e.map(() => !1),
                      a = !1;
                    for (let l = 0; l < i; l++)
                      at(e[l]).subscribe(
                        _e(
                          r,
                          (c) => {
                            (o[l] = c),
                              !a &&
                                !s[l] &&
                                ((s[l] = !0), (a = s.every(Wn)) && (s = null));
                          },
                          Ea
                        )
                      );
                    n.subscribe(
                      _e(r, (l) => {
                        if (a) {
                          const c = [l, ...o];
                          r.next(t ? t(...c) : c);
                        }
                      })
                    );
                  });
                })(r)
              ),
              c = a.pipe(xE(Z$, { state: o }));
            (this.stateSubscription = c.subscribe(({ state: u, action: d }) => {
              this.next(u), i.next(d);
            })),
              (this.state = FS(this, { manualCleanup: !0, requireSync: !0 }));
          }
          ngOnDestroy() {
            this.stateSubscription.unsubscribe(), this.complete();
          }
        }
        return (
          (e.INIT = LS),
          (e.ɵfac = function (n) {
            return new (n || e)(D(di), D(nu), D(la), D(cg));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function Z$(e = { state: void 0 }, [t, n]) {
        const { state: r } = e;
        return { state: n(r, t), action: t };
      }
      const Y$ = [tM, { provide: eM, useExisting: tM }];
      let fi = (() => {
        class e extends ve {
          constructor(n, r, i) {
            super(),
              (this.actionsObserver = r),
              (this.reducerManager = i),
              (this.source = n),
              (this.state = n.state);
          }
          select(n, ...r) {
            return J$.call(null, n, ...r)(this);
          }
          selectSignal(n, r) {
            return Sy(() => n(this.state()), {
              equal: r?.equal || ((i, o) => i === o),
            });
          }
          lift(n) {
            const r = new e(this, this.actionsObserver, this.reducerManager);
            return (r.operator = n), r;
          }
          dispatch(n) {
            this.actionsObserver.next(n);
          }
          next(n) {
            this.actionsObserver.next(n);
          }
          error(n) {
            this.actionsObserver.error(n);
          }
          complete() {
            this.actionsObserver.complete();
          }
          addReducer(n, r) {
            this.reducerManager.addReducer(n, r);
          }
          removeReducer(n) {
            this.reducerManager.removeReducer(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(eM), D(di), D(aa));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const X$ = [fi];
      function J$(e, t, ...n) {
        return function (i) {
          let o;
          if ("string" == typeof e) {
            const s = [t, ...n].filter(Boolean);
            o = i.pipe(
              (function x$(...e) {
                const t = e.length;
                if (0 === t)
                  throw new Error("list of properties cannot be empty.");
                return te((n) => {
                  let r = n;
                  for (let i = 0; i < t; i++) {
                    const o = r?.[e[i]];
                    if (!(typeof o < "u")) return;
                    r = o;
                  }
                  return r;
                });
              })(e, ...s)
            );
          } else {
            if ("function" != typeof e)
              throw new TypeError(
                `Unexpected type '${typeof e}' in select operator, expected 'string' or 'function'`
              );
            o = i.pipe(te((s) => e(s, t)));
          }
          return o.pipe(Zm());
        };
      }
      const mg = "https://ngrx.io/guide/store/configuration/runtime-checks";
      function nM(e) {
        return void 0 === e;
      }
      function rM(e) {
        return null === e;
      }
      function iM(e) {
        return Array.isArray(e);
      }
      function oM(e) {
        return "object" == typeof e && null !== e;
      }
      function yg(e) {
        return "function" == typeof e;
      }
      function g3(e) {
        return e instanceof S ? M(e) : e;
      }
      function m3(e, t) {
        return t.map((n, r) => {
          if (e[r] instanceof S) {
            const i = M(e[r]);
            return {
              key: n.key,
              reducerFactory: i.reducerFactory ? i.reducerFactory : gg,
              metaReducers: i.metaReducers ? i.metaReducers : [],
              initialState: i.initialState,
            };
          }
          return n;
        });
      }
      function y3(e) {
        return e.map((t) => (t instanceof S ? M(t) : t));
      }
      function Cg(e) {
        return "function" == typeof e ? e() : e;
      }
      function v3(e, t) {
        return e.concat(t);
      }
      function _3() {
        if (M(fi, { optional: !0, skipSelf: !0 }))
          throw new TypeError(
            "The root Store has been provided more than once. Feature modules should provide feature states instead."
          );
        return "guarded";
      }
      function bg(e) {
        Object.freeze(e);
        const t = yg(e);
        return (
          Object.getOwnPropertyNames(e).forEach((n) => {
            if (
              !n.startsWith("\u0275") &&
              (function o3(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t);
              })(e, n) &&
              (!t || ("caller" !== n && "callee" !== n && "arguments" !== n))
            ) {
              const r = e[n];
              (oM(r) || yg(r)) && !Object.isFrozen(r) && bg(r);
            }
          }),
          e
        );
      }
      function wg(e, t = []) {
        return (nM(e) || rM(e)) && 0 === t.length
          ? { path: ["root"], value: e }
          : Object.keys(e).reduce((r, i) => {
              if (r) return r;
              const o = e[i];
              return (function i3(e) {
                return yg(e) && e.hasOwnProperty("\u0275cmp");
              })(o)
                ? r
                : !(
                    nM(o) ||
                    rM(o) ||
                    (function n3(e) {
                      return "number" == typeof e;
                    })(o) ||
                    (function t3(e) {
                      return "boolean" == typeof e;
                    })(o) ||
                    (function e3(e) {
                      return "string" == typeof e;
                    })(o) ||
                    iM(o)
                  ) &&
                    ((function sM(e) {
                      if (
                        !(function r3(e) {
                          return oM(e) && !iM(e);
                        })(e)
                      )
                        return !1;
                      const t = Object.getPrototypeOf(e);
                      return t === Object.prototype || null === t;
                    })(o)
                      ? wg(o, [...t, i])
                      : { path: [...t, i], value: o });
            }, !1);
      }
      function cM(e, t) {
        if (!1 === e) return;
        const n = e.path.join("."),
          r = new Error(
            `Detected unserializable ${t} at "${n}". ${mg}#strict${t}serializability`
          );
        throw ((r.value = e.value), (r.unserializablePath = n), r);
      }
      function D3(e) {
        return {
          strictStateSerializability: !1,
          strictActionSerializability: !1,
          strictStateImmutability: !1,
          strictActionImmutability: !1,
          strictActionWithinNgZone: !1,
          strictActionTypeUniqueness: !1,
        };
      }
      function E3({
        strictActionSerializability: e,
        strictStateSerializability: t,
      }) {
        return (n) =>
          e || t
            ? (function b3(e, t) {
                return function (n, r) {
                  t.action(r) && cM(wg(r), "action");
                  const i = e(n, r);
                  return t.state() && cM(wg(i), "state"), i;
                };
              })(n, { action: (r) => e && !Dg(r), state: () => t })
            : n;
      }
      function S3({ strictActionImmutability: e, strictStateImmutability: t }) {
        return (n) =>
          e || t
            ? (function C3(e, t) {
                return function (n, r) {
                  const i = t.action(r) ? bg(r) : r,
                    o = e(n, i);
                  return t.state() ? bg(o) : o;
                };
              })(n, { action: (r) => e && !Dg(r), state: () => t })
            : n;
      }
      function Dg(e) {
        return e.type.startsWith("@ngrx");
      }
      function M3({ strictActionWithinNgZone: e }) {
        return (t) =>
          e
            ? (function w3(e, t) {
                return function (n, r) {
                  if (t.action(r) && !ye.isInAngularZone())
                    throw new Error(
                      `Action '${r.type}' running outside NgZone. ${mg}#strictactionwithinngzone`
                    );
                  return e(n, r);
                };
              })(t, { action: (n) => e && !Dg(n) })
            : t;
      }
      function T3(e) {
        return [
          { provide: QS, useValue: e },
          { provide: KS, useFactory: A3, deps: [QS] },
          { provide: oa, deps: [KS], useFactory: D3 },
          { provide: tu, multi: !0, deps: [oa], useFactory: S3 },
          { provide: tu, multi: !0, deps: [oa], useFactory: E3 },
          { provide: tu, multi: !0, deps: [oa], useFactory: M3 },
        ];
      }
      function uM() {
        return [{ provide: sa, multi: !0, deps: [oa], useFactory: I3 }];
      }
      function A3(e) {
        return e;
      }
      function I3(e) {
        if (!e.strictActionTypeUniqueness) return;
        const t = Object.entries(ia)
          .filter(([, n]) => n > 1)
          .map(([n]) => n);
        if (t.length)
          throw new Error(
            `Action types are registered more than once, ${t
              .map((n) => `"${n}"`)
              .join(", ")}. ${mg}#strictactiontypeuniqueness`
          );
      }
      function dM(e = {}, t = {}) {
        return [
          { provide: lg, useFactory: _3 },
          { provide: VS, useValue: t.initialState },
          { provide: cg, useFactory: Cg, deps: [VS] },
          { provide: ug, useValue: e },
          { provide: $S, useExisting: e instanceof S ? e : ug },
          { provide: HS, deps: [ug, [new Rd($S)]], useFactory: g3 },
          { provide: GS, useValue: t.metaReducers ? t.metaReducers : [] },
          { provide: WS, deps: [tu, GS], useFactory: v3 },
          { provide: jS, useValue: t.reducerFactory ? t.reducerFactory : gg },
          { provide: BS, deps: [jS, WS], useFactory: XS },
          z$,
          K$,
          Q$,
          Y$,
          X$,
          T3(t.runtimeChecks),
          uM(),
        ];
      }
      function fM(e, t, n = {}) {
        return [
          { provide: zS, multi: !0, useValue: e instanceof Object ? {} : n },
          {
            provide: US,
            multi: !0,
            useValue: {
              key: e instanceof Object ? e.name : e,
              reducerFactory:
                n instanceof S || !n.reducerFactory ? gg : n.reducerFactory,
              metaReducers:
                n instanceof S || !n.metaReducers ? [] : n.metaReducers,
              initialState:
                n instanceof S || !n.initialState ? void 0 : n.initialState,
            },
          },
          { provide: fg, deps: [zS, US], useFactory: m3 },
          {
            provide: dg,
            multi: !0,
            useValue: e instanceof Object ? e.reducer : t,
          },
          { provide: qS, multi: !0, useExisting: t instanceof S ? t : dg },
          { provide: hg, multi: !0, deps: [dg, [new Rd(qS)]], useFactory: y3 },
          uM(),
        ];
      }
      let ru = (() => {
          class e {
            constructor(n, r, i, o, s, a) {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(
                D(di),
                D(nu),
                D(la),
                D(fi),
                D(lg, 8),
                D(sa, 8)
              );
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({})),
            e
          );
        })(),
        Eg = (() => {
          class e {
            constructor(n, r, i, o, s) {
              (this.features = n),
                (this.featureReducers = r),
                (this.reducerManager = i);
              const a = n.map((l, c) => {
                const d = r.shift()[c];
                return { ...l, reducers: d, initialState: Cg(l.initialState) };
              });
              i.addFeatures(a);
            }
            ngOnDestroy() {
              this.reducerManager.removeFeatures(this.features);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(fg), D(hg), D(aa), D(ru), D(sa, 8));
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({})),
            e
          );
        })(),
        P3 = (() => {
          class e {
            static forRoot(n, r) {
              return { ngModule: ru, providers: [...dM(n, r)] };
            }
            static forFeature(n, r, i = {}) {
              return { ngModule: Eg, providers: [...fM(n, r, i)] };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({})),
            e
          );
        })(),
        hM = (() => {
          class e {
            constructor(n, r) {
              (this._renderer = n),
                (this._elementRef = r),
                (this.onChange = (i) => {}),
                (this.onTouched = () => {});
            }
            setProperty(n, r) {
              this._renderer.setProperty(this._elementRef.nativeElement, n, r);
            }
            registerOnTouched(n) {
              this.onTouched = n;
            }
            registerOnChange(n) {
              this.onChange = n;
            }
            setDisabledState(n) {
              this.setProperty("disabled", n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(C(tr), C(Ut));
            }),
            (e.ɵdir = W({ type: e })),
            e
          );
        })(),
        hi = (() => {
          class e extends hM {}
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = rt(e)))(r || e);
              };
            })()),
            (e.ɵdir = W({ type: e, features: [ge] })),
            e
          );
        })();
      const zn = new S("NgValueAccessor"),
        B3 = { provide: zn, useExisting: we(() => ca), multi: !0 },
        H3 = new S("CompositionEventMode");
      let ca = (() => {
        class e extends hM {
          constructor(n, r, i) {
            super(n, r),
              (this._compositionMode = i),
              (this._composing = !1),
              null == this._compositionMode &&
                (this._compositionMode = !(function j3() {
                  const e = Sr() ? Sr().getUserAgent() : "";
                  return /android (\d+)/.test(e.toLowerCase());
                })());
          }
          writeValue(n) {
            this.setProperty("value", n ?? "");
          }
          _handleInput(n) {
            (!this._compositionMode ||
              (this._compositionMode && !this._composing)) &&
              this.onChange(n);
          }
          _compositionStart() {
            this._composing = !0;
          }
          _compositionEnd(n) {
            (this._composing = !1), this._compositionMode && this.onChange(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(C(tr), C(Ut), C(H3, 8));
          }),
          (e.ɵdir = W({
            type: e,
            selectors: [
              ["input", "formControlName", "", 3, "type", "checkbox"],
              ["textarea", "formControlName", ""],
              ["input", "formControl", "", 3, "type", "checkbox"],
              ["textarea", "formControl", ""],
              ["input", "ngModel", "", 3, "type", "checkbox"],
              ["textarea", "ngModel", ""],
              ["", "ngDefaultControl", ""],
            ],
            hostBindings: function (n, r) {
              1 & n &&
                ue("input", function (o) {
                  return r._handleInput(o.target.value);
                })("blur", function () {
                  return r.onTouched();
                })("compositionstart", function () {
                  return r._compositionStart();
                })("compositionend", function (o) {
                  return r._compositionEnd(o.target.value);
                });
            },
            features: [Te([B3]), ge],
          })),
          e
        );
      })();
      function Nr(e) {
        return (
          null == e ||
          (("string" == typeof e || Array.isArray(e)) && 0 === e.length)
        );
      }
      function gM(e) {
        return null != e && "number" == typeof e.length;
      }
      const ht = new S("NgValidators"),
        Rr = new S("NgAsyncValidators"),
        U3 =
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      class iu {
        static min(t) {
          return (function mM(e) {
            return (t) => {
              if (Nr(t.value) || Nr(e)) return null;
              const n = parseFloat(t.value);
              return !isNaN(n) && n < e
                ? { min: { min: e, actual: t.value } }
                : null;
            };
          })(t);
        }
        static max(t) {
          return (function yM(e) {
            return (t) => {
              if (Nr(t.value) || Nr(e)) return null;
              const n = parseFloat(t.value);
              return !isNaN(n) && n > e
                ? { max: { max: e, actual: t.value } }
                : null;
            };
          })(t);
        }
        static required(t) {
          return (function vM(e) {
            return Nr(e.value) ? { required: !0 } : null;
          })(t);
        }
        static requiredTrue(t) {
          return (function _M(e) {
            return !0 === e.value ? null : { required: !0 };
          })(t);
        }
        static email(t) {
          return (function CM(e) {
            return Nr(e.value) || U3.test(e.value) ? null : { email: !0 };
          })(t);
        }
        static minLength(t) {
          return (function bM(e) {
            return (t) =>
              Nr(t.value) || !gM(t.value)
                ? null
                : t.value.length < e
                ? {
                    minlength: {
                      requiredLength: e,
                      actualLength: t.value.length,
                    },
                  }
                : null;
          })(t);
        }
        static maxLength(t) {
          return (function wM(e) {
            return (t) =>
              gM(t.value) && t.value.length > e
                ? {
                    maxlength: {
                      requiredLength: e,
                      actualLength: t.value.length,
                    },
                  }
                : null;
          })(t);
        }
        static pattern(t) {
          return (function DM(e) {
            if (!e) return ou;
            let t, n;
            return (
              "string" == typeof e
                ? ((n = ""),
                  "^" !== e.charAt(0) && (n += "^"),
                  (n += e),
                  "$" !== e.charAt(e.length - 1) && (n += "$"),
                  (t = new RegExp(n)))
                : ((n = e.toString()), (t = e)),
              (r) => {
                if (Nr(r.value)) return null;
                const i = r.value;
                return t.test(i)
                  ? null
                  : { pattern: { requiredPattern: n, actualValue: i } };
              }
            );
          })(t);
        }
        static nullValidator(t) {
          return null;
        }
        static compose(t) {
          return IM(t);
        }
        static composeAsync(t) {
          return xM(t);
        }
      }
      function ou(e) {
        return null;
      }
      function EM(e) {
        return null != e;
      }
      function SM(e) {
        return _s(e) ? Qe(e) : e;
      }
      function MM(e) {
        let t = {};
        return (
          e.forEach((n) => {
            t = null != n ? { ...t, ...n } : t;
          }),
          0 === Object.keys(t).length ? null : t
        );
      }
      function TM(e, t) {
        return t.map((n) => n(e));
      }
      function AM(e) {
        return e.map((t) =>
          (function $3(e) {
            return !e.validate;
          })(t)
            ? t
            : (n) => t.validate(n)
        );
      }
      function IM(e) {
        if (!e) return null;
        const t = e.filter(EM);
        return 0 == t.length
          ? null
          : function (n) {
              return MM(TM(n, t));
            };
      }
      function Sg(e) {
        return null != e ? IM(AM(e)) : null;
      }
      function xM(e) {
        if (!e) return null;
        const t = e.filter(EM);
        return 0 == t.length
          ? null
          : function (n) {
              return (function L3(...e) {
                const t = Ku(e),
                  { args: n, keys: r } = DE(e),
                  i = new ve((o) => {
                    const { length: s } = n;
                    if (!s) return void o.complete();
                    const a = new Array(s);
                    let l = s,
                      c = s;
                    for (let u = 0; u < s; u++) {
                      let d = !1;
                      at(n[u]).subscribe(
                        _e(
                          o,
                          (f) => {
                            d || ((d = !0), c--), (a[u] = f);
                          },
                          () => l--,
                          void 0,
                          () => {
                            (!l || !d) &&
                              (c || o.next(r ? SE(r, a) : a), o.complete());
                          }
                        )
                      );
                    }
                  });
                return t ? i.pipe(EE(t)) : i;
              })(TM(n, t).map(SM)).pipe(te(MM));
            };
      }
      function Mg(e) {
        return null != e ? xM(AM(e)) : null;
      }
      function OM(e, t) {
        return null === e ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
      }
      function NM(e) {
        return e._rawValidators;
      }
      function RM(e) {
        return e._rawAsyncValidators;
      }
      function Tg(e) {
        return e ? (Array.isArray(e) ? e : [e]) : [];
      }
      function su(e, t) {
        return Array.isArray(e) ? e.includes(t) : e === t;
      }
      function PM(e, t) {
        const n = Tg(t);
        return (
          Tg(e).forEach((i) => {
            su(n, i) || n.push(i);
          }),
          n
        );
      }
      function FM(e, t) {
        return Tg(t).filter((n) => !su(e, n));
      }
      class kM {
        constructor() {
          (this._rawValidators = []),
            (this._rawAsyncValidators = []),
            (this._onDestroyCallbacks = []);
        }
        get value() {
          return this.control ? this.control.value : null;
        }
        get valid() {
          return this.control ? this.control.valid : null;
        }
        get invalid() {
          return this.control ? this.control.invalid : null;
        }
        get pending() {
          return this.control ? this.control.pending : null;
        }
        get disabled() {
          return this.control ? this.control.disabled : null;
        }
        get enabled() {
          return this.control ? this.control.enabled : null;
        }
        get errors() {
          return this.control ? this.control.errors : null;
        }
        get pristine() {
          return this.control ? this.control.pristine : null;
        }
        get dirty() {
          return this.control ? this.control.dirty : null;
        }
        get touched() {
          return this.control ? this.control.touched : null;
        }
        get status() {
          return this.control ? this.control.status : null;
        }
        get untouched() {
          return this.control ? this.control.untouched : null;
        }
        get statusChanges() {
          return this.control ? this.control.statusChanges : null;
        }
        get valueChanges() {
          return this.control ? this.control.valueChanges : null;
        }
        get path() {
          return null;
        }
        _setValidators(t) {
          (this._rawValidators = t || []),
            (this._composedValidatorFn = Sg(this._rawValidators));
        }
        _setAsyncValidators(t) {
          (this._rawAsyncValidators = t || []),
            (this._composedAsyncValidatorFn = Mg(this._rawAsyncValidators));
        }
        get validator() {
          return this._composedValidatorFn || null;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn || null;
        }
        _registerOnDestroy(t) {
          this._onDestroyCallbacks.push(t);
        }
        _invokeOnDestroyCallbacks() {
          this._onDestroyCallbacks.forEach((t) => t()),
            (this._onDestroyCallbacks = []);
        }
        reset(t = void 0) {
          this.control && this.control.reset(t);
        }
        hasError(t, n) {
          return !!this.control && this.control.hasError(t, n);
        }
        getError(t, n) {
          return this.control ? this.control.getError(t, n) : null;
        }
      }
      class bt extends kM {
        get formDirective() {
          return null;
        }
        get path() {
          return null;
        }
      }
      class Pr extends kM {
        constructor() {
          super(...arguments),
            (this._parent = null),
            (this.name = null),
            (this.valueAccessor = null);
        }
      }
      class LM {
        constructor(t) {
          this._cd = t;
        }
        get isTouched() {
          return !!this._cd?.control?.touched;
        }
        get isUntouched() {
          return !!this._cd?.control?.untouched;
        }
        get isPristine() {
          return !!this._cd?.control?.pristine;
        }
        get isDirty() {
          return !!this._cd?.control?.dirty;
        }
        get isValid() {
          return !!this._cd?.control?.valid;
        }
        get isInvalid() {
          return !!this._cd?.control?.invalid;
        }
        get isPending() {
          return !!this._cd?.control?.pending;
        }
        get isSubmitted() {
          return !!this._cd?.submitted;
        }
      }
      let Ag = (() => {
          class e extends LM {
            constructor(n) {
              super(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(C(Pr, 2));
            }),
            (e.ɵdir = W({
              type: e,
              selectors: [
                ["", "formControlName", ""],
                ["", "ngModel", ""],
                ["", "formControl", ""],
              ],
              hostVars: 14,
              hostBindings: function (n, r) {
                2 & n &&
                  Hl("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending);
              },
              features: [ge],
            })),
            e
          );
        })(),
        Ig = (() => {
          class e extends LM {
            constructor(n) {
              super(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(C(bt, 10));
            }),
            (e.ɵdir = W({
              type: e,
              selectors: [
                ["", "formGroupName", ""],
                ["", "formArrayName", ""],
                ["", "ngModelGroup", ""],
                ["", "formGroup", ""],
                ["form", 3, "ngNoForm", ""],
                ["", "ngForm", ""],
              ],
              hostVars: 16,
              hostBindings: function (n, r) {
                2 & n &&
                  Hl("ng-untouched", r.isUntouched)("ng-touched", r.isTouched)(
                    "ng-pristine",
                    r.isPristine
                  )("ng-dirty", r.isDirty)("ng-valid", r.isValid)(
                    "ng-invalid",
                    r.isInvalid
                  )("ng-pending", r.isPending)("ng-submitted", r.isSubmitted);
              },
              features: [ge],
            })),
            e
          );
        })();
      const ua = "VALID",
        lu = "INVALID",
        Ao = "PENDING",
        da = "DISABLED";
      function Ng(e) {
        return (cu(e) ? e.validators : e) || null;
      }
      function Rg(e, t) {
        return (cu(t) ? t.asyncValidators : e) || null;
      }
      function cu(e) {
        return null != e && !Array.isArray(e) && "object" == typeof e;
      }
      function BM(e, t, n) {
        const r = e.controls;
        if (!(t ? Object.keys(r) : r).length) throw new v(1e3, "");
        if (!r[n]) throw new v(1001, "");
      }
      function jM(e, t, n) {
        e._forEachChild((r, i) => {
          if (void 0 === n[i]) throw new v(1002, "");
        });
      }
      class uu {
        constructor(t, n) {
          (this._pendingDirty = !1),
            (this._hasOwnPendingAsyncValidator = !1),
            (this._pendingTouched = !1),
            (this._onCollectionChange = () => {}),
            (this._parent = null),
            (this.pristine = !0),
            (this.touched = !1),
            (this._onDisabledChange = []),
            this._assignValidators(t),
            this._assignAsyncValidators(n);
        }
        get validator() {
          return this._composedValidatorFn;
        }
        set validator(t) {
          this._rawValidators = this._composedValidatorFn = t;
        }
        get asyncValidator() {
          return this._composedAsyncValidatorFn;
        }
        set asyncValidator(t) {
          this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
        }
        get parent() {
          return this._parent;
        }
        get valid() {
          return this.status === ua;
        }
        get invalid() {
          return this.status === lu;
        }
        get pending() {
          return this.status == Ao;
        }
        get disabled() {
          return this.status === da;
        }
        get enabled() {
          return this.status !== da;
        }
        get dirty() {
          return !this.pristine;
        }
        get untouched() {
          return !this.touched;
        }
        get updateOn() {
          return this._updateOn
            ? this._updateOn
            : this.parent
            ? this.parent.updateOn
            : "change";
        }
        setValidators(t) {
          this._assignValidators(t);
        }
        setAsyncValidators(t) {
          this._assignAsyncValidators(t);
        }
        addValidators(t) {
          this.setValidators(PM(t, this._rawValidators));
        }
        addAsyncValidators(t) {
          this.setAsyncValidators(PM(t, this._rawAsyncValidators));
        }
        removeValidators(t) {
          this.setValidators(FM(t, this._rawValidators));
        }
        removeAsyncValidators(t) {
          this.setAsyncValidators(FM(t, this._rawAsyncValidators));
        }
        hasValidator(t) {
          return su(this._rawValidators, t);
        }
        hasAsyncValidator(t) {
          return su(this._rawAsyncValidators, t);
        }
        clearValidators() {
          this.validator = null;
        }
        clearAsyncValidators() {
          this.asyncValidator = null;
        }
        markAsTouched(t = {}) {
          (this.touched = !0),
            this._parent && !t.onlySelf && this._parent.markAsTouched(t);
        }
        markAllAsTouched() {
          this.markAsTouched({ onlySelf: !0 }),
            this._forEachChild((t) => t.markAllAsTouched());
        }
        markAsUntouched(t = {}) {
          (this.touched = !1),
            (this._pendingTouched = !1),
            this._forEachChild((n) => {
              n.markAsUntouched({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        markAsDirty(t = {}) {
          (this.pristine = !1),
            this._parent && !t.onlySelf && this._parent.markAsDirty(t);
        }
        markAsPristine(t = {}) {
          (this.pristine = !0),
            (this._pendingDirty = !1),
            this._forEachChild((n) => {
              n.markAsPristine({ onlySelf: !0 });
            }),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        markAsPending(t = {}) {
          (this.status = Ao),
            !1 !== t.emitEvent && this.statusChanges.emit(this.status),
            this._parent && !t.onlySelf && this._parent.markAsPending(t);
        }
        disable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = da),
            (this.errors = null),
            this._forEachChild((r) => {
              r.disable({ ...t, onlySelf: !0 });
            }),
            this._updateValue(),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._updateAncestors({ ...t, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!0));
        }
        enable(t = {}) {
          const n = this._parentMarkedDirty(t.onlySelf);
          (this.status = ua),
            this._forEachChild((r) => {
              r.enable({ ...t, onlySelf: !0 });
            }),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            }),
            this._updateAncestors({ ...t, skipPristineCheck: n }),
            this._onDisabledChange.forEach((r) => r(!1));
        }
        _updateAncestors(t) {
          this._parent &&
            !t.onlySelf &&
            (this._parent.updateValueAndValidity(t),
            t.skipPristineCheck || this._parent._updatePristine(),
            this._parent._updateTouched());
        }
        setParent(t) {
          this._parent = t;
        }
        getRawValue() {
          return this.value;
        }
        updateValueAndValidity(t = {}) {
          this._setInitialStatus(),
            this._updateValue(),
            this.enabled &&
              (this._cancelExistingSubscription(),
              (this.errors = this._runValidator()),
              (this.status = this._calculateStatus()),
              (this.status === ua || this.status === Ao) &&
                this._runAsyncValidator(t.emitEvent)),
            !1 !== t.emitEvent &&
              (this.valueChanges.emit(this.value),
              this.statusChanges.emit(this.status)),
            this._parent &&
              !t.onlySelf &&
              this._parent.updateValueAndValidity(t);
        }
        _updateTreeValidity(t = { emitEvent: !0 }) {
          this._forEachChild((n) => n._updateTreeValidity(t)),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: t.emitEvent,
            });
        }
        _setInitialStatus() {
          this.status = this._allControlsDisabled() ? da : ua;
        }
        _runValidator() {
          return this.validator ? this.validator(this) : null;
        }
        _runAsyncValidator(t) {
          if (this.asyncValidator) {
            (this.status = Ao), (this._hasOwnPendingAsyncValidator = !0);
            const n = SM(this.asyncValidator(this));
            this._asyncValidationSubscription = n.subscribe((r) => {
              (this._hasOwnPendingAsyncValidator = !1),
                this.setErrors(r, { emitEvent: t });
            });
          }
        }
        _cancelExistingSubscription() {
          this._asyncValidationSubscription &&
            (this._asyncValidationSubscription.unsubscribe(),
            (this._hasOwnPendingAsyncValidator = !1));
        }
        setErrors(t, n = {}) {
          (this.errors = t), this._updateControlsErrors(!1 !== n.emitEvent);
        }
        get(t) {
          let n = t;
          return null == n ||
            (Array.isArray(n) || (n = n.split(".")), 0 === n.length)
            ? null
            : n.reduce((r, i) => r && r._find(i), this);
        }
        getError(t, n) {
          const r = n ? this.get(n) : this;
          return r && r.errors ? r.errors[t] : null;
        }
        hasError(t, n) {
          return !!this.getError(t, n);
        }
        get root() {
          let t = this;
          for (; t._parent; ) t = t._parent;
          return t;
        }
        _updateControlsErrors(t) {
          (this.status = this._calculateStatus()),
            t && this.statusChanges.emit(this.status),
            this._parent && this._parent._updateControlsErrors(t);
        }
        _initObservables() {
          (this.valueChanges = new Pe()), (this.statusChanges = new Pe());
        }
        _calculateStatus() {
          return this._allControlsDisabled()
            ? da
            : this.errors
            ? lu
            : this._hasOwnPendingAsyncValidator ||
              this._anyControlsHaveStatus(Ao)
            ? Ao
            : this._anyControlsHaveStatus(lu)
            ? lu
            : ua;
        }
        _anyControlsHaveStatus(t) {
          return this._anyControls((n) => n.status === t);
        }
        _anyControlsDirty() {
          return this._anyControls((t) => t.dirty);
        }
        _anyControlsTouched() {
          return this._anyControls((t) => t.touched);
        }
        _updatePristine(t = {}) {
          (this.pristine = !this._anyControlsDirty()),
            this._parent && !t.onlySelf && this._parent._updatePristine(t);
        }
        _updateTouched(t = {}) {
          (this.touched = this._anyControlsTouched()),
            this._parent && !t.onlySelf && this._parent._updateTouched(t);
        }
        _registerOnCollectionChange(t) {
          this._onCollectionChange = t;
        }
        _setUpdateStrategy(t) {
          cu(t) && null != t.updateOn && (this._updateOn = t.updateOn);
        }
        _parentMarkedDirty(t) {
          return (
            !t &&
            !(!this._parent || !this._parent.dirty) &&
            !this._parent._anyControlsDirty()
          );
        }
        _find(t) {
          return null;
        }
        _assignValidators(t) {
          (this._rawValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedValidatorFn = (function W3(e) {
              return Array.isArray(e) ? Sg(e) : e || null;
            })(this._rawValidators));
        }
        _assignAsyncValidators(t) {
          (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
            (this._composedAsyncValidatorFn = (function K3(e) {
              return Array.isArray(e) ? Mg(e) : e || null;
            })(this._rawAsyncValidators));
        }
      }
      class fa extends uu {
        constructor(t, n, r) {
          super(Ng(n), Rg(r, n)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        registerControl(t, n) {
          return this.controls[t]
            ? this.controls[t]
            : ((this.controls[t] = n),
              n.setParent(this),
              n._registerOnCollectionChange(this._onCollectionChange),
              n);
        }
        addControl(t, n, r = {}) {
          this.registerControl(t, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        removeControl(t, n = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        setControl(t, n, r = {}) {
          this.controls[t] &&
            this.controls[t]._registerOnCollectionChange(() => {}),
            delete this.controls[t],
            n && this.registerControl(t, n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        contains(t) {
          return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
        }
        setValue(t, n = {}) {
          jM(this, 0, t),
            Object.keys(t).forEach((r) => {
              BM(this, !0, r),
                this.controls[r].setValue(t[r], {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          null != t &&
            (Object.keys(t).forEach((r) => {
              const i = this.controls[r];
              i && i.patchValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
            }),
            this.updateValueAndValidity(n));
        }
        reset(t = {}, n = {}) {
          this._forEachChild((r, i) => {
            r.reset(t[i], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this._reduceChildren(
            {},
            (t, n, r) => ((t[r] = n.getRawValue()), t)
          );
        }
        _syncPendingControls() {
          let t = this._reduceChildren(
            !1,
            (n, r) => !!r._syncPendingControls() || n
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          Object.keys(this.controls).forEach((n) => {
            const r = this.controls[n];
            r && t(r, n);
          });
        }
        _setUpControls() {
          this._forEachChild((t) => {
            t.setParent(this),
              t._registerOnCollectionChange(this._onCollectionChange);
          });
        }
        _updateValue() {
          this.value = this._reduceValue();
        }
        _anyControls(t) {
          for (const [n, r] of Object.entries(this.controls))
            if (this.contains(n) && t(r)) return !0;
          return !1;
        }
        _reduceValue() {
          return this._reduceChildren(
            {},
            (n, r, i) => ((r.enabled || this.disabled) && (n[i] = r.value), n)
          );
        }
        _reduceChildren(t, n) {
          let r = t;
          return (
            this._forEachChild((i, o) => {
              r = n(r, i, o);
            }),
            r
          );
        }
        _allControlsDisabled() {
          for (const t of Object.keys(this.controls))
            if (this.controls[t].enabled) return !1;
          return Object.keys(this.controls).length > 0 || this.disabled;
        }
        _find(t) {
          return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
        }
      }
      class HM extends fa {}
      const pi = new S("CallSetDisabledState", {
          providedIn: "root",
          factory: () => ha,
        }),
        ha = "always";
      function du(e, t) {
        return [...t.path, e];
      }
      function pa(e, t, n = ha) {
        Pg(e, t),
          t.valueAccessor.writeValue(e.value),
          (e.disabled || "always" === n) &&
            t.valueAccessor.setDisabledState?.(e.disabled),
          (function Z3(e, t) {
            t.valueAccessor.registerOnChange((n) => {
              (e._pendingValue = n),
                (e._pendingChange = !0),
                (e._pendingDirty = !0),
                "change" === e.updateOn && UM(e, t);
            });
          })(e, t),
          (function X3(e, t) {
            const n = (r, i) => {
              t.valueAccessor.writeValue(r), i && t.viewToModelUpdate(r);
            };
            e.registerOnChange(n),
              t._registerOnDestroy(() => {
                e._unregisterOnChange(n);
              });
          })(e, t),
          (function Y3(e, t) {
            t.valueAccessor.registerOnTouched(() => {
              (e._pendingTouched = !0),
                "blur" === e.updateOn && e._pendingChange && UM(e, t),
                "submit" !== e.updateOn && e.markAsTouched();
            });
          })(e, t),
          (function Q3(e, t) {
            if (t.valueAccessor.setDisabledState) {
              const n = (r) => {
                t.valueAccessor.setDisabledState(r);
              };
              e.registerOnDisabledChange(n),
                t._registerOnDestroy(() => {
                  e._unregisterOnDisabledChange(n);
                });
            }
          })(e, t);
      }
      function fu(e, t, n = !0) {
        const r = () => {};
        t.valueAccessor &&
          (t.valueAccessor.registerOnChange(r),
          t.valueAccessor.registerOnTouched(r)),
          pu(e, t),
          e &&
            (t._invokeOnDestroyCallbacks(),
            e._registerOnCollectionChange(() => {}));
      }
      function hu(e, t) {
        e.forEach((n) => {
          n.registerOnValidatorChange && n.registerOnValidatorChange(t);
        });
      }
      function Pg(e, t) {
        const n = NM(e);
        null !== t.validator
          ? e.setValidators(OM(n, t.validator))
          : "function" == typeof n && e.setValidators([n]);
        const r = RM(e);
        null !== t.asyncValidator
          ? e.setAsyncValidators(OM(r, t.asyncValidator))
          : "function" == typeof r && e.setAsyncValidators([r]);
        const i = () => e.updateValueAndValidity();
        hu(t._rawValidators, i), hu(t._rawAsyncValidators, i);
      }
      function pu(e, t) {
        let n = !1;
        if (null !== e) {
          if (null !== t.validator) {
            const i = NM(e);
            if (Array.isArray(i) && i.length > 0) {
              const o = i.filter((s) => s !== t.validator);
              o.length !== i.length && ((n = !0), e.setValidators(o));
            }
          }
          if (null !== t.asyncValidator) {
            const i = RM(e);
            if (Array.isArray(i) && i.length > 0) {
              const o = i.filter((s) => s !== t.asyncValidator);
              o.length !== i.length && ((n = !0), e.setAsyncValidators(o));
            }
          }
        }
        const r = () => {};
        return hu(t._rawValidators, r), hu(t._rawAsyncValidators, r), n;
      }
      function UM(e, t) {
        e._pendingDirty && e.markAsDirty(),
          e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
          t.viewToModelUpdate(e._pendingValue),
          (e._pendingChange = !1);
      }
      function kg(e, t) {
        if (!e.hasOwnProperty("model")) return !1;
        const n = e.model;
        return !!n.isFirstChange() || !Object.is(t, n.currentValue);
      }
      function Lg(e, t) {
        if (!t) return null;
        let n, r, i;
        return (
          Array.isArray(t),
          t.forEach((o) => {
            o.constructor === ca
              ? (n = o)
              : (function t4(e) {
                  return Object.getPrototypeOf(e.constructor) === hi;
                })(o)
              ? (r = o)
              : (i = o);
          }),
          i || r || n || null
        );
      }
      function qM(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      function GM(e) {
        return (
          "object" == typeof e &&
          null !== e &&
          2 === Object.keys(e).length &&
          "value" in e &&
          "disabled" in e
        );
      }
      const gi = class extends uu {
          constructor(t = null, n, r) {
            super(Ng(n), Rg(r, n)),
              (this.defaultValue = null),
              (this._onChange = []),
              (this._pendingChange = !1),
              this._applyFormState(t),
              this._setUpdateStrategy(n),
              this._initObservables(),
              this.updateValueAndValidity({
                onlySelf: !0,
                emitEvent: !!this.asyncValidator,
              }),
              cu(n) &&
                (n.nonNullable || n.initialValueIsDefault) &&
                (this.defaultValue = GM(t) ? t.value : t);
          }
          setValue(t, n = {}) {
            (this.value = this._pendingValue = t),
              this._onChange.length &&
                !1 !== n.emitModelToViewChange &&
                this._onChange.forEach((r) =>
                  r(this.value, !1 !== n.emitViewToModelChange)
                ),
              this.updateValueAndValidity(n);
          }
          patchValue(t, n = {}) {
            this.setValue(t, n);
          }
          reset(t = this.defaultValue, n = {}) {
            this._applyFormState(t),
              this.markAsPristine(n),
              this.markAsUntouched(n),
              this.setValue(this.value, n),
              (this._pendingChange = !1);
          }
          _updateValue() {}
          _anyControls(t) {
            return !1;
          }
          _allControlsDisabled() {
            return this.disabled;
          }
          registerOnChange(t) {
            this._onChange.push(t);
          }
          _unregisterOnChange(t) {
            qM(this._onChange, t);
          }
          registerOnDisabledChange(t) {
            this._onDisabledChange.push(t);
          }
          _unregisterOnDisabledChange(t) {
            qM(this._onDisabledChange, t);
          }
          _forEachChild(t) {}
          _syncPendingControls() {
            return !(
              "submit" !== this.updateOn ||
              (this._pendingDirty && this.markAsDirty(),
              this._pendingTouched && this.markAsTouched(),
              !this._pendingChange) ||
              (this.setValue(this._pendingValue, {
                onlySelf: !0,
                emitModelToViewChange: !1,
              }),
              0)
            );
          }
          _applyFormState(t) {
            GM(t)
              ? ((this.value = this._pendingValue = t.value),
                t.disabled
                  ? this.disable({ onlySelf: !0, emitEvent: !1 })
                  : this.enable({ onlySelf: !0, emitEvent: !1 }))
              : (this.value = this._pendingValue = t);
          }
        },
        s4 = { provide: Pr, useExisting: we(() => Bg) },
        QM = (() => Promise.resolve())();
      let Bg = (() => {
          class e extends Pr {
            constructor(n, r, i, o, s, a) {
              super(),
                (this._changeDetectorRef = s),
                (this.callSetDisabledState = a),
                (this.control = new gi()),
                (this._registered = !1),
                (this.name = ""),
                (this.update = new Pe()),
                (this._parent = n),
                this._setValidators(r),
                this._setAsyncValidators(i),
                (this.valueAccessor = Lg(0, o));
            }
            ngOnChanges(n) {
              if ((this._checkForErrors(), !this._registered || "name" in n)) {
                if (
                  this._registered &&
                  (this._checkName(), this.formDirective)
                ) {
                  const r = n.name.previousValue;
                  this.formDirective.removeControl({
                    name: r,
                    path: this._getPath(r),
                  });
                }
                this._setUpControl();
              }
              "isDisabled" in n && this._updateDisabled(n),
                kg(n, this.viewModel) &&
                  (this._updateValue(this.model),
                  (this.viewModel = this.model));
            }
            ngOnDestroy() {
              this.formDirective && this.formDirective.removeControl(this);
            }
            get path() {
              return this._getPath(this.name);
            }
            get formDirective() {
              return this._parent ? this._parent.formDirective : null;
            }
            viewToModelUpdate(n) {
              (this.viewModel = n), this.update.emit(n);
            }
            _setUpControl() {
              this._setUpdateStrategy(),
                this._isStandalone()
                  ? this._setUpStandalone()
                  : this.formDirective.addControl(this),
                (this._registered = !0);
            }
            _setUpdateStrategy() {
              this.options &&
                null != this.options.updateOn &&
                (this.control._updateOn = this.options.updateOn);
            }
            _isStandalone() {
              return (
                !this._parent || !(!this.options || !this.options.standalone)
              );
            }
            _setUpStandalone() {
              pa(this.control, this, this.callSetDisabledState),
                this.control.updateValueAndValidity({ emitEvent: !1 });
            }
            _checkForErrors() {
              this._isStandalone() || this._checkParentType(),
                this._checkName();
            }
            _checkParentType() {}
            _checkName() {
              this.options &&
                this.options.name &&
                (this.name = this.options.name),
                this._isStandalone();
            }
            _updateValue(n) {
              QM.then(() => {
                this.control.setValue(n, { emitViewToModelChange: !1 }),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _updateDisabled(n) {
              const r = n.isDisabled.currentValue,
                i = 0 !== r && fo(r);
              QM.then(() => {
                i && !this.control.disabled
                  ? this.control.disable()
                  : !i && this.control.disabled && this.control.enable(),
                  this._changeDetectorRef?.markForCheck();
              });
            }
            _getPath(n) {
              return this._parent ? du(n, this._parent) : [n];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(
                C(bt, 9),
                C(ht, 10),
                C(Rr, 10),
                C(zn, 10),
                C(tc, 8),
                C(pi, 8)
              );
            }),
            (e.ɵdir = W({
              type: e,
              selectors: [
                [
                  "",
                  "ngModel",
                  "",
                  3,
                  "formControlName",
                  "",
                  3,
                  "formControl",
                  "",
                ],
              ],
              inputs: {
                name: "name",
                isDisabled: ["disabled", "isDisabled"],
                model: ["ngModel", "model"],
                options: ["ngModelOptions", "options"],
              },
              outputs: { update: "ngModelChange" },
              exportAs: ["ngModel"],
              features: [Te([s4]), ge, Jt],
            })),
            e
          );
        })(),
        jg = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵdir = W({
              type: e,
              selectors: [
                ["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""],
              ],
              hostAttrs: ["novalidate", ""],
            })),
            e
          );
        })(),
        YM = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({})),
            e
          );
        })();
      const Hg = new S("NgModelWithFormControlWarning"),
        f4 = { provide: bt, useExisting: we(() => ma) };
      let ma = (() => {
        class e extends bt {
          constructor(n, r, i) {
            super(),
              (this.callSetDisabledState = i),
              (this.submitted = !1),
              (this._onCollectionChange = () => this._updateDomValue()),
              (this.directives = []),
              (this.form = null),
              (this.ngSubmit = new Pe()),
              this._setValidators(n),
              this._setAsyncValidators(r);
          }
          ngOnChanges(n) {
            this._checkFormPresent(),
              n.hasOwnProperty("form") &&
                (this._updateValidators(),
                this._updateDomValue(),
                this._updateRegistrations(),
                (this._oldForm = this.form));
          }
          ngOnDestroy() {
            this.form &&
              (pu(this.form, this),
              this.form._onCollectionChange === this._onCollectionChange &&
                this.form._registerOnCollectionChange(() => {}));
          }
          get formDirective() {
            return this;
          }
          get control() {
            return this.form;
          }
          get path() {
            return [];
          }
          addControl(n) {
            const r = this.form.get(n.path);
            return (
              pa(r, n, this.callSetDisabledState),
              r.updateValueAndValidity({ emitEvent: !1 }),
              this.directives.push(n),
              r
            );
          }
          getControl(n) {
            return this.form.get(n.path);
          }
          removeControl(n) {
            fu(n.control || null, n, !1),
              (function n4(e, t) {
                const n = e.indexOf(t);
                n > -1 && e.splice(n, 1);
              })(this.directives, n);
          }
          addFormGroup(n) {
            this._setUpFormContainer(n);
          }
          removeFormGroup(n) {
            this._cleanUpFormContainer(n);
          }
          getFormGroup(n) {
            return this.form.get(n.path);
          }
          addFormArray(n) {
            this._setUpFormContainer(n);
          }
          removeFormArray(n) {
            this._cleanUpFormContainer(n);
          }
          getFormArray(n) {
            return this.form.get(n.path);
          }
          updateModel(n, r) {
            this.form.get(n.path).setValue(r);
          }
          onSubmit(n) {
            return (
              (this.submitted = !0),
              (function zM(e, t) {
                e._syncPendingControls(),
                  t.forEach((n) => {
                    const r = n.control;
                    "submit" === r.updateOn &&
                      r._pendingChange &&
                      (n.viewToModelUpdate(r._pendingValue),
                      (r._pendingChange = !1));
                  });
              })(this.form, this.directives),
              this.ngSubmit.emit(n),
              "dialog" === n?.target?.method
            );
          }
          onReset() {
            this.resetForm();
          }
          resetForm(n = void 0) {
            this.form.reset(n), (this.submitted = !1);
          }
          _updateDomValue() {
            this.directives.forEach((n) => {
              const r = n.control,
                i = this.form.get(n.path);
              r !== i &&
                (fu(r || null, n),
                ((e) => e instanceof gi)(i) &&
                  (pa(i, n, this.callSetDisabledState), (n.control = i)));
            }),
              this.form._updateTreeValidity({ emitEvent: !1 });
          }
          _setUpFormContainer(n) {
            const r = this.form.get(n.path);
            (function $M(e, t) {
              Pg(e, t);
            })(r, n),
              r.updateValueAndValidity({ emitEvent: !1 });
          }
          _cleanUpFormContainer(n) {
            if (this.form) {
              const r = this.form.get(n.path);
              r &&
                (function J3(e, t) {
                  return pu(e, t);
                })(r, n) &&
                r.updateValueAndValidity({ emitEvent: !1 });
            }
          }
          _updateRegistrations() {
            this.form._registerOnCollectionChange(this._onCollectionChange),
              this._oldForm &&
                this._oldForm._registerOnCollectionChange(() => {});
          }
          _updateValidators() {
            Pg(this.form, this), this._oldForm && pu(this._oldForm, this);
          }
          _checkFormPresent() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(C(ht, 10), C(Rr, 10), C(pi, 8));
          }),
          (e.ɵdir = W({
            type: e,
            selectors: [["", "formGroup", ""]],
            hostBindings: function (n, r) {
              1 & n &&
                ue("submit", function (o) {
                  return r.onSubmit(o);
                })("reset", function () {
                  return r.onReset();
                });
            },
            inputs: { form: ["formGroup", "form"] },
            outputs: { ngSubmit: "ngSubmit" },
            exportAs: ["ngForm"],
            features: [Te([f4]), ge, Jt],
          })),
          e
        );
      })();
      const g4 = { provide: Pr, useExisting: we(() => gu) };
      let gu = (() => {
        class e extends Pr {
          set isDisabled(n) {}
          constructor(n, r, i, o, s) {
            super(),
              (this._ngModelWarningConfig = s),
              (this._added = !1),
              (this.name = null),
              (this.update = new Pe()),
              (this._ngModelWarningSent = !1),
              (this._parent = n),
              this._setValidators(r),
              this._setAsyncValidators(i),
              (this.valueAccessor = Lg(0, o));
          }
          ngOnChanges(n) {
            this._added || this._setUpControl(),
              kg(n, this.viewModel) &&
                ((this.viewModel = this.model),
                this.formDirective.updateModel(this, this.model));
          }
          ngOnDestroy() {
            this.formDirective && this.formDirective.removeControl(this);
          }
          viewToModelUpdate(n) {
            (this.viewModel = n), this.update.emit(n);
          }
          get path() {
            return du(
              null == this.name ? this.name : this.name.toString(),
              this._parent
            );
          }
          get formDirective() {
            return this._parent ? this._parent.formDirective : null;
          }
          _checkParentType() {}
          _setUpControl() {
            this._checkParentType(),
              (this.control = this.formDirective.addControl(this)),
              (this._added = !0);
          }
        }
        return (
          (e._ngModelWarningSentOnce = !1),
          (e.ɵfac = function (n) {
            return new (n || e)(
              C(bt, 13),
              C(ht, 10),
              C(Rr, 10),
              C(zn, 10),
              C(Hg, 8)
            );
          }),
          (e.ɵdir = W({
            type: e,
            selectors: [["", "formControlName", ""]],
            inputs: {
              name: ["formControlName", "name"],
              isDisabled: ["disabled", "isDisabled"],
              model: ["ngModel", "model"],
            },
            outputs: { update: "ngModelChange" },
            features: [Te([g4]), ge, Jt],
          })),
          e
        );
      })();
      const m4 = { provide: zn, useExisting: we(() => mu), multi: !0 };
      function nT(e, t) {
        return null == e
          ? `${t}`
          : (t && "object" == typeof t && (t = "Object"),
            `${e}: ${t}`.slice(0, 50));
      }
      let mu = (() => {
          class e extends hi {
            constructor() {
              super(...arguments),
                (this._optionMap = new Map()),
                (this._idCounter = 0),
                (this._compareWith = Object.is);
            }
            set compareWith(n) {
              this._compareWith = n;
            }
            writeValue(n) {
              this.value = n;
              const i = nT(this._getOptionId(n), n);
              this.setProperty("value", i);
            }
            registerOnChange(n) {
              this.onChange = (r) => {
                (this.value = this._getOptionValue(r)), n(this.value);
              };
            }
            _registerOption() {
              return (this._idCounter++).toString();
            }
            _getOptionId(n) {
              for (const r of this._optionMap.keys())
                if (this._compareWith(this._optionMap.get(r), n)) return r;
              return null;
            }
            _getOptionValue(n) {
              const r = (function y4(e) {
                return e.split(":")[0];
              })(n);
              return this._optionMap.has(r) ? this._optionMap.get(r) : n;
            }
          }
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = rt(e)))(r || e);
              };
            })()),
            (e.ɵdir = W({
              type: e,
              selectors: [
                ["select", "formControlName", "", 3, "multiple", ""],
                ["select", "formControl", "", 3, "multiple", ""],
                ["select", "ngModel", "", 3, "multiple", ""],
              ],
              hostBindings: function (n, r) {
                1 & n &&
                  ue("change", function (o) {
                    return r.onChange(o.target.value);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              inputs: { compareWith: "compareWith" },
              features: [Te([m4]), ge],
            })),
            e
          );
        })(),
        rT = (() => {
          class e {
            constructor(n, r, i) {
              (this._element = n),
                (this._renderer = r),
                (this._select = i),
                this._select && (this.id = this._select._registerOption());
            }
            set ngValue(n) {
              null != this._select &&
                (this._select._optionMap.set(this.id, n),
                this._setElementValue(nT(this.id, n)),
                this._select.writeValue(this._select.value));
            }
            set value(n) {
              this._setElementValue(n),
                this._select && this._select.writeValue(this._select.value);
            }
            _setElementValue(n) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "value",
                n
              );
            }
            ngOnDestroy() {
              this._select &&
                (this._select._optionMap.delete(this.id),
                this._select.writeValue(this._select.value));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(C(Ut), C(tr), C(mu, 9));
            }),
            (e.ɵdir = W({
              type: e,
              selectors: [["option"]],
              inputs: { ngValue: "ngValue", value: "value" },
            })),
            e
          );
        })();
      const v4 = { provide: zn, useExisting: we(() => zg), multi: !0 };
      function iT(e, t) {
        return null == e
          ? `${t}`
          : ("string" == typeof t && (t = `'${t}'`),
            t && "object" == typeof t && (t = "Object"),
            `${e}: ${t}`.slice(0, 50));
      }
      let zg = (() => {
          class e extends hi {
            constructor() {
              super(...arguments),
                (this._optionMap = new Map()),
                (this._idCounter = 0),
                (this._compareWith = Object.is);
            }
            set compareWith(n) {
              this._compareWith = n;
            }
            writeValue(n) {
              let r;
              if (((this.value = n), Array.isArray(n))) {
                const i = n.map((o) => this._getOptionId(o));
                r = (o, s) => {
                  o._setSelected(i.indexOf(s.toString()) > -1);
                };
              } else
                r = (i, o) => {
                  i._setSelected(!1);
                };
              this._optionMap.forEach(r);
            }
            registerOnChange(n) {
              this.onChange = (r) => {
                const i = [],
                  o = r.selectedOptions;
                if (void 0 !== o) {
                  const s = o;
                  for (let a = 0; a < s.length; a++) {
                    const c = this._getOptionValue(s[a].value);
                    i.push(c);
                  }
                } else {
                  const s = r.options;
                  for (let a = 0; a < s.length; a++) {
                    const l = s[a];
                    if (l.selected) {
                      const c = this._getOptionValue(l.value);
                      i.push(c);
                    }
                  }
                }
                (this.value = i), n(i);
              };
            }
            _registerOption(n) {
              const r = (this._idCounter++).toString();
              return this._optionMap.set(r, n), r;
            }
            _getOptionId(n) {
              for (const r of this._optionMap.keys())
                if (this._compareWith(this._optionMap.get(r)._value, n))
                  return r;
              return null;
            }
            _getOptionValue(n) {
              const r = (function _4(e) {
                return e.split(":")[0];
              })(n);
              return this._optionMap.has(r) ? this._optionMap.get(r)._value : n;
            }
          }
          return (
            (e.ɵfac = (function () {
              let t;
              return function (r) {
                return (t || (t = rt(e)))(r || e);
              };
            })()),
            (e.ɵdir = W({
              type: e,
              selectors: [
                ["select", "multiple", "", "formControlName", ""],
                ["select", "multiple", "", "formControl", ""],
                ["select", "multiple", "", "ngModel", ""],
              ],
              hostBindings: function (n, r) {
                1 & n &&
                  ue("change", function (o) {
                    return r.onChange(o.target);
                  })("blur", function () {
                    return r.onTouched();
                  });
              },
              inputs: { compareWith: "compareWith" },
              features: [Te([v4]), ge],
            })),
            e
          );
        })(),
        oT = (() => {
          class e {
            constructor(n, r, i) {
              (this._element = n),
                (this._renderer = r),
                (this._select = i),
                this._select && (this.id = this._select._registerOption(this));
            }
            set ngValue(n) {
              null != this._select &&
                ((this._value = n),
                this._setElementValue(iT(this.id, n)),
                this._select.writeValue(this._select.value));
            }
            set value(n) {
              this._select
                ? ((this._value = n),
                  this._setElementValue(iT(this.id, n)),
                  this._select.writeValue(this._select.value))
                : this._setElementValue(n);
            }
            _setElementValue(n) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "value",
                n
              );
            }
            _setSelected(n) {
              this._renderer.setProperty(
                this._element.nativeElement,
                "selected",
                n
              );
            }
            ngOnDestroy() {
              this._select &&
                (this._select._optionMap.delete(this.id),
                this._select.writeValue(this._select.value));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(C(Ut), C(tr), C(zg, 9));
            }),
            (e.ɵdir = W({
              type: e,
              selectors: [["option"]],
              inputs: { ngValue: "ngValue", value: "value" },
            })),
            e
          );
        })(),
        gT = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({ imports: [YM] })),
            e
          );
        })();
      class mT extends uu {
        constructor(t, n, r) {
          super(Ng(n), Rg(r, n)),
            (this.controls = t),
            this._initObservables(),
            this._setUpdateStrategy(n),
            this._setUpControls(),
            this.updateValueAndValidity({
              onlySelf: !0,
              emitEvent: !!this.asyncValidator,
            });
        }
        at(t) {
          return this.controls[this._adjustIndex(t)];
        }
        push(t, n = {}) {
          this.controls.push(t),
            this._registerControl(t),
            this.updateValueAndValidity({ emitEvent: n.emitEvent }),
            this._onCollectionChange();
        }
        insert(t, n, r = {}) {
          this.controls.splice(t, 0, n),
            this._registerControl(n),
            this.updateValueAndValidity({ emitEvent: r.emitEvent });
        }
        removeAt(t, n = {}) {
          let r = this._adjustIndex(t);
          r < 0 && (r = 0),
            this.controls[r] &&
              this.controls[r]._registerOnCollectionChange(() => {}),
            this.controls.splice(r, 1),
            this.updateValueAndValidity({ emitEvent: n.emitEvent });
        }
        setControl(t, n, r = {}) {
          let i = this._adjustIndex(t);
          i < 0 && (i = 0),
            this.controls[i] &&
              this.controls[i]._registerOnCollectionChange(() => {}),
            this.controls.splice(i, 1),
            n && (this.controls.splice(i, 0, n), this._registerControl(n)),
            this.updateValueAndValidity({ emitEvent: r.emitEvent }),
            this._onCollectionChange();
        }
        get length() {
          return this.controls.length;
        }
        setValue(t, n = {}) {
          jM(this, 0, t),
            t.forEach((r, i) => {
              BM(this, !1, i),
                this.at(i).setValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n);
        }
        patchValue(t, n = {}) {
          null != t &&
            (t.forEach((r, i) => {
              this.at(i) &&
                this.at(i).patchValue(r, {
                  onlySelf: !0,
                  emitEvent: n.emitEvent,
                });
            }),
            this.updateValueAndValidity(n));
        }
        reset(t = [], n = {}) {
          this._forEachChild((r, i) => {
            r.reset(t[i], { onlySelf: !0, emitEvent: n.emitEvent });
          }),
            this._updatePristine(n),
            this._updateTouched(n),
            this.updateValueAndValidity(n);
        }
        getRawValue() {
          return this.controls.map((t) => t.getRawValue());
        }
        clear(t = {}) {
          this.controls.length < 1 ||
            (this._forEachChild((n) => n._registerOnCollectionChange(() => {})),
            this.controls.splice(0),
            this.updateValueAndValidity({ emitEvent: t.emitEvent }));
        }
        _adjustIndex(t) {
          return t < 0 ? t + this.length : t;
        }
        _syncPendingControls() {
          let t = this.controls.reduce(
            (n, r) => !!r._syncPendingControls() || n,
            !1
          );
          return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
        }
        _forEachChild(t) {
          this.controls.forEach((n, r) => {
            t(n, r);
          });
        }
        _updateValue() {
          this.value = this.controls
            .filter((t) => t.enabled || this.disabled)
            .map((t) => t.value);
        }
        _anyControls(t) {
          return this.controls.some((n) => n.enabled && t(n));
        }
        _setUpControls() {
          this._forEachChild((t) => this._registerControl(t));
        }
        _allControlsDisabled() {
          for (const t of this.controls) if (t.enabled) return !1;
          return this.controls.length > 0 || this.disabled;
        }
        _registerControl(t) {
          t.setParent(this),
            t._registerOnCollectionChange(this._onCollectionChange);
        }
        _find(t) {
          return this.at(t) ?? null;
        }
      }
      function yT(e) {
        return (
          !!e &&
          (void 0 !== e.asyncValidators ||
            void 0 !== e.validators ||
            void 0 !== e.updateOn)
        );
      }
      let vT = (() => {
          class e {
            constructor() {
              this.useNonNullable = !1;
            }
            get nonNullable() {
              const n = new e();
              return (n.useNonNullable = !0), n;
            }
            group(n, r = null) {
              const i = this._reduceControls(n);
              let o = {};
              return (
                yT(r)
                  ? (o = r)
                  : null !== r &&
                    ((o.validators = r.validator),
                    (o.asyncValidators = r.asyncValidator)),
                new fa(i, o)
              );
            }
            record(n, r = null) {
              const i = this._reduceControls(n);
              return new HM(i, r);
            }
            control(n, r, i) {
              let o = {};
              return this.useNonNullable
                ? (yT(r)
                    ? (o = r)
                    : ((o.validators = r), (o.asyncValidators = i)),
                  new gi(n, { ...o, nonNullable: !0 }))
                : new gi(n, r, i);
            }
            array(n, r, i) {
              const o = n.map((s) => this._createControl(s));
              return new mT(o, r, i);
            }
            _reduceControls(n) {
              const r = {};
              return (
                Object.keys(n).forEach((i) => {
                  r[i] = this._createControl(n[i]);
                }),
                r
              );
            }
            _createControl(n) {
              return n instanceof gi || n instanceof uu
                ? n
                : Array.isArray(n)
                ? this.control(
                    n[0],
                    n.length > 1 ? n[1] : null,
                    n.length > 2 ? n[2] : null
                  )
                : this.control(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        A4 = (() => {
          class e {
            static withConfig(n) {
              return {
                ngModule: e,
                providers: [
                  { provide: pi, useValue: n.callSetDisabledState ?? ha },
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({ imports: [gT] })),
            e
          );
        })(),
        I4 = (() => {
          class e {
            static withConfig(n) {
              return {
                ngModule: e,
                providers: [
                  {
                    provide: Hg,
                    useValue: n.warnOnNgModelWithFormControl ?? "always",
                  },
                  { provide: pi, useValue: n.callSetDisabledState ?? ha },
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({ imports: [gT] })),
            e
          );
        })(),
        _T = (() => {
          class e {
            constructor(n) {
              (this.tostr = n), (this.notifications = []);
            }
            ngOnInit() {}
            handleNewOrderNotification(n) {
              "granted" === Notification.permission
                ? new Notification(n, {
                    icon: "../../../../assets/images/20230617_002438.png",
                    badge: "../../../../assets/images/20230617_002438.png",
                    image: "../../../../assets/images/order_notify_imge.jpeg",
                    vibrate: [200, 100, 200],
                  })
                : "denied" !== Notification.permission &&
                  Notification.requestPermission().then((r) => {
                    "granted" === r && new Notification("New Order");
                  });
            }
            addNotification() {
              this.tostr.info("Foods is updated \u{1f354}");
            }
            normalNotification(n) {
              this.tostr.warning(n, "Alert", {
                timeOut: 1500,
                progressBar: !0,
                positionClass: "toast-top-center",
                tapToDismiss: !1,
              });
            }
            normalErrorNotify(n) {
              this.tostr.error(n, "Alert", {
                timeOut: 1500,
                progressBar: !0,
                positionClass: "toast-top-center",
                tapToDismiss: !1,
              });
            }
            NewOrderNotify(n) {
              this.tostr.warning(n, "New Order", {
                timeOut: 1500,
                progressBar: !0,
                positionClass: "toast-top-left",
                tapToDismiss: !1,
              });
            }
            audio() {
              const n = new Audio();
              (n.src =
                "/../../../../assets/audios/mixkit-alert-quick-chime-766.wav"),
                n.load(),
                n.play();
            }
            clearNotifications() {
              setTimeout(() => {
                this.tostr.clear();
              }, 2e3);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(C(na));
            }),
            (e.ɵcmp = Xt({
              type: e,
              selectors: [["app-dining-notify"]],
              decls: 0,
              vars: 0,
              template: function (n, r) {},
              styles: [
                ".notification-container[_ngcontent-%COMP%]{position:fixed;top:20px;right:20px}.notification-item[_ngcontent-%COMP%]{background-color:#f5f5f5;padding:10px;margin-bottom:5px;border:1px solid #ccc;border-radius:4px}",
              ],
            })),
            (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })();
      const x4 = ["myModal"],
        O4 = ["myModal_1"];
      function N4(e, t) {
        if (1 & e) {
          const n = nn();
          b(0, "button", 32),
            ue("click", function () {
              const o = Vt(n).$implicit;
              return Bt(ne().filterFood(o._id));
            }),
            x(1),
            w();
        }
        if (2 & e) {
          const n = t.$implicit;
          A(1), He(" ", n.name, " ");
        }
      }
      function R4(e, t) {
        if (1 & e) {
          const n = nn();
          b(0, "section", 38)(1, "div", 39),
            se(2, "img", 40),
            w(),
            b(3, "div", 41)(4, "h2"),
            x(5),
            w(),
            b(6, "p"),
            x(7),
            w(),
            b(8, "div", 42),
            x(9),
            w()(),
            b(10, "div", 29)(11, "div", 31)(12, "button"),
            x(13, "Types"),
            w()(),
            b(14, "div", 33)(15, "button", 43),
            ue("click", function () {
              const o = Vt(n).$implicit;
              return Bt(ne(2).loadEacheFood(o._id));
            }),
            x(16, " Add "),
            w()()()();
        }
        if (2 & e) {
          const n = t.$implicit;
          A(2),
            F("src", "http://localhost:5000/foods-images/" + n.image, Wr),
            A(3),
            qt(n.name),
            A(2),
            qt(n.stock),
            A(2),
            He("\u20b9 ", n.price, "");
        }
      }
      function P4(e, t) {
        if (
          (1 & e && (b(0, "div", 36), H(1, R4, 17, 4, "section", 37), w()),
          2 & e)
        ) {
          const n = ne();
          A(1), F("ngForOf", n.foodData);
        }
      }
      function F4(e, t) {
        1 & e && (b(0, "div", 0), se(1, "img", 44), w());
      }
      function k4(e, t) {
        if ((1 & e && (b(0, "option", 52), x(1), w()), 2 & e)) {
          const n = t.$implicit;
          F("value", n._id), A(1), oo(" ", n.table_Name, "-", n.table_No, " ");
        }
      }
      function L4(e, t) {
        if (1 & e) {
          const n = nn();
          b(0, "select", 50),
            ue("ngModelChange", function (i) {
              return Vt(n), Bt((ne(2).table_id = i));
            }),
            H(1, k4, 2, 3, "option", 51),
            w();
        }
        if (2 & e) {
          const n = ne(2);
          F("ngModel", n.table_id), A(1), F("ngForOf", n.tables);
        }
      }
      function V4(e, t) {
        1 & e && (b(0, "div", 53), se(1, "img", 54), w());
      }
      function B4(e, t) {
        if (1 & e) {
          const n = nn();
          b(0, "div", 21)(1, "div", 57),
            se(2, "img", 58),
            w(),
            b(3, "div", 23),
            x(4),
            w(),
            b(5, "div", 24),
            x(6, "full"),
            w(),
            b(7, "div", 25),
            x(8),
            w(),
            b(9, "button", 59),
            ue("click", function () {
              const o = Vt(n).$implicit;
              return Bt(ne(3).removeFromCart(o.foodId));
            }),
            x(10, " D "),
            w()();
        }
        if (2 & e) {
          const n = t.$implicit;
          F("@showFood", ne(3).foodFade),
            A(2),
            F("src", "http://localhost:5000/foods-images/" + n.foodImage, Wr),
            A(2),
            qt(n.foodName),
            A(4),
            He("\u20b9", n.foodPrice, "");
        }
      }
      function j4(e, t) {
        if (
          (1 & e && (b(0, "div", 55), H(1, B4, 11, 4, "div", 56), w()), 2 & e)
        ) {
          const n = ne(2);
          A(1), F("ngForOf", n.cartItems);
        }
      }
      function H4(e, t) {
        if (
          (1 & e &&
            (b(0, "section", 45)(1, "div", 46)(2, "h3"),
            x(3, "Current Order"),
            w(),
            H(4, L4, 2, 2, "select", 47),
            w(),
            H(5, V4, 2, 0, "div", 48),
            H(6, j4, 2, 1, "div", 49),
            w()),
          2 & e)
        ) {
          const n = ne();
          A(4),
            F("ngIf", n.emptyTables),
            A(1),
            F("ngIf", !n.cartIsEmpty),
            A(1),
            F("ngIf", n.cartIsEmpty);
        }
      }
      function U4(e, t) {
        1 & e &&
          (b(0, "div", 60)(1, "button", 61), x(2, " Proseed Order "), w()());
      }
      function $4(e, t) {
        if ((1 & e && (b(0, "div", 57), se(1, "img", 58), w()), 2 & e)) {
          const n = ne();
          A(1),
            F("src", "http://localhost:5000/foods-images/" + n.food_image, Wr);
        }
      }
      let z4 = (() => {
        class e {
          constructor(n, r, i, o, s, a, l, c) {
            (this.router = n),
              (this.diningService = r),
              (this._diningSocketService = i),
              (this.tostr = o),
              (this.diningStore = s),
              (this.route = a),
              (this.formBuilder = l),
              (this.notifications = c),
              (this.searchFoods = ""),
              (this.resId = localStorage.getItem("resId")),
              (this.socket = So("http://localhost:5000")),
              (this.foodData = []),
              (this.cartItems = []),
              (this.showCookieNotice = !1),
              (this.foodFade = !1),
              (this.quantity = 0);
          }
          ngOnInit() {
            this.loadFood(),
              this.updateFoods(),
              this.loadTablesToLobby(),
              (this.orderForm = this.formBuilder.group({
                table: "",
                note: "",
              }));
          }
          updateFoods() {
            this._diningSocketService.listen("newDataAdded").subscribe((n) => {
              const r = this.foodData.findIndex((i) => i._id == n._id);
              -1 !== r
                ? n.stock > 0
                  ? (this.foodData[r] = n)
                  : (this.foodData.splice(r, 1), this.loadFood())
                : n.stock > 0 && (this.foodData.push(n), this.loadFood());
            });
          }
          loadFood() {
            this._diningSocketService.emit("listFoods", {}),
              this._diningSocketService.listen("showFoods").subscribe(
                (n) => {
                  this.socket.on("foodAddes", () => {}),
                    (this.foodData = n.foodData),
                    (this.empty = null == this.foodData[0]),
                    (this.category = n.categories),
                    this.notifications.clearNotifications();
                },
                (n) => {
                  console.error("An error occurred:", n);
                }
              );
          }
          filterFood(n) {
            this.diningService.filterFood(n).subscribe(
              (r) => {
                (this.foodData = r.food),
                  (this.empty = null == this.foodData[0]);
              },
              (r) => console.log(r)
            );
          }
          loadTablesToLobby() {
            this.diningService.leadTables().subscribe((n) => {
              let r = n.tables.filter((i) => 0 == i.table_status);
              console.log(r),
                r[0]
                  ? ((this.tables = r), (this.emptyTables = !0))
                  : (this.emptyTables = !1);
            });
          }
          cheakCartIsEmpty() {
            this.cartIsEmpty = null != this.cartItems[0];
          }
          loadEacheFood(n) {
            let r = this.foodData.find((i) => i._id == n);
            (this.food_image = r.image),
              (this.food_name = r.name),
              (this.food_price = r.price),
              (this.food_id = r._id),
              (this.food_stock = r.stock);
          }
          incQnty(n) {
            "+" == n
              ? this.food_stock <= this.quantity
                ? this.notifications.normalNotification(
                    `Only ${this.food_stock} Quantity is remining `
                  )
                : (this.quantity += 1)
              : 0 == this.quantity
              ? this.notifications.normalNotification(
                  "Quantity should be more than 1 "
                )
              : (this.quantity -= 1);
          }
          addTocart(n) {
            let r = this.orderForm.getRawValue();
            if (0 == this.quantity)
              this.notifications.normalNotification("please add quantity");
            else {
              let i;
              this.foodData.map((o) => {
                (i = this.cartItems.find((s) => s.foodId == n)),
                  i ||
                    o._id != n ||
                    (this.cartItems.push({
                      foodImage: o.image,
                      foodName: o.name,
                      foodId: o._id,
                      foodPrice: o.price,
                      foodQuantity: this.quantity,
                      foodNote: r.note,
                    }),
                    (this.quantity = 0),
                    this.cheakCartIsEmpty()),
                  this.closeModal(),
                  (this.foodFade = !1),
                  setTimeout(() => {
                    this.foodFade = !0;
                  }, 500);
              });
            }
          }
          removeFromCart(n) {
            let r = this.cartItems.findIndex((i) => i.foodId == n);
            r > -1 && this.cartItems.splice(r, 1), this.cheakCartIsEmpty();
          }
          closeModal() {
            this.myModal.nativeElement.click(),
              this.myModal_1.nativeElement.click();
          }
          proceesOrder() {
            null == this.cartItems[0] &&
              this.tostr.warning("Please order any food"),
              null == this.table_id &&
                this.notifications.normalNotification("please Select a table"),
              this.diningService
                .proceedOrder(this.cartItems, this.table_id)
                .subscribe(
                  (n) => {
                    this._diningSocketService.emit("listFoods", {}),
                      this._diningSocketService.emit("NewOrders", {}),
                      this._diningSocketService.emit("changeTables", {}),
                      this.closeModal(),
                      this.cartItems.splice(0, this.cartItems.length),
                      this.cheakCartIsEmpty();
                  },
                  (n) => this.notifications.normalErrorNotify(n.error.message)
                );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(
              C(st),
              C(xr),
              C(tg),
              C(na),
              C(fi),
              C(li),
              C(vT),
              C(_T)
            );
          }),
          (e.ɵcmp = Xt({
            type: e,
            selectors: [["app-food-view"]],
            viewQuery: function (n, r) {
              if ((1 & n && (ph(x4, 5), ph(O4, 5)), 2 & n)) {
                let i;
                Ql((i = Zl())) && (r.myModal = i.first),
                  Ql((i = Zl())) && (r.myModal_1 = i.first);
              }
            },
            decls: 58,
            vars: 10,
            consts: [
              [1, "container"],
              [1, "foods__Section"],
              [1, "foods__category"],
              [3, "click", 4, "ngFor", "ngForOf"],
              ["class", "foods_container grid col-md-12", 4, "ngIf"],
              ["class", "container", 4, "ngIf"],
              [1, "order_section"],
              ["class", "cart-card", 4, "ngIf"],
              ["class", "proceed-btn", 4, "ngIf"],
              [
                "tabindex",
                "-1",
                "role",
                "dialog",
                "aria-labelledby",
                "mySmallModalLabel",
                "aria-hidden",
                "true",
                1,
                "modal",
                "fade",
                "bd-example-modal-sm",
              ],
              ["myModal", ""],
              [1, "modal-dialog"],
              [1, "modal-content"],
              [1, "dialog-cnt"],
              [1, "confirmation-head"],
              [1, "contirm-cnt"],
              [1, "action-btn"],
              [1, "confirm-btn"],
              [3, "dblclick"],
              [
                "tabindex",
                "-1",
                "role",
                "dialog",
                "aria-labelledby",
                "mySmallModalLabel",
                "aria-hidden",
                "true",
                1,
                "modal",
                "fade",
                "bd-example-modal-sm-1",
              ],
              ["myModal_1", ""],
              [1, "cart-info"],
              ["class", "items-img", 4, "ngIf"],
              [1, "items-name"],
              [1, "items-type"],
              [1, "items-price"],
              [3, "formGroup"],
              [1, "confirm-cnt"],
              [
                "formControlName",
                "note",
                "type",
                "text",
                "placeholder",
                "Add Note ..",
              ],
              [1, "btn"],
              [1, "choose_Quantity"],
              [1, "type-btn"],
              [3, "click"],
              [1, "add-btn"],
              ["type", "button", 3, "click"],
              ["type", "submit", 3, "click"],
              [1, "foods_container", "grid", "col-md-12"],
              ["class", "card", 4, "ngFor", "ngForOf"],
              [1, "card"],
              [1, "product-image"],
              ["alt", "OFF-white Red Edition", "draggable", "false", 3, "src"],
              [1, "product-info"],
              [1, "price"],
              [
                "type",
                "button",
                "data-toggle",
                "modal",
                "data-target",
                ".bd-example-modal-sm-1",
                3,
                "click",
              ],
              [
                "src",
                "../../../../../assets/farmers-food-design-image-file.jpg",
                "alt",
                "",
                1,
                "empty-img",
              ],
              [1, "cart-card"],
              [1, "cart-header"],
              ["class", "tables", 3, "ngModel", "ngModelChange", 4, "ngIf"],
              ["class", "empty_img", 4, "ngIf"],
              ["class", "empty_cheaker", 4, "ngIf"],
              [1, "tables", 3, "ngModel", "ngModelChange"],
              [3, "value", 4, "ngFor", "ngForOf"],
              [3, "value"],
              [1, "empty_img"],
              [
                "src",
                "../../../../../assets/farmers-food-design-image-file.jpg",
                "alt",
                "",
              ],
              [1, "empty_cheaker"],
              ["class", "cart-info", 4, "ngFor", "ngForOf"],
              [1, "items-img"],
              ["alt", "", 3, "src"],
              [1, "item-delete", 3, "click"],
              [1, "proceed-btn"],
              [
                "type",
                "button",
                "data-toggle",
                "modal",
                "data-target",
                ".bd-example-modal-sm",
              ],
            ],
            template: function (n, r) {
              1 & n &&
                (b(0, "div", 0)(1, "div", 1)(2, "div", 2),
                H(3, N4, 2, 1, "button", 3),
                w(),
                H(4, P4, 2, 1, "div", 4),
                H(5, F4, 2, 0, "div", 5),
                w(),
                b(6, "div", 6),
                H(7, H4, 7, 3, "section", 7),
                H(8, U4, 3, 0, "div", 8),
                w()(),
                b(9, "div", 9, 10)(11, "div", 11)(12, "div", 12)(13, "div", 13)(
                  14,
                  "div",
                  14
                )(15, "h4"),
                x(16, "Confirme the order"),
                w(),
                se(17, "hr"),
                w(),
                b(18, "div", 15)(19, "p"),
                x(20, "Are You Sure to order the food"),
                w(),
                se(21, "hr"),
                w(),
                b(22, "div", 16)(23, "div", 17)(24, "button", 18),
                ue("dblclick", function () {
                  return r.proceesOrder();
                }),
                x(25, "Confirme"),
                w()()()()()()(),
                b(26, "div", 19, 20)(28, "div", 11)(29, "div", 12)(
                  30,
                  "div",
                  13
                )(31, "div", 14)(32, "div", 21),
                H(33, $4, 2, 1, "div", 22),
                b(34, "div", 23),
                x(35),
                w(),
                b(36, "div", 24),
                x(37, "full"),
                w(),
                b(38, "div", 25),
                x(39),
                w()(),
                se(40, "hr"),
                w(),
                b(41, "form", 26)(42, "div", 27),
                se(43, "input", 28)(44, "hr"),
                b(45, "div", 29)(46, "label", 30),
                x(47),
                w(),
                b(48, "div", 31)(49, "button", 32),
                ue("click", function () {
                  return r.incQnty("+");
                }),
                x(50, "+"),
                w()(),
                b(51, "div", 33)(52, "button", 34),
                ue("click", function () {
                  return r.incQnty("-");
                }),
                x(53, "-"),
                w()()()(),
                b(54, "div", 16)(55, "div", 17)(56, "button", 35),
                ue("click", function () {
                  return r.addTocart(r.food_id);
                }),
                x(57, " Confirme "),
                w()()()()()()()()),
                2 & n &&
                  (A(3),
                  F("ngForOf", r.category),
                  A(1),
                  F("ngIf", !r.empty),
                  A(1),
                  F("ngIf", 1 == r.empty),
                  A(2),
                  F("ngIf", 0 == r.empty),
                  A(1),
                  F("ngIf", r.cartIsEmpty),
                  A(25),
                  F("ngIf", r.food_image),
                  A(2),
                  qt(r.food_name),
                  A(4),
                  He("\u20b9 ", r.food_price, ""),
                  A(2),
                  F("formGroup", r.orderForm),
                  A(6),
                  He("Quantity - ", r.quantity, ""));
            },
            dependencies: [gc, ni, jg, rT, oT, ca, mu, Ag, Ig, ma, gu, Bg],
            styles: [
              '@import"https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap";.empty-img[_ngcontent-%COMP%]{margin-top:2rem;border-radius:25px;height:400px;width:400px}[_ngcontent-%COMP%]:root{--dark-color-lighten: #f2f5ff;--red-card: #a62121;--blue-card: #4bb7e6;--btn: #141414;--btn-hover: #3a3a3a;--text: #fbf7f7;--main-color: rgb(255, 149, 0)}button[_ngcontent-%COMP%]{font-family:Montserrat,sans-serif;display:inline-block;border:none;outline:none;border-radius:.2rem;color:var(--text);cursor:pointer}a[_ngcontent-%COMP%]{text-decoration:none}img[_ngcontent-%COMP%]{max-width:100%;height:100%;-webkit-user-select:none;user-select:none}.foods_container[_ngcontent-%COMP%]{height:100%;width:100%;overflow-y:auto}.foods_container[_ngcontent-%COMP%]::-webkit-scrollbar{width:8px;background-color:#f1f1f1}.foods_container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background-color:orange;border-radius:10px}.foods_container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover{background-color:#ff9600}.foods_container[_ngcontent-%COMP%]{height:90%}.container[_ngcontent-%COMP%]{max-width:1080px;display:flex;flex-direction:row;transition:max-width .3s ease-in-out}.grid[_ngcontent-%COMP%]{display:grid}.foods__Section[_ngcontent-%COMP%]{width:70%;margin-top:2rem}.foods_container[_ngcontent-%COMP%]{display:grid;row-gap:20px;scroll-behavior:smooth;transition:max-width .3s ease-in-out;overflow-y:auto;height:550px}.foods__category[_ngcontent-%COMP%]{width:auto;height:auto;display:flex;justify-content:space-around;overflow-x:auto}.foods__category[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{height:40px;width:auto;background-color:#fcfcfc;box-shadow:1px 0 13px #e5e3e3;border-radius:15px;margin-left:15px;transition:.5s}.foods__category[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{height:40px;width:auto;background-color:#e37b0c;color:#fff;border-radius:15px;transform:translate(-5px)}.order_section[_ngcontent-%COMP%]{width:40%;display:block;justify-content:center;align-items:center}@media screen and (max-width: 320px){.container[_ngcontent-%COMP%]{margin-left:.2rem;margin-right:.2rem}.foods_container[_ngcontent-%COMP%]{grid-template-columns:200px}.order_section[_ngcontent-%COMP%]{display:none}}@media screen and (min-width: 320px){.container[_ngcontent-%COMP%]{justify-content:center}.foods_container[_ngcontent-%COMP%]{grid-template-columns:repeat(1,200px);justify-content:center;align-items:center;column-gap:1rem}}@media screen and (max-width: 1264px){.order_section[_ngcontent-%COMP%], .foods__category[_ngcontent-%COMP%]{display:none}}@media screen and (min-width: 560px){.container[_ngcontent-%COMP%]{justify-content:center}.foods_container[_ngcontent-%COMP%]{grid-template-columns:repeat(2,200px);justify-content:center;align-items:center;column-gap:1rem}}@media screen and (min-width: 720px){.container[_ngcontent-%COMP%]{padding:1rem 0;width:100%;gap:3rem}.foods_container[_ngcontent-%COMP%]{grid-template-columns:repeat(2,200px);justify-content:center;align-items:center;column-gap:1rem}}@media screen and (min-width: 860px){.container[_ngcontent-%COMP%]{padding:1rem 0;width:100%;gap:3rem}.foods_container[_ngcontent-%COMP%]{grid-template-columns:repeat(3,200px);justify-content:center;align-items:center;column-gap:.5rem}}@media screen and (min-width: 960px){.container[_ngcontent-%COMP%]{padding:1rem 0;width:100%;gap:3rem}.foods_container[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;max-width:100%;grid-template-columns:repeat(3,200px);justify-content:center;align-items:center;column-gap:1.5rem}}.card[_ngcontent-%COMP%]{position:relative;width:170px;height:auto;box-shadow:-1px 15px 30px -12px #202020;border-radius:.9rem;background-color:var(--red-card);color:var(--text);cursor:pointer}.card-blue[_ngcontent-%COMP%]{background:var(--blue-card)}.product-image[_ngcontent-%COMP%]{margin-top:2rem;height:100px;width:100%;display:flex;justify-content:center;align-items:center;transform:translateY(-1.5rem);transition:transform .6s ease-in-out;filter:drop-shadow(5px 10px 15px rgba(165,165,165,.873))}.product-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border-radius:15rem;position:relative;height:100px;width:100px;display:block;margin:auto}.product-info[_ngcontent-%COMP%]{text-align:center}.card[_ngcontent-%COMP%]:hover   .product-image[_ngcontent-%COMP%]{transform:translate(-1rem,-2rem) rotate(-720deg);filter:drop-shadow(5px 10px 15px rgba(245,90,12,.796))}.product-info[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font-size:1.4rem;font-weight:600}.product-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:.4rem;font-size:.8rem;font-weight:600}.price[_ngcontent-%COMP%]{padding:2px;font-size:1rem;font-weight:600;color:orange}.btn[_ngcontent-%COMP%]{display:flex;align-items:center;margin-top:.4rem}.buy-btn[_ngcontent-%COMP%]{background-color:var(--btn);padding:.3rem 2.5rem;font-weight:600;font-size:1rem;transition:.3s ease}.buy-btn[_ngcontent-%COMP%]:hover{background-color:var(--btn-hover)}.fav[_ngcontent-%COMP%]{box-sizing:border-box;background:#fff;padding:.5rem;border:1px solid#000;display:grid;place-items:center}.svg[_ngcontent-%COMP%]{height:25px;width:25px;fill:#fff;transition:all .5s ease}.fav[_ngcontent-%COMP%]:hover   .svg[_ngcontent-%COMP%]{fill:#000}.cart-card[_ngcontent-%COMP%]{position:relative;width:350px;height:30rem!important;box-shadow:1px 0 10px #9f9d9d;border-radius:.9rem .9rem 0rem 0rem;background-color:var(--red-card);color:var(--text);cursor:pointer;justify-content:center;align-items:center;overflow:hidden;overflow-y:auto}.cart-header[_ngcontent-%COMP%]{justify-content:space-around;align-items:center;display:flex;flex-direction:row;text-align:center;font-weight:600;font-size:medium}.cart-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{padding:10px;justify-content:left;text-align:left;font-weight:500;font-size:20px;font-weight:600;color:#3a3a3a}select[_ngcontent-%COMP%]{background-color:#f3f3f3;border:solid #ff8800 2px;color:#f80;border-radius:25px}option[_ngcontent-%COMP%]{background-color:#fff;color:#fff;border:solid #ff8800 2px;color:#f80}.cart-info[_ngcontent-%COMP%]{width:100%;height:70px;background-color:#fff;border-radius:25px;display:flex;flex-direction:row;align-items:center;justify-content:space-around}.items-img[_ngcontent-%COMP%]{border-image-outset:0cap;overflow:hidden}.items-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:60px;width:60px;border-radius:50px;transition:.1s}.items-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]:hover{transform:scale3d(50);height:70px;width:70px;border-radius:50px}.items-name[_ngcontent-%COMP%], .items-type[_ngcontent-%COMP%], .items-price[_ngcontent-%COMP%]{font-size:medium;font-weight:600;color:#212020}.items-price[_ngcontent-%COMP%]{color:orange}.btn[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-around;color:#fff}.add-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background-color:#20bf08;height:32px;width:4.5rem;border-radius:10px 1px;transition:.2s}.type-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#ff9500;height:32px;width:4.5rem;border-radius:1px 10px;transform:rotate(-10deg)}.add-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#20bf08;height:32px;width:4.5rem;border-radius:1px 10px;transform:rotate(10deg)}.item-delete[_ngcontent-%COMP%]{background-color:red;color:#fff;width:20px;border-radius:50px}.proceed-btn[_ngcontent-%COMP%]{position:relative;width:351px;height:50px;box-shadow:1px 2px 10px 1px #9f9d9d;border-radius:0rem 0rem .9rem .9rem;background-color:var(--red-card);color:var(--text);cursor:pointer;justify-content:center;align-items:center;display:flex}.proceed-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{height:40px;width:12rem;background-color:#ff9500;color:#fff;border-radius:2rem}.empty_img[_ngcontent-%COMP%]{justify-content:center;align-items:center;display:flex;margin:6rem 0rem}.empty_img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:200px;height:200px;border-radius:10%}.modal-open[_ngcontent-%COMP%]   .modal[_ngcontent-%COMP%]{overflow-x:hidden;overflow-y:auto}.fade.show[_ngcontent-%COMP%]{opacity:1}.modal[_ngcontent-%COMP%]{position:fixed;top:0;right:0;z-index:1050;display:none;overflow:hidden;outline:0}.modal-dialog[_ngcontent-%COMP%]{max-width:350px;height:auto;border-radius:25px;background:#4bb7e6}.modal-dialog[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]{background-color:#fbfbfb;border-radius:10px}.dialog-cnt[_ngcontent-%COMP%]{display:flex;text-align:center;flex-direction:column;justify-content:center}.confirmation-head[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{-webkit-text-decoration:solid;text-decoration:solid;font-size:20px;font-family:Arial,Helvetica,sans-serif;font-weight:600}.action-btn[_ngcontent-%COMP%]{margin:1rem;display:flex;justify-content:right}.confirm-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{color:#f1f1f1;background-color:#ff9500;height:32px;width:5.5rem;border-radius:10px}.confirm-cnt[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{margin:10px;border-radius:15px;width:200px;height:40px;border:solid orange 2px;background:none;outline:none;border:none;line-height:1;font-weight:600;font-size:1.1rem;color:#333;background-color:#fff;box-shadow:1px 1px 5px #bcbaba}.choose_table[_ngcontent-%COMP%], .choose_Quantity[_ngcontent-%COMP%]{color:#f70;font-weight:600;font-size:1rem;padding:1.5rem}.confirm-cnt[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder{color:#f70;font-weight:500}.modal-dialog-food-details[_ngcontent-%COMP%]{max-width:350px;height:auto;border-radius:25px}.modal-content-food-details[_ngcontent-%COMP%]{background-color:#fbfbfb;border-radius:10px}.dialog-cnt-food-details[_ngcontent-%COMP%]{display:flex;text-align:center;flex-direction:column;justify-content:center}.cart-card[_ngcontent-%COMP%]::-webkit-scrollbar{width:5px;background-color:#f1f1f1}.cart-card[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background-color:orange;border-radius:10px}.cart-card[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover{background-color:#ff9600}.btn[_ngcontent-%COMP%]{display:flex;flex-direction:row;color:#fff;margin:auto}.type-btn[_ngcontent-%COMP%], .add-btn[_ngcontent-%COMP%]{height:100%;width:100%}.type-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background-color:#ff9500;height:32px;width:4.5rem;border-radius:10px 1px;transition:.2s}.add-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background-color:#f70404;height:32px;width:4.5rem;border-radius:10px 1px;transition:.2s}.type-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#de8509;height:32px;width:4.5rem;border-radius:1px 10px;transform:rotate(-10deg)}.add-btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:#bf0808;height:32px;width:4.5rem;border-radius:1px 10px;transform:rotate(10deg)}',
            ],
            data: { animation: [XU] },
          })),
          e
        );
      })();
      function q4(e, t) {
        1 & e && (b(0, "label", 23), x(1, "Email is requried"), w());
      }
      function G4(e, t) {
        1 & e &&
          (b(0, "label", 23), x(1, "Email should be proper formate"), w());
      }
      function W4(e, t) {
        if (
          (1 & e &&
            (b(0, "div", 21),
            H(1, q4, 2, 0, "label", 22),
            H(2, G4, 2, 0, "label", 22),
            w()),
          2 & e)
        ) {
          const n = ne();
          A(1),
            F("ngIf", n.submitted && n.form.controls.email.errors.required),
            A(1),
            F("ngIf", n.submitted && n.form.controls.email.errors.email);
        }
      }
      function K4(e, t) {
        1 & e && (b(0, "label", 23), x(1, "Password is requried"), w());
      }
      function Q4(e, t) {
        1 & e && (b(0, "label", 23), x(1, "Password min more than 4 "), w());
      }
      function Z4(e, t) {
        if (
          (1 & e &&
            (b(0, "div", 21),
            H(1, K4, 2, 0, "label", 22),
            H(2, Q4, 2, 0, "label", 22),
            w()),
          2 & e)
        ) {
          const n = ne();
          A(1),
            F("ngIf", n.submitted && n.form.controls.password.errors.required),
            A(1),
            F("ngIf", n.submitted && n.form.controls.password.errors.minlength);
        }
      }
      let Y4 = (() => {
        class e {
          constructor(n, r, i, o) {
            (this.formBuilder = n),
              (this.diningService = r),
              (this.router = i),
              (this.toastr = o),
              (this.submitted = !1);
          }
          ngOnInit() {
            localStorage.getItem("dining-staffs")
              ? this.router.navigate(["/"])
              : this.router.navigate(["/diningLogin"]),
              (this.form = this.formBuilder.group({
                email: new gi("", [iu.required, iu.email]),
                password: new gi("", [iu.required, iu.minLength(4)]),
              }));
          }
          diningLogin() {
            if (((this.submitted = !0), this.form.invalid)) return;
            let n = this.form.getRawValue();
            this.diningService.diningLogin(n).subscribe(
              (r) => {
                this.router.navigate(["/"]),
                  localStorage.setItem("dining-staffs", "true_and_verifyed"),
                  localStorage.setItem("token", r.token),
                  localStorage.setItem("resId", r.resId);
              },
              (r) => {
                this.toastr.error(r.error.message);
              }
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(C(vT), C(xr), C(st), C(na));
          }),
          (e.ɵcmp = Xt({
            type: e,
            selectors: [["app-dining-login"]],
            decls: 32,
            vars: 3,
            consts: [
              [1, "container", "mx-auto", "mt-5"],
              [1, "card", "card0"],
              [1, "d-flex", "flex-lg-row", "flex-column-reverse"],
              [1, "card", "card2"],
              [1, "my-auto", "mx-md-5", "px-md-5", "right"],
              [1, "text-white"],
              [1, "card", "card1"],
              [1, "row", "justify-content-center", "my-auto"],
              [1, "col-md-8", "col-10"],
              [1, "row", "justify-content-center", "px-3", "mb-3"],
              ["id", "logo", "src", "https://i.imgur.com/PSXxjNY.png"],
              [1, "mb-5", "text-center", "heading"],
              [1, "msg-info"],
              [3, "formGroup", "submit"],
              [1, "form-group"],
              [1, "form-control-label", "text-muted"],
              [
                "formControlName",
                "email",
                "type",
                "text",
                "id",
                "email",
                "name",
                "email",
                "placeholder",
                "Phone no or email id",
                1,
                "form-control",
              ],
              ["class", "text-danger emailerror", 4, "ngIf"],
              [
                "formControlName",
                "password",
                "type",
                "password",
                "placeholder",
                "Password",
                1,
                "form-control",
              ],
              [1, "row", "justify-content-center", "my-3", "px-3"],
              ["type", "submit", 1, "btn-block", "btn-color"],
              [1, "text-danger", "emailerror"],
              ["class", "form-control-label text-danger", 4, "ngIf"],
              [1, "form-control-label", "text-danger"],
            ],
            template: function (n, r) {
              1 & n &&
                (b(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
                  4,
                  "div",
                  4
                )(5, "h3", 5),
                x(6, "We are more than just a company"),
                w(),
                b(7, "small", 5),
                x(
                  8,
                  "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                ),
                w()()(),
                b(9, "div", 6)(10, "div", 7)(11, "div", 8)(12, "div", 9),
                se(13, "img", 10),
                w(),
                b(14, "h3", 11),
                x(15, "Welcome To Turfyo"),
                w(),
                b(16, "h6", 12),
                x(17, "Please login to your account"),
                w(),
                b(18, "form", 13),
                ue("submit", function () {
                  return r.diningLogin();
                }),
                b(19, "div", 14)(20, "label", 15),
                x(21, "Email"),
                w(),
                se(22, "input", 16),
                H(23, W4, 3, 2, "div", 17),
                b(24, "div", 14)(25, "label", 15),
                x(26, "Password"),
                w(),
                se(27, "input", 18),
                H(28, Z4, 3, 2, "div", 17),
                w(),
                b(29, "div", 19)(30, "button", 20),
                x(31, " Login to Turfyo "),
                w()()()()()()()()()()),
                2 & n &&
                  (A(18),
                  F("formGroup", r.form),
                  A(5),
                  F("ngIf", r.form.controls.email.errors),
                  A(5),
                  F("ngIf", r.form.controls.password.errors));
            },
            dependencies: [ni, jg, ca, Ag, Ig, ma, gu],
            styles: [
              ".form-outline[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]{border:solid .2px rgb(243,110,8);border-radius:20px;box-shadow:none}.custom-toast[_ngcontent-%COMP%]{width:20px;height:20px}body[_ngcontent-%COMP%]{color:#000;overflow-x:hidden;height:100%;background-image:linear-gradient(to right,#D500F9,#FFD54F);background-repeat:no-repeat}input[_ngcontent-%COMP%], textarea[_ngcontent-%COMP%]{background-color:#f3e5f5;border-radius:50px!important;padding:12px 15px!important;width:100%;box-sizing:border-box;border:none!important;border:1px solid #F3E5F5!important;font-size:16px!important;color:#000!important;font-weight:400}input[_ngcontent-%COMP%]:focus, textarea[_ngcontent-%COMP%]:focus{box-shadow:none!important;border:1px solid #f98715ec!important;outline-width:0;font-weight:400}button[_ngcontent-%COMP%]:focus{box-shadow:none!important;outline-width:0}.card[_ngcontent-%COMP%]{border-radius:0;border:none}.card1[_ngcontent-%COMP%]{width:50%;padding:40px 30px 10px}.card2[_ngcontent-%COMP%]{width:50%;border-radius:25px;background-image:linear-gradient(to right,#f5c118,#f98715ec)}#logo[_ngcontent-%COMP%]{width:70px;height:60px}.heading[_ngcontent-%COMP%]{margin-bottom:60px!important;font-weight:700;color:#f57b18}[_ngcontent-%COMP%]::placeholder{color:#f98715ec!important;opacity:1}[_ngcontent-%COMP%]:-ms-input-placeholder{color:#f98715ec!important}[_ngcontent-%COMP%]::-ms-input-placeholder{color:#f98715ec!important}.form-control-label[_ngcontent-%COMP%]{font-size:12px;margin-left:15px}.msg-info[_ngcontent-%COMP%]{padding-left:15px;margin-bottom:30px}.btn-color[_ngcontent-%COMP%]{border-radius:50px;color:#fff;background-image:linear-gradient(to right,#f5c118,#f98715ec);padding:15px;cursor:pointer;border:none!important;margin-top:40px}.btn-color[_ngcontent-%COMP%]:hover{color:#fff;background-image:linear-gradient(to right,#f98715ec,#FFD54F)}.btn-white[_ngcontent-%COMP%]{border-radius:50px;color:#d500f9;background-color:#fff;padding:8px 40px;cursor:pointer;border:2px solid #D500F9!important}.btn-white[_ngcontent-%COMP%]:hover{color:#fff;background-image:linear-gradient(to right,#FFD54F,#D500F9)}a[_ngcontent-%COMP%], a[_ngcontent-%COMP%]:hover{color:#000}.bottom[_ngcontent-%COMP%]{width:100%;margin-top:50px!important}.sm-text[_ngcontent-%COMP%]{font-size:15px}@media screen and (max-width: 992px){.card1[_ngcontent-%COMP%]{width:100%;padding:40px 30px 10px}.card2[_ngcontent-%COMP%]{width:100%}.right[_ngcontent-%COMP%]{margin-top:100px!important;margin-bottom:100px!important}}@media screen and (max-width: 768px){.container[_ngcontent-%COMP%]{padding:10px!important}.card2[_ngcontent-%COMP%]{padding:50px}.right[_ngcontent-%COMP%]{margin-top:50px!important;margin-bottom:50px!important}}@media screen and (max-width:450px){.container[_ngcontent-%COMP%]{width:100%}.card2[_ngcontent-%COMP%]{padding:50px}.right[_ngcontent-%COMP%]{margin-top:50px!important;margin-bottom:50px!important}}.fixed-div[_ngcontent-%COMP%]{position:fixed;top:0;left:0}",
            ],
          })),
          e
        );
      })();
      function X4(e, t) {
        if ((1 & e && (b(0, "h3", 12), x(1), w()), 2 & e)) {
          const n = ne().$implicit;
          A(1), oo(" ", n.table_Name, "-", n.table_No, " ");
        }
      }
      function J4(e, t) {
        1 & e && (b(0, "p"), x(1, "Free"), w());
      }
      function e5(e, t) {
        1 & e &&
          (b(0, "div", 13)(1, "div", 14)(2, "div"),
          se(3, "div")(4, "div")(5, "div"),
          w(),
          b(6, "div"),
          se(7, "div")(8, "div")(9, "div"),
          w()()());
      }
      function t5(e, t) {
        if ((1 & e && (b(0, "p"), x(1), w()), 2 & e)) {
          const n = ne().$implicit;
          A(1), oo(" ", n.table_Name, "-", n.table_No, " ");
        }
      }
      const n5 = function (e, t) {
        return {
          "card-free-table": !0,
          " custom-style-false": e,
          "custom-style-true": t,
        };
      };
      function r5(e, t) {
        if (1 & e) {
          const n = nn();
          b(0, "section", 8)(1, "div", 9),
            ue("click", function () {
              const o = Vt(n).$implicit;
              return Bt(ne().takeCurrentOrder(o._id));
            }),
            H(2, X4, 2, 2, "h3", 10),
            H(3, J4, 2, 0, "p", 7),
            b(4, "div"),
            H(5, e5, 10, 0, "div", 11),
            w(),
            H(6, t5, 2, 2, "p", 7),
            w()();
        }
        if (2 & e) {
          const n = t.$implicit;
          F("ngClass", uw(5, n5, n.table_status, !n.table_status)),
            A(2),
            F("ngIf", !n.table_status),
            A(1),
            F("ngIf", !n.table_status),
            A(2),
            F("ngIf", n.table_status),
            A(1),
            F("ngIf", n.table_status);
        }
      }
      function i5(e, t) {
        1 & e && (b(0, "div", 24), se(1, "img", 25), w());
      }
      function o5(e, t) {
        if (
          (1 & e &&
            (b(0, "div", 26)(1, "div", 27),
            se(2, "img", 28),
            w(),
            b(3, "div", 29),
            x(4),
            w(),
            b(5, "div", 30),
            x(6, "full"),
            w(),
            b(7, "div", 31),
            x(8),
            w(),
            b(9, "div", 32),
            x(10, "X"),
            w(),
            b(11, "div", 31),
            x(12),
            w(),
            b(13, "div", 33),
            x(14),
            w()()),
          2 & e)
        ) {
          const n = t.$implicit;
          A(2),
            F(
              "src",
              "http://localhost:5000/foods-images/" + n.food_id.image,
              Wr
            ),
            A(2),
            qt(n.food_id.name),
            A(4),
            qt(n.food_quantity),
            A(4),
            qt(n.food_id.price),
            A(2),
            He("\u20b9 ", n.food_totalprice, "");
        }
      }
      function s5(e, t) {
        if (
          (1 & e &&
            (b(0, "div", 34)(1, "span"), x(2, " Food Count :"), w(), x(3), w()),
          2 & e)
        ) {
          const n = ne(2);
          A(3), He(" ", n.total_Foods_Count, " ");
        }
      }
      function a5(e, t) {
        if (
          (1 & e &&
            (b(0, "div", 35)(1, "span"), x(2, "Total : "), w(), x(3), w()),
          2 & e)
        ) {
          const n = ne(2);
          A(3), He("\u20b9", n.total_amount, " ");
        }
      }
      function l5(e, t) {
        if (1 & e) {
          const n = nn();
          b(0, "div")(1, "section", 15)(2, "div", 16)(3, "h3"),
            x(4, "Current Order"),
            w(),
            b(5, "button", 17),
            ue("click", function () {
              return Vt(n), Bt(ne().closeDiv());
            }),
            x(6, "close"),
            w()(),
            H(7, i5, 2, 0, "div", 18),
            b(8, "div", 19),
            H(9, o5, 15, 5, "div", 20),
            w()(),
            b(10, "div", 21),
            H(11, s5, 4, 1, "div", 22),
            H(12, a5, 4, 1, "div", 23),
            w()();
        }
        if (2 & e) {
          const n = ne();
          F("@fadeOut", n.closeState)("@fadeIn", n.openState),
            A(9),
            F("ngForOf", n.allFoods),
            A(2),
            F("ngIf", n.total_Foods_Count),
            A(1),
            F("ngIf", n.total_amount);
        }
      }
      let c5 = (() => {
        class e {
          constructor(n) {
            (this.dinigService = n),
              (this.CloseDiv = !0),
              (this.openDIv = !0),
              (this.openState = "hidden"),
              (this.closeState = "visible");
          }
          ngOnInit() {
            this.getAllTables(), this.getAllOrders();
          }
          closeDiv() {
            (this.closeState = "hidden"),
              (this.openState = "hidden"),
              setTimeout(() => {
                (this.CloseDiv = !0), (this.openDIv = !1);
              }, 300);
          }
          openDiv() {
            (this.closeState = "visible"),
              (this.openState = "visible"),
              setTimeout(() => {
                (this.openDIv = !0), (this.CloseDiv = !1);
              }, 300);
          }
          getAllTables() {
            this.dinigService.leadTables().subscribe((n) => {
              this.tables = n.tables;
            });
          }
          getAllOrders() {
            this.dinigService.getAllOrders().subscribe((n) => {
              (this.Orders = n.orders), console.log(this.Orders[0].tableId._id);
            });
          }
          takeCurrentOrder(n) {
            let r = this.Orders.find((i) => i.tableId._id == n);
            r
              ? (this.openDiv(),
                (this.allFoods = r.foods),
                console.log(this.allFoods),
                (this.total_Foods_Count = r.foods.length),
                (this.total_amount = r.total_price))
              : this.closeDiv();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(C(xr));
          }),
          (e.ɵcmp = Xt({
            type: e,
            selectors: [["app-table-view"]],
            decls: 8,
            vars: 2,
            consts: [
              [1, "container"],
              [1, "col-md-7"],
              [1, "container", "mt-5"],
              [1, "tabels"],
              [1, "row"],
              [3, "ngClass", 4, "ngFor", "ngForOf"],
              [1, "col-md-4", "mt-5"],
              [4, "ngIf"],
              [3, "ngClass"],
              ["type", "button", 1, "product-table", 3, "click"],
              ["class", "table-name", 4, "ngIf"],
              ["class", "loadingio-spinner-bean-eater-eey17oykdca", 4, "ngIf"],
              [1, "table-name"],
              [1, "loadingio-spinner-bean-eater-eey17oykdca"],
              [1, "ldio-djpg494qup8"],
              [1, "cart-card"],
              [1, "cart-header"],
              [1, "btn", "btn-warning", 3, "click"],
              ["class", "empty_img", 4, "ngIf"],
              [1, "empty_cheaker"],
              ["class", "cart-info", 4, "ngFor", "ngForOf"],
              [1, "proceed-btn"],
              ["class", "total-amount", 4, "ngIf"],
              ["class", "total-amount", "ng", "", 4, "ngIf"],
              [1, "empty_img"],
              [
                "src",
                "../../../../../assets/farmers-food-design-image-file.jpg",
                "alt",
                "",
              ],
              [1, "cart-info"],
              [1, "items-img"],
              ["alt", "", 3, "src"],
              [1, "items-name"],
              [1, "items-type"],
              [1, "items-price"],
              [1, "items-x"],
              [1, "items-total-price"],
              [1, "total-amount"],
              ["ng", "", 1, "total-amount"],
            ],
            template: function (n, r) {
              1 & n &&
                (b(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(
                  4,
                  "div",
                  4
                ),
                H(5, r5, 7, 8, "section", 5),
                w()()()(),
                b(6, "div", 6),
                H(7, l5, 13, 5, "div", 7),
                w()()),
                2 & n &&
                  (A(5),
                  F("ngForOf", r.tables),
                  A(2),
                  F("ngIf", r.openDIv || r.CloseDiv));
            },
            dependencies: [zD, gc, ni],
            styles: [
              ".container[_ngcontent-%COMP%]{height:auto;width:100%;margin:auto;display:flex;flex-direction:row;align-items:center;justify-content:space-evenly}.card-free-table[_ngcontent-%COMP%]{width:176px;height:100px;border:solid rgba(47,255,0,.518);border-radius:.9rem;background-color:var(--red-card);color:#2fff0084;cursor:pointer}.card-blue[_ngcontent-%COMP%]{background:var(--blue-card)}.product-table[_ngcontent-%COMP%]{margin-top:2.3rem;height:100px;width:100%;justify-content:center;align-items:center;transform:translateY(-1.5rem);transition:transform .6s ease-in-out;filter:drop-shadow(5px 10px 15px rgba(165,165,165,.873));text-align:center}.table-name[_ngcontent-%COMP%]{-webkit-text-decoration:wavy;text-decoration:wavy;font-weight:600}.card-free-table.custom-style-true[_ngcontent-%COMP%]{position:relative;margin:1rem;width:160px;height:100px;border:solid rgba(44,171,15,.899) 10px;border-radius:.9rem;background-color:var(--red-card);color:#2fff0084;cursor:pointer;box-shadow:0 0 20px 10px #2fff0084;animation:_ngcontent-%COMP%_shadows_ture 2s infinite}.card-free-table.custom-style-false[_ngcontent-%COMP%]{position:relative;margin:1rem;width:160px;height:100px;border:solid rgba(255,145,0,.725) 10px;border-radius:.9rem;background-color:var(--red-card);color:#ff9100a2;cursor:pointer}.eatng_svg[_ngcontent-%COMP%]{width:60px}.glow-item[_ngcontent-%COMP%]{text-align:center;margin:30px 100px}.card[_ngcontent-%COMP%]{width:-moz-fit-content;width:fit-content;height:-moz-fit-content;height:fit-content;padding:.7rem;display:flex;justify-content:center;align-items:center;background:white;color:#48abe0;text-align:center;border-radius:5px;cursor:pointer;box-shadow:0 0 50px 15px #48abe0}@keyframes _ngcontent-%COMP%_shadows_ture{0%{box-shadow:0 0 10px 5px #2fff0084}25%{box-shadow:0 0 10px 5px #2fff0084;box-shadow:0 0 10px 5px #fff}50%{box-shadow:0 0 10px 5px #fff}75%{box-shadow:0 0 10px 5px #fff}to{box-shadow:0 0 10px 5px #2fff0084}}.cart-card[_ngcontent-%COMP%]{position:relative;width:350px;height:32rem!important;box-shadow:1px 0 10px #9f9d9d;border-radius:.9rem .9rem 0rem 0rem;background-color:var(--red-card);color:var(--text);cursor:pointer;justify-content:center;align-items:center;overflow:hidden;overflow-y:auto}.cart-header[_ngcontent-%COMP%]{justify-content:space-around;align-items:center;display:flex;flex-direction:row;text-align:center;font-weight:600;font-size:medium}.cart-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{padding:10px;justify-content:left;text-align:left;font-weight:500;font-size:20px;font-weight:600;color:#3a3a3a}select[_ngcontent-%COMP%]{background-color:#f3f3f3;border:solid #ff8800 2px;color:#f80;border-radius:25px}option[_ngcontent-%COMP%]{background-color:#fff;color:#fff;border:solid #ff8800 2px;color:#f80}.cart-info[_ngcontent-%COMP%]{width:100%;height:70px;background-color:#fff;border-radius:25px;display:flex;flex-direction:row;align-items:center;justify-content:space-around}.items-img[_ngcontent-%COMP%]{border-image-outset:0cap;overflow:hidden}.items-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:60px;width:60px;border-radius:50px;transition:.1s}.items-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]:hover{transform:scale3d(50);height:70px;width:70px;border-radius:50px}.items-name[_ngcontent-%COMP%], .items-type[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#4d4d4d}.items-price[_ngcontent-%COMP%]{color:#353434}.cart_menu[_ngcontent-%COMP%]{justify-content:center}.cart_items[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-around}.items-x[_ngcontent-%COMP%]{font-size:small}.items-total-price[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#f80}.proceed-btn[_ngcontent-%COMP%]{position:relative;width:351px;height:50px;box-shadow:1px 2px 10px 1px #9f9d9d;border-radius:0rem 0rem .9rem .9rem;background-color:var(--red-card);color:var(--text);cursor:pointer;justify-content:space-around;align-items:center;display:flex}.proceed-btn[_ngcontent-%COMP%]{font-size:medium;font-weight:600;color:#f80}.proceed-btn[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#595656}@keyframes _ngcontent-%COMP%_ldio-djpg494qup8-1{0%{transform:rotate(0)}50%{transform:rotate(-45deg)}to{transform:rotate(0)}}@keyframes _ngcontent-%COMP%_ldio-djpg494qup8-2{0%{transform:rotate(180deg)}50%{transform:rotate(225deg)}to{transform:rotate(180deg)}}.ldio-djpg494qup8[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]:nth-child(2){transform:translate(-15px)}.ldio-djpg494qup8[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]:nth-child(2) div{position:absolute;top:20px;left:20px;width:60px;height:30px;border-radius:60px 60px 0 0;background:#f8b26a;animation:_ngcontent-%COMP%_ldio-djpg494qup8-1 1s linear infinite;transform-origin:30px 30px}.ldio-djpg494qup8[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]:nth-child(2) div:nth-child(2){animation:_ngcontent-%COMP%_ldio-djpg494qup8-2 1s linear infinite}.ldio-djpg494qup8[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]:nth-child(2) div:nth-child(3){transform:rotate(-90deg);animation:none}@keyframes _ngcontent-%COMP%_ldio-djpg494qup8-3{0%{transform:translate(95px);opacity:0}20%{opacity:1}to{transform:translate(35px);opacity:1}}.ldio-djpg494qup8[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]:nth-child(1){display:block}.ldio-djpg494qup8[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]:nth-child(1) div{position:absolute;top:46px;left:-4px;width:8px;height:8px;border-radius:50%;background:#e15b64;animation:_ngcontent-%COMP%_ldio-djpg494qup8-3 1s linear infinite}.ldio-djpg494qup8[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]:nth-child(1) div:nth-child(1){animation-delay:-.67s}.ldio-djpg494qup8[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]:nth-child(1) div:nth-child(2){animation-delay:-.33s}.ldio-djpg494qup8[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]:nth-child(1) div:nth-child(3){animation-delay:0s}.loadingio-spinner-bean-eater-zylngbxb0mn[_ngcontent-%COMP%]{width:57px;height:57px;display:inline-block;overflow:hidden;background:rgba(255,255,255,0)}.ldio-djpg494qup8[_ngcontent-%COMP%]{width:100%;height:100%;position:relative;transform:translateZ(0) scale(.57);-webkit-backface-visibility:hidden;backface-visibility:hidden;transform-origin:0 0}.ldio-djpg494qup8[_ngcontent-%COMP%]   div[_ngcontent-%COMP%]{box-sizing:content-box}",
            ],
            data: { animation: [ES, SS] },
          })),
          e
        );
      })();
      function u5(e, t) {
        1 & e && (b(0, "div", 16), x(1, " pendding "), w());
      }
      function d5(e, t) {
        1 & e && (b(0, "div", 17), x(1, " Ready "), w());
      }
      function f5(e, t) {
        1 & e && (b(0, "div", 17), x(1, " Served "), w());
      }
      function h5(e, t) {
        if (1 & e) {
          const n = nn();
          b(0, "div", 6),
            ue("click", function () {
              const o = Vt(n).$implicit;
              return Bt(ne().takeCurrentOrder(o._id));
            })("click", function () {
              return Vt(n), Bt(ne().openDiv());
            }),
            b(1, "div", 7)(2, "div", 8)(3, "h4"),
            x(4),
            w()(),
            b(5, "div", 9)(6, "section", 10)(7, "span"),
            x(8, "T-1"),
            w()()()(),
            se(9, "div", 11),
            b(10, "div", 12),
            H(11, u5, 2, 0, "div", 13),
            H(12, d5, 2, 0, "div", 14),
            H(13, f5, 2, 0, "div", 14),
            b(14, "div", 15),
            x(15),
            w()()();
        }
        if (2 & e) {
          const n = t.$implicit;
          A(4),
            qt(n.resId.name),
            A(7),
            F("ngIf", "pending" == n.order_status),
            A(1),
            F("ngIf", "ready" == n.order_status),
            A(1),
            F("ngIf", "served" == n.order_status),
            A(2),
            oo(
              " ",
              n.foods.length,
              " ",
              1 == n.foods.length ? "Food" : "foods",
              ""
            );
        }
      }
      function p5(e, t) {
        1 & e && (b(0, "div", 27), se(1, "img", 28), w());
      }
      function g5(e, t) {
        if (
          (1 & e &&
            (b(0, "div", 29)(1, "div", 30),
            se(2, "img", 31),
            w(),
            b(3, "div", 32),
            x(4),
            w(),
            b(5, "div", 33),
            x(6, "full"),
            w(),
            b(7, "div", 34),
            x(8),
            w(),
            b(9, "div", 35),
            x(10, "X"),
            w(),
            b(11, "div", 34),
            x(12),
            w(),
            b(13, "div", 36),
            x(14),
            w()()),
          2 & e)
        ) {
          const n = t.$implicit;
          A(2),
            F(
              "src",
              "http://localhost:5000/foods-images/" + n.food_id.image,
              Wr
            ),
            A(2),
            qt(n.food_id.name),
            A(4),
            qt(n.food_quantity),
            A(4),
            qt(n.food_id.price),
            A(2),
            He("\u20b9 ", n.food_totalprice, "");
        }
      }
      function m5(e, t) {
        if (
          (1 & e &&
            (b(0, "div", 37)(1, "div", 38)(2, "span"),
            x(3, " Food Count :"),
            w(),
            x(4),
            w(),
            b(5, "div", 39)(6, "span"),
            x(7, "Total : "),
            w(),
            x(8),
            w()()),
          2 & e)
        ) {
          const n = ne(2);
          A(4),
            He(" ", n.total_Foods_Count, " "),
            A(4),
            He("\u20b9", n.total_amount, " ");
        }
      }
      function y5(e, t) {
        if (1 & e) {
          const n = nn();
          b(0, "div", 40)(1, "button", 41),
            ue("click", function () {
              Vt(n);
              const i = ne(2);
              return Bt(i.ServingFood(i.current_order._id));
            }),
            x(2, "Served "),
            w()();
        }
      }
      function v5(e, t) {
        if (1 & e) {
          const n = nn();
          b(0, "div")(1, "section", 18)(2, "div", 19)(3, "h3"),
            x(4, "Current Order"),
            w(),
            b(5, "button", 20),
            ue("click", function () {
              return Vt(n), Bt(ne().closeDiv());
            }),
            x(6, "close"),
            w()(),
            H(7, p5, 2, 0, "div", 21),
            b(8, "div", 22),
            H(9, g5, 15, 5, "div", 23),
            w()(),
            b(10, "div", 24),
            H(11, m5, 9, 2, "div", 25),
            H(12, y5, 3, 0, "div", 26),
            w()();
        }
        if (2 & e) {
          const n = ne();
          F("@fadeOut", n.closeState)("@fadeIn", n.openState),
            A(9),
            F("ngForOf", n.allFoods),
            A(2),
            F("ngIf", n.total_Foods_Count),
            A(1),
            F(
              "ngIf",
              n.current_order && "ready" == n.current_order.order_status
            );
        }
      }
      let _5 = (() => {
          class e {
            constructor(n, r, i) {
              (this._diningService = n),
                (this._diningSocketService = r),
                (this._notifications = i),
                (this.socket = So("http://localhost:5000")),
                (this.resId = localStorage.getItem("resId")),
                (this.CloseDiv = !0),
                (this.openDIv = !0),
                (this.openState = "hidden"),
                (this.closeState = "visible");
            }
            ngOnInit() {
              this.loadOrder(),
                this.NewOrders(),
                this.servedOrder(),
                this._diningSocketService
                  .listen("updateServedOrder")
                  .subscribe((n) => {
                    console.log("heloooo"),
                      console.log(n, "rached"),
                      this._notifications.handleNewOrderNotification(
                        `Order to ${n.tableId.table_Name} - ${n.tableId.table_No} id Ready `
                      ),
                      (this.Orders = this.Orders.map((r) =>
                        r._id == n._id ? n : r
                      ));
                  });
            }
            closeDiv() {
              (this.closeState = "hidden"),
                (this.openState = "hidden"),
                setTimeout(() => {
                  (this.CloseDiv = !0), (this.openDIv = !1);
                }, 300);
            }
            openDiv() {
              (this.closeState = "visible"),
                (this.openState = "visible"),
                setTimeout(() => {
                  (this.openDIv = !0), (this.CloseDiv = !1);
                }, 300);
            }
            loadOrder() {
              this._diningSocketService.emit("loadOrdersToPOS", {}),
                this._diningSocketService.listen("listOrdersToPOS").subscribe(
                  (n) => {
                    this.Orders = n;
                  },
                  (n) => {
                    console.error("An error occurred:", n);
                  }
                );
            }
            NewOrders() {
              this._diningSocketService
                .listen("pushNewOrder")
                .subscribe((n) => {
                  this._notifications.handleNewOrderNotification("New Orders"),
                    this.Orders.push(n);
                });
            }
            servedOrder() {}
            takeCurrentOrder(n) {
              let r = this.Orders.find((i) => i._id == n);
              r &&
                ((this.current_order = r),
                (this.allFoods = this.current_order.foods),
                (this.total_Foods_Count = this.current_order.foods.length),
                (this.total_amount = this.current_order.total_price));
            }
            ServingFood(n) {
              this._diningService.updateServingStatus(n).subscribe(
                (r) => {
                  this._diningSocketService.emit("loadOrdersToPOS", {}),
                    this.closeDiv();
                },
                (r) => console.log(r)
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(C(xr), C(tg), C(_T));
            }),
            (e.ɵcmp = Xt({
              type: e,
              selectors: [["app-orders-view"]],
              decls: 6,
              vars: 2,
              consts: [
                [1, "container"],
                [1, "col-md-8"],
                [1, "orders"],
                ["class", "order-card", 3, "click", 4, "ngFor", "ngForOf"],
                [1, "col-md-4"],
                [4, "ngIf"],
                [1, "order-card", 3, "click"],
                [1, "order-table"],
                [1, "order-id"],
                [1, "table"],
                [1, "card-free-table", "custom-style-false"],
                [1, "order-clear"],
                [1, "order-status"],
                ["class", "status", 4, "ngIf"],
                ["class", "ready__status", 4, "ngIf"],
                [1, "foods"],
                [1, "status"],
                [1, "ready__status"],
                [1, "cart-card"],
                [1, "cart-header"],
                [1, "btn", "btn-warning", 3, "click"],
                ["class", "empty_img", 4, "ngIf"],
                [1, "empty_cheaker"],
                ["class", "cart-info", 4, "ngFor", "ngForOf"],
                [1, "proceed__btn"],
                ["class", "total-amount", 4, "ngIf"],
                ["class", "serving__btn", 4, "ngIf"],
                [1, "empty_img"],
                [
                  "src",
                  "../../../../../assets/farmers-food-design-image-file.jpg",
                  "alt",
                  "",
                ],
                [1, "cart-info"],
                [1, "items-img"],
                ["alt", "", 3, "src"],
                [1, "items-name"],
                [1, "items-type"],
                [1, "items-price"],
                [1, "items-x"],
                [1, "items-total-price"],
                [1, "total-amount"],
                [1, "food__Count"],
                [1, "total__cash"],
                [1, "serving__btn"],
                [3, "click"],
              ],
              template: function (n, r) {
                1 & n &&
                  (b(0, "div", 0)(1, "div", 1)(2, "div", 2),
                  H(3, h5, 16, 6, "div", 3),
                  w()(),
                  b(4, "div", 4),
                  H(5, v5, 13, 5, "div", 5),
                  w()()),
                  2 & n &&
                    (A(3),
                    F("ngForOf", r.Orders),
                    A(2),
                    F("ngIf", r.openDIv || r.CloseDiv));
              },
              dependencies: [gc, ni],
              styles: [
                ".container[_ngcontent-%COMP%]{margin:0rem 0px;width:100%;display:flex;flex-direction:row}.grid[_ngcontent-%COMP%]{display:grid}.orders[_ngcontent-%COMP%]{padding:1.6rem 0rem;display:grid;grid-template-rows:repeat(4,91px);width:100%;height:600px;justify-content:space-around;overflow-y:auto}.order-card[_ngcontent-%COMP%]{width:636px;height:77px;background-color:#fff;border:solid 1px orange;box-shadow:1px 2px 18px #fdfafa;border-radius:25px;display:flex;flex-direction:row;transition:width .5s ease}.order-table[_ngcontent-%COMP%]{justify-content:space-around;align-items:center;display:flex;flex-direction:row;text-align:center}.order-id[_ngcontent-%COMP%]{padding:1rem}.order-id[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:20px;font-weight:600}.table1[_ngcontent-%COMP%]{display:flex;justify-content:center}.card-free-table.custom-style-true[_ngcontent-%COMP%]{position:relative;margin:1rem;width:81px;height:47px;box-shadow:10px 15px 30px -12px #30e50c,10px 15px 30px -12px #30e50c inset;border:solid rgba(44,171,15,.899) 10px;border-radius:.9rem;background-color:var(--red-card);color:#2fff0084;cursor:pointer;box-shadow:0 0 20px 10px #2fff0084;animation:shadows_ture 2s infinite}.card-free-table.custom-style-false[_ngcontent-%COMP%]{position:relative;margin:1rem;width:81px;height:47px;box-shadow:10px 15px 30px -12px #ff9100b9,10px 15px 30px -12px #ff9100b9 inset;border:solid rgba(255,145,0,.725) 10px;border-radius:.9rem;background-color:var(--red-card);color:#ff9100a2;cursor:pointer}.order-clear[_ngcontent-%COMP%]{width:70%}.order-status[_ngcontent-%COMP%]{width:40%;padding-right:10px;padding-top:13px;display:flex;flex-direction:column;column-gap:10px;align-items:center}.status[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#800400}.ready__status[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#0aa00a}.time[_ngcontent-%COMP%]{font-size:large;font-weight:600;color:#000}.foods[_ngcontent-%COMP%]{font-size:13px;font-weight:600;color:#000}@media screen and (max-width: 550px){.container[_ngcontent-%COMP%]{margin:.6rem 0rem;justify-content:center;width:100%;height:auto;display:flex;flex-direction:row}.order-card[_ngcontent-%COMP%]{width:321px;height:5rem;background-color:#fff;box-shadow:1px 2px 8px #4c4c4c;border-radius:24px;display:flex;flex-direction:row}.order-table[_ngcontent-%COMP%]{width:30%;justify-content:center;align-items:center;display:flex;flex-direction:column;text-align:center}.order-id[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:12px;font-weight:600}.table1[_ngcontent-%COMP%]{max-width:96%;background-color:transparent}.card-free-table.custom-style-true[_ngcontent-%COMP%]{position:relative;margin:0px 1rem;width:160px;height:100px;box-shadow:10px 15px 30px -12px #30e50c,10px 15px 30px -12px #30e50c inset;border:solid rgba(44,171,15,.899) 10px;border-radius:.9rem;background-color:var(--red-card);color:#2fff0084;cursor:pointer;box-shadow:0 0 20px 10px #2fff0084;animation:shadows_ture 2s infinite}.card-free-table.custom-style-false[_ngcontent-%COMP%]{position:relative;margin:0px 0rem;width:60px;height:40px;box-shadow:10px 15px 30px -12px #ff9100b9,10px 15px 30px -12px #ff9100b9 inset;border:solid rgba(255,145,0,.725) 4px;border-radius:.7rem;background-color:var(--red-card);color:#ff9100a2;cursor:pointer}.order-clear[_ngcontent-%COMP%]{width:70%}.order-status[_ngcontent-%COMP%]{width:30%;padding-right:20px;display:flex;flex-direction:column;justify-content:space-evenly;align-items:center}.status[_ngcontent-%COMP%]{font-size:11px;font-weight:500;color:green}.time[_ngcontent-%COMP%], .foods[_ngcontent-%COMP%]{font-size:10px;font-weight:500;color:#000}}@media only screen and (max-width: 680px) and (min-width: 551px){.container[_ngcontent-%COMP%]{margin:3rem;justify-content:center;width:100%;height:auto;display:flex;flex-direction:row}.order-card[_ngcontent-%COMP%]{width:447px;height:6rem;background-color:#fff;box-shadow:1px 2px 8px #4c4c4c;border-radius:25px;display:flex;flex-direction:row}.order-table[_ngcontent-%COMP%]{width:30%;justify-content:center;align-items:center;display:flex;flex-direction:column;text-align:center}.order-id[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-size:14px;font-weight:600}.table1[_ngcontent-%COMP%]{max-width:96%;background-color:transparent}.card-free-table.custom-style-true[_ngcontent-%COMP%]{position:relative;margin:0px 1rem;width:160px;height:100px;box-shadow:10px 15px 30px -12px #30e50c,10px 15px 30px -12px #30e50c inset;border:solid rgba(44,171,15,.899) 10px;border-radius:.9rem;background-color:var(--red-card);color:#2fff0084;cursor:pointer;box-shadow:0 0 20px 10px #2fff0084;animation:shadows_ture 2s infinite}.card-free-table.custom-style-false[_ngcontent-%COMP%]{position:relative;margin:0px 0rem;width:70px;height:50px;box-shadow:10px 15px 30px -12px #ff9100b9,10px 15px 30px -12px #ff9100b9 inset;border:solid rgba(255,145,0,.725) 6px;border-radius:.7rem;background-color:var(--red-card);color:#ff9100a2;cursor:pointer}.order-clear[_ngcontent-%COMP%]{width:70%}.order-status[_ngcontent-%COMP%]{width:30%;padding-right:20px;display:flex;flex-direction:column;justify-content:space-evenly;align-items:center}.status[_ngcontent-%COMP%]{font-size:15px;font-weight:600;color:green}.time[_ngcontent-%COMP%], .foods[_ngcontent-%COMP%]{font-size:13px;font-weight:600;color:#000}}.cart-card[_ngcontent-%COMP%]{position:relative;width:350px;height:32rem!important;box-shadow:1px 0 10px #9f9d9d;border-radius:.9rem .9rem 0rem 0rem;background-color:var(--red-card);color:var(--text);cursor:pointer;justify-content:center;align-items:center;overflow:hidden;overflow-y:auto}.cart-header[_ngcontent-%COMP%]{justify-content:space-around;align-items:center;display:flex;flex-direction:row;text-align:center;font-weight:600;font-size:medium}.cart-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{padding:10px;justify-content:left;text-align:left;font-weight:500;font-size:20px;font-weight:600;color:#3a3a3a}select[_ngcontent-%COMP%]{background-color:#f3f3f3;border:solid #ff8800 2px;color:#f80;border-radius:25px}option[_ngcontent-%COMP%]{background-color:#fff;color:#fff;border:solid #ff8800 2px;color:#f80}.cart-info[_ngcontent-%COMP%]{width:100%;height:70px;background-color:#fff;border-radius:25px;display:flex;flex-direction:row;align-items:center;justify-content:space-around}.items-img[_ngcontent-%COMP%]{border-image-outset:0cap;overflow:hidden}.items-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:60px;width:60px;border-radius:50px;transition:.1s}.items-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]:hover{transform:scale3d(50);height:70px;width:70px;border-radius:50px}.items-name[_ngcontent-%COMP%], .items-type[_ngcontent-%COMP%]{font-size:small;font-weight:400;color:#4d4d4d}.items-price[_ngcontent-%COMP%]{color:#353434}.cart_menu[_ngcontent-%COMP%]{justify-content:center}.cart_items[_ngcontent-%COMP%]{display:flex;flex-direction:row;justify-content:space-around}.items-x[_ngcontent-%COMP%]{font-size:small}.items-total-price[_ngcontent-%COMP%]{font-size:small;font-weight:400;color:#f80}.proceed__btn[_ngcontent-%COMP%]{position:relative;width:351px;height:50px;box-shadow:1px 2px 10px 1px #9f9d9d;border-radius:0rem 0rem .9rem .9rem;background-color:var(--red-card);color:var(--text);cursor:pointer;display:flex;justify-content:space-around;flex-direction:row;align-items:center}.total-amount[_ngcontent-%COMP%]{font-size:small;font-weight:400;color:#202020;display:flex;justify-content:center;flex-direction:column}.serving__btn[_ngcontent-%COMP%]{width:100px;height:40px;background-color:#f80;display:flex;align-items:center;justify-content:center;border-radius:5px}.serving__btn[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{outline:none;border:none;background-color:#f80;color:#fff}",
              ],
              data: { animation: [ES, SS] },
            })),
            e
          );
        })(),
        Gg = (() => {
          class e {
            constructor(n) {
              this.router = n;
            }
            canActivate(n, r) {
              const i = localStorage.getItem("token"),
                o = "/diningLogin";
              return r.url !== o && null === i
                ? (this.router.navigate(["/diningLogin"]),
                  localStorage.removeItem("token"),
                  !1)
                : r.url !== o ||
                    null === i ||
                    (this.router.navigate(["/"]), !1);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(st));
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const C5 = [
        {
          path: "",
          canActivate: [Gg],
          component: aU,
          children: [
            { path: "", pathMatch: "full", redirectTo: "viewFoods" },
            { path: "viewFoods", component: z4 },
            { path: "tables", component: c5 },
            { path: "orders", component: _5 },
          ],
        },
        { path: "diningLogin", component: Y4, canActivate: [Gg] },
      ];
      let b5 = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({ imports: [kp.forRoot(C5), kp] })),
            e
          );
        })(),
        w5 = (() => {
          class e {
            constructor() {
              this.title = "dining-app";
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Xt({
              type: e,
              selectors: [["app-root"]],
              decls: 1,
              vars: 0,
              template: function (n, r) {
                1 & n && se(0, "router-outlet");
              },
              dependencies: [Ic],
              styles: ["*[_ngcontent-%COMP%]{margin:0;padding:0}"],
            })),
            e
          );
        })();
      function CT(e) {
        return new v(3e3, !1);
      }
      function Fr(e) {
        switch (e.length) {
          case 0:
            return new ea();
          case 1:
            return e[0];
          default:
            return new DS(e);
        }
      }
      function bT(e, t, n = new Map(), r = new Map()) {
        const i = [],
          o = [];
        let s = -1,
          a = null;
        if (
          (t.forEach((l) => {
            const c = l.get("offset"),
              u = c == s,
              d = (u && a) || new Map();
            l.forEach((f, h) => {
              let p = h,
                g = f;
              if ("offset" !== h)
                switch (((p = e.normalizePropertyName(p, i)), g)) {
                  case "!":
                    g = n.get(h);
                    break;
                  case fr:
                    g = r.get(h);
                    break;
                  default:
                    g = e.normalizeStyleValue(h, p, g, i);
                }
              d.set(p, g);
            }),
              u || o.push(d),
              (a = d),
              (s = c);
          }),
          i.length)
        )
          throw (function q5(e) {
            return new v(3502, !1);
          })();
        return o;
      }
      function Wg(e, t, n, r) {
        switch (t) {
          case "start":
            e.onStart(() => r(n && Kg(n, "start", e)));
            break;
          case "done":
            e.onDone(() => r(n && Kg(n, "done", e)));
            break;
          case "destroy":
            e.onDestroy(() => r(n && Kg(n, "destroy", e)));
        }
      }
      function Kg(e, t, n) {
        const o = Qg(
            e.element,
            e.triggerName,
            e.fromState,
            e.toState,
            t || e.phaseName,
            n.totalTime ?? e.totalTime,
            !!n.disabled
          ),
          s = e._data;
        return null != s && (o._data = s), o;
      }
      function Qg(e, t, n, r, i = "", o = 0, s) {
        return {
          element: e,
          triggerName: t,
          fromState: n,
          toState: r,
          phaseName: i,
          totalTime: o,
          disabled: !!s,
        };
      }
      function Wt(e, t, n) {
        let r = e.get(t);
        return r || e.set(t, (r = n)), r;
      }
      function wT(e) {
        const t = e.indexOf(":");
        return [e.substring(1, t), e.slice(t + 1)];
      }
      const r8 = (() =>
        typeof document > "u" ? null : document.documentElement)();
      function Zg(e) {
        const t = e.parentNode || e.host || null;
        return t === r8 ? null : t;
      }
      let yi = null,
        DT = !1;
      function ET(e, t) {
        for (; t; ) {
          if (t === e) return !0;
          t = Zg(t);
        }
        return !1;
      }
      function ST(e, t, n) {
        if (n) return Array.from(e.querySelectorAll(t));
        const r = e.querySelector(t);
        return r ? [r] : [];
      }
      let MT = (() => {
          class e {
            validateStyleProperty(n) {
              return (function o8(e) {
                yi ||
                  ((yi =
                    (function s8() {
                      return typeof document < "u" ? document.body : null;
                    })() || {}),
                  (DT = !!yi.style && "WebkitAppearance" in yi.style));
                let t = !0;
                return (
                  yi.style &&
                    !(function i8(e) {
                      return "ebkit" == e.substring(1, 6);
                    })(e) &&
                    ((t = e in yi.style),
                    !t &&
                      DT &&
                      (t =
                        "Webkit" + e.charAt(0).toUpperCase() + e.slice(1) in
                        yi.style)),
                  t
                );
              })(n);
            }
            matchesElement(n, r) {
              return !1;
            }
            containsElement(n, r) {
              return ET(n, r);
            }
            getParentElement(n) {
              return Zg(n);
            }
            query(n, r, i) {
              return ST(n, r, i);
            }
            computeStyle(n, r, i) {
              return i || "";
            }
            animate(n, r, i, o, s, a = [], l) {
              return new ea(i, o);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Yg = (() => {
          class e {}
          return (e.NOOP = new MT()), e;
        })();
      const a8 = 1e3,
        Xg = "ng-enter",
        yu = "ng-leave",
        vu = "ng-trigger",
        _u = ".ng-trigger",
        AT = "ng-animating",
        Jg = ".ng-animating";
      function hr(e) {
        if ("number" == typeof e) return e;
        const t = e.match(/^(-?[\.\d]+)(m?s)/);
        return !t || t.length < 2 ? 0 : em(parseFloat(t[1]), t[2]);
      }
      function em(e, t) {
        return "s" === t ? e * a8 : e;
      }
      function Cu(e, t, n) {
        return e.hasOwnProperty("duration")
          ? e
          : (function c8(e, t, n) {
              let i,
                o = 0,
                s = "";
              if ("string" == typeof e) {
                const a = e.match(
                  /^(-?[\.\d]+)(m?s)(?:\s+(-?[\.\d]+)(m?s))?(?:\s+([-a-z]+(?:\(.+?\))?))?$/i
                );
                if (null === a)
                  return t.push(CT()), { duration: 0, delay: 0, easing: "" };
                i = em(parseFloat(a[1]), a[2]);
                const l = a[3];
                null != l && (o = em(parseFloat(l), a[4]));
                const c = a[5];
                c && (s = c);
              } else i = e;
              if (!n) {
                let a = !1,
                  l = t.length;
                i < 0 &&
                  (t.push(
                    (function D5() {
                      return new v(3100, !1);
                    })()
                  ),
                  (a = !0)),
                  o < 0 &&
                    (t.push(
                      (function E5() {
                        return new v(3101, !1);
                      })()
                    ),
                    (a = !0)),
                  a && t.splice(l, 0, CT());
              }
              return { duration: i, delay: o, easing: s };
            })(e, t, n);
      }
      function ya(e, t = {}) {
        return (
          Object.keys(e).forEach((n) => {
            t[n] = e[n];
          }),
          t
        );
      }
      function IT(e) {
        const t = new Map();
        return (
          Object.keys(e).forEach((n) => {
            t.set(n, e[n]);
          }),
          t
        );
      }
      function kr(e, t = new Map(), n) {
        if (n) for (let [r, i] of n) t.set(r, i);
        for (let [r, i] of e) t.set(r, i);
        return t;
      }
      function qn(e, t, n) {
        t.forEach((r, i) => {
          const o = nm(i);
          n && !n.has(i) && n.set(i, e.style[o]), (e.style[o] = r);
        });
      }
      function vi(e, t) {
        t.forEach((n, r) => {
          const i = nm(r);
          e.style[i] = "";
        });
      }
      function va(e) {
        return Array.isArray(e) ? (1 == e.length ? e[0] : CS(e)) : e;
      }
      const tm = new RegExp("{{\\s*(.+?)\\s*}}", "g");
      function OT(e) {
        let t = [];
        if ("string" == typeof e) {
          let n;
          for (; (n = tm.exec(e)); ) t.push(n[1]);
          tm.lastIndex = 0;
        }
        return t;
      }
      function _a(e, t, n) {
        const r = e.toString(),
          i = r.replace(tm, (o, s) => {
            let a = t[s];
            return (
              null == a &&
                (n.push(
                  (function M5(e) {
                    return new v(3003, !1);
                  })()
                ),
                (a = "")),
              a.toString()
            );
          });
        return i == r ? e : i;
      }
      function bu(e) {
        const t = [];
        let n = e.next();
        for (; !n.done; ) t.push(n.value), (n = e.next());
        return t;
      }
      const f8 = /-+([a-z0-9])/g;
      function nm(e) {
        return e.replace(f8, (...t) => t[1].toUpperCase());
      }
      function Kt(e, t, n) {
        switch (t.type) {
          case 7:
            return e.visitTrigger(t, n);
          case 0:
            return e.visitState(t, n);
          case 1:
            return e.visitTransition(t, n);
          case 2:
            return e.visitSequence(t, n);
          case 3:
            return e.visitGroup(t, n);
          case 4:
            return e.visitAnimate(t, n);
          case 5:
            return e.visitKeyframes(t, n);
          case 6:
            return e.visitStyle(t, n);
          case 8:
            return e.visitReference(t, n);
          case 9:
            return e.visitAnimateChild(t, n);
          case 10:
            return e.visitAnimateRef(t, n);
          case 11:
            return e.visitQuery(t, n);
          case 12:
            return e.visitStagger(t, n);
          default:
            throw (function T5(e) {
              return new v(3004, !1);
            })();
        }
      }
      function NT(e, t) {
        return window.getComputedStyle(e)[t];
      }
      const wu = "*";
      function g8(e, t) {
        const n = [];
        return (
          "string" == typeof e
            ? e.split(/\s*,\s*/).forEach((r) =>
                (function m8(e, t, n) {
                  if (":" == e[0]) {
                    const l = (function y8(e, t) {
                      switch (e) {
                        case ":enter":
                          return "void => *";
                        case ":leave":
                          return "* => void";
                        case ":increment":
                          return (n, r) => parseFloat(r) > parseFloat(n);
                        case ":decrement":
                          return (n, r) => parseFloat(r) < parseFloat(n);
                        default:
                          return (
                            t.push(
                              (function H5(e) {
                                return new v(3016, !1);
                              })()
                            ),
                            "* => *"
                          );
                      }
                    })(e, n);
                    if ("function" == typeof l) return void t.push(l);
                    e = l;
                  }
                  const r = e.match(/^(\*|[-\w]+)\s*(<?[=-]>)\s*(\*|[-\w]+)$/);
                  if (null == r || r.length < 4)
                    return (
                      n.push(
                        (function j5(e) {
                          return new v(3015, !1);
                        })()
                      ),
                      t
                    );
                  const i = r[1],
                    o = r[2],
                    s = r[3];
                  t.push(RT(i, s));
                  "<" == o[0] && !(i == wu && s == wu) && t.push(RT(s, i));
                })(r, n, t)
              )
            : n.push(e),
          n
        );
      }
      const Du = new Set(["true", "1"]),
        Eu = new Set(["false", "0"]);
      function RT(e, t) {
        const n = Du.has(e) || Eu.has(e),
          r = Du.has(t) || Eu.has(t);
        return (i, o) => {
          let s = e == wu || e == i,
            a = t == wu || t == o;
          return (
            !s && n && "boolean" == typeof i && (s = i ? Du.has(e) : Eu.has(e)),
            !a && r && "boolean" == typeof o && (a = o ? Du.has(t) : Eu.has(t)),
            s && a
          );
        };
      }
      const v8 = new RegExp("s*:selfs*,?", "g");
      function rm(e, t, n, r) {
        return new _8(e).build(t, n, r);
      }
      class _8 {
        constructor(t) {
          this._driver = t;
        }
        build(t, n, r) {
          const i = new w8(n);
          return this._resetContextStyleTimingState(i), Kt(this, va(t), i);
        }
        _resetContextStyleTimingState(t) {
          (t.currentQuerySelector = ""),
            (t.collectedStyles = new Map()),
            t.collectedStyles.set("", new Map()),
            (t.currentTime = 0);
        }
        visitTrigger(t, n) {
          let r = (n.queryCount = 0),
            i = (n.depCount = 0);
          const o = [],
            s = [];
          return (
            "@" == t.name.charAt(0) &&
              n.errors.push(
                (function I5() {
                  return new v(3006, !1);
                })()
              ),
            t.definitions.forEach((a) => {
              if ((this._resetContextStyleTimingState(n), 0 == a.type)) {
                const l = a,
                  c = l.name;
                c
                  .toString()
                  .split(/\s*,\s*/)
                  .forEach((u) => {
                    (l.name = u), o.push(this.visitState(l, n));
                  }),
                  (l.name = c);
              } else if (1 == a.type) {
                const l = this.visitTransition(a, n);
                (r += l.queryCount), (i += l.depCount), s.push(l);
              } else
                n.errors.push(
                  (function x5() {
                    return new v(3007, !1);
                  })()
                );
            }),
            {
              type: 7,
              name: t.name,
              states: o,
              transitions: s,
              queryCount: r,
              depCount: i,
              options: null,
            }
          );
        }
        visitState(t, n) {
          const r = this.visitStyle(t.styles, n),
            i = (t.options && t.options.params) || null;
          if (r.containsDynamicStyles) {
            const o = new Set(),
              s = i || {};
            r.styles.forEach((a) => {
              a instanceof Map &&
                a.forEach((l) => {
                  OT(l).forEach((c) => {
                    s.hasOwnProperty(c) || o.add(c);
                  });
                });
            }),
              o.size &&
                (bu(o.values()),
                n.errors.push(
                  (function O5(e, t) {
                    return new v(3008, !1);
                  })()
                ));
          }
          return {
            type: 0,
            name: t.name,
            style: r,
            options: i ? { params: i } : null,
          };
        }
        visitTransition(t, n) {
          (n.queryCount = 0), (n.depCount = 0);
          const r = Kt(this, va(t.animation), n);
          return {
            type: 1,
            matchers: g8(t.expr, n.errors),
            animation: r,
            queryCount: n.queryCount,
            depCount: n.depCount,
            options: _i(t.options),
          };
        }
        visitSequence(t, n) {
          return {
            type: 2,
            steps: t.steps.map((r) => Kt(this, r, n)),
            options: _i(t.options),
          };
        }
        visitGroup(t, n) {
          const r = n.currentTime;
          let i = 0;
          const o = t.steps.map((s) => {
            n.currentTime = r;
            const a = Kt(this, s, n);
            return (i = Math.max(i, n.currentTime)), a;
          });
          return (
            (n.currentTime = i), { type: 3, steps: o, options: _i(t.options) }
          );
        }
        visitAnimate(t, n) {
          const r = (function E8(e, t) {
            if (e.hasOwnProperty("duration")) return e;
            if ("number" == typeof e) return im(Cu(e, t).duration, 0, "");
            const n = e;
            if (
              n
                .split(/\s+/)
                .some((o) => "{" == o.charAt(0) && "{" == o.charAt(1))
            ) {
              const o = im(0, 0, "");
              return (o.dynamic = !0), (o.strValue = n), o;
            }
            const i = Cu(n, t);
            return im(i.duration, i.delay, i.easing);
          })(t.timings, n.errors);
          n.currentAnimateTimings = r;
          let i,
            o = t.styles ? t.styles : Nt({});
          if (5 == o.type) i = this.visitKeyframes(o, n);
          else {
            let s = t.styles,
              a = !1;
            if (!s) {
              a = !0;
              const c = {};
              r.easing && (c.easing = r.easing), (s = Nt(c));
            }
            n.currentTime += r.duration + r.delay;
            const l = this.visitStyle(s, n);
            (l.isEmptyStep = a), (i = l);
          }
          return (
            (n.currentAnimateTimings = null),
            { type: 4, timings: r, style: i, options: null }
          );
        }
        visitStyle(t, n) {
          const r = this._makeStyleAst(t, n);
          return this._validateStyleAst(r, n), r;
        }
        _makeStyleAst(t, n) {
          const r = [],
            i = Array.isArray(t.styles) ? t.styles : [t.styles];
          for (let a of i)
            "string" == typeof a
              ? a === fr
                ? r.push(a)
                : n.errors.push(new v(3002, !1))
              : r.push(IT(a));
          let o = !1,
            s = null;
          return (
            r.forEach((a) => {
              if (
                a instanceof Map &&
                (a.has("easing") && ((s = a.get("easing")), a.delete("easing")),
                !o)
              )
                for (let l of a.values())
                  if (l.toString().indexOf("{{") >= 0) {
                    o = !0;
                    break;
                  }
            }),
            {
              type: 6,
              styles: r,
              easing: s,
              offset: t.offset,
              containsDynamicStyles: o,
              options: null,
            }
          );
        }
        _validateStyleAst(t, n) {
          const r = n.currentAnimateTimings;
          let i = n.currentTime,
            o = n.currentTime;
          r && o > 0 && (o -= r.duration + r.delay),
            t.styles.forEach((s) => {
              "string" != typeof s &&
                s.forEach((a, l) => {
                  const c = n.collectedStyles.get(n.currentQuerySelector),
                    u = c.get(l);
                  let d = !0;
                  u &&
                    (o != i &&
                      o >= u.startTime &&
                      i <= u.endTime &&
                      (n.errors.push(
                        (function R5(e, t, n, r, i) {
                          return new v(3010, !1);
                        })()
                      ),
                      (d = !1)),
                    (o = u.startTime)),
                    d && c.set(l, { startTime: o, endTime: i }),
                    n.options &&
                      (function d8(e, t, n) {
                        const r = t.params || {},
                          i = OT(e);
                        i.length &&
                          i.forEach((o) => {
                            r.hasOwnProperty(o) ||
                              n.push(
                                (function S5(e) {
                                  return new v(3001, !1);
                                })()
                              );
                          });
                      })(a, n.options, n.errors);
                });
            });
        }
        visitKeyframes(t, n) {
          const r = { type: 5, styles: [], options: null };
          if (!n.currentAnimateTimings)
            return (
              n.errors.push(
                (function P5() {
                  return new v(3011, !1);
                })()
              ),
              r
            );
          let o = 0;
          const s = [];
          let a = !1,
            l = !1,
            c = 0;
          const u = t.steps.map((_) => {
            const y = this._makeStyleAst(_, n);
            let I =
                null != y.offset
                  ? y.offset
                  : (function D8(e) {
                      if ("string" == typeof e) return null;
                      let t = null;
                      if (Array.isArray(e))
                        e.forEach((n) => {
                          if (n instanceof Map && n.has("offset")) {
                            const r = n;
                            (t = parseFloat(r.get("offset"))),
                              r.delete("offset");
                          }
                        });
                      else if (e instanceof Map && e.has("offset")) {
                        const n = e;
                        (t = parseFloat(n.get("offset"))), n.delete("offset");
                      }
                      return t;
                    })(y.styles),
              P = 0;
            return (
              null != I && (o++, (P = y.offset = I)),
              (l = l || P < 0 || P > 1),
              (a = a || P < c),
              (c = P),
              s.push(P),
              y
            );
          });
          l &&
            n.errors.push(
              (function F5() {
                return new v(3012, !1);
              })()
            ),
            a &&
              n.errors.push(
                (function k5() {
                  return new v(3200, !1);
                })()
              );
          const d = t.steps.length;
          let f = 0;
          o > 0 && o < d
            ? n.errors.push(
                (function L5() {
                  return new v(3202, !1);
                })()
              )
            : 0 == o && (f = 1 / (d - 1));
          const h = d - 1,
            p = n.currentTime,
            g = n.currentAnimateTimings,
            m = g.duration;
          return (
            u.forEach((_, y) => {
              const I = f > 0 ? (y == h ? 1 : f * y) : s[y],
                P = I * m;
              (n.currentTime = p + g.delay + P),
                (g.duration = P),
                this._validateStyleAst(_, n),
                (_.offset = I),
                r.styles.push(_);
            }),
            r
          );
        }
        visitReference(t, n) {
          return {
            type: 8,
            animation: Kt(this, va(t.animation), n),
            options: _i(t.options),
          };
        }
        visitAnimateChild(t, n) {
          return n.depCount++, { type: 9, options: _i(t.options) };
        }
        visitAnimateRef(t, n) {
          return {
            type: 10,
            animation: this.visitReference(t.animation, n),
            options: _i(t.options),
          };
        }
        visitQuery(t, n) {
          const r = n.currentQuerySelector,
            i = t.options || {};
          n.queryCount++, (n.currentQuery = t);
          const [o, s] = (function C8(e) {
            const t = !!e.split(/\s*,\s*/).find((n) => ":self" == n);
            return (
              t && (e = e.replace(v8, "")),
              (e = e
                .replace(/@\*/g, _u)
                .replace(/@\w+/g, (n) => _u + "-" + n.slice(1))
                .replace(/:animating/g, Jg)),
              [e, t]
            );
          })(t.selector);
          (n.currentQuerySelector = r.length ? r + " " + o : o),
            Wt(n.collectedStyles, n.currentQuerySelector, new Map());
          const a = Kt(this, va(t.animation), n);
          return (
            (n.currentQuery = null),
            (n.currentQuerySelector = r),
            {
              type: 11,
              selector: o,
              limit: i.limit || 0,
              optional: !!i.optional,
              includeSelf: s,
              animation: a,
              originalSelector: t.selector,
              options: _i(t.options),
            }
          );
        }
        visitStagger(t, n) {
          n.currentQuery ||
            n.errors.push(
              (function V5() {
                return new v(3013, !1);
              })()
            );
          const r =
            "full" === t.timings
              ? { duration: 0, delay: 0, easing: "full" }
              : Cu(t.timings, n.errors, !0);
          return {
            type: 12,
            animation: Kt(this, va(t.animation), n),
            timings: r,
            options: null,
          };
        }
      }
      class w8 {
        constructor(t) {
          (this.errors = t),
            (this.queryCount = 0),
            (this.depCount = 0),
            (this.currentTransition = null),
            (this.currentQuery = null),
            (this.currentQuerySelector = null),
            (this.currentAnimateTimings = null),
            (this.currentTime = 0),
            (this.collectedStyles = new Map()),
            (this.options = null),
            (this.unsupportedCSSPropertiesFound = new Set());
        }
      }
      function _i(e) {
        return (
          e
            ? (e = ya(e)).params &&
              (e.params = (function b8(e) {
                return e ? ya(e) : null;
              })(e.params))
            : (e = {}),
          e
        );
      }
      function im(e, t, n) {
        return { duration: e, delay: t, easing: n };
      }
      function om(e, t, n, r, i, o, s = null, a = !1) {
        return {
          type: 1,
          element: e,
          keyframes: t,
          preStyleProps: n,
          postStyleProps: r,
          duration: i,
          delay: o,
          totalTime: i + o,
          easing: s,
          subTimeline: a,
        };
      }
      class Su {
        constructor() {
          this._map = new Map();
        }
        get(t) {
          return this._map.get(t) || [];
        }
        append(t, n) {
          let r = this._map.get(t);
          r || this._map.set(t, (r = [])), r.push(...n);
        }
        has(t) {
          return this._map.has(t);
        }
        clear() {
          this._map.clear();
        }
      }
      const T8 = new RegExp(":enter", "g"),
        I8 = new RegExp(":leave", "g");
      function sm(e, t, n, r, i, o = new Map(), s = new Map(), a, l, c = []) {
        return new x8().buildKeyframes(e, t, n, r, i, o, s, a, l, c);
      }
      class x8 {
        buildKeyframes(t, n, r, i, o, s, a, l, c, u = []) {
          c = c || new Su();
          const d = new am(t, n, c, i, o, u, []);
          d.options = l;
          const f = l.delay ? hr(l.delay) : 0;
          d.currentTimeline.delayNextStep(f),
            d.currentTimeline.setStyles([s], null, d.errors, l),
            Kt(this, r, d);
          const h = d.timelines.filter((p) => p.containsAnimation());
          if (h.length && a.size) {
            let p;
            for (let g = h.length - 1; g >= 0; g--) {
              const m = h[g];
              if (m.element === n) {
                p = m;
                break;
              }
            }
            p &&
              !p.allowOnlyTimelineStyles() &&
              p.setStyles([a], null, d.errors, l);
          }
          return h.length
            ? h.map((p) => p.buildKeyframes())
            : [om(n, [], [], [], 0, f, "", !1)];
        }
        visitTrigger(t, n) {}
        visitState(t, n) {}
        visitTransition(t, n) {}
        visitAnimateChild(t, n) {
          const r = n.subInstructions.get(n.element);
          if (r) {
            const i = n.createSubContext(t.options),
              o = n.currentTimeline.currentTime,
              s = this._visitSubInstructions(r, i, i.options);
            o != s && n.transformIntoNewTimeline(s);
          }
          n.previousNode = t;
        }
        visitAnimateRef(t, n) {
          const r = n.createSubContext(t.options);
          r.transformIntoNewTimeline(),
            this._applyAnimationRefDelays(
              [t.options, t.animation.options],
              n,
              r
            ),
            this.visitReference(t.animation, r),
            n.transformIntoNewTimeline(r.currentTimeline.currentTime),
            (n.previousNode = t);
        }
        _applyAnimationRefDelays(t, n, r) {
          for (const i of t) {
            const o = i?.delay;
            if (o) {
              const s =
                "number" == typeof o ? o : hr(_a(o, i?.params ?? {}, n.errors));
              r.delayNextStep(s);
            }
          }
        }
        _visitSubInstructions(t, n, r) {
          let o = n.currentTimeline.currentTime;
          const s = null != r.duration ? hr(r.duration) : null,
            a = null != r.delay ? hr(r.delay) : null;
          return (
            0 !== s &&
              t.forEach((l) => {
                const c = n.appendInstructionToTimeline(l, s, a);
                o = Math.max(o, c.duration + c.delay);
              }),
            o
          );
        }
        visitReference(t, n) {
          n.updateOptions(t.options, !0),
            Kt(this, t.animation, n),
            (n.previousNode = t);
        }
        visitSequence(t, n) {
          const r = n.subContextCount;
          let i = n;
          const o = t.options;
          if (
            o &&
            (o.params || o.delay) &&
            ((i = n.createSubContext(o)),
            i.transformIntoNewTimeline(),
            null != o.delay)
          ) {
            6 == i.previousNode.type &&
              (i.currentTimeline.snapshotCurrentStyles(),
              (i.previousNode = Mu));
            const s = hr(o.delay);
            i.delayNextStep(s);
          }
          t.steps.length &&
            (t.steps.forEach((s) => Kt(this, s, i)),
            i.currentTimeline.applyStylesToKeyframe(),
            i.subContextCount > r && i.transformIntoNewTimeline()),
            (n.previousNode = t);
        }
        visitGroup(t, n) {
          const r = [];
          let i = n.currentTimeline.currentTime;
          const o = t.options && t.options.delay ? hr(t.options.delay) : 0;
          t.steps.forEach((s) => {
            const a = n.createSubContext(t.options);
            o && a.delayNextStep(o),
              Kt(this, s, a),
              (i = Math.max(i, a.currentTimeline.currentTime)),
              r.push(a.currentTimeline);
          }),
            r.forEach((s) => n.currentTimeline.mergeTimelineCollectedStyles(s)),
            n.transformIntoNewTimeline(i),
            (n.previousNode = t);
        }
        _visitTiming(t, n) {
          if (t.dynamic) {
            const r = t.strValue;
            return Cu(n.params ? _a(r, n.params, n.errors) : r, n.errors);
          }
          return { duration: t.duration, delay: t.delay, easing: t.easing };
        }
        visitAnimate(t, n) {
          const r = (n.currentAnimateTimings = this._visitTiming(t.timings, n)),
            i = n.currentTimeline;
          r.delay && (n.incrementTime(r.delay), i.snapshotCurrentStyles());
          const o = t.style;
          5 == o.type
            ? this.visitKeyframes(o, n)
            : (n.incrementTime(r.duration),
              this.visitStyle(o, n),
              i.applyStylesToKeyframe()),
            (n.currentAnimateTimings = null),
            (n.previousNode = t);
        }
        visitStyle(t, n) {
          const r = n.currentTimeline,
            i = n.currentAnimateTimings;
          !i && r.hasCurrentStyleProperties() && r.forwardFrame();
          const o = (i && i.easing) || t.easing;
          t.isEmptyStep
            ? r.applyEmptyStep(o)
            : r.setStyles(t.styles, o, n.errors, n.options),
            (n.previousNode = t);
        }
        visitKeyframes(t, n) {
          const r = n.currentAnimateTimings,
            i = n.currentTimeline.duration,
            o = r.duration,
            a = n.createSubContext().currentTimeline;
          (a.easing = r.easing),
            t.styles.forEach((l) => {
              a.forwardTime((l.offset || 0) * o),
                a.setStyles(l.styles, l.easing, n.errors, n.options),
                a.applyStylesToKeyframe();
            }),
            n.currentTimeline.mergeTimelineCollectedStyles(a),
            n.transformIntoNewTimeline(i + o),
            (n.previousNode = t);
        }
        visitQuery(t, n) {
          const r = n.currentTimeline.currentTime,
            i = t.options || {},
            o = i.delay ? hr(i.delay) : 0;
          o &&
            (6 === n.previousNode.type ||
              (0 == r && n.currentTimeline.hasCurrentStyleProperties())) &&
            (n.currentTimeline.snapshotCurrentStyles(), (n.previousNode = Mu));
          let s = r;
          const a = n.invokeQuery(
            t.selector,
            t.originalSelector,
            t.limit,
            t.includeSelf,
            !!i.optional,
            n.errors
          );
          n.currentQueryTotal = a.length;
          let l = null;
          a.forEach((c, u) => {
            n.currentQueryIndex = u;
            const d = n.createSubContext(t.options, c);
            o && d.delayNextStep(o),
              c === n.element && (l = d.currentTimeline),
              Kt(this, t.animation, d),
              d.currentTimeline.applyStylesToKeyframe(),
              (s = Math.max(s, d.currentTimeline.currentTime));
          }),
            (n.currentQueryIndex = 0),
            (n.currentQueryTotal = 0),
            n.transformIntoNewTimeline(s),
            l &&
              (n.currentTimeline.mergeTimelineCollectedStyles(l),
              n.currentTimeline.snapshotCurrentStyles()),
            (n.previousNode = t);
        }
        visitStagger(t, n) {
          const r = n.parentContext,
            i = n.currentTimeline,
            o = t.timings,
            s = Math.abs(o.duration),
            a = s * (n.currentQueryTotal - 1);
          let l = s * n.currentQueryIndex;
          switch (o.duration < 0 ? "reverse" : o.easing) {
            case "reverse":
              l = a - l;
              break;
            case "full":
              l = r.currentStaggerTime;
          }
          const u = n.currentTimeline;
          l && u.delayNextStep(l);
          const d = u.currentTime;
          Kt(this, t.animation, n),
            (n.previousNode = t),
            (r.currentStaggerTime =
              i.currentTime - d + (i.startTime - r.currentTimeline.startTime));
        }
      }
      const Mu = {};
      class am {
        constructor(t, n, r, i, o, s, a, l) {
          (this._driver = t),
            (this.element = n),
            (this.subInstructions = r),
            (this._enterClassName = i),
            (this._leaveClassName = o),
            (this.errors = s),
            (this.timelines = a),
            (this.parentContext = null),
            (this.currentAnimateTimings = null),
            (this.previousNode = Mu),
            (this.subContextCount = 0),
            (this.options = {}),
            (this.currentQueryIndex = 0),
            (this.currentQueryTotal = 0),
            (this.currentStaggerTime = 0),
            (this.currentTimeline = l || new Tu(this._driver, n, 0)),
            a.push(this.currentTimeline);
        }
        get params() {
          return this.options.params;
        }
        updateOptions(t, n) {
          if (!t) return;
          const r = t;
          let i = this.options;
          null != r.duration && (i.duration = hr(r.duration)),
            null != r.delay && (i.delay = hr(r.delay));
          const o = r.params;
          if (o) {
            let s = i.params;
            s || (s = this.options.params = {}),
              Object.keys(o).forEach((a) => {
                (!n || !s.hasOwnProperty(a)) &&
                  (s[a] = _a(o[a], s, this.errors));
              });
          }
        }
        _copyOptions() {
          const t = {};
          if (this.options) {
            const n = this.options.params;
            if (n) {
              const r = (t.params = {});
              Object.keys(n).forEach((i) => {
                r[i] = n[i];
              });
            }
          }
          return t;
        }
        createSubContext(t = null, n, r) {
          const i = n || this.element,
            o = new am(
              this._driver,
              i,
              this.subInstructions,
              this._enterClassName,
              this._leaveClassName,
              this.errors,
              this.timelines,
              this.currentTimeline.fork(i, r || 0)
            );
          return (
            (o.previousNode = this.previousNode),
            (o.currentAnimateTimings = this.currentAnimateTimings),
            (o.options = this._copyOptions()),
            o.updateOptions(t),
            (o.currentQueryIndex = this.currentQueryIndex),
            (o.currentQueryTotal = this.currentQueryTotal),
            (o.parentContext = this),
            this.subContextCount++,
            o
          );
        }
        transformIntoNewTimeline(t) {
          return (
            (this.previousNode = Mu),
            (this.currentTimeline = this.currentTimeline.fork(this.element, t)),
            this.timelines.push(this.currentTimeline),
            this.currentTimeline
          );
        }
        appendInstructionToTimeline(t, n, r) {
          const i = {
              duration: n ?? t.duration,
              delay: this.currentTimeline.currentTime + (r ?? 0) + t.delay,
              easing: "",
            },
            o = new O8(
              this._driver,
              t.element,
              t.keyframes,
              t.preStyleProps,
              t.postStyleProps,
              i,
              t.stretchStartingKeyframe
            );
          return this.timelines.push(o), i;
        }
        incrementTime(t) {
          this.currentTimeline.forwardTime(this.currentTimeline.duration + t);
        }
        delayNextStep(t) {
          t > 0 && this.currentTimeline.delayNextStep(t);
        }
        invokeQuery(t, n, r, i, o, s) {
          let a = [];
          if ((i && a.push(this.element), t.length > 0)) {
            t = (t = t.replace(T8, "." + this._enterClassName)).replace(
              I8,
              "." + this._leaveClassName
            );
            let c = this._driver.query(this.element, t, 1 != r);
            0 !== r &&
              (c = r < 0 ? c.slice(c.length + r, c.length) : c.slice(0, r)),
              a.push(...c);
          }
          return (
            !o &&
              0 == a.length &&
              s.push(
                (function B5(e) {
                  return new v(3014, !1);
                })()
              ),
            a
          );
        }
      }
      class Tu {
        constructor(t, n, r, i) {
          (this._driver = t),
            (this.element = n),
            (this.startTime = r),
            (this._elementTimelineStylesLookup = i),
            (this.duration = 0),
            (this.easing = null),
            (this._previousKeyframe = new Map()),
            (this._currentKeyframe = new Map()),
            (this._keyframes = new Map()),
            (this._styleSummary = new Map()),
            (this._localTimelineStyles = new Map()),
            (this._pendingStyles = new Map()),
            (this._backFill = new Map()),
            (this._currentEmptyStepKeyframe = null),
            this._elementTimelineStylesLookup ||
              (this._elementTimelineStylesLookup = new Map()),
            (this._globalTimelineStyles =
              this._elementTimelineStylesLookup.get(n)),
            this._globalTimelineStyles ||
              ((this._globalTimelineStyles = this._localTimelineStyles),
              this._elementTimelineStylesLookup.set(
                n,
                this._localTimelineStyles
              )),
            this._loadKeyframe();
        }
        containsAnimation() {
          switch (this._keyframes.size) {
            case 0:
              return !1;
            case 1:
              return this.hasCurrentStyleProperties();
            default:
              return !0;
          }
        }
        hasCurrentStyleProperties() {
          return this._currentKeyframe.size > 0;
        }
        get currentTime() {
          return this.startTime + this.duration;
        }
        delayNextStep(t) {
          const n = 1 === this._keyframes.size && this._pendingStyles.size;
          this.duration || n
            ? (this.forwardTime(this.currentTime + t),
              n && this.snapshotCurrentStyles())
            : (this.startTime += t);
        }
        fork(t, n) {
          return (
            this.applyStylesToKeyframe(),
            new Tu(
              this._driver,
              t,
              n || this.currentTime,
              this._elementTimelineStylesLookup
            )
          );
        }
        _loadKeyframe() {
          this._currentKeyframe &&
            (this._previousKeyframe = this._currentKeyframe),
            (this._currentKeyframe = this._keyframes.get(this.duration)),
            this._currentKeyframe ||
              ((this._currentKeyframe = new Map()),
              this._keyframes.set(this.duration, this._currentKeyframe));
        }
        forwardFrame() {
          (this.duration += 1), this._loadKeyframe();
        }
        forwardTime(t) {
          this.applyStylesToKeyframe(),
            (this.duration = t),
            this._loadKeyframe();
        }
        _updateStyle(t, n) {
          this._localTimelineStyles.set(t, n),
            this._globalTimelineStyles.set(t, n),
            this._styleSummary.set(t, { time: this.currentTime, value: n });
        }
        allowOnlyTimelineStyles() {
          return this._currentEmptyStepKeyframe !== this._currentKeyframe;
        }
        applyEmptyStep(t) {
          t && this._previousKeyframe.set("easing", t);
          for (let [n, r] of this._globalTimelineStyles)
            this._backFill.set(n, r || fr), this._currentKeyframe.set(n, fr);
          this._currentEmptyStepKeyframe = this._currentKeyframe;
        }
        setStyles(t, n, r, i) {
          n && this._previousKeyframe.set("easing", n);
          const o = (i && i.params) || {},
            s = (function N8(e, t) {
              const n = new Map();
              let r;
              return (
                e.forEach((i) => {
                  if ("*" === i) {
                    r = r || t.keys();
                    for (let o of r) n.set(o, fr);
                  } else kr(i, n);
                }),
                n
              );
            })(t, this._globalTimelineStyles);
          for (let [a, l] of s) {
            const c = _a(l, o, r);
            this._pendingStyles.set(a, c),
              this._localTimelineStyles.has(a) ||
                this._backFill.set(a, this._globalTimelineStyles.get(a) ?? fr),
              this._updateStyle(a, c);
          }
        }
        applyStylesToKeyframe() {
          0 != this._pendingStyles.size &&
            (this._pendingStyles.forEach((t, n) => {
              this._currentKeyframe.set(n, t);
            }),
            this._pendingStyles.clear(),
            this._localTimelineStyles.forEach((t, n) => {
              this._currentKeyframe.has(n) || this._currentKeyframe.set(n, t);
            }));
        }
        snapshotCurrentStyles() {
          for (let [t, n] of this._localTimelineStyles)
            this._pendingStyles.set(t, n), this._updateStyle(t, n);
        }
        getFinalKeyframe() {
          return this._keyframes.get(this.duration);
        }
        get properties() {
          const t = [];
          for (let n in this._currentKeyframe) t.push(n);
          return t;
        }
        mergeTimelineCollectedStyles(t) {
          t._styleSummary.forEach((n, r) => {
            const i = this._styleSummary.get(r);
            (!i || n.time > i.time) && this._updateStyle(r, n.value);
          });
        }
        buildKeyframes() {
          this.applyStylesToKeyframe();
          const t = new Set(),
            n = new Set(),
            r = 1 === this._keyframes.size && 0 === this.duration;
          let i = [];
          this._keyframes.forEach((a, l) => {
            const c = kr(a, new Map(), this._backFill);
            c.forEach((u, d) => {
              "!" === u ? t.add(d) : u === fr && n.add(d);
            }),
              r || c.set("offset", l / this.duration),
              i.push(c);
          });
          const o = t.size ? bu(t.values()) : [],
            s = n.size ? bu(n.values()) : [];
          if (r) {
            const a = i[0],
              l = new Map(a);
            a.set("offset", 0), l.set("offset", 1), (i = [a, l]);
          }
          return om(
            this.element,
            i,
            o,
            s,
            this.duration,
            this.startTime,
            this.easing,
            !1
          );
        }
      }
      class O8 extends Tu {
        constructor(t, n, r, i, o, s, a = !1) {
          super(t, n, s.delay),
            (this.keyframes = r),
            (this.preStyleProps = i),
            (this.postStyleProps = o),
            (this._stretchStartingKeyframe = a),
            (this.timings = {
              duration: s.duration,
              delay: s.delay,
              easing: s.easing,
            });
        }
        containsAnimation() {
          return this.keyframes.length > 1;
        }
        buildKeyframes() {
          let t = this.keyframes,
            { delay: n, duration: r, easing: i } = this.timings;
          if (this._stretchStartingKeyframe && n) {
            const o = [],
              s = r + n,
              a = n / s,
              l = kr(t[0]);
            l.set("offset", 0), o.push(l);
            const c = kr(t[0]);
            c.set("offset", kT(a)), o.push(c);
            const u = t.length - 1;
            for (let d = 1; d <= u; d++) {
              let f = kr(t[d]);
              const h = f.get("offset");
              f.set("offset", kT((n + h * r) / s)), o.push(f);
            }
            (r = s), (n = 0), (i = ""), (t = o);
          }
          return om(
            this.element,
            t,
            this.preStyleProps,
            this.postStyleProps,
            r,
            n,
            i,
            !0
          );
        }
      }
      function kT(e, t = 3) {
        const n = Math.pow(10, t - 1);
        return Math.round(e * n) / n;
      }
      class lm {}
      const R8 = new Set([
        "width",
        "height",
        "minWidth",
        "minHeight",
        "maxWidth",
        "maxHeight",
        "left",
        "top",
        "bottom",
        "right",
        "fontSize",
        "outlineWidth",
        "outlineOffset",
        "paddingTop",
        "paddingLeft",
        "paddingBottom",
        "paddingRight",
        "marginTop",
        "marginLeft",
        "marginBottom",
        "marginRight",
        "borderRadius",
        "borderWidth",
        "borderTopWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "textIndent",
        "perspective",
      ]);
      class P8 extends lm {
        normalizePropertyName(t, n) {
          return nm(t);
        }
        normalizeStyleValue(t, n, r, i) {
          let o = "";
          const s = r.toString().trim();
          if (R8.has(n) && 0 !== r && "0" !== r)
            if ("number" == typeof r) o = "px";
            else {
              const a = r.match(/^[+-]?[\d\.]+([a-z]*)$/);
              a &&
                0 == a[1].length &&
                i.push(
                  (function A5(e, t) {
                    return new v(3005, !1);
                  })()
                );
            }
          return s + o;
        }
      }
      function LT(e, t, n, r, i, o, s, a, l, c, u, d, f) {
        return {
          type: 0,
          element: e,
          triggerName: t,
          isRemovalTransition: i,
          fromState: n,
          fromStyles: o,
          toState: r,
          toStyles: s,
          timelines: a,
          queriedElements: l,
          preStyleProps: c,
          postStyleProps: u,
          totalTime: d,
          errors: f,
        };
      }
      const cm = {};
      class VT {
        constructor(t, n, r) {
          (this._triggerName = t), (this.ast = n), (this._stateStyles = r);
        }
        match(t, n, r, i) {
          return (function F8(e, t, n, r, i) {
            return e.some((o) => o(t, n, r, i));
          })(this.ast.matchers, t, n, r, i);
        }
        buildStyles(t, n, r) {
          let i = this._stateStyles.get("*");
          return (
            void 0 !== t && (i = this._stateStyles.get(t?.toString()) || i),
            i ? i.buildStyles(n, r) : new Map()
          );
        }
        build(t, n, r, i, o, s, a, l, c, u) {
          const d = [],
            f = (this.ast.options && this.ast.options.params) || cm,
            p = this.buildStyles(r, (a && a.params) || cm, d),
            g = (l && l.params) || cm,
            m = this.buildStyles(i, g, d),
            _ = new Set(),
            y = new Map(),
            I = new Map(),
            P = "void" === i,
            L = { params: k8(g, f), delay: this.ast.options?.delay },
            he = u ? [] : sm(t, n, this.ast.animation, o, s, p, m, L, c, d);
          let Ge = 0;
          if (
            (he.forEach((En) => {
              Ge = Math.max(En.duration + En.delay, Ge);
            }),
            d.length)
          )
            return LT(n, this._triggerName, r, i, P, p, m, [], [], y, I, Ge, d);
          he.forEach((En) => {
            const gr = En.element,
              hA = Wt(y, gr, new Set());
            En.preStyleProps.forEach((Ci) => hA.add(Ci));
            const ba = Wt(I, gr, new Set());
            En.postStyleProps.forEach((Ci) => ba.add(Ci)),
              gr !== n && _.add(gr);
          });
          const Dn = bu(_.values());
          return LT(n, this._triggerName, r, i, P, p, m, he, Dn, y, I, Ge);
        }
      }
      function k8(e, t) {
        const n = ya(t);
        for (const r in e) e.hasOwnProperty(r) && null != e[r] && (n[r] = e[r]);
        return n;
      }
      class L8 {
        constructor(t, n, r) {
          (this.styles = t), (this.defaultParams = n), (this.normalizer = r);
        }
        buildStyles(t, n) {
          const r = new Map(),
            i = ya(this.defaultParams);
          return (
            Object.keys(t).forEach((o) => {
              const s = t[o];
              null !== s && (i[o] = s);
            }),
            this.styles.styles.forEach((o) => {
              "string" != typeof o &&
                o.forEach((s, a) => {
                  s && (s = _a(s, i, n));
                  const l = this.normalizer.normalizePropertyName(a, n);
                  (s = this.normalizer.normalizeStyleValue(a, l, s, n)),
                    r.set(a, s);
                });
            }),
            r
          );
        }
      }
      class B8 {
        constructor(t, n, r) {
          (this.name = t),
            (this.ast = n),
            (this._normalizer = r),
            (this.transitionFactories = []),
            (this.states = new Map()),
            n.states.forEach((i) => {
              this.states.set(
                i.name,
                new L8(i.style, (i.options && i.options.params) || {}, r)
              );
            }),
            BT(this.states, "true", "1"),
            BT(this.states, "false", "0"),
            n.transitions.forEach((i) => {
              this.transitionFactories.push(new VT(t, i, this.states));
            }),
            (this.fallbackTransition = (function j8(e, t, n) {
              return new VT(
                e,
                {
                  type: 1,
                  animation: { type: 2, steps: [], options: null },
                  matchers: [(s, a) => !0],
                  options: null,
                  queryCount: 0,
                  depCount: 0,
                },
                t
              );
            })(t, this.states));
        }
        get containsQueries() {
          return this.ast.queryCount > 0;
        }
        matchTransition(t, n, r, i) {
          return (
            this.transitionFactories.find((s) => s.match(t, n, r, i)) || null
          );
        }
        matchStyles(t, n, r) {
          return this.fallbackTransition.buildStyles(t, n, r);
        }
      }
      function BT(e, t, n) {
        e.has(t)
          ? e.has(n) || e.set(n, e.get(t))
          : e.has(n) && e.set(t, e.get(n));
      }
      const H8 = new Su();
      class U8 {
        constructor(t, n, r) {
          (this.bodyNode = t),
            (this._driver = n),
            (this._normalizer = r),
            (this._animations = new Map()),
            (this._playersById = new Map()),
            (this.players = []);
        }
        register(t, n) {
          const r = [],
            o = rm(this._driver, n, r, []);
          if (r.length)
            throw (function G5(e) {
              return new v(3503, !1);
            })();
          this._animations.set(t, o);
        }
        _buildPlayer(t, n, r) {
          const i = t.element,
            o = bT(this._normalizer, t.keyframes, n, r);
          return this._driver.animate(
            i,
            o,
            t.duration,
            t.delay,
            t.easing,
            [],
            !0
          );
        }
        create(t, n, r = {}) {
          const i = [],
            o = this._animations.get(t);
          let s;
          const a = new Map();
          if (
            (o
              ? ((s = sm(
                  this._driver,
                  n,
                  o,
                  Xg,
                  yu,
                  new Map(),
                  new Map(),
                  r,
                  H8,
                  i
                )),
                s.forEach((u) => {
                  const d = Wt(a, u.element, new Map());
                  u.postStyleProps.forEach((f) => d.set(f, null));
                }))
              : (i.push(
                  (function W5() {
                    return new v(3300, !1);
                  })()
                ),
                (s = [])),
            i.length)
          )
            throw (function K5(e) {
              return new v(3504, !1);
            })();
          a.forEach((u, d) => {
            u.forEach((f, h) => {
              u.set(h, this._driver.computeStyle(d, h, fr));
            });
          });
          const c = Fr(
            s.map((u) => {
              const d = a.get(u.element);
              return this._buildPlayer(u, new Map(), d);
            })
          );
          return (
            this._playersById.set(t, c),
            c.onDestroy(() => this.destroy(t)),
            this.players.push(c),
            c
          );
        }
        destroy(t) {
          const n = this._getPlayer(t);
          n.destroy(), this._playersById.delete(t);
          const r = this.players.indexOf(n);
          r >= 0 && this.players.splice(r, 1);
        }
        _getPlayer(t) {
          const n = this._playersById.get(t);
          if (!n)
            throw (function Q5(e) {
              return new v(3301, !1);
            })();
          return n;
        }
        listen(t, n, r, i) {
          const o = Qg(n, "", "", "");
          return Wg(this._getPlayer(t), r, o, i), () => {};
        }
        command(t, n, r, i) {
          if ("register" == r) return void this.register(t, i[0]);
          if ("create" == r) return void this.create(t, n, i[0] || {});
          const o = this._getPlayer(t);
          switch (r) {
            case "play":
              o.play();
              break;
            case "pause":
              o.pause();
              break;
            case "reset":
              o.reset();
              break;
            case "restart":
              o.restart();
              break;
            case "finish":
              o.finish();
              break;
            case "init":
              o.init();
              break;
            case "setPosition":
              o.setPosition(parseFloat(i[0]));
              break;
            case "destroy":
              this.destroy(t);
          }
        }
      }
      const jT = "ng-animate-queued",
        um = "ng-animate-disabled",
        W8 = [],
        HT = {
          namespaceId: "",
          setForRemoval: !1,
          setForMove: !1,
          hasAnimation: !1,
          removedBeforeQueried: !1,
        },
        K8 = {
          namespaceId: "",
          setForMove: !1,
          setForRemoval: !1,
          hasAnimation: !1,
          removedBeforeQueried: !0,
        },
        ln = "__ng_removed";
      class dm {
        get params() {
          return this.options.params;
        }
        constructor(t, n = "") {
          this.namespaceId = n;
          const r = t && t.hasOwnProperty("value");
          if (
            ((this.value = (function X8(e) {
              return e ?? null;
            })(r ? t.value : t)),
            r)
          ) {
            const o = ya(t);
            delete o.value, (this.options = o);
          } else this.options = {};
          this.options.params || (this.options.params = {});
        }
        absorbOptions(t) {
          const n = t.params;
          if (n) {
            const r = this.options.params;
            Object.keys(n).forEach((i) => {
              null == r[i] && (r[i] = n[i]);
            });
          }
        }
      }
      const Ca = "void",
        fm = new dm(Ca);
      class Q8 {
        constructor(t, n, r) {
          (this.id = t),
            (this.hostElement = n),
            (this._engine = r),
            (this.players = []),
            (this._triggers = new Map()),
            (this._queue = []),
            (this._elementListeners = new Map()),
            (this._hostClassName = "ng-tns-" + t),
            cn(n, this._hostClassName);
        }
        listen(t, n, r, i) {
          if (!this._triggers.has(n))
            throw (function Z5(e, t) {
              return new v(3302, !1);
            })();
          if (null == r || 0 == r.length)
            throw (function Y5(e) {
              return new v(3303, !1);
            })();
          if (
            !(function J8(e) {
              return "start" == e || "done" == e;
            })(r)
          )
            throw (function X5(e, t) {
              return new v(3400, !1);
            })();
          const o = Wt(this._elementListeners, t, []),
            s = { name: n, phase: r, callback: i };
          o.push(s);
          const a = Wt(this._engine.statesByElement, t, new Map());
          return (
            a.has(n) || (cn(t, vu), cn(t, vu + "-" + n), a.set(n, fm)),
            () => {
              this._engine.afterFlush(() => {
                const l = o.indexOf(s);
                l >= 0 && o.splice(l, 1), this._triggers.has(n) || a.delete(n);
              });
            }
          );
        }
        register(t, n) {
          return !this._triggers.has(t) && (this._triggers.set(t, n), !0);
        }
        _getTrigger(t) {
          const n = this._triggers.get(t);
          if (!n)
            throw (function J5(e) {
              return new v(3401, !1);
            })();
          return n;
        }
        trigger(t, n, r, i = !0) {
          const o = this._getTrigger(n),
            s = new hm(this.id, n, t);
          let a = this._engine.statesByElement.get(t);
          a ||
            (cn(t, vu),
            cn(t, vu + "-" + n),
            this._engine.statesByElement.set(t, (a = new Map())));
          let l = a.get(n);
          const c = new dm(r, this.id);
          if (
            (!(r && r.hasOwnProperty("value")) &&
              l &&
              c.absorbOptions(l.options),
            a.set(n, c),
            l || (l = fm),
            c.value !== Ca && l.value === c.value)
          ) {
            if (
              !(function nz(e, t) {
                const n = Object.keys(e),
                  r = Object.keys(t);
                if (n.length != r.length) return !1;
                for (let i = 0; i < n.length; i++) {
                  const o = n[i];
                  if (!t.hasOwnProperty(o) || e[o] !== t[o]) return !1;
                }
                return !0;
              })(l.params, c.params)
            ) {
              const g = [],
                m = o.matchStyles(l.value, l.params, g),
                _ = o.matchStyles(c.value, c.params, g);
              g.length
                ? this._engine.reportError(g)
                : this._engine.afterFlush(() => {
                    vi(t, m), qn(t, _);
                  });
            }
            return;
          }
          const f = Wt(this._engine.playersByElement, t, []);
          f.forEach((g) => {
            g.namespaceId == this.id &&
              g.triggerName == n &&
              g.queued &&
              g.destroy();
          });
          let h = o.matchTransition(l.value, c.value, t, c.params),
            p = !1;
          if (!h) {
            if (!i) return;
            (h = o.fallbackTransition), (p = !0);
          }
          return (
            this._engine.totalQueuedPlayers++,
            this._queue.push({
              element: t,
              triggerName: n,
              transition: h,
              fromState: l,
              toState: c,
              player: s,
              isFallbackTransition: p,
            }),
            p ||
              (cn(t, jT),
              s.onStart(() => {
                Io(t, jT);
              })),
            s.onDone(() => {
              let g = this.players.indexOf(s);
              g >= 0 && this.players.splice(g, 1);
              const m = this._engine.playersByElement.get(t);
              if (m) {
                let _ = m.indexOf(s);
                _ >= 0 && m.splice(_, 1);
              }
            }),
            this.players.push(s),
            f.push(s),
            s
          );
        }
        deregister(t) {
          this._triggers.delete(t),
            this._engine.statesByElement.forEach((n) => n.delete(t)),
            this._elementListeners.forEach((n, r) => {
              this._elementListeners.set(
                r,
                n.filter((i) => i.name != t)
              );
            });
        }
        clearElementCache(t) {
          this._engine.statesByElement.delete(t),
            this._elementListeners.delete(t);
          const n = this._engine.playersByElement.get(t);
          n &&
            (n.forEach((r) => r.destroy()),
            this._engine.playersByElement.delete(t));
        }
        _signalRemovalForInnerTriggers(t, n) {
          const r = this._engine.driver.query(t, _u, !0);
          r.forEach((i) => {
            if (i[ln]) return;
            const o = this._engine.fetchNamespacesByElement(i);
            o.size
              ? o.forEach((s) => s.triggerLeaveAnimation(i, n, !1, !0))
              : this.clearElementCache(i);
          }),
            this._engine.afterFlushAnimationsDone(() =>
              r.forEach((i) => this.clearElementCache(i))
            );
        }
        triggerLeaveAnimation(t, n, r, i) {
          const o = this._engine.statesByElement.get(t),
            s = new Map();
          if (o) {
            const a = [];
            if (
              (o.forEach((l, c) => {
                if ((s.set(c, l.value), this._triggers.has(c))) {
                  const u = this.trigger(t, c, Ca, i);
                  u && a.push(u);
                }
              }),
              a.length)
            )
              return (
                this._engine.markElementAsRemoved(this.id, t, !0, n, s),
                r && Fr(a).onDone(() => this._engine.processLeaveNode(t)),
                !0
              );
          }
          return !1;
        }
        prepareLeaveAnimationListeners(t) {
          const n = this._elementListeners.get(t),
            r = this._engine.statesByElement.get(t);
          if (n && r) {
            const i = new Set();
            n.forEach((o) => {
              const s = o.name;
              if (i.has(s)) return;
              i.add(s);
              const l = this._triggers.get(s).fallbackTransition,
                c = r.get(s) || fm,
                u = new dm(Ca),
                d = new hm(this.id, s, t);
              this._engine.totalQueuedPlayers++,
                this._queue.push({
                  element: t,
                  triggerName: s,
                  transition: l,
                  fromState: c,
                  toState: u,
                  player: d,
                  isFallbackTransition: !0,
                });
            });
          }
        }
        removeNode(t, n) {
          const r = this._engine;
          if (
            (t.childElementCount && this._signalRemovalForInnerTriggers(t, n),
            this.triggerLeaveAnimation(t, n, !0))
          )
            return;
          let i = !1;
          if (r.totalAnimations) {
            const o = r.players.length ? r.playersByQueriedElement.get(t) : [];
            if (o && o.length) i = !0;
            else {
              let s = t;
              for (; (s = s.parentNode); )
                if (r.statesByElement.get(s)) {
                  i = !0;
                  break;
                }
            }
          }
          if ((this.prepareLeaveAnimationListeners(t), i))
            r.markElementAsRemoved(this.id, t, !1, n);
          else {
            const o = t[ln];
            (!o || o === HT) &&
              (r.afterFlush(() => this.clearElementCache(t)),
              r.destroyInnerAnimations(t),
              r._onRemovalComplete(t, n));
          }
        }
        insertNode(t, n) {
          cn(t, this._hostClassName);
        }
        drainQueuedTransitions(t) {
          const n = [];
          return (
            this._queue.forEach((r) => {
              const i = r.player;
              if (i.destroyed) return;
              const o = r.element,
                s = this._elementListeners.get(o);
              s &&
                s.forEach((a) => {
                  if (a.name == r.triggerName) {
                    const l = Qg(
                      o,
                      r.triggerName,
                      r.fromState.value,
                      r.toState.value
                    );
                    (l._data = t), Wg(r.player, a.phase, l, a.callback);
                  }
                }),
                i.markedForDestroy
                  ? this._engine.afterFlush(() => {
                      i.destroy();
                    })
                  : n.push(r);
            }),
            (this._queue = []),
            n.sort((r, i) => {
              const o = r.transition.ast.depCount,
                s = i.transition.ast.depCount;
              return 0 == o || 0 == s
                ? o - s
                : this._engine.driver.containsElement(r.element, i.element)
                ? 1
                : -1;
            })
          );
        }
        destroy(t) {
          this.players.forEach((n) => n.destroy()),
            this._signalRemovalForInnerTriggers(this.hostElement, t);
        }
        elementContainsData(t) {
          let n = !1;
          return (
            this._elementListeners.has(t) && (n = !0),
            (n = !!this._queue.find((r) => r.element === t) || n),
            n
          );
        }
      }
      class Z8 {
        _onRemovalComplete(t, n) {
          this.onRemovalComplete(t, n);
        }
        constructor(t, n, r) {
          (this.bodyNode = t),
            (this.driver = n),
            (this._normalizer = r),
            (this.players = []),
            (this.newHostElements = new Map()),
            (this.playersByElement = new Map()),
            (this.playersByQueriedElement = new Map()),
            (this.statesByElement = new Map()),
            (this.disabledNodes = new Set()),
            (this.totalAnimations = 0),
            (this.totalQueuedPlayers = 0),
            (this._namespaceLookup = {}),
            (this._namespaceList = []),
            (this._flushFns = []),
            (this._whenQuietFns = []),
            (this.namespacesByHostElement = new Map()),
            (this.collectedEnterElements = []),
            (this.collectedLeaveElements = []),
            (this.onRemovalComplete = (i, o) => {});
        }
        get queuedPlayers() {
          const t = [];
          return (
            this._namespaceList.forEach((n) => {
              n.players.forEach((r) => {
                r.queued && t.push(r);
              });
            }),
            t
          );
        }
        createNamespace(t, n) {
          const r = new Q8(t, n, this);
          return (
            this.bodyNode && this.driver.containsElement(this.bodyNode, n)
              ? this._balanceNamespaceList(r, n)
              : (this.newHostElements.set(n, r), this.collectEnterElement(n)),
            (this._namespaceLookup[t] = r)
          );
        }
        _balanceNamespaceList(t, n) {
          const r = this._namespaceList,
            i = this.namespacesByHostElement;
          if (r.length - 1 >= 0) {
            let s = !1,
              a = this.driver.getParentElement(n);
            for (; a; ) {
              const l = i.get(a);
              if (l) {
                const c = r.indexOf(l);
                r.splice(c + 1, 0, t), (s = !0);
                break;
              }
              a = this.driver.getParentElement(a);
            }
            s || r.unshift(t);
          } else r.push(t);
          return i.set(n, t), t;
        }
        register(t, n) {
          let r = this._namespaceLookup[t];
          return r || (r = this.createNamespace(t, n)), r;
        }
        registerTrigger(t, n, r) {
          let i = this._namespaceLookup[t];
          i && i.register(n, r) && this.totalAnimations++;
        }
        destroy(t, n) {
          if (!t) return;
          const r = this._fetchNamespace(t);
          this.afterFlush(() => {
            this.namespacesByHostElement.delete(r.hostElement),
              delete this._namespaceLookup[t];
            const i = this._namespaceList.indexOf(r);
            i >= 0 && this._namespaceList.splice(i, 1);
          }),
            this.afterFlushAnimationsDone(() => r.destroy(n));
        }
        _fetchNamespace(t) {
          return this._namespaceLookup[t];
        }
        fetchNamespacesByElement(t) {
          const n = new Set(),
            r = this.statesByElement.get(t);
          if (r)
            for (let i of r.values())
              if (i.namespaceId) {
                const o = this._fetchNamespace(i.namespaceId);
                o && n.add(o);
              }
          return n;
        }
        trigger(t, n, r, i) {
          if (Au(n)) {
            const o = this._fetchNamespace(t);
            if (o) return o.trigger(n, r, i), !0;
          }
          return !1;
        }
        insertNode(t, n, r, i) {
          if (!Au(n)) return;
          const o = n[ln];
          if (o && o.setForRemoval) {
            (o.setForRemoval = !1), (o.setForMove = !0);
            const s = this.collectedLeaveElements.indexOf(n);
            s >= 0 && this.collectedLeaveElements.splice(s, 1);
          }
          if (t) {
            const s = this._fetchNamespace(t);
            s && s.insertNode(n, r);
          }
          i && this.collectEnterElement(n);
        }
        collectEnterElement(t) {
          this.collectedEnterElements.push(t);
        }
        markElementAsDisabled(t, n) {
          n
            ? this.disabledNodes.has(t) ||
              (this.disabledNodes.add(t), cn(t, um))
            : this.disabledNodes.has(t) &&
              (this.disabledNodes.delete(t), Io(t, um));
        }
        removeNode(t, n, r) {
          if (Au(n)) {
            const i = t ? this._fetchNamespace(t) : null;
            i ? i.removeNode(n, r) : this.markElementAsRemoved(t, n, !1, r);
            const o = this.namespacesByHostElement.get(n);
            o && o.id !== t && o.removeNode(n, r);
          } else this._onRemovalComplete(n, r);
        }
        markElementAsRemoved(t, n, r, i, o) {
          this.collectedLeaveElements.push(n),
            (n[ln] = {
              namespaceId: t,
              setForRemoval: i,
              hasAnimation: r,
              removedBeforeQueried: !1,
              previousTriggersValues: o,
            });
        }
        listen(t, n, r, i, o) {
          return Au(n) ? this._fetchNamespace(t).listen(n, r, i, o) : () => {};
        }
        _buildInstruction(t, n, r, i, o) {
          return t.transition.build(
            this.driver,
            t.element,
            t.fromState.value,
            t.toState.value,
            r,
            i,
            t.fromState.options,
            t.toState.options,
            n,
            o
          );
        }
        destroyInnerAnimations(t) {
          let n = this.driver.query(t, _u, !0);
          n.forEach((r) => this.destroyActiveAnimationsForElement(r)),
            0 != this.playersByQueriedElement.size &&
              ((n = this.driver.query(t, Jg, !0)),
              n.forEach((r) => this.finishActiveQueriedAnimationOnElement(r)));
        }
        destroyActiveAnimationsForElement(t) {
          const n = this.playersByElement.get(t);
          n &&
            n.forEach((r) => {
              r.queued ? (r.markedForDestroy = !0) : r.destroy();
            });
        }
        finishActiveQueriedAnimationOnElement(t) {
          const n = this.playersByQueriedElement.get(t);
          n && n.forEach((r) => r.finish());
        }
        whenRenderingDone() {
          return new Promise((t) => {
            if (this.players.length) return Fr(this.players).onDone(() => t());
            t();
          });
        }
        processLeaveNode(t) {
          const n = t[ln];
          if (n && n.setForRemoval) {
            if (((t[ln] = HT), n.namespaceId)) {
              this.destroyInnerAnimations(t);
              const r = this._fetchNamespace(n.namespaceId);
              r && r.clearElementCache(t);
            }
            this._onRemovalComplete(t, n.setForRemoval);
          }
          t.classList?.contains(um) && this.markElementAsDisabled(t, !1),
            this.driver.query(t, ".ng-animate-disabled", !0).forEach((r) => {
              this.markElementAsDisabled(r, !1);
            });
        }
        flush(t = -1) {
          let n = [];
          if (
            (this.newHostElements.size &&
              (this.newHostElements.forEach((r, i) =>
                this._balanceNamespaceList(r, i)
              ),
              this.newHostElements.clear()),
            this.totalAnimations && this.collectedEnterElements.length)
          )
            for (let r = 0; r < this.collectedEnterElements.length; r++)
              cn(this.collectedEnterElements[r], "ng-star-inserted");
          if (
            this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)
          ) {
            const r = [];
            try {
              n = this._flushAnimations(r, t);
            } finally {
              for (let i = 0; i < r.length; i++) r[i]();
            }
          } else
            for (let r = 0; r < this.collectedLeaveElements.length; r++)
              this.processLeaveNode(this.collectedLeaveElements[r]);
          if (
            ((this.totalQueuedPlayers = 0),
            (this.collectedEnterElements.length = 0),
            (this.collectedLeaveElements.length = 0),
            this._flushFns.forEach((r) => r()),
            (this._flushFns = []),
            this._whenQuietFns.length)
          ) {
            const r = this._whenQuietFns;
            (this._whenQuietFns = []),
              n.length
                ? Fr(n).onDone(() => {
                    r.forEach((i) => i());
                  })
                : r.forEach((i) => i());
          }
        }
        reportError(t) {
          throw (function e8(e) {
            return new v(3402, !1);
          })();
        }
        _flushAnimations(t, n) {
          const r = new Su(),
            i = [],
            o = new Map(),
            s = [],
            a = new Map(),
            l = new Map(),
            c = new Map(),
            u = new Set();
          this.disabledNodes.forEach((k) => {
            u.add(k);
            const V = this.driver.query(k, ".ng-animate-queued", !0);
            for (let q = 0; q < V.length; q++) u.add(V[q]);
          });
          const d = this.bodyNode,
            f = Array.from(this.statesByElement.keys()),
            h = zT(f, this.collectedEnterElements),
            p = new Map();
          let g = 0;
          h.forEach((k, V) => {
            const q = Xg + g++;
            p.set(V, q), k.forEach((ae) => cn(ae, q));
          });
          const m = [],
            _ = new Set(),
            y = new Set();
          for (let k = 0; k < this.collectedLeaveElements.length; k++) {
            const V = this.collectedLeaveElements[k],
              q = V[ln];
            q &&
              q.setForRemoval &&
              (m.push(V),
              _.add(V),
              q.hasAnimation
                ? this.driver
                    .query(V, ".ng-star-inserted", !0)
                    .forEach((ae) => _.add(ae))
                : y.add(V));
          }
          const I = new Map(),
            P = zT(f, Array.from(_));
          P.forEach((k, V) => {
            const q = yu + g++;
            I.set(V, q), k.forEach((ae) => cn(ae, q));
          }),
            t.push(() => {
              h.forEach((k, V) => {
                const q = p.get(V);
                k.forEach((ae) => Io(ae, q));
              }),
                P.forEach((k, V) => {
                  const q = I.get(V);
                  k.forEach((ae) => Io(ae, q));
                }),
                m.forEach((k) => {
                  this.processLeaveNode(k);
                });
            });
          const L = [],
            he = [];
          for (let k = this._namespaceList.length - 1; k >= 0; k--)
            this._namespaceList[k].drainQueuedTransitions(n).forEach((q) => {
              const ae = q.player,
                it = q.element;
              if ((L.push(ae), this.collectedEnterElements.length)) {
                const pt = it[ln];
                if (pt && pt.setForMove) {
                  if (
                    pt.previousTriggersValues &&
                    pt.previousTriggersValues.has(q.triggerName)
                  ) {
                    const bi = pt.previousTriggersValues.get(q.triggerName),
                      un = this.statesByElement.get(q.element);
                    if (un && un.has(q.triggerName)) {
                      const Ru = un.get(q.triggerName);
                      (Ru.value = bi), un.set(q.triggerName, Ru);
                    }
                  }
                  return void ae.destroy();
                }
              }
              const Gn = !d || !this.driver.containsElement(d, it),
                Qt = I.get(it),
                Lr = p.get(it),
                Ne = this._buildInstruction(q, r, Lr, Qt, Gn);
              if (Ne.errors && Ne.errors.length) return void he.push(Ne);
              if (Gn)
                return (
                  ae.onStart(() => vi(it, Ne.fromStyles)),
                  ae.onDestroy(() => qn(it, Ne.toStyles)),
                  void i.push(ae)
                );
              if (q.isFallbackTransition)
                return (
                  ae.onStart(() => vi(it, Ne.fromStyles)),
                  ae.onDestroy(() => qn(it, Ne.toStyles)),
                  void i.push(ae)
                );
              const mA = [];
              Ne.timelines.forEach((pt) => {
                (pt.stretchStartingKeyframe = !0),
                  this.disabledNodes.has(pt.element) || mA.push(pt);
              }),
                (Ne.timelines = mA),
                r.append(it, Ne.timelines),
                s.push({ instruction: Ne, player: ae, element: it }),
                Ne.queriedElements.forEach((pt) => Wt(a, pt, []).push(ae)),
                Ne.preStyleProps.forEach((pt, bi) => {
                  if (pt.size) {
                    let un = l.get(bi);
                    un || l.set(bi, (un = new Set())),
                      pt.forEach((Ru, wm) => un.add(wm));
                  }
                }),
                Ne.postStyleProps.forEach((pt, bi) => {
                  let un = c.get(bi);
                  un || c.set(bi, (un = new Set())),
                    pt.forEach((Ru, wm) => un.add(wm));
                });
            });
          if (he.length) {
            const k = [];
            he.forEach((V) => {
              k.push(
                (function t8(e, t) {
                  return new v(3505, !1);
                })()
              );
            }),
              L.forEach((V) => V.destroy()),
              this.reportError(k);
          }
          const Ge = new Map(),
            Dn = new Map();
          s.forEach((k) => {
            const V = k.element;
            r.has(V) &&
              (Dn.set(V, V),
              this._beforeAnimationBuild(
                k.player.namespaceId,
                k.instruction,
                Ge
              ));
          }),
            i.forEach((k) => {
              const V = k.element;
              this._getPreviousPlayers(
                V,
                !1,
                k.namespaceId,
                k.triggerName,
                null
              ).forEach((ae) => {
                Wt(Ge, V, []).push(ae), ae.destroy();
              });
            });
          const En = m.filter((k) => GT(k, l, c)),
            gr = new Map();
          $T(gr, this.driver, y, c, fr).forEach((k) => {
            GT(k, l, c) && En.push(k);
          });
          const ba = new Map();
          h.forEach((k, V) => {
            $T(ba, this.driver, new Set(k), l, "!");
          }),
            En.forEach((k) => {
              const V = gr.get(k),
                q = ba.get(k);
              gr.set(
                k,
                new Map([...(V?.entries() ?? []), ...(q?.entries() ?? [])])
              );
            });
          const Ci = [],
            pA = [],
            gA = {};
          s.forEach((k) => {
            const { element: V, player: q, instruction: ae } = k;
            if (r.has(V)) {
              if (u.has(V))
                return (
                  q.onDestroy(() => qn(V, ae.toStyles)),
                  (q.disabled = !0),
                  q.overrideTotalTime(ae.totalTime),
                  void i.push(q)
                );
              let it = gA;
              if (Dn.size > 1) {
                let Qt = V;
                const Lr = [];
                for (; (Qt = Qt.parentNode); ) {
                  const Ne = Dn.get(Qt);
                  if (Ne) {
                    it = Ne;
                    break;
                  }
                  Lr.push(Qt);
                }
                Lr.forEach((Ne) => Dn.set(Ne, it));
              }
              const Gn = this._buildAnimation(q.namespaceId, ae, Ge, o, ba, gr);
              if ((q.setRealPlayer(Gn), it === gA)) Ci.push(q);
              else {
                const Qt = this.playersByElement.get(it);
                Qt && Qt.length && (q.parentPlayer = Fr(Qt)), i.push(q);
              }
            } else
              vi(V, ae.fromStyles),
                q.onDestroy(() => qn(V, ae.toStyles)),
                pA.push(q),
                u.has(V) && i.push(q);
          }),
            pA.forEach((k) => {
              const V = o.get(k.element);
              if (V && V.length) {
                const q = Fr(V);
                k.setRealPlayer(q);
              }
            }),
            i.forEach((k) => {
              k.parentPlayer ? k.syncPlayerEvents(k.parentPlayer) : k.destroy();
            });
          for (let k = 0; k < m.length; k++) {
            const V = m[k],
              q = V[ln];
            if ((Io(V, yu), q && q.hasAnimation)) continue;
            let ae = [];
            if (a.size) {
              let Gn = a.get(V);
              Gn && Gn.length && ae.push(...Gn);
              let Qt = this.driver.query(V, Jg, !0);
              for (let Lr = 0; Lr < Qt.length; Lr++) {
                let Ne = a.get(Qt[Lr]);
                Ne && Ne.length && ae.push(...Ne);
              }
            }
            const it = ae.filter((Gn) => !Gn.destroyed);
            it.length ? ez(this, V, it) : this.processLeaveNode(V);
          }
          return (
            (m.length = 0),
            Ci.forEach((k) => {
              this.players.push(k),
                k.onDone(() => {
                  k.destroy();
                  const V = this.players.indexOf(k);
                  this.players.splice(V, 1);
                }),
                k.play();
            }),
            Ci
          );
        }
        elementContainsData(t, n) {
          let r = !1;
          const i = n[ln];
          return (
            i && i.setForRemoval && (r = !0),
            this.playersByElement.has(n) && (r = !0),
            this.playersByQueriedElement.has(n) && (r = !0),
            this.statesByElement.has(n) && (r = !0),
            this._fetchNamespace(t).elementContainsData(n) || r
          );
        }
        afterFlush(t) {
          this._flushFns.push(t);
        }
        afterFlushAnimationsDone(t) {
          this._whenQuietFns.push(t);
        }
        _getPreviousPlayers(t, n, r, i, o) {
          let s = [];
          if (n) {
            const a = this.playersByQueriedElement.get(t);
            a && (s = a);
          } else {
            const a = this.playersByElement.get(t);
            if (a) {
              const l = !o || o == Ca;
              a.forEach((c) => {
                c.queued || (!l && c.triggerName != i) || s.push(c);
              });
            }
          }
          return (
            (r || i) &&
              (s = s.filter(
                (a) => !((r && r != a.namespaceId) || (i && i != a.triggerName))
              )),
            s
          );
        }
        _beforeAnimationBuild(t, n, r) {
          const o = n.element,
            s = n.isRemovalTransition ? void 0 : t,
            a = n.isRemovalTransition ? void 0 : n.triggerName;
          for (const l of n.timelines) {
            const c = l.element,
              u = c !== o,
              d = Wt(r, c, []);
            this._getPreviousPlayers(c, u, s, a, n.toState).forEach((h) => {
              const p = h.getRealPlayer();
              p.beforeDestroy && p.beforeDestroy(), h.destroy(), d.push(h);
            });
          }
          vi(o, n.fromStyles);
        }
        _buildAnimation(t, n, r, i, o, s) {
          const a = n.triggerName,
            l = n.element,
            c = [],
            u = new Set(),
            d = new Set(),
            f = n.timelines.map((p) => {
              const g = p.element;
              u.add(g);
              const m = g[ln];
              if (m && m.removedBeforeQueried)
                return new ea(p.duration, p.delay);
              const _ = g !== l,
                y = (function tz(e) {
                  const t = [];
                  return qT(e, t), t;
                })((r.get(g) || W8).map((Ge) => Ge.getRealPlayer())).filter(
                  (Ge) => !!Ge.element && Ge.element === g
                ),
                I = o.get(g),
                P = s.get(g),
                L = bT(this._normalizer, p.keyframes, I, P),
                he = this._buildPlayer(p, L, y);
              if ((p.subTimeline && i && d.add(g), _)) {
                const Ge = new hm(t, a, g);
                Ge.setRealPlayer(he), c.push(Ge);
              }
              return he;
            });
          c.forEach((p) => {
            Wt(this.playersByQueriedElement, p.element, []).push(p),
              p.onDone(() =>
                (function Y8(e, t, n) {
                  let r = e.get(t);
                  if (r) {
                    if (r.length) {
                      const i = r.indexOf(n);
                      r.splice(i, 1);
                    }
                    0 == r.length && e.delete(t);
                  }
                  return r;
                })(this.playersByQueriedElement, p.element, p)
              );
          }),
            u.forEach((p) => cn(p, AT));
          const h = Fr(f);
          return (
            h.onDestroy(() => {
              u.forEach((p) => Io(p, AT)), qn(l, n.toStyles);
            }),
            d.forEach((p) => {
              Wt(i, p, []).push(h);
            }),
            h
          );
        }
        _buildPlayer(t, n, r) {
          return n.length > 0
            ? this.driver.animate(
                t.element,
                n,
                t.duration,
                t.delay,
                t.easing,
                r
              )
            : new ea(t.duration, t.delay);
        }
      }
      class hm {
        constructor(t, n, r) {
          (this.namespaceId = t),
            (this.triggerName = n),
            (this.element = r),
            (this._player = new ea()),
            (this._containsRealPlayer = !1),
            (this._queuedCallbacks = new Map()),
            (this.destroyed = !1),
            (this.parentPlayer = null),
            (this.markedForDestroy = !1),
            (this.disabled = !1),
            (this.queued = !0),
            (this.totalTime = 0);
        }
        setRealPlayer(t) {
          this._containsRealPlayer ||
            ((this._player = t),
            this._queuedCallbacks.forEach((n, r) => {
              n.forEach((i) => Wg(t, r, void 0, i));
            }),
            this._queuedCallbacks.clear(),
            (this._containsRealPlayer = !0),
            this.overrideTotalTime(t.totalTime),
            (this.queued = !1));
        }
        getRealPlayer() {
          return this._player;
        }
        overrideTotalTime(t) {
          this.totalTime = t;
        }
        syncPlayerEvents(t) {
          const n = this._player;
          n.triggerCallback && t.onStart(() => n.triggerCallback("start")),
            t.onDone(() => this.finish()),
            t.onDestroy(() => this.destroy());
        }
        _queueEvent(t, n) {
          Wt(this._queuedCallbacks, t, []).push(n);
        }
        onDone(t) {
          this.queued && this._queueEvent("done", t), this._player.onDone(t);
        }
        onStart(t) {
          this.queued && this._queueEvent("start", t), this._player.onStart(t);
        }
        onDestroy(t) {
          this.queued && this._queueEvent("destroy", t),
            this._player.onDestroy(t);
        }
        init() {
          this._player.init();
        }
        hasStarted() {
          return !this.queued && this._player.hasStarted();
        }
        play() {
          !this.queued && this._player.play();
        }
        pause() {
          !this.queued && this._player.pause();
        }
        restart() {
          !this.queued && this._player.restart();
        }
        finish() {
          this._player.finish();
        }
        destroy() {
          (this.destroyed = !0), this._player.destroy();
        }
        reset() {
          !this.queued && this._player.reset();
        }
        setPosition(t) {
          this.queued || this._player.setPosition(t);
        }
        getPosition() {
          return this.queued ? 0 : this._player.getPosition();
        }
        triggerCallback(t) {
          const n = this._player;
          n.triggerCallback && n.triggerCallback(t);
        }
      }
      function Au(e) {
        return e && 1 === e.nodeType;
      }
      function UT(e, t) {
        const n = e.style.display;
        return (e.style.display = t ?? "none"), n;
      }
      function $T(e, t, n, r, i) {
        const o = [];
        n.forEach((l) => o.push(UT(l)));
        const s = [];
        r.forEach((l, c) => {
          const u = new Map();
          l.forEach((d) => {
            const f = t.computeStyle(c, d, i);
            u.set(d, f), (!f || 0 == f.length) && ((c[ln] = K8), s.push(c));
          }),
            e.set(c, u);
        });
        let a = 0;
        return n.forEach((l) => UT(l, o[a++])), s;
      }
      function zT(e, t) {
        const n = new Map();
        if ((e.forEach((a) => n.set(a, [])), 0 == t.length)) return n;
        const i = new Set(t),
          o = new Map();
        function s(a) {
          if (!a) return 1;
          let l = o.get(a);
          if (l) return l;
          const c = a.parentNode;
          return (l = n.has(c) ? c : i.has(c) ? 1 : s(c)), o.set(a, l), l;
        }
        return (
          t.forEach((a) => {
            const l = s(a);
            1 !== l && n.get(l).push(a);
          }),
          n
        );
      }
      function cn(e, t) {
        e.classList?.add(t);
      }
      function Io(e, t) {
        e.classList?.remove(t);
      }
      function ez(e, t, n) {
        Fr(n).onDone(() => e.processLeaveNode(t));
      }
      function qT(e, t) {
        for (let n = 0; n < e.length; n++) {
          const r = e[n];
          r instanceof DS ? qT(r.players, t) : t.push(r);
        }
      }
      function GT(e, t, n) {
        const r = n.get(e);
        if (!r) return !1;
        let i = t.get(e);
        return i ? r.forEach((o) => i.add(o)) : t.set(e, r), n.delete(e), !0;
      }
      class Iu {
        constructor(t, n, r) {
          (this.bodyNode = t),
            (this._driver = n),
            (this._normalizer = r),
            (this._triggerCache = {}),
            (this.onRemovalComplete = (i, o) => {}),
            (this._transitionEngine = new Z8(t, n, r)),
            (this._timelineEngine = new U8(t, n, r)),
            (this._transitionEngine.onRemovalComplete = (i, o) =>
              this.onRemovalComplete(i, o));
        }
        registerTrigger(t, n, r, i, o) {
          const s = t + "-" + i;
          let a = this._triggerCache[s];
          if (!a) {
            const l = [],
              u = rm(this._driver, o, l, []);
            if (l.length)
              throw (function z5(e, t) {
                return new v(3404, !1);
              })();
            (a = (function V8(e, t, n) {
              return new B8(e, t, n);
            })(i, u, this._normalizer)),
              (this._triggerCache[s] = a);
          }
          this._transitionEngine.registerTrigger(n, i, a);
        }
        register(t, n) {
          this._transitionEngine.register(t, n);
        }
        destroy(t, n) {
          this._transitionEngine.destroy(t, n);
        }
        onInsert(t, n, r, i) {
          this._transitionEngine.insertNode(t, n, r, i);
        }
        onRemove(t, n, r) {
          this._transitionEngine.removeNode(t, n, r);
        }
        disableAnimations(t, n) {
          this._transitionEngine.markElementAsDisabled(t, n);
        }
        process(t, n, r, i) {
          if ("@" == r.charAt(0)) {
            const [o, s] = wT(r);
            this._timelineEngine.command(o, n, s, i);
          } else this._transitionEngine.trigger(t, n, r, i);
        }
        listen(t, n, r, i, o) {
          if ("@" == r.charAt(0)) {
            const [s, a] = wT(r);
            return this._timelineEngine.listen(s, n, a, o);
          }
          return this._transitionEngine.listen(t, n, r, i, o);
        }
        flush(t = -1) {
          this._transitionEngine.flush(t);
        }
        get players() {
          return this._transitionEngine.players.concat(
            this._timelineEngine.players
          );
        }
        whenRenderingDone() {
          return this._transitionEngine.whenRenderingDone();
        }
      }
      let iz = (() => {
        class e {
          constructor(n, r, i) {
            (this._element = n),
              (this._startStyles = r),
              (this._endStyles = i),
              (this._state = 0);
            let o = e.initialStylesByElement.get(n);
            o || e.initialStylesByElement.set(n, (o = new Map())),
              (this._initialStyles = o);
          }
          start() {
            this._state < 1 &&
              (this._startStyles &&
                qn(this._element, this._startStyles, this._initialStyles),
              (this._state = 1));
          }
          finish() {
            this.start(),
              this._state < 2 &&
                (qn(this._element, this._initialStyles),
                this._endStyles &&
                  (qn(this._element, this._endStyles),
                  (this._endStyles = null)),
                (this._state = 1));
          }
          destroy() {
            this.finish(),
              this._state < 3 &&
                (e.initialStylesByElement.delete(this._element),
                this._startStyles &&
                  (vi(this._element, this._startStyles),
                  (this._endStyles = null)),
                this._endStyles &&
                  (vi(this._element, this._endStyles),
                  (this._endStyles = null)),
                qn(this._element, this._initialStyles),
                (this._state = 3));
          }
        }
        return (e.initialStylesByElement = new WeakMap()), e;
      })();
      function pm(e) {
        let t = null;
        return (
          e.forEach((n, r) => {
            (function oz(e) {
              return "display" === e || "position" === e;
            })(r) && ((t = t || new Map()), t.set(r, n));
          }),
          t
        );
      }
      class WT {
        constructor(t, n, r, i) {
          (this.element = t),
            (this.keyframes = n),
            (this.options = r),
            (this._specialStyles = i),
            (this._onDoneFns = []),
            (this._onStartFns = []),
            (this._onDestroyFns = []),
            (this._initialized = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._destroyed = !1),
            (this._originalOnDoneFns = []),
            (this._originalOnStartFns = []),
            (this.time = 0),
            (this.parentPlayer = null),
            (this.currentSnapshot = new Map()),
            (this._duration = r.duration),
            (this._delay = r.delay || 0),
            (this.time = this._duration + this._delay);
        }
        _onFinish() {
          this._finished ||
            ((this._finished = !0),
            this._onDoneFns.forEach((t) => t()),
            (this._onDoneFns = []));
        }
        init() {
          this._buildPlayer(), this._preparePlayerBeforeStart();
        }
        _buildPlayer() {
          if (this._initialized) return;
          this._initialized = !0;
          const t = this.keyframes;
          (this.domPlayer = this._triggerWebAnimation(
            this.element,
            t,
            this.options
          )),
            (this._finalKeyframe = t.length ? t[t.length - 1] : new Map()),
            this.domPlayer.addEventListener("finish", () => this._onFinish());
        }
        _preparePlayerBeforeStart() {
          this._delay ? this._resetDomPlayerState() : this.domPlayer.pause();
        }
        _convertKeyframesToObject(t) {
          const n = [];
          return (
            t.forEach((r) => {
              n.push(Object.fromEntries(r));
            }),
            n
          );
        }
        _triggerWebAnimation(t, n, r) {
          return t.animate(this._convertKeyframesToObject(n), r);
        }
        onStart(t) {
          this._originalOnStartFns.push(t), this._onStartFns.push(t);
        }
        onDone(t) {
          this._originalOnDoneFns.push(t), this._onDoneFns.push(t);
        }
        onDestroy(t) {
          this._onDestroyFns.push(t);
        }
        play() {
          this._buildPlayer(),
            this.hasStarted() ||
              (this._onStartFns.forEach((t) => t()),
              (this._onStartFns = []),
              (this._started = !0),
              this._specialStyles && this._specialStyles.start()),
            this.domPlayer.play();
        }
        pause() {
          this.init(), this.domPlayer.pause();
        }
        finish() {
          this.init(),
            this._specialStyles && this._specialStyles.finish(),
            this._onFinish(),
            this.domPlayer.finish();
        }
        reset() {
          this._resetDomPlayerState(),
            (this._destroyed = !1),
            (this._finished = !1),
            (this._started = !1),
            (this._onStartFns = this._originalOnStartFns),
            (this._onDoneFns = this._originalOnDoneFns);
        }
        _resetDomPlayerState() {
          this.domPlayer && this.domPlayer.cancel();
        }
        restart() {
          this.reset(), this.play();
        }
        hasStarted() {
          return this._started;
        }
        destroy() {
          this._destroyed ||
            ((this._destroyed = !0),
            this._resetDomPlayerState(),
            this._onFinish(),
            this._specialStyles && this._specialStyles.destroy(),
            this._onDestroyFns.forEach((t) => t()),
            (this._onDestroyFns = []));
        }
        setPosition(t) {
          void 0 === this.domPlayer && this.init(),
            (this.domPlayer.currentTime = t * this.time);
        }
        getPosition() {
          return this.domPlayer.currentTime / this.time;
        }
        get totalTime() {
          return this._delay + this._duration;
        }
        beforeDestroy() {
          const t = new Map();
          this.hasStarted() &&
            this._finalKeyframe.forEach((r, i) => {
              "offset" !== i &&
                t.set(i, this._finished ? r : NT(this.element, i));
            }),
            (this.currentSnapshot = t);
        }
        triggerCallback(t) {
          const n = "start" === t ? this._onStartFns : this._onDoneFns;
          n.forEach((r) => r()), (n.length = 0);
        }
      }
      class sz {
        validateStyleProperty(t) {
          return !0;
        }
        validateAnimatableStyleProperty(t) {
          return !0;
        }
        matchesElement(t, n) {
          return !1;
        }
        containsElement(t, n) {
          return ET(t, n);
        }
        getParentElement(t) {
          return Zg(t);
        }
        query(t, n, r) {
          return ST(t, n, r);
        }
        computeStyle(t, n, r) {
          return window.getComputedStyle(t)[n];
        }
        animate(t, n, r, i, o, s = []) {
          const l = {
            duration: r,
            delay: i,
            fill: 0 == i ? "both" : "forwards",
          };
          o && (l.easing = o);
          const c = new Map(),
            u = s.filter((h) => h instanceof WT);
          (function h8(e, t) {
            return 0 === e || 0 === t;
          })(r, i) &&
            u.forEach((h) => {
              h.currentSnapshot.forEach((p, g) => c.set(g, p));
            });
          let d = (function u8(e) {
            return e.length
              ? e[0] instanceof Map
                ? e
                : e.map((t) => IT(t))
              : [];
          })(n).map((h) => kr(h));
          d = (function p8(e, t, n) {
            if (n.size && t.length) {
              let r = t[0],
                i = [];
              if (
                (n.forEach((o, s) => {
                  r.has(s) || i.push(s), r.set(s, o);
                }),
                i.length)
              )
                for (let o = 1; o < t.length; o++) {
                  let s = t[o];
                  i.forEach((a) => s.set(a, NT(e, a)));
                }
            }
            return t;
          })(t, d, c);
          const f = (function rz(e, t) {
            let n = null,
              r = null;
            return (
              Array.isArray(t) && t.length
                ? ((n = pm(t[0])), t.length > 1 && (r = pm(t[t.length - 1])))
                : t instanceof Map && (n = pm(t)),
              n || r ? new iz(e, n, r) : null
            );
          })(t, d);
          return new WT(t, d, l, f);
        }
      }
      let az = (() => {
        class e extends _S {
          constructor(n, r) {
            super(),
              (this._nextAnimationId = 0),
              (this._renderer = n.createRenderer(r.body, {
                id: "0",
                encapsulation: Dt.None,
                styles: [],
                data: { animation: [] },
              }));
          }
          build(n) {
            const r = this._nextAnimationId.toString();
            this._nextAnimationId++;
            const i = Array.isArray(n) ? CS(n) : n;
            return (
              KT(this._renderer, null, r, "register", [i]),
              new lz(r, this._renderer)
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(ss), D(et));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class lz extends ZU {
        constructor(t, n) {
          super(), (this._id = t), (this._renderer = n);
        }
        create(t, n) {
          return new cz(this._id, t, n || {}, this._renderer);
        }
      }
      class cz {
        constructor(t, n, r, i) {
          (this.id = t),
            (this.element = n),
            (this._renderer = i),
            (this.parentPlayer = null),
            (this._started = !1),
            (this.totalTime = 0),
            this._command("create", r);
        }
        _listen(t, n) {
          return this._renderer.listen(this.element, `@@${this.id}:${t}`, n);
        }
        _command(t, ...n) {
          return KT(this._renderer, this.element, this.id, t, n);
        }
        onDone(t) {
          this._listen("done", t);
        }
        onStart(t) {
          this._listen("start", t);
        }
        onDestroy(t) {
          this._listen("destroy", t);
        }
        init() {
          this._command("init");
        }
        hasStarted() {
          return this._started;
        }
        play() {
          this._command("play"), (this._started = !0);
        }
        pause() {
          this._command("pause");
        }
        restart() {
          this._command("restart");
        }
        finish() {
          this._command("finish");
        }
        destroy() {
          this._command("destroy");
        }
        reset() {
          this._command("reset"), (this._started = !1);
        }
        setPosition(t) {
          this._command("setPosition", t);
        }
        getPosition() {
          return this._renderer.engine.players[+this.id]?.getPosition() ?? 0;
        }
      }
      function KT(e, t, n, r, i) {
        return e.setProperty(t, `@@${n}:${r}`, i);
      }
      const QT = "@.disabled";
      let uz = (() => {
        class e {
          constructor(n, r, i) {
            (this.delegate = n),
              (this.engine = r),
              (this._zone = i),
              (this._currentId = 0),
              (this._microtaskId = 1),
              (this._animationCallbacksBuffer = []),
              (this._rendererCache = new Map()),
              (this._cdRecurDepth = 0),
              (this.promise = Promise.resolve(0)),
              (r.onRemovalComplete = (o, s) => {
                const a = s?.parentNode(o);
                a && s.removeChild(a, o);
              });
          }
          createRenderer(n, r) {
            const o = this.delegate.createRenderer(n, r);
            if (!(n && r && r.data && r.data.animation)) {
              let u = this._rendererCache.get(o);
              return (
                u ||
                  ((u = new ZT("", o, this.engine, () =>
                    this._rendererCache.delete(o)
                  )),
                  this._rendererCache.set(o, u)),
                u
              );
            }
            const s = r.id,
              a = r.id + "-" + this._currentId;
            this._currentId++, this.engine.register(a, n);
            const l = (u) => {
              Array.isArray(u)
                ? u.forEach(l)
                : this.engine.registerTrigger(s, a, n, u.name, u);
            };
            return r.data.animation.forEach(l), new dz(this, a, o, this.engine);
          }
          begin() {
            this._cdRecurDepth++, this.delegate.begin && this.delegate.begin();
          }
          _scheduleCountTask() {
            this.promise.then(() => {
              this._microtaskId++;
            });
          }
          scheduleListenerCallback(n, r, i) {
            n >= 0 && n < this._microtaskId
              ? this._zone.run(() => r(i))
              : (0 == this._animationCallbacksBuffer.length &&
                  Promise.resolve(null).then(() => {
                    this._zone.run(() => {
                      this._animationCallbacksBuffer.forEach((o) => {
                        const [s, a] = o;
                        s(a);
                      }),
                        (this._animationCallbacksBuffer = []);
                    });
                  }),
                this._animationCallbacksBuffer.push([r, i]));
          }
          end() {
            this._cdRecurDepth--,
              0 == this._cdRecurDepth &&
                this._zone.runOutsideAngular(() => {
                  this._scheduleCountTask(),
                    this.engine.flush(this._microtaskId);
                }),
              this.delegate.end && this.delegate.end();
          }
          whenRenderingDone() {
            return this.engine.whenRenderingDone();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(ss), D(Iu), D(ye));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class ZT {
        constructor(t, n, r, i) {
          (this.namespaceId = t),
            (this.delegate = n),
            (this.engine = r),
            (this._onDestroy = i),
            (this.destroyNode = this.delegate.destroyNode
              ? (o) => n.destroyNode(o)
              : null);
        }
        get data() {
          return this.delegate.data;
        }
        destroy() {
          this.engine.destroy(this.namespaceId, this.delegate),
            this.delegate.destroy(),
            this._onDestroy?.();
        }
        createElement(t, n) {
          return this.delegate.createElement(t, n);
        }
        createComment(t) {
          return this.delegate.createComment(t);
        }
        createText(t) {
          return this.delegate.createText(t);
        }
        appendChild(t, n) {
          this.delegate.appendChild(t, n),
            this.engine.onInsert(this.namespaceId, n, t, !1);
        }
        insertBefore(t, n, r, i = !0) {
          this.delegate.insertBefore(t, n, r),
            this.engine.onInsert(this.namespaceId, n, t, i);
        }
        removeChild(t, n, r) {
          this.engine.onRemove(this.namespaceId, n, this.delegate);
        }
        selectRootElement(t, n) {
          return this.delegate.selectRootElement(t, n);
        }
        parentNode(t) {
          return this.delegate.parentNode(t);
        }
        nextSibling(t) {
          return this.delegate.nextSibling(t);
        }
        setAttribute(t, n, r, i) {
          this.delegate.setAttribute(t, n, r, i);
        }
        removeAttribute(t, n, r) {
          this.delegate.removeAttribute(t, n, r);
        }
        addClass(t, n) {
          this.delegate.addClass(t, n);
        }
        removeClass(t, n) {
          this.delegate.removeClass(t, n);
        }
        setStyle(t, n, r, i) {
          this.delegate.setStyle(t, n, r, i);
        }
        removeStyle(t, n, r) {
          this.delegate.removeStyle(t, n, r);
        }
        setProperty(t, n, r) {
          "@" == n.charAt(0) && n == QT
            ? this.disableAnimations(t, !!r)
            : this.delegate.setProperty(t, n, r);
        }
        setValue(t, n) {
          this.delegate.setValue(t, n);
        }
        listen(t, n, r) {
          return this.delegate.listen(t, n, r);
        }
        disableAnimations(t, n) {
          this.engine.disableAnimations(t, n);
        }
      }
      class dz extends ZT {
        constructor(t, n, r, i, o) {
          super(n, r, i, o), (this.factory = t), (this.namespaceId = n);
        }
        setProperty(t, n, r) {
          "@" == n.charAt(0)
            ? "." == n.charAt(1) && n == QT
              ? this.disableAnimations(t, (r = void 0 === r || !!r))
              : this.engine.process(this.namespaceId, t, n.slice(1), r)
            : this.delegate.setProperty(t, n, r);
        }
        listen(t, n, r) {
          if ("@" == n.charAt(0)) {
            const i = (function fz(e) {
              switch (e) {
                case "body":
                  return document.body;
                case "document":
                  return document;
                case "window":
                  return window;
                default:
                  return e;
              }
            })(t);
            let o = n.slice(1),
              s = "";
            return (
              "@" != o.charAt(0) &&
                ([o, s] = (function hz(e) {
                  const t = e.indexOf(".");
                  return [e.substring(0, t), e.slice(t + 1)];
                })(o)),
              this.engine.listen(this.namespaceId, i, o, s, (a) => {
                this.factory.scheduleListenerCallback(a._data || -1, r, a);
              })
            );
          }
          return this.delegate.listen(t, n, r);
        }
      }
      const YT = [
          { provide: _S, useClass: az },
          {
            provide: lm,
            useFactory: function gz() {
              return new P8();
            },
          },
          {
            provide: Iu,
            useClass: (() => {
              class e extends Iu {
                constructor(n, r, i, o) {
                  super(n.body, r, i);
                }
                ngOnDestroy() {
                  this.flush();
                }
              }
              return (
                (e.ɵfac = function (n) {
                  return new (n || e)(D(et), D(Yg), D(lm), D(ar));
                }),
                (e.ɵprov = O({ token: e, factory: e.ɵfac })),
                e
              );
            })(),
          },
          {
            provide: ss,
            useFactory: function mz(e, t, n) {
              return new uz(e, t, n);
            },
            deps: [lp, Iu, ye],
          },
        ],
        gm = [
          { provide: Yg, useFactory: () => new sz() },
          { provide: C_, useValue: "BrowserAnimations" },
          ...YT,
        ],
        XT = [
          { provide: Yg, useClass: MT },
          { provide: C_, useValue: "NoopAnimations" },
          ...YT,
        ];
      let yz = (() => {
        class e {
          static withConfig(n) {
            return { ngModule: e, providers: n.disableAnimations ? XT : gm };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵmod = Ve({ type: e })),
          (e.ɵinj = Fe({ providers: gm, imports: [mE] })),
          e
        );
      })();
      class pr {
        constructor(t, n, r) {
          (this.kind = t),
            (this.value = n),
            (this.error = r),
            (this.hasValue = "N" === t);
        }
        observe(t) {
          return JT(this, t);
        }
        do(t, n, r) {
          const { kind: i, value: o, error: s } = this;
          return "N" === i ? t?.(o) : "E" === i ? n?.(s) : r?.();
        }
        accept(t, n, r) {
          var i;
          return be(null === (i = t) || void 0 === i ? void 0 : i.next)
            ? this.observe(t)
            : this.do(t, n, r);
        }
        toObservable() {
          const { kind: t, value: n, error: r } = this,
            i = "N" === t ? $(n) : "E" === t ? ho(() => r) : "C" === t ? dn : 0;
          if (!i) throw new TypeError(`Unexpected notification kind ${t}`);
          return i;
        }
        static createNext(t) {
          return new pr("N", t);
        }
        static createError(t) {
          return new pr("E", void 0, t);
        }
        static createComplete() {
          return pr.completeNotification;
        }
      }
      function JT(e, t) {
        var n, r, i;
        const { kind: o, value: s, error: a } = e;
        if ("string" != typeof o)
          throw new TypeError('Invalid notification, missing "kind"');
        "N" === o
          ? null === (n = t.next) || void 0 === n || n.call(t, s)
          : "E" === o
          ? null === (r = t.error) || void 0 === r || r.call(t, a)
          : null === (i = t.complete) || void 0 === i || i.call(t);
      }
      function eA(e, t, n, r) {
        return Me((i, o) => {
          let s;
          t && "function" != typeof t
            ? ({ duration: n, element: s, connector: r } = t)
            : (s = t);
          const a = new Map(),
            l = (p) => {
              a.forEach(p), p(o);
            },
            c = (p) => l((g) => g.error(p));
          let u = 0,
            d = !1;
          const f = new Nm(
            o,
            (p) => {
              try {
                const g = e(p);
                let m = a.get(g);
                if (!m) {
                  a.set(g, (m = r ? r() : new We()));
                  const _ = (function h(p, g) {
                    const m = new ve((_) => {
                      u++;
                      const y = g.subscribe(_);
                      return () => {
                        y.unsubscribe(), 0 == --u && d && f.unsubscribe();
                      };
                    });
                    return (m.key = p), m;
                  })(g, m);
                  if ((o.next(_), n)) {
                    const y = _e(
                      m,
                      () => {
                        m.complete(), y?.unsubscribe();
                      },
                      void 0,
                      void 0,
                      () => a.delete(g)
                    );
                    f.add(at(n(_)).subscribe(y));
                  }
                }
                m.next(s ? s(p) : p);
              } catch (g) {
                c(g);
              }
            },
            () => l((p) => p.complete()),
            c,
            () => a.clear(),
            () => ((d = !0), 0 === u)
          );
          i.subscribe(f);
        });
      }
      function tA(e, t) {
        return t
          ? (n) =>
              n.pipe(
                tA((r, i) => at(e(r, i)).pipe(te((o, s) => t(r, o, i, s))))
              )
          : Me((n, r) => {
              let i = 0,
                o = null,
                s = !1;
              n.subscribe(
                _e(
                  r,
                  (a) => {
                    o ||
                      ((o = _e(r, void 0, () => {
                        (o = null), s && r.complete();
                      })),
                      at(e(a, i++)).subscribe(o));
                  },
                  () => {
                    (s = !0), !o && r.complete();
                  }
                )
              );
            });
      }
      pr.completeNotification = new pr("C");
      const bz = { dispatch: !0, functional: !1, useEffectsErrorHandler: !0 },
        Ou = "__@ngrx/effects_create__";
      function rA(e) {
        return Object.getPrototypeOf(e);
      }
      function mm(e) {
        return "function" == typeof e;
      }
      function ym(e) {
        return e.filter(mm);
      }
      function Mz(e, t, n) {
        const r = rA(e).constructor.name,
          i = (function nA(e) {
            return (function Dz(e) {
              return Object.getOwnPropertyNames(e)
                .filter(
                  (r) =>
                    !(!e[r] || !e[r].hasOwnProperty(Ou)) &&
                    e[r][Ou].hasOwnProperty("dispatch")
                )
                .map((r) => ({ propertyName: r, ...e[r][Ou] }));
            })(e);
          })(e).map(
            ({ propertyName: o, dispatch: s, useEffectsErrorHandler: a }) => {
              const l = "function" == typeof e[o] ? e[o]() : e[o],
                c = a ? n(l, t) : l;
              return !1 === s
                ? c.pipe(
                    (function vz() {
                      return Me((e, t) => {
                        e.subscribe(_e(t, Ea));
                      });
                    })()
                  )
                : c
                    .pipe(
                      (function _z() {
                        return Me((e, t) => {
                          e.subscribe(
                            _e(
                              t,
                              (n) => {
                                t.next(pr.createNext(n));
                              },
                              () => {
                                t.next(pr.createComplete()), t.complete();
                              },
                              (n) => {
                                t.next(pr.createError(n)), t.complete();
                              }
                            )
                          );
                        });
                      })()
                    )
                    .pipe(
                      te((d) => ({
                        effect: e[o],
                        notification: d,
                        propertyName: o,
                        sourceName: r,
                        sourceInstance: e,
                      }))
                    );
            }
          );
        return Zu(...i);
      }
      function iA(e, t, n = 10) {
        return e.pipe(
          Tr((r) => (t && t.handleError(r), n <= 1 ? e : iA(e, t, n - 1)))
        );
      }
      let Az = (() => {
        class e extends ve {
          constructor(n) {
            super(), n && (this.source = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(la));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      const oA = new S("@ngrx/effects Internal Root Guard"),
        Nu = new S("@ngrx/effects User Provided Effects"),
        vm = new S("@ngrx/effects Internal Root Effects"),
        sA = new S("@ngrx/effects Internal Root Effects Instances"),
        aA = new S("@ngrx/effects Internal Feature Effects"),
        lA = new S("@ngrx/effects Internal Feature Effects Instance Groups"),
        xz = new S("@ngrx/effects Effects Error Handler", {
          providedIn: "root",
          factory: () => iA,
        }),
        cA = "@ngrx/effects/init";
      eu(cA);
      function Hz(e) {
        return _m(e, "ngrxOnInitEffects");
      }
      function _m(e, t) {
        return e && t in e && "function" == typeof e[t];
      }
      let Cm = (() => {
        class e extends We {
          constructor(n, r) {
            super(), (this.errorHandler = n), (this.effectsErrorHandler = r);
          }
          addEffects(n) {
            this.next(n);
          }
          toActions() {
            return this.pipe(
              eA((n) =>
                (function Ez(e) {
                  return (
                    "Object" !== e.constructor.name &&
                    "Function" !== e.constructor.name
                  );
                })(n)
                  ? rA(n)
                  : n
              ),
              Ke((n) => n.pipe(eA(Uz))),
              Ke((n) => {
                const r = n.pipe(
                  tA((o) =>
                    (function $z(e, t) {
                      return (n) => {
                        const r = Mz(n, e, t);
                        return (function Bz(e) {
                          return _m(e, "ngrxOnRunEffects");
                        })(n)
                          ? n.ngrxOnRunEffects(r)
                          : r;
                      };
                    })(
                      this.errorHandler,
                      this.effectsErrorHandler
                    )(o)
                  ),
                  te(
                    (o) => (
                      (function Nz(e, t) {
                        if ("N" === e.notification.kind) {
                          const n = e.notification.value;
                          !(function Rz(e) {
                            return (
                              "function" != typeof e &&
                              e &&
                              e.type &&
                              "string" == typeof e.type
                            );
                          })(n) &&
                            t.handleError(
                              new Error(
                                `Effect ${(function Pz({
                                  propertyName: e,
                                  sourceInstance: t,
                                  sourceName: n,
                                }) {
                                  const r = "function" == typeof t[e];
                                  return `"${n}.${String(e)}${r ? "()" : ""}"`;
                                })(
                                  e
                                )} dispatched an invalid action: ${(function Fz(
                                  e
                                ) {
                                  try {
                                    return JSON.stringify(e);
                                  } catch {
                                    return e;
                                  }
                                })(n)}`
                              )
                            );
                        }
                      })(o, this.errorHandler),
                      o.notification
                    )
                  ),
                  sn((o) => "N" === o.kind && null != o.value),
                  (function Cz() {
                    return Me((e, t) => {
                      e.subscribe(_e(t, (n) => JT(n, t)));
                    });
                  })()
                );
                return Zu(
                  r,
                  n.pipe(
                    ri(1),
                    sn(Hz),
                    te((o) => o.ngrxOnInitEffects())
                  )
                );
              })
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(D(wr), D(xz));
          }),
          (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
          e
        );
      })();
      function Uz(e) {
        return (function Lz(e) {
          return _m(e, "ngrxOnIdentifyEffects");
        })(e)
          ? e.ngrxOnIdentifyEffects()
          : "";
      }
      let bm = (() => {
          class e {
            get isStarted() {
              return !!this.effectsSubscription;
            }
            constructor(n, r) {
              (this.effectSources = n),
                (this.store = r),
                (this.effectsSubscription = null);
            }
            start() {
              this.effectsSubscription ||
                (this.effectsSubscription = this.effectSources
                  .toActions()
                  .subscribe(this.store));
            }
            ngOnDestroy() {
              this.effectsSubscription &&
                (this.effectsSubscription.unsubscribe(),
                (this.effectsSubscription = null));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(Cm), D(fi));
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        uA = (() => {
          class e {
            constructor(n, r, i, o, s, a, l) {
              (this.sources = n), r.start();
              for (const c of o) n.addEffects(c);
              i.dispatch({ type: cA });
            }
            addEffects(n) {
              this.sources.addEffects(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(
                D(Cm),
                D(bm),
                D(fi),
                D(sA),
                D(ru, 8),
                D(Eg, 8),
                D(oA, 8)
              );
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({})),
            e
          );
        })(),
        zz = (() => {
          class e {
            constructor(n, r, i, o) {
              const s = r.flat();
              for (const a of s) n.addEffects(a);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(uA), D(lA), D(ru, 8), D(Eg, 8));
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({})),
            e
          );
        })(),
        qz = (() => {
          class e {
            static forFeature(...n) {
              const r = n.flat(),
                i = ym(r);
              return {
                ngModule: zz,
                providers: [
                  i,
                  { provide: aA, multi: !0, useValue: r },
                  { provide: Nu, multi: !0, useValue: [] },
                  { provide: lA, multi: !0, useFactory: dA, deps: [aA, Nu] },
                ],
              };
            }
            static forRoot(...n) {
              const r = n.flat(),
                i = ym(r);
              return {
                ngModule: uA,
                providers: [
                  i,
                  { provide: vm, useValue: [r] },
                  { provide: oA, useFactory: Gz },
                  { provide: Nu, multi: !0, useValue: [] },
                  { provide: sA, useFactory: dA, deps: [vm, Nu] },
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ve({ type: e })),
            (e.ɵinj = Fe({})),
            e
          );
        })();
      function dA(e, t) {
        const n = [];
        for (const r of e) n.push(...r);
        for (const r of t) n.push(...r);
        return n.map((r) =>
          (function Sz(e) {
            return e instanceof S || mm(e);
          })(r)
            ? M(r)
            : r
        );
      }
      function Gz() {
        const e = M(bm, { optional: !0, skipSelf: !0 }),
          t = M(vm, { self: !0 });
        if ((1 !== t.length || 0 !== t[0].length) && e)
          throw new TypeError(
            "EffectsModule.forRoot() called twice. Feature modules should use EffectsModule.forFeature() instead."
          );
        return "guarded";
      }
      const Wz = eu("[API Get all foods]API FOODS"),
        fA = eu("[API Recive All Foods Sucess]API FOOD", {
          _as: "props",
          _p: void 0,
        }),
        Kz = (function k3(e, ...t) {
          const n = new Map();
          for (const r of t)
            for (const i of r.types) {
              const o = n.get(i);
              n.set(i, o ? (a, l) => r.reducer(o(a, l), l) : r.reducer);
            }
          return function (r = e, i) {
            const o = n.get(i.type);
            return o ? o(r, i) : r;
          };
        })(
          [],
          (function F3(...e) {
            return { reducer: e.pop(), types: e.map((r) => r.type) };
          })(fA, (e, { foodsData: t }) => (console.log(t), [...t]))
        ),
        Qz = (e, t) => Kz(e, t);
      let Zz = (() => {
          class e {
            constructor(n, r) {
              (this.diningService = n),
                (this.action$ = r),
                (this.projectFoods$ = (function wz(e, t = {}) {
                  const n = t.functional ? e : e(),
                    r = { ...bz, ...t };
                  return Object.defineProperty(n, Ou, { value: r }), n;
                })(() =>
                  this.action$.pipe(
                    (function Iz(...e) {
                      return sn((t) =>
                        e.some((n) =>
                          "string" == typeof n
                            ? n === t.type
                            : n.type === t.type
                        )
                      );
                    })(Wz),
                    Zt(() =>
                      this.diningService
                        .fetchFoods()
                        .pipe(te((i) => fA({ foodsData: i })))
                    )
                  )
                ));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(D(xr), D(Az));
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Yz = (() => {
          class e {
            constructor() {}
            intercept(n, r) {
              let i = localStorage.getItem("token");
              const o = n.clone({
                setHeaders: { Authorization: `Bearer ${i}` },
              });
              return r.handle(o);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = O({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Xz = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Ve({ type: e, bootstrap: [w5] })),
            (e.ɵinj = Fe({
              providers: [xr, Gg, tg, { provide: H0, useClass: Yz, multi: !0 }],
              imports: [
                mE,
                b5,
                eU,
                yz,
                kp,
                I4,
                A4,
                P3.forRoot({ foodsData: Qz }),
                qz.forRoot([Zz]),
                w$.forRoot({
                  positionClass: "toast-top-center",
                  preventDuplicates: !0,
                }),
              ],
            })),
            e
          );
        })();
      Q2()
        .bootstrapModule(Xz)
        .catch((e) => console.error(e));
    },
  },
  (Pu) => {
    Pu((Pu.s = 624));
  },
]);
