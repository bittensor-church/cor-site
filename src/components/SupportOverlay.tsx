import { useEffect } from 'react'
import { SocialIconRow } from './SocialIcons'
import { fadeIn } from '../utils/animations'
import { BASE_FONT } from '../utils/styles'

const BELL_STYLE_ID = 'bell-ring-keyframes'

function useBellAnimation() {
  useEffect(() => {
    if (document.getElementById(BELL_STYLE_ID)) return
    const style = document.createElement('style')
    style.id = BELL_STYLE_ID
    style.textContent = [
      '@keyframes bellRing {',
      '  0%, 100% { transform: rotate(0deg); }',
      '  5% { transform: rotate(14deg); }',
      '  10% { transform: rotate(-12deg); }',
      '  15% { transform: rotate(10deg); }',
      '  20% { transform: rotate(-8deg); }',
      '  25% { transform: rotate(4deg); }',
      '  30% { transform: rotate(0deg); }',
      '}',
    ].join('\n')
    document.head.appendChild(style)
    return () => { style.remove() }
  }, [])
}

interface SupportOverlayProps {
  progress: number
}

const ENTER = 0.9695   // frame 2100
const EXIT = 1.0       // frame 2166


export function SupportOverlay({ progress }: SupportOverlayProps) {
  useBellAnimation()

  if (progress < ENTER || progress > EXIT) return null

  const local = (progress - ENTER) / (EXIT - ENTER)

  const titleOp = fadeIn(local, 0.0, 0.10)
  const walletOp = fadeIn(local, 0.06, 0.10)
  const linksOp = fadeIn(local, 0.12, 0.10)

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      zIndex: 5,
      padding: '0 clamp(16px, 5vw, 8%)',
    }}>
      <div style={{
        background: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)',
        borderRadius: 12,
        padding: 'clamp(20px, 4vh, 40px) clamp(24px, 4vw, 48px)',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: 'clamp(16px, 3vh, 32px)',
        opacity: titleOp,
        transition: 'opacity 0.3s ease',
      }}>
        {/* Support us */}
        <div style={{
          ...BASE_FONT,
          opacity: titleOp,
          transform: `translateY(${(1 - titleOp) * 12}px)`,
          fontSize: 'clamp(28px, 4.5vw, 56px)',
          fontWeight: 600,
          color: '#d4a843',
          letterSpacing: 'clamp(4px, 0.8vw, 10px)',
          textTransform: 'uppercase',
          textAlign: 'center',
          willChange: 'opacity, transform',
        }}>
          Support us
        </div>

        {/* Description */}
        <div style={{
          ...BASE_FONT,
          opacity: walletOp,
          transform: `translateY(${(1 - walletOp) * 10}px)`,
          fontSize: 'clamp(12px, 1.4vw, 20px)',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.7)',
          letterSpacing: 'clamp(1px, 0.15vw, 2px)',
          textAlign: 'center',
          lineHeight: 1.6,
          maxWidth: 'clamp(300px, 60vw, 700px)',
          willChange: 'opacity, transform',
        }}>
          Your contributions directly fund protocol development,<br />
          infrastructure maintenance, and open-source tools<br />
          for the Bittensor ecosystem.
        </div>

        {/* Wallet address */}
        <div style={{
          ...BASE_FONT,
          opacity: linksOp,
          transform: `translateY(${(1 - linksOp) * 10}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          willChange: 'opacity, transform',
        }}>
          <div style={{
            fontSize: 'clamp(9px, 1vw, 13px)',
            fontWeight: 300,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: '#d4a843',
          }}>
            TAO Wallet
          </div>
          <a
            href="https://x.taostats.io/account/5CovTPBh8JyYZBshs2WpNtnDghDB8Wacd1F2sFdXPsRy3Rzz"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 'clamp(10px, 1.2vw, 16px)',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.75)',
              letterSpacing: 'clamp(1px, 0.15vw, 2px)',
              wordBreak: 'break-all',
              maxWidth: 'clamp(300px, 60vw, 700px)',
              textAlign: 'center',
              pointerEvents: 'auto',
              textDecoration: 'none',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a843' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)' }}
          >
            5CovTPBh8JyYZBshs2WpNtnDghDB8Wacd1F2sFdXPsRy3Rzz
          </a>
        </div>

        {/* Social links */}
        <div style={{
          opacity: linksOp,
          transform: `translateY(${(1 - linksOp) * 10}px)`,
          willChange: 'opacity, transform',
          pointerEvents: 'auto',
        }}>
          <SocialIconRow size={20} gap="clamp(12px, 2vw, 24px)" />
        </div>

        {/* OpenDev CTA — below socials */}
        <a
          href="https://discord.gg/bittensor"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...BASE_FONT,
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(6px, 0.8vw, 10px)',
            textDecoration: 'none',
            pointerEvents: 'auto',
            opacity: linksOp,
            transform: `translateY(${(1 - linksOp) * 8}px)`,
            willChange: 'opacity, transform',
            color: 'rgba(255, 255, 255, 0.45)',
            transition: 'color 0.3s',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: 'clamp(12px, 2vh, 20px)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#d4a843' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.45)' }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{
              width: 'clamp(14px, 1.5vw, 20px)',
              height: 'clamp(14px, 1.5vw, 20px)',
              animation: 'bellRing 4s ease-in-out infinite',
              transformOrigin: 'top center',
              flexShrink: 0,
            }}
          >
            <path d="M12 2C7.58 2 4 5.58 4 10v4.17L2.29 15.88A1 1 0 003 17.5h18a1 1 0 00.71-1.62L20 14.17V10c0-4.42-3.58-8-8-8zm0 20a2.5 2.5 0 002.5-2.5h-5A2.5 2.5 0 0012 22z" />
          </svg>
          <span style={{
            fontSize: 'clamp(12px, 0.9vw, 14px)',
            letterSpacing: 'clamp(0.5px, 0.1vw, 1px)',
            lineHeight: 1.3,
          }}>
            Bring your ideas to OpenDev calls on Discord
          </span>
          <span style={{
            fontSize: 'clamp(11px, 0.75vw, 12px)',
            letterSpacing: 'clamp(0.5px, 0.1vw, 1.5px)',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}>
            Tue 17:00 UTC
          </span>
        </a>
      </div>
    </div>
  )
}
