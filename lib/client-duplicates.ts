export type DuplicateMatchReason = 'email' | 'phone' | 'name' | 'composite';

export interface ClientItemLike {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  totalVisits: number;
  totalSpentCents: number;
  walletBalanceCents?: number;
  noShowCount?: number;
  notes?: string | null;
  preferences?: string | null;
  allergies?: string | null;
  tags?: string[] | null;
  customSpecs?: any[] | null;
  photos?: any[] | null;
  isKycVerified?: boolean;
  medicalWaiversSigned?: boolean;
}

export type DuplicateGroup<T extends ClientItemLike = ClientItemLike> = {
  id: string;
  matchKey: string;
  matchType: DuplicateMatchReason;
  clients: T[];
  totalVisits: number;
  totalSpentCents: number;
};

function normalizeName(name: string): string {
  if (!name) return '';
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

function normalizePhone(phone?: string | null): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 ? digits : '';
}

function normalizeEmail(email?: string | null): string {
  if (!email) return '';
  const cleaned = email.trim().toLowerCase();
  return cleaned.includes('@') ? cleaned : '';
}

/**
 * Scans a list of clients and groups potential duplicate profiles
 * by normalized email, phone digits, or normalized name using connected components.
 */
export function findDuplicateClientGroups<T extends ClientItemLike>(clients: T[]): DuplicateGroup<T>[] {
  if (!clients || clients.length < 2) return [];

  // Union-Find data structure
  const parent = clients.map((_, i) => i);

  function find(i: number): number {
    if (parent[i] === i) return i;
    parent[i] = find(parent[i]);
    return parent[i];
  }

  function union(i: number, j: number) {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
    }
  }

  const nameMap = new Map<string, number[]>();
  const phoneMap = new Map<string, number[]>();
  const emailMap = new Map<string, number[]>();

  clients.forEach((c, idx) => {
    const n = normalizeName(c.name);
    const p = normalizePhone(c.phone);
    const e = normalizeEmail(c.email);

    if (n) {
      const existing = nameMap.get(n) || [];
      existing.push(idx);
      nameMap.set(n, existing);
    }
    if (p) {
      const existing = phoneMap.get(p) || [];
      existing.push(idx);
      phoneMap.set(p, existing);
    }
    if (e) {
      const existing = emailMap.get(e) || [];
      existing.push(idx);
      emailMap.set(e, existing);
    }
  });

  // Union by email
  for (const indices of emailMap.values()) {
    if (indices.length > 1) {
      for (let i = 1; i < indices.length; i++) {
        union(indices[0], indices[i]);
      }
    }
  }

  // Union by phone
  for (const indices of phoneMap.values()) {
    if (indices.length > 1) {
      for (let i = 1; i < indices.length; i++) {
        union(indices[0], indices[i]);
      }
    }
  }

  // Union by name
  for (const indices of nameMap.values()) {
    if (indices.length > 1) {
      for (let i = 1; i < indices.length; i++) {
        union(indices[0], indices[i]);
      }
    }
  }

  // Collect clusters
  const clusters = new Map<number, number[]>();
  for (let i = 0; i < clients.length; i++) {
    const root = find(i);
    const list = clusters.get(root) || [];
    list.push(i);
    clusters.set(root, list);
  }

  const groups: DuplicateGroup<T>[] = [];

  for (const indices of clusters.values()) {
    if (indices.length < 2) continue;

    // Retrieve and sort clients so the most complete / active profile comes first
    const groupClients = indices.map((i) => clients[i]);
    groupClients.sort((a, b) => {
      // 1. Stays / Visits
      if (b.totalVisits !== a.totalVisits) {
        return b.totalVisits - a.totalVisits;
      }
      // 2. Spent
      if (b.totalSpentCents !== a.totalSpentCents) {
        return b.totalSpentCents - a.totalSpentCents;
      }
      // 3. Contact completeness
      const contactScoreB = (b.email ? 1 : 0) + (b.phone ? 1 : 0);
      const contactScoreA = (a.email ? 1 : 0) + (a.phone ? 1 : 0);
      if (contactScoreB !== contactScoreA) {
        return contactScoreB - contactScoreA;
      }
      // 4. Name length / capitalization completeness
      return b.name.length - a.name.length;
    });

    const totalVisits = groupClients.reduce((sum, c) => sum + (c.totalVisits || 0), 0);
    const totalSpentCents = groupClients.reduce((sum, c) => sum + (c.totalSpentCents || 0), 0);

    // Identify match type
    const firstClient = groupClients[0];
    const allSameEmail = groupClients.every(
      (c) => normalizeEmail(c.email) && normalizeEmail(c.email) === normalizeEmail(firstClient.email)
    );
    const allSamePhone = groupClients.every(
      (c) => normalizePhone(c.phone) && normalizePhone(c.phone) === normalizePhone(firstClient.phone)
    );
    const allSameName = groupClients.every(
      (c) => normalizeName(c.name) && normalizeName(c.name) === normalizeName(firstClient.name)
    );

    let matchType: DuplicateMatchReason = 'composite';
    if (allSameEmail) matchType = 'email';
    else if (allSamePhone) matchType = 'phone';
    else if (allSameName) matchType = 'name';

    // Best display name for the matchKey
    const matchKey = firstClient.name;

    groups.push({
      id: `dup-group-${firstClient.id}`,
      matchKey,
      matchType,
      clients: groupClients,
      totalVisits,
      totalSpentCents,
    });
  }

  // Sort groups by duplicate count descending
  groups.sort((a, b) => b.clients.length - a.clients.length);

  return groups;
}
