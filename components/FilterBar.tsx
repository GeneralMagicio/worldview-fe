import { SearchIcon, FilterHorizontal } from "./icon-components";

export default function FilterBar({
  setFiltersOpen,
}: {
  setFiltersOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="flex-1 bg-gray-200 rounded-xl px-4 py-3 flex items-center gap-2">
        <button className="w-6 h-6 flex items-center justify-center">
          <SearchIcon />
        </button>
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent flex-1 outline-none text-gray-400 placeholder-gray-400"
        />
      </div>
      <button
        className="bg-gray-900 rounded-xl p-4"
        onClick={() => setFiltersOpen(true)}
      >
        <FilterHorizontal />
      </button>
    </div>
  );
}
