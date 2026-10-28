/** Ilustrações de joias em SVG (substitutas das fotos reais enquanto elas não chegam). */
export type ArtKind = "ring" | "earrings" | "necklace" | "bracelet" | "gem";

export default function JewelArt({ kind, id, className = "" }: { kind: ArtKind; id: string; className?: string }) {
  const g = `g-${id}`, s = `s-${id}`, v = `v-${id}`;
  return (
    <svg viewBox="0 0 200 250" className={className} role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e9c4" /><stop offset=".45" stopColor="#c9a25a" /><stop offset=".7" stopColor="#f2dfab" /><stop offset="1" stopColor="#8d6c33" />
        </linearGradient>
        <linearGradient id={s} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset=".5" stopColor="#9fb4e8" /><stop offset="1" stopColor="#e9ecf5" />
        </linearGradient>
        <radialGradient id={v} cx=".5" cy=".4" r=".6"><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
      </defs>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {kind === "ring" && (<>
          <ellipse cx="100" cy="150" rx="52" ry="58" stroke={`url(#${g})`} strokeWidth="7" />
          <ellipse cx="100" cy="150" rx="44" ry="50" stroke="#ffffff" strokeOpacity=".12" strokeWidth="1" />
          <path d="M100 66l24 18-24 30-24-30z" fill={`url(#${s})`} stroke={`url(#${g})`} strokeWidth="2.5" />
          <path d="M76 84h48M100 66l-10 18 10 30 10-30z" stroke="#fff" strokeOpacity=".65" strokeWidth="1" />
          <circle cx="100" cy="84" r="26" fill={`url(#${v})`} />
        </>)}
        {kind === "earrings" && (<>
          {[62, 138].map((x) => (
            <g key={x}>
              <path d={`M${x} 40c8 0 8 12 0 12`} stroke={`url(#${g})`} strokeWidth="3" />
              <circle cx={x} cy="64" r="8" fill={`url(#${g})`} />
              <path d={`M${x} 76v22`} stroke={`url(#${g})`} strokeWidth="2.5" />
              <path d={`M${x} 98c-20 18-20 52 0 70 20-18 20-52 0-70z`} fill={`url(#${s})`} stroke={`url(#${g})`} strokeWidth="3" />
              <path d={`M${x} 104v58M${x - 11} 132h22`} stroke="#fff" strokeOpacity=".6" strokeWidth="1" />
            </g>
          ))}
        </>)}
        {kind === "necklace" && (<>
          <path d="M34 52C44 150 156 150 166 52" stroke={`url(#${g})`} strokeWidth="3.5" strokeDasharray="1 7" />
          <path d="M34 52C44 150 156 150 166 52" stroke={`url(#${g})`} strokeWidth="1" strokeOpacity=".5" />
          <path d="M100 136v18" stroke={`url(#${g})`} strokeWidth="2.5" />
          <path d="M100 154c-20 8-30 28-18 46 6 10 30 10 36 0 12-18 2-38-18-46z" fill={`url(#${s})`} stroke={`url(#${g})`} strokeWidth="3" />
          <path d="M100 160v38M84 178h32" stroke="#fff" strokeOpacity=".6" strokeWidth="1" />
        </>)}
        {kind === "bracelet" && (<>
          <ellipse cx="100" cy="140" rx="64" ry="42" stroke={`url(#${g})`} strokeWidth="9" strokeOpacity=".95" />
          <ellipse cx="100" cy="140" rx="64" ry="42" stroke="#fff" strokeOpacity=".25" strokeWidth="1.5" strokeDasharray="2 10" />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={52 + i * 24} cy={168 + Math.sin(i * 1.1) * -4 - (i === 2 ? 0 : 3)} r="5" fill={`url(#${s})`} stroke={`url(#${g})`} strokeWidth="1.5" />
          ))}
          <rect x="88" y="94" width="24" height="14" rx="3" fill={`url(#${g})`} />
        </>)}
        {kind === "gem" && (<>
          <path d="M100 56l54 34-54 112L46 90z" fill={`url(#${s})`} stroke={`url(#${g})`} strokeWidth="3" />
          <path d="M46 90h108M76 90l24-34 24 34-24 112z" stroke="#fff" strokeOpacity=".7" strokeWidth="1.2" />
          <circle cx="100" cy="90" r="40" fill={`url(#${v})`} />
        </>)}
      </g>
    </svg>
  );
}
