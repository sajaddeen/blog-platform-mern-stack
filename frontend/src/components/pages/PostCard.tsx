'use client';

import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post._id}`} className="block">
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 cursor-pointer h-full flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
        </div>
        <div className="text-sm text-gray-500 mt-4">
          By{' '}
          <span className="font-semibold text-blue-600 hover:underline">
            {post.author.username}
          </span>{' '}
          on {new Date(post.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}