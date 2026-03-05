interface SocialLink {
  readonly href: string
  readonly label: string
  readonly iconPath: string
  readonly viewBox?: string
}

const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    href: 'https://x.com/churchofrao',
    label: 'X / Twitter',
    iconPath: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    href: 'https://github.com/bittensor-church',
    label: 'GitHub',
    iconPath: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
  },
  {
    href: 'https://discord.gg/bittensor',
    label: 'Discord',
    iconPath: 'M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
  },
  {
    href: 'https://forum.bittensor.church/',
    label: 'Forum',
    iconPath: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  },
]

interface SocialIconRowProps {
  readonly size?: number
  readonly gap?: string
  readonly iconColor?: string
  readonly hoverColor?: string
  readonly showBorder?: boolean
}

export function SocialIconRow({
  size = 20,
  gap = 'clamp(12px, 2vw, 24px)',
  iconColor = 'rgba(255, 255, 255, 0.6)',
  hoverColor = '#d4a843',
  showBorder = true,
}: SocialIconRowProps) {
  const btnSize = size + 16

  return (
    <div style={{
      display: 'flex',
      gap,
      alignItems: 'center',
    }}>
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={link.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: btnSize,
            height: btnSize,
            borderRadius: '50%',
            border: showBorder ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
            color: iconColor,
            transition: 'color 0.3s, border-color 0.3s, background 0.3s',
            background: 'transparent',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = hoverColor
            if (showBorder) {
              e.currentTarget.style.borderColor = hoverColor
              e.currentTarget.style.background = 'rgba(212, 168, 67, 0.1)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = iconColor
            if (showBorder) {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.background = 'transparent'
            }
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={link.viewBox ?? '0 0 24 24'}
            fill="currentColor"
          >
            <path d={link.iconPath} />
          </svg>
        </a>
      ))}
    </div>
  )
}
