"use client"
import { useEffect, useState } from "react"
import Dropdown from ".././../components/Dropdown"
import { MdUpload } from 'react-icons/md';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";
import dotenv from 'dotenv';
import { useRouter } from "next/navigation";

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

const EditTemplate = () => {
    dotenv.config();
    const router = useRouter();
    const [, setTemplate] = useState<Template | undefined>()
    const [loading, setLoading] = useState(true)
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            fetchTemplate()
        }
    }, [id])

    const [formData, SetFormData] = useState({
        title: "",
        author: "",
        price: "",
        description: "",
        isbn: "",
        stream: "",
        subject: "",
        semester: "",
        condition: "",
        imageUrl: "",
    })

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [template_name, setTemplateName] = useState<string>("")
    const courseOptions = [
        "Engineering ",
        "Arts",
        "Degree",
        "Medical",
        "other"
    ];

    const subjectOptions = [
        "Mathematics",
        "Physics",
        "Computer Science",
        "other"
    ];
    const categoryOptions = [
        "New",
        "Old",
        "Like-New",
        "Chipped"
    ];
    const semsterOptions = ['Semester 1', ' Semester 2', ' Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester7', 'Semester8']

    const fetchTemplate = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}`)
            if (!res.ok) {
                console.log("eeror");
            }
            const { template } = await res.json();


            if (!template.defaultValues.imageUrl) {
                console.log("Image not found!!!");
            }
            if (template) {
                console.log(template)
                setTemplate(template)
                SetFormData({
                    title: template.defaultValues.title,
                    author: template.defaultValues.author,
                    price: template.defaultValues.price.toString(),
                    description: template.defaultValues.description,
                    isbn: template.defaultValues.isbn,
                    stream: template.defaultValues.stream,
                    subject: template.defaultValues.subject,
                    semester: template.defaultValues.semester,
                    condition: template.defaultValues.condition,
                    imageUrl: template.defaultValues.imageUrl || ""
                });
                setTemplateName(template.template_name);

            }
        } catch (error) {
            console.log("eror!!", error)
        } finally {
            setLoading(false)
        }

    }
    if (loading) {
        return <div className="h-screen justify-center items-center flex">
            loafing....
        </div>
    }
    const handleSubmit = async (e: React.FormEvent<EventTarget>) => {
        e.preventDefault()
        let imageUrl = formData.imageUrl
        console.log("form submit clciked");
        if (imageFile) {
            imageUrl = await uploadImageToCloudinary();
        }

        const defaultValues = { ...formData, imageUrl };

        try {
            console.log(defaultValues)
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    template_name,
                    defaultValues,
                }),
            })

            if (res.ok) {
                toast.success("Template added successfully!!");
                router.push("/");
            }
        } catch (error) {
            toast.error("Error adding book. Please try again.");
            console.log('Error:', error);
        }
    }

    const handlebuttonSubmit = () => {
        console.log("clciked");
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Access the selected file
        const file = e.target.files?.[0]; // Use optional chaining to avoid null errors

        if (file) {

            setImageFile(file);
            // Optional: Set the file name or other placeholder in `formData`
            SetFormData({ ...formData, imageUrl: file.name }); // This is just for display
        }
    };

    const uploadImageToCloudinary = async () => {
        if (!imageFile) {
            toast.error("Please select an image")
            return;
        }

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "my_bookeez_preset");
        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dwkh9z2rg/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    // const previewUrl = coverImage ? URL.createObjectURL(coverImage) : '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        SetFormData({ ...formData, [name]: value });
    };

    const handleDropdownChange = (field: string, selectedOption: string) => {

        SetFormData((prevState) => ({
            ...prevState,
            [field]: selectedOption, // Dynamically update the field in the formData state
        }));

    };

    const handleClick = () => {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    };

    const handledescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        SetFormData({ ...formData, [name]: value });
    };

    return (
        <>
            <div className="flex w-[70vw] bg-[#D9D9D9] m-auto">
                <form onSubmit={handleSubmit}>
                    <div className="formInputs flex flex-col">
                        <div className="template_name w-[70vw] pl-8 pt-8">
                            <label htmlFor="name" className="block">
                                <span>Template Name</span>
                            </label>
                            <input
                                type="text"
                                name="templateName"
                                value={template_name}
                                className="flex flex-col border border-gray-300 rounded-md mt-4 p-3 w-[30vw] bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#366977] focus:border-[#366977] "
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder="Hornics Art of Books 90"
                                required
                                id="templateName"
                            />
                        </div>
                        <div className="flex justify-between w-[70vw]">

                            <div className="title m-4 pl-4">
                                <label htmlFor="name" className="block">
                                    <span>Title of the Book</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    className="flex flex-col border border-gray-300 rounded-md mt-4 p-3 w-[30vw] bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#366977] focus:border-[#366977] "
                                    onChange={handleChange}
                                    placeholder="Hornics Art of Books"
                                    required
                                    id="name"
                                />
                            </div>
                            <div className="author m-4">
                                <label htmlFor="author" className="block">
                                    <span>Author</span>
                                </label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    className="flex flex-col border border-gray-300 rounded-md mt-4 p-3 w-[30vw] bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#366977] focus:border-[#366977] "
                                    onChange={handleChange}
                                    placeholder="william shakespear"
                                    required
                                    id="author"
                                />
                            </div>
                        </div>

                        <div className="flex justify-between w-[70vw]">
                            <div className="price m-4 pl-4">
                                <label htmlFor="price" className="block">
                                    <span>Price of the Book</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    className="flex flex-col border border-gray-300 rounded-md mt-4 p-3 w-[30vw] bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#366977] focus:border-[#366977] "
                                    onChange={handleChange}
                                    placeholder="$599 "
                                    required
                                    id="price"
                                />
                            </div>
                            <div className="ISBN m-4">
                                <label htmlFor="isbn" className="block">
                                    <span>ISBN Code</span>
                                </label>
                                <input
                                    type="text"
                                    name="isbn"
                                    value={formData.isbn}
                                    className="flex flex-col border border-gray-300 rounded-md mt-4 p-3 w-[30vw] bg-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#366977] focus:border-[#366977] "
                                    onChange={handleChange}
                                    placeholder="DEYU678IOJT667"
                                    required
                                    id="isbn"
                                />
                            </div>

                        </div>

                        <div className="category ml-8 p-4 font-bold text-2xl">Book Category</div>

                        <div className="mb-4">
                            <div className="ml-8">Select Your Course or Stream</div>
                            <Dropdown options={courseOptions} label="Select Your course" value={formData.stream}
                                onChange={(selectedOption) => handleDropdownChange("stream", selectedOption)} />

                        </div>
                        <div className="course flex justify-between">

                            <div className="mb-4">
                                <div className="ml-8">Book Condition</div>
                                <Dropdown options={categoryOptions} label="Select Your Book Condition" value={formData.condition}
                                    onChange={(selectedOption) => handleDropdownChange("condition", selectedOption)} />
                            </div>
                            <div>
                                <div className="ml-8">Select Subject</div>
                                <div className="mb-4 mr-8">
                                    <Dropdown options={subjectOptions} label="Select Your subject" value={formData.subject}
                                        onChange={(selectedOption) => handleDropdownChange("subject", selectedOption)} />
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="ml-8">Select Your Semester</div>
                            <Dropdown options={semsterOptions} label="Select Your semester" value={formData.semester}
                                onChange={(selectedOption) => handleDropdownChange("semester", selectedOption)} />
                        </div>

                        <div className="form-group flex justify-center">
                            <div className="flex flex-col mb-8 justify-center">
                                <label htmlFor="description" className="mb-4">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handledescriptionChange}
                                    rows={3}
                                    cols={110}
                                    placeholder="Enter the description of the book"
                                    className="flex flex-col border border-gray-300 rounded-md p-3 w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#366977] focus:border-[#366977]"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center bg-[#D9D9D9] mt-4">
                            <div
                                className="flex flex-col mb-4 items-center justify-center w-[80%] h-64 border-2 border-dashed rounded-lg bg-[#f4f5f5] cursor-pointer hover:bg-gray-800"
                                onClick={handleClick}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file) {
                                        // setCoverImage(file);
                                        SetFormData({ ...formData, imageUrl: file.name })
                                    }
                                }}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {formData.imageUrl ? (
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            Uploaded Image URL: {formData.imageUrl}
                                        </p>
                                    ) : (
                                        <>
                                            <MdUpload className="w-8 h-8 mb-4 text-gray-500" />

                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG or JPEG (MAX. 2MB)
                                            </p>
                                        </>
                                    )
                                    }

                                </div>
                                <input
                                    type="file"
                                    id="fileInput"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <div className="submit flex justify-center">
                            <button type="submit" className="text-white mt-4 p-4 w-[50%] bg-[#366977] hover:bg-[#153943] focus:outline-none focus:ring-4 focus:ring-[#153943] font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 onCli"
                                onClick={handlebuttonSubmit}
                            >Save</button>

                        </div>
                    </div>
                </form>

            </div>
            <ToastContainer />
        </>
    )
}

export default EditTemplate