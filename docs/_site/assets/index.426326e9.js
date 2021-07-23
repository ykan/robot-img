var e = Object.defineProperty,
  t = Object.defineProperties,
  r = Object.getOwnPropertyDescriptors,
  n = Object.getOwnPropertySymbols,
  o = Object.prototype.hasOwnProperty,
  a = Object.prototype.propertyIsEnumerable,
  c = (t, r, n) =>
    r in t ? e(t, r, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (t[r] = n),
  s = (e, t) => {
    for (var r in t || (t = {})) o.call(t, r) && c(e, r, t[r])
    if (n) for (var r of n(t)) a.call(t, r) && c(e, r, t[r])
    return e
  },
  i = (e, n) => t(e, r(n)),
  l = (e, t) => {
    var r = {}
    for (var c in e) o.call(e, c) && t.indexOf(c) < 0 && (r[c] = e[c])
    if (null != e && n) for (var c of n(e)) t.indexOf(c) < 0 && a.call(e, c) && (r[c] = e[c])
    return r
  }
import { c as m, n as u, R as g, a as d, G as p } from './vendor.e6309049.js'
const h = m`
  body {
    margin: 0;
  }
  .container {
    max-width: 960px;
    margin: 0 auto;
  }
  .markdown-body {
    margin-top: 30px;
  }

  .example-container {
    display: flex;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 20px;
    margin-bottom: 30px;
    box-shadow: 0 0 12px 0 rgba(102, 102, 102, 0.12);
    .example {
      flex: 1;
      padding: 10px;
      max-height: 500px;
    }
    .code {
      flex: 2;
      max-height: 500px;
      overflow: scroll;

      pre {
        margin: 0;
      }
    }
  }
`,
  f = u.div`
  box-shadow: 0 0 12px 0 rgba(102, 102, 102, 0.12);
  &:hover {
    box-shadow: 0 0 12px 0 rgba(102, 102, 102, 0.2);
  }

  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .menu-item {
    margin-left: 20px;
    text-decoration: none;
    color: #333;
  }
`
g.render(
  d.createElement(
    d.StrictMode,
    null,
    d.createElement(p, { styles: h }),
    d.createElement(
      f,
      null,
      d.createElement(
        'div',
        { className: 'container' },
        d.createElement('h1', null, 'Robot Img'),
        d.createElement(
          'div',
          { className: 'menu' },
          d.createElement('a', { href: '#docs', className: 'menu-item' }, '文档'),
          d.createElement('a', { href: '#api', className: 'menu-item' }, 'API'),
          d.createElement(
            'a',
            { href: 'https://github.com/ykan/robot-img', className: 'menu-item' },
            'Github'
          )
        )
      )
    )
  ),
  document.getElementById('nav')
)
const w = { webp: !1, ratio: window.devicePixelRatio || 1 },
  b = () => [(e) => e.src, w]
function v(e = b) {
  const [t, r] = e()
  return (e) =>
    'function' == typeof e
      ? (t) => {
          const n = Math.floor(r.ratio * t.rect.width),
            o = Math.floor(r.ratio * t.rect.height)
          return e(i(s(s({}, t), r), { ratioWidth: n, ratioHeight: o }))
        }
      : t
}
const y =
  ((E =
    (e) =>
    ({ src: t, rect: r }) => {
      const n = []
      if (r.width && r.height) {
        const t = Math.floor(e.ratio * r.width),
          o = Math.floor(e.ratio * r.height),
          a = Math.min(4096, t),
          c = Math.min(4096, o)
        n.push(`resize,m_fill,w_${a},h_${c}`)
      }
      return (
        e.webp && n.push('format,webp'),
        n.length < 1 ? t : `${t}?x-oss-process=image/${n.join('/')}`
      )
    }),
  (e = w) => {
    const t = s(s({}, w), e)
    return () => [E(t), t]
  })
var E
function x(e, t) {
  const r =
      (e.top >= t.top && e.top <= t.bottom) ||
      (e.top <= t.top && e.bottom >= t.bottom) ||
      (e.bottom >= t.top && e.bottom <= t.bottom),
    n =
      (e.left >= t.left && e.left <= t.right) ||
      (e.left <= t.left && e.right >= t.right) ||
      (e.right >= t.left && e.right <= t.right)
  return r && n
}
function k(e, t) {
  const { Image: r } = window,
    n = new r()
  return (
    t && (n.crossOrigin = t),
    new Promise((t, r) => {
      ;(n.onerror = (e) => {
        r(e)
      }),
        (n.onload = () => {
          t(n)
        }),
        (n.src = e)
    })
  )
}
async function z() {
  try {
    return (
      await k(
        'data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoBAAEAAAAMJaQAA3AA/v89WAAAAA=='
      ),
      !0
    )
  } catch (e) {}
  return !1
}
let S = 0
function N() {
  return {
    top: 0,
    bottom: window.innerHeight,
    left: 0,
    right: window.innerWidth,
    width: window.innerWidth,
    height: window.innerHeight,
  }
}
function R(e) {
  return {
    top: e.top - 0.5 * e.height,
    bottom: e.bottom + 0.5 * e.height,
    left: e.left - 0.5 * e.width,
    right: e.right + 0.5 * e.width,
  }
}
function j(e = {}, t = !0) {
  const {
    container: r = window,
    tickTime: n,
    getContainerRect: o = R,
    createSrcTpl: a,
    globalVars: c,
    name: s,
  } = e
  let i,
    l = -1,
    m = 'none',
    u = () => {},
    g = n || 150,
    d = r,
    p = o,
    h = c || {},
    f = v(a),
    w = s ? `${s}_${S++}` : '' + S++,
    b = !1,
    y = () => {}
  const E = new Set(),
    k = {
      get imgs() {
        return E
      },
      get currentEventType() {
        return m
      },
      get tickTime() {
        return g
      },
      get containerRect() {
        return i
      },
      get container() {
        return d
      },
      get globalVars() {
        return h
      },
      get name() {
        return w
      },
      get isOverlapWindow() {
        return b
      },
      appendDefaultStyle() {
        if (h.className) {
          const e = [
            'transition: background-image .3s;',
            '-webkit-transition: background-image .3s;',
            'background-size: cover;',
            'background-position: center;',
            'background-repeat: no-repeat;',
          ].join(' ')
          window.document.head.insertAdjacentHTML(
            'afterbegin',
            `<style>.${h.className} { ${e} }</style>`
          )
        }
      },
      srcTpl: (e) => f(e),
      reset(e) {
        e.tickTime && (g = e.tickTime),
          e.getContainerRect && (p = e.getContainerRect),
          e.createSrcTpl && (f = v(e.createSrcTpl)),
          e.name && (w = `${e.name}_${S++}`),
          e.container && (d = e.container),
          e.globalVars && (h = e.globalVars),
          k.init()
      },
      init() {
        k.destroy()
        const e = () => {
            k.occur('scroll')
          },
          t = () => {
            k.occur('resize')
          }
        if (
          (window.addEventListener('scroll', e, !0),
          window.addEventListener('resize', t),
          (r = d) === r.window)
        )
          (b = !0),
            (y = () => {
              i = p(N())
            }),
            y(),
            (u = () => {
              window.removeEventListener('scroll', e, !0), window.removeEventListener('resize', t)
            })
        else {
          d.addEventListener('scroll', e, !0),
            (y = () => {
              const e = d.getBoundingClientRect(),
                t = p(e)
              ;(function (e, t) {
                const r = e.bottom - e.top,
                  n = e.right - e.left,
                  o = t.bottom - t.top,
                  a = t.right - t.left
                return r !== o || n !== a
              })(t, i) && k.occur('resize'),
                (i = t),
                (b = x(N(), e))
            })
          const r = d.getBoundingClientRect()
          ;(i = p(r)),
            (b = x(N(), r)),
            (u = () => {
              d.removeEventListener('scroll', e, !0),
                window.removeEventListener('scroll', e, !0),
                window.removeEventListener('resize', t)
            })
        }
        var r
      },
      destroy() {
        u()
      },
      overlap: (e) => x(e, i),
      occur(e) {
        'scroll+resize' !== m &&
          (m =
            ('resize' === e && 'scroll' === m) || ('scroll' === e && 'resize' === m)
              ? 'scroll+resize'
              : e)
      },
      update() {
        var e
        y()
        for (const t of E) null == (e = t.onUpdate) || e.call(t)
        if ('none' !== m) {
          if (b) for (const e of E) e.shouldCheck && e.onChecked(m)
          m = 'none'
        }
      },
      tick(e = !1) {
        clearTimeout(l),
          e || k.update(),
          (l = window.setTimeout(() => {
            k.tick()
          }, g))
      },
      stopTick() {
        clearTimeout(l)
      },
    }
  return k.init(), t && k.tick(!0), k
}
const T = j(),
  C = d.createContext(T)
function A(e, t) {
  'function' == typeof e ? e(t) : e && (e.current = t)
}
function P(e, t) {
  return d.useMemo(
    () =>
      null == e && null == t
        ? null
        : (r) => {
            A(e, r), A(t, r)
          },
    [e, t]
  )
}
function D(e, t) {
  return e.width * e.height > 1.2 * (t.width * t.height)
}
function O(e, t) {
  const r = e,
    {
      src: n = '',
      srcTpl: o,
      defaultSrc: a,
      errorSrc: c,
      lazy: m = 'scroll',
      className: u,
      statusClassNamePrefix: g,
      loadingType: p,
      crossOrigin: h,
      onError: f,
      onLoaded: w,
      shouldUpdate: b = D,
    } = r,
    v = l(r, [
      'src',
      'srcTpl',
      'defaultSrc',
      'errorSrc',
      'lazy',
      'className',
      'statusClassNamePrefix',
      'loadingType',
      'crossOrigin',
      'onError',
      'onLoaded',
      'shouldUpdate',
    ]),
    y = d.useRef(null),
    E = P(t, y),
    x = d.useRef({ shouldCheck: !1, onChecked: () => {} }),
    z = d.useContext(C),
    S = d.useRef(z)
  S.current !== z &&
    (S.current.imgs.delete(x.current), (S.current = z), S.current.imgs.add(x.current))
  const N = d.useMemo(() => z.srcTpl(o), [o, z]),
    R = d.useMemo(() => a || z.globalVars.defaultSrc || '', [a, z]),
    j = d.useMemo(() => c || z.globalVars.errorSrc || '', [c, z]),
    T = d.useMemo(() => p || z.globalVars.loadingType || 'none', [p, z]),
    [A, O] = d.useState({ src: '', originSrc: '', status: 'blank' }),
    M = d.useMemo(() => {
      const e = g || z.globalVars.statusClassNamePrefix,
        t = []
      u && t.push(u), e && t.push(`${e}${A.status}`)
      const r = z.globalVars.className
      return r && t.push(r), t.join(' ')
    }, [u, A.status, g, z]),
    $ = d.useRef(),
    V = d.useCallback(
      (e) => {
        const t = N({ src: n, rect: e })
        O({ src: 'src' === T ? R : '', originSrc: n, status: 'loading', rect: e })
        const r = k(t, h)
        ;($.current = r),
          r
            .catch((t) => {
              $.current === r &&
                (O({ src: 'src' === T ? j : '', originSrc: n, status: 'error', rect: e }),
                null == f || f(t))
            })
            .then((o) => {
              $.current === r &&
                (O({ src: t, originSrc: n, status: 'loaded', rect: e }), null == w || w(o))
            })
      },
      [h, R, j, T, N, f, w, n]
    ),
    B = d.useCallback(
      (e) => {
        O({ src: N({ src: n, rect: e }), originSrc: n, status: 'loaded', rect: e })
      },
      [N, n]
    ),
    I = d.useMemo(() => ('none' === T ? B : V), [V, B, T])
  d.useEffect(
    () => (
      S.current.imgs.add(x.current),
      () => {
        S.current.imgs.delete(x.current)
      }
    ),
    []
  )
  const L = d.useCallback(() => {
      if (A.rect && y.current && S.current.isOverlapWindow) {
        const e = y.current.getBoundingClientRect()
        if (!S.current.overlap(e)) return
        b(e, A.rect) && I(e)
      }
    }, [I, b, A.rect]),
    U = d.useCallback(() => {
      if (((x.current.shouldCheck = !1), !y.current)) return
      const e = y.current.getBoundingClientRect()
      S.current.overlap(e) ? I(e) : (x.current.shouldCheck = !0)
    }, [I])
  return (
    d.useEffect(() => {
      if (!y.current) return
      if (n === A.originSrc) return
      if ('' === n) return void O({ src: '', originSrc: '', status: 'blank' })
      const e = y.current.getBoundingClientRect()
      if (m)
        return S.current.overlap(e)
          ? void I(e)
          : ((x.current.shouldCheck = !0), void (x.current.onChecked = U))
      I(e)
    }, [m, U, I, n, A.originSrc, A.rect, A.status]),
    d.useEffect(() => {
      'loaded' === A.status && 'resize' === m && y.current && (x.current.onUpdate = L)
    }, [m, A.status, L]),
    {
      state: A,
      defaultSrc: R,
      errorSrc: j,
      imgPool: S.current,
      crossOrigin: h,
      domProps: i(s({}, v), { className: M }),
      handleRef: E,
      loadImg: I,
    }
  )
}
function M(e, t) {
  const r = O(e, t),
    { domProps: n, state: o } = r,
    a = l(r, ['domProps', 'state']),
    c = n,
    { style: m } = c,
    u = l(c, ['style']),
    g = d.useMemo(() => {
      let e
      return o.src && (e = `url(${o.src})`), e ? i(s({}, m), { backgroundImage: e }) : m
    }, [o.src, m])
  return i(s({}, a), { domProps: i(s({}, u), { style: g }), state: o })
}
const $ = d.forwardRef((e, t) => {
    const {
      domProps: r,
      handleRef: n,
      pool: o,
    } = (function (e, t) {
      const r = e,
        { getContainerRect: n, tickTime: o, createSrcTpl: a, globalVars: c, name: s } = r,
        i = l(r, ['getContainerRect', 'tickTime', 'createSrcTpl', 'globalVars', 'name']),
        m = d.useRef(null),
        u = P(m, t),
        g = d.useMemo(() => j(), [])
      return (
        d.useEffect(() => {
          m.current &&
            g.reset({
              container: m.current,
              getContainerRect: n,
              tickTime: o,
              createSrcTpl: a,
              globalVars: c,
              name: s,
            })
        }, [a, n, c, s, g, o]),
        { handleRef: u, domProps: i, pool: g }
      )
    })(e, t)
    return d.createElement(
      C.Provider,
      { value: o },
      d.createElement('div', i(s({}, r), { ref: n }))
    )
  }),
  V = d.forwardRef((e, t) => {
    const { handleRef: r, domProps: n } = M(e, t)
    return d.createElement('div', i(s({}, n), { ref: r }))
  }),
  B = d.forwardRef((e, t) => {
    const { handleRef: r, domProps: n } = M(e, t)
    return d.createElement('span', i(s({}, n), { ref: r }))
  }),
  I = d.forwardRef((e, t) => {
    const { handleRef: r, defaultSrc: n, state: o, domProps: a, crossOrigin: c } = O(e, t)
    return d.createElement('img', i(s({}, a), { crossOrigin: c, src: o.src || n, ref: r }))
  }),
  L =
    ((U = I),
    (W = { Div: V, Span: B, Container: $ }),
    Object.keys(W).forEach((e) => {
      U[e] = W[e]
    }),
    U)
var U, W
const _ = u.div`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transition: background-image 0.3s;
  ${(e) => e.$src && `background-image: url(${e.$src});`}
`,
  H = u(
    d.forwardRef((e, t) => {
      const { domProps: r, state: n, handleRef: o } = O(e, t)
      return d.createElement(_, i(s({}, r), { $src: n.src, ref: o }))
    })
  )`
  width: 200px;
  height: 160px;
`
!(async function () {
  const e = await z()
  T.reset({ createSrcTpl: y({ webp: e }) }),
    g.render(
      d.createElement(H, { src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg' }),
      document.getElementById('10-recommend')
    )
})(),
  g.render(
    d.createElement(L, {
      src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
      style: { width: 200 },
    }),
    document.getElementById('20-default')
  ),
  (async function () {
    const e = await z(),
      t = j({ createSrcTpl: y({ webp: e }), globalVars: { className: 'custom-img' } })
    t.appendDefaultStyle()
    const r = '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg'
    g.render(
      d.createElement(
        C.Provider,
        { value: t },
        d.createElement(L, { src: r, style: { width: 100 } }),
        d.createElement(L.Span, {
          src: r,
          style: { width: 100, height: 80, display: 'inline-flex' },
        }),
        d.createElement(L.Div, { src: r, style: { width: 100, height: 80 } })
      ),
      document.getElementById('30-css')
    )
  })()
const G = u.div`
  .img-container {
    height: 300px;
    overflow: scroll;
  }
  .img {
    width: 200px;
    height: 160px;
    background-size: cover;
  }
`
!(async function () {
  const e = await z()
  T.reset({ createSrcTpl: y({ webp: e }), globalVars: { className: 'robot-img' } }),
    g.render(
      d.createElement(
        G,
        null,
        d.createElement(
          $,
          {
            className: 'img-container',
            createSrcTpl: y({ webp: e }),
            globalVars: { className: 'robot-img' },
          },
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          }),
          d.createElement(L.Div, {
            className: 'img',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          })
        )
      ),
      document.getElementById('50-container')
    )
})()
const Q = u.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 10px;

  .robot-img {
    width: 40vw;
    height: 30vw;
    background-size: cover;
  }
`
!(async function () {
  const e = await z()
  T.reset({ createSrcTpl: y({ webp: e }), globalVars: { className: 'robot-img' } }),
    g.render(
      d.createElement(
        d.StrictMode,
        null,
        d.createElement(
          Q,
          null,
          d.createElement(L.Div, {
            lazy: 'resize',
            src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
          })
        )
      ),
      document.getElementById('3-resize')
    )
})()
