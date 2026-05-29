import React from 'react';
import { MoveRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ScheduleCTA: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative z-10 bg-black pt-0 pb-20 px-4 -mt-px">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-12">
        <p className="text-4xl md:text-6xl font-bold text-white text-center font-serif italic tracking-tight">
          No Excuses! It’s your move
        </p>
        
        <button className="w-full sm:w-auto px-8 md:px-16 py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-lg md:text-xl shadow-2xl shadow-pink-500/20 transition-all duration-500 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group"
        onClick={() => navigate('/livefitinquiry')}>
          Start your 3-day free trial
          <MoveRight className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ScheduleCTA;
