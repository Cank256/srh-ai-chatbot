import { getAllAiModels } from '@/lib/db/queries';
import { ModelsTable } from '@/components/models-table';
import { AddModelDialog } from '@/components/add-model-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function ModelsPage() {
  const models = await getAllAiModels();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Models</h2>
          <p className="text-muted-foreground">
            Manage AI models and their configurations.
          </p>
        </div>
        <AddModelDialog>
          <Button>
            <Plus className="mr-2 size-4" />
            Add Model
          </Button>
        </AddModelDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Models</CardTitle>
          <CardDescription>
            Configure and manage AI models for the chatbot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModelsTable models={models} />
        </CardContent>
      </Card>
    </div>
  );
}