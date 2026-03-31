import { useState } from 'react'
import { BASE_FONT } from '../utils/styles'

interface TooltipItem {
  label: string
  amount: string
}

interface InfoTooltipProps {
  items: TooltipItem[]
  isMobile: boolean
}

export function InfoTooltip({ items, isMobile }: InfoTooltipProps) {
  const [open, setOpen] = useState(false)

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: 8 }}>
      {/* (i) icon */}
      <span
        role="button"
        aria-label="Show breakdown"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'clamp(16px, 1.8vw, 22px)',
          height: 'clamp(16px, 1.8vw, 22px)',
          borderRadius: '50%',
          border: '1px solid rgba(212, 168, 67, 0.4)',
          color: '#d4a843',
          fontSize: 'clamp(10px, 1vw, 13px)',
          fontStyle: 'italic',
          fontWeight: 400,
          cursor: 'pointer',
          pointerEvents: 'auto',
          transition: 'border-color 0.2s, background 0.2s',
          background: open ? 'rgba(212, 168, 67, 0.12)' : 'transparent',
          lineHeight: 1,
        }}
        onMouseEnter={isMobile ? undefined : () => setOpen(true)}
        onMouseLeave={isMobile ? undefined : () => setOpen(false)}
        onClick={isMobile ? () => setOpen(prev => !prev) : undefined}
      >
        i
      </span>

      {/* Mobile backdrop */}
      {open && isMobile && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9, background: 'transparent' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Tooltip card */}
      {open && (
        <div
          style={{
            ...BASE_FONT,
            position: 'absolute',
            bottom: '100%',
            marginBottom: 8,
            ...(isMobile ? { right: 0 } : { left: '50%', transform: 'translateX(-50%)' }),
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 8,
            border: '1px solid rgba(212, 168, 67, 0.25)',
            padding: 'clamp(10px, 1.5vh, 16px) clamp(14px, 2vw, 20px)',
            whiteSpace: 'nowrap',
            zIndex: 10,
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column' as const,
            gap: 4,
          }}
          onMouseEnter={isMobile ? undefined : () => setOpen(true)}
          onMouseLeave={isMobile ? undefined : () => setOpen(false)}
        >
          {items.map(item => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 'clamp(12px, 2vw, 24px)',
                fontSize: 'clamp(11px, 1.2vw, 14px)',
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: 'rgba(255, 255, 255, 0.85)', fontWeight: 400 }}>
                {item.label}
              </span>
              <span style={{ color: '#d4a843', fontWeight: 500 }}>
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      )}
    </span>
  )
}
