// api/ai-publish.js
// POST /api/ai-publish
// Body: { url, category, apiKey }
// يجلب محتوى الرابط ويعيد صياغته بالذكاء الاصطناعي ثم يحفظه

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80) + '-' + Date.now();
}

async function fetchPageText(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FXProBot/1.0)' }
    });
    const html = await res.text();
    // استخراج النص المفيد من HTML
    const clean = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s{3,}/g, ' ')
      .trim()
      .slice(0, 3000);
    return clean;
  } catch (e) {
    return `محتوى من الرابط: ${url}`;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, category = 'indicators', save = false } = req.body;
  const apiKey = req.headers['x-api-key'] || process.env.CLAUDE_API_KEY;

  if (!url) return res.status(400).json({ error: 'URL مطلوب' });
  if (!apiKey) return res.status(400).json({ error: 'API Key مطلوب' });

  try {
    // 1. جلب محتوى الصفحة
    const pageText = await fetchPageText(url);

    // 2. إعادة الصياغة بالذكاء الاصطناعي
    const catLabel = {
      indicators: 'مؤشر فوركس',
      ea: 'روبوت تداول (Expert Advisor)',
      brokers: 'شركة وساطة فوركس',
      news: 'خبر فوركس'
    }[category] || 'منتج فوركس';

    const prompt = `أنت كاتب محتوى متخصص في أسواق الفوركس والتداول الإلكتروني. مهمتك كتابة مقال احترافي SEO-friendly باللغة العربية.

المصدر: ${url}
النوع: ${catLabel}
محتوى الصفحة المرجعية:
${pageText}

اكتب مقالاً احترافياً شاملاً يتضمن:
- وصفاً دقيقاً للمنتج أو المحتوى
- المميزات والفوائد الرئيسية
- كيفية الاستخدام أو التطبيق
- نصائح للمتداولين
- خلاصة واضحة

أجب فقط بـ JSON صالح بالشكل التالي (بدون أي نص خارج JSON):
{
  "title": "عنوان جذاب ومحسّن لمحركات البحث (60 حرف كحد أقصى)",
  "excerpt": "وصف مختصر للمقال (150 حرف)",
  "body": "نص المقال الكامل (500 كلمة على الأقل، منسق بفقرات واضحة، يمكن استخدام ## للعناوين الفرعية)",
  "keywords": "5 كلمات مفتاحية مفصولة بفاصلة",
  "category": "${category}"
}`;

    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const aiData = await aiRes.json();

    if (!aiRes.ok) {
      return res.status(500).json({ error: 'خطأ في Claude API', details: aiData });
    }

    const rawText = aiData.content?.[0]?.text || '';
    const clean = rawText.replace(/```json|```/g, '').trim();
    let article;

    try {
      article = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: 'خطأ في تحليل رد الذكاء الاصطناعي', raw: clean });
    }

    // 3. حفظ في قاعدة البيانات (اختياري)
    let savedId = null;
    if (save) {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: article.title,
          slug: slugify(article.title),
          body: article.body,
          excerpt: article.excerpt,
          keywords: article.keywords,
          category: article.category || category,
          status: 'draft',
          source_url: url
        })
        .select('id')
        .single();

      if (!error) savedId = data.id;
    }

    return res.status(200).json({
      success: true,
      article,
      savedId
    });

  } catch (err) {
    console.error('ai-publish error:', err);
    return res.status(500).json({ error: err.message });
  }
}
