'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { updateSystemSetting } from '@/app/settings/actions';
import { Loader2 } from 'lucide-react';
import { type AiModel } from '@/lib/db/schema';

interface SystemSettingsFormProps {
  settings: Record<string, string>;
  availableModels: AiModel[];
}

export function SystemSettingsForm({ settings, availableModels }: SystemSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    app_name: settings.app_name || 'AI Chatbot',
    app_description: settings.app_description || 'An intelligent AI-powered chatbot application',
    default_provider: settings.default_provider || 'openai',
    default_model: settings.default_model || 'gpt-3.5-turbo',
    max_tokens: settings.max_tokens || '4000',
    temperature: settings.temperature || '0.7',
    system_prompt: settings.system_prompt || 'You are a helpful AI assistant.',
    session_timeout: settings.session_timeout || '24',
    rate_limit: settings.rate_limit || '100',
    enable_analytics: settings.enable_analytics || 'true',
    maintenance_mode: settings.maintenance_mode || 'false',
  });


  const router = useRouter();

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update each setting
      for (const [key, value] of Object.entries(formData)) {
        await updateSystemSetting(key, value);
      }

      toast.success('System settings have been successfully updated.');

      router.refresh();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="app_name">Application Name</Label>
          <Input
            id="app_name"
            value={formData.app_name}
            onChange={(e) => handleInputChange('app_name', e.target.value)}
            placeholder="AI Chatbot"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="default_provider">Default AI Provider</Label>
          <Select
            value={formData.default_provider}
            onValueChange={(value) => handleInputChange('default_provider', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="google">Google (Gemini)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="default_model">Default AI Model</Label>
          <Select
            value={formData.default_model}
            onValueChange={(value) => handleInputChange('default_model', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select default model" />
            </SelectTrigger>
            <SelectContent>
              {availableModels.length > 0 ? (
                availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.modelId}>
                    {model.modelName} ({model.provider})
                    {model.isActive && <span className="ml-2 text-green-600">• Active</span>}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="gpt-3.5-turbo" disabled>
                  No models configured - using fallback
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_tokens">Max Tokens</Label>
          <Input
            id="max_tokens"
            type="number"
            value={formData.max_tokens}
            onChange={(e) => handleInputChange('max_tokens', e.target.value)}
            placeholder="4000"
            min="100"
            max="8000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature</Label>
          <Input
            id="temperature"
            type="number"
            step="0.1"
            value={formData.temperature}
            onChange={(e) => handleInputChange('temperature', e.target.value)}
            placeholder="0.7"
            min="0"
            max="2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="session_timeout">Session Timeout (hours)</Label>
          <Input
            id="session_timeout"
            type="number"
            value={formData.session_timeout}
            onChange={(e) => handleInputChange('session_timeout', e.target.value)}
            placeholder="24"
            min="1"
            max="168"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate_limit">Rate Limit (requests/hour)</Label>
          <Input
            id="rate_limit"
            type="number"
            value={formData.rate_limit}
            onChange={(e) => handleInputChange('rate_limit', e.target.value)}
            placeholder="100"
            min="10"
            max="1000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="enable_analytics">Enable Analytics</Label>
          <Select
            value={formData.enable_analytics}
            onValueChange={(value) => handleInputChange('enable_analytics', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Enabled</SelectItem>
              <SelectItem value="false">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
          <Select
            value={formData.maintenance_mode}
            onValueChange={(value) => handleInputChange('maintenance_mode', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Disabled</SelectItem>
              <SelectItem value="true">Enabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="app_description">Application Description</Label>
        <Textarea
          id="app_description"
          value={formData.app_description}
          onChange={(e) => handleInputChange('app_description', e.target.value)}
          placeholder="An intelligent AI-powered chatbot application"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="system_prompt">System Prompt</Label>
        <Textarea
          id="system_prompt"
          value={formData.system_prompt}
          onChange={(e) => handleInputChange('system_prompt', e.target.value)}
          placeholder="You are a helpful AI assistant."
          rows={4}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
          Save Settings
        </Button>
      </div>
    </form>
  );
}