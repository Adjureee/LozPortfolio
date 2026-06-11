import { getPortfolioData } from "@/lib/data";
import { saveAchievement, deleteAchievement } from "@/app/actions/cms";
import { ActionForm } from "@/components/dashboard/action-form";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Field, TextArea, Empty } from "@/components/dashboard/ui";
import { Plus } from "lucide-react";

export default async function DashboardAchievementsPage() {
  const data = await getPortfolioData();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-display text-4xl mb-2">Achievements</h1>
        <p className="text-muted">Manage your awards, certifications, and press features.</p>
      </div>

      <details className="group border border-line bg-accent/5" open={data.achievements?.length === 0}>
        <summary className="p-5 font-display text-2xl cursor-pointer flex items-center gap-3 text-accent group-open:border-b border-line">
          <Plus size={24} /> Add New Achievement
        </summary>
        <div className="p-5">
          <ActionForm action={saveAchievement} className="space-y-4" successMessage="Achievement saved successfully!">
            <Field name="title" label="Award / Article Title" />
            <Field name="date" label="Date (e.g. Oct 2025)" />
            <Field name="url" label="Link to Article/Event (Optional)" />
            <TextArea name="description" label="Short Description" />
            <label className="block text-sm text-muted">
              Thumbnail Image Upload
              <input name="image" type="file" accept="image/*" className="mt-2 w-full border border-line px-3 py-3 text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-paper" />
            </label>
            <SubmitButton label="Publish Achievement" />
          </ActionForm>
        </div>
      </details>

      <div className="space-y-6">
        <h2 className="font-display text-2xl">Existing Records</h2>
        {data.achievements?.length === 0 ? <Empty /> : data.achievements?.map((achievement) => (
          <details key={achievement.id} className="border border-line bg-paper/50">
            <summary className="cursor-pointer font-display text-xl p-5 flex items-center justify-between hover:bg-line/5 transition-colors">
              {achievement.title}
              <span className="text-sm font-sans text-muted">{achievement.date}</span>
            </summary>
            <div className="p-5 border-t border-line">
              <ActionForm action={saveAchievement} className="space-y-4" successMessage="Achievement updated successfully!">
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
                {achievement.image_url ? <p className="break-all text-xs text-muted">Current image saved.</p> : null}
                <SubmitButton label="Update Achievement" />
              </ActionForm>
              
              <div className="mt-8 pt-4 border-t border-red-500/20">
                <ActionForm action={deleteAchievement} successMessage="Achievement deleted successfully!">
                  <input type="hidden" name="id" value={achievement.id} />
                  <SubmitButton label="Delete Achievement" variant="danger" />
                </ActionForm>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
