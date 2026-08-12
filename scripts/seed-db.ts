import "dotenv/config";
import { contentStore, StoredContentRow } from "../db/content-store";
import { defaultNewsPosts, defaultResearchMaterials, defaultPopup } from "../app/lib/content";

async function seed() {
  console.log("Seeding database with default mock data...");

  try {
    // 1. Seed News
    const newsRows: StoredContentRow[] = defaultNewsPosts.map((post) => ({
      id: post.id,
      section: "news",
      slug: post.slug,
      title: post.title,
      status: post.status,
      publishedAt: post.publishedAt,
      imageUrl: post.imageUrl || null,
      payload: JSON.stringify({
        excerpt: post.excerpt,
        content: post.content,
        category1: post.category1,
        category2: post.category2,
        heldAt: post.heldAt,
        attachmentUrl: post.attachmentUrl,
        views: post.views,
      }),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    // 2. Seed Research
    const researchRows: StoredContentRow[] = defaultResearchMaterials.map((post) => ({
      id: post.id,
      section: "research",
      slug: post.slug,
      title: post.title,
      status: post.status,
      publishedAt: post.publishedAt,
      imageUrl: post.imageUrl || null,
      payload: JSON.stringify({
        author: post.author,
        tableOfContents: post.tableOfContents,
        summary: post.summary,
        keywords: post.keywords,
        researchType: post.researchType,
        category1: post.category1,
        category2: post.category2,
        views: post.views,
      }),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    // 3. Seed Popup
    const popupRow: StoredContentRow = {
      id: defaultPopup.id,
      section: "popup",
      slug: null,
      title: defaultPopup.title,
      status: defaultPopup.active ? "published" : "draft",
      publishedAt: null,
      imageUrl: defaultPopup.imageUrl || null,
      payload: JSON.stringify({
        content: defaultPopup.content,
        link: defaultPopup.link,
        imageDisplay: defaultPopup.imageDisplay,
        startsAt: defaultPopup.startsAt,
        endsAt: defaultPopup.endsAt,
      }),
      createdAt: defaultPopup.createdAt,
      updatedAt: defaultPopup.updatedAt,
    };

    console.log("Upserting content to Supabase Postgres...");
    await contentStore.upsertContent([...newsRows, ...researchRows, popupRow]);
    
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
