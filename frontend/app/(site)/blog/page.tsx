import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, SectionHeading, Badge } from "@/components/ui/primitives";
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
          <RevealGroup className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Reveal key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex aspect-[16/9] items-center justify-center bg-accent-gradient">
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
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
                    <h3 className="text-lg font-semibold group-hover:text-primary">{post.title}</h3>
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
