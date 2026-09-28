-- =====================================================
-- Content Studio V2 - Video Projects Table
-- =====================================================

-- Create video_projects table
CREATE TABLE IF NOT EXISTS video_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Project info
    name VARCHAR(255) NOT NULL DEFAULT 'Untitled Project',
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    -- status: draft, processing, ready, exported, failed

    -- Video settings
    format VARCHAR(10) NOT NULL DEFAULT '9:16',
    -- format: 9:16, 16:9, 1:1

    -- Prompts
    prompt TEXT,
    improved_prompt TEXT,

    -- Editor settings (JSON)
    settings JSONB DEFAULT '{
        "text": {
            "enabled": true,
            "title": "",
            "subtitle": "",
            "position": "bottom"
        },
        "voice": {
            "enabled": false,
            "script": "",
            "voice": "alloy"
        },
        "music": {
            "enabled": true,
            "track": "ambient",
            "volume": 0.7
        },
        "logo": {
            "enabled": false,
            "url": "",
            "position": "bottom-right"
        },
        "subtitles": {
            "enabled": false,
            "language": "en"
        }
    }'::jsonb,

    -- Scenes array (JSON)
    scenes JSONB DEFAULT '[]'::jsonb,
    -- Each scene: { id, photoId, photoUrl, photoPath, clipTaskId, clipUrl, duration, status }

    -- Render info
    render_id VARCHAR(255),
    render_status VARCHAR(50),
    output_url TEXT,

    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_video_projects_tenant_id ON video_projects(tenant_id);
CREATE INDEX IF NOT EXISTS idx_video_projects_status ON video_projects(status);
CREATE INDEX IF NOT EXISTS idx_video_projects_updated_at ON video_projects(updated_at DESC);

-- Enable RLS
ALTER TABLE video_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own projects
CREATE POLICY "Users can view own video projects"
    ON video_projects
    FOR SELECT
    USING (auth.uid() = tenant_id);

-- Users can insert their own projects
CREATE POLICY "Users can insert own video projects"
    ON video_projects
    FOR INSERT
    WITH CHECK (auth.uid() = tenant_id);

-- Users can update their own projects
CREATE POLICY "Users can update own video projects"
    ON video_projects
    FOR UPDATE
    USING (auth.uid() = tenant_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own video projects"
    ON video_projects
    FOR DELETE
    USING (auth.uid() = tenant_id);

-- =====================================================
-- Storage Bucket for Content Studio
-- =====================================================

-- Create storage bucket (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('content-studio', 'content-studio', true);

-- Storage policies for the bucket
-- CREATE POLICY "Users can upload to content-studio"
--     ON storage.objects
--     FOR INSERT
--     WITH CHECK (
--         bucket_id = 'content-studio' AND
--         (storage.foldername(name))[1] = auth.uid()::text
--     );

-- CREATE POLICY "Users can read from content-studio"
--     ON storage.objects
--     FOR SELECT
--     USING (bucket_id = 'content-studio');

-- CREATE POLICY "Users can delete own files in content-studio"
--     ON storage.objects
--     FOR DELETE
--     USING (
--         bucket_id = 'content-studio' AND
--         (storage.foldername(name))[1] = auth.uid()::text
--     );

-- =====================================================
-- Updated timestamp trigger
-- =====================================================

CREATE OR REPLACE FUNCTION update_video_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_video_projects_updated_at ON video_projects;
CREATE TRIGGER trigger_video_projects_updated_at
    BEFORE UPDATE ON video_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_video_projects_updated_at();

-- =====================================================
-- Sample data (optional)
-- =====================================================

-- INSERT INTO video_projects (tenant_id, name, status, prompt, format)
-- VALUES (
--     'your-user-uuid-here',
--     'Villa Showcase Demo',
--     'draft',
--     'Create a cinematic tour of this luxury Bali villa',
--     '9:16'
-- );
