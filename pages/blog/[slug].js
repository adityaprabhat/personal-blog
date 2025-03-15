import { supabase } from "../../lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function BlogPost({ title, content }) {
  return (
    <div>
      <h1>{title}</h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch all slugs from Supabase
  const { data: posts } = await supabase.from("posts").select("slug");

  const paths = (posts || []).map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { data: post, error } = await supabase
    .from("posts")
    .select("title, content")
    .eq("slug", params.slug)
    .single();

  if (!post || error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      title: post.title,
      content: post.content,
    },
    revalidate: 60,
  };
}
