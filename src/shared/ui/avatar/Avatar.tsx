import styled from 'styled-components'
import { getInitials } from '@/shared/lib/format'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  name: string
  src?: string | null
  size?: AvatarSize
  className?: string
}

const sizeMap = { sm: '28px', md: '36px', lg: '48px' }
const fontSizeMap = { sm: '11px', md: '13px', lg: '16px' }

// deterministic gradient from name
function nameToGradient(name: string): string {
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360
  return `linear-gradient(135deg, hsl(${hue}, 60%, 35%) 0%, hsl(${(hue + 40) % 360}, 55%, 25%) 100%)`
}

const StyledAvatar = styled.div<{ $size: AvatarSize; $gradient: string }>`
  width: ${({ $size }) => sizeMap[$size]};
  height: ${({ $size }) => sizeMap[$size]};
  border-radius: 50%;
  background: ${({ $gradient }) => $gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $size }) => fontSizeMap[$size]};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <StyledAvatar $size={size} $gradient={nameToGradient(name)} className={className} aria-label={name}>
      {src ? <AvatarImg src={src} alt={name} /> : getInitials(name)}
    </StyledAvatar>
  )
}
