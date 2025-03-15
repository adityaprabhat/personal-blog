import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function BlogIndex({ posts }) {
  return (
    <div>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return {
    props: {
      posts: posts || [],
    },
    revalidate: 60,
  };
}
