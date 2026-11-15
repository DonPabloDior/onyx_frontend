import styled from 'styled-components'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  fullWidth?: boolean
}

const Wrapper = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
`

const Label = styled.label`
  font-size: 13px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.secondary};
`

const Trigger = styled.button<{ $open: boolean; $hasError: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  background: ${({ theme }) => theme.surface.s1};
  border-radius: ${({ theme }) => theme.radius.pill};
  box-shadow: ${({ theme }) => theme.shadow.well};
  border: 1px solid
    ${({ $hasError, $open, theme }) =>
      $hasError ? theme.accent.red : $open ? theme.accent.blue : 'transparent'};
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  font-family: ${({ theme }) => theme.font.sans};
  cursor: pointer;
  transition:
    border-color ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.ease},
    box-shadow ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.ease};
  width: 100%;

  ${({ $open }) =>
    $open &&
    `box-shadow: inset 0 1px 3px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 3px rgba(79, 141, 240, 0.15);`}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent.blue};
    outline-offset: 2px;
  }
`

const TriggerText = styled.span<{ $placeholder: boolean }>`
  flex: 1;
  text-align: left;
  color: ${({ $placeholder, theme }) =>
    $placeholder ? theme.text.ghost : theme.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ChevronIcon = styled(ChevronDown)<{ $open: boolean }>`
  flex-shrink: 0;
  color: ${({ theme }) => theme.text.tertiary};
  transition: transform ${({ theme }) => theme.motion.base} ${({ theme }) => theme.motion.ease};
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
`

const DropdownMenu = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 100;
  background: ${({ theme }) => theme.surface.s2};
  border: 1px solid ${({ theme }) => theme.stroke.default};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.pop};
  padding: 6px;
  list-style: none;
  max-height: 280px;
  overflow-y: auto;
`

const DropdownItem = styled.li<{ $active: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  color: ${({ $disabled, theme }) =>
    $disabled ? theme.text.ghost : theme.text.primary};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  background: ${({ $active, theme }) => ($active ? theme.surface.s3 : 'transparent')};
  transition: background ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};

  &:hover {
    background: ${({ $disabled, theme }) => (!$disabled ? theme.surface.s3 : undefined)};
  }
`

const ErrorText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.accent.red};
`

export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select...',
  error,
  disabled = false,
  fullWidth = false,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(opt: SelectOption) {
    if (opt.disabled) return
    onChange(opt.value)
    setOpen(false)
  }

  return (
    <Wrapper $fullWidth={fullWidth} ref={wrapperRef}>
      {label && <Label>{label}</Label>}
      <Trigger
        type="button"
        $open={open}
        $hasError={!!error}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <TriggerText $placeholder={!selectedOption}>
          {selectedOption?.label ?? placeholder}
        </TriggerText>
        <ChevronIcon $open={open} size={16} />
      </Trigger>
      {open && (
        <DropdownMenu role="listbox">
          {options.map((opt) => (
            <DropdownItem
              key={opt.value}
              $active={opt.value === value}
              $disabled={!!opt.disabled}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
              {opt.value === value && <Check size={14} />}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </Wrapper>
  )
}
