'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { updateAiModel } from '@/app/models/actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { type AiModel } from '@/lib/db/schema';

interface EditModelDialogProps {
  model: AiModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditModelDialog({ model, open, onOpenChange }: EditModelDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [formData, setFormData] = useState({
    provider: '',
    modelId: '',
    modelName: '',
    description: '',
    apiKeyName: '',
    apiKey: '',
  });
  const router = useRouter();

  // Decrypt API key for editing (in production, use proper decryption)
  const decryptApiKey = (encryptedKey: string): string => {
    try {
      return Buffer.from(encryptedKey, 'base64').toString();
    } catch {
      return '';
    }
  };

  // Encrypt API key for storage (in production, use proper encryption)
  const encryptApiKey = (key: string): string => {
    return Buffer.from(key).toString('base64');
  };

  useEffect(() => {
    if (model) {
      setFormData({
        provider: model.provider,
        modelId: model.modelId,
        modelName: model.modelName,
        description: model.description || '',
        apiKeyName: model.apiKeyName,
        apiKey: decryptApiKey(model.encryptedApiKey),
      });
    }
  }, [model]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.provider || !formData.modelId || !formData.modelName || !formData.apiKeyName || !formData.apiKey) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!model) return;

    setIsLoading(true);
    try {
      await updateAiModel(model.id, {
        provider: formData.provider as 'openai' | 'gemini',
        modelId: formData.modelId,
        modelName: formData.modelName,
        description: formData.description || null,
        apiKeyName: formData.apiKeyName,
        encryptedApiKey: encryptApiKey(formData.apiKey),
      });
      
      toast.success('Model updated successfully');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error('Failed to update model');
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit AI Model</DialogTitle>
          <DialogDescription>
            Update the AI model configuration and API key.
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

          <div className="space-y-2">
            <Label htmlFor="apiKeyName">API Key Name *</Label>
            <Input
              id="apiKeyName"
              value={formData.apiKeyName}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKeyName: e.target.value }))}
              placeholder="e.g., Production Key, Development Key"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key *</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={formData.apiKey}
                onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                placeholder="Enter your API key"
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Model'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}