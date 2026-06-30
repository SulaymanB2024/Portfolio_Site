import { useRef, useEffect } from 'react';

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
  idx: number;
}

export default function CandlestickChart({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = 0;
    let height = 0;
    
    let candleWidth = 6;
    let spacing = 3;
    let panSpeed = 0.5; // pixels per frame
    let currentPan = 0; // total panned amount
    let frame = 0;

    const candles: Candle[] = [];
    let lastClose = 0;
    let maxPrice = 0;
    let minPrice = 0;

    let mouseX = -1;
    let mouseY = -1;

    const generateCandle = (idx: number, prevClose: number) => {
        const isUp = Math.random() > 0.45;
        const volatility = Math.random() * 20;
        const open = prevClose;
        let close = isUp ? open + volatility : open - volatility;

        const high = Math.max(open, close) + Math.random() * 10;
        const low = Math.min(open, close) - Math.random() * 10;

        return { open, close, high, low, idx };
    };

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      candleWidth = Math.max(4, width / 120);
      spacing = candleWidth * 0.5;
      
      candles.length = 0;
      lastClose = height / 2;
      
      const numCandles = Math.ceil(width / (candleWidth + spacing)) + 10;
      for (let i = 0; i < numCandles; i++) {
          const c = generateCandle(i, lastClose);
          candles.push(c);
          lastClose = c.close;
      }
      currentPan = 0;
    };

    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouseX = -1;
      mouseY = -1;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Smooth pan
      currentPan += panSpeed;
      
      // If we panned a full candle length, shift candles
      const step = candleWidth + spacing;
      if (currentPan > step) {
          currentPan -= step;
          candles.shift();
          const lastCandle = candles[candles.length - 1];
          const newCandle = generateCandle(lastCandle.idx + 1, lastCandle.close);
          candles.push(newCandle);
      }

      // Add smooth live movement to the last candle without frame-to-frame random shimmer.
      const lastCandle = candles[candles.length - 1];
      lastCandle.close += (Math.sin(frame * 0.045) + Math.sin(frame * 0.019)) * 0.18;
      if (lastCandle.close > lastCandle.high) lastCandle.high = lastCandle.close;
      if (lastCandle.close < lastCandle.low) lastCandle.low = lastCandle.close;

      // Find price range for scaling
      maxPrice = -Infinity;
      minPrice = Infinity;
      candles.forEach(c => {
          if (c.high > maxPrice) maxPrice = c.high;
          if (c.low < minPrice) minPrice = c.low;
      });
      const priceRange = Math.max(maxPrice - minPrice, 100);
      maxPrice += priceRange * 0.1;
      minPrice -= priceRange * 0.1;

      const scaleY = (p: number) => height - ((p - minPrice) / (maxPrice - minPrice)) * height;

      // Draw grid
      ctx.strokeStyle = 'rgba(241, 239, 232, 0.05)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      for (let i = 1; i <= 4; i++) {
         const y = height * (i / 5);
         ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
      ctx.setLineDash([]);

      let hoveredData: any = null;

      candles.forEach((c, i) => {
        const x = i * step - currentPan;
        if (x < -step || x > width) return;

        const isUp = c.close >= c.open;
        
        const scaledOpen = scaleY(c.open);
        const scaledClose = scaleY(c.close);
        const scaledHigh = scaleY(c.high);
        const scaledLow = scaleY(c.low);

        const bodyTop = Math.min(scaledOpen, scaledClose);
        const bodyBottom = Math.max(scaledOpen, scaledClose);
        let bodyHeight = bodyBottom - bodyTop;
        if (bodyHeight < 1) bodyHeight = 1;

        let isHovered = false;
        if (mouseX >= x && mouseX <= x + candleWidth) {
           isHovered = true;
           hoveredData = { ...c, x: x + candleWidth / 2, y: scaledClose };
        }

        const colorUp = isHovered ? '#FFFFFF' : 'rgba(241, 239, 232, 0.9)';
        const colorDown = isHovered ? 'rgba(241, 239, 232, 0.8)' : 'rgba(241, 239, 232, 0.3)';

        ctx.strokeStyle = isUp ? colorUp : colorDown;
        ctx.fillStyle = isUp ? colorUp : '#080807';
        ctx.lineWidth = 1;

        // Wick
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, scaledHigh);
        ctx.lineTo(x + candleWidth / 2, scaledLow);
        ctx.stroke();

        // Body
        if (isUp) {
            ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
            ctx.strokeRect(x, bodyTop, candleWidth, bodyHeight);
        } else {
            ctx.strokeRect(x, bodyTop, candleWidth, bodyHeight);
            ctx.fillStyle = '#080807'; // background to clear inside
            ctx.fillRect(x + 1, bodyTop + 1, candleWidth - 2, bodyHeight - 2);
        }

        if (isHovered) {
           // Highlight line
           ctx.strokeStyle = 'rgba(241, 239, 232, 0.3)';
           ctx.setLineDash([2, 5]);
           ctx.beginPath();
           ctx.moveTo(x + candleWidth / 2, 0);
           ctx.lineTo(x + candleWidth / 2, height);
           ctx.stroke();
           ctx.setLineDash([]);
        }
      });

      if (hoveredData && tooltipRef.current) {
          tooltipRef.current.style.opacity = '1';
          tooltipRef.current.style.left = `${hoveredData.x + 15}px`;
          
          // Keep tooltip on screen
          const yPos = hoveredData.y - 40;
          tooltipRef.current.style.top = `${yPos < 0 ? 10 : yPos}px`;
          
          tooltipRef.current.innerHTML = `
            <div class="font-mono text-[10px] text-canvas/80 leading-relaxed uppercase tracking-wider">
              <div class="flex justify-between gap-4"><span>O</span><span>${hoveredData.open.toFixed(2)}</span></div>
              <div class="flex justify-between gap-4"><span>H</span><span>${hoveredData.high.toFixed(2)}</span></div>
              <div class="flex justify-between gap-4"><span>L</span><span>${hoveredData.low.toFixed(2)}</span></div>
              <div class="flex justify-between gap-4"><span>C</span><span>${hoveredData.close.toFixed(2)}</span></div>
            </div>
          `;
      } else if (tooltipRef.current) {
          tooltipRef.current.style.opacity = '0';
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`w-full h-full relative group ${className}`}>
        <canvas ref={canvasRef} className="w-full h-full block mix-blend-screen pointer-events-auto" role="img" aria-label="Illustrative interactive candlestick chart for market-research presentation" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,#080807_120%)] mix-blend-multiply opacity-80"></div>
        <div 
          ref={tooltipRef} 
          className="absolute pointer-events-none opacity-0 bg-ink/90 border border-canvas/20 p-3 backdrop-blur-md transition-opacity duration-150 z-20 shadow-2xl"
        ></div>
    </div>
  );
}
