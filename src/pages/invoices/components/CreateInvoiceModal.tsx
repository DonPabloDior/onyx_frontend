import React, { useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styled from 'styled-components'
import { Plus, Trash2 } from 'lucide-react'
import { Modal, ModalFooter } from '@/shared/ui/modal'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { useCreateInvoice } from '@/entities/invoice'
import { useCustomers } from '@/entities/customer'

const schema = z.object({
  customer_id: z.string().min(1, 'Customer is required'),
  due_date: z.string().min(1, 'Due date is required'),
  currency: z.string().min(1),
  items: z
    .array(
      z.object({
        description: z.string().min(1, 'Description is required'),
        quantity: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid quantity'),
        unit_price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price'),
      })
    )
    .min(1, 'At least one item is required'),
})

type FormData = z.infer<typeof schema>

const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 20px 0 10px;
`

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px 100px auto;
  gap: 8px;
  align-items: flex-end;
  margin-bottom: 8px;
`

const RemoveBtn = styled.button`
  width: 36px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.stroke.subtle};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: transparent;
  color: ${({ theme }) => theme.text.ghost};
  cursor: pointer;
  transition: all ${({ theme }) => theme.motion.fast} ${({ theme }) => theme.motion.ease};
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.status.error.dim};
    color: ${({ theme }) => theme.accent.red};
    border-color: ${({ theme }) => theme.status.error.line};
  }
`

const AddItemBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.accent.blue};
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  font-family: ${({ theme }) => theme.font.sans};
  margin-top: 4px;

  &:hover { color: ${({ theme }) => theme.accent.blueBright}; }
`

const ItemError = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.accent.red};
  margin-top: 4px;
`

interface Props {
  open: boolean
  onClose: () => void
}

export function CreateInvoiceModal({ open, onClose }: Props) {
  const { mutate: create, isPending } = useCreateInvoice()
  const { data: customersData } = useCustomers({ page_size: 100 })
  const customers = customersData?.data ?? []

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      currency: 'USD',
      items: [{ description: '', quantity: '1', unit_price: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  function onSubmit(data: FormData) {
    create(data, { onSuccess: onClose })
  }

  const customerOptions = customers.map((c) => ({ value: c.id, label: c.name }))
  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
  ]

  return (
    <Modal open={open} onClose={onClose} title="Create invoice" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 12 }}>
          <Controller
            name="customer_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Customer"
                options={[{ value: '', label: 'Select customer…' }, ...customerOptions]}
                value={field.value}
                onChange={field.onChange}
                error={errors.customer_id?.message}
                fullWidth
              />
            )}
          />
          <Input
            label="Due date"
            type="date"
            error={errors.due_date?.message}
            fullWidth
            {...register('due_date')}
          />
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select
                label="Currency"
                options={currencyOptions}
                value={field.value}
                onChange={field.onChange}
                fullWidth
              />
            )}
          />
        </div>

        <SectionLabel>Line items</SectionLabel>

        {fields.map((field, i) => (
          <ItemRow key={field.id}>
            <Input
              placeholder="Description"
              error={errors.items?.[i]?.description?.message}
              fullWidth
              {...register(`items.${i}.description`)}
            />
            <Input
              placeholder="Qty"
              type="number"
              min="0"
              step="0.01"
              error={errors.items?.[i]?.quantity?.message}
              fullWidth
              {...register(`items.${i}.quantity`)}
            />
            <Input
              placeholder="Unit price"
              type="number"
              min="0"
              step="0.01"
              error={errors.items?.[i]?.unit_price?.message}
              fullWidth
              {...register(`items.${i}.unit_price`)}
            />
            <RemoveBtn
              type="button"
              onClick={() => remove(i)}
              disabled={fields.length === 1}
              aria-label="Remove item"
            >
              <Trash2 size={14} />
            </RemoveBtn>
          </ItemRow>
        ))}

        {errors.items?.root && (
          <ItemError>{errors.items.root.message}</ItemError>
        )}

        <AddItemBtn
          type="button"
          onClick={() => append({ description: '', quantity: '1', unit_price: '' })}
        >
          <Plus size={14} />
          Add line item
        </AddItemBtn>

        <ModalFooter>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="blue" type="submit" loading={isPending}>Create invoice</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
