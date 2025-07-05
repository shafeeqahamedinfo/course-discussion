// Supabase client configuration
const SUPABASE_URL = 'https://ebdnytclbyamcmeposkf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZG55dGNsYnlhbWNtZXBvc2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4Mzc4MDIsImV4cCI6MjA2NjQxMzgwMn0.YgAflrDA1lBRrgivvg_5-U9Lc2DZSwy2v4d2Z0oPZWU';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database operations
class DatabaseService {
    // Fetch all posts with their replies
    async fetchPosts() {
        try {
            const { data: posts, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    replies (*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Transform data to match existing format
            return posts.map(post => ({
                id: post.id,
                title: post.title,
                subject: post.subject,
                description: post.description,
                author: post.author,
                authorType: post.author_type,
                timestamp: new Date(post.created_at),
                replies: post.replies.map(reply => ({
                    id: reply.id,
                    content: reply.content,
                    author: reply.author,
                    authorType: reply.author_type,
                    timestamp: new Date(reply.created_at),
                    postId: reply.post_id
                })).sort((a, b) => a.timestamp - b.timestamp)
            }));
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    }

    // Create a new post
    async createPost(postData) {
        try {
            const { data, error } = await supabase
                .from('posts')
                .insert([{
                    title: postData.title,
                    subject: postData.subject,
                    description: postData.description,
                    author: postData.author,
                    author_type: postData.authorType
                }])
                .select()
                .single();

            if (error) throw error;

            return {
                id: data.id,
                title: data.title,
                subject: data.subject,
                description: data.description,
                author: data.author,
                authorType: data.author_type,
                timestamp: new Date(data.created_at),
                replies: []
            };
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    // Create a new reply
    async createReply(replyData) {
        try {
            const { data, error } = await supabase
                .from('replies')
                .insert([{
                    content: replyData.content,
                    author: replyData.author,
                    author_type: replyData.authorType,
                    post_id: replyData.postId
                }])
                .select()
                .single();

            if (error) throw error;

            return {
                id: data.id,
                content: data.content,
                author: data.author,
                authorType: data.author_type,
                timestamp: new Date(data.created_at),
                postId: data.post_id
            };
        } catch (error) {
            console.error('Error creating reply:', error);
            throw error;
        }
    }

    // Set up real-time subscriptions
    setupRealtimeSubscriptions(onPostsUpdate, onRepliesUpdate) {
        // Subscribe to posts changes
        const postsSubscription = supabase
            .channel('posts-changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'posts' }, 
                onPostsUpdate
            )
            .subscribe();

        // Subscribe to replies changes
        const repliesSubscription = supabase
            .channel('replies-changes')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'replies' }, 
                onRepliesUpdate
            )
            .subscribe();

        return { postsSubscription, repliesSubscription };
    }

    // Clean up subscriptions
    cleanupSubscriptions(subscriptions) {
        if (subscriptions.postsSubscription) {
            supabase.removeChannel(subscriptions.postsSubscription);
        }
        if (subscriptions.repliesSubscription) {
            supabase.removeChannel(subscriptions.repliesSubscription);
        }
    }
}

// Export the service
window.DatabaseService = DatabaseService;