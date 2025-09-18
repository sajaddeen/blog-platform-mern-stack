/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function EditorPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/posts/${postId}`);
          setTitle(response.data.title);
          setContent(response.data.content);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load post for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (postId) {
        await api.patch(`/posts/${postId}`, { title, content });
      } else {
        await api.post('/posts', { title, content });
      }
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {postId ? 'Edit Post' : 'Create New Post'}
      </h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className={loading ? 'opacity-50 pointer-events-none' : ''}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <Input
            id="title"
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent} 
            className="h-64 mb-12" 
          />
        </div>
        <div className="flex justify-center mt-12">
          <Button type="submit" disabled={loading}>
            {postId ? 'Update Post' : 'Publish Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}