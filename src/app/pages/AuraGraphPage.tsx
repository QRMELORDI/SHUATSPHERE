import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Zap, Users, Globe, Target, Shield, Info, ArrowLeft, Maximize2, Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

interface GraphNode {
  id: string;
  name: string;
  type: 'user' | 'sphere';
  val: number;
  color: string;
  x: number;
  y: number;
  avatar?: string;
  auraScore?: number;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export function AuraGraphPage() {
  const navigate = useNavigate();
  const { currentUser, spheres, allUsers, loadAllUsers } = useApp();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Initial load of users for graph
  useMemo(() => {
    loadAllUsers();
  }, []);

  // Simplified graph data generation
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // Add spheres
    spheres.forEach((s, i) => {
      const angle = (i / spheres.length) * Math.PI * 2;
      const radius = 250;
      nodes.push({
        id: s.id,
        name: `s/${s.slug}`,
        type: 'sphere',
        val: 20 + (s.memberCount / 50),
        color: i % 2 === 0 ? '#7C3AED' : '#EC4899',
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      });
    });

    // Add users
    const displayUsers = allUsers.slice(0, 15);
    displayUsers.forEach((u, i) => {
      const angle = (i / displayUsers.length) * Math.PI * 2;
      const radius = 120;
      nodes.push({
        id: u.id,
        name: u.name,
        type: 'user',
        val: 12 + (u.auraScore / 200),
        color: '#FBBF24',
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        avatar: u.avatar,
        auraScore: u.auraScore,
      });

      // Links to spheres they might be in
      if (u.joinedSpheres && u.joinedSpheres.length > 0) {
        u.joinedSpheres.forEach(slug => {
          const sphere = spheres.find(s => s.slug === slug);
          if (sphere) {
            links.push({
              source: u.id,
              target: sphere.id,
              value: 1,
            });
          }
        });
      }
    });

    return { nodes, links };
  }, [spheres, allUsers]);

  const filteredNodes = useMemo(() => {
    if (!search) return graphData.nodes;
    return graphData.nodes.filter(n => 
      n.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [graphData.nodes, search]);

  return (
    <div className="min-h-screen bg-[#09090B] text-white overflow-hidden relative font-['Outfit',_sans-serif]">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #3F3F46 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      {/* Dynamic Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Top Navigation */}
      <div className="relative z-10 p-6 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              AURA GRAPH <span className="text-[10px] bg-violet-600 px-2 py-0.5 rounded-full">BETA</span>
            </h1>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Social Mesh Visualization</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Filter nodes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-violet-500 w-64 transition-all"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-violet-600 text-white font-black shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="relative h-[calc(100vh-88px)] w-full flex items-center justify-center">
        {/* Graph Canvas (Simplified Mock for now) */}
        <div className="relative w-full h-full flex items-center justify-center scale-[0.8] md:scale-100">
          
          {/* SVG Links Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {graphData.links.map((link, i) => {
              const source = graphData.nodes.find(n => n.id === link.source);
              const target = graphData.nodes.find(n => n.id === link.target);
              if (!source || !target) return null;
              
              const isHighlighted = hoveredNode === source.id || hoveredNode === target.id;
              
              return (
                <motion.line
                  key={`link-${i}`}
                  x1={`calc(50% + ${source.x}px)`}
                  y1={`calc(50% + ${source.y}px)`}
                  x2={`calc(50% + ${target.x}px)`}
                  y2={`calc(50% + ${target.y}px)`}
                  stroke={isHighlighted ? "#7C3AED" : "url(#lineGrad)"}
                  strokeWidth={isHighlighted ? 2 : 1}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: isHighlighted ? 0.8 : 0.3, pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.01 }}
                />
              );
            })}
          </svg>

          {/* Nodes Layer */}
          {filteredNodes.map((node) => (
            <motion.div
              key={node.id}
              className="absolute cursor-pointer z-10"
              style={{
                left: `calc(50% + ${node.x}px)`,
                top: `calc(50% + ${node.y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.15 }}
              onHoverStart={() => setHoveredNode(node.id)}
              onHoverEnd={() => setHoveredNode(null)}
              onClick={() => setSelectedNode(node)}
            >
              <div className="relative group">
                {/* Aura Ring */}
                <motion.div 
                  className="absolute inset-[-6px] rounded-full border border-white/20"
                  animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {node.type === 'user' ? (
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-zinc-900 shadow-xl relative bg-zinc-800">
                    <img src={node.avatar} alt={node.name} className="w-full h-full object-cover" />
                    {/* Activity Indicator */}
                    <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-900" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-[28px] bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-white/10 flex items-center justify-center shadow-2xl relative">
                    <span className="text-2xl">{node.name.split('/')[1][0].toUpperCase()}</span>
                    {/* Glowing Core */}
                    <div className="absolute inset-0 bg-violet-600/20 rounded-[28px] animate-pulse" />
                  </div>
                )}

                {/* Label */}
                <div className={`absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 ${hoveredNode === node.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                  <div className="bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{node.type}</p>
                    <p className="text-sm font-black text-white">{node.name}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Sidebar (Slide-in) */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute right-6 top-6 bottom-6 w-80 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] z-50 p-6 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center">
                    <Info size={16} className="text-violet-500" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-400">Node Intel</span>
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <Maximize2 size={16} className="rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                {/* Node Profile */}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-[32px] border-4 border-white/5 p-1 mb-4">
                    {selectedNode.type === 'user' ? (
                      <img src={selectedNode.avatar} className="w-full h-full rounded-[28px] object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full rounded-[28px] bg-violet-600 flex items-center justify-center text-3xl font-black">
                        {selectedNode.name.split('/')[1][0]}
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-black mb-1">{selectedNode.name}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-zinc-400 uppercase">
                      {selectedNode.type}
                    </span>
                    <span className="text-xs font-bold text-violet-400">#SHUATS_VERIFIED</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Aura Points</p>
                    <p className="text-xl font-black text-violet-400">{selectedNode.auraScore || '1.2k'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">Rank</p>
                    <p className="text-xl font-black text-pink-400">Top 4%</p>
                  </div>
                </div>

                {/* Analysis section */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <Zap size={12} className="text-yellow-400" /> Influence Analysis
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Network Reach', value: 88, color: 'bg-violet-600' },
                      { label: 'Trust Score', value: 94, color: 'bg-green-500' },
                      { label: 'Engagement', value: 65, color: 'bg-pink-600' },
                    ].map(stat => (
                      <div key={stat.label}>
                        <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase">
                          <span>{stat.label}</span>
                          <span>{stat.value}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value}%` }}
                            className={`h-full ${stat.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connections */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <Users size={12} className="text-blue-400" /> Top Bridges
                  </h4>
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-xl border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://api.dicebear.com/8.x/avataaars/svg?seed=friend${i}`} alt="" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-xl border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500">
                      +12
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button className="w-full py-4 rounded-2xl bg-white text-black font-black flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98]">
                  <Target size={18} /> INITIATE LINK
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-10 flex gap-6 px-6 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Spheres</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Users</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Active Node</span>
        </div>
      </div>
    </div>
  );
}
