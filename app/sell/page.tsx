"use client"
import { useState, useEffect } from "react"
import dotenv from 'dotenv';
import Image from "next/image"
import Link from "next/link"

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

const Sell = () => {
      dotenv.config();
  const [templates, settemplates] = useState<Template[]>([])
  const [loading, setloading] = useState(true)

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template`);

      const data = await response.json();
      settemplates(data.template)

    } catch (error) {
      console.log("Error!:", error)
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="">

        <div className="templates grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-6 p-4 pl-12 ">
          {
            templates.map((template: Template, index) => (
              <Link href={`/template/${template._id}`} key={template._id}>
                <div key={index} className="flex flex-col justify-evenly rounded-md w-[300px] h-[70vh] items-center bg-[rgb(185,185,185)] shadow-[#686666] shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                  <p className="mt-4 font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap w-full text-center px-2">{template.template_name}</p>
                  <div className="w-[190px] h-[250px] overflow-hidden">
                    <Image
                      src={template.defaultValues.imageUrl}
                      alt={template.template_name}
                      priority
                      width={190}
                      height={250}
                      className="rounded-t-lg transition-all duration-300 object-cover w-[190px] h-[250px]"
                    />
                  </div>
                  <h1 className="font-semibold text-lg overflow-hidden text-ellipsis whitespace-nowrap w-full text-center px-2">{template.defaultValues.title}</h1>
                  <p className="truncate">
                    <span className="font-bold">Author:</span>
                    <span className="hover:underline"> {template.defaultValues.author}</span>
                  </p>
                  <p className="truncate">
                    <span className="font-bold">Stream:</span>
                    <span className="hover:underline"> {template.defaultValues.stream}</span>
                  </p>
                  <p className="truncate">
                    <span className="font-bold">Subject:</span>
                    <span className="hover:underline"> {template.defaultValues.subject}</span>
                  </p>
                </div>

              </Link>
            )
            )}
        </div>
      </div>
    </>
  )
}


export default Sell