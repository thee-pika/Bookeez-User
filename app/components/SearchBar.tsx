"use client"
import { useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(searchQuery);
        setSearchQuery("");
    };

    return (
        <form
            className="w-full sm:w-[60vw] lg:w-[40vw] mx-auto"
            onSubmit={handleSubmit}
        >
            <label
                htmlFor="default-search"
                className="mb-2 text-sm font-medium text-gray-900 sr-only"
            >
                Search
            </label>
            <div className="relative flex items-center mt-8 ">
                <input
                    type="search"
                    id="default-search"
                    className="block w-full sm:w-[50.35vw] lg:w-[59vw] p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#366977] focus:border-[#366977]"
                    placeholder="Search By Title, Author, ISBN..."
                    required
                    value={searchQuery}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="text-white bg-[#d80032] hover:bg-[#d8003281] focus:ring-4 focus:outline-none focus:ring-[#d80032ac] font-medium rounded-lg text-sm px-6 py-4 absolute right-0 top-0 bottom-0 flex items-center justify-center"
                >
                    Search
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
