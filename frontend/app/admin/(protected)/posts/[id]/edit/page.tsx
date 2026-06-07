"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/client";
import { PostEditor } from "@/components/admin/post-editor";
import type { Post } from "@/lib/types";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = React.useState<Post | null>(null);
  const [state, setState] = React.useState<"loading" | "ready" | "error">("loading");

  React.useEffect(() => {
    let active = true;
    apiFetch<Post>(`/posts/${params.id}`)
      .then((p) => {
        if (!active) return;
        setPost(p);
        setState("ready");
      })
      .catch(() => active && setState("error"));
    return () => {
      active = false;
    };
  }, [params.id]);

  if (state === "loading") {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading post…
      </div>
    );
  }

  if (state === "error" || !post) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Couldn’t load this post.</p>
        <Link href="/admin/posts" className="inline-flex items-center gap-1.5 text-sm text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to posts
        </Link>
      </div>
    );
  }

  return <PostEditor post={post} />;
}
