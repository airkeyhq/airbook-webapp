import { t as e } from "./rolldown-runtime.BRwTesTf.mjs";
import {
  A as t,
  C as n,
  D as r,
  I as i,
  L as a,
  M as o,
  N as s,
  P as c,
  R as l,
  _ as u,
  a as d,
  c as f,
  g as p,
  h as m,
  i as h,
  j as g,
  k as _,
  l as v,
  m as ee,
  n as te,
  o as y,
  p as ne,
  r as re,
  t as b,
  u as x,
  v as S,
  x as C,
} from "./react.-xoDNb9B.mjs";
import { S as w, a as T, r as E, t as D } from "./motion.DDMpzqrG.mjs";
import {
  $ as ie,
  B as O,
  E as k,
  H as A,
  J as ae,
  K as oe,
  M as j,
  N as M,
  P as se,
  Q as ce,
  R as le,
  T as ue,
  V as de,
  W as fe,
  X as pe,
  Z as me,
  _ as N,
  a as he,
  b as P,
  c as ge,
  ct as _e,
  d as ve,
  et as ye,
  f as be,
  g as xe,
  gt as Se,
  h as Ce,
  ht as we,
  i as Te,
  l as Ee,
  lt as De,
  mt as Oe,
  n as ke,
  nt as Ae,
  o as je,
  p as Me,
  q as Ne,
  r as F,
  rt as I,
  s as Pe,
  st as Fe,
  t as L,
  tt as Ie,
  u as R,
  ut as z,
  w as B,
  x as V,
  y as Le,
  z as Re,
} from "./framer.Bf2IfFsV.mjs";
import {
  A as ze,
  C as H,
  D as Be,
  E as Ve,
  F as He,
  I as Ue,
  M as We,
  N as Ge,
  O as Ke,
  P as qe,
  S as Je,
  T as Ye,
  b as Xe,
  j as Ze,
  k as Qe,
  w as $e,
  x as et,
  y as tt,
} from "./shared-lib.CEYmOX3f.mjs";
var nt,
  rt,
  it,
  at,
  ot,
  st,
  ct,
  lt,
  ut = e(() => {
    (y(),
      O(),
      n(),
      (nt = `var(--framer-icon-mask)`),
      (rt = p(function (e, t) {
        return f(`svg`, { ...e, ref: t, children: e.children });
      })),
      (it = w.create(rt)),
      (at = p((e, t) => {
        let { animated: n, layoutId: r, children: i, ...a } = e;
        return n
          ? f(it, { ...a, layoutId: r, ref: t, children: i })
          : f(`svg`, { ...a, ref: t, children: i });
      })),
      (ot = `<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 20 0.008 C 20 0.008 19.3 2.108 18 3.408 C 19.6 13.408 8.6 20.708 0 15.008 C 2.2 15.108 4.4 14.408 6 13.008 C 1 11.508 -1.5 5.608 1 1.008 C 3.2 3.608 6.6 5.108 10 5.008 C 9.1 0.808 14 -1.592 17 1.208 C 18.1 1.208 20 0.008 20 0.008 Z" fill="transparent" height="17.0080247478818px" id="TRbx1I8YU" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--js9iwy, 2)" stroke="var(--1m973uw, rgb(0,0,0))" transform="translate(2 3.992)" width="20px"/></svg>`),
      (st = ({ color: e, height: t, id: n, width: r, width1: i, ...a }) => ({
        ...a,
        JEeZYcamG: i ?? a.JEeZYcamG ?? 2,
        P_DcoRcrY: e ?? a.P_DcoRcrY ?? `rgb(0, 0, 0)`,
      })),
      (ct = z(
        p(function (e, t) {
          let {
              style: n,
              className: r,
              layoutId: i,
              variant: a,
              P_DcoRcrY: o,
              JEeZYcamG: s,
              ...c
            } = st(e),
            l = _e(`2322855479`, ot);
          return f(at, {
            ...c,
            className: B(`framer-h6YOo`, r),
            layoutId: i,
            ref: t,
            role: `presentation`,
            style: { "--1m973uw": o, "--js9iwy": s, ...n },
            viewBox: `0 0 24 24`,
            children: f(`use`, { href: l }),
          });
        }),
        [
          `.framer-h6YOo { -webkit-mask: ${nt}; aspect-ratio: 1; display: block; mask: ${nt}; width: 24px; }`,
        ],
        `framer-h6YOo`
      )),
      (ct.displayName = `Twitter`),
      (lt = ct),
      V(ct, {
        P_DcoRcrY: { defaultValue: `rgb(0, 0, 0)`, hidden: !1, title: `Color`, type: F.Color },
        JEeZYcamG: {
          defaultValue: 2,
          displayStepper: !0,
          hidden: !1,
          max: 16,
          min: 1,
          title: `Width`,
          type: F.Number,
        },
      }));
  }),
  dt,
  ft,
  pt,
  mt,
  ht,
  gt,
  _t,
  vt,
  yt = e(() => {
    (y(),
      O(),
      n(),
      (dt = `var(--framer-icon-mask)`),
      (ft = p(function (e, t) {
        return f(`svg`, { ...e, ref: t, children: e.children });
      })),
      (pt = w.create(ft)),
      (mt = p((e, t) => {
        let { animated: n, layoutId: r, children: i, ...a } = e;
        return n
          ? f(pt, { ...a, layoutId: r, ref: t, children: i })
          : f(`svg`, { ...a, ref: t, children: i });
      })),
      (ht = `<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 11 0 L 8 0 C 5.239 0 3 2.239 3 5 L 3 8 L 0 8 L 0 12 L 3 12 L 3 20 L 7 20 L 7 12 L 10 12 L 11 8 L 7 8 L 7 5 C 7 4.448 7.448 4 8 4 L 11 4 Z" fill="transparent" height="20px" id="F9iMxikzW" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--js9iwy, 2)" stroke="var(--1m973uw, rgb(0,0,0))" transform="translate(7 2)" width="11px"/></svg>`),
      (gt = ({ color: e, height: t, id: n, width: r, width1: i, ...a }) => ({
        ...a,
        JEeZYcamG: i ?? a.JEeZYcamG ?? 2,
        P_DcoRcrY: e ?? a.P_DcoRcrY ?? `rgb(0, 0, 0)`,
      })),
      (_t = z(
        p(function (e, t) {
          let {
              style: n,
              className: r,
              layoutId: i,
              variant: a,
              P_DcoRcrY: o,
              JEeZYcamG: s,
              ...c
            } = gt(e),
            l = _e(`3191071638`, ht);
          return f(mt, {
            ...c,
            className: B(`framer-5MaOE`, r),
            layoutId: i,
            ref: t,
            role: `presentation`,
            style: { "--1m973uw": o, "--js9iwy": s, ...n },
            viewBox: `0 0 24 24`,
            children: f(`use`, { href: l }),
          });
        }),
        [
          `.framer-5MaOE { -webkit-mask: ${dt}; aspect-ratio: 1; display: block; mask: ${dt}; width: 24px; }`,
        ],
        `framer-5MaOE`
      )),
      (_t.displayName = `Facebook`),
      (vt = _t),
      V(_t, {
        P_DcoRcrY: { defaultValue: `rgb(0, 0, 0)`, hidden: !1, title: `Color`, type: F.Color },
        JEeZYcamG: {
          defaultValue: 2,
          displayStepper: !0,
          hidden: !1,
          max: 16,
          min: 1,
          title: `Width`,
          type: F.Number,
        },
      }));
  }),
  bt,
  xt,
  St,
  Ct,
  wt,
  Tt,
  Et,
  Dt,
  Ot = e(() => {
    (y(),
      O(),
      n(),
      (bt = `var(--framer-icon-mask)`),
      (xt = p(function (e, t) {
        return f(`svg`, { ...e, ref: t, children: e.children });
      })),
      (St = w.create(xt)),
      (Ct = p((e, t) => {
        let { animated: n, layoutId: r, children: i, ...a } = e;
        return n
          ? f(St, { ...a, layoutId: r, ref: t, children: i })
          : f(`svg`, { ...a, ref: t, children: i });
      })),
      (wt = `<svg display="block" role="presentation" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 5 20 C 2.239 20 0 17.761 0 15 L 0 5 C 0 2.239 2.239 0 5 0 L 15 0 C 17.761 0 20 2.239 20 5 L 20 15 C 20 17.761 17.761 20 15 20 Z" fill="transparent" height="20px" id="WelWVC4aK" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--js9iwy, 2)" stroke="var(--1m973uw, rgb(0,0,0))" transform="translate(2 2)" width="20px"/><path d="M 7.957 3.413 C 8.21 5.12 7.34 6.797 5.798 7.573 C 4.257 8.349 2.392 8.049 1.172 6.829 C -0.049 5.608 -0.349 3.743 0.427 2.202 C 1.203 0.66 2.88 -0.21 4.587 0.043 C 6.33 0.302 7.698 1.67 7.957 3.413 Z" fill="transparent" height="8.000294809864354px" id="Y7WvVc7GI" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--js9iwy, 2)" stroke="var(--1m973uw, rgb(0,0,0))" transform="translate(8.043 7.957)" width="8.000294809864354px"/><path d="M 0 0 L 0.01 0" fill="transparent" height="1px" id="NoAMnmRyg" stroke-dasharray="" stroke-linecap="round" stroke-linejoin="round" stroke-width="var(--js9iwy, 2)" stroke="var(--1m973uw, rgb(0,0,0))" transform="translate(17.5 6.5)" width="1px"/></svg>`),
      (Tt = ({ color: e, height: t, id: n, width: r, width1: i, ...a }) => ({
        ...a,
        JEeZYcamG: i ?? a.JEeZYcamG ?? 2,
        P_DcoRcrY: e ?? a.P_DcoRcrY ?? `rgb(0, 0, 0)`,
      })),
      (Et = z(
        p(function (e, t) {
          let {
              style: n,
              className: r,
              layoutId: i,
              variant: a,
              P_DcoRcrY: o,
              JEeZYcamG: s,
              ...c
            } = Tt(e),
            l = _e(`2988937525`, wt);
          return f(Ct, {
            ...c,
            className: B(`framer-Tu4V5`, r),
            layoutId: i,
            ref: t,
            role: `presentation`,
            style: { "--1m973uw": o, "--js9iwy": s, ...n },
            viewBox: `0 0 24 24`,
            children: f(`use`, { href: l }),
          });
        }),
        [
          `.framer-Tu4V5 { -webkit-mask: ${bt}; aspect-ratio: 1; display: block; mask: ${bt}; width: 24px; }`,
        ],
        `framer-Tu4V5`
      )),
      (Et.displayName = `Instagram`),
      (Dt = Et),
      V(Et, {
        P_DcoRcrY: { defaultValue: `rgb(0, 0, 0)`, hidden: !1, title: `Color`, type: F.Color },
        JEeZYcamG: {
          defaultValue: 2,
          displayStepper: !0,
          hidden: !1,
          max: 16,
          min: 1,
          title: `Width`,
          type: F.Number,
        },
      }));
  }),
  kt,
  At,
  jt,
  Mt = e(() => {
    (O(),
      ue.loadFonts([]),
      (kt = [{ explicitInter: !0, fonts: [] }]),
      (At = [
        `.framer-UPkTG .framer-styles-preset-vbiryt:not(.rich-text-wrapper), .framer-UPkTG .framer-styles-preset-vbiryt.rich-text-wrapper a { --framer-link-hover-text-color: var(--token-cb892b53-bfb7-463e-95f3-095a4dd319d9, #04b7f9); --framer-link-text-color: var(--token-68c5c5f5-0e58-4492-b1b9-f805d76d95e8, #787878); transition-delay: 0s; transition-duration: 0.3s; transition-property: color; transition-timing-function: cubic-bezier(0.44, 0, 0.56, 1); }`,
      ]),
      (jt = `framer-UPkTG`));
  });
function Nt(e, ...t) {
  let n = {};
  return (t?.forEach((t) => t && Object.assign(n, e[t])), n);
}
var Pt,
  Ft,
  It,
  Lt,
  Rt,
  zt,
  Bt,
  Vt,
  Ht,
  U,
  W,
  Ut = e(() => {
    (y(),
      O(),
      D(),
      n(),
      (Pt = [`iSW21XBF8`, `G1T7CqIMD`, `twSJi7E6A`]),
      (Ft = `framer-NDPFc`),
      (It = {
        G1T7CqIMD: `framer-v-1ephs72`,
        iSW21XBF8: `framer-v-11a9sjm`,
        twSJi7E6A: `framer-v-1igb6dw`,
      }),
      (Lt = { bounce: 0.2, delay: 0, duration: 0.4, type: `spring` }),
      oe(),
      (Rt = ({ value: e, children: n }) => {
        let r = _(T),
          i = e ?? r.transition,
          a = t(() => ({ ...r, transition: i }), [JSON.stringify(i)]);
        return f(T.Provider, { value: a, children: n });
      }),
      (zt = {
        "Full Logo - Dark": `twSJi7E6A`,
        "Full Logo - Light": `iSW21XBF8`,
        "Icon Only": `G1T7CqIMD`,
      }),
      (Bt = w.create(s)),
      (Vt = ({ click: e, height: t, id: n, width: r, ...i }) => ({
        ...i,
        qeMoNNOov: e ?? i.qeMoNNOov,
        variant: zt[i.variant] ?? i.variant ?? `iSW21XBF8`,
      })),
      (Ht = (e, t) => (e.layoutDependency ? t.join(`-`) + e.layoutDependency : t.join(`-`))),
      (U = z(
        p(function (e, t) {
          let n = r(null),
            i = t ?? n,
            a = S(),
            { activeLocale: o, setLocale: c } = I(),
            l = ce(),
            { style: u, className: d, layoutId: p, variant: m, qeMoNNOov: h, ...g } = Vt(e),
            {
              baseVariant: _,
              classNames: ee,
              clearLoadingGesture: te,
              gestureHandlers: y,
              gestureVariant: ne,
              isLoading: re,
              setGestureState: b,
              setVariant: x,
              variants: C,
            } = De({
              cycleOrder: Pt,
              defaultVariant: `iSW21XBF8`,
              ref: i,
              variant: m,
              variantClassNames: It,
            }),
            T = Ht(e, C),
            { activeVariantCallback: D, delay: ie } = me(_),
            O = D(async (...e) => {
              if ((b({ isPressed: !1 }), h && (await h(...e)) === !1)) return !1;
            }),
            k = B(Ft),
            A = () => _ !== `G1T7CqIMD`;
          return f(E, {
            id: p ?? a,
            children: f(Bt, {
              animate: C,
              initial: !1,
              children: f(Rt, {
                value: Lt,
                children: f(R, {
                  href: { hash: `:H4JE0J23Z`, webPageId: `augiA20Il` },
                  motionChild: !0,
                  nodeId: `iSW21XBF8`,
                  openInNewTab: !1,
                  scopeId: `GN_S739b0`,
                  smoothScroll: !0,
                  children: v(w.a, {
                    ...g,
                    ...y,
                    className: `${B(k, `framer-11a9sjm`, d, ee)} framer-at5oph`,
                    "data-framer-name": `Full Logo - Light`,
                    "data-highlight": !0,
                    layoutDependency: T,
                    layoutId: `iSW21XBF8`,
                    onTap: O,
                    ref: i,
                    style: { ...u },
                    ...Nt(
                      {
                        G1T7CqIMD: { "data-framer-name": `Icon Only` },
                        twSJi7E6A: { "data-framer-name": `Full Logo - Dark` },
                      },
                      _,
                      ne
                    ),
                    children: [
                      f(w.div, {
                        className: `framer-bwnjb8`,
                        "data-framer-name": `Icon Wrapper`,
                        layoutDependency: T,
                        layoutId: `Iqt4tlrzT`,
                        style: {
                          borderBottomLeftRadius: 6,
                          borderBottomRightRadius: 6,
                          borderTopLeftRadius: 6,
                          borderTopRightRadius: 6,
                        },
                        children: f(Pe, {
                          background: {
                            alt: ``,
                            fit: `fill`,
                            intrinsicHeight: 96,
                            intrinsicWidth: 96,
                            loading: se(
                              (l?.y || 0) + (0 + ((l?.height || 38) - 0 - 37) / 2) + 0 + 2
                            ),
                            pixelHeight: 988,
                            pixelWidth: 988,
                            sizes: `34px`,
                            src: `/web1/assets/images/o7nBenf5iYP2umLrTl50Y4Fiek.png?width=988&height=988`,
                            srcSet: `/web1/assets/images/o7nBenf5iYP2umLrTl50Y4Fiek.png 512w,/web1/assets/images/o7nBenf5iYP2umLrTl50Y4Fiek.png?width=988&height=988 988w`,
                          },
                          className: `framer-1izr1ft`,
                          "data-border": !0,
                          "data-framer-name": `Icon`,
                          layoutDependency: T,
                          layoutId: `ij0QgrKWc`,
                          style: {
                            "--border-bottom-width": `1px`,
                            "--border-color": `rgba(255, 255, 255, 0.1)`,
                            "--border-left-width": `1px`,
                            "--border-right-width": `1px`,
                            "--border-style": `solid`,
                            "--border-top-width": `1px`,
                            "--corner-shape-fallback": 0.752,
                            borderBottomLeftRadius: `calc(12px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                            borderBottomRightRadius: `calc(12px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                            borderTopLeftRadius: `calc(12px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                            borderTopRightRadius: `calc(12px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                            cornerShape: `superellipse(1.5)`,
                          },
                        }),
                      }),
                      A() &&
                        f(w.div, {
                          className: `framer-1tez0qy`,
                          "data-framer-name": `Wordmark`,
                          layoutDependency: T,
                          layoutId: `Tfknon_R5`,
                          children: f(N, {
                            __fromCanvasComponent: !0,
                            children: f(s, {
                              children: f(w.h4, {
                                dir: `auto`,
                                style: {
                                  "--font-selector": `SW50ZXItU2VtaUJvbGQ=`,
                                  "--framer-font-open-type-features": `'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on`,
                                  "--framer-font-size": `calc(var(--framer-root-font-size, 1rem) * 1.25)`,
                                  "--framer-font-weight": `600`,
                                  "--framer-letter-spacing": `-0.04em`,
                                  "--framer-line-height": `1em`,
                                  "--framer-text-color": `var(--extracted-1eung3n, var(--token-825d95b1-a6d2-4a76-95ef-7bc49f8495da, rgb(23, 23, 23)))`,
                                },
                                children: `AirBook`,
                              }),
                            }),
                            className: `framer-1lu4c22`,
                            fonts: [`Inter-SemiBold`],
                            layoutDependency: T,
                            layoutId: `xrBKGO4u1`,
                            style: {
                              "--extracted-1eung3n": `var(--token-825d95b1-a6d2-4a76-95ef-7bc49f8495da, rgb(23, 23, 23))`,
                              "--framer-link-text-color": `rgb(0, 153, 255)`,
                              "--framer-link-text-decoration": `underline`,
                            },
                            variants: {
                              twSJi7E6A: {
                                "--extracted-1eung3n": `var(--token-0b44fb54-2b74-49cf-8332-a405b8aac356, rgb(255, 255, 255))`,
                              },
                            },
                            verticalAlignment: `top`,
                            withExternalLayout: !0,
                            ...Nt(
                              {
                                twSJi7E6A: {
                                  children: f(s, {
                                    children: f(w.h4, {
                                      dir: `auto`,
                                      style: {
                                        "--font-selector": `SW50ZXItU2VtaUJvbGQ=`,
                                        "--framer-font-open-type-features": `'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on`,
                                        "--framer-font-size": `calc(var(--framer-root-font-size, 1rem) * 1.25)`,
                                        "--framer-font-weight": `600`,
                                        "--framer-letter-spacing": `-0.04em`,
                                        "--framer-line-height": `1em`,
                                        "--framer-text-color": `var(--extracted-1eung3n, var(--token-0b44fb54-2b74-49cf-8332-a405b8aac356, rgb(255, 255, 255)))`,
                                      },
                                      children: `AirBook`,
                                    }),
                                  }),
                                },
                              },
                              _,
                              ne
                            ),
                          }),
                        }),
                    ],
                  }),
                }),
              }),
            }),
          });
        }),
        [
          `@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,
          `.framer-NDPFc.framer-at5oph, .framer-NDPFc .framer-at5oph { display: block; }`,
          `.framer-NDPFc.framer-11a9sjm { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 6px; height: min-content; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; text-decoration: none; width: min-content; }`,
          `.framer-NDPFc .framer-bwnjb8 { align-content: center; align-items: center; aspect-ratio: 1 / 1; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: var(--framer-aspect-ratio-supported, 38px); justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 38px; will-change: var(--framer-will-change-override, transform); }`,
          `.framer-NDPFc .framer-1izr1ft { aspect-ratio: 1 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 34px); overflow: visible; position: relative; width: 34px; }`,
          `.framer-NDPFc .framer-1tez0qy { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: min-content; }`,
          `.framer-NDPFc .framer-1lu4c22 { flex: none; height: auto; position: relative; white-space: pre; width: auto; }`,
          `.framer-NDPFc[data-border="true"]::after, .framer-NDPFc [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; corner-shape: inherit; pointer-events: none; }`,
        ],
        `framer-NDPFc`
      )),
      (W = U),
      (U.displayName = `Logo`),
      (U.defaultProps = { height: 38, width: 125 }),
      V(U, {
        variant: {
          options: [`iSW21XBF8`, `G1T7CqIMD`, `twSJi7E6A`],
          optionTitles: [`Full Logo - Light`, `Icon Only`, `Full Logo - Dark`],
          title: `Variant`,
          type: F.Enum,
        },
        qeMoNNOov: { title: `Click`, type: F.EventHandler },
      }),
      P(
        U,
        [
          {
            explicitInter: !0,
            fonts: [
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F`,
                url: `https://framerusercontent.com/assets/hyOgCu0Xnghbimh0pE8QTvtt2AU.woff2`,
                weight: `600`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`,
                url: `https://framerusercontent.com/assets/NeGmSOXrPBfEFIy5YZeHq17LEDA.woff2`,
                weight: `600`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+1F00-1FFF`,
                url: `https://framerusercontent.com/assets/oYaAX5himiTPYuN8vLWnqBbfD2s.woff2`,
                weight: `600`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0370-03FF`,
                url: `https://framerusercontent.com/assets/lEJLP4R0yuCaMCjSXYHtJw72M.woff2`,
                weight: `600`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF`,
                url: `https://framerusercontent.com/assets/cRJyLNuTJR5jbyKzGi33wU9cqIQ.woff2`,
                weight: `600`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,
                url: `/web1/assets/fonts/yDtI2UI8XcEg1W2je9XPN3Noo.woff2`,
                weight: `600`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`,
                url: `https://framerusercontent.com/assets/A0Wcc7NgXMjUuFdquHDrIZpzZw0.woff2`,
                weight: `600`,
              },
            ],
          },
        ],
        { supportsExplicitInterCodegen: !0 }
      ));
  });
function Wt(e, ...t) {
  let n = {};
  return (t?.forEach((t) => t && Object.assign(n, e[t])), n);
}
var Gt,
  Kt,
  qt,
  Jt,
  Yt,
  Xt,
  Zt,
  Qt,
  $t,
  en,
  tn,
  nn,
  rn,
  an,
  on,
  sn,
  G,
  cn,
  ln = e(() => {
    (y(),
      O(),
      D(),
      n(),
      ut(),
      yt(),
      Ot(),
      Ue(),
      We(),
      Ke(),
      Mt(),
      Ut(),
      $e(),
      (Gt = j(W)),
      (Kt = j(vt)),
      (qt = j(lt)),
      (Jt = j(Dt)),
      (Yt = j(H)),
      (Xt = [`wD03utLBO`, `S3lQb9osw`]),
      (Zt = `framer-CCrsO`),
      (Qt = { S3lQb9osw: `framer-v-17uus8n`, wD03utLBO: `framer-v-1wtzj9q` }),
      ($t = { bounce: 0.2, delay: 0, duration: 0.4, type: `spring` }),
      (en = (...e) => {
        for (let t of e) if (t && typeof t == `string`) return t;
      }),
      oe(),
      (tn = {
        opacity: 0.6,
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 0.94,
        skewX: 0,
        skewY: 0,
        transition: $t,
      }),
      (nn = ({ value: e, children: n }) => {
        let r = _(T),
          i = e ?? r.transition,
          a = t(() => ({ ...r, transition: i }), [JSON.stringify(i)]);
        return f(T.Provider, { value: a, children: n });
      }),
      (rn = { Desktop: `wD03utLBO`, Phone: `S3lQb9osw` }),
      (an = w.create(s)),
      (on = ({ height: e, id: t, width: n, ...r }) => ({
        ...r,
        variant: rn[r.variant] ?? r.variant ?? `wD03utLBO`,
      })),
      (sn = (e, t) => (e.layoutDependency ? t.join(`-`) + e.layoutDependency : t.join(`-`))),
      (G = z(
        p(function (e, t) {
          let n = r(null),
            i = t ?? n,
            a = S(),
            { activeLocale: o, setLocale: c } = I(),
            l = ce(),
            { style: u, className: d, layoutId: p, variant: m, ...h } = on(e),
            {
              baseVariant: g,
              classNames: _,
              clearLoadingGesture: ee,
              gestureHandlers: te,
              gestureVariant: y,
              isLoading: ne,
              setGestureState: re,
              setVariant: b,
              variants: x,
            } = De({
              cycleOrder: Xt,
              defaultVariant: `wD03utLBO`,
              ref: i,
              variant: m,
              variantClassNames: Qt,
            }),
            C = sn(e, x),
            T = B(Zt, Qe, Ge, jt, Ye);
          return f(E, {
            id: p ?? a,
            children: f(an, {
              animate: x,
              initial: !1,
              children: f(nn, {
                value: $t,
                children: f(w.footer, {
                  ...h,
                  ...te,
                  className: B(T, `framer-1wtzj9q`, d, _),
                  "data-border": !0,
                  "data-framer-name": `Desktop`,
                  layoutDependency: C,
                  layoutId: `wD03utLBO`,
                  ref: i,
                  style: {
                    "--border-bottom-width": `1px`,
                    "--border-color": `var(--token-9dc0c0fe-cfd7-4346-b8bf-156a4b1e4ce3, rgb(242, 242, 242))`,
                    "--border-left-width": `0px`,
                    "--border-right-width": `0px`,
                    "--border-style": `solid`,
                    "--border-top-width": `1px`,
                    backgroundColor: `var(--token-49d4c8d9-c1f7-42d2-aef0-e4197c80fb61, rgb(255, 255, 255))`,
                    ...u,
                  },
                  ...Wt({ S3lQb9osw: { "data-framer-name": `Phone` } }, g, y),
                  children: v(w.div, {
                    className: `framer-16johgl`,
                    "data-framer-name": `Container`,
                    layout: `position`,
                    layoutDependency: C,
                    layoutId: `TICYNjyAP`,
                    children: [
                      v(w.div, {
                        className: `framer-1r4rsg8`,
                        layoutDependency: C,
                        layoutId: `rbZHzDX7S`,
                        children: [
                          v(w.div, {
                            className: `framer-11tzykc`,
                            layoutDependency: C,
                            layoutId: `yKtrW4Nuz`,
                            children: [
                              f(L, {
                                height: 38,
                                y:
                                  (l?.y || 0) +
                                  100 +
                                  (((l?.height || 438) - 200 - 385) / 2 + 0 + 0) +
                                  0 +
                                  0 +
                                  0 +
                                  0 +
                                  0,
                                ...Wt(
                                  {
                                    S3lQb9osw: {
                                      y:
                                        (l?.y || 0) +
                                        60 +
                                        (((l?.height || 572) - 120 - 682) / 2 + 0 + 0) +
                                        0 +
                                        0 +
                                        0 +
                                        0 +
                                        0 +
                                        0,
                                    },
                                  },
                                  g,
                                  y
                                ),
                                children: f(Le, {
                                  className: `framer-1jm9ue8-container`,
                                  layoutDependency: C,
                                  layoutId: `JlRf06tME-container`,
                                  nodeId: `JlRf06tME`,
                                  rendersWithMotion: !0,
                                  scopeId: `HxEJ0BC4j`,
                                  children: f(W, {
                                    height: `100%`,
                                    id: `JlRf06tME`,
                                    layoutId: `JlRf06tME`,
                                    variant: en(`iSW21XBF8`),
                                    width: `100%`,
                                  }),
                                }),
                              }),
                              f(N, {
                                __fromCanvasComponent: !0,
                                children: f(s, {
                                  children: f(w.p, {
                                    className: `framer-styles-preset-1iiwaoi`,
                                    "data-styles-preset": `PaEx8P9ci`,
                                    dir: `auto`,
                                    style: { "--framer-text-alignment": `left` },
                                    children: `AirBook combines booking, reminders, and checkout into one intelligent studio platform.`,
                                  }),
                                }),
                                className: `framer-hwvrx`,
                                fonts: [`Inter`],
                                layoutDependency: C,
                                layoutId: `rxnL7fVUY`,
                                verticalAlignment: `top`,
                                withExternalLayout: !0,
                              }),
                              v(w.div, {
                                className: `framer-13c41iu`,
                                layoutDependency: C,
                                layoutId: `PZ14QlYRn`,
                                children: [
                                  f(R, {
                                    href: `facebook.com`,
                                    motionChild: !0,
                                    nodeId: `Mb6H_IgHJ`,
                                    openInNewTab: !0,
                                    scopeId: `HxEJ0BC4j`,
                                    children: f(w.a, {
                                      className: `framer-1jufqvq framer-1auzuh`,
                                      "data-border": !0,
                                      "data-framer-name": `Inline Link`,
                                      layoutDependency: C,
                                      layoutId: `Mb6H_IgHJ`,
                                      style: {
                                        "--border-bottom-width": `1px`,
                                        "--border-color": `rgba(0, 0, 0, 0.1)`,
                                        "--border-left-width": `1px`,
                                        "--border-right-width": `1px`,
                                        "--border-style": `solid`,
                                        "--border-top-width": `1px`,
                                        "--corner-shape-fallback": 0.752,
                                        backgroundColor: `rgb(246, 246, 246)`,
                                        borderBottomLeftRadius: `calc(16px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                                        borderBottomRightRadius: `calc(16px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                                        borderTopLeftRadius: `calc(16px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                                        borderTopRightRadius: `calc(16px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                                        boxShadow: `-0.19590753775264602px 0.7836301510105841px 0.807747471008839px -0.5357142857142857px rgba(0, 0, 0, 0.02), -0.47991189592576117px 1.9196475837030447px 1.9787274378923432px -1.0714285714285714px rgba(0, 0, 0, 0.02), -0.9093636897945544px 3.6374547591782176px 3.7494025451243607px -1.607142857142857px rgba(0, 0, 0, 0.02), -1.5875112037145298px 6.350044814858119px 6.545476374766442px -2.142857142857143px rgba(0, 0, 0, 0.02), -2.762967642510193px 11.051870570040771px 11.392007430233342px -2.678571428571429px rgba(0, 0, 0, 0.02), -5.060702987699187px 20.24281195079675px 20.86581295816262px -3.214285714285714px rgba(0, 0, 0, 0.01), -10px 40px 41.23105625617661px -3.75px rgba(0, 0, 0, 0.01), inset 0px 14px 10px 0px rgb(255, 255, 255)`,
                                        cornerShape: `superellipse(1.5)`,
                                      },
                                      whileHover: tn,
                                      children: f(vt, {
                                        animated: !0,
                                        className: `framer-3zi213`,
                                        layoutDependency: C,
                                        layoutId: `XhooO3k6Q`,
                                        style: {
                                          "--1m973uw": `var(--token-db788891-ba10-4012-9273-117ab7af4ea3, rgb(0, 0, 0))`,
                                          "--js9iwy": 1.8,
                                        },
                                      }),
                                    }),
                                  }),
                                  f(R, {
                                    href: `https://x.com/zainmalikig`,
                                    motionChild: !0,
                                    nodeId: `Sq_gfiC7f`,
                                    openInNewTab: !0,
                                    scopeId: `HxEJ0BC4j`,
                                    children: f(w.a, {
                                      className: `framer-1y16hpx framer-1auzuh`,
                                      "data-border": !0,
                                      "data-framer-name": `Inline Link`,
                                      layoutDependency: C,
                                      layoutId: `Sq_gfiC7f`,
                                      style: {
                                        "--border-bottom-width": `1px`,
                                        "--border-color": `rgba(0, 0, 0, 0.1)`,
                                        "--border-left-width": `1px`,
                                        "--border-right-width": `1px`,
                                        "--border-style": `solid`,
                                        "--border-top-width": `1px`,
                                        "--corner-shape-fallback": 0.752,
                                        backgroundColor: `rgb(246, 246, 246)`,
                                        borderBottomLeftRadius: `calc(16px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                                        borderBottomRightRadius: `calc(16px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                                        borderTopLeftRadius: `calc(16px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                                        borderTopRightRadius: `calc(16px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                                        boxShadow: `-0.19590753775264602px 0.7836301510105841px 0.807747471008839px -0.5357142857142857px rgba(0, 0, 0, 0.02), -0.47991189592576117px 1.9196475837030447px 1.9787274378923432px -1.0714285714285714px rgba(0, 0, 0, 0.02), -0.9093636897945544px 3.6374547591782176px 3.7494025451243607px -1.607142857142857px rgba(0, 0, 0, 0.02), -1.5875112037145298px 6.350044814858119px 6.545476374766442px -2.142857142857143px rgba(0, 0, 0, 0.02), -2.762967642510193px 11.051870570040771px 11.392007430233342px -2.678571428571429px rgba(0, 0, 0, 0.02), -5.060702987699187px 20.24281195079675px 20.86581295816262px -3.214285714285714px rgba(0, 0, 0, 0.01), -10px 40px 41.23105625617661px -3.75px rgba(0, 0, 0, 0.01), inset 0px 14px 10px 0px rgb(255, 255, 255)`,
                                        cornerShape: `superellipse(1.5)`,
                                      },
                                      whileHover: tn,
                                      children: f(lt, {
                                        animated: !0,
                                        className: `framer-oez6un`,
                                        layoutDependency: C,
                                        layoutId: `qCdHXJMVD`,
                                        style: {
                                          "--1m973uw": `var(--token-db788891-ba10-4012-9273-117ab7af4ea3, rgb(0, 0, 0))`,
                                          "--js9iwy": 1.8,
                                        },
                                      }),
                                    }),
                                  }),
                                  f(R, {
                                    href: `instagram.com`,
                                    motionChild: !0,
                                    nodeId: `aEzSMEP5p`,
                                    openInNewTab: !0,
                                    scopeId: `HxEJ0BC4j`,
                                    children: f(w.a, {
                                      className: `framer-rr0xce framer-1auzuh`,
                                      "data-border": !0,
                                      "data-framer-name": `Inline Link`,
                                      layoutDependency: C,
                                      layoutId: `aEzSMEP5p`,
                                      style: {
                                        "--border-bottom-width": `1px`,
                                        "--border-color": `rgba(0, 0, 0, 0.1)`,
                                        "--border-left-width": `1px`,
                                        "--border-right-width": `1px`,
                                        "--border-style": `solid`,
                                        "--border-top-width": `1px`,
                                        "--corner-shape-fallback": 0.752,
                                        backgroundColor: `rgb(246, 246, 246)`,
                                        borderBottomLeftRadius: `calc(16px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                                        borderBottomRightRadius: `calc(16px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                                        borderTopLeftRadius: `calc(16px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                                        borderTopRightRadius: `calc(16px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                                        boxShadow: `-0.19590753775264602px 0.7836301510105841px 0.807747471008839px -0.5357142857142857px rgba(0, 0, 0, 0.02), -0.47991189592576117px 1.9196475837030447px 1.9787274378923432px -1.0714285714285714px rgba(0, 0, 0, 0.02), -0.9093636897945544px 3.6374547591782176px 3.7494025451243607px -1.607142857142857px rgba(0, 0, 0, 0.02), -1.5875112037145298px 6.350044814858119px 6.545476374766442px -2.142857142857143px rgba(0, 0, 0, 0.02), -2.762967642510193px 11.051870570040771px 11.392007430233342px -2.678571428571429px rgba(0, 0, 0, 0.02), -5.060702987699187px 20.24281195079675px 20.86581295816262px -3.214285714285714px rgba(0, 0, 0, 0.01), -10px 40px 41.23105625617661px -3.75px rgba(0, 0, 0, 0.01), inset 0px 14px 10px 0px rgb(255, 255, 255)`,
                                        cornerShape: `superellipse(1.5)`,
                                      },
                                      whileHover: tn,
                                      children: f(Dt, {
                                        animated: !0,
                                        className: `framer-egs9qf`,
                                        layoutDependency: C,
                                        layoutId: `vYOwos_d9`,
                                        style: {
                                          "--1m973uw": `var(--token-db788891-ba10-4012-9273-117ab7af4ea3, rgb(0, 0, 0))`,
                                          "--js9iwy": 1.8,
                                        },
                                      }),
                                    }),
                                  }),
                                  f(L, {
                                    height: 36,
                                    y:
                                      (l?.y || 0) +
                                      100 +
                                      (((l?.height || 438) - 200 - 385) / 2 + 0 + 0) +
                                      0 +
                                      0 +
                                      0 +
                                      0 +
                                      183 +
                                      0,
                                    ...Wt(
                                      {
                                        S3lQb9osw: {
                                          y:
                                            (l?.y || 0) +
                                            60 +
                                            (((l?.height || 572) - 120 - 682) / 2 + 0 + 0) +
                                            0 +
                                            0 +
                                            0 +
                                            0 +
                                            0 +
                                            183 +
                                            0,
                                        },
                                      },
                                      g,
                                      y
                                    ),
                                    children: f(Le, {
                                      className: `framer-s4q9ck-container`,
                                      layoutDependency: C,
                                      layoutId: `raL7454UO-container`,
                                      nodeId: `raL7454UO`,
                                      rendersWithMotion: !0,
                                      scopeId: `HxEJ0BC4j`,
                                      children: f(H, {
                                        height: `100%`,
                                        id: `raL7454UO`,
                                        iO6YqVFFu: `mailto:support@getairbook.com`,
                                        layoutId: `raL7454UO`,
                                        variant: en(`a_q85DzHB`),
                                        VCaJp8H3g: `Contact`,
                                        width: `100%`,
                                        Yb_1M_kZR: !0,
                                      }),
                                    }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                          v(w.div, {
                            className: `framer-axlvbg`,
                            "data-framer-name": `Links`,
                            layoutDependency: C,
                            layoutId: `tpAfaQKzC`,
                            children: [
                              v(w.div, {
                                className: `framer-1dtdsdj`,
                                layoutDependency: C,
                                layoutId: `pW4UQmHiP`,
                                children: [
                                  f(N, {
                                    __fromCanvasComponent: !0,
                                    children: f(s, {
                                      children: f(w.p, {
                                        className: `framer-styles-preset-njbii5`,
                                        "data-styles-preset": `Jk5tW_Wev`,
                                        dir: `auto`,
                                        style: {
                                          "--framer-text-alignment": `left`,
                                          "--framer-text-color": `var(--extracted-r6o4lv, var(--token-db788891-ba10-4012-9273-117ab7af4ea3, rgb(0, 0, 0)))`,
                                        },
                                        children: `Product`,
                                      }),
                                    }),
                                    className: `framer-1onpugg`,
                                    fonts: [`Inter`],
                                    layoutDependency: C,
                                    layoutId: `lyT410e13`,
                                    style: {
                                      "--extracted-r6o4lv": `var(--token-db788891-ba10-4012-9273-117ab7af4ea3, rgb(0, 0, 0))`,
                                    },
                                    verticalAlignment: `top`,
                                    withExternalLayout: !0,
                                  }),
                                  f(N, {
                                    __fromCanvasComponent: !0,
                                    children: f(s, {
                                      children: f(w.p, {
                                        className: `framer-styles-preset-1iiwaoi`,
                                        "data-styles-preset": `PaEx8P9ci`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:AJk799GZA`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `DtvA0F2QW`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `HxEJ0BC4j`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-vbiryt`,
                                            "data-styles-preset": `yJ1gcXmCK`,
                                            children: `Benefits`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    className: `framer-lwkmfi`,
                                    fonts: [`Inter`],
                                    layoutDependency: C,
                                    layoutId: `DtvA0F2QW`,
                                    verticalAlignment: `top`,
                                    withExternalLayout: !0,
                                  }),
                                  f(N, {
                                    __fromCanvasComponent: !0,
                                    children: f(s, {
                                      children: f(w.p, {
                                        className: `framer-styles-preset-1iiwaoi`,
                                        "data-styles-preset": `PaEx8P9ci`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:PsrjeqlZT`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `FlD_byGgY`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `HxEJ0BC4j`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-vbiryt`,
                                            "data-styles-preset": `yJ1gcXmCK`,
                                            children: `Features`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    className: `framer-16vz88y`,
                                    fonts: [`Inter`],
                                    layoutDependency: C,
                                    layoutId: `FlD_byGgY`,
                                    verticalAlignment: `top`,
                                    withExternalLayout: !0,
                                  }),
                                  f(N, {
                                    __fromCanvasComponent: !0,
                                    children: f(s, {
                                      children: f(w.p, {
                                        className: `framer-styles-preset-1iiwaoi`,
                                        "data-styles-preset": `PaEx8P9ci`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:WwGCP5J8y`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `Nt3veIZRl`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `HxEJ0BC4j`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-vbiryt`,
                                            "data-styles-preset": `yJ1gcXmCK`,
                                            children: `Pricing`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    className: `framer-bhm9se`,
                                    fonts: [`Inter`],
                                    layoutDependency: C,
                                    layoutId: `Nt3veIZRl`,
                                    verticalAlignment: `top`,
                                    withExternalLayout: !0,
                                  }),
                                  f(N, {
                                    __fromCanvasComponent: !0,
                                    children: f(s, {
                                      children: f(w.p, {
                                        className: `framer-styles-preset-1iiwaoi`,
                                        "data-styles-preset": `PaEx8P9ci`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:fA83PcgiE`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `PYEvc7IeM`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `HxEJ0BC4j`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-vbiryt`,
                                            "data-styles-preset": `yJ1gcXmCK`,
                                            children: `Download`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    className: `framer-za3zqo`,
                                    fonts: [`Inter`],
                                    layoutDependency: C,
                                    layoutId: `PYEvc7IeM`,
                                    verticalAlignment: `top`,
                                    withExternalLayout: !0,
                                  }),
                                ],
                              }),
                              v(w.div, {
                                className: `framer-1wwhe95`,
                                "data-framer-name": `More Links`,
                                layoutDependency: C,
                                layoutId: `B0t3SQDVN`,
                                children: [
                                  f(N, {
                                    __fromCanvasComponent: !0,
                                    children: f(s, {
                                      children: f(w.p, {
                                        className: `framer-styles-preset-njbii5`,
                                        "data-styles-preset": `Jk5tW_Wev`,
                                        dir: `auto`,
                                        style: {
                                          "--framer-text-alignment": `left`,
                                          "--framer-text-color": `var(--extracted-r6o4lv, var(--token-db788891-ba10-4012-9273-117ab7af4ea3, rgb(0, 0, 0)))`,
                                        },
                                        children: `More`,
                                      }),
                                    }),
                                    className: `framer-124x52h`,
                                    fonts: [`Inter`],
                                    layoutDependency: C,
                                    layoutId: `kHtwGwESr`,
                                    style: {
                                      "--extracted-r6o4lv": `var(--token-db788891-ba10-4012-9273-117ab7af4ea3, rgb(0, 0, 0))`,
                                    },
                                    verticalAlignment: `top`,
                                    withExternalLayout: !0,
                                  }),
                                  f(N, {
                                    __fromCanvasComponent: !0,
                                    children: f(s, {
                                      children: f(w.p, {
                                        className: `framer-styles-preset-1iiwaoi`,
                                        "data-styles-preset": `PaEx8P9ci`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:do7Un9NMc`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `mhUbFObcv`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `HxEJ0BC4j`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-vbiryt`,
                                            "data-styles-preset": `yJ1gcXmCK`,
                                            children: `Integration`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    className: `framer-d2vhij`,
                                    fonts: [`Inter`],
                                    layoutDependency: C,
                                    layoutId: `mhUbFObcv`,
                                    verticalAlignment: `top`,
                                    withExternalLayout: !0,
                                  }),
                                  f(N, {
                                    __fromCanvasComponent: !0,
                                    children: f(s, {
                                      children: f(w.p, {
                                        className: `framer-styles-preset-1iiwaoi`,
                                        "data-styles-preset": `PaEx8P9ci`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:uDwtapgnK`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `NcwMarpzE`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `HxEJ0BC4j`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-vbiryt`,
                                            "data-styles-preset": `yJ1gcXmCK`,
                                            children: `Questions`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    className: `framer-1h2pkae`,
                                    fonts: [`Inter`],
                                    layoutDependency: C,
                                    layoutId: `NcwMarpzE`,
                                    verticalAlignment: `top`,
                                    withExternalLayout: !0,
                                  }),
                                  f(N, {
                                    __fromCanvasComponent: !0,
                                    children: f(s, {
                                      children: f(w.p, {
                                        className: `framer-styles-preset-1iiwaoi`,
                                        "data-styles-preset": `PaEx8P9ci`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:qi61tIN0U`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `KV9yY_7JO`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `HxEJ0BC4j`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-vbiryt`,
                                            "data-styles-preset": `yJ1gcXmCK`,
                                            children: `Reviews`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    className: `framer-1l8pu0s`,
                                    fonts: [`Inter`],
                                    layoutDependency: C,
                                    layoutId: `KV9yY_7JO`,
                                    verticalAlignment: `top`,
                                    withExternalLayout: !0,
                                  }),
                                  f(N, {
                                    __fromCanvasComponent: !0,
                                    children: f(s, {
                                      children: f(w.p, {
                                        className: `framer-styles-preset-1iiwaoi`,
                                        "data-styles-preset": `PaEx8P9ci`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: `mailto:support@getairbook.com`,
                                          motionChild: !0,
                                          nodeId: `Lp8p4eF4u`,
                                          openInNewTab: !0,
                                          relValues: [],
                                          scopeId: `HxEJ0BC4j`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-vbiryt`,
                                            "data-styles-preset": `yJ1gcXmCK`,
                                            children: `Support`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    className: `framer-1cn49tj`,
                                    fonts: [`Inter`],
                                    layoutDependency: C,
                                    layoutId: `Lp8p4eF4u`,
                                    verticalAlignment: `top`,
                                    withExternalLayout: !0,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      f(w.div, {
                        className: `framer-69njrw`,
                        "data-framer-name": `Divider`,
                        layoutDependency: C,
                        layoutId: `T6VjnSTHv`,
                        style: {
                          backgroundColor: `var(--token-9dc0c0fe-cfd7-4346-b8bf-156a4b1e4ce3, rgb(242, 242, 242))`,
                        },
                      }),
                      v(w.div, {
                        className: `framer-9eu27f`,
                        layoutDependency: C,
                        layoutId: `x6v7t3284`,
                        children: [
                          f(N, {
                            __fromCanvasComponent: !0,
                            children: f(s, {
                              children: f(w.p, {
                                className: `framer-styles-preset-1iiwaoi`,
                                "data-styles-preset": `PaEx8P9ci`,
                                dir: `auto`,
                                style: { "--framer-text-alignment": `left` },
                                children: `AirBook © 2026. All rights reserved.`,
                              }),
                            }),
                            className: `framer-1volb3h`,
                            fonts: [`Inter`],
                            layoutDependency: C,
                            layoutId: `sMMqU0S5c`,
                            verticalAlignment: `top`,
                            withExternalLayout: !0,
                          }),
                          f(N, {
                            __fromCanvasComponent: !0,
                            children: f(s, {
                              children: v(w.p, {
                                className: `framer-styles-preset-1iiwaoi`,
                                "data-styles-preset": `PaEx8P9ci`,
                                dir: `auto`,
                                style: { "--framer-text-alignment": `right` },
                                children: [
                                  `Template by `,
                                  f(R, {
                                    href: `framer.com/@zain`,
                                    motionChild: !0,
                                    nodeId: `qkTLeQOHE`,
                                    openInNewTab: !0,
                                    preserveParams: !1,
                                    relValues: [],
                                    scopeId: `HxEJ0BC4j`,
                                    smoothScroll: !1,
                                    children: f(w.a, {
                                      className: `framer-styles-preset-19ilhe2`,
                                      "data-styles-preset": `uGN4e2VJh`,
                                      children: `Zain Malik`,
                                    }),
                                  }),
                                ],
                              }),
                            }),
                            className: `framer-1x16fk7`,
                            fonts: [`Inter`],
                            layoutDependency: C,
                            layoutId: `qkTLeQOHE`,
                            verticalAlignment: `top`,
                            withExternalLayout: !0,
                            ...Wt(
                              {
                                S3lQb9osw: {
                                  children: f(s, {
                                    children: v(w.p, {
                                      className: `framer-styles-preset-1iiwaoi`,
                                      "data-styles-preset": `PaEx8P9ci`,
                                      dir: `auto`,
                                      style: { "--framer-text-alignment": `left` },
                                      children: [
                                        `Template by `,
                                        f(R, {
                                          href: `framer.com/@zain`,
                                          motionChild: !0,
                                          nodeId: `qkTLeQOHE`,
                                          openInNewTab: !0,
                                          preserveParams: !1,
                                          relValues: [],
                                          scopeId: `HxEJ0BC4j`,
                                          smoothScroll: !1,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-19ilhe2`,
                                            "data-styles-preset": `uGN4e2VJh`,
                                            children: `Zain Malik`,
                                          }),
                                        }),
                                      ],
                                    }),
                                  }),
                                },
                              },
                              g,
                              y
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              }),
            }),
          });
        }),
        [
          `@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,
          `.framer-CCrsO.framer-1auzuh, .framer-CCrsO .framer-1auzuh { display: block; }`,
          `.framer-CCrsO.framer-1wtzj9q { align-content: center; align-items: center; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 40px; height: min-content; justify-content: center; overflow: visible; padding: 100px 20px 100px 20px; position: relative; width: 1200px; }`,
          `.framer-CCrsO .framer-16johgl { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 30px; height: min-content; justify-content: center; max-width: 1160px; overflow: visible; padding: 0px; position: relative; width: 100%; }`,
          `.framer-CCrsO .framer-1r4rsg8 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 40px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 100%; }`,
          `.framer-CCrsO .framer-11tzykc { align-content: flex-start; align-items: flex-start; display: flex; flex: 1 0 0px; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 1px; }`,
          `.framer-CCrsO .framer-1jm9ue8-container, .framer-CCrsO .framer-s4q9ck-container { flex: none; height: auto; position: relative; width: auto; }`,
          `.framer-CCrsO .framer-hwvrx { --framer-text-wrap-override: balance; flex: none; height: auto; max-width: 400px; position: relative; width: 100%; }`,
          `.framer-CCrsO .framer-13c41iu { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 12px; height: min-content; justify-content: flex-end; overflow: visible; padding: 0px; position: relative; width: min-content; }`,
          `.framer-CCrsO .framer-1jufqvq, .framer-CCrsO .framer-1y16hpx, .framer-CCrsO .framer-rr0xce { align-content: center; align-items: center; cursor: pointer; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: visible; padding: 8px; position: relative; text-decoration: none; width: min-content; will-change: var(--framer-will-change-effect-override, transform); }`,
          `.framer-CCrsO .framer-3zi213, .framer-CCrsO .framer-oez6un, .framer-CCrsO .framer-egs9qf { flex: none; height: var(--framer-aspect-ratio-supported, 19px); position: relative; width: 18px; }`,
          `.framer-CCrsO .framer-axlvbg { align-content: flex-start; align-items: flex-start; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 80px; height: min-content; justify-content: flex-end; overflow: visible; padding: 0px; position: relative; width: 1px; }`,
          `.framer-CCrsO .framer-1dtdsdj, .framer-CCrsO .framer-1wwhe95 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 6px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: min-content; }`,
          `.framer-CCrsO .framer-1onpugg, .framer-CCrsO .framer-lwkmfi, .framer-CCrsO .framer-16vz88y, .framer-CCrsO .framer-bhm9se, .framer-CCrsO .framer-za3zqo, .framer-CCrsO .framer-124x52h, .framer-CCrsO .framer-d2vhij, .framer-CCrsO .framer-1h2pkae, .framer-CCrsO .framer-1l8pu0s, .framer-CCrsO .framer-1cn49tj { flex: none; height: auto; position: relative; white-space: pre; width: auto; }`,
          `.framer-CCrsO .framer-69njrw { flex: none; height: 1px; overflow: visible; position: relative; width: 100%; }`,
          `.framer-CCrsO .framer-9eu27f { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 100%; }`,
          `.framer-CCrsO .framer-1volb3h, .framer-CCrsO .framer-1x16fk7 { flex: 1 0 0px; height: auto; position: relative; white-space: pre-wrap; width: 1px; word-break: break-word; word-wrap: break-word; }`,
          `.framer-CCrsO.framer-v-17uus8n.framer-1wtzj9q { padding: 60px 20px 60px 20px; width: 390px; }`,
          `.framer-CCrsO.framer-v-17uus8n .framer-1r4rsg8 { flex-direction: column; }`,
          `.framer-CCrsO.framer-v-17uus8n .framer-11tzykc, .framer-CCrsO.framer-v-17uus8n .framer-1volb3h, .framer-CCrsO.framer-v-17uus8n .framer-1x16fk7 { flex: none; width: 100%; }`,
          `.framer-CCrsO.framer-v-17uus8n .framer-axlvbg { flex: none; justify-content: flex-start; width: 100%; }`,
          `.framer-CCrsO.framer-v-17uus8n .framer-9eu27f { align-content: flex-start; align-items: flex-start; flex-direction: column; }`,
          ...ze,
          ...qe,
          ...At,
          ...Ve,
          `.framer-CCrsO[data-border="true"]::after, .framer-CCrsO [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; corner-shape: inherit; pointer-events: none; }`,
        ],
        `framer-CCrsO`
      )),
      (cn = G),
      (G.displayName = `Footer`),
      (G.defaultProps = { height: 438, width: 1200 }),
      V(G, {
        variant: {
          options: [`wD03utLBO`, `S3lQb9osw`],
          optionTitles: [`Desktop`, `Phone`],
          title: `Variant`,
          type: F.Enum,
        },
      }),
      P(
        G,
        [
          {
            explicitInter: !0,
            fonts: [
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F`,
                url: `https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2`,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`,
                url: `https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2`,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+1F00-1FFF`,
                url: `https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2`,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0370-03FF`,
                url: `https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2`,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF`,
                url: `https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2`,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,
                url: `https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2`,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`,
                url: `https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2`,
                weight: `400`,
              },
            ],
          },
          ...Gt,
          ...Kt,
          ...qt,
          ...Jt,
          ...Yt,
          ...M(Ze),
          ...M(He),
          ...M(kt),
          ...M(Be),
        ],
        { supportsExplicitInterCodegen: !0 }
      ),
      (G.loader = { load: (e, t) => (t.locale, Promise.allSettled([k(W, {}, t), k(H, {}, t)])) }));
  }),
  un,
  dn,
  fn,
  pn = e(() => {
    (O(),
      ue.loadFonts([]),
      (un = [{ explicitInter: !0, fonts: [] }]),
      (dn = [
        `.framer-mlPpK .framer-styles-preset-ku8eff:not(.rich-text-wrapper), .framer-mlPpK .framer-styles-preset-ku8eff.rich-text-wrapper a { --framer-link-hover-text-color: rgba(255, 255, 255, 0.6); --framer-link-text-color: var(--token-49d4c8d9-c1f7-42d2-aef0-e4197c80fb61, #ffffff); transition-delay: 0s; transition-duration: 0.3s; transition-property: color; transition-timing-function: cubic-bezier(0.44, 0, 0.56, 1); }`,
      ]),
      (fn = `framer-mlPpK`));
  });
function K(e, ...t) {
  let n = {};
  return (t?.forEach((t) => t && Object.assign(n, e[t])), n);
}
var mn,
  hn,
  gn,
  _n,
  vn,
  yn,
  bn,
  xn,
  Sn,
  Cn,
  wn,
  Tn,
  q,
  En,
  Dn = e(() => {
    (y(),
      O(),
      D(),
      n(),
      Ue(),
      Je(),
      pn(),
      Ut(),
      $e(),
      (mn = j(W)),
      (hn = j(H)),
      (gn = [`JqDqua8ky`, `k2end4pNp`, `OKX8Xgj78`]),
      (_n = `framer-MKb9M`),
      (vn = {
        JqDqua8ky: `framer-v-15dolj1`,
        k2end4pNp: `framer-v-1qgwkw5`,
        OKX8Xgj78: `framer-v-1a02yfm`,
      }),
      oe(),
      (yn = { damping: 40, delay: 0, mass: 1, stiffness: 400, type: `spring` }),
      (bn = (...e) => {
        for (let t of e) if (t && typeof t == `string`) return t;
      }),
      (xn = ({ value: e, children: n }) => {
        let r = _(T),
          i = e ?? r.transition,
          a = t(() => ({ ...r, transition: i }), [JSON.stringify(i)]);
        return f(T.Provider, { value: a, children: n });
      }),
      (Sn = { "Phone Open": `OKX8Xgj78`, Desktop: `JqDqua8ky`, Phone: `k2end4pNp` }),
      (Cn = w.create(s)),
      (wn = ({ height: e, id: t, width: n, ...r }) => ({
        ...r,
        variant: Sn[r.variant] ?? r.variant ?? `JqDqua8ky`,
      })),
      (Tn = (e, t) => (e.layoutDependency ? t.join(`-`) + e.layoutDependency : t.join(`-`))),
      (q = z(
        p(function (e, t) {
          let n = r(null),
            i = t ?? n,
            a = S(),
            { activeLocale: o, setLocale: c } = I(),
            l = ce(),
            { style: u, className: d, layoutId: p, variant: m, ...h } = wn(e),
            {
              baseVariant: g,
              classNames: _,
              clearLoadingGesture: ee,
              gestureHandlers: te,
              gestureVariant: y,
              isLoading: ne,
              setGestureState: re,
              setVariant: b,
              variants: x,
            } = De({
              cycleOrder: gn,
              defaultVariant: `JqDqua8ky`,
              ref: i,
              variant: m,
              variantClassNames: vn,
            }),
            C = Tn(e, x),
            { activeVariantCallback: T, delay: D } = me(g),
            ie = T(async (...e) => {
              b(`k2end4pNp`);
            }),
            O = T(async (...e) => {
              b(`OKX8Xgj78`);
            }),
            k = T(async (...e) => {
              b(`k2end4pNp`);
            }),
            A = B(_n, Ge, fn, tt),
            ae = () => !![`k2end4pNp`, `OKX8Xgj78`].includes(g);
          return (
            Fe(),
            f(E, {
              id: p ?? a,
              children: f(Cn, {
                animate: x,
                initial: !1,
                children: f(xn, {
                  value: yn,
                  children: f(w.nav, {
                    ...h,
                    ...te,
                    className: B(A, `framer-15dolj1`, d, _),
                    "data-framer-name": `Desktop`,
                    "data-hide-scrollbars": !0,
                    layoutDependency: C,
                    layoutId: `JqDqua8ky`,
                    ref: i,
                    style: {
                      "--corner-shape-fallback": 0.892,
                      borderBottomLeftRadius: `calc(20px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                      borderBottomRightRadius: `calc(20px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                      borderTopLeftRadius: `calc(20px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                      borderTopRightRadius: `calc(20px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                      cornerShape: `superellipse(1.2)`,
                      ...u,
                    },
                    ...K(
                      {
                        k2end4pNp: { "data-framer-name": `Phone` },
                        OKX8Xgj78: { "data-framer-name": `Phone Open` },
                      },
                      g,
                      y
                    ),
                    children: v(w.div, {
                      className: `framer-18h3hj0`,
                      "data-framer-name": `Container`,
                      "data-hide-scrollbars": !0,
                      layoutDependency: C,
                      layoutId: `PTskkbEZd`,
                      style: {
                        "--corner-shape-fallback": 0.752,
                        backdropFilter: `blur(10px)`,
                        backgroundColor: `rgba(0, 0, 0, 0.7)`,
                        borderBottomLeftRadius: `calc(24px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                        borderBottomRightRadius: `calc(24px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                        borderTopLeftRadius: `calc(24px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                        borderTopRightRadius: `calc(24px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                        cornerShape: `superellipse(1.5)`,
                        WebkitBackdropFilter: `blur(10px)`,
                      },
                      variants: { OKX8Xgj78: { backgroundColor: `rgba(0, 0, 0, 0.8)` } },
                      children: [
                        v(w.div, {
                          className: `framer-7dtpvg`,
                          "data-framer-name": `Top`,
                          layoutDependency: C,
                          layoutId: `hkKbRSHgW`,
                          children: [
                            f(L, {
                              height: 38,
                              y: (l?.y || 0) + (0 + ((l?.height || 54) - 0 - 54) / 2) + 8 + 0,
                              ...K(
                                {
                                  k2end4pNp: { y: (l?.y || 0) + 0 + 0 + 5 + 0 + 3 },
                                  OKX8Xgj78: { y: (l?.y || 0) + 0 + 0 + 8 + 0 + 3 },
                                },
                                g,
                                y
                              ),
                              children: f(Le, {
                                className: `framer-1dpuhjh-container`,
                                layoutDependency: C,
                                layoutId: `c1FWpuRm1-container`,
                                nodeId: `c1FWpuRm1`,
                                rendersWithMotion: !0,
                                scopeId: `nsRWogLc5`,
                                children: f(W, {
                                  height: `100%`,
                                  id: `c1FWpuRm1`,
                                  layoutId: `c1FWpuRm1`,
                                  variant: bn(`twSJi7E6A`),
                                  width: `100%`,
                                  ...K({ OKX8Xgj78: { qeMoNNOov: ie } }, g, y),
                                }),
                              }),
                            }),
                            ae() &&
                              v(w.div, {
                                className: `framer-16onif1`,
                                "data-framer-name": `Icon`,
                                layoutDependency: C,
                                layoutId: `FXsiMXGOl`,
                                ...K(
                                  {
                                    k2end4pNp: { "data-highlight": !0, onTap: O },
                                    OKX8Xgj78: { "data-highlight": !0, onTap: k },
                                  },
                                  g,
                                  y
                                ),
                                children: [
                                  f(w.div, {
                                    className: `framer-14mrusa`,
                                    "data-framer-name": `Bottom`,
                                    layoutDependency: C,
                                    layoutId: `pMAvA_mTr`,
                                    style: {
                                      backgroundColor: `var(--token-ead78c25-61c2-4dbd-ab91-81844bb73469, rgb(250, 250, 250))`,
                                      borderBottomLeftRadius: 220,
                                      borderBottomRightRadius: 220,
                                      borderTopLeftRadius: 220,
                                      borderTopRightRadius: 220,
                                      rotate: 0,
                                    },
                                    variants: { OKX8Xgj78: { rotate: -45 } },
                                  }),
                                  f(w.div, {
                                    className: `framer-1kj0fua`,
                                    "data-framer-name": `Top`,
                                    layoutDependency: C,
                                    layoutId: `yQdQtxAAq`,
                                    style: {
                                      backgroundColor: `var(--token-ead78c25-61c2-4dbd-ab91-81844bb73469, rgb(250, 250, 250))`,
                                      borderBottomLeftRadius: 220,
                                      borderBottomRightRadius: 220,
                                      borderTopLeftRadius: 220,
                                      borderTopRightRadius: 220,
                                      rotate: 0,
                                    },
                                    variants: { OKX8Xgj78: { rotate: 45 } },
                                  }),
                                ],
                              }),
                          ],
                        }),
                        v(w.div, {
                          className: `framer-p0r71v`,
                          "data-framer-name": `Links`,
                          layoutDependency: C,
                          layoutId: `DN06dS6s1`,
                          children: [
                            f(N, {
                              __fromCanvasComponent: !0,
                              children: f(s, {
                                children: f(w.p, {
                                  className: `framer-styles-preset-njbii5`,
                                  "data-styles-preset": `Jk5tW_Wev`,
                                  dir: `auto`,
                                  children: f(R, {
                                    href: { hash: `:AJk799GZA`, webPageId: `augiA20Il` },
                                    motionChild: !0,
                                    nodeId: `kgVrIhY6G`,
                                    openInNewTab: !1,
                                    relValues: [],
                                    scopeId: `nsRWogLc5`,
                                    smoothScroll: !0,
                                    children: f(w.a, {
                                      className: `framer-styles-preset-ku8eff`,
                                      "data-styles-preset": `zENjxQwen`,
                                      children: `Benefits`,
                                    }),
                                  }),
                                }),
                              }),
                              className: `framer-xfg5au`,
                              fonts: [`Inter`],
                              layoutDependency: C,
                              layoutId: `kgVrIhY6G`,
                              style: { "--framer-paragraph-spacing": `0px` },
                              verticalAlignment: `top`,
                              withExternalLayout: !0,
                              ...K(
                                {
                                  k2end4pNp: {
                                    children: f(s, {
                                      children: f(w.h4, {
                                        className: `framer-styles-preset-io07rr`,
                                        "data-styles-preset": `x6wWMGXms`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:AJk799GZA`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `kgVrIhY6G`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `nsRWogLc5`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-ku8eff`,
                                            "data-styles-preset": `zENjxQwen`,
                                            children: `Benefits`,
                                          }),
                                        }),
                                      }),
                                    }),
                                  },
                                  OKX8Xgj78: {
                                    "data-highlight": !0,
                                    children: f(s, {
                                      children: f(w.h4, {
                                        className: `framer-styles-preset-io07rr`,
                                        "data-styles-preset": `x6wWMGXms`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:AJk799GZA`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `kgVrIhY6G`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `nsRWogLc5`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-ku8eff`,
                                            "data-styles-preset": `zENjxQwen`,
                                            children: `Benefits`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    onTap: k,
                                  },
                                },
                                g,
                                y
                              ),
                            }),
                            f(N, {
                              __fromCanvasComponent: !0,
                              children: f(s, {
                                children: f(w.p, {
                                  className: `framer-styles-preset-njbii5`,
                                  "data-styles-preset": `Jk5tW_Wev`,
                                  dir: `auto`,
                                  children: f(R, {
                                    href: { hash: `:PsrjeqlZT`, webPageId: `augiA20Il` },
                                    motionChild: !0,
                                    nodeId: `pp0vJPm58`,
                                    openInNewTab: !1,
                                    relValues: [],
                                    scopeId: `nsRWogLc5`,
                                    smoothScroll: !0,
                                    children: f(w.a, {
                                      className: `framer-styles-preset-ku8eff`,
                                      "data-styles-preset": `zENjxQwen`,
                                      children: `Features`,
                                    }),
                                  }),
                                }),
                              }),
                              className: `framer-b2r8lc`,
                              fonts: [`Inter`],
                              layoutDependency: C,
                              layoutId: `pp0vJPm58`,
                              style: { "--framer-paragraph-spacing": `0px` },
                              verticalAlignment: `top`,
                              withExternalLayout: !0,
                              ...K(
                                {
                                  k2end4pNp: {
                                    children: f(s, {
                                      children: f(w.h4, {
                                        className: `framer-styles-preset-io07rr`,
                                        "data-styles-preset": `x6wWMGXms`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:PsrjeqlZT`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `pp0vJPm58`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `nsRWogLc5`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-ku8eff`,
                                            "data-styles-preset": `zENjxQwen`,
                                            children: `Features`,
                                          }),
                                        }),
                                      }),
                                    }),
                                  },
                                  OKX8Xgj78: {
                                    "data-highlight": !0,
                                    children: f(s, {
                                      children: f(w.h4, {
                                        className: `framer-styles-preset-io07rr`,
                                        "data-styles-preset": `x6wWMGXms`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:PsrjeqlZT`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `pp0vJPm58`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `nsRWogLc5`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-ku8eff`,
                                            "data-styles-preset": `zENjxQwen`,
                                            children: `Features`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    onTap: k,
                                  },
                                },
                                g,
                                y
                              ),
                            }),
                            f(N, {
                              __fromCanvasComponent: !0,
                              children: f(s, {
                                children: f(w.p, {
                                  className: `framer-styles-preset-njbii5`,
                                  "data-styles-preset": `Jk5tW_Wev`,
                                  dir: `auto`,
                                  children: f(R, {
                                    href: { hash: `:qi61tIN0U`, webPageId: `augiA20Il` },
                                    motionChild: !0,
                                    nodeId: `UCjnO_F4P`,
                                    openInNewTab: !1,
                                    relValues: [],
                                    scopeId: `nsRWogLc5`,
                                    smoothScroll: !0,
                                    children: f(w.a, {
                                      className: `framer-styles-preset-ku8eff`,
                                      "data-styles-preset": `zENjxQwen`,
                                      children: `Reviews`,
                                    }),
                                  }),
                                }),
                              }),
                              className: `framer-o9r8ou`,
                              fonts: [`Inter`],
                              layoutDependency: C,
                              layoutId: `UCjnO_F4P`,
                              style: { "--framer-paragraph-spacing": `0px` },
                              verticalAlignment: `top`,
                              withExternalLayout: !0,
                              ...K(
                                {
                                  k2end4pNp: {
                                    children: f(s, {
                                      children: f(w.h4, {
                                        className: `framer-styles-preset-io07rr`,
                                        "data-styles-preset": `x6wWMGXms`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:qi61tIN0U`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `UCjnO_F4P`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `nsRWogLc5`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-ku8eff`,
                                            "data-styles-preset": `zENjxQwen`,
                                            children: `Reviews`,
                                          }),
                                        }),
                                      }),
                                    }),
                                  },
                                  OKX8Xgj78: {
                                    "data-highlight": !0,
                                    children: f(s, {
                                      children: f(w.h4, {
                                        className: `framer-styles-preset-io07rr`,
                                        "data-styles-preset": `x6wWMGXms`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:qi61tIN0U`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `UCjnO_F4P`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `nsRWogLc5`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-ku8eff`,
                                            "data-styles-preset": `zENjxQwen`,
                                            children: `Reviews`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    onTap: k,
                                  },
                                },
                                g,
                                y
                              ),
                            }),
                            f(N, {
                              __fromCanvasComponent: !0,
                              children: f(s, {
                                children: f(w.p, {
                                  className: `framer-styles-preset-njbii5`,
                                  "data-styles-preset": `Jk5tW_Wev`,
                                  dir: `auto`,
                                  children: f(R, {
                                    href: { hash: `:WwGCP5J8y`, webPageId: `augiA20Il` },
                                    motionChild: !0,
                                    nodeId: `LSaOv4CF8`,
                                    openInNewTab: !1,
                                    relValues: [],
                                    scopeId: `nsRWogLc5`,
                                    smoothScroll: !0,
                                    children: f(w.a, {
                                      className: `framer-styles-preset-ku8eff`,
                                      "data-styles-preset": `zENjxQwen`,
                                      children: `Pricing`,
                                    }),
                                  }),
                                }),
                              }),
                              className: `framer-1nladk3`,
                              fonts: [`Inter`],
                              layoutDependency: C,
                              layoutId: `LSaOv4CF8`,
                              style: { "--framer-paragraph-spacing": `0px` },
                              verticalAlignment: `top`,
                              withExternalLayout: !0,
                              ...K(
                                {
                                  k2end4pNp: {
                                    children: f(s, {
                                      children: f(w.h4, {
                                        className: `framer-styles-preset-io07rr`,
                                        "data-styles-preset": `x6wWMGXms`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:WwGCP5J8y`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `LSaOv4CF8`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `nsRWogLc5`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-ku8eff`,
                                            "data-styles-preset": `zENjxQwen`,
                                            children: `Pricing`,
                                          }),
                                        }),
                                      }),
                                    }),
                                  },
                                  OKX8Xgj78: {
                                    "data-highlight": !0,
                                    children: f(s, {
                                      children: f(w.h4, {
                                        className: `framer-styles-preset-io07rr`,
                                        "data-styles-preset": `x6wWMGXms`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:WwGCP5J8y`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `LSaOv4CF8`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `nsRWogLc5`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-ku8eff`,
                                            "data-styles-preset": `zENjxQwen`,
                                            children: `Pricing`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    onTap: k,
                                  },
                                },
                                g,
                                y
                              ),
                            }),
                            f(N, {
                              __fromCanvasComponent: !0,
                              children: f(s, {
                                children: f(w.p, {
                                  className: `framer-styles-preset-njbii5`,
                                  "data-styles-preset": `Jk5tW_Wev`,
                                  dir: `auto`,
                                  children: f(R, {
                                    href: { hash: `:uDwtapgnK`, webPageId: `augiA20Il` },
                                    motionChild: !0,
                                    nodeId: `V6AGXn_oA`,
                                    openInNewTab: !1,
                                    relValues: [],
                                    scopeId: `nsRWogLc5`,
                                    smoothScroll: !0,
                                    children: f(w.a, {
                                      className: `framer-styles-preset-ku8eff`,
                                      "data-styles-preset": `zENjxQwen`,
                                      children: `FAQs`,
                                    }),
                                  }),
                                }),
                              }),
                              className: `framer-1y8hfjb`,
                              fonts: [`Inter`],
                              layoutDependency: C,
                              layoutId: `V6AGXn_oA`,
                              style: { "--framer-paragraph-spacing": `0px` },
                              verticalAlignment: `top`,
                              withExternalLayout: !0,
                              ...K(
                                {
                                  k2end4pNp: {
                                    children: f(s, {
                                      children: f(w.h4, {
                                        className: `framer-styles-preset-io07rr`,
                                        "data-styles-preset": `x6wWMGXms`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:uDwtapgnK`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `V6AGXn_oA`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `nsRWogLc5`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-ku8eff`,
                                            "data-styles-preset": `zENjxQwen`,
                                            children: `FAQs`,
                                          }),
                                        }),
                                      }),
                                    }),
                                  },
                                  OKX8Xgj78: {
                                    "data-highlight": !0,
                                    children: f(s, {
                                      children: f(w.h4, {
                                        className: `framer-styles-preset-io07rr`,
                                        "data-styles-preset": `x6wWMGXms`,
                                        dir: `auto`,
                                        style: { "--framer-text-alignment": `left` },
                                        children: f(R, {
                                          href: { hash: `:uDwtapgnK`, webPageId: `augiA20Il` },
                                          motionChild: !0,
                                          nodeId: `V6AGXn_oA`,
                                          openInNewTab: !1,
                                          relValues: [],
                                          scopeId: `nsRWogLc5`,
                                          smoothScroll: !0,
                                          children: f(w.a, {
                                            className: `framer-styles-preset-ku8eff`,
                                            "data-styles-preset": `zENjxQwen`,
                                            children: `FAQs`,
                                          }),
                                        }),
                                      }),
                                    }),
                                    onTap: k,
                                  },
                                },
                                g,
                                y
                              ),
                            }),
                          ],
                        }),
                        f(w.div, {
                          className: `framer-obygoi`,
                          "data-framer-name": `Button Wrapper`,
                          layoutDependency: C,
                          layoutId: `ZawhhQYxD`,
                          ...K({ OKX8Xgj78: { "data-highlight": !0, onTap: k } }, g, y),
                          children: f(xe, {
                            links: [
                              {
                                href: { hash: `:fA83PcgiE`, webPageId: `augiA20Il` },
                                implicitPathVariables: void 0,
                              },
                              {
                                href: { hash: `:fA83PcgiE`, webPageId: `augiA20Il` },
                                implicitPathVariables: void 0,
                              },
                              {
                                href: { hash: `:fA83PcgiE`, webPageId: `augiA20Il` },
                                implicitPathVariables: void 0,
                              },
                            ],
                            children: (e) =>
                              f(L, {
                                height: 36,
                                y: (l?.y || 0) + (0 + ((l?.height || 54) - 0 - 54) / 2) + 9 + 0,
                                ...K(
                                  {
                                    k2end4pNp: {
                                      width: `max(min(${l?.width || `100vw`}, 800px) - 16px, 1px)`,
                                      y: (l?.y || 0) + 0 + 0 + 5 + 258 + 0,
                                    },
                                    OKX8Xgj78: {
                                      width: `max(min(${l?.width || `100vw`}, 800px) - 16px, 1px)`,
                                      y: (l?.y || 0) + 0 + 0 + 8 + 298 + 0,
                                    },
                                  },
                                  g,
                                  y
                                ),
                                children: f(Le, {
                                  className: `framer-1ku7kta-container`,
                                  layoutDependency: C,
                                  layoutId: `ovzauKHgP-container`,
                                  nodeId: `ovzauKHgP`,
                                  rendersWithMotion: !0,
                                  scopeId: `nsRWogLc5`,
                                  children: f(H, {
                                    height: `100%`,
                                    id: `ovzauKHgP`,
                                    iO6YqVFFu: e[0],
                                    layoutId: `ovzauKHgP`,
                                    variant: bn(`wqyaI1T5E`),
                                    VCaJp8H3g: `Get the app`,
                                    width: `100%`,
                                    Yb_1M_kZR: !1,
                                    ...K(
                                      {
                                        k2end4pNp: { iO6YqVFFu: e[1], style: { width: `100%` } },
                                        OKX8Xgj78: {
                                          iO6YqVFFu: e[2],
                                          sIpsQbFgb: void 0,
                                          style: { width: `100%` },
                                        },
                                      },
                                      g,
                                      y
                                    ),
                                  }),
                                }),
                              }),
                          }),
                        }),
                      ],
                    }),
                  }),
                }),
              }),
            })
          );
        }),
        [
          `@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,
          `.framer-MKb9M.framer-10gkmyq, .framer-MKb9M .framer-10gkmyq { display: block; }`,
          `.framer-MKb9M.framer-15dolj1 { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 1200px; }`,
          `.framer-MKb9M .framer-18h3hj0 { align-content: center; align-items: center; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; max-width: 800px; overflow: visible; padding: 8px; position: relative; width: 1px; }`,
          `.framer-MKb9M .framer-7dtpvg { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; height: min-content; justify-content: space-between; overflow: visible; padding: 0px; position: relative; width: min-content; }`,
          `.framer-MKb9M .framer-1dpuhjh-container, .framer-MKb9M .framer-1ku7kta-container { flex: none; height: auto; position: relative; width: auto; }`,
          `.framer-MKb9M .framer-16onif1 { flex: none; height: 40px; overflow: hidden; position: relative; width: 40px; }`,
          `.framer-MKb9M .framer-14mrusa { flex: none; height: 2px; left: calc(57.500000000000014% - 13px / 2); overflow: hidden; position: absolute; top: calc(60.00000000000002% - 2px / 2); width: 13px; will-change: var(--framer-will-change-override, transform); }`,
          `.framer-MKb9M .framer-1kj0fua { flex: none; height: 2px; left: calc(55.00000000000003% - 16px / 2); overflow: hidden; position: absolute; top: calc(40.00000000000002% - 2px / 2); width: 16px; will-change: var(--framer-will-change-override, transform); }`,
          `.framer-MKb9M .framer-p0r71v { align-content: center; align-items: center; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 1px; }`,
          `.framer-MKb9M .framer-xfg5au, .framer-MKb9M .framer-b2r8lc, .framer-MKb9M .framer-o9r8ou, .framer-MKb9M .framer-1nladk3, .framer-MKb9M .framer-1y8hfjb { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; }`,
          `.framer-MKb9M .framer-obygoi { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: min-content; }`,
          `.framer-MKb9M.framer-v-1qgwkw5.framer-15dolj1 { flex-direction: column; gap: 0px; justify-content: flex-start; width: 390px; }`,
          `.framer-MKb9M.framer-v-1qgwkw5 .framer-18h3hj0 { flex: none; flex-direction: column; height: 55px; justify-content: flex-start; overflow: var(--overflow-clip-fallback, clip); padding: 5px 8px 5px 8px; width: 100%; will-change: var(--framer-will-change-override, transform); }`,
          `.framer-MKb9M.framer-v-1qgwkw5 .framer-7dtpvg, .framer-MKb9M.framer-v-1qgwkw5 .framer-obygoi, .framer-MKb9M.framer-v-1a02yfm .framer-7dtpvg { width: 100%; }`,
          `.framer-MKb9M.framer-v-1qgwkw5 .framer-16onif1, .framer-MKb9M.framer-v-1a02yfm .framer-16onif1 { cursor: pointer; height: 44px; width: 44px; }`,
          `.framer-MKb9M.framer-v-1qgwkw5 .framer-p0r71v { align-content: flex-start; align-items: flex-start; flex: none; flex-direction: column; gap: 0px; justify-content: flex-start; padding: 20px; width: 100%; }`,
          `.framer-MKb9M.framer-v-1qgwkw5 .framer-1ku7kta-container, .framer-MKb9M.framer-v-1a02yfm .framer-1ku7kta-container { flex: 1 0 0px; width: 1px; }`,
          `.framer-MKb9M.framer-v-1a02yfm.framer-15dolj1 { flex-direction: column; justify-content: flex-start; max-height: calc(var(--framer-viewport-height, 100vh) * 1); overflow: auto; overscroll-behavior: contain; width: 390px; }`,
          `.framer-MKb9M.framer-v-1a02yfm .framer-18h3hj0 { flex: none; flex-direction: column; width: 100%; }`,
          `.framer-MKb9M.framer-v-1a02yfm .framer-14mrusa, .framer-MKb9M.framer-v-1a02yfm .framer-1kj0fua { left: calc(56.81818181818185% - 18px / 2); top: calc(50.00000000000002% - 2px / 2); width: 18px; }`,
          `.framer-MKb9M.framer-v-1a02yfm .framer-p0r71v { align-content: flex-start; align-items: flex-start; flex: none; flex-direction: column; gap: 10px; justify-content: flex-start; padding: 20px; width: 100%; }`,
          `.framer-MKb9M.framer-v-1a02yfm .framer-xfg5au, .framer-MKb9M.framer-v-1a02yfm .framer-b2r8lc, .framer-MKb9M.framer-v-1a02yfm .framer-o9r8ou, .framer-MKb9M.framer-v-1a02yfm .framer-1nladk3, .framer-MKb9M.framer-v-1a02yfm .framer-1y8hfjb { cursor: pointer; }`,
          `.framer-MKb9M.framer-v-1a02yfm .framer-obygoi { cursor: pointer; width: 100%; }`,
          ...qe,
          ...dn,
          ...Xe,
          `.framer-MKb9M[data-hide-scrollbars="true"]::-webkit-scrollbar, .framer-MKb9M [data-hide-scrollbars="true"]::-webkit-scrollbar { width: 0px; height: 0px; }`,
          `.framer-MKb9M[data-hide-scrollbars="true"]::-webkit-scrollbar-thumb, .framer-MKb9M [data-hide-scrollbars="true"]::-webkit-scrollbar-thumb { background: transparent; }`,
          `.framer-MKb9M[data-hide-scrollbars="true"], .framer-MKb9M [data-hide-scrollbars="true"] { scrollbar-width: none; }`,
        ],
        `framer-MKb9M`
      )),
      (En = q),
      (q.displayName = `Navbar`),
      (q.defaultProps = { height: 54, width: 1200 }),
      V(q, {
        variant: {
          options: [`JqDqua8ky`, `k2end4pNp`, `OKX8Xgj78`],
          optionTitles: [`Desktop`, `Phone`, `Phone Open`],
          title: `Variant`,
          type: F.Enum,
        },
      }),
      P(
        q,
        [
          {
            explicitInter: !0,
            fonts: [
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F`,
                url: `https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2`,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`,
                url: `https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2`,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+1F00-1FFF`,
                url: `https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2`,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0370-03FF`,
                url: `https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2`,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF`,
                url: `https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2`,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,
                url: `https://framerusercontent.com/assets/GrgcKwrN6d3Uz8EwcLHZxwEfC4.woff2`,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`,
                url: `https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2`,
                weight: `400`,
              },
            ],
          },
          ...mn,
          ...hn,
          ...M(He),
          ...M(un),
          ...M(et),
        ],
        { supportsExplicitInterCodegen: !0 }
      ),
      (q.loader = { load: (e, t) => (t.locale, Promise.allSettled([k(W, {}, t), k(H, {}, t)])) }));
  });
function On(e, ...t) {
  let n = {};
  return (t?.forEach((t) => t && Object.assign(n, e[t])), n);
}
var kn,
  An,
  jn,
  Mn,
  Nn,
  Pn,
  Fn,
  In,
  Ln,
  Rn,
  J,
  zn,
  Y,
  Bn = e(() => {
    (y(),
      O(),
      D(),
      n(),
      (kn = { KELkx9DHr: { hover: !0, pressed: !0 } }),
      (An = [`KELkx9DHr`, `PzPdQH3iD`, `QRaIjg1S_`]),
      (jn = `framer-cUAKc`),
      (Mn = {
        KELkx9DHr: `framer-v-1lgja8c`,
        PzPdQH3iD: `framer-v-2h9pov`,
        QRaIjg1S_: `framer-v-1ie4ldl`,
      }),
      oe(),
      (Nn = { bounce: 0.2, delay: 0, duration: 0.4, type: `spring` }),
      (Pn = ({ value: e, children: n }) => {
        let r = _(T),
          i = e ?? r.transition,
          a = t(() => ({ ...r, transition: i }), [JSON.stringify(i)]);
        return f(T.Provider, { value: a, children: n });
      }),
      (Fn = { Desktop: `KELkx9DHr`, Phone: `QRaIjg1S_`, Tablet: `PzPdQH3iD` }),
      (In = w.create(s)),
      (Ln = ({ height: e, id: t, width: n, ...r }) => ({
        ...r,
        variant: Fn[r.variant] ?? r.variant ?? `KELkx9DHr`,
      })),
      (Rn = (e, t) => (e.layoutDependency ? t.join(`-`) + e.layoutDependency : t.join(`-`))),
      (J = z(
        p(function (e, t) {
          let n = r(null),
            i = t ?? n,
            a = S(),
            { activeLocale: o, setLocale: c } = I(),
            l = ce(),
            { style: u, className: d, layoutId: p, variant: m, ...h } = Ln(e),
            {
              baseVariant: g,
              classNames: _,
              clearLoadingGesture: ee,
              gestureHandlers: te,
              gestureVariant: y,
              isLoading: ne,
              setGestureState: re,
              setVariant: b,
              variants: x,
            } = De({
              cycleOrder: An,
              defaultVariant: `KELkx9DHr`,
              enabledGestures: kn,
              ref: i,
              variant: m,
              variantClassNames: Mn,
            }),
            C = Rn(e, x),
            T = B(jn);
          return f(E, {
            id: p ?? a,
            children: f(In, {
              animate: x,
              initial: !1,
              children: f(Pn, {
                value: Nn,
                children: f(R, {
                  href: `https://framer.link/poOzPgO`,
                  motionChild: !0,
                  nodeId: `KELkx9DHr`,
                  openInNewTab: !0,
                  scopeId: `WfWGrXBAR`,
                  children: v(w.a, {
                    ...h,
                    ...te,
                    className: `${B(T, `framer-1lgja8c`, d, _)} framer-7hflji`,
                    "data-framer-name": `Desktop`,
                    layoutDependency: C,
                    layoutId: `KELkx9DHr`,
                    ref: i,
                    style: {
                      "--corner-shape-fallback": 0.752,
                      backdropFilter: `blur(10px)`,
                      backgroundColor: `rgba(0, 0, 0, 0.8)`,
                      borderBottomLeftRadius: `calc(17px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                      borderBottomRightRadius: `calc(17px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                      borderTopLeftRadius: `calc(17px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                      borderTopRightRadius: `calc(17px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                      cornerShape: `superellipse(1.5)`,
                      WebkitBackdropFilter: `blur(10px)`,
                      ...u,
                    },
                    variants: {
                      "KELkx9DHr-hover": { backgroundColor: `rgba(0, 0, 0, 0.6)` },
                      "KELkx9DHr-pressed": { backgroundColor: `rgba(0, 0, 0, 0.6)` },
                    },
                    ...On(
                      {
                        "KELkx9DHr-hover": { "data-framer-name": void 0 },
                        "KELkx9DHr-pressed": { "data-framer-name": void 0 },
                        PzPdQH3iD: { "data-framer-name": `Tablet` },
                        QRaIjg1S_: { "data-framer-name": `Phone` },
                      },
                      g,
                      y
                    ),
                    children: [
                      f(Pe, {
                        background: {
                          alt: ``,
                          fit: `fill`,
                          intrinsicHeight: 3e3,
                          intrinsicWidth: 4e3,
                          loading: se(
                            (l?.y || 0) + 6 + (((l?.height || 122) - 14 - 106.8) / 2 + 0 + 0)
                          ),
                          pixelHeight: 3e3,
                          pixelWidth: 4e3,
                          positionX: `center`,
                          positionY: `top`,
                          sizes: `calc(${l?.width || `100vw`} - 12px)`,
                          src: `/web1/assets/images/Oc9nW18lPSQBp8tkSyNriRMN2e0.jpg?width=4000&height=3000`,
                          srcSet: `/web1/assets/images/Oc9nW18lPSQBp8tkSyNriRMN2e0.jpg?scale-down-to=512&width=4000&height=3000 512w,/web1/assets/images/Oc9nW18lPSQBp8tkSyNriRMN2e0.jpg?scale-down-to=1024&width=4000&height=3000 1024w,/web1/assets/images/Oc9nW18lPSQBp8tkSyNriRMN2e0.jpg 2048w,/web1/assets/images/Oc9nW18lPSQBp8tkSyNriRMN2e0.jpg?width=4000&height=3000 4000w`,
                        },
                        className: `framer-mamz3v`,
                        "data-framer-name": `Image`,
                        layoutDependency: C,
                        layoutId: `cLFgPIzXj`,
                        style: {
                          "--corner-shape-fallback": 0.752,
                          borderBottomLeftRadius: `calc(10px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                          borderBottomRightRadius: `calc(10px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                          borderTopLeftRadius: `calc(10px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                          borderTopRightRadius: `calc(10px*var(--one-if-corner-shape-supported,var(--corner-shape-fallback,1)))`,
                          cornerShape: `superellipse(1.5)`,
                        },
                      }),
                      f(N, {
                        __fromCanvasComponent: !0,
                        children: f(s, {
                          children: f(w.p, {
                            dir: `auto`,
                            style: {
                              "--font-selector": `SW50ZXItVmFyaWFibGVWRj1JbTl3YzNvaUlETXlMQ0FpZDJkb2RDSWdOVEF3`,
                              "--framer-font-family": `"Inter Variable", "Inter Variable Placeholder", sans-serif`,
                              "--framer-font-size": `14px`,
                              "--framer-font-variation-axes": `var(--extracted-2gg91v, "opsz" 32, "wght" 500)`,
                              "--framer-letter-spacing": `0.02em`,
                              "--framer-text-color": `var(--extracted-r6o4lv, rgb(255, 255, 255))`,
                            },
                            children: `Remix for Free`,
                          }),
                        }),
                        className: `framer-1h06sa3`,
                        fonts: [`Inter-Variable`],
                        layoutDependency: C,
                        layoutId: `PzmSBlIDa`,
                        style: {
                          "--extracted-2gg91v": `"opsz" 32, "wght" 500`,
                          "--extracted-r6o4lv": `rgb(255, 255, 255)`,
                          "--framer-link-text-color": `rgb(0, 153, 255)`,
                          "--framer-link-text-decoration": `underline`,
                        },
                        verticalAlignment: `top`,
                        withExternalLayout: !0,
                      }),
                    ],
                  }),
                }),
              }),
            }),
          });
        }),
        [
          `@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,
          `.framer-cUAKc.framer-7hflji, .framer-cUAKc .framer-7hflji { display: block; }`,
          `.framer-cUAKc.framer-1lgja8c { align-content: center; align-items: center; cursor: pointer; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 8px; height: min-content; justify-content: center; overflow: var(--overflow-clip-fallback, clip); padding: 6px 6px 8px 6px; position: relative; text-decoration: none; width: 142px; will-change: var(--framer-will-change-override, transform); }`,
          `.framer-cUAKc .framer-mamz3v { aspect-ratio: 1.5609756097560976 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 83px); overflow: visible; position: relative; width: 100%; }`,
          `.framer-cUAKc .framer-1h06sa3 { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; }`,
          `.framer-cUAKc.framer-v-2h9pov.framer-1lgja8c, .framer-cUAKc.framer-v-1ie4ldl.framer-1lgja8c { cursor: unset; }`,
        ],
        `framer-cUAKc`
      )),
      (zn = J),
      (J.displayName = `Remix Template`),
      (J.defaultProps = { height: 122, width: 142 }),
      V(J, {
        variant: {
          options: [`KELkx9DHr`, `PzPdQH3iD`, `QRaIjg1S_`],
          optionTitles: [`Desktop`, `Tablet`, `Phone`],
          title: `Variant`,
          type: F.Enum,
        },
      }),
      (Y = [
        { defaultValue: 14, maxValue: 32, minValue: 14, name: `Optical size`, tag: `opsz` },
        { defaultValue: 400, maxValue: 900, minValue: 100, name: `Weight`, tag: `wght` },
      ]),
      P(
        J,
        [
          {
            explicitInter: !0,
            fonts: [
              {
                cssFamilyName: `Inter Variable`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F`,
                url: `https://framerusercontent.com/assets/mYcqTSergLb16PdbJJQMl9ebYm4.woff2`,
                variationAxes: Y,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter Variable`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`,
                url: `https://framerusercontent.com/assets/ZRl8AlxwsX1m7xS1eJCiSPbztg.woff2`,
                variationAxes: Y,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter Variable`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+1F00-1FFF`,
                url: `https://framerusercontent.com/assets/nhSQpBRqFmXNUBY2p5SENQ8NplQ.woff2`,
                variationAxes: Y,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter Variable`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0370-03FF`,
                url: `https://framerusercontent.com/assets/DYHjxG0qXjopUuruoacfl5SA.woff2`,
                variationAxes: Y,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter Variable`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF`,
                url: `https://framerusercontent.com/assets/s7NH6sl7w4NU984r5hcmo1tPSYo.woff2`,
                variationAxes: Y,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter Variable`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2070, U+2074-207E, U+2080-208E, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`,
                url: `/web1/assets/fonts/7lw0VWkeXrGYJT05oB3DsFy8BaY.woff2`,
                variationAxes: Y,
                weight: `400`,
              },
              {
                cssFamilyName: `Inter Variable`,
                source: `framer`,
                style: `normal`,
                uiFamilyName: `Inter`,
                unicodeRange: `U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB`,
                url: `https://framerusercontent.com/assets/wx5nfqEgOXnxuFaxB0Mn9OhmcZA.woff2`,
                variationAxes: Y,
                weight: `400`,
              },
            ],
          },
        ],
        { supportsExplicitInterCodegen: !0 }
      ));
  }),
  Vn,
  Hn,
  Un,
  Wn,
  Gn,
  Kn,
  qn,
  X,
  Jn,
  Yn,
  Z,
  Xn,
  Zn,
  Qn,
  $n,
  er,
  tr,
  nr,
  rr,
  Q,
  ir,
  ar = e(() => {
    (y(),
      O(),
      D(),
      n(),
      ln(),
      Dn(),
      Bn(),
      (Vn = j(En)),
      (Hn = j(zn)),
      (Un = Oe(ke)),
      (Wn = j(cn)),
      (Gn = {
        HilwX4eok: `(max-width: 809.98px)`,
        TnnTkrLjD: `(min-width: 810px) and (max-width: 1199.98px)`,
        uKRV879WV: `(min-width: 1200px)`,
      }),
      (Kn = `framer-IMsye`),
      (qn = {
        HilwX4eok: `framer-v-q6kje`,
        TnnTkrLjD: `framer-v-wixyj7`,
        uKRV879WV: `framer-v-ubrg9z`,
      }),
      (X = (...e) => {
        for (let t of e) if (t && typeof t == `string`) return t;
      }),
      (Jn = {
        opacity: 1,
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        skewX: 0,
        skewY: 0,
        transition: { bounce: 0.2, delay: 3, duration: 0.6, type: `spring` },
        x: 0,
        y: 0,
      }),
      (Yn = {
        opacity: 0.001,
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        skewX: 0,
        skewY: 0,
        x: 0,
        y: 4,
      }),
      (Z = {}),
      (Xn = Object.keys(Z)),
      (Zn = [
        `@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }`,
        `.framer-IMsye.framer-1kb6i6u, .framer-IMsye .framer-1kb6i6u { display: block; }`,
        `.framer-IMsye.framer-ubrg9z { --selection-background-color: rgba(4, 183, 249, 0.2); --selection-color: var(--token-cb892b53-bfb7-463e-95f3-095a4dd319d9, #04b7f9) /* {"name":"Brand"} */; align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 120px; height: min-content; justify-content: flex-start; overflow: var(--overflow-clip-fallback, clip); padding: 0px; position: relative; width: 100%; }`,
        `.framer-IMsye .framer-1mokza6-container { flex: none; height: auto; left: 20px; order: -1000; position: var(--framer-canvas-fixed-position, fixed); right: 20px; top: 20px; z-index: 10; }`,
        `.framer-IMsye .framer-1wict3b { background: transparent; flex-grow: 1; height: 0px; margin: 0px; margin-bottom: -120px; position: relative; width: 0px; }`,
        `.framer-IMsye .framer-1d66xvy-container { bottom: calc(calc(100% - min(var(--framer-viewport-height, 100%), 100%)) + 66px); flex: none; height: auto; order: 1002; position: var(--framer-canvas-fixed-position, fixed); right: 20px; width: auto; will-change: var(--framer-will-change-effect-override, transform); z-index: 1; }`,
        `.framer-IMsye .framer-6m5li4-container { flex: none; height: auto; order: 1003; position: relative; width: 100%; }`,
        `[data-layout-template="true"] > #overlay { margin-bottom: -120px; }`,
        `.framer-IMsye[data-selection="true"] * ::selection, .framer-IMsye [data-selection="true"] * ::selection { color: var(--selection-color, none); background-color: var(--selection-background-color, none); }`,
      ]),
      (Qn = {
        HilwX4eok: `(max-width: 809.98px)`,
        TnnTkrLjD: `(min-width: 810px) and (max-width: 1199.98px)`,
        uKRV879WV: `(min-width: 1200px)`,
      }),
      ($n = { Desktop: `uKRV879WV`, Phone: `HilwX4eok`, Tablet: `TnnTkrLjD` }),
      (er = ({ value: e }) =>
        Ae()
          ? null
          : f(`style`, { dangerouslySetInnerHTML: { __html: e }, "data-framer-html-style": `` })),
      (tr = ({ height: e, id: t, width: n, ...r }) => ({
        ...r,
        variant: $n[r.variant] ?? r.variant ?? `uKRV879WV`,
      })),
      (nr = p(function (e, t) {
        let n = r(null),
          i = t ?? n,
          a = S(),
          { activeLocale: o, setLocale: s } = I(),
          { style: c, className: l, layoutId: u, variant: d, children: p, ...m } = tr(e),
          [h, g] = Ie(d, Gn, !1),
          _ = B(Kn);
        return (
          ye({}),
          f(he.Provider, {
            value: {
              activeVariantId: h,
              humanReadableVariantMap: $n,
              isLayoutTemplate: !0,
              primaryVariantId: `uKRV879WV`,
              variantClassNames: qn,
            },
            children: v(E, {
              id: u ?? a,
              children: [
                f(er, {
                  value: `:root body { background: rgb(255, 255, 255); } @media (max-width: 809.98px) { :root { font-size: 93.75%; } }`,
                }),
                v(w.div, {
                  ...m,
                  className: B(_, `framer-ubrg9z`, l),
                  "data-layout-template": !0,
                  "data-selection": !0,
                  ref: i,
                  style: { ...c },
                  children: [
                    f(L, {
                      height: 54,
                      width: `calc(100vw - 40px)`,
                      y: 20,
                      children: f(ke, {
                        className: `framer-1mokza6-container`,
                        layoutScroll: !0,
                        nodeId: `ijB1qQPik`,
                        scopeId: `CsORDaMYD`,
                        children: f(Me, {
                          breakpoint: h,
                          overrides: { HilwX4eok: { variant: X(`k2end4pNp`) } },
                          children: f(En, {
                            height: `100%`,
                            id: `ijB1qQPik`,
                            layoutId: `ijB1qQPik`,
                            style: { width: `100%` },
                            variant: X(`JqDqua8ky`),
                            width: `100%`,
                          }),
                        }),
                      }),
                    }),
                    p,
                    f(`div`, { className: `framer-1wict3b` }),
                    null,
                    f(L, {
                      height: 438,
                      width: `100vw`,
                      y: 1e3,
                      children: f(ke, {
                        className: `framer-6m5li4-container`,
                        nodeId: `HhGxEn41b`,
                        scopeId: `CsORDaMYD`,
                        children: f(Me, {
                          breakpoint: h,
                          overrides: { HilwX4eok: { variant: X(`S3lQb9osw`) } },
                          children: f(cn, {
                            height: `100%`,
                            id: `HhGxEn41b`,
                            layoutId: `HhGxEn41b`,
                            style: { width: `100%` },
                            variant: X(`wD03utLBO`),
                            width: `100%`,
                          }),
                        }),
                      }),
                    }),
                  ],
                }),
                f(`div`, { id: `template-overlay` }),
              ],
            }),
          })
        );
      })),
      (rr = (e) =>
        e === Ce.canvas || e === Ce.export
          ? [
              ...Zn,
              ...Xn.flatMap((e) => {
                let t = Z[e];
                return Z[e].map((e) => `${t} {${e}}`);
              }),
            ]
          : [...Zn, ...Xn.map((e) => `@media ${Qn[e]} { ${Z[e].join(` `)} }`)]),
      (Q = z(nr, rr, `framer-IMsye`)),
      (ir = Q),
      (Q.displayName = `Default`),
      (Q.defaultProps = { height: 1e3, width: 1200 }),
      P(Q, [{ explicitInter: !0, fonts: [] }, ...Vn, ...Hn, ...Wn], {
        supportsExplicitInterCodegen: !0,
      }),
      (Q.loader = {
        load: (e, t) => (t.locale, Promise.allSettled([k(En, {}, t), k(zn, {}, t), k(cn, {}, t)])),
      }));
  });
function or({ webPageId: e, children: t, style: n, ...r }) {
  let i = {}[e] ?? {};
  switch (e) {
    case `augiA20Il`:
    case `TzTMNqEYN`:
      return x(ir, { ...i, key: `Default`, style: n }, t(!0));
    default:
      return t(!1);
  }
}
function sr(e) {
  switch (e) {
    case `augiA20Il`:
    case `TzTMNqEYN`:
      return [
        { hash: `ubrg9z`, mediaQuery: `(min-width: 1200px)` },
        { hash: `wixyj7`, mediaQuery: `(min-width: 810px) and (max-width: 1199.98px)` },
        { hash: `q6kje`, mediaQuery: `(max-width: 809.98px)` },
      ];
    default:
      return;
  }
}
async function cr({ routeId: e, pathVariables: t, localeId: n, collectionItemId: i }) {
  let a = $[e].page.preload(),
    u = x(ve, {
      children: x(je, {
        children: x(Ee, {
          children: x(be, {
            isWebsite: !0,
            environment: `site`,
            routeId: e,
            pathVariables: t,
            routes: $,
            collectionUtils: fr,
            framerSiteId: pr,
            notFoundPage: A(
              () => import(`./SP36N-DK4PG03B6PdnUv-T-hwiDsi7u7mUzX66dbWsA.CYOm4fA_.mjs`)
            ),
            isReducedMotion: void 0,
            localeId: n,
            locales: dr,
            preserveQueryParams: void 0,
            siteCanonicalURL: `https://appdrop.framer.website`,
            EditorBar:
              l === void 0
                ? void 0
                : (() => {
                    if (hr) {
                      console.log(`[Framer On-Page Editing] Unavailable because navigator is bot`);
                      return;
                    }
                    return A(async () => {
                      l.__framer_editorBarDependencies = {
                        __version: 3,
                        framer: { useCurrentRoute: ie, useLocaleInfo: I, useRouter: Fe },
                        react: {
                          createElement: x,
                          Fragment: s,
                          memo: m,
                          useCallback: g,
                          useEffect: o,
                          useRef: r,
                          useState: c,
                          useLayoutEffect: C,
                        },
                        "react-dom": { createPortal: h },
                      };
                      let { createEditorBar: e } = await import(`init.mjs`);
                      return { default: e() };
                    });
                  })(),
            adaptLayoutToTextDirection: !0,
            LayoutTemplate: or,
            loadSnippetsModule: new ge(
              () => import(`./9PS_87rK_4Hd044E_gnRJYTWWjghPZMpVtI29ordpsg.DJclg79l.mjs`)
            ),
            initialCollectionItemId: i,
          }),
          value: {
            autobahnNavigation: !0,
            disableCustomCode: !1,
            editorBarDisableFrameAncestorsSecurity: !1,
            motionDivToDiv: !1,
            onPageLocalizationSupport: !0,
            onPageMoveTool: !0,
            synchronousNavigationOnDesktop: !1,
            yieldOnTap: !1,
          },
        }),
      }),
      value: { routes: {} },
    });
  return (await a, u);
}
function lr() {
  mr && l.__framer_events.push(arguments);
}
async function ur(e, t) {
  function n(e, t, n = !0) {
    if (e.caught || l.__framer_hadFatalError) return;
    let r = t?.componentStack;
    if (n) {
      if (
        (console.warn(
          `Caught a recoverable error. The site is still functional, but might have some UI flickering or degraded page load performance. If you are the author of this website, update external components and check recently added custom code or code overrides to fix the following server/client mismatches:
`,
          e,
          r
        ),
        Math.random() > 0.01)
      )
        return;
    } else
      console.error(
        `Caught a fatal error. Please report the following to the Framer team via https://www.framer.com/contact/:
`,
        e,
        r
      );
    lr(n ? `published_site_load_recoverable_error` : `published_site_load_error`, {
      message: String(e),
      componentStack: r,
      stack: r ? void 0 : e instanceof Error && typeof e.stack == `string` ? e.stack : null,
    });
  }
  try {
    let r, i, a, o, s;
    if (e)
      ((s = JSON.parse(t.dataset.framerHydrateV2)),
        (r = s.routeId),
        (i = s.localeId),
        (a = s.pathVariables),
        (o = s.breakpoints),
        (r = Ne($, r)));
    else {
      Ne($, void 0);
      let e = performance
        .getEntriesByType(`navigation`)[0]
        ?.serverTiming?.find((e) => e.name === `route`)?.description;
      if (e) {
        let t = new URLSearchParams(e);
        ((r = t.get(`id`)), (i = t.get(`locale`)));
        for (let [e, n] of t.entries()) e.startsWith(`var.`) && ((a ??= {}), (a[e.slice(4)] = n));
      }
      if (!r || !i) {
        let e = le($, decodeURIComponent(location.pathname), !0, dr);
        ((r = e.routeId), (i = e.localeId), (a = e.pathVariables));
      }
    }
    let c = cr({
      routeId: r,
      localeId: i,
      pathVariables: a,
      collectionItemId: s?.collectionItemId,
    });
    l !== void 0 &&
      (async () => {
        let e = $[r],
          t = dr.find(({ id: e }) => (i ? e === i : e === `default`)).code,
          n = s?.collectionItemId ?? null;
        if (n === null && e?.collectionId && fr) {
          let r = await fr[e.collectionId]?.(),
            [i] = Object.values(a);
          r && typeof i == `string` && (n = (await r.getRecordIdBySlug(i, t || void 0)) ?? null);
        }
        let o = Intl.DateTimeFormat().resolvedOptions(),
          c = o.timeZone,
          u = o.locale;
        (await new Promise((e) => {
          document.prerendering
            ? document.addEventListener(`prerenderingchange`, e, { once: !0 })
            : e();
        }),
          l.__framer_events.push([
            `published_site_pageview`,
            {
              framerSiteId: pr ?? null,
              version: 2,
              routePath: e?.path || `/`,
              collectionItemId: n,
              framerLocale: t || null,
              webPageId: e?.abTestingVariantId ?? r,
              abTestId: e?.abTestId,
              referrer: document.referrer || null,
              url: l.location.href,
              hostname: l.location.hostname || null,
              pathname: l.location.pathname || null,
              hash: l.location.hash || null,
              search: l.location.search || null,
              timezone: c,
              locale: u,
            },
            `eager`,
          ]),
          await Se({
            priority: `background`,
            ensureContinueBeforeUnload: !0,
            continueAfter: `paint`,
          }),
          document.dispatchEvent(
            new CustomEvent(`framer:pageview`, { detail: { framerLocale: t || null } })
          ));
      })();
    let d = await c;
    e
      ? (we(`framer-rewrite-breakpoints`, () => {
          (ae(o), l.__framer_onRewriteBreakpoints?.(o));
        }),
        (hr ? (e) => e() : u)(() => {
          (fe(), pe(), b(t, d, { onRecoverableError: n }));
        }))
      : re(t, { onRecoverableError: n }).render(d);
  } catch (e) {
    throw (n(e, void 0, !1), e);
  }
}
var $, dr, fr, pr, mr, hr;
e(() => {
  if (
    (i(),
    O(),
    n(),
    d(),
    te(),
    ar(),
    ($ = {
      augiA20Il: {
        elements: {
          AJk799GZA: `benefits`,
          do7Un9NMc: `connect`,
          fA83PcgiE: `download`,
          H4JE0J23Z: `hero`,
          PsrjeqlZT: `features`,
          qi61tIN0U: `reviews`,
          rkAa3YZI9: `intelligence`,
          uDwtapgnK: `faqs`,
          WwGCP5J8y: `pricing`,
          xQVLBGFrJ: `challenge`,
        },
        page: A(() => import(`./tjtNYYTow7zglVxdaFDAG017atO9mgslioRpUuGozvs.Bq5jbAcb.mjs`)),
        path: `/`,
      },
      TzTMNqEYN: {
        elements: {},
        page: A(() => import(`./SP36N-DK4PG03B6PdnUv-T-hwiDsi7u7mUzX66dbWsA.CYOm4fA_.mjs`)),
        path: `/404`,
      },
    }),
    (dr = [{ code: `en`, id: `default`, name: `English`, slug: ``, textDirection: `ltr` }]),
    (fr = {}),
    (pr = `0a1be9f85d4a4bef8e1bf4749a05243437fe8f2f7dfac7064d0b7e2a96594ccc`),
    (mr = typeof document < `u`),
    (hr = mr && /bot|-google|google-|yandex|ia_archiver|crawl|spider/iu.test(a.userAgent)),
    mr)
  ) {
    ((l.__framer_importFromPackage = (e, t) => () =>
      x(Te, { error: `Package component not supported: "` + t + `" in "` + e + `"` })),
      (l.__framer_events = l.__framer_events || []),
      Re(),
      de());
    let e = document.getElementById(`main`);
    `framerHydrateV2` in e.dataset ? ur(!0, e) : ur(!1, e);
  }
  (function () {
    mr &&
      u(() => {
        b(
          document.getElementById(`__framer-badge-container`),
          x(ee, {}, x(ne(() => import(`./PX9hIOIVM.DHT210lu.mjs`))))
        );
      });
  })();
})();
export { sr as getLayoutTemplateBreakpoints, cr as getPageRoot };
//# sourceMappingURL=script_main.CewA7CyW.mjs.map
