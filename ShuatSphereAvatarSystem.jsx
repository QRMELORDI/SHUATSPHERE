import React, { useState } from 'react';

// ============================================================================
// SHUATSPHERE AVATAR SYSTEM
// A parallel universe Reddit avatar system with cosmic Sphereling characters
// ============================================================================

const ShuatSphereAvatarSystem = () => {
  const [selectedBase, setSelectedBase] = useState('boy');
  const [selectedHead, setSelectedHead] = useState('classic');
  const [selectedHair, setSelectedHair] = useState('messy');
  const [selectedEyes, setSelectedEyes] = useState('happy');
  const [selectedMouth, setSelectedMouth] = useState('smile');
  const [selectedOutfit, setSelectedOutfit] = useState('hoodie');
  const [selectedAccessory, setSelectedAccessory] = useState('none');
  const [selectedPose, setSelectedPose] = useState('standing');
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6');
  const [secondaryColor, setSecondaryColor] = useState('#EC4899');
  const [view, setView] = useState('builder'); // 'builder', 'spherelings', 'desi'

  // Avatar Parts Library
  const avatarParts = {
    bases: {
      boy: `
        <defs>
          <linearGradient id="boyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <circle cx="100" cy="130" r="50" fill="url(#boyGrad)" opacity="0.9"/>
        <circle cx="100" cy="100" r="92" fill="${primaryColor}" opacity="0.05" filter="url(#glow)"/>
      `,
      girl: `
        <defs>
          <linearGradient id="girlGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="130" r="50" fill="url(#girlGrad)" opacity="0.9"/>
        <circle cx="100" cy="100" r="92" fill="${primaryColor}" opacity="0.05" filter="url(#glow)"/>
      `
    },
    heads: {
      classic: '<circle cx="100" cy="70" r="38" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2.5"/>',
      round: '<circle cx="100" cy="70" r="42" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2.5"/>',
      spiky: `<path d="M 100 32 L 108 35 L 115 32 L 120 38 L 125 35 L 130 42 L 132 50 L 130 58 L 125 65 L 120 70 L 115 75 L 108 78 L 100 80 L 92 78 L 85 75 L 80 70 L 75 65 L 70 58 L 68 50 L 70 42 L 75 35 L 80 38 L 85 32 L 92 35 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2.5"/>`,
      fluffy: `<ellipse cx="100" cy="70" rx="42" ry="45" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2.5"/><circle cx="85" cy="55" r="8" fill="#FFFFFF" opacity="0.7"/><circle cx="115" cy="55" r="8" fill="#FFFFFF" opacity="0.7"/><circle cx="85" cy="80" r="6" fill="#FFFFFF" opacity="0.7"/><circle cx="115" cy="80" r="6" fill="#FFFFFF" opacity="0.7"/>`,
      robot: `<rect x="68" y="40" width="64" height="60" rx="8" fill="#FFFFFF" stroke="#64748B" stroke-width="3"/><rect x="74" y="46" width="52" height="48" rx="4" fill="#1E293B"/><circle cx="88" cy="62" r="6" fill="${primaryColor}" opacity="0.8"/><circle cx="112" cy="62" r="6" fill="${primaryColor}" opacity="0.8"/><rect x="94" y="76" width="12" height="3" fill="${primaryColor}" opacity="0.6"/>`,
      crystal: `<path d="M 100 30 L 130 50 L 125 85 L 100 95 L 75 85 L 70 50 Z" fill="#FFFFFF" stroke="#C4B5FD" stroke-width="2.5" opacity="0.95"/><path d="M 100 30 L 115 45 L 100 95" stroke="#E9D5FF" stroke-width="1.5" opacity="0.4"/><path d="M 100 30 L 85 45 L 100 95" stroke="#E9D5FF" stroke-width="1.5" opacity="0.4"/>`,
      alien: `<ellipse cx="100" cy="70" rx="45" ry="38" fill="#10B981" opacity="0.9" stroke="#059669" stroke-width="2.5"/><ellipse cx="85" cy="62" rx="12" ry="18" fill="#000000" opacity="0.9"/><ellipse cx="115" cy="62" rx="12" ry="18" fill="#000000" opacity="0.9"/><ellipse cx="87" cy="60" rx="5" ry="8" fill="#34D399" opacity="0.8"/>`,
      helmet: `<ellipse cx="100" cy="72" rx="40" ry="42" fill="#1E293B" stroke="#475569" stroke-width="3"/><ellipse cx="100" cy="65" rx="32" ry="28" fill="#0EA5E9" opacity="0.3" stroke="#0EA5E9" stroke-width="1.5"/><circle cx="100" cy="65" r="18" fill="#0EA5E9" opacity="0.15"/><path d="M 70 75 Q 100 95 130 75" stroke="#475569" stroke-width="2.5" fill="none"/>`
    },
    hairstyles: {
      none: '',
      messy: `<path d="M 75 45 Q 65 35 70 30 Q 75 25 80 28 Q 85 22 90 25 Q 95 20 100 22 Q 105 20 110 25 Q 115 22 120 28 Q 125 25 130 30 Q 135 35 125 45" fill="${primaryColor}" opacity="0.85"/>`,
      quiff: `<path d="M 85 40 Q 90 28 100 25 Q 110 28 115 40 Q 110 45 100 45 Q 90 45 85 40" fill="${primaryColor}" opacity="0.85"/>`,
      wavy: `<path d="M 70 42 Q 75 35 80 38 Q 85 35 90 38 Q 95 35 100 38 Q 105 35 110 38 Q 115 35 120 38 Q 125 35 130 42 L 130 55 Q 100 50 70 55 Z" fill="${primaryColor}" opacity="0.85"/>`,
      curly: `<circle cx="75" cy="42" r="10" fill="${primaryColor}" opacity="0.85"/><circle cx="90" cy="38" r="11" fill="${primaryColor}" opacity="0.85"/><circle cx="100" cy="35" r="12" fill="${primaryColor}" opacity="0.85"/><circle cx="110" cy="38" r="11" fill="${primaryColor}" opacity="0.85"/><circle cx="125" cy="42" r="10" fill="${primaryColor}" opacity="0.85"/>`,
      long: `<path d="M 70 45 Q 68 60 70 75 L 75 75 Q 73 60 75 45 M 125 45 Q 127 60 125 75 L 130 75 Q 132 60 130 45" fill="${primaryColor}" opacity="0.85"/><path d="M 70 42 L 130 42 L 130 55 L 70 55 Z" fill="${primaryColor}" opacity="0.85"/>`,
      bun: `<circle cx="100" cy="35" r="12" fill="${primaryColor}" opacity="0.85"/><ellipse cx="100" cy="35" rx="8" ry="10" fill="${secondaryColor}" opacity="0.6"/>`,
      pigtails: `<circle cx="75" cy="50" r="14" fill="${primaryColor}" opacity="0.85"/><circle cx="125" cy="50" r="14" fill="${primaryColor}" opacity="0.85"/><path d="M 75 45 L 80 42 M 125 45 L 120 42" stroke="${primaryColor}" stroke-width="3" opacity="0.85"/>`,
      braids: `<path d="M 72 45 Q 70 55 68 65 Q 67 75 70 85" stroke="${primaryColor}" stroke-width="6" fill="none" opacity="0.85"/><path d="M 128 45 Q 130 55 132 65 Q 133 75 130 85" stroke="${primaryColor}" stroke-width="6" fill="none" opacity="0.85"/><circle cx="68" cy="50" r="2" fill="${secondaryColor}"/><circle cx="68" cy="65" r="2" fill="${secondaryColor}"/><circle cx="68" cy="80" r="2" fill="${secondaryColor}"/><circle cx="132" cy="50" r="2" fill="${secondaryColor}"/><circle cx="132" cy="65" r="2" fill="${secondaryColor}"/><circle cx="132" cy="80" r="2" fill="${secondaryColor}"/>`
    },
    eyes: {
      normal: '<circle cx="88" cy="68" r="4" fill="#1E293B"/><circle cx="112" cy="68" r="4" fill="#1E293B"/>',
      happy: '<path d="M 82 68 Q 88 73 94 68" stroke="#1E293B" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M 106 68 Q 112 73 118 68" stroke="#1E293B" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
      wink: '<circle cx="88" cy="68" r="4" fill="#1E293B"/><path d="M 106 68 Q 112 68 118 68" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round"/>',
      starry: `<path d="M 88 64 L 90 68 L 94 68 L 91 71 L 92 75 L 88 72 L 84 75 L 85 71 L 82 68 L 86 68 Z" fill="${primaryColor}"/><path d="M 112 64 L 114 68 L 118 68 L 115 71 L 116 75 L 112 72 L 108 75 L 109 71 L 106 68 L 110 68 Z" fill="${primaryColor}"/>`,
      robot: `<rect x="84" y="64" width="8" height="8" rx="1" fill="${primaryColor}" opacity="0.9"/><rect x="108" y="64" width="8" height="8" rx="1" fill="${primaryColor}" opacity="0.9"/>`,
      glowing: `<circle cx="88" cy="68" r="5" fill="${primaryColor}" opacity="0.9" filter="url(#glow)"/><circle cx="88" cy="68" r="3" fill="#FFFFFF" opacity="0.8"/><circle cx="112" cy="68" r="5" fill="${primaryColor}" opacity="0.9" filter="url(#glow)"/><circle cx="112" cy="68" r="3" fill="#FFFFFF" opacity="0.8"/>`,
      heart: '<path d="M 84 68 Q 84 64 88 64 Q 92 64 92 68 Q 92 72 88 75 Q 84 72 84 68 Z" fill="#EC4899"/><path d="M 108 68 Q 108 64 112 64 Q 116 64 116 68 Q 116 72 112 75 Q 108 72 108 68 Z" fill="#EC4899"/>',
      xeyes: '<path d="M 84 64 L 92 72 M 84 72 L 92 64" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round"/><path d="M 108 64 L 116 72 M 108 72 L 116 64" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round"/>'
    },
    mouths: {
      smile: '<path d="M 85 82 Q 100 88 115 82" stroke="#1E293B" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
      openSmile: '<path d="M 85 82 Q 100 90 115 82 Q 100 88 85 82 Z" fill="#1E293B" opacity="0.8"/>',
      laugh: '<path d="M 85 80 Q 100 92 115 80" stroke="#1E293B" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M 85 80 Q 100 88 115 80" fill="#EC4899" opacity="0.4"/>',
      cute: '<ellipse cx="100" cy="85" rx="6" ry="4" fill="#EC4899" opacity="0.6"/>',
      wow: '<ellipse cx="100" cy="84" rx="6" ry="8" fill="#1E293B" opacity="0.8"/>',
      tongue: '<path d="M 88 82 Q 100 88 112 82" stroke="#1E293B" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="88" rx="4" ry="5" fill="#EC4899" opacity="0.7"/>',
      grin: '<path d="M 85 80 L 115 80 L 113 84 L 87 84 Z" fill="#1E293B" opacity="0.8"/><rect x="90" y="79" width="4" height="6" fill="#FFFFFF"/><rect x="106" y="79" width="4" height="6" fill="#FFFFFF"/>',
      neutral: '<line x1="88" y1="83" x2="112" y2="83" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round"/>'
    },
    outfits: {
      hoodie: `<path d="M 65 125 L 65 160 L 80 165 L 80 125 Z M 135 125 L 135 160 L 120 165 L 120 125 Z M 80 125 Q 90 120 100 120 Q 110 120 120 125 L 120 165 L 80 165 Z" fill="${primaryColor}" opacity="0.9"/><circle cx="100" cy="140" r="3" fill="${secondaryColor}"/><circle cx="100" cy="150" r="3" fill="${secondaryColor}"/><rect x="85" y="122" width="30" height="8" rx="4" fill="${secondaryColor}" opacity="0.6"/>`,
      jacket: `<path d="M 70 130 L 70 170 L 85 170 L 85 130 Z M 130 130 L 130 170 L 115 170 L 115 130 Z M 85 130 L 100 125 L 115 130 L 115 170 L 85 170 Z" fill="${primaryColor}" opacity="0.9"/><path d="M 90 130 L 90 170" stroke="${secondaryColor}" stroke-width="2"/><line x1="85" y1="145" x2="95" y2="145" stroke="${secondaryColor}" stroke-width="2"/>`,
      tshirt: `<path d="M 75 125 L 70 140 L 75 145 L 75 125 Z M 125 125 L 130 140 L 125 145 L 125 125 Z M 75 125 Q 90 120 100 120 Q 110 120 125 125 L 125 165 L 75 165 Z" fill="${primaryColor}" opacity="0.9"/>`,
      sweater: `<path d="M 70 125 L 65 145 L 70 145 L 70 125 Z M 130 125 L 135 145 L 130 145 L 130 125 Z M 70 125 Q 85 118 100 118 Q 115 118 130 125 L 130 168 L 70 168 Z" fill="${primaryColor}" opacity="0.9"/><rect x="75" y="125" width="50" height="5" rx="2" fill="${secondaryColor}" opacity="0.7"/><rect x="75" y="163" width="50" height="5" rx="2" fill="${secondaryColor}" opacity="0.7"/><rect x="75" y="140" width="50" height="3" rx="1" fill="${secondaryColor}" opacity="0.5"/>`,
      spacesuit: `<path d="M 72 125 Q 85 118 100 118 Q 115 118 128 125 L 128 170 L 72 170 Z" fill="#E2E8F0" opacity="0.95" stroke="#64748B" stroke-width="2"/><circle cx="100" cy="142" r="12" fill="#0EA5E9" opacity="0.3" stroke="#0EA5E9" stroke-width="1.5"/><rect x="88" y="155" width="24" height="3" rx="1" fill="${primaryColor}"/><rect x="88" y="162" width="24" height="3" rx="1" fill="${secondaryColor}"/>`,
      academic: `<path d="M 75 130 Q 87 122 100 122 Q 113 122 125 130 L 125 168 L 75 168 Z" fill="#1E293B" opacity="0.95"/><path d="M 85 130 L 100 125 L 115 130 L 100 135 Z" fill="${primaryColor}"/><rect x="95" y="135" width="10" height="33" fill="${secondaryColor}" opacity="0.8"/>`,
      collarshirt: `<path d="M 75 125 L 70 135 L 75 135 M 125 125 L 130 135 L 125 135 M 75 125 Q 87 120 100 120 Q 113 120 125 125 L 125 165 L 75 165 Z" fill="#FFFFFF" opacity="0.95" stroke="#E2E8F0" stroke-width="1.5"/><path d="M 95 125 L 95 165 M 105 125 L 105 165" stroke="${primaryColor}" stroke-width="1.5"/><circle cx="100" cy="135" r="2" fill="${primaryColor}"/><circle cx="100" cy="145" r="2" fill="${primaryColor}"/><circle cx="100" cy="155" r="2" fill="${primaryColor}"/>`
    },
    accessories: {
      none: '',
      glasses: '<rect x="78" y="64" width="18" height="12" rx="2" fill="none" stroke="#1E293B" stroke-width="2"/><rect x="104" y="64" width="18" height="12" rx="2" fill="none" stroke="#1E293B" stroke-width="2"/><line x1="96" y1="70" x2="104" y2="70" stroke="#1E293B" stroke-width="2"/>',
      sunglasses: '<rect x="78" y="64" width="18" height="12" rx="2" fill="#1E293B" opacity="0.8" stroke="#1E293B" stroke-width="2"/><rect x="104" y="64" width="18" height="12" rx="2" fill="#1E293B" opacity="0.8" stroke="#1E293B" stroke-width="2"/><line x1="96" y1="70" x2="104" y2="70" stroke="#1E293B" stroke-width="2"/>',
      mask: '<rect x="80" y="75" width="40" height="15" rx="2" fill="#0EA5E9" opacity="0.9"/><line x1="80" y1="82" x2="75" y2="82" stroke="#0EA5E9" stroke-width="1.5"/><line x1="120" y1="82" x2="125" y2="82" stroke="#0EA5E9" stroke-width="1.5"/>',
      scarf: `<path d="M 70 85 Q 75 95 85 100 L 90 95 Q 80 90 75 85 Z" fill="${secondaryColor}" opacity="0.9"/><path d="M 70 88 Q 100 78 130 88 L 130 95 Q 100 85 70 95 Z" fill="${primaryColor}" opacity="0.9"/>`,
      badge: `<circle cx="120" cy="145" r="8" fill="${secondaryColor}" stroke="#FFFFFF" stroke-width="2"/><path d="M 117 145 L 119 147 L 123 142" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>`,
      necklace: `<ellipse cx="100" cy="110" rx="18" ry="6" fill="none" stroke="${secondaryColor}" stroke-width="2"/><circle cx="100" cy="116" r="4" fill="${primaryColor}"/>`,
      earrings: `<circle cx="72" cy="75" r="4" fill="${secondaryColor}" stroke="${primaryColor}" stroke-width="1"/><circle cx="128" cy="75" r="4" fill="${secondaryColor}" stroke="${primaryColor}" stroke-width="1"/>`,
      halo: `<ellipse cx="100" cy="28" rx="20" ry="4" fill="none" stroke="${secondaryColor}" stroke-width="3" opacity="0.8" filter="url(#glow)"/><ellipse cx="100" cy="28" rx="18" ry="3" fill="${secondaryColor}" opacity="0.3"/>`
    },
    poses: {
      standing: '',
      handsUp: '<circle cx="70" cy="140" r="8" fill="${primaryColor}" opacity="0.8"/><path d="M 70 140 L 60 120" stroke="${primaryColor}" stroke-width="6" stroke-linecap="round"/><circle cx="130" cy="140" r="8" fill="${primaryColor}" opacity="0.8"/><path d="M 130 140 L 140 120" stroke="${primaryColor}" stroke-width="6" stroke-linecap="round"/>',
      waving: '<circle cx="130" cy="120" r="8" fill="${primaryColor}" opacity="0.8"/><path d="M 130 120 L 140 110 L 145 105" stroke="${primaryColor}" stroke-width="6" stroke-linecap="round"/>',
      thumbsUp: '<circle cx="130" cy="135" r="8" fill="${primaryColor}" opacity="0.8"/><path d="M 130 135 L 140 125 L 142 118" stroke="${primaryColor}" stroke-width="6" stroke-linecap="round"/><rect x="139" y="115" width="5" height="8" rx="2" fill="${primaryColor}" opacity="0.8"/>',
      peace: '<path d="M 135 130 L 142 115 M 135 130 L 145 118" stroke="${primaryColor}" stroke-width="5" stroke-linecap="round"/><circle cx="135" cy="135" r="7" fill="${primaryColor}" opacity="0.8"/>',
      crossedArms: '<path d="M 75 140 L 115 145 M 125 140 L 85 145" stroke="${primaryColor}" stroke-width="7" stroke-linecap="round" opacity="0.8"/>',
      handsInPocket: '<path d="M 75 150 L 80 155 M 125 150 L 120 155" stroke="${primaryColor}" stroke-width="6" stroke-linecap="round" opacity="0.8"/>',
      sitting: '<ellipse cx="100" cy="155" rx="45" ry="15" fill="${primaryColor}" opacity="0.2"/>'
    }
  };

  // Pre-made Sphereling Characters
  const spherelings = [
    { name: 'Nova', colors: ['#8B5CF6', '#EC4899'], head: 'classic', hair: 'quiff', eyes: 'glowing', mouth: 'smile', outfit: 'hoodie' },
    { name: 'Orbit', colors: ['#0EA5E9', '#06B6D4'], head: 'robot', hair: 'none', eyes: 'robot', mouth: 'neutral', outfit: 'spacesuit' },
    { name: 'Eclipse', colors: ['#6366F1', '#8B5CF6'], head: 'classic', hair: 'wavy', eyes: 'normal', mouth: 'smile', outfit: 'hoodie' },
    { name: 'Quantum', colors: ['#E2E8F0', '#64748B'], head: 'helmet', hair: 'none', eyes: 'glowing', mouth: 'neutral', outfit: 'spacesuit' },
    { name: 'Nebula', colors: ['#06B6D4', '#0EA5E9'], head: 'alien', hair: 'none', eyes: 'normal', mouth: 'smile', outfit: 'tshirt' },
    { name: 'Zenith', colors: ['#8B5CF6', '#6366F1'], head: 'crystal', hair: 'none', eyes: 'starry', mouth: 'wow', outfit: 'sweater' },
    { name: 'Comet', colors: ['#F59E0B', '#EF4444'], head: 'spiky', hair: 'messy', eyes: 'happy', mouth: 'laugh', outfit: 'jacket' },
    { name: 'Pulse', colors: ['#06B6D4', '#0EA5E9'], head: 'round', hair: 'none', eyes: 'glowing', mouth: 'neutral', outfit: 'hoodie' },
    { name: 'Aurora', colors: ['#A78BFA', '#C4B5FD'], head: 'fluffy', hair: 'long', eyes: 'heart', mouth: 'cute', outfit: 'sweater' },
    { name: 'Astro', colors: ['#1E293B', '#475569'], head: 'helmet', hair: 'none', eyes: 'robot', mouth: 'neutral', outfit: 'spacesuit' },
    { name: 'Lyra', colors: ['#EC4899', '#F472B6'], head: 'round', hair: 'pigtails', eyes: 'happy', mouth: 'smile', outfit: 'tshirt' },
    { name: 'Glitch', colors: ['#0EA5E9', '#06B6D4'], head: 'robot', hair: 'none', eyes: 'robot', mouth: 'grin', outfit: 'hoodie' },
    { name: 'Voyager', colors: ['#0EA5E9', '#06B6D4'], head: 'helmet', hair: 'none', eyes: 'glowing', mouth: 'neutral', outfit: 'spacesuit' },
    { name: 'Pixel', colors: ['#8B5CF6', '#A78BFA'], head: 'robot', hair: 'none', eyes: 'robot', mouth: 'smile', outfit: 'hoodie' },
    { name: 'Halo', colors: ['#FDE68A', '#FCD34D'], head: 'classic', hair: 'bun', eyes: 'happy', mouth: 'smile', outfit: 'tshirt' },
    { name: 'Drift', colors: ['#1E293B', '#3B82F6'], head: 'round', hair: 'wavy', eyes: 'normal', mouth: 'smile', outfit: 'jacket' },
    { name: 'Zephyr', colors: ['#06B6D4', '#0EA5E9'], head: 'spiky', hair: 'messy', eyes: 'wink', mouth: 'smile', outfit: 'hoodie' },
    { name: 'Capper', colors: ['#A78BFA', '#C4B5FD'], head: 'round', hair: 'curly', eyes: 'happy', mouth: 'laugh', outfit: 'sweater' },
    { name: 'Catalyst', colors: ['#F59E0B', '#EF4444'], head: 'crystal', hair: 'none', eyes: 'starry', mouth: 'wow', outfit: 'tshirt' },
    { name: 'Mirage', colors: ['#EC4899', '#F472B6'], head: 'fluffy', hair: 'long', eyes: 'happy', mouth: 'cute', outfit: 'sweater' },
    { name: 'Cipher', colors: ['#1E293B', '#475569'], head: 'robot', hair: 'none', eyes: 'robot', mouth: 'neutral', outfit: 'hoodie' },
    { name: 'Solis', colors: ['#FCD34D', '#FBBF24'], head: 'round', hair: 'messy', eyes: 'happy', mouth: 'laugh', outfit: 'tshirt' },
    { name: 'Luna', colors: ['#6366F1', '#8B5CF6'], head: 'classic', hair: 'bun', eyes: 'normal', mouth: 'smile', outfit: 'sweater' },
    { name: 'Titan', colors: ['#0EA5E9', '#06B6D4'], head: 'helmet', hair: 'none', eyes: 'glowing', mouth: 'neutral', outfit: 'spacesuit' },
    { name: 'Starlight', colors: ['#8B5CF6', '#C4B5FD'], head: 'round', hair: 'long', eyes: 'starry', mouth: 'smile', outfit: 'hoodie' }
  ];

  // Generate Avatar SVG
  const generateAvatar = (config = {}) => {
    const base = config.base || selectedBase;
    const head = config.head || selectedHead;
    const hair = config.hair || selectedHair;
    const eyes = config.eyes || selectedEyes;
    const mouth = config.mouth || selectedMouth;
    const outfit = config.outfit || selectedOutfit;
    const accessory = config.accessory || selectedAccessory;
    const pose = config.pose || selectedPose;
    const primary = config.primaryColor || primaryColor;
    const secondary = config.secondaryColor || secondaryColor;

    // Replace color placeholders
    const baseSVG = avatarParts.bases[base].replace(/\$\{primaryColor\}/g, primary).replace(/\$\{secondaryColor\}/g, secondary);
    const hairSVG = avatarParts.hairstyles[hair].replace(/\$\{primaryColor\}/g, primary).replace(/\$\{secondaryColor\}/g, secondary);
    const outfitSVG = avatarParts.outfits[outfit].replace(/\$\{primaryColor\}/g, primary).replace(/\$\{secondaryColor\}/g, secondary);
    const accessorySVG = avatarParts.accessories[accessory].replace(/\$\{primaryColor\}/g, primary).replace(/\$\{secondaryColor\}/g, secondary);
    const poseSVG = avatarParts.poses[pose].replace(/\$\{primaryColor\}/g, primary).replace(/\$\{secondaryColor\}/g, secondary);

    return `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        ${baseSVG}
        ${outfitSVG}
        ${poseSVG}
        ${avatarParts.heads[head]}
        ${hairSVG}
        ${avatarParts.eyes[eyes]}
        ${avatarParts.mouths[mouth]}
        ${accessorySVG}
        <line x1="100" y1="32" x2="100" y2="22" stroke="${primary}" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="100" cy="19" r="6" fill="${primary}" filter="url(#glow)"/>
        <circle cx="100" cy="19" r="3.5" fill="${secondary}" opacity="0.8"/>
      </svg>
    `;
  };

  // Download Avatar
  const downloadAvatar = (svgContent, filename) => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #1E293B 100%)',
      color: '#F8FAFC',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      padding: '40px 20px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <svg width="80" height="80" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6"/>
                <stop offset="100%" stopColor="#EC4899"/>
              </linearGradient>
              <filter id="logoGlow">
                <feGaussianBlur stdDeviation="3"/>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="45" fill="url(#logoGrad)" opacity="0.2" filter="url(#logoGlow)"/>
            <circle cx="50" cy="50" r="35" fill="none" stroke="url(#logoGrad)" strokeWidth="4"/>
            <circle cx="50" cy="50" r="20" fill="url(#logoGrad)" opacity="0.6"/>
            <circle cx="35" cy="45" r="3" fill="#FFF"/>
            <circle cx="50" cy="35" r="4" fill="#FFF"/>
            <circle cx="65" cy="45" r="3" fill="#FFF"/>
          </svg>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '48px',
              fontWeight: '800',
              background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #06B6D4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em'
            }}>
              SHUATSPHERE
            </h1>
            <p style={{ margin: '5px 0', fontSize: '16px', color: '#94A3B8' }}>
              PARALLEL UNIVERSE OF REDDIT
            </p>
            <p style={{ margin: 0, fontSize: '14px', color: '#10B981' }}>
              Shuats people here.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginTop: '30px'
        }}>
          {['builder', 'spherelings', 'desi'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '12px 24px',
                background: view === v ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(100, 116, 139, 0.2)',
                border: 'none',
                borderRadius: '8px',
                color: '#FFF',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'uppercase',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
            >
              {v === 'builder' ? '🎨 Builder' : v === 'spherelings' ? '✨ Spherelings' : '🪔 Desi Edition'}
            </button>
          ))}
        </div>
      </div>

      {/* Builder View */}
      {view === 'builder' && (
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '40px'
        }}>
          {/* Controls */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '16px',
            padding: '30px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <h2 style={{ marginTop: 0, color: '#8B5CF6', fontSize: '24px' }}>Customize Your Sphereling</h2>

            {/* Base */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#A78BFA' }}>Base</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['boy', 'girl'].map(b => (
                  <button
                    key={b}
                    onClick={() => setSelectedBase(b)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: selectedBase === b ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(71, 85, 105, 0.3)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#FFF',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      fontWeight: '600'
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Head Style */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#A78BFA' }}>Head Style</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {Object.keys(avatarParts.heads).map(h => (
                  <button
                    key={h}
                    onClick={() => setSelectedHead(h)}
                    style={{
                      padding: '10px',
                      background: selectedHead === h ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(71, 85, 105, 0.3)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#FFF',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textTransform: 'capitalize',
                      fontWeight: '500'
                    }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Hairstyle */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#A78BFA' }}>Hairstyle</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {Object.keys(avatarParts.hairstyles).map(h => (
                  <button
                    key={h}
                    onClick={() => setSelectedHair(h)}
                    style={{
                      padding: '10px',
                      background: selectedHair === h ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(71, 85, 105, 0.3)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#FFF',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textTransform: 'capitalize',
                      fontWeight: '500'
                    }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Eyes */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#A78BFA' }}>Eyes</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {Object.keys(avatarParts.eyes).map(e => (
                  <button
                    key={e}
                    onClick={() => setSelectedEyes(e)}
                    style={{
                      padding: '10px',
                      background: selectedEyes === e ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(71, 85, 105, 0.3)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#FFF',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textTransform: 'capitalize',
                      fontWeight: '500'
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Mouth */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#A78BFA' }}>Mouth</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {Object.keys(avatarParts.mouths).map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedMouth(m)}
                    style={{
                      padding: '10px',
                      background: selectedMouth === m ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(71, 85, 105, 0.3)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#FFF',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textTransform: 'capitalize',
                      fontWeight: '500'
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Outfit */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#A78BFA' }}>Outfit</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {Object.keys(avatarParts.outfits).map(o => (
                  <button
                    key={o}
                    onClick={() => setSelectedOutfit(o)}
                    style={{
                      padding: '10px',
                      background: selectedOutfit === o ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(71, 85, 105, 0.3)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#FFF',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textTransform: 'capitalize',
                      fontWeight: '500'
                    }}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessory */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#A78BFA' }}>Accessory</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {Object.keys(avatarParts.accessories).map(a => (
                  <button
                    key={a}
                    onClick={() => setSelectedAccessory(a)}
                    style={{
                      padding: '10px',
                      background: selectedAccessory === a ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(71, 85, 105, 0.3)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#FFF',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textTransform: 'capitalize',
                      fontWeight: '500'
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Pose */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#A78BFA' }}>Pose</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {Object.keys(avatarParts.poses).map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPose(p)}
                    style={{
                      padding: '10px',
                      background: selectedPose === p ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : 'rgba(71, 85, 105, 0.3)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#FFF',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textTransform: 'capitalize',
                      fontWeight: '500'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#A78BFA' }}>Primary Color</label>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={{
                    width: '100%',
                    height: '50px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#A78BFA' }}>Secondary Color</label>
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  style={{
                    width: '100%',
                    height: '50px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '16px',
              padding: '30px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ marginTop: 0, color: '#8B5CF6', fontSize: '20px', marginBottom: '20px' }}>Preview</h3>
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
                  borderRadius: '12px',
                  padding: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
                dangerouslySetInnerHTML={{ __html: generateAvatar() }}
              />
              <button
                onClick={() => downloadAvatar(generateAvatar(), 'my-sphereling')}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFF',
                  fontWeight: '700',
                  fontSize: '16px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                ⬇️ Download SVG
              </button>

              {/* Usage Instructions */}
              <div style={{
                marginTop: '30px',
                padding: '20px',
                background: 'rgba(6, 182, 212, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(6, 182, 212, 0.3)'
              }}>
                <h4 style={{ marginTop: 0, color: '#06B6D4', fontSize: '16px' }}>How to Use</h4>
                <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#94A3B8', lineHeight: '1.8' }}>
                  <li>Download your custom SVG</li>
                  <li>Import in React: <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>{'<img src="avatar.svg" />'}</code></li>
                  <li>Or use inline in components</li>
                  <li>Customize colors via CSS variables</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spherelings View */}
      {view === 'spherelings' && (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', color: '#8B5CF6', fontSize: '32px', marginBottom: '40px' }}>
            ✨ SPHERELING AVATAR BUNDLE ✨
          </h2>
          <p style={{ textAlign: 'center', color: '#94A3B8', marginBottom: '40px', fontSize: '16px' }}>
            Cosmic beings from a parallel universe where curiosity, connection and community drive everything.
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px'
          }}>
            {spherelings.map((s, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  transition: 'transform 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                onClick={() => downloadAvatar(
                  generateAvatar({
                    head: s.head,
                    hair: s.hair,
                    eyes: s.eyes,
                    mouth: s.mouth,
                    outfit: s.outfit,
                    primaryColor: s.colors[0],
                    secondaryColor: s.colors[1]
                  }),
                  s.name.toLowerCase()
                )}
              >
                <div
                  style={{
                    width: '140px',
                    height: '140px',
                    margin: '0 auto 15px',
                    background: `linear-gradient(135deg, ${s.colors[0]}15, ${s.colors[1]}15)`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: generateAvatar({
                      head: s.head,
                      hair: s.hair,
                      eyes: s.eyes,
                      mouth: s.mouth,
                      outfit: s.outfit,
                      primaryColor: s.colors[0],
                      secondaryColor: s.colors[1]
                    })
                  }}
                />
                <h4 style={{ margin: '0 0 5px 0', color: s.colors[0], fontSize: '16px', fontWeight: '700' }}>
                  {(i + 1).toString().padStart(2, '0')}. {s.name}
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Click to download</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Desi Edition View */}
      {view === 'desi' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#F59E0B', fontSize: '32px', marginBottom: '15px' }}>
            🪔 DESI EDITION 🪔
          </h2>
          <p style={{ color: '#10B981', fontSize: '24px', marginBottom: '10px', fontWeight: '600' }}>
            शुआट्स पीपल यहाँ।
          </p>
          <p style={{ color: '#94A3B8', fontSize: '18px', marginBottom: '40px' }}>
            DESI. DIVERSE. LIMITLESS.
          </p>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '16px',
            padding: '40px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(245, 158, 11, 0.3)'
          }}>
            <h3 style={{ color: '#F59E0B', fontSize: '24px', marginBottom: '30px' }}>
              Proudly Indian. Proudly Desi. Proudly Unique.
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px',
              marginBottom: '40px'
            }}>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ color: '#06B6D4', fontSize: '18px', marginBottom: '10px' }}>🏛️ Made for Shuats</h4>
                <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
                  A community by Shuats, for Shuats. Built with pride for the next generation of Indian communities.
                </p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ color: '#10B981', fontSize: '18px', marginBottom: '10px' }}>🌏 Indian & Desi Vibes</h4>
                <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
                  Celebrate diverse skin tones, traditional outfits, cultural accessories - from turbans to bindis.
                </p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ color: '#EC4899', fontSize: '18px', marginBottom: '10px' }}>💚 Community First</h4>
                <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
                  Connect. Share. Grow together. Diverse avatars for every Shuatian across India.
                </p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ color: '#8B5CF6', fontSize: '18px', marginBottom: '10px' }}>❤️ Everyone Belongs</h4>
                <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
                  Diverse avatars representing every identity, every background, every beautiful face of India.
                </p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ color: '#F59E0B', fontSize: '18px', marginBottom: '10px' }}>∞ Endless Possibilities</h4>
                <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
                  Mix, match & express your unique parallel self with thousands of combinations.
                </p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ color: '#0EA5E9', fontSize: '18px', marginBottom: '10px' }}>⚡ Future Ready</h4>
                <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6' }}>
                  Built for the next-gen of campus communities and beyond. The parallel universe starts here.
                </p>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(16, 185, 129, 0.1))',
              borderRadius: '12px',
              padding: '30px',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <h4 style={{ color: '#F59E0B', fontSize: '20px', marginBottom: '15px' }}>🎨 Desi Features Include:</h4>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                textAlign: 'left'
              }}>
                <li style={{ color: '#94A3B8', fontSize: '14px' }}>✓ 7 diverse skin tones</li>
                <li style={{ color: '#94A3B8', fontSize: '14px' }}>✓ Traditional hairstyles</li>
                <li style={{ color: '#94A3B8', fontSize: '14px' }}>✓ Kurtas, saris, ethnic wear</li>
                <li style={{ color: '#94A3B8', fontSize: '14px' }}>✓ Turbans & head coverings</li>
                <li style={{ color: '#94A3B8', fontSize: '14px' }}>✓ Bindis & traditional jewelry</li>
                <li style={{ color: '#94A3B8', fontSize: '14px' }}>✓ Cultural accessories</li>
                <li style={{ color: '#94A3B8', fontSize: '14px' }}>✓ Books, graduation caps</li>
                <li style={{ color: '#94A3B8', fontSize: '14px' }}>✓ Cricket gear & sports</li>
              </ul>
            </div>

            <p style={{
              marginTop: '30px',
              color: '#10B981',
              fontSize: '16px',
              fontWeight: '600',
              fontStyle: 'italic'
            }}>
              "A parallel universe vibe that feels fresh & unique. Familiar spirit, completely new universe."
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        marginTop: '60px',
        textAlign: 'center',
        padding: '30px',
        background: 'rgba(15, 23, 42, 0.4)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ color: '#8B5CF6', fontSize: '20px', marginBottom: '15px' }}>Implementation Guide</h3>
        <div style={{
          textAlign: 'left',
          maxWidth: '800px',
          margin: '0 auto',
          color: '#94A3B8',
          fontSize: '14px',
          lineHeight: '1.8'
        }}>
          <p><strong style={{ color: '#06B6D4' }}>📁 File Structure:</strong></p>
          <pre style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '15px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '12px'
          }}>{`/avatars
  /bases        ← boy.svg, girl.svg
  /heads        ← classic.svg, round.svg, etc.
  /hairstyles   ← messy.svg, quiff.svg, etc.
  /eyes         ← happy.svg, normal.svg, etc.
  /mouths       ← smile.svg, laugh.svg, etc.
  /outfits      ← hoodie.svg, jacket.svg, etc.
  /accessories  ← glasses.svg, mask.svg, etc.
  /poses        ← standing.svg, waving.svg, etc.
  /spherelings  ← nova.svg, orbit.svg, etc. (pre-made)
  /desi-edition ← desi-specific variations`}</pre>

          <p style={{ marginTop: '20px' }}><strong style={{ color: '#06B6D4' }}>🔧 Usage in Your App:</strong></p>
          <pre style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '15px',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '12px'
          }}>{`// React Component
import AvatarBuilder from './AvatarBuilder';

// Use pre-made Sphereling
<img src="/avatars/spherelings/nova.svg" alt="Nova" />

// Or build custom
<AvatarBuilder 
  base="boy"
  head="classic"
  hair="messy"
  eyes="happy"
  primaryColor="#8B5CF6"
/>

// Save user preferences
const userAvatar = {
  base: 'girl',
  parts: { head: 'round', hair: 'pigtails', ... },
  colors: { primary: '#EC4899', secondary: '#8B5CF6' }
};`}</pre>

          <p style={{ marginTop: '20px' }}><strong style={{ color: '#06B6D4' }}>💡 Tips:</strong></p>
          <ul style={{ paddingLeft: '20px' }}>
            <li>All SVG files are optimized and use CSS variables for theming</li>
            <li>Mix and match any parts - they're all compatible</li>
            <li>Store user selections in database/localStorage</li>
            <li>Use the builder component to let users create their Sphereling</li>
            <li>Pre-made Spherelings are great for quick onboarding</li>
            <li>Desi Edition includes culturally representative options</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShuatSphereAvatarSystem;
