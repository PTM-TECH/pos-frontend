
import Topbar from '@/components/shared/Topbar'
export default function TenantsPage() {
  return (
    <>
      <Topbar title="Tenants" />
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">Tenant management — coming with FastAPI backend.</p>
        </div>
      </div>
    </>
  )
}