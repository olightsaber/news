/** Parsed Keycloak JWT token claims */
export interface KeycloakUser {
  sub: string
  preferred_username?: string
  name?: string
  given_name?: string
  family_name?: string
  email?: string
  email_verified?: boolean
  realm_access?: { roles: string[] }
  resource_access?: Record<string, { roles: string[] }>
}

/** Base article shape shared between admin and web */
export interface Article {
  id: string
  title: string
  content: unknown  // Tiptap JSON node
  authorId: string
  createdAt: Date
  updatedAt?: Date
}
