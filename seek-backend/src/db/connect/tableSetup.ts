import client from './pgConnect.js'

export const tableSetup = async () => {
    const createTableQuery = `
        CREATE SCHEMA IF NOT EXISTS public;
        SET search_path TO public;

        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            public_key VARCHAR(255) UNIQUE NOT NULL,
            points INT DEFAULT 0,
            content_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS users_public_key_idx ON users(public_key);

        CREATE TABLE IF NOT EXISTS content (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            hash VARCHAR(255) Unique NOT NULL,
            file_size VARCHAR(255),
            network VARCHAR(100),
            upvotes INT DEFAULT 0,
            downvotes INT DEFAULT 0,
            comment_count INT DEFAULT 0,
            thumbnail VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS content_description (
            content_id INT PRIMARY KEY REFERENCES content(id),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS content_hash_idx ON content(hash);
        CREATE INDEX IF NOT EXISTS content_user_id_idx ON content(user_id);

        CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            comment TEXT,
            content_id INT REFERENCES content(id),
            user_id INT REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS content_id_comments_idx ON comments(content_id);

        CREATE TABLE IF NOT EXISTS tags (
            id SERIAL PRIMARY KEY,
            tag_name VARCHAR(50) UNIQUE NOT NULL
        );
        CREATE INDEX IF NOT EXISTS tag_name_idx ON tags(tag_name);

        CREATE TABLE IF NOT EXISTS content_tag (
            content_id INT REFERENCES content(id),
            tag_id INT REFERENCES tags(id),
            PRIMARY KEY (content_id, tag_id)
        );
        CREATE INDEX IF NOT EXISTS content_tag_idx ON content_tag(content_id);

        CREATE TABLE IF NOT EXISTS content_tag_vector (
            content_id INT PRIMARY KEY REFERENCES content(id),
            tsv_tags TSVECTOR
        );
        CREATE INDEX IF NOT EXISTS content_tag_vector_idx ON content_tag_vector USING GIN (tsv_tags);

        CREATE TABLE IF NOT EXISTS content_votes (
            content_id INT REFERENCES content(id),
            user_id INT REFERENCES users(id),
            vote_type BOOLEAN NOT NULL, -- true for upvote, false for downvote
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (content_id, user_id)
        );
        CREATE INDEX IF NOT EXISTS content_votes_user_id_idx ON content_votes(user_id);
        CREATE INDEX IF NOT EXISTS content_votes_content_id_idx ON content_votes(content_id);

        CREATE OR REPLACE FUNCTION update_content_tag_vector()
        RETURNS TRIGGER AS $$
        BEGIN
            INSERT INTO content_tag_vector (content_id, tsv_tags)
            VALUES (
                NEW.content_id,
                to_tsvector('english', (
                    SELECT string_agg(t.tag_name, ' ')
                    FROM content_tag ct
                    JOIN tags t ON ct.tag_id = t.id
                    WHERE ct.content_id = NEW.content_id
                ))
            )
            ON CONFLICT (content_id) DO UPDATE
            SET tsv_tags = to_tsvector('english', (
                SELECT string_agg(t.tag_name, ' ')
                FROM content_tag ct
                JOIN tags t ON ct.tag_id = t.id
                WHERE ct.content_id = NEW.content_id
            ));
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS update_content_tag_vector_trigger ON content_tag;
        CREATE TRIGGER update_content_tag_vector_trigger
        AFTER INSERT OR UPDATE ON content_tag
        FOR EACH ROW
        EXECUTE FUNCTION update_content_tag_vector();

        -- Update content vote counts trigger
        CREATE OR REPLACE FUNCTION update_content_vote_counts()
        RETURNS TRIGGER AS $$
        BEGIN
            IF TG_OP = 'INSERT' THEN
                UPDATE content
                SET upvotes = CASE WHEN NEW.vote_type THEN upvotes + 1 ELSE upvotes END,
                    downvotes = CASE WHEN NOT NEW.vote_type THEN downvotes + 1 ELSE downvotes END
                WHERE id = NEW.content_id;
            ELSIF TG_OP = 'DELETE' THEN
                UPDATE content
                SET upvotes = CASE WHEN OLD.vote_type THEN upvotes - 1 ELSE upvotes END,
                    downvotes = CASE WHEN NOT OLD.vote_type THEN downvotes - 1 ELSE downvotes END
                WHERE id = OLD.content_id;
            END IF;
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS update_content_vote_counts_trigger ON content_votes;
        CREATE TRIGGER update_content_vote_counts_trigger
        AFTER INSERT OR DELETE ON content_votes
        FOR EACH ROW
        EXECUTE FUNCTION update_content_vote_counts();
    `

    try {
        await client.query(createTableQuery);
        
        // Add comment_count column if it doesn't exist (migration)
        try {
            await client.query('ALTER TABLE content ADD COLUMN comment_count INT DEFAULT 0');
            console.log("Added comment_count column to content table");
        } catch (err: any) {
            // Column already exists, ignore error
            if (!err.message.includes('already exists')) {
                console.log('comment_count column already exists or error:', err.message);
            }
        }
        
        console.log("Tables created successfully or already exist.");
    } catch (err) {
        console.error('Error creating tables:', err);
    }
}
