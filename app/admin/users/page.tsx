"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AdminUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface ApiResponse {
    success: boolean;
    data: {
        admins: AdminUser[];
        pagination: PaginationMeta;
    };
}

export default function UsersManagementPage() {
    const router = useRouter();
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationMeta>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });
    const [search, setSearch] = useState("");
    const [isActive, setIsActive] = useState<string>("");
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchAdmins = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                ...(search && { search }),
                ...(isActive && { isActive }),
            });

            const response = await authenticatedFetch(
                `/api/admin/users?${params}`,
                { method: "GET" },
                router
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to fetch admins");
            }

            const data: ApiResponse = await response.json();
            setAdmins(data.data.admins);
            setPagination(data.data.pagination);
        } catch (err: any) {
            setError(err.message || "Failed to load admins");
            console.error("Fetch admins error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins(1);
    }, [search, isActive]);

    const handleDelete = async (userId: string) => {
        if (!window.confirm("Are you sure you want to delete this admin?")) {
            return;
        }

        try {
            setDeleting(userId);

            const response = await authenticatedFetch(
                `/api/admin/users/${userId}`,
                { method: "DELETE" },
                router
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to delete admin");
            }

            // Refresh the list
            fetchAdmins(pagination.page);
        } catch (err: any) {
            setError(err.message || "Failed to delete admin");
            console.error("Delete admin error:", err);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Admin Management
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Manage administrators and their permissions
                        </p>
                    </div>
                    <Link href="/admin/users/new">
                        <Button>Add New Admin</Button>
                    </Link>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search
                            </label>
                            <input
                                type="text"
                                placeholder="Search by email, name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={isActive}
                                onChange={(e) => setIsActive(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            Loading admins...
                        </div>
                    ) : admins.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No admins found
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Phone
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {admins.map((admin) => (
                                            <tr key={admin.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {admin.firstName} {admin.lastName}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {admin.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {admin.phone || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${admin.isActive
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                            }`}
                                                    >
                                                        {admin.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {new Date(admin.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                    <Link href={`/admin/users/${admin.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(admin.id)}
                                                        disabled={deleting === admin.id}
                                                        className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded border border-red-200 disabled:opacity-50"
                                                    >
                                                        {deleting === admin.id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Page {pagination.page} of {pagination.totalPages} (
                                        {pagination.total} total)
                                    </div>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() =>
                                                fetchAdmins(Math.max(1, pagination.page - 1))
                                            }
                                            disabled={pagination.page === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() =>
                                                fetchAdmins(
                                                    Math.min(pagination.totalPages, pagination.page + 1)
                                                )
                                            }
                                            disabled={pagination.page === pagination.totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
