import styled from 'styled-components'

interface Option<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (value: T) => void
}


const Track = styled.div`
  display: inline-flex;
  gap: 2px;
  background: #0b0b0b;
  border-radius: ${({ theme }) => theme.radius.pill};
  padding: 4px;
  box-shadow:
    inset 0 0 0 1px ${({ theme }) => theme.stroke.subtle},
    inset 0 2px 8px rgba(0, 0, 0, 0.6);
`

const Segment = styled.button<{ $active: boolean }>`
  height: 28px;
  padding: 0 14px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 13.5px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  border: none;
  background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#0a0a0a' : '#a6a6a6')};

  transition:
    background ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.ease},
    color ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.ease};

  &:hover:not(:disabled) {
    color: ${({ $active }) => ($active ? '#0a0a0a' : '#fff')};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent.blue};
    outline-offset: 2px;
  }
`


export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <Track role="group">
      {options.map((opt) => (
        <Segment
          key={opt.value}
          $active={opt.value === value}
          onClick={() => onChange(opt.value)}
          aria-pressed={opt.value === value}
        >
          {opt.label}
        </Segment>
      ))}
    </Track>
  )
}
