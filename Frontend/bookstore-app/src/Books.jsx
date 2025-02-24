import { useEffect, useState } from "react";
import axios from "axios";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    publication_date: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [editingBook, setEditingBook] = useState(null);

  // Fetch books from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit (Add or Update a book)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        // Update existing book
        const res = await axios.put(
          `http://localhost:5000/books/${editingBook.id}`,
          form
        );
        setBooks(
          books.map((book) => (book.id === editingBook.id ? res.data : book))
        );
        setEditingBook(null);
      } else {
        // Add a new book
        const res = await axios.post("http://localhost:5000/books", form);
        setBooks([...books, res.data]);
      }

      // Reset form
      setForm({
        title: "",
        author: "",
        genre: "",
        publication_date: "",
        description: "",
      });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to save book. Please try again.");
    }
  };

  // Handle book delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
    } catch (err) {
      console.error("Error deleting book", err);
    }
  };

  // Handle edit click
  const handleEditClick = (book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      publication_date: book.publication_date
        ? book.publication_date.split("T")[0]
        : "",
      description: book.description,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-gray-100">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black mb-2">
            <span className="text-purple-400">Tome</span>
            <span className="text-cyan-400">Track</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Modern library management for book enthusiasts
          </p>
        </header>

        <div className="flex flex-col gap-8">
          {/* Stats Bar */}
          <div className="bg-slate-800 rounded-lg p-4 flex justify-between items-center shadow-md border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 h-12 w-12 rounded-lg flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">Collection Size</p>
                <p className="text-2xl font-bold">
                  {books.length} {books.length === 1 ? "book" : "books"}
                </p>
              </div>
            </div>

            {editingBook ? (
              <div className="bg-cyan-900/40 py-2 px-4 rounded-full text-cyan-400 text-sm">
                Currently editing: {editingBook.title}
              </div>
            ) : (
              <div className="bg-purple-900/40 py-2 px-4 rounded-full text-purple-400 text-sm">
                Ready to add new books
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Add / Edit Book Panel */}
            <div className="xl:col-span-1 bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {editingBook ? "✏️ Update Book Info" : "✨ Add to Collection"}
                </h2>
              </div>

              <div className="p-6">
                {error && (
                  <div className="bg-red-900/20 border-l-4 border-red-500 text-red-400 p-4 mb-6 rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter book title"
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-white placeholder-gray-400"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      placeholder="Enter author name"
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-white placeholder-gray-400"
                      value={form.author}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Genre
                      </label>
                      <input
                        type="text"
                        name="genre"
                        placeholder="e.g. Fiction"
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-white placeholder-gray-400"
                        value={form.genre}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Publication Date
                      </label>
                      <input
                        type="date"
                        name="publication_date"
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-white"
                        value={form.publication_date}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Enter a brief description of the book"
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg h-32 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition resize-none text-white placeholder-gray-400"
                      value={form.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button
                      type="submit"
                      className="py-3 px-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-cyan-600 transition shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-2"
                    >
                      {editingBook ? "🔄 Update" : "➕ Add Book"}
                    </button>

                    {editingBook && (
                      <button
                        type="button"
                        className="py-3 px-6 bg-slate-700 text-gray-300 rounded-lg font-medium hover:bg-slate-600 transition flex items-center justify-center gap-2"
                        onClick={() => {
                          setEditingBook(null);
                          setForm({
                            title: "",
                            author: "",
                            genre: "",
                            publication_date: "",
                            description: "",
                          });
                        }}
                      >
                        <span>❌</span> Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Book Collection Panel */}
            <div className="xl:col-span-2 bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden flex flex-col">
              <div className="bg-slate-700 p-4 flex justify-between items-center border-b border-slate-600">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>📖</span> Your Library
                </h2>

                <div className="flex gap-2">
                  <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                    {books.length} {books.length === 1 ? "volume" : "volumes"}
                  </span>
                </div>
              </div>

              {books.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-center flex-grow">
                  <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mb-4 text-4xl">
                    📚
                  </div>
                  <h3 className="text-2xl font-bold text-gray-400 mb-2">
                    No books yet
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Your digital bookshelf is waiting for its first addition.
                    Add books to start building your collection.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 max-h-[600px] overflow-y-auto">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="bg-slate-700 rounded-lg overflow-hidden border border-slate-600 hover:border-purple-500/50 transition group relative"
                    >
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(book)}
                          className="bg-cyan-500 p-2 rounded-lg text-white hover:bg-cyan-400 transition shadow-md"
                        >
                          ✏️
                        </button>

                        <button
                          onClick={() => handleDelete(book.id)}
                          className="bg-red-500 p-2 rounded-lg text-white hover:bg-red-400 transition shadow-md"
                        >
                          🗑️
                        </button>
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-xl text-white">
                            {book.title}
                          </h3>
                          {book.genre && (
                            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium ml-2">
                              {book.genre}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center mb-3 text-gray-300">
                          <span className="mr-2">👤</span>
                          <span>{book.author}</span>
                        </div>

                        {book.publication_date && (
                          <div className="text-gray-400 text-sm mb-3">
                            Published:{" "}
                            {new Date(
                              book.publication_date
                            ).toLocaleDateString()}
                          </div>
                        )}

                        {book.description && (
                          <div className="mt-3 pt-3 border-t border-slate-600">
                            <p className="text-gray-400 text-sm line-clamp-3">
                              {book.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
