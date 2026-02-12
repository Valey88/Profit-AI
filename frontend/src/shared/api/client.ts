export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Message {
    id: number;
    role: string;
    content: string;
    created_at: string;
}

export interface Client {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    notes?: string;
    history: string[];
}

export interface Chat {
    id: number;
    external_id: string;
    platform: 'telegram' | 'avito' | 'web' | 'whatsapp' | 'instagram' | 'vk';
    status: 'AI' | 'HUMAN' | 'DONE';
    item_name?: string;
    unread_count: number;
    created_at: string;
    updated_at: string;
    messages: Message[];
    client?: Client;
}

export interface CreateChatRequest {
    external_id: string;
    platform: string;
    client_name?: string;
    item_name?: string;
}

export interface SendMessageRequest {
    chat_id: number;
    content: string;
    context?: Record<string, unknown>;
}

export interface SendMessageResponse {
    user_message: Message;
    ai_response: Message;
    intent: string;
    suggested_actions: string[];
}

export interface ClientUpdate {
    name?: string;
    phone?: string;
    email?: string;
    notes?: string;
}

export interface KnowledgeFile {
    id: number;
    filename: string;
    file_size: number;
    created_at: string;
}

export interface AgentConfig {
    id: number;
    name: string;
    role: string;
    tone: string;
    system_prompt: string;
    skills: Record<string, boolean>;
    knowledge_files: KnowledgeFile[];
    created_at: string;
    updated_at: string;
}

export interface AgentConfigUpdate {
    name?: string;
    role?: string;
    tone?: string;
    system_prompt?: string;
    skills?: Record<string, boolean>;
}

export interface User {
    id: number;
    email: string;
    full_name?: string;
    role: string;
    status: string;
    avatar_url?: string;
    is_online: boolean;
    created_at: string;
}

export interface UserInvite {
    email: string;
    full_name: string;
    role: string;
}

export interface UserUpdate {
    full_name?: string;
    role?: string;
    status?: string;
    avatar_url?: string;
}

export interface Plan {
    id: number;
    name: string;
    type: 'starter' | 'business' | 'enterprise';
    price_monthly: number;
    price_yearly: number;
    features: string;
}

export interface Subscription {
    id: number;
    user_id: number;
    plan: Plan;
    status: 'active' | 'canceled' | 'past_due' | 'trial';
    current_period_end: string;
    cancel_at_period_end: boolean;
}

export interface Company {
    id: number;
    name: string;
    website?: string;
    description?: string;
    industry?: string;
    address?: string;
    business_hours?: Record<string, string>;
    channels: Channel[];
}

export interface CompanyUpdate {
    name?: string;
    website?: string;
    description?: string;
    industry?: string;
    address?: string;
}

export interface Channel {
    id: number;
    company_id: number;
    type: string;
    name: string;
    status: string;
    config?: Record<string, unknown>;
}

export interface ChannelCreate {
    type: string;
    name: string;
    config: Record<string, unknown>;
}

// API Client
export const api = {
    // --- CHAT ENDPOINTS ---

    // Get all chats
    async getChats(): Promise<Chat[]> {
        const response = await fetch(`${API_BASE_URL}/chats/`);
        if (!response.ok) throw new Error('Failed to fetch chats');
        return response.json();
    },

    // Get single chat with messages
    async getChat(chatId: number): Promise<Chat> {
        const response = await fetch(`${API_BASE_URL}/chats/${chatId}`);
        if (!response.ok) throw new Error('Failed to fetch chat');
        return response.json();
    },

    // Create a new chat
    async createChat(data: CreateChatRequest): Promise<Chat> {
        const response = await fetch(`${API_BASE_URL}/chats/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create chat');
        return response.json();
    },

    // Send message and get AI response
    async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
        const response = await fetch(`${API_BASE_URL}/chats/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error('Failed to send message');
        return response.json();
    },

    // Add message without AI (agent sends manually)
    async addMessage(chatId: number, content: string): Promise<Message> {
        const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
        });
        if (!response.ok) throw new Error('Failed to add message');
        return response.json();
    },

    // Update chat status (AI/HUMAN/DONE)
    async updateChatStatus(chatId: number, status: 'AI' | 'HUMAN' | 'DONE'): Promise<Chat> {
        const response = await fetch(`${API_BASE_URL}/chats/${chatId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error('Failed to update status');
        return response.json();
    },

    // Update client info
    async updateClient(chatId: number, data: ClientUpdate): Promise<Client> {
        const response = await fetch(`${API_BASE_URL}/chats/${chatId}/client`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update client');
        return response.json();
    },

    // Update notes
    async updateNotes(chatId: number, notes: string): Promise<Client> {
        const response = await fetch(`${API_BASE_URL}/chats/${chatId}/notes`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notes }),
        });
        if (!response.ok) throw new Error('Failed to update notes');
        return response.json();
    },

    // --- AGENT ENDPOINTS ---

    // Agent Config
    async getAgentConfig(): Promise<AgentConfig> {
        const response = await fetch(`${API_BASE_URL}/agent/config`);
        if (!response.ok) throw new Error('Failed to fetch agent config');
        return response.json();
    },

    async updateAgentConfig(data: AgentConfigUpdate): Promise<AgentConfig> {
        const response = await fetch(`${API_BASE_URL}/agent/config`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update agent config');
        return response.json();
    },

    async uploadKnowledgeFile(file: File): Promise<KnowledgeFile> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/agent/knowledge`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload file');
        return response.json();
    },

    async deleteKnowledgeFile(fileId: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/agent/knowledge/${fileId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete file');
    },

    // --- USER ENDPOINTS ---

    async getMe(): Promise<User> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch current user');
        return response.json();
    },

    async getUsers(): Promise<User[]> {
        const response = await fetch(`${API_BASE_URL}/users/`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    async inviteUser(data: UserInvite): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/users/invite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to invite user');
        return response.json();
    },

    async updateUser(userId: number, data: UserUpdate): Promise<User> {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update user');
        return response.json();
    },

    async deleteUser(userId: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete user');
    },

    // --- ADMIN ENDPOINTS ---

    async getAdminUsers(skip: number = 0, limit: number = 100): Promise<{ users: User[], total: number }> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_BASE_URL}/admin/users?skip=${skip}&limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch admin users');
        return response.json();
    },

    // --- BILLING ENDPOINTS ---

    async getPlans(): Promise<Plan[]> {
        const response = await fetch(`${API_BASE_URL}/billing/plans`);
        if (!response.ok) throw new Error('Failed to fetch plans');
        return response.json();
    },

    async getSubscription(): Promise<Subscription> {
        const response = await fetch(`${API_BASE_URL}/billing/subscription`);
        if (!response.ok) throw new Error('Failed to fetch subscription');
        return response.json();
    },

    async createSubscription(planId: number, isYearly: boolean): Promise<Subscription> {
        const response = await fetch(`${API_BASE_URL}/billing/subscription`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan_id: planId, is_yearly: isYearly }),
        });
        if (!response.ok) throw new Error('Failed to update subscription');
        return response.json();
    },

    async cancelSubscription(): Promise<Subscription> {
        const response = await fetch(`${API_BASE_URL}/billing/subscription`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to cancel subscription');
        return response.json();
    },

    // --- ONBOARDING ENDPOINTS ---

    async getCompany(): Promise<Company> {
        const response = await fetch(`${API_BASE_URL}/onboarding/company`);
        if (!response.ok) throw new Error('Failed to fetch company info');
        return response.json();
    },

    async updateCompany(data: CompanyUpdate): Promise<Company> {
        const response = await fetch(`${API_BASE_URL}/onboarding/company`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update company info');
        return response.json();
    },

    async connectChannel(data: ChannelCreate): Promise<Channel> {
        const response = await fetch(`${API_BASE_URL}/onboarding/channels`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to connect channel');
        return response.json();
    },

    async disconnectChannel(channelId: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/onboarding/channels/${channelId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to disconnect channel');
    },

    // Health check
    async healthCheck(): Promise<{ status: string }> {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.json();
    },
};
