// src/modules/leads/lead.repository.ts

import { db } from "../../config/database.js";
import type { LeadStatus } from "./lead.types.js";

interface CreateLeadData {
  name: string;
  email: string;
  phone: string;
}

interface ListLeadsParams {
  search?: string;
  status?: LeadStatus;
  page: number;
  limit: number;
}

export async function createLead(data: CreateLeadData) {
  const result = await db.query(
    `
      INSERT INTO leads (
        name,
        email,
        phone,
        status,
        lead_journey
      )
      VALUES (
        $1,
        $2,
        $3,
        'NEW',
        jsonb_build_array(
          jsonb_build_object(
            'status', 'NEW',
            'timestamp', NOW(),
            'note', 'Lead created'
          )
        )
      )
      RETURNING
        id,
        name,
        email,
        phone,
        status,
        lead_journey AS "leadJourney",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [data.name, data.email, data.phone],
  );

  return result.rows[0];
}

export async function getLeads(params: ListLeadsParams) {
  const { search, status, page, limit } = params;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (search) {
    values.push(`%${search}%`);

    const index = values.length;

    conditions.push(`
      (
        name ILIKE $${index}
        OR email ILIKE $${index}
        OR phone ILIKE $${index}
      )
    `);
  }

  if (status) {
    values.push(status);

    conditions.push(`status = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countResult = await db.query(
    `
      SELECT COUNT(*)::int AS total
      FROM leads
      ${whereClause}
    `,
    values,
  );

  const total = countResult.rows[0].total;

  const offset = (page - 1) * limit;

  const queryValues = [...values, limit, offset];

  const limitIndex = values.length + 1;
  const offsetIndex = values.length + 2;

  const result = await db.query(
    `
      SELECT
        id,
        name,
        email,
        phone,
        status,
        lead_journey AS "leadJourney",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM leads
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${limitIndex}
      OFFSET $${offsetIndex}
    `,
    queryValues,
  );

  return {
    leads: result.rows,
    total,
  };
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  note: string,
) {
  const result = await db.query(
    `
      UPDATE leads
      SET
        status = $2,

        lead_journey =
          lead_journey ||
          jsonb_build_array(
            jsonb_build_object(
              'status', $2,
              'timestamp', NOW(),
              'note', $3
            )
          ),

        updated_at = NOW()

      WHERE id = $1

      RETURNING
        id,
        name,
        email,
        phone,
        status,
        lead_journey AS "leadJourney",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [id, status, note],
  );

  return result.rows[0] ?? null;
}

export async function createBulkLeads(leads: CreateLeadData[]) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const createdLeads = [];

    for (const lead of leads) {
      const result = await client.query(
        `
          INSERT INTO leads (
            name,
            email,
            phone,
            status,
            lead_journey
          )
          VALUES (
            $1,
            $2,
            $3,
            'NEW',
            jsonb_build_array(
              jsonb_build_object(
                'status', 'NEW',
                'timestamp', NOW(),
                'note', 'Lead created'
              )
            )
          )
          RETURNING
            id,
            name,
            email,
            phone,
            status,
            lead_journey AS "leadJourney",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [lead.name, lead.email, lead.phone],
      );

      createdLeads.push(result.rows[0]);
    }

    await client.query("COMMIT");

    return createdLeads;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateBulkLeadStatus(
  leadIds: string[],
  status: LeadStatus,
  note: string,
) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
        UPDATE leads
        SET
          status = $2,

          lead_journey =
            lead_journey ||
            jsonb_build_array(
              jsonb_build_object(
                'status', $2,
                'timestamp', NOW(),
                'note', $3
              )
            ),

          updated_at = NOW()

        WHERE id = ANY($1::uuid[])

        RETURNING
          id,
          name,
          email,
          phone,
          status,
          lead_journey AS "leadJourney",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
      `,
      [leadIds, status, note],
    );

    if (result.rows.length !== leadIds.length) {
      await client.query("ROLLBACK");

      return null;
    }

    await client.query("COMMIT");

    return result.rows;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
