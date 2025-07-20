'use client';

import { SymbolSwitcherProps } from '../../types/charts';

export default function SymbolSwitcher({ symbols, currentSymbolIndex, onSymbolChange }: SymbolSwitcherProps) {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000 }}>
      {symbols.map((symbol, index) => (
        <button
          key={symbol.name}
          onClick={() => onSymbolChange(index)}
          style={{
            marginRight: '10px',
            padding: '5px 10px',
            background: currentSymbolIndex === index ? '#26a69a' : '#363C4E',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {symbol.name}
        </button>
      ))}
    </div>
  );
}