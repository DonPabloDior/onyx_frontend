import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal, ModalFooter } from '@/shared/ui/modal'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { useUpdateCustomer } from '@/entities/customer'
import type { CustomerOut } from '@/shared/types/api'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function EditCustomerModal({ customer, onClose }: { customer: CustomerOut; onClose: () => void }) {
  const { mutate: update, isPending } = useUpdateCustomer()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: customer.name,
      email: customer.email ?? '',
      phone: customer.phone ?? '',
      company: customer.company ?? '',
    },
  })

  function onSubmit(data: FormData) {
    update(
      { id: customer.id, data: { name: data.name, email: data.email || undefined, phone: data.phone || undefined, company: data.company || undefined } },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal open onClose={onClose} title="Edit customer" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Full name" error={errors.name?.message} fullWidth {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} fullWidth {...register('email')} />
          <Input label="Phone" type="tel" fullWidth {...register('phone')} />
          <Input label="Company" fullWidth {...register('company')} />
        </div>
        <ModalFooter>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="blue" type="submit" loading={isPending}>Save changes</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
