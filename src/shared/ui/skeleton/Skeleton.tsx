import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

export const Skeleton = styled.div<SkeletonProps>`
  width: ${({ width }) => width ?? '100%'};
  height: ${({ height }) => height ?? '16px'};
  border-radius: ${({ borderRadius, theme }) => borderRadius ?? theme.radius.sm};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.surface.s1} 0%,
    ${({ theme }) => theme.surface.s2} 50%,
    ${({ theme }) => theme.surface.s1} 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s ease-in-out infinite;
  flex-shrink: 0;
`

export const SkeletonText = styled(Skeleton)`
  height: 14px;
`

export const SkeletonTitle = styled(Skeleton)`
  height: 20px;
  width: 60%;
`

export const SkeletonCircle = styled(Skeleton)<{ size?: string }>`
  width: ${({ size }) => size ?? '40px'};
  height: ${({ size }) => size ?? '40px'};
  border-radius: 50%;
`
