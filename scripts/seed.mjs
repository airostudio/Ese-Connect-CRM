import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({ url: "file:/home/user/Ese-Connect-CRM/dev.db" });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.note.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.task.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.emailTemplate.deleteMany();
  await prisma.pipeline.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 12);

  // Create users
  const admin = await prisma.user.create({
    data: { name: "Alex Admin", email: "admin@eseconnect.com", password: hashedPassword, role: "admin" },
  });
  const manager = await prisma.user.create({
    data: { name: "Maria Manager", email: "manager@eseconnect.com", password: hashedPassword, role: "manager" },
  });
  const agent = await prisma.user.create({
    data: { name: "Sam Agent", email: "agent@eseconnect.com", password: hashedPassword, role: "agent" },
  });

  console.log("Users created");

  // Create companies
  const companies = await Promise.all([
    prisma.company.create({ data: { name: "Acme Corporation", website: "https://acme.com", industry: "Technology", size: "500-1000", revenue: 50000000, description: "Leading tech solutions provider" } }),
    prisma.company.create({ data: { name: "TechStart Inc", website: "https://techstart.io", industry: "SaaS", size: "50-100", revenue: 5000000, description: "Fast-growing startup" } }),
    prisma.company.create({ data: { name: "Global Finance Ltd", website: "https://globalfinance.com", industry: "Finance", size: "1000+", revenue: 200000000, description: "International financial services" } }),
    prisma.company.create({ data: { name: "HealthPlus", website: "https://healthplus.com", industry: "Healthcare", size: "100-500", revenue: 25000000, description: "Digital health solutions" } }),
    prisma.company.create({ data: { name: "RetailMax", website: "https://retailmax.com", industry: "Retail", size: "500-1000", revenue: 80000000, description: "E-commerce and retail platform" } }),
    prisma.company.create({ data: { name: "BuildRight Co", website: "https://buildright.com", industry: "Construction", size: "100-500", revenue: 30000000 } }),
    prisma.company.create({ data: { name: "EduLearn", website: "https://edulearn.com", industry: "Education", size: "50-100", revenue: 8000000 } }),
    prisma.company.create({ data: { name: "CloudSystems", website: "https://cloudsystems.io", industry: "Technology", size: "100-500", revenue: 15000000 } }),
    prisma.company.create({ data: { name: "GreenEnergy Co", website: "https://greenenergy.com", industry: "Energy", size: "100-500", revenue: 40000000 } }),
    prisma.company.create({ data: { name: "MediaPro", website: "https://mediapro.com", industry: "Media", size: "50-100", revenue: 12000000 } }),
  ]);

  console.log("Companies created");

  // Create contacts
  const contactData = [
    { firstName: "Sarah", lastName: "Johnson", email: "sarah.j@acme.com", phone: "+1-555-0101", title: "CTO", status: "customer", leadScore: 92, companyId: companies[0].id },
    { firstName: "Mike", lastName: "Chen", email: "mike.c@techstart.io", phone: "+1-555-0102", title: "CEO", status: "prospect", leadScore: 78, companyId: companies[1].id },
    { firstName: "Emma", lastName: "Williams", email: "emma.w@globalfinance.com", phone: "+1-555-0103", title: "CFO", status: "lead", leadScore: 65, companyId: companies[2].id },
    { firstName: "David", lastName: "Brown", email: "david.b@healthplus.com", phone: "+1-555-0104", title: "Director", status: "customer", leadScore: 88, companyId: companies[3].id },
    { firstName: "Lisa", lastName: "Davis", email: "lisa.d@retailmax.com", phone: "+1-555-0105", title: "VP Sales", status: "prospect", leadScore: 71, companyId: companies[4].id },
    { firstName: "James", lastName: "Wilson", email: "james.w@buildright.com", phone: "+1-555-0106", title: "PM", status: "lead", leadScore: 45, companyId: companies[5].id },
    { firstName: "Jennifer", lastName: "Taylor", email: "jen.t@edulearn.com", phone: "+1-555-0107", title: "Head of IT", status: "prospect", leadScore: 82, companyId: companies[6].id },
    { firstName: "Robert", lastName: "Anderson", email: "robert.a@cloudsystems.io", phone: "+1-555-0108", title: "Architect", status: "customer", leadScore: 95, companyId: companies[7].id },
    { firstName: "Linda", lastName: "Martinez", email: "linda.m@greenenergy.com", phone: "+1-555-0109", title: "CEO", status: "lead", leadScore: 58, companyId: companies[8].id },
    { firstName: "William", lastName: "Garcia", email: "william.g@mediapro.com", phone: "+1-555-0110", title: "CMO", status: "prospect", leadScore: 74, companyId: companies[9].id },
    { firstName: "Patricia", lastName: "Lee", email: "patricia.l@acme.com", phone: "+1-555-0111", title: "Analyst", status: "lead", leadScore: 38, companyId: companies[0].id },
    { firstName: "Charles", lastName: "White", email: "charles.w@techstart.io", phone: "+1-555-0112", title: "CTO", status: "prospect", leadScore: 69, companyId: companies[1].id },
    { firstName: "Barbara", lastName: "Harris", email: "barbara.h@globalfinance.com", phone: "+1-555-0113", title: "Director", status: "customer", leadScore: 91, companyId: companies[2].id },
    { firstName: "Thomas", lastName: "Clark", email: "thomas.c@healthplus.com", phone: "+1-555-0114", title: "COO", status: "lead", leadScore: 52, companyId: companies[3].id },
    { firstName: "Margaret", lastName: "Lewis", email: "margaret.l@retailmax.com", phone: "+1-555-0115", title: "CFO", status: "prospect", leadScore: 77, companyId: companies[4].id },
    { firstName: "Daniel", lastName: "Robinson", email: "daniel.r@buildright.com", phone: "+1-555-0116", title: "VP Ops", status: "customer", leadScore: 86, companyId: companies[5].id },
    { firstName: "Nancy", lastName: "Walker", email: "nancy.w@edulearn.com", phone: "+1-555-0117", title: "Principal", status: "lead", leadScore: 43, companyId: companies[6].id },
    { firstName: "Paul", lastName: "Hall", email: "paul.h@cloudsystems.io", phone: "+1-555-0118", title: "DevOps", status: "prospect", leadScore: 67, companyId: companies[7].id },
    { firstName: "Donna", lastName: "Allen", email: "donna.a@greenenergy.com", phone: "+1-555-0119", title: "Head of Dev", status: "customer", leadScore: 89, companyId: companies[8].id },
    { firstName: "Mark", lastName: "Young", email: "mark.y@mediapro.com", phone: "+1-555-0120", title: "Content Dir", status: "lead", leadScore: 56, companyId: companies[9].id },
  ];

  const contacts = [];
  for (const c of contactData) {
    const contact = await prisma.contact.create({
      data: { ...c, tags: JSON.stringify(["2024", c.status]), ownerId: admin.id },
    });
    contacts.push(contact);
  }

  console.log("Contacts created");

  // Create pipeline
  await prisma.pipeline.create({
    data: {
      name: "Default Pipeline",
      stages: JSON.stringify(["lead", "qualified", "proposal", "negotiation", "closed won", "closed lost"]),
      isDefault: true,
    },
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
  const probMap = {
    lead: 10, qualified: 30, proposal: 50, negotiation: 75, "closed won": 100, "closed lost": 0,
  };

  const deals = [];
  for (let i = 0; i < dealTitles.length; i++) {
    const stage = stages[i % stages.length];
    const daysAgo = Math.floor(Math.random() * 30);
    const lastActivity = new Date();
    lastActivity.setDate(lastActivity.getDate() - daysAgo);

    const deal = await prisma.deal.create({
      data: {
        title: dealTitles[i],
        value: Math.round((Math.random() * 150000 + 5000) / 1000) * 1000,
        stage,
        probability: probMap[stage],
        contactId: contacts[i % contacts.length].id,
        companyId: companies[i % companies.length].id,
        ownerId: owners[i % owners.length].id,
        healthScore: Math.floor(Math.random() * 60) + 40,
        lastActivityAt: lastActivity,
        closeDate: new Date(Date.now() + (30 + i * 7) * 24 * 60 * 60 * 1000),
      },
    });
    deals.push(deal);
  }

  console.log("Deals created");

  // Create tasks
  const taskData = [
    { title: "Follow up with Sarah Johnson", priority: "high", status: "pending", daysOffset: 1 },
    { title: "Prepare demo for Acme Corp", priority: "urgent", status: "pending", daysOffset: 2 },
    { title: "Send proposal to TechStart", priority: "high", status: "pending", daysOffset: 3 },
    { title: "Contract review call", priority: "medium", status: "pending", daysOffset: 5 },
    { title: "Onboarding session setup", priority: "medium", status: "completed", daysOffset: -1 },
    { title: "Q4 pipeline review", priority: "low", status: "pending", daysOffset: 7 },
    { title: "Send case studies to Global Finance", priority: "high", status: "in_progress", daysOffset: 0 },
    { title: "Update deal stage - HealthPlus", priority: "medium", status: "pending", daysOffset: 4 },
    { title: "Monthly report preparation", priority: "low", status: "pending", daysOffset: 14 },
    { title: "Call with RetailMax stakeholders", priority: "urgent", status: "pending", daysOffset: 1 },
    { title: "LinkedIn outreach campaign", priority: "low", status: "completed", daysOffset: -2 },
    { title: "Invoice follow-up", priority: "high", status: "pending", daysOffset: -1 },
    { title: "Product demo recording", priority: "medium", status: "in_progress", daysOffset: 10 },
    { title: "Competitive analysis update", priority: "low", status: "pending", daysOffset: 21 },
    { title: "Close CloudSystems deal", priority: "urgent", status: "pending", daysOffset: 2 },
    { title: "Team training session", priority: "medium", status: "completed", daysOffset: -3 },
    { title: "Territory planning meeting", priority: "low", status: "pending", daysOffset: 30 },
    { title: "Review NDA - GreenEnergy", priority: "high", status: "pending", daysOffset: 1 },
    { title: "Send thank you note to Robert", priority: "low", status: "completed", daysOffset: -1 },
    { title: "Pipeline forecast update", priority: "medium", status: "pending", daysOffset: 7 },
  ];

  for (let i = 0; i < taskData.length; i++) {
    const { daysOffset, ...taskRest } = taskData[i];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysOffset);
    await prisma.task.create({
      data: {
        ...taskRest,
        dueDate,
        assigneeId: owners[i % owners.length].id,
        contactId: contacts[i % contacts.length].id,
        dealId: deals[i % deals.length].id,
      },
    });
  }

  console.log("Tasks created");

  // Create activities
  const activityTypes = ["call", "email", "meeting", "note", "task"];
  const activityTitles = {
    call: ["Discovery call", "Follow-up call", "Demo call", "Closing call", "Check-in call"],
    email: ["Proposal sent", "Follow-up email", "Introduction email", "Contract sent", "Thank you email"],
    meeting: ["Product demo", "Strategy meeting", "Contract review", "Kickoff meeting", "Quarterly review"],
    note: ["Meeting notes", "Call summary", "Important update", "Deal notes", "Contact notes"],
    task: ["Task completed", "Follow-up done", "Research completed", "Report submitted", "Update logged"],
  };

  for (let i = 0; i < 50; i++) {
    const type = activityTypes[i % activityTypes.length];
    const titles = activityTitles[type];
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(Math.floor(Math.random() * 24));

    await prisma.activity.create({
      data: {
        type,
        title: titles[i % titles.length],
        description: `Activity logged for contact ${contacts[i % contacts.length].firstName}`,
        userId: owners[i % owners.length].id,
        contactId: contacts[i % contacts.length].id,
        dealId: deals[i % deals.length].id,
        createdAt,
      },
    });
  }

  console.log("Activities created");

  // Create email templates
  await prisma.emailTemplate.createMany({
    data: [
      {
        name: "Introduction Email",
        subject: "Introduction - {{sender_name}} from {{company}}",
        body: "Hi {{contact_name}},\n\nI hope this email finds you well. My name is {{sender_name}} and I'm reaching out from {{company}}.\n\nI'd love to schedule a brief call to explore how we might be able to help {{contact_company}} achieve its goals.\n\nWould you be available for a 15-minute call this week?\n\nBest regards,\n{{sender_name}}",
        category: "outreach",
      },
      {
        name: "Follow-up Template",
        subject: "Following up on our conversation",
        body: "Hi {{contact_name}},\n\nI wanted to follow up on our recent conversation and see if you had any questions about our proposal.\n\nI'm confident that our solution can help {{contact_company}} achieve measurable results.\n\nLooking forward to hearing from you.\n\nBest,\n{{sender_name}}",
        category: "follow-up",
      },
      {
        name: "Proposal Email",
        subject: "Proposal for {{contact_company}} - {{deal_name}}",
        body: "Dear {{contact_name}},\n\nThank you for your time and interest. Please find attached our proposal for {{deal_name}}.\n\nHighlights:\n- Investment: {{deal_value}}\n- Implementation Timeline: 8-12 weeks\n- ROI Expected: 3-6 months\n\nBest regards,\n{{sender_name}}",
        category: "proposal",
      },
      {
        name: "Thank You Email",
        subject: "Thank you for your business!",
        body: "Hi {{contact_name}},\n\nThank you for choosing {{company}}! We're excited to partner with {{contact_company}}.\n\nYour dedicated account manager will be in touch within 24 hours.\n\nWarmly,\n{{sender_name}}",
        category: "post-sale",
      },
    ],
  });

  console.log("Email templates created");
  console.log("\n✅ Database seeded successfully!");
  console.log("\nDemo credentials:");
  console.log("  Admin: admin@eseconnect.com / password123");
  console.log("  Manager: manager@eseconnect.com / password123");
  console.log("  Agent: agent@eseconnect.com / password123");

  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
