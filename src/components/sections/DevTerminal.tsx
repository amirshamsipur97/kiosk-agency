"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { DevService } from "@/lib/dev-services";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23g)'/%3E%3C/svg%3E\")";

const ICONS = {
  code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  chart: "M4 20V10 M10 20V4 M16 20v-7 M22 20H2",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
} as const;

const ICON_FOR: Record<string, keyof typeof ICONS> = {
  "website-digital-systems": "code",
  "design-systems": "grid",
  "growth-marketing": "chart",
  seo: "search",
  "automation-crm": "bolt",
};

// Header toggle icons.
const H = {
  monitor: "M3 4.5h18v12H3z M8.5 20.5h7 M12 16.5v4",
  phone: "M7 2.5h10v19H7z M10.5 18.5h3",
  moon: "M20.5 13.6A7.5 7.5 0 1 1 10.4 3.5 6 6 0 0 0 20.5 13.6Z",
  sun: "M12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Z M12 1.8v2.2 M12 20v2.2 M4 12H1.8 M22.2 12H20 M5.4 5.4 3.9 3.9 M20.1 20.1l-1.5-1.5 M18.6 5.4l1.5-1.5 M3.9 20.1l1.5-1.5",
};

const CURSOR: Record<string, { label: string; color: string; border: string }> = {
  "website-digital-systems": { label: "Web", color: "#2f80ed", border: "#1f5fc0" },
  "design-systems": { label: "Design", color: "#27ae60", border: "#1c8c4c" },
  "growth-marketing": { label: "Growth", color: "#f79009", border: "#dc6803" },
  seo: { label: "SEO", color: "#e0479e", border: "#b83480" },
  "automation-crm": { label: "Automation", color: "#c0392b", border: "#922b21" },
};

type Tok = { t: string; c: string };

// Theme-dependent UI + syntax colours.
const THEME = {
  dark: {
    base: "transparent",
    sheen:
      "linear-gradient(134deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 55%)",
    border: "rgba(212,228,254,0.19)",
    codeBg: "#05050a",
    lineNo: "#2f3336",
    headText: "rgba(252,253,255,0.94)",
    sub: "rgba(239,245,255,0.69)",
    faint: "rgba(239,245,255,0.45)",
    sel: "#3cabff",
    tagText: "rgba(239,245,255,0.8)",
    iconOff: "rgba(239,245,255,0.55)",
    syntax: {
      prompt: "#68cc58",
      kw: "#737a7f",
      num: "#464a4d",
      cap: "#ebeced",
      desc: "#ffc446",
      out: "#a1fcea",
      punc: "#737a7f",
    } as Record<string, string>,
  },
  light: {
    base: "#eceef1",
    sheen:
      "linear-gradient(134deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.015) 50%, rgba(0,0,0,0) 55%)",
    border: "rgba(10,20,40,0.12)",
    codeBg: "#f7f8fa",
    lineNo: "#b3b8c0",
    headText: "#1f2328",
    sub: "#5b6472",
    faint: "#8a909a",
    sel: "#0a84ff",
    tagText: "#3a414c",
    iconOff: "#8a909a",
    syntax: {
      prompt: "#1a7f37",
      kw: "#6a737d",
      num: "#b3b8c0",
      cap: "#1f2328",
      desc: "#b35900",
      out: "#0a7ea4",
      punc: "#8a909a",
    } as Record<string, string>,
  },
};

const fileName = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".tsx";

function buildLines(service: DevService): Tok[][] {
  const lines: Tok[][] = [
    [
      { t: "$ ", c: "prompt" },
      { t: "kiosk services --get ", c: "kw" },
      { t: `"${service.slug}"`, c: "desc" },
    ],
    [],
    [{ t: `# ${service.name}`, c: "kw" }],
    [],
  ];
  service.capabilities.forEach((cap, i) => {
    lines.push([
      { t: `${String(i + 1).padStart(2, "0")}  `, c: "num" },
      { t: cap.capability, c: "cap" },
      { t: "  —  ", c: "punc" },
      { t: cap.description, c: "desc" },
      { t: "  →  ", c: "punc" },
      { t: cap.outcome, c: "out" },
    ]);
  });
  return lines;
}

function Icon({ name, className }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={ICONS[name]} />
    </svg>
  );
}

// High-quality brand icons extracted from Figma (Resend ref, node 2:1455).
// Single-tone vectors that inherit the tab colour via `fill="currentColor"`.
const BRAND_PATHS: Record<string, React.ReactNode> = {
  // Node.js
  "website-digital-systems": (
    <>
      <path d="M15.1949 26.4475C15.442 26.5917 15.7219 26.6667 16.0037 26.6667L16.0029 26.6625C16.2885 26.6625 16.5684 26.5883 16.8155 26.4433L24.5245 21.9292C25.0225 21.6356 25.3333 21.0897 25.3333 20.5047V11.4839C25.3333 10.8969 25.0225 10.351 24.5245 10.0594L16.8155 5.5432C16.3311 5.26337 15.6825 5.26337 15.1941 5.5432L7.47541 10.0575C6.97549 10.3471 6.66667 10.8949 6.66667 11.482V20.5027C6.66667 21.0877 6.97549 21.6356 7.47541 21.9292L9.49823 23.1111C10.4787 23.6003 10.83 23.6003 11.2759 23.6003C12.7255 23.6003 13.5593 22.7099 13.5593 21.1601V12.2529C13.5593 12.1257 13.4589 12.0279 13.3373 12.0279H12.3607C12.2352 12.0279 12.1368 12.1257 12.1368 12.2529V21.1563C12.1368 21.8451 11.4361 22.5299 10.2896 21.9487L8.17799 20.712C8.10464 20.6709 8.05832 20.5888 8.05832 20.5027V11.482C8.05832 11.3959 8.1058 11.3117 8.18049 11.2687L15.8869 6.76031C15.9583 6.71725 16.0529 6.71725 16.1243 6.76031L23.8323 11.2687C23.9052 11.3137 23.9515 11.3939 23.9515 11.4839V20.5047C23.9515 20.5907 23.9052 20.6748 23.8337 20.716L16.1228 25.2283C16.0565 25.2673 15.9552 25.2673 15.8839 25.2283L13.9061 24.0385C13.8473 24.0033 13.772 23.9916 13.7145 24.0248C13.1673 24.3399 13.0633 24.3809 12.5506 24.5629C12.4238 24.6073 12.2362 24.6844 12.6207 24.9024L15.1949 26.4475Z" />
      <path d="M14.3041 17.5639C14.3041 18.8807 15.0116 20.4508 18.3855 20.4508L18.3743 20.46C20.8179 20.46 22.2192 19.4836 22.2192 17.7812C22.2192 16.0925 21.0939 15.6424 18.7236 15.3235C16.3303 15.0025 16.0871 14.8363 16.0871 14.2668C16.0871 13.7972 16.2936 13.1711 18.0675 13.1711C19.6521 13.1711 20.2349 13.5175 20.4763 14.5995C20.4975 14.7012 20.5883 14.7756 20.6924 14.7756H21.6941C21.756 14.7756 21.8157 14.7483 21.8583 14.7032C21.9007 14.6563 21.9239 14.5936 21.9181 14.5291C21.7637 12.6623 20.54 11.7935 18.0712 11.7935C15.8728 11.7935 14.5603 12.7327 14.5603 14.3099C14.5603 16.0221 15.8651 16.4936 17.9767 16.7049C20.5013 16.9555 20.6983 17.3292 20.6983 17.8321C20.6983 18.7057 20.0072 19.078 18.382 19.078C16.3419 19.078 15.894 18.5591 15.7435 17.5301C15.7261 17.42 15.6335 17.3388 15.5235 17.3388H14.5275C14.4037 17.3388 14.3041 17.4385 14.3041 17.5639Z" />
    </>
  ),
  // Python
  "design-systems": (
    <path fillRule="evenodd" clipRule="evenodd" d="M11.8974 8.45584C11.8974 8.1886 12.1343 7.75632 12.9277 7.34916C13.6801 6.96307 14.7657 6.70085 16 6.70085C17.2343 6.70085 18.3199 6.96307 19.0723 7.34916C19.8657 7.75632 20.1025 8.1886 20.1025 8.45584L20.1024 11.2137V11.4416C20.1024 12.5644 20.0311 13.3491 19.8861 13.9041C19.7451 14.4439 19.5485 14.7152 19.3252 14.8808C19.084 15.0593 18.7209 15.1829 18.1159 15.2491C17.5095 15.3153 16.7541 15.3163 15.772 15.3163H15.7373C14.9108 15.3163 14.164 15.3163 13.5352 15.3924C12.8923 15.4704 12.2829 15.6364 11.7836 16.0359C11.2743 16.4433 10.9651 17.0237 10.7818 17.7572C10.6255 18.3824 10.5511 19.1559 10.5339 20.1025H8.45584C8.1886 20.1025 7.75631 19.8657 7.34916 19.0723C6.96305 18.3199 6.70085 17.2343 6.70085 16C6.70085 14.7657 6.96305 13.6801 7.34916 12.9277C7.75631 12.1343 8.1886 11.8974 8.45584 11.8974H11.2137H16V10.5299H11.8974V8.45584ZM8.45584 21.4701H10.5299L10.5299 23.5443C10.5299 24.5985 11.3645 25.3857 12.3034 25.8675C13.2833 26.3703 14.5908 26.6667 16 26.6667C17.4092 26.6667 18.7167 26.3703 19.6965 25.8675C20.6355 25.3857 21.4701 24.5985 21.4701 23.5443V21.4701H23.5441C24.5985 21.4701 25.3857 20.6355 25.8675 19.6965C26.3703 18.7167 26.6667 17.4092 26.6667 16C26.6667 14.5908 26.3703 13.2833 25.8675 12.3034C25.3857 11.3645 24.5985 10.5299 23.5441 10.5299H21.4701V8.45585C21.4701 7.40137 20.6355 6.61428 19.6965 6.13249C18.7167 5.62964 17.4092 5.33333 16 5.33333C14.5908 5.33333 13.2833 5.62964 12.3034 6.13249C11.3645 6.61428 10.5299 7.40137 10.5299 8.45584V10.5299H8.45584C7.40136 10.5299 6.61428 11.3645 6.13249 12.3034C5.62964 13.2833 5.33333 14.5908 5.33333 16C5.33333 17.4092 5.62964 18.7167 6.13249 19.6965C6.61428 20.6355 7.40136 21.4701 8.45584 21.4701ZM16 21.4701H20.1025V23.5443C20.1025 23.8115 19.8657 24.2437 19.0723 24.6508C18.3199 25.0369 17.2343 25.2992 16 25.2992C14.7657 25.2992 13.6801 25.0369 12.9277 24.6508C12.1343 24.2437 11.8974 23.8115 11.8974 23.5443L11.8974 20.7863V20.5584C11.8974 19.4368 11.9686 18.6483 12.1084 18.0889C12.2456 17.5404 12.435 17.266 12.6379 17.1037C12.8509 16.9333 13.1675 16.8145 13.6997 16.75C14.2373 16.6848 14.9029 16.6837 15.772 16.6837H15.8052C16.7467 16.6837 17.5755 16.6837 18.2644 16.6085C18.9627 16.5321 19.6109 16.3708 20.1391 15.9796C20.6848 15.5755 21.0153 14.9921 21.2092 14.2497C21.3735 13.6209 21.4487 12.8441 21.466 11.8974H23.5441C23.8115 11.8974 24.2437 12.1343 24.6508 12.9277C25.0368 13.6801 25.2992 14.7657 25.2992 16C25.2992 17.2343 25.0368 18.3199 24.6508 19.0723C24.2437 19.8657 23.8115 20.1025 23.5441 20.1025H20.7864H16V21.4701ZM13.5741 9.78113C14.0471 9.78113 14.4305 9.39772 14.4305 8.92475C14.4305 8.45179 14.0471 8.06837 13.5741 8.06837C13.1012 8.06837 12.7178 8.45179 12.7178 8.92475C12.7178 9.39772 13.1012 9.78113 13.5741 9.78113ZM18.4303 23.9377C18.9041 23.9377 19.2881 23.5537 19.2881 23.0801C19.2881 22.6063 18.9041 22.2223 18.4303 22.2223C17.9565 22.2223 17.5725 22.6063 17.5725 23.0801C17.5725 23.5537 17.9565 23.9377 18.4303 23.9377Z" />
  ),
  // PHP
  "growth-marketing": (
    <path fillRule="evenodd" clipRule="evenodd" d="M13.5703 10.7303C13.5777 10.6934 13.6111 10.6667 13.6499 10.6667H15.2693C15.2936 10.6667 15.3165 10.6772 15.332 10.6953C15.3473 10.7134 15.3536 10.7372 15.3491 10.7602L14.9827 12.5899C15.1328 12.5895 15.2821 12.5881 15.4299 12.5867C15.9303 12.5819 16.4109 12.5773 16.8381 12.6108C17.4175 12.6561 17.9213 12.7724 18.2551 13.0705C18.4293 13.2257 18.5421 13.3953 18.5981 13.6197C18.6533 13.8408 18.652 14.1104 18.6091 14.4639C18.552 14.9336 18.4187 15.568 18.2313 16.4592C18.1376 16.9055 18.0301 17.4161 17.9121 18.0028C17.9047 18.0397 17.8712 18.0664 17.8324 18.0664H16.192C16.1677 18.0664 16.1448 18.0559 16.1293 18.0377C16.114 18.0197 16.1077 17.9959 16.1124 17.9728C16.2405 17.3329 16.3489 16.8036 16.4391 16.3641C16.5893 15.6305 16.6884 15.1469 16.7421 14.8171C16.7852 14.5525 16.7975 14.3953 16.7863 14.2904C16.7759 14.1928 16.7456 14.1424 16.6947 14.0895C16.5989 13.9897 16.4336 13.94 16.1029 13.9216C15.8795 13.9091 15.5947 13.9111 15.226 13.9135C15.0724 13.9145 14.9041 13.9157 14.72 13.9159L13.8976 18.0028C13.8903 18.0397 13.8568 18.0664 13.818 18.0664H12.2003C12.1761 18.0664 12.1531 18.0559 12.1377 18.0377C12.1223 18.0197 12.1161 17.9959 12.1207 17.9728L13.5703 10.7303ZM6.78617 12.6588C6.79357 12.6219 6.82697 12.5952 6.86584 12.5952H9.99964C10.9514 12.5952 11.6715 12.8347 12.1232 13.3396C12.5568 13.8221 12.6882 14.5368 12.5688 15.2539C12.4492 15.972 12.0764 16.7047 11.4835 17.2329C10.5281 18.0996 9.49489 18.0908 8.00837 18.0781C7.84295 18.0767 7.67191 18.0752 7.49473 18.0749L7.12232 19.9363C7.11492 19.9733 7.08152 20 7.04265 20H5.41447C5.39024 20 5.36729 19.9895 5.35188 19.9713C5.33647 19.9533 5.3302 19.9295 5.33483 19.9064L6.78617 12.6588ZM19.5071 12.6588C19.5144 12.6219 19.5479 12.5952 19.5867 12.5952H22.7223C23.6741 12.5952 24.3941 12.8347 24.8457 13.3396C25.2793 13.8221 25.4108 14.5368 25.2913 15.2539C25.1717 15.972 24.7991 16.7047 24.206 17.2329C23.2571 18.0927 22.2695 18.0867 20.6924 18.0771C20.5399 18.0761 20.3815 18.0752 20.2175 18.0749L19.8449 19.9363C19.8375 19.9733 19.8041 20 19.7653 20H18.1336C18.1093 20 18.0864 19.9895 18.0709 19.9713C18.0556 19.9533 18.0493 19.9295 18.0539 19.9064L19.5071 12.6588ZM8.3386 13.8955L7.76252 16.7713C7.86327 16.7717 7.96216 16.7728 8.05923 16.7739C8.29648 16.7763 8.52309 16.7787 8.7396 16.772C9.07208 16.7617 9.37109 16.7303 9.63167 16.6473C9.89059 16.5651 10.1114 16.4323 10.289 16.218C10.4673 16.0029 10.6061 15.7009 10.6921 15.2744C10.8136 14.6631 10.7235 14.3388 10.5146 14.1571C10.4075 14.064 10.2615 14.0011 10.0756 13.9599C9.88951 13.9188 9.66859 13.9008 9.41612 13.8939C9.20179 13.888 8.96981 13.8903 8.72033 13.8927C8.59743 13.894 8.46999 13.8952 8.3386 13.8955ZM21.0559 13.8955L20.4799 16.7713C20.5905 16.772 20.6989 16.7735 20.8053 16.7748C21.0248 16.7779 21.2357 16.7807 21.4399 16.7756C21.7701 16.7672 22.07 16.738 22.3328 16.6567C22.594 16.5759 22.8183 16.4436 22.9991 16.2283C23.1807 16.012 23.3224 15.7071 23.4095 15.2744C23.5309 14.6628 23.4424 14.3385 23.2348 14.1569C23.1285 14.064 22.9833 14.0009 22.7977 13.9599C22.6123 13.9188 22.3915 13.9008 22.1388 13.8939C21.9241 13.888 21.6911 13.8903 21.4401 13.8927C21.3165 13.894 21.1881 13.8952 21.0559 13.8955Z" />
  ),
  // Go
  seo: (
    <path fillRule="evenodd" clipRule="evenodd" d="M15.8376 13.6461C15.4051 13.77 15.0491 13.8765 14.6864 13.9851C14.3976 14.0715 14.1045 14.1592 13.7655 14.2579L13.7451 14.264C13.5793 14.3141 13.562 14.3193 13.4077 14.1188C13.2228 13.8825 13.0871 13.7296 12.8281 13.5905C12.0511 13.1597 11.2987 13.2848 10.5956 13.7991C9.75693 14.4107 9.32524 15.3143 9.33757 16.4403C9.34991 17.5523 10.0283 18.4697 11.0027 18.6227C11.8414 18.7477 12.5444 18.4141 13.0994 17.7052C13.1817 17.5919 13.2572 17.4708 13.3411 17.3367C13.3703 17.2897 13.4005 17.2412 13.4324 17.1909H11.052C10.793 17.1909 10.7313 17.0101 10.8177 16.7739C10.978 16.3429 11.274 15.6201 11.4467 15.2587C11.4837 15.1752 11.57 15.0363 11.755 15.0363H15.7244C15.9027 14.3997 16.192 13.7983 16.5777 13.2292C17.4781 11.8947 18.5635 11.1997 20.0313 10.9078C21.2893 10.6576 22.4733 10.7966 23.5465 11.6167C24.5208 12.3674 25.1252 13.3821 25.2855 14.7167C25.4952 16.5932 25.0141 18.1223 23.8671 19.4288C23.0531 20.3601 22.054 20.944 20.9069 21.2081C20.6884 21.2539 20.4697 21.2755 20.2545 21.2968C20.142 21.3079 20.0304 21.3191 19.9201 21.3333C18.7979 21.3055 17.7741 20.944 16.9108 20.1101C16.3035 19.5184 15.8852 18.7913 15.6773 17.9448C15.5331 18.2732 15.3605 18.5876 15.1592 18.8868C14.2712 20.2073 13.1118 21.0275 11.644 21.2499C10.4353 21.4307 9.31291 21.1665 8.32619 20.3324C7.41347 19.554 6.89544 18.5253 6.75976 17.2465C6.59943 15.7313 6.99411 14.3691 7.80815 13.1736C8.68387 11.8808 9.84327 11.0607 11.2617 10.7687C12.4211 10.5324 13.5311 10.6853 14.5301 11.4499C15.1839 11.9364 15.6525 12.6036 15.9609 13.4099C16.0349 13.5349 15.9856 13.6045 15.8376 13.6461ZM1.91172 13.8964C1.86239 13.8964 1.85005 13.8685 1.87472 13.8269L2.13373 13.4516C2.1584 13.4099 2.22007 13.3821 2.2694 13.3821H6.67264C6.72199 13.3821 6.73432 13.4237 6.70964 13.4655L6.49996 13.8269C6.47531 13.8685 6.41364 13.9103 6.37663 13.9103L1.91172 13.8964ZM0.0493354 15.1755C-5.76311e-06 15.1755 -0.0123313 15.1476 0.0123328 15.106L0.271352 14.7307C0.296016 14.6889 0.357682 14.6611 0.407024 14.6611H6.03132C6.08067 14.6611 6.10533 14.7028 6.09299 14.7445L5.99432 15.0781C5.98199 15.1337 5.93265 15.1616 5.88332 15.1616L0.0493354 15.1755ZM2.99716 16.3708C2.97249 16.4124 2.98483 16.4541 3.03416 16.4541L5.72297 16.468C5.75997 16.468 5.80931 16.4264 5.80931 16.3708L5.83397 16.0371C5.83397 15.9815 5.80931 15.9399 5.75997 15.9399H3.29317C3.24385 15.9399 3.19451 15.9815 3.16984 16.0232L2.99716 16.3708ZM22.8472 15.5693C22.8497 15.6159 22.8521 15.6649 22.8557 15.7175C22.794 16.9129 22.2637 17.8025 21.2893 18.3725C20.6356 18.7479 19.9572 18.7895 19.2788 18.4559C18.3908 18.0111 17.9221 16.9129 18.1441 15.8287C18.4155 14.522 19.1556 13.7019 20.3027 13.41C21.4743 13.1041 22.5967 13.8825 22.8187 15.2587C22.8363 15.3573 22.8413 15.4559 22.8472 15.5693Z" />
  ),
  // Java
  "automation-crm": (
    <path d="M17.6251 3C19.0273 6.3086 12.5977 8.33593 12 11.0937C11.4531 13.6251 15.8085 16.5937 15.8125 16.5937C15.1484 15.5469 14.664 14.664 14 13.0313C12.875 10.2734 20.8555 7.78516 17.6251 3ZM21.8749 7.59375C21.8749 7.59375 16.2539 7.94921 15.9688 11.625C15.8399 13.2617 17.4531 14.1211 17.5 15.3125C17.5391 16.2852 16.5312 17.0937 16.5312 17.0937C16.5312 17.0937 18.3399 16.7656 18.9063 15.2812C19.5312 13.6328 17.6875 12.5078 17.8749 11.1875C18.0547 9.92579 21.8749 7.59375 21.8749 7.59375ZM23.25 16.0625C22.6601 16.0352 21.9961 16.2539 21.4063 16.6875C22.5703 16.4297 23.5625 17.1601 23.5625 18C23.5625 19.8828 20.8749 21.6563 20.8749 21.6563C20.8749 21.6563 25.0312 21.1915 25.0312 18.0937C25.0312 16.8164 24.2305 16.1093 23.25 16.0625ZM12.2187 16.0937C10.7695 16.1445 7.875 16.3828 7.875 17.5C7.875 19.0547 14.6172 19.1757 19.4375 18.2188C19.4375 18.2188 20.75 17.3047 21.0937 16.9688C17.9336 17.6251 10.7187 17.7265 10.7187 17.1563C10.7187 16.6328 13.0313 16.0937 13.0313 16.0937C13.0313 16.0937 12.7031 16.0781 12.2187 16.0937ZM11.7813 18.9688C10.9883 18.9688 9.81251 19.586 9.81251 20.1875C9.81251 21.3984 15.7812 22.3281 20.1875 20.5625L18.6563 19.6251C15.668 20.6016 10.1484 20.2773 11.7813 18.9688ZM12.5313 21.6875C11.4492 21.6875 10.75 22.3711 10.75 22.8749C10.75 24.4257 17.2148 24.5781 19.7812 23L18.1563 21.9375C16.2421 22.7617 11.4258 22.8828 12.5313 21.6875ZM8.90625 23.0937C7.14063 23.0585 6 23.8593 6 24.5312C6 28.1055 24.0937 27.9336 24.0937 24.2812C24.0937 23.6757 23.3789 23.3867 23.1251 23.25C24.6016 26.7421 8.34375 26.4688 8.34375 24.4063C8.34375 23.9375 9.54688 23.4688 10.6563 23.6875L9.71875 23.1563C9.4414 23.1133 9.16016 23.0976 8.90625 23.0937ZM26 25.5C23.25 28.1601 16.2891 29.1133 9.28125 27.4688C16.2891 30.3984 25.9648 28.7695 26 25.5Z" />
  ),
};

function BrandIcon({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
      {BRAND_PATHS[slug] ?? BRAND_PATHS["website-digital-systems"]}
    </svg>
  );
}

function HBtn({
  d,
  active,
  onClick,
  ui,
}: {
  d: string;
  active: boolean;
  onClick: () => void;
  ui: (typeof THEME)["dark"];
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-8 items-center justify-center transition-colors"
      style={{ backgroundColor: active ? "rgba(121,121,250,0.18)" : "transparent" }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? ui.sel : ui.iconOff}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[18px]"
        aria-hidden
      >
        <path d={d} />
      </svg>
    </button>
  );
}

export default function DevTerminal({ services }: { services: DevService[] }) {
  const [active, setActive] = useState(0);
  const [selFile, setSelFile] = useState(0);
  const [replay, setReplay] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const rafRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);

  const ui = THEME[theme];
  const service = services[active];
  const cursor =
    CURSOR[service.slug] ?? { label: service.name, color: "#f79009", border: "#dc6803" };
  const lines = buildLines(service);
  const total = lines.reduce(
    (sum, line) => sum + line.reduce((s, tok) => s + tok.t.length, 0),
    0,
  );
  const outcomes = service.capabilities.map((c) => c.outcome);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRevealed(0);
    let shown = 0;
    let last = performance.now();
    const SPEED = 0.05;
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      shown = Math.min(total, shown + dt * SPEED);
      setRevealed(Math.floor(shown));
      if (shown < total) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, replay]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const c = cur.current;
      const t = target.current;
      c.x += (t.x - c.x) * 0.25;
      c.y += (t.y - c.y) * 0.25;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${c.x - 2}px, ${c.y - 2}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll-linked scale: the panel grows as it scrolls into view and shrinks
  // again on the way out — smoothly eased in both directions.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.transformOrigin = "50% 50%";
    let raf = 0;
    let running = false;
    let targetP = 0;
    let curP = 0;
    const computeTarget = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      targetP = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.6)));
    };
    const apply = (p: number) => {
      const e = 1 - Math.pow(1 - p, 3);
      const s = 0.86 + 0.14 * e;
      scaleRef.current = s;
      el.style.transform = `translateY(${(1 - e) * 40}px) scale(${s})`;
      el.style.opacity = String(0.4 + 0.6 * e);
    };
    const tick = () => {
      curP += (targetP - curP) * 0.06;
      if (Math.abs(targetP - curP) < 0.0015) {
        curP = targetP;
        apply(curP);
        running = false;
        return;
      }
      apply(curP);
      raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      computeTarget();
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    computeTarget();
    curP = targetP;
    apply(curP);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const s = scaleRef.current || 1;
    target.current = { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
  };
  const handleEnter = (e: MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const s = scaleRef.current || 1;
    const p = { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
    target.current = p;
    cur.current = { ...p };
    setHovering(true);
  };

  const typing = revealed < total;
  let offset = 0;

  return (
    <div className="mt-12 flex flex-col gap-12 md:mt-16">
      {/* Service tab row — centred */}
      <div className="relative">
        <div className="flex justify-center gap-8 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {services.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => {
                  setActive(i);
                  setSelFile(0);
                  setRevealed(0);
                }}
                className="flex shrink-0 flex-col items-center gap-3"
              >
                <span
                  className="flex size-14 items-center justify-center rounded-2xl border transition-colors duration-300"
                  style={{
                    borderColor: "rgba(212,228,254,0.19)",
                    backgroundImage: on
                      ? "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.02))"
                      : "none",
                  }}
                >
                  <BrandIcon
                    slug={s.slug}
                    className={`size-7 transition-colors duration-300 ${
                      on ? "text-accent" : "text-[rgba(239,245,255,0.55)]"
                    }`}
                  />
                </span>
                <span
                  className={`whitespace-nowrap text-[13.9px] transition-colors duration-300 ${
                    on ? "text-[rgba(252,253,255,0.94)]" : "text-[rgba(239,245,255,0.69)]"
                  }`}
                >
                  {s.name.split(" ")[0].replace("&", "")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor panel (scroll-scaled wrapper) */}
      <div ref={wrapRef} className="will-change-transform">
      <div
        ref={panelRef}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setHovering(false)}
        className="theme-anim relative overflow-hidden rounded-3xl [cursor:none]"
        style={{
          border: `1px solid ${ui.border}`,
          backgroundColor: ui.base,
          backgroundImage: ui.sheen,
        }}
      >
        {/* Header — traffic lights + functional toggles */}
        <div className="flex h-12 items-center justify-between px-4" style={{ borderBottom: `1px solid ${ui.border}` }}>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[rgba(255,107,109,0.94)]" />
            <span className="size-2.5 rounded-full bg-[#ffcb47]" />
            <span className="size-2.5 rounded-full bg-[rgba(66,255,164,0.7)]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center overflow-hidden rounded-lg border" style={{ borderColor: ui.border }}>
              <HBtn d={H.monitor} active={device === "desktop"} onClick={() => setDevice("desktop")} ui={ui} />
              <HBtn d={H.phone} active={device === "mobile"} onClick={() => setDevice("mobile")} ui={ui} />
            </div>
            <div className="flex items-center overflow-hidden rounded-lg border" style={{ borderColor: ui.border }}>
              <HBtn d={H.moon} active={theme === "dark"} onClick={() => setTheme("dark")} ui={ui} />
              <HBtn d={H.sun} active={theme === "light"} onClick={() => setTheme("light")} ui={ui} />
            </div>
          </div>
        </div>

        {/* Body — sidebar | code | preview (fades in on service switch) */}
        <div key={active} className="dev-fade flex h-[460px]">
          <aside className="hidden w-[200px] shrink-0 overflow-y-auto p-2 md:block" style={{ borderRight: `1px solid ${ui.border}` }}>
            <div className="flex flex-col gap-1">
              {service.capabilities.map((c, i) => {
                const on = i === selFile;
                return (
                  <button
                    key={c.capability}
                    type="button"
                    onClick={() => {
                      setSelFile(i);
                      setReplay((r) => r + 1);
                    }}
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-[13.5px] transition-colors"
                    style={{ color: on ? ui.sel : ui.sub }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0" aria-hidden>
                      <path d="M6 2h8l4 4v16H6z M14 2v4h4" stroke={on ? ui.sel : ui.faint} strokeWidth="1.4" strokeLinejoin="round" />
                    </svg>
                    <span className="truncate">{fileName(c.capability)}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Code column */}
          <div className="relative min-w-0 flex-1 overflow-auto" style={{ backgroundColor: ui.codeBg }}>
            <div className="p-4 font-mono text-[13px] leading-[24px]">
              {lines.map((line, li) => {
                const has = line.length > 0;
                return (
                  <div key={li} className="flex gap-5">
                    <span className="w-6 shrink-0 select-none text-right" style={{ color: ui.lineNo }}>
                      {li + 1}
                    </span>
                    <span className="whitespace-pre-wrap break-words">
                      {has
                        ? line.map((tok, ti) => {
                            const start = offset;
                            offset += tok.t.length;
                            const shown = Math.max(0, Math.min(tok.t.length, revealed - start));
                            const atCursor = typing && revealed >= start && revealed < start + tok.t.length;
                            return (
                              <span key={ti} style={{ color: ui.syntax[tok.c] }}>
                                {tok.t.slice(0, shown)}
                                {atCursor && (
                                  <span className="inline-block w-[7px] -translate-y-[1px] animate-pulse bg-accent">&nbsp;</span>
                                )}
                              </span>
                            );
                          })
                        : " "}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview card column — desktop / mobile */}
          <div
            className="hidden w-[360px] shrink-0 overflow-y-auto p-6 lg:block"
            style={{
              borderLeft: `1px solid ${ui.border}`,
              backgroundImage:
                "radial-gradient(120% 80% at 50% 0%, rgba(0,163,255,0.10), rgba(0,163,255,0) 60%)",
            }}
          >
            <div
              className={
                device === "mobile"
                  ? "mx-auto w-[280px] rounded-[28px] border p-5"
                  : "w-full"
              }
              style={device === "mobile" ? { borderColor: ui.border } : undefined}
            >
              <div className="flex items-center gap-2 text-accent">
                <Icon name={ICON_FOR[service.slug] ?? "code"} className="size-5" />
                <span className="text-[12px] uppercase tracking-[0.12em]" style={{ color: ui.faint }}>
                  Preview
                </span>
              </div>
              <h4 className="mt-5 font-display text-2xl font-medium leading-tight" style={{ color: ui.headText }}>
                {service.name}
              </h4>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: ui.sub }}>
                {service.overview}
              </p>
              <p className="mt-6 text-[12px] uppercase tracking-[0.12em]" style={{ color: ui.faint }}>
                Outcomes
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {outcomes.map((o) => (
                  <span
                    key={o}
                    className="rounded-full border px-3 py-1 text-xs"
                    style={{ borderColor: ui.border, color: ui.tagText }}
                  >
                    {o}
                  </span>
                ))}
              </div>
              <a
                href="/services"
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#00a3ff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1ab0ff]"
                style={{ cursor: "none" }}
              >
                Get Started
              </a>
            </div>
          </div>
        </div>

        {/* Lightweight film grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
        {/* Custom multiplayer-style cursor */}
        <div
          ref={cursorRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 will-change-transform transition-opacity duration-150"
          style={{ opacity: hovering ? 1 : 0 }}
        >
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
            <path
              d="M3 2.5 L3 17.6 L7 13.8 L9.6 19 L12 17.9 L9.4 12.7 L15 12.7 Z"
              fill="#ffffff"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="absolute left-[15px] top-[16px] whitespace-nowrap rounded-bl-[24px] rounded-br-[24px] rounded-tl-[2px] rounded-tr-[24px] border-2 pb-2 pl-4 pr-5 pt-2 text-[15px] font-medium leading-6 text-white"
            style={{
              backgroundColor: cursor.color,
              borderColor: cursor.border,
              boxShadow: `4px 4px 12px ${cursor.color}29`,
            }}
          >
            {cursor.label}
          </span>
        </div>
      </div>
      </div>
    </div>
  );
}
