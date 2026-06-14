/* Pixel cat mascots — one per Gitbank feature. Each is an 80×80 SVG. */

/* ── Hacker Cat (IssueOps Banking — green terminal) ────────────────── */
export function HackerCat() {
  return (
    <>
      <style>{`
        @keyframes hcPawL { 0%,100%{transform:translateY(0px)} 45%,55%{transform:translateY(-7px)} }
        @keyframes hcPawR { 0%,50%{transform:translateY(-7px)} 20%,80%{transform:translateY(0px)} }
        @keyframes hcBlink { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.08)} }
        @keyframes hcCursor { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes hcEyeGlow { 0%,100%{filter:drop-shadow(0 0 2px #10b981)} 50%{filter:drop-shadow(0 0 6px #10b981)} }
        @keyframes hcScreenLine { 0%{transform:translateY(0px);opacity:1} 90%{transform:translateY(-14px);opacity:1} 91%{transform:translateY(-14px);opacity:0} 92%,100%{transform:translateY(0px);opacity:0.8} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <rect x="0"  y="0"  width="26" height="22" fill="#1e293b"/>
        <rect x="2"  y="2"  width="22" height="18" fill="#0d1117"/>
        <rect x="0"  y="20" width="26" height="3"  fill="#334155"/>
        <g style={{animation:"hcScreenLine 2.4s linear infinite",clipPath:"inset(0 0 0 0)"}}>
          <rect x="4"  y="5"  width="16" height="2" fill="#10b981" opacity="0.9"/>
          <rect x="4"  y="9"  width="11" height="2" fill="#10b981" opacity="0.65"/>
          <rect x="4"  y="13" width="14" height="2" fill="#10b981" opacity="0.45"/>
          <rect x="4"  y="17" width="9"  height="2" fill="#10b981" opacity="0.3"/>
        </g>
        <rect x="16" y="17" width="3" height="2" fill="#10b981" style={{animation:"hcCursor 0.9s step-end infinite"}}/>
        <rect x="26" y="1"  width="8" height="11" fill="#6b7280"/>
        <rect x="28" y="3"  width="4" height="7"  fill="#f9a8d4"/>
        <rect x="46" y="1"  width="8" height="11" fill="#6b7280"/>
        <rect x="48" y="3"  width="4" height="7"  fill="#f9a8d4"/>
        <rect x="22" y="8"  width="36" height="26" fill="#6b7280"/>
        <rect x="24" y="9"  width="32" height="3"  fill="#9ca3af" opacity="0.25"/>
        <g style={{animation:"hcBlink 3.2s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="26" y="15" width="11" height="9" fill="#10b981" style={{animation:"hcEyeGlow 2s ease-in-out infinite"}}/>
          <rect x="29" y="17" width="5"  height="5" fill="#052e16"/>
          <rect x="27" y="15" width="3"  height="3" fill="white" opacity="0.7"/>
        </g>
        <g style={{animation:"hcBlink 3.2s ease-in-out infinite 0.14s",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="43" y="15" width="11" height="9" fill="#10b981" style={{animation:"hcEyeGlow 2s ease-in-out infinite 0.3s"}}/>
          <rect x="46" y="17" width="5"  height="5" fill="#052e16"/>
          <rect x="44" y="15" width="3"  height="3" fill="white" opacity="0.7"/>
        </g>
        <rect x="37" y="26" width="6"  height="4"  fill="#f9a8d4"/>
        <rect x="33" y="31" width="5"  height="2"  fill="#4b5563"/>
        <rect x="42" y="31" width="5"  height="2"  fill="#4b5563"/>
        <rect x="0"  y="23" width="20" height="2" fill="#9ca3af" opacity="0.55"/>
        <rect x="0"  y="27" width="16" height="2" fill="#9ca3af" opacity="0.35"/>
        <rect x="60" y="23" width="20" height="2" fill="#9ca3af" opacity="0.55"/>
        <rect x="64" y="27" width="16" height="2" fill="#9ca3af" opacity="0.35"/>
        <rect x="18" y="34" width="44" height="24" fill="#6b7280"/>
        <rect x="22" y="36" width="36" height="20" fill="#1e293b"/>
        <rect x="27" y="40" width="4" height="2" fill="#10b981" opacity="0.95"/>
        <rect x="25" y="42" width="2" height="2" fill="#10b981" opacity="0.95"/>
        <rect x="27" y="44" width="4" height="2" fill="#10b981" opacity="0.95"/>
        <rect x="33" y="44" width="7" height="2" fill="#10b981" opacity="0.95"/>
        <rect x="6"  y="36" width="12" height="18" fill="#6b7280"/>
        <rect x="62" y="36" width="12" height="18" fill="#6b7280"/>
        <g style={{animation:"hcPawL 0.45s cubic-bezier(.4,0,.6,1) infinite",transformOrigin:"14px 58px"}}>
          <rect x="4"  y="54" width="20" height="8"  fill="#9ca3af"/>
          <rect x="4"  y="54" width="4"  height="5"  fill="#d1d5db"/>
          <rect x="9"  y="54" width="4"  height="5"  fill="#d1d5db"/>
          <rect x="14" y="54" width="4"  height="5"  fill="#d1d5db"/>
          <rect x="19" y="54" width="4"  height="5"  fill="#d1d5db"/>
        </g>
        <g style={{animation:"hcPawR 0.45s cubic-bezier(.4,0,.6,1) infinite",transformOrigin:"66px 58px"}}>
          <rect x="56" y="54" width="20" height="8"  fill="#9ca3af"/>
          <rect x="56" y="54" width="4"  height="5"  fill="#d1d5db"/>
          <rect x="61" y="54" width="4"  height="5"  fill="#d1d5db"/>
          <rect x="66" y="54" width="4"  height="5"  fill="#d1d5db"/>
          <rect x="71" y="54" width="4"  height="5"  fill="#d1d5db"/>
        </g>
        <rect x="0"  y="64" width="80" height="16" fill="#1e293b"/>
        <rect x="0"  y="64" width="80" height="3"  fill="#334155"/>
        {([4,11,18,25,32,39,46,53,60,67,74] as number[]).map((kx,i) => (
          <rect key={i} x={kx} y={69} width="5" height="5" fill="#475569"/>
        ))}
        <rect x="18" y="69" width="44" height="5" fill="#475569" opacity="0.55"/>
      </svg>
    </>
  );
}

/* ── Banker Cat (DeFi — blue) ───────────────────────────────────────── */
export function BankerCat() {
  return (
    <>
      <style>{`
        @keyframes bcCoin  { 0%,100%{transform:translateY(0)}  45%{transform:translateY(-16px)} }
        @keyframes bcArm   { 0%,100%{transform:translateY(0)}  45%{transform:translateY(-14px)} }
        @keyframes bcBlink { 0%,88%,100%{transform:scaleY(1)}  93%{transform:scaleY(0.1)} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <rect x="22" y="2"  width="8"  height="10" fill="#9ca3af"/>
        <rect x="24" y="4"  width="4"  height="6"  fill="#f9a8d4"/>
        <rect x="50" y="2"  width="8"  height="10" fill="#9ca3af"/>
        <rect x="52" y="4"  width="4"  height="6"  fill="#f9a8d4"/>
        <rect x="18" y="10" width="44" height="26" fill="#9ca3af"/>
        <g style={{animation:"bcBlink 3.5s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="24" y="16" width="10" height="8" fill="#3b82f6"/>
          <rect x="27" y="18" width="4"  height="4" fill="#1e3a5f"/>
          <rect x="24" y="16" width="3"  height="3" fill="white" opacity="0.7"/>
        </g>
        <g style={{animation:"bcBlink 3.5s ease-in-out infinite 0.1s",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="46" y="16" width="10" height="8" fill="#3b82f6"/>
          <rect x="49" y="18" width="4"  height="4" fill="#1e3a5f"/>
          <rect x="46" y="16" width="3"  height="3" fill="white" opacity="0.7"/>
        </g>
        <rect x="38" y="26" width="4"  height="3"  fill="#f9a8d4"/>
        <rect x="2"  y="26" width="14" height="2"  fill="#d1d5db" opacity="0.5"/>
        <rect x="64" y="26" width="14" height="2"  fill="#d1d5db" opacity="0.5"/>
        <rect x="14" y="36" width="52" height="32" fill="#1e3a5f"/>
        <rect x="32" y="38" width="16" height="28" fill="#e5e7eb"/>
        <rect x="37" y="40" width="6"  height="24" fill="#3b82f6"/>
        <rect x="35" y="62" width="10" height="4"  fill="#3b82f6"/>
        <rect x="4"  y="38" width="12" height="20" fill="#9ca3af"/>
        <rect x="2"  y="56" width="14" height="6"  fill="#9ca3af"/>
        <g style={{animation:"bcArm 1.8s ease-in-out infinite"}}>
          <rect x="64" y="36" width="12" height="20" fill="#9ca3af"/>
          <rect x="64" y="54" width="14" height="6"  fill="#9ca3af"/>
          <g style={{animation:"bcCoin 1.8s ease-in-out infinite"}}>
            <rect x="65" y="42" width="12" height="12" rx="6" fill="#fbbf24"/>
            <rect x="67" y="44" width="8"  height="8"  rx="4" fill="#f59e0b"/>
            <rect x="70" y="46" width="2"  height="4"  fill="#fde68a"/>
          </g>
        </g>
        <rect x="22" y="68" width="14" height="12" fill="#1e3a5f"/>
        <rect x="44" y="68" width="14" height="12" fill="#1e3a5f"/>
        <rect x="18" y="74" width="18" height="6"  fill="#1f2937"/>
        <rect x="44" y="74" width="18" height="6"  fill="#1f2937"/>
      </svg>
    </>
  );
}

/* ── Stock Cat (RWA — amber) ────────────────────────────────────────── */
export function StockCat() {
  return (
    <>
      <style>{`
        @keyframes scTail  { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(12deg)} }
        @keyframes scBar1  { 0%,5%{opacity:0}  20%,80%{opacity:1} 95%,100%{opacity:0} }
        @keyframes scBar2  { 0%,20%{opacity:0} 35%,80%{opacity:1} 95%,100%{opacity:0} }
        @keyframes scBar3  { 0%,35%{opacity:0} 50%,80%{opacity:1} 95%,100%{opacity:0} }
        @keyframes scBar4  { 0%,50%{opacity:0} 65%,80%{opacity:1} 95%,100%{opacity:0} }
        @keyframes scBlink { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.1)} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <g style={{animation:"scTail 1.4s ease-in-out infinite",transformOrigin:"6px 62px"}}>
          <rect x="2"  y="52" width="8"  height="26" fill="#9ca3af"/>
        </g>
        <rect x="24" y="2"  width="8"  height="10" fill="#9ca3af"/>
        <rect x="26" y="4"  width="4"  height="6"  fill="#f9a8d4"/>
        <rect x="48" y="2"  width="8"  height="10" fill="#9ca3af"/>
        <rect x="50" y="4"  width="4"  height="6"  fill="#f9a8d4"/>
        <rect x="20" y="10" width="40" height="24" fill="#9ca3af"/>
        <g style={{animation:"scBlink 3.2s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="26" y="15" width="9"  height="7"  fill="#f59e0b"/>
          <rect x="28" y="17" width="4"  height="3"  fill="#78350f"/>
          <rect x="26" y="15" width="3"  height="3"  fill="white" opacity="0.6"/>
        </g>
        <g style={{animation:"scBlink 3.2s ease-in-out infinite 0.12s",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="45" y="15" width="9"  height="7"  fill="#f59e0b"/>
          <rect x="47" y="17" width="4"  height="3"  fill="#78350f"/>
          <rect x="45" y="15" width="3"  height="3"  fill="white" opacity="0.6"/>
        </g>
        <rect x="38" y="24" width="4"  height="3"  fill="#f9a8d4"/>
        <rect x="8"  y="23" width="10" height="2"  fill="#d1d5db" opacity="0.5"/>
        <rect x="62" y="23" width="10" height="2"  fill="#d1d5db" opacity="0.5"/>
        <rect x="16" y="34" width="48" height="30" fill="#78350f"/>
        <rect x="30" y="36" width="20" height="26" fill="#e5e7eb"/>
        <rect x="18" y="37" width="6"  height="5"  fill="#fde68a"/>
        <rect x="4"  y="36" width="14" height="18" fill="#9ca3af"/>
        <rect x="2"  y="52" width="16" height="6"  fill="#9ca3af"/>
        <rect x="62" y="34" width="14" height="20" fill="#9ca3af"/>
        <rect x="50" y="4"  width="24" height="32" fill="#1e293b"/>
        <rect x="52" y="6"  width="20" height="28" fill="#0f172a"/>
        <rect x="52" y="12" width="20" height="1"  fill="#334155" opacity="0.6"/>
        <rect x="52" y="18" width="20" height="1"  fill="#334155" opacity="0.5"/>
        <rect x="52" y="24" width="20" height="1"  fill="#334155" opacity="0.4"/>
        <rect x="53" y="22" width="4"  height="10" fill="#f59e0b" opacity="0" style={{animation:"scBar1 3s ease-in-out infinite"}}/>
        <rect x="58" y="18" width="4"  height="14" fill="#f59e0b" opacity="0" style={{animation:"scBar2 3s ease-in-out infinite"}}/>
        <rect x="63" y="14" width="4"  height="18" fill="#fbbf24" opacity="0" style={{animation:"scBar3 3s ease-in-out infinite"}}/>
        <rect x="68" y="9"  width="4"  height="23" fill="#fde68a" opacity="0" style={{animation:"scBar4 3s ease-in-out infinite"}}/>
        <rect x="61" y="36" width="4"  height="32" fill="#374151"/>
        <rect x="24" y="64" width="12" height="14" fill="#78350f"/>
        <rect x="44" y="64" width="12" height="14" fill="#78350f"/>
        <rect x="20" y="72" width="16" height="6"  fill="#1f2937"/>
        <rect x="44" y="72" width="16" height="6"  fill="#1f2937"/>
      </svg>
    </>
  );
}

/* ── Robot Cat (AI Agent — violet) ─────────────────────────────────── */
export function RobotCat() {
  return (
    <>
      <style>{`
        @keyframes rcAnt     { 0%,100%{transform:rotate(-14deg)} 50%{transform:rotate(14deg)} }
        @keyframes rcLED     { 0%,75%,100%{opacity:1} 80%{opacity:0.1} 85%{opacity:1} 90%{opacity:0.2} 95%{opacity:1} }
        @keyframes rcScan    { 0%{transform:translateY(0);opacity:0.9} 100%{transform:translateY(8px);opacity:0} }
        @keyframes rcBlink   { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.1)} }
        @keyframes rcCircuit { 0%,100%{opacity:0.4} 50%{opacity:0.85} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <g style={{animation:"rcAnt 0.9s ease-in-out infinite",transformOrigin:"40px 8px"}}>
          <rect x="38" y="0"  width="4"  height="10" fill="#94a3b8"/>
          <rect x="36" y="0"  width="8"  height="3"  fill="#8b5cf6"/>
        </g>
        <rect x="20" y="10" width="8"  height="10" fill="#6b7280"/>
        <rect x="22" y="12" width="4"  height="6"  fill="#f9a8d4"/>
        <rect x="52" y="10" width="8"  height="10" fill="#94a3b8"/>
        <rect x="53" y="11" width="6"  height="6"  fill="#475569"/>
        <rect x="55" y="12" width="2"  height="3"  fill="#8b5cf6" style={{animation:"rcLED 2.2s ease-in-out infinite"}}/>
        <rect x="18" y="18" width="22" height="22" fill="#6b7280"/>
        <rect x="40" y="18" width="22" height="22" fill="#94a3b8"/>
        <rect x="39" y="18" width="2"  height="22" fill="#475569"/>
        <g style={{animation:"rcBlink 4s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="22" y="22" width="12" height="8" fill="#10b981"/>
          <rect x="25" y="24" width="5"  height="4" fill="#052e16"/>
          <rect x="22" y="22" width="3"  height="3" fill="white" opacity="0.7"/>
        </g>
        <rect x="46" y="22" width="12" height="8" fill="#1e1b4b"/>
        <rect x="47" y="23" width="10" height="6" fill="#8b5cf6" style={{animation:"rcLED 1.8s steps(1) infinite"}}/>
        <rect x="47" y="25" width="10" height="2" fill="#c4b5fd" opacity="0.8" style={{animation:"rcScan 1.1s linear infinite"}}/>
        <rect x="30" y="31" width="4"  height="3"  fill="#f9a8d4"/>
        <rect x="22" y="35" width="8"  height="2"  fill="#4b5563"/>
        <rect x="40" y="34" width="16" height="4"  fill="#475569"/>
        <rect x="42" y="35" width="3"  height="2"  fill="#8b5cf6" opacity="0.6"/>
        <rect x="47" y="35" width="3"  height="2"  fill="#8b5cf6" opacity="0.6"/>
        <rect x="52" y="35" width="2"  height="2"  fill="#8b5cf6" opacity="0.6"/>
        <rect x="0"  y="29" width="18" height="2"  fill="#9ca3af" opacity="0.4"/>
        <rect x="14" y="40" width="22" height="28" fill="#6b7280"/>
        <rect x="36" y="40" width="30" height="28" fill="#94a3b8"/>
        <rect x="35" y="40" width="2"  height="28" fill="#475569"/>
        <rect x="40" y="44" width="10" height="2"  fill="#8b5cf6" style={{animation:"rcCircuit 2s ease-in-out infinite"}}/>
        <rect x="50" y="44" width="2"  height="8"  fill="#8b5cf6" style={{animation:"rcCircuit 2s ease-in-out infinite 0.4s"}}/>
        <rect x="40" y="52" width="8"  height="2"  fill="#8b5cf6" style={{animation:"rcCircuit 2s ease-in-out infinite 0.8s"}}/>
        <rect x="60" y="46" width="2"  height="8"  fill="#8b5cf6" style={{animation:"rcCircuit 2s ease-in-out infinite 0.2s"}}/>
        <rect x="4"  y="42" width="12" height="18" fill="#6b7280"/>
        <rect x="2"  y="58" width="14" height="6"  fill="#9ca3af"/>
        <rect x="64" y="42" width="12" height="18" fill="#94a3b8"/>
        <rect x="64" y="58" width="4"  height="10" fill="#64748b"/>
        <rect x="69" y="58" width="4"  height="12" fill="#64748b"/>
        <rect x="74" y="60" width="4"  height="8"  fill="#64748b"/>
        <rect x="20" y="68" width="12" height="12" fill="#6b7280"/>
        <rect x="44" y="68" width="20" height="12" fill="#94a3b8"/>
      </svg>
    </>
  );
}

/* ── Ninja Cat (Security — red) ────────────────────────────────────── */
export function NinjaCat() {
  return (
    <>
      <style>{`
        @keyframes ncSway     { 0%,100%{transform:rotate(0deg)} 30%{transform:rotate(-3deg)} 70%{transform:rotate(3deg)} }
        @keyframes ncShuriken { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes ncEyes     { 0%,100%{filter:drop-shadow(0 0 2px #ef4444)} 50%{filter:drop-shadow(0 0 6px #ef4444)} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <g style={{animation:"ncShuriken 1s linear infinite",transformOrigin:"12px 48px"}}>
          <rect x="8"  y="44" width="8"  height="8"  fill="#ef4444"/>
          <rect x="6"  y="46" width="12" height="4"  fill="#dc2626"/>
          <rect x="10" y="42" width="4"  height="12" fill="#dc2626"/>
          <rect x="7"  y="45" width="5"  height="5"  fill="#f87171" opacity="0.5"/>
        </g>
        <g style={{animation:"ncSway 2.2s ease-in-out infinite",transformOrigin:"40px 50px"}}>
          <rect x="24" y="4"  width="8"  height="10" fill="#1f2937"/>
          <rect x="48" y="4"  width="8"  height="10" fill="#1f2937"/>
          <rect x="18" y="10" width="44" height="30" fill="#111827"/>
          <rect x="16" y="18" width="48" height="6"  fill="#991b1b"/>
          <rect x="36" y="14" width="8"  height="10" fill="#b91c1c"/>
          <rect x="38" y="12" width="4"  height="4"  fill="#b91c1c"/>
          <g style={{animation:"ncEyes 1.6s ease-in-out infinite"}}>
            <rect x="24" y="20" width="12" height="7" fill="#ef4444"/>
            <rect x="27" y="22" width="5"  height="3" fill="#7f1d1d"/>
            <rect x="24" y="20" width="3"  height="3" fill="#fca5a5" opacity="0.5"/>
          </g>
          <g style={{animation:"ncEyes 1.6s ease-in-out infinite 0.2s"}}>
            <rect x="44" y="20" width="12" height="7" fill="#ef4444"/>
            <rect x="47" y="22" width="5"  height="3" fill="#7f1d1d"/>
            <rect x="44" y="20" width="3"  height="3" fill="#fca5a5" opacity="0.5"/>
          </g>
          <rect x="18" y="27" width="44" height="12" fill="#111827"/>
          <rect x="16" y="40" width="48" height="28" fill="#1f2937"/>
          <rect x="24" y="42" width="32" height="2"  fill="#374151"/>
          <rect x="20" y="44" width="4"  height="18" fill="#374151" opacity="0.4"/>
          <rect x="56" y="44" width="4"  height="18" fill="#374151" opacity="0.4"/>
          <rect x="16" y="56" width="48" height="4"  fill="#ef4444"/>
          <rect x="4"  y="40" width="14" height="18" fill="#1f2937"/>
          <rect x="2"  y="56" width="16" height="6"  fill="#374151"/>
          <rect x="62" y="34" width="14" height="22" fill="#1f2937"/>
          <rect x="62" y="32" width="16" height="6"  fill="#374151"/>
          <rect x="22" y="68" width="14" height="12" fill="#1f2937"/>
          <rect x="44" y="68" width="14" height="12" fill="#1f2937"/>
          <rect x="18" y="74" width="18" height="6"  fill="#111827"/>
          <rect x="44" y="74" width="18" height="6"  fill="#111827"/>
        </g>
      </svg>
    </>
  );
}

/* ── Shadow Cat (Privacy — indigo) ─────────────────────────────────── */
export function ShadowCat() {
  return (
    <>
      <style>{`
        @keyframes shcFade { 0%,100%{opacity:0.9} 50%{opacity:0.5} }
        @keyframes shcEyes { 0%,100%{filter:drop-shadow(0 0 3px #6366f1)} 50%{filter:drop-shadow(0 0 8px #6366f1)} }
        @keyframes shcR1   { 0%{transform:translateY(0);opacity:0.8} 100%{transform:translateY(-20px);opacity:0} }
        @keyframes shcR2   { 0%{transform:translateY(0);opacity:0.6} 100%{transform:translateY(-16px);opacity:0} }
        @keyframes shcR3   { 0%{transform:translateY(0);opacity:0.7} 100%{transform:translateY(-24px);opacity:0} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <rect x="4"  y="42" width="6"  height="6"  fill="#6366f1" style={{animation:"shcR1 2.3s linear infinite"}}/>
        <rect x="10" y="50" width="4"  height="4"  fill="#6366f1" opacity="0.7" style={{animation:"shcR1 2.3s linear infinite 0.5s"}}/>
        <rect x="68" y="40" width="6"  height="6"  fill="#6366f1" style={{animation:"shcR2 2s linear infinite 0.7s"}}/>
        <rect x="72" y="52" width="4"  height="4"  fill="#6366f1" opacity="0.6" style={{animation:"shcR2 2s linear infinite"}}/>
        <rect x="14" y="60" width="6"  height="4"  fill="#6366f1" opacity="0.5" style={{animation:"shcR3 2.6s linear infinite 1s"}}/>
        <rect x="62" y="62" width="6"  height="4"  fill="#6366f1" opacity="0.5" style={{animation:"shcR3 2.6s linear infinite 0.3s"}}/>
        <g style={{animation:"shcFade 3s ease-in-out infinite"}}>
          <rect x="30" y="0"  width="20" height="4"  fill="#312e81"/>
          <rect x="24" y="4"  width="32" height="4"  fill="#312e81"/>
          <rect x="18" y="8"  width="44" height="6"  fill="#312e81"/>
          <rect x="14" y="14" width="52" height="22" fill="#312e81"/>
          <rect x="18" y="16" width="44" height="18" fill="#1e1b4b"/>
          <g style={{animation:"shcEyes 1.8s ease-in-out infinite"}}>
            <rect x="24" y="20" width="12" height="8" fill="#6366f1"/>
            <rect x="27" y="22" width="5"  height="4" fill="#1e1b4b"/>
            <rect x="24" y="20" width="3"  height="3" fill="#a5b4fc" opacity="0.7"/>
          </g>
          <g style={{animation:"shcEyes 1.8s ease-in-out infinite 0.18s"}}>
            <rect x="44" y="20" width="12" height="8" fill="#6366f1"/>
            <rect x="47" y="22" width="5"  height="4" fill="#1e1b4b"/>
            <rect x="44" y="20" width="3"  height="3" fill="#a5b4fc" opacity="0.7"/>
          </g>
          <rect x="8"  y="36" width="64" height="36" fill="#312e81"/>
          <rect x="26" y="36" width="28" height="36" fill="#1e1b4b" opacity="0.5"/>
          <rect x="14" y="38" width="4"  height="30" fill="#1e1b4b" opacity="0.3"/>
          <rect x="62" y="38" width="4"  height="30" fill="#1e1b4b" opacity="0.3"/>
          <rect x="32" y="48" width="16" height="2"  fill="#6366f1" opacity="0.7"/>
          <rect x="34" y="50" width="12" height="2"  fill="#6366f1" opacity="0.5"/>
          <rect x="32" y="52" width="16" height="2"  fill="#6366f1" opacity="0.7"/>
          <rect x="36" y="50" width="6"  height="2"  fill="#6366f1" opacity="0.9"/>
          <rect x="8"  y="72" width="64" height="8"  fill="#1e1b4b" opacity="0.6"/>
          <rect x="12" y="74" width="14" height="6"  fill="#312e81"/>
          <rect x="34" y="74" width="12" height="6"  fill="#312e81"/>
          <rect x="54" y="74" width="14" height="6"  fill="#312e81"/>
        </g>
      </svg>
    </>
  );
}

/* ── Builder Cat (AutoGit — orange) ────────────────────────────────── */
export function BuilderCat() {
  return (
    <>
      <style>{`
        @keyframes bldType  { 0%,100%{opacity:1} 45%,55%{opacity:0} }
        @keyframes bldGlow  { 0%,100%{opacity:0.65} 50%{opacity:1} }
        @keyframes bldBlink { 0%,88%,100%{transform:scaleY(1)} 93%{transform:scaleY(0.1)} }
        @keyframes bldSpark { 0%,80%,100%{opacity:0;transform:scale(0.6)} 40%{opacity:1;transform:scale(1)} }
        @keyframes bldHelm  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-1px)} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <g style={{animation:"bldHelm 1.8s ease-in-out infinite"}}>
          <rect x="28" y="2"  width="24" height="4"  fill="#f97316"/>
          <rect x="22" y="6"  width="36" height="6"  fill="#fb923c"/>
          <rect x="14" y="12" width="52" height="4"  fill="#f97316"/>
          <rect x="16" y="16" width="48" height="2"  fill="#fed7aa" opacity="0.4"/>
        </g>
        <rect x="20" y="12" width="8"  height="8"  fill="#ea580c"/>
        <rect x="52" y="12" width="8"  height="8"  fill="#ea580c"/>
        <rect x="22" y="14" width="4"  height="4"  fill="#fdba74"/>
        <rect x="54" y="14" width="4"  height="4"  fill="#fdba74"/>
        <rect x="18" y="16" width="44" height="22" fill="#fde8d0"/>
        <g style={{animation:"bldBlink 3.2s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="24" y="22" width="10" height="7"  fill="#1c1917"/>
          <rect x="26" y="23" width="6"  height="4"  fill="#f97316" style={{animation:"bldGlow 1.4s ease-in-out infinite"}}/>
          <rect x="24" y="22" width="3"  height="2"  fill="white" opacity="0.6"/>
        </g>
        <g style={{animation:"bldBlink 3.2s ease-in-out infinite 0.12s",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="46" y="22" width="10" height="7"  fill="#1c1917"/>
          <rect x="48" y="23" width="6"  height="4"  fill="#f97316" style={{animation:"bldGlow 1.4s ease-in-out infinite 0.3s"}}/>
          <rect x="46" y="22" width="3"  height="2"  fill="white" opacity="0.6"/>
        </g>
        <rect x="37" y="30" width="6"  height="3"  fill="#c2410c" opacity="0.5"/>
        <rect x="33" y="33" width="4"  height="2"  fill="#c2410c" opacity="0.4"/>
        <rect x="43" y="33" width="4"  height="2"  fill="#c2410c" opacity="0.4"/>
        <rect x="16" y="38" width="48" height="30" fill="#ea580c"/>
        <rect x="20" y="40" width="40" height="26" fill="#f97316"/>
        <rect x="24" y="42" width="32" height="18" fill="#1c1917"/>
        <rect x="26" y="44" width="28" height="14" fill="#0f172a"/>
        <rect x="28" y="46" width="12" height="2"  fill="#fb923c" style={{animation:"bldGlow 1.2s ease-in-out infinite"}}/>
        <rect x="28" y="50" width="18" height="2"  fill="#fbbf24" style={{animation:"bldGlow 1.2s ease-in-out infinite 0.25s"}}/>
        <rect x="28" y="54" width="10" height="2"  fill="#fb923c" style={{animation:"bldGlow 1.2s ease-in-out infinite 0.5s"}}/>
        <rect x="38" y="54" width="2"  height="2"  fill="#fef3c7" style={{animation:"bldType 0.8s step-end infinite"}}/>
        <rect x="20" y="60" width="40" height="4"  fill="#292524"/>
        <rect x="4"  y="40" width="14" height="16" fill="#ea580c"/>
        <rect x="2"  y="54" width="16" height="6"  fill="#f97316"/>
        <rect x="62" y="40" width="14" height="16" fill="#ea580c"/>
        <rect x="62" y="54" width="16" height="6"  fill="#f97316"/>
        <rect x="22" y="68" width="12" height="12" fill="#ea580c"/>
        <rect x="46" y="68" width="12" height="12" fill="#ea580c"/>
        <rect x="18" y="74" width="16" height="6"  fill="#c2410c"/>
        <rect x="46" y="74" width="16" height="6"  fill="#c2410c"/>
        <g style={{animation:"bldSpark 2s ease-in-out infinite",transformOrigin:"71px 11px"}}>
          <rect x="67" y="7"  width="8"  height="8"  fill="#fbbf24"/>
          <rect x="69" y="5"  width="4"  height="12" fill="#fbbf24" opacity="0.5"/>
          <rect x="63" y="9"  width="12" height="4"  fill="#fbbf24" opacity="0.5"/>
          <rect x="67" y="7"  width="4"  height="4"  fill="#fef9c3" opacity="0.8"/>
        </g>
      </svg>
    </>
  );
}

/* ── Merchant Cat (Commerce — emerald) ─────────────────────────────── */
export function MerchantCat() {
  return (
    <>
      <style>{`
        @keyframes mctCoin   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes mctGlow   { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes mctBlink  { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.1)} }
        @keyframes mctSpin   { 0%{transform:scaleX(1)} 40%{transform:scaleX(0.1)} 50%{transform:scaleX(-1)} 90%{transform:scaleX(-0.1)} 100%{transform:scaleX(1)} }
      `}</style>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{imageRendering:"pixelated",display:"block"}}>
        <rect x="30" y="0"  width="20" height="6"  fill="#14532d"/>
        <rect x="26" y="6"  width="28" height="6"  fill="#166534"/>
        <rect x="14" y="12" width="52" height="4"  fill="#15803d"/>
        <rect x="16" y="16" width="48" height="2"  fill="#86efac" opacity="0.3"/>
        <rect x="20" y="10" width="8"  height="8"  fill="#10b981"/>
        <rect x="52" y="10" width="8"  height="8"  fill="#10b981"/>
        <rect x="22" y="12" width="4"  height="4"  fill="#6ee7b7"/>
        <rect x="54" y="12" width="4"  height="4"  fill="#6ee7b7"/>
        <rect x="18" y="16" width="44" height="22" fill="#fde8d0"/>
        <g style={{animation:"mctBlink 3.8s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="24" y="22" width="10" height="7"  fill="#1c1917"/>
          <rect x="26" y="23" width="6"  height="4"  fill="#10b981" style={{animation:"mctGlow 2s ease-in-out infinite"}}/>
          <rect x="24" y="22" width="3"  height="2"  fill="white" opacity="0.7"/>
        </g>
        <g style={{animation:"mctBlink 3.8s ease-in-out infinite 0.2s",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
          <rect x="46" y="22" width="10" height="7"  fill="#1c1917"/>
          <rect x="48" y="23" width="6"  height="4"  fill="#10b981" style={{animation:"mctGlow 2s ease-in-out infinite 0.4s"}}/>
          <rect x="46" y="22" width="3"  height="2"  fill="white" opacity="0.7"/>
        </g>
        <rect x="34" y="30" width="12" height="3"  fill="#10b981" opacity="0.7"/>
        <rect x="30" y="32" width="4"  height="2"  fill="#10b981" opacity="0.5"/>
        <rect x="46" y="32" width="4"  height="2"  fill="#10b981" opacity="0.5"/>
        <rect x="16" y="38" width="48" height="30" fill="#064e3b"/>
        <rect x="20" y="40" width="40" height="26" fill="#065f46"/>
        <rect x="22" y="44" width="20" height="12" fill="#1d4ed8"/>
        <rect x="24" y="46" width="16" height="8"  fill="#2563eb"/>
        <rect x="24" y="48" width="16" height="2"  fill="#93c5fd" opacity="0.6"/>
        <rect x="24" y="52" width="8"  height="2"  fill="#bfdbfe" opacity="0.7"/>
        <rect x="24" y="46" width="6"  height="4"  fill="#fbbf24" opacity="0.9"/>
        <rect x="46" y="44" width="10" height="10" fill="#fde047"/>
        <rect x="48" y="46" width="6"  height="6"  fill="#f59e0b"/>
        <rect x="50" y="46" width="2"  height="1"  fill="#1d4ed8"/>
        <rect x="51" y="47" width="1"  height="4"  fill="#1d4ed8"/>
        <rect x="50" y="51" width="2"  height="1"  fill="#1d4ed8"/>
        <g style={{animation:"mctCoin 1.2s ease-in-out infinite"}}>
          <rect x="4"  y="30" width="10" height="10" fill="#fde047"/>
          <rect x="6"  y="32" width="6"  height="6"  fill="#f59e0b"/>
          <g style={{animation:"mctSpin 1.6s ease-in-out infinite",transformBox:"fill-box",transformOrigin:"50% 50%"}}>
            <rect x="8"  y="34" width="2"  height="4"  fill="#fef3c7" opacity="0.8"/>
          </g>
          <rect x="4"  y="30" width="4"  height="4"  fill="#fef9c3" opacity="0.5"/>
        </g>
        <rect x="4"  y="40" width="14" height="16" fill="#065f46"/>
        <rect x="2"  y="54" width="16" height="6"  fill="#064e3b"/>
        <rect x="62" y="40" width="14" height="16" fill="#065f46"/>
        <rect x="62" y="54" width="16" height="6"  fill="#064e3b"/>
        <rect x="22" y="68" width="12" height="12" fill="#064e3b"/>
        <rect x="46" y="68" width="12" height="12" fill="#064e3b"/>
        <rect x="18" y="74" width="16" height="6"  fill="#052e16"/>
        <rect x="46" y="74" width="16" height="6"  fill="#052e16"/>
      </svg>
    </>
  );
}
