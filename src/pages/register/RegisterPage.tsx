import React from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styled from 'styled-components'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { useRegister } from '@/features/authentication'

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
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

export default function RegisterPage() {
  const { mutate: register, isPending } = useRegister()

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  function onSubmit(data: FormData) {
    register(data)
  }

  return (
    <>
      <Title>Create account</Title>
      <Subtitle>Start managing your finances with Onyx</Subtitle>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Full name"
          type="text"
          placeholder="John Smith"
          autoComplete="name"
          error={errors.full_name?.message}
          fullWidth
          {...formRegister('full_name')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          fullWidth
          {...formRegister('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          fullWidth
          {...formRegister('password')}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isPending}
          fullWidth
          style={{ marginTop: 8 }}
        >
          Create account
        </Button>
      </Form>

      <Footer>
        Already have an account?
        <Link to="/login">Sign in</Link>
      </Footer>
    </>
  )
}
