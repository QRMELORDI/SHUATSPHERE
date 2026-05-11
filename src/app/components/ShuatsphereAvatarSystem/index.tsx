import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  User, 
  Sparkles, 
  ChevronDown, 
  Check,
  RotateCcw,
  Download,
  Grid3X3
} from 'lucide-react';

interface AvatarConfig {
  face: number;
  hair: number;
  hairColor: string;
  skinTone: string;
  eyes: number;
  mouth: number;
  accessories: number;
  background: string;
  gender: 'male' | 'female';
}

const SKIN_TONES = [
  '#FFE0BD', '#FFCD94', '#EABC95', '#D4A574', 
  '#C68642', '#8D5524', '#5C3D2E', '#3B2219'
];

const HAIR_COLORS = [
  '#1A1A1A', '#2D2D2D', '#4A3728', '#8B5A2B',
  '#D4A574', '#C4935A', '#B8860B', '#8B4513',
  '#DC143C', '#FF6B6B', '#FF69B4', '#FF1493',
  '#9400D3', '#8B008B', '#4B0082', '#000080',
  '#00CED1', '#00FA9A', '#7FFF00', '#ADFF2F',
  '#FFD700', '#FFA500', '#FF8C00', '#FFFFFF',
  '#C0C0C0', '#808080'
];

const BACKGROUND_COLORS = [
  '#7C3AED', '#2DD4BF', '#F472B6', '#FB923C',
  '#60A5FA', '#34D399', '#A78BFA', '#FBBF24',
  '#EC4899', '#8B5CF6', '#06B6D4', '#10B981',
  '#F59E0B', '#EF4444', '#6366F1', '#14B8A6'
];

interface AvatarPartProps {
  config: AvatarConfig;
  size?: number;
}

export function ShuatsphereAvatar({ config, size = 120 }: AvatarPartProps) {
  const { face, hair, hairColor, skinTone, eyes, mouth, accessories, background, gender } = config;
  
  const getSkinColor = () => skinTone;
  const getHairColor = () => hairColor;
  const getBgColor = () => background;

  const renderFace = () => (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <linearGradient id={`skinGradient-${config}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={skinTone} />
          <stop offset="100%" stopColor={skinTone} stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      <ellipse cx="100" cy="100" rx="70" ry="75" fill={background} />
      
      <ellipse cx="100" cy="105" rx="60" ry="55" fill="url(#skinGradient)" />
      
      <ellipse cx="100" cy="110" rx="40" ry="35" fill={skinTone} />
      
      {eyes === 0 && (
        <>
          <circle cx="80" cy="95" r="8" fill="#1A1A1A" />
          <circle cx="120" cy="95" r="8" fill="#1A1A1A" />
          <circle cx="82" cy="93" r="3" fill="#FFFFFF" />
          <circle cx="122" cy="93" r="3" fill="#FFFFFF" />
        </>
      )}
      {eyes === 1 && (
        <>
          <ellipse cx="80" cy="95" rx="10" ry="6" fill="#1A1A1A" />
          <ellipse cx="120" cy="95" rx="10" ry="6" fill="#1A1A1A" />
          <circle cx="82" cy="93" r="2" fill="#FFFFFF" />
          <circle cx="122" cy="93" r="2" fill="#FFFFFF" />
        </>
      )}
      {eyes === 2 && (
        <>
          <path d="M70 90 Q80 85 90 90" stroke="#1A1A1A" strokeWidth="3" fill="none" />
          <path d="M110 90 Q120 85 130 90" stroke="#1A1A1A" strokeWidth="3" fill="none" />
          <circle cx="80" cy="95" r="4" fill="#1A1A1A" />
          <circle cx="120" cy="95" r="4" fill="#1A1A1A" />
        </>
      )}
      {eyes === 3 && (
        <>
          <circle cx="80" cy="95" r="12" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
          <circle cx="120" cy="95" r="12" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="2" />
          <circle cx="80" cy="95" r="6" fill="#4B0082" />
          <circle cx="120" cy="95" r="6" fill="#4B0082" />
        </>
      )}
      {eyes === 4 && (
        <>
          <circle cx="80" cy="92" r="10" fill="#FFFFFF" />
          <circle cx="120" cy="92" r="10" fill="#FFFFFF" />
          <circle cx="80" cy="92" r="7" fill={hairColor} />
          <circle cx="120" cy="92" r="7" fill={hairColor} />
          <circle cx="80" cy="90" r="3" fill="#1A1A1A" />
          <circle cx="120" cy="90" r="3" fill="#1A1A1A" />
        </>
      )}
      {eyes === 5 && (
        <>
          <path d="M70 95 L90 95" stroke="#1A1A1A" strokeWidth="4" />
          <path d="M110 95 L130 95" stroke="#1A1A1A" strokeWidth="4" />
          <circle cx="80" cy="95" r="5" fill="#1A1A1A" />
          <circle cx="120" cy="95" r="5" fill="#1A1A1A" />
        </>
      )}
      
      {mouth === 0 && (
        <path d="M85 130 Q100 145 115 130" stroke="#1A1A1A" strokeWidth="3" fill="none" />
      )}
      {mouth === 1 && (
        <circle cx="100" cy="135" r="8" fill="#1A1A1A" />
      )}
      {mouth === 2 && (
        <path d="M85 130 Q100 120 115 130" stroke="#1A1A1A" strokeWidth="3" fill="none" />
      )}
      {mouth === 3 && (
        <line x1="85" y1="135" x2="115" y2="135" stroke="#1A1A1A" strokeWidth="3" />
      )}
      {mouth === 4 && (
        <ellipse cx="100" cy="135" rx="10" ry="6" fill="#FF6B6B" />
      )}
      {mouth === 5 && (
        <>
          <path d="M85 130 Q100 140 115 130" stroke="#1A1A1A" strokeWidth="2" fill="none" />
          <path d="M88 132 Q100 138 112 132" stroke="#FF6B6B" strokeWidth="2" fill="none" />
        </>
      )}
      
      {accessories === 1 && (
        <circle cx="100" cy="70" r="25" fill="none" stroke="#1A1A1A" strokeWidth="3" />
      )}
      {accessories === 2 && (
        <>
          <line x1="45" y1="70" x2="65" y2="75" stroke="#1A1A1A" strokeWidth="2" />
          <line x1="135" y1="75" x2="155" y2="70" stroke="#1A1A1A" strokeWidth="2" />
        </>
      )}
      {accessories === 3 && (
        <rect x="70" y="75" width="60" height="20" rx="3" fill="none" stroke="#1A1A1A" strokeWidth="2" />
      )}
    </svg>
  );

  const renderHair = () => {
    if (gender === 'male') {
      switch (hair) {
        case 0: return null;
        case 1:
          return (
            <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
              <path d="M60 60 Q100 20 140 60 Q150 80 140 90 Q100 70 60 90 Q50 80 60 60" fill={hairColor} />
            </svg>
          );
        case 2:
          return (
            <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
              <ellipse cx="100" cy="55" rx="55" ry="30" fill={hairColor} />
              <path d="M55 60 Q100 30 145 60" fill={hairColor} />
            </svg>
          );
        case 3:
          return (
            <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
              <path d="M50 80 Q60 30 100 25 Q140 30 150 80 L150 100 Q100 80 50 100 Z" fill={hairColor} />
            </svg>
          );
        case 4:
          return (
            <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
              <path d="M45 100 L55 50 Q100 20 145 50 L155 100" fill={hairColor} />
              <circle cx="55" cy="55" r="8" fill={hairColor} />
              <circle cx="145" cy="55" r="8" fill={hairColor} />
            </svg>
          );
        case 5:
          return (
            <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
              <path d="M40 110 Q60 40 100 35 Q140 40 160 110" fill={hairColor} />
              <path d="M45 100 Q100 60 155 100" fill={hairColor} />
            </svg>
          );
        default:
          return null;
      }
    } else {
      switch (hair) {
        case 0: return null;
        case 1:
          return (
            <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
              <ellipse cx="100" cy="50" rx="60" ry="35" fill={hairColor} />
              <path d="M40 80 Q100 40 160 80" fill={hairColor} />
            </svg>
          );
        case 2:
          return (
            <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
              <path d="M35 120 Q50 40 100 35 Q150 40 165 120 L165 160 Q100 150 35 160 Z" fill={hairColor} />
            </svg>
          );
        case 3:
          return (
            <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
              <ellipse cx="100" cy="45" rx="55" ry="30" fill={hairColor} />
              <path d="M45 90 Q30 130 40 160 Q100 170 160 160 Q170 130 155 90" fill={hairColor} />
            </svg>
          );
        case 4:
          return (
            <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
              <circle cx="100" cy="50" r="55" fill={hairColor} />
              <path d="M45 70 Q100 50 155 70" fill={hairColor} />
            </svg>
          );
        case 5:
          return (
            <svg viewBox="0 0 200 200" width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
              <path d="M30 130 Q50 35 100 30 Q150 35 170 130" fill={hairColor} />
              <path d="M35 125 Q100 80 165 125" fill={hairColor} />
            </svg>
          );
        default:
          return null;
      }
    }
  };

  return (
    <div style={{ 
      width: size, 
      height: size, 
      position: 'relative',
      borderRadius: '50%',
      overflow: 'hidden'
    }}>
      {renderHair()}
      <div style={{ position: 'absolute', top: '15%', left: 0, right: 0 }}>
        {renderFace()}
      </div>
    </div>
  );
}

const AVATAR_PRESETS = [
  { name: 'Cosmic Wanderer', config: { face: 0, hair: 2, hairColor: '#8B5A2B', skinTone: '#EABC95', eyes: 0, mouth: 0, accessories: 0, background: '#7C3AED', gender: 'male' as const } },
  { name: 'Nebula Star', config: { face: 1, hair: 1, hairColor: '#FF6B6B', skinTone: '#FFE0BD', eyes: 3, mouth: 4, accessories: 1, background: '#2DD4BF', gender: 'female' as const } },
  { name: 'Void Traveler', config: { face: 2, hair: 3, hairColor: '#1A1A1A', skinTone: '#5C3D2E', eyes: 1, mouth: 2, accessories: 0, background: '#F472B6', gender: 'male' as const } },
  { name: 'Galaxy Dreamer', config: { face: 0, hair: 4, hairColor: '#D4A574', skinTone: '#FFCD94', eyes: 2, mouth: 1, accessories: 2, background: '#60A5FA', gender: 'female' as const } },
  { name: 'Stellar Phoenix', config: { face: 3, hair: 5, hairColor: '#FFD700', skinTone: '#D4A574', eyes: 4, mouth: 5, accessories: 1, background: '#FB923C', gender: 'male' as const } },
  { name: 'Astral Spirit', config: { face: 1, hair: 2, hairColor: '#9400D3', skinTone: '#C68642', eyes: 0, mouth: 3, accessories: 0, background: '#34D399', gender: 'female' as const } },
  { name: 'Quantum Runner', config: { face: 2, hair: 1, hairColor: '#00CED1', skinTone: '#8D5524', eyes: 5, mouth: 0, accessories: 3, background: '#A78BFA', gender: 'male' as const } },
  { name: 'Dimensional Sage', config: { face: 0, hair: 3, hairColor: '#FFFFFF', skinTone: '#FFE0BD', eyes: 3, mouth: 4, accessories: 2, background: '#EC4899', gender: 'female' as const } },
];

interface AvatarSelectorProps {
  config: AvatarConfig;
  setConfig: React.Dispatch<React.SetStateAction<AvatarConfig>>;
}

function ColorPicker({ 
  label, 
  colors, 
  selected, 
  onSelect 
}: { 
  label: string; 
  colors: string[]; 
  selected: string; 
  onSelect: (color: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color, i) => (
          <button
            key={i}
            onClick={() => onSelect(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selected === color 
                ? 'border-white scale-110 shadow-lg' 
                : 'border-transparent hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

function Selector({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string; 
  value: number; 
  options: string[]; 
  onChange: (val: number) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{label}</label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {options.map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
              value === i 
                ? 'bg-[#7C3AED] text-white' 
                : 'bg-white/10 text-zinc-400 hover:bg-white/20'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AvatarSelector({ config, setConfig }: AvatarSelectorProps) {
  return (
    <div className="space-y-6 p-4 bg-zinc-900/50 rounded-2xl">
      <div className="space-y-3">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <User size={14} /> Gender
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setConfig({ ...config, gender: 'male', hair: 1 })}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              config.gender === 'male'
                ? 'bg-[#7C3AED] text-white'
                : 'bg-white/10 text-zinc-400 hover:bg-white/20'
            }`}
          >
            👦 Boy
          </button>
          <button
            onClick={() => setConfig({ ...config, gender: 'female', hair: 1 })}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              config.gender === 'female'
                ? 'bg-[#7C3AED] text-white'
                : 'bg-white/10 text-zinc-400 hover:bg-white/20'
            }`}
          >
            👧 Girl
          </button>
        </div>
      </div>

      <div className="border-t border-white/10" />

      <ColorPicker
        label="Skin Tone"
        colors={SKIN_TONES}
        selected={config.skinTone}
        onSelect={(color) => setConfig({ ...config, skinTone: color })}
      />

      <ColorPicker
        label="Hair Color"
        colors={HAIR_COLORS}
        selected={config.hairColor}
        onSelect={(color) => setConfig({ ...config, hairColor: color })}
      />

      <ColorPicker
        label="Background"
        colors={BACKGROUND_COLORS}
        selected={config.background}
        onSelect={(color) => setConfig({ ...config, background: color })}
      />

      <div className="border-t border-white/10" />

      <Selector
        label="Hair Style"
        value={config.hair}
        options={Array(6).fill('')}
        onChange={(val) => setConfig({ ...config, hair: val })}
      />

      <Selector
        label="Face Shape"
        value={config.face}
        options={Array(6).fill('')}
        onChange={(val) => setConfig({ ...config, face: val })}
      />

      <Selector
        label="Eyes"
        value={config.eyes}
        options={Array(6).fill('')}
        onChange={(val) => setConfig({ ...config, eyes: val })}
      />

      <Selector
        label="Mouth"
        value={config.mouth}
        options={Array(6).fill('')}
        onChange={(val) => setConfig({ ...config, mouth: val })}
      />

      <Selector
        label="Accessories"
        value={config.accessories}
        options={Array(4).fill('')}
        onChange={(val) => setConfig({ ...config, accessories: val })}
      />
    </div>
  );
}

interface AvatarBundleProps {
  title: string;
  avatars: typeof AVATAR_PRESETS;
  onSelect: (config: AvatarConfig) => void;
}

function AvatarBundle({ title, avatars, onSelect }: AvatarBundleProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
        <Sparkles size={16} className="text-[#7C3AED]" />
        {title}
      </h3>
      <div className="grid grid-cols-4 gap-3">
        {avatars.map((preset, i) => (
          <button
            key={i}
            onClick={() => onSelect(preset.config)}
            className="group relative"
          >
            <div className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 transition-all">
              <ShuatsphereAvatar config={preset.config} size={50} />
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity truncate max-w-[60px]">
              {preset.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ShuatsphereAvatarSystem() {
  const [activeTab, setActiveTab] = useState<'customize' | 'presets'>('customize');
  const [config, setConfig] = useState<AvatarConfig>({
    face: 0,
    hair: 1,
    hairColor: '#8B5A2B',
    skinTone: '#FFE0BD',
    eyes: 0,
    mouth: 0,
    accessories: 0,
    background: '#7C3AED',
    gender: 'male'
  });

  const handlePresetSelect = (presetConfig: AvatarConfig) => {
    setConfig(presetConfig);
  };

  const handleRandomize = () => {
    setConfig({
      face: Math.floor(Math.random() * 6),
      hair: Math.floor(Math.random() * 6),
      hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
      skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
      eyes: Math.floor(Math.random() * 6),
      mouth: Math.floor(Math.random() * 6),
      accessories: Math.floor(Math.random() * 4),
      background: BACKGROUND_COLORS[Math.floor(Math.random() * BACKGROUND_COLORS.length)],
      gender: Math.random() > 0.5 ? 'male' : 'female'
    });
  };

  return (
    <div className="min-h-screen bg-[#0D0B1A] text-white p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black bg-gradient-to-r from-[#7C3AED] to-[#2DD4BF] bg-clip-text text-transparent">
            SHUATSPHERE AVATARS
          </h1>
          <p className="text-zinc-400 text-sm">Create your parallel universe identity</p>
        </div>

        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl">
          <button
            onClick={() => setActiveTab('customize')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'customize'
                ? 'bg-[#7C3AED] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette size={16} className="inline mr-2" />
            Customize
          </button>
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'presets'
                ? 'bg-[#7C3AED] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Grid3X3 size={16} className="inline mr-2" />
            Presets
          </button>
        </div>

        <div className="flex justify-center">
          <motion.div
            key={JSON.stringify(config)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <ShuatsphereAvatar config={config} size={180} />
            <div className="absolute -bottom-2 -right-2">
              <button
                onClick={handleRandomize}
                className="p-3 bg-[#2DD4BF] rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <RotateCcw size={20} className="text-[#0D0B1A]" />
              </button>
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'customize' ? (
            <motion.div
              key="customize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AvatarSelector config={config} setConfig={setConfig} />
            </motion.div>
          ) : (
            <motion.div
              key="presets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <AvatarBundle 
                title="Cosmic Collection" 
                avatars={AVATAR_PRESETS.slice(0, 4)} 
                onSelect={handlePresetSelect}
              />
              <AvatarBundle 
                title="Stellar Collection" 
                avatars={AVATAR_PRESETS.slice(4)} 
                onSelect={handlePresetSelect}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 pt-4">
          <button className="flex-1 py-4 bg-[#7C3AED] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#6D28D9] transition-all">
            <Check size={20} />
            Save Avatar
          </button>
          <button className="py-4 px-6 bg-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShuatsphereAvatarSystem;