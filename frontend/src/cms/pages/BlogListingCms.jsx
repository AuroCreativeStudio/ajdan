import React from 'react'
import { HiChartPie, HiUser, HiLogout } from 'react-icons/hi';
import { fetchBlogs } from '../../services/blogService';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function BlogListingCms() {
    const { i18n } = useTranslation();
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs(i18n.language)
          .then(data => {
            console.log('Fetched blog data:', data);
            const sanitizedBlogs = (data?.data || []).map(blog => {
                return {
                  id: blog.documentId,
                  slug: blog.slug || '',
                  title: blog.title || 'Untitled',
                  meta_description: blog.meta_description || 'N/A', // ✅ Add this line
                  descriptionBlocks: Array.isArray(blog.description_1) ? blog.description_1 : [],
                  imageUrl: blog.featured_image?.url || null,
                  altText: blog.alt_text_image || 'No description',
                };
              });
              
            setBlogs(sanitizedBlogs);
         
        })
        .catch(error => {
          console.error('Error fetching blogs:', error);
          setBlogs([]);
        });
    }, [i18n.language]);

  return (
    <>
          {/* Main Content */}
          <div className="flex-1 p-6">
        <div className="mb-6 w-full flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-800">Blogs</h1>
          <button
  onClick={() => navigate('/create')}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  Create
</button>
        </div>

        {/* 👇 Table moved here */}
        <div className="relative overflow-x-auto">
  <table className="w-full text-sm text-left text-gray-500">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3">Title</th>
        <th scope="col" className="px-6 py-3">Slug</th>
        <th scope="col" className="px-6 py-3">Meta-Description</th>
        <th scope="col" className="px-6 py-3">Actions</th>
     
      </tr>
    </thead>
    <tbody>
  {blogs.length > 0 ? (
    blogs.map((blog) => (
      <tr key={blog.id} className="bg-white border-b border-gray-200">
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
        >
          {blog.title}
        </th>
        <td className="px-6 py-4">{blog.slug}</td>
        <td className="px-6 py-4">
          {blog.meta_description}
        </td>
        <td className="px-6 py-4">
          <button className="text-blue-600 hover:underline mr-2">Edit</button>
          <button className="text-red-600 hover:underline">Delete</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
        No blogs available.
      </td>
    </tr>
  )}
</tbody>

  </table>
</div>
</div>
    </>
  )
}
