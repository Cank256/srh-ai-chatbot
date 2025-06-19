'use client';

import { useState } from 'react';
import { type ApiKey } from '@/lib/db/schema';
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
import { MoreHorizontal, Trash2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { updateApiKey, deleteApiKey } from '@/app/api-keys/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ApiKeysTableProps {
  apiKeys: Omit<ApiKey, 'encryptedKey'>[];
}

export function ApiKeysTable({ apiKeys }: ApiKeysTableProps) {
  const [selectedKey, setSelectedKey] = useState<Omit<ApiKey, 'encryptedKey'> | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggleActive = async (keyId: string, isActive: boolean) => {
    setIsLoading(true);
    try {
      await updateApiKey(keyId, { isActive: !isActive });
      toast.success(`API key ${!isActive ? 'activated' : 'deactivated'}`);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update API key status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKey = async () => {
    if (!selectedKey) return;
    
    setIsLoading(true);
    try {
      await deleteApiKey(selectedKey.id);
      toast.success('API key deleted successfully');
      setShowDeleteDialog(false);
      setSelectedKey(null);
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete API key');
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
              <TableHead>Key Name</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No API keys configured. Add your first API key to enable AI functionality.
                </TableCell>
              </TableRow>
            ) : (
              apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.keyName}</TableCell>
                  <TableCell>
                    <Badge className={getProviderBadge(apiKey.provider)}>
                      {apiKey.provider.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                      {apiKey.isActive ? (
                        <CheckCircle className="size-3 mr-1" />
                      ) : (
                        <XCircle className="size-3 mr-1" />
                      )}
                      {apiKey.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(apiKey.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(apiKey.updatedAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 p-0">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(apiKey.id, apiKey.isActive)}
                          disabled={isLoading}
                        >
                          {apiKey.isActive ? (
                            <XCircle className="mr-2 size-4" />
                          ) : (
                            <CheckCircle className="mr-2 size-4" />
                          )}
                          {apiKey.isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedKey(apiKey);
                            setShowDeleteDialog(true);
                          }}
                          disabled={isLoading}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 size-4" />
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
              This action cannot be undone. This will permanently delete the API key
              &quot;{selectedKey?.keyName}&quot; for {selectedKey?.provider}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteKey}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Deleting...' : 'Delete API Key'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}