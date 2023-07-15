import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUser1689431480438 implements MigrationInterface {
  name = 'AddUser1689431480438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."user_type_enum" AS ENUM('admin', 'boss', 'user')
        `);
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "type" "public"."user_type_enum" NOT NULL DEFAULT 'user',
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying,
                "headId" integer,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_aad6df29193c5337de80be36823" FOREIGN KEY ("headId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_aad6df29193c5337de80be36823"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."user_type_enum"
        `);
  }
}
