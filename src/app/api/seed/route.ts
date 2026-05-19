import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/supabase";
import bcrypt from "bcryptjs";

// Use untyped client for seed operations to avoid strict generic inference issues
const supabase = db;

export async function POST(req: NextRequest) {
  // In production, require either a SEED_SECRET token (for first-run setup)
  // or an authenticated admin session (for re-seeding).
  const seedSecret = process.env.SEED_SECRET;
  const authHeader = req.headers.get("x-seed-secret");
  const hasValidSecret = seedSecret && authHeader === seedSecret;

  // Check if DB is empty — first-run is always allowed (nothing to protect yet)
  const { count: userCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  if ((userCount ?? 0) > 0 && !hasValidSecret) {
    const session = await auth();
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session || role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
  }
  try {
    // Clear existing data (Supabase requires a filter — use neq on id with a dummy UUID)
    const dummyId = "00000000-0000-0000-0000-000000000000";
    await supabase.from("notes").delete().neq("id", dummyId);
    await supabase.from("activities").delete().neq("id", dummyId);
    await supabase.from("tasks").delete().neq("id", dummyId);
    await supabase.from("deals").delete().neq("id", dummyId);
    await supabase.from("contacts").delete().neq("id", dummyId);
    await supabase.from("companies").delete().neq("id", dummyId);
    await supabase.from("users").delete().neq("id", dummyId);
    await supabase.from("email_templates").delete().neq("id", dummyId);
    await supabase.from("pipelines").delete().neq("id", dummyId);

    const hashedPassword = await bcrypt.hash("password123", 12);

    // Create users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .insert([
        { name: "Alex Admin", email: "admin@eseconnect.com", password: hashedPassword, role: "admin" },
        { name: "Maria Manager", email: "manager@eseconnect.com", password: hashedPassword, role: "manager" },
        { name: "Sam Agent", email: "agent@eseconnect.com", password: hashedPassword, role: "agent" },
      ])
      .select();

    if (usersError || !users) throw new Error(`Users error: ${usersError?.message}`);
    const [admin, manager, agent] = users;

    // Create companies
    const { data: companies, error: companiesError } = await supabase
      .from("companies")
      .insert([
        { name: "Acme Corporation", website: "https://acme.com", industry: "Technology", size: "500-1000", revenue: 50000000, description: "Leading tech solutions provider" },
        { name: "TechStart Inc", website: "https://techstart.io", industry: "SaaS", size: "50-100", revenue: 5000000, description: "Fast-growing startup" },
        { name: "Global Finance Ltd", website: "https://globalfinance.com", industry: "Finance", size: "1000+", revenue: 200000000, description: "International financial services" },
        { name: "HealthPlus", website: "https://healthplus.com", industry: "Healthcare", size: "100-500", revenue: 25000000, description: "Digital health solutions" },
        { name: "RetailMax", website: "https://retailmax.com", industry: "Retail", size: "500-1000", revenue: 80000000, description: "E-commerce and retail platform" },
        { name: "BuildRight Co", website: "https://buildright.com", industry: "Construction", size: "100-500", revenue: 30000000 },
        { name: "EduLearn", website: "https://edulearn.com", industry: "Education", size: "50-100", revenue: 8000000 },
        { name: "CloudSystems", website: "https://cloudsystems.io", industry: "Technology", size: "100-500", revenue: 15000000 },
        { name: "GreenEnergy Co", website: "https://greenenergy.com", industry: "Energy", size: "100-500", revenue: 40000000 },
        { name: "MediaPro", website: "https://mediapro.com", industry: "Media", size: "50-100", revenue: 12000000 },
      ])
      .select();

    if (companiesError || !companies) throw new Error(`Companies error: ${companiesError?.message}`);

    // Create contacts
    const contactData = [
      { first_name: "Sarah", last_name: "Johnson", email: "sarah.j@acme.com", phone: "+1-555-0101", title: "CTO", status: "customer", lead_score: 92, company_id: companies[0].id },
      { first_name: "Mike", last_name: "Chen", email: "mike.c@techstart.io", phone: "+1-555-0102", title: "CEO", status: "prospect", lead_score: 78, company_id: companies[1].id },
      { first_name: "Emma", last_name: "Williams", email: "emma.w@globalfinance.com", phone: "+1-555-0103", title: "CFO", status: "lead", lead_score: 65, company_id: companies[2].id },
      { first_name: "David", last_name: "Brown", email: "david.b@healthplus.com", phone: "+1-555-0104", title: "Director", status: "customer", lead_score: 88, company_id: companies[3].id },
      { first_name: "Lisa", last_name: "Davis", email: "lisa.d@retailmax.com", phone: "+1-555-0105", title: "VP Sales", status: "prospect", lead_score: 71, company_id: companies[4].id },
      { first_name: "James", last_name: "Wilson", email: "james.w@buildright.com", phone: "+1-555-0106", title: "PM", status: "lead", lead_score: 45, company_id: companies[5].id },
      { first_name: "Jennifer", last_name: "Taylor", email: "jen.t@edulearn.com", phone: "+1-555-0107", title: "Head of IT", status: "prospect", lead_score: 82, company_id: companies[6].id },
      { first_name: "Robert", last_name: "Anderson", email: "robert.a@cloudsystems.io", phone: "+1-555-0108", title: "Architect", status: "customer", lead_score: 95, company_id: companies[7].id },
      { first_name: "Linda", last_name: "Martinez", email: "linda.m@greenenergy.com", phone: "+1-555-0109", title: "CEO", status: "lead", lead_score: 58, company_id: companies[8].id },
      { first_name: "William", last_name: "Garcia", email: "william.g@mediapro.com", phone: "+1-555-0110", title: "CMO", status: "prospect", lead_score: 74, company_id: companies[9].id },
      { first_name: "Patricia", last_name: "Lee", email: "patricia.l@acme.com", phone: "+1-555-0111", title: "Analyst", status: "lead", lead_score: 38, company_id: companies[0].id },
      { first_name: "Charles", last_name: "White", email: "charles.w@techstart.io", phone: "+1-555-0112", title: "CTO", status: "prospect", lead_score: 69, company_id: companies[1].id },
      { first_name: "Barbara", last_name: "Harris", email: "barbara.h@globalfinance.com", phone: "+1-555-0113", title: "Director", status: "customer", lead_score: 91, company_id: companies[2].id },
      { first_name: "Thomas", last_name: "Clark", email: "thomas.c@healthplus.com", phone: "+1-555-0114", title: "COO", status: "lead", lead_score: 52, company_id: companies[3].id },
      { first_name: "Margaret", last_name: "Lewis", email: "margaret.l@retailmax.com", phone: "+1-555-0115", title: "CFO", status: "prospect", lead_score: 77, company_id: companies[4].id },
      { first_name: "Daniel", last_name: "Robinson", email: "daniel.r@buildright.com", phone: "+1-555-0116", title: "VP Ops", status: "customer", lead_score: 86, company_id: companies[5].id },
      { first_name: "Nancy", last_name: "Walker", email: "nancy.w@edulearn.com", phone: "+1-555-0117", title: "Principal", status: "lead", lead_score: 43, company_id: companies[6].id },
      { first_name: "Paul", last_name: "Hall", email: "paul.h@cloudsystems.io", phone: "+1-555-0118", title: "DevOps", status: "prospect", lead_score: 67, company_id: companies[7].id },
      { first_name: "Donna", last_name: "Allen", email: "donna.a@greenenergy.com", phone: "+1-555-0119", title: "Head of Dev", status: "customer", lead_score: 89, company_id: companies[8].id },
      { first_name: "Mark", last_name: "Young", email: "mark.y@mediapro.com", phone: "+1-555-0120", title: "Content Dir", status: "lead", lead_score: 56, company_id: companies[9].id },
    ].map((c) => ({ ...c, tags: JSON.stringify(["2024", c.status]), owner_id: admin.id }));

    const { data: contacts, error: contactsError } = await supabase
      .from("contacts")
      .insert(contactData)
      .select();

    if (contactsError || !contacts) throw new Error(`Contacts error: ${contactsError?.message}`);

    // Create pipeline
    await supabase.from("pipelines").insert({
      name: "Default Pipeline",
      stages: JSON.stringify(["lead", "qualified", "proposal", "negotiation", "closed won", "closed lost"]),
      is_default: true,
    });

    // Create deals
    const stages = ["lead", "qualified", "proposal", "negotiation", "closed won", "closed lost"];
    const dealTitles = [
      "Enterprise License Deal", "Cloud Migration Project", "Support Contract Renewal",
      "Platform Upgrade", "Integration Services", "Annual Subscription",
      "Custom Development", "Training Package", "API License", "Consulting Retainer",
      "SaaS Implementation", "Data Analytics Setup", "Security Audit",
      "Mobile App Development", "E-commerce Platform", "CRM Integration",
      "HR System Upgrade", "Financial Software Suite", "Marketing Automation",
      "Supply Chain Optimization", "IoT Infrastructure", "Blockchain Solution",
      "AI Implementation", "DevOps Transformation", "Cloud Cost Optimization",
      "Digital Transformation", "Legacy Migration", "Compliance Package",
      "Business Intelligence", "Managed Services",
    ];

    const owners = [admin, manager, agent];
    const probMap: Record<string, number> = {
      lead: 10, qualified: 30, proposal: 50, negotiation: 75, "closed won": 100, "closed lost": 0,
    };

    const dealInserts = dealTitles.map((title, i) => {
      const stage = stages[i % stages.length];
      const daysAgo = Math.floor(Math.random() * 30);
      const lastActivity = new Date();
      lastActivity.setDate(lastActivity.getDate() - daysAgo);

      return {
        title,
        value: Math.round((Math.random() * 150000 + 5000) / 1000) * 1000,
        stage,
        probability: probMap[stage],
        contact_id: contacts[i % contacts.length].id,
        company_id: companies[i % companies.length].id,
        owner_id: owners[i % owners.length].id,
        health_score: Math.floor(Math.random() * 60) + 40,
        last_activity_at: lastActivity.toISOString(),
        close_date: new Date(Date.now() + (30 + i * 7) * 24 * 60 * 60 * 1000).toISOString(),
      };
    });

    const { data: deals, error: dealsError } = await supabase.from("deals").insert(dealInserts).select();
    if (dealsError || !deals) throw new Error(`Deals error: ${dealsError?.message}`);

    // Create tasks
    const taskData = [
      { title: "Follow up with Sarah Johnson", priority: "high", status: "pending", due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
      { title: "Prepare demo for Acme Corp", priority: "urgent", status: "pending", due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
      { title: "Send proposal to TechStart", priority: "high", status: "pending", due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
      { title: "Contract review call", priority: "medium", status: "pending", due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
      { title: "Onboarding session setup", priority: "medium", status: "completed", due_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { title: "Q4 pipeline review", priority: "low", status: "pending", due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
      { title: "Send case studies to Global Finance", priority: "high", status: "in_progress", due_date: new Date().toISOString() },
      { title: "Update deal stage - HealthPlus", priority: "medium", status: "pending", due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString() },
      { title: "Monthly report preparation", priority: "low", status: "pending", due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() },
      { title: "Call with RetailMax stakeholders", priority: "urgent", status: "pending", due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
      { title: "LinkedIn outreach campaign", priority: "low", status: "completed", due_date: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
      { title: "Invoice follow-up", priority: "high", status: "pending", due_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { title: "Product demo recording", priority: "medium", status: "in_progress", due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() },
      { title: "Competitive analysis update", priority: "low", status: "pending", due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString() },
      { title: "Close CloudSystems deal", priority: "urgent", status: "pending", due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() },
      { title: "Team training session", priority: "medium", status: "completed", due_date: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
      { title: "Territory planning meeting", priority: "low", status: "pending", due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
      { title: "Review NDA - GreenEnergy", priority: "high", status: "pending", due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
      { title: "Send thank you note to Robert", priority: "low", status: "completed", due_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { title: "Pipeline forecast update", priority: "medium", status: "pending", due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
    ].map((task, i) => ({
      ...task,
      assignee_id: owners[i % owners.length].id,
      contact_id: contacts[i % contacts.length].id,
      deal_id: deals[i % deals.length].id,
    }));

    const { error: tasksError } = await supabase.from("tasks").insert(taskData);
    if (tasksError) throw new Error(`Tasks error: ${tasksError.message}`);

    // Create activities
    const activityTypes = ["call", "email", "meeting", "note", "task"];
    const activityTitles: Record<string, string[]> = {
      call: ["Discovery call", "Follow-up call", "Demo call", "Closing call", "Check-in call"],
      email: ["Proposal sent", "Follow-up email", "Introduction email", "Contract sent", "Thank you email"],
      meeting: ["Product demo", "Strategy meeting", "Contract review", "Kickoff meeting", "Quarterly review"],
      note: ["Meeting notes", "Call summary", "Important update", "Deal notes", "Contact notes"],
      task: ["Task completed", "Follow-up done", "Research completed", "Report submitted", "Update logged"],
    };

    const activityInserts = Array.from({ length: 50 }, (_, i) => {
      const type = activityTypes[i % activityTypes.length];
      const titles = activityTitles[type];
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);
      createdAt.setHours(Math.floor(Math.random() * 24));

      return {
        type,
        title: titles[i % titles.length],
        description: `Activity logged for contact ${contacts[i % contacts.length].first_name}`,
        user_id: owners[i % owners.length].id,
        contact_id: contacts[i % contacts.length].id,
        deal_id: deals[i % deals.length].id,
        created_at: createdAt.toISOString(),
      };
    });

    const { error: activitiesError } = await supabase.from("activities").insert(activityInserts);
    if (activitiesError) throw new Error(`Activities error: ${activitiesError.message}`);

    // Create email templates
    const { error: templatesError } = await supabase.from("email_templates").insert([
      {
        name: "Introduction Email",
        subject: "Introduction - {{sender_name}} from {{company}}",
        body: "Hi {{contact_name}},\n\nI hope this email finds you well. My name is {{sender_name}} and I'm reaching out from {{company}}.\n\nI'd love to schedule a brief call to explore how we might be able to help {{contact_company}} achieve its goals.\n\nWould you be available for a 15-minute call this week?\n\nBest regards,\n{{sender_name}}",
        category: "outreach",
      },
      {
        name: "Follow-up Template",
        subject: "Following up on our conversation",
        body: "Hi {{contact_name}},\n\nI wanted to follow up on our recent conversation and see if you had any questions about our proposal.\n\nI'm confident that our solution can help {{contact_company}} achieve measurable results. I'd be happy to provide any additional information you need.\n\nLooking forward to hearing from you.\n\nBest,\n{{sender_name}}",
        category: "follow-up",
      },
      {
        name: "Proposal Email",
        subject: "Proposal for {{contact_company}} - {{deal_name}}",
        body: "Dear {{contact_name}},\n\nThank you for your time and interest. As discussed, please find attached our proposal for {{deal_name}}.\n\nHighlights:\n- Investment: {{deal_value}}\n- Implementation Timeline: 8-12 weeks\n- ROI Expected: 3-6 months\n\nI'd love to walk you through the details in a call. Are you available this week?\n\nBest regards,\n{{sender_name}}",
        category: "proposal",
      },
      {
        name: "Thank You Email",
        subject: "Thank you for your business!",
        body: "Hi {{contact_name}},\n\nThank you for choosing {{company}}! We're excited to partner with {{contact_company}} and are committed to delivering exceptional value.\n\nYour dedicated account manager will be in touch within 24 hours to schedule your onboarding session.\n\nWe look forward to a successful partnership!\n\nWarmly,\n{{sender_name}}",
        category: "post-sale",
      },
    ]);

    if (templatesError) throw new Error(`Templates error: ${templatesError.message}`);

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
