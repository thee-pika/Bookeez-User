"use client";
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

interface Filters {
    streams: string[];
    semesters: string[];
    subjects: string[];
    condition: string[];
}

interface SidebarProps {
    onFilterChange: (newFilters: Filters) => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
    const [selectedFilters, setSelectedFilters] = useState<Filters>({
        streams: [],
        semesters: [],
        subjects: [],
        condition: [],
    }); // Selected filters state

    // Dummy filter data
    const streams = ['Engineering', 'Degree', 'Medical', 'Arts', 'Other'];
    const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8', 'Other'];
    const subjects = ['Mathematics', 'Physics', 'Computer Science', 'Other'];
    const condition = ['New', 'Old', 'New-Like', 'Chipped', 'Other'];

    // Handle filter selection change
    const handleFilterChange = (filterType: keyof Filters, value: string) => {
        console.log("Filter Type:", filterType); // Debugging line
        console.log("Selected Value:", value); // Debugging line
    
        setSelectedFilters((prevState) => {
            const updatedFilters = { ...prevState };
    
            // Check if the value is already selected
            if (updatedFilters[filterType].includes(value)) {
                updatedFilters[filterType] = updatedFilters[filterType].filter((item) => item !== value); // Remove the value
            } else {
                updatedFilters[filterType] = [...updatedFilters[filterType], value]; // Add the value
            }
    
            console.log("Updated Filters inside handler:", updatedFilters); // Debugging line
            onFilterChange(updatedFilters); // Notify parent component
            return updatedFilters;
        });
    };

    // Toggle the modal visibility
    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <div className="relative">
           
            <div className="lg:hidden p-4">
                <button onClick={toggleModal} className="text-2xl text-gray-700">
                    <FaBars />
                </button>
            </div>

            {/* Sidebar for medium and larger screens */}
            <div className="hidden lg:block fixed top-0 left-0 w-[20vw] h-[86.5vh] bg-white z-50 overflow-y-auto">
                <div className="relative w-full p-6 mt-16">
                    <h2 className="font-bold font-mono text-2xl pl-2">Top Categories</h2>

                    {/* Stream Filter */}
                    <div className="mt-4">
                        <h3 className="mb-4 text-[#e31f1f] font-semibold font-mono text-xl pl-2">Stream or Course</h3>
                        {streams.map((stream) => (
                            <div key={stream} className="flex items-center pl-4">
                                <input
                                    type="checkbox"
                                    id={stream}
                                    className="mr-2 w-5 mb-1 h-5"
                                    checked={selectedFilters.streams.includes(stream)}
                                    onChange={() => handleFilterChange('streams', stream)}
                                />
                                <label htmlFor={stream} className="font-mono text-xl">{stream}</label>
                            </div>
                        ))}
                    </div>

                    {/* Semester Filter */}
                    <div className="mt-4">
                        <h3 className="font-semibold text-[#e31f1f] mb-4 font-mono text-xl pl-2">Semester</h3>
                        {semesters.map((semester) => (
                            <div key={semester} className="flex items-center pl-4">
                                <input
                                    type="checkbox"
                                    id={semester}
                                    className="mr-2 w-5 mb-1 h-5"
                                    checked={selectedFilters.semesters.includes(semester)}
                                    onChange={() => handleFilterChange('semesters', semester)}
                                />
                                <label htmlFor={semester} className="font-mono text-xl">{semester}</label>
                            </div>
                        ))}
                    </div>

                    {/* Subject Filter */}
                    <div className="mt-4">
                        <h3 className="font-semibold text-[#e31f1f] mb-4 font-mono text-xl pl-2">Subject</h3>
                        {subjects.map((subject) => (
                            <div key={subject} className="flex items-center pl-4">
                                <input
                                    type="checkbox"
                                    id={subject}
                                    className="mr-2 w-5 mb-1 h-5"
                                    checked={selectedFilters.subjects.includes(subject)}
                                    onChange={() => handleFilterChange('subjects', subject)}
                                />
                                <label htmlFor={subject} className="font-mono text-xl">{subject}</label>
                            </div>
                        ))}
                    </div>

                    {/* Condition Filter */}
                    <div className="mt-4">
                        <h3 className="font-semibold text-[#e31f1f] mb-4 font-mono text-xl pl-2">Condition</h3>
                        {condition.map((cond) => (
                            <div key={cond} className="flex items-center pl-4">
                                <input
                                    type="checkbox"
                                    id={cond}
                                    className="mr-2 w-5 mb-1 h-5"
                                    checked={selectedFilters.condition.includes(cond)}
                                    onChange={() => handleFilterChange('condition', cond)}
                                />
                                <label htmlFor={cond} className="font-mono text-xl">{cond}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal - Sidebar in Card for small screens */}
            <div
                className={`fixed top-0 left-0 w-[80vw] h-full bg-white z-50 transform transition-all duration-300
                ${isModalOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto lg:hidden`}
            >
                <div className="relative w-full h-full p-6 mt-16">
                    {/* Close Button */}
                    <button
                        onClick={toggleModal}
                        className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-900"
                    >
                        <FaTimes />
                    </button>

                    <h2 className="font-bold font-mono text-2xl pl-2">Top Categories</h2>

                    {/* Stream Filter */}
                    <div className="mt-4">
                        <h3 className="mb-4 text-[#e31f1f] font-semibold font-mono text-xl pl-2">Stream or Course</h3>
                        {streams.map((stream) => (
                            <div key={stream} className="flex items-center pl-4">
                                <input
                                    type="checkbox"
                                    id={stream}
                                    className="mr-2 w-5 mb-1 h-5"
                                    checked={selectedFilters.streams.includes(stream)}
                                    onChange={() => handleFilterChange('streams', stream)}
                                />
                                <label htmlFor={stream} className="font-mono text-xl">{stream}</label>
                            </div>
                        ))}
                    </div>

                    {/* Semester Filter */}
                    <div className="mt-4">
                        <h3 className="font-semibold text-[#e31f1f] mb-4 font-mono text-xl pl-2">Semester</h3>
                        {semesters.map((semester) => (
                            <div key={semester} className="flex items-center pl-4">
                                <input
                                    type="checkbox"
                                    id={semester}
                                    className="mr-2 w-5 mb-1 h-5"
                                    checked={selectedFilters.semesters.includes(semester)}
                                    onChange={() => handleFilterChange('semesters', semester)}
                                />
                                <label htmlFor={semester} className="font-mono text-xl">{semester}</label>
                            </div>
                        ))}
                    </div>

                    {/* Subject Filter */}
                    <div className="mt-4">
                        <h3 className="font-semibold text-[#e31f1f] mb-4 font-mono text-xl pl-2">Subject</h3>
                        {subjects.map((subject) => (
                            <div key={subject} className="flex items-center pl-4">
                                <input
                                    type="checkbox"
                                    id={subject}
                                    className="mr-2 w-5 mb-1 h-5"
                                    checked={selectedFilters.subjects.includes(subject)}
                                    onChange={() => handleFilterChange('subjects', subject)}
                                />
                                <label htmlFor={subject} className="font-mono text-xl">{subject}</label>
                            </div>
                        ))}
                    </div>

                    {/* Condition Filter */}
                    <div className="mt-4">
                        <h3 className="font-semibold text-[#e31f1f] mb-4 font-mono text-xl pl-2">Condition</h3>
                        {condition.map((cond) => (
                            <div key={cond} className="flex items-center pl-4">
                                <input
                                    type="checkbox"
                                    id={cond}
                                    className="mr-2 w-5 mb-1 h-5"
                                    checked={selectedFilters.condition.includes(cond)}
                                    onChange={() => handleFilterChange('condition', cond)}
                                />
                                <label htmlFor={cond} className="font-mono text-xl">{cond}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
