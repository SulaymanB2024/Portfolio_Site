import { useState, useMemo } from 'react';
import { motion } from 'motion/react';

// ==========================================
// 1. Network Monopolies Visual (Metcalfe + Debasement)
// ==========================================
export function NetworkMonopoliesVisual() {
  const [nodes, setNodes] = useState(6);
  const [debasement, setDebasement] = useState(0.08); // 8%

  // Calculate connection points on a circle
  const points = useMemo(() => {
    const pts = [];
    const r = 50; // radius
    const cx = 80; // center x
    const cy = 80; // center y
    for (let i = 0; i < nodes; i++) {
      const angle = (i * 2 * Math.PI) / nodes - Math.PI / 2;
      pts.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      });
    }
    return pts;
  }, [nodes]);

  // Generate connection line paths
  const lines = useMemo(() => {
    const lns = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        lns.push({ p1: points[i], p2: points[j] });
      }
    }
    return lns;
  }, [points]);

  const metcalfeVal = nodes * Math.log2(nodes);
  const adjustedVal = metcalfeVal * (1 + debasement);
  const connections = (nodes * (nodes - 1)) / 2;

  return (
    <div className="w-full border border-[#f1efe8]/8 bg-[#f1efe8]/[0.015] p-5 font-mono text-[10px] uppercase text-[#f1efe8]/70 relative overflow-hidden group">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#f1efe8]/10" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#f1efe8]/10" />

      <div className="text-[8.5px] uppercase tracking-[0.24em] text-[#f1efe8] mb-4 font-semibold text-center">// METCALFE NETWORK MULTIPLIER SIMULATOR //</div>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 items-center">
        {/* Left Side: SVG Graph */}
        <div className="flex justify-center items-center bg-[#080807]/50 border border-[#f1efe8]/8 p-4 relative h-48">
          <svg viewBox="0 0 160 160" className="h-full aspect-square text-[#f1efe8]">
            <rect x="0" y="0" width="160" height="160" fill="none" stroke="currentColor" opacity="0.04" />
            
            {/* Draw connection lines */}
            {lines.map((line, idx) => (
              <motion.line
                key={`line-${idx}`}
                x1={line.p1.x}
                y1={line.p1.y}
                x2={line.p2.x}
                y2={line.p2.y}
                stroke="currentColor"
                strokeWidth="0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.12 }}
                transition={{ duration: 0.3 }}
              />
            ))}

            {/* Draw nodes */}
            {points.map((pt, idx) => (
              <g key={`node-${idx}`}>
                <motion.circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#080807"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: idx * 0.02 }}
                />
                <circle cx={pt.x} cy={pt.y} r="1.5" fill="currentColor" opacity="0.6" />
              </g>
            ))}
          </svg>
          <div className="absolute bottom-2 right-2 text-[8px] opacity-40">GRID_MULTIPLIER_ACTIVE</div>
        </div>

        {/* Right Side: Controls and Telemetry */}
        <div className="space-y-4">
          {/* Controls */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#f1efe8]/50">Network Nodes (N)</span>
                <span className="text-white font-semibold">{nodes}</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="1"
                value={nodes}
                onChange={(e) => setNodes(Number(e.target.value))}
                className="w-full accent-[#f1efe8] bg-[#f1efe8]/10 h-[2px] rounded appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#f1efe8]/50">Fiat Debasement (R)</span>
                <span className="text-white font-semibold">{(debasement * 100).toFixed(0)}% / YR</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.2"
                step="0.01"
                value={debasement}
                onChange={(e) => setDebasement(Number(e.target.value))}
                className="w-full accent-[#f1efe8] bg-[#f1efe8]/10 h-[2px] rounded appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Telemetry Output */}
          <div className="border-t border-[#f1efe8]/10 pt-3 space-y-2 text-[9px]">
            <div className="flex justify-between border-b border-[#f1efe8]/6 pb-1">
              <span className="opacity-50">Total Connections</span>
              <span className="text-[#f1efe8]">{connections}</span>
            </div>
            <div className="flex justify-between border-b border-[#f1efe8]/6 pb-1">
              <span className="opacity-50">Metcalfe Value (N*log(N))</span>
              <span className="text-white">{metcalfeVal.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between border-b border-[#f1efe8]/6 pb-1">
              <span className="opacity-50">Dilution Multiplier</span>
              <span className="text-white">{(1 + debasement).toFixed(2)}x</span>
            </div>
            <div className="flex justify-between font-bold text-[10px] text-white">
              <span>Adjusted Capital Sink Value</span>
              <span className="text-[#f1efe8]">{adjustedVal.toFixed(2)}x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. Computational Commodity Visual (DePIN Auction Grid)
// ==========================================
type WorkloadType = 'ZKP' | 'ML' | 'RENDER';

interface NodeStatus {
  id: string;
  type: string;
  hashrate: string;
  utilization: number;
  status: 'ACTIVE' | 'PROVING' | 'IDLE';
}

export function ComputationalCommodityVisual() {
  const [workload, setWorkload] = useState<WorkloadType>('ZKP');
  const [demandCoeff, setDemandCoeff] = useState(1.25); // 1.25x baseline demand

  const workloadConfigs: Record<WorkloadType, { label: string; baseCapacity: number; nodes: NodeStatus[] }> = {
    ZKP: {
      label: 'Zero-Knowledge Proving',
      baseCapacity: 140, // MH/s
      nodes: [
        { id: 'NODE-01', type: 'ZK-ASIC Rig A', hashrate: '45 MH/s', utilization: 92, status: 'PROVING' },
        { id: 'NODE-02', type: 'ZK-ASIC Rig B', hashrate: '45 MH/s', utilization: 88, status: 'PROVING' },
        { id: 'NODE-03', type: 'ZK-ASIC Rig C', hashrate: '50 MH/s', utilization: 12, status: 'IDLE' },
      ],
    },
    ML: {
      label: 'LLM Model Fine-Tuning',
      baseCapacity: 96, // vRAM cluster
      nodes: [
        { id: 'NODE-01', type: 'H100 Node A', hashrate: '80GB H100', utilization: 98, status: 'ACTIVE' },
        { id: 'NODE-02', type: 'H100 Node B', hashrate: '80GB H100', utilization: 95, status: 'ACTIVE' },
        { id: 'NODE-03', type: 'L4 cluster C', hashrate: '24GB L4 x4', utilization: 72, status: 'ACTIVE' },
      ],
    },
    RENDER: {
      label: 'Distributed Path Tracing',
      baseCapacity: 240, // Frame units
      nodes: [
        { id: 'NODE-01', type: 'RTX 4090 Host', hashrate: '120 frames/s', utilization: 84, status: 'ACTIVE' },
        { id: 'NODE-02', type: 'RTX 4090 Host', hashrate: '120 frames/s', utilization: 80, status: 'ACTIVE' },
        { id: 'NODE-03', type: 'RTX 3090 Host', hashrate: '80 frames/s', utilization: 5, status: 'IDLE' },
      ],
    },
  };

  const config = workloadConfigs[workload];
  
  // Calculate average utilization
  const avgUtilization = useMemo(() => {
    return Math.round(config.nodes.reduce((acc, curr) => acc + curr.utilization, 0) / config.nodes.length);
  }, [config]);

  // Pricing equilibrium: P_compute = (demand / capacity) * incentive
  const pricing = useMemo(() => {
    const supplyFactor = (config.baseCapacity * (avgUtilization / 100)) / 100;
    const computedPrice = (demandCoeff / (supplyFactor + 0.1)) * 1.5;
    return Math.max(0.12, computedPrice);
  }, [config, avgUtilization, demandCoeff]);

  return (
    <div className="w-full border border-[#f1efe8]/8 bg-[#f1efe8]/[0.015] p-5 font-mono text-[10px] uppercase text-[#f1efe8]/70 relative overflow-hidden group">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#f1efe8]/10" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#f1efe8]/10" />

      <div className="text-[8.5px] uppercase tracking-[0.24em] text-[#c2695e]/90 mb-4 font-semibold text-center">// DEPIN COMPUTE AUCTION COORDINATOR //</div>

      {/* Workload Select Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-4 border-b border-[#f1efe8]/10 pb-3">
        {(['ZKP', 'ML', 'RENDER'] as WorkloadType[]).map((type) => (
          <button
            key={type}
            onClick={() => setWorkload(type)}
            className={`border px-2 py-1.5 text-[8.5px] tracking-wider transition-colors cursor-pointer text-center ${
              workload === type
                ? 'border-[#c2695e] text-[#c2695e] bg-[#c2695e]/5 font-bold'
                : 'border-[#f1efe8]/12 text-[#f1efe8]/50 hover:text-[#f1efe8]/80 hover:border-[#f1efe8]/30'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Node status lanes */}
        <div className="space-y-2">
          <div className="text-[8px] text-[#f1efe8]/40 mb-1">Node Infrastructure Status ({config.label})</div>
          {config.nodes.map((node) => (
            <div key={node.id} className="border border-[#f1efe8]/8 bg-[#080807]/30 p-2.5 space-y-1.5">
              <div className="flex justify-between items-center text-[8.5px]">
                <span className="font-bold text-white">{node.id}</span>
                <span className={`px-1.5 py-0.5 border text-[7.5px] leading-none ${node.status === 'IDLE' ? 'text-[#f1efe8]/40 border-[#f1efe8]/15' : 'text-[#c2695e] border-[#c2695e]/30 bg-[#c2695e]/5'}`}>
                  {node.status}
                </span>
              </div>
              <div className="flex justify-between text-[#f1efe8]/60 text-[8px]">
                <span>{node.type}</span>
                <span>{node.hashrate}</span>
              </div>
              <div className="w-full bg-[#f1efe8]/8 h-1 relative">
                <motion.div
                  className="bg-[#c2695e] h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${node.utilization}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between text-[7.5px] text-[#f1efe8]/40">
                <span>UTILIZATION</span>
                <span>{node.utilization}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing telemetry */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#f1efe8]/50">Simulation Demand Coefficient</span>
                <span className="text-white font-semibold">{demandCoeff.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={demandCoeff}
                onChange={(e) => setDemandCoeff(Number(e.target.value))}
                className="w-full accent-[#c2695e] bg-[#f1efe8]/10 h-[2px] rounded appearance-none cursor-pointer"
              />
            </div>

            <div className="border-t border-[#f1efe8]/10 pt-3 space-y-2 text-[9px]">
              <div className="flex justify-between border-b border-[#f1efe8]/6 pb-1">
                <span className="opacity-50">Active Supply Capacity</span>
                <span className="text-white">{config.baseCapacity} units</span>
              </div>
              <div className="flex justify-between border-b border-[#f1efe8]/6 pb-1">
                <span className="opacity-50">Avg Cluster Load</span>
                <span className="text-white">{avgUtilization}%</span>
              </div>
              <div className="flex justify-between border-b border-[#f1efe8]/6 pb-1">
                <span className="opacity-50">Resource Scarcity Index</span>
                <span className="text-white">{(100 - avgUtilization === 0 ? 100 : (demandCoeff / (100 - avgUtilization))).toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-baseline font-bold text-[10px] text-white pt-2 border-t border-[#f1efe8]/10">
                <span>Algorithmic Clearing Price</span>
                <span className="text-[#c2695e] text-xs">${pricing.toFixed(3)} <span className="text-[8px] text-[#f1efe8]/40 font-normal">/ CORE-HR</span></span>
              </div>
            </div>
          </div>
          
          <div className="text-[7.5px] text-[#f1efe8]/30 tracking-widest text-right mt-4">// TELEMETRY.AUCTION.PROV //</div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. Fiat Horizon Visual (Solvency Backing Dashboard)
// ==========================================
export function FiatHorizonVisual() {
  const [goldPrice, setGoldPrice] = useState(2400); // $2400/oz baseline
  const [btcPrice, setBtcPrice] = useState(68000); // $68,000/BTC baseline
  const [m2Growth, setM2Growth] = useState(0.08); // 8% expansion rate

  // Define static state reserves
  const reserves = {
    goldOunces: 260000000, // 260M oz (typical large reserve)
    bitcoinAmount: 1200000, // 1.2M BTC (potential future sovereign holding)
    m2Baseline: 21000000000000, // $21.0T M2
  };

  const calculatedBacking = useMemo(() => {
    const goldValue = reserves.goldOunces * goldPrice;
    const btcValue = reserves.bitcoinAmount * btcPrice;
    const m2Future = reserves.m2Baseline * (1 + m2Growth);
    const totalBacking = goldValue + btcValue;
    const ratio = totalBacking / m2Future;

    return {
      goldValue,
      btcValue,
      totalBacking,
      m2Future,
      ratio,
    };
  }, [goldPrice, btcPrice, m2Growth]);

  const goldPercent = (calculatedBacking.goldValue / calculatedBacking.m2Future) * 100;
  const btcPercent = (calculatedBacking.btcValue / calculatedBacking.m2Future) * 100;
  const unbackedPercent = 100 - (goldPercent + btcPercent);

  return (
    <div className="w-full border border-[#f1efe8]/8 bg-[#f1efe8]/[0.015] p-5 font-mono text-[10px] uppercase text-[#f1efe8]/70 relative overflow-hidden group">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#f1efe8]/10" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#f1efe8]/10" />

      <div className="text-[8.5px] uppercase tracking-[0.24em] text-[#f1efe8] mb-4 font-semibold text-center">// SOVEREIGN SOLVENCY HARD-BACKING MODEL //</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Controls Column */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#f1efe8]/50">Gold Spot Price</span>
              <span className="text-white font-semibold">${goldPrice.toLocaleString()} / OZ</span>
            </div>
            <input
              type="range"
              min="1500"
              max="4500"
              step="50"
              value={goldPrice}
              onChange={(e) => setGoldPrice(Number(e.target.value))}
              className="w-full accent-[#f1efe8] bg-[#f1efe8]/10 h-[2px] rounded appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#f1efe8]/50">Bitcoin Spot Price</span>
              <span className="text-white font-semibold">${btcPrice.toLocaleString()} / BTC</span>
            </div>
            <input
              type="range"
              min="30000"
              max="250000"
              step="1000"
              value={btcPrice}
              onChange={(e) => setBtcPrice(Number(e.target.value))}
              className="w-full accent-[#f1efe8] bg-[#f1efe8]/10 h-[2px] rounded appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[#f1efe8]/50">M2 Annual Expansion</span>
              <span className="text-white font-semibold">{(m2Growth * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.25"
              step="0.01"
              value={m2Growth}
              onChange={(e) => setM2Growth(Number(e.target.value))}
              className="w-full accent-[#f1efe8] bg-[#f1efe8]/10 h-[2px] rounded appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Backing Visual Stack and Stats */}
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="text-[8px] text-[#f1efe8]/40 mb-1">M2 Backing Composition Ratio</div>
            {/* Stack bar */}
            <div className="h-6 w-full flex border border-[#f1efe8]/12 overflow-hidden bg-[#080807]">
              <motion.div
                className="bg-[#f1efe8]/80 text-[#080807] flex items-center justify-center text-[7.5px] font-bold overflow-hidden"
                animate={{ width: `${Math.min(100, goldPercent)}%` }}
                transition={{ duration: 0.3 }}
              >
                {goldPercent > 6 && 'GOLD'}
              </motion.div>
              <motion.div
                className="bg-[#c2695e]/80 text-white flex items-center justify-center text-[7.5px] font-bold overflow-hidden"
                animate={{ width: `${Math.min(100, btcPercent)}%` }}
                transition={{ duration: 0.3 }}
              >
                {btcPercent > 6 && 'BTC'}
              </motion.div>
              <motion.div
                className="bg-white/[0.02] text-[#f1efe8]/30 flex items-center justify-end pr-2 text-[7.5px] overflow-hidden"
                animate={{ width: `${Math.max(0, unbackedPercent)}%` }}
                transition={{ duration: 0.3 }}
              >
                {unbackedPercent > 15 && 'UNBACKED FIAT'}
              </motion.div>
            </div>
          </div>

          {/* Telemetry Output */}
          <div className="border-t border-[#f1efe8]/10 pt-3 space-y-2 text-[9px]">
            <div className="flex justify-between border-b border-[#f1efe8]/6 pb-1">
              <span className="opacity-50">Gold Reserves Value</span>
              <span className="text-white">${(calculatedBacking.goldValue / 1e9).toFixed(2)}B</span>
            </div>
            <div className="flex justify-between border-b border-[#f1efe8]/6 pb-1">
              <span className="opacity-50">Bitcoin reserves Value</span>
              <span className="text-white">${(calculatedBacking.btcValue / 1e9).toFixed(2)}B</span>
            </div>
            <div className="flex justify-between border-b border-[#f1efe8]/6 pb-1">
              <span className="opacity-50">Future M2 Money Stock</span>
              <span className="text-white">${(calculatedBacking.m2Future / 1e12).toFixed(2)}T</span>
            </div>
            <div className="flex justify-between font-bold text-[10px] text-white">
              <span>Sovereign Backing Ratio</span>
              <span className="text-[#f1efe8]">{(calculatedBacking.ratio * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
