"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Topbar from "@/components/shared/Topbar";
import PageHeader from "@/components/ui/PageHeader";
import DataTable, { Column } from "@/components/ui/DataTable";
import MemberFormModal from "@/components/dashboard/MemberFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { getMembers, getRoles, deleteMember } from "@/lib/members";
import { getErrorMessage, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Member, Role } from "@/types";
import toast from "react-hot-toast";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [membersData, rolesData] = await Promise.all([
        getMembers(),
        getRoles(),
      ]);
      setMembers(membersData);
      setRoles(rolesData);
    } catch {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()),
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMember(deleteTarget.id);
      toast.success("Member deleted");
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  const columns: Column<Member>[] = [
    {
      header: "Name",
      render: (m) => (
        <span className="font-medium text-gray-900">{m.name}</span>
      ),
    },
    { header: "Email", render: (m) => m.email },
    { header: "Phone", render: (m) => m.phone ?? "—" },
    { header: "Store", render: (m) => m.store ?? "All stores" },
    {
      header: "Role",
      render: (m) => <span className="capitalize">{m.role}</span>,
    },
    {
      header: "Status",
      render: (m) => (
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getStatusColor(m.state)}`}
        >
          {getStatusLabel(m.state)}
        </span>
      ),
    },
    {
      header: "Action",
      render: (m) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditing(m);
              setShowModal(true);
            }}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                       text-gray-500 hover:bg-gray-50"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(m)}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                       text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Topbar title="Members" />
      <div className="p-6 space-y-5">
        <PageHeader
          query={query}
          onQueryChange={setQuery}
          placeholder="Search members..."
          buttonLabel="Add Member"
          onButtonClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
        />
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="No members found"
        />
      </div>

      {showModal && (
        <MemberFormModal
          member={editing}
          roles={roles}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            loadData();
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Member"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
