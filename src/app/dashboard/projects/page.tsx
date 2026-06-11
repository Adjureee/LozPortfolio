import { getPortfolioData } from "@/lib/data";
import { saveProject, deleteProject } from "@/app/actions/cms";
import { ActionForm } from "@/components/dashboard/action-form";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Panel, Empty } from "@/components/dashboard/ui";
import { ProjectFields } from "@/components/dashboard/project-fields";
import { Plus } from "lucide-react";

export default async function DashboardProjectsPage() {
  const data = await getPortfolioData();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-display text-4xl mb-2">Projects</h1>
        <p className="text-muted">Manage your portfolio case studies and games.</p>
      </div>

      <details className="group border border-line bg-accent/5" open={data.projects.length === 0}>
        <summary className="p-5 font-display text-2xl cursor-pointer flex items-center gap-3 text-accent group-open:border-b border-line">
          <Plus size={24} /> Create New Project
        </summary>
        <div className="p-5">
          <ActionForm action={saveProject} className="space-y-4" successMessage="Project saved successfully!">
            <ProjectFields />
            <SubmitButton label="Publish Project" />
          </ActionForm>
        </div>
      </details>

      <div className="space-y-6">
        <h2 className="font-display text-2xl">Existing Projects</h2>
        {data.projects.length === 0 ? <Empty /> : data.projects.map((project) => (
          <details key={project.id} className="border border-line bg-paper/50">
            <summary className="cursor-pointer font-display text-xl p-5 flex items-center justify-between hover:bg-line/5 transition-colors">
              {project.title}
              <span className="text-sm font-sans text-muted">{project.academic_year}</span>
            </summary>
            <div className="p-5 border-t border-line">
              <ActionForm action={saveProject} className="space-y-4" successMessage="Project updated successfully!">
                <input type="hidden" name="id" value={project.id} />
                <input type="hidden" name="existing_image_url" value={project.image_url ?? ""} />
                <input type="hidden" name="existing_gallery_urls" value={project.gallery_urls ? JSON.stringify(project.gallery_urls) : ""} />
                <ProjectFields project={project} />
                <SubmitButton label="Update Project" />
              </ActionForm>
              
              <div className="mt-8 pt-4 border-t border-red-500/20">
                <ActionForm action={deleteProject} successMessage="Project deleted successfully!">
                  <input type="hidden" name="id" value={project.id} />
                  <SubmitButton label="Delete Project" variant="danger" />
                </ActionForm>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
