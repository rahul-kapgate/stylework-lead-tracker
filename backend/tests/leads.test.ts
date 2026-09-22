import request from "supertest";

import app from "../src/app.js";
import { db } from "../src/config/database.js";

function uniqueEmail() {
  return `stylework-test-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}@example.com`;
}

async function createTestLead(name = "Test Lead") {
  const email = uniqueEmail();

  const response = await request(app).post("/api/leads").send({
    name,
    email,
    phone: "9876543210",
  });

  return {
    response,
    lead: response.body.data,
    email,
  };
}

describe("Lead APIs", () => {
  beforeAll(async () => {
    await db.query("SELECT 1");
  });

  afterEach(async () => {
    await db.query(`
      DELETE FROM leads
      WHERE email LIKE 'stylework-test-%@example.com'
    `);
  });

  afterAll(async () => {
    await db.end();
  });

  // ---------------------------------------------------------
  // CREATE SINGLE LEAD
  // ---------------------------------------------------------

  describe("POST /api/leads", () => {
    it("should create a lead", async () => {
      const email = uniqueEmail();

      const response = await request(app).post("/api/leads").send({
        name: "Rahul Test",
        email,
        phone: "9876543210",
      });

      expect(response.status).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.data).toMatchObject({
        name: "Rahul Test",
        email,
        phone: "9876543210",
        status: "NEW",
      });

      expect(response.body.data.id).toBeDefined();

      expect(response.body.data.leadJourney).toHaveLength(1);

      expect(response.body.data.leadJourney[0]).toMatchObject({
        status: "NEW",
        note: "Lead created",
      });
    });

    it("should reject an invalid email", async () => {
      const response = await request(app).post("/api/leads").send({
        name: "Test Lead",
        email: "wrong-email",
        phone: "9876543210",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);

      expect(response.body.message).toBe("Validation failed");
    });
  });

  // ---------------------------------------------------------
  // BULK CREATE
  // ---------------------------------------------------------

  describe("POST /api/leads/bulk", () => {
    it("should create multiple leads", async () => {
      const email1 = uniqueEmail();
      const email2 = uniqueEmail();
      const email3 = uniqueEmail();

      const response = await request(app)
        .post("/api/leads/bulk")
        .send({
          leads: [
            {
              name: "Lead One",
              email: email1,
              phone: "9876543211",
            },
            {
              name: "Lead Two",
              email: email2,
              phone: "9876543212",
            },
            {
              name: "Lead Three",
              email: email3,
              phone: "9876543213",
            },
          ],
        });

      expect(response.status).toBe(201);

      expect(response.body.success).toBe(true);

      expect(response.body.count).toBe(3);

      expect(response.body.data).toHaveLength(3);

      for (const lead of response.body.data) {
        expect(lead.status).toBe("NEW");

        expect(lead.leadJourney).toHaveLength(1);

        expect(lead.leadJourney[0].status).toBe("NEW");
      }
    });

    it("should reject the entire request when one lead is invalid", async () => {
      const response = await request(app)
        .post("/api/leads/bulk")
        .send({
          leads: [
            {
              name: "Lead One",
              email: uniqueEmail(),
              phone: "9876543210",
            },
            {
              name: "Lead Two",
              email: "invalid-email",
              phone: "9876543211",
            },
          ],
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject an empty leads array", async () => {
      const response = await request(app).post("/api/leads/bulk").send({
        leads: [],
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });
  });

  // ---------------------------------------------------------
  // LIST + SEARCH
  // ---------------------------------------------------------

  describe("GET /api/leads", () => {
    it("should return leads with pagination", async () => {
      await createTestLead();

      const response = await request(app).get("/api/leads");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(Array.isArray(response.body.data)).toBe(true);

      expect(response.body.pagination).toBeDefined();

      expect(response.body.pagination.page).toBe(1);
    });

    it("should search leads by email", async () => {
      const { email } = await createTestLead();

      const response = await request(app).get("/api/leads").query({
        search: email,
      });

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveLength(1);

      expect(response.body.data[0].email).toBe(email);
    });

    it("should search leads by name", async () => {
      const uniqueName = `Stylework Search ${Date.now()}`;

      await createTestLead(uniqueName);

      const response = await request(app).get("/api/leads").query({
        search: uniqueName,
      });

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveLength(1);

      expect(response.body.data[0].name).toBe(uniqueName);
    });

    it("should support pagination", async () => {
      await createTestLead();
      await createTestLead();

      const response = await request(app).get("/api/leads").query({
        page: 1,
        limit: 1,
      });

      expect(response.status).toBe(200);

      expect(response.body.data.length).toBeLessThanOrEqual(1);

      expect(response.body.pagination.limit).toBe(1);
    });
  });

  // ---------------------------------------------------------
  // SINGLE STATUS UPDATE
  // ---------------------------------------------------------

  describe("PATCH /api/leads/:id/status", () => {
    it("should update lead status", async () => {
      const { lead } = await createTestLead();

      const response = await request(app)
        .patch(`/api/leads/${lead.id}/status`)
        .send({
          status: "CONTACTED",
          note: "Customer contacted",
        });

      expect(response.status).toBe(200);

      expect(response.body.data.status).toBe("CONTACTED");

      expect(response.body.data.leadJourney).toHaveLength(2);

      const journey = response.body.data.leadJourney;

      expect(journey[journey.length - 1]).toMatchObject({
        status: "CONTACTED",
        note: "Customer contacted",
      });
    });

    it("should automatically add a journey note", async () => {
      const { lead } = await createTestLead();

      const response = await request(app)
        .patch(`/api/leads/${lead.id}/status`)
        .send({
          status: "QUALIFIED",
        });

      expect(response.status).toBe(200);

      const journey = response.body.data.leadJourney;

      expect(journey[journey.length - 1].note).toBe(
        "Lead status changed to QUALIFIED",
      );
    });

    it("should reject an invalid status", async () => {
      const { lead } = await createTestLead();

      const response = await request(app)
        .patch(`/api/leads/${lead.id}/status`)
        .send({
          status: "INVALID",
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should return 404 when lead is not found", async () => {
      const fakeId = "00000000-0000-4000-8000-000000000001";

      const response = await request(app)
        .patch(`/api/leads/${fakeId}/status`)
        .send({
          status: "CONTACTED",
        });

      expect(response.status).toBe(404);

      expect(response.body).toMatchObject({
        success: false,
        message: "Lead not found",
      });
    });
  });

  // ---------------------------------------------------------
  // BULK STATUS UPDATE
  // ---------------------------------------------------------

  describe("PATCH /api/leads/bulk/status", () => {
    it("should update multiple leads", async () => {
      const lead1 = await createTestLead("Bulk Lead One");

      const lead2 = await createTestLead("Bulk Lead Two");

      const lead3 = await createTestLead("Bulk Lead Three");

      const ids = [lead1.lead.id, lead2.lead.id, lead3.lead.id];

      const response = await request(app).patch("/api/leads/bulk/status").send({
        leadIds: ids,
        status: "CONTACTED",
        note: "Bulk outreach completed",
      });

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.count).toBe(3);

      expect(response.body.data).toHaveLength(3);

      for (const lead of response.body.data) {
        expect(lead.status).toBe("CONTACTED");

        expect(lead.leadJourney).toHaveLength(2);

        const journey = lead.leadJourney;

        expect(journey[journey.length - 1]).toMatchObject({
          status: "CONTACTED",
          note: "Bulk outreach completed",
        });
      }
    });

    it("should update all leads to QUALIFIED", async () => {
      const lead1 = await createTestLead();
      const lead2 = await createTestLead();

      const response = await request(app)
        .patch("/api/leads/bulk/status")
        .send({
          leadIds: [lead1.lead.id, lead2.lead.id],
          status: "QUALIFIED",
        });

      expect(response.status).toBe(200);

      expect(response.body.count).toBe(2);

      for (const lead of response.body.data) {
        expect(lead.status).toBe("QUALIFIED");
      }
    });

    it("should reject empty leadIds", async () => {
      const response = await request(app).patch("/api/leads/bulk/status").send({
        leadIds: [],
        status: "CONTACTED",
      });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject an invalid lead ID", async () => {
      const response = await request(app)
        .patch("/api/leads/bulk/status")
        .send({
          leadIds: ["not-a-valid-uuid"],
          status: "CONTACTED",
        });

      expect(response.status).toBe(400);

      expect(response.body.success).toBe(false);
    });

    it("should rollback when one lead does not exist", async () => {
      const lead1 = await createTestLead();
      const lead2 = await createTestLead();

      const fakeId = "00000000-0000-4000-8000-000000000001";

      const response = await request(app)
        .patch("/api/leads/bulk/status")
        .send({
          leadIds: [lead1.lead.id, lead2.lead.id, fakeId],
          status: "CONVERTED",
        });

      expect(response.status).toBe(404);

      // Verify the transaction rolled back.

      const lead1Response = await request(app).get("/api/leads").query({
        search: lead1.email,
      });

      const lead2Response = await request(app).get("/api/leads").query({
        search: lead2.email,
      });

      expect(lead1Response.body.data[0].status).toBe("NEW");

      expect(lead2Response.body.data[0].status).toBe("NEW");
    });
  });

  // ---------------------------------------------------------
  // STATUS FILTER
  // ---------------------------------------------------------

  describe("Lead status filtering", () => {
    it("should filter leads by status", async () => {
      const { lead, email } = await createTestLead();

      await request(app).patch(`/api/leads/${lead.id}/status`).send({
        status: "QUALIFIED",
      });

      const response = await request(app).get("/api/leads").query({
        search: email,
        status: "QUALIFIED",
      });

      expect(response.status).toBe(200);

      expect(response.body.data).toHaveLength(1);

      expect(response.body.data[0].status).toBe("QUALIFIED");
    });
  });
});
