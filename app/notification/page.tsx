"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Notification {
    _id: string;
    title: string;
    body: string;
    timestamp: string;
}

const NotificationComponent = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const handleDeleteCartItem = async (notifyId: string) => {
        try {
            const userDetails = localStorage.getItem("user");
            if (userDetails) {
                const user = JSON.parse(userDetails);
                const userId = user._id;

                const res = await fetch(`http://localhost:5000/notification/?notifyId=${notifyId}&userId=${userId}`, {
                    method: "DELETE",
                });

                if (res.ok) {

                    setNotifications((prev) =>
                        prev.filter((notification) => notification._id !== notifyId)
                    );
                    
                    toast.success("Notification Deleted Successfully!!");
                } else {
                    console.error("Failed to delete notification:", res.statusText);
                    toast.error("Failed to delete notification")
                }
            }
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };
    useEffect(() => {
        const fetchNotifications = async () => {
            const userDetails = localStorage.getItem("user");
            if (userDetails != null) {
                const user = JSON.parse(userDetails);

                if (user) {
                    const userId = user._id;
                    const res = await fetch(`http://localhost:5000/notification/?userId=${userId}`);
                    if (res.ok) {
                        const data = await res.json();
                        const sortedNotifications = data.notifications.sort(
                            (a: Notification, b: Notification) => {
                                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                            }
                        );
                        setNotifications(sortedNotifications);
                    }
                }
            }

        };
        fetchNotifications();
    }, []);

    return (
        <>

            <div className="w-full max-w-2xl mx-auto p-4 ">
                <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Notifications</h2>
                <div className="space-y-4">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">{notification.title}</h3>
                                    <span className="text-xs text-gray-500">
                                        {new Date(notification.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-gray-700">{notification.body}</p>
                                    </div>
                                    <div className="delete">
                                        <button onClick={() => handleDeleteCartItem(notification._id)}>
                                            <Image
                                                src={"/assests/delete.svg"}
                                                alt=""
                                                width={30}
                                                height={30}
                                                className="object-cover rounded-md mr-8"
                                            />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400">No notifications found.</p>
                    )}
                </div>
            </div>
            <ToastContainer />
        </>
    );
};

export default NotificationComponent;
