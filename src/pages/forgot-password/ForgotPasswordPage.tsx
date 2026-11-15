import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styled from 'styled-components'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { useForgotPassword } from '@/features/authentication'

const schema = z.object({ email: z.string().email('Invalid email') })
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
const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};
  margin-top: 20px;

  &:hover { color: ${({ theme }) => theme.text.secondary}; }
`
const SuccessBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 32px 0;
`

export default function ForgotPasswordPage() {
  const { mutate, isPending, isSuccess } = useForgotPassword()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (isSuccess) {
    return (
      <SuccessBox>
        <CheckCircle2 size={40} color="var(--green)" />
        <Title style={{ fontSize: 20, marginBottom: 0 }}>Check your email</Title>
        <Subtitle style={{ marginBottom: 0 }}>
          We've sent a password reset link to your email address.
        </Subtitle>
        <BackLink to="/login"><ArrowLeft size={14} /> Back to sign in</BackLink>
      </SuccessBox>
    )
  }

  return (
    <>
      <Title>Reset password</Title>
      <Subtitle>Enter your email and we'll send you a reset link.</Subtitle>
      <Form onSubmit={handleSubmit(d => mutate(d.email))} noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          fullWidth
          {...register('email')}
        />
        <Button type="submit" variant="primary" size="lg" loading={isPending} fullWidth style={{ marginTop: 8 }}>
          Send reset link
        </Button>
      </Form>
      <BackLink to="/login"><ArrowLeft size={14} /> Back to sign in</BackLink>
    </>
  )
}
