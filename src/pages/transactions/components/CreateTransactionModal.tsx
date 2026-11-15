import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styled from 'styled-components'
import { Modal, ModalFooter } from '@/shared/ui/modal'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { useCreateTransaction, useCategories } from '@/entities/transaction'
import { useUIStore } from '@/entities/user'
import { format } from 'date-fns'

const schema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  description: z.string().min(1, 'Description is required'),
  amount: z.string().min(1, 'Amount is required').regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  currency: z.string().min(1),
  category_id: z.string().optional(),
  status: z.enum(['completed', 'pending', 'failed']),
  occurred_at: z.string().min(1, 'Date is required'),
})

type FormData = z.infer<typeof schema>

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`

const Full = styled.div`
  grid-column: 1 / -1;
`

interface Props {
  open: boolean
  onClose: () => void
}

export function CreateTransactionModal({ open, onClose }: Props) {
  const { currency } = useUIStore()
  const { mutate: create, isPending } = useCreateTransaction()
  const { data: categories } = useCategories()

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'expense',
      currency,
      status: 'completed',
      occurred_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    },
  })

  function onSubmit(data: FormData) {
    create(
      { ...data, occurred_at: new Date(data.occurred_at).toISOString() },
      {
        onSuccess: () => {
          reset()
          onClose()
        },
      }
    )
  }

  const typeOptions = [
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
    { value: 'transfer', label: 'Transfer' },
  ]

  const statusOptions = [
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
  ]

  const categoryOptions = [
    { value: '', label: 'No category' },
    ...(categories?.map((c) => ({ value: c.id, label: c.name })) ?? []),
  ]

  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
  ]

  return (
    <Modal open={open} onClose={onClose} title="New transaction" size="md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid>
          <Full>
            <Input
              label="Description"
              placeholder="Office supplies, client payment…"
              error={errors.description?.message}
              fullWidth
              {...register('description')}
            />
          </Full>

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                label="Type"
                options={typeOptions}
                value={field.value}
                onChange={field.onChange}
                fullWidth
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="Status"
                options={statusOptions}
                value={field.value}
                onChange={field.onChange}
                fullWidth
              />
            )}
          />

          <Input
            label="Amount"
            placeholder="0.00"
            type="number"
            step="0.01"
            min="0"
            error={errors.amount?.message}
            fullWidth
            {...register('amount')}
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

          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Category"
                options={categoryOptions}
                value={field.value ?? ''}
                onChange={(v) => field.onChange(v || undefined)}
                fullWidth
              />
            )}
          />

          <Input
            label="Date"
            type="datetime-local"
            error={errors.occurred_at?.message}
            fullWidth
            {...register('occurred_at')}
          />
        </Grid>

        <ModalFooter>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="blue" type="submit" loading={isPending}>Create transaction</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
