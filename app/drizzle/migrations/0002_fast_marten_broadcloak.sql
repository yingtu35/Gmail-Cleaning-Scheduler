ALTER TABLE "task" ALTER COLUMN "form_values" TYPE json USING form_values::json;