'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { notFound } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import PostActions from '@/components/pages/PostActions';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
    _id: string;
  };
  createdAt: string;
}

interface Comment {
  _id: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
}

export default function PostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const { user } = useAuthStore();
  const postId = params.id;

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const [postResponse, likesResponse, commentsResponse] = await Promise.all([
          api.get(`/posts/${postId}`),
          api.get(`/posts/${postId}/likes`),
          api.get(`/posts/${postId}/comments`),
        ]);
        setPost(postResponse.data);
        setLikes(likesResponse.data.likesCount);
        setComments(commentsResponse.data);
        interface Like {
          user: string;
        }
        if (user) {
          const userLiked =
            user && '_id' in user
              ? likesResponse.data.usersLiked.some((like: Like) => like.user === (user as { _id: string })._id)
              : false;
          setHasLiked(userLiked);
        }
      } catch (err: unknown) {
        if (
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as { response?: { status?: number } }).response?.status === 'number' &&
          (err as { response: { status: number } }).response.status === 404
        ) {
          notFound();
        }
        setError('Failed to load post.');
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [postId, user]);

  const handleLike = async () => {
    if (!user) {
      alert('You must be logged in to like a post.');
      return;
    }
    try {
      if (hasLiked) {
        await api.delete(`/posts/${postId}/likes`);
        setLikes(likes - 1);
      } else {
        await api.post(`/posts/${postId}/likes`);
        setLikes(likes + 1);
      }
      setHasLiked(!hasLiked);
    } catch {
      setError('Failed to update like status.');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setCommentError('You must be logged in to comment.');
      return;
    }
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
      setCommentError('');
    } catch {
      setCommentError('Failed to post comment.');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading post...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h1 className="text-4xl font-bold mb-4">{post?.title}</h1>
        <div className="text-gray-500 mb-6 flex justify-between items-center">
          <span>
            By{' '}
            <Link href={`/profiles/${post?.author.username}`} className="text-blue-600 hover:underline">
              {post?.author.username}
            </Link>{' '}
            on {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={handleLike}
              disabled={!user}
              className={hasLiked ? 'text-blue-500' : 'text-gray-500'}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {likes}
            </Button>
          </div>
        </div>
        <div className="prose max-w-none text-gray-700">
          <p>{post?.content}</p>
        </div>
        
        <PostActions 
          postId={post!._id} 
          authorId={post!.author._id} 
          currentUserId={(user as { _id?: string })?._id} 
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <div className="mb-6">
          <form onSubmit={handleCommentSubmit} className="flex flex-col space-y-4">
            <textarea
              className="w-full p-2 border rounded-md"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
            {commentError && <p className="text-red-500 text-sm">{commentError}</p>}
            <Button type="submit" disabled={!user}>
              Post Comment
            </Button>
          </form>
        </div>
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                  <span className="font-semibold text-gray-800">
                    {comment.author.username}
                  </span>
                  <span>-</span>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}