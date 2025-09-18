/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import PostCard from '@/components/pages/PostCard';
import { Input } from '@/components/ui/input';

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
    return <div className="text-center mt-8">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="text-center md:col-span-full">
            No posts found.
          </div>
        )}
      </div>
    </div>
  );
}