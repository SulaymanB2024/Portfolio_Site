let sharedCtx: AudioContext | null = null;
let isMuted = false;

if (typeof window !== 'undefined') {
  isMuted = localStorage.getItem('site-audio-muted') === 'true';
}

export const getMuted = () => isMuted;

export const setMuted = (muted: boolean) => {
  isMuted = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('site-audio-muted', String(muted));
  }
};

function getSharedContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  
  if (!sharedCtx) {
    sharedCtx = new AudioContextClass();
  }
  return sharedCtx;
}

export const resumeAudio = async () => {
  const ctx = getSharedContext();
  if (ctx && ctx.state === 'suspended') {
    await ctx.resume().catch(() => {});
  }
};

export const playClick = () => {
  if (isMuted) return;
  const ctx = getSharedContext();
  if (!ctx || ctx.state === 'suspended') return;
  
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, ctx.currentTime); // Low thump
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Fail silently if there's any audio context errors
  }
};

export const playSnap = () => {
  if (isMuted) return;
  const ctx = getSharedContext();
  if (!ctx || ctx.state === 'suspended') return;
  
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // Fail silently
  }
};
