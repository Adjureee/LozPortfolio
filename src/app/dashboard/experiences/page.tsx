import { getPortfolioData } from "@/lib/data";
import { saveExperience, deleteExperience } from "@/app/actions/cms";
import { ActionForm } from "@/components/dashboard/action-form";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Field, TextArea, DateDropdowns, Empty } from "@/components/dashboard/ui";
import { Plus } from "lucide-react";

export default async function DashboardExperiencesPage() {
  const data = await getPortfolioData();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-display text-4xl mb-2">Experiences</h1>
        <p className="text-muted">Manage your work history and roles.</p>
      </div>

      <details className="group border border-line bg-accent/5" open={data.experiences.length === 0}>
        <summary className="p-5 font-display text-2xl cursor-pointer flex items-center gap-3 text-accent group-open:border-b border-line">
          <Plus size={24} /> Add New Experience
        </summary>
        <div className="p-5">
          <ActionForm action={saveExperience} className="space-y-4" successMessage="Experience saved successfully!">
            <Field name="title" label="Job Title" />
            <Field name="company" label="Company Name" />
            <Field name="location" label="Location (e.g. Remote, Manila)" />
            <DateDropdowns />
            <label className="flex items-center gap-2 text-sm text-accent">
              <input type="checkbox" name="is_current" value="true" />
              Currently working here (Overrides End Date)
            </label>
            <TextArea name="bullet_points" label="Bullet Points (Responsibilities)" placeholder="One per line" />
            <SubmitButton label="Publish Experience" />
          </ActionForm>
        </div>
      </details>

      <div className="space-y-6">
        <h2 className="font-display text-2xl">Work History</h2>
        {data.experiences.length === 0 ? <Empty /> : data.experiences.map((experience) => (
          <details key={experience.id} className="border border-line bg-paper/50">
            <summary className="cursor-pointer font-display text-xl p-5 flex items-center justify-between hover:bg-line/5 transition-colors">
              <div>
                {experience.title} <span className="text-muted text-sm ml-2">at {experience.company}</span>
              </div>
              <span className="text-sm font-sans text-muted">{experience.date_range}</span>
            </summary>
            <div className="p-5 border-t border-line">
              <ActionForm action={saveExperience} className="space-y-4" successMessage="Experience updated successfully!">
                <input type="hidden" name="id" value={experience.id} />
                <Field name="title" label="Job Title" value={experience.title} />
                <Field name="company" label="Company Name" value={experience.company} />
                <Field name="location" label="Location (e.g. Remote, Manila)" value={experience.location} />
                <DateDropdowns dateRange={experience.date_range} />
                <label className="flex items-center gap-2 text-sm text-accent">
                  <input type="checkbox" name="is_current" value="true" defaultChecked={experience.is_current} />
                  Currently working here (Overrides End Date)
                </label>
                <TextArea name="bullet_points" label="Bullet Points (Responsibilities)" value={experience.bullet_points.join("\n")} />
                <SubmitButton label="Update Experience" />
              </ActionForm>
              
              <div className="mt-8 pt-4 border-t border-red-500/20">
                <ActionForm action={deleteExperience} successMessage="Experience deleted successfully!">
                  <input type="hidden" name="id" value={experience.id} />
                  <SubmitButton label="Delete Experience" variant="danger" />
                </ActionForm>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
