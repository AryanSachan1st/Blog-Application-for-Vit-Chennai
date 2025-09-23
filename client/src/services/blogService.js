const API_BASE_URL = 'http://localhost:5000/api/blogs';

// Create a new blog post
const createBlogPost = async (blogData) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    console.log('Sending blog post data:', blogData);
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(blogData),
    });

    console.log('Received response:', response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received data:', data);
    return data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
};

// Get all blog posts with pagination
const getAllBlogPosts = async (page = 1, limit = 9) => {
  try {
    console.log('Fetching blog posts from:', API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received blog posts data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
};

// Get a single blog post by ID
const getBlogPostById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    throw error;
  }
};

const searchBlogPosts = async (query, page = 1, limit = 9) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching blog posts:', error);
    throw error;
  }
};

// Update a blog post by ID
const updateBlogPost = async (id, blogData) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating blog post with ID ${id}:`, error);
    throw error;
  }
};

// Delete a blog post by ID
const deleteBlogPost = async (id) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error);
    throw error;
  }
};

const blogService = {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  searchBlogPosts,
  updateBlogPost,
  deleteBlogPost
};

export default blogService;
