import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

const HeroHeader = ({ currentMonth, theme }) => {
  const [showSvg, setShowSvg] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1250px)');
    const update = () => setShowSvg(mq.matches);

    update();

    if (mq.addEventListener) {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
  }, []);

  return (
    <div className={`relative h-[560px] md:h-[680px] overflow-hidden ${theme.overlay}`}>
      {showSvg && (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 450"
          preserveAspectRatio="none"
        >
          <defs>
            <clipPath id="calendar-picture-clip">
              <path d="
                M0,350
                C150,460 340,580 420,620
                C500,650 525,625 560,610
                L1300,100
                L1300,0
                L0,0
                Z
              " />
            </clipPath>
          </defs>

          <path
            d="
              M0,390
              C110,320 205,235 305,215
              C405,195 500,215 585,280
              C675,350 790,410 840,430
              C980,490 1090,390 1200,330
              L1200,450
              L0,450
              Z"
            fill="#ffffff"
            className={theme.overlay}
          />
        </svg>
      )}

      <img
        src={theme.image}
        alt="Calendar cover"
        className="absolute inset-0 h-full w-full object-fill"
        style={showSvg ? { clipPath: 'url(#calendar-picture-clip)' } : undefined}
      />

      <div className="absolute inset-0 bg-transparent" />

      <div className="absolute bottom-10 right-6 md:bottom-14 md:right-10 lg:bottom-30 lg:right-20 text-right">
        <div className="text-white/90 text-xl md:text-2xl lg:text-4xl font-light leading-none mb-1">
          {format(currentMonth, 'yyyy')}
        </div>
        <div className="text-white text-2xl md:text-3xl lg:text-6xl font-extrabold tracking-[0.06em] leading-none uppercase">
          {format(currentMonth, 'MMMM')}
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;
