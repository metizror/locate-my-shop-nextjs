# heyfilo Webhook Receiver

Receives published posts from **heyfilo** (Publishing → Webhook Connections) and
saves them into the `blog_posts` Supabase table so they appear on `/blog`.

- **Endpoint:** `POST /api/heyfilo-webhook`
- **Health check:** `GET /api/heyfilo-webhook` → `{ ok: true }`

## What it does

1. **Authenticates** the request (HMAC signature, Bearer token, or API key —
   whichever env var is set; HMAC recommended). Reads `X-Heyfilo-*` headers with
   an `X-WPCP-*` fallback.
2. Handles `connection.test` → returns `200` without saving.
3. Handles `post.created`:
   - **Idempotency** — skips duplicate deliveries via `heyfilo_event_id`.
   - **Update mapping** — re-publishes update the existing row via `heyfilo_post_id`.
   - **Re-hosts images** (hero + inline) from heyfilo onto local disk
     (`public/uploads/blog-images/`) and rewrites the body HTML (heyfilo URLs
     expire ~7d).
   - **Resolves the author** (finds by name or creates a `blog_authors` row).
   - **Ensures a unique slug** and fills `read_time`, `seo_title`,
     `seo_description`, `date_*` fields.
   - Returns `{ id, url }` so heyfilo records the live URL.

## Environment variables

```env
DATABASE_URL=                # required — MySQL connection (Prisma)
HEYFILO_WEBHOOK_SECRET=      # HMAC mode (recommended)
# HEYFILO_BEARER_TOKEN=      # OR Bearer mode
# HEYFILO_API_KEY=           # OR API key mode
```

## Database

Persists to the `blog_posts` table via Prisma. The `heyfilo_post_id` +
`heyfilo_event_id` columns (unique) provide update-mapping and idempotency.
