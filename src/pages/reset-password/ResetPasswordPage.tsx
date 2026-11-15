import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styled from 'styled-components'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { useResetPassword } from '@/features/authentication'

const schema = z.object({
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormData = z.infer<typeof schema>

const Title = styled.h2`
  font-size: 24px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 8px;
  letter-spacing: -0.01em;
`
const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-bottom: 28px;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const { mutate, isPending } = useResetPassword()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <>
      <Title>New password</Title>
      <Subtitle>Enter your new password below.</Subtitle>
      <Form onSubmit={handleSubmit(d => mutate({ token, new_password: d.new_password }))} noValidate>
        <Input
          label="New password"
          type="password"
          placeholder="Min. 8 characters"
          error={errors.new_password?.message}
          fullWidth
          {...register('new_password')}
        />
        <Button type="submit" variant="primary" size="lg" loading={isPending} fullWidth style={{ marginTop: 8 }}>
          Set new password
        </Button>
      </Form>
    </>
  )
}
