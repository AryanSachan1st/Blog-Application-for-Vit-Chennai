import React from 'react';
import BlogItem from './BlogItem';

const BlogList = ({ blogPosts }) => {
  return (
    <div className="blog-list">
      {blogPosts.map((blogPost) => (
        <BlogItem key={blogPost._id} blogPost={blogPost} isHomePage={true} />
      ))}
    </div>
  );
};

export default BlogList;
