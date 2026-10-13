import { useEffect, useState } from 'react'
import { teamApi } from '../../api/teamApi'
import type { TeamMember } from '../../types/team'
import { useOrganizationStore } from '../../stores/organizationStore'
import TeamForm from './TeamForm'
export default function TeamPage() {
    const organizationId = useOrganizationStore(
        (state) => state.organizationId,
    )

    const [members, setMembers] = useState<TeamMember[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [lastPage, setLastPage] = useState(1)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)
    const [isCreating, setIsCreating] = useState(false)
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        if (!organizationId) {
            return
        }

        const loadMembers = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await teamApi.list(
                    organizationId,
                    page,
                )
                setMembers(response.data.data)
                setTotal(response.data.total)
                setLastPage(response.data.last_page)
            } catch {
                setError('Failed to load team members.')
            } finally {
                setIsLoading(false)
            }
        }

        void loadMembers()
}, [organizationId, page, refreshKey])
    const handleCreateTeamMember = async (
        data: Parameters<React.ComponentProps<typeof TeamForm>['onSubmit']>[0],
    ) => {
        if (!organizationId) {
            return
        }

        try {
            setIsCreating(true)
            setError(null)
            setSuccessMessage(null)

            await teamApi.create({
                organization_id: organizationId,
                name: data.name,
                email: data.email,
                password: data.password,
                phone: data.phone,
                role_id: Number(data.role_id),
            })

            setIsCreateOpen(false)
            setSuccessMessage('Team member created successfully.')
            setRefreshKey((current) => current + 1)
        } catch {
            setError('Failed to create team member.')
        } finally {
            setIsCreating(false)
        }
    }
    const handleUpdateTeamMember = async (
        data: Parameters<React.ComponentProps<typeof TeamForm>['onSubmit']>[0],
    ) => {
        if (!organizationId || !editingMember) {
            return
        }

        try {
            setIsUpdating(true)
            setError(null)
            setSuccessMessage(null)

            await teamApi.update(editingMember.id, {
                organization_id: organizationId,
                name: data.name,
                phone: data.phone,
                is_active: data.is_active,
                role_id: Number(data.role_id),
            })

            setEditingMember(null)
            setSuccessMessage('Team member updated successfully.')
            setRefreshKey((current) => current + 1)
        } catch {
            setError('Failed to update team member.')
        } finally {
            setIsUpdating(false)
        }
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Team
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your organization team members.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    Add Team Member
                </button>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
                    {successMessage}
                </div>
            )}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {isLoading ? (
                    <div className="p-6 text-sm text-gray-500">
                        Loading team members...
                    </div>
                ) : members.length === 0 ? (
                    <div className="p-6 text-sm text-gray-500">
                        No team members found.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Name
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Email
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Phone
                            </th>

                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                Status
                            </th><th className="px-5 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                            Actions
                        </th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                        {members.map((member) => (
                            <tr key={member.id}>
                                <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                    {member.name}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {member.email}
                                </td>

                                <td className="px-5 py-4 text-sm text-gray-600">
                                    {member.phone ?? '-'}
                                </td>

                                <td className="px-5 py-4 text-sm">
                                    {member.is_active ? (
                                        <span className="font-medium text-green-600">
                                                Active
                                            </span>
                                    ) : (
                                        <span className="font-medium text-red-600">
                                                Inactive
                                            </span>
                                    )}
                                </td>
                                <td className="px-5 py-4 text-sm">
                                    <button
                                        type="button"
                                        onClick={() => setEditingMember(member)}
                                        className="font-medium text-indigo-600 hover:text-indigo-800"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Total: {total}
                </p>

                <div className="flex gap-2">
                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() =>
                            setPage((current) => current - 1)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="px-3 py-2 text-sm text-gray-600">
                        Page {page} of {lastPage}
                    </span>

                    <button
                        type="button"
                        disabled={page === lastPage}
                        onClick={() =>
                            setPage((current) => current + 1)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="mb-6 text-lg font-semibold text-gray-900">
                            Add Team Member
                        </h2>

                        <TeamForm
                            mode="create"
                            onSubmit={handleCreateTeamMember}
                            onCancel={() => setIsCreateOpen(false)}
                            isSubmitting={isCreating}
                        />
                    </div>
                </div>
            )}
            {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <h2 className="mb-6 text-lg font-semibold text-gray-900">
                            Edit Team Member
                        </h2>

                        <TeamForm
                            key={editingMember.id}
                            mode="edit"
                            initialData={{
                                name: editingMember.name,
                                phone: editingMember.phone ?? '',
                                role_id: String(
                                    editingMember.organizations.find(
                                        (organization) =>
                                            organization.id === organizationId,
                                    )?.pivot.role_id ?? 3,
                                ),
                                is_active: editingMember.is_active,
                            }}
                            onSubmit={handleUpdateTeamMember}
                            onCancel={() => setEditingMember(null)}
                            isSubmitting={isUpdating}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
