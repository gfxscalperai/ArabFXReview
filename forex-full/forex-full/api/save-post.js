// api/save-post.js
// POST /api/save-post
// Body: { title, body, excerpt, keywords, category, status, source_url, id? }

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function slugify(text) {
  return text
    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .slice(0, 80) + '-' + Date.now();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, title, body, excerpt, keywords, category, status, source_url } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'العنوان والمحتوى مطلوبان' });
  }

  try {
    let result;

    if (id) {
      // تحديث مقال موجود
      const { data, error } = await supabase
        .from('posts')
        .update({
          title, body, excerpt, keywords, category,
          status: status || 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // إضافة مقال جديد
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title,
          slug: slugify(title),
          body, excerpt, keywords, category,
          status: status || 'draft',
          source_url
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return res.status(200).json({ success: true, post: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
