// Global state
let posts = [];
let filteredPosts = [];
let selectedPost = null;
let currentUser = { name: 'Anonymous User', type: 'student' };
let isLoading = true;
let isRefreshing = false;
let dbService = null;
let subscriptions = null;

// DOM elements
const loadingScreen = document.getElementById('loading-screen');
const app = document.getElementById('app');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const errorDismiss = document.getElementById('error-dismiss');
const successMessage = document.getElementById('success-message');
const successText = document.getElementById('success-text');
const successDismiss = document.getElementById('success-dismiss');
const connectionStatus = document.getElementById('connection-status');
const askQuestionBtn = document.getElementById('ask-question-btn');
const postForm = document.getElementById('post-form');
const questionForm = document.getElementById('question-form');
const searchInput = document.getElementById('search-input');
const subjectFilter = document.getElementById('subject-filter');
const refreshBtn = document.getElementById('refresh-btn');
const postsGrid = document.getElementById('posts-grid');
const emptyState = document.getElementById('empty-state');
const postDetailModal = document.getElementById('post-detail-modal');
const backBtn = document.getElementById('back-btn');
const postDetailContent = document.getElementById('post-detail-content');

// Utility functions
function formatTime(date) {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
}

function formatFullTime(date) {
    return date.toLocaleString();
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showSuccess(message) {
    successText.textContent = message;
    successMessage.classList.remove('hidden');
    setTimeout(() => {
        hideSuccess();
    }, 3000);
}

function hideSuccess() {
    successMessage.classList.add('hidden');
}

function updateConnectionStatus(isOnline) {
    const indicator = connectionStatus.querySelector('.status-indicator');
    const text = connectionStatus.querySelector('span');
    
    if (isOnline) {
        indicator.className = 'status-indicator online';
        text.textContent = 'Live';
    } else {
        indicator.className = 'status-indicator offline';
        text.textContent = 'Offline';
    }
}

// Real-time update handlers
function handlePostsUpdate(payload) {
    console.log('Posts update:', payload);
    
    if (payload.eventType === 'INSERT') {
        // New post added
        loadPosts();
        showSuccess('New question posted!');
    } else if (payload.eventType === 'UPDATE') {
        // Post updated
        loadPosts();
    } else if (payload.eventType === 'DELETE') {
        // Post deleted
        loadPosts();
    }
}

function handleRepliesUpdate(payload) {
    console.log('Replies update:', payload);
    
    if (payload.eventType === 'INSERT') {
        // New reply added
        loadPosts();
        showSuccess('New reply added!');
        
        // If we're viewing the post that got a reply, refresh the detail view
        if (selectedPost && selectedPost.id === payload.new.post_id) {
            setTimeout(() => {
                const updatedPost = posts.find(p => p.id === selectedPost.id);
                if (updatedPost) {
                    selectedPost = updatedPost;
                    renderPostDetail();
                }
            }, 500);
        }
    } else if (payload.eventType === 'UPDATE') {
        // Reply updated
        loadPosts();
    } else if (payload.eventType === 'DELETE') {
        // Reply deleted
        loadPosts();
    }
}

// Initialize app
async function initializeApp() {
    try {
        // Initialize Lucide icons
        lucide.createIcons();
        
        // Initialize database service
        dbService = new DatabaseService();
        
        // Load posts from database
        await loadPosts();
        
        // Set up real-time subscriptions
        subscriptions = dbService.setupRealtimeSubscriptions(
            handlePostsUpdate,
            handleRepliesUpdate
        );
        
        // Update connection status
        updateConnectionStatus(true);
        
        // Populate subject filter
        updateSubjectFilter();
        
        // Render posts
        renderPosts();
        
        // Hide loading screen and show app
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            app.classList.remove('hidden');
            isLoading = false;
        }, 1500);
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('Failed to connect to the database. Please refresh the page.');
        updateConnectionStatus(false);
        
        // Still show the app even if database fails
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            app.classList.remove('hidden');
            isLoading = false;
        }, 1500);
    }
}

// Load posts from database
async function loadPosts() {
    try {
        if (!dbService) return;
        
        const loadedPosts = await dbService.fetchPosts();
        posts = loadedPosts;
        filteredPosts = [...posts];
        
        updateSubjectFilter();
        renderPosts();
        
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('Failed to load discussions. Please try again.');
    }
}

// Update subject filter options
function updateSubjectFilter() {
    const subjects = [...new Set(posts.map(post => post.subject))].sort();
    
    // Clear existing options except "All subjects"
    subjectFilter.innerHTML = '<option value="">All subjects</option>';
    
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
    });
}

// Filter posts based on search and subject
function filterPosts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedSubject = subjectFilter.value;
    
    filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                             post.description.toLowerCase().includes(searchTerm) ||
                             post.author.toLowerCase().includes(searchTerm);
        const matchesSubject = !selectedSubject || post.subject === selectedSubject;
        return matchesSearch && matchesSubject;
    });
    
    renderPosts();
}

// Render posts grid
function renderPosts() {
    if (filteredPosts.length === 0) {
        postsGrid.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }
    
    postsGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    postsGrid.innerHTML = filteredPosts.map(post => `
        <div class="post-card" onclick="openPostDetail('${post.id}')">
            <div class="post-header">
                <div class="post-author">
                    <div class="author-avatar ${post.authorType}">
                        <i data-lucide="user"></i>
                    </div>
                    <div class="author-info">
                        <h4>${post.author}</h4>
                        <p class="author-type ${post.authorType}">${post.authorType}</p>
                    </div>
                </div>
                
                <div class="post-meta">
                    <div class="post-meta-item">
                        <i data-lucide="clock"></i>
                        <span>${formatTime(post.timestamp)}</span>
                    </div>
                    <div class="post-meta-item">
                        <i data-lucide="message-circle"></i>
                        <span>${post.replies.length}</span>
                    </div>
                </div>
            </div>

            <div class="post-content">
                <div class="post-subject">
                    <i data-lucide="book-open"></i>
                    <span class="subject-tag">${post.subject}</span>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-description">${post.description}</p>
            </div>

            ${post.replies.length > 0 ? `
                <div class="post-footer">
                    <p class="latest-reply">Latest reply from ${post.replies[post.replies.length - 1].author}</p>
                </div>
            ` : ''}
        </div>
    `).join('');
    
    // Re-initialize Lucide icons for new content
    lucide.createIcons();
}

// Open post detail modal
function openPostDetail(postId) {
    selectedPost = posts.find(p => p.id === postId);
    if (!selectedPost) return;
    
    renderPostDetail();
    postDetailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close post detail modal
function closePostDetail() {
    selectedPost = null;
    postDetailModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Render post detail content
function renderPostDetail() {
    if (!selectedPost) return;
    
    postDetailContent.innerHTML = `
        <div class="post-detail">
            <!-- Main Post -->
            <div class="main-post">
                <div class="main-post-header">
                    <div class="main-post-author">
                        <div class="main-author-avatar ${selectedPost.authorType}">
                            <i data-lucide="user"></i>
                        </div>
                        <div class="main-author-info">
                            <h2>${selectedPost.author}</h2>
                            <p class="author-type ${selectedPost.authorType}">${selectedPost.authorType}</p>
                        </div>
                    </div>
                    
                    <div class="main-post-time">
                        <i data-lucide="clock"></i>
                        <span>${formatFullTime(selectedPost.timestamp)}</span>
                    </div>
                </div>

                <div class="main-post-content">
                    <span class="subject-tag">${selectedPost.subject}</span>
                    <h1 class="main-post-title">${selectedPost.title}</h1>
                    <p class="main-post-description">${selectedPost.description}</p>
                </div>
            </div>

            <!-- Replies Section -->
            <div class="replies-section">
                <div class="replies-header">
                    <i data-lucide="message-circle"></i>
                    <h3>Replies (${selectedPost.replies.length})</h3>
                </div>

                <!-- Reply Form -->
                <div class="reply-form">
                    <div class="reply-form-content">
                        <div class="reply-avatar ${currentUser.type}">
                            <i data-lucide="user"></i>
                        </div>
                        <div class="reply-input-container">
                            <div class="reply-author-info">
                                <input type="text" id="reply-author" placeholder="Your name" value="${currentUser.name}" required>
                                <select id="reply-author-type">
                                    <option value="student" ${currentUser.type === 'student' ? 'selected' : ''}>Student</option>
                                    <option value="teacher" ${currentUser.type === 'teacher' ? 'selected' : ''}>Teacher</option>
                                </select>
                            </div>
                            <textarea id="reply-content" placeholder="Write your reply..." rows="3"></textarea>
                            <div class="reply-submit">
                                <button id="submit-reply" class="btn-reply">
                                    <i data-lucide="send"></i>
                                    <span>Reply</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Replies List -->
                <div class="replies-list">
                    ${selectedPost.replies.length === 0 ? `
                        <div class="no-replies">
                            <i data-lucide="message-circle"></i>
                            <p>No replies yet. Be the first to help!</p>
                        </div>
                    ` : selectedPost.replies.map(reply => `
                        <div class="reply-item">
                            <div class="reply-avatar-small ${reply.authorType}">
                                <i data-lucide="user"></i>
                            </div>
                            <div class="reply-content">
                                <div class="reply-header">
                                    <div class="reply-author">
                                        <h4>${reply.author}</h4>
                                        <p class="author-type ${reply.authorType}">${reply.authorType}</p>
                                    </div>
                                    <span class="reply-time">${formatFullTime(reply.timestamp)}</span>
                                </div>
                                <p class="reply-text">${reply.content}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Re-initialize Lucide icons
    lucide.createIcons();
    
    // Add reply form event listeners
    const submitReplyBtn = document.getElementById('submit-reply');
    const replyContent = document.getElementById('reply-content');
    const replyAuthor = document.getElementById('reply-author');
    const replyAuthorType = document.getElementById('reply-author-type');
    
    submitReplyBtn.addEventListener('click', async () => {
        const content = replyContent.value.trim();
        const author = replyAuthor.value.trim();
        const authorType = replyAuthorType.value;
        
        if (!content || !author) {
            showError('Please fill in all fields.');
            return;
        }
        
        await submitReply(content, author, authorType);
    });
}

// Submit a reply
async function submitReply(content, author, authorType) {
    if (!selectedPost || !dbService) return;
    
    try {
        submitReplyBtn = document.getElementById('submit-reply');
        submitReplyBtn.disabled = true;
        submitReplyBtn.innerHTML = '<i data-lucide="loader"></i><span>Posting...</span>';
        lucide.createIcons();
        
        const replyData = {
            content: content,
            author: author,
            authorType: authorType,
            postId: selectedPost.id
        };
        
        await dbService.createReply(replyData);
        
        // Update current user
        currentUser.name = author;
        currentUser.type = authorType;
        
        // Clear form
        document.getElementById('reply-content').value = '';
        
        showSuccess('Reply posted successfully!');
        
    } catch (error) {
        console.error('Error submitting reply:', error);
        showError('Failed to post reply. Please try again.');
    } finally {
        const submitReplyBtn = document.getElementById('submit-reply');
        if (submitReplyBtn) {
            submitReplyBtn.disabled = false;
            submitReplyBtn.innerHTML = '<i data-lucide="send"></i><span>Reply</span>';
            lucide.createIcons();
        }
    }
}

// Submit a new post
async function submitPost(postData) {
    if (!dbService) {
        showError('Database connection not available.');
        return;
    }
    
    try {
        const submitBtn = document.getElementById('submit-question');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader"></i><span>Posting...</span>';
        lucide.createIcons();
        
        await dbService.createPost(postData);
        
        // Update current user
        currentUser.name = postData.author;
        currentUser.type = postData.authorType;
        
        // Hide form and reset
        postForm.classList.add('hidden');
        askQuestionBtn.textContent = 'Ask Question';
        questionForm.reset();
        
        showSuccess('Question posted successfully!');
        
    } catch (error) {
        console.error('Error submitting post:', error);
        showError('Failed to post question. Please try again.');
    } finally {
        const submitBtn = document.getElementById('submit-question');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i data-lucide="send"></i><span>Post Question</span>';
            lucide.createIcons();
        }
    }
}

// Refresh posts
async function refreshPosts() {
    if (isRefreshing) return;
    
    isRefreshing = true;
    refreshBtn.disabled = true;
    refreshBtn.classList.add('refreshing');
    
    try {
        await loadPosts();
        showSuccess('Discussions refreshed!');
    } catch (error) {
        showError('Failed to refresh discussions.');
    } finally {
        isRefreshing = false;
        refreshBtn.disabled = false;
        refreshBtn.classList.remove('refreshing');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', initializeApp);

// Error and success dismiss
errorDismiss.addEventListener('click', hideError);
successDismiss.addEventListener('click', hideSuccess);

// Ask question button
askQuestionBtn.addEventListener('click', () => {
    const isFormVisible = !postForm.classList.contains('hidden');
    
    if (isFormVisible) {
        postForm.classList.add('hidden');
        askQuestionBtn.textContent = 'Ask Question';
    } else {
        postForm.classList.remove('hidden');
        askQuestionBtn.textContent = 'Cancel';
    }
});

// Question form submission
questionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(questionForm);
    const postData = {
        title: formData.get('title') || document.getElementById('question-title').value,
        subject: formData.get('subject') || document.getElementById('question-subject').value,
        description: formData.get('description') || document.getElementById('question-description').value,
        author: formData.get('author') || document.getElementById('author-name').value,
        authorType: formData.get('author-type') || document.querySelector('input[name="author-type"]:checked').value
    };
    
    // Validate required fields
    if (!postData.title.trim() || !postData.subject || !postData.description.trim() || !postData.author.trim()) {
        showError('Please fill in all required fields.');
        return;
    }
    
    await submitPost(postData);
    hideError();
});

// Search input
searchInput.addEventListener('input', filterPosts);

// Subject filter
subjectFilter.addEventListener('change', filterPosts);

// Refresh button
refreshBtn.addEventListener('click', refreshPosts);

// Back button in modal
backBtn.addEventListener('click', closePostDetail);

// Close modal when clicking outside
postDetailModal.addEventListener('click', (e) => {
    if (e.target === postDetailModal) {
        closePostDetail();
    }
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selectedPost) {
        closePostDetail();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (subscriptions && dbService) {
        dbService.cleanupSubscriptions(subscriptions);
    }
});

// Make functions globally available for onclick handlers
window.openPostDetail = openPostDetail;