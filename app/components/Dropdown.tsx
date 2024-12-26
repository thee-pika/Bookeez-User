"use client"
import { useEffect, useState } from "react";

const Dropdown = ({ options, label, value, onChange }: { options: string[], label: string, value: string, onChange: (selectedOption: string) => void; }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setselectedOption] = useState<string>(label)
    const handleDropDown = () => setIsOpen(!isOpen)
    
    useEffect(() => {
        setselectedOption(value || label);
    }, [value, label]);

    const handleOption = (option: string) => {
        setselectedOption(option)
        setIsOpen(!isOpen)
        onChange(option)
    }

    return (
        <div className="relative">
            <button id="dropdownDefaultButton" type="button" className="bg-[#366977] w-[30vw] justify-between ml-8 mb-1 inline-flex items-center focus:ring-4 focus:ring-[#D9D9D9] rounded-md hover:bg-[#153943] focus:outline-none p-3 text-[#D9D9D9] " onClick={handleDropDown}>
                {selectedOption}
                <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>

            </button>
            {isOpen && (
                <div id="dropdown" className="divide-y divide-gray-100 rounded-lg bg-[#D9D9D9] ml-8 w-[15vw] h-auto">
                    <ul className="dropdown-menu absolute w-[12vw] z-10 bg-[#555252]">
                        {options.map((option, index) => (
                            <li key={index} onClick={() => handleOption(option)} className="rounded-md  p-3 hover:bg-[#B2AEAE] ">
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;


