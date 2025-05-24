-- Create todos table
CREATE TABLE todos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on created_at for better performance
CREATE INDEX todos_created_at_idx ON todos(created_at DESC);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow all operations (insert, select, update, delete) for all users
CREATE POLICY "Allow all operations for all users" ON todos
    FOR ALL
    USING (true)
    WITH CHECK (true); 