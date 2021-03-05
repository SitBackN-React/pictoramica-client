import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import PostLike from './PostLike'
import apiUrl from '../../apiConfig'
import messages from './../AutoDismissAlert/messages'
import Jumbotron from 'react-bootstrap/Jumbotron'
const Post = props => {
  const [post, setPost] = useState(null)
  const [deleted, setDeleted] = useState(false)

  const { msgAlert } = props

  console.log(props)

  useEffect(() => {
    axios({
      url: `${apiUrl}/blogs/${props.match.params.blogId}/posts/${props.match.params.postId}`,
      method: 'GET',
      headers: {
        'Authorization': `Token token=${props.user.token}`
      }
    })
      .then(res => {
        console.log(res)
        return res
      })
      .then(res => setPost(res.data.post))
      .then(() => msgAlert({
        heading: 'Showing selected post',
        message: messages.showPostSuccess,
        variant: 'primary'
      }))
      .catch(error => {
        setPost({ title: '', content: '', like: 0 })
        msgAlert({
          heading: 'Failed to show post' + error.message,
          message: messages.showPostFailure,
          variant: 'danger'
        })
      })
  }, [])

  const destroy = () => {
    axios({
      url: `${apiUrl}/blogs/${props.match.params.blogId}/posts/${props.match.params.postId}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Token token=${props.user.token}`
      }
    })
      .then(() => setDeleted(true))
      .then(() => msgAlert({
        heading: 'Post Deleted',
        message: messages.deletePostSuccess,
        variant: 'success'
      }))
      .catch(error => {
        setPost({ title: '', content: '' })
        msgAlert({
          heading: 'Failed to delete' + error.message,
          message: messages.deletePostFailure,
          variant: 'danger'
        })
      })
  }

  if (!post) {
    return <p>Loading...</p>
  }

  if (deleted) {
    return (
      <Redirect to={`/blogs/${props.match.params.blogId}`} />
    )
  }
  console.log(post)

  const commentsJsx = post.comments.map(comment => (
    <li className="comment-list" key={comment._id}>
      <p>Posted By: {comment.commenter}</p>
      <p>{comment.remark}</p>
    </li>
  ))
  // Checks to see if the user has a postLike or not in the post
  const checkUserLike = post => {
    if (post.postLikes.length === 0) {
      return false
    } else {
      const findPostLike = post.postLikes.filter(postLike => postLike.owner === props.user._id)
      if (findPostLike) {
        if (findPostLike.length === 0) {
          return false
        }
        return true
      } else {
        return false
      }
    }
  }
  console.log()
  // Looks for the postLike id in the post
  // if there is one that the user created, return that 'id'
  // if not, return '0'
  const postLikedId = post => {
    if (post.postLikes.length === 0) {
      return '0'
    } else {
      const findPostLike = post.postLikes.filter(postLike => postLike.owner === props.user._id)
      if (findPostLike.length === 0) {
        return '0'
      } else if (findPostLike) {
        const postLikeId = findPostLike[0]._id
        return postLikeId
      } else {
        return '0'
      }
    }
  }
  // Determines how many postLikes there are in total for each post
  const postLikedCount = post => {
    return post.postLikes.length
  }
  return (
    <div>
      <Jumbotron fluid>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </Jumbotron>
      <div className="post-display">
        {commentsJsx}
      </div>
      <div>
        <Link to={`/blogs/${props.match.params.blogId}/posts/${props.match.params.postId}/comment-create`}>
          <button className="btn btn-primary">Add Comment</button>
        </Link>
        <button className="btn btn-danger" onClick={destroy}>Delete Post</button>
        <Link to={`/blogs/${props.match.params.blogId}/posts/${props.match.params.postId}/edit-post`}>
          <button className="button btn btn-warning">Edit Post</button>
        </Link>
        <Link to={`/blogs/${props.match.params.blogId}/posts/${props.match.params.postId}/comment-delete`}>
          <button className="btn btn-danger">Delete Comment</button>
        </Link>
        <PostLike
          post={post}
          userLiked={checkUserLike(post)}
          postLikedId={postLikedId(post)}
          postLikedCount={postLikedCount(post)}
          {...props}
          user={props.user}
        />
      </div>
      <div>
        <Link to={`/blogs/${props.match.params.blogId}`}>Back to posts</Link>
      </div>
    </div>
  )
}

export default Post
