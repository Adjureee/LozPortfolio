import { getPortfolioData } from "@/lib/data";
import { saveSiteConfig, saveContacts } from "@/app/actions/cms";
import { ActionForm } from "@/components/dashboard/action-form";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Panel, Field, TextArea } from "@/components/dashboard/ui";

export default async function DashboardConfigPage() {
  const data = await getPortfolioData();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="font-display text-4xl mb-2">Site Configuration</h1>
        <p className="text-muted">Manage your hero section, avatar, and social links.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Hero Configuration">
          <ActionForm action={saveSiteConfig} className="mt-4 space-y-4" successMessage="Site config saved successfully!">
            <input type="hidden" name="id" value={data.config?.id ?? ""} />
            <input type="hidden" name="existing_avatar_url" value={data.config?.avatar_url ?? ""} />
            <input type="hidden" name="existing_hover_avatar_url" value={data.config?.hover_avatar_url ?? ""} />
            <Field name="display_name" label="Display Name" value={data.config?.display_name} />
            <Field name="title" label="Title Banner" value={data.config?.title} />
            <TextArea name="hero_kicker" label="Hero Kicker" value={data.config?.hero_kicker} />
            <TextArea name="about_me" label="About Me Biography" value={data.config?.about_me} placeholder="Write a short bio about yourself..." />
            
            <div className="border border-line p-4 bg-line/5 space-y-4">
              <label className="block text-sm text-muted">
                Primary Avatar Image
                <input name="avatar" type="file" accept="image/*" className="mt-2 w-full border border-line px-3 py-3 text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-paper" />
              </label>
              {data.config?.avatar_url ? <p className="break-all text-xs text-muted">Current: {data.config.avatar_url}</p> : null}
              
              <label className="block text-sm text-muted mt-4">
                Hover Avatar Upload (Optional)
                <input name="hover_avatar" type="file" accept="image/*" className="mt-2 w-full border border-line px-3 py-3 text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-paper" />
              </label>
              {data.config?.hover_avatar_url ? <p className="break-all text-xs text-muted">Current: {data.config.hover_avatar_url}</p> : null}
            </div>

            <SubmitButton label="Save Configuration" />
          </ActionForm>
        </Panel>

        <div className="space-y-8">
          <Panel title="Contacts & Resume">
            <ActionForm action={saveContacts} className="space-y-4" successMessage="Links saved successfully!">
              <input type="hidden" name="id" value={data.contacts?.id ?? ""} />
              <Field name="linkedin_url" label="LinkedIn URL" value={data.contacts?.linkedin_url} />
              <Field name="github_url" label="GitHub URL" value={data.contacts?.github_url} />
              <Field name="facebook_url" label="Facebook URL" value={data.contacts?.facebook_url} />
              <Field name="resume_url" label="Resume/CV URL" value={data.contacts?.resume_url} />
              <SubmitButton label="Save links" />
            </ActionForm>
          </Panel>
        </div>
      </div>
    </div>
  );
}
