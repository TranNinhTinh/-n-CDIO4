import { API_CONFIG, TOKEN_KEYS } from './config'

// ============ Types & Interfaces ============

export interface DisplayNameChangeInfo {
    canChange: boolean
    lastChanged?: Date
    changeCount: number
    daysUntilNextChange: number
}

export interface ProfileResponse {
    id: string
    email?: string | null
    phone?: string | null
    role?: 'customer' | 'provider' | null
    fullName?: string
    displayName?: string
    avatarUrl?: string
    bio?: string
    address?: string
    birthday?: Date
    gender?: string
    isVerified?: boolean
    isActive?: boolean | null
    displayNameChangeInfo: DisplayNameChangeInfo
    createdAt?: Date | null
    updatedAt: Date
}

export interface PublicProfileResponse {
    id: string
    role?: 'customer' | 'provider'
    displayName?: string
    avatarUrl?: string
    bio?: string
    isVerified?: boolean
    memberSince?: Date
}

export interface ProfileListResponse {
    profiles: PublicProfileResponse[]
    total: number
    count: number
}

export interface DisplayNameChangeResponse {
    success: boolean
    message: string
    newDisplayName: string
    changedAt: Date
    daysUntilNextChange: number
}

export interface DeleteAccountResponse {
    success: boolean
    message: string
}

// ============ Request DTOs ============

export interface UpdateProfileDto {
    fullName?: string
    avatarUrl?: string
    bio?: string
    address?: string
    birthday?: Date
    gender?: string
}

export interface UpdateContactDto {
    email?: string
    phone?: string
}

export interface ChangeDisplayNameDto {
    displayName: string
}

export interface UpdateAvatarDto {
    avatarUrl: string
}

export interface SearchProfilesQuery {
    searchTerm?: string
    limit?: number
    offset?: number
}

// ============ Profile Service ============

export class ProfileService {
    private static readonly BASE_URL = '/api/profile'

    static getAuthToken(): string | null {
        if (typeof window === 'undefined') return null
        return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
    }

    private static getHeaders(isFormData: boolean = false) {
        const token = this.getAuthToken()
        const headers: HeadersInit = {
            'Content-Type': isFormData ? 'application/x-www-form-urlencoded' : 'application/json',
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        return headers
    }

    // ============ My Profile Endpoints ============

    /**
     * Get my complete profile information
     */
    static async getMyProfile(): Promise<ProfileResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/me`, {
                method: 'GET',
                headers: this.getHeaders(),
            })

            if (!response.ok) {
                if (response.status === 401) throw new Error('Unauthorized')
                if (response.status === 404) throw new Error('User not found')
                throw new Error(`HTTP ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('❌ Error getting my profile:', error)
            throw error
        }
    }

    /**
     * Update my profile (excluding display name and contact info)
     */
    static async updateProfile(dto: UpdateProfileDto): Promise<ProfileResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/me`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(dto),
            })

            if (!response.ok) {
                if (response.status === 400) throw new Error('Invalid input')
                if (response.status === 401) throw new Error('Unauthorized')
                throw new Error(`HTTP ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('❌ Error updating profile:', error)
            throw error
        }
    }

    /**
     * Update email and/or phone number
     */
    static async updateContact(dto: UpdateContactDto): Promise<ProfileResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/contact`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(dto),
            })

            if (!response.ok) {
                if (response.status === 400) throw new Error('Invalid email or phone format')
                if (response.status === 401) throw new Error('Unauthorized')
                if (response.status === 409) throw new Error('Email or phone already in use')
                throw new Error(`HTTP ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('❌ Error updating contact:', error)
            throw error
        }
    }

    /**
     * Change display name (restricted to once every 30 days)
     */
    static async changeDisplayName(dto: ChangeDisplayNameDto): Promise<DisplayNameChangeResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/display-name`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(dto),
            })

            if (!response.ok) {
                const errorData = await response.json()
                if (response.status === 400) throw new Error(errorData.message || 'Invalid display name')
                if (response.status === 401) throw new Error('Unauthorized')
                if (response.status === 403) {
                    const error = new Error(errorData.message || 'Cannot change display name yet') as any
                    error.daysUntilCanChange = errorData.daysUntilCanChange
                    throw error
                }
                throw new Error(`HTTP ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('❌ Error changing display name:', error)
            throw error
        }
    }

    /**
     * Update avatar URL
     */
    static async updateAvatar(dto: UpdateAvatarDto): Promise<ProfileResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/avatar`, {
                method: 'PATCH',
                headers: this.getHeaders(),
                body: JSON.stringify(dto),
            })

            if (!response.ok) {
                if (response.status === 400) throw new Error('Invalid avatar URL format')
                if (response.status === 401) throw new Error('Unauthorized')
                throw new Error(`HTTP ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('❌ Error updating avatar:', error)
            throw error
        }
    }

    /**
     * Delete account (soft delete, can be recovered within 30 days)
     */
    static async deleteAccount(): Promise<DeleteAccountResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/me`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            })

            if (!response.ok) {
                if (response.status === 401) throw new Error('Unauthorized')
                if (response.status === 500) throw new Error('Failed to delete account')
                throw new Error(`HTTP ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('❌ Error deleting account:', error)
            throw error
        }
    }

    // ============ Public Profile Endpoints ============

    /**
     * Get public profile of a user
     */
    static async getPublicProfile(userId: string): Promise<PublicProfileResponse> {
        try {
            const response = await fetch(`${this.BASE_URL}/user/${userId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!response.ok) {
                if (response.status === 400) throw new Error('Invalid UUID format')
                if (response.status === 404) throw new Error('User not found or account inactive')
                throw new Error(`HTTP ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('❌ Error getting public profile:', error)
            throw error
        }
    }

    /**
     * Search for users by display name
     */
    static async searchProfiles(query: SearchProfilesQuery = {}): Promise<ProfileListResponse> {
        try {
            const { searchTerm = '', limit = 20, offset = 0 } = query

            const params = new URLSearchParams()
            if (searchTerm) params.append('searchTerm', searchTerm)
            params.append('limit', limit.toString())
            params.append('offset', offset.toString())

            const response = await fetch(`${this.BASE_URL}/search?${params}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!response.ok) {
                if (response.status === 400) throw new Error('Invalid query parameters')
                throw new Error(`HTTP ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error('❌ Error searching profiles:', error)
            throw error
        }
    }
}
