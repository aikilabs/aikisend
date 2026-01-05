import React from 'react'

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 grid place-content-center bg-primary-light/90 backdrop-blur-sm">
      <div role="status" className="flex flex-col items-center gap-6">
        {/* Pulsing dots loader */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-bounce bg-primary-dark [animation-delay:-0.3s]"></div>
          <div className="h-4 w-4 animate-bounce bg-accent [animation-delay:-0.15s]"></div>
          <div className="h-4 w-4 animate-bounce bg-primary-dark"></div>
        </div>
        <span className="font-mono text-base font-bold tracking-wider text-primary-dark">
          LOADING
        </span>
      </div>
    </div>
  );
}

export default Loading