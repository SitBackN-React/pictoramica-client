import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

import apiUrl from '../../apiConfig'
import BlogForm from './../shared/BlogForm'
import messages from './../AutoDismissAlert/messages'

const BlogCreate = props => {
  const [blog, setBlog] = useState({
    title: ''
  })
  const [createdBlogId, setCreatedBlogId] = useState(null)
  // when the a blog is created
  const handleChange = event => {
    // get data from the blog form event
    const updatedField = { [event.target.name]: event.target.value }
    // update the blog object with the input data
    const editedBlog = Object.assign({}, blog, updatedField)
    // set blog state with updated blog object data
    setBlog(editedBlog)
  }

  const handleSubmit = event => {
    // prevent page from refreshing
    event.preventDefault()
    // set msgAlert as prop in order to pass it into this component
    const { msgAlert } = props
    // POST request to API to create new blog
    axios({
      url: `${apiUrl}/blogs`,
      method: 'POST',
      headers: {
        'Authorization': `Token token=${props.user.token}`
      },
      data: { blog }
    })
      // set the blog id with the id from the api response
      .then(res => setCreatedBlogId(res.data.blog._id))
      // show success message
      .then(() => msgAlert({
        heading: 'Create blog success',
        message: messages.createBlogSuccess,
        variant: 'success'
      }))
      // catch error if there is a problem submitting the form to create blog
      .catch(error => {
        setBlog({ title: '' })
        msgAlert({
          heading: 'Create blog failed: ' + error.message,
          message: messages.createBlogFailure,
          variant: 'danger'
        })
      })
  }
  // if blog id was created, go to specific blog
  if (createdBlogId) {
    return <Redirect to={`/blogs/${createdBlogId}`} />
  }
  // return data from blogform as well as handle change and handle submit from form
  return (
    <div>
      <BlogForm
        blog={blog}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        cancelPath='/blogs'
      />
    </div>
  )
}

export default BlogCreate
