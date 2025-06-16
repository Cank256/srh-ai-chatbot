'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createAiModel } from '@/app/models/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AddModelDialogProps {
  children: React.ReactNode;
}

export function AddModelDialog({ children }: AddModelDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    provider: '',
    modelId: '',
    modelName: '',
    description: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.provider || !formData.modelId || !formData.modelName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await createAiModel({
        provider: formData.provider as 'openai' | 'gemini',
        modelId: formData.modelId,
        modelName: formData.modelName,
        description: formData.description || null,
        isActive: false,
      });
      
      toast.success('Model added successfully');
      setOpen(false);
      setFormData({ provider: '', modelId: '', modelName: '', description: '' });
      router.refresh();
    } catch (error) {
      toast.error('Failed to add model');
    } finally {
      setIsLoading(false);
    }
  };

  const predefinedModels = {
    openai: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    ],
    gemini: [
      { id: 'gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
    ],
  };

  const handleModelSelect = (modelId: string) => {
    const provider = formData.provider as keyof typeof predefinedModels;
    if (provider && predefinedModels[provider]) {
      const model = predefinedModels[provider].find(m => m.id === modelId);
      if (model) {
        setFormData(prev => ({
          ...prev,
          modelId: model.id,
          modelName: model.name,
        }));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add AI Model</DialogTitle>
          <DialogDescription>
            Configure a new AI model for the chatbot.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">Provider *</Label>
            <Select
              value={formData.provider}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, provider: value, modelId: '', modelName: '' }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.provider && (
            <div className="space-y-2">
              <Label htmlFor="predefined-model">Quick Select</Label>
              <Select onValueChange={handleModelSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a predefined model" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedModels[formData.provider as keyof typeof predefinedModels]?.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="modelId">Model ID *</Label>
            <Input
              id="modelId"
              value={formData.modelId}
              onChange={(e) => setFormData(prev => ({ ...prev, modelId: e.target.value }))}
              placeholder="e.g., gpt-4o, gemini-2.0-flash-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelName">Display Name *</Label>
            <Input
              id="modelName"
              value={formData.modelName}
              onChange={(e) => setFormData(prev => ({ ...prev, modelName: e.target.value }))}
              placeholder="e.g., GPT-4o, Gemini 2.0 Flash"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description of the model"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Model'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}