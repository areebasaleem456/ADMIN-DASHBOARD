"use client";
import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import ProtectedRoute from '../../components/ProtectedRoute';

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  phone: number;
  email: string;
  address1: string;
  address2: string;
  zipCode: string;
  city: string;
  total: number;
  discount: number;
  orderDate: string;
  status: string | null;
  cartItems: {
    name: string;
    image: string;
  }[];
}
export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelecetedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
            _id,
            firstName,
            lastName,
            phone,
            email,
            address1,
            address2,
            zipCode,
            city,
            total,
            discount,
            orderDate,
            status,
            cartItems[] ->{
            name,image}
            }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.log("Error fetching products", error));
  }, []);
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);
  const toggleOrderDetails = (orderId: string) => {
    setSelecetedOrderId((prev) => (prev === orderId ? null : orderId));
  };
  async function handleStatus(
    orderId: string,
    newStatus: string
  ): Promise<void> {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      if (newStatus === "dispatch") {
        Swal.fire("Order Dispatched!", "Order has been dispatched", "success");
      } else if (newStatus === "success") {
        Swal.fire("success!", "Order has been completed", "success");
      }
    } catch (error) {
      Swal.fire("Error!", "Failed To Update Status", "error");
    }
  }

  async function handleDelete(orderId: string): Promise<void> {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });
    if (!result.isConfirmed) return;
    try {
      await client.delete(orderId);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      Swal.fire("Error!", "Error While Deleting Order", "error");
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-100">
        <nav className="bg-orange-700 text-white p-4 shadow-lg flex justify-between items-center flex-wrap">
          <h2 className="text-3xl font-bold text-black mb-2 md:mb-0">
            Admin Dashboard
          </h2>
          <div className="flex gap-6 flex-wrap justify-center md:justify-end">
            {["All", "pending", "dispatch", "success"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-all ${filter === status ? "bg-white text-black font-bold" : " hover:bg-white text-black"}`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </nav>
        {/* table */}

        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-center">Orders:</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm mt-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="pt-2 font-semibold text-left">Order ID</th>
                  <th className="pt-2 pl-10 font-semibold text-left">
                    Customer Name
                  </th>
                  <th className="pt-2 pl-24 font-semibold text-left hidden md:table-cell">
                    Address
                  </th>
                  <th className="pt-2 pl-24 font-semibold text-left hidden md:table-cell">
                    Order Date
                  </th>
                  <th className="pt-2 pl-24 font-semibold text-left hidden md:table-cell">
                    Total
                  </th>
                  <th className="pt-2 pl-24 font-semibold text-left hidden md:table-cell">
                    Order Status
                  </th>
                  <th className="pt-2 pl-24 font-semibold text-left hidden md:table-cell">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="cursor-pointer hover:bg-red-100 transition-all"
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <td className="p-4 pl-8">{order._id}</td>
                      <td className="pl-10">
                        {order.firstName} {order.lastName}
                      </td>
                      <td className="pl-24 hidden md:table-cell">
                        {order.address1}
                      </td>
                      <td className="pl-24 hidden md:table-cell">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="pl-24 hidden md:table-cell">
                        ${order.total}
                      </td>
                      <td className="pl-24 hidden md:table-cell">
                        <select
                          value={order.status || ""}
                          onChange={(e) =>
                            handleStatus(order._id, e.target.value)
                          }
                          className="bg-gray-100 rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="dispatch">Dispatch</option>
                          <option value="success">Success</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 pl-28 hidden md:table-cell">
                        <button
                          onClick={(e: { stopPropagation: () => void; }) => {
                            e.stopPropagation();
                            handleDelete(order._id);
                          }}
                          className="bg-orange-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>

                    {/* Mobile View (Stacked Rows) */}
                    <tr className="md:hidden">
                      <td className="p-4 pl-8">
                        <strong>Order ID:</strong> {order._id}
                      </td>
                      <td className="pl-10">
                        <strong>Customer Name:</strong> {order.firstName}{" "}
                        {order.lastName}
                      </td>
                      <td className="pl-10">
                        <strong>Address:</strong> {order.address1}
                      </td>
                      <td className="pl-10">
                        <strong>Order Date:</strong>{" "}
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="pl-10">
                        <strong>Total:</strong> ${order.total}
                      </td>
                      <td className="pl-10">
                        <strong>Status:</strong> {order.status }
                      </td>
                      <td className="pl-10">
                        <button
                          onClick={(e: { stopPropagation: () => void; }) => {
                            e.stopPropagation();
                            handleDelete(order._id);
                          }}
                          className="bg-orange-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>

                    {selectedOrderId === order._id && (
                      <tr>
                        <td
                          colSpan={7}
                          className="bg-gray-50 p-4 transition-all"
                        >
                          <h3 className="font-bold pb-5">Order Details</h3>
                          <p className="font-semibold">
                            Phone:
                            <strong className="font-normal">
                              {order.phone}
                            </strong>
                          </p>
                          <p className="font-semibold">
                            Email:
                            <strong className="font-normal">
                              {order.email}
                            </strong>
                          </p>
                          <p className="font-semibold">
                            City:
                            <strong className="font-normal">
                              {order.city}
                            </strong>
                          </p>
                          <p className="font-semibold">
                            Zip Code:
                            <strong className="font-normal">
                              {order.zipCode}
                            </strong>
                          </p>
                          <p className="font-semibold">
                            Discount:
                            <strong className="font-normal">
                              {order.discount}
                            </strong>
                          </p>
                          <p className="font-semibold">
                            Order Date:
                            <strong className="font-normal">
                              {order.orderDate}
                            </strong>
                          </p>
                          <p className="font-semibold">
                            Address:
                            <strong className="font-normal">
                              {order.address1}
                            </strong>
                          </p>
                          <p className="font-semibold">
                            Address:
                            <strong className="font-normal">
                              {order.address2}
                            </strong>
                          </p>
                          <h2 className="text-lg font-semibold">Cart Items:</h2>
                          <ul>
                            {order.cartItems.map((item, index) => (
                              <li
                                className="flex justify-between w-[200px] gap-4 pb-4"
                                key={`${order._id} - ${index}`}
                              >
                                {item.name}
                                {item.image && (
                                  <Image
                                    src={urlFor(item.image).url()}
                                    alt="image"
                                    width={50}
                                    height={50}
                                  />
                                )}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
