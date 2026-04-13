// api/cron-news.js
// GET /api/cron-news
// يُشغَّل تلقائياً كل ساعة عبر Vercel Cron
// يجلب أخبار الفوركس من RSS ويترجمها ويحفظها

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

// مصادر أخبار الفوركس العالمية (RSS)
const RSS_SOURCES = [
  {
    name: 'ForexLive',
    url: 'https://www.forexlive.com/feed/news',
    category: 'أخبار السوق'
  },
  {
    name: 'FXStreet',
    url: 'https://www.fxstreet.com/rss/news',
    category: 'تحليلات'
  },
  {
    name: 'Investing.com Forex',
    url: 'https://www.investing.com/rss/news_285.rss',
    category: 'عملات'
  },
  {
    name: 'DailyFX',
    url: 'https://www.dailyfx.com/feeds/all',
    category: 'تحليلات'
  }
];

async function parseRSS(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FXProArabia/1.0)' },
      signal: AbortSignal.timeout(8000)
    });
    const xml = await res.text();

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const block = match[1];
      const getTag = (tag) => {
        const m = block.match(new RegExp(`<${tag}[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/${tag}>`, 'i'));
        return m ? m[1].trim() : '';
      };

      const title = getTag('title');
      const description = getTag('description');
      const link = getTag('link') || getTag('guid');
      const pubDate = getTag('pubDate');

      if (title && link) {
        items.push({ title, description: description.replace(/<[^>]+>/g, '').trim(), link, pubDate });
      }
      if (items.length >= 5) break;
    }

    return items;
  } catch (e) {
    console.error(`RSS fetch failed for ${url}:`, e.message);
    return [];
  }
}

async function translateAndRewrite(item, sourceName, category) {
  try {
    const prompt = `أنت محرر أخبار متخصص في أسواق الفوركس. ترجم وأعد صياغة هذا الخبر باللغة العربية الفصحى المبسطة.

العنوان الأصلي: ${item.title}
المحتوى: ${item.description || 'لا يوجد تفاصيل إضافية'}
المصدر: ${sourceName}

أجب فقط بـ JSON صالح (بدون أي نص خارج JSON):
{
  "title": "العنوان بالعربية (واضح ومباشر، 70 حرف كحد أقصى)",
  "excerpt": "ملخص الخبر بالعربية (100 حرف)",
  "body": "نص الخبر الكامل بالعربية (فقرتان على الأقل، موضوعي واحترافي)",
  "category": "${category}"
}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await res.json();
    const raw = data.content?.[0]?.text || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    // إذا فشل التحويل نرجع الخبر الأصلي
    return {
      title: item.title,
      excerpt: (item.description || '').slice(0, 100),
      body: item.description || item.title,
      category
    };
  }
}

export default async function handler(req, res) {
  // حماية: فقط Vercel Cron أو طلب مباشر بـ secret
  const secret = req.headers['authorization'];
  const cronHeader = req.headers['x-vercel-cron'];

  if (!cronHeader && secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'CLAUDE_API_KEY غير موجود' });
  }

  const results = { fetched: 0, saved: 0, skipped: 0, errors: [] };

  for (const source of RSS_SOURCES) {
    try {
      const items = await parseRSS(source.url);
      results.fetched += items.length;

      for (const item of items) {
        // تحقق إذا الخبر موجود مسبقاً
        const { data: existing } = await supabase
          .from('news')
          .select('id')
          .eq('original_url', item.link)
          .single();

        if (existing) {
          results.skipped++;
          continue;
        }

        // ترجمة وإعادة صياغة
        const translated = await translateAndRewrite(item, source.name, source.category);

        // حفظ في قاعدة البيانات
        const { error } = await supabase.from('news').insert({
          title: translated.title,
          body: translated.body,
          excerpt: translated.excerpt,
          source: source.name,
          source_url: source.url,
          original_url: item.link,
          category: translated.category || source.category,
          published_at: item.pubDate ? new Date(item.pubDate) : new Date()
        });

        if (error) {
          results.errors.push(error.message);
        } else {
          results.saved++;
        }

        // تأخير بسيط لتجنب rate limiting
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (e) {
      results.errors.push(`${source.name}: ${e.message}`);
    }
  }

  console.log('Cron news results:', results);
  return res.status(200).json({ success: true, ...results });
}
