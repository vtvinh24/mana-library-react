import { useState, useEffect } from "react";
import { FaSearch, FaSort, FaFilePdf } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/common/Pagination";

const BookHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "borrowedDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // In a real application, this would be an API call
        // For demonstration, we're using mock data
        setTimeout(() => {
          const mockHistory = [
            {
              id: "1",
              title: "To Kill a Mockingbird",
              author: "Harper Lee",
              borrowedDate: new Date(2025, 0, 15),
              returnedDate: new Date(2025, 1, 10),
              status: "returned",
            },
            {
              id: "2",
              title: "1984",
              author: "George Orwell",
              borrowedDate: new Date(2024, 11, 5),
              returnedDate: new Date(2025, 0, 2),
              status: "returned",
            },
            {
              id: "3",
              title: "The Great Gatsby",
              author: "F. Scott Fitzgerald",
              borrowedDate: new Date(2024, 10, 20),
              returnedDate: new Date(2024, 11, 18),
              status: "returned",
            },
            {
              id: "4",
              title: "Pride and Prejudice",
              author: "Jane Austen",
              borrowedDate: new Date(2024, 9, 8),
              returnedDate: new Date(2024, 10, 5),
              status: "returned",
            },
            {
              id: "5",
              title: "The Catcher in the Rye",
              author: "J.D. Salinger",
              borrowedDate: new Date(2024, 8, 12),
              returnedDate: new Date(2024, 9, 10),
              status: "returned",
            },
            {
              id: "6",
              title: "Brave New World",
              author: "Aldous Huxley",
              borrowedDate: new Date(2024, 7, 25),
              returnedDate: new Date(2024, 8, 22),
              status: "returned",
            },
            {
              id: "7",
              title: "The Hobbit",
              author: "J.R.R. Tolkien",
              borrowedDate: new Date(2024, 6, 18),
              returnedDate: new Date(2024, 7, 15),
              status: "returned",
            },
            {
              id: "8",
              title: "The Lord of the Rings",
              author: "J.R.R. Tolkien",
              borrowedDate: new Date(2024, 5, 10),
              returnedDate: new Date(2024, 6, 8),
              status: "returned",
            },
            {
              id: "9",
              title: "Animal Farm",
              author: "George Orwell",
              borrowedDate: new Date(2024, 4, 5),
              returnedDate: new Date(2024, 5, 3),
              status: "returned",
            },
            {
              id: "10",
              title: "The Alchemist",
              author: "Paulo Coelho",
              borrowedDate: new Date(2024, 3, 20),
              returnedDate: new Date(2024, 4, 18),
              status: "returned",
            },
            {
              id: "11",
              title: "The Odyssey",
              author: "Homer",
              borrowedDate: new Date(2024, 2, 15),
              returnedDate: new Date(2024, 3, 12),
              status: "returned",
            },
            {
              id: "12",
              title: "Don Quixote",
              author: "Miguel de Cervantes",
              borrowedDate: new Date(2024, 1, 8),
              returnedDate: new Date(2024, 2, 5),
              status: "returned",
            },
          ];

          setHistory(mockHistory);
          setLoading(false);
        }, 800); // Simulate loading delay
      } catch (error) {
        console.error("Failed to fetch history:", error);
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...history].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.author.toLowerCase().includes(searchTerm.toLowerCase()));

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const exportToPDF = () => {
    alert("Export to PDF functionality would be implemented here");
    // In a real app, this would generate and download a PDF of the history
  };

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">My Borrowing History</h1>

        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <button
            onClick={exportToPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            <FaFilePdf className="mr-2" /> Export
          </button>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-200">
                  <button
                    onClick={() => requestSort("title")}
                    className="flex items-center"
                  >
                    Book Title{" "}
                    <FaSort
                      className="ml-1"
                      size={12}
                    />
                  </button>
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-200">
                  <button
                    onClick={() => requestSort("author")}
                    className="flex items-center"
                  >
                    Author{" "}
                    <FaSort
                      className="ml-1"
                      size={12}
                    />
                  </button>
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-200">
                  <button
                    onClick={() => requestSort("borrowedDate")}
                    className="flex items-center"
                  >
                    Borrowed Date{" "}
                    <FaSort
                      className="ml-1"
                      size={12}
                    />
                  </button>
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-200">
                  <button
                    onClick={() => requestSort("returnedDate")}
                    className="flex items-center"
                  >
                    Returned Date{" "}
                    <FaSort
                      className="ml-1"
                      size={12}
                    />
                  </button>
                </th>
                <th className="py-3 px-4 text-left font-semibold text-gray-700 dark:text-gray-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-4 px-4 text-gray-800 dark:text-gray-200">{item.title}</td>
                  <td className="py-4 px-4 text-gray-800 dark:text-gray-200">{item.author}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{item.borrowedDate.toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-gray-600 dark:text-gray-400">{item.returnedDate.toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{item.status === "returned" ? "Returned" : item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 dark:text-gray-400">{searchTerm ? "No results match your search." : "You have no borrowing history yet."}</p>
        </div>
      )}
    </div>
  );
};

export default BookHistory;
