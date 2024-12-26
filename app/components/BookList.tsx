import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Loader from "./Loader";

interface Template {
  template_name: string,
  _id: string,
  defaultValues: {
      title: string,
      author: string,
      price: number,
      isbn: string,
      subject: string,
      stream: string,
      description: string,
      semester: string,
      condition: string,
      imageUrl: string,
  }
}
interface ResponseData {
  template: Template[];
  totalTemplates: number;
  totalPages: number;
  currentPage: number;
}

interface Filters {
  streams: string[];
  semesters: string[];
  subjects: string[];
  condition: string[];
}

interface BookListProps {
  filters: Filters;
  searchQuery: string
}

const BookList = ({ filters, searchQuery }: BookListProps) => {
  const [books, setBooks] = useState<Template[]>([]);
  const [loading, setloading] = useState<boolean>(true)
  const [currentPage, setcurrentPage] = useState(1)
  const [totalPages, settotalPages] = useState(1)

  const fetchBooks = async (page: number) => {
    try {

      const response = await fetch(`http://localhost:5000/api/template?page=${page}&limit=4`);
      const data: ResponseData = await response.json();

      setBooks(data.template);
      settotalPages(data.totalPages)
    } catch (error) {
      console.log("Error fetching books:", error);
    } finally {
      setloading(false)
    }
  };

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  if (loading) {
    return <div className="h-screen justify-center items-center flex">
      <Loader />
    </div>
  }

  const handlePrevious = () => {
    if(currentPage > 1) {
      setcurrentPage(currentPage-1)
    }
  }
  const handleNext = () => {
    if(currentPage < totalPages) {
      setcurrentPage(currentPage+1)
    }
  }
  const filteredBooks = (books || []).filter((book) => {
    const matchesStream =
      filters.streams.length === 0 ||
      filters.streams.some((stream) => stream.toLowerCase() === book.defaultValues.stream.toLowerCase().trim());

    const matchesSemester =
      filters.semesters.length === 0 ||
      filters.semesters.some((semester) => semester.toLowerCase() === book.defaultValues.semester.toLowerCase().trim());

    const matchesSubject =
      filters.subjects.length === 0 ||
      filters.subjects.some((subject) => {

        return subject.toLowerCase() === book.defaultValues.subject.toLowerCase().trim();
      });

    const matchesCondition =
      filters.condition.length === 0 ||
      filters.condition.some((condition) => condition.toLowerCase() === book.defaultValues.condition.toLowerCase().trim());

    const matchesSearch = searchQuery === "" || book.defaultValues.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.defaultValues.author.toLowerCase().includes(searchQuery.toLowerCase()) || book.defaultValues.isbn.toLowerCase().includes(searchQuery.toLowerCase())

    return (matchesStream && matchesSemester && matchesSubject && matchesCondition && matchesSearch);

  });


  return (
    <div className="container ml-auto px-4 py-8 max-w-[79vw] max-h-[70vh] overflow-y-auto">
    {/* Responsive Grid for Images */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredBooks.length > 0 ? (
        filteredBooks.map((book) => (
          <Link href={`/book/${book._id}`} key={book._id} className="group">
            {/* Centered Image Container */}
            <div className="relative w-full h-64 flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
              {book.defaultValues.imageUrl ? (
                <Image
                  src={book.defaultValues.imageUrl}
                  alt={book.defaultValues.title}
                  layout="fill"
                  priority
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              ) : (
                <div className="flex justify-center items-center w-full h-full bg-gray-200">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>
          </Link>
        ))
      ) : (
        <p>No books available.</p>
      )}
    </div>
  
    {/* Pagination Controls */}
    <div className="pagination flex justify-end items-center mt-8">
      <button
        className="bg-[#366977] hover:bg-[#153943] text-white py-2 px-6 rounded-md disabled:opacity-50"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="text-gray-700 r-4 ml-4 ">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="bg-[#366977] hover:bg-[#153943] text-white py-2 px-6 rounded-md disabled:opacity-50"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  </div>
  
  );
};

export default BookList;
