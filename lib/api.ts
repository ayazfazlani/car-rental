'use client';
export type ApiResponse<T = any> = {
    success: true;
    data: T;
    message?: undefined;
    logout?: undefined;
} | {
    success: false;
    data?: undefined;
    message: string;
    logout: boolean;
}

type QueryProps = {
    url: string,
    auth?: boolean
    headers?: Record<string, string>
}

type GetProps = QueryProps

type PostProps = QueryProps & {
    payload: any,
    isMultipart?: boolean,
}

type PutProps = QueryProps & {
    payload: any,
    isMultipart?: boolean,
}

type PatchProps = QueryProps & {
    payload: any,
    isMultipart?: boolean,
}

type DeleteProps = QueryProps & {
    payload?: any,
}

class Api {

    async apiError(res: any): Promise<{ logout: false, success: false, message: string }> {
        const data = await res.json();
        const message = data?.data?.message || data?.message
        if (message && message === "Invalid or expired token") {
            localStorage.removeItem("token");
            window.location.href = "/admin/login"
            // @ts-expect-error forcing logout
            return { logout: true, success: false, message: data.data.message }
        }

        return { logout: false, success: false, message: message || "Network Error" }
    }

    async get<T>({ url, auth = false, headers = {} }: GetProps): Promise<ApiResponse<T>> {
        const token = localStorage.getItem("token");
        if (!token && auth)
            return { logout: true, success: false, message: "No token found" };
        try {
            const res = await fetch(url, {
                headers: {
                    ...(auth && {
                        Authorization: `Bearer ${token}`,
                    }),
                    ...headers,
                },
            });

            if (!res.ok)
                return this.apiError(res)

            const data = await res.json();
            if (data?.data)
                return { data: data.data, success: true };
            else
                return { data, success: true };
        } catch (error) {
            return { logout: false, success: false, message: "Error fetching data" };
        }
    }

    async post<T>({ url, payload, auth = false, headers, isMultipart = false }: PostProps): Promise<ApiResponse<T>> {
        const token = localStorage.getItem("token");
        if (!token && auth)
            return { logout: true, success: false, message: "No token found" };
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...headers,
                    ...(isMultipart ? {} : {
                        "Content-Type": "application/json",
                    }),
                },
                body: isMultipart ? payload : JSON.stringify(payload),
            });

            if (!res.ok)
                return this.apiError(res)

            const data = await res.json();
            if (data?.data)
                return { data: data.data, success: true };
            else
                return { data, success: true };
        } catch (error) {
            return { logout: false, success: false, message: "Error fetching data" };
        }
    }

    async put<T>({ url, payload, auth = false, headers, isMultipart = false }: PutProps): Promise<ApiResponse<T>> {
        const token = localStorage.getItem("token");
        if (!token && auth)
            return { logout: true, success: false, message: "No token found" };
        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...headers,
                    ...(isMultipart ? {} : {
                        "Content-Type": "application/json",
                    }),
                },
                body: isMultipart ? payload : JSON.stringify(payload),
            });

            if (!res.ok)
                return this.apiError(res)

            const data = await res.json();
            if (data?.data)
                return { data: data.data, success: true };
            else
                return { data, success: true };
        } catch (error) {
            return { logout: false, success: false, message: "Error fetching data" };
        }
    }

    async patch<T>({ url, payload, auth = false, headers, isMultipart = false }: PatchProps): Promise<ApiResponse<T>> {
        const token = localStorage.getItem("token");
        if (!token && auth)
            return { logout: true, success: false, message: "No token found" };
        try {
            const res = await fetch(url, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(isMultipart ? {} : {
                        "Content-Type": "application/json",
                    }),
                },
                body: isMultipart ? payload : JSON.stringify(payload),
            });

            if (!res.ok)
                return this.apiError(res)

            const data = await res.json();
            if (data?.data)
                return { data: data.data, success: true };
            else
                return { data, success: true };
        } catch (error) {
            return { logout: false, success: false, message: "Error fetching data" };
        }
    }

    async delete<T>({ url, payload, auth = false, headers }: DeleteProps): Promise<ApiResponse<T>> {
        const token = localStorage.getItem("token");
        if (!token && auth)
            return { logout: true, success: false, message: "No token found" };
        try {
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(headers ? headers : { "Content-Type": "application/json", }),
                },
                body: payload ? JSON.stringify(payload) : undefined,
            });

            if (!res.ok)
                return this.apiError(res)

            const data = await res.json();
            if (data?.data)
                return { data: data.data, success: true };
            else
                return { data, success: true };
        } catch (error) {
            return { logout: false, success: false, message: "Error fetching data" };
        }
    }

    async queryGet<T>(props: GetProps): Promise<T> {
        const res = await this.get(props)
        if (res.success)
            return res.data as T
        else
            throw new Error(res.message, { cause: res })
    }

    async queryPost<T>(props: PostProps): Promise<T> {
        const res = await this.post(props)
        if (res.success)
            return res.data as T
        else
            throw new Error(res.message, { cause: res })
    }

    async queryPut<T>(props: PutProps): Promise<T> {
        const res = await this.put(props)
        if (res.success)
            return res.data as T
        else
            throw new Error(res.message, { cause: res })
    }

    async queryPatch<T>(props: PatchProps): Promise<T> {
        const res = await this.patch(props)
        if (res.success)
            return res.data as T
        else
            throw new Error(res.message, { cause: res })
    }

    async queryDelete<T>(props: DeleteProps): Promise<T> {
        const res = await this.delete(props)
        if (res.success)
            return res.data as T
        else
            throw new Error(res.message, { cause: res })
    }
}

export const API = new Api();