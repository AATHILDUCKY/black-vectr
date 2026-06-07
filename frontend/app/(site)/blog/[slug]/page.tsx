import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarkdownContent } from "@/components/markdown-content";
import { OptimizedImage } from "@/components/optimized-image";
import { Container, Section, Badge } from "@/components/ui/primitives";
import { formatDate } from "@/lib/utils";
import { getPost, getPosts } from "@/lib/api";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.status !== "published") notFound();

  // Article JSON-LD for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt ?? undefined,
    articleBody: post.body,
  };

  return (
    <Section className="pt-32 sm:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Container className="max-w-2xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>
        <div className="mb-3 flex items-center gap-2">
          {post.category && <Badge>{post.category.name}</Badge>}
          {post.publishedAt && (
            <span className="text-sm text-muted-foreground">{formatDate(post.publishedAt)}</span>
          )}
        </div>
        <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>

        {post.coverImage && (
          <div className="mt-8 overflow-hidden rounded-2xl">
            <OptimizedImage
              src={post.coverImage}
              alt={post.title}
              className="w-full"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 768px"
              priority
            />
          </div>
        )}

        <article className="prose-content mt-10 space-y-4 leading-relaxed text-foreground/90">
          <MarkdownContent>{post.body}</MarkdownContent>
        </article>
      </Container>
    </Section>
  );
}
