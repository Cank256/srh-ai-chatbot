'use client';

import { useState } from 'react';
import { type AiModel } from '@/lib/db/schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { updateAiModel, deleteAiModel } from '@/lib/db/queries';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ModelsTableProps {
  models: AiModel[];
}

export function ModelsTable({ models }: ModelsTableProps) {
  const [selectedModel, setSelectedModel] = useState<AiModel | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleActive = async (modelId: string, isActive: boolean) => {
    setIsLoading(true);
    try {
      await updateAiModel(modelId, { isActive: !isActive });
      toast.success(`Model ${!isActive ? 'activated' : 'deactivated'}`);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update model status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteModel = async () => {
    if (!selectedModel) return;
    
    setIsLoading(true);
    try {
      await deleteAiModel(selectedModel.id);
      toast.success('Model deleted successfully');
      setShowDeleteDialog(false);
      setSelectedModel(null);
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete model');
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderBadge = (provider: string) => {
    const colors = {
      openai: 'bg-green-100 text-green-800',
      gemini: 'bg-blue-100 text-blue-800',
    };
    return colors[provider as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Model ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No AI models configured. Add your first model to get started.
                </TableCell>
              </TableRow>
            ) : (
              models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{model.modelName}</div>
                      {model.description && (
                        <div className="text-sm text-muted-foreground">
                          {model.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getProviderBadge(model.provider)}>
                      {model.provider.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{model.modelId}</TableCell>
                  <TableCell>
                    <Badge variant={model.isActive ? 'default' : 'secondary'}>
                      {model.isActive ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {model.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(model.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(model.id, model.isActive)}
                          disabled={isLoading}
                        >
                          {model.isActive ? (
                            <XCircle className="mr-2 h-4 w-4" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          {model.isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedModel(model);
                            setShowDeleteDialog(true);
                          }}
                          disabled={isLoading}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the model
              &quot;{selectedModel?.modelName}&quot; from your configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteModel}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Deleting...' : 'Delete Model'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}