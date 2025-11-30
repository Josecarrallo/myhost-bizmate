import React from 'react';

const ModuleGridCard = ({ icon: Icon, title, gradient, onClick }) => (
  <button
    onClick={onClick}
    className="group relative w-full aspect-square max-w-[140px] bg-orange-300/40 backdrop-blur-sm rounded-2xl p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center gap-2 sm:gap-3 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-orange-200/50 hover:border-white/50 overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
    <div className={`relative p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
    </div>
    <h3 className="relative text-xs sm:text-sm md:text-base font-bold text-white text-center leading-tight px-1 drop-shadow-lg">{title}</h3>
  </button>
);

export default ModuleGridCard;
