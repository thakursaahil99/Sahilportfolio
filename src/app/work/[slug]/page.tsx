import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudy from "@/components/work/CaseStudy";
import { getProject, nextProject, projects, tagsOf } from "@/data/projects";
import { breadcrumbSchema, pageMeta, projectSchema } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMeta({
    title: `${project.title} — ${project.tagline}`,
    description: project.summary,
    path: `/work/${project.slug}`,
    type: "article",
    image: project.cover ? { url: project.cover, alt: `${project.title} — front page` } : undefined,
    keywords: [project.title, `${project.title} ${project.category}`, ...tagsOf(project)],
  });
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="relative">
      <JsonLd
        data={[
          projectSchema(project),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: project.title, path: `/work/${project.slug}` },
          ]),
        ]}
      />
      <CaseStudy project={project} next={nextProject(slug)} index={projects.indexOf(project)} />
    </main>
  );
}
