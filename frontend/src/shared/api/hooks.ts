import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type SendMessageRequest, type SendMessageResponse, type CreateChatRequest, type ClientUpdate } from './client';

// Query keys
export const chatKeys = {
    all: ['chats'] as const,
    detail: (id: number) => ['chats', id] as const,
};

// Get all chats
export function useChats() {
    return useQuery({
        queryKey: chatKeys.all,
        queryFn: api.getChats,
    });
}

// Get single chat with messages
export function useChat(chatId: number | null) {
    return useQuery({
        queryKey: chatKeys.detail(chatId!),
        queryFn: () => api.getChat(chatId!),
        enabled: !!chatId,
    });
}

// Send message mutation (with AI response)
export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: SendMessageRequest) => api.sendMessage(request),
        onSuccess: (_data: SendMessageResponse, variables: SendMessageRequest) => {
            queryClient.invalidateQueries({ queryKey: chatKeys.detail(variables.chat_id) });
            queryClient.invalidateQueries({ queryKey: chatKeys.all });
        },
    });
}

// Add message manually (agent sends without AI)
export function useAddMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ chatId, content }: { chatId: number; content: string }) =>
            api.addMessage(chatId, content),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: chatKeys.detail(variables.chatId) });
            queryClient.invalidateQueries({ queryKey: chatKeys.all });
        },
    });
}

// Create chat mutation
export function useCreateChat() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateChatRequest) => api.createChat(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: chatKeys.all });
        },
    });
}

// Update chat status (AI/HUMAN/DONE)
export function useUpdateChatStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ chatId, status }: { chatId: number; status: 'AI' | 'HUMAN' | 'DONE' }) =>
            api.updateChatStatus(chatId, status),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: chatKeys.detail(variables.chatId) });
            queryClient.invalidateQueries({ queryKey: chatKeys.all });
        },
    });
}

// Update client info
export function useUpdateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ chatId, data }: { chatId: number; data: ClientUpdate }) =>
            api.updateClient(chatId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: chatKeys.detail(variables.chatId) });
        },
    });
}

// Update notes
export function useUpdateNotes() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ chatId, notes }: { chatId: number; notes: string }) =>
            api.updateNotes(chatId, notes),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: chatKeys.detail(variables.chatId) });
        },
    });
}

// --- AGENT HOOKS ---

export const agentKeys = {
    all: ['agent'] as const,
    config: () => ['agent', 'config'] as const,
};

// Get agent config
export function useAgentConfig() {
    return useQuery({
        queryKey: agentKeys.config(),
        queryFn: api.getAgentConfig,
    });
}

// Update agent config
export function useUpdateAgentConfig() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Parameters<typeof api.updateAgentConfig>[0]) => api.updateAgentConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agentKeys.config() });
        },
    });
}

// Upload knowledge file
export function useUploadKnowledge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => api.uploadKnowledgeFile(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agentKeys.config() });
        },
    });
}

// Delete knowledge file
export function useDeleteKnowledge() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (fileId: number) => api.deleteKnowledgeFile(fileId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: agentKeys.config() });
        },
    });
}

// --- USER HOOKS ---

export const userKeys = {
    all: ['users'] as const,
};

// Get all users
export function useUsers() {
    return useQuery({
        queryKey: userKeys.all,
        queryFn: api.getUsers,
    });
}

// Invite user
export function useInviteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Parameters<typeof api.inviteUser>[0]) => api.inviteUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}

// Update user
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }: { userId: number; data: Parameters<typeof api.updateUser>[1] }) =>
            api.updateUser(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}

// Delete user
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => api.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}

// --- BILLING HOOKS ---

export const billingKeys = {
    plans: ['billing', 'plans'] as const,
    subscription: ['billing', 'subscription'] as const,
};

// Get plans
export function usePlans() {
    return useQuery({
        queryKey: billingKeys.plans,
        queryFn: api.getPlans,
    });
}

// Get subscription
export function useSubscription() {
    return useQuery({
        queryKey: billingKeys.subscription,
        queryFn: api.getSubscription,
    });
}

// Create/Update subscription
export function useCreateSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ planId, isYearly }: { planId: number; isYearly: boolean }) =>
            api.createSubscription(planId, isYearly),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billingKeys.subscription });
        },
    });
}

// Cancel subscription
export function useCancelSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: api.cancelSubscription,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: billingKeys.subscription });
        },
    });
}

// --- ONBOARDING HOOKS ---

export const onboardingKeys = {
    company: ['onboarding', 'company'] as const,
};

// Get company info
export function useCompany() {
    return useQuery({
        queryKey: onboardingKeys.company,
        queryFn: api.getCompany,
    });
}

// Update company info
export function useUpdateCompany() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Parameters<typeof api.updateCompany>[0]) => api.updateCompany(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: onboardingKeys.company });
        },
    });
}

// Connect channel
export function useConnectChannel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Parameters<typeof api.connectChannel>[0]) => api.connectChannel(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: onboardingKeys.company });
        },
    });
}

// Disconnect channel
export function useDisconnectChannel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (channelId: number) => api.disconnectChannel(channelId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: onboardingKeys.company });
        },
    });
}
