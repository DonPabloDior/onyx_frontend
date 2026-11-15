import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import styled from 'styled-components'
import { Modal, ModalFooter } from '@/shared/ui/modal'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { useUpdateTransaction } from '@/entities/transaction'
import { format, parseISO } from 'date-fns'
import type { TransactionOut } from '@/shared/types/api'

const schema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.string().min(1, 'Amount is required').regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount'),
  status: z.enum(['completed', 'pending', 'failed']),
  occurred_at: z.string().min(1),
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
  transaction: TransactionOut
  onClose: () => void
}

export function EditTransactionModal({ transaction, onClose }: Props) {
  const { mutate: update, isPending } = useUpdateTransaction()

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: transaction.description,
      amount: transaction.amount,
      status: transaction.status,
      occurred_at: format(parseISO(transaction.occurred_at), "yyyy-MM-dd'T'HH:mm"),
    },
  })

  function onSubmit(data: FormData) {
    update(
      { id: transaction.id, data: { ...data, occurred_at: new Date(data.occurred_at).toISOString() } },
      { onSuccess: onClose }
    )
  }

  const statusOptions = [
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
  ]

  return (
    <Modal open onClose={onClose} title="Edit transaction" size="md">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid>
          <Full>
            <Input
              label="Description"
              error={errors.description?.message}
              fullWidth
              {...register('description')}
            />
          </Full>
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0"
            error={errors.amount?.message}
            fullWidth
            {...register('amount')}
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
            label="Date"
            type="datetime-local"
            error={errors.occurred_at?.message}
            fullWidth
            {...register('occurred_at')}
          />
        </Grid>
        <ModalFooter>
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="blue" type="submit" loading={isPending}>Save changes</Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
