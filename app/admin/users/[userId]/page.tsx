"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { authenticatedFetch } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AddEditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params?.userId as string;
    const isEditing = !!userId && userId !== "new";

    const [loading, setLoading] = useState(isEditing);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        confirmPassword: "",
        isActive: true,
    });

    useEffect(() => {
        if (isEditing) {
            fetchAdminData();
        }
    }, [userId]);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const response = await authenticatedFetch(
                `/api/admin/users/${userId}`,
                { method: "GET" },
                router
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to fetch admin");
            }

            const data = await response.json();
            const admin = data.data;

            setFormData({
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
                phone: admin.phone || "",
                password: "",
                confirmPassword: "",
                isActive: admin.isActive,
            });
        } catch (err: any) {
            setError(err.message || "Failed to load admin data");
            console.error("Fetch admin error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const validateForm = (): string | null => {
        if (!formData.email || !formData.firstName || !formData.lastName) {
            return "Email, first name, and last name are required";
        }

        if (!isEditing && !formData.password) {
            return "Password is required for new admins";
        }

        if (formData.password && formData.password.length < 8) {
            return "Password must be at least 8 characters";
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            return "Passwords do not match";
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            setSuccess(null);

            const payload: any = {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone || undefined,
            };

            if (isEditing) {
                if (formData.password) {
                    payload.password = formData.password;
                }
                payload.isActive = formData.isActive;
            } else {
                payload.password = formData.password;
            }

            const url = isEditing ? `/api/admin/users/${userId}` : "/api/admin/users";
            const method = isEditing ? "PUT" : "POST";

            const response = await authenticatedFetch(
                url,
                {
                    method,
                    body: JSON.stringify(payload),
                },
                router
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save admin");
            }

            setSuccess(
                isEditing
                    ? "Admin updated successfully"
                    : "Admin created successfully"
            );

            // Redirect to users list after 1.5 seconds
            setTimeout(() => {
                router.push("/admin/users");
            }, 1500);
        } catch (err: any) {
            setError(err.message || "Failed to save admin");
            console.error("Submit error:", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-2xl mx-auto text-center text-gray-500">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/admin/users" className="text-primary hover:text-secondary-foreground">
                        ← Back to Users
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-2">
                        {isEditing ? "Edit Admin" : "Add New Admin"}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isEditing
                            ? "Update admin details and permissions"
                            : "Create a new administrator account"}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800">{success}</p>
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-lg shadow p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isEditing}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                required
                            />
                        </div>

                        {/* First Name */}
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password {isEditing && "(Leave blank to keep current)"}
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={
                                    isEditing
                                        ? "Leave blank to keep current password"
                                        : "At least 8 characters"
                                }
                                required={!isEditing}
                            />
                        </div>

                        {/* Confirm Password */}
                        {formData.password && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Re-enter password"
                                />
                            </div>
                        )}

                        {/* Status Toggle */}
                        {isEditing && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
                                    Active
                                </label>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 pt-6 border-t border-gray-200">
                            <Link href="/admin/users">
                                <Button variant="outline">Cancel</Button>
                            </Link>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-sectext-secondary-foreground disabled:opacity-50"
                            >
                                {submitting ? "Saving..." : isEditing ? "Update Admin" : "Create Admin"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
