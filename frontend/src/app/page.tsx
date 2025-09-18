/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import PostCard from '@/components/pages/PostCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = searchQuery ? { search: searchQuery } : {};
        const response = await api.get('/posts', { params });
        setPosts(response.data);
      } catch (err: any) {
        setError('Failed to fetch posts.');
      } finally {
        setLoading(false);
      }
    };
    const handler = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  if (loading) {
    return <div className="text-center mt-8 text-xl text-gray-500">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold mb-4 md:mb-0">Blog Posts</h1>
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-sm"
          />
          {user && (
            <Link href="/editor">
              <Button variant="default">Create Post</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="text-center md:col-span-full text-gray-500">
            No posts found.
          </div>
        )}
      </div>
    </div>
  );
}