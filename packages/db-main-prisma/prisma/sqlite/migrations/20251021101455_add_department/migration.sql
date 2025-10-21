-- CreateTable
CREATE TABLE "department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "parent_id" TEXT,
    "path" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modified_time" DATETIME,
    "created_by" TEXT NOT NULL,
    "last_modified_by" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "department_code_key" ON "department"("code");

-- CreateIndex
CREATE INDEX "department_status_idx" ON "department"("status");

-- CreateIndex
CREATE INDEX "department_parent_id_idx" ON "department"("parent_id");

-- AlterTable
ALTER TABLE "users" ADD COLUMN "primary_department_id" TEXT;
ALTER TABLE "users" ADD COLUMN "primary_department_name" TEXT;
ALTER TABLE "users" ADD COLUMN "primary_department_code" TEXT;

