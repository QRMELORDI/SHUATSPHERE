import { motion } from 'motion/react';
import { Satellite, ShieldCheck, AlertTriangle, Droplets, Leaf, Zap } from 'lucide-react';
import agriResults from '../../../agri_verify_results.json';

export function FieldReportView() {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="font-black text-lg text-foreground flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
          <Satellite size={20} className="text-[#0D9488]" />
          AgriVerify Satellite Reports
        </h2>
        <span className="text-[10px] font-black bg-[#0D9488]/10 text-[#0D9488] px-2 py-0.5 rounded-full border border-[#0D9488]/20">
          LIVE SATELLITE DATA
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {agriResults.map((report, i) => (
          <motion.div
            key={report.field_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-2xl border-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#15122A] shadow-[4px_4px_0px_#18181B] dark:shadow-none"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs font-black text-zinc-500 uppercase tracking-wider">Field ID</div>
                <div className="font-black text-lg text-foreground" style={{ fontFamily: 'Outfit, sans-serif' }}>{report.field_id}</div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border-2 ${
                report.status === 'VERIFIED' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-600/30' 
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 border-amber-600/30'
              }`}>
                {report.status === 'VERIFIED' ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                <span className="text-xs font-black">{report.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-1 text-[9px] font-black text-blue-600 mb-1">
                  <Droplets size={10} /> MOISTURE
                </div>
                <div className="text-sm font-black text-foreground">{report.satellite_data.moisture}%</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 mb-1">
                  <Leaf size={10} /> NDVI (Green)
                </div>
                <div className="text-sm font-black text-foreground">{report.satellite_data.ndvi}</div>
              </div>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                <div className="flex items-center gap-1 text-[9px] font-black text-purple-600 mb-1">
                  <Zap size={10} /> BIOMASS
                </div>
                <div className="text-sm font-black text-foreground">{report.satellite_data.biomass}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-[10px] text-zinc-500 font-bold">
                Synced: {report.timestamp}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#7C3AED]" 
                    style={{ width: `${report.sustainability_score}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-[#7C3AED]">{report.sustainability_score}% Aura</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
