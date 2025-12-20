# 📘 Supabase Setup Instructions - Payments & Messages

## 🎯 Overview

This guide will help you set up the Payments and Messages tables in your Supabase database.

## 📋 Prerequisites

- Supabase project created at https://supabase.com
- Access to your Supabase SQL Editor
- Database URL: `https://jjpscimtxrudtepzwhag.supabase.co`

## 🚀 Step-by-Step Setup

### 1. Access Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: **myhost-bizmate**
3. Navigate to **SQL Editor** in the left sidebar
4. Click **+ New Query**

### 2. Run the Migration Script

1. Open the file: `supabase-migrations/02_payments_messages_tables.sql`
2. Copy the entire SQL script
3. Paste it into the SQL Editor in Supabase
4. Click **Run** button (or press Ctrl+Enter)

### 3. Verify Installation

After running the script, verify that everything was created successfully:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('payments', 'messages');

-- Check if functions exist
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'get_total_revenue',
  'get_pending_payments_total',
  'get_unread_messages_count',
  'get_ai_handled_messages_count'
);

-- Check RLS policies
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('payments', 'messages');
```

### 4. Test the Setup

Run these test queries to ensure everything works:

```sql
-- Test payments table
SELECT * FROM payments LIMIT 1;

-- Test messages table
SELECT * FROM messages LIMIT 1;

-- Test revenue function
SELECT get_total_revenue();

-- Test message stats function
SELECT get_unread_messages_count();
```

## 📊 Database Schema

### Payments Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| booking_id | UUID | Foreign key to bookings |
| property_id | UUID | Foreign key to properties |
| guest_name | TEXT | Guest full name |
| guest_email | TEXT | Guest email |
| amount | DECIMAL | Payment amount |
| status | TEXT | pending, completed, failed, refunded, cancelled |
| payment_method | TEXT | Credit Card, Bank Transfer, PayPal, Stripe, Cash |
| transaction_id | TEXT | Unique transaction identifier |
| payment_type | TEXT | Full Payment, Deposit, Partial Payment, Refund |
| transaction_date | TIMESTAMP | When payment was made |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

### Messages Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| booking_id | UUID | Foreign key to bookings |
| property_id | UUID | Foreign key to properties |
| conversation_id | UUID | Groups messages in same conversation |
| sender_type | TEXT | guest, host, ai, system |
| guest_name | TEXT | Guest name |
| guest_email | TEXT | Guest email |
| message_type | TEXT | text, voice, photo, video, file, location |
| message_text | TEXT | Message content |
| media_url | TEXT | URL for media files |
| status | TEXT | unread, read, replied, archived |
| ai_handled | BOOLEAN | Whether AI responded |
| platform | TEXT | whatsapp, email, sms, web, app |
| sent_at | TIMESTAMP | When message was sent |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

## 🔐 Security (RLS Policies)

Row Level Security is enabled on both tables with the following policies:

- **SELECT**: Authenticated users can read all records
- **INSERT**: Authenticated users can create new records
- **UPDATE**: Authenticated users can update records

## 🎨 Helper Functions

### Payment Functions

```sql
-- Get total revenue
SELECT get_total_revenue(); -- All properties
SELECT get_total_revenue('property-uuid-here'); -- Specific property

-- Get pending payments total
SELECT get_pending_payments_total();
SELECT get_pending_payments_total('property-uuid-here');
```

### Message Functions

```sql
-- Get unread messages count
SELECT get_unread_messages_count();
SELECT get_unread_messages_count('property-uuid-here');

-- Get AI handled messages count
SELECT get_ai_handled_messages_count();
SELECT get_ai_handled_messages_count('property-uuid-here');
```

## 📝 Sample Data (Optional)

If you want to insert sample data for testing, uncomment the sample data section in the SQL file before running it.

## 🔄 Realtime Configuration (Optional)

To enable real-time messaging updates:

1. Go to **Database** → **Replication** in Supabase
2. Enable replication for the `messages` table
3. Select the events you want to listen to (INSERT, UPDATE, DELETE)

## 🐛 Troubleshooting

### Error: "relation already exists"

If you see this error, it means the tables already exist. You can either:
- Drop the existing tables and re-run the script
- Skip the CREATE TABLE statements

```sql
-- Drop existing tables (WARNING: This deletes all data!)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
```

### Error: "function already exists"

This is harmless. The script uses `CREATE OR REPLACE FUNCTION` which will update existing functions.

### Error: "permission denied"

Make sure you're logged in as a user with sufficient privileges (typically the database owner or postgres role).

## ✅ Next Steps

After successful setup:

1. ✅ Tables created
2. ✅ Indexes created for performance
3. ✅ RLS policies enabled for security
4. ✅ Helper functions created
5. ✅ Triggers configured for auto-updates

You can now use the Payments and Messages modules in the MY HOST BizMate application!

## 📚 Related Files

- `src/services/supabase.js` - API service with CRUD methods
- `src/components/Payments/Payments.jsx` - Payments UI component
- `src/components/Messages/Messages.jsx` - Messages UI component

## 🆘 Support

If you encounter any issues:
1. Check the Supabase logs in the Dashboard
2. Verify your database connection
3. Ensure all required tables (properties, bookings) exist
4. Check that RLS policies don't block your operations

---

**Last Updated:** December 20, 2025
**Version:** 1.0
**Maintainer:** José Carrallo
