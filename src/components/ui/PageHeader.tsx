import { Plus, Search } from "lucide-react";

export default function PageHeader({
  query,
  onQueryChange,
  placeholder,
  buttonLabel,
  onButtonClick,
  showButton = true,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  buttonLabel: string;
  onButtonClick: () => void;
  showButton?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {showButton && (
        <button
          onClick={onButtonClick}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5
                     rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
