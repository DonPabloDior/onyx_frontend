import React, { useState } from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus } from 'lucide-react'
import { useAuthStore, useUIStore } from '@/entities/user'
import { useUpdateProfile } from '@/features/authentication'
import { useWorkspaces, useWorkspaceMembers, useCreateWorkspace, useAddMember } from '@/entities/workspace'
import { Card, CardHeader, CardTitle } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Select } from '@/shared/ui/select'
import { Avatar } from '@/shared/ui/avatar'
import { Modal, ModalFooter } from '@/shared/ui/modal'
import { formatDate } from '@/shared/lib/format'

const Grid = styled.div`
  display: grid;
  gap: 20px;
  max-width: 720px;
`

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.stroke.subtle};
`

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

const MemberRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.stroke.subtle};
  &:last-child { border-bottom: none; }
`

const MemberInfo = styled.div`
  flex: 1;
`

const MemberName = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text.primary};
`

const MemberMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
`

const RoleBadge = styled.span`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.surface.s2};
  color: ${({ theme }) => theme.text.secondary};
  border: 1px solid ${({ theme }) => theme.stroke.subtle};
  text-transform: capitalize;
`

const WorkspaceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.surface.s1};
  border: 1px solid ${({ theme }) => theme.stroke.subtle};
  gap: 12px;
`

const WorkspaceName = styled.div`
  font-size: 14px;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.text.primary};
`

const WorkspaceMeta = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text.tertiary};
`

// Profile schema
const profileSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
})
type ProfileData = z.infer<typeof profileSchema>

// Workspace schema
const workspaceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  default_currency: z.string().min(1),
  timezone: z.string().min(1),
})
type WorkspaceData = z.infer<typeof workspaceSchema>

// Member schema
const memberSchema = z.object({
  email: z.string().email('Invalid email'),
  role: z.enum(['owner', 'admin', 'analyst', 'viewer']),
})
type MemberData = z.infer<typeof memberSchema>

export default function SettingsPage() {
  const { user, currentWorkspace, setCurrentWorkspace } = useAuthStore()
  const { currency, setCurrency } = useUIStore()
  const [createWsOpen, setCreateWsOpen] = useState(false)
  const [addMemberOpen, setAddMemberOpen] = useState(false)

  const { mutate: updateProfile, isPending: savingProfile } = useUpdateProfile()
  const { data: workspaces } = useWorkspaces()
  const { data: membersData } = useWorkspaceMembers()
  const { mutate: createWorkspace, isPending: creatingWs } = useCreateWorkspace()
  const { mutate: addMember, isPending: addingMember } = useAddMember()

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: user?.full_name ?? '', email: user?.email ?? '' },
  })

  const workspaceForm = useForm<WorkspaceData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: { name: '', default_currency: 'USD', timezone: 'UTC' },
  })

  const memberForm = useForm<MemberData>({
    resolver: zodResolver(memberSchema),
    defaultValues: { email: '', role: 'analyst' },
  })

  const members = membersData?.data ?? []

  const currencyOptions = [
    { value: 'USD', label: 'USD — US Dollar' },
    { value: 'EUR', label: 'EUR — Euro' },
    { value: 'GBP', label: 'GBP — British Pound' },
  ]

  const roleOptions = [
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'analyst', label: 'Analyst' },
    { value: 'viewer', label: 'Viewer' },
  ]

  return (
    <Grid>
      {/* Profile */}
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <Section>
          <SectionLabel>Personal information</SectionLabel>
          <form
            onSubmit={profileForm.handleSubmit((d) => updateProfile(d))}
            noValidate
          >
            <FieldRow style={{ marginBottom: 16 }}>
              <Input
                label="Full name"
                error={profileForm.formState.errors.full_name?.message}
                fullWidth
                {...profileForm.register('full_name')}
              />
              <Input
                label="Email"
                type="email"
                error={profileForm.formState.errors.email?.message}
                fullWidth
                {...profileForm.register('email')}
              />
            </FieldRow>
            <Button variant="blue" type="submit" size="sm" loading={savingProfile}>
              Save profile
            </Button>
          </form>
        </Section>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader><CardTitle>Preferences</CardTitle></CardHeader>
        <Section>
          <SectionLabel>Display</SectionLabel>
          <div style={{ maxWidth: 240 }}>
            <Select
              label="Default currency"
              options={currencyOptions}
              value={currency}
              onChange={setCurrency}
              fullWidth
            />
          </div>
        </Section>
      </Card>

      {/* Workspaces */}
      <Card>
        <CardHeader>
          <CardTitle>Workspaces</CardTitle>
          <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setCreateWsOpen(true)}>
            New workspace
          </Button>
        </CardHeader>
        <Section>
          <SectionLabel>Your workspaces</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {workspaces?.map((ws) => (
              <WorkspaceItem key={ws.id}>
                <div>
                  <WorkspaceName>{ws.name}</WorkspaceName>
                  <WorkspaceMeta>{ws.default_currency} · {ws.timezone}</WorkspaceMeta>
                </div>
                {currentWorkspace?.id !== ws.id && (
                  <Button variant="secondary" size="sm" onClick={() => setCurrentWorkspace(ws)}>
                    Switch
                  </Button>
                )}
                {currentWorkspace?.id === ws.id && (
                  <span style={{ fontSize: 11, color: 'var(--blue)', padding: '2px 8px', background: 'rgba(79,141,240,0.12)', borderRadius: 999, border: '1px solid rgba(79,141,240,0.3)' }}>Active</span>
                )}
              </WorkspaceItem>
            ))}
          </div>
        </Section>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <Button variant="secondary" size="sm" icon={<Plus size={14} />} onClick={() => setAddMemberOpen(true)}>
            Add member
          </Button>
        </CardHeader>
        <Section>
          <SectionLabel>Current members</SectionLabel>
          <div>
            {members.map((m) => (
              <MemberRow key={m.id}>
                <Avatar name={m.user_id.slice(0, 2).toUpperCase()} size="sm" />
                <MemberInfo>
                  <MemberName>{m.user_id.slice(0, 8)}…</MemberName>
                  <MemberMeta>Joined {formatDate(m.created_at)}</MemberMeta>
                </MemberInfo>
                <RoleBadge>{m.role}</RoleBadge>
              </MemberRow>
            ))}
            {members.length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', padding: '12px 0' }}>
                No members yet
              </div>
            )}
          </div>
        </Section>
      </Card>

      {/* Create workspace modal */}
      <Modal open={createWsOpen} onClose={() => setCreateWsOpen(false)} title="New workspace" size="sm">
        <form
          onSubmit={workspaceForm.handleSubmit((d) =>
            createWorkspace(d, { onSuccess: () => { workspaceForm.reset(); setCreateWsOpen(false) } })
          )}
          noValidate
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input
              label="Workspace name"
              placeholder="My Company"
              error={workspaceForm.formState.errors.name?.message}
              fullWidth
              {...workspaceForm.register('name')}
            />
            <Select
              label="Default currency"
              options={[
                { value: 'USD', label: 'USD' },
                { value: 'EUR', label: 'EUR' },
                { value: 'GBP', label: 'GBP' },
              ]}
              value={workspaceForm.watch('default_currency')}
              onChange={(v) => workspaceForm.setValue('default_currency', v)}
              fullWidth
            />
            <Input
              label="Timezone"
              placeholder="UTC"
              fullWidth
              {...workspaceForm.register('timezone')}
            />
          </div>
          <ModalFooter>
            <Button variant="ghost" type="button" onClick={() => setCreateWsOpen(false)}>Cancel</Button>
            <Button variant="blue" type="submit" loading={creatingWs}>Create</Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Add member modal */}
      <Modal open={addMemberOpen} onClose={() => setAddMemberOpen(false)} title="Add member" size="sm">
        <form
          onSubmit={memberForm.handleSubmit((d) =>
            addMember(d, { onSuccess: () => { memberForm.reset(); setAddMemberOpen(false) } })
          )}
          noValidate
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input
              label="Email address"
              type="email"
              placeholder="colleague@example.com"
              error={memberForm.formState.errors.email?.message}
              fullWidth
              {...memberForm.register('email')}
            />
            <Select
              label="Role"
              options={roleOptions}
              value={memberForm.watch('role')}
              onChange={(v) => memberForm.setValue('role', v as MemberData['role'])}
              fullWidth
            />
          </div>
          <ModalFooter>
            <Button variant="ghost" type="button" onClick={() => setAddMemberOpen(false)}>Cancel</Button>
            <Button variant="blue" type="submit" loading={addingMember}>Add member</Button>
          </ModalFooter>
        </form>
      </Modal>
    </Grid>
  )
}
