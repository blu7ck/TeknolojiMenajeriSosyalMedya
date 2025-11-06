#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { existsSync, writeFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function loadDotenv() {
  try {
    const { config } = await import('dotenv')
    const candidateFiles = ['.env.local', '.env.development', '.env']
    for (const file of candidateFiles) {
      const fullPath = resolve(process.cwd(), file)
      if (existsSync(fullPath)) {
        config({ path: fullPath, override: false })
      }
    }
  } catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      console.warn('[normalize-slugs] Dotenv yükleme uyarısı:', error)
    }
  }
}

function ensureEnv(name) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Çalıştırmak için ${name} ortam değişkeni gerekli.`)
  }
  return value
}

const TURKISH_CHAR_MAP = {
  ç: 'c',
  Ç: 'c',
  ğ: 'g',
  Ğ: 'g',
  ı: 'i',
  I: 'i',
  İ: 'i',
  ö: 'o',
  Ö: 'o',
  ş: 's',
  Ş: 's',
  ü: 'u',
  Ü: 'u',
  â: 'a',
  Â: 'a',
  ê: 'e',
  Ê: 'e',
  î: 'i',
  Î: 'i',
  ô: 'o',
  Ô: 'o',
  û: 'u',
  Û: 'u',
}

function normalizeTurkishCharacters(value) {
  return value
    .split('')
    .map((char) => TURKISH_CHAR_MAP[char] ?? char)
    .join('')
}

function slugify(value) {
  if (!value) return ''

  const normalized = normalizeTurkishCharacters(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')

  return normalized
    .toLowerCase()
    .replace(/&/g, '-ve-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
}

function parseArgs(argv) {
  const args = new Set(argv.slice(2))
  return {
    apply: args.has('--apply') || args.has('-a'),
    quiet: args.has('--quiet') || args.has('-q'),
  }
}

async function fetchPosts(supabase) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, slug, status, updated_at, published_at')

  if (error) {
    throw new Error(`Supabase blog_posts okuma hatası: ${error.message}`)
  }

  return data ?? []
}

async function updateSlug(supabase, id, slug) {
  const { error } = await supabase
    .from('blog_posts')
    .update({ slug })
    .eq('id', id)

  if (error) {
    throw new Error(`Supabase slug güncelleme hatası (${id}): ${error.message}`)
  }
}

function writeRedirectsFile(changes) {
  if (changes.length === 0) {
    return null
  }

  const redirects = changes.map(({ slug: oldSlug, nextSlug }) => ({
    source: `/blog/${oldSlug}`,
    destination: `/blog/${nextSlug}`,
    permanent: true,
  }))

  const outputPath = resolve(__dirname, 'blog-slug-redirects.json')
  writeFileSync(outputPath, JSON.stringify(redirects, null, 2), 'utf-8')

  return outputPath
}

async function main() {
  const { apply, quiet } = parseArgs(process.argv)

  await loadDotenv()

  const supabaseUrl = ensureEnv('VITE_SUPABASE_URL')
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    || process.env.SUPABASE_SERVICE_ROLE
    || process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY veya VITE_SUPABASE_ANON_KEY bulunamadı.')
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  })

  const posts = await fetchPosts(supabase)
  const changes = []

  for (const post of posts) {
    const nextSlug = slugify(post.title)
    if (!nextSlug || nextSlug === post.slug) {
      continue
    }

    changes.push({
      id: post.id,
      title: post.title,
      slug: post.slug,
      nextSlug,
      status: post.status,
      updated_at: post.updated_at,
      published_at: post.published_at,
    })
  }

  if (!quiet) {
    if (changes.length === 0) {
      console.log('[normalize-slugs] Güncellenecek slug bulunamadı.')
    } else {
      console.table(changes.map(({ title, slug, nextSlug, status }) => ({
        title,
        current: slug,
        next: nextSlug,
        status,
      })))
    }
  }

  const redirectsPath = writeRedirectsFile(changes)
  if (redirectsPath && !quiet) {
    console.log(`[normalize-slugs] Vercel yönlendirmeleri için ${redirectsPath} dosyası oluşturuldu.`)
  }

  if (apply && changes.length > 0) {
    for (const change of changes) {
      await updateSlug(supabase, change.id, change.nextSlug)
    }

    console.log(`[normalize-slugs] ${changes.length} adet slug güncellendi.`)
  }
}

main().catch((error) => {
  console.error('[normalize-slugs] İşlem başarısız:', error)
  process.exitCode = 1
})

