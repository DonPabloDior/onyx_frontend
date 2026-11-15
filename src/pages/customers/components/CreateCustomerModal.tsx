import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, ModalFooter } from '@/shared/ui/modal'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { useCreateCustomer } from '@/entities/customer'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function CreateCustomerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { mutate: create, isPending } = useCreateCustomer()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: FormData) {
    create(
      {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        company: data.company || undefined,
      },
      { onSuccess: () => { reset(); onClose() } }
    )
  }

  return (
    <Modal open={open} onClose={onClose} title="New customer" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Full name" placeholder="Leonard Kim" error={errors.name?.message} fullWidth {...register('name')} />
          <Input label="Email" type="email" placeholder="leonard@example.com" error={errors.email?.message} fullWidth {...register('email')} />
          <Input label="Phone" type="tel" placeholder="+1 555 0100" fullWidth {...register('phone')} />
          <Input label="Company" placeholder="Kim Studio" fullWidth {...register('company')} />
        </div>
        <ModalFooter>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="blue" type="submit" loading={isPending}>Create customer</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
