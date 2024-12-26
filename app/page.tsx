"use client"
import { useState } from "react";
import "./styles/layout.css";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";

interface Filters {
  streams: string[];
  semesters: string[];
  subjects: string[];
  condition: string[];
}

const Home = () => {
  const [searchQuery, setsearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    streams: [],
    semesters: [],
    subjects: [],
    condition: []
  });

  const handleSearch = (query: string) => {
    setsearchQuery(query);
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="main flex">
      <Sidebar onFilterChange={handleFilterChange} />
      <div className="flex-grow flex-col max-h-[77.5vh]">
        <SearchBar onSearch={handleSearch} />
        <BookList filters={filters} searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default Home;
