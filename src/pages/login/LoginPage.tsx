import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styled from 'styled-components'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Card } from '@/shared/ui/card'
import { useLogin } from '@/features/authentication'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
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

const Footer = styled.div`
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.text.tertiary};

  a {
    color: ${({ theme }) => theme.accent.blue};
    margin-left: 4px;
  }
`

const ForgotLink = styled(Link)`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
  text-align: right;
  display: block;
  width: fit-content;
  margin-top: 8px;
  &:hover {
    color: ${({ theme }) => theme.text.secondary};
  }
`

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  function onSubmit(data: FormData) {
    login(data)
  }

  return (
    <>
      <Title>Sign in</Title>
      <Subtitle>Welcome back to Onyx</Subtitle>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          fullWidth
          {...register('email')}
        />
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            fullWidth
            {...register('password')}
          />
          <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
            <ForgotLink to="/forgot-password">Forgot password?</ForgotLink>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isPending}
          fullWidth
          style={{ marginTop: 8 }}
        >
          Sign in
        </Button>
      </Form>

      <Footer>
        Don't have an account?
        <Link to="/register">Create one</Link>
      </Footer>
    </>
  )
}
