'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const Client = () => {
    const { data, error, isLoading } = useSWR('/api/user/count', fetcher)

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error: {error.message}</div>

    return <div className="flex flex-wrap gap-2">
        {JSON.stringify(data)}
    </div>
}

export default Client
