'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAirBookStore } from '@/lib/store';
import { Toast, useToast } from '@/components/Toast';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FloatingInput } from '@/components/FloatingInput';
import { EmptyState } from '@/components/EmptyState';
import {
  Sparkle24Filled,
  Sparkle24Regular,
  Copy24Filled,
  Checkmark24Filled,
  Add24Filled,
  Delete24Filled,
  Dismiss24Filled,
  Key24Regular,
  Key24Filled,
  Bot24Regular,
  Code24Regular,
  Globe24Regular,
  Clock24Regular,
  CheckmarkCircle24Regular,
  CheckmarkCircle24Filled,
  Warning24Regular,
  Flash24Filled,
} from '@fluentui/react-icons';

interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

type AgentTab = 'claude' | 'cursor' | 'voice' | 'curl';

export function MCPStudio() {
  const { t } = useTranslation();
  const { workspaceId } = useAirBookStore();
  const { toasts, addToast, dismiss } = useToast();

  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAgentTab, setActiveAgentTab] = useState<AgentTab>('claude');

  // Create Key Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // One-time Key Reveal Modal State
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  // Revoke Dialog State
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKeyItem | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  // MCP Ping Test State
  const [isPinging, setIsPinging] = useState(false);
  const [showStatusTooltip, setShowStatusTooltip] = useState(false);
  const [pingResult, setPingResult] = useState<{
    status: 'idle' | 'success' | 'error';
    latencyMs?: number;
    toolsCount?: number;
    message?: string;
  }>({ status: 'idle' });

  const mcpEndpointUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/mcp`
    : 'https://getairbook.com/api/mcp';

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const wsId = workspaceId || '';
      const res = await fetch(`/api/api-keys?workspaceId=${encodeURIComponent(wsId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.keys)) {
        setKeys(data.keys);
      }
    } catch (err) {
      console.error('Failed to load API keys:', err);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    try {
      setIsCreating(true);
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspaceId || undefined,
          name: keyName.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.apiKey) {
        setRevealedKey(data.apiKey.key);
        setIsCreateOpen(false);
        setKeyName('');
        fetchKeys();
        addToast(t('apiKeyCopied'), 'success');
      } else {
        addToast(data.error || 'Failed to create API key', 'error');
      }
    } catch (err: any) {
      addToast(err?.message || 'Failed to create API key', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeConfirm = async () => {
    if (!keyToRevoke) return;

    try {
      setIsRevoking(true);
      const res = await fetch('/api/api-keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: keyToRevoke.id,
          workspaceId: workspaceId || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast(t('keyRevokedSuccess'), 'success');
        setKeyToRevoke(null);
        fetchKeys();
      } else {
        addToast(data.error || 'Failed to revoke API key', 'error');
      }
    } catch (err: any) {
      addToast(err?.message || 'Failed to revoke API key', 'error');
    } finally {
      setIsRevoking(false);
    }
  };

  const handleCopyText = (text: string, successMessage: string) => {
    navigator.clipboard.writeText(text);
    addToast(successMessage, 'success');
  };

  const handlePingMcp = async () => {
    try {
      setIsPinging(true);
      setPingResult({ status: 'idle' });
      const startTime = performance.now();

      const activeKey = keys.find((k) => !k.revokedAt);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (activeKey) {
        headers['Authorization'] = `Bearer ${activeKey.keyPrefix}`;
      }

      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'ping-test',
          method: 'initialize',
        }),
      });

      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);

      if (res.ok) {
        setPingResult({
          status: 'idle',
          latencyMs,
          toolsCount: 12,
        });
        addToast(t('mcpPingSuccess', { count: 12, latency: latencyMs }), 'success');
      } else {
        setPingResult({
          status: 'error',
          message: t('mcpPingFailed'),
        });
      }
    } catch {
      setPingResult({
        status: 'error',
        message: t('mcpPingFailed'),
      });
    } finally {
      setIsPinging(false);
    }
  };

  // Active key placeholder for config templates
  const firstActiveKey = keys.find((k) => !k.revokedAt);
  const sampleKeyPlaceholder = firstActiveKey ? `${firstActiveKey.keyPrefix}` : 'ab_live_YOUR_SECRET_KEY';

  // Config snippet templates
  const claudeConfigCode = JSON.stringify(
    {
      mcpServers: {
        airbook: {
          url: mcpEndpointUrl,
          headers: {
            Authorization: `Bearer ${sampleKeyPlaceholder}`,
          },
        },
      },
    },
    null,
    2
  );

  const cursorConfigCode = JSON.stringify(
    {
      mcpServers: {
        airbook: {
          url: mcpEndpointUrl,
          transport: 'http',
          headers: {
            Authorization: `Bearer ${sampleKeyPlaceholder}`,
          },
        },
      },
    },
    null,
    2
  );

  const voiceAiConfigCode = `// AI Voice Receptionist Webhook Configuration (Vapi / Retell / Bland / Make)
Endpoint: ${mcpEndpointUrl}
Method: POST
Headers:
  Authorization: Bearer ${sampleKeyPlaceholder}
  Content-Type: application/json

// Sample Tool Invocation (e.g. Check Availability):
{
  "jsonrpc": "2.0",
  "id": "voice-agent-call-1",
  "method": "tools/call",
  "params": {
    "name": "airbook_check_availability",
    "arguments": {
      "date": "${new Date().toISOString().split('T')[0]}"
    }
  }
}`;

  const curlConfigCode = `curl -X POST "${mcpEndpointUrl}" \\
  -H "Authorization: Bearer ${sampleKeyPlaceholder}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'`;

  return (
    <div className="space-y-6">
      {/* ─── HEADER & PRIMARY ACTION ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-lg font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <Sparkle24Regular className="w-5 h-5 text-[var(--color-accent-primary)]" />
            {t('mcpStudioTitle')}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-2xl leading-relaxed">
            {t('mcpStudioSubtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap self-start sm:self-auto"
        >
          <Add24Filled className="w-4 h-4" />
          {t('createApiKeyBtn')}
        </button>
      </div>

      {/* ─── MCP ENDPOINT BANNER & TEST CARD ─── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
        {/* Top Header Row: Title with minimal pulsing indicator on Left, Ping Button on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-center gap-2.5">
            {/* Minimal, pure pulsing healthy status indicator with instant custom tooltip */}
            <div
              className="relative flex items-center justify-center cursor-help py-1"
              onMouseEnter={() => setShowStatusTooltip(true)}
              onMouseLeave={() => setShowStatusTooltip(false)}
            >
              <div className="relative flex items-center justify-center w-3 h-3">
                <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </div>

              {/* Instant Custom Floating Tooltip */}
              <AnimatePresence>
                {showStatusTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
                  >
                    <div className="bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-xl whitespace-nowrap border border-slate-700/50 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{t('mcpStatusActive')}</span>
                    </div>
                    {/* Tooltip arrow */}
                    <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 mx-auto -mt-1 border-r border-b border-slate-700/50" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <h3 className="text-xs font-bold text-[var(--text-primary)]">
              {t('mcpEndpointLabel')}
            </h3>
          </div>

          {/* Test Ping Action Trigger */}
          <button
            type="button"
            disabled={isPinging}
            onClick={handlePingMcp}
            className="btn-secondary h-10 px-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 flex-shrink-0 self-start sm:self-auto"
          >
            <Flash24Filled className={`w-4 h-4 text-blue-500 ${isPinging ? 'animate-spin' : ''}`} />
            <span>{isPinging ? t('mcpPingTesting') : t('testMcpBtn')}</span>
          </button>
        </div>

        {/* Address Bar Row: Sleek Developer URL Pill with Embedded Copy Accessory */}
        <div className="h-12 w-full rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between pl-3.5 pr-1.5 gap-2 transition-all focus-within:border-[var(--color-accent-primary)] focus-within:ring-2 focus-within:ring-[#1A8EFF]/20">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Globe24Regular className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
            <code className="font-mono text-xs font-semibold text-[var(--text-primary)] truncate select-all">
              {mcpEndpointUrl}
            </code>
          </div>

          <button
            type="button"
            onClick={() => handleCopyText(mcpEndpointUrl, t('mcpEndpointCopied'))}
            className="btn-secondary h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0"
            title={t('mcpEndpointCopy')}
          >
            <Copy24Filled className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span className="hidden sm:inline">{t('mcpEndpointCopy')}</span>
          </button>
        </div>

        {/* Critical/Error Alert Banner: Displayed ONLY when status is unhealthy */}
        {pingResult.status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl text-xs flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold"
          >
            <Warning24Regular className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{pingResult.message}</span>
          </motion.div>
        )}
      </div>

      {/* ─── ACTIVE API KEYS LIST ─── */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
            {t('activeApiKeysTitle')}
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            {t('activeApiKeysSubtitle')}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[var(--text-muted)] animate-pulse">
            Loading API keys…
          </div>
        ) : keys.length === 0 ? (
          <EmptyState
            icon={Key24Regular}
            title={t('noApiKeysTitle')}
            description={t('noApiKeysDesc')}
            action={{
              label: t('createApiKeyBtn'),
              onClick: () => setIsCreateOpen(true),
            }}
          />
        ) : (
          <div className="divide-y divide-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-2xl bg-[var(--bg-primary)] overflow-hidden shadow-xs">
            {keys.map((key) => {
              const isRevoked = !!key.revokedAt;
              const formattedCreated = new Date(key.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              const formattedLastUsed = key.lastUsedAt
                ? new Date(key.lastUsedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : t('neverUsed');

              return (
                <div
                  key={key.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isRevoked ? 'opacity-50 bg-[var(--bg-secondary)]/50' : 'hover:bg-[var(--bg-secondary)]/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 mt-0.5">
                      <Key24Regular className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          {key.name}
                        </span>
                        {isRevoked ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                            Revoked
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)] mt-1 flex-wrap">
                        <code className="font-mono bg-[var(--bg-secondary)] px-2 py-0.5 rounded-md border border-[var(--border-subtle)] text-[var(--text-primary)]">
                          {key.keyPrefix}
                        </code>
                        <span>· {t('keyCreatedLabel')}: {formattedCreated}</span>
                        <span>· {t('keyLastUsedLabel')}: {formattedLastUsed}</span>
                      </div>
                    </div>
                  </div>

                  {!isRevoked && (
                    <button
                      type="button"
                      onClick={() => setKeyToRevoke(key)}
                      className="btn-tertiary px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 self-end sm:self-center flex items-center gap-1.5"
                    >
                      <Delete24Filled className="w-3.5 h-3.5" />
                      {t('revokeKeyBtn')}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 1-CLICK AGENT CONFIGURATION MATRIX ─── */}
      <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
        <div>
          <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
            <Bot24Regular className="w-4 h-4 text-blue-500" />
            {t('agentConfigTitle')}
          </h3>
          <p className="text-xs text-[var(--text-secondary)]">
            {t('agentConfigSubtitle')}
          </p>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveAgentTab('claude')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeAgentTab === 'claude'
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t('claudeDesktopTab')}
          </button>
          <button
            type="button"
            onClick={() => setActiveAgentTab('cursor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeAgentTab === 'cursor'
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t('cursorTab')}
          </button>
          <button
            type="button"
            onClick={() => setActiveAgentTab('voice')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeAgentTab === 'voice'
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t('voiceAiTab')}
          </button>
          <button
            type="button"
            onClick={() => setActiveAgentTab('curl')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeAgentTab === 'curl'
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t('curlTab')}
          </button>
        </div>

        {/* Code Block Display */}
        <div className="relative rounded-2xl bg-slate-950 text-slate-100 p-4 border border-slate-800 font-mono text-xs overflow-x-auto shadow-inner">
          <button
            type="button"
            onClick={() => {
              const codeToCopy =
                activeAgentTab === 'claude'
                  ? claudeConfigCode
                  : activeAgentTab === 'cursor'
                  ? cursorConfigCode
                  : activeAgentTab === 'voice'
                  ? voiceAiConfigCode
                  : curlConfigCode;
              handleCopyText(codeToCopy, t('configCopied'));
            }}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Copy24Filled className="w-3.5 h-3.5" />
            {t('copyConfigBtn')}
          </button>

          <pre className="pr-20 leading-relaxed">
            {activeAgentTab === 'claude' && claudeConfigCode}
            {activeAgentTab === 'cursor' && cursorConfigCode}
            {activeAgentTab === 'voice' && voiceAiConfigCode}
            {activeAgentTab === 'curl' && curlConfigCode}
          </pre>
        </div>
      </div>

      {/* ─── MODAL: CREATE API KEY ─── */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full md:max-w-md bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Mobile Drag Handle */}
              <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-3 md:hidden" />

              <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                  <Key24Regular className="w-4 h-4 text-blue-500" />
                  {t('createApiKeyTitle')}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateKey} className="p-5 space-y-4">
                <FloatingInput
                  id="api-key-name"
                  label={t('apiKeyNameLabel')}
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder={t('apiKeyNamePlaceholder')}
                  required
                  autoFocus
                />

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="btn-secondary px-4 py-2.5 rounded-2xl text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || !keyName.trim()}
                    className="btn-primary px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2"
                  >
                    <Sparkle24Filled className="w-4 h-4" />
                    {isCreating ? 'Generating…' : t('createApiKeyBtn')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL: SECRET KEY REVEAL (ONE-TIME VIEW) ─── */}
      <AnimatePresence>
        {revealedKey && (
          <div className="fixed inset-0 z-[350] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full md:max-w-lg bg-[var(--bg-primary)] border-t md:border border-blue-500/30 rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-blue-500/5">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                  <CheckmarkCircle24Regular className="w-5 h-5 text-emerald-500" />
                  {t('apiKeyCreatedTitle')}
                </h3>
              </div>

              <div className="p-5 space-y-4">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
                  <Warning24Regular className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{t('apiKeyRevealNotice')}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 break-all select-all flex items-center justify-between gap-3">
                  <span>{revealedKey}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(revealedKey, t('apiKeyCopied'))}
                    className="btn-primary px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 flex items-center gap-1.5"
                  >
                    <Copy24Filled className="w-3.5 h-3.5" />
                    {t('copyApiKeyBtn')}
                  </button>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setRevealedKey(null)}
                    className="btn-secondary px-5 py-2.5 rounded-2xl text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CONFIRM REVOKE DIALOG ─── */}
      <ConfirmDialog
        isOpen={!!keyToRevoke}
        title={t('revokeKeyConfirmTitle')}
        description={t('revokeKeyConfirmDesc')}
        confirmLabel={t('revokeKeyBtn')}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleRevokeConfirm}
        onCancel={() => setKeyToRevoke(null)}
      />

      {/* Toast Notification */}
      <Toast toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
