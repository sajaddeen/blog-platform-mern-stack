/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';

interface PostActionsProps {
  postId: string;
  authorId: string;
  currentUserId: string | undefined;
}

export default function PostActions({ postId, authorId, currentUserId }: PostActionsProps) {
  const router = useRouter();

  const isAuthor = currentUserId && currentUserId === authorId;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${postId}`);
        router.push('/');
      } catch (err: any) {
        alert('Failed to delete post: ' + err.response?.data?.message);
      }
    }
  };

  if (!isAuthor) {
    return null;
  }

  return (
    <div className="flex space-x-2 mt-4">
      <Button variant="secondary" onClick={() => router.push(`/editor/${postId}`)}>
        Edit Post
      </Button>
      <Button variant="ghost" onClick={handleDelete}>
        Delete Post
      </Button>
    </div>
  );
}