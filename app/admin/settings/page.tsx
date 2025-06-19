import { getSystemSettings, getAllAiModels } from '@/lib/db/queries';
import { SystemSettingsForm } from '@/components/system-settings-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default async function SettingsPage() {
  const [settings, availableModels] = await Promise.all([
    getSystemSettings(),
    getAllAiModels()
  ]);

  // Convert settings array to object for easier access
  const settingsMap = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure system-wide settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Basic application configuration and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SystemSettingsForm settings={settingsMap} availableModels={availableModels} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Configuration</CardTitle>
            <CardDescription>
              Settings related to AI model behavior and responses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Default Model Provider</h4>
                  <p className="text-sm text-muted-foreground">
                    {settingsMap.default_provider || 'Not configured'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Max Tokens</h4>
                  <p className="text-sm text-muted-foreground">
                    {settingsMap.max_tokens || '4000'}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">System Prompt</h4>
                <p className="text-sm text-muted-foreground">
                  {settingsMap.system_prompt || 'Default system prompt is being used'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Security and access control configurations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Session Timeout</h4>
                  <p className="text-sm text-muted-foreground">
                    {settingsMap.session_timeout || '24 hours'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Rate Limiting</h4>
                  <p className="text-sm text-muted-foreground">
                    {settingsMap.rate_limit || '100 requests/hour'}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">API Key Encryption</h4>
                <p className="text-sm text-muted-foreground">
                  All API keys are encrypted using AES-256 encryption
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Info</CardTitle>
            <CardDescription>
              Information about the current application version and environment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Version</h4>
                  <p className="text-sm text-muted-foreground">v1.0.0</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Environment</h4>
                  <p className="text-sm text-muted-foreground">
                    {process.env.NODE_ENV || 'development'}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Last Updated</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}