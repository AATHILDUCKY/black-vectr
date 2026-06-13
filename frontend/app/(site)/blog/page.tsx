import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, SectionHeading, Badge } from "@/components/ui/primitives";
import { OptimizedImage } from "@/components/optimized-image";
import { Reveal, RevealGroup } from "@/components/animation/reveal";
import { formatDate } from "@/lib/utils";
import { getPosts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights and guides on web, marketing, SEO, and design.",
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <Section className="pt-32 sm:pt-40">
      <Container>
        <SectionHeading
          eyebrow="Blog"
          title="Insights & guides"
          description="Practical thinking on building and growing online — no fluff."
        />
        {posts.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">No posts yet. Check back soon.</p>
        ) : (
          <RevealGroup className="mx-auto mt-12 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Reveal key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-accent-gradient">
                    {post.coverImage ? (
                      <>
                        <OptimizedImage
                          src={post.coverImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                      </>
                    ) : (
                      <span className="px-6 text-center font-display text-lg font-semibold text-background/90">
                        {post.title}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex items-center gap-2">
                      {post.category && <Badge>{post.category.name}</Badge>}
                      {post.publishedAt && (
                        <span className="text-xs text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold leading-snug group-hover:text-primary sm:text-lg">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </RevealGroup>
        )}
      </Container>
    </Section>
  );
}
