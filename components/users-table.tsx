'use client';

import { useState } from 'react';
import { type User } from '@/lib/db/schema';
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
import { MoreHorizontal, Shield, User as UserIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { updateUserRole, deleteUserById } from '@/lib/db/queries';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    setIsLoading(true);
    try {
      await updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      await deleteUserById(selectedUser.id);
      toast.success('User deleted successfully');
      setShowDeleteDialog(false);
      setSelectedUser(null);
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? (
                      <Shield className="w-3 h-3 mr-1" />
                    ) : (
                      <UserIcon className="w-3 h-3 mr-1" />
                    )}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
                <TableCell>
                  {user.lastLoginAt ? format(new Date(user.lastLoginAt), 'MMM dd, yyyy') : 'Never'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {user.role === 'user' ? (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(user.id, 'admin')}
                          disabled={isLoading}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Make Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleRoleChange(user.id, 'user')}
                          disabled={isLoading}
                        >
                          <UserIcon className="mr-2 h-4 w-4" />
                          Make User
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteDialog(true);
                        }}
                        disabled={isLoading}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              account for {selectedUser?.email} and all associated data including
              chats, messages, and documents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}