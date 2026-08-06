// Icons extracted EXACTLY from the Figma "Browse App" file (node 2026:2638).
// Each composite icon is rebuilt once from its exported vector fragments and
// reused. Assets live in /public/architect-ui (downloaded from Figma).
import type { ReactNode } from "react";

const A = "/architect-ui";

function Frag({
  pos,
  inner,
  src,
}: {
  pos: string;
  inner: string;
  src: string;
}): ReactNode {
  return (
    <div className={`absolute ${pos}`}>
      <div className={`absolute ${inner}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="block max-w-none size-full" src={src} />
      </div>
    </div>
  );
}

// Sidebar "All" icon — Menu Nine Circles
export function NineCircles() {
  const v = `${A}/v4.svg`;
  const inner = "inset-[-56.25%]";
  const pos = [
    "bottom-[45.83%] left-[16.67%] right-3/4 top-[45.83%]",
    "bottom-[45.83%] left-3/4 right-[16.67%] top-[45.83%]",
    "bottom-[16.67%] left-[45.83%] right-[45.83%] top-3/4",
    "bottom-3/4 left-[45.83%] right-[45.83%] top-[16.67%]",
    "inset-[45.83%]",
    "bottom-[16.67%] left-[16.67%] right-3/4 top-3/4",
    "bottom-[16.67%] left-3/4 right-[16.67%] top-3/4",
    "bottom-3/4 left-[16.67%] right-3/4 top-[16.67%]",
    "bottom-3/4 left-3/4 right-[16.67%] top-[16.67%]",
  ];
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]">
      {pos.map((p, i) => (
        <Frag key={i} pos={p} inner={inner} src={v} />
      ))}
    </div>
  );
}

// Sidebar industry icon — Pattern Lock
export function PatternLock() {
  const v5 = `${A}/v5.svg`;
  const v6 = `${A}/v6.svg`;
  const v7 = `${A}/v7.svg`;
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]">
      <Frag pos="bottom-[58.33%] left-[83.33%] right-[16.67%] top-1/4" inner="inset-[-28.13%_-0.56px]" src={v5} />
      <Frag pos="bottom-1/4 left-[83.33%] right-[16.67%] top-[58.33%]" inner="inset-[-28.13%_-0.56px]" src={v5} />
      <Frag pos="bottom-[58.33%] left-[16.67%] right-[83.33%] top-1/4" inner="inset-[-28.13%_-0.56px]" src={v5} />
      <Frag pos="bottom-1/4 left-[16.67%] right-[83.33%] top-[58.33%]" inner="inset-[-28.13%_-0.56px]" src={v5} />
      <Frag pos="inset-[22.54%_55.87%_55.88%_22.54%]" inner="inset-[-21.72%]" src={v6} />
      <Frag pos="inset-[55.87%_22.54%_22.54%_55.88%]" inner="inset-[-21.72%]" src={v6} />
      <Frag pos="bottom-3/4 left-[8.33%] right-3/4 top-[8.33%]" inner="inset-[-28.13%]" src={v7} />
      <Frag pos="bottom-3/4 left-3/4 right-[8.33%] top-[8.33%]" inner="inset-[-28.13%]" src={v7} />
      <Frag pos="bottom-[41.67%] left-[8.33%] right-3/4 top-[41.67%]" inner="inset-[-28.13%]" src={v7} />
      <Frag pos="inset-[41.67%]" inner="inset-[-28.13%]" src={v7} />
      <Frag pos="bottom-[41.67%] left-3/4 right-[8.33%] top-[41.67%]" inner="inset-[-28.13%]" src={v7} />
      <Frag pos="bottom-[8.33%] left-[8.33%] right-3/4 top-3/4" inner="inset-[-28.13%]" src={v7} />
      <Frag pos="bottom-[8.33%] left-3/4 right-[8.33%] top-3/4" inner="inset-[-28.13%]" src={v7} />
      <Frag pos="bottom-3/4 left-[41.67%] right-[41.67%] top-[8.33%]" inner="inset-[-28.13%]" src={v7} />
      <Frag pos="bottom-[8.33%] left-[41.67%] right-[41.67%] top-3/4" inner="inset-[-28.13%]" src={v7} />
    </div>
  );
}

// Sidebar footer "Help center" icon
export function HelpIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]">
      <Frag pos="inset-[8.33%]" inner="inset-[-5.63%]" src={`${A}/v8.svg`} />
      <Frag pos="bottom-[41.67%] left-[37.5%] right-[37.49%] top-1/4" inner="inset-[-14.06%_-18.74%]" src={`${A}/v9.svg`} />
      <Frag pos="bottom-1/4 left-[49.96%] right-[49.96%] top-3/4" inner="inset-[-0.56px_-5624.87%]" src={`${A}/v10.svg`} />
    </div>
  );
}

// Top search magnifier
export function Magnifier() {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]">
      <div className="absolute flex inset-[63.7%_8.32%_8.34%_63.72%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="-rotate-45 flex-none h-[hypot(89.4626cqw,89.4626cqh)] w-[hypot(10.5374cqw,-10.5374cqh)]">
          <div className="relative size-full">
            <div className="absolute inset-[-8.83%_-75%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="block max-w-none size-full" src={`${A}/v11.svg`} />
            </div>
          </div>
        </div>
      </div>
      <Frag pos="bottom-1/4 left-[8.33%] right-1/4 top-[8.33%]" inner="inset-[-4.69%]" src={`${A}/v12.svg`} />
    </div>
  );
}

// "Kiosk Growth" logo mark (App Blocks)
export function LogoMark() {
  return (
    <div className="bg-[rgba(0,0,0,0.1)] relative rounded-[30px] shrink-0 size-[33px]">
      <div className="-translate-x-1/2 absolute bottom-[22.73%] left-1/2 overflow-clip top-[22.73%] w-[18px]">
        <Frag pos="inset-[8.31%_8.33%_50.02%_50.01%]" inner="inset-[-7.5%]" src={`${A}/v0.svg`} />
        <Frag pos="bottom-[12.5%] left-[12.5%] right-[50.01%] top-1/2" inner="inset-[-8.33%_-8.34%]" src={`${A}/v1.svg`} />
        <Frag pos="bottom-1/2 left-[12.5%] right-[50.01%] top-[12.5%]" inner="inset-[-8.33%_-8.34%]" src={`${A}/v2.svg`} />
        <Frag pos="bottom-[12.5%] left-[49.99%] right-[12.52%] top-1/2" inner="inset-[-8.33%_-8.34%]" src={`${A}/v3.svg`} />
      </div>
    </div>
  );
}

// Chevron inside the blue send button
export function Chevron() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <div className="absolute inset-[16.67%_33.33%]">
        <div className="absolute inset-[-7.03%_-14.06%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="block max-w-none size-full" src={`${A}/v13.svg`} />
        </div>
      </div>
    </div>
  );
}

// Pro badge sparkle mark (21px)
export function ProSparkle() {
  return (
    <div className="absolute left-[3px] overflow-clip size-[21px] top-[3px]">
      <div className="absolute flex inset-[2.42%_5.54%_5.54%_2.42%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="flex-none h-[hypot(-1.71556cqw,98.2844cqh)] rotate-1 w-[hypot(98.2844cqw,1.71556cqh)]">
          <div className="relative size-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/v14.svg`} />
          </div>
        </div>
      </div>
      <div className="absolute flex inset-[2.42%_5.54%_5.54%_2.42%] items-center justify-center" style={{ containerType: "size" }}>
        <div className="flex-none h-[hypot(-1.71556cqw,98.2844cqh)] rotate-1 w-[hypot(98.2844cqw,1.71556cqh)]">
          <div className="relative size-full">
            <div className="absolute inset-[-2.63%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="block max-w-none size-full" src={`${A}/v15.svg`} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute contents inset-[10.35%_13.46%_13.46%_10.35%]">
        <div
          className="absolute inset-[13.52%_16.64%_16.64%_13.52%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-0.667px_-0.667px] mask-size-[16px_16px]"
          style={{ maskImage: `url("${A}/group2.svg")` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/group3.svg`} />
        </div>
      </div>
    </div>
  );
}
