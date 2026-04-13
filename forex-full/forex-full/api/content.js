// api/content.js
// GET /api/content?type=posts|news|all&category=...&limit=20

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const { type = 'all', category, limit = 20, page = 1 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const response = {};

    if (type === 'posts' || type === 'all') {
      let q = supabase
        .from('posts')
        .select('id, title, slug, excerpt, category, keywords, created_at, source_url')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .range(offset, offset + parseInt(limit) - 1);

      if (category) q = q.eq('category', category);
      const { data, error } = await q;
      if (error) throw error;
      response.posts = data || [];
    }

    if (type === 'news' || type === 'all') {
      let q = supabase
        .from('news')
        .select('id, title, excerpt, category, source, published_at, original_url')
        .order('published_at', { ascending: false })
        .range(offset, offset + parseInt(limit) - 1);

      if (category) q = q.eq('category', category);
      const { data, error } = await q;
      if (error) throw error;
      response.news = data || [];
    }

    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
