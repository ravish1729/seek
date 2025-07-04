import db from './sqliteConnect.js';

export const cleanAllTables = async () => {
    const dropTableQueries = [
        // Drop FTS virtual tables first (they reference regular tables)
        'DROP TABLE IF EXISTS content_tags_fts',
        'DROP TABLE IF EXISTS content_description_fts', 
        'DROP TABLE IF EXISTS comments_fts',
        
        // Drop regular tables
        'DROP TABLE IF EXISTS content_votes',
        'DROP TABLE IF EXISTS content_tag',
        'DROP TABLE IF EXISTS tags',
        'DROP TABLE IF EXISTS comments',
        'DROP TABLE IF EXISTS content_description',
        'DROP TABLE IF EXISTS content',
        'DROP TABLE IF EXISTS users'
    ];

    try {
        // Execute all drop queries
        for (const query of dropTableQueries) {
            db.prepare(query).run();
        }

        console.log("All SQLite tables cleaned successfully.");
    } catch (err) {
        console.error('Error cleaning SQLite tables:', err);
        throw err;
    }
};

export const sqliteTableSetup = async () => {
    const createTableQueries = [
        // Users table
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            public_key TEXT UNIQUE NOT NULL,
            content_count INTEGER DEFAULT 0,
            points INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // Content table
        `CREATE TABLE IF NOT EXISTS content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            hash TEXT UNIQUE NOT NULL,
            title TEXT,
            file_size TEXT,
            network TEXT,
            upvotes INTEGER DEFAULT 0,
            downvotes INTEGER DEFAULT 0,
            comment_count INTEGER DEFAULT 0,
            file_type TEXT,
            file_category TEXT,
            thumbnail TEXT,
            metadata_cid TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,

        // Content description table
        `CREATE TABLE IF NOT EXISTS content_description (
            content_id INTEGER PRIMARY KEY,
            description TEXT,
            license TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (content_id) REFERENCES content(id)
        )`,

        // Comments table
        `CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            comment TEXT,
            content_id INTEGER,
            user_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (content_id) REFERENCES content(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`,

        // Tags table
        `CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tag_name TEXT UNIQUE NOT NULL
        )`,

        // Content tag junction table
        `CREATE TABLE IF NOT EXISTS content_tag (
            content_id INTEGER,
            tag_id INTEGER,
            PRIMARY KEY (content_id, tag_id),
            FOREIGN KEY (content_id) REFERENCES content(id),
            FOREIGN KEY (tag_id) REFERENCES tags(id)
        )`,

        // Content votes table
        `CREATE TABLE IF NOT EXISTS content_votes (
            content_id INTEGER,
            user_id INTEGER,
            vote_type BOOLEAN NOT NULL, -- true for upvote, false for downvote
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (content_id, user_id),
            FOREIGN KEY (content_id) REFERENCES content(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`
    ];

    // Create FTS virtual tables for full-text search
    const createFTSQueries = [
        // FTS table for content tags
        `CREATE VIRTUAL TABLE IF NOT EXISTS content_tags_fts USING fts5(
            content_id UNINDEXED,
            tags,
            content='content_tag',
            content_rowid='content_id'
        )`,

        // FTS table for content descriptions
        `CREATE VIRTUAL TABLE IF NOT EXISTS content_description_fts USING fts5(
            content_id UNINDEXED,
            description,
            content='content_description',
            content_rowid='content_id'
        )`,

        // FTS table for comments
        `CREATE VIRTUAL TABLE IF NOT EXISTS comments_fts USING fts5(
            comment_id UNINDEXED,
            comment,
            content_id UNINDEXED,
            content='comments',
            content_rowid='id'
        )`
    ];

    // Create indexes
    const createIndexQueries = [
        'CREATE INDEX IF NOT EXISTS users_public_key_idx ON users(public_key)',
        'CREATE INDEX IF NOT EXISTS content_hash_idx ON content(hash)',
        'CREATE INDEX IF NOT EXISTS content_metadata_cid_idx ON content(metadata_cid)',
        'CREATE INDEX IF NOT EXISTS content_user_id_idx ON content(user_id)',
        'CREATE INDEX IF NOT EXISTS content_id_comments_idx ON comments(content_id)',
        'CREATE INDEX IF NOT EXISTS tag_name_idx ON tags(tag_name)',
        'CREATE INDEX IF NOT EXISTS content_tag_idx ON content_tag(content_id)',
        'CREATE INDEX IF NOT EXISTS content_votes_user_id_idx ON content_votes(user_id)',
        'CREATE INDEX IF NOT EXISTS content_votes_content_id_idx ON content_votes(content_id)'
    ];

    try {
        // Execute all table creation queries
        for (const query of createTableQueries) {
            db.prepare(query).run();
        }

        // Add content_cid column if it doesn't exist (migration)
        // try {
        //     db.prepare('ALTER TABLE content ADD COLUMN title TEXT').run();
        // } catch (err: any) {
        //     // Column already exists, ignore error
        //     if (!err.message.includes('duplicate column name')) {
        //         console.log('content_cid column already exists or error:', err.message);
        //     }
        // }

        // Execute all FTS table creation queries
        for (const query of createFTSQueries) {
            db.prepare(query).run();
        }

        // Execute all index creation queries
        for (const query of createIndexQueries) {
            db.prepare(query).run();
        }

        console.log("SQLite tables, FTS virtual tables, and indexes created successfully or already exist.");
    } catch (err) {
        console.error('Error creating SQLite tables:', err);
        throw err;
    }
};

// Function to update content vote counts (SQLite doesn't have triggers like PostgreSQL)
export const updateContentVoteCounts = (contentId: number) => {
    try {
        const voteCounts = db.prepare(`
            SELECT 
                SUM(CASE WHEN vote_type = 1 THEN 1 ELSE 0 END) as upvotes,
                SUM(CASE WHEN vote_type = 0 THEN 1 ELSE 0 END) as downvotes
            FROM content_votes 
            WHERE content_id = ?
        `).get(contentId) as { upvotes: number; downvotes: number } | undefined;

        const upvotes = voteCounts?.upvotes || 0;
        const downvotes = voteCounts?.downvotes || 0;

        db.prepare(`
            UPDATE content 
            SET upvotes = ?, downvotes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(upvotes, downvotes, contentId);

        return { upvotes, downvotes };
    } catch (err) {
        console.error('Error updating vote counts:', err);
        throw err;
    }
};

// Function to get content tags as a searchable string
export const getContentTagsString = (contentId: number): string => {
    try {
        const tags = db.prepare(`
            SELECT t.tag_name
            FROM content_tag ct
            JOIN tags t ON ct.tag_id = t.id
            WHERE ct.content_id = ?
        `).all(contentId);

        return tags.map((tag: any) => tag.tag_name).join(' ');
    } catch (err) {
        console.error('Error getting content tags:', err);
        return '';
    }
};

// Function to update FTS tables when content tags change
export const updateContentTagsFTS = (contentId: number) => {
    try {
        const tags = getContentTagsString(contentId);
        
        // Delete existing entry if any
        db.prepare('DELETE FROM content_tags_fts WHERE content_id = ?').run(contentId);
        
        // Insert new entry with tags
        if (tags.trim()) {
            db.prepare('INSERT INTO content_tags_fts(content_id, tags) VALUES (?, ?)').run(contentId, tags);
        }
    } catch (err) {
        console.error('Error updating content tags FTS:', err);
        throw err;
    }
};

// Function to update FTS tables when content description changes
export const updateContentDescriptionFTS = (contentId: number) => {
    try {
        const description = db.prepare(`
            SELECT description FROM content_description WHERE content_id = ?
        `).get(contentId) as { description: string } | undefined;

        // Delete existing entry if any
        db.prepare('DELETE FROM content_description_fts WHERE content_id = ?').run(contentId);
        
        // Insert new entry with description
        if (description?.description?.trim()) {
            db.prepare('INSERT INTO content_description_fts(content_id, description) VALUES (?, ?)').run(contentId, description.description);
        }
    } catch (err) {
        console.error('Error updating content description FTS:', err);
        throw err;
    }
};

// Function to update FTS tables when comments change
export const updateCommentsFTS = (commentId: number) => {
    try {
        const comment = db.prepare(`
            SELECT comment, content_id FROM comments WHERE id = ?
        `).get(commentId) as { comment: string; content_id: number } | undefined;

        if (comment) {
            // Delete existing entry if any
            db.prepare('DELETE FROM comments_fts WHERE comment_id = ?').run(commentId);
            
            // Insert new entry with comment
            if (comment.comment?.trim()) {
                db.prepare('INSERT INTO comments_fts(comment_id, comment, content_id) VALUES (?, ?, ?)').run(commentId, comment.comment, comment.content_id);
            }
        }
    } catch (err) {
        console.error('Error updating comments FTS:', err);
        throw err;
    }
};

// Function to search content using FTS
export const searchContentFTS = (searchQuery: string, limit: number = 20, offset: number = 0) => {
    try {
        // Search in tags
        const tagResults = db.prepare(`
            SELECT content_id, rank FROM content_tags_fts 
            WHERE tags MATCH ? 
            ORDER BY rank
            LIMIT ? OFFSET ?
        `).all(searchQuery, limit, offset) as Array<{ content_id: number; rank: number }>;

        // Search in descriptions
        const descriptionResults = db.prepare(`
            SELECT content_id, rank FROM content_description_fts 
            WHERE description MATCH ? 
            ORDER BY rank
            LIMIT ? OFFSET ?
        `).all(searchQuery, limit, offset) as Array<{ content_id: number; rank: number }>;

        // Search in comments
        const commentResults = db.prepare(`
            SELECT content_id, rank FROM comments_fts 
            WHERE comment MATCH ? 
            ORDER BY rank
            LIMIT ? OFFSET ?
        `).all(searchQuery, limit, offset) as Array<{ content_id: number; rank: number }>;

        // Search in titles (using LIKE for partial matches)
        const titleResults = db.prepare(`
            SELECT id as content_id, 
                   CASE 
                       WHEN title LIKE ? THEN 1
                       WHEN title LIKE ? THEN 2
                       ELSE 3
                   END as rank
            FROM content 
            WHERE title LIKE ? OR title LIKE ?
            LIMIT ? OFFSET ?
        `).all(
            searchQuery, // exact match
            `%${searchQuery}%`, // contains
            searchQuery, // exact match
            `%${searchQuery}%`, // contains
            limit, 
            offset
        ) as Array<{ content_id: number; rank: number }>;

        // Combine and deduplicate results
        const allResults = [...tagResults, ...descriptionResults, ...commentResults, ...titleResults];
        const contentScores = new Map<number, number>();

        allResults.forEach(result => {
            const currentScore = contentScores.get(result.content_id) || 0;
            // Adjust scoring: lower rank = higher score, with bonus for title matches
            const score = result.rank <= 2 ? (1 / (result.rank + 1)) * 1.5 : (1 / (result.rank + 1));
            contentScores.set(result.content_id, currentScore + score);
        });

        // Sort by score and get unique content IDs
        const sortedContentIds = Array.from(contentScores.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([contentId]) => contentId);

        return sortedContentIds;
    } catch (err) {
        console.error('Error searching content with FTS:', err);
        return [];
    }
}; 
