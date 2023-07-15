import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserTypeToRole1689435619935 implements MigrationInterface {
  name = 'ChangeUserTypeToRole1689435619935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
                RENAME COLUMN "type" TO "role"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."user_type_enum"
            RENAME TO "user_role_enum"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TYPE "public"."user_role_enum"
            RENAME TO "user_type_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
                RENAME COLUMN "role" TO "type"
        `);
  }
}
