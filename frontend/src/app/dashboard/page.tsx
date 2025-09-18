/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import PostCard from '@/components/pages/PostCard';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    const fetchMyPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/posts/my-posts');
        setPosts(response.data);
      } catch (err: any) {
        setError('Failed to fetch your posts.');
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, [user, router]);

  if (loading) {
    return <div className="text-center mt-8 text-xl text-gray-500">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">My Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="text-center md:col-span-full text-gray-500">
            You haven't created any posts yet.
          </div>
        )}
      </div>
    </div>
  );
}