import React, { useState} from 'react'
import {createBlogPost} from '../../services/blogService'

function BlogCreate() {
 const [formData, setFormData] = useState({
  title: '',
  meta_description: '',
  meta_keywords: '',
  // alt_text_image: '',
  description_1: '',
  description_2: '',
  description_3: '',
  slug: ''
});


  // const image1Ref = useRef();
  // const image2Ref = useRef();
  // const image3Ref = useRef();
  // const videoRef = useRef();
  // const featuredImageRef = useRef();

   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.meta_description || !formData.meta_keywords || !formData.slug) {
      alert('Please fill in all required fields.');
      return;
    }

    const data = new FormData();

    // Wrap all fields inside a "data" object with the required format
    const payload = {
      title: formData.title,
      slug: formData.slug,
      meta_description: formData.meta_description,
      meta_keywords: formData.meta_keywords,
     
      description_1: [
        {
          type: "paragraph",
          children: [{ type: "text", text: formData.description_1 }],
        },
      ],
      description_2: [
        {
          type: "paragraph",
          children: [{ type: "text", text: formData.description_2 }],
        },
      ],
      description_3: [
        {
          type: "paragraph",
          children: [{ type: "text", text: formData.description_3 }],
        },
      ],
    };


    
    try {
      const response = await createBlogPost(payload);
      console.log('Blog created:', response);
      alert('Blog created successfully!');
    } catch (error) {
      console.error('Error creating blog:', error);

      // Debugging: Log server response
      if (error.response) {
        console.error('Response data:', error.response.data);
     
      }

      alert('Error creating blog. Please check the input and try again.');
    }
  };

  return (
    <>
     <div className="text-2xl font-semibold ml-24 mt-4 mb-4">Create Blog</div>

     <form   onSubmit={handleSubmit} className="mx-24">
     <div className="grid gap-6 mb-6 md:grid-cols-2">
     <div>
     <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
     <input
    type="text"
     name="title"
     value={formData.title}
    onChange={handleChange}
      required
     className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
     />
     </div>
     <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">slug</label>
            <input
               type="text"
              id="slug"
                name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
             
            />
          </div>
        
        </div>
  
  </div>
  <div className="grid gap-6 mb-6 md:grid-cols-2">
    <div>
      <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">
        Meta Description
      </label>
      <input
         type="text"
            name="meta_description"
            value={formData.meta_description}
            onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
       
        required
      />
    </div>
    <div>
      <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900">
        Meta Keywords
      </label>
      <input
         type="text"
            name="meta_keywords"
            value={formData.meta_keywords}
            onChange={handleChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        
        required
      />
    </div>


  {/* <div>
  <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900">
    Upload Image
  </label>
  <input
  type="file"
  id="image"
  name="image1"
  accept="image/*"
  ref={image1Ref} 
    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div> */}
  

{/* 
  <div className="flex items-center justify-center w-full">
          <label
            htmlFor="featured_image"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            Featured Image
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
               ref={featuredImageRef}
               onChange={handleChange}
               className="hidden"
            />
          </label>
        </div> */}
{/* <div>
      <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900  ">
        Text Image
      </label>
      <input
        type="text"
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="John"
        required
      />
    </div> */}

    <div>
  <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">
    Description 1
  </label>
 <textarea
  id="description_1"
  name="description_1"
  rows="4"
  value={formData.description_1}
  onChange={handleChange}
  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  placeholder="Write your thoughts here..."
></textarea>

</div>
<div>
  <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">
    Description 2
  </label>
<textarea
  id="description_2"
  name="description_2"
  rows="4"
 value={formData.description_2}
  onChange={handleChange}
  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  placeholder="Write your thoughts here..."
></textarea>

</div>
<div>
  <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">
    Description 3
  </label>
 <textarea
  id="description_3"
  name="description_3"
  rows="4"
  value={formData.description_3}
  onChange={handleChange}
  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  placeholder="Write your thoughts here..."
></textarea>

</div>
  </div>
</form>
<div className="flex ml-24 justify-start">
  <button
    type="button"
    onClick={handleSubmit} 
    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
               hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
               font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-8"
  >
    Submit
  </button>
</div>

     
 </>
)
}

export default BlogCreate