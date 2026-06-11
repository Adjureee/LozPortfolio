import { Field, TextArea } from "./ui";
import type { AcademicYear } from "@/lib/types";

const years: AcademicYear[] = ["First Year", "Second Year", "Third Year", "Fourth Year"];

export function ProjectFields({ project }: { project?: { title: string; description: string | null; content: string | null; tech_stack: string[]; project_url: string | null; academic_year: AcademicYear; image_url: string | null; gallery_urls: string[] | null; team_photo_urls: string[] | null; team_photo_names: string | null; contributors_data: {name: string; image_url: string}[] | null; } }) {
  return (
    <>
      <Field name="title" label="Title" value={project?.title} />
      <TextArea name="description" label="Short Description" value={project?.description} />
      <TextArea name="content" label="Full Details (Content)" value={project?.content} placeholder="Markdown or plain text for the full project page..." />
      <TextArea name="tech_stack" label="Tech Stack Tags" value={project?.tech_stack.join(", ")} placeholder="React, GSAP, Supabase" />
      <Field name="project_url" label="External Project URL (Optional)" value={project?.project_url} />
      <label className="block text-sm text-muted">
        Academic Year
        <select name="academic_year" defaultValue={project?.academic_year ?? "First Year"} className="mt-2 w-full border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-accent">
          {years.map((year) => <option key={year}>{year}</option>)}
        </select>
      </label>
      <label className="block text-sm text-muted">
        Thumbnail Image Upload
        <input name="image" type="file" accept="image/*" className="mt-2 w-full border border-line px-3 py-3 text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-paper" />
      </label>
      {project?.image_url ? <p className="break-all text-xs text-muted">{project.image_url}</p> : null}

      <div className="border-t border-line mt-4 pt-4">
        <label className="block text-sm text-muted">
          Gallery Photos Upload (Multiple)
          <input name="gallery" type="file" accept="image/*" multiple className="mt-2 w-full border border-line px-3 py-3 text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-paper" />
        </label>
        {project?.gallery_urls && project.gallery_urls.length > 0 ? (
          <div className="mt-2">
            <p className="text-xs text-muted mb-2">{project.gallery_urls.length} photos in gallery</p>
            <label className="flex items-center gap-2 text-sm text-red-500">
              <input type="checkbox" name="clear_gallery" value="true" />
              Clear entire gallery on save
            </label>
          </div>
        ) : null}
      </div>

      <div className="border-t border-line mt-4 pt-4">
        <input type="hidden" name="existing_team_photo_urls" value={project?.team_photo_urls ? JSON.stringify(project.team_photo_urls) : ""} />
        <label className="block text-sm text-muted">
          Group Team Photos Upload (Multiple)
          <input name="team_photos" type="file" accept="image/*" multiple className="mt-2 w-full border border-line px-3 py-3 text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-paper" />
        </label>
        {project?.team_photo_urls && project.team_photo_urls.length > 0 ? (
          <div className="mt-2">
            <p className="text-xs text-muted mb-2">{project.team_photo_urls.length} photos in team gallery</p>
            <label className="flex items-center gap-2 text-sm text-red-500 mt-1">
              <input type="checkbox" name="clear_team_photos" value="true" />
              Clear entire team gallery on save
            </label>
          </div>
        ) : null}
        
        <div className="mt-4">
          <TextArea name="team_photo_names" label="Team Photo Names Caption (Optional)" value={project?.team_photo_names} placeholder="e.g. John Doe, Jane Smith, Alice Johnson..." />
        </div>
      </div>

      <div className="border-t border-line mt-4 pt-4 space-y-4">
        <h3 className="text-lg font-display">Solo Contributors (Up to 10)</h3>
        {Array.from({ length: 10 }).map((_, i) => {
          const contributor = project?.contributors_data?.[i];
          return (
            <div key={i} className="border border-line p-4 space-y-3 bg-line/5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Slot {i + 1}</p>
              <input type="hidden" name={`existing_contributor_name_${i}`} value={contributor?.name ?? ""} />
              <input type="hidden" name={`existing_contributor_url_${i}`} value={contributor?.image_url ?? ""} />
              
              <label className="block text-sm text-muted">
                Name
                <input name={`contributor_name_${i}`} defaultValue={contributor?.name ?? ""} placeholder="John Doe" className="mt-2 w-full border border-line bg-transparent px-3 py-3 text-ink outline-none focus:border-accent" />
              </label>
              
              <label className="block text-sm text-muted">
                Portrait Photo Upload
                <input name={`contributor_file_${i}`} type="file" accept="image/*" className="mt-2 w-full border border-line px-3 py-3 text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-paper" />
              </label>
              {contributor?.image_url ? (
                <div className="mt-2">
                  <p className="break-all text-xs text-muted">Current photo saved.</p>
                  <label className="flex items-center gap-2 text-sm text-red-500 mt-1">
                    <input type="checkbox" name={`delete_contributor_${i}`} value="true" />
                    Delete this contributor on save
                  </label>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </>
  );
}
