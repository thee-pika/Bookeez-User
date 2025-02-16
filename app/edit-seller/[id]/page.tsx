"use client";
// import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader";

interface Details {
  templateId: string,
  bookId: string,
  name: string,
  email: string,
  address: string
}

const EditSelletDetails = ({ details }: { details: Details }) => {
  // const { id } = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const tokenRef = useRef<string>("");
  const [loading, setloading] = useState<boolean>(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    setFormData({
      name: details.name || "",
      email: details.email || "",
      address: details.address || "",
    });
  }, [details]);

  console.log("detailsssssssssssssssssssssssssssss", details);
  useEffect(() => {
    const newToken = localStorage.getItem('authToken');
    console.log("new token", newToken);
    if (!newToken) {
      return router.push("/auth/login");
    }

    tokenRef.current = newToken
  }, [router]);

  const handleClose = () => {
    console.log("Closing dialog...");
    setOpen(false); // Updates the state
  };

  useEffect(() => {
    if (!open) {
      router.back();
    }
  }, [open, router]);

  useEffect(() => {
    const handleGetSellerDetails = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${details.templateId}/book/${details.bookId}`);
        if (res.ok) {
          const data = await res.json();

          const { book } = data;
          console.log("bookkkkkkkkkkkkkkkkkkkkkkkkk", book);
          setFormData({
            name: book?.sellerDetails.name || "",
            email: book?.sellerDetails.email || "",
            address: book?.sellerDetails.address || "",
          });

          console.log("Fetched book data:", book);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setloading(false);
      } finally {
        setloading(false);
      }
    }

    handleGetSellerDetails();
  }, []);

  if (loading) {
    return <div className="justify-center items-center flex">
      <Loader />
    </div>
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${details.templateId}/book/${details.bookId}/seller/edit`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenRef.current}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          address: formData.address
        })
      }
    );

    if (res.ok) {
      const data = await res.json();
      console.log("res,", data)
      handleClose();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Edit your Details
            </h2>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  email
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSelletDetails;
