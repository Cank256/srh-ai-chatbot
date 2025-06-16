import { getAllApiKeys } from '@/lib/db/queries';
import { ApiKeysTable } from '@/components/api-keys-table';
import { AddApiKeyDialog } from '@/components/add-api-key-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default async function ApiKeysPage() {
  const apiKeys = await getAllApiKeys();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API Keys</h2>
          <p className="text-muted-foreground">
            Manage API keys for AI providers.
          </p>
        </div>
        <AddApiKeyDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add API Key
          </Button>
        </AddApiKeyDialog>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          API keys are encrypted and stored securely. Only one key per provider can be active at a time.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Configured API Keys</CardTitle>
          <CardDescription>
            Manage API keys for OpenAI and Google Gemini providers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeysTable apiKeys={apiKeys} />
        </CardContent>
      </Card>
    </div>
  );
}