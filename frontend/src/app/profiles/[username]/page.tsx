/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import api from '@/lib/api';
import PostCard from '@/components/pages/PostCard';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
}

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  posts: Post[];
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profiles/${params.username}`);
        setProfile(response.data);
      } catch (err: any) {
        if (err.response && err.response.status === 404) {
          notFound();
        }
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [params.username]);

  if (loading) {
    return <div className="text-center mt-8 text-xl text-gray-500">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl font-bold mb-2">{profile?.username}</h1>
        <p className="text-gray-600 mb-4">{profile?.email}</p>
        <p className="text-gray-700">{profile?.bio || 'No bio available.'}</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Posts by {profile?.username}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profile?.posts && profile.posts.length > 0 ? (
          profile.posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <p className="text-gray-500 text-center md:col-span-full">No posts found.</p>
        )}
      </div>
    </div>
  );
}