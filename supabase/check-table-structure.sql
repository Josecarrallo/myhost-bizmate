-- Check if audit_logs table exists and its structure
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM
    information_schema.columns
WHERE
    table_schema = 'public'
    AND table_name = 'audit_logs'
ORDER BY
    ordinal_position;
