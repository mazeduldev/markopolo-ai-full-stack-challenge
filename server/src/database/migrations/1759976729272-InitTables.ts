import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTables1759976729272 implements MigrationInterface {
  name = 'InitTables1759976729272';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "secret_id" uuid NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "store_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_11e1d122cae6c5f1f000bd9587" UNIQUE ("secret_id"), CONSTRAINT "REL_98a52595c9031d60f5c8d280ca" UNIQUE ("store_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "name" character varying(255) NOT NULL, "url" character varying(255), "currency" character varying(10) NOT NULL DEFAULT 'USD', "timezone" character varying(50) NOT NULL DEFAULT 'UTC', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "website_analytics_summaries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "store_id" uuid NOT NULL, "traffic_summary" jsonb NOT NULL, "top_pages" jsonb NOT NULL, "user_demographics" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_22673ae049a8564005f2d88c37c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "shopify_summaries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "store_id" uuid NOT NULL, "products" jsonb NOT NULL, "orders_summary" jsonb NOT NULL, "customers_summary" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fba2c1d5269f1dbc72a5b0bd0dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "google_ads_summaries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "store_id" uuid NOT NULL, "campaigns" jsonb NOT NULL, "top_keywords" jsonb NOT NULL, "ads" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_19403c8c08833a4bf78baa943be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."data_source_connections_type_enum" AS ENUM('shopify', 'google_ads', 'website_analytics')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."data_source_connections_status_enum" AS ENUM('connected', 'disconnected', 'error', 'pending')`,
    );
    await queryRunner.query(
      `CREATE TABLE "data_source_connections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."data_source_connections_type_enum" NOT NULL, "status" "public"."data_source_connections_status_enum" NOT NULL DEFAULT 'connected', "credentials" jsonb, "config" jsonb, "last_synced_at" TIMESTAMP, "error_message" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_e958372bd9989393dd20aaa1f48" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_threads" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_973a81c0adb9b18a5ea3ef95bf8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_27b88e9972a070c0450528bdbe" ON "chat_threads" ("user_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."chat_messages_role_enum" AS ENUM('user', 'assistant', 'system')`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."chat_messages_role_enum" NOT NULL, "content" text NOT NULL, "campaign_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "thread_id" uuid NOT NULL, CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd2116a2c1e922ce20984b8e7e" ON "chat_messages" ("thread_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campaigns_channels_enum" AS ENUM('email', 'sms', 'push', 'whatsapp')`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaigns" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "campaign_title" character varying(255) NOT NULL, "target_audience" text NOT NULL, "message" jsonb NOT NULL, "channels" "public"."campaigns_channels_enum" array NOT NULL, "timeline" jsonb NOT NULL, "budget" character varying(100) NOT NULL, "expected_metrics" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_831e3fcd4fc45b4e4c3f57a9ee4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0392d64d40eed77612627c93da" ON "campaigns" ("user_id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "secrets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password_hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d4ff48ddba1883d4dc142b9c697" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_11e1d122cae6c5f1f000bd95877" FOREIGN KEY ("secret_id") REFERENCES "secrets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_98a52595c9031d60f5c8d280ca4" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "website_analytics_summaries" ADD CONSTRAINT "FK_b6801289d30ce62390af48cfa23" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shopify_summaries" ADD CONSTRAINT "FK_60c02098b117a52def6e5a04914" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "google_ads_summaries" ADD CONSTRAINT "FK_34ad97a3c031741e9b5fd9518d6" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_source_connections" ADD CONSTRAINT "FK_b9fd6d2a2fd8d44c0fd93949e69" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_threads" ADD CONSTRAINT "FK_093072e9060bf3b8fddd2fcd6e4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_0b7e57fe586503d477a8d5adaed" FOREIGN KEY ("thread_id") REFERENCES "chat_threads"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ADD CONSTRAINT "FK_45455b21195721407322ddce007" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "campaigns" DROP CONSTRAINT "FK_45455b21195721407322ddce007"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_0b7e57fe586503d477a8d5adaed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_threads" DROP CONSTRAINT "FK_093072e9060bf3b8fddd2fcd6e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "data_source_connections" DROP CONSTRAINT "FK_b9fd6d2a2fd8d44c0fd93949e69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "google_ads_summaries" DROP CONSTRAINT "FK_34ad97a3c031741e9b5fd9518d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shopify_summaries" DROP CONSTRAINT "FK_60c02098b117a52def6e5a04914"`,
    );
    await queryRunner.query(
      `ALTER TABLE "website_analytics_summaries" DROP CONSTRAINT "FK_b6801289d30ce62390af48cfa23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_98a52595c9031d60f5c8d280ca4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_11e1d122cae6c5f1f000bd95877"`,
    );
    await queryRunner.query(`DROP TABLE "secrets"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0392d64d40eed77612627c93da"`,
    );
    await queryRunner.query(`DROP TABLE "campaigns"`);
    await queryRunner.query(`DROP TYPE "public"."campaigns_channels_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd2116a2c1e922ce20984b8e7e"`,
    );
    await queryRunner.query(`DROP TABLE "chat_messages"`);
    await queryRunner.query(`DROP TYPE "public"."chat_messages_role_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_27b88e9972a070c0450528bdbe"`,
    );
    await queryRunner.query(`DROP TABLE "chat_threads"`);
    await queryRunner.query(`DROP TABLE "data_source_connections"`);
    await queryRunner.query(
      `DROP TYPE "public"."data_source_connections_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."data_source_connections_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "google_ads_summaries"`);
    await queryRunner.query(`DROP TABLE "shopify_summaries"`);
    await queryRunner.query(`DROP TABLE "website_analytics_summaries"`);
    await queryRunner.query(`DROP TABLE "stores"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
