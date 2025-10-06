-- Migration: Add automatic session cleanup for 30 session limit
-- Created: 2025-01-02

-- Create function to automatically clean old sessions when limit exceeded
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS TRIGGER AS $$
DECLARE
  session_count INTEGER;
  oldest_session_id UUID;
BEGIN
  -- Count user's total sessions
  SELECT COUNT(*) INTO session_count
  FROM public.chat_sessions
  WHERE user_id = NEW.user_id;

  -- If user has 30 or more sessions, delete the oldest one
  IF session_count >= 30 THEN
    SELECT id INTO oldest_session_id
    FROM public.chat_sessions
    WHERE user_id = NEW.user_id
    ORDER BY created_at ASC
    LIMIT 1;

    -- Delete oldest session (CASCADE will delete related messages)
    DELETE FROM public.chat_sessions
    WHERE id = oldest_session_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create trigger to run cleanup before inserting new session
CREATE TRIGGER enforce_session_limit
  BEFORE INSERT ON public.chat_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_old_sessions();

-- Add index for better performance on session count queries
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_created 
ON public.chat_sessions(user_id, created_at ASC);

-- Comment on function
COMMENT ON FUNCTION public.cleanup_old_sessions() IS 
'Automatically deletes oldest session when user reaches 30 session limit';

