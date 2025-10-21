-- CreateTable
CREATE TABLE "department" (
    "id" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "parent_id" VARCHAR,
    "path" VARCHAR,
    "level" INTEGER NOT NULL DEFAULT 1,
    "description" VARCHAR,
    "status" VARCHAR NOT NULL DEFAULT 'active',
    "created_time" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" TIMESTAMP,
    "created_by" VARCHAR NOT NULL,
    "last_modified_by" VARCHAR,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "department_code_key" ON "department"("code");

-- CreateIndex
CREATE INDEX "department_status_idx" ON "department"("status");

-- CreateIndex
CREATE INDEX "department_parent_id_idx" ON "department"("parent_id");

-- AlterTable
ALTER TABLE "users" ADD COLUMN "primary_department_id" VARCHAR;
ALTER TABLE "users" ADD COLUMN "primary_department_name" VARCHAR;
ALTER TABLE "users" ADD COLUMN "primary_department_code" VARCHAR;

