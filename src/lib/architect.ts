// KIOSK AI Growth Architect — Supabase knowledge base access + lead capture.
// Reads the kb_* tables (public-read RLS) and writes consultation leads.

const SUPABASE_URL = "https://tefxdyhmmrmgcywqzbqu.supabase.co";
// Public anon key — safe to embed; RLS allows read on kb_* and insert on leads.
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZnhkeWhtbXJtZ2N5d3F6YnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzgxMDYsImV4cCI6MjA5NTgxNDEwNn0.GNcWq4jbg8Piye6Tqekic8-MW6jBsR-YY8-QAp23wVI";

const headers = {
  apikey: SUPABASE_ANON,
  Authorization: `Bearer ${SUPABASE_ANON}`,
  "Content-Type": "application/json",
};

export type KbService = {
  slug: string;
  title: string;
  category: string;
  description: string;
  outcome: string;
  industry_focus: string[];
  budget_level: string;
  implementation_time: string;
  tags: string[];
  package_level: string;
};

export type KbAiProduct = {
  slug: string;
  title: string;
  category: string;
  description: string;
  problem_solved: string;
  business_outcome: string[];
  industry_focus: string[];
  budget_level: string;
  implementation_time: string;
  tags: string[];
};

export type KbPackage = {
  slug: string;
  package_name: string;
  package_type: string;
  description: string;
  included_services: string[];
  included_ai_products: string[];
  ideal_client: string;
  budget_level: string;
};

export type KbIndustry = {
  slug: string;
  industry_name: string;
  description: string;
  common_challenges: string[];
  recommended_services: string[];
  recommended_ai_products: string[];
  recommended_packages: string[];
};

export type KbChallenge = {
  slug: string;
  challenge: string;
  description: string;
  recommended_services: string[];
  recommended_ai_products: string[];
};

export type KnowledgeBase = {
  services: KbService[];
  aiProducts: KbAiProduct[];
  packages: KbPackage[];
  industries: KbIndustry[];
  challenges: KbChallenge[];
};

async function table<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers,
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

export async function getKnowledgeBase(): Promise<KnowledgeBase> {
  const [services, aiProducts, packages, industries, challenges] =
    await Promise.all([
      table<KbService>(
        "kb_services?select=slug,title,category,description,outcome,industry_focus,budget_level,implementation_time,tags,package_level&is_active=eq.true&order=sort.asc",
      ),
      table<KbAiProduct>(
        "kb_ai_products?select=slug,title,category,description,problem_solved,business_outcome,industry_focus,budget_level,implementation_time,tags&is_active=eq.true&order=sort.asc",
      ),
      table<KbPackage>(
        "kb_packages?select=slug,package_name,package_type,description,included_services,included_ai_products,ideal_client,budget_level&order=sort.asc",
      ),
      table<KbIndustry>(
        "kb_industries?select=slug,industry_name,description,common_challenges,recommended_services,recommended_ai_products,recommended_packages&order=sort.asc",
      ),
      table<KbChallenge>(
        "kb_challenges?select=slug,challenge,description,recommended_services,recommended_ai_products&order=sort.asc",
      ),
    ]);
  return { services, aiProducts, packages, industries, challenges };
}

export type ConsultationLead = {
  business_name?: string;
  industry?: string;
  business_stage?: string;
  main_goal?: string;
  challenges?: string[];
  budget_range?: string;
  message?: string;
  recommended_services?: string[];
  recommended_ai_products?: string[];
  recommended_package?: string;
  growth_roadmap?: unknown;
  executive_summary?: string;
  scores?: unknown;
  conversation?: unknown;
};

export async function saveLead(lead: ConsultationLead): Promise<boolean> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/ai_consultation_leads`,
      {
        method: "POST",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify(lead),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
