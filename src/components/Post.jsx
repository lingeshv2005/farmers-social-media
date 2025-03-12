import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  IconButton, 
  Avatar, 
  Box, 
  CircularProgress,
  Chip,
  Fab,
  TextField,
  Button,
  Collapse
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  Comment, 
  Delete,
  Share,
  Add,
  Send
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axios';
import { ENDPOINTS, API_BASE_URL } from '../config/api';
import '../styles/Post.css';

function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedPost, setExpandedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuth');
    
    if (!token || !isAuth) {
      navigate('/login');
      return;
    }
    fetchPosts();
  }, [navigate]);

  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) {
      console.log('No image URL provided');
      return null;
    }
    
    console.log('Formatting image URL:', imageUrl);
    
    // If it's already a full URL, return it
    if (imageUrl.startsWith('http')) {
      console.log('Full URL detected:', imageUrl);
      return imageUrl;
    }
    
    // If it starts with /uploads/, it's already in the correct format
    if (imageUrl.startsWith('/uploads/')) {
      const formattedUrl = `${API_BASE_URL}${imageUrl}`;
      console.log('Formatted uploads URL:', formattedUrl);
      return formattedUrl;
    }
    
    // If it's just a filename, construct the full URL
    const formattedUrl = `${API_BASE_URL}/uploads/${imageUrl}`;
    console.log('Formatted filename URL:', formattedUrl);
    return formattedUrl;
  };

  const fetchPosts = async () => {
    try {
                    setLoading(true);
      setError('');
      
      const response = await axiosInstance.get(ENDPOINTS.POSTS);
      console.log('Posts response:', response.data);
      
      if (response.data && response.data.posts) {
        console.log('Sample post:', response.data.posts[0]);
        const formattedPosts = response.data.posts.map(post => {
          console.log('Processing post:', post);
          return {
            ...post,
            postId: post.postId || post._id,
            images: Array.isArray(post.images) ? post.images : [],
            authorName: post.authorName || '',
            postType: post.postType || 'farmUpdate',
            likeUsers: Array.isArray(post.likeUsers) ? post.likeUsers : [],
            likeCount: post.likeCount || 0,
            commentCount: post.commentCount || 0
          };
        });
        setPosts(formattedPosts);
      } else {
        console.warn('Unexpected response format:', response.data);
        setPosts([]);
      }
    } catch (err) {
      console.error('Fetch posts error:', err);
      
      if (err.response?.status === 502) {
        setError('Server is temporarily unavailable. Retrying...');
        toast.warning('Server is temporarily unavailable. Retrying...');
      } else if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('isAuth');
        navigate('/login');
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch posts';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
                    setLoading(false);
                }
  };

  const handleLike = async (postId) => {
    try {
      console.log('Liking post with ID:', postId);
      const response = await axiosInstance.put(`${ENDPOINTS.LIKE_POST}/${postId}`, {
        likeUserId: userId
      });
      
      if (response.data && response.data.success) {
        setPosts(posts.map(post => {
          if (post.postId === postId) {
            return {
              ...post,
              likeCount: response.data.post.likeCount,
              likeUsers: response.data.post.likeUsers
            };
          }
          return post;
        }));
        
        toast.success(response.data.message);
      }
    } catch (err) {
      console.error('Like error:', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Failed to like post');
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await axiosInstance.delete(`${ENDPOINTS.DELETE_POST}/${postId}`);
      
      if (response.data.success) {
        toast.success('Post deleted successfully');
        setPosts(posts.filter(post => post.postId !== postId));
      }
    } catch (err) {
      toast.error('Failed to delete post');
      console.error('Delete error:', err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await axiosInstance.get(`${ENDPOINTS.GET_COMMENTS}/${postId}`);
      if (response.data.success) {
        setComments(prev => ({
          ...prev,
          [postId]: response.data.comments || []
        }));
      }
    } catch (err) {
      console.error('Fetch comments error:', err);
      toast.error(err.response?.data?.message || 'Failed to load comments');
    }
  };

  const handleComment = async (postId) => {
    if (!comment.trim()) return;

    try {
      const response = await axiosInstance.post(ENDPOINTS.ADD_COMMENT, {
        postId,
        content: comment.trim(),
        userId,
        authorName: username
      });

      if (response.data.success) {
        const newComment = response.data.comment;
        setComments(prev => ({
                ...prev,
          [postId]: [...(prev[postId] || []), newComment]
        }));
        
        setPosts(posts.map(post => {
          if (post.postId === postId) {
            return {
                                ...post, 
              commentCount: (post.commentCount || 0) + 1
            };
          }
          return post;
        }));

        setComment('');
        toast.success(response.data.message || 'Comment added successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
      console.error('Comment error:', err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await axiosInstance.delete(`${ENDPOINTS.DELETE_COMMENT}/${commentId}`);
      
      if (response.data.success) {
        setComments(prev => ({
          ...prev,
          [postId]: prev[postId].filter(comment => comment._id !== commentId)
        }));
        
        setPosts(posts.map(post => {
          if (post.postId === postId) {
            return {
              ...post,
              commentCount: Math.max(0, (post.commentCount || 0) - 1)
            };
          }
          return post;
        }));

        toast.success(response.data.message || 'Comment deleted successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment');
      console.error('Delete comment error:', err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleExpandComments = (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      fetchComments(postId);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        gap={3}
        textAlign="center"
        padding={3}
      >
        <Typography variant="h5" color="textSecondary">
          No posts available
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ maxWidth: '400px' }}>
          Be the first to share your farming experiences and connect with other farmers in the community.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/create-post')}
          sx={{
            mt: 2,
            padding: '10px 24px',
            borderRadius: '20px',
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          Create Your First Post
        </Button>
      </Box>
    );
  }

  return (
    <motion.div 
      className="posts-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Fab 
        color="primary" 
        aria-label="add post"
        onClick={() => navigate('/create-post')}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
      >
        <Add />
      </Fab>
      
      {posts.map((post) => (
        <motion.div
          key={post.postId}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="post-card">
            <Box className="post-header">
              <Box className="post-user-info">
                <Avatar alt={post.authorName} src="/default-avatar.png" />
                <Box>
                  <Typography variant="h6">{post.authorName}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatDate(post.createdAt)}
                  </Typography>
                </Box>
              </Box>
              {post.userId === userId && (
                <IconButton onClick={() => handleDelete(post.postId)} color="error">
                  <Delete />
                </IconButton>
              )}
            </Box>

            <CardContent>
              <Typography variant="h6" gutterBottom>
                {post.title}
              </Typography>
              <Typography variant="body1" className="post-content">
                {post.content}
              </Typography>
              <Box mt={1}>
                <Chip 
                  label={post.postType} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
            </CardContent>

            <Box 
              className="post-image-container"
              sx={{
                width: '100%',
                backgroundColor: '#f5f5f5',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '4px',
                marginTop: '16px',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {post.images && post.images.length > 0 ? (
                <>
                  <CardMedia
                    component="img"
                    image={post.images[0]}
                    alt="Post image"
                    className="post-image"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '500px',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                    onError={(e) => {
                      console.error('Image loading error:', e);
                      console.error('Failed image URL:', post.images[0]);
                      console.error('Post data:', post);
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                  {post.images.length > 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    >
                      +{post.images.length - 1} more
                    </Box>
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    color: '#666',
                    textAlign: 'center',
                    padding: 2
                  }}
                >
                  <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                    No Image
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    This post doesn't contain any images
                  </Typography>
                </Box>
              )}
            </Box>

            <Box className="post-actions">
              <Box className="action-item">
                <IconButton 
                  onClick={() => handleLike(post.postId)} 
                  color={post.likeUsers?.includes(userId) ? "error" : "default"}
                >
                  {post.likeUsers?.includes(userId) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <Typography>{post.likeCount || 0}</Typography>
              </Box>
              <Box className="action-item">
                <IconButton onClick={() => handleExpandComments(post.postId)} color="primary">
                  <Comment />
                </IconButton>
                <Typography>{post.commentCount || 0}</Typography>
              </Box>
              <Box className="action-item">
                <IconButton color="primary">
                  <Share />
                </IconButton>
              </Box>
            </Box>

            <Collapse in={expandedPost === post.postId}>
              <Box className="comments-section">
                <Box className="comments-list">
                  <AnimatePresence>
                    {comments[post.postId]?.map((comment) => (
                      <motion.div
                        key={comment._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="comment"
                      >
                        <Box className="comment-header">
                          <Avatar 
                            alt={comment.authorName} 
                            src="/default-avatar.png" 
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="subtitle2">{comment.authorName}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                        <Typography variant="body2">{comment.content}</Typography>
                        {comment.userId === userId && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteComment(post.postId, comment._id)}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
                <Box className="comment-input">
                  <TextField
                    fullWidth
                    size="small"
                            placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                                    handleComment(post.postId);
                                }
                            }}
                  />
                  <IconButton 
                    color="primary"
                    onClick={() => handleComment(post.postId)}
                    disabled={!comment.trim()}
                  >
                    <Send />
                  </IconButton>
                </Box>
              </Box>
            </Collapse>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default Post;
