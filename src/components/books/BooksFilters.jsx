const BookFilters = ({ filters, onChange, onApply, onClear }) => {
  // These would ideally come from your API/context
  const genres = ["Fiction", "Non-Fiction", "Science Fiction", "Mystery", "Biography", "History", "Fantasy"];
  const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese"];
  const statuses = ["Available", "Borrowed", "Reserved", "Maintenance"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Title</label>
        <input
          type="text"
          value={filters.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Filter by title"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Author</label>
        <input
          type="text"
          value={filters.author}
          onChange={(e) => onChange("author", e.target.value)}
          placeholder="Filter by author"
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Genre</label>
        <select
          value={filters.genre}
          onChange={(e) => onChange("genre", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option
              key={genre}
              value={genre}
            >
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Language</label>
        <select
          value={filters.language}
          onChange={(e) => onChange("language", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">All Languages</option>
          {languages.map((language) => (
            <option
              key={language}
              value={language}
            >
              {language}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Status</label>
        <select
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end space-x-2">
        <button
          onClick={onApply}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default BookFilters;
