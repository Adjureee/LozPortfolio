import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Mail } from "lucide-react";
import { signOutAction } from "@/app/actions/auth";
import { deleteAchievement, deleteExperience, deleteProject, saveAchievement, saveContacts, saveExperience, saveProject, saveSiteConfig } from "@/app/actions/cms";
import { getPortfolioData, isCurrentUserAdmin, getMessages } from "@/lib/data";
import type { AcademicYear } from "@/lib/types";
import { ActionForm } from "@/components/dashboard/action-form";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { InboxPanel } from "@/components/dashboard/inbox";

const years: AcademicYear[] = ["First Year", "Second Year", "Third Year", "Fourth Year"];

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!(await isCurrentUserAdmin())) redirect("/admin-login");
  const data = await getPortfolioData();
  const messages = await getMessages();
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <main className="min-h-screen bg-paper px-5 py-8 text-ink md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">Hidden dashboard</p>
            <h1 className="font-display text-4xl">Portfolio CMS</h1>
          </div>
          <div className="flex items-center gap-6">
            <a href="#inbox" className="relative group cursor-pointer">
              <Mail className="text-ink group-hover:text-accent transition-colors" size={24} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center border-2 border-paper">
                  {unreadCount}
                </span>
              )}
            </a>
            <form action={signOutAction}>
              <button className="border border-line px-4 py-3 text-sm uppercase tracking-[0.18em] hover:bg-ink hover:text-paper">Sign out</button>
            </form>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <Panel title="Hero Configuration">
            <ActionForm action={saveSiteConfig} className="mt-4 space-y-4" successMessage="Site config saved successfully!">
              <input type="hidden" name="id" value={data.config?.id ?? ""} />
              <input type="hidden" name="existing_avatar_url" value={data.config?.avatar_url ?? ""} />
              <input type="hidden" name="existing_hover_avatar_url" value={data.config?.hover_avatar_url ?? ""} />
              <Field name="display_name" label="Display Name" value={data.config?.display_name} />
              <Field name="title" label="Title Banner" value={data.config?.title} />
              <TextArea name="hero_kicker" label="Hero Kicker" value={data.config?.hero_kicker} />
              <TextArea name="about_me" label="About Me Biography" value={data.config?.about_me} placeholder="Write a short bio about yourself..." />
              <label className="block text-sm text-muted">
                Avatar Image Upload
                <input name="avatar" type="file" accept="image/*" className="mt-2 w-full border border-line px-3 py-3 text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-paper" />
              </label>
              {data.config?.avatar_url ? <p className="break-all text-xs text-muted">{data.config.avatar_url}</p> : null}
              
              <label className="block text-sm text-muted mt-4">
                Hover Avatar Upload (Optional)
                <input name="hover_avatar" type="file" accept="image/*" className="mt-2 w-full border border-line px-3 py-3 text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-paper" />
              </label>
              {data.config?.hover_avatar_url ? <p className="break-all text-xs text-muted">{data.config.hover_avatar_url}</p> : null}

              <SubmitButton label="Save Configuration" />
            </ActionForm>
          </Panel>

          <Panel title="Contacts & Resume">
            <ActionForm action={saveContacts} className="grid gap-4 md:grid-cols-2" successMessage="Links saved successfully!">
              <input type="hidden" name="id" value={data.contacts?.id ?? ""} />
              <Field name="linkedin_url" label="LinkedIn URL" value={data.contacts?.linkedin_url} />
              <Field name="github_url" label="GitHub URL" value={data.contacts?.github_url} />
              <Field name="facebook_url" label="Facebook URL" value={data.contacts?.facebook_url} />
              <Field name="resume_url" label="Resume/CV URL" value={data.contacts?.resume_url} />
              <div className="md:col-span-2"><SubmitButton label="Save links" /></div>
            </ActionForm>
          </Panel>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          <Panel title="Create Project">
            <ActionForm action={saveProject} className="space-y-4" successMessage="Project saved successfully!">
              <ProjectFields />
              <SubmitButton label="Save project" />
            </ActionForm>
          </Panel>
          <Panel title="Create Experience">
            <ActionForm action={saveExperience} className="space-y-4" successMessage="Experience saved successfully!">
              <Field name="title" label="Title" />
              <Field name="company" label="Subtitle / Company" />
              <Field name="location" label="Location (e.g. Remote, Manila)" />
              <DateDropdowns />
              <label className="flex items-center gap-2 text-sm text-accent">
                <input type="checkbox" name="is_current" value="true" />
                Currently working in this role (Overrides End Date)
              </label>
              <TextArea name="bullet_points" label="Bullet Points" placeholder="One per line" />
              <SubmitButton label="Save experience" />
            </ActionForm>
          </Panel>
          <Panel title="Create Achievement">
            <ActionForm action={saveAchievement} className="space-y-4" successMessage="Achievement saved successfully!">
              <Field name="title" label="Award / Article Title" />
              <Field name="date" label="Date (e.g. Oct 2025)" />
              <Field name="url" label="Link to Article/Event (Optional)" />
              <TextArea name="description" label="Short Description" />
              <label className="block text-sm text-muted">
                Thumbnail Image Upload
                <input name="image" type="file" accept="image/*" className="mt-2 w-full border border-line px-3 py-3 text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-paper" />
              </label>
              <SubmitButton label="Save achievement" />
            </ActionForm>
          </Panel>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <Panel title="Projects">
            <div className="space-y-4">
              {data.projects.length === 0 ? <Empty /> : data.projects.map((project) => (
                <details key={project.id} className="border border-line p-4">
                  <summary className="cursor-pointer font-display text-xl">{project.title}</summary>
                  <ActionForm action={saveProject} className="mt-4 space-y-4" successMessage="Project updated successfully!">
                    <input type="hidden" name="id" value={project.id} />
                    <input type="hidden" name="existing_image_url" value={project.image_url ?? ""} />
                    <input type="hidden" name="existing_gallery_urls" value={project.gallery_urls ? JSON.stringify(project.gallery_urls) : ""} />
                    <ProjectFields project={project} />
                    <SubmitButton label="Update project" />
                  </ActionForm>
                  <ActionForm action={deleteProject} className="mt-3" successMessage="Project deleted successfully!">
                    <input type="hidden" name="id" value={project.id} />
                    <SubmitButton label="Delete project" variant="danger" />
                  </ActionForm>
                </details>
              ))}
            </div>
          </Panel>

          <Panel title="Experiences">
            <div className="space-y-4">
              {data.experiences.length === 0 ? <Empty /> : data.experiences.map((experience) => (
                <details key={experience.id} className="border border-line p-4">
                  <summary className="cursor-pointer font-display text-xl">{experience.title}</summary>
                  <ActionForm action={saveExperience} className="mt-4 space-y-4" successMessage="Experience updated successfully!">
                    <input type="hidden" name="id" value={experience.id} />
                    <Field name="title" label="Title" value={experience.title} />
                    <Field name="company" label="Subtitle / Company" value={experience.company} />
                    <Field name="location" label="Location (e.g. Remote, Manila)" value={experience.location} />
                    <DateDropdowns dateRange={experience.date_range} />
                    <label className="flex items-center gap-2 text-sm text-accent">
                      <input type="checkbox" name="is_current" value="true" defaultChecked={experience.is_current} />
                      Currently working in this role (Overrides End Date)
                    </label>
                    <TextArea name="bullet_points" label="Bullet Points" value={experience.bullet_points.join("\n")} />
                    <SubmitButton label="Update experience" />
                  </ActionForm>
                  <ActionForm action={deleteExperience} className="mt-3" successMessage="Experience deleted successfully!">
                    <input type="hidden" name="id" value={experience.id} />
                    <SubmitButton label="Delete experience" variant="danger" />
                  </ActionForm>
                </details>
              ))}
            </div>
          </Panel>

          <Panel title="Achievements & Press">
            <div className="space-y-4">
              {data.achievements?.length === 0 ? <Empty /> : data.achievements?.map((achievement) => (
                <details key={achievement.id} className="border border-line p-4">
                  <summary className="cursor-pointer font-display text-xl">{achievement.title}</summary>
                  <ActionForm action={saveAchievement} className="mt-4 space-y-4" successMessage="Achievement updated successfully!">
                    <input type="hidden" name="id" value={achievement.id} />
                    <input type="hidden" name="existing_image_url" value={achievement.image_url ?? ""} />
                    <Field name="title" label="Award / Article Title" value={achievement.title} />
                    <Field name="date" label="Date (e.g. Oct 2025)" value={achievement.date} />
                    <Field name="url" label="Link to Article/Event (Optional)" value={achievement.url} />
                    <TextArea name="description" label="Short Description" value={achievement.description} />
                    <label className="block text-sm text-muted">
                      Thumbnail Image Upload
                      <input name="image" type="file" accept="image/*" className="mt-2 w-full border border-line px-3 py-3 text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-paper" />
                    </label>
                    {achievement.image_url ? <p className="break-all text-xs text-muted">{achievement.image_url}</p> : null}
                    <SubmitButton label="Update achievement" />
                  </ActionForm>
                  <ActionForm action={deleteAchievement} className="mt-3" successMessage="Achievement deleted successfully!">
                    <input type="hidden" name="id" value={achievement.id} />
                    <SubmitButton label="Delete achievement" variant="danger" />
                  </ActionForm>
                </details>
              ))}
            </div>
          </Panel>
        <section id="inbox" className="mt-5">
          <Panel title="Message Inbox">
            <InboxPanel messages={messages} />
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-line bg-paper/70 p-5 backdrop-blur">
      <h2 className="mb-5 font-display text-2xl">{title}</h2>
      {children}
    </section>
  );
}

function Field({ name, label, value = "", placeholder = "" }: { name: string; label: string; value?: string | null; placeholder?: string }) {
  return (
    <label className="block text-sm text-muted">
      {label}
      <input name={name} defaultValue={value ?? ""} placeholder={placeholder} className="mt-2 w-full border border-line bg-transparent px-3 py-3 text-ink outline-none focus:border-accent" />
    </label>
  );
}

function TextArea({ name, label, value = "", placeholder = "" }: { name: string; label: string; value?: string | null; placeholder?: string }) {
  return (
    <label className="block text-sm text-muted">
      {label}
      <textarea name={name} defaultValue={value ?? ""} placeholder={placeholder} rows={4} className="mt-2 w-full border border-line bg-transparent px-3 py-3 text-ink outline-none focus:border-accent" />
    </label>
  );
}

function ProjectFields({ project }: { project?: { title: string; description: string | null; content: string | null; tech_stack: string[]; project_url: string | null; academic_year: AcademicYear; image_url: string | null; gallery_urls: string[] | null; team_photo_urls: string[] | null; team_photo_names: string | null; contributors_data: {name: string; image_url: string}[] | null; } }) {
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

function Empty() {
  return <p className="border border-dashed border-line p-5 text-sm text-muted">No entries found.</p>;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function DateDropdowns({ dateRange = "" }: { dateRange?: string }) {
  const currentYear = new Date().getFullYear();
  const dropdownYears = Array.from({ length: 30 }, (_, i) => String(currentYear - i));

  const parts = dateRange.split(" - ");
  const startParts = parts[0]?.split(" ") || [];
  const endParts = parts[1]?.split(" ") || [];
  
  const startMonth = startParts[0] || "Jan";
  const startYear = startParts[1] || String(currentYear);
  const endMonth = endParts[0] || "Jan";
  const endYear = endParts[1] || String(currentYear);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-muted mb-2">Start Date</label>
        <div className="flex gap-2">
          <select name="start_month" defaultValue={startMonth} className="w-full border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-accent">
            {months.map(m => <option key={m}>{m}</option>)}
          </select>
          <select name="start_year" defaultValue={startYear} className="w-full border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-accent">
            {dropdownYears.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm text-muted mb-2">End Date</label>
        <div className="flex gap-2">
          <select name="end_month" defaultValue={endMonth} className="w-full border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-accent">
            {months.map(m => <option key={m}>{m}</option>)}
          </select>
          <select name="end_year" defaultValue={endYear} className="w-full border border-line bg-paper px-3 py-3 text-ink outline-none focus:border-accent">
            {dropdownYears.map(y => <option key={y}>{y}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
